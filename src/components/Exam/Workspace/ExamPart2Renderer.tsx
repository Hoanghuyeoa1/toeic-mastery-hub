/**
 * TOEIC Mastery Hub — Exam Part 2 Question-Response Renderer (Phase 14)
 *
 * Requirements:
 * - Strictly 3 answer choices: A, B, C (Choice D strictly absent and prohibited).
 * - Prompt and statement texts are concealed per official ETS test format.
 * - Audio-only recitation cues.
 * - Flag toggle and keyboard shortcut support (A, B, C).
 * - Zero audio replay logic inside renderer.
 */

import React from 'react';
import { Bookmark, Volume2, Radio, Headphones } from 'lucide-react';
import { ExamPart2RendererProps } from '../../../types/examWorkspace';
import { StandardChoiceKey } from '../../../types/questionBank';

export const ExamPart2Renderer: React.FC<ExamPart2RendererProps> = ({
  question,
  globalQuestionNumber,
  answer,
  onSelectChoice,
  onToggleFlag,
  isLocked,
}) => {
  // Part 2 strictly only provides 3 options A, B, C
  const choices: StandardChoiceKey[] = ['A', 'B', 'C'];

  return (
    <div
      className="w-full max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200"
      data-testid="exam-part2-renderer"
    >
      {/* Question Header & Review Flag */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            PART 2: QUESTION-RESPONSE — CÂU {globalQuestionNumber} / 200
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Question {globalQuestionNumber}</span>
          </h2>
        </div>

        <button
          type="button"
          onClick={onToggleFlag}
          disabled={isLocked}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
            answer.isMarkedForReview
              ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
          }`}
          title="Đánh dấu câu hỏi cần xem lại trên Answer Sheet"
        >
          <Bookmark className={`w-3.5 h-3.5 ${answer.isMarkedForReview ? 'fill-current' : ''}`} />
          <span>{answer.isMarkedForReview ? 'Đã Gắn Cờ' : 'Gắn Cờ (M)'}</span>
        </button>
      </div>

      {/* Audio Recitation Prompt Visualizer */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/70 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto border border-indigo-500/20">
          <Headphones className="w-6 h-6 animate-pulse" />
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Lắng nghe câu hỏi và 3 phương án phản hồi qua audio
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Trong đề thi TOEIC thực tế, phần nội dung câu hỏi và các lựa chọn A, B, C của Part 2 không được in trên đề thi. Hãy lắng nghe và đánh dấu câu trả lời tốt nhất.
          </p>
        </div>
      </div>

      {/* Exactly 3 Choices: A, B, C */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Chọn 1 trong 3 phương án:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {choices.map((choiceKey) => {
            const isSelected = answer.selectedChoice === choiceKey;

            return (
              <button
                key={choiceKey}
                type="button"
                onClick={() => onSelectChoice(choiceKey)}
                disabled={isLocked}
                className={`p-5 rounded-2xl border text-center font-extrabold transition-all flex flex-col items-center justify-center gap-1.5 active:scale-95 ${
                  isLocked
                    ? 'opacity-60 cursor-not-allowed border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-850'
                    : isSelected
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30 scale-102 ring-2 ring-indigo-400/40'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20'
                }`}
                data-testid={`choice-${choiceKey}`}
              >
                <span
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                    isSelected
                      ? 'bg-white text-indigo-700 font-black shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {choiceKey}
                </span>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-300">
                  Phương án ({choiceKey})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Part 2 Rule Confirmation */}
      <div className="p-3.5 rounded-xl border border-indigo-200/60 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 text-xs text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 shrink-0 text-indigo-500" />
          <span>Part 2 không có phương án (D). Chỉ có 3 lựa chọn A, B, C.</span>
        </span>
        <span className="font-mono text-[11px] text-slate-400">Phím tắt: [A] [B] [C]</span>
      </div>
    </div>
  );
};
