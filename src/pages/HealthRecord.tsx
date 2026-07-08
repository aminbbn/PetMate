import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Plus, X, FileText, Calendar, ShieldAlert, FileHeart, Stethoscope, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPersian, formatPersianDate } from '../lib/persian';

export default function HealthRecord() {
  const records = useAppStore(state => state.healthRecords);
  const addRecord = useAppStore(state => state.addHealthRecord);
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
          <p className="text-gray-500 font-medium mt-1">مدیریت سوابق پزشکی، واکسیناسیون و یادداشت‌های دامپزشک</p>
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
                    className="w-full bg-peach/20 border border-coral-light/10 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-coral/50 font-medium text-gray-700 text-sm"
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
                  className="w-full bg-peach/20 border border-coral-light/10 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-coral/50 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 mr-1 uppercase tracking-wider">یادداشت‌ها و توصیه‌های دامپزشک</label>
                <textarea 
                  placeholder="مثال: پزشک رژیم غذایی حاوی کربوهیدرات کمتر تجویز کرد و قطره ضد حساسیت چشمی داد."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-peach/20 border border-coral-light/10 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-coral/50 text-sm h-32 resize-none"
                />
              </div>
              
              <Button type="submit" className="w-full py-4 font-bold text-sm" disabled={!formData.reason}>
                ذخیره در سوابق {profile?.name}
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
              records.map((record, i) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25, delay: i * 0.05 }}
                  className="relative"
                >
                  {/* Glowing Timeline Dot */}
                  <div className="absolute -right-[41px] top-6 w-5 h-5 bg-coral rounded-full shadow-md ring-4 ring-peach flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  
                  <Card className="bg-white border border-coral-light/10 shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between gap-4 mb-4 pb-2 border-b border-gray-50">
                      <div className="flex items-center gap-2 text-xs font-black text-coral bg-coral/5 px-3 py-1 rounded-full">
                        <Calendar size={14} />
                        <span>{formatPersianDate(record.date)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <Clock size={13} />
                        <span>ثبت شده</span>
                      </div>
                    </div>
                    
                    <h4 className="font-black text-gray-800 text-xl mb-3">{record.reason}</h4>
                    
                    {record.notes ? (
                      <div className="bg-peach/30 border border-coral-light/5 rounded-xl p-4 mt-3">
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{record.notes}</p>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-xs italic">بدون یادداشت تکمیلی.</p>
                    )}
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
