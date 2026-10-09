/**
 * TOEIC Mastery Hub — Exam Timer & Multi-Tab Hook (Phase 11)
 *
 * React hook coordinating exam timing, section transitions, multi-tab safety,
 * and audio engine playback stoppage:
 * - Real wall-clock countdown derived from persistent session deadlines.
 * - Single writer lease model: only 1 tab can edit; secondary tabs show conflict state.
 * - Heartbeat renewal and explicit takeover support.
 * - Auto-transition at Listening 45:00 and auto-submit at Reading 75:00 / Overall 120:00.
 * - Background throttling recovery on window focus and visibilitychange.
 * - Halts Audio Engine speech playback when Listening section expires.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ExamSession,
  ExamTimerSnapshot,
  ExamTransitionResult,
  ExamSubmitReason,
  TabLeaseStatus,
} from '../types/mockExam';
import {
  calculateTimerSnapshot,
  verifyClockIntegrity,
  handleSectionTimeoutOrTransition,
  executeSafeExamSubmit,
  executeSafeSectionTransition,
} from '../utils/examTimer';
import {
  generateTabId,
  acquireTabLease,
  renewTabLease,
  releaseTabLease,
  subscribeToTabBus,
  DEFAULT_HEARTBEAT_INTERVAL_MS,
} from '../utils/examTabCoordinator';

export interface UseExamTimerOptions {
  session: ExamSession | null;
  onSessionUpdate: (updatedSession: ExamSession) => void;
  onListeningEnded?: () => void;
  onExamSubmitted?: (reason: ExamSubmitReason) => void;
  enableMultiTab?: boolean;
}

export interface UseExamTimerReturn {
  snapshot: ExamTimerSnapshot;
  tabId: string;
  tabLeaseStatus: TabLeaseStatus;
  isConflict: boolean;
  conflictTabId: string | null;
  takeoverLease: () => void;
  safeSubmit: (reason?: ExamSubmitReason) => ExamTransitionResult;
  safeTransitionToReading: () => ExamTransitionResult;
  isUrgent: boolean;
  formattedSectionTime: string;
  formattedOverallTime: string;
}

export function useExamTimer({
  session,
  onSessionUpdate,
  onListeningEnded,
  onExamSubmitted,
  enableMultiTab = true,
}: UseExamTimerOptions): UseExamTimerReturn {
  // Stable unique identifier for this browser tab instance
  const tabIdRef = useRef<string>(generateTabId());
  const tabId = tabIdRef.current;

  // Multi-tab lease state
  const [tabLeaseStatus, setTabLeaseStatus] = useState<TabLeaseStatus>('active');
  const [conflictTabId, setConflictTabId] = useState<string | null>(null);

  // Timer snapshot state
  const [snapshot, setSnapshot] = useState<ExamTimerSnapshot>(() => {
    if (!session) {
      return {
        sectionRemainingSeconds: 0,
        overallRemainingSeconds: 0,
        isListeningExpired: false,
        isReadingExpired: false,
        isExamExpired: false,
        isUrgent: false,
        formattedSectionTime: '00:00',
        formattedOverallTime: '00:00',
      };
    }
    return calculateTimerSnapshot(session);
  });

  // Storing latest session and callbacks in refs to eliminate stale closures in intervals
  const sessionRef = useRef(session);
  sessionRef.current = session;

  const onSessionUpdateRef = useRef(onSessionUpdate);
  onSessionUpdateRef.current = onSessionUpdate;

  const onListeningEndedRef = useRef(onListeningEnded);
  onListeningEndedRef.current = onListeningEnded;

  const onExamSubmittedRef = useRef(onExamSubmitted);
  onExamSubmittedRef.current = onExamSubmitted;

  // 1. Multi-Tab Lease Management & Heartbeat
  useEffect(() => {
    if (!session || !enableMultiTab) return;
    if (session.status === 'submitted') {
      setTabLeaseStatus('released');
      return;
    }

    const currentSessionId = session.sessionId;

    // Initial lease acquisition attempt
    const initialLease = acquireTabLease(currentSessionId, tabId);
    setTabLeaseStatus(initialLease.status);
    setConflictTabId(initialLease.conflictTabId ?? null);

    // Heartbeat interval to maintain lease alive
    const heartbeatTimer = setInterval(() => {
      if (sessionRef.current?.status === 'submitted') return;
      const renewRes = renewTabLease(currentSessionId, tabId);
      if (!renewRes.renewed) {
        // Lost lease ownership to another tab
        setTabLeaseStatus('read_only_conflict');
      }
    }, DEFAULT_HEARTBEAT_INTERVAL_MS);

    // Subscribe to cross-tab communication events
    const unsubscribeBus = subscribeToTabBus((msg) => {
      if (msg.sessionId !== currentSessionId) return;

      if (msg.tabId !== tabId) {
        if (msg.type === 'TAKEOVER' || msg.type === 'LEASE_ACQUIRED') {
          // Another tab acquired lease: demote this tab to read-only
          setTabLeaseStatus('read_only_conflict');
          setConflictTabId(msg.tabId);
        }
      }
    });

    return () => {
      clearInterval(heartbeatTimer);
      unsubscribeBus();
      releaseTabLease(currentSessionId, tabId);
    };
  }, [session?.sessionId, session?.status, enableMultiTab, tabId]);

  // Takeover handler for user clicking "Take Over" banner
  const takeoverLease = useCallback(() => {
    if (!sessionRef.current) return;
    const result = acquireTabLease(sessionRef.current.sessionId, tabId, Date.now(), { force: true });
    setTabLeaseStatus(result.status);
    setConflictTabId(null);
  }, [tabId]);

  // 2. Central Timer Tick, Background Recovery & Auto-Transition
  const performTimerTick = useCallback(() => {
    const curSession = sessionRef.current;
    if (!curSession || curSession.status === 'submitted') return;

    const now = Date.now();

    // Verify clock integrity (anti-tamper / system time rollback check)
    const clockCheck = verifyClockIntegrity(curSession, now);
    if (clockCheck.isSuspicious) {
      onSessionUpdateRef.current(clockCheck.updatedSession);
    }

    // Evaluate section timeout and automatic transitions
    const transitionRes = handleSectionTimeoutOrTransition(
      clockCheck.updatedSession,
      now,
      {
        onListeningEnded: () => {
          onListeningEndedRef.current?.();
        },
        onExamSubmitted: (reason) => {
          onExamSubmittedRef.current?.(reason);
        },
      }
    );

    if (transitionRes.session.status !== curSession.status) {
      onSessionUpdateRef.current(transitionRes.session);
    }

    // Update real-time UI snapshot
    const nextSnapshot = calculateTimerSnapshot(transitionRes.session, now);
    setSnapshot(nextSnapshot);
  }, []);

  // Interval timer tick (1 second)
  useEffect(() => {
    if (!session || session.status === 'submitted') {
      return;
    }

    // Immediate tick upon mount/session change
    performTimerTick();

    const intervalId = setInterval(performTimerTick, 1000);

    // Visibility & focus recovery for background tab throttling and sleep/wake
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        performTimerTick();
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
  }, [session?.status, session?.startedAt, session?.sectionStartedAt, performTimerTick]);

  // 3. Collision-Safe User Actions
  const safeSubmit = useCallback(
    (reason: ExamSubmitReason = 'user_completed'): ExamTransitionResult => {
      if (!sessionRef.current) {
        throw new Error('No active exam session to submit.');
      }
      const res = executeSafeExamSubmit(sessionRef.current, reason, Date.now());
      if (res.success) {
        onSessionUpdateRef.current(res.session);
        onExamSubmittedRef.current?.(reason);
      }
      return res;
    },
    []
  );

  const safeTransitionToReading = useCallback((): ExamTransitionResult => {
    if (!sessionRef.current) {
      throw new Error('No active exam session to transition.');
    }
    const res = executeSafeSectionTransition(sessionRef.current, Date.now(), {
      onListeningEnded: () => {
        onListeningEndedRef.current?.();
      },
    });
    if (res.success) {
      onSessionUpdateRef.current(res.session);
    }
    return res;
  }, []);

  return {
    snapshot,
    tabId,
    tabLeaseStatus,
    isConflict: tabLeaseStatus === 'read_only_conflict',
    conflictTabId,
    takeoverLease,
    safeSubmit,
    safeTransitionToReading,
    isUrgent: snapshot.isUrgent,
    formattedSectionTime: snapshot.formattedSectionTime,
    formattedOverallTime: snapshot.formattedOverallTime,
  };
}
