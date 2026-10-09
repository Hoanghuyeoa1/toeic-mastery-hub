/**
 * TOEIC Mastery Hub — Exam Library & Preflight Types (Phase 13)
 *
 * Defines domain models and interfaces for the Full Mock Exam Library,
 * Instructions, and Preflight Technical Verification Engine:
 * - Preflight checklist items and composite evaluation report
 * - Audio/Sound check verification models
 * - Library filters and presentation structures
 */

import { ExamForm, ExamReadinessStatus } from './mockExam';
import { ExamAudioMode } from './examAudio';

export type PreflightCheckId =
  | 'formIntegrity'
  | 'mediaReadiness'
  | 'browserCapabilities'
  | 'storageAccess'
  | 'activeSession'
  | 'multiTab'
  | 'audioGesture';

export type PreflightCheckStatus =
  | 'pending'
  | 'checking'
  | 'passed'
  | 'failed'
  | 'warning';

export interface PreflightCheckItem {
  id: PreflightCheckId;
  name: string;
  description: string;
  status: PreflightCheckStatus;
  message?: string;
  detail?: string;
  isCritical: boolean;
  actionRequired?: string;
}

export interface ExamPreflightReport {
  isReadyToStart: boolean;
  selectedMode: ExamAudioMode;
  examForm: ExamForm;
  checks: Record<PreflightCheckId, PreflightCheckItem>;
  warnings: string[];
  blockers: string[];
  evaluatedAt: number; // timestamp
}

export type ExamLibraryFilter = 'all' | 'simulation-ready' | 'strict-ready';

export interface SoundCheckResult {
  success: boolean;
  mode: 'tone' | 'speech';
  playedAt: number;
  error?: string;
}

export interface ExamCardPresentationData {
  examForm: ExamForm;
  readinessStatus: ExamReadinessStatus;
  strictLocked: boolean;
  lockReason?: string;
  hasActiveSession: boolean;
  activeSessionId?: string;
  activeSessionProgress?: {
    answeredCount: number;
    totalCount: number;
    currentSection: string;
    currentPart: number;
  };
  attemptCount: number;
  lastAttemptAt?: string;
  bestScore?: number;
  latestScore?: number;
}
