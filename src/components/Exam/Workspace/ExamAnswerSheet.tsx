/**
 * TOEIC Mastery Hub — 200-Question Exam Answer Sheet Matrix (Phase 14)
 *
 * Requirements:
 * - Unified 200-question matrix partitioned by Listening (1-100) & Reading (101-200), covering all 7 Parts.
 * - Reactive cell states: answered (with choice letter), unanswered, flagged, current, and locked.
 * - Enforces Strict listening rules: clicking locked/unavailable questions does not silently jump sections;
 *   shows clear, transparent feedback.
 * - Performance optimized: React.memo per cell prevents unnecessary mass re-renders on timer ticks.
 * - Quick filtering by all, unanswered, and flagged.
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  X,
  FileSpreadsheet,
  AlertCircle,
  Lock,
} from 'lucide-react';
import {
  ExamAnswerSheetProps,
  EXAM_ANSWER_SHEET_PARTS,
  AnswerSheetFilterMode,
} from '../../../types/examWorkspace';
import { StandardChoiceKey } from '../../../types/questionBank';

interface CellProps {
  questionNumber: number;
  partNum: number;
  section: 'listening' | 'reading';
  selectedChoice: StandardChoiceKey | null;
  isFlagged: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  lockReason?: string;
  onClick: (qNum: number, isLocked: boolean, reason?: string) => void;
}

/**
 * Highly optimized memoized cell for the 200-question matrix
 */
const AnswerSheetCell = React.memo<CellProps>(({
  questionNumber,
  selectedChoice,
  isFlagged,
  isCurrent,
  isLocked,
  lockReason,
  onClick,
}) => {
  const hasAnswer = selectedChoice !== null;

  return (
    <button
      type="button"
      onClick={() => onClick(questionNumber, isLocked, lockReason)}
      className={`relative w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center border select-none ${
        isCurrent
          ? 'ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-slate-900 border-indigo-500 scale-105 z-10'
          : ''
      } ${
        isLocked
          ? 'bg-slate-100/60 dark:bg-slate-850/40 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 cursor-not-allowed opacity-60'
          : hasAnswer
          ? 'bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-700 shadow-xs'
          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500'
      }`}
      title={
        isLocked
          ? `Câu ${questionNumber}: ${lockReason || 'Bị khóa'}`
          : `Câu ${questionNumber}${hasAnswer ? ` (Đáp án: ${selectedChoice})` : ' (Chưa làm)'}${
              isFlagged ? ' - Có cờ xem lại' : ''
            }`
      }
    >
      {/* Flag bookmark dot */}
      {isFlagged && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border border-white dark:border-slate-900 z-10" />
      )}

      {/* Content: Selected choice letter or Question Number */}
      {isLocked ? (
        <Lock className="w-3 h-3 text-slate-400 dark:text-slate-600" />
      ) : hasAnswer ? (
        <span className="font-extrabold">{selectedChoice}</span>
      ) : (
        <span className="text-[10px] font-mono font-medium">{questionNumber}</span>
      )}
    </button>
  );
});

AnswerSheetCell.displayName = 'AnswerSheetCell';

export const ExamAnswerSheet: React.FC<ExamAnswerSheetProps> = ({
  session,
  currentQuestionNumber,
  onSelectQuestion,
  isOpen,
  onClose,
  currentAudioStartQuestion = 1,
  currentAudioEndQuestion = 1,
}) => {
  const [sectionTab, setSectionTab] = useState<'listening' | 'reading'>(
    session.currentSection === 'reading' ? 'reading' : 'listening'
  );
  const [filterMode, setFilterMode] = useState<AnswerSheetFilterMode>('all');
  const [restrictionNotice, setRestrictionNotice] = useState<string | null>(null);

  const isStrict = session.mode === 'strict';

  // Calculate quick statistics across all 200 questions
  const { answeredTotal, unansweredTotal, flaggedTotal } = useMemo(() => {
    let ans = 0;
    let unans = 0;
    let flag = 0;

    for (let i = 1; i <= 200; i++) {
      const a = session.answers[i];
      if (a && a.selectedChoice !== null) {
        ans++;
      } else {
        unans++;
      }
      if (session.flaggedQuestions[i]) {
        flag++;
      }
    }

    return { answeredTotal: ans, unansweredTotal: unans, flaggedTotal: flag };
  }, [session.answers, session.flaggedQuestions]);

  // Handle cell click with friendly strict boundary warnings
  const handleCellClick = useCallback(
    (qNum: number, isLocked: boolean, reason?: string) => {
      if (isLocked) {
        setRestrictionNotice(
          reason || 'Câu hỏi này hiện đang bị khóa theo quy chế phòng thi.'
        );
        setTimeout(() => setRestrictionNotice(null), 4000);
        return;
      }

      onSelectQuestion(qNum);
    },
    [onSelectQuestion]
  );

  if (!isOpen) return null;

  const listeningParts = EXAM_ANSWER_SHEET_PARTS.filter((p) => p.section === 'listening');
  const readingParts = EXAM_ANSWER_SHEET_PARTS.filter((p) => p.section === 'reading');
  const displayedParts = sectionTab === 'listening' ? listeningParts : readingParts;

  return (
    <aside
      className="fixed inset-y-0 right-0 z-40 w-full sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col text-slate-800 dark:text-slate-100 animate-in slide-in-from-right duration-200"
      aria-label="Phiếu trả lời Answer Sheet 200 câu"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Answer Sheet (200 Câu)
          </h3>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          title="Đóng phiếu trả lời"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Section Tabs: Listening (1-100) vs Reading (101-200) */}
      <div className="px-4 pt-3 pb-2 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
        <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setSectionTab('listening')}
            className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              sectionTab === 'listening'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Listening (1-100)</span>
          </button>

          <button
            onClick={() => setSectionTab('reading')}
            className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              sectionTab === 'reading'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Reading (101-200)</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                filterMode === 'all'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Tất cả ({answeredTotal}/200)
            </button>
            <button
              onClick={() => setFilterMode('unanswered')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                filterMode === 'unanswered'
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Chưa làm ({unansweredTotal})
            </button>
            <button
              onClick={() => setFilterMode('flagged')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                filterMode === 'flagged'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Cờ xem lại ({flaggedTotal})
            </button>
          </div>
        </div>
      </div>

      {/* Restriction Toast Banner */}
      {restrictionNotice && (
        <div className="mx-4 mt-3 p-3 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <p className="leading-snug">{restrictionNotice}</p>
        </div>
      )}

      {/* 200-Question Grid by Part */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {displayedParts.map((partMeta) => {
          // Generate questions in range
          const questionNumbers: number[] = [];
          for (let q = partMeta.startQuestionNumber; q <= partMeta.endQuestionNumber; q++) {
            const answer = session.answers[q];
            const isFlagged = Boolean(session.flaggedQuestions[q]);
            const hasAnswer = answer && answer.selectedChoice !== null;

            if (filterMode === 'unanswered' && hasAnswer) continue;
            if (filterMode === 'flagged' && !isFlagged) continue;

            questionNumbers.push(q);
          }

          if (questionNumbers.length === 0) return null;

          return (
            <div key={partMeta.partNum} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {partMeta.partName}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Câu {partMeta.startQuestionNumber} - {partMeta.endQuestionNumber}
                </span>
              </div>

              {/* Grid Cells */}
              <div className="grid grid-cols-6 sm:grid-cols-6 gap-2 pt-1">
                {questionNumbers.map((qNum) => {
                  const answer = session.answers[qNum];
                  const isFlagged = Boolean(session.flaggedQuestions[qNum]);
                  const selectedChoice = answer?.selectedChoice ?? null;
                  const isCurrent = qNum === currentQuestionNumber;

                  // Locked rules:
                  // 1. Reading questions (101-200) are locked when in Listening section (Strict Mode)
                  // 2. Listening questions (1-100) are locked permanently once in Reading section (Strict Mode)
                  // 3. In Strict listening mode, questions outside the currently playing audio group are locked from premature seeking
                  let isLocked = false;
                  let lockReason = '';

                  if (session.currentSection === 'listening' && qNum > 100) {
                    isLocked = true;
                    lockReason = 'Phần Reading chưa mở trong thời gian làm bài Listening.';
                  } else if (session.currentSection === 'reading' && qNum <= 100 && isStrict) {
                    isLocked = true;
                    lockReason = 'Kỷ luật Strict: Phần Listening đã khóa vĩnh viễn.';
                  } else if (
                    session.currentSection === 'listening' &&
                    isStrict &&
                    (qNum < currentAudioStartQuestion || qNum > currentAudioEndQuestion)
                  ) {
                    isLocked = true;
                    lockReason = `Kỷ luật Strict: Audio đang phát nhóm câu ${currentAudioStartQuestion}–${currentAudioEndQuestion}. Không thể bỏ qua hoặc nhảy ngoài phạm vi audio hiện tại.`;
                  }

                  return (
                    <AnswerSheetCell
                      key={qNum}
                      questionNumber={qNum}
                      partNum={partMeta.partNum}
                      section={partMeta.section}
                      selectedChoice={selectedChoice}
                      isFlagged={isFlagged}
                      isCurrent={isCurrent}
                      isLocked={isLocked}
                      lockReason={lockReason}
                      onClick={handleCellClick}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Legend */}
      <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-around">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-indigo-600 text-white flex items-center justify-center font-bold text-[9px]">
            A
          </div>
          <span>Đã làm</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800" />
          <span>Chưa làm</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Cờ xem lại</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Bị khóa</span>
        </div>
      </div>
    </aside>
  );
};
