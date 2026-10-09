/**
 * TOEIC Mastery Hub — Exam Review & History Analytics Engine (Phase 17)
 *
 * Pure utility functions for:
 * - Strengths, weaknesses, and trap analysis from itemized exam results
 * - Multi-attempt retake delta calculations with test-retest practice effect advisories
 * - Question filtering and rapid navigation through mistakes
 * - ExamForm revision compatibility checks and missing media guardrails
 */

import { ToeicPartNumber } from '../types/questionBank';
import {
  ExamResult,
  ExamReviewItem,
  ExamHistoryEntry,
  ExamForm,
} from '../types/mockExam';
import {
  ExamReviewStatusFilter,
  ExamReviewPartFilter,
  ExamStrengthWeaknessAnalysis,
  ExamTopicPerformance,
  ExamAttemptComparison,
  ExamPartPerformanceCategory,
} from '../types/examReview';

export const CAUTIOUS_TEST_RETEST_ADVISORY =
  'Lưu ý đánh giá tiến bộ khi thi lại cùng một mã đề: Điểm số có thể tăng do hiệu ứng ghi nhớ đề bài/đáp án trước đó (Test-Retest Practice Effect). Hãy làm thêm các mã đề thi khác để đánh giá năng lực thực tế khách quan nhất.';

/**
 * Analyzes Part 1-7 performance, strengths, weaknesses, and topics needing improvement.
 */
export function analyzeExamStrengthsAndWeaknesses(
  result: ExamResult
): ExamStrengthWeaknessAnalysis {
  const strengths: ExamPartPerformanceCategory[] = [];
  const moderate: ExamPartPerformanceCategory[] = [];
  const weaknesses: ExamPartPerformanceCategory[] = [];

  const partNumbers: ToeicPartNumber[] = [1, 2, 3, 4, 5, 6, 7];

  for (const pNum of partNumbers) {
    const partStat = result.byPart[pNum];
    if (!partStat) continue;

    const cat: ExamPartPerformanceCategory = {
      partNum: pNum,
      partName: partStat.partName,
      section: partStat.section,
      accuracyRate: partStat.accuracyRate,
      correctCount: partStat.correctCount,
      totalQuestions: partStat.totalQuestions,
      detail: `${partStat.correctCount}/${partStat.totalQuestions} câu đúng (${partStat.accuracyRate}%)`,
    };

    if (partStat.accuracyRate >= 75) {
      strengths.push(cat);
    } else if (partStat.accuracyRate >= 50) {
      moderate.push(cat);
    } else {
      weaknesses.push(cat);
    }
  }

  // Aggregate topics to improve from reviewItems
  const topicMap = new Map<string, { total: number; correct: number; partNum: ToeicPartNumber }>();
  const trapMap = new Map<string, number>();

  for (const item of result.reviewItems || []) {
    const topicKey = item.skillTag || item.questionType;
    if (topicKey) {
      const existing = topicMap.get(topicKey) || {
        total: 0,
        correct: 0,
        partNum: item.partNum,
      };
      existing.total += 1;
      if (item.isCorrect) existing.correct += 1;
      topicMap.set(topicKey, existing);
    }

    if (!item.isCorrect && item.trapType) {
      trapMap.set(item.trapType, (trapMap.get(item.trapType) || 0) + 1);
    }
  }

  const topicsToImprove: ExamTopicPerformance[] = Array.from(topicMap.entries())
    .map(([topic, data]) => ({
      topic,
      partNum: data.partNum,
      totalQuestions: data.total,
      correctCount: data.correct,
      incorrectCount: data.total - data.correct,
      accuracyRate: Number(((data.correct / data.total) * 100).toFixed(1)),
    }))
    .filter((t) => t.incorrectCount > 0)
    .sort((a, b) => b.incorrectCount - a.incorrectCount || a.accuracyRate - b.accuracyRate);

  const trapTypesEncountered = Array.from(trapMap.entries())
    .map(([trapType, missCount]) => ({ trapType, missCount }))
    .sort((a, b) => b.missCount - a.missCount);

  return {
    strengths,
    moderate,
    weaknesses,
    topicsToImprove,
    trapTypesEncountered,
  };
}

/**
 * Compares two exam attempts on the same ExamForm and attaches the cautious test-retest note.
 */
export function compareExamAttempts(
  current: ExamHistoryEntry,
  previous: ExamHistoryEntry,
  attemptIndex = 2,
  previousAttemptIndex = 1
): ExamAttemptComparison {
  const deltaTotalRaw = current.totalRaw - previous.totalRaw;
  const deltaListeningRaw = current.listeningRaw - previous.listeningRaw;
  const deltaReadingRaw = current.readingRaw - previous.readingRaw;
  const deltaTotalScaled = current.totalScore - previous.totalScore;
  const deltaAccuracy = Number(
    (current.accuracyPercentage - previous.accuracyPercentage).toFixed(1)
  );
  const deltaDurationMinutes = Number(
    ((current.totalTimeSeconds - previous.totalTimeSeconds) / 60).toFixed(1)
  );

  return {
    currentSessionId: current.sessionId,
    previousSessionId: previous.sessionId,
    attemptIndex,
    previousAttemptIndex,
    currentDate: current.date,
    previousDate: previous.date,
    currentMode: current.mode,
    previousMode: previous.mode,
    deltaTotalRaw,
    deltaListeningRaw,
    deltaReadingRaw,
    deltaTotalScaled,
    deltaAccuracy,
    deltaDurationMinutes,
    cautiousAdvisoryNote: CAUTIOUS_TEST_RETEST_ADVISORY,
  };
}

/**
 * Pure filter function for the 200 review items by status and Part number.
 */
export function filterReviewItems(
  items: ExamReviewItem[],
  statusFilter: ExamReviewStatusFilter,
  partFilter: ExamReviewPartFilter
): ExamReviewItem[] {
  return items.filter((item) => {
    // 1. Part Filter
    if (partFilter !== 'all' && item.partNum !== partFilter) {
      return false;
    }

    // 2. Status Filter
    switch (statusFilter) {
      case 'correct':
        return item.isCorrect;
      case 'incorrect':
        return !item.isCorrect && !item.isUnanswered;
      case 'unanswered':
        return item.isUnanswered;
      case 'flagged':
        return item.isFlagged;
      case 'all':
      default:
        return true;
    }
  });
}

/**
 * Rapid navigation: locates the next or previous wrong question.
 */
export function findAdjacentWrongQuestion(
  items: ExamReviewItem[],
  currentQNum: number,
  direction: 'prev' | 'next'
): number | null {
  const wrongQuestions = items
    .filter((item) => !item.isCorrect && !item.isUnanswered)
    .map((item) => item.globalQuestionNumber)
    .sort((a, b) => a - b);

  if (wrongQuestions.length === 0) return null;

  if (direction === 'next') {
    const nextQ = wrongQuestions.find((q) => q > currentQNum);
    return nextQ ?? wrongQuestions[0]; // Wrap around to first wrong
  } else {
    const prevList = wrongQuestions.filter((q) => q < currentQNum);
    if (prevList.length > 0) {
      return prevList[prevList.length - 1];
    }
    return wrongQuestions[wrongQuestions.length - 1]; // Wrap around to last wrong
  }
}

/**
 * Checks if the stored ExamResult matches the current ExamForm in the registry.
 */
export function checkExamFormCompatibility(
  form: ExamForm | undefined,
  result: ExamResult
): { isCompatible: boolean; warning?: string } {
  if (!form) {
    return {
      isCompatible: false,
      warning: `Đề thi "${result.examFormId}" không còn tồn tại trong kho lưu trữ đề thi hiện tại. Hệ thống đang hiển thị nội dung kiểm tra dựa trên bản ghi đóng băng (Frozen Snapshot).`,
    };
  }

  if (form.contentRevision !== result.contentRevision) {
    return {
      isCompatible: false,
      warning: `Bài thi được làm trên Phiên bản đề [Revision ${result.contentRevision}], trong khi phiên bản hiện tại trong hệ thống là [Revision ${form.contentRevision}]. Một số đoạn văn hoặc tài nguyên âm thanh có thể đã được cập nhật; hệ thống ưu tiên nội dung snapshot đã chốt.`,
    };
  }

  return { isCompatible: true };
}
