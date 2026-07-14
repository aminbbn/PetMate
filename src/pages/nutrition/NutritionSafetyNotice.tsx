import React from 'react';
import { Card } from '../../components/Card';
import { AnimatedCardIcon } from '../../components/AnimatedCardIcon';
import { ShieldAlert, Info, HeartHandshake } from 'lucide-react';

export const NutritionSafetyNotice: React.FC = () => {
  return (
    <Card
      glow={true}
      glowColor="sunny"
      hoverLift={false}
      className="p-6 border-sunny/30 bg-gradient-to-br from-white to-sunny/5"
      dir="rtl"
    >
      <div className="flex flex-col md:flex-row gap-5 items-start">
        <AnimatedCardIcon variant="alert" tone="sunny" size="md" className="shrink-0" />
        
        <div className="space-y-4 text-right flex-1">
          <div>
            <h4 className="text-base font-black text-coral-deep flex items-center gap-2">
              <ShieldAlert className="text-sunny" size={18} />
              منشور ایمنی تغذیه و سلامت حیوانات خانگی
            </h4>
            <p className="text-gray-500 text-xs font-semibold mt-1.5 leading-relaxed">
              تغذیه صحیح، فونداسیون طول عمر و شادابی پت شماست. به منظور پیشگیری از هرگونه آسیب متابولیک یا اسکلتی، رعایت اصول علمی و استانداردهای دامپزشکی زیر الزامی است:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rule 1 */}
            <div className="bg-white/60 p-3 rounded-xl border border-sunny/10 space-y-1">
              <h5 className="text-xs font-black text-gray-700 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sunny" />
                ضرورت تعادل ریزمغذی‌ها
              </h5>
              <p className="text-gray-500 text-[11px] font-medium leading-relaxed">
                غذاهای خانگی بدون مکمل‌های معدنی استاندارد، با خطر جدی کمبود کلسیم، فسفر، روی و ویتامین‌های حیاتی مواجه هستند که می‌تواند منجر به بیماری‌های حاد استخوانی و کلیوی شود.
              </p>
            </div>

            {/* Rule 2 */}
            <div className="bg-white/60 p-3 rounded-xl border border-sunny/10 space-y-1">
              <h5 className="text-xs font-black text-gray-700 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sunny" />
                مشاوره مستقیم تخصصی
              </h5>
              <p className="text-gray-500 text-[11px] font-medium leading-relaxed">
                تنظیم رژیم‌های خانگی بلندمدت حتماً باید با فرمول‌نویسی دقیق و مستقیم متخصص تغذیه دامپزشک (دارای بورد تخصصی DACVIM یا ECVCN) انجام گیرد.
              </p>
            </div>

            {/* Rule 3 */}
            <div className="bg-white/60 p-3 rounded-xl border border-sunny/10 space-y-1">
              <h5 className="text-xs font-black text-gray-700 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sunny" />
                عدم تولید جیره خودکار
              </h5>
              <p className="text-gray-500 text-[11px] font-medium leading-relaxed">
                این پلتفرم هرگز به صورت خودکار یا کورکورانه جیره غذایی یا دستورپخت هفتگی خانگی تولید نمی‌کند. تمامی اهداف و مقادیر کالری صرفاً جهت هماهنگی و ردیابی جیره‌های تأییدشده دامپزشک است.
              </p>
            </div>

            {/* Rule 4 */}
            <div className="bg-white/60 p-3 rounded-xl border border-sunny/10 space-y-1">
              <h5 className="text-xs font-black text-gray-700 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sunny" />
                غذاهای درمانی و حساسیت‌ها
              </h5>
              <p className="text-gray-500 text-[11px] font-medium leading-relaxed">
                غذاهای درمانی (Therapeutic Diets) که برای بیماری‌های خاص طراحی شده‌اند، دارو تلقی می‌شوند و مقدار یا تغییر نوع مصرف آن‌ها باید با نسخه و پایش دوره‌ای دامپزشک صورت پذیرد.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-sunny/10 flex items-center gap-2 text-[10px] font-extrabold text-gray-400">
            <HeartHandshake size={14} className="text-gray-400 shrink-0" />
            <span>پت میت دوست‌دار و نگهبان سلامت پت شما؛ همیشه با دامپزشک خود هماهنگ بمانید.</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
