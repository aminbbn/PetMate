export type BehaviorSignalCategory =
  | 'vocal'
  | 'body_posture'
  | 'tail_ears'
  | 'social_interaction'
  | 'autonomic';

export type BehaviorContext =
  | 'resting'
  | 'eating'
  | 'play'
  | 'greeting'
  | 'unfamiliar_environment'
  | 'veterinary_visit'
  | 'other';

export interface PossibleMeaning {
  meaning: string; // Persian description
  probabilityHint: 'high' | 'medium' | 'low';
  contextRequired?: string; // e.g. "در حضور غریبه‌ها" or "هنگام استراحت"
}

export interface BehaviorSignal {
  id: string;
  species: 'dog' | 'cat';
  category: BehaviorSignalCategory;
  name: string; // Persian name
  description: string; // Persian detailed description
  possibleMeanings: PossibleMeaning[];
  isRedFlag: boolean;
  redFlagDetails?: string; // Persian medical red flag details if true
  safeResponseAdvice: string; // Persian safety guidelines for the owner (non-punitive, warm, and secure)
}

export interface BehaviorObservation {
  id: string;
  petId: string;
  observedAt: string; // ISO string
  context: BehaviorContext;
  signals: string[]; // references to BehaviorSignal.id
  notes?: string;
  mediaUrl?: string; // media simulated or uploaded by user
  mediaType?: 'image' | 'video';
}

export interface BehaviorAssessment {
  id: string;
  petId: string;
  createdAt: string; // ISO string
  signalsAnalyzed: string[]; // references to BehaviorSignal.id
  context: BehaviorContext;
  findings: string[]; // Persian list of findings
  actionPlan: string[]; // Persian non-punitive, reassuring behavioral guidelines
  vetReferralRecommended: boolean;
  referralReason?: string; // Persian reason for referral if recommended
}

export interface BehaviorMedia {
  id: string;
  url: string;
  type: 'image' | 'video';
  label: string;
}
