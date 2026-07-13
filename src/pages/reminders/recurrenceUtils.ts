import { ReminderRecurrence } from '../../store';
import { toPersian } from '../../lib/persian';

const WEEKDAYS_MAP: Record<number, string> = {
  0: 'یکشنبه',
  1: 'دوشنبه',
  2: 'سه‌شنبه',
  3: 'چهارشنبه',
  4: 'پنج‌شنبه',
  5: 'جمعه',
  6: 'شنبه'
};

/**
 * Formats a ReminderRecurrence configuration into clean Persian text.
 */
export function formatRecurrenceInPersian(recurrence?: ReminderRecurrence): string {
  if (!recurrence || recurrence.frequency === 'once') {
    return 'یک‌بار';
  }

  const interval = recurrence.interval || 1;
  const intervalStr = interval > 1 ? ` هر ${toPersian(interval)}` : ' هر';

  switch (recurrence.frequency) {
    case 'daily':
      return interval > 1 ? `هر ${toPersian(interval)} روز` : 'هر روز';
    
    case 'weekly': {
      const weekdays = recurrence.weekdays || [];
      if (weekdays.length === 0) {
        return interval > 1 ? `هر ${toPersian(interval)} هفته` : 'هر هفته';
      }
      const daysStr = weekdays
        .map(d => WEEKDAYS_MAP[d])
        .filter(Boolean)
        .join(' و ');
      return interval > 1 
        ? `هر ${toPersian(interval)} هفته روزهای ${daysStr}`
        : `هر هفته روزهای ${daysStr}`;
    }
    
    case 'monthly':
      return interval > 1 ? `هر ${toPersian(interval)} ماه` : 'هر ماه';

    default:
      return 'بدون تکرار';
  }
}

/**
 * Calculates the next due ISO string based on recurrence rules.
 * If frequency is 'once' or endAt is reached, returns undefined.
 */
export function calculateNextDueDate(currentDueAt: string, recurrence?: ReminderRecurrence): string | undefined {
  if (!recurrence || recurrence.frequency === 'once') {
    return undefined;
  }

  const date = new Date(currentDueAt);
  if (isNaN(date.getTime())) {
    return undefined;
  }

  const interval = recurrence.interval || 1;

  switch (recurrence.frequency) {
    case 'daily':
      date.setDate(date.getDate() + interval);
      break;

    case 'weekly': {
      const weekdays = recurrence.weekdays || [];
      if (weekdays.length === 0) {
        date.setDate(date.getDate() + interval * 7);
      } else {
        // Find next scheduled weekday
        // Let's sort weekdays just to be predictable
        const sortedDays = [...weekdays].sort((a, b) => a - b);
        const currentDay = date.getDay(); // 0 is Sunday, 1 is Monday...
        
        let foundNext = false;
        // Check days in current week that are after today
        for (const targetDay of sortedDays) {
          if (targetDay > currentDay) {
            const diff = targetDay - currentDay;
            date.setDate(date.getDate() + diff);
            foundNext = true;
            break;
          }
        }
        
        if (!foundNext) {
          // Wrap around to next week's first weekday
          const firstTargetDay = sortedDays[0];
          const diff = (7 - currentDay) + firstTargetDay;
          // Add the week interval minus 1 (since we are wrapping to the next week already)
          date.setDate(date.getDate() + diff + (interval - 1) * 7);
        }
      }
      break;
    }

    case 'monthly':
      date.setMonth(date.getMonth() + interval);
      break;

    default:
      return undefined;
  }

  // Check if we passed endAt boundary
  if (recurrence.endAt) {
    const endDate = new Date(recurrence.endAt);
    if (!isNaN(endDate.getTime()) && date.getTime() > endDate.getTime()) {
      return undefined;
    }
  }

  return date.toISOString();
}
