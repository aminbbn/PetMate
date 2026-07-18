import React, { useState } from 'react';
import { useAppStore, PetProfile, PetType } from '../../store';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Check, Heart, Sparkles, User, X } from 'lucide-react';
import { toPersian } from '../../lib/persian';
import { MotionDialog } from '../../motion/MotionDialog';

interface ReminderHeaderProps {
  selectedPetId: string | null;
  onSelectPet: (id: string) => void;
}

export default function ReminderHeader({ selectedPetId, onSelectPet }: ReminderHeaderProps) {
  const pets = useAppStore(state => state.pets || []);
  const profile = useAppStore(state => state.profile);
  const addPet = useAppStore(state => state.addPet);

  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetType, setNewPetType] = useState<PetType>('dog');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState('');
  const [newPetWeight, setNewPetWeight] = useState('');

  // Fallback if pets array is empty but main profile exists
  const activePets = pets.length > 0 ? pets : (profile ? [profile] : []);

  const handleAddPetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName.trim()) return;

    const newPet: PetProfile = {
      id: crypto.randomUUID(),
      name: newPetName.trim(),
      type: newPetType,
      breed: newPetBreed.trim() || 'نژاد ترکیبی',
      age: Number(newPetAge) || 1,
      weight: Number(newPetWeight) || 5,
    };

    addPet(newPet);
    onSelectPet(newPet.id);
    
    // Reset Form
    setNewPetName('');
    setNewPetType('dog');
    setNewPetBreed('');
    setNewPetAge('');
    setNewPetWeight('');
    setShowAddPetModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">برنامه‌ریزی و یادآورها</h1>
          <p className="text-gray-400 text-xs mt-1 font-medium">پایش هوشمند زمان‌بندی مراقبت‌ها، تغذیه و سلامت حیوانات خانگی شما</p>
        </div>

        {/* Pet Switcher Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {activePets.map((pet) => {
            const isSelected = pet.id === selectedPetId;
            return (
              <button
                key={pet.id}
                onClick={() => onSelectPet(pet.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-black transition-all shrink-0 cursor-pointer relative ${
                  isSelected
                    ? 'bg-coral border-coral text-white shadow-md shadow-coral/15'
                    : 'bg-white border-gray-100 hover:border-gray-200 text-gray-600'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="activePetBg"
                    className="absolute inset-0 bg-coral rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span>{pet.type === 'dog' ? '🐶' : '🐱'}</span>
                <span>{pet.name}</span>
                {isSelected && <Check size={12} className="stroke-[3]" />}
              </button>
            );
          })}

          <button
            onClick={() => setShowAddPetModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-gray-200 hover:border-coral/40 text-gray-400 hover:text-coral transition-all text-xs font-black shrink-0 cursor-pointer"
          >
            <Plus size={14} />
            <span>افزودن پت</span>
          </button>
        </div>
      </div>

      {/* Add Pet Modal */}
      <MotionDialog
        isOpen={showAddPetModal}
        onClose={() => setShowAddPetModal(false)}
        size="sm"
      >
        <div className="p-6 space-y-6 text-right relative">
          <button
            onClick={() => setShowAddPetModal(false)}
            className="absolute top-5 left-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-50 transition-colors"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-coral/10 text-coral flex items-center justify-center">
              <Heart size={20} fill="currentColor" />
            </div>
            <div>
              <h3 className="font-black text-gray-800 text-lg">افزودن دوست پشمالوی جدید</h3>
              <p className="text-[10px] text-gray-400 font-bold">پت جدید را ثبت کنید تا یادآورهایش را شخصی‌سازی کنید</p>
            </div>
          </div>

          <form onSubmit={handleAddPetSubmit} className="space-y-4">
            {/* Pet Type Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-bold block">نوع حیوان</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNewPetType('dog')}
                  className={`py-3 rounded-xl border font-bold text-center text-xs transition-all ${
                    newPetType === 'dog'
                      ? 'border-coral bg-coral/5 text-coral font-black'
                      : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                  }`}
                >
                  🐶 سگ
                </button>
                <button
                  type="button"
                  onClick={() => setNewPetType('cat')}
                  className={`py-3 rounded-xl border font-bold text-center text-xs transition-all ${
                    newPetType === 'cat'
                      ? 'border-coral bg-coral/5 text-coral font-black'
                      : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                  }`}
                >
                  🐱 گربه
                </button>
              </div>
            </div>

            {/* Pet Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-bold block">نام حیوان</label>
              <input
                type="text"
                required
                value={newPetName}
                onChange={(e) => setNewPetName(e.target.value)}
                placeholder="مثال: پشمک"
                className="w-full bg-gray-50/50 border border-gray-200/60 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-coral/20 transition-all font-black text-gray-700"
              />
            </div>

            {/* Breed */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-gray-400 font-bold block">نژاد</label>
              <input
                type="text"
                value={newPetBreed}
                onChange={(e) => setNewPetBreed(e.target.value)}
                placeholder="مثال: شیتزو، هاسکی (اختیاری)"
                className="w-full bg-gray-50/50 border border-gray-200/60 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-coral/20 transition-all text-gray-700"
              />
            </div>

            {/* Age & Weight */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold block">سن (سال)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newPetAge}
                  onChange={(e) => setNewPetAge(e.target.value)}
                  placeholder="مثال: ۲"
                  className="w-full bg-gray-50/50 border border-gray-200/60 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-coral/20 transition-all text-gray-700"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 font-bold block">وزن (کیلوگرم)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.1"
                  value={newPetWeight}
                  onChange={(e) => setNewPetWeight(e.target.value)}
                  placeholder="مثال: ۵.۴"
                  className="w-full bg-gray-50/50 border border-gray-200/60 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-coral/20 transition-all text-gray-700"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddPetModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-coral text-white rounded-xl text-xs font-black hover:bg-coral-deep transition-all shadow-md shadow-coral/15 cursor-pointer"
              >
                ثبت حیوان خانگی
              </button>
            </div>
          </form>
        </div>
      </MotionDialog>
    </div>
  );
}
