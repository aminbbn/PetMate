import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HealthRecord, HealthAttachment } from './healthTypes';
import { getKindLabel, getKindIconVariant, getKindTone, formatBytes } from './healthUtils';
import { AnimatedCardIcon } from '../../components/AnimatedCardIcon';
import { formatPersianDate } from '../../lib/persian';
import { ChevronDown, ChevronUp, MapPin, User, FileText, Calendar, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../components/Button';

interface HealthTimelineItemProps {
  record: HealthRecord;
  onEdit: (record: HealthRecord) => void;
  onDelete: (id: string) => void;
}

export const HealthTimelineItem: React.FC<HealthTimelineItemProps> = ({
  record,
  onEdit,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const tone = getKindTone(record.kind);
  const iconVariant = getKindIconVariant(record.kind);

  // Border/Accent styling colors
  const toneClasses = {
    coral: 'border-r-4 border-r-coral hover:bg-coral/[0.01]',
    sunny: 'border-r-4 border-r-sunny hover:bg-sunny/[0.01]',
    mint: 'border-r-4 border-r-mint hover:bg-mint/[0.01]',
    blue: 'border-r-4 border-r-blue hover:bg-blue/[0.01]',
    neutral: 'border-r-4 border-r-slate-300 hover:bg-slate-50/[0.01]',
  };

  const badgeClasses = {
    coral: 'bg-coral/10 text-coral',
    sunny: 'bg-sunny/10 text-sunny-deep',
    mint: 'bg-mint/10 text-mint-deep',
    blue: 'bg-blue/10 text-blue-600',
    neutral: 'bg-gray-100 text-gray-600',
  };

  const handleDownload = (e: React.MouseEvent, att: HealthAttachment) => {
    e.stopPropagation();
    // In real app, download file from URL. Since it's a simulated adapter,
    // we alert gracefully or download a small mock text file representing the attachment!
    const blob = new Blob([`Pet Mate Document Sandbox Backup:\nName: ${att.name}\nType: ${att.mimeType}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = att.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className={`bg-white border border-slate-100 rounded-2xl shadow-sm transition-all duration-300 overflow-hidden ${
        toneClasses[tone]
      } ${isExpanded ? 'shadow-md border-slate-200/50' : 'hover:border-slate-200'}`}
    >
      {/* Header (Always Visible, clickable to expand) */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Animated Card Icon on hover */}
          <div className="shrink-0">
            <AnimatedCardIcon variant={iconVariant} tone={tone} size="sm" />
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-black text-gray-800 truncate">{record.title}</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black shrink-0 ${badgeClasses[tone]}`}>
                {getKindLabel(record.kind)}
              </span>
            </div>
            
            {/* Short subtitle details (Doctor or Clinic) */}
            <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold">
              <span>{formatPersianDate(record.occurredAt)}</span>
              {record.clinic && (
                <span className="flex items-center gap-0.5">
                  <MapPin size={10} />
                  <span className="truncate max-w-[100px]">{record.clinic}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Expand toggle */}
        <div className="text-gray-400 shrink-0 p-1">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* Expanded Details Body */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
          >
            <div className="px-4 pb-4 pt-1 border-t border-dashed border-gray-100 space-y-4 text-right">
              {/* Note / notes text */}
              {record.notes && (
                <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-50">
                  <span className="block text-[10px] font-black text-gray-400 mb-1">توضیحات و توصیه‌ها</span>
                  <p className="text-xs font-medium text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {record.notes}
                  </p>
                </div>
              )}

              {/* Sub-details (Vet and Follow-up) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
                {record.veterinarian && (
                  <div className="flex items-center gap-2 bg-slate-50/30 px-3 py-2 rounded-xl">
                    <User size={14} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-400 ml-1">پزشک معالج:</span>
                    <span className="font-bold text-gray-700">{record.veterinarian}</span>
                  </div>
                )}
                
                {record.followUpAt && (
                  <div className="flex items-center gap-2 bg-sunny/5 px-3 py-2 rounded-xl border border-sunny/10">
                    <Calendar size={14} className="text-sunny-deep" />
                    <span className="text-[10px] font-black text-sunny-deep ml-1">پیگیری بعدی:</span>
                    <span className="font-black text-gray-800">{formatPersianDate(record.followUpAt)}</span>
                  </div>
                )}
              </div>

              {/* Document/File attachments list */}
              {record.attachments && record.attachments.length > 0 && (
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-black text-gray-400 mr-1">مدارک و ضمائم پیوست‌شده</span>
                  <div className="flex flex-wrap gap-2">
                    {record.attachments.map(att => (
                      <button
                        key={att.id}
                        onClick={(e) => handleDownload(e, att)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-coral/5 border border-gray-100 hover:border-coral-light/20 rounded-xl cursor-pointer text-right group transition-all"
                        title="دانلود سند"
                      >
                        <FileText size={13} className="text-gray-400 group-hover:text-coral transition-colors shrink-0" />
                        <span className="text-xs font-bold text-gray-700 truncate max-w-[150px]">{att.name}</span>
                        <span className="text-[9px] text-gray-400 font-medium">({formatBytes(att.sizeBytes)})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Edit / Delete actions - Muted rose/burgundy for deletion */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(record);
                  }}
                  className="py-1.5 px-3 text-[10px] font-black h-auto rounded-lg flex items-center gap-1"
                >
                  <Edit2 size={11} />
                  <span>ویرایش پرونده</span>
                </Button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('آیا از حذف این پرونده پزشکی اطمینان دارید؟ این عمل غیرقابل بازگشت است.')) {
                      onDelete(record.id);
                    }
                  }}
                  className="py-1.5 px-3 text-[10px] font-black h-auto rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-100 hover:border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={11} />
                  <span>حذف پرونده</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
