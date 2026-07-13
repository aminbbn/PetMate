import React from 'react';
import { useAppStore } from '../../store';
import { Button } from '../../components/Button';
import { AnimatedCardIcon } from '../../components/AnimatedCardIcon';
import { Plus } from 'lucide-react';

interface GrowthHeaderProps {
  onAddWeight: () => void;
}

export const GrowthHeader: React.FC<GrowthHeaderProps> = ({ onAddWeight }) => {
  const profile = useAppStore(state => state.profile);
  const pets = useAppStore(state => state.pets || []);
  const selectedPetId = useAppStore(state => state.selectedPetId);
  const setSelectedPetId = useAppStore(state => state.setSelectedPetId);

  const currentPet = pets.find(p => p.id === selectedPetId) || profile;
  const petName = currentPet?.name || 'حیوان خانگی من';

  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-coral-light/10">
      {/* Title & Description */}
      <div className="flex items-center gap-4">
        <div className="group">
          <AnimatedCardIcon
            variant="weight"
            tone="sunny"
            size="md"
            className="shadow-sm"
          />
        </div>
        <div>
          <h1 className="text-3xl font-black text-coral-deep">روند وزن</h1>
          <p className="text-gray-500 font-medium text-sm mt-1">
            ثبت و بررسی تغییرات وزن {petName} در طول زمان
          </p>
        </div>
      </div>

      {/* Switcher & Primary Button */}
      <div className="flex items-center gap-4 self-stretch md:self-auto justify-between md:justify-end">
        {pets.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 hidden sm:inline">حیوان خانگی:</span>
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

        <Button
          onClick={onAddWeight}
          variant="primary"
          className="flex items-center gap-2 px-6 py-3 text-xs font-black shadow-lg shadow-coral/10 hover:shadow-coral/20 shrink-0"
        >
          <Plus size={16} />
          ثبت وزن جدید
        </Button>
      </div>
    </header>
  );
};
