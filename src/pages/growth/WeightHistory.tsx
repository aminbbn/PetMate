import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useAppStore } from '../../store';
import { WeightEntry } from './growthTypes';
import { selectSortedEntries } from './growthSelectors';
import { getSourceLabel, formatFullPersianDateTime } from './growthUtils';
import { toPersian, formatPersianDate } from '../../lib/persian';
import { Trash2, Edit3, Calendar, MapPin, AlignRight, FileText, ArrowUpDown } from 'lucide-react';
import { AnimatedCardIcon } from '../../components/AnimatedCardIcon';

interface WeightHistoryProps {
  onEditEntry: (entry: WeightEntry) => void;
}

export const WeightHistory: React.FC<WeightHistoryProps> = ({ onEditEntry }) => {
  const store = useAppStore();
  const sortedEntries = selectSortedEntries(store);
  const deleteWeightEntry = useAppStore(state => state.deleteWeightEntry);

  // Sorting state: 'desc' (default newest first) or 'asc' (oldest first)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Sort local display copies
  const displayEntries = [...sortedEntries].sort((a, b) => {
    const t1 = new Date(a.measuredAt).getTime();
    const t2 = new Date(b.measuredAt).getTime();
    return sortOrder === 'desc' ? t2 - t1 : t1 - t2;
  });

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const handleDelete = (id: string, weight: number, date: string) => {
    const confirmMessage = `آیا از حذف ثبت وزن ${toPersian(weight)} کیلوگرم در تاریخ ${formatPersianDate(date)} اطمینان دارید؟`;
    if (window.confirm(confirmMessage)) {
      deleteWeightEntry(id);
    }
  };

  if (sortedEntries.length === 0) {
    return null; // GrowthEmptyState handles global empty state
  }

  return (
    <Card
      hoverLift={false}
      className="p-6 md:p-8 border border-coral-light/10 shadow-sm w-full"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-50 mb-6 text-right" dir="rtl">
        <h3 className="font-black text-gray-800 text-lg flex items-center gap-2.5">
          <AnimatedCardIcon variant="document" tone="blue" size="sm" />
          تاریخچه ثبت‌های وزن
        </h3>

        {/* Sort Trigger */}
        <button
          type="button"
          onClick={toggleSortOrder}
          className="flex items-center gap-1.5 text-xs font-black text-gray-500 hover:text-coral transition-colors"
        >
          <ArrowUpDown size={14} />
          مرتب‌سازی: {sortOrder === 'desc' ? 'جدیدترین‌ها اول' : 'قدیمی‌ترین‌ها اول'}
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto" dir="rtl">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400 font-black">
              <th className="py-3 px-4">وزن</th>
              <th className="py-3 px-4">تاریخ اندازه‌گیری</th>
              <th className="py-3 px-4">محل اندازه‌گیری</th>
              <th className="py-3 px-4">یادداشت</th>
              <th className="py-3 px-4 text-left">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {displayEntries.map((e) => (
              <tr 
                key={e.id} 
                className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors text-sm font-bold text-gray-700"
              >
                {/* Weight Column */}
                <td className="py-4 px-4 font-black text-gray-800">
                  {toPersian(e.weightKg.toFixed(1))} <span className="text-xs font-normal text-gray-400">کیلوگرم</span>
                </td>
                
                {/* Date Column */}
                <td className="py-4 px-4 text-xs font-bold text-gray-500">
                  {formatFullPersianDateTime(e.measuredAt)}
                </td>

                {/* Source Column */}
                <td className="py-4 px-4 text-xs font-bold text-gray-500">
                  {getSourceLabel(e.source)}
                </td>

                {/* Note Column (Inline small muted font under row or inside column) */}
                <td className="py-4 px-4 text-xs font-medium text-gray-400 max-w-xs truncate">
                  {e.note || <span className="text-gray-300">-</span>}
                </td>

                {/* Action Buttons */}
                <td className="py-4 px-4 text-left">
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => onEditEntry(e)}
                      className="p-1.5 text-gray-400 hover:text-coral hover:bg-coral/5 rounded-lg transition-all"
                      title="ویرایش ثبت"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(e.id, e.weightKg, e.measuredAt)}
                      className="p-1.5 text-gray-400 hover:text-coral hover:bg-coral/5 rounded-lg transition-all"
                      title="حذف ثبت"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Responsive List View */}
      <div className="block md:hidden space-y-4" dir="rtl text-right">
        {displayEntries.map((e) => (
          <div 
            key={e.id}
            className="p-4 bg-gray-50/50 border border-coral-light/10 rounded-2xl space-y-3"
          >
            {/* Mobile Card Header */}
            <div className="flex justify-between items-center">
              <span className="text-base font-black text-gray-800">
                {toPersian(e.weightKg.toFixed(1))} <span className="text-xs font-normal text-gray-400">کیلوگرم</span>
              </span>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEditEntry(e)}
                  className="p-2 text-gray-500 hover:text-coral bg-white rounded-xl border border-coral-light/10 transition-all"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(e.id, e.weightKg, e.measuredAt)}
                  className="p-2 text-gray-500 hover:text-coral bg-white rounded-xl border border-coral-light/10 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Mobile Card Details Grid */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-right">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                <Calendar size={12} className="text-coral" />
                <span>{formatPersianDate(e.measuredAt)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                <MapPin size={12} className="text-coral" />
                <span>{getSourceLabel(e.source)}</span>
              </div>
            </div>

            {/* Mobile Inline Note */}
            {e.note && (
              <div className="bg-white p-2.5 rounded-xl border border-coral-light/5 text-right flex items-start gap-1.5">
                <FileText size={12} className="text-gray-400 shrink-0 mt-0.5" />
                <span className="text-[11px] text-gray-500 font-medium leading-relaxed">{e.note}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
