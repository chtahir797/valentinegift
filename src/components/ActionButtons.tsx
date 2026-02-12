"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

const NO_BUTTON_TEXTS = [
  "No",
  "Are you sure?",
  "Really?",
  "Think again!",
  "Please reconsider",
  "Don't do this",
  "You'll miss out!",
  "Last chance!",
  "Pretty please?",
  "I'm begging you!"
];

export default function ActionButtons() {
    const router = useRouter();
    const [noHovered, setNoHovered] = useState(false);
    const [noClickCount, setNoClickCount] = useState(0);
    const [yesClicked, setYesClicked] = useState(false);

    const handleYesClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Stop propagation to prevent triggering background hearts if any
        setYesClicked(true);
        
        // Confetti explosion
        const duration = 3000;
        const end = Date.now() + duration;

        const interval = setInterval(() => {
            if (Date.now() > end) {
                clearInterval(interval);
                return;
            }

            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0.5, y: 0.8 },
                colors: ['#ff315c', '#ff7a9f', '#ffd6e7', '#ffcfe4']
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 0.5, y: 0.8 },
                colors: ['#ff315c', '#ff7a9f', '#ffd6e7', '#ffcfe4']
            });
        }, 200);

        // Navigate after a short delay
        setTimeout(() => {
            router.push("/yes");
        }, 500);
    };

    const handleNoHover = () => {
        setNoHovered(true);
        setNoClickCount(prev => prev + 1);
    };

    const handleNoLeave = () => {
        setNoHovered(false);
    };

    const handleNoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push("/no");
    };

    return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-6 sm:flex-row sm:justify-center items-center relative"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <button
              onClick={handleYesClick}
              disabled={yesClicked}
              className="flex items-center gap-2 px-12 py-4 bg-pink-500 text-white text-xl font-semibold rounded-full shadow-lg hover:bg-pink-600 transition-colors duration-200 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart fill="white" size={24} />
              </motion.div>
              <span>Yes!</span>
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
              {yesClicked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 1] }}
                  className="absolute inset-0 bg-white/30 rounded-full"
                />
              )}
            </button>
          </motion.div>

          <motion.div
            onMouseEnter={handleNoHover}
            onMouseLeave={handleNoLeave}
            onTouchStart={handleNoHover}
            className="relative"
          >
            <button
              onClick={handleNoClick}
              className="px-12 py-4 bg-gray-200 text-gray-700 text-xl font-semibold rounded-full shadow-lg hover:bg-gray-300 transition-all duration-300 relative min-w-[120px]"
            >
              {noHovered && noClickCount > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="block"
                >
                  {NO_BUTTON_TEXTS[Math.min(noClickCount - 1, NO_BUTTON_TEXTS.length - 1)]}
                </motion.span>
              )}
              {!noHovered && "No"}
            </button>
          </motion.div>
        </motion.div>
    );
}
