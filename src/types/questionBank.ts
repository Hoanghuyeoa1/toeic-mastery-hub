/**
 * TOEIC Mastery Hub — Question Bank Domain Types & Interfaces
 * Phase 1: Foundation Architecture
 * 
 * Strict discriminated unions for TOEIC Parts 1-7, grouped passages,
 * audio/visual media metadata, and learner practice session structures.
 * 
 * Note: Static question bank data is strictly decoupled from User AppData
 * to support offline scaling up to thousands of items without bloating LocalStorage.
 */

export type ToeicPartNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type ToeicPartName =
  | 'Part 1'
  | 'Part 2'
  | 'Part 3'
  | 'Part 4'
  | 'Part 5'
  | 'Part 6'
  | 'Part 7';

export type ToeicSection = 'listening' | 'reading';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export type StandardChoiceKey = 'A' | 'B' | 'C' | 'D';
export type Part2ChoiceKey = 'A' | 'B' | 'C';

export interface QuestionOption<TKey extends string = StandardChoiceKey> {
  key: TKey;
  text: string;
}

// Media Contracts
export interface AudioMedia {
  audioUrl?: string; // Pre-recorded mp3/wav if available
  audioScript?: string; // Spoken text for Web Speech API TTS or script inspection
  durationSeconds?: number;
  accent?: 'US' | 'UK' | 'AU' | 'CA';
  speakerGender?: 'male' | 'female';
}

export interface VisualMedia {
  imageUrl?: string; // Static asset / external URL
  illustrationId?: string; // SVG illustration ID (e.g., 'office_woman_photo', 'conference_room_photo')
  altText?: string;
  width?: number;
  height?: number;
}

export interface QuestionMedia {
  audio?: AudioMedia;
  visual?: VisualMedia;
  transcript?: string;
  notes?: string;
}

// Base properties shared by every question
export interface BaseQuestion {
  id: string; // Unique question identifier, e.g. "q-p1-001"
  difficulty: QuestionDifficulty;
  topic: string; // e.g. 'Office', 'Business', 'Travel', 'Finance'
  explanation: string; // Detailed pedagogical explanation in Vietnamese
  skillTag: string; // e.g. "Part 1: Hành động người", "Part 2: Wh- Question"
  trapType?: string; // Optional ETS trap code referencing TrapNote
  groupId?: string; // Present for Part 3, 4, 6, 7
  orderInGroup?: number; // 1-based order within its parent QuestionGroup
}

// PART 1: Photographs (4 options A-D, mandatory visual + audio)
export interface Part1Question extends BaseQuestion {
  partNum: 1;
  part: 'Part 1';
  section: 'listening';
  media: {
    visual: VisualMedia;
    audio: AudioMedia;
    transcript?: string;
  };
  question: string; // Prompt text (e.g. "Chọn câu miêu tả đúng nhất cho bức tranh")
  options: [
    QuestionOption<'A'>,
    QuestionOption<'B'>,
    QuestionOption<'C'>,
    QuestionOption<'D'>
  ];
  correctKey: StandardChoiceKey;
}

// PART 2: Question-Response (Strictly 3 options A-C, mandatory audio)
export interface Part2Question extends BaseQuestion {
  partNum: 2;
  part: 'Part 2';
  section: 'listening';
  media: {
    audio: AudioMedia;
    transcript?: string;
  };
  promptScript: string; // Spoken question/statement
  question: string; // Prompt directive (e.g. "Chọn câu phản hồi phù hợp nhất")
  options: [
    QuestionOption<'A'>,
    QuestionOption<'B'>,
    QuestionOption<'C'>
  ];
  correctKey: Part2ChoiceKey;
}

// PART 3: Short Conversations (Belongs to a 3-question group)
export interface Part3Question extends BaseQuestion {
  partNum: 3;
  part: 'Part 3';
  section: 'listening';
  groupId: string; // Required group linkage
  orderInGroup: 1 | 2 | 3;
  question: string;
  options: [
    QuestionOption<'A'>,
    QuestionOption<'B'>,
    QuestionOption<'C'>,
    QuestionOption<'D'>
  ];
  correctKey: StandardChoiceKey;
}

// PART 4: Short Talks (Belongs to a 3-question group)
export interface Part4Question extends BaseQuestion {
  partNum: 4;
  part: 'Part 4';
  section: 'listening';
  groupId: string; // Required group linkage
  orderInGroup: 1 | 2 | 3;
  question: string;
  options: [
    QuestionOption<'A'>,
    QuestionOption<'B'>,
    QuestionOption<'C'>,
    QuestionOption<'D'>
  ];
  correctKey: StandardChoiceKey;
}

// PART 5: Incomplete Sentences (Single standalone questions)
export interface Part5Question extends BaseQuestion {
  partNum: 5;
  part: 'Part 5';
  section: 'reading';
  groupId?: undefined;
  sentence: string; // Sentence with blank (e.g., "The new software is ------ easy to navigate.")
  question?: string;
  grammarCategory?: string; // e.g., 'Verb Tenses', 'Word Form', 'Prepositions'
  options: [
    QuestionOption<'A'>,
    QuestionOption<'B'>,
    QuestionOption<'C'>,
    QuestionOption<'D'>
  ];
  correctKey: StandardChoiceKey;
}

// PART 6: Text Completion (Belongs to a 4-question group)
export interface Part6Question extends BaseQuestion {
  partNum: 6;
  part: 'Part 6';
  section: 'reading';
  groupId: string; // Required group linkage
  orderInGroup: 1 | 2 | 3 | 4;
  blankNumber: number; // Blank identifier in text, e.g., 131, 132, 133, 134
  questionType: 'vocabulary' | 'grammar' | 'sentence_insertion';
  question?: string;
  options: [
    QuestionOption<'A'>,
    QuestionOption<'B'>,
    QuestionOption<'C'>,
    QuestionOption<'D'>
  ];
  correctKey: StandardChoiceKey;
}

// PART 7: Reading Comprehension (Belongs to a single/double/triple passage group)
export type Part7QuestionType =
  | 'main_idea'
  | 'purpose'
  | 'detail'
  | 'inference'
  | 'vocabulary_in_context'
  | 'contextual_interpretation'
  | 'negative_fact'
  | 'sentence_insertion'
  | 'cross_text_synthesis';

export interface Part7Question extends BaseQuestion {
  partNum: 7;
  part: 'Part 7';
  section: 'reading';
  groupId: string; // Required group linkage
  orderInGroup: number; // 1 to 5
  question: string;
  questionType?: Part7QuestionType;
  crossTextReference?: boolean; // True if multi-passage synthesis is required
  options: [
    QuestionOption<'A'>,
    QuestionOption<'B'>,
    QuestionOption<'C'>,
    QuestionOption<'D'>
  ];
  correctKey: StandardChoiceKey;
}

// Discriminated union of all Question types
export type Question =
  | Part1Question
  | Part2Question
  | Part3Question
  | Part4Question
  | Part5Question
  | Part6Question
  | Part7Question;

// QUESTION GROUPS

export interface BaseQuestionGroup {
  id: string; // Unique group identifier, e.g. "grp-p3-001"
  difficulty: QuestionDifficulty;
  topic: string;
  contextIntro?: string; // e.g. "Questions 32-34 refer to the following conversation."
}

export interface GraphicContext {
  type: 'table' | 'schedule' | 'chart' | 'map' | 'form';
  imageUrl?: string;
  illustrationId?: string;
  altText: string;
}

// Part 3 Group: 3 questions per conversation
export interface Part3Group extends BaseQuestionGroup {
  groupType: 'part3_conversation';
  partNum: 3;
  media: {
    audio: AudioMedia;
    graphic?: GraphicContext;
    transcript?: string;
  };
  questionIds: [string, string, string]; // Strictly 3 questions
}

// Part 4 Group: 3 questions per talk
export interface Part4Group extends BaseQuestionGroup {
  groupType: 'part4_talk';
  partNum: 4;
  media: {
    audio: AudioMedia;
    graphic?: GraphicContext;
    transcript?: string;
  };
  questionIds: [string, string, string]; // Strictly 3 questions
}

// Part 6 Group: 4 questions per passage
export type Part6PassageType =
  | 'email'
  | 'letter'
  | 'memo'
  | 'notice'
  | 'article'
  | 'advertisement'
  | 'instructions';

export interface Part6Group extends BaseQuestionGroup {
  groupType: 'part6_text_completion';
  partNum: 6;
  passageType: Part6PassageType;
  passageTitle?: string;
  passageContent: string; // Markdown/formatted text containing blanks [131], [132]...
  questionIds: [string, string, string, string]; // Strictly 4 questions
}

// Part 7 Group: Reading passages
export type Part7PassageFormat = 'single' | 'double' | 'triple';

export interface ReadingPassageItem {
  id: string;
  formatType?: 'email' | 'letter' | 'memo' | 'article' | 'advertisement' | 'schedule' | 'chat' | 'form' | 'notice';
  title?: string;
  content: string;
}

export interface Part7Group extends BaseQuestionGroup {
  groupType: 'part7_reading_comprehension';
  partNum: 7;
  passageFormat: Part7PassageFormat;
  passages: ReadingPassageItem[]; // 1 for single, 2 for double, 3 for triple
  questionIds: string[]; // 2-4 for single, 5 for double, 5 for triple
}

// Discriminated union of all QuestionGroup types
export type QuestionGroup =
  | Part3Group
  | Part4Group
  | Part6Group
  | Part7Group;

// LEARNER PRACTICE SESSION & RESULT MODELS (Dynamic User State)

export type PracticeSessionMode =
  | 'single_part'
  | 'multi_part'
  | 'mini_diagnostic'
  | 'custom_drill'
  | 'full_simulation';

export type PracticeSessionStatus =
  | 'initialized'
  | 'in_progress'
  | 'paused'
  | 'completed'
  | 'abandoned';

export interface PracticeSessionConfig {
  mode: PracticeSessionMode;
  parts: ToeicPartNumber[];
  questionCount: number;
  timeLimitSeconds?: number;
  shuffleQuestions?: boolean;
  difficultyFilter?: QuestionDifficulty | 'all';
  topicFilter?: string | 'all';
  allowPause?: boolean;
}

export interface PracticeAnswer {
  questionId: string;
  groupId?: string;
  selectedKey: StandardChoiceKey | null;
  isCorrect: boolean | null; // null if pending submission
  timeSpentSeconds: number;
  flaggedForReview: boolean;
  answeredAt?: string; // ISO timestamp
}

export interface PracticeSession {
  id: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  status: PracticeSessionStatus;
  config: PracticeSessionConfig;
  questionIds: string[];
  groupIds: string[];
  currentQuestionIndex: number;
  answers: Record<string, PracticeAnswer>; // questionId -> PracticeAnswer
  elapsedSeconds: number;
}

export interface PartPerformanceStats {
  partNum: ToeicPartNumber;
  totalQuestions: number;
  correctCount: number;
  accuracyRate: number; // percentage 0 - 100
  timeSpentSeconds: number;
  avgTimePerQuestionSeconds: number;
}

export interface PracticeResult {
  sessionId: string;
  completedAt: string;
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  accuracyPercentage: number;
  totalTimeSeconds: number;
  averageTimePerQuestionSeconds: number;
  scaledScoreEstimate?: {
    listeningScaled?: number;
    readingScaled?: number;
    totalScaled?: number;
  };
  byPart: Partial<Record<ToeicPartNumber, PartPerformanceStats>>;
  byDifficulty: Record<QuestionDifficulty, { total: number; correct: number }>;
  identifiedWeaknesses: string[];
  mistakeEntries: Array<{
    questionId: string;
    partNum: ToeicPartNumber;
    yourAnswer: string;
    correctAnswer: string;
    explanation: string;
    skillTag: string;
    trapType?: string;
  }>;
}

// MODULAR QUESTION BANK MANIFEST & REPOSITORY INTERFACE

export interface QuestionBankPartition {
  partNum: ToeicPartNumber;
  version: string;
  updatedAt: string;
  questions: Question[];
  groups: QuestionGroup[];
}

export interface QuestionBankManifest {
  version: string;
  totalQuestions: number;
  totalGroups: number;
  questionCountByPart: Record<ToeicPartNumber, number>;
  groupCountByPart: Record<ToeicPartNumber, number>;
  partitions: Partial<Record<ToeicPartNumber, QuestionBankPartition>>;
}
