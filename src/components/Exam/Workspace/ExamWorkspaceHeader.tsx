/**
 * TOEIC Mastery Hub — Exam Workspace Header (Phase 14)
 *
 * Header surface for the 200-question exam workspace:
 * - ExamForm metadata and section/part indicators
 * - Wall-clock section and overall countdown timers with urgency styling
 * - Answered and flagged counter progress
 * - Multi-tab conflict notification with lease takeover action
 * - Answer sheet drawer trigger and controlled submission modal trigger
 */

import React from 'react';
import {
  Clock,
  ShieldAlert,
  FileSpreadsheet,
  Send,
  LogOut,
  GraduationCap,
  Sparkles,
  Lock,
  Bookmark,
} from 'lucide-react';
import { ExamWorkspaceHeaderProps } from '../../../types/examWorkspace';

export const ExamWorkspaceHeader: React.FC<ExamWorkspaceHeaderProps> = ({
  examForm,
  session,
  currentPart,
  formattedSectionTime,
  formattedOverallTime,
  isUrgent,
  tabLeaseStatus,
  isConflict,
  onTakeoverLease,
  onOpenSubmitModal,
  onExitWorkspace,
  isAnswerSheetOpen,
  onToggleAnswerSheet,
  answeredCount,
  flaggedCount,
}) => {
  const isStrict = session.mode === 'strict';

  const partNames: Record<number, string> = {
    1: 'Part 1: Photographs',
    2: 'Part 2: Question-Response',
    3: 'Part 3: Conversations',
    4: 'Part 4: Short Talks',
    5: 'Part 5: Incomplete Sentences',
    6: 'Part 6: Text Completion',
    7: 'Part 7: Reading Comprehension',
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md shadow-lg text-white">
      {/* Top Banner: Multi-Tab Conflict Alert (if any) */}
      {isConflict && (
        <div className="bg-rose-950/90 border-b border-rose-800 text-rose-200 px-4 py-2 text-xs flex items-center justify-between gap-3 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>Cảnh báo đa tab:</strong> Một tab khác đang giữ quyền thao tác phiên thi này. Tab hiện tại ở chế độ chỉ đọc.
            </span>
          </div>
          <button
            onClick={onTakeoverLease}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs shadow-sm transition-all shrink-0 active:scale-95"
          >
            Tiếp Quản Tab Này
          </button>
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Exam Info & Current Part */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-600 p-0.5 shadow-md shadow-indigo-600/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-extrabold text-xs text-indigo-400 tracking-wider">
                {examForm.code}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isStrict
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}
              >
                {isStrict ? 'STRICT MOCK' : 'SIMULATION'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="font-bold text-white">
                {session.currentSection === 'listening' ? 'SECTION 1: LISTENING' : 'SECTION 2: READING'}
              </span>
              <span>•</span>
              <span className="text-slate-400 font-medium">
                {partNames[currentPart] || `Part ${currentPart}`}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Persistent Wall-Clock Timers */}
        <div className="flex items-center gap-3">
          {/* Section Timer */}
          <div
            className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 transition-all ${
              isUrgent
                ? 'bg-rose-950/80 border-rose-500 text-rose-200 animate-pulse'
                : 'bg-slate-950/80 border-slate-800 text-slate-200'
            }`}
          >
            <Clock className={`w-4 h-4 ${isUrgent ? 'text-rose-400' : 'text-indigo-400'}`} />
            <div>
              <span className="text-[10px] text-slate-400 block leading-tight">
                {session.currentSection === 'listening' ? 'Hạn giờ Nghe' : 'Hạn giờ Đọc'}
              </span>
              <span className="font-mono font-extrabold text-sm tracking-wider text-white">
                {formattedSectionTime}
              </span>
            </div>
          </div>

          {/* Overall Timer */}
          <div className="hidden sm:flex px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-slate-400 items-center gap-2">
            <div>
              <span className="text-[10px] text-slate-500 block leading-tight">Tổng 120p</span>
              <span className="font-mono font-semibold text-xs text-slate-300 tracking-wider">
                {formattedOverallTime}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Answer Sheet, Submit & Exit Actions */}
        <div className="flex items-center gap-2">
          {/* Progress Indicators */}
          <div className="hidden md:flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
            <span>
              Đã làm:{' '}
              <strong className="text-indigo-400 font-mono">{answeredCount}</strong>/200
            </span>
            {flaggedCount > 0 && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Bookmark className="w-3 h-3 fill-current" />
                  <span className="font-mono font-bold">{flaggedCount}</span>
                </span>
              </>
            )}
          </div>

          {/* Answer Sheet Toggle */}
          <button
            onClick={onToggleAnswerSheet}
            className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 active:scale-95 ${
              isAnswerSheetOpen
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
            }`}
            title="Mở hoặc đóng bảng Answer Sheet 200 câu"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">Answer Sheet</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-900/80 text-indigo-300 border border-indigo-500/30">
              {answeredCount}/200
            </span>
          </button>

          {/* Submit Exam Button */}
          <button
            onClick={onOpenSubmitModal}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            title="Kiểm tra và nộp bài thi"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Nộp Bài</span>
          </button>

          {/* Exit Exam Button */}
          <button
            onClick={onExitWorkspace}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl border border-transparent hover:border-rose-900/50 transition-colors"
            title="Tạm rời phòng thi (tiến độ tự động lưu)"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
