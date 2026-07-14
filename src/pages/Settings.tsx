import React, { useState, useRef } from 'react';
import { useAppStore, PetProfile, AppPreferences, DEFAULT_PREFERENCES } from '../store';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { 
  User, Bell, Shield, Eye, HelpCircle, HardDrive, 
  Trash2, Plus, Check, Info, AlertTriangle, 
  Download, Upload, Save, Sparkles, RefreshCw,
  Heart, Calendar, Settings, Accessibility, Trash,
  ChevronRight, Smile, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPersian } from '../lib/persian';

type ActiveTab = 'pets' | 'notifications' | 'motion' | 'display' | 'ai' | 'data';

export default function SettingsPage() {
  const profile = useAppStore(state => state.profile);
  const pets = useAppStore(state => state.pets || []);
  const selectedPetId = useAppStore(state => state.selectedPetId);
  const preferences = useAppStore(state => state.preferences || DEFAULT_PREFERENCES);
  
  // Store Actions
  const addPet = useAppStore(state => state.addPet);
  const updatePet = useAppStore(state => state.updatePet);
  const switchPet = useAppStore(state => state.switchPet);
  const deletePet = useAppStore(state => state.deletePet);
  const updatePreferences = useAppStore(state => state.updatePreferences);
  const resetPreferences = useAppStore(state => state.resetPreferences);
  const resetAllData = useAppStore(state => state.resetAllData);

  // UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('pets');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [petToDeleteId, setPetToDeleteId] = useState<string | null>(null);

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

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update edit form when active pet profile changes
  React.useEffect(() => {
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
    setTimeout(() => setSuccessToast(null), 3000);
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

  const handleExportData = () => {
    try {
      const state = useAppStore.getState();
      const exportObject = {
        app: "PetMate",
        exportVersion: 1,
        exportedAt: new Date().toISOString(),
        data: {
          profile: state.profile,
          reminders: state.reminders,
          healthRecords: state.healthRecords,
          weightHistory: state.weightHistory,
          weightGoals: state.weightGoals,
          vets: state.vets,
          pets: state.pets,
          selectedPetId: state.selectedPetId,
          cart: state.cart,
          favorites: state.favorites,
          foods: state.foods,
          feedingPlans: state.feedingPlans,
          mealLogs: state.mealLogs,
          hydrationLogs: state.hydrationLogs,
          foodSensitivities: state.foodSensitivities,
          nutritionSettings: state.nutritionSettings,
          behaviorObservations: state.behaviorObservations,
          behaviorAssessments: state.behaviorAssessments,
          trainingGoals: state.trainingGoals,
          trainingSessions: state.trainingSessions,
          preferences: state.preferences
        }
      };

      const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `petmate-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      triggerToast("پشتیبان‌گیری کامل با موفقیت انجام و فایل دانلود شد.");
    } catch (err) {
      console.error(err);
      triggerToast("خطا در پشتیبان‌گیری از داده‌ها.");
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.app !== "PetMate") {
          alert("فایل پشتیبان نامعتبر است. لطفاً فایل تولید شده توسط خود برنامه پت میت را بارگذاری کنید.");
          return;
        }

        const data = json.data;
        if (!data) return;

        // Merge or set state safely
        const store = useAppStore.getState();
        
        // Update all fields safely
        useAppStore.setState({
          profile: data.profile || null,
          reminders: data.reminders || [],
          healthRecords: data.healthRecords || [],
          weightHistory: data.weightHistory || [],
          weightGoals: data.weightGoals || [],
          vets: data.vets || [],
          pets: data.pets || [],
          selectedPetId: data.selectedPetId || null,
          cart: data.cart || { items: [], updatedAt: new Date().toISOString() },
          favorites: data.favorites || [],
          foods: data.foods || [],
          feedingPlans: data.feedingPlans || [],
          mealLogs: data.mealLogs || [],
          hydrationLogs: data.hydrationLogs || [],
          foodSensitivities: data.foodSensitivities || [],
          nutritionSettings: data.nutritionSettings || [],
          behaviorObservations: data.behaviorObservations || [],
          behaviorAssessments: data.behaviorAssessments || [],
          trainingGoals: data.trainingGoals || [],
          trainingSessions: data.trainingSessions || [],
          preferences: data.preferences || DEFAULT_PREFERENCES
        });

        triggerToast("بازیابی داده‌های پشتیبان با موفقیت انجام شد.");
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        console.error(err);
        alert("خطا در خواندن فایل پشتیبان. لطفاً مطمئن شوید ساختار فایل کاملاً صحیح است.");
      }
    };
    reader.readAsText(file);
  };

  const handleFeatureReset = (feature: string) => {
    if (!window.confirm(`آیا مطمئن هستید که می‌خواهید تمام داده‌های مربوط به بخش «${feature}» را برای همیشه حذف کنید؟`)) {
      return;
    }

    const set = useAppStore.setState;
    if (feature === 'reminders') set({ reminders: [] });
    else if (feature === 'health') set({ healthRecords: [], weightHistory: [], weightGoals: [] });
    else if (feature === 'nutrition') set({ foods: [], feedingPlans: [], mealLogs: [], hydrationLogs: [] });
    else if (feature === 'behavior') set({ behaviorObservations: [], behaviorAssessments: [] });
    else if (feature === 'training') set({ trainingGoals: [], trainingSessions: [] });

    triggerToast(`داده‌های بخش «${feature}» با موفقیت به طور کامل تخلیه شدند.`);
  };

  const handleGlobalReset = () => {
    if (window.confirm('🚨 هشدار بسیار مهم: این عمل تمام پرونده‌ها، اطلاعات پت‌ها، تنظیمات، تاریخچه، داروها و تغذیه را برای همیشه پاک کرده و برنامه را به حالت اولیه بازمی‌گرداند. آیا مطمئن هستید؟')) {
      resetAllData();
      triggerToast("برنامه با موفقیت به طور کامل تنظیم مجدد شد.");
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const toggleNotificationSetting = (key: keyof AppPreferences['notifications']) => {
    updatePreferences({
      notifications: {
        ...preferences.notifications,
        [key]: !preferences.notifications[key]
      }
    });
  };

  const toggleMotionSetting = (key: keyof AppPreferences['motion']) => {
    updatePreferences({
      motion: {
        ...preferences.motion,
        [key]: !preferences.motion[key]
      }
    });
  };

  const toggleAccessibilitySetting = (key: keyof AppPreferences['accessibility']) => {
    updatePreferences({
      accessibility: {
        ...preferences.accessibility,
        [key]: !preferences.accessibility[key]
      }
    });
  };

  const toggleAiSetting = (key: keyof AppPreferences['aiPrivacy']) => {
    updatePreferences({
      aiPrivacy: {
        ...preferences.aiPrivacy,
        [key]: !preferences.aiPrivacy[key]
      }
    });
  };

  // Convert English numbers to Persian if preferred, else keep Latin
  const formatNum = (num: number | string | undefined | null): string => {
    if (num === undefined || num === null) return '';
    return preferences.display.digitStyle === 'persian' ? toPersian(num) : String(num);
  };

  const tabs: { id: ActiveTab; label: string; icon: any; glowColor: 'coral' | 'sunny' | 'mint' | 'blue' }[] = [
    { id: 'pets', label: 'مدیریت پت‌ها', icon: User, glowColor: 'coral' },
    { id: 'notifications', label: 'اعلان‌ها و یادآورها', icon: Bell, glowColor: 'sunny' },
    { id: 'motion', label: 'حرکت و دسترسی‌پذیری', icon: Accessibility, glowColor: 'mint' },
    { id: 'display', label: 'نمایش و فرمت‌ها', icon: Calendar, glowColor: 'blue' },
    { id: 'ai', label: 'حریم خصوصی و هوش مصنوعی', icon: Shield, glowColor: 'coral' },
    { id: 'data', label: 'پشتیبان‌گیری و داده‌ها', icon: HardDrive, glowColor: 'sunny' },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8 flex-1 flex flex-col" dir="rtl">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white font-bold text-xs md:text-sm px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-green-500"
          >
            <Check size={18} />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-coral-light/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-coral/10 text-coral rounded-xl flex items-center justify-center">
            <Settings size={24} className="animate-[spin_12s_linear_infinite]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-coral-deep tracking-tight">تنظیمات پیشرفته برنامه</h1>
            <p className="text-gray-400 font-bold text-xs md:text-sm mt-0.5">پیکربندی هویت پت، یادآورها، هوش مصنوعی، جلوه‌های بصری و کنترل داده‌ها</p>
          </div>
        </div>
      </header>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-right px-4.5 py-4.5 rounded-2xl font-bold text-sm flex items-center gap-3.5 transition-all duration-300 border cursor-pointer relative overflow-hidden group ${
                  isActive
                    ? 'bg-white border-coral text-coral-deep shadow-md font-black z-10'
                    : 'bg-white/50 border-gray-100 text-gray-500 hover:bg-white hover:text-gray-800'
                }`}
              >
                {isActive && (
                  <div className={`absolute right-0 top-0 bottom-0 w-1.5 bg-${tab.glowColor === 'coral' ? 'coral' : tab.glowColor === 'sunny' ? 'sunny' : 'green-500'}`} />
                )}
                <Icon size={18} className={isActive ? 'text-coral animate-pulse' : 'text-gray-400 group-hover:text-gray-600'} />
                <span>{tab.label}</span>
                <ChevronRight size={14} className="mr-auto text-gray-300 group-hover:text-gray-500 transition-transform group-hover:translate-x-1" />
              </button>
            );
          })}
        </div>

        {/* Content Pane (9 cols) */}
        <div className="lg:col-span-9 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* TAB 1: PETS & PROFILE */}
              {activeTab === 'pets' && (
                <div className="space-y-6">
                  {/* Select Active Pet Card */}
                  <Card glow glowColor="coral" className="bg-white p-6 md:p-8 space-y-6">
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
                                  {isCurrent && <span className="bg-coral text-white text-[9px] px-2 py-0.5 rounded-full">فعال</span>}
                                </h4>
                                <p className="text-[10px] text-gray-400 font-bold">{pet.breed || 'نژاد ترکیبی'} • {formatNum(pet.age)} ساله • {formatNum(pet.weight)} کیلوگرم</p>
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
                                  newPetForm.type === 'dog' ? 'border-coral bg-coral/5 text-coral-deep' : 'border-gray-100 bg-white text-gray-500'
                                }`}
                              >
                                <span className="text-3xl">🐶</span>
                                <span>سگ دوست‌داشتنی</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setNewPetForm({ ...newPetForm, type: 'cat' })}
                                className={`border-2 p-4 rounded-xl text-center font-bold text-sm flex flex-col items-center gap-2 cursor-pointer transition-all ${
                                  newPetForm.type === 'cat' ? 'border-coral bg-coral/5 text-coral-deep' : 'border-gray-100 bg-white text-gray-500'
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
                                  className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-coral/40 text-sm text-gray-800"
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
                                  className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-coral/40 text-sm text-gray-800"
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
                                  className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-coral/40 text-sm text-gray-800 text-center"
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
                                  className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-coral/40 text-sm text-gray-800 text-center"
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
                              className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-coral/40 text-sm text-gray-800"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1.5">نژاد</label>
                            <input 
                              type="text"
                              value={editPetForm.breed}
                              onChange={e => setEditPetForm({ ...editPetForm, breed: e.target.value })}
                              className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-coral/40 text-sm text-gray-800"
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
                              className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-coral/40 text-sm text-gray-800 text-center"
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
                              className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-coral/40 text-sm text-gray-800 text-center"
                              dir="ltr"
                            />
                          </div>
                        </div>

                        <Button type="submit" className="w-full py-3.5 text-xs font-black bg-coral text-white">
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
                <Card glow glowColor="sunny" className="bg-white p-6 md:p-8 space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
                      <Bell size={20} className="text-sunny" />
                      <span>تنظیمات یادآورها و اعلان‌ها</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">مدیریت رفتار صوتی و زمان‌بندی یادآورها بر اساس استانداردهای مرورگر و نیاز پت.</p>
                  </div>

                  <div className="space-y-6">
                    {/* In-app notification toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                      <div>
                        <h4 className="text-sm font-black text-gray-800">اعلان‌های درون‌برنامه‌ای فعال</h4>
                        <p className="text-xs text-gray-400 mt-0.5">در هنگام کار با برنامه، یادآورها به صورت بنر درون‌برنامه‌ای نمایش داده شوند.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={preferences.notifications.inAppEnabled}
                          onChange={() => toggleNotificationSetting('inAppEnabled')}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:left-auto after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sunny"></div>
                      </label>
                    </div>

                    {/* Browser-level notification simulation check */}
                    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                      <div>
                        <h4 className="text-sm font-black text-gray-800">هشدار صوتی و هشدارهای مرورگر (Push)</h4>
                        <p className="text-xs text-gray-400 mt-0.5">ارسال اعلان از طریق نوتیفیکیشن مرورگر در پس‌زمینه (نیازمند پشتیبانی مرورگر و مجوز کاربر).</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={preferences.notifications.browserEnabled}
                          onChange={() => toggleNotificationSetting('browserEnabled')}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:left-auto after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sunny"></div>
                      </label>
                    </div>

                    {/* Default offset */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-600">زمان هشدار پیش از فرارسیدن موعد یادآور</label>
                      <select 
                        value={preferences.notifications.defaultReminderOffsetMinutes}
                        onChange={e => updatePreferences({
                          notifications: {
                            ...preferences.notifications,
                            defaultReminderOffsetMinutes: Number(e.target.value)
                          }
                        })}
                        className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-3 outline-none text-sm text-gray-800"
                      >
                        <option value="0">دقیقاً در زمان موعد</option>
                        <option value="5">۵ دقیقه قبل</option>
                        <option value="15">۱۵ دقیقه قبل</option>
                        <option value="30">۳۰ دقیقه قبل</option>
                        <option value="60">۱ ساعت قبل</option>
                      </select>
                    </div>

                    {/* Quiet hours */}
                    <div className="border-t border-gray-100 pt-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-black text-gray-800">حالت خواب و ساعات بی‌صدا (Quiet Hours)</h4>
                          <p className="text-xs text-gray-400 mt-0.5">در ساعات خواب شبانه پت و سرپرست، هیچ اعلانی صادر نشود.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={preferences.notifications.quietHoursEnabled}
                            onChange={() => toggleNotificationSetting('quietHoursEnabled')}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:left-auto after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sunny"></div>
                        </label>
                      </div>

                      {preferences.notifications.quietHoursEnabled && (
                        <div className="grid grid-cols-2 gap-4 p-4 bg-amber-50/20 rounded-2xl border border-amber-100/50 animate-fadeIn">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1">زمان شروع بی‌صدا</label>
                            <input 
                              type="time" 
                              value={preferences.notifications.quietHoursStart || '22:00'}
                              onChange={e => updatePreferences({
                                notifications: {
                                  ...preferences.notifications,
                                  quietHoursStart: e.target.value
                                }
                              })}
                              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 text-center"
                              dir="ltr"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1">زمان پایان بی‌صدا</label>
                            <input 
                              type="time" 
                              value={preferences.notifications.quietHoursEnd || '08:00'}
                              onChange={e => updatePreferences({
                                notifications: {
                                  ...preferences.notifications,
                                  quietHoursEnd: e.target.value
                                }
                              })}
                              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-700 text-center"
                              dir="ltr"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {/* TAB 3: MOTION & ACCESSIBILITY */}
              {activeTab === 'motion' && (
                <Card glow glowColor="mint" className="bg-white p-6 md:p-8 space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
                      <Accessibility size={20} className="text-green-500" />
                      <span>حرکت، جلوه‌ها و تنظیمات دسترسی‌پذیری</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">تنظیمات دقیق میزان فیدبک‌های حرکتی، درخشندگی گوشه‌ها، پویانمایی و سایز متن‌ها.</p>
                  </div>

                  <div className="space-y-6">
                    {/* Motion Preset Selection */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-600">میزان حرکات و انیمیشن‌های کلی (Motion Mode)</label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['system', 'full', 'reduced'] as const).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => updatePreferences({
                              motion: {
                                ...preferences.motion,
                                mode
                              }
                            })}
                            className={`border-2 p-3.5 rounded-xl text-center font-bold text-xs cursor-pointer transition-all ${
                              preferences.motion.mode === mode 
                                ? 'border-green-500 bg-green-50/10 text-green-700 font-black' 
                                : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                            }`}
                          >
                            {mode === 'system' && '🖥️ هماهنگ با سیستم'}
                            {mode === 'full' && '✨ انیمیشن کامل'}
                            {mode === 'reduced' && '⏸️ انیمیشن کاهش یافته'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-5 space-y-4">
                      <h4 className="text-xs font-black text-gray-700">جلوه‌های بصری کارت‌ها و ویجت‌ها</h4>
                      
                      {/* Cursor Glow toggle */}
                      <div className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <div>
                          <h5 className="text-xs font-black text-gray-800">تعقیب نور با اشاره‌گر موس (Cursor Glow)</h5>
                          <p className="text-[10px] text-gray-400">تابش نوری کارت‌ها به دنبال حرکت موس در حالت دسکتاپ.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={preferences.motion.cursorGlowEnabled}
                            onChange={() => toggleMotionSetting('cursorGlowEnabled')}
                            className="sr-only peer" 
                          />
                          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:left-auto after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>

                      {/* Edge glow toggle */}
                      <div className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <div>
                          <h5 className="text-xs font-black text-gray-800">تابش مرزها و گوشه‌ها (Edge Glow)</h5>
                          <p className="text-[10px] text-gray-400">جلوه درخشان لبه‌های کارت‌ها جهت تفکیک و افزایش شادابی بصری.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={preferences.motion.edgeGlowEnabled}
                            onChange={() => toggleMotionSetting('edgeGlowEnabled')}
                            className="sr-only peer" 
                          />
                          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:left-auto after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>

                      {/* Semantic Icon Animations */}
                      <div className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <div>
                          <h5 className="text-xs font-black text-gray-800">پویانمایی آیکون‌ها (Semantic Icon Animations)</h5>
                          <p className="text-[10px] text-gray-400">چرخش و لرزش نمادهای رفتاری و بهداشتی در هنگام توقف موس روی آن‌ها.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={preferences.motion.semanticIconAnimationsEnabled}
                            onChange={() => toggleMotionSetting('semanticIconAnimationsEnabled')}
                            className="sr-only peer" 
                          />
                          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:left-auto after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-5 space-y-4">
                      <h4 className="text-xs font-black text-gray-700">دسترسی‌پذیری متون</h4>
                      
                      {/* Text scale toggle */}
                      <div className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <div>
                          <h5 className="text-xs font-black text-gray-800">اندازه بزرگ قلم‌ها (Text Scale)</h5>
                          <p className="text-[10px] text-gray-400">بزرگ کردن متون و منوهای کلیدی برای افزایش خوانایی و دسترسی بهتر.</p>
                        </div>
                        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                          {(['normal', 'large'] as const).map((scale) => (
                            <button
                              key={scale}
                              type="button"
                              onClick={() => updatePreferences({
                                accessibility: {
                                  ...preferences.accessibility,
                                  textScale: scale
                                }
                              })}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                                preferences.accessibility.textScale === scale
                                  ? 'bg-white text-green-700 font-black shadow-sm'
                                  : 'text-gray-500'
                              }`}
                            >
                              {scale === 'normal' ? 'معمولی' : 'بزرگ'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Strong focus indicators */}
                      <div className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <div>
                          <h5 className="text-xs font-black text-gray-800">مرزهای فوکوس قوی (Strong Focus Outline)</h5>
                          <p className="text-[10px] text-gray-400">اضافه کردن کادرهای تیره متمایز دور دکمه‌ها و فیلدها در زمان حرکت با کیبورد.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={preferences.accessibility.strongFocusIndicators}
                            onChange={() => toggleAccessibilitySetting('strongFocusIndicators')}
                            className="sr-only peer" 
                          />
                          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:left-auto after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* TAB 4: DISPLAY & FORMATS */}
              {activeTab === 'display' && (
                <Card glow glowColor="blue" className="bg-white p-6 md:p-8 space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
                      <Calendar size={20} className="text-blue-500" />
                      <span>قالب نمایش تاریخ، اعداد و بومی‌سازی</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">شخصی‌سازی دقیق قالب نگارش اعداد، نوع تقویم و بومی‌سازی کامل پت میت.</p>
                  </div>

                  <div className="space-y-6">
                    {/* Digit style */}
                    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                      <div>
                        <h4 className="text-sm font-black text-gray-800">رسم‌الخط اعداد (Digit Style)</h4>
                        <p className="text-xs text-gray-400 mt-0.5">تبدیل سراسری اعداد انگلیسی به فارسی در سن، وزن، فواصل و تاریخ‌ها.</p>
                      </div>
                      <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                        {(['persian', 'latin'] as const).map((style) => (
                          <button
                            key={style}
                            type="button"
                            onClick={() => updatePreferences({
                              display: {
                                ...preferences.display,
                                digitStyle: style
                              }
                            })}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                              preferences.display.digitStyle === style
                                ? 'bg-white text-blue-700 font-black shadow-sm'
                                : 'text-gray-500'
                            }`}
                          >
                            {style === 'persian' ? '۱، ۲، ۳ (فارسی)' : '1, 2, 3 (Latin)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date/Calendar display */}
                    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                      <div>
                        <h4 className="text-sm font-black text-gray-800">تقویم و تاریخ رسمی (Calendar Display)</h4>
                        <p className="text-xs text-gray-400 mt-0.5">تنظیم نوع مبنای تقویم برنامه جهت ثبت زمان تزریق واکسن و یادآورهای هفتگی.</p>
                      </div>
                      <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                        {(['jalali', 'gregorian'] as const).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => updatePreferences({
                              display: {
                                ...preferences.display,
                                dateDisplayMode: mode
                              }
                            })}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                              preferences.display.dateDisplayMode === mode
                                ? 'bg-white text-blue-700 font-black shadow-sm'
                                : 'text-gray-500'
                            }`}
                          >
                            {mode === 'jalali' ? 'جلالی (هجری شمسی)' : 'Gregorian (میلادی)'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* First day of the week */}
                    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                      <div>
                        <h4 className="text-sm font-black text-gray-800">روز آغازین هفته</h4>
                        <p className="text-xs text-gray-400 mt-0.5">تعیین روز مرجع شروع برنامه‌های یادآور تغذیه و تمرین.</p>
                      </div>
                      <span className="text-xs font-black text-blue-700 bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-100">
                        شنبه (منطبق بر تقویم ملی)
                      </span>
                    </div>

                    {/* Weight and temperature default indicators */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-bold block mb-1">یکای اندازه‌گیری وزن</span>
                        <span className="text-xs font-black text-gray-700">کیلوگرم (kg)</span>
                      </div>
                      <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-bold block mb-1">یکای اندازه‌گیری دما</span>
                        <span className="text-xs font-black text-gray-700">درجه سانتی‌گراد (°C)</span>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* TAB 5: AI & PRIVACY */}
              {activeTab === 'ai' && (
                <Card glow glowColor="coral" className="bg-white p-6 md:p-8 space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
                      <Shield size={20} className="text-coral" />
                      <span>حریم خصوصی و حاکمیت داده‌های هوش مصنوعی</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">کنترل دقیق سطح افشای مشخصات پت و حریم ارتباطی شما با دستیار بالینی (Gemini).</p>
                  </div>

                  <div className="space-y-6">
                    {/* Information Context Disclosure Modes */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-black text-gray-800">حالت اشتراک‌گذاری داده با هوش مصنوعی (AI Context Mode)</h4>
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">مشخص کنید در هنگام مکالمه با دستیار غربالگری یا مربی هوشمند، چه میزان از اطلاعات شناسنامه و رفتاری پت به عنوان پیش‌زمینه به سرور هوش مصنوعی ارسال گردد.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                        {(['ask_each_time', 'minimal', 'off'] as const).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => updatePreferences({
                              aiPrivacy: {
                                ...preferences.aiPrivacy,
                                contextMode: mode
                              }
                            })}
                            className={`border-2 p-4 rounded-2xl text-right flex flex-col gap-1.5 cursor-pointer transition-all h-full ${
                              preferences.aiPrivacy.contextMode === mode 
                                ? 'border-coral bg-coral/5 text-coral-deep shadow-sm' 
                                : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                            }`}
                          >
                            <span className="font-black text-xs">
                              {mode === 'ask_each_time' && '🙋‍♂️ هر بار سوال شود'}
                              {mode === 'minimal' && '📋 خلاصه حداقل فرستاده شود'}
                              {mode === 'off' && '❌ عدم ارسال جزییات (ناشناس)'}
                            </span>
                            <span className="text-[10px] text-gray-400 leading-relaxed font-bold">
                              {mode === 'ask_each_time' && 'قبل از ارسال پرونده پت به هوش مصنوعی، برای تایید نهایی از شما اجازه می‌گیرد.'}
                              {mode === 'minimal' && 'فقط نوع حیوان (سگ/گربه) و سن را برای تحلیل بالینی ارسال می‌کند؛ بدون ذکر نام و یادداشت‌ها.'}
                              {mode === 'off' && 'مشخصات پت کاملاً فیلتر شده و کوئری به صورت عمومی و فاقد شناسه پت اجرا خواهد شد.'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-5 space-y-4">
                      <h4 className="text-xs font-black text-gray-700">داده‌های محلی و امنیت تراکنش‌ها</h4>

                      {/* Persist chats locally */}
                      <div className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <div>
                          <h5 className="text-xs font-black text-gray-800">ذخیره دائمی مکالمات در حافظه گوشی (Persist Chats)</h5>
                          <p className="text-[10px] text-gray-400">چت‌های دستیار تریاژ جهت مرور مجدد در دستگاه شما ذخیره شوند.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={preferences.aiPrivacy.persistConversations}
                            onChange={() => toggleAiSetting('persistConversations')}
                            className="sr-only peer" 
                          />
                          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:left-auto after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-coral"></div>
                        </label>
                      </div>

                      {/* Allow media analysis */}
                      <div className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <div>
                          <h5 className="text-xs font-black text-gray-800">تحلیل بومی تصاویر و ویدیوها (Media Analysis)</h5>
                          <p className="text-[10px] text-gray-400">به مدل اجازه داده شود تصاویر آپلود شده رفتاری را برای تحلیل بصری واکاوی کند.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={preferences.aiPrivacy.allowMediaAnalysis}
                            onChange={() => toggleAiSetting('allowMediaAnalysis')}
                            className="sr-only peer" 
                          />
                          <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:left-auto after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-coral"></div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-coral/5 p-4 rounded-xl border border-coral-light/20 flex gap-3.5 items-start mt-2">
                      <Info size={16} className="text-coral shrink-0 mt-0.5 animate-bounce" />
                      <p className="text-xs text-coral-deep leading-relaxed font-bold">
                        <strong>شفافیت اخلاقی و حفظ مطلق حریم خصوصی:</strong> پت میت از هیچ نوع دیتابیس ابری اختصاصی برای رصد متادیتای شما استفاده نمی‌کند. تمام تراکنش‌ها به صورت کلاینت-ساید مدیریت می‌شوند و هیچ فایلی خارج از تعامل زنده مرورگر با هوش مصنوعی ارسال یا نگهداری نخواهد شد.
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* TAB 6: DATA MANAGEMENT */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  {/* Backup & Restore */}
                  <Card glow glowColor="sunny" className="bg-white p-6 md:p-8 space-y-6">
                    <div className="border-b border-gray-100 pb-4">
                      <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
                        <HardDrive size={20} className="text-sunny" />
                        <span>پشتیبان‌گیری، استخراج و بازیابی اطلاعات</span>
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">با صادرات داده‌های محلی خود در قالب یک فایل استاندارد، از امنیت اطلاعات پرونده پت اطمینان حاصل کنید.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-dashed border-gray-200 rounded-2xl p-5 text-center flex flex-col items-center justify-between gap-4 bg-gray-50/20">
                        <div className="space-y-1">
                          <h4 className="text-sm font-black text-gray-800">تهیه فایل نسخه پشتیبان</h4>
                          <p className="text-[10px] text-gray-400 leading-relaxed font-medium">دریافت خروجی ساختاریافته JSON حاوی مشخصات پت‌ها، داروها، واکسن‌ها و سوابق رفتاری.</p>
                        </div>
                        <Button 
                          onClick={handleExportData}
                          variant="outline"
                          className="text-xs font-black py-2.5 w-full border-sunny text-sunny-deep hover:bg-sunny/5"
                        >
                          <Download size={14} />
                          <span>دانلود فایل پشتیبان (Export)</span>
                        </Button>
                      </div>

                      <div className="border border-dashed border-gray-200 rounded-2xl p-5 text-center flex flex-col items-center justify-between gap-4 bg-gray-50/20">
                        <div className="space-y-1">
                          <h4 className="text-sm font-black text-gray-800">بازیابی اطلاعات گذشته</h4>
                          <p className="text-[10px] text-gray-400 leading-relaxed font-medium">بارگذاری یک فایل پشتیبان معتبر پت میت جهت بازنشانی کامل سوابق و تنظیمات قبلی.</p>
                        </div>
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleImportData}
                          accept=".json"
                          className="hidden" 
                        />
                        <Button 
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline"
                          className="text-xs font-black py-2.5 w-full border-green-400 text-green-700 hover:bg-green-50/30"
                        >
                          <Upload size={14} />
                          <span>بارگذاری فایل پشتیبان (Import)</span>
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Partial Data Clear Options */}
                  <Card className="bg-white p-6 md:p-8 space-y-6">
                    <div className="border-b border-gray-100 pb-4">
                      <h3 className="font-black text-gray-800 text-base">حذف تفکیکی و پاکسازی موضوعی داده‌ها</h3>
                      <p className="text-xs text-gray-400 mt-0.5">پاک کردن داده‌های بخش‌های خاص به صورت مجزا بدون اثرگذاری بر شناسنامه پت.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { key: 'reminders', label: 'یادآورها و زمان‌بندی‌ها' },
                        { key: 'health', label: 'سوابق سلامت و تاریخچه وزن' },
                        { key: 'nutrition', label: 'برنامه‌های تغذیه و لاگ غذا' },
                        { key: 'behavior', label: 'مشاهدات رفتاری و ارزیابی‌ها' },
                        { key: 'training', label: 'اهداف آموزشی و جلسات مربی' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-3.5 bg-gray-50/40 rounded-xl border border-gray-100">
                          <span className="text-xs font-bold text-gray-700">{item.label}</span>
                          <button
                            onClick={() => handleFeatureReset(item.key)}
                            className="text-[10px] font-black text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-100"
                          >
                            پاکسازی
                          </button>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Complete Dangerous Purge Section */}
                  <Card className="bg-red-50/20 border-red-200/50 p-6 md:p-8 space-y-4">
                    <div className="flex gap-3 items-start">
                      <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
                      <div className="space-y-1">
                        <h3 className="font-black text-red-900 text-base">منطقه فوق بحرانی و تخریب داده‌ها (Danger Zone)</h3>
                        <p className="text-xs text-red-700/80 leading-relaxed font-medium">حذف کامل تمامی آثار کارکرد برنامه و شروع مجدد از مرحله Onboarding.</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button 
                        onClick={handleGlobalReset}
                        className="text-xs font-black bg-red-600 hover:bg-red-700 text-white border-none py-3.5 w-full rounded-2xl shadow-lg shadow-red-500/10 flex items-center justify-center gap-2"
                      >
                        <Trash size={14} />
                        <span>پاک کردن کل اطلاعات برنامه و تنظیم مجدد (Factory Reset)</span>
                      </Button>
                    </div>
                  </Card>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Delete Pet Confirmation Modal */}
      <AnimatePresence>
        {petToDeleteId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-gray-100 space-y-6 text-right"
              dir="rtl"
            >
              <div className="flex items-center gap-3 text-red-500">
                <AlertTriangle size={24} className="animate-bounce" />
                <h3 className="font-black text-gray-900 text-lg">آیا از حذف این پرونده مطمئن هستید؟</h3>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                با حذف پرونده <strong>«{pets.find(p => p.id === petToDeleteId)?.name}»</strong>، تمام داده‌های بهداشتی، قد و وزن، برنامه‌های غذایی، زمان‌بندی یادآورها، مکالمات، مشاهدات رفتاری و اهداف آموزشی ثبت‌شده برای او به صورت کامل و غیرقابل بازگشت پاک خواهند شد.
              </p>

              <div className="flex gap-3 justify-end pt-2">
                <Button 
                  onClick={() => setPetToDeleteId(null)}
                  variant="outline"
                  className="text-xs font-bold py-3 px-5"
                >
                  انصراف
                </Button>
                <Button 
                  onClick={handleDeletePetConfirm}
                  className="text-xs font-black bg-red-600 hover:bg-red-700 text-white border-none py-3 px-6 rounded-xl"
                >
                  تایید حذف کامل پرونده
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
