import { Product, ProductMatch, ProductMatchStatus } from './shopTypes';

export interface PetProfileStub {
  name: string;
  type: 'dog' | 'cat';
  age: number; // in years
  breed?: string;
  weight?: number;
}

export function getProductCompatibility(
  product: Product,
  pet: PetProfileStub | null
): ProductMatch {
  if (!pet) {
    return {
      status: 'unknown',
      reasons: ['اطلاعات سازگاری کافی ثبت نشده است. لطفاً ابتدا وارد حساب پت خود شوید.']
    };
  }

  const reasons: string[] = [];
  const comp = product.compatibility;

  if (!comp) {
    return {
      status: 'unknown',
      reasons: ['اطلاعات سازگاری کافی برای این محصول ثبت نشده است.']
    };
  }

  // 1. Check if veterinarian guidance is required (supplements, therapeutic diets)
  if (comp.requiresVeterinarianGuidance) {
    return {
      status: 'requires_guidance',
      reasons: ['برای مصرف مکمل‌ها و رژیم‌های درمانی، پیش از خرید با دامپزشک مشورت کنید.']
    };
  }

  // 2. Check species compatibility
  const petSpecies = pet.type; // 'dog' | 'cat'
  const isSpeciesMatch = comp.species.includes(petSpecies) || comp.species.includes('universal');

  if (!isSpeciesMatch) {
    const targetSpeciesPersian = comp.species.includes('dog') ? 'سگ‌ها' : 'گربه‌ها';
    return {
      status: 'not_applicable',
      reasons: [`این محصول طبق اطلاعات شرکت سازنده، برای ${targetSpeciesPersian} مناسب است.`]
    };
  }

  reasons.push(comp.species.includes('universal') 
    ? 'قابل استفاده برای هر دو گونه سگ و گربه'
    : petSpecies === 'dog' ? 'تولید شده اختصاصی برای سگ‌ها' : 'تولید شده اختصاصی برای گربه‌ها'
  );

  // 3. Derive pet lifestage and check compatibility
  // pet.age is in years
  let petLifeStage: 'puppy_kitten' | 'adult' | 'senior' = 'adult';
  if (pet.age < 1) {
    petLifeStage = 'puppy_kitten';
  } else if (pet.age >= 7) {
    petLifeStage = 'senior';
  }

  if (comp.lifeStages && comp.lifeStages.length > 0 && !comp.lifeStages.includes('all')) {
    const isLifeStageMatch = comp.lifeStages.includes(petLifeStage);
    const lifeStagePersian = 
      petLifeStage === 'puppy_kitten' ? 'توله و بچه سال' :
      petLifeStage === 'senior' ? 'مسن و سالخورده' : 'بالغ';

    if (isLifeStageMatch) {
      reasons.push(`کاملاً متناسب با مرحله سنی پت شما (${lifeStagePersian})`);
      return { status: 'compatible', reasons };
    } else {
      const productLifeStagesPersian = comp.lifeStages.map(stage => {
        if (stage === 'puppy_kitten') return 'توله‌ها';
        if (stage === 'senior') return 'پت‌های مسن';
        return 'بالغین';
      }).join(' و ');
      
      reasons.push(`این محصول طبق اطلاعات برای ${productLifeStagesPersian} طراحی شده است (پت شما ${lifeStagePersian} است).`);
      return { status: 'partial', reasons };
    }
  }

  reasons.push('مناسب برای تمامی سنین و مراحل رشد');
  return { status: 'compatible', reasons };
}
