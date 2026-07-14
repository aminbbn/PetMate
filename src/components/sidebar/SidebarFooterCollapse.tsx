import React, { useRef, useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useMotionPreferences } from '../../motion/useMotionPreferences';
import { useAppStore } from '../../store';

interface SidebarFooterCollapseProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const SidebarFooterCollapse: React.FC<SidebarFooterCollapseProps> = ({
  isCollapsed,
  onToggle
}) => {
  const containerRef = useRef<HTMLButtonElement>(null);
  const { reducedMotion } = useMotionPreferences();
  const preferences = useAppStore(state => state.preferences);

  const cursorGlowEnabled = preferences?.motion?.cursorGlowEnabled ?? true;
  const edgeGlowEnabled = preferences?.motion?.edgeGlowEnabled ?? true;

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Glow cursor tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20, mass: 0.5 });
  const hoverOpacity = useMotionValue(0);
  const smoothOpacity = useSpring(hoverOpacity, { stiffness: 140, damping: 22 });

  const [isHoverSupported, setIsHoverSupported] = useState(false);

  useEffect(() => {
    const mediaQueryHover = window.matchMedia('(hover: hover)');
    setIsHoverSupported(mediaQueryHover.matches);
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    if (!isHoverSupported || !cursorGlowEnabled) return;

    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handlePointerEnter = (e: React.PointerEvent) => {
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

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    setIsHovered(false);
    hoverOpacity.set(0);
  };

  const rgb = '232, 90, 93'; // Coral glow
  const innerAlpha = 0.04;
  const edgeAlpha = 0.4;

  const backgroundGlow = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `radial-gradient(circle 60px at ${x}px ${y}px, rgba(${rgb}, ${innerAlpha}) 0%, rgba(${rgb}, ${innerAlpha * 0.3}) 50%, transparent 100%)`
  );

  const borderGlowGradient = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `radial-gradient(circle 40px at ${x}px ${y}px, rgba(${rgb}, ${edgeAlpha}) 0%, rgba(${rgb}, ${edgeAlpha * 0.3}) 50%, transparent 100%)`
  );

  const labelText = isCollapsed ? 'بازکردن نوار کناری' : 'جمع‌کردن نوار کناری';

  return (
    <button
      ref={containerRef}
      onClick={onToggle}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      aria-expanded={!isCollapsed}
      aria-label={labelText}
      className={cn(
        "relative w-11 h-11 flex items-center justify-center rounded-xl border border-transparent font-bold cursor-pointer overflow-hidden transition-all duration-200 outline-none select-none text-gray-500 hover:text-coral bg-white hover:bg-peach/[0.04] focus-visible:ring-2 focus-visible:ring-coral/40 focus-visible:border-coral shrink-0 mx-auto"
      )}
    >
      {/* Dynamic Hover background and border */}
      <div className="absolute inset-0 z-0 rounded-xl border border-transparent transition-colors duration-200 pointer-events-none opacity-0 hover:opacity-100 bg-peach/[0.02] border-coral/5" />

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

      {/* Cursor tracking border glow */}
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

      {/* Chevron Icon indicating collapse direction (In RTL, collapse direction is toward the right margin, expand direction is toward left/content) */}
      <div className="relative z-10 flex items-center justify-center shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-600">
        {isCollapsed ? (
          <ChevronLeft size={16} strokeWidth={2.5} className="text-coral" />
        ) : (
          <ChevronRight size={16} strokeWidth={2.5} />
        )}
      </div>

      {/* Tooltip for hover mode */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.15, ease: [0.25, 1, 0.5, 1] }}
            className="absolute left-[-12px] -translate-x-full top-1/2 -translate-y-1/2 flex items-center z-50 pointer-events-none select-none"
            dir="rtl"
          >
            <div className="bg-gray-900/95 text-white text-[11px] py-1.5 px-3 rounded-lg shadow-xl backdrop-blur-md border border-white/10 font-sans font-bold whitespace-nowrap">
              {labelText}
            </div>
            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[5px] border-l-gray-900/95 mr-[-1px]" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};
