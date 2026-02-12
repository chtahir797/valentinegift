"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

interface ParticleExplosionProps {
  trigger: boolean;
  colors?: string[];
  particleCount?: number;
}

const DEFAULT_COLORS = ["#f43f5e", "#ec4899", "#a855f7", "#8b5cf6", "#fbbf24"];

export default function ParticleExplosion({
  trigger,
  colors = DEFAULT_COLORS,
  particleCount = 50,
}: ParticleExplosionProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const hasTriggered = useRef(false);
  const previousTrigger = useRef(false);

  useEffect(() => {
    // Only trigger when trigger changes from false to true
    if (trigger && !previousTrigger.current) {
      hasTriggered.current = true;
      const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
        id: Date.now() + i, // Use timestamp + index for unique IDs
        x: 50, // Center of screen
        y: 50,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
      }));

      setParticles(newParticles);

      // Remove particles after animation
      const timeoutId = setTimeout(() => {
        setParticles([]);
        hasTriggered.current = false;
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
    
    // Update previous trigger value
    previousTrigger.current = trigger;
  }, [trigger, particleCount]); // Removed colors from dependencies

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            x: `${particle.x + particle.vx}vw`,
            y: `${particle.y + particle.vy}vh`,
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration: 2,
            ease: "easeOut",
          }}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
        />
      ))}
    </div>
  );
}

