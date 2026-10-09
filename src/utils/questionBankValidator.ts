/**
 * TOEIC Mastery Hub — Question Bank Validator
 * Phase 1: Reusable Question Bank Validation Engine
 * 
 * Validates Question schemas, QuestionGroup integrity, two-way linkages,
 * media/passage completeness, and strict TOEIC constraints:
 * - Part 2: strictly 3 choices (A, B, C)
 * - Parts 1, 3, 4, 5, 6, 7: strictly 4 choices (A, B, C, D)
 * - Part 3 & 4: exactly 3 questions per group
 * - Part 6: exactly 4 questions per group
 * - Part 7: single (2-4 questions, 1 passage), double (5 questions, 2 passages), triple (5 questions, 3 passages)
 * - Media & transcript requirements per Part
 */

import {
  Question,
  QuestionGroup,
  Part1Question,
  Part2Question,
  Part3Question,
  Part4Question,
  Part5Question,
  Part6Question,
  Part7Question,
  Part3Group,
  Part4Group,
  Part6Group,
  Part7Group,
  ToeicPartNumber,
  QuestionDifficulty
} from '../types/questionBank';

export type ValidationSeverity = 'error' | 'warning';

export interface ValidationError {
  code: string;
  message: string;
  entityId: string;
  entityType: 'question' | 'group' | 'bank';
  severity: ValidationSeverity;
  field?: string;
}

export interface ValidationReport {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  stats: {
    questionsChecked: number;
    groupsChecked: number;
    errorsCount: number;
    warningsCount: number;
  };
}

const VALID_DIFFICULTIES: QuestionDifficulty[] = ['easy', 'medium', 'hard'];
const VALID_PARTS: ToeicPartNumber[] = [1, 2, 3, 4, 5, 6, 7];

export function createEmptyReport(): ValidationReport {
  return {
    isValid: true,
    errors: [],
    warnings: [],
    stats: {
      questionsChecked: 0,
      groupsChecked: 0,
      errorsCount: 0,
      warningsCount: 0,
    },
  };
}

export function mergeReports(...reports: ValidationReport[]): ValidationReport {
  const merged = createEmptyReport();
  for (const r of reports) {
    merged.errors.push(...r.errors);
    merged.warnings.push(...r.warnings);
    merged.stats.questionsChecked += r.stats.questionsChecked;
    merged.stats.groupsChecked += r.stats.groupsChecked;
  }
  merged.stats.errorsCount = merged.errors.length;
  merged.stats.warningsCount = merged.warnings.length;
  merged.isValid = merged.errors.length === 0;
  return merged;
}

/**
 * Validates an individual Question instance against strict TOEIC criteria.
 */
export function validateQuestion(raw: unknown): ValidationReport {
  const report = createEmptyReport();
  report.stats.questionsChecked = 1;

  if (!raw || typeof raw !== 'object') {
    report.errors.push({
      code: 'INVALID_OBJECT',
      message: 'Question must be a non-null object',
      entityId: 'unknown',
      entityType: 'question',
      severity: 'error',
    });
    report.isValid = false;
    report.stats.errorsCount = 1;
    return report;
  }

  const q = raw as Partial<Question>;
  const id = typeof q.id === 'string' && q.id.trim().length > 0 ? q.id : 'unknown';

  if (id === 'unknown') {
    report.errors.push({
      code: 'MISSING_ID',
      message: 'Question must have a non-empty string "id"',
      entityId: id,
      entityType: 'question',
      severity: 'error',
      field: 'id',
    });
  }

  // Part number validation
  if (!q.partNum || !VALID_PARTS.includes(q.partNum as ToeicPartNumber)) {
    report.errors.push({
      code: 'INVALID_PART_NUM',
      message: `Question partNum must be an integer between 1 and 7, got ${String(q.partNum)}`,
      entityId: id,
      entityType: 'question',
      severity: 'error',
      field: 'partNum',
    });
    report.isValid = report.errors.length === 0;
    report.stats.errorsCount = report.errors.length;
    return report;
  }

  // Difficulty validation
  if (!q.difficulty || !VALID_DIFFICULTIES.includes(q.difficulty as QuestionDifficulty)) {
    report.errors.push({
      code: 'INVALID_DIFFICULTY',
      message: `Difficulty must be 'easy', 'medium', or 'hard', got "${String(q.difficulty)}"`,
      entityId: id,
      entityType: 'question',
      severity: 'error',
      field: 'difficulty',
    });
  }

  // Topic validation
  if (!q.topic || typeof q.topic !== 'string' || q.topic.trim().length === 0) {
    report.errors.push({
      code: 'MISSING_TOPIC',
      message: 'Question must specify a non-empty topic',
      entityId: id,
      entityType: 'question',
      severity: 'error',
      field: 'topic',
    });
  }

  // Explanation validation
  if (!q.explanation || typeof q.explanation !== 'string' || q.explanation.trim().length === 0) {
    report.errors.push({
      code: 'MISSING_EXPLANATION',
      message: 'Question must provide a pedagogical explanation',
      entityId: id,
      entityType: 'question',
      severity: 'error',
      field: 'explanation',
    });
  }

  // Options validation
  if (!Array.isArray(q.options)) {
    report.errors.push({
      code: 'MISSING_OPTIONS',
      message: 'Question options must be an array',
      entityId: id,
      entityType: 'question',
      severity: 'error',
      field: 'options',
    });
  } else {
    // Check Part-specific option count & keys
    if (q.partNum === 2) {
      if (q.options.length !== 3) {
        report.errors.push({
          code: 'PART2_INVALID_CHOICE_COUNT',
          message: `Part 2 questions must have exactly 3 options (A, B, C), found ${q.options.length}`,
          entityId: id,
          entityType: 'question',
          severity: 'error',
          field: 'options',
        });
      }
      const expectedKeys = ['A', 'B', 'C'];
      const actualKeys = q.options.map(o => o?.key);
      if (actualKeys.join(',') !== expectedKeys.join(',')) {
        report.errors.push({
          code: 'PART2_INVALID_KEYS',
          message: `Part 2 option keys must be precisely ['A', 'B', 'C'], got [${actualKeys.map(k => String(k)).join(', ')}]`,
          entityId: id,
          entityType: 'question',
          severity: 'error',
          field: 'options',
        });
      }
      if (q.correctKey !== 'A' && q.correctKey !== 'B' && q.correctKey !== 'C') {
        report.errors.push({
          code: 'PART2_INVALID_CORRECT_KEY',
          message: `Part 2 correctKey must be 'A', 'B', or 'C', got "${String(q.correctKey)}"`,
          entityId: id,
          entityType: 'question',
          severity: 'error',
          field: 'correctKey',
        });
      }
    } else {
      // Parts 1, 3, 4, 5, 6, 7 have exactly 4 choices
      if (q.options.length !== 4) {
        report.errors.push({
          code: 'INVALID_CHOICE_COUNT',
          message: `Part ${q.partNum} questions must have exactly 4 options (A, B, C, D), found ${q.options.length}`,
          entityId: id,
          entityType: 'question',
          severity: 'error',
          field: 'options',
        });
      }
      const expectedKeys = ['A', 'B', 'C', 'D'];
      const actualKeys = q.options.map(o => o?.key);
      if (actualKeys.join(',') !== expectedKeys.join(',')) {
        report.errors.push({
          code: 'INVALID_OPTION_KEYS',
          message: `Option keys for Part ${q.partNum} must be precisely ['A', 'B', 'C', 'D'], got [${actualKeys.map(k => String(k)).join(', ')}]`,
          entityId: id,
          entityType: 'question',
          severity: 'error',
          field: 'options',
        });
      }
      if (q.correctKey !== 'A' && q.correctKey !== 'B' && q.correctKey !== 'C' && q.correctKey !== 'D') {
        report.errors.push({
          code: 'INVALID_CORRECT_KEY',
          message: `Correct key must be 'A', 'B', 'C', or 'D', got "${String(q.correctKey)}"`,
          entityId: id,
          entityType: 'question',
          severity: 'error',
          field: 'correctKey',
        });
      }
    }

    // Verify option text content
    q.options.forEach((opt, idx) => {
      if (!opt || typeof opt.text !== 'string' || opt.text.trim().length === 0) {
        report.errors.push({
          code: 'EMPTY_OPTION_TEXT',
          message: `Option at index ${idx} (key "${String(opt?.key)}") has empty text`,
          entityId: id,
          entityType: 'question',
          severity: 'error',
          field: `options[${idx}].text`,
        });
      }
    });

    // Verify correctKey exists among options
    const hasMatchingOption = q.options.some(opt => opt?.key === q.correctKey);
    if (!hasMatchingOption && q.correctKey) {
      report.errors.push({
        code: 'CORRECT_KEY_NOT_IN_OPTIONS',
        message: `correctKey "${String(q.correctKey)}" does not match any choice option key`,
        entityId: id,
        entityType: 'question',
        severity: 'error',
        field: 'correctKey',
      });
    }
  }

  // Part-specific structure validation
  switch (q.partNum) {
    case 1: {
      const p1 = q as Partial<Part1Question>;
      if (!p1.media?.visual?.imageUrl && !p1.media?.visual?.illustrationId) {
        report.errors.push({
          code: 'PART1_MISSING_VISUAL',
          message: 'Part 1 question must provide visual media (imageUrl or illustrationId)',
          entityId: id,
          entityType: 'question',
          severity: 'error',
          field: 'media.visual',
        });
      }
      if (!p1.media?.audio?.audioScript && !p1.media?.audio?.audioUrl) {
        report.errors.push({
          code: 'PART1_MISSING_AUDIO',
          message: 'Part 1 question must provide audio media (audioScript or audioUrl)',
          entityId: id,
          entityType: 'question',
          severity: 'error',
          field: 'media.audio',
        });
      }
      break;
    }

    case 2: {
      const p2 = q as Partial<Part2Question>;
      if (!p2.media?.audio?.audioScript && !p2.media?.audio?.audioUrl && !p2.promptScript) {
        report.errors.push({
          code: 'PART2_MISSING_AUDIO',
          message: 'Part 2 question must have prompt audio (audioScript, audioUrl, or promptScript)',
          entityId: id,
          entityType: 'question',
          severity: 'error',
          field: 'media.audio',
        });
      }
      break;
    }

    case 3:
    case 4: {
      const p34 = q as Partial<Part3Question | Part4Question>;
      if (!p34.groupId || typeof p34.groupId !== 'string' || p34.groupId.trim().length === 0) {
        report.errors.push({
          code: 'GROUP_REQUIRED',
          message: `Part ${q.partNum} question must specify a valid "groupId"`,
          entityId: id,
          entityType: 'question',
          severity: 'error',
          field: 'groupId',
        });
      }
      if (!p34.orderInGroup || ![1, 2, 3].includes(p34.orderInGroup)) {
        report.errors.push({
          code: 'INVALID_ORDER_IN_GROUP',
          message: `Part ${q.partNum} orderInGroup must be 1, 2, or 3, got ${String(p34.orderInGroup)}`,
          entityId: id,
          entityType: 'question',
          severity: 'error',
          field: 'orderInGroup',
        });
      }
      if (!p34.question || typeof p34.question !== 'string' || p34.question.trim().length === 0) {
        report.errors.push({
          code: 'MISSING_QUESTION_TEXT',
          message: `Part ${q.partNum} question text must not be empty`,
          entityId: id,
          entityType: 'question',
          severity: 'error',
          field: 'question',
        });
      }
      break;
    }

    case 5: {
      const p5 = q as Partial<Part5Question>;
      if (!p5.sentence || typeof p5.sentence !== 'string' || p5.sentence.trim().length === 0) {
        report.errors.push({
          code: 'PART5_MISSING_SENTENCE',
          message: 'Part 5 question must have a non-empty "sentence"',
          entityId: id,
          entityType: 'question',
          severity: 'error',
          field: 'sentence',
        });
      }
      if (p5.groupId) {
        report.warnings.push({
          code: 'PART5_UNEXPECTED_GROUP',
          message: 'Part 5 question is standalone and should not belong to a QuestionGroup',
          entityId: id,
          entityType: 'question',
          severity: 'warning',
          field: 'groupId',
        });
      }
      break;
    }

    case 6: {
      const p6 = q as Partial<Part6Question>;
      if (!p6.groupId || typeof p6.groupId !== 'string' || p6.groupId.trim().length === 0) {
        report.errors.push({
          code: 'PART6_MISSING_GROUP',
          message: 'Part 6 question must specify a valid "groupId"',
          entityId: id,
          entityType: 'question',
          severity: 'error',
          field: 'groupId',
        });
      }
      if (!p6.orderInGroup || ![1, 2, 3, 4].includes(p6.orderInGroup)) {
        report.errors.push({
          code: 'PART6_INVALID_ORDER',
          message: `Part 6 orderInGroup must be 1, 2, 3, or 4, got ${String(p6.orderInGroup)}`,
          entityId: id,
          entityType: 'question',
          severity: 'error',
          field: 'orderInGroup',
        });
      }
      if (typeof p6.blankNumber !== 'number' || p6.blankNumber <= 0) {
        report.errors.push({
          code: 'PART6_INVALID_BLANK_NUMBER',
          message: `Part 6 question must have a positive blankNumber, got ${String(p6.blankNumber)}`,
          entityId: id,
          entityType: 'question',
          severity: 'error',
          field: 'blankNumber',
        });
      }
      break;
    }

    case 7: {
      const p7 = q as Partial<Part7Question>;
      if (!p7.groupId || typeof p7.groupId !== 'string' || p7.groupId.trim().length === 0) {
        report.errors.push({
          code: 'PART7_MISSING_GROUP',
          message: 'Part 7 question must specify a valid "groupId"',
          entityId: id,
          entityType: 'question',
          severity: 'error',
          field: 'groupId',
        });
      }
      if (typeof p7.orderInGroup !== 'number' || p7.orderInGroup < 1 || p7.orderInGroup > 5) {
        report.errors.push({
          code: 'PART7_INVALID_ORDER',
          message: `Part 7 orderInGroup must be between 1 and 5, got ${String(p7.orderInGroup)}`,
          entityId: id,
          entityType: 'question',
          severity: 'error',
          field: 'orderInGroup',
        });
      }
      if (!p7.question || typeof p7.question !== 'string' || p7.question.trim().length === 0) {
        report.errors.push({
          code: 'PART7_MISSING_QUESTION_TEXT',
          message: 'Part 7 question text must not be empty',
          entityId: id,
          entityType: 'question',
          severity: 'error',
          field: 'question',
        });
      }
      break;
    }
  }

  report.stats.errorsCount = report.errors.length;
  report.stats.warningsCount = report.warnings.length;
  report.isValid = report.errors.length === 0;
  return report;
}

/**
 * Validates a QuestionGroup and optionally checks integrity with a map of questions.
 */
export function validateQuestionGroup(
  raw: unknown,
  questionsMap?: Map<string, Question>
): ValidationReport {
  const report = createEmptyReport();
  report.stats.groupsChecked = 1;

  if (!raw || typeof raw !== 'object') {
    report.errors.push({
      code: 'INVALID_GROUP_OBJECT',
      message: 'QuestionGroup must be a non-null object',
      entityId: 'unknown',
      entityType: 'group',
      severity: 'error',
    });
    report.isValid = false;
    report.stats.errorsCount = 1;
    return report;
  }

  const g = raw as Partial<QuestionGroup>;
  const id = typeof g.id === 'string' && g.id.trim().length > 0 ? g.id : 'unknown';

  if (id === 'unknown') {
    report.errors.push({
      code: 'MISSING_GROUP_ID',
      message: 'QuestionGroup must have a non-empty string "id"',
      entityId: id,
      entityType: 'group',
      severity: 'error',
      field: 'id',
    });
  }

  if (!g.partNum || ![3, 4, 6, 7].includes(g.partNum as number)) {
    report.errors.push({
      code: 'INVALID_GROUP_PART',
      message: `QuestionGroup partNum must be 3, 4, 6, or 7, got ${String(g.partNum)}`,
      entityId: id,
      entityType: 'group',
      severity: 'error',
      field: 'partNum',
    });
    report.isValid = report.errors.length === 0;
    report.stats.errorsCount = report.errors.length;
    return report;
  }

  if (!Array.isArray(g.questionIds) || g.questionIds.length === 0) {
    report.errors.push({
      code: 'EMPTY_GROUP_QUESTION_IDS',
      message: 'QuestionGroup must have a non-empty array of questionIds',
      entityId: id,
      entityType: 'group',
      severity: 'error',
      field: 'questionIds',
    });
  } else {
    // Check for duplicate question IDs in the group
    const seenIds = new Set<string>();
    for (const qId of g.questionIds) {
      if (typeof qId !== 'string' || qId.trim().length === 0) {
        report.errors.push({
          code: 'INVALID_REFERENCED_QUESTION_ID',
          message: 'QuestionGroup contains an empty or non-string question ID',
          entityId: id,
          entityType: 'group',
          severity: 'error',
          field: 'questionIds',
        });
      } else if (seenIds.has(qId)) {
        report.errors.push({
          code: 'DUPLICATE_QUESTION_ID_IN_GROUP',
          message: `Question ID "${qId}" is duplicated inside group "${id}"`,
          entityId: id,
          entityType: 'group',
          severity: 'error',
          field: 'questionIds',
        });
      } else {
        seenIds.add(qId);
      }
    }
  }

  // Part-specific group validation
  switch (g.partNum) {
    case 3: {
      const p3Group = g as Partial<Part3Group>;
      if (p3Group.groupType !== 'part3_conversation') {
        report.errors.push({
          code: 'PART3_INVALID_GROUP_TYPE',
          message: `Part 3 groupType must be 'part3_conversation', got "${String(p3Group.groupType)}"`,
          entityId: id,
          entityType: 'group',
          severity: 'error',
          field: 'groupType',
        });
      }
      if (p3Group.questionIds && p3Group.questionIds.length !== 3) {
        report.errors.push({
          code: 'PART3_QUESTION_COUNT_MISMATCH',
          message: `Part 3 groups must contain exactly 3 questions, found ${p3Group.questionIds.length}`,
          entityId: id,
          entityType: 'group',
          severity: 'error',
          field: 'questionIds',
        });
      }
      if (!p3Group.media?.audio?.audioScript && !p3Group.media?.audio?.audioUrl) {
        report.errors.push({
          code: 'PART3_MISSING_AUDIO',
          message: 'Part 3 group must have audio media (audioScript or audioUrl)',
          entityId: id,
          entityType: 'group',
          severity: 'error',
          field: 'media.audio',
        });
      }
      break;
    }

    case 4: {
      const p4Group = g as Partial<Part4Group>;
      if (p4Group.groupType !== 'part4_talk') {
        report.errors.push({
          code: 'PART4_INVALID_GROUP_TYPE',
          message: `Part 4 groupType must be 'part4_talk', got "${String(p4Group.groupType)}"`,
          entityId: id,
          entityType: 'group',
          severity: 'error',
          field: 'groupType',
        });
      }
      if (p4Group.questionIds && p4Group.questionIds.length !== 3) {
        report.errors.push({
          code: 'PART4_QUESTION_COUNT_MISMATCH',
          message: `Part 4 groups must contain exactly 3 questions, found ${p4Group.questionIds.length}`,
          entityId: id,
          entityType: 'group',
          severity: 'error',
          field: 'questionIds',
        });
      }
      if (!p4Group.media?.audio?.audioScript && !p4Group.media?.audio?.audioUrl) {
        report.errors.push({
          code: 'PART4_MISSING_AUDIO',
          message: 'Part 4 group must have audio media (audioScript or audioUrl)',
          entityId: id,
          entityType: 'group',
          severity: 'error',
          field: 'media.audio',
        });
      }
      break;
    }

    case 6: {
      const p6Group = g as Partial<Part6Group>;
      if (p6Group.groupType !== 'part6_text_completion') {
        report.errors.push({
          code: 'PART6_INVALID_GROUP_TYPE',
          message: `Part 6 groupType must be 'part6_text_completion', got "${String(p6Group.groupType)}"`,
          entityId: id,
          entityType: 'group',
          severity: 'error',
          field: 'groupType',
        });
      }
      if (p6Group.questionIds && p6Group.questionIds.length !== 4) {
        report.errors.push({
          code: 'PART6_QUESTION_COUNT_MISMATCH',
          message: `Part 6 groups must contain exactly 4 questions, found ${p6Group.questionIds.length}`,
          entityId: id,
          entityType: 'group',
          severity: 'error',
          field: 'questionIds',
        });
      }
      if (!p6Group.passageContent || typeof p6Group.passageContent !== 'string' || p6Group.passageContent.trim().length === 0) {
        report.errors.push({
          code: 'PART6_MISSING_PASSAGE',
          message: 'Part 6 group must have non-empty passageContent',
          entityId: id,
          entityType: 'group',
          severity: 'error',
          field: 'passageContent',
        });
      }
      break;
    }

    case 7: {
      const p7Group = g as Partial<Part7Group>;
      if (p7Group.groupType !== 'part7_reading_comprehension') {
        report.errors.push({
          code: 'PART7_INVALID_GROUP_TYPE',
          message: `Part 7 groupType must be 'part7_reading_comprehension', got "${String(p7Group.groupType)}"`,
          entityId: id,
          entityType: 'group',
          severity: 'error',
          field: 'groupType',
        });
      }
      if (!Array.isArray(p7Group.passages) || p7Group.passages.length === 0) {
        report.errors.push({
          code: 'PART7_MISSING_PASSAGES',
          message: 'Part 7 group must have a non-empty passages array',
          entityId: id,
          entityType: 'group',
          severity: 'error',
          field: 'passages',
        });
      } else {
        p7Group.passages.forEach((p, idx) => {
          if (!p.content || typeof p.content !== 'string' || p.content.trim().length === 0) {
            report.errors.push({
              code: 'PART7_EMPTY_PASSAGE_CONTENT',
              message: `Passage at index ${idx} in group "${id}" has empty content`,
              entityId: id,
              entityType: 'group',
              severity: 'error',
              field: `passages[${idx}].content`,
            });
          }
        });

        // Format-specific checks (single, double, triple)
        const qCount = p7Group.questionIds?.length ?? 0;
        switch (p7Group.passageFormat) {
          case 'single':
            if (p7Group.passages.length !== 1) {
              report.errors.push({
                code: 'PART7_SINGLE_PASSAGE_MISMATCH',
                message: `Single passage format must have 1 passage, got ${p7Group.passages.length}`,
                entityId: id,
                entityType: 'group',
                severity: 'error',
                field: 'passages',
              });
            }
            if (qCount < 2 || qCount > 4) {
              report.errors.push({
                code: 'PART7_SINGLE_QUESTION_COUNT',
                message: `Part 7 single passage groups must have 2 to 4 questions, found ${qCount}`,
                entityId: id,
                entityType: 'group',
                severity: 'error',
                field: 'questionIds',
              });
            }
            break;

          case 'double':
            if (p7Group.passages.length !== 2) {
              report.errors.push({
                code: 'PART7_DOUBLE_PASSAGE_MISMATCH',
                message: `Double passage format must have 2 passages, got ${p7Group.passages.length}`,
                entityId: id,
                entityType: 'group',
                severity: 'error',
                field: 'passages',
              });
            }
            if (qCount !== 5) {
              report.errors.push({
                code: 'PART7_DOUBLE_QUESTION_COUNT',
                message: `Part 7 double passage groups must have exactly 5 questions, found ${qCount}`,
                entityId: id,
                entityType: 'group',
                severity: 'error',
                field: 'questionIds',
              });
            }
            break;

          case 'triple':
            if (p7Group.passages.length !== 3) {
              report.errors.push({
                code: 'PART7_TRIPLE_PASSAGE_MISMATCH',
                message: `Triple passage format must have 3 passages, got ${p7Group.passages.length}`,
                entityId: id,
                entityType: 'group',
                severity: 'error',
                field: 'passages',
              });
            }
            if (qCount !== 5) {
              report.errors.push({
                code: 'PART7_TRIPLE_QUESTION_COUNT',
                message: `Part 7 triple passage groups must have exactly 5 questions, found ${qCount}`,
                entityId: id,
                entityType: 'group',
                severity: 'error',
                field: 'questionIds',
              });
            }
            break;

          default:
            report.errors.push({
              code: 'PART7_INVALID_PASSAGE_FORMAT',
              message: `Part 7 passageFormat must be 'single', 'double', or 'triple', got "${String(p7Group.passageFormat)}"`,
              entityId: id,
              entityType: 'group',
              severity: 'error',
              field: 'passageFormat',
            });
            break;
        }
      }
      break;
    }
  }

  // Cross-validation with referenced questions if provided
  if (questionsMap && Array.isArray(g.questionIds)) {
    g.questionIds.forEach((qId, idx) => {
      const q = questionsMap.get(qId);
      if (!q) {
        report.errors.push({
          code: 'ORPHAN_GROUP_QUESTION_REF',
          message: `Group "${id}" references question "${qId}" which does not exist in the bank`,
          entityId: id,
          entityType: 'group',
          severity: 'error',
          field: `questionIds[${idx}]`,
        });
      } else {
        // Two-way link integrity
        if (q.groupId !== id) {
          report.errors.push({
            code: 'GROUP_LINK_MISMATCH',
            message: `Question "${qId}" specifies groupId "${String(q.groupId)}" but is referenced by group "${id}"`,
            entityId: id,
            entityType: 'group',
            severity: 'error',
          });
        }
        if (q.partNum !== g.partNum) {
          report.errors.push({
            code: 'GROUP_PART_MISMATCH',
            message: `Question "${qId}" has partNum ${q.partNum} but its group "${id}" has partNum ${g.partNum}`,
            entityId: id,
            entityType: 'group',
            severity: 'error',
          });
        }
        if (q.orderInGroup !== idx + 1) {
          report.warnings.push({
            code: 'ORDER_IN_GROUP_MISMATCH',
            message: `Question "${qId}" has orderInGroup ${q.orderInGroup} but appears at index ${idx} (expected ${idx + 1})`,
            entityId: id,
            entityType: 'group',
            severity: 'warning',
          });
        }
      }
    });
  }

  report.stats.errorsCount = report.errors.length;
  report.stats.warningsCount = report.warnings.length;
  report.isValid = report.errors.length === 0;
  return report;
}

/**
 * Validates an entire collection of questions and groups.
 * Enforces cross-entity constraints:
 * - Unique IDs across all questions
 * - Unique IDs across all groups
 * - Two-way link integrity (every grouped question has a valid group, every group question exists)
 */
export function validateQuestionBank(bank: {
  questions: Question[];
  groups?: QuestionGroup[];
}): ValidationReport {
  const report = createEmptyReport();
  const questions = bank.questions || [];
  const groups = bank.groups || [];

  const questionsMap = new Map<string, Question>();
  const groupsMap = new Map<string, QuestionGroup>();

  // 1. Check duplicate Question IDs
  for (const q of questions) {
    if (!q || typeof q.id !== 'string') continue;
    if (questionsMap.has(q.id)) {
      report.errors.push({
        code: 'DUPLICATE_QUESTION_ID',
        message: `Duplicate question ID "${q.id}" detected in Question Bank`,
        entityId: q.id,
        entityType: 'bank',
        severity: 'error',
      });
    } else {
      questionsMap.set(q.id, q);
    }
  }

  // 2. Check duplicate Group IDs
  for (const g of groups) {
    if (!g || typeof g.id !== 'string') continue;
    if (groupsMap.has(g.id)) {
      report.errors.push({
        code: 'DUPLICATE_GROUP_ID',
        message: `Duplicate group ID "${g.id}" detected in Question Bank`,
        entityId: g.id,
        entityType: 'bank',
        severity: 'error',
      });
    } else {
      groupsMap.set(g.id, g);
    }
  }

  // 3. Validate every Question individually
  for (const q of questions) {
    const qReport = validateQuestion(q);
    report.errors.push(...qReport.errors);
    report.warnings.push(...qReport.warnings);
    report.stats.questionsChecked += 1;

    // Check if grouped question has a valid group in groupsMap
    if (q.partNum === 3 || q.partNum === 4 || q.partNum === 6 || q.partNum === 7) {
      if (q.groupId && !groupsMap.has(q.groupId)) {
        report.errors.push({
          code: 'ORPHAN_QUESTION_GROUP_REF',
          message: `Question "${q.id}" references groupId "${q.groupId}" which does not exist in Question Bank`,
          entityId: q.id,
          entityType: 'question',
          severity: 'error',
          field: 'groupId',
        });
      }
    }
  }

  // 4. Validate every QuestionGroup with questionsMap
  for (const g of groups) {
    const gReport = validateQuestionGroup(g, questionsMap);
    report.errors.push(...gReport.errors);
    report.warnings.push(...gReport.warnings);
    report.stats.groupsChecked += 1;
  }

  report.stats.errorsCount = report.errors.length;
  report.stats.warningsCount = report.warnings.length;
  report.isValid = report.errors.length === 0;
  return report;
}
