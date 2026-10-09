/**
 * TOEIC Mastery Hub — Exam Part 1 Photographs Renderer (Phase 14)
 *
 * Requirements:
 * - Renders correct SVG photo illustration from LISTENING_ILLUSTRATIONS.
 * - Displays 4 choices A, B, C, D without revealing statement transcripts (ETS exam standard).
 * - Keyboard & click choice selection.
 * - Bookmark review flag toggle.
 * - Zero audio replay logic inside renderer.
 */

import React from 'react';
import { Bookmark, Image as ImageIcon, Volume2 } from 'lucide-react';
import { ExamPart1RendererProps } from '../../../types/examWorkspace';
import { LISTENING_ILLUSTRATIONS } from '../../Diagnostic/listeningIllustrationsMap';
import { StandardChoiceKey } from '../../../types/questionBank';

export const ExamPart1Renderer: React.FC<ExamPart1RendererProps> = ({
  question,
  globalQuestionNumber,
  answer,
  onSelectChoice,
  onToggleFlag,
  isLocked,
}) => {
  const illustrationId = question.media?.visual?.illustrationId || '';
  const IllustrationComponent = LISTENING_ILLUSTRATIONS[illustrationId];

  const choices: StandardChoiceKey[] = ['A', 'B', 'C', 'D'];

  return (
    <div
      className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200"
      data-testid="exam-part1-renderer"
    >
      {/* Left Column: Photograph (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-2 sm:p-3 overflow-hidden shadow-md flex flex-col items-center">
          {IllustrationComponent ? (
            <div className="w-full rounded-xl overflow-hidden aspect-[16/10] flex items-center justify-center bg-slate-900/40">
              <IllustrationComponent />
            </div>
          ) : (
            <div className="w-full aspect-[16/10] flex flex-col items-center justify-center text-slate-500 bg-slate-900/60 rounded-xl">
              <ImageIcon className="w-12 h-12 stroke-1 text-slate-600 mb-2" />
              <p className="text-xs font-medium">Đang tải hình ảnh minh họa Part 1...</p>
            </div>
          )}
        </div>

        {/* ETS Instructions Context */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
          <Volume2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Hướng dẫn:</strong> Lắng nghe 4 câu mô tả (A, B, C, D) qua tai nghe và chọn câu mô tả chính xác nhất những gì bạn thấy trong ảnh. Lời đọc không hiển thị trên đề thi thật.
          </p>
        </div>
      </div>

      {/* Right Column: Question Info & 4 Answer Choices (5 cols) */}
      <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Question Banner & Flag Action */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                PART 1 — CÂU {globalQuestionNumber} / 200
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Question {globalQuestionNumber}
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

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Chọn phương án trả lời bằng cách bấm vào các nút bên dưới hoặc dùng phím tắt <strong>A</strong>, <strong>B</strong>, <strong>C</strong>, <strong>D</strong>:
          </p>

          {/* 4 Choices Grid (Labels only, concealed text) */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {choices.map((choiceKey) => {
              const isSelected = answer.selectedChoice === choiceKey;

              return (
                <button
                  key={choiceKey}
                  type="button"
                  onClick={() => onSelectChoice(choiceKey)}
                  disabled={isLocked}
                  className={`p-4 rounded-2xl border text-center font-extrabold transition-all flex flex-col items-center justify-center gap-1 active:scale-95 ${
                    isLocked
                      ? 'opacity-60 cursor-not-allowed border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-850'
                      : isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30 scale-102 ring-2 ring-indigo-400/40'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20'
                  }`}
                  data-testid={`choice-${choiceKey}`}
                >
                  <span
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                      isSelected
                        ? 'bg-white text-indigo-700 font-black shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {choiceKey}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-300">
                    Phương án ({choiceKey})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Shortcut Hint */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Phím tắt: [A] [B] [C] [D]</span>
          <span>Gắn cờ: [M]</span>
        </div>
      </div>
    </div>
  );
};
