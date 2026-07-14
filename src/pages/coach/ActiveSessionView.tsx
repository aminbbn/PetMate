import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { TrainingLesson, TrainingGoal, TrainingAttempt, TrainingAttemptOutcome } from './trainingTypes';
import { calculateSessionSuccessRate, formatSessionDuration, getOutcomeLabel, getEngagementLabel } from './trainingUtils';
import { Play, Pause, Square, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, HelpCircle, FileText, Activity } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { toPersian } from '../../lib/persian';

interface ActiveSessionViewProps {
  lesson?: TrainingLesson;
  goal: TrainingGoal;
  sessionId: string;
  onClose: () => void;
}

export const ActiveSessionView: React.FC<ActiveSessionViewProps> = ({
  lesson,
  goal,
  sessionId,
  onClose
}) => {
  const trainingSessions = useAppStore((state) => state.trainingSessions);
  const addTrainingAttempt = useAppStore((state) => state.addTrainingAttempt);
  const endTrainingSession = useAppStore((state) => state.endTrainingSession);
  const updateTrainingGoal = useAppStore((state) => state.updateTrainingGoal);

  const activeSession = trainingSessions.find((s) => s.id === sessionId);

  // Stop watch state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Active step navigation
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // End Session Dialog
  const [showEndModal, setShowEndModal] = useState(false);
  const [engagement, setEngagement] = useState<'engaged' | 'mixed' | 'disengaged' | 'stressed' | 'unknown'>('engaged');
  const [stopReason, setStopReason] = useState<'completed' | 'pet_disengaged' | 'stress_signal' | 'health_concern' | 'time_limit' | 'other'>('completed');
  const [userNotes, setUserNotes] = useState('');
  const [markGoalAchieved, setMarkGoalAchieved] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive]);

  if (!activeSession) {
    return (
      <div className="p-6 text-center text-gray-500">
        خطا: جلسه تمرینی یافت نشد.
      </div>
    );
  }

  const stepsCount = lesson?.steps.length || 1;
  const currentStep = lesson?.steps[activeStepIndex];

  // Stopwatch formatting
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${toPersian(mins.toString().padStart(2, '0'))}:${toPersian(secs.toString().padStart(2, '0'))}`;
  };

  const handleLogAttempt = (outcome: TrainingAttemptOutcome) => {
    const stepId = currentStep?.id || 'custom-step';
    addTrainingAttempt(sessionId, {
      stepId,
      outcome,
      note: `ثبت داوطلبانه گام ${activeStepIndex + 1}`
    });
  };

  const handleEndSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Call store action
    endTrainingSession(sessionId, {
      petEngagement: engagement,
      stopReason,
      userNotes,
      attempts: activeSession.attempts
    });

    // Update goal's current step or achieved status
    const goalUpdates: any = {
      status: markGoalAchieved ? 'achieved' : 'active',
      updatedAt: new Date().toISOString()
    };
    if (currentStep) {
      goalUpdates.currentStepId = currentStep.id;
    }
    if (markGoalAchieved) {
      goalUpdates.achievedAt = new Date().toISOString();
    }

    updateTrainingGoal(goal.id, goalUpdates);

    onClose();
  };

  const successRate = calculateSessionSuccessRate(activeSession);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Session Header Status */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-right">
          <div className="text-brand text-xs font-bold uppercase tracking-wider flex items-center gap-2 justify-center md:justify-start">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            جلسه تمرینی زنده و فعال
          </div>
          <h2 className="text-xl font-bold">{goal.title}</h2>
          <p className="text-slate-400 text-xs">
            پروتکل اخلاقی برای آموزش: {lesson ? lesson.title : 'هدف تمرینی سفارشی'}
          </p>
        </div>

        <div className="flex items-center gap-6 bg-slate-800 px-6 py-3 rounded-xl border border-slate-700">
          <div className="text-center">
            <div className="text-slate-400 text-xxs font-semibold">زمان سپری‌شده</div>
            <div className="text-2xl font-mono font-bold text-brand">{formatTime(elapsedSeconds)}</div>
          </div>
          <div className="h-8 w-[1px] bg-slate-700" />
          <div className="text-center">
            <div className="text-slate-400 text-xxs font-semibold">موفقیت نسبی</div>
            <div className="text-2xl font-mono font-bold text-success">{toPersian(successRate)}٪</div>
          </div>
          <div className="h-8 w-[1px] bg-slate-700" />
          <div className="text-center">
            <div className="text-slate-400 text-xxs font-semibold">تعداد تلاش‌ها</div>
            <div className="text-2xl font-mono font-bold text-white">{toPersian(activeSession.attempts.length)}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={isTimerActive ? 'outline' : 'primary'}
            size="sm"
            onClick={() => setIsTimerActive(!isTimerActive)}
            className="border-slate-700 text-white hover:bg-slate-800"
          >
            {isTimerActive ? <Pause size={16} /> : <Play size={16} />}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setIsTimerActive(false);
              setShowEndModal(true);
            }}
            className="flex items-center gap-2"
          >
            <Square size={14} />
            اتمام و ثبت گزارش
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Lesson Guide & Logging (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {lesson && currentStep ? (
            <Card className="p-6 border-brand/10 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="bg-brand/10 text-brand px-3 py-1 rounded-full text-xs font-bold">
                  گام {toPersian(activeStepIndex + 1)} از {toPersian(stepsCount)}: {currentStep.title}
                </span>

                <div className="flex gap-1">
                  <button
                    disabled={activeStepIndex === 0}
                    onClick={() => setActiveStepIndex((prev) => prev - 1)}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                    title="گام قبلی"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <button
                    disabled={activeStepIndex === stepsCount - 1}
                    onClick={() => setActiveStepIndex((prev) => prev + 1)}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"
                    title="گام بعدی"
                  >
                    <ChevronLeft size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-gray-400 text-xs font-bold">دستورالعمل اجرا:</span>
                  <p className="text-gray-800 leading-relaxed text-sm">{currentStep.instruction}</p>
                </div>

                <div className="bg-mint/5 border border-mint/20 p-3 rounded-xl space-y-1">
                  <span className="text-success text-xs font-bold flex items-center gap-1">
                    <CheckCircle size={14} />
                    معیار موفقیت این گام:
                  </span>
                  <p className="text-gray-700 text-xs leading-relaxed">{currentStep.successCriterion}</p>
                </div>

                {currentStep.easierAlternative && (
                  <div className="bg-sunny/5 border border-sunny/20 p-3 rounded-xl space-y-1">
                    <span className="text-sunny-deep text-xs font-bold flex items-center gap-1">
                      <HelpCircle size={14} />
                      راهکار جایگزین (اگر پت مقاومت می‌کند یا متوجه نمی‌شود):
                    </span>
                    <p className="text-gray-700 text-xs leading-relaxed">{currentStep.easierAlternative}</p>
                  </div>
                )}

                {currentStep.commonMistakes && currentStep.commonMistakes.length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-xl space-y-1">
                    <span className="text-gray-500 text-xs font-bold">اشتباهات رایج سرپرستان:</span>
                    <ul className="list-disc list-inside text-gray-600 text-xxs space-y-1">
                      {currentStep.commonMistakes.map((mistake, i) => (
                        <li key={i}>{mistake}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentStep.stopSignals && currentStep.stopSignals.length > 0 && (
                  <div className="bg-coral/5 border border-coral/10 p-3 rounded-xl space-y-1">
                    <span className="text-coral-deep text-xs font-bold flex items-center gap-1">
                      <AlertTriangle size={14} />
                      نشانه‌های خستگی حیوان (در صورت مشاهده تمرین را قطع کنید):
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {currentStep.stopSignals.map((sig, i) => (
                        <span key={i} className="bg-coral/10 text-coral-deep text-xxs px-2.5 py-1 rounded-md font-bold">
                          {sig}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="p-6 border-brand/10 space-y-4">
              <h3 className="text-lg font-bold">ثبت فعالیت برای هدف تمرینی سفارشی</h3>
              <p className="text-gray-600 text-sm">
                این یک هدف اختصاصی است که فاقد گام‌های کتابخانه‌ای پیش‌فرض است. در طول تمرین، می‌توانید موفقیت یا نیاز به تلاش بیشتر حیوان را ثبت کنید.
              </p>
            </Card>
          )}

          {/* Feedback & Logging Console */}
          <Card className="p-6 border-brand/10 space-y-4">
            <h3 className="text-sm font-bold text-gray-800">کنسول ثبت پاسخ و بازخورد حیوان</h3>
            <p className="text-gray-400 text-xxs">
              به جای علامت‌گذاری ساده کل یک درس به عنوان "کامل شد"، هر تلاش موفق یا ناموفق حیوان را در لحظه ثبت کنید. این کار به الگوریتم مربی کمک می‌کند تصویر واقعی‌تری ترسیم کند.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => handleLogAttempt('success')}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-mint/20 bg-mint/5 hover:bg-mint/10 transition-all text-success"
              >
                <span className="text-xl mb-1">🟢</span>
                <span className="text-xs font-black">انجام کامل و موفق</span>
                <span className="text-xxs text-gray-400 mt-1">واکنش عالی</span>
              </button>

              <button
                onClick={() => handleLogAttempt('partial')}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-sunny/20 bg-sunny/5 hover:bg-sunny/10 transition-all text-sunny-deep"
              >
                <span className="text-xl mb-1">🟡</span>
                <span className="text-xs font-black">مشارکت نیمه‌کاره</span>
                <span className="text-xxs text-gray-400 mt-1">نیاز به تشویق</span>
              </button>

              <button
                onClick={() => handleLogAttempt('not_yet')}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all text-gray-600"
              >
                <span className="text-xl mb-1">⚪</span>
                <span className="text-xs font-black">هنوز آماده نبود</span>
                <span className="text-xxs text-gray-400 mt-1">عدم همکاری غریزی</span>
              </button>

              <button
                onClick={() => handleLogAttempt('stopped')}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-coral/20 bg-coral/5 hover:bg-coral/10 transition-all text-coral-deep"
              >
                <span className="text-xl mb-1">🔴</span>
                <span className="text-xs font-black">توقف فوری گام</span>
                <span className="text-xxs text-gray-400 mt-1">نیاز به توقف</span>
              </button>
            </div>
          </Card>
        </div>

        {/* Real-time attempts log (1 col) */}
        <div className="space-y-6">
          <Card className="p-4 border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Activity size={16} className="text-brand" />
              تلاش‌های ثبت‌شده در این جلسه ({toPersian(activeSession.attempts.length)})
            </h3>

            {activeSession.attempts.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                هنوز تلاشی ثبت نشده است. روی یکی از گزینه‌های کنسول ثبت پاسخ ضربه بزنید.
              </div>
            ) : (
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {activeSession.attempts.map((att, i) => {
                  const outcomeDetails = getOutcomeLabel(att.outcome);
                  return (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-bold">{toPersian(i + 1)}.</span>
                        <span className="font-medium text-gray-700">تلاش گام فعال</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-xxs border ${outcomeDetails.color}`}>
                        {outcomeDetails.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Ethics reminder widget */}
          <div className="bg-brand/5 border border-brand/10 p-4 rounded-xl text-xs text-gray-600 space-y-2">
            <h4 className="font-bold text-brand flex items-center gap-1.5">
              💡 قانون اصولی تمرین موفق:
            </h4>
            <p className="leading-relaxed">
              یک بار موفقیت به منزله پایداری یادگیری نیست. اگر پت شما در گامی موفق شد، او را شدیداً تشویق کنید و به آرامی تکرار کنید. از تمرینات طولانی بپرهیزید؛ ۲ دقیقه تمرین شاداب ده برابر باارزش‌تر از ۲۰ دقیقه تمرین فرسایشی است.
            </p>
          </div>
        </div>
      </div>

      {/* End Session Form Dialog Modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 text-white p-5">
              <h3 className="text-lg font-bold">ثبت نهایی و گزارش‌نویسی جلسه تمرین</h3>
              <p className="text-slate-400 text-xxs mt-1">
                ثبت دقیق داده‌های رفتاری به منظور ردیابی نرخ تسلط و امنیت جسمی پت شما در درازمدت
              </p>
            </div>

            <form onSubmit={handleEndSessionSubmit} className="p-6 space-y-4">
              {/* Engagement Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  ۱. میزان انگیزه، تمرکز و نشاط حیوان در طول تمرین:
                </label>
                <select
                  value={engagement}
                  onChange={(e) => setEngagement(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand font-medium"
                >
                  <option value="engaged">🎯 پرنشاط، متمرکز و علاقه‌مند به دریافت تشویقی</option>
                  <option value="mixed">⚖️ متوسط / مشارکت پاره‌وقت با حواس‌پرتی جزئی</option>
                  <option value="disengaged">💤 بی‌علاقه / امتناع خفیف / نشانه خستگی</option>
                  <option value="stressed">⚠️ دارای نشانه‌های بارز تنش عضلانی یا اضطراب</option>
                </select>
              </div>

              {/* Stop Reason */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  ۲. علت اصلی تصمیم شما برای پایان دادن به این جلسه:
                </label>
                <select
                  value={stopReason}
                  onChange={(e) => setStopReason(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand font-medium"
                >
                  <option value="completed">تکمیل موفقیت‌آمیز گام‌های از پیش تعیین‌شده</option>
                  <option value="pet_disengaged">کاهش انگیزه یا خستگی زیاد پت</option>
                  <option value="stress_signal">مشاهده نشانه‌های استرس شدید حیوان (له‌له زدن، لیسیدن لب)</option>
                  <option value="health_concern">احتمال وجود درد جسمانی یا خستگی مفصلی</option>
                  <option value="time_limit">رسیدن به سقف محدودیت زمانی پیشنهادی (زیر ۸ دقیقه)</option>
                  <option value="other">تصمیم مربی یا عوامل متفرقه دیگر</option>
                </select>
              </div>

              {/* Safety Alert Warning in Form based on selections */}
              {engagement === 'stressed' && (
                <div className="bg-coral/5 border border-coral/15 p-3 rounded-xl text-xxs text-coral-deep leading-relaxed">
                  <strong>⚠️ هشدار رفتارشناسی:</strong> زمانی که حیوان نشانه‌های مداوم استرس دارد، آموزش متوقف شده و به نقطه آسایش قبلی بازگردید. ادامه تمرین در شرایط تنش باعث سرخوردگی و افت اعتماد گشته و ممکن است به واکنش‌های مدافعه‌جویانه فیزیکی ختم شود.
                </div>
              )}

              {stopReason === 'health_concern' && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xxs text-amber-800 leading-relaxed">
                  <strong>🩺 توصیه پزشکی مربی:</strong> امتناع از نشستن یا راه رفتن غالباً ناشی از دردهای مفاصل یا ارتوپدی است. این موضوع را در بخش سلامت ثبت کنید یا با دامپزشک پشتیبان تماس بگیرید.
                </div>
              )}

              {/* Goal Achieved Checkbox */}
              <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <input
                  type="checkbox"
                  id="markGoalAchieved"
                  checked={markGoalAchieved}
                  onChange={(e) => setMarkGoalAchieved(e.target.checked)}
                  className="mt-0.5 rounded border-gray-300 text-brand focus:ring-brand"
                />
                <div className="space-y-0.5">
                  <label htmlFor="markGoalAchieved" className="text-xs font-bold text-gray-800 cursor-pointer">
                    مهارت کاملاً تثبیت شد و به دست آمد؟ (Mark as Achieved)
                  </label>
                  <p className="text-xxs text-gray-400">
                    تنها در صورتی تیک بزنید که حیوان این رفتار را در حداقل ۳ محیط کاملاً مجزا و با حداقل محرک حواس‌پرتی با موفقیت تکرار کرده باشد.
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  ۳. یادداشت‌های اضافی و مشاهدات شما:
                </label>
                <textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="مثال: دیشب نسبت به صدای گام سوم کمی حساس بود، برای همین فردا گام دوم را دوباره مرور می‌کنیم."
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand font-medium resize-none"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEndModal(false)}
                >
                  بازگشت به تمرین
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="bg-slate-900 text-white hover:bg-slate-800 border-none"
                >
                  ثبت دائمی در پرونده تمرین
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
