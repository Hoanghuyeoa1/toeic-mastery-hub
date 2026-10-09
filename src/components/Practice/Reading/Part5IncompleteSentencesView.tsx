/**
 * TOEIC Mastery Hub — Part 5 Incomplete Sentences Specialized View
 * Phase 8: Reading Practice Workspace
 *
 * Dedicated UI for Part 5:
 * - Displays sentence with prominent blank highlighting (previewing selected answer inside blank)
 * - 4 standard choices A, B, C, D with clear text and keyboard accelerators
 * - Practice Mode: toggleable explanation drawer
 * - Timed Mode: strictly hides explanations
 * - Preserves answer across transitions
 */

import React from 'react';
import { ChevronLeft, ChevronRight, HelpCircle, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { Part5Question, StandardChoiceKey } from '../../../types/questionBank';

export interface Part5IncompleteSentencesViewProps {
  question: Part5Question;
  selectedChoice: StandardChoiceKey | null;
  onSelectChoice: (key: StandardChoiceKey) => void;
  isLocked: boolean;
  showAssistance?: boolean;
  onPrevQuestion?: () => void;
  onNextQuestion?: () => void;
  isFirstQuestion?: boolean;
  isLastQuestion?: boolean;
}

export const Part5IncompleteSentencesView: React.FC<Part5IncompleteSentencesViewProps> = ({
  question,
  selectedChoice,
  onSelectChoice,
  isLocked,
  showAssistance = false,
  onPrevQuestion,
  onNextQuestion,
  isFirstQuestion = false,
  isLastQuestion = false,
}) => {
  // Render sentence with dynamic styled blank
  const renderSentenceWithBlank = () => {
    const rawSentence = question.sentence;
    const parts = rawSentence.split(/_____|______/g);

    if (parts.length < 2) {
      return <span>{rawSentence}</span>;
    }

    return (
      <span className="leading-relaxed text-zinc-100 text-base sm:text-lg">
        {parts[0]}
        <span
          className={`inline-flex items-center justify-center min-w-[70px] px-3 py-0.5 mx-1.5 rounded-lg border font-mono font-bold text-sm transition-all ${
            selectedChoice
              ? 'bg-blue-600/20 text-blue-300 border-blue-500/80 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
              : 'bg-amber-500/10 text-amber-300 border-dashed border-amber-500/60'
          }`}
          title="Vị trí điền từ"
        >
          {selectedChoice ? `(${selectedChoice})` : '_____'}
        </span>
        {parts.slice(1).join('_____')}
      </span>
    );
  };

  return (
    <div className="w-full space-y-6" data-testid="part5-view">
      {/* 1. Question Context Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-sm space-y-5">
        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              {question.grammarCategory || 'Ngữ Pháp / Từ Vựng'}
            </span>
            {question.topic && (
              <span className="text-xs text-zinc-400 font-medium">
                {question.topic}
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60 uppercase">
            {question.difficulty}
          </span>
        </div>

        {/* Incomplete Sentence Prompt */}
        <div className="py-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
            Điền từ hoặc cụm từ thích hợp vào chỗ trống:
          </h2>
          <div className="p-4 sm:p-5 rounded-xl bg-zinc-950/70 border border-zinc-800/90 font-medium">
            {renderSentenceWithBlank()}
          </div>
        </div>

        {/* 2. Options Grid (A, B, C, D) */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Lựa chọn đáp án (Nhấn A, B, C, D để chọn nhanh):
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options.map((opt) => {
              const isSelected = selectedChoice === opt.key;

              return (
                <button
                  key={opt.key}
                  type="button"
                  disabled={isLocked}
                  onClick={() => onSelectChoice(opt.key)}
                  className={`flex items-start gap-3 p-4 rounded-xl text-left transition-all border ${
                    isSelected
                      ? 'bg-blue-600/15 border-blue-500 text-zinc-100 shadow-[0_0_15px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/40'
                      : 'bg-zinc-850/60 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700'
                  } ${isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                >
                  <span
                    className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-mono font-bold shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700/60'
                    }`}
                  >
                    {opt.key}
                  </span>
                  <div className="flex-1 pt-0.5">
                    <span className="text-sm font-medium leading-relaxed block text-zinc-100">
                      {opt.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Assistance / Explanation Drawer (Practice Mode) */}
        {showAssistance && question.explanation && (
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/50 space-y-2 animate-in fade-in">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Giải Thích Đáp Án Chi Tiết</span>
              <span className="font-mono text-emerald-400 ml-auto bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded text-[11px]">
                Đáp án đúng: ({question.correctKey})
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed pt-1">
              {question.explanation}
            </p>
          </div>
        )}

        {/* 4. Bottom Navigation Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          <button
            type="button"
            onClick={onPrevQuestion}
            disabled={isFirstQuestion}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isFirstQuestion
                ? 'opacity-40 cursor-not-allowed bg-zinc-900 border-zinc-800 text-zinc-600'
                : 'bg-zinc-800 hover:bg-zinc-750 border-zinc-700 text-zinc-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Câu trước</span>
          </button>

          <span className="text-xs text-zinc-500 font-mono">
            {selectedChoice ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Đã chọn ({selectedChoice})
              </span>
            ) : (
              <span className="text-zinc-500 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" /> Chưa trả lời
              </span>
            )}
          </span>

          <button
            type="button"
            onClick={onNextQuestion}
            disabled={isLastQuestion}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isLastQuestion
                ? 'opacity-40 cursor-not-allowed bg-zinc-900 border-zinc-800 text-zinc-600'
                : 'bg-blue-600 hover:bg-blue-500 border-blue-500 text-white shadow-sm'
            }`}
          >
            <span>Câu tiếp theo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
