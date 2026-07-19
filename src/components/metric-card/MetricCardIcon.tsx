import React from 'react';
import { LucideIcon } from 'lucide-react';
import { AnimatedCardIcon, AnimatedCardIconTone, AnimatedCardIconVariant } from '../AnimatedCardIcon';
import { METRIC_CARD_STYLES } from './metricCard.styles';
import { cn } from '../../lib/utils';

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
  const styles = METRIC_CARD_STYLES.geometry[density];
  return (
    <div 
      data-slot="metric-card-icon"
      className={cn(
        "flex items-center justify-center shrink-0 overflow-hidden relative",
        styles.iconWrapper
      )}
    >
      <AnimatedCardIcon
        variant={variant}
        icon={icon}
        tone={tone}
        size="sm"
        decorative={true}
        className="!w-full !h-full"
      />
    </div>
  );
};
