"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
}

export default function ImageModal({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNext,
  onPrevious,
}: ImageModalProps) {
  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        onNext();
      } else if (e.key === "ArrowLeft") {
        onPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-60 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </motion.button>

            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrevious();
                  }}
                  className="absolute left-4 z-60 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors"
                >
                  <ChevronLeft className="h-8 w-8 text-white" />
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                  }}
                  className="absolute right-4 z-60 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors"
                >
                  <ChevronRight className="h-8 w-8 text-white" />
                </motion.button>
              </>
            )}

            {/* Image container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            >
              <div className="relative w-full h-full">
                <Image
                  src={images[currentIndex]}
                  alt={`Gallery image ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Image counter */}
              {images.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full"
                >
                  <span className="text-white font-semibold">
                    {currentIndex + 1} / {images.length}
                  </span>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

