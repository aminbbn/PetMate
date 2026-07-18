import React from 'react';
import { Card } from '../../components/Card';
import { useAppStore } from '../../store';
import { selectSortedEntries, selectLatestEntry, selectPreviousEntry, selectWeightGoal } from './growthSelectors';
import { compareWeightEntries, getDaysBetween } from './growthUtils';
import { toPersian, formatPersianDate } from '../../lib/persian';
import { CardCornerIcon } from '../../components/card/CardCornerIcon';
import { ArrowUp, ArrowDown, Minus, Scale, TrendingUp, FileText, Check } from 'lucide-react';

interface WeightOverviewProps {
  onSetGoal: () => void;
}

export const WeightOverview: React.FC<WeightOverviewProps> = ({ onSetGoal }) => {
  const store = useAppStore();
  const sortedEntries = selectSortedEntries(store);
  const latestEntry = selectLatestEntry(store);
  const previousEntry = selectPreviousEntry(store);
  const goal = selectWeightGoal(store);
  const currentPet = store.pets.find(p => p.id === store.selectedPetId) || store.profile;

  // 1. Latest Weight calculation
  const hasEntries = sortedEntries.length > 0;
  const latestWeight = hasEntries 
    ? latestEntry?.weightKg 
    : (currentPet?.weight || 0);

  const latestWeightLabel = hasEntries
    ? `ثبت‌شده در ${formatPersianDate(latestEntry!.measuredAt)}`
    : 'وزن ثبت‌شده در پروفایل';

  // 2. Recent Change calculation
  const changeDetails = hasEntries && previousEntry && latestEntry
    ? compareWeightEntries(latestEntry, previousEntry)
    : null;

  // 3. Number of entries
  const entriesCount = sortedEntries.length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full" dir="rtl">
      
      {/* 1. Latest Weight Card */}
      <Card
        glow
        className="p-6 bg-white border border-pm-stroke-subtle relative"
        contentClassName="relative w-full h-full"
      >
        <CardCornerIcon icon={Scale} animationVariant="weight" tone="warning" size="sm" />
        <div className="pr-14">
          <span className="text-xs font-bold text-gray-400 block mb-1">آخرین وزن</span>
          <span className="text-3xl font-black text-gray-800 block" dir="ltr">
            {toPersian(latestWeight.toFixed(1))} <span className="text-sm font-normal text-gray-400">کیلوگرم</span>
          </span>
          <div className="mt-4 pt-3 border-t border-pm-stroke-subtle/50">
            <span className="text-xs text-gray-400 font-bold block truncate">
              {latestWeightLabel}
            </span>
          </div>
        </div>
      </Card>

      {/* 2. Recent Change Card */}
      <Card
        glow
        className="p-6 bg-white border border-pm-stroke-subtle relative"
        contentClassName="relative w-full h-full"
      >
        <CardCornerIcon icon={TrendingUp} animationVariant="trend" tone="brand" size="sm" />
        <div className="pr-14">
          <span className="text-xs font-bold text-gray-400 block mb-1">تغییر اخیر</span>
          {changeDetails ? (
            <span className="text-xl font-black text-gray-800 flex items-center gap-1">
              {changeDetails.direction === 'increase' && <ArrowUp size={18} className="text-coral" />}
              {changeDetails.direction === 'decrease' && <ArrowDown size={18} className="text-blue-500" />}
              {changeDetails.direction === 'no_change' && <Minus size={18} className="text-gray-400" />}
              <span>{toPersian(changeDetails.diffKg.toFixed(1))} ک‌گ</span>
            </span>
          ) : (
            <span className="text-xs font-black text-gray-400 block pt-1">
              برای مقایسه، ثبت دیگری لازم است.
            </span>
          )}
          <div className="mt-4 pt-3 border-t border-pm-stroke-subtle/50">
            <span className="text-xs text-gray-400 font-bold block truncate">
              {changeDetails 
                ? `${toPersian(changeDetails.days)} روز فاصله نسبت به ثبت قبلی`
                : 'داده کافی برای تغییر وجود ندارد.'}
            </span>
          </div>
        </div>
      </Card>

      {/* 3. Number of Entries Card */}
      <Card
        glow
        className="p-6 bg-white border border-pm-stroke-subtle relative"
        contentClassName="relative w-full h-full"
      >
        <CardCornerIcon icon={FileText} animationVariant="document" tone="info" size="sm" />
        <div className="pr-14">
          <span className="text-xs font-bold text-gray-400 block mb-1">تعداد ثبت‌ها</span>
          <span className="text-3xl font-black text-gray-800 block">
            {toPersian(entriesCount)} <span className="text-sm font-normal text-gray-400">بار</span>
          </span>
          <div className="mt-4 pt-3 border-t border-pm-stroke-subtle/50">
            <span className="text-xs text-gray-400 font-bold block truncate">
              ثبت‌های فعال برای این حیوان خانگی
            </span>
          </div>
        </div>
      </Card>

      {/* 4. Target Weight Card */}
      <Card
        glow
        className="p-6 bg-white border border-pm-stroke-subtle relative cursor-pointer"
        contentClassName="relative w-full h-full"
        onClick={onSetGoal}
      >
        <CardCornerIcon icon={Check} animationVariant="success" tone="success" size="sm" />
        <div className="pr-14">
          <span className="text-xs font-bold text-gray-400 block mb-1">هدف وزن</span>
          {goal ? (
            <span className="text-sm font-black text-gray-800 block truncate" dir="ltr">
              {goal.targetKg ? (
                `هدف: ${toPersian(goal.targetKg.toFixed(1))} ک‌گ`
              ) : (
                `${toPersian(goal.minKg?.toFixed(1))} تا ${toPersian(goal.maxKg?.toFixed(1))} ک‌گ`
              )}
            </span>
          ) : (
            <span className="text-sm font-black text-gray-400 block pt-1">
              هدف وزنی ثبت نشده
            </span>
          )}
          <div className="mt-4 pt-3 border-t border-pm-stroke-subtle/50 flex justify-between items-center">
            <span className="text-[11px] text-gray-400 font-black truncate">
              {goal ? (goal.source === 'veterinarian' ? 'توصیه دامپزشک' : 'برنامه شخصی') : 'افزودن هدف وزنی جدید'}
            </span>
            <span className="text-[10px] text-coral font-bold hover:underline shrink-0">
              {goal ? 'ویرایش' : 'تعیین هدف'}
            </span>
          </div>
        </div>
      </Card>

    </div>
  );
};
