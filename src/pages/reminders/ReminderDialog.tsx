import React from 'react';
import { X, Bell } from 'lucide-react';
import { MotionDialog } from '../../motion/MotionDialog';
import ReminderForm from './ReminderForm';
import { Reminder, ReminderCategory, ReminderRecurrence } from '../../store';

export interface ReminderFormData {
  title: string;
  category: ReminderCategory;
  dueAt: string;
  recurrence: ReminderRecurrence;
  notes: string;
  petId: string;
}

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialReminder?: Reminder | null;
  onSave: (data: ReminderFormData) => void;
}

export default function ReminderDialog({
  open,
  onOpenChange,
  initialReminder,
  onSave,
}: ReminderDialogProps) {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <MotionDialog
      isOpen={open}
      onClose={handleClose}
      size="lg"
      className="max-h-[calc(100dvh-32px)]"
    >
      <div className="flex min-h-0 max-h-[calc(100dvh-32px)] flex-col" dir="rtl">
        {/* Header - fixed */}
        <div className="shrink-0 p-6 pb-4 border-b border-gray-100 flex items-center justify-between text-right relative bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-coral/10 text-coral flex items-center justify-center shrink-0">
              <Bell size={18} />
            </div>
            <div>
              <h3 id="dialog-title" className="font-black text-gray-800 text-base md:text-lg">
                {initialReminder ? 'ویرایش و بروزرسانی یادآور' : 'تعریف برنامه مراقبتی جدید'}
              </h3>
              <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                بازه تکرار، نوع هشدار و دستورالعمل اجرایی را وارد کنید
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
            aria-label="بستن"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body & Form - scrollable internal scrollbar */}
        <ReminderForm
          initialReminder={initialReminder}
          onSave={onSave}
          onCancel={handleClose}
        />
      </div>
    </MotionDialog>
  );
}
