/**
 * TOEIC Mastery Hub — React Hook for Strict Listening Audio Engine (Phase 12)
 *
 * Provides reactive bindings for Full Mock Exam audio coordination:
 * - Safe mounting & unmounting under React 19 StrictMode (no duplicate AudioElements).
 * - Automatic teardown on component unmount, section transition, or exam submission.
 * - Reactive state for UI indicators (current question, part, progress, status).
 * - Enforces Strict Mode restrictions (no seek, no replay, locked rate).
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { ExamForm, ExamSession } from '../types/mockExam';
import {
  ExamAudioEngineState,
  ExamAudioEngineOptions,
  ExamAudioMode,
} from '../types/examAudio';
import { StrictListeningAudioEngine } from '../utils/strictListeningEngine';

export interface UseStrictListeningAudioOptions extends ExamAudioEngineOptions {
  autoStartOnMount?: boolean;
}

export interface UseStrictListeningAudioReturn {
  state: ExamAudioEngineState;
  startPlayback: () => Promise<void>;
  stopPlayback: () => void;
  pausePlayback: () => void;
  syncUserNavigatedQuestion: (questionNumber: number) => void;
  engine: StrictListeningAudioEngine | null;
}

export function useStrictListeningAudio(
  examForm: ExamForm | null | undefined,
  session: ExamSession | null | undefined,
  options: UseStrictListeningAudioOptions = {}
): UseStrictListeningAudioReturn {
  const engineRef = useRef<StrictListeningAudioEngine | null>(null);

  const [state, setState] = useState<ExamAudioEngineState>(() => {
    const isStrict = session?.mode === 'strict';
    const isStrictCertified =
      examForm?.media?.readinessStatus === 'strict-ready' &&
      examForm?.media?.strictLocked === false;

    return {
      status: 'idle',
      mode: session?.mode ?? 'simulation',
      isSimulation: session?.mode !== 'strict',
      isStrictCertified: isStrict && isStrictCertified,
      currentQueueIndex: 0,
      totalQueueItems: 0,
      currentItem: null,
      currentPart: 1,
      currentQuestionNumber: 1,
      currentTime: 0,
      duration: 0,
      progressRatio: 0,
      playbackRate: 1.0,
      volume: options.volume ?? 1.0,
      isMuted: false,
      canSeek: false,
      canReplay: false,
      canPause: !isStrict,
      errorMessage: null,
      errorCode: null,
      isAwaitingUserGesture: false,
      timelineAbnormal: session?.integrityFlags.timelineAbnormal ?? false,
      tamperReason: session?.integrityFlags.tamperReason,
    };
  });

  // Track dependencies via ref to prevent stale closures
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!examForm || !session) {
      return;
    }

    // Only instantiate if session is in 'listening' or 'ready' status
    if (session.status !== 'listening' && session.status !== 'ready') {
      return;
    }

    let engineInstance: StrictListeningAudioEngine | null = null;

    try {
      engineInstance = new StrictListeningAudioEngine(examForm, session, {
        mode: optionsRef.current.mode ?? session.mode,
        volume: optionsRef.current.volume,
        onStateChange: (nextState) => {
          setState(nextState);
          optionsRef.current.onStateChange?.(nextState);
        },
        onQuestionSync: optionsRef.current.onQuestionSync,
        onItemTransition: optionsRef.current.onItemTransition,
        onSectionEnded: optionsRef.current.onSectionEnded,
        onError: optionsRef.current.onError,
      });

      engineRef.current = engineInstance;
      setState(engineInstance.getState());

      if (optionsRef.current.autoStartOnMount && session.status === 'listening') {
        engineInstance.startPlayback().catch(() => {
          // Autoplay block handled by engine state
        });
      }
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        status: 'error',
        errorCode: 'STRICT_MODE_LOCKED',
        errorMessage: err?.message || 'Failed to initialize listening engine.',
      }));
    }

    return () => {
      if (engineInstance) {
        engineInstance.dispose();
      }
      engineRef.current = null;
    };
  }, [examForm?.id, session?.sessionId, session?.mode]);

  // Teardown listening playback immediately if session transitions away from 'listening'
  useEffect(() => {
    if (session?.status && session.status !== 'listening' && session.status !== 'ready') {
      if (engineRef.current) {
        engineRef.current.onListeningSectionExpired();
      }
    }
  }, [session?.status]);

  const startPlayback = useCallback(async () => {
    if (engineRef.current) {
      await engineRef.current.startPlayback();
    }
  }, []);

  const stopPlayback = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.stop();
    }
  }, []);

  const pausePlayback = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.pause();
    }
  }, []);

  const syncUserNavigatedQuestion = useCallback((questionNumber: number) => {
    if (engineRef.current) {
      engineRef.current.syncUserNavigatedQuestion(questionNumber);
    }
  }, []);

  return {
    state,
    startPlayback,
    stopPlayback,
    pausePlayback,
    syncUserNavigatedQuestion,
    engine: engineRef.current,
  };
}
