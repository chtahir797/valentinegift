"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lock, ShieldAlert, ArrowRight, Heart } from "lucide-react";
import { useState, useEffect, ReactNode } from "react";
import { isSiteUnlocked, unlockSite, isPasswordProtectionEnabled } from "@/app/utils/auth";
import AntigravityHearts from "./AntigravityHearts";

interface AppGuardianProps {
  children: ReactNode;
}

export default function AppGuardian({ children }: AppGuardianProps) {
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const loverName = process.env.NEXT_PUBLIC_LOVER_NAME || "Emaan";

  useEffect(() => {
    setMounted(true);
    // Only check lock status if password protection is enabled
    if (isPasswordProtectionEnabled()) {
      setIsLocked(!isSiteUnlocked());
    } else {
      setIsLocked(false);
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockSite(password)) {
      setIsLocked(false);
      setPassError(false);
    } else {
      setPassError(true);
      setTimeout(() => setPassError(false), 2000);
    }
  };

  if (!mounted) return null;

  // If password protection is disabled, skip the lock screen
  if (!isPasswordProtectionEnabled()) {
    return <>{children}</>;
  }

  if (isLocked) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-rose-50 bg-grid-rose p-4 font-sans antialiased text-rose-900">
        <AntigravityHearts />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass relative z-10 w-full max-w-md rounded-[2.5rem] p-12 text-center"
        >
          <motion.div
            animate={passError ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className={`mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl ${passError ? 'bg-red-500 shadow-red-200' : 'bg-rose-500 shadow-rose-200'} text-white shadow-2xl transition-all`}
          >
            {passError ? <ShieldAlert size={48} /> : <Lock size={48} />}
          </motion.div>

          <h1 className="mb-2 text-3xl font-black tracking-tight text-rose-600">Password Required</h1>
          <p className="mb-8 text-rose-400 font-medium italic">
            "Unlock my heart with the secret code..."
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className={`w-full rounded-2xl border-2 ${passError ? 'border-red-400' : 'border-rose-200'} bg-white/50 p-5 text-center text-xl font-bold text-rose-600 backdrop-blur-sm transition-all focus:border-rose-400 focus:outline-none focus:ring-4 focus:ring-rose-200/50`}
                autoFocus
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 p-5 text-xl font-black text-white shadow-[0_10px_20px_-5px_rgba(244,63,94,0.4)] transition-all hover:from-rose-600 hover:to-rose-700 active:shadow-inner"
            >
              Unlock <ArrowRight size={24} />
            </motion.button>
          </form>

          {passError && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 font-bold text-red-500"
            >
              Access Denied. Try again, lover. ❤️
            </motion.p>
          )}

          <div className="mt-8 flex items-center justify-center gap-2 opacity-30">
            <Heart size={12} fill="currentColor" />
            <Heart size={16} fill="currentColor" />
            <Heart size={12} fill="currentColor" />
          </div>
        </motion.div>
        
        <p className="mt-8 text-sm font-bold tracking-widest text-rose-300 uppercase">
          Private Entrance for {loverName} Only 💌
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
