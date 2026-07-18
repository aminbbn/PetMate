import React from 'react';
import { Card } from '../../components/Card';
import { CardCornerIcon } from '../../components/card/CardCornerIcon';
import { toPersian, formatPersianDate } from '../../lib/persian';
import { HealthRecord, FilterState } from './healthTypes';
import { FileText, Calendar, Clock } from 'lucide-react';

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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full" dir="rtl">
      {/* 1. کل سوابق */}
      <Card
        glow={filters.kind === 'all' && !filters.onlyHasFiles}
        hoverLift={true}
        cursorGlow={true}
        edgeGlow={true}
        onClick={() => onFilterChange({ kind: 'all', onlyHasFiles: false, search: '' })}
        className="cursor-pointer bg-white p-4 relative min-h-[110px] select-none transition-all duration-300 border border-pm-stroke-subtle"
        contentClassName="relative w-full h-full"
      >
        <CardCornerIcon icon={FileText} animationVariant="document" tone="brand" size="sm" />
        <div className="pr-14 flex flex-col justify-between h-full min-h-[70px]">
          <span className="text-xs font-bold text-gray-400 block mb-1">کل سوابق</span>
          <div className="mt-auto">
            <span className="text-2xl font-black text-gray-800 leading-none">
              {toPersian(totalCount)}
            </span>
            <span className="text-xs text-gray-400 font-bold mr-1">مورد</span>
          </div>
        </div>
      </Card>

      {/* 2. آخرین ثبت */}
      <Card
        hoverLift={true}
        cursorGlow={true}
        edgeGlow={true}
        onClick={() => onFilterChange({ kind: 'all', onlyHasFiles: false, search: '' })}
        className="cursor-pointer bg-white p-4 relative min-h-[110px] select-none transition-all duration-300 border border-pm-stroke-subtle"
        contentClassName="relative w-full h-full"
      >
        <CardCornerIcon icon={Calendar} animationVariant="calendar" tone="info" size="sm" />
        <div className="pr-14 flex flex-col justify-between h-full min-h-[70px]">
          <span className="text-xs font-bold text-gray-400 block mb-1">آخرین ثبت</span>
          <div className="mt-auto truncate">
            {latestEntry ? (
              <div className="space-y-0.5">
                <div className="text-xs font-black text-gray-800 truncate">{latestEntry.title}</div>
                <div className="text-[10px] text-blue-500 font-medium">{formatPersianDate(latestEntry.occurredAt)}</div>
              </div>
            ) : (
              <span className="text-sm font-bold text-gray-400">ثبت نشده</span>
            )}
          </div>
        </div>
      </Card>

      {/* 3. پیگیری پیش رو */}
      <Card
        glow={!!nextFollowUp}
        hoverLift={true}
        cursorGlow={true}
        edgeGlow={true}
        onClick={() => {
          if (nextFollowUp) {
            onFilterChange({ search: nextFollowUp.title });
          }
        }}
        className="cursor-pointer bg-white p-4 relative min-h-[110px] select-none transition-all duration-300 border border-pm-stroke-subtle"
        contentClassName="relative w-full h-full"
      >
        <CardCornerIcon icon={Clock} animationVariant="clock" tone="warning" size="sm" />
        <div className="pr-14 flex flex-col justify-between h-full min-h-[70px]">
          <span className="text-xs font-bold text-gray-400 block mb-1">پیگیری پیش رو</span>
          <div className="mt-auto truncate">
            {nextFollowUp && nextFollowUp.followUpAt ? (
              <div className="space-y-0.5">
                <div className="text-xs font-black text-gray-800 truncate">{nextFollowUp.title}</div>
                <div className="text-[10px] text-sunny-deep font-bold">{formatPersianDate(nextFollowUp.followUpAt)}</div>
              </div>
            ) : (
              <span className="text-sm font-bold text-gray-400">ثبت نشده</span>
            )}
          </div>
        </div>
      </Card>

      {/* 4. فایل‌ها و تصاویر */}
      <Card
        glow={filters.onlyHasFiles}
        hoverLift={true}
        cursorGlow={true}
        edgeGlow={true}
        onClick={() => onFilterChange({ onlyHasFiles: !filters.onlyHasFiles })}
        className="cursor-pointer bg-white p-4 relative min-h-[110px] select-none transition-all duration-300 border border-pm-stroke-subtle"
        contentClassName="relative w-full h-full"
      >
        <CardCornerIcon icon={FileText} animationVariant="document" tone="success" size="sm" />
        <div className="pr-14 flex flex-col justify-between h-full min-h-[70px]">
          <span className="text-xs font-bold text-gray-400 block mb-1">فایل‌ها و تصاویر</span>
          <div className="mt-auto">
            <span className="text-2xl font-black text-gray-800 leading-none">
              {toPersian(fileCount)}
            </span>
            <span className="text-xs text-gray-400 font-bold mr-1">فایل مدرک</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
