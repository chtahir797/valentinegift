"use client";

import { motion, useAnimation } from "framer-motion";
import { Heart, Mail, ArrowRight, Quote, Shield } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import BlurRevealImage from "../../components/BlurRevealImage";
import ImageModal from "../components/ImageModal";
import Typewriter from "../components/Typewriter";
import RejectionBlock from "../components/RejectionBlock";
import { hasRejected } from "../utils/auth";
import { Dancing_Script } from "next/font/google";

const handwriting = Dancing_Script({ subsets: ["latin"] });

// Get letter content from environment variables
const letterGreeting = process.env.NEXT_PUBLIC_LETTER_GREETING || "My Dearest Emaan,";
const letterParagraphs = process.env.NEXT_PUBLIC_LETTER_PARAGRAPHS?.split("|||") || [
  "I never planned to fall this deeply for you—it just happened so naturally. You became the most important person in my world. I think about you every moment; my every breath craves your laughs, your smiles, and your own ways of teaching me about life.",
  "You bring out the best version of me. You never made up things just to make me feel special; instead, you made me feel special by being honest, real, and true to yourself. That's what makes you different and so meaningful to me.",
  "Your love, your support, and your respect have shaped me in ways I can't even fully explain. You see me as someone important, and knowing that you genuinely want to spend your life with me means more than any words ever could.",
  "With you, I feel safe, calm, and understood. I don't have to pretend or overthink; I can just be myself. Even my smallest efforts mean so much to you because you know they come from my heart.",
  "You are the most genuine person I have ever known, and I truly feel blessed to have you in my life. You are my comfort, my peace, and the love that I always wished for. 🤍"
];
const letterSignature = process.env.NEXT_PUBLIC_LETTER_SIGNATURE || "Always yours,";
const gift2TagLines = process.env.NEXT_PUBLIC_GIFT2_TAGLINE?.split("|||") || [
  "A letter from my heart to yours",
  "Click to break seal",
  "Our Beginning",
  "Our Journey",
  "Our Forever"
];

export default function GiftTwoPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sealBroken, setSealBroken] = useState(false);
  const [letterOpened, setLetterOpened] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [showPhotos, setShowPhotos] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [paragraphTypingComplete, setParagraphTypingComplete] = useState<Set<number>>(new Set());
  
  // Get names and images from environment variables
  const loverName = process.env.NEXT_PUBLIC_LOVER_NAME || "Emaan";
  const yourName = process.env.NEXT_PUBLIC_YOUR_NAME || "Arslan";
  const pictureUrls = process.env.NEXT_PUBLIC_PICTURE_URLS?.split(",").map(url => url.trim()) || [
    "/couple-1.jpeg", "/couple-2.jpeg", "/couple-3.jpeg", "/couple-4.jpeg", 
    "/MyPartner.jpeg", "/MyPartnerART.jpeg"
  ];
  const polaroidImages = [
    pictureUrls[1] || "/couple-2.jpeg", 
    pictureUrls[2] || "/couple-2.jpeg", 
    pictureUrls[3] || "/couple-2.jpeg"
  ];
  const controls = useAnimation();
  const sealTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (sealTimerRef.current) {
        clearTimeout(sealTimerRef.current);
      }
    };
  }, []);

  // Handle paragraph progression after typing completes
  useEffect(() => {
    if (letterOpened && currentParagraph < letterParagraphs.length) {
      // Wait for current paragraph to finish typing before moving to next
      if (paragraphTypingComplete.has(currentParagraph)) {
        const timer = setTimeout(() => {
          setCurrentParagraph(prev => prev + 1);
        }, 500); // Small delay between paragraphs
        return () => clearTimeout(timer);
      }
    } else if (currentParagraph === letterParagraphs.length && paragraphTypingComplete.has(letterParagraphs.length - 1)) {
      const timer = setTimeout(() => {
        setShowPhotos(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [letterOpened, currentParagraph, paragraphTypingComplete]);

  const handleSealClick = () => {
    setSealBroken(true);
    controls.start({
      scale: [1, 1.2, 0],
      rotate: [0, 180, 360],
      opacity: [1, 1, 0]
    });
    // Clear any existing timer
    if (sealTimerRef.current) {
      clearTimeout(sealTimerRef.current);
    }
    // Set timer with mounted check
    sealTimerRef.current = setTimeout(() => {
      if (mounted) {
        setLetterOpened(true);
      }
    }, 800);
  };

  // Show rejection block if user selected "No"
  if (hasRejected()) {
    return <RejectionBlock />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 overflow-hidden pb-12 px-4 pt-24">
      {/* <ProgressTracker currentStep={2} /> */}
      
      {/* Vintage Paper Texture Overlay */}
      <div className="fixed inset-0 opacity-30 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat"
      }} />

      {/* Floating Mail Icons */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-rose-300/20"
              initial={{
                x: `${Math.random() * 100}vw`,
                y: "110vh",
                rotate: Math.random() * 360
              }}
              animate={{
                y: "-10vh",
                rotate: Math.random() * 360 + 360,
                x: `${Math.random() * 100}vw`
              }}
              transition={{
                duration: Math.random() * 20 + 15,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
            >
              <Mail size={Math.random() * 30 + 20} />
            </motion.div>
          ))}
              </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block relative mb-6"
          >
            <div className="relative z-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full p-8 shadow-2xl border-4 border-amber-200">
              <Mail className="text-rose-600 w-20 h-20" />
            </div>
            <div className="absolute inset-0 bg-rose-400 rounded-full blur-3xl opacity-40 animate-pulse" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-amber-700 via-rose-600 to-red-700 bg-clip-text text-transparent mb-4"
          >
            Handwritten Memories
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={`text-2xl text-gray-600 italic ${handwriting.className}`}
          >
            {gift2TagLines[0] || "A letter from my heart to yours"}
          </motion.p>
          {/* Creative floating hearts around header */}
          {mounted && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: `${20 + i * 15}%`,
                    y: `${10 + i * 10}%`,
                    opacity: 0.3,
                    scale: 0
                  }}
                  animate={{
                    y: [`${10 + i * 10}%`, `${5 + i * 10}%`, `${10 + i * 10}%`],
                    opacity: [0.3, 0.6, 0.3],
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                  className="absolute text-rose-300/40"
                >
                  <Heart size={20} fill="currentColor" />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Letter Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, rotateX: -20 }}
          animate={{ scale: 1, opacity: 1, rotateX: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          className="relative"
          style={{ perspective: "2000px" }}
        >
          {/* Wax Seal (Before Opening) */}
          {!sealBroken && (
            <motion.div
              animate={controls}
              onClick={handleSealClick}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-30 cursor-pointer"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-red-800 shadow-2xl flex items-center justify-center border-4 border-red-900">
                  <Shield className="text-red-200 w-12 h-12" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-red-500 blur-xl"
                />
                <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm font-bold text-red-700 ${handwriting.className}`}>
                  {gift2TagLines[1] || "Click to break seal"}
                </div>
              </div>
            </motion.div>
          )}

          {/* Letter Paper */}
          <motion.div
            initial={{ rotateX: letterOpened ? 0 : -90 }}
            animate={{ rotateX: 0 }}
            transition={{ duration: 1, delay: sealBroken ? 0.5 : 0 }}
            className="relative bg-[#fffef9] rounded-2xl shadow-2xl overflow-hidden"
            style={{
              backgroundImage: "linear-gradient(#e8d5c4 1px, transparent 1px)",
              backgroundSize: "100% 2.5em",
              transformStyle: "preserve-3d"
            }}
          >
            {/* Paper Texture */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' /%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23paper)' /%3E%3C/svg%3E")`
            }} />

            {/* Decorative Quotes */}
            <div className="absolute top-8 left-8 text-amber-300/30">
              <Quote size={60} />
              </div>
            <div className="absolute bottom-8 right-8 text-amber-300/30 rotate-180">
              <Quote size={60} />
            </div>

            {/* Letter Content */}
            <div className="relative z-10 p-12 md:p-16 space-y-8">
              {/* Greeting */}
              {letterOpened && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className={`text-4xl font-bold text-gray-800 ${handwriting.className}`}
                >
                  <Typewriter
                    text={letterGreeting.replace("Emaan", loverName)}
                    speed={50}
                    className={handwriting.className}
                  />
                </motion.div>
              )}

              {/* Typewriter Paragraphs */}
              {letterOpened && (
                <div className={`space-y-6 text-xl md:text-2xl text-gray-700 leading-relaxed ${handwriting.className}`}>
                  {letterParagraphs.slice(0, currentParagraph + 1).map((para, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="min-h-[1.5em]"
                    >
                      {index < currentParagraph ? (
                        // Completed paragraphs - show full text
                        para
                      ) : index === currentParagraph ? (
                        // Current paragraph - show typing effect
                        <Typewriter
                          text={para}
                          speed={30 + Math.random() * 20} // Variable speed for natural typing
                          onComplete={() => {
                            setParagraphTypingComplete(prev => new Set(prev).add(index));
                          }}
                          showCursor={true}
                        />
                      ) : null}
                    </motion.p>
                  ))}
                </div>
              )}

              {/* Signature */}
              {currentParagraph >= letterParagraphs.length && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="pt-8 flex flex-col items-end"
                >
                  <p className={`text-3xl font-bold text-rose-600 ${handwriting.className}`}>
                    {letterSignature}
                  </p>
                  <p className={`text-2xl text-gray-600 mt-2 ${handwriting.className}`}>
                    - {yourName}
                  </p>
                  <motion.div
                    animate={{ rotate: [-5, 5, -5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mt-4"
                  >
                    <Heart className="text-rose-500 w-8 h-8" fill="#f43f5e" />
                  </motion.div>
                </motion.div>
              )}
          </div>

            {/* Torn Edge Effect */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-b from-transparent to-amber-100/50" style={{
              clipPath: "polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0)"
            }} />
          </motion.div>
        </motion.div>

        {/* Polaroid Photos */}
        {showPhotos && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {polaroidImages.map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, rotate: (index - 1) * 10, y: 100 }}
                animate={{ opacity: 1, rotate: (index - 1) * 5, y: 0 }}
                transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
                whileHover={{ rotate: 0, scale: 1.05, zIndex: 10 }}
                onClick={() => setSelectedImageIndex(index)}
                className="relative bg-white p-4 shadow-2xl cursor-pointer"
                style={{ transformOrigin: "center center" }}
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <BlurRevealImage 
                    src={src}
                    alt={`Memory ${index + 1}`}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className={`mt-4 text-center text-gray-600 ${handwriting.className}`}>
                  {index === 0 ? (gift2TagLines[2] || "Our Beginning") : index === 1 ? (gift2TagLines[3] || "Our Journey") : (gift2TagLines[4] || "Our Forever")}
                </div>
                {/* Click indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-gray-600 text-sm"
                  >
                    👆
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
            
            {/* Image Modal */}
            <ImageModal
              isOpen={selectedImageIndex !== null}
              onClose={() => setSelectedImageIndex(null)}
              images={polaroidImages}
              currentIndex={selectedImageIndex ?? 0}
              onNext={() => {
                if (selectedImageIndex !== null) {
                  setSelectedImageIndex((selectedImageIndex + 1) % polaroidImages.length);
                }
              }}
              onPrevious={() => {
                if (selectedImageIndex !== null) {
                  setSelectedImageIndex((selectedImageIndex - 1 + polaroidImages.length) % polaroidImages.length);
                }
              }}
            />
          </motion.div>
        )}

        {/* Next Button */}
        {showPhotos && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-16 text-center"
          >
            <button
              onClick={() => router.push("/gift3")}
              className="group inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-amber-600 via-rose-600 to-red-600 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-rose-500/50 transition-all duration-300"
            >
              <span>One More Surprise</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={24} />
              </motion.div>
            </button>
          </motion.div>
        )}
          </div>
    </div>
  );
}