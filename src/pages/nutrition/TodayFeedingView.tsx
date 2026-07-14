import React from 'react';
import { useAppStore } from '../../store';
import { selectActiveFeedingPlan, selectPetFoods, selectPetMealLogs, selectPetHydrationLogs } from './nutritionSelectors';
import { toPersian, formatPersianDate } from '../../lib/persian';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Plus, Check, Trash2, Droplet, Clock, Coffee, Utensils, ClipboardCheck } from 'lucide-react';

interface TodayFeedingViewProps {
  onLogMeal: () => void;
  onAddHydration: () => void;
}

export const TodayFeedingView: React.FC<TodayFeedingViewProps> = ({ onLogMeal, onAddHydration }) => {
  const store = useAppStore();
  const activePlan = selectActiveFeedingPlan(store);
  const foods = selectPetFoods(store);
  const mealLogs = selectPetMealLogs(store);
  const hydrationLogs = selectPetHydrationLogs(store);

  // Use local YYYY-MM-DD date to avoid UTC mismatches
  const todayStr = new Date().toLocaleDateString('en-CA');
  
  const todayMealLogs = mealLogs.filter(log => log.fedAt.startsWith(todayStr));
  const todayHydrationLogs = hydrationLogs.filter(log => log.recordedAt.startsWith(todayStr));

  const handleToggleMealLog = (planMealId: string) => {
    if (!activePlan) return;
    const targetMeal = activePlan.meals.find(m => m.id === planMealId);
    if (!targetMeal) return;

    const existingLog = todayMealLogs.find(log => log.mealId === planMealId);
    if (existingLog) {
      store.deleteMealLog(existingLog.id);
    } else {
      store.logMeal({
        petId: activePlan.petId,
        planId: activePlan.id,
        mealId: targetMeal.id,
        foodId: targetMeal.foodId,
        fedAt: new Date().toISOString(),
        amount: targetMeal.amount,
        unit: targetMeal.unit,
        note: 'ثبت خودکار زمانبندی',
      });
    }
  };

  const handleDeleteMealLog = (id: string) => {
    store.deleteMealLog(id);
  };

  const handleDeleteHydration = (id: string) => {
    store.deleteHydrationLog(id);
  };

  const extractTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return '--:--';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" dir="rtl">
      {/* Right Column: Scheduled Meals Checklist */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-coral-deep">زمانبندی وعده‌های امروز</h3>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 py-1 px-3 rounded-full">
            {formatPersianDate(new Date())}
          </span>
        </div>

        {activePlan ? (
          <div className="space-y-4">
            {activePlan.meals.map((meal, idx) => {
              const isLogged = todayMealLogs.some(log => log.mealId === meal.id);
              const food = foods.find(f => f.id === meal.foodId);
              const foodName = food ? `${food.brand ? food.brand + ' - ' : ''}${food.name}` : 'غذای ثبت‌شده';

              // Calculate calories dynamically
              // energyKcalPer100g is per 100g
              const kcalPerGram = (food?.energyKcalPer100g || 380) / 100;
              const computedCalories = Math.round((meal.amount || 0) * kcalPerGram);

              return (
                <div
                  key={meal.id}
                  onClick={() => handleToggleMealLog(meal.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer select-none group/item ${
                    isLogged
                      ? 'bg-green-50/40 border-green-200 text-green-800 shadow-xs'
                      : 'bg-white border-coral-light/10 hover:border-coral-light/20 text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Checkbox button */}
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                        isLogged
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'bg-gray-50 border-gray-200 group-hover/item:border-coral/50'
                      }`}
                    >
                      {isLogged && <Check size={14} strokeWidth={3} />}
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md border border-gray-100">
                          وعده {toPersian(idx + 1)}
                        </span>
                        <span className={`text-sm font-black ${isLogged ? 'text-green-800 line-through opacity-70' : 'text-gray-800'}`}>
                          ساعت {toPersian(meal.time)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Utensils size={12} className={isLogged ? 'text-green-600' : 'text-gray-400'} />
                        <span className="text-xs font-semibold text-gray-500">{foodName}</span>
                        <span className="text-gray-300 text-xs">•</span>
                        <span className="text-xs font-bold text-gray-600">
                          {toPersian(meal.amount)} گرم
                        </span>
                        {computedCalories > 0 && (
                          <>
                            <span className="text-gray-300 text-xs">•</span>
                            <span className="text-xs font-bold text-coral">
                              {toPersian(computedCalories)} ک‌کالری
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-left font-bold text-xs">
                    {isLogged ? (
                      <span className="text-green-600 bg-green-100/50 py-1 px-2.5 rounded-lg">مصرف شد</span>
                    ) : (
                      <span className="text-gray-400 group-hover/item:text-coral transition-colors">کلیک جهت ثبت</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Card glow={false} className="p-8 text-center border-dashed border-2 border-coral-light/20 flex flex-col items-center justify-center">
            <ClipboardCheck size={40} className="text-gray-300 mb-3" />
            <h4 className="text-base font-black text-gray-700">هیچ برنامه زمانبندی فعالی وجود ندارد</h4>
            <p className="text-gray-400 text-xs font-medium mt-1.5 max-w-sm leading-relaxed">
              با کلیک روی «افزودن برنامه غذا»، یک زمانبندی برای توزیع وعده‌ها، تعیین کالری هدف و انتخاب مواد غذایی پت خود بسازید.
            </p>
          </Card>
        )}

        {/* Custom manual logs list today */}
        {todayMealLogs.filter(log => !log.mealId).length > 0 && (
          <div className="space-y-3 mt-6">
            <h4 className="text-xs font-bold text-gray-400">وعده‌های دستی یا تشویقی ثبت‌شده امروز</h4>
            <div className="space-y-2">
              {todayMealLogs.filter(log => !log.mealId).map(log => {
                const food = foods.find(f => f.id === log.foodId);
                const foodName = food ? `${food.brand ? food.brand + ' - ' : ''}${food.name}` : 'غذای آزاد';
                const kcalPerGram = (food?.energyKcalPer100g || 380) / 100;
                const computedCalories = Math.round((log.amount || 0) * kcalPerGram);

                return (
                  <div key={log.id} className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-coral-light/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-coral/5 text-coral flex items-center justify-center">
                        <Coffee size={14} />
                      </div>
                      <div className="text-right">
                        <h5 className="text-xs font-black text-gray-800">
                          {foodName} <span className="text-gray-400 font-semibold">(ساعت {toPersian(extractTime(log.fedAt))})</span>
                        </h5>
                        <p className="text-[10px] font-bold text-gray-500 mt-0.5">
                          مقدار: {toPersian(log.amount || 0)} گرم
                          {computedCalories > 0 && ` • ${toPersian(computedCalories)} ک‌کالری`}
                          {log.note && ` • ${log.note}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteMealLog(log.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      aria-label="حذف وعده ثبت‌شده"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Left Column: Hydration timeline and logs */}
      <div className="lg:col-span-5 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black text-coral-deep">تاریخچه آب مصرفی امروز</h3>
          <Button
            onClick={onAddHydration}
            variant="secondary"
            className="flex items-center gap-1 py-1.5 px-3 text-xs bg-blue-50 border border-blue-100 hover:bg-blue-100 text-blue-600 rounded-lg"
          >
            <Plus size={12} />
            ثبت آب مصرفی
          </Button>
        </div>

        <Card className="p-6">
          {todayHydrationLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Droplet size={32} className="text-blue-200 mb-2" />
              <h4 className="text-sm font-black text-gray-700">آبی ثبت نشده است</h4>
              <p className="text-gray-400 text-xs font-medium mt-1">
                برای هیدراته ماندن پت، آب مصرفی او را به مرور ثبت کنید.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayHydrationLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-blue-50/20 border border-blue-100/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center shrink-0">
                      <Droplet size={14} />
                    </div>
                    <div className="text-right">
                      <h4 className="text-xs font-black text-blue-900">
                        {toPersian(log.amountMl || 0)} میلی‌لیتر آب
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock size={10} />
                        ساعت {toPersian(extractTime(log.recordedAt))}
                        {log.note && ` • ${log.note}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteHydration(log.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    aria-label="حذف گزارش آب"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
