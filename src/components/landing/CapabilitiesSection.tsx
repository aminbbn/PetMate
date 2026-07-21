import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Clock, 
  Scale, 
  Apple, 
  Activity, 
  MessageSquareCode, 
  Award, 
  Compass, 
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { Card } from '../Card';

export const CapabilitiesSection: React.FC = () => {
  const capabilities = [
    {
      title: 'پرونده سلامت آنلاین',
      desc: 'ثبت پرونده پزشکی کامل، سوابق درمان، داروها و معاینات دوره‌ای دوست شما به شیوه‌ای کاملاً الکترونیکی و امن.',
      icon: Heart,
      color: 'text-coral bg-coral/10 hover:bg-coral/20',
      badge: 'پرکاربرد',
    },
    {
      title: 'یادآورهای هوشمند',
      desc: 'تنظیم دقیق‌ترین اعلان‌ها و هشدارها برای زمان واکسیناسیون، مصرف داروها، پیاده‌روی، و نوبت دامپزشکی بعدی.',
      icon: Clock,
      color: 'text-sunny bg-sunny/10 hover:bg-sunny/20',
    },
    {
      title: 'پایشگر علمی رشد و وزن',
      desc: 'تحلیل داده‌های فیزیکی برای اطمینان از رشد و پایش وزن ایده‌آل حیوان خانگی بر اساس جداول استانداردهای جهانی.',
      icon: Scale,
      color: 'text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20',
    },
    {
      title: 'رژیم و تغذیه شخصی‌سازی‌شده',
      desc: 'برنامه‌ریزی کالری‌های روزانه، حجم غذا، میان وعده‌ها و حساسیت‌های غذایی سگ یا گربه به سادگی یک کلیک.',
      icon: Apple,
      color: 'text-blue bg-blue/10 hover:bg-blue/20',
    },
    {
      title: 'دستیار تریاژ و مشاوره هوشمند',
      desc: 'طراحی شده بر اساس پیشرفته‌ترین الگوهای درمانی جهت سنجش اولیه سلامت و فوریت‌های اورژانسی حیوانات.',
      icon: Activity,
      color: 'text-coral bg-coral/10 hover:bg-coral/20',
      badge: 'قدرت‌یافته از هوش مصنوعی',
    },
    {
      title: 'مترجم شگفت‌انگیز صدا و رفتار',
      desc: 'تلاش برای هم‌زبانی با پت شما از طریق تحلیل صداها، حرکت دم، زاویه گوش‌ها و زبان شیرین بدن.',
      icon: MessageSquareCode,
      color: 'text-sunny bg-sunny/10 hover:bg-sunny/20',
    },
    {
      title: 'مربی آنلاین تربیت و آموزش',
      desc: 'آموزش گام به گام بیش از ۲۰ تکنیک فرمان‌پذیری، رفع ناهنجاری‌ها و رفتارهای نادرست دوست وفادارتان.',
      icon: Award,
      color: 'text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20',
    },
    {
      title: 'مسیریاب مراکز خدمات حیوان',
      desc: 'نقشه کامل بیمارستان‌ها، دامپزشکان معتمد، پارک‌های بازی، و پت‌شاپ‌های سراسر شهرهای بزرگ ایران.',
      icon: Compass,
      color: 'text-blue bg-blue/10 hover:bg-blue/20',
    },
  ];

  return (
    <section id="capabilities" className="relative py-24 md:py-32 bg-[#FFFDFB]" dir="rtl">
      
      {/* Background decoration dots and light glow */}
      <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-sunny rounded-full blur-[130px] opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-coral/5 border border-coral-light/10 text-coral font-bold text-xs"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>یک پلتفرم کامل، بی‌نیاز از هر ابزار دیگر</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight"
          >
            هر آنچه برای خوشحالی و سلامت پت نیاز دارید
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-500 text-sm md:text-base leading-relaxed"
          >
            خدمات همه‌جانبه پت‌میت تمام دغدغه‌های روزمره، پزشکی، تربیت و مراقبتی شما را در یک بستر روان، لذت‌بخش و فوق‌العاده هوشمند برطرف می‌کند.
          </motion.p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((cap, index) => {
            const IconComponent = cap.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card
                  className="h-full border border-gray-100 hover:border-coral-light/20 shadow-warm-sm hover:shadow-warm-md p-6 bg-white/95 relative overflow-hidden flex flex-col justify-between group rounded-[24px]"
                  hoverEffect={true}
                >
                  <div className="space-y-4 text-right">
                    {/* Icon Header */}
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-2xl ${cap.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      {cap.badge && (
                        <span className="text-[9px] font-black tracking-wide px-2.5 py-1 rounded-full bg-coral/5 border border-coral-light/10 text-coral">
                          {cap.badge}
                        </span>
                      )}
                    </div>

                    {/* Title & Desc */}
                    <div className="space-y-2">
                      <h3 className="font-sans font-black text-lg text-gray-900 leading-snug">
                        {cap.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed font-normal">
                        {cap.desc}
                      </p>
                    </div>
                  </div>

                  {/* Tiny arrow action */}
                  <div className="pt-5 border-t border-gray-50 mt-4 flex items-center justify-between text-xs text-gray-400 font-bold group-hover:text-coral transition-colors">
                    <span>جزئیات بیشتر ابزار</span>
                    <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
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
