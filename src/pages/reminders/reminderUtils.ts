import { Reminder, ReminderCategory } from '../../store';

export interface GroupedReminders {
  overdue: Reminder[];
  today: Reminder[];
  thisWeek: Reminder[];
  later: Reminder[];
  done: Reminder[];
}

export function groupReminders(reminders: Reminder[], selectedPetId: string | null): GroupedReminders {
  const grouped: GroupedReminders = {
    overdue: [],
    today: [],
    thisWeek: [],
    later: [],
    done: []
  };

  if (!selectedPetId) return grouped;

  // Filter reminders for selected pet
  const petReminders = reminders.filter(r => r.petId === selectedPetId);

  const now = new Date();
  
  // Normalize dates to midnight to prevent hourly drift bugs
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  
  // End of today:
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  
  // End of week (today + 7 days):
  const endOfWeek = new Date(endOfToday.getTime() + 7 * 24 * 60 * 60 * 1000);

  petReminders.forEach(r => {
    if (r.completed) {
      grouped.done.push(r);
      return;
    }

    const due = new Date(r.dueAt);
    if (isNaN(due.getTime())) {
      grouped.later.push(r);
      return;
    }

    const dueStr = r.dueAt.split('T')[0];

    if (due.getTime() < startOfToday.getTime() && dueStr !== todayStr) {
      grouped.overdue.push(r);
    } else if (dueStr === todayStr || (due.getTime() >= startOfToday.getTime() && due.getTime() <= endOfToday.getTime())) {
      grouped.today.push(r);
    } else if (due.getTime() > endOfToday.getTime() && due.getTime() <= endOfWeek.getTime()) {
      grouped.thisWeek.push(r);
    } else {
      grouped.later.push(r);
    }
  });

  // Sort groups chronologically
  const sortByDateAsc = (a: Reminder, b: Reminder) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
  const sortByDateDesc = (a: Reminder, b: Reminder) => new Date(b.dueAt).getTime() - new Date(a.dueAt).getTime();

  grouped.overdue.sort(sortByDateAsc);
  grouped.today.sort(sortByDateAsc);
  grouped.thisWeek.sort(sortByDateAsc);
  grouped.later.sort(sortByDateAsc);
  grouped.done.sort(sortByDateDesc);

  return grouped;
}

export interface ReminderTemplate {
  title: string;
  category: ReminderCategory;
  recurrence: {
    frequency: 'once' | 'daily' | 'weekly' | 'monthly';
    interval?: number;
    weekdays?: number[];
  };
  notes: string;
}

export const TEMPLATES_BY_TYPE: Record<'dog' | 'cat', ReminderTemplate[]> = {
  dog: [
    {
      title: 'قرص ضد انگل دوره‌ای سگ',
      category: 'health',
      recurrence: { frequency: 'monthly', interval: 3 },
      notes: 'پیشگیری از عفونت‌های انگلی گوارشی با تجویز دامپزشک هر ۳ ماه یک‌بار'
    },
    {
      title: 'واکسیناسیون هاری سالانه سگ',
      category: 'appointment',
      recurrence: { frequency: 'monthly', interval: 12 },
      notes: 'تزریق واکسن هاری سالانه جهت حفظ ایمنی و سلامت عمومی سگ'
    },
    {
      title: 'حمام و نظافت موها',
      category: 'grooming',
      recurrence: { frequency: 'monthly', interval: 1 },
      notes: 'شستشو و شانه زدن عمیق موهای سگ برای حفظ لطافت و پیشگیری از ریزش'
    }
  ],
  cat: [
    {
      title: 'واکسن سه‌گانه سالانه گربه',
      category: 'appointment',
      recurrence: { frequency: 'monthly', interval: 12 },
      notes: 'پیشگیری از بیماری‌های عفونی با تزریق سالانه واکسن سه‌گانه گربه‌سانان'
    },
    {
      title: 'برس‌کشیدن موهای گربه',
      category: 'grooming',
      recurrence: { frequency: 'weekly', weekdays: [5] }, // Friday
      notes: 'برس‌کشیدن منظم موهای گربه برای کاهش بلعیدن مو و جلوگیری از تشکیل گوی مویی (هربال)'
    },
    {
      title: 'تجویز مالت گربه',
      category: 'nutrition',
      recurrence: { frequency: 'weekly', weekdays: [1, 4] }, // Mon, Thu
      notes: 'دادن خمیر مالت ضد هربال برای حفظ سلامتی گوارش گربه'
    }
  ]
};

export const UNIVERSAL_TEMPLATES: ReminderTemplate[] = [
  {
    title: 'پایش ماهیانه وزن پت',
    category: 'health',
    recurrence: { frequency: 'monthly', interval: 1 },
    notes: 'ثبت و پایش تغییرات وزن سگ یا گربه برای ارزیابی سلامت بدنی'
  },
  {
    title: 'کوتاه کردن ناخن‌ها',
    category: 'grooming',
    recurrence: { frequency: 'monthly', interval: 1 },
    notes: 'پیشگیری از رشد بی‌رویه و شکستگی ناخن‌های حیوان'
  }
];
