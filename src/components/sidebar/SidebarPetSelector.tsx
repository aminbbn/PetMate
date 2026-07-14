import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toPersian } from '../../lib/persian';
import { useMotionPreferences } from '../../motion/useMotionPreferences';
import { Link } from 'react-router-dom';

interface SidebarPetSelectorProps {
  isCollapsed: boolean;
  onNavigate?: () => void;
}

export const SidebarPetSelector: React.FC<SidebarPetSelectorProps> = ({
  isCollapsed,
  onNavigate
}) => {
  const profile = useAppStore(state => state.profile);
  const pets = useAppStore(state => state.pets || []);
  const switchPet = useAppStore(state => state.switchPet);
  const { reducedMotion } = useMotionPreferences();

  const [isOpen, setIsOpen] = useState(false);

  if (!profile) return null;

  const sanitizeName = (name: string) => {
    const trimmed = (name || '').trim();
    if (!trimmed || trimmed.toLowerCase() === 'a' || trimmed === '') return 'پشمک';
    return trimmed;
  };

  const sanitizeBreed = (breed: string) => {
    const trimmed = (breed || '').trim();
    if (!trimmed || trimmed.toLowerCase() === 'a' || trimmed === '') return 'نژاد ترکیبی';
    return trimmed;
  };

  const petName = sanitizeName(profile.name);
  const petBreed = sanitizeBreed(profile.breed);

  const handlePetSwitch = (petId: string) => {
    switchPet(petId);
    setIsOpen(false);
    if (onNavigate) onNavigate();
  };

  const hasMultiplePets = pets.length > 1;

  return (
    <div className="relative select-none z-30">
      {isCollapsed ? (
        // Collapsed view: Simply show the avatar with a dropdown indicator or badge
        <div className="relative flex justify-center py-1">
          <motion.button
            whileHover={!reducedMotion ? { scale: 1.05 } : undefined}
            whileTap={!reducedMotion ? { scale: 0.95 } : undefined}
            onClick={() => hasMultiplePets && setIsOpen(!isOpen)}
            className={cn(
              "w-11 h-11 bg-gradient-to-br from-sunny/20 to-coral/20 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-coral-light/10 relative",
              hasMultiplePets ? "cursor-pointer" : "cursor-default"
            )}
            title={petName}
          >
            {profile.type === 'dog' ? '🐶' : '🐱'}
            
            {hasMultiplePets && (
              <span className="absolute bottom-[-1px] left-[-1px] w-3.5 h-3.5 bg-coral rounded-full border border-white flex items-center justify-center text-[8px] text-white font-black">
                {toPersian(pets.length)}
              </span>
            )}
          </motion.button>
        </div>
      ) : (
        // Expanded view: Compact full pet card
        <div className="space-y-1">
          <motion.div
            onClick={() => hasMultiplePets && setIsOpen(!isOpen)}
            className={cn(
              "bg-gradient-to-br from-peach/20 via-white to-coral/5 rounded-2xl p-3 border border-coral-light/10 relative overflow-hidden shadow-sm transition-all duration-300",
              hasMultiplePets ? "cursor-pointer hover:border-coral-light/25 active:scale-[0.99]" : ""
            )}
          >
            <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-coral/10 rounded-full blur-lg" />
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-sunny/15 to-coral/15 rounded-xl shadow-inner flex items-center justify-center text-xl shrink-0">
                  {profile.type === 'dog' ? '🐶' : '🐱'}
                </div>
                <div className="flex flex-col text-right justify-center">
                  <h3 className="font-black text-gray-800 text-xs leading-tight">{petName}</h3>
                  <p className="text-[10px] text-gray-400 font-bold leading-tight mt-0.5">{petBreed}</p>
                  
                  {/* Compact Metadata Row instead of large metrics boxes */}
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold mt-1 leading-none">
                    <span>{toPersian(profile.age)} سال</span>
                    <span className="text-gray-300 select-none">•</span>
                    <span>{toPersian(profile.weight)} ک‌گ</span>
                  </div>
                </div>
              </div>

              {hasMultiplePets && (
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-400 hover:text-coral transition-colors"
                >
                  <ChevronDown size={14} strokeWidth={2.5} />
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Dropdown Selection Panel */}
      <AnimatePresence>
        {isOpen && hasMultiplePets && (
          <motion.div
            initial={{ opacity: 0, y: isCollapsed ? 0 : -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isCollapsed ? 0 : -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className={cn(
              "absolute bg-white/95 backdrop-blur-md rounded-2xl border border-coral-light/20 shadow-xl overflow-hidden z-40 max-h-[240px] overflow-y-auto font-sans text-right",
              isCollapsed 
                ? "left-[-12px] -translate-x-full top-2 w-[220px]" 
                : "left-0 right-0 top-full mt-2"
            )}
            dir="rtl"
          >
            <div className="p-3 bg-peach/5 border-b border-coral-light/10 text-right">
              <span className="text-[10px] text-gray-400 font-bold">تعویض پروفایل حیوان خانگی</span>
            </div>

            <div className="py-1">
              {pets.map((pet) => {
                const isPetActive = pet.id === profile.id;
                const petNameStr = sanitizeName(pet.name);
                const petBreedStr = sanitizeBreed(pet.breed);

                return (
                  <button
                    key={pet.id}
                    onClick={() => handlePetSwitch(pet.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3.5 py-2.5 transition-colors text-right border-b border-gray-50/50 last:border-0",
                      isPetActive 
                        ? "bg-coral/5 font-black text-coral-deep" 
                        : "hover:bg-peach/10 text-gray-600"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-gradient-to-br from-sunny/10 to-coral/10 rounded-lg flex items-center justify-center text-lg shadow-inner">
                        {pet.type === 'dog' ? '🐶' : '🐱'}
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-xs font-bold leading-tight">{petNameStr}</span>
                        <span className="text-[9px] text-gray-400 leading-none mt-0.5">{petBreedStr}</span>
                      </div>
                    </div>

                    {isPetActive && (
                      <Check size={14} className="text-coral" strokeWidth={3} />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-2 border-t border-coral-light/10 bg-gray-50/50">
              <Link 
                to="/settings" 
                onClick={() => {
                  setIsOpen(false);
                  if (onNavigate) onNavigate();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-dashed border-coral-light/30 text-[10px] font-bold text-coral hover:text-coral-deep hover:bg-coral/5 transition-all text-center"
              >
                <Plus size={12} strokeWidth={2.5} />
                <span>مدیریت و افزودن حیوانات</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div 
          className="fixed inset-0 z-20 cursor-default" 
          onClick={() => setIsOpen(false)} 
        />
      )}
    </div>
  );
};
