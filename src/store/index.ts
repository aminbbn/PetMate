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

export interface Reminder {
  id: string;
  title: string;
  date: string; // ISO string
  completed: boolean;
  alarmEnabled?: boolean;
  alarmDate?: string; // e.g. YYYY-MM-DD
  alarmTime?: string; // e.g. HH:MM
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
  
  setProfile: (profile: PetProfile) => void;
  updateProfile: (profile: Partial<PetProfile>) => void;
  
  addReminder: (title: string, date: string, alarmEnabled?: boolean, alarmDate?: string, alarmTime?: string) => void;
  updateReminder: (id: string, updates: Partial<Omit<Reminder, 'id'>>) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  
  addHealthRecord: (reason: string, notes: string, date: string) => void;
  updateHealthRecord: (id: string, updates: Partial<Omit<HealthRecord, 'id'>>) => void;
  deleteHealthRecord: (id: string) => void;
  
  addWeightEntry: (weight: number, date: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      reminders: [],
      healthRecords: [],
      weightHistory: [],
      
      setProfile: (profile) => set({ profile }),
      updateProfile: (updates) => set((state) => ({ 
         profile: state.profile ? { ...state.profile, ...updates } : null 
      })),
      
      addReminder: (title, date, alarmEnabled, alarmDate, alarmTime) => set((state) => ({
        reminders: [
          ...state.reminders,
          { 
            id: uuidv4(), 
            title, 
            date, 
            completed: false,
            alarmEnabled,
            alarmDate,
            alarmTime
          }
        ]
      })),
      updateReminder: (id, updates) => set((state) => ({
        reminders: state.reminders.map(r =>
          r.id === id ? { ...r, ...updates } : r
        )
      })),
      toggleReminder: (id) => set((state) => ({
        reminders: state.reminders.map(r => 
          r.id === id ? { ...r, completed: !r.completed } : r
        )
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
