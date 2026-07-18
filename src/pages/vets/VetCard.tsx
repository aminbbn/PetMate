import React, { useState } from 'react';
import { VetContact, VetPhone } from './vetsTypes';
import { useAppStore } from '../../store';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { AnimatedCardIcon } from '../../components/AnimatedCardIcon';
import { 
  Phone, 
  MapPin, 
  Globe, 
  Trash2, 
  Edit3, 
  Star, 
  ShieldAlert, 
  Clipboard, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  Activity,
  Heart,
  ExternalLink,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPersian } from '../../lib/persian';
import { cn } from '../../lib/utils';

interface VetCardProps {
  vet: VetContact;
  onEdit: () => void;
  onDelete: () => void;
}

const ROLE_METADATA = {
  primary: {
    title: 'پزشک اصلی و خانواده',
    tone: 'coral' as const,
    iconVariant: 'stethoscope' as const,
    badgeBg: 'bg-coral/10 text-coral border-coral/10',
  },
  specialist: {
    title: 'پزشک متخصص',
    tone: 'blue' as const,
    iconVariant: 'training' as const,
    badgeBg: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  emergency_backup: {
    title: 'پشتیبان اورژانس',
    tone: 'sunny' as const,
    iconVariant: 'alert' as const,
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-100',
  },
  general: {
    title: 'دامپزشک عمومی',
    tone: 'neutral' as const,
    iconVariant: 'behavior' as const,
    badgeBg: 'bg-slate-50 text-slate-500 border-slate-150',
  },
  other: {
    title: 'سایر نقش‌ها',
    tone: 'neutral' as const,
    iconVariant: 'document' as const,
    badgeBg: 'bg-slate-50 text-slate-400 border-slate-100',
  },
};

const PHONE_LABEL_MAP = {
  clinic: 'مطب',
  mobile: 'همراه',
  emergency: 'اورژانسی',
  other: 'سایر'
};

export const VetCard: React.FC<VetCardProps> = ({ vet, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);

  const toggleVetPinned = useAppStore(state => state.toggleVetPinned);
  const toggleVetEmergencyUse = useAppStore(state => state.toggleVetEmergencyUse);
  const pets = useAppStore(state => state.pets || []);

  const meta = ROLE_METADATA[vet.role] || ROLE_METADATA.general;

  // Filter linked pets
  const linkedPets = pets.filter(p => vet.petIds.includes(p.id));

  const handleCopyPhone = (phone: VetPhone, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(phone.displayValue);
    setCopiedPhoneId(phone.id);
    setTimeout(() => setCopiedPhoneId(null), 2000);
  };

  const handleTogglePinned = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleVetPinned(vet.id);
  };

  const handleToggleEmergency = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleVetEmergencyUse(vet.id);
  };

  return (
    <Card 
      glow={vet.isPinned || vet.useForEmergency}
      className={cn(
        "bg-white border relative overflow-hidden transition-all duration-300 select-none",
        vet.useForEmergency 
          ? "border-amber-200/55 shadow-[0_12px_36px_rgba(245,158,11,0.03)]" 
          : "border-slate-100 shadow-sm hover:border-coral-light/25 hover:shadow-[0_16px_40px_rgba(239,68,68,0.02)]"
      )}
    >
      {/* Visual Accent Bar */}
      {vet.useForEmergency && (
        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 to-amber-500" />
      )}
      {!vet.useForEmergency && vet.isPinned && (
        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-coral to-coral-deep" />
      )}

      {/* Main Container */}
      <div className="flex flex-col h-full justify-between gap-5 text-right" dir="rtl">
        
        {/* Header Block: Avatar, Name, Speciality, Actions */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-start gap-3.5">
            {/* Elegant Micro-interactive Animated Icon */}
            <div className="shrink-0">
              <AnimatedCardIcon 
                variant={meta.iconVariant} 
                tone={meta.tone} 
                size="md" 
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-slate-800 text-base leading-tight">
                  {vet.name}
                </h3>
                
                {/* Role Badge */}
                <span className={cn(
                  "text-[9px] font-black px-2 py-0.5 rounded-full border shrink-0",
                  meta.badgeBg
                )}>
                  {meta.title}
                </span>

                {/* Emergency Availability Badge */}
                {vet.useForEmergency && vet.emergencyAvailability === 'verified_24h' && (
                  <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck size={10} />
                    شبانه‌روزی معتبر
                  </span>
                )}
              </div>
              
              <p className="text-xs text-slate-500 font-bold">
                {vet.specialty || 'عمومی و چکاپ بالینی'}
              </p>
              
              {vet.clinic && (
                <p className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                  <span>در</span>
                  <span className="text-slate-500 font-black">{vet.clinic}</span>
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions (Pin, Edit, Delete) */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Toggle Emergency Backup */}
            <button 
              onClick={handleToggleEmergency}
              className={cn(
                "p-2 rounded-xl border transition-all cursor-pointer",
                vet.useForEmergency 
                  ? "bg-amber-50 text-amber-500 border-amber-100 shadow-sm" 
                  : "bg-white border-slate-100 text-slate-300 hover:text-amber-500 hover:border-amber-100"
              )}
              title={vet.useForEmergency ? "غیرفعال کردن اورژانس" : "ثبت به عنوان سوپاپ اورژانس"}
            >
              <ShieldAlert size={15} />
            </button>

            {/* Pin Star button */}
            <button 
              onClick={handleTogglePinned}
              className={cn(
                "p-2 rounded-xl border transition-all cursor-pointer",
                vet.isPinned 
                  ? "bg-coral/5 text-coral border-coral-light/20 shadow-sm" 
                  : "bg-white border-slate-100 text-slate-300 hover:text-coral hover:border-coral-light/20"
              )}
              title="سنجاق کردن پزشک"
            >
              <Star size={15} fill={vet.isPinned ? "currentColor" : "none"} />
            </button>

            {/* Edit button */}
            <button 
              onClick={onEdit}
              className="p-2 rounded-xl border border-slate-100 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 hover:border-indigo-100 transition-all cursor-pointer"
              title="ویرایش مخاطب"
            >
              <Edit3 size={15} />
            </button>

            {/* Delete button */}
            <button 
              onClick={onDelete}
              className="p-2 rounded-xl border border-slate-100 text-slate-300 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all cursor-pointer"
              title="حذف مخاطب"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Tags Block (Subspecialty or user notes) */}
        {vet.tags && vet.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {vet.tags.map(tag => (
              <span key={tag} className="bg-slate-50 text-slate-500 border border-slate-100 rounded-lg px-2 py-0.5 text-[9px] font-black">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Clinical Notes snippet */}
        {vet.notes && (
          <div className="p-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 leading-relaxed font-bold flex gap-2 transition-colors">
            <Clipboard size={14} className="text-slate-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{vet.notes}</span>
          </div>
        )}

        {/* Primary Contact Action Block - Lists all Phones */}
        <div className="border-t border-slate-100/60 pt-3.5 space-y-2">
          <p className="text-[10px] text-slate-400 font-bold block mb-1">تلفن‌های در دسترس در پرونده:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {vet.phones.map(phone => (
              <div 
                key={phone.id}
                className={cn(
                  "flex items-center justify-between p-2 rounded-xl border transition-all text-xs font-bold",
                  phone.isPrimary 
                    ? "bg-coral/5 border-coral-light/20 text-coral-deep" 
                    : "bg-slate-50 border-slate-100 text-slate-500"
                )}
              >
                <div className="flex items-center gap-1.5 pl-2">
                  <span className="text-[10px] bg-slate-100 rounded-lg px-1.5 py-0.5 font-black text-slate-600 scale-90">
                    {PHONE_LABEL_MAP[phone.label]}
                  </span>
                  <a 
                    href={`tel:${phone.displayValue}`} 
                    className="font-mono text-[11px] font-black hover:underline tracking-wide"
                    dir="ltr"
                  >
                    {toPersian(phone.displayValue)}
                  </a>
                </div>

                <div className="flex items-center gap-1">
                  {/* Call icon button */}
                  <a
                    href={`tel:${phone.displayValue}`}
                    className="p-1 rounded-lg bg-white shadow-sm border border-slate-150 hover:border-coral/40 text-coral transition-colors"
                  >
                    <Phone size={12} fill="currentColor" />
                  </a>

                  {/* Copy button */}
                  <button
                    onClick={(e) => handleCopyPhone(phone, e)}
                    className="p-1 rounded-lg bg-white shadow-sm border border-slate-150 hover:border-slate-300 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {copiedPhoneId === phone.id ? (
                      <Check size={12} className="text-emerald-500" />
                    ) : (
                      <Clipboard size={12} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Expansion Handler */}
        <div className="border-t border-slate-50/50 pt-2 flex flex-col items-stretch">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-1 py-1 text-[10px] text-slate-400 hover:text-slate-600 font-black transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'مشاهده جزئیات کمتر' : 'مشاهده پرونده کامل، نشانی و بیمار تحت نظر'}</span>
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mt-3 space-y-3.5"
              >
                {/* Website URL */}
                {vet.website && (
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-50 pb-2">
                    <span className="text-slate-400">وب‌سایت / شبکه مجازی:</span>
                    <a 
                      href={vet.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-indigo-500 hover:underline flex items-center gap-1 font-mono text-[11px]"
                      dir="ltr"
                    >
                      <span>{vet.website.replace('https://', '').replace('http://', '')}</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}

                {/* Address Map directions */}
                {vet.address && (
                  <div className="space-y-1 text-right border-b border-slate-50 pb-2">
                    <span className="text-[10px] text-slate-400 font-bold block">نشانی دقیق:</span>
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-xs text-slate-600 leading-relaxed font-bold">
                        {vet.address}
                      </p>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(vet.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-[10px] rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <MapPin size={11} />
                        مسیریابی
                      </a>
                    </div>
                  </div>
                )}

                {/* Associated Pets */}
                {linkedPets.length > 0 && (
                  <div className="space-y-1 text-right border-b border-slate-50 pb-2">
                    <span className="text-[10px] text-slate-400 font-bold block">دامپزشک مخصوص پت‌های زیر:</span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {linkedPets.map(pet => (
                        <div key={pet.id} className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl text-[10px] text-slate-600 font-black">
                          {pet.photoUrl ? (
                            <img src={pet.photoUrl} alt={pet.name} className="w-4.5 h-4.5 rounded-full object-cover border border-white" referrerPolicy="no-referrer" />
                          ) : (
                            <span className="scale-75">🐾</span>
                          )}
                          <span>{pet.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verification Source stamping */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold pt-1">
                  <span>منبع ثبت پرونده:</span>
                  <span className="flex items-center gap-1">
                    {vet.source === 'verified_service' && (
                      <span className="text-emerald-500 font-black flex items-center gap-1">
                        <ShieldCheck size={13} fill="none" />
                        مرکز معتمد تأییدشده پت میت
                      </span>
                    )}
                    {vet.source === 'service_directory' && (
                      <span className="text-indigo-500 font-black flex items-center gap-1">
                        <UserCheck size={13} fill="none" />
                        دایرکتوری عمومی همکاران
                      </span>
                    )}
                    {vet.source === 'user_entered' && (
                      <span className="text-slate-400 font-black flex items-center gap-1">
                        🔒 ثبت شخصی توسط کاربر
                      </span>
                    )}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </Card>
  );
};
