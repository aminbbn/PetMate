import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { BookOpen, AlertCircle, Clock, Heart, ArrowLeft } from 'lucide-react';
import { AnimatedCardIcon } from '../../components/AnimatedCardIcon';

export const WeightContextRail: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'benchmarks' | 'timing' | 'disclaimer'>('benchmarks');

  return (
    <Card
      hoverLift={false}
      className="p-6 md:p-8 border border-coral-light/10 shadow-sm flex flex-col justify-between space-y-6 h-full min-h-[460px]"
    >
      {/* Sidebar Header */}
      <div className="space-y-1 pb-4 border-b border-gray-50 text-right">
        <h4 className="font-black text-gray-800 text-lg flex items-center gap-2">
          <AnimatedCardIcon variant="heart" tone="coral" size="sm" />
          دانستنی‌های رشد و وزن
        </h4>
        <p className="text-xs text-gray-400 font-bold">راهنما و توصیه‌های علمی مراقبت از پت</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-gray-50 p-1 rounded-xl" dir="rtl">
        <button
          type="button"
          onClick={() => setActiveTab('benchmarks')}
          className={`flex-1 py-2 text-[11px] font-black rounded-lg transition-all text-center ${
            activeTab === 'benchmarks'
              ? 'bg-white text-coral shadow-xs'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          محدوده وزن
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('timing')}
          className={`flex-1 py-2 text-[11px] font-black rounded-lg transition-all text-center ${
            activeTab === 'timing'
              ? 'bg-white text-coral shadow-xs'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          زمان طلایی
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('disclaimer')}
          className={`flex-1 py-2 text-[11px] font-black rounded-lg transition-all text-center ${
            activeTab === 'disclaimer'
              ? 'bg-white text-coral shadow-xs'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          پزشکی
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 py-2 text-right overflow-y-auto" dir="rtl">
        {activeTab === 'benchmarks' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex gap-2 items-start">
              <BookOpen size={16} className="text-coral shrink-0 mt-1" />
              <div className="space-y-1">
                <span className="font-black text-sm text-gray-700 block">روند رشد توله‌ها و بالغین</span>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  گربه‌ها و سگ‌ها در مراحل مختلف زندگی الگوهای رشد متفاوتی دارند. توله‌ها تا سن ۱۲ ماهگی رشد مداوم و سریعی دارند که نیاز به سنجش منظم (هفتگی یا دو هفته یک‌بار) دارد.
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-start">
              <Heart size={16} className="text-coral shrink-0 mt-1" />
              <div className="space-y-1">
                <span className="font-black text-sm text-gray-700 block">تعیین محدوده متناسب</span>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  وزن ایده‌آل هر پت به نژاد، جثه، سن و جنسیت او بستگی دارد. به جای تکیه بر جدول‌های عمومی، بهتر است محدوده وزن هدف پت را با مشورت دامپزشک تعیین و ذخیره کنید.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timing' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex gap-2 items-start">
              <Clock size={16} className="text-coral shrink-0 mt-1" />
              <div className="space-y-1">
                <span className="font-black text-sm text-gray-700 block">زمان و شرایط اندازه‌گیری</span>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  توصیه می‌شود اندازه‌گیری وزن همواره در شرایط ثابتی انجام شود:
                </p>
                <ul className="list-disc list-inside text-xs text-gray-500 font-bold space-y-1 mr-2">
                  <li>صبح‌ها قبل از سرو وعده غذایی اصلی</li>
                  <li>پس از ادرار یا دفع مدفوع صبحگاهی</li>
                  <li>با استفاده از یک ترازوی ثابت دیجیتال</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'disclaimer' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex gap-2 items-start bg-coral/5 p-3 rounded-xl border border-coral-light/20">
              <AlertCircle size={18} className="text-coral shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-black text-xs text-coral-deep block">سلب مسئولیت پزشکی</span>
                <p className="text-[11px] text-gray-600 font-bold leading-relaxed">
                  نمودارها و ابزارهای این صفحه جنبه کمکی و مانیتورینگ دارند. تشخیص چاقی، لاغری مفرط یا هرگونه بیماری متابولیک صرفاً بر عهده دامپزشک متخصص است.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Footer Advice */}
      <div className="bg-peach/5 border-t border-gray-50 pt-3 text-right" dir="rtl">
        <span className="text-[10px] text-gray-400 font-black block">دامپزشک پت شما همراه واقعی رشد اوست.</span>
      </div>
    </Card>
  );
};
