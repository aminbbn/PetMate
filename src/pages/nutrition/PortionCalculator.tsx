import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { toPersian } from '../../lib/persian';
import { Scale, Info, Check, Calculator } from 'lucide-react';

export const PortionCalculator: React.FC = () => {
  const [dailyKcal, setDailyKcal] = useState<string>('');
  const [energyDensity, setEnergyDensity] = useState<string>('3800'); // kcal/kg is common
  const [mealsCount, setMealsCount] = useState<string>('3');

  const [resultDailyGrams, setResultDailyGrams] = useState<number | null>(null);
  const [resultPerMealGrams, setResultPerMealGrams] = useState<number | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const kcal = parseFloat(dailyKcal);
    const density = parseFloat(energyDensity);
    const count = parseInt(mealsCount);

    if (isNaN(kcal) || kcal <= 0 || isNaN(density) || density <= 0 || isNaN(count) || count <= 0) {
      setResultDailyGrams(null);
      setResultPerMealGrams(null);
      return;
    }

    // density is in kcal/kg. To get kcal/g, we divide by 1000.
    // portion (grams) = target kcal / (density / 1000)
    const dailyGrams = (kcal / density) * 1000;
    const perMealGrams = dailyGrams / count;

    setResultDailyGrams(Math.round(dailyGrams * 10) / 10);
    setResultPerMealGrams(Math.round(perMealGrams * 10) / 10);
  };

  return (
    <Card
      glow={true}
      hoverLift={false}
      className="p-6 border-green-200"
      dir="rtl"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0 border border-green-100">
          <Calculator size={18} />
        </div>
        <div className="text-right">
          <h4 className="text-base font-black text-coral-deep">محاسبه‌گر دستی جیره روزانه</h4>
          <p className="text-gray-400 text-xs font-semibold">تعیین وزن دقیق غذا بر اساس اهداف کالری تجویزی</p>
        </div>
      </div>

      <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Input 1 */}
        <div className="space-y-1.5 text-right">
          <label className="text-xs font-bold text-gray-500">کالری مورد نیاز روزانه (کیلوکالری)</label>
          <input
            type="number"
            required
            value={dailyKcal}
            onChange={(e) => setDailyKcal(e.target.value)}
            placeholder="مثال: ۳۵۰"
            className="w-full bg-gray-50 border border-coral-light/10 focus:border-green-400 text-gray-800 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none"
          />
        </div>

        {/* Input 2 */}
        <div className="space-y-1.5 text-right">
          <label className="text-xs font-bold text-gray-500">تراکم انرژی غذا (کالری در کیلوگرم)</label>
          <input
            type="number"
            required
            value={energyDensity}
            onChange={(e) => setEnergyDensity(e.target.value)}
            placeholder="مثال: ۳۸۰۰ (ثبت‌شده روی لیبل غذا)"
            className="w-full bg-gray-50 border border-coral-light/10 focus:border-green-400 text-gray-800 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none"
          />
        </div>

        {/* Input 3 */}
        <div className="space-y-1.5 text-right">
          <label className="text-xs font-bold text-gray-500">تعداد دفعات تغذیه در روز</label>
          <select
            value={mealsCount}
            onChange={(e) => setMealsCount(e.target.value)}
            className="w-full bg-gray-50 border border-coral-light/10 focus:border-green-400 text-gray-800 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none cursor-pointer"
          >
            <option value="1">۱ وعده در روز</option>
            <option value="2">۲ وعده در روز</option>
            <option value="3">۳ وعده در روز</option>
            <option value="4">۴ وعده در روز</option>
            <option value="5">۵ وعده در روز</option>
          </select>
        </div>

        <div className="md:col-span-3 flex justify-end mt-2">
          <Button
            type="submit"
            variant="primary"
            className="text-xs font-black px-6 py-2.5 bg-green-600 hover:bg-green-700 shadow-md shadow-green-100"
          >
            محاسبه وزن وعده‌ها
          </Button>
        </div>
      </form>

      {resultDailyGrams !== null && resultPerMealGrams !== null && (
        <div className="mt-5 p-4 rounded-xl bg-green-50/50 border border-green-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-right animate-fade-in">
          <div>
            <span className="text-xs font-bold text-gray-400">کل جیره روزانه مورد نیاز:</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-green-700">{toPersian(resultDailyGrams)}</span>
              <span className="text-xs font-bold text-gray-500">گرم در روز</span>
            </div>
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400">اندازه هر وعده تکی:</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-green-700">{toPersian(resultPerMealGrams)}</span>
              <span className="text-xs font-bold text-gray-500">گرم به ازای هر وعده ({toPersian(mealsCount)} وعده)</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2 items-start bg-gray-50 p-3 rounded-xl border border-gray-100">
        <Info className="text-blue-500 shrink-0 mt-0.5" size={14} />
        <p className="text-gray-400 text-[10px] font-semibold leading-relaxed text-right">
          اطلاعات تراکم انرژی (Energy Density / Metabolizable Energy) به صورت کیلوکالری بر کیلوگرم (kcal/kg) روی تمامی بسته‌بندی‌های غذای استاندارد شرکتی درج شده است. لطفاً ارقام فرضی وارد نکنید.
        </p>
      </div>
    </Card>
  );
};
