import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const stats = [
    { label: 'سفرهای درمانی و بهداشتی موفق ثبت شده', value: '۴۵,۰۰۰+' },
    { label: 'بهبود بهداشت زمانی و رفع فراموشی واکسن‌ها', value: '۹۸٪' },
    { label: 'رضایت خانواده‌های حامی حیوانات دلبند', value: '۴.۹/۵' },
  ];

  return (
    <section id="trust" className="relative py-28 md:py-32 bg-[#FFFDFB] overflow-hidden" dir="rtl">
      
      {/* Delicate background graphics */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-peach/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-24">
        
        {/* Modern Editorial Header */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold text-xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>چرا خانواده‌های حامی به پت میت اعتماد کرده‌اند؟</span>
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
            مراقبتی برخاسته از عاطفه، <br />
            <span className="text-coral">کالیبره‌شده با تکنولوژی روز</span>
          </h2>

          <p className="text-gray-500 text-sm md:text-base leading-relaxed font-normal">
            ما متعهد به هموار کردن دغدغه‌های روزمره شما هستیم. با تلفیق دانش نوین دامپزشکی کشور و ابزارهای مانیتورینگ آنلاین، پت میت همواره تکیه‌گاه امنی در کنار شماست.
          </p>
        </div>

        {/* ONE PROMINENT QUOTE - High-Contrast Editorial Statement */}
        <div className="max-w-4xl mx-auto border-y border-gray-100 py-12 md:py-16 text-center space-y-6 relative">
          
          {/* Decorative quote icon watermark */}
          <div className="absolute top-4 right-1/2 translate-x-1/2 text-8xl text-coral/5 font-serif select-none pointer-events-none">
            «
          </div>

          <p className="text-xl md:text-2xl lg:text-3xl font-serif font-medium text-gray-800 leading-relaxed max-w-3xl mx-auto relative z-10 italic">
            «بزرگ‌ترین رسالت قلبی ما در پت میت، تبدیل کردن دغدغه‌های مبهم شبانه سرپرستان حیوانات به آرامش خاطرِ متصل به علمِ دامپزشکی است؛ چرا که هر تپش قلب کوچک دوست دلبند شما برای ما ارزشمند است.»
          </p>

          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center text-lg shadow-warm-sm">
              👩‍⚕️
            </div>
            <div className="text-right">
              <h5 className="font-black text-sm text-gray-900">الهه مهدوی</h5>
              <span className="text-[10px] text-gray-400 font-bold">موسس شبکه سلامت پت میت</span>
            </div>
          </div>
        </div>

        {/* THREE LARGE STATISTICS SEPARATED BY LINES */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 items-center justify-center text-center">
            {stats.map((stat, idx) => (
              <React.Fragment key={idx}>
                
                {/* Statistic point */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="space-y-3 px-6 py-4"
                >
                  <span className="block text-4xl md:text-5xl lg:text-6xl font-black text-coral font-sans leading-none">
                    {stat.value}
                  </span>
                  <span className="block text-xs md:text-sm font-bold text-gray-500 leading-relaxed max-w-[200px] mx-auto">
                    {stat.label}
                  </span>
                </motion.div>

                {/* Vertical Divider line between stats on desktop viewports */}
                {idx < stats.length - 1 && (
                  <div className="hidden md:block w-px h-16 bg-gray-100 self-center" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TrustSection;
