import React from 'react';
import { MetricCardDensity, MetricValueKind } from './metricCard.types';
import { METRIC_CARD_STYLES } from './metricCard.styles';
import { cn } from '../../lib/utils';

interface MetricCardValueProps {
  value: React.ReactNode;
  valueKind: MetricValueKind;
  unit?: React.ReactNode;
  density?: MetricCardDensity;
}

export const MetricCardValue: React.FC<MetricCardValueProps> = ({
  value,
  valueKind,
  unit,
  density = 'standard',
}) => {
  const valueStyle = METRIC_CARD_STYLES.value[valueKind]?.[density] || METRIC_CARD_STYLES.value.text[density];

  // For number kind, we display with unit and baseline alignment
  if (valueKind === 'number') {
    return (
      <div 
        data-slot="metric-card-value"
        className="flex items-baseline justify-start select-text w-full text-right gap-1"
        dir="rtl"
      >
        <span className={valueStyle}>
          {value}
        </span>
        {unit && (
          <span 
            data-slot="metric-card-unit"
            className={METRIC_CARD_STYLES.unit}
          >
            {unit}
          </span>
        )}
      </div>
    );
  }

  // For text, status, empty kinds
  return (
    <div 
      data-slot="metric-card-value"
      className={cn("text-right select-text w-full line-clamp-2", valueStyle)}
      dir="rtl"
    >
      {value}
    </div>
  );
};
