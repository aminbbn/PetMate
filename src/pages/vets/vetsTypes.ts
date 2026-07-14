export type VetContactRole =
  | 'primary'
  | 'specialist'
  | 'emergency_backup'
  | 'general'
  | 'other';

export type VetVerificationStatus =
  | 'user_entered'
  | 'service_directory'
  | 'verified_service';

export type EmergencyAvailability =
  | 'unknown'
  | 'user_reported'
  | 'verified_24h';

export interface VetPhone {
  id: string;
  label: 'clinic' | 'mobile' | 'emergency' | 'other';
  displayValue: string;
  normalizedValue: string;
  isPrimary: boolean;
}

export interface VetContact {
  id: string;
  name: string;
  clinic?: string;
  specialty?: string;
  phones: VetPhone[];
  address?: string;
  website?: string;
  notes?: string;
  role: VetContactRole;
  isPinned: boolean;
  useForEmergency: boolean;
  emergencyAvailability: EmergencyAvailability;
  emergencyVerifiedAt?: string;
  petIds: string[];
  tags: string[];
  source: VetVerificationStatus;
  sourceServiceId?: string;
  createdAt: string;
  updatedAt: string;

  // Legacy compatibility only during migration:
  phone?: string;
  isEmergency?: boolean;
}

export interface CreateVetContactInput {
  name: string;
  clinic?: string;
  specialty?: string;
  phones: Omit<VetPhone, 'id'>[];
  address?: string;
  website?: string;
  notes?: string;
  role: VetContactRole;
  useForEmergency: boolean;
  emergencyAvailability: EmergencyAvailability;
  petIds: string[];
  tags: string[];
  source?: VetVerificationStatus;
  sourceServiceId?: string;
}

export interface UpdateVetContactInput {
  name?: string;
  clinic?: string;
  specialty?: string;
  phones?: Omit<VetPhone, 'id'>[];
  address?: string;
  website?: string;
  notes?: string;
  role?: VetContactRole;
  isPinned?: boolean;
  useForEmergency?: boolean;
  emergencyAvailability?: EmergencyAvailability;
  emergencyVerifiedAt?: string;
  petIds?: string[];
  tags?: string[];
  source?: VetVerificationStatus;
  sourceServiceId?: string;
}
