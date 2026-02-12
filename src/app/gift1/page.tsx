"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Heart, ArrowRight, Sparkles, Flower2, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import BlurRevealImage from "../../components/BlurRevealImage";
import ImageModal from "../components/ImageModal";
import RejectionBlock from "../components/RejectionBlock";
import { hasRejected } from "../utils/auth";

// Get tag lines from environment variables
const gift1TagLines = process.env.NEXT_PUBLIC_GIFT1_TAGLINE?.split("|||") || [
  "A journey through our beautiful moments",
  "Our Beautiful Memories",
  "You Mean Everything to Me",
  "Every moment with you is a treasure. You are my love, my life, my everything."
];

// Get image URLs from environment variable
const pictureUrls = process.env.NEXT_PUBLIC_PICTURE_URLS?.split(",").map(url => url.trim()) || [
  "/couple-1.jpeg", "/couple-2.jpeg", "/couple-3.jpeg", "/couple-4.jpeg", 
  "/MyPartner.jpeg", "/MyPartnerART.jpeg"
];

const messages = [
  {
    text: "I will always love you no matter what",
    icon: "💖",
    gradient: "from-rose-400 via-pink-400 to-rose-500",
    bgGradient: "from-rose-50 via-pink-50 to-rose-100",
    photo: pictureUrls[0] || "/couple-1.jpeg"
  },
  {
    text: "You are the best part of my life",
    icon: "✨",
    gradient: "from-coral-400 via-peach-400 to-orange-400",
    bgGradient: "from-orange-50 via-peach-50 to-coral-100",
    photo: pictureUrls[1] || "/couple-2.jpeg"
  },
  {
    text: "You will forever be my only option",
    icon: "💫",
    gradient: "from-red-400 via-rose-400 to-pink-500",
    bgGradient: "from-red-50 via-rose-50 to-pink-100",
    photo: pictureUrls[2] || "/couple-3.jpeg"
  },
  {
    text: "I can't imagine a life without you in it",
    icon: "🌟",
    gradient: "from-pink-400 via-purple-300 to-lavender-400",
    bgGradient: "from-pink-50 via-purple-50 to-lavender-100",
    photo: pictureUrls[3] || "/couple-4.jpeg"
  }
];

function MessageSection({ message, index }: { message: typeof messages[0], index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const isFromLeft = index % 2 === 0;

  return (
    <section 
      ref={ref}
      className={`min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br ${message.bgGradient}`}
    >
      {/* Floating Rose Petals for this section */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-30"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              rotate: Math.random() * 360
            }}
            animate={isInView ? {
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              rotate: Math.random() * 360 + 360,
              scale: [1, 1.2, 1]
            } : {}}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            🌹
          </motion.div>
        ))}
      </div>

      {/* Content Card */}
      <div className="container mx-auto px-4 z-10">
        <motion.div
          initial={{ 
            opacity: 0, 
            x: isFromLeft ? -100 : 100,
            scale: 0.9
          }}
          animate={isInView ? { 
            opacity: 1, 
            x: 0,
            scale: 1
          } : {
            opacity: 0,
            x: isFromLeft ? -100 : 100,
            scale: 0.9
          }}
          transition={{ 
            duration: 0.8,
            type: "spring",
            stiffness: 100
          }}
          className={`grid lg:grid-cols-2 gap-8 items-center ${isFromLeft ? '' : 'lg:grid-flow-dense'}`}
        >
          {/* Photo */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: isFromLeft ? 2 : -2 }}
            className={`relative ${isFromLeft ? '' : 'lg:col-start-2'}`}
          >
            <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-8 border-white/80">
              <BlurRevealImage 
                src={message.photo}
                alt={`Memory ${index + 1}`}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
              {/* Rose overlay on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-pink-500/20 flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="text-8xl"
                >
                  🌹
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Message Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`relative ${isFromLeft ? '' : 'lg:col-start-1 lg:row-start-1'}`}
          >
            <div className={`relative bg-white/90 backdrop-blur-md rounded-3xl p-12 shadow-2xl border-4 border-white/50`}>
              {/* Decorative corner roses */}
              <div className="absolute -top-6 -left-6 text-5xl">🌹</div>
              <div className="absolute -top-6 -right-6 text-5xl">🌹</div>
              <div className="absolute -bottom-6 -left-6 text-5xl">🌹</div>
              <div className="absolute -bottom-6 -right-6 text-5xl">🌹</div>

              {/* Icon */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-7xl mb-6 text-center"
              >
                {message.icon}
              </motion.div>

              {/* Message Text */}
              <p className={`text-3xl lg:text-4xl font-bold text-center bg-gradient-to-r ${message.gradient} bg-clip-text text-transparent leading-relaxed`}>
                {message.text}
              </p>

              {/* Sparkle decoration */}
              <motion.div
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
                className="flex justify-center gap-4 mt-8"
              >
                <Sparkles className="text-rose-400" />
                <Heart className="text-pink-500" fill="currentColor" />
                <Sparkles className="text-rose-400" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Section number indicator */}
      <div className="absolute bottom-8 right-8 text-6xl font-bold text-white/20">
        {index + 1}
      </div>
    </section>
  );
}

export default function GiftOnePage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [refReady, setRefReady] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const galleryImages = pictureUrls;
  const [petalConfigs, setPetalConfigs] = useState<Array<{
    x: number;
    y: number;
    rotation: number;
    duration: number;
    delay: number;
  }>>([]);

  // useScroll hook must be called unconditionally (React rules)
  // Only use scroll when ref is ready and mounted
  const { scrollYProgress } = useScroll({
    target: refReady && containerRef.current ? containerRef : undefined,
    offset: ["start start", "end end"]
  });

  // Scroll progress for indicator - only render when mounted and ref ready
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setPetalConfigs(
        [...Array(40)].map(() => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
          rotation: Math.random() * 360,
          duration: Math.random() * 20 + 15,
          delay: Math.random() * 5
        }))
      );
      
      // Wait for next frame to ensure ref is attached
      requestAnimationFrame(() => {
        if (containerRef.current) {
          setRefReady(true);
        }
      });
    }
  }, []);

  // Show rejection block if user selected "No"
  if (hasRejected()) {
    return <RejectionBlock />;
  }

  return (
    <div ref={containerRef} className="relative">
      {/* <ProgressTracker currentStep={1} /> */}
      
      {/* Scroll Progress Indicator - only render when mounted and ref ready */}
      {mounted && refReady && (
        <motion.div
          className="fixed top-0 left-0 w-2 bg-gradient-to-b from-rose-500 via-pink-500 to-red-500 origin-top z-50 shadow-lg"
          style={{ scaleY, height: "100vh" }}
        />
      )}

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-rose-100 via-pink-100 to-red-100">
        {/* Animated background petals */}
        {mounted && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {petalConfigs.map((config, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl opacity-20"
                initial={{
                  x: `${config.x}%`,
                  y: `${config.y}%`,
                  rotate: config.rotation
                }}
                animate={{
                  x: `${(config.x + 50) % 100}%`,
                  y: `${(config.y + 50) % 100}%`,
                  rotate: config.rotation + 360
                }}
                transition={{
                  duration: config.duration,
                  repeat: Infinity,
                  delay: config.delay,
                  ease: "linear"
                }}
              >
                🌹
              </motion.div>
            ))}
              </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4">
          {/* Blooming Rose Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              duration: 1.5
            }}
            className="mb-8"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block relative"
            >
              <div className="text-9xl">💐</div>
              {/* Petal burst effect */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos((i * Math.PI * 2) / 8) * 100,
                    y: Math.sin((i * Math.PI * 2) / 8) * 100,
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="absolute top-1/2 left-1/2 text-4xl"
                >
                  🌹
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-6"
          >
            Garden of Love
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-2xl lg:text-3xl text-gray-700 italic mb-12"
          >
            {gift1TagLines[0] || "A journey through our beautiful moments"}
          </motion.p>

          {/* Scroll indicator with creative animation */}
          <motion.div
            animate={{
              y: [0, 15, 0],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex flex-col items-center gap-2 text-rose-500"
          >
            <motion.p 
              className="text-lg font-semibold"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Scroll to explore
            </motion.p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown size={40} />
            </motion.div>
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex gap-1 mt-1"
            >
              {[...Array(3)].map((_, i) => (
                <motion.span
                  key={i}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="text-rose-300"
                >
                  💕
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
                  </div>
      </section>

      {/* Message Sections */}
      {messages.map((message, index) => (
        <MessageSection key={index} message={message} index={index} />
      ))}

      {/* Photo Gallery Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-cream-50 via-white to-rose-50 py-20">
        <div className="container mx-auto px-4 z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl lg:text-6xl font-bold text-center bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-16"
          >
            {gift1TagLines[1] || "Our Beautiful Memories"}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, rotate: (i % 3 - 1) * 5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, rotate: (i % 3 - 1) * 3, zIndex: 10 }}
                onClick={() => setSelectedImageIndex(i)}
                className="relative h-80 rounded-2xl overflow-hidden shadow-xl border-4 border-white cursor-pointer group"
              >
                <BlurRevealImage 
                  src={photo}
                  alt={`Memory ${i + 1}`}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                  <p className="text-white text-xl font-bold">Click to view 💕</p>
                </div>
                {/* Click indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-white text-xl"
                  >
                    👆
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
            </div>

          {/* Image Modal */}
          <ImageModal
            isOpen={selectedImageIndex !== null}
            onClose={() => setSelectedImageIndex(null)}
            images={galleryImages}
            currentIndex={selectedImageIndex ?? 0}
            onNext={() => {
              if (selectedImageIndex !== null) {
                setSelectedImageIndex((selectedImageIndex + 1) % galleryImages.length);
              }
            }}
            onPrevious={() => {
              if (selectedImageIndex !== null) {
                setSelectedImageIndex((selectedImageIndex - 1 + galleryImages.length) % galleryImages.length);
              }
            }}
                  />
                </div>
      </section>

      {/* Finale Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-rose-600 via-pink-600 to-red-600">
        {/* Floating hearts */}
        {mounted && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white/20"
                initial={{
                  x: `${Math.random() * 100}%`,
                  y: "110%"
                }}
                animate={{
                  y: "-10%",
                  x: `${Math.random() * 100}%`
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear"
                }}
              >
                <Heart size={Math.random() * 40 + 20} fill="currentColor" />
              </motion.div>
            ))}
          </div>
        )}

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="text-8xl mb-8">💕</div>
            <h2 className="text-5xl lg:text-7xl font-bold text-white mb-8">
              {gift1TagLines[2] || "You Mean Everything to Me"}
            </h2>
            <p className="text-2xl lg:text-3xl text-white/90 italic leading-relaxed">
              {gift1TagLines[3] || "Every moment with you is a treasure. You are my love, my life, my everything."}
            </p>
          </motion.div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => router.push("/gift2")}
              className="group inline-flex items-center gap-4 px-16 py-8 bg-white text-rose-600 text-2xl font-bold rounded-full shadow-2xl hover:shadow-white/50 transition-all duration-300"
            >
              <span>Continue to Next Gift</span>
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                <ArrowRight size={32} />
              </motion.div>
            </button>
          </motion.div>
          </div>
        </section>
    </div>
  );
}