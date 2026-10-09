/**
 * TOEIC Mastery Hub — Exam Preflight Technical Modal (Phase 13)
 *
 * Provides comprehensive technical verification before entering the exam room:
 * - Mode selection (Simulation Mode vs Strict Mock Mode locked guard)
 * - 7-Step live audit checklist (Form, Media, Browser, Storage, Active Session, Multi-tab, Sound)
 * - Interactive Sound / Headphones check button (unlocking autoplay policies)
 * - Handling of existing unfinished sessions (Resume vs Discard)
 * - Strict start gating: Prevents starting when critical blockers exist
 * - Safe notification when preflight passes (without routing to non-existent Workspace)
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Volume2,
  VolumeX,
  Play,
  Lock,
  Sparkles,
  Layers,
  Loader2,
} from 'lucide-react';
import { ExamForm } from '../../types/mockExam';
import { ExamAudioMode } from '../../types/examAudio';
import {
  ExamPreflightReport,
  PreflightCheckItem,
} from '../../types/examLibrary';
import {
  runComprehensivePreflight,
  testAudioPlayback,
} from '../../utils/examPreflightChecker';

interface ExamPreflightModalProps {
  isOpen: boolean;
  examForm: ExamForm;
  onClose: () => void;
  onStartExamConfirmed?: (mode: ExamAudioMode) => void;
  onResumeSession?: () => void;
  onDiscardSession?: () => void;
}

export const ExamPreflightModal: React.FC<ExamPreflightModalProps> = ({
  isOpen,
  examForm,
  onClose,
  onStartExamConfirmed,
  onResumeSession,
  onDiscardSession,
}) => {
  // Mode Selection: Defaults to simulation because canonical form has strictLocked === true
  const [selectedMode, setSelectedMode] = useState<ExamAudioMode>('simulation');
  const [hasTestedSound, setHasTestedSound] = useState(false);
  const [isTestingSound, setIsTestingSound] = useState(false);
  const [soundFeedback, setSoundFeedback] = useState<string | null>(null);

  // Preflight Report
  const [report, setReport] = useState<ExamPreflightReport | null>(null);

  // Confirmation Success Notice (Phase 13 scope boundary)
  const [isStartConfirmed, setIsStartConfirmed] = useState(false);

  // Run audit
  const runAudit = useCallback(
    (mode: ExamAudioMode, testedSound: boolean) => {
      const rep = runComprehensivePreflight(examForm, mode, {
        hasTestedSound: testedSound,
      });
      setReport(rep);
    },
    [examForm]
  );

  useEffect(() => {
    if (isOpen) {
      setIsStartConfirmed(false);
      setSoundFeedback(null);
      runAudit(selectedMode, hasTestedSound);
    }
  }, [isOpen, selectedMode, hasTestedSound, runAudit]);

  const handleModeChange = (mode: ExamAudioMode) => {
    setSelectedMode(mode);
    runAudit(mode, hasTestedSound);
  };

  const handleTestSound = async () => {
    setIsTestingSound(true);
    setSoundFeedback(null);
    try {
      const res = await testAudioPlayback('tone');
      if (res.success) {
        setHasTestedSound(true);
        setSoundFeedback('Âm thanh thử nghiệm đã phát thành công. Tai nghe hoạt động tốt!');
        runAudit(selectedMode, true);
      } else {
        setSoundFeedback(`Không thể phát âm thanh: ${res.error || 'Lỗi không xác định'}`);
      }
    } finally {
      setIsTestingSound(false);
    }
  };

  const handleConfirmStart = () => {
    if (!report?.isReadyToStart) return;
    onStartExamConfirmed?.(selectedMode);
    onClose();
  };

  if (!isOpen) return null;

  const isStrictLocked = examForm.media?.strictLocked ?? false;
  const lockReason = examForm.media?.lockReason;

  const renderCheckItem = (item?: PreflightCheckItem) => {
    if (!item) return null;

    let icon = <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
    let badgeClass = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    let badgeText = 'ĐẠT';

    if (item.status === 'failed') {
      icon = <XCircle className="w-4 h-4 text-rose-500 shrink-0" />;
      badgeClass = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      badgeText = 'KHÔNG ĐẠT';
    } else if (item.status === 'warning') {
      icon = <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      badgeClass = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      badgeText = 'LƯU Ý';
    }

    return (
      <div
        key={item.id}
        className="flex items-start justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/60 gap-3"
      >
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5">{icon}</div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {item.name}
              </span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded border font-bold ${badgeClass}`}>
                {badgeText}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {item.description}
            </p>
            {item.message && (
              <p
                className={`text-xs mt-1 ${
                  item.status === 'failed'
                    ? 'text-rose-600 dark:text-rose-400 font-semibold'
                    : item.status === 'warning'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {item.message}
              </p>
            )}
            {item.detail && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                {item.detail}
              </p>
            )}
            {item.actionRequired && item.status !== 'passed' && (
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                👉 {item.actionRequired}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 p-0.5 shadow-md shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Kiểm Tra Kỹ Thuật Trước Giờ Thi (Preflight Check)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mã đề: <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{examForm.code}</span> — {examForm.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Phase 13 Completion Confirmation Notice */}
          {isStartConfirmed && (
            <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 space-y-3 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Preflight Check Đạt 100%! Phòng Thi Đã Sẵn Sàng
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
                Tất cả 7 hạng mục kỹ thuật (Toàn vẹn đề thi, Khả năng phát TTS, Hỗ trợ trình duyệt, Quyền ghi LocalStorage, Độc quyền đa tab và Âm thanh) đã được kiểm định hợp lệ.
              </p>
              <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-lg border border-emerald-200 dark:border-emerald-900/60 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p className="font-semibold text-indigo-600 dark:text-indigo-400">
                  📌 Thông báo bàn giao Phase 13:
                </p>
                <p>
                  Theo đúng phạm vi kỹ thuật của Phase 13, toàn bộ màn hình Thư viện đề (Library), Quy chế phòng thi (Instructions) và Kiểm tra kỹ thuật (Preflight) đã hoàn tất. <strong>Không gian làm bài thi (Exam Workspace 200 câu)</strong> sẽ được tích hợp chính thức ở <strong>Phase 14</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              Chọn Chế Độ Thi Phù Hợp:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Simulation Mode Button */}
              <div
                onClick={() => handleModeChange('simulation')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedMode === 'simulation'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Chế Độ Mô Phỏng (Simulation)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Khả Dụng 100%
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Phát âm bằng Web Speech API bản xứ. Đầy đủ 200 câu, cho phép tạm dừng khi có việc gấp. Khuyên dùng cho luyện tập.
                </p>
              </div>

              {/* Strict Mode Button (Disabled / Locked when strictLocked) */}
              <div
                onClick={() => {
                  if (!isStrictLocked) handleModeChange('strict');
                }}
                className={`p-3.5 rounded-xl border transition-all ${
                  isStrictLocked
                    ? 'opacity-60 bg-slate-100 dark:bg-slate-850/60 border-slate-300 dark:border-slate-750 cursor-not-allowed'
                    : selectedMode === 'strict'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-rose-500" />
                    Chế Độ Strict Mock (Phòng Thi Chuẩn)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                    Đang Khóa 🔒
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {lockReason || 'Đòi hỏi file âm thanh phòng thu kiểm định. Khóa cấm tua/cấm nghe lại/cấm tạm dừng.'}
                </p>
              </div>
            </div>
          </div>

          {/* Sound Check Bar */}
          <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                {hasTestedSound ? (
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Kiểm tra tai nghe & mở khóa quyền phát âm thanh
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {soundFeedback || 'Bấm để phát tiếng chuông thử nghiệm xác nhận âm lượng và mở khóa Autoplay.'}
                </p>
              </div>
            </div>
            <button
              onClick={handleTestSound}
              disabled={isTestingSound}
              className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 active:scale-95 rounded-lg text-slate-700 dark:text-slate-200 shadow-sm transition-all flex items-center gap-1.5 shrink-0"
            >
              {isTestingSound ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Đang phát...
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                  {hasTestedSound ? 'Nghe Lại Thử Nghiệm' : 'Thử Âm Thanh Ngay'}
                </>
              )}
            </button>
          </div>

          {/* Checklist Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Danh Sách 7 Hạng Mục Kiểm Tra Kỹ Thuật:
              </label>
              {report?.isReadyToStart ? (
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sẵn sàng bắt đầu
                </span>
              ) : (
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Có {report?.blockers.length || 0} mục cần xử lý
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              {renderCheckItem(report?.checks.formIntegrity)}
              {renderCheckItem(report?.checks.mediaReadiness)}
              {renderCheckItem(report?.checks.browserCapabilities)}
              {renderCheckItem(report?.checks.storageAccess)}
              {renderCheckItem(report?.checks.activeSession)}
              {renderCheckItem(report?.checks.multiTab)}
              {renderCheckItem(report?.checks.audioGesture)}
            </div>
          </div>

          {/* Active Session Recovery Actions (if exists) */}
          {report?.checks.activeSession?.status === 'warning' && (
            <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Phát hiện phiên làm bài dở dang:
                </span>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  Bạn muốn tiếp tục phiên cũ hay xóa bỏ để làm bài từ đầu?
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {onResumeSession && (
                  <button
                    onClick={() => {
                      onClose();
                      onResumeSession();
                    }}
                    className="px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-all"
                  >
                    Tiếp Tục (Resume)
                  </button>
                )}
                {onDiscardSession && (
                  <button
                    onClick={() => {
                      onDiscardSession();
                      runAudit(selectedMode, hasTestedSound);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-all"
                  >
                    Hủy Phiên Cũ (Discard)
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Đóng
          </button>

          <button
            onClick={handleConfirmStart}
            disabled={!report?.isReadyToStart || isStartConfirmed}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 ${
              report?.isReadyToStart && !isStartConfirmed
                ? 'bg-gradient-to-r from-emerald-600 to-indigo-600 text-white hover:from-emerald-700 hover:to-indigo-700 active:scale-95 shadow-emerald-600/20'
                : 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed shadow-none'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            {isStartConfirmed
              ? 'Đã Xác Nhận Phòng Thi'
              : 'Xác Nhận & Bắt Đầu Bài Thi (120 Phút)'}
          </button>
        </div>
      </div>
    </div>
  );
};
