import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowLeft, Heart, Calendar, Activity, Zap, CheckCircle2 } from 'lucide-react';
import { Button } from '../Button';
import { FloatingFeatureCard } from './FloatingFeatureCard';
import { HeroReactiveBackground } from './HeroReactiveBackground';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden bg-[#FFFDFB]" dir="rtl">
      
      {/* Immersive reactive backdrop */}
      <HeroReactiveBackground />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* RIGHT SIDE: Text & Copywriting */}
        <div className="lg:col-span-6 flex flex-col items-start text-right space-y-6 md:space-y-8">
          
          {/* Sparkly Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 px-4.5 py-2 rounded-2xl bg-coral/10 border border-coral/15 text-coral font-bold text-xs"
          >
            <Sparkles className="w-4 h-4 text-sunny animate-pulse" />
            <span>معرفی نسل جدید پلتفرم هوشمند مراقبت حیوانات</span>
          </motion.div>

          {/* Headline */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl xl:text-6xl font-black text-gray-900 leading-[1.2] tracking-tight"
            >
              همراه هوشمند <span className="text-coral">سلامت، رشد</span> و مراقبت دوست کوچکتان
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600 text-base md:text-lg lg:text-xl font-normal leading-relaxed max-w-xl"
            >
              پت‌میت با دستیار فوق‌پیشرفته AI، پایشگر هوشمند رشد، یادآورهای دقیق واکسیناسیون و پرونده آنلاین پزشکی، خیالتان را از مراقبت بی‌نقص و سلامت همیشگی حیوان خانگی‌تان راحت می‌کند.
            </motion.p>
          </div>

          {/* CTA Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-coral hover:bg-coral-deep shadow-xl shadow-coral/15 hover:shadow-coral/25 h-14 px-8 text-sm font-black flex items-center justify-center gap-2 group/btn"
            >
              <span>شروع رایگان مراقبت</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Button>
            
            <a
              href="#capabilities"
              className="h-14 px-8 text-sm font-bold text-gray-700 hover:text-coral bg-gray-50 hover:bg-coral/5 border border-gray-100 hover:border-coral-light/20 rounded-[18px] flex items-center justify-center gap-2 transition-all duration-300"
            >
              <span>مشاهده امکانات و ارزش‌ها</span>
            </a>
          </motion.div>

          {/* Trust/Support badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 border-t border-gray-100 w-full"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>طراحی‌شده برای سگ‌ها، گربه‌ها و پرندگان</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>مورد تایید پزشکان و متخصصین کشور</span>
            </div>
          </motion.div>

        </div>

        {/* LEFT SIDE: Visual Masterpiece / Dashboard cards */}
        <div className="lg:col-span-6 relative flex justify-center items-center py-10 lg:py-0">
          
          {/* Main Visual Frame (Simulated Dashboard Preview) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative w-full max-w-[480px] aspect-[4/3] bg-white rounded-[32px] border border-coral-light/10 shadow-warm-lg p-6 overflow-hidden flex flex-col justify-between"
          >
            {/* Header of Mockup */}
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-peach flex items-center justify-center text-coral-deep font-bold text-lg">
                  🐕
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-sm text-gray-900 leading-none">پرونده فیدو (ژرمن شفرد)</h4>
                  <span className="text-[10px] font-bold text-gray-400">سن: ۳ سال و ۲ ماه</span>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                پایش آنلاین سلامت
              </div>
            </div>

            {/* Simulated Live Medical Timeline */}
            <div className="space-y-3 my-4 flex-1 justify-center flex flex-col">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="p-2.5 bg-coral/10 rounded-xl text-coral shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400">امروز - ساعت ۱۸:۳۰</span>
                  <p className="font-bold text-xs text-gray-800">تزریق واکسن هاری سالانه</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-sunny/5 border border-sunny/10">
                <div className="p-2.5 bg-sunny/10 rounded-xl text-sunny shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400">روند وزن کلینیکی</span>
                  <p className="font-bold text-xs text-gray-800">وزن فیدو به حد استاندارد ۲۸ کیلو رسید</p>
                </div>
              </div>
            </div>

            {/* Small Footer statistics inside frame */}
            <div className="border-t border-gray-50 pt-4 flex items-center justify-between text-xs text-gray-400">
              <span className="font-bold">بروزرسانی شده: همین حالا</span>
              <span className="text-coral font-bold">مشاهده گزارش کامل ←</span>
            </div>
          </motion.div>

          {/* Floating Cards around Mockup with parallax physics */}
          
          {/* Card A: Vaccine Reminder */}
          <FloatingFeatureCard 
            className="absolute top-[-10%] right-[-5%] w-48 border-l-4 border-l-coral"
            delay={0.2}
            yOffset={12}
          >
            <div className="flex items-start gap-2.5">
              <span className="text-2xl mt-0.5">💉</span>
              <div>
                <h5 className="font-bold text-xs text-gray-900">یادآور واکسیناسیون</h5>
                <p className="text-[10px] text-gray-500 mt-1">فردا نوبت واکسن چندگانه</p>
              </div>
            </div>
          </FloatingFeatureCard>

          {/* Card B: Weight/Growth Tracker */}
          <FloatingFeatureCard 
            className="absolute bottom-[-5%] right-[0%] w-52 border-l-4 border-l-sunny"
            delay={0.5}
            yOffset={18}
          >
            <div className="flex items-start gap-2.5">
              <span className="text-2xl mt-0.5">📈</span>
              <div>
                <h5 className="font-bold text-xs text-gray-900">پایش هوشمند وزن</h5>
                <p className="text-[10px] text-gray-500 mt-1">رشد کاملاً منطبق با نمودار ایده آل</p>
              </div>
            </div>
          </FloatingFeatureCard>

          {/* Card C: AI Triage Assistant */}
          <FloatingFeatureCard 
            className="absolute top-[12%] left-[-10%] w-48 border-l-4 border-l-blue"
            delay={0.8}
            yOffset={14}
          >
            <div className="flex items-start gap-2.5">
              <span className="text-2xl mt-0.5">🤖</span>
              <div>
                <h5 className="font-bold text-xs text-gray-900">دستیار فوق هوشمند</h5>
                <p className="text-[10px] text-gray-500 mt-1">پاسخ سریع به سوالات اورژانسی</p>
              </div>
            </div>
          </FloatingFeatureCard>

          {/* Card D: Interactive Heart Pop Indicator */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -bottom-8 left-1/4 p-4 bg-white/90 backdrop-blur-md border border-coral-light/20 shadow-warm-lg rounded-2xl flex items-center gap-2 text-xs font-bold text-gray-800"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-coral animate-ping" />
            <Heart className="w-4 h-4 text-coral fill-current" />
            <span>۳۴,۵۰۰+ حیوان مراقبت شده</span>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
