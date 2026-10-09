/**
 * TOEIC Mastery Hub — Exam Submission Audit Modal (Phase 14)
 *
 * Pre-submission safety checkpoint:
 * - Summarizes answered vs unanswered questions across 200 items
 * - Shows count of flagged questions
 * - Warns prominently if candidates have omitted answers
 * - Controlled submission execution
 */

import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  Send,
  X,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { ExamSubmitModalProps } from '../../../types/examWorkspace';

export const ExamSubmitModal: React.FC<ExamSubmitModalProps> = ({
  isOpen,
  onClose,
  onConfirmSubmit,
  session,
  answeredCount,
  unansweredCount,
  flaggedCount,
}) => {
  if (!isOpen) return null;

  const listeningAnswered = Object.entries(session.answers)
    .filter(([k, a]) => parseInt(k, 10) <= 100 && a.selectedChoice !== null)
    .length;

  const readingAnswered = answeredCount - listeningAnswered;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Xác Nhận Nộp Bài Thi Thử
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Kiểm tra lại toàn bộ tiến độ trước khi khóa bài
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-sm">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Đã trả lời
              </span>
              <span className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {answeredCount}/200
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Chưa làm
              </span>
              <span
                className={`text-lg font-mono font-bold ${
                  unansweredCount > 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-400'
                }`}
              >
                {unansweredCount}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Cờ xem lại
              </span>
              <span
                className={`text-lg font-mono font-bold ${
                  flaggedCount > 0
                    ? 'text-amber-500'
                    : 'text-slate-400'
                }`}
              >
                {flaggedCount}
              </span>
            </div>
          </div>

          {/* Section Breakdown */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                Phần 1 — Listening (Câu 1-100):
              </span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {listeningAnswered} / 100 câu
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                Phần 2 — Reading (Câu 101-200):
              </span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {readingAnswered} / 100 câu
              </span>
            </div>
          </div>

          {/* Unanswered questions alert */}
          {unansweredCount > 0 ? (
            <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Bạn còn {unansweredCount} câu chưa chọn đáp án!</p>
                <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                  Trong bài thi TOEIC thực tế, bạn không bị trừ điểm cho câu trả lời sai. Hãy tận dụng thời gian để chọn đáp án cho tất cả câu hỏi trước khi nộp.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="font-medium">
                Tuyệt vời! Bạn đã hoàn thành việc chọn đáp án cho toàn bộ 200 câu hỏi.
              </p>
            </div>
          )}

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
            * Sau khi xác nhận nộp bài, hệ thống sẽ niêm phong toàn bộ 200 đáp án và lưu phiên thi vào lịch sử ngoại tuyến.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Tiếp Tục Làm Bài
          </button>

          <button
            onClick={onConfirmSubmit}
            className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Nộp Bài Ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
