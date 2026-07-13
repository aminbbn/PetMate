import React from 'react';
import { Reminder, useAppStore } from '../../store';
import { motion } from 'motion/react';
import { 
  Heart, 
  Apple, 
  Sparkles, 
  Activity, 
  Calendar, 
  Pill, 
  Bell, 
  Trash2, 
  Pencil, 
  Circle, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { toPersian, formatPersianDate } from '../../lib/persian';
import { formatRecurrenceInPersian } from './recurrenceUtils';
import { cn } from '../../lib/utils';

interface ReminderRowProps {
  reminder: Reminder;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}

const ICON_MAP = {
  health: Heart,
  nutrition: Apple,
  grooming: Sparkles,
  activity: Activity,
  appointment: Calendar,
  medication: Pill,
  other: Bell
};

const NAME_MAP = {
  health: 'سلامت',
  nutrition: 'تغذیه',
  grooming: 'نظافت',
  activity: 'بازی و سرگرمی',
  appointment: 'ویزیت دامپزشک',
  medication: 'دارو و مکمل',
  other: 'سایر مراقبت‌ها'
};

const COLOR_MAP = {
  health: 'bg-rose-50/70 text-rose-600 border-rose-100/50',
  nutrition: 'bg-amber-50/70 text-amber-600 border-amber-100/50',
  grooming: 'bg-sky-50/70 text-sky-600 border-sky-100/50',
  activity: 'bg-emerald-50/70 text-emerald-600 border-emerald-100/50',
  appointment: 'bg-indigo-50/70 text-indigo-600 border-indigo-100/50',
  medication: 'bg-purple-50/70 text-purple-600 border-purple-100/50',
  other: 'bg-gray-50/70 text-gray-600 border-gray-100/50'
};

export default function ReminderRow({ reminder, onEdit, onDelete }: ReminderRowProps) {
  const toggleReminder = useAppStore(state => state.toggleReminder);
  const pets = useAppStore(state => state.pets || []);
  const profile = useAppStore(state => state.profile);

  const CatIcon = ICON_MAP[reminder.category] || Bell;
  const catStyle = COLOR_MAP[reminder.category] || 'bg-gray-50 text-gray-600';
  const catName = NAME_MAP[reminder.category] || 'مراقبت';

  // Find associated pet name
  const allPets = pets.length > 0 ? pets : (profile ? [profile] : []);
  const pet = allPets.find(p => p.id === reminder.petId);
  const petBadgeName = pet ? pet.name : '';

  return (
    <motion.div
      layout
      className={cn(
        "flex items-center justify-between gap-4 p-4.5 rounded-2xl border transition-all duration-300 w-full group/row",
        reminder.completed 
          ? "bg-gray-50/40 border-gray-100/60 opacity-60" 
          : "bg-white border-gray-100 hover:border-coral-light/25 hover:shadow-sm"
      )}
    >
      <div className="flex items-start gap-4 min-w-0 flex-1">
        {/* Circle Toggle Checkbox */}
        <button
          onClick={() => toggleReminder(reminder.id)}
          className="text-coral focus:outline-none transition-transform active:scale-95 shrink-0 mt-0.5 cursor-pointer"
          aria-label="تغییر وضعیت انجام"
        >
          {reminder.completed ? (
            <CheckCircle2 size={22} className="text-coral stroke-[2.5]" />
          ) : (
            <Circle size={22} className="text-gray-300 hover:text-coral transition-colors" />
          )}
        </button>

        {/* Content Details */}
        <div className="space-y-1.5 text-right min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              "text-xs font-black text-gray-800 tracking-tight block truncate",
              reminder.completed && "line-through text-gray-400"
            )}>
              {reminder.title}
            </span>

            {/* Pet Badge if multiple pets exist */}
            {allPets.length > 1 && petBadgeName && (
              <span className="text-[9px] font-black bg-coral/5 text-coral px-2 py-0.5 rounded-md border border-coral-light/10 shrink-0">
                {petBadgeName}
              </span>
            )}
          </div>

          {/* Notes display if present */}
          {reminder.notes && (
            <p className="text-[11px] text-gray-400 leading-relaxed max-w-xl">
              {reminder.notes}
            </p>
          )}

          {/* Badges strip */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category Badge */}
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1.5 shrink-0", catStyle)}>
              <CatIcon size={11} />
              <span>{catName}</span>
            </span>

            {/* Recurrence Pattern Badge */}
            <span className="text-[10px] bg-gray-50 text-gray-400 border border-gray-100 px-2 py-0.5 rounded-lg font-bold shrink-0">
              تکرار: {formatRecurrenceInPersian(reminder.recurrence)}
            </span>

            {/* Due Date Display */}
            <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1 shrink-0">
              <Clock size={11} />
              <span>
                {reminder.completed 
                  ? `انجام شد در: ${formatPersianDate(reminder.completedAt || new Date().toISOString())}`
                  : `موعد: ${formatPersianDate(reminder.dueAt)}`
                }
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Row Edit/Delete CTA Actions */}
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover/row:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(reminder)}
          className="text-gray-300 hover:text-amber-500 hover:bg-amber-50/50 p-2 rounded-xl transition-all cursor-pointer"
          title="ویرایش یادآور"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(reminder.id)}
          className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all cursor-pointer"
          title="حذف یادآور"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </motion.div>
  );
}
