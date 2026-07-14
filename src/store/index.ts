import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { VetContact, CreateVetContactInput, UpdateVetContactInput } from '../pages/vets/vetsTypes';
import { BehaviorObservation, BehaviorAssessment } from '../pages/translator/behaviorTypes';
import {
  TrainingGoal,
  TrainingSession,
  CreateTrainingGoalInput,
  UpdateTrainingGoalInput,
  TrainingGoalStatus,
  StartTrainingSessionInput,
  CreateTrainingAttemptInput,
  UpdateTrainingSessionInput,
  EndTrainingSessionInput
} from '../pages/coach/trainingTypes';
import { DEMO_SERVICES } from '../pages/navigator/serviceFixtures';
import { CartState, FavoriteProduct } from '../pages/shop/shopTypes';
import {
  PetFood,
  FeedingPlan,
  MealLog,
  HydrationLog,
  FoodSensitivity,
  NutritionSettings,
  CreatePetFoodInput,
  UpdatePetFoodInput,
  CreateFeedingPlanInput,
  UpdateFeedingPlanInput,
  CreateMealLogInput,
  UpdateMealLogInput,
  CreateHydrationLogInput,
  CreateFoodSensitivityInput,
  UpdateFoodSensitivityInput
} from '../pages/nutrition/nutritionTypes';

export interface LegacyVet {
  id: string;
  name: string;
  clinic: string;
  phone: string;
  specialty: string;
  isEmergency: boolean;
  notes: string;
  sourceServiceId?: string;
  petId?: string;
}

export type Vet = LegacyVet;

export type PetType = 'dog' | 'cat';

export interface PetProfile {
  id: string;
  name: string;
  type: PetType;
  breed: string;
  age: number;
  weight: number;
  photoUrl?: string;
}

export type ReminderCategory =
  | "health"
  | "nutrition"
  | "grooming"
  | "activity"
  | "appointment"
  | "medication"
  | "other";

export type RecurrenceFrequency =
  | "once"
  | "daily"
  | "weekly"
  | "monthly"
  | "custom";

export interface ReminderRecurrence {
  frequency: RecurrenceFrequency;
  interval?: number;
  weekdays?: number[];
  endAt?: string;
}

export interface ReminderNotification {
  enabled: boolean;
  offsetMinutes?: number;
}

export interface Reminder {
  id: string;
  petId: string;
  title: string;
  category: ReminderCategory;
  dueAt: string; // ISO string
  timeZone: string;
  recurrence?: ReminderRecurrence;
  notification?: ReminderNotification;
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;

  // Legacy compatibility fields
  completed: boolean;
  date: string; // ISO string
  alarmEnabled?: boolean;
  alarmDate?: string;
  alarmTime?: string;
}

export type HealthRecordKind =
  | 'visit'
  | 'vaccination'
  | 'lab_test'
  | 'imaging'
  | 'medication'
  | 'surgery'
  | 'allergy'
  | 'document'
  | 'note'
  | 'other';

export interface HealthAttachment {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  url?: string;
  storagePath?: string;
  createdAt: string;
}

export interface HealthRecord {
  id: string;
  petId: string;
  kind: HealthRecordKind;
  occurredAt: string; // YYYY-MM-DD or ISO string
  title: string;
  notes?: string;
  veterinarian?: string;
  clinic?: string;
  followUpAt?: string; // YYYY-MM-DD or ISO string
  attachments: HealthAttachment[];
  createdAt: string;
  updatedAt: string;

  // Legacy compatibility fields
  date: string; // ISO string or YYYY-MM-DD
  reason: string;
}

export type WeightMeasurementSource =
  | 'home'
  | 'veterinary_clinic'
  | 'groomer'
  | 'other';

export interface WeightEntry {
  id: string;
  petId: string;
  measuredAt: string; // ISO string
  weightKg: number;
  source?: WeightMeasurementSource;
  note?: string;
  createdAt: string;
  updatedAt: string;

  // Temporary legacy aliases only during migration:
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
  setAt: string;
  updatedAt: string;
}

export type MotionMode = 'system' | 'full' | 'reduced';
export type TextScale = 'normal' | 'large';
export type DigitStyle = 'persian' | 'latin';
export type DateDisplayMode = 'jalali' | 'gregorian';
export type AIContextMode = 'ask_each_time' | 'minimal' | 'off';

export interface AppPreferences {
  schemaVersion: number;
  notifications: {
    inAppEnabled: boolean;
    browserEnabled: boolean;
    defaultReminderOffsetMinutes: number;
    quietHoursEnabled: boolean;
    quietHoursStart?: string;
    quietHoursEnd?: string;
  };
  motion: {
    mode: MotionMode;
    cursorGlowEnabled: boolean;
    edgeGlowEnabled: boolean;
    semanticIconAnimationsEnabled: boolean;
    routeTransitionsEnabled: boolean;
  };
  accessibility: {
    textScale: TextScale;
    strongFocusIndicators: boolean;
  };
  display: {
    digitStyle: DigitStyle;
    dateDisplayMode: DateDisplayMode;
    firstDayOfWeek: 6;
    timeZoneMode: 'auto' | 'manual';
    manualTimeZone?: string;
    weightUnit: 'kg';
    temperatureUnit: 'celsius';
  };
  aiPrivacy: {
    contextMode: AIContextMode;
    persistConversations: boolean;
    allowMediaAnalysis: boolean;
    consentVersion?: string;
    consentUpdatedAt?: string;
  };
  data: {
    lastExportAt?: string;
    lastImportAt?: string;
  };
  updatedAt: string;
}

interface AppState {
  profile: PetProfile | null;
  reminders: Reminder[];
  healthRecords: HealthRecord[];
  weightHistory: WeightEntry[];
  weightGoals: WeightGoal[];
  vets: VetContact[];
  
  // Multi-pet support
  pets: PetProfile[];
  selectedPetId: string | null;
  addPet: (pet: PetProfile) => void;
  setSelectedPetId: (id: string | null) => void;

  setProfile: (profile: PetProfile) => void;
  updateProfile: (profile: Partial<PetProfile>) => void;

  // App Preferences
  preferences: AppPreferences;
  updatePreferences: (updates: Partial<AppPreferences> | ((prev: AppPreferences) => Partial<AppPreferences>)) => void;
  resetPreferences: () => void;

  // Robust Multi-Pet management CRUD
  updatePet: (id: string, updates: Partial<PetProfile>) => void;
  switchPet: (id: string) => void;
  deletePet: (id: string) => void;

  // Safe global data reset
  resetAllData: () => void;
  
  // Legacy actions (maintained for compatibility)
  addVet: (vet: any) => void;
  deleteVet: (id: string) => void;
  toggleVetEmergency: (id: string) => void;
  setVets: (vets: VetContact[]) => void;
  
  // New robust VetContact actions
  addVetContact: (input: CreateVetContactInput) => void;
  updateVetContact: (id: string, updates: UpdateVetContactInput) => void;
  deleteVetContact: (id: string) => void;
  setPrimaryVet: (id: string, petId?: string) => void;
  toggleVetPinned: (id: string) => void;
  toggleVetEmergencyUse: (id: string) => void;
  saveServiceAsVet: (serviceId: string) => void;
  
  addReminder: (
    title: string, 
    date: string, 
    alarmEnabled?: boolean, 
    alarmDate?: string, 
    alarmTime?: string,
    petId?: string,
    category?: ReminderCategory,
    recurrence?: ReminderRecurrence,
    notification?: ReminderNotification,
    notes?: string
  ) => void;
  updateReminder: (id: string, updates: Partial<Omit<Reminder, 'id'>>) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  
  addHealthRecord: (
    reasonOrInput: any,
    notes?: string,
    date?: string,
    petId?: string
  ) => void;
  updateHealthRecord: (id: string, updates: Partial<Omit<HealthRecord, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteHealthRecord: (id: string) => void;
  
  addWeightEntry: (
    weightOrInput: any,
    date?: string,
    petId?: string
  ) => void;
  updateWeightEntry: (id: string, updates: Partial<Omit<WeightEntry, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteWeightEntry: (id: string) => void;
  setWeightGoal: (goal: WeightGoal) => void;
  deleteWeightGoal: (petId: string) => void;

  // E-commerce Shop state & actions
  cart: CartState;
  favorites: FavoriteProduct[];
  addToCart: (input: { productId: string; variantId?: string; quantity?: number }) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;

  // Nutrition & Feeding Support
  foods: PetFood[];
  feedingPlans: FeedingPlan[];
  mealLogs: MealLog[];
  hydrationLogs: HydrationLog[];
  foodSensitivities: FoodSensitivity[];
  nutritionSettings: NutritionSettings[];

  addFood: (input: CreatePetFoodInput) => void;
  updateFood: (id: string, updates: UpdatePetFoodInput) => void;
  archiveFood: (id: string) => void;

  addFeedingPlan: (input: CreateFeedingPlanInput) => void;
  updateFeedingPlan: (id: string, updates: UpdateFeedingPlanInput) => void;
  activateFeedingPlan: (id: string) => void;
  archiveFeedingPlan: (id: string) => void;

  logMeal: (input: CreateMealLogInput) => void;
  updateMealLog: (id: string, updates: UpdateMealLogInput) => void;
  deleteMealLog: (id: string) => void;

  addHydrationLog: (input: CreateHydrationLogInput) => void;
  deleteHydrationLog: (id: string) => void;

  addFoodSensitivity: (input: CreateFoodSensitivityInput) => void;
  updateFoodSensitivity: (id: string, updates: UpdateFoodSensitivityInput) => void;
  deleteFoodSensitivity: (id: string) => void;

  // Behavior Observation & Assessment support
  behaviorObservations: BehaviorObservation[];
  behaviorAssessments: BehaviorAssessment[];
  addBehaviorObservation: (input: Omit<BehaviorObservation, 'id' | 'observedAt'>) => void;
  updateBehaviorObservation: (id: string, updates: Partial<Omit<BehaviorObservation, 'id'>>) => void;
  deleteBehaviorObservation: (id: string) => void;
  addBehaviorAssessment: (input: Omit<BehaviorAssessment, 'id' | 'createdAt'>) => void;
  deleteBehaviorAssessment: (id: string) => void;

  // Training & Coach Module
  trainingGoals: TrainingGoal[];
  trainingSessions: TrainingSession[];
  addTrainingGoal: (input: CreateTrainingGoalInput) => void;
  updateTrainingGoal: (id: string, updates: UpdateTrainingGoalInput) => void;
  setTrainingGoalStatus: (id: string, status: TrainingGoalStatus) => void;
  deleteTrainingGoal: (id: string) => void;
  startTrainingSession: (input: StartTrainingSessionInput) => string;
  addTrainingAttempt: (sessionId: string, input: CreateTrainingAttemptInput) => void;
  updateTrainingSession: (sessionId: string, updates: UpdateTrainingSessionInput) => void;
  endTrainingSession: (sessionId: string, input: EndTrainingSessionInput) => void;
  deleteTrainingSession: (id: string) => void;
}

// Compatibility migration for old reminders
export const migrateReminder = (r: any, profileId: string | null): Reminder => {
  let title = r.title || '';
  let category: ReminderCategory = r.category || 'other';
  
  if (title.startsWith('[')) {
    const endIdx = title.indexOf(']');
    if (endIdx !== -1) {
      const tag = title.substring(1, endIdx).trim();
      title = title.substring(endIdx + 1).trim();
      
      if (tag === 'سلامت') category = 'health';
      else if (tag === 'تغذیه') category = 'nutrition';
      else if (tag === 'نظافت') category = 'grooming';
      else if (tag === 'بازی' || tag === 'بازی و سرگرمی') category = 'activity';
      else if (tag === 'ویزیت' || tag === 'ویزیت دامپزشک') category = 'appointment';
      else if (tag === 'دارو' || tag === 'قرص') category = 'medication';
    }
  }

  const dueAt = r.dueAt || r.date || new Date().toISOString();
  
  return {
    ...r,
    id: r.id,
    petId: r.petId || profileId || '',
    title: title,
    category: category,
    dueAt: dueAt,
    timeZone: r.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    recurrence: r.recurrence || (r.alarmEnabled ? undefined : { frequency: 'once' }),
    notification: r.notification || (r.alarmEnabled ? { enabled: true, offsetMinutes: 0 } : { enabled: false }),
    notes: r.notes || '',
    completedAt: r.completedAt || (r.completed ? new Date().toISOString() : undefined),
    createdAt: r.createdAt || r.date || new Date().toISOString(),
    updatedAt: r.updatedAt || new Date().toISOString(),
    // Backward-compatible fields
    completed: r.completed ?? false,
    date: r.date || dueAt,
    alarmEnabled: r.alarmEnabled,
    alarmDate: r.alarmDate,
    alarmTime: r.alarmTime
  };
};

export const migrateSingleVet = (v: any): VetContact => {
  if (v.phones && Array.isArray(v.phones)) {
    return v as VetContact;
  }
  const phoneStr = v.phone || '';
  const isEmergency = !!v.isEmergency;
  const phonesList = phoneStr ? [{
    id: uuidv4(),
    label: isEmergency ? 'emergency' as const : 'clinic' as const,
    displayValue: phoneStr,
    normalizedValue: phoneStr,
    isPrimary: true
  }] : [];
  return {
    id: v.id || `vet-${uuidv4()}`,
    name: v.name || '',
    clinic: v.clinic || '',
    specialty: v.specialty || '',
    phones: phonesList,
    address: v.address || '',
    website: v.website || '',
    notes: v.notes || '',
    role: isEmergency ? 'emergency_backup' as const : 'general' as const,
    isPinned: isEmergency,
    useForEmergency: isEmergency,
    emergencyAvailability: isEmergency ? 'user_reported' as const : 'unknown' as const,
    emergencyVerifiedAt: isEmergency ? new Date().toISOString() : undefined,
    petIds: v.petId ? [v.petId] : [],
    tags: [],
    source: v.sourceServiceId ? 'service_directory' as const : 'user_entered' as const,
    sourceServiceId: v.sourceServiceId,
    createdAt: v.createdAt || new Date().toISOString(),
    updatedAt: v.updatedAt || new Date().toISOString(),
    // compatibility
    phone: phoneStr,
    isEmergency: isEmergency
  };
};

export const DEFAULT_PREFERENCES: AppPreferences = {
  schemaVersion: 1,
  notifications: {
    inAppEnabled: true,
    browserEnabled: false,
    defaultReminderOffsetMinutes: 15,
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00'
  },
  motion: {
    mode: 'full',
    cursorGlowEnabled: true,
    edgeGlowEnabled: true,
    semanticIconAnimationsEnabled: true,
    routeTransitionsEnabled: true
  },
  accessibility: {
    textScale: 'normal',
    strongFocusIndicators: false
  },
  display: {
    digitStyle: 'persian',
    dateDisplayMode: 'jalali',
    firstDayOfWeek: 6,
    timeZoneMode: 'auto',
    manualTimeZone: 'Asia/Tehran',
    weightUnit: 'kg',
    temperatureUnit: 'celsius'
  },
  aiPrivacy: {
    contextMode: 'ask_each_time',
    persistConversations: false,
    allowMediaAnalysis: false,
    consentVersion: '1.0',
    consentUpdatedAt: new Date().toISOString()
  },
  data: {},
  updatedAt: new Date().toISOString()
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      reminders: [],
      healthRecords: [],
      weightHistory: [],
      weightGoals: [],
      vets: [
        {
          id: 'vet-1',
          name: 'دکتر علیرضا مرادی',
          clinic: 'کلینیک تخصصی آریا',
          specialty: 'متخصص داخلی و غدد حیوانات کوچک',
          phones: [
            {
              id: 'phone-1-1',
              label: 'emergency',
              displayValue: '02122003344',
              normalizedValue: '02122003344',
              isPrimary: true
            }
          ],
          address: 'تهران، خیابان شریعتی، بالاتر از پل صدر، پلاک ۱۲',
          website: 'https://aria-clinic-demo.ir',
          notes: 'پزشک اصلی همیشگی، واکسیناسیون‌های سالانه و آزمایش خون دوره‌ای در این مرکز انجام می‌شود.',
          role: 'primary',
          isPinned: true,
          useForEmergency: true,
          emergencyAvailability: 'user_reported',
          emergencyVerifiedAt: new Date().toISOString(),
          petIds: [],
          tags: ['داخلی', 'واکسیناسیون'],
          source: 'user_entered',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          phone: '02122003344',
          isEmergency: true
        },
        {
          id: 'vet-2',
          name: 'دکتر مریم سعادت',
          clinic: 'بیمارستان دامپزشکی مهرگان',
          specialty: 'جراح عمومی و دندانپزشک اختصاصی پت',
          phones: [
            {
              id: 'phone-2-1',
              label: 'clinic',
              displayValue: '02188339900',
              normalizedValue: '02188339900',
              isPrimary: true
            }
          ],
          address: 'تهران، بزرگراه کردستان، خیابان جلال آل احمد، پلاک ۴',
          website: '',
          notes: 'عملیات جرم‌گیری دندان و جراحی‌های سرپایی را با نظارت مستقیم ایشان انجام می‌دهیم.',
          role: 'specialist',
          isPinned: false,
          useForEmergency: false,
          emergencyAvailability: 'unknown',
          petIds: [],
          tags: ['جراحی', 'دندانپزشکی'],
          source: 'user_entered',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          phone: '02188339900',
          isEmergency: false
        }
      ],
      
      // Multi-pet support
      pets: [],
      selectedPetId: null,

      // E-commerce Shop state & actions
      cart: { items: [], updatedAt: new Date().toISOString() },
      favorites: [],

      foods: [],
      feedingPlans: [],
      mealLogs: [],
      hydrationLogs: [],
      foodSensitivities: [],
      nutritionSettings: [],
      behaviorObservations: [],
      behaviorAssessments: [],
      trainingGoals: [],
      trainingSessions: [],
      preferences: DEFAULT_PREFERENCES,

      addToCart: (input) => set((state) => {
        const cartState = state.cart || { items: [], updatedAt: new Date().toISOString() };
        const items = [...(cartState.items || [])];
        const existingIdx = items.findIndex(item => item.productId === input.productId && item.variantId === input.variantId);
        const qtyToAdd = input.quantity !== undefined ? input.quantity : 1;
        
        if (existingIdx !== -1) {
          items[existingIdx] = {
            ...items[existingIdx],
            quantity: items[existingIdx].quantity + qtyToAdd,
            updatedAt: new Date().toISOString()
          };
        } else {
          items.push({
            productId: input.productId,
            variantId: input.variantId,
            quantity: qtyToAdd,
            currency: 'IRT',
            addedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
        return {
          cart: {
            ...cartState,
            items,
            updatedAt: new Date().toISOString()
          }
        };
      }),

      updateCartQuantity: (productId, quantity) => set((state) => {
        const cartState = state.cart || { items: [], updatedAt: new Date().toISOString() };
        if (quantity < 1) return {};
        const items = (cartState.items || []).map(item => {
          if (item.productId === productId) {
            return { ...item, quantity, updatedAt: new Date().toISOString() };
          }
          return item;
        });
        return {
          cart: {
            ...cartState,
            items,
            updatedAt: new Date().toISOString()
          }
        };
      }),

      removeFromCart: (productId) => set((state) => {
        const cartState = state.cart || { items: [], updatedAt: new Date().toISOString() };
        const items = (cartState.items || []).filter(item => item.productId !== productId);
        return {
          cart: {
            ...cartState,
            items,
            updatedAt: new Date().toISOString()
          }
        };
      }),

      clearCart: () => set((state) => ({
        cart: {
          items: [],
          updatedAt: new Date().toISOString()
        }
      })),

      toggleFavorite: (productId) => set((state) => {
        const favorites = [...(state.favorites || [])];
        const existingIdx = favorites.findIndex(fav => fav.productId === productId);
        if (existingIdx !== -1) {
          favorites.splice(existingIdx, 1);
        } else {
          favorites.push({
            productId,
            createdAt: new Date().toISOString()
          });
        }
        return { favorites };
      }),
      
      addPet: (pet) => set((state) => {
        const currentPets = state.pets || [];
        const exists = currentPets.some(p => p.id === pet.id);
        const newPets = exists ? currentPets.map(p => p.id === pet.id ? pet : p) : [...currentPets, pet];
        return {
          pets: newPets,
          selectedPetId: state.selectedPetId || pet.id,
          profile: state.profile || pet
        };
      }),
      setSelectedPetId: (id) => set({ selectedPetId: id }),

      setProfile: (profile) => set((state) => {
        const currentPets = state.pets || [];
        const exists = currentPets.some(p => p.id === profile.id);
        const newPets = exists ? currentPets.map(p => p.id === profile.id ? profile : p) : [...currentPets, profile];
        return {
          profile,
          pets: newPets,
          selectedPetId: state.selectedPetId || profile.id
        };
      }),
      updateProfile: (updates) => set((state) => {
        if (!state.profile) return {};
        const updated = { ...state.profile, ...updates };
        const currentPets = state.pets || [];
        const newPets = currentPets.map(p => p.id === updated.id ? updated : p);
        return {
          profile: updated,
          pets: newPets
        };
      }),

      updatePreferences: (updates) => set((state) => {
        const currentPrefs = state.preferences || DEFAULT_PREFERENCES;
        const nextPrefs = typeof updates === 'function' ? updates(currentPrefs) : updates;
        return {
          preferences: {
            ...currentPrefs,
            ...nextPrefs,
            notifications: {
              ...(currentPrefs.notifications || DEFAULT_PREFERENCES.notifications),
              ...(nextPrefs.notifications || {})
            },
            motion: {
              ...(currentPrefs.motion || DEFAULT_PREFERENCES.motion),
              ...(nextPrefs.motion || {})
            },
            accessibility: {
              ...(currentPrefs.accessibility || DEFAULT_PREFERENCES.accessibility),
              ...(nextPrefs.accessibility || {})
            },
            display: {
              ...(currentPrefs.display || DEFAULT_PREFERENCES.display),
              ...(nextPrefs.display || {})
            },
            aiPrivacy: {
              ...(currentPrefs.aiPrivacy || DEFAULT_PREFERENCES.aiPrivacy),
              ...(nextPrefs.aiPrivacy || {})
            },
            data: {
              ...(currentPrefs.data || DEFAULT_PREFERENCES.data),
              ...(nextPrefs.data || {})
            },
            updatedAt: new Date().toISOString()
          }
        };
      }),
      resetPreferences: () => set({ preferences: DEFAULT_PREFERENCES }),

      updatePet: (id, updates) => set((state) => {
        const currentPets = state.pets || [];
        const nextPets = currentPets.map(p => p.id === id ? { ...p, ...updates } : p);
        
        let nextProfile = state.profile;
        if (state.profile?.id === id) {
          nextProfile = { ...state.profile, ...updates };
        }
        
        return {
          pets: nextPets,
          profile: nextProfile
        };
      }),

      switchPet: (id) => set((state) => {
        const targetPet = (state.pets || []).find(p => p.id === id);
        if (!targetPet) return {};
        return {
          selectedPetId: id,
          profile: targetPet
        };
      }),

      deletePet: (id) => set((state) => {
        const nextPets = (state.pets || []).filter(p => p.id !== id);
        
        // Clean related records to avoid dangling data
        const nextReminders = (state.reminders || []).filter(r => r.petId !== id);
        const nextHealthRecords = (state.healthRecords || []).filter(h => h.petId !== id);
        const nextWeightHistory = (state.weightHistory || []).filter(w => w.petId !== id);
        const nextWeightGoals = (state.weightGoals || []).filter(g => g.petId !== id);
        const nextFoods = (state.foods || []).filter(f => f.petId !== id);
        const nextFeedingPlans = (state.feedingPlans || []).filter(p => p.petId !== id);
        const nextMealLogs = (state.mealLogs || []).filter(m => m.petId !== id);
        const nextHydrationLogs = (state.hydrationLogs || []).filter(h => h.petId !== id);
        const nextBehaviorObservations = (state.behaviorObservations || []).filter(o => o.petId !== id);
        const nextBehaviorAssessments = (state.behaviorAssessments || []).filter(a => a.petId !== id);
        const nextTrainingGoals = (state.trainingGoals || []).filter(g => g.petId !== id);
        const nextTrainingSessions = (state.trainingSessions || []).filter(s => s.petId !== id);

        let nextSelectedId = state.selectedPetId;
        let nextProfile = state.profile;

        if (state.selectedPetId === id) {
          if (nextPets.length > 0) {
            nextSelectedId = nextPets[0].id;
            nextProfile = nextPets[0];
          } else {
            nextSelectedId = null;
            nextProfile = null;
          }
        }

        return {
          pets: nextPets,
          selectedPetId: nextSelectedId,
          profile: nextProfile,
          reminders: nextReminders,
          healthRecords: nextHealthRecords,
          weightHistory: nextWeightHistory,
          weightGoals: nextWeightGoals,
          foods: nextFoods,
          feedingPlans: nextFeedingPlans,
          mealLogs: nextMealLogs,
          hydrationLogs: nextHydrationLogs,
          behaviorObservations: nextBehaviorObservations,
          behaviorAssessments: nextBehaviorAssessments,
          trainingGoals: nextTrainingGoals,
          trainingSessions: nextTrainingSessions
        };
      }),

      resetAllData: () => set({
        profile: null,
        reminders: [],
        healthRecords: [],
        weightHistory: [],
        weightGoals: [],
        pets: [],
        selectedPetId: null,
        cart: { items: [], updatedAt: new Date().toISOString() },
        favorites: [],
        foods: [],
        feedingPlans: [],
        mealLogs: [],
        hydrationLogs: [],
        foodSensitivities: [],
        nutritionSettings: [],
        behaviorObservations: [],
        behaviorAssessments: [],
        trainingGoals: [],
        trainingSessions: [],
        preferences: DEFAULT_PREFERENCES
      }),
      addVet: (vet) => set((state) => {
        const currentVets = state.vets || [];
        const exists = currentVets.some(v => v.id === vet.id || (vet.sourceServiceId && v.sourceServiceId === vet.sourceServiceId));
        if (exists) return {};
        const migratedVet = migrateSingleVet(vet);
        return { vets: [migratedVet, ...currentVets] };
      }),
      deleteVet: (id) => set((state) => ({
        vets: (state.vets || []).filter(v => v.id !== id)
      })),
      toggleVetEmergency: (id) => set((state) => ({
        vets: (state.vets || []).map(v => v.id === id ? { ...v, useForEmergency: !v.useForEmergency, isEmergency: !v.useForEmergency, updatedAt: new Date().toISOString() } : v)
      })),
      setVets: (vets) => set({ vets }),

      addVetContact: (input) => set((state) => {
        const currentVets = state.vets || [];
        const exists = currentVets.some(v => v.sourceServiceId && input.sourceServiceId && v.sourceServiceId === input.sourceServiceId);
        if (exists) return {};
        
        const nowStr = new Date().toISOString();
        const phones = input.phones.map((p, idx) => ({
          ...p,
          id: `phone-${Date.now()}-${idx}-${uuidv4().substring(0, 4)}`,
          isPrimary: p.isPrimary ?? (idx === 0)
        }));
        
        const isEmergency = input.useForEmergency || input.role === 'emergency_backup';
        
        const newContact: VetContact = {
          id: `vet-${Date.now()}-${uuidv4().substring(0, 4)}`,
          name: input.name,
          clinic: input.clinic,
          specialty: input.specialty,
          phones,
          address: input.address,
          website: input.website,
          notes: input.notes,
          role: input.role,
          isPinned: false,
          useForEmergency: input.useForEmergency,
          emergencyAvailability: input.emergencyAvailability,
          emergencyVerifiedAt: input.useForEmergency ? nowStr : undefined,
          petIds: input.petIds,
          tags: input.tags,
          source: input.source || 'user_entered',
          sourceServiceId: input.sourceServiceId,
          createdAt: nowStr,
          updatedAt: nowStr,
          // Compatibility
          phone: phones.find(p => p.isPrimary)?.displayValue || '',
          isEmergency
        };
        
        return { vets: [newContact, ...currentVets] };
      }),
      updateVetContact: (id, updates) => set((state) => {
        const currentVets = state.vets || [];
        return {
          vets: currentVets.map(v => {
            if (v.id !== id) return v;
            
            const cleanPhones = updates.phones
              ? updates.phones.map((p, idx) => ({
                  ...p,
                  id: (p as any).id || `phone-${Date.now()}-${idx}-${uuidv4().substring(0, 4)}`
                }))
              : undefined;
            
            const merged = { 
              ...v, 
              ...updates, 
              phones: cleanPhones || v.phones,
              updatedAt: new Date().toISOString() 
            };
            
            // Ensure compat fields stay correct
            if (cleanPhones) {
              merged.phone = cleanPhones.find(p => p.isPrimary)?.displayValue || merged.phone;
            }
            if (updates.useForEmergency !== undefined || updates.role !== undefined) {
              merged.isEmergency = updates.useForEmergency || merged.role === 'emergency_backup';
            }
            return merged;
          })
        };
      }),
      deleteVetContact: (id) => set((state) => ({
        vets: (state.vets || []).filter(v => v.id !== id)
      })),
      setPrimaryVet: (id, petId) => set((state) => {
        const currentVets = state.vets || [];
        const activePetId = petId || state.selectedPetId || state.profile?.id || '';
        
        return {
          vets: currentVets.map(v => {
            if (v.id === id) {
              const updatedPetIds = v.petIds.includes(activePetId) ? v.petIds : [...v.petIds, activePetId];
              return {
                ...v,
                role: 'primary',
                petIds: updatedPetIds,
                updatedAt: new Date().toISOString()
              };
            } else if (v.role === 'primary' && v.petIds.includes(activePetId)) {
              return {
                ...v,
                role: 'general',
                updatedAt: new Date().toISOString()
              };
            }
            return v;
          })
        };
      }),
      toggleVetPinned: (id) => set((state) => ({
        vets: (state.vets || []).map(v => v.id === id ? { ...v, isPinned: !v.isPinned, updatedAt: new Date().toISOString() } : v)
      })),
      toggleVetEmergencyUse: (id) => set((state) => ({
        vets: (state.vets || []).map(v => {
          if (v.id === id) {
            const nextVal = !v.useForEmergency;
            return {
              ...v,
              useForEmergency: nextVal,
              emergencyVerifiedAt: nextVal ? new Date().toISOString() : undefined,
              isEmergency: nextVal || v.role === 'emergency_backup',
              updatedAt: new Date().toISOString()
            };
          }
          return v;
        })
      })),
      saveServiceAsVet: (serviceId) => set((state) => {
        const service = DEMO_SERVICES.find(s => s.id === serviceId);
        if (!service) return {};
        
        const isEmergency = service.emergencyCapability;
        const phone = service.phone || '';
        const phones = phone ? [{
          id: `phone-${Date.now()}-${uuidv4().substring(0, 4)}`,
          label: isEmergency ? 'emergency' as const : 'clinic' as const,
          displayValue: phone,
          normalizedValue: phone,
          isPrimary: true
        }] : [];
        
        const newVet: VetContact = {
          id: `vet-${service.id}`,
          name: service.name.replace(' (نمایشی)', ''),
          clinic: service.name.replace(' (نمایشی)', ''),
          specialty: service.specialties.join('، '),
          phones,
          address: service.address,
          website: service.website || '',
          notes: service.description || '',
          role: isEmergency ? 'emergency_backup' : 'general',
          isPinned: false,
          useForEmergency: isEmergency,
          emergencyAvailability: isEmergency ? 'verified_24h' : 'unknown',
          emergencyVerifiedAt: service.emergencyVerifiedAt || (isEmergency ? new Date().toISOString() : undefined),
          petIds: [],
          tags: service.specialties,
          source: service.verificationStatus === 'verified' ? 'verified_service' : 'service_directory',
          sourceServiceId: service.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // Compatibility
          phone,
          isEmergency
        };
        
        const currentVets = state.vets || [];
        if (currentVets.some(v => v.sourceServiceId === serviceId || v.id === newVet.id)) return {};
        return { vets: [newVet, ...currentVets] };
      }),
      
      addReminder: (title, date, alarmEnabled, alarmDate, alarmTime, petId, category, recurrence, notification, notes) => set((state) => {
        const cleanPetId = petId || state.selectedPetId || state.profile?.id || '';
        const cleanCategory = category || 'other';
        const cleanTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const nowStr = new Date().toISOString();
        
        const newReminder: Reminder = {
          id: uuidv4(),
          petId: cleanPetId,
          title,
          category: cleanCategory,
          dueAt: date,
          timeZone: cleanTimeZone,
          recurrence: recurrence || { frequency: 'once' },
          notification: notification || { enabled: !!alarmEnabled, offsetMinutes: 0 },
          notes: notes || '',
          createdAt: nowStr,
          updatedAt: nowStr,
          
          // Backward compatibility
          completed: false,
          date,
          alarmEnabled,
          alarmDate,
          alarmTime
        };

        return {
          reminders: [
            ...state.reminders,
            newReminder
          ]
        };
      }),
      updateReminder: (id, updates) => set((state) => ({
        reminders: state.reminders.map(r =>
          r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
        )
      })),
      toggleReminder: (id) => set((state) => ({
        reminders: state.reminders.map(r => {
          if (r.id === id) {
            const completed = !r.completed;
            const completedAt = completed ? new Date().toISOString() : undefined;
            return {
              ...r,
              completed,
              completedAt,
              updatedAt: new Date().toISOString()
            };
          }
          return r;
        })
      })),
      deleteReminder: (id) => set((state) => ({
        reminders: state.reminders.filter(r => r.id !== id)
      })),
      
      addHealthRecord: (reasonOrInput, notes, date, petId) => set((state) => {
        let cleanKind: HealthRecordKind = 'note';
        let cleanOccurredAt = '';
        let cleanTitle = '';
        let cleanNotes = '';
        let cleanPetId = '';
        let cleanVet = '';
        let cleanClinic = '';
        let cleanFollowUpAt: string | undefined = undefined;
        let cleanAttachments: HealthAttachment[] = [];

        if (typeof reasonOrInput === 'object' && reasonOrInput !== null) {
          const input = reasonOrInput as any;
          cleanTitle = input.title || input.reason || '';
          cleanNotes = input.notes || '';
          cleanOccurredAt = input.occurredAt || input.date || new Date().toISOString().split('T')[0];
          cleanPetId = input.petId || state.selectedPetId || state.profile?.id || '';
          cleanKind = input.kind || getKindFromKeywords(cleanTitle, cleanNotes);
          cleanVet = input.veterinarian || '';
          cleanClinic = input.clinic || '';
          cleanFollowUpAt = input.followUpAt;
          cleanAttachments = input.attachments || [];
        } else {
          cleanTitle = typeof reasonOrInput === 'string' ? reasonOrInput : '';
          cleanNotes = notes || '';
          cleanOccurredAt = date || new Date().toISOString().split('T')[0];
          cleanPetId = petId || state.selectedPetId || state.profile?.id || '';
          cleanKind = getKindFromKeywords(cleanTitle, cleanNotes);
        }

        const nowStr = new Date().toISOString();
        const newRecord: HealthRecord = {
          id: uuidv4(),
          petId: cleanPetId,
          kind: cleanKind,
          occurredAt: cleanOccurredAt,
          title: cleanTitle,
          notes: cleanNotes,
          veterinarian: cleanVet,
          clinic: cleanClinic,
          followUpAt: cleanFollowUpAt,
          attachments: cleanAttachments,
          createdAt: nowStr,
          updatedAt: nowStr,
          
          // Legacy fields
          date: cleanOccurredAt,
          reason: cleanTitle,
        };

        return {
          healthRecords: [newRecord, ...state.healthRecords]
        };
      }),
      updateHealthRecord: (id, updates) => set((state) => ({
        healthRecords: state.healthRecords.map(r => {
          if (r.id === id) {
            const merged = { ...r, ...updates, updatedAt: new Date().toISOString() };
            if (updates.occurredAt) merged.date = updates.occurredAt;
            if (updates.title) merged.reason = updates.title;
            return merged;
          }
          return r;
        })
      })),
      deleteHealthRecord: (id) => set((state) => ({
        healthRecords: state.healthRecords.filter(r => r.id !== id)
      })),
      
      addWeightEntry: (weightOrInput, date, petId) => set((state) => {
        let cleanWeight = 0;
        let cleanDate = '';
        let cleanPetId = '';
        let cleanSource: WeightMeasurementSource | undefined = undefined;
        let cleanNote: string | undefined = undefined;

        if (typeof weightOrInput === 'object' && weightOrInput !== null) {
          const input = weightOrInput as any;
          cleanWeight = input.weightKg !== undefined ? input.weightKg : (input.weight || 0);
          cleanDate = input.measuredAt || input.date || new Date().toISOString();
          cleanPetId = input.petId;
          cleanSource = input.source;
          cleanNote = input.note;
        } else {
          cleanWeight = Number(weightOrInput) || 0;
          cleanDate = date || new Date().toISOString();
          cleanPetId = petId || state.selectedPetId || state.profile?.id || '';
        }

        const nowStr = new Date().toISOString();
        const newEntry: WeightEntry = {
          id: uuidv4(),
          petId: cleanPetId,
          measuredAt: cleanDate,
          weightKg: cleanWeight,
          source: cleanSource,
          note: cleanNote,
          createdAt: nowStr,
          updatedAt: nowStr,

          // Legacy fields for backward compatibility
          date: cleanDate,
          weight: cleanWeight,
        };

        return {
          weightHistory: [
            ...state.weightHistory,
            newEntry
          ].sort((a, b) => new Date(a.measuredAt || a.date!).getTime() - new Date(b.measuredAt || b.date!).getTime())
        };
      }),

      updateWeightEntry: (id, updates) => set((state) => {
        const nowStr = new Date().toISOString();
        const updatedHistory = state.weightHistory.map(w => {
          if (w.id === id) {
            const merged = { ...w, ...updates, updatedAt: nowStr };
            if (updates.weightKg !== undefined) merged.weight = updates.weightKg;
            if (updates.measuredAt !== undefined) merged.date = updates.measuredAt;
            return merged;
          }
          return w;
        });
        return {
          weightHistory: updatedHistory.sort((a, b) => new Date(a.measuredAt || a.date!).getTime() - new Date(b.measuredAt || b.date!).getTime())
        };
      }),

      deleteWeightEntry: (id) => set((state) => ({
        weightHistory: state.weightHistory.filter(w => w.id !== id)
      })),

      setWeightGoal: (goal) => set((state) => {
        const existingGoals = state.weightGoals || [];
        const index = existingGoals.findIndex(g => g.petId === goal.petId);
        let newGoals = [];
        if (index !== -1) {
          newGoals = [...existingGoals];
          newGoals[index] = goal;
        } else {
          newGoals = [...existingGoals, goal];
        }
        return { weightGoals: newGoals };
      }),

      deleteWeightGoal: (petId) => set((state) => ({
        weightGoals: (state.weightGoals || []).filter(g => g.petId !== petId)
      })),

      addFood: (input) => set((state) => {
        const now = new Date().toISOString();
        const newFood: PetFood = {
          ...input,
          id: `food-${uuidv4()}`,
          createdAt: now,
          updatedAt: now
        };
        return { foods: [...(state.foods || []), newFood] };
      }),
      updateFood: (id, updates) => set((state) => ({
        foods: (state.foods || []).map(f => f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f)
      })),
      archiveFood: (id) => set((state) => ({
        foods: (state.foods || []).filter(f => f.id !== id)
      })),

      addFeedingPlan: (input) => set((state) => {
        const now = new Date().toISOString();
        const planMeals = input.meals.map((m, idx) => ({
          ...m,
          id: `meal-${uuidv4()}-${idx}`
        }));
        const newPlan: FeedingPlan = {
          ...input,
          id: `plan-${uuidv4()}`,
          status: 'draft',
          meals: planMeals,
          createdAt: now,
          updatedAt: now
        };
        return { feedingPlans: [...(state.feedingPlans || []), newPlan] };
      }),
      updateFeedingPlan: (id, updates) => set((state) => {
        const updatedPlans = (state.feedingPlans || []).map(p => {
          if (p.id !== id) return p;
          const cleanMeals = updates.meals
            ? updates.meals.map((m, idx) => ({
                ...m,
                id: (m as any).id || `meal-${uuidv4()}-${idx}`
              }))
            : p.meals;
          return {
            ...p,
            ...updates,
            meals: cleanMeals,
            updatedAt: new Date().toISOString()
          };
        });
        return { feedingPlans: updatedPlans };
      }),
      activateFeedingPlan: (id) => set((state) => {
        const activePetId = (state.feedingPlans || []).find(p => p.id === id)?.petId;
        if (!activePetId) return {};
        const updatedPlans = (state.feedingPlans || []).map(p => {
          if (p.petId === activePetId) {
            if (p.id === id) {
              return { ...p, status: 'active' as const, updatedAt: new Date().toISOString() };
            } else if (p.status === 'active') {
              return { ...p, status: 'archived' as const, updatedAt: new Date().toISOString() };
            }
          }
          return p;
        });
        return { feedingPlans: updatedPlans };
      }),
      archiveFeedingPlan: (id) => set((state) => ({
        feedingPlans: (state.feedingPlans || []).map(p => p.id === id ? { ...p, status: 'archived' as const, updatedAt: new Date().toISOString() } : p)
      })),

      logMeal: (input) => set((state) => {
        const newLog: MealLog = {
          ...input,
          id: `log-${uuidv4()}`,
          createdAt: new Date().toISOString()
        };
        return { mealLogs: [...(state.mealLogs || []), newLog] };
      }),
      updateMealLog: (id, updates) => set((state) => ({
        mealLogs: (state.mealLogs || []).map(l => l.id === id ? { ...l, ...updates } : l)
      })),
      deleteMealLog: (id) => set((state) => ({
        mealLogs: (state.mealLogs || []).filter(l => l.id !== id)
      })),

      addHydrationLog: (input) => set((state) => {
        const newLog: HydrationLog = {
          ...input,
          id: `hydro-${uuidv4()}`
        };
        return { hydrationLogs: [...(state.hydrationLogs || []), newLog] };
      }),
      deleteHydrationLog: (id) => set((state) => ({
        hydrationLogs: (state.hydrationLogs || []).filter(l => l.id !== id)
      })),

      addFoodSensitivity: (input) => set((state) => {
        const newSensitivity: FoodSensitivity = {
          ...input,
          id: `sens-${uuidv4()}`,
          recordedAt: new Date().toISOString()
        };
        return { foodSensitivities: [...(state.foodSensitivities || []), newSensitivity] };
      }),
      updateFoodSensitivity: (id, updates) => set((state) => ({
        foodSensitivities: (state.foodSensitivities || []).map(s => s.id === id ? { ...s, ...updates } : s)
      })),
      deleteFoodSensitivity: (id) => set((state) => ({
        foodSensitivities: (state.foodSensitivities || []).filter(s => s.id !== id)
      })),

      addBehaviorObservation: (input) => set((state) => {
        const now = new Date().toISOString();
        const newObs: BehaviorObservation = {
          ...input,
          id: `obs-${uuidv4()}`,
          observedAt: now
        };
        return { behaviorObservations: [newObs, ...(state.behaviorObservations || [])] };
      }),
      updateBehaviorObservation: (id, updates) => set((state) => ({
        behaviorObservations: (state.behaviorObservations || []).map(o => o.id === id ? { ...o, ...updates } : o)
      })),
      deleteBehaviorObservation: (id) => set((state) => ({
        behaviorObservations: (state.behaviorObservations || []).filter(o => o.id !== id)
      })),
      addBehaviorAssessment: (input) => set((state) => {
        const now = new Date().toISOString();
        const newAsst: BehaviorAssessment = {
          ...input,
          id: `asst-${uuidv4()}`,
          createdAt: now
        };
        return { behaviorAssessments: [newAsst, ...(state.behaviorAssessments || [])] };
      }),
      deleteBehaviorAssessment: (id) => set((state) => ({
        behaviorAssessments: (state.behaviorAssessments || []).filter(a => a.id !== id)
      })),

      addTrainingGoal: (input) => set((state) => {
        const now = new Date().toISOString();
        const newGoal: TrainingGoal = {
          ...input,
          id: `goal-${uuidv4()}`,
          createdAt: now,
          updatedAt: now
        };
        return { trainingGoals: [newGoal, ...(state.trainingGoals || [])] };
      }),
      updateTrainingGoal: (id, updates) => set((state) => {
        const now = new Date().toISOString();
        return {
          trainingGoals: (state.trainingGoals || []).map(g => g.id === id ? {
            ...g,
            ...updates,
            updatedAt: now
          } : g)
        };
      }),
      setTrainingGoalStatus: (id, status) => set((state) => {
        const now = new Date().toISOString();
        return {
          trainingGoals: (state.trainingGoals || []).map(g => g.id === id ? {
            ...g,
            status,
            achievedAt: status === 'achieved' ? now : g.achievedAt,
            updatedAt: now
          } : g)
        };
      }),
      deleteTrainingGoal: (id) => set((state) => ({
        trainingGoals: (state.trainingGoals || []).filter(g => g.id !== id),
        trainingSessions: (state.trainingSessions || []).filter(s => s.goalId !== id)
      })),
      startTrainingSession: (input) => {
        const now = new Date().toISOString();
        const sessionId = `sess-${uuidv4()}`;
        const newSession: TrainingSession = {
          ...input,
          id: sessionId,
          startedAt: now,
          attempts: [],
          petEngagement: 'unknown',
          createdAt: now,
          updatedAt: now
        };
        set((state) => ({
          trainingSessions: [newSession, ...(state.trainingSessions || [])]
        }));
        return sessionId;
      },
      addTrainingAttempt: (sessionId, input) => set((state) => {
        const now = new Date().toISOString();
        const newAttempt = {
          ...input,
          id: `att-${uuidv4()}`,
          recordedAt: now
        };
        return {
          trainingSessions: (state.trainingSessions || []).map(s => s.id === sessionId ? {
            ...s,
            attempts: [...s.attempts, newAttempt],
            updatedAt: now
          } : s)
        };
      }),
      updateTrainingSession: (sessionId, updates) => set((state) => {
        const now = new Date().toISOString();
        return {
          trainingSessions: (state.trainingSessions || []).map(s => s.id === sessionId ? {
            ...s,
            ...updates,
            updatedAt: now
          } : s)
        };
      }),
      endTrainingSession: (sessionId, input) => set((state) => {
        const now = new Date().toISOString();
        return {
          trainingSessions: (state.trainingSessions || []).map(s => s.id === sessionId ? {
            ...s,
            ...input,
            endedAt: now,
            updatedAt: now
          } : s)
        };
      }),
      deleteTrainingSession: (id) => set((state) => ({
        trainingSessions: (state.trainingSessions || []).filter(s => s.id !== id)
      })),
    }),
    {
      name: 'petmate-storage',
      version: 3,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          const records = persistedState.healthRecords || [];
          const profile = persistedState.profile;
          const pets = persistedState.pets || [];
          const selectedPetId = persistedState.selectedPetId || profile?.id || (pets[0]?.id) || '';

          const migratedRecords = records.map((r: any) => {
            const cleanTitle = r.title || r.reason || '';
            const cleanNotes = r.notes || '';
            const cleanOccurredAt = r.occurredAt || r.date || new Date().toISOString().split('T')[0];
            const cleanPetId = r.petId || selectedPetId;
            const cleanKind = r.kind || getKindFromKeywords(cleanTitle, cleanNotes);
            const createdAt = r.createdAt || r.date || cleanOccurredAt || new Date().toISOString();
            
            return {
              ...r,
              id: r.id,
              petId: cleanPetId,
              kind: cleanKind,
              occurredAt: cleanOccurredAt,
              title: cleanTitle,
              notes: cleanNotes,
              veterinarian: r.veterinarian || '',
              clinic: r.clinic || '',
              followUpAt: r.followUpAt,
              attachments: r.attachments || [],
              createdAt: createdAt,
              updatedAt: r.updatedAt || createdAt,
              // Legacy fields
              date: cleanOccurredAt,
              reason: cleanTitle,
            };
          });

          persistedState.healthRecords = migratedRecords;
        }

        if (version < 2) {
          const history = persistedState.weightHistory || [];
          const profile = persistedState.profile;
          const pets = persistedState.pets || [];
          const selectedPetId = persistedState.selectedPetId || profile?.id || (pets[0]?.id) || '';

          const migratedHistory = history.map((h: any) => {
            const measuredAt = h.measuredAt || h.date || new Date().toISOString();
            const weightKg = h.weightKg !== undefined ? h.weightKg : (h.weight || 0);
            const petId = h.petId || selectedPetId || profile?.id || '';
            const createdAt = h.createdAt || measuredAt;
            const updatedAt = h.updatedAt || createdAt;
            return {
              ...h,
              id: h.id,
              petId,
              measuredAt,
              weightKg,
              createdAt,
              updatedAt,
              // Legacy fields for dashboard support
              date: h.date || measuredAt,
              weight: h.weight !== undefined ? h.weight : weightKg
            };
          });

          persistedState.weightHistory = migratedHistory;
          persistedState.weightGoals = persistedState.weightGoals || [];
        }

        if (version < 3) {
          const legacyVets = persistedState.vets || [];
          persistedState.vets = legacyVets.map((v: any) => {
            if (v.phones && Array.isArray(v.phones)) {
              return v;
            }
            const phoneStr = v.phone || '';
            const isEmergency = !!v.isEmergency;
            const phonesList = phoneStr ? [{
              id: uuidv4(),
              label: isEmergency ? 'emergency' as const : 'clinic' as const,
              displayValue: phoneStr,
              normalizedValue: phoneStr,
              isPrimary: true
            }] : [];
            return {
              id: v.id || `vet-${uuidv4()}`,
              name: v.name || '',
              clinic: v.clinic || '',
              specialty: v.specialty || '',
              phones: phonesList,
              address: v.address || '',
              website: v.website || '',
              notes: v.notes || '',
              role: isEmergency ? 'emergency_backup' as const : 'general' as const,
              isPinned: isEmergency,
              useForEmergency: isEmergency,
              emergencyAvailability: isEmergency ? 'user_reported' as const : 'unknown' as const,
              emergencyVerifiedAt: isEmergency ? new Date().toISOString() : undefined,
              petIds: v.petId ? [v.petId] : [],
              tags: [],
              source: v.sourceServiceId ? 'service_directory' as const : 'user_entered' as const,
              sourceServiceId: v.sourceServiceId,
              createdAt: v.createdAt || new Date().toISOString(),
              updatedAt: v.updatedAt || new Date().toISOString(),
              // compatibility fields
              phone: phoneStr,
              isEmergency: isEmergency
            };
          });
        }

        persistedState.foods = persistedState.foods || [];
        persistedState.feedingPlans = persistedState.feedingPlans || [];
        persistedState.mealLogs = persistedState.mealLogs || [];
        persistedState.hydrationLogs = persistedState.hydrationLogs || [];
        persistedState.foodSensitivities = persistedState.foodSensitivities || [];
        persistedState.nutritionSettings = persistedState.nutritionSettings || [];
        persistedState.behaviorObservations = persistedState.behaviorObservations || [];
        persistedState.behaviorAssessments = persistedState.behaviorAssessments || [];
        persistedState.trainingGoals = persistedState.trainingGoals || [];
        persistedState.trainingSessions = persistedState.trainingSessions || [];

        return persistedState;
      }
    }
  )
);

export function getKindFromKeywords(title: string, notes: string): HealthRecordKind {
  const text = `${title} ${notes}`.toLowerCase();
  if (text.includes('واکسن') || text.includes('واکسیناسیون') || text.includes('vaccin') || text.includes('تزریق')) {
    return 'vaccination';
  }
  if (text.includes('آزمایش') || text.includes('تست') || text.includes('lab') || text.includes('test')) {
    return 'lab_test';
  }
  if (text.includes('سونوگرافی') || text.includes('رادیولوژی') || text.includes('عکس') || text.includes('تصویربرداری') || text.includes('x-ray') || text.includes('scan') || text.includes('imaging')) {
    return 'imaging';
  }
  if (text.includes('جراحی') || text.includes('عمل') || text.includes('surgery')) {
    return 'surgery';
  }
  if (text.includes('دارو') || text.includes('نسخه') || text.includes('medicat') || text.includes('pill') || text.includes('قرص')) {
    return 'medication';
  }
  if (text.includes('حساسیت') || text.includes('آلرژی') || text.includes('allerg')) {
    return 'allergy';
  }
  if (text.includes('ویزیت') || text.includes('معاینه') || text.includes('visit') || text.includes('checkup')) {
    return 'visit';
  }
  if (text.includes('سند') || text.includes('مدرک') || text.includes('فایل') || text.includes('doc')) {
    return 'document';
  }
  return 'note';
}


