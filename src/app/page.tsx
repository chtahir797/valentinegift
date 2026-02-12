"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, Timer, XCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import AntigravityHearts from "../components/AntigravityHearts";
import ClickHearts from "../components/ClickHearts";
import InteractiveButton from "./components/InteractiveButton";
import ParticleExplosion from "./components/ParticleExplosion";
import { 
  setLockout, 
  getLockoutRemaining, 
  formatLockoutTime,
  clearLockout,
  setUserChoice,
  clearUserChoice,
  setYesLockout,
  getYesLockoutRemaining,
  isNoButtonDisabled
} from "./utils/auth";

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [hoverCount, setHoverCount] = useState(0);
  const [noButtonDisabled, setNoButtonDisabled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const yesTimerRef = useRef<NodeJS.Timeout | null>(null);
  const loverName = process.env.NEXT_PUBLIC_LOVER_NAME || "Emaan";
  const yourName = process.env.NEXT_PUBLIC_YOUR_NAME || "Arslan";
  const homeTagLines = process.env.NEXT_PUBLIC_HOME_TAGLINE?.split("|||") || [
    "I've put my heart into some surprises for you... ✨",
    "You're going to love this! 💕",
    "Curious much? 😊"
  ];

  useEffect(() => {
    setMounted(true);
    
    // Check lockout status on mount
    const remaining = getLockoutRemaining();
    if (remaining > 0) {
      setLockoutTime(remaining);
    }

    // Check if "No" button should be disabled (if "Yes" was clicked)
    const yesLockoutRemaining = getYesLockoutRemaining();
    if (yesLockoutRemaining > 0) {
      setNoButtonDisabled(true);
    }

    return () => {
      // Cleanup timer on unmount
      if (yesTimerRef.current) {
        clearTimeout(yesTimerRef.current);
      }
    };
  }, []);

  // Live Countdown Effect for "No" lockout
  const isActive = lockoutTime > 0;
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const remaining = getLockoutRemaining();
      setLockoutTime(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, lockoutTime]);

  // Live countdown for "Yes" lockout (disabling "No" button)
  useEffect(() => {
    if (!noButtonDisabled) return;

    const interval = setInterval(() => {
      const remaining = getYesLockoutRemaining();
      if (remaining > 0) {
        setNoButtonDisabled(true);
      } else {
        setNoButtonDisabled(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [noButtonDisabled]);

  const handleYes = () => {
    // If user says YES, clear any existing lockout (allow repeated access)
    clearLockout();
    setUserChoice("yes");
    // Set 8-hour lockout for "No" button
    setYesLockout();
    setNoButtonDisabled(true);
    setShowParticles(true);
    // Clear any existing timer
    if (yesTimerRef.current) {
      clearTimeout(yesTimerRef.current);
    }
    yesTimerRef.current = setTimeout(() => {
      if (mounted) {
        router.push("/yes");
      }
    }, 500);
  };

  const handleNo = async () => {
    setIsSubmitting(true);
    try {
      // Send notification to owner
      await fetch("/api/notify", { method: "POST" });
      
      // Set 8-hour lockout locally only if they say NO
      setLockout();
      setUserChoice("no");
      setLockoutTime(getLockoutRemaining());
      setTimeout(() => {
        router.push("/no");
      }, 500);
    } catch (error) {
      console.error("Failed to send notification", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  // 1. Lockout Screen
  if (lockoutTime > 0) {
  return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-rose-50 bg-grid-rose p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass relative z-10 w-full max-w-md rounded-[2.5rem] p-10 text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-rose-500">
            <Timer size={40} className="animate-pulse" />
          </div>
          <h2 className="mb-4 text-3xl font-black text-rose-600">Response Recorded</h2>
          <p className="mb-8 text-rose-400 font-medium leading-relaxed">
            You&apos;ve already submitted your response. To keep things special, you can&apos;t vote again for 8 hours.
          </p>
          <div className="rounded-2xl bg-rose-500 p-6 text-white shadow-lg">
            <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-1">Unlocks in</p>
            <p className="text-4xl font-black tracking-tighter">
              {formatLockoutTime(lockoutTime)}
            </p>
          </div>
          <p className="mt-8 text-xs font-bold text-rose-300">
            Patience is a virtue of love... ❤️
          </p>
        </motion.div>
      </div>
    );
  }

  // 3. Main Proposal Screen
  return (
    <div 
      ref={containerRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-rose-50 bg-grid-rose"
    >
      <AntigravityHearts />
      <ClickHearts>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass relative z-10 w-[90%] max-w-xl rounded-[2.5rem] p-12 text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-rose-500 text-white shadow-xl"
          >
            <Heart fill="currentColor" size={48} />
          </motion.div>

          <h1 className="mb-4 text-4xl font-black tracking-tight text-rose-600 lg:text-5xl">
            {loverName}, Will You Be My Valentine?
          </h1>
          
          <p className="mb-10 text-lg font-medium text-rose-400">
            {homeTagLines[0] || "I've put my heart into some surprises for you... ✨"}
          </p>

          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <motion.div
              onHoverStart={() => setHoverCount(prev => prev + 1)}
              className="relative"
            >
              <InteractiveButton
                onClick={handleYes}
                disabled={isSubmitting}
                variant="primary"
              >
                Yes, I will! <Sparkles className="h-5 w-5" />
              </InteractiveButton>
              {hoverCount > 0 && hoverCount % 3 === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm font-bold text-rose-500 bg-white px-3 py-1 rounded-full shadow-lg"
                >
                  {homeTagLines[1] || "You're going to love this! 💕"}
                </motion.div>
              )}
            </motion.div>

            <InteractiveButton
              onClick={handleNo}
              disabled={isSubmitting || noButtonDisabled}
              variant="secondary"
            >
              {isSubmitting ? (
                <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-rose-400" />
              ) : noButtonDisabled ? (
                <div className="flex items-center gap-2">
                  <Timer size={18} className="text-rose-300" />
                  <span className="text-sm">Disabled for {formatLockoutTime(getYesLockoutRemaining())}</span>
                </div>
              ) : (
                <>No <XCircle size={20} className="text-rose-300" /></>
              )}
            </InteractiveButton>
      </div>

          {/* Engagement Counter with Creative Messages */}
          {hoverCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 text-sm text-rose-400 font-medium"
            >
              <motion.span
                key={hoverCount}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                💝 You&apos;ve hovered {hoverCount} time{hoverCount !== 1 ? 's' : ''} - {homeTagLines[2] || "curious much? 😊"}
              </motion.span>
              {hoverCount >= 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs text-rose-300"
                >
                  ✨ Your curiosity is adorable! Keep exploring... 💕
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </ClickHearts>

      {/* Decorative Floating Elements */}
      <div className="absolute top-10 right-10 animate-float opacity-30">
        <Sparkles className="h-12 w-12 text-rose-400" />
      </div>
      <div className="absolute bottom-10 left-10 animate-float-delayed opacity-30">
        <Heart className="h-16 w-16 text-rose-400" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 text-sm font-bold text-rose-300"
      >
        From {yourName} with Love 💌
      </motion.div>
      
      {/* Particle Explosion */}
      <ParticleExplosion trigger={showParticles} />
    </div>
  );
}
