import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MapPin, Phone, Star, Map, Compass, Navigation, Search, Check, Sparkles, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPersian } from '../lib/persian';
import { cn } from '../lib/utils';

interface Service {
  id: string;
  name: string;
  type: 'clinic' | 'boarding' | 'shop' | 'park';
  address: string;
  phone: string;
  rating: number;
  distance: string;
  workingHours: string;
  isEmergency: boolean;
  notes: string;
}

export default function Navigator() {
  const profile = useAppStore(state => state.profile);
  const [filter, setFilter] = useState<'all' | 'clinic' | 'boarding' | 'shop' | 'park'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  if (!profile) return null;

  const services: Service[] = [
    {
      id: '1',
      name: 'بیمارستان دامپزشکی شبانه‌روزی البرز',
      type: 'clinic',
      address: 'خیابان آزادی، بعد از میدان انقلاب، پلاک ۴۱۲',
      phone: '۰۲۱-۶۶۰۹۸۷۶۵',
      rating: 4.8,
      distance: '۱.۲ کیلومتر',
      workingHours: '۲۴ ساعته (شبانه‌روزی)',
      isEmergency: true,
      notes: 'دارای بخش اورژانس، جراحی تخصصی، رادیولوژی و داروخانه شبانه‌روزی مجهز'
    },
    {
      id: '2',
      name: 'کلینیک تخصصی دکتر مرعشی',
      type: 'clinic',
      address: 'بلوار کشاورز، خیابان وصال شیرازی، ساختمان پزشکان پارس',
      phone: '۰۲۱-۸۸۹۰۱۲۳۴',
      rating: 4.6,
      distance: '۲.۸ کیلومتر',
      workingHours: '۹ صبح تا ۹ شب',
      isEmergency: false,
      notes: 'متخصص اطفال و جراحی‌های ظریف، واکسیناسیون و جرم‌گیری دندان با تجهیزات مدرن'
    },
    {
      id: '3',
      name: 'پت هتل آرامش (پانسیون و نگهداری تخصصی)',
      type: 'boarding',
      address: 'بزرگراه همت، خروجی شهرک غرب، خیابان مهستان، کوچه چهارم',
      phone: '۰۲۱-۸۸۰۹۶۵۴۳',
      rating: 4.9,
      distance: '۴.۵ کیلومتر',
      workingHours: '۸ صبح تا ۸ شب پذیرش',
      isEmergency: false,
      notes: 'اتاق‌های اختصاصی، دوربین آنلاین جهت پایش ۲۴ ساعته توسط صاحب حیوان، برنامه بازی منظم'
    },
    {
      id: '4',
      name: 'پت شاپ بزرگ مانی',
      type: 'shop',
      address: 'تهرانپارس، فلکه اول، خیابان بهار، پلاک ۸۵',
      phone: '۰۲۱-۷۷۸۸۹۹۰۰',
      rating: 4.5,
      distance: '۳.۱ کیلومتر',
      workingHours: '۱۰ صبح تا ۱۰ شب',
      isEmergency: false,
      notes: 'تنوع بی‌نظیر غذاهای خشک و تر ایرانی و خارجی، اسباب‌بازی‌های هوشمند، انواع تشویقی و ویتامین'
    },
    {
      id: '5',
      name: 'پارک سگ باغ ایرانی (فضای مخصوص بازی)',
      type: 'park',
      address: 'ده ونک، خیابان صابری، باغ بزرگ ایرانی',
      phone: 'نیاز به هماهنگی ندارد',
      rating: 4.7,
      distance: '۵.۲ کیلومتر',
      workingHours: '۷ صبح تا ۱۱ شب',
      isEmergency: false,
      notes: 'دارای محوطه فنس‌کشی شده و امن جهت دویدن و تعامل سگ‌ها بدون قلاده، مجهز به موانع چابکی'
    }
  ];

  const filteredServices = services.filter(service => {
    const matchesType = filter === 'all' || service.type === filter;
    const matchesSearch = service.name.includes(searchQuery) || service.notes.includes(searchQuery);
    return matchesType && matchesSearch;
  });

  return (
    <div className="p-8 lg:p-10 space-y-8 max-w-7xl mx-auto w-full text-right" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <Compass className="text-coral animate-spin" style={{ animationDuration: '6s' }} size={34} />
            مسیریاب خدمات شهری پت میت
          </h1>
          <p className="text-gray-400 text-sm font-bold mt-2">
            مکان‌یابی نزدیک‌ترین و معتبرترین مراکز درمانی، تفریحی، فروشگاهی و اقامتی مخصوص {profile.name}
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی نام یا تخصص مرکز..."
            className="w-full bg-white border border-coral-light/20 rounded-2xl pr-12 pl-4 py-3 text-xs outline-none focus:ring-2 focus:ring-coral/50"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>

      {/* Grid Layout: Map Mock (Right/Left) vs List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Services Interactive List (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Quick Filter Tabs */}
          <div className="flex gap-2 flex-wrap bg-white p-2 rounded-2xl border border-coral-light/10 shadow-sm">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black transition-all",
                filter === 'all' ? "bg-coral text-white shadow-sm shadow-coral/15" : "text-gray-500 hover:bg-peach/30"
              )}
            >
              همه مراکز
            </button>
            <button
              onClick={() => setFilter('clinic')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black transition-all",
                filter === 'clinic' ? "bg-coral text-white shadow-sm shadow-coral/15" : "text-gray-500 hover:bg-peach/30"
              )}
            >
              پزشکی و بیمارستان
            </button>
            <button
              onClick={() => setFilter('boarding')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black transition-all",
                filter === 'boarding' ? "bg-coral text-white shadow-sm shadow-coral/15" : "text-gray-500 hover:bg-peach/30"
              )}
            >
              پانسیون و هتل
            </button>
            <button
              onClick={() => setFilter('shop')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black transition-all",
                filter === 'shop' ? "bg-coral text-white shadow-sm shadow-coral/15" : "text-gray-500 hover:bg-peach/30"
              )}
            >
              پت‌شاپ بزرگ
            </button>
            <button
              onClick={() => setFilter('park')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black transition-all",
                filter === 'park' ? "bg-coral text-white shadow-sm shadow-coral/15" : "text-gray-500 hover:bg-peach/30"
              )}
            >
              پارک و تفریح
            </button>
          </div>

          {/* List of Services */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {filteredServices.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-coral-light/15">
                <Map className="mx-auto text-coral-light/40 mb-3" size={32} />
                <p className="text-gray-500 font-black text-sm">هیچ مرکزی با معیارهای شما یافت نشد.</p>
                <p className="text-gray-400 text-xs">کلمه دیگری را جستجو کنید یا فیلترها را تغییر دهید.</p>
              </div>
            ) : (
              filteredServices.map(service => (
                <Card 
                  key={service.id} 
                  className={cn(
                    "bg-white border transition-all duration-300 p-5 cursor-pointer relative overflow-hidden",
                    selectedService?.id === service.id 
                      ? "border-coral shadow-lg ring-1 ring-coral/30" 
                      : "border-coral-light/10 hover:border-coral-light/20 hover:shadow-md"
                  )}
                  onClick={() => setSelectedService(service)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2 text-right">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-gray-800 text-base">{service.name}</h3>
                        {service.isEmergency && (
                          <span className="bg-red-50 text-red-500 text-[9px] font-black px-2 py-0.5 rounded-md border border-red-100 flex items-center gap-1 animate-pulse">
                            <AlertTriangle size={10} />
                            اورژانس فوری
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 font-bold flex items-center gap-1">
                        <MapPin size={12} className="text-coral" />
                        {service.address}
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed font-bold mt-2">
                        {service.notes}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className="bg-sunny/10 text-sunny-deep px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-black">
                        <Star size={12} className="fill-sunny stroke-sunny" />
                        {toPersian(service.rating)}
                      </div>
                      <span className="text-[10px] text-coral font-bold bg-coral/5 px-2 py-0.5 rounded-full">{service.distance}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100/60 flex items-center justify-between text-xs font-bold text-gray-400">
                    <span>ساعت کاری: {service.workingHours}</span>
                    <span className="text-coral hover:underline flex items-center gap-0.5">
                      شماره تماس: {toPersian(service.phone)}
                    </span>
                  </div>
                </Card>
              ))
            )}
          </div>

        </div>

        {/* Right: Interactive Map Mock & details (5 cols) */}
        <div className="lg:col-span-5 space-y-6 sticky top-28">
          
          {/* Map Visual Card */}
          <Card className="bg-white border-coral-light/10 p-4 shadow-xl overflow-hidden relative h-[320px] flex flex-col justify-end">
            <div className="absolute inset-0 bg-peach/10 bg-[radial-gradient(#E85A5D_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            
            {/* Map Roads Mock */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
              <div className="w-full h-1.5 bg-gray-200/50 rounded-full rotate-12 mt-12" />
              <div className="w-full h-1.5 bg-gray-200/50 rounded-full -rotate-6 mb-20" />
              <div className="absolute left-1/2 top-0 w-1.5 h-full bg-gray-200/50 rounded-full" />
            </div>

            {/* Simulated Markers */}
            <div className="absolute top-1/3 right-1/4 bg-coral text-white p-2 rounded-2xl shadow-lg flex items-center gap-1 text-[10px] font-black animate-bounce pointer-events-none">
              <MapPin size={12} />
              <span>شما</span>
            </div>

            {filteredServices.map((serv, index) => {
              const offsets = [
                { top: '15%', left: '20%' },
                { top: '45%', left: '70%' },
                { top: '70%', left: '15%' },
                { top: '30%', left: '40%' },
                { top: '80%', left: '60%' },
              ];
              const offset = offsets[index % offsets.length];
              const isSelected = selectedService?.id === serv.id;

              return (
                <div 
                  key={serv.id}
                  style={{ top: offset.top, left: offset.left }}
                  className={cn(
                    "absolute transition-all duration-300 pointer-events-auto cursor-pointer",
                    isSelected ? "scale-125 z-20" : "scale-100 z-10"
                  )}
                  onClick={() => setSelectedService(serv)}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center shadow-md",
                    isSelected ? "bg-coral text-white" : "bg-white text-coral border border-coral-light/20"
                  )}>
                    <MapPin size={18} />
                  </div>
                </div>
              );
            })}

            {/* Bottom Panel over Map */}
            <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-coral-light/10 relative z-20 shadow-lg text-right space-y-1">
              <div className="flex items-center gap-2">
                <Navigation size={14} className="text-coral" />
                <span className="text-xs font-black text-gray-700">شبیه‌ساز هوشمند نقشه محلی</span>
              </div>
              <p className="text-[10px] text-gray-400 font-bold leading-relaxed">
                موقعیت جغرافیایی مراکز بالا به صورت خودکار با پایش فاصله و بهترین زمان ترافیکی همگام‌سازی شده است.
              </p>
            </div>
          </Card>

          {/* Service Detail Info if Selected */}
          {selectedService && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card glow glowColor="coral" className="bg-white border-coral-light/25 p-6 space-y-4">
                <h3 className="font-black text-gray-800 text-base">{selectedService.name}</h3>
                <div className="grid grid-cols-2 gap-3 text-right text-xs">
                  <div className="bg-peach/30 p-2.5 rounded-xl border border-coral-light/5">
                    <span className="block text-[10px] text-gray-400 font-bold">فاصله از شما</span>
                    <span className="font-black text-coral">{selectedService.distance}</span>
                  </div>
                  <div className="bg-peach/30 p-2.5 rounded-xl border border-coral-light/5">
                    <span className="block text-[10px] text-gray-400 font-bold">امتیاز رضایت</span>
                    <span className="font-black text-sunny flex items-center gap-1 justify-end">
                      <Star size={10} className="fill-sunny" />
                      {toPersian(selectedService.rating)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] text-gray-400 font-bold block">امکانات ویژه و توضیحات</span>
                  <p className="text-xs text-gray-600 leading-relaxed font-bold">
                    {selectedService.notes}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${selectedService.phone}`} className="flex-1">
                    <Button variant="secondary" className="w-full text-xs font-black flex items-center justify-center gap-1 py-2.5">
                      <Phone size={14} />
                      تماس تلفنی
                    </Button>
                  </a>
                  <Button variant="primary" className="flex-1 text-xs font-black py-2.5">
                    مسیریابی با بلدیاب
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

        </div>

      </div>

    </div>
  );
}
