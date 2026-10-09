/**
 * TOEIC Mastery Hub — Exam Session Storage Adapter (Phase 10)
 *
 * Implements robust, offline-first LocalStorage persistence for 200-question
 * Full-Length Mock Exam sessions and history:
 * - Isolated keys preserving Cold Storage (`toeic_mastery_data_v2_cold`) and Practice (`toeic_practice_...`).
 * - Lean payloads: Stores strictly IDs, answers mapping (200 items), flags, and timers without
 *   duplicating raw question bank items or audio Blobs.
 * - Auto-save error handling with QuotaExceededError detection (never returns false success).
 * - F5 / browser reload resilience with wall-clock deadline evaluation and automatic timeout submission.
 * - Referential integrity checks against ExamForm contentRevision and fingerprint.
 * - Active session overwrite protection (forceReplace guard).
 */

import {
  ExamSession,
  ExamForm,
  ExamStorageOperationResult,
  ExamResult,
  ExamHistoryEntry,
} from '../types/mockExam';
import {
  submitExam,
  evaluateSessionTimeouts,
  validateSessionIntegrity,
} from './examSessionEngine';

import {
  isTabAuthorizedToSave,
  broadcastTabMessage,
} from './examTabCoordinator';

export const ACTIVE_EXAM_SESSION_KEY = 'toeic_exam_active_session_v1';
export const EXAM_SESSION_HISTORY_KEY = 'toeic_exam_session_history_v1';
export const EXAM_RESULT_STORAGE_PREFIX = 'toeic_exam_result_v1_';
export const EXAM_HISTORY_STORAGE_KEY = 'toeic_exam_history_v1';

const MAX_EXAM_HISTORY_ENTRIES = 50;

/**
 * Safely resolves the storage instance across browser and test environments.
 */
function getStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    if (
      typeof globalThis !== 'undefined' &&
      (globalThis as unknown as { localStorage?: Storage }).localStorage
    ) {
      return (globalThis as unknown as { localStorage: Storage }).localStorage;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Checks whether localStorage is accessible and writable.
 */
export function isStorageAvailable(): boolean {
  try {
    const storage = getStorage();
    if (!storage) return false;
    const testKey = '__exam_storage_probe__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks whether an unfinished exam session currently exists in active storage.
 */
export function checkHasUnfinishedActiveExamSession(): boolean {
  const storage = getStorage();
  if (!storage) return false;
  try {
    const raw = storage.getItem(ACTIVE_EXAM_SESSION_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as Partial<ExamSession>;
    const unfinishedStatuses = [
      'preflight',
      'ready',
      'listening',
      'reading',
      'interrupted',
      'recovery-required',
    ];
    return !!parsed?.status && unfinishedStatuses.includes(parsed.status);
  } catch {
    return false;
  }
}

/**
 * Persists an active exam session to LocalStorage.
 *
 * Rules:
 * - Validates tabId ownership to prevent stale background tabs from overwriting storage.
 * - Sets `lastSavedAt` only upon verified storage write.
 * - Traps QuotaExceededError and never reports false success.
 * - Isolates active exam session from profile and practice storage keys.
 */
export function saveActiveExamSession(
  session: ExamSession,
  options?: { tabId?: string; now?: number }
): ExamStorageOperationResult<ExamSession> {
  const storage = getStorage();
  if (!storage) {
    return {
      success: false,
      code: 'STORAGE_UNAVAILABLE',
      error: 'LocalStorage is unavailable in this runtime environment.',
    };
  }

  const now = options?.now ?? Date.now();

  // Multi-tab authorization guard
  if (options?.tabId && !isTabAuthorizedToSave(session.sessionId, options.tabId, now)) {
    return {
      success: false,
      code: 'TAB_CONFLICT',
      error: 'Storage mutation rejected: Another browser tab currently holds active session ownership.',
    };
  }

  const sessionToSave: ExamSession = {
    ...session,
    lastSavedAt: now,
  };

  try {
    const serialized = JSON.stringify(sessionToSave);
    storage.setItem(ACTIVE_EXAM_SESSION_KEY, serialized);

    // Notify peer tabs of session update
    if (options?.tabId) {
      broadcastTabMessage({
        type: 'SESSION_SYNC',
        sessionId: session.sessionId,
        tabId: options.tabId,
        timestamp: now,
      });
    }

    return {
      success: true,
      data: sessionToSave,
    };
  } catch (err: unknown) {
    const isQuota =
      err instanceof DOMException &&
      (err.code === 22 ||
        err.code === 1014 ||
        err.name === 'QuotaExceededError' ||
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED');

    return {
      success: false,
      code: isQuota ? 'QUOTA_EXCEEDED' : 'WRITE_ERROR',
      error: isQuota
        ? 'LocalStorage quota exceeded while saving active exam session.'
        : `Failed to persist active exam session: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Initiates a new active session with strict overwrite protection.
 *
 * Rules:
 * - If an unfinished session exists and forceReplace is false, rejects unless it is an idempotent reload
 *   of the same sessionId (React StrictMode effect safety).
 * - If forceReplace is true, cleanly archives the previous active session as abandoned before overwriting.
 */
export function startNewExamSession(
  newSession: ExamSession,
  options?: { forceReplace?: boolean; tabId?: string; now?: number }
): ExamStorageOperationResult<ExamSession> {
  const storage = getStorage();
  if (!storage) {
    return {
      success: false,
      code: 'STORAGE_UNAVAILABLE',
      error: 'LocalStorage is unavailable.',
    };
  }

  const forceReplace = options?.forceReplace ?? false;

  // Check for existing unfinished session
  const rawExisting = storage.getItem(ACTIVE_EXAM_SESSION_KEY);
  if (rawExisting) {
    try {
      const existing = JSON.parse(rawExisting) as Partial<ExamSession>;
      const unfinishedStatuses = [
        'preflight',
        'ready',
        'listening',
        'reading',
        'interrupted',
        'recovery-required',
      ];

      if (existing?.status && unfinishedStatuses.includes(existing.status)) {
        // React StrictMode idempotent reload guard: same sessionId permitted
        if (existing.sessionId === newSession.sessionId) {
          return saveActiveExamSession(newSession, { tabId: options?.tabId, now: options?.now });
        }

        if (!forceReplace) {
          return {
            success: false,
            code: 'UNFINISHED_SESSION_EXISTS',
            error:
              'An active unfinished exam session is already in progress. Explicit confirmation required to replace.',
          };
        }

        // Replacing existing session: archive as abandoned
        if (existing.status === 'listening' || existing.status === 'reading' || existing.status === 'interrupted') {
          const abandoned = submitExam(existing as ExamSession, 'abandoned');
          archiveCompletedExamSession(abandoned.session);
        }
      }
    } catch {
      // If corrupted, permit startNewExamSession to overwrite cleanly
    }
  }

  return saveActiveExamSession(newSession, { tabId: options?.tabId, now: options?.now });
}

/**
 * Loads the active exam session from LocalStorage.
 *
 * Resilience & Integrity Verification:
 * 1. Checks JSON formatting (safely discards malformed JSON).
 * 2. Cross-references ExamForm using resolver:
 *    - Detects content revision mismatches.
 *    - Detects content fingerprint tampering.
 *    - Flags missing questions or broken structure as 'recovery-required'.
 * 3. Wall-Clock Timeout Evaluation:
 *    - If session expired while browser was closed, automatically transitions
 *      to 'submitted' ('timeout_reading' or 'timeout_overall'), archives to history,
 *      and cleans active storage.
 */
export function loadActiveExamSession(
  getExamForm: (formId: string) => ExamForm | undefined,
  now = Date.now()
): ExamStorageOperationResult<ExamSession | null> {
  const storage = getStorage();
  if (!storage) {
    return {
      success: false,
      data: null,
      code: 'STORAGE_UNAVAILABLE',
      error: 'LocalStorage is unavailable.',
    };
  }

  const raw = storage.getItem(ACTIVE_EXAM_SESSION_KEY);
  if (!raw) {
    return { success: true, data: null };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    storage.removeItem(ACTIVE_EXAM_SESSION_KEY);
    return {
      success: false,
      data: null,
      code: 'CORRUPTED_JSON',
      error: 'Active exam session storage contained malformed JSON.',
    };
  }

  const candidate = parsed as Partial<ExamSession>;
  if (!candidate || !candidate.examFormId) {
    storage.removeItem(ACTIVE_EXAM_SESSION_KEY);
    return {
      success: false,
      data: null,
      code: 'INVALID_SESSION',
      error: 'Stored session object lacks required identifier or examFormId.',
    };
  }

  const examForm = getExamForm(candidate.examFormId);
  if (!examForm) {
    return {
      success: false,
      data: null,
      code: 'FORM_NOT_FOUND',
      error: `ExamForm "${candidate.examFormId}" referenced by stored session is not registered.`,
    };
  }

  const validation = validateSessionIntegrity(parsed, examForm);
  if (!validation.isValid || !validation.cleanedSession) {
    return {
      success: false,
      data: null,
      code: 'INVALID_SESSION',
      error: validation.error ?? 'Session data failed referential integrity checks.',
    };
  }

  let session = validation.cleanedSession;

  // Check content revision mismatch
  if (session.contentRevision !== examForm.contentRevision) {
    session = {
      ...session,
      status: 'recovery-required',
      integrityFlags: {
        ...session.integrityFlags,
        isRevisionMismatch: true,
        hasRecoveryWarning: true,
        recoveryReason: `ExamForm revision changed (session: ${session.contentRevision}, current: ${examForm.contentRevision}).`,
      },
    };
    saveActiveExamSession(session);
    return {
      success: true,
      data: session,
      code: 'REVISION_MISMATCH',
      error: session.integrityFlags.recoveryReason,
    };
  }

  // Check fingerprint mismatch
  if (
    examForm.metadata?.contentFingerprint &&
    session.integrityFlags?.contentFingerprint &&
    session.integrityFlags.contentFingerprint !== examForm.metadata.contentFingerprint
  ) {
    session = {
      ...session,
      status: 'recovery-required',
      integrityFlags: {
        ...session.integrityFlags,
        isTampered: true,
        hasRecoveryWarning: true,
        recoveryReason: 'Content fingerprint mismatch indicates ExamForm content has changed.',
      },
    };
    saveActiveExamSession(session);
    return {
      success: true,
      data: session,
      code: 'INVALID_SESSION',
      error: session.integrityFlags.recoveryReason,
    };
  }

  // Wall-clock deadline check for in-progress sessions upon reload
  if (session.status === 'listening' || session.status === 'reading' || session.status === 'interrupted') {
    const timeoutRes = evaluateSessionTimeouts(session, now);
    if (timeoutRes.session.status === 'submitted') {
      session = timeoutRes.session;
      // Archive finalized session and clean active storage
      archiveCompletedExamSession(session);
      clearActiveExamSession();
      return {
        success: true,
        data: session,
      };
    }
    session = timeoutRes.session;
  }

  return {
    success: true,
    data: session,
  };
}

/**
 * Removes the active exam session from LocalStorage.
 */
export function clearActiveExamSession(): void {
  const storage = getStorage();
  if (storage) {
    storage.removeItem(ACTIVE_EXAM_SESSION_KEY);
  }
}

/**
 * Appends a finalized exam session to history storage.
 * Caps the history at MAX_EXAM_HISTORY_ENTRIES to prevent unbounded storage growth.
 */
export function archiveCompletedExamSession(
  session: ExamSession
): ExamStorageOperationResult {
  const storage = getStorage();
  if (!storage) {
    return {
      success: false,
      code: 'STORAGE_UNAVAILABLE',
      error: 'LocalStorage is unavailable.',
    };
  }

  try {
    let history: ExamSession[] = [];
    const raw = storage.getItem(EXAM_SESSION_HISTORY_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          history = parsed;
        }
      } catch {
        history = [];
      }
    }

    // Filter out duplicate session ID if re-archiving
    const filtered = history.filter((s) => s.sessionId !== session.sessionId);
    filtered.unshift(session);

    // Trim to maximum allowed history entries
    if (filtered.length > MAX_EXAM_HISTORY_ENTRIES) {
      filtered.length = MAX_EXAM_HISTORY_ENTRIES;
    }

    storage.setItem(EXAM_SESSION_HISTORY_KEY, JSON.stringify(filtered));
    return { success: true };
  } catch (err: unknown) {
    const isQuota =
      err instanceof DOMException &&
      (err.code === 22 ||
        err.code === 1014 ||
        err.name === 'QuotaExceededError' ||
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED');

    return {
      success: false,
      code: isQuota ? 'QUOTA_EXCEEDED' : 'WRITE_ERROR',
      error: isQuota
        ? 'LocalStorage quota exceeded while archiving exam session.'
        : `Failed to archive exam session: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Retrieves the full list of archived exam sessions from LocalStorage.
 */
export function getExamSessionHistory(): ExamSession[] {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(EXAM_SESSION_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ExamSession[]) : [];
  } catch {
    return [];
  }
}

/**
 * Clears the exam session history from LocalStorage.
 */
export function clearExamSessionHistory(): void {
  const storage = getStorage();
  if (storage) {
    storage.removeItem(EXAM_SESSION_HISTORY_KEY);
  }
}

/**
 * Saves a finalized ExamResult into LocalStorage.
 * Keyed by: `${EXAM_RESULT_STORAGE_PREFIX}${result.sessionId}`
 */
export function saveExamResult(
  result: ExamResult
): ExamStorageOperationResult<ExamResult> {
  const storage = getStorage();
  if (!storage) {
    return {
      success: false,
      code: 'STORAGE_UNAVAILABLE',
      error: 'LocalStorage is unavailable.',
    };
  }

  const key = `${EXAM_RESULT_STORAGE_PREFIX}${result.sessionId}`;

  try {
    storage.setItem(key, JSON.stringify(result));
    return {
      success: true,
      data: result,
    };
  } catch (err: unknown) {
    const isQuota =
      err instanceof DOMException &&
      (err.code === 22 ||
        err.code === 1014 ||
        err.name === 'QuotaExceededError' ||
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED');

    return {
      success: false,
      code: isQuota ? 'QUOTA_EXCEEDED' : 'WRITE_ERROR',
      error: isQuota
        ? 'LocalStorage quota exceeded while saving exam result.'
        : `Failed to persist exam result: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Retrieves a finalized ExamResult from LocalStorage by sessionId.
 */
export function getExamResult(sessionId: string): ExamResult | null {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const key = `${EXAM_RESULT_STORAGE_PREFIX}${sessionId}`;
    const raw = storage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as ExamResult;
  } catch {
    return null;
  }
}

/**
 * Deletes a single ExamResult by sessionId from LocalStorage.
 */
export function clearExamResult(sessionId: string): void {
  const storage = getStorage();
  if (storage) {
    storage.removeItem(`${EXAM_RESULT_STORAGE_PREFIX}${sessionId}`);
  }
}

/**
 * Appends or updates an ExamHistoryEntry in history storage.
 * Caps entries at MAX_EXAM_HISTORY_ENTRIES.
 */
export function saveExamHistoryEntry(
  entry: ExamHistoryEntry
): ExamStorageOperationResult<ExamHistoryEntry> {
  const storage = getStorage();
  if (!storage) {
    return {
      success: false,
      code: 'STORAGE_UNAVAILABLE',
      error: 'LocalStorage is unavailable.',
    };
  }

  try {
    let history: ExamHistoryEntry[] = [];
    const raw = storage.getItem(EXAM_HISTORY_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          history = parsed;
        }
      } catch {
        history = [];
      }
    }

    // Idempotent deduplication: filter out existing entry with same id/sessionId
    const filtered = history.filter(
      (h) => h.id !== entry.id && h.sessionId !== entry.sessionId
    );
    filtered.unshift(entry);

    if (filtered.length > MAX_EXAM_HISTORY_ENTRIES) {
      filtered.length = MAX_EXAM_HISTORY_ENTRIES;
    }

    storage.setItem(EXAM_HISTORY_STORAGE_KEY, JSON.stringify(filtered));
    return {
      success: true,
      data: entry,
    };
  } catch (err: unknown) {
    const isQuota =
      err instanceof DOMException &&
      (err.code === 22 ||
        err.code === 1014 ||
        err.name === 'QuotaExceededError' ||
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED');

    return {
      success: false,
      code: isQuota ? 'QUOTA_EXCEEDED' : 'WRITE_ERROR',
      error: isQuota
        ? 'LocalStorage quota exceeded while saving exam history.'
        : `Failed to persist exam history: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Retrieves the full list of ExamHistoryEntry records from LocalStorage.
 */
export function getExamHistory(): ExamHistoryEntry[] {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(EXAM_HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ExamHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

/**
 * Retrieves all attempts for a specific ExamForm ID from history.
 * Retains separate records for multiple retakes.
 */
export function getExamHistoryForForm(formId: string): ExamHistoryEntry[] {
  return getExamHistory().filter((entry) => entry.examFormId === formId);
}

/**
 * Clears all ExamHistoryEntry records from LocalStorage.
 */
export function clearExamHistory(): void {
  const storage = getStorage();
  if (storage) {
    storage.removeItem(EXAM_HISTORY_STORAGE_KEY);
  }
}

/**
 * Cleans up all per-session exam results from LocalStorage.
 */
export function clearAllExamResults(): void {
  const storage = getStorage();
  if (!storage) return;

  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key && key.startsWith(EXAM_RESULT_STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => storage.removeItem(key));
  } catch {
    // Ignore cleanup errors
  }
}

