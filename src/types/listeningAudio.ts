/**
 * TOEIC Mastery Hub — Listening Audio Engine Types
 * Phase 6: Stable Audio Controller & Lifecycle Architecture
 */

import { PracticeMode } from './practiceSession';

export type AudioPlaybackSourceType = 'local_audio' | 'synthetic_tts' | 'none';

export type AudioPlaybackStatus =
  | 'idle'
  | 'loading'
  | 'playing'
  | 'paused'
  | 'ended'
  | 'error';

export type AudioErrorCode =
  | 'NO_AUDIO_SOURCE'
  | 'TTS_NOT_SUPPORTED'
  | 'TTS_SYNTHESIS_ERROR'
  | 'AUDIO_LOAD_ERROR'
  | 'AUTOPLAY_BLOCKED'
  | 'REPLAY_NOT_ALLOWED'
  | 'ABORTED';

export type SpeakerRole = 'Man' | 'Woman' | 'Narrator' | 'Speaker' | 'System';

export interface AudioScriptSegment {
  id: string;
  order: number;
  speaker: SpeakerRole;
  text: string;
  genderHint?: 'male' | 'female';
  accentHint?: 'US' | 'UK' | 'AU' | 'CA';
  choiceKey?: 'A' | 'B' | 'C' | 'D'; // For Part 1 / Part 2 choices recitation
  isPrompt?: boolean; // For Part 2 prompt question
}

export interface AudioTrackConfig {
  partNum: 1 | 2 | 3 | 4;
  questionId?: string;
  groupId?: string;
  audioUrl?: string; // Pre-recorded local audio asset (e.g. mp3/wav)
  fullScript?: string; // Full transcript or audioScript
  segments: AudioScriptSegment[];
  preferredAccent?: 'US' | 'UK' | 'AU' | 'CA';
  preferredGender?: 'male' | 'female';
  estimatedDurationSeconds: number;
}

export interface AudioPlayerState {
  status: AudioPlaybackStatus;
  sourceType: AudioPlaybackSourceType;
  currentTime: number; // in seconds
  duration: number; // in seconds
  progressRatio: number; // 0 to 1
  currentSegmentIndex: number;
  activeSegment: AudioScriptSegment | null;
  activeSpeaker: string | null;
  activeChoiceKey: string | null;
  playCount: number;
  maxReplays: number | null; // null = unlimited (Practice Mode), 1 = Timed Practice
  canPlay: boolean;
  canReplay: boolean;
  canPause: boolean;
  canResume: boolean;
  errorMessage: string | null;
  errorCode: AudioErrorCode | null;
  isSyntheticTTS: boolean;
  playbackRate: number; // e.g. 0.8, 1.0, 1.2
  volume: number; // 0 to 1
  isMuted: boolean;
}

export interface AudioControllerOptions {
  mode?: PracticeMode;
  maxReplays?: number | null; // Override max replays (default: 1 for timed, null for practice)
  allowReplayInTimed?: boolean; // Default: false
  playbackRate?: number;
  volume?: number;
  autoPlay?: boolean;
  onStatusChange?: (status: AudioPlaybackStatus) => void;
  onProgress?: (currentTime: number, duration: number) => void;
  onSegmentChange?: (segmentIndex: number, segment: AudioScriptSegment | null) => void;
  onEnded?: () => void;
  onError?: (error: { code: AudioErrorCode; message: string }) => void;
}

export interface VoiceSelection {
  voiceURI: string;
  name: string;
  lang: string;
  genderHint?: 'male' | 'female';
}
