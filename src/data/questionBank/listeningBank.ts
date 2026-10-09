/**
 * TOEIC Mastery Hub — Listening Question Bank Manifest (Parts 1–4)
 * Phase 2: Comprehensive Listening Question Bank
 * 
 * Aggregates 89 validated listening questions and 18 conversation/talk groups:
 * - Part 1: 10 Photographs with genuine SVG vector illustrations
 * - Part 2: 25 Question-Response items with strictly 3 choices (A, B, C)
 * - Part 3: 13 Conversation Groups (39 questions), including Graphic Context
 * - Part 4: 5 Short Talk Groups (15 questions), including Graphic Context
 * 
 * Note: Decoupled from user LocalStorage data to support offline scaling.
 */

import { Question, QuestionGroup, QuestionBankPartition } from '../../types/questionBank';
import { PART1_QUESTIONS } from './part1Listening';
import { PART2_QUESTIONS } from './part2Listening';
import { PART3_GROUPS, PART3_QUESTIONS } from './part3Listening';
import { PART4_GROUPS, PART4_QUESTIONS } from './part4Listening';

export { PART1_QUESTIONS } from './part1Listening';
export { PART2_QUESTIONS } from './part2Listening';
export { PART3_GROUPS, PART3_QUESTIONS } from './part3Listening';
export { PART4_GROUPS, PART4_QUESTIONS } from './part4Listening';

// All Listening Questions combined (89 questions)
export const ALL_LISTENING_QUESTIONS: Question[] = [
  ...PART1_QUESTIONS,
  ...PART2_QUESTIONS,
  ...PART3_QUESTIONS,
  ...PART4_QUESTIONS,
];

// All Listening Groups combined (18 groups)
export const ALL_LISTENING_GROUPS: QuestionGroup[] = [
  ...PART3_GROUPS,
  ...PART4_GROUPS,
];

// Partitions for individual parts
export const PART1_PARTITION: QuestionBankPartition = {
  partNum: 1,
  version: '2.2.0',
  updatedAt: '2026-10-09',
  questions: PART1_QUESTIONS,
  groups: [],
};

export const PART2_PARTITION: QuestionBankPartition = {
  partNum: 2,
  version: '2.3.0',
  updatedAt: '2026-10-09',
  questions: PART2_QUESTIONS,
  groups: [],
};

export const PART3_PARTITION: QuestionBankPartition = {
  partNum: 3,
  version: '2.3.0',
  updatedAt: '2026-10-09',
  questions: PART3_QUESTIONS,
  groups: PART3_GROUPS,
};

export const PART4_PARTITION: QuestionBankPartition = {
  partNum: 4,
  version: '2.3.0',
  updatedAt: '2026-10-09',
  questions: PART4_QUESTIONS,
  groups: PART4_GROUPS,
};

export interface ListeningBankStats {
  totalQuestions: number;
  totalGroups: number;
  part1Count: number;
  part2Count: number;
  part3Count: number;
  part4Count: number;
  part3GroupCount: number;
  part4GroupCount: number;
}

export const LISTENING_BANK_STATS: ListeningBankStats = {
  totalQuestions: ALL_LISTENING_QUESTIONS.length,
  totalGroups: ALL_LISTENING_GROUPS.length,
  part1Count: PART1_QUESTIONS.length,
  part2Count: PART2_QUESTIONS.length,
  part3Count: PART3_QUESTIONS.length,
  part4Count: PART4_QUESTIONS.length,
  part3GroupCount: PART3_GROUPS.length,
  part4GroupCount: PART4_GROUPS.length,
};

/**
 * Filter questions by part number
 */
export function getListeningQuestionsByPart(partNum: 1 | 2 | 3 | 4): Question[] {
  switch (partNum) {
    case 1:
      return PART1_QUESTIONS;
    case 2:
      return PART2_QUESTIONS;
    case 3:
      return PART3_QUESTIONS;
    case 4:
      return PART4_QUESTIONS;
  }
}

/**
 * Filter groups by part number
 */
export function getListeningGroupsByPart(partNum: 3 | 4): QuestionGroup[] {
  switch (partNum) {
    case 3:
      return PART3_GROUPS;
    case 4:
      return PART4_GROUPS;
  }
}
