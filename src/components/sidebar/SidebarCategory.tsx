import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useMotionPreferences } from '../../motion/useMotionPreferences';
import { useAppStore } from '../../store';
import { SidebarItem, SidebarCategoryId, SidebarMode } from './sidebarTypes';
import { SidebarNavItem } from './SidebarNavItem';

interface SidebarCategoryProps {
  id: SidebarCategoryId;
  label: string;
  icon: React.ComponentType<any>;
  items: SidebarItem[];
  isOpen: boolean;
  containsActiveRoute: boolean;
  onToggle: (id: SidebarCategoryId) => void;
  sidebarMode: SidebarMode;
  isFlyoutOpen: boolean;
  onFlyoutOpen: (id: SidebarCategoryId) => void;
  onFlyoutClose: (id: SidebarCategoryId) => void;
}

export const SidebarCategory: React.FC<SidebarCategoryProps> = ({
  id,
  label,
  icon: Icon,
  items,
  isOpen,
  containsActiveRoute,
  onToggle,
  sidebarMode,
  isFlyoutOpen,
  onFlyoutOpen,
  onFlyoutClose
}) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const flyoutWrapperRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useMotionPreferences();
  const preferences = useAppStore(state => state.preferences);

  const cursorGlowEnabled = preferences?.motion?.cursorGlowEnabled ?? true;
  const edgeGlowEnabled = preferences?.motion?.edgeGlowEnabled ?? true;
  const semanticIconsEnabled = preferences?.motion?.semanticIconAnimationsEnabled ?? true;

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [flyoutCoords, setFlyoutCoords] = useState({ top: 0, left: 0 });

  // Find if there is an active item inside this category
  const activeChild = items.find(item => location.pathname === item.path);

  // Mouse coordinate motion values for glow tracking
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
    if (!isHoverSupported || !cursorGlowEnabled || sidebarMode === 'collapsed') return;

    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    setIsHovered(true);
    
    if (isHoverSupported && cursorGlowEnabled && sidebarMode !== 'collapsed') {
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

  const isAi = id === 'smart-guides';
  const rgb = isAi ? '255, 181, 107' : '232, 90, 93'; // Sunny vs Coral
  const innerAlpha = isAi ? 0.05 : 0.04;
  const edgeAlpha = isAi ? 0.4 : 0.4;

  const backgroundGlow = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `radial-gradient(circle 70px at ${x}px ${y}px, rgba(${rgb}, ${innerAlpha}) 0%, rgba(${rgb}, ${innerAlpha * 0.3}) 50%, transparent 100%)`
  );

  const borderGlowGradient = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `radial-gradient(circle 45px at ${x}px ${y}px, rgba(${rgb}, ${edgeAlpha}) 0%, rgba(${rgb}, ${edgeAlpha * 0.3}) 50%, transparent 100%)`
  );

  const updateFlyoutCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setFlyoutCoords({
        top: rect.top,
        left: rect.left - 254 // Wrapper left is left of trigger - 254px (250px flyout + 4px transparent padding-right)
      });
    }
  };

  const closeFlyout = () => {
    onFlyoutClose(id);
  };

  // Keep coordinates updated when open
  useEffect(() => {
    if (isFlyoutOpen) {
      updateFlyoutCoords();
    }
  }, [isFlyoutOpen]);

  // Close flyout on Escape key
  useEffect(() => {
    if (!isFlyoutOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeFlyout();
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlyoutOpen]);

  // Close flyout on click outside using ref
  useEffect(() => {
    if (!isFlyoutOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isNodeInside(e.target, triggerRef.current) ||
        isNodeInside(e.target, flyoutWrapperRef.current)
      ) {
        return;
      }
      closeFlyout();
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isFlyoutOpen]);

  const isNodeInside = (
    target: EventTarget | null,
    element: HTMLElement | null
  ): boolean => {
    return target instanceof Node && !!element?.contains(target);
  };

  const isCoordsInside = (
    clientX: number,
    clientY: number,
    element: HTMLElement | null
  ): boolean => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
  };

  const isPointerEnteringOther = (
    event: React.PointerEvent<any>,
    otherElement: HTMLElement | null
  ): boolean => {
    const nextTarget = event.relatedTarget;
    if (nextTarget && isNodeInside(nextTarget, otherElement)) {
      return true;
    }
    if (otherElement) {
      return isCoordsInside(event.clientX, event.clientY, otherElement);
    }
    return false;
  };

  const handleTriggerPointerEnter = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'touch') return;
    setIsHovered(true);
    updateFlyoutCoords();
    onFlyoutOpen(id);
  };

  const handleTriggerPointerLeave = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'touch') return;
    setIsHovered(false);
    
    if (isPointerEnteringOther(event, flyoutWrapperRef.current)) {
      return;
    }
    closeFlyout();
  };

  const handleFlyoutPointerEnter = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;
    onFlyoutOpen(id);
  };

  const handleFlyoutPointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;
    
    if (isPointerEnteringOther(event, triggerRef.current)) {
      return;
    }
    closeFlyout();
  };

  const handleCombinedBlur = (event: React.FocusEvent<any>) => {
    const nextTarget = event.relatedTarget;
    if (
      isNodeInside(nextTarget, triggerRef.current) ||
      isNodeInside(nextTarget, flyoutWrapperRef.current)
    ) {
      return;
    }
    closeFlyout();
  };

  const handleTriggerClick = () => {
    if (isFlyoutOpen) {
      closeFlyout();
    } else {
      updateFlyoutCoords();
      onFlyoutOpen(id);
    }
  };

  // Category Icon Animations
  const iconVariants: any = {
    normal: {
      scale: 1,
      y: 0,
      rotate: 0,
      transition: { duration: 0.2, ease: "easeIn" }
    },
    hover: {
      scale: semanticIconsEnabled && !reducedMotion ? (id === 'smart-guides' ? [1, 1.15, 0.95, 1.05, 1] : 1.1) : 1,
      y: semanticIconsEnabled && !reducedMotion && id === 'daily-care' ? [0, -3, 0] : 0,
      rotate: semanticIconsEnabled && !reducedMotion && id === 'services' ? [0, 20, -10, 0] : (id === 'smart-guides' ? [0, 15, -15, 0] : 0),
      transition: { 
        duration: id === 'smart-guides' ? 0.55 : 0.45, 
        ease: "easeInOut" 
      }
    }
  };

  // Chevron animation (rotates 180 deg when open)
  const chevronRotate = isOpen ? 180 : 0;
  const isTriggerActive = containsActiveRoute;

  return (
    <AnimatePresence mode="wait">
      {sidebarMode === 'collapsed' ? (
        <motion.div
          key="collapsed"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="relative flex justify-center py-1 w-full"
        >
          <button
            ref={triggerRef}
            type="button"
            onPointerEnter={handleTriggerPointerEnter}
            onPointerLeave={handleTriggerPointerLeave}
            onClick={handleTriggerClick}
            onFocus={() => {
              setIsFocused(true);
              updateFlyoutCoords();
              onFlyoutOpen(id);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              handleCombinedBlur(e);
            }}
            className={cn(
              "relative w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-200 outline-none select-none cursor-pointer overflow-hidden focus-visible:ring-2 focus-visible:ring-coral/40",
              isTriggerActive
                ? "bg-coral/[0.08] border-coral/30 text-coral-deep shadow-sm"
                : "bg-white border-transparent text-gray-400 hover:text-gray-700 hover:bg-peach/[0.04]"
            )}
            aria-expanded={isFlyoutOpen}
            aria-label={label}
            aria-controls={`sidebar-flyout-${id}`}
            aria-haspopup="true"
          >
            {/* Active status indicator dot */}
            {isTriggerActive && (
              <motion.span
                layoutId={`collapsed-active-indicator-${id}`}
                className="absolute right-[6px] top-1/2 -translate-y-1/2 w-[3px] h-4 bg-coral rounded-full shadow-[0_0_4px_rgba(232,90,93,0.4)] pointer-events-none"
              />
            )}

            <motion.div
              variants={iconVariants}
              animate={isHovered || isFocused || isFlyoutOpen ? "hover" : "normal"}
              className={cn(
                "relative z-10 flex items-center justify-center shrink-0 w-5 h-5",
                isTriggerActive 
                  ? isAi ? "text-sunny" : "text-coral"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon size={18} strokeWidth={2} />
            </motion.div>

            {/* Golden Sparkles for AI Section trigger */}
            {isAi && (
              <Sparkles size={8} className="absolute top-1.5 left-1.5 text-sunny animate-pulse pointer-events-none" />
            )}
          </button>

          {/* Portal-based Flyout Menu with AnimatePresence for exit animations and transparent bridge */}
          {createPortal(
            <AnimatePresence>
              {isFlyoutOpen && (
                <div
                  ref={flyoutWrapperRef}
                  style={{
                    position: 'fixed',
                    top: flyoutCoords.top,
                    left: flyoutCoords.left,
                    width: '254px',
                    paddingRight: '4px', // 4px transparent hover bridge to trigger
                    zIndex: 9999,
                    pointerEvents: isFlyoutOpen ? 'auto' : 'none'
                  }}
                  className="outline-none"
                  onPointerEnter={handleFlyoutPointerEnter}
                  onPointerLeave={handleFlyoutPointerLeave}
                  onBlur={handleCombinedBlur}
                >
                  <motion.div
                    ref={flyoutRef}
                    id={`sidebar-flyout-${id}`}
                    role="navigation"
                    aria-label={label}
                    initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={
                      reducedMotion
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            x: 3,
                            transition: { duration: 0.09, ease: 'easeOut' }
                          }
                    }
                    transition={{ duration: 0.12, ease: 'easeOut' }}
                    className="w-[250px] bg-white/95 backdrop-blur-md rounded-2xl border border-coral-light/20 shadow-2xl p-3 flex flex-col font-sans text-right"
                    dir="rtl"
                  >
                    {/* Flyout Header */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 select-none">
                      <span className={cn(
                        "text-xs font-black tracking-tight",
                        isAi ? "text-sunny-deep flex items-center gap-1" : "text-gray-800"
                      )}>
                        {isAi && <Sparkles size={11} className="text-sunny animate-pulse" />}
                        {label}
                      </span>
                      {activeChild && (
                        <span className="text-[10px] text-gray-400 font-bold bg-peach/10 px-2 py-0.5 rounded-md">
                          {activeChild.label}
                        </span>
                      )}
                    </div>

                    {/* Child Links */}
                    <div className="space-y-1">
                      {items.map(item => (
                        <SidebarNavItem
                          key={item.path}
                          icon={item.icon}
                          path={item.path}
                          label={item.label}
                          isAi={item.isAi}
                          isCollapsed={false}
                          onClick={closeFlyout}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>,
            document.body
          )}
        </motion.div>
      ) : (
        <motion.div
          key="expanded"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          className="space-y-1 w-full"
        >
          {/* Category Header Row button */}
          <button
            ref={triggerRef}
            onClick={() => onToggle(id)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "relative w-full flex items-center justify-between h-11 px-4 rounded-xl border transition-all duration-200 outline-none select-none cursor-pointer overflow-hidden",
              isOpen
                ? "bg-peach/[0.08] border-coral-light/10"
                : "bg-white border-transparent",
              // Hover translate shift: exact 2px left-offset in RTL
              "hover:translate-x-[-2px]"
            )}
            style={{
              transition: "transform 0.18s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.2s, border-color 0.2s"
            }}
            aria-expanded={isOpen}
            aria-controls={`category-children-${id}`}
          >
            {/* Dynamic Glow and effects */}
            {cursorGlowEnabled && !reducedMotion && (
              <motion.div 
                className="absolute inset-0 pointer-events-none z-1"
                style={{
                  opacity: smoothOpacity,
                  background: backgroundGlow
                }}
              />
            )}

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

            {/* Right side: Icon + Labels */}
            <div className="flex items-center gap-3 relative z-10 pointer-events-none">
              <motion.div
                variants={iconVariants}
                animate={isHovered || isFocused ? "hover" : "normal"}
                className={cn(
                  "flex items-center justify-center shrink-0 w-5 h-5",
                  isTriggerActive 
                    ? isAi ? "text-sunny" : "text-coral"
                    : "text-gray-400 group-hover:text-gray-600"
                )}
              >
                <Icon size={18} strokeWidth={2} />
              </motion.div>

              <div className="flex flex-col text-right leading-none">
                <span className={cn(
                  "text-xs font-black transition-colors duration-200",
                  isTriggerActive
                    ? isAi ? "text-sunny-deep font-black" : "text-coral-deep font-black"
                    : isOpen ? "text-gray-800" : "text-gray-500 group-hover:text-gray-800"
                )}>
                  {label}
                </span>

                {/* Collapsed Active Child Summary (Secondary text) */}
                {!isOpen && isTriggerActive && activeChild && (
                  <span className="text-[10px] text-gray-400 font-bold leading-none mt-1 animate-in fade-in duration-300">
                    {activeChild.label}
                  </span>
                )}
              </div>
            </div>

            {/* Left side: Active short indicator, golden sparkles, and chevron */}
            <div className="flex items-center gap-2 relative z-10 pointer-events-none">
              {/* Sparkles icon if AI and closed */}
              {isAi && !isOpen && (
                <Sparkles size={11} className="text-sunny animate-pulse shrink-0" />
              )}

              {/* Soft Active child notification dot if category closed */}
              {!isOpen && isTriggerActive && (
                <span className="w-2 h-2 bg-coral rounded-full shadow-[0_0_4px_rgba(232,90,93,0.4)] shrink-0 animate-pulse" />
              )}

              <motion.div
                animate={{ rotate: chevronRotate }}
                transition={{ type: "spring", stiffness: 180, damping: 20 }}
                className="text-gray-400 shrink-0 flex items-center justify-center w-4 h-4"
              >
                <ChevronDown size={14} strokeWidth={2.5} />
              </motion.div>
            </div>
          </button>

          {/* Children List Expanded */}
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                id={`category-children-${id}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ 
                  height: { type: "spring", stiffness: 220, damping: 25, mass: 0.8 },
                  opacity: { duration: 0.18, ease: "easeInOut" }
                }}
                className="overflow-hidden"
              >
                <motion.div
                  variants={{
                    open: {
                      transition: { staggerChildren: 0.03, delayChildren: 0.02 }
                    },
                    collapsed: {
                      transition: { staggerChildren: 0.02, staggerDirection: -1 }
                    }
                  }}
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  // Slight indentation of children in RTL
                  className="space-y-1.5 mt-1 mr-3 w-[calc(100%-12px)] relative border-r border-coral-light/5 pr-2.5"
                >
                  {items.map(item => (
                    <motion.div
                      key={item.path}
                      variants={{
                        open: { opacity: 1, y: 0 },
                        collapsed: { opacity: 0, y: -5 }
                      }}
                      transition={reducedMotion ? { duration: 0 } : { duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                    >
                      <SidebarNavItem
                        icon={item.icon}
                        path={item.path}
                        label={item.label}
                        isAi={item.isAi}
                        isCollapsed={false}
                        onClick={sidebarMode === 'mobile' ? onToggle as any : undefined}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
