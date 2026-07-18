import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { 
  Bot, 
  ArrowRight, 
  Send, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  MessageSquare, 
  ShieldAlert, 
  Heart, 
  Stethoscope, 
  ShieldCheck, 
  HeartPulse, 
  ChevronRight, 
  Lock, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  PhoneCall,
  MapPin,
  ClipboardList
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { toPersian } from '../lib/persian';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  analysis?: string;
  urgency?: 'EMERGENCY_NOW' | 'VET_TODAY' | 'VET_SOON' | 'MONITOR' | 'INSUFFICIENT_INFORMATION';
  clinicalReasoning?: string;
  suggestedQuestions?: string[];
  redFlagsTriggered?: string[];
  isSaved?: boolean;
}

const URGENCY_CONFIG = {
  EMERGENCY_NOW: {
    color: 'bg-red-50 text-red-900 border-red-200 shadow-red-100/50',
    badgeBg: 'bg-red-500 text-white',
    icon: AlertTriangle,
    title: '🚨 وضعیت بحرانی و اورژانسی (مراجعه فوری)',
    desc: 'حیوان خانگی شما دارای علائم قرمز پزشکی حاد است. لطفاً فوراً و بدون فوت وقت به نزدیک‌ترین بیمارستان یا کلینیک دامپزشکی شبانه‌روزی مراجعه کنید. هر دقیقه تأخیر بسیار خطرناک است.',
    tone: 'coral' as const
  },
  VET_TODAY: {
    color: 'bg-orange-50 text-orange-900 border-orange-200 shadow-orange-100/50',
    badgeBg: 'bg-orange-500 text-white',
    icon: AlertCircle,
    title: '⏳ نیازمند بررسی حضوری در همان روز',
    desc: 'علائم پت جدی ارزیابی شده است و نیاز به معاینه فیزیکی دقیق توسط دامپزشک در اولین فرصت امروز دارد. لطفاً با دامپزشک یا کلینیک هماهنگ کنید.',
    tone: 'sunny' as const
  },
  VET_SOON: {
    color: 'bg-amber-50 text-amber-900 border-amber-200 shadow-amber-100/50',
    badgeBg: 'bg-amber-500 text-white',
    icon: Clock,
    title: '🗓️ معاینه و بررسی طی ۲۴ تا ۴۸ ساعت آینده',
    desc: 'علائم در حال حاضر اورژانسی ارزیابی نشده‌اند اما غیرعادی هستند. توصیه می‌شود طی یک تا دو روز آینده نوبت معاینه غیرفوری با دامپزشک هماهنگ کنید.',
    tone: 'sunny' as const
  },
  MONITOR: {
    color: 'bg-slate-50 text-slate-800 border-slate-200 shadow-slate-100/50',
    badgeBg: 'bg-slate-500 text-white',
    icon: ClipboardList,
    title: '📋 پایش مداوم علائم در منزل',
    desc: 'علائم خفیف ارزیابی شده‌اند و خطر فوری شناسایی نشد. رفتارهای عمومی، اشتها و دفع پت را طی ساعات آینده به دقت زیر نظر گرفته و تغییرات را ثبت کنید.',
    tone: 'mint' as const
  },
  INSUFFICIENT_INFORMATION: {
    color: 'bg-blue-50 text-blue-900 border-blue-200 shadow-blue-100/50',
    badgeBg: 'bg-blue-500 text-white',
    icon: Info,
    title: '🔍 نیاز به توضیحات بالینی بیشتر',
    desc: 'اطلاعات ارائه‌شده برای تخمین دقیق سطح خطر کافی نیست. لطفاً رفتارهای عمومی، وضعیت تغذیه، میزان اشتها، استفراغ یا دفع او را با جزئیات بیشتری شرح دهید.',
    tone: 'blue' as const
  }
};

// Fallback icon component for clock in case Clock isn't imported from lucide
function Clock(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export default function Triage() {
  const profile = useAppStore(state => state.profile);
  const pets = useAppStore(state => state.pets || []);
  const setProfile = useAppStore(state => state.setProfile);
  const addHealthRecord = useAppStore(state => state.addHealthRecord);

  const [isAgreed, setIsAgreed] = useState(() => {
    return sessionStorage.getItem('petmate-triage-consented') === 'true';
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [urgencyHistory, setUrgencyHistory] = useState<string[]>([]);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  
  const endRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const hasSentPrefilled = useRef(false);

  // Initialize Welcome Message once consent is given or profile changes
  useEffect(() => {
    if (isAgreed && profile) {
      setMessages([
        {
          id: 'welcome',
          role: 'model',
          content: `سلام! من دستیار غربالگری فوریت‌های پزشکی پت میت (**راهنمای فوریت سلامت**) هستم. بر اساس تغییر رفتار و علائم بالینی گزارش‌شده از **${profile?.name || 'دوست پشمالویتان'}**، سطح فوریت و توصیه‌های ایمنی اولیه را ارزیابی می‌کنم.

چه علائمی در **${profile?.name || 'دوست پشمالویتان'}** مشاهده می‌کنید؟ برای مثال تغییر ناگهانی در فعالیت، اشتها، دفع، سرفه یا وضعیت ظاهری را بنویسید تا بررسی کنم.`,
          suggestedQuestions: [
            `چرا ${profile?.name || 'پت من'} ناگهان کم‌اشتها و بی‌حال شده؟`,
            `اسهال شدید و استفراغ ناگهانی پت نشانه چیست؟`,
            `چه زمانی برای سرفه و بی‌قراری پت باید به دامپزشک مراجعه کرد؟`
          ]
        }
      ]);
      setUrgencyHistory([]);
    }
  }, [isAgreed, profile?.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleConsent = () => {
    sessionStorage.setItem('petmate-triage-consented', 'true');
    setIsAgreed(true);
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          petProfile: profile,
          previousUrgencies: urgencyHistory
        })
      });

      if (!response.ok) {
        throw new Error("اختلال در برقراری ارتباط با سرور ارزیابی بالینی.");
      }

      const data = await response.json();
      
      // Update our local urgency history to ensure monotonic non-downgrading state
      if (data.urgency) {
        setUrgencyHistory(prev => [...prev, data.urgency]);
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.analysis,
        analysis: data.analysis,
        urgency: data.urgency,
        clinicalReasoning: data.clinicalReasoning,
        suggestedQuestions: data.suggestedQuestions,
        redFlagsTriggered: data.redFlagsTriggered
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "اتصال به سیستم هوش مصنوعی با خطا مواجه شد. در صورت اورژانسی بودن علائم (تنگی نفس، بی‌هوشی، تشنج یا مسمومیت)، لطفاً بدون اتلاف وقت مستقیماً به یک کلینیک دامپزشکی شبانه‌روزی مراجعه کنید.",
        urgency: "INSUFFICIENT_INFORMATION"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle prefilled query passed from Dashboard card
  useEffect(() => {
    if (isAgreed && location.state?.prefilled && !hasSentPrefilled.current) {
      hasSentPrefilled.current = true;
      handleSend(location.state.prefilled);
    }
  }, [isAgreed, location.state]);

  const handleSaveToHealth = (msg: Message) => {
    if (!profile || !msg.analysis) return;

    let levelText = 'عادی';
    if (msg.urgency === 'EMERGENCY_NOW') levelText = '🚨 اورژانسی بحرانی';
    else if (msg.urgency === 'VET_TODAY') levelText = '⏳ معاینه سریع امروز';
    else if (msg.urgency === 'VET_SOON') levelText = '🗓️ معاینه طی ۴۸ ساعت';
    else if (msg.urgency === 'MONITOR') levelText = '📋 پایش علائم خانگی';

    const recordTitle = `ارزیابی فوریت سلامت (${levelText})`;
    const recordNotes = `**سطح فوریت:** ${levelText}\n\n**تحلیل و ارزیابی:**\n${msg.analysis}\n\n**منطق کلینیکی:**\n${msg.clinicalReasoning || 'ثبت نشده'}`;

    addHealthRecord({
      title: recordTitle,
      notes: recordNotes,
      kind: 'visit',
      petId: profile.id
    });

    // Mark as saved locally
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isSaved: true } : m));
    
    setSaveSuccess("ارزیابی با موفقیت به عنوان یک پرونده سلامت جدید ذخیره شد!");
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  // Switch pet active profile
  const handlePetSwitch = (petId: string) => {
    const selected = pets.find(p => p.id === petId);
    if (selected) {
      setProfile(selected);
      // Reset chat
      setMessages([]);
      setUrgencyHistory([]);
    }
  };

  // If Consent Screen is NOT completed
  if (!isAgreed) {
    return (
      <div className="p-4 md:p-10 lg:p-12 max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center min-h-[80vh]" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Card 
            glow 
            hoverLift={false}
            className="bg-white border-coral-light/20 shadow-2xl p-8 md:p-12 flex flex-col gap-8 relative overflow-hidden"
          >
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#e85a5d0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Header Identity */}
            <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-gray-100 relative z-10">
              <div className="w-16 h-16 bg-coral/10 text-coral rounded-2xl flex items-center justify-center shrink-0">
                <ShieldAlert size={36} className="animate-pulse" />
              </div>
              <div className="text-center md:text-right space-y-1">
                <span className="bg-coral/10 text-coral-deep text-[10px] px-3 py-1 rounded-full font-black tracking-wider uppercase inline-block">
                  سامانه تریاژ و ارزیابی علائم بالینی (AI)
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-coral-deep">راهنمای فوریت سلامت پت میت</h1>
                <p className="text-gray-500 font-medium text-xs md:text-sm">مشاوره هوشمند فوری برای تشخیص ریسک جانی حیوان خانگی شما</p>
              </div>
            </div>

            {/* Clinical Consent Points */}
            <div className="space-y-5 text-gray-700 text-sm relative z-10 leading-relaxed font-medium">
              <div className="flex gap-4 items-start">
                <span className="w-6 h-6 rounded-lg bg-coral/10 text-coral flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">۱</span>
                <p>
                  <strong className="text-gray-900 block font-black mb-0.5">غربالگری فوریت، نه تشخیص نهایی:</strong>
                  تحلیل‌های این دستیار فقط برای تخمین فوریت پزشکی و طبقه‌بندی خطر بر اساس استانداردهای تریاژ دامپزشکی است. این برنامه تشخیص قطعی صادر نکرده و نسخه تجویز نمی‌کند.
                </p>
              </div>

              <div className="flex gap-4 items-start">
                <span className="w-6 h-6 rounded-lg bg-coral/10 text-coral flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">۲</span>
                <p>
                  <strong className="text-gray-900 block font-black mb-0.5">عدم جایگزینی ویزیت دامپزشک:</strong>
                  نتایج و سطوح ریسک صادر شده تحت هیچ شرایطی جایگزین معاینه بالینی حضوری توسط یک دامپزشک متخصص نمی‌شود. در صورت بروز هرگونه شک یا وخامت، همواره مراجعه حضوری اولویت دارد.
                </p>
              </div>

              <div className="flex gap-4 items-start">
                <span className="w-6 h-6 rounded-lg bg-coral/10 text-coral flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">۳</span>
                <p>
                  <strong className="text-gray-900 block font-black mb-0.5">حریم خصوصی و شفافیت کامل داده‌ها:</strong>
                  مکالمات شما به هیچ‌وجه به صورت عمومی یا خودکار ذخیره نمی‌شوند مگر اینکه به خواست خود دکمه «ذخیره در پرونده سلامت» را در پایان تحلیل بفشارید تا خلاصه آن در گوشی شما ثبت شود.
                </p>
              </div>

              <div className="flex gap-4 items-start bg-red-50/50 p-4 rounded-xl border border-red-100">
                <div className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle size={12} />
                </div>
                <p className="text-xs text-red-800 font-bold leading-relaxed">
                  <strong>هشدار قرمز جانی:</strong> اگر حیوان شما بیهوش شده است، مشکل تنفس یا تشنج دارد، سم خورده یا خونریزی شدید غیرقابل مهار دارد، مکالمه را رها کرده و سریعاً پت را به مرکز اورژانس شبانه‌روزی برسانید.
                </p>
              </div>
            </div>

            {/* Bottom Consent Actions */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                <Lock size={12} className="text-gray-400" />
                <span>اتصال ایمن به موتور بالینی پت میت (طراحی مستقل)</span>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <Link to="/" className="w-1/2 sm:w-auto">
                  <Button variant="outline" className="w-full text-xs font-bold py-3.5 px-6">
                    انصراف و بازگشت
                  </Button>
                </Link>
                <Button 
                  onClick={handleConsent}
                  variant="primary" 
                  className="w-1/2 sm:w-auto text-xs font-black py-3.5 px-8 flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={16} />
                  <span>متوجه شدم و موافقم</span>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Active urgency calculation to render special indicator
  const currentUrgency = urgencyHistory.length > 0 ? urgencyHistory[urgencyHistory.length - 1] : null;

  return (
    <div className="p-4 md:p-8 lg:p-10 space-y-6 max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0 relative" dir="rtl">
      
      {/* Floating Save success Toast notification */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white font-black text-xs md:text-sm px-6 py-4.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-green-500"
          >
            <CheckCircle2 size={18} className="shrink-0 text-white" />
            <span>{saveSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-coral-light/10 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-coral/10 text-coral rounded-xl flex items-center justify-center">
              <HeartPulse size={24} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-coral-deep tracking-tight">راهنمای فوریت سلامت (Triage)</h1>
              <p className="text-gray-400 font-bold text-xs mt-0.5">غربالگری هوشمند فوری تغییر علائم پت جهت تشخیص میزان اضطرار</p>
            </div>
          </div>
        </div>
        
        <Link to="/" className="shrink-0">
          <Button variant="outline" className="py-2.5 px-5 text-xs font-bold flex items-center gap-2">
            <ChevronRight size={14} className="rotate-180" />
            <span>بازگشت به پیشخوان</span>
          </Button>
        </Link>
      </header>

      {/* Main Two-Column Desktop Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 items-stretch">
        
        {/* Left Span 8: Full-fledged Premium Chat Desk */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-3xl border border-coral-light/15 shadow-xl shadow-coral-deep/5 overflow-hidden min-h-[550px] max-h-[750px]">
          
          {/* Active Consultation Header */}
          <div className="bg-peach/30 border-b border-coral-light/10 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs md:text-sm font-black text-gray-700">اتصال ایمن با دستیار ارزیابی فوریت بالینی</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
              <Sparkles size={14} className="text-coral" />
              <span>پشتیبانی‌شده توسط مدل Gemini 3.5</span>
            </div>
          </div>

          {/* Switch Pet / Active Pet selector row */}
          <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 flex flex-wrap items-center gap-2 shrink-0">
            <span className="text-[10px] text-gray-400 font-bold">ارزیابی علائم برای:</span>
            {pets.map((pet) => {
              const isActive = pet.id === profile?.id;
              return (
                <button
                  key={pet.id}
                  onClick={() => handlePetSwitch(pet.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-coral text-white border-coral shadow-sm shadow-coral/15 font-black'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <span>{pet.type === 'dog' ? '🐶' : '🐱'}</span>
                  <span>{pet.name}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                const hasUrgency = msg.urgency && URGENCY_CONFIG[msg.urgency];
                const config = hasUrgency ? URGENCY_CONFIG[msg.urgency!] : null;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row' : 'flex-row-reverse'}`}>
                      {/* Avatar Bubble */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isUser 
                          ? 'bg-coral text-white font-black' 
                          : 'bg-peach text-coral-deep border border-coral-light/20'
                      }`}>
                        {isUser ? '👤' : '🤖'}
                      </div>
                      
                      {/* Text Bubble */}
                      <div className={`rounded-2xl p-4.5 text-sm ${
                        isUser 
                          ? 'bg-coral text-white rounded-tr-none shadow-coral/10 font-bold' 
                          : 'bg-peach/40 text-gray-700 rounded-tl-none border border-coral-light/5'
                      }`}>
                        <div className="prose prose-sm leading-relaxed prose-p:font-medium text-right" dir="rtl">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>

                        {/* If AI Response contains diagnostic assessment */}
                        {!isUser && config && (
                          <div className={`mt-4 p-4.5 rounded-xl border flex flex-col gap-3 ${config.color}`}>
                            <div className="flex items-center gap-2 font-black text-xs md:text-sm">
                              {/* Warning Icon with specific pendulum animation if emergency */}
                              <config.icon size={18} className={`shrink-0 ${
                                msg.urgency === 'EMERGENCY_NOW' ? 'text-red-600 animate-bounce' : 'text-current'
                              }`} />
                              <span>{config.title}</span>
                            </div>
                            <p className="text-xs font-bold leading-relaxed text-gray-800">{config.desc}</p>

                            {/* Clinical Reasoning Details */}
                            {msg.clinicalReasoning && (
                              <div className="bg-white/70 p-3 rounded-lg border border-gray-200/50 text-[11px] space-y-1 text-gray-600">
                                <span className="font-black text-gray-800 block">🔬 مبنای بالینی غربالگری:</span>
                                <p className="leading-relaxed">{msg.clinicalReasoning}</p>
                              </div>
                            )}

                            {/* Save to health / Clinic Finder linkages inside triage cards */}
                            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-200/40 mt-1">
                              
                              {/* Clinical Action: Save to Health Records */}
                              <Button
                                size="sm"
                                variant={msg.isSaved ? 'secondary' : 'primary'}
                                disabled={msg.isSaved}
                                onClick={() => handleSaveToHealth(msg)}
                                className="py-2 px-3 text-[10px] font-black rounded-lg flex items-center gap-1 shrink-0"
                              >
                                {msg.isSaved ? (
                                  <>
                                    <CheckCircle2 size={11} className="text-green-600" />
                                    <span>در پرونده ذخیره شد</span>
                                  </>
                                ) : (
                                  <>
                                    <ClipboardList size={11} />
                                    <span>📥 ذخیره در پرونده سلامت</span>
                                  </>
                                )}
                              </Button>

                              {/* Emergency/High Risk Actions: Clinic Nav linkages */}
                              {msg.urgency === 'EMERGENCY_NOW' && (
                                <Link to="/navigator" className="shrink-0">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="py-2 px-3 text-[10px] font-black rounded-lg flex items-center gap-1 bg-red-600 text-white border-red-600 hover:bg-red-700"
                                  >
                                    <MapPin size={11} />
                                    <span>📍 جستجوی کلینیک شبانه‌روزی</span>
                                  </Button>
                                </Link>
                              )}

                              {/* Mid Risk Actions: Contact Vets Linkage */}
                              {(msg.urgency === 'VET_TODAY' || msg.urgency === 'VET_SOON') && (
                                <Link to="/vets" className="shrink-0">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="py-2 px-3 text-[10px] font-black rounded-lg flex items-center gap-1 border-amber-300 text-amber-800 hover:bg-amber-100"
                                  >
                                    <PhoneCall size={11} />
                                    <span>📞 تماس با دامپزشکان من</span>
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {/* AI Streaming Loading Dots */}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
                <div className="flex gap-3 max-w-[80%] flex-row-reverse">
                  <div className="w-9 h-9 rounded-xl bg-peach text-coral-deep border border-coral-light/20 flex items-center justify-center">
                    🤖
                  </div>
                  <div className="bg-peach/30 px-5 py-4 rounded-2xl rounded-tl-none border border-coral-light/5 flex gap-1.5 items-center h-12">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2.5 h-2.5 bg-coral-light rounded-full" />
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2.5 h-2.5 bg-coral rounded-full" />
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2.5 h-2.5 bg-coral-deep rounded-full" />
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={endRef} />
          </div>

          {/* Interactive Suggested Questions Chips */}
          {messages.length > 0 && !isLoading && (
            <div className="px-6 py-3 border-t border-gray-50 flex flex-wrap gap-2 shrink-0">
              {messages[messages.length - 1]?.suggestedQuestions?.map((q, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSend(q)}
                  className="bg-peach/20 hover:bg-coral/10 hover:text-coral-deep border border-coral-light/10 text-gray-600 text-[10px] md:text-xs font-bold px-3.5 py-2 rounded-xl text-right transition-colors leading-relaxed shrink-0 cursor-pointer"
                >
                  {q}
                </motion.button>
              ))}
            </div>
          )}

          {/* Footer Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 shrink-0">
            <div className="bg-peach/30 p-2 rounded-2xl shadow-inner flex gap-3 border border-coral-light/5">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="تغییر رفتار یا علائمی که در حیوان می‌بینید را شرح دهید..."
                className="flex-1 bg-transparent px-4 py-3 outline-none text-gray-700 placeholder:text-gray-400 font-bold text-xs md:text-sm"
                disabled={isLoading}
              />
              <Button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 rounded-xl p-0 flex items-center justify-center shrink-0 shadow-none bg-coral hover:bg-coral-deep"
              >
                <Send size={18} className="rotate-180" />
              </Button>
            </div>
          </div>

        </div>

        {/* Right Span 4: Clinical Guidance / Active Risk Monitor Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Active Triage Level card */}
          {currentUrgency && URGENCY_CONFIG[currentUrgency as keyof typeof URGENCY_CONFIG] && (() => {
            const config = URGENCY_CONFIG[currentUrgency as keyof typeof URGENCY_CONFIG];
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden"
              >
                <Card
                  glow
                  hoverLift={false}
                  className={`border-2 p-5 ${config.color}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center border border-current/20 text-current">
                        <config.icon size={16} className={currentUrgency === 'EMERGENCY_NOW' ? 'animate-bounce' : ''} />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-gray-400 block font-bold">آخرین ارزیابی فوریت ثبت‌شده:</span>
                        <h4 className="font-black text-sm text-gray-900">{config.title}</h4>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-600 font-medium">{config.desc}</p>
                    
                    {currentUrgency === 'EMERGENCY_NOW' ? (
                      <div className="space-y-2 pt-2 border-t border-red-200">
                        <Link to="/navigator" className="block w-full">
                          <Button size="sm" className="w-full text-xs font-black bg-red-600 hover:bg-red-700 text-white border-none py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-red-500/20">
                            <MapPin size={13} />
                            <span>مسیریاب بیمارستان‌های شبانه‌روزی</span>
                          </Button>
                        </Link>
                        <Link to="/vets" className="block w-full">
                          <Button size="sm" variant="outline" className="w-full text-xs font-black border-red-300 text-red-900 hover:bg-red-100 py-2.5 rounded-xl">
                            تماس با دامپزشکان من
                          </Button>
                        </Link>
                      </div>
                    ) : (currentUrgency === 'VET_TODAY' || currentUrgency === 'VET_SOON') ? (
                      <div className="pt-2 border-t border-amber-200">
                        <Link to="/vets" className="block w-full">
                          <Button size="sm" className="w-full text-xs font-black bg-sunny hover:bg-sunny/90 text-white border-none py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md">
                            <PhoneCall size={13} />
                            <span>تماس سریع با پزشکان معتمد</span>
                          </Button>
                        </Link>
                      </div>
                    ) : null}
                  </div>
                </Card>
              </motion.div>
            );
          })()}

          {/* Clinical Levels Guide Panel */}
          <Card 
            glow 
            hoverLift={false}
            ambientCorner="bottom-right"
            className="bg-white border-sunny/25 shadow-warm-lg flex flex-col justify-between p-6 text-right"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-sunny/15 text-sunny flex items-center justify-center shrink-0 shadow-sm">
                <ShieldAlert size={22} className="stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-gray-900 text-base leading-snug">سطوح غربالگری و فوریت بالینی</h3>
                <p className="text-gray-400 text-[10px] leading-relaxed font-bold">
                  موتور ارزیابی پت میت پاسخ‌های شما را طبق ۵ سطح زیر دسته‌بندی می‌کند:
                </p>
              </div>
            </div>
            
            <div className="space-y-3.5 text-xs font-medium border-t border-gray-100 pt-4">
              <div className="flex gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5 animate-ping" />
                <div>
                  <span className="font-black text-red-700 block mb-0.5">🚨 قرمز (بحرانی - فوری)</span>
                  <span className="text-gray-400 text-[10px]">ریسک جانی بالا؛ لزوم مراجعه بدون وقفه به نزدیک‌ترین اورژانس شبانه‌روزی.</span>
                </div>
              </div>
              <div className="flex gap-2.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                <div>
                  <span className="font-black text-orange-700 block mb-0.5">⏳ نارنجی (ویزیت حضوری امروز)</span>
                  <span className="text-gray-400 text-[10px]">علائم جدی؛ مراجعه حضوری به کلینیک در اولین فرصت ساعات آینده.</span>
                </div>
              </div>
              <div className="flex gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <div>
                  <span className="font-black text-amber-700 block mb-0.5">🗓️ زرد (ویزیت ظرف ۴۸ ساعت)</span>
                  <span className="text-gray-400 text-[10px]">شرایط غیرحاد؛ هماهنگی برای معاینه غیرفوری طی یک الی دو روز آینده.</span>
                </div>
              </div>
              <div className="flex gap-2.5">
                <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                <div>
                  <span className="font-black text-slate-700 block mb-0.5">📋 خاکستری (پایش علائم خانگی)</span>
                  <span className="text-gray-400 text-[10px]">علائم خفیف؛ پایش رفتار، فعالیت، اشتها و دفع حیوان در محیط آرام خانه.</span>
                </div>
              </div>
              <div className="flex gap-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                <div>
                  <span className="font-black text-blue-700 block mb-0.5">🔍 آبی (نیاز به اطلاعات بیشتر)</span>
                  <span className="text-gray-400 text-[10px]">اطلاعات کافی نیست؛ لزوم توصیف شرایط عمومی حیوان با جزئیات بیشتر.</span>
                </div>
              </div>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
}
