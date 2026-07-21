import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowLeft, ShieldCheck, Heart } from 'lucide-react';
import { Button } from '../Button';

interface CTASectionProps {
  onGetStarted: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onGetStarted }) => {
  return (
    <section className="relative py-28 md:py-36 bg-coral text-white overflow-hidden w-full" dir="rtl">
      
      {/* MOVING BACKGROUND RINGS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* Ring 1 - Massive slow rotating circle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] rounded-full border border-white/[0.06] flex items-center justify-center"
        >
          <div className="w-[85%] h-[85%] rounded-full border border-white/[0.04]" />
          <div className="w-[70%] h-[70%] rounded-full border border-white/[0.03]" />
        </motion.div>

        {/* Ring 2 - Large bottom-left circle */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[-30%] left-[-15%] w-[90vw] h-[90vw] md:w-[60vw] md:h-[60vw] rounded-full border border-white/[0.07] flex items-center justify-center"
        >
          <div className="w-[80%] h-[80%] rounded-full border border-white/[0.04]" />
        </motion.div>

        {/* Slow glowing orb in bottom center */}
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[60vw] h-[30vh] bg-sunny/20 rounded-full blur-[140px] mix-blend-screen" />
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10 space-y-8">
        
        {/* Floating Heart icon emblem */}
        <div className="w-16 h-16 bg-white/10 border border-white/15 text-white rounded-2xl flex items-center justify-center mx-auto hover:scale-110 transition-transform relative">
          <Heart className="w-7 h-7 fill-current text-white" />
          <div className="absolute -top-1 -left-1 bg-sunny text-white p-1 rounded-lg">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Headline text */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
            آماده‌اید تجربه جدیدی از <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-sunny to-white">عشق و مراقبت هوشمند</span> بسازید؟
          </h2>
          <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-xl mx-auto font-normal">
            با عضویت در پت میت، تمام آشفتگی‌ها و دغدغه‌های مکتوب جای خود را به مانیتورینگ منظم، عاطفی و مدرن می‌دهند. همین امروز شروع کنید.
          </p>
        </div>

        {/* Interactive primary action CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-white hover:bg-white/95 text-coral font-black h-14 px-10 rounded-2xl flex items-center gap-2 group shadow-xl shadow-black/10 hover:shadow-black/15 transition-all text-sm cursor-pointer border border-transparent"
          >
            <span>شروع رایگان عضویت پت میت</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
          </Button>
        </div>

        {/* Safety trust badge */}
        <div className="pt-2 flex items-center justify-center gap-1.5 text-xs font-bold text-white/70">
          <ShieldCheck className="w-4 h-4 text-sunny" />
          <span>ثبت نام فوق‌العاده سریع • بدون نیاز به کارت اعتباری</span>
        </div>

      </div>
    </section>
  );
};

export default CTASection;
