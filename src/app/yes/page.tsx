"use client";

import { motion } from "framer-motion";
import { Gift, Heart, Sparkles, ArrowRight, Stars, Lock, Unlock } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

import ParticleExplosion from "../components/ParticleExplosion";
import RejectionBlock from "../components/RejectionBlock";
import { hasRejected } from "../utils/auth";

const gifts = [
  {
    title: "Gift 1: Garden of Love",
    description: "A beautiful rose garden filled with our memories.",
    icon: "🌹",
    path: "/gift1",
    color: "bg-rose-500"
  },
  {
    title: "Gift 2: Love Letter",
    description: "Heartfelt words just for you.",
    icon: "💌",
    path: "/gift2",
    color: "bg-pink-500"
  },
  {
    title: "Gift 3: Our Melody",
    description: "The song that reminds me of us.",
    icon: "🎶",
    path: "/gift3",
    color: "bg-purple-500"
  }
];

export default function YesPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [unlockedGifts, setUnlockedGifts] = useState<Set<number>>(new Set());
  const [hoveredGift, setHoveredGift] = useState<number | null>(null);
  const [showExplosion, setShowExplosion] = useState(false);
  const hoverTimersRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get names and tag lines from environment variables
  const yourName = process.env.NEXT_PUBLIC_YOUR_NAME || "Arslan";
  const yesTagLines = process.env.NEXT_PUBLIC_YES_PAGE_TAGLINE?.split("|||") || [
    "has some special surprises waiting for you below...",
    "Let the celebration begin!"
  ];

  useEffect(() => {
    setMounted(true);
    
    // Check if user rejected
    if (hasRejected()) {
      return;
    }
    setShowExplosion(true);
    
    // Initial burst
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => {
      clearInterval(interval);
      // Cleanup all timers
      hoverTimersRef.current.forEach(timer => clearTimeout(timer));
      hoverTimersRef.current.clear();
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  const handleGiftHover = (index: number) => {
    setHoveredGift(index);
    if (!unlockedGifts.has(index)) {
      // Clear any existing timer for this index
      const existingTimer = hoverTimersRef.current.get(index);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }
      // Set new timer
      const timer = setTimeout(() => {
        if (mounted) {
          setUnlockedGifts(prev => new Set(prev).add(index));
        }
        hoverTimersRef.current.delete(index);
      }, 300);
      hoverTimersRef.current.set(index, timer);
    }
  };

  const handleGiftClick = (path: string, index: number) => {
    if (!unlockedGifts.has(index)) {
      setUnlockedGifts(prev => new Set(prev).add(index));
      // Clear any existing timer
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
      clickTimerRef.current = setTimeout(() => {
        if (mounted) {
          router.push(path);
        }
      }, 500);
    } else {
      router.push(path);
    }
  };

  if (!mounted) return null;

  // Show rejection block if user selected "No"
  if (hasRejected()) {
    return <RejectionBlock />;
  }

  return (
    <div className="relative min-h-screen bg-rose-50 px-4 py-20 bg-grid-rose overflow-x-hidden">
      {/* <ProgressTracker currentStep={0} /> */}
      <ParticleExplosion trigger={showExplosion} />
      
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 text-yellow-400 opacity-50"
            >
              <Stars size={80} />
            </motion.div>
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-2xl">
              <Heart fill="#f43f5e" className="text-rose-500" size={64} />
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-5xl font-black text-rose-600 lg:text-7xl"
        >
          YAY!! You're my Valentine! ❤️
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16 text-2xl font-medium text-rose-400"
        >
          {yourName} {yesTagLines[0] || "has some special surprises waiting for you below..."}
        </motion.p>

        {/* Gift Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {gifts.map((gift, index) => {
            const isUnlocked = unlockedGifts.has(index);
            const isHovered = hoveredGift === index;
            
            return (
              <motion.div
                key={gift.path}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: isUnlocked ? 1 : 0.95,
                  rotate: isHovered && !isUnlocked ? [0, -5, 5, -5, 0] : 0
                }}
                transition={{ 
                  delay: 0.4 + index * 0.1,
                  rotate: { duration: 0.5 }
                }}
                whileHover={{ y: -10, scale: 1.05 }}
                onHoverStart={() => handleGiftHover(index)}
                onClick={() => handleGiftClick(gift.path, index)}
                className={`group relative cursor-pointer rounded-[2.5rem] p-8 shadow-xl transition-all overflow-hidden ${
                  isUnlocked 
                    ? "bg-white hover:shadow-rose-200/50" 
                    : "bg-gradient-to-br from-gray-100 to-gray-200 hover:shadow-gray-300/50"
                }`}
              >
                {/* Lock overlay */}
                {!isUnlocked && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isHovered ? 0.3 : 1 }}
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10"
                  >
                    <motion.div
                      animate={{ 
                        scale: isHovered ? [1, 1.2, 1] : 1,
                        rotate: isHovered ? [0, 10, -10, 0] : 0
                      }}
                      transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
                    >
                      <Lock className="text-white w-12 h-12" />
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: isHovered ? 1 : 0, y: 0 }}
                      className="absolute bottom-4 text-white font-bold text-sm"
                    >
                      Hover to unlock! ✨
                    </motion.p>
                  </motion.div>
                )}
                
                {/* Unlock animation */}
                {isUnlocked && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-4 right-4 z-20"
                  >
                    <Unlock className="text-green-500 w-6 h-6" />
                  </motion.div>
                )}
                
                <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl ${gift.color} text-4xl text-white shadow-lg shadow-rose-200/50 transition-transform group-hover:rotate-12 relative z-0`}>
                  {gift.icon}
                  {isUnlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 rounded-2xl bg-white/30"
                    />
                  )}
                </div>
                <h3 className={`mb-3 text-2xl font-bold transition-colors ${
                  isUnlocked ? "text-gray-800" : "text-gray-400"
                }`}>
                  {gift.title}
                </h3>
                <p className={`mb-6 leading-relaxed transition-colors ${
                  isUnlocked ? "text-gray-500" : "text-gray-400"
                }`}>
                  {gift.description}
                </p>
                <div className={`flex items-center justify-center font-bold transition-all ${
                  isUnlocked 
                    ? "text-rose-500 group-hover:gap-2" 
                    : "text-gray-400"
                }`}>
                  {isUnlocked ? (
                    <>
                      Open Gift <ArrowRight size={20} className="ml-2" />
                    </>
                  ) : (
                    <>
                      Locked <Lock size={20} className="ml-2" />
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 flex flex-col items-center"
        >
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.2, 1], 
                  y: [0, -5, 0],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 0.5, 
                  delay: i * 0.1, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart fill="#f43f5e" className="text-rose-500 h-6 w-6" />
              </motion.div>
            ))}
          </div>
          <motion.p 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-4 text-lg font-bold text-rose-300"
          >
            {yesTagLines[1] || "Let the celebration begin!"}
          </motion.p>
          {/* Creative Sparkle Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            className="mt-2 flex gap-1"
          >
            {[...Array(3)].map((_, i) => (
              <motion.span
                key={i}
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.3, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: i * 0.2 
                }}
                className="text-yellow-300"
              >
                ✨
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Dynamic Hearts Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "vw", 
              y: "110vh",
              opacity: Math.random() * 0.5 + 0.5,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: "-10vh",
              transition: { 
                duration: Math.random() * 10 + 10, 
                repeat: Infinity,
                delay: Math.random() * 5
              }
            }}
            className="absolute text-rose-200"
          >
            <Heart fill="currentColor" size={Math.random() * 40 + 20} />
          </motion.div>
        ))}
        </div>
    </div>
  );
}
