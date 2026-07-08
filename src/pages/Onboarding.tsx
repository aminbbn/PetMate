import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Sparkles, Heart } from 'lucide-react';
import { toPersian } from '../lib/persian';

export default function Onboarding() {
  const setProfile = useAppStore(state => state.setProfile);
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    name: '',
    type: 'dog' as 'dog' | 'cat',
    breed: '',
    age: '',
    weight: '',
  });

  const nextStep = () => setStep(s => s + 1);

  const handleSubmit = () => {
    setProfile({
      id: crypto.randomUUID(),
      name: data.name,
      type: data.type,
      breed: data.breed,
      age: Number(data.age) || 0,
      weight: Number(data.weight) || 0,
    });
    // Add a default reminder for today in Farsi
    useAppStore.getState().addReminder('تنظیم برنامه منظم تغذیه', new Date().toISOString());
  };

  return (
    <div className="min-h-screen bg-peach/30 flex items-center justify-center p-12 relative overflow-hidden" dir="rtl">
      {/* Decorative premium ambient glow background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-coral-light/20 rounded-full blur-[140px] -translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sunny/15 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4" />
      
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step-0"
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="text-center max-w-2xl w-full"
          >
            <div className="w-28 h-28 bg-coral text-white rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-coral/25 relative">
              <Heart size={56} fill="currentColor" />
              <div className="absolute -top-3 -left-3 bg-sunny text-white p-2 rounded-xl animate-bounce">
                <Sparkles size={18} />
              </div>
            </div>
            <h1 className="text-5xl font-black text-coral-deep mb-6 leading-tight">به پت میت خوش آمدید</h1>
            <p className="text-gray-600 mb-12 max-w-lg mx-auto text-xl leading-relaxed font-normal">
              همراه گرم، هوشمند و همیشه مراقب شما برای شاد و سالم نگه داشتن دوست دوست‌داشتنی و پشمالویتان در تمام مراحل زندگی.
            </p>
            <Button size="lg" className="w-full max-w-md mx-auto py-5 text-lg" onClick={nextStep}>
              شروع کنیم و با دوست جدید آشنا شویم
            </Button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-xl"
          >
            <Card className="p-10 border border-coral-light/20 shadow-2xl shadow-coral-deep/5" hoverEffect={false}>
              <h2 className="text-3xl font-bold text-coral-deep mb-4 text-center">چه حیوانی را اضافه می‌کنیم؟</h2>
              <p className="text-gray-500 text-center mb-10">لطفاً نوع دوست جدید خود و نام شیرین او را بنویسید.</p>
              
              <div className="grid grid-cols-2 gap-6 mb-10">
                <Card 
                  className={`cursor-pointer border-2 transition-all p-8 text-center ${
                    data.type === 'dog' 
                      ? 'border-coral bg-coral/5 shadow-md shadow-coral/5' 
                      : 'border-gray-100 hover:border-coral-light/50 bg-white'
                  }`}
                  onClick={() => setData({ ...data, type: 'dog' })}
                  hoverEffect={true}
                >
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-6xl filter drop-shadow">🐶</span>
                    <span className={`font-bold text-xl ${data.type === 'dog' ? 'text-coral-deep' : 'text-gray-600'}`}>سگ دوست‌داشتنی</span>
                  </div>
                </Card>
                <Card 
                  className={`cursor-pointer border-2 transition-all p-8 text-center ${
                    data.type === 'cat' 
                      ? 'border-coral bg-coral/5 shadow-md shadow-coral/5' 
                      : 'border-gray-100 hover:border-coral-light/50 bg-white'
                  }`}
                  onClick={() => setData({ ...data, type: 'cat' })}
                  hoverEffect={true}
                >
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-6xl filter drop-shadow">🐱</span>
                    <span className={`font-bold text-xl ${data.type === 'cat' ? 'text-coral-deep' : 'text-gray-600'}`}>گربه نازپرورده</span>
                  </div>
                </Card>
              </div>

              <div className="space-y-4 mb-10">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">اسم دوست پشمالوت چیه؟</label>
                  <input 
                    type="text" 
                    value={data.name}
                    onChange={e => setData({ ...data, name: e.target.value })}
                    className="w-full bg-peach/30 border border-coral-light/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-coral/50 shadow-sm text-lg font-bold text-gray-800 transition-all placeholder:text-gray-400"
                    placeholder="مثلا پشمک، برفی، لئو..."
                  />
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full py-4.5" 
                onClick={nextStep}
                disabled={!data.name}
              >
                مرحله بعدی و دریافت اطلاعات بیشتر
              </Button>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-xl"
          >
            <Card className="p-10 border border-coral-light/20 shadow-2xl shadow-coral-deep/5" hoverEffect={false}>
              <h2 className="text-3xl font-bold text-coral-deep mb-4 text-center">چند جزئیات جذاب دیگر</h2>
              <p className="text-gray-500 text-center mb-10">این جزئیات به ما کمک می‌کنند تا توصیه‌های دقیق‌تری به شما ارائه دهیم.</p>
              
              <div className="space-y-6 mb-10">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">نژاد دوستت (اختیاری)</label>
                  <input 
                    type="text" 
                    value={data.breed}
                    onChange={e => setData({ ...data, breed: e.target.value })}
                    className="w-full bg-peach/30 border border-coral-light/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-coral/50 shadow-sm text-lg text-gray-800 placeholder:text-gray-400"
                    placeholder="مثلا شیتزو، پرشین، ژرمن شفرد..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">سن (سال)</label>
                    <input 
                      type="number" 
                      value={data.age}
                      onChange={e => setData({ ...data, age: e.target.value })}
                      className="w-full bg-peach/30 border border-coral-light/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-coral/50 shadow-sm text-lg font-bold text-gray-800 text-center"
                      placeholder="مثلاً ۳"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">وزن (کیلوگرم)</label>
                    <input 
                      type="number" 
                      value={data.weight}
                      onChange={e => setData({ ...data, weight: e.target.value })}
                      className="w-full bg-peach/30 border border-coral-light/10 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-coral/50 shadow-sm text-lg font-bold text-gray-800 text-center"
                      placeholder="مثلاً ۵.۵"
                      step="0.1"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full py-4.5" 
                onClick={handleSubmit}
              >
                تکمیل نهایی پرونده و ورود به پیشخوان
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
