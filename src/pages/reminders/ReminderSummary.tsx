import React from 'react';
import { useAppStore } from '../../store';
import { motion } from 'motion/react';
import { AlertCircle, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { toPersian } from '../../lib/persian';
import { GroupedReminders } from './reminderUtils';

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

  const cards = [
    {
      id: 'overdue',
      label: 'به‌تاخیر افتاده',
      count: overdueCount,
      icon: AlertCircle,
      color: overdueCount > 0 ? 'bg-coral text-white shadow-lg shadow-coral/15 border-coral' : 'bg-white border-gray-100 text-gray-400',
      countColor: overdueCount > 0 ? 'text-white' : 'text-gray-500',
      labelColor: overdueCount > 0 ? 'text-white/80' : 'text-gray-400',
      activeBorder: 'ring-2 ring-coral/40 ring-offset-2'
    },
    {
      id: 'today',
      label: 'امروز',
      count: todayCount,
      icon: Clock,
      color: 'bg-amber-500 text-white shadow-lg shadow-amber-500/15 border-amber-500',
      countColor: 'text-white',
      labelColor: 'text-white/80',
      inactiveColor: 'bg-white border-gray-100 text-amber-500 hover:border-amber-200 hover:bg-amber-50/10',
      activeBorder: 'ring-2 ring-amber-500/40 ring-offset-2'
    },
    {
      id: 'upcoming',
      label: 'پیش‌رو',
      count: upcomingCount,
      icon: Calendar,
      color: 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/15 border-emerald-600',
      countColor: 'text-white',
      labelColor: 'text-white/80',
      inactiveColor: 'bg-white border-gray-100 text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50/10',
      activeBorder: 'ring-2 ring-emerald-600/40 ring-offset-2'
    },
    {
      id: 'done',
      label: 'تکمیل‌شده',
      count: doneCount,
      icon: CheckCircle2,
      color: 'bg-gray-700 text-white shadow-lg shadow-gray-700/15 border-gray-700',
      countColor: 'text-white',
      labelColor: 'text-white/80',
      inactiveColor: 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50/10',
      activeBorder: 'ring-2 ring-gray-700/40 ring-offset-2'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const isSelected = activeFilter === card.id;
        const Icon = card.icon;

        // Custom styling for Overdue card, as requested to remain soft if 0 but eye-catching if > 0
        let cardStyle = card.color;
        let textCountClass = card.countColor;
        let textLabelClass = card.labelColor;

        if (card.id !== 'overdue') {
          if (!isSelected) {
            cardStyle = card.inactiveColor || 'bg-white border-gray-100 text-gray-500';
            textCountClass = 'text-gray-800';
            textLabelClass = 'text-gray-400';
          }
        } else {
          if (overdueCount === 0) {
            cardStyle = isSelected ? 'bg-gray-100 border-gray-200 text-gray-600' : 'bg-white border-gray-100 text-gray-400';
            textCountClass = 'text-gray-400';
            textLabelClass = 'text-gray-400';
          }
        }

        return (
          <button
            key={card.id}
            onClick={() => onFilterChange(isSelected ? 'all' : card.id)}
            className={`flex items-center justify-between p-4.5 rounded-2xl border transition-all duration-300 text-right cursor-pointer group ${cardStyle} ${
              isSelected ? card.activeBorder : 'hover:shadow-sm'
            }`}
          >
            <div className="space-y-1">
              <span className={`text-[10px] font-bold block transition-colors ${textLabelClass}`}>{card.label}</span>
              <span className={`text-2xl font-black block leading-none transition-colors ${textCountClass}`}>
                {toPersian(card.count)}
              </span>
            </div>
            <div className={`p-2.5 rounded-xl transition-transform group-hover:scale-105 shrink-0 ${
              isSelected || (card.id === 'overdue' && overdueCount > 0) ? 'bg-white/15 text-white' : 'bg-gray-50 text-gray-400'
            }`}>
              <Icon size={20} className={card.id === 'overdue' && overdueCount > 0 ? 'animate-pulse' : ''} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
