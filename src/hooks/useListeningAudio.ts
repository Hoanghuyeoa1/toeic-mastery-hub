/**
 * TOEIC Mastery Hub — React Hook for Listening Audio
 * Phase 6: Stable Audio Controller & Lifecycle Architecture
 *
 * Provides reactive bindings for ListeningAudioController:
 * - Safe lifecycle integration with React 19 / StrictMode.
 * - Automatic teardown on unmount or question/group transition.
 * - Stable action callbacks preventing unnecessary re-renders.
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  AudioTrackConfig,
  AudioPlayerState,
  AudioControllerOptions,
  AudioErrorCode,
} from '../types/listeningAudio';
import { ListeningAudioController } from '../utils/listeningAudioController';

export interface UseListeningAudioReturn extends AudioPlayerState {
  play: () => Promise<{ success: boolean; errorCode?: AudioErrorCode }>;
  replay: () => Promise<{ success: boolean; errorCode?: AudioErrorCode }>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  setVolume: (volume: number) => void;
  setMuted: (isMuted: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  controller: ListeningAudioController | null;
}

export function useListeningAudio(
  trackConfig: AudioTrackConfig,
  options: AudioControllerOptions = {}
): UseListeningAudioReturn {
  const controllerRef = useRef<ListeningAudioController | null>(null);

  // Keep options ref updated without triggering re-initialization
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Track identifier to detect track changes
  const trackIdentifier = useMemo(() => {
    return trackConfig.questionId || trackConfig.groupId || `${trackConfig.partNum}-${trackConfig.fullScript?.slice(0, 20)}`;
  }, [trackConfig.questionId, trackConfig.groupId, trackConfig.partNum, trackConfig.fullScript]);

  // Initial state lazy factory
  const [playerState, setPlayerState] = useState<AudioPlayerState>(() => {
    const tempController = new ListeningAudioController(trackConfig, options);
    const initial = tempController.getState();
    tempController.destroy();
    return initial;
  });

  // Manage controller lifecycle
  useEffect(() => {
    // Instantiate controller
    const controller = new ListeningAudioController(trackConfig, {
      ...optionsRef.current,
      onStatusChange: (status) => {
        optionsRef.current.onStatusChange?.(status);
      },
      onProgress: (cur, dur) => {
        optionsRef.current.onProgress?.(cur, dur);
      },
      onSegmentChange: (idx, seg) => {
        optionsRef.current.onSegmentChange?.(idx, seg);
      },
      onEnded: () => {
        optionsRef.current.onEnded?.();
      },
      onError: (err) => {
        optionsRef.current.onError?.(err);
      },
    });

    controllerRef.current = controller;

    // Subscribe to state updates
    const unsubscribe = controller.subscribe((state) => {
      setPlayerState(state);
    });

    return () => {
      unsubscribe();
      controller.destroy();
      controllerRef.current = null;
    };
  }, [trackIdentifier]); // Re-create on track switch to guarantee fresh lifecycle

  // Action callbacks with controller safety
  const play = useCallback(async () => {
    if (!controllerRef.current) return { success: false, errorCode: 'ABORTED' as AudioErrorCode };
    return controllerRef.current.play();
  }, []);

  const replay = useCallback(async () => {
    if (!controllerRef.current) return { success: false, errorCode: 'ABORTED' as AudioErrorCode };
    return controllerRef.current.replay();
  }, []);

  const stop = useCallback(() => {
    controllerRef.current?.stop();
  }, []);

  const pause = useCallback(() => {
    controllerRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    controllerRef.current?.resume();
  }, []);

  const setVolume = useCallback((volume: number) => {
    controllerRef.current?.setVolume(volume);
  }, []);

  const setMuted = useCallback((isMuted: boolean) => {
    controllerRef.current?.setMuted(isMuted);
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    controllerRef.current?.setPlaybackRate(rate);
  }, []);

  return {
    ...playerState,
    play,
    replay,
    stop,
    pause,
    resume,
    setVolume,
    setMuted,
    setPlaybackRate,
    controller: controllerRef.current,
  };
}
