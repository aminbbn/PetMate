import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMotionPreferences } from './useMotionPreferences';
import { createListContainerVariants, createListItemVariants } from './variants';

interface MotionListContainerProps {
  children: React.ReactNode;
  className?: string;
  layout?: boolean | "position" | "size" | "preserve-aspect";
}

export const MotionListContainer: React.FC<MotionListContainerProps> = ({ 
  children, 
  className,
  layout = false
}) => {
  const containerVariants = createListContainerVariants();

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={className}
      layout={layout}
    >
      {children}
    </motion.div>
  );
};

interface MotionListItemProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  layout?: boolean | "position" | "size" | "preserve-aspect";
}

export const MotionListItem: React.FC<MotionListItemProps> = ({ 
  children, 
  className, 
  id,
  layout = "position"
}) => {
  const { reducedMotion } = useMotionPreferences();
  const itemVariants = createListItemVariants(reducedMotion);

  return (
    <motion.div
      variants={itemVariants}
      id={id}
      className={className}
      layout={reducedMotion ? false : layout}
    >
      {children}
    </motion.div>
  );
};
