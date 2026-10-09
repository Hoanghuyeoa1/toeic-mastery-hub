/**
 * TOEIC Mastery Hub — Exam Part 3 Conversations Renderer (Phase 14)
 *
 * Requirements:
 * - 3-question conversation group layout (Questions 32-70).
 * - Renders conversation context graphic if present (e.g. FlightScheduleGraphic).
 * - Displays 3 questions in group with printed question prompts and 4 choices A-D.
 * - Active question focus indicator and flag toggle per question.
 * - Audio plays for the entire group without re-triggering upon answer changes.
 */

import React from 'react';
import { Bookmark, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { ExamPart3RendererProps } from '../../../types/examWorkspace';
import { LISTENING_ILLUSTRATIONS } from '../../Diagnostic/listeningIllustrationsMap';
import { StandardChoiceKey } from '../../../types/questionBank';

export const ExamPart3Renderer: React.FC<ExamPart3RendererProps> = ({
  group,
  questions,
  activeQuestionNumber,
  answers,
  onSelectChoice,
  onToggleFlag,
  onFocusQuestion,
  isLocked,
}) => {
  // Check for graphic
  const graphicId = group.media?.graphic?.illustrationId;
  const GraphicComponent = graphicId ? LISTENING_ILLUSTRATIONS[graphicId] : null;

  const startQ = questions[0]?.orderInGroup ? activeQuestionNumber - questions[0].orderInGroup + 1 : activeQuestionNumber;

  return (
    <div
      className="w-full space-y-6 animate-in fade-in duration-200"
      data-testid="exam-part3-renderer"
    >
      {/* Group Context Banner */}
      <div className="p-4 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              PART 3: CONVERSATIONS (HỘI THOẠI)
            </span>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Questions {questions.map((q) => q.orderInGroup ? startQ + q.orderInGroup - 1 : '').filter(Boolean).join(', ') || 'Group'} refer to the following conversation.
            </h2>
          </div>
        </div>

        <span className="text-xs text-slate-500 dark:text-slate-400 italic">
          3 câu hỏi / 1 đoạn hội thoại
        </span>
      </div>

      {/* Main Grid: Graphic Column (if any) and Questions Column */}
      <div className={`grid grid-cols-1 ${GraphicComponent ? 'lg:grid-cols-12' : ''} gap-6`}>
        {/* Graphic Column (if present) */}
        {GraphicComponent && (
          <div className="lg:col-span-5 space-y-3">
            <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 shadow-md">
              <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-800 text-xs font-bold text-slate-300">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                <span>Graphic Information</span>
              </div>
              <div className="w-full rounded-xl overflow-hidden bg-slate-900/60">
                <GraphicComponent />
              </div>
            </div>
          </div>
        )}

        {/* Questions Column */}
        <div className={`${GraphicComponent ? 'lg:col-span-7' : 'max-w-4xl mx-auto'} space-y-5 w-full`}>
          {questions.map((q, idx) => {
            const currentGlobalNum = startQ + idx;
            const answer = answers[currentGlobalNum] || {
              globalQuestionNumber: currentGlobalNum,
              questionId: q.id,
              selectedChoice: null,
              timeSpentSeconds: 0,
              isMarkedForReview: false,
            };
            const isFlagged = answer.isMarkedForReview;
            const isActive = currentGlobalNum === activeQuestionNumber;

            return (
              <div
                key={q.id}
                onClick={() => onFocusQuestion(currentGlobalNum)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-850 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                    : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
                data-testid={`exam-question-card-${currentGlobalNum}`}
              >
                {/* Question Header & Flag */}
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-mono">
                      {currentGlobalNum}
                    </span>
                    <span>Question {currentGlobalNum}</span>
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFlag(currentGlobalNum);
                    }}
                    disabled={isLocked}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
                      isFlagged
                        ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border-slate-200 dark:border-slate-700'
                    }`}
                    title="Đánh dấu câu hỏi cần xem lại"
                  >
                    <Bookmark className={`w-3 h-3 ${isFlagged ? 'fill-current' : ''}`} />
                    <span>{isFlagged ? 'Đã cờ' : 'Cờ'}</span>
                  </button>
                </div>

                {/* Question Prompt */}
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3.5 leading-snug">
                  {q.question}
                </p>

                {/* 4 Choices */}
                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const choiceKey = opt.key;
                    const choiceText = opt.text;
                    const isSelected = answer.selectedChoice === choiceKey;

                    return (
                      <button
                        key={choiceKey}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectChoice(currentGlobalNum, choiceKey);
                        }}
                        disabled={isLocked}
                        className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center gap-3 active:scale-[0.99] ${
                          isLocked
                            ? 'opacity-60 cursor-not-allowed border-slate-200 dark:border-slate-800'
                            : isSelected
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm font-semibold'
                            : 'bg-slate-50/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-750 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/30'
                        }`}
                        data-testid={`choice-${currentGlobalNum}-${choiceKey}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center shrink-0 text-xs ${
                            isSelected
                              ? 'bg-white text-indigo-700'
                              : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {choiceKey}
                        </span>
                        <span className="leading-snug">{choiceText}</span>
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
