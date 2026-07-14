import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { TRAINING_LIBRARY, CATEGORY_LABELS, DIFFICULTY_LABELS } from './trainingLibrary';
import { TrainingGoal, TrainingSession, TrainingLesson, TrainingGoalStatus } from './trainingTypes';
import { calculateSessionSuccessRate, formatSessionDuration, getOutcomeLabel, getEngagementLabel, getStopReasonLabel } from './trainingUtils';
import { HUMANE_TRAINING_PRINCIPLES, EMERGENCIES_AND_VET_ROUTING } from './trainingSafety';
import { TrainingHeader } from './TrainingHeader';
import { ActiveSessionView } from './ActiveSessionView';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { toPersian } from '../../lib/persian';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Calendar,
  Clock,
  Plus,
  BookOpen,
  History,
  ShieldCheck,
  Play,
  CheckCircle,
  TrendingUp,
  X,
  PlusCircle,
  Flame,
  AlertTriangle,
  Stethoscope,
  HeartHandshake,
  Trash2,
  Bookmark,
  Bell
} from 'lucide-react';

export const TrainingPage: React.FC = () => {
  const profile = useAppStore((state) => state.profile);
  const trainingGoals = useAppStore((state) => state.trainingGoals) || [];
  const trainingSessions = useAppStore((state) => state.trainingSessions) || [];
  const addTrainingGoal = useAppStore((state) => state.addTrainingGoal);
  const updateTrainingGoal = useAppStore((state) => state.updateTrainingGoal);
  const deleteTrainingGoal = useAppStore((state) => state.deleteTrainingGoal);
  const startTrainingSession = useAppStore((state) => state.startTrainingSession);
  const deleteTrainingSession = useAppStore((state) => state.deleteTrainingSession);
  const addReminder = useAppStore((state) => state.addReminder);

  // Active Tabs
  const [activeTab, setActiveTab] = useState<'lessons' | 'goals' | 'history' | 'safety'>('lessons');

  // Selected Lesson Detail Modal
  const [selectedLesson, setSelectedLesson] = useState<TrainingLesson | null>(null);

  // Active Live Session State
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeSessionGoal, setActiveSessionGoal] = useState<TrainingGoal | null>(null);
  const [activeSessionLesson, setActiveSessionLesson] = useState<TrainingLesson | null>(null);

  // Goal Creation Modal Form
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalBehavior, setGoalBehavior] = useState('');
  const [goalSuccessDef, setGoalSuccessDef] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [goalContext, setGoalContext] = useState('');

  if (!profile) {
    return (
      <div className="p-8 text-center" dir="rtl">
        <p className="text-gray-500 font-bold">پت انتخاب شده یافت نشد. لطفاً ابتدا یک سگ یا گربه اضافه کنید.</p>
      </div>
    );
  }

  // Filters based on selected pet's type (dog or cat)
  const currentPetSpecies = profile.type; // 'dog' | 'cat'
  const suitableLessons = TRAINING_LIBRARY.filter(
    (lesson) => lesson.species === currentPetSpecies || lesson.species === 'both'
  );

  const currentPetGoals = trainingGoals.filter((g) => g.petId === profile.id);
  const currentPetSessions = trainingSessions.filter((s) => s.petId === profile.id);

  // Quick stats calculation
  const achievedGoalsCount = currentPetGoals.filter((g) => g.status === 'achieved').length;
  const activeGoalsCount = currentPetGoals.filter((g) => g.status === 'active').length;
  const totalSessionsCount = currentPetSessions.length;

  const handleStartSession = (goal: TrainingGoal) => {
    // Find linked lesson if exists
    const lesson = TRAINING_LIBRARY.find((l) => l.id === goal.lessonId);
    
    // Create new session in store
    const sessionId = startTrainingSession({
      petId: profile.id,
      goalId: goal.id,
      lessonId: goal.lessonId,
      environment: 'منزل (اتاق خلوت)',
      distractionLevel: 'low'
    });

    // Enter full screen active session view
    setActiveSessionId(sessionId);
    setActiveSessionGoal(goal);
    setActiveSessionLesson(lesson || undefined);
  };

  const handleCreateGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle || !goalBehavior || !goalSuccessDef) return;

    // Call store action
    addTrainingGoal({
      petId: profile.id,
      title: goalTitle,
      desiredBehavior: goalBehavior,
      successDefinition: goalSuccessDef,
      context: goalContext || undefined,
      lessonId: selectedLessonId || undefined,
      status: 'active'
    });

    // Reset Form
    setGoalTitle('');
    setGoalBehavior('');
    setGoalSuccessDef('');
    setGoalContext('');
    setSelectedLessonId('');
    setShowGoalModal(false);
  };

  const handleAddGoalFromLesson = (lesson: TrainingLesson) => {
    // Open goal creation modal pre-populated with lesson details
    setGoalTitle(`آموزش مهارت: ${lesson.title}`);
    setGoalBehavior(lesson.summary);
    setGoalSuccessDef(lesson.steps[lesson.steps.length - 1]?.successCriterion || 'تسلط گام‌به‌گام مراحل');
    setSelectedLessonId(lesson.id);
    setGoalContext(`تمرین مهارتی با استفاده از ${lesson.reinforcementOptions[0]}`);
    setShowGoalModal(true);
  };

  const handleCreateReminderForGoal = (goal: TrainingGoal) => {
    const today = new Date();
    // Add tomorrow morning as practice reminder
    today.setDate(today.getDate() + 1);
    today.setHours(10, 0, 0, 0);
    const reminderIso = today.toISOString();

    addReminder(
      `تمرین روزانه: ${goal.title}`,
      reminderIso,
      true,
      reminderIso.split('T')[0],
      '10:00',
      profile.id,
      'activity',
      { frequency: 'daily' },
      { enabled: true },
      'یادآور خودکار تمرین مهارتی پت به شیوه علمی LIMA'
    );

    alert(`یادآور روزانه تمرین با موفقیت به تقویم پیگیری ${profile.name} اضافه شد.`);
  };

  // If there is an active running session, render ActiveSessionView exclusively
  if (activeSessionId && activeSessionGoal) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6 text-right" dir="rtl">
        <ActiveSessionView
          sessionId={activeSessionId}
          goal={activeSessionGoal}
          lesson={activeSessionLesson || undefined}
          onClose={() => {
            setActiveSessionId(null);
            setActiveSessionGoal(null);
            setActiveSessionLesson(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full text-right" dir="rtl">
      {/* Header Banner */}
      <TrainingHeader />

      {/* Brief Metrics Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-brand/5 border border-brand/10 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-gray-500 text-xxs font-bold">مهارت‌های فعال جاری</span>
            <div className="text-2xl font-black text-brand">{toPersian(activeGoalsCount)} هدف</div>
          </div>
          <div className="bg-brand/10 p-2.5 rounded-lg text-brand">
            <PlusCircle size={20} />
          </div>
        </div>

        <div className="bg-mint/5 border border-mint/15 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-gray-500 text-xxs font-bold">مهارت‌های آموخته‌شده</span>
            <div className="text-2xl font-black text-success">{toPersian(achievedGoalsCount)} مهارت</div>
          </div>
          <div className="bg-mint/10 p-2.5 rounded-lg text-success">
            <Award size={20} />
          </div>
        </div>

        <div className="bg-sunny/5 border border-sunny/15 p-4 rounded-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-gray-500 text-xxs font-bold">کل جلسات تمرینی موفق</span>
            <div className="text-2xl font-black text-sunny-deep">{toPersian(totalSessionsCount)} جلسه</div>
          </div>
          <div className="bg-sunny/10 p-2.5 rounded-lg text-sunny-deep">
            <Flame size={20} />
          </div>
        </div>
      </div>

      {/* Main Dashboard Navigation Tabs */}
      <div className="border-b border-gray-100 pb-px flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'lessons'
                ? 'border-brand text-brand'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <BookOpen size={16} />
            برنامه‌ها و دروس اخلاقی
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'goals'
                ? 'border-brand text-brand'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Bookmark size={16} />
            اهداف فعال {profile.name}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'history'
                ? 'border-brand text-brand'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <History size={16} />
            تاریخچه جلسات
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'safety'
                ? 'border-brand text-brand'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <ShieldCheck size={16} />
            اصول علمی و ایمنی
          </button>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowGoalModal(true)}
          className="flex items-center gap-1 text-xs"
        >
          <Plus size={14} />
          تعریف هدف تمرینی جدید
        </Button>
      </div>

      {/* Views rendering block */}
      <div className="space-y-6">
        {/* TAB 1: AVAILABLE LESSONS LIBRARY */}
        {activeTab === 'lessons' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-gray-900 text-base">
                برنامه‌های آموزشی تایید شده برای {profile.type === 'dog' ? 'سگ‌ها 🐶' : 'گربه‌ها 🐱'}
              </h3>
              <span className="text-xxs text-gray-400">فیلتر شده بر اساس نوع گونه انتخابی</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {suitableLessons.map((lesson) => {
                const catLabel = CATEGORY_LABELS[lesson.category] || { icon: '✨', label: 'سایر' };
                const diffLabel = DIFFICULTY_LABELS[lesson.difficulty] || { label: 'آسان', colorClass: 'bg-gray-100' };

                return (
                  <Card key={lesson.id} className="p-6 hover:shadow-md transition-all border-gray-100 flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-bold bg-gray-50 text-gray-600 px-2.5 py-1 rounded-lg border border-gray-100 flex items-center gap-1.5">
                          <span>{catLabel.icon}</span>
                          <span>{catLabel.label}</span>
                        </span>

                        <span className={`text-xxs font-extrabold px-2 py-0.5 rounded-full border ${diffLabel.colorClass}`}>
                          {diffLabel.label}
                        </span>
                      </div>

                      <h4 className="text-base font-black text-gray-900">{lesson.title}</h4>
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{lesson.summary}</p>

                      <div className="flex items-center gap-4 text-xxs text-gray-400 font-semibold pt-1 border-t border-gray-50">
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-gray-400" />
                          زمان جلسه: {toPersian(lesson.sessionMinutesMin)}-{toPersian(lesson.sessionMinutesMax)} دقیقه
                        </span>
                        <span>مراحل آموزش: {toPersian(lesson.steps.length)} گام</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs font-bold"
                        onClick={() => setSelectedLesson(lesson)}
                      >
                        مشاهده گام‌ها و جزئیات علمی
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full text-xs font-bold bg-slate-900 text-white border-none"
                        onClick={() => handleAddGoalFromLesson(lesson)}
                      >
                        انتخاب به عنوان هدف تمرین
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE GOALS */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-gray-900 text-base">اهداف و مهارت‌های تعریف‌شده {profile.name}</h3>
              <span className="text-xxs text-gray-400">برنامه‌های فعال برای پیگیری تمرینات</span>
            </div>

            {currentPetGoals.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500 font-medium text-xs mb-4">هیچ هدف تمرینی فعالی ثبت نشده است.</p>
                <Button variant="primary" size="sm" onClick={() => setShowGoalModal(true)}>
                  ایجاد اولین هدف تمرینی
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentPetGoals.map((goal) => {
                  const goalSessions = currentPetSessions.filter((s) => s.goalId === goal.id);
                  const achieved = goal.status === 'achieved';

                  return (
                    <Card
                      key={goal.id}
                      className={`p-6 transition-all border ${
                        achieved ? 'border-success/30 bg-success/5' : 'border-gray-100 hover:shadow-md'
                      } flex flex-col justify-between gap-4`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xxs font-black px-2.5 py-0.5 rounded-full border ${
                              achieved
                                ? 'bg-success/15 text-success border-success/20'
                                : 'bg-brand/10 text-brand border-brand/15'
                            }`}
                          >
                            {achieved ? '✓ کسب شده و تثبیت شده' : '⚡ در جریان تمرین'}
                          </span>

                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleCreateReminderForGoal(goal)}
                              className="p-1 rounded text-gray-400 hover:text-brand hover:bg-brand/5"
                              title="تنظیم یادآور پیگیری روزانه"
                            >
                              <Bell size={16} />
                            </button>
                            <button
                              onClick={() => deleteTrainingGoal(goal.id)}
                              className="p-1 rounded text-gray-400 hover:text-coral hover:bg-coral/5"
                              title="حذف هدف"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <h4 className="text-base font-black text-gray-900">{goal.title}</h4>
                        
                        <div className="text-xs text-gray-600 space-y-1">
                          <p>
                            <strong>رفتار هدف:</strong> {goal.desiredBehavior}
                          </p>
                          <p>
                            <strong>تعریف پایداری مهارت:</strong> {goal.successDefinition}
                          </p>
                          {goal.context && (
                            <p className="text-xxs text-gray-400">
                              <strong>زمینه تمرین:</strong> {goal.context}
                            </p>
                          )}
                        </div>

                        <div className="bg-gray-100/60 p-2.5 rounded-lg flex justify-between items-center text-xxs text-gray-500 font-bold">
                          <span>کل جلسات تمرین: {toPersian(goalSessions.length)} جلسه</span>
                          {goalSessions.length > 0 && (
                            <span className="text-success font-black">
                              میانگین موفقیت اخیر: {toPersian(calculateSessionSuccessRate(goalSessions[0]))}٪
                            </span>
                          )}
                        </div>
                      </div>

                      {!achieved && (
                        <div className="flex gap-2 pt-2 border-t border-gray-50">
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full text-xs font-bold bg-brand text-white shadow-sm shadow-brand/10 flex items-center justify-center gap-1"
                            onClick={() => handleStartSession(goal)}
                          >
                            <Play size={14} fill="currentColor" />
                            شروع جلسه تمرین جدید
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-1/3 text-xs font-bold border-success/30 text-success hover:bg-success/5"
                            onClick={() => updateTrainingGoal(goal.id, { status: 'achieved', achievedAt: new Date().toISOString() })}
                          >
                            ثبت کسب مهارت
                          </Button>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SESSION HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-gray-900 text-base">تاریخچه جلسات تمرینی برگزار شده</h3>
              <span className="text-xxs text-gray-400">سوابق تمرینی مرتب شده از جدید به قدیم</span>
            </div>

            {currentPetSessions.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500 text-xs font-medium">هنوز هیچ جلسه تمرینی برای {profile.name} ثبت نشده است.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentPetSessions.map((session) => {
                  const successRate = calculateSessionSuccessRate(session);
                  const stopLabel = getStopReasonLabel(session.stopReason || 'other');
                  const engagementDetails = getEngagementLabel(session.petEngagement || 'unknown');

                  return (
                    <Card key={session.id} className="p-5 border-gray-100 space-y-4 hover:border-gray-200 transition-all">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-50 pb-3">
                        <div className="space-y-1">
                          <span className="text-xxs text-gray-400 font-bold block">
                            برگزاری در تاریخ {toPersian(new Date(session.startedAt).toLocaleDateString('fa-IR'))}
                          </span>
                          <span className="font-extrabold text-gray-800 text-sm">
                            جلسه مهارتی مربوط به هدف فعال
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <span className="text-xxs font-black px-2 py-0.5 rounded-full bg-slate-900 text-white">
                            موفقیت: {toPersian(successRate)}٪
                          </span>
                          <span className="text-xxs font-black px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                            مدت: {toPersian(formatSessionDuration(session.startedAt, session.endedAt))}
                          </span>
                          <button
                            onClick={() => deleteTrainingSession(session.id)}
                            className="p-1 rounded text-gray-400 hover:text-coral hover:bg-coral/5"
                            title="حذف جلسه"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
                        <div>
                          <strong>نشاط حیوان:</strong> {engagementDetails.icon} {engagementDetails.label}
                        </div>
                        <div className="sm:col-span-2">
                          <strong>علت اتمام جلسه:</strong> {stopLabel}
                        </div>
                      </div>

                      {session.userNotes && (
                        <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-700 italic border-r-2 border-brand/20">
                          <strong>یادداشت مربی:</strong> {session.userNotes}
                        </div>
                      )}

                      {session.attempts && session.attempts.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-xxs text-gray-400 font-bold block">ریز تلاش‌های پاسخ حیوان در طول این جلسه:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {session.attempts.map((att, idx) => {
                              const outcomeDetails = getOutcomeLabel(att.outcome);
                              return (
                                <span
                                  key={att.id}
                                  className={`text-xxs px-2.5 py-1 rounded-md border font-bold ${outcomeDetails.color}`}
                                >
                                  تلاش {toPersian(idx + 1)}: {outcomeDetails.label}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SAFETY AND HUMANE PRINCIPLES */}
        {activeTab === 'safety' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-gray-900 text-base">منشور اخلاقی و پروتکل‌های پزشکی-رفتاری</h3>
              <span className="text-xxs text-gray-400">تعهدنامهPet Mate به مربیگری اصولی حیوانات</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {HUMANE_TRAINING_PRINCIPLES.map((g) => (
                <Card
                  key={g.id}
                  className={`p-5 space-y-3 border ${
                    g.type === 'alert'
                      ? 'border-coral/20 bg-coral/5'
                      : g.type === 'warning'
                      ? 'border-sunny/20 bg-sunny/5'
                      : 'border-brand/10 bg-brand/5'
                  }`}
                >
                  <h4
                    className={`font-black text-sm ${
                      g.type === 'alert'
                        ? 'text-coral-deep'
                        : g.type === 'warning'
                        ? 'text-sunny-deep'
                        : 'text-brand'
                    }`}
                  >
                    {g.title}
                  </h4>
                  <p className="text-gray-600 text-xs leading-relaxed">{g.description}</p>
                </Card>
              ))}
            </div>

            {/* Emergency and Veterinary Routing Section */}
            <div className="bg-gradient-to-l from-slate-900 to-slate-850 text-white rounded-2xl p-6 shadow-md space-y-4">
              <div className="space-y-1">
                <h4 className="text-lg font-black text-brand flex items-center gap-2">
                  <Stethoscope className="text-coral" size={22} />
                  {EMERGENCIES_AND_VET_ROUTING.title}
                </h4>
                <p className="text-slate-400 text-xs">{EMERGENCIES_AND_VET_ROUTING.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {EMERGENCIES_AND_VET_ROUTING.conditions.map((cond, i) => (
                  <div key={i} className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2">
                    <div className="text-xs font-extrabold text-amber-400 flex items-start gap-1">
                      <span className="bg-amber-400/10 text-amber-400 px-1.5 py-0.5 rounded text-xxs shrink-0">رویداد</span>
                      <span>{cond.trigger}</span>
                    </div>
                    <div className="text-xxs text-slate-300 leading-relaxed flex items-start gap-1">
                      <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded text-xxs shrink-0">مسیر اقدام علمی</span>
                      <span>{cond.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL FOR LIBRARY LESSONS */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm" dir="rtl">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in duration-200">
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-brand text-xxs font-extrabold tracking-wider uppercase block">پروتکل گام‌به‌گام مهارتی</span>
                <h3 className="text-lg font-black">{selectedLesson.title}</h3>
              </div>
              <button
                onClick={() => setSelectedLesson(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <p className="text-gray-600 text-xs leading-relaxed">{selectedLesson.summary}</p>

              <div className="space-y-2">
                <span className="text-xs font-extrabold text-gray-800 block">پیشنیازهای اولیه تمرین:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLesson.prerequisites.map((req, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 text-xxs px-2.5 py-1 rounded-md font-medium">
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-extrabold text-gray-800 block">مراحل و گام‌های اجرای داوطلبانه:</span>
                <div className="space-y-3">
                  {selectedLesson.steps.map((step, idx) => (
                    <div key={step.id} className="bg-gray-50 border border-gray-100 p-3.5 rounded-xl space-y-1">
                      <span className="text-brand text-xs font-black">
                        گام {toPersian(idx + 1)}: {step.title}
                      </span>
                      <p className="text-gray-700 text-xs leading-relaxed">{step.instruction}</p>
                      <p className="text-success text-xxs font-bold pt-1">
                        <strong>شاخص تایید گام:</strong> {step.successCriterion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedLesson.safetyNotes && selectedLesson.safetyNotes.length > 0 && (
                <div className="bg-coral/5 border border-coral/15 p-4 rounded-xl space-y-1.5">
                  <span className="text-coral-deep text-xs font-bold flex items-center gap-1.5">
                    <AlertTriangle size={15} />
                    نکات ایمنی و حفاظتی بسیار مهم:
                  </span>
                  <ul className="list-disc list-inside text-gray-600 text-xxs space-y-1 leading-relaxed">
                    {selectedLesson.safetyNotes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedLesson.reviewedBy && (
                <div className="flex items-center gap-2 bg-mint/5 border border-mint/20 p-3 rounded-xl text-xxs text-success font-semibold">
                  <ShieldCheck size={16} />
                  <span>تایید علمی شده توسط: {selectedLesson.reviewedBy} (بررسی در تاریخ {toPersian(selectedLesson.reviewedAt || '1405')})</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedLesson(null)}>
                بستن پنجره
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-slate-900 text-white hover:bg-slate-800 border-none"
                onClick={() => {
                  handleAddGoalFromLesson(selectedLesson);
                  setSelectedLesson(null);
                }}
              >
                افزودن به اهداف تمرین
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CUSTOM GOAL DIALOG MODAL */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in duration-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">تعریف هدف تمرینی علمی جدید</h3>
                <p className="text-slate-400 text-xxs mt-0.5">آموزش هدفمند و دور از خشونت فیزیکی</p>
              </div>
              <button
                onClick={() => setShowGoalModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateGoalSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-gray-700 block">عنوان مهارت یا فرمان:</label>
                <input
                  type="text"
                  required
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="مثال: آموزش داوطلبانه بیا (Recall)"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-gray-700 block">توصیف رفتار مورد نظر:</label>
                <textarea
                  required
                  value={goalBehavior}
                  onChange={(e) => setGoalBehavior(e.target.value)}
                  placeholder="مثال: آمدن سریع سگ به سمت سرپرست به محض شنیدن نام فرمان بدون تاخیر."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand font-medium resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-gray-700 block">معیار یا تعریف کسب موفقیت کامل:</label>
                <input
                  type="text"
                  required
                  value={goalSuccessDef}
                  onChange={(e) => setGoalSuccessDef(e.target.value)}
                  placeholder="مثال: انجام موفق ۳ بار متوالی در فضای باز با بند بلند قلاده"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-gray-700 block">توضیحات فرعی یا محیط اجرا:</label>
                <input
                  type="text"
                  value={goalContext}
                  onChange={(e) => setGoalContext(e.target.value)}
                  placeholder="مثال: تمرین با سینه بند قلاده و تشویقی جگر مرغ"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand font-medium"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowGoalModal(false)}>
                  انصراف
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-slate-900 text-white border-none hover:bg-slate-800">
                  ذخیره و ایجاد هدف
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
