import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMotionPreferences } from './useMotionPreferences';
import { createDialogVariants } from './variants';
import { cn } from '../lib/utils';

interface MotionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const MotionDialog: React.FC<MotionDialogProps> = ({
  isOpen,
  onClose,
  children,
  className,
  size = 'md',
}) => {
  const { reducedMotion } = useMotionPreferences();
  const variants = createDialogVariants(reducedMotion);

  // Close on Escape keypress
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
          {/* Backdrop Overlay */}
          <motion.div
            variants={variants.backdrop}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            variants={variants.content}
            initial="initial"
            animate="animate"
            exit="exit"
            role="dialog"
            aria-modal="true"
            className={cn(
              "bg-white w-full rounded-[24px] shadow-2xl relative z-10 border border-coral-light/20 flex flex-col justify-between overflow-hidden",
              sizeClasses[size],
              className
            )}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
