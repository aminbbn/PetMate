import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { HealthRecord, HealthRecordKind, HealthAttachment } from './healthTypes';
import { getKindLabel, gregorianToJalali, jalaliToGregorian } from './healthUtils';
import { HealthAttachmentField } from './HealthAttachmentField';
import { Calendar, Stethoscope, FileText, ClipboardList } from 'lucide-react';
import { toPersian } from '../../lib/persian';

interface HealthRecordFormProps {
  initialValues?: Partial<HealthRecord>;
  onSubmit: (values: {
    kind: HealthRecordKind;
    occurredAt: string;
    title: string;
    notes?: string;
    veterinarian?: string;
    clinic?: string;
    followUpAt?: string;
    attachments: HealthAttachment[];
  }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const MONTHS_PERSIAN = [
  { val: 1, label: 'فروردین' },
  { val: 2, label: 'اردیبهشت' },
  { val: 3, label: 'خرداد' },
  { val: 4, label: 'تیر' },
  { val: 5, label: 'مرداد' },
  { val: 6, label: 'شهریور' },
  { val: 7, label: 'مهر' },
  { val: 8, label: 'آبان' },
  { val: 9, label: 'آذر' },
  { val: 10, label: 'دی' },
  { val: 11, label: 'بهمن' },
  { val: 12, label: 'اسفند' }
];

export const HealthRecordForm: React.FC<HealthRecordFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [kind, setKind] = useState<HealthRecordKind>(initialValues?.kind || 'visit');
  const [title, setTitle] = useState(initialValues?.title || '');
  const [notes, setNotes] = useState(initialValues?.notes || '');
  const [veterinarian, setVeterinarian] = useState(initialValues?.veterinarian || '');
  const [clinic, setClinic] = useState(initialValues?.clinic || '');
  const [attachments, setAttachments] = useState<HealthAttachment[]>(initialValues?.attachments || []);
  
  // Date states (Jalali values)
  const initialDateJ = gregorianToJalali(initialValues?.occurredAt || new Date());
  const [occurredYear, setOccurredYear] = useState<number>(initialDateJ.jy);
  const [occurredMonth, setOccurredMonth] = useState<number>(initialDateJ.jm);
  const [occurredDay, setOccurredDay] = useState<number>(initialDateJ.jd);

  // Follow up toggle and date states
  const [hasFollowUp, setHasFollowUp] = useState(!!initialValues?.followUpAt);
  const initialFollowUpJ = initialValues?.followUpAt 
    ? gregorianToJalali(initialValues.followUpAt) 
    : gregorianToJalali(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // Default +1 month
  const [followUpYear, setFollowUpYear] = useState<number>(initialFollowUpJ.jy);
  const [followUpMonth, setFollowUpMonth] = useState<number>(initialFollowUpJ.jm);
  const [followUpDay, setFollowUpDay] = useState<number>(initialFollowUpJ.jd);

  const yearsRange = Array.from({ length: 15 }, (_, i) => 1395 + i); // 1395 to 1410
  const daysRange = Array.from({ length: 31 }, (_, i) => i + 1);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) {
      newErrors.title = 'عنوان یا علت مراجعه الزامی است.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Convert Jalali state back to ISO strings
    const occurredAtIso = jalaliToGregorian(occurredYear, occurredMonth, occurredDay);
    const followUpAtIso = hasFollowUp 
      ? jalaliToGregorian(followUpYear, followUpMonth, followUpDay) 
      : undefined;

    onSubmit({
      kind,
      occurredAt: occurredAtIso,
      title,
      notes,
      veterinarian: veterinarian.trim() || undefined,
      clinic: clinic.trim() || undefined,
      followUpAt: followUpAtIso,
      attachments,
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto px-1 scrollbar-thin">
      {/* 1. Record Kind */}
      <div className="space-y-2">
        <label className="block text-xs font-black text-gray-500 mr-1">نوع سابقه پزشکی</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(['visit', 'vaccination', 'lab_test', 'imaging', 'medication', 'surgery', 'allergy', 'note', 'other'] as HealthRecordKind[]).map(k => {
            const isSelected = kind === k;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-coral/10 border-coral text-coral'
                    : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {getKindLabel(k)}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Title & Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title input */}
        <div className="space-y-2">
          <label className="block text-xs font-black text-gray-500 mr-1">عنوان سابقه / علت مراجعه</label>
          <input
            type="text"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
            }}
            placeholder="مانند: واکسن سالانه، آزمایش خون دوره‌ای..."
            className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:bg-white focus:border-coral/50 transition-all ${
              errors.title ? 'border-red-400' : 'border-gray-100'
            }`}
          />
          {errors.title && <p className="text-red-500 text-[10px] font-bold mr-1">{errors.title}</p>}
        </div>

        {/* Date Selector (Jalali Year, Month, Day) */}
        <div className="space-y-2">
          <label className="block text-xs font-black text-gray-500 mr-1">تاریخ مراجعه</label>
          <div className="flex gap-2" dir="rtl">
            {/* Day */}
            <select
              value={occurredDay}
              onChange={e => setOccurredDay(parseInt(e.target.value, 10))}
              className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-2 py-3 text-sm font-bold text-gray-700 outline-none focus:bg-white focus:border-coral/50 transition-all cursor-pointer text-center"
            >
              {daysRange.map(d => (
                <option key={d} value={d}>{toPersian(d)}</option>
              ))}
            </select>

            {/* Month */}
            <select
              value={occurredMonth}
              onChange={e => setOccurredMonth(parseInt(e.target.value, 10))}
              className="flex-[2] bg-gray-50 border border-gray-100 rounded-xl px-2 py-3 text-sm font-bold text-gray-700 outline-none focus:bg-white focus:border-coral/50 transition-all cursor-pointer text-center"
            >
              {MONTHS_PERSIAN.map(m => (
                <option key={m.val} value={m.val}>{m.label}</option>
              ))}
            </select>

            {/* Year */}
            <select
              value={occurredYear}
              onChange={e => setOccurredYear(parseInt(e.target.value, 10))}
              className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-2 py-3 text-sm font-bold text-gray-700 outline-none focus:bg-white focus:border-coral/50 transition-all cursor-pointer text-center"
            >
              {yearsRange.map(y => (
                <option key={y} value={y}>{toPersian(y)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Veterinarian & Clinic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Veterinarian name */}
        <div className="space-y-2">
          <label className="block text-xs font-black text-gray-500 mr-1">پزشک معالج (اختیاری)</label>
          <input
            type="text"
            value={veterinarian}
            onChange={e => setVeterinarian(e.target.value)}
            placeholder="نام دامپزشک..."
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:bg-white focus:border-coral/50 transition-all"
          />
        </div>

        {/* Clinic name */}
        <div className="space-y-2">
          <label className="block text-xs font-black text-gray-500 mr-1">کلینیک / بیمارستان (اختیاری)</label>
          <input
            type="text"
            value={clinic}
            onChange={e => setClinic(e.target.value)}
            placeholder="نام کلینیک..."
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:bg-white focus:border-coral/50 transition-all"
          />
        </div>
      </div>

      {/* 4. Notes textarea */}
      <div className="space-y-2">
        <label className="block text-xs font-black text-gray-500 mr-1">توضیحات و دستورالعمل‌ها (اختیاری)</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="علائم حیاتی، توصیه‌های پزشک، دوز مصرف داروها..."
          rows={3}
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:bg-white focus:border-coral/50 transition-all resize-none"
        />
      </div>

      {/* 5. Follow Up Switch & Date */}
      <div className="border border-coral-light/10 bg-gray-50/50 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="block text-sm font-black text-gray-800">نیاز به پیگیری یا ویزیت بعدی دارد؟</span>
            <span className="block text-[11px] text-gray-400 font-bold">فعال کردن یادآوری ویزیت مجدد در تقویم</span>
          </div>
          <button
            type="button"
            onClick={() => setHasFollowUp(!hasFollowUp)}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer outline-none ${
              hasFollowUp ? 'bg-coral' : 'bg-gray-300'
            }`}
          >
            <div 
              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                hasFollowUp ? 'left-1' : 'left-6'
              }`}
            />
          </button>
        </div>

        {hasFollowUp && (
          <div className="space-y-2 animate-fadeIn">
            <label className="block text-xs font-black text-gray-500 mr-1">تاریخ مراجعه بعدی</label>
            <div className="flex gap-2" dir="rtl">
              {/* Day */}
              <select
                value={followUpDay}
                onChange={e => setFollowUpDay(parseInt(e.target.value, 10))}
                className="flex-1 bg-white border border-gray-100 rounded-xl px-2 py-3 text-sm font-bold text-gray-700 outline-none focus:bg-white focus:border-coral/50 transition-all cursor-pointer text-center"
              >
                {daysRange.map(d => (
                  <option key={d} value={d}>{toPersian(d)}</option>
                ))}
              </select>

              {/* Month */}
              <select
                value={followUpMonth}
                onChange={e => setFollowUpMonth(parseInt(e.target.value, 10))}
                className="flex-[2] bg-white border border-gray-100 rounded-xl px-2 py-3 text-sm font-bold text-gray-700 outline-none focus:bg-white focus:border-coral/50 transition-all cursor-pointer text-center"
              >
                {MONTHS_PERSIAN.map(m => (
                  <option key={m.val} value={m.val}>{m.label}</option>
                ))}
              </select>

              {/* Year */}
              <select
                value={followUpYear}
                onChange={e => setFollowUpYear(parseInt(e.target.value, 10))}
                className="flex-1 bg-white border border-gray-100 rounded-xl px-2 py-3 text-sm font-bold text-gray-700 outline-none focus:bg-white focus:border-coral/50 transition-all cursor-pointer text-center"
              >
                {yearsRange.map(y => (
                  <option key={y} value={y}>{toPersian(y)}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 6. Attachments component */}
      <HealthAttachmentField
        attachments={attachments}
        onChange={setAttachments}
      />

      {/* 7. Action Buttons */}
      <div className="flex items-center gap-3 pt-3">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="flex-1 text-xs font-black py-3 rounded-xl"
        >
          {isSubmitting ? 'در حال ثبت...' : 'ذخیره پرونده'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1 text-xs font-bold py-3 rounded-xl"
        >
          انصراف
        </Button>
      </div>
    </form>
  );
};
