import React from 'react';
import { HealthRecord, FilterState } from './healthTypes';
import { HealthTimelineItem } from './HealthTimelineItem';
import { getYearMonthKey } from './healthUtils';
import { MotionListContainer, MotionListItem } from '../../motion';
import { Calendar, HelpCircle } from 'lucide-react';

interface HealthTimelineProps {
  records: HealthRecord[];
  filters: FilterState;
  onEdit: (record: HealthRecord) => void;
  onDelete: (id: string) => void;
}

export const HealthTimeline: React.FC<HealthTimelineProps> = ({
  records,
  filters,
  onEdit,
  onDelete,
}) => {
  if (records.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-[24px] border border-slate-100 flex flex-col items-center justify-center space-y-3">
        <HelpCircle size={32} className="text-gray-300 animate-pulse" />
        <h4 className="text-sm font-bold text-gray-700">موردی یافت نشد</h4>
        <p className="text-xs text-gray-400 max-w-xs leading-normal">
          هیچ سابقه سلامت با معیارهای فیلتر فعلی همخوانی ندارد. عبارات دیگر را جست‌وجو کنید یا فیلترها را بازنشانی نمایید.
        </p>
      </div>
    );
  }

  // Pre-calculate groupings statically before rendering to guarantee stable layout and fluid animations
  const grouped: { [key: string]: { year: string; monthName: string; order: number; items: HealthRecord[] } } = {};

  records.forEach(r => {
    const { year, monthName, order } = getYearMonthKey(r.occurredAt);
    const groupKey = `${year}-${monthName}`;

    if (!grouped[groupKey]) {
      grouped[groupKey] = {
        year,
        monthName,
        order,
        items: [],
      };
    }
    grouped[groupKey].items.push(r);
  });

  const sortedGroups = Object.values(grouped).sort((a, b) => {
    return filters.sortBy === 'newest' ? b.order - a.order : a.order - b.order;
  });

  // Sort items inside each group
  sortedGroups.forEach(group => {
    group.items.sort((a, b) => {
      const timeA = new Date(a.occurredAt).getTime();
      const timeB = new Date(b.occurredAt).getTime();
      return filters.sortBy === 'newest' ? timeB - timeA : timeA - timeB;
    });
  });

  return (
    <div className="relative space-y-8 pr-1">
      {/* Dynamic Vertical connecting line */}
      <div className="absolute right-3 top-4 bottom-4 w-[2px] bg-gradient-to-b from-coral-light/20 via-blue-200/25 to-transparent pointer-events-none" />

      {sortedGroups.map(group => (
        <div key={`${group.year}-${group.monthName}`} className="space-y-4 relative">
          {/* Timeline Node Heading */}
          <div className="flex items-center gap-2 right-0 relative z-10">
            {/* Timeline Node Circle */}
            <div className="w-[26px] h-[26px] rounded-full bg-coral/10 border-4 border-white shadow-sm text-coral flex items-center justify-center shrink-0">
              <Calendar size={11} className="stroke-[2.5]" />
            </div>
            
            {/* Group date text */}
            <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5 select-none">
              <span>{group.monthName}</span>
              <span className="text-gray-400 text-xs font-bold">{group.year}</span>
            </h3>
          </div>

          {/* Timeline Items under this month group */}
          <MotionListContainer className="space-y-3 mr-6">
            {group.items.map(record => (
              <MotionListItem key={record.id} id={record.id}>
                <HealthTimelineItem
                  record={record}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </MotionListItem>
            ))}
          </MotionListContainer>
        </div>
      ))}
    </div>
  );
};
