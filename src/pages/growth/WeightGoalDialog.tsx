import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store';
import { Button } from '../../components/Button';
import { WeightGoal } from './growthTypes';
import { parseWeightInput } from './growthUtils';
import { toPersian } from '../../lib/persian';
import { AlertCircle } from 'lucide-react';
import { AnimatedCardIcon } from '../../components/AnimatedCardIcon';
import { MotionDialog } from '../../motion/MotionDialog';

interface WeightGoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const WeightGoalDialog: React.FC<WeightGoalDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const selectedPetId = useAppStore(state => state.selectedPetId);
  const profile = useAppStore(state => state.profile);
  const weightGoals = useAppStore(state => state.weightGoals || []);
  const setWeightGoal = useAppStore(state => state.setWeightGoal);
  const deleteWeightGoal = useAppStore(state => state.deleteWeightGoal);

  const petId = selectedPetId || profile?.id || '';
  const currentGoal = weightGoals.find(g => g.petId === petId);

  const [minStr, setMinStr] = useState('');
  const [maxStr, setMaxStr] = useState('');
  const [targetStr, setTargetStr] = useState('');
  const [source, setSource] = useState<'user' | 'veterinarian'>('user');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const firstInputRef = useRef<HTMLInputElement>(null);

  // Initialize fields on open
  useEffect(() => {
    if (isOpen) {
      if (currentGoal) {
        setMinStr(currentGoal.minKg ? String(currentGoal.minKg) : '');
        setMaxStr(currentGoal.maxKg ? String(currentGoal.maxKg) : '');
        setTargetStr(currentGoal.targetKg ? String(currentGoal.targetKg) : '');
        setSource(currentGoal.source);
        setNote(currentGoal.note || '');
      } else {
        setMinStr('');
        setMaxStr('');
        setTargetStr('');
        setSource('user');
        setNote('');
      }
      setError(null);
      setTimeout(() => firstInputRef.current?.focus(), 150);
    }
  }, [isOpen, currentGoal]);

  const validate = (): { min?: number; max?: number; target?: number } | null => {
    const minVal = minStr ? parseWeightInput(minStr) : null;
    const maxVal = maxStr ? parseWeightInput(maxStr) : null;
    const targetVal = targetStr ? parseWeightInput(targetStr) : null;

    if (minStr && minVal === null) {
      setError('حداقل وزن وارد شده معتبر نیست.');
      return null;
    }
    if (maxStr && maxVal === null) {
      setError('حداکثر وزن وارد شده معتبر نیست.');
      return null;
    }
    if (targetStr && targetVal === null) {
      setError('وزن هدف وارد شده معتبر نیست.');
      return null;
    }

    if (!minStr && !maxStr && !targetStr) {
      setError('وارد کردن حداقل یک مقدار (وزن هدف، حداقل یا حداکثر) الزامی است.');
      return null;
    }

    if (minVal && maxVal && minVal >= maxVal) {
      setError('حداقل وزن باید کمتر از حداکثر وزن باشد.');
      return null;
    }

    return {
      min: minVal || undefined,
      max: maxVal || undefined,
      target: targetVal || undefined
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validate();
    if (!result) return;

    const now = new Date().toISOString();
    const goal: WeightGoal = {
      petId,
      minKg: result.min,
      maxKg: result.max,
      targetKg: result.target,
      source,
      note: note.trim() || undefined,
      setAt: currentGoal?.setAt || now,
      updatedAt: now
    };

    setWeightGoal(goal);
    onSuccess();
  };

  const handleDelete = () => {
    if (window.confirm('آیا از حذف هدف وزن اطمینان دارید؟')) {
      deleteWeightGoal(petId);
      onSuccess();
    }
  };

  return (
    <MotionDialog
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      className="p-6 md:p-8"
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-right" dir="rtl">
        <div className="flex items-center gap-3 border-b border-coral-light/10 pb-4 mb-2">
          <AnimatedCardIcon variant="weight" tone="coral" size="sm" />
          <h2 className="text-xl font-black text-coral-deep">تعیین هدف وزن</h2>
        </div>

        {error && (
          <div className="p-4 bg-coral/5 border border-coral/20 rounded-2xl text-xs font-bold text-coral flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Target Weight */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 mr-1">وزن هدف تکی (کیلوگرم)</label>
            <div className="relative">
              <input
                ref={firstInputRef}
                type="text"
                inputMode="decimal"
                value={targetStr}
                onChange={e => { setTargetStr(e.target.value); setError(null); }}
                className="w-full bg-peach/10 border border-coral-light/25 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-coral/20 focus:border-coral text-sm font-bold text-gray-800 text-center"
                placeholder="مثلاً ۵٫۵"
                dir="ltr"
              />
            </div>
          </div>

          {/* Target Range */}
          <div>
            <span className="block text-xs font-black text-gray-400 mb-2 mr-1">یا تعیین محدوده وزن هدف</span>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 mr-1">حداقل (کیلوگرم)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={minStr}
                  onChange={e => { setMinStr(e.target.value); setError(null); }}
                  className="w-full bg-peach/10 border border-coral-light/25 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-coral/20 focus:border-coral text-sm font-bold text-gray-800 text-center"
                  placeholder="حداقل"
                  dir="ltr"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 mr-1">حداکثر (کیلوگرم)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={maxStr}
                  onChange={e => { setMaxStr(e.target.value); setError(null); }}
                  className="w-full bg-peach/10 border border-coral-light/25 rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-coral/20 focus:border-coral text-sm font-bold text-gray-800 text-center"
                  placeholder="حداکثر"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Goal Source */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 mr-1">منبع مرجع هدف</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSource('user')}
                className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  source === 'user'
                    ? 'bg-coral/10 border-coral text-coral'
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                }`}
              >
                برنامه شخصی من
              </button>
              <button
                type="button"
                onClick={() => setSource('veterinarian')}
                className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  source === 'veterinarian'
                    ? 'bg-coral/10 border-coral text-coral'
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                }`}
              >
                توصیه دامپزشک
              </button>
            </div>
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 mr-1">یادداشت هدف</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full min-h-[60px] bg-peach/10 border border-coral-light/25 rounded-xl px-4 py-2.5 outline-none text-sm text-gray-700 font-medium focus:border-coral focus:ring-1 focus:ring-coral/20 resize-none"
              placeholder="توضیحات اختیاری درباره هدف وزنی..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-between pt-4 border-t border-coral-light/10">
          {currentGoal ? (
            <Button
              type="button"
              variant="ghost"
              onClick={handleDelete}
              className="text-coral hover:bg-coral/5 px-4 text-xs font-bold rounded-xl"
            >
              حذف هدف
            </Button>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-5 py-2 text-xs text-gray-500 font-bold"
            >
              انصراف
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="px-6 py-2 text-xs font-bold"
            >
              ثبت هدف
            </Button>
          </div>
        </div>
      </form>
    </MotionDialog>
  );
};
