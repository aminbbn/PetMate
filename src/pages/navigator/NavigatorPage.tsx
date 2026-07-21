import React, { useState, useMemo } from 'react';
import { useAppStore, Vet } from '../../store';
import { DEMO_SERVICES } from './serviceFixtures';
import { PetService, ServiceCoordinates, PetServiceCategory } from './navigatorTypes';
import { LocationControl } from './LocationControl';
import { NavigatorHeader } from './NavigatorHeader';
import { ServiceResults } from './ServiceResults';
import { normalizePersianText, getCategoryIconAndTone } from './navigatorUtils';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  BookOpen
} from 'lucide-react';
import { Button } from '../../components/Button';
import { ServiceDetailDrawer } from './ServiceDetailDrawer';

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

      {/* Service Detail Drawer */}
      <ServiceDetailDrawer
        open={selectedService !== null}
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onSave={handleSaveDetailVet}
        isSaved={isSelectedSaved}
        saveSuccess={saveSuccess}
      />
    </div>
  );
};
export default NavigatorPage;
