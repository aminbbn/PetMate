import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface FloatingFeatureCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

export const FloatingFeatureCard: React.FC<FloatingFeatureCardProps> = ({
  children,
  className,
  delay = 0,
  yOffset = 15,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ 
        opacity: 1, 
        y: 0,
      }}
      transition={{
        opacity: { duration: 0.8, delay },
        y: {
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay,
        }
      }}
      whileHover={{ 
        scale: 1.05, 
        transition: { duration: 0.2 } 
      }}
      className={cn(
        "bg-white/80 backdrop-blur-md border border-coral-light/10 shadow-warm-md hover:shadow-warm-lg p-4 rounded-2xl select-none text-right transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
};
