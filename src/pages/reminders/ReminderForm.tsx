import React, { useState, useEffect } from 'react';
import { Reminder, useAppStore, ReminderCategory, RecurrenceFrequency, ReminderRecurrence } from '../../store';
import { CATEGORIES, RECURRENCE_OPTIONS } from './reminderTypes';
import { Calendar, Clock, Bell, HelpCircle, Heart } from 'lucide-react';
import { cn } from '../../lib/utils';

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
  }, [initialReminder, selectedPetId, allPets]);

  const toggleWeekday = (dayValue: number) => {
    if (selectedWeekdays.includes(dayValue)) {
      setSelectedWeekdays(selectedWeekdays.filter(d => d !== dayValue));
    } else {
      setSelectedWeekdays([...selectedWeekdays, dayValue]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !time) return;

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
    <form onSubmit={handleSubmit} className="space-y-5 text-right font-medium">
      {/* Target Pet selection if multiple pets exist */}
      {allPets.length > 1 && (
        <div className="space-y-1.5">
          <label className="text-[10px] text-gray-400 font-bold block">برای کدام حیوان؟</label>
          <select
            value={petId}
            onChange={(e) => setPetId(e.target.value)}
            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-3 py-2.5 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-coral/20 font-black cursor-pointer"
          >
            {allPets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.type === 'dog' ? '🐶' : '🐱'} {pet.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Title input */}
      <div className="space-y-1.5">
        <label className="text-[10px] text-gray-400 font-bold block">عنوان یادآور</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="مثال: واکسن سه‌گانه دوره‌ای یا قرص انگل..."
          className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-coral/20 font-black placeholder:text-gray-400 placeholder:font-normal"
        />
      </div>

      {/* Category grid selection */}
      <div className="space-y-2">
        <label className="text-[10px] text-gray-400 font-bold block">موضوع یادآور (دسته‌بندی)</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
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
          <label className="text-[10px] text-gray-400 font-bold block">تاریخ موعد یادآور</label>
          <div className="relative">
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-3 py-2.5 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-coral/20 pl-9 pr-3 text-right"
            />
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-gray-400 font-bold block">ساعت هشدار</label>
          <div className="relative">
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-3 py-2.5 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-coral/20 pl-9 pr-3 text-right"
            />
            <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Recurrence Options */}
      <div className="pt-3 border-t border-gray-100/60 space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 font-bold block">بازه تکرار</label>
            <select
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
              <label className="text-[10px] text-gray-400 font-bold block">هر چند دوره یک‌بار؟ (فاصله)</label>
              <div className="flex items-center gap-2">
                <input
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
            <label className="text-[10px] text-gray-400 font-bold block">روزهای تکرار در هفته</label>
            <div className="flex justify-between gap-1.5" dir="rtl">
              {WEEKDAYS.map((day) => {
                const active = selectedWeekdays.includes(day.value);
                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleWeekday(day.value)}
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
        <label className="text-[10px] text-gray-400 font-bold block">توضیحات و دستورالعمل یادآور</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="دستورالعمل خاص، دوز دارو یا ملاحظات دامپزشکی را در این بخش بنویسید (اختیاری)..."
          rows={3}
          className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-xs text-gray-700 outline-none focus:ring-2 focus:ring-coral/20 placeholder:text-gray-400 placeholder:font-normal leading-relaxed text-right"
        />
      </div>

      {/* Actions / Submit */}
      <div className="flex flex-col gap-2.5 pt-4 border-t border-gray-100/60 items-center justify-center">
        {/* Centered Solid Pink Primary Action Button, precisely "ذخیره در سوابق" */}
        <button
          type="submit"
          className="w-full max-w-xs py-3.5 bg-coral text-white rounded-xl text-sm font-black hover:bg-coral-deep transition-all shadow-md shadow-coral/15 flex items-center justify-center cursor-pointer"
        >
          ذخیره در سوابق
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          انصراف و بستن فرم
        </button>
      </div>
    </form>
  );
}
