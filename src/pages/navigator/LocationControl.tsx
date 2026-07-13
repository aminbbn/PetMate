import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { MapPin, Navigation, Trash2, Shield, Compass } from 'lucide-react';
import { ServiceCoordinates } from './navigatorTypes';
import { toPersian } from '../../lib/persian';
import { motion, AnimatePresence } from 'motion/react';

interface LocationControlProps {
  currentCoordinates: ServiceCoordinates | null;
  locationSource: 'live' | 'mock' | null;
  onLocationUpdate: (coords: ServiceCoordinates, source: 'live' | 'mock') => void;
  onLocationReset: () => void;
}

export const LocationControl: React.FC<LocationControlProps> = ({
  currentCoordinates,
  locationSource,
  onLocationUpdate,
  onLocationReset,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tehran Center simulation coordinate
  const MOCK_TEHRAN_COORDS: ServiceCoordinates = {
    latitude: 35.6892,
    longitude: 51.3890,
  };

  const handleSimulateTehran = () => {
    setError(null);
    onLocationUpdate(MOCK_TEHRAN_COORDS, 'mock');
  };

  const handleRequestLiveLocation = () => {
    if (!navigator.geolocation) {
      setError('مرورگر شما از قابلیت مکان‌یابی پشتیبانی نمی‌کند.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        const coords: ServiceCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        onLocationUpdate(coords, 'live');
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('دسترسی به موقعیت جغرافیایی رد شد. لطفاً تنظیمات مرورگر را بررسی کنید.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('موقعیت جغرافیایی شما در دسترس نیست.');
            break;
          case err.TIMEOUT:
            setError('زمان درخواست دریافت موقعیت به پایان رسید.');
            break;
          default:
            setError('خطای غیرمنتظره در دریافت موقعیت رخ داد.');
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <Card className="w-full relative overflow-hidden border border-coral-light/20 shadow-sm" hoverEffect={false}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6" dir="rtl">
        {/* Right side: Info and status */}
        <div className="flex items-start gap-4 flex-1">
          <div className="p-3 rounded-2xl bg-coral/10 text-coral shrink-0 mt-0.5">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1.5 text-right w-full">
            <h3 className="font-sans font-bold text-lg text-gray-900">موقعیت جغرافیایی شما</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              تعیین موقعیت برای محاسبه فاصله تا کلینیک‌ها و مراکز خدماتی استفاده می‌شود. موقعیت شما به هیچ عنوان ذخیره نخواهد شد.
            </p>

            <AnimatePresence mode="wait">
              {currentCoordinates ? (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="inline-flex flex-wrap items-center gap-3 mt-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2"
                >
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-gray-700">
                    {locationSource === 'live' ? 'موقعیت زنده (مرورگر)' : 'موقعیت شبیه‌سازی‌شده (تهران)'}
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    ({toPersian(currentCoordinates.latitude.toFixed(4))}, {toPersian(currentCoordinates.longitude.toFixed(4))})
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center gap-2 mt-2"
                >
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-xs text-amber-600 font-medium">موقعیت تعیین نشده است - فواصل نمایش داده نمی‌شوند</span>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-xs text-coral font-medium mt-2 bg-coral/5 border border-coral/10 p-2.5 rounded-xl"
              >
                {error}
              </motion.div>
            )}
          </div>
        </div>

        {/* Left side: Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 justify-end md:self-center">
          {!currentCoordinates ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSimulateTehran}
                className="text-xs font-bold border-coral-light/30 hover:bg-coral/5 text-coral h-11 px-4.5"
              >
                شبیه‌سازی مرکز تهران
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleRequestLiveLocation}
                disabled={loading}
                className="text-xs font-bold bg-coral hover:bg-coral-dark text-white shadow-md hover:shadow-lg h-11 px-5"
              >
                <Navigation className={`w-4 h-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'دریافت موقعیت...' : 'به‌روزرسانی موقعیت زنده'}
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onLocationReset}
              className="text-xs font-bold text-gray-500 hover:text-coral hover:bg-coral/5 border-gray-200 hover:border-coral-light/40 h-11 px-4.5"
            >
              <Trash2 className="w-4 h-4 ml-2" />
              پاک کردن موقعیت و فواصل
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
