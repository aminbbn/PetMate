import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useMotionPreferences } from './useMotionPreferences';
import { cn } from '../lib/utils';
import { APP_LAYERS } from '../constants/layers';

interface MotionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  ariaLabelledby?: string;
}

export const MotionDrawer: React.FC<MotionDrawerProps> = ({
  isOpen,
  onClose,
  children,
  className,
  ariaLabelledby,
}) => {
  const { reducedMotion } = useMotionPreferences();
  const [mounted, setMounted] = React.useState(false);
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const previousActiveElement = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

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

  // Body scroll lock
  React.useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Focus trap and restore
  React.useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      const timer = setTimeout(() => {
        if (drawerRef.current) {
          const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusables.length > 0) {
            focusables[0].focus();
          } else {
            drawerRef.current.focus();
          }
        }
      }, 50);
      return () => clearTimeout(timer);
    } else {
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen]);

  // Handle Tab key trapping
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        );

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const backdropVariants: any = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.22, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.18, ease: "easeIn" } },
  };

  const panelVariants: any = {
    initial: {
      x: reducedMotion ? '0%' : '100%',
      opacity: reducedMotion ? 0 : 1,
    },
    animate: {
      x: '0%',
      opacity: 1,
      transition: reducedMotion
        ? { duration: 0.22, ease: 'easeOut' }
        : { type: 'spring', stiffness: 260, damping: 28, mass: 1 },
    },
    exit: {
      x: reducedMotion ? '0%' : '100%',
      opacity: reducedMotion ? 0 : 1,
      transition: { duration: 0.18, ease: 'easeIn' },
    },
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div 
          data-slot="modal-drawer-root"
          className="fixed inset-0 overflow-hidden" 
          style={{ zIndex: APP_LAYERS.modalBackdrop }}
          dir="rtl"
        >
          {/* Backdrop Overlay with premium full-screen blur and scrim */}
          <motion.div
            data-slot="modal-drawer-backdrop"
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/35 backdrop-blur-[10px] backdrop-saturate-[0.9] cursor-pointer"
          />

          {/* Drawer Container Panel */}
          <motion.aside
            ref={drawerRef}
            variants={panelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby={ariaLabelledby}
            tabIndex={-1}
            data-slot="modal-drawer-panel"
            className={cn(
              "fixed inset-y-0 right-0 h-[100dvh] w-full max-w-[520px] flex flex-col bg-white shadow-2xl border-l border-coral-light/25 outline-none relative",
              className
            )}
            style={{ zIndex: APP_LAYERS.modalContent }}
          >
            {children}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
