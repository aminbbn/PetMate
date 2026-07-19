import React from 'react';
import { MetricCard } from '../../components/metric-card';
import { AlertCircle, Clock, Calendar, CheckCircle } from 'lucide-react';
import { toPersian } from '../../lib/persian';

export type ReminderMetricKind = 'overdue' | 'today' | 'upcoming' | 'done';

interface ReminderMetricCardProps {
  kind: ReminderMetricKind;
  label: string;
  count: number;
  selected: boolean;
  onSelect: () => void;
}

export const ReminderMetricCard: React.FC<ReminderMetricCardProps> = ({
  kind,
  label,
  count,
  selected,
  onSelect,
}) => {
  const getIconConfig = () => {
    switch (kind) {
      case 'overdue':
        return {
          icon: AlertCircle,
          variant: 'alert' as const,
          tone: 'coral' as const,
        };
      case 'today':
        return {
          icon: Clock,
          variant: 'clock' as const,
          tone: 'blue' as const,
        };
      case 'upcoming':
        return {
          icon: Calendar,
          variant: 'calendar' as const,
          tone: 'sunny' as const,
        };
      case 'done':
        return {
          icon: CheckCircle,
          variant: 'success' as const,
          tone: 'mint' as const,
        };
    }
  };

  const iconConfig = getIconConfig();

  return (
    <MetricCard
      title={label}
      value={toPersian(count)}
      valueKind="number"
      icon={iconConfig.icon}
      iconVariant={iconConfig.variant}
      iconTone={iconConfig.tone}
      density="compact"
      interactive={true}
      selected={selected}
      onClick={onSelect}
    />
  );
};
