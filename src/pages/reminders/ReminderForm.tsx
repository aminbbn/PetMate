import React, { useState, useEffect } from 'react';
import { Reminder, useAppStore, ReminderCategory, RecurrenceFrequency, ReminderRecurrence } from '../../store';
import { CATEGORIES, RECURRENCE_OPTIONS } from './reminderTypes';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/Button';
import DialogActionFooter from '../../components/dialog/DialogActionFooter';

interface ReminderFormProps {
  initialReminder?: Reminder | null;
  onSave: (data: {
    title: string;
    category: ReminderCategory;
    dueAt: string;
    recurrence: ReminderRecurrence;
    notes: string;
    petId: string;
  }) => void;
  onCancel: () => void;
}

const WEEKDAYS = [
  { value: 6, label: 'ش' },
  { value: 0, label: 'ی' },
  { value: 1, label: 'د' },
  { value: 2, label: 'س' },
  { value: 3, label: 'چ' },
  { value: 4, label: 'پ' },
  { value: 5, label: 'ج' }
];

export default function ReminderForm({ initialReminder, onSave, onCancel }: ReminderFormProps) {
  const pets = useAppStore(state => state.pets || []);
  const profile = useAppStore(state => state.profile);
  const selectedPetId = useAppStore(state => state.selectedPetId);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReminderCategory>('health');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [frequency, setFrequency] = useState<RecurrenceFrequency>('once');
  const [interval, setInterval] = useState<number>(1);
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([]);
  const [notes, setNotes] = useState('');
  const [petId, setPetId] = useState('');

  // Validation states
  const [errors, setErrors] = useState<{
    title?: string;
    date?: string;
    time?: string;
    petId?: string;
  }>({});

  // Fallback list of pets
  const allPets = pets.length > 0 ? pets : (profile ? [profile] : []);

  useEffect(() => {
    if (initialReminder) {
      setTitle(initialReminder.title);
      setCategory(initialReminder.category);
      
      // Split ISO dueAt into date (YYYY-MM-DD) and time (HH:MM)
      if (initialReminder.dueAt) {
        const d = new Date(initialReminder.dueAt);
        if (!isNaN(d.getTime())) {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          setDate(`${yyyy}-${mm}-${dd}`);
          
          const hh = String(d.getHours()).padStart(2, '0');
          const min = String(d.getMinutes()).padStart(2, '0');
          setTime(`${hh}:${min}`);
        }
      }

      if (initialReminder.recurrence) {
        setFrequency(initialReminder.recurrence.frequency);
        setInterval(initialReminder.recurrence.interval || 1);
        setSelectedWeekdays(initialReminder.recurrence.weekdays || []);
      }
      setNotes(initialReminder.notes || '');
      setPetId(initialReminder.petId);
    } else {
      // Set default values for a new reminder
      setTitle('');
      setCategory('health');
      
      // Default to today's date
      const d = new Date();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      setDate(`${yyyy}-${mm}-${dd}`);
      setTime('09:00');
      
      setFrequency('once');
      setInterval(1);
      setSelectedWeekdays([]);
      setNotes('');
      setPetId(selectedPetId || (allPets[0]?.id || ''));
    }
    // Clear errors on reset/initial load
    setErrors({});
  }, [initialReminder, selectedPetId, allPets]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: undefined }));
    }
  };

  const handleDateChange = (val: string) => {
    setDate(val);
    if (errors.date) {
      setErrors(prev => ({ ...prev, date: undefined }));
    }
  };

  const handleTimeChange = (val: string) => {
    setTime(val);
    if (errors.time) {
      setErrors(prev => ({ ...prev, time: undefined }));
    }
  };

  const handlePetIdChange = (val: string) => {
    setPetId(val);
    if (errors.petId) {
      setErrors(prev => ({ ...prev, petId: undefined }));
    }
  };

  const toggleWeekday = (dayValue: number) => {
    if (selectedWeekdays.includes(dayValue)) {
      setSelectedWeekdays(selectedWeekdays.filter(d => d !== dayValue));
    } else {
      setSelectedWeekdays([...selectedWeekdays, dayValue]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = 'عنوان برنامه را وارد کنید.';
    }
    if (!date) {
      newErrors.date = 'تاریخ موعد را انتخاب کنید.';
    }
    if (!time) {
      newErrors.time = 'ساعت هشدار را انتخاب کنید.';
    }
    if (allPets.length > 1 && !petId) {
      newErrors.petId = 'حیوان خانگی را انتخاب کنید.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Focus the first invalid field
      if (newErrors.petId) {
        document.getElementById('form-pet-id')?.focus();
      } else if (newErrors.title) {
        document.getElementById('form-title')?.focus();
      } else if (newErrors.date) {
        document.getElementById('form-date')?.focus();
      } else if (newErrors.time) {
        document.getElementById('form-time')?.focus();
      }
      return;
    }

    // Combine date and time into an ISO string
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const dueAtDate = new Date(year, month - 1, day, hours, minutes);
    const dueAt = dueAtDate.toISOString();

    const recurrence: ReminderRecurrence = {
      frequency,
      interval: frequency !== 'once' ? interval : undefined,
      weekdays: frequency === 'weekly' && selectedWeekdays.length > 0 ? selectedWeekdays : undefined
    };

    onSave({
      title: title.trim(),
      category,
      dueAt,
      recurrence,
      notes: notes.trim(),
      petId
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col text-right font-medium" dir="rtl">
      {/* Scrollable Form Body Container */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-8 pt-4 sm:px-6 overscroll-contain space-y-5 scrollbar-thin scrollbar-thumb-gray-200">
        
        {/* ARIA Live region for error summary */}
        <div aria-live="polite" className="sr-only">
          {Object.keys(errors).length > 0 && `فرم دارای خطاست. ${Object.values(errors).filter(Boolean).join(' ')}`}
        </div>

        {/* Target Pet selection if multiple pets exist */}
        {allPets.length > 1 && (
          <div className="space-y-1.5">
            <label htmlFor="form-pet-id" className="text-[10px] text-gray-400 font-bold block">برای کدام حیوان؟</label>
            <select
              id="form-pet-id"
              value={petId}
              onChange={(e) => handlePetIdChange(e.target.value)}
              aria-invalid={!!errors.petId}
              aria-describedby={errors.petId ? "petId-error" : undefined}
              className={cn(
                "w-full bg-gray-50/50 border rounded-xl px-3 py-2.5 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-coral/20 font-black cursor-pointer",
                errors.petId ? "border-red-500 focus:ring-red-500/20" : "border-gray-100"
              )}
            >
              <option value="">انتخاب کنید...</option>
              {allPets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.type === 'dog' ? '🐶' : '🐱'} {pet.name}
                </option>
              ))}
            </select>
            {errors.petId && (
              <p className="text-red-500 text-[10px] font-bold mt-1" id="petId-error" role="alert">
                {errors.petId}
              </p>
            )}
          </div>
        )}

        {/* Title input */}
        <div className="space-y-1.5">
          <label htmlFor="form-title" className="text-[10px] text-gray-400 font-bold block">عنوان یادآور</label>
          <input
            id="form-title"
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="مثال: واکسن سه‌گانه دوره‌ای یا قرص انگل..."
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "title-error" : undefined}
            className={cn(
              "w-full bg-gray-50/50 border rounded-xl px-4 py-3 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-coral/20 font-black placeholder:text-gray-400 placeholder:font-normal",
              errors.title ? "border-red-500 focus:ring-red-500/20" : "border-gray-100"
            )}
          />
          {errors.title && (
            <p className="text-red-500 text-[10px] font-bold mt-1" id="title-error" role="alert">
              {errors.title}
            </p>
          )}
        </div>

        {/* Category grid selection */}
        <div className="space-y-2">
          <span className="text-[10px] text-gray-400 font-bold block">موضوع یادآور (دسته‌بندی)</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="موضوع یادآور">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                role="radio"
                aria-checked={category === cat.value}
                className={cn(
                  "px-3 py-2.5 rounded-xl border text-[11px] font-bold text-center transition-all flex items-center justify-center gap-2 cursor-pointer",
                  category === cat.value
                    ? "bg-coral border-coral text-white shadow-sm shadow-coral/15"
                    : "bg-gray-50/50 border-gray-100 text-gray-500 hover:border-gray-200"
                )}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time Picker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="form-date" className="text-[10px] text-gray-400 font-bold block">تاریخ موعد یادآور</label>
            <div className="relative">
              <input
                id="form-date"
                type="date"
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                aria-invalid={!!errors.date}
                aria-describedby={errors.date ? "date-error" : undefined}
                className={cn(
                  "w-full bg-gray-50/50 border rounded-xl px-3 py-2.5 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-coral/20 pl-9 pr-3 text-right",
                  errors.date ? "border-red-500 focus:ring-red-500/20" : "border-gray-100"
                )}
              />
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.date && (
              <p className="text-red-500 text-[10px] font-bold mt-1" id="date-error" role="alert">
                {errors.date}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="form-time" className="text-[10px] text-gray-400 font-bold block">ساعت هشدار</label>
            <div className="relative">
              <input
                id="form-time"
                type="time"
                value={time}
                onChange={(e) => handleTimeChange(e.target.value)}
                aria-invalid={!!errors.time}
                aria-describedby={errors.time ? "time-error" : undefined}
                className={cn(
                  "w-full bg-gray-50/50 border rounded-xl px-3 py-2.5 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-coral/20 pl-9 pr-3 text-right",
                  errors.time ? "border-red-500 focus:ring-red-500/20" : "border-gray-100"
                )}
              />
              <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.time && (
              <p className="text-red-500 text-[10px] font-bold mt-1" id="time-error" role="alert">
                {errors.time}
              </p>
            )}
          </div>
        </div>

        {/* Recurrence Options */}
        <div className="pt-3 border-t border-gray-100/60 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="form-frequency" className="text-[10px] text-gray-400 font-bold block">بازه تکرار</label>
              <select
                id="form-frequency"
                value={frequency}
                onChange={(e) => {
                  setFrequency(e.target.value as RecurrenceFrequency);
                  setSelectedWeekdays([]);
                }}
                className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-3 py-2.5 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-coral/20 cursor-pointer font-bold"
              >
                {RECURRENCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {frequency !== 'once' && (
              <div className="space-y-1.5">
                <label htmlFor="form-interval" className="text-[10px] text-gray-400 font-bold block">هر چند دوره یک‌بار؟ (فاصله)</label>
                <div className="flex items-center gap-2">
                  <input
                    id="form-interval"
                    type="number"
                    min="1"
                    required
                    value={interval}
                    onChange={(e) => setInterval(Number(e.target.value) || 1)}
                    className="w-20 bg-gray-50/50 border border-gray-100 rounded-xl px-3 py-2 text-xs text-gray-700 text-center outline-none focus:ring-2 focus:ring-coral/20 font-black"
                  />
                  <span className="text-xs text-gray-400">
                    {frequency === 'daily' && 'روز'}
                    {frequency === 'weekly' && 'هفته'}
                    {frequency === 'monthly' && 'ماه'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Weekly Specific Day Selectors */}
          {frequency === 'weekly' && (
            <div className="space-y-1.5 animate-fadeIn">
              <span className="text-[10px] text-gray-400 font-bold block">روزهای تکرار در هفته</span>
              <div className="flex justify-between gap-1.5" dir="rtl">
                {WEEKDAYS.map((day) => {
                  const active = selectedWeekdays.includes(day.value);
                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleWeekday(day.value)}
                      aria-pressed={active}
                      className={cn(
                        "w-8 h-8 rounded-full border text-xs font-black flex items-center justify-center transition-all cursor-pointer",
                        active
                          ? "bg-coral border-coral text-white shadow-sm"
                          : "bg-gray-50/50 border-gray-100 text-gray-500 hover:border-gray-200"
                      )}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notes / Descriptions */}
        <div className="space-y-1.5 pt-1">
          <label htmlFor="form-notes" className="text-[10px] text-gray-400 font-bold block">توضیحات و دستورالعمل یادآور</label>
          <textarea
            id="form-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="دستورالعمل خاص، دوز دارو یا ملاحظات دامپزشکی را در این بخش بنویسید (اختیاری)..."
            rows={3}
            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-coral/20 placeholder:text-gray-400 placeholder:font-normal leading-relaxed text-right"
          />
        </div>

        {/* Extra safe bottom scroll padding spacer */}
        <div className="h-6 shrink-0" />
      </div>

      {/* Fixed Action Footer - Inside Form, Keyboard reachable */}
      <DialogActionFooter
        primaryLabel={initialReminder ? 'ذخیره تغییرات' : 'ثبت برنامه مراقبتی'}
        secondaryLabel="انصراف"
        onSecondaryClick={onCancel}
        className="shrink-0 border-t border-gray-100 bg-white/95 px-5 py-4 backdrop-blur-md sm:px-6"
      />
    </form>
  );
}
