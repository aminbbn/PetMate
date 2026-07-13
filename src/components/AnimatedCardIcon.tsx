import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  FileText, 
  TrendingUp, 
  Bell, 
  Heart, 
  Check, 
  AlertTriangle, 
  Flame, 
  Stethoscope, 
  Map, 
  ShoppingBag, 
  Bot, 
  Apple, 
  Smile, 
  Award, 
  Scale,
  LucideProps 
} from 'lucide-react';
import { cn } from '../lib/utils';

export type AnimatedCardIconVariant =
  | 'sparkles'
  | 'calendar'
  | 'clock'
  | 'document'
  | 'trend'
  | 'bell'
  | 'heart'
  | 'success'
  | 'alert'
  | 'flame'
  | 'stethoscope'
  | 'map'
  | 'shop'
  | 'bot'
  | 'nutrition'
  | 'behavior'
  | 'training'
  | 'weight';

export type AnimatedCardIconTone =
  | 'coral'
  | 'sunny'
  | 'mint'
  | 'blue'
  | 'neutral';

export interface AnimatedCardIconProps {
  variant: AnimatedCardIconVariant;
  icon?: React.ComponentType<LucideProps>;
  tone?: AnimatedCardIconTone;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  decorative?: boolean;
}

const TONE_CLASSES: Record<AnimatedCardIconTone, string> = {
  coral: 'bg-coral/10 text-coral border-coral/20',
  sunny: 'bg-sunny/10 text-sunny border-sunny/20',
  mint: 'bg-green-50 text-green-600 border-green-100',
  blue: 'bg-blue-50 text-blue-500 border-blue-100',
  neutral: 'bg-gray-50 text-gray-400 border-gray-100',
};

const DEFAULT_ICONS: Record<AnimatedCardIconVariant, React.ComponentType<LucideProps>> = {
  sparkles: Sparkles,
  calendar: Calendar,
  clock: Clock,
  document: FileText,
  trend: TrendingUp,
  bell: Bell,
  heart: Heart,
  success: Check,
  alert: AlertTriangle,
  flame: Flame,
  stethoscope: Stethoscope,
  map: Map,
  shop: ShoppingBag,
  bot: Bot,
  nutrition: Apple,
  behavior: Smile,
  training: Award,
  weight: Scale,
};

export const AnimatedCardIcon: React.FC<AnimatedCardIconProps> = ({
  variant,
  icon: CustomIcon,
  tone = 'coral',
  size = 'md',
  className,
  decorative = true,
}) => {
  const IconComponent = CustomIcon || DEFAULT_ICONS[variant] || Sparkles;

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg text-xs',
    md: 'w-12 h-12 rounded-2xl text-base',
    lg: 'w-14 h-14 rounded-3xl text-lg',
  };

  const iconSizes = {
    sm: 16,
    md: 22,
    lg: 26,
  };

  const iconSize = iconSizes[size];

  // Render original star shards decoration
  const renderSparkleShards = () => (
    <>
      <svg viewBox="0 0 24 24" className="absolute w-3.5 h-3.5 opacity-0 pointer-events-none text-sunny/85 animate-shard-smooth-1 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" fill="currentColor">
        <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
      </svg>
      <svg viewBox="0 0 24 24" className="absolute w-3 h-3 opacity-0 pointer-events-none text-sunny/75 animate-shard-smooth-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" fill="currentColor">
        <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
      </svg>
      <svg viewBox="0 0 24 24" className="absolute w-4 h-4 opacity-0 pointer-events-none text-sunny/90 animate-shard-smooth-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" fill="currentColor">
        <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
      </svg>
      <svg viewBox="0 0 24 24" className="absolute w-2.5 h-2.5 opacity-0 pointer-events-none text-sunny/70 animate-shard-smooth-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" fill="currentColor">
        <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
      </svg>
    </>
  );

  // Render calendar page flip numbers
  const renderCalendarNumbers = () => (
    <>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none font-black text-[10px] select-none text-coral/80 animate-num-fly-1" aria-hidden="true">۱۲</span>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none font-black text-[10px] select-none text-coral/80 animate-num-fly-2" aria-hidden="true">۷</span>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none font-black text-[10px] select-none text-coral/80 animate-num-fly-3" aria-hidden="true">۲۸</span>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none font-black text-[10px] select-none text-coral/80 animate-num-fly-4" aria-hidden="true">۳</span>
    </>
  );

  // Render clock hands and numbers
  const renderClockFace = () => (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none" aria-hidden="true">
      {/* Outer Dial ring */}
      <div className="absolute w-[80%] h-[80%] rounded-full border border-current/20 flex items-center justify-center">
        {/* Central spindle */}
        <div className="w-1.5 h-1.5 rounded-full bg-current z-10" />
        {/* Hour Hand */}
        <div className="absolute w-[2px] h-[22%] bg-current rounded-full origin-bottom bottom-1/2 left-[calc(50%-1px)] animate-clock-hour" style={{ transformOrigin: 'bottom center' }} />
        {/* Minute Hand */}
        <div className="absolute w-[1.5px] h-[32%] bg-current/70 rounded-full origin-bottom bottom-1/2 left-[calc(50%-0.75px)] animate-clock-minute" style={{ transformOrigin: 'bottom center' }} />
      </div>
      {/* Persian numbers */}
      <span className="absolute top-1/2 left-1/2 opacity-0 text-[8px] font-black text-current/80 animate-clock-num-12" style={{ transformOrigin: 'center' }}>۱۲</span>
      <span className="absolute top-1/2 left-1/2 opacity-0 text-[8px] font-black text-current/80 animate-clock-num-3" style={{ transformOrigin: 'center' }}>۳</span>
      <span className="absolute top-1/2 left-1/2 opacity-0 text-[8px] font-black text-current/80 animate-clock-num-6" style={{ transformOrigin: 'center' }}>۶</span>
      <span className="absolute top-1/2 left-1/2 opacity-0 text-[8px] font-black text-current/80 animate-clock-num-9" style={{ transformOrigin: 'center' }}>۹</span>
    </div>
  );

  // Render mint success ripples and particles
  const renderMintSuccess = () => (
    <>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-2 border-green-400 rounded-full opacity-0 pointer-events-none animate-mint-ripple-1" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-2 border-green-300 rounded-full opacity-0 pointer-events-none animate-mint-ripple-2" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-green-500 rounded-full opacity-0 pointer-events-none animate-mint-pop-1" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-green-400 rounded-full opacity-0 pointer-events-none animate-mint-pop-2" aria-hidden="true" />
    </>
  );

  // Render alert radar ripples and particles
  const renderAlertRadar = () => {
    const isEmergency = tone === 'coral';
    const rippleBorder = isEmergency ? 'border-coral' : 'border-sunny';
    const dotBg = isEmergency ? 'bg-coral' : 'bg-sunny';
    return (
      <>
        <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-2 rounded-full opacity-0 pointer-events-none animate-alert-ripple-1", rippleBorder)} aria-hidden="true" />
        <div className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-2 rounded-full opacity-0 pointer-events-none animate-alert-ripple-2", rippleBorder)} aria-hidden="true" />
        <div className={cn("absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full opacity-0 pointer-events-none animate-alert-pop-1", dotBg)} aria-hidden="true" />
        <div className={cn("absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full opacity-0 pointer-events-none animate-alert-pop-2", dotBg)} aria-hidden="true" />
      </>
    );
  };

  // Render heart bubbles
  const renderHeartBubbles = () => (
    <>
      <svg viewBox="0 0 24 24" className="absolute w-3.5 h-3.5 opacity-0 pointer-events-none text-coral animate-heart-1 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <svg viewBox="0 0 24 24" className="absolute w-2.5 h-2.5 opacity-0 pointer-events-none text-coral/80 animate-heart-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <svg viewBox="0 0 24 24" className="absolute w-4 h-4 opacity-0 pointer-events-none text-coral/90 animate-heart-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </>
  );

  // Render fire embers
  const renderFireEmbers = () => (
    <>
      <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-amber-500 rounded-full opacity-0 pointer-events-none animate-ember-1" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-sunny rounded-full opacity-0 pointer-events-none animate-ember-2" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-coral rounded-full opacity-0 pointer-events-none animate-ember-3" aria-hidden="true" />
    </>
  );

  // Render trend line drawing
  const renderTrendDrawing = () => (
    <svg viewBox="0 0 24 24" className="w-[110%] h-[110%] text-current relative overflow-visible pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M23 6l-9.5 9.5-5-5L1 18" className="petmate-trend-path" style={{ strokeDasharray: 40, strokeDashoffset: 0 }} />
      <path d="M17 6h6v6" className="petmate-trend-arrow" />
      <circle cx="23" cy="6" r="2.5" className="fill-sunny stroke-none petmate-trend-dot" />
    </svg>
  );

  // Render custom dial scale
  const renderScaleFace = () => (
    <svg viewBox="0 0 24 24" className="text-current relative overflow-visible pointer-events-none" width={iconSize} height={iconSize} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 20H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2z" />
      <path d="M6 14a6 6 0 0 1 12 0" className="opacity-30" />
      <line x1="12" y1="14" x2="15" y2="10" className="petmate-scale-needle stroke-coral" style={{ strokeWidth: 2.8, transformOrigin: '12px 14px' }} />
    </svg>
  );

  // Render Document animation layouts
  const renderDocumentVisual = () => (
    <div className="relative flex items-center justify-center w-full h-full pointer-events-none" aria-hidden="true">
      {/* Background Page Sheet */}
      <div className="absolute w-[80%] h-[80%] border-2 border-current rounded-md bg-white opacity-0 petmate-doc-bg top-[-2px] right-[-2px] z-0" />
      {/* Foreground Main Page */}
      <div className="relative z-10 petmate-doc-main">
        <IconComponent size={iconSize} />
      </div>
    </div>
  );

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center shrink-0 overflow-visible transition-all duration-300 border border-transparent petmate-card-icon select-none group/card-icon",
        TONE_CLASSES[tone],
        sizeClasses[size],
        className
      )}
      role={decorative ? "presentation" : undefined}
      aria-hidden={decorative ? "true" : undefined}
    >
      {/* Custom Scoped CSS Stylesheet Block */}
      <style>{`
        /* Self-contained highly responsive, CPU-friendly micro-animations */
        @keyframes trend-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes trend-dot-glow {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.5); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-in {
          to { opacity: 1; }
        }
        @keyframes bell-swing {
          0%, 100% { transform: rotate(0); }
          20% { transform: rotate(14deg); }
          40% { transform: rotate(-12deg); }
          60% { transform: rotate(8deg); }
          80% { transform: rotate(-5deg); }
        }
        @keyframes bell-wave-left {
          0% { transform: scale(0.6) translate(0, 0); opacity: 0; }
          30% { opacity: 0.6; }
          100% { transform: scale(1.5) translate(-10px, -2px); opacity: 0; }
        }
        @keyframes bell-wave-right {
          0% { transform: scale(0.6) translate(0, 0); opacity: 0; }
          30% { opacity: 0.6; }
          100% { transform: scale(1.5) translate(10px, -2px); opacity: 0; }
        }
        @keyframes pin-drop {
          0% { transform: translateY(-6px); }
          60% { transform: translateY(1.5px); }
          80% { transform: translateY(-1.5px); }
          100% { transform: translateY(0); }
        }
        @keyframes map-ripple {
          0% { transform: scale(0.4) rotateX(60deg); opacity: 0; }
          35% { opacity: 0.7; }
          100% { transform: scale(1.8) rotateX(60deg); opacity: 0; }
        }
        @keyframes bag-bounce {
          0%, 100% { transform: scale(1) translateY(0); }
          30% { transform: scale(0.95, 1.05) translateY(-2px); }
          50% { transform: scale(1.05, 0.95) translateY(1px); }
          70% { transform: scale(0.98, 1.02) translateY(-0.5px); }
        }
        @keyframes item-rise {
          0% { transform: translateY(2px) scale(0); opacity: 0; }
          50% { transform: translateY(-10px) scale(1.2); opacity: 1; }
          100% { transform: translateY(-16px) scale(0.8); opacity: 0; }
        }
        @keyframes bot-antenna {
          0%, 100% { transform: rotate(0); }
          30% { transform: rotate(15deg); }
          60% { transform: rotate(-15deg); }
        }
        @keyframes bot-blink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes leaf-grow {
          0% { transform: translate(4px, 4px) scale(0) rotate(-45deg); opacity: 0; }
          50% { transform: translate(-4px, -10px) scale(1.3) rotate(15deg); opacity: 1; }
          100% { transform: translate(-8px, -15px) scale(0.9) rotate(45deg); opacity: 0; }
        }
        @keyframes emo-bubble-1 {
          0% { transform: translate(0, 0) scale(0); opacity: 0; }
          50% { transform: translate(-8px, -10px) scale(1.2); opacity: 1; }
          100% { transform: translate(-14px, -18px) scale(0.8); opacity: 0; }
        }
        @keyframes emo-bubble-2 {
          0% { transform: translate(0, 0) scale(0); opacity: 0; }
          50% { transform: translate(8px, -8px) scale(1.1); opacity: 1; }
          100% { transform: translate(14px, -15px) scale(0.7); opacity: 0; }
        }
        @keyframes medal-swing {
          0%, 100% { transform: rotate(0); }
          25% { transform: rotate(8deg); }
          75% { transform: rotate(-8deg); }
        }
        @keyframes ring-draw {
          from { stroke-dashoffset: 44; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes scale-needle {
          0%, 100% { transform: rotate(-35deg); }
          50% { transform: rotate(40deg); }
          75% { transform: rotate(5deg); }
        }
        @keyframes document-tilt {
          0%, 100% { transform: perspective(100px) rotateX(0deg) rotateY(0deg) translateY(0); }
          50% { transform: perspective(100px) rotateX(10deg) translateY(-2px); }
        }
        @keyframes document-page-rise {
          0%, 100% { transform: translateY(0) scale(0.95); opacity: 0; }
          50% { transform: translateY(-4px) scale(0.98); opacity: 0.45; }
        }
        @keyframes heartbeat-dot {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.6); opacity: 1; }
        }

        /* 10. HOVER TRIGGER BOUND TO GROUP */
        @media (hover: hover) and (prefers-reduced-motion: no-preference) {
          .group:hover .petmate-trend-path {
            stroke-dasharray: 40;
            stroke-dashoffset: 40;
            animation: trend-draw 1.2s ease-out forwards;
          }
          .group:hover .petmate-trend-arrow {
            opacity: 0;
            animation: fade-in 0.3s ease-out 0.9s forwards;
          }
          .group:hover .petmate-trend-dot {
            opacity: 0;
            animation: trend-dot-glow 1.2s ease-out 0.8s forwards;
          }
          .group:hover .petmate-bell-icon {
            animation: bell-swing 1s ease-in-out;
            transform-origin: top center;
          }
          .group:hover .petmate-bell-left-wave {
            animation: bell-wave-left 1.1s ease-out 0.1s infinite;
          }
          .group:hover .petmate-bell-right-wave {
            animation: bell-wave-right 1.1s ease-out 0.1s infinite;
          }
          .group:hover .petmate-map-pin {
            animation: pin-drop 0.8s ease-out forwards;
            transform-origin: bottom center;
          }
          .group:hover .petmate-map-ripple {
            animation: map-ripple 1.4s infinite ease-out 0.2s;
          }
          .group:hover .petmate-shop-bag {
            animation: bag-bounce 0.9s ease-in-out forwards;
            transform-origin: bottom center;
          }
          .group:hover .petmate-shop-item {
            animation: item-rise 1.2s ease-out forwards;
          }
          .group:hover .petmate-bot {
            animation: bot-antenna 0.8s ease-in-out;
            transform-origin: center bottom;
          }
          .group:hover .petmate-bot-light {
            animation: bot-blink 0.4s infinite alternate;
          }
          .group:hover .petmate-leaf {
            animation: leaf-grow 1.2s ease-out forwards;
          }
          .group:hover .petmate-emo-1 {
            animation: emo-bubble-1 1.2s ease-out forwards;
          }
          .group:hover .petmate-emo-2 {
            animation: emo-bubble-2 1.4s ease-out 0.1s forwards;
          }
          .group:hover .petmate-medal {
            animation: medal-swing 0.8s ease-in-out;
            transform-origin: top center;
          }
          .group:hover .petmate-medal-ring {
            animation: ring-draw 1s ease-out forwards;
          }
          .group:hover .petmate-scale-needle {
            animation: scale-needle 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }
          .group:hover .petmate-doc-main {
            animation: document-tilt 1s ease-in-out;
            transform-origin: bottom center;
          }
          .group:hover .petmate-doc-bg {
            animation: document-page-rise 1s ease-in-out forwards;
            transform-origin: bottom center;
          }
          .group:hover .petmate-steth-icon {
            transform: scale(1.05);
            transition: transform 0.3s ease;
          }
          .group:hover .petmate-steth-dot {
            animation: heartbeat-dot 0.8s infinite ease-in-out;
          }
          .group:hover .petmate-primary-icon-standard {
            transform: scale(1.1);
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
        }

        /* 11. TOUCH DEVICE ACTIVE FALLBACK - PREVENTS STICKY HOVER */
        @media (hover: none) {
          .group:active .petmate-card-icon,
          .group:active .petmate-primary-icon-standard,
          .group:active .petmate-doc-main {
            transform: scale(0.97);
            transition: transform 0.15s ease;
          }
        }
      `}</style>

      {/* Decorative Particles & Layer Panels */}
      {variant === 'sparkles' && renderSparkleShards()}
      {variant === 'calendar' && renderCalendarNumbers()}
      {variant === 'success' && renderMintSuccess()}
      {variant === 'alert' && renderAlertRadar()}
      {variant === 'heart' && renderHeartBubbles()}
      {variant === 'flame' && renderFireEmbers()}

      {/* Primary Icon Representation */}
      {variant === 'clock' ? (
        renderClockFace()
      ) : variant === 'trend' ? (
        renderTrendDrawing()
      ) : variant === 'weight' ? (
        renderScaleFace()
      ) : variant === 'document' ? (
        renderDocumentVisual()
      ) : variant === 'bell' ? (
        <div className="relative pointer-events-none petmate-bell-icon">
          <IconComponent size={iconSize} />
          {/* Wave Left/Right lines */}
          <svg viewBox="0 0 24 24" className="absolute w-4 h-4 text-current opacity-0 left-[-8px] top-[15%] pointer-events-none petmate-bell-left-wave" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 8A6 6 0 0 0 6 12" />
          </svg>
          <svg viewBox="0 0 24 24" className="absolute w-4 h-4 text-current opacity-0 right-[-8px] top-[15%] pointer-events-none petmate-bell-right-wave" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 8a6 6 0 0 1 6 4" />
          </svg>
        </div>
      ) : variant === 'map' ? (
        <div className="relative flex items-center justify-center w-full h-full pointer-events-none">
          <div className="petmate-map-pin z-10 text-current">
            <IconComponent size={iconSize} />
          </div>
          <div className="absolute bottom-[10%] w-6 h-3 border-2 border-current rounded-full opacity-0 pointer-events-none petmate-map-ripple z-0" />
        </div>
      ) : variant === 'shop' ? (
        <div className="relative pointer-events-none">
          <div className="petmate-shop-bag">
            <IconComponent size={iconSize} />
          </div>
          <svg viewBox="0 0 24 24" className="absolute top-[-4px] left-[35%] w-3.5 h-3.5 text-sunny opacity-0 pointer-events-none petmate-shop-item" fill="currentColor">
            <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
          </svg>
        </div>
      ) : variant === 'bot' ? (
        <div className="relative pointer-events-none">
          <div className="petmate-bot text-current">
            <IconComponent size={iconSize} />
          </div>
          <div className="absolute top-[4px] left-[calc(50%-1.5px)] w-[3px] h-[3px] rounded-full bg-sunny opacity-0 petmate-bot-light" />
        </div>
      ) : variant === 'stethoscope' ? (
        <div className="relative pointer-events-none petmate-steth-icon">
          <IconComponent size={iconSize} />
          <div className="absolute right-[-2px] top-[-2px] w-2.5 h-2.5 rounded-full bg-coral border-2 border-white opacity-0 petmate-steth-dot" />
        </div>
      ) : variant === 'nutrition' ? (
        <div className="relative pointer-events-none">
          <IconComponent size={iconSize} className="petmate-primary-icon-standard" />
          <svg viewBox="0 0 24 24" className="absolute w-3.5 h-3.5 text-green-500 opacity-0 pointer-events-none petmate-leaf bottom-[-3px] right-[-3px]" fill="currentColor">
            <path d="M17 8c.31-.26.68-.42 1.09-.46 1.04-.1 1.9.77 1.8 1.81-.04.41-.2.78-.46 1.09L11 19H5v-6L17 8z" />
          </svg>
        </div>
      ) : variant === 'behavior' ? (
        <div className="relative pointer-events-none">
          <IconComponent size={iconSize} className="petmate-primary-icon-standard text-sunny" />
          <div className="absolute w-2 h-2 rounded-full bg-sunny opacity-0 pointer-events-none petmate-emo-1 bottom-1 left-[-2px]" />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-coral opacity-0 pointer-events-none petmate-emo-2 top-0 right-[-3px]" />
        </div>
      ) : variant === 'training' ? (
        <div className="relative flex items-center justify-center w-full h-full pointer-events-none">
          <div className="petmate-medal z-10 text-current">
            <IconComponent size={iconSize} />
          </div>
          <svg className="absolute w-[95%] h-[95%] text-sunny/60 pointer-events-none z-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="7" className="petmate-medal-ring" style={{ strokeDasharray: 44, strokeDashoffset: 44 }} />
          </svg>
        </div>
      ) : (
        <IconComponent 
          size={iconSize} 
          className={cn(
            "pointer-events-none petmate-primary-icon-standard transition-transform duration-300",
            variant === 'calendar' && "animate-calendar-page-turn"
          )} 
        />
      )}
    </div>
  );
};
