import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Home, Calendar, Stethoscope, LineChart, Map, Phone, 
  ShoppingBag, Bot, Utensils, Smile, Award, Trash2, Heart, Sparkles 
} from 'lucide-react';
import { cn } from './lib/utils';
import { useAppStore } from './store';
import { motion, AnimatePresence } from 'motion/react';
import { toPersian } from './lib/persian';

// Pages
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import HealthRecord from './pages/HealthRecord';
import Triage from './pages/Triage';
import Growth from './pages/Growth';
import Reminders from './pages/Reminders';
import Coach from './pages/Coach';
import Navigator from './pages/Navigator';
import Vets from './pages/Vets';
import Shop from './pages/Shop';
import Nutrition from './pages/Nutrition';
import Translator from './pages/Translator';

function Sidebar() {
  const location = useLocation();
  const profile = useAppStore(state => state.profile);
  
  const handleReset = () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید اطلاعات برنامه را پاک کنید؟')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const mainGroup = [
    { icon: Home, path: '/', label: 'خانه' }
  ];

  const dailyGroup = [
    { icon: Calendar, path: '/reminders', label: 'یادآورها و برنامه‌ها' },
    { icon: Stethoscope, path: '/health', label: 'پرونده سلامت' },
    { icon: LineChart, path: '/growth', label: 'رشد حیوان' }
  ];

  const servicesGroup = [
    { icon: Map, path: '/navigator', label: 'مسیریاب خدمات' },
    { icon: Phone, path: '/vets', label: 'دامپزشکان من' },
    { icon: ShoppingBag, path: '/shop', label: 'فروشگاه هوشمند' }
  ];

  const aiGroup = [
    { icon: Bot, path: '/triage', label: 'دستیار هوشمند', isAi: true },
    { icon: Utensils, path: '/nutrition', label: 'تغذیه و رژیم غذایی', isAi: true },
    { icon: Smile, path: '/translator', label: 'مترجم رفتار', isAi: true },
    { icon: Award, path: '/coach', label: 'مربی تمرین هوشمند', isAi: true }
  ];

  const renderItem = (item: any) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    if (item.isAi) {
      return (
        <Link key={item.path} to={item.path} className="block">
          <motion.div
            whileHover={{ scale: 1.02, x: -3 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center justify-between px-4 py-2.5 rounded-xl font-bold transition-all duration-200 cursor-pointer relative overflow-hidden border group",
              isActive 
                ? "bg-gradient-to-r from-sunny/10 via-coral-light/5 to-white text-coral-deep border-sunny shadow-sm" 
                : "bg-white border-transparent text-gray-500 hover:bg-sunny/5 hover:text-gray-800"
            )}
          >
            {/* Subtle warm hover glow overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(232,90,93,0.05),transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />
            
            <div className="flex items-center gap-3 relative z-10">
              <Icon size={18} className={isActive ? "text-sunny" : "text-gray-400"} strokeWidth={2.5} />
              <span className="text-xs">{item.label}</span>
            </div>
            <span className="bg-sunny/20 text-sunny-deep text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider shrink-0 scale-90 relative z-10">
              AI
            </span>
          </motion.div>
        </Link>
      );
    }

    return (
      <Link key={item.path} to={item.path} className="block">
        <motion.div
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition-all duration-200 cursor-pointer relative overflow-hidden border border-transparent group",
            isActive 
              ? "bg-coral/10 text-coral-deep border-r-4 border-coral font-black shadow-sm" 
              : "text-gray-500 hover:bg-peach/10 hover:text-gray-800"
          )}
        >
          {/* Subtle warm hover glow overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(232,90,93,0.05),transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />
          
          <Icon size={18} className={cn("relative z-10", isActive ? "text-coral" : "text-gray-400")} strokeWidth={2.5} />
          <span className="text-xs relative z-10">{item.label}</span>
        </motion.div>
      </Link>
    );
  };

  return (
    <aside className="w-80 h-screen bg-white border-l border-coral-light/20 flex flex-col justify-between p-6 shrink-0 z-40 sticky top-0 shadow-[4px_0_24px_rgba(232,90,93,0.01)]" dir="rtl">
      <div className="flex flex-col h-[calc(100vh-80px)]">
        {/* App Branding */}
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4 shrink-0">
          <div className="w-10 h-10 bg-coral rounded-xl flex items-center justify-center text-white shadow-md shadow-coral/20 shrink-0">
            <Heart size={20} fill="currentColor" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-black text-coral-deep tracking-tight">پت میت</h1>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">همراه هوشمند حیوان خانگی</p>
          </div>
        </div>

        {/* Scrollable Navigation Container */}
        <div className="flex-1 overflow-y-auto pr-1 pl-1 space-y-6">
          
          {/* Section 1: Main Section & Pet Profile */}
          <div className="space-y-4">
            {profile && (() => {
              const sanitizeName = (name: string) => {
                const trimmed = (name || '').trim();
                if (!trimmed || trimmed.toLowerCase() === 'a') return 'پشمک';
                return trimmed;
              };
              const sanitizeBreed = (breed: string) => {
                const trimmed = (breed || '').trim();
                if (!trimmed || trimmed.toLowerCase() === 'a') return 'نژاد ترکیبی';
                return trimmed;
              };
              const petName = sanitizeName(profile.name);
              const petBreed = sanitizeBreed(profile.breed);

              return (
                <div className="bg-gradient-to-br from-peach/30 via-white to-coral/5 rounded-2xl p-4 border border-coral-light/10 relative overflow-hidden shadow-sm">
                  <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-coral/10 rounded-full blur-lg" />
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-sunny/20 to-coral/20 rounded-xl shadow-inner flex items-center justify-center text-2xl transform hover:scale-105 transition-transform duration-300">
                      {profile.type === 'dog' ? '🐶' : '🐱'}
                    </div>
                    <div className="space-y-0.5 text-right">
                      <h3 className="font-black text-gray-800 text-sm">{petName}</h3>
                      <p className="text-[10px] text-gray-400 font-bold">{petBreed}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-coral-light/10 grid grid-cols-2 gap-1 text-center text-[10px] font-bold text-gray-500">
                    <div className="bg-white/50 py-1.5 rounded-lg border border-coral-light/5">
                      <span className="block text-[8px] text-gray-400">سن</span>
                      <span className="font-black text-gray-700">{toPersian(profile.age)} سال</span>
                    </div>
                    <div className="bg-white/50 py-1.5 rounded-lg border border-coral-light/5">
                      <span className="block text-[8px] text-gray-400">وزن</span>
                      <span className="font-black text-gray-700">{toPersian(profile.weight)} کیلوگرم</span>
                    </div>
                  </div>
                </div>
              );
            })()}
            <div className="space-y-1">
              {mainGroup.map(renderItem)}
            </div>
          </div>

          {/* Section 2: Daily Tools */}
          <div className="space-y-1.5">
            <span className="text-[9px] text-gray-400 font-bold px-3 uppercase tracking-wider block text-right">ابزارهای روزمره</span>
            <div className="space-y-1">
              {dailyGroup.map(renderItem)}
            </div>
          </div>

          {/* Section 3: Guide & Services */}
          <div className="space-y-1.5">
            <span className="text-[9px] text-gray-400 font-bold px-3 uppercase tracking-wider block text-right">هدایت و خدمات</span>
            <div className="space-y-1">
              {servicesGroup.map(renderItem)}
            </div>
          </div>

          {/* Section 4: AI Tools (visually highlighted) */}
          <div className="space-y-1.5 bg-sunny/5 p-2 rounded-2xl border border-sunny/20 shadow-sm relative overflow-hidden">
            <div className="absolute -left-8 -top-8 w-16 h-16 bg-sunny/10 rounded-full blur-xl pointer-events-none" />
            <span className="text-[9px] text-sunny-deep font-black px-2 uppercase tracking-wider block text-right flex items-center gap-1">
              <Sparkles size={10} className="animate-pulse" />
              ابزارهای هوش مصنوعی (AI)
            </span>
            <div className="space-y-1 pt-1">
              {aiGroup.map(renderItem)}
            </div>
          </div>

        </div>
      </div>

      {/* Reset Program button at bottom */}
      <div className="pt-3 border-t border-gray-100 shrink-0">
        <button 
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-[10px] font-bold text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
        >
          <Trash2 size={13} strokeWidth={2.5} />
          <span>حذف اطلاعات و تنظیم مجدد</span>
        </button>
      </div>
    </aside>
  );
}

function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-[#FFFDFB] flex font-sans text-gray-800" dir="rtl">
      {/* Sidebar on Right side in RTL (using border-l) */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen bg-gradient-to-b from-[#FFFDFB] via-[#FFFBF9] to-[#FFF7F4] flex flex-col relative overflow-x-hidden">
        {/* Warm ambient background glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-coral-light rounded-full blur-[120px] pointer-events-none" style={{ opacity: 0.03 }} />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-sunny rounded-full blur-[100px] pointer-events-none" style={{ opacity: 0.03 }} />
        
        <div className="flex-1 flex flex-col relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="flex-1 flex flex-col"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function AppContent() {
  const profile = useAppStore(state => state.profile);

  if (!profile) {
    return <Onboarding />;
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/health" element={<HealthRecord />} />
        <Route path="/growth" element={<Growth />} />
        <Route path="/triage" element={<Triage />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/coach" element={<Coach />} />
        <Route path="/navigator" element={<Navigator />} />
        <Route path="/vets" element={<Vets />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/translator" element={<Translator />} />
      </Routes>
    </MainLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
