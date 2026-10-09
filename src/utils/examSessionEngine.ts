/**
 * TOEIC Mastery Hub — Exam Session State Machine Engine (Phase 10)
 *
 * Implements pure state machine lifecycles and business transition rules:
 * - 9-State Lifecycle: preflight -> ready -> listening -> reading -> submitted
 *   with branches: interrupted, recovery-required, invalid, media-failed.
 * - Strict vs Simulation mode policy enforcement:
 *   * Strict mode locks listening section once reading begins (no back-navigation).
 *   * Strict mode locks answers to listening questions during reading.
 *   * Double-start prevention & idempotent session lifecycle guards.
 *   * Stale callback protection: answers and checkpoints immutable after submission.
 *   * Preflight verification against ExamForm readiness and structural blueprint.
 * - Decoupled from React components and external side-effects.
 */

import {
  ExamSession,
  ExamSessionInitParams,
  ExamSessionMode,
  ExamSubmitReason,
  ExamAnswer,
  ExamPlaybackCheckpoint,
  ExamIntegrityFlags,
  ExamTransitionResult,
  ExamForm,
} from '../types/mockExam';
import { ToeicPartNumber, ToeicSection, StandardChoiceKey } from '../types/questionBank';

export const SESSION_SCHEMA_VERSION = '1.0.0';
export const ETS_LISTENING_DURATION_SECONDS = 2700; // 45 minutes
export const ETS_READING_DURATION_SECONDS = 4500;   // 75 minutes
export const ETS_OVERALL_DURATION_SECONDS = 7200;   // 120 minutes

/**
 * Resolves the TOEIC Part number from global question index (1 to 200).
 */
export function getPartForQuestionNumber(questionNumber: number): ToeicPartNumber {
  if (questionNumber >= 1 && questionNumber <= 6) return 1;
  if (questionNumber >= 7 && questionNumber <= 31) return 2;
  if (questionNumber >= 32 && questionNumber <= 70) return 3;
  if (questionNumber >= 71 && questionNumber <= 100) return 4;
  if (questionNumber >= 101 && questionNumber <= 130) return 5;
  if (questionNumber >= 131 && questionNumber <= 146) return 6;
  if (questionNumber >= 147 && questionNumber <= 200) return 7;
  throw new Error(`Invalid globalQuestionNumber: ${questionNumber}. Expected 1 to 200.`);
}

/**
 * Resolves the TOEIC Section from global question index (1 to 200).
 */
export function getSectionForQuestionNumber(questionNumber: number): ToeicSection {
  if (questionNumber >= 1 && questionNumber <= 100) return 'listening';
  if (questionNumber >= 101 && questionNumber <= 200) return 'reading';
  throw new Error(`Invalid globalQuestionNumber: ${questionNumber}. Expected 1 to 200.`);
}

/**
 * Generates a unique collision-resistant session identifier.
 */
export function generateExamSessionId(): string {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `exam_session_${timestamp}_${randomPart}`;
}

/**
 * Creates a brand new ExamSession in 'preflight' state.
 *
 * Initializes 200 answer slots, flags, and checkpoint metadata without
 * duplicating question stimuli, passages, or raw question bank objects.
 */
export function createExamSession(
  params: ExamSessionInitParams,
  examForm: ExamForm,
  options?: { now?: number; idGenerator?: () => string }
): ExamSession {
  if (!examForm || !examForm.questions || examForm.questions.length !== 200) {
    throw new Error(
      `Cannot initialize exam session: ExamForm must have exactly 200 questions. Received ${examForm?.questions?.length ?? 0}.`
    );
  }

  const now = options?.now ?? Date.now();
  const sessionId = params.sessionId ?? (options?.idGenerator ? options.idGenerator() : generateExamSessionId());

  // Initialize answer map and flags for exactly 200 questions
  const answers: Record<number, ExamAnswer> = {};
  const flaggedQuestions: Record<number, boolean> = {};

  for (const qRef of examForm.questions) {
    const qNum = qRef.globalQuestionNumber;
    answers[qNum] = {
      globalQuestionNumber: qNum,
      questionId: qRef.questionId,
      selectedChoice: null,
      timeSpentSeconds: 0,
      isMarkedForReview: false,
    };
    flaggedQuestions[qNum] = false;
  }

  const initialCheckpoint: ExamPlaybackCheckpoint = {
    playbackPositionMs: 0,
    speechRate: 1.0,
    audioState: 'idle',
    loopCount: 0,
  };

  const initialIntegrity: ExamIntegrityFlags = {
    contentFingerprint: examForm.metadata?.contentFingerprint || '',
    preflightPassed: false,
    isTampered: false,
    isRevisionMismatch: false,
    hasMissingQuestions: false,
  };

  return {
    sessionId,
    examFormId: examForm.id,
    schemaVersion: SESSION_SCHEMA_VERSION,
    contentRevision: examForm.contentRevision,
    mode: params.mode,
    status: 'preflight',
    currentSection: 'listening',
    currentPart: 1,
    currentQuestionNumber: 1,
    elapsedSeconds: 0,
    listeningElapsedSeconds: 0,
    readingElapsedSeconds: 0,
    answers,
    flaggedQuestions,
    markedForReview: { ...flaggedQuestions },
    playbackCheckpoint: initialCheckpoint,
    integrityFlags: initialIntegrity,
    lastSavedAt: now,
  };
}

/**
 * Executes the preflight validation check on an ExamSession.
 *
 * Verifies ExamForm structure, content revision, fingerprint integrity,
 * and media readiness constraints (e.g. Strict mode lock when prerecorded audio is missing).
 *
 * Transitions:
 * - 'preflight' | 'invalid' | 'media-failed' -> 'ready' (on success)
 * - 'preflight' -> 'invalid' (on structural/blueprint defect)
 * - 'preflight' -> 'media-failed' (when strict mode is requested but strict is locked)
 */
export function executePreflightCheck(
  session: ExamSession,
  examForm: ExamForm
): ExamTransitionResult {
  // Check form ID match
  if (session.examFormId !== examForm.id) {
    const updated: ExamSession = {
      ...session,
      status: 'invalid',
      integrityFlags: {
        ...session.integrityFlags,
        isTampered: true,
        tamperReason: `Session form ID "${session.examFormId}" does not match provided form ID "${examForm.id}".`,
      },
    };
    return {
      success: false,
      session: updated,
      code: 'FORM_ID_MISMATCH',
      error: updated.integrityFlags.tamperReason,
    };
  }

  // Check content revision match
  if (session.contentRevision !== examForm.contentRevision) {
    const updated: ExamSession = {
      ...session,
      status: 'recovery-required',
      integrityFlags: {
        ...session.integrityFlags,
        isRevisionMismatch: true,
        tamperReason: `Form content revision changed (session: ${session.contentRevision}, active form: ${examForm.contentRevision}).`,
      },
    };
    return {
      success: false,
      session: updated,
      code: 'REVISION_MISMATCH',
      error: updated.integrityFlags.tamperReason,
    };
  }

  // Check 200 questions completeness
  if (!examForm.questions || examForm.questions.length !== 200) {
    const updated: ExamSession = {
      ...session,
      status: 'invalid',
      integrityFlags: {
        ...session.integrityFlags,
        hasMissingQuestions: true,
        tamperReason: `ExamForm has ${examForm.questions?.length ?? 0} questions, expected 200.`,
      },
    };
    return {
      success: false,
      session: updated,
      code: 'INCOMPLETE_EXAM_FORM',
      error: updated.integrityFlags.tamperReason,
    };
  }

  // Check content fingerprint match
  if (
    examForm.metadata?.contentFingerprint &&
    session.integrityFlags.contentFingerprint &&
    session.integrityFlags.contentFingerprint !== examForm.metadata.contentFingerprint
  ) {
    const updated: ExamSession = {
      ...session,
      status: 'recovery-required',
      integrityFlags: {
        ...session.integrityFlags,
        isTampered: true,
        tamperReason: 'Content fingerprint mismatch indicates ExamForm content has been modified.',
      },
    };
    return {
      success: false,
      session: updated,
      code: 'FINGERPRINT_MISMATCH',
      error: updated.integrityFlags.tamperReason,
    };
  }

  // Readiness status check
  const readiness = examForm.media?.readinessStatus;
  if (readiness === 'invalid') {
    const updated: ExamSession = {
      ...session,
      status: 'invalid',
      integrityFlags: {
        ...session.integrityFlags,
        preflightPassed: false,
        tamperReason: 'ExamForm readiness status is marked as invalid.',
      },
    };
    return {
      success: false,
      session: updated,
      code: 'READINESS_INVALID',
      error: updated.integrityFlags.tamperReason,
    };
  }

  // Strict mode lock check (Phase 9 transparency rule)
  if (session.mode === 'strict' && examForm.media?.strictLocked) {
    const reason =
      examForm.media.lockReason ||
      'Strict Mock Mode is locked: Studio audio assets are not yet integrated.';
    const updated: ExamSession = {
      ...session,
      status: 'media-failed',
      integrityFlags: {
        ...session.integrityFlags,
        preflightPassed: false,
        isAudioMissing: true,
        tamperReason: reason,
      },
    };
    return {
      success: false,
      session: updated,
      code: 'STRICT_MODE_LOCKED',
      error: reason,
    };
  }

  // Simulation mode check: requires at least 'simulation-ready' or 'strict-ready'
  if (session.mode === 'simulation' && readiness === 'content-ready') {
    // Content-ready has questions and answers but lacks audio scripts / simulation readiness
    const reason = 'ExamForm is only content-ready and lacks audio simulation assets for mock execution.';
    const updated: ExamSession = {
      ...session,
      status: 'media-failed',
      integrityFlags: {
        ...session.integrityFlags,
        preflightPassed: false,
        tamperReason: reason,
      },
    };
    return {
      success: false,
      session: updated,
      code: 'SIMULATION_NOT_READY',
      error: reason,
    };
  }

  // Preflight passed! Transition to 'ready'
  const updated: ExamSession = {
    ...session,
    status: 'ready',
    integrityFlags: {
      ...session.integrityFlags,
      preflightPassed: true,
      tamperReason: undefined,
    },
  };

  return {
    success: true,
    session: updated,
  };
}

/**
 * Starts the exam session, transitioning from 'ready' to 'listening'.
 *
 * Rules:
 * - Rejects double-start if already in 'listening', 'reading', or 'submitted'.
 * - Rejects starting un-preflighted sessions ('preflight', 'invalid', 'media-failed').
 * - Calculates wall-clock listening and overall deadlines.
 */
export function startExam(
  session: ExamSession,
  options?: { now?: number }
): ExamTransitionResult {
  if (session.status === 'listening' || session.status === 'reading') {
    return {
      success: false,
      session,
      code: 'DOUBLE_START_FORBIDDEN',
      error: `Cannot start exam: Session is already in active '${session.status}' state.`,
    };
  }

  if (session.status === 'submitted') {
    return {
      success: false,
      session,
      code: 'SESSION_ALREADY_SUBMITTED',
      error: 'Cannot start exam: Session has already been submitted.',
    };
  }

  if (session.status === 'preflight') {
    return {
      success: false,
      session,
      code: 'PREFLIGHT_REQUIRED',
      error: 'Cannot start exam: Preflight readiness check has not been completed.',
    };
  }

  if (session.status !== 'ready') {
    return {
      success: false,
      session,
      code: 'INVALID_STATUS',
      error: `Cannot start exam from '${session.status}' state. Must be 'ready'.`,
    };
  }

  const now = options?.now ?? Date.now();
  const listeningDeadline = now + ETS_LISTENING_DURATION_SECONDS * 1000;
  const overallDeadline = now + ETS_OVERALL_DURATION_SECONDS * 1000;

  const updated: ExamSession = {
    ...session,
    status: 'listening',
    currentSection: 'listening',
    currentPart: 1,
    currentQuestionNumber: 1,
    startedAt: now,
    sectionStartedAt: now,
    listeningDeadline,
    overallDeadline,
    playbackCheckpoint: {
      ...session.playbackCheckpoint,
      audioState: 'playing',
      lastCheckpointAt: now,
    },
  };

  return {
    success: true,
    session: updated,
  };
}

/**
 * Transitions the exam session from 'listening' to 'reading'.
 *
 * Rules:
 * - Must be in 'listening' status.
 * - Double transition rejected (cannot transition Listening -> Reading twice).
 * - Finalizes listening section elapsed time.
 * - Sets reading section deadline (75 minutes).
 * - Advances question pointer to Question 101 (Part 5).
 * - Shuts down audio playback.
 */
export function transitionToReading(
  session: ExamSession,
  options?: { now?: number }
): ExamTransitionResult {
  if (session.status === 'reading') {
    return {
      success: false,
      session,
      code: 'ALREADY_IN_READING',
      error: 'Cannot transition: Session is already in the reading section.',
    };
  }

  if (session.status === 'submitted') {
    return {
      success: false,
      session,
      code: 'SESSION_ALREADY_SUBMITTED',
      error: 'Cannot transition: Session is already submitted.',
    };
  }

  if (session.status !== 'listening') {
    return {
      success: false,
      session,
      code: 'INVALID_TRANSITION',
      error: `Cannot transition to reading from '${session.status}' state. Expected 'listening'.`,
    };
  }

  const now = options?.now ?? Date.now();
  const sectionStart = session.sectionStartedAt ?? session.startedAt ?? now;
  const listeningElapsed = Math.max(
    session.listeningElapsedSeconds,
    Math.round((now - sectionStart) / 1000)
  );
  const readingDeadline = now + ETS_READING_DURATION_SECONDS * 1000;

  const updated: ExamSession = {
    ...session,
    status: 'reading',
    currentSection: 'reading',
    currentPart: 5,
    currentQuestionNumber: 101,
    sectionStartedAt: now,
    listeningElapsedSeconds: listeningElapsed,
    elapsedSeconds: listeningElapsed + session.readingElapsedSeconds,
    readingDeadline,
    playbackCheckpoint: {
      ...session.playbackCheckpoint,
      audioState: 'ended',
      lastCheckpointAt: now,
    },
  };

  return {
    success: true,
    session: updated,
  };
}

/**
 * Submits the exam session, transitioning to 'submitted'.
 *
 * Rules:
 * - Irrevocable: Answers and flags are permanently locked.
 * - Cannot submit a session that has not started ('preflight' or 'ready').
 * - Idempotent protection: Rejects submitting already submitted session.
 */
export function submitExam(
  session: ExamSession,
  reason: ExamSubmitReason = 'user_completed',
  options?: { now?: number }
): ExamTransitionResult {
  if (session.status === 'submitted') {
    return {
      success: false,
      session,
      code: 'ALREADY_SUBMITTED',
      error: 'Cannot submit: Session has already been submitted.',
    };
  }

  if (session.status === 'preflight' || session.status === 'ready') {
    return {
      success: false,
      session,
      code: 'SESSION_NOT_STARTED',
      error: 'Cannot submit an exam session that has not been started.',
    };
  }

  const now = options?.now ?? Date.now();
  let listeningElapsed = session.listeningElapsedSeconds;
  let readingElapsed = session.readingElapsedSeconds;

  if (session.status === 'listening') {
    const sectionStart = session.sectionStartedAt ?? session.startedAt ?? now;
    listeningElapsed = Math.max(listeningElapsed, Math.round((now - sectionStart) / 1000));
  } else if (session.status === 'reading') {
    const sectionStart = session.sectionStartedAt ?? now;
    readingElapsed = Math.max(readingElapsed, Math.round((now - sectionStart) / 1000));
  }

  const updated: ExamSession = {
    ...session,
    status: 'submitted',
    submittedAt: now,
    submitReason: reason,
    listeningElapsedSeconds: listeningElapsed,
    readingElapsedSeconds: readingElapsed,
    elapsedSeconds: listeningElapsed + readingElapsed,
    playbackCheckpoint: {
      ...session.playbackCheckpoint,
      audioState: 'ended',
      lastCheckpointAt: now,
    },
  };

  return {
    success: true,
    session: updated,
  };
}

/**
 * Records or updates a candidate's answer for a specific question (1 to 200).
 *
 * Rules:
 * - Immutably updates answers map without mutating original session.
 * - Stale callback & post-submit lock: Rejects answer changes once 'submitted'.
 * - Strict mode lock:
 *   * When in 'reading' section, candidate CANNOT modify listening questions (1-100).
 *   * When in 'listening' section, candidate CANNOT answer reading questions (101-200).
 * - Choice validation: Part 2 (questions 7-31) strictly permits only 'A', 'B', 'C'.
 */
export function recordExamAnswer(
  session: ExamSession,
  questionNumber: number,
  choice: StandardChoiceKey | null,
  timeSpentIncrementSeconds = 0,
  options?: { now?: number }
): ExamTransitionResult {
  if (session.status === 'submitted') {
    return {
      success: false,
      session,
      code: 'ANSWERS_LOCKED',
      error: 'Cannot modify answers: Exam session is submitted and locked.',
    };
  }

  if (session.status !== 'listening' && session.status !== 'reading') {
    return {
      success: false,
      session,
      code: 'SESSION_NOT_ACTIVE',
      error: `Cannot record answer: Session is in '${session.status}' state (must be active).`,
    };
  }

  if (questionNumber < 1 || questionNumber > 200) {
    return {
      success: false,
      session,
      code: 'INVALID_QUESTION_NUMBER',
      error: `Question number ${questionNumber} is out of bounds (expected 1 to 200).`,
    };
  }

  // Strict mode cross-section boundary rules
  if (session.mode === 'strict') {
    if (session.status === 'reading' && questionNumber <= 100) {
      return {
        success: false,
        session,
        code: 'STRICT_SECTION_LOCKED',
        error: 'Strict mode forbids modifying listening section answers during the reading section.',
      };
    }
    if (session.status === 'listening' && questionNumber > 100) {
      return {
        success: false,
        session,
        code: 'STRICT_SECTION_LOCKED',
        error: 'Strict mode forbids answering reading section questions during the listening section.',
      };
    }
  }

  // Part 2 option validation (A, B, C only)
  if (questionNumber >= 7 && questionNumber <= 31 && choice === 'D') {
    return {
      success: false,
      session,
      code: 'INVALID_CHOICE_FOR_PART',
      error: `Part 2 (Question ${questionNumber}) only provides choices A, B, or C. Choice 'D' is invalid.`,
    };
  }

  const now = options?.now ?? Date.now();
  const currentAnswer = session.answers[questionNumber];
  const updatedAnswer: ExamAnswer = {
    ...currentAnswer,
    globalQuestionNumber: questionNumber,
    questionId: currentAnswer?.questionId ?? `q-${questionNumber}`,
    selectedChoice: choice,
    answeredAt: choice !== null ? now : undefined,
    timeSpentSeconds: (currentAnswer?.timeSpentSeconds ?? 0) + Math.max(0, timeSpentIncrementSeconds),
    isMarkedForReview: currentAnswer?.isMarkedForReview ?? false,
  };

  const updated: ExamSession = {
    ...session,
    answers: {
      ...session.answers,
      [questionNumber]: updatedAnswer,
    },
  };

  return {
    success: true,
    session: updated,
  };
}

/**
 * Toggles review flag for a specific question (1 to 200).
 *
 * Rules:
 * - Locked after submission.
 * - Strict mode forbids flagging listening questions while in reading.
 */
export function toggleQuestionFlag(
  session: ExamSession,
  questionNumber: number
): ExamTransitionResult {
  if (session.status === 'submitted') {
    return {
      success: false,
      session,
      code: 'FLAGS_LOCKED',
      error: 'Cannot toggle flags: Exam session is submitted and locked.',
    };
  }

  if (questionNumber < 1 || questionNumber > 200) {
    return {
      success: false,
      session,
      code: 'INVALID_QUESTION_NUMBER',
      error: `Question number ${questionNumber} is out of bounds (expected 1 to 200).`,
    };
  }

  if (session.mode === 'strict' && session.status === 'reading' && questionNumber <= 100) {
    return {
      success: false,
      session,
      code: 'STRICT_SECTION_LOCKED',
      error: 'Strict mode forbids modifying flags for listening section during reading.',
    };
  }

  const currentFlag = !!session.flaggedQuestions[questionNumber];
  const nextFlag = !currentFlag;

  const currentAnswer = session.answers[questionNumber];
  const updatedAnswer: ExamAnswer = {
    ...currentAnswer,
    isMarkedForReview: nextFlag,
  };

  const updatedFlags = {
    ...session.flaggedQuestions,
    [questionNumber]: nextFlag,
  };

  const updated: ExamSession = {
    ...session,
    flaggedQuestions: updatedFlags,
    markedForReview: updatedFlags,
    answers: {
      ...session.answers,
      [questionNumber]: updatedAnswer,
    },
  };

  return {
    success: true,
    session: updated,
  };
}

/**
 * Navigates candidate to a target question.
 *
 * Rules:
 * - Strict mode forbids navigating from reading back to listening (Questions 1-100).
 * - Strict mode forbids navigating from listening ahead to reading (Questions 101-200).
 * - Automatically updates currentPart and currentSection.
 */
export function navigateToQuestion(
  session: ExamSession,
  targetQuestionNumber: number
): ExamTransitionResult {
  if (targetQuestionNumber < 1 || targetQuestionNumber > 200) {
    return {
      success: false,
      session,
      code: 'INVALID_QUESTION_NUMBER',
      error: `Target question number ${targetQuestionNumber} is out of bounds (expected 1 to 200).`,
    };
  }

  if (session.mode === 'strict') {
    if (session.status === 'reading' && targetQuestionNumber <= 100) {
      return {
        success: false,
        session,
        code: 'STRICT_NAVIGATION_BLOCKED',
        error: 'Strict mode forbids navigating back to listening questions during reading.',
      };
    }
    if (session.status === 'listening' && targetQuestionNumber > 100) {
      return {
        success: false,
        session,
        code: 'STRICT_NAVIGATION_BLOCKED',
        error: 'Strict mode forbids navigating ahead to reading questions during listening.',
      };
    }
  }

  const part = getPartForQuestionNumber(targetQuestionNumber);
  const section = getSectionForQuestionNumber(targetQuestionNumber);

  const updated: ExamSession = {
    ...session,
    currentQuestionNumber: targetQuestionNumber,
    currentPart: part,
    currentSection: section,
  };

  return {
    success: true,
    session: updated,
  };
}

/**
 * Updates playback checkpoint metadata.
 *
 * Rules:
 * - Rejects checkpoint updates if session is submitted (stale callback guard).
 */
export function updatePlaybackCheckpoint(
  session: ExamSession,
  checkpointUpdate: Partial<ExamPlaybackCheckpoint>
): ExamTransitionResult {
  if (session.status === 'submitted') {
    return {
      success: false,
      session,
      code: 'SESSION_TERMINATED',
      error: 'Cannot update playback checkpoint on submitted session.',
    };
  }

  const updated: ExamSession = {
    ...session,
    playbackCheckpoint: {
      ...session.playbackCheckpoint,
      ...checkpointUpdate,
      lastCheckpointAt: Date.now(),
    },
  };

  return {
    success: true,
    session: updated,
  };
}

/**
 * Evaluates wall-clock deadlines and automatically transitions expired sessions.
 *
 * Critical for handling browser reload (F5), tab freeze, or sleep/wake events:
 * - If listening deadline expired in 'listening', transitions to 'reading'.
 * - If reading deadline or overall deadline expired, submits with appropriate reason.
 */
export function evaluateSessionTimeouts(
  session: ExamSession,
  now = Date.now()
): ExamTransitionResult {
  if (session.status === 'submitted') {
    return { success: true, session };
  }

  // Check overall deadline first
  if (session.overallDeadline && now >= session.overallDeadline) {
    return submitExam(session, 'timeout_overall', { now });
  }

  // Check listening section timeout
  if (session.status === 'listening') {
    if (session.listeningDeadline && now >= session.listeningDeadline) {
      const readingResult = transitionToReading(session, { now });
      if (!readingResult.success) return readingResult;

      // Check if reading also expired during extended absence
      if (
        (readingResult.session.readingDeadline && now >= readingResult.session.readingDeadline) ||
        (readingResult.session.overallDeadline && now >= readingResult.session.overallDeadline)
      ) {
        return submitExam(readingResult.session, 'timeout_overall', { now });
      }

      return readingResult;
    }
  }

  // Check reading section timeout
  if (session.status === 'reading') {
    if (session.readingDeadline && now >= session.readingDeadline) {
      return submitExam(session, 'timeout_reading', { now });
    }
  }

  return { success: true, session };
}

/**
 * Marks session as interrupted (e.g. before unload, lost focus, or network drop).
 */
export function interruptExamSession(
  session: ExamSession,
  reason = 'interrupted'
): ExamTransitionResult {
  if (session.status === 'submitted') {
    return {
      success: false,
      session,
      code: 'ALREADY_SUBMITTED',
      error: 'Cannot interrupt an already submitted session.',
    };
  }

  const updated: ExamSession = {
    ...session,
    status: 'interrupted',
    playbackCheckpoint: {
      ...session.playbackCheckpoint,
      audioState: 'paused',
      lastCheckpointAt: Date.now(),
    },
    integrityFlags: {
      ...session.integrityFlags,
      hasRecoveryWarning: true,
      recoveryReason: reason,
    },
  };

  return {
    success: true,
    session: updated,
  };
}

/**
 * Resumes an interrupted exam session.
 * Evaluates timeouts and restores the active section state.
 */
export function resumeExamSession(
  session: ExamSession,
  now = Date.now()
): ExamTransitionResult {
  if (session.status !== 'interrupted') {
    return {
      success: false,
      session,
      code: 'NOT_INTERRUPTED',
      error: `Cannot resume session from '${session.status}' state (must be 'interrupted').`,
    };
  }

  // Check if wall-clock time ran out while interrupted
  const timeoutCheck = evaluateSessionTimeouts(session, now);
  if (timeoutCheck.session.status === 'submitted') {
    return timeoutCheck;
  }

  // Restore to active section
  const targetStatus = session.currentSection === 'listening' ? 'listening' : 'reading';

  const updated: ExamSession = {
    ...session,
    status: targetStatus,
    playbackCheckpoint: {
      ...session.playbackCheckpoint,
      audioState: 'idle',
      lastCheckpointAt: now,
    },
    integrityFlags: {
      ...session.integrityFlags,
      hasRecoveryWarning: false,
      recoveryReason: undefined,
    },
  };

  return {
    success: true,
    session: updated,
  };
}

/**
 * Validates the schema and referential integrity of a raw or stored ExamSession.
 */
export function validateSessionIntegrity(
  raw: unknown,
  examForm: ExamForm
): {
  isValid: boolean;
  cleanedSession?: ExamSession;
  error?: string;
  code?: string;
} {
  if (!raw || typeof raw !== 'object') {
    return {
      isValid: false,
      code: 'INVALID_OBJECT',
      error: 'Session data must be a non-null object.',
    };
  }

  const candidate = raw as Partial<ExamSession>;

  if (
    !candidate.sessionId ||
    !candidate.examFormId ||
    !candidate.status ||
    !candidate.answers ||
    typeof candidate.answers !== 'object'
  ) {
    return {
      isValid: false,
      code: 'MISSING_REQUIRED_FIELDS',
      error: 'Session is missing required identifying fields or answers mapping.',
    };
  }

  if (candidate.examFormId !== examForm.id) {
    return {
      isValid: false,
      code: 'FORM_ID_MISMATCH',
      error: `Session form ID "${candidate.examFormId}" does not match active form "${examForm.id}".`,
    };
  }

  const answerKeys = Object.keys(candidate.answers);
  if (answerKeys.length !== 200) {
    return {
      isValid: false,
      code: 'ANSWER_COUNT_MISMATCH',
      error: `Session answers map contains ${answerKeys.length} items, expected exactly 200.`,
    };
  }

  return {
    isValid: true,
    cleanedSession: candidate as ExamSession,
  };
}
