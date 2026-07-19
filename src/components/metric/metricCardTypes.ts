import type { LucideIcon } from 'lucide-react';
import type { AnimatedCardIconVariant } from '../AnimatedCardIcon';
import type { CardCornerIconTone } from '../card/CardCornerIcon';

export type MetricCardDensity = 'compact' | 'standard';
export type MetricCardState =
  | 'default'
  | 'selected'
  | 'attention'
  | 'success'
  | 'empty';

export interface MetricCardProps {
  title: string;
  value: React.ReactNode;
  unit?: React.ReactNode;
  supportingText?: React.ReactNode;
  footer?: React.ReactNode;

  icon: LucideIcon;
  iconVariant: AnimatedCardIconVariant;
  iconTone?: CardCornerIconTone;

  density?: MetricCardDensity;
  state?: MetricCardState;

  interactive?: boolean;
  visualHover?: boolean;
  selected?: boolean;
  onClick?: () => void;

  ariaLabel?: string;
  className?: string;
}
