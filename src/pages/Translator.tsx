import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Smile, Sparkles, Volume2, ShieldAlert, Heart, Star, CheckCircle2, MessageSquare, Clipboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPersian } from '../lib/persian';
import { cn } from '../lib/utils';

interface BehaviorCue {
  id: string;
  name: string;
  category: 'vocal' | 'body';
  type: 'dog' | 'cat' | 'both';
  emotion: string;
  translation: string;
  advice: string;
}

export default function Translator() {
  const profile = useAppStore(state => state.profile);
  const [activeTab, setActiveTab] = useState<'vocal' | 'body'>('vocal');
  const [selectedCueId, setSelectedCueId] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState<BehaviorCue | null>(null);

  if (!profile) return null;

  const dogCues: BehaviorCue[] = [
    {
      id: 'dc-1',
      name: 'پارس کردن کوتاه با ریتم تند و پیوسته',
      category: 'vocal',
      type: 'dog',
      emotion: 'آماده‌باش و محافظت از قلمرو',
      translation: '«یک نفر داره نزدیک در خونه می‌شه! من باید به صاحبم خبر بدم!»',
      advice: 'سعی نکنید با داد زدن او را ساکت کنید، این کار پارس کردن را بیشتر می‌کند. به آرامی از او تشکر کنید و فرمان ساکت بدهید.'
    },
    {
      id: 'dc-2',
      name: 'ناله‌های ممتد با تن صدای بسیار کم (Whining)',
      category: 'vocal',
      type: 'dog',
      emotion: 'کلافگی، انتظار یا وجود درد مبهم',
      translation: '«من حوصلم سر رفته، یا شاید هم باید به دستشویی برم! لطفاً به من توجه کن.»',
      advice: 'ابتدا وضعیت آب، جیره غذایی و زمان پیاده‌روی او را بررسی کنید. در صورت تداوم ممکن است نشانه‌ای از یک ناراحتی فیزیکی باشد.'
    },
    {
      id: 'dc-3',
      name: 'خوابیدن روی دست‌ها با بالا نگه داشتن باسن (Play Bow)',
      category: 'body',
      type: 'dog',
      emotion: 'تمایل شدید به بازی و نشاط عاطفی',
      translation: '«هی! بیا با من بازی کن! من کاملاً شارژم و دارم بهت دعوتنامه بازی می‌فرستم!»',
      advice: 'این یک رفتار صد درصد مثبت است! بهترین زمان برای آموزش مربی هوشمند یا پرتاب توپ تنیس برای تخلیه انرژی سگ است.'
    },
    {
      id: 'dc-4',
      name: 'پایین انداختن کامل دم و پنهان کردن آن بین پاها',
      category: 'body',
      type: 'dog',
      emotion: 'ترس شدید، اضطراب محیطی یا تسلیم‌شدن',
      translation: '«من احساس امنیت نمی‌کنم. این صدا یا این آدم جدید منو به شدت ترسونده.»',
      advice: 'او را از عامل ترس دور کنید. او را در آغوش نگیرید (زیرا فکر می‌کند ترس کار درستی است) بلکه با لحنی استوار و آرام به او امنیت بدهید.'
    }
  ];

  const catCues: BehaviorCue[] = [
    {
      id: 'cc-1',
      name: 'صدای خرخر نرم و مداوم (Purring)',
      category: 'vocal',
      type: 'cat',
      emotion: 'رضایت عمیق، آرامش عصبی یا خوددرمانی',
      translation: '«من در کنار تو کاملاً احساس خوشبختی و آرامش دارم و دارم خودمو ریست می‌کنم.»',
      advice: 'به نوازش آرام زیر گلو و پشت گوش‌ها ادامه دهید. فرکانس خرخر گربه‌ها اثر تسکین‌دهنده بر سلامت روانی شما نیز دارد.'
    },
    {
      id: 'cc-2',
      name: 'میو کوتاه و خشک با تن صدای بالا',
      category: 'vocal',
      type: 'cat',
      emotion: 'سلام و احوالپرسی یا تقاضای مکرر',
      translation: '«سلام رفیق! غذای من کو؟ یا شاید هم در کمد رو واسم باز کنی!»',
      advice: 'گربه‌ها فقط برای انسان‌ها میو می‌کنند! او دارد مستقیماً با شما مکالمه می‌کند. ظرف آب و غذایش را چک کنید.'
    },
    {
      id: 'cc-3',
      name: 'ماساژ دادن پتو یا پاهای شما با پنجه‌ها (Kneading)',
      category: 'body',
      type: 'cat',
      emotion: 'ابراز عشق عمیق، امنیت کامل و نوستالژی نوزادی',
      translation: '«تو مثل مادر من هستی و من در امن‌ترین و گرم‌ترین حالت ممکن در آغوشت هستم.»',
      advice: 'این رفتار از دوران شیرخوارگی به ارث رسیده است. برای جلوگیری از خراش ناخن‌ها، آنها را منظم کوتاه کنید ولی هرگز مانع بروز این رفتار عاشقانه نشوید.'
    },
    {
      id: 'cc-4',
      name: 'تکان دادن موجی و عصبی نوک دم (Tail Twitching)',
      category: 'body',
      type: 'cat',
      emotion: 'کلافگی، تحریک بیش از حد یا خشم خفیف',
      translation: '«دیگه وست ندارم نوازشم کنی! داری کلافم می‌کنی، لطفاً یکم تنهام بذار.»',
      advice: 'برعکس سگ‌ها، تکان دادن دم در گربه نشانه‌ی هشدار است! فوراً نوازش کردن را متوقف کنید تا گربه پنجه نکشد یا دندان نگیرد.'
    }
  ];

  const cues = profile.type === 'dog' ? dogCues : catCues;
  const filteredCues = cues.filter(c => c.category === activeTab);

  const handleTranslate = () => {
    if (!selectedCueId) return;
    setIsTranslating(true);
    setTranslationResult(null);
    
    setTimeout(() => {
      const matched = cues.find(c => c.id === selectedCueId);
      if (matched) {
        setTranslationResult(matched);
      }
      setIsTranslating(false);
    }, 1200);
  };

  return (
    <div className="p-8 lg:p-10 space-y-8 max-w-7xl mx-auto w-full text-right" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <Smile className="text-coral animate-swing" size={32} />
            مترجم رفتار و احساسات {profile.name}
          </h1>
          <p className="text-gray-400 text-sm font-bold mt-2">
            رمزگشایی هوشمند آواها، حرکات دم، گوش‌ها و سیگنال‌های بدنی ظریف برای درک زبان واقعی حیوان شما
          </p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Select Cue (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-white border-coral-light/10 p-6 space-y-5 shadow-md">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-gray-800 text-base flex items-center gap-2">
                <Volume2 size={18} className="text-coral" />
                انتخاب نشانه یا سیگنال رفتاری
              </h3>
            </div>

            {/* Vocal / Body tabs */}
            <div className="flex gap-2 bg-peach/20 p-1.5 rounded-xl border border-coral-light/5">
              <button
                onClick={() => {
                  setActiveTab('vocal');
                  setSelectedCueId(null);
                  setTranslationResult(null);
                }}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-black transition-all text-center",
                  activeTab === 'vocal' ? "bg-white text-coral shadow-sm" : "text-gray-500 hover:text-gray-800"
                )}
              >
                آواها و صداها
              </button>
              <button
                onClick={() => {
                  setActiveTab('body');
                  setSelectedCueId(null);
                  setTranslationResult(null);
                }}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-black transition-all text-center",
                  activeTab === 'body' ? "bg-white text-coral shadow-sm" : "text-gray-500 hover:text-gray-800"
                )}
              >
                زبان بدن و حرکات
              </button>
            </div>

            {/* Cue items list */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {filteredCues.map(cue => (
                <button
                  key={cue.id}
                  onClick={() => {
                    setSelectedCueId(cue.id);
                    setTranslationResult(null);
                  }}
                  className={cn(
                    "w-full text-right p-3.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between",
                    selectedCueId === cue.id 
                      ? "bg-coral/5 text-coral border-coral shadow-sm" 
                      : "bg-white border-gray-100 text-gray-500 hover:border-coral-light/10 hover:bg-gray-50/50"
                  )}
                >
                  <span>{cue.name}</span>
                  {selectedCueId === cue.id && (
                    <CheckCircle2 size={16} className="text-coral" />
                  )}
                </button>
              ))}
            </div>

            {/* Translate Button */}
            <Button
              onClick={handleTranslate}
              variant="sunny"
              className="w-full py-3.5 font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-sunny/15"
              disabled={!selectedCueId || isTranslating}
            >
              <Sparkles className={cn(isTranslating && "animate-spin")} size={14} />
              {isTranslating ? 'در حال رمزگشایی سیگنال...' : 'ترجمه هوشمند رفتار'}
            </Button>

          </Card>

          {/* AI Advisor Card */}
          <Card glow glowColor="coral" className="bg-gradient-to-br from-white to-coral-light/5 border-coral-light/20 p-6 space-y-4">
            <h3 className="font-black text-gray-800 text-base flex items-center gap-2">
              <Heart className="text-coral" size={18} />
              رابطه عمیق‌تر با {profile.name}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed font-bold">
              تعبیر رفتارها بر اساس اصول روانشناسی و بیولوژی رفتارشناسی حیوانات است. شناخت بهتر زبان بدن، از سوءتفاهم‌های رفتاری جلوگیری کرده و رابطه پیوندی عاطفی شما را تا ۲ برابر مستحکم‌تر می‌کند.
            </p>
          </Card>
        </div>

        {/* Right Side: Translation Result Card (7 cols) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {isTranslating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-28 bg-white rounded-[32px] border border-coral-light/10 shadow-sm flex flex-col items-center justify-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-peach/40 flex items-center justify-center text-coral-deep animate-ping">
                  <Volume2 size={32} />
                </div>
                <p className="text-gray-500 font-black text-sm">در حال آنالیز فرکانس صوتی و ریتم بدنی...</p>
              </motion.div>
            ) : translationResult ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Result Card */}
                <Card glow glowColor="coral" className="bg-white border-coral-light/20 p-8 space-y-6 shadow-xl relative overflow-hidden">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="space-y-1">
                      <span className="text-[10px] text-coral font-black tracking-wider bg-coral/5 px-2.5 py-1 rounded-full uppercase">رمزگشایی موفق رفتارشناسی</span>
                      <h2 className="text-lg font-black text-gray-400 mt-2">عامل محرک: {translationResult.name}</h2>
                    </div>
                  </div>

                  {/* Emotion Display */}
                  <div className="bg-peach/20 rounded-[24px] p-5 border border-coral-light/5 text-right space-y-2">
                    <span className="text-[10px] text-gray-400 font-bold block">حس و وضعیت احساسی</span>
                    <span className="text-xl font-black text-coral-deep">{translationResult.emotion}</span>
                  </div>

                  {/* Speech Balloon translation */}
                  <div className="bg-sunny/10 rounded-[24px] p-6 border border-sunny/20 text-center space-y-3 relative">
                    <div className="absolute right-8 -bottom-3 w-6 h-6 bg-sunny/10 border-r border-b border-sunny/20 transform rotate-45 z-10" />
                    <span className="text-[10px] text-sunny-deep font-black block uppercase tracking-wider">ترجمه به زبان انسان 🗣️</span>
                    <p className="text-gray-800 font-black text-xl leading-relaxed max-w-xl mx-auto">
                      {translationResult.translation}
                    </p>
                  </div>

                  {/* Actionable Advice */}
                  <div className="space-y-2 pt-4">
                    <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                      <Clipboard size={14} className="text-coral" />
                      توصیه رفتاری و نحوه برخورد سرپرست
                    </span>
                    <p className="text-xs text-gray-600 leading-relaxed font-bold bg-gray-50/50 p-4 rounded-xl border border-gray-100/60">
                      {translationResult.advice}
                    </p>
                  </div>

                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-36 bg-white rounded-[32px] border border-dashed border-coral-light/15 flex flex-col items-center justify-center space-y-4 shadow-sm"
              >
                <MessageSquare className="text-coral-light/40 animate-pulse" size={40} />
                <p className="text-gray-500 font-black text-base">آماده شنیدن زبان حیوان خانگی شما هستیم.</p>
                <p className="text-gray-400 text-xs">نشانه رفتاری را از سمت چپ انتخاب کرده و روی دکمه ترجمه کلیک کنید.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
