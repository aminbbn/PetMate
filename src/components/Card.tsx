import React, { useRef, useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { motion, HTMLMotionProps, useMotionValue, useSpring, useTransform } from 'motion/react';
import { usePreferences } from '../preferences/PreferencesProvider';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'as'> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hoverEffect?: boolean;
  ambientCorner?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  cursorGlow?: boolean;
  edgeGlow?: boolean;
  hoverLift?: boolean;
  glowIntensity?: 'subtle' | 'normal';
  contentClassName?: string;
  selected?: boolean;
  as?: 'div' | 'button';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  contentParallax?: boolean;
}

const THEME_CARD_GLOW = {
  rgb: '255, 111, 114',
  innerAlpha: 0.12,
  edgeAlpha: 0.64,
} as const;

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  glow = false, 
  hoverEffect = true,
  ambientCorner,
  cursorGlow = true,
  edgeGlow = true,
  hoverLift = true,
  glowIntensity = 'normal',
  contentClassName,
  selected = false,
  contentParallax = true,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  as = 'div',
  ...props 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { reducedMotion: reducedMotionGlobal, cursorGlowEnabled: cursorGlowEnabledGlobal, edgeGlowEnabled: edgeGlowEnabledGlobal } = usePreferences();
  
  // Motion values to completely bypass React virtual DOM re-renders on pointermove
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Snappy yet fluid springs for cursor tracking coordinates (stiffness 120, damping 25)
  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 25, mass: 0.6 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 25, mass: 0.6 });

  // Smooth spring for the interactive fade-in / fade-out
  const hoverOpacity = useMotionValue(0);
  const smoothOpacity = useSpring(hoverOpacity, { stiffness: 120, damping: 25 });

  // Floating, loose water-like springs for the sub-element micro-parallax response
  const parallaxX = useMotionValue(0);
  const parallaxY = useMotionValue(0);
  const smoothParallaxX = useSpring(parallaxX, { stiffness: 35, damping: 22 });
  const smoothParallaxY = useSpring(parallaxY, { stiffness: 35, damping: 22 });

  // Environment checks for prefers-reduced-motion and touch devices
  const [reducedMotionLocal, setReducedMotionLocal] = useState(false);
  const [isHoverSupported, setIsHoverSupported] = useState(false);

  useEffect(() => {
    const mediaQueryRM = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotionLocal(mediaQueryRM.matches);
    const listenerRM = (e: MediaQueryListEvent) => setReducedMotionLocal(e.matches);
    mediaQueryRM.addEventListener('change', listenerRM);

    const mediaQueryHover = window.matchMedia('(hover: hover)');
    setIsHoverSupported(mediaQueryHover.matches);
    const listenerHover = (e: MediaQueryListEvent) => setIsHoverSupported(e.matches);
    mediaQueryHover.addEventListener('change', listenerHover);

    return () => {
      mediaQueryRM.removeEventListener('change', listenerRM);
      mediaQueryHover.removeEventListener('change', listenerHover);
    };
  }, []);

  const isReducedMotion = reducedMotionLocal || reducedMotionGlobal;
  const isCursorGlowActive = cursorGlow && cursorGlowEnabledGlobal && !isReducedMotion;
  const isEdgeGlowActive = edgeGlow && edgeGlowEnabledGlobal && !isReducedMotion;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    if (!isHoverSupported) return;

    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set(x);
    mouseY.set(y);

    if (hoverEffect && contentParallax) {
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;
      // Normalized delta from center (-1 to 1)
      const nx = (x - centerX) / centerX;
      const ny = (y - centerY) / centerY;
      // Extremely subtle micro-parallax shift (max 1.8px to prevent text wobble / motion sickness)
      const pAmount = !isReducedMotion ? 1.8 : 0;
      parallaxX.set(nx * pAmount);
      parallaxY.set(ny * pAmount);
    }

    if (onMouseMove) onMouseMove(e as any);
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    if (!isHoverSupported) return;

    hoverOpacity.set(1);

    // Position immediately on enter to prevent visual lag from previous card coordinates
    const el = containerRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX.set(x);
      mouseY.set(y);
    }

    if (onMouseEnter) onMouseEnter(e as any);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    
    hoverOpacity.set(0);
    parallaxX.set(0);
    parallaxY.set(0);
    if (onMouseLeave) onMouseLeave(e as any);
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

  // Map chosen glow style - Always use canonical THEME_CARD_GLOW
  const intensityMultiplier = glowIntensity === 'subtle' ? 0.6 : 1;
  const innerAlpha = THEME_CARD_GLOW.innerAlpha * intensityMultiplier;
  const edgeAlpha = THEME_CARD_GLOW.edgeAlpha * intensityMultiplier;
  const rgb = THEME_CARD_GLOW.rgb;

  // Transform inner glow with mapped colors
  const backgroundGlow = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `radial-gradient(circle 200px at ${x}px ${y}px, rgba(${rgb}, ${innerAlpha}) 0%, rgba(${rgb}, ${innerAlpha * 0.4}) 45%, transparent 100%)`
  );

  // Transform localized edge glow
  const borderGlowGradient = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `radial-gradient(circle 100px at ${x}px ${y}px, rgba(${rgb}, ${edgeAlpha}) 0%, rgba(${rgb}, ${edgeAlpha * 0.4}) 40%, transparent 80%)`
  );

  const Component = as === 'button' ? (motion.button as any) : motion.div;

  return (
    <Component
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "rounded-[24px] p-6 relative overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group",
        selected 
          ? "bg-coral/[0.03] border border-coral shadow-[0_12px_40px_rgba(255,111,114,0.06)]"
          : "bg-white border border-pm-stroke-subtle shadow-[0_12px_40px_rgba(232,90,93,0.03),0_4px_16px_rgba(255,179,174,0.04)]",
        glow && "shadow-[0_20px_50px_rgba(255,111,114,0.10),0_8px_24px_rgba(255,111,114,0.05)] border-coral-light/30",
        className
      )}
      whileHover={hoverEffect && hoverLift && !isReducedMotion ? {
        y: -3, // signature lift is max -3px (highly premium, restrained)
        transition: { type: "spring", stiffness: 120, damping: 25 }
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
      {hoverEffect && isCursorGlowActive && (
        <motion.div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            opacity: smoothOpacity,
            background: backgroundGlow
          }}
        />
      )}

      {/* 3. Localized Edge/Border Glow Overlay */}
      {hoverEffect && isEdgeGlowActive && (
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            padding: '1.2px',
            borderRadius: 'inherit',
            pointerEvents: 'none',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            background: borderGlowGradient,
            opacity: smoothOpacity,
            zIndex: 1,
          } as any}
          aria-hidden="true"
        />
      )}

      {/* 4. Micro-Parallax Shift Container */}
      <motion.div 
        className={cn("relative z-10 w-full h-full", contentClassName)}
        style={{
          x: contentParallax ? smoothParallaxX : undefined,
          y: contentParallax ? smoothParallaxY : undefined,
        }}
      >
        {children}
      </motion.div>
    </Component>
  );
};
