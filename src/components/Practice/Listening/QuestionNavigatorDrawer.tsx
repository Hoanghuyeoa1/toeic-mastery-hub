/**
 * TOEIC Mastery Hub — Question Navigator Grid / Drawer
 * Phase 7: Listening Practice Workspace
 *
 * Fast navigation matrix:
 * - Shows each question with answer state (answered, marked, current, unanswered)
 * - Visually groups Part 3 and Part 4 conversation / talk clusters
 * - Real-time progress metrics
 */

import React from 'react';
import { Flag, Check } from 'lucide-react';
import { getQuestionById } from '../../../utils/questionBankLookup';

export interface QuestionNavigatorDrawerProps {
  questionIds: string[];
  currentQuestionIndex: number;
  answers: Record<string, string | null>;
  markedForReview: Record<string, boolean>;
  onSelectQuestion: (index: number) => void;
  partNum: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

export const QuestionNavigatorDrawer: React.FC<QuestionNavigatorDrawerProps> = ({
  questionIds,
  currentQuestionIndex,
  answers,
  markedForReview,
  onSelectQuestion,
  partNum,
}) => {
  const isGroupedPart = partNum === 3 || partNum === 4 || partNum === 6 || partNum === 7;

  // Dynamically cluster grouped parts based on actual groupId
  const groupClusters = React.useMemo(() => {
    if (!isGroupedPart) return null;
    const clusters: {
      groupId: string;
      groupIndex: number;
      questions: { qid: string; globalIdx: number }[];
    }[] = [];
    let curCluster: {
      groupId: string;
      groupIndex: number;
      questions: { qid: string; globalIdx: number }[];
    } | null = null;

    questionIds.forEach((qid, globalIdx) => {
      const q = getQuestionById(qid);
      const gid = q?.groupId || `group-fallback-${qid}`;
      if (!curCluster || curCluster.groupId !== gid) {
        curCluster = {
          groupId: gid,
          groupIndex: clusters.length + 1,
          questions: [{ qid, globalIdx }],
        };
        clusters.push(curCluster);
      } else {
        curCluster.questions.push({ qid, globalIdx });
      }
    });

    return clusters;
  }, [isGroupedPart, questionIds]);

  // Calculate stats
  const total = questionIds.length;
  const answeredCount = questionIds.filter((qid) => answers[qid] !== null && answers[qid] !== undefined).length;
  const markedCount = questionIds.filter((qid) => markedForReview[qid]).length;
  const unansweredCount = total - answeredCount;

  return (
    <aside
      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm space-y-4"
      data-testid="question-navigator"
    >
      {/* Header & Stats */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-300">
          Danh Sách Câu Hỏi
        </h3>
        <span className="text-[11px] font-mono font-semibold text-blue-400">
          {answeredCount}/{total} Đã làm
        </span>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-1.5 text-[10px] text-zinc-400">
        <div className="flex items-center gap-1.5 bg-zinc-800/40 px-2 py-1 rounded-md">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500/80 inline-block" />
          <span>Đã chọn ({answeredCount})</span>
        </div>
        <div className="flex items-center gap-1.5 bg-zinc-800/40 px-2 py-1 rounded-md">
          <span className="w-2.5 h-2.5 rounded bg-orange-500/80 inline-block" />
          <span>Xem lại ({markedCount})</span>
        </div>
        <div className="flex items-center gap-1.5 bg-zinc-800/40 px-2 py-1 rounded-md">
          <span className="w-2.5 h-2.5 rounded bg-zinc-700 inline-block" />
          <span>Chưa làm ({unansweredCount})</span>
        </div>
      </div>

      {/* Grid of Questions */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {isGroupedPart && groupClusters ? (
          // Dynamic group clusters for Part 3, 4, 6, 7
          groupClusters.map((cluster) => {
            const count = cluster.questions.length;
            const colsClass =
              count === 4 ? 'grid-cols-4' : count === 3 ? 'grid-cols-3' : 'grid-cols-5';

            return (
              <div
                key={`group-${cluster.groupId}`}
                className="p-2 rounded-xl bg-zinc-850/60 border border-zinc-800/60 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[10px] font-medium text-zinc-400 px-1">
                  <span>Nhóm {cluster.groupIndex} ({cluster.groupId})</span>
                  <span className="text-zinc-500 font-mono">{count} câu</span>
                </div>

                <div className={`grid ${colsClass} gap-2`}>
                  {cluster.questions.map(({ qid, globalIdx }) => {
                    const ans = answers[qid];
                    const isAnswered = ans !== null && ans !== undefined;
                    const isMarked = markedForReview[qid];
                    const isCurrent = globalIdx === currentQuestionIndex;

                    return (
                      <button
                        key={qid}
                        type="button"
                        onClick={() => onSelectQuestion(globalIdx)}
                        className={`relative flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono font-bold transition-all border ${
                          isCurrent
                            ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-500/40 scale-[1.02]'
                            : isAnswered
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900/60'
                            : 'bg-zinc-800 text-zinc-300 border-zinc-700/60 hover:bg-zinc-750'
                        }`}
                        title={`Câu ${globalIdx + 1}${isAnswered ? ` - Đáp án: ${ans}` : ''}`}
                      >
                        <span>{globalIdx + 1}</span>

                        {isAnswered && (
                          <span
                            className={`text-[11px] px-1 rounded ${
                              isCurrent ? 'bg-blue-700 text-white' : 'bg-emerald-900/80 text-emerald-300'
                            }`}
                          >
                            {ans}
                          </span>
                        )}

                        {isMarked && (
                          <Flag className="w-2.5 h-2.5 fill-orange-400 text-orange-400 absolute -top-1 -right-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          // Flat rendering for Part 1, 2, 5
          <div className="grid grid-cols-5 gap-2">
            {questionIds.map((qid, idx) => {
              const ans = answers[qid];
              const isAnswered = ans !== null && ans !== undefined;
              const isMarked = markedForReview[qid];
              const isCurrent = idx === currentQuestionIndex;

              return (
                <button
                  key={qid}
                  type="button"
                  onClick={() => onSelectQuestion(idx)}
                  className={`relative flex flex-col items-center justify-center p-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                    isCurrent
                      ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-500/40 scale-[1.04]'
                      : isAnswered
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900/60'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700/60 hover:bg-zinc-750'
                  }`}
                  title={`Câu ${idx + 1}${isAnswered ? ` - Đáp án: ${ans}` : ''}`}
                >
                  <span>{idx + 1}</span>
                  {isAnswered ? (
                    <span
                      className={`text-[10px] mt-0.5 px-1 rounded ${
                        isCurrent ? 'bg-blue-700 text-white' : 'bg-emerald-900/80 text-emerald-300'
                      }`}
                    >
                      {ans}
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-400 mt-0.5">-</span>
                  )}

                  {isMarked && (
                    <Flag className="w-2.5 h-2.5 fill-orange-400 text-orange-400 absolute -top-1 -right-1" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
