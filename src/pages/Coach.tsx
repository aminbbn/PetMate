import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Award, CheckCircle2, Flame, HelpCircle, ArrowLeft, ArrowRight, Play, Sparkles, Star, Shield, HelpCircle as InfoIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPersian } from '../lib/persian';
import { cn } from '../lib/utils';

interface Lesson {
  id: string;
  title: string;
  level: 'مقدماتی' | 'متوسط' | 'پیشرفته';
  duration: string;
  description: string;
  steps: string[];
  aiTip: string;
}

export default function Coach() {
  const profile = useAppStore(state => state.profile);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'completed'>('all');

  if (!profile) return null;

  const dogLessons: Lesson[] = [
    {
      id: 'sit',
      title: 'آموزش اصولی نشستن (Sit)',
      level: 'مقدماتی',
      duration: '۵ دقیقه در روز',
      description: 'یکی از کلیدی‌ترین و اساسی‌ترین فرمان‌ها که پایه و اساس یادگیری بقیه رفتارهاست.',
      steps: [
        'یک تکه تشویقی کوچک و جذاب را جلوی بینی سگ خود بگیرید تا بوی آن را حس کند.',
        'دست خود را به آرامی به سمت بالا و عقب (بالای سر سگ) حرکت دهید تا با چشمانش آن را دنبال کند.',
        'همان‌طور که سرش بالا می‌آید، غریزه سگ باعث می‌شود بخش عقبی بدنش پایین برود و روی زمین بنشیند.',
        'به محض اینکه کاملاً نشست، کلمه کلیدی "آفرین" را بگویید و تشویقی را به او بدهید.',
        'این حرکت را روزی ۵ تا ۱۰ بار تکرار کنید تا با شنیدن نام فرمان "بشین" آن را انجام دهد.'
      ],
      aiTip: 'هرگز سگ خود را به زور روی زمین فشار ندهید! این کار باعث مقاومت غریزی او شده و یادگیری را کاملاً مختل می‌کند. همواره صبور باشید.'
    },
    {
      id: 'leash',
      title: 'آموزش هم‌قدم شدن بدون کشیدن قلاده',
      level: 'متوسط',
      duration: '۱۰ دقیقه در روز',
      description: 'یک پیاده‌روی دلپذیر و باکیفیت بدون اینکه حیوان دائم شما را به این طرف و آن طرف بکشد.',
      steps: [
        'در محیطی آرام پیاده‌روی را شروع کنید. به محض اینکه قلاده کشیده شد، فوراً بایستید و حرکت نکنید.',
        'صبر کنید تا سگ به عقب نگاه کند یا به سمت شما بازگردد و قلاده کاملاً شل شود.',
        'به محض شل شدن قلاده، فرمان "همقدم" را بدهید و به راه خود ادامه دهید.',
        'هر زمان که سگ در کنار پای شما بدون کشش راه رفت، با دادن تشویقی از او قدردانی کنید.',
        'این تمرین را در محیط‌های شلوغ‌تر تکرار کنید تا تمرکز حیوان روی شما تقویت شود.'
      ],
      aiTip: 'قلاده‌های متری به سگ یاد می‌دهند که کشش بیشتر مساوی است با آزادی بیشتر! برای این آموزش موقتاً از قلاده معمولی ثابت استفاده کنید.'
    },
    {
      id: 'barking',
      title: 'مهار و کنترل پارس‌های بی‌جا',
      level: 'پیشرفته',
      duration: '۸ دقیقه در روز',
      description: 'مدیریت و اصلاح صدای بیجا هنگام ورود مهمان، زنگ در یا دیدن اشیاء جدید.',
      steps: [
        'علت پارس (ترس، بازی، نگهبانی) را پیدا کنید. در مواجهه با عامل، با صدای کاملاً آرام بگویید "ساکت".',
        'یک تشویقی جذاب را نزدیک بینی سگ بگیرید تا بوی آن را بکشد. سگ‌ها نمی‌توانند هم‌زمان هم بو بکشند و هم پارس کنند!',
        'به محض سکوت به مدت ۵ ثانیه، تشویقی را به او بدهید.',
        'به تدریج زمان سکوت مورد نیاز برای دریافت تشویقی را تا ۱۵ ثانیه افزایش دهید.',
        'در صورت تکرار پارس، با آرامش و بی‌توجهی کامل به کار خود ادامه دهید و او را به اتاق دیگری هدایت کنید.'
      ],
      aiTip: 'پارس کردن مجاز است تا زمانی که شما فرمان "ساکت" را صادر کنید. فریاد کشیدن بر سر سگ، پارس او را افزایش می‌دهد چون فکر می‌کند شما هم با او هم‌سرایی می‌کنید!'
    }
  ];

  const catLessons: Lesson[] = [
    {
      id: 'litter',
      title: 'آموزش و سازگاری با خاک و جعبه توالت',
      level: 'مقدماتی',
      duration: '۳ بار در روز',
      description: 'ساده‌ترین و غریزی‌ترین آموزش برای گربه‌ها جهت استفاده دقیق از خاک اختصاصی.',
      steps: [
        'جعبه خاک را در مکانی کاملاً آرام، کم‌رفت‌وآمد و به دور از ظرف غذا قرار دهید.',
        'بلافاصله بعد از بیدار شدن گربه یا صرف غذا، او را به آرامی درون جعبه خاک قرار دهید.',
        'اجازه دهید خاک را بو کند و پنجه بکشد. هرگز او را مجبور نکنید پنجه‌هایش را به زور روی خاک بکشد.',
        'به محض اینکه کار خود را انجام داد، با لحنی شاد و نوازش‌های ملایم او را تشویق کنید.',
        'اگر خطا کرد، محل را فوراً با شوینده‌های فاقد آمونیاک کاملاً تمیز و بی‌بو کنید.'
      ],
      aiTip: 'گربه‌ها روی تمیزی به شدت حساس هستند. جعبه خاک کثیف بزرگترین دلیل ادرار در جاهای خارج از ظرف است. هر روز خاک را نظافت کنید.'
    },
    {
      id: 'highfive',
      title: 'آموزش بزن قدش (High Five) با گربه',
      level: 'متوسط',
      duration: '۳ دقیقه در روز',
      description: 'یک شیرین‌کاری شاداب و سرگرم‌کننده که رابطه عاطفی شما را به شدت تحکیم می‌کند.',
      steps: [
        'در وضعیتی راحت روبروی گربه بنشینید و یک تشویقی بسیار لذیذ (مثل خمیر تشویقی) در مشت خود بگیرید.',
        'مشت خود را نزدیک گربه نگه دارید. غریزه او تلاش می‌کند تا با پنجه مشت شما را لمس کند یا باز کند.',
        'به محض اینکه پنجه‌اش به دست شما خورد، دست را باز کنید و بگذارید تشویقی را لیس بزند.',
        'این حرکت را تکرار کنید و کلمه کلیدی "بزن قدش" را با لحنی شاد هم‌زمان بگویید.',
        'به مرور ارتفاع دست خود را بالاتر ببرید تا دست به دست گربه بخورد و فرمان تثبیت شود.'
      ],
      aiTip: 'تمرکز گربه‌ها بسیار کوتاه‌تر از سگ‌هاست. جلسات تمرینی را بیشتر از ۳ دقیقه ادامه ندهید تا گربه دل‌زده نشود.'
    },
    {
      id: 'scrapper',
      title: 'آموزش عدم خراشیدن مبل و استفاده از اسکرچر',
      level: 'پیشرفته',
      duration: '۵ دقیقه در روز',
      description: 'هدایت غریزه پنجه کشیدن گربه از لوازم منزل و مبل‌ها به سمت اسکرچرهای استاندارد.',
      steps: [
        'اسکرچر را دقیقاً در مجاورت مبل یا محلی که گربه به آن علاقه دارد مستحکم قرار دهید.',
        'روی اسکرچر مقداری گیاه سنبل‌الطیب (کپ‌نیپ) بپاشید تا گربه به شدت به آن جذب شود.',
        'هر زمان که گربه به سمت مبل رفت، به آرامی صدایی مثل "هیس" تولید کنید و او را به سمت اسکرچر ببرید.',
        'به محض اینکه ناخن‌هایش را روی اسکرچر کشید، او را نوازش کرده و تشویقی مایع بدهید.',
        'روی مبل‌های آسیب‌پذیر را موقتاً با کاورهای پلاستیکی یا چسب‌های دوطرفه بپوشانید چون گربه‌ها از بافت چسبناک بیزارند.'
      ],
      aiTip: 'ناخن کشیدن برای گربه یک نیاز بیولوژیکی جهت علامت‌گذاری قلمرو و اصلاح لایه‌های مرده ناخن است؛ هرگز جلوی این رفتار طبیعی را نگیرید، بلکه محل آن را مدیریت کنید.'
    }
  ];

  const lessons = profile.type === 'dog' ? dogLessons : catLessons;
  const filteredLessons = activeTab === 'all' 
    ? lessons 
    : lessons.filter(l => completedLessons.includes(l.id));

  const handleCompleteLesson = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
    setSelectedLesson(null);
    setCurrentStepIndex(0);
  };

  return (
    <div className="p-8 lg:p-10 space-y-8 max-w-7xl mx-auto w-full text-right" dir="rtl">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <Award className="text-coral animate-pulse" size={34} />
            مربی تمرین هوشمند {profile.name}
          </h1>
          <p className="text-gray-400 text-sm font-bold mt-2">
            آموزش‌های علمی، گام‌به‌گام و اخلاقی متناسب با ویژگی‌های رفتاری حیوان شما
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-coral-light/20 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-coral/10 text-coral flex items-center justify-center">
            <Flame className="animate-bounce" size={20} />
          </div>
          <div>
            <span className="block text-[10px] text-gray-400 font-bold">جلسات تکمیل‌شده</span>
            <span className="text-sm font-black text-gray-800">{toPersian(completedLessons.length)} از {toPersian(lessons.length)} فرمان</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedLesson ? (
          // LESSONS LIST VIEW
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-gray-100 pb-2">
              <button
                onClick={() => setActiveTab('all')}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-xs font-black transition-all",
                  activeTab === 'all' 
                    ? "bg-coral text-white shadow-sm shadow-coral/15" 
                    : "text-gray-500 hover:bg-peach/30"
                )}
              >
                همه فرمان‌های تمرینی
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-xs font-black transition-all",
                  activeTab === 'completed' 
                    ? "bg-coral text-white shadow-sm shadow-coral/15" 
                    : "text-gray-500 hover:bg-peach/30"
                )}
              >
                تکمیل‌شده‌ها ({toPersian(completedLessons.length)})
              </button>
            </div>

            {filteredLessons.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[32px] border border-dashed border-coral-light/15 flex flex-col items-center justify-center space-y-4">
                <Star size={40} className="text-coral-light/50" />
                <p className="text-gray-500 font-black text-sm">فرمانی در این دسته یافت نشد.</p>
                <p className="text-gray-400 text-xs">آموزش اولین درس را از تب کناری شروع کنید!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredLessons.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  return (
                    <Card 
                      key={lesson.id} 
                      className="bg-white border-coral-light/10 p-6 flex flex-col justify-between hover:scale-[1.02] cursor-pointer"
                      onClick={() => {
                        setSelectedLesson(lesson);
                        setCurrentStepIndex(0);
                      }}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-[10px] font-black px-2.5 py-1 rounded-full border",
                            lesson.level === 'مقدماتی' ? 'bg-mint/10 text-success border-mint/20' :
                            lesson.level === 'متوسط' ? 'bg-sunny/10 text-sunny border-sunny/20' :
                            'bg-coral/10 text-coral border-coral/20'
                          )}>
                            {lesson.level}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold">{lesson.duration}</span>
                        </div>
                        <h3 className="font-black text-gray-800 text-lg">{lesson.title}</h3>
                        <p className="text-xs text-gray-400 leading-relaxed truncate">{lesson.description}</p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                        {isCompleted ? (
                          <span className="text-success text-xs font-black flex items-center gap-1">
                            <CheckCircle2 size={16} />
                            آموزش با موفقیت تکمیل شده
                          </span>
                        ) : (
                          <span className="text-coral-deep text-xs font-black flex items-center gap-1">
                            <Play size={14} className="fill-current" />
                            شروع جلسه تمرین
                          </span>
                        )}
                        <span className="text-[10px] text-gray-300 font-bold">{lesson.steps.length} گام علمی</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          // ACTIVE STEP-BY-STEP WORKFLOW VIEW
          <motion.div
            key="active-lesson"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Side: Lesson Steps Card (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <Card className="bg-white border-coral-light/20 p-8 shadow-xl space-y-6">
                
                {/* Lesson Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="space-y-1">
                    <span className="text-[10px] text-coral font-black tracking-wider bg-coral/5 px-2.5 py-1 rounded-full uppercase">آموزش گام‌به‌گام</span>
                    <h2 className="text-2xl font-black text-gray-800 mt-2">{selectedLesson.title}</h2>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedLesson(null)}
                    className="py-1 px-3 text-xs"
                  >
                    بازگشت به مربی
                  </Button>
                </div>

                {/* Progress Indicators */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-400">
                    <span>پیشرفت گام‌ها</span>
                    <span>گام {toPersian(currentStepIndex + 1)} از {toPersian(selectedLesson.steps.length)}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-coral h-full transition-all duration-300"
                      style={{ width: `${((currentStepIndex + 1) / selectedLesson.steps.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Current Active Step Body */}
                <div className="py-8 bg-peach/20 rounded-[24px] border border-coral-light/5 p-6 text-center space-y-4">
                  <div className="w-14 h-14 bg-coral text-white rounded-2xl flex items-center justify-center text-xl font-black mx-auto shadow-md shadow-coral/20">
                    {toPersian(currentStepIndex + 1)}
                  </div>
                  <motion.p 
                    key={currentStepIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-gray-700 font-bold text-lg leading-relaxed max-w-xl mx-auto"
                  >
                    {selectedLesson.steps[currentStepIndex]}
                  </motion.p>
                </div>

                {/* Step Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    disabled={currentStepIndex === 0}
                    onClick={() => setCurrentStepIndex(prev => prev - 1)}
                    className="flex items-center gap-1.5 text-xs font-black"
                  >
                    <ArrowRight size={16} />
                    گام قبلی
                  </Button>

                  {currentStepIndex < selectedLesson.steps.length - 1 ? (
                    <Button
                      variant="primary"
                      onClick={() => setCurrentStepIndex(prev => prev + 1)}
                      className="flex items-center gap-1.5 text-xs font-black shadow-sm"
                    >
                      گام بعدی
                      <ArrowLeft size={16} />
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => handleCompleteLesson(selectedLesson.id)}
                      className="bg-success hover:bg-success/90 border-transparent text-white flex items-center gap-1.5 text-xs font-black shadow-sm"
                    >
                      تکمیل و پایان این فرمان!
                      <CheckCircle2 size={16} />
                    </Button>
                  )}
                </div>

              </Card>
            </div>

            {/* Right Side: AI Tip Card (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              <Card glow glowColor="sunny" className="bg-gradient-to-br from-white to-sunny/5 border-sunny/20 p-6 space-y-4">
                <h3 className="font-black text-gray-800 text-base flex items-center gap-2">
                  <Sparkles className="text-sunny" size={18} />
                  نکته طلایی مربی هوشمند
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-bold">
                  {selectedLesson.aiTip}
                </p>
              </Card>

              <Card className="bg-white border-coral-light/10 p-6 space-y-4">
                <h4 className="font-black text-gray-800 text-sm flex items-center gap-2">
                  <Shield size={16} className="text-coral" />
                  اصول مراقبتی پت میت
                </h4>
                <ul className="text-[11px] text-gray-400 space-y-2.5 list-disc pr-4 font-bold">
                  <li>تمرینات را با معده پر انجام ندهید.</li>
                  <li>در صورت بروز بی‌حوصلگی، سریعاً تمرین را قطع و بازی کنید.</li>
                  <li>لحن صدای شما مهم‌ترین ابزار پاداش است.</li>
                </ul>
              </Card>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
