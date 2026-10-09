/**
 * TOEIC Mastery Hub — Part 7 Reading Comprehension Specialized View
 * Phase 8: Reading Practice Workspace
 *
 * Dedicated UI for Part 7:
 * - Supports Single, Double, and Triple passages
 * - Authentic presentation for diverse formats (email, memo, notice, schedule, form/invoice, chat)
 * - Multi-passage navigation (Jump pills + stacked views for cross-text synthesis)
 * - Questions pane with questionType badges & cross-text reference indicators
 * - Independent scrolling for passages and questions
 * - Preserves context and answers when switching questions within the group
 * - Practice Mode: toggleable explanations
 * - Timed Mode: strictly hides explanations
 */

import React, { useState, useRef } from 'react';
import {
  FileText,
  Mail,
  Calendar,
  Receipt,
  MessageSquare,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import {
  Part7Group,
  Part7Question,
  ReadingPassageItem,
  StandardChoiceKey,
} from '../../../types/questionBank';

export interface Part7ReadingComprehensionViewProps {
  group: Part7Group;
  questions: Part7Question[];
  activeQuestionId: string;
  answers: Record<string, StandardChoiceKey | null>;
  onSelectChoice: (questionId: string, choice: StandardChoiceKey) => void;
  onNavigateToQuestionId: (questionId: string) => void;
  isLocked: boolean;
  showAssistance?: boolean;
  onPrevGroup?: () => void;
  onNextGroup?: () => void;
  isFirstGroup?: boolean;
  isLastGroup?: boolean;
}

export const Part7ReadingComprehensionView: React.FC<Part7ReadingComprehensionViewProps> = ({
  group,
  questions,
  activeQuestionId,
  answers,
  onSelectChoice,
  onNavigateToQuestionId,
  isLocked,
  showAssistance = false,
  onPrevGroup,
  onNextGroup,
  isFirstGroup = false,
  isLastGroup = false,
}) => {
  // Mobile tab toggle between "Đoạn văn" and "Câu hỏi"
  const [mobileTab, setMobileTab] = useState<'passage' | 'questions'>('passage');

  // Multi-passage active tab for quick jumping (if double/triple)
  const [activePassageIndex, setActivePassageIndex] = useState(0);

  // References to passage elements for smooth scrolling
  const passageContainerRef = useRef<HTMLDivElement>(null);

  const activeQuestion = questions.find((q) => q.id === activeQuestionId) || questions[0];
  const activeQuestionIndex = questions.indexOf(activeQuestion);

  // Format icon helper
  const getFormatIcon = (formatType?: string) => {
    switch (formatType) {
      case 'email':
      case 'letter':
        return <Mail className="w-3.5 h-3.5 text-sky-400" />;
      case 'schedule':
        return <Calendar className="w-3.5 h-3.5 text-amber-400" />;
      case 'form':
      case 'invoice':
        return <Receipt className="w-3.5 h-3.5 text-emerald-400" />;
      case 'chat':
        return <MessageSquare className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  // Format question type label
  const getQuestionTypeLabel = (qType?: string) => {
    switch (qType) {
      case 'main_idea':
        return 'Ý chính';
      case 'detail':
        return 'Chi tiết';
      case 'inference':
        return 'Suy luận';
      case 'cross_text_synthesis':
        return 'Tổng hợp đa văn bản';
      case 'vocabulary_in_context':
        return 'Từ vựng trong ngữ cảnh';
      case 'sentence_insertion':
        return 'Chèn câu';
      case 'negative_fact':
        return 'Thông tin không đúng';
      default:
        return 'Đọc hiểu';
    }
  };

  return (
    <div className="w-full space-y-4" data-testid="part7-view">
      {/* Mobile Tab Toggle Bar */}
      <div className="lg:hidden flex rounded-xl bg-zinc-900 p-1 border border-zinc-800">
        <button
          type="button"
          onClick={() => setMobileTab('passage')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'passage'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Văn bản ({group.passages.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('questions')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'questions'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span>Câu hỏi ({questions.length})</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-700">
            Q{activeQuestionIndex + 1}
          </span>
        </button>
      </div>

      {/* Main Split Layout: Left Passages (7 Cols) | Right Questions (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ========================================================= */}
        {/* LEFT PANE: Passages Container                            */}
        {/* ========================================================= */}
        <section
          className={`lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 ${
            mobileTab === 'questions' ? 'hidden lg:block' : 'block'
          }`}
          data-testid="part7-passage-pane"
        >
          {/* Header Bar */}
          <div className="pb-3 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span className="uppercase font-mono">
                  {group.passageFormat === 'triple'
                    ? 'Triple Passages (3 văn bản)'
                    : group.passageFormat === 'double'
                    ? 'Double Passages (2 văn bản)'
                    : 'Single Passage (1 văn bản)'}
                </span>
              </span>
              <span className="text-xs text-zinc-400 font-medium">{group.topic}</span>
            </div>

            <span className="text-[11px] font-mono text-zinc-500">
              {questions.length} câu hỏi liên quan
            </span>
          </div>

          {/* Context Intro notice */}
          {group.contextIntro && (
            <div className="text-xs italic text-zinc-400 bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/60">
              {group.contextIntro}
            </div>
          )}

          {/* Quick-Jump Passage Tabs (For Double / Triple) */}
          {group.passages.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Xem nhanh:
              </span>
              {group.passages.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePassageIndex(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    activePassageIndex === idx
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700/60 hover:bg-zinc-750 hover:text-zinc-200'
                  }`}
                >
                  {getFormatIcon(p.formatType)}
                  <span>
                    Văn bản {idx + 1}
                    {p.formatType ? ` (${p.formatType})` : ''}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Passages Body Container with independent scroll */}
          <div
            ref={passageContainerRef}
            className="space-y-4 max-h-[560px] overflow-y-auto pr-1 selection:bg-blue-600/30"
          >
            {group.passages.map((passage, idx) => {
              const isHighlighted = group.passages.length > 1 && activePassageIndex === idx;

              return (
                <article
                  key={passage.id}
                  className={`rounded-xl border transition-all ${
                    isHighlighted
                      ? 'bg-zinc-950/90 border-blue-500/60 ring-1 ring-blue-500/30'
                      : 'bg-zinc-950/60 border-zinc-800/80'
                  } p-4 sm:p-5 space-y-3`}
                >
                  {/* Passage Title & Format Badge */}
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-zinc-800 border border-zinc-700/60">
                        {getFormatIcon(passage.formatType)}
                      </span>
                      <h3 className="font-bold text-xs sm:text-sm text-zinc-100">
                        {passage.title || `Văn bản ${idx + 1}`}
                      </h3>
                    </div>
                    {passage.formatType && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 uppercase">
                        {passage.formatType}
                      </span>
                    )}
                  </div>

                  {/* Passage Text Content */}
                  <div className="font-sans text-xs sm:text-sm leading-relaxed text-zinc-200 whitespace-pre-line">
                    {passage.content}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* RIGHT PANE: Questions & Choices (5 Cols)                  */}
        {/* ========================================================= */}
        <section
          className={`lg:col-span-5 space-y-4 ${
            mobileTab === 'passage' ? 'hidden lg:block' : 'block'
          }`}
          data-testid="part7-questions-pane"
        >
          {/* Question Selector Tabs */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex items-center justify-between gap-1 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 pl-1">
              Câu hỏi:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {questions.map((q, idx) => {
                const isActive = q.id === activeQuestionId;
                const isAnswered = answers[q.id] !== null && answers[q.id] !== undefined;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => onNavigateToQuestionId(q.id)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all border flex items-center gap-1 ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-1 ring-blue-400'
                        : isAnswered
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900/80'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700/60 hover:bg-zinc-750'
                    }`}
                  >
                    <span>Q{idx + 1}</span>
                    {isAnswered && (
                      <span className="text-[10px] font-semibold text-emerald-400">
                        {answers[q.id]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Question Card */}
          {activeQuestion && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
              {/* Question Header & Badges */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-100 bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-700 font-mono">
                    Câu {activeQuestionIndex + 1}/{questions.length}
                  </span>
                  {activeQuestion.questionType && (
                    <span className="text-[11px] font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {getQuestionTypeLabel(activeQuestion.questionType)}
                    </span>
                  )}
                </div>

                {/* Cross-Text Synthesis indicator */}
                {activeQuestion.crossTextReference && (
                  <span className="text-[10px] font-medium text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    <span>Đa văn bản</span>
                  </span>
                )}
              </div>

              {/* Question Stem */}
              <h4 className="text-sm font-semibold text-zinc-100 leading-snug">
                {activeQuestion.question}
              </h4>

              {/* Options List */}
              <div className="space-y-2.5 pt-1">
                {activeQuestion.options.map((opt) => {
                  const isSelected = answers[activeQuestion.id] === opt.key;

                  return (
                    <button
                      key={opt.key}
                      type="button"
                      disabled={isLocked}
                      onClick={() => onSelectChoice(activeQuestion.id, opt.key)}
                      className={`w-full flex items-start gap-3 p-3.5 rounded-xl text-left transition-all border ${
                        isSelected
                          ? 'bg-blue-600/15 border-blue-500 text-zinc-100 shadow-[0_0_12px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/40'
                          : 'bg-zinc-850/60 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700'
                      } ${isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                    >
                      <span
                        className={`flex items-center justify-center w-6 h-6 rounded-lg text-xs font-mono font-bold shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700/60'
                        }`}
                      >
                        {opt.key}
                      </span>
                      <div className="flex-1 pt-0.5">
                        <span className="text-xs sm:text-sm font-medium leading-relaxed block text-zinc-100">
                          {opt.text}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Practice Mode: Assistance / Explanation */}
              {showAssistance && activeQuestion.explanation && (
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Giải thích chi tiết</span>
                    <span className="font-mono text-emerald-400 ml-auto bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded text-[11px]">
                      Đáp án đúng: ({activeQuestion.correctKey})
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed pt-1">
                    {activeQuestion.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Group Navigation Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
        <button
          type="button"
          onClick={onPrevGroup}
          disabled={isFirstGroup}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            isFirstGroup
              ? 'opacity-40 cursor-not-allowed bg-zinc-900 border-zinc-800 text-zinc-600'
              : 'bg-zinc-800 hover:bg-zinc-750 border-zinc-700 text-zinc-200'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Nhóm trước</span>
        </button>

        <span className="text-xs font-mono text-zinc-500">
          Đã làm {questions.filter((q) => answers[q.id]).length}/{questions.length} câu trong nhóm
        </span>

        <button
          type="button"
          onClick={onNextGroup}
          disabled={isLastGroup}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            isLastGroup
              ? 'opacity-40 cursor-not-allowed bg-zinc-900 border-zinc-800 text-zinc-600'
              : 'bg-blue-600 hover:bg-blue-500 border-blue-500 text-white shadow-sm'
          }`}
        >
          <span>Nhóm tiếp theo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
