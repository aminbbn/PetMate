import { HealthRecordKind } from '../../store';
import { toPersian } from '../../lib/persian';
import { AnimatedCardIconVariant } from '../../components/AnimatedCardIcon';

export function getKindLabel(kind: HealthRecordKind): string {
  switch (kind) {
    case 'visit':
      return 'معاینه / ویزیت';
    case 'vaccination':
      return 'واکسیناسیون';
    case 'lab_test':
      return 'آزمایشگاه';
    case 'imaging':
      return 'تصویربرداری';
    case 'medication':
      return 'تجویز دارو';
    case 'surgery':
      return 'عمل جراحی';
    case 'allergy':
      return 'حساسیت و آلرژی';
    case 'document':
      return 'سند و مدرک';
    case 'note':
      return 'یادداشت عمومی';
    case 'other':
    default:
      return 'سایر موارد';
  }
}

export function getKindIconVariant(kind: HealthRecordKind): AnimatedCardIconVariant {
  switch (kind) {
    case 'visit':
      return 'stethoscope';
    case 'vaccination':
      return 'success';
    case 'lab_test':
      return 'document';
    case 'imaging':
      return 'document';
    case 'medication':
      return 'clock';
    case 'surgery':
      return 'heart';
    case 'allergy':
      return 'alert';
    case 'document':
      return 'document';
    case 'note':
    case 'other':
    default:
      return 'document';
  }
}

export function getKindTone(kind: HealthRecordKind): 'coral' | 'sunny' | 'mint' | 'blue' | 'neutral' {
  switch (kind) {
    case 'visit':
      return 'coral';
    case 'vaccination':
      return 'mint';
    case 'lab_test':
      return 'blue';
    case 'imaging':
      return 'blue';
    case 'medication':
      return 'sunny';
    case 'surgery':
      return 'coral';
    case 'allergy':
      return 'sunny'; // gentle warning tone instead of scary red
    case 'document':
      return 'neutral';
    case 'note':
    case 'other':
    default:
      return 'neutral';
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '۰ بایت';
  const k = 1024;
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
  return `${toPersian(val)} ${sizes[i]}`;
}

export function getYearMonthKey(dateStr: string): { year: string; monthName: string; order: number } {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return { year: 'نامشخص', monthName: 'سایر', order: 0 };
    }
    
    // Get Persian year and month
    const yearFormatter = new Intl.DateTimeFormat('fa-IR', { year: 'numeric' });
    const monthFormatter = new Intl.DateTimeFormat('fa-IR', { month: 'long' });
    const monthOrderFormatter = new Intl.DateTimeFormat('fa-IR', { month: 'numeric' });
    
    const year = yearFormatter.format(date);
    const monthName = monthFormatter.format(date);
    const monthOrder = parseInt(monthOrderFormatter.format(date).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString()));

    return {
      year,
      monthName,
      order: date.getFullYear() * 12 + date.getMonth()
    };
  } catch (e) {
    return { year: 'نامشخص', monthName: 'سایر', order: 0 };
  }
}

export function jalaliToGregorian(jy: number, jm: number, jd: number): string {
  let j_day_no = jd - 1;
  const j_month_days = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  for (let i = 0; i < jm - 1; i++) {
    j_day_no += j_month_days[i];
  }
  
  const refJYear = 1395;
  const refGDate = new Date(Date.UTC(2016, 2, 20)); // March 20, 2016
  
  let daysDiff = j_day_no;
  
  if (jy >= refJYear) {
    for (let y = refJYear; y < jy; y++) {
      const isLeap = isJalaliLeapYear(y);
      daysDiff += isLeap ? 366 : 365;
    }
  } else {
    for (let y = refJYear - 1; y >= jy; y--) {
      const isLeap = isJalaliLeapYear(y);
      daysDiff -= isLeap ? 366 : 365;
    }
  }
  
  const targetDate = new Date(refGDate.getTime() + daysDiff * 24 * 60 * 60 * 1000);
  return targetDate.toISOString().split('T')[0];
}

export function gregorianToJalali(dateInput: string | Date): { jy: number; jm: number; jd: number } {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) {
    const today = new Date();
    return gregorianToJalali(today);
  }
  
  try {
    const faDateStr = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      timeZone: 'UTC'
    }).format(date);
    
    const enDigits = faDateStr.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
    const parts = enDigits.split('/');
    // Depending on system and browser, parts might be [year, month, day] or [day, month, year].
    // Let's identify the year (usually > 1300) to be robust.
    let y = 1405;
    let m = 1;
    let d = 1;
    
    const p1 = parseInt(parts[0], 10);
    const p2 = parseInt(parts[1], 10);
    const p3 = parseInt(parts[2], 10);
    
    if (p1 > 1300) {
      y = p1;
      m = p2;
      d = p3;
    } else if (p3 > 1300) {
      y = p3;
      m = p2;
      d = p1;
    } else {
      y = p3;
      m = p1;
      d = p2;
    }
    
    return { jy: y, jm: m, jd: d };
  } catch (e) {
    return { jy: 1405, jm: 1, jd: 1 };
  }
}

function isJalaliLeapYear(y: number): boolean {
  const remain = y % 33;
  return remain === 1 || remain === 5 || remain === 9 || remain === 13 || remain === 17 || remain === 22 || remain === 26 || remain === 30;
}

