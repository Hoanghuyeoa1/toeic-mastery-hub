export type ScoreRange = {
  rawMin: number;
  rawMax: number;
  scaled: number;
};

export interface UserProfile {
  name: string;
  hasCompletedOnboarding: boolean;
  currentScore: number | null; // null when brand new
  targetScore: number;
  currentListening: number | null;
  currentReading: number | null;
  targetListening: number;
  targetReading: number;
  examDate: string; // YYYY-MM-DD
  dailyStudyTargetMins: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
}

export type GoalTriggerKey = 'vocab' | 'test' | 'trap' | 'pomo';

export interface DailyGoal {
  id: string;
  text: string;
  category: 'vocab' | 'listening' | 'reading' | 'grammar' | 'practice';
  triggerKey: GoalTriggerKey;
  completed: boolean;
  date: string; // YYYY-MM-DD
  progressCurrent: number;
  progressTarget: number;
  actionHint: string;
}

export interface HeatmapRecord {
  date: string; // YYYY-MM-DD
  count: number; // study actions
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface RoadmapTask {
  id: string;
  phaseId: string;
  title: string;
  deadline: string; // YYYY-MM-DD
  status: TaskStatus;
  partTag: string;
  notes: string;
  estimatedHours: number;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  order: number;
  color: string;
  tasks: RoadmapTask[];
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  partTag: string;
  durationMinutes: number;
  completed: boolean;
  phaseTaskId?: string;
}

export type SRSRating = 'hard' | 'medium' | 'easy';

export interface VocabularyItem {
  id: string;
  word: string;
  ipa: string;
  pos: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'phrase';
  vnMeaning: string;
  example: string;
  partTag: string;
  trapNote: string;
  topic: string;
  srsStage: number; // 0 to 5
  nextReviewDate: string; // YYYY-MM-DD
  lastReviewedDate?: string;
  reviewCount: number;
}

export interface GrammarNote {
  id: string;
  title: string;
  category: string;
  formula: string;
  explanation: string;
  examples: string[];
  traps: string[];
  tags: string[];
}

export interface TrapNote {
  id: string;
  part: string;
  title: string;
  trapDescription: string;
  counterStrategy: string;
  exampleProblem: string;
  explanation: string;
  frequency: 'high' | 'critical' | 'medium';
}

export type MistakeReason =
  | 'trap'
  | 'vocab'
  | 'time'
  | 'listening_connected'
  | 'grammar'
  | 'careless'
  | 'unclassified';

export interface MistakeItem {
  id: string;
  questionNum: number;
  part: string;
  yourAnswer: string;
  correctAnswer: string;
  reason: MistakeReason;
  reasonText: string;
  lessonLearned: string;
  // Phase 18: Full Mock linkage & Review integration
  sessionId?: string;
  questionId?: string;
  topic?: string;
  explanation?: string;
  contentRevision?: number;
  isReviewed?: boolean;
  userConfirmedReason?: boolean;
  notes?: string;
  isUnanswered?: boolean;
}

export type TestLogType =
  | 'official'
  | 'self_reported'
  | 'full_mock'
  | 'diagnostic'
  | 'practice';

export interface TestLog {
  id: string;
  date: string; // YYYY-MM-DD
  testName: string;
  listeningRaw: number;
  readingRaw: number;
  listeningScore: number;
  readingScore: number;
  totalScore: number;
  durationMinutes: number;
  targetScore?: number;
  mistakes: MistakeItem[];
  notes?: string;
  // Phase 18: Full Mock linkage & classification
  type?: TestLogType;
  sessionId?: string;
  examFormId?: string;
  contentRevision?: number;
  isEstimatedScore?: boolean;
  accuracyPercentage?: number;
  partAccuracies?: Record<number, number>;
  mode?: 'simulation' | 'strict';
  integrityStatusSummary?: string;
}

export interface DiagnosticQuestion {
  id: string;
  part: string; // "Part 1", "Part 2", ... "Part 7"
  partNum: number; // 1 to 7
  section: 'listening' | 'reading';
  stimulus?: string; // photo description or conversation context
  audioScript?: string; // what the speaker says
  question: string;
  options: { key: string; text: string }[];
  correctKey: string;
  explanation: string;
  skillTag: string;
}

export interface AppData {
  version: string;
  profile: UserProfile;
  dailyGoals: DailyGoal[];
  roadmapPhases: RoadmapPhase[];
  calendarEvents: CalendarEvent[];
  vocabulary: VocabularyItem[];
  grammarNotes: GrammarNote[];
  trapNotes: TrapNote[];
  testLogs: TestLog[];
  activityHeatmap: Record<string, number>; // date -> count
}

// Re-export Question Bank Foundation Domain Models (Phase 1)
export * from './questionBank';

// Re-export Practice Session Engine Models (Phase 5)
export * from './practiceSession';

// Re-export Listening Audio Engine Models (Phase 6)
export * from './listeningAudio';

// Re-export Full Mock Exam Blueprint & Models (Phase 1)
export * from './mockExam';

// Re-export Exam Listening Audio Engine Models (Phase 12)
export * from './examAudio';

// Re-export Exam Library & Preflight Models (Phase 13)
export * from './examLibrary';

// Re-export Exam Workspace & Answer Sheet Models (Phase 14)
export * from './examWorkspace';

// Re-export Exam Results & Answer Review Models (Phase 17)
export * from './examReview';
