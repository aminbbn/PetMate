import React from 'react';
import { cn } from '../lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'sunny';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    
    const variants = {
      primary: "bg-coral text-white shadow-lg shadow-coral/20 hover:bg-coral-deep hover:shadow-coral/30",
      secondary: "bg-peach text-coral-deep hover:bg-coral-light/20",
      outline: "border-2 border-coral-light/50 text-coral-deep hover:bg-coral-light/15",
      ghost: "text-gray-500 hover:bg-coral-light/10 hover:text-coral-deep",
      sunny: "bg-sunny text-white shadow-lg shadow-sunny/20 hover:bg-sunny/90 hover:shadow-sunny/30"
    };

    const sizes = {
      sm: "px-5 py-2.5 text-sm rounded-xl",
      md: "px-7 py-3.5 text-base rounded-2xl",
      lg: "px-9 py-4.5 text-lg font-medium rounded-[20px]",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 450, damping: 15 }}
        className={cn(
          "font-medium transition-all duration-250 flex items-center justify-center gap-2.5 cursor-pointer outline-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
