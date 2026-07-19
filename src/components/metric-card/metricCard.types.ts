import React from 'react';
import { LucideIcon } from 'lucide-react';
import {
  AnimatedCardIconTone,
  AnimatedCardIconVariant,
} from '../AnimatedCardIcon';

export type MetricCardDensity = 'compact' | 'standard';

export type MetricValueKind =
  | 'number'
  | 'text'
  | 'status'
  | 'empty';

export type MetricCardState =
  | 'default'
  | 'selected'
  | 'attention'
  | 'success';

export interface MetricCardProps {
  title: string;

  value: React.ReactNode;
  valueKind: MetricValueKind;
  unit?: React.ReactNode;

  supportingText?: React.ReactNode;
  footer?: React.ReactNode;

  icon: LucideIcon;
  iconVariant: AnimatedCardIconVariant;
  iconTone?: AnimatedCardIconTone;

  density?: MetricCardDensity;
  state?: MetricCardState;

  interactive?: boolean;
  selected?: boolean;
  onClick?: () => void;

  ariaLabel?: string;

  // Outer layout only. Must never alter internal slots.
  className?: string;
}
