/**
 * TOEIC Mastery Hub — Question Bank Lookup Utility
 * Phase 7: Listening Practice Workspace
 *
 * Fast O(1) indexed lookup for questions and groups across all 7 TOEIC Parts.
 */

import { Question, QuestionGroup } from '../types/questionBank';
import { ALL_QUESTIONS, ALL_GROUPS, FULL_QUESTION_BANK_MANIFEST } from '../data/questionBank';

const questionIndex = new Map<string, Question>();
ALL_QUESTIONS.forEach((q) => questionIndex.set(q.id, q));

const groupIndex = new Map<string, QuestionGroup>();
ALL_GROUPS.forEach((g) => groupIndex.set(g.id, g));

/**
 * Retrieves a Question by its unique ID.
 */
export function getQuestionById(id: string): Question | undefined {
  return questionIndex.get(id);
}

/**
 * Retrieves a QuestionGroup by its unique group ID.
 */
export function getQuestionGroupById(id: string): QuestionGroup | undefined {
  return groupIndex.get(id);
}

/**
 * Retrieves all Question objects belonging to a given group ID, in order.
 */
export function getQuestionsForGroup(groupId: string): Question[] {
  const group = groupIndex.get(groupId);
  if (!group) return [];

  const questions: Question[] = [];
  if ('questionIds' in group && Array.isArray(group.questionIds)) {
    for (const qid of group.questionIds) {
      const q = questionIndex.get(qid);
      if (q) questions.push(q);
    }
  }

  return questions.sort((a, b) => (a.orderInGroup || 0) - (b.orderInGroup || 0));
}

/**
 * Validates whether all IDs exist in the Question Bank.
 */
export function verifyQuestionIdsExist(ids: string[]): boolean {
  return ids.every((id) => questionIndex.has(id));
}

export const defaultLookup = {
  getQuestion: getQuestionById,
  getGroup: getQuestionGroupById,
};

export { FULL_QUESTION_BANK_MANIFEST };

