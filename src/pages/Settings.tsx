import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore, PetProfile, DEFAULT_PREFERENCES } from '../store';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { 
  User, Bell, Shield, Eye, HardDrive, 
  Plus, Check, Settings, Accessibility, 
  ChevronRight, Smile, Trash2, Save, Calendar, Sparkles, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePreferences } from '../preferences/PreferencesProvider';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { MotionSettings } from '../components/settings/MotionSettings';
import { AccessibilitySettings } from '../components/settings/AccessibilitySettings';
import { DisplaySettings } from '../components/settings/DisplaySettings';
import { AiPrivacySettings } from '../components/settings/AiPrivacySettings';
import { DataManagementSettings } from '../components/settings/DataManagementSettings';
import { MotionDialog } from '../motion';

type ActiveTab = 'pets' | 'notifications' | 'motion' | 'accessibility' | 'display' | 'ai' | 'data';

export default function SettingsPage() {
  const navigate = useNavigate();
  const profile = useAppStore(state => state.profile);
  const pets = useAppStore(state => state.pets || []);
  const selectedPetId = useAppStore(state => state.selectedPetId);
  const preferences = useAppStore(state => state.preferences || DEFAULT_PREFERENCES);
  
  // Store Actions
  const addPet = useAppStore(state => state.addPet);
  const updatePet = useAppStore(state => state.updatePet);
  const switchPet = useAppStore(state => state.switchPet);
  const deletePet = useAppStore(state => state.deletePet);

  // UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('pets');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [petToDeleteId, setPetToDeleteId] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Forms
  const [editPetForm, setEditPetForm] = useState<Partial<PetProfile>>({
    name: profile?.name || '',
    type: profile?.type || 'dog',
    breed: profile?.breed || '',
    age: profile?.age || 0,
    weight: profile?.weight || 0
  });

  const [newPetForm, setNewPetForm] = useState<Omit<PetProfile, 'id'>>({
    name: '',
    type: 'dog',
    breed: '',
    age: 0,
    weight: 0
  });

  // Update edit form when active pet profile changes
  useEffect(() => {
    if (profile) {
      setEditPetForm({
        name: profile.name,
        type: profile.type,
        breed: profile.breed,
        age: profile.age,
        weight: profile.weight
      });
    }
  }, [profile?.id]);

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleUpdateActivePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    updatePet(profile.id, editPetForm);
    triggerToast("اطلاعات شناسنامه حیوان با موفقیت بروزرسانی شد!");
  };

  const handleAddNewPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetForm.name) return;
    
    const newId = crypto.randomUUID();
    addPet({
      id: newId,
      ...newPetForm
    });
    switchPet(newId);
    
    setNewPetForm({
      name: '',
      type: 'dog',
      breed: '',
      age: 0,
      weight: 0
    });
    setShowAddPetForm(false);
    triggerToast(`حیوان جدید (${newPetForm.name}) با موفقیت اضافه و فعال شد!`);
  };

  const handleDeletePetConfirm = () => {
    if (!petToDeleteId) return;
    const petName = pets.find(p => p.id === petToDeleteId)?.name || 'حیوان';
    deletePet(petToDeleteId);
    setPetToDeleteId(null);
    triggerToast(`پرونده و تمام داده‌های مرتبط با ${petName} با موفقیت پاک شد.`);
  };

  // Setup tabs list
  const tabs: { id: ActiveTab; label: string; icon: any }[] = [
    { id: 'pets', label: 'مدیریت پت‌ها', icon: User },
    { id: 'notifications', label: 'اعلان‌ها و یادآورها', icon: Bell },
    { id: 'motion', label: 'تنظیمات حرکتی', icon: Sparkles },
    { id: 'accessibility', label: 'دسترسی‌پذیری', icon: Accessibility },
    { id: 'display', label: 'نمایش و فرمت‌ها', icon: Calendar },
    { id: 'ai', label: 'حریم خصوصی و هوش مصنوعی', icon: Shield },
    { id: 'data', label: 'پشتیبان‌گیری و داده‌ها', icon: HardDrive },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8 flex-1 flex flex-col" dir="rtl">
      
      {/* Custom Toast Notification */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white font-black text-xs md:text-sm px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-green-500"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Check size={14} />
            </div>
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-coral-light/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-coral/10 text-coral rounded-xl flex items-center justify-center">
            <Settings size={24} className="text-coral" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-coral-deep tracking-tight">تنظیمات پیشرفته برنامه</h1>
            <p className="text-gray-400 font-bold text-xs md:text-sm mt-0.5">پیکربندی هویت پت، یادآورها، هوش مصنوعی، جلوه‌های بصری و کنترل داده‌ها</p>
          </div>
        </div>
      </header>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1">
        
        {/* Navigation Sidebar (3 cols) */}
        <div className="lg:col-span-3 space-y-2.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-right px-4.5 py-3.5 rounded-xl font-bold text-xs flex items-center gap-3.5 transition-all duration-200 border cursor-pointer relative overflow-hidden group outline-none focus-visible:ring-2 focus-visible:ring-coral/40 ${
                  isActive
                    ? 'bg-coral/[0.04] border-coral text-coral-deep shadow-[0_4px_12px_rgba(255,75,78,0.02)] font-black z-10'
                    : 'bg-white border-gray-100 text-gray-500 hover:bg-coral/[0.02] hover:border-coral-light/20 hover:text-gray-800'
                }`}
              >
                {isActive && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-coral" />
                )}
                <Icon size={16} className={isActive ? 'text-coral' : 'text-gray-400 group-hover:text-coral/70 transition-colors duration-200'} />
                <span className="flex-1">{tab.label}</span>
                <ChevronRight size={14} className="mr-auto text-gray-300 group-hover:text-coral/50 transition-transform group-hover:translate-x-0.5" />
              </button>
            );
          })}

          {/* Divider */}
          <div className="h-[1px] bg-coral-light/10 my-3" />

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full text-right px-4.5 py-3.5 rounded-xl font-bold text-xs flex items-center gap-3.5 transition-all duration-200 border cursor-pointer bg-white border-red-100/50 text-red-500 hover:bg-red-50/30 hover:border-red-200 group outline-none focus-visible:ring-2 focus-visible:ring-red-500/20"
          >
            <LogOut size={16} className="text-red-500 group-hover:scale-110 transition-transform duration-200" />
            <span className="flex-1">خروج از حساب</span>
          </button>
        </div>

        {/* Content Pane (9 cols) */}
        <div className="lg:col-span-9 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              
              {/* TAB 1: PETS & PROFILE */}
              {activeTab === 'pets' && (
                <div className="space-y-6">
                  {/* Select Active Pet Card */}
                  <Card hoverEffect={false} className="bg-white p-6 md:p-8 space-y-6 border border-gray-100 shadow-[0_12px_40px_rgba(232,90,93,0.02)]">
                    <div className="border-b border-gray-100 pb-4">
                      <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
                        <Smile size={20} className="text-coral" />
                        <span>دوست‌های دوست‌داشتنی شما (انتخاب پت فعال)</span>
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">حیوان فعال را مشخص کنید تا تمام بخش‌ها از جمله یادآورها و دستیار هوشمند منطبق بر او شوند.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pets.map((pet) => {
                        const isCurrent = pet.id === selectedPetId;
                        return (
                          <div 
                            key={pet.id}
                            className={`border-2 rounded-2xl p-4.5 transition-all flex items-center justify-between cursor-pointer group ${
                              isCurrent 
                                ? 'bg-coral/5 border-coral shadow-md shadow-coral/5' 
                                : 'bg-white border-gray-100 hover:border-coral-light/50 hover:bg-gray-50/50'
                            }`}
                            onClick={() => switchPet(pet.id)}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-4xl filter drop-shadow group-hover:scale-110 transition-transform">{pet.type === 'dog' ? '🐶' : '🐱'}</span>
                              <div className="space-y-0.5">
                                <h4 className="font-black text-sm text-gray-800 flex items-center gap-1.5">
                                  <span>{pet.name}</span>
                                  {isCurrent && <span className="bg-coral text-white text-[9px] px-2 py-0.5 rounded-full font-black">فعال</span>}
                                </h4>
                                <p className="text-[10px] text-gray-400 font-bold">
                                  {pet.breed || 'نژاد ترکیبی'} • {pet.age} ساله • {pet.weight} کیلوگرم
                                </p>
                              </div>
                            </div>

                            {/* Delete Pet action (if not the only pet) */}
                            {pets.length > 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPetToDeleteId(pet.id);
                                }}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                title="حذف پرونده این پت"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        );
                      })}

                      {/* Add new pet card */}
                      {!showAddPetForm && (
                        <button
                          onClick={() => setShowAddPetForm(true)}
                          className="border-2 border-dashed border-gray-200 rounded-2xl p-4.5 transition-all flex items-center justify-center gap-2 text-gray-400 hover:border-coral/50 hover:text-coral hover:bg-coral/5 cursor-pointer text-sm font-bold h-full min-h-[75px]"
                        >
                          <Plus size={16} />
                          <span>افزودن دوست جدید</span>
                        </button>
                      )}
                    </div>
                  </Card>

                  {/* Add Pet Form (Collapsible) */}
                  <AnimatePresence>
                    {showAddPetForm && (
                      <motion.div
                        initial={{ opacity: 0, y: -15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                      >
                        <Card className="bg-white p-6 md:p-8 space-y-6 border border-gray-100">
                          <div className="border-b border-gray-100 pb-4 flex justify-between items-center">
                            <div>
                              <h3 className="font-black text-gray-800 text-base">افزودن پرونده حیوان خانگی جدید</h3>
                              <p className="text-xs text-gray-400 mt-0.5">اطلاعات شناسنامه پت جدید خود را ثبت کنید.</p>
                            </div>
                            <button 
                              onClick={() => setShowAddPetForm(false)}
                              className="text-xs font-black text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                              انصراف
                            </button>
                          </div>

                          <form onSubmit={handleAddNewPet} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                              <button
                                type="button"
                                onClick={() => setNewPetForm({ ...newPetForm, type: 'dog' })}
                                className={`border-2 p-4 rounded-xl text-center font-bold text-sm flex flex-col items-center gap-2 cursor-pointer transition-all ${
                                  newPetForm.type === 'dog' ? 'border-coral bg-coral/5 text-coral-deep font-black' : 'border-gray-100 bg-white text-gray-500'
                                }`}
                              >
                                <span className="text-3xl">🐶</span>
                                <span>سگ دوست‌داشتنی</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setNewPetForm({ ...newPetForm, type: 'cat' })}
                                className={`border-2 p-4 rounded-xl text-center font-bold text-sm flex flex-col items-center gap-2 cursor-pointer transition-all ${
                                  newPetForm.type === 'cat' ? 'border-coral bg-coral/5 text-coral-deep font-black' : 'border-gray-100 bg-white text-gray-500'
                                }`}
                              >
                                <span className="text-3xl">🐱</span>
                                <span>گربه نازپرورده</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">اسم پت</label>
                                <input 
                                  type="text"
                                  value={newPetForm.name}
                                  onChange={e => setNewPetForm({ ...newPetForm, name: e.target.value })}
                                  className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-coral/40 text-sm text-gray-800 font-bold"
                                  placeholder="مثلا فندق، برفی..."
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">نژاد</label>
                                <input 
                                  type="text"
                                  value={newPetForm.breed}
                                  onChange={e => setNewPetForm({ ...newPetForm, breed: e.target.value })}
                                  className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-coral/40 text-sm text-gray-800 font-bold"
                                  placeholder="مثلا پرشین، ژرمن، بومی..."
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">سن (سال)</label>
                                <input 
                                  type="number"
                                  value={newPetForm.age || ''}
                                  onChange={e => setNewPetForm({ ...newPetForm, age: Number(e.target.value) || 0 })}
                                  className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-coral/40 text-sm text-gray-800 text-center font-bold"
                                  placeholder="مثلاً ۲"
                                  dir="ltr"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1.5">وزن (کیلوگرم)</label>
                                <input 
                                  type="number"
                                  step="0.1"
                                  value={newPetForm.weight || ''}
                                  onChange={e => setNewPetForm({ ...newPetForm, weight: Number(e.target.value) || 0 })}
                                  className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-coral/40 text-sm text-gray-800 text-center font-bold"
                                  placeholder="مثلاً ۶.۵"
                                  dir="ltr"
                                />
                              </div>
                            </div>

                            <Button type="submit" variant="primary" className="w-full py-3.5 text-xs font-black">
                              <Plus size={14} />
                              <span>تکمیل پرونده پت جدید</span>
                            </Button>
                          </form>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Active Pet Form Details */}
                  {profile && (
                    <Card className="bg-white p-6 md:p-8 space-y-6">
                      <div className="border-b border-gray-100 pb-4">
                        <h3 className="font-black text-gray-800 text-base">ویرایش مشخصات حیوان فعال ({profile.name})</h3>
                        <p className="text-xs text-gray-400 mt-0.5">اصلاح مشخصات شناسنامه از جمله سن دقیق و وزن فعلی پت.</p>
                      </div>

                      <form onSubmit={handleUpdateActivePet} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1.5">اسم پت</label>
                            <input 
                              type="text"
                              value={editPetForm.name}
                              onChange={e => setEditPetForm({ ...editPetForm, name: e.target.value })}
                              className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-coral/40 text-sm text-gray-800 font-bold"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1.5">نژاد</label>
                            <input 
                              type="text"
                              value={editPetForm.breed}
                              onChange={e => setEditPetForm({ ...editPetForm, breed: e.target.value })}
                              className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-coral/40 text-sm text-gray-800 font-bold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1.5">سن (سال)</label>
                            <input 
                              type="number"
                              value={editPetForm.age || ''}
                              onChange={e => setEditPetForm({ ...editPetForm, age: Number(e.target.value) || 0 })}
                              className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-coral/40 text-sm text-gray-800 text-center font-bold"
                              dir="ltr"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1.5">وزن (کیلوگرم)</label>
                            <input 
                              type="number"
                              step="0.1"
                              value={editPetForm.weight || ''}
                              onChange={e => setEditPetForm({ ...editPetForm, weight: Number(e.target.value) || 0 })}
                              className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-coral/40 text-sm text-gray-800 text-center font-bold"
                              dir="ltr"
                            />
                          </div>
                        </div>

                        <Button type="submit" className="w-full py-3.5 text-xs font-black bg-coral text-white hover:scale-[1.01] active:scale-[0.99] transition-transform">
                          <Save size={14} />
                          <span>ذخیره تغییرات شناسنامه</span>
                        </Button>
                      </form>
                    </Card>
                  )}
                </div>
              )}

              {/* TAB 2: NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <Card hoverEffect={false} className="bg-white p-6 md:p-8 space-y-6 border border-gray-100 shadow-[0_12px_40px_rgba(232,90,93,0.02)]">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
                      <Bell size={20} className="text-sunny" />
                      <span>اعلان‌ها و هشدارهای سرپرست</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">تنظیم نوتیفیکیشن‌های درون‌برنامه‌ای، مرورگر و ساعات خواب برای عدم ایجاد مزاحمت.</p>
                  </div>
                  <NotificationSettings />
                </Card>
              )}

              {/* TAB 3: MOTION */}
              {activeTab === 'motion' && (
                <Card hoverEffect={false} className="bg-white p-6 md:p-8 space-y-6 border border-gray-100 shadow-[0_12px_40px_rgba(232,90,93,0.02)]">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
                      <Sparkles size={20} className="text-mint" />
                      <span>تنظیمات انیمیشن و جلوه‌های پویا</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">مدیریت فیدبک‌های حرکتی کارت‌ها، جلوه‌های نوری موس و انیمیشن‌های کلی مرور صفحات.</p>
                  </div>
                  <MotionSettings />
                </Card>
              )}

              {/* TAB 4: ACCESSIBILITY */}
              {activeTab === 'accessibility' && (
                <Card hoverEffect={false} className="bg-white p-6 md:p-8 space-y-6 border border-gray-100 shadow-[0_12px_40px_rgba(232,90,93,0.02)]">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
                      <Accessibility size={20} className="text-coral" />
                      <span>دسترسی‌پذیری و خوانایی قلم</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">تطبیق ابعاد ظاهری و متون برای استفاده آسان‌تر افراد با چالش‌های خوانایی چشم.</p>
                  </div>
                  <AccessibilitySettings />
                </Card>
              )}

              {/* TAB 5: DISPLAY */}
              {activeTab === 'display' && (
                <Card hoverEffect={false} className="bg-white p-6 md:p-8 space-y-6 border border-gray-100 shadow-[0_12px_40px_rgba(232,90,93,0.02)]">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
                      <Calendar size={20} className="text-blue" />
                      <span>قالب‌ها، تاریخ و منطقه زمانی</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">کنترل نحوه نمایش اعداد به فارسی، تقویم جلالی شمسی و هماهنگ‌سازی منطقه جغرافیایی.</p>
                  </div>
                  <DisplaySettings />
                </Card>
              )}

              {/* TAB 6: AI */}
              {activeTab === 'ai' && (
                <Card hoverEffect={false} className="bg-white p-6 md:p-8 space-y-6 border border-gray-100 shadow-[0_12px_40px_rgba(232,90,93,0.02)]">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
                      <Shield size={20} className="text-coral" />
                      <span>حریم خصوصی هوش مصنوعی (Gemini API)</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">تنظیم میزان اشتراک‌گذاری داده‌های پت جهت ترجمه رفتار یا مربی هوشمند.</p>
                  </div>
                  <AiPrivacySettings />
                </Card>
              )}

              {/* TAB 7: DATA */}
              {activeTab === 'data' && (
                <Card hoverEffect={false} className="bg-white p-6 md:p-8 space-y-6 border border-gray-100 shadow-[0_12px_40px_rgba(232,90,93,0.02)]">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
                      <HardDrive size={20} className="text-sunny" />
                      <span>پشتیبان‌گیری، بازیابی و حذف داده‌ها</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">برون‌بری کامل داده‌ها یا خالی کردن دیتابیس لوکال بدون برجای ماندن ردپا.</p>
                  </div>
                  <DataManagementSettings onSuccessToast={triggerToast} />
                </Card>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Delete Pet Modal */}
      <MotionDialog
        isOpen={!!petToDeleteId}
        onClose={() => setPetToDeleteId(null)}
        size="sm"
      >
        <div className="p-6 text-center space-y-4">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
            <Trash2 size={24} />
          </div>
          <div className="space-y-1.5">
            <h4 className="font-black text-gray-800 text-base">حذف دائمی پرونده پت؟</h4>
            <p className="text-xs text-gray-400 font-bold leading-relaxed">
              با حذف «{pets.find(p => p.id === petToDeleteId)?.name}»، پرونده شناسنامه، واکسیناسیون، نمودار وزن و کل یادآورهای ثبت شده او برای همیشه حذف خواهد شد.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleDeletePetConfirm}
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black cursor-pointer shadow-md shadow-red-500/10 active:scale-95 transition-all"
            >
              بله، پرونده حذف شود
            </button>
            <button
              onClick={() => setPetToDeleteId(null)}
              className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl text-xs font-black cursor-pointer active:scale-95 transition-all border border-gray-100"
            >
              خیر، لغو اقدام
            </button>
          </div>
        </div>
      </MotionDialog>

      {/* Logout Confirmation Modal */}
      <MotionDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        size="sm"
      >
        <div className="p-6 text-center space-y-4">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
            <LogOut size={24} className="rotate-180 text-red-500" />
          </div>
          <div className="space-y-1.5">
            <h4 className="font-black text-gray-800 text-base">خروج از حساب کاربری</h4>
            <p className="text-xs text-gray-400 font-bold leading-relaxed">
              آیا واقعاً می‌خواهید از حساب کاربری خود خارج شوید؟ با خروج، موقتاً به صفحه خوش‌آمدگویی هدایت می‌شوید اما داده‌های شما در این دستگاه محفوظ می‌ماند.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                setShowLogoutConfirm(false);
                // Clear the profile in store
                useAppStore.setState({ profile: null });
                navigate('/');
              }}
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black cursor-pointer shadow-md shadow-red-500/10 active:scale-95 transition-all"
            >
              بله، خارج می‌شوم
            </button>
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl text-xs font-black cursor-pointer active:scale-95 transition-all border border-gray-100"
            >
              خیر، انصراف
            </button>
          </div>
        </div>
      </MotionDialog>

    </div>
  );
}
