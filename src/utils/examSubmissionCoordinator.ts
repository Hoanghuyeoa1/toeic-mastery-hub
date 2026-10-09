/**
 * TOEIC Mastery Hub — Idempotent Exam Submission Coordinator (Phase 16)
 *
 * Coordinates the full finalization pipeline for Full Mock Exam sessions:
 * 1. Concurrency & Double-Submit Protection:
 *    - In-memory active locks per Session ID prevent concurrent double-click / multi-trigger execution.
 *    - Strict idempotent replay: if a session was already finalized, returns the existing result
 *      and history entry without creating duplicate records or recalculating scores.
 * 2. State Machine Lockdown:
 *    - Freezes the answer snapshot and locks session state to 'submitted' via submitExam.
 *    - Permanently closes answer and flag modification.
 * 3. Answer Key Scoring:
 *    - Executes pure scoring via scoreExamSession against the canonical ExamForm.
 *    - Enforces 200-question mathematical integrity invariants.
 * 4. Safe Atomic Persistence:
 *    - Persists ExamResult and ExamHistoryEntry to LocalStorage.
 *    - Archives session into completed history.
 *    - Clears active session storage ONLY after successful verified write.
 *    - If storage fails (QuotaExceeded), aborts completion marker, keeps active session
 *      intact and recoverable for retry, and returns explicit error.
 */

import {
  ExamSession,
  ExamForm,
  ExamSubmitReason,
  ExamFinalizeOutcome,
} from '../types/mockExam';
import { Question } from '../types/questionBank';
import { submitExam } from './examSessionEngine';
import {
  scoreExamSession,
  createExamHistoryEntry,
  validateScoreTotals,
} from './examScoringEngine';
import {
  saveExamResult,
  getExamResult,
  saveExamHistoryEntry,
  getExamHistory,
  archiveCompletedExamSession,
  clearActiveExamSession,
} from './examSessionStorage';

// In-memory set of currently finalizing session IDs to prevent synchronous re-entry
const inFlightFinalizations = new Set<string>();

export interface FinalizeExamSubmissionOptions {
  now?: number;
  lookupQuestion?: (id: string) => Question | undefined;
  tabId?: string;
}

/**
 * Checks whether an exam session has already been finalized and has a stored result.
 */
export function isSessionFinalized(sessionId: string): boolean {
  return getExamResult(sessionId) !== null;
}

/**
 * Idempotently finalizes an ExamSession.
 *
 * Rules:
 * - A single Session ID can only ever be finalized once.
 * - Handles manual submit, auto-timeout submit, and post-deadline resume submits identically.
 * - Returns success ONLY after persistence to LocalStorage has actually succeeded.
 * - On storage failure, keeps the session recoverable in active storage and returns success: false.
 */
export function finalizeExamSubmission(
  session: ExamSession,
  examForm: ExamForm,
  reason: ExamSubmitReason = 'user_completed',
  options?: FinalizeExamSubmissionOptions
): ExamFinalizeOutcome {
  if (!session || !session.sessionId) {
    return {
      success: false,
      code: 'SESSION_NOT_FOUND',
      error: 'Cannot finalize submission: Invalid or missing session object.',
    };
  }

  if (!examForm || !examForm.id || examForm.questions?.length !== 200) {
    return {
      success: false,
      code: 'FORM_NOT_FOUND',
      error: 'Cannot finalize submission: Valid 200-question ExamForm is required.',
    };
  }

  const sessionId = session.sessionId;

  // 1. In-flight Lock: detect concurrent double-click / rapid race
  if (inFlightFinalizations.has(sessionId)) {
    return {
      success: false,
      code: 'SUBMISSION_IN_PROGRESS',
      error: 'Submission finalization is already in progress for this session.',
    };
  }

  // 2. Storage Idempotency: check if result already exists in persistent storage
  const existingResult = getExamResult(sessionId);
  if (existingResult) {
    const existingHistory = getExamHistory().find((h) => h.sessionId === sessionId);
    return {
      success: true,
      alreadyFinalized: true,
      result: existingResult,
      historyEntry: existingHistory ?? createExamHistoryEntry(existingResult),
      session: {
        ...session,
        status: 'submitted',
        submittedAt: session.submittedAt || new Date(existingResult.completedAt).getTime(),
        submitReason: session.submitReason || existingResult.submitReason,
      },
    };
  }

  inFlightFinalizations.add(sessionId);

  try {
    const now = options?.now ?? Date.now();

    // 3. State Machine Lock: transition session to 'submitted'
    let submittedSession: ExamSession = session;
    if (session.status !== 'submitted') {
      const submitRes = submitExam(session, reason, { now });
      if (!submitRes.success && submitRes.code !== 'ALREADY_SUBMITTED') {
        return {
          success: false,
          code: 'VALIDATION_FAILED',
          error: submitRes.error ?? 'Session engine rejected submission.',
          session,
        };
      }
      submittedSession = submitRes.session;
    }

    // 4. Score according to answer key
    const examResult = scoreExamSession(submittedSession, examForm, {
      lookupQuestion: options?.lookupQuestion,
      now,
    });

    // 5. Verify mathematical 200-question invariants
    const invariantCheck = validateScoreTotals(examResult);
    if (!invariantCheck.isValid) {
      return {
        success: false,
        code: 'VALIDATION_FAILED',
        error: `Scoring invariant check failed: ${invariantCheck.errors.join('; ')}`,
        session: submittedSession,
      };
    }

    // 6. Generate history entry
    const historyEntry = createExamHistoryEntry(examResult);

    // 7. Atomic Persistence Pipeline
    // Step 7a: Save ExamResult
    const saveResultOp = saveExamResult(examResult);
    if (!saveResultOp.success) {
      return {
        success: false,
        code: 'STORAGE_FAILURE',
        error: saveResultOp.error ?? 'Failed to persist ExamResult.',
        session: submittedSession,
      };
    }

    // Step 7b: Save ExamHistoryEntry
    const saveHistOp = saveExamHistoryEntry(historyEntry);
    if (!saveHistOp.success) {
      return {
        success: false,
        code: 'STORAGE_FAILURE',
        error: saveHistOp.error ?? 'Failed to persist ExamHistoryEntry.',
        session: submittedSession,
      };
    }

    // Step 7c: Archive completed ExamSession
    archiveCompletedExamSession(submittedSession);

    // Step 7d: Clear active exam session storage (only once result & history are verified saved)
    clearActiveExamSession();

    return {
      success: true,
      alreadyFinalized: false,
      result: examResult,
      historyEntry,
      session: submittedSession,
    };
  } finally {
    inFlightFinalizations.delete(sessionId);
  }
}
