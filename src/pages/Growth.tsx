import React, { useState } from 'react';
import { useAppStore } from '../store';
import { MotionPage } from '../motion';
import { selectSortedEntries } from './growth/growthSelectors';
import { WeightEntry } from './growth/growthTypes';

// Subcomponents
import { GrowthHeader } from './growth/GrowthHeader';
import { GrowthEmptyState } from './growth/GrowthEmptyState';
import { WeightOverview } from './growth/WeightOverview';
import { WeightChart } from './growth/WeightChart';
import { WeightContextRail } from './growth/WeightContextRail';
import { WeightHistory } from './growth/WeightHistory';

// Dialogs
import { WeightEntryDialog } from './growth/WeightEntryDialog';
import { WeightGoalDialog } from './growth/WeightGoalDialog';

export default function Growth() {
  const store = useAppStore();
  const sortedEntries = selectSortedEntries(store);
  const currentPet = store.pets.find(p => p.id === store.selectedPetId) || store.profile;
  const petName = currentPet?.name || 'حیوان خانگی من';

  // Modal and state managers
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WeightEntry | undefined>(undefined);

  const handleAddWeightClick = () => {
    setEditingEntry(undefined);
    setIsEntryDialogOpen(true);
  };

  const handleEditEntryClick = (entry: WeightEntry) => {
    setEditingEntry(entry);
    setIsEntryDialogOpen(true);
  };

  const handleSetGoalClick = () => {
    setIsGoalDialogOpen(true);
  };

  const handleEntrySuccess = () => {
    setIsEntryDialogOpen(false);
    setEditingEntry(undefined);
  };

  const handleGoalSuccess = () => {
    setIsGoalDialogOpen(false);
  };

  const hasEntries = sortedEntries.length > 0;

  return (
    <MotionPage className="p-10 lg:p-12 space-y-10 max-w-7xl mx-auto w-full" dir="rtl">
      {/* 1. Growth Header */}
      <GrowthHeader onAddWeight={handleAddWeightClick} />

      {!hasEntries ? (
        /* Global Empty State */
        <GrowthEmptyState
          petName={petName}
          onAddFirst={handleAddWeightClick}
        />
      ) : (
        /* Dynamic Multi-point layout */
        <div className="space-y-10">
          {/* 2. Overview Bento-Strip */}
          <WeightOverview onSetGoal={handleSetGoalClick} />

          {/* 3. Main content grid (Chart + Sidebar contextual walkthrough) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <WeightChart onAddWeight={handleAddWeightClick} />
            </div>
            <div className="lg:col-span-4 h-full">
              <WeightContextRail />
            </div>
          </div>

          {/* 4. History Logs and Timeline Section */}
          <WeightHistory onEditEntry={handleEditEntryClick} />
        </div>
      )}

      {/* Responsive Entry and Goal Modals */}
      <WeightEntryDialog
        isOpen={isEntryDialogOpen}
        entry={editingEntry}
        onClose={() => { setIsEntryDialogOpen(false); setEditingEntry(undefined); }}
        onSuccess={handleEntrySuccess}
      />

      <WeightGoalDialog
        isOpen={isGoalDialogOpen}
        onClose={() => setIsGoalDialogOpen(false)}
        onSuccess={handleGoalSuccess}
      />
    </MotionPage>
  );
}
