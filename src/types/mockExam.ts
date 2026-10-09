/**
 * TOEIC Mastery Hub — Full Mock Exam Foundation & Blueprint Types (Phase 1)
 *
 * Defines domain models and contracts for 200-question full-length mock exams:
 * - Architectural ExamBlueprint matching ETS standard timing (45m L / 75m R = 120m)
 *   and part partition (P1: 6, P2: 25, P3: 39, P4: 30, P5: 30, P6: 16, P7: 54).
 * - Stable ExamForm specifications with schema versioning, content revisions,
 *   sequential numbering (1-200), and lightweight question references.
 * - ExamSession, ExamAnswer, ExamResult, ExamReview, and ExamHistory state models
 *   preserving Offline-First zero-cloud principles without duplicating raw bank data.
 */

import {
  ToeicPartNumber,
  ToeicSection,
  QuestionDifficulty,
  StandardChoiceKey,
  Part7PassageFormat,
  Part7QuestionType,
} from './questionBank';

// ============================================================================
// 1. EXAM BLUEPRINT DOMAIN SPECIFICATION
// ============================================================================

export interface QuestionRange {
  start: number; // 1-based inclusive start index (e.g. 1)
  end: number;   // 1-based inclusive end index (e.g. 6)
}

export interface BasePartBlueprint {
  partNum: ToeicPartNumber;
  partName: string;
  section: ToeicSection;
  questionCount: number;
  questionRange: QuestionRange;
  isGrouped: boolean;
}

export interface StandalonePartBlueprint extends BasePartBlueprint {
  isGrouped: false;
  groupCount: 0;
  questionsPerGroup: 1;
}

export interface FixedGroupPartBlueprint extends BasePartBlueprint {
  isGrouped: true;
  groupCount: number;
  questionsPerGroup: number;
}

export interface Part7Blueprint extends BasePartBlueprint {
  partNum: 7;
  isGrouped: true;
  singlePassages: {
    passageCount: 10;
    questionCount: 29;
    questionsPerPassageRange: { min: 2; max: 4 };
    questionRange: QuestionRange; // 147 to 175
  };
  multiplePassages: {
    groupCount: 5;
    questionCount: 25;
    questionsPerGroup: 5;
    allowedFormats: ['double', 'triple'];
    questionRange: QuestionRange; // 176 to 200
  };
}

export type PartBlueprint =
  | StandalonePartBlueprint
  | FixedGroupPartBlueprint
  | Part7Blueprint;

export interface SectionBlueprint {
  section: ToeicSection;
  totalQuestions: 100;
  durationMinutes: number; // 45 for listening, 75 for reading
  durationSeconds: number; // 2700 for listening, 4500 for reading
  questionRange: QuestionRange; // 1-100 for listening, 101-200 for reading
  parts: Record<ToeicPartNumber, PartBlueprint>;
}

export interface ExamBlueprint {
  id: string; // e.g. 'ets_standard_blueprint'
  name: string;
  version: string; // e.g. '1.0.0'
  totalQuestions: 200;
  totalDurationMinutes: 120;
  totalDurationSeconds: 7200;
  sections: {
    listening: SectionBlueprint;
    reading: SectionBlueprint;
  };
}

// Canonical ETS Standard TOEIC Blueprint Instance
export const ETS_STANDARD_EXAM_BLUEPRINT: ExamBlueprint = {
  id: 'ets_standard_blueprint',
  name: 'ETS TOEIC Listening & Reading Standard Blueprint',
  version: '1.0.0',
  totalQuestions: 200,
  totalDurationMinutes: 120,
  totalDurationSeconds: 7200,
  sections: {
    listening: {
      section: 'listening',
      totalQuestions: 100,
      durationMinutes: 45,
      durationSeconds: 2700,
      questionRange: { start: 1, end: 100 },
      parts: {
        1: {
          partNum: 1,
          partName: 'Part 1: Photographs',
          section: 'listening',
          questionCount: 6,
          questionRange: { start: 1, end: 6 },
          isGrouped: false,
          groupCount: 0,
          questionsPerGroup: 1,
        },
        2: {
          partNum: 2,
          partName: 'Part 2: Question-Response',
          section: 'listening',
          questionCount: 25,
          questionRange: { start: 7, end: 31 },
          isGrouped: false,
          groupCount: 0,
          questionsPerGroup: 1,
        },
        3: {
          partNum: 3,
          partName: 'Part 3: Conversations',
          section: 'listening',
          questionCount: 39,
          questionRange: { start: 32, end: 70 },
          isGrouped: true,
          groupCount: 13,
          questionsPerGroup: 3,
        },
        4: {
          partNum: 4,
          partName: 'Part 4: Short Talks',
          section: 'listening',
          questionCount: 30,
          questionRange: { start: 71, end: 100 },
          isGrouped: true,
          groupCount: 10,
          questionsPerGroup: 3,
        },
        5: {} as StandalonePartBlueprint, // Placeholder to satisfy Record<ToeicPartNumber, PartBlueprint>
        6: {} as FixedGroupPartBlueprint,
        7: {} as Part7Blueprint,
      },
    },
    reading: {
      section: 'reading',
      totalQuestions: 100,
      durationMinutes: 75,
      durationSeconds: 4500,
      questionRange: { start: 101, end: 200 },
      parts: {
        1: {} as StandalonePartBlueprint,
        2: {} as StandalonePartBlueprint,
        3: {} as FixedGroupPartBlueprint,
        4: {} as FixedGroupPartBlueprint,
        5: {
          partNum: 5,
          partName: 'Part 5: Incomplete Sentences',
          section: 'reading',
          questionCount: 30,
          questionRange: { start: 101, end: 130 },
          isGrouped: false,
          groupCount: 0,
          questionsPerGroup: 1,
        },
        6: {
          partNum: 6,
          partName: 'Part 6: Text Completion',
          section: 'reading',
          questionCount: 16,
          questionRange: { start: 131, end: 146 },
          isGrouped: true,
          groupCount: 4,
          questionsPerGroup: 4,
        },
        7: {
          partNum: 7,
          partName: 'Part 7: Reading Comprehension',
          section: 'reading',
          questionCount: 54,
          questionRange: { start: 147, end: 200 },
          isGrouped: true,
          singlePassages: {
            passageCount: 10,
            questionCount: 29,
            questionsPerPassageRange: { min: 2, max: 4 },
            questionRange: { start: 147, end: 175 },
          },
          multiplePassages: {
            groupCount: 5,
            questionCount: 25,
            questionsPerGroup: 5,
            allowedFormats: ['double', 'triple'],
            questionRange: { start: 176, end: 200 },
          },
        },
      },
    },
  },
};

// ============================================================================
// 2. EXAM FORM & LIGHTWEIGHT REFERENCES
// ============================================================================

/**
 * References a specific Question within the exam without duplicating raw content.
 */
export interface ExamQuestionRef {
  /** 1-based global sequence index (1 to 200) */
  globalQuestionNumber: number;
  /** TOEIC Part (1 to 7) */
  partNum: ToeicPartNumber;
  /** Section */
  section: ToeicSection;
  /** Question Bank ID pointer, e.g. 'q-p1-001' */
  questionId: string;
  /** Group pointer if belongs to Part 3, 4, 6, 7 */
  groupId?: string;
  /** 1-based position within group (e.g. 1, 2, 3) */
  orderInGroup?: number;
  /** Expected choices: 3 for Part 2, 4 for others */
  expectedOptionsCount: 3 | 4;
  /** Optional hash of question content for stale revision detection */
  contentHash?: string;
}

/**
 * References a Question Group in the exam.
 */
export interface ExamGroupRef {
  /** Group Bank ID pointer, e.g. 'grp-p3-001' */
  groupId: string;
  /** TOEIC Part (3, 4, 6, 7) */
  partNum: 3 | 4 | 6 | 7;
  /** Starting global question number (inclusive) */
  startQuestionNumber: number;
  /** Ending global question number (inclusive) */
  endQuestionNumber: number;
  /** Ordered list of Question IDs */
  questionIds: string[];
  /** Format for Part 7 (single, double, triple) */
  passageFormat?: Part7PassageFormat;
  /** Group classification */
  groupType:
    | 'part3_conversation'
    | 'part4_talk'
    | 'part6_text_completion'
    | 'part7_reading_comprehension';
}

/**
 * 4-Tier Exam Readiness Status Classification (Phase 9)
 */
export type ExamReadinessStatus =
  | 'invalid'          // Cấu trúc hoặc nội dung sai, không thể khởi tạo bài thi
  | 'content-ready'    // Đủ 200 câu và lời giải nhưng media chưa đạt kiểm định
  | 'simulation-ready' // Đạt chuẩn mô phỏng học tập qua Web Speech API / TTS với cảnh báo minh bạch
  | 'strict-ready';    // Đủ tệp âm thanh phòng thu (prerecorded audio) và timeline 45 phút đã kiểm chứng

/**
 * Lightweight Media References for offline/TTS simulation and strict playback.
 */
export interface ExamMediaRef {
  audioMode: 'tts_simulation' | 'prerecorded_audio' | 'hybrid';
  hasVisuals: boolean;
  illustrationsCount: number;
  readinessStatus?: ExamReadinessStatus;
  strictLocked?: boolean;
  lockReason?: string;
}

export interface MediaReadinessIssue {
  code: string;
  partNum?: ToeicPartNumber;
  questionId?: string;
  groupId?: string;
  severity: 'blocker' | 'warning' | 'info';
  message: string;
  remediation?: string;
}

export interface PartMediaAudit {
  partNum: ToeicPartNumber;
  questionCount: number;
  hasVisuals: boolean;
  visualsVerifiedCount: number;
  audioPromptsCount: number;
  audioScriptsCount: number;
  transcriptsCount: number;
  prerecordedAudioFilesCount: number;
  measuredDurationSeconds?: number;
  estimatedTtsDurationSeconds: number;
  isSimulationReady: boolean;
  isStrictReady: boolean;
  issues: MediaReadinessIssue[];
}

export interface ExamMediaReadinessReport {
  examFormId: string;
  readinessStatus: ExamReadinessStatus;
  isSimulationAllowed: boolean;
  strictLocked: boolean;
  lockReason?: string;
  totalListeningQuestions: number;
  audioAssetsFoundCount: number;
  totalMeasuredDurationSeconds: number;
  totalEstimatedTtsDurationSeconds: number;
  targetListeningDurationSeconds: number; // 2700s (45m)
  timelineDeviationSeconds?: number;
  partsAudit: Record<1 | 2 | 3 | 4, PartMediaAudit>;
  blockers: MediaReadinessIssue[];
  warnings: MediaReadinessIssue[];
}

/**
 * Canonical Exam Form definition.
 * Holds exact ordering and references for a specific 200-question test form.
 */
export interface ExamForm {
  /** Unique stable form identifier, e.g. 'ets-mock-test-01' */
  id: string;
  /** Human-readable title */
  title: string;
  /** Standard test code, e.g. 'ETS-2026-SIM-01' */
  code: string;
  /** Schema specification version */
  schemaVersion: string; // e.g. '1.0.0'
  /** Content revision number (bumped when question links change) */
  contentRevision: number;
  /** ISO timestamp created */
  createdAt: string;
  /** ISO timestamp last modified */
  updatedAt: string;
  /** Blueprint ID adhered to */
  blueprintId: string;
  /** Exactly 200 question references in sequential order (1 to 200) */
  questions: ExamQuestionRef[];
  /** Ordered list of all groups (42 groups total for standard exam) */
  groups: ExamGroupRef[];
  /** Media metadata descriptor */
  media: ExamMediaRef;
  /** Summary statistics of this form */
  metadata: {
    totalQuestions: 200;
    listeningCount: 100;
    readingCount: 100;
    partCounts: Record<ToeicPartNumber, number>;
    groupCounts: Record<ToeicPartNumber, number>;
    contentFingerprint: string; // SHA or combined hash of question IDs in order
  };
}

// ============================================================================
// 3. EXAM SESSION RUNTIME STATE MODELS (Phase 10 State Machine & Engine)
// ============================================================================

export type ExamSessionMode = 'simulation' | 'strict';

/**
 * 9-State Lifecycle State Machine for Full-Length Mock Exams (Phase 10):
 * preflight -> ready -> listening -> reading -> submitted
 * Supplementary recovery/error branches: interrupted, recovery-required, invalid, media-failed
 */
export type ExamSessionLifecycleStatus =
  | 'preflight'          // Session created, undergoing readiness/integrity verification
  | 'ready'              // Preflight passed, candidate may initiate exam
  | 'listening'          // Listening section active (Questions 1-100)
  | 'reading'            // Reading section active (Questions 101-200)
  | 'submitted'          // Completed exam session, answers permanently locked
  | 'interrupted'        // Temporarily paused/disconnected (browser reload, tab hidden)
  | 'recovery-required'  // Revision mismatch, missing question, or storage tampering detected
  | 'invalid'            // Unrecoverable structural defect or corrupted state
  | 'media-failed';      // Audio playback or TTS media pipeline failure

export type ExamSessionStatus = ExamSessionLifecycleStatus;

export type ExamSubmitReason =
  | 'user_completed'
  | 'timeout_reading'
  | 'timeout_overall'
  | 'user_early_submit'
  | 'abandoned'
  | 'system_interrupted';

export interface ExamAnswer {
  globalQuestionNumber: number; // 1 to 200
  questionId: string;
  selectedChoice: StandardChoiceKey | null;
  timeSpentSeconds: number;
  answeredAt?: number; // epoch ms
  isMarkedForReview: boolean;
}

/**
 * Audio playback checkpoint state for session resume and media coordination
 */
export interface ExamPlaybackCheckpoint {
  currentTrackId?: string;
  currentAudioItemIndex?: number;
  playbackPositionMs: number;
  speechRate: number;
  audioState: 'idle' | 'playing' | 'paused' | 'buffering' | 'ended' | 'error';
  loopCount: number;
  lastCheckpointAt?: number;
}

/**
 * Session integrity flags to verify offline data safety and anti-tampering
 */
export interface ExamIntegrityFlags {
  contentFingerprint: string;
  preflightPassed: boolean;
  isTampered: boolean;
  isRevisionMismatch: boolean;
  hasMissingQuestions: boolean;
  isAudioMissing?: boolean;
  tamperReason?: string;
  hasRecoveryWarning?: boolean;
  recoveryReason?: string;
  isClockTampered?: boolean;
  clockDriftSeconds?: number;
  timelineAbnormal?: boolean;
  lastKnownTimestamp?: number;
}

/**
 * Multi-Tab Safety & Storage Ownership Lease (Phase 11)
 */
export type TabLeaseStatus = 'active' | 'read_only_conflict' | 'released';

export interface ExamTabLease {
  sessionId: string;
  tabId: string;
  acquiredAt: number;
  lastHeartbeatAt: number;
  expiresAt: number;
}

export type TabLeaseMessageType =
  | 'CLAIM_LEASE'
  | 'LEASE_ACQUIRED'
  | 'HEARTBEAT'
  | 'TAKEOVER'
  | 'LEASE_REVOKED'
  | 'SESSION_SYNC';

export interface TabLeaseMessage {
  type: TabLeaseMessageType;
  sessionId: string;
  tabId: string;
  timestamp: number;
  payload?: unknown;
}

/**
 * Real-time Wall-Clock Exam Timer Snapshot (Phase 11)
 */
export interface ExamTimerSnapshot {
  sectionRemainingSeconds: number;
  overallRemainingSeconds: number;
  isListeningExpired: boolean;
  isReadingExpired: boolean;
  isExamExpired: boolean;
  isUrgent: boolean; // e.g. <= 300s
  formattedSectionTime: string; // mm:ss
  formattedOverallTime: string; // hh:mm:ss or mm:ss
}

/**
 * State of an ongoing 200-question exam session.
 * Stores only user state, references, and timers (zero raw question copy).
 */
export interface ExamSession {
  sessionId: string; // e.g. 'exam_session_1728456000_abc123'
  examFormId: string;
  schemaVersion: string;
  contentRevision: number;
  mode: ExamSessionMode;
  status: ExamSessionLifecycleStatus;
  currentSection: ToeicSection;
  currentPart: ToeicPartNumber;
  currentQuestionNumber: number; // 1 to 200
  startedAt?: number; // epoch ms
  sectionStartedAt?: number; // epoch ms
  listeningDeadline?: number; // epoch ms
  readingDeadline?: number; // epoch ms
  overallDeadline?: number; // epoch ms
  elapsedSeconds: number;
  listeningElapsedSeconds: number;
  readingElapsedSeconds: number;
  answers: Record<number, ExamAnswer>; // keyed by globalQuestionNumber (1 to 200)
  flaggedQuestions: Record<number, boolean>;
  markedForReview: Record<number, boolean>; // alias for flaggedQuestions
  playbackCheckpoint: ExamPlaybackCheckpoint;
  integrityFlags: ExamIntegrityFlags;
  lastSavedAt: number;
  submittedAt?: number;
  submitReason?: ExamSubmitReason;
}

export interface ExamSessionInitParams {
  examFormId: string;
  mode: ExamSessionMode;
  sessionId?: string;
}

export interface ExamTransitionResult<T = ExamSession> {
  success: boolean;
  session: T;
  error?: string;
  code?: string;
}

export interface ExamStorageOperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  code?:
    | 'STORAGE_UNAVAILABLE'
    | 'QUOTA_EXCEEDED'
    | 'CORRUPTED_JSON'
    | 'INVALID_SESSION'
    | 'UNFINISHED_SESSION_EXISTS'
    | 'REVISION_MISMATCH'
    | 'FORM_NOT_FOUND'
    | 'TAB_CONFLICT'
    | 'WRITE_ERROR';
}

// ============================================================================
// 4. EXAM RESULT & SCORING OUTCOME MODELS (Phase 16)
// ============================================================================

export interface ExamScaledScoreEstimate {
  listeningScaled: number; // 5 to 495
  readingScaled: number;   // 5 to 495
  totalScaled: number;     // 10 to 990
  label: string;           // e.g. 'Ước tính điểm chuẩn ETS 10–990 (Dự báo tham khảo)'
  methodology: string;     // Model explanation
  limitations: string;     // Explicit disclaimer note
}

export interface ExamResultIntegritySummary {
  preflightPassed: boolean;
  isTampered: boolean;
  isRevisionMismatch: boolean;
  isStrictValid: boolean;
  mediaInterrupted: boolean;
  clockDriftSeconds: number;
  isClockTampered: boolean;
  summary: string;
}

export interface ExamPartStat {
  partNum: ToeicPartNumber;
  partName: string;
  section: ToeicSection;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  accuracyRate: number; // 0 - 100 percentage
  timeSpentSeconds: number;
}

export interface ExamResult {
  sessionId: string;
  examFormId: string;
  examCode: string;
  examTitle: string;
  schemaVersion: string;
  contentRevision: number;
  mode: ExamSessionMode;
  completedAt: string; // ISO string
  durationMinutes: number;
  totalTimeSeconds: number;
  listeningTimeSeconds: number;
  readingTimeSeconds: number;
  submitReason: ExamSubmitReason;

  // Raw scores (Must strictly sum to 100 / 100 / 200)
  listeningRaw: number; // 0 to 100
  readingRaw: number;   // 0 to 100
  totalRaw: number;     // 0 to 200

  // Distinct incorrect and unanswered breakdowns
  listeningIncorrect: number;
  listeningUnanswered: number;
  readingIncorrect: number;
  readingUnanswered: number;
  totalIncorrect: number;
  totalUnanswered: number;

  // Accuracy percentages
  listeningAccuracy: number; // 0 - 100%
  readingAccuracy: number;   // 0 - 100%
  accuracyPercentage: number; // total accuracy 0 - 100%

  // Flagged questions audit
  flaggedCount: number;
  flaggedQuestions: number[];

  // Standard ETS scaled scores (estimated with clear disclaimers)
  listeningScaled: number; // 5 to 495
  readingScaled: number;   // 5 to 495
  totalScaled: number;     // 10 to 990
  levelBand: {
    level: string;
    badgeColor: string;
    description: string;
  };
  scaledScoreEstimate: ExamScaledScoreEstimate;

  // Integrity and strict qualification audit
  integrityStatus: ExamResultIntegritySummary;

  // Detailed breakdown by TOEIC parts 1 through 7
  byPart: Record<ToeicPartNumber, ExamPartStat>;

  // Per-question itemized review record (200 items)
  reviewItems: ExamReviewItem[];

  staleContentWarning: boolean;
}

// ============================================================================
// 5. EXAM REVIEW & HISTORY STORAGE MODELS (Phase 16)
// ============================================================================

export interface ExamReviewItem {
  globalQuestionNumber: number; // 1 to 200
  questionId: string;
  partNum: ToeicPartNumber;
  section: ToeicSection;
  userChoice: StandardChoiceKey | null;
  correctChoice: StandardChoiceKey;
  isCorrect: boolean;
  isUnanswered: boolean;
  isFlagged: boolean;
  explanation?: string;
  skillTag?: string;
  trapType?: string;
  questionType?: Part7QuestionType | string;
  timeSpentSeconds: number;
}

export interface ExamReview {
  sessionId: string;
  examFormId: string;
  items: ExamReviewItem[];
}

export interface ExamHistoryEntry {
  id: string; // Unique log ID, e.g. 'hist_exam_session_...'
  sessionId: string;
  examFormId: string;
  examCode: string;
  examTitle: string;
  date: string; // YYYY-MM-DD
  completedAt: string; // ISO
  mode: ExamSessionMode;
  schemaVersion: string;
  contentRevision: number;

  // Raw scores
  totalRaw: number;     // 0 to 200
  listeningRaw: number; // 0 to 100
  readingRaw: number;   // 0 to 100
  totalIncorrect: number;
  totalUnanswered: number;
  accuracyPercentage: number;

  // Scaled scores (estimated)
  totalScore: number;     // 10 to 990
  listeningScore: number; // 5 to 495
  readingScore: number;   // 5 to 495
  scaledScoreEstimate?: {
    label: string;
    methodology: string;
    limitations: string;
  };

  durationMinutes: number;
  totalTimeSeconds: number;
  submitReason: ExamSubmitReason;
  flaggedCount: number;

  integrityStatus: {
    isStrictValid: boolean;
    isTampered: boolean;
    mediaInterrupted?: boolean;
    summary: string;
  };

  byPartSummary: Record<ToeicPartNumber, {
    correct: number;
    total: number;
    accuracy: number;
  }>;
}

export interface ExamHistory {
  version: string;
  entries: ExamHistoryEntry[];
}

export interface ExamFinalizeOutcome {
  success: boolean;
  alreadyFinalized?: boolean;
  result?: ExamResult;
  historyEntry?: ExamHistoryEntry;
  session?: ExamSession;
  error?: string;
  code?:
    | 'ALREADY_SUBMITTED'
    | 'SUBMISSION_IN_PROGRESS'
    | 'SESSION_NOT_FOUND'
    | 'STORAGE_FAILURE'
    | 'VALIDATION_FAILED'
    | 'FORM_NOT_FOUND';
}
