/**
 * TOEIC Mastery Hub — Listening Workspace Header
 * Phase 7: Listening Practice Workspace
 *
 * Top bar showing:
 * - Part Title & Section
 * - Mode & Difficulty Badges
 * - Wall-Clock Timer for Timed Practice (with low-time warning)
 * - Assistance Toggle (Practice mode only)
 * - Flag / Mark for Review button
 * - Submit & Exit actions
 */

import React from 'react';
import {
  Clock,
  Flag,
  Lightbulb,
  CheckCircle2,
  X,
  Volume2,
  BookOpen,
  Zap,
} from 'lucide-react';
import { PracticeMode } from '../../../types/practiceSession';

export interface WorkspaceHeaderProps {
  partNum: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  mode: PracticeMode;
  difficulty: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  remainingSeconds: number | null;
  isMarked: boolean;
  isSubmitted: boolean;
  onToggleMark: () => void;
  onSubmitClick: () => void;
  onExitClick: () => void;
  showAssistanceToggle?: boolean;
  isAssistanceActive?: boolean;
  onToggleAssistance?: () => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  partNum,
  mode,
  difficulty,
  currentQuestionIndex,
  totalQuestions,
  remainingSeconds,
  isMarked,
  isSubmitted,
  onToggleMark,
  onSubmitClick,
  onExitClick,
  showAssistanceToggle = false,
  isAssistanceActive = false,
  onToggleAssistance,
}) => {
  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return '--:--';
    const s = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(s / 60);
    const rem = s % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const isLowTime = mode === 'timed' && remainingSeconds !== null && remainingSeconds <= 60;

  const partNames: Record<number, string> = {
    1: 'Part 1: Photographs',
    2: 'Part 2: Question-Response',
    3: 'Part 3: Short Conversations',
    4: 'Part 4: Short Talks',
    5: 'Part 5: Incomplete Sentences',
    6: 'Part 6: Text Completion',
    7: 'Part 7: Reading Comprehension',
  };

  const isReading = partNum >= 5;

  return (
    <header
      className="w-full bg-zinc-900 border-b border-zinc-800 px-4 sm:px-6 py-3 select-none"
      data-testid="workspace-header"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Part Info & Mode Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-8 h-8 rounded-xl ${
                isReading ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
              } flex items-center justify-center font-bold text-xs`}
            >
              {isReading ? <BookOpen className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm text-zinc-100">
                  {partNames[partNum] || `Part ${partNum}`}
                </h1>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/60 uppercase">
                  {difficulty}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Tiến độ: Câu {currentQuestionIndex + 1} / {totalQuestions}
              </p>
            </div>
          </div>

          {/* Mode Pill */}
          <div className="hidden sm:flex items-center">
            {mode === 'timed' ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-950/50 px-2.5 py-1 rounded-full border border-amber-800/60">
                <Zap className="w-3 h-3 fill-amber-300" />
                Timed Practice
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-300 bg-indigo-950/50 px-2.5 py-1 rounded-full border border-indigo-800/60">
                <BookOpen className="w-3 h-3" />
                Practice Mode
              </span>
            )}
          </div>
        </div>

        {/* Center: Timer or Progress */}
        <div className="flex items-center gap-3">
          {mode === 'timed' && remainingSeconds !== null && (
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm font-bold border transition-colors ${
                isLowTime
                  ? 'bg-rose-950/60 text-rose-400 border-rose-800 animate-pulse'
                  : 'bg-zinc-800/80 text-zinc-200 border-zinc-700/80'
              }`}
              title="Thời gian làm bài còn lại (Wall-Clock)"
            >
              <Clock className={`w-4 h-4 ${isLowTime ? 'text-rose-400' : 'text-zinc-400'}`} />
              <span>{formatTime(remainingSeconds)}</span>
            </div>
          )}

          {/* Practice Mode Assistance Toggle */}
          {showAssistanceToggle && onToggleAssistance && (
            <button
              type="button"
              onClick={onToggleAssistance}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isAssistanceActive
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                  : 'bg-zinc-800/80 hover:bg-zinc-750 text-zinc-400 hover:text-zinc-200 border-zinc-700/60'
              }`}
              title="Bật/Tắt xem Transcript và Giải thích (Practice Mode)"
            >
              <Lightbulb className={`w-3.5 h-3.5 ${isAssistanceActive ? 'text-amber-400 fill-amber-400' : ''}`} />
              <span className="hidden md:inline">{isAssistanceActive ? 'Ẩn Gợi Ý' : 'Xem Gợi Ý'}</span>
            </button>
          )}

          {/* Mark for Review Toggle */}
          <button
            type="button"
            onClick={onToggleMark}
            disabled={isSubmitted}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              isMarked
                ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                : 'bg-zinc-800/80 hover:bg-zinc-750 text-zinc-400 hover:text-zinc-200 border-zinc-700/60'
            }`}
            title="Đánh dấu câu hỏi để xem lại sau (Phím tắt: M)"
          >
            <Flag className={`w-3.5 h-3.5 ${isMarked ? 'fill-orange-400 text-orange-400' : ''}`} />
            <span className="hidden sm:inline">Xem lại</span>
          </button>
        </div>

        {/* Right: Actions (Submit / Exit) */}
        <div className="flex items-center gap-2">
          {/* Submit Button */}
          <button
            type="button"
            onClick={onSubmitClick}
            disabled={isSubmitted}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isSubmitted
                ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitted ? 'Đã Nộp Bài' : 'Nộp Bài'}</span>
          </button>

          {/* Exit / Abandon Button */}
          <button
            type="button"
            onClick={onExitClick}
            className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Thoát bài luyện tập"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
