import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

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

export interface Vet {
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

interface AppState {
  profile: PetProfile | null;
  reminders: Reminder[];
  healthRecords: HealthRecord[];
  weightHistory: WeightEntry[];
  weightGoals: WeightGoal[];
  vets: Vet[];
  
  // Multi-pet support
  pets: PetProfile[];
  selectedPetId: string | null;
  addPet: (pet: PetProfile) => void;
  setSelectedPetId: (id: string | null) => void;

  setProfile: (profile: PetProfile) => void;
  updateProfile: (profile: Partial<PetProfile>) => void;
  addVet: (vet: Vet) => void;
  deleteVet: (id: string) => void;
  toggleVetEmergency: (id: string) => void;
  setVets: (vets: Vet[]) => void;
  
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
          phone: '02122003344',
          specialty: 'متخصص داخلی و غدد حیوانات کوچک',
          isEmergency: true,
          notes: 'پزشک اصلی همیشگی، واکسیناسیون‌های سالانه و آزمایش خون دوره‌ای در این مرکز انجام می‌شود.'
        },
        {
          id: 'vet-2',
          name: 'دکتر مریم سعادت',
          clinic: 'بیمارستان دامپزشکی مهرگان',
          phone: '02188339900',
          specialty: 'جراح عمومی و دندانپزشک اختصاصی پت',
          isEmergency: false,
          notes: 'عملیات جرم‌گیری دندان و جراحی‌های سرپایی را با نظارت مستقیم ایشان انجام می‌دهیم.'
        }
      ],
      
      // Multi-pet support
      pets: [],
      selectedPetId: null,
      
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
      addVet: (vet) => set((state) => {
        const currentVets = state.vets || [];
        const exists = currentVets.some(v => v.id === vet.id || (vet.sourceServiceId && v.sourceServiceId === vet.sourceServiceId));
        if (exists) return {};
        return { vets: [vet, ...currentVets] };
      }),
      deleteVet: (id) => set((state) => ({
        vets: (state.vets || []).filter(v => v.id !== id)
      })),
      toggleVetEmergency: (id) => set((state) => ({
        vets: (state.vets || []).map(v => v.id === id ? { ...v, isEmergency: !v.isEmergency } : v)
      })),
      setVets: (vets) => set({ vets }),
      
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
    }),
    {
      name: 'petmate-storage',
      version: 2,
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


