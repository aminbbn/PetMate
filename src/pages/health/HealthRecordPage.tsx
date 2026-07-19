import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store';
import { HealthHeader } from './HealthHeader';
import { HealthOverview } from './HealthOverview';
import { HealthToolbar } from './HealthToolbar';
import { HealthTimeline } from './HealthTimeline';
import { HealthContextRail } from './HealthContextRail';
import { HealthEmptyState } from './HealthEmptyState';
import { HealthRecordDialog } from './HealthRecordDialog';
import { FilterState, HealthRecord, HealthRecordKind } from './healthTypes';
import { MotionPage, MotionSection } from '../../motion';

export const HealthRecordPage: React.FC = () => {
  const {
    healthRecords,
    pets,
    selectedPetId,
    setSelectedPetId,
    profile,
    addHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
  } = useAppStore();

  // 1. Determine selected pet/profile
  const currentPet = useMemo(() => {
    if (selectedPetId) {
      return pets.find(p => p.id === selectedPetId) || profile;
    }
    return profile || pets[0];
  }, [selectedPetId, pets, profile]);

  const currentPetName = currentPet?.name || 'حیوان خانگی شما';
  const currentPetId = currentPet?.id || '';

  // 2. Filter states
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    kind: 'all',
    sortBy: 'newest',
    onlyHasFiles: false,
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      kind: 'all',
      sortBy: 'newest',
      onlyHasFiles: false,
    });
  };

  // 3. Dialog Modal state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HealthRecord | undefined>(undefined);
  const [dialogInitialView, setDialogInitialView] = useState<'selection' | 'form_manual' | 'form_upload'>('selection');

  const handleOpenCreateDialog = (kind?: HealthRecordKind) => {
    setEditingRecord(undefined);
    setDialogInitialView('selection');
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (record: HealthRecord) => {
    setEditingRecord(record);
    setDialogInitialView('form_manual');
    setIsDialogOpen(true);
  };

  const handleQuickAdd = (kind: HealthRecordKind) => {
    setEditingRecord({
      id: '',
      petId: currentPetId,
      kind,
      occurredAt: new Date().toISOString().split('T')[0],
      title: '',
      notes: '',
      attachments: [],
      createdAt: '',
      updatedAt: '',
      date: '',
      reason: '',
    });
    setDialogInitialView('form_manual');
    setIsDialogOpen(true);
  };


  // 4. Filter current pet's medical records
  const petRecords = useMemo(() => {
    if (!currentPetId) return [];
    return healthRecords.filter(r => r.petId === currentPetId || (!r.petId && currentPetId === profile?.id));
  }, [healthRecords, currentPetId, profile]);

  // 5. Apply Toolbar filters
  const filteredRecords = useMemo(() => {
    let result = [...petRecords];

    // Search filter
    if (filters.search.trim() !== '') {
      const q = filters.search.toLowerCase();
      result = result.filter(
        r =>
          r.title?.toLowerCase().includes(q) ||
          r.reason?.toLowerCase().includes(q) ||
          r.notes?.toLowerCase().includes(q) ||
          r.veterinarian?.toLowerCase().includes(q) ||
          r.clinic?.toLowerCase().includes(q)
      );
    }

    // Category kind filter
    if (filters.kind !== 'all') {
      result = result.filter(r => r.kind === filters.kind);
    }

    // File attachments filter
    if (filters.onlyHasFiles) {
      result = result.filter(r => r.attachments && r.attachments.length > 0);
    }

    // Date sorting
    result.sort((a, b) => {
      const tA = new Date(a.occurredAt || a.date).getTime();
      const tB = new Date(b.occurredAt || b.date).getTime();
      return filters.sortBy === 'newest' ? tB - tA : tA - tB;
    });

    return result;
  }, [petRecords, filters]);

  // 6. Next follow-ups
  const upcomingFollowUps = useMemo(() => {
    const now = new Date();
    return petRecords
      .filter(r => r.followUpAt && new Date(r.followUpAt) >= now)
      .sort((a, b) => new Date(a.followUpAt!).getTime() - new Date(b.followUpAt!).getTime());
  }, [petRecords]);

  // 7. Handlers for Save and Delete
  const handleSaveRecord = (values: any) => {
    if (editingRecord && editingRecord.id) {
      updateHealthRecord(editingRecord.id, {
        ...values,
        petId: currentPetId,
      });
    } else {
      addHealthRecord({
        ...values,
        petId: currentPetId,
      });
    }
  };

  const handleDeleteRecord = (id: string) => {
    deleteHealthRecord(id);
  };

  const handleSelectRecord = (record: HealthRecord) => {
    // Focus or show details
    setFilters(prev => ({ ...prev, search: record.title }));
  };

  return (
    <MotionPage className="container mx-auto px-4 py-8 max-w-7xl space-y-8" id="health-page">
      {/* 1. Header */}
      <MotionSection>
        <HealthHeader
          selectedPet={currentPet}
          pets={pets}
          onSelectPet={setSelectedPetId}
          onAddRecord={() => handleOpenCreateDialog()}
        />
      </MotionSection>

      {/* 2. Overview Stats - Always rendered full-width */}
      <MotionSection delay={0.1}>
        <HealthOverview
          records={petRecords}
          onFilterChange={handleFilterChange}
          filters={filters}
        />
      </MotionSection>

      {/* 3. Lower 12-column grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Left Workspace: 8 columns */}
        <div className="lg:col-span-8 space-y-6">
          {petRecords.length === 0 ? (
            <MotionSection delay={0.15}>
              <HealthEmptyState
                petName={currentPetName}
                onAddManual={() => setViewAndOpen('manual')}
                onAddUpload={() => setViewAndOpen('upload')}
              />
            </MotionSection>
          ) : (
            <>
              {/* Toolbar (Search & Category Selector) */}
              <MotionSection delay={0.15}>
                <HealthToolbar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </MotionSection>

              {/* Chronological Timeline */}
              <MotionSection delay={0.2}>
                <HealthTimeline
                  records={filteredRecords}
                  filters={filters}
                  onEdit={handleOpenEditDialog}
                  onDelete={handleDeleteRecord}
                />
              </MotionSection>
            </>
          )}
        </div>

        {/* Sidebar Workspace Context Rail: 4 columns */}
        <aside className="lg:col-span-4 space-y-6">
          <MotionSection delay={0.25}>
            <HealthContextRail
              upcomingRecords={upcomingFollowUps}
              onQuickAdd={handleQuickAdd}
              onSelectRecord={handleSelectRecord}
            />
          </MotionSection>
        </aside>
      </div>

      {/* dialog modal for create/edit */}
      <HealthRecordDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSaveRecord}
        initialRecord={editingRecord}
        initialView={dialogInitialView}
      />
    </MotionPage>
  );

  // Helper to open dialog directly into a subview
  function setViewAndOpen(path: 'manual' | 'upload') {
    setEditingRecord(undefined);
    setDialogInitialView(path === 'manual' ? 'form_manual' : 'form_upload');
    setIsDialogOpen(true);
  }
};
