import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Clock, 
  Scale, 
  Sparkles, 
  Check, 
  Compass, 
  ShieldCheck, 
  Activity, 
  MapPin, 
  BrainCircuit,
  ArrowDown
} from 'lucide-react';

interface FeatureItem {
  id: string;
  badge: string;
  title: string;
  desc: string;
  benefits: string[];
  color: string;
  accentBg: string;
}

export const CapabilitiesSection: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('health');
  
  // Create refs to track which features are in the viewport center
  const featureRefs = {
    health: useRef<HTMLDivElement>(null),
    reminders: useRef<HTMLDivElement>(null),
    growth: useRef<HTMLDivElement>(null),
    ai: useRef<HTMLDivElement>(null),
    services: useRef<HTMLDivElement>(null),
  };

  const features: FeatureItem[] = [
    {
      id: 'health',
      badge: 'امنیت بالینی حیوان شما',
      title: 'پرونده سلامت هوشمند و پاسپورت الکترونیک',
      desc: 'پرونده پزشکی آنلاین پت شما، تمام سابقه‌ی عمل‌های جراحی، آزمایش‌های خون، نسخه‌ها و دوره‌های درمانی را به صورت یکپارچه و به ترتیب زمان نگهداری می‌کند.',
      benefits: [
        'ثبت خودکار گزارش‌های معاینات دامپزشکی',
        'ذخیره تصاویر آزمایش‌ها و مدارک بالینی',
        'پیش‌بینی چکاپ‌های بعدی بر اساس سن و نژاد'
      ],
      color: 'text-coral',
      accentBg: 'bg-coral/5'
    },
    {
      id: 'reminders',
      badge: 'دقت بی‌نقص زمانی',
      title: 'یادآورهای پیشرفته دارویی و بهداشتی',
      desc: 'دیگر نگران فراموش کردن واکسیناسیون، مصرف قرص‌های ضد انگل، زمان عقیم‌سازی یا زمان شستشوی دوره‌ای حیوان خود نباشید.',
      benefits: [
        'یادآوری پیامکی و نوتیفیکیشن هوشمند بدون تاخیر',
        'قابلیت تکرار دوره‌ای متناسب با دوره‌های دارویی',
        'همگام‌سازی مستقیم با تقویم گوشی و دسکتاپ'
      ],
      color: 'text-sunny-deep',
      accentBg: 'bg-sunny/5'
    },
    {
      id: 'growth',
      badge: 'تغییرات بیولوژیکی ایده‌آل',
      title: 'نمودارهای رشد پویا و پایش دقیق وزن',
      desc: 'کنترل دائم وزن پت و مقایسه هوشمند آن با استانداردهای نژادی، از بروز پیری زودرس مفاصل، دیابت و سایر بیماری‌های مرتبط با تغذیه جلوگیری می‌کند.',
      benefits: [
        'سیستم پایش توده بدنی متناسب با نمودار رشد استاندارد',
        'محاسبه روزانه تغییرات و هشدارهای انحراف از مرز طلایی',
        'پیشنهاد خودکار تنظیم حجم جیره غذایی متناسب با وزن'
      ],
      color: 'text-emerald-600',
      accentBg: 'bg-emerald-500/5'
    },
    {
      id: 'ai',
      badge: 'هوش محاسباتی کارآمد',
      title: 'دستیار خودکار هوش مصنوعی و تریاژ',
      desc: 'با قدرت گرفتن از مدل‌های تخصصی پزشکی حیوانات، نشانه‌های مبهم ظاهری یا بی‌حالی پت را توصیف کنید تا سطح اورژانسی بودن و توصیه‌های فوری را دریافت کنید.',
      benefits: [
        'تریاژ اورژانسی اولیه پیش از کلینیک دامپزشکی',
        'مهندسی اختصاصی کالری و جایگزین‌های حساسیت پوستی',
        'آنالیز تصویری علائم و رفتارشناسی پیشرفته زبان بدن'
      ],
      color: 'text-indigo-600',
      accentBg: 'bg-indigo-500/5'
    },
    {
      id: 'services',
      badge: 'خدمات شهری در دسترس',
      title: 'شبکه یکپارچه خدمات و مراکز نزدیک',
      desc: 'پت‌شاپ‌ها، دامپزشکی‌های اورژانسی فعال و آرایشگاه‌های معتبر محله خود را فوراً روی رادار هوشمند پت میت مشاهده و مسیریابی کنید.',
      benefits: [
        'دسترسی شبانه‌روزی به شماره‌ها و آدرس‌های مراکز برتر',
        'امتیازدهی و نظرات شفاف و بدون فیلتر سرپرستان دیگر',
        'تایید مستقیم صلاحیت مراکز توسط نظام دامپزشکی'
      ],
      color: 'text-blue',
      accentBg: 'bg-blue/5'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      const centerLine = viewportHeight / 2;

      let closestId = 'health';
      let minDistance = Infinity;

      Object.entries(featureRefs).forEach(([id, ref]) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const itemCenter = rect.top + rect.height / 2;
          const distance = Math.abs(itemCenter - centerLine);
          
          if (distance < minDistance && rect.bottom > 100 && rect.top < viewportHeight - 100) {
            minDistance = distance;
            closestId = id;
          }
        }
      });

      setActiveId(closestId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once initially
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const ref = featureRefs[id as keyof typeof featureRefs];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Render the dynamic content inside the morphing sticky stage
  const renderStickyStageContent = () => {
    switch (activeId) {
      case 'health':
        return (
          <motion.div
            key="stage-health"
            initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.92, rotate: 2 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="w-full h-full flex flex-col justify-between p-7 text-right"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-sans font-black text-gray-400">سند تایید شده بالینی</span>
                </div>
                <span className="text-[10px] font-sans font-black text-coral bg-coral/5 px-2.5 py-1 rounded-lg">پاسپورت بهداشت</span>
              </div>

              {/* Patient Badge */}
              <div className="flex items-center gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                <span className="text-2xl">🐕</span>
                <div>
                  <h4 className="font-sans font-black text-xs text-gray-900">سگ خانگی: فیدو</h4>
                  <p className="text-[9px] font-bold text-gray-400">نژاد: گلدن رتریور (۳ ساله)</p>
                </div>
              </div>

              {/* Vaccine List item */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/[0.02] border border-emerald-500/10 text-xs">
                  <span className="font-bold text-gray-800">واکسن هاری سالانه</span>
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">تزریق شده</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                  <span className="font-bold text-gray-800">چندگانه دوره ای</span>
                  <span className="text-[9px] font-black text-coral bg-coral/5 px-2 py-0.5 rounded-md">موعد: هفته بعد</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-bold">
              <span>آخرین پایش: امروز ۱۲:۳۰</span>
              <span className="text-coral">دانلود پرونده کامل ←</span>
            </div>
          </motion.div>
        );

      case 'reminders':
        return (
          <motion.div
            key="stage-reminders"
            initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.92, rotate: 2 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="w-full h-full flex flex-col justify-between p-7 text-right"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-sunny" />
                  <span className="text-[10px] font-sans font-black text-gray-400">سیستم یادآوری فعال</span>
                </div>
                <span className="text-[10px] font-sans font-black text-sunny-deep bg-sunny/5 px-2.5 py-1 rounded-lg">زمان‌بندی دقیق</span>
              </div>

              {/* Huge digital clock graphic */}
              <div className="py-2 text-center bg-sunny/[0.02] border border-sunny/10 rounded-2xl">
                <div className="text-2xl font-sans font-black text-gray-800 tracking-wider">۱۰:۰۰ صبح</div>
                <p className="text-[10px] text-sunny-deep font-bold mt-1">زمان تجویز قرص پیشگیری</p>
              </div>

              {/* Alarm Card */}
              <div className="p-3.5 bg-white border border-gray-100 rounded-2xl flex items-center gap-3 shadow-warm-sm">
                <div className="w-8 h-8 rounded-xl bg-sunny/10 text-sunny-deep flex items-center justify-center">
                  <Clock size={16} />
                </div>
                <div className="text-right flex-1">
                  <h5 className="font-bold text-xs text-gray-900">مصرف قرص ضد انگل (میلبماکس)</h5>
                  <p className="text-[9px] text-gray-400 font-bold">تکرار هر ۳ ماه یک‌بار</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-bold">
              <span>تایید انجام شده؟</span>
              <span className="text-sunny-deep bg-sunny/5 px-2.5 py-1 rounded-lg">ثبت کار تمام شده ✓</span>
            </div>
          </motion.div>
        );

      case 'growth':
        return (
          <motion.div
            key="stage-growth"
            initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.92, rotate: 2 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="w-full h-full flex flex-col justify-between p-7 text-right"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-sans font-black text-gray-400">تطبیق فیزیکی بیولوژیک</span>
                </div>
                <span className="text-[10px] font-sans font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">پایش وزن و رشد</span>
              </div>

              {/* Massive current metric */}
              <div className="text-center space-y-1 py-3">
                <span className="text-[10px] font-black text-gray-400 uppercase">وزن فعلی فیدو</span>
                <h3 className="text-4xl font-sans font-black text-emerald-600">۲۸.۲ <span className="text-xs">کیلوگرم</span></h3>
                <span className="inline-block text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">کاملاً ایده‌آل</span>
              </div>

              {/* Custom SVG line mimicking a Growth Wave */}
              <div className="h-16 bg-gray-50 border border-gray-100 rounded-xl relative overflow-hidden p-2 flex items-end">
                <svg className="w-full h-full text-emerald-500/20" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <path d="M0,40 Q25,30 50,15 T100,5" stroke="currentColor" strokeWidth="2.5" fill="none" />
                  <path d="M0,40 Q25,30 50,15 T100,5 L100,40 L0,40 Z" fill="rgba(16,185,129,0.04)" />
                  <circle cx="50" cy="15" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                </svg>
                <div className="absolute top-1 right-2 text-[8px] font-black text-gray-400">رشد ایده آل نژادی</div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-bold">
              <span>درخواست رژیم جدید؟</span>
              <span className="text-emerald-600">محاسبه کالری روزانه ←</span>
            </div>
          </motion.div>
        );

      case 'ai':
        return (
          <motion.div
            key="stage-ai"
            initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.92, rotate: 2 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="w-full h-full flex flex-col justify-between p-7 text-right"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="text-[10px] font-sans font-black text-gray-400">مدل زبان بالینی فعال</span>
                </div>
                <span className="text-[10px] font-sans font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">هوش مصنوعی</span>
              </div>

              {/* Small simulated Chat bubble */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-gray-100 rounded-2xl rounded-tr-none text-gray-700">
                  <p className="font-medium text-[10px]">سرپرست پت:</p>
                  <p className="mt-0.5">پت من امروز صبح بی‌حال شده و لب به غذا نزده...</p>
                </div>
                <div className="p-2.5 bg-indigo-600 text-white rounded-2xl rounded-tl-none font-medium">
                  <div className="flex items-center gap-1.5 mb-1 text-[9px] text-indigo-100">
                    <BrainCircuit size={12} />
                    <span>پاسخ تریاژ هوشمند پت میت:</span>
                  </div>
                  <p className="leading-relaxed">امتناع از خوردن غذا همراه با بی‌حالی نشان‌دهنده تریاژ زرد (مراقبت خانگی دقیق) است. دمای لثه‌ها را بررسی کنید...</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-bold">
              <span>سیگنال: آنلاین</span>
              <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">تحلیل علائم حیاتی</span>
            </div>
          </motion.div>
        );

      case 'services':
        return (
          <motion.div
            key="stage-services"
            initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.92, rotate: 2 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="w-full h-full flex flex-col justify-between p-7 text-right"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue" />
                  <span className="text-[10px] font-sans font-black text-gray-400">سیستم رادار شهری</span>
                </div>
                <span className="text-[10px] font-sans font-black text-blue bg-blue/5 px-2.5 py-1 rounded-lg">خدمات محلی</span>
              </div>

              {/* Dynamic distance radar display */}
              <div className="relative h-24 bg-gray-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center border border-gray-800">
                <div className="absolute inset-0 bg-dot-grid opacity-10" />
                <div className="w-16 h-16 rounded-full border border-blue/20 absolute animate-ping" />
                <div className="w-8 h-8 rounded-full border border-blue/40 absolute" />
                
                <div className="relative z-10 text-center space-y-0.5">
                  <MapPin className="w-5 h-5 text-blue mx-auto" />
                  <span className="block text-[10px] font-black text-white">دامپزشکی شبانه‌روزی مهرگان</span>
                  <span className="block text-[8px] font-bold text-blue">فاصله: ۲۵۰ متر</span>
                </div>
              </div>

              {/* Nearby list item */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                <span className="font-bold text-gray-800">آرایشگاه تدی پلاس</span>
                <span className="text-[9px] font-bold text-gray-400">۱.۲ کیلومتر</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-bold">
              <span>تعداد کل مراکز محلی: ۲۷</span>
              <span className="text-blue">مسیریابی سریع ←</span>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="capabilities" className="relative py-28 bg-[#FFFDFB] overflow-hidden" dir="rtl">
      
      {/* Editorial Watermark Backdrop */}
      <div className="absolute top-12 left-12 text-9xl text-gray-50/70 font-black tracking-widest select-none pointer-events-none">
        MATE
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Modern Editorial Header */}
        <div className="text-right max-w-3xl space-y-5 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-2xl bg-coral/5 border border-coral-light/10 text-coral font-bold text-xs"
          >
            <ShieldCheck className="w-4 h-4 text-coral" />
            <span>یک اکوسیستم مدرن، بی‌نیاز از یادداشت‌های دستی</span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
            داستان مراقبت را از نو بنویسید
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl font-normal">
            پت میت ابزارهای سنتی مراقبت را در یک روایت ممتد، هوشمند و آرام کنار هم قرار می‌دهد تا شما کمتر دچار سردرگمی شوید و همواره نسبت به سلامت او خاطرجمع بمانید.
          </p>
        </div>

        {/* TWO-COLUMN SCROLL NARRATIVE WORK */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start relative">
          
          {/* LEFT COLUMN: STICKY VISUAL STAGE (Moves with scroll, takes 5 cols) */}
          <div className="lg:col-span-5 sticky top-28 hidden lg:block z-20">
            <div className="relative p-1 bg-gradient-to-tr from-coral/15 via-sunny/10 to-transparent rounded-[36px]">
              <div className="bg-white border border-gray-100 rounded-[34px] min-h-[380px] shadow-warm-lg overflow-hidden flex items-stretch">
                
                {/* Background layout details inside visual stage */}
                <div className="absolute inset-0 bg-dot-grid opacity-[0.2] pointer-events-none" />
                <div className="absolute top-[-5%] left-[-10%] w-48 h-48 bg-coral/5 rounded-full blur-2xl" />
                <div className="absolute bottom-[-10%] right-[-5%] w-44 h-44 bg-sunny/5 rounded-full blur-2xl" />

                <AnimatePresence mode="wait">
                  {renderStickyStageContent()}
                </AnimatePresence>
              </div>
            </div>

            {/* Quick interactive shortcut nodes representing the 5 capabilities below the stage */}
            <div className="flex justify-center items-center gap-2 mt-6">
              {features.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      isActive ? 'w-8 bg-coral' : 'w-2.5 bg-gray-200 hover:bg-gray-300'
                    }`}
                    title={item.title}
                  />
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: LONG TEXTUAL SEQUENCE (Scroll triggers, takes 7 cols) */}
          <div className="lg:col-span-7 space-y-16 lg:space-y-28 pb-12">
            {features.map((item) => {
              const isActive = activeId === item.id;

              return (
                <div
                  key={item.id}
                  ref={featureRefs[item.id as keyof typeof featureRefs]}
                  className="transition-all duration-500 relative scroll-mt-24 text-right"
                >
                  {/* Small pointer indicator only visible on active card */}
                  <div className="absolute right-[-24px] top-4 hidden lg:flex items-center justify-center">
                    <motion.div
                      animate={isActive ? { scale: 1.15, opacity: 1 } : { scale: 0.8, opacity: 0.35 }}
                      className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-md ${
                        isActive ? 'bg-coral' : 'bg-gray-300'
                      }`}
                    />
                  </div>

                  {/* Feature card narrative */}
                  <motion.div
                    animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0.45, x: 5 }}
                    transition={{ duration: 0.4 }}
                    className={`p-6 md:p-8 rounded-[32px] border transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? 'bg-white border-coral-light/20 shadow-warm-md' 
                        : 'bg-transparent border-transparent hover:bg-gray-50/50'
                    }`}
                    onClick={() => scrollToSection(item.id)}
                  >
                    <span className={`text-xs font-black tracking-wider px-3 py-1 rounded-full ${item.accentBg} ${item.color}`}>
                      {item.badge}
                    </span>

                    <h3 className="text-2xl font-black text-gray-900 mt-4 leading-tight">
                      {item.title}
                    </h3>

                    <p className="text-gray-500 text-sm md:text-base leading-relaxed mt-4 font-normal">
                      {item.desc}
                    </p>

                    {/* Bullet list */}
                    <div className="space-y-3 mt-6">
                      {item.benefits.map((benefit, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-3 text-xs md:text-sm text-gray-700 font-bold">
                          <div className={`w-5 h-5 rounded-full ${item.accentBg} ${item.color} flex items-center justify-center shrink-0`}>
                            <Check size={12} className="stroke-[3]" />
                          </div>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>

                    {/* Decorative visual display shown ONLY on small viewports instead of the sticky visual */}
                    <div className="mt-6 block lg:hidden p-5 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden text-right">
                      {item.id === 'health' && (
                        <div className="space-y-2 text-xs">
                          <p className="font-bold text-gray-900">🐕 سگ خانگی: فیدو (گلدن رتریور)</p>
                          <p className="text-emerald-600">✓ واکسن هاری سالانه تزریق شده</p>
                        </div>
                      )}
                      {item.id === 'reminders' && (
                        <div className="space-y-2 text-xs">
                          <p className="font-bold text-gray-900">⏰ یادآور ۱۰:۰۰ صبح</p>
                          <p className="text-sunny-deep">مصرف قرص ضد انگل (میلبماکس)</p>
                        </div>
                      )}
                      {item.id === 'growth' && (
                        <div className="space-y-2 text-xs">
                          <p className="font-bold text-gray-900">⚖️ وزن فعلی: ۲۸.۲ کیلوگرم</p>
                          <p className="text-emerald-600">نمودار تطبیق ایده‌آل نژادی</p>
                        </div>
                      )}
                      {item.id === 'ai' && (
                        <div className="space-y-2 text-xs">
                          <p className="font-bold text-gray-900">🤖 دستیار هوشمند:</p>
                          <p className="text-indigo-600">آماده برای پاسخ‌دهی و تریاژ پزشکی فوری</p>
                        </div>
                      )}
                      {item.id === 'services' && (
                        <div className="space-y-2 text-xs">
                          <p className="font-bold text-gray-900">📍 دامپزشکی شبانه‌روزی مهرگان</p>
                          <p className="text-blue">فاصله: ۲۵۰ متر (مسیریابی سریع فعال)</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Scroll-down prompt element */}
        <div className="flex flex-col items-center justify-center pt-16 text-gray-400">
          <span className="text-[10px] font-bold tracking-widest uppercase">به پایین بکشید تا امکانات بعدی آشکار شوند</span>
          <div className="mt-2.5 text-coral">
            <ArrowDown size={18} />
          </div>
        </div>

      </div>
    </section>
  );
};

export default CapabilitiesSection;
