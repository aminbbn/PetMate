import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Heart, Stethoscope, RefreshCw, AlertCircle } from 'lucide-react';
import { ProductCategory, ProductSpecies, ProductSearchInput } from './shopTypes';
import { toPersianDigits, formatToman } from './shopUtils';
import { motion, AnimatePresence } from 'motion/react';

interface ShopToolbarProps {
  filters: ProductSearchInput;
  onChange: (updates: Partial<ProductSearchInput>) => void;
  categories: { value: ProductCategory | 'all'; label: string }[];
  resultCount: number;
}

export const ShopToolbar: React.FC<ShopToolbarProps> = ({
  filters,
  onChange,
  categories,
  resultCount
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localQuery, setLocalQuery] = useState(filters.query || '');

  // Handle query submit or change
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalQuery(val);
    onChange({ query: val });
  };

  const hasActiveFilters = 
    (filters.query && filters.query !== '') ||
    (filters.category && filters.category !== 'all') ||
    (filters.species && filters.species !== 'all') ||
    filters.onlyFavorites === true ||
    filters.requiresVeterinarianGuidance !== undefined ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined;

  const handleResetFilters = () => {
    setLocalQuery('');
    onChange({
      query: '',
      category: 'all',
      species: 'all',
      onlyFavorites: false,
      requiresVeterinarianGuidance: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: 'relevance'
    });
  };

  return (
    <div className="bg-white rounded-[24px] p-5 shadow-[0_12px_40px_rgba(232,90,93,0.02),0_4px_16px_rgba(255,179,174,0.02)] border border-slate-100 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="جستجو در محصولات، برندها و ملزومات پت..."
            value={localQuery}
            onChange={handleQueryChange}
            className="w-full pr-11 pl-4 py-3 bg-slate-50/80 border border-slate-200/50 rounded-2xl text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-coral focus:bg-white transition-all duration-200"
          />
        </div>

        {/* Quick controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Species selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['all', 'dog', 'cat'] as const).map((sp) => {
              const isActive = (filters.species || 'all') === sp;
              const labels = { all: 'همه', dog: 'سگ', cat: 'گربه' };
              return (
                <button
                  key={sp}
                  onClick={() => onChange({ species: sp })}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {labels[sp]}
                </button>
              );
            })}
          </div>

          {/* Favorites toggle */}
          <button
            onClick={() => onChange({ onlyFavorites: !filters.onlyFavorites })}
            className={`px-4 py-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all duration-200 cursor-pointer ${
              filters.onlyFavorites
                ? 'bg-pink-50 border-pink-200 text-pink-700'
                : 'bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${filters.onlyFavorites ? 'fill-pink-600 text-pink-600' : ''}`} />
            علاقه‌مندی‌ها
          </button>

          {/* Toggle advanced filters */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all duration-200 cursor-pointer ${
              showAdvanced || filters.requiresVeterinarianGuidance !== undefined || filters.minPrice !== undefined || filters.maxPrice !== undefined
                ? 'bg-coral-light/10 border-coral-light/30 text-coral-deep'
                : 'bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            فیلترها
          </button>

          {/* Sorting dropdown */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200/50 rounded-xl px-3 py-2 text-slate-600 text-xs font-medium gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.sortBy || 'relevance'}
              onChange={(e) => onChange({ sortBy: e.target.value as any })}
              className="bg-transparent border-none outline-none text-slate-700 cursor-pointer focus:ring-0"
            >
              <option value="relevance">مرتب‌سازی: پیشنهادی</option>
              <option value="newest">جدیدترین‌ها</option>
              <option value="price_asc">ارزان‌ترین‌ها</option>
              <option value="price_desc">گران‌ترین‌ها</option>
              <option value="rating">محبوب‌ترین‌ها (امتیاز)</option>
            </select>
          </div>

          {/* Reset Filters */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleResetFilters}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-xl transition-colors duration-200 cursor-pointer flex items-center gap-1.5 text-xs font-medium"
                title="پاک کردن فیلترها"
              >
                <RefreshCw className="w-4 h-4" />
                <span>حذف فیلترها</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Advanced Filters Expandable Panel */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 mt-4 pt-4 flex flex-col md:flex-row gap-5">
              {/* Veterinarian Guidance Filter */}
              <div className="flex-1">
                <span className="text-xs font-semibold text-slate-500 block mb-2.5">نیاز به نسخه/تاییدیه دامپزشک</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onChange({ requiresVeterinarianGuidance: undefined })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filters.requiresVeterinarianGuidance === undefined
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-50 text-slate-600 border border-slate-200/50 hover:bg-slate-100'
                    }`}
                  >
                    همه محصولات
                  </button>
                  <button
                    onClick={() => onChange({ requiresVeterinarianGuidance: true })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                      filters.requiresVeterinarianGuidance === true
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-700 border border-amber-200/40 hover:bg-amber-100/60'
                    }`}
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    فقط محصولات درمانی / مکمل
                  </button>
                  <button
                    onClick={() => onChange({ requiresVeterinarianGuidance: false })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filters.requiresVeterinarianGuidance === false
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200/40 hover:bg-emerald-100/60'
                    }`}
                  >
                    محصولات عادی عمومی
                  </button>
                </div>
              </div>

              {/* Price Filter range */}
              <div className="w-full md:w-80">
                <span className="text-xs font-semibold text-slate-500 block mb-2.5">بازه قیمت (تومان)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="از"
                    value={filters.minPrice !== undefined ? filters.minPrice : ''}
                    onChange={(e) => onChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200/50 rounded-xl text-xs focus:outline-none focus:border-coral focus:bg-white"
                  />
                  <span className="text-slate-400 text-xs">تا</span>
                  <input
                    type="number"
                    placeholder="تا"
                    value={filters.maxPrice !== undefined ? filters.maxPrice : ''}
                    onChange={(e) => onChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200/50 rounded-xl text-xs focus:outline-none focus:border-coral focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Horizontal Scrolling Chips */}
      <div className="border-t border-slate-50 mt-4 pt-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200">
          {categories.map((cat) => {
            const isActive = (filters.category || 'all') === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onChange({ category: cat.value })}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-coral text-white shadow-md shadow-coral/15'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 border border-slate-200/40'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toolbar Status line / Search count */}
      <div className="flex items-center justify-between mt-3 text-slate-400 text-xs border-t border-slate-50 pt-2.5">
        <div>
          تعداد نتایج یافت شده: <span className="font-semibold text-slate-600">{toPersianDigits(resultCount)}</span> محصول
        </div>
        {hasActiveFilters && (
          <div className="text-[11px] text-coral flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            فیلترها فعال هستند
          </div>
        )}
      </div>
    </div>
  );
};
