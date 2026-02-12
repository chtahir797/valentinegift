"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState, ReactNode, useEffect, useRef } from "react";

interface ClickHeartsProps {
  children: ReactNode;
  className?: string;
}

export default function ClickHearts({ children, className = "" }: ClickHeartsProps) {
  const [clickHearts, setClickHearts] = useState<Array<{ id: string; x: number; y: number }>>([]);
  const [mounted, setMounted] = useState(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    setMounted(true);
    return () => {
      // Cleanup all timers on unmount
      timersRef.current.forEach(timer => clearTimeout(timer));
      timersRef.current = [];
    };
  }, []);

  const handlePageClick = () => {
    // Get click position relative to the container usually, but here we want screen/window coordinates logic mostly.
    // However, keeping it simple:
    
    // We want to verify we are not clicking an interactive element that stopped propagation? 
    // React events bubble. If a button handles it and calls stopPropagation, we won't see it here.
    // If it doesn't stop prop, we see it.
    
    // Logic from original page.tsx
    const baseTimestamp = Date.now();
    const padding = 50;
    // We use window dimensions for boundaries if available, or just fallback
    const width = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const height = typeof window !== 'undefined' ? window.innerHeight : 800;
    const heartSize = 30;

    for (let i = 0; i < 3; i++) {
      const timer1 = setTimeout(() => {
        if (!mounted) return;
        
        // Generate random position within screen boundaries
        // OR use the click position? The original code used random positions! 
        // "Create multiple hearts at random positions within screen bounds" - line 121 of page.tsx
        // Wait, line 121 says "at random positions". It ignores `e.clientX/Y`. interesting.
        
        const x = Math.random() * (width - heartSize - padding * 2) + padding;
        const y = Math.random() * (height - heartSize - padding * 2) + padding;
        
        const newHeart = {
          id: `heart-${baseTimestamp}-${i}-${Math.random().toString(36).substr(2, 9)}`,
          x,
          y,
        };
        
        setClickHearts(prev => [...prev, newHeart]);
        
        // Remove heart after animation
        const timer2 = setTimeout(() => {
          if (mounted) {
            setClickHearts(prev => prev.filter(h => h.id !== newHeart.id));
          }
        }, 2000);
        timersRef.current.push(timer2);
      }, i * 100);
      timersRef.current.push(timer1);
    }
  };

  return (
    <div 
      className={`relative flex min-h-screen items-center justify-center overflow-hidden cursor-pointer ${className}`}
      onClick={handlePageClick}
    >
      {children}
      
      {/* Click hearts rendering */}
      {clickHearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute pointer-events-none"
          initial={{
            x: heart.x,
            y: heart.y,
            scale: 0,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            y: heart.y - 100,
            x: heart.x + (Math.random() - 0.5) * 50,
            scale: [0, 1.5, 0],
            opacity: [1, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            ease: "easeOut",
          }}
        >
          <Heart fill="#ff315c" size={30} />
        </motion.div>
      ))}
    </div>
  );
}
