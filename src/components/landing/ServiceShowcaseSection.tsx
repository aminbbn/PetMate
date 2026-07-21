import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Compass, ShieldCheck, Heart, Navigation, Star, Phone } from 'lucide-react';
import { Card } from '../Card';

export const ServiceShowcaseSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'vet' | 'grooming' | 'petshop'>('vet');

  const categories = [
    { id: 'vet', label: 'کلینیک و دامپزشکی', emoji: '🏥' },
    { id: 'grooming', label: 'آرایشگاه و شستشو', emoji: '✂️' },
    { id: 'petshop', label: 'پت شاپ و غذا', emoji: '🍖' },
  ];

  const mockServices = {
    vet: [
      {
        name: 'بیمارستان تخصصی دامپزشکی مهرگان',
        address: 'تهران، خیابان نیاوران، نرسیده به میدان یاسر، پلاک ۱۲',
        phone: '۰۲۱-۲۲۰۰۳۳۴۴',
        rating: '۴.۹',
        reviews: '۱۲۴ نظر',
        verified: true,
        emergency: true,
        desc: 'مجهز به بخش اورژانس شبانه‌روزی، بخش جراحی پیشرفته، آزمایشگاه اختصاصی و کادر مجرب دانشگاهی.',
      },
      {
        name: 'کلینیک دامپزشکی دکتر سهرابی',
        address: 'تهران، بلوار مرزداران، بعد از خیابان سرسبز، بن‌بست یاس',
        phone: '۰۲۱-۴۴۵۵۶۶۷۷',
        rating: '۴.۷',
        reviews: '۸۶ نظر',
        verified: true,
        emergency: false,
        desc: 'خدمات تخصصی واکسیناسیون، جرم‌گیری دندان، کاشت میکروچیپ و صدور شناسنامه بهداشتی معتبر.',
      },
    ],
    grooming: [
      {
        name: 'آرایشگاه تخصصی و بهداشتی تدی پلاس',
        address: 'تهران، سعادت‌آباد، خیابان علامه جنوبی، ساختمان نگین',
        phone: '۰۲۱-۸۸۹۹۰۰۱۱',
        rating: '۴.۸',
        reviews: '۶۲ نظر',
        verified: false,
        emergency: false,
        desc: 'اصلاح حرفه‌ای مو بدون بیهوشی با مدرن‌ترین تجهیزات استریل، آروماتراپی مخصوص سگ و حمام نرم‌کننده پوستی.',
      },
    ],
    petshop: [
      {
        name: 'هایپر پت‌شاپ بزرگ پالادیوم',
        address: 'تهران، زعفرانیه، مرکز خرید پالادیوم، طبقه همکف ب',
        phone: '۰۲۱-۲۲۰۱۱۱۲۲',
        rating: '۴.۹',
        reviews: '۲۱۰ نظر',
        verified: true,
        emergency: false,
        desc: 'بزرگترین توزیع‌کننده انواع غذاهای خشک، کنسروهای درمانی، اسباب‌بازی‌های هوشمند تعاملی و لوازم لوکس جانبی سگ و گربه.',
      },
    ],
  };

  return (
    <section id="services" className="relative py-24 md:py-32 bg-[#FFFBF9]" dir="rtl">
      
      {/* Decorative gradient glow */}
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-coral rounded-full blur-[120px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8 text-right space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-coral/10 border border-coral-light/15 text-coral font-bold text-xs">
              <Compass className="w-4 h-4 text-coral animate-spin-slow" />
              <span>مسیریاب یکپارچه خدمات شهری</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
              نزدیک‌ترین خدمات دامپزشکی و رفاهی را روی نقشه بیابید
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl font-normal">
              دیگر نیازی به جستجوهای طولانی نیست. با نقشه هوشمند پتمیت، باکیفیت‌ترین و معتمدترین کلینیک‌های حیوانات، پت‌شاپ‌ها و آرایشگاه‌ها را با نظرات واقعی کاربران و تاییدیه نظام دامپزشکی پیدا کنید.
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <span className="text-xs font-bold text-coral bg-coral/5 border border-coral/10 px-4 py-2.5 rounded-2xl">
              ✦ بیش از ۲,۵۰۰ مرکز فعال و تایید شده
            </span>
          </div>
        </div>

        {/* Categories Chips Filters */}
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 cursor-pointer border ${
                activeCategory === cat.id
                  ? 'bg-coral border-coral text-white shadow-lg shadow-coral/15 scale-102'
                  : 'bg-white border-gray-100 hover:border-coral-light/20 text-gray-600 hover:text-gray-900 shadow-warm-sm'
              }`}
            >
              <span className="text-lg">{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Display Mock Services Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          {mockServices[activeCategory].map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="p-6 bg-white border border-gray-100 rounded-[28px] shadow-warm-md hover:shadow-warm-lg flex flex-col justify-between h-full relative overflow-hidden group"
                hoverEffect={true}
              >
                <div className="space-y-4">
                  {/* Card Title & Tags */}
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-gray-50 pb-4">
                    <div className="space-y-1.5 text-right">
                      <h4 className="font-sans font-black text-lg text-gray-900 group-hover:text-coral transition-colors">
                        {service.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="truncate max-w-sm">{service.address}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {service.verified && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold text-[10px] flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          تایید نظام دامپزشکی
                        </span>
                      )}
                      {service.emergency && (
                        <span className="px-2.5 py-1 rounded-lg bg-coral/10 border border-coral-light/20 text-coral font-bold text-[10px] animate-pulse">
                          اورژانس شبانه‌روزی
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description of Service */}
                  <p className="text-xs text-gray-500 leading-relaxed text-right font-normal bg-gray-50/50 p-3 rounded-xl border border-gray-50">
                    {service.desc}
                  </p>
                </div>

                {/* Card Footer Actions */}
                <div className="border-t border-gray-50 pt-4 mt-6 flex flex-wrap gap-4 items-center justify-between text-xs">
                  {/* Rating Info */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sunny font-black">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{service.rating}</span>
                    </div>
                    <span className="text-gray-400">({service.reviews})</span>
                  </div>

                  {/* Direct Contact & Route Actions */}
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-gray-500 border border-gray-100 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50">
                      <Phone className="w-3.5 h-3.5" />
                      {service.phone}
                    </span>
                    <span className="flex items-center gap-1 bg-coral text-white px-3 py-1.5 rounded-xl font-bold hover:bg-coral-deep shadow-md shadow-coral/5 cursor-pointer">
                      <Navigation className="w-3.5 h-3.5" />
                      مسیریابی مستقیم
                    </span>
                  </div>
                </div>

                {/* Soft gradient bottom decoration */}
                <div className="absolute bottom-[-40px] right-[-40px] w-24 h-24 bg-coral/5 rounded-full blur-[35px]" />
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
