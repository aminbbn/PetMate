import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, FileText, X } from 'lucide-react';
import { FilterState, HealthRecordKind } from './healthTypes';
import { getKindLabel } from './healthUtils';

interface HealthToolbarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
}

export const HealthToolbar: React.FC<HealthToolbarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const kinds: (HealthRecordKind | 'all')[] = [
    'all',
    'visit',
    'vaccination',
    'lab_test',
    'imaging',
    'medication',
    'surgery',
    'allergy',
    'document',
    'note',
    'other',
  ];

  const hasActiveFilters = 
    filters.search.trim() !== '' || 
    filters.kind !== 'all' || 
    filters.onlyHasFiles || 
    filters.sortBy !== 'newest';

  return (
    <div className="bg-white border border-coral-light/15 rounded-2xl p-4 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="جست‌وجو در سوابق..."
            value={filters.search}
            onChange={e => onFilterChange({ search: e.target.value })}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl pr-11 pl-4 py-3 outline-none focus:bg-white focus:border-coral/50 focus:ring-4 focus:ring-coral/10 transition-all duration-200 text-sm font-medium text-gray-700"
          />
        </div>

        {/* Sort and File Controls */}
        <div className="flex items-center gap-3">
          {/* Sort dropdown */}
          <div className="relative flex items-center bg-gray-50 border border-gray-100 rounded-xl px-3 py-3 text-sm text-gray-600 font-medium hover:bg-gray-100 transition-colors">
            <ArrowUpDown size={15} className="ml-2 text-gray-400" />
            <select
              value={filters.sortBy}
              onChange={e => onFilterChange({ sortBy: e.target.value as 'newest' | 'oldest' })}
              className="bg-transparent outline-none cursor-pointer text-xs font-black pr-1 text-gray-700"
            >
              <option value="newest">جدیدترین</option>
              <option value="oldest">قدیمی‌ترین</option>
            </select>
          </div>

          {/* Only with file switch */}
          <button
            onClick={() => onFilterChange({ onlyHasFiles: !filters.onlyHasFiles })}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-black transition-all cursor-pointer ${
              filters.onlyHasFiles
                ? 'bg-mint/10 border-mint text-mint-deep'
                : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText size={15} />
            <span>فقط دارای فایل</span>
          </button>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 px-3 py-3 rounded-xl bg-coral/5 text-coral hover:bg-coral/10 text-xs font-black transition-all cursor-pointer"
            >
              <X size={15} />
              <span>پاک کردن فیلترها</span>
            </button>
          )}
        </div>
      </div>

      {/* Categories chips list - Horizontally scrollable on mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-200" dir="rtl">
        <span className="text-[11px] font-bold text-gray-400 shrink-0 ml-1">نوع سابقه:</span>
        {kinds.map(k => {
          const isActive = filters.kind === k;
          return (
            <button
              key={k}
              onClick={() => onFilterChange({ kind: k })}
              className={`px-3 py-1.5 rounded-full text-xs font-black shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-coral text-white shadow-sm shadow-coral/20'
                  : 'bg-gray-50 text-gray-500 border border-transparent hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              {k === 'all' ? 'همه انواع' : getKindLabel(k)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
