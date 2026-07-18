import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store';
import { VetContact, VetContactRole } from './vetsTypes';
import { VetCard } from './VetCard';
import { VetFormModal } from './VetFormModal';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { 
  Heart, 
  Plus, 
  Search, 
  ShieldAlert, 
  Star, 
  Stethoscope, 
  PhoneCall, 
  Activity, 
  Layers, 
  Info,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPersian } from '../../lib/persian';
import { cn } from '../../lib/utils';

export default function VetsPage() {
  const profile = useAppStore(state => state.profile);
  const selectedPetId = useAppStore(state => state.selectedPetId);
  const vets = useAppStore(state => state.vets || []);
  const deleteVetContact = useAppStore(state => state.deleteVetContact);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRoleFilter, setActiveRoleFilter] = useState<'all' | VetContactRole>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [vetToEdit, setVetToEdit] = useState<VetContact | undefined>(undefined);

  // Filter & Search Logic
  const filteredVets = useMemo(() => {
    return vets.filter(vet => {
      // Role filter
      if (activeRoleFilter !== 'all' && vet.role !== activeRoleFilter) {
        return false;
      }

      // Search term
      if (!searchTerm.trim()) return true;
      const cleanTerm = searchTerm.toLowerCase().trim();
      
      const matchName = vet.name.toLowerCase().includes(cleanTerm);
      const matchClinic = vet.clinic?.toLowerCase().includes(cleanTerm);
      const matchSpecialty = vet.specialty?.toLowerCase().includes(cleanTerm);
      const matchNotes = vet.notes?.toLowerCase().includes(cleanTerm);
      const matchTags = vet.tags?.some(tag => tag.toLowerCase().includes(cleanTerm));
      const matchAddress = vet.address?.toLowerCase().includes(cleanTerm);

      return matchName || matchClinic || matchSpecialty || matchNotes || matchTags || matchAddress;
    });
  }, [vets, searchTerm, activeRoleFilter]);

  // Statistics calculations
  const stats = useMemo(() => {
    const total = vets.length;
    const pinned = vets.filter(v => v.isPinned).length;
    const emergency = vets.filter(v => v.useForEmergency).length;
    const activePetPrimary = selectedPetId 
      ? vets.find(v => v.role === 'primary' && v.petIds.includes(selectedPetId))
      : vets.find(v => v.role === 'primary');

    return {
      total,
      pinned,
      emergency,
      hasPrimary: !!activePetPrimary,
      primaryName: activePetPrimary?.name || 'تعیین نشده'
    };
  }, [vets, selectedPetId]);

  // Find all critical contacts for speed dial (pinned or emergency)
  const speedDialContacts = useMemo(() => {
    return vets.filter(v => v.useForEmergency || v.isPinned);
  }, [vets]);

  const handleEditClick = (vet: VetContact) => {
    setVetToEdit(vet);
    setShowAddModal(true);
  };

  const handleDeleteClick = (id: string, name: string) => {
    if (window.confirm(`آیا مطمئن هستید که می‌خواهید مخاطب دامپزشک "${name}" را حذف کنید؟`)) {
      deleteVetContact(id);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setVetToEdit(undefined);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveRoleFilter('all');
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto w-full text-right" dir="rtl">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <Heart className="text-coral animate-pulse" size={32} />
            پشتیبانان درمانی و سلامت {profile ? profile.name : ''}
          </h1>
          <p className="text-slate-400 text-sm font-bold mt-2">
            دفترچه تلفن و دایرکتوری درمانی دامپزشکان معتمد، اورژانس‌های ۲۴ ساعته و همکاران سلامت حیوان
          </p>
        </div>
        
        <Button 
          onClick={() => setShowAddModal(true)}
          variant="primary" 
          className="flex items-center gap-2 font-black text-sm shadow-md shadow-coral/10 py-3.5 px-6"
        >
          <Plus size={18} />
          افزودن همکار درمانی جدید
        </Button>
      </div>

      {/* Bento Stats Matrix */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Vets */}
        <Card className="bg-slate-50/50 border-slate-100 p-5 text-right flex flex-col justify-between h-28" hoverLift={false}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-bold">کل پزشکان ثبت شده</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
              <Layers size={14} />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-800">
            {toPersian(stats.total)} <span className="text-xs font-bold text-slate-400">مخاطب فعال</span>
          </span>
        </Card>

        {/* Stat 2: Pinned */}
        <Card className="bg-coral/5 border-coral-light/10 p-5 text-right flex flex-col justify-between h-28" hoverLift={false}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-black">سنجاق شده به بالای صفحه</span>
            <div className="w-8 h-8 rounded-xl bg-coral/10 text-coral flex items-center justify-center">
              <Star size={14} fill="currentColor" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-800">
            {toPersian(stats.pinned)} <span className="text-xs font-bold text-slate-400">مورد سنجاق شده</span>
          </span>
        </Card>

        {/* Stat 3: Emergency */}
        <Card className="bg-amber-500/[0.04] border-amber-200/50 p-5 text-right flex flex-col justify-between h-28" hoverLift={false}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-800 font-black">پشتیبانان اورژانسی ۲۴ ساعته</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <ShieldAlert size={14} />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-800">
            {toPersian(stats.emergency)} <span className="text-xs font-bold text-slate-400">پزشک آماده‌باش</span>
          </span>
        </Card>

        {/* Stat 4: Primary Family Vet */}
        <Card className="bg-indigo-50/50 border-indigo-100/50 p-5 text-right flex flex-col justify-between h-28" hoverLift={false}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-indigo-700 font-black">پزشک خانواده {profile ? profile.name : 'پت'}</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
              <Stethoscope size={14} />
            </div>
          </div>
          <span className="text-base font-black text-slate-800 truncate" title={stats.primaryName}>
            {stats.primaryName}
          </span>
        </Card>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Speed Dial & Health Guidelines (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Action Speed-Dial Panel */}
          <Card glow={speedDialContacts.length > 0} className="bg-gradient-to-br from-white to-amber-50/[0.02] border-amber-200/30 p-6 space-y-4">
            <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
              <PhoneCall className="text-amber-500 animate-bounce" size={18} />
              شماره‌گیر سریع اضطراری
            </h3>
            
            <p className="text-xs text-slate-500 leading-relaxed font-bold">
              در زمان‌های بحرانی فرصتی برای جستجوی شماره نیست. پزشکان و مراکزی که به عنوان پشتیبان اورژانسی تایید کرده‌اید، به این بخش متصل شده‌اند تا با یک کلیک تماس برقرار کنید.
            </p>

            {speedDialContacts.length === 0 ? (
              <div className="py-6 text-center border border-dashed border-slate-150 rounded-2xl bg-slate-50/30">
                <span className="text-[11px] text-slate-400 font-bold block">مخاطب اضطراری ستاره‌دار وجود ندارد</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {speedDialContacts.map(contact => {
                  const primaryPhone = contact.phones.find(p => p.isPrimary) || contact.phones[0];
                  return (
                    <div 
                      key={contact.id} 
                      className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-amber-200 shadow-sm transition-all"
                    >
                      <div className="text-right">
                        <span className="text-xs font-black text-slate-700 block">{contact.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          {contact.clinic || 'مطب شخصی'} • {primaryPhone ? primaryPhone.displayValue : ''}
                        </span>
                      </div>
                      
                      {primaryPhone && (
                        <a 
                          href={`tel:${primaryPhone.displayValue}`}
                          className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white font-black text-[10px] px-3 py-2 rounded-lg shadow-sm transition-all cursor-pointer"
                        >
                          <PhoneCall size={11} fill="currentColor" />
                          <span>تماس فوری</span>
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Genuine Clinical Support & Safety Guard */}
          <Card className="bg-slate-50/50 border-slate-200/60 p-6 space-y-4">
            <h3 className="font-black text-slate-800 text-sm flex items-center gap-2">
              <Info className="text-indigo-500" size={16} />
              امنیت اطلاعات و شفافیت درمانی
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-bold">
              ما متعهد به حفظ بالاترین سطح امنیت برای سلامت حیوان خانگی شما هستیم:
            </p>
            <ul className="space-y-2 text-[10px] text-slate-400 font-bold">
              <li className="flex items-start gap-1.5">
                <span className="text-coral mt-0.5">•</span>
                <span>پروتکل‌های تایید هویت دامپزشکان در این دایرکتوری کاملاً عاری از هوش یا رتبه‌بندی‌های کذب است.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-coral mt-0.5">•</span>
                <span>اطلاعات فاصله و نقشه صرفاً بر اساس موقعیت جغرافیایی واقعی و بدون هیچ دستکاری نمایش داده می‌شود.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-coral mt-0.5">•</span>
                <span>پرونده‌های سلامت بیمار ثبت شده در این سیستم به طور امن و رمزنگاری شده ذخیره شده‌اند.</span>
              </li>
            </ul>
          </Card>

        </div>

        {/* Right Column: Interactive Vets Contact List (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Controls Panel: Search and Role Filter */}
          <Card className="bg-white border-slate-100 p-5 space-y-4 shadow-sm">
            
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="جستجو در نام دامپزشک، تخصص، کلینیک، برچسب‌ها..."
                  className="w-full bg-slate-50 border border-slate-200/60 rounded-xl pl-4 pr-10 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-coral/45 transition-all text-slate-700 font-bold"
                />
                <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Reset trigger helper */}
              {(searchTerm || activeRoleFilter !== 'all') && (
                <Button
                  onClick={handleResetFilters}
                  variant="outline"
                  className="py-3 px-4 text-xs font-black shrink-0"
                >
                  حذف فیلترها
                </Button>
              )}
            </div>

            {/* Quick role-filter tab bar */}
            <div className="flex items-center justify-between border-t border-slate-50 pt-3.5 gap-4 overflow-x-auto flex-wrap">
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                {/* All tab */}
                <button
                  onClick={() => setActiveRoleFilter('all')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap",
                    activeRoleFilter === 'all'
                      ? "bg-coral-deep text-white shadow-md shadow-coral/30"
                      : "bg-peach/60 text-coral border border-coral-light/40 hover:bg-peach hover:text-coral-deep"
                  )}
                >
                  همه همکاران درمانی ({toPersian(vets.length)})
                </button>

                {/* Primary Vets tab */}
                <button
                  onClick={() => setActiveRoleFilter('primary')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap",
                    activeRoleFilter === 'primary'
                      ? "bg-coral text-white shadow-md shadow-coral/30"
                      : "bg-peach/60 text-coral border border-coral-light/40 hover:bg-peach hover:text-coral-deep"
                  )}
                >
                  پزشکان خانواده
                </button>

                {/* Specialist tab */}
                <button
                  onClick={() => setActiveRoleFilter('specialist')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap",
                    activeRoleFilter === 'specialist'
                      ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
                      : "bg-peach/60 text-coral border border-coral-light/40 hover:bg-peach hover:text-coral-deep"
                  )}
                >
                  متخصصین درمانی
                </button>

                {/* Emergency Backups tab */}
                <button
                  onClick={() => setActiveRoleFilter('emergency_backup')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap",
                    activeRoleFilter === 'emergency_backup'
                      ? "bg-sunny text-white shadow-md shadow-sunny/30"
                      : "bg-peach/60 text-coral border border-coral-light/40 hover:bg-peach hover:text-coral-deep"
                  )}
                >
                  سوپاپ‌های اورژانس
                </button>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold shrink-0">
                <SlidersHorizontal size={12} />
                <span>فیلترسازی سریع بر اساس نوع پشتیبان سلامت</span>
              </div>
            </div>

          </Card>

          {/* Veterinarians Contacts Grid Section */}
          <div className="space-y-4">
            {filteredVets.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-slate-200 p-8">
                <div className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Stethoscope size={28} />
                </div>
                <h3 className="font-black text-slate-700 text-base">دامپزشکی با فیلتر کنونی یافت نشد</h3>
                <p className="text-slate-400 text-xs font-bold mt-2 max-w-sm mx-auto leading-relaxed">
                  {searchTerm 
                    ? 'هیچ مخاطبی با مشخصات جستجو شده یافت نشد. لطفاً از املای درست کلمات اطمینان حاصل کرده یا فیلتر را پاک کنید.'
                    : 'در این دسته‌بندی هنوز پزشکی ذخیره نکرده‌اید. همین حالا می‌توانید اولین پزشک را اضافه کنید.'
                  }
                </p>
                <div className="flex justify-center gap-3 pt-6">
                  {searchTerm && (
                    <Button variant="outline" size="sm" onClick={handleResetFilters}>
                      پاک کردن جستجو
                    </Button>
                  )}
                  <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
                    افزودن پزشک جدید
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredVets.map(vet => (
                    <motion.div
                      key={vet.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <VetCard 
                        vet={vet}
                        onEdit={() => handleEditClick(vet)}
                        onDelete={() => handleDeleteClick(vet.id, vet.name)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Creation / Editing Form Modal wrapper */}
      <VetFormModal 
        isOpen={showAddModal} 
        onClose={handleCloseModal}
        vetToEdit={vetToEdit}
      />

    </div>
  );
}
