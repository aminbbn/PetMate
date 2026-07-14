export type NutritionPlanSource =
  | 'veterinarian'
  | 'product_label'
  | 'educational_estimate'
  | 'user';

export type FoodUnit =
  | 'gram'
  | 'milliliter'
  | 'cup'
  | 'can'
  | 'piece'
  | 'scoop';

export type PetFood = {
  id: string;
  petId: string;
  name: string;
  brand?: string;
  category:
    | 'dry'
    | 'wet'
    | 'fresh'
    | 'treat'
    | 'supplement'
    | 'therapeutic'
    | 'homemade'
    | 'other';
  energyKcalPer100g?: number;
  energyKcalPerUnit?: number;
  unit?: FoodUnit;
  ingredients?: string[];
  labelFeedingText?: string;
  productId?: string;
  sourceName?: string;
  sourceUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type FeedingPlanMeal = {
  id: string;
  foodId: string;
  time: string;
  amount: number;
  unit: FoodUnit;
  daysOfWeek: number[]; // 0 for Saturday, 1 for Sunday, ..., 6 for Friday
  notes?: string;
  reminderId?: string;
};

export type FeedingPlan = {
  id: string;
  petId: string;
  name: string;
  source: NutritionPlanSource;
  status: 'draft' | 'active' | 'archived';
  dailyEnergyTargetKcal?: number;
  energyRangeMinKcal?: number;
  energyRangeMaxKcal?: number;
  veterinarianId?: string;
  healthRecordId?: string;
  followUpAt?: string;
  notes?: string;
  meals: FeedingPlanMeal[];
  createdAt: string;
  updatedAt: string;
};

export type MealLog = {
  id: string;
  petId: string;
  planId?: string;
  mealId?: string;
  foodId?: string;
  fedAt: string; // ISO string
  amount?: number;
  unit?: FoodUnit;
  skipped?: boolean;
  note?: string;
  createdAt: string;
};

export type HydrationLog = {
  id: string;
  petId: string;
  recordedAt: string; // ISO string
  amountMl?: number;
  event: 'measured' | 'bowl_refilled' | 'note';
  note?: string;
};

export type FoodSensitivityStatus =
  | 'user_reported'
  | 'veterinarian_confirmed'
  | 'suspected'
  | 'ruled_out';

export type FoodSensitivity = {
  id: string;
  petId: string;
  ingredient: string;
  status: FoodSensitivityStatus;
  reactionNotes?: string;
  recordedAt: string;
  healthRecordId?: string;
  vetContactId?: string;
};

export interface NutritionSettings {
  petId: string;
  veterinarianEnergyTargetKcal?: number;
  veterinarianHydrationTargetMl?: number;
  activePlanId?: string;
  updatedAt: string;
}

export interface CreatePetFoodInput {
  petId: string;
  name: string;
  brand?: string;
  category: PetFood['category'];
  energyKcalPer100g?: number;
  energyKcalPerUnit?: number;
  unit?: FoodUnit;
  ingredients?: string[];
  labelFeedingText?: string;
  productId?: string;
  sourceName?: string;
  sourceUrl?: string;
}

export interface UpdatePetFoodInput extends Partial<Omit<PetFood, 'id' | 'petId' | 'createdAt'>> {}

export interface CreateFeedingPlanInput {
  petId: string;
  name: string;
  source: NutritionPlanSource;
  dailyEnergyTargetKcal?: number;
  energyRangeMinKcal?: number;
  energyRangeMaxKcal?: number;
  veterinarianId?: string;
  healthRecordId?: string;
  followUpAt?: string;
  notes?: string;
  meals: Omit<FeedingPlanMeal, 'id'>[];
}

export interface UpdateFeedingPlanInput extends Partial<Omit<FeedingPlan, 'id' | 'petId' | 'createdAt'>> {}

export interface CreateMealLogInput {
  petId: string;
  planId?: string;
  mealId?: string;
  foodId?: string;
  fedAt: string;
  amount?: number;
  unit?: FoodUnit;
  skipped?: boolean;
  note?: string;
}

export interface UpdateMealLogInput extends Partial<Omit<MealLog, 'id' | 'petId' | 'createdAt'>> {}

export interface CreateHydrationLogInput {
  petId: string;
  recordedAt: string;
  amountMl?: number;
  event: HydrationLog['event'];
  note?: string;
}

export interface CreateFoodSensitivityInput {
  petId: string;
  ingredient: string;
  status: FoodSensitivityStatus;
  reactionNotes?: string;
  healthRecordId?: string;
  vetContactId?: string;
}

export interface UpdateFoodSensitivityInput extends Partial<Omit<FoodSensitivity, 'id' | 'petId'>> {}
