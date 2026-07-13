import React from 'react';
import { Button } from '../../components/Button';
import { AnimatedCardIcon } from '../../components/AnimatedCardIcon';
import { Plus, Upload } from 'lucide-react';

interface HealthEmptyStateProps {
  petName: string;
  onAddManual: () => void;
  onAddUpload: () => void;
}

export const HealthEmptyState: React.FC<HealthEmptyStateProps> = ({
  petName,
  onAddManual,
  onAddUpload,
}) => {
  return (
    <div className="text-center py-16 px-6 bg-white rounded-[24px] border border-dashed border-coral-light/20 shadow-sm flex flex-col items-center justify-center space-y-6 group max-w-lg mx-auto">
      {/* Semantic Icon with heart animation on parent hover */}
      <AnimatedCardIcon variant="heart" tone="coral" size="lg" />
      
      <div className="space-y-2">
        <h3 className="text-xl font-black text-gray-800 leading-snug">
          هنوز سابقه‌ای برای {petName} ثبت نشده
        </h3>
        <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
          اولین ویزیت، واکسن، آزمایش یا یادداشت سلامت را اضافه کنید تا سوابق او منظم نگهداری شوند.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs pt-2">
        <Button 
          variant="primary" 
          onClick={onAddManual} 
          className="w-full text-xs font-black py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          <span>ثبت دستی</span>
        </Button>
        <Button 
          variant="secondary" 
          onClick={onAddUpload} 
          className="w-full text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <Upload size={14} className="text-gray-500" />
          <span>افزودن فایل</span>
        </Button>
      </div>
    </div>
  );
};
