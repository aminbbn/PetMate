import React from 'react';
import { Search, X, AlertOctagon, HeartCrack, Layers } from 'lucide-react';
import { PetServiceCategory } from './navigatorTypes';
import { getCategoryIconAndTone, CATEGORY_LABELS } from './navigatorUtils';
import { cn } from '../../lib/utils';
import { toPersian } from '../../lib/persian';

interface NavigatorHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: PetServiceCategory | 'all';
  onCategoryChange: (category: PetServiceCategory | 'all') => void;
  emergencyOnly: boolean;
  onEmergencyToggle: (active: boolean) => void;
  totalCount: number;
}

const ALL_CATEGORIES: (PetServiceCategory | 'all')[] = [
  'all',
  'veterinary_clinic',
  'veterinary_hospital',
  'pharmacy',
  'pet_shop',
  'boarding',
  'grooming',
  'park',
  'laboratory',
  'imaging'
];

export const NavigatorHeader: React.FC<NavigatorHeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  emergencyOnly,
  onEmergencyToggle,
  totalCount,
}) => {
  return (
    <div className="w-full space-y-6 text-right" dir="rtl">
      {/* Search Input and Emergency Toggle */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Search Field */}
        <div className="lg:col-span-8 relative">
          <div className="absolute inset-y-0 right-0 pr-4.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجوی نام مرکز، پزشک، خدمات، بیماری یا محله..."
            className={cn(
              "w-full h-13 pr-12 pl-11 rounded-[18px] bg-white text-gray-800 text-sm font-sans font-medium transition-all duration-300",
              "border border-coral-light/20 shadow-sm focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/15"
            )}
          />

          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 left-0 pl-4.5 flex items-center text-gray-400 hover:text-coral transition-colors"
              aria-label="پاک کردن جستجو"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Emergency Toggle Card */}
        <button
          onClick={() => onEmergencyToggle(!emergencyOnly)}
          className={cn(
            "lg:col-span-4 h-13 flex items-center justify-between px-5 rounded-[18px] border transition-all duration-300 font-sans cursor-pointer",
            emergencyOnly
              ? "bg-coral/5 border-coral/30 text-coral shadow-sm shadow-coral/5"
              : "bg-white border-coral-light/20 text-gray-600 hover:border-coral-light/40 hover:bg-gray-50/50"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-1.5 rounded-xl transition-colors duration-300",
              emergencyOnly ? "bg-coral text-white" : "bg-coral/10 text-coral"
            )}>
              <AlertOctagon className="w-4.5 h-4.5" />
            </div>
            <div className="text-right">
              <span className="block text-sm font-bold leading-tight">فقط اورژانس شبانه‌روزی</span>
              <span className="text-[10px] text-gray-400 leading-none">مراکز مجهز به خدمات امداد فوری</span>
            </div>
          </div>

          {/* Simple iOS style toggle switch */}
          <div className={cn(
            "w-11 h-6 rounded-full p-0.5 transition-colors duration-300 ease-in-out relative flex items-center shrink-0",
            emergencyOnly ? "bg-coral" : "bg-gray-200"
          )}>
            <div className={cn(
              "w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out",
              emergencyOnly ? "-translate-x-5" : "translate-x-0"
            )} />
          </div>
        </button>
      </div>

      {/* Categories Horizontal Scrolling List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-gray-400 font-sans">دسته‌بندی خدمات پت</span>
          <span className="text-xs font-bold text-coral bg-coral/5 border border-coral-light/10 rounded-full px-2.5 py-1">
            {toPersian(totalCount)} مرکز یافت شد
          </span>
        </div>

        <div className="overflow-x-auto pb-2 scrollbar-none -mx-8 px-8 flex gap-2.5 no-scrollbar mask-gradient-x">
          {ALL_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            if (cat === 'all') {
              return (
                <button
                  key="all"
                  onClick={() => onCategoryChange('all')}
                  className={cn(
                    "px-5 py-3 rounded-2xl border transition-all duration-300 font-sans font-bold text-xs shrink-0 flex items-center gap-2 cursor-pointer",
                    isActive
                      ? "bg-coral text-white border-coral shadow-sm shadow-coral/10"
                      : "bg-white border-coral-light/25 text-gray-600 hover:border-coral-light/45 hover:bg-gray-50/50"
                  )}
                >
                  <Layers className="w-4 h-4" />
                  همه مراکز
                </button>
              );
            }

            const { variant, tone, label } = getCategoryIconAndTone(cat);

            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={cn(
                  "px-5 py-3 rounded-2xl border transition-all duration-300 font-sans font-semibold text-xs shrink-0 flex items-center gap-2 cursor-pointer",
                  isActive
                    ? "bg-coral text-white border-coral shadow-sm shadow-coral/10"
                    : "bg-white border-coral-light/25 text-gray-600 hover:border-coral-light/45 hover:bg-gray-50/50"
                )}
              >
                <span className={cn(
                  "inline-block w-2.5 h-2.5 rounded-full",
                  isActive 
                    ? "bg-white" 
                    : tone === 'coral' 
                      ? 'bg-coral' 
                      : tone === 'mint' 
                        ? 'bg-emerald-500' 
                        : tone === 'sunny' 
                          ? 'bg-amber-500' 
                          : 'bg-blue-500'
                )} />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
