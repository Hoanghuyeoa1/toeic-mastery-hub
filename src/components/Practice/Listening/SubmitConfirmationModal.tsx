/**
 * TOEIC Mastery Hub — Submit Confirmation Modal
 * Phase 7: Listening Practice Workspace
 *
 * Confirms session submission with full breakdown:
 * - Answered vs Unanswered vs Marked for Review
 * - Warning when unanswered questions remain
 */

import React from 'react';
import { AlertTriangle, CheckCircle2, Flag, HelpCircle, X } from 'lucide-react';

export interface SubmitConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  totalCount: number;
  answeredCount: number;
  unansweredCount: number;
  markedCount: number;
  isSubmitting?: boolean;
  mode?: 'practice' | 'timed';
}

export const SubmitConfirmationModal: React.FC<SubmitConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirmSubmit,
  totalCount,
  answeredCount,
  unansweredCount,
  markedCount,
  isSubmitting = false,
  mode = 'practice',
}) => {
  if (!isOpen) return null;

  const hasUnanswered = unansweredCount > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      data-testid="submit-confirmation-modal"
    >
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-5 text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-100">Xác Nhận Nộp Bài</h3>
              <p className="text-xs text-zinc-400">
                {mode === 'timed' ? 'Phòng thi Timed Practice' : 'Phiên Luyện Tập Tự Do'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-3 gap-2.5 py-1">
          <div className="bg-zinc-800/60 border border-zinc-700/40 rounded-xl p-3 text-center">
            <span className="text-[11px] text-zinc-400 block mb-1">Đã trả lời</span>
            <span className="text-xl font-bold font-mono text-emerald-400">
              {answeredCount}/{totalCount}
            </span>
          </div>

          <div
            className={`border rounded-xl p-3 text-center ${
              hasUnanswered
                ? 'bg-amber-950/30 border-amber-800/50 text-amber-300'
                : 'bg-zinc-800/60 border-zinc-700/40 text-zinc-400'
            }`}
          >
            <span className="text-[11px] block mb-1">Chưa làm</span>
            <span
              className={`text-xl font-bold font-mono ${
                hasUnanswered ? 'text-amber-400' : 'text-zinc-400'
              }`}
            >
              {unansweredCount}
            </span>
          </div>

          <div className="bg-zinc-800/60 border border-zinc-700/40 rounded-xl p-3 text-center">
            <span className="text-[11px] text-zinc-400 block mb-1">Đánh dấu</span>
            <span className="text-xl font-bold font-mono text-orange-400 flex items-center justify-center gap-1">
              <Flag className="w-3.5 h-3.5 fill-orange-400" />
              {markedCount}
            </span>
          </div>
        </div>

        {/* Warning if unanswered */}
        {hasUnanswered && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-200">
                Bạn còn {unansweredCount} câu chưa chọn đáp án!
              </p>
              <p className="text-[11px] text-amber-300/90 mt-0.5">
                Bài thi TOEIC không trừ điểm câu sai. Bạn nên chọn phương án cho tất cả các câu trước khi nộp.
              </p>
            </div>
          </div>
        )}

        {/* Confirmation Question */}
        <p className="text-xs text-zinc-300">
          Sau khi nộp bài, các đáp án sẽ được khóa cố định để chuyển sang bước lưu lịch sử. Bạn có chắc muốn nộp bài ngay bây giờ?
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            Làm Tiếp
          </button>

          <button
            type="button"
            onClick={onConfirmSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-sm active:scale-95 flex items-center gap-2"
          >
            {isSubmitting ? (
              <span>Đang nộp...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Nộp Bài Ngay</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
