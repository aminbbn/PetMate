import React from 'react';
import { useAppStore } from '../../store';
import { selectActiveFeedingPlan, selectPetFoods } from './nutritionSelectors';
import { toPersian } from '../../lib/persian';
import { Card } from '../../components/Card';
import { Calendar, Utensils, AlertCircle } from 'lucide-react';

export const WeeklyFeedingView: React.FC = () => {
  const store = useAppStore();
  const activePlan = selectActiveFeedingPlan(store);
  const foods = selectPetFoods(store);

  const daysOfWeek = [
    { key: 'saturday', label: 'شنبه' },
    { key: 'sunday', label: 'یکشنبه' },
    { key: 'monday', label: 'دوشنبه' },
    { key: 'tuesday', label: 'سه‌شنبه' },
    { key: 'wednesday', label: 'چهارشنبه' },
    { key: 'thursday', label: 'پنج‌شنبه' },
    { key: 'friday', label: 'جمعه' },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-coral-deep">برنامه زمانبندی هفتگی</h3>
          <p className="text-gray-500 text-xs font-semibold mt-1">
            مجموعه زمانبندی‌های تکرارشونده روزانه به تفکیک روزهای هفته
          </p>
        </div>
      </div>

      {activePlan ? (
        <div className="space-y-4">
          <div className="bg-coral/5 border border-coral-light/20 rounded-2xl p-4 flex gap-3 items-start">
            <AlertCircle className="text-coral shrink-0 mt-0.5" size={16} />
            <p className="text-gray-600 text-xs font-semibold leading-relaxed text-right">
              برنامه <span className="font-black text-coral">{activePlan.name}</span> به صورت پیش‌فرض به تمام روزهای هفته تعمیم داده شده است. تغذیه روتین و منظم در ساعات مشخص روز، بهترین پاسخ گوارشی را در سگ‌ها و گربه‌ها ایجاد می‌کند.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {daysOfWeek.map((day) => (
              <Card
                key={day.key}
                glow={false}
                hoverLift={true}
                className="p-4 flex flex-col h-full justify-between border border-coral-light/10"
              >
                <div>
                  <h4 className="text-sm font-black text-coral-deep border-b border-gray-100 pb-2 mb-3">
                    {day.label}
                  </h4>

                  <div className="space-y-3">
                    {activePlan.meals.map((meal, idx) => {
                      const food = foods.find(f => f.id === meal.foodId);
                      return (
                        <div key={`${day.key}-${meal.id}`} className="space-y-0.5 text-right">
                          <div className="flex items-center gap-1 text-[11px] font-black text-gray-800">
                            <span className="w-1 h-1 rounded-full bg-coral shrink-0" />
                            ساعت {toPersian(meal.time)}
                          </div>
                          <p className="text-[10px] font-bold text-gray-500 mr-2 truncate">
                            {toPersian(meal.amountGrams)}g • {food?.brandAndName || 'غذای روتین'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-[10px] text-gray-400 font-extrabold text-left pt-3 mt-4 border-t border-gray-50">
                  {toPersian(activePlan.meals.length)} وعده
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="p-10 text-center border-dashed border-2 border-coral-light/20 flex flex-col items-center justify-center">
          <Calendar size={48} className="text-gray-300 mb-3" />
          <h4 className="text-base font-black text-gray-700">هیچ برنامه فعالی جهت نمایش هفتگی وجود ندارد</h4>
          <p className="text-gray-400 text-xs font-semibold mt-1.5 max-w-md leading-relaxed">
            جهت مشاهده زمانبندی توزیع هفتگی جیره، باید ابتدا یک برنامه غذایی تعریف و آن را به حالت فعال تغییر دهید.
          </p>
        </Card>
      )}
    </div>
  );
};
