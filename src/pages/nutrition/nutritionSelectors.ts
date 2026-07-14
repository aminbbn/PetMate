import { selectLatestEntry } from '../growth/growthSelectors';

export function selectActiveFeedingPlan(state: any) {
  const plans = state.feedingPlans || [];
  const petId = state.selectedPetId || state.profile?.id || '';
  return plans.find((p: any) => p.petId === petId && p.status === 'active');
}

export function selectPetPlans(state: any) {
  const plans = state.feedingPlans || [];
  const petId = state.selectedPetId || state.profile?.id || '';
  return plans.filter((p: any) => p.petId === petId);
}

export function selectPetFoods(state: any) {
  const foods = state.foods || [];
  const petId = state.selectedPetId || state.profile?.id || '';
  return foods.filter((f: any) => f.petId === petId);
}

export function selectPetSensitivities(state: any) {
  const sensitivities = state.foodSensitivities || [];
  const petId = state.selectedPetId || state.profile?.id || '';
  return sensitivities.filter((s: any) => s.petId === petId);
}

export function selectPetMealLogs(state: any) {
  const logs = state.mealLogs || [];
  const petId = state.selectedPetId || state.profile?.id || '';
  return logs.filter((l: any) => l.petId === petId);
}

export function selectPetHydrationLogs(state: any) {
  const logs = state.hydrationLogs || [];
  const petId = state.selectedPetId || state.profile?.id || '';
  return logs.filter((l: any) => l.petId === petId);
}

export function selectLatestWeight(state: any) {
  return selectLatestEntry(state);
}
