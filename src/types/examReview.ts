/**
 * TOEIC Mastery Hub — Exam Results & Answer Review Domain Types (Phase 17)
 *
 * Defines contracts and filters for:
 * - Result Dashboard metrics and strengths/weaknesses analysis
 * - 200-Question frozen answer review and quick jump filtering
 * - Multi-attempt history comparison with test-retest practice effect advisories
 */

import { ToeicPartNumber, ToeicSection } from './questionBank';
import { ExamResult, ExamReviewItem, ExamHistoryEntry, ExamSessionMode } from './mockExam';

export type ExamReviewStatusFilter =
  | 'all'
  | 'correct'
  | 'incorrect'
  | 'unanswered'
  | 'flagged';

export type ExamReviewPartFilter = 'all' | ToeicPartNumber;

export interface ExamTopicPerformance {
  topic: string;
  partNum: ToeicPartNumber;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  accuracyRate: number; // 0 - 100 percentage
}

export interface ExamPartPerformanceCategory {
  partNum: ToeicPartNumber;
  partName: string;
  section: ToeicSection;
  accuracyRate: number;
  correctCount: number;
  totalQuestions: number;
  detail: string;
}

export interface ExamStrengthWeaknessAnalysis {
  strengths: ExamPartPerformanceCategory[];
  moderate: ExamPartPerformanceCategory[];
  weaknesses: ExamPartPerformanceCategory[];
  topicsToImprove: ExamTopicPerformance[];
  trapTypesEncountered: {
    trapType: string;
    missCount: number;
  }[];
}

export interface ExamAttemptComparison {
  currentSessionId: string;
  previousSessionId: string;
  attemptIndex: number;
  previousAttemptIndex: number;
  currentDate: string;
  previousDate: string;
  currentMode: ExamSessionMode;
  previousMode: ExamSessionMode;
  deltaTotalRaw: number;
  deltaListeningRaw: number;
  deltaReadingRaw: number;
  deltaTotalScaled: number;
  deltaAccuracy: number;
  deltaDurationMinutes: number;
  cautiousAdvisoryNote: string;
}

export type ExamResultWorkspaceTab = 'dashboard' | 'review';

export interface ExamResultWorkspaceProps {
  result: ExamResult;
  onExit: () => void;
  onRetakeExam?: (formId: string) => void;
  initialTab?: ExamResultWorkspaceTab;
}
