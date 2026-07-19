import React from 'react';
import { LucideProps } from 'lucide-react';
import { AnimatedCardIcon, AnimatedCardIconVariant, AnimatedCardIconTone } from '../AnimatedCardIcon';
import { cn } from '../../lib/utils';

export type CardCornerIconTone = 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger';

export interface CardCornerIconProps {
  icon: React.ComponentType<LucideProps>;
  animationVariant: AnimatedCardIconVariant;
  tone?: CardCornerIconTone;
  density?: 'standard' | 'compact';
  size?: 'sm' | 'md' | 'lg' | string;
  className?: string;
}

const TONE_MAPPING: Record<CardCornerIconTone, AnimatedCardIconTone> = {
  neutral: 'neutral',
  brand: 'coral',
  info: 'blue',
  success: 'mint',
  warning: 'sunny',
  danger: 'coral',
};

export const CardCornerIcon: React.FC<CardCornerIconProps> = ({
  icon,
  animationVariant,
  tone = 'neutral',
  density,
  size,
  className,
}) => {
  const animatedTone = TONE_MAPPING[tone];
  
  // Backward compatibility mapping for size property
  const resolvedDensity = density || (size === 'sm' ? 'compact' : 'standard');
  const isCompact = resolvedDensity === 'compact';

  return (
    <div 
      className={cn(
        "absolute z-20 pointer-events-none select-none",
        isCompact ? "top-4 right-4" : "top-[18px] right-[18px]",
        className
      )}
      aria-hidden="true"
    >
      <AnimatedCardIcon
        variant={animationVariant}
        icon={icon}
        tone={animatedTone}
        decorative={true}
        size="sm"
        className={cn(
          isCompact 
            ? "!w-9 !h-9 !rounded-xl" 
            : "!w-10 !h-10 !rounded-2xl"
        )}
      />
    </div>
  );
};
