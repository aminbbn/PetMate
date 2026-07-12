import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Bot, ArrowRight, Send, AlertTriangle, Info, CheckCircle2, Sparkles, MessageSquare, ShieldAlert, Heart, Stethoscope } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { toPersian } from '../lib/persian';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  urgency?: 'SUCCESS' | 'CAUTION' | 'ALERT';
}

export default function Triage() {
  const profile = useAppStore(state => state.profile);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      content: `سلام! من دستیار هوشمند تریآژ سلامت پت میت هستم. من بر اساس علائم حیوان خانگی شما، فوریت‌های پزشکی و وضعیت اضطراری او را ارزیابی می‌کنم. 

چه علائمی در **${profile?.name || 'دوست پشمالویتان'}** مشاهده می‌کنید؟ لطفا تغییر رفتار، وضعیت اشتها یا علائم ظاهری را توضیح دهید تا شما را راهنمایی کنم.`,
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const hasSentPrefilled = useRef(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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
        })
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.content,
        urgency: data.urgency,
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "در حال حاضر در اتصال به هوش مصنوعی مشکلی پیش آمده است. لطفاً چند لحظه دیگر دوباره تلاش کنید یا در صورت اورژانسی بودن علائم، بلافاصله با کلینیک دامپزشکی شبانه‌روزی تماس بگیرید.",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.prefilled && !hasSentPrefilled.current) {
      hasSentPrefilled.current = true;
      handleSend(location.state.prefilled);
    }
  }, [location.state]);

  const UrgencyCard = ({ level }: { level: 'SUCCESS' | 'CAUTION' | 'ALERT' }) => {
    const config = {
      SUCCESS: { 
        color: 'bg-green-50 text-green-700 border-green-200 shadow-green-100/30', 
        icon: CheckCircle2, 
        title: 'وضعیت عادی (سبز)',
        text: 'علائم نگران‌کننده شدیدی مشاهده نشد. مراقبت‌های خانگی و نظارت مداوم کافی است.' 
      },
      CAUTION: { 
        color: 'bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100/30', 
        icon: Info, 
        title: 'وضعیت مراقبتی (زرد)',
        text: 'لطفاً علائم حیوان را در ساعات آینده به دقت زیر نظر بگیرید. در صورت بدتر شدن با دامپزشک تماس بگیرید.' 
      },
      ALERT: { 
        color: 'bg-red-50 text-red-700 border-red-200 shadow-red-100/30', 
        title: 'وضعیت اضطراری (قرمز)',
        icon: AlertTriangle, 
        text: 'علائم نشان‌دهنده نیاز به بررسی فوری پزشکی است. لطفاً در سریع‌ترین زمان ممکن به کلینیک دامپزشکی مراجعه فرمایید.' 
      },
    };
    const { color, icon: Icon, title, text } = config[level];

    return (
      <div className={`mt-4 p-5 rounded-2xl border shadow-sm flex flex-col gap-2 ${color}`}>
        <div className="flex items-center gap-2 font-black text-sm">
          <Icon size={18} className="shrink-0" />
          <span>{title}</span>
        </div>
        <p className="text-xs font-bold leading-relaxed">{text}</p>
      </div>
    );
  };

  const suggestedQuestions = [
    `چرا ${profile?.name || 'پت من'} ناگهان کم‌اشتها شده؟`,
    `اسهال شدید و استفراغ ناگهانی نشانه چیست؟`,
    `دمای طبیعی بدن ${profile?.type === 'dog' ? 'سگ‌ها' : 'گربه‌ها'} چقدر است؟`,
    `چه زمانی برای عطسه و سرفه باید به دامپزشک مراجعه کرد؟`,
  ];

  return (
    <div className="p-10 lg:p-12 space-y-8 max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0" dir="rtl">
      
      {/* Page Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-coral-light/10 shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-coral/10 text-coral rounded-xl flex items-center justify-center">
              <Bot size={22} />
            </div>
            <h1 className="text-3xl font-black text-coral-deep">دستیار هوشمند تریآژ سلامت (AI)</h1>
          </div>
          <p className="text-gray-500 font-medium mt-1">مشاوره هوشمند فوری برای تشخیص فوریت‌های سلامت حیوان خانگی</p>
        </div>
        
        <Link to="/">
          <Button variant="outline" className="py-2 px-5 text-xs font-bold">
            بازگشت به پیشخوان
          </Button>
        </Link>
      </header>

      {/* Main Two-Column Desktop Chat Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0 items-stretch">
        
        {/* Left Span 8: Full-fledged Premium Chat Desk */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-3xl border border-coral-light/15 shadow-xl shadow-coral-deep/5 overflow-hidden min-h-[600px] max-h-[720px]">
          
          {/* Active Consultation Indicator Header */}
          <div className="bg-peach/30 border-b border-coral-light/10 px-6 py-4.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-black text-gray-700">اتصال ایمن با دستیار ارزیابی بالینی</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
              <Sparkles size={14} className="text-coral" />
              <span>پشتیبانی شده توسط هوش مصنوعی</span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
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
                      <div className={`rounded-2xl p-5 shadow-sm text-sm ${
                        isUser 
                          ? 'bg-coral text-white rounded-tr-none shadow-coral/10 font-bold' 
                          : 'bg-peach/40 text-gray-700 rounded-tl-none border border-coral-light/5'
                      }`}>
                        <div className="prose prose-sm leading-relaxed prose-p:font-medium">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                        {msg.urgency && <UrgencyCard level={msg.urgency} />}
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

          {/* Footer Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 shrink-0">
            <div className="bg-peach/30 p-2.5 rounded-2xl shadow-inner flex gap-3 border border-coral-light/5">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="توضیح دهید چه علائم یا تغییری در حیوان خود می‌بینید..."
                className="flex-1 bg-transparent px-4 py-3 outline-none text-gray-700 placeholder:text-gray-400 font-bold text-sm"
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

        {/* Right Span 4: Clinical Guidance / Suggested Prompting Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Suggested FAQs to input instantly */}
          <Card className="bg-white border border-coral-light/10 p-6" hoverEffect={false}>
            <h3 className="font-black text-gray-800 text-base mb-4 flex items-center gap-2.5">
              <MessageSquare size={18} className="text-coral" />
              پرسش‌های متداول و شایع
            </h3>
            <p className="text-gray-400 text-xs mb-4 leading-relaxed font-bold">برای ارسال فوری، بر روی هر کدام کلیک کنید:</p>
            
            <div className="space-y-2.5">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="w-full text-right text-xs font-bold text-gray-600 bg-peach/20 hover:bg-coral/5 hover:text-coral-deep p-3.5 rounded-xl border border-coral-light/5 transition-all cursor-pointer leading-relaxed"
                  disabled={isLoading}
                >
                  {q}
                </button>
              ))}
            </div>
          </Card>

          {/* Explanatory Guide Card */}
          <Card 
            glow 
            glowColor="sunny" 
            hoverEffect={true}
            ambientCorner="bottom-right"
            className="bg-white border-sunny/25 shadow-warm-lg flex flex-col justify-between p-6 text-right"
          >
            <div className="flex items-start gap-5 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-sunny/15 text-sunny flex items-center justify-center shrink-0 shadow-sm shadow-sunny/10 relative overflow-visible group-hover:bg-sunny/20 group-hover:shadow-md transition-all duration-500">
                <ShieldAlert size={24} className="stroke-[2.2] group-hover:scale-110 group-hover:rotate-[-5deg] transition-all duration-500 z-10" />
                
                {/* 4 Custom Sunny Star Shards with curved trajectory smooth animations */}
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current text-sunny absolute left-1/2 top-1/2 opacity-0 pointer-events-none animate-shard-smooth-1 z-0 drop-shadow-[0_0_8px_rgba(255,181,107,0.95)]">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-current text-sunny absolute left-1/2 top-1/2 opacity-0 pointer-events-none animate-shard-smooth-2 z-0 drop-shadow-[0_0_8px_rgba(255,181,107,0.95)]">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] fill-current text-sunny absolute left-1/2 top-1/2 opacity-0 pointer-events-none animate-shard-smooth-3 z-0 drop-shadow-[0_0_8px_rgba(255,181,107,0.95)]">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
                <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] fill-current text-sunny absolute left-1/2 top-1/2 opacity-0 pointer-events-none animate-shard-smooth-4 z-0 drop-shadow-[0_0_8px_rgba(255,181,107,0.95)]">
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="font-black text-gray-900 text-lg leading-snug">راهنمای سطوح فوریت پزشکی</h3>
                <p className="text-gray-500 text-xs leading-relaxed font-medium">
                  سیستم تریآژ سلامت پت میت پس از ارزیابی پاسخ‌های شما یکی از سطوح زیر را اعلام می‌کند:
                </p>
              </div>
            </div>
            
            <div className="space-y-3 text-xs font-medium border-t border-gray-100 pt-4">
              <div className="flex gap-2.5">
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0 mt-1.5" />
                <div>
                  <span className="font-black text-green-700 block mb-0.5">سبز (عادی)</span>
                  <span className="text-gray-400">نیاز به مراجعه فوری نیست، مراقبت در منزل کافی است.</span>
                </div>
              </div>
              <div className="flex gap-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <div>
                  <span className="font-black text-amber-700 block mb-0.5">زرد (مراقبتی)</span>
                  <span className="text-gray-400">تحت نظارت داشته باشید، آماده برای مشورت پزشک باشید.</span>
                </div>
              </div>
              <div className="flex gap-2.5">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5" />
                <div>
                  <span className="font-black text-red-700 block mb-0.5">قرمز (اضطراری)</span>
                  <span className="text-gray-400">مراجعه فوری به کلینیک شبانه‌روزی الزامی است.</span>
                </div>
              </div>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
}
