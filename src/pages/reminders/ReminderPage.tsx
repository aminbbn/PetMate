import React, { useState, useEffect } from 'react';
import { useAppStore, Reminder, migrateReminder, ReminderCategory, ReminderRecurrence } from '../../store';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Bell, 
  Plus, 
  X, 
  Trash2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  CheckSquare, 
  Clock, 
  Sparkles,
  Heart
} from 'lucide-react';
import { toPersian, formatPersianDate } from '../../lib/persian';
import { groupReminders, TEMPLATES_BY_TYPE, UNIVERSAL_TEMPLATES, ReminderTemplate, GroupedReminders } from './reminderUtils';
import { calculateNextDueDate } from './recurrenceUtils';
import ReminderHeader from './ReminderHeader';
import ReminderSummary from './ReminderSummary';
import ReminderInsightCard from './ReminderInsightCard';
import ReminderRow from './ReminderRow';
import ReminderDialog from './ReminderDialog';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { MotionDialog } from '../../motion/MotionDialog';

export default function ReminderPage() {
  const reminders = useAppStore(state => state.reminders || []);
  const pets = useAppStore(state => state.pets || []);
  const profile = useAppStore(state => state.profile);
  const selectedPetId = useAppStore(state => state.selectedPetId);
  const setSelectedPetId = useAppStore(state => state.setSelectedPetId);
  const addReminder = useAppStore(state => state.addReminder);
  const updateReminder = useAppStore(state => state.updateReminder);
  const deleteReminder = useAppStore(state => state.deleteReminder);

  // States
  const [activeFilter, setActiveFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [doneCollapsed, setDoneCollapsed] = useState(true);

  // One-time legacy reminders migration on mount
  useEffect(() => {
    // Determine default selected pet if not set
    const allPets = pets.length > 0 ? pets : (profile ? [profile] : []);
    const defaultPetId = selectedPetId || (allPets[0]?.id || null);
    
    if (defaultPetId && !selectedPetId) {
      setSelectedPetId(defaultPetId);
    }

    // Migrate any legacy reminders that do not have petId or category
    const unmigrated = reminders.some(r => !r.petId || !r.category || !r.dueAt);
    if (unmigrated && defaultPetId) {
      reminders.forEach(r => {
        if (!r.petId || !r.category || !r.dueAt) {
          const migrated = migrateReminder(r, defaultPetId);
          updateReminder(r.id, migrated);
        }
      });
    }
  }, [reminders, pets, profile, selectedPetId, setSelectedPetId, updateReminder]);

  const allPets = pets.length > 0 ? pets : (profile ? [profile] : []);
  const currentPet = allPets.find(p => p.id === selectedPetId) || allPets[0] || null;

  // Group reminders for currently selected pet
  const grouped = groupReminders(reminders, selectedPetId);

  // Determine which templates to show
  const petType = currentPet?.type || 'dog';
  const petTemplates = TEMPLATES_BY_TYPE[petType] || [];
  const templates = [...petTemplates, ...UNIVERSAL_TEMPLATES];

  const handleSaveReminder = (formData: {
    title: string;
    category: ReminderCategory;
    dueAt: string;
    recurrence: ReminderRecurrence;
    notes: string;
    petId: string;
  }) => {
    if (editingReminder) {
      // Keep completed state, but update with new form values
      updateReminder(editingReminder.id, {
        title: formData.title,
        category: formData.category,
        dueAt: formData.dueAt,
        date: formData.dueAt, // compat
        recurrence: formData.recurrence,
        notes: formData.notes,
        petId: formData.petId
      });
      setEditingReminder(null);
    } else {
      // Add a fresh reminder
      addReminder(
        formData.title,
        formData.dueAt,
        false, // alarmEnabled
        undefined, // alarmDate
        undefined, // alarmTime
        formData.petId,
        formData.category,
        formData.recurrence,
        undefined, // notification
        formData.notes
      );
    }
    setShowForm(false);
  };

  const handleAddPrefilled = (title: string, category: ReminderCategory, recurrence: ReminderRecurrence, notes: string) => {
    if (!selectedPetId) return;
    
    // Default to tomorrow morning
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    addReminder(
      title,
      tomorrow.toISOString(),
      false,
      undefined,
      undefined,
      selectedPetId,
      category,
      recurrence,
      undefined,
      notes
    );
  };

  const handleStartEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setShowForm(true);
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId) {
      deleteReminder(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const handleCloseForm = () => {
    setEditingReminder(null);
    setShowForm(false);
  };

  // Switch filter isolation
  const getFilteredGroups = (): { label: string; list: Reminder[]; key: string }[] => {
    if (activeFilter === 'overdue') {
      return [{ label: 'برنامه‌های به‌تاخیر افتاده', list: grouped.overdue, key: 'overdue' }];
    }
    if (activeFilter === 'today') {
      return [{ label: 'برنامه‌های امروز', list: grouped.today, key: 'today' }];
    }
    if (activeFilter === 'upcoming') {
      return [
        { label: 'برنامه‌های این هفته', list: grouped.thisWeek, key: 'thisWeek' },
        { label: 'برنامه‌های آینده', list: grouped.later, key: 'later' }
      ];
    }
    if (activeFilter === 'done') {
      return [{ label: 'برنامه‌های تکمیل‌شده', list: grouped.done, key: 'done' }];
    }

    // Default: 'all'
    return [
      { label: 'به‌تاخیر افتاده', list: grouped.overdue, key: 'overdue' },
      { label: 'امروز', list: grouped.today, key: 'today' },
      { label: 'این هفته', list: grouped.thisWeek, key: 'thisWeek' },
      { label: 'آینده (بیشتر از یک هفته)', list: grouped.later, key: 'later' }
    ];
  };

  const filteredGroups = getFilteredGroups();
  const totalActiveInView = filteredGroups.reduce((acc, group) => acc + group.list.length, 0);

  return (
    <div className="space-y-8" dir="rtl">
      {/* 1. Header & Switcher */}
      <ReminderHeader 
        selectedPetId={selectedPetId} 
        onSelectPet={(id) => setSelectedPetId(id)} 
      />

      {/* 2. Summary Metric Cards */}
      <ReminderSummary 
        grouped={grouped} 
        activeFilter={activeFilter} 
        onFilterChange={(filter) => setActiveFilter(filter)} 
      />

      {/* 3. Main Split Checklist Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Checklist Left Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-white border-gray-100/80 p-6 shadow-warm-lg min-h-[460px] flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                <h2 className="font-black text-gray-800 text-lg leading-none">فهرست و زمان‌بندی مراقبت‌ها</h2>
                
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-coral hover:bg-coral-deep text-white text-xs font-black rounded-xl transition-all shadow-sm shadow-coral/15 cursor-pointer"
                >
                  <Plus size={14} className="stroke-[3]" />
                  <span>افزودن یادآور جدید</span>
                </button>
              </div>

              {/* Reminders Timeline */}
              {totalActiveInView === 0 && activeFilter !== 'all' ? (
                <div className="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-100 flex flex-col items-center justify-center space-y-3">
                  <Clock size={32} className="text-gray-300" />
                  <p className="text-gray-500 font-bold text-xs">موردی برای فیلتر انتخاب شده یافت نشد.</p>
                  <button onClick={() => setActiveFilter('all')} className="text-[10px] text-coral font-black underline">
                    نمایش همه برنامه‌ها
                  </button>
                </div>
              ) : reminders.filter(r => r.petId === selectedPetId).length === 0 ? (
                <div className="text-center py-20 bg-coral/5 rounded-3xl border border-dashed border-coral/20 flex flex-col items-center justify-center space-y-4">
                  <Bell size={40} className="text-coral animate-swing" strokeWidth={2} />
                  <div className="space-y-1">
                    <p className="text-gray-600 font-black text-sm">هیچ برنامه‌ای برای {currentPet?.name || 'حیوان خانگی شما'} ثبت نشده است.</p>
                    <p className="text-gray-400 text-xs">می‌توانید با استفاده از الگوهای آماده سمت چپ یا فرم فوق، اولین یادآور را بسازید.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
                    ثبت اولین یادآور
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredGroups.map((group) => {
                    if (group.list.length === 0) return null;
                    // Skip 'done' section if displaying 'all' view because 'done' has a separate collapsed section below
                    if (activeFilter === 'all' && group.key === 'done') return null;

                    return (
                      <div key={group.key} className="space-y-3">
                        <h4 className="text-[11px] text-gray-400 font-black tracking-wider flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-coral shrink-0" />
                          <span>{group.label}</span>
                          <span className="text-[10px] bg-gray-50 border border-gray-100 text-gray-400 px-1.5 py-0.5 rounded-md font-bold">
                            {toPersian(group.list.length)}
                          </span>
                        </h4>
                        <div className="space-y-3">
                          {group.list.map((reminder) => (
                            <ReminderRow
                              key={reminder.id}
                              reminder={reminder}
                              onEdit={handleStartEdit}
                              onDelete={handleDeleteClick}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* Separately render the Collapsible Done list in 'all' view */}
                  {activeFilter === 'all' && grouped.done.length > 0 && (
                    <div className="pt-4 border-t border-gray-100/50 space-y-3">
                      <button
                        onClick={() => setDoneCollapsed(!doneCollapsed)}
                        className="flex items-center justify-between w-full text-right text-gray-400 hover:text-gray-600 transition-colors py-2 focus:outline-none cursor-pointer"
                      >
                        <span className="text-xs font-black flex items-center gap-1.5">
                          <span>برنامه‌های انجام‌شده و آرشیو</span>
                          <span className="text-[10px] bg-gray-50 border border-gray-100 text-gray-400 px-1.5 py-0.5 rounded-md font-bold">
                            {toPersian(grouped.done.length)}
                          </span>
                        </span>
                        {doneCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                      </button>

                      <AnimatePresence>
                        {!doneCollapsed && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-3 overflow-hidden"
                          >
                            {grouped.done.map((reminder) => (
                              <ReminderRow
                                key={reminder.id}
                                reminder={reminder}
                                onEdit={handleStartEdit}
                                onDelete={handleDeleteClick}
                              />
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400 font-bold">
              <span>در صورت تکمیل کارها روی دایره تیک کلیک کنید</span>
              <span className="text-coral flex items-center gap-1">
                <Sparkles size={12} fill="currentColor" fillOpacity={0.2} />
                تکمیل منظم برنامه‌ها امتیاز سلامتی حیوان خانگی را افزایش می‌دهد
              </span>
            </div>
          </Card>
        </div>

        {/* Right Columns (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Real user EHR insights panel */}
          <ReminderInsightCard onAddPrefilled={handleAddPrefilled} />

          {/* Quick templates panel */}
          <Card className="bg-white border-gray-100/80 p-5 shadow-warm-lg space-y-4">
            <div>
              <h3 className="font-black text-gray-800 text-sm">الگوهای آماده مراقبتی</h3>
              <p className="text-[10px] text-gray-400 font-bold mt-0.5">افزودن سریع کارهای دوره‌ای پیشنهادی مخصوص {currentPet?.name || 'دوست پشمالو'}</p>
            </div>

            <div className="space-y-2.5">
              {templates.map((tpl, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddPrefilled(tpl.title, tpl.category, tpl.recurrence as ReminderRecurrence, tpl.notes)}
                  className="w-full text-right p-3 rounded-xl border border-gray-100 hover:border-coral-light/25 hover:bg-coral/5 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <span className="text-xs font-black text-gray-700 block truncate group-hover:text-coral transition-colors">{tpl.title}</span>
                    <span className="text-[10px] text-gray-400 block truncate leading-relaxed">{tpl.notes}</span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-coral/10 group-hover:text-coral group-hover:border-coral/25 transition-all">
                    <Plus size={14} className="stroke-[2.5]" />
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Unified Add/Edit Form Overlay Modal Dialog */}
      <ReminderDialog
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) {
            setEditingReminder(null);
          }
        }}
        initialReminder={editingReminder}
        onSave={handleSaveReminder}
      />

      {/* 5. Deletion Confirmation Dialog */}
      <MotionDialog
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        size="sm"
      >
        <div className="p-6 text-center space-y-5">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
            <Trash2 size={22} className="animate-pulse" />
          </div>

          <div className="space-y-1">
            <h4 className="font-black text-gray-800 text-base">حذف این برنامه مراقبتی؟</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              این عمل غیرقابل بازگشت است و تاریخچه یادآور به طور کامل حذف خواهد شد.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => setConfirmDeleteId(null)}
              className="px-4.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              انصراف
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-black rounded-xl transition-colors shadow-md shadow-red-500/15 cursor-pointer"
            >
              بله، حذف شود
            </button>
          </div>
        </div>
      </MotionDialog>
    </div>
  );
}
