import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store';
import { Button } from '../../components/Button';
import DialogActionFooter from '../../components/dialog/DialogActionFooter';
import { WeightEntry, WeightMeasurementSource } from './growthTypes';
import { parseWeightInput } from './growthUtils';
import { toPersian } from '../../lib/persian';
import { Scale, Calendar, Clock, MapPin, FileText } from 'lucide-react';
import { AnimatedCardIcon } from '../../components/AnimatedCardIcon';

interface WeightEntryFormProps {
  entry?: WeightEntry;
  onSuccess: () => void;
  onCancel: () => void;
}

export const WeightEntryForm: React.FC<WeightEntryFormProps> = ({
  entry,
  onSuccess,
  onCancel,
}) => {
  const pets = useAppStore(state => state.pets || []);
  const profile = useAppStore(state => state.profile);
  const selectedPetId = useAppStore(state => state.selectedPetId);
  const addWeightEntry = useAppStore(state => state.addWeightEntry);
  const updateWeightEntry = useAppStore(state => state.updateWeightEntry);

  const defaultPetId = entry?.petId || selectedPetId || profile?.id || (pets[0]?.id) || '';

  // Form states
  const [petId, setPetId] = useState(defaultPetId);
  const [weightStr, setWeightStr] = useState(entry ? String(entry.weightKg) : '');
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');
  const [source, setSource] = useState<WeightMeasurementSource | ''>(entry?.source || '');
  const [note, setNote] = useState(entry?.note || '');
  
  // Validation and UI states
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Autofocus ref
  const weightInputRef = useRef<HTMLInputElement>(null);

  // Initialize date and time
  useEffect(() => {
    if (entry) {
      const d = new Date(entry.measuredAt);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      setDateStr(`${yyyy}-${mm}-${dd}`);

      const hh = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      setTimeStr(`${hh}-${min}`.replace('-', ':')); // safety replace
    } else {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      setDateStr(`${yyyy}-${mm}-${dd}`);

      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${hh}:${min}`);
    }

    // Focus weight input on mount
    setTimeout(() => {
      weightInputRef.current?.focus();
    }, 150);
  }, [entry]);

  // Handle changes and mark dirty
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeightStr(e.target.value);
    setIsDirty(true);
    setError(null);
  };

  const handlePetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPetId(e.target.value);
    setIsDirty(true);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateStr(e.target.value);
    setIsDirty(true);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeStr(e.target.value);
    setIsDirty(true);
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSource(e.target.value as WeightMeasurementSource);
    setIsDirty(true);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
    setIsDirty(true);
  };

  const validate = (): number | null => {
    if (!petId) {
      setError('انتخاب حیوان خانگی الزامی است.');
      return null;
    }

    const parsedWeight = parseWeightInput(weightStr);
    if (parsedWeight === null) {
      setError('لطفاً یک وزن معتبر و بزرگتر از صفر وارد کنید.');
      return null;
    }

    if (parsedWeight > 350) {
      setError('وزن وارد شده خارج از محدوده منطقی است.');
      return null;
    }

    if (!dateStr) {
      setError('تاریخ اندازه‌گیری الزامی است.');
      return null;
    }

    return parsedWeight;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validatedWeight = validate();
    if (validatedWeight === null) return;

    setIsSaving(true);

    try {
      // Parse local date + time safely
      const [year, month, day] = dateStr.split('-').map(Number);
      const [hour, minute] = (timeStr || '00:00').split(':').map(Number);
      const localDate = new Date(year, month - 1, day, hour, minute);
      const measuredAt = localDate.toISOString();

      if (entry) {
        // Editing existing
        updateWeightEntry(entry.id, {
          petId,
          measuredAt,
          weightKg: validatedWeight,
          source: source || undefined,
          note: note.trim() || undefined,
        });
      } else {
        // Creating new
        addWeightEntry({
          petId,
          measuredAt,
          weightKg: validatedWeight,
          source: source || undefined,
          note: note.trim() || undefined,
        });
      }

      // Check if user selected another pet, let the page parent switch if needed
      if (!entry && petId !== selectedPetId) {
        // We will pass petId in success callback or handle pet switching
        useAppStore.setState({ selectedPetId: petId });
      }

      onSuccess();
    } catch (err) {
      setError('خطایی در ثبت اطلاعات رخ داد.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelClick = () => {
    if (isDirty) {
      const confirmDiscard = window.confirm('تغییرات ذخیره نشده است. آیا مایل به انصراف هستید؟');
      if (!confirmDiscard) return;
    }
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
      <div className="flex items-center gap-3 border-b border-coral-light/10 pb-4 mb-2">
        <AnimatedCardIcon variant="weight" tone="coral" size="sm" />
        <h2 className="text-xl font-black text-coral-deep">
          {entry ? 'ویرایش ثبت وزن' : 'ثبت وزن جدید'}
        </h2>
      </div>

      {error && (
        <div className="p-4 bg-coral/5 border border-coral/20 rounded-2xl text-xs font-bold text-coral text-center">
          {error}
        </div>
      )}

      {/* Inputs */}
      <div className="space-y-4">
        {/* Pet Switcher inside Form (Only shown if multiple pets exist) */}
        {pets.length > 1 && (
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 mr-1">انتخاب حیوان خانگی</label>
            <select
              value={petId}
              onChange={handlePetChange}
              className="w-full bg-peach/10 border border-coral-light/15 rounded-xl px-4 py-3 outline-none text-sm text-gray-700 font-medium focus:border-coral focus:ring-1 focus:ring-coral/20"
            >
              {pets.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.type === 'dog' ? 'سگ' : 'گربه'})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Weight Field (Autofocused, customized large display) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 mr-1">وزن (کیلوگرم) *</label>
          <div className="relative">
            <input
              ref={weightInputRef}
              type="text"
              inputMode="decimal"
              value={weightStr}
              onChange={handleWeightChange}
              className="w-full bg-peach/10 border border-coral-light/20 rounded-2xl pr-4 pl-24 py-4 outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral text-xl font-black text-gray-800 text-center transition-all"
              placeholder="۰٫۰"
              dir="ltr"
              required
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs bg-white px-3 py-2 rounded-lg border border-coral-light/10 select-none">
              کیلوگرم
            </span>
          </div>
        </div>

        {/* Date and Time Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 mr-1 flex items-center gap-1">
              <Calendar size={14} className="text-coral" />
              تاریخ اندازه‌گیری *
            </label>
            <input
              type="date"
              value={dateStr}
              onChange={handleDateChange}
              className="w-full bg-peach/10 border border-coral-light/15 rounded-xl px-4 py-2.5 outline-none text-sm text-gray-700 font-medium focus:border-coral focus:ring-1 focus:ring-coral/20"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 mr-1 flex items-center gap-1">
              <Clock size={14} className="text-coral" />
              ساعت اندازه‌گیری
            </label>
            <input
              type="time"
              value={timeStr}
              onChange={handleTimeChange}
              className="w-full bg-peach/10 border border-coral-light/15 rounded-xl px-4 py-2.5 outline-none text-sm text-gray-700 font-medium focus:border-coral focus:ring-1 focus:ring-coral/20"
            />
          </div>
        </div>

        {/* Source Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 mr-1 flex items-center gap-1">
            <MapPin size={14} className="text-coral" />
            محل اندازه‌گیری
          </label>
          <select
            value={source}
            onChange={handleSourceChange}
            className="w-full bg-peach/10 border border-coral-light/15 rounded-xl px-4 py-2.5 outline-none text-sm text-gray-700 font-medium focus:border-coral focus:ring-1 focus:ring-coral/20"
          >
            <option value="">نامشخص / ثبت نشده</option>
            <option value="home">در خانه</option>
            <option value="veterinary_clinic">کلینیک دامپزشکی</option>
            <option value="groomer">آرایشگاه حیوانات</option>
            <option value="other">سایر</option>
          </select>
        </div>

        {/* Note Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 mr-1 flex items-center gap-1">
            <FileText size={14} className="text-coral" />
            یادداشت اندازه‌گیری
          </label>
          <textarea
            value={note}
            onChange={handleNoteChange}
            className="w-full min-h-[80px] bg-peach/10 border border-coral-light/15 rounded-xl px-4 py-2.5 outline-none text-sm text-gray-700 font-medium focus:border-coral focus:ring-1 focus:ring-coral/20 resize-none"
            placeholder="یادداشتی درباره شرایط اندازه‌گیری بنویسید..."
          />
        </div>
      </div>

      {/* Actions */}
      <DialogActionFooter
        primaryLabel={isSaving ? 'در حال ثبت...' : entry ? 'ذخیره تغییرات' : 'ثبت وزن'}
        primaryDisabled={isSaving || !weightStr}
        secondaryLabel="انصراف"
        onSecondaryClick={handleCancelClick}
        align="end"
        className="-mx-6 -mb-6 md:-mx-8 md:-mb-8 mt-6 border-t border-coral-light/10 rounded-b-2xl bg-white"
      />
    </form>
  );
};
