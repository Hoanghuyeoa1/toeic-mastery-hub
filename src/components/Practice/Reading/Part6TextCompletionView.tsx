/**
 * TOEIC Mastery Hub — Part 6 Text Completion Specialized View
 * Phase 8: Reading Practice Workspace
 *
 * Dedicated UI for Part 6:
 * - Left Pane: Full passage with authentic workplace header (Email, Memo, Notice...)
 * - Interactive blanks: Exact mapping [131], [132], [133], [134]
 * - Click blank in text to select corresponding question
 * - Dynamic highlighting: Active blank glows and shows selected answer badge
 * - Right Pane: Group questions (Word Form, Vocabulary, Sentence Insertion)
 * - Independent scroll container for passage preserving reading position
 * - Practice Mode: toggleable explanations
 * - Timed Mode: strictly hides explanations
 */

import React, { useState } from 'react';
import {
  FileText,
  Mail,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';
import { Part6Group, Part6Question, StandardChoiceKey } from '../../../types/questionBank';

export interface Part6TextCompletionViewProps {
  group: Part6Group;
  questions: Part6Question[];
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

export const Part6TextCompletionView: React.FC<Part6TextCompletionViewProps> = ({
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

  // Find active question object
  const activeQuestion = questions.find((q) => q.id === activeQuestionId) || questions[0];
  const activeBlankNumber = activeQuestion?.blankNumber;

  // Icon based on passageType
  const getPassageIcon = () => {
    switch (group.passageType) {
      case 'email':
      case 'letter':
        return <Mail className="w-4 h-4 text-sky-400" />;
      default:
        return <FileText className="w-4 h-4 text-emerald-400" />;
    }
  };

  /**
   * Render passage text parsing all [131] ... [146] blanks into interactive badges
   */
  const renderInteractivePassage = () => {
    const content = group.passageContent;
    // Regex matching [131], [132], etc.
    const blankRegex = /\[(\d{3})\]/g;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = blankRegex.exec(content)) !== null) {
      const matchIndex = match.index;
      const blankNum = parseInt(match[1], 10);

      // Push text before blank
      if (matchIndex > lastIndex) {
        elements.push(
          <span key={`text-${lastIndex}`}>{content.substring(lastIndex, matchIndex)}</span>
        );
      }

      // Find question for this blank
      const qForBlank = questions.find((q) => q.blankNumber === blankNum);
      const isCurrentActive = activeBlankNumber === blankNum;
      const chosenAnswer = qForBlank ? answers[qForBlank.id] : null;

      elements.push(
        <button
          key={`blank-${blankNum}`}
          type="button"
          onClick={() => {
            if (qForBlank) {
              onNavigateToQuestionId(qForBlank.id);
              setMobileTab('questions');
            }
          }}
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 mx-1 rounded-md text-xs font-mono font-bold transition-all border ${
            isCurrentActive
              ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.5)] ring-2 ring-blue-400/50 scale-105'
              : chosenAnswer
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/80 hover:bg-emerald-900/80'
              : 'bg-amber-500/15 text-amber-300 border-amber-500/60 hover:bg-amber-500/25'
          }`}
          title={`Vị trí [${blankNum}] - Bấm để chọn câu hỏi`}
        >
          <span>[{blankNum}]</span>
          {chosenAnswer && (
            <span
              className={`px-1 py-0.2 rounded text-[10px] ${
                isCurrentActive ? 'bg-blue-800 text-white' : 'bg-emerald-800 text-emerald-200'
              }`}
            >
              {chosenAnswer}
            </span>
          )}
        </button>
      );

      lastIndex = matchIndex + match[0].length;
    }

    // Push trailing text
    if (lastIndex < content.length) {
      elements.push(<span key={`text-${lastIndex}`}>{content.substring(lastIndex)}</span>);
    }

    return elements;
  };

  return (
    <div className="w-full space-y-4" data-testid="part6-view">
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
          {getPassageIcon()}
          <span>Văn bản bài đọc</span>
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
          <span>Câu hỏi nhóm ({questions.length})</span>
          {activeBlankNumber && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-700">
              [{activeBlankNumber}]
            </span>
          )}
        </button>
      </div>

      {/* Main Split Layout: Left Passage | Right Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ========================================================= */}
        {/* LEFT PANE: Full Passage Content (7 Cols Desktop)          */}
        {/* ========================================================= */}
        <section
          className={`lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 ${
            mobileTab === 'questions' ? 'hidden lg:block' : 'block'
          }`}
          data-testid="part6-passage-pane"
        >
          {/* Passage Header */}
          <div className="pb-3 border-b border-zinc-800 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-zinc-800 border border-zinc-700/60">
                  {getPassageIcon()}
                </span>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                  {group.passageType}
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-xs text-zinc-400">{group.topic}</span>
              </div>
              {group.passageTitle && (
                <h2 className="text-sm sm:text-base font-bold text-zinc-100 mt-1">
                  {group.passageTitle}
                </h2>
              )}
            </div>

            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60 shrink-0">
              4 chỗ trống
            </span>
          </div>

          {/* Context Intro notice */}
          {group.contextIntro && (
            <div className="text-xs italic text-zinc-400 bg-zinc-950/50 p-2.5 rounded-lg border border-zinc-800/60">
              {group.contextIntro}
            </div>
          )}

          {/* Passage Body with scroll control */}
          <div className="p-4 sm:p-5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 font-sans text-sm sm:text-base leading-relaxed text-zinc-200 whitespace-pre-line max-h-[520px] overflow-y-auto selection:bg-blue-600/30">
            {renderInteractivePassage()}
          </div>

          <p className="text-[11px] text-zinc-500 italic text-center">
            Mẹo: Nhấn trực tiếp vào ô số [131]..[134] trong bài đọc để chuyển nhanh đến câu hỏi tương ứng.
          </p>
        </section>

        {/* ========================================================= */}
        {/* RIGHT PANE: Group Questions & Choices (5 Cols Desktop)   */}
        {/* ========================================================= */}
        <section
          className={`lg:col-span-5 space-y-4 ${
            mobileTab === 'passage' ? 'hidden lg:block' : 'block'
          }`}
          data-testid="part6-questions-pane"
        >
          {/* Question Selector Tabs (131, 132, 133, 134) */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex items-center justify-between gap-1 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 pl-1">
              Câu hỏi:
            </span>
            <div className="flex items-center gap-1.5">
              {questions.map((q) => {
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
                    <span>[{q.blankNumber}]</span>
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
              {/* Question Header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-100 bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-700">
                    Vị trí [{activeQuestion.blankNumber}]
                  </span>
                  <span className="text-[11px] font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 capitalize">
                    {activeQuestion.questionType === 'sentence_insertion'
                      ? 'Chèn câu'
                      : activeQuestion.questionType === 'grammar'
                      ? 'Ngữ pháp'
                      : 'Từ vựng'}
                  </span>
                </div>

                <span className="text-[11px] font-mono text-zinc-500">
                  Câu {questions.indexOf(activeQuestion) + 1} / {questions.length} trong nhóm
                </span>
              </div>

              {/* Question Prompt */}
              {activeQuestion.question && (
                <p className="text-xs font-semibold text-zinc-300">
                  {activeQuestion.question}
                </p>
              )}

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

              {/* Assistance / Explanation (Practice Mode) */}
              {showAssistance && activeQuestion.explanation && (
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Giải thích [{activeQuestion.blankNumber}]</span>
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
          Đã hoàn thành {questions.filter((q) => answers[q.id]).length}/{questions.length} câu trong nhóm
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
