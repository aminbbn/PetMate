import React, { useState } from 'react';
import { useAppStore, HealthRecord as HealthRecordType } from '../store';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Plus, X, FileText, Calendar, ShieldAlert, FileHeart, Stethoscope, Clock, Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPersian, formatPersianDate } from '../lib/persian';

interface TimelineItemProps {
  record: HealthRecordType;
  index: number;
  onUpdate: (id: string, updates: { reason: string; notes: string; date: string }) => void;
  onDelete: (id: string) => void;
}

function TimelineItem({ record, index, onUpdate, onDelete }: TimelineItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [editForm, setEditForm] = useState({
    date: record.date,
    reason: record.reason,
    notes: record.notes,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.reason.trim()) return;
    onUpdate(record.id, editForm);
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="relative"
    >
      {/* Glowing Timeline Dot */}
      <div className="absolute -right-[41px] top-[25px] w-5 h-5 bg-coral rounded-full shadow-md ring-4 ring-peach flex items-center justify-center z-10">
        <div className="w-2 h-2 bg-white rounded-full" />
      </div>

      <Card className="bg-white border border-coral-light/10 shadow-sm p-6 hover:shadow-md transition-all duration-300 overflow-hidden">
        <AnimatePresence mode="wait">
          {isConfirmingDelete ? (
            <motion.div
              key="delete-confirm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 py-1"
            >
              <div className="flex items-start gap-3 text-red-500">
                <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <Trash2 size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-base">حذف پرونده پزشکی</h4>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                    آیا مطمئن هستید که می‌خواهید این پرونده را حذف کنید؟ این سابقه برای همیشه از خط زمانی حذف خواهد شد.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="px-4 py-2 bg-gray-50 border border-gray-200/60 text-gray-600 hover:bg-gray-100 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(record.id)}
                  className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 text-xs font-bold rounded-xl transition-all shadow-sm shadow-red-200 cursor-pointer"
                >
                  بله، حذف شود
                </button>
              </div>
            </motion.div>
          ) : isEditing ? (
            <motion.form
              key="edit-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSave}
              className="space-y-4 py-1"
            >
              <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                <span className="font-black text-gray-800 text-base">ویرایش پرونده پزشکی</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-gray-500">تاریخ مراجعه</label>
                  <input 
                    type="date" 
                    value={editForm.date}
                    onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200/60 rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:border-coral/50 focus:ring-4 focus:ring-coral/10 transition-all duration-200 font-medium text-gray-700 text-sm"
                    dir="ltr"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-gray-500">علت مراجعه</label>
                  <input 
                    type="text" 
                    placeholder="علت مراجعه را وارد کنید"
                    value={editForm.reason}
                    onChange={e => setEditForm({ ...editForm, reason: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200/60 rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:border-coral/50 focus:ring-4 focus:ring-coral/10 transition-all duration-200 text-sm text-gray-800 font-medium placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-gray-500">توضیحات و نسخه‌های دارویی</label>
                <textarea 
                  placeholder="جزئیات درمان، داروها و توصیه‌های پزشک..."
                  value={editForm.notes}
                  onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200/60 rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:border-coral/50 focus:ring-4 focus:ring-coral/10 transition-all duration-200 text-sm h-24 resize-none text-gray-800 font-medium placeholder:text-gray-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({
                      date: record.date,
                      reason: record.reason,
                      notes: record.notes,
                    });
                  }}
                  className="px-4 py-2 bg-gray-50 border border-gray-200/60 text-gray-600 hover:bg-gray-100 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={!editForm.reason.trim()}
                  className="px-5 py-2 bg-coral hover:bg-coral-deep text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-coral/20 cursor-pointer disabled:opacity-50"
                >
                  ذخیره تغییرات
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="view-mode"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between gap-4 mb-4 pb-2 border-b border-gray-50">
                <div className="flex items-center gap-2 text-xs font-black text-coral bg-coral/5 px-3 py-1 rounded-full">
                  <Calendar size={14} />
                  <span>{formatPersianDate(record.date)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 text-gray-400 hover:text-coral hover:bg-coral/5 rounded-lg transition-colors cursor-pointer"
                    title="ویرایش"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(true)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 size={15} />
                  </button>
                  
                  <div className="h-4 w-[1px] bg-gray-100 mx-1" />

                  <div className="flex items-center gap-1 text-[11px] text-gray-400 font-bold">
                    <Clock size={13} />
                    <span>ثبت شده</span>
                  </div>
                </div>
              </div>
              
              <h4 className="font-black text-gray-800 text-xl mb-3">{record.reason}</h4>
              
              {record.notes ? (
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap mt-3">{record.notes}</p>
              ) : (
                <p className="text-gray-400 text-xs italic mt-3">بدون یادداشت تکمیلی.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export default function HealthRecord() {
  const records = useAppStore(state => state.healthRecords);
  const addRecord = useAppStore(state => state.addHealthRecord);
  const updateRecord = useAppStore(state => state.updateHealthRecord);
  const deleteRecord = useAppStore(state => state.deleteHealthRecord);
  const profile = useAppStore(state => state.profile);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    reason: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reason) return;
    
    addRecord(formData.reason, formData.notes, formData.date);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      reason: '',
      notes: '',
    });
  };

  return (
    <div className="p-10 lg:p-12 space-y-10 max-w-7xl mx-auto w-full" dir="rtl">
      
      {/* Page Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-coral-light/10">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-coral/10 text-coral rounded-xl flex items-center justify-center">
              <Stethoscope size={22} />
            </div>
            <h1 className="text-3xl font-black text-coral-deep">پرونده سلامت الکترونیکی</h1>
          </div>
          <p className="text-gray-400 font-medium mt-1.5 text-sm mr-1">مدیریت سوابق پزشکی، واکسیناسیون و یادداشت‌های دامپزشک</p>
        </div>
      </header>

      {/* Two-Column Desktop-First Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Right Side Column (Span 4): Persistent "ثبت سابقه جدید" form */}
        <div className="lg:col-span-5">
          <Card glow glowColor="coral" className="border border-coral-light/20 shadow-xl bg-white sticky top-28" hoverEffect={false}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
              <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center text-coral">
                <FileHeart size={20} />
              </div>
              <h3 className="font-black text-gray-800 text-lg">ثبت سابقه پزشکی جدید</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 mr-1 uppercase tracking-wider">تاریخ معاینه / اقدام</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200/60 rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-coral/50 focus:ring-4 focus:ring-coral/10 transition-all duration-200 font-medium text-gray-700 text-sm placeholder:text-gray-400"
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 mr-1 uppercase tracking-wider">دلیل مراجعه یا عنوان سابقه</label>
                <input 
                  type="text" 
                  placeholder="مثال: واکسیناسیون دوره سالانه هاری"
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200/60 rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-coral/50 focus:ring-4 focus:ring-coral/10 transition-all duration-200 text-sm text-gray-800 placeholder:text-gray-400/90 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 mr-1 uppercase tracking-wider">یادداشت‌ها و توصیه‌های دامپزشک</label>
                <textarea 
                  placeholder="مثال: پزشک رژیم غذایی حاوی کربوهیدرات کمتر تجویز کرد و قطره ضد حساسیت چشمی داد."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200/60 rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-coral/50 focus:ring-4 focus:ring-coral/10 transition-all duration-200 text-sm h-32 resize-none text-gray-800 placeholder:text-gray-400/90 font-medium"
                />
              </div>
              
              <Button type="submit" className="w-full py-4 font-bold text-sm justify-center text-center" disabled={!formData.reason}>
                ذخیره در سوابق
              </Button>
            </form>
          </Card>
        </div>

        {/* Left Side Column (Span 7): Timeline of previous logs */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-lg font-black text-gray-700 mb-2 mr-2">خط زمانی سلامت</h3>
          
          <div className="relative pr-8 border-r-2 border-coral-light/25 space-y-8">
            {records.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-coral-light/15 p-10">
                <FileText className="mx-auto text-coral-light/35 mb-4 stroke-[1.5]" size={56} />
                <h4 className="text-lg font-bold text-gray-700">پرونده پزشکی خالی است</h4>
                <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                  هنوز هیچ پرونده یا سابقه پزشکی برای {profile?.name} ثبت نشده است. می‌توانید با استفاده از فرم روبه‌رو اولین پرونده را ایجاد کنید.
                </p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {records.map((record, i) => (
                  <TimelineItem
                    key={record.id}
                    record={record}
                    index={i}
                    onUpdate={updateRecord}
                    onDelete={deleteRecord}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
