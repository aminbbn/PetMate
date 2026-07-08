import React, { useState, useRef } from 'react';
import { cn } from '../lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';

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
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });

    if (hoverEffect) {
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;
      // Normalized delta from center (-1 to 1)
      const nx = (x - centerX) / centerX;
      const ny = (y - centerY) / centerY;
      // Ultra-subtle micro-parallax shift (max 2px)
      setParallax({
        x: nx * 2,
        y: ny * 2
      });
    }

    if (onMouseMove) onMouseMove(e as any);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    if (onMouseEnter) onMouseEnter(e as any);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(false);
    setParallax({ x: 0, y: 0 });
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

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "bg-white rounded-[24px] p-8 relative overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group",
        "border border-coral-light/20 backdrop-blur-md",
        hoverEffect && "hover:-translate-y-1.5 hover:shadow-[0_25px_50px_-12px_rgba(232,90,93,0.12),0_12px_30px_-10px_rgba(255,181,107,0.06)]",
        glow 
          ? glowColors[glowColor] 
          : "shadow-[0_12px_40px_rgba(232,90,93,0.03),0_4px_16px_rgba(255,179,174,0.04)]",
        className
      )}
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
        <div 
          className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(circle 160px at ${coords.x}px ${coords.y}px, rgba(232,90,93,0.09) 0%, rgba(255,181,107,0.04) 45%, transparent 100%)`
          }}
        />
      )}

      {/* 3. Proximity Border Lighting Overlay */}
      {hoverEffect && (
        <div 
          className="absolute pointer-events-none z-20 transition-opacity duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            inset: '-1px',
            borderRadius: 'inherit',
            opacity: isHovered ? 1 : 0,
            border: '3.5px solid transparent',
            background: `radial-gradient(circle 140px at ${coords.x}px ${coords.y}px, rgba(232,90,93,0.55) 0%, rgba(255,181,107,0.35) 45%, transparent 100%) border-box`,
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'destination-out',
            maskComposite: 'exclude',
          }}
        />
      )}

      {/* 4. Micro-Parallax Shift Container */}
      <motion.div 
        className="relative z-10 w-full h-full flex flex-col justify-between"
        animate={{
          x: isHovered ? parallax.x : 0,
          y: isHovered ? parallax.y : 0,
        }}
        transition={{
          type: "tween",
          ease: "easeOut",
          duration: 0.25
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
