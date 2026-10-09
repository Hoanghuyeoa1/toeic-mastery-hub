/**
 * TOEIC Mastery Hub — Reading Question Bank Manifest (Parts 5–7)
 * Phase 8: Comprehensive Reading Question Bank (Part 7 Multiple Passages Expansion)
 * 
 * Aggregates 100 validated reading questions and 19 groups:
 * - Part 5: 30 Incomplete Sentences covering key grammar & vocabulary domains
 * - Part 6: 4 Text Completion Groups (16 questions), with blanks and sentence insertion
 * - Part 7: 15 Reading Comprehension Groups (54 questions), featuring 10 Single Passages (29 Qs) plus 5 Multiple Passages (25 Qs: 2 Double + 3 Triple)
 * 
 * Decoupled from user LocalStorage data to maintain clean Offline-First architecture.
 */

import { Question, QuestionGroup, QuestionBankPartition, QuestionDifficulty } from '../../types/questionBank';
import { PART5_QUESTIONS } from './part5Reading';
import { PART6_GROUPS, PART6_QUESTIONS } from './part6Reading';
import {
  PART7_GROUPS,
  PART7_QUESTIONS,
  PART7_SINGLE_GROUPS,
  PART7_SINGLE_QUESTIONS,
  PART7_MULTI_GROUPS,
  PART7_MULTI_QUESTIONS,
} from './part7Reading';

export { PART5_QUESTIONS } from './part5Reading';
export { PART6_GROUPS, PART6_QUESTIONS } from './part6Reading';
export {
  PART7_GROUPS,
  PART7_QUESTIONS,
  PART7_SINGLE_GROUPS,
  PART7_SINGLE_QUESTIONS,
  PART7_MULTI_GROUPS,
  PART7_MULTI_QUESTIONS,
} from './part7Reading';

// All Reading Questions combined (100 questions)
export const ALL_READING_QUESTIONS: Question[] = [
  ...PART5_QUESTIONS,
  ...PART6_QUESTIONS,
  ...PART7_QUESTIONS,
];

// All Reading Groups combined (19 groups)
export const ALL_READING_GROUPS: QuestionGroup[] = [
  ...PART6_GROUPS,
  ...PART7_GROUPS,
];

// Partitions for individual reading parts
export const PART5_PARTITION: QuestionBankPartition = {
  partNum: 5,
  version: '2.4.0',
  updatedAt: '2026-10-09',
  questions: PART5_QUESTIONS,
  groups: [],
};

export const PART6_PARTITION: QuestionBankPartition = {
  partNum: 6,
  version: '2.4.0',
  updatedAt: '2026-10-09',
  questions: PART6_QUESTIONS,
  groups: PART6_GROUPS,
};

export const PART7_PARTITION: QuestionBankPartition = {
  partNum: 7,
  version: '2.6.0',
  updatedAt: '2026-10-09',
  questions: PART7_QUESTIONS,
  groups: PART7_GROUPS,
};

export interface ReadingBankStats {
  totalQuestions: number;
  totalGroups: number;
  part5Count: number;
  part6Count: number;
  part7Count: number;
  part6GroupCount: number;
  part7GroupCount: number;
  difficultyCounts: Record<QuestionDifficulty, number>;
}

export const READING_BANK_STATS: ReadingBankStats = {
  totalQuestions: ALL_READING_QUESTIONS.length,
  totalGroups: ALL_READING_GROUPS.length,
  part5Count: PART5_QUESTIONS.length,
  part6Count: PART6_QUESTIONS.length,
  part7Count: PART7_QUESTIONS.length,
  part6GroupCount: PART6_GROUPS.length,
  part7GroupCount: PART7_GROUPS.length,
  difficultyCounts: {
    easy: ALL_READING_QUESTIONS.filter(q => q.difficulty === 'easy').length,
    medium: ALL_READING_QUESTIONS.filter(q => q.difficulty === 'medium').length,
    hard: ALL_READING_QUESTIONS.filter(q => q.difficulty === 'hard').length,
  },
};

/**
 * Filter reading questions by part number
 */
export function getReadingQuestionsByPart(partNum: 5 | 6 | 7): Question[] {
  switch (partNum) {
    case 5:
      return PART5_QUESTIONS;
    case 6:
      return PART6_QUESTIONS;
    case 7:
      return PART7_QUESTIONS;
    default:
      return [];
  }
}
