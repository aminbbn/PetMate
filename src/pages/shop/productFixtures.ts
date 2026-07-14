import { Product } from './shopTypes';

export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'prod-dry-food-dog',
    slug: 'super-premium-dry-food-dog',
    name: 'غذای خشک سگ بالغ سوپرپریمیوم رفلکس',
    brand: 'Reflex',
    category: 'food',
    shortDescription: 'غذای خشک کامل و متعادل برای سگ‌های بالغ تمام نژادها حاوی مرغ و برنج',
    description: 'این محصول با فرمولاسیون پیشرفته خود تمامی نیازهای غذایی سگ بالغ شما را برطرف می‌سازد. غنی از ویتامین‌ها و امگا ۳ و ۶ برای درخشندگی موها و تقویت سیستم ایمنی بدنی سگ‌ها. تولید شده در خطوط پیشرفته و با بالاترین استانداردهای بهداشتی اروپا.',
    media: [
      {
        id: 'img-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&q=80',
        alt: 'بسته غذای خشک سگ رفلکس'
      }
    ],
    price: {
      amount: 420000,
      currency: 'IRT',
      originalAmount: 480000,
      updatedAt: '2026-07-13T12:00:00Z'
    },
    availability: 'in_stock',
    sellerName: 'پت‌شاپ مرزداران',
    sellerId: 'seller-1',
    rating: {
      value: 4.8,
      reviewCount: 34,
      source: 'پت‌شاپ آریا'
    },
    compatibility: {
      species: ['dog'],
      lifeStages: ['adult'],
      sizeClasses: ['all'],
      requiresVeterinarianGuidance: false,
      sourceText: 'مناسب برای سگ‌های بالغ بالای ۱ سال'
    },
    attributes: {
      'وزن': '۳ کیلوگرم',
      'طعم': 'مرغ و برنج',
      'کشور سازنده': 'ترکیه',
      'درصد پروتئین': '۲۶٪'
    },
    sourceName: 'توزیع‌کننده رفلکس ایران',
    lastUpdatedAt: '2026-07-14T01:00:00Z'
  },
  {
    id: 'prod-joint-supplement',
    slug: 'pet-joint-glucosamine-supplement',
    name: 'مکمل تقویتی مفاصل سگ و گربه گلوکوزامین بوفار',
    brand: 'Beaphar',
    category: 'supplement',
    shortDescription: 'قرص غضروف‌ساز و تقویت‌کننده مفصل برای حیوانات مسن یا دارای مشکلات حرکتی',
    description: 'این مکمل حاوی مقادیر بالایی گلوکوزامین و کندرویتین بوده که نقش اساسی در روان‌سازی مفاصل و ترمیم غضروف‌های آسیب‌دیده ایفا می‌کند. مصرف این محصول به ویژه برای حیوانات سن بالا، نژادهای سنگین و حیواناتی که دچار آسیب مفصلی شده‌اند توصیه می‌شود.',
    media: [
      {
        id: 'img-2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=600&q=80',
        alt: 'قوطی مکمل مفاصل بوفار'
      }
    ],
    price: {
      amount: 285000,
      currency: 'IRT',
      originalAmount: 310000,
      updatedAt: '2026-07-13T12:00:00Z'
    },
    availability: 'in_stock',
    sellerName: 'داروخانه کلینیک آریا',
    sellerId: 'seller-vet',
    rating: {
      value: 4.9,
      reviewCount: 18,
      source: 'نظرات کلینیک تخصصی آریا'
    },
    compatibility: {
      species: ['dog', 'cat'],
      lifeStages: ['senior', 'adult'],
      sizeClasses: ['all'],
      requiresVeterinarianGuidance: true,
      sourceText: 'به دلیل دوز بالا، ترجیحاً با دوز پیشنهادی دامپزشک مصرف شود.'
    },
    attributes: {
      'تعداد در بسته': '۶۰ عدد',
      'نوع مصرف': 'خوراکی (قرص)',
      'ترکیبات اصلی': 'گلوکوزامین، کندرویتین، کلسیم',
      'کشور سازنده': 'هلند'
    },
    sourceName: 'پخش داروهای حیوانات خانگی امین',
    lastUpdatedAt: '2026-07-14T01:00:00Z'
  },
  {
    id: 'prod-puzzle-toy',
    slug: 'interactive-pet-puzzle-toy',
    name: 'اسباب‌بازی فکری تعاملی پازلی پت میت',
    brand: 'PetMate Craft',
    category: 'toy',
    shortDescription: 'بازی فکری مهارتی برای افزایش هوش و سرگرمی و تخلیه انرژی ذهنی پت شما',
    description: 'این اسباب‌بازی تعاملی مجهز به مخازن پنهان غذا و دکمه‌های کشویی متحرک است که پت باید با دست یا پوزه خود آن‌ها را جابجا کند تا به تشویقی پنهان شده دست یابد. عالی برای کاهش استرس، رفع کلافگی و افزایش تمرکز حیوانات خانگی.',
    media: [
      {
        id: 'img-3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&q=80',
        alt: 'اسباب‌بازی پازلی سگ و گربه'
      }
    ],
    price: {
      amount: 145000,
      currency: 'IRT',
      originalAmount: 145000,
      updatedAt: '2026-07-13T12:00:00Z'
    },
    availability: 'in_stock',
    sellerName: 'کارگاه تولیدی پت‌میت',
    sellerId: 'seller-2',
    rating: {
      value: 4.7,
      reviewCount: 42,
      source: 'خریداران پت‌میت'
    },
    compatibility: {
      species: ['dog', 'cat', 'universal'],
      lifeStages: ['all'],
      sizeClasses: ['all'],
      requiresVeterinarianGuidance: false,
      sourceText: 'بدون قطعات ریز جداشونده و کاملاً ایمن'
    },
    attributes: {
      'جنس': 'پلاستیک فشرده ABS غیرسمی',
      'ابعاد': '۲۵ × ۲۵ سانتی‌متر',
      'درجه سختی': 'متوسط (سطح ۲)',
      'مناسب برای': 'سگ و گربه'
    },
    sourceName: 'تولیدی لوازم حیوانات خانگی پت‌میت ایران',
    lastUpdatedAt: '2026-07-14T01:00:00Z'
  },
  {
    id: 'prod-shampoo-coconut',
    slug: 'natural-coconut-pet-shampoo',
    name: 'شامپو براق‌کننده طبیعی سگ و گربه لوری',
    brand: 'Lori',
    category: 'hygiene',
    shortDescription: 'شامپو فوق‌العاده نرم‌کننده با اسانس نارگیل برای سگ و گربه‌های با پوست حساس',
    description: 'شامپو ارگانیک لوری حاوی آلوئه‌ورا و روغن نارگیل طبیعی است که پوست خشک و خارش‌دار پت را التیام می‌بخشد و موهای آسیب‌دیده را عمیقاً آبرسانی می‌کند. فرمولاسیون بدون اشک این محصول استحمام را برای حیوان بسیار لذت‌بخش می‌کند.',
    media: [
      {
        id: 'img-4',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1608454367599-c133fcabfb65?w=600&q=80',
        alt: 'بطری شامپوی لوری'
      }
    ],
    price: {
      amount: 185000,
      currency: 'IRT',
      originalAmount: 195000,
      updatedAt: '2026-07-13T12:00:00Z'
    },
    availability: 'in_stock',
    sellerName: 'پت‌شاپ مرزداران',
    sellerId: 'seller-1',
    rating: {
      value: 4.6,
      reviewCount: 25,
      source: 'پت‌شاپ آریا'
    },
    compatibility: {
      species: ['dog', 'cat', 'universal'],
      lifeStages: ['all'],
      sizeClasses: ['all'],
      requiresVeterinarianGuidance: false,
      sourceText: 'فرمول متعادل برای pH پوست سگ و گربه'
    },
    attributes: {
      'حجم': '۲۵۰ میلی‌لیتر',
      'اسانس': 'نارگیل طبیعی',
      'نوع پوست': 'حساس و خشک',
      'بدون پارابن': 'بله'
    },
    sourceName: 'شرکت بهداشتی آرایشی دنیای حیوانات',
    lastUpdatedAt: '2026-07-14T01:00:00Z'
  },
  {
    id: 'prod-dry-food-cat',
    slug: 'urinary-care-cat-food',
    name: 'غذای خشک گربه مراقبت از مجاری ادراری (Urinary S/O) رویال کنین',
    brand: 'Royal Canin',
    category: 'food',
    shortDescription: 'غذای خشک تخصصی و درمانی جهت پیشگیری و حل سنگ‌های ادراری در گربه‌ها',
    description: 'غذای درمانی مجاری ادرار رویال کنین با رقیق کردن ادرار و تنظیم pH آن، به حل کردن سنگ‌های استروویت ادراری کمک کرده و مانع از تشکیل مجدد کریستال‌ها می‌شود. توجه: این یک غذای درمانی است و مصرف طولانی‌مدت آن باید حتماً تحت نظارت مستقیم دامپزشک باشد.',
    media: [
      {
        id: 'img-5',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&q=80',
        alt: 'بسته غذای خشک درمانی گربه رویال کنین'
      }
    ],
    price: {
      amount: 890000,
      currency: 'IRT',
      originalAmount: 950000,
      updatedAt: '2026-07-13T12:00:00Z'
    },
    availability: 'low_stock',
    sellerName: 'داروخانه کلینیک آریا',
    sellerId: 'seller-vet',
    rating: {
      value: 4.9,
      reviewCount: 51,
      source: 'کلینیک آریا داک'
    },
    compatibility: {
      species: ['cat'],
      lifeStages: ['adult', 'senior'],
      sizeClasses: ['all'],
      requiresVeterinarianGuidance: true,
      sourceText: 'فقط برای گربه‌های دچار مشکلات مجاری ادرار. پیش از خرید با دامپزشک هماهنگ کنید.'
    },
    attributes: {
      'وزن': '۱.۵ کیلوگرم',
      'نوع درمانی': 'Urinary Care S/O',
      'کشور سازنده': 'فرانسه',
      'طعم': 'مرغ و غلات'
    },
    sourceName: 'پخش دارو و مکمل تابان پت',
    lastUpdatedAt: '2026-07-14T01:00:00Z'
  },
  {
    id: 'prod-cat-scratching-post',
    slug: 'cozy-cat-scratching-post',
    name: 'اسکرچر استوانه‌ای کنفی ایستاده بزرگ نینجا',
    brand: 'Ninja Pet',
    category: 'toy',
    shortDescription: 'اسکرچر محکم و ایستاده با روکش طناب کنفی طبیعی برای گربه‌های پرانرژی',
    description: 'اسکرچر نینجا یک ابزار ضروری برای ارضای تمایل طبیعی گربه به چنگ زدن است. با ستون‌های مستحکم پوشیده شده از کنف مرغوب و پایه عریض سنگین که مانع از واژگونی سازه در حین استفاده گربه‌های بزرگ و سنگین‌وزن می‌شود. همراه با توپک آویزان سرگرم‌کننده.',
    media: [
      {
        id: 'img-6',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=600&q=80',
        alt: 'اسکرچر ایستاده گربه'
      }
    ],
    price: {
      amount: 320000,
      currency: 'IRT',
      originalAmount: 320000,
      updatedAt: '2026-07-13T12:00:00Z'
    },
    availability: 'in_stock',
    sellerName: 'پت‌شاپ مرزداران',
    sellerId: 'seller-1',
    rating: {
      value: 4.5,
      reviewCount: 16,
      source: 'خریداران دیجی‌کالا'
    },
    compatibility: {
      species: ['cat'],
      lifeStages: ['all'],
      sizeClasses: ['all'],
      requiresVeterinarianGuidance: false,
      sourceText: 'مناسب برای گربه‌های بالای ۳ ماه'
    },
    attributes: {
      'ارتفاع': '۶۵ سانتی‌متر',
      'قطر پایه': '۳۵ سانتی‌متر',
      'جنس ستون': 'طناب کنفی طبیعی درجه یک',
      'کشور سازنده': 'ایران'
    },
    sourceName: 'صنایع چوبی و تولید پت نینجا',
    lastUpdatedAt: '2026-07-14T01:00:00Z'
  },
  {
    id: 'prod-chew-treat-dog',
    slug: 'calcium-milk-dog-bone-treat',
    name: 'تشویقی استخوان ژلاتینی کلسیم و شیر سگ دنتاپت',
    brand: 'DentaPet',
    category: 'treat',
    shortDescription: 'تشویقی جویدنی طبیعی جهت جرم‌زدایی دندان‌ها و تقویت استخوان‌های سگ',
    description: 'استخوان‌های جویدنی دنتاپت تهیه شده از پروتئین غنی کلسیمی و شیر طبیعی، علاوه بر سرگرم کردن سگ شما برای ساعات طولانی، پلاک‌های دندانی را سایش داده و مانع از تشکیل جرم دندان و بوی بد دهان سگ می‌شوند. هضم آسان و طعم موردعلاقه سگ‌ها.',
    media: [
      {
        id: 'img-7',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&q=80',
        alt: 'استخوان جویدنی تشویقی سگ'
      }
    ],
    price: {
      amount: 95000,
      currency: 'IRT',
      originalAmount: 110000,
      updatedAt: '2026-07-13T12:00:00Z'
    },
    availability: 'in_stock',
    sellerName: 'پت‌شاپ مرزداران',
    sellerId: 'seller-1',
    rating: {
      value: 4.8,
      reviewCount: 29,
      source: 'پت‌شاپ مرزداران'
    },
    compatibility: {
      species: ['dog'],
      lifeStages: ['adult', 'puppy_kitten', 'senior'],
      sizeClasses: ['small', 'medium'],
      requiresVeterinarianGuidance: false,
      sourceText: 'مناسب برای سگ‌های کوچک و متوسط برای محافظت دندان'
    },
    attributes: {
      'تعداد در بسته': '۲ عدد',
      'طعم': 'شیر و خامه',
      'مناسب نژاد': 'کوچک و متوسط (تا ۲۰ کیلوگرم)',
      'خاصیت': 'ضد جرم و بوی بد دهان'
    },
    sourceName: 'دنیای تجارت دندان سگ ایرانیان',
    lastUpdatedAt: '2026-07-14T01:00:00Z'
  },
  {
    id: 'prod-orthopedic-bed',
    slug: 'orthopedic-memory-foam-pet-bed',
    name: 'تشک طبی و ارتوپدیک سگ و گربه خواب‌آسا',
    brand: 'KhabAsa',
    category: 'bed',
    shortDescription: 'جای خواب مموری فوم ضدخستگی مخصوص حیوانات خانگی مسن یا دچار دردهای مفصلی',
    description: 'تشک طبی خواب‌آسا با لایه داخلی فوم هوشمند (Memory Foam)، فشار وارده بر ستون فقرات و مفاصل پت را هنگام خواب به طور کامل خنثی می‌کند. ایده‌آل برای سگ‌ها و گربه‌های مسن، مبتلا به آرتریت یا دیسک کمر. رویه مخملی لطیف و زیپ‌دار قابل شستشو در ماشین لباسشویی.',
    media: [
      {
        id: 'img-8',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=600&q=80',
        alt: 'تشک خواب طبی سگ و گربه'
      }
    ],
    price: {
      amount: 680000,
      currency: 'IRT',
      originalAmount: 750000,
      updatedAt: '2026-07-13T12:00:00Z'
    },
    availability: 'out_of_stock',
    sellerName: 'پت‌شاپ مرزداران',
    sellerId: 'seller-1',
    rating: {
      value: 4.9,
      reviewCount: 11,
      source: 'خریداران مستقیم خواب‌آسا'
    },
    compatibility: {
      species: ['dog', 'cat', 'universal'],
      lifeStages: ['senior', 'all'],
      sizeClasses: ['all'],
      requiresVeterinarianGuidance: false,
      sourceText: 'مناسب برای تمامی سنین، به ویژه حیوانات مسن'
    },
    attributes: {
      'ابعاد': '۷۰ × ۵۰ × ۱۰ سانتی‌متر',
      'جنس لایه داخلی': 'مموری فوم هوشمند ارتوپدیک',
      'رویه زیپ‌دار': 'بله (قابل شستشو)',
      'ضد لغزش کف': 'بله'
    },
    sourceName: 'گروه صنعتی خواب‌آسا ایران',
    lastUpdatedAt: '2026-07-14T01:00:00Z'
  }
];
