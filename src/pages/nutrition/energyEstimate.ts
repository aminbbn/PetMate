export interface EnergyEstimateInput {
  petType: 'dog' | 'cat';
  weightKg: number;
  lifeStage: 'growing' | 'adult' | 'senior';
  isNeutered: boolean;
  bodyConditionScore?: number; // 1-9 scale, where 5 is ideal
  isPregnantOrLactating: boolean;
  hasChronicDisease: boolean;
  isOnTherapeuticDiet: boolean;
  isActiveWeightLoss: boolean;
}

export interface EnergyEstimateResult {
  success: boolean;
  error?: string;
  rer?: number;
  minKcal?: number;
  maxKcal?: number;
  factorsUsed?: string;
  bcsAdjustmentNote?: string;
}

/**
 * Versioned educational energy estimator.
 * Verified and safe starting point based on WSAVA / AAHA guidelines.
 * Version: 1.0.0
 * Review Date: 2026-07-14
 */
export function calculateEducationalEnergyEstimate(input: EnergyEstimateInput): EnergyEstimateResult {
  const {
    petType,
    weightKg,
    lifeStage,
    isNeutered,
    bodyConditionScore,
    isPregnantOrLactating,
    hasChronicDisease,
    isOnTherapeuticDiet,
    isActiveWeightLoss,
  } = input;

  // Safety Guards / Disable Conditions
  if (!weightKg || weightKg <= 0 || isNaN(weightKg)) {
    return {
      success: false,
      error: 'وزن وارد شده نامعتبر است. برای محاسبه برآورد انرژی، ثبت دقیق آخرین وزن حیوان الزامی است.',
    };
  }

  if (isPregnantOrLactating) {
    return {
      success: false,
      error: 'در دوران بارداری یا شیردهی، نیازهای تغذیه‌ای بسیار متغیر است و جیره غذایی حتماً باید مستقیماً توسط دامپزشک تجویز و فرمول‌نویسی شود.',
    };
  }

  if (hasChronicDisease) {
    return {
      success: false,
      error: 'به دلیل وجود بیماری مزمن فعال، برآورد خودکار غیرفعال شده است. رژیم غذایی این پت باید تحت نظارت مستقیم پزشک معالج تنظیم شود.',
    };
  }

  if (isOnTherapeuticDiet) {
    return {
      success: false,
      error: 'غذاهای درمانی (Therapeutic Diet) دارای فرمول‌های ویژه برای کنترل بیماری‌ها هستند؛ مقدار مصرف آن‌ها فقط باید توسط دامپزشک تعیین شود.',
    };
  }

  if (isActiveWeightLoss) {
    return {
      success: false,
      error: 'برنامه کاهش وزن فعال نیاز به پایش هفتگی و کاهش پله‌ای و دقیق کالری تحت نظر پزشک دارد. لطفاً از محاسبه خودکار استفاده نکنید.',
    };
  }

  // Calculate RER (Resting Energy Requirement)
  // RER = 70 * (weight ^ 0.75)
  const rer = Math.round(70 * Math.pow(weightKg, 0.75));

  // Determine Factors based on pet type and clinical parameters
  let minFactor = 1.0;
  let maxFactor = 1.2;
  let factorsLabel = '';

  if (petType === 'dog') {
    if (lifeStage === 'growing') {
      minFactor = 2.0;
      maxFactor = 3.0;
      factorsLabel = 'توله در حال رشد (ضریب ۲.۰ تا ۳.۰)';
    } else if (lifeStage === 'senior') {
      minFactor = 1.1;
      maxFactor = 1.3;
      factorsLabel = 'سگ مسن (ضریب ۱.۱ تا ۱.۳)';
    } else {
      // Adult
      if (isNeutered) {
        minFactor = 1.4;
        maxFactor = 1.6;
        factorsLabel = 'سگ بالغ عقیم‌شده (ضریب ۱.۴ تا ۱.۶)';
      } else {
        minFactor = 1.6;
        maxFactor = 1.8;
        factorsLabel = 'سگ بالغ عقیم‌نشده (ضریب ۱.۶ تا ۱.۸)';
      }
    }
  } else {
    // Cat
    if (lifeStage === 'growing') {
      minFactor = 1.8;
      maxFactor = 2.5;
      factorsLabel = 'بچه گربه در حال رشد (ضریب ۱.۸ تا ۲.۵)';
    } else if (lifeStage === 'senior') {
      minFactor = 1.0;
      maxFactor = 1.2;
      factorsLabel = 'گربه مسن (ضریب ۱.۰ تا ۱.۲)';
    } else {
      // Adult
      if (isNeutered) {
        minFactor = 1.1;
        maxFactor = 1.3;
        factorsLabel = 'گربه بالغ عقیم‌شده (ضریب ۱.۱ تا ۱.۳)';
      } else {
        minFactor = 1.3;
        maxFactor = 1.5;
        factorsLabel = 'گربه بالغ عقیم‌نشده (ضریب ۱.۳ تا ۱.۵)';
      }
    }
  }

  // BCS (Body Condition Score) Adjustments
  let bcsAdjustmentNote = 'تنظیم بر اساس شاخص وضعیت بدنی (BCS) اعمال نشده است (اطلاعات در دسترس نیست).';
  if (bodyConditionScore && bodyConditionScore >= 1 && bodyConditionScore <= 9) {
    if (bodyConditionScore < 4) {
      // Underweight - increase factor slightly to promote weight recovery
      minFactor += 0.15;
      maxFactor += 0.15;
      bcsAdjustmentNote = `پت کم‌وزن است (BCS: ${bodyConditionScore}/9). ضریب انرژی برای کمک به افزایش وزن سالم افزایش یافت (+0.15).`;
    } else if (bodyConditionScore > 5) {
      // Overweight - reduce factor slightly to control calorie intake
      minFactor -= 0.15;
      maxFactor -= 0.15;
      bcsAdjustmentNote = `پت دارای اضافه وزن است (BCS: ${bodyConditionScore}/9). ضریب انرژی برای جلوگیری از افزایش وزن کاهش یافت (-0.15).`;
    } else {
      bcsAdjustmentNote = `پت در وضعیت بدنی ایده‌آل قرار دارد (BCS: ${bodyConditionScore}/9). ضریب استاندارد اعمال شد.`;
    }
  }

  const minKcal = Math.round(rer * minFactor);
  const maxKcal = Math.round(rer * maxFactor);

  return {
    success: true,
    rer,
    minKcal,
    maxKcal,
    factorsUsed: factorsLabel,
    bcsAdjustmentNote,
  };
}
