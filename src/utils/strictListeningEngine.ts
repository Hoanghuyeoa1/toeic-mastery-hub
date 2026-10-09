/**
 * TOEIC Mastery Hub — Exam Strict Listening Audio Engine (Phase 12)
 *
 * Implements strict, resilient, zero-leak listening playback for Full-Length Mock Exams:
 * - Strict Sequence: Fixed order Part 1 -> Part 2 -> Part 3 -> Part 4 (58 total units).
 * - Anti-Tampering: No seeking, no replaying, locked 1.0x playback speed, no transcript leakage.
 * - Navigation Isolation: Answer sheet navigation never skips ahead or replays past audio.
 * - Strict Readiness Guard: Blocks Strict Mode if ExamForm lacks certified studio audio.
 * - Simulation Fallback: Transparent Web Speech API TTS simulation mode for learning only.
 * - Lifecycle Safety: Autoplay handling, single AudioElement, no keep-alive loops, token-guarded async events.
 * - Recovery Integrity: Records checkpoints; flags timelineAbnormal on Strict interruption.
 */

import {
  ExamForm,
  ExamSession,
  ExamPlaybackCheckpoint,
} from '../types/mockExam';
import {
  ExamAudioEngineState,
  ExamAudioEngineOptions,
  ExamAudioQueueItem,
  ExamAudioItemType,
  ExamAudioMode,
  ExamAudioRecoveryEvaluation,
} from '../types/examAudio';
import { AudioScriptSegment } from '../types/listeningAudio';
import {
  QuestionBankLookupInterface,
  defaultLookup,
} from './examBlueprintValidator';
import {
  ETS_PART_DIRECTIONS_ALLOWANCE_SECONDS,
  ETS_PART1_RESPONSE_PAUSE_SECONDS,
  ETS_PART2_RESPONSE_PAUSE_SECONDS,
  ETS_GROUP_QUESTION_PAUSE_SECONDS,
} from './mediaReadiness';
import {
  buildAudioTrackConfigFromQuestion,
  buildAudioTrackConfigFromGroup,
  chunkSentenceText,
} from './audioScriptParser';
import { audioPlaybackCoordinator } from './listeningAudioController';
import { voiceManager } from './voiceManager';

// ============================================================================
// ETS OFFICIAL DIRECTIONS SCRIPTS
// ============================================================================

export const ETS_PART1_DIRECTIONS_TEXT =
  'Part 1: Photographs. Directions: For each question in this part, you will hear four statements about a picture. When you hear the statements, you must select the one statement that best describes what you see in the picture. The statements will not be shown on your screen and will be spoken only one time.';

export const ETS_PART2_DIRECTIONS_TEXT =
  'Part 2: Question-Response. Directions: You will hear a question or statement and three responses spoken in English. They will not be printed on your screen and will be spoken only one time. Select the best response to the question or statement.';

export const ETS_PART3_DIRECTIONS_TEXT =
  'Part 3: Conversations. Directions: You will hear some conversations between two or more people. You will be asked to answer three questions about what the speakers say in each conversation. The conversations will not be printed on your screen and will be spoken only one time.';

export const ETS_PART4_DIRECTIONS_TEXT =
  'Part 4: Short Talks. Directions: You will hear some talks given by a single speaker. You will be asked to answer three questions about what the speaker says in each talk. The talks will not be printed on your screen and will be spoken only one time.';

// ============================================================================
// 1. QUEUE COMPILER
// ============================================================================

/**
 * Compiles an official linear 58-item audio queue for the Listening section (100 questions).
 * Sequence:
 * 1. Part 1 Directions (50s)
 * 2. 6 Photographs questions (Questions 1 - 6)
 * 3. Part 2 Directions (50s)
 * 4. 25 Question-Response questions (Questions 7 - 31)
 * 5. Part 3 Directions (50s)
 * 6. 13 Conversation groups (Questions 32 - 70)
 * 7. Part 4 Directions (50s)
 * 8. 10 Short Talk groups (Questions 71 - 100)
 */
export function compileListeningAudioQueue(
  examForm: ExamForm,
  lookup: QuestionBankLookupInterface = defaultLookup
): ExamAudioQueueItem[] {
  const queue: ExamAudioQueueItem[] = [];

  // Helper to build directions queue item
  const makeDirectionsItem = (
    id: string,
    partNum: 1 | 2 | 3 | 4,
    title: string,
    text: string,
    startQ: number,
    endQ: number
  ): ExamAudioQueueItem => {
    const chunks = chunkSentenceText(text);
    const segments: AudioScriptSegment[] = chunks.map((chunk, idx) => ({
      id: `${id}-seg-${idx}`,
      order: idx,
      speaker: 'Narrator',
      text: chunk,
      genderHint: 'male',
      accentHint: 'US',
    }));

    return {
      id,
      partNum,
      itemType: 'part_directions',
      title,
      startQuestionNumber: startQ,
      endQuestionNumber: endQ,
      segments,
      estimatedDurationSeconds: ETS_PART_DIRECTIONS_ALLOWANCE_SECONDS,
      pauseAfterSeconds: 3.0,
      isDirections: true,
    };
  };

  // --- PART 1: PHOTOGRAPHS (Questions 1 to 6) ---
  queue.push(
    makeDirectionsItem(
      'p1-directions',
      1,
      'Part 1 Directions',
      ETS_PART1_DIRECTIONS_TEXT,
      1,
      6
    )
  );

  const p1Questions = examForm.questions.slice(0, 6);
  p1Questions.forEach((ref) => {
    const q = lookup.getQuestion(ref.questionId);
    const trackConfig = q ? buildAudioTrackConfigFromQuestion(q) : null;
    const duration = trackConfig?.estimatedDurationSeconds || 16.0;

    queue.push({
      id: `p1-q-${ref.globalQuestionNumber}`,
      partNum: 1,
      itemType: 'part1_question',
      title: `Question ${ref.globalQuestionNumber}`,
      startQuestionNumber: ref.globalQuestionNumber,
      endQuestionNumber: ref.globalQuestionNumber,
      entityId: ref.questionId,
      audioUrl: trackConfig?.audioUrl,
      segments: trackConfig?.segments || [],
      estimatedDurationSeconds: duration,
      pauseAfterSeconds: ETS_PART1_RESPONSE_PAUSE_SECONDS,
      isDirections: false,
    });
  });

  // --- PART 2: QUESTION-RESPONSE (Questions 7 to 31) ---
  queue.push(
    makeDirectionsItem(
      'p2-directions',
      2,
      'Part 2 Directions',
      ETS_PART2_DIRECTIONS_TEXT,
      7,
      31
    )
  );

  const p2Questions = examForm.questions.slice(6, 31);
  p2Questions.forEach((ref) => {
    const q = lookup.getQuestion(ref.questionId);
    const trackConfig = q ? buildAudioTrackConfigFromQuestion(q) : null;
    const duration = trackConfig?.estimatedDurationSeconds || 14.0;

    queue.push({
      id: `p2-q-${ref.globalQuestionNumber}`,
      partNum: 2,
      itemType: 'part2_question',
      title: `Question ${ref.globalQuestionNumber}`,
      startQuestionNumber: ref.globalQuestionNumber,
      endQuestionNumber: ref.globalQuestionNumber,
      entityId: ref.questionId,
      audioUrl: trackConfig?.audioUrl,
      segments: trackConfig?.segments || [],
      estimatedDurationSeconds: duration,
      pauseAfterSeconds: ETS_PART2_RESPONSE_PAUSE_SECONDS,
      isDirections: false,
    });
  });

  // --- PART 3: CONVERSATIONS (Questions 32 to 70: 13 Groups) ---
  queue.push(
    makeDirectionsItem(
      'p3-directions',
      3,
      'Part 3 Directions',
      ETS_PART3_DIRECTIONS_TEXT,
      32,
      70
    )
  );

  const p3Groups = examForm.groups.filter((g) => g.partNum === 3);
  p3Groups.forEach((gRef, idx) => {
    const grp = lookup.getGroup(gRef.groupId);
    const trackConfig = grp ? buildAudioTrackConfigFromGroup(grp) : null;
    const duration = trackConfig?.estimatedDurationSeconds || 45.0;

    queue.push({
      id: `p3-grp-${idx + 1}`,
      partNum: 3,
      itemType: 'part3_group',
      title: `Questions ${gRef.startQuestionNumber}-${gRef.endQuestionNumber}`,
      startQuestionNumber: gRef.startQuestionNumber,
      endQuestionNumber: gRef.endQuestionNumber,
      entityId: gRef.groupId,
      audioUrl: trackConfig?.audioUrl,
      segments: trackConfig?.segments || [],
      estimatedDurationSeconds: duration,
      pauseAfterSeconds: ETS_GROUP_QUESTION_PAUSE_SECONDS * 3, // 24s total
      isDirections: false,
    });
  });

  // --- PART 4: SHORT TALKS (Questions 71 to 100: 10 Groups) ---
  queue.push(
    makeDirectionsItem(
      'p4-directions',
      4,
      'Part 4 Directions',
      ETS_PART4_DIRECTIONS_TEXT,
      71,
      100
    )
  );

  const p4Groups = examForm.groups.filter((g) => g.partNum === 4);
  p4Groups.forEach((gRef, idx) => {
    const grp = lookup.getGroup(gRef.groupId);
    const trackConfig = grp ? buildAudioTrackConfigFromGroup(grp) : null;
    const duration = trackConfig?.estimatedDurationSeconds || 42.0;

    queue.push({
      id: `p4-grp-${idx + 1}`,
      partNum: 4,
      itemType: 'part4_talk',
      title: `Questions ${gRef.startQuestionNumber}-${gRef.endQuestionNumber}`,
      startQuestionNumber: gRef.startQuestionNumber,
      endQuestionNumber: gRef.endQuestionNumber,
      entityId: gRef.groupId,
      audioUrl: trackConfig?.audioUrl,
      segments: trackConfig?.segments || [],
      estimatedDurationSeconds: duration,
      pauseAfterSeconds: ETS_GROUP_QUESTION_PAUSE_SECONDS * 3, // 24s total
      isDirections: false,
    });
  });

  return queue;
}

// ============================================================================
// 2. STRICT LISTENING AUDIO ENGINE CONTROLLER
// ============================================================================

export class StrictListeningAudioEngine {
  private examForm: ExamForm;
  private session: ExamSession;
  private options: ExamAudioEngineOptions;
  private queue: ExamAudioQueueItem[];

  // Reactive State
  private state: ExamAudioEngineState;

  // Single Concurrency Token
  private activeToken = 0;

  // Shared single HTMLAudioElement (for local studio audio)
  private audioElement: HTMLAudioElement | null = null;
  private audioCleanupListeners: (() => void) | null = null;

  // TTS Queue State
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private pendingTimerId: ReturnType<typeof setTimeout> | null = null;
  private activeSegmentIndex = 0;

  // Subscribers
  private subscribers = new Set<(state: ExamAudioEngineState) => void>();

  constructor(
    examForm: ExamForm,
    session: ExamSession,
    options: ExamAudioEngineOptions = {}
  ) {
    this.examForm = examForm;
    this.session = session;
    this.options = options;

    const requestedMode: ExamAudioMode = options.mode ?? session.mode;

    // Strict Mode Readiness Guard:
    // If strict mode is requested, ExamForm MUST be strict-ready and strictLocked === false.
    // TTS fallback is NEVER permitted to unlock Strict Mode.
    const isStrictCertified =
      examForm.media?.readinessStatus === 'strict-ready' &&
      examForm.media?.strictLocked === false;

    if (requestedMode === 'strict' && !isStrictCertified) {
      const reason =
        examForm.media?.lockReason ||
        'Strict Mock Mode is locked: Certified studio prerecorded audio files are not integrated.';
      throw new Error(`STRICT_MODE_LOCKED: ${reason}`);
    }

    const isSimulation = requestedMode === 'simulation';
    this.queue = compileListeningAudioQueue(examForm);

    const initialItem = this.queue[0] || null;

    this.state = {
      status: 'idle',
      mode: requestedMode,
      isSimulation,
      isStrictCertified,
      currentQueueIndex: 0,
      totalQueueItems: this.queue.length,
      currentItem: initialItem,
      currentPart: initialItem?.partNum || 1,
      currentQuestionNumber: initialItem?.startQuestionNumber || 1,
      currentTime: 0,
      duration: initialItem?.estimatedDurationSeconds || 0,
      progressRatio: 0,
      playbackRate: 1.0,
      volume: options.volume ?? 1.0,
      isMuted: false,
      canSeek: false,
      canReplay: false,
      canPause: isSimulation, // Strict mode cannot pause arbitrarily
      errorMessage: null,
      errorCode: null,
      isAwaitingUserGesture: false,
      timelineAbnormal: session.integrityFlags.timelineAbnormal ?? false,
      tamperReason: session.integrityFlags.tamperReason,
    };
  }

  // --- Public Getters ---

  getState(): ExamAudioEngineState {
    return { ...this.state };
  }

  getQueue(): ExamAudioQueueItem[] {
    return [...this.queue];
  }

  subscribe(callback: (state: ExamAudioEngineState) => void): () => void {
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
      } catch {
        // Suppress subscriber callback error
      }
    });

    this.options.onStateChange?.(currentState);
  }

  private updateState(partial: Partial<ExamAudioEngineState>): void {
    this.state = {
      ...this.state,
      ...partial,
      // Strict invariants
      canSeek: false,
      canReplay: false,
      playbackRate: 1.0,
    };
    this.emitState();
  }

  // ==========================================================================
  // PLAYBACK CONTROLS & STRICT ENFORCEMENTS
  // ==========================================================================

  /**
   * Starts or resumes listening playback with user gesture compliance.
   */
  startPlayback(): Promise<void> {
    // Acquire exclusive global audio ownership
    audioPlaybackCoordinator.claim(this as unknown as any);

    this.activeToken++;
    const currentToken = this.activeToken;

    if (this.state.status === 'playing') {
      return Promise.resolve();
    }

    if (this.state.currentQueueIndex >= this.queue.length) {
      this.updateState({ status: 'ended' });
      this.options.onSectionEnded?.();
      return Promise.resolve();
    }

    return this.playQueueItem(this.state.currentQueueIndex, currentToken);
  }

  /**
   * Play a specific queue item in chronological order.
   */
  private async playQueueItem(index: number, token: number): Promise<void> {
    if (token !== this.activeToken) return;

    if (index >= this.queue.length) {
      this.updateState({
        status: 'ended',
        progressRatio: 1.0,
      });
      this.options.onSectionEnded?.();
      return;
    }

    const item = this.queue[index];
    this.updateState({
      status: 'playing',
      currentQueueIndex: index,
      currentItem: item,
      currentPart: item.partNum,
      currentQuestionNumber: item.startQuestionNumber,
      duration: item.estimatedDurationSeconds,
      currentTime: 0,
      progressRatio: 0,
      isAwaitingUserGesture: false,
      errorMessage: null,
      errorCode: null,
    });

    this.options.onItemTransition?.(item, index);
    this.options.onQuestionSync?.(item.startQuestionNumber, item.partNum);

    // Audio source choice: Prerecorded audio vs TTS simulation
    if (item.audioUrl && this.state.isStrictCertified) {
      await this.playLocalAudioItem(item, token);
    } else {
      await this.playTtsSimulationItem(item, token);
    }
  }

  /**
   * Plays prerecorded audio file via HTMLAudioElement.
   */
  private async playLocalAudioItem(item: ExamAudioQueueItem, token: number): Promise<void> {
    this.cleanupCurrentAudio();

    try {
      const audio = new Audio();
      this.audioElement = audio;
      audio.src = item.audioUrl!;
      audio.volume = this.state.volume;
      audio.playbackRate = 1.0;

      const handleEnded = () => {
        if (token !== this.activeToken) return;
        this.handleItemEnded(item, token);
      };

      const handleError = () => {
        if (token !== this.activeToken) return;
        this.updateState({
          status: 'error',
          errorCode: 'AUDIO_FILE_DECODE_ERROR',
          errorMessage: `Failed to load or decode audio file for ${item.title}.`,
        });
        this.options.onError?.({
          code: 'AUDIO_FILE_DECODE_ERROR',
          message: `Failed to decode audio file for ${item.title}`,
        });
      };

      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      this.audioCleanupListeners = () => {
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };

      await audio.play();
    } catch (err: any) {
      if (token !== this.activeToken) return;

      if (err?.name === 'NotAllowedError') {
        this.updateState({
          status: 'awaiting_user_interaction',
          isAwaitingUserGesture: true,
        });
        return;
      }

      this.updateState({
        status: 'error',
        errorCode: 'AUTOPLAY_OR_MEDIA_ERROR',
        errorMessage: err?.message || 'Media playback failed.',
      });
    }
  }

  /**
   * Plays synthetic TTS simulation sequence via Web Speech API.
   */
  private async playTtsSimulationItem(item: ExamAudioQueueItem, token: number): Promise<void> {
    this.cleanupCurrentAudio();

    if (item.segments.length === 0) {
      // Empty segments item: directly advance after duration
      this.pendingTimerId = setTimeout(() => {
        if (token === this.activeToken) {
          this.handleItemEnded(item, token);
        }
      }, Math.max(500, item.estimatedDurationSeconds * 1000));
      return;
    }

    this.activeSegmentIndex = 0;
    this.playNextTtsSegment(item, token);
  }

  private playNextTtsSegment(item: ExamAudioQueueItem, token: number): void {
    if (token !== this.activeToken) return;

    if (this.activeSegmentIndex >= item.segments.length) {
      this.handleItemEnded(item, token);
      return;
    }

    const segment = item.segments[this.activeSegmentIndex];

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      // Node or test environment fallback: simulated timer progression
      const durationMs = Math.max(100, Math.round(segment.text.length * 20));
      this.pendingTimerId = setTimeout(() => {
        if (token === this.activeToken) {
          this.activeSegmentIndex++;
          this.playNextTtsSegment(item, token);
        }
      }, durationMs);
      return;
    }

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(segment.text);
    this.currentUtterance = utterance;

    utterance.rate = 1.0;
    utterance.volume = this.state.volume;

    const voice = voiceManager.findBestEnglishVoice({
      genderHint: segment.genderHint,
      accent: segment.accentHint,
    });
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      if (token !== this.activeToken) return;
      this.currentUtterance = null;
      this.activeSegmentIndex++;
      this.playNextTtsSegment(item, token);
    };

    utterance.onerror = (e) => {
      if (token !== this.activeToken) return;
      if (e.error === 'interrupted' || e.error === 'canceled') return;

      this.updateState({
        status: 'error',
        errorCode: 'TTS_SYNTHESIS_ERROR',
        errorMessage: `TTS synthesis error: ${e.error}`,
      });
    };

    synth.speak(utterance);
  }

  /**
   * Item completed: Wait for standard pause window before automatically
   * advancing to the next linear queue item.
   */
  private handleItemEnded(item: ExamAudioQueueItem, token: number): void {
    if (token !== this.activeToken) return;

    const pauseMs = Math.max(500, item.pauseAfterSeconds * 1000);

    this.pendingTimerId = setTimeout(() => {
      if (token !== this.activeToken) return;
      const nextIndex = this.state.currentQueueIndex + 1;
      this.playQueueItem(nextIndex, token);
    }, pauseMs);
  }

  // ==========================================================================
  // STRICT RULES ENFORCEMENT
  // ==========================================================================

  /**
   * Candidate navigation on the answer sheet.
   * STRICT GUARANTEE: Does NOT jump the audio ahead or replay past audio.
   */
  syncUserNavigatedQuestion(questionNumber: number): void {
    // Only records user viewing cursor without mutating audio playback
    if (this.state.status === 'playing') {
      // In strict mock, candidate may inspect other questions on the answer sheet
      // while audio proceeds monotonically in real-time. Audio position is decoupled.
    }
  }

  /**
   * Seeking is strictly forbidden in TOEIC Mock Exams.
   */
  seekTo(_positionSeconds: number): void {
    throw new Error('SEEK_FORBIDDEN_IN_STRICT: Seeking audio is strictly forbidden in TOEIC Mock Exam.');
  }

  /**
   * Changing speed is strictly forbidden in TOEIC Mock Exams.
   */
  setPlaybackRate(rate: number): void {
    if (rate !== 1.0) {
      throw new Error('SPEED_CHANGE_FORBIDDEN: Playback speed is strictly locked at 1.0x.');
    }
  }

  /**
   * Replaying audio is strictly forbidden in TOEIC Mock Exams.
   */
  replay(): void {
    throw new Error('REPLAY_FORBIDDEN_IN_STRICT: Audio replaying is forbidden. Audio plays once.');
  }

  /**
   * Pausing: Permitted in simulation mode, forbidden in strict mode.
   */
  pause(): void {
    if (this.state.mode === 'strict') {
      throw new Error('PAUSE_FORBIDDEN_IN_STRICT: Arbitrary pausing is forbidden in Strict Mode.');
    }

    this.cleanupCurrentAudio();
    this.updateState({ status: 'paused', canPause: false });
  }

  /**
   * Section Timer Expiration hook: Halts all media playback immediately.
   */
  onListeningSectionExpired(): void {
    this.stop();
    this.updateState({
      status: 'ended',
      progressRatio: 1.0,
    });
  }

  /**
   * Stops playback and resets active token.
   */
  stop(): void {
    this.activeToken++;
    this.cleanupCurrentAudio();
    this.updateState({ status: 'idle' });
    audioPlaybackCoordinator.release(this as unknown as any);
  }

  // ==========================================================================
  // RECOVERY & CHECKPOINT EVALUATION
  // ==========================================================================

  /**
   * Generates standard checkpoint snapshot for session persistence.
   */
  getPlaybackCheckpoint(): ExamPlaybackCheckpoint {
    return {
      currentTrackId: this.state.currentItem?.id,
      currentAudioItemIndex: this.state.currentQueueIndex,
      playbackPositionMs: Math.round(this.state.currentTime * 1000),
      speechRate: 1.0,
      audioState:
        this.state.status === 'playing'
          ? 'playing'
          : this.state.status === 'paused'
          ? 'paused'
          : this.state.status === 'ended'
          ? 'ended'
          : 'idle',
      loopCount: 1,
      lastCheckpointAt: Date.now(),
    };
  }

  /**
   * Evaluates recovery state after browser reload or interruption.
   * Rules:
   * - Strict mode: If browser was reloaded / interrupted, the candidate missed audio.
   *   Strict timeline cannot be certified. Flags timelineAbnormal without silent skip.
   * - Simulation mode: May resume from the closest checkpoint item.
   */
  evaluatePlaybackRecovery(session: ExamSession): ExamAudioRecoveryEvaluation {
    const checkpoint = session.playbackCheckpoint;
    const isStrict = session.mode === 'strict';

    if (isStrict) {
      return {
        canResume: false,
        isStrictCompatible: false,
        timelineAbnormal: true,
        reason:
          'Strict listening timeline was interrupted by browser reload/interruption. According to ETS rules, listening audio cannot be rewound or replayed.',
        recommendedQueueIndex: checkpoint.currentAudioItemIndex ?? 0,
        recommendedQuestionNumber: session.currentQuestionNumber,
        checkpoint,
      };
    }

    return {
      canResume: true,
      isStrictCompatible: true,
      timelineAbnormal: false,
      recommendedQueueIndex: checkpoint.currentAudioItemIndex ?? 0,
      recommendedQuestionNumber: session.currentQuestionNumber,
      checkpoint,
    };
  }

  // ==========================================================================
  // LIFECYCLE CLEANUP
  // ==========================================================================

  private cleanupCurrentAudio(): void {
    if (this.pendingTimerId) {
      clearTimeout(this.pendingTimerId);
      this.pendingTimerId = null;
    }

    if (this.audioCleanupListeners) {
      this.audioCleanupListeners();
      this.audioCleanupListeners = null;
    }

    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.src = '';
        this.audioElement.load();
      } catch {
        // Safe catch
      }
      this.audioElement = null;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Safe catch
      }
    }
    this.currentUtterance = null;
  }

  /**
   * Permanently disposes the engine, listeners, timers, and audio resources.
   */
  dispose(): void {
    this.stop();
    this.subscribers.clear();
  }
}
