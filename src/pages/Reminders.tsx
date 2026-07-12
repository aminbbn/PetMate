import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Bell, Plus, Trash2, CheckCircle2, Circle, Calendar, Clock, Smile, Sparkles, Star, Pencil, X, Bot, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPersian, formatPersianDate } from '../lib/persian';
import { cn } from '../lib/utils';

export default function Reminders() {
  const navigate = useNavigate();
  const profile = useAppStore(state => state.profile);
  const reminders = useAppStore(state => state.reminders);
  const addReminder = useAppStore(state => state.addReminder);
  const updateReminder = useAppStore(state => state.updateReminder);
  const toggleReminder = useAppStore(state => state.toggleReminder);
  const deleteReminder = useAppStore(state => state.deleteReminder);

  const [title, setTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [category, setCategory] = useState('سلامت'); // سلامت، تغذیه، بازی، نظافت
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [alarmDate, setAlarmDate] = useState('');
  const [alarmTime, setAlarmTime] = useState('');

  // Editing state variables
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('سلامت');
  const [editAlarmEnabled, setEditAlarmEnabled] = useState(false);
  const [editAlarmDate, setEditAlarmDate] = useState('');
  const [editAlarmTime, setEditAlarmTime] = useState('');

  const handleStartEdit = (reminder: any) => {
    setEditingId(reminder.id);
    const hasTag = reminder.title.startsWith('[');
    const tagEnd = reminder.title.indexOf(']');
    const tag = hasTag && tagEnd !== -1 ? reminder.title.substring(1, tagEnd) : 'مراقبت';
    const cleanTitle = hasTag && tagEnd !== -1 ? reminder.title.substring(tagEnd + 1).trim() : reminder.title;

    setEditTitle(cleanTitle);
    setEditCategory(tag);
    setEditAlarmEnabled(!!reminder.alarmEnabled);
    setEditAlarmDate(reminder.alarmDate || '');
    setEditAlarmTime(reminder.alarmTime || '');
  };

  const handleSaveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    updateReminder(id, {
      title: `[${editCategory}] ${editTitle.trim()}`,
      alarmEnabled: editAlarmEnabled,
      alarmDate: editAlarmEnabled ? editAlarmDate : undefined,
      alarmTime: editAlarmEnabled ? editAlarmTime : undefined
    });
    setEditingId(null);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addReminder(
      `[${category}] ${title.trim()}`, 
      new Date().toISOString(), 
      alarmEnabled, 
      alarmEnabled ? alarmDate : undefined, 
      alarmEnabled ? alarmTime : undefined
    );
    setTitle('');
    setAlarmEnabled(false);
    setAlarmDate('');
    setAlarmTime('');
    setShowAddForm(false);
  };

  const categories = [
    { name: 'سلامت', color: 'bg-coral/10 text-coral border-coral/20' },
    { name: 'تغذیه', color: 'bg-sunny/15 text-sunny border-sunny/25' },
    { name: 'نظافت', color: 'bg-blue-50 text-blue-500 border-blue-100' },
    { name: 'بازی و سرگرمی', color: 'bg-mint/15 text-mint border-mint/25' },
  ];

  if (!profile) return null;

  return (
    <div className="p-8 lg:p-10 space-y-8 max-w-7xl mx-auto w-full text-right" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <Bell className="text-sunny animate-swing" size={32} />
            یادآورها و برنامه‌های {profile.name}
          </h1>
          <p className="text-gray-400 text-sm font-bold mt-2">
            برنامه‌ریزی دقیق واکسیناسیون، تغذیه، نظافت و قرارهای مهم مراقبتی
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          variant="primary" 
          className="flex items-center gap-2 font-black text-sm shadow-md shadow-coral/10 py-3"
        >
          <Plus size={18} />
          ثبت یادآور مراقبتی جدید
        </Button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Reminders Planner Form & Quick Schedules (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Add Reminder Card */}
          <AnimatePresence initial={false}>
            {showAddForm && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9, height: 0 }}
                animate={{ opacity: 1, scale: 1, height: "auto" }}
                exit={{ opacity: 0, scale: 0.9, height: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 180,
                  damping: 22,
                  mass: 1
                }}
                className="overflow-hidden"
              >
                <div className="pb-2">
                  <Card className="bg-white border-sunny/25 p-6 space-y-4 shadow-none group">
                    <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                      <div className="w-14 h-14 rounded-2xl bg-sunny/15 text-sunny flex items-center justify-center shrink-0 shadow-sm shadow-sunny/10 relative overflow-visible group-hover:bg-sunny/20 group-hover:shadow-md transition-all duration-500">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2.2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="z-10 relative transition-all duration-500 group-hover:scale-110"
                        >
                          <circle cx="12" cy="12" r="10" />
                          {/* Hour hand */}
                          <line 
                            x1="12" y1="12" x2="12" y2="8" 
                            style={{ transformOrigin: '12px 12px' }}
                            className="animate-clock-hour" 
                          />
                          {/* Minute hand */}
                          <line 
                            x1="12" y1="12" x2="12" y2="6" 
                            style={{ transformOrigin: '12px 12px' }}
                            className="animate-clock-minute" 
                          />
                        </svg>
                        
                        {/* Clock numbers popping outside when hands sweep over */}
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] font-black select-none pointer-events-none opacity-0 group-hover:opacity-100 z-0 text-sunny transition-all duration-300 animate-clock-num-12">۱۲</span>
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] font-black select-none pointer-events-none opacity-0 group-hover:opacity-100 z-0 text-sunny transition-all duration-300 animate-clock-num-3">۳</span>
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] font-black select-none pointer-events-none opacity-0 group-hover:opacity-100 z-0 text-sunny transition-all duration-300 animate-clock-num-6">۶</span>
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] font-black select-none pointer-events-none opacity-0 group-hover:opacity-100 z-0 text-sunny transition-all duration-300 animate-clock-num-9">۹</span>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-black text-gray-800 text-lg leading-none">تعریف یادآور مراقبتی جدید</h3>
                        <p className="text-gray-400 text-[10px] font-bold">دسته‌بندی موضوعی و عنوان یادآور مراقبتی</p>
                      </div>
                    </div>
                    <form onSubmit={handleAdd} className="space-y-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-400 font-bold block">دسته‌بندی موضوعی</label>
                        <div className="grid grid-cols-2 gap-2">
                          {categories.map((cat) => (
                            <button
                              key={cat.name}
                              type="button"
                              onClick={() => setCategory(cat.name)}
                              className={cn(
                                "px-3 py-2 rounded-xl border text-xs font-bold transition-all text-center",
                                category === cat.name 
                                  ? "bg-coral text-white border-coral shadow-sm shadow-coral/10" 
                                  : "bg-white border-gray-100 text-gray-500 hover:border-coral-light/20"
                              )}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-400 font-bold block">عنوان یادآور</label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="مثال: قطره ضدکک و کنه یا قرص انگل..."
                          className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-coral/50"
                          required
                        />
                      </div>

                      {/* Alarm Activation Toggle */}
                      <div className="pt-3 border-t border-dashed border-gray-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock size={16} className={cn("transition-colors", alarmEnabled ? "text-sunny animate-swing" : "text-gray-300")} />
                            <span className="text-xs font-black text-gray-700">تنظیم زنگ هشدار (آلارم) برای این رویداد</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAlarmEnabled(!alarmEnabled)}
                            className={cn(
                              "w-11 h-6 rounded-full transition-all relative cursor-pointer outline-none shrink-0",
                              alarmEnabled ? "bg-sunny shadow-sm shadow-sunny/20" : "bg-gray-200"
                            )}
                          >
                            <span
                              className={cn(
                                "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm",
                                alarmEnabled ? "translate-x-5" : "translate-x-0"
                              )}
                            />
                          </button>
                        </div>

                        {alarmEnabled && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                          >
                            <div className="space-y-1.5">
                              <label className="text-[10px] text-gray-400 font-bold block">تاریخ آلارم</label>
                              <div className="relative">
                                <input
                                  type="date"
                                  value={alarmDate}
                                  onChange={(e) => setAlarmDate(e.target.value)}
                                  className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-coral/50 text-right pr-3 pl-8"
                                  required={alarmEnabled}
                                />
                                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] text-gray-400 font-bold block">ساعت آلارم</label>
                              <div className="relative">
                                <input
                                  type="time"
                                  value={alarmTime}
                                  onChange={(e) => setAlarmTime(e.target.value)}
                                  className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-coral/50 text-right pr-3 pl-8"
                                  required={alarmEnabled}
                                />
                                <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <div className="flex gap-3 justify-end pt-2">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                          انصراف
                        </Button>
                        <Button type="submit" variant="primary" size="sm">
                          ثبت نهایی یادآور
                        </Button>
                      </div>
                    </form>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick AI Advisor */}
          <motion.div
            layout
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 22,
              mass: 1
            }}
          >
            <Card 
              glow 
              glowColor="sunny" 
              hoverEffect={true}
              ambientCorner="bottom-right"
            className="bg-white border-sunny/25 shadow-warm-lg flex flex-col justify-between p-6 text-right"
          >
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-sunny/15 text-sunny flex items-center justify-center shrink-0 shadow-sm shadow-sunny/10 relative overflow-visible group-hover:bg-sunny/20 group-hover:shadow-md transition-all duration-500">
                <Sparkles size={24} className="stroke-[2.2] group-hover:scale-110 group-hover:rotate-[15deg] transition-all duration-500 z-10" />
                
                {/* 4 Custom Star Shards that animate in the frame on hover */}
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current text-sunny absolute left-1/2 top-1/2 opacity-0 pointer-events-none animate-shard-1 z-0 drop-shadow-[0_0_8px_rgba(255,181,107,0.95)]">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-current text-sunny absolute left-1/2 top-1/2 opacity-0 pointer-events-none animate-shard-2 z-0 drop-shadow-[0_0_8px_rgba(255,181,107,0.95)]">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] fill-current text-sunny absolute left-1/2 top-1/2 opacity-0 pointer-events-none animate-shard-3 z-0 drop-shadow-[0_0_8px_rgba(255,181,107,0.95)]">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] fill-current text-sunny absolute left-1/2 top-1/2 opacity-0 pointer-events-none animate-shard-4 z-0 drop-shadow-[0_0_8px_rgba(255,181,107,0.95)]">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="font-black text-gray-900 text-lg leading-snug">پیشنهاد هوش مصنوعی پت میت</h3>
                <p className="text-gray-500 text-xs leading-relaxed font-medium">
                  با توجه به اینکه سن {profile.name} {toPersian(profile.age)} سال و نژاد آن {profile.breed || 'نامشخص'} است، هم‌اکنون به واکسن سه‌گانه سالانه یا بررسی دوره‌ای دندان نیاز دارد. یادآور‌های مربوطه را ثبت کنید تا سیستم به شما هشدار دهد.
                </p>
                <div className="pt-2 flex justify-start">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/triage', { 
                      state: { 
                        prefilled: `سلام، می‌خواهم درباره توصیه هوش مصنوعی برای ${profile.name} گفتگو کنم. با توجه به اینکه سن او ${toPersian(profile.age)} سال و نژادش ${profile.breed || 'نامشخص'} است، گفته شده که هم‌اکنون به واکسن سه‌گانه سالانه یا بررسی دوره‌ای دندان نیاز دارد. لطفاً راهنمایی‌ام کنید که چه کارهایی باید انجام دهم؟` 
                      } 
                    })}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-l from-sunny to-amber-500 hover:from-amber-500 hover:to-sunny text-white text-xs font-black rounded-xl transition-all duration-300 shadow-sm shadow-sunny/20 cursor-pointer"
                  >
                    <Bot size={15} className="animate-bounce" />
                    <span>گفتگو با دستیار درباره وضعیت {profile.name}</span>
                    <ChevronLeft size={14} className="mr-0.5" />
                  </motion.button>
                </div>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-bold">
              <span>آخرین پایش خودکار: امروز</span>
              <span className="text-sunny flex items-center gap-1.5 font-black">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sunny opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sunny"></span>
                </span>
                توصیه مراقبتی دوره‌ای
              </span>
            </div>
          </Card>
        </motion.div>
      </div>

        {/* Right Column: Reminders Checklist & Interactive Status (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card 
            glow 
            glowColor="sunny" 
            hoverEffect={true}
            ambientCorner="top-left"
            className="bg-white border-sunny/25 p-6 shadow-warm-lg min-h-[450px] flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-sunny/15 text-sunny flex items-center justify-center shrink-0 shadow-sm shadow-sunny/10 relative overflow-visible group-hover:bg-sunny/20 group-hover:shadow-md transition-all duration-500">
                    <Calendar size={24} className="stroke-[2.2] group-hover:scale-105 transition-all duration-500 z-10 relative" />
                    
                    {/* Floating calendar numbers flying in on hover and settling into calendar */}
                    <span className="absolute text-[11px] font-black select-none pointer-events-none opacity-0 group-hover:opacity-100 animate-num-fly-1 z-0">۱۲</span>
                    <span className="absolute text-[11px] font-black select-none pointer-events-none opacity-0 group-hover:opacity-100 animate-num-fly-2 z-0">۷</span>
                    <span className="absolute text-[11px] font-black select-none pointer-events-none opacity-0 group-hover:opacity-100 animate-num-fly-3 z-0">۲۸</span>
                    <span className="absolute text-[11px] font-black select-none pointer-events-none opacity-0 group-hover:opacity-100 animate-num-fly-4 z-0">۳</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black text-gray-800 text-lg leading-none">برنامه زمان‌بندی و پایش یادآورها</h3>
                    <p className="text-gray-400 text-[10px] font-bold">برنامه‌ریزی دقیق، پایش هوشمند دوره‌ای و واکسیناسیون</p>
                  </div>
                </div>
                <span className="bg-sunny/5 text-sunny text-xs font-black px-3.5 py-2 rounded-full border border-sunny-light/10">
                  تعداد کل: {toPersian(reminders.length)} برنامه
                </span>
              </div>
 
              {reminders.length === 0 ? (
                <div className="text-center py-20 bg-sunny/5 rounded-3xl border border-dashed border-sunny/20 flex flex-col items-center justify-center space-y-4">
                  <Bell size={40} className="text-sunny animate-swing" strokeWidth={2} />
                  <div className="space-y-1">
                    <p className="text-gray-500 font-black text-sm">هیچ برنامه فعالی ثبت نشده است.</p>
                    <p className="text-gray-400 text-xs">شما می‌توانید برنامه‌های مربوط به تغذیه یا درمان را وارد کنید.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowAddForm(true)}>
                    افزودن اولین یادآور
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {reminders.map((reminder) => {
                      // parse category tag if exists: e.g. [سلامت] title
                      const hasTag = reminder.title.startsWith('[');
                      const tagEnd = reminder.title.indexOf(']');
                      const tag = hasTag && tagEnd !== -1 ? reminder.title.substring(1, tagEnd) : 'مراقبت';
                      const cleanTitle = hasTag && tagEnd !== -1 ? reminder.title.substring(tagEnd + 1).trim() : reminder.title;
                      
                      const categoryColors: Record<string, string> = {
                        'سلامت': 'bg-coral/10 text-coral border-coral/20',
                        'تغذیه': 'bg-sunny/15 text-sunny border-sunny/25',
                        'نظافت': 'bg-blue-50 text-blue-500 border-blue-100',
                        'بازی و سرگرمی': 'bg-mint/15 text-mint border-mint/25',
                      };

                      const catStyle = categoryColors[tag] || 'bg-gray-50 text-gray-500 border-gray-100';

                      return (
                        <motion.div
                          key={reminder.id}
                          layout
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -15 }}
                          transition={{ type: "spring", stiffness: 350, damping: 28 }}
                          className="w-full"
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {editingId === reminder.id ? (
                              <motion.div
                                key="edit"
                                initial={{ opacity: 0, scale: 0.98, y: -8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: 8 }}
                                transition={{ duration: 0.2 }}
                                className="bg-sunny/5 border border-sunny/20 p-4 rounded-2xl space-y-4 text-right"
                              >
                                <div className="flex items-center justify-between border-b border-sunny/10 pb-2">
                                  <span className="text-xs font-black text-gray-700">ویرایش یادآور مراقبتی</span>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>

                                <div className="space-y-3">
                                  {/* Category selection */}
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] text-gray-400 font-bold block">دسته‌بندی موضوعی</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                                      {categories.map((cat) => (
                                        <button
                                          key={cat.name}
                                          type="button"
                                          onClick={() => setEditCategory(cat.name)}
                                          className={cn(
                                            "px-2.5 py-1.5 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer",
                                            editCategory === cat.name
                                              ? "bg-sunny border-sunny text-white shadow-sm shadow-sunny/20"
                                              : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                                          )}
                                        >
                                          {cat.name}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Title input */}
                                  <div className="space-y-1.5">
                                    <label className="text-[10px] text-gray-400 font-bold block">عنوان یادآور</label>
                                    <input
                                      type="text"
                                      value={editTitle}
                                      onChange={(e) => setEditTitle(e.target.value)}
                                      className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-sunny/50 text-right font-black"
                                      placeholder="عنوان یادآور را وارد کنید..."
                                    />
                                  </div>

                                  {/* Alarm switch & inputs */}
                                  <div className="pt-2.5 border-t border-dashed border-sunny/10 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1.5">
                                        <Clock size={14} className={cn("transition-colors", editAlarmEnabled ? "text-sunny animate-swing" : "text-gray-300")} />
                                        <span className="text-[11px] font-black text-gray-700">تنظیم زنگ هشدار (آلارم) برای این رویداد</span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => setEditAlarmEnabled(!editAlarmEnabled)}
                                        className={cn(
                                          "w-9 h-5 rounded-full transition-all relative cursor-pointer outline-none shrink-0",
                                          editAlarmEnabled ? "bg-sunny shadow-sm shadow-sunny/20" : "bg-gray-200"
                                        )}
                                      >
                                        <span
                                          className={cn(
                                            "absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform shadow-sm",
                                            editAlarmEnabled ? "translate-x-4" : "translate-x-0"
                                          )}
                                        />
                                      </button>
                                    </div>

                                    {editAlarmEnabled && (
                                      <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                          <label className="text-[9px] text-gray-400 font-bold block">تاریخ آلارم</label>
                                          <div className="relative">
                                            <input
                                              type="date"
                                              value={editAlarmDate}
                                              onChange={(e) => setEditAlarmDate(e.target.value)}
                                              className="w-full bg-white border border-gray-100 rounded-xl px-2 py-1.5 text-[11px] outline-none focus:ring-2 focus:ring-sunny/50 text-right pl-6"
                                              required={editAlarmEnabled}
                                            />
                                            <Calendar size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                          </div>
                                        </div>

                                        <div className="space-y-1">
                                          <label className="text-[9px] text-gray-400 font-bold block">ساعت آلارم</label>
                                          <div className="relative">
                                            <input
                                              type="time"
                                              value={editAlarmTime}
                                              onChange={(e) => setEditAlarmTime(e.target.value)}
                                              className="w-full bg-white border border-gray-100 rounded-xl px-2 py-1.5 text-[11px] outline-none focus:ring-2 focus:ring-sunny/50 text-right pl-6"
                                              required={editAlarmEnabled}
                                            />
                                            <Clock size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Save/Cancel buttons */}
                                  <div className="flex justify-end gap-2 pt-2 border-t border-sunny/10">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      type="button"
                                      onClick={() => setEditingId(null)}
                                    >
                                      انصراف
                                    </Button>
                                    <Button
                                      size="sm"
                                      type="button"
                                      onClick={() => handleSaveEdit(reminder.id)}
                                      className="bg-sunny hover:bg-sunny-hover text-white px-4"
                                    >
                                      ذخیره تغییرات
                                    </Button>
                                  </div>

                                </div>
                              </motion.div>
                            ) : confirmDeleteId === reminder.id ? (
                              <motion.div
                                key="delete"
                                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                                transition={{ duration: 0.2 }}
                                className="bg-rose-50/70 border border-rose-100 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-right w-full"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-500 flex items-center justify-center shrink-0">
                                    <Trash2 size={18} className="animate-pulse" />
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-xs font-black text-gray-800">آیا واقعاً می‌خواهید این یادآور را حذف کنید؟</p>
                                    <p className="text-[11px] text-gray-500 font-bold truncate max-w-xs">{cleanTitle}</p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-end gap-2 shrink-0">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    type="button"
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="text-xs font-bold hover:bg-gray-100"
                                  >
                                    انصراف
                                  </Button>
                                  <Button
                                    size="sm"
                                    type="button"
                                    onClick={() => {
                                      deleteReminder(reminder.id);
                                      setConfirmDeleteId(null);
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-black px-4"
                                  >
                                    بله، حذف شود
                                  </Button>
                                </div>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="view"
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 8 }}
                                transition={{ duration: 0.2 }}
                                className={cn(
                                  "flex items-center justify-between gap-4 p-4 rounded-2xl border transition-all duration-300 w-full",
                                  reminder.completed 
                                    ? "bg-gray-50/50 border-gray-100 opacity-60" 
                                    : "bg-white border-coral-light/5 hover:border-coral-light/15 hover:shadow-md"
                                )}
                              >
                                <div className="flex items-center gap-3.5 min-w-0">
                                  <button
                                    onClick={() => toggleReminder(reminder.id)}
                                    className="text-coral hover:scale-110 transition-transform cursor-pointer shrink-0"
                                  >
                                    {reminder.completed 
                                      ? <CheckCircle2 size={22} className="text-success stroke-[2.5]" /> 
                                      : <Circle size={22} className="text-gray-300 hover:text-coral" />
                                    }
                                  </button>
                                  <div className="space-y-1 text-right min-w-0">
                                    <span className={cn(
                                      "text-xs font-black text-gray-700 block truncate",
                                      reminder.completed && "line-through text-gray-400"
                                    )}>
                                      {cleanTitle}
                                    </span>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border", catStyle)}>
                                        {tag}
                                      </span>
                                      <span className="text-[10px] text-gray-400 font-bold">
                                        ثبت شده در: {formatPersianDate(reminder.date)}
                                      </span>
                                      {reminder.alarmEnabled && reminder.alarmDate && (
                                        <span className="text-[10px] bg-sunny/10 text-caution border border-sunny/20 px-2 py-0.5 rounded-md font-bold flex items-center gap-1.5 shrink-0">
                                          <Bell size={11} className="text-sunny animate-swing" />
                                          <span>زنگ هشدار: {formatPersianDate(reminder.alarmDate)} {reminder.alarmTime ? `ساعت ${toPersian(reminder.alarmTime)}` : ''}</span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => handleStartEdit(reminder)}
                                    className="text-gray-300 hover:text-sunny hover:bg-sunny/5 p-2 rounded-xl transition-all cursor-pointer shrink-0"
                                    title="ویرایش"
                                  >
                                    <Pencil size={15} />
                                  </button>
                                  <button
                                    onClick={() => setConfirmDeleteId(reminder.id)}
                                    className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all cursor-pointer shrink-0"
                                    title="حذف"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400 font-bold">
              <span>در صورت تکمیل برنامه‌ها روی دایره‌ها کلیک کنید</span>
              <span className="text-coral-deep flex items-center gap-1">
                <Star size={12} fill="currentColor" />
                تکمیل حداکثری برنامه‌ها امتیاز وفاداری دارد
              </span>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}
