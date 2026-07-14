import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface SidebarNavIconProps {
  path: string;
  isActive: boolean;
  isHovered: boolean;
  isFocused: boolean;
  isAi?: boolean;
  size?: number;
  strokeWidth?: number;
  semanticIconsEnabled?: boolean;
  reducedMotion?: boolean;
}

export const SidebarNavIcon: React.FC<SidebarNavIconProps> = ({
  path,
  isActive,
  isHovered,
  isFocused,
  isAi = false,
  size = 18,
  strokeWidth = 2,
  semanticIconsEnabled = true,
  reducedMotion = false
}) => {
  const triggerAnimation = (isHovered || isFocused) && semanticIconsEnabled && !reducedMotion;

  // Common SVG layout parameters
  const svgProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: isActive ? strokeWidth + 0.5 : strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: cn(
      "transition-colors duration-300 shrink-0",
      isActive 
        ? isAi ? "text-sunny" : "text-coral" 
        : "text-gray-400 group-hover:text-gray-600"
    )
  };

  // 1. HOME: House rises 1px, tiny roof/door highlight, no bounce
  if (path === '/') {
    return (
      <svg {...svgProps}>
        <motion.g
          animate={triggerAnimation ? { y: -1 } : { y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {/* Main House Path */}
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          {/* Door Path with dynamic brightness/highlight */}
          <motion.polyline 
            points="9 22 9 12 15 12 15 22" 
            animate={triggerAnimation ? { strokeWidth: isActive ? strokeWidth + 0.8 : strokeWidth + 0.5 } : { strokeWidth: isActive ? strokeWidth + 0.5 : strokeWidth }}
            transition={{ duration: 0.25 }}
          />
        </motion.g>
      </svg>
    );
  }

  // 2. REMINDERS: Restrained calendar page flip, max 5-7° rotation
  if (path === '/reminders') {
    return (
      <svg {...svgProps}>
        <motion.g
          animate={triggerAnimation ? { rotate: -6 } : { rotate: 0 }}
          style={{ originX: "12px", originY: "20px" }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          {/* Calendar Box */}
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          {/* Top binder rings */}
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          {/* Header separator line */}
          <line x1="3" x2="21" y1="10" y2="10" />
          {/* Dynamic inner date mark/line flip */}
          <motion.line 
            x1="8" 
            x2="16" 
            y1="14" 
            y2="14"
            animate={triggerAnimation ? { scaleX: [1, 0.7, 1] } : { scaleX: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
          <motion.line 
            x1="8" 
            x2="13" 
            y1="18" 
            y2="18"
            animate={triggerAnimation ? { scaleX: [1, 0.5, 1] } : { scaleX: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut", delay: 0.05 }}
          />
        </motion.g>
      </svg>
    );
  }

  // 3. HEALTH RECORD: Stethoscope chest piece or tubing pulses once, no full rotation
  if (path === '/health') {
    return (
      <svg {...svgProps}>
        {/* Main Tubing */}
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v12a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
        {/* Chest piece with single pulse scale on hover */}
        <motion.circle 
          cx="12" 
          cy="4" 
          r="2" 
          animate={triggerAnimation ? { scale: [1, 1.25, 1] } : { scale: 1 }}
          style={{ originX: "12px", originY: "4px" }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        />
        {/* Secondary earpiece tube lines */}
        <path d="M18 10h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-2" />
        <motion.circle 
          cx="18" 
          cy="14" 
          r="1"
          animate={triggerAnimation ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          style={{ originX: "18px", originY: "14px" }}
          transition={{ duration: 0.45, ease: "easeInOut", delay: 0.1 }}
        />
      </svg>
    );
  }

  // 4. GROWTH: Trend line draws upward, last point settles from 0.8 to 1
  if (path === '/growth') {
    return (
      <svg {...svgProps}>
        {/* Axis line */}
        <path d="M3 3v18h18" />
        
        {/* Trend line - animate pathLength */}
        <motion.path 
          d="m18 8-5 5-4-4-4 4" 
          initial={{ pathLength: 1 }}
          animate={triggerAnimation ? { pathLength: [0.3, 1] } : { pathLength: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* End highlight dot - scales up and settles */}
        <motion.circle 
          cx="18" 
          cy="8" 
          r="2.5" 
          fill="currentColor"
          className="text-coral"
          initial={{ scale: 1 }}
          animate={triggerAnimation ? { scale: [0.8, 1.3, 1] } : { scale: 1 }}
          style={{ originX: "18px", originY: "8px" }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
    );
  }

  // 5. SERVICE NAVIGATOR: Map pin drops 2px, one small ripple expands and fades
  if (path === '/navigator') {
    return (
      <svg {...svgProps}>
        {/* Map Background folded */}
        <path d="M3 6s3-2 6-2 6 2 6 2 6-2 6-2v13s-3 2-6 2-6-2-6-2-6 2-6 2z" />
        <line x1="9" x2="9" y1="4" y2="21" />
        <line x1="15" x2="15" y1="3" y2="20" />

        {/* Small subtle ripple expanding below the pin */}
        {triggerAnimation && (
          <motion.circle
            cx="12"
            cy="15"
            r="3"
            strokeWidth={1}
            initial={{ scale: 0.4, opacity: 0.8 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ originX: "12px", originY: "15px" }}
          />
        )}

        {/* Pin shape that drops 2px on trigger */}
        <motion.g
          animate={triggerAnimation ? { y: [-2, 0] } : { y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 12 }}
        >
          <path d="M12 5c-1.7 0-3 1.3-3 3 0 2.5 3 6.5 3 6.5s3-4 3-6.5c0-1.7-1.3-3-3-3z" fill={isActive ? "rgba(232, 90, 93, 0.1)" : "none"} />
          <circle cx="12" cy="8" r="1" fill="currentColor" />
        </motion.g>
      </svg>
    );
  }

  // 6. MY VETS: Phone receiver tilts 6 degrees, one pair of call arcs expands and fades
  if (path === '/vets') {
    return (
      <svg {...svgProps}>
        {/* Rotating phone receiver */}
        <motion.path 
          d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
          animate={triggerAnimation ? { rotate: [0, 6, -4, 0] } : { rotate: 0 }}
          style={{ originX: "12px", originY: "12px" }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        />

        {/* Call Sound arcs expanding and fading */}
        <motion.path
          d="M14 2a10 10 0 0 1 8 8"
          strokeWidth={1.5}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={triggerAnimation ? { opacity: [0, 1, 0], scale: [0.9, 1.15, 1] } : { opacity: 0 }}
          style={{ originX: "10px", originY: "10px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
        />
        <motion.path
          d="M14 6a6 6 0 0 1 4 4"
          strokeWidth={1.5}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={triggerAnimation ? { opacity: [0, 1, 0], scale: [0.9, 1.15, 1] } : { opacity: 0 }}
          style={{ originX: "10px", originY: "10px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
        />
      </svg>
    );
  }

  // 7. SHOP: Bag handles lift 1-2px, bag body settles 1px, no swinging loop
  if (path === '/shop') {
    return (
      <svg {...svgProps}>
        {/* Handles Group - lifts up */}
        <motion.path 
          d="M16 10a4 4 0 0 0-8 0" 
          animate={triggerAnimation ? { y: -1.5 } : { y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
        
        {/* Bag Body - settles down slightly */}
        <motion.g
          animate={triggerAnimation ? { y: 0.8 } : { y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" x2="21" y1="6" y2="6" />
        </motion.g>
      </svg>
    );
  }

  // 8. TRIAGE / ASSISTANT (AI): Bot antenna tilts slightly, one small status dot appears and fades
  if (path === '/triage') {
    return (
      <svg {...svgProps}>
        {/* Antenna - tilts slightly */}
        <motion.path 
          d="M12 6V2" 
          animate={triggerAnimation ? { rotate: [0, 10, -5, 0] } : { rotate: 0 }}
          style={{ originX: "12px", originY: "6px" }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        />
        <motion.circle 
          cx="12" 
          cy="2" 
          r="1" 
          fill="currentColor"
          animate={triggerAnimation ? { x: [0, 1, -1, 0], y: [0, -0.5, 0.5, 0] } : { x: 0, y: 0 }}
          transition={{ duration: 0.45 }}
        />

        {/* Head Box */}
        <rect width="18" height="12" x="3" y="8" rx="2" />
        <line x1="12" x2="12.01" y1="14" y2="14" strokeWidth={3} />
        <line x1="7" x2="7.01" y1="14" y2="14" strokeWidth={3} />
        <line x1="17" x2="17.01" y1="14" y2="14" strokeWidth={3} />
        <path d="M8 18h8" />

        {/* Small Status Indicator Dot on Forehead - appears and fades */}
        <motion.circle
          cx="12"
          cy="10"
          r="1"
          fill="currentColor"
          className="text-sunny"
          initial={{ opacity: 0 }}
          animate={triggerAnimation ? { opacity: [0, 1, 0] } : { opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </svg>
    );
  }

  // 9. NUTRITION (AI): Fork and spoon separate about 1px and return
  if (path === '/nutrition') {
    return (
      <svg {...svgProps}>
        {/* Fork Group - shifts left slightly and returns */}
        <motion.g
          animate={triggerAnimation ? { x: -1.2 } : { x: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <path d="M3 2v7c0 1.1.9 2 2 2h1a2 2 0 0 0 2-2V2" />
          <path d="M6 2v4" />
          <path d="M5 11v9a1 1 0 0 1-1 1" />
        </motion.g>

        {/* Spoon Group - shifts right slightly and returns */}
        <motion.g
          animate={triggerAnimation ? { x: 1.2 } : { x: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <path d="M19 2h-1a5 5 0 0 0-5 5v3a5 5 0 0 0 5 5h1a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5z" fill={isActive ? "rgba(255, 181, 107, 0.08)" : "none"} />
          <path d="M17 15v6" />
        </motion.g>
      </svg>
    );
  }

  // 10. BEHAVIOR GUIDE (AI): Smile curve changes subtly once, no generic bounce
  if (path === '/translator') {
    return (
      <svg {...svgProps}>
        {/* Head circle */}
        <circle cx="12" cy="12" r="10" />
        {/* Eyes */}
        <line x1="8" x2="8.01" y1="9" y2="9" strokeWidth={2.5} />
        <line x1="16" x2="16.01" y1="9" y2="9" strokeWidth={2.5} />
        
        {/* Mouth curve - changes shape subtly on animation */}
        <motion.path 
          d="M8 14s1.5 2 4 2 4-2 4-2" 
          animate={triggerAnimation ? { scaleY: [1, 1.35, 0.9, 1] } : { scaleY: 1 }}
          style={{ originX: "12px", originY: "14px" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </svg>
    );
  }

  // 11. TRAINING (AI): Medal rotates 5-8° and settles, ribbon moves slightly
  if (path === '/coach') {
    return (
      <svg {...svgProps}>
        {/* Medal Circular part */}
        <motion.g
          animate={triggerAnimation ? { rotate: [0, 7, -4, 0] } : { rotate: 0 }}
          style={{ originX: "12px", originY: "8px" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <circle cx="12" cy="8" r="6" fill={isActive ? "rgba(255, 181, 107, 0.08)" : "none"} />
          <circle cx="12" cy="8" r="2" />
        </motion.g>

        {/* Ribbons hanging down - moves slightly */}
        <motion.path 
          d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" 
          animate={triggerAnimation ? { y: [0, 0.6, 0] } : { y: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
        />
      </svg>
    );
  }

  // 12. SETTINGS: Gear rotates only 8-12°, never continuous rotation
  if (path === '/settings') {
    return (
      <svg {...svgProps}>
        <motion.path 
          d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
          animate={triggerAnimation ? { rotate: [0, 12] } : { rotate: 0 }}
          style={{ originX: "12px", originY: "12px" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  // Fallback if no path matches
  return null;
};
