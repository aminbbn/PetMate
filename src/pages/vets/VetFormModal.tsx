import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { VetContact, VetPhone, VetContactRole, EmergencyAvailability } from './vetsTypes';
import { X, Plus, Trash2, Phone, Tag, Shield, Star, Stethoscope, Briefcase, Globe, MapPin, Clipboard, Check, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MotionDialog } from '../../motion/MotionDialog';
import { Button } from '../../components/Button';
import { toPersian } from '../../lib/persian';

interface VetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  vetToEdit?: VetContact;
}

const QUICK_TAG_OPTIONS = [
  'داخلی',
  'جراحی',
  'واکسیناسیون',
  'دندانپزشکی',
  'رادیولوژی',
  'تغذیه',
  'پرندگان',
  'شناسنامه',
  'آزمایشگاه'
];

export const VetFormModal: React.FC<VetFormModalProps> = ({ isOpen, onClose, vetToEdit }) => {
  const pets = useAppStore(state => state.pets || []);
  const selectedPetId = useAppStore(state => state.selectedPetId);
  const addVetContact = useAppStore(state => state.addVetContact);
  const updateVetContact = useAppStore(state => state.updateVetContact);

  // Form states
  const [name, setName] = useState('');
  const [clinic, setClinic] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [notes, setNotes] = useState('');
  const [role, setRole] = useState<VetContactRole>('general');
  const [useForEmergency, setUseForEmergency] = useState(false);
  const [emergencyAvailability, setEmergencyAvailability] = useState<EmergencyAvailability>('unknown');
  const [selectedPetIds, setSelectedPetIds] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  // Multiple phones state
  const [phones, setPhones] = useState<Array<{
    label: 'clinic' | 'mobile' | 'emergency' | 'other';
    displayValue: string;
    normalizedValue: string;
    isPrimary: boolean;
  }>>([{ label: 'clinic', displayValue: '', normalizedValue: '', isPrimary: true }]);

  // Load vet to edit if provided
  useEffect(() => {
    if (vetToEdit) {
      setName(vetToEdit.name || '');
      setClinic(vetToEdit.clinic || '');
      setSpecialty(vetToEdit.specialty || '');
      setAddress(vetToEdit.address || '');
      setWebsite(vetToEdit.website || '');
      setNotes(vetToEdit.notes || '');
      setRole(vetToEdit.role || 'general');
      setUseForEmergency(vetToEdit.useForEmergency || false);
      setEmergencyAvailability(vetToEdit.emergencyAvailability || 'unknown');
      setSelectedPetIds(vetToEdit.petIds || []);
      setTags(vetToEdit.tags || []);
      setPhones(
        vetToEdit.phones && vetToEdit.phones.length > 0
          ? vetToEdit.phones.map(p => ({
              label: p.label,
              displayValue: p.displayValue,
              normalizedValue: p.normalizedValue,
              isPrimary: p.isPrimary
            }))
          : [{ label: 'clinic', displayValue: '', normalizedValue: '', isPrimary: true }]
      );
    } else {
      // Reset form
      setName('');
      setClinic('');
      setSpecialty('');
      setAddress('');
      setWebsite('');
      setNotes('');
      setRole('general');
      setUseForEmergency(false);
      setEmergencyAvailability('unknown');
      setSelectedPetIds(selectedPetId ? [selectedPetId] : []);
      setTags([]);
      setPhones([{ label: 'clinic', displayValue: '', normalizedValue: '', isPrimary: true }]);
    }
  }, [vetToEdit, isOpen, selectedPetId]);

  const handleAddPhone = () => {
    setPhones([
      ...phones,
      { label: 'clinic', displayValue: '', normalizedValue: '', isPrimary: false }
    ]);
  };

  const handleRemovePhone = (index: number) => {
    if (phones.length <= 1) return;
    const itemToRemove = phones[index];
    const newPhones = phones.filter((_, i) => i !== index);
    
    // If we removed the primary, assign primary to first index
    if (itemToRemove.isPrimary) {
      newPhones[0].isPrimary = true;
    }
    setPhones(newPhones);
  };

  const handlePhoneChange = (index: number, field: string, value: any) => {
    const updated = phones.map((p, i) => {
      if (i !== index) {
        if (field === 'isPrimary' && value === true) {
          return { ...p, isPrimary: false }; // clear others if setting primary
        }
        return p;
      }
      return { ...p, [field]: value };
    });
    setPhones(updated);
  };

  const handleToggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTag = newTagInput.trim();
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
      setNewTagInput('');
    }
  };

  const handleTogglePet = (petId: string) => {
    if (selectedPetIds.includes(petId)) {
      setSelectedPetIds(selectedPetIds.filter(id => id !== petId));
    } else {
      setSelectedPetIds([...selectedPetIds, petId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Filter out empty phones
    const validPhones = phones
      .filter(p => p.displayValue.trim() !== '')
      .map(p => ({
        label: p.label,
        displayValue: p.displayValue.trim(),
        normalizedValue: p.displayValue.trim(),
        isPrimary: p.isPrimary
      }));

    if (validPhones.length === 0) {
      alert('لطفاً حداقل یک شماره تماس معتبر وارد کنید.');
      return;
    }

    const payload = {
      name: name.trim(),
      clinic: clinic.trim() || undefined,
      specialty: specialty.trim() || undefined,
      phones: validPhones,
      address: address.trim() || undefined,
      website: website.trim() || undefined,
      notes: notes.trim() || undefined,
      role,
      useForEmergency,
      emergencyAvailability,
      petIds: selectedPetIds,
      tags
    };

    if (vetToEdit) {
      // Edit mode
      updateVetContact(vetToEdit.id, payload);
    } else {
      // Create mode
      addVetContact(payload);
    }

    onClose();
  };

  return (
    <MotionDialog
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      className="max-h-[90vh] flex flex-col"
    >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-coral/10 text-coral flex items-center justify-center">
                <Stethoscope size={20} />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-lg">
                  {vetToEdit ? 'ویرایش اطلاعات دامپزشک' : 'ثبت دامپزشک اختصاصی جدید'}
                </h3>
                <p className="text-slate-400 text-xs font-bold mt-1">
                  {vetToEdit ? 'اطلاعات پرونده و تماس را ویرایش کنید' : 'یک همکار درمانی مطمئن برای حیوان خانگی خود ثبت کنید'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Scroll Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Section 1: Basic Information */}
              <div className="space-y-4">
                <h4 className="font-black text-slate-700 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Briefcase size={16} className="text-coral" />
                  اطلاعات هویتی و تخصصی
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 font-bold block">نام دامپزشک *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مانند: دکتر مریم رضایی"
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-coral/45 transition-all text-slate-700 font-bold"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 font-bold block">تخصص اصلی</label>
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="مانند: جراح حیوانات کوچک، دندانپزشک پت"
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-coral/45 transition-all text-slate-700 font-bold"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] text-slate-500 font-bold block">کلینیک یا بیمارستان محل فعالیت</label>
                    <input
                      type="text"
                      value={clinic}
                      onChange={(e) => setClinic(e.target.value)}
                      placeholder="مانند: بیمارستان دامپزشکی مهر یا مطب خصوصی"
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-coral/45 transition-all text-slate-700 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Contact Numbers (Dynamic Multi-Entry) */}
              <div className="space-y-4">
                <h4 className="font-black text-slate-700 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Phone size={16} className="text-coral" />
                  شماره‌های تماس (حداقل یک شماره)
                </h4>

                <div className="space-y-3">
                  {phones.map((phone, index) => (
                    <div 
                      key={index} 
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100"
                    >
                      {/* Label selector */}
                      <div className="w-full sm:w-32 shrink-0">
                        <select
                          value={phone.label}
                          onChange={(e) => handlePhoneChange(index, 'label', e.target.value)}
                          className="w-full bg-white border border-slate-200/60 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-coral/45 font-bold text-slate-700 cursor-pointer"
                        >
                          <option value="clinic">تلفن مطب</option>
                          <option value="mobile">موبایل</option>
                          <option value="emergency">شماره اضطراری</option>
                          <option value="other">سایر شماره‌ها</option>
                        </select>
                      </div>

                      {/* Number Input */}
                      <div className="flex-1 relative">
                        <input
                          type="tel"
                          value={phone.displayValue}
                          onChange={(e) => handlePhoneChange(index, 'displayValue', e.target.value)}
                          placeholder="مانند: 02122884400"
                          dir="ltr"
                          className="w-full bg-white border border-slate-200/60 rounded-xl pl-4 pr-10 py-2.5 text-xs outline-none focus:ring-2 focus:ring-coral/45 font-mono text-left font-bold text-slate-700"
                        />
                        <Phone size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>

                      {/* Control buttons */}
                      <div className="flex items-center gap-2 justify-end">
                        {/* Primary switch */}
                        <button
                          type="button"
                          onClick={() => handlePhoneChange(index, 'isPrimary', !phone.isPrimary)}
                          className={`px-3 py-2 rounded-xl text-[10px] font-black border transition-all cursor-pointer flex items-center gap-1.5 ${
                            phone.isPrimary
                              ? 'bg-sunny/10 border-sunny text-amber-700 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          <Star size={11} fill={phone.isPrimary ? 'currentColor' : 'none'} />
                          {phone.isPrimary ? 'شماره اصلی' : 'تنظیم به عنوان اصلی'}
                        </button>

                        {/* Remove phone button */}
                        {phones.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePhone(index)}
                            className="p-2.5 rounded-xl border border-rose-100 text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddPhone}
                  className="w-full py-2.5 border border-dashed border-slate-200 hover:border-coral/50 hover:bg-coral/5 rounded-xl text-xs font-black text-slate-500 hover:text-coral transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus size={14} />
                  افزودن شماره تلفن جدید
                </button>
              </div>

              {/* Section 3: Roles and Emergency config */}
              <div className="space-y-4">
                <h4 className="font-black text-slate-700 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Shield size={16} className="text-coral" />
                  نقش و سطح دسترسی اضطراری
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/40 p-5 rounded-3xl border border-slate-100">
                  {/* Vet Role */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-500 font-bold block">نقش در زنجیره درمانی حیوان</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as VetContactRole)}
                      className="w-full bg-white border border-slate-200/60 rounded-xl px-3 py-3 text-xs outline-none focus:ring-2 focus:ring-coral/45 font-bold text-slate-700 cursor-pointer"
                    >
                      <option value="general">دامپزشک عمومی (پشتیبان سلامت)</option>
                      <option value="primary">دامپزشک خانواده / پزشک اصلی</option>
                      <option value="specialist">دامپزشک متخصص (جراح، قلب، رادیولوژی و...)</option>
                      <option value="emergency_backup">پشتیبان اختصاصی اورژانس</option>
                      <option value="other">سایر نقش‌ها</option>
                    </select>
                  </div>

                  {/* Emergency Availability (If useForEmergency is true) */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] text-slate-500 font-bold block">دسترسی اورژانس ۲۴ ساعته</label>
                    <select
                      value={emergencyAvailability}
                      onChange={(e) => setEmergencyAvailability(e.target.value as EmergencyAvailability)}
                      className="w-full bg-white border border-slate-200/60 rounded-xl px-3 py-3 text-xs outline-none focus:ring-2 focus:ring-coral/45 font-bold text-slate-700 cursor-pointer"
                    >
                      <option value="unknown">نامشخص / موقت</option>
                      <option value="user_reported">گزارش شما (فقط در ساعات توافقی پاسخگو هستند)</option>
                      <option value="verified_24h">تأییدشده ۲4 ساعته (بیمارستان یا مرکز شبانه‌روزی)</option>
                    </select>
                  </div>

                  {/* Toggle Emergency Switch */}
                  <div className="md:col-span-2 flex items-center justify-between py-3 px-4 bg-white border border-slate-150 rounded-2xl">
                    <div className="space-y-0.5 text-right pl-4">
                      <span className="text-xs font-black text-slate-700 block">پشتیبان در مواقع اضطراری و اورژانسی</span>
                      <span className="text-[10px] text-slate-400 font-bold">این دامپزشک در سرعت‌گیر اورژانس صفحه نخست نمایش داده شود</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={useForEmergency}
                        onChange={(e) => {
                          setUseForEmergency(e.target.checked);
                          if (e.target.checked && emergencyAvailability === 'unknown') {
                            setEmergencyAvailability('user_reported');
                          }
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:right-[auto] peer-checked:after:left-[auto] peer-checked:after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coral"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 4: Pets selection */}
              {pets.length > 1 && (
                <div className="space-y-4">
                  <h4 className="font-black text-slate-700 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Heart size={16} className="text-coral" />
                    تحت نظر گرفتن برای پت‌ها
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {pets.map(pet => {
                      const isSelected = selectedPetIds.includes(pet.id);
                      return (
                        <button
                          key={pet.id}
                          type="button"
                          onClick={() => handleTogglePet(pet.id)}
                          className={`px-4 py-2.5 rounded-2xl text-xs font-black border transition-all flex items-center gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-coral/10 border-coral text-coral-deep shadow-sm shadow-coral/5'
                              : 'bg-white border-slate-150 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          {pet.photoUrl ? (
                            <img src={pet.photoUrl} alt={pet.name} className="w-5 h-5 rounded-full object-cover border border-white" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">🐾</div>
                          )}
                          <span>دامپزشک مخصوص {pet.name}</span>
                          {isSelected && <Check size={12} className="text-coral" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section 5: Web & Address details */}
              <div className="space-y-4">
                <h4 className="font-black text-slate-700 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                  <MapPin size={16} className="text-coral" />
                  اطلاعات موقعیت و وب‌سایت
                </h4>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 font-bold block">آدرس وب‌سایت یا لینک شبکه اجتماعی</label>
                    <div className="relative">
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="مانند: https://arya-clinic.com"
                        dir="ltr"
                        className="w-full bg-slate-50 border border-slate-200/60 rounded-xl pl-4 pr-10 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-coral/45 transition-all font-mono text-left text-slate-700"
                      />
                      <Globe size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-500 font-bold block">نشانی دقیق مطب یا کلینیک</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="مانند: تهران، بزرگراه شریعتی، بالاتر از ظفر، کوچه بهار، پلاک ۴"
                        className="w-full bg-slate-50 border border-slate-200/60 rounded-xl pl-4 pr-10 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-coral/45 transition-all text-slate-700 font-bold"
                      />
                      <MapPin size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 6: Tags and Notes */}
              <div className="space-y-4">
                <h4 className="font-black text-slate-700 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Tag size={16} className="text-coral" />
                  برچسب‌های تخصص فرعی و یادداشت
                </h4>

                {/* Quick Tags Toggle */}
                <div className="space-y-2">
                  <label className="text-[11px] text-slate-500 font-bold block">برچسب‌های کلیدی (برای جستجو و دسته‌بندی سریع)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_TAG_OPTIONS.map(tag => {
                      const isSelected = tags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleTag(tag)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-coral border-coral text-white shadow-md shadow-coral/30 scale-102'
                              : 'bg-peach/60 border-coral-light/40 text-coral hover:bg-[#FFD4BA] hover:text-coral-deep hover:border-coral-light'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom tags input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    placeholder="برچسب دلخواه جدید بنویسید..."
                    className="flex-1 bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-coral/45 transition-all text-slate-700 font-bold"
                  />
                  <Button
                    type="button"
                    onClick={(e) => handleAddCustomTag(e)}
                    variant="outline"
                    className="py-2.5 text-xs"
                  >
                    اضافه کردن
                  </Button>
                </div>

                {/* Notes block */}
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-500 font-bold block">توضیحات و توصیه‌های مراقبتی پزشک</label>
                  <div className="relative">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="برنامه واکسیناسیون، آلرژی‌ها، داروهای دوره‌ای تجویز شده، یا روزهایی که در کلینیک حضور دارند..."
                      className="w-full bg-slate-50 border border-slate-200/60 rounded-xl pl-4 pr-10 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-coral/45 transition-all h-24 resize-none text-slate-700 font-bold leading-relaxed"
                    />
                    <Clipboard size={14} className="absolute right-3.5 top-3 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="px-6 py-3 font-bold"
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="px-8 py-3 text-sm font-black shadow-lg shadow-coral/15"
                >
                  {vetToEdit ? 'بروزرسانی مشخصات' : 'ذخیره در دفترچه مخاطبین'}
                </Button>
              </div>

            </form>
          </div>
    </MotionDialog>
  );
};
