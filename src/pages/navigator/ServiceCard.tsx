import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { AnimatedCardIcon } from '../../components/AnimatedCardIcon';
import { useAppStore, Vet } from '../../store';
import { PetService, ServiceCoordinates } from './navigatorTypes';
import { isCurrentlyOpen, getDirectionsUrl, getCategoryIconAndTone } from './navigatorUtils';
import { toPersian } from '../../lib/persian';
import { 
  Phone, 
  MapPin, 
  Navigation, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  Clock,
  Compass
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface ServiceCardProps {
  service: PetService;
  userCoordinates: ServiceCoordinates | null;
  distanceKm: number | null;
  onSelect: (service: PetService) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  userCoordinates,
  distanceKm,
  onSelect,
}) => {
  const addVet = useAppStore((state) => state.addVet);
  const savedVets = useAppStore((state) => state.vets || []);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isSaved = savedVets.some(
    (v) => v.sourceServiceId === service.id || v.id === service.id
  );

  const primaryCategory = service.categories[0] || 'other';

  const handleSaveToMyVets = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card selection trigger
    if (isSaved || saveSuccess) return;

    const cleanPhone = service.phone || '021';

    const newVet: Vet = {
      id: service.id,
      name: service.name,
      clinic: service.name,
      phone: cleanPhone,
      specialty: service.specialties?.[0] || getCategoryIconAndTone(primaryCategory).label,
      isEmergency: !!service.emergencyCapability,
      notes: service.description || `آدرس: ${service.address}`,
      sourceServiceId: service.id,
    };

    addVet(newVet);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Compute category icon config
  const { variant: iconVariant, tone: iconTone } = getCategoryIconAndTone(primaryCategory);

  // Compute hours status
  const openStatus = isCurrentlyOpen(service.openingHours);

  // Render Verification Badge
  const renderVerificationBadge = () => {
    switch (service.verificationStatus) {
      case 'verified':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-600">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>مورد تایید نظام دامپزشکی</span>
          </div>
        );
      case 'community_reported':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-100 text-[10px] font-bold text-amber-600">
            <Sparkles className="w-3.5 h-3.5" />
            <span>گزارش کاربران فعال</span>
          </div>
        );
      case 'unverified':
      default:
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-[10px] font-bold text-gray-500">
            <AlertTriangle className="w-3.5 h-3.5 text-coral" />
            <span>تلفنی تایید شود</span>
          </div>
        );
    }
  };

  // Normalized telephone links (remove dashes, non-digits, format correctly)
  const servicePhone = service.phone || '';
  const normalizedPhone = servicePhone.replace(/[^0-9+]/g, '');
  const telUri = normalizedPhone.startsWith('0') 
    ? `tel:+98${normalizedPhone.substring(1)}` 
    : `tel:${normalizedPhone}`;

  return (
    <Card 
      onClick={() => onSelect(service)}
      data-slot="service-card"
      glow={service.emergencyCapability}
      glowIntensity="subtle"
      className={cn(
        "cursor-pointer w-full text-right transition-all duration-300 relative border",
        service.emergencyCapability 
          ? "border-coral-light/35 bg-gradient-to-br from-white to-coral/[0.005]" 
          : "border-coral-light/15 bg-white"
      )}
    >
      <div className="flex flex-col gap-5 h-full justify-between" dir="rtl">
        {/* Top Info row */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            {/* Category Icon */}
            <div className="flex gap-3 items-center">
              <AnimatedCardIcon variant={iconVariant} tone={iconTone} size="md" />
              <div className="text-right">
                <span className="block text-[10px] font-bold text-gray-400 font-sans uppercase tracking-wider">
                  {getCategoryIconAndTone(primaryCategory).label}
                </span>
                <h4 className="font-sans font-bold text-base text-gray-900 group-hover:text-coral transition-colors line-clamp-1">
                  {service.name}
                </h4>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              {renderVerificationBadge()}
              {service.emergencyCapability && (
                <span className="inline-block px-2 py-0.5 rounded-md bg-coral/10 text-[9px] font-bold text-coral animate-pulse">
                  امداد اورژانس فوری
                </span>
              )}
            </div>
          </div>

          {/* Description / Specialties list */}
          {service.specialties && service.specialties.length > 0 && (
            <div className="flex items-start gap-2 bg-gray-50/50 border border-gray-100 p-2.5 rounded-xl">
              <Compass className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-700 leading-relaxed">
                  تخصص‌ها: {service.specialties.join('، ')}
                </p>
              </div>
            </div>
          )}

          {/* Open Hours Status & Address */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <Clock className={cn(
                "w-4 h-4 shrink-0",
                openStatus.isOpen ? "text-emerald-500" : "text-coral"
              )} />
              <span className={cn(
                "font-bold font-sans",
                openStatus.isOpen ? "text-emerald-600" : "text-coral"
              )}>
                {openStatus.text}
              </span>
            </div>

            <div className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <span>
                {service.address}
                {service.district && (
                  <span className="inline-block mr-1.5 px-1.5 py-0.5 rounded bg-gray-100 text-[10px] text-gray-500">
                    محله {service.district}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions and Distances */}
        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Distance info (if exists) */}
          <div className="min-w-0">
            {distanceKm !== null ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1">
                <Compass className="w-3.5 h-3.5" />
                <span>فاصله شما: {toPersian(distanceKm.toFixed(1))} کیلومتر</span>
              </div>
            ) : (
              <span className="text-[10px] text-gray-400 font-medium font-sans">محاسبه نشده</span>
            )}
          </div>

          {/* Right: Quick actions */}
          <div className="flex items-center gap-1.5 justify-end">
            {/* Phone button (min target 44px) */}
            {service.phone && (
              <a
                href={telUri}
                onClick={(e) => e.stopPropagation()}
                className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:text-coral hover:bg-coral/5 transition-colors"
                title="تماس مستقیم تلفنی"
              >
                <Phone className="w-4.5 h-4.5" />
              </a>
            )}

            {/* Save Button */}
            <button
              onClick={handleSaveToMyVets}
              disabled={isSaved || saveSuccess}
              className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer border",
                isSaved
                  ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                  : saveSuccess
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600 scale-95"
                    : "bg-gray-50 border-gray-100 text-gray-400 hover:text-coral hover:bg-coral/5"
              )}
              title={isSaved ? "ذخیره شده در دامپزشکان من" : "ذخیره در دفترچه من"}
            >
              <Heart className={cn("w-4.5 h-4.5", (isSaved || saveSuccess) && "fill-current")} />
            </button>

            {/* Directions Link */}
            <a
              href={getDirectionsUrl(service.address, service.coordinates)}
              target="_blank"
              referrerPolicy="no-referrer"
              onClick={(e) => e.stopPropagation()}
              className="h-11 px-4.5 rounded-xl bg-coral text-white font-sans font-bold text-xs flex items-center gap-2 hover:bg-coral-dark shadow-sm transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              مسیریابی
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
};
