import { CanonicalProduct, ProductVariant, Merchant, MerchantOffer } from './catalogTypes';

export const CANONICAL_PRODUCTS: CanonicalProduct[] = [
  {
    id: 'prod-dry-food-dog',
    slug: 'super-premium-dry-food-dog',
    name: 'غذای خشک سگ بالغ سوپرپریمیوم رفلکس',
    brand: 'Reflex',
    category: 'food',
    shortDescription: 'غذای خشک کامل و متعادل برای سگ‌های بالغ تمام نژادها حاوی مرغ و برنج',
    description: 'این محصول با فرمولاسیون پیشرفته خود تمامی نیازهای غذایی سگ بالغ را پوشش می‌دهد. غنی از ویتامین‌ها و امگا ۳ و ۶ برای درخشندگی موها و تقویت سیستم ایمنی بدنی سگ‌ها. تولید شده در کشور ترکیه با بالاترین استانداردهای بهداشتی اروپا.',
    media: [
      {
        id: 'img-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&q=80',
        alt: 'بسته غذای خشک سگ رفلکس'
      }
    ],
    attributes: {
      'وزن': '۳ کیلوگرم',
      'طعم': 'مرغ و برنج',
      'کشور سازنده': 'ترکیه',
      'درصد پروتئین': '۲۶٪'
    },
    species: ['dog'],
    lifeStages: ['adult'],
    requiresVeterinarianGuidance: false,
    gtin: '8690967011012',
    createdAt: '2026-07-10T10:00:00Z',
    updatedAt: '2026-07-14T20:00:00Z'
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
    attributes: {
      'تعداد در بسته': '۶۰ عدد',
      'نوع مصرف': 'خوراکی (قرص)',
      'ترکیبات اصلی': 'گلوکوزامین، کندرویتین، کلسیم',
      'کشور سازنده': 'هلند'
    },
    species: ['dog', 'cat', 'universal'],
    lifeStages: ['senior', 'adult'],
    requiresVeterinarianGuidance: true,
    guidanceText: 'به دلیل دوز بالا، ترجیحاً با دوز پیشنهادی دامپزشک مصرف شود.',
    gtin: '8711231124404',
    createdAt: '2026-07-10T10:00:00Z',
    updatedAt: '2026-07-14T20:00:00Z'
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
    attributes: {
      'جنس': 'پلاستیک فشرده ABS غیرسمی',
      'ابعاد': '۲۵ × ۲۵ سانتی‌متر',
      'درجه سختی': 'متوسط (سطح ۲)',
      'مناسب برای': 'سگ و گربه'
    },
    species: ['dog', 'cat', 'universal'],
    lifeStages: ['all'],
    requiresVeterinarianGuidance: false,
    mpn: 'PM-PUZZLE-2',
    createdAt: '2026-07-10T10:00:00Z',
    updatedAt: '2026-07-14T20:00:00Z'
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
    attributes: {
      'حجم': '۲۵۰ میلی‌لیتر',
      'اسانس': 'نارگیل طبیعی',
      'نوع پوست': 'حساس و خشک',
      'بدون پارابن': 'بله'
    },
    species: ['dog', 'cat', 'universal'],
    lifeStages: ['all'],
    requiresVeterinarianGuidance: false,
    gtin: '6260111223344',
    createdAt: '2026-07-10T10:00:00Z',
    updatedAt: '2026-07-14T20:00:00Z'
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
    attributes: {
      'وزن': '۱.۵ کیلوگرم',
      'نوع درمانی': 'Urinary Care S/O',
      'کشور سازنده': 'فرانسه',
      'طعم': 'مرغ و غلات'
    },
    species: ['cat'],
    lifeStages: ['adult', 'senior'],
    requiresVeterinarianGuidance: true,
    guidanceText: 'فقط برای گربه‌های دچار مشکلات مجاری ادرار. پیش از خرید حتماً با دامپزشک مشورت نمایید.',
    gtin: '3182550711124',
    createdAt: '2026-07-10T10:00:00Z',
    updatedAt: '2026-07-14T20:00:00Z'
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
    attributes: {
      'ارتفاع': '۶۵ سانتی‌متر',
      'قطر پایه': '۳۵ سانتی‌متر',
      'جنس ستون': 'طناب کنفی طبیعی درجه یک',
      'کشور سازنده': 'ایران'
    },
    species: ['cat'],
    lifeStages: ['all'],
    requiresVeterinarianGuidance: false,
    mpn: 'NJ-SCRATCH-L',
    createdAt: '2026-07-10T10:00:00Z',
    updatedAt: '2026-07-14T20:00:00Z'
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
    attributes: {
      'تعداد در بسته': '۲ عدد',
      'طعم': 'شیر و خامه',
      'مناسب نژاد': 'کوچک و متوسط (تا ۲۰ کیلوگرم)',
      'خاصیت': 'ضد جرم و بوی بد دهان'
    },
    species: ['dog'],
    lifeStages: ['adult', 'puppy_kitten', 'senior'],
    requiresVeterinarianGuidance: false,
    gtin: '6901112223334',
    createdAt: '2026-07-10T10:00:00Z',
    updatedAt: '2026-07-14T20:00:00Z'
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
    attributes: {
      'ابعاد': '۷۰ × ۵۰ × ۱۰ سانتی‌متر',
      'جنس لایه داخلی': 'مموری فوم هوشمند ارتوپدیک',
      'رویه زیپ‌دار': 'بله (قابل شستشو)',
      'ضد لغزش کف': 'بله'
    },
    species: ['dog', 'cat', 'universal'],
    lifeStages: ['senior', 'all'],
    requiresVeterinarianGuidance: false,
    gtin: '6261234567890',
    createdAt: '2026-07-10T10:00:00Z',
    updatedAt: '2026-07-14T20:00:00Z'
  }
];

export const MERCHANTS: Merchant[] = [
  {
    id: 'merchant-marzdaran',
    name: 'پت‌شاپ مرزداران (نمایشی)',
    logoUrl: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=80&q=80',
    websiteUrl: 'https://marzdaran-pet-demo.ir',
    providerId: 'marzdaran-adapter',
    isActive: true,
    isAffiliatePartner: false,
    disclosureText: 'اطلاعات و موجودی این فروشگاه همگام‌سازی شده است.'
  },
  {
    id: 'merchant-aria-vet',
    name: 'داروخانه کلینیک آریا (نمایشی)',
    logoUrl: 'https://images.unsplash.com/photo-1584132967334-10e02bd63557?w=80&q=80',
    websiteUrl: 'https://aria-vet-pharmacy-demo.ir',
    providerId: 'aria-vet-adapter',
    isActive: true,
    isAffiliatePartner: false,
    disclosureText: 'خرید داروها و مکمل‌های تخصصی در محل کلینیک نهایی می‌گردد.'
  },
  {
    id: 'merchant-yooz',
    name: 'پت‌شاپ آنلاین یوز (نمایشی)',
    logoUrl: 'https://images.unsplash.com/photo-1535268647977-a403b69fc756?w=80&q=80',
    websiteUrl: 'https://yooz-pet-demo.com',
    providerId: 'yooz-pet-adapter',
    isActive: true,
    isAffiliatePartner: true,
    disclosureText: 'لینک همکاری با فروشگاه فعال است؛ پت میت ممکن است کمیسیون دریافت کند.'
  }
];

export const PRODUCT_VARIANTS: ProductVariant[] = [];

export const MERCHANT_OFFERS: MerchantOffer[] = [
  {
    id: 'offer-dry-food-marzdaran',
    merchantId: 'merchant-marzdaran',
    productId: 'prod-dry-food-dog',
    externalProductId: 'ext-reflex-3kg-marz',
    externalUrl: 'https://marzdaran-pet-demo.ir/products/reflex-dry-food-dog-3kg',
    price: { amount: 420000, currency: 'IRT' },
    originalPrice: { amount: 480000, currency: 'IRT' },
    availability: 'in_stock',
    shippingText: 'ارسال فوری پیک در تهران (۴۵ دقیقه)',
    sellerText: 'پت‌شاپ فیزیکی مرزداران',
    fetchedAt: '2026-07-15T02:00:00Z',
    sourceCurrencyUnit: 'IRT'
  },
  {
    id: 'offer-dry-food-yooz',
    merchantId: 'merchant-yooz',
    productId: 'prod-dry-food-dog',
    externalProductId: 'ext-reflex-3kg-yooz',
    externalUrl: 'https://yooz-pet-demo.com/product/reflex-dog-adult-3kg',
    affiliateUrl: 'https://yooz-pet-demo.com/product/reflex-dog-adult-3kg?aff=petmate',
    price: { amount: 410000, currency: 'IRT' },
    originalPrice: { amount: 450000, currency: 'IRT' },
    availability: 'in_stock',
    shippingText: 'ارسال رایگان پست پیشتاز به کل کشور',
    sellerText: 'پت‌شاپ آنلاین یوز',
    fetchedAt: '2026-07-15T02:00:00Z',
    sourceCurrencyUnit: 'IRT'
  },
  {
    id: 'offer-supplement-aria',
    merchantId: 'merchant-aria-vet',
    productId: 'prod-joint-supplement',
    externalProductId: 'ext-beaphar-joint-aria',
    externalUrl: 'https://aria-vet-pharmacy-demo.ir/items/beaphar-joint-tablets',
    price: { amount: 285000, currency: 'IRT' },
    originalPrice: { amount: 310000, currency: 'IRT' },
    availability: 'in_stock',
    shippingText: 'تحویل حضوری در کلینیک یا ارسال اسنپ‌باکس',
    sellerText: 'داروخانه کلینیک دامپزشکی آریا',
    fetchedAt: '2026-07-15T02:00:00Z',
    sourceCurrencyUnit: 'IRT'
  },
  {
    id: 'offer-supplement-marzdaran',
    merchantId: 'merchant-marzdaran',
    productId: 'prod-joint-supplement',
    externalProductId: 'ext-beaphar-joint-marz',
    externalUrl: 'https://marzdaran-pet-demo.ir/products/beaphar-joint-glucosamine-60t',
    price: { amount: 295000, currency: 'IRT' },
    availability: 'low_stock',
    shippingText: 'ارسال فوری تهران',
    sellerText: 'پت‌شاپ مرزداران',
    fetchedAt: '2026-07-15T02:00:00Z',
    sourceCurrencyUnit: 'IRT'
  },
  {
    id: 'offer-toy-marzdaran',
    merchantId: 'merchant-marzdaran',
    productId: 'prod-puzzle-toy',
    externalProductId: 'ext-pm-puzzle-marz',
    externalUrl: 'https://marzdaran-pet-demo.ir/products/petmate-puzzle-toy',
    price: { amount: 145000, currency: 'IRT' },
    availability: 'in_stock',
    shippingText: 'ارسال فوری پیک تهران',
    fetchedAt: '2026-07-15T02:00:00Z',
    sourceCurrencyUnit: 'IRT'
  },
  {
    id: 'offer-shampoo-marzdaran',
    merchantId: 'merchant-marzdaran',
    productId: 'prod-shampoo-coconut',
    externalProductId: 'ext-lori-shampoo-marz',
    externalUrl: 'https://marzdaran-pet-demo.ir/products/lori-coconut-shampoo-250',
    price: { amount: 185000, currency: 'IRT' },
    originalPrice: { amount: 195000, currency: 'IRT' },
    availability: 'in_stock',
    shippingText: 'ارسال پستی یا پیک تهران',
    fetchedAt: '2026-07-15T02:00:00Z',
    sourceCurrencyUnit: 'IRT'
  },
  {
    id: 'offer-shampoo-yooz',
    merchantId: 'merchant-yooz',
    productId: 'prod-shampoo-coconut',
    externalProductId: 'ext-lori-shampoo-yooz',
    externalUrl: 'https://yooz-pet-demo.com/product/lori-shampoo-natural-coconut',
    affiliateUrl: 'https://yooz-pet-demo.com/product/lori-shampoo-natural-coconut?aff=petmate',
    price: { amount: 180000, currency: 'IRT' },
    availability: 'in_stock',
    shippingText: 'ارسال سراسری پست پیشتاز',
    fetchedAt: '2026-07-15T02:00:00Z',
    sourceCurrencyUnit: 'IRT'
  },
  {
    id: 'offer-cat-food-aria',
    merchantId: 'merchant-aria-vet',
    productId: 'prod-dry-food-cat',
    externalProductId: 'ext-rc-urinary-aria',
    externalUrl: 'https://aria-vet-pharmacy-demo.ir/items/royal-canin-urinary-so-1_5',
    price: { amount: 890000, currency: 'IRT' },
    originalPrice: { amount: 950000, currency: 'IRT' },
    availability: 'low_stock',
    shippingText: 'تحویل حضوری یا پیک',
    sellerText: 'داروخانه کلینیک آریا',
    fetchedAt: '2026-07-15T02:00:00Z',
    sourceCurrencyUnit: 'IRT'
  },
  {
    id: 'offer-cat-scratching-marzdaran',
    merchantId: 'merchant-marzdaran',
    productId: 'prod-cat-scratching-post',
    externalProductId: 'ext-ninja-scratch-marz',
    externalUrl: 'https://marzdaran-pet-demo.ir/products/ninja-cat-scratching-post-large',
    price: { amount: 320000, currency: 'IRT' },
    availability: 'in_stock',
    shippingText: 'ارسال با اسنپ‌وانت (هزینه با مشتری)',
    fetchedAt: '2026-07-15T02:00:00Z',
    sourceCurrencyUnit: 'IRT'
  },
  {
    id: 'offer-bone-treat-marzdaran',
    merchantId: 'merchant-marzdaran',
    productId: 'prod-chew-treat-dog',
    externalProductId: 'ext-dentapet-bone-marz',
    externalUrl: 'https://marzdaran-pet-demo.ir/products/dentapet-calcium-milk-bones',
    price: { amount: 95000, currency: 'IRT' },
    originalPrice: { amount: 110000, currency: 'IRT' },
    availability: 'in_stock',
    shippingText: 'ارسال پستی یا پیک',
    fetchedAt: '2026-07-15T02:00:00Z',
    sourceCurrencyUnit: 'IRT'
  },
  {
    id: 'offer-bed-marzdaran',
    merchantId: 'merchant-marzdaran',
    productId: 'prod-orthopedic-bed',
    externalProductId: 'ext-khabasa-bed-marz',
    externalUrl: 'https://marzdaran-pet-demo.ir/products/khabasa-orthopedic-foam-bed',
    price: { amount: 680000, currency: 'IRT' },
    originalPrice: { amount: 750000, currency: 'IRT' },
    availability: 'out_of_stock',
    shippingText: 'ناموجود در انبار فعلی',
    fetchedAt: '2026-07-15T02:00:00Z',
    sourceCurrencyUnit: 'IRT'
  }
];
