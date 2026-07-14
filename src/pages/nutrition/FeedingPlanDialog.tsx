import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../../store';
import { FeedingPlan, FeedingPlanMeal } from './nutritionTypes';
import { selectPetFoods } from './nutritionSelectors';
import { Button } from '../../components/Button';
import { X, Plus, Trash2, ShieldCheck, Clock, Utensils, Award } from 'lucide-react';
import { toPersian } from '../../lib/persian';

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

  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

    // Sort meals by time chronologically
    const updatedMeals = [...meals, newMeal].sort((a, b) => a.time.localeCompare(b.time));
    setMeals(updatedMeals);
    setMealAmountGrams('');

    // Pre-populate next logical meal time (e.g., +6 hours)
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

    // Give each meal a temporary unique ID for updates to conform to FeedingPlanMeal[]
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
      // Edit plan
      store.updateFeedingPlan(plan.id, planData);
    } else {
      // Add plan - matches CreateFeedingPlanInput
      store.addFeedingPlan({
        petId,
        name: name.trim(),
        source,
        dailyEnergyTargetKcal: isNaN(kcalTarget) ? undefined : kcalTarget,
        notes: notes.trim() || undefined,
        meals: meals, // CreateFeedingPlanInput takes Omit<FeedingPlanMeal, 'id'>[]
      });
    }

    onSuccess();
  };

  const desktopVariants = {
    initial: { opacity: 0, scale: 0.95, y: 16 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 12 },
  };

  const mobileVariants = {
    initial: { y: '100%', opacity: 1 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 1 },
  };

  const activeVariants = isMobile ? mobileVariants : desktopVariants;

  // Selected food info for live calorie preview
  const currentChosenFood = foods.find(f => f.id === selectedFoodId);
  // energyKcalPer100g is per 100g -> divide by 100 to get per gram
  const liveKcalPerGram = currentChosenFood ? (currentChosenFood.energyKcalPer100g || 380) / 100 : 0;
  const liveGrams = parseFloat(mealAmountGrams);
  const liveComputedKcal = !isNaN(liveGrams) && liveGrams > 0 ? Math.round(liveGrams * liveKcalPerGram) : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 backdrop-blur-xs cursor-pointer"
          />

          {/* Dialog Container */}
          <div className="fixed inset-0 flex items-end md:items-center justify-center p-0 md:p-4 z-50 pointer-events-none" dir="rtl">
            <motion.div
              ref={containerRef}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={activeVariants}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="bg-white w-full md:max-w-xl max-h-[95vh] md:max-h-[90vh] rounded-t-[32px] md:rounded-[24px] shadow-2xl p-6 md:p-8 overflow-y-auto pointer-events-auto flex flex-col justify-between border border-coral-light/10 text-right"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
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
              <div className="flex gap-2 items-center justify-center py-3 border-b border-gray-50">
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

              {/* Step 1 Content: General details */}
              {step === 1 && (
                <div className="space-y-4 py-4 flex-1">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">عنوان برنامه زمانبندی</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: رژیم روتین تابستانی"
                      className="w-full bg-gray-50 border border-coral-light/10 focus:border-coral rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-800 outline-none"
                    />
                  </div>

                  {/* Plan Source */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">منبع هدایت تغذیه‌ای جیره</label>
                    <select
                      value={source}
                      onChange={(e) => setSource(e.target.value as any)}
                      className="w-full bg-gray-50 border border-coral-light/10 text-gray-800 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none cursor-pointer"
                    >
                      <option value="veterinarian">نسخه و رژیم کتبی دامپزشک (توصیه تخصصی)</option>
                      <option value="product_label">راهنمای تغذیه مندرج روی بسته بندی کالا (پیشنهاد شرکتی)</option>
                      <option value="educational_estimate">محاسبات و برآورد آموزشی پورتال (DER تخمینی)</option>
                      <option value="user">سلیقه شخصی دارنده پت</option>
                    </select>
                  </div>

                  {/* Daily Calories Target */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">کالری هدف روزانه (کیلوکالری - اختیاری)</label>
                    <input
                      type="number"
                      value={dailyKcal}
                      onChange={(e) => setDailyKcal(e.target.value)}
                      placeholder="مثال: ۴۲۰"
                      className="w-full bg-gray-50 border border-coral-light/10 focus:border-coral rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-800 outline-none"
                    />
                    <span className="text-[10px] text-gray-400 font-semibold block leading-normal">
                      می‌توانید این مقدار را مستقیماً از روی محاسبه‌گر نیاز انرژی (در تب تنظیمات) استخراج و وارد کنید.
                    </span>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">دستورالعمل‌ها یا توضیحات تکمیلی (اختیاری)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="مثال: غذای خشک حتماً با کمی آب ولرم نرم شود، آب کاسه حداقل دو بار تعویض گردد."
                      rows={3}
                      className="w-full bg-gray-50 border border-coral-light/10 focus:border-coral rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-800 outline-none resize-none"
                    />
                  </div>

                  {source === 'veterinarian' && (
                    <div className="bg-green-50 p-3.5 rounded-xl border border-green-200 text-green-800 text-[11px] font-semibold flex gap-2 items-start leading-relaxed">
                      <ShieldCheck size={14} className="shrink-0 mt-0.5 text-green-600" />
                      <span>
                        انتخاب گزینه «نسخه دامپزشک» ایمن‌ترین راه تغذیه سگ و گربه است. همیشه رژیم را بر اساس نظر پزشک خود هدایت کنید.
                      </span>
                    </div>
                  )}

                  {/* Actions step 1 */}
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
                      className="flex-1 text-xs py-3 font-black shadow-md shadow-coral/15 disabled:opacity-50"
                    >
                      مرحله بعد: افزودن وعده‌ها
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2 Content: Meals list & scheduling builder */}
              {step === 2 && (
                <div className="space-y-4 py-4 flex-1">
                  {foods.length === 0 ? (
                    <div className="py-8 text-center space-y-3">
                      <Utensils size={32} className="text-gray-300 mx-auto" />
                      <h4 className="text-sm font-black text-gray-700">هیچ غذایی در کتابخانه ثبت نشده است!</h4>
                      <p className="text-gray-400 text-xs font-medium max-w-xs mx-auto">
                        قبل از ثبت وعده‌های زمانبندی، باید ابتدا غذاهای خشک، تر، یا خانگی پت خود را در بخش «کتابخانه غذا» تعریف کنید.
                      </p>
                      <Button
                        type="button"
                        onClick={onClose}
                        variant="secondary"
                        className="text-xs py-2 px-4 border border-gray-200"
                      >
                        بستن و تعریف غذا در کتابخانه
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* Add Meal Mini Form Block */}
                      <div className="bg-gray-50 p-4 rounded-xl border border-coral-light/10 space-y-3">
                        <h4 className="text-xs font-black text-gray-700">فرم افزودن تک وعده جدید</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {/* Choose food */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500">انتخاب ماده غذایی</label>
                            <select
                              value={selectedFoodId}
                              onChange={(e) => setSelectedFoodId(e.target.value)}
                              className="w-full bg-white border border-gray-200 text-gray-800 rounded-lg p-2 text-xs font-bold outline-none cursor-pointer"
                            >
                              {foods.map(f => (
                                <option key={f.id} value={f.id}>{f.brand ? f.brand + ' - ' : ''}{f.name}</option>
                              ))}
                            </select>
                          </div>

                          {/* Choose time */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500">زمان توزیع وعده</label>
                            <input
                              type="time"
                              required
                              value={mealTime}
                              onChange={(e) => setMealTime(e.target.value)}
                              className="w-full bg-white border border-gray-200 text-gray-800 rounded-lg p-1.5 text-xs font-bold outline-none"
                            />
                          </div>

                          {/* Choose weight */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500">وزن دوز وعده (گرم)</label>
                            <input
                              type="number"
                              required
                              value={mealAmountGrams}
                              onChange={(e) => setMealAmountGrams(e.target.value)}
                              placeholder="مثال: ۴۵"
                              className="w-full bg-white border border-gray-200 text-gray-800 rounded-lg p-1.5 text-xs font-bold outline-none"
                            />
                          </div>
                        </div>

                        {/* Live computations */}
                        <div className="flex justify-between items-center pt-2">
                          {liveComputedKcal > 0 ? (
                            <span className="text-[10px] text-green-600 font-extrabold flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded">
                              <Award size={12} />
                              کالری محاسبه شده این وعده: {toPersian(liveComputedKcal)} ک‌کالری
                            </span>
                          ) : (
                            <span className="text-[9px] text-gray-400 italic">وزن و غذا را جهت برآورد کالری وارد کنید</span>
                          )}

                          <Button
                            type="button"
                            onClick={handleAddMealToPlan}
                            disabled={!selectedFoodId || !mealAmountGrams}
                            className="text-[11px] font-black py-1.5 px-3.5 bg-coral text-white hover:bg-coral-deep shadow-sm disabled:opacity-50"
                          >
                            افزودن به برنامه
                          </Button>
                        </div>
                      </div>

                      {/* Meals Scheduled List */}
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        <h4 className="text-xs font-bold text-gray-400">وعده‌های زمانبندی شده جیره:</h4>
                        
                        {meals.length === 0 ? (
                          <p className="text-gray-400 text-xs py-6 text-center italic">هیچ وعده‌ای به این برنامه اضافه نشده است.</p>
                        ) : (
                          <div className="space-y-2">
                            {meals.map((meal, index) => {
                              const food = foods.find(f => f.id === meal.foodId);
                              const foodName = food ? `${food.brand ? food.brand + ' - ' : ''}${food.name}` : 'غذای ثبت‌شده';
                              const kcalPerGram = (food?.energyKcalPer100g || 380) / 100;
                              const calories = Math.round((meal.amount || 0) * kcalPerGram);

                              return (
                                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 text-xs">
                                  <div className="flex items-center gap-3">
                                    <Clock size={13} className="text-gray-400" />
                                    <span className="font-bold text-coral">ساعت {toPersian(meal.time)}</span>
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
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
