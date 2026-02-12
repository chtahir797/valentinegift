"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Gift, Mail, Music, Heart, Home } from "lucide-react";
import { useEffect, useState } from "react";

const giftRoutes = [
  { path: "/", name: "Home", icon: Home },
  { path: "/yes", name: "Gifts", icon: Heart },
  { path: "/gift1", name: "Gift 1", icon: Gift, title: "Garden of Love" },
  { path: "/gift2", name: "Gift 2", icon: Mail, title: "Love Letter" },
  { path: "/gift3", name: "Gift 3", icon: Music, title: "Our Melody" },
];

export default function GiftNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't interfere with input fields
      if ((e.target as HTMLElement).tagName === 'INPUT' || 
          (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      const currentIndex = giftRoutes.findIndex(route => route.path === pathname);
      
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        router.push(giftRoutes[currentIndex - 1].path);
      } else if (e.key === 'ArrowRight' && currentIndex >= 0 && currentIndex < giftRoutes.length - 1) {
        e.preventDefault();
        router.push(giftRoutes[currentIndex + 1].path);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [pathname, router]);

  if (!mounted) return null;

  const currentIndex = giftRoutes.findIndex(route => route.path === pathname);
  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex >= 0 && currentIndex < giftRoutes.length - 1;

  const handleBack = () => {
    if (canGoBack) {
      const prevRoute = giftRoutes[currentIndex - 1];
      router.push(prevRoute.path);
    }
  };

  const handleForward = () => {
    if (canGoForward) {
      const nextRoute = giftRoutes[currentIndex + 1];
      router.push(nextRoute.path);
    }
  };

  const handleGiftClick = (path: string) => {
    router.push(path);
  };

  // Don't show navigation on home page or no page
  if (pathname === "/" || pathname === "/no") {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-black/80 backdrop-blur-xl rounded-full px-6 py-4 shadow-2xl border border-white/20">
        <div className="flex items-center gap-4">
          {/* Back Button */}
          <motion.button
            onClick={handleBack}
            disabled={!canGoBack}
            whileHover={canGoBack ? { scale: 1.1 } : {}}
            whileTap={canGoBack ? { scale: 0.9 } : {}}
            className={`p-2 rounded-full transition-all ${
              canGoBack
                ? "bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                : "bg-white/5 text-white/30 cursor-not-allowed"
            }`}
          >
            <ChevronLeft size={20} />
          </motion.button>

          {/* Gift Navigation Dots */}
          <div className="flex items-center gap-2">
            {giftRoutes.slice(2).map((gift, index) => {
              const actualIndex = index + 2; // Start from gift1
              const isActive = pathname === gift.path;
              const Icon = gift.icon;

              return (
                <motion.button
                  key={gift.path}
                  onClick={() => handleGiftClick(gift.path)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative p-2 rounded-full transition-all ${
                    isActive
                      ? "bg-rose-500 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white/70"
                  }`}
                  title={gift.title || gift.name}
                >
                  <Icon size={18} />
                  {isActive && (
                    <motion.div
                      layoutId="activeGift"
                      className="absolute inset-0 rounded-full bg-rose-500 -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Forward Button */}
          <motion.button
            onClick={handleForward}
            disabled={!canGoForward}
            whileHover={canGoForward ? { scale: 1.1 } : {}}
            whileTap={canGoForward ? { scale: 0.9 } : {}}
            className={`p-2 rounded-full transition-all ${
              canGoForward
                ? "bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                : "bg-white/5 text-white/30 cursor-not-allowed"
            }`}
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

