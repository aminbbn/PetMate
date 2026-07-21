import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Button } from '../Button';

interface CTASectionProps {
  onGetStarted: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onGetStarted }) => {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-[#FFFDFB]" dir="rtl">
      
      {/* Background large centered glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFF1F0] to-[#FFFDFB] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-coral rounded-full blur-[130px] opacity-[0.06] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Floating background micro particles */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-10 right-10 text-coral/15 text-3xl select-none"
        >
          ❤️
        </motion.div>
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -15, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-10 left-10 text-sunny/15 text-4xl select-none"
        >
          🐶
        </motion.div>

        {/* Central Card container */}
        <div className="p-8 md:p-14 bg-white/70 backdrop-blur-md border border-coral-light/10 shadow-warm-lg rounded-[40px] text-center space-y-8 relative overflow-hidden">
          
          {/* Subtle glowing heart emblem in center */}
          <div className="w-16 h-16 bg-coral/10 text-coral rounded-2xl flex items-center justify-center mx-auto relative group hover:rotate-6 transition-transform">
            <Heart className="w-7 h-7 fill-current text-coral animate-pulse" />
            <div className="absolute -top-1 -left-1 bg-sunny text-white p-1 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </div>
          </div>

          {/* Copywriting */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
              آماده‌اید تجربه جدیدی از عشق و مراقبت بسازید؟
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              با پت‌میت، دغدغه‌ها تمام می‌شوند و دوران شیرین‌تر، منظم‌تر و علمی‌تری از نگهداری دوست کوچک دلبندتان آغاز می‌شود. همین حالا رایگان بپیوندید.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-coral hover:bg-coral-deep shadow-xl shadow-coral/10 hover:shadow-coral/20 h-14 px-10 text-sm font-black flex items-center gap-2 group"
            >
              <span>شروع رایگان مراقبت از پت من</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Safety line */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-400">
            <ShieldAlert className="w-4 h-4 text-emerald-500" />
            <span>ثبت نام فوق‌العاده سریع • بدون نیاز به کارت اعتباری</span>
          </div>

        </div>

      </div>
    </section>
  );
};
