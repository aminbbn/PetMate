import React from 'react';
import { MetricCard } from '../../components/metric/MetricCard';
import { MetricCardGrid } from '../../components/metric/MetricCardGrid';
import { useAppStore } from '../../store';
import { selectSortedEntries, selectLatestEntry, selectPreviousEntry, selectWeightGoal } from './growthSelectors';
import { compareWeightEntries } from './growthUtils';
import { toPersian, formatPersianDate } from '../../lib/persian';
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
    <MetricCardGrid density="standard" className="w-full">
      {/* 1. آخرین وزن */}
      <MetricCard
        title="آخرین وزن"
        value={toPersian(latestWeight.toFixed(1))}
        unit="کیلوگرم"
        footer={latestWeightLabel}
        icon={Scale}
        iconVariant="weight"
        iconTone="warning"
      />

      {/* 2. تغییر اخیر */}
      <MetricCard
        title="تغییر اخیر"
        value={
          changeDetails ? (
            <span className="flex items-center gap-1.5 leading-none" dir="rtl">
              <span>{toPersian(changeDetails.diffKg.toFixed(1))} ک‌گ</span>
              {changeDetails.direction === 'increase' && <ArrowUp size={16} className="text-coral shrink-0 animate-pulse" />}
              {changeDetails.direction === 'decrease' && <ArrowDown size={16} className="text-blue-500 shrink-0" />}
              {changeDetails.direction === 'no_change' && <Minus size={16} className="text-gray-400 shrink-0" />}
            </span>
          ) : (
            "ثبت دیگری لازم است"
          )
        }
        state={changeDetails ? "default" : "empty"}
        footer={
          changeDetails 
            ? `${toPersian(changeDetails.days)} روز فاصله نسبت به ثبت قبلی`
            : "داده کافی برای تغییر وجود ندارد."
        }
        icon={TrendingUp}
        iconVariant="trend"
        iconTone="brand"
      />

      {/* 3. تعداد ثبت‌ها */}
      <MetricCard
        title="تعداد ثبت‌ها"
        value={toPersian(entriesCount)}
        unit="بار"
        footer="ثبت‌های فعال برای این حیوان خانگی"
        icon={FileText}
        iconVariant="document"
        iconTone="info"
      />

      {/* 4. هدف وزن */}
      <MetricCard
        title="هدف وزن"
        value={
          goal ? (
            goal.targetKg ? (
              `هدف: ${toPersian(goal.targetKg.toFixed(1))} ک‌گ`
            ) : (
              `${toPersian(goal.minKg?.toFixed(1))} تا ${toPersian(goal.maxKg?.toFixed(1))} ک‌گ`
            )
          ) : (
            "هدف وزنی ثبت نشده"
          )
        }
        state={goal ? "default" : "empty"}
        footer={
          <span className="flex items-center justify-between w-full font-bold">
            <span>
              {goal ? (goal.source === 'veterinarian' ? 'توصیه دامپزشک' : 'برنامه شخصی') : 'برنامه جدید'}
            </span>
            <span className="text-coral hover:underline font-extrabold shrink-0 mr-1">
              {goal ? 'ویرایش' : 'تعیین هدف'}
            </span>
          </span>
        }
        icon={Check}
        iconVariant="success"
        iconTone="success"
        interactive={true}
        onClick={onSetGoal}
      />
    </MetricCardGrid>
  );
};
