import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, Bone, Compass, HeartPulse, BrainCircuit, Activity, Heart } from 'lucide-react';
import { Card } from '../Card';

export const AIFeaturesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'triage' | 'nutrition' | 'translator' | 'coach'>('triage');

  const aiTools = {
    triage: {
      title: 'دستیار تریاژ و عارضه‌یاب هوشمند',
      desc: 'نگران تغییر ناگهانی رفتار پت هستید؟ علائم ظاهری (مانند بی‌اشتهایی یا بی‌حالی) را در قالب گفتگو بنویسید؛ هوش مصنوعی پت‌میت با بررسی دقیق الگوها، سطح اورژانسی بودن موضوع را سنجیده و اقدامات فوری مورد نیاز را قبل از مراجعه به کلینیک به شما آموزش می‌دهد.',
      pills: ['بررسی فوری بیماری', 'سطح‌بندی اورژانسی', 'راهنمای گام به گام تا دامپزشک'],
      icon: HeartPulse,
      conversation: [
        { sender: 'user', text: 'پشمک امروز از صبح بی‌حال شده، سه بار استفراغ کرده و آب هم زیاد نمی‌خوره. چه کاری باید بکنم؟' },
        { sender: 'ai', text: 'با توجه به بالا آمدن بی‌حالی به همراه امتناع از نوشیدن آب، پشمک در وضعیت تریاژ متوسط مایل به اورژانس قرار دارد. توصیه می‌شود:\n۱. برای ۱۲ ساعت از دادن غذای سفت خودداری کنید.\n۲. مقدار کمی آب در ظرف‌های کوچک جلویش بگذارید.\n۳. حتماً رنگ لثه‌ها را پایش کنید. در صورت زرد یا رنگ‌پریده بودن لثه، بلافازه به نزدیک‌ترین کلینیک دامپزشکی مراجعه نمایید.' }
      ]
    },
    nutrition: {
      title: 'برنامه‌ریز تغذیه و سلامت فیزیکی',
      desc: 'بسته به نژاد، سن، میزان سوخت و ساز و وضعیت فیزیکی حیوان شما، هوش مصنوعی پت‌میت دقیق‌ترین فرمول غذایی را از نظر کالری، پروتئین، ریزمغذی‌ها و فواصل غذایی ایده‌آل پیشنهاد می‌دهد تا حیوان دچار اضافه وزن یا سوء‌تغذیه نشود.',
      pills: ['محاسبه دقیق کالری', 'تنظیم رژیم کاهش وزن', 'جایگزین‌های حساسیت غذایی'],
      icon: Bone,
      conversation: [
        { sender: 'user', text: 'فیدو سگ ژرمن ۳ ساله من اضافه وزن داره و به مرغ حساسیت پوستی نشون میده.' },
        { sender: 'ai', text: 'توصیه تغذیه‌ای مبتنی بر آلرژی برای فیدو:\n۱. کالری روزانه مورد نیاز جهت کاهش وزن تدریجی: ۱,۴۲۰ کیلوکالری.\n۲. پروتئین جایگزین پیشنهادی: غذای بر پایه گوشت بره و برنج قهوه‌ای.\n۳. افزودن اسیدهای چرب امگا ۳ (روغن ماهی) جهت تسکین سریع عوارض و خارش‌های پوستی.' }
      ]
    },
    translator: {
      title: 'مترجم شگفت‌انگیز عواطف و رفتار',
      desc: 'حرکات دم، گوش‌ها و نوع زوزه‌ها یا میوهای حیوان، همگی حامل پیام‌های ویژه‌ای هستند. مترجم هوش مصنوعی پت‌میت با تجزیه و تحلیل زبان بدن و فرکانس‌های صوتی، احساسات پنهانی دوست وفادارتان را کشف و ترجمه می‌کند.',
      pills: ['کشف معنی نوع صداها', 'تحلیل تصویری زبان بدن', 'افزایش هم‌بستگی عاطفی'],
      icon: MessageSquare,
      conversation: [
        { sender: 'user', text: 'گربه‌ام هم‌زمان که آروم خرخر (Purr) می‌کنه، دمش رو تندتند می‌کوبه زمین. معنیش چیه؟' },
        { sender: 'ai', text: 'تفسیر زبان بدن گربه شما:\nخرخر کردن همیشه به معنی خوشحالی کامل نیست. کوبیدن دم به زمین همراه با خرخر نشان‌دهنده تعارض عاطفی یا تحریک بیش از حد (Overstimulation) است. گربه شما احتمالاً در حال بازی بوده اما اکنون خسته شده و نیاز به فضای آرام و بدون نوازش دارد.' }
      ]
    },
    coach: {
      title: 'مربی شخصی تربیت و رفتارشناسی',
      desc: 'اصلاح ناهنجاری‌ها و آموزش ترفندهای جذاب با تکنیک‌های مدرن رفتارشناسی حیوانات. از رفع پارس کردن بی‌مورد تا پیاده‌روی بدون کشیدن قلاده، همه چیز به صورت بسته‌های آموزشی متناسب با شخصیت پت شما ارائه می‌شود.',
      pills: ['فرمان‌پذیری مقدماتی', 'آموزش هم‌قدم شدن', 'رفع اضطراب تنهایی'],
      icon: Compass,
      conversation: [
        { sender: 'user', text: 'وقتی من می‌رم بیرون، سگم به شدت ناله و پارس می‌کنه و در خانه را چنگ می‌زنه.' },
        { sender: 'ai', text: 'این علائم نشانه بارز «اضطراب تنهایی» است. تکنیک درمانی:\n۱. خروج‌های تمرینی کوتاه (در حد ۳۰ ثانیه تا ۵ دقیقه) بدون خداحافظی سوزناک انجام دهید.\n۲. قبل از رفتن، یک اسباب‌بازی تشویقی پر شده بگذارید تا ذهنش مشغول شود.\n۳. هرگز هنگام بازگشت تا زمانی که آرام نشده به او هیجان و پاداش ندهید.' }
      ]
    }
  };

  const tabs = [
    { id: 'triage', label: 'تریاژ هوشمند', icon: HeartPulse },
    { id: 'nutrition', label: 'تغذیه هوشمند', icon: Bone },
    { id: 'translator', label: 'مترجم عواطف', icon: MessageSquare },
    { id: 'coach', label: 'مربی هوشمند', icon: Compass },
  ];

  return (
    <section id="ai" className="relative py-24 md:py-32 bg-[#FFFBF9]" dir="rtl">
      
      {/* Visual background lights */}
      <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-coral rounded-full blur-[120px] opacity-[0.03] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-sunny rounded-full blur-[140px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-16">
        
        {/* Header content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8 text-right space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-coral/10 border border-coral-light/15 text-coral font-bold text-xs">
              <BrainCircuit className="w-4 h-4 text-coral animate-pulse" />
              <span>هوش مصنوعی با درک و عاطفه عمیق</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
              وقتی تکنولوژی در خدمت مهربانی قرار می‌گیرد
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl font-normal">
              با استفاده از نسل جدید مدل‌های زبانی آموزش‌دیده بر سوابق دامپزشکی و رفتارشناسی حیوانات، پت‌میت هر روز در کنار شماست تا نشانه‌های بالینی را کشف، عواطف را ترجمه و تغذیه پت را مهندسی کند.
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <span className="text-xs font-bold text-gray-400 border border-gray-100 px-4 py-2.5 rounded-2xl bg-white/50 backdrop-blur-xs">
              ✓ هماهنگ با استانداردهای نظام دامپزشکی
            </span>
          </div>
        </div>

        {/* Dynamic AI Playground Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* TABS SELECTOR - Right side on desktop */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm text-right transition-all duration-300 cursor-pointer border shrink-0 lg:shrink ${
                    isActive
                      ? 'bg-white border-coral-light/20 text-coral shadow-warm-md translate-x-1 lg:translate-x-[-8px]'
                      : 'bg-transparent border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100/50'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-coral text-white scale-110 shadow-md shadow-coral/20' : 'bg-gray-100 text-gray-400'}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* DYNAMIC SHOWCASE CONTAINER - Left side on desktop */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6"
              >
                {/* Text Explainer Card */}
                <div className="md:col-span-6 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="font-sans font-black text-2xl text-gray-900 leading-tight">
                      {aiTools[activeTab].title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed font-normal">
                      {aiTools[activeTab].desc}
                    </p>
                  </div>

                  {/* Pills List */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-black tracking-wide text-gray-400 block uppercase">قابلیت‌های برجسته زیرسیستم</span>
                    <div className="flex flex-wrap gap-2">
                      {aiTools[activeTab].pills.map((pill, idx) => (
                        <span key={idx} className="bg-coral/5 border border-coral-light/10 text-coral text-[10px] font-bold px-3 py-1.5 rounded-xl">
                          ✦ {pill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Simulated Conversation UI Card */}
                <div className="md:col-span-6 bg-white border border-coral-light/10 shadow-warm-lg p-5 rounded-[28px] space-y-4 flex flex-col h-[320px] relative overflow-hidden">
                  
                  {/* Card Header details */}
                  <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-coral animate-pulse" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase">محیط گفتگوی شبیه‌سازی‌شده</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-coral bg-coral/5 px-2.5 py-1 rounded-lg">
                      <Sparkles className="w-3.5 h-3.5" />
                      دستیار آنلاین
                    </div>
                  </div>

                  {/* Conversation Threads Scroll Area */}
                  <div className="flex-1 space-y-3.5 overflow-y-auto pr-1">
                    {aiTools[activeTab].conversation.map((msg, idx) => {
                      const isUser = msg.sender === 'user';
                      return (
                        <div
                          key={idx}
                          className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`p-3.5 rounded-[20px] text-xs leading-relaxed max-w-[85%] text-right font-normal ${
                            isUser
                              ? 'bg-gray-100 text-gray-700 rounded-tr-none'
                              : 'bg-coral text-white shadow-md shadow-coral/10 rounded-tl-none font-medium'
                          }`}>
                            <div className="whitespace-pre-line">{msg.text}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Glowing background decor */}
                  <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-coral rounded-full blur-[45px] opacity-[0.06]" />
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};
