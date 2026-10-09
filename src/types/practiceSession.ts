/**
 * TOEIC Mastery Hub — Practice Session Domain Types & State Models (Phase 5)
 *
 * Defines the state machine, configuration, answers, assistance tracking,
 * timer bounds, and persistence contracts for practice sessions.
 */

import { ToeicPartNumber, QuestionDifficulty, StandardChoiceKey } from './questionBank';

export type PracticeMode = 'practice' | 'timed';

export type ActiveSessionStatus = 'active' | 'submitted' | 'expired' | 'abandoned';
export type PracticeStatus = ActiveSessionStatus;

export type PracticeSubmitReason = 'user' | 'auto_timeout' | 'abandoned';

export type PracticeAssistanceType = 'answer' | 'script' | 'explanation';

/**
 * Tracks hints, scripts, or answer keys revealed prior to submission
 * to differentiate unassisted vs assisted performance in scoring (Phase 9).
 */
export interface QuestionAssistanceRecord {
  viewedAnswer?: boolean;
  viewedScript?: boolean;
  viewedExplanation?: boolean;
  firstViewedAt?: number; // epoch ms
  viewCount: number;
}

/**
 * Metadata recorded during session execution for review, audit, and scoring
 */
export interface PracticeSessionMetadata {
  /** Map of questionId -> assistance tracking */
  assistedQuestions: Record<string, QuestionAssistanceRecord>;
  /** Reason session was completed */
  submitReason?: PracticeSubmitReason;
  /** Epoch timestamp ms when submitted */
  submittedAt?: number;
  /** Count of recycled questions from bank exhaustion (Phase 4) */
  reusedCount: number;
  /** Whether question bank was exhausted during selection (Phase 4) */
  isBankExhausted: boolean;
  /** App schema version */
  appVersion: string;
}

/**
 * Core Practice Session State Model
 */
export interface PracticeSessionData {
  /** Unique session identifier: session_${timestamp}_${random} */
  sessionId: string;
  /** TOEIC Part 1 to 7 */
  part: ToeicPartNumber;
  /** Filtered difficulty */
  difficulty: QuestionDifficulty | 'mixed';
  /** Mode: untimed practice vs timed exam */
  mode: PracticeMode;
  /** Total allowed duration in seconds for timed mode, undefined for untimed */
  durationSeconds?: number;
  /** Fixed ordered list of Question IDs */
  questionIds: string[];
  /** Fixed ordered list of Group IDs */
  groupIds: string[];
  /** Current user answers: questionId -> choice ('A' | 'B' | 'C' | 'D' | null) */
  answers: Record<string, StandardChoiceKey | null>;
  /** Marked for review flags: questionId -> boolean */
  markedForReview: Record<string, boolean>;
  /** Active question pointer index (0 to questionIds.length - 1) */
  currentQuestionIndex: number;
  /** Epoch timestamp ms when session was initialized and started */
  startedAt: number;
  /** Wall-clock deadline epoch timestamp ms (for timed mode) */
  deadline?: number;
  /** Total elapsed seconds spent in session */
  elapsedSeconds: number;
  /** Current state machine lifecycle status */
  status: ActiveSessionStatus;
  /** Configuration flags */
  allowAudioReplay?: boolean;
  enableHints?: boolean;
  /** Review and persistence metadata */
  metadata: PracticeSessionMetadata;
}

/**
 * Payload for launching a new session from Phase 4 selection output
 */
export interface PracticeSessionInitParams {
  part: ToeicPartNumber;
  difficulty: QuestionDifficulty | 'mixed';
  mode: PracticeMode;
  durationSeconds?: number;
  allowAudioReplay?: boolean;
  enableHints?: boolean;
  questionIds: string[];
  groupIds: string[];
  reusedCount?: number;
  isBankExhausted?: boolean;
}

/**
 * Verification result for validating session integrity on resume / reload
 */
export interface SessionValidationResult {
  isValid: boolean;
  error?: string;
  cleanedSession?: PracticeSessionData;
}

/**
 * Storage operation results with explicit failure explanations
 */
export interface StorageOperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  code?: 'QUOTA_EXCEEDED' | 'CORRUPTED_JSON' | 'INVALID_SESSION' | 'UNFINISHED_SESSION_EXISTS' | 'STORAGE_UNAVAILABLE';
}

/**
 * Archived summary of completed session for history / review (Phase 9/10)
 */
export interface ArchivedPracticeSession {
  sessionId: string;
  part: ToeicPartNumber;
  difficulty: QuestionDifficulty | 'mixed';
  mode: PracticeMode;
  questionCount: number;
  answeredCount: number;
  startedAt: number;
  completedAt: number;
  status: ActiveSessionStatus;
  submitReason?: PracticeSubmitReason;
  durationSeconds?: number;
  elapsedSeconds: number;
  sessionData: PracticeSessionData;
}
