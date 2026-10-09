/**
 * TOEIC Mastery Hub — Exam Answer Review Component (Phase 17)
 *
 * Implements the 200-question interactive examination review & remediation surface:
 * - Reads strictly from frozen ExamResult.reviewItems snapshot
 * - Multi-criteria filters: Status (All, Correct, Wrong, Unanswered, Flagged) & Part (1–7)
 * - Rapid error navigation: Next/Prev wrong question buttons and 200-cell visual matrix
 * - Full context preservation: Part 1 SVG pictures, Part 3/4 graphics & dialogue transcripts,
 *   Part 6 split passages with 4 blanks, Part 7 multi-passages with document tabs
 * - Audio replay playback in practice mode via Web Speech API
 * - Invariant: Zero modification of submitted answers (strictly read-only)
 * - Revision mismatch & missing media fallback alert
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Filter,
  Volume2,
  VolumeX,
  FileText,
  AlertTriangle,
  Lightbulb,
  Image as ImageIcon,
  MessageSquare,
  Layers,
} from 'lucide-react';
import {
  ToeicPartNumber,
  StandardChoiceKey,
  Question,
  QuestionGroup,
  ReadingPassageItem,
} from '../../../types/questionBank';
import { ExamResult } from '../../../types/mockExam';
import {
  ExamReviewStatusFilter,
  ExamReviewPartFilter,
} from '../../../types/examReview';
import {
  filterReviewItems,
  findAdjacentWrongQuestion,
  checkExamFormCompatibility,
} from '../../../utils/examReviewAnalysis';
import { getExamFormById } from '../../../utils/examFormRegistry';
import { getQuestionById, getQuestionGroupById } from '../../../utils/questionBankLookup';
import { LISTENING_ILLUSTRATIONS } from '../../Diagnostic/listeningIllustrationsMap';

export interface ExamAnswerReviewProps {
  result: ExamResult;
  onBackToDashboard: () => void;
}

export const ExamAnswerReview: React.FC<ExamAnswerReviewProps> = ({
  result,
  onBackToDashboard,
}) => {
  // Current active question number in view (1 to 200)
  const [activeQNum, setActiveQNum] = useState<number>(1);

  // Filters
  const [statusFilter, setStatusFilter] = useState<ExamReviewStatusFilter>('all');
  const [partFilter, setPartFilter] = useState<ExamReviewPartFilter>('all');

  // Matrix drawer toggle on small screens
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);

  // Audio TTS playback state for review
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Look up registered ExamForm to evaluate compatibility
  const examForm = useMemo(
    () => getExamFormById(result.examFormId),
    [result.examFormId]
  );
  const compatibility = useMemo(
    () => checkExamFormCompatibility(examForm, result),
    [examForm, result]
  );

  // Filtered review items list
  const filteredItems = useMemo(
    () => filterReviewItems(result.reviewItems, statusFilter, partFilter),
    [result.reviewItems, statusFilter, partFilter]
  );

  // Active review item
  const activeItem = useMemo(() => {
    return (
      result.reviewItems.find((item) => item.globalQuestionNumber === activeQNum) ||
      result.reviewItems[0]
    );
  }, [result.reviewItems, activeQNum]);

  // Active question bank object (if available in current form/bank)
  const activeQuestionObj: Question | undefined = useMemo(() => {
    if (!activeItem) return undefined;
    return getQuestionById(activeItem.questionId);
  }, [activeItem]);

  // Active group data (for Part 3, 4, 6, 7)
  const activeGroupObj: QuestionGroup | undefined = useMemo(() => {
    if (!examForm || !activeItem) return undefined;
    const qRef = examForm.questions.find(
      (q) => q.globalQuestionNumber === activeItem.globalQuestionNumber
    );
    if (!qRef?.groupId) return undefined;
    return getQuestionGroupById(qRef.groupId);
  }, [examForm, activeItem]);

  // Extract choices map safely
  const choicesMap = useMemo((): Record<StandardChoiceKey, string> => {
    const map: Record<StandardChoiceKey, string> = {
      A: 'Phương án A',
      B: 'Phương án B',
      C: 'Phương án C',
      D: 'Phương án D',
    };
    if (activeQuestionObj && 'options' in activeQuestionObj && Array.isArray(activeQuestionObj.options)) {
      for (const opt of activeQuestionObj.options) {
        map[opt.key as StandardChoiceKey] = opt.text;
      }
    }
    return map;
  }, [activeQuestionObj]);

  // Spoken transcript text
  const spokenTranscript = useMemo((): string => {
    if (activeQuestionObj && 'media' in activeQuestionObj && activeQuestionObj.media?.transcript) {
      return activeQuestionObj.media.transcript;
    }
    if (activeQuestionObj && 'media' in activeQuestionObj && activeQuestionObj.media?.audio?.audioScript) {
      return activeQuestionObj.media.audio.audioScript;
    }
    if (activeGroupObj && 'media' in activeGroupObj && activeGroupObj.media?.transcript) {
      return activeGroupObj.media.transcript;
    }
    if (activeGroupObj && 'media' in activeGroupObj && activeGroupObj.media?.audio?.audioScript) {
      return activeGroupObj.media.audio.audioScript;
    }
    return 'Kịch bản nghe không khả dụng cho phiên bản đề này.';
  }, [activeQuestionObj, activeGroupObj]);

  // Audio text to speak
  const audioTextToSpeak = useMemo((): string => {
    if (activeQuestionObj && 'media' in activeQuestionObj && activeQuestionObj.media?.audio?.audioScript) {
      return activeQuestionObj.media.audio.audioScript;
    }
    if (activeQuestionObj && 'media' in activeQuestionObj && activeQuestionObj.media?.transcript) {
      return activeQuestionObj.media.transcript;
    }
    if (activeGroupObj && 'media' in activeGroupObj && activeGroupObj.media?.audio?.audioScript) {
      return activeGroupObj.media.audio.audioScript;
    }
    if (activeGroupObj && 'media' in activeGroupObj && activeGroupObj.media?.transcript) {
      return activeGroupObj.media.transcript;
    }
    return '';
  }, [activeQuestionObj, activeGroupObj]);

  // Audio TTS player for review mode
  const handlePlayReviewAudio = useCallback(() => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ tính năng đọc âm thanh Speech Synthesis.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if (!audioTextToSpeak) {
      alert('Không tìm thấy kịch bản âm thanh cho câu hỏi này.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(audioTextToSpeak);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  }, [audioTextToSpeak, isPlayingAudio]);

  // Fast Navigation to Next/Prev Wrong
  const handleJumpToWrong = (direction: 'prev' | 'next') => {
    const targetQNum = findAdjacentWrongQuestion(
      result.reviewItems,
      activeQNum,
      direction
    );
    if (targetQNum !== null) {
      setActiveQNum(targetQNum);
    }
  };

  const handlePrevQuestion = () => {
    if (activeQNum > 1) {
      setActiveQNum((prev) => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    if (activeQNum < 200) {
      setActiveQNum((prev) => prev + 1);
    }
  };

  // Part 1 SVG Illustration ID
  const part1IllustrationId = useMemo(() => {
    if (activeQuestionObj && activeQuestionObj.partNum === 1 && 'media' in activeQuestionObj) {
      return activeQuestionObj.media?.visual?.illustrationId;
    }
    return undefined;
  }, [activeQuestionObj]);

  // Part 3/4 Graphic ID
  const groupGraphicId = useMemo(() => {
    if (activeGroupObj && 'media' in activeGroupObj) {
      return activeGroupObj.media?.graphic?.illustrationId;
    }
    return undefined;
  }, [activeGroupObj]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in duration-300">
      {/* 1. Header & Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <button
            onClick={onBackToDashboard}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mb-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Trở về Bảng Tổng Kết Kết Quả
          </button>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Chữa Bài Chi Tiết 200 Câu</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Câu {activeQNum} / 200
            </span>
          </h1>
        </div>

        {/* Rapid Wrong Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleJumpToWrong('prev')}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Nhảy đến câu sai trước đó"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Câu Sai Trước</span>
          </button>
          <button
            onClick={() => handleJumpToWrong('next')}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Nhảy đến câu sai tiếp theo"
          >
            <span>Câu Sai Tiếp Theo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsMatrixOpen((prev) => !prev)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all lg:hidden cursor-pointer"
          >
            {isMatrixOpen ? 'Ẩn Ma Trận' : 'Hiện Ma Trận 200 Câu'}
          </button>
        </div>
      </div>

      {/* 2. Revision Mismatch / Missing Media Alert Banner */}
      {!compatibility.isCompatible && (
        <div className="p-4 rounded-2xl border border-amber-300 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Thông Báo Phiên Bản & Tài Nguyên</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {compatibility.warning}
            </p>
          </div>
        </div>
      )}

      {/* 3. Filter Bar (Status & Parts) */}
      <div className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
        {/* Status Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Trạng Thái:
          </span>
          {[
            { key: 'all', label: `Tất Cả (200)` },
            { key: 'correct', label: `Đúng (${result.totalRaw})` },
            { key: 'incorrect', label: `Sai (${result.totalIncorrect})` },
            { key: 'unanswered', label: `Chưa Làm (${result.totalUnanswered})` },
            { key: 'flagged', label: `Cắm Cờ (${result.flaggedCount})` },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setStatusFilter(item.key as ExamReviewStatusFilter)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                statusFilter === item.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Part Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mr-2">
            Phần Thi:
          </span>
          <button
            onClick={() => setPartFilter('all')}
            className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
              partFilter === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Tất Cả
          </button>
          {[1, 2, 3, 4, 5, 6, 7].map((p) => {
            const partStat = result.byPart[p as ToeicPartNumber];
            return (
              <button
                key={p}
                onClick={() => setPartFilter(p as ExamReviewPartFilter)}
                className={`px-2.5 py-1 rounded-xl font-semibold transition-all cursor-pointer ${
                  partFilter === p
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Part {p} ({partStat?.correctCount ?? 0}/{partStat?.totalQuestions ?? 0})
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Full Question Review Card (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
            {/* Question Header Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                  Câu {activeItem.globalQuestionNumber}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Part {activeItem.partNum} ({activeItem.section})
                </span>
                {activeItem.skillTag && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                    {activeItem.skillTag.replace(/_/g, ' ')}
                  </span>
                )}
                {activeItem.isFlagged && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                    <Bookmark className="w-3 h-3" /> Cắm Cờ
                  </span>
                )}
              </div>

              {/* Status Badge */}
              <div>
                {activeItem.isCorrect ? (
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> TRẢ LỜI ĐÚNG
                  </span>
                ) : activeItem.isUnanswered ? (
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" /> CHƯA LÀM (BỎ TRỐNG)
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> TRẢ LỜI SAI
                  </span>
                )}
              </div>
            </div>

            {/* Listening Part 1 Vector Illustration */}
            {activeItem.partNum === 1 && part1IllustrationId && (
              <div className="flex justify-center p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                {(() => {
                  const IllustrationComponent = LISTENING_ILLUSTRATIONS[part1IllustrationId];
                  return IllustrationComponent ? (
                    <div className="max-w-sm w-full">
                      <IllustrationComponent />
                    </div>
                  ) : (
                    <div className="p-8 text-slate-400 text-xs flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" /> Tranh minh họa SVG
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Listening Part 3 / 4 Graphic or Context */}
            {(activeItem.partNum === 3 || activeItem.partNum === 4) && groupGraphicId && (
              <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <ImageIcon className="w-4 h-4 text-indigo-500" />
                  <span>Đồ Họa Ngữ Cảnh Đính Kèm:</span>
                </div>
                {(() => {
                  const IllustrationComponent = LISTENING_ILLUSTRATIONS[groupGraphicId];
                  return IllustrationComponent ? (
                    <div className="max-w-md mx-auto">
                      <IllustrationComponent />
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            {/* Listening Spoken Transcript & Audio Player Button */}
            {activeItem.section === 'listening' && (
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-amber-600" />
                    Kịch Bản Lời Thoại (Spoken Transcript):
                  </span>
                  <button
                    onClick={handlePlayReviewAudio}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isPlayingAudio
                        ? 'bg-rose-600 text-white'
                        : 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm'
                    }`}
                  >
                    {isPlayingAudio ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" /> Dừng Phát
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" /> Nghe Lại TTS
                      </>
                    )}
                  </button>
                </div>
                <div className="text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap bg-white dark:bg-slate-900 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
                  {spokenTranscript}
                </div>
              </div>
            )}

            {/* Reading Part 6 Corporate Text or Part 7 Passages */}
            {activeItem.partNum === 6 && activeGroupObj && 'passageContent' in activeGroupObj && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Đoạn Văn Công Sở Part 6:
                </span>
                <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  {activeGroupObj.passageContent}
                </div>
              </div>
            )}

            {activeItem.partNum === 7 && activeGroupObj && 'passages' in activeGroupObj && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  Văn Bản Đọc Hiểu Part 7:
                </span>
                <div className="space-y-2.5">
                  {(activeGroupObj.passages as ReadingPassageItem[]).map((p, idx) => (
                    <div
                      key={p.id || idx}
                      className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5"
                    >
                      <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                        Văn Bản {idx + 1}: {p.formatType ? p.formatType.toUpperCase() : 'DOCUMENT'} {p.title ? `— ${p.title}` : ''}
                      </span>
                      <p className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {p.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Question Prompt */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Nội Dung Đề Bài:
              </span>
              <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
                {activeItem.partNum === 2 && activeQuestionObj && 'promptScript' in activeQuestionObj
                  ? activeQuestionObj.promptScript
                  : activeQuestionObj && 'question' in activeQuestionObj
                  ? activeQuestionObj.question
                  : `Câu hỏi ${activeItem.globalQuestionNumber}`}
              </p>
            </div>

            {/* Choices List with Immutable Status */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Phương Án Trả Lời & Lựa Chọn Của Thí Sinh:
              </span>
              {(() => {
                const choiceKeys: StandardChoiceKey[] =
                  activeItem.partNum === 2 ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D'];

                return (
                  <div className="space-y-2">
                    {choiceKeys.map((key) => {
                      const text = choicesMap[key] || `Lựa chọn ${key}`;
                      const isUserChoice = activeItem.userChoice === key;
                      const isCorrectChoice = activeItem.correctChoice === key;

                      let rowStyle =
                        'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300';
                      if (isCorrectChoice) {
                        rowStyle =
                          'border-emerald-400 dark:border-emerald-700 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-semibold';
                      } else if (isUserChoice && !isCorrectChoice) {
                        rowStyle =
                          'border-rose-400 dark:border-rose-800 bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100';
                      }

                      return (
                        <div
                          key={key}
                          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${rowStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 font-mono ${
                                isCorrectChoice
                                  ? 'bg-emerald-600 text-white'
                                  : isUserChoice
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {key}
                            </span>
                            <span className="leading-relaxed">{text}</span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isUserChoice && (
                              <span
                                className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md ${
                                  isCorrectChoice
                                    ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                                    : 'bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                                }`}
                              >
                                Bạn Đã Chọn
                              </span>
                            )}
                            {isCorrectChoice && (
                              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-600 text-white flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Đáp Án Đúng
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Detailed Vietnamese Explanation & Trap Analysis */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-950 dark:text-indigo-200">
                <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Giải Thích Chi Tiết & Phân Tích Bẫy ETS:</span>
              </div>
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {activeItem.explanation ||
                  (activeQuestionObj && 'explanation' in activeQuestionObj
                    ? activeQuestionObj.explanation
                    : 'Chưa có lời giải chi tiết cho câu hỏi này.')}
              </p>

              {activeItem.trapType && (
                <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-900/40 flex items-center gap-2 text-xs">
                  <span className="font-bold text-amber-800 dark:text-amber-300">
                    Bẫy nhận diện:
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-[11px] font-semibold">
                    {activeItem.trapType}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Question Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold">
              <button
                disabled={activeQNum <= 1}
                onClick={handlePrevQuestion}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Câu Trước ({activeQNum - 1})</span>
              </button>

              <span className="text-slate-500 font-mono">
                {activeQNum} / 200
              </span>

              <button
                disabled={activeQNum >= 200}
                onClick={handleNextQuestion}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Câu Tiếp ({activeQNum + 1})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: 200-Cell Interactive Matrix (4 cols on lg, or toggle on mobile) */}
        <div
          className={`lg:col-span-4 space-y-4 ${
            isMatrixOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Ma Trận 200 Câu Hỏi
              </h3>
              <span className="text-xs text-slate-500 font-mono font-medium">
                Khớp {filteredItems.length} câu
              </span>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Đúng ({result.totalRaw})
              </span>
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Sai ({result.totalIncorrect})
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Trống ({result.totalUnanswered})
              </span>
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Cờ ({result.flaggedCount})
              </span>
            </div>

            {/* 200 Cells Grid */}
            <div className="max-h-[540px] overflow-y-auto pr-1">
              <div className="grid grid-cols-5 gap-1.5">
                {result.reviewItems.map((item) => {
                  const isActive = item.globalQuestionNumber === activeQNum;
                  const isVisibleInFilter = filteredItems.some(
                    (fi) => fi.globalQuestionNumber === item.globalQuestionNumber
                  );

                  let cellBg = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
                  if (item.isCorrect) {
                    cellBg = 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
                  } else if (item.isUnanswered) {
                    cellBg = 'bg-slate-100 text-slate-500 dark:bg-slate-850 dark:text-slate-500 border-slate-300 dark:border-slate-700';
                  } else {
                    cellBg = 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800';
                  }

                  return (
                    <button
                      key={item.globalQuestionNumber}
                      onClick={() => setActiveQNum(item.globalQuestionNumber)}
                      className={`h-9 rounded-xl text-xs font-mono font-bold border transition-all relative flex items-center justify-center cursor-pointer ${cellBg} ${
                        isActive
                          ? 'ring-2 ring-indigo-500 shadow-md scale-105 z-10 font-black'
                          : ''
                      } ${!isVisibleInFilter ? 'opacity-25' : 'hover:scale-105'}`}
                      title={`Câu ${item.globalQuestionNumber} (Part ${item.partNum}): ${
                        item.isCorrect ? 'Đúng' : item.isUnanswered ? 'Chưa làm' : 'Sai'
                      }`}
                    >
                      <span>{item.globalQuestionNumber}</span>
                      {item.isFlagged && (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
