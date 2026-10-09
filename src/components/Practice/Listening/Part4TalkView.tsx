/**
 * TOEIC Mastery Hub — Part 4 Short Talks View
 * Phase 7: Listening Practice Workspace
 *
 * Requirements:
 * - Plays shared audio talk/monologue for the 3-question group.
 * - Switching between questions in the group preserves audio and group context.
 * - Displays graphic context (e.g. Store Floor Directory) if present.
 * - Renders all 3 questions with 4 choices A-D.
 * - Practice Mode can reveal talk transcript and explanations.
 */

import React from 'react';
import { Part4Group, Part4Question, StandardChoiceKey } from '../../../types/questionBank';
import { PracticeMode } from '../../../types/practiceSession';
import { ListeningAudioPlayer } from '../ListeningAudioPlayer';
import { buildAudioTrackConfigFromGroup } from '../../../utils/audioScriptParser';
import { LISTENING_ILLUSTRATIONS } from '../../Diagnostic/listeningIllustrationsMap';
import { Megaphone, HelpCircle, Check, Image as ImageIcon } from 'lucide-react';

export interface Part4TalkViewProps {
  group: Part4Group;
  questions: Part4Question[];
  activeQuestionId: string;
  answers: Record<string, StandardChoiceKey | null>;
  onSelectAnswer: (questionId: string, key: StandardChoiceKey) => void;
  onSelectActiveQuestion: (questionId: string) => void;
  isLocked: boolean;
  mode: PracticeMode;
  showAssistance: boolean;
  onAssistanceViewed?: () => void;
}

export const Part4TalkView: React.FC<Part4TalkViewProps> = ({
  group,
  questions,
  activeQuestionId,
  answers,
  onSelectAnswer,
  onSelectActiveQuestion,
  isLocked,
  mode,
  showAssistance,
  onAssistanceViewed,
}) => {
  // Stable track config per group ID (persists across internal question switching)
  const trackConfig = React.useMemo(() => {
    return buildAudioTrackConfigFromGroup(group);
  }, [group.id]);

  const graphicIllustrationId = group.media?.graphic?.illustrationId || '';
  const GraphicIllustrationComponent = graphicIllustrationId ? LISTENING_ILLUSTRATIONS[graphicIllustrationId] : null;

  const choices: StandardChoiceKey[] = ['A', 'B', 'C', 'D'];

  return (
    <div
      className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200"
      data-testid="part4-talk-view"
    >
      {/* Left Column: Shared Group Context, Audio Player & Graphic (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        {/* Context Card */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <Megaphone className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider block">
                Part 4 • Bài Nói Ngắn (Short Talk)
              </span>
              <h2 className="text-sm font-bold text-zinc-100">
                {group.contextIntro || 'Questions 71-73 refer to the following talk.'}
              </h2>
            </div>
          </div>
          <p className="text-xs text-zinc-400">
            Bài phát biểu / thông báo chung cho cả 3 câu hỏi. Bạn có thể đọc câu hỏi trước và trả lời trực tiếp trong lúc nghe.
          </p>
        </div>

        {/* Shared Audio Player */}
        <ListeningAudioPlayer
          trackConfig={trackConfig}
          mode={mode}
          className="shadow-sm"
        />

        {/* Graphic Context (e.g. Store Floor Directory) if present */}
        {GraphicIllustrationComponent && (
          <div className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-3 overflow-hidden shadow-sm space-y-2">
            <span className="text-[10px] font-mono font-semibold text-emerald-400 block px-1">
              Sơ đồ/Bảng biểu đính kèm:
            </span>
            <div className="w-full rounded-xl overflow-hidden aspect-[16/10] flex items-center justify-center">
              <GraphicIllustrationComponent />
            </div>
            {group.media.graphic?.altText && (
              <p className="text-[11px] text-zinc-400 text-center italic">
                {group.media.graphic.altText}
              </p>
            )}
          </div>
        )}

        {/* Assistance / Talk Transcript (Practice mode only) */}
        {showAssistance && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <HelpCircle className="w-4 h-4" />
              <span>Transcript Bài Nói Ngắn (Talk)</span>
            </div>
            <div className="space-y-1.5 font-mono text-[11px] bg-zinc-950/70 p-3 rounded-xl border border-zinc-800 text-zinc-300 max-h-60 overflow-y-auto leading-relaxed">
              {group.media?.audio?.audioScript || group.media?.transcript}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: 3 Questions in Group (7 cols) */}
      <div className="lg:col-span-7 space-y-5">
        {questions.map((q, idx) => {
          const isActive = q.id === activeQuestionId;
          const selectedAns = answers[q.id];

          return (
            <div
              key={q.id}
              onClick={() => onSelectActiveQuestion(q.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isActive
                  ? 'bg-zinc-900 border-blue-500/80 ring-2 ring-blue-500/20 shadow-md'
                  : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
              }`}
              data-testid={`group-question-${q.id}`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-lg font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : selectedAns
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/60'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-100 leading-snug">
                      {q.question}
                    </h3>
                  </div>
                </div>

                {selectedAns && (
                  <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                    Đã chọn: ({selectedAns})
                  </span>
                )}
              </div>

              {/* 4 Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {choices.map((key) => {
                  const isChoiceSelected = selectedAns === key;
                  const option = q.options.find((o) => o.key === key);

                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={isLocked}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAnswer(q.id, key);
                        onSelectActiveQuestion(q.id);
                      }}
                      className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all text-xs select-none ${
                        isChoiceSelected
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm ring-1 ring-blue-500/40'
                          : 'bg-zinc-850 hover:bg-zinc-800 border-zinc-750 hover:border-zinc-700 text-zinc-300'
                      } ${isLocked ? 'cursor-not-allowed opacity-90' : 'cursor-pointer active:scale-[0.99]'}`}
                      data-testid={`choice-${q.id}-${key}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg font-mono font-bold text-[11px] flex items-center justify-center shrink-0 ${
                          isChoiceSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        {key}
                      </span>
                      <span className="leading-tight pt-0.5">{option?.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Assistance explanation (if toggled) */}
              {showAssistance && (
                <div className="mt-3 pt-2 border-t border-zinc-800 text-[11px] text-zinc-400">
                  <span className="text-amber-400 font-semibold">Giải thích: </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
