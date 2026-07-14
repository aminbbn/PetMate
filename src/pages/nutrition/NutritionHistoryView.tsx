import React from 'react';
import { useAppStore } from '../../store';
import { selectPetMealLogs, selectPetHydrationLogs, selectPetFoods } from './nutritionSelectors';
import { toPersian, formatPersianDate } from '../../lib/persian';
import { Card } from '../../components/Card';
import { Utensils, Droplet, Clock, Coffee, Sparkles, Clipboard } from 'lucide-react';

export const NutritionHistoryView: React.FC = () => {
  const store = useAppStore();
  const mealLogs = selectPetMealLogs(store);
  const hydrationLogs = selectPetHydrationLogs(store);
  const foods = selectPetFoods(store);

  // Group everything by date
  const datesSet = new Set<string>();
  mealLogs.forEach((log) => datesSet.add(log.date));
  hydrationLogs.forEach((log) => datesSet.add(log.date));

  // Sort dates descending
  const sortedDates = Array.from(datesSet).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h3 className="text-xl font-black text-coral-deep">تاریخچه تغذیه و هیدراتاسیون</h3>
        <p className="text-gray-500 text-xs font-semibold mt-1">
          بایگانی و بررسی روزانه وعده‌های مصرفی و حجم آب آشامیدنی پت
        </p>
      </div>

      {sortedDates.length === 0 ? (
        <Card className="p-10 text-center border-dashed border-2 border-coral-light/10 flex flex-col items-center justify-center">
          <Clipboard size={44} className="text-gray-300 mb-3" />
          <h4 className="text-base font-black text-gray-700">هیچ سابقه ثبت‌شده‌ای وجود ندارد</h4>
          <p className="text-gray-400 text-xs font-semibold mt-1.5 max-w-sm leading-relaxed">
            گزارش وعده‌های مصرفی امروز یا روزهای قبل در این بخش آرشیو خواهند شد. ثبت منظم وعده‌ها به درک الگوهای رفتاری و بهداشتی کمک شایانی می‌کند.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedDates.slice(0, 14).map((dateStr) => {
            const dayMeals = mealLogs.filter((log) => log.date === dateStr);
            const dayHydrations = hydrationLogs.filter((log) => log.date === dateStr);

            const totalCalories = dayMeals.reduce((sum, log) => sum + (log.caloriesConsumed || 0), 0);
            const totalWater = dayHydrations.reduce((sum, log) => sum + log.amountMl, 0);

            return (
              <Card
                key={dateStr}
                glow={false}
                hoverLift={false}
                className="p-5 border border-coral-light/10 bg-white space-y-4 text-right"
              >
                {/* Header Strip of the Date Group */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-50 pb-3">
                  <h4 className="text-sm font-black text-coral-deep flex items-center gap-2">
                    <Clock size={16} className="text-coral" />
                    {formatPersianDate(dateStr)}
                  </h4>

                  <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <span className="flex items-center gap-1 bg-green-50 text-green-700 py-1 px-2.5 rounded-lg border border-green-100">
                      <Utensils size={12} />
                      {toPersian(totalCalories)} ک‌کالری
                    </span>
                    <span className="flex items-center gap-1 bg-blue-50 text-blue-700 py-1 px-2.5 rounded-lg border border-blue-100">
                      <Droplet size={12} />
                      {toPersian(totalWater)} میلی‌لیتر آب
                    </span>
                  </div>
                </div>

                {/* Sublist: Meals and Hydration unified or separated */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Meal sublist */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-gray-400">وعده‌های غذایی مصرف‌شده</h5>
                    {dayMeals.length === 0 ? (
                      <p className="text-[11px] text-gray-400 italic">وعده غذایی در این روز ثبت نشده است.</p>
                    ) : (
                      <div className="space-y-2">
                        {dayMeals.map((log) => {
                          const foodName = foods.find((f) => f.id === log.foodId)?.brandAndName || 'غذای ثبت‌شده';
                          return (
                            <div key={log.id} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/50 border border-gray-100 text-xs">
                              <div className="flex items-center gap-2">
                                <Coffee size={13} className="text-gray-400" />
                                <span className="font-semibold text-gray-500">ساعت {toPersian(log.time)}</span>
                                <span className="text-gray-300">•</span>
                                <span className="font-black text-gray-800">{foodName}</span>
                              </div>
                              <span className="font-bold text-gray-600">
                                {toPersian(log.amountGrams)}g ({toPersian(log.caloriesConsumed)}kcal)
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Hydration sublist */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-gray-400">آب نوشیده‌شده</h5>
                    {dayHydrations.length === 0 ? (
                      <p className="text-[11px] text-gray-400 italic">گزارش آبی در این روز ثبت نشده است.</p>
                    ) : (
                      <div className="space-y-2">
                        {dayHydrations.map((log) => (
                          <div key={log.id} className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/10 border border-blue-100/50 text-xs">
                            <div className="flex items-center gap-2">
                              <Droplet size={12} className="text-blue-400" />
                              <span className="font-semibold text-gray-500">ساعت {toPersian(log.time)}</span>
                              {log.notes && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <span className="text-gray-400 text-[10px]">{log.notes}</span>
                                </>
                              )}
                            </div>
                            <span className="font-black text-blue-900">{toPersian(log.amountMl)} میلی‌لیتر</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
