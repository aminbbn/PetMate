import React from 'react';
import { motion } from 'motion/react';
import { useMotionPreferences } from './useMotionPreferences';
import { createSectionVariants } from './variants';

interface MotionSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const MotionSection: React.FC<MotionSectionProps> = ({ children, className, delay = 0 }) => {
  const { reducedMotion } = useMotionPreferences();
  const baseVariants = createSectionVariants(reducedMotion) as any;

  const customTransition = delay > 0 ? {
    ...baseVariants.animate?.transition as any,
    delay,
  } : undefined;

  const variants = {
    ...baseVariants,
    animate: {
      ...baseVariants.animate,
      transition: customTransition || baseVariants.animate?.transition,
    } as any,
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      className={className}
    >
      {children}
    </motion.div>
  );
};
