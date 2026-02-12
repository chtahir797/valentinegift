"use client";

import { motion } from "framer-motion";
import { Heart, Gift, Mail, Music, Check } from "lucide-react";
import { useEffect, useState } from "react";

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps?: number;
}

const steps = [
  { id: 0, name: "Proposal", icon: Heart, path: "/" },
  { id: 1, name: "Gift 1", icon: Gift, path: "/gift1" },
  { id: 2, name: "Gift 2", icon: Mail, path: "/gift2" },
  { id: 3, name: "Gift 3", icon: Music, path: "/gift3" },
];

export default function ProgressTracker({ currentStep, totalSteps = 4 }: ProgressTrackerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3 shadow-2xl">
        <div className="flex items-center gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={step.id} className="flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isCurrent
                      ? "bg-rose-500 text-white scale-110"
                      : "bg-white/20 text-gray-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={20} />
                  ) : (
                    <Icon size={20} />
                  )}
                  {isCurrent && (
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-rose-500 opacity-30"
                    />
                  )}
                </motion.div>
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className={`w-8 h-0.5 mx-2 ${
                      isCompleted ? "bg-green-500" : "bg-white/20"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

