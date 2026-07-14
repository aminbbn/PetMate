import { GoogleGenAI, Type } from "@google/genai";

export interface TriageMessage {
  role: "user" | "model";
  content: string;
}

export interface PetProfile {
  id?: string;
  name?: string;
  type?: "dog" | "cat" | string;
  breed?: string;
  age?: number;
  weight?: number;
}

export interface TriageApiResponse {
  analysis: string;
  urgency: "EMERGENCY_NOW" | "VET_TODAY" | "VET_SOON" | "MONITOR" | "INSUFFICIENT_INFORMATION";
  clinicalReasoning: string;
  suggestedQuestions: string[];
  redFlagsTriggered: string[];
}

// Deterministic red-flag keyword detection
export function detectRedFlags(text: string): string[] {
  const normalized = (text || "").toLowerCase();
  const matched: string[] = [];

  const RED_FLAGS_CONFIG = [
    {
      id: "breathing",
      label: "مشکل شدید تنفسی (خفگی، تنگی نفس شدید)",
      patterns: [
        "تنگی نفس", "سختی تنفس", "نفس نفس", "خفگی", "نفسش بالا نمیاد", "خفه", "نفس تنگی", "نفس کشیدن سخت",
        "breath", "gasp", "chok", "suffocat", "asphyx", "dyspnea", "pant"
      ]
    },
    {
      id: "unresponsiveness",
      label: "کاهش سطح هوشیاری یا بی‌هوشی کامل",
      patterns: [
        "بی‌هوش", "بیهوش", "عدم پاسخ", "غش", "کما", "بی جان", "بی‌جان", "حرکت نمیکنه", "بی‌حسی کامل", "افتاده رو زمین",
        "unresponsive", "unconscious", "faint", "coma", "collapse", "passed out"
      ]
    },
    {
      id: "toxic",
      label: "بلعیدن مواد سمی، شکلات یا مواد شیمیایی",
      patterns: [
        "سم", "سمی", "مسموم", "شکلات", "انگور", "کشمش", "وایتکس", "شوینده", "شوینده‌ها", "مرگ موش", "قرص مسکن", "دارو خورده", "ضدیخ",
        "toxic", "poison", "ingest", "chemical", "bleach", "detergent", "rodenticide"
      ]
    },
    {
      id: "seizure",
      label: "تشنج یا لرزش‌های شدید کنترل‌نشده",
      patterns: [
        "تشنج", "لرزش شدید", "غش کردن با لرزش", "تشنج‌", "seizure", "convulsion", "tremor"
      ]
    },
    {
      id: "bloated",
      label: "اتساع یا باد کردن ناگهانی شکم همراه با تلاش ناموفق برای استفراغ",
      patterns: [
        "شکم برآمده", "باد کرده شکمش", "اتساع شکم", "شکمش باد", "شکم باد", "استفراغ خشک", "بالا آوردن خشک",
        "bloat", "bloated", "dry heave", "distended"
      ]
    },
    {
      id: "bleeding",
      label: "خونریزی شدید یا مداومی که بند نمی‌آید",
      patterns: [
        "خونریزی شدید", "خونریزی بند", "خون زیادی", "پاره شدن رگ", "فوران خون",
        "bleeding", "bleed", "blood", "hemorrhage"
      ]
    },
    {
      id: "urination",
      label: "انسداد کامل مجاری ادرار یا ناتوانی در دفع ادرار",
      patterns: [
        "انسداد ادرار", "ادرار نکردن", "جیش نمیکنه", "نمی‌تونه جیش کنه", "حبس ادرار", "ادرارش بند آمده",
        "cannot urinate", "unable to pee", "urinary blockage"
      ]
    },
    {
      id: "trauma",
      label: "ضربه شدید یا تروما (تصادف، سقوط از ارتفاع، شکستگی باز)",
      patterns: [
        "تصادف", "سقوط", "ضربه شدید", "شکستگی شدید", "ماشین بهش زده", "زیر ماشین",
        "trauma", "accident", "fall", "hit", "fracture", "broken"
      ]
    },
    {
      id: "pale_gums",
      label: "رنگ‌پریدگی شدید یا سفید شدن لثه‌ها",
      patterns: [
        "لثه سفید", "لثه رنگ‌پریده", "لثه‌های بی‌رنگ", "رنگ پریدگی لثه", "pale gums", "white gums"
      ]
    }
  ];

  for (const flag of RED_FLAGS_CONFIG) {
    const hasMatch = flag.patterns.some(pattern => normalized.includes(pattern));
    if (hasMatch) {
      matched.push(flag.label);
    }
  }

  return matched;
}

// Safe value mapping to ensure monotonic risk progression
const URGENCY_PRIORITY: Record<string, number> = {
  EMERGENCY_NOW: 5,
  VET_TODAY: 4,
  VET_SOON: 3,
  MONITOR: 2,
  INSUFFICIENT_INFORMATION: 1
};

export function getHighestUrgency(urgencies: string[]): "EMERGENCY_NOW" | "VET_TODAY" | "VET_SOON" | "MONITOR" | "INSUFFICIENT_INFORMATION" {
  let highestLevel = 1;
  let highestKey: "EMERGENCY_NOW" | "VET_TODAY" | "VET_SOON" | "MONITOR" | "INSUFFICIENT_INFORMATION" = "INSUFFICIENT_INFORMATION";

  for (const u of urgencies) {
    const level = URGENCY_PRIORITY[u] || 1;
    if (level > highestLevel) {
      highestLevel = level;
      highestKey = u as any;
    }
  }

  return highestKey;
}

export async function processTriageRequest(
  messages: TriageMessage[],
  petProfile: PetProfile | null,
  previousUrgencies: string[] = []
): Promise<TriageApiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  // 1. Accumulate and check ALL user messages for Red Flags
  const userTextCombined = messages
    .filter(m => m.role === "user")
    .map(m => m.content)
    .join(" ");

  const redFlags = detectRedFlags(userTextCombined);

  // If any Red Flag is matched, bypass Gemini and return EMERGENCY_NOW immediately!
  if (redFlags.length > 0) {
    return {
      analysis: `⚠️ **هشدار فوری حیاتی (علائم قرمز پزشکی)** ⚠️\n\nبر اساس علائم اضطراری بسیار شدیدی که گزارش کرده‌اید، پت شما نیاز به مداخله فوری پزشکی دارد.\n\n**علائم بحرانی شناسایی شده:**\n${redFlags.map(rf => `• ${rf}`).join("\n")}\n\nلطفاً در این شرایط به هیچ عنوان منتظر پاسخ‌های بیشتر هوش مصنوعی نمانید، خوددرمانی نکنید و در همین ثانیه با نزدیک‌ترین بیمارستان یا کلینیک دامپزشکی شبانه‌روزی هماهنگ کنید و سریعاً حرکت نمایید. این وضعیت یک فوریت پزشکی واقعی (Emergency) است و جان حیوان در خطر مستقیم است.`,
      urgency: "EMERGENCY_NOW",
      clinicalReasoning: "شناسایی مستقیم و قطعی علائم قرمز (Red Flags) پزشکی دامپزشکی در پیام‌های کاربر که نشان‌دهنده ریسک بحرانی جانی فوری است.",
      suggestedQuestions: [
        "نزدیک‌ترین کلینیک دامپزشکی شبانه‌روزی کجاست؟",
        "تا رسیدن به کلینیک چه اقدامات حمایتی اولیه را می‌توانم انجام دهم؟"
      ],
      redFlagsTriggered: redFlags
    };
  }

  // 2. Setup GoogleGenAI client with telemetry headers
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });

  // 3. Define clinical veterinary-safety system instruction
  const systemInstruction = `شما دستیار ارزیابی و غربالگری فوریت‌های پزشکی (Triage Assistant) با نام "راهنمای فوریت سلامت" برای صاحبان حیوانات خانگی در ایران هستید.
وظیفه شما ارزیابی علائم بالینی گزارش شده، تشخیص سطح فوریت پزشکی بر اساس استانداردهای دامپزشکی و ارائه راهنمایی ایمن به صاحب حیوان است.

مشخصات حیوان خانگی مورد ارزیابی:
- نام: ${petProfile?.name || "حیوان خانگی"}
- نوع: ${petProfile?.type === "dog" ? "سگ" : petProfile?.type === "cat" ? "گربه" : "حیوان خانگی"}
- نژاد: ${petProfile?.breed || "ترکیبی/نامشخص"}
- سن: ${petProfile?.age !== undefined ? `${petProfile?.age} سال` : "نامشخص"}
- وزن: ${petProfile?.weight !== undefined ? `${petProfile?.weight} کیلوگرم` : "نامشخص"}

قوانین پزشکی و بالینی حیاتی (غیرقابل تخطی):
۱. به هیچ وجه نباید تشخیص پزشکی قطعی، نام بیماری یا تشخیص نهایی به کاربر ارائه دهید. شما حق تجویز دارو یا پروتکل درمانی ندارید.
۲. هرگز از اصطلاحات امیدبخش کاذب یا عباراتی چون "پت شما کاملاً سالم است"، "همه چیز عادی است" یا "نگرانی وجود ندارد" استفاده نکنید. درمان را تضمین نکنید.
۳. ادبیات شما باید بسیار دلسوزانه، متین، حرفه‌ای، خونسرد و متمرکز بر ایمنی بالینی حیوان باشد. از کلمات تایید نشده یا پزشکی غیرعلمی بپرهیزید.
۴. شما باید سطح فوریت پزشکی را به یکی از ۵ سطح زیر طبقه‌بندی کنید:
  - EMERGENCY_NOW: فوریت بالایی که نیاز به مراجعه فوری و بدون فوت وقت به نزدیک‌ترین بیمارستان شبانه‌روزی دامپزشکی دارد.
  - VET_TODAY: شرایطی که نیاز به معاینه حضوری دامپزشک در همان روز دارد.
  - VET_SOON: شرایطی که چندان حاد نیست اما باید ظرف ۲۴ الی ۴۸ ساعت آینده با دامپزشک بررسی شود.
  - MONITOR: علائم خفیفی که خطر فوری ندارند و فعلاً با مراقبت خانگی ساده و ثبت علائم نیاز به پایش مداوم دارند.
  - INSUFFICIENT_INFORMATION: اطلاعات کافی برای ارزیابی نیست و به علائم، رفتار، اشتها، جزییات ادرار/مدفوع یا شرایط حیوان نیاز به توضیح بیشتر دارید.

به عنوان یک دستیار ایمن، در صورت شک میان سطوح اضطرار، همیشه محافظه‌کارانه‌ترین تصمیم (اضطراری‌تر) را انتخاب کنید.

خروجی شما باید دقیقاً به زبان فارسی سلیس و با رعایت فرمت تعیین شده JSON ارائه شود.`;

  // Format messages correctly for genai SDK
  const formattedContents = messages.map(m => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }]
  }));

  // 4. Call Gemini 3.5 Flash with structured JSON schema config
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: formattedContents,
    config: {
      systemInstruction,
      temperature: 0.1, // low temperature for clinical safety and strict formatting
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: {
            type: Type.STRING,
            description: "شرح ارزیابی علائم حیوان خانگی به زبان فارسی، به همراه راهنمایی‌های مراقبتی کلی و لزوم یا عدم لزوم مراجعه حضوری به دامپزشک. کاملاً دلسوزانه و حرفه‌ای."
          },
          urgency: {
            type: Type.STRING,
            enum: ["EMERGENCY_NOW", "VET_TODAY", "VET_SOON", "MONITOR", "INSUFFICIENT_INFORMATION"],
            description: "سطح غربالگری فوریت بر اساس استانداردهای دامپزشکی."
          },
          clinicalReasoning: {
            type: Type.STRING,
            description: "توضیح فنی و منطق دامپزشکی در پشت طبقه‌بندی فوریت انتخابی شما (به فارسی)."
          },
          suggestedQuestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "سوالات پیگیری مفید (۲ الی ۳ سوال) که کاربر می‌تواند با کلیک بر آن‌ها شرایط حیوان را بیشتر توضیح دهد."
          },
          redFlagsTriggered: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "هرگونه علامت هشدار بحرانی شناسایی شده در طول گفت‌وگو."
          }
        },
        required: ["analysis", "urgency", "clinicalReasoning", "suggestedQuestions", "redFlagsTriggered"]
      }
    }
  });

  const responseText = response.text;
  if (!responseText) {
    throw new Error("No response text returned from Gemini API.");
  }

  try {
    const parsed: TriageApiResponse = JSON.parse(responseText);

    // 5. Enforce Non-Downgrading Urgency Logic (highest urgency persists)
    const urgenciesToCompare = [...previousUrgencies, parsed.urgency];
    const finalUrgency = getHighestUrgency(urgenciesToCompare);

    if (finalUrgency !== parsed.urgency) {
      parsed.urgency = finalUrgency;
      parsed.analysis = `⚠️ **توجه:** علائم ثبت‌شده قبلی نشان‌دهنده نیاز به مراقبت اضطراری جدی است. وضعیت ارزیابی کلی هم‌چنان روی سطح بالاتر فوریت قرار دارد.\n\n` + parsed.analysis;
    }

    return parsed;
  } catch (err) {
    console.error("Failed to parse Gemini response JSON:", responseText, err);
    throw new Error("تولید پاسخ با ساختار نامعتبر مواجه شد.");
  }
}
