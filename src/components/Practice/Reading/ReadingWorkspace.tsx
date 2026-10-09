/**
 * TOEIC Mastery Hub — Reading Practice Workspace (Phase 8)
 *
 * Master coordinator component managing Reading practice sessions:
 * - Part 5: Incomplete Sentences (single questions, blank formatting)
 * - Part 6: Text Completion (passage with interactive blanks [131]..[134], sentence insertion)
 * - Part 7: Reading Comprehension (single, double, triple passages, multi-text synthesis)
 *
 * Integrated features:
 * - Reuses usePracticeSession (Phase 5) state machine & real wall-clock countdown
 * - Reuses WorkspaceHeader, QuestionNavigatorDrawer, SubmitConfirmationModal
 * - Keyboard shortcuts (A, B, C, D, M, ArrowLeft, ArrowRight)
 * - Mode rules: Practice mode (toggleable explanations, recordHelp), Timed mode (strict concealment)
 * - Answer locking and double-submit protection
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { PracticeSessionData } from '../../../types/practiceSession';
import {
  Part5Question,
  Part6Group,
  Part6Question,
  Part7Group,
  Part7Question,
  StandardChoiceKey,
} from '../../../types/questionBank';
import { usePracticeSession } from '../../../hooks/usePracticeSession';
import {
  getQuestionById,
  getQuestionGroupById,
  getQuestionsForGroup,
} from '../../../utils/questionBankLookup';
import { WorkspaceHeader } from '../Listening/WorkspaceHeader';
import { QuestionNavigatorDrawer } from '../Listening/QuestionNavigatorDrawer';
import { SubmitConfirmationModal } from '../Listening/SubmitConfirmationModal';
import { Part5IncompleteSentencesView } from './Part5IncompleteSentencesView';
import { Part6TextCompletionView } from './Part6TextCompletionView';
import { Part7ReadingComprehensionView } from './Part7ReadingComprehensionView';

export interface ReadingWorkspaceProps {
  initialSession?: PracticeSessionData;
  onExit?: () => void;
  onSessionSubmitted?: (session: PracticeSessionData) => void;
  className?: string;
}

export const ReadingWorkspace: React.FC<ReadingWorkspaceProps> = ({
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
    prevQuestion,
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

  // Derived parent group for Part 6/7
  const currentGroup = useMemo(() => {
    if (!currentQuestion?.groupId) return undefined;
    return getQuestionGroupById(currentQuestion.groupId);
  }, [currentQuestion?.groupId]);

  // Derived group questions for Part 6/7
  const groupQuestions = useMemo(() => {
    if (!currentQuestion?.groupId) return [];
    return getQuestionsForGroup(currentQuestion.groupId);
  }, [currentQuestion?.groupId]);

  // Reset assistance drawer when navigating to another question
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

  // Toggle assistance and record in engine (Practice mode only)
  const handleToggleAssistance = useCallback(() => {
    if (session?.mode !== 'practice') return;
    const nextState = !showAssistance;
    setShowAssistance(nextState);

    if (nextState && currentQuestionId) {
      recordHelp(currentQuestionId, 'explanation');
    }
  }, [session?.mode, showAssistance, currentQuestionId, recordHelp]);

  // Handle single choice selection (Part 5)
  const handleSelectChoice = useCallback(
    (key: StandardChoiceKey) => {
      if (!currentQuestionId || isSubmitted) return;
      selectAnswer(currentQuestionId, key);
    },
    [currentQuestionId, isSubmitted, selectAnswer]
  );

  // Handle group choice selection (Part 6/7)
  const handleSelectGroupChoice = useCallback(
    (qId: string, key: StandardChoiceKey) => {
      if (!qId || isSubmitted) return;
      selectAnswer(qId, key);
    },
    [isSubmitted, selectAnswer]
  );

  // Navigate directly to question by question ID
  const handleNavigateToQuestionId = useCallback(
    (qId: string) => {
      if (!session) return;
      const idx = session.questionIds.indexOf(qId);
      if (idx !== -1) {
        goToQuestion(idx);
      }
    },
    [session, goToQuestion]
  );

  // Group boundary navigation (Part 6/7)
  const handlePrevGroup = useCallback(() => {
    if (!session || !currentQuestion?.groupId) return;
    // Find the first question of previous group
    const currentGroupIdx = session.groupIds.indexOf(currentQuestion.groupId);
    if (currentGroupIdx > 0) {
      const prevGroupId = session.groupIds[currentGroupIdx - 1];
      const prevGroupQuestions = getQuestionsForGroup(prevGroupId);
      if (prevGroupQuestions.length > 0) {
        handleNavigateToQuestionId(prevGroupQuestions[0].id);
      }
    }
  }, [session, currentQuestion?.groupId, handleNavigateToQuestionId]);

  const handleNextGroup = useCallback(() => {
    if (!session || !currentQuestion?.groupId) return;
    const currentGroupIdx = session.groupIds.indexOf(currentQuestion.groupId);
    if (currentGroupIdx !== -1 && currentGroupIdx < session.groupIds.length - 1) {
      const nextGroupId = session.groupIds[currentGroupIdx + 1];
      const nextGroupQuestions = getQuestionsForGroup(nextGroupId);
      if (nextGroupQuestions.length > 0) {
        handleNavigateToQuestionId(nextGroupQuestions[0].id);
      }
    }
  }, [session, currentQuestion?.groupId, handleNavigateToQuestionId]);

  // Keyboard shortcut listener (A, B, C, D, M, Arrows)
  useEffect(() => {
    if (isSubmitted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      const key = e.key.toUpperCase();

      if (['A', 'B', 'C', 'D'].includes(key)) {
        e.preventDefault();
        if (currentQuestionId) {
          selectAnswer(currentQuestionId, key as StandardChoiceKey);
        }
      } else if (key === 'M') {
        e.preventDefault();
        if (currentQuestionId) {
          toggleMark(currentQuestionId);
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextQuestion();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionId, isSubmitted, selectAnswer, toggleMark, nextQuestion, prevQuestion]);

  // Loading / Empty state safeguard
  if (!session || !currentQuestion) {
    return (
      <div
        className="w-full min-h-[500px] flex flex-col items-center justify-center p-6 bg-zinc-950 text-zinc-300 space-y-4"
        data-testid="reading-workspace-empty"
      >
        <AlertTriangle className="w-10 h-10 text-amber-500 animate-bounce" />
        <h2 className="text-lg font-bold text-zinc-100">Không tìm thấy phiên luyện tập Reading</h2>
        <p className="text-xs text-zinc-400 max-w-md text-center leading-relaxed">
          Phiên làm bài có thể đã hết hạn hoặc dữ liệu câu hỏi chưa được nạp. Vui lòng quay lại màn
          hình cấu hình để bắt đầu bài luyện tập mới.
        </p>
        {onExit && (
          <button
            type="button"
            onClick={onExit}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-xl border border-zinc-700 transition-all"
          >
            Quay lại Practice Hub
          </button>
        )}
      </div>
    );
  }

  const isLocked = isSubmitted || isExpired;
  const isFirstQ = session.currentQuestionIndex === 0;
  const isLastQ = session.currentQuestionIndex === session.questionIds.length - 1;

  // Group position calculations
  const currentGroupIndex = session.groupIds ? session.groupIds.indexOf(currentQuestion.groupId || '') : -1;
  const isFirstGrp = currentGroupIndex <= 0;
  const isLastGrp = currentGroupIndex === (session.groupIds ? session.groupIds.length - 1 : 0);

  return (
    <div
      className={`min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-blue-600 selection:text-white ${className}`}
      data-testid="reading-workspace"
    >
      {/* 1. Universal Workspace Header */}
      <WorkspaceHeader
        partNum={session.part as 1 | 2 | 3 | 4 | 5 | 6 | 7}
        mode={session.mode}
        difficulty={session.difficulty}
        currentQuestionIndex={session.currentQuestionIndex}
        totalQuestions={totalQuestions}
        remainingSeconds={remainingSeconds}
        isMarked={!!session.markedForReview[currentQuestionId]}
        isSubmitted={isLocked}
        onToggleMark={() => toggleMark(currentQuestionId)}
        onSubmitClick={() => setIsSubmitModalOpen(true)}
        onExitClick={() => setIsExitConfirmOpen(true)}
        showAssistanceToggle={session.mode === 'practice' && !isSubmitted}
        isAssistanceActive={showAssistance}
        onToggleAssistance={handleToggleAssistance}
      />

      {/* 2. Completion / Submitted Status Banner */}
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
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Core Question Render Area */}
        <section className="lg:col-span-8 xl:col-span-9 space-y-6">
          {session.part === 5 && (
            <Part5IncompleteSentencesView
              question={currentQuestion as Part5Question}
              selectedChoice={session.answers[currentQuestionId] as StandardChoiceKey | null}
              onSelectChoice={handleSelectChoice}
              isLocked={isLocked}
              showAssistance={showAssistance}
              onPrevQuestion={prevQuestion}
              onNextQuestion={nextQuestion}
              isFirstQuestion={isFirstQ}
              isLastQuestion={isLastQ}
            />
          )}

          {session.part === 6 && currentGroup && (
            <Part6TextCompletionView
              group={currentGroup as Part6Group}
              questions={groupQuestions as Part6Question[]}
              activeQuestionId={currentQuestionId}
              answers={session.answers as Record<string, StandardChoiceKey | null>}
              onSelectChoice={handleSelectGroupChoice}
              onNavigateToQuestionId={handleNavigateToQuestionId}
              isLocked={isLocked}
              showAssistance={showAssistance}
              onPrevGroup={handlePrevGroup}
              onNextGroup={handleNextGroup}
              isFirstGroup={isFirstGrp}
              isLastGroup={isLastGrp}
            />
          )}

          {session.part === 7 && currentGroup && (
            <Part7ReadingComprehensionView
              group={currentGroup as Part7Group}
              questions={groupQuestions as Part7Question[]}
              activeQuestionId={currentQuestionId}
              answers={session.answers as Record<string, StandardChoiceKey | null>}
              onSelectChoice={handleSelectGroupChoice}
              onNavigateToQuestionId={handleNavigateToQuestionId}
              isLocked={isLocked}
              showAssistance={showAssistance}
              onPrevGroup={handlePrevGroup}
              onNextGroup={handleNextGroup}
              isFirstGroup={isFirstGrp}
              isLastGroup={isLastGrp}
            />
          )}
        </section>

        {/* Right Navigator Matrix Drawer */}
        <section className="lg:col-span-4 xl:col-span-3 sticky top-4">
          <QuestionNavigatorDrawer
            questionIds={session.questionIds}
            currentQuestionIndex={session.currentQuestionIndex}
            answers={session.answers}
            markedForReview={session.markedForReview}
            onSelectQuestion={(idx) => goToQuestion(idx)}
            partNum={session.part as 1 | 2 | 3 | 4 | 5 | 6 | 7}
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
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all"
              >
                Tiếp tục làm
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!isLocked) {
                    abandon();
                  }
                  setIsExitConfirmOpen(false);
                  if (onExit) onExit();
                }}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-sm"
              >
                Xác nhận thoát
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
