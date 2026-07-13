export type PetServiceCategory =
  | 'veterinary_clinic'
  | 'veterinary_hospital'
  | 'pharmacy'
  | 'pet_shop'
  | 'boarding'
  | 'grooming'
  | 'park'
  | 'laboratory'
  | 'imaging'
  | 'other';

export type ServiceVerificationStatus =
  | 'verified'
  | 'community_reported'
  | 'unverified';

export type ServiceCoordinates = {
  latitude: number;
  longitude: number;
};

export type WeeklyOpeningHours = {
  timeZone: string;
  periods: Array<{
    day: number; // 0 for Sunday, 1 for Monday, etc., or 6 for Saturday (standard JS getDay())
    open: string; // e.g. "09:00"
    close: string; // e.g. "21:00"
  }>;
};

export type ServiceRating = {
  value: number;
  reviewCount: number;
  source: string;
};

export type PetService = {
  id: string;
  name: string;
  categories: PetServiceCategory[];
  specialties?: string[];
  address: string;
  city?: string;
  district?: string;
  coordinates?: ServiceCoordinates;
  phone?: string;
  website?: string;
  openingHours?: WeeklyOpeningHours;
  emergencyCapability?: boolean;
  emergencyVerifiedAt?: string;
  rating?: ServiceRating;
  description?: string;
  amenities?: string[];
  sourceName: string;
  sourceUrl?: string;
  verificationStatus: ServiceVerificationStatus;
  lastVerifiedAt?: string;
};

export interface ServiceSearchInput {
  query?: string;
  category?: PetServiceCategory | 'all';
  city?: string;
  district?: string;
  isOpenNow?: boolean;
  isEmergencyOnly?: boolean;
  hasPhone?: boolean;
  userCoordinates?: ServiceCoordinates | null;
  radiusKm?: number;
  sortBy?: 'relevant' | 'nearest' | 'highest_rating';
}

export interface ServiceSearchResult {
  services: PetService[];
  totalCount: number;
}

export interface LocationState {
  status: 'idle' | 'pending' | 'success' | 'denied' | 'unavailable' | 'timeout' | 'insecure';
  coordinates: ServiceCoordinates | null;
  selectedCity: string;
  selectedDistrict: string;
}
