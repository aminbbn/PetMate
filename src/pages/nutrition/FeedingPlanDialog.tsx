import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store';
import { FeedingPlan, FeedingPlanMeal } from './nutritionTypes';
import { selectPetFoods } from './nutritionSelectors';
import { Button } from '../../components/Button';
import { X, Plus, Trash2, ShieldCheck, Clock, Utensils } from 'lucide-react';
import { toPersian } from '../../lib/persian';
import { MotionDialog } from '../../motion/MotionDialog';

interface FeedingPlanDialogProps {
  isOpen: boolean;
  plan?: FeedingPlan;
  onClose: () => void;
  onSuccess: () => void;
}

export const FeedingPlanDialog: React.FC<FeedingPlanDialogProps> = ({
  isOpen,
  plan,
  onClose,
  onSuccess,
}) => {
  const store = useAppStore();
  const petId = store.selectedPetId || store.profile?.id || '';
  const foods = selectPetFoods(store);

  // Steps: 1 = Details, 2 = Meals
  const [step, setStep] = useState<1 | 2>(1);

  // Form Details State (Step 1)
  const [name, setName] = useState('');
  const [source, setSource] = useState<FeedingPlan['source']>('user');
  const [dailyKcal, setDailyKcal] = useState('');
  const [notes, setNotes] = useState('');

  // Form Meals State (Step 2)
  const [meals, setMeals] = useState<Omit<FeedingPlanMeal, 'id'>[]>([]);

  // State for adding a single meal
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [mealTime, setMealTime] = useState('08:00');
  const [mealAmountGrams, setMealAmountGrams] = useState('');

  // Pre-populate if editing
  useEffect(() => {
    if (plan && isOpen) {
      setName(plan.name || '');
      setSource(plan.source);
      setDailyKcal(plan.dailyEnergyTargetKcal ? String(plan.dailyEnergyTargetKcal) : '');
      setNotes(plan.notes || '');
      setMeals(plan.meals.map(({ id, ...m }) => m));
      setStep(1);
    } else if (isOpen) {
      setName('');
      setSource('user');
      setDailyKcal('');
      setNotes('');
      setMeals([]);
      setStep(1);
    }
  }, [plan, isOpen]);

  // Handle selected food pre-selection
  useEffect(() => {
    if (foods.length > 0 && !selectedFoodId) {
      setSelectedFoodId(foods[0].id);
    }
  }, [foods, selectedFoodId]);

  const handleAddMealToPlan = () => {
    const amount = parseFloat(mealAmountGrams);
    if (!selectedFoodId || isNaN(amount) || amount <= 0) return;

    const chosenFood = foods.find(f => f.id === selectedFoodId);
    if (!chosenFood) return;

    const newMeal: Omit<FeedingPlanMeal, 'id'> = {
      foodId: selectedFoodId,
      time: mealTime,
      amount: amount,
      unit: 'gram',
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // default to every day
      notes: '',
    };

    const updatedMeals = [...meals, newMeal].sort((a, b) => a.time.localeCompare(b.time));
    setMeals(updatedMeals);
    setMealAmountGrams('');

    const [hours, minutes] = mealTime.split(':').map(Number);
    const nextHours = (hours + 6) % 24;
    setMealTime(`${String(nextHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
  };

  const handleRemoveMealFromPlan = (index: number) => {
    setMeals(meals.filter((_, idx) => idx !== index));
  };

  const handleSavePlan = () => {
    if (!name.trim()) return;

    const kcalTarget = parseFloat(dailyKcal);

    const mealsWithIds: FeedingPlanMeal[] = meals.map((m, idx) => ({
      ...m,
      id: `meal-${idx}-${Date.now()}`
    }));

    const planData = {
      name: name.trim(),
      source,
      dailyEnergyTargetKcal: isNaN(kcalTarget) ? undefined : kcalTarget,
      notes: notes.trim() || undefined,
      meals: mealsWithIds,
    };

    if (plan) {
      store.updateFeedingPlan(plan.id, planData);
    } else {
      store.addFeedingPlan({
        petId,
        name: name.trim(),
        source,
        dailyEnergyTargetKcal: isNaN(kcalTarget) ? undefined : kcalTarget,
        notes: notes.trim() || undefined,
        meals: meals,
      });
    }

    onSuccess();
  };

  const currentChosenFood = foods.find(f => f.id === selectedFoodId);
  const liveKcalPerGram = currentChosenFood ? (currentChosenFood.energyKcalPer100g || 380) / 100 : 0;
  const liveGrams = parseFloat(mealAmountGrams);
  const liveComputedKcal = !isNaN(liveGrams) && liveGrams > 0 ? Math.round(liveGrams * liveKcalPerGram) : 0;

  return (
    <MotionDialog
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      className="p-6 md:p-8 flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-100" dir="rtl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-coral/5 text-coral flex items-center justify-center">
            <Utensils size={14} />
          </div>
          <h3 className="text-lg font-black text-coral-deep">
            {plan ? 'ویرایش برنامه غذایی فعال' : 'ایجاد برنامه غذایی و زمانبندی جدید'}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="بستن دیالوگ"
        >
          <X size={16} />
        </button>
      </div>

      {/* Stepper indicators */}
      <div className="flex gap-2 items-center justify-center py-3 border-b border-gray-50" dir="rtl">
        <button
          onClick={() => setStep(1)}
          className={`text-[10px] font-black px-3 py-1 rounded-full border transition-all ${
            step === 1
              ? 'bg-coral text-white border-coral shadow-sm'
              : 'bg-gray-50 text-gray-400 border-gray-100'
          }`}
        >
          مرحله ۱: مشخصات کلی
        </button>
        <div className="w-6 h-[1px] bg-gray-200" />
        <button
          onClick={() => {
            if (name.trim()) setStep(2);
          }}
          disabled={!name.trim()}
          className={`text-[10px] font-black px-3 py-1 rounded-full border transition-all ${
            step === 2
              ? 'bg-coral text-white border-coral shadow-sm'
              : 'bg-gray-50 text-gray-400 border-gray-100 disabled:opacity-50'
          }`}
        >
          مرحله ۲: زمانبندی و دوز بندی وعده‌ها
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto max-h-[60vh]" dir="rtl">
        {foods.length === 0 ? (
          <div className="p-8 text-center text-gray-400 font-bold text-xs space-y-4">
            <p>قبل از تعیین برنامه، باید حداقل یک نوع ماده غذایی در بخش «مواد غذایی من» ذخیره کرده باشید.</p>
            <Button onClick={onClose} variant="primary" className="mx-auto text-xs px-6 py-2.5">
              فهمیدم، بازگشت
            </Button>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            {step === 1 ? (
              <div className="space-y-4 text-right">
                {/* Plan Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">نام برنامه غذایی</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: برنامه تابستانه کنترل چربی"
                    className="w-full bg-gray-50 border border-coral-light/10 focus:border-coral rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-800 outline-none"
                  />
                </div>

                {/* Source Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">منبع و طراح برنامه</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['user', 'veterinarian', 'educational_estimate'] as const).map((src) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setSource(src)}
                        className={`py-2.5 rounded-xl text-[10px] font-black border transition-all ${
                          source === src
                            ? 'bg-coral/10 border-coral text-coral'
                            : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {src === 'user' ? 'برنامه شخصی من' : src === 'veterinarian' ? 'نسخه دامپزشک' : 'تخمین محاسباتی'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Daily kcal target */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">هدف کالری روزانه کل (اختیاری - کیلوکالری)</label>
                  <input
                    type="number"
                    value={dailyKcal}
                    onChange={(e) => setDailyKcal(e.target.value)}
                    placeholder="مثال: ۴۸۰"
                    className="w-full bg-gray-50 border border-coral-light/10 focus:border-coral rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-800 outline-none"
                  />
                  <span className="text-[10px] text-gray-400 font-semibold block leading-normal">
                    اگر خالی بگذارید، مجموع کالری وعده‌ها به عنوان معیار هدف در نظر گرفته خواهد شد.
                  </span>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">توضیحات و توصیه‌های تکمیلی (اختیاری)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="مثال: غذا بعد از پیاده‌روی عصرانه سرو شود. آب تازه همیشه در دسترس باشد."
                    rows={4}
                    className="w-full bg-gray-50 border border-coral-light/10 focus:border-coral rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-800 outline-none resize-none"
                  />
                </div>

                {source === 'veterinarian' && (
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-800 text-[11.5px] font-semibold flex gap-2 items-start leading-relaxed">
                    <ShieldCheck size={14} className="shrink-0 mt-0.5 text-amber-600" />
                    <span>
                      این برنامه بر اساس نسخه تجویزی دامپزشک تنظیم می‌شود. در صورت تغییر وضعیت سلامتی حیوان، حتماً با پزشک مشورت نمایید.
                    </span>
                  </div>
                )}

                {/* Navigation actions for step 1 */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="secondary"
                    className="flex-1 text-xs py-3 font-black text-gray-600 border border-gray-200 hover:bg-gray-50 bg-white"
                  >
                    انصراف
                  </Button>
                  <Button
                    type="button"
                    disabled={!name.trim()}
                    onClick={() => setStep(2)}
                    variant="primary"
                    className="flex-1 text-xs py-3 font-black shadow-md shadow-coral/15 disabled:opacity-55"
                  >
                    مرحله بعد: دوز بندی وعده‌ها
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4 text-right">
                  {/* Dynamic Adder Module */}
                  <div className="bg-gray-50/70 border border-gray-100 p-4.5 rounded-2xl space-y-4">
                    <span className="block text-[11px] font-black text-coral-deep border-b border-gray-100 pb-2">
                      تعریف وعده غذایی جدید
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Food Selector */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 mr-0.5">انتخاب غذا</label>
                        <select
                          value={selectedFoodId}
                          onChange={(e) => setSelectedFoodId(e.target.value)}
                          className="w-full bg-white border border-coral-light/10 text-gray-800 rounded-xl px-2.5 py-2 text-xs font-bold outline-none cursor-pointer"
                        >
                          {foods.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.brand ? `[${f.brand}] ` : ''}{f.name} ({f.energyKcalPer100g || 380}g)
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Time */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 mr-0.5">زمان سرو وعده</label>
                        <div className="relative flex items-center">
                          <input
                            type="time"
                            value={mealTime}
                            onChange={(e) => setMealTime(e.target.value)}
                            className="w-full bg-white border border-coral-light/10 text-gray-800 rounded-xl px-2.5 py-2 text-xs font-bold outline-none text-center"
                          />
                          <Clock size={12} className="absolute right-3.5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 mr-0.5">اندازه وعده (گرم)</label>
                        <input
                          type="number"
                          value={mealAmountGrams}
                          onChange={(e) => setMealAmountGrams(e.target.value)}
                          placeholder="مثلاً ۵۰"
                          className="w-full bg-white border border-coral-light/10 text-gray-800 rounded-xl px-2.5 py-2 text-xs font-bold outline-none text-center"
                        />
                      </div>
                    </div>

                    {/* Calorie preview card */}
                    <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-gray-100">
                      <span className="text-[10px] font-black text-gray-400">کالری تقریبی این وعده:</span>
                      <span className="text-xs font-black text-coral">
                        {toPersian(liveComputedKcal)} کیلوکالری
                      </span>
                    </div>

                    <Button
                      type="button"
                      disabled={!selectedFoodId || !mealAmountGrams}
                      onClick={handleAddMealToPlan}
                      variant="outline"
                      className="w-full text-xs py-2.5 text-coral border-coral/25 bg-white font-bold hover:bg-coral/[0.02]"
                    >
                      <Plus size={14} className="ml-1 shrink-0" />
                      افزودن این وعده به لیست روزانه
                    </Button>
                  </div>

                  {/* Meals List representation */}
                  <div className="space-y-2">
                    <span className="block text-xs font-black text-gray-500 mr-1">
                      وعده‌های تعریف شده روزانه ({toPersian(meals.length)} وعده)
                    </span>

                    {meals.length === 0 ? (
                      <div className="p-8 border border-dashed border-gray-200 rounded-2xl text-center text-gray-400 text-xs font-bold bg-gray-50/30">
                        هنوز هیچ وعده غذایی برای این برنامه ایجاد نشده است. از ماژول بالا برای افزودن وعده‌ها استفاده کنید.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {meals.map((meal, index) => {
                          const foodItem = foods.find(f => f.id === meal.foodId);
                          const foodName = foodItem ? `${foodItem.brand ? `[${foodItem.brand}] ` : ''}${foodItem.name}` : 'غذای ناشناخته';
                          const density = foodItem ? (foodItem.energyKcalPer100g || 380) / 100 : 0;
                          const calories = Math.round(meal.amount * density);

                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-xl text-xs hover:border-gray-200 transition-all shadow-sm"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-black text-coral bg-coral/5 px-2 py-0.5 rounded-lg">
                                  {toPersian(meal.time)}
                                </span>
                                <span className="text-gray-300">•</span>
                                <span className="font-black text-gray-700">{foodName}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-extrabold text-gray-600">
                                  {toPersian(meal.amount)}g
                                  {calories > 0 ? ` (${toPersian(calories)}kcal)` : ''}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMealFromPlan(index)}
                                  className="text-gray-400 hover:text-red-500 p-0.5"
                                  aria-label="حذف وعده"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Step 2 buttons action */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
                    <Button
                      type="button"
                      onClick={() => setStep(1)}
                      variant="secondary"
                      className="flex-1 text-xs py-3 font-black text-gray-600 border border-gray-200 hover:bg-gray-50 bg-white"
                    >
                      بازگشت به مشخصات
                    </Button>
                    <Button
                      type="button"
                      disabled={meals.length === 0}
                      onClick={handleSavePlan}
                      variant="primary"
                      className="flex-1 text-xs py-3 font-black shadow-md shadow-coral/15 disabled:opacity-50"
                    >
                      {plan ? 'بروزرسانی برنامه' : 'تأیید و فعالسازی نهایی'}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </MotionDialog>
  );
};
