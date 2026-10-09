/**
 * TOEIC Mastery Hub — Exam Timer & Section Transition Engine (Phase 11)
 *
 * Implements strict, persistent wall-clock timing and section transition logic:
 * - Listening: exactly 45 minutes (2,700s).
 * - Reading: exactly 75 minutes (4,500s).
 * - Overall: exactly 120 minutes (7,200s).
 * - Persistent deadlines: immune to browser F5 reload, background tab throttling,
 *   and computer sleep/wake events.
 * - Strict Mock policy: No arbitrary pause; cannot borrow Reading time for Listening.
 * - Single timer coordination & idempotent auto-transition / auto-submit handlers.
 * - Audio Engine integration hook: halts speech/playback when Listening expires.
 * - System clock regression / tampering anomaly detection.
 */

import {
  ExamSession,
  ExamTimerSnapshot,
  ExamTransitionResult,
  ExamSubmitReason,
} from '../types/mockExam';
import {
  ETS_LISTENING_DURATION_SECONDS,
  ETS_READING_DURATION_SECONDS,
  ETS_OVERALL_DURATION_SECONDS,
  transitionToReading,
  submitExam,
} from './examSessionEngine';

export const CLOCK_REGRESSION_TOLERANCE_MS = 5000; // 5-second tolerance for minor NTP sync jitter
export const SUSPICIOUS_FORWARD_LEAP_MS = 86400000; // 24 hours

/**
 * Formats seconds into MM:SS or H:MM:SS string.
 */
export function formatRemainingTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const ss = seconds < 10 ? `0${seconds}` : `${seconds}`;

  if (hours > 0) {
    return `${hours}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

/**
 * Computes the real-time wall-clock countdown snapshot for an ExamSession.
 *
 * Derives remaining time purely from target deadlines and current timestamp,
 * completely immune to interval drift or background tab execution pauses.
 */
export function calculateTimerSnapshot(
  session: ExamSession,
  now = Date.now()
): ExamTimerSnapshot {
  if (session.status === 'submitted') {
    return {
      sectionRemainingSeconds: 0,
      overallRemainingSeconds: 0,
      isListeningExpired: true,
      isReadingExpired: true,
      isExamExpired: true,
      isUrgent: false,
      formattedSectionTime: '00:00',
      formattedOverallTime: '00:00',
    };
  }

  // Preflight and ready states: display full section allocation
  if (session.status === 'preflight' || session.status === 'ready') {
    return {
      sectionRemainingSeconds: ETS_LISTENING_DURATION_SECONDS,
      overallRemainingSeconds: ETS_OVERALL_DURATION_SECONDS,
      isListeningExpired: false,
      isReadingExpired: false,
      isExamExpired: false,
      isUrgent: false,
      formattedSectionTime: formatRemainingTime(ETS_LISTENING_DURATION_SECONDS),
      formattedOverallTime: formatRemainingTime(ETS_OVERALL_DURATION_SECONDS),
    };
  }

  const overallDeadline =
    session.overallDeadline ??
    (session.startedAt ? session.startedAt + ETS_OVERALL_DURATION_SECONDS * 1000 : now + ETS_OVERALL_DURATION_SECONDS * 1000);

  const overallRemainingSeconds = Math.max(0, Math.ceil((overallDeadline - now) / 1000));
  const isOverallExpired = now >= overallDeadline;

  if (session.status === 'listening') {
    const listeningDeadline =
      session.listeningDeadline ??
      (session.startedAt ? session.startedAt + ETS_LISTENING_DURATION_SECONDS * 1000 : now + ETS_LISTENING_DURATION_SECONDS * 1000);

    const sectionRemainingSeconds = Math.max(0, Math.ceil((listeningDeadline - now) / 1000));
    const isListeningExpired = now >= listeningDeadline;

    return {
      sectionRemainingSeconds,
      overallRemainingSeconds,
      isListeningExpired,
      isReadingExpired: false,
      isExamExpired: isOverallExpired,
      isUrgent: sectionRemainingSeconds <= 300 && sectionRemainingSeconds > 0,
      formattedSectionTime: formatRemainingTime(sectionRemainingSeconds),
      formattedOverallTime: formatRemainingTime(overallRemainingSeconds),
    };
  }

  if (session.status === 'reading') {
    const readingDeadline =
      session.readingDeadline ??
      (session.sectionStartedAt ? session.sectionStartedAt + ETS_READING_DURATION_SECONDS * 1000 : now + ETS_READING_DURATION_SECONDS * 1000);

    const sectionRemainingSeconds = Math.max(0, Math.ceil((readingDeadline - now) / 1000));
    const isReadingExpired = now >= readingDeadline;
    const isExamExpired = isOverallExpired || isReadingExpired;

    return {
      sectionRemainingSeconds,
      overallRemainingSeconds,
      isListeningExpired: true,
      isReadingExpired,
      isExamExpired,
      isUrgent: sectionRemainingSeconds <= 300 && sectionRemainingSeconds > 0,
      formattedSectionTime: formatRemainingTime(sectionRemainingSeconds),
      formattedOverallTime: formatRemainingTime(overallRemainingSeconds),
    };
  }

  // Interrupted / recovery states: calculate based on current section
  const isListening = session.currentSection === 'listening';
  const targetDeadline = isListening
    ? session.listeningDeadline ?? now
    : session.readingDeadline ?? now;

  const sectionRemainingSeconds = Math.max(0, Math.ceil((targetDeadline - now) / 1000));

  return {
    sectionRemainingSeconds,
    overallRemainingSeconds,
    isListeningExpired: isListening ? now >= targetDeadline : true,
    isReadingExpired: !isListening ? now >= targetDeadline : false,
    isExamExpired: isOverallExpired || (!isListening && now >= targetDeadline),
    isUrgent: sectionRemainingSeconds <= 300 && sectionRemainingSeconds > 0,
    formattedSectionTime: formatRemainingTime(sectionRemainingSeconds),
    formattedOverallTime: formatRemainingTime(overallRemainingSeconds),
  };
}

/**
 * Checks system clock consistency against monotonic expectations.
 *
 * Detects system clock rollback (e.g. moving OS clock backward to artificially gain time).
 * Flags session with suspicious warning without crashing the user's exam flow.
 */
export function verifyClockIntegrity(
  session: ExamSession,
  now = Date.now(),
  options?: { toleranceMs?: number }
): {
  isSuspicious: boolean;
  reason?: string;
  driftSeconds?: number;
  updatedSession: ExamSession;
} {
  const tolerance = options?.toleranceMs ?? CLOCK_REGRESSION_TOLERANCE_MS;
  const lastKnown = session.integrityFlags.lastKnownTimestamp ?? session.lastSavedAt;

  // Backward clock regression check
  if (lastKnown && now < lastKnown - tolerance) {
    const diffMs = lastKnown - now;
    const diffSec = Math.round(diffMs / 1000);
    const reason = `System clock regression detected: clock shifted backwards by ${diffSec}s (last known: ${lastKnown}, current: ${now}).`;

    const updatedSession: ExamSession = {
      ...session,
      integrityFlags: {
        ...session.integrityFlags,
        isClockTampered: true,
        clockDriftSeconds: (session.integrityFlags.clockDriftSeconds ?? 0) + diffSec,
        hasRecoveryWarning: true,
        tamperReason: reason,
        lastKnownTimestamp: Math.max(lastKnown, now),
      },
    };

    return {
      isSuspicious: true,
      reason,
      driftSeconds: diffSec,
      updatedSession,
    };
  }

  // Excessive forward leap check (e.g. > 24h jump during active exam)
  if (lastKnown && now - lastKnown > SUSPICIOUS_FORWARD_LEAP_MS && session.status !== 'submitted') {
    const reason = 'Excessive forward clock leap detected (> 24 hours).';
    const updatedSession: ExamSession = {
      ...session,
      integrityFlags: {
        ...session.integrityFlags,
        isClockTampered: true,
        hasRecoveryWarning: true,
        tamperReason: reason,
        lastKnownTimestamp: now,
      },
    };

    return {
      isSuspicious: true,
      reason,
      updatedSession,
    };
  }

  // Normal monotonic tick: record current timestamp
  const updatedSession: ExamSession = {
    ...session,
    integrityFlags: {
      ...session.integrityFlags,
      lastKnownTimestamp: now,
    },
  };

  return {
    isSuspicious: false,
    updatedSession,
  };
}

/**
 * Evaluates exam deadlines and performs automatic section transitions or final submission.
 *
 * Rules:
 * - Listening 45:00 expiration automatically executes transitionToReading and invokes onListeningEnded.
 * - Reading 75:00 expiration automatically executes submitExam('timeout_reading').
 * - Overall 120:00 expiration automatically executes submitExam('timeout_overall').
 * - Idempotency guard: Does not double-transition or double-submit.
 */
export function handleSectionTimeoutOrTransition(
  session: ExamSession,
  now = Date.now(),
  callbacks?: {
    onListeningEnded?: () => void;
    onExamSubmitted?: (reason: ExamSubmitReason) => void;
  }
): ExamTransitionResult {
  if (session.status === 'submitted') {
    return { success: true, session };
  }

  const snapshot = calculateTimerSnapshot(session, now);

  // Reading section 75-minute timeout (74:59 -> 75:00)
  if (session.status === 'reading' && snapshot.isReadingExpired) {
    const submitRes = submitExam(session, 'timeout_reading', { now });
    if (submitRes.success) {
      callbacks?.onExamSubmitted?.('timeout_reading');
    }
    return submitRes;
  }

  // Overall 120-minute deadline takes priority for prolonged inactive or listening overrun sessions
  if (snapshot.isExamExpired && session.overallDeadline && now >= session.overallDeadline) {
    if (session.status === 'listening') {
      callbacks?.onListeningEnded?.();
    }
    const submitRes = submitExam(session, 'timeout_overall', { now });
    if (submitRes.success) {
      callbacks?.onExamSubmitted?.('timeout_overall');
    }
    return submitRes;
  }

  // Listening section 45-minute timeout (44:59 -> 45:00)
  if (session.status === 'listening' && snapshot.isListeningExpired) {
    callbacks?.onListeningEnded?.();
    const transitionRes = transitionToReading(session, { now });
    if (!transitionRes.success) {
      return transitionRes;
    }

    // Check if reading also expired during an extended absence (e.g. user away for 2 hours)
    const postSnapshot = calculateTimerSnapshot(transitionRes.session, now);
    if (postSnapshot.isReadingExpired || postSnapshot.isExamExpired) {
      const submitRes = submitExam(transitionRes.session, 'timeout_overall', { now });
      if (submitRes.success) {
        callbacks?.onExamSubmitted?.('timeout_overall');
      }
      return submitRes;
    }

    return transitionRes;
  }

  return { success: true, session };
}

/**
 * Safely executes manual candidate submit with concurrent auto-timeout collision protection.
 *
 * Guarantees exactly ONE submit transition occurs, even if candidate clicks submit
 * at the exact millisecond auto-timeout fires.
 */
export function executeSafeExamSubmit(
  session: ExamSession,
  reason: ExamSubmitReason = 'user_completed',
  now = Date.now()
): ExamTransitionResult {
  if (session.status === 'submitted') {
    return {
      success: false,
      session,
      code: 'ALREADY_SUBMITTED',
      error: 'Exam session has already been finalized.',
    };
  }

  return submitExam(session, reason, { now });
}

/**
 * Safely executes manual section transition with concurrent auto-transition collision protection.
 *
 * Guarantees exactly ONE transition occurs, even if candidate clicks "Next Section"
 * at the exact millisecond 45:00 expires.
 */
export function executeSafeSectionTransition(
  session: ExamSession,
  now = Date.now(),
  callbacks?: { onListeningEnded?: () => void }
): ExamTransitionResult {
  if (session.status === 'reading') {
    return {
      success: false,
      session,
      code: 'ALREADY_IN_READING',
      error: 'Exam session is already in the Reading section.',
    };
  }

  if (session.status !== 'listening') {
    return {
      success: false,
      session,
      code: 'INVALID_TRANSITION',
      error: `Cannot transition to reading from '${session.status}' state.`,
    };
  }

  callbacks?.onListeningEnded?.();
  return transitionToReading(session, { now });
}
