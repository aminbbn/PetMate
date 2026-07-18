import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useAppStore } from '../../store';
import { WeightEntry, RangeFilter } from './growthTypes';
import { selectSortedEntries, selectWeightGoal } from './growthSelectors';
import { filterEntriesByRange, getShortJalaliLabel, formatFullPersianDateTime } from './growthUtils';
import { toPersian, formatPersianDate } from '../../lib/persian';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceArea, ReferenceLine } from 'recharts';
import { Scale, TrendingUp, Info } from 'lucide-react';
import { AnimatedCardIcon } from '../../components/AnimatedCardIcon';

interface WeightChartProps {
  onAddWeight: () => void;
}

export const WeightChart: React.FC<WeightChartProps> = ({ onAddWeight }) => {
  const store = useAppStore();
  const sortedEntries = selectSortedEntries(store);
  const goal = selectWeightGoal(store);

  const [activeFilter, setActiveFilter] = useState<RangeFilter>('all');

  // Determine smallest range containing at least 2 points
  useEffect(() => {
    const filters: RangeFilter[] = ['30_days', '3_months', '6_months', '1_year'];
    let chosen: RangeFilter = 'all';
    for (const f of filters) {
      const filtered = filterEntriesByRange(sortedEntries, f);
      if (filtered.length >= 2) {
        chosen = f;
        break;
      }
    }
    setActiveFilter(chosen);
  }, [sortedEntries]);

  const filteredData = filterEntriesByRange(sortedEntries, activeFilter);
  const pointCount = filteredData.length;

  const handleResetFilter = () => {
    setActiveFilter('all');
  };

  // Adaptive Y-Axis Domain calculation to avoid exaggerated scales
  let minWeight = 0;
  let maxWeight = 10;
  if (pointCount > 0) {
    const weights = filteredData.map(d => d.weightKg);
    const actualMin = Math.min(...weights);
    const actualMax = Math.max(...weights);
    
    // Add safety margin
    if (actualMax === actualMin) {
      minWeight = Math.max(0, actualMin - 1);
      maxWeight = actualMax + 1;
    } else {
      const padding = (actualMax - actualMin) * 0.15;
      minWeight = Math.max(0, actualMin - padding);
      maxWeight = actualMax + padding;
    }
  }

  // Handle goals in Y axis domain
  if (goal) {
    if (goal.minKg) minWeight = Math.min(minWeight, goal.minKg * 0.9);
    if (goal.maxKg) maxWeight = Math.max(maxWeight, goal.maxKg * 1.1);
    if (goal.targetKg) {
      minWeight = Math.min(minWeight, goal.targetKg * 0.9);
      maxWeight = Math.max(maxWeight, goal.targetKg * 1.1);
    }
  }

  // Format Recharts readable payload
  const chartPoints = filteredData.map((e, index) => ({
    key: e.id,
    measuredAt: e.measuredAt,
    weightKg: e.weightKg,
    rawEntry: e,
    index,
    // Short localized date for XAxis tick
    displayLabel: getShortJalaliLabel(e.measuredAt, activeFilter)
  }));

  // Render range selector buttons
  const renderFilterBtn = (filter: RangeFilter, label: string) => (
    <button
      type="button"
      onClick={() => setActiveFilter(filter)}
      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
        activeFilter === filter
          ? 'bg-sunny/20 text-yellow-800'
          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
      }`}
      aria-pressed={activeFilter === filter}
    >
      {label}
    </button>
  );

  return (
    <Card
      hoverLift={false}
      className="p-6 md:p-8 border border-coral-light/10 shadow-sm min-h-[460px] flex flex-col justify-between"
    >
      {/* Chart Card Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-50 mb-6">
        <h3 className="font-black text-gray-800 text-lg flex items-center gap-2.5">
          <AnimatedCardIcon variant="trend" tone="sunny" size="sm" />
          نمودار تغییرات وزن
        </h3>

        {/* Range Filters */}
        {sortedEntries.length > 0 && (
          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl">
            {renderFilterBtn('30_days', '۳۰ روز')}
            {renderFilterBtn('3_months', '۳ ماه')}
            {renderFilterBtn('6_months', '۶ ماه')}
            {renderFilterBtn('1_year', '۱ سال')}
            {renderFilterBtn('all', 'همه')}
          </div>
        )}
      </div>

      {/* Chart States */}
      <div className="flex-1 flex flex-col justify-center w-full">
        {sortedEntries.length === 0 ? (
          /* State 0: Empty State */
          <div className="py-12 flex flex-col items-center text-center space-y-4">
            <Scale className="text-gray-300 w-16 h-16 animate-pulse" />
            <p className="text-gray-400 font-bold text-sm">اطلاعاتی برای رسم نمودار ثبت نشده است.</p>
            <Button onClick={onAddWeight} variant="outline" className="text-xs font-bold py-2 px-5">
              ثبت وزن جدید
            </Button>
          </div>
        ) : pointCount === 1 ? (
          /* State 1: Only One Point in active range */
          <div className="py-8 flex flex-col items-center text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-sunny/10 text-sunny flex items-center justify-center text-2xl font-black">
              {toPersian(filteredData[0].weightKg)}
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-400 font-black">تک ثبت فعال در تاریخ {formatPersianDate(filteredData[0].measuredAt)}</p>
              <p className="text-xs text-gray-500 font-bold max-w-sm">
                برای نمایش نمودار روند و مقایسه تغییرات، حداقل یک وزن دیگر ثبت کنید.
              </p>
            </div>
            <div className="flex gap-2">
              {activeFilter !== 'all' && (
                <Button onClick={handleResetFilter} variant="outline" className="text-xs font-bold py-2 px-4">
                  نمایش همه داده‌ها
                </Button>
              )}
              <Button onClick={onAddWeight} variant="primary" className="text-xs font-black py-2 px-5">
                ثبت وزن بعدی
              </Button>
            </div>
          </div>
        ) : (
          /* State 2: Multiple Points */
          <div className="space-y-6">
            <div className="h-72 w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWeightGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#FBBF24" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis
                    dataKey="displayLabel"
                    stroke="#9CA3AF"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    domain={[minWeight, maxWeight]}
                    tickFormatter={(v) => toPersian(v.toFixed(1))}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const raw = payload[0].payload.rawEntry as WeightEntry;
                        
                        // Compare with immediately preceding point if index > 0
                        let changeText = '';
                        if (payload[0].payload.index > 0) {
                          const prev = chartPoints[payload[0].payload.index - 1].rawEntry;
                          const diff = raw.weightKg - prev.weightKg;
                          if (diff > 0.001) changeText = `(+${toPersian(diff.toFixed(1))} کیلوگرم)`;
                          else if (diff < -0.001) changeText = `(${toPersian(diff.toFixed(1))} کیلوگرم)`;
                          else changeText = '(بدون تغییر)';
                        }

                        return (
                          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-coral-light/20 text-right space-y-1.5" dir="rtl">
                            <p className="text-[10px] text-gray-400 font-bold">
                              {formatFullPersianDateTime(raw.measuredAt)}
                            </p>
                            <p className="text-sm font-black text-gray-800">
                              وزن: <span className="text-sunny text-base">{toPersian(raw.weightKg.toFixed(1))}</span> کیلوگرم
                            </p>
                            {changeText && (
                              <p className="text-xs text-gray-500 font-medium">
                                تغییر نسبت به ثبت قبلی: <span className="font-bold">{changeText}</span>
                              </p>
                            )}
                            {raw.source && (
                              <p className="text-[10px] text-gray-400 font-bold">
                                محل: {raw.source === 'home' ? 'در خانه' : raw.source === 'veterinary_clinic' ? 'کلینیک دامپزشکی' : 'آرایشگاه'}
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  {/* Target Goal Shaded Band */}
                  {goal && goal.minKg && goal.maxKg && (
                    <ReferenceArea
                      y1={goal.minKg}
                      y2={goal.maxKg}
                      fill="#4ADE80"
                      fillOpacity={0.06}
                      stroke="none"
                    />
                  )}

                  {/* Target Goal Single reference line */}
                  {goal && goal.targetKg && (
                    <ReferenceLine
                      y={goal.targetKg}
                      stroke="#10B981"
                      strokeDasharray="3 3"
                    />
                  )}

                  <Area
                    type="monotone"
                    dataKey="weightKg"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorWeightGlow)"
                    dot={{ stroke: '#F59E0B', strokeWidth: 2, r: 4, fill: '#FFFFFF' }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#E85A5D' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Accessible Summary outside SVG */}
            <div className="bg-peach/10 rounded-2xl p-4 flex items-start gap-2.5 text-right border border-coral-light/5">
              <Info size={16} className="text-coral shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-black text-gray-700 block">خلاصه پیشرفت و نمودار وزن:</span>
                <p className="text-gray-500 font-medium leading-relaxed">
                  نمودار فوق {toPersian(pointCount)} ثبت وزن را در بازه انتخابی نشان می‌دهد.
                  {goal && (
                    <span className="text-green-700 font-bold block mt-1">
                      {goal.targetKg ? (
                        `وزن هدف ثبت شده: ${toPersian(goal.targetKg)} کیلوگرم`
                      ) : (
                        `محدوده هدف ثبت شده: ${toPersian(goal.minKg)} تا ${toPersian(goal.maxKg)} کیلوگرم`
                      )}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
