import { Product, ProductMatch } from './shopTypes';

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

  // 1. Check if veterinarian guidance is required (supplements, therapeutic diets)
  if (product.requiresVeterinarianGuidance) {
    return {
      status: 'requires_guidance',
      reasons: ['برای مصرف مکمل‌ها و رژیم‌های درمانی، پیش از خرید با دامپزشک مشورت کنید.']
    };
  }

  // 2. Check species compatibility
  const petSpecies = pet.type; // 'dog' | 'cat'
  const productSpecies = product.species || ['universal'];
  const isSpeciesMatch = productSpecies.includes(petSpecies) || productSpecies.includes('universal');

  if (!isSpeciesMatch) {
    const targetSpeciesPersian = productSpecies.includes('dog') ? 'سگ‌ها' : 'گربه‌ها';
    return {
      status: 'not_applicable',
      reasons: [`این محصول طبق اطلاعات شرکت سازنده، برای ${targetSpeciesPersian} مناسب است.`]
    };
  }

  reasons.push(productSpecies.includes('universal') 
    ? 'قابل استفاده برای هر دو گونه سگ و گربه'
    : petSpecies === 'dog' ? 'تولید شده اختصاصی برای سگ‌ها' : 'تولید شده اختصاصی برای گربه‌ها'
  );

  // 3. Derive pet lifestage and check compatibility
  let petLifeStage: 'puppy_kitten' | 'adult' | 'senior' = 'adult';
  if (pet.age < 1) {
    petLifeStage = 'puppy_kitten';
  } else if (pet.age >= 7) {
    petLifeStage = 'senior';
  }

  const lifeStages = product.lifeStages || ['all'];

  if (lifeStages.length > 0 && !lifeStages.includes('all')) {
    const isLifeStageMatch = lifeStages.includes(petLifeStage);
    const lifeStagePersian = 
      petLifeStage === 'puppy_kitten' ? 'توله و بچه سال' :
      petLifeStage === 'senior' ? 'مسن و سالخورده' : 'بالغ';

    if (isLifeStageMatch) {
      reasons.push(`کاملاً متناسب با مرحله سنی پت شما (${lifeStagePersian})`);
      return { status: 'compatible', reasons };
    } else {
      const productLifeStagesPersian = lifeStages.map(stage => {
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
