import React, { useRef } from 'react';
import { cn } from '../lib/utils';
import { motion, HTMLMotionProps, useMotionValue, useSpring, useTransform } from 'motion/react';

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  glowColor?: 'coral' | 'mint' | 'sunny';
  hoverEffect?: boolean;
  ambientCorner?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  glow = false, 
  glowColor = 'coral',
  hoverEffect = true,
  ambientCorner,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  ...props 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values to completely bypass React virtual DOM re-renders on mousemove
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Soft, fluid springs for cursor tracking coordinates
  const smoothX = useSpring(mouseX, { stiffness: 55, damping: 22, mass: 0.8 });
  const smoothY = useSpring(mouseY, { stiffness: 55, damping: 22, mass: 0.8 });

  // Smooth spring for the interactive fade-in / fade-out
  const hoverOpacity = useMotionValue(0);
  const smoothOpacity = useSpring(hoverOpacity, { stiffness: 60, damping: 18 });

  // Floating, loose water-like springs for the sub-element micro-parallax response
  const parallaxX = useMotionValue(0);
  const parallaxY = useMotionValue(0);
  const smoothParallaxX = useSpring(parallaxX, { stiffness: 35, damping: 22 });
  const smoothParallaxY = useSpring(parallaxY, { stiffness: 35, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set(x);
    mouseY.set(y);

    if (hoverEffect) {
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;
      // Normalized delta from center (-1 to 1)
      const nx = (x - centerX) / centerX;
      const ny = (y - centerY) / centerY;
      // Beautiful liquid micro-parallax shift (max 3.5px for that signature floating feel)
      parallaxX.set(nx * 3.5);
      parallaxY.set(ny * 3.5);
    }

    if (onMouseMove) onMouseMove(e as any);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    hoverOpacity.set(1);
    if (onMouseEnter) onMouseEnter(e as any);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    hoverOpacity.set(0);
    parallaxX.set(0);
    parallaxY.set(0);
    if (onMouseLeave) onMouseLeave(e as any);
  };

  const glowColors = {
    coral: "shadow-[0_20px_50px_rgba(255,111,114,0.12),0_8px_24px_rgba(255,111,114,0.06)] border-coral-light/30",
    mint: "shadow-[0_20px_50px_rgba(74,222,128,0.15),0_8px_24px_rgba(74,222,128,0.06)] border-mint/30",
    sunny: "shadow-[0_20px_50px_rgba(255,181,107,0.15),0_8px_24px_rgba(255,181,107,0.06)] border-sunny/30",
  };

  const getCornerStyle = (corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
    switch (corner) {
      case 'top-left':
        return 'bg-[radial-gradient(circle_at_top_left,rgba(255,111,114,0.07)_0%,transparent_65%)]';
      case 'top-right':
        return 'bg-[radial-gradient(circle_at_top_right,rgba(255,111,114,0.07)_0%,transparent_65%)]';
      case 'bottom-left':
        return 'bg-[radial-gradient(circle_at_bottom_left,rgba(255,111,114,0.07)_0%,transparent_65%)]';
      case 'bottom-right':
        return 'bg-[radial-gradient(circle_at_bottom_right,rgba(255,111,114,0.07)_0%,transparent_65%)]';
    }
  };

  const backgroundGlow = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `radial-gradient(circle 160px at ${x}px ${y}px, rgba(232,90,93,0.11) 0%, rgba(255,181,107,0.05) 45%, transparent 100%)`
  );

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "bg-white rounded-[24px] p-6 relative overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group",
        "border border-coral-light/20 backdrop-blur-md",
        glow 
          ? glowColors[glowColor] 
          : "shadow-[0_12px_40px_rgba(232,90,93,0.03),0_4px_16px_rgba(255,179,174,0.04)]",
        className
      )}
      whileHover={hoverEffect ? {
        y: -6,
        transition: { type: "spring", stiffness: 45, damping: 20 }
      } : undefined}
      {...props}
    >
      {/* 1. Ambient Corner Glow (Static Decorative Layer) */}
      {ambientCorner && (
        <div 
          className={cn(
            "absolute inset-0 pointer-events-none z-0 transition-all duration-500",
            getCornerStyle(ambientCorner)
          )}
        />
      )}

      {/* 2. Cursor-Tracking Soft Radial Hover Glow */}
      {hoverEffect && (
        <motion.div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            opacity: smoothOpacity,
            background: backgroundGlow
          }}
        />
      )}

      {/* 4. Micro-Parallax Shift Container - Fluid floating-in-water response */}
      <motion.div 
        className="relative z-10 w-full h-full flex flex-col justify-between"
        style={{
          x: smoothParallaxX,
          y: smoothParallaxY,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
