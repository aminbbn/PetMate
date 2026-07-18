import { usePreferences as usePreferencesHook } from './PreferencesProvider';
import { useAppStore, AppPreferences, DEFAULT_PREFERENCES } from '../store';
import { toPersian, formatPersianDate } from '../lib/persian';

export const usePreferences = usePreferencesHook;

// Utility to check if quiet hours is currently active
export function isWithinQuietHours(
  quietHoursEnabled: boolean,
  start?: string,
  end?: string
): boolean {
  if (!quietHoursEnabled || !start || !end) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);

  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes <= endMinutes) {
    // Quiet hours is within the same calendar day (e.g., 13:00 to 15:00)
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  } else {
    // Quiet hours crosses midnight (e.g., 22:00 to 08:00)
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }
}

// Custom hook to manage notifications and permission requesting
export function useNotificationPreferences() {
  const preferences = useAppStore(state => state.preferences || DEFAULT_PREFERENCES);
  const updatePreferences = useAppStore(state => state.updatePreferences);

  const requestBrowserPermission = async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        updatePreferences({
          notifications: {
            ...preferences.notifications,
            browserEnabled: true
          }
        });
      } else {
        updatePreferences({
          notifications: {
            ...preferences.notifications,
            browserEnabled: false
          }
        });
      }
      return permission;
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      return 'default';
    }
  };

  const isQuiet = isWithinQuietHours(
    preferences.notifications?.quietHoursEnabled,
    preferences.notifications?.quietHoursStart,
    preferences.notifications?.quietHoursEnd
  );

  return {
    preferences: preferences.notifications,
    requestBrowserPermission,
    isQuiet,
    isWithinQuietHours: () => isQuiet,
  };
}

// Centralized setting-aware formatting helper hook
export function useFormatters() {
  const { digitStyle, dateDisplayMode, timezone } = usePreferences();

  // 1. formatNumber: standard formatter matching digitStyle setting
  const formatNumber = (val: number | string | undefined | null): string => {
    if (val === undefined || val === null) return '';
    const str = String(val);
    return digitStyle === 'persian' ? toPersian(str) : str;
  };

  // 2. formatDate: format string or Date into YYYY/MM/DD with Jalali/Gregorian awareness
  const formatDate = (dateStrOrDate: string | Date | undefined | null): string => {
    if (!dateStrOrDate) return '';
    const d = typeof dateStrOrDate === 'string' ? new Date(dateStrOrDate) : dateStrOrDate;
    if (isNaN(d.getTime())) return '';

    if (dateDisplayMode === 'jalali') {
      return formatPersianDate(d);
    } else {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}/${month}/${day}`;
    }
  };

  // 3. formatDateTime: YYYY/MM/DD HH:MM with format and timezone awareness
  const formatDateTime = (dateStrOrDate: string | Date | undefined | null): string => {
    if (!dateStrOrDate) return '';
    const d = typeof dateStrOrDate === 'string' ? new Date(dateStrOrDate) : dateStrOrDate;
    if (isNaN(d.getTime())) return '';

    const formattedDate = formatDate(d);
    
    // Format hours and minutes in user's preferred timezone
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: timezone,
    };
    const timeStr = d.toLocaleTimeString('fa-IR', timeOptions);
    const resolvedTimeStr = digitStyle === 'persian' ? timeStr : toLatinDigits(timeStr);

    return `${formattedDate} ${resolvedTimeStr}`;
  };

  // Helper to convert Persian digits back to Latin
  const toLatinDigits = (str: string): string => {
    const persianDigits = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    let result = str;
    for (let i = 0; i < 10; i++) {
      result = result.replace(persianDigits[i], String(i));
    }
    return result;
  };

  // 4. formatWeight: value + standard unit
  const formatWeight = (kg: number | string | undefined | null): string => {
    if (kg === undefined || kg === null) return '';
    return `${formatNumber(kg)} کیلوگرم`;
  };

  // 5. formatTemperature: value + standard Celsius unit
  const formatTemperature = (temp: number | string | undefined | null): string => {
    if (temp === undefined || temp === null) return '';
    return `${formatNumber(temp)} °C`;
  };

  // 6. normalizeDigitsForInput: convert any Persian numbers to standard Latin floats for inputs
  const normalizeDigitsForInput = (str: string): string => {
    return toLatinDigits(str).replace(/[٫,]/g, '.');
  };

  return {
    formatNumber,
    formatDate,
    formatDateTime,
    formatWeight,
    formatTemperature,
    normalizeDigitsForInput,
  };
}
