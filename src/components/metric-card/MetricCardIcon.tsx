import React from 'react';
import { LucideIcon } from 'lucide-react';
import { AnimatedCardIcon, AnimatedCardIconTone, AnimatedCardIconVariant } from '../AnimatedCardIcon';

interface MetricCardIconProps {
  icon: LucideIcon;
  variant: AnimatedCardIconVariant;
  tone?: AnimatedCardIconTone;
  density?: 'standard' | 'compact';
}

export const MetricCardIcon: React.FC<MetricCardIconProps> = ({
  icon,
  variant,
  tone = 'neutral',
  density = 'standard',
}) => {
  return (
    <AnimatedCardIcon
      variant={variant}
      icon={icon}
      tone={tone}
      frameSize={density === 'compact' ? 'compact' : 'metric'}
      decorative={true}
    />
  );
};
