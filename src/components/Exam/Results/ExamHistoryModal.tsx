/**
 * TOEIC Mastery Hub — Exam History Modal & Retake Comparison Surface (Phase 17)
 *
 * Implements real multi-attempt history viewing & test-retest progress tracking:
 * - Reads verified ExamHistoryEntry[] from LocalStorage
 * - Distinguishes Strict Certified, Simulation Verified, and Interrupted attempts
 * - Retake comparison between successive attempts on the same ExamForm
 * - Prominent Test-Retest Practice Effect caution banner
 * - Quick transition into full Result Dashboard & Answer Review for any past session
 */

import React, { useMemo } from 'react';
import {
  History,
  X,
  Clock,
  Award,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { ExamHistoryEntry, ExamResult } from '../../../types/mockExam';
import {
  getExamHistory,
  getExamResult,
  clearExamHistory,
} from '../../../utils/examSessionStorage';
import { compareExamAttempts, CAUTIOUS_TEST_RETEST_ADVISORY } from '../../../utils/examReviewAnalysis';

export interface ExamHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (result: ExamResult) => void;
  onRetakeExam?: (formId: string) => void;
}

export const ExamHistoryModal: React.FC<ExamHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
  onRetakeExam,
}) => {
  const historyEntries = useMemo(() => {
    if (!isOpen) return [];
    return getExamHistory();
  }, [isOpen]);

  // Group attempts by examFormId to detect retakes
  const groupedByForm = useMemo(() => {
    const map = new Map<string, ExamHistoryEntry[]>();
    for (const entry of historyEntries) {
      const list = map.get(entry.examFormId) || [];
      list.push(entry);
      map.set(entry.examFormId, list);
    }
    return map;
  }, [historyEntries]);

  if (!isOpen) return null;

  const handleOpenAttempt = (sessionId: string) => {
    const result = getExamResult(sessionId);
    if (!result) {
      alert('Không tìm thấy chi tiết bài thi cho lượt thi này trong bộ nhớ.');
      return;
    }
    onClose();
    onSelectResult(result);
  };

  const handleClearAllHistory = () => {
    if (
      window.confirm(
        'Bạn có chắc chắn muốn xóa toàn bộ lịch sử thi thử không? Hành động này không thể hoàn tác.'
      )
    ) {
      clearExamHistory();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exam-history-title"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="exam-history-title"
                className="text-lg font-bold text-slate-900 dark:text-white"
              >
                Lịch Sử Thi Thử Full Mock (Offline LocalStorage)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ghi nhận các lượt làm bài thực tế độc lập, không tạo dữ liệu giả
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {historyEntries.length > 0 && (
              <button
                onClick={handleClearAllHistory}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Xóa toàn bộ lịch sử"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xóa Lịch Sử</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {historyEntries.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <History className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Chưa Có Lượt Thi Thử Nào
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Khi bạn hoàn thành và nộp bài thi Full Mock (120 Phút / 200 Câu), kết quả và chi tiết chữa bài sẽ được lưu trữ an toàn tại đây.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Retake Caution Advisory Banner */}
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3 leading-relaxed">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">
                    Khuyến Cáo Đánh Giá Tiến Bộ Thi Lại (Test-Retest Practice Effect)
                  </span>
                  <p className="text-slate-600 dark:text-slate-300">
                    {CAUTIOUS_TEST_RETEST_ADVISORY}
                  </p>
                </div>
              </div>

              {/* Grouped Exam Attempts */}
              {Array.from(groupedByForm.entries()).map(([formId, attempts]) => {
                // Sorted chronologically
                const sortedAttempts = [...attempts].sort((a, b) =>
                  a.completedAt.localeCompare(b.completedAt)
                );

                return (
                  <div
                    key={formId}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{sortedAttempts[0]?.examTitle || formId}</span>
                          <span className="text-xs font-mono font-medium text-slate-500">
                            ({sortedAttempts[0]?.examCode})
                          </span>
                        </h3>
                        <span className="text-[11px] text-slate-500">
                          Tổng số lượt thi: {sortedAttempts.length} lượt
                        </span>
                      </div>

                      {onRetakeExam && (
                        <button
                          onClick={() => {
                            onClose();
                            onRetakeExam(formId);
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Làm Lại Đề Này</span>
                        </button>
                      )}
                    </div>

                    {/* Retake Comparison Delta (if multiple attempts) */}
                    {sortedAttempts.length >= 2 && (
                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 text-xs space-y-2">
                        {(() => {
                          const latest = sortedAttempts[sortedAttempts.length - 1];
                          const previous = sortedAttempts[sortedAttempts.length - 2];
                          const comp = compareExamAttempts(
                            latest,
                            previous,
                            sortedAttempts.length,
                            sortedAttempts.length - 1
                          );

                          return (
                            <div>
                              <div className="flex items-center gap-2 font-bold text-indigo-700 dark:text-indigo-300 mb-1">
                                <TrendingUp className="w-4 h-4" />
                                <span>
                                  So sánh tiến bộ: Lần {comp.attemptIndex} so với Lần {comp.previousAttemptIndex}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                                <span className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 block">
                                  Điểm Raw: <strong>{comp.deltaTotalRaw >= 0 ? `+${comp.deltaTotalRaw}` : comp.deltaTotalRaw} câu</strong>
                                </span>
                                <span className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 block">
                                  Điểm Scaled: <strong>{comp.deltaTotalScaled >= 0 ? `+${comp.deltaTotalScaled}` : comp.deltaTotalScaled} điểm</strong>
                                </span>
                                <span className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 block">
                                  Độ chính xác: <strong>{comp.deltaAccuracy >= 0 ? `+${comp.deltaAccuracy}%` : `${comp.deltaAccuracy}%`}</strong>
                                </span>
                                <span className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 block">
                                  Thời gian: <strong>{comp.deltaDurationMinutes} phút</strong>
                                </span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Attempts List */}
                    <div className="space-y-2.5">
                      {sortedAttempts.map((attempt, idx) => {
                        const isStrict = attempt.mode === 'strict';
                        const isValid = attempt.integrityStatus?.isStrictValid ?? true;
                        const formattedDate = new Date(attempt.completedAt).toLocaleString('vi-VN');

                        return (
                          <div
                            key={attempt.sessionId}
                            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="space-y-1.5 text-xs">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-extrabold text-slate-900 dark:text-white">
                                  Lần {idx + 1}
                                </span>
                                <span className="text-slate-400">•</span>
                                <span className="text-slate-500 font-mono">
                                  {formattedDate}
                                </span>
                                <span className="text-slate-400">•</span>
                                {isStrict ? (
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      isValid
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                    }`}
                                  >
                                    {isValid ? 'STRICT CHUẨN' : 'STRICT CÓ CẢNH BÁO'}
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                    SIMULATION
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-3 text-slate-600 dark:text-slate-400 text-[11px]">
                                <span>
                                  Raw: <strong>{attempt.totalRaw}/200</strong> ({attempt.accuracyPercentage}%)
                                </span>
                                <span>•</span>
                                <span>
                                  Listening: <strong>{attempt.listeningRaw}/100</strong>
                                </span>
                                <span>•</span>
                                <span>
                                  Reading: <strong>{attempt.readingRaw}/100</strong>
                                </span>
                                <span>•</span>
                                <span>
                                  Thời gian: <strong>{attempt.durationMinutes} phút</strong>
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-right">
                                <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 font-mono block">
                                  {attempt.totalScore} / 990
                                </span>
                                <span className="text-[10px] text-slate-400 block">
                                  Ước tính ETS
                                </span>
                              </div>

                              <button
                                onClick={() => handleOpenAttempt(attempt.sessionId)}
                                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                              >
                                <span>Xem Lại & Chữa Bài</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
