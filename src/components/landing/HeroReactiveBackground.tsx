import React, { useEffect, useState } from 'react';
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useScroll, 
  useTransform, 
  useReducedMotion, 
  useMotionTemplate 
} from 'motion/react';

export const HeroReactiveBackground: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [hasPointer, setHasPointer] = useState(false);

  // Mouse coordinates with spring interpolation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 90, mass: 1.2 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Scroll tracking for parallax and page atmosphere
  const { scrollYProgress } = useScroll();

  // Scroll mapping for atmospheric shapes
  const blob1Y = useTransform(scrollYProgress, [0, 1], [0, -320]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const blob3Y = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const blob3Scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.15, 0.9]);

  // Page progress subtly affecting atmosphere (opacity, depth, scales)
  const atmosphereBlur = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    ['blur(130px)', 'blur(160px)', 'blur(120px)']
  );
  
  // Decorative ribbon scroll-linked rotation and position changes
  const ribbonRotate = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const ribbonY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const ribbonX = useTransform(scrollYProgress, [0, 1], [0, 60]);

  useEffect(() => {
    // Check if the user is on a desktop or pointer-supported device
    const checkPointer = () => {
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      setHasPointer(!isTouch);
    };

    checkPointer();
    window.addEventListener('resize', checkPointer);

    // Initial mouse positions near center
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2.5);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isTouchDevice()) {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }
    };

    const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches;

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('resize', checkPointer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Creative Soft Coral gradient template for the pointer glow
  const radialGlow = useMotionTemplate`radial-gradient(600px circle at ${smoothX}px ${smoothY}px, rgba(255, 112, 89, 0.18) 0%, rgba(255, 112, 89, 0.04) 50%, rgba(255, 112, 89, 0) 100%)`;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      
      {/* Site-wide grid network behind */}
      <div className="absolute inset-0 bg-dot-grid opacity-[0.4] pointer-events-none" />

      {/* Large soft coral radial pointer glow (only on pointer devices, disabled if prefers reduced motion) */}
      {hasPointer && !shouldReduceMotion && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-[1] mix-blend-multiply"
          style={{ background: radialGlow }}
        />
      )}

      {/* Parallax Atmospheric Blob 1: Morphing Warm Accent (Top Right) */}
      <motion.div
        className="absolute top-[-5%] right-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[#FFEFEB] rounded-full opacity-[0.65] mix-blend-multiply pointer-events-none"
        style={{
          y: shouldReduceMotion ? 0 : blob1Y,
          filter: shouldReduceMotion ? 'blur(120px)' : 'blur(140px)',
        }}
        animate={shouldReduceMotion ? {} : {
          borderRadius: [
            "42% 58% 70% 30% / 45% 45% 55% 55%",
            "70% 30% 52% 48% / 60% 40% 60% 40%",
            "42% 58% 70% 30% / 45% 45% 55% 55%"
          ]
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Parallax Atmospheric Blob 2: Sunny Glow (Bottom Left) */}
      <motion.div
        className="absolute bottom-[-10%] left-[-15%] w-[65vw] h-[65vw] max-w-[900px] max-h-[900px] bg-[#FFF9F2] rounded-full opacity-[0.7] mix-blend-multiply pointer-events-none"
        style={{
          y: shouldReduceMotion ? 0 : blob2Y,
          filter: shouldReduceMotion ? 'blur(130px)' : 'blur(160px)',
        }}
        animate={shouldReduceMotion ? {} : {
          borderRadius: [
            "50% 50% 30% 70% / 50% 60% 40% 60%",
            "30% 70% 70% 30% / 50% 30% 70% 50%",
            "50% 50% 30% 70% / 50% 60% 40% 60%"
          ]
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Parallax Atmospheric Blob 3: Central Soft Peach Glow */}
      <motion.div
        className="absolute top-[35%] left-[20%] w-[50vw] h-[50vw] max-w-[650px] bg-[#FFF2EA] rounded-full opacity-[0.55] mix-blend-multiply pointer-events-none"
        style={{
          y: shouldReduceMotion ? 0 : blob3Y,
          scale: shouldReduceMotion ? 1 : blob3Scale,
          filter: shouldReduceMotion ? 'blur(110px)' : atmosphereBlur,
        }}
        animate={shouldReduceMotion ? {} : {
          borderRadius: [
            "60% 40% 60% 40% / 40% 60% 40% 60%",
            "40% 60% 40% 60% / 60% 40% 60% 40%",
            "60% 40% 60% 40% / 40% 60% 40% 60%"
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* SCROLL-DRIVEN DECORATIVE RIBBON / CURVED PATH */}
      <motion.div
        className="absolute top-[18%] left-[-5%] w-[110%] h-[400px] pointer-events-none opacity-[0.12] text-coral/80"
        style={{
          y: shouldReduceMotion ? 0 : ribbonY,
          x: shouldReduceMotion ? 0 : ribbonX,
          rotate: shouldReduceMotion ? 0 : ribbonRotate,
          originX: 0.5,
          originY: 0.5,
        }}
      >
        <svg 
          className="w-full h-full" 
          viewBox="0 0 1440 400" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path 
            d="M-50,200 C300,50 550,350 950,150 C1200,20 1350,280 1550,100" 
            stroke="currentColor" 
            strokeWidth="3.5" 
            strokeDasharray="16 12" 
            strokeLinecap="round"
          />
          {/* Subtle secondary echoing line */}
          <path 
            d="M-30,220 C320,70 570,370 970,170 C1220,40 1370,300 1570,120" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeDasharray="4 8" 
            strokeLinecap="round"
            className="opacity-50"
          />
        </svg>
      </motion.div>

      {/* Bottom atmospheric shading */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#FFFDFB] via-[#FFFDFB]/40 to-transparent pointer-events-none" />
    </div>
  );
};

export default HeroReactiveBackground;
