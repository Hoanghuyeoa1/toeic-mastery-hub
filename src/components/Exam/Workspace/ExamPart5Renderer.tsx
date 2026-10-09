/**
 * TOEIC Mastery Hub — Exam Part 5 Incomplete Sentences Renderer (Phase 15)
 *
 * Dedicated exam surface for Part 5 (Questions 101–130):
 * - Prominent display of incomplete sentence with inline blank previewing selected choice.
 * - 4 standard options A, B, C, D with clear typography and keyboard accelerators [A, B, C, D].
 * - Review flag toggle with [M / F] accelerator.
 * - Strictly conceals correct answers, explanations, and trap metadata during the exam.
 * - High accessibility, smooth focus rings, dark/light theme support.
 */

import React, { useMemo } from 'react';
import { Flag, Check } from 'lucide-react';
import { StandardChoiceKey } from '../../../types/questionBank';
import { ExamPart5RendererProps } from '../../../types/examWorkspace';

export const ExamPart5Renderer: React.FC<ExamPart5RendererProps> = ({
  question,
  globalQuestionNumber,
  answer,
  isFlagged,
  onSelectChoice,
  onToggleFlag,
  isLocked,
}) => {
  const selectedChoice = answer?.selectedChoice ?? null;

  // Split sentence around blank markers (_____ or ______ or ------)
  const renderedSentence = useMemo(() => {
    const raw = question.sentence;
    const parts = raw.split(/_____|______|-{3,6}/g);

    if (parts.length < 2) {
      return <span>{raw}</span>;
    }

    return (
      <span className="leading-relaxed text-slate-900 dark:text-slate-100 text-base sm:text-lg">
        {parts[0]}
        <span
          className={`inline-flex items-center justify-center min-w-[72px] px-3 py-0.5 mx-1.5 rounded-lg border font-mono font-bold text-sm transition-all ${
            selectedChoice
              ? 'bg-indigo-600/15 text-indigo-700 dark:text-indigo-300 border-indigo-500 shadow-sm'
              : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-dashed border-amber-500/60'
          }`}
          title="Vị trí chỗ trống cần điền"
        >
          {selectedChoice ? `(${selectedChoice})` : '_____'}
        </span>
        {parts.slice(1).join('_____')}
      </span>
    );
  }, [question.sentence, selectedChoice]);

  return (
    <div
      className="max-w-4xl mx-auto w-full space-y-6 animate-in fade-in duration-150"
      data-testid="exam-part5-renderer"
    >
      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider">
              Part 5: Incomplete Sentences
            </span>
            <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
              Câu {globalQuestionNumber} / 200
            </span>
          </div>

          {/* Flag Toggle Button */}
          <button
            onClick={onToggleFlag}
            type="button"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              isFlagged
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-amber-500'
            }`}
            title="Đánh dấu câu hỏi để xem lại (Phím tắt: M hoặc F)"
          >
            <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current' : ''}`} />
            <span>{isFlagged ? 'Đã Gắn Cờ' : 'Gắn Cờ'}</span>
            <kbd className="hidden sm:inline-block text-[10px] opacity-60 font-mono ml-0.5">M</kbd>
          </button>
        </div>

        {/* Prompt Instruction */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Chọn từ hoặc cụm từ thích hợp nhất để hoàn thành câu:
          </p>

          {/* Incomplete Sentence Surface */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/90 font-medium leading-relaxed">
            {renderedSentence}
          </div>
        </div>

        {/* Options Grid (A, B, C, D) */}
        <div className="space-y-3 pt-2">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            Phương án lựa chọn:
          </p>

          <div className="grid grid-cols-1 gap-3">
            {question.options.map((opt) => {
              const isSelected = selectedChoice === opt.key;

              return (
                <button
                  key={opt.key}
                  onClick={() => !isLocked && onSelectChoice(opt.key)}
                  disabled={isLocked}
                  type="button"
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-600 dark:border-indigo-500 text-indigo-950 dark:text-indigo-100 shadow-sm ring-1 ring-indigo-500/30'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850'
                  } ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {/* Choice Letter Circle */}
                  <span
                    className={`shrink-0 w-8 h-8 rounded-xl font-bold font-mono text-sm flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {isSelected ? <Check className="w-4 h-4" /> : opt.key}
                  </span>

                  {/* Option Text */}
                  <div className="flex-1 pt-1">
                    <span className="text-sm sm:text-base leading-relaxed font-medium">
                      {opt.text}
                    </span>
                  </div>

                  {/* Keyboard Key Hint */}
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {opt.key}
                  </kbd>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
