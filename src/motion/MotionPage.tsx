import React from 'react';
import { motion } from 'motion/react';
import { useMotionPreferences } from './useMotionPreferences';
import { createPageVariants } from './variants';

interface MotionPageProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  dir?: string;
}

export const MotionPage: React.FC<MotionPageProps> = ({ children, className, id, dir }) => {
  const { reducedMotion, routeTransitionsEnabled } = useMotionPreferences();
  const variants = createPageVariants(reducedMotion);

  if (!routeTransitionsEnabled) {
    return (
      <div id={id} dir={dir} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      id={id}
      dir={dir}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
};
