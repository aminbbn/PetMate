import { TrainingSession, TrainingAttemptOutcome } from './trainingTypes';

/**
 * Calculates the success rate of a training session based on its attempts.
 * Success is counted as 1.0, Partial as 0.5, Not Yet as 0, Stopped as 0.
 */
export function calculateSessionSuccessRate(session: TrainingSession): number {
  if (!session.attempts || session.attempts.length === 0) return 0;
  
  let score = 0;
  session.attempts.forEach((att) => {
    if (att.outcome === 'success') score += 1.0;
    else if (att.outcome === 'partial') score += 0.5;
  });
  
  return Math.round((score / session.attempts.length) * 100);
}

/**
 * Formats a duration in ISO string format (startedAt and endedAt) to Persian text.
 */
export function formatSessionDuration(startedAt: string, endedAt?: string): string {
  if (!endedAt) return 'درحال برگزاری';
  
  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();
  const diffMs = end - start;
  
  if (isNaN(diffMs) || diffMs < 0) return 'نامشخص';
  
  const diffSecs = Math.floor(diffMs / 1000);
  const mins = Math.floor(diffSecs / 60);
  const secs = diffSecs % 60;
  
  if (mins === 0) {
    return `${secs} ثانیه`;
  }
  return `${mins} دقیقه و ${secs} ثانیه`;
}

/**
 * Maps attempt outcomes to user-friendly Persian labels with styling colors.
 */
export function getOutcomeLabel(outcome: TrainingAttemptOutcome): { label: string; color: string; icon: string } {
  switch (outcome) {
    case 'success':
      return { label: 'کامل انجام داد', color: 'text-success bg-mint/10 border-mint/20', icon: '🟢' };
    case 'partial':
      return { label: 'تا حدی مشارکت داشت', color: 'text-sunny-deep bg-sunny/10 border-sunny/20', icon: '🟡' };
    case 'not_yet':
      return { label: 'هنوز آماده نبود', color: 'text-gray-500 bg-gray-100 border-gray-200', icon: '⚪' };
    case 'stopped':
      return { label: 'تمرین متوقف شد', color: 'text-coral-deep bg-coral/10 border-coral/20', icon: '🔴' };
  }
}

/**
 * Maps the engagement level of a pet to a clear Persian status description.
 */
export function getEngagementLabel(engagement: string): { label: string; icon: string } {
  switch (engagement) {
    case 'engaged':
      return { label: 'پرانرژی و متمرکز', icon: '🎯' };
    case 'mixed':
      return { label: 'مشارکت متوسط / حواس‌پرتی جزئی', icon: '⚖️' };
    case 'disengaged':
      return { label: 'بی‌علاقه / نیاز به استراحت', icon: '💤' };
    case 'stressed':
      return { label: 'دارای علائم استرس و اضطراب', icon: '⚠️' };
    default:
      return { label: 'نامشخص', icon: '❓' };
  }
}

/**
 * Maps the stop reason of a session to descriptive Persian.
 */
export function getStopReasonLabel(reason: string): string {
  switch (reason) {
    case 'completed':
      return 'تکمیل موفقیت‌آمیز مراحل در این جلسه';
    case 'pet_disengaged':
      return 'کاهش انگیزه یا خستگی پت';
    case 'stress_signal':
      return 'مشاهده علائم استرس یا اضطراب در حیوان';
    case 'health_concern':
      return 'احتمال وجود درد یا مشکل جسمانی';
    case 'time_limit':
      return 'پایان زمان استاندارد جلسه تمرینی';
    case 'other':
    default:
      return 'سایر موارد یا تصمیم سرپرست';
  }
}
