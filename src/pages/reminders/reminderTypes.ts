import { ReminderCategory, RecurrenceFrequency } from '../../store';

export interface CategoryOption {
  value: ReminderCategory;
  label: string;
  color: string; // Tailwind background, text, and border classes
  icon: string;  // Lucide icon key
}

export const CATEGORIES: CategoryOption[] = [
  { value: 'health', label: 'سلامت', color: 'bg-rose-50 text-rose-600 border-rose-100', icon: 'Heart' },
  { value: 'nutrition', label: 'تغذیه', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: 'Apple' },
  { value: 'grooming', label: 'نظافت', color: 'bg-sky-50 text-sky-600 border-sky-100', icon: 'Sparkles' },
  { value: 'activity', label: 'بازی و سرگرمی', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: 'Activity' },
  { value: 'appointment', label: 'ویزیت دامپزشک', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: 'Calendar' },
  { value: 'medication', label: 'دارو و مکمل', color: 'bg-purple-50 text-purple-600 border-purple-100', icon: 'Pill' },
  { value: 'other', label: 'سایر مراقبت‌ها', color: 'bg-gray-50 text-gray-600 border-gray-100', icon: 'Bell' }
];

export interface RecurrenceOption {
  value: RecurrenceFrequency;
  label: string;
}

export const RECURRENCE_OPTIONS: RecurrenceOption[] = [
  { value: 'once', label: 'بدون تکرار (یک‌بار)' },
  { value: 'daily', label: 'هر روز' },
  { value: 'weekly', label: 'هر هفته' },
  { value: 'monthly', label: 'هر ماه' }
];
