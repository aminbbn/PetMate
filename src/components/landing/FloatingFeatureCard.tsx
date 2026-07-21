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
        y: [0, -yOffset, 0],
      }}
      transition={{
        opacity: { duration: 0.8, delay },
        y: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.5,
        }
      }}
      whileHover={{ 
        scale: 1.05, 
        rotate: [0, -1, 1, 0],
        transition: { duration: 0.3 } 
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
