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

export interface HealthRecord {
  id: string;
  date: string; // ISO string
  reason: string;
  notes: string;
}

export interface WeightEntry {
  id: string;
  date: string; // ISO string
  weight: number;
}

interface AppState {
  profile: PetProfile | null;
  reminders: Reminder[];
  healthRecords: HealthRecord[];
  weightHistory: WeightEntry[];
  
  // Multi-pet support
  pets: PetProfile[];
  selectedPetId: string | null;
  addPet: (pet: PetProfile) => void;
  setSelectedPetId: (id: string | null) => void;

  setProfile: (profile: PetProfile) => void;
  updateProfile: (profile: Partial<PetProfile>) => void;
  
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
  
  addHealthRecord: (reason: string, notes: string, date: string) => void;
  updateHealthRecord: (id: string, updates: Partial<Omit<HealthRecord, 'id'>>) => void;
  deleteHealthRecord: (id: string) => void;
  
  addWeightEntry: (weight: number, date: string) => void;
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
      
      addHealthRecord: (reason, notes, date) => set((state) => ({
        healthRecords: [
          { id: uuidv4(), reason, notes, date },
          ...state.healthRecords
        ]
      })),
      updateHealthRecord: (id, updates) => set((state) => ({
        healthRecords: state.healthRecords.map(r =>
          r.id === id ? { ...r, ...updates } : r
        )
      })),
      deleteHealthRecord: (id) => set((state) => ({
        healthRecords: state.healthRecords.filter(r => r.id !== id)
      })),
      
      addWeightEntry: (weight, date) => set((state) => ({
        weightHistory: [
          ...state.weightHistory,
          { id: uuidv4(), weight, date }
        ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      })),
    }),
    {
      name: 'petmate-storage',
    }
  )
);

