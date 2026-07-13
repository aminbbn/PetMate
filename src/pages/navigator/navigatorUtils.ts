import { PetService, ServiceCoordinates, WeeklyOpeningHours, PetServiceCategory } from './navigatorTypes';
import { AnimatedCardIconVariant, AnimatedCardIconTone } from '../../components/AnimatedCardIcon';

/**
 * Normalizes Persian text to handle Arabic/Persian letter variations, zero-width spaces, diacritics, and digits.
 */
export function normalizePersianText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F]/g, '') // Remove Arabic diacritics
    .replace(/\u200C/g, ' ') // Zero-width non-joiner to space
    .replace(/[\u200B-\u200D]/g, '') // Remove zero-width joiners/spaces
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/۰/g, '0')
    .replace(/۱/g, '1')
    .replace(/۲/g, '2')
    .replace(/۳/g, '3')
    .replace(/۴/g, '4')
    .replace(/۵/g, '5')
    .replace(/۶/g, '6')
    .replace(/۷/g, '7')
    .replace(/۸/g, '8')
    .replace(/۹/g, '9')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates distance in kilometers between two coordinates using the Haversine formula.
 */
export function calculateDistanceKm(
  coord1: ServiceCoordinates,
  coord2: ServiceCoordinates
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const dLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.latitude * Math.PI) / 180) *
      Math.cos((coord2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Computes whether a service is currently open based on weekly hours and local timezone time.
 */
export function isCurrentlyOpen(hours?: WeeklyOpeningHours): { isOpen: boolean; text: string } {
  if (!hours || !hours.periods || hours.periods.length === 0) {
    return { isOpen: false, text: 'ساعات کاری ثبت نشده' };
  }

  try {
    const now = new Date();
    // Iran standard day numbering and time
    const day = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
    const hoursStr = String(now.getHours()).padStart(2, '0');
    const minsStr = String(now.getMinutes()).padStart(2, '0');
    const currentTimeVal = `${hoursStr}:${minsStr}`;

    const todayPeriods = hours.periods.filter((p) => p.day === day);
    if (todayPeriods.length === 0) {
      return { isOpen: false, text: 'بسته' };
    }

    for (const period of todayPeriods) {
      const open = period.open;
      const close = period.close;

      if (open === '00:00' && close === '23:59') {
        return { isOpen: true, text: 'باز است (شبانه‌روزی)' };
      }

      if (open <= close) {
        if (currentTimeVal >= open && currentTimeVal <= close) {
          return { isOpen: true, text: `باز است (تا ساعت ${open} شب/عصر)` };
        }
      } else {
        // Overnight clinic
        if (currentTimeVal >= open || currentTimeVal <= close) {
          return { isOpen: true, text: `باز است (تا ساعت ${close} صبح)` };
        }
      }
    }

    return { isOpen: false, text: 'بسته' };
  } catch (e) {
    return { isOpen: false, text: 'وضعیت باز بودن نامشخص' };
  }
}

/**
 * Generates a safe, provider-neutral maps directions URL.
 */
export function getDirectionsUrl(address: string, coords?: ServiceCoordinates): string {
  if (coords) {
    return `https://www.google.com/maps/dir/?api=1&destination=${coords.latitude},${coords.longitude}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

/**
 * Standard Persian translations for category names.
 */
export const CATEGORY_LABELS: Record<PetServiceCategory, string> = {
  veterinary_clinic: 'کلینیک',
  veterinary_hospital: 'بیمارستان',
  pharmacy: 'داروخانه',
  pet_shop: 'فروشگاه',
  boarding: 'پانسیون',
  grooming: 'آرایش و نظافت',
  park: 'پارک و تفریح',
  laboratory: 'آزمایشگاه',
  imaging: 'تصویربرداری',
  other: 'سایر خدمات'
};

/**
 * Maps a service category to its appropriate card icon and aesthetic color tone.
 */
export function getCategoryIconAndTone(category: PetServiceCategory): {
  variant: AnimatedCardIconVariant;
  tone: AnimatedCardIconTone;
  label: string;
} {
  switch (category) {
    case 'veterinary_clinic':
      return { variant: 'stethoscope', tone: 'coral', label: 'کلینیک دامپزشکی' };
    case 'veterinary_hospital':
      return { variant: 'stethoscope', tone: 'coral', label: 'بیمارستان دامپزشکی' };
    case 'pharmacy':
      return { variant: 'document', tone: 'mint', label: 'داروخانه' };
    case 'pet_shop':
      return { variant: 'shop', tone: 'sunny', label: 'پت‌شاپ' };
    case 'boarding':
      return { variant: 'heart', tone: 'coral', label: 'پانسیون و هتل' };
    case 'grooming':
      return { variant: 'sparkles', tone: 'sunny', label: 'آرایش و نظافت' };
    case 'park':
      return { variant: 'map', tone: 'blue', label: 'پارک و تفریح' };
    case 'laboratory':
      return { variant: 'document', tone: 'blue', label: 'آزمایشگاه دامپزشکی' };
    case 'imaging':
      return { variant: 'document', tone: 'coral', label: 'تصویربرداری' };
    default:
      return { variant: 'sparkles', tone: 'neutral', label: 'سایر خدمات' };
  }
}
