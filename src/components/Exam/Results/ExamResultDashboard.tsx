/**
 * TOEIC Mastery Hub — Exam Result Dashboard Component (Phase 17)
 *
 * Implements the comprehensive post-exam performance summary:
 * - Real exam metadata: Form, attempt date, mode, duration, integrity audit
 * - Total, Listening & Reading raw scores, accuracy rates, and answer breakdowns
 * - Estimated ETS Scaled Score (10–990) with transparent methodology & educational disclaimer
 * - Part 1–7 performance matrix with visual progress meters
 * - Actionable strengths, weaknesses, and trap analysis
 * - Flagged question audit and topics needing improvement
 * - Fast transition to Answer Review mode (200-Question deep dive)
 */

import React, { useMemo } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Target,
  FileText,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { ExamResult } from '../../../types/mockExam';
import { analyzeExamStrengthsAndWeaknesses } from '../../../utils/examReviewAnalysis';

export interface ExamResultDashboardProps {
  result: ExamResult;
  onOpenReview: () => void;
  onExit: () => void;
  onRetakeExam?: (formId: string) => void;
}

export const ExamResultDashboard: React.FC<ExamResultDashboardProps> = ({
  result,
  onOpenReview,
  onExit,
  onRetakeExam,
}) => {
  const analysis = useMemo(
    () => analyzeExamStrengthsAndWeaknesses(result),
    [result]
  );

  const durationFormatted = useMemo(() => {
    const mins = Math.floor(result.totalTimeSeconds / 60);
    const secs = result.totalTimeSeconds % 60;
    return `${mins} phút ${secs.toString().padStart(2, '0')} giây`;
  }, [result.totalTimeSeconds]);

  const completedDateFormatted = useMemo(() => {
    try {
      return new Date(result.completedAt).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return result.completedAt;
    }
  }, [result.completedAt]);

  const isStrictValid = result.integrityStatus.isStrictValid;
  const isSimulation = result.mode === 'simulation';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 border border-slate-800 shadow-2xl text-white overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-20 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold tracking-wide flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                {result.examCode} • {result.examTitle}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                Revision {result.contentRevision}
              </span>
              {isSimulation ? (
                <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
                  MÔ PHỎNG (SIMULATION)
                </span>
              ) : (
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    isStrictValid
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                  }`}
                >
                  {isStrictValid ? 'STRICT CHUẨN' : 'STRICT CÓ CẢNH BÁO'}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bảng Tổng Kết Kết Quả Bài Thi Thử
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                Thời gian làm bài: <strong>{durationFormatted}</strong>
              </span>
              <span>•</span>
              <span>Nộp bài lúc: <strong>{completedDateFormatted}</strong></span>
              <span>•</span>
              <span className="capitalize">Lý do: {result.submitReason.replace(/_/g, ' ')}</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenReview}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Chữa Bài Chi Tiết (200 Câu)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {onRetakeExam && (
              <button
                onClick={() => onRetakeExam(result.examFormId)}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold border border-slate-700 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Thi Lại (Retake)</span>
              </button>
            )}
            <button
              onClick={onExit}
              className="px-4 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs sm:text-sm font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              Thoát Về Hub
            </button>
          </div>
        </div>
      </div>

      {/* 2. Integrity Status Warning Banner (if abnormal) */}
      {!isStrictValid && !isSimulation && (
        <div className="p-4 rounded-2xl border border-amber-300 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 flex items-start gap-3 text-xs leading-relaxed">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">
              Thông Báo Tính Toàn Vẹn Chế Độ Strict (Integrity Notice)
            </span>
            <p className="text-slate-600 dark:text-slate-400">
              {result.integrityStatus.summary}
            </p>
          </div>
        </div>
      )}

      {/* 3. Top Metrics: Total, Listening & Reading Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Score Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tổng Điểm Toàn Đề
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                result.levelBand.badgeColor || 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
              }`}
            >
              {result.levelBand.level}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-mono">
              {result.totalRaw}
            </span>
            <span className="text-base text-slate-400 font-medium">/ 200 câu</span>
            <span className="ml-auto text-lg font-bold text-indigo-600 dark:text-indigo-400 font-mono">
              {result.accuracyPercentage}%
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${result.accuracyPercentage}%` }}
            />
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500">Ước tính thang điểm ETS:</span>
            <span className="font-extrabold text-indigo-600 dark:text-indigo-300 font-mono text-sm">
              {result.totalScaled} / 990
            </span>
          </div>
        </div>

        {/* Listening Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Phần Nghe (Listening 1–100)
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              Part 1–4
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-mono">
              {result.listeningRaw}
            </span>
            <span className="text-base text-slate-400 font-medium">/ 100 câu</span>
            <span className="ml-auto text-lg font-bold text-amber-600 dark:text-amber-400 font-mono">
              {result.listeningAccuracy}%
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${result.listeningAccuracy}%` }}
            />
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500">Ước tính Listening ETS:</span>
            <span className="font-extrabold text-amber-600 dark:text-amber-300 font-mono text-sm">
              {result.listeningScaled} / 495
            </span>
          </div>
        </div>

        {/* Reading Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Phần Đọc (Reading 101–200)
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              Part 5–7
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-mono">
              {result.readingRaw}
            </span>
            <span className="text-base text-slate-400 font-medium">/ 100 câu</span>
            <span className="ml-auto text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {result.readingAccuracy}%
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${result.readingAccuracy}%` }}
            />
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500">Ước tính Reading ETS:</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-300 font-mono text-sm">
              {result.readingScaled} / 495
            </span>
          </div>
        </div>
      </div>

      {/* 4. Answer Status Breakdown Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/60 dark:bg-emerald-950/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase">
              Trả Lời Đúng
            </span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {result.totalRaw}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/60 dark:bg-rose-950/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-300">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase">
              Trả Lời Sai
            </span>
            <span className="text-xl font-black text-rose-600 dark:text-rose-400 font-mono">
              {result.totalIncorrect}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase">
              Bỏ Trống
            </span>
            <span className="text-xl font-black text-slate-700 dark:text-slate-300 font-mono">
              {result.totalUnanswered}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-300">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase">
              Cắm Cờ Xem Lại
            </span>
            <span className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {result.flaggedCount}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Scaled Score Methodology & Limitations Banner */}
      <div className="p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/20 flex flex-col sm:flex-row items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              Phương Pháp Quy Đổi Điểm Chuẩn ETS:
            </span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
              {result.scaledScoreEstimate.label}
            </span>
          </div>
          <p>
            <strong>Mô hình:</strong> {result.scaledScoreEstimate.methodology}
          </p>
          <p className="text-amber-800 dark:text-amber-300/90 font-medium">
            <strong>Giới hạn kỹ thuật & Cảnh báo:</strong> {result.scaledScoreEstimate.limitations}
          </p>
        </div>
      </div>

      {/* 6. Part 1–7 Performance Matrix */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          Bảng Phân Tích Hiệu Suất Chi Tiết Part 1 – Part 7
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="py-3 px-3 font-bold">Phần Thi (Part)</th>
                <th className="py-3 px-2 font-bold text-center">Section</th>
                <th className="py-3 px-2 font-bold text-center">Số Câu</th>
                <th className="py-3 px-2 font-bold text-center text-emerald-600">Đúng</th>
                <th className="py-3 px-2 font-bold text-center text-rose-600">Sai</th>
                <th className="py-3 px-2 font-bold text-center text-slate-500">Trống</th>
                <th className="py-3 px-3 font-bold text-right">Tỷ Lệ Đúng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {[1, 2, 3, 4, 5, 6, 7].map((pNum) => {
                const part = result.byPart[pNum as 1 | 2 | 3 | 4 | 5 | 6 | 7];
                return (
                  <tr
                    key={pNum}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      {part.partName}
                    </td>
                    <td className="py-3 px-2 text-center capitalize text-slate-500">
                      {part.section}
                    </td>
                    <td className="py-3 px-2 text-center font-mono font-bold">
                      {part.totalQuestions}
                    </td>
                    <td className="py-3 px-2 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {part.correctCount}
                    </td>
                    <td className="py-3 px-2 text-center font-mono font-bold text-rose-600 dark:text-rose-400">
                      {part.incorrectCount}
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-slate-400">
                      {part.unansweredCount}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className={`h-full rounded-full ${
                              part.accuracyRate >= 75
                                ? 'bg-emerald-500'
                                : part.accuracyRate >= 50
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${part.accuracyRate}%` }}
                          />
                        </div>
                        <span className="font-mono font-extrabold w-12 text-slate-900 dark:text-white">
                          {part.accuracyRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Actionable Strengths, Weaknesses & Focus Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Strengths & Weaknesses */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-500" />
            Đánh Giá Điểm Mạnh & Lỗ Hổng Năng Lực
          </h3>

          <div className="space-y-3 text-xs">
            {/* Strengths */}
            <div>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                Điểm Mạnh Vượt Trội (≥ 75%):
              </span>
              {analysis.strengths.length === 0 ? (
                <p className="text-slate-400 italic">Chưa có phần nào đạt trên 75%.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {analysis.strengths.map((s) => (
                    <span
                      key={s.partNum}
                      className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium"
                    >
                      {s.partName} ({s.accuracyRate}%)
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Moderate */}
            {analysis.moderate.length > 0 && (
              <div>
                <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">
                  Cần Củng Cố Thêm (50% – 74%):
                </span>
                <div className="flex flex-wrap gap-2">
                  {analysis.moderate.map((m) => (
                    <span
                      key={m.partNum}
                      className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium"
                    >
                      {m.partName} ({m.accuracyRate}%)
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Weaknesses */}
            <div>
              <span className="font-bold text-rose-600 dark:text-rose-400 block mb-1">
                Lỗ Hổng Trọng Tâm (&lt; 50%):
              </span>
              {analysis.weaknesses.length === 0 ? (
                <p className="text-slate-400 italic">Không có phần nào dưới 50%. Rất tốt!</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {analysis.weaknesses.map((w) => (
                    <span
                      key={w.partNum}
                      className="px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-medium"
                    >
                      {w.partName} ({w.accuracyRate}%)
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Topics to Improve & Traps Encountered */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            Nhóm Chủ Đề & Bẫy Cần Cải Thiện
          </h3>

          <div className="space-y-3 text-xs">
            {analysis.topicsToImprove.length === 0 ? (
              <p className="text-slate-400 italic">
                Tuyệt vời! Không phát hiện chủ đề sai tập trung.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {analysis.topicsToImprove.slice(0, 6).map((topic, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {topic.topic.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Part {topic.partNum} • Sai {topic.incorrectCount}/{topic.totalQuestions} câu
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                      {topic.accuracyRate}%
                    </span>
                  </div>
                ))}
              </div>
            )}

            {analysis.trapTypesEncountered.length > 0 && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Bẫy Đề Thi Thường Gặp:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.trapTypesEncountered.slice(0, 4).map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40 text-[11px]"
                    >
                      {t.trapType} (x{t.missCount})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
