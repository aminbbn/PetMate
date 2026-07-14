import React from 'react';
import { useAppStore } from '../../store';
import { Award, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export const TrainingHeader: React.FC = () => {
  const profile = useAppStore((state) => state.profile);
  const pets = useAppStore((state) => state.pets);
  const selectedPetId = useAppStore((state) => state.selectedPetId);
  const setSelectedPetId = useAppStore((state) => state.setSelectedPetId);
  const setProfile = useAppStore((state) => state.setProfile);

  if (!profile) return null;

  const handlePetChange = (petId: string) => {
    setSelectedPetId(petId);
    const selectedPet = pets.find((p) => p.id === petId);
    if (selectedPet) {
      setProfile(selectedPet);
    }
  };

  return (
    <div className="bg-gradient-to-l from-brand/10 via-brand/5 to-transparent p-6 rounded-2xl border border-brand/15 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-coral-deep font-bold text-xs uppercase tracking-wider">
            <Sparkles size={14} className="text-coral" />
            <span>مدیریت رفتار و مهارت‌ها</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-2">
            تمرین و آموزش {profile.name}
          </h1>
          <p className="text-gray-500 text-sm">
            برنامه‌های کوتاه، ثبت جلسات تمرینی و پیگیری گام‌به‌گام مهارت‌های {profile.name} به روش تقویت مثبت (Positive Reinforcement)
          </p>
        </div>

        {/* Selected Pet Switcher */}
        {pets.length > 1 && (
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-xl border border-gray-100 shadow-sm self-stretch md:self-auto">
            <span className="text-xs text-gray-400 px-2 font-medium">انتخاب پت:</span>
            <div className="flex gap-1 flex-wrap">
              {pets.map((pet) => (
                <button
                  key={pet.id}
                  onClick={() => handlePetChange(pet.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    pet.id === profile.id
                      ? 'bg-brand text-white shadow-sm shadow-brand/20'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {pet.name} {pet.type === 'dog' ? '🐶' : '🐱'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 bg-coral/5 border border-coral/10 p-3 rounded-xl text-xs text-coral-deep">
        <ShieldAlert size={16} className="shrink-0" />
        <span>
          <strong>توجه دامپزشکی-رفتارشناسی:</strong> آموزش هرگز نباید جایگزین تشخیص علل پزشکی پرخاشگری یا ترشح غیرطبیعی کورتیزول ناشی از دردهای مفصلی یا مغزی شود. در صورت تغییر ناگهانی رفتار، ابتدا با دامپزشک مشورت کنید.
        </span>
      </div>
    </div>
  );
};
