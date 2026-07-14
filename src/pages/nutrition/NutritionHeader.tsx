import React from 'react';
import { useAppStore } from '../../store';
import { Button } from '../../components/Button';
import { AnimatedCardIcon } from '../../components/AnimatedCardIcon';
import { Plus, CheckSquare } from 'lucide-react';

interface NutritionHeaderProps {
  onAddPlan: () => void;
  onLogMeal: () => void;
}

export const NutritionHeader: React.FC<NutritionHeaderProps> = ({ onAddPlan, onLogMeal }) => {
  const profile = useAppStore(state => state.profile);
  const pets = useAppStore(state => state.pets || []);
  const selectedPetId = useAppStore(state => state.selectedPetId);
  const setSelectedPetId = useAppStore(state => state.setSelectedPetId);

  const currentPet = pets.find(p => p.id === selectedPetId) || profile;
  const petName = currentPet?.name || 'حیوان خانگی من';

  return (
    <header className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 pb-6 border-b border-coral-light/10" dir="rtl">
      {/* Title & Description */}
      <div className="flex items-center gap-4">
        <div className="group">
          <AnimatedCardIcon
            variant="nutrition"
            tone="coral"
            size="md"
            className="shadow-sm"
          />
        </div>
        <div>
          <h1 className="text-3xl font-black text-coral-deep">تغذیه و برنامه غذا</h1>
          <p className="text-gray-500 font-medium text-sm mt-1 leading-relaxed">
            ثبت غذای روزانه، زمانبندی وعده‌ها و نگهداری توصیه‌های دامپزشک برای {petName}
          </p>
        </div>
      </div>

      {/* Switcher & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto self-stretch xl:self-auto justify-end">
        {pets.length > 1 && (
          <div className="flex items-center gap-2 justify-between sm:justify-start">
            <span className="text-xs font-bold text-gray-400">حیوان خانگی:</span>
            <select
              value={selectedPetId || ''}
              onChange={(e) => setSelectedPetId(e.target.value || null)}
              className="bg-white/80 border border-coral-light/15 text-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-coral text-xs font-bold shadow-xs cursor-pointer"
              aria-label="انتخاب حیوان خانگی"
            >
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-2 w-full sm:w-auto justify-stretch sm:justify-end">
          <Button
            onClick={onLogMeal}
            variant="secondary"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-3 text-xs font-black bg-white border border-coral-light/20 text-coral hover:bg-peach/10 shadow-sm shrink-0"
          >
            <CheckSquare size={15} />
            ثبت وعده
          </Button>

          <Button
            onClick={onAddPlan}
            variant="primary"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 text-xs font-black shadow-lg shadow-coral/10 hover:shadow-coral/20 shrink-0"
          >
            <Plus size={15} />
            افزودن برنامه غذا
          </Button>
        </div>
      </div>
    </header>
  );
};
