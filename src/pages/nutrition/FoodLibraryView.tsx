import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { selectPetFoods } from './nutritionSelectors';
import { toPersian } from '../../lib/persian';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { PortionCalculator } from './PortionCalculator';
import { PetFood } from './nutritionTypes';
import { Utensils, Search, Plus, Trash2, Edit3, ShieldAlert } from 'lucide-react';

interface FoodLibraryViewProps {
  onAddFood: () => void;
  onEditFood: (food: PetFood) => void;
}

export const FoodLibraryView: React.FC<FoodLibraryViewProps> = ({ onAddFood, onEditFood }) => {
  const store = useAppStore();
  const foods = selectPetFoods(store);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredFoods = foods.filter((f) => {
    const matchesSearch =
      f.brandAndName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || f.type === filterType;

    return matchesSearch && matchesType;
  });

  const handleDeleteFood = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('آیا از حذف این ماده غذایی از کتابخانه مطمئن هستید؟ برنامه‌های زمانبندی شامل این غذا نیاز به بروزرسانی خواهند داشت.')) {
      store.archiveFood(id);
    }
  };

  const getFoodTypeLabel = (type: string) => {
    switch (type) {
      case 'dry': return 'غذای خشک';
      case 'wet': return 'غذای مرطوب/کنسرو';
      case 'treat': return 'تشویقی';
      case 'custom_diet': return 'جیره دست‌ساز تأییدشده';
      default: return 'غذا';
    }
  };

  const getFoodTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'dry': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'wet': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'treat': return 'bg-coral/5 text-coral border-coral/10';
      case 'custom_diet': return 'bg-green-50 text-green-700 border-green-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* 1. Portion Calculator container */}
      <PortionCalculator />

      {/* 2. Header and Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-coral-deep">کتابخانه مواد غذایی پت</h3>
            <p className="text-gray-500 text-xs font-semibold mt-1">
              تعریف و ویرایش غذاهای خشک، مرطوب، تشویقی‌ها و جیره‌های تأییدشده دامپزشک
            </p>
          </div>
          <Button
            onClick={onAddFood}
            variant="secondary"
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-black border border-coral-light/20 text-coral bg-white hover:bg-coral/5"
          >
            <Plus size={14} />
            افزودن غذای جدید
          </Button>
        </div>

        {/* Search & Filter Strip */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در بین نام تجاری یا مشخصات غذا..."
              className="w-full bg-white border border-coral-light/10 focus:border-coral rounded-xl pr-10 pl-4 py-2.5 text-xs font-bold text-gray-800 outline-none shadow-xs"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white border border-coral-light/10 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 outline-none cursor-pointer shadow-xs"
            aria-label="فیلتر نوع غذا"
          >
            <option value="all">همه انواع غذاها</option>
            <option value="dry">غذای خشک شرکتی</option>
            <option value="wet">غذای مرطوب / کنسرو</option>
            <option value="treat">تشویقی / مکمل مستقیم</option>
            <option value="custom_diet">جیره خانگی فرمول‌شده</option>
          </select>
        </div>
      </div>

      {/* 3. Foods Grid */}
      {filteredFoods.length === 0 ? (
        <Card className="p-10 text-center border-dashed border-2 border-coral-light/10 flex flex-col items-center justify-center">
          <Utensils size={44} className="text-gray-300 mb-3" />
          <h4 className="text-base font-black text-gray-700">ماده غذایی یافت نشد</h4>
          <p className="text-gray-400 text-xs font-medium mt-1.5 max-w-sm leading-relaxed">
            {searchQuery || filterType !== 'all'
              ? 'هیچ غذایی با فیلترها و کلمات جستجو شده همخوانی ندارد. فیلترها را بررسی کرده یا جستجو را پاک کنید.'
              : 'کتابخانه مواد غذایی پت شما خالی است. با افزودن غذاهای استاندارد مصرفی پت، شروع به کار کنید.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFoods.map((food) => (
            <Card
              key={food.id}
              glow={false}
              hoverLift={true}
              onClick={() => onEditFood(food)}
              className="p-5 flex flex-col justify-between border border-coral-light/10 bg-white cursor-pointer hover:border-coral-light/30 text-right"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className={`text-[10px] font-black border px-2.5 py-1 rounded-full ${getFoodTypeBadgeStyle(food.type)}`}>
                      {getFoodTypeLabel(food.type)}
                    </span>
                    <h4 className="text-base font-black text-coral-deep mt-2.5 leading-tight">
                      {food.brandAndName}
                    </h4>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditFood(food);
                      }}
                      className="p-1.5 text-gray-400 hover:text-coral transition-colors rounded-lg bg-gray-50 border border-gray-100"
                      aria-label="ویرایش غذا"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteFood(food.id, e)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg bg-gray-50 border border-gray-100"
                      aria-label="حذف غذا"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100 text-xs font-bold text-gray-600">
                  <div>
                    <span className="text-[10px] text-gray-400 font-semibold block">تراکم انرژی:</span>
                    <span className="text-gray-800 text-xs mt-0.5 block">
                      {toPersian(food.energyDensityKcalKg)} ک‌کالری / کیلوگرم
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-semibold block">پروتئین خام:</span>
                    <span className="text-gray-800 text-xs mt-0.5 block">
                      {food.crudeProteinPercent ? `${toPersian(food.crudeProteinPercent)}٪` : 'درج نشده'}
                    </span>
                  </div>
                </div>

                {/* Warning for custom diet */}
                {food.type === 'custom_diet' && (
                  <div className="text-[10px] font-semibold text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100/50 flex gap-1.5 items-center">
                    <ShieldAlert size={12} className="shrink-0" />
                    جیره دست‌ساز تاییدشده دامپزشک تغذیه
                  </div>
                )}
              </div>

              {food.notes && (
                <p className="text-[11px] font-medium text-gray-400 mt-4 border-t border-gray-50 pt-3 line-clamp-2">
                  {food.notes}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
