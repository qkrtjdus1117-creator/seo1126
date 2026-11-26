export type AgeGroup = 'infant' | 'youth' | 'adult' | 'senior';
export type ResidenceType = 'cheonan' | 'other';
export type GroupType = 'individual' | 'group';
export type SpecialStatus = 'none' | 'disabled' | 'merit' | 'welfare' | 'multichild';

export type FeeTier = 'free' | 'discounted' | 'standard';

export interface DiagnosisAnswers {
  ageGroup: AgeGroup | null;
  residence: ResidenceType | null;
  groupType: GroupType | null;
  specialStatus: SpecialStatus | null;
  visitDate: string; // YYYY-MM-DD
}

export interface QuestionOption<T extends string> {
  value: T;
  label: string;
  description: string;
  hint?: string;
}

export interface DateInspection {
  formattedKorean: string;
  dayName: string;
  isCultureDay: boolean;
  isChildrensDay: boolean;
  isRegularClosedDay: boolean;
  closedReason: string | null;
  benefitLabel: string | null;
}

export interface RequiredDocument {
  title: string;
  detail: string;
  reasonTag: string;
}

export interface DiagnosisResultData {
  tier: FeeTier;
  tierLabel: string;
  headline: string;
  summary: string;
  appliedReasons: string[];
  nonStackingNote: string | null;
  documents: RequiredDocument[];
  dateInspection: DateInspection;
}
