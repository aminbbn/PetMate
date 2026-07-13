import { Variants } from 'motion/react';
import { motionDurations, motionEasings, motionSprings, motionDistances } from './tokens';

// Helper to determine transition based on reduced motion
const getTransition = (reducedMotion: boolean, preset: 'soft' | 'snappy' | 'settle'): any => {
  if (reducedMotion) {
    return { type: "tween", duration: motionDurations.quick, ease: "linear" };
  }
  return motionSprings[preset];
};

export const createPageVariants = (reducedMotion: boolean): Variants => ({
  initial: {
    opacity: 0,
    y: reducedMotion ? 0 : motionDistances.sm,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionDurations.deliberate,
      ease: motionEasings.soft as any,
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: reducedMotion ? 0 : -motionDistances.micro,
    transition: {
      duration: motionDurations.quick,
      ease: motionEasings.accelerate as any,
    },
  },
});

export const createSectionVariants = (reducedMotion: boolean): Variants => ({
  initial: {
    opacity: 0,
    y: reducedMotion ? 0 : motionDistances.sm,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: getTransition(reducedMotion, 'soft'),
  },
});

export const createListContainerVariants = (): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
});

export const createListItemVariants = (reducedMotion: boolean): Variants => ({
  initial: {
    opacity: 0,
    y: reducedMotion ? 0 : motionDistances.sm,
    scale: reducedMotion ? 1 : 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: getTransition(reducedMotion, 'settle'),
  },
  exit: {
    opacity: 0,
    scale: reducedMotion ? 1 : 0.95,
    transition: {
      duration: motionDurations.quick,
      ease: motionEasings.sharp as any,
    },
  },
});

export const createDialogVariants = (reducedMotion: boolean): { backdrop: Variants; content: Variants } => ({
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: motionDurations.quick } },
    exit: { opacity: 0, transition: { duration: motionDurations.quick } },
  },
  content: {
    initial: {
      opacity: 0,
      scale: reducedMotion ? 1 : 0.95,
      y: reducedMotion ? 0 : motionDistances.md,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: getTransition(reducedMotion, 'snappy'),
    },
    exit: {
      opacity: 0,
      scale: reducedMotion ? 1 : 0.97,
      y: reducedMotion ? 0 : motionDistances.micro,
      transition: {
        duration: motionDurations.quick,
        ease: motionEasings.sharp as any,
      },
    },
  },
});
