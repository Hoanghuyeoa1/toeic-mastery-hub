/**
 * TOEIC Mastery Hub — Full Mock Exam Library Hub (Phase 13)
 *
 * Implements the dedicated Full-Length Mock Exam Center (200 Questions / 120 Minutes):
 * - Displays registered ExamForms with real metadata (Code, Title, Schema, Revision)
 * - Strict-ready / Simulation-ready status filtering and transparent lock banners
 * - Reads real user history from local storage (no fake logs or mock history)
 * - Unfinished session detection with Resume / Discard actions
 * - Interactive Preflight, Instructions, and Real History modals
 */

import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Lock,
  Clock,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  History,
  Headphones,
  ShieldCheck,
  Filter,
  Info,
  Trash2,
} from 'lucide-react';
import { ExamForm, ExamSession, ExamResult } from '../../types/mockExam';
import { ExamLibraryFilter } from '../../types/examLibrary';
import { getAllExamForms, getExamFormById } from '../../utils/examFormRegistry';
import {
  loadActiveExamSession,
  getExamSessionHistory,
  clearActiveExamSession,
  saveActiveExamSession,
} from '../../utils/examSessionStorage';
import {
  createExamSession,
  executePreflightCheck,
  startExam,
} from '../../utils/examSessionEngine';
import { ExamInstructionsModal } from './ExamInstructionsModal';
import { ExamPreflightModal } from './ExamPreflightModal';
import { ExamWorkspace } from './Workspace/ExamWorkspace';
import { ExamHistoryModal, ExamResultWorkspace } from './Results';

export const ExamLibraryHub: React.FC = () => {
  // Filters
  const [filter, setFilter] = useState<ExamLibraryFilter>('all');

  // Running Exam Workspace State
  const [runningExam, setRunningExam] = useState<{
    form: ExamForm;
    session: ExamSession;
  } | null>(null);

  // Viewing Saved Exam Result State (Phase 17)
  const [viewingResult, setViewingResult] = useState<ExamResult | null>(null);

  // Modals
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isPreflightOpen, setIsPreflightOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<ExamForm | null>(null);

  // Storage State: Real active session and history
  const getActiveSessionSafe = (): ExamSession | null => {
    const res = loadActiveExamSession(getExamFormById);
    return res.success ? (res.data ?? null) : null;
  };

  const [activeSession, setActiveSession] = useState<ExamSession | null>(getActiveSessionSafe);
  const [historyList, setHistoryList] = useState<ExamSession[]>(() => getExamSessionHistory());

  // Refresh active session and history
  const refreshStorageData = () => {
    setActiveSession(getActiveSessionSafe());
    setHistoryList(getExamSessionHistory());
  };

  // Registered forms
  const allForms = useMemo(() => getAllExamForms(), []);

  // Filtered forms
  const displayedForms = useMemo(() => {
    return allForms.filter((form) => {
      const status = form.media.readinessStatus;
      if (filter === 'strict-ready') {
        return status === 'strict-ready' && !form.media.strictLocked;
      }
      if (filter === 'simulation-ready') {
        return status === 'simulation-ready' || status === 'strict-ready';
      }
      return true;
    });
  }, [allForms, filter]);

  const handleOpenPreflight = (form: ExamForm) => {
    setSelectedForm(form);
    setIsPreflightOpen(true);
  };

  const handleResumeSession = (form: ExamForm) => {
    if (activeSession && activeSession.examFormId === form.id) {
      setRunningExam({ form, session: activeSession });
    } else {
      handleOpenPreflight(form);
    }
  };

  const handleDiscardSession = (_formId?: string) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy bỏ phiên thi dở dang này không? Toàn bộ đáp án của phiên này sẽ bị xóa.')) {
      clearActiveExamSession();
      refreshStorageData();
    }
  };

  // Render Exam Workspace directly if an exam is running
  if (runningExam) {
    return (
      <ExamWorkspace
        examForm={runningExam.form}
        initialSession={runningExam.session}
        onExit={() => {
          setRunningExam(null);
          refreshStorageData();
        }}
      />
    );
  }

  // Render Exam Result & Review Workspace if candidate is viewing a completed attempt (Phase 17)
  if (viewingResult) {
    return (
      <ExamResultWorkspace
        result={viewingResult}
        onExit={() => {
          setViewingResult(null);
          refreshStorageData();
        }}
        onRetakeExam={(formId) => {
          setViewingResult(null);
          const form = getExamFormById(formId);
          if (form) handleOpenPreflight(form);
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 border border-slate-800 shadow-2xl overflow-hidden text-white">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-20 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold tracking-wide">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            ETS FULL-LENGTH MOCK EXAM CENTER
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Trung Tâm Thi Thử TOEIC Chuẩn Hóa
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Mô phỏng áp lực phòng thi thật <strong>200 Câu / 120 Phút</strong>. Tách biệt hoàn toàn khỏi chế độ luyện tập, thi hành kỷ luật âm thanh liên hoàn và hệ thống đồng hồ bất biến Offline-First.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>45m Listening + 75m Reading</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700">
              <Headphones className="w-4 h-4 text-amber-400" />
              <span>Part 1 → Part 4 Tuần Tự Tuyến Tính</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Tự Lưu LocalStorage & Chống Xung Đột Đa Tab</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Transparency Banner */}
      <div className="p-4 sm:p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200">
              Báo Cáo Minh Bạch Kỹ Thuật: Chế Độ Strict Mock Đang Bị Khóa
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              Theo nguyên tắc <em>Code Truth & Zero-Cloud Backend</em>, đề thi mẫu Form 01 hiện chưa tích hợp gói âm thanh phòng thu (prerecorded audio files) và timeline kiểm định. Do đó, chế độ <strong>Strict Mock</strong> bị khóa cứng minh bạch. Đề thi sẵn sàng 100% cho <strong>Chế Độ Mô Phỏng (Simulation Mode)</strong> bằng Web Speech API native.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsInstructionsOpen(true)}
          className="px-4 py-2 text-xs font-bold text-amber-900 dark:text-amber-200 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-slate-750 active:scale-95 rounded-xl transition-all shadow-sm shrink-0 flex items-center gap-1.5"
        >
          <BookOpen className="w-4 h-4" />
          Đọc Quy Chế Thi
        </button>
      </div>

      {/* Filter and Overview Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Danh Mục Đề Thi Khả Dụng
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {displayedForms.length} Đề
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Lựa chọn đề thi để thực hiện kiểm tra kỹ thuật (Preflight) và vào phòng thi
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-750 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Tất Cả ({allForms.length})
          </button>
          <button
            onClick={() => setFilter('simulation-ready')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filter === 'simulation-ready'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Mô Phỏng Sẵn Sàng
          </button>
          <button
            onClick={() => setFilter('strict-ready')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filter === 'strict-ready'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Strict Ready (0)
          </button>
        </div>
      </div>

      {/* Exam Forms Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayedForms.map((form) => {
          const isStrictLocked = form.media.strictLocked;
          const isSimulationReady = form.media.readinessStatus === 'simulation-ready';

          // Check if active session belongs to this form
          const isCurrentActive =
            activeSession &&
            activeSession.status !== 'submitted' &&
            activeSession.examFormId === form.id;

          // Filter history for this form
          const formHistory = historyList.filter((h) => h.examFormId === form.id);
          const latestHistory = formHistory[formHistory.length - 1];

          return (
            <div
              key={form.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Card Header & Badges */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {form.code}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        v{form.schemaVersion} (Rev {form.contentRevision})
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {form.title}
                    </h3>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {isSimulationReady && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Simulation Ready
                      </span>
                    )}
                    {isStrictLocked && (
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-rose-500" />
                        Strict Locked
                      </span>
                    )}
                  </div>
                </div>

                {/* Structure Stats Grid */}
                <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">TỔNG SỐ CÂU</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {form.metadata.totalQuestions}
                    </span>
                    <span className="text-[10px] text-slate-500 block">100 L / 100 R</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">THỜI LƯỢNG</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      120 Phút
                    </span>
                    <span className="text-[10px] text-slate-500 block">45m L / 75m R</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">ĐỘ PHỦ</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      7 Parts
                    </span>
                    <span className="text-[10px] text-slate-500 block">42 Groups</span>
                  </div>
                </div>

                {/* Active Session Notice on Card */}
                {isCurrentActive && (
                  <div className="p-3 rounded-xl border border-indigo-300 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-600 animate-pulse" />
                      <div>
                        <span className="font-bold text-indigo-950 dark:text-indigo-200">
                          Phiên thi đang làm dở:
                        </span>
                        <p className="text-[11px] text-indigo-700 dark:text-indigo-400">
                          {activeSession.currentSection.toUpperCase()} • Part {activeSession.currentPart} • Câu {activeSession.currentQuestionNumber}/200
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDiscardSession(form.id)}
                      className="p-1.5 text-rose-600 hover:text-rose-700 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-colors"
                      title="Hủy phiên thi dở dang"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Real User History Info */}
                <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between pt-1">
                  <span className="flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-slate-400" />
                    Lịch sử làm bài:
                  </span>
                  {latestHistory ? (
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      Đã thi {formHistory.length} lần • Gần nhất:{' '}
                      <strong className="text-indigo-600 dark:text-indigo-400">
                        {Object.values(latestHistory.answers || {}).filter(a => a.selectedChoice !== null).length}/200 câu
                      </strong>{' '}
                      ({new Date(latestHistory.lastSavedAt).toLocaleDateString('vi-VN')})
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">Chưa có lượt thi nào</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsInstructionsOpen(true)}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Quy Chế
                  </button>

                  {formHistory.length > 0 && (
                    <button
                      onClick={() => setIsHistoryOpen(true)}
                      className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1"
                    >
                      <History className="w-3.5 h-3.5" />
                      Lịch Sử ({formHistory.length})
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isCurrentActive && (
                    <button
                      onClick={() => handleResumeSession(form)}
                      className="px-3.5 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Tiếp Tục
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenPreflight(form)}
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Kiểm Tra & Vào Thi (Preflight)
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {displayedForms.length === 0 && (
          <div className="col-span-full p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 space-y-2">
            <Filter className="w-8 h-8 mx-auto text-slate-300" />
            <p className="font-semibold text-sm">Không có đề thi nào phù hợp với bộ lọc hiện tại.</p>
            <p className="text-xs">Vui lòng chọn bộ lọc khác để hiển thị đề thi.</p>
          </div>
        )}
      </div>

      {/* Instructions Modal */}
      <ExamInstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
        onProceedToPreflight={() => {
          if (allForms.length > 0) {
            handleOpenPreflight(allForms[0]);
          }
        }}
      />

      {/* Preflight Modal */}
      {selectedForm && (
        <ExamPreflightModal
          isOpen={isPreflightOpen}
          examForm={selectedForm}
          onClose={() => setIsPreflightOpen(false)}
          onStartExamConfirmed={(mode) => {
            setIsPreflightOpen(false);
            let sessionToRun: ExamSession;
            if (activeSession && activeSession.examFormId === selectedForm.id) {
              sessionToRun = activeSession;
            } else {
              sessionToRun = createExamSession(
                { examFormId: selectedForm.id, mode },
                selectedForm
              );
              const pfRes = executePreflightCheck(sessionToRun, selectedForm);
              if (pfRes.success) {
                sessionToRun = pfRes.session;
              }
              const startRes = startExam(sessionToRun);
              if (startRes.success) {
                sessionToRun = startRes.session;
              }
              saveActiveExamSession(sessionToRun);
            }
            setRunningExam({ form: selectedForm, session: sessionToRun });
            refreshStorageData();
          }}
          onResumeSession={() => {
            setIsPreflightOpen(false);
            if (activeSession) {
              setRunningExam({ form: selectedForm, session: activeSession });
            }
          }}
          onDiscardSession={() => {
            handleDiscardSession(selectedForm.id);
          }}
        />
      )}

      {/* Real History Modal with Full Review & Retake Comparison (Phase 17) */}
      <ExamHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => {
          setIsHistoryOpen(false);
          refreshStorageData();
        }}
        onSelectResult={(result) => {
          setViewingResult(result);
        }}
        onRetakeExam={(formId) => {
          const form = getExamFormById(formId);
          if (form) handleOpenPreflight(form);
        }}
      />
    </div>
  );
};
