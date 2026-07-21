import React from 'react';
import { Heart, Mail, ShieldCheck, Sparkles } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-[#FFFDFB] border-t border-gray-100 py-16" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4 text-right">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-coral rounded-xl flex items-center justify-center text-white shadow-md">
              <Heart className="w-4.5 h-4.5 fill-current" />
            </div>
            <span className="font-black text-xl text-gray-900 tracking-tight">پت‌میت</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
            پت‌میت پلتفرم هوشمند مراقبت، پایش رشد و سلامت الکترونیکی حیوانات خانگی است که دغدغه‌های روزمره نگهداری را به لذتی ماندگار تبدیل می‌کند.
          </p>
          <div className="flex items-center gap-2 pt-2 text-xs font-bold text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>پشتیبانی شبانه‌روزی حامیان پت‌میت</span>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="md:col-span-3 space-y-4 text-right">
          <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider">بخش‌های اصلی پلتفرم</h4>
          <ul className="space-y-2.5 text-xs font-bold text-gray-600">
            <li><a href="#capabilities" className="hover:text-coral transition-colors">امکانات رفاهی و سلامت</a></li>
            <li><a href="#ai" className="hover:text-coral transition-colors">هوش مصنوعی و تریاژ</a></li>
            <li><a href="#workflow" className="hover:text-coral transition-colors">روال‌های کاری روزانه</a></li>
            <li><a href="#services" className="hover:text-coral transition-colors">مسیریابی خدمات محلی</a></li>
          </ul>
        </div>

        {/* Legal / Contact Column */}
        <div className="md:col-span-4 space-y-4 text-right">
          <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider">تماس و ارتباط با حامیان</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            پیشنهادات، گزارش‌ها یا پیام‌های خود را به صورت مستقیم از طریق ایمیل پشتیبانی با ما درمیان بگذارید.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-50 border border-gray-100 p-3 rounded-xl">
            <Mail className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="font-mono">support@petmate.ir</span>
          </div>
        </div>

      </div>

      {/* Under-footer credits */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
        <span>© {new Date().getFullYear()} پت‌میت. تمامی حقوق محفوظ و متعلق به حامیان حیوانات خانگی است.</span>
        <div className="flex items-center gap-1.5 font-bold">
          <span>طراحی شده با عشق در ایران</span>
          <Heart className="w-3.5 h-3.5 text-coral fill-current" />
        </div>
      </div>
    </footer>
  );
};
