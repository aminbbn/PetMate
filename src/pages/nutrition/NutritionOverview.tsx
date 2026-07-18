import React from 'react';
import { useAppStore } from '../../store';
import { Card } from '../../components/Card';
import { AnimatedCardIcon } from '../../components/AnimatedCardIcon';
import { CardCornerIcon } from '../../components/card/CardCornerIcon';
import { selectActiveFeedingPlan, selectLatestWeight, selectPetMealLogs, selectPetHydrationLogs } from './nutritionSelectors';
import { toPersian } from '../../lib/persian';
import { Calendar, Clock, Award, Droplet, Plus, Check, Utensils } from 'lucide-react';

interface NutritionOverviewProps {
  onAddPlan: () => void;
  onLogNextMeal: () => void;
}

export const NutritionOverview: React.FC<NutritionOverviewProps> = ({ onAddPlan, onLogNextMeal }) => {
  const store = useAppStore();
  const activePlan = selectActiveFeedingPlan(store);
  const latestWeight = selectLatestWeight(store);
  const mealLogs = selectPetMealLogs(store);
  const hydrationLogs = selectPetHydrationLogs(store);

  // Time calculations using local timezone
  const todayStr = new Date().toLocaleDateString('en-CA');
  const todayMealLogs = mealLogs.filter(log => log.fedAt.startsWith(todayStr));
  const todayHydrationLogs = hydrationLogs.filter(log => log.recordedAt.startsWith(todayStr));

  // 1. Active Plan calculations
  const planStatusText = activePlan ? activePlan.name : 'بدون برنامه فعال';
  const planSubtext = activePlan
    ? `${toPersian(activePlan.meals.length)} وعده در روز`
    : 'تنظیم برنامه هفتگی و وعده‌ها';

  // 2. Upcoming Meal calculations
  let nextMealTime = '--:--';
  let nextMealAmount = '';
  let nextMealId = '';
  let allMealsLoggedToday = false;

  if (activePlan) {
    // Sort meals chronologically by time (HH:MM)
    const sortedPlanMeals = [...activePlan.meals].sort((a, b) => a.time.localeCompare(b.time));
    
    // Find first meal today that doesn't have a log
    const unloggedMeal = sortedPlanMeals.find(m => {
      return !todayMealLogs.some(log => log.mealId === m.id);
    });

    if (unloggedMeal) {
      nextMealTime = unloggedMeal.time;
      nextMealAmount = `${toPersian(unloggedMeal.amount)} گرم`;
      nextMealId = unloggedMeal.id;
    } else {
      allMealsLoggedToday = true;
    }
  }

  const handleQuickLogMeal = () => {
    if (!activePlan || allMealsLoggedToday || !nextMealId) return;
    
    const targetMeal = activePlan.meals.find(m => m.id === nextMealId);
    if (!targetMeal) return;

    // Add meal log to store
    store.logMeal({
      petId: activePlan.petId,
      planId: activePlan.id,
      mealId: targetMeal.id,
      foodId: targetMeal.foodId,
      fedAt: new Date().toISOString(),
      amount: targetMeal.amount,
      unit: targetMeal.unit,
      note: 'ثبت سریع از نوار وضعیت',
    });
  };

  // 3. Daily Calories calculations
  const activeCalorieTarget = activePlan?.dailyEnergyTargetKcal || 0;
  
  // Sum calories consumed today dynamically from selected foods
  const caloriesConsumedToday = todayMealLogs.reduce((sum, log) => {
    const food = store.foods.find(f => f.id === log.foodId);
    const kcalPerGram = (food?.energyKcalPer100g || 380) / 100;
    return sum + Math.round((log.amount || 0) * kcalPerGram);
  }, 0);

  const caloriePercent = activeCalorieTarget > 0
    ? Math.min(Math.round((caloriesConsumedToday / activeCalorieTarget) * 100), 100)
    : 0;

  // 4. Hydration calculations
  const waterConsumedToday = todayHydrationLogs.reduce((sum, log) => sum + (log.amountMl || 0), 0);
  
  // Safe educational recommendation: ~50ml water per kg of body weight
  const petWeight = latestWeight?.weightKg || 5; // default to 5kg if no weight recorded
  const estimatedWaterTargetMl = Math.round(petWeight * 50);
  const hydrationPercent = Math.min(Math.round((waterConsumedToday / estimatedWaterTargetMl) * 100), 100);

  const handleAddWater = () => {
    const petId = store.selectedPetId || store.profile?.id || '';
    
    store.addHydrationLog({
      petId,
      recordedAt: new Date().toISOString(),
      amountMl: 50,
      event: 'measured',
      note: 'ثبت سریع',
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" dir="rtl">
      {/* Card 1: Active Feeding Plan */}
      <Card
        glow={true}
        hoverEffect={true}
        className="bg-white border border-pm-stroke-subtle p-5 relative min-h-[140px] flex flex-col justify-between"
        contentClassName="relative w-full h-full"
      >
        <CardCornerIcon icon={Utensils} animationVariant="nutrition" tone={activePlan ? 'brand' : 'neutral'} size="sm" />
        <div className="pr-14 flex flex-col h-full justify-between">
          <div className="text-right space-y-1">
            <span className="text-[10px] text-gray-400 font-extrabold block">برنامه تغذیه فعال</span>
            <h4 className="text-sm font-black text-gray-800 line-clamp-1">{planStatusText}</h4>
            <p className="text-[11px] text-gray-500 font-bold">{planSubtext}</p>
          </div>

          <div className="pt-4 mt-4 border-t border-pm-stroke-subtle/50 flex justify-end">
            <button
              onClick={onAddPlan}
              className="text-[10px] font-black text-coral hover:text-coral-deep cursor-pointer"
            >
              {activePlan ? 'مدیریت و تغییر برنامه' : 'ایجاد اولین برنامه'}
            </button>
          </div>
        </div>
      </Card>

      {/* Card 2: Upcoming Meal Checklist */}
      <Card
        glow={true}
        hoverEffect={true}
        className="bg-white border border-pm-stroke-subtle p-5 relative min-h-[140px] flex flex-col justify-between"
        contentClassName="relative w-full h-full"
      >
        <CardCornerIcon icon={Clock} animationVariant="clock" tone={!allMealsLoggedToday ? 'warning' : 'neutral'} size="sm" />
        <div className="pr-14 flex flex-col h-full justify-between">
          <div className="text-right space-y-1">
            <span className="text-[10px] text-gray-400 font-extrabold block">وعده غذایی بعدی</span>
            {allMealsLoggedToday ? (
              <div className="flex items-center gap-1 text-green-600">
                <Check size={14} className="stroke-[3]" />
                <h4 className="text-sm font-black">تمام وعده‌ها داده شد</h4>
              </div>
            ) : (
              <>
                <h4 className="text-sm font-black text-gray-800">ساعت {toPersian(nextMealTime)}</h4>
                <p className="text-[11px] text-gray-500 font-bold">دوز وعده: {nextMealAmount}</p>
              </>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-pm-stroke-subtle/50 flex justify-end">
            {activePlan && !allMealsLoggedToday ? (
              <button
                onClick={handleQuickLogMeal}
                className="text-[10px] font-black text-coral hover:text-coral-deep flex items-center gap-1 cursor-pointer"
              >
                ثبت مصرف این وعده
              </button>
            ) : (
              <button
                onClick={onLogNextMeal}
                className="text-[10px] font-black text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ثبت وعده متفرقه دستی
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Card 3: Calorie Circle Progress */}
      <Card
        glow={true}
        hoverEffect={true}
        className="bg-white p-5 flex flex-col justify-between"
      >
        <div className="flex items-start justify-between">
          <div className="text-right space-y-1">
            <span className="text-[10px] text-gray-400 font-extrabold block">کالری دریافتی امروز</span>
            <h4 className="text-sm font-black text-gray-800">
              {toPersian(caloriesConsumedToday)} از{' '}
              {activeCalorieTarget > 0 ? toPersian(activeCalorieTarget) : '--'}
            </h4>
            <p className="text-[11px] text-gray-500 font-bold">کیلوکالری (کربوهیدرات و پروتئین)</p>
          </div>
          
          {/* Custom SVG ring progress */}
          <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="22"
                cy="22"
                r="18"
                stroke="#FDF2F0"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="22"
                cy="22"
                r="18"
                stroke="#FF6F61"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 18}`}
                strokeDashoffset={`${2 * Math.PI * 18 * (1 - caloriePercent / 100)}`}
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute text-[9px] font-extrabold text-coral">{toPersian(caloriePercent)}٪</span>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-gray-50 flex justify-between items-center text-[10px] text-gray-400 font-bold">
          <span>هدف روزانه شما:</span>
          <span className="text-coral-deep font-black">
            {activeCalorieTarget > 0 ? `${toPersian(activeCalorieTarget)} kcal` : 'نامشخص'}
          </span>
        </div>
      </Card>

      {/* Card 4: Hydration Circle Progress */}
      <Card
        glow={true}
        hoverEffect={true}
        className="bg-white p-5 flex flex-col justify-between"
      >
        <div className="flex items-start justify-between">
          <div className="text-right space-y-1">
            <span className="text-[10px] text-gray-400 font-extrabold block">آب مصرفی روزانه</span>
            <h4 className="text-sm font-black text-gray-800">
              {toPersian(waterConsumedToday)} از {toPersian(estimatedWaterTargetMl)}
            </h4>
            <p className="text-[11px] text-gray-500 font-bold">میلی‌لیتر (مایعات هیدراته)</p>
          </div>

          <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="22"
                cy="22"
                r="18"
                stroke="#EBF5FF"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="22"
                cy="22"
                r="18"
                stroke="#3B82F6"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 18}`}
                strokeDashoffset={`${2 * Math.PI * 18 * (1 - hydrationPercent / 100)}`}
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute text-[9px] font-extrabold text-blue-600">{toPersian(hydrationPercent)}٪</span>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-gray-50 flex justify-between items-center">
          <span className="text-[10px] text-gray-400 font-bold">پیشنهادی وزن بدن:</span>
          <button
            onClick={handleAddWater}
            className="text-[10px] font-black text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
          >
            <Plus size={10} />
            ۵۰ml آب
          </button>
        </div>
      </Card>
    </div>
  );
};
