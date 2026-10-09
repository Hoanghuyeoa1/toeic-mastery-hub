/**
 * TOEIC Mastery Hub — Stable Listening Audio Engine Controller
 * Phase 6: Stable Audio Controller & Lifecycle Architecture
 *
 * Design Guarantees:
 * 1. Global Singleton Coordinator: At most ONE audio source plays at a time.
 * 2. Token-Based Concurrency Guard: Async callbacks check activeToken to discard stale events.
 * 3. Zero Memory Leaks: Explicit teardown of HTMLAudioElement, SpeechSynthesisUtterance, timers, and listeners.
 * 4. Mode-Based Replay Policy: Timed Mode strictly enforces 1-play limit; Practice Mode allows replays.
 * 5. Transparent Disclaimer: Clearly flags synthetic TTS playback vs official ETS audio.
 * 6. Sequential Queue: Segments in multi-speaker dialogue or option recitation play one by one.
 */

import {
  AudioTrackConfig,
  AudioPlayerState,
  AudioPlaybackStatus,
  AudioPlaybackSourceType,
  AudioErrorCode,
  AudioControllerOptions,
  AudioScriptSegment,
} from '../types/listeningAudio';
import { voiceManager } from './voiceManager';

/**
 * Global coordinator ensuring no audio overlapping across the application.
 */
class GlobalPlaybackCoordinator {
  private activeController: ListeningAudioController | null = null;

  claim(controller: ListeningAudioController): void {
    if (this.activeController && this.activeController !== controller) {
      try {
        this.activeController.stop();
      } catch {
        // Safe catch
      }
    }
    this.activeController = controller;
  }

  release(controller: ListeningAudioController): void {
    if (this.activeController === controller) {
      this.activeController = null;
    }
  }
}

export const audioPlaybackCoordinator = new GlobalPlaybackCoordinator();

export type StateSubscriber = (state: AudioPlayerState) => void;

export class ListeningAudioController {
  private trackConfig: AudioTrackConfig;
  private options: AudioControllerOptions;

  // Concurrency token to ignore callbacks from previous playback runs
  private activeToken: number = 0;

  // Local Audio Element
  private audioElement: HTMLAudioElement | null = null;
  private audioListenersCleanup: (() => void) | null = null;

  // TTS State
  private pendingSegmentTimeoutId: any = null;
  private progressIntervalId: any = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  // Reactive State
  private state: AudioPlayerState;
  private subscribers: Set<StateSubscriber> = new Set();

  constructor(trackConfig: AudioTrackConfig, options: AudioControllerOptions = {}) {
    this.trackConfig = trackConfig;
    this.options = options;

    const isTimedMode = options.mode === 'timed';
    const maxReplays = options.maxReplays !== undefined
      ? options.maxReplays
      : isTimedMode && !options.allowReplayInTimed
      ? 1
      : null;

    const initialSourceType: AudioPlaybackSourceType = trackConfig.audioUrl
      ? 'local_audio'
      : trackConfig.segments.length > 0
      ? 'synthetic_tts'
      : 'none';

    this.state = {
      status: 'idle',
      sourceType: initialSourceType,
      currentTime: 0,
      duration: trackConfig.estimatedDurationSeconds || 0,
      progressRatio: 0,
      currentSegmentIndex: 0,
      activeSegment: null,
      activeSpeaker: null,
      activeChoiceKey: null,
      playCount: 0,
      maxReplays,
      canPlay: true,
      canReplay: true,
      canPause: false,
      canResume: false,
      errorMessage: null,
      errorCode: null,
      isSyntheticTTS: initialSourceType === 'synthetic_tts',
      playbackRate: options.playbackRate || 1.0,
      volume: options.volume !== undefined ? options.volume : 1.0,
      isMuted: false,
    };
  }

  // --- Public Getters ---
  getState(): AudioPlayerState {
    return { ...this.state };
  }

  subscribe(callback: StateSubscriber): () => void {
    this.subscribers.add(callback);
    callback(this.getState());
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private emitState(): void {
    const currentState = this.getState();
    this.subscribers.forEach((cb) => {
      try {
        cb(currentState);
      } catch (err) {
        console.error('AudioController subscriber error:', err);
      }
    });

    if (this.options.onStatusChange) {
      this.options.onStatusChange(currentState.status);
    }
  }

  private updateState(partial: Partial<AudioPlayerState>): void {
    const nextPlayCount = partial.playCount !== undefined ? partial.playCount : this.state.playCount;
    const maxReplays = partial.maxReplays !== undefined ? partial.maxReplays : this.state.maxReplays;
    const isExhausted = maxReplays !== null && nextPlayCount >= maxReplays;

    const nextStatus = partial.status || this.state.status;
    const canPlay = !isExhausted && (nextStatus === 'idle' || nextStatus === 'ended' || nextStatus === 'error');
    const canReplay = !isExhausted && (nextStatus === 'playing' || nextStatus === 'ended' || nextStatus === 'paused');
    const canPause = nextStatus === 'playing';
    const canResume = nextStatus === 'paused';

    this.state = {
      ...this.state,
      ...partial,
      canPlay,
      canReplay,
      canPause,
      canResume,
    };

    this.emitState();
  }

  // --- Track Configuration Updates ---
  updateTrackConfig(newConfig: AudioTrackConfig): void {
    this.stop();
    this.trackConfig = newConfig;

    const newSourceType: AudioPlaybackSourceType = newConfig.audioUrl
      ? 'local_audio'
      : newConfig.segments.length > 0
      ? 'synthetic_tts'
      : 'none';

    this.updateState({
      sourceType: newSourceType,
      isSyntheticTTS: newSourceType === 'synthetic_tts',
      duration: newConfig.estimatedDurationSeconds || 0,
      currentTime: 0,
      progressRatio: 0,
      currentSegmentIndex: 0,
      activeSegment: null,
      activeSpeaker: null,
      activeChoiceKey: null,
      errorMessage: null,
      errorCode: null,
      status: 'idle',
      // Note: playCount is preserved per track or can be reset externally
    });
  }

  // --- Main Controls ---
  async play(): Promise<{ success: boolean; errorCode?: AudioErrorCode }> {
    // 1. Check replay limit
    if (this.state.maxReplays !== null && this.state.playCount >= this.state.maxReplays) {
      this.updateState({
        status: 'error',
        errorCode: 'REPLAY_NOT_ALLOWED',
        errorMessage: `Chế độ đã đạt giới hạn ${this.state.maxReplays} lần nghe.`,
      });
      if (this.options.onError) {
        this.options.onError({
          code: 'REPLAY_NOT_ALLOWED',
          message: this.state.errorMessage!,
        });
      }
      return { success: false, errorCode: 'REPLAY_NOT_ALLOWED' };
    }

    // 2. Claim global audio coordinator (stops any previous audio anywhere in app)
    audioPlaybackCoordinator.claim(this);

    // 3. Increment token to invalidate any previous runs or stale callbacks
    const currentToken = ++this.activeToken;
    this.clearPendingTimers();

    // 4. Dispatch based on source
    if (this.trackConfig.audioUrl) {
      return this.playLocalAudio(currentToken);
    } else if (this.trackConfig.segments.length > 0) {
      return this.playSyntheticTTS(currentToken);
    } else {
      this.updateState({
        status: 'error',
        errorCode: 'NO_AUDIO_SOURCE',
        errorMessage: 'Không tìm thấy nguồn âm thanh hoặc kịch bản nghe cho câu hỏi này.',
      });
      if (this.options.onError) {
        this.options.onError({
          code: 'NO_AUDIO_SOURCE',
          message: this.state.errorMessage!,
        });
      }
      return { success: false, errorCode: 'NO_AUDIO_SOURCE' };
    }
  }

  replay(): Promise<{ success: boolean; errorCode?: AudioErrorCode }> {
    this.stop();
    return this.play();
  }

  pause(): void {
    if (this.state.status !== 'playing') return;

    if (this.state.sourceType === 'local_audio' && this.audioElement) {
      this.audioElement.pause();
      this.updateState({ status: 'paused' });
    } else if (this.state.sourceType === 'synthetic_tts') {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        this.updateState({ status: 'paused' });
      }
    }
  }

  resume(): void {
    if (this.state.status !== 'paused') return;

    if (this.state.sourceType === 'local_audio' && this.audioElement) {
      this.audioElement.play().catch((err) => {
        this.updateState({
          status: 'error',
          errorCode: 'AUDIO_LOAD_ERROR',
          errorMessage: err?.message || 'Không thể tiếp tục phát audio.',
        });
      });
      this.updateState({ status: 'playing' });
    } else if (this.state.sourceType === 'synthetic_tts') {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        this.updateState({ status: 'playing' });
      }
    }
  }

  stop(): void {
    this.activeToken++;
    this.clearPendingTimers();

    // Teardown local audio
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch {
        // Safe catch
      }
    }

    // Teardown TTS
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Safe catch
      }
    }
    if (this.currentUtterance) {
      this.currentUtterance.onend = null;
      this.currentUtterance.onerror = null;
      this.currentUtterance = null;
    }

    audioPlaybackCoordinator.release(this);

    this.updateState({
      status: 'idle',
      currentTime: 0,
      progressRatio: 0,
      currentSegmentIndex: 0,
      activeSegment: null,
      activeSpeaker: null,
      activeChoiceKey: null,
    });
  }

  // --- Volume and Speed Controls ---
  setVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    this.updateState({ volume: clamped, isMuted: clamped === 0 });
    if (this.audioElement) {
      this.audioElement.volume = clamped;
    }
  }

  setMuted(isMuted: boolean): void {
    this.updateState({ isMuted });
    if (this.audioElement) {
      this.audioElement.muted = isMuted;
    }
  }

  setPlaybackRate(rate: number): void {
    const clamped = Math.max(0.5, Math.min(2.0, rate));
    this.updateState({ playbackRate: clamped });
    if (this.audioElement) {
      this.audioElement.playbackRate = clamped;
    }
  }

  // --- Local Audio Playback ---
  private async playLocalAudio(currentToken: number): Promise<{ success: boolean; errorCode?: AudioErrorCode }> {
    this.updateState({
      status: 'loading',
      errorMessage: null,
      errorCode: null,
    });

    this.cleanupAudioElement();

    try {
      const audio = new Audio();
      this.audioElement = audio;
      audio.preload = 'auto';
      audio.src = this.trackConfig.audioUrl!;
      audio.playbackRate = this.state.playbackRate;
      audio.volume = this.state.isMuted ? 0 : this.state.volume;
      audio.muted = this.state.isMuted;

      const onCanPlay = () => {
        if (currentToken !== this.activeToken) return;
        this.updateState({
          duration: audio.duration || this.trackConfig.estimatedDurationSeconds || 0,
        });
      };

      const onTimeUpdate = () => {
        if (currentToken !== this.activeToken) return;
        const cur = audio.currentTime;
        const dur = audio.duration || this.state.duration || 1;
        this.updateState({
          currentTime: cur,
          progressRatio: Math.min(1, cur / dur),
        });
        if (this.options.onProgress) {
          this.options.onProgress(cur, dur);
        }
      };

      const onEnded = () => {
        if (currentToken !== this.activeToken) return;
        this.handlePlaybackFinished(currentToken);
      };

      const onError = () => {
        if (currentToken !== this.activeToken) return;
        this.updateState({
          status: 'error',
          errorCode: 'AUDIO_LOAD_ERROR',
          errorMessage: 'Lỗi tải tệp âm thanh từ máy chủ/đường dẫn nội bộ.',
        });
        if (this.options.onError) {
          this.options.onError({
            code: 'AUDIO_LOAD_ERROR',
            message: this.state.errorMessage!,
          });
        }
      };

      audio.addEventListener('canplay', onCanPlay);
      audio.addEventListener('timeupdate', onTimeUpdate);
      audio.addEventListener('ended', onEnded);
      audio.addEventListener('error', onError);

      this.audioListenersCleanup = () => {
        audio.removeEventListener('canplay', onCanPlay);
        audio.removeEventListener('timeupdate', onTimeUpdate);
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('error', onError);
      };

      await audio.play();
      if (currentToken !== this.activeToken) {
        audio.pause();
        return { success: false, errorCode: 'ABORTED' };
      }

      this.updateState({ status: 'playing' });
      return { success: true };
    } catch (err: any) {
      if (currentToken !== this.activeToken) return { success: false, errorCode: 'ABORTED' };

      const isAutoplayBlocked = err?.name === 'NotAllowedError';
      const errorCode: AudioErrorCode = isAutoplayBlocked ? 'AUTOPLAY_BLOCKED' : 'AUDIO_LOAD_ERROR';
      const errorMessage = isAutoplayBlocked
        ? 'Trình duyệt chặn tự động phát. Vui lòng bấm vào nút Nghe để kích hoạt.'
        : (err?.message || 'Không thể phát file âm thanh.');

      this.updateState({
        status: 'error',
        errorCode,
        errorMessage,
      });

      if (this.options.onError) {
        this.options.onError({ code: errorCode, message: errorMessage });
      }

      return { success: false, errorCode };
    }
  }

  // --- Synthetic TTS Playback ---
  private async playSyntheticTTS(currentToken: number): Promise<{ success: boolean; errorCode?: AudioErrorCode }> {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.updateState({
        status: 'error',
        errorCode: 'TTS_NOT_SUPPORTED',
        errorMessage: 'Trình duyệt hiện tại không hỗ trợ Web Speech API và không có file audio thay thế.',
      });
      if (this.options.onError) {
        this.options.onError({
          code: 'TTS_NOT_SUPPORTED',
          message: this.state.errorMessage!,
        });
      }
      return { success: false, errorCode: 'TTS_NOT_SUPPORTED' };
    }

    // Cancel any ongoing synth
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Safe catch
    }

    this.updateState({
      status: 'playing',
      errorMessage: null,
      errorCode: null,
      currentTime: 0,
      progressRatio: 0,
      currentSegmentIndex: 0,
    });

    // Start progress estimation ticker
    this.startTTSProgressTicker(currentToken);

    // Play first segment
    this.playTTSSegment(0, currentToken);
    return { success: true };
  }

  private playTTSSegment(segmentIndex: number, currentToken: number): void {
    if (currentToken !== this.activeToken) return;

    const segments = this.trackConfig.segments;
    if (segmentIndex >= segments.length) {
      // All segments completed
      this.handlePlaybackFinished(currentToken);
      return;
    }

    const segment = segments[segmentIndex];
    const totalSegments = segments.length;

    // Pick optimal English voice
    const voice = voiceManager.findBestEnglishVoice({
      accent: segment.accentHint || this.trackConfig.preferredAccent,
      genderHint: segment.genderHint || this.trackConfig.preferredGender,
    });

    this.updateState({
      currentSegmentIndex: segmentIndex,
      activeSegment: segment,
      activeSpeaker: segment.speaker,
      activeChoiceKey: segment.choiceKey || null,
      progressRatio: Math.min(0.99, segmentIndex / totalSegments),
    });

    if (this.options.onSegmentChange) {
      this.options.onSegmentChange(segmentIndex, segment);
    }

    const utterance = new SpeechSynthesisUtterance(segment.text);
    this.currentUtterance = utterance;

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = 'en-US';
    }

    utterance.rate = this.state.playbackRate;
    utterance.volume = this.state.isMuted ? 0 : this.state.volume;

    utterance.onend = () => {
      if (currentToken !== this.activeToken) return;
      this.currentUtterance = null;

      // If this was the last segment, finish immediately
      if (segmentIndex + 1 >= segments.length) {
        this.handlePlaybackFinished(currentToken);
        return;
      }

      // Small natural pause before next turn/statement
      const pauseDuration = segment.isPrompt ? 600 : 400;
      this.pendingSegmentTimeoutId = setTimeout(() => {
        if (currentToken !== this.activeToken) return;
        this.playTTSSegment(segmentIndex + 1, currentToken);
      }, pauseDuration);
    };

    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      if (currentToken !== this.activeToken) return;
      this.currentUtterance = null;

      // Ignore intentional cancellations
      if (event.error === 'interrupted' || event.error === 'canceled') {
        return;
      }

      this.clearPendingTimers();
      this.updateState({
        status: 'error',
        errorCode: 'TTS_SYNTHESIS_ERROR',
        errorMessage: `Lỗi phát âm Web Speech API (${event.error || 'unknown'}).`,
      });

      if (this.options.onError) {
        this.options.onError({
          code: 'TTS_SYNTHESIS_ERROR',
          message: this.state.errorMessage!,
        });
      }
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err: any) {
      if (currentToken !== this.activeToken) return;
      this.updateState({
        status: 'error',
        errorCode: 'TTS_SYNTHESIS_ERROR',
        errorMessage: err?.message || 'Không thể bắt đầu Web Speech synthesis.',
      });
    }
  }

  private startTTSProgressTicker(currentToken: number): void {
    if (this.progressIntervalId) clearInterval(this.progressIntervalId);

    const startTime = Date.now();
    const estDuration = Math.max(8, this.state.duration || this.trackConfig.estimatedDurationSeconds || 16);

    this.progressIntervalId = setInterval(() => {
      if (currentToken !== this.activeToken || this.state.status !== 'playing') {
        clearInterval(this.progressIntervalId);
        this.progressIntervalId = null;
        return;
      }

      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(0.98, elapsed / estDuration);

      this.updateState({
        currentTime: elapsed,
        progressRatio: progress,
      });

      if (this.options.onProgress) {
        this.options.onProgress(elapsed, estDuration);
      }
    }, 200);
  }

  private handlePlaybackFinished(currentToken: number): void {
    if (currentToken !== this.activeToken) return;

    this.clearPendingTimers();
    audioPlaybackCoordinator.release(this);

    const newPlayCount = this.state.playCount + 1;
    const finalDuration = this.state.duration || this.trackConfig.estimatedDurationSeconds;

    this.updateState({
      status: 'ended',
      currentTime: finalDuration,
      progressRatio: 1.0,
      playCount: newPlayCount,
      activeSegment: null,
      activeSpeaker: null,
      activeChoiceKey: null,
    });

    if (this.options.onEnded) {
      this.options.onEnded();
    }
  }

  private clearPendingTimers(): void {
    if (this.pendingSegmentTimeoutId) {
      clearTimeout(this.pendingSegmentTimeoutId);
      this.pendingSegmentTimeoutId = null;
    }
    if (this.progressIntervalId) {
      clearInterval(this.progressIntervalId);
      this.progressIntervalId = null;
    }
  }

  private cleanupAudioElement(): void {
    if (this.audioListenersCleanup) {
      this.audioListenersCleanup();
      this.audioListenersCleanup = null;
    }
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.audioElement.src = '';
        this.audioElement.load();
      } catch {
        // Safe catch
      }
      this.audioElement = null;
    }
  }

  // --- Strict Lifecycle Teardown ---
  destroy(): void {
    this.stop();
    this.cleanupAudioElement();
    audioPlaybackCoordinator.release(this);
    this.subscribers.clear();
  }
}
