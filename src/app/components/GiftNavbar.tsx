"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Gift, Mail, Music, Heart, Home } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { path: "/", name: "Home", icon: Home },
  { path: "/yes", name: "Gifts", icon: Heart },
  { path: "/gift1", name: "Gift 1", icon: Gift, title: "Garden of Love" },
  { path: "/gift2", name: "Gift 2", icon: Mail, title: "Love Letter" },
  { path: "/gift3", name: "Gift 3", icon: Music, title: "Our Melody" },
];

export default function GiftNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Don't show navigation on home page or no page
  if (pathname === "/" || pathname === "/no") {
    return null;
  }

  const handleNavClick = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-4 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative"
      >
        {/* Toggle Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-black/80 backdrop-blur-xl rounded-full p-3 shadow-2xl border border-white/20 text-white hover:bg-black/90 transition-all"
          aria-label="Toggle navigation"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Gift size={24} />
          </motion.div>
        </motion.button>

        {/* Navigation Menu */}
        <motion.div
          initial={false}
          animate={{
            opacity: isOpen ? 1 : 0,
            scale: isOpen ? 1 : 0.8,
            y: isOpen ? 0 : -10,
          }}
          transition={{ duration: 0.2 }}
          className={`absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden ${
            isOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <div className="p-2 min-w-[220px]">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <motion.button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-rose-500/30 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Icon size={20} />
                  <span className="font-semibold">{item.name}</span>
                  {item.title && (
                    <span className="ml-auto text-xs text-white/50">
                      {item.title}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-r"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 -z-10"
        />
      )}
    </nav>
  );
}

