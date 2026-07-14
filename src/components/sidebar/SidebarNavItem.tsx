import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useMotionPreferences } from '../../motion/useMotionPreferences';
import { useAppStore } from '../../store';
import { SidebarNavIcon } from './SidebarNavIcon';

interface SidebarNavItemProps {
  icon: LucideIcon;
  path: string;
  label: string;
  isAi?: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  icon: Icon,
  path,
  label,
  isAi = false,
  isCollapsed,
  onClick
}) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  const containerRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPreferences();
  const preferences = useAppStore(state => state.preferences);

  // Settings from the global preference store for micro-interactions
  const cursorGlowEnabled = preferences?.motion?.cursorGlowEnabled ?? true;
  const edgeGlowEnabled = preferences?.motion?.edgeGlowEnabled ?? true;
  const semanticIconsEnabled = preferences?.motion?.semanticIconAnimationsEnabled ?? true;

  // Hover state
  const [isHovered, setIsHovered] = useState(false);
  // Focus state
  const [isFocused, setIsFocused] = useState(false);

  // Motion values for cursor tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for fluid tracking
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20, mass: 0.5 });

  // Smooth spring for glow opacity fade-in / out
  const hoverOpacity = useMotionValue(0);
  const smoothOpacity = useSpring(hoverOpacity, { stiffness: 140, damping: 22 });

  // Is hover supported?
  const [isHoverSupported, setIsHoverSupported] = useState(false);

  useEffect(() => {
    const mediaQueryHover = window.matchMedia('(hover: hover)');
    setIsHoverSupported(mediaQueryHover.matches);
    const listener = (e: MediaQueryListEvent) => setIsHoverSupported(e.matches);
    mediaQueryHover.addEventListener('change', listener);
    return () => mediaQueryHover.removeEventListener('change', listener);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    if (!isHoverSupported || !cursorGlowEnabled) return;

    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    setIsHovered(true);
    
    if (isHoverSupported && cursorGlowEnabled) {
      hoverOpacity.set(1);
      const el = containerRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    }
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    setIsHovered(false);
    hoverOpacity.set(0);
  };

  // Radial glow color mapping: AI uses golden/sunny, regular uses peach/coral
  const rgb = isAi ? '255, 181, 107' : '232, 90, 93'; // sunny vs coral
  const innerAlpha = isAi ? 0.08 : 0.06;
  const edgeAlpha = isAi ? 0.6 : 0.5;

  const backgroundGlow = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `radial-gradient(circle 80px at ${x}px ${y}px, rgba(${rgb}, ${innerAlpha}) 0%, rgba(${rgb}, ${innerAlpha * 0.3}) 50%, transparent 100%)`
  );

  const borderGlowGradient = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `radial-gradient(circle 50px at ${x}px ${y}px, rgba(${rgb}, ${edgeAlpha}) 0%, rgba(${rgb}, ${edgeAlpha * 0.3}) 50%, transparent 100%)`
  );

  // Hover fixed translation
  // - Inactive expanded item: x: -2px (max allowed: -3px), return to x: 0 on leave
  // - Active item: x: 0 (or max x: -1px)
  // - Collapsed item: x: 0 (or max x: -1px)
  const hoverX = reducedMotion
    ? 0
    : isCollapsed
      ? 0
      : isActive
        ? 0
        : -2;

  const tapScale = reducedMotion ? 1 : 0.98;

  return (
    <Link 
      to={path} 
      onClick={onClick}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className="block outline-none rounded-xl focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-1 focus-visible:border-coral"
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
    >
      <motion.div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        whileTap={{ scale: tapScale }}
        whileHover={{ x: hoverX }}
        transition={{
          x: { type: "tween", ease: [0.25, 1, 0.5, 1], duration: 0.18 },
          scale: { type: "tween", ease: "easeInOut", duration: 0.11 }
        }}
        className={cn(
          "relative flex items-center rounded-xl font-bold cursor-pointer overflow-hidden border group",
          isCollapsed ? "justify-center p-2.5 h-11 w-11 mx-auto" : "px-4 py-2.5 gap-3",
          
          // Outer container has solid base background and border transparent by default (actual borders and background managed by layoutId)
          "bg-white border-transparent",
          
          // Text color & Font weight styling
          isActive
            ? isAi ? "text-sunny-deep font-black" : "text-coral-deep font-black"
            : "text-gray-500 hover:text-gray-800",
            
          // Base item transition
          "transition-colors duration-200 outline-none"
        )}
      >
        {/* Shared sliding background layoutId - completely uniform 1px border on all sides */}
        {isActive && (
          <motion.div
            layoutId="sidebar-active-item"
            className={cn(
              "absolute inset-0 z-0 rounded-xl border",
              isAi 
                ? "bg-sunny/[0.08] border-sunny/30" 
                : "bg-coral/[0.08] border-coral/30"
            )}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}

        {/* Dynamic Hover background and border for inactive items (no layout shift since border-transparent is replaced) */}
        {!isActive && (
          <div className={cn(
            "absolute inset-0 z-0 rounded-xl border border-transparent transition-colors duration-200 pointer-events-none opacity-0 group-hover:opacity-100",
            isAi 
              ? "bg-sunny/[0.04] border-sunny/10" 
              : "bg-peach/[0.04] border-coral/10"
          )} />
        )}

        {/* Right-Side Active Indicator - short, vertical, rounded-full coral/sunny line */}
        {isActive && (
          <motion.span
            layoutId="sidebar-active-indicator"
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full z-20",
              isAi 
                ? "bg-sunny shadow-[0_0_4px_rgba(255,181,107,0.4)]" 
                : "bg-coral shadow-[0_0_4px_rgba(232,90,93,0.4)]",
              isCollapsed 
                ? "right-[6px] h-4 w-[3px]" 
                : "right-[6px] h-5 w-[3px]"
            )}
            initial={{ opacity: 0, scaleY: 0.65 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Cursor tracking inner radial glow */}
        {cursorGlowEnabled && !reducedMotion && (
          <motion.div 
            className="absolute inset-0 pointer-events-none z-1"
            style={{
              opacity: smoothOpacity,
              background: backgroundGlow
            }}
          />
        )}

        {/* Cursor tracking border glow (masked) */}
        {edgeGlowEnabled && !reducedMotion && (
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              padding: '1px',
              borderRadius: 'inherit',
              pointerEvents: 'none',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              background: borderGlowGradient,
              opacity: smoothOpacity,
              zIndex: 2,
            } as any}
            aria-hidden="true"
          />
        )}

        {/* Icon wrapper - Fixed size to prevent layout shifts */}
        <div className="relative z-10 shrink-0 flex items-center justify-center w-5 h-5">
          <SidebarNavIcon
            path={path}
            isActive={isActive}
            isHovered={isHovered}
            isFocused={isFocused}
            isAi={isAi}
            size={18}
            strokeWidth={2}
            semanticIconsEnabled={semanticIconsEnabled}
            reducedMotion={reducedMotion}
          />
        </div>

        {/* Label (hidden in desktop-collapsed with exit animations) */}
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0, x: 5 }}
              animate={{ opacity: 1, width: 'auto', x: 0 }}
              exit={{ opacity: 0, width: 0, x: 5 }}
              transition={{ duration: 0.15 }}
              className="text-xs relative z-10 select-none overflow-hidden whitespace-nowrap text-right flex-1"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* AI Tag indicator */}
        {isAi && !isCollapsed && (
          <span className="bg-sunny/20 text-sunny-deep text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider shrink-0 scale-90 relative z-10 select-none">
            AI
          </span>
        )}

        {/* Left-aligned Tooltip for Desktop-Collapsed (RTL layout: Sidebar is on the right, so tooltips pop out to the left) */}
        <AnimatePresence>
          {isCollapsed && isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.15, ease: [0.25, 1, 0.5, 1] }}
              className="absolute left-[-12px] -translate-x-full top-1/2 -translate-y-1/2 flex items-center z-50 pointer-events-none select-none"
              dir="rtl"
            >
              {/* Tooltip Content Card */}
              <div className="bg-gray-900/95 text-white text-[11px] py-1.5 px-3 rounded-lg shadow-xl backdrop-blur-md border border-white/10 font-sans font-bold whitespace-nowrap flex items-center gap-1.5">
                <span>{label}</span>
                {isAi && (
                  <span className="bg-sunny text-gray-900 text-[8px] px-1 py-0.2 rounded font-black">
                    AI
                  </span>
                )}
              </div>
              
              {/* Small sleek triangle arrow pointing to the right (towards the sidebar item) */}
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[5px] border-l-gray-900/95 mr-[-1px]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
};
