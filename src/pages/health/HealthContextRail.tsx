import React from 'react';
import { Card } from '../../components/Card';
import { HealthRecord, HealthRecordKind } from './healthTypes';
import { getKindLabel, getKindIconVariant, getKindTone } from './healthUtils';
import { AnimatedCardIcon } from '../../components/AnimatedCardIcon';
import { Plus, Calendar, Clock, ArrowLeft, ArrowRight, Activity } from 'lucide-react';
import { formatPersianDate } from '../../lib/persian';

interface HealthContextRailProps {
  upcomingRecords: HealthRecord[];
  onQuickAdd: (kind: HealthRecordKind) => void;
  onSelectRecord: (record: HealthRecord) => void;
}

export const HealthContextRail: React.FC<HealthContextRailProps> = ({
  upcomingRecords,
  onQuickAdd,
  onSelectRecord,
}) => {
  const quickActions: { kind: HealthRecordKind; label: string; tone: 'coral' | 'sunny' | 'blue' | 'neutral' }[] = [
    { kind: 'visit', label: 'ویزیت و معاینه جدید', tone: 'coral' },
    { kind: 'vaccination', label: 'ثبت تزریق واکسن', tone: 'coral' },
    { kind: 'lab_test', label: 'ثبت جواب آزمایش', tone: 'blue' },
    { kind: 'note', label: 'یادداشت جدید سلامت', tone: 'neutral' },
  ];

  return (
    <div className="space-y-6 lg:sticky lg:top-6">
      {/* 1. Quick Add Widget Card */}
      <div className="bg-white border border-coral-light/10 rounded-[24px] p-5 shadow-sm space-y-4">
        <h4 className="text-sm font-black text-gray-800 flex items-center gap-2">
          <Activity size={16} className="text-coral" />
          <span>میانبرهای ثبت سریع</span>
        </h4>

        <div className="grid grid-cols-1 gap-2">
          {quickActions.map(action => (
            <button
              key={action.kind}
              onClick={() => onQuickAdd(action.kind)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-coral/5 border border-transparent hover:border-coral-light/25 transition-all text-right group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <AnimatedCardIcon 
                  variant={getKindIconVariant(action.kind)} 
                  tone={getKindTone(action.kind)} 
                  size="sm" 
                />
                <span className="text-xs font-black text-gray-700 truncate">{action.label}</span>
              </div>
              <Plus size={14} className="text-gray-400 group-hover:text-coral group-hover:scale-110 transition-all ml-1 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* 2. Upcoming Follow-ups Panel */}
      <div className="bg-white border border-coral-light/10 rounded-[24px] p-5 shadow-sm space-y-4">
        <h4 className="text-sm font-black text-gray-800 flex items-center gap-2">
          <Clock size={16} className="text-sunny-deep" />
          <span>پیگیری‌های پزشکی آتی</span>
        </h4>

        {upcomingRecords.length === 0 ? (
          <div className="text-center py-6 bg-gray-50/50 border border-dashed border-gray-100 rounded-xl">
            <Calendar size={18} className="text-gray-300 mb-1.5 mx-auto" />
            <p className="text-[10px] text-gray-400 font-bold">مورد پیگیری پیش رو وجود ندارد.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {upcomingRecords.slice(0, 3).map(rec => (
              <div
                key={rec.id}
                onClick={() => onSelectRecord(rec)}
                className="p-3 bg-gray-50 hover:bg-white border border-gray-50 hover:border-sunny-light/40 rounded-xl text-right cursor-pointer group transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-gray-700 truncate max-w-[130px]">
                    {rec.title}
                  </span>
                  <span className="text-[9px] font-black text-sunny-deep bg-sunny/5 px-2 py-0.5 rounded-full shrink-0">
                    {formatPersianDate(rec.followUpAt!)}
                  </span>
                </div>
                {rec.clinic && (
                  <p className="text-[10px] text-gray-400 mt-1 font-bold flex items-center gap-0.5">
                    <span>🏥 {rec.clinic}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
