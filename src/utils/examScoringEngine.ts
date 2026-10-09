/**
 * TOEIC Mastery Hub — Full Mock Exam Scoring Engine (Phase 16)
 *
 * Implements pure, deterministic scoring and result aggregation for 200-question Full Mock Exams:
 * - Raw score calculations:
 *   * Listening correct (0–100), Reading correct (0–100), Total correct (0–200).
 *   * Distinct wrong (incorrect) and unanswered counts.
 *   * Mathematical invariant: correct + incorrect + unanswered strictly equals 200.
 *   * No negative marking (zero penalty for wrong answers).
 *   * No auto-filling of blanks (unanswered items remain null).
 * - Part 1–7 breakdowns:
 *   * Part 1 (6), Part 2 (25), Part 3 (39), Part 4 (30).
 *   * Part 5 (30), Part 6 (16), Part 7 (54).
 *   * Per-part accuracy percentages and time spent.
 * - Estimated Scaled Score (ETS 10–990):
 *   * Converts raw scores using official empirical equating curves (convertListeningScore, convertReadingScore).
 *   * Prominently labeled as estimated reference with clear methodology and disclaimer.
 *   * Zero overwrite of official scores in AppContext / user profile.
 * - Strict integrity & media interruption audit:
 *   * Disqualifies strict validity if media playback was interrupted, abnormal, or tampered.
 * - Generates lightweight ExamHistoryEntry without duplicating question content.
 */

import {
  ExamSession,
  ExamForm,
  ExamResult,
  ExamHistoryEntry,
  ExamPartStat,
  ExamReviewItem,
  ExamResultIntegritySummary,
  ExamScaledScoreEstimate,
} from '../types/mockExam';
import { ToeicPartNumber, ToeicSection, Question } from '../types/questionBank';
import {
  convertListeningScore,
  convertReadingScore,
  getScoreLevelBand,
} from './scoreConverter';
import { getQuestionById } from './questionBankLookup';

export const EXAM_SCORING_SCHEMA_VERSION = '1.0.0';

export interface ScoreExamSessionOptions {
  lookupQuestion?: (id: string) => Question | undefined;
  now?: number;
}

/**
 * Expected blueprint question counts for all 7 TOEIC parts.
 */
export const PART_QUESTION_COUNTS: Record<ToeicPartNumber, number> = {
  1: 6,
  2: 25,
  3: 39,
  4: 30,
  5: 30,
  6: 16,
  7: 54,
};

export const PART_NAMES: Record<ToeicPartNumber, string> = {
  1: 'Part 1: Photographs',
  2: 'Part 2: Question-Response',
  3: 'Part 3: Conversations',
  4: 'Part 4: Short Talks',
  5: 'Part 5: Incomplete Sentences',
  6: 'Part 6: Text Completion',
  7: 'Part 7: Reading Comprehension',
};

/**
 * Pure scoring function: evaluates a finalized or in-submission ExamSession against
 * the canonical ExamForm and generates a comprehensive ExamResult.
 */
export function scoreExamSession(
  session: ExamSession,
  examForm: ExamForm,
  options?: ScoreExamSessionOptions
): ExamResult {
  const now = options?.now ?? (session.submittedAt || Date.now());
  const lookup = options?.lookupQuestion ?? getQuestionById;

  // Initialize part statistics accumulators
  const partStatsAccumulator: Record<
    ToeicPartNumber,
    {
      correctCount: number;
      incorrectCount: number;
      unansweredCount: number;
      timeSpentSeconds: number;
    }
  > = {
    1: { correctCount: 0, incorrectCount: 0, unansweredCount: 0, timeSpentSeconds: 0 },
    2: { correctCount: 0, incorrectCount: 0, unansweredCount: 0, timeSpentSeconds: 0 },
    3: { correctCount: 0, incorrectCount: 0, unansweredCount: 0, timeSpentSeconds: 0 },
    4: { correctCount: 0, incorrectCount: 0, unansweredCount: 0, timeSpentSeconds: 0 },
    5: { correctCount: 0, incorrectCount: 0, unansweredCount: 0, timeSpentSeconds: 0 },
    6: { correctCount: 0, incorrectCount: 0, unansweredCount: 0, timeSpentSeconds: 0 },
    7: { correctCount: 0, incorrectCount: 0, unansweredCount: 0, timeSpentSeconds: 0 },
  };

  const reviewItems: ExamReviewItem[] = [];
  const flaggedQuestions: number[] = [];

  // Evaluate all 200 questions sequentially
  for (const qRef of examForm.questions) {
    const qNum = qRef.globalQuestionNumber;
    const partNum = qRef.partNum;
    const section = qRef.section;
    const qData = lookup(qRef.questionId);

    const userAns = session.answers[qNum];
    const userChoice = userAns?.selectedChoice ?? null;
    const isFlagged = Boolean(session.flaggedQuestions[qNum]);
    if (isFlagged) {
      flaggedQuestions.push(qNum);
    }

    const timeSpent = userAns?.timeSpentSeconds ?? 0;
    const correctChoice = qData?.correctKey ?? 'A'; // Fallback to 'A' if orphaned reference

    const isUnanswered = userChoice === null;
    const isCorrect = !isUnanswered && userChoice === correctChoice;
    const isIncorrect = !isUnanswered && userChoice !== correctChoice;

    // Accumulate part counters
    const partAcc = partStatsAccumulator[partNum];
    if (isCorrect) {
      partAcc.correctCount += 1;
    } else if (isIncorrect) {
      partAcc.incorrectCount += 1;
    } else {
      partAcc.unansweredCount += 1;
    }
    partAcc.timeSpentSeconds += timeSpent;

    // Build review item
    const reviewItem: ExamReviewItem = {
      globalQuestionNumber: qNum,
      questionId: qRef.questionId,
      partNum,
      section,
      userChoice,
      correctChoice,
      isCorrect,
      isUnanswered,
      isFlagged,
      explanation: qData?.explanation,
      skillTag: qData?.skillTag,
      trapType: qData?.trapType,
      questionType: (qData as { questionType?: string })?.questionType,
      timeSpentSeconds: timeSpent,
    };
    reviewItems.push(reviewItem);
  }

  // Synthesize Part Stats
  const byPart: Record<ToeicPartNumber, ExamPartStat> = {} as Record<
    ToeicPartNumber,
    ExamPartStat
  >;

  for (let p = 1; p <= 7; p++) {
    const partNum = p as ToeicPartNumber;
    const acc = partStatsAccumulator[partNum];
    const totalQ = PART_QUESTION_COUNTS[partNum];
    const section: ToeicSection = partNum <= 4 ? 'listening' : 'reading';

    const accuracyRate =
      totalQ > 0 ? Math.round((acc.correctCount / totalQ) * 1000) / 10 : 0;

    byPart[partNum] = {
      partNum,
      partName: PART_NAMES[partNum],
      section,
      totalQuestions: totalQ,
      correctCount: acc.correctCount,
      incorrectCount: acc.incorrectCount,
      unansweredCount: acc.unansweredCount,
      accuracyRate,
      timeSpentSeconds: acc.timeSpentSeconds,
    };
  }

  // Section Totals
  const listeningRaw =
    byPart[1].correctCount +
    byPart[2].correctCount +
    byPart[3].correctCount +
    byPart[4].correctCount;
  const listeningIncorrect =
    byPart[1].incorrectCount +
    byPart[2].incorrectCount +
    byPart[3].incorrectCount +
    byPart[4].incorrectCount;
  const listeningUnanswered =
    byPart[1].unansweredCount +
    byPart[2].unansweredCount +
    byPart[3].unansweredCount +
    byPart[4].unansweredCount;

  const readingRaw =
    byPart[5].correctCount + byPart[6].correctCount + byPart[7].correctCount;
  const readingIncorrect =
    byPart[5].incorrectCount + byPart[6].incorrectCount + byPart[7].incorrectCount;
  const readingUnanswered =
    byPart[5].unansweredCount + byPart[6].unansweredCount + byPart[7].unansweredCount;

  const totalRaw = listeningRaw + readingRaw;
  const totalIncorrect = listeningIncorrect + readingIncorrect;
  const totalUnanswered = listeningUnanswered + readingUnanswered;

  const listeningAccuracy = Math.round((listeningRaw / 100) * 1000) / 10;
  const readingAccuracy = Math.round((readingRaw / 100) * 1000) / 10;
  const accuracyPercentage = Math.round((totalRaw / 200) * 1000) / 10;

  // Scaled Score Calculations (ETS 10–990)
  const listeningScaled = convertListeningScore(listeningRaw);
  const readingScaled = convertReadingScore(readingRaw);
  const totalScaled = listeningScaled + readingScaled;
  const levelBand = getScoreLevelBand(totalScaled);

  const scaledScoreEstimate: ExamScaledScoreEstimate = {
    listeningScaled,
    readingScaled,
    totalScaled,
    label: 'Ước tính điểm ETS 10–990 (Dự báo tham khảo)',
    methodology:
      'Quy đổi theo bảng đường cong chuẩn hóa tiệm cận ETS (Equating curve: Listening 5–495, Reading 5–495).',
    limitations:
      'Điểm số chỉ mang tính chất dự báo phục vụ tự học và kiểm tra tiến độ, không có giá trị thay thế phiếu điểm hoặc chứng chỉ chính thức do ETS / IIG cấp.',
  };

  // Integrity & Strict Validity Evaluation
  const integrityStatus = evaluateResultIntegrity(session);

  // Time calculations
  const totalTimeSeconds = session.elapsedSeconds || (session.listeningElapsedSeconds + session.readingElapsedSeconds);
  const durationMinutes = Math.max(1, Math.round(totalTimeSeconds / 60));

  const staleContentWarning =
    session.contentRevision !== examForm.contentRevision ||
    Boolean(session.integrityFlags.isRevisionMismatch);

  return {
    sessionId: session.sessionId,
    examFormId: examForm.id,
    examCode: examForm.code,
    examTitle: examForm.title,
    schemaVersion: EXAM_SCORING_SCHEMA_VERSION,
    contentRevision: examForm.contentRevision,
    mode: session.mode,
    completedAt: new Date(now).toISOString(),
    durationMinutes,
    totalTimeSeconds,
    listeningTimeSeconds: session.listeningElapsedSeconds,
    readingTimeSeconds: session.readingElapsedSeconds,
    submitReason: session.submitReason ?? 'user_completed',

    listeningRaw,
    readingRaw,
    totalRaw,

    listeningIncorrect,
    listeningUnanswered,
    readingIncorrect,
    readingUnanswered,
    totalIncorrect,
    totalUnanswered,

    listeningAccuracy,
    readingAccuracy,
    accuracyPercentage,

    flaggedCount: flaggedQuestions.length,
    flaggedQuestions,

    listeningScaled,
    readingScaled,
    totalScaled,
    levelBand,
    scaledScoreEstimate,

    integrityStatus,
    byPart,
    reviewItems,
    staleContentWarning,
  };
}

/**
 * Evaluates session integrity and verifies strict mode validity.
 *
 * Rules:
 * - If session.mode !== 'strict', isStrictValid is always false (simulation mode).
 * - If session.mode === 'strict', any media interruption (timeline abnormal, missing audio,
 *   tampering, recovery warning) permanently disqualifies the result from being a valid Strict result.
 */
export function evaluateResultIntegrity(session: ExamSession): ExamResultIntegritySummary {
  const flags = session.integrityFlags;
  const preflightPassed = Boolean(flags?.preflightPassed);
  const isTampered = Boolean(flags?.isTampered);
  const isRevisionMismatch = Boolean(flags?.isRevisionMismatch);
  const clockDriftSeconds = flags?.clockDriftSeconds ?? 0;
  const isClockTampered = Boolean(flags?.isClockTampered);

  // Media interruption detection
  const mediaInterrupted =
    Boolean(flags?.timelineAbnormal) ||
    Boolean(flags?.isAudioMissing) ||
    Boolean(flags?.hasRecoveryWarning) ||
    session.status === 'media-failed' ||
    session.playbackCheckpoint?.audioState === 'error';

  let isStrictValid = false;
  let summary = '';

  if (session.mode !== 'strict') {
    isStrictValid = false;
    summary = 'Chế độ Mô phỏng (Simulation Mode): Cho phép tự do kiểm soát tiến độ làm bài.';
  } else {
    // Mode is strict
    if (!preflightPassed) {
      isStrictValid = false;
      summary = 'Không hợp lệ: Bài thi chưa hoàn thành kiểm định tiền thi (preflight check).';
    } else if (isTampered || isClockTampered || clockDriftSeconds > 15) {
      isStrictValid = false;
      summary = 'Không hợp lệ: Phát hiện sai lệch thời gian hệ thống hoặc chữ ký toàn vẹn.';
    } else if (mediaInterrupted) {
      isStrictValid = false;
      summary =
        'Không đạt chuẩn Strict: Phát hiện gián đoạn phương tiện nghe nhìn hoặc timeline bất thường (media interruption).';
    } else if (isRevisionMismatch) {
      isStrictValid = false;
      summary = 'Không đạt chuẩn Strict: Phiên bản nội dung đề thi không khớp với đề gốc.';
    } else {
      isStrictValid = true;
      summary = 'Hợp lệ chuẩn ETS Strict: Đã hoàn thành 120 phút liên tục không gián đoạn phương tiện.';
    }
  }

  return {
    preflightPassed,
    isTampered,
    isRevisionMismatch,
    isStrictValid,
    mediaInterrupted,
    clockDriftSeconds,
    isClockTampered,
    summary,
  };
}

/**
 * Projects a full ExamResult into a lightweight ExamHistoryEntry for persistent history storage.
 * Does NOT store questions, audio blobs, or raw stimuli.
 */
export function createExamHistoryEntry(result: ExamResult): ExamHistoryEntry {
  const dateStr = result.completedAt.substring(0, 10); // YYYY-MM-DD

  const byPartSummary: Record<
    ToeicPartNumber,
    { correct: number; total: number; accuracy: number }
  > = {} as Record<ToeicPartNumber, { correct: number; total: number; accuracy: number }>;

  for (let p = 1; p <= 7; p++) {
    const partNum = p as ToeicPartNumber;
    const stat = result.byPart[partNum];
    byPartSummary[partNum] = {
      correct: stat.correctCount,
      total: stat.totalQuestions,
      accuracy: stat.accuracyRate,
    };
  }

  return {
    id: `hist_${result.sessionId}`,
    sessionId: result.sessionId,
    examFormId: result.examFormId,
    examCode: result.examCode,
    examTitle: result.examTitle,
    date: dateStr,
    completedAt: result.completedAt,
    mode: result.mode,
    schemaVersion: result.schemaVersion,
    contentRevision: result.contentRevision,

    totalRaw: result.totalRaw,
    listeningRaw: result.listeningRaw,
    readingRaw: result.readingRaw,
    totalIncorrect: result.totalIncorrect,
    totalUnanswered: result.totalUnanswered,
    accuracyPercentage: result.accuracyPercentage,

    totalScore: result.totalScaled,
    listeningScore: result.listeningScaled,
    readingScore: result.readingScaled,
    scaledScoreEstimate: {
      label: result.scaledScoreEstimate.label,
      methodology: result.scaledScoreEstimate.methodology,
      limitations: result.scaledScoreEstimate.limitations,
    },

    durationMinutes: result.durationMinutes,
    totalTimeSeconds: result.totalTimeSeconds,
    submitReason: result.submitReason,
    flaggedCount: result.flaggedCount,

    integrityStatus: {
      isStrictValid: result.integrityStatus.isStrictValid,
      isTampered: result.integrityStatus.isTampered,
      mediaInterrupted: result.integrityStatus.mediaInterrupted,
      summary: result.integrityStatus.summary,
    },

    byPartSummary,
  };
}

/**
 * Verifies mathematical invariants on an ExamResult.
 * Ensures all counts strictly sum to 100 listening, 100 reading, and 200 total questions.
 */
export function validateScoreTotals(result: ExamResult): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Invariant 1: Total questions must equal 200
  const totalSum = result.totalRaw + result.totalIncorrect + result.totalUnanswered;
  if (totalSum !== 200) {
    errors.push(
      `Total invariant violated: totalRaw (${result.totalRaw}) + totalIncorrect (${result.totalIncorrect}) + totalUnanswered (${result.totalUnanswered}) = ${totalSum} (expected 200).`
    );
  }

  // Invariant 2: Listening must equal 100
  const listeningSum =
    result.listeningRaw + result.listeningIncorrect + result.listeningUnanswered;
  if (listeningSum !== 100) {
    errors.push(
      `Listening invariant violated: listeningRaw (${result.listeningRaw}) + listeningIncorrect (${result.listeningIncorrect}) + listeningUnanswered (${result.listeningUnanswered}) = ${listeningSum} (expected 100).`
    );
  }

  // Invariant 3: Reading must equal 100
  const readingSum =
    result.readingRaw + result.readingIncorrect + result.readingUnanswered;
  if (readingSum !== 100) {
    errors.push(
      `Reading invariant violated: readingRaw (${result.readingRaw}) + readingIncorrect (${result.readingIncorrect}) + readingUnanswered (${result.readingUnanswered}) = ${readingSum} (expected 100).`
    );
  }

  // Invariant 4: Part sums
  for (let p = 1; p <= 7; p++) {
    const partNum = p as ToeicPartNumber;
    const part = result.byPart[partNum];
    const expected = PART_QUESTION_COUNTS[partNum];
    const partSum = part.correctCount + part.incorrectCount + part.unansweredCount;
    if (partSum !== expected) {
      errors.push(
        `Part ${p} invariant violated: sum (${partSum}) !== expected count (${expected}).`
      );
    }
  }

  // Invariant 5: Review items count must equal 200
  if (result.reviewItems.length !== 200) {
    errors.push(
      `Review items length (${result.reviewItems.length}) !== expected 200.`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
