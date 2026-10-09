/**
 * TOEIC Mastery Hub — Practice Session Storage Adapter (Phase 5)
 *
 * Implements robust, offline-first LocalStorage persistence for active sessions
 * and practice history with overwrite protection, quota error detection,
 * corrupted JSON safeguards, and automatic timeout resolution on reload.
 */

import {
  PracticeSessionData,
  ArchivedPracticeSession,
  StorageOperationResult,
} from '../types/practiceSession';
import { QuestionBankManifest } from '../types/questionBank';
import {
  validateSessionIntegrity,
  submitSession,
  abandonSession,
} from './practiceSessionEngine';

export const ACTIVE_PRACTICE_SESSION_KEY = 'toeic_practice_active_session_v1';
export const PRACTICE_HISTORY_KEY = 'toeic_practice_session_history_v1';

const MAX_HISTORY_ENTRIES = 100;

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
 * Safely inspects whether localStorage is available.
 */
function isStorageAvailable(): boolean {
  try {
    const storage = getStorage();
    if (!storage) return false;
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Persists the active practice session to LocalStorage.
 * Handles storage quota exceptions without reporting false positives.
 */
export function saveActiveSession(
  session: PracticeSessionData
): StorageOperationResult {
  const storage = getStorage();
  if (!storage) {
    return {
      success: false,
      code: 'STORAGE_UNAVAILABLE',
      error: 'LocalStorage is unavailable or restricted in this environment.',
    };
  }

  try {
    const serialized = JSON.stringify(session);
    storage.setItem(ACTIVE_PRACTICE_SESSION_KEY, serialized);
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
      code: isQuota ? 'QUOTA_EXCEEDED' : 'STORAGE_UNAVAILABLE',
      error: isQuota
        ? 'Browser storage quota exceeded while saving active session.'
        : `Failed to write active session: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Inspects whether an unfinished session currently exists in storage.
 */
export function checkHasUnfinishedActiveSession(): boolean {
  const storage = getStorage();
  if (!storage) return false;
  try {
    const raw = storage.getItem(ACTIVE_PRACTICE_SESSION_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as Partial<PracticeSessionData>;
    return parsed?.status === 'active';
  } catch {
    return false;
  }
}

/**
 * Initiates a new active session with strict overwrite protection.
 * If an active unfinished session already exists, rejects unless forceReplace is true.
 */
export function startNewActiveSession(
  newSession: PracticeSessionData,
  forceReplace = false
): StorageOperationResult {
  if (checkHasUnfinishedActiveSession() && !forceReplace) {
    return {
      success: false,
      code: 'UNFINISHED_SESSION_EXISTS',
      error: 'An active unfinished practice session is already in progress. Explicit confirmation required to replace.',
    };
  }

  // If replacing an existing unfinished session, archive it as abandoned first
  if (forceReplace) {
    const storage = getStorage();
    if (storage) {
      try {
        const raw = storage.getItem(ACTIVE_PRACTICE_SESSION_KEY);
        if (raw) {
          const oldSession = JSON.parse(raw) as PracticeSessionData;
          if (oldSession.status === 'active') {
            const abandoned = abandonSession(oldSession);
            archiveCompletedSession(abandoned);
          }
        }
      } catch {
        // Proceed even if old session could not be cleanly archived
      }
    }
  }

  return saveActiveSession(newSession);
}

/**
 * Loads the active practice session from LocalStorage.
 *
 * Verifies schema and Question Bank referential integrity.
 * If a timed session's deadline has already passed while away/closed,
 * automatically transitions it to expired/auto_timeout, archives it,
 * and returns the expired session.
 */
export function loadActiveSession(
  bankManifest: QuestionBankManifest,
  now?: number
): StorageOperationResult<PracticeSessionData | null> {
  const storage = getStorage();
  if (!storage) {
    return {
      success: false,
      data: null,
      code: 'STORAGE_UNAVAILABLE',
      error: 'LocalStorage is unavailable.',
    };
  }

  const raw = storage.getItem(ACTIVE_PRACTICE_SESSION_KEY);
  if (!raw) {
    return { success: true, data: null };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Corrupted JSON detected — remove corrupted item to restore clean state
    storage.removeItem(ACTIVE_PRACTICE_SESSION_KEY);
    return {
      success: false,
      data: null,
      code: 'CORRUPTED_JSON',
      error: 'Active practice session storage contained malformed JSON.',
    };
  }

  const validation = validateSessionIntegrity(parsed, bankManifest);
  if (!validation.isValid || !validation.cleanedSession) {
    storage.removeItem(ACTIVE_PRACTICE_SESSION_KEY);
    return {
      success: false,
      data: null,
      code: 'INVALID_SESSION',
      error: validation.error ?? 'Session data is invalid or references obsolete questions.',
    };
  }

  let session = validation.cleanedSession;
  const currentTime = now ?? Date.now();

  // Wall-clock deadline check for Timed Practice on resume/F5
  if (
    session.status === 'active' &&
    session.mode === 'timed' &&
    session.deadline !== undefined &&
    currentTime >= session.deadline
  ) {
    // Automatically transition to expired (auto_timeout)
    const timeoutResult = submitSession(session, 'auto_timeout', currentTime);
    session = timeoutResult.session;

    // Archive and remove from active storage
    archiveCompletedSession(session);
    clearActiveSession();

    return {
      success: true,
      data: session,
    };
  }

  return { success: true, data: session };
}

/**
 * Removes the active session key from LocalStorage.
 */
export function clearActiveSession(): void {
  const storage = getStorage();
  if (storage) {
    storage.removeItem(ACTIVE_PRACTICE_SESSION_KEY);
  }
}

/**
 * Appends a finalized session (submitted, expired, or abandoned) to history.
 */
export function archiveCompletedSession(
  session: PracticeSessionData
): StorageOperationResult {
  const storage = getStorage();
  if (!storage) {
    return { success: false, code: 'STORAGE_UNAVAILABLE' };
  }

  try {
    let answeredCount = 0;
    for (const qId of session.questionIds) {
      if (session.answers[qId] !== null) {
        answeredCount++;
      }
    }

    const archivedEntry: ArchivedPracticeSession = {
      sessionId: session.sessionId,
      part: session.part,
      difficulty: session.difficulty,
      mode: session.mode,
      questionCount: session.questionIds.length,
      answeredCount,
      startedAt: session.startedAt,
      completedAt: session.metadata.submittedAt ?? Date.now(),
      status: session.status,
      submitReason: session.metadata.submitReason,
      durationSeconds: session.durationSeconds,
      elapsedSeconds: session.elapsedSeconds,
      sessionData: session,
    };

    const rawHistory = storage.getItem(PRACTICE_HISTORY_KEY);
    let history: ArchivedPracticeSession[] = [];

    if (rawHistory) {
      try {
        history = JSON.parse(rawHistory);
        if (!Array.isArray(history)) {
          history = [];
        }
      } catch {
        history = [];
      }
    }

    // Filter out if duplicate sessionId already in history
    history = history.filter((h) => h.sessionId !== session.sessionId);

    // Prepend latest entry and enforce max history cap
    history.unshift(archivedEntry);
    if (history.length > MAX_HISTORY_ENTRIES) {
      history = history.slice(0, MAX_HISTORY_ENTRIES);
    }

    storage.setItem(PRACTICE_HISTORY_KEY, JSON.stringify(history));
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
      code: isQuota ? 'QUOTA_EXCEEDED' : 'STORAGE_UNAVAILABLE',
      error: `Failed to archive session: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Retrieves all archived practice sessions from LocalStorage.
 */
export function loadPracticeHistory(): ArchivedPracticeSession[] {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(PRACTICE_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ArchivedPracticeSession[]) : [];
  } catch {
    return [];
  }
}

/**
 * Exports practice session storage data for backup integration (Phase 10).
 */
export function exportPracticeStorageData(): {
  activeSession: PracticeSessionData | null;
  history: ArchivedPracticeSession[];
} {
  const storage = getStorage();
  let activeSession: PracticeSessionData | null = null;
  if (storage) {
    try {
      const raw = storage.getItem(ACTIVE_PRACTICE_SESSION_KEY);
      if (raw) activeSession = JSON.parse(raw);
    } catch {
      // Ignored
    }
  }

  return {
    activeSession,
    history: loadPracticeHistory(),
  };
}

/**
 * Restores practice session storage data from backup.
 */
export function importPracticeStorageData(data: {
  activeSession?: PracticeSessionData | null;
  history?: ArchivedPracticeSession[];
}): StorageOperationResult {
  const storage = getStorage();
  if (!storage) {
    return { success: false, code: 'STORAGE_UNAVAILABLE' };
  }

  try {
    if (data.activeSession) {
      storage.setItem(
        ACTIVE_PRACTICE_SESSION_KEY,
        JSON.stringify(data.activeSession)
      );
    }
    if (Array.isArray(data.history)) {
      storage.setItem(
        PRACTICE_HISTORY_KEY,
        JSON.stringify(data.history)
      );
    }
    return { success: true };
  } catch (err) {
    return {
      success: false,
      code: 'STORAGE_UNAVAILABLE',
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
