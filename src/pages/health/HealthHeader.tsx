import React from 'react';
import { Button } from '../../components/Button';
import { PetProfile } from '../../store';
import { Plus, Users, Heart } from 'lucide-react';

interface HealthHeaderProps {
  selectedPet: any;
  pets: any[];
  onSelectPet: (id: string) => void;
  onAddRecord: () => void;
}

export const HealthHeader: React.FC<HealthHeaderProps> = ({
  selectedPet,
  pets,
  onSelectPet,
  onAddRecord,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-coral-light/10 pb-6 w-full">
      {/* Title & Description */}
      <div className="space-y-2 text-right">
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
          <Heart size={24} className="text-coral shrink-0 animate-pulse" />
          <span>پرونده سلامت و سوابق پزشکی</span>
        </h1>
        <p className="text-gray-400 text-xs font-bold leading-normal">
          پرونده درمانی، واکسن‌ها، آزمایشات و مراجعات دامپزشکی پت خود را به صورت منظم مدیریت کنید.
        </p>
      </div>

      {/* Switcher & Action */}
      <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
        {/* Multi-pet Switcher */}
        {pets.length > 1 && (
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 p-1.5 rounded-2xl w-full sm:w-auto" dir="rtl">
            <span className="text-[10px] font-bold text-gray-400 px-2 shrink-0 flex items-center gap-1">
              <Users size={11} />
              <span>پت فعلی:</span>
            </span>
            <div className="flex gap-1 overflow-x-auto">
              {pets.map(p => {
                const isActive = p.id === selectedPet?.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onSelectPet(p.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-coral text-white shadow-sm'
                        : 'bg-white text-gray-500 border border-transparent hover:bg-gray-100 hover:text-gray-700'
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Create CTA Button */}
        <Button
          variant="primary"
          onClick={onAddRecord}
          className="w-full sm:w-auto text-xs font-black py-3 px-5 rounded-xl flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          <span>ثبت سابقه جدید</span>
        </Button>
      </div>
    </div>
  );
};
