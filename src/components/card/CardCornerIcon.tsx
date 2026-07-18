import React from 'react';
import { LucideProps } from 'lucide-react';
import { AnimatedCardIcon, AnimatedCardIconVariant, AnimatedCardIconTone } from '../AnimatedCardIcon';
import { cn } from '../../lib/utils';

export type CardCornerIconTone = 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger';

export interface CardCornerIconProps {
  icon: React.ComponentType<LucideProps>;
  animationVariant: AnimatedCardIconVariant;
  tone?: CardCornerIconTone;
  size?: 'sm' | 'md';
  className?: string;
}

const TONE_MAPPING: Record<CardCornerIconTone, AnimatedCardIconTone> = {
  neutral: 'neutral',
  brand: 'coral',
  info: 'blue',
  success: 'mint',
  warning: 'sunny',
  danger: 'coral', // Maps to coral family
};

export const CardCornerIcon: React.FC<CardCornerIconProps> = ({
  icon,
  animationVariant,
  tone = 'neutral',
  size = 'md',
  className,
}) => {
  const animatedTone = TONE_MAPPING[tone];

  return (
    <div 
      className={cn(
        "absolute top-4 right-4 z-20 pointer-events-none select-none",
        className
      )}
      aria-hidden="true"
    >
      <AnimatedCardIcon
        variant={animationVariant}
        icon={icon}
        tone={animatedTone}
        size={size}
        decorative={true}
      />
    </div>
  );
};
