/**
 * TOEIC Mastery Hub — Part 2 Question-Response View
 * Phase 7: Listening Practice Workspace
 *
 * Requirements:
 * - Plays audio prompt question followed by 3 choices (A, B, C).
 * - Strictly renders 3 choices (A, B, C) — does NOT force a 4th option D.
 * - Does NOT display prompt script or option texts by default during listening test.
 * - Practice Mode can reveal script and trap notes when assistance is toggled.
 */

import React from 'react';
import { Part2Question, Part2ChoiceKey } from '../../../types/questionBank';
import { PracticeMode } from '../../../types/practiceSession';
import { ListeningAudioPlayer } from '../ListeningAudioPlayer';
import { buildAudioTrackConfigFromQuestion } from '../../../utils/audioScriptParser';
import { Check, HelpCircle, MessageSquareQuote } from 'lucide-react';

export interface Part2QuestionResponseViewProps {
  question: Part2Question;
  selectedAnswer: Part2ChoiceKey | null;
  onSelectAnswer: (key: Part2ChoiceKey) => void;
  isLocked: boolean;
  mode: PracticeMode;
  showAssistance: boolean;
  onAssistanceViewed?: () => void;
}

export const Part2QuestionResponseView: React.FC<Part2QuestionResponseViewProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  isLocked,
  mode,
  showAssistance,
  onAssistanceViewed,
}) => {
  const trackConfig = React.useMemo(() => {
    return buildAudioTrackConfigFromQuestion(question);
  }, [question.id]);

  // Strictly 3 options for Part 2: A, B, C
  const choices: Part2ChoiceKey[] = ['A', 'B', 'C'];

  return (
    <div
      className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200"
      data-testid="part2-question-response-view"
    >
      {/* 1. Header Prompt Directive Card */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <MessageSquareQuote className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider block">
                Part 2 • Hỏi - Đáp (Question-Response)
              </span>
              <h2 className="text-base sm:text-lg font-bold text-zinc-100">
                {question.question || 'Chọn câu phản hồi phù hợp nhất:'}
              </h2>
            </div>
          </div>

          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
            Chỉ có 3 phương án (A, B, C)
          </span>
        </div>

        {/* Audio Player */}
        <ListeningAudioPlayer
          trackConfig={trackConfig}
          mode={mode}
          className="shadow-sm"
        />

        {/* Prompt Transcript Box (Only visible if assistance enabled in Practice mode) */}
        {showAssistance && (
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              Nội dung câu hỏi phát ra từ loa:
            </span>
            <p className="font-mono text-sm text-zinc-200 bg-zinc-900/80 p-3 rounded-lg border border-zinc-750">
              "{question.promptScript}"
            </p>
          </div>
        )}
      </div>

      {/* 2. Three Choice Buttons (A, B, C) */}
      <div className="space-y-3">
        {choices.map((key) => {
          const isSelected = selectedAnswer === key;
          const optionData = question.options.find((o) => o.key === key);

          return (
            <button
              key={key}
              type="button"
              disabled={isLocked}
              onClick={() => onSelectAnswer(key)}
              className={`w-full p-4 sm:p-5 rounded-2xl border text-left flex items-center justify-between transition-all select-none ${
                isSelected
                  ? 'bg-blue-600/15 border-blue-500 text-white shadow-md ring-1 ring-blue-500/50'
                  : 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800 hover:border-zinc-700 text-zinc-200'
              } ${isLocked ? 'cursor-not-allowed opacity-90' : 'cursor-pointer active:scale-[0.99]'}`}
              data-testid={`choice-${key}`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`w-9 h-9 rounded-xl font-mono font-bold text-sm flex items-center justify-center border transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-400'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                  }`}
                >
                  {key}
                </span>

                <div>
                  {showAssistance && optionData ? (
                    <span className="text-sm sm:text-base font-medium block text-zinc-100">
                      {optionData.text}
                    </span>
                  ) : (
                    <span className="text-sm sm:text-base font-medium text-zinc-300">
                      Phương án ({key})
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <kbd className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-mono text-zinc-400 bg-zinc-800 border border-zinc-700">
                  {key}
                </kbd>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Assistance / Trap Explanation Details */}
      {showAssistance && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs space-y-2 animate-in fade-in">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <HelpCircle className="w-4 h-4" />
            <span>Phân Tích Cấu Trúc & Bẫy Đề Part 2</span>
          </div>
          {question.trapType && (
            <p className="text-xs text-amber-300">
              <strong>Bẫy ETS thường gặp:</strong> {question.trapType}
            </p>
          )}
          <p className="text-[11px] text-zinc-300 leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}

      {/* Footer Meta */}
      <div className="text-[11px] text-zinc-400 flex items-center justify-between pt-2 border-t border-zinc-850">
        <span>Kỹ năng: {question.skillTag}</span>
        <span className="font-mono text-zinc-400">{question.id}</span>
      </div>
    </div>
  );
};
