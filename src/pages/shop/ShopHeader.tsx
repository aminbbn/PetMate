import React from 'react';
import { ShoppingBag, Eye } from 'lucide-react';
import { motion } from 'motion/react';

export const ShopHeader: React.FC = () => {
  return (
    <div className="mb-8" id="shop-header">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight"
          >
            فروشگاه ملزومات پت میت
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-sm md:text-base text-slate-500 mt-1"
          >
            تهیه غذا، تشویقی، مکمل‌ها و اسباب‌بازی‌های ایمن و تایید شده تحت نظارت دامپزشکان
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="self-start md:self-center bg-amber-50/75 border border-amber-200/60 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 text-amber-800 text-xs md:text-sm shadow-sm"
        >
          <div className="bg-amber-100 p-1.5 rounded-xl">
            <Eye className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <span className="font-semibold block">نسخه کاتالوگ نمایشی (آزمایشی)</span>
            <span className="text-[11px] text-amber-700/90 block mt-0.5">بدون تراکنش مالی واقعی یا خرید تجاری</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
