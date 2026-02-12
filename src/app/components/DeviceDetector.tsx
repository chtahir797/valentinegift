"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Smartphone, Laptop } from "lucide-react";

export default function DeviceDetector({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    // Check if user is on mobile or tablet device
    const checkDevice = () => {
      if (typeof window === "undefined") return { isMobile: false, isTablet: false };

      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const userAgentLower = userAgent.toLowerCase();
      
      // Check for mobile devices
      const isMobileDevice = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgentLower);
      
      // Check for tablets (iPad, Android tablets)
      const isTabletDevice = /ipad|android(?!.*mobile)|tablet/i.test(userAgentLower) || 
                            (userAgentLower.includes("mac") && "ontouchend" in document);
      
      // Also check screen width as a secondary check
      const screenWidth = window.innerWidth;
      const isSmallScreen = screenWidth < 1024; // Less than laptop size
      const isTabletScreen = screenWidth >= 768 && screenWidth < 1024;
      
      return {
        isMobile: isMobileDevice || (isSmallScreen && !isTabletScreen),
        isTablet: isTabletDevice || isTabletScreen
      };
    };

    const deviceCheck = checkDevice();
    setIsMobile(deviceCheck.isMobile);
    setIsTablet(deviceCheck.isTablet);
  }, []);

  // Show loading state while checking
  if (isMobile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Monitor className="w-12 h-12 text-rose-500" />
          </motion.div>
          <p className="text-rose-600 font-semibold">Checking device...</p>
        </motion.div>
      </div>
    );
  }

  // Block mobile and tablet access
  if (isMobile || isTablet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full text-center"
        >
          {/* Icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <Smartphone className="w-24 h-24 text-rose-400" />
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-2 -right-2"
              >
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">✕</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Main Message */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-black text-rose-600 mb-6"
          >
            Desktop or Laptop Required
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-rose-500 mb-8 leading-relaxed"
          >
            This web app is designed for desktop and laptop computers only.
            <br />
            Please open it on a computer for the best experience.
          </motion.p>

          {/* Device Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-8 mb-8"
          >
            <div className="text-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              >
                <Laptop className="w-16 h-16 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700">Laptop</p>
                <p className="text-xs text-green-600">✓ Supported</p>
              </motion.div>
            </div>
            <div className="text-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              >
                <Monitor className="w-16 h-16 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700">Desktop</p>
                <p className="text-xs text-green-600">✓ Supported</p>
              </motion.div>
            </div>
            <div className="text-center opacity-50">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
              >
                <Smartphone className="w-16 h-16 text-red-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700">Mobile</p>
                <p className="text-xs text-red-500">✗ Not Supported</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-rose-200"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Access:</h2>
            <ol className="text-left text-gray-700 space-y-3 max-w-md mx-auto">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold">1</span>
                <span>Open this link on your desktop or laptop computer</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold">2</span>
                <span>Make sure your browser window is at least 1024px wide</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold">3</span>
                <span>Enjoy the full interactive experience!</span>
              </li>
            </ol>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-sm text-rose-400 italic"
          >
            Made with ❤️ for the best viewing experience
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Allow access on desktop/laptop
  return <>{children}</>;
}

