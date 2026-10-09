/**
 * TOEIC Mastery Hub — Exam Part 6 Text Completion Renderer (Phase 15)
 *
 * Dedicated exam surface for Part 6 (Questions 131–146, 4 groups × 4 questions):
 * - Two-pane split layout on desktop (Left: Passage, Right: Questions) with independent scroll containers.
 * - Interactive blank markers [131], [132], [133], [134] mapped strictly to Question IDs.
 * - Clicking a blank in the passage focuses the question in the right pane without resetting scroll positions.
 * - Displaying selected answers directly inside blanks for holistic context comprehension.
 * - Authentic workplace document presentation (Email, Memo, Notice, Letter, Article, Instructions).
 * - Full 4 questions rendered per group with individual flag toggles and keyboard accelerators.
 * - Responsive mobile view with seamless Passage / Questions tab switching.
 * - Strictly conceals answer keys and explanations during the live exam.
 */

import React, { useState, useMemo, useRef } from 'react';
import {
  FileText,
  Mail,
  Flag,
  Check,
} from 'lucide-react';
import { ExamPart6RendererProps } from '../../../types/examWorkspace';

export const ExamPart6Renderer: React.FC<ExamPart6RendererProps> = ({
  group,
  questions,
  activeQuestionNumber,
  answers,
  flaggedQuestions,
  onSelectChoice,
  onToggleFlag,
  onFocusQuestion,
  isLocked,
}) => {
  // Mobile responsive tab toggle ('passage' vs 'questions')
  const [mobileTab, setMobileTab] = useState<'passage' | 'questions'>('passage');

  // Question container ref for auto-scrolling to active question
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Document type icon helper
  const getDocumentIcon = () => {
    switch (group.passageType) {
      case 'email':
      case 'letter':
        return <Mail className="w-4 h-4 text-sky-500 dark:text-sky-400" />;
      default:
        return <FileText className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />;
    }
  };

  // Determine group range label
  const sortedQuestions = useMemo(() => {
    return [...questions].sort((a, b) => a.blankNumber - b.blankNumber);
  }, [questions]);

  const startBlank = sortedQuestions[0]?.blankNumber ?? 131;
  const endBlank = sortedQuestions[sortedQuestions.length - 1]?.blankNumber ?? 134;

  // Render passage with interactive [131]..[146] blanks
  const renderedPassage = useMemo(() => {
    const content = group.passageContent;
    const blankRegex = /\[(\d{3})\]/g;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = blankRegex.exec(content)) !== null) {
      const matchIndex = match.index;
      const blankNum = parseInt(match[1], 10);

      // Text chunk before the blank
      if (matchIndex > lastIndex) {
        elements.push(
          <span key={`text-${lastIndex}`}>
            {content.substring(lastIndex, matchIndex)}
          </span>
        );
      }

      const qNum = blankNum; // In ETS Mock Form, blankNumber is global question number
      const isCurrentActive = activeQuestionNumber === qNum;
      const selectedChoice = answers[qNum]?.selectedChoice ?? null;

      elements.push(
        <button
          key={`blank-${blankNum}`}
          type="button"
          onClick={() => {
            onFocusQuestion(qNum);
            setMobileTab('questions');
            questionRefs.current[qNum]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }}
          className={`inline-flex items-center justify-center font-mono font-bold text-xs sm:text-sm px-2.5 py-1 mx-1.5 rounded-lg border transition-all cursor-pointer select-none ${
            isCurrentActive
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md ring-2 ring-indigo-400/50 scale-105'
              : selectedChoice
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-400 dark:border-indigo-600'
              : 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-dashed border-amber-400 dark:border-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/40'
          }`}
          title={`Bấm để chuyển tới Câu ${qNum}`}
        >
          <span>[{blankNum}]</span>
          {selectedChoice && (
            <span className="ml-1 px-1 rounded bg-indigo-700 dark:bg-indigo-600 text-white font-extrabold text-[11px]">
              {selectedChoice}
            </span>
          )}
        </button>
      );

      lastIndex = matchIndex + match[0].length;
    }

    if (lastIndex < content.length) {
      elements.push(
        <span key={`text-${lastIndex}`}>{content.substring(lastIndex)}</span>
      );
    }

    return elements;
  }, [group.passageContent, questions, activeQuestionNumber, answers, onFocusQuestion]);

  return (
    <div
      className="w-full max-w-7xl mx-auto space-y-4 animate-in fade-in duration-150"
      data-testid="exam-part6-renderer"
    >
      {/* Group Context Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider">
            Part 6: Text Completion
          </span>
          <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
            Câu {startBlank}–{endBlank} (Nhóm 4 câu)
          </span>
        </div>

        {/* Mobile Tabs Switcher */}
        <div className="lg:hidden flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setMobileTab('passage')}
            type="button"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mobileTab === 'passage'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Đoạn Văn ({startBlank}–{endBlank})
          </button>
          <button
            onClick={() => setMobileTab('questions')}
            type="button"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mobileTab === 'questions'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Câu Hỏi (4 câu)
          </button>
        </div>
      </div>

      {/* Two-Pane Split Layout (Desktop Side-by-Side, Mobile Tabbed) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Passage Display */}
        <div
          className={`lg:col-span-6 xl:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col space-y-5 lg:sticky lg:top-24 max-h-[calc(100vh-180px)] overflow-y-auto ${
            mobileTab === 'passage' ? 'block' : 'hidden lg:flex'
          }`}
        >
          {/* Document Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                {getDocumentIcon()}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {group.passageType.toUpperCase()}
              </span>
            </div>
            {group.passageTitle && (
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-xs">
                {group.passageTitle}
              </span>
            )}
          </div>

          {/* Interactive Passage Body */}
          <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
            {renderedPassage}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 dark:text-slate-500 italic">
            * Mẹo: Bấm trực tiếp vào các ô [{startBlank}]..[{endBlank}] trong bài đọc để chuyển nhanh đến câu hỏi tương ứng.
          </div>
        </div>

        {/* Right Pane: Group Questions */}
        <div
          className={`lg:col-span-6 xl:col-span-5 space-y-5 max-h-[calc(100vh-180px)] overflow-y-auto pr-1 ${
            mobileTab === 'questions' ? 'block' : 'hidden lg:block'
          }`}
        >
          {sortedQuestions.map((q) => {
            const qNum = q.blankNumber;
            const isCurrentActive = activeQuestionNumber === qNum;
            const isFlagged = Boolean(flaggedQuestions[qNum]);
            const selectedChoice = answers[qNum]?.selectedChoice ?? null;

            return (
              <div
                key={q.id}
                ref={(el) => {
                  questionRefs.current[qNum] = el;
                }}
                className={`bg-white dark:bg-slate-900 border rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 transition-all ${
                  isCurrentActive
                    ? 'border-indigo-500 dark:border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Question Item Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span
                      onClick={() => onFocusQuestion(qNum)}
                      className={`font-mono font-bold text-xs px-2.5 py-1 rounded-xl cursor-pointer ${
                        isCurrentActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Câu {qNum} [{q.blankNumber}]
                    </span>

                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-medium capitalize">
                      {q.questionType === 'sentence_insertion'
                        ? 'Chèn câu'
                        : q.questionType === 'vocabulary'
                        ? 'Từ vựng'
                        : 'Ngữ pháp'}
                    </span>
                  </div>

                  {/* Flag Button */}
                  <button
                    onClick={() => onToggleFlag(qNum)}
                    type="button"
                    className={`p-1.5 rounded-lg border text-xs transition-all ${
                      isFlagged
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:text-amber-500'
                    }`}
                    title="Gắn cờ câu hỏi"
                  >
                    <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Question Prompt (if sentence insertion or explicit question) */}
                {q.question && (
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                    {q.question}
                  </p>
                )}

                {/* 4 Choices (A, B, C, D) */}
                <div className="grid grid-cols-1 gap-2 pt-1">
                  {q.options.map((opt) => {
                    const isSelected = selectedChoice === opt.key;

                    return (
                      <button
                        key={opt.key}
                        onClick={() => {
                          if (!isLocked) {
                            onFocusQuestion(qNum);
                            onSelectChoice(qNum, opt.key);
                          }
                        }}
                        disabled={isLocked}
                        type="button"
                        className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-600 dark:border-indigo-500 text-indigo-950 dark:text-indigo-100 font-semibold'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                        } ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span
                          className={`shrink-0 w-6 h-6 rounded-lg font-bold font-mono text-xs flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {isSelected ? <Check className="w-3.5 h-3.5" /> : opt.key}
                        </span>

                        <span className="flex-1 pt-0.5 leading-relaxed">
                          {opt.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
