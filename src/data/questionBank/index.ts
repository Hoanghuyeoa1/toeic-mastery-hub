/**
 * TOEIC Mastery Hub — Full Question Bank Manifest (Parts 1–7)
 * Phase 8 Unified Offline-First Question Bank (Part 7 Double/Triple Passages Complete)
 * 
 * Aggregates 204 fully validated questions and 42 groups across all 7 parts of the TOEIC test:
 * - Listening (104 questions, 23 groups): Part 1 (10), Part 2 (25), Part 3 (39/13 grp), Part 4 (30/10 grp)
 * - Reading (100 questions, 19 groups): Part 5 (30), Part 6 (16/4 grp), Part 7 (54/15 grp: 10 single [29 Qs], 5 multiple [25 Qs: 2 double + 3 triple])
 */

import { Question, QuestionGroup, QuestionBankManifest, QuestionDifficulty } from '../../types/questionBank';
import {
  ALL_LISTENING_QUESTIONS,
  ALL_LISTENING_GROUPS,
  PART1_PARTITION,
  PART2_PARTITION,
  PART3_PARTITION,
  PART4_PARTITION,
} from './listeningBank';
import {
  ALL_READING_QUESTIONS,
  ALL_READING_GROUPS,
  PART5_PARTITION,
  PART6_PARTITION,
  PART7_PARTITION,
} from './readingBank';

export * from './listeningBank';
export * from './readingBank';

// Full Question Bank Collections
export const ALL_QUESTIONS: Question[] = [
  ...ALL_LISTENING_QUESTIONS,
  ...ALL_READING_QUESTIONS,
];

export const ALL_GROUPS: QuestionGroup[] = [
  ...ALL_LISTENING_GROUPS,
  ...ALL_READING_GROUPS,
];

// Unified Manifest
export const FULL_QUESTION_BANK_MANIFEST: QuestionBankManifest = {
  version: '2.9.0',
  totalQuestions: ALL_QUESTIONS.length,
  totalGroups: ALL_GROUPS.length,
  questionCountByPart: {
    1: PART1_PARTITION.questions.length,
    2: PART2_PARTITION.questions.length,
    3: PART3_PARTITION.questions.length,
    4: PART4_PARTITION.questions.length,
    5: PART5_PARTITION.questions.length,
    6: PART6_PARTITION.questions.length,
    7: PART7_PARTITION.questions.length,
  },
  groupCountByPart: {
    1: 0,
    2: 0,
    3: PART3_PARTITION.groups.length,
    4: PART4_PARTITION.groups.length,
    5: 0,
    6: PART6_PARTITION.groups.length,
    7: PART7_PARTITION.groups.length,
  },
  partitions: {
    1: PART1_PARTITION,
    2: PART2_PARTITION,
    3: PART3_PARTITION,
    4: PART4_PARTITION,
    5: PART5_PARTITION,
    6: PART6_PARTITION,
    7: PART7_PARTITION,
  },
};

export interface FullBankStats {
  totalQuestions: number;
  totalGroups: number;
  listeningCount: number;
  readingCount: number;
  partCounts: Record<1 | 2 | 3 | 4 | 5 | 6 | 7, number>;
  groupCounts: Record<3 | 4 | 6 | 7, number>;
  difficultyDistribution: Record<QuestionDifficulty, number>;
}

export const FULL_BANK_STATS: FullBankStats = {
  totalQuestions: ALL_QUESTIONS.length,
  totalGroups: ALL_GROUPS.length,
  listeningCount: ALL_LISTENING_QUESTIONS.length,
  readingCount: ALL_READING_QUESTIONS.length,
  partCounts: {
    1: ALL_QUESTIONS.filter(q => q.partNum === 1).length,
    2: ALL_QUESTIONS.filter(q => q.partNum === 2).length,
    3: ALL_QUESTIONS.filter(q => q.partNum === 3).length,
    4: ALL_QUESTIONS.filter(q => q.partNum === 4).length,
    5: ALL_QUESTIONS.filter(q => q.partNum === 5).length,
    6: ALL_QUESTIONS.filter(q => q.partNum === 6).length,
    7: ALL_QUESTIONS.filter(q => q.partNum === 7).length,
  },
  groupCounts: {
    3: ALL_GROUPS.filter(g => g.partNum === 3).length,
    4: ALL_GROUPS.filter(g => g.partNum === 4).length,
    6: ALL_GROUPS.filter(g => g.partNum === 6).length,
    7: ALL_GROUPS.filter(g => g.partNum === 7).length,
  },
  difficultyDistribution: {
    easy: ALL_QUESTIONS.filter(q => q.difficulty === 'easy').length,
    medium: ALL_QUESTIONS.filter(q => q.difficulty === 'medium').length,
    hard: ALL_QUESTIONS.filter(q => q.difficulty === 'hard').length,
  },
};
