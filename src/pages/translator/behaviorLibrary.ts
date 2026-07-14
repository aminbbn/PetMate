import { BehaviorSignal, BehaviorSignalCategory, BehaviorContext } from './behaviorTypes';

export const CATEGORY_LABELS: Record<BehaviorSignalCategory, { label: string; icon: string }> = {
  vocal: { label: 'آواها و صداها', icon: '🔊' },
  body_posture: { label: 'ژست و فرم بدن', icon: '🐕' },
  tail_ears: { label: 'وضعیت دم و گوش‌ها', icon: '🐾' },
  social_interaction: { label: 'تعاملات اجتماعی', icon: '🤝' },
  autonomic: { label: 'سیگنال‌های خودکار فیزیکی', icon: '⚡' }
};

export const CONTEXT_LABELS: Record<BehaviorContext, string> = {
  resting: 'هنگام استراحت یا خوابیدن',
  eating: 'هنگام غذا خوردن یا جویدن',
  play: 'در حین بازی و فعالیت تفریحی',
  greeting: 'زمان خوش‌آمدگویی و دیدار سرپرست',
  unfamiliar_environment: 'در محیط غریب یا بیرون از خانه',
  veterinary_visit: 'در کلینیک یا حین معاینه پزشکی',
  other: 'شرایط عادی روزمره'
};

export const BEHAVIOR_LIBRARY: BehaviorSignal[] = [
  // DOG SIGNALS
  {
    id: 'dog_play_bow',
    species: 'dog',
    category: 'body_posture',
    name: 'خم شدن روی دست‌ها با باسن بالا (Play Bow)',
    description: 'سگ دست‌های خود را روی زمین می‌خواباند در حالی که نیمه عقبی بدنش بالا قرار دارد و ممکن است دمش را تکان دهد.',
    possibleMeanings: [
      { meaning: 'دعوت قاطع به بازی و ابراز شادابی عصبی', probabilityHint: 'high', contextRequired: 'حضور سرپرست یا سگ دیگر' },
      { meaning: 'تلاش برای تلطیف جو و نشان دادن صلح‌طلبی در تعاملات اجتماعی', probabilityHint: 'medium' }
    ],
    isRedFlag: false,
    safeResponseAdvice: 'این یک رفتار صد در صد مثبت و ایمن است. با اسباب‌بازی یا حرکت‌های پرشور پاسخ دهید تا انرژی پت تخلیه شود.'
  },
  {
    id: 'dog_tail_lowered',
    species: 'dog',
    category: 'tail_ears',
    name: 'دم پایین یا پنهان بین پاها',
    description: 'دم سگ کاملاً پایین آورده شده و به شکم چسبیده یا بین دو پای عقب فشرده شده است.',
    possibleMeanings: [
      { meaning: 'ترس شدید، عدم امنیت عاطفی یا تسلیم شدن در برابر عامل تهدید', probabilityHint: 'high', contextRequired: 'محیط شلوغ یا صدای بلند' },
      { meaning: 'احساس درد فیزیکی یا ضعف بدنی عمومی', probabilityHint: 'medium', contextRequired: 'بدون محرک ترس آشکار' }
    ],
    isRedFlag: false,
    safeResponseAdvice: 'پت را از محرک‌های ترس‌آور دور کنید. هرگز او را برای این حالت تنبیه نکنید و با ایجاد فضایی آرام و صدای ملایم به او امنیت بدهید.'
  },
  {
    id: 'dog_lip_licking',
    species: 'dog',
    category: 'social_interaction',
    name: 'زبان زدن مکرر به پوزه یا لب‌ها (Licking)',
    description: 'سگ در حالتی که غذا یا آب در اطرافش نیست، به طور مکرر و سریع زبانش را به دور پوزه خود می‌کشد.',
    possibleMeanings: [
      { meaning: 'نشان دادن صلح‌جویی و تسکین استرس خود (Appeasement Signal)', probabilityHint: 'high', contextRequired: 'تعامل با انسان غریبه یا سرزنش شدن' },
      { meaning: 'حالت تهوع یا ناراحتی گوارشی اولیه', probabilityHint: 'medium', contextRequired: 'بعد از مصرف غذا یا داروی خاص' }
    ],
    isRedFlag: false,
    safeResponseAdvice: 'این سیگنال یعنی سگ احساس ناامنی یا فشار روانی می‌کند. به او فضا بدهید، فاصله‌تان را حفظ کنید و لحن صحبت خود را نرم‌تر کنید.'
  },
  {
    id: 'dog_yawning_stressed',
    species: 'dog',
    category: 'autonomic',
    name: 'خمیازه کشیدن در شرایط غیرخستگی',
    description: 'سگ در اواسط یک فعالیت یا در شرایط استرس‌زا شروع به خمیازه کشیدن‌های پی‌درپی و عمیق می‌کند.',
    possibleMeanings: [
      { meaning: 'تلاش فعال برای تخلیه تنش عاطفی و کاهش سطح آدرنالین بدنی', probabilityHint: 'high', contextRequired: 'حین آموزش سخت یا محیط ناآشنا' },
      { meaning: 'خستگی فیزیکی عادی یا خواب‌آلودگی طبیعی', probabilityHint: 'medium', contextRequired: 'انتهای روز یا پس از بازی طولانی' }
    ],
    isRedFlag: false,
    safeResponseAdvice: 'آموزش یا موقعیت تنش‌زا را موقتاً متوقف کنید. اجازه دهید حیوان کمی آب بنوشد یا در مکانی دنج به حالت آرامش بازگردد.'
  },
  {
    id: 'dog_panting_unusual',
    species: 'dog',
    category: 'autonomic',
    name: 'له‌له زدن مداوم بدون فعالیت بدنی یا گرما',
    description: 'سگ به شدت و با ریتم تند نفس‌نفس می‌زند در حالی که دما مناسب است و او استراحت می‌کرده است.',
    possibleMeanings: [
      { meaning: 'احساس درد شدید در نواحی داخلی، شکم یا مفاصل', probabilityHint: 'high', contextRequired: 'همراه با بی‌قراری و ناله خفیف' },
      { meaning: 'اضطراب محیطی شدید، ترس یا فوبیای صداها', probabilityHint: 'high', contextRequired: 'صدای رعد و برق یا ترقه' }
    ],
    isRedFlag: false,
    safeResponseAdvice: 'دمای محیط را بررسی کنید. در صورت خنک بودن فضا، سگ را لمس کنید تا نقطه درد را پیدا کنید. در صورت تداوم، مشورت با دامپزشک الزامی است.'
  },
  {
    id: 'dog_head_pressing',
    species: 'dog',
    category: 'body_posture',
    name: 'فشردن پیشانی به دیوار یا سطوح سفت (Head Pressing)',
    description: 'سگ سر یا پیشانی خود را به طور مداوم و بدون دلیل فیزیکی واضح به دیوار، گوشه اتاق یا هر سطح سختی فشار می‌دهد و خیره می‌ماند.',
    possibleMeanings: [
      { meaning: 'بیماری شدید مغزی مغز، مسمومیت کبدی حاد (شنت پورتوسیستمیک)، عفونت عصبی یا تومور مغزی', probabilityHint: 'high' }
    ],
    isRedFlag: true,
    redFlagDetails: 'توجه: این یک فوریت پزشکی حاد و جدی است. فشردن پیشانی به دیوار نشان‌دهنده آسیب شدید سیستم اعصاب مرکزی است و به هیچ عنوان یک رفتار طبیعی، بازی یا قهر کردن نیست.',
    safeResponseAdvice: 'فوراً و بدون اتلاف وقت سگ خود را به یک بیمارستان دامپزشکی مجهز جهت ارزیابی عصبی و آزمایش خون برسانید.'
  },
  {
    id: 'dog_disorientation',
    species: 'dog',
    category: 'body_posture',
    name: 'گیجی، از دست رفتن تعادل و تلوتلو خوردن',
    description: 'سگ تعادل حرکتی خود را از دست داده، چشمانش دودو می‌زنند (نیستاگموس) یا به صورت مارپیچ حرکت کرده و پاهایش سست می‌شوند.',
    possibleMeanings: [
      { meaning: 'مسمومیت دارویی/سمی حاد، سندرم وستیبولار، تشنج خاموش یا سکته مغزی', probabilityHint: 'high' }
    ],
    isRedFlag: true,
    redFlagDetails: 'توجه: تلوتلو خوردن ناگهانی یا افتادن می‌تواند نشان از افت شدید قند خون، شوک قلبی، مسمومیت شدید یا آسیب مغزی باشد.',
    safeResponseAdvice: 'حیوان را در مکانی کاملاً نرم و بدون ارتفاع قرار دهید تا آسیب نبیند. از خوراندن هرگونه ماده غذایی خودداری کرده و سریعاً با اورژانس تماس بگیرید.'
  },
  {
    id: 'dog_stiff_tail',
    species: 'dog',
    category: 'tail_ears',
    name: 'تکان دادن دم به صورت سفت، مستقیم و بسیار سریع',
    description: 'دم سگ بالا نگه داشته شده و با حرکتی بسیار کوتاه، سفت و پرشتاب نوسان می‌کند، در حالی که بقیه اعضای بدن سفت و بدون انعطاف هستند.',
    possibleMeanings: [
      { meaning: 'تحریک حسی بسیار بالا، حالت تهاجمی آماده‌باش یا هشدار قبل از واکنش شدید', probabilityHint: 'high', contextRequired: 'مواجهه با سگ غریبه یا عبور عابر' },
      { meaning: 'تمرکز شدید روی یک طعمه یا محرک متحرک', probabilityHint: 'medium' }
    ],
    isRedFlag: false,
    safeResponseAdvice: 'این تکان دادن دم نشانه خوشحالی نیست! بلکه انگیختگی بالا را نشان می‌دهد. او را به آرامی و با حفظ فاصله از موقعیت تحریک‌کننده دور کنید.'
  },

  // CAT SIGNALS
  {
    id: 'cat_purring',
    species: 'cat',
    category: 'vocal',
    name: 'صدای خرخر نرم و یکنواخت (Purring)',
    description: 'گربه صدای ارتعاشی ملایمی از گلو تولید می‌کند که ممکن است با لمس کردن قفسه سینه او نیز حس شود.',
    possibleMeanings: [
      { meaning: 'رضایت عمیق، احساس امنیت بالا و پیوند عاطفی گرم با سرپرست', probabilityHint: 'high', contextRequired: 'هنگام نوازش یا بغل کردن' },
      { meaning: 'مکانیسم دفاعی خودآرام‌بخشی برای کاهش درد فیزیکی یا کنترل ترس شدید', probabilityHint: 'medium', contextRequired: 'در کلینیک یا حین زایمان/درد شدید' }
    ],
    isRedFlag: false,
    safeResponseAdvice: 'اگر رفتارهای عمومی گربه عالی است، این نشانه شادی اوست. اما اگر گربه خود را جمع کرده و خرخر می‌کند، ممکن است نشانه تلاش برای تسکین درد باشد؛ زبان بدن او را چک کنید.'
  },
  {
    id: 'cat_tail_twitching',
    species: 'cat',
    category: 'tail_ears',
    name: 'تکان دادن شلاقی یا موجی نوک دم',
    description: 'گربه دم خود را به شدت به طرفین می‌کوبد یا نوک دم او با حرکت‌های سریع و شلاقی نوسان می‌کند.',
    possibleMeanings: [
      { meaning: 'تحریک حسی بیش از حد (Overstimulation)، عصبانیت ملایم یا کلافگی شدید', probabilityHint: 'high', contextRequired: 'نوازش طولانی مدت در یک نقطه' },
      { meaning: 'تمرکز شکارچی و انگیختگی زیاد قبل از پرش', probabilityHint: 'high', contextRequired: 'حین بازی با اسباب‌بازی پر دار' }
    ],
    isRedFlag: false,
    safeResponseAdvice: 'نوازش کردن گربه را بلافاصله متوقف کنید و به او فضا بدهید. ادامه دادن به نوازش می‌تواند منجر به چنگ زدن یا گاز گرفتن ناشی از تحریک بیش از حد شود.'
  },
  {
    id: 'cat_kneading',
    species: 'cat',
    category: 'social_interaction',
    name: 'ورز دادن پتو یا پاهای صاحب با پنجه‌ها (Kneading)',
    description: 'گربه پنجه‌های جلویی خود را به نوبت روی سطوح نرم یا بدن شما فشار می‌دهد و مثل ورز دادن خمیر حرکت می‌دهد.',
    possibleMeanings: [
      { meaning: 'ابراز عشق عمیق، احساس امنیت مطلق و تکرار غریزی رفتار نوزادی در کنار مادر', probabilityHint: 'high', contextRequired: 'زمان استراحت در آغوش شما' }
    ],
    isRedFlag: false,
    safeResponseAdvice: 'این زیباترین پیام محبت گربه است. برای ایمن بودن، ناخن‌های گربه را به طور منظم اصلاح کنید ولی هرگز مانع انجام این کار نشوید.'
  },
  {
    id: 'cat_airplane_ears',
    species: 'cat',
    category: 'tail_ears',
    name: 'گوش‌های پهن و خوابیده به عقب (گوش هواپیمایی)',
    description: 'گوش‌های گربه از دو طرف به سمت پایین پهن شده و به طرف پشت خوابانده می‌شوند، شبیه بال هواپیما.',
    possibleMeanings: [
      { meaning: 'احساس خطر، ترس زیاد، یا آماده‌باش برای دفاع فیزیکی فعال', probabilityHint: 'high', contextRequired: 'حضور حیوان غریبه یا صدای ترسناک' },
      { meaning: 'عصبانیت شدید و هشدار جدی قبل از حمله احتمالی', probabilityHint: 'medium' }
    ],
    isRedFlag: false,
    safeResponseAdvice: 'به هیچ وجه گربه را به زور در آغوش نگیرید یا جلوی او نایستید. بگذارید به پناهگاهی امن برود تا احساس امنیت کند و آرام شود.'
  },
  {
    id: 'cat_straining_litterbox',
    species: 'cat',
    category: 'body_posture',
    name: 'تلاش مکرر و بدون نتیجه در ظرف خاک (Straining)',
    description: 'گربه به طور مکرر وارد ظرف خاک می‌شود، در ژست ادرار کردن قرار می‌گیرد اما ادراری خارج نمی‌شود یا فقط چند قطره با درد یا ناله خارج می‌گردد.',
    possibleMeanings: [
      { meaning: 'انسداد کامل یا نسبی مجاری ادراری تحتانی (FLUTD / انسداد ادراری)', probabilityHint: 'high' }
    ],
    isRedFlag: true,
    redFlagDetails: 'توجه بسیار حیاتی: این یک اورژانس صد در صد حیاتی و فوری پزشکی است! انسداد ادراری در گربه‌ها (به‌ویژه گربه‌های نر) در عرض ۲۴ تا ۴۸ ساعت به دلیل تجمع سموم و پتاسیم در خون منجر به نارسایی کلیه و ایست قلبی می‌شود.',
    safeResponseAdvice: 'بدون حتی یک ساعت تاخیر، گربه را به مجهزترین بخش اورژانس دامپزشکی شبانه‌روزی منتقل کنید.'
  },
  {
    id: 'cat_sudden_hiding',
    species: 'cat',
    category: 'social_interaction',
    name: 'گوشه‌گیری ناگهانی و پنهان شدن مداوم در تاریکی',
    description: 'گربه که پیش از این اجتماعی بوده، ناگهان ساعت‌ها زیر تخت، کمد یا فضاهای بسیار تاریک مخفی شده و از برقراری تماس خودداری می‌کند.',
    possibleMeanings: [
      { meaning: 'وجود بیماری، آسیب فیزیکی مخفی یا درد شدید ناشی از تب یا عفونت', probabilityHint: 'high', contextRequired: 'همراه با کاهش ناگهانی اشتها' },
      { meaning: 'استرس شدید محیطی یا ترس از تغییر دکوراسیون یا افراد جدید خانه', probabilityHint: 'medium' }
    ],
    isRedFlag: false,
    safeResponseAdvice: 'این رفتار شایع‌ترین واکنش گربه‌ها به احساس کسالت یا بیماری است. از بیرون کشیدن اجباری او خودداری کنید، ابتدا وضعیت غذا و آب او را بررسی کرده و در صورت ادامه بیش از ۲۴ ساعت به دامپزشک مراجعه کنید.'
  },
  {
    id: 'cat_slow_blink',
    species: 'cat',
    category: 'social_interaction',
    name: 'پلک زدن آرام و مداوم چشمان (Slow Blink)',
    description: 'گربه با آرامش به چشمان شما نگاه کرده و سپس پلک‌هایش را به آرامی می‌بندد و دوباره باز می‌کند.',
    possibleMeanings: [
      { meaning: 'ابراز اعتماد کامل، آرامش خاطر بیولوژیکی و معادل «بوسه از راه دور»', probabilityHint: 'high', contextRequired: 'زمان لمس ملایم یا تماشای آرام پت' }
    ],
    isRedFlag: false,
    safeResponseAdvice: 'این رفتار اوج صمیمیت است. شما هم با چشمان نیمه‌باز و پلک زدن آرام به او پاسخ دهید تا حس امنیت متقابل تقویت شود.'
  }
];

export const MOCK_MEDIA_GALLERY = [
  { id: 'm1', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop', type: 'image' as const, label: 'سگ خوشحال در حال زبان زدن' },
  { id: 'm2', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600&auto=format&fit=crop', type: 'image' as const, label: 'گربه در حال پلک زدن آرام' },
  { id: 'm3', url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=600&auto=format&fit=crop', type: 'image' as const, label: 'گربه با گوش‌های هواپیمایی خفیف' }
];
