import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { MotionPage } from '../../motion';
import { toPersian } from '../../lib/persian';

// Subcomponents
import { NutritionHeader } from './NutritionHeader';
import { NutritionOverview } from './NutritionOverview';
import { NutritionTabs, NutritionTab } from './NutritionTabs';
import { TodayFeedingView } from './TodayFeedingView';
import { WeeklyFeedingView } from './WeeklyFeedingView';
import { FoodLibraryView } from './FoodLibraryView';
import { NutritionHistoryView } from './NutritionHistoryView';
import { NutritionSettingsView } from './NutritionSettingsView';
import { NutritionSafetyNotice } from './NutritionSafetyNotice';

// Dialogs
import { FoodDialog } from './FoodDialog';
import { FeedingPlanDialog } from './FeedingPlanDialog';
import { PetFood } from './nutritionTypes';

export default function NutritionPage() {
  const store = useAppStore();
  const currentPet = store.pets.find(p => p.id === store.selectedPetId) || store.profile;

  // Tabs state
  const [activeTab, setActiveTab] = useState<NutritionTab>('today');

  // Modal dialog states
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isFoodDialogOpen, setIsFoodDialogOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<PetFood | undefined>(undefined);

  const handleAddPlanClick = () => {
    setIsPlanDialogOpen(true);
  };

  const handleAddFoodClick = () => {
    setEditingFood(undefined);
    setIsFoodDialogOpen(true);
  };

  const handleEditFoodClick = (food: PetFood) => {
    setEditingFood(food);
    setIsFoodDialogOpen(true);
  };

  const handlePlanSuccess = () => {
    setIsPlanDialogOpen(false);
    // Switch to today's view to show new plan
    setActiveTab('today');
  };

  const handleFoodSuccess = () => {
    setIsFoodDialogOpen(false);
    setEditingFood(undefined);
    // Switch to library to show added food
    setActiveTab('library');
  };

  const handleLogMealClick = () => {
    setActiveTab('today');
    const foodsList = store.foods.filter(f => f.petId === (store.selectedPetId || store.profile?.id || ''));
    if (foodsList.length === 0) {
      alert('قبل از ثبت وعده مصرفی، لطفاً حداقل یک نوع غذا در کتابخانه مواد غذایی پت اضافه کنید.');
      setActiveTab('library');
      return;
    }

    const foodNameStr = foodsList.map((f, idx) => `[${idx + 1}] ${f.brand ? f.brand + ' - ' : ''}${f.name}`).join('\n');
    const inputFoodIdx = prompt(`ثبت سریع وعده آزاد دستی:\nغذاهای ثبت‌شده این پت:\n${foodNameStr}\n\nشماره غذای مصرف‌شده را وارد کنید:`);
    if (!inputFoodIdx) return;

    const idx = parseInt(inputFoodIdx) - 1;
    if (isNaN(idx) || idx < 0 || idx >= foodsList.length) {
      alert('شماره انتخاب شده نامعتبر است.');
      return;
    }

    const chosenFood = foodsList[idx];
    const gramsInput = prompt(`وزن غذای مصرفی (بر حسب گرم) برای ${chosenFood.name} را وارد کنید:`);
    if (!gramsInput) return;

    const grams = parseFloat(gramsInput);
    if (isNaN(grams) || grams <= 0) {
      alert('وزن وارد شده نامعتبر است.');
      return;
    }

    store.logMeal({
      petId: store.selectedPetId || store.profile?.id || '',
      foodId: chosenFood.id,
      fedAt: new Date().toISOString(),
      amount: grams,
      unit: 'gram',
      note: 'ثبت دستی وعده آزاد',
    });

    alert(`وعده غذایی دستی به میزان ${toPersian(grams)} گرم با موفقیت ثبت گردید.`);
  };

  const handleAddHydrationClick = () => {
    const amountStr = prompt('میزان آب مصرفی تازه پت را وارد کنید (بر حسب میلی‌لیتر):', '100');
    if (!amountStr) return;

    const amount = parseInt(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert('مقدار آب وارد شده نامعتبر است.');
      return;
    }

    store.addHydrationLog({
      petId: store.selectedPetId || store.profile?.id || '',
      recordedAt: new Date().toISOString(),
      amountMl: amount,
      event: 'measured',
      note: 'ثبت دستی آب مصرفی',
    });

    alert(`میزان ${toPersian(amount)} میلی‌لیتر آب با موفقیت ثبت گردید.`);
  };

  return (
    <MotionPage className="p-10 lg:p-12 space-y-10 max-w-7xl mx-auto w-full" dir="rtl">
      {/* 1. Header Navigation and Controls */}
      <NutritionHeader
        onAddPlan={handleAddPlanClick}
        onLogMeal={handleLogMealClick}
      />

      {/* 2. Overview Status Bento-Strip */}
      <NutritionOverview
        onAddPlan={handleAddPlanClick}
        onLogNextMeal={handleLogMealClick}
      />

      {/* 3. Safety Notice strip (Warm educational veterinary warning) */}
      <NutritionSafetyNotice />

      {/* 4. Navigation tabs */}
      <NutritionTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* 5. Dynamic active tab view content */}
      <div className="pt-2">
        {activeTab === 'today' && (
          <TodayFeedingView
            onLogMeal={handleLogMealClick}
            onAddHydration={handleAddHydrationClick}
          />
        )}

        {activeTab === 'weekly' && (
          <WeeklyFeedingView />
        )}

        {activeTab === 'library' && (
          <FoodLibraryView
            onAddFood={handleAddFoodClick}
            onEditFood={handleEditFoodClick}
          />
        )}

        {activeTab === 'history' && (
          <NutritionHistoryView />
        )}

        {activeTab === 'settings' && (
          <NutritionSettingsView />
        )}
      </div>

      {/* Dialog Modals Overlay */}
      <FoodDialog
        isOpen={isFoodDialogOpen}
        food={editingFood}
        onClose={() => { setIsFoodDialogOpen(false); setEditingFood(undefined); }}
        onSuccess={handleFoodSuccess}
      />

      <FeedingPlanDialog
        isOpen={isPlanDialogOpen}
        onClose={() => setIsPlanDialogOpen(false)}
        onSuccess={handlePlanSuccess}
      />
    </MotionPage>
  );
}
