import { PetService } from './navigatorTypes';

export const DEMO_SERVICES: PetService[] = [
  {
    id: 'demo-1',
    name: 'بیمارستان دامپزشکی شبانه‌روزی البرز (نمایشی)',
    categories: ['veterinary_hospital', 'veterinary_clinic'],
    specialties: ['اورژانس ۲۴ ساعته', 'جراحی تخصصی', 'رادیولوژی', 'داروخانه مجهز'],
    address: 'تهران، خیابان آزادی، بعد از میدان انقلاب، پلاک ۴۱۲',
    city: 'تهران',
    district: 'انقلاب',
    coordinates: {
      latitude: 35.7012,
      longitude: 51.3912
    },
    phone: '02166098765',
    website: 'https://alborz-vet-demo.ir',
    openingHours: {
      timeZone: 'Asia/Tehran',
      periods: Array.from({ length: 7 }, (_, i) => ({
        day: i,
        open: '00:00',
        close: '23:59'
      }))
    },
    emergencyCapability: true,
    emergencyVerifiedAt: '2026-06-15T12:00:00Z',
    rating: {
      value: 4.8,
      reviewCount: 124,
      source: 'نظرات کاربران پت میت'
    },
    description: 'دارای بخش اورژانس فوق‌تخصصی، جراحی حیوانات کوچک و مراقبت‌های ویژه شبانه‌روزی.',
    amenities: ['پارکینگ اختصاصی', 'داروخانه ۲۴ ساعته', 'بستری تخصصی'],
    sourceName: 'دایرکتوری توسعه پت میت',
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-06-20T10:00:00Z'
  },
  {
    id: 'demo-2',
    name: 'کلینیک دامپزشکی و مرکز واکسیناسیون آریا (نمایشی)',
    categories: ['veterinary_clinic'],
    specialties: ['داخلی', 'واکسیناسیون', 'دندانپزشکی پت', 'چکاپ دوره‌ای'],
    address: 'تهران، بلوار کشاورز، خیابان وصال شیرازی، ساختمان پزشکان پارس',
    city: 'تهران',
    district: 'بلوار کشاورز',
    coordinates: {
      latitude: 35.7125,
      longitude: 51.4012
    },
    phone: '02188901234',
    website: 'https://arya-clinic-demo.ir',
    openingHours: {
      timeZone: 'Asia/Tehran',
      periods: Array.from({ length: 6 }, (_, i) => ({
        day: i + 1 === 7 ? 0 : i + 1, // Saturday to Thursday (closed Fridays)
        open: '09:00',
        close: '21:00'
      }))
    },
    emergencyCapability: false,
    rating: {
      value: 4.6,
      reviewCount: 48,
      source: 'دامپزشکان همکار پت میت'
    },
    description: 'کلینیک واکسیناسیون، معاینه دوره‌ای، مشاوره تغذیه و جرم‌گیری دندان مجهز به ابزار پیشرفته.',
    amenities: ['پت‌شاپ کوچک ملزومات', 'نوبت‌دهی آنلاین'],
    sourceName: 'دایرکتوری توسعه پت میت',
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-07-01T08:00:00Z'
  },
  {
    id: 'demo-3',
    name: 'پت شاپ جامع مانی (نمایشی)',
    categories: ['pet_shop'],
    specialties: ['غذا و مکمل', 'لوازم بهداشتی', 'اسباب‌بازی هوشمند'],
    address: 'تهران، تهرانپارس، فلکه اول، خیابان بهار، پلاک ۸۵',
    city: 'تهران',
    district: 'تهرانپارس',
    coordinates: {
      latitude: 35.7285,
      longitude: 51.4421
    },
    phone: '02177889900',
    website: 'https://mani-petshop-demo.ir',
    openingHours: {
      timeZone: 'Asia/Tehran',
      periods: Array.from({ length: 7 }, (_, i) => ({
        day: i,
        open: '10:00',
        close: '22:00'
      }))
    },
    emergencyCapability: false,
    rating: {
      value: 4.5,
      reviewCount: 92,
      source: 'بررسی عمومی گوگل مپ'
    },
    description: 'تنوع بی‌نظیر بیش از ۱۰۰ برند غذای خشک و مرطوب، اسباب‌بازی‌های هوشمند، باکس حمل، قلاده و پوشاک.',
    amenities: ['ارسال فوری درون‌شهری', 'مشاوره خرید کالا'],
    sourceName: 'دایرکتوری توسعه پت میت',
    verificationStatus: 'community_reported',
    lastVerifiedAt: '2026-05-18T14:30:00Z'
  },
  {
    id: 'demo-4',
    name: 'پانسیون شبانه‌روزی و هتل تخصصی آرامش (نمایشی)',
    categories: ['boarding'],
    specialties: ['نگهداری ۲۴ ساعته', 'دوربین آنلاین اختصاصی', 'برنامه تعامل و بازی'],
    address: 'تهران، بزرگراه همت، خروجی شهرک غرب، خیابان مهستان، کوچه چهارم',
    city: 'تهران',
    district: 'شهرک غرب',
    coordinates: {
      latitude: 35.7512,
      longitude: 51.3712
    },
    phone: '02188096543',
    openingHours: {
      timeZone: 'Asia/Tehran',
      periods: Array.from({ length: 7 }, (_, i) => ({
        day: i,
        open: '08:00',
        close: '20:00'
      }))
    },
    emergencyCapability: false,
    rating: {
      value: 4.9,
      reviewCount: 37,
      source: 'امتیازدهی درون‌برنامه‌ای پت میت'
    },
    description: 'محیطی امن و خانگی همراه با مربی رفتارشاس، اتاق‌های تفکیک‌شده و مجهز به دوربین مداربسته ۲۴ ساعته برای صاحب حیوان.',
    amenities: ['تهویه مطبوع مجهز', 'پزشک مقیم هفتگی', 'بازی‌های حسی'],
    sourceName: 'دایرکتوری توسعه پت میت',
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-06-30T16:00:00Z'
  },
  {
    id: 'demo-5',
    name: 'سالن آرایش و نظافت تخصصی پت شاین (نمایشی)',
    categories: ['grooming'],
    specialties: ['اصلاح تخصصی', 'شستشو و گندزدایی مجهز', 'آرایش ناخن و پنجه'],
    address: 'تهران، سعادت آباد، خیابان علامه طباطبایی جنوبی، پلاک ۴۴',
    city: 'تهران',
    district: 'سعادت آباد',
    coordinates: {
      latitude: 35.7821,
      longitude: 51.3812
    },
    phone: '02188123456',
    openingHours: {
      timeZone: 'Asia/Tehran',
      periods: Array.from({ length: 6 }, (_, i) => ({
        day: i === 6 ? 0 : i + 1, // Close Fridays or customized
        open: '11:00',
        close: '19:00'
      }))
    },
    emergencyCapability: false,
    rating: {
      value: 4.7,
      reviewCount: 56,
      source: 'نظرات تأییدشده دامپزشکان'
    },
    description: 'اصلاح و پیرایش موی سگ و گربه با قیچی توسط آرایشگران مجرب، شستشوی دارویی و تخلیه کیسه مقعدی و کوتاهی تخصصی ناخن.',
    amenities: ['اتاق انتظار شیشه‌ای', 'تجهیزات ضدعفونی مجهز'],
    sourceName: 'دایرکتوری توسعه پت میت',
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-07-05T11:00:00Z'
  },
  {
    id: 'demo-6',
    name: 'پارک بازی مخصوص حیوانات باغ ایرانی (نمایشی)',
    categories: ['park'],
    specialties: ['محوطه فنس‌کشی شده', 'موانع چابکی سگ‌ها', 'آبخوری مخصوص حیوانات'],
    address: 'تهران، ده ونک، خیابان صابری، باغ بزرگ ایرانی',
    city: 'تهران',
    district: 'ده ونک',
    coordinates: {
      latitude: 35.7645,
      longitude: 51.3998
    },
    openingHours: {
      timeZone: 'Asia/Tehran',
      periods: Array.from({ length: 7 }, (_, i) => ({
        day: i,
        open: '07:00',
        close: '23:00'
      }))
    },
    emergencyCapability: false,
    rating: {
      value: 4.7,
      reviewCount: 156,
      source: 'بررسی عمومی گوگل مپ'
    },
    description: 'پارک طبیعی و زیبای باغ ایرانی دارای محوطه فنس‌کشی شده و امن جهت بازی سگ‌ها بدون قلاده و تعامل با هم‌نوعان.',
    amenities: ['سرویس بهداشتی', 'نیمکت استراحت', 'کیسه پلاستیکی رایگان'],
    sourceName: 'دایرکتوری توسعه پت میت',
    verificationStatus: 'unverified',
    lastVerifiedAt: '2026-04-10T15:00:00Z'
  },
  {
    id: 'demo-7',
    name: 'آزمایشگاه تخصصی دامپزشکی فردا (نمایشی)',
    categories: ['laboratory'],
    specialties: ['آزمایش خون', 'انگل‌شناسی', 'پاتولوژی', 'ژنتیک حیوانات'],
    address: 'تهران، خیابان فاطمی، بن‌بست شفق، پلاک ۱۰',
    city: 'تهران',
    district: 'فاطمی',
    coordinates: {
      latitude: 35.7234,
      longitude: 51.4087
    },
    phone: '02188443322',
    openingHours: {
      timeZone: 'Asia/Tehran',
      periods: Array.from({ length: 6 }, (_, i) => ({
        day: i + 1 === 7 ? 0 : i + 1,
        open: '08:00',
        close: '18:00'
      }))
    },
    emergencyCapability: false,
    rating: {
      value: 4.4,
      reviewCount: 22,
      source: 'امتیازدهی کلینیک‌ها'
    },
    description: 'کامل‌ترین و سریع‌ترین آزمایشگاه پاتولوژی و تشخیص دامپزشکی ویژه حیوانات کوچک در ایران.',
    sourceName: 'دایرکتوری توسعه پت میت',
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-07-02T13:00:00Z'
  },
  {
    id: 'demo-8',
    name: 'مرکز تصویربرداری و رادیولوژی تخصصی نگاه (نمایشی)',
    categories: ['imaging'],
    specialties: ['سونوگرافی داپلر', 'رادیولوژی دیجیتال', 'سی‌تی اسکن حیوانات'],
    address: 'تهران، خیابان گاندی جنوبی، کوچه هجدهم، پلاک ۹',
    city: 'تهران',
    district: 'گاندی',
    coordinates: {
      latitude: 35.7567,
      longitude: 51.4198
    },
    phone: '02188776655',
    openingHours: {
      timeZone: 'Asia/Tehran',
      periods: Array.from({ length: 6 }, (_, i) => ({
        day: i + 1 === 7 ? 0 : i + 1,
        open: '08:30',
        close: '20:00'
      }))
    },
    emergencyCapability: true,
    emergencyVerifiedAt: '2026-06-25T11:00:00Z',
    rating: {
      value: 4.8,
      reviewCount: 39,
      source: 'نظرات دامپزشکان معتمد'
    },
    description: 'مجهزترین مرکز رادیولوژی و تصویربرداری تشخیصی حیوانات با حضور متخصص رادیولوژی دامپزشکی.',
    amenities: ['نوبت‌دهی اضطراری', 'ارسال تلگرامی تصاویر'],
    sourceName: 'دایرکتوری توسعه پت میت',
    verificationStatus: 'verified',
    lastVerifiedAt: '2026-07-08T09:30:00Z'
  }
];
