export type TrainingSpecies = 'dog' | 'cat' | 'both';

export type TrainingCategory =
  | 'foundation'
  | 'walking'
  | 'handling'
  | 'recall'
  | 'calmness'
  | 'enrichment'
  | 'cooperative_care'
  | 'house_training'
  | 'scratching'
  | 'carrier'
  | 'social'
  | 'behavior_support'
  | 'other';

export type TrainingDifficulty =
  | 'starter'
  | 'developing'
  | 'advanced';

export type TrainingGoalStatus =
  | 'planned'
  | 'active'
  | 'paused'
  | 'achieved'
  | 'archived';

export interface TrainingStep {
  id: string;
  title: string;
  instruction: string;
  successCriterion: string;
  easierAlternative?: string;
  commonMistakes?: string[];
  stopSignals?: string[];
}

export interface TrainingLesson {
  id: string;
  species: TrainingSpecies;
  category: TrainingCategory;
  title: string;
  summary: string;
  difficulty: TrainingDifficulty;
  sessionMinutesMin: number;
  sessionMinutesMax: number;
  prerequisites: string[];
  environment: string[];
  reinforcementOptions: string[];
  safetyNotes: string[];
  professionalHelpSignals: string[];
  steps: TrainingStep[];
  sourceName?: string;
  sourceUrl?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface TrainingGoal {
  id: string;
  petId: string;
  lessonId?: string;
  title: string;
  desiredBehavior: string;
  context?: string;
  status: TrainingGoalStatus;
  currentStepId?: string;
  successDefinition: string;
  reminderId?: string;
  linkedBehaviorObservationId?: string;
  createdAt: string;
  updatedAt: string;
  achievedAt?: string;
}

export type TrainingAttemptOutcome =
  | 'success'
  | 'partial'
  | 'not_yet'
  | 'stopped';

export interface TrainingAttempt {
  id: string;
  stepId: string;
  outcome: TrainingAttemptOutcome;
  note?: string;
  recordedAt: string;
}

export interface TrainingSession {
  id: string;
  petId: string;
  goalId: string;
  lessonId?: string;
  startedAt: string;
  endedAt?: string;
  environment?: string;
  distractionLevel?: 'low' | 'medium' | 'high';
  reinforcementUsed?: string;
  attempts: TrainingAttempt[];
  petEngagement:
    | 'engaged'
    | 'mixed'
    | 'disengaged'
    | 'stressed'
    | 'unknown';
  userNotes?: string;
  stopReason?:
    | 'completed'
    | 'pet_disengaged'
    | 'stress_signal'
    | 'health_concern'
    | 'time_limit'
    | 'other';
  createdAt: string;
  updatedAt: string;
}

export interface SkillProgress {
  petId: string;
  goalId: string;
  currentStepId?: string;
  recentSuccessRate?: number;
  sessionsCount: number;
  lastPracticedAt?: string;
  status: TrainingGoalStatus;
  updatedAt: string;
}

export interface CreateTrainingGoalInput {
  petId: string;
  lessonId?: string;
  title: string;
  desiredBehavior: string;
  context?: string;
  status: TrainingGoalStatus;
  currentStepId?: string;
  successDefinition: string;
  reminderId?: string;
  linkedBehaviorObservationId?: string;
}

export interface UpdateTrainingGoalInput {
  title?: string;
  desiredBehavior?: string;
  context?: string;
  status?: TrainingGoalStatus;
  currentStepId?: string;
  successDefinition?: string;
  reminderId?: string;
  linkedBehaviorObservationId?: string;
  achievedAt?: string;
}

export interface StartTrainingSessionInput {
  petId: string;
  goalId: string;
  lessonId?: string;
  environment?: string;
  distractionLevel?: 'low' | 'medium' | 'high';
  reinforcementUsed?: string;
}

export interface CreateTrainingAttemptInput {
  stepId: string;
  outcome: TrainingAttemptOutcome;
  note?: string;
}

export interface UpdateTrainingSessionInput {
  environment?: string;
  distractionLevel?: 'low' | 'medium' | 'high';
  reinforcementUsed?: string;
  userNotes?: string;
}

export interface EndTrainingSessionInput {
  petEngagement: 'engaged' | 'mixed' | 'disengaged' | 'stressed' | 'unknown';
  userNotes?: string;
  stopReason?: 'completed' | 'pet_disengaged' | 'stress_signal' | 'health_concern' | 'time_limit' | 'other';
  attempts: TrainingAttempt[];
}
