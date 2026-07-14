import React from 'react';
import { useAppStore } from '../../store';
import { ShieldCheck, Info, Sparkles, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPersianDigits } from './shopUtils';

export const ShopCompatibilityCard: React.FC = () => {
  const { pets, selectedPetId } = useAppStore();
  const selectedPet = pets?.find(p => p.id === selectedPetId) || null;

  return (
    <AnimatePresence mode="wait">
      {selectedPet ? (
        <motion.div
          key="active-pet"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="bg-emerald-50/60 border border-emerald-100 rounded-[22px] p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <div className="bg-emerald-100 p-2.5 rounded-2xl text-emerald-700 shrink-0 mt-0.5 sm:mt-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-950 text-sm md:text-base flex items-center gap-1.5">
                تطابق ایمنی هوشمند با پروفایل <span className="text-emerald-700 underline decoration-2 underline-offset-4">{selectedPet.name}</span> فعال است
              </h3>
              <p className="text-xs md:text-sm text-emerald-800/80 mt-1.5 leading-relaxed">
                سازگاری محصولات بر اساس رده سنی (<strong>{selectedPet.age < 1 ? 'توله/بچه پت' : selectedPet.age >= 7 ? 'سالخورده' : 'بالغ'}</strong> با سن {toPersianDigits(selectedPet.age)} سال) و گونه حیوان (<strong>{selectedPet.type === 'dog' ? 'سگ' : 'گربه'}</strong>) به صورت فرمول‌های مشخص و معتبر ارزیابی می‌شود.
              </p>
            </div>
          </div>
          <div className="text-[11px] bg-emerald-100/50 text-emerald-800 px-3 py-1.5 rounded-xl font-medium shrink-0 self-start sm:self-center">
            تایید شده بر اساس شناسنامه
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="no-pet"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="bg-slate-50 border border-slate-200/60 rounded-[22px] p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="bg-slate-100 p-2.5 rounded-2xl text-slate-500 shrink-0 mt-0.5 sm:mt-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm md:text-base">
                سازگاری ایمنی را شخصی‌سازی کنید
              </h3>
              <p className="text-xs md:text-sm text-slate-500 mt-1 leading-relaxed">
                با انتخاب یا ایجاد یک پروفایل پت، سیستم به صورت کاملاً خودکار و بر اساس معیارهای علمی دامپزشکی، سازگاری محصولات و مکمل‌ها را ارزیابی و برای سلامتی حیوان خانگی‌تان نشانه‌گذاری می‌کند.
              </p>
            </div>
          </div>
          {pets && pets.length > 0 ? (
            <div className="text-xs text-slate-400 font-medium shrink-0 self-start sm:self-center">
              از منوی بالای سایت، پت خود را انتخاب کنید
            </div>
          ) : (
            <div className="text-xs text-slate-400 font-medium shrink-0 self-start sm:self-center flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-coral" /> ابتدا یک پت اضافه نمایید
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
