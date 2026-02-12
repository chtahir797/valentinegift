"use client";

import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { Music, Home, Sparkles, QrCode, Heart, Play, Pause } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import BlurRevealImage from "../../components/BlurRevealImage";
import RejectionBlock from "../components/RejectionBlock";
import { hasRejected } from "../utils/auth";
import confetti from "canvas-confetti";

export default function GiftThreePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [qrHovered, setQrHovered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const vinylControls = useAnimation();
  const currentRotationRef = useRef(0);
  const rotationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get song configuration and tag lines from environment variables
  const youtubeUrl = process.env.NEXT_PUBLIC_SONG_URL || "https://youtu.be/myJ7x029Ves?list=RDmyJ7x029Ves";
  const songFile = process.env.NEXT_PUBLIC_SONG_FILE || "/Song.mp3";
  const pictureUrls = process.env.NEXT_PUBLIC_PICTURE_URLS?.split(",").map(url => url.trim()) || [
    "/couple-1.jpeg", "/couple-2.jpeg", "/couple-3.jpeg", "/couple-4.jpeg", 
    "/MyPartner.jpeg", "/MyPartnerART.jpeg"
  ];
  const gift3TagLines = process.env.NEXT_PUBLIC_GIFT3_TAGLINE?.split("|||") || [
    "The melody of our love",
    "Scan or tap to open YouTube",
    "Our Forever 💕",
    "Made with ❤️ for my Valentine"
  ];

  useEffect(() => {
    setMounted(true);
    
    // Initialize audio element using environment variable
    const audioElement = new Audio(songFile);
    audioElement.preload = "auto";
    setAudio(audioElement);

    // Don't autoplay - browsers require user interaction
    // User will need to click play button to start

    // Cleanup on unmount
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = "";
      }
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
      }
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [songFile]);

  useEffect(() => {
    if (isPlaying && audio) {
      // Clear any existing interval
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
      }

      // Clear any existing pause timeout so we can create a fresh one
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }

      // Schedule automatic stop at 3:05 (185s)
      const stopAt = 185; // seconds
      const remaining = Math.max(0, stopAt - audio.currentTime);
      if (remaining === 0) {
        // If already past the stop time, immediately pause
        audio.pause();
        setIsPlaying(false);
      } else {
        pauseTimeoutRef.current = setTimeout(() => {
          try {
            audio.pause();
          } catch (e) {
            // ignore
          }
          setIsPlaying(false);
          // Reset to 2:00 for potential replay
          try {
            audio.currentTime = 120;
            setHasStarted(false);
          } catch (e) {
            // ignore
          }
        }, remaining * 1000);
      }

      // Start rotation animation from current position
      vinylControls.start({
        rotate: currentRotationRef.current + 360,
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop"
        }
      });

      // Track rotation continuously to maintain position when paused
      rotationIntervalRef.current = setInterval(() => {
        currentRotationRef.current = (currentRotationRef.current + 1) % 360;
      }, 8.33); // Update every ~8.33ms for smooth 360deg in 3s
    } else {
      // Stop rotation and preserve current position
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
        rotationIntervalRef.current = null;
      }
      // Clear any scheduled stop
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
        pauseTimeoutRef.current = null;
      }
      vinylControls.stop();
      // Set the current rotation so it resumes from here when play resumes
      vinylControls.set({ rotate: currentRotationRef.current });
    }
  }, [isPlaying, audio, vinylControls]);

  const handlePlayPause = () => {
    if (!audio) return;

    if (isPlaying) {
      // Pause the audio (keeps current position)
      audio.pause();
      setIsPlaying(false);
    } else {
      // Resume from current position (or start from 2:00 if hasn't started)
      if (!hasStarted) {
        audio.currentTime = 120;
        setHasStarted(true);
      }
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
      setIsPlaying(true);
    }
  };

  // Handle audio events
  useEffect(() => {
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
      // Reset to 2:00 when song ends
      audio.currentTime = 120;
      setHasStarted(false);
    };

    const handleError = () => {
      console.error("Audio playback error");
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [audio]);

  const handleQRClick = () => {
    if (!showConfetti) {
      setShowConfetti(true);
      const duration = 3000;
      const end = Date.now() + duration;

      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
          return;
        }

        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0.5, y: 0.6 },
          colors: ['#a855f7', '#ec4899', '#f43f5e', '#8b5cf6']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 0.5, y: 0.6 },
          colors: ['#a855f7', '#ec4899', '#f43f5e', '#8b5cf6']
        });
      }, 100);
    }
  };

  // Generate visualizer bars
  const visualizerBars = [...Array(24)].map((_, i) => ({
    height: Math.random() * 100 + 50,
    delay: i * 0.05
  }));

  // Show rejection block if user selected "No"
  if (hasRejected()) {
    return <RejectionBlock />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden pb-12 px-4 pt-24">
      {/* <ProgressTracker currentStep={3} /> */}
      
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px"
        }} />
      </div>

      {/* Floating Music Notes */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-purple-300/20"
              initial={{
                x: `${Math.random() * 100}vw`,
                y: "110vh",
                rotate: 0
              }}
              animate={{
                y: "-10vh",
                rotate: 360,
                x: `${Math.random() * 100}vw`
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
            >
              <Music size={Math.random() * 40 + 20} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-rose-300 bg-clip-text text-transparent mb-4">
            Our Song
          </h1>
          <motion.p
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-xl text-purple-200 flex items-center justify-center gap-2"
          >
            <Sparkles className="text-yellow-300" />
            {gift3TagLines[0] || "The melody of our love"}
            <Sparkles className="text-yellow-300" />
          </motion.p>
        </motion.div>

        {/* Vinyl Record Player */}
        <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Vinyl Player */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Turntable Base */}
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 shadow-2xl border-4 border-gray-700">
              {/* Vinyl Record */}
              <motion.div
                animate={vinylControls}
                className="relative w-full aspect-square rounded-full bg-gradient-to-br from-gray-900 via-black to-gray-900 shadow-2xl overflow-hidden"
                style={{
                  boxShadow: "inset 0 0 50px rgba(0,0,0,0.8), 0 0 30px rgba(139, 92, 246, 0.3)"
                }}
              >
                {/* Vinyl Grooves */}
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 rounded-full border border-gray-700/30"
                    style={{
                      margin: `${i * 6}px`
                    }}
                  />
                ))}

                {/* Center Label */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                    <div className="text-center">
                      <Music className="text-white w-12 h-12 mx-auto mb-2" />
                      <p className="text-white text-xs font-bold">Our Love</p>
                    </div>
                  </div>
                </div>

                {/* Needle Arm */}
                <motion.div
                  animate={{
                    rotate: isPlaying ? 25 : 0
                  }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-1/4 right-0 w-1/2 h-1 bg-gradient-to-r from-gray-600 to-gray-400 origin-right"
                  style={{
                    transformOrigin: "100% 50%",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.5)"
                  }}
                >
                  <div className="absolute right-0 w-4 h-4 bg-gray-500 rounded-full -top-1.5" />
                </motion.div>
              </motion.div>

              {/* Play Button */}
              <motion.button
                onClick={handlePlayPause}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={!audio}
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
              </motion.button>
              
              {/* Audio Info */}
              {isPlaying && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center"
                >
                  <p className="text-white text-sm font-semibold bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                    🎵 {hasStarted && audio && audio.currentTime > 120 ? "Playing" : "Playing"}
                  </p>
                </motion.div>
              )}
              {!isPlaying && hasStarted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center"
                >
                  <p className="text-white text-sm font-semibold bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                    ⏸️ Paused - Click to resume
                  </p>
                </motion.div>
              )}
            </div>

            {/* Audio Visualizer */}
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 flex items-end justify-center gap-1 h-24"
              >
                {visualizerBars.map((bar, i) => (
                  <motion.div
                    key={i}
                    className="w-2 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
                    animate={{
                      height: [`${bar.height * 0.3}%`, `${bar.height}%`, `${bar.height * 0.3}%`]
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: bar.delay,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Right: QR Code & Photo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* QR Code Card */}
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noreferrer"
              onClick={handleQRClick}
            >
              <motion.div
                onMouseEnter={() => setQrHovered(true)}
                onMouseLeave={() => setQrHovered(false)}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-2 border-purple-400/30 cursor-pointer overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Holographic Effect */}
                <motion.div
                  animate={qrHovered ? {
                    background: [
                      "linear-gradient(45deg, rgba(168,85,247,0.3) 0%, rgba(236,72,153,0.3) 100%)",
                      "linear-gradient(135deg, rgba(236,72,153,0.3) 0%, rgba(168,85,247,0.3) 100%)",
                      "linear-gradient(225deg, rgba(168,85,247,0.3) 0%, rgba(236,72,153,0.3) 100%)",
                      "linear-gradient(315deg, rgba(236,72,153,0.3) 0%, rgba(168,85,247,0.3) 100%)"
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0"
                />

                {/* Corner Decorations */}
                <div className="absolute top-4 left-4 text-purple-300">
                  <QrCode size={30} />
                </div>
                <div className="absolute top-4 right-4 text-pink-300">
                  <Heart fill="currentColor" size={30} />
                </div>
                <div className="absolute bottom-4 left-4 text-pink-300">
                  <Heart fill="currentColor" size={30} />
                </div>
                <div className="absolute bottom-4 right-4 text-purple-300">
                  <Music size={30} />
                </div>

                {/* QR Code */}
                <div className="relative flex justify-center">
                  <motion.div
                    animate={qrHovered ? {
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    } : {}}
                    transition={{ duration: 2, repeat: qrHovered ? Infinity : 0 }}
                  >
                    <QRCodeSVG
                      value={youtubeUrl}
                      size={250}
                      level="H"
                      includeMargin={true}
                      className="rounded-xl shadow-lg bg-white p-4"
                    />
                  </motion.div>

                  {qrHovered && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-6xl"
                      >
                        🎶
                      </motion.div>
                    </motion.div>
                  )}
                </div>

                <p className="mt-6 text-center text-lg font-semibold text-purple-200">
                  👆 {gift3TagLines[1] || "Scan or tap to open YouTube"}
                </p>
              </motion.div>
            </a>

            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ rotate: 2, scale: 1.05 }}
              className="relative"
            >
              <div className="w-full h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 bg-white/10 backdrop-blur-sm transform -rotate-2">
                <BlurRevealImage 
                  src={pictureUrls[2] || "/couple-3.jpeg"} 
                  alt="Our Forever" 
                  width={400} 
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg font-bold">
                {gift3TagLines[2] || "Our Forever 💕"}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Musical Notes Animation with Enhanced Creativity */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 flex justify-center gap-4 text-5xl"
        >
          {["🎵", "🎶", "💕", "🎶", "🎵"].map((emoji, index) => (
            <motion.span
              key={index}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
              whileHover={{ scale: 1.5, rotate: 360 }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
        
        {/* Creative Pulse Effect */}
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-8 flex justify-center gap-2"
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.15
                }}
                className="w-2 h-2 rounded-full bg-purple-400"
              />
            ))}
          </motion.div>
        )}

        {/* Home Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-lg font-bold rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
          >
            <Home size={24} />
            <span>Back to Home</span>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-8 text-sm text-purple-200 italic"
        >
          {gift3TagLines[3] || "Made with ❤️ for my Valentine"}
        </motion.p>
      </div>
    </div>
  );
}
