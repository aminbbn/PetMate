export type WeightMeasurementSource =
  | 'home'
  | 'veterinary_clinic'
  | 'groomer'
  | 'other';

export interface WeightEntry {
  id: string;
  petId: string;
  measuredAt: string; // ISO String
  weightKg: number;
  source?: WeightMeasurementSource;
  note?: string;
  createdAt: string;
  updatedAt: string;

  // Temporary legacy aliases for backward compatibility
  date?: string;
  weight?: number;
}

export interface WeightGoal {
  petId: string;
  minKg?: number;
  maxKg?: number;
  targetKg?: number;
  source: 'user' | 'veterinarian';
  note?: string;
  setAt: string; // ISO String
  updatedAt: string; // ISO String
}

export type RangeFilter = '30_days' | '3_months' | '6_months' | '1_year' | 'all';
