import { toPersian, formatPersianDate } from '../../lib/persian';
import { WeightEntry, RangeFilter } from './growthTypes';

/**
 * Normalizes Persian and Arabic numbers in a string to English digits.
 */
export function toEnglishDigits(str: string): string {
  const persianDigits = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const arabicDigits = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  let normalized = str;
  for (let i = 0; i < 10; i++) {
    normalized = normalized.replace(persianDigits[i], String(i)).replace(arabicDigits[i], String(i));
  }
  return normalized;
}

/**
 * Parses a numeric value, normalizing any Persian/Arabic digits, returning null if invalid.
 */
export function parseWeightInput(input: string): number | null {
  const normalized = toEnglishDigits(input).trim();
  const val = Number(normalized);
  if (isNaN(val) || val <= 0 || !isFinite(val)) {
    return null;
  }
  return val;
}

/**
 * Calculates days between two ISO dates.
 */
export function getDaysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculates comparison details between two weight entries.
 */
export interface WeightComparison {
  diffKg: number;
  pctChange?: number;
  days: number;
  direction: 'increase' | 'decrease' | 'no_change';
}

export function compareWeightEntries(current: WeightEntry, previous?: WeightEntry): WeightComparison | null {
  if (!previous) return null;
  
  const diffKg = current.weightKg - previous.weightKg;
  const days = getDaysBetween(current.measuredAt, previous.measuredAt);
  const pctChange = previous.weightKg > 0 ? (diffKg / previous.weightKg) * 100 : undefined;
  
  let direction: 'increase' | 'decrease' | 'no_change' = 'no_change';
  if (diffKg > 0.001) direction = 'increase';
  else if (diffKg < -0.001) direction = 'decrease';

  return {
    diffKg: Math.abs(diffKg),
    pctChange: pctChange ? Math.abs(pctChange) : undefined,
    days,
    direction
  };
}

/**
 * Returns exact Persian labels for source values
 */
export function getSourceLabel(source?: string): string {
  switch (source) {
    case 'home':
      return 'در خانه';
    case 'veterinary_clinic':
      return 'کلینیک دامپزشکی';
    case 'groomer':
      return 'آرایشگاه حیوانات';
    case 'other':
    default:
      return 'سایر';
  }
}

/**
 * Filters weight entries based on a range filter.
 */
export function filterEntriesByRange(entries: WeightEntry[], filter: RangeFilter): WeightEntry[] {
  const sorted = [...entries].sort((a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime());
  if (filter === 'all' || sorted.length === 0) return sorted;

  const latestDate = new Date(sorted[sorted.length - 1].measuredAt);
  const cutoff = new Date(latestDate);

  if (filter === '30_days') cutoff.setDate(cutoff.getDate() - 30);
  else if (filter === '3_months') cutoff.setMonth(cutoff.getMonth() - 3);
  else if (filter === '6_months') cutoff.setMonth(cutoff.getMonth() - 6);
  else if (filter === '1_year') cutoff.setFullYear(cutoff.getFullYear() - 1);

  return sorted.filter(e => new Date(e.measuredAt) >= cutoff);
}

/**
 * Formats a short X-axis label based on date input and range.
 */
export function getShortJalaliLabel(dateStr: string, filter: RangeFilter): string {
  try {
    const date = new Date(dateStr);
    const formatterFa = new Intl.DateTimeFormat('fa-IR', {
      month: 'numeric',
      day: 'numeric',
      year: filter === 'all' || filter === '1_year' ? '2-digit' : undefined
    });
    return formatterFa.format(date);
  } catch (e) {
    return '';
  }
}

/**
 * Formats the full date & time beautifully in Persian.
 */
export function formatFullPersianDateTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const datePart = formatPersianDate(date);
    const timeFormatter = new Intl.DateTimeFormat('fa-IR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${datePart} ساعت ${timeFormatter.format(date)}`;
  } catch (e) {
    return formatPersianDate(dateStr);
  }
}
