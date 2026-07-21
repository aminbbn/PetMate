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
      primary: "bg-coral text-white shadow-xl shadow-coral/35 hover:bg-coral-deep hover:shadow-coral/50 transition-all duration-300 font-bold",
      secondary: "bg-peach text-coral-deep border border-coral-light/50 hover:bg-[#FFD4BA] hover:text-coral-deep hover:border-coral-light/80 shadow-md shadow-coral/5 transition-all duration-300 font-bold",
      outline: "border-2 border-coral text-coral hover:bg-coral/15 hover:border-coral-deep hover:text-coral-deep shadow-sm transition-all duration-300 font-bold",
      ghost: "text-coral hover:bg-coral-light/25 hover:text-coral-deep transition-all duration-300 font-bold",
      sunny: "bg-sunny text-white shadow-xl shadow-sunny/35 hover:bg-sunny/95 hover:shadow-sunny/50 transition-all duration-300 font-bold"
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
          "font-medium transition-all duration-250 flex items-center justify-center gap-2.5 cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-coral/45 focus-visible:outline-none",
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
