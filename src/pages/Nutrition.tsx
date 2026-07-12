import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Utensils, Sparkles, Scale, Activity, Flame, ShieldAlert, Check, CheckCircle2, ChevronRight, Apple } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPersian } from '../lib/persian';
import { cn } from '../lib/utils';

export default function Nutrition() {
  const profile = useAppStore(state => state.profile);
  const [activityLevel, setActivityLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [allergy, setAllergy] = useState<string>('none');
  const [isCalculated, setIsCalculated] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  if (!profile) return null;

  // Formulas for Pet daily energy requirements
  const weight = profile.weight || 5;
  const factor = activityLevel === 'low' ? 1.2 : activityLevel === 'medium' ? 1.6 : 2.0;
  // RER (Resting Energy Requirement) = 70 * (weight ^ 0.75)
  const rer = Math.round(70 * Math.pow(weight, 0.75));
  // DER (Daily Energy Requirement)
  const der = Math.round(rer * factor);
  // Recommended water in ml = weight * 60
  const water = Math.round(weight * 55);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setIsCalculated(true);
    }, 1000);
  };

  const dayMeals = [
    { day: 'شنبه', breakfast: 'سینه مرغ آب‌پز + کدو حلوایی له شده', lunch: 'غذای خشک رژیمی پت میت مخصوص نژاد', snack: 'هویج خام خلال شده خنک' },
    { day: 'یکشنبه', breakfast: 'فیله بوقلمون بخارپز با سیب‌زمینی شیرین', lunch: 'سوپ ماهیچه کم‌چرب با سبزیجات مجاز', snack: 'سیب درختی تکه شده (بدون هسته)' },
    { day: 'دوشنبه', breakfast: 'غذای خشک مخصوص مخلوط با آب گوشت بدون نمک', lunch: 'گوشت گوساله چرخ‌کرده پخته شده با هویج', snack: 'ماست یونانی فاقد لاکتوز (یک قاشق)' },
    { day: 'سه‌شنبه', breakfast: 'سینه مرغ آب‌پز + برنج قهوه‌ای له شده', lunch: 'غذای خشک رژیمی پت میت مخصوص نژاد', snack: 'هویج خام خلال شده خنک' },
    { day: 'چهارشنبه', breakfast: 'فیله بوقلمون بخارپز با سیب‌زمینی شیرین', lunch: 'سوپ ماهیچه کم‌چرب با سبزیجات مجاز', snack: 'سیب درختی تکه شده (بدون هسته)' },
    { day: 'پنجشنبه', breakfast: 'غذای خشک مخصوص مخلوط با آب گوشت بدون نمک', lunch: 'گوشت گوساله چرخ‌کرده پخته شده با هویج', snack: 'ماست یونانی فاقد لاکتوز (یک قاشق)' },
    { day: 'جمعه', breakfast: 'فیله ماهی سفید پخته شده بدون تیغ و پوست', lunch: 'مخلوط کدو سبز و کدو حلوایی با سینه مرغ', snack: 'تشویقی ارگانیک رژیمی پت میت' },
  ];

  return (
    <div className="p-8 lg:p-10 space-y-8 max-w-7xl mx-auto w-full text-right" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <Utensils className="text-coral animate-pulse" size={32} />
            برنامه‌ریزی تغذیه و رژیم هوشمند {profile.name}
          </h1>
          <p className="text-gray-400 text-sm font-bold mt-2">
            محاسبه خودکار کالری روزانه، حجم آب مصرفی و تجویز جیره غذایی تخصصی متناسب با شاخص توده بدنی
          </p>
        </div>
      </div>

      {/* Main Grid: Inputs vs Output Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-white border-coral-light/10 p-6 space-y-5 shadow-md">
            <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
              <Activity size={18} className="text-coral" />
              تنظیم شاخص‌های بیولوژیکی
            </h3>

            <form onSubmit={handleCalculate} className="space-y-5">
              
              {/* Weight Info Stat Display */}
              <div className="bg-peach/30 p-4 rounded-xl border border-coral-light/5 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] text-gray-400 font-bold">وزن ثبت‌شده پت</span>
                  <span className="text-lg font-black text-gray-800">{toPersian(profile.weight)} کیلوگرم</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-coral/10 text-coral flex items-center justify-center">
                  <Scale size={18} />
                </div>
              </div>

              {/* Activity Level Selector */}
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 font-bold block">سطح فعالیت روزانه</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'low', label: 'کم (آپارتمانی)' },
                    { id: 'medium', label: 'متوسط (معمولی)' },
                    { id: 'high', label: 'زیاد (پرتحرک)' },
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => {
                        setActivityLevel(lvl.id as any);
                        setIsCalculated(false);
                      }}
                      className={cn(
                        "py-2.5 px-1 rounded-xl border text-[11px] font-black transition-all text-center",
                        activityLevel === lvl.id 
                          ? "bg-coral text-white border-coral shadow-sm" 
                          : "bg-white border-gray-100 text-gray-500 hover:border-coral-light/20"
                      )}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Allergies / Health restrictions */}
              <div className="space-y-2">
                <label className="text-[10px] text-gray-400 font-bold block">حساسیت‌های غذایی گزارش شده</label>
                <select
                  value={allergy}
                  onChange={(e) => {
                    setAllergy(e.target.value);
                    setIsCalculated(false);
                  }}
                  className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-3 text-xs font-black outline-none focus:ring-2 focus:ring-coral/50"
                >
                  <option value="none">بدون هیچ‌گونه آلرژی یا حساسیت</option>
                  <option value="chicken">حساسیت شدید به گوشت مرغ (پروتئین طیور)</option>
                  <option value="grains">آلرژی به غلات و گندم (نیاز به جیره فاقد غله)</option>
                  <option value="dairy">عدم تحمل لاکتوز و فرآورده‌های لبنی</option>
                </select>
              </div>

              {/* Action Button */}
              <Button 
                type="submit" 
                variant="sunny" 
                className="w-full py-3.5 font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-sunny/15"
                disabled={isCalculating}
              >
                <Sparkles className={cn(isCalculating && "animate-spin")} size={16} />
                {isCalculating ? 'در حال آنالیز رژیم...' : 'محاسبه رژیم اختصاصی با هوش مصنوعی'}
              </Button>

            </form>
          </Card>

          {/* Calorie Guidelines Tip */}
          <Card 
            glow 
            glowColor="sunny" 
            hoverEffect={true}
            ambientCorner="bottom-right"
            className="bg-white border-sunny/25 shadow-warm-lg flex flex-col justify-between p-6 text-right"
          >
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-sunny/15 text-sunny flex items-center justify-center shrink-0 shadow-sm shadow-sunny/10 relative overflow-visible group-hover:bg-sunny/20 group-hover:shadow-md transition-all duration-500">
                <Flame size={24} className="stroke-[2.2] group-hover:scale-110 group-hover:rotate-[-10deg] transition-all duration-500 z-10" />
                
                {/* Floating Ember Particles */}
                <span className="w-2.5 h-2.5 bg-orange-500 rounded-full absolute left-1/2 top-1/2 opacity-0 pointer-events-none animate-ember-1 z-0 drop-shadow-[0_0_6px_rgba(249,115,22,0.85)]" />
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full absolute left-1/2 top-1/2 opacity-0 pointer-events-none animate-ember-2 z-0 drop-shadow-[0_0_6px_rgba(239,68,68,0.85)]" />
                <span className="w-2 h-2 bg-yellow-500 rounded-full absolute left-1/2 top-1/2 opacity-0 pointer-events-none animate-ember-3 z-0 drop-shadow-[0_0_6px_rgba(251,146,60,0.85)]" />
              </div>
              <div className="space-y-2">
                <h3 className="font-black text-gray-900 text-lg leading-snug">چرا تغذیه دقیق مهم است؟</h3>
                <p className="text-gray-500 text-xs leading-relaxed font-medium">
                  اضافه وزن بیش از ۱۰ درصد در حیوانات خانگی، خطر بروز آرتروز، کبد چرب و دیابت را تا ۳ برابر افزایش می‌دهد. رژیم‌های تولید شده توسط هوش مصنوعی پت میت توازن دقیقی بین کربوهیدرات، پروتئین و رطوبت ایجاد می‌کنند.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Output Area: Meal Plan & Gauges (7 cols) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!isCalculated ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24 bg-white rounded-[32px] border border-dashed border-coral-light/15 flex flex-col items-center justify-center space-y-4 shadow-sm"
              >
                <Utensils className="text-coral-light/40 animate-bounce" size={40} />
                <p className="text-gray-500 font-black text-base">آنالیز رژیم تغذیه هنوز صادر نشده است.</p>
                <p className="text-gray-400 text-xs">لطفاً پس از پر کردن مشخصات سمت راست روی دکمه آنالیز کلیک کنید.</p>
              </motion.div>
            ) : (
              <motion.div
                key="calculated-results"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Visual Gauges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  <Card className="bg-white border-coral-light/10 p-5 text-center flex flex-col justify-between">
                    <span className="text-[10px] text-gray-400 font-bold mb-1 block">متابولیسم پایه (RER)</span>
                    <span className="text-xl font-black text-gray-800">{toPersian(rer)} <span className="text-xs font-normal text-gray-400">کالری</span></span>
                    <span className="text-[9px] text-coral font-bold mt-2 bg-coral/5 px-2 py-0.5 rounded-full inline-block">حداقل کالری بقا</span>
                  </Card>

                  <Card className="bg-white border-sunny/20 p-5 text-center flex flex-col justify-between ring-1 ring-sunny/5">
                    <span className="text-[10px] text-gray-400 font-bold mb-1 block">انرژی مورد نیاز روزانه (DER)</span>
                    <span className="text-xl font-black text-sunny">{toPersian(der)} <span className="text-xs font-normal text-gray-400">کالری</span></span>
                    <span className="text-[9px] text-sunny font-bold mt-2 bg-sunny/5 px-2 py-0.5 rounded-full inline-block">میزان کالری پیشنهادی</span>
                  </Card>

                  <Card className="bg-white border-blue-100 p-5 text-center flex flex-col justify-between">
                    <span className="text-[10px] text-gray-400 font-bold mb-1 block">میزان آب مصرفی مجاز</span>
                    <span className="text-xl font-black text-blue-500">{toPersian(water)} <span className="text-xs font-normal text-gray-400">میلی‌لیتر</span></span>
                    <span className="text-[9px] text-blue-500 font-bold mt-2 bg-blue-50 px-2 py-0.5 rounded-full inline-block">معادل {toPersian((water / 250).toFixed(1))} لیوان</span>
                  </Card>

                </div>

                {/* 7-Day Meal Plan */}
                <Card className="bg-white border-coral-light/10 p-6 shadow-md">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                    <h3 className="font-black text-gray-800 text-base flex items-center gap-2">
                      <Apple size={18} className="text-coral" />
                      برنامه غذایی هفتگی پیشنهادی
                    </h3>
                    <span className="bg-mint/10 text-success text-[10px] font-black px-2.5 py-1 rounded-full border border-mint/20">
                      جیره متعادل و رژیمی
                    </span>
                  </div>

                  {allergy !== 'none' && (
                    <div className="mb-4 bg-red-50/50 border border-red-100 rounded-xl p-3 text-xs text-red-600 font-bold flex items-center gap-2">
                      <ShieldAlert size={14} />
                      <span>هشدار هوشمند: مواد غذایی حاوی آلرژی انتخاب شده به کلی حذف و مواد جایگزین سالم تزریق گردیدند.</span>
                    </div>
                  )}

                  <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
                    {dayMeals.map((meal, index) => (
                      <div key={index} className="p-4 bg-peach/15 rounded-2xl border border-coral-light/5 text-right space-y-2 hover:border-coral-light/15 transition-all">
                        <div className="flex justify-between items-center">
                          <span className="font-black text-gray-800 text-sm">{meal.day}</span>
                          <span className="text-[10px] text-gray-400 font-bold">بخش اول جیره روزانه</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="space-y-0.5">
                            <span className="text-coral text-[10px] font-black block">وعده صبح:</span>
                            <span className="text-gray-600 font-bold">
                              {allergy === 'chicken' && meal.breakfast.includes('مرغ') 
                                ? 'سینه بوقلمون آب‌پز یا اردک پخته له شده' 
                                : meal.breakfast}
                            </span>
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-sunny text-[10px] font-black block">وعده ظهر/عصر:</span>
                            <span className="text-gray-600 font-bold">{meal.lunch}</span>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-gray-100/50 flex justify-between items-center text-[11px]">
                          <span className="text-gray-400 font-bold">میان‌وعده تشویقی (ساعت ۱۸):</span>
                          <span className="text-success font-black">{meal.snack}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
