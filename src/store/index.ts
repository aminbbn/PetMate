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
  
  addReminder: (title: string, date: string) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  
  addHealthRecord: (reason: string, notes: string, date: string) => void;
  
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
      
      addReminder: (title, date) => set((state) => ({
        reminders: [
          ...state.reminders,
          { id: uuidv4(), title, date, completed: false }
        ]
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
