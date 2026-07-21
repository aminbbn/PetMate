import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserPlus, 
  FileText, 
  BellRing, 
  Activity, 
  BrainCircuit, 
  Sparkles,
  ArrowDown
} from 'lucide-react';

interface Stage {
  id: number;
  label: string;
  title: string;
  desc: string;
  icon: React.ComponentType<any>;
  illustrationEmoji: string;
  metric: string;
  metricLabel: string;
  colorClass: string;
  badgeBg: string;
}

export const WorkflowSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);

  const stages: Stage[] = [
    {
      id: 0,
      label: 'ساخت پروفایل',
      title: 'خوش‌آمدگویی هوشمند به دوست کوچک شما',
      desc: 'با وارد کردن نژاد، سن و اطلاعات اولیه، شناسنامه دیجیتال و بیومتریک پت شما فوراً تشکیل می‌شود و ریتم بیولوژیکی و نیازهای متناسب با سن او محاسبه می‌گردد.',
      icon: UserPlus,
      illustrationEmoji: '🐶',
      metric: '۱۰۰٪ تکمیل پرونده',
      metricLabel: 'وضعیت شناسنامه',
      colorClass: 'text-coral border-coral',
      badgeBg: 'bg-coral/10 text-coral'
    },
    {
      id: 1,
      label: 'ثبت سلامت',
      title: 'بایگانی و طبقه‌بندی آنلاین سوابق بهداشتی',
      desc: 'تک‌تک نسخه‌ها، عکس‌های آزمایشگاهی، سوابق حساسیت‌های غذایی و درمانی را بارگذاری کنید تا هوش مصنوعی پرونده‌ای پیوسته و بدون نقص زمان تشکیل دهد.',
      icon: FileText,
      illustrationEmoji: '📋',
      metric: '۲۷ سند ذخیره شده',
      metricLabel: 'اسناد بالینی',
      colorClass: 'text-sunny-deep border-sunny',
      badgeBg: 'bg-sunny/10 text-sunny-deep'
    },
    {
      id: 2,
      label: 'یادآورها',
      title: 'کالیبراسیون اعلان‌ها و مانیتورینگ زمانی',
      desc: 'سیستم، زمان‌های دقیق واکسن‌های سالانه، داروهای دوره‌ای، قرص‌های انگل، نظافت، ویزیت‌های دوره‌ای را بر اساس سن پت زمان‌بندی کرده و سر موقع هشدار می‌دهد.',
      icon: BellRing,
      illustrationEmoji: '⏰',
      metric: '۹۸٪ پایداری زمانی',
      metricLabel: 'نرخ موفقیت زمانی',
      colorClass: 'text-emerald-600 border-emerald-500',
      badgeBg: 'bg-emerald-500/10 text-emerald-600'
    },
    {
      id: 3,
      label: 'رشد و وزن',
      title: 'نمودارهای رشد داینامیک و مدیریت جثه',
      desc: 'با ثبت منظم وزن پت، توده بدنی او با جداول استاندارد جهانی نژادی مقایسه می‌شود تا در صورت انحراف از وزن ایده‌آل، هشدارهای تغذیه‌ای صادر گردد.',
      icon: Activity,
      illustrationEmoji: '⚖️',
      metric: '۲۸.۲ کیلوگرم',
      metricLabel: 'تراز توده بدنی',
      colorClass: 'text-blue border-blue',
      badgeBg: 'bg-blue/10 text-blue'
    },
    {
      id: 4,
      label: 'اقدام هوشمند',
      title: 'مداخله پزشکی و پاسخ هوش مربی',
      desc: 'در صورت هرگونه چالش رفتاری یا بدنی، مربی هوشمند و ابزار تریاژ پت میت اقدامات فوری و راه‌حل‌های علمی گام‌به‌گام را بدون اتلاف وقت به شما ارائه می‌دهند.',
      icon: BrainCircuit,
      illustrationEmoji: '🚀',
      metric: 'پاسخ زیر ۲ ثانیه',
      metricLabel: 'دستیار درمانی',
      colorClass: 'text-indigo-600 border-indigo-500',
      badgeBg: 'bg-indigo-500/10 text-indigo-600'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Calculate progress of scroll through this tall container (from 0 to 1)
      const scrolled = -rect.top;
      const maxScroll = containerHeight - windowHeight;
      const rawProgress = maxScroll > 0 ? scrolled / maxScroll : 0;
      const progress = Math.min(Math.max(rawProgress, 0), 1);

      setScrollProgress(progress);

      // Determine active stage index based on progress segment split
      const stageCount = stages.length;
      const rawIndex = Math.floor(progress * stageCount);
      const activeIdx = Math.min(Math.max(rawIndex, 0), stageCount - 1);
      
      setActiveStageIndex(activeIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    // Initial check
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleStageClick = (index: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerHeight = rect.height;
    const windowHeight = window.innerHeight;
    const maxScroll = containerHeight - windowHeight;

    // Calculate scroll target position to activate clicked stage
    const targetScrollY = window.scrollY + rect.top + (index / stages.length) * maxScroll;
    window.scrollTo({ top: targetScrollY + 50, behavior: 'smooth' });
  };

  const activeStage = stages[activeStageIndex];
  const ActiveIcon = activeStage.icon;

  return (
    <section 
      ref={containerRef} 
      id="workflow" 
      className="relative min-h-[220vh] bg-[#FFFDFB]" 
      dir="rtl"
    >
      {/* Sticky layout wrapper */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden py-16 md:py-24 px-6 md:px-12 z-10">
        
        {/* Soft Background Radial Decor elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-coral/5 rounded-full blur-[140px] pointer-events-none" />
        
        {/* HEADER */}
        <div className="max-w-7xl mx-auto w-full text-right space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-coral/5 border border-coral-light/10 text-coral font-bold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>مسیر ممتد پایش سلامتی حیوان خانگی</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
            چرخه‌ی مراقبت روزانه پت میت
          </h2>
          <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-xl font-normal">
            با حرکت به پایین، پایش مستمر روند رشد پت را در ۵ مرحله کلیدی و متصل به هم تجربه کنید؛ پت شما قدم به قدم با پایش هوشمند ما همراه می‌شود.
          </p>
        </div>

        {/* INTERACTIVE SCROLL-LINKED VISUAL CARE PATHWAY */}
        <div className="max-w-4xl mx-auto w-full my-8 relative z-10">
          
          {/* Background Connecting Axis Track */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
          
          {/* Active Progress colored track filler */}
          <div 
            className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-l from-coral via-sunny to-indigo-600 -translate-y-1/2 rounded-full origin-right transition-transform duration-150"
            style={{ 
              transform: `translateY(-50%) scaleX(${scrollProgress})`,
            }}
          />

          {/* Adorable Moving Pet Indicator (Pulsing Paw or Icon) */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 z-30 transition-all duration-150"
            style={{
              right: `calc(${scrollProgress * 100}% - 22px)`,
            }}
          >
            <motion.div 
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 rounded-full bg-coral text-white shadow-xl shadow-coral/30 flex items-center justify-center border-2 border-white cursor-grab transition-transform"
            >
              <span className="text-lg">🐾</span>
            </motion.div>
          </div>

          {/* Stepper Node Points representing stages */}
          <div className="relative flex items-center justify-between z-20">
            {stages.map((stage) => {
              const isPast = scrollProgress >= stage.id / (stages.length - 1) - 0.05;
              const isActive = activeStageIndex === stage.id;
              const NodeIcon = stage.icon;

              return (
                <button
                  key={stage.id}
                  onClick={() => handleStageClick(stage.id)}
                  className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
                >
                  <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-white text-coral border-coral scale-115 shadow-md shadow-coral/10'
                      : isPast
                      ? 'bg-coral text-white border-coral'
                      : 'bg-white text-gray-400 border-gray-200 group-hover:border-gray-300'
                  }`}>
                    <NodeIcon size={16} />
                  </div>
                  <span className={`text-[10px] md:text-xs font-black transition-colors ${
                    isActive ? 'text-coral' : isPast ? 'text-gray-800' : 'text-gray-400'
                  }`}>
                    {stage.label}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* STAGE DESCRIPTION WORKSPACE with AnimatePresence */}
        <div className="max-w-4xl mx-auto w-full relative z-10 min-h-[220px] bg-white border border-coral-light/10 p-6 md:p-8 rounded-[36px] shadow-warm-lg flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStageIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center text-right"
            >
              {/* Icon/Emoji Stage Illustration (3 cols) */}
              <div className="md:col-span-3 flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-4 bg-coral/5 rounded-full blur-xl" />
                  <div className="w-24 h-24 rounded-[30px] bg-gray-50 border border-gray-100 flex items-center justify-center text-5xl shadow-warm-sm relative z-10">
                    {activeStage.illustrationEmoji}
                  </div>
                </div>
              </div>

              {/* Explainer Texts (6 cols) */}
              <div className="md:col-span-6 space-y-3">
                <span className={`text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase ${activeStage.badgeBg}`}>
                  فاز {activeStage.id + 1} • {activeStage.label}
                </span>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                  {activeStage.title}
                </h3>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-normal">
                  {activeStage.desc}
                </p>
              </div>

              {/* Live Metric Stats box (3 cols) */}
              <div className="md:col-span-3 bg-gray-50 border border-gray-100 p-4.5 rounded-2xl text-center space-y-1 shadow-inner">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">
                  {activeStage.metricLabel}
                </span>
                <div className={`text-xl font-sans font-black ${activeStage.colorClass.split(' ')[0]}`}>
                  {activeStage.metric}
                </div>
                <span className="block text-[8px] font-bold text-gray-400">ثبت در سیستم پت میت</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Small scroll feedback */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-400 border-t border-gray-50 pt-4.5 mt-4.5">
            <ArrowDown size={14} className="text-coral" />
            <span>به پائین کشیدن ادامه دهید تا مراحل تغییر کنند</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WorkflowSection;
