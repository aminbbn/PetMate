/**
 * Normalizes Persian and Arabic text for robust search matches.
 * Handles Yeh/Keh variations, zero-width non-joiners (half-space),
 * Arabic/Persian/Latin digit conversion, diacritics, and case.
 */
export function normalizePersianText(text: string): string {
  if (!text) return '';
  
  let normalized = text.toLowerCase();

  // Convert Arabic Yeh (ي) and Persian Yeh (ی) to standard Persian Yeh
  normalized = normalized.replace(/ي/g, 'ی');
  
  // Convert Arabic Kaf (ك) to Persian Kaf (ک)
  normalized = normalized.replace(/ك/g, 'ک');
  
  // Remove Arabic diacritics (Fatha, Damma, Kasra, Tanween, Shadda, Sukun)
  normalized = normalized.replace(/[\u064B-\u0652]/g, '');
  
  // Normalize zero-width non-joiner (ZWNJ / نیم‌فاصله) and other whitespaces
  normalized = normalized.replace(/\u200C/g, ' ');
  normalized = normalized.replace(/\s+/g, ' ');
  
  // Normalize digits (Persian/Arabic to Latin)
  const persianDigits = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const arabicDigits = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  for (let i = 0; i < 10; i++) {
    normalized = normalized.replace(persianDigits[i], String(i));
    normalized = normalized.replace(arabicDigits[i], String(i));
  }

  return normalized.trim();
}

/**
 * Format Persian currency (Toman - IRT) with separators.
 */
export function formatToman(amount: number): string {
  const parts = amount.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Convert digits to Persian characters
  const latinDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  let formatted = parts.join('.');
  for (let i = 0; i < 10; i++) {
    const reg = new RegExp(latinDigits[i], 'g');
    formatted = formatted.replace(reg, persianDigits[i]);
  }
  
  return formatted;
}

/**
 * Convert number to Persian numerals.
 */
export function toPersianDigits(num: number | string): string {
  const str = num.toString();
  const latinDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  let result = str;
  for (let i = 0; i < 10; i++) {
    const reg = new RegExp(latinDigits[i], 'g');
    result = result.replace(reg, persianDigits[i]);
  }
  return result;
}
