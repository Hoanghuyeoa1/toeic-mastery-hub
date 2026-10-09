/**
 * TOEIC Mastery Hub — Question Selection Engine
 * Phase 4: Pure functions for Question Selection, Group Integrity, Anti-Repeat & Feasibility
 * 
 * Key Principles:
 * 1. Strict Group Integrity: Part 3/4 (3 Qs), Part 6 (4 Qs), Part 7 (complete variable groups).
 *    Never split groups or fabricate questions.
 * 2. Feasibility Guarantee: If requested count is impossible, returns status 'impossible_count'
 *    with a sorted list of feasible counts and clear pedagogical explanation.
 * 3. Anti-Repeat Discipline: Unseen questions/groups are prioritized first. When exhausted,
 *    recycles least recently practiced items. Zero duplicates within the same session.
 * 4. Deterministic Randomness: Supports custom RNG injection for reproducible testing.
 * 5. Offline-first & Zero Side Effects: Pure functions without modifying question bank or user state.
 */

import {
  ToeicPartNumber,
  QuestionDifficulty,
  Question,
  QuestionGroup,
  Part7Group,
} from '../types/questionBank';
import { ALL_QUESTIONS, ALL_GROUPS } from '../data/questionBank';

// PRACTICE CONFIGURATION & SELECTION TYPES

export type PracticeDifficultyOption = 'easy' | 'medium' | 'hard' | 'mixed';

export interface ItemPracticeHistory {
  lastPracticedAt?: string; // ISO date-time string
  practiceCount?: number;
}

export interface SelectionHistory {
  practicedQuestionIds?: string[];
  practicedGroupIds?: string[];
  questionHistory?: Record<string, ItemPracticeHistory>;
  groupHistory?: Record<string, ItemPracticeHistory>;
}

export interface QuestionSelectionCriteria {
  partNum: ToeicPartNumber;
  difficulty?: PracticeDifficultyOption; // default 'mixed'
  questionCount: number;
  history?: SelectionHistory;
  customQuestions?: Question[];
  customGroups?: QuestionGroup[];
  rng?: () => number; // Optional custom RNG for deterministic testing
}

export type SelectionResult =
  | {
      status: 'success';
      partNum: ToeicPartNumber;
      requestedCount: number;
      actualCount: number;
      questions: Question[];
      groups: QuestionGroup[];
      questionIds: string[];
      groupIds: string[];
      difficultyDistribution: Record<QuestionDifficulty, number>;
      reusedCount: number; // Number of questions previously practiced
      isBankExhausted: boolean; // True if had to recycle previously practiced items
    }
  | {
      status: 'impossible_count';
      partNum: ToeicPartNumber;
      requestedCount: number;
      feasibleCounts: number[];
      reason: string;
    }
  | {
      status: 'insufficient_questions';
      partNum: ToeicPartNumber;
      requestedCount: number;
      availableCount: number;
      feasibleCounts: number[];
      reason: string;
    }
  | {
      status: 'invalid_part';
      partNum: number;
      reason: string;
    };

export interface FeasibleCountsResult {
  partNum: ToeicPartNumber;
  difficulty: PracticeDifficultyOption;
  feasibleCounts: number[];
  maxAvailable: number;
  stepDescription: string;
}

export interface BankAvailabilityStats {
  byPart: Record<ToeicPartNumber, {
    total: number;
    easy: number;
    medium: number;
    hard: number;
    groupsCount: number;
  }>;
  totalQuestions: number;
  totalGroups: number;
}

// HELPER: Deterministic or default shuffle
function shuffleArray<T>(array: T[], rng: () => number): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

// HELPER: Calculate Anti-Repeat Priority Score
function calculatePriorityScore(
  id: string,
  historyList?: string[],
  historyMap?: Record<string, ItemPracticeHistory>
): { practiceCount: number; timestamp: number } {
  const record = historyMap?.[id];
  let practiceCount = record?.practiceCount ?? 0;
  if (!record && historyList?.includes(id)) {
    practiceCount = 1;
  }

  let timestamp = 0;
  if (record?.lastPracticedAt) {
    const parsed = new Date(record.lastPracticedAt).getTime();
    if (!isNaN(parsed)) {
      timestamp = parsed;
    }
  }

  return { practiceCount, timestamp };
}

/**
 * Computes all possible subset sums from a list of group question weights.
 */
function computeSubsetSums(weights: number[]): number[] {
  const sums = new Set<number>();
  sums.add(0);

  for (const w of weights) {
    const currentSums = Array.from(sums);
    for (const s of currentSums) {
      sums.add(s + w);
    }
  }

  sums.delete(0);
  return Array.from(sums).sort((a, b) => a - b);
}

/**
 * Finds all group combinations in Part 7 that sum exactly to targetCount.
 */
function findPart7Combinations(
  groups: Part7Group[],
  targetCount: number
): Part7Group[][] {
  const combinations: Part7Group[][] = [];

  function backtrack(index: number, remaining: number, current: Part7Group[]) {
    if (remaining === 0) {
      combinations.push([...current]);
      return;
    }
    if (index >= groups.length || remaining < 0) {
      return;
    }

    const currentGroup = groups[index];
    const groupWeight = currentGroup.questionIds.length;

    // Branch 1: Include current group if fits
    if (groupWeight <= remaining) {
      current.push(currentGroup);
      backtrack(index + 1, remaining - groupWeight, current);
      current.pop();
    }

    // Branch 2: Exclude current group
    backtrack(index + 1, remaining, current);
  }

  backtrack(0, targetCount, []);
  return combinations;
}

/**
 * Query available question counts that can be formed exactly without breaking group integrity.
 */
export function getFeasibleCountsForPart(
  partNum: ToeicPartNumber,
  difficulty: PracticeDifficultyOption = 'mixed',
  customGroups?: QuestionGroup[],
  customQuestions?: Question[]
): number[] {
  const detail = getFeasibleCountsDetail(partNum, difficulty, customGroups, customQuestions);
  return detail.feasibleCounts;
}

/**
 * Query detailed feasibility info for UI selectors and validation notices.
 */
export function getFeasibleCountsDetail(
  partNum: ToeicPartNumber,
  difficulty: PracticeDifficultyOption = 'mixed',
  customGroups?: QuestionGroup[],
  customQuestions?: Question[]
): FeasibleCountsResult {
  const groupsSource = customGroups ?? ALL_GROUPS;
  const questionsSource = customQuestions ?? ALL_QUESTIONS;

  if (partNum < 1 || partNum > 7) {
    return {
      partNum,
      difficulty,
      feasibleCounts: [],
      maxAvailable: 0,
      stepDescription: 'Part không hợp lệ (chỉ chấp nhận từ Part 1 đến Part 7).',
    };
  }

  // Standalone parts: Part 1, 2, 5
  if (partNum === 1 || partNum === 2 || partNum === 5) {
    let eligible = questionsSource.filter(q => q.partNum === partNum);
    if (difficulty !== 'mixed') {
      eligible = eligible.filter(q => q.difficulty === difficulty);
    }
    const maxAvailable = eligible.length;
    const feasibleCounts: number[] = [];
    for (let i = 1; i <= maxAvailable; i++) {
      feasibleCounts.push(i);
    }

    return {
      partNum,
      difficulty,
      feasibleCounts,
      maxAvailable,
      stepDescription: `Part ${partNum} là các câu hỏi đơn lẻ. Bạn có thể chọn bất kỳ số lượng nào từ 1 đến ${maxAvailable} câu.`,
    };
  }

  // Fixed group parts: Part 3, 4 (3 Qs per group)
  if (partNum === 3 || partNum === 4) {
    let eligibleGroups = groupsSource.filter(g => g.partNum === partNum);
    if (difficulty !== 'mixed') {
      eligibleGroups = eligibleGroups.filter(g => g.difficulty === difficulty);
    }
    const groupCount = eligibleGroups.length;
    const feasibleCounts: number[] = [];
    for (let i = 1; i <= groupCount; i++) {
      feasibleCounts.push(i * 3);
    }

    return {
      partNum,
      difficulty,
      feasibleCounts,
      maxAvailable: groupCount * 3,
      stepDescription: `Part ${partNum} gồm các đoạn hội thoại/bài nói 3 câu hỏi cố định. Số câu phải là bội số của 3 (3, 6, 9...). Hiện có ${groupCount} nhóm (${groupCount * 3} câu).`,
    };
  }

  // Fixed group part: Part 6 (4 Qs per group)
  if (partNum === 6) {
    let eligibleGroups = groupsSource.filter(g => g.partNum === 6);
    if (difficulty !== 'mixed') {
      eligibleGroups = eligibleGroups.filter(g => g.difficulty === difficulty);
    }
    const groupCount = eligibleGroups.length;
    const feasibleCounts: number[] = [];
    for (let i = 1; i <= groupCount; i++) {
      feasibleCounts.push(i * 4);
    }

    return {
      partNum,
      difficulty,
      feasibleCounts,
      maxAvailable: groupCount * 4,
      stepDescription: `Part 6 gồm các đoạn văn 4 vị trí điền khuyết cố định. Số câu phải là bội số của 4 (4, 8, 12, 16). Hiện có ${groupCount} nhóm (${groupCount * 4} câu).`,
    };
  }

  // Variable group part: Part 7
  let eligibleGroups = groupsSource.filter(g => g.partNum === 7) as Part7Group[];
  if (difficulty !== 'mixed') {
    eligibleGroups = eligibleGroups.filter(g => g.difficulty === difficulty);
  }
  const weights = eligibleGroups.map(g => g.questionIds.length);
  const feasibleCounts = computeSubsetSums(weights);
  const maxAvailable = weights.reduce((sum, w) => sum + w, 0);

  return {
    partNum,
    difficulty,
    feasibleCounts,
    maxAvailable,
    stepDescription: `Part 7 gồm các bài đọc Single (3–4 câu), Double (5 câu) và Triple (5 câu). Phải chọn trọn vẹn nhóm bài đọc để đảm bảo ngữ cảnh liên kết. Hiện có ${eligibleGroups.length} nhóm (${maxAvailable} câu).`,
  };
}

/**
 * Calculates recommended practice time according to official ETS test pacing standards.
 * Returned in seconds.
 */
export function calculateRecommendedTime(partNum: ToeicPartNumber, questionCount: number): number {
  switch (partNum) {
    case 1:
      // ~30 seconds per question
      return questionCount * 30;
    case 2:
      // ~25 seconds per question
      return questionCount * 25;
    case 3:
    case 4:
      // ~45 seconds per question (135s per 3-question talk/conversation)
      return questionCount * 45;
    case 5:
      // ~30 seconds per sentence (ETS recommended reading pace: 30s/câu để dành giờ cho Part 7)
      return questionCount * 30;
    case 6:
      // ~45 seconds per question (180s = 3 minutes per passage)
      return questionCount * 45;
    case 7:
      // ~60 seconds per question (1 minute per question for reading comprehension)
      return questionCount * 60;
    default:
      return questionCount * 45;
  }
}

/**
 * Formats seconds into human-readable minutes and seconds.
 */
export function formatDurationPace(totalSeconds: number): string {
  if (totalSeconds < 60) {
    return `${totalSeconds} giây`;
  }
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (secs === 0) {
    return `${mins} phút`;
  }
  return `${mins} phút ${secs} giây`;
}

/**
 * Returns complete question bank availability statistics across parts and difficulty options.
 */
export function getBankAvailability(
  customQuestions?: Question[],
  customGroups?: QuestionGroup[]
): BankAvailabilityStats {
  const questions = customQuestions ?? ALL_QUESTIONS;
  const groups = customGroups ?? ALL_GROUPS;

  const parts = [1, 2, 3, 4, 5, 6, 7] as ToeicPartNumber[];
  const byPart: BankAvailabilityStats['byPart'] = {} as BankAvailabilityStats['byPart'];

  for (const p of parts) {
    const partQs = questions.filter(q => q.partNum === p);
    const partGrps = groups.filter(g => g.partNum === p);

    byPart[p] = {
      total: partQs.length,
      easy: partQs.filter(q => q.difficulty === 'easy').length,
      medium: partQs.filter(q => q.difficulty === 'medium').length,
      hard: partQs.filter(q => q.difficulty === 'hard').length,
      groupsCount: partGrps.length,
    };
  }

  return {
    byPart,
    totalQuestions: questions.length,
    totalGroups: groups.length,
  };
}

/**
 * PURE QUESTION SELECTION ENGINE
 * Selects questions and groups strictly preserving group integrity, anti-repeat priority,
 * and ETS feasibility.
 */
export function selectQuestions(criteria: QuestionSelectionCriteria): SelectionResult {
  const {
    partNum,
    difficulty = 'mixed',
    questionCount,
    history,
    customQuestions,
    customGroups,
    rng = Math.random,
  } = criteria;

  if (partNum < 1 || partNum > 7) {
    return {
      status: 'invalid_part',
      partNum,
      reason: `Part ${partNum} không hợp lệ. TOEIC chỉ có Part từ 1 đến 7.`,
    };
  }

  if (questionCount <= 0) {
    const feasible = getFeasibleCountsForPart(partNum, difficulty, customGroups, customQuestions);
    return {
      status: 'impossible_count',
      partNum,
      requestedCount: questionCount,
      feasibleCounts: feasible,
      reason: 'Số lượng câu hỏi yêu cầu phải lớn hơn 0.',
    };
  }

  const questionsSource = customQuestions ?? ALL_QUESTIONS;
  const groupsSource = customGroups ?? ALL_GROUPS;

  // Question lookup map for fast retrieval by ID
  const questionMap = new Map<string, Question>();
  for (const q of questionsSource) {
    questionMap.set(q.id, q);
  }

  // =========================================================================
  // CASE 1: STANDALONE QUESTIONS (PART 1, PART 2, PART 5)
  // =========================================================================
  if (partNum === 1 || partNum === 2 || partNum === 5) {
    let candidateQuestions = questionsSource.filter(q => q.partNum === partNum);
    if (difficulty !== 'mixed') {
      candidateQuestions = candidateQuestions.filter(q => q.difficulty === difficulty);
    }

    const availableCount = candidateQuestions.length;
    const feasibleCounts = Array.from({ length: availableCount }, (_, i) => i + 1);

    if (questionCount > availableCount) {
      return {
        status: 'insufficient_questions',
        partNum,
        requestedCount: questionCount,
        availableCount,
        feasibleCounts,
        reason: `Không đủ câu hỏi khả dụng cho Part ${partNum} (độ khó: ${difficulty}). Cần ${questionCount} câu nhưng trong ngân hàng chỉ có ${availableCount} câu.`,
      };
    }

    // Score questions by Anti-Repeat priority
    const scoredQuestions = candidateQuestions.map(q => {
      const { practiceCount, timestamp } = calculatePriorityScore(
        q.id,
        history?.practicedQuestionIds,
        history?.questionHistory
      );
      return {
        question: q,
        practiceCount,
        timestamp,
        randomJitter: rng(),
      };
    });

    // Sort: 1) practiceCount asc (unseen first), 2) timestamp asc (least recently practiced), 3) randomJitter
    scoredQuestions.sort((a, b) => {
      if (a.practiceCount !== b.practiceCount) {
        return a.practiceCount - b.practiceCount;
      }
      if (a.timestamp !== b.timestamp) {
        return a.timestamp - b.timestamp;
      }
      return a.randomJitter - b.randomJitter;
    });

    const selectedScored = scoredQuestions.slice(0, questionCount);
    // Shuffle the selected slice to avoid deterministic ordering within session while preserving item selection
    const shuffledSelected = shuffleArray(selectedScored, rng);

    const selectedQuestions = shuffledSelected.map(s => s.question);
    const selectedQuestionIds = selectedQuestions.map(q => q.id);

    const reusedCount = selectedScored.filter(s => s.practiceCount > 0).length;
    const isBankExhausted = reusedCount > 0;

    const difficultyDistribution: Record<QuestionDifficulty, number> = {
      easy: selectedQuestions.filter(q => q.difficulty === 'easy').length,
      medium: selectedQuestions.filter(q => q.difficulty === 'medium').length,
      hard: selectedQuestions.filter(q => q.difficulty === 'hard').length,
    };

    return {
      status: 'success',
      partNum,
      requestedCount: questionCount,
      actualCount: selectedQuestions.length,
      questions: selectedQuestions,
      groups: [],
      questionIds: selectedQuestionIds,
      groupIds: [],
      difficultyDistribution,
      reusedCount,
      isBankExhausted,
    };
  }

  // =========================================================================
  // CASE 2: FIXED-SIZE GROUP QUESTIONS (PART 3, PART 4, PART 6)
  // =========================================================================
  if (partNum === 3 || partNum === 4 || partNum === 6) {
    const groupSize = partNum === 6 ? 4 : 3;

    let candidateGroups = groupsSource.filter(g => g.partNum === partNum);
    if (difficulty !== 'mixed') {
      candidateGroups = candidateGroups.filter(g => g.difficulty === difficulty);
    }

    const availableGroupsCount = candidateGroups.length;
    const maxAvailableQuestions = availableGroupsCount * groupSize;
    const feasibleCounts = Array.from(
      { length: availableGroupsCount },
      (_, i) => (i + 1) * groupSize
    );

    // Feasibility check: must be a positive multiple of groupSize
    if (questionCount % groupSize !== 0) {
      return {
        status: 'impossible_count',
        partNum,
        requestedCount: questionCount,
        feasibleCounts,
        reason: `Part ${partNum} bắt buộc chọn theo nhóm ${groupSize} câu hỏi để đảm bảo tính toàn vẹn ngữ cảnh. Số câu ${questionCount} không thể chia hết cho ${groupSize}. Các số lượng khả thi: ${feasibleCounts.join(', ')} câu.`,
      };
    }

    const requiredGroupsCount = questionCount / groupSize;

    if (requiredGroupsCount > availableGroupsCount) {
      return {
        status: 'insufficient_questions',
        partNum,
        requestedCount: questionCount,
        availableCount: maxAvailableQuestions,
        feasibleCounts,
        reason: `Không đủ nhóm câu hỏi khả dụng cho Part ${partNum} (độ khó: ${difficulty}). Cần ${requiredGroupsCount} nhóm (${questionCount} câu), nhưng chỉ có ${availableGroupsCount} nhóm (${maxAvailableQuestions} câu).`,
      };
    }

    // Score groups by Anti-Repeat priority
    const scoredGroups = candidateGroups.map(g => {
      const { practiceCount, timestamp } = calculatePriorityScore(
        g.id,
        history?.practicedGroupIds,
        history?.groupHistory
      );
      return {
        group: g,
        practiceCount,
        timestamp,
        randomJitter: rng(),
      };
    });

    // Sort: 1) practiceCount asc, 2) timestamp asc, 3) randomJitter
    scoredGroups.sort((a, b) => {
      if (a.practiceCount !== b.practiceCount) {
        return a.practiceCount - b.practiceCount;
      }
      if (a.timestamp !== b.timestamp) {
        return a.timestamp - b.timestamp;
      }
      return a.randomJitter - b.randomJitter;
    });

    const selectedScoredGroups = scoredGroups.slice(0, requiredGroupsCount);
    // Shuffle selected groups to vary presentation order while keeping questions in each group intact
    const shuffledSelectedGroups = shuffleArray(selectedScoredGroups, rng);

    const selectedGroups = shuffledSelectedGroups.map(s => s.group);
    const selectedGroupIds = selectedGroups.map(g => g.id);

    // Extract questions belonging to selected groups in exact order
    const selectedQuestions: Question[] = [];
    for (const g of selectedGroups) {
      for (const qId of g.questionIds) {
        const q = questionMap.get(qId);
        if (q) {
          selectedQuestions.push(q);
        }
      }
    }

    const selectedQuestionIds = selectedQuestions.map(q => q.id);
    const reusedGroupsCount = selectedScoredGroups.filter(s => s.practiceCount > 0).length;
    const reusedQuestionsCount = reusedGroupsCount * groupSize;
    const isBankExhausted = reusedGroupsCount > 0;

    const difficultyDistribution: Record<QuestionDifficulty, number> = {
      easy: selectedQuestions.filter(q => q.difficulty === 'easy').length,
      medium: selectedQuestions.filter(q => q.difficulty === 'medium').length,
      hard: selectedQuestions.filter(q => q.difficulty === 'hard').length,
    };

    return {
      status: 'success',
      partNum,
      requestedCount: questionCount,
      actualCount: selectedQuestions.length,
      questions: selectedQuestions,
      groups: selectedGroups,
      questionIds: selectedQuestionIds,
      groupIds: selectedGroupIds,
      difficultyDistribution,
      reusedCount: reusedQuestionsCount,
      isBankExhausted,
    };
  }

  // =========================================================================
  // CASE 3: VARIABLE-SIZE GROUP QUESTIONS (PART 7 READING COMPREHENSION)
  // =========================================================================
  let candidatePart7Groups = groupsSource.filter(g => g.partNum === 7) as Part7Group[];
  if (difficulty !== 'mixed') {
    candidatePart7Groups = candidatePart7Groups.filter(g => g.difficulty === difficulty);
  }

  const groupWeights = candidatePart7Groups.map(g => g.questionIds.length);
  const feasibleCounts = computeSubsetSums(groupWeights);
  const maxAvailableQuestions = groupWeights.reduce((sum, w) => sum + w, 0);

  // Check if requestedCount is achievable via any subset of groups
  if (!feasibleCounts.includes(questionCount)) {
    if (questionCount > maxAvailableQuestions) {
      return {
        status: 'insufficient_questions',
        partNum: 7,
        requestedCount: questionCount,
        availableCount: maxAvailableQuestions,
        feasibleCounts,
        reason: `Không đủ câu hỏi Part 7 (độ khó: ${difficulty}). Cần ${questionCount} câu nhưng ngân hàng hiện chỉ có tối đa ${maxAvailableQuestions} câu.`,
      };
    }

    return {
      status: 'impossible_count',
      partNum: 7,
      requestedCount: questionCount,
      feasibleCounts,
      reason: `Không thể ghép đúng chính xác ${questionCount} câu cho Part 7 vì mỗi nhóm bài đọc có số câu biến thiên (3, 4 hoặc 5 câu) và bắt buộc phải giữ trọn vẹn ngữ cảnh nhóm. Các số lượng khả thi: ${feasibleCounts.join(', ')} câu.`,
    };
  }

  // Find all group combinations that sum to targetCount
  const validCombinations = findPart7Combinations(candidatePart7Groups, questionCount);

  if (validCombinations.length === 0) {
    return {
      status: 'impossible_count',
      partNum: 7,
      requestedCount: questionCount,
      feasibleCounts,
      reason: `Không tìm thấy tổ hợp nhóm bài đọc nào có tổng số câu bằng ${questionCount}.`,
    };
  }

  // Score each combination based on Anti-Repeat priority
  interface ScoredCombination {
    groups: Part7Group[];
    totalPracticeCount: number;
    totalTimestamp: number;
    reusedQuestionCount: number;
    randomJitter: number;
  }

  const scoredCombinations: ScoredCombination[] = validCombinations.map(combo => {
    let totalPracticeCount = 0;
    let totalTimestamp = 0;
    let reusedQuestionCount = 0;

    for (const g of combo) {
      const { practiceCount, timestamp } = calculatePriorityScore(
        g.id,
        history?.practicedGroupIds,
        history?.groupHistory
      );
      totalPracticeCount += practiceCount;
      totalTimestamp += timestamp;
      if (practiceCount > 0) {
        reusedQuestionCount += g.questionIds.length;
      }
    }

    return {
      groups: combo,
      totalPracticeCount,
      totalTimestamp,
      reusedQuestionCount,
      randomJitter: rng(),
    };
  });

  // Sort combinations: lowest practice count, oldest timestamp, randomJitter
  scoredCombinations.sort((a, b) => {
    if (a.totalPracticeCount !== b.totalPracticeCount) {
      return a.totalPracticeCount - b.totalPracticeCount;
    }
    if (a.totalTimestamp !== b.totalTimestamp) {
      return a.totalTimestamp - b.totalTimestamp;
    }
    return a.randomJitter - b.randomJitter;
  });

  const bestCombination = scoredCombinations[0];
  const shuffledGroups = shuffleArray(bestCombination.groups, rng);

  const selectedQuestions: Question[] = [];
  for (const g of shuffledGroups) {
    for (const qId of g.questionIds) {
      const q = questionMap.get(qId);
      if (q) {
        selectedQuestions.push(q);
      }
    }
  }

  const selectedQuestionIds = selectedQuestions.map(q => q.id);
  const selectedGroupIds = shuffledGroups.map(g => g.id);

  const difficultyDistribution: Record<QuestionDifficulty, number> = {
    easy: selectedQuestions.filter(q => q.difficulty === 'easy').length,
    medium: selectedQuestions.filter(q => q.difficulty === 'medium').length,
    hard: selectedQuestions.filter(q => q.difficulty === 'hard').length,
  };

  return {
    status: 'success',
    partNum: 7,
    requestedCount: questionCount,
    actualCount: selectedQuestions.length,
    questions: selectedQuestions,
    groups: shuffledGroups,
    questionIds: selectedQuestionIds,
    groupIds: selectedGroupIds,
    difficultyDistribution,
    reusedCount: bestCombination.reusedQuestionCount,
    isBankExhausted: bestCombination.reusedQuestionCount > 0,
  };
}
