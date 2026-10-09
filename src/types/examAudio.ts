/**
 * TOEIC Mastery Hub — Exam Listening Audio Engine Types (Phase 12)
 *
 * Defines domain models and contracts for the Full-Length Mock Exam Listening Engine:
 * - Strict Playback: Fixed linear sequence Part 1 -> Part 2 -> Part 3 -> Part 4.
 * - Anti-Tampering: No seeking, no replaying, locked 1.0x playback rate.
 * - Simulation Fallback: Web Speech API TTS simulation mode when studio audio is absent.
 * - Lifecycle Safety: Autoplay block handling, background tab wall-clock sync, memory cleanup.
 * - Recovery & Checkpoints: Tracking playback progression, handling reload & abnormal timeline.
 */

import { ExamSessionMode, ExamPlaybackCheckpoint } from './mockExam';
import { AudioScriptSegment } from './listeningAudio';

export type ExamAudioMode = ExamSessionMode; // 'strict' | 'simulation'

export type ExamAudioPlaybackStatus =
  | 'idle'
  | 'awaiting_user_interaction'
  | 'buffering'
  | 'playing'
  | 'paused'
  | 'ended'
  | 'error'
  | 'interrupted';

export type ExamAudioItemType =
  | 'part_directions'
  | 'part1_question'
  | 'part2_question'
  | 'part3_group'
  | 'part4_talk';

export interface ExamAudioQueueItem {
  /** Unique stable queue item ID (e.g. 'p1-directions', 'p1-q-001', 'p3-grp-001') */
  id: string;
  /** TOEIC Part (1, 2, 3, 4) */
  partNum: 1 | 2 | 3 | 4;
  /** Classification of this audio unit */
  itemType: ExamAudioItemType;
  /** Human-readable label (e.g. 'Part 1 Directions', 'Question 1', 'Questions 32-34') */
  title: string;
  /** Global question number range start (inclusive) */
  startQuestionNumber: number;
  /** Global question number range end (inclusive) */
  endQuestionNumber: number;
  /** Entity ID in question bank (questionId or groupId) */
  entityId?: string;
  /** Certified prerecorded studio audio URL if available */
  audioUrl?: string;
  /** Chronological segments for TTS simulation fallback */
  segments: AudioScriptSegment[];
  /** Measured duration in seconds from studio recording if available */
  measuredDurationSeconds?: number;
  /** Estimated duration in seconds */
  estimatedDurationSeconds: number;
  /** Standard silence window after item completion (in seconds) */
  pauseAfterSeconds: number;
  /** Whether this item is spoken instructions rather than an answered question */
  isDirections: boolean;
}

export interface ExamAudioEngineState {
  status: ExamAudioPlaybackStatus;
  mode: ExamAudioMode;
  isSimulation: boolean;
  isStrictCertified: boolean;
  currentQueueIndex: number;
  totalQueueItems: number;
  currentItem: ExamAudioQueueItem | null;
  currentPart: 1 | 2 | 3 | 4;
  currentQuestionNumber: number;
  currentTime: number; // in seconds
  duration: number; // in seconds for current item
  progressRatio: number; // 0 to 1
  playbackRate: number; // strictly 1.0 in strict mode
  volume: number; // 0 to 1
  isMuted: boolean;
  canSeek: boolean; // strictly false in strict mode
  canReplay: boolean; // strictly false in strict mode
  canPause: boolean; // false in strict mode, true in simulation
  errorMessage: string | null;
  errorCode: string | null;
  isAwaitingUserGesture: boolean;
  timelineAbnormal: boolean;
  tamperReason?: string;
}

export interface ExamAudioEngineOptions {
  mode?: ExamAudioMode;
  volume?: number;
  onStateChange?: (state: ExamAudioEngineState) => void;
  onQuestionSync?: (questionNumber: number, partNum: 1 | 2 | 3 | 4) => void;
  onItemTransition?: (item: ExamAudioQueueItem, index: number) => void;
  onSectionEnded?: () => void;
  onError?: (error: { code: string; message: string }) => void;
}

export interface ExamAudioRecoveryEvaluation {
  canResume: boolean;
  isStrictCompatible: boolean;
  timelineAbnormal: boolean;
  reason?: string;
  recommendedQueueIndex: number;
  recommendedQuestionNumber: number;
  checkpoint: ExamPlaybackCheckpoint;
}
