"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Eye } from "lucide-react";

interface BlurRevealImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function BlurRevealImage({ 
  src, 
  alt, 
  className = "",
  width = 400,
  height = 300 
}: BlurRevealImageProps) {
  const [isRevealed, setIsRevealed] = useState(true);

  return (
    <div 
      className={`relative overflow-hidden cursor-pointer group ${className}`}
      onClick={() => setIsRevealed(!isRevealed)}
    >
      <motion.div
        animate={{ filter: isRevealed ? "blur(0px)" : "blur(20px)" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="w-full h-full relative"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </motion.div>

      <AnimatePresence>
        {!isRevealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 text-white pointer-events-none"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-white/20 backdrop-blur-sm p-4 rounded-full border border-white/30 shadow-lg"
            >
              <Eye size={32} />
            </motion.div>
            <p className="mt-4 font-semibold text-lg drop-shadow-md">Tap to Reveal</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Decorative overlay when revealed */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"
          >
            <p className="text-white text-sm font-light italic">Captured Memory ✨</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
