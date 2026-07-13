import React, { useState } from 'react';
import { MotionDialog } from '../../motion';
import { HealthRecord, HealthAttachment, HealthRecordKind } from './healthTypes';
import { HealthRecordForm } from './HealthRecordForm';
import { Plus, Upload, FileText, ChevronRight, Check } from 'lucide-react';
import { HealthAttachmentField } from './HealthAttachmentField';

interface HealthRecordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: {
    kind: HealthRecordKind;
    occurredAt: string;
    title: string;
    notes?: string;
    veterinarian?: string;
    clinic?: string;
    followUpAt?: string;
    attachments: HealthAttachment[];
  }) => void;
  initialRecord?: HealthRecord; // Present for editing
}

export const HealthRecordDialog: React.FC<HealthRecordDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialRecord,
}) => {
  const isEditing = !!initialRecord;
  const [view, setView] = useState<'selection' | 'form_manual' | 'form_upload'>('selection');
  const [initialAttachments, setInitialAttachments] = useState<HealthAttachment[]>([]);

  // Reset state when opened or closed
  React.useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setView('form_manual');
      } else {
        setView('selection');
        setInitialAttachments([]);
      }
    }

    const handleCustomPath = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === 'manual') {
        setView('form_manual');
      } else if (detail === 'upload') {
        setView('form_upload');
      }
    };

    window.addEventListener('petmate-dialog-path', handleCustomPath);
    return () => {
      window.removeEventListener('petmate-dialog-path', handleCustomPath);
    };
  }, [isOpen, isEditing]);

  const handleSelection = (path: 'manual' | 'upload') => {
    if (path === 'manual') {
      setView('form_manual');
    } else {
      setView('form_upload');
    }
  };

  const handleAttachmentsChange = (atts: HealthAttachment[]) => {
    setInitialAttachments(atts);
    // When a file is successfully attached in the selection/upload view, 
    // transition directly to the form with the files attached so they can complete the record title & date!
    if (atts.length > 0) {
      setTimeout(() => {
        setView('form_manual');
      }, 500);
    }
  };

  return (
    <MotionDialog
      isOpen={isOpen}
      onClose={onClose}
      size={view === 'selection' ? 'sm' : 'md'}
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-3 border-b border-gray-50 flex items-center justify-between bg-gray-50/50 shrink-0">
        <h3 className="text-base font-black text-gray-800">
          {isEditing ? 'ویرایش سابقه سلامت' : 'افزودن سابقه سلامت جدید'}
        </h3>
        
        {view !== 'selection' && !isEditing && (
          <button
            onClick={() => setView('selection')}
            className="flex items-center gap-1 text-[11px] font-black text-coral hover:text-coral-deep cursor-pointer"
          >
            <ChevronRight size={13} />
            <span>بازگشت به انتخاب</span>
          </button>
        )}
      </div>

      {/* Content Body */}
      <div className="p-6">
        {view === 'selection' && (
          <div className="space-y-6">
            <p className="text-xs text-gray-400 font-bold text-center leading-normal">
              لطفاً روش ثبت اطلاعات سابقه درمانی حیوان را انتخاب کنید:
            </p>

            <div className="grid grid-cols-1 gap-3">
              {/* Manual Entry Path Card */}
              <button
                onClick={() => handleSelection('manual')}
                className="flex items-center gap-4 p-4 text-right bg-white hover:bg-coral/5 border border-gray-100 hover:border-coral-light/30 rounded-2xl transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-coral/10 text-coral flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Plus size={20} />
                </div>
                <div className="space-y-0.5">
                  <span className="block text-sm font-black text-gray-800">ثبت دستی اطلاعات سابقه</span>
                  <span className="block text-xs text-gray-400 font-medium">وارد کردن ویزیت، تاریخ، پزشک و یادداشت‌ها</span>
                </div>
              </button>

              {/* Upload Path Card */}
              <button
                onClick={() => handleSelection('upload')}
                className="flex items-center gap-4 p-4 text-right bg-white hover:bg-mint/5 border border-gray-100 hover:border-mint-light/30 rounded-2xl transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-mint/10 text-mint flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Upload size={18} />
                </div>
                <div className="space-y-0.5">
                  <span className="block text-sm font-black text-gray-800">آپلود سریع فایل مدرک</span>
                  <span className="block text-xs text-gray-400 font-medium">آپلود مستقیم نسخه، برگه آزمایش یا گواهی سلامت</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {view === 'form_upload' && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h4 className="text-sm font-black text-gray-800">آپلود مدرک سابقه پزشکی</h4>
              <p className="text-xs text-gray-400 font-medium">پس از آپلود موفق، فرم سابقه برای ویرایش جزئیات نهایی باز خواهد شد.</p>
            </div>
            
            <HealthAttachmentField
              attachments={initialAttachments}
              onChange={handleAttachmentsChange}
            />
          </div>
        )}

        {view === 'form_manual' && (
          <HealthRecordForm
            initialValues={isEditing ? initialRecord : { attachments: initialAttachments }}
            onSubmit={(values) => {
              onSubmit(values);
              onClose();
            }}
            onCancel={onClose}
          />
        )}
      </div>
    </MotionDialog>
  );
};
