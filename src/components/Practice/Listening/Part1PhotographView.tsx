/**
 * TOEIC Mastery Hub — Part 1 Photographs View
 * Phase 7: Listening Practice Workspace
 *
 * Requirements:
 * - Renders crisp SVG photo illustration based on illustrationId.
 * - Plays audio recitation of Statements A, B, C, D.
 * - Does NOT display script/text of options by default while testing listening skills.
 * - 4 options A-D selectable via click or keyboard shortcuts.
 * - Reveals transcript & explanation only when assistance is explicitly enabled in Practice Mode.
 */

import React from 'react';
import { Part1Question, StandardChoiceKey } from '../../../types/questionBank';
import { PracticeMode } from '../../../types/practiceSession';
import { LISTENING_ILLUSTRATIONS } from '../../Diagnostic/listeningIllustrationsMap';
import { ListeningAudioPlayer } from '../ListeningAudioPlayer';
import { buildAudioTrackConfigFromQuestion } from '../../../utils/audioScriptParser';
import { Check, HelpCircle, Image as ImageIcon } from 'lucide-react';

export interface Part1PhotographViewProps {
  question: Part1Question;
  selectedAnswer: StandardChoiceKey | null;
  onSelectAnswer: (key: StandardChoiceKey) => void;
  isLocked: boolean;
  mode: PracticeMode;
  showAssistance: boolean;
  onAssistanceViewed?: () => void;
}

export const Part1PhotographView: React.FC<Part1PhotographViewProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  isLocked,
  mode,
  showAssistance,
  onAssistanceViewed,
}) => {
  const illustrationId = question.media?.visual?.illustrationId || '';
  const IllustrationComponent = LISTENING_ILLUSTRATIONS[illustrationId];

  const trackConfig = React.useMemo(() => {
    return buildAudioTrackConfigFromQuestion(question);
  }, [question.id]);

  const choices: StandardChoiceKey[] = ['A', 'B', 'C', 'D'];

  return (
    <div
      className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200"
      data-testid="part1-photograph-view"
    >
      {/* Left Column: Photograph & Audio Player (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        {/* SVG Illustration Container */}
        <div className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-2 sm:p-3 overflow-hidden shadow-sm flex flex-col items-center">
          {IllustrationComponent ? (
            <div className="w-full rounded-xl overflow-hidden aspect-[16/10] flex items-center justify-center">
              <IllustrationComponent />
            </div>
          ) : (
            <div className="w-full h-64 rounded-xl bg-zinc-900 border border-dashed border-zinc-700 flex flex-col items-center justify-center text-zinc-400 gap-2">
              <ImageIcon className="w-8 h-8 text-zinc-400" />
              <span className="text-xs">Không tìm thấy hình ảnh minh họa ({illustrationId})</span>
            </div>
          )}

          {question.media?.visual?.altText && (
            <p className="text-[11px] text-zinc-400 mt-2 text-center italic px-2">
              Mô tả ảnh: {question.media.visual.altText}
            </p>
          )}
        </div>

        {/* Audio Player Bar */}
        <ListeningAudioPlayer
          trackConfig={trackConfig}
          mode={mode}
          className="shadow-sm"
        />
      </div>

      {/* Right Column: Question Directive & Choice Buttons (5 cols) */}
      <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          {/* Directive Header */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider block">
              Part 1 • Câu hỏi miêu tả tranh
            </span>
            <h2 className="text-sm sm:text-base font-bold text-zinc-100">
              {question.question || 'Chọn câu miêu tả đúng nhất cho bức tranh:'}
            </h2>
            <p className="text-xs text-zinc-400">
              Lắng nghe 4 câu phát biểu (A, B, C, D) từ audio và chọn phương án chính xác nhất.
            </p>
          </div>

          {/* Options List */}
          <div className="space-y-2.5">
            {choices.map((key) => {
              const isSelected = selectedAnswer === key;
              const optionData = question.options.find((o) => o.key === key);

              return (
                <button
                  key={key}
                  type="button"
                  disabled={isLocked}
                  onClick={() => onSelectAnswer(key)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all select-none ${
                    isSelected
                      ? 'bg-blue-600/15 border-blue-500 text-white shadow-md ring-1 ring-blue-500/50'
                      : 'bg-zinc-900 hover:bg-zinc-850 border-zinc-800 hover:border-zinc-700 text-zinc-200'
                  } ${isLocked ? 'cursor-not-allowed opacity-90' : 'cursor-pointer active:scale-[0.99]'}`}
                  data-testid={`choice-${key}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-xl font-mono font-bold text-xs flex items-center justify-center border transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-400'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                      }`}
                    >
                      {key}
                    </span>

                    <div>
                      {/* Notice: Script text hidden by default while listening, shown only if assistance enabled */}
                      {showAssistance && optionData ? (
                        <span className="text-xs sm:text-sm font-medium block text-zinc-100">
                          {optionData.text}
                        </span>
                      ) : (
                        <span className="text-xs sm:text-sm font-medium text-zinc-300">
                          Phương án ({key})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono text-zinc-400 bg-zinc-800/80 border border-zinc-700">
                      {key}
                    </kbd>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Assistance / Transcript Box (Practice mode only) */}
          {showAssistance && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <HelpCircle className="w-4 h-4" />
                <span>Transcript Lời Đọc & Phân Tích (Gợi Ý)</span>
              </div>
              <div className="space-y-1 font-mono text-[11px] bg-zinc-950/60 p-3 rounded-xl border border-zinc-800 text-zinc-300">
                {question.options.map((opt) => (
                  <p key={opt.key}>
                    <strong>({opt.key})</strong> {opt.text}
                  </p>
                ))}
              </div>
              {question.trapType && (
                <p className="text-[11px] text-amber-400">
                  <strong>Bẫy ETS:</strong> {question.trapType}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Skill tag footer */}
        <div className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-850 flex items-center justify-between">
          <span>Kỹ năng: {question.skillTag}</span>
          <span className="font-mono text-zinc-400">{question.id}</span>
        </div>
      </div>
    </div>
  );
};
