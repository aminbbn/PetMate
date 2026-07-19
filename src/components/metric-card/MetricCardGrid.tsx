import React from 'react';
import { cn } from '../../lib/utils';
import { MetricCardDensity } from './metricCard.types';

interface MetricCardGridProps {
  children: React.ReactNode;
  density?: MetricCardDensity;
  className?: string;
}

export const MetricCardGrid: React.FC<MetricCardGridProps> = ({
  children,
  density = 'standard',
  className,
}) => {
  return (
    <div
      className={cn(
        "grid items-stretch auto-rows-fr w-full",
        // Compact density has tighter gap/layout on mobile (2 cols), standard uses 1-2 cols on mobile
        density === 'compact'
          ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-[18px]",
        className
      )}
    >
      {children}
    </div>
  );
};
