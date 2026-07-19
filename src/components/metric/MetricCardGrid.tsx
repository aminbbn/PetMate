import React from 'react';
import { cn } from '../../lib/utils';
import { MetricCardDensity } from './metricCardTypes';

interface MetricCardGridProps {
  children: React.ReactNode;
  className?: string;
  density?: MetricCardDensity;
}

export const MetricCardGrid: React.FC<MetricCardGridProps> = ({
  children,
  className,
  density = 'standard',
}) => {
  return (
    <div
      className={cn(
        "grid w-full items-stretch auto-rows-fr",
        density === 'compact'
          ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 md:gap-4"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-[18px]",
        className
      )}
    >
      {children}
    </div>
  );
};
