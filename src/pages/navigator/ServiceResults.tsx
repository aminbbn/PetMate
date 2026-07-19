import React from 'react';
import { PetService, ServiceCoordinates } from './navigatorTypes';
import { ServiceCard } from './ServiceCard';
import { calculateDistanceKm, CATEGORY_LABELS } from './navigatorUtils';
import { Map, Database, AlertCircle } from 'lucide-react';
import { Card } from '../../components/Card';
import { CardCornerIcon } from '../../components/card/CardCornerIcon';
import { toPersian } from '../../lib/persian';
import { motion } from 'motion/react';

interface ServiceResultsProps {
  services: PetService[];
  userCoordinates: ServiceCoordinates | null;
  onSelect: (service: PetService) => void;
  selectedCategory: string;
}

export const ServiceResults: React.FC<ServiceResultsProps> = ({
  services,
  userCoordinates,
  onSelect,
  selectedCategory,
}) => {
  // Compute distance for each service if user location is available
  const sortedServices = React.useMemo(() => {
    if (!userCoordinates) return services;

    return [...services].map(service => {
      const distance = calculateDistanceKm(userCoordinates, service.coordinates || { latitude: 35.6892, longitude: 51.3890 });
      return { ...service, distance };
    }).sort((a, b) => {
      // Sort primarily by emergency capability, then by distance
      if (a.emergencyCapability && !b.emergencyCapability) return -1;
      if (!a.emergencyCapability && b.emergencyCapability) return 1;
      
      const distA = (a as any).distance ?? Infinity;
      const distB = (b as any).distance ?? Infinity;
      return distA - distB;
    });
  }, [services, userCoordinates]);

  // Count distribution of categories in current results
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    services.forEach(s => {
      const cat = s.categories[0] || 'other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [services]);

  return (
    <div className="w-full space-y-6 text-right" dir="rtl">
      {/* List-First Fallback Mode Geographic Summary Panel */}
      <Card 
        className="w-full bg-gradient-to-br from-white to-blue-50/10 relative p-6 border border-pm-stroke-subtle" 
        contentClassName="relative w-full h-full"
        hoverEffect={false}
      >
        <CardCornerIcon icon={Map} animationVariant="map" tone="info" size="sm" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pr-14">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2.5 text-blue">
              <h4 className="font-sans font-black text-base text-gray-900">پنل موقعیت و خلاصه‌ساز جغرافیایی</h4>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-3xl">
              سرویس نقشه فعال متصل به دامنه یافت نشد. فواصل بر اساس مختصات مستقیم ریاضی (فرمول هاورساین) به صورت آفلاین محاسبه می‌شوند.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-500/10 border border-amber-400/20 px-3 py-1.5 rounded-xl w-fit">
              <Database className="w-4 h-4" />
              <span className="font-semibold">داده‌های نمایشی فعال: استفاده از بانک شبیه‌ساز آفلاین تهران بزرگ</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 lg:border-r border-gray-100 lg:pr-8 shrink-0 min-w-[240px]">
            <span className="text-[10px] font-bold text-gray-400 font-sans uppercase">توزیع مراکز یافت‌شده در نقشه:</span>
            <div className="space-y-1.5">
              {Object.entries(categoryCounts).slice(0, 3).map(([cat, count]) => (
                <div key={cat} className="flex items-center justify-between text-xs text-gray-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-blue" />
                    {CATEGORY_LABELS[cat as any] || cat}
                  </span>
                  <span className="font-bold font-mono text-gray-800">{toPersian(count)} مورد</span>
                </div>
              ))}
              {Object.keys(categoryCounts).length > 3 && (
                <div className="text-[10px] text-gray-400 font-medium font-sans">
                  و {toPersian(Object.keys(categoryCounts).length - 3)} دسته‌بندی خدماتی دیگر...
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-dashed border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-sans pr-14">
          <span>سرویس‌گیرنده: مرورگر کاربر نهایی (Privacy-First Session)</span>
          <span className="font-semibold text-blue/95">نمایش نقشه پس از اتصال سرویس نقشه فعال می‌شود.</span>
        </div>
      </Card>

      {/* Grid of Results */}
      {sortedServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedServices.map((service) => {
            const distance = userCoordinates 
              ? calculateDistanceKm(userCoordinates, service.coordinates || { latitude: 35.6892, longitude: 51.3890 })
              : null;

            return (
              <ServiceCard
                key={service.id}
                service={service}
                userCoordinates={userCoordinates}
                distanceKm={distance}
                onSelect={onSelect}
              />
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16 px-4 bg-white border border-coral-light/15 rounded-[24px] text-center"
        >
          <div className="p-4 rounded-full bg-coral/5 text-coral mb-4">
            <AlertCircle className="w-12 h-12" />
          </div>
          <h4 className="font-sans font-bold text-lg text-gray-900 mb-2">مرکزی یافت نشد</h4>
          <p className="text-sm text-gray-500 max-w-md leading-relaxed">
            هیچ کلینیک، پت‌شاپ یا مرکز خدماتی منطبق با فیلترها و کلمات جستجو شده پیدا نشد. لطفاً معیار خود را تغییر داده یا فیلتر اورژانس را خاموش کنید.
          </p>
        </motion.div>
      )}
    </div>
  );
};
