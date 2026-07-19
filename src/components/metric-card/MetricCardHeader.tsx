import React from 'react';
import { LucideIcon } from 'lucide-react';
import { AnimatedCardIconTone, AnimatedCardIconVariant } from '../AnimatedCardIcon';
import { MetricCardIcon } from './MetricCardIcon';
import { METRIC_CARD_STYLES } from './metricCard.styles';
import { cn } from '../../lib/utils';

interface MetricCardHeaderProps {
  title: string;
  icon: LucideIcon;
  iconVariant: AnimatedCardIconVariant;
  iconTone?: AnimatedCardIconTone;
  density?: 'standard' | 'compact';
}

export const MetricCardHeader: React.FC<MetricCardHeaderProps> = ({
  title,
  icon,
  iconVariant,
  iconTone,
  density = 'standard',
}) => {
  const geom = METRIC_CARD_STYLES.geometry[density];
  const titleStyle = METRIC_CARD_STYLES.title[density];

  return (
    <header
      data-slot="metric-card-header"
      className={cn("flex min-w-0 items-center w-full", geom.headerHeight, geom.gap)}
      dir="rtl"
    >
      {/* Icon on the right (since dir="rtl", first in flow is visually on the right) */}
      <MetricCardIcon
        icon={icon}
        variant={iconVariant}
        tone={iconTone}
        density={density}
      />

      {/* Title */}
      <h3
        data-slot="metric-card-title"
        className={cn("min-w-0 flex-1 text-right line-clamp-2", titleStyle)}
      >
        {title}
      </h3>
    </header>
  );
};
