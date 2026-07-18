import React from 'react';
import { Card } from '../../components/Card';
import { CardCornerIcon } from '../../components/card/CardCornerIcon';
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
          tone: 'danger' as const,
        };
      case 'today':
        return {
          icon: Clock,
          variant: 'clock' as const,
          tone: 'info' as const,
        };
      case 'upcoming':
        return {
          icon: Calendar,
          variant: 'calendar' as const,
          tone: 'warning' as const,
        };
      case 'done':
        return {
          icon: CheckCircle,
          variant: 'success' as const,
          tone: 'success' as const,
        };
    }
  };

  const iconConfig = getIconConfig();

  const countClasses = selected
    ? "text-coral-deep text-2xl font-black leading-none block transition-colors"
    : "text-gray-800 text-2xl font-black leading-none block transition-colors";

  const labelClasses = selected
    ? "text-coral-deep/80 text-[10px] font-black block transition-colors"
    : "text-gray-400 text-[10px] font-bold block transition-colors";

  return (
    <Card
      as="button"
      type="button"
      onClick={onSelect}
      selected={selected}
      glow={selected}
      glowIntensity="normal"
      hoverLift={true}
      className="relative p-4.5 min-h-[90px] w-full text-right outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-coral/40"
      contentClassName="relative w-full h-full"
      aria-pressed={selected}
    >
      <CardCornerIcon
        icon={iconConfig.icon}
        animationVariant={iconConfig.variant}
        tone={iconConfig.tone}
        size="sm"
      />
      
      <div className="pr-14 space-y-1.5 flex flex-col justify-center h-full">
        <span className={labelClasses}>{label}</span>
        <span className={countClasses}>
          {toPersian(count)}
        </span>
      </div>
    </Card>
  );
};
