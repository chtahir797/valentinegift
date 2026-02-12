"use client";

const PASS_KEY = "valentine_unlocked";
const LOCKOUT_KEY = "valentine_lockout_time";
const YES_LOCKOUT_KEY = "valentine_yes_lockout_time";
const USER_CHOICE_KEY = "valentine_user_choice";
const LOCKOUT_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
const SITE_PASSWORD = process.env.NEXT_PUBLIC_SITE_PASSWORD || "love2026";
const PROTECT_APP = process.env.NEXT_PUBLIC_PROTECT_APP === "true";

export const isPasswordProtectionEnabled = (): boolean => {
  return PROTECT_APP;
};

export const isSiteUnlocked = (): boolean => {
  if (typeof window === "undefined") return !PROTECT_APP;
  // If password protection is disabled, always return true
  if (!PROTECT_APP) return true;
  return localStorage.getItem(PASS_KEY) === "true";
};

export const unlockSite = (password: string): boolean => {
  if (!PROTECT_APP) return true; // If protection is disabled, always unlock
  if (password === SITE_PASSWORD) {
    localStorage.setItem(PASS_KEY, "true");
    return true;
  }
  return false;
};

export const setLockout = () => {
  if (typeof window === "undefined") return;
  const now = Date.now();
  localStorage.setItem(LOCKOUT_KEY, now.toString());
};

export const getLockoutRemaining = (): number => {
  if (typeof window === "undefined") return 0;
  const lockTime = localStorage.getItem(LOCKOUT_KEY);
  if (!lockTime) return 0;
  
  const now = Date.now();
  const elapsed = now - parseInt(lockTime);
  const remaining = LOCKOUT_DURATION - elapsed;
  
  return remaining > 0 ? remaining : 0;
};

export const formatLockoutTime = (ms: number): string => {
  const hours = Math.floor(ms / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((ms % (60 * 1000)) / 1000);
  
  return `${hours}h ${minutes}m ${seconds}s`;
};
export const clearLockout = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOCKOUT_KEY);
};

export const setUserChoice = (choice: "yes" | "no") => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_CHOICE_KEY, choice);
};

export const getUserChoice = (): "yes" | "no" | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_CHOICE_KEY) as "yes" | "no" | null;
};

export const hasRejected = (): boolean => {
  return getUserChoice() === "no";
};

export const clearUserChoice = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_CHOICE_KEY);
};

// Functions for "Yes" lockout (disabling "No" button after "Yes" is clicked)
export const setYesLockout = () => {
  if (typeof window === "undefined") return;
  const now = Date.now();
  localStorage.setItem(YES_LOCKOUT_KEY, now.toString());
};

export const getYesLockoutRemaining = (): number => {
  if (typeof window === "undefined") return 0;
  const lockTime = localStorage.getItem(YES_LOCKOUT_KEY);
  if (!lockTime) return 0;
  
  const now = Date.now();
  const elapsed = now - parseInt(lockTime);
  const remaining = LOCKOUT_DURATION - elapsed;
  
  return remaining > 0 ? remaining : 0;
};

export const clearYesLockout = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(YES_LOCKOUT_KEY);
};

export const isNoButtonDisabled = (): boolean => {
  return getYesLockoutRemaining() > 0;
};
