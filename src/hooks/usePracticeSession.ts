/**
 * TOEIC Mastery Hub — Practice Session Hook (Phase 5)
 *
 * React hook managing active Practice Session lifecycle:
 * - Real wall-clock countdown timer with background tab and F5 resilience
 * - Auto-submit exactly once on deadline expiration
 * - Double-submit protection and answer lock enforcement
 * - Persistence synchronization with overwrite and quota safeguards
 * - React StrictMode double-mount resilience
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  PracticeSessionData,
  PracticeSessionInitParams,
  PracticeSubmitReason,
  PracticeAssistanceType,
} from '../types/practiceSession';
import { QuestionBankManifest, StandardChoiceKey } from '../types/questionBank';
import { FULL_QUESTION_BANK_MANIFEST } from '../data/questionBank';
import {
  createPracticeSession,
  setSessionAnswer,
  toggleSessionMark,
  navigateSession,
  recordAssistance,
  submitSession,
  abandonSession,
  getSessionRemainingSeconds,
  isSessionExpired,
} from '../utils/practiceSessionEngine';
import {
  saveActiveSession,
  loadActiveSession,
  startNewActiveSession,
  archiveCompletedSession,
  clearActiveSession,
  checkHasUnfinishedActiveSession,
} from '../utils/practiceSessionStorage';

export interface UsePracticeSessionOptions {
  bankManifest?: QuestionBankManifest;
  autoResume?: boolean;
  initialSession?: PracticeSessionData;
  onSessionCompleted?: (session: PracticeSessionData) => void;
  onAutoTimeout?: (session: PracticeSessionData) => void;
}

export interface UsePracticeSessionReturn {
  session: PracticeSessionData | null;
  remainingSeconds: number | null;
  isExpired: boolean;
  isSubmitted: boolean;
  hasUnfinishedSession: boolean;
  storageError: string | null;
  currentQuestionId: string | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredCount: number;
  unansweredCount: number;
  markedCount: number;
  percentageComplete: number;
  isAnswersLocked: boolean;
  // Actions
  startSession: (params: PracticeSessionInitParams, forceReplace?: boolean) => boolean;
  selectAnswer: (questionId: string, choice: StandardChoiceKey | null) => boolean;
  toggleMark: (questionId: string) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  previousQuestion: () => void;
  recordHelp: (questionId: string, type: PracticeAssistanceType) => void;
  submit: (reason?: PracticeSubmitReason) => void;
  abandon: () => void;
  resumeSession: () => void;
  dismissStorageError: () => void;
}

export function usePracticeSession(
  options: UsePracticeSessionOptions = {}
): UsePracticeSessionReturn {
  const {
    bankManifest = FULL_QUESTION_BANK_MANIFEST,
    autoResume = true,
    initialSession,
    onSessionCompleted,
    onAutoTimeout,
  } = options;

  const [session, setSession] = useState<PracticeSessionData | null>(initialSession ?? null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(
    initialSession && initialSession.mode === 'timed'
      ? getSessionRemainingSeconds(initialSession)
      : null
  );
  const [storageError, setStorageError] = useState<string | null>(null);
  const [hasUnfinishedSession, setHasUnfinishedSession] = useState<boolean>(false);

  // Guard against double submission across simultaneous timeout and manual clicks
  const isSubmittingRef = useRef<boolean>(false);
  const autoTimeoutHandledRef = useRef<boolean>(false);

  // Inspect storage for existing unfinished sessions on mount
  useEffect(() => {
    setHasUnfinishedSession(checkHasUnfinishedActiveSession());
  }, []);

  // Helper to sync state and save to storage
  const updateAndPersist = useCallback((updated: PracticeSessionData) => {
    setSession(updated);
    if (updated.status === 'active') {
      const res = saveActiveSession(updated);
      if (!res.success && res.error) {
        setStorageError(res.error);
      }
    } else {
      archiveCompletedSession(updated);
      clearActiveSession();
      setHasUnfinishedSession(false);
    }
  }, []);

  // Load and resume session on mount
  const resumeSession = useCallback(() => {
    const res = loadActiveSession(bankManifest);
    if (res.success && res.data) {
      setSession(res.data);
      if (res.data.status === 'active') {
        setHasUnfinishedSession(true);
        if (res.data.mode === 'timed') {
          setRemainingSeconds(getSessionRemainingSeconds(res.data));
        }
      } else {
        setHasUnfinishedSession(false);
        if (res.data.status === 'expired') {
          onAutoTimeout?.(res.data);
        }
        onSessionCompleted?.(res.data);
      }
    } else if (res.error) {
      setStorageError(res.error);
      setHasUnfinishedSession(false);
    }
  }, [bankManifest, onAutoTimeout, onSessionCompleted]);

  useEffect(() => {
    if (autoResume && !initialSession) {
      resumeSession();
    }
  }, [autoResume, initialSession, resumeSession]);

  // Start a new session with overwrite check
  const startSession = useCallback(
    (params: PracticeSessionInitParams, forceReplace = false): boolean => {
      try {
        const newSession = createPracticeSession(params);
        const storageResult = startNewActiveSession(newSession, forceReplace);

        if (!storageResult.success) {
          setStorageError(storageResult.error ?? 'Failed to start session');
          return false;
        }

        isSubmittingRef.current = false;
        autoTimeoutHandledRef.current = false;
        setSession(newSession);
        setHasUnfinishedSession(true);
        setStorageError(null);

        if (newSession.mode === 'timed') {
          setRemainingSeconds(getSessionRemainingSeconds(newSession));
        } else {
          setRemainingSeconds(null);
        }

        return true;
      } catch (err) {
        setStorageError(err instanceof Error ? err.message : String(err));
        return false;
      }
    },
    []
  );

  // Submit session
  const submit = useCallback(
    (reason: PracticeSubmitReason = 'user') => {
      if (!session || session.status !== 'active') return;
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;

      const { session: finalized, alreadySubmitted } = submitSession(session, reason);
      if (alreadySubmitted) return;

      updateAndPersist(finalized);

      if (reason === 'auto_timeout') {
        onAutoTimeout?.(finalized);
      }
      onSessionCompleted?.(finalized);
    },
    [session, updateAndPersist, onAutoTimeout, onSessionCompleted]
  );

  // Wall-clock countdown timer with background tab and F5 resilience
  useEffect(() => {
    if (!session || session.status !== 'active' || session.mode !== 'timed') {
      return;
    }

    const checkTimer = () => {
      const remaining = getSessionRemainingSeconds(session);
      setRemainingSeconds(remaining);

      if (isSessionExpired(session) && !autoTimeoutHandledRef.current) {
        autoTimeoutHandledRef.current = true;
        submit('auto_timeout');
      }
    };

    // Run initial check immediately
    checkTimer();

    // Regular interval
    const intervalId = window.setInterval(checkTimer, 500);

    // Event listeners to handle tab switching / returning from sleep
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkTimer();
      }
    };

    const handleWindowFocus = () => {
      checkTimer();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [session, submit]);

  // Select/update answer
  const selectAnswer = useCallback(
    (questionId: string, choice: StandardChoiceKey | null): boolean => {
      if (!session || session.status !== 'active') return false;

      const result = setSessionAnswer(session, questionId, choice);
      if (!result.success) {
        setStorageError(result.error ?? 'Answer rejected');
        return false;
      }

      updateAndPersist(result.session);
      return true;
    },
    [session, updateAndPersist]
  );

  // Toggle mark for review
  const toggleMark = useCallback(
    (questionId: string) => {
      if (!session || session.status !== 'active') return;
      const updated = toggleSessionMark(session, questionId);
      updateAndPersist(updated);
    },
    [session, updateAndPersist]
  );

  // Navigation
  const goToQuestion = useCallback(
    (index: number) => {
      if (!session) return;
      const updated = navigateSession(session, index);
      updateAndPersist(updated);
    },
    [session, updateAndPersist]
  );

  const nextQuestion = useCallback(() => {
    if (!session) return;
    const updated = navigateSession(session, session.currentQuestionIndex + 1);
    updateAndPersist(updated);
  }, [session, updateAndPersist]);

  const prevQuestion = useCallback(() => {
    if (!session) return;
    const updated = navigateSession(session, session.currentQuestionIndex - 1);
    updateAndPersist(updated);
  }, [session, updateAndPersist]);

  // Record help / assistance (Practice Mode)
  const recordHelp = useCallback(
    (questionId: string, type: PracticeAssistanceType) => {
      if (!session || session.status !== 'active') return;
      const updated = recordAssistance(session, questionId, type);
      updateAndPersist(updated);
    },
    [session, updateAndPersist]
  );

  // Abandon session
  const abandon = useCallback(() => {
    if (!session || session.status !== 'active') return;
    const abandoned = abandonSession(session);
    updateAndPersist(abandoned);
  }, [session, updateAndPersist]);

  const dismissStorageError = useCallback(() => {
    setStorageError(null);
  }, []);

  // Derived progress statistics
  const {
    currentQuestionId,
    totalQuestions,
    answeredCount,
    unansweredCount,
    markedCount,
    percentageComplete,
  } = useMemo(() => {
    if (!session) {
      return {
        currentQuestionId: null,
        totalQuestions: 0,
        answeredCount: 0,
        unansweredCount: 0,
        markedCount: 0,
        percentageComplete: 0,
      };
    }

    const total = session.questionIds.length;
    let answered = 0;
    let marked = 0;

    for (const qId of session.questionIds) {
      if (session.answers[qId] !== null) {
        answered++;
      }
      if (session.markedForReview[qId] === true) {
        marked++;
      }
    }

    const pct = total > 0 ? Math.round((answered / total) * 100) : 0;
    const currId = session.questionIds[session.currentQuestionIndex] ?? null;

    return {
      currentQuestionId: currId,
      totalQuestions: total,
      answeredCount: answered,
      unansweredCount: total - answered,
      markedCount: marked,
      percentageComplete: pct,
    };
  }, [session]);

  const isExpired = session?.status === 'expired' || (remainingSeconds !== null && remainingSeconds <= 0);
  const isAnswersLocked = session !== null && session.status !== 'active';
  const isSubmitted = session !== null && (session.status === 'submitted' || session.status === 'expired' || session.status === 'abandoned');

  return {
    session,
    remainingSeconds,
    isExpired,
    isSubmitted,
    hasUnfinishedSession,
    storageError,
    currentQuestionId,
    currentQuestionIndex: session?.currentQuestionIndex ?? 0,
    totalQuestions,
    answeredCount,
    unansweredCount,
    markedCount,
    percentageComplete,
    isAnswersLocked,
    // Actions
    startSession,
    selectAnswer,
    toggleMark,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    previousQuestion: prevQuestion,
    recordHelp,
    submit,
    abandon,
    resumeSession,
    dismissStorageError,
  };
}
