import React from 'react';
import { Card } from '../../components/Card';
import { AnimatedCardIcon } from '../../components/AnimatedCardIcon';
import { toPersian, formatPersianDate } from '../../lib/persian';
import { HealthRecord, FilterState } from './healthTypes';

interface HealthOverviewProps {
  records: HealthRecord[];
  onFilterChange: (filters: Partial<FilterState>) => void;
  filters: FilterState;
}

export const HealthOverview: React.FC<HealthOverviewProps> = ({
  records,
  onFilterChange,
  filters,
}) => {
  // 1. Total records
  const totalCount = records.length;

  // 2. Latest entry
  const sortedByDate = [...records].sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  const latestEntry = sortedByDate[0];

  // 3. Next follow-up
  const now = new Date();
  const upcomingFollowUps = records
    .filter(r => r.followUpAt && new Date(r.followUpAt) >= now)
    .sort((a, b) => new Date(a.followUpAt!).getTime() - new Date(b.followUpAt!).getTime());
  const nextFollowUp = upcomingFollowUps[0];

  // 4. Files & Images count
  const fileCount = records.reduce((sum, r) => sum + (r.attachments?.length || 0), 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* 1. کل سوابق */}
      <Card
        glow={filters.kind === 'all' && !filters.onlyHasFiles}
        glowColor="coral"
        hoverLift={true}
        cursorGlow={true}
        edgeGlow={true}
        onClick={() => onFilterChange({ kind: 'all', onlyHasFiles: false, search: '' })}
        className="cursor-pointer bg-white p-4 flex flex-col justify-between min-h-[110px] select-none transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400">کل سوابق</span>
          <AnimatedCardIcon variant="document" tone="coral" size="sm" />
        </div>
        <div className="mt-2 text-right">
          <span className="text-2xl font-black text-gray-800 leading-none">
            {toPersian(totalCount)}
          </span>
          <span className="text-xs text-gray-400 font-bold mr-1">مورد</span>
        </div>
      </Card>

      {/* 2. آخرین ثبت */}
      <Card
        glowColor="blue"
        hoverLift={true}
        cursorGlow={true}
        edgeGlow={true}
        onClick={() => onFilterChange({ kind: 'all', onlyHasFiles: false, search: '' })}
        className="cursor-pointer bg-white p-4 flex flex-col justify-between min-h-[110px] select-none transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400">آخرین ثبت</span>
          <AnimatedCardIcon variant="calendar" tone="blue" size="sm" />
        </div>
        <div className="mt-2 text-right truncate">
          {latestEntry ? (
            <div className="space-y-0.5">
              <div className="text-xs font-black text-gray-800 truncate">{latestEntry.title}</div>
              <div className="text-[10px] text-blue-500 font-medium">{formatPersianDate(latestEntry.occurredAt)}</div>
            </div>
          ) : (
            <span className="text-sm font-bold text-gray-400">ثبت نشده</span>
          )}
        </div>
      </Card>

      {/* 3. پیگیری پیش رو */}
      <Card
        glow={!!nextFollowUp}
        glowColor="sunny"
        hoverLift={true}
        cursorGlow={true}
        edgeGlow={true}
        onClick={() => {
          if (nextFollowUp) {
            onFilterChange({ search: nextFollowUp.title });
          }
        }}
        className="cursor-pointer bg-white p-4 flex flex-col justify-between min-h-[110px] select-none transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400">پیگیری پیش رو</span>
          <AnimatedCardIcon variant="clock" tone="sunny" size="sm" />
        </div>
        <div className="mt-2 text-right truncate">
          {nextFollowUp && nextFollowUp.followUpAt ? (
            <div className="space-y-0.5">
              <div className="text-xs font-black text-gray-800 truncate">{nextFollowUp.title}</div>
              <div className="text-[10px] text-sunny-deep font-bold">{formatPersianDate(nextFollowUp.followUpAt)}</div>
            </div>
          ) : (
            <span className="text-sm font-bold text-gray-400">ثبت نشده</span>
          )}
        </div>
      </Card>

      {/* 4. فایل‌ها و تصاویر */}
      <Card
        glow={filters.onlyHasFiles}
        glowColor="mint"
        hoverLift={true}
        cursorGlow={true}
        edgeGlow={true}
        onClick={() => onFilterChange({ onlyHasFiles: !filters.onlyHasFiles })}
        className="cursor-pointer bg-white p-4 flex flex-col justify-between min-h-[110px] select-none transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400">فایل‌ها و تصاویر</span>
          <AnimatedCardIcon variant="document" tone="mint" size="sm" />
        </div>
        <div className="mt-2 text-right">
          <span className="text-2xl font-black text-gray-800 leading-none">
            {toPersian(fileCount)}
          </span>
          <span className="text-xs text-gray-400 font-bold mr-1">فایل مدرک</span>
        </div>
      </Card>
    </div>
  );
};
