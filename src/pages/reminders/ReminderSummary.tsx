import React from 'react';
import { GroupedReminders } from './reminderUtils';
import { ReminderMetricCard, ReminderMetricKind } from './ReminderMetricCard';

interface ReminderSummaryProps {
  grouped: GroupedReminders;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function ReminderSummary({ grouped, activeFilter, onFilterChange }: ReminderSummaryProps) {
  const overdueCount = grouped.overdue.length;
  const todayCount = grouped.today.length;
  const upcomingCount = grouped.thisWeek.length + grouped.later.length;
  const doneCount = grouped.done.length;

  const cards: { id: ReminderMetricKind; label: string; count: number }[] = [
    {
      id: 'overdue',
      label: 'به‌تاخیر افتاده',
      count: overdueCount,
    },
    {
      id: 'today',
      label: 'امروز',
      count: todayCount,
    },
    {
      id: 'upcoming',
      label: 'پیش‌رو',
      count: upcomingCount,
    },
    {
      id: 'done',
      label: 'تکمیل‌شده',
      count: doneCount,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" dir="rtl">
      {cards.map((card) => {
        const isSelected = activeFilter === card.id;

        return (
          <ReminderMetricCard
            key={card.id}
            kind={card.id}
            label={card.label}
            count={card.count}
            selected={isSelected}
            onSelect={() => onFilterChange(isSelected ? 'all' : card.id)}
          />
        );
      })}
    </div>
  );
}
