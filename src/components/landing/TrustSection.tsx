import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, Smile, Award, Activity } from 'lucide-react';
import { Card } from '../Card';

export const TrustSection: React.FC = () => {
  const stats = [
    { label: 'سفر درمانی موفق', value: '۴۵,۰۰۰+' },
    { label: 'کاهش فراموشی واکسیناسیون', value: '۹۸٪' },
    { label: 'رضایت حامیان و کاربران', value: '۴.۹/۵' },
    { label: 'پت‌شاپ و داروخانه‌های همکار', value: '۱,۲۰۰+' },
  ];

  const testimonials = [
    {
      quote: 'پت‌میت فرشته نجات گربه من، ملو شد. با یادآورهای دقیق داروهای کلیوی او، دیگه هیچ نوبتی رو فراموش نمی‌کنم و دستیار هوشمندش توی علائم اولیه بی‌حالی ملوس خیلی به موقع راهنمایی‌مون کرد.',
      author: 'الهه مهدوی',
      pet: 'سرپرست ملوس (گربه پرشین)',
      avatar: '👩‍💼',
    },
    {
      quote: 'به عنوان کسی که تجربه تربیت توله سگ رو نداشتم، مربی هوشمند پت‌میت برام فوق‌العاده کاربردی بود. دستورات مقدماتی رو با تمرین‌های گام به گام در کمتر از سه هفته به فیدو یاد دادم.',
      author: 'علیرضا راد',
      pet: 'سرپرست فیدو (ژرمن شفرد)',
      avatar: '👨‍💻',
    },
  ];

  return (
    <section id="trust" className="relative py-24 md:py-32 bg-[#FFFDFB]" dir="rtl">
      
      {/* Soft warm orbs */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#FFE6D5] rounded-full blur-[140px] opacity-[0.06] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold text-xs"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>چرا هزاران خانواده به پت‌میت اعتماد کرده‌اند؟</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
            ما متعهد به لبخند شما و سلامت دوست کوچکتان هستیم
          </h2>

          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            پت‌میت صرفاً یک جعبه‌ابزار دیجیتال نیست؛ ما با عشق، علم دامپزشکی و نوآوری تلاش می‌کنیم تا دغدغه‌های ذهنی سرپرستان حیوانات خانگی را به صفر برسانیم.
          </p>
        </div>

        {/* Impact Stats Bento Layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <Card className="p-6 bg-white border border-gray-100 text-center rounded-[24px] shadow-warm-sm group" hoverEffect={true}>
                <div className="space-y-2">
                  <span className="block text-3xl md:text-4xl font-black text-coral group-hover:scale-105 transition-transform duration-300">
                    {stat.value}
                  </span>
                  <span className="block text-xs font-bold text-gray-500">
                    {stat.label}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Heartfelt Customer Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {testimonials.map((test, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx === 0 ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card
                className="p-8 bg-white/95 border border-coral-light/10 shadow-warm-md rounded-[28px] text-right flex flex-col justify-between space-y-6 relative overflow-hidden group"
                hoverEffect={true}
              >
                {/* Quote Icon Background */}
                <div className="absolute top-4 left-6 text-7xl text-coral/5 font-serif select-none pointer-events-none group-hover:scale-110 group-hover:text-coral/10 transition-transform">
                  ”
                </div>

                <p className="text-sm text-gray-600 leading-relaxed font-normal relative z-10">
                  {test.quote}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3 border-t border-gray-50 pt-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-[#FFE6D5] flex items-center justify-center text-xl">
                    {test.avatar}
                  </div>
                  <div className="text-right">
                    <h5 className="font-bold text-sm text-gray-900">{test.author}</h5>
                    <span className="text-[10px] text-gray-400 font-bold">{test.pet}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
