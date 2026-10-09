/**
 * TOEIC Mastery Hub — Exam Part 7 Reading Comprehension Renderer (Phase 15)
 *
 * Dedicated exam surface for Part 7 (Questions 147–200, 15 groups, 54 questions):
 * - Supports Single (10 groups, 29 Qs), Double (2 groups, 10 Qs), and Triple Passages (3 groups, 15 Qs).
 * - Workplace document presentation: Emails, Letters, Schedules, Forms, Invoices, Notices, Chats, Articles.
 * - Split-pane layout on desktop: Left passage container with smooth jump navigation between multi-texts;
 *   Right questions container rendering all 2–5 linked group questions.
 * - Cross-Text Synthesis indicator badges on questions requiring evidence across multiple passages.
 * - Independent scroll preservation: Switching active questions never resets passage scroll state.
 * - Responsive mobile view with instant Passage / Questions toggle.
 * - Strictly conceals answer keys, translations, and explanations during the live exam.
 */

import React, { useState, useRef } from 'react';
import {
  FileText,
  Mail,
  Calendar,
  Receipt,
  MessageSquare,
  Flag,
  Check,
  Layers,
  Sparkles,
  ArrowDown,
} from 'lucide-react';
import {
  Part7Group,
  Part7Question,
  StandardChoiceKey,
} from '../../../types/questionBank';

export interface ExamPart7QuestionItem {
  question: Part7Question;
  globalQuestionNumber: number;
}

export interface ExamPart7RendererProps {
  group: Part7Group;
  questionsWithNumbers: ExamPart7QuestionItem[];
  activeQuestionNumber: number;
  answers: Record<number, { selectedChoice: StandardChoiceKey | null }>;
  flaggedQuestions: Record<number, boolean>;
  onSelectChoice: (questionNumber: number, choice: StandardChoiceKey) => void;
  onToggleFlag: (questionNumber: number) => void;
  onFocusQuestion: (questionNumber: number) => void;
  isLocked: boolean;
}

export const ExamPart7Renderer: React.FC<ExamPart7RendererProps> = ({
  group,
  questionsWithNumbers,
  activeQuestionNumber,
  answers,
  flaggedQuestions,
  onSelectChoice,
  onToggleFlag,
  onFocusQuestion,
  isLocked,
}) => {
  // Mobile tab toggle ('passage' vs 'questions')
  const [mobileTab, setMobileTab] = useState<'passage' | 'questions'>('passage');

  // Multi-passage jump anchors ref
  const passageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Document format icon
  const getFormatIcon = (formatType?: string) => {
    switch (formatType) {
      case 'email':
      case 'letter':
        return <Mail className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />;
      case 'schedule':
        return <Calendar className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />;
      case 'form':
      case 'invoice':
        return <Receipt className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />;
      case 'chat':
        return <MessageSquare className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />;
    }
  };

  // Group range label
  const startQ = questionsWithNumbers[0]?.globalQuestionNumber ?? 147;
  const endQ = questionsWithNumbers[questionsWithNumbers.length - 1]?.globalQuestionNumber ?? 200;
  const formatBadge =
    group.passageFormat === 'triple'
      ? 'Triple Passage (3 Bài Đọc)'
      : group.passageFormat === 'double'
      ? 'Double Passage (2 Bài Đọc)'
      : 'Single Passage (1 Bài Đọc)';

  const jumpToPassage = (passageId: string) => {
    passageRefs.current[passageId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="w-full max-w-7xl mx-auto space-y-4 animate-in fade-in duration-150"
      data-testid="exam-part7-renderer"
    >
      {/* Group Context Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider">
            Part 7: Reading Comprehension
          </span>
          <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
            Câu {startQ}–{endQ} ({questionsWithNumbers.length} câu)
          </span>
          <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
            {formatBadge}
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
            Bài Đọc ({group.passages.length} văn bản)
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
            Câu Hỏi ({questionsWithNumbers.length})
          </button>
        </div>
      </div>

      {/* Two-Pane Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Reading Passages */}
        <div
          className={`lg:col-span-6 xl:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col space-y-6 lg:sticky lg:top-24 max-h-[calc(100vh-180px)] overflow-y-auto ${
            mobileTab === 'passage' ? 'block' : 'hidden lg:flex'
          }`}
        >
          {/* Quick Jump Navigation for Multi-Passages */}
          {group.passages.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                Chuyển nhanh:
              </span>
              {group.passages.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => jumpToPassage(p.id)}
                  type="button"
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  {getFormatIcon(p.formatType)}
                  <span>Văn bản {idx + 1}</span>
                  <ArrowDown className="w-3 h-3 opacity-60" />
                </button>
              ))}
            </div>
          )}

          {/* Stacked Passages Rendering */}
          <div className="space-y-6">
            {group.passages.map((p, idx) => (
              <div
                key={p.id}
                ref={(el) => {
                  passageRefs.current[p.id] = el;
                }}
                className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/90 space-y-4"
              >
                {/* Passage Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      {getFormatIcon(p.formatType)}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      {group.passages.length > 1 ? `[Văn bản ${idx + 1}] ` : ''}
                      {p.formatType ? p.formatType.toUpperCase() : 'DOCUMENT'}
                    </span>
                  </div>

                  {p.title && (
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-xs">
                      {p.title}
                    </span>
                  )}
                </div>

                {/* Passage Text Content */}
                <div className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line font-normal">
                  {p.content}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-slate-400 dark:text-slate-500 italic">
            * Đọc kỹ văn bản và đối chiếu thông tin để trả lời các câu hỏi bên phải.
          </div>
        </div>

        {/* Right Pane: Questions List */}
        <div
          className={`lg:col-span-6 xl:col-span-5 space-y-5 max-h-[calc(100vh-180px)] overflow-y-auto pr-1 ${
            mobileTab === 'questions' ? 'block' : 'hidden lg:block'
          }`}
        >
          {questionsWithNumbers.map(({ question: q, globalQuestionNumber: qNum }) => {
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
                {/* Question Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      onClick={() => onFocusQuestion(qNum)}
                      className={`font-mono font-bold text-xs px-2.5 py-1 rounded-xl cursor-pointer ${
                        isCurrentActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Câu {qNum}
                    </span>

                    {/* Cross-Text Synthesis Badge */}
                    {q.crossTextReference && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[10px] font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Tổng Hợp Đa Văn Bản
                      </span>
                    )}
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

                {/* Question Prompt */}
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                  {q.question}
                </p>

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
