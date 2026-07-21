import React from 'react';
import { PetService } from './navigatorTypes';
import { getCategoryIconAndTone, getDirectionsUrl, isCurrentlyOpen } from './navigatorUtils';
import { toPersian } from '../../lib/persian';
import { MotionDrawer } from '../../motion/MotionDrawer';
import { Button } from '../../components/Button';
import { cn } from '../../lib/utils';
import { 
  Phone, 
  MapPin, 
  Navigation, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  X,
  Compass,
  CheckCircle,
  Tag
} from 'lucide-react';

interface ServiceDetailDrawerProps {
  open: boolean;
  service: PetService | null;
  onClose: () => void;
  onSave: (service: PetService) => void;
  isSaved: boolean;
  saveSuccess: boolean;
}

export const ServiceDetailDrawer: React.FC<ServiceDetailDrawerProps> = ({
  open,
  service,
  onClose,
  onSave,
  isSaved,
  saveSuccess,
}) => {
  return (
    <MotionDrawer
      isOpen={open}
      onClose={onClose}
      ariaLabelledby="service-drawer-title"
    >
      {service && (
        <div data-slot="service-detail-drawer" className="flex flex-col h-full w-full">
          {/* Header — fixed */}
          <header className="shrink-0 border-b border-gray-100 px-6 py-5 bg-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-coral/10 rounded-2xl text-coral shrink-0 group hover:rotate-12 transition-transform duration-300">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 font-sans uppercase">
                    {getCategoryIconAndTone(service.categories[0] || 'other').label}
                  </span>
                  <h3 id="service-drawer-title" className="font-sans font-black text-xl text-gray-900 leading-tight">
                    {service.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-coral hover:bg-coral/5 transition-colors cursor-pointer"
                aria-label="بستن پنجره"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Body — scrollable */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-6 space-y-6">
            {/* Verification & Emergency Alert info */}
            <div className="flex flex-wrap gap-2.5">
              {service.verificationStatus === 'verified' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-600">
                  <ShieldCheck className="w-4.5 h-4.5" />
                  <span>مورد تایید نظام دامپزشکی ایران</span>
                </div>
              )}
              {service.verificationStatus === 'community_reported' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-100 text-xs font-bold text-amber-600">
                  <Sparkles className="w-4.5 h-4.5" />
                  <span>گزارش و صحت‌سنجی کاربران فعال</span>
                </div>
              )}
              {service.emergencyCapability && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-coral/10 border border-coral/20 text-xs font-bold text-coral">
                  <AlertTriangle className="w-4.5 h-4.5 animate-bounce" />
                  <span>مجهز به بخش اورژانس و امداد فوری</span>
                </div>
              )}
            </div>

            {/* About & General info */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 font-sans uppercase">توضیحات و خدمات مرکز</h4>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-[18px]">
                {service.description || 'سایر توضیحات تخصصی برای این مرکز در حال حاضر ثبت نشده است.'}
              </p>
            </div>

            {/* Specialties List */}
            {service.specialties && service.specialties.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 font-sans uppercase">خدمات تخصصی و زمینه‌های درمان</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {service.specialties.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 border border-gray-100 p-2.5 rounded-xl bg-white">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-xs font-bold text-gray-700">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities / Equipment list */}
            {service.amenities && service.amenities.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 font-sans uppercase">تجهیزات و امکانات رفاهی مرکز</h4>
                <div className="flex flex-wrap gap-1.5">
                  {service.amenities.map((amen, idx) => (
                    <span key={idx} className="bg-blue/5 border border-blue/15 text-blue text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                      <Tag className="w-3 h-3" />
                      {amen}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Opening Hours list */}
            {service.openingHours && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-gray-400 font-sans uppercase">ساعات کاری و دوره‌های زمانی</h4>
                <div className="flex items-center gap-2 text-sm bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl">
                  <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-emerald-700 font-bold text-xs">
                    وضعیت فعلی: {isCurrentlyOpen(service.openingHours).text}
                  </span>
                </div>
              </div>
            )}

            {/* Coordinates & contact details */}
            <div className="space-y-3 bg-gray-50/50 p-4 rounded-[18px] border border-gray-100 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span className="text-gray-600 leading-relaxed">
                  <strong>آدرس:</strong> {service.address}
                </span>
              </div>

              {service.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-gray-600">
                    <strong>تلفن تماس:</strong> {toPersian(service.phone)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer actions — fixed */}
          <footer className="shrink-0 border-t border-gray-100 p-6 bg-gray-50/50 grid grid-cols-2 gap-3">
            {/* Save To My Vets */}
            <Button
              variant="outline"
              onClick={() => onSave(service)}
              disabled={isSaved || saveSuccess}
              className={cn(
                "font-bold text-xs h-12 flex items-center justify-center gap-2 cursor-pointer transition-all border",
                isSaved
                  ? "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-50"
                  : saveSuccess
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                    : "border-coral-light/20 hover:bg-coral/5 text-coral"
              )}
            >
              <Heart className={cn("w-4 h-4", (isSaved || saveSuccess) && "fill-current text-emerald-600")} />
              {isSaved ? 'ذخیره شده در مخاطبین' : saveSuccess ? '✓ افزوده شد' : 'ذخیره در دامپزشکان من'}
            </Button>

            {/* Direct route Navigation */}
            <a
              href={getDirectionsUrl(service.address, service.coordinates)}
              target="_blank"
              referrerPolicy="no-referrer"
              className="h-12 rounded-[14px] bg-coral hover:bg-coral-dark text-white font-sans font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Navigation className="w-4 h-4" />
              مسیریابی مستقیم نقشه
            </a>
          </footer>
        </div>
      )}
    </MotionDrawer>
  );
};
