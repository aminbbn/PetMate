import React, { useState, useMemo } from 'react';
import { useAppStore, Vet } from '../../store';
import { DEMO_SERVICES } from './serviceFixtures';
import { PetService, ServiceCoordinates, PetServiceCategory } from './navigatorTypes';
import { LocationControl } from './LocationControl';
import { NavigatorHeader } from './NavigatorHeader';
import { ServiceResults } from './ServiceResults';
import { normalizePersianText, getCategoryIconAndTone, getDirectionsUrl, isCurrentlyOpen } from './navigatorUtils';
import { toPersian } from '../../lib/persian';
import { Link } from 'react-router-dom';
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
  BookOpen,
  CheckCircle,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/Button';

export const NavigatorPage: React.FC = () => {
  const profile = useAppStore((state) => state.profile);
  const savedVets = useAppStore((state) => state.vets || []);
  const addVet = useAppStore((state) => state.addVet);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PetServiceCategory | 'all'>('all');
  const [emergencyOnly, setEmergencyOnly] = useState(false);

  // Geolocation state (privacy-first: uninitialized by default)
  const [userCoordinates, setUserCoordinates] = useState<ServiceCoordinates | null>(null);
  const [locationSource, setLocationSource] = useState<'live' | 'mock' | null>(null);

  // Selected clinic state for detail panel
  const [selectedService, setSelectedService] = useState<PetService | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4" dir="rtl">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
        <h3 className="font-sans font-bold text-lg text-gray-900">پروفایل حیوان خانگی یافت نشد</h3>
        <p className="text-sm text-gray-500 mt-2">لطفاً ابتدا مراحل ثبت‌نام پت را کامل کنید.</p>
      </div>
    );
  }

  // Filter service items
  const filteredServices = useMemo(() => {
    return DEMO_SERVICES.filter((service) => {
      const primaryCategory = service.categories[0] || 'other';

      // 1. Category Filter (checks if service has selectedCategory in its categories array)
      if (selectedCategory !== 'all' && !service.categories.includes(selectedCategory)) {
        return false;
      }

      // 2. Emergency Filter (Only include services where emergencyCapability is true and verificationStatus is not unverified)
      if (emergencyOnly) {
        if (!service.emergencyCapability || service.verificationStatus === 'unverified') {
          return false;
        }
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const queryNorm = normalizePersianText(searchQuery);
        const nameNorm = normalizePersianText(service.name);
        const descNorm = normalizePersianText(service.description || '');
        const addressNorm = normalizePersianText(service.address);
        const specNorm = normalizePersianText(service.specialties?.join(' ') || '');
        const amenNorm = normalizePersianText(service.amenities?.join(' ') || '');
        const districtNorm = normalizePersianText(service.district || '');

        if (
          !nameNorm.includes(queryNorm) &&
          !descNorm.includes(queryNorm) &&
          !addressNorm.includes(queryNorm) &&
          !specNorm.includes(queryNorm) &&
          !amenNorm.includes(queryNorm) &&
          !districtNorm.includes(queryNorm)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, emergencyOnly, searchQuery]);

  const handleLocationUpdate = (coords: ServiceCoordinates, source: 'live' | 'mock') => {
    setUserCoordinates(coords);
    setLocationSource(source);
  };

  const handleLocationReset = () => {
    setUserCoordinates(null);
    setLocationSource(null);
  };

  const handleSaveDetailVet = (service: PetService) => {
    const isAlreadySaved = savedVets.some(
      (v) => v.sourceServiceId === service.id || v.id === service.id
    );
    if (isAlreadySaved || saveSuccess) return;

    const primaryCategory = service.categories[0] || 'other';
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
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const isSelectedSaved = selectedService
    ? savedVets.some((v) => v.sourceServiceId === selectedService.id || v.id === selectedService.id)
    : false;

  return (
    <div className="p-8 lg:p-10 space-y-8 max-w-7xl mx-auto w-full text-right relative" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="font-sans font-black text-3xl text-gray-900 tracking-tight">مسیریاب خدمات پت‌میت</h1>
          <p className="text-sm text-gray-500 mt-1">
            کشف مراکز درمانی، بیمارستان‌ها، پت‌شاپ‌ها و پارک‌های تفریحی معتبر تاییدشده در تهران بزرگ
          </p>
        </div>

        {/* Link to My Vets Contact Book */}
        <Link to="/vets" className="shrink-0 self-start md:self-center">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-coral-light/20 hover:bg-coral/5 text-coral font-bold text-xs h-11 px-5"
          >
            <BookOpen className="w-4 h-4" />
            مشاهده دفترچه دامپزشکان من
          </Button>
        </Link>
      </div>

      {/* Geolocation Control Card */}
      <LocationControl
        currentCoordinates={userCoordinates}
        locationSource={locationSource}
        onLocationUpdate={handleLocationUpdate}
        onLocationReset={handleLocationReset}
      />

      {/* Search inputs and Filters */}
      <NavigatorHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        emergencyOnly={emergencyOnly}
        onEmergencyToggle={setEmergencyOnly}
        totalCount={filteredServices.length}
      />

      {/* Results grid */}
      <ServiceResults
        services={filteredServices}
        userCoordinates={userCoordinates}
        onSelect={setSelectedService}
        selectedCategory={selectedCategory}
      />

      {/* Details Panel / Overlay */}
      <AnimatePresence>
        {selectedService && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-xs cursor-pointer"
            />

            {/* Sidebar Details Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 max-w-lg w-full bg-white z-50 shadow-2xl p-6 overflow-y-auto border-l border-coral-light/20 flex flex-col justify-between"
            >
              {/* Top part */}
              <div className="space-y-6">
                {/* Header title */}
                <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-coral/10 rounded-2xl text-coral shrink-0">
                      <Compass className="w-6 h-6 animate-spin-slow" />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-gray-400 font-sans uppercase">
                        {getCategoryIconAndTone(selectedService.categories[0] || 'other').label}
                      </span>
                      <h3 className="font-sans font-black text-xl text-gray-900">{selectedService.name}</h3>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedService(null)}
                    className="p-2 rounded-xl text-gray-400 hover:text-coral hover:bg-coral/5 transition-colors"
                    aria-label="بستن پنجره"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Verification & Emergency Alert info */}
                <div className="flex flex-wrap gap-2.5">
                  {selectedService.verificationStatus === 'verified' && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-600">
                      <ShieldCheck className="w-4.5 h-4.5" />
                      <span>مورد تایید نظام دامپزشکی ایران</span>
                    </div>
                  )}
                  {selectedService.verificationStatus === 'community_reported' && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-100 text-xs font-bold text-amber-600">
                      <Sparkles className="w-4.5 h-4.5" />
                      <span>گزارش و صحت‌سنجی کاربران فعال</span>
                    </div>
                  )}
                  {selectedService.emergencyCapability && (
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
                    {selectedService.description || 'سایر توضیحات تخصصی برای این مرکز در حال حاضر ثبت نشده است.'}
                  </p>
                </div>

                {/* Specialties List */}
                {selectedService.specialties && selectedService.specialties.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 font-sans uppercase">خدمات تخصصی و زمینه‌های درمان</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedService.specialties.map((spec, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 border border-gray-100 p-2.5 rounded-xl bg-white">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="text-xs font-bold text-gray-700">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amenities / Equipment list */}
                {selectedService.amenities && selectedService.amenities.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-400 font-sans uppercase">تجهیزات و امکانات رفاهی مرکز</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedService.amenities.map((amen, idx) => (
                        <span key={idx} className="bg-blue/5 border border-blue/15 text-blue text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                          <Tag className="w-3 h-3" />
                          {amen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Opening Hours list */}
                {selectedService.openingHours && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-gray-400 font-sans uppercase">ساعات کاری و دوره‌های زمانی</h4>
                    <div className="flex items-center gap-2 text-sm bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl">
                      <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-emerald-700 font-bold text-xs">
                        وضعیت فعلی: {isCurrentlyOpen(selectedService.openingHours).text}
                      </span>
                    </div>
                  </div>
                )}

                {/* Coordinates & contact details */}
                <div className="space-y-3 bg-gray-50/50 p-4 rounded-[18px] border border-gray-100 text-xs">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <span className="text-gray-600 leading-relaxed">
                      <strong>آدرس:</strong> {selectedService.address}
                    </span>
                  </div>

                  {selectedService.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="text-gray-600">
                        <strong>تلفن تماس:</strong> {toPersian(selectedService.phone)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="border-t border-gray-100 pt-5 mt-6 grid grid-cols-2 gap-3 shrink-0">
                {/* Save To My Vets */}
                <Button
                  variant="outline"
                  onClick={() => handleSaveDetailVet(selectedService)}
                  disabled={isSelectedSaved || saveSuccess}
                  className={cn(
                    "font-bold text-xs h-12 flex items-center justify-center gap-2 cursor-pointer transition-all border",
                    isSelectedSaved
                      ? "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-50"
                      : saveSuccess
                        ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                        : "border-coral-light/20 hover:bg-coral/5 text-coral"
                  )}
                >
                  <Heart className={cn("w-4 h-4", (isSelectedSaved || saveSuccess) && "fill-current text-emerald-600")} />
                  {isSelectedSaved ? 'ذخیره شده در مخاطبین' : saveSuccess ? '✓ افزوده شد' : 'ذخیره در دامپزشکان من'}
                </Button>

                {/* Direct route Navigation */}
                <a
                  href={getDirectionsUrl(selectedService.address, selectedService.coordinates)}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="h-12 rounded-[14px] bg-coral hover:bg-coral-dark text-white font-sans font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  مسیریابی مستقیم نقشه
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
export default NavigatorPage;
