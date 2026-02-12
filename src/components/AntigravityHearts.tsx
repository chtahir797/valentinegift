"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

interface AntigravityHeartsProps {
  count?: number;
}

export default function AntigravityHearts({ count = 15 }: AntigravityHeartsProps) {
  const [heartConfigs, setHeartConfigs] = useState<Array<{
    x: number;
    y: number;
    duration: number;
    delay: number;
    size: number;
  }>>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeartConfigs(
        [...Array(count)].map(() => ({
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 50,
          duration: Math.random() * 10 + 10,
          delay: Math.random() * 5,
          size: Math.random() * 30 + 20,
        }))
      );
    }
  }, [count]);

  if (heartConfigs.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {heartConfigs.map((config, i) => (
        <motion.div
          key={i}
          className="absolute text-pink-300/30"
          initial={{ 
            x: config.x,
            y: config.y
          }}
          animate={{
            y: -100,
            x: config.x,
          }}
          transition={{
            duration: config.duration,
            repeat: Infinity,
            ease: "linear",
            delay: config.delay,
          }}
        >
          <Heart fill="currentColor" size={config.size} />
        </motion.div>
      ))}
    </div>
  );
}
