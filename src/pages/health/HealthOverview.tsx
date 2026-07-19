import React from 'react';
import { MetricCard, MetricCardGrid } from '../../components/metric-card';
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

  const isTotalActive = filters.kind === 'all' && !filters.onlyHasFiles;

  return (
    <MetricCardGrid density="standard" className="w-full">
      {/* 1. کل سوابق */}
      <MetricCard
        title="کل سوابق"
        value={toPersian(totalCount)}
        valueKind="number"
        unit="مورد"
        icon={FileText}
        iconVariant="document"
        iconTone="coral"
        interactive={true}
        selected={isTotalActive}
        onClick={() => onFilterChange({ kind: 'all', onlyHasFiles: false, search: '' })}
      />

      {/* 2. آخرین ثبت */}
      <MetricCard
        title="آخرین ثبت"
        value={latestEntry ? latestEntry.title : "ثبت نشده"}
        valueKind={latestEntry ? "text" : "empty"}
        supportingText={latestEntry ? formatPersianDate(latestEntry.occurredAt) : undefined}
        state="default"
        icon={Calendar}
        iconVariant="calendar"
        iconTone="blue"
        interactive={true}
        onClick={() => onFilterChange({ kind: 'all', onlyHasFiles: false, search: '' })}
      />

      {/* 3. پیگیری پیش رو */}
      <MetricCard
        title="پیگیری پیش رو"
        value={nextFollowUp ? nextFollowUp.title : "ثبت نشده"}
        valueKind={nextFollowUp ? "text" : "empty"}
        supportingText={nextFollowUp && nextFollowUp.followUpAt ? formatPersianDate(nextFollowUp.followUpAt) : undefined}
        state="default"
        icon={Clock}
        iconVariant="clock"
        iconTone="sunny"
        interactive={true}
        selected={!!nextFollowUp}
        onClick={() => {
          if (nextFollowUp) {
            onFilterChange({ search: nextFollowUp.title });
          }
        }}
      />

      {/* 4. فایل‌ها و تصاویر */}
      <MetricCard
        title="فایل‌ها و تصاویر"
        value={toPersian(fileCount)}
        valueKind="number"
        unit="فایل مدرک"
        icon={FileText}
        iconVariant="document"
        iconTone="mint"
        interactive={true}
        selected={filters.onlyHasFiles}
        onClick={() => onFilterChange({ onlyHasFiles: !filters.onlyHasFiles })}
      />
    </MetricCardGrid>
  );
};
