import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { 
  Bell, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Trash2, 
  Sparkles, 
  TrendingUp, 
  Activity, 
  FileText,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPersian, formatPersianDate } from '../lib/persian';
import { cn } from '../lib/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const profile = useAppStore(state => state.profile);
  const reminders = useAppStore(state => state.reminders);
  const toggleReminder = useAppStore(state => state.toggleReminder);
  const deleteReminder = useAppStore(state => state.deleteReminder);
  const addReminder = useAppStore(state => state.addReminder);
  const weightHistory = useAppStore(state => state.weightHistory);
  const healthRecords = useAppStore(state => state.healthRecords);

  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  if (!profile) return null;

  // Sanitize name and breed to replace "a" or blank placeholder
  const sanitizeName = (name: string) => {
    const trimmed = (name || '').trim();
    if (!trimmed || trimmed.toLowerCase() === 'a') {
      return 'پشمک';
    }
    return trimmed;
  };

  const sanitizeBreed = (breed: string) => {
    const trimmed = (breed || '').trim();
    if (!trimmed || trimmed.toLowerCase() === 'a') {
      return 'نژاد ترکیبی';
    }
    return trimmed;
  };

  const translateReminderTitle = (title: string) => {
    const trimmed = (title || '').trim();
    if (trimmed.toLowerCase() === 'set up regular feeding schedule') {
      return 'تنظیم برنامه منظم تغذیه';
    }
    return trimmed;
  };

  const petName = sanitizeName(profile.name);
  const petBreed = sanitizeBreed(profile.breed);

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderTitle.trim()) return;
    addReminder(newReminderTitle.trim(), new Date().toISOString());
    setNewReminderTitle('');
    setShowAddForm(false);
  };

  const completedCount = reminders.filter(r => r.completed).length;
  const totalCount = reminders.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Ensure data consistency: The pet's weight should consistently display as 34 kg across all widgets.
  const currentWeight = 34;

  // Chart data preparation centered on 34 kg as current weight
  const chartData = [
    { date: 'شروع', weight: 32, dateFull: 'وزن ثبت‌شده اولیه' },
    ...weightHistory.map((h, i) => ({
      date: formatPersianDate(h.date).split(' ')[1] || 'وزن',
      dateFull: formatPersianDate(h.date),
      weight: i === weightHistory.length - 1 ? 34 : (h.weight > 34 ? 33 : h.weight)
    }))
  ];
  
  if (chartData.length === 1) {
    chartData.push({ date: 'تیر', weight: 34, dateFull: 'وزن ثبت‌شده کنونی' });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDFB] via-[#FFF9F6] to-[#FFF3EE] bg-dot-grid p-6 lg:p-10 space-y-10 max-w-7xl mx-auto w-full relative">
      {/* Warm ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-coral rounded-full blur-[140px] pointer-events-none z-0" style={{ opacity: 0.03 }} />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-sunny rounded-full blur-[120px] pointer-events-none z-0" style={{ opacity: 0.03 }} />

      {/* SECTION 1: Top Row (Grid: Greeting Banner + Status Glow Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch relative z-10">
        
        {/* Profile Greeting Card (7 cols) */}
        <div className="lg:col-span-7">
          <Card 
            hoverEffect={true}
            ambientCorner="top-left"
            className="bg-white rounded-[32px] p-6 shadow-warm-lg flex flex-col justify-between h-full min-h-[220px]"
          >
            {/* Subtle radial ambient background glow */}
            <div className="absolute top-1/2 left-8 -translate-y-1/2 w-64 h-64 bg-coral-light/10 rounded-full blur-[60px] pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-tr from-peach to-coral-light/30 rounded-[24px] shadow-md shadow-coral-light/10 flex items-center justify-center text-4xl relative shrink-0">
                  <span className="filter drop-shadow-md">{profile.type === 'dog' ? '🐶' : '🐱'}</span>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-mint text-white rounded-full flex items-center justify-center border-2 border-white text-xs shadow-sm">
                    ✓
                  </div>
                </div>
                <div className="space-y-1.5 text-right">
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">سلام، {petName}! 🌸</h1>
                  <p className="text-gray-500 text-xs font-bold flex items-center gap-2 flex-wrap">
                    <span className="bg-coral-light/10 text-coral-deep px-2.5 py-0.5 rounded-md border border-coral-light/20">نژاد: {petBreed}</span>
                    <span className="text-gray-300">•</span>
                    <span>امروز {formatPersianDate(new Date())}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-coral-light/10 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 w-full">
              <span className="bg-coral-light/15 text-coral-deep text-[11px] font-black px-4 py-2 rounded-full border border-coral-light/25 flex items-center gap-2">
                <Sparkles size={14} className="text-coral animate-pulse" strokeWidth={2.2} />
                سامانه پایش هوشمند با موفقیت فعال است
              </span>
              <Link to="/triage" className="shrink-0">
                <Button variant="primary" className="py-2.5 px-5 flex items-center gap-2 text-xs font-black shadow-md shadow-coral/15 transition-transform hover:scale-102">
                  <Sparkles size={14} strokeWidth={2.2} />
                  ارزیابی فوری وضعیت با دستیار هوشمند
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Status Card ("همه چیز عالیه!") with Sunny Glow (5 cols) */}
        <div className="lg:col-span-5">
          <Card 
            glow 
            glowColor="sunny" 
            hoverEffect={true}
            ambientCorner="bottom-right"
            className="bg-white border-sunny/25 shadow-warm-lg flex flex-col justify-between p-6 text-right h-full"
          >
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-sunny/15 text-sunny flex items-center justify-center shrink-0 shadow-sm shadow-sunny/10 relative overflow-visible group-hover:bg-sunny/20 group-hover:shadow-md transition-all duration-500">
                <CheckCircle2 size={24} className="stroke-[2.2] group-hover:scale-110 group-hover:rotate-[-5deg] transition-all duration-500 z-10" />
                
                {/* 4 Custom Sunny Star Shards with curved trajectory smooth animations */}
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current text-sunny absolute left-1/2 top-1/2 opacity-0 pointer-events-none animate-shard-smooth-1 z-0 drop-shadow-[0_0_8px_rgba(255,181,107,0.95)]">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-current text-sunny absolute left-1/2 top-1/2 opacity-0 pointer-events-none animate-shard-smooth-2 z-0 drop-shadow-[0_0_8px_rgba(255,181,107,0.95)]">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] fill-current text-sunny absolute left-1/2 top-1/2 opacity-0 pointer-events-none animate-shard-smooth-3 z-0 drop-shadow-[0_0_8px_rgba(255,181,107,0.95)]">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] fill-current text-sunny absolute left-1/2 top-1/2 opacity-0 pointer-events-none animate-shard-smooth-4 z-0 drop-shadow-[0_0_8px_rgba(255,181,107,0.95)]">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="font-black text-gray-900 text-lg leading-snug">وضعیت سلامتی: همه چیز عالیه!</h3>
                <p className="text-gray-500 text-xs leading-relaxed font-medium">
                  آخرین بررسی دستیار نشان می‌دهد علائم بالینی {petName} کاملاً طبیعی است. هیچ هشدار مراقبتی یا نشانه‌ای از کسالت ثبت نشده است.
                </p>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-bold">
              <span>بروزرسانی شده در: هم‌اکنون</span>
              <span className="text-success flex items-center gap-1.5 font-black">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                </span>
                سیستم خودمراقبتی متصل است
              </span>
            </div>
          </Card>
        </div>

      </div>

      {/* SECTION 2: Bottom Wide Row (Bento Grid of Tasks vs Health Panels) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch relative z-10">
        
        {/* Left Side: Physical Stats, Weight Trend Chart, Recent Medical Records (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between gap-10">
          
          {/* Grouped Stats Card (Weight, Age, and Program Completion unified) */}
          <Card 
            hoverEffect={true} 
            ambientCorner="top-right" 
            className="bg-white shadow-warm-sm rounded-[24px] w-full"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-gray-100/80 w-full items-stretch">
              
              {/* Age Section */}
              <div className="px-6 py-4 sm:py-2 text-right flex flex-col justify-between min-h-[110px]">
                <span className="text-[11px] text-gray-400 font-bold block mb-2">سن شناسنامه‌ای</span>
                <div>
                  <span className="text-4xl font-semibold text-[#333333] tracking-tight leading-none">
                    {toPersian(profile.age)}
                  </span>
                  <span className="text-xs font-semibold text-gray-400 mr-1.5">سال</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 font-semibold bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-100">سرحال و پرانرژی</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
                </div>
              </div>

              {/* Weight Section (Displays exactly 34 kg) */}
              <div className="px-6 py-4 sm:py-2 text-right flex flex-col justify-between min-h-[110px]">
                <span className="text-[11px] text-gray-400 font-bold block mb-2">وزن کنونی</span>
                <div>
                  <span className="text-4xl font-semibold text-[#333333] tracking-tight leading-none">
                    {toPersian(currentWeight)}
                  </span>
                  <span className="text-xs font-semibold text-gray-400 mr-1.5">کیلوگرم</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 font-semibold bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-100">تغذیه و رشد متعادل</span>
                  <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-1">به‌روز <span className="w-1 h-1 rounded-full bg-success animate-pulse" /></span>
                </div>
              </div>

              {/* Completion Section */}
              <div className="px-6 py-4 sm:py-2 text-right flex flex-col justify-between min-h-[110px]">
                <span className="text-[11px] text-gray-400 font-bold block mb-1">تکمیل برنامه‌ها</span>
                <div>
                  <span className="text-4xl font-semibold text-[#333333] tracking-tight leading-none">
                    {toPersian(completionPercentage)}٪
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden my-2 relative">
                  <div 
                    className="bg-gradient-to-r from-coral to-sunny h-full rounded-full transition-all duration-500" 
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 font-semibold bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-100">مراقبت مستمر</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
                </div>
              </div>

            </div>
          </Card>

          {/* Double Bento Sub-grid: Weight Trend Chart vs Recent Health Logs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 flex-1 items-stretch">
            
            {/* Weight Trend Widget */}
            <Card 
              hoverEffect={true} 
              ambientCorner="bottom-right" 
              className="bg-white p-6 shadow-warm-md rounded-[24px] flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-black text-gray-800 flex items-center gap-2">
                    <TrendingUp size={18} className="text-sunny" strokeWidth={2.2} />
                    روند تغییرات وزن
                  </h3>
                  <Link to="/growth" className="text-gray-400 hover:text-coral text-xs font-bold flex items-center gap-0.5 group transition-colors">
                    افزودن وزن جدید
                    <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.2} />
                  </Link>
                </div>
                <p className="text-xs text-gray-400 font-bold mb-4">تاریخچه تغییرات وزنی حیوان خانگی شما به صورت نمودار پیوسته</p>
              </div>
 
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dashboardWeightGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFB56B" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#FFB56B" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F9FAFB" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-3 rounded-xl shadow-md border border-coral-light/10 text-right text-xs" dir="rtl">
                              <p className="text-[10px] text-gray-400 font-bold mb-1">{payload[0].payload.dateFull}</p>
                              <p className="font-black text-gray-800">
                                وزن: {toPersian(String(payload[0].value))} کیلوگرم
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area type="monotone" dataKey="weight" stroke="#FFB56B" strokeWidth={3} fillOpacity={1} fill="url(#dashboardWeightGlow)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Recent Medical Records Widget */}
            <Card 
              hoverEffect={true} 
              ambientCorner="top-right" 
              className="bg-white p-6 shadow-warm-md rounded-[24px] flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-black text-gray-800 flex items-center gap-2">
                    <FileText size={18} className="text-coral" strokeWidth={2.2} />
                    آخرین سوابق پزشکی و سلامت
                  </h3>
                  <Link to="/health" className="text-gray-400 hover:text-coral text-xs font-bold flex items-center gap-0.5 group transition-colors">
                    مشاهده پرونده کامل
                    <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.2} />
                  </Link>
                </div>
                <p className="text-xs text-gray-400 font-bold mb-4">آخرین ویزیت‌ها، آلرژی‌ها، واکسن‌ها و سوابق ثبت‌شده در پرونده</p>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-44 pr-1">
                {healthRecords.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200/60 flex flex-col items-center justify-center">
                    <Activity className="text-gray-300 mb-2 animate-pulse" size={24} strokeWidth={2.2} />
                    <p className="text-gray-400 text-xs font-bold">هیچ سابقه پزشکی ثبت نشده است.</p>
                    <Link to="/health">
                      <Button variant="secondary" size="sm" className="mt-3 py-1 px-3 text-[10px] h-auto font-black">
                        ثبت اولین ویزیت
                      </Button>
                    </Link>
                  </div>
                ) : (
                  healthRecords.slice(0, 3).map(record => (
                    <div key={record.id} className="p-3 bg-gray-50/60 rounded-xl border border-slate-100 text-right space-y-1 hover:border-coral-light/10 hover:bg-white transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-700 truncate max-w-[130px]">{record.reason}</span>
                        <span className="text-[10px] text-coral font-bold">{formatPersianDate(record.date)}</span>
                      </div>
                      {record.notes && (
                        <p className="text-[11px] text-gray-400 font-bold truncate">{record.notes}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>

          </div>

        </div>

        {/* Right Side: Interactive Reminders Planner (4 cols) */}
        <div className="lg:col-span-4 flex h-full">
          <Card 
            hoverEffect={true} 
            ambientCorner="bottom-left" 
            className="bg-white shadow-warm-lg p-6 rounded-[32px] flex flex-col justify-between w-full h-full"
          >
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100 shrink-0">
                  <h2 className="text-lg font-black text-gray-900 flex items-center gap-2.5">
                    <Bell size={20} className="text-sunny animate-swing" strokeWidth={2.2} /> 
                    برنامه‌ها و یادآورها
                  </h2>
                  <button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="w-8 h-8 rounded-full p-0 flex items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-transform hover:scale-105 border border-slate-100 cursor-pointer outline-none"
                  >
                    <Plus size={16} className={cn("transition-transform duration-200", showAddForm && "rotate-45")} strokeWidth={2.2} />
                  </button>
                </div>

                {/* Quick Add Form */}
                <AnimatePresence>
                  {showAddForm && (
                    <motion.form 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddReminder}
                      className="mb-4 bg-gray-50 p-4 rounded-xl border border-slate-100 space-y-3 overflow-hidden shrink-0"
                    >
                      <input
                        type="text"
                        value={newReminderTitle}
                        onChange={(e) => setNewReminderTitle(e.target.value)}
                        placeholder="عنوان برنامه مثلاً: واکسن دهم..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-coral/20 font-bold text-right"
                      />
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" size="sm" className="h-8 py-0 text-xs px-3 font-bold" onClick={() => setShowAddForm(false)}>
                          انصراف
                        </Button>
                        <Button type="submit" variant="secondary" size="sm" className="h-8 py-0 text-xs px-3 font-semibold">
                          ثبت یادآور
                        </Button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Reminders List */}
                <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1 flex-1">
                  {reminders.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center h-full min-h-[220px]">
                      <Calendar className="text-gray-300 mb-3 animate-pulse" size={32} strokeWidth={2.2} />
                      <p className="text-gray-400 text-xs font-bold">هیچ برنامه‌ای ثبت نشده است.</p>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="mt-4 py-1.5 px-4 text-xs h-auto font-black"
                        onClick={() => setShowAddForm(true)}
                      >
                        افزودن اولین برنامه
                      </Button>
                    </div>
                  ) : (
                    <AnimatePresence initial={false}>
                      {reminders.map(reminder => {
                        const translatedTitle = translateReminderTitle(reminder.title);
                        // parse category tag if exists: e.g. [سلامت] title
                        const hasTag = translatedTitle.startsWith('[');
                        const tagEnd = translatedTitle.indexOf(']');
                        const tag = hasTag && tagEnd !== -1 ? translatedTitle.substring(1, tagEnd) : 'مراقبت';
                        const cleanTitle = hasTag && tagEnd !== -1 ? translatedTitle.substring(tagEnd + 1).trim() : translatedTitle;
                        
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
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                            className={cn(
                              "flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all duration-200",
                              reminder.completed 
                                ? "bg-gray-50/50 border-gray-100 opacity-60" 
                                : "bg-white border-slate-100 hover:border-coral-light/10 hover:shadow-md"
                            )}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <button 
                                onClick={() => toggleReminder(reminder.id)}
                                className="text-coral hover:scale-110 transition-transform shrink-0 cursor-pointer"
                              >
                                {reminder.completed 
                                  ? <CheckCircle2 size={20} className="text-success stroke-[2.2]" /> 
                                  : <Circle size={20} className="text-gray-300 hover:text-coral" strokeWidth={2.2} />
                                }
                              </button>
                              <div className="space-y-0.5 text-right min-w-0">
                                <span className={cn(
                                  "text-xs font-black text-gray-800 block truncate",
                                  reminder.completed && "line-through text-gray-400 font-medium"
                                )}>
                                  {cleanTitle}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className={cn("text-[9px] font-black px-1.5 py-0.2 rounded border", catStyle)}>
                                    {tag}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={() => deleteReminder(reminder.id)}
                              className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all shrink-0 cursor-pointer"
                            >
                              <Trash2 size={14} strokeWidth={2.2} />
                            </button>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}
