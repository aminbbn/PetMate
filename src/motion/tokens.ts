// Shared Motion Design Tokens for Pet Mate

export const motionDurations = {
  instant: 0.12,    // 100-140ms (fast UI response, toggles)
  quick: 0.18,      // 160-220ms (button transitions, small hover, tooltips)
  standard: 0.32,   // 260-360ms (cards, standard reveals, dialog opening)
  deliberate: 0.48, // 400-520ms (route transition, large content reveals)
};

export const motionEasings = {
  // Premium soft eases
  soft: [0.25, 1, 0.5, 1],      // cubic-bezier(0.25, 1, 0.5, 1) - deceleration
  snappy: [0.16, 1, 0.3, 1],    // cubic-bezier(0.16, 1, 0.3, 1) - faster start
  sharp: [0.4, 0, 0.2, 1],      // standard easing
  accelerate: [0.4, 0, 1, 1],   // exit easing
};

export const motionSprings = {
  // Spring configurations for Framer Motion
  soft: {
    type: "spring" as const,
    stiffness: 180,
    damping: 24,
    mass: 0.8,
  },
  snappy: {
    type: "spring" as const,
    stiffness: 320,
    damping: 20,
    mass: 0.6,
  },
  settle: {
    type: "spring" as const,
    stiffness: 140,
    damping: 22,
    mass: 1,
  },
};

export const motionDistances = {
  micro: 4,      // 4px shift
  sm: 8,         // 8px shift (route enter/exit)
  md: 16,        // 16px shift (dialog slide-up)
  lg: 32,        // 32px shift (large panels)
};
