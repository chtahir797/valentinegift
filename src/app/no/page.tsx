"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeartCrack, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function NoPage() {
  const [shake, setShake] = useState(false);

  const handleButtonClick = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-100 via-slate-50 to-gray-100 px-4">
      <motion.main
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center space-y-10 max-w-lg"
      >
        {/* Sad image */}
        <motion.div
          animate={{ 
            rotate: [-5, 5, -5],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mx-auto w-56 h-56 relative"
        >
          <Image
            src="https://images.unsplash.com/photo-1494236581341-7d38b2e7d824?w=300&h=300&fit=crop"
            alt="Sad puppy"
            width={224}
            height={224}
            className="rounded-full shadow-2xl border-8 border-white/70 object-cover grayscale"
          />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-4 -right-4"
          >
            <HeartCrack className="text-gray-400" size={50} />
          </motion.div>
        </motion.div>

        {/* Message */}
        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-gray-700"
          >
            Oh no... 💔
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-gray-500"
          >
            Are you sure? Maybe reconsider? 🥺
          </motion.p>
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex justify-center gap-2 text-4xl mt-4"
          >
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              >
                💔
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={shake ? {
            opacity: 1,
            y: 0,
            x: [0, -10, 10, -10, 10, 0],
            rotate: [0, -5, 5, -5, 5, 0]
          } : { opacity: 1, y: 0 }}
          transition={{ delay: 0.7, ease: "easeInOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/"
            onClick={handleButtonClick}
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xl font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <RotateCcw size={24} />
            </motion.div>
            Give it Another Thought
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-sm text-gray-400 italic"
        >
          Hint: The &quot;Yes&quot; button leads to amazing surprises! ✨
        </motion.p>
      </motion.main>
    </div>
  );
}