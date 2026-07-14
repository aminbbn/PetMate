import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../../store';
import { PetFood } from './nutritionTypes';
import { Button } from '../../components/Button';
import { X, Sparkles, ShieldCheck } from 'lucide-react';

interface FoodDialogProps {
  isOpen: boolean;
  food?: PetFood;
  onClose: () => void;
  onSuccess: () => void;
}

export const FoodDialog: React.FC<FoodDialogProps> = ({
  isOpen,
  food,
  onClose,
  onSuccess,
}) => {
  const store = useAppStore();
  const petId = store.selectedPetId || store.profile?.id || '';

  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Form Fields State
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<PetFood['category']>('dry');
  const [energyKcal100g, setEnergyKcal100g] = useState('380');
  const [labelFeedingText, setLabelFeedingText] = useState('');

  // Pre-populate if editing
  useEffect(() => {
    if (food) {
      setBrand(food.brand || '');
      setName(food.name || '');
      setCategory(food.category);
      setEnergyKcal100g(food.energyKcalPer100g ? String(food.energyKcalPer100g) : '380');
      setLabelFeedingText(food.labelFeedingText || '');
    } else {
      setBrand('');
      setName('');
      setCategory('dry');
      setEnergyKcal100g('380');
      setLabelFeedingText('');
    }
  }, [food, isOpen]);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const density = parseFloat(energyKcal100g);

    const foodData = {
      brand: brand.trim() || undefined,
      name: name.trim(),
      category,
      energyKcalPer100g: isNaN(density) ? 380 : density,
      labelFeedingText: labelFeedingText.trim() || undefined,
    };

    if (food) {
      // Edit food
      store.updateFood(food.id, foodData);
    } else {
      // Add food
      store.addFood({
        petId,
        ...foodData,
      });
    }

    onSuccess();
  };

  const desktopVariants = {
    initial: { opacity: 0, scale: 0.95, y: 16 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 12 },
  };

  const mobileVariants = {
    initial: { y: '100%', opacity: 1 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 1 },
  };

  const activeVariants = isMobile ? mobileVariants : desktopVariants;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 backdrop-blur-xs cursor-pointer"
          />

          {/* Dialog Container */}
          <div className="fixed inset-0 flex items-end md:items-center justify-center p-0 md:p-4 z-50 pointer-events-none" dir="rtl">
            <motion.div
              ref={containerRef}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={activeVariants}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="bg-white w-full md:max-w-md max-h-[90vh] md:max-h-[85vh] rounded-t-[32px] md:rounded-[24px] shadow-2xl p-6 md:p-8 overflow-y-auto pointer-events-auto flex flex-col justify-between border border-coral-light/10 text-right"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-coral/5 text-coral flex items-center justify-center">
                    <Sparkles size={14} />
                  </div>
                  <h3 className="text-lg font-black text-coral-deep">
                    {food ? 'ویرایش اطلاعات غذای پت' : 'افزودن ماده غذایی جدید'}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="بستن دیالوگ"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="space-y-4 py-4 flex-1">
                {/* Brand name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">برند یا شرکت سازنده (اختیاری)</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="مثال: رویال کنین (Royal Canin)"
                    className="w-full bg-gray-50 border border-coral-light/10 focus:border-coral rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-800 outline-none"
                  />
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">نام تجاری یا طعم غذا</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: مینی ادالت با طعم سالمون"
                    className="w-full bg-gray-50 border border-coral-light/10 focus:border-coral rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-800 outline-none"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">نوع ماده غذایی</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-gray-50 border border-coral-light/10 text-gray-800 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="dry">غذای خشک شرکتی</option>
                    <option value="wet">غذای مرطوب / کنسرو / پوچ</option>
                    <option value="fresh">غذای تازه / مرطوب ارگانیک</option>
                    <option value="treat">تشویقی (Treat)</option>
                    <option value="supplement">مکمل یا ویتامین مصرفی</option>
                    <option value="homemade">جیره خانگی فرموله شده</option>
                    <option value="therapeutic">غذای درمانی یا دامپزشکی (Therapeutic)</option>
                  </select>
                </div>

                {/* Energy (kcal / 100g) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">کالری به ازای هر ۱۰۰ گرم (kcal/100g)</label>
                  <input
                    type="number"
                    required
                    value={energyKcal100g}
                    onChange={(e) => setEnergyKcal100g(e.target.value)}
                    placeholder="مثال: ۳۸۰"
                    className="w-full bg-gray-50 border border-coral-light/10 focus:border-coral rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-800 outline-none"
                  />
                  <span className="text-[10px] text-gray-400 font-semibold block leading-normal">
                    برای اکثر غذاهای خشک سگ و گربه، این رقم بین ۳۲۰ تا ۴۲۰ کیلوکالری است که پشت بسته‌بندی غذا درج شده است.
                  </span>
                </div>

                {/* Notes (labelFeedingText) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">توضیحات تغذیه‌ای یا یادداشت‌های مصرف (اختیاری)</label>
                  <textarea
                    value={labelFeedingText}
                    onChange={(e) => setLabelFeedingText(e.target.value)}
                    placeholder="مثال: مناسب فقط برای گربه‌های عقیم شده، دارای امگا ۳ فراوان"
                    rows={3}
                    className="w-full bg-gray-50 border border-coral-light/10 focus:border-coral rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-800 outline-none resize-none"
                  />
                </div>

                {category === 'therapeutic' && (
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-800 text-[11px] font-semibold flex gap-2 items-start leading-relaxed">
                    <ShieldCheck size={14} className="shrink-0 mt-0.5 text-amber-600" />
                    <span>
                      انتخاب گزینه‌ی «غذای درمانی یا دامپزشکی»، نشان می‌دهد این غذا برای درمان بیماری یا شرایط خاص تجویز شده است و باید صرفاً طبق صلاحدید پزشک مصرف گردد.
                    </span>
                  </div>
                )}

                {/* Submit action */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="secondary"
                    className="flex-1 text-xs py-3 font-black text-gray-600 border border-gray-200 hover:bg-gray-50 bg-white"
                  >
                    انصراف
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1 text-xs py-3 font-black shadow-md shadow-coral/15"
                  >
                    ذخیره ماده غذایی
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
