/**
 * Converts English numbers/digits inside any string or number to Persian digits.
 */
export function toPersian(input: string | number | undefined | null): string {
  if (input === undefined || input === null) return '';
  const str = String(input);
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  return str.replace(/[0-9]/g, (w) => persianDigits[englishDigits.indexOf(w)]);
}

/**
 * Converts a Date or ISO string into a Persian/Solar Hijri formatted date string,
 * or formats standard gregorian months/days into Persian words.
 * Since we want 100% Persian, we can format a gregorian date nicely in Persian!
 */
export function formatPersianDate(dateInput: string | Date): string {
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return '';
    
    // Using Intl.DateTimeFormat with 'fa-IR' locale
    const formatter = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return formatter.format(date);
  } catch (e) {
    return toPersian(String(dateInput));
  }
}
