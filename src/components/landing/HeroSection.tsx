import React, { useState, useEffect } from 'react';
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  useReducedMotion 
} from 'motion/react';
import { 
  Heart, 
  Clock, 
  Scale, 
  MapPin, 
  ArrowLeft, 
  Compass, 
  ShieldCheck, 
  Activity, 
  Award,
  Sparkles
} from 'lucide-react';
import { Button } from '../Button';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const shouldReduceMotion = useReducedMotion();
  const [hasPointer, setHasPointer] = useState(false);

  // 3D Parallax Tilt coordinates for the "Care Orbit" visual container
  const orbitX = useMotionValue(0);
  const orbitY = useMotionValue(0);

  const springConfig = { damping: 40, stiffness: 90 };
  const tiltX = useSpring(orbitX, springConfig);
  const tiltY = useSpring(orbitY, springConfig);

  useEffect(() => {
    // Check pointer capabilities to disable hover effects on mobile
    const checkPointer = () => {
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      setHasPointer(!isTouch);
    };
    checkPointer();
    window.addEventListener('resize', checkPointer);
    return () => window.removeEventListener('resize', checkPointer);
  }, []);

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasPointer) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    // Normalized coords between -1 and 1
    const x = (e.clientX - rect.left - width / 2) / (width / 2);
    const y = (e.clientY - rect.top - height / 2) / (height / 2);
    orbitX.set(x * 10);  // up to 10 degrees tilt
    orbitY.set(y * -10); // up to -10 degrees tilt
  };

  const handleContainerMouseLeave = () => {
    orbitX.set(0);
    orbitY.set(0);
  };

  return (
    <section 
      className="relative min-h-screen pt-32 pb-24 flex items-center justify-center overflow-hidden" 
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center relative z-10">
        
        {/* RIGHT SIDE: Editorial Copywriting */}
        <div className="lg:col-span-6 flex flex-col items-start text-right space-y-8 lg:pr-4">
          
          {/* Sparkly Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-2xl bg-coral/5 border border-coral-light/10 text-coral font-bold text-xs"
          >
            <Sparkles className="w-4 h-4 text-sunny" />
            <span>نسل جدید پلتفرم همه‌جانبه سلامتی حیوانات</span>
          </motion.div>

          {/* Headline */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl xl:text-6xl font-black text-gray-900 leading-[1.15] tracking-tight"
            >
              هر روزِ مراقبت، <br />
              <span className="text-coral">زنده‌تر و دقیق‌تر.</span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="text-gray-500 text-base md:text-lg leading-relaxed max-w-xl font-normal"
            >
              پت میت سلامت، یادآورها، رشد، تغذیه، آموزش و خدمات نزدیک را در یک تجربه آرام و هوشمند کنار هم می‌آورد؛ تا شما کمتر نگران شوید و بیشتر کنار دوست کوچکتان زندگی کنید.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
          >
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-coral hover:bg-coral-deep shadow-xl shadow-coral/15 hover:shadow-coral/25 h-14 px-8 text-sm font-black flex items-center justify-center gap-2.5 transition-transform active:scale-98 group/btn"
            >
              <span>شروع رایگان مراقبت</span>
              <ArrowLeft className="w-4.5 h-4.5 group-hover:-translate-x-1.5 transition-transform" />
            </Button>
            
            <a
              href="#capabilities"
              className="h-14 px-8 text-sm font-black text-gray-700 hover:text-coral bg-white/80 hover:bg-coral/5 border border-gray-200/60 hover:border-coral-light/20 rounded-[18px] flex items-center justify-center gap-2 transition-all duration-300 shadow-warm-sm"
            >
              <span>بررسی ابزارهای هوشمند</span>
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-100/80 w-full"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-coral">
                <Heart className="w-4 h-4 fill-current" />
                <span className="font-sans font-black text-lg text-gray-900">۳۴,۵۰۰+</span>
              </div>
              <p className="text-[11px] font-bold text-gray-400">حیوان خانگی مراقبت‌شده</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-600">
                <ShieldCheck className="w-4.5 h-4.5" />
                <span className="font-sans font-black text-sm text-gray-900">دامپزشکی</span>
              </div>
              <p className="text-[11px] font-bold text-gray-400">تایید شده توسط پزشکان برتر</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-blue">
                <Compass className="w-4.5 h-4.5" />
                <span className="font-sans font-black text-sm text-gray-900">شبانه‌روزی</span>
              </div>
              <p className="text-[11px] font-bold text-gray-400">اورژانس و تریاژ هوشمند فعال</p>
            </div>
          </motion.div>

        </div>

        {/* LEFT SIDE: Cinematic visual “care orbit” scene */}
        <div className="lg:col-span-6 relative flex justify-center items-center">
          <motion.div
            className="relative w-full max-w-[500px] aspect-square flex items-center justify-center"
            onMouseMove={handleContainerMouseMove}
            onMouseLeave={handleContainerMouseLeave}
            style={{
              rotateY: shouldReduceMotion ? 0 : tiltX,
              rotateX: shouldReduceMotion ? 0 : tiltY,
              transformStyle: 'preserve-3d',
              perspective: 1000
            }}
          >
            
            {/* Animated organic backdrop shape behind center */}
            <motion.div
              className="absolute w-[240px] h-[240px] md:w-[280px] md:h-[280px] bg-coral/5 rounded-full blur-2xl pointer-events-none"
              animate={shouldReduceMotion ? {} : {
                borderRadius: [
                  "45% 55% 60% 40% / 50% 45% 55% 50%",
                  "55% 45% 40% 60% / 40% 55% 50% 45%",
                  "45% 55% 60% 40% / 50% 45% 55% 50%"
                ],
                scale: [1, 1.05, 0.98, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* OUTER ORBIT RING (Concentric rotate clockwise) */}
            <motion.div
              className="absolute rounded-full border border-dashed border-gray-200/50 pointer-events-none flex items-center justify-center"
              style={{ 
                width: '380px', 
                height: '380px',
                transformStyle: 'preserve-3d'
              }}
              animate={shouldReduceMotion ? {} : { rotate: 360 }}
              transition={{ repeat: Infinity, duration: 42, ease: "linear" }}
            >
              
              {/* Outer Symbol 1: Services (Map Pin badge orbiting at 0deg) */}
              <motion.div 
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#E0F2FE] border border-blue/20 text-blue shadow-md flex items-center justify-center cursor-pointer pointer-events-auto"
                animate={shouldReduceMotion ? {} : { rotate: -360 }}
                transition={{ repeat: Infinity, duration: 42, ease: "linear" }}
                whileHover={{ scale: 1.15 }}
                title="خدمات رفاهی و مراکز شهری"
              >
                <MapPin className="w-5 h-5" />
              </motion.div>

              {/* Outer Symbol 2: Growth (Scale badge orbiting at 180deg) */}
              <motion.div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-11 h-11 rounded-full bg-[#ECFDF5] border border-emerald-500/20 text-emerald-600 shadow-md flex items-center justify-center cursor-pointer pointer-events-auto"
                animate={shouldReduceMotion ? {} : { rotate: -360 }}
                transition={{ repeat: Infinity, duration: 42, ease: "linear" }}
                whileHover={{ scale: 1.15 }}
                title="پایش رشد و وزن علمی"
              >
                <Scale className="w-5 h-5" />
              </motion.div>
            </motion.div>

            {/* INNER ORBIT RING (Concentric rotate counter-clockwise) */}
            <motion.div
              className="absolute rounded-full border border-dotted border-coral/30 pointer-events-none flex items-center justify-center"
              style={{ 
                width: '270px', 
                height: '270px',
                transformStyle: 'preserve-3d'
              }}
              animate={shouldReduceMotion ? {} : { rotate: -360 }}
              transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
            >
              
              {/* Inner Symbol 1: Health (Heart badge orbiting at 90deg) */}
              <motion.div 
                className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#FFF1F0] border border-coral-light/20 text-coral shadow-md flex items-center justify-center cursor-pointer pointer-events-auto"
                animate={shouldReduceMotion ? {} : { rotate: 360 }}
                transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
                whileHover={{ scale: 1.15 }}
                title="پرونده بهداشت و واکسیناسیون"
              >
                <Heart className="w-5 h-5 fill-current" />
              </motion.div>

              {/* Inner Symbol 2: Reminder (Clock badge orbiting at 270deg) */}
              <motion.div 
                className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#FFFBEB] border border-sunny/20 text-sunny-deep shadow-md flex items-center justify-center cursor-pointer pointer-events-auto"
                animate={shouldReduceMotion ? {} : { rotate: 360 }}
                transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
                whileHover={{ scale: 1.15 }}
                title="یادآورهای بهداشتی دقیق"
              >
                <Clock className="w-5 h-5" />
              </motion.div>
            </motion.div>

            {/* CENTRAL FOCAL POINT: Stylized Dog & Cat Silhouette vector artwork */}
            <motion.div
              className="z-10 relative"
              animate={shouldReduceMotion ? {} : {
                y: [0, -5, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <svg 
                className="w-56 h-56 md:w-64 md:h-64 select-none pointer-events-none drop-shadow-[0_15px_30px_rgba(255,112,89,0.18)]" 
                viewBox="0 0 200 200" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="dogGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                  <linearGradient id="catGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF7059" />
                    <stop offset="100%" stopColor="#E0533C" />
                  </linearGradient>
                  <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF1F0" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#FFFBEB" stopOpacity="0.3" />
                  </linearGradient>
                </defs>

                {/* Harmonizing circular background glow within the artwork */}
                <circle cx="100" cy="100" r="70" fill="url(#glowGrad)" />

                {/* Elegant Minimalist sitting Dog silhouette */}
                <path 
                  d="M 112 155 C 112 155 125 155 132 155 C 137 155 144 144 144 133 C 144 122 131 98 121 88 C 116 83 113 72 116 62 C 118 52 115 42 105 42 C 95 42 92 49 92 57 C 92 65 95 69 90 75 C 82 85 75 97 75 112 C 75 127 82 155 82 155 Z" 
                  fill="url(#dogGrad)" 
                />
                
                {/* Sleek cozy nested sitting Cat silhouette resting right next to the dog */}
                <path 
                  d="M 75 155 C 75 155 64 155 59 155 C 54 155 49 148 49 139 C 49 130 59 113 67 106 C 71 102 73 93 71 85 C 69 77 74 72 81 72 C 88 72 91 77 91 83 C 91 89 89 93 93 99 C 99 107 104 115 104 127 C 104 139 99 155 99 155 Z" 
                  fill="url(#catGrad)" 
                />

                {/* Premium Golden-white light details and highlights */}
                <path d="M 105 42 Q 107 27 114 37 Q 119 47 114 62" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
                <path d="M 81 72 Q 79 59 84 67" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />

                {/* Harmonious overlapping heart detail */}
                <path d="M 95 142 C 93 140 90 140 88 142 C 86 144 86 147 88 149 L 95 155 L 102 149 C 104 147 104 144 102 142 C 100 140 97 140 95 142 Z" fill="#FFFFFF" opacity="0.9" />
              </svg>
            </motion.div>

            {/* Waveform visual overlay drawing on load */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-12 bg-white/70 backdrop-blur-md border border-gray-100/80 rounded-2xl py-2 px-4 shadow-warm-md pointer-events-none flex items-center gap-3">
              <div className="text-[10px] font-sans font-black text-coral bg-coral/5 px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1">
                <Activity className="w-3 h-3 text-coral" />
                <span>85 BPM</span>
              </div>
              <svg className="w-full h-full text-coral/80" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <motion.path 
                  d="M0,15 L20,15 L25,5 L30,25 L35,15 L55,15 L60,2 L65,28 L70,15 L100,15" 
                  stroke="currentColor" 
                  strokeWidth="2.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ 
                    duration: 2.2, 
                    ease: "easeInOut", 
                    repeat: Infinity, 
                    repeatDelay: 5 
                  }}
                />
              </svg>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
