import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Phone, 
  Star, 
  ShieldCheck, 
  Navigation, 
  Compass,
  Radio,
  Search,
  CheckCircle
} from 'lucide-react';

interface ServiceLocation {
  id: number;
  name: string;
  address: string;
  phone: string;
  rating: string;
  reviews: string;
  verified: boolean;
  emergency: boolean;
  desc: string;
  // Coordinates for the SVG stylized map (percentage from top/left)
  mapX: number;
  mapY: number;
}

type ServiceCategory = 'vet' | 'grooming' | 'petshop';

export const ServiceShowcaseSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('vet');
  const [selectedMarkerId, setSelectedMarkerId] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [routingMessage, setRoutingMessage] = useState<string | null>(null);

  const categories = [
    { id: 'vet', label: '🏥 کلینیک و دامپزشکی', count: '۱۲ مرکز فعال نزدیک' },
    { id: 'grooming', label: '✂️ آرایش و نظافت', count: '۶ مرکز فعال نزدیک' },
    { id: 'petshop', label: '🍖 پت‌شاپ و تغذیه', count: '۹ مرکز فعال نزدیک' },
  ];

  const locationsData: Record<ServiceCategory, ServiceLocation[]> = {
    vet: [
      {
        id: 0,
        name: 'بیمارستان تخصصی دامپزشکی مهرگان',
        address: 'تهران، خیابان نیاوران، نرسیده به میدان یاسر، پلاک ۱۲',
        phone: '۰۲۱-۲۲۰۰۳۳۴۴',
        rating: '۴.۹',
        reviews: '۱۲۴ نظر سرپرستان',
        verified: true,
        emergency: true,
        desc: 'مجهز به بخش اورژانس شبانه‌روزی، اتاق جراحی پیشرفته حیوانات کوچک، آزمایشگاه اختصاصی بیومتریک و کادر مجرب دانشگاهی.',
        mapX: 35,
        mapY: 28,
      },
      {
        id: 1,
        name: 'کلینیک دامپزشکی دکتر سهرابی',
        address: 'تهران، بلوار مرزداران، بعد از خیابان سرسبز، بن‌بست یاس',
        phone: '۰۲۱-۴۴۵۵۶۶۷۷',
        rating: '۴.۷',
        reviews: '۸۶ نظر سرپرستان',
        verified: true,
        emergency: false,
        desc: 'خدمات تخصصی واکسیناسیون حیوانات، جرم‌گیری دندان با اولتراسونیک، کاشت هولوگرام میکروچیپ و صدور شناسنامه بهداشتی معتبر پت میت.',
        mapX: 68,
        mapY: 42,
      },
      {
        id: 2,
        name: 'مرکز شبانه‌روزی حامی پت',
        address: 'تهران، ولنجک، خیابان چهاردهم، مجتمع تجاری بهارستان',
        phone: '۰۲۱-۲۲۴۴۹۹۰۰',
        rating: '۴.۸',
        reviews: '۱۰۵ نظر سرپرستان',
        verified: false,
        emergency: true,
        desc: 'مراقبت‌های ویژه دامپزشکی شبانه‌روزی، اعزام آمبولانس سریع حیوانات خانگی در شعاع ۵ کیلومتری و سرم‌تراپی تخصصی.',
        mapX: 48,
        mapY: 72,
      }
    ],
    grooming: [
      {
        id: 0,
        name: 'آرایشگاه تخصصی و بهداشتی تدی پلاس',
        address: 'تهران، سعادت‌آباد، خیابان علامه جنوبی، ساختمان نگین',
        phone: '۰۲۱-۸۸۹۹۰۰۱۱',
        rating: '۴.۸',
        reviews: '۶۲ نظر سرپرستان',
        verified: true,
        emergency: false,
        desc: 'اصلاح فوق‌تخصصی موهای پرپشت و گره‌خورده بدون بیهوشی با مدرن‌ترین تجهیزات استریل، آروماتراپی مخصوص سگ و گربه و حمام آب گرم معدنی.',
        mapX: 25,
        mapY: 55,
      },
      {
        id: 1,
        name: 'اسپا و سالن حمام رزا پت',
        address: 'تهران، فرمانیه، خیابان دباغی، کوچه لادن، پلاک ۴',
        phone: '۰۲۱-۲۶۱۱۵۵۴۴',
        rating: '۴.۶',
        reviews: '۴۱ نظر سرپرستان',
        verified: false,
        emergency: false,
        desc: 'کوتاه کردن ناخن، تخلیه کیسه مخرج، شستشوی ضد قارچ موستلا، برس‌کشی حرفه‌ای گره‌زدا و خوش‌بوکننده عطر مخصوص حیوانات خانگی.',
        mapX: 78,
        mapY: 22,
      },
      {
        id: 2,
        name: 'سالن شستشو و آرایش پام فیت',
        address: 'تهران، پاسداران، بوستان هفتم، پلاک ۱۹',
        phone: '۰۲۱-۲۲۷۷۸۸۹۹',
        rating: '۴.۷',
        reviews: '۵۳ نظر سرپرستان',
        verified: true,
        emergency: false,
        desc: 'آرایش تخصصی سگ‌های پامرانین و شیتزو متناسب با استانداردهای زیبایی بین‌المللی با متد تایلندی به همراه ماساژ آرامش عضلات.',
        mapX: 52,
        mapY: 48,
      }
    ],
    petshop: [
      {
        id: 0,
        name: 'هایپر پت‌شاپ بزرگ پالادیوم',
        address: 'تهران، زعفرانیه، مرکز خرید پالادیوم، طبقه همکف ب',
        phone: '۰۲۱-۲۲۰۱۱۱۲۲',
        rating: '۴.۹',
        reviews: '۲۱۰ نظر سرپرستان',
        verified: true,
        emergency: false,
        desc: 'بزرگترین توزیع‌کننده انواع غذاهای خشک هیلز و رویال کنین، کنسروهای درمانی کلیه و مفاصل، اسباب‌بازی‌های هوشمند تعاملی و لوازم لوکس جانبی.',
        mapX: 58,
        mapY: 34,
      },
      {
        id: 1,
        name: 'پت‌شاپ تخصصی دکتر کلینیک',
        address: 'تهران، خیابان شریعتی، بالاتر از پل صدر، پلاک ۱۶۷۰',
        phone: '۰۲۱-۲۲۶۶۰۰۳۳',
        rating: '۴.۷',
        reviews: '۷۴ نظر سرپرستان',
        verified: true,
        emergency: false,
        desc: 'داروخانه دامپزشکی مجاز به همراه عرضه مستقیم شیر خشک توله‌سگ، قلاده‌های شب‌نما ضد سرقت و تشویقی‌های طبیعی عاری از گندم و سویا.',
        mapX: 32,
        mapY: 64,
      },
      {
        id: 2,
        name: 'پت لند مارکت تهران نو',
        address: 'تهران، فلکه دوم تهرانپارس، خیابان جشنواره، نبش کوچه مریم',
        phone: '۰۲۱-۷۷۸۸۳۳۲۲',
        rating: '۴.۵',
        reviews: '۳۹ نظر سرپرستان',
        verified: false,
        emergency: false,
        desc: 'فروش لوازم اولیه خاک گربه معطر ژاپنی، تشویقی‌های دندانی سگ ژرمن، باکس‌های حمل و نقل استاندارد پروازی مسافرتی آیاتا.',
        mapX: 72,
        mapY: 68,
      }
    ]
  };

  // Simulate radar sweeping sound / visual delay on category switch
  useEffect(() => {
    setIsScanning(true);
    const timer = setTimeout(() => {
      setIsScanning(false);
      setSelectedMarkerId(0);
    }, 900);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  const activeLocations = locationsData[activeCategory];
  const selectedLocation = activeLocations[selectedMarkerId] || activeLocations[0];

  return (
    <section id="services" className="relative py-28 bg-[#FFFDF9] overflow-hidden" dir="rtl">
      
      {/* Decorative Blur Background Highlights */}
      <div className="absolute top-12 left-12 w-96 h-96 bg-coral/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-96 h-96 bg-sunny/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-16">
        
        {/* HEADER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 text-right space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-coral/5 border border-coral-light/10 text-coral font-bold text-xs">
              <Compass className="w-4 h-4 text-coral" />
              <span>مسیریابی هوشمند و رادار شهری پت میت</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
              خدمات شهری روی رادار تعاملی
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl font-normal">
              با انتخاب دسته‌بندی دلخواه، موقعیت مکانی معتبرترین کلینیک‌ها، آرایشگاه‌ها و پت‌شاپ‌های تایید شده توسط نظام دامپزشکی را بر روی نقشه هوشمند بیابید و جزئیات دقیق و امکانات را به صورت تک کارد مطالعه کنید.
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <span className="text-xs font-black text-coral bg-coral/5 border border-coral/10 px-5 py-3 rounded-2xl">
              ✓ رادار فعال در شعاع محل زندگی شما
            </span>
          </div>
        </div>

        {/* CATEGORY SELECTOR CHIPS */}
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as ServiceCategory)}
              className={`flex items-center gap-3.5 px-6 py-3.5 rounded-2xl font-black text-xs md:text-sm transition-all duration-300 cursor-pointer border ${
                activeCategory === cat.id
                  ? 'bg-coral border-coral text-white shadow-lg shadow-coral/15 scale-102'
                  : 'bg-white border-gray-100 hover:border-coral-light/20 text-gray-600 hover:text-gray-900 shadow-warm-sm'
              }`}
            >
              <div className="text-right">
                <span className="block leading-none">{cat.label}</span>
                <span className={`block text-[9px] font-bold mt-1.5 ${activeCategory === cat.id ? 'text-white/85' : 'text-gray-400'}`}>
                  {cat.count}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* STYLIZED INTELLIGENT RADAR MAP & DETAILS PANEL (2 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white border border-coral-light/10 p-6 md:p-8 rounded-[40px] shadow-warm-lg">
          
          {/* RADAR MAP INTERACTIVE SVG STAGE (Takes 7 Cols) */}
          <div className="lg:col-span-7 bg-[#111726] rounded-[32px] overflow-hidden relative min-h-[380px] md:min-h-[440px] border border-gray-800 flex flex-col items-center justify-center p-4 shadow-inner">
            
            {/* SVG Interactive Road / Path Map Background */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.12] pointer-events-none" viewBox="0 0 1000 600" fill="none">
              {/* Grid backdrop */}
              <defs>
                <pattern id="radar-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#radar-grid)" />
              
              {/* Rivers */}
              <path d="M -50,120 Q 300,140 450,280 T 1050,480" stroke="#3b82f6" strokeWidth="32" strokeLinecap="round" />
              <path d="M -50,120 Q 300,140 450,280 T 1050,480" stroke="#1d4ed8" strokeWidth="8" strokeLinecap="round" />
              
              {/* Streets network (styled geometric paths) */}
              <path d="M 100,-50 L 100,650" stroke="#ffffff" strokeWidth="12" />
              <path d="M 500,-50 L 500,650" stroke="#ffffff" strokeWidth="14" />
              <path d="M 900,-50 L 900,650" stroke="#ffffff" strokeWidth="12" />
              
              <path d="M -50,180 L 1050,180" stroke="#ffffff" strokeWidth="14" />
              <path d="M -50,380 L 1050,380" stroke="#ffffff" strokeWidth="12" />
              <path d="M -50,520 L 1050,520" stroke="#ffffff" strokeWidth="12" />

              {/* Diagonal connecting routes */}
              <path d="M -50,50 L 600,650" stroke="#ffffff" strokeWidth="8" strokeDasharray="10, 8" />
              <path d="M 400,-50 L 1050,500" stroke="#ffffff" strokeWidth="6" />

              {/* Park circular elements */}
              <circle cx="200" cy="450" r="70" fill="rgba(16,185,129,0.15)" stroke="rgba(16,185,129,0.3)" strokeWidth="4" />
              <circle cx="820" cy="120" r="50" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.2)" strokeWidth="4" />
            </svg>

            {/* Radar Conic sweep circles centered */}
            <div className="absolute w-72 h-72 rounded-full border border-coral/10 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 rounded-full border border-coral/15 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border border-coral/20" />
              </div>
            </div>

            {/* Rotating Conic Gradient sweep to simulate diagnostic scanning */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
              className="absolute w-80 h-80 origin-center pointer-events-none z-10"
              style={{
                backgroundImage: 'conic-gradient(from 0deg at 50% 50%, rgba(240,84,41,0.2) 0deg, transparent 90deg)'
              }}
            />

            {/* Live scanning header watermark info */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20 bg-black/40 px-3.5 py-1.5 rounded-xl border border-white/[0.06] backdrop-blur-md">
              <Radio className="w-3.5 h-3.5 text-coral" />
              <span className="text-[10px] font-mono font-black text-coral uppercase tracking-wider">
                {isScanning ? 'Scanning Radius...' : 'Radar Status: Online'}
              </span>
            </div>

            {/* INTERACTIVE MARKERS */}
            <AnimatePresence>
              {!isScanning && activeLocations.map((loc) => {
                const isSelected = selectedMarkerId === loc.id;
                return (
                  <motion.button
                    key={loc.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    onClick={() => setSelectedMarkerId(loc.id)}
                    className="absolute cursor-pointer z-20 group/map-marker"
                    style={{ left: `${loc.mapX}%`, top: `${loc.mapY}%` }}
                  >
                    {/* Ring pulsing halo for the selected marker */}
                    {isSelected && (
                      <span className="absolute -inset-4.5 rounded-full bg-coral/25 animate-ping pointer-events-none" />
                    )}

                    {/* Highly tactile visual pin */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative ${
                      isSelected 
                        ? 'bg-coral border-white scale-125 shadow-xl shadow-coral/30 text-white' 
                        : 'bg-white border-coral text-coral hover:bg-coral hover:text-white scale-100 shadow-md'
                    }`}>
                      <MapPin size={16} className={isSelected ? 'scale-110' : ''} />
                      
                      {/* Numeric Label badge */}
                      <span className="absolute -top-1.5 -right-1.5 bg-gray-900 border border-gray-800 text-white text-[8px] font-mono font-black w-4.5 h-4.5 rounded-full flex items-center justify-center">
                        {loc.id + 1}
                      </span>
                    </div>

                    {/* Tooltip hovering label */}
                    <span className="absolute bottom-11 right-1/2 translate-x-1/2 whitespace-nowrap bg-gray-900 border border-gray-800 text-white text-[9px] font-black px-2.5 py-1 rounded-lg opacity-0 group-hover/map-marker:opacity-100 transition-opacity z-30 pointer-events-none">
                      {loc.name}
                    </span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {/* SINGLE DETAILED DISPLAY PANEL (Takes 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between text-right space-y-6">
            
            {/* Quick selectors for the 3 active pins in list form */}
            <div className="space-y-3">
              <span className="text-[10px] font-black tracking-widest text-gray-400 block uppercase">مراکز فعال یافت شده در شعاع محلی</span>
              
              <div className="space-y-2">
                {activeLocations.map((loc) => {
                  const isSelected = selectedMarkerId === loc.id;
                  return (
                    <button
                      key={loc.id}
                      onClick={() => setSelectedMarkerId(loc.id)}
                      className={`w-full text-right p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-coral/5 border-coral-light/20 text-coral shadow-sm font-black'
                          : 'bg-gray-50 hover:bg-gray-100/60 border-transparent text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-5.5 h-5.5 rounded-lg text-[10px] font-black flex items-center justify-center ${
                          isSelected ? 'bg-coral text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {loc.id + 1}
                        </span>
                        <span className="text-xs md:text-sm font-black">{loc.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sunny text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{loc.rating}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ACTIVE LOCATION DESCRIPTION BLOCK - Uses AnimatePresence to prevent pops */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + selectedMarkerId}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50/80 border border-gray-100 p-6 rounded-3xl flex-1 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3.5">
                  
                  {/* Category Title + emergency badge */}
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-3">
                    <div className="space-y-1">
                      <h4 className="font-sans font-black text-base md:text-lg text-gray-900 leading-tight">
                        {selectedLocation.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{selectedLocation.address}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {selectedLocation.verified && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 font-black text-[8px] flex items-center gap-1">
                          <CheckCircle size={12} />
                          تایید دامپزشکی
                        </span>
                      )}
                      {selectedLocation.emergency && (
                        <span className="px-2.5 py-1 rounded-lg bg-coral/15 border border-coral-light/20 text-coral font-black text-[8px]">
                          اورژانس شبانه‌روزی
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Desc */}
                  <p className="text-xs text-gray-500 leading-relaxed font-normal">
                    {selectedLocation.desc}
                  </p>
                </div>

                {/* Rating score + Contact CTA triggers */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                    <span className="text-sunny font-black flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {selectedLocation.rating}
                    </span>
                    <span>•</span>
                    <span>{selectedLocation.reviews}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a 
                      href={`tel:${selectedLocation.phone}`}
                      className="flex items-center gap-1 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{selectedLocation.phone}</span>
                    </a>

                    <button
                      onClick={() => {
                        setRoutingMessage(`مسیریابی به مرکز ${selectedLocation.name} آغاز شد!`);
                        setTimeout(() => setRoutingMessage(null), 3500);
                      }}
                      className="flex items-center gap-1.5 bg-coral text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-coral-deep shadow-md shadow-coral/10 active:scale-95 transition-all cursor-pointer"
                    >
                      <Navigation size={12} />
                      <span>مسیریابی</span>
                    </button>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

          </div>

        </div>

        {/* Elegant routing success toast feedback */}
        <AnimatePresence>
          {routingMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-6 left-6 z-50 bg-gray-900 border border-gray-800 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-sm"
              dir="rtl"
            >
              <div className="w-6.5 h-6.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle size={14} />
              </div>
              <p className="text-xs font-black text-white/95 leading-relaxed">{routingMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default ServiceShowcaseSection;
