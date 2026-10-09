/**
 * TOEIC Mastery Hub — Exam Workspace Coordinator (Phase 14)
 *
 * Top-level room surface for the Full Mock Exam:
 * - Coordinates pure engine services: useExamTimer, useStrictListeningAudio, examSessionEngine, examSessionStorage.
 * - Question renderers for Listening Part 1-4 with ETS format compliance and audio continuity.
 * - Unified 200-question Answer Sheet with responsive drawer and cell optimization.
 * - Keyboard navigation (A, B, C, D choices, M flag, arrows).
 * - Multi-tab conflict takeover handling.
 * - Reading hold transition screen when Listening concludes (Phase 15 bridge).
 * - Controlled submission audit modal and clean submitted summary state.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ExamForm,
  ExamSession,
  ExamResult,
  ExamSubmitReason,
} from '../../../types/mockExam';
import {
  StandardChoiceKey,
  Part1Question,
  Part2Question,
  Part3Question,
  Part4Question,
  Part5Question,
  Part6Question,
  Part7Question,
  Part3Group,
  Part4Group,
  Part6Group,
  Part7Group,
} from '../../../types/questionBank';
import { useExamTimer } from '../../../hooks/useExamTimer';
import { useStrictListeningAudio } from '../../../hooks/useStrictListeningAudio';
import {
  recordExamAnswer,
  toggleQuestionFlag,
  navigateToQuestion,
  startExam,
} from '../../../utils/examSessionEngine';
import {
  saveActiveExamSession,
  getExamResult,
} from '../../../utils/examSessionStorage';
import { finalizeExamSubmission } from '../../../utils/examSubmissionCoordinator';
import {
  getQuestionById,
  getQuestionsForGroup,
  getQuestionGroupById,
} from '../../../utils/questionBankLookup';
import { ExamWorkspaceHeader } from './ExamWorkspaceHeader';
import { ExamAudioBar } from './ExamAudioBar';
import { ExamAnswerSheet } from './ExamAnswerSheet';
import { ExamSubmitModal } from './ExamSubmitModal';
import { ExamPart1Renderer } from './ExamPart1Renderer';
import { ExamPart2Renderer } from './ExamPart2Renderer';
import { ExamPart3Renderer } from './ExamPart3Renderer';
import { ExamPart4Renderer } from './ExamPart4Renderer';
import { ExamPart5Renderer } from './ExamPart5Renderer';
import { ExamPart6Renderer } from './ExamPart6Renderer';
import { ExamPart7Renderer, ExamPart7QuestionItem } from './ExamPart7Renderer';
import { ExamResultWorkspace } from '../Results';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  AlertCircle,
  Award,
  RefreshCw,
  Info,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export interface ExamWorkspaceProps {
  examForm: ExamForm;
  initialSession: ExamSession;
  onExit: () => void;
}

export const ExamWorkspace: React.FC<ExamWorkspaceProps> = ({
  examForm,
  initialSession,
  onExit,
}) => {
  // Ensure session is started if currently ready
  const preparedSession = useMemo(() => {
    if (initialSession.status === 'ready') {
      const res = startExam(initialSession);
      if (res.success) {
        saveActiveExamSession(res.session);
        return res.session;
      }
    }
    return initialSession;
  }, [initialSession]);

  const [session, setSession] = useState<ExamSession>(preparedSession);
  const [examResult, setExamResult] = useState<ExamResult | null>(() =>
    getExamResult(preparedSession.sessionId)
  );
  const [isAnswerSheetOpen, setIsAnswerSheetOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(
    session.status === 'submitted' || examResult !== null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isViewingFullReview, setIsViewingFullReview] = useState(false);

  // Callback to persist session changes safely
  const updateSessionState = useCallback((nextSession: ExamSession) => {
    setSession(nextSession);
    saveActiveExamSession(nextSession);
  }, []);

  // Execution pipeline for idempotent exam finalization
  const executeFinalize = useCallback(
    (reason: ExamSubmitReason = 'user_completed') => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      setSubmissionError(null);

      try {
        const outcome = finalizeExamSubmission(session, examForm, reason);
        if (outcome.success) {
          if (outcome.session) {
            setSession(outcome.session);
          }
          if (outcome.result) {
            setExamResult(outcome.result);
          }
          setIsSubmittedSuccess(true);
        } else {
          setSubmissionError(
            outcome.error ||
              'Không thể lưu kết quả bài thi vào bộ nhớ LocalStorage. Vui lòng thử lại.'
          );
        }
      } catch (err: unknown) {
        setSubmissionError(
          `Lỗi hệ thống khi nộp bài: ${err instanceof Error ? err.message : String(err)}`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, session, examForm]
  );

  // Sync stored examResult if session is already submitted upon mount/resume
  useEffect(() => {
    if ((session.status === 'submitted' || isSubmittedSuccess) && !examResult) {
      const stored = getExamResult(session.sessionId);
      if (stored) {
        setExamResult(stored);
      } else {
        executeFinalize(session.submitReason || 'user_completed');
      }
    }
  }, [session.status, session.sessionId, session.submitReason, isSubmittedSuccess, examResult, executeFinalize]);

  // Timer & Multi-tab Hook
  const {
    tabLeaseStatus,
    isConflict,
    takeoverLease,
    safeTransitionToReading,
    formattedSectionTime,
    formattedOverallTime,
    isUrgent,
  } = useExamTimer({
    session,
    onSessionUpdate: updateSessionState,
    onListeningEnded: () => {
      // Audio stops automatically via engine listener
    },
    onExamSubmitted: (reason) => {
      executeFinalize(reason);
    },
  });

  // Strict Listening Audio Engine Hook
  const {
    state: audioState,
    startPlayback,
    pausePlayback,
  } = useStrictListeningAudio(examForm, session, {
    volume: 1.0,
    onQuestionSync: (qNum) => {
      // Automatically keep question in sync with audio progression in listening
      if (session.status === 'listening' && qNum <= 100) {
        const navRes = navigateToQuestion(session, qNum);
        if (navRes.success) {
          updateSessionState(navRes.session);
        }
      }
    },
    onSectionEnded: () => {
      // Listening audio completed, transition section safely
      safeTransitionToReading();
    },
  });

  // Calculate quick stats
  const answeredCount = useMemo(() => {
    return Object.values(session.answers).filter((a) => a.selectedChoice !== null).length;
  }, [session.answers]);

  const flaggedCount = useMemo(() => {
    return Object.values(session.flaggedQuestions).filter(Boolean).length;
  }, [session.flaggedQuestions]);

  const unansweredCount = 200 - answeredCount;

  // Active question references
  const currentQNum = session.currentQuestionNumber;
  const currentQRef = useMemo(() => {
    return examForm.questions.find((q) => q.globalQuestionNumber === currentQNum);
  }, [examForm.questions, currentQNum]);

  const currentQuestionData = useMemo(() => {
    if (!currentQRef) return null;
    return getQuestionById(currentQRef.questionId);
  }, [currentQRef]);

  // If in Part 3, 4, 6, 7, lookup group
  const currentGroupData = useMemo(() => {
    if (!currentQRef?.groupId) return null;
    return getQuestionGroupById(currentQRef.groupId);
  }, [currentQRef]);

  const currentGroupQuestions = useMemo(() => {
    if (!currentQRef?.groupId) return [];
    return getQuestionsForGroup(currentQRef.groupId);
  }, [currentQRef]);

  // For Part 7, map group questions with global question numbers from examForm
  const part7QuestionsWithNumbers = useMemo((): ExamPart7QuestionItem[] => {
    if (!currentQRef?.groupId) return [];
    const groupQuestionsInForm = examForm.questions.filter(
      (q) => q.groupId === currentQRef.groupId
    );
    return groupQuestionsInForm
      .map((fq) => {
        const qObj = getQuestionById(fq.questionId) as Part7Question | undefined;
        if (!qObj) return null;
        return {
          question: qObj,
          globalQuestionNumber: fq.globalQuestionNumber,
        };
      })
      .filter((item): item is ExamPart7QuestionItem => Boolean(item));
  }, [examForm.questions, currentQRef?.groupId]);

  // Answer handler
  const handleSelectChoice = useCallback(
    (targetQNum: number, choice: StandardChoiceKey) => {
      const res = recordExamAnswer(session, targetQNum, choice);
      if (res.success) {
        updateSessionState(res.session);
      }
    },
    [session, updateSessionState]
  );

  // Flag toggle handler
  const handleToggleFlag = useCallback(
    (targetQNum: number) => {
      const res = toggleQuestionFlag(session, targetQNum);
      if (res.success) {
        updateSessionState(res.session);
      }
    },
    [session, updateSessionState]
  );

  // Navigation restriction warning state
  const [navWarning, setNavWarning] = useState<string | null>(null);

  // Navigation handler
  const handleNavigate = useCallback(
    (targetQNum: number) => {
      const res = navigateToQuestion(session, targetQNum);
      if (res.success) {
        updateSessionState(res.session);
      } else {
        setNavWarning(res.error || 'Điều hướng bị giới hạn theo quy chế phòng thi.');
        setTimeout(() => setNavWarning(null), 3500);
      }
    },
    [session, updateSessionState]
  );

  // Submit confirmation handler
  const handleConfirmSubmit = useCallback(() => {
    setIsSubmitModalOpen(false);
    executeFinalize('user_completed');
  }, [executeFinalize]);

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an input or button is actively typing
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key.toUpperCase();

      // Answer keys: A, B, C, D (or 1, 2, 3, 4)
      if (['A', 'B', 'C', 'D'].includes(key) || ['1', '2', '3', '4'].includes(key)) {
        const choiceMap: Record<string, StandardChoiceKey> = {
          A: 'A', '1': 'A',
          B: 'B', '2': 'B',
          C: 'C', '3': 'C',
          D: 'D', '4': 'D',
        };
        const choice = choiceMap[key];
        if (choice) {
          // Part 2 cannot choose D
          if (currentQNum >= 7 && currentQNum <= 31 && choice === 'D') {
            return;
          }
          handleSelectChoice(currentQNum, choice);
        }
      }

      // Flag keys: M or F
      if (key === 'M' || key === 'F') {
        handleToggleFlag(currentQNum);
      }

      // Arrow navigation
      if (e.key === 'ArrowRight' && currentQNum < 200) {
        handleNavigate(currentQNum + 1);
      } else if (e.key === 'ArrowLeft') {
        if (session.currentSection === 'reading' && session.mode === 'strict') {
          if (currentQNum > 101) handleNavigate(currentQNum - 1);
        } else if (currentQNum > 1) {
          handleNavigate(currentQNum - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQNum, session.currentSection, session.mode, handleSelectChoice, handleToggleFlag, handleNavigate]);

  // Render Full Result & Review Workspace if candidate clicked deep dive review (Phase 17)
  if ((isSubmittedSuccess || session.status === 'submitted') && isViewingFullReview && examResult) {
    return (
      <ExamResultWorkspace
        result={examResult}
        onExit={onExit}
        initialTab="dashboard"
      />
    );
  }

  // Render Submitted Result Screen (Phase 16 Scoring & Submission)
  if (isSubmittedSuccess || session.status === 'submitted') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          {/* Header Icon & Title */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bài Thi Đã Được Nộp & Chấm Điểm!
            </h1>
            <p className="text-xs text-slate-400">
              Mã đề: <strong className="text-indigo-400 font-mono">{examForm.code}</strong> • {examForm.title} (Revision {examForm.contentRevision})
            </p>
          </div>

          {/* Submission / Persistence Error Recovery Alert */}
          {submissionError && (
            <div className="p-4 rounded-2xl border border-rose-500/40 bg-rose-950/40 text-rose-300 text-xs text-left space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-200">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Lỗi Lưu Dữ Liệu Kết Quả</span>
              </div>
              <p className="leading-relaxed">{submissionError}</p>
              <button
                onClick={() => executeFinalize('user_completed')}
                disabled={isSubmitting}
                className="mt-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
                <span>{isSubmitting ? 'Đang thử lại...' : 'Thử lại lưu kết quả'}</span>
              </button>
            </div>
          )}

          {/* Estimated Scaled Score Hero Card */}
          {examResult && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-900/60 shadow-lg space-y-3">
              <div className="flex items-center justify-between text-xs text-indigo-300">
                <span className="font-semibold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Điểm Quy Đổi Dự Báo (ETS Scaled Estimate)</span>
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${examResult.levelBand.badgeColor}`}>
                  {examResult.levelBand.level}
                </span>
              </div>

              <div className="flex items-baseline justify-center gap-3">
                <span className="text-4xl sm:text-5xl font-extrabold font-mono text-white tracking-tight">
                  ~{examResult.totalScaled}
                </span>
                <span className="text-slate-500 text-sm font-semibold">/ 990</span>
              </div>

              <div className="flex items-center justify-center gap-6 text-xs font-mono text-slate-300 pt-1 border-t border-slate-800/60">
                <span>
                  Listening: <strong className="text-emerald-400 font-bold">~{examResult.listeningScaled}</strong>/495
                </span>
                <span>•</span>
                <span>
                  Reading: <strong className="text-cyan-400 font-bold">~{examResult.readingScaled}</strong>/495
                </span>
              </div>

              {/* Scaled Score Limitation Disclaimer */}
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 text-left">
                <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {examResult.scaledScoreEstimate.limitations}
                </p>
              </div>
            </div>
          )}

          {/* Raw Score Statistics Matrix */}
          {examResult ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-left">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Listening Đúng</span>
                <span className="text-lg font-mono font-bold text-emerald-400">
                  {examResult.listeningRaw}/100
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {examResult.listeningAccuracy}%
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-left">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Reading Đúng</span>
                <span className="text-lg font-mono font-bold text-cyan-400">
                  {examResult.readingRaw}/100
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {examResult.readingAccuracy}%
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-left">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Tổng Số Câu Đúng</span>
                <span className="text-lg font-mono font-bold text-indigo-300">
                  {examResult.totalRaw}/200
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {examResult.accuracyPercentage}% chính xác
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-left">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Sai / Chưa Làm</span>
                <span className="text-lg font-mono font-bold text-rose-400">
                  {examResult.totalIncorrect} <span className="text-xs text-slate-500 font-normal">sai</span> / {examResult.totalUnanswered} <span className="text-xs text-slate-500 font-normal">bỏ</span>
                </span>
                <span className="text-[10px] text-amber-400 block font-mono">
                  {examResult.flaggedCount} cờ xem lại
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
              <div>
                <span className="text-[10px] text-slate-500 block">Đã làm</span>
                <span className="text-lg font-mono font-bold text-emerald-400">
                  {answeredCount}/200
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Thời gian</span>
                <span className="text-lg font-mono font-bold text-slate-200">
                  {Math.round(session.elapsedSeconds / 60)} phút
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Cờ xem lại</span>
                <span className="text-lg font-mono font-bold text-amber-400">
                  {flaggedCount}
                </span>
              </div>
            </div>
          )}

          {/* Part 1 to Part 7 Quick Breakdown */}
          {examResult && (
            <div className="space-y-2 text-left">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Chi Tiết Từng Phần (Part 1 – 7)
              </span>
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {[1, 2, 3, 4, 5, 6, 7].map((pNum) => {
                  const part = examResult.byPart[pNum as 1 | 2 | 3 | 4 | 5 | 6 | 7];
                  return (
                    <div
                      key={pNum}
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800/70"
                    >
                      <span className="text-[10px] font-bold text-slate-400 block">
                        P{pNum}
                      </span>
                      <span className="text-xs font-mono font-bold text-white block mt-0.5">
                        {part.correctCount}/{part.totalQuestions}
                      </span>
                      <span className="text-[9px] text-slate-500 block font-mono">
                        {part.accuracyRate}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Integrity & Mode Qualification Status */}
          {examResult && (
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-left flex items-start gap-2.5 text-xs">
              {examResult.integrityStatus.isStrictValid ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <span className="font-bold text-slate-200 block">
                  {examResult.mode === 'strict'
                    ? examResult.integrityStatus.isStrictValid
                      ? 'Chuẩn Strict Nghiêm Ngặt 120 Phút Hợp Lệ'
                      : 'Cảnh Báo Tính Toàn Vẹn Chế Độ Strict'
                    : 'Chế Độ Làm Bài Mô Phỏng (Simulation)'}
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {examResult.integrityStatus.summary}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons: Full Review vs Return to Library */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setIsViewingFullReview(true)}
              className="flex-1 py-3.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Xem Bảng Điểm & Chữa Bài Chi Tiết</span>
            </button>
            <button
              onClick={onExit}
              className="px-5 py-3.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Về Thư Viện</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Reading Hold Screen if candidate entered Reading section
  const isReadingSection = session.currentSection === 'reading' || currentQNum > 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none">
      {/* Workspace Header */}
      <ExamWorkspaceHeader
        examForm={examForm}
        session={session}
        currentPart={session.currentPart}
        formattedSectionTime={formattedSectionTime}
        formattedOverallTime={formattedOverallTime}
        isUrgent={isUrgent}
        tabLeaseStatus={tabLeaseStatus}
        isConflict={isConflict}
        onTakeoverLease={takeoverLease}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onExitWorkspace={onExit}
        isAnswerSheetOpen={isAnswerSheetOpen}
        onToggleAnswerSheet={() => setIsAnswerSheetOpen((prev) => !prev)}
        answeredCount={answeredCount}
        flaggedCount={flaggedCount}
      />

      {/* Audio Playback Bar (Active during Listening only) */}
      {!isReadingSection && (
        <ExamAudioBar
          audioState={audioState}
          onStartPlayback={startPlayback}
          onPausePlayback={pausePlayback}
          onVolumeChange={(v) => {}}
          onToggleMute={() => {}}
        />
      )}

      {/* Navigation Restriction Warning Banner */}
      {navWarning && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-3">
          <div className="p-3.5 rounded-2xl border border-rose-500/40 bg-rose-950/40 text-rose-300 text-xs flex items-center gap-2.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <p className="font-medium">{navWarning}</p>
          </div>
        </div>
      )}

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        {isReadingSection ? (
          /* Reading Question Renderers (Part 5 - 7) */
          <div className="w-full">
            {/* Part 5: Incomplete Sentences (101-130) */}
            {currentQNum >= 101 && currentQNum <= 130 && currentQuestionData && (
              <ExamPart5Renderer
                question={currentQuestionData as Part5Question}
                globalQuestionNumber={currentQNum}
                answer={session.answers[currentQNum]}
                isFlagged={Boolean(session.flaggedQuestions[currentQNum])}
                onSelectChoice={(choice) => handleSelectChoice(currentQNum, choice)}
                onToggleFlag={() => handleToggleFlag(currentQNum)}
                isLocked={isConflict}
              />
            )}

            {/* Part 6: Text Completion (131-146) */}
            {currentQNum >= 131 && currentQNum <= 146 && currentGroupData && (
              <ExamPart6Renderer
                group={currentGroupData as Part6Group}
                questions={currentGroupQuestions as Part6Question[]}
                activeQuestionNumber={currentQNum}
                answers={session.answers}
                flaggedQuestions={session.flaggedQuestions}
                onSelectChoice={handleSelectChoice}
                onToggleFlag={handleToggleFlag}
                onFocusQuestion={handleNavigate}
                isLocked={isConflict}
              />
            )}

            {/* Part 7: Reading Comprehension (147-200) */}
            {currentQNum >= 147 && currentQNum <= 200 && currentGroupData && (
              <ExamPart7Renderer
                group={currentGroupData as Part7Group}
                questionsWithNumbers={part7QuestionsWithNumbers}
                activeQuestionNumber={currentQNum}
                answers={session.answers}
                flaggedQuestions={session.flaggedQuestions}
                onSelectChoice={handleSelectChoice}
                onToggleFlag={handleToggleFlag}
                onFocusQuestion={handleNavigate}
                isLocked={isConflict}
              />
            )}

            {/* Quick Navigators (Reading) */}
            <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <button
                onClick={() => {
                  if (session.mode === 'strict') {
                    if (currentQNum > 101) handleNavigate(currentQNum - 1);
                  } else if (currentQNum > 1) {
                    handleNavigate(currentQNum - 1);
                  }
                }}
                disabled={session.mode === 'strict' ? currentQNum <= 101 : currentQNum <= 1}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
                title="Câu trước đó"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Câu trước</span>
              </button>

              <span className="font-mono text-slate-400">
                Câu {currentQNum} / 200 (Reading — Part {session.currentPart})
              </span>

              <button
                onClick={() => currentQNum < 200 && handleNavigate(currentQNum + 1)}
                disabled={currentQNum >= 200}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
                title="Câu kế tiếp"
              >
                <span>Câu kế tiếp</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Listening Question Renderers (Part 1 - 4) */
          <div className="w-full">
            {/* Part 1: Photographs (1-6) */}
            {currentQNum <= 6 && currentQuestionData && (
              <ExamPart1Renderer
                question={currentQuestionData as Part1Question}
                globalQuestionNumber={currentQNum}
                answer={session.answers[currentQNum]}
                onSelectChoice={(choice) => handleSelectChoice(currentQNum, choice)}
                onToggleFlag={() => handleToggleFlag(currentQNum)}
                isLocked={isConflict}
              />
            )}

            {/* Part 2: Question-Response (7-31) */}
            {currentQNum >= 7 && currentQNum <= 31 && currentQuestionData && (
              <ExamPart2Renderer
                question={currentQuestionData as Part2Question}
                globalQuestionNumber={currentQNum}
                answer={session.answers[currentQNum]}
                onSelectChoice={(choice) => handleSelectChoice(currentQNum, choice)}
                onToggleFlag={() => handleToggleFlag(currentQNum)}
                isLocked={isConflict}
              />
            )}

            {/* Part 3: Conversations (32-70) */}
            {currentQNum >= 32 && currentQNum <= 70 && currentGroupData && (
              <ExamPart3Renderer
                group={currentGroupData as Part3Group}
                questions={currentGroupQuestions as Part3Question[]}
                activeQuestionNumber={currentQNum}
                answers={session.answers}
                onSelectChoice={handleSelectChoice}
                onToggleFlag={handleToggleFlag}
                onFocusQuestion={handleNavigate}
                isLocked={isConflict}
              />
            )}

            {/* Part 4: Short Talks (71-100) */}
            {currentQNum >= 71 && currentQNum <= 100 && currentGroupData && (
              <ExamPart4Renderer
                group={currentGroupData as Part4Group}
                questions={currentGroupQuestions as Part4Question[]}
                activeQuestionNumber={currentQNum}
                answers={session.answers}
                onSelectChoice={handleSelectChoice}
                onToggleFlag={handleToggleFlag}
                onFocusQuestion={handleNavigate}
                isLocked={isConflict}
              />
            )}

            {/* In-Between Group Quick Navigators */}
            <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <button
                onClick={() => currentQNum > 1 && handleNavigate(currentQNum - 1)}
                disabled={currentQNum <= 1}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
                title="Câu trước đó"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Câu trước</span>
              </button>

              <span className="font-mono text-slate-400">
                Câu {currentQNum} / 100 (Listening — Part {session.currentPart})
              </span>

              <button
                onClick={() => currentQNum < 100 && handleNavigate(currentQNum + 1)}
                disabled={currentQNum >= 100}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
                title="Câu kế tiếp"
              >
                <span>Câu kế tiếp</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Answer Sheet Drawer */}
      <ExamAnswerSheet
        session={session}
        currentQuestionNumber={currentQNum}
        onSelectQuestion={handleNavigate}
        isOpen={isAnswerSheetOpen}
        onClose={() => setIsAnswerSheetOpen(false)}
        currentAudioStartQuestion={audioState.currentItem?.startQuestionNumber}
        currentAudioEndQuestion={audioState.currentItem?.endQuestionNumber}
      />

      {/* Submission Audit Modal */}
      <ExamSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirmSubmit={handleConfirmSubmit}
        session={session}
        answeredCount={answeredCount}
        unansweredCount={unansweredCount}
        flaggedCount={flaggedCount}
      />
    </div>
  );
};
