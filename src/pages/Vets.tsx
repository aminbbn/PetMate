import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Phone, User, Plus, Trash2, Heart, Shield, Star, ShieldAlert, Sparkles, MessageSquare, Clipboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPersian } from '../lib/persian';
import { cn } from '../lib/utils';

interface Vet {
  id: string;
  name: string;
  clinic: string;
  phone: string;
  specialty: string;
  isEmergency: boolean;
  notes: string;
}

export default function Vets() {
  const profile = useAppStore(state => state.profile);
  const [vets, setVets] = useState<Vet[]>([
    {
      id: 'vet-1',
      name: 'دکتر علیرضا مرادی',
      clinic: 'کلینیک تخصصی آریا',
      phone: '۰۲۱-۲۲۰۰۳۳۴۴',
      specialty: 'متخصص داخلی و غدد حیوانات کوچک',
      isEmergency: true,
      notes: 'پزشک اصلی همیشگی، واکسیناسیون‌های سالانه و آزمایش خون دوره‌ای در این مرکز انجام می‌شود.'
    },
    {
      id: 'vet-2',
      name: 'دکتر مریم سعادت',
      clinic: 'بیمارستان دامپزشکی مهرگان',
      phone: '۰۲۱-۸۸۳۳۹۹۰۰',
      specialty: 'جراح عمومی و دندانپزشک اختصاصی پت',
      isEmergency: false,
      notes: 'عملیات جرم‌گیری دندان و جراحی‌های سرپایی را با نظارت مستقیم ایشان انجام می‌دهیم.'
    }
  ]);

  const [name, setName] = useState('');
  const [clinic, setClinic] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [notes, setNotes] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  if (!profile) return null;

  const handleAddVet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    
    const newVet: Vet = {
      id: `vet-${Date.now()}`,
      name: name.trim(),
      clinic: clinic.trim() || 'کلینیک خصوصی',
      phone: phone.trim(),
      specialty: specialty.trim() || 'دامپزشک عمومی',
      isEmergency,
      notes: notes.trim()
    };

    setVets([newVet, ...vets]);
    setName('');
    setClinic('');
    setPhone('');
    setSpecialty('');
    setIsEmergency(false);
    setNotes('');
    setShowAddForm(false);
  };

  const handleDeleteVet = (id: string) => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید این مخاطب دامپزشک را حذف کنید؟')) {
      setVets(vets.filter(v => v.id !== id));
    }
  };

  const toggleEmergency = (id: string) => {
    setVets(vets.map(v => v.id === id ? { ...v, isEmergency: !v.isEmergency } : v));
  };

  return (
    <div className="p-8 lg:p-10 space-y-8 max-w-7xl mx-auto w-full text-right" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <Heart className="text-coral animate-pulse" size={32} />
            دامپزشکان اختصاصی {profile.name}
          </h1>
          <p className="text-gray-400 text-sm font-bold mt-2">
            دفترچه تلفن و دایرکتوری پزشکان مجرب جهت مشاوره، ویزیت‌های دوره‌ای و تماس‌های اضطراری
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          variant="primary" 
          className="flex items-center gap-2 font-black text-sm shadow-md shadow-coral/10 py-3"
        >
          <Plus size={18} />
          افزودن دامپزشک جدید
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Add Vet form or medical support notes (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="bg-white border-coral-light/25 p-6 space-y-4 shadow-xl">
                  <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
                    <User size={18} className="text-coral" />
                    مشخصات دامپزشک جدید
                  </h3>
                  <form onSubmit={handleAddVet} className="space-y-3.5">
                    
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold block">نام دامپزشک *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="مثال: دکتر نیما صادقی..."
                        className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-coral/50"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold block">تخصص یا تخصص اصلی</label>
                      <input
                        type="text"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        placeholder="مثال: متخصص رادیولوژی، تغذیه یا جراحی..."
                        className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-coral/50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold block">کلینیک / بیمارستان</label>
                      <input
                        type="text"
                        value={clinic}
                        onChange={(e) => setClinic(e.target.value)}
                        placeholder="مثال: بیمارستان شبانه‌روزی آفتاب..."
                        className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-coral/50"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold block">تلفن تماس *</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="مثال: ۰۲۱-۸۸۰۰۹۹۰۰..."
                        className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-coral/50 text-left"
                        dir="ltr"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-bold block">یادداشت‌های مراقبتی یا درمانی</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="آلرژی‌ها، واکسن‌های تجویز شده یا توصیه‌های پزشک..."
                        className="w-full bg-peach/10 border border-coral-light/10 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-coral/50 h-20 resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 py-1">
                      <input
                        type="checkbox"
                        id="emergency-chk"
                        checked={isEmergency}
                        onChange={(e) => setIsEmergency(e.target.checked)}
                        className="w-4 h-4 text-coral border-gray-300 rounded focus:ring-coral"
                      />
                      <label htmlFor="emergency-chk" className="text-xs text-gray-500 font-black cursor-pointer">
                        تنظیم به عنوان تماس اضطراری ۲۴ ساعته
                      </label>
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                      <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                        انصراف
                      </Button>
                      <Button type="submit" variant="primary" size="sm">
                        ذبت مشخصات
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Emergency Alert Guidance */}
          <Card glow glowColor="coral" className="bg-gradient-to-br from-white to-red-50/5 border-coral/10 p-6 space-y-4 text-right">
            <h3 className="font-black text-gray-800 text-base flex items-center gap-2">
              <ShieldAlert className="text-coral animate-pulse" size={20} />
              آمادگی اورژانسی برای {profile.name}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed font-bold">
              در مواقع اورژانس (مانند بلعیدن شیء خارجی، تنگی نفس یا بی‌حالی شدید)، همواره مخاطبین ستاره‌دار و بیمارستان‌های شبانه‌روزی را در بالای لیست نگه دارید تا در کوتاه‌ترین زمان دسترسی داشته باشید.
            </p>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-coral-deep font-black">
              <span>سامانه تری‌آژ هوش مصنوعی فعال است</span>
              <span>امکان دسترسی سریع</span>
            </div>
          </Card>

        </div>

        {/* Right column: Interactive Vets Contact Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {vets.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-coral-light/20">
              <Heart className="mx-auto text-coral-light/40 mb-3 animate-pulse" size={36} />
              <p className="text-gray-500 font-black text-sm">هیچ دامپزشکی در لیست ثبت نشده است.</p>
              <Button variant="outline" size="sm" className="mt-3.5" onClick={() => setShowAddForm(true)}>
                ثبت اولین دامپزشک
              </Button>
            </div>
          ) : (
            vets.map(vet => (
              <Card 
                key={vet.id} 
                className={cn(
                  "bg-white border p-6 transition-all duration-300 relative overflow-hidden",
                  vet.isEmergency 
                    ? "border-red-200/50 shadow-[0_12px_36px_rgba(239,68,68,0.04)]" 
                    : "border-coral-light/10 shadow-sm hover:border-coral-light/20"
                )}
              >
                {/* Visual Accent for Emergency */}
                {vet.isEmergency && (
                  <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-red-400" />
                )}

                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                      vet.isEmergency ? "bg-red-50 text-red-500" : "bg-coral/5 text-coral"
                    )}>
                      <User size={22} />
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-gray-800 text-base">{vet.name}</h3>
                        {vet.isEmergency && (
                          <span className="bg-red-50 text-red-500 text-[9px] font-black px-2.5 py-0.5 rounded-full border border-red-100 flex items-center gap-1">
                            <Star size={10} fill="currentColor" />
                            اورژانس ۲۴ ساعته
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 font-bold">{vet.specialty}</p>
                      <p className="text-xs text-gray-400 font-bold">{vet.clinic}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => toggleEmergency(vet.id)}
                      className={cn(
                        "p-2 rounded-xl border transition-all cursor-pointer",
                        vet.isEmergency 
                          ? "bg-red-50 text-red-500 border-red-100" 
                          : "bg-white border-gray-100 text-gray-300 hover:text-red-500 hover:border-red-100"
                      )}
                      title="تنظیم اضطراری"
                    >
                      <Star size={16} fill={vet.isEmergency ? "currentColor" : "none"} />
                    </button>
                    <button 
                      onClick={() => handleDeleteVet(vet.id)}
                      className="p-2 rounded-xl border border-gray-100 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                      title="حذف دامپزشک"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {vet.notes && (
                  <div className="mt-4 p-3 bg-peach/10 rounded-xl border border-coral-light/5 text-xs text-gray-500 leading-relaxed font-bold flex gap-2">
                    <Clipboard size={14} className="text-coral shrink-0 mt-0.5" />
                    <span>{vet.notes}</span>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-gray-100/60 flex items-center justify-between text-xs font-bold text-gray-400">
                  <span>تلفن مطب/کلینیک</span>
                  <a href={`tel:${vet.phone}`} className="text-coral hover:underline font-black text-sm">
                    {toPersian(vet.phone)}
                  </a>
                </div>

              </Card>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
