/**
 * TOEIC Mastery Hub — Exam Workspace & Answer Sheet Types (Phase 14)
 *
 * Domain models and contracts for the Full Mock Exam Workspace:
 * - 200-Question Unified Answer Sheet partitioning & cell states
 * - Listening Part 1-4 rendering contracts and concealment rules
 * - Audio synchronization, navigation scope, and keyboard shortcut handling
 * - Submission audit and multi-tab conflict safety indicators
 */

import {
  ToeicPartNumber,
  ToeicSection,
  StandardChoiceKey,
  Question,
  Part1Question,
  Part2Question,
  Part3Question,
  Part4Question,
  Part5Question,
  Part6Question,
  Part7Question,
  Part3Group,
  Part4Group,
  Part6Group,
  Part7Group,
} from './questionBank';
import {
  ExamForm,
  ExamSession,
  ExamSessionMode,
  ExamAnswer,
  TabLeaseStatus,
} from './mockExam';
import { ExamAudioEngineState } from './examAudio';

/**
 * Filter mode for the 200-question answer sheet
 */
export type AnswerSheetFilterMode = 'all' | 'unanswered' | 'flagged';

/**
 * State of a single question cell in the 200-question answer sheet
 */
export type AnswerSheetCellStatus =
  | 'current'       // Currently active/focused in the question renderer
  | 'answered'      // Answer choice selected (A, B, C, or D)
  | 'unanswered'    // No choice selected
  | 'flagged'       // Marked for review
  | 'locked';       // Inaccessible due to strict section/audio constraints

/**
 * Metadata for rendering a cell in the 200-question matrix
 */
export interface ExamAnswerSheetCellData {
  globalQuestionNumber: number; // 1 to 200
  questionId: string;
  part: ToeicPartNumber;
  section: ToeicSection;
  selectedChoice: StandardChoiceKey | null;
  isMarkedForReview: boolean;
  isCurrent: boolean;
  isAccessible: boolean;
  inCurrentAudioScope: boolean;
}

/**
 * Workspace active view mode
 */
export type ExamWorkspaceViewMode =
  | 'listening'       // Active Listening Section (Questions 1-100)
  | 'reading'         // Active Reading Section (Questions 101-200, Part 5-7 renderers)
  | 'reading_hold'    // Legacy section bridge
  | 'submitted';      // Exam submitted, locked state

/**
 * Part grouping metadata for Answer Sheet presentation
 */
export interface AnswerSheetPartMeta {
  partNum: ToeicPartNumber;
  partName: string;
  section: ToeicSection;
  startQuestionNumber: number;
  endQuestionNumber: number;
  totalQuestions: number;
}

export const EXAM_ANSWER_SHEET_PARTS: AnswerSheetPartMeta[] = [
  { partNum: 1, partName: 'Part 1: Photographs', section: 'listening', startQuestionNumber: 1, endQuestionNumber: 6, totalQuestions: 6 },
  { partNum: 2, partName: 'Part 2: Question-Response', section: 'listening', startQuestionNumber: 7, endQuestionNumber: 31, totalQuestions: 25 },
  { partNum: 3, partName: 'Part 3: Conversations', section: 'listening', startQuestionNumber: 32, endQuestionNumber: 70, totalQuestions: 39 },
  { partNum: 4, partName: 'Part 4: Short Talks', section: 'listening', startQuestionNumber: 71, endQuestionNumber: 100, totalQuestions: 30 },
  { partNum: 5, partName: 'Part 5: Incomplete Sentences', section: 'reading', startQuestionNumber: 101, endQuestionNumber: 130, totalQuestions: 30 },
  { partNum: 6, partName: 'Part 6: Text Completion', section: 'reading', startQuestionNumber: 131, endQuestionNumber: 146, totalQuestions: 16 },
  { partNum: 7, partName: 'Part 7: Reading Comprehension', section: 'reading', startQuestionNumber: 147, endQuestionNumber: 200, totalQuestions: 54 },
];

/**
 * Props for Exam Workspace Header
 */
export interface ExamWorkspaceHeaderProps {
  examForm: ExamForm;
  session: ExamSession;
  currentPart: ToeicPartNumber;
  formattedSectionTime: string;
  formattedOverallTime: string;
  isUrgent: boolean;
  tabLeaseStatus: TabLeaseStatus;
  isConflict: boolean;
  onTakeoverLease: () => void;
  onOpenSubmitModal: () => void;
  onExitWorkspace: () => void;
  isAnswerSheetOpen: boolean;
  onToggleAnswerSheet: () => void;
  answeredCount: number;
  flaggedCount: number;
}

/**
 * Props for Audio Playback Control Bar
 */
export interface ExamAudioBarProps {
  audioState: ExamAudioEngineState;
  onStartPlayback: () => Promise<void>;
  onPausePlayback: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

/**
 * Props for the 200-question Answer Sheet Matrix
 */
export interface ExamAnswerSheetProps {
  session: ExamSession;
  currentQuestionNumber: number;
  onSelectQuestion: (questionNumber: number) => void;
  isOpen: boolean;
  onClose: () => void;
  currentAudioStartQuestion?: number;
  currentAudioEndQuestion?: number;
}

/**
 * Props for Part 1 Renderer
 */
export interface ExamPart1RendererProps {
  question: Part1Question;
  globalQuestionNumber: number;
  answer: ExamAnswer;
  onSelectChoice: (choice: StandardChoiceKey) => void;
  onToggleFlag: () => void;
  isLocked: boolean;
}

/**
 * Props for Part 2 Renderer
 */
export interface ExamPart2RendererProps {
  question: Part2Question;
  globalQuestionNumber: number;
  answer: ExamAnswer;
  onSelectChoice: (choice: StandardChoiceKey) => void;
  onToggleFlag: () => void;
  isLocked: boolean;
}

/**
 * Props for Part 3 Renderer
 */
export interface ExamPart3RendererProps {
  group: Part3Group;
  questions: Part3Question[];
  activeQuestionNumber: number;
  answers: Record<number, ExamAnswer>;
  onSelectChoice: (questionNumber: number, choice: StandardChoiceKey) => void;
  onToggleFlag: (questionNumber: number) => void;
  onFocusQuestion: (questionNumber: number) => void;
  isLocked: boolean;
}

/**
 * Props for Part 4 Renderer
 */
export interface ExamPart4RendererProps {
  group: Part4Group;
  questions: Part4Question[];
  activeQuestionNumber: number;
  answers: Record<number, ExamAnswer>;
  onSelectChoice: (questionNumber: number, choice: StandardChoiceKey) => void;
  onToggleFlag: (questionNumber: number) => void;
  onFocusQuestion: (questionNumber: number) => void;
  isLocked: boolean;
}

/**
 * Props for Submit Audit Modal
 */
export interface ExamSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  session: ExamSession;
  answeredCount: number;
  unansweredCount: number;
  flaggedCount: number;
}

/**
 * Props for Part 5 Incomplete Sentences Renderer
 */
export interface ExamPart5RendererProps {
  question: Part5Question;
  globalQuestionNumber: number;
  answer?: ExamAnswer;
  isFlagged: boolean;
  onSelectChoice: (choice: StandardChoiceKey) => void;
  onToggleFlag: () => void;
  isLocked: boolean;
}

/**
 * Props for Part 6 Text Completion Renderer
 */
export interface ExamPart6RendererProps {
  group: Part6Group;
  questions: Part6Question[];
  activeQuestionNumber: number;
  answers: Record<number, ExamAnswer>;
  flaggedQuestions: Record<number, boolean>;
  onSelectChoice: (questionNumber: number, choice: StandardChoiceKey) => void;
  onToggleFlag: (questionNumber: number) => void;
  onFocusQuestion: (questionNumber: number) => void;
  isLocked: boolean;
}

/**
 * Props for Part 7 Reading Comprehension Renderer
 */
export interface ExamPart7RendererProps {
  group: Part7Group;
  questions: Part7Question[];
  activeQuestionNumber: number;
  answers: Record<number, ExamAnswer>;
  flaggedQuestions: Record<number, boolean>;
  onSelectChoice: (questionNumber: number, choice: StandardChoiceKey) => void;
  onToggleFlag: (questionNumber: number) => void;
  onFocusQuestion: (questionNumber: number) => void;
  isLocked: boolean;
}

