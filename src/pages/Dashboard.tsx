import React, { useState } from 'react';
import { useAppStore, PetProfile, PetType, Reminder } from '../store';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { AnimatedCardIcon } from '../components/AnimatedCardIcon';
import { MetricCard } from '../components/metric/MetricCard';
import { MetricCardGrid } from '../components/metric/MetricCardGrid';
import { MotionPage, MotionDialog } from '../motion';
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
  ArrowUpRight,
  Scale,
  Stethoscope,
  Clock,
  Heart,
  Check,
  X,
  AlertTriangle,
  Smile
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPersian, formatPersianDate } from '../lib/persian';
import { cn } from '../lib/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const profile = useAppStore(state => state.profile);
  const pets = useAppStore(state => state.pets || []);
  const selectedPetId = useAppStore(state => state.selectedPetId);
  const setSelectedPetId = useAppStore(state => state.setSelectedPetId);
  const addPet = useAppStore(state => state.addPet);

  const reminders = useAppStore(state => state.reminders || []);
  const toggleReminder = useAppStore(state => state.toggleReminder);
  const deleteReminder = useAppStore(state => state.deleteReminder);
  const addReminder = useAppStore(state => state.addReminder);
  const weightHistory = useAppStore(state => state.weightHistory || []);
  const healthRecords = useAppStore(state => state.healthRecords || []);
  const addWeightEntry = useAppStore(state => state.addWeightEntry);

  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetType, setNewPetType] = useState<PetType>('dog');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState('');
  const [newPetWeight, setNewPetWeight] = useState('');

  // Weight entry form inside the widget if weight empty
  const [quickWeight, setQuickWeight] = useState('');

  // Fallback / multi-pet normalization
  const activePets = pets.length > 0 ? pets : (profile ? [profile] : []);
  const currentPet = activePets.find(p => p.id === selectedPetId) || activePets[0];

  // Sync selectedPetId if none set
  React.useEffect(() => {
    if (activePets.length > 0 && !selectedPetId) {
      setSelectedPetId(activePets[0].id);
    }
  }, [activePets, selectedPetId, setSelectedPetId]);

  if (!currentPet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#FFFDFB] to-[#FFF3EE]" dir="rtl">
        <Heart className="text-coral animate-pulse mb-4" size={50} />
        <h2 className="text-2xl font-black text-gray-800">به پت‌میت خوش آمدید! 🐾</h2>
        <p className="text-gray-500 mt-2">لطفاً برای شروع یک پروفایل برای حیوان خانگی خود بسازید.</p>
        <button
          onClick={() => setShowAddPetModal(true)}
          className="mt-6 px-6 py-3 bg-coral hover:bg-coral-deep text-white font-bold rounded-2xl shadow-lg shadow-coral/20 cursor-pointer"
        >
          ایجاد اولین پروفایل مراقبت
        </button>
        {renderAddPetModal()}
      </div>
    );
  }

  // 1. DATA FILTERING FOR SELECTED PET
  const petId = currentPet.id;
  
  const petReminders = reminders.filter(r => r.petId === petId || (!r.petId && petId === profile?.id));
  const petWeightHistory = weightHistory.filter(h => h.petId === petId || (!h.petId && petId === profile?.id));
  const petHealthRecords = healthRecords.filter(r => r.petId === petId || (!r.petId && petId === profile?.id));

  // Determine date helper
  const now = new Date();
  const isToday = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    return d.getFullYear() === today.getFullYear() &&
           d.getMonth() === today.getMonth() &&
           d.getDate() === today.getDate();
  };

  // 2. DAILY BRIEF CARD DETERMINISTIC STATE
  const overdueReminders = petReminders.filter(r => !r.completed && new Date(r.dueAt) < now);
  const todayReminders = petReminders.filter(r => isToday(r.dueAt));
  const incompleteTodayReminders = todayReminders.filter(r => !r.completed);

  let briefState: 'overdue' | 'today' | 'safe' | 'empty' = 'empty';
  let briefTitle = '';
  let briefDesc = '';
  let briefColor = '';
  let briefIcon: React.ReactNode = null;
  let briefActionText = '';
  let briefActionPath = '/reminders';

  if (overdueReminders.length > 0) {
    briefState = 'overdue';
    briefTitle = 'برنامه‌های عقب‌افتاده نیاز به پیگیری دارد';
    briefDesc = `توجه: برنامه مراقبتی از زمان تعیین‌شده گذشته است. لطفاً وضعیت [${overdueReminders[0].title}] را بررسی کنید.`;
    briefColor = 'from-red-50 to-rose-100/40 border-rose-200 text-rose-950';
    briefIcon = <AnimatedCardIcon variant="alert" tone="coral" size="md" />;
    briefActionText = 'انجام برنامه‌ها';
  } else if (incompleteTodayReminders.length > 0) {
    briefState = 'today';
    briefTitle = `کارهای امروز ${currentPet.name}`;
    briefDesc = `برنامه امروز: ${currentPet.name} امروز ${toPersian(incompleteTodayReminders.length)} کار ناتمام دارد. برای حفظ سلامتی او، آنها را به موقع انجام دهید.`;
    briefColor = 'from-sunny/5 to-sunny/15 border-sunny/20 text-amber-950';
    briefIcon = <AnimatedCardIcon variant="clock" tone="sunny" size="md" />;
    briefActionText = 'بررسی کارهای امروز';
  } else if (todayReminders.length > 0) {
    briefState = 'safe';
    briefTitle = 'همه چیز مرتب و عالی است!';
    briefDesc = `همه چیز مرتب است! تمام کارهای امروز برای ${currentPet.name} با موفقیت ثبت و انجام شده‌اند.`;
    briefColor = 'from-emerald-50 to-emerald-100/40 border-emerald-200 text-emerald-950';
    briefIcon = <AnimatedCardIcon variant="success" tone="mint" size="md" />;
    briefActionText = 'نمایش تقویم مراقبت';
  } else {
    briefState = 'empty';
    briefTitle = 'روز بدون برنامه مراقبتی';
    briefDesc = 'برنامه‌ای برای امروز ثبت نشده است. می‌توانید یک کار مراقبتی یا یادآور به تقویم اضافه کنید.';
    briefColor = 'from-gray-50 to-slate-100/50 border-gray-200 text-slate-800';
    briefIcon = <AnimatedCardIcon variant="calendar" tone="neutral" size="md" />;
    briefActionText = 'افزودن یادآور جدید';
  }

  // 3. CARE SNAPSHOT METRICS (4 CARDS)
  // Metrics: Today remaining, Overdue count, Last registered weight, Last health visit reason
  const todayRemainingCount = incompleteTodayReminders.length;
  const overdueCount = overdueReminders.length;

  // Last Weight
  const lastWeightVal = petWeightHistory.length > 0 
    ? petWeightHistory[petWeightHistory.length - 1].weight 
    : currentPet.weight;
  const firstWeightVal = currentPet.weight;
  const weightDiff = lastWeightVal - firstWeightVal;
  const weightChangeText = petWeightHistory.length > 0
    ? (weightDiff > 0 ? `+${toPersian(weightDiff.toFixed(1))} ک‌گ` : weightDiff < 0 ? `${toPersian(weightDiff.toFixed(1))} ک‌گ` : 'بدون تغییر')
    : 'وزن اولیه ثبت';

  // Last Medical Record
  const sortedMedical = [...petHealthRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const lastRecord = sortedMedical[0];
  const lastRecordText = lastRecord ? lastRecord.reason : 'ثبت نشده';
  const lastRecordTime = lastRecord ? getRecordTimeDiff(lastRecord.date) : 'بدون پرونده';

  function getRecordTimeDiff(dateStr: string) {
    const elapsed = new Date().getTime() - new Date(dateStr).getTime();
    const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'امروز';
    if (days === 1) return 'دیروز';
    return `${toPersian(days)} روز پیش`;
  }

  // 4. CHART DATA PREPARATION
  const chartData = [
    { date: 'شروع', weight: currentPet.weight, dateFull: 'وزن ثبت‌شده اولیه' },
    ...petWeightHistory.map(h => ({
      date: formatPersianDate(h.date).split(' ')[1] || 'ثبت',
      dateFull: formatPersianDate(h.date),
      weight: h.weight
    }))
  ];

  const handleAddPetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName.trim()) return;

    const newPet: PetProfile = {
      id: crypto.randomUUID(),
      name: newPetName.trim(),
      type: newPetType,
      breed: newPetBreed.trim() || 'نژاد ترکیبی',
      age: Number(newPetAge) || 1,
      weight: Number(newPetWeight) || 5,
    };

    addPet(newPet);
    setSelectedPetId(newPet.id);
    
    // Reset Form
    setNewPetName('');
    setNewPetType('dog');
    setNewPetBreed('');
    setNewPetAge('');
    setNewPetWeight('');
    setShowAddPetModal(false);
  };

  const handleQuickWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickWeight) return;
    addWeightEntry({
      petId,
      date: new Date().toISOString(),
      weight: Number(quickWeight)
    });
    setQuickWeight('');
  };

  function renderAddPetModal() {
    return (
      <MotionDialog
        isOpen={showAddPetModal}
        onClose={() => setShowAddPetModal(false)}
        size="sm"
      >
        <div className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-50">
            <h3 className="font-black text-gray-800 text-lg">ثبت حیوان خانگی جدید</h3>
            <button 
              onClick={() => setShowAddPetModal(false)}
              className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleAddPetSubmit} className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-gray-500">نام پت</label>
              <input
                type="text"
                required
                value={newPetName}
                onChange={e => setNewPetName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200/60 rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:border-coral/50 transition-all font-semibold"
                placeholder="مثال: لئو"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-gray-500">گونه</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPetType('dog')}
                    className={`flex-1 py-2 rounded-xl border text-xs font-black cursor-pointer transition-all ${
                      newPetType === 'dog'
                        ? 'bg-coral text-white border-coral shadow-md shadow-coral/30'
                        : 'bg-peach/60 text-coral-deep border-coral-light/40 hover:bg-[#FFD4BA] hover:text-coral-deep hover:border-coral-light'
                    }`}
                  >
                    🐶 سگ
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPetType('cat')}
                    className={`flex-1 py-2 rounded-xl border text-xs font-black cursor-pointer transition-all ${
                      newPetType === 'cat'
                        ? 'bg-coral text-white border-coral shadow-md shadow-coral/30'
                        : 'bg-peach/60 text-coral-deep border-coral-light/40 hover:bg-[#FFD4BA] hover:text-coral-deep hover:border-coral-light'
                    }`}
                  >
                    🐱 گربه
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-gray-500">نژاد</label>
                <input
                  type="text"
                  value={newPetBreed}
                  onChange={e => setNewPetBreed(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200/60 rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:border-coral/50 transition-all font-semibold"
                  placeholder="هاسکی، بومی..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-gray-500">سن (سال)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newPetAge}
                  onChange={e => setNewPetAge(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200/60 rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:border-coral/50 transition-all font-semibold text-center"
                  placeholder="2"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-gray-500">وزن اولیه (ک‌گ)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.1"
                  value={newPetWeight}
                  onChange={e => setNewPetWeight(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200/60 rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:border-coral/50 transition-all font-semibold text-center"
                  placeholder="5.4"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAddPetModal(false)}
                className="flex-1 py-3 bg-peach hover:bg-[#FFD4BA] text-coral-deep font-bold rounded-xl cursor-pointer transition-all border border-coral-light/50 shadow-md shadow-coral/5"
              >
                انصراف
              </button>
              <Button
                type="submit"
                className="flex-1 py-3 font-bold justify-center"
              >
                ایجاد پروفایل
              </Button>
            </div>
          </form>
        </div>
      </MotionDialog>
    );
  }

  const dashboardMetrics = [
    {
      title: "برنامه‌های امروز",
      value: toPersian(todayRemainingCount),
      supportingText: "کار ناتمام",
      icon: Bell,
      iconVariant: "bell" as const,
      iconTone: "brand" as const,
    },
    {
      title: "زمان‌گذشته (عقب‌افتاده)",
      value: toPersian(overdueCount),
      supportingText: overdueCount > 0 ? "نیاز به توجه" : "موردی ثبت نشده",
      icon: AlertTriangle,
      iconVariant: "alert" as const,
      iconTone: "danger" as const,
      state: (overdueCount > 0 ? "attention" : "default") as any,
    },
    {
      title: "آخرین وزن ثبت شده",
      value: toPersian(lastWeightVal),
      unit: "کیلوگرم",
      supportingText: weightChangeText,
      icon: Scale,
      iconVariant: "weight" as const,
      iconTone: "warning" as const,
    },
    {
      title: "آخرین اقدام پزشکی",
      value: lastRecordText,
      supportingText: lastRecordTime,
      icon: Stethoscope,
      iconVariant: "stethoscope" as const,
      iconTone: "success" as const,
    },
  ];

  return (
    <MotionPage className="min-h-screen bg-gradient-to-br from-[#FFFDFB] via-[#FFF9F6] to-[#FFF3EE] bg-dot-grid p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full relative" dir="rtl">
      {/* Background radial soft glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-coral rounded-full blur-[140px] pointer-events-none z-0" style={{ opacity: 0.03 }} />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-sunny rounded-full blur-[120px] pointer-events-none z-0" style={{ opacity: 0.03 }} />

      {/* DASHBOARD HEADER */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-coral-light/10 relative z-10"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-peach to-coral-light/20 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-md">
            <span>{currentPet.type === 'dog' ? '🐶' : '🐱'}</span>
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">سلام، {currentPet.name}! 👋</h1>
            <p className="text-gray-400 font-bold text-xs mt-1">
              نژاد: {currentPet.breed} • سن: {toPersian(currentPet.age)} سال • امروز {formatPersianDate(new Date())}
            </p>
          </div>
        </div>

        {/* Dynamic Pet Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {activePets.map((pet) => {
            const isSelected = pet.id === selectedPetId;
            return (
              <button
                key={pet.id}
                onClick={() => setSelectedPetId(pet.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-black transition-all shrink-0 cursor-pointer relative",
                  isSelected
                    ? 'bg-coral border-coral text-white shadow-xl shadow-coral/35'
                    : 'bg-peach/70 border-coral-light/50 text-coral hover:bg-peach hover:border-coral-light/80 hover:text-coral-deep'
                )}
              >
                <span>{pet.type === 'dog' ? '🐶' : '🐱'}</span>
                <span>{pet.name}</span>
                {isSelected && <Check size={12} className="stroke-[3]" />}
              </button>
            );
          })}

          <button
            onClick={() => setShowAddPetModal(true)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-dashed border-gray-200 hover:border-coral/40 text-gray-400 hover:text-coral transition-all text-xs font-black shrink-0 cursor-pointer"
          >
            <Plus size={14} />
            <span>افزودن پت</span>
          </button>
        </div>
      </motion.header>

      {/* SECTION 1: DAILY BRIEF CARD (DYNAMIC DETERMINISTIC VIEW) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative z-10"
      >
        <Card className={cn("p-6 border rounded-3xl relative overflow-hidden bg-gradient-to-l", briefColor)} hoverEffect={false}>
          {/* Subtle decoration vector */}
          <div className="absolute top-1/2 left-8 -translate-y-1/2 w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="shrink-0 mt-1 sm:mt-0">
                {briefIcon}
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-black">{briefTitle}</h2>
                <p className="text-sm font-semibold opacity-90 leading-relaxed">{briefDesc}</p>
              </div>
            </div>

            <Link to={briefActionPath} className="shrink-0">
              <Button variant={briefState === 'overdue' ? 'primary' : 'secondary'} className="px-5 py-3 text-xs font-black shadow-sm">
                {briefActionText}
                <ArrowUpRight size={14} className="mr-1" />
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>

      {/* SECTION 2: CARE SNAPSHOT METRIC GRID (4 CARDS) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative z-10 w-full"
      >
        <MetricCardGrid>
          {dashboardMetrics.map((metric, idx) => (
            <MetricCard
              key={idx}
              title={metric.title}
              value={metric.value}
              unit={'unit' in metric ? metric.unit : undefined}
              supportingText={metric.supportingText}
              icon={metric.icon}
              iconVariant={metric.iconVariant}
              iconTone={metric.iconTone}
              state={'state' in metric ? metric.state : undefined}
            />
          ))}
        </MetricCardGrid>
      </motion.div>

      {/* SECTION 3: BENTO WIDGETS (TODAY REMINDERS, WEIGHT CHART, RECENT MEDICAL LOGS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* RIGHT COLUMN: Weight Trend & Health Logs Bento Subgrid (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Bento Sub-grid: Weight Chart vs Recent Health Logs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch flex-1">
            
            {/* Weight Trend Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="h-full"
            >
              <Card className="bg-white p-6 shadow-sm border border-gray-100 h-full flex flex-col justify-between group" hoverEffect={true}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-black text-gray-800 flex items-center gap-2">
                      <AnimatedCardIcon variant="trend" tone="sunny" size="sm" />
                      روند تغییرات وزن
                    </h3>
                    <Link to="/growth" className="text-gray-400 hover:text-coral text-xs font-bold flex items-center gap-0.5 group">
                      جزئیات ردیاب
                      <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                  <p className="text-xs text-gray-400 font-medium mb-4">نمودار پیشرفت تغییر وزن {currentPet.name}</p>
                </div>

                {petWeightHistory.length === 0 ? (
                  <div className="flex-1 py-6 bg-amber-50/25 rounded-2xl border border-dashed border-amber-200/60 flex flex-col items-center justify-center p-4">
                    <Scale className="text-sunny mb-2 animate-bounce" size={24} />
                    <p className="text-amber-900 text-xs font-black">هنوز وزن جدیدی ثبت نشده است.</p>
                    <p className="text-amber-700/80 text-[10px] text-center mt-1 leading-relaxed max-w-[200px]">
                      برای رسم دقیق نمودار تغییرات وزن، وزن کنونی پت را اضافه کنید.
                    </p>
                    <form onSubmit={handleQuickWeightSubmit} className="mt-4 flex gap-2 w-full max-w-[200px]">
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={quickWeight}
                        onChange={e => setQuickWeight(e.target.value)}
                        placeholder="ک‌گ"
                        className="w-20 bg-white border border-amber-200 rounded-xl px-2 py-1 text-xs text-center outline-none focus:ring-2 focus:ring-sunny/30 font-bold"
                      />
                      <button type="submit" className="flex-1 bg-sunny text-white hover:bg-sunny-deep text-[10px] font-black rounded-xl px-2 py-1 cursor-pointer">
                        ثبت سریع
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="dashboardWeightGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F9FAFB" />
                        <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#9CA3AF', fontWeight: 'bold' }} />
                        <YAxis tick={{ fontSize: 9, fill: '#9CA3AF', fontWeight: 'bold' }} domain={['dataMin - 1', 'dataMax + 1']} />
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
                        <Area type="monotone" dataKey="weight" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#dashboardWeightGlow)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Recent Medical Records Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="h-full"
            >
              <Card className="bg-white p-6 shadow-sm border border-gray-100 h-full flex flex-col justify-between group" hoverEffect={true}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-black text-gray-800 flex items-center gap-2">
                      <AnimatedCardIcon variant="document" tone="coral" size="sm" />
                      سوابق پزشکی اخیر
                    </h3>
                    <Link to="/health" className="text-gray-400 hover:text-coral text-xs font-bold flex items-center gap-0.5 group">
                      پرونده سلامت
                      <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                  <p className="text-xs text-gray-400 font-medium mb-4">آخرین ویزیت‌ها و اقدامات سلامت ثبت شده</p>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-44 pr-1 flex-1">
                  {petHealthRecords.length === 0 ? (
                    <div className="text-center py-6 bg-coral-light/5 rounded-2xl border border-dashed border-coral-light/20 flex flex-col items-center justify-center h-full">
                      <Activity className="text-coral-light/50 mb-2 animate-pulse" size={24} />
                      <p className="text-coral-deep text-xs font-bold">هیچ سابقه پزشکی ثبت نشده است.</p>
                      <Link to="/health" className="mt-3">
                        <Button variant="secondary" size="sm" className="py-1 px-3 text-[10px] h-auto font-black">
                          ثبت سابقه سلامت
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    sortedMedical.slice(0, 3).map(record => (
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
            </motion.div>

          </div>

        </div>

        {/* LEFT COLUMN: Today Reminders Widget Card (4 cols) */}
        <div className="lg:col-span-4 h-full flex">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full"
          >
            <Card className="bg-white shadow-sm border border-gray-100 p-6 rounded-3xl flex flex-col justify-between w-full h-full group" hoverEffect={true}>
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                    <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                      <AnimatedCardIcon variant="bell" tone="sunny" size="sm" /> 
                      برنامه‌های امروز
                    </h2>
                    <Link to="/reminders" className="text-gray-400 hover:text-coral text-xs font-bold flex items-center gap-0.5">
                      صفحه برنامه‌ها
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>

                  {/* Today Reminders List */}
                  <div className="space-y-3 overflow-y-auto max-h-[350px] pr-1">
                    {todayReminders.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center">
                        <Smile className="text-sunny/60 mb-2 stroke-[1.5]" size={36} />
                        <p className="text-gray-400 text-xs font-black">امروز هیچ برنامه‌ای ندارید.</p>
                        <p className="text-gray-400/80 text-[10px] mt-1">یک روز آرام برای حیوان دلبندتان!</p>
                        <Link to="/reminders" className="mt-4">
                          <Button variant="secondary" size="sm" className="py-1 px-3 text-[10px] h-auto font-black">
                            برنامه‌ریزی جدید
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <AnimatePresence initial={false}>
                        {todayReminders.map(reminder => {
                          const categoryColors: Record<string, string> = {
                            'health': 'bg-coral/10 text-coral border-coral/20',
                            'nutrition': 'bg-sunny/15 text-sunny border-sunny/25',
                            'grooming': 'bg-blue-50 text-blue-500 border-blue-100',
                            'activity': 'bg-mint/15 text-mint border-mint/25',
                            'appointment': 'bg-purple-50 text-purple-600 border-purple-100',
                            'medication': 'bg-teal-50 text-teal-600 border-teal-100',
                          };

                          const catNames: Record<string, string> = {
                            'health': 'سلامت',
                            'nutrition': 'تغذیه',
                            'grooming': 'نظافت',
                            'activity': 'بازی',
                            'appointment': 'ویزیت',
                            'medication': 'دارو',
                            'other': 'مراقبت'
                          };

                          const catStyle = categoryColors[reminder.category] || 'bg-gray-50 text-gray-500 border-gray-100';
                          const catLabel = catNames[reminder.category] || 'مراقبت';

                          return (
                            <motion.div 
                              key={reminder.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className={cn(
                                "flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all",
                                reminder.completed 
                                  ? "bg-gray-50/50 border-gray-100 opacity-60" 
                                  : "bg-white border-slate-100 hover:border-coral-light/20"
                              )}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <button 
                                  onClick={() => toggleReminder(reminder.id)}
                                  className="text-coral hover:scale-110 transition-transform shrink-0 cursor-pointer"
                                >
                                  {reminder.completed 
                                    ? <CheckCircle2 size={18} className="text-success stroke-[2.2]" /> 
                                    : <Circle size={18} className="text-gray-300 hover:text-coral" strokeWidth={2.2} />
                                  }
                                </button>
                                <div className="space-y-0.5 text-right min-w-0">
                                  <span className={cn(
                                    "text-xs font-black text-gray-800 block truncate",
                                    reminder.completed && "line-through text-gray-400 font-medium"
                                  )}>
                                    {reminder.title}
                                  </span>
                                  <span className={cn("inline-block text-[8px] font-black px-1.5 py-0.2 rounded border", catStyle)}>
                                    {catLabel}
                                  </span>
                                </div>
                              </div>
                              <button 
                                onClick={() => deleteReminder(reminder.id)}
                                className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1 rounded-lg transition-all shrink-0 cursor-pointer"
                              >
                                <Trash2 size={12} strokeWidth={2.2} />
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
          </motion.div>
        </div>

      </div>

      {renderAddPetModal()}
    </MotionPage>
  );
}
