import React from 'react';
import { motion } from 'motion/react';
import { UserPlus, Heart, BellRing, TrendingUp, Sparkles, MapPin, Smile } from 'lucide-react';
import { Card } from '../Card';

export const WorkflowSection: React.FC = () => {
  const steps = [
    {
      num: '۱',
      title: 'ثبت آسان حیوان خانگی',
      desc: 'با پاسخ به چند سوال ساده درباره اسم، سن، نژاد و جنسیت پت دلبندتان، وارد دنیای جذاب او می‌شوید.',
      icon: UserPlus,
      color: 'bg-coral text-white shadow-coral/15',
    },
    {
      num: '۲',
      title: 'تشکیل پرونده پزشکی',
      desc: 'سوابق بیماری، عقیم‌سازی و داروهای مصرفی او را ثبت کنید تا پرونده جامع درمانی آنلاین ساخته شود.',
      icon: Heart,
      color: 'bg-sunny text-white shadow-sunny/15',
    },
    {
      num: '۳',
      title: 'اعلان هوشمند یادآورها',
      desc: 'سیستم به طور خودکار نوبت واکسیناسیون، مصرف داروها و پیاده‌روی را زمان‌بندی کرده و به شما پیام می‌دهد.',
      icon: BellRing,
      color: 'bg-emerald-500 text-white shadow-emerald-500/15',
    },
    {
      num: '۴',
      title: 'پایش روند رشد و قد',
      desc: 'با ثبت مداوم وزن و ابعاد بدنی پت، روند سلامت فیزیکی او را با نمودارهای استاندارد مطابقت دهید.',
      icon: TrendingUp,
      color: 'bg-blue text-white shadow-blue/15',
    },
    {
      num: '۵',
      title: 'توصیه‌های هوش مصنوعی',
      desc: 'بر اساس علائم ثبت‌شده فیزیکی، توصیه‌های اختصاصی تغذیه‌ای و تربیتی روزانه را دریافت کنید.',
      icon: Sparkles,
      color: 'bg-coral text-white shadow-coral/15',
    },
    {
      num: '۶',
      title: 'مسیریابی خدمات محلی',
      desc: 'در صورت نیاز به درمان، نزدیک‌ترین و مجهزترین کلینیک، داروخانه یا پارک مخصوص سگ را پیدا کنید.',
      icon: MapPin,
      color: 'bg-sunny text-white shadow-sunny/15',
    },
  ];

  return (
    <section id="workflow" className="relative py-24 md:py-32 bg-[#FFFDFB]" dir="rtl">
      
      {/* Background soft glow gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-peach rounded-full blur-[140px] opacity-[0.06] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sunny/10 border border-sunny/15 text-sunny font-bold text-xs animate-bounce"
          >
            <Smile className="w-4 h-4" />
            <span>مسیر هموار مراقبت کامل، گام به گام در کنار شما</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
            مراقبت روزانه چطور ساده‌تر می‌شود؟
          </h2>

          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            از لحظه ورود تا مراقبت‌های حیاتی دامپزشکی، پت‌میت فرایندهای پیچیده نگهداری حیوانات را به مراحلی دلچسب و شیرین تبدیل می‌کند.
          </p>
        </div>

        {/* Timeline Sequence layout */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
          
          {/* Connector lines behind (Only visible on large screen) */}
          <div className="hidden lg:block absolute top-[50%] left-12 right-12 h-0.5 bg-gradient-to-r from-coral/10 via-sunny/10 to-emerald-500/10 z-0" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative z-10"
              >
                <Card
                  className="h-full border border-gray-100 hover:border-coral-light/20 shadow-warm-sm hover:shadow-warm-md p-6 bg-white/95 rounded-[24px] flex flex-col justify-between group"
                  hoverEffect={true}
                >
                  <div className="space-y-4 text-right">
                    {/* Circle Step Number Indicator & Icon */}
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:rotate-6 ${step.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-black text-2xl text-gray-300 group-hover:text-coral transition-colors duration-300">
                        {step.num}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="font-sans font-black text-lg text-gray-900 group-hover:text-coral transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed font-normal">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
