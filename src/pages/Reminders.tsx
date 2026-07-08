import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Bell, Plus, Trash2, CheckCircle2, Circle, Calendar, Clock, Smile, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPersian, formatPersianDate } from '../lib/persian';
import { cn } from '../lib/utils';

export default function Reminders() {
  const profile = useAppStore(state => state.profile);
  const reminders = useAppStore(state => state.reminders);
  const addReminder = useAppStore(state => state.addReminder);
  const toggleReminder = useAppStore(state => state.toggleReminder);
  const deleteReminder = useAppStore(state => state.deleteReminder);

  const [title, setTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [category, setCategory] = useState('سلامت'); // سلامت، تغذیه، بازی، نظافت

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addReminder(`[${category}] ${title.trim()}`, new Date().toISOString());
    setTitle('');
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
            <Bell className="text-coral animate-swing" size={32} />
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-white border-coral-light/25 p-6 space-y-4 shadow-xl">
                  <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
                    <Clock size={18} className="text-coral" />
                    تعریف یادآور مراقبتی جدید
                  </h3>
                  <form onSubmit={handleAdd} className="space-y-4">
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick AI Advisor */}
          <Card glow glowColor="sunny" className="bg-gradient-to-br from-white to-sunny/5 border-sunny/20 p-6 space-y-4">
            <h3 className="font-black text-gray-800 text-base flex items-center gap-2">
              <Sparkles className="text-sunny animate-pulse" size={18} />
              پیشنهاد هوش مصنوعی پت میت
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed font-bold">
              با توجه به اینکه سن {profile.name} {toPersian(profile.age)} سال و نژاد آن {profile.breed || 'نامشخص'} است، هم‌اکنون به واکسن سه‌گانه سالانه یا بررسی دوره‌ای دندان نیاز دارد. یادآور‌های مربوطه را ثبت کنید تا سیستم به شما هشدار دهد.
            </p>
            <div className="pt-2 border-t border-gray-100/60 flex items-center justify-between text-[11px] text-sunny font-black">
              <span>آخرین پایش خودکار: امروز</span>
              <span>توصیه مراقبتی دوره‌ای</span>
            </div>
          </Card>

        </div>

        {/* Right Column: Reminders Checklist & Interactive Status (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-white border-coral-light/10 p-6 shadow-md min-h-[450px] flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
                  <Calendar size={20} className="text-coral" />
                  برنامه زمان‌بندی و پایش یادآورها
                </h3>
                <span className="bg-coral/5 text-coral-deep text-xs font-black px-3 py-1.5 rounded-full">
                  تعداد کل: {toPersian(reminders.length)} برنامه
                </span>
              </div>

              {reminders.length === 0 ? (
                <div className="text-center py-20 bg-peach/5 rounded-3xl border border-dashed border-coral-light/20 flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-peach flex items-center justify-center text-coral-light">
                    <Bell size={28} />
                  </div>
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
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          className={cn(
                            "flex items-center justify-between gap-4 p-4 rounded-2xl border transition-all duration-300",
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
                              <div className="flex items-center gap-2">
                                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border", catStyle)}>
                                  {tag}
                                </span>
                                <span className="text-[10px] text-gray-400 font-bold">
                                  ثبت شده در: {formatPersianDate(reminder.date)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => deleteReminder(reminder.id)}
                            className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all cursor-pointer shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>
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
