import React from 'react';
import { MetricCard as NewMetricCard } from '../metric/MetricCard';
import { MetricCardProps as NewMetricCardProps } from '../metric/metricCardTypes';
import { CardCornerIconTone } from './CardCornerIcon';

export interface MetricCardProps {
  title: string;
  value: React.ReactNode;
  supportingText?: React.ReactNode;
  footerText?: React.ReactNode;
  icon: any;
  iconAnimationVariant: any;
  iconTone?: CardCornerIconTone;
  interactive?: boolean;
  visualHover?: boolean;
  selected?: boolean;
  glow?: boolean;
  as?: 'div' | 'button';
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  supportingText,
  footerText,
  icon,
  iconAnimationVariant,
  iconTone,
  interactive,
  visualHover,
  selected,
  onClick,
  className,
}) => {
  return (
    <NewMetricCard
      title={title}
      value={value}
      supportingText={supportingText}
      footer={footerText}
      icon={icon}
      iconVariant={iconAnimationVariant}
      iconTone={iconTone}
      interactive={interactive}
      visualHover={visualHover}
      selected={selected}
      onClick={onClick}
      className={className}
    />
  );
};
