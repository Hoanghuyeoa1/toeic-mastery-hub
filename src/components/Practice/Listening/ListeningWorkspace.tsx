/**
 * TOEIC Mastery Hub — Listening Practice Workspace (Part 1–4)
 * Phase 7: Listening Practice Workspace
 *
 * Full-featured test environment for TOEIC Listening:
 * - Part 1: Photographs (SVG illustrations, audio reciting A-D, hidden script by default)
 * - Part 2: Question-Response (Strictly A-C, audio prompt, hidden script by default)
 * - Part 3: Short Conversations (Shared group audio, graphic context, dialogue transcript in Practice mode)
 * - Part 4: Short Talks (Shared talk audio, graphic context, talk transcript in Practice mode)
 * - Wall-clock timed countdown with auto-submit & double-submit protection
 * - Answer locking after submission
 * - Keyboard shortcuts (A, B, C, D, M, ArrowLeft, ArrowRight)
 * - Clean audio resource teardown
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PracticeSessionData } from '../../../types/practiceSession';
import {
  Part1Question,
  Part2Question,
  Part3Group,
  Part3Question,
  Part4Group,
  Part4Question,
  StandardChoiceKey,
  Part2ChoiceKey,
} from '../../../types/questionBank';
import { usePracticeSession } from '../../../hooks/usePracticeSession';
import {
  getQuestionById,
  getQuestionGroupById,
  getQuestionsForGroup,
} from '../../../utils/questionBankLookup';
import { WorkspaceHeader } from './WorkspaceHeader';
import { QuestionNavigatorDrawer } from './QuestionNavigatorDrawer';
import { SubmitConfirmationModal } from './SubmitConfirmationModal';
import { Part1PhotographView } from './Part1PhotographView';
import { Part2QuestionResponseView } from './Part2QuestionResponseView';
import { Part3ConversationView } from './Part3ConversationView';
import { Part4TalkView } from './Part4TalkView';
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

export interface ListeningWorkspaceProps {
  initialSession?: PracticeSessionData;
  onExit?: () => void;
  onSessionSubmitted?: (session: PracticeSessionData) => void;
  className?: string;
}

export const ListeningWorkspace: React.FC<ListeningWorkspaceProps> = ({
  initialSession,
  onExit,
  onSessionSubmitted,
  className = '',
}) => {
  const {
    session,
    selectAnswer,
    toggleMark,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    recordHelp,
    submit,
    abandon,
    remainingSeconds,
    isExpired,
    isSubmitted,
    answeredCount,
    unansweredCount,
    markedCount,
    totalQuestions,
  } = usePracticeSession({
    initialSession,
    onSessionCompleted: onSessionSubmitted,
  });

  // Modal & Assistance state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);
  const [showAssistance, setShowAssistance] = useState(false);

  // Derived current question
  const currentQuestionId = session?.questionIds[session.currentQuestionIndex] || '';
  const currentQuestion = useMemo(() => {
    return currentQuestionId ? getQuestionById(currentQuestionId) : undefined;
  }, [currentQuestionId]);

  // Derived parent group for Part 3/4
  const currentGroup = useMemo(() => {
    if (!currentQuestion?.groupId) return undefined;
    return getQuestionGroupById(currentQuestion.groupId);
  }, [currentQuestion?.groupId]);

  // Derived group questions for Part 3/4
  const groupQuestions = useMemo(() => {
    if (!currentQuestion?.groupId) return [];
    return getQuestionsForGroup(currentQuestion.groupId);
  }, [currentQuestion?.groupId]);

  // Reset assistance view when moving to another question
  useEffect(() => {
    setShowAssistance(false);
  }, [currentQuestionId]);

  // Fire onSessionSubmitted when session transitions to submitted/expired
  useEffect(() => {
    if (session && (session.status === 'submitted' || session.status === 'expired')) {
      if (onSessionSubmitted) {
        onSessionSubmitted(session);
      }
    }
  }, [session?.status]);

  // Toggle assistance and record in engine
  const handleToggleAssistance = useCallback(() => {
    if (session?.mode !== 'practice') return;
    const nextState = !showAssistance;
    setShowAssistance(nextState);

    if (nextState && currentQuestionId) {
      recordHelp(currentQuestionId, 'script');
    }
  }, [session?.mode, showAssistance, currentQuestionId, recordHelp]);

  // Handle single choice selection
  const handleSelectChoice = useCallback(
    (key: StandardChoiceKey | Part2ChoiceKey) => {
      if (!currentQuestionId || isSubmitted) return;
      selectAnswer(currentQuestionId, key);
    },
    [currentQuestionId, isSubmitted, selectAnswer]
  );

  // Handle group choice selection
  const handleSelectGroupChoice = useCallback(
    (qid: string, key: StandardChoiceKey) => {
      if (isSubmitted) return;
      selectAnswer(qid, key);
    },
    [isSubmitted, selectAnswer]
  );

  // Keyboard accessibility listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in form field or modal is open
      if (isSubmitModalOpen || isExitConfirmOpen) return;
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') return;

      const key = e.key.toUpperCase();

      // Navigation: ArrowLeft / ArrowRight
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        previousQuestion();
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextQuestion();
        return;
      }

      // Mark for Review: M
      if (key === 'M') {
        e.preventDefault();
        if (currentQuestionId && !isSubmitted) {
          toggleMark(currentQuestionId);
        }
        return;
      }

      // Answer Options: A, B, C, D (or 1, 2, 3, 4)
      let choiceKey: StandardChoiceKey | null = null;
      if (key === 'A' || key === '1') choiceKey = 'A';
      else if (key === 'B' || key === '2') choiceKey = 'B';
      else if (key === 'C' || key === '3') choiceKey = 'C';
      else if (key === 'D' || key === '4') choiceKey = 'D';

      if (choiceKey) {
        // Part 2 only permits A, B, C
        if (session?.part === 2 && choiceKey === 'D') return;

        e.preventDefault();
        if (currentQuestionId && !isSubmitted) {
          selectAnswer(currentQuestionId, choiceKey);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isSubmitModalOpen,
    isExitConfirmOpen,
    currentQuestionId,
    isSubmitted,
    previousQuestion,
    nextQuestion,
    toggleMark,
    selectAnswer,
    session?.part,
  ]);

  if (!session || !currentQuestion) {
    return (
      <div
        className="w-full min-h-[500px] flex flex-col items-center justify-center p-6 text-center space-y-4"
        data-testid="workspace-empty-state"
      >
        <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-zinc-400 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h2 className="text-base font-bold text-zinc-100">Không tìm thấy phiên làm bài hợp lệ</h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm">
            Phiên làm bài có thể đã hoàn tất hoặc không tồn tại câu hỏi tương ứng trong ngân hàng đề.
          </p>
        </div>
        {onExit && (
          <button
            type="button"
            onClick={onExit}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200"
          >
            Quay lại Studio
          </button>
        )}
      </div>
    );
  }

  const currentAnswer = (session.answers[currentQuestionId] as StandardChoiceKey) || null;
  const isMarked = session.markedForReview[currentQuestionId] || false;
  const isLocked = isSubmitted || isExpired;

  return (
    <div
      className={`w-full min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-500/30 ${className}`}
      data-testid="listening-workspace"
    >
      {/* 1. Sticky Workspace Topbar Header */}
      <WorkspaceHeader
        partNum={session.part as 1 | 2 | 3 | 4}
        mode={session.mode}
        difficulty={session.difficulty}
        currentQuestionIndex={session.currentQuestionIndex}
        totalQuestions={totalQuestions}
        remainingSeconds={remainingSeconds}
        isMarked={isMarked}
        isSubmitted={isSubmitted}
        onToggleMark={() => toggleMark(currentQuestionId)}
        onSubmitClick={() => setIsSubmitModalOpen(true)}
        onExitClick={() => setIsExitConfirmOpen(true)}
        showAssistanceToggle={session.mode === 'practice' && !isSubmitted}
        isAssistanceActive={showAssistance}
        onToggleAssistance={handleToggleAssistance}
      />

      {/* 2. Completion / Submitted Banner Notification */}
      {isLocked && (
        <div className="w-full bg-emerald-950/80 border-b border-emerald-800/80 px-4 py-3 text-xs text-emerald-200 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                <strong>
                  {session.metadata.submitReason === 'auto_timeout'
                    ? 'Đã tự động nộp bài do hết giờ'
                    : 'Bài làm đã được nộp thành công'}
                </strong>{' '}
                • Toàn bộ câu trả lời đã được khóa an toàn.
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/60">
              Đã làm: {answeredCount}/{totalQuestions} câu
            </span>
          </div>
        </div>
      )}

      {/* 3. Main Workspace Body (Layout: Left Question Area + Right Navigator) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Central Question Testing Content (9 cols on large screen) */}
        <section className="lg:col-span-9 space-y-6">
          {session.part === 1 && (
            <Part1PhotographView
              question={currentQuestion as Part1Question}
              selectedAnswer={currentAnswer}
              onSelectAnswer={(key) => handleSelectChoice(key)}
              isLocked={isLocked}
              mode={session.mode}
              showAssistance={showAssistance}
            />
          )}

          {session.part === 2 && (
            <Part2QuestionResponseView
              question={currentQuestion as Part2Question}
              selectedAnswer={currentAnswer as Part2ChoiceKey}
              onSelectAnswer={(key) => handleSelectChoice(key)}
              isLocked={isLocked}
              mode={session.mode}
              showAssistance={showAssistance}
            />
          )}

          {session.part === 3 && currentGroup && (
            <Part3ConversationView
              group={currentGroup as Part3Group}
              questions={groupQuestions as Part3Question[]}
              activeQuestionId={currentQuestionId}
              answers={session.answers as Record<string, StandardChoiceKey | null>}
              onSelectAnswer={handleSelectGroupChoice}
              onSelectActiveQuestion={(qid) => {
                const idx = session.questionIds.indexOf(qid);
                if (idx !== -1) goToQuestion(idx);
              }}
              isLocked={isLocked}
              mode={session.mode}
              showAssistance={showAssistance}
            />
          )}

          {session.part === 4 && currentGroup && (
            <Part4TalkView
              group={currentGroup as Part4Group}
              questions={groupQuestions as Part4Question[]}
              activeQuestionId={currentQuestionId}
              answers={session.answers as Record<string, StandardChoiceKey | null>}
              onSelectAnswer={handleSelectGroupChoice}
              onSelectActiveQuestion={(qid) => {
                const idx = session.questionIds.indexOf(qid);
                if (idx !== -1) goToQuestion(idx);
              }}
              isLocked={isLocked}
              mode={session.mode}
              showAssistance={showAssistance}
            />
          )}

          {/* Bottom Bar: Previous / Next Controls */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <button
              type="button"
              onClick={previousQuestion}
              disabled={session.currentQuestionIndex === 0}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                session.currentQuestionIndex === 0
                  ? 'bg-zinc-900 border-zinc-850 text-zinc-600 cursor-not-allowed'
                  : 'bg-zinc-850 hover:bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white active:scale-95'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Câu Trước</span>
            </button>

            <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
              Dùng phím <kbd className="px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700">←</kbd> và{' '}
              <kbd className="px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700">→</kbd> để đổi câu
            </span>

            <button
              type="button"
              onClick={nextQuestion}
              disabled={session.currentQuestionIndex === totalQuestions - 1}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                session.currentQuestionIndex === totalQuestions - 1
                  ? 'bg-zinc-900 border-zinc-850 text-zinc-600 cursor-not-allowed'
                  : 'bg-zinc-850 hover:bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white active:scale-95'
              }`}
            >
              <span>Câu Tiếp</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Right Sidebar: Question Navigator (3 cols on large screen) */}
        <section className="lg:col-span-3 space-y-4">
          <QuestionNavigatorDrawer
            questionIds={session.questionIds}
            currentQuestionIndex={session.currentQuestionIndex}
            answers={session.answers}
            markedForReview={session.markedForReview}
            onSelectQuestion={(idx) => goToQuestion(idx)}
            partNum={session.part as 1 | 2 | 3 | 4}
          />
        </section>
      </main>

      {/* 4. Modals */}
      {/* Submit Confirmation Modal */}
      <SubmitConfirmationModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirmSubmit={() => {
          submit('user');
          setIsSubmitModalOpen(false);
        }}
        totalCount={totalQuestions}
        answeredCount={answeredCount}
        unansweredCount={unansweredCount}
        markedCount={markedCount}
        mode={session.mode}
      />

      {/* Exit Confirmation Dialog */}
      {isExitConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-100 shadow-xl">
            <h3 className="font-bold text-sm text-zinc-100">Xác Nhận Thoát Phiên</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {isLocked
                ? 'Bạn đã nộp bài. Bạn có muốn quay trở lại màn hình cấu hình?'
                : 'Bạn đang làm bài dở. Nếu thoát lúc này, phiên luyện tập sẽ được ghi nhận là Hủy bỏ (Abandoned).'}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsExitConfirmOpen(false)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 bg-zinc-800"
              >
                Ở Lại
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!isLocked) {
                    abandon();
                  }
                  setIsExitConfirmOpen(false);
                  onExit?.();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500"
              >
                Xác Nhận Thoát
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
