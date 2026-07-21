import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const HeroReactiveBackground: React.FC = () => {
  const [isMobile, setIsMobile] = useState(true);

  // Smooth mouse coordinates with spring interpolation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 45, stiffness: 120, mass: 1 };
  const trailX = useSpring(mouseX, springConfig);
  const trailY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth >= 768) {
        mouseX.set(e.clientX - window.innerWidth / 2);
        mouseY.set(e.clientY - window.innerHeight / 2);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-dot-grid">
      {/* Dynamic Cursor Light Field (Only on desktop) */}
      {!isMobile && (
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial from-coral/6 via-sunny/3 to-transparent rounded-full blur-[110px]"
          style={{
            x: trailX,
            y: trailY,
          }}
        />
      )}

      {/* Layered Floating Soft Blobs */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-coral-light rounded-full blur-[130px] opacity-[0.06]"
      />

      <motion.div
        animate={{
          x: [0, -30, 40, 0],
          y: [0, 60, -40, 0],
          scale: [1, 0.85, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-10%] left-[5%] w-[600px] h-[600px] bg-sunny rounded-full blur-[140px] opacity-[0.05]"
      />

      <motion.div
        animate={{
          x: [0, 30, -30, 0],
          y: [0, 40, -50, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-peach rounded-full blur-[120px] opacity-[0.08]"
      />

      {/* Decorative Orbs & Grid lines */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDFB]/10 via-transparent to-[#FFFDFB]" />
    </div>
  );
};
