import { useAppStore } from '../../store';
import { WeightEntry, WeightGoal } from './growthTypes';

/**
 * Gets all weight entries for the currently selected pet, sorted chronologically.
 */
export function selectSortedEntries(state: any): WeightEntry[] {
  const history = state.weightHistory || [];
  const selectedPetId = state.selectedPetId;
  const profile = state.profile;

  // Filter entries for the selected pet. If selectedPetId matches the profile or is null/empty and matches profile.id.
  const filtered = history.filter((h: any) => {
    return h.petId === selectedPetId || (!h.petId && selectedPetId === profile?.id);
  });

  return [...filtered].sort((a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime());
}

/**
 * Selects the latest weight entry (the one with the latest measuredAt).
 */
export function selectLatestEntry(state: any): WeightEntry | undefined {
  const sorted = selectSortedEntries(state);
  if (sorted.length === 0) return undefined;
  return sorted[sorted.length - 1];
}

/**
 * Selects the second latest weight entry for change comparisons.
 */
export function selectPreviousEntry(state: any): WeightEntry | undefined {
  const sorted = selectSortedEntries(state);
  if (sorted.length < 2) return undefined;
  return sorted[sorted.length - 2];
}

/**
 * Gets the active weight goal for the selected pet.
 */
export function selectWeightGoal(state: any): WeightGoal | undefined {
  const goals = state.weightGoals || [];
  const selectedPetId = state.selectedPetId;
  const profile = state.profile;
  const petId = selectedPetId || profile?.id || '';
  
  return goals.find((g: any) => g.petId === petId);
}
