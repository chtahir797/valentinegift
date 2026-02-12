"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface InteractiveButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  className?: string;
}

export default function InteractiveButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
}: InteractiveButtonProps) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden rounded-full px-10 py-4 text-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
        variant === "primary"
          ? "bg-rose-500 text-white shadow-2xl hover:shadow-rose-500/50"
          : "border-4 border-rose-200 bg-white/50 text-rose-400 backdrop-blur-sm hover:bg-rose-100"
      } ${className}`}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-full"
        initial={{ scale: 0, opacity: 1 }}
        whileTap={{ scale: 4, opacity: 0 }}
        transition={{ duration: 0.4 }}
      />
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}

