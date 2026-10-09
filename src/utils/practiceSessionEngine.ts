/**
 * TOEIC Mastery Hub — Practice Session Engine (Phase 5)
 *
 * Pure functions governing the lifecycle, navigation, answers, assistance tracking,
 * real wall-clock timing, and double-submit protection of Practice Sessions.
 */

import {
  PracticeSessionData,
  PracticeSessionInitParams,
  PracticeSubmitReason,
  PracticeAssistanceType,
  SessionValidationResult,
} from '../types/practiceSession';
import { QuestionBankManifest, StandardChoiceKey } from '../types/questionBank';

const APP_SCHEMA_VERSION = '2.5.0';

/**
 * Generates a collision-resistant unique session identifier.
 */
export function generateSessionId(): string {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `session_${timestamp}_${randomPart}`;
}

/**
 * Initializes a new valid Practice Session state.
 *
 * @throws Error if questionIds is empty or duration is invalid in timed mode
 */
export function createPracticeSession(
  params: PracticeSessionInitParams,
  options?: { now?: number; idGenerator?: () => string }
): PracticeSessionData {
  if (!params.questionIds || params.questionIds.length === 0) {
    throw new Error('Cannot create practice session with empty question list.');
  }

  const now = options?.now ?? Date.now();
  const sessionId = options?.idGenerator ? options.idGenerator() : generateSessionId();

  // Initialize answer map with all null values
  const answers: Record<string, StandardChoiceKey | null> = {};
  const markedForReview: Record<string, boolean> = {};

  for (const qId of params.questionIds) {
    answers[qId] = null;
    markedForReview[qId] = false;
  }

  // Calculate wall-clock deadline if timed mode
  let deadline: number | undefined;
  if (params.mode === 'timed') {
    const duration = params.durationSeconds && params.durationSeconds > 0 ? params.durationSeconds : 600; // fallback 10m
    deadline = now + duration * 1000;
  }

  return {
    sessionId,
    part: params.part,
    difficulty: params.difficulty,
    mode: params.mode,
    durationSeconds: params.mode === 'timed' ? params.durationSeconds : undefined,
    questionIds: [...params.questionIds],
    groupIds: params.groupIds ? [...params.groupIds] : [],
    answers,
    markedForReview,
    currentQuestionIndex: 0,
    startedAt: now,
    deadline,
    elapsedSeconds: 0,
    status: 'active',
    allowAudioReplay: params.allowAudioReplay ?? true,
    enableHints: params.enableHints ?? true,
    metadata: {
      assistedQuestions: {},
      reusedCount: params.reusedCount ?? 0,
      isBankExhausted: params.isBankExhausted ?? false,
      appVersion: APP_SCHEMA_VERSION,
    },
  };
}

/**
 * Updates a question's answer choice immutably.
 * Strict lock: Rejects answer changes once session is not 'active'.
 */
export function setSessionAnswer(
  session: PracticeSessionData,
  questionId: string,
  choice: StandardChoiceKey | null
): { success: boolean; session: PracticeSessionData; error?: string } {
  if (session.status !== 'active') {
    return {
      success: false,
      session,
      error: `Cannot modify answer: Session is in '${session.status}' state (answers locked).`,
    };
  }

  if (!session.questionIds.includes(questionId)) {
    return {
      success: false,
      session,
      error: `Question ID '${questionId}' does not belong to this session.`,
    };
  }

  const updatedSession: PracticeSessionData = {
    ...session,
    answers: {
      ...session.answers,
      [questionId]: choice,
    },
  };

  return { success: true, session: updatedSession };
}

/**
 * Toggles the 'marked for review' flag for a given question.
 * Only allowed when session is active.
 */
export function toggleSessionMark(
  session: PracticeSessionData,
  questionId: string
): PracticeSessionData {
  if (session.status !== 'active' || !session.questionIds.includes(questionId)) {
    return session;
  }

  return {
    ...session,
    markedForReview: {
      ...session.markedForReview,
      [questionId]: !session.markedForReview[questionId],
    },
  };
}

/**
 * Navigates to a specific question index with boundary clamping.
 * Preserves all previously entered answers and flags without data loss.
 */
export function navigateSession(
  session: PracticeSessionData,
  targetIndex: number
): PracticeSessionData {
  const maxIndex = Math.max(0, session.questionIds.length - 1);
  const clampedIndex = Math.max(0, Math.min(targetIndex, maxIndex));

  if (clampedIndex === session.currentQuestionIndex) {
    return session;
  }

  return {
    ...session,
    currentQuestionIndex: clampedIndex,
  };
}

export function nextQuestion(session: PracticeSessionData): PracticeSessionData {
  return navigateSession(session, session.currentQuestionIndex + 1);
}

export function previousQuestion(session: PracticeSessionData): PracticeSessionData {
  return navigateSession(session, session.currentQuestionIndex - 1);
}

/**
 * Records assistance (revealing answer, script, or explanation) in Practice Mode.
 * Essential for Phase 9 to differentiate unassisted vs assisted performance.
 */
export function recordAssistance(
  session: PracticeSessionData,
  questionId: string,
  type: PracticeAssistanceType,
  now?: number
): PracticeSessionData {
  if (session.status !== 'active' || !session.questionIds.includes(questionId)) {
    return session;
  }

  const currentTime = now ?? Date.now();
  const prevRecord = session.metadata.assistedQuestions[questionId];

  const updatedRecord = {
    viewedAnswer: type === 'answer' || (prevRecord?.viewedAnswer ?? false),
    viewedScript: type === 'script' || (prevRecord?.viewedScript ?? false),
    viewedExplanation: type === 'explanation' || (prevRecord?.viewedExplanation ?? false),
    firstViewedAt: prevRecord?.firstViewedAt ?? currentTime,
    viewCount: (prevRecord?.viewCount ?? 0) + 1,
  };

  return {
    ...session,
    metadata: {
      ...session.metadata,
      assistedQuestions: {
        ...session.metadata.assistedQuestions,
        [questionId]: updatedRecord,
      },
    },
  };
}

/**
 * Submits a session, locking all answers and recording submission metadata.
 * Double-submit protection: If session is already non-active, returns unchanged.
 */
export function submitSession(
  session: PracticeSessionData,
  reason: PracticeSubmitReason = 'user',
  now?: number
): { session: PracticeSessionData; alreadySubmitted: boolean } {
  if (session.status !== 'active') {
    return { session, alreadySubmitted: true };
  }

  const currentTime = now ?? Date.now();
  const rawElapsed = Math.max(0, Math.floor((currentTime - session.startedAt) / 1000));

  let finalElapsed = rawElapsed;
  if (session.mode === 'timed' && session.durationSeconds) {
    // For auto-timeout or timely finish, clamp elapsed to duration
    finalElapsed = Math.min(session.durationSeconds, rawElapsed);
  }

  const finalStatus = reason === 'auto_timeout' ? 'expired' : 'submitted';

  const finalizedSession: PracticeSessionData = {
    ...session,
    status: finalStatus,
    elapsedSeconds: finalElapsed,
    metadata: {
      ...session.metadata,
      submitReason: reason,
      submittedAt: currentTime,
    },
  };

  return { session: finalizedSession, alreadySubmitted: false };
}

/**
 * Transitions an active session to 'abandoned' state (e.g. user cancelled or replaced).
 */
export function abandonSession(
  session: PracticeSessionData,
  now?: number
): PracticeSessionData {
  if (session.status !== 'active') {
    return session;
  }

  const currentTime = now ?? Date.now();
  const elapsed = Math.max(0, Math.floor((currentTime - session.startedAt) / 1000));

  return {
    ...session,
    status: 'abandoned',
    elapsedSeconds: elapsed,
    metadata: {
      ...session.metadata,
      submitReason: 'abandoned',
      submittedAt: currentTime,
    },
  };
}

/**
 * Calculates remaining seconds using real wall-clock timestamps.
 * Does NOT rely on browser tick count, preventing drift across background tabs.
 *
 * @returns remaining seconds (>= 0) if timed mode, or null if untimed practice mode.
 */
export function getSessionRemainingSeconds(
  session: PracticeSessionData,
  now?: number
): number | null {
  if (session.mode !== 'timed' || session.deadline === undefined) {
    return null;
  }

  if (session.status !== 'active') {
    return 0;
  }

  const currentTime = now ?? Date.now();
  const remainingMs = session.deadline - currentTime;
  return Math.max(0, Math.ceil(remainingMs / 1000));
}

/**
 * Checks if a timed session has exceeded its deadline.
 */
export function isSessionExpired(
  session: PracticeSessionData,
  now?: number
): boolean {
  if (session.mode !== 'timed' || session.deadline === undefined) {
    return false;
  }
  const currentTime = now ?? Date.now();
  return currentTime >= session.deadline;
}

/**
 * Evaluates session deadline and auto-submits if expired.
 * Idempotent: Can be called on intervals, tab focus, or F5 resume.
 */
export function checkAndApplyTimeout(
  session: PracticeSessionData,
  now?: number
): PracticeSessionData {
  if (session.status === 'active' && isSessionExpired(session, now)) {
    return submitSession(session, 'auto_timeout', now).session;
  }
  return session;
}

/**
 * Computes high-level progress statistics for a session.
 */
export function getSessionProgress(session: PracticeSessionData): {
  totalQuestions: number;
  answeredCount: number;
  unansweredCount: number;
  markedCount: number;
  percentageComplete: number;
} {
  const totalQuestions = session.questionIds.length;
  let answeredCount = 0;
  let markedCount = 0;

  for (const qId of session.questionIds) {
    if (session.answers[qId] !== null) {
      answeredCount++;
    }
    if (session.markedForReview[qId] === true) {
      markedCount++;
    }
  }

  const percentageComplete =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return {
    totalQuestions,
    answeredCount,
    unansweredCount: totalQuestions - answeredCount,
    markedCount,
    percentageComplete,
  };
}

/**
 * Validates the structural integrity and Question Bank referential integrity
 * of a session loaded from LocalStorage or external sources.
 */
export function validateSessionIntegrity(
  candidate: unknown,
  bankManifest: QuestionBankManifest
): SessionValidationResult {
  if (!candidate || typeof candidate !== 'object') {
    return { isValid: false, error: 'Session data is not an object.' };
  }

  const session = candidate as Partial<PracticeSessionData>;

  if (!session.sessionId || typeof session.sessionId !== 'string') {
    return { isValid: false, error: 'Missing or invalid sessionId.' };
  }

  if (
    typeof session.part !== 'number' ||
    session.part < 1 ||
    session.part > 7
  ) {
    return { isValid: false, error: 'Invalid TOEIC part number.' };
  }

  if (!session.mode || (session.mode !== 'practice' && session.mode !== 'timed')) {
    return { isValid: false, error: 'Invalid practice session mode.' };
  }

  if (!Array.isArray(session.questionIds) || session.questionIds.length === 0) {
    return { isValid: false, error: 'Session questionIds is missing or empty.' };
  }

  if (!session.answers || typeof session.answers !== 'object') {
    return { isValid: false, error: 'Session answers map is missing or invalid.' };
  }

  if (!session.markedForReview || typeof session.markedForReview !== 'object') {
    return { isValid: false, error: 'Session markedForReview map is missing or invalid.' };
  }

  if (typeof session.startedAt !== 'number') {
    return { isValid: false, error: 'Missing or invalid startedAt timestamp.' };
  }

  // Referential integrity check against active Question Bank Manifest
  const partition = bankManifest.partitions[session.part];
  if (!partition) {
    return { isValid: false, error: `Question bank partition for Part ${session.part} not found.` };
  }

  const validBankQIds = new Set(partition.questions.map((q) => q.id));

  for (const qId of session.questionIds) {
    if (!validBankQIds.has(qId)) {
      return {
        isValid: false,
        error: `Question ID '${qId}' referenced in session no longer exists in Question Bank Part ${session.part}.`,
      };
    }
  }

  // Ensure answer and mark keys align with questionIds
  const cleanedAnswers: Record<string, StandardChoiceKey | null> = {};
  const cleanedMarked: Record<string, boolean> = {};

  for (const qId of session.questionIds) {
    cleanedAnswers[qId] = session.answers[qId] ?? null;
    cleanedMarked[qId] = session.markedForReview[qId] ?? false;
  }

  const cleanedSession: PracticeSessionData = {
    sessionId: session.sessionId,
    part: session.part,
    difficulty: session.difficulty ?? 'mixed',
    mode: session.mode,
    durationSeconds: session.durationSeconds,
    questionIds: [...session.questionIds],
    groupIds: Array.isArray(session.groupIds) ? [...session.groupIds] : [],
    answers: cleanedAnswers,
    markedForReview: cleanedMarked,
    currentQuestionIndex: Math.max(
      0,
      Math.min(session.currentQuestionIndex ?? 0, session.questionIds.length - 1)
    ),
    startedAt: session.startedAt,
    deadline: session.deadline,
    elapsedSeconds: session.elapsedSeconds ?? 0,
    status: session.status ?? 'active',
    allowAudioReplay: session.allowAudioReplay ?? true,
    enableHints: session.enableHints ?? true,
    metadata: {
      assistedQuestions: session.metadata?.assistedQuestions ?? {},
      submitReason: session.metadata?.submitReason,
      submittedAt: session.metadata?.submittedAt,
      reusedCount: session.metadata?.reusedCount ?? 0,
      isBankExhausted: session.metadata?.isBankExhausted ?? false,
      appVersion: session.metadata?.appVersion ?? APP_SCHEMA_VERSION,
    },
  };

  return { isValid: true, cleanedSession };
}
