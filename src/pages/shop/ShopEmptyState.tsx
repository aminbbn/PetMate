import React from 'react';
import { PackageX, Sparkles } from 'lucide-react';
import { Button } from '../../components/Button';
import { motion } from 'motion/react';

interface ShopEmptyStateProps {
  onReset: () => void;
}

export const ShopEmptyState: React.FC<ShopEmptyStateProps> = ({ onReset }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-[24px] border border-slate-100 shadow-sm min-h-[350px] max-w-lg mx-auto"
    >
      <div className="bg-slate-50 p-4 rounded-full text-slate-400 mb-4">
        <PackageX className="w-12 h-12" />
      </div>
      <h3 className="text-lg font-bold text-slate-800">هیچ محصولی یافت نشد</h3>
      <p className="text-sm text-slate-500 mt-2 max-w-xs leading-relaxed">
        محصولی با مشخصات انتخاب شده پیدا نشد. مایلید فیلترهای جستجو را پاک کنید و مجدداً امتحان نمایید؟
      </p>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onReset}
        className="mt-6 font-semibold"
      >
        <Sparkles className="w-4 h-4 text-coral ml-1" />
        حذف تمامی فیلترها
      </Button>
    </motion.div>
  );
};
