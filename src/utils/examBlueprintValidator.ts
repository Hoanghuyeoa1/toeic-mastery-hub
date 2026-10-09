/**
 * TOEIC Mastery Hub — Exam Blueprint & Form Pure Validation Engine (Phase 1)
 *
 * Provides pure validation routines for 200-question full-length TOEIC mock exams:
 * 1. Structural Validation (Strict 200 questions, ETS Part distributions, 1-200 sequential
 *    numbering, unique question IDs, group integrity, Part 7 single/multiple distributions,
 *    and schema version compatibility).
 * 2. Content Linkage Validation (Question Bank existence, answer key validation, two-way
 *    group-question bindings, and stale content revision detection).
 *
 * Separates structural/architectural checks from future media runtime / audio duration checks.
 */

import {
  ToeicPartNumber,
  Question,
  QuestionGroup,
  StandardChoiceKey,
} from '../types/questionBank';
import {
  ExamBlueprint,
  ExamForm,
  ExamQuestionRef,
  ExamGroupRef,
  ETS_STANDARD_EXAM_BLUEPRINT,
} from '../types/mockExam';

import { defaultLookup } from './questionBankLookup';

export { ETS_STANDARD_EXAM_BLUEPRINT, defaultLookup };

// ============================================================================
// ERROR CODES & REPORT TYPES
// ============================================================================

export type ExamValidationSeverity = 'error' | 'warning';

export interface ExamValidationError {
  code: string;
  message: string;
  examFormId: string;
  partNum?: ToeicPartNumber;
  groupId?: string;
  globalQuestionNumber?: number;
  questionId?: string;
  severity: ExamValidationSeverity;
}

export interface ExamValidationStats {
  totalQuestions: number;
  listeningQuestions: number;
  readingQuestions: number;
  partCounts: Record<ToeicPartNumber, number>;
  groupCounts: Record<ToeicPartNumber, number>;
  part7SinglePassages: number;
  part7SingleQuestions: number;
  part7MultipleGroups: number;
  part7MultipleQuestions: number;
  errorsCount: number;
  warningsCount: number;
}

export interface ExamValidationReport {
  isValid: boolean;
  examFormId: string;
  errors: ExamValidationError[];
  warnings: ExamValidationError[];
  stats: ExamValidationStats;
}

export interface QuestionBankLookupInterface {
  getQuestion: (id: string) => Question | undefined;
  getGroup: (id: string) => QuestionGroup | undefined;
}

// Supported major schema versions (e.g. "1.x")
const SUPPORTED_SCHEMA_MAJOR_VERSIONS = ['1'];

// Canonical partition boundaries for 200-question ETS mock exam
export const ETS_CANONICAL_PART_BOUNDS = {
  1: { start: 1, end: 6, count: 6, isGrouped: false, expectedChoices: 4 },
  2: { start: 7, end: 31, count: 25, isGrouped: false, expectedChoices: 3 },
  3: { start: 32, end: 70, count: 39, isGrouped: true, groupCount: 13, questionsPerGroup: 3, expectedChoices: 4 },
  4: { start: 71, end: 100, count: 30, isGrouped: true, groupCount: 10, questionsPerGroup: 3, expectedChoices: 4 },
  5: { start: 101, end: 130, count: 30, isGrouped: false, expectedChoices: 4 },
  6: { start: 131, end: 146, count: 16, isGrouped: true, groupCount: 4, questionsPerGroup: 4, expectedChoices: 4 },
  7: {
    start: 147,
    end: 200,
    count: 54,
    isGrouped: true,
    single: { start: 147, end: 175, passageCount: 10, count: 29 },
    multiple: { start: 176, end: 200, groupCount: 5, count: 25, questionsPerGroup: 5 },
    expectedChoices: 4,
  },
} as const;

export function createEmptyExamReport(examFormId: string = 'unknown'): ExamValidationReport {
  return {
    isValid: true,
    examFormId,
    errors: [],
    warnings: [],
    stats: {
      totalQuestions: 0,
      listeningQuestions: 0,
      readingQuestions: 0,
      partCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
      groupCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
      part7SinglePassages: 0,
      part7SingleQuestions: 0,
      part7MultipleGroups: 0,
      part7MultipleQuestions: 0,
      errorsCount: 0,
      warningsCount: 0,
    },
  };
}

// ============================================================================
// 1. STRUCTURAL VALIDATION (PURE ENGINE)
// ============================================================================

/**
 * Validates the complete structural integrity of an ExamForm against the ETS Blueprint.
 * Checks exact counts, sequential numbering (1-200), group integrity, and Part 7 distribution.
 */
export function validateExamFormStructure(
  raw: unknown,
  blueprint: ExamBlueprint = ETS_STANDARD_EXAM_BLUEPRINT
): ExamValidationReport {
  const formId = (raw && typeof raw === 'object' && 'id' in raw && typeof (raw as { id: unknown }).id === 'string')
    ? (raw as { id: string }).id
    : 'unknown';

  const report = createEmptyExamReport(formId);

  // 1. Root object shape
  if (!raw || typeof raw !== 'object') {
    report.errors.push({
      code: 'INVALID_ROOT_OBJECT',
      message: 'ExamForm must be a non-null object',
      examFormId: formId,
      severity: 'error',
    });
    report.isValid = false;
    report.stats.errorsCount = report.errors.length;
    return report;
  }

  const form = raw as Partial<ExamForm>;

  // 2. Schema version compatibility check
  if (!form.schemaVersion || typeof form.schemaVersion !== 'string') {
    report.errors.push({
      code: 'MISSING_SCHEMA_VERSION',
      message: 'ExamForm schemaVersion is missing or invalid',
      examFormId: formId,
      severity: 'error',
    });
  } else {
    const major = form.schemaVersion.split('.')[0];
    if (!SUPPORTED_SCHEMA_MAJOR_VERSIONS.includes(major)) {
      report.errors.push({
        code: 'INCOMPATIBLE_SCHEMA_VERSION',
        message: `ExamForm schemaVersion "${form.schemaVersion}" is incompatible with supported major versions: [${SUPPORTED_SCHEMA_MAJOR_VERSIONS.join(', ')}]`,
        examFormId: formId,
        severity: 'error',
      });
    }
  }

  // 3. Content revision check
  if (typeof form.contentRevision !== 'number' || form.contentRevision < 1) {
    report.errors.push({
      code: 'INVALID_CONTENT_REVISION',
      message: 'ExamForm contentRevision must be a positive integer >= 1',
      examFormId: formId,
      severity: 'error',
    });
  }

  // 4. Questions array validation
  if (!Array.isArray(form.questions)) {
    report.errors.push({
      code: 'MISSING_QUESTIONS_ARRAY',
      message: 'ExamForm questions must be an array',
      examFormId: formId,
      severity: 'error',
    });
    report.isValid = false;
    report.stats.errorsCount = report.errors.length;
    return report;
  }

  const questions = form.questions;
  report.stats.totalQuestions = questions.length;

  // Exact 200 questions constraint
  if (questions.length !== blueprint.totalQuestions) {
    report.errors.push({
      code: 'INVALID_TOTAL_QUESTIONS',
      message: `ExamForm contains ${questions.length} questions, expected exactly ${blueprint.totalQuestions}`,
      examFormId: formId,
      severity: 'error',
    });
  }

  // 5. Sequential Numbering (1 to 200) & Unique Question IDs
  const seenQuestionIds = new Map<string, number>(); // questionId -> globalNumber
  const questionNumberMap = new Map<number, ExamQuestionRef>();

  questions.forEach((q, index) => {
    const expectedGlobalNum = index + 1;

    if (!q || typeof q !== 'object') {
      report.errors.push({
        code: 'INVALID_QUESTION_ITEM',
        message: `Question at array index ${index} is not an object`,
        examFormId: formId,
        severity: 'error',
      });
      return;
    }

    // Numbering order check
    if (q.globalQuestionNumber !== expectedGlobalNum) {
      report.errors.push({
        code: 'INVALID_QUESTION_NUMBERING',
        message: `Question at array index ${index} has globalQuestionNumber ${q.globalQuestionNumber}, expected ${expectedGlobalNum}`,
        examFormId: formId,
        globalQuestionNumber: q.globalQuestionNumber,
        questionId: q.questionId,
        severity: 'error',
      });
    }

    questionNumberMap.set(q.globalQuestionNumber, q);

    // ID Uniqueness check
    if (typeof q.questionId !== 'string' || !q.questionId.trim()) {
      report.errors.push({
        code: 'INVALID_QUESTION_ID',
        message: `Question at index ${index} has missing or empty questionId`,
        examFormId: formId,
        globalQuestionNumber: q.globalQuestionNumber,
        severity: 'error',
      });
    } else {
      if (seenQuestionIds.has(q.questionId)) {
        report.errors.push({
          code: 'DUPLICATE_QUESTION_ID',
          message: `Duplicate questionId "${q.questionId}" detected at Question #${q.globalQuestionNumber} (previously used at Question #${seenQuestionIds.get(q.questionId)})`,
          examFormId: formId,
          globalQuestionNumber: q.globalQuestionNumber,
          questionId: q.questionId,
          partNum: q.partNum,
          severity: 'error',
        });
      } else {
        seenQuestionIds.set(q.questionId, q.globalQuestionNumber);
      }
    }

    // Accumulate part counts
    if (q.partNum >= 1 && q.partNum <= 7) {
      report.stats.partCounts[q.partNum]++;
      if (q.partNum <= 4) {
        report.stats.listeningQuestions++;
      } else {
        report.stats.readingQuestions++;
      }
    }
  });

  // 6. Partition Boundary & Exact Count Checks (Parts 1 to 7)
  for (let p = 1 as ToeicPartNumber; p <= 7; p = (p + 1) as ToeicPartNumber) {
    const bounds = ETS_CANONICAL_PART_BOUNDS[p];
    const actualCount = report.stats.partCounts[p];

    if (actualCount !== bounds.count) {
      report.errors.push({
        code: 'INVALID_PART_COUNT',
        message: `Part ${p} has ${actualCount} questions, expected exactly ${bounds.count}`,
        examFormId: formId,
        partNum: p,
        severity: 'error',
      });
    }

    // Verify each question in this part's canonical range matches partNum and option count
    for (let qNum = bounds.start; qNum <= bounds.end; qNum++) {
      const q = questionNumberMap.get(qNum);
      if (!q) continue;

      if (q.partNum !== p) {
        report.errors.push({
          code: 'PART_NUMBER_RANGE_MISMATCH',
          message: `Question #${qNum} belongs to Part ${q.partNum}, but range ${bounds.start}-${bounds.end} requires Part ${p}`,
          examFormId: formId,
          partNum: q.partNum,
          globalQuestionNumber: qNum,
          questionId: q.questionId,
          severity: 'error',
        });
      }

      // Expected options count (Part 2 has 3 choices, all others have 4)
      const expectedChoices = bounds.expectedChoices;
      if (q.expectedOptionsCount !== expectedChoices) {
        report.errors.push({
          code: 'INVALID_OPTIONS_COUNT_SPEC',
          message: `Question #${qNum} specifies ${q.expectedOptionsCount} choices, Part ${p} requires strictly ${expectedChoices}`,
          examFormId: formId,
          partNum: p,
          globalQuestionNumber: qNum,
          questionId: q.questionId,
          severity: 'error',
        });
      }

      // Group presence check
      if (bounds.isGrouped && !q.groupId) {
        report.errors.push({
          code: 'UNGROUPED_QUESTION_IN_GROUPED_PART',
          message: `Question #${qNum} in grouped Part ${p} must have a valid groupId`,
          examFormId: formId,
          partNum: p,
          globalQuestionNumber: qNum,
          questionId: q.questionId,
          severity: 'error',
        });
      } else if (!bounds.isGrouped && q.groupId) {
        report.errors.push({
          code: 'UNEXPECTED_GROUP_IN_STANDALONE_PART',
          message: `Question #${qNum} in standalone Part ${p} must not reference a groupId ("${q.groupId}")`,
          examFormId: formId,
          partNum: p,
          globalQuestionNumber: qNum,
          questionId: q.questionId,
          severity: 'error',
        });
      }
    }
  }

  // 7. Group List & Group Cardinality Validation
  if (!Array.isArray(form.groups)) {
    report.errors.push({
      code: 'MISSING_GROUPS_ARRAY',
      message: 'ExamForm groups must be an array',
      examFormId: formId,
      severity: 'error',
    });
  } else {
    const groups = form.groups;
    const seenGroupIds = new Set<string>();

    groups.forEach((grp, gIndex) => {
      if (!grp || typeof grp !== 'object') {
        report.errors.push({
          code: 'INVALID_GROUP_OBJECT',
          message: `Group at index ${gIndex} is not an object`,
          examFormId: formId,
          severity: 'error',
        });
        return;
      }

      // Duplicate Group ID check
      if (seenGroupIds.has(grp.groupId)) {
        report.errors.push({
          code: 'DUPLICATE_GROUP_ID',
          message: `Duplicate groupId "${grp.groupId}" detected in ExamForm groups`,
          examFormId: formId,
          groupId: grp.groupId,
          partNum: grp.partNum,
          severity: 'error',
        });
      } else {
        seenGroupIds.add(grp.groupId);
      }

      if (grp.partNum === 3 || grp.partNum === 4 || grp.partNum === 6 || grp.partNum === 7) {
        report.stats.groupCounts[grp.partNum]++;
      }

      // Verify question range integrity
      const span = grp.endQuestionNumber - grp.startQuestionNumber + 1;
      if (span !== grp.questionIds.length) {
        report.errors.push({
          code: 'GROUP_SPAN_MISMATCH',
          message: `Group "${grp.groupId}" has span ${span} (${grp.startQuestionNumber}-${grp.endQuestionNumber}) but has ${grp.questionIds.length} questionIds`,
          examFormId: formId,
          groupId: grp.groupId,
          partNum: grp.partNum,
          severity: 'error',
        });
      }

      // Verify questions in range match this group and are contiguous
      grp.questionIds.forEach((qid, qIdx) => {
        const expectedQNum = grp.startQuestionNumber + qIdx;
        const formQ = questionNumberMap.get(expectedQNum);

        if (!formQ) {
          report.errors.push({
            code: 'GROUP_QUESTION_MISSING',
            message: `Group "${grp.groupId}" expects question at #${expectedQNum}, but none exists`,
            examFormId: formId,
            groupId: grp.groupId,
            partNum: grp.partNum,
            globalQuestionNumber: expectedQNum,
            severity: 'error',
          });
        } else {
          if (formQ.questionId !== qid) {
            report.errors.push({
              code: 'GROUP_QUESTION_ID_MISMATCH',
              message: `Group "${grp.groupId}" at position ${qIdx + 1} expects questionId "${qid}", but Question #${expectedQNum} has "${formQ.questionId}"`,
              examFormId: formId,
              groupId: grp.groupId,
              partNum: grp.partNum,
              globalQuestionNumber: expectedQNum,
              severity: 'error',
            });
          }
          if (formQ.groupId !== grp.groupId) {
            report.errors.push({
              code: 'GROUP_TWO_WAY_LINK_MISMATCH',
              message: `Question #${expectedQNum} references groupId "${formQ.groupId}", but is claimed by group "${grp.groupId}"`,
              examFormId: formId,
              groupId: grp.groupId,
              partNum: grp.partNum,
              globalQuestionNumber: expectedQNum,
              severity: 'error',
            });
          }
        }
      });

      // Part-specific group size constraints
      if (grp.partNum === 3 || grp.partNum === 4) {
        if (grp.questionIds.length !== 3) {
          report.errors.push({
            code: 'INVALID_GROUP_CARDINALITY',
            message: `Part ${grp.partNum} group "${grp.groupId}" contains ${grp.questionIds.length} questions, expected strictly 3`,
            examFormId: formId,
            groupId: grp.groupId,
            partNum: grp.partNum,
            severity: 'error',
          });
        }
      } else if (grp.partNum === 6) {
        if (grp.questionIds.length !== 4) {
          report.errors.push({
            code: 'INVALID_GROUP_CARDINALITY',
            message: `Part 6 group "${grp.groupId}" contains ${grp.questionIds.length} questions, expected strictly 4`,
            examFormId: formId,
            groupId: grp.groupId,
            partNum: 6,
            severity: 'error',
          });
        }
      }
    });

    // 8. Fixed group counts for Part 3, 4, 6
    if (report.stats.groupCounts[3] !== 13) {
      report.errors.push({
        code: 'INVALID_GROUP_COUNT',
        message: `Part 3 has ${report.stats.groupCounts[3]} groups, expected strictly 13`,
        examFormId: formId,
        partNum: 3,
        severity: 'error',
      });
    }

    if (report.stats.groupCounts[4] !== 10) {
      report.errors.push({
        code: 'INVALID_GROUP_COUNT',
        message: `Part 4 has ${report.stats.groupCounts[4]} groups, expected strictly 10`,
        examFormId: formId,
        partNum: 4,
        severity: 'error',
      });
    }

    if (report.stats.groupCounts[6] !== 4) {
      report.errors.push({
        code: 'INVALID_GROUP_COUNT',
        message: `Part 6 has ${report.stats.groupCounts[6]} groups, expected strictly 4`,
        examFormId: formId,
        partNum: 6,
        severity: 'error',
      });
    }

    // 9. Part 7 Single vs Multiple Passages Distribution
    const part7Groups = groups.filter((g) => g.partNum === 7);
    const p7SingleBounds = ETS_CANONICAL_PART_BOUNDS[7].single;
    const p7MultipleBounds = ETS_CANONICAL_PART_BOUNDS[7].multiple;

    let p7SinglePassagesCount = 0;
    let p7SingleQuestionsCount = 0;
    let p7MultipleGroupsCount = 0;
    let p7MultipleQuestionsCount = 0;

    part7Groups.forEach((g) => {
      const qCount = g.questionIds.length;
      const isSingleRange =
        g.startQuestionNumber >= p7SingleBounds.start &&
        g.endQuestionNumber <= p7SingleBounds.end;
      const isMultipleRange =
        g.startQuestionNumber >= p7MultipleBounds.start &&
        g.endQuestionNumber <= p7MultipleBounds.end;

      if (isSingleRange) {
        p7SinglePassagesCount++;
        p7SingleQuestionsCount += qCount;

        if (g.passageFormat !== 'single') {
          report.errors.push({
            code: 'PART7_SINGLE_FORMAT_MISMATCH',
            message: `Part 7 group "${g.groupId}" in single passage range (147-175) has format "${g.passageFormat}", expected "single"`,
            examFormId: formId,
            groupId: g.groupId,
            partNum: 7,
            severity: 'error',
          });
        }

        // Each single passage group must have between 2 and 4 questions
        if (qCount < 2 || qCount > 4) {
          report.errors.push({
            code: 'PART7_SINGLE_CARDINALITY_OUT_OF_BOUNDS',
            message: `Part 7 single passage "${g.groupId}" has ${qCount} questions, expected between 2 and 4`,
            examFormId: formId,
            groupId: g.groupId,
            partNum: 7,
            severity: 'error',
          });
        }
      } else if (isMultipleRange) {
        p7MultipleGroupsCount++;
        p7MultipleQuestionsCount += qCount;

        if (g.passageFormat !== 'double' && g.passageFormat !== 'triple') {
          report.errors.push({
            code: 'PART7_MULTIPLE_FORMAT_MISMATCH',
            message: `Part 7 group "${g.groupId}" in multiple passage range (176-200) has format "${g.passageFormat}", expected "double" or "triple"`,
            examFormId: formId,
            groupId: g.groupId,
            partNum: 7,
            severity: 'error',
          });
        }

        // Each multiple passage group must have strictly 5 questions
        if (qCount !== 5) {
          report.errors.push({
            code: 'PART7_MULTIPLE_CARDINALITY_MISMATCH',
            message: `Part 7 multiple passage group "${g.groupId}" has ${qCount} questions, expected strictly 5`,
            examFormId: formId,
            groupId: g.groupId,
            partNum: 7,
            severity: 'error',
          });
        }
      } else {
        report.errors.push({
          code: 'PART7_GROUP_BOUNDARY_CROSSING',
          message: `Part 7 group "${g.groupId}" (${g.startQuestionNumber}-${g.endQuestionNumber}) crosses single/multiple passage boundary (175/176)`,
          examFormId: formId,
          groupId: g.groupId,
          partNum: 7,
          severity: 'error',
        });
      }
    });

    report.stats.part7SinglePassages = p7SinglePassagesCount;
    report.stats.part7SingleQuestions = p7SingleQuestionsCount;
    report.stats.part7MultipleGroups = p7MultipleGroupsCount;
    report.stats.part7MultipleQuestions = p7MultipleQuestionsCount;

    if (p7SinglePassagesCount !== p7SingleBounds.passageCount) {
      report.errors.push({
        code: 'PART7_SINGLE_PASSAGE_COUNT_MISMATCH',
        message: `Part 7 has ${p7SinglePassagesCount} single passages, expected exactly ${p7SingleBounds.passageCount}`,
        examFormId: formId,
        partNum: 7,
        severity: 'error',
      });
    }

    if (p7SingleQuestionsCount !== p7SingleBounds.count) {
      report.errors.push({
        code: 'PART7_SINGLE_QUESTION_COUNT_MISMATCH',
        message: `Part 7 single passages have ${p7SingleQuestionsCount} questions, expected exactly ${p7SingleBounds.count}`,
        examFormId: formId,
        partNum: 7,
        severity: 'error',
      });
    }

    if (p7MultipleGroupsCount !== p7MultipleBounds.groupCount) {
      report.errors.push({
        code: 'PART7_MULTIPLE_GROUP_COUNT_MISMATCH',
        message: `Part 7 has ${p7MultipleGroupsCount} multiple passage groups, expected exactly ${p7MultipleBounds.groupCount}`,
        examFormId: formId,
        partNum: 7,
        severity: 'error',
      });
    }

    if (p7MultipleQuestionsCount !== p7MultipleBounds.count) {
      report.errors.push({
        code: 'PART7_MULTIPLE_QUESTION_COUNT_MISMATCH',
        message: `Part 7 multiple passage groups have ${p7MultipleQuestionsCount} questions, expected exactly ${p7MultipleBounds.count}`,
        examFormId: formId,
        partNum: 7,
        severity: 'error',
      });
    }
  }

  report.stats.errorsCount = report.errors.length;
  report.stats.warningsCount = report.warnings.length;
  report.isValid = report.errors.length === 0;

  return report;
}

// ============================================================================
// 2. CONTENT LINKAGE VALIDATION (AGAINST QUESTION BANK)
// ============================================================================

/**
 * Validates that all questions and groups referenced in an ExamForm exist in the
 * Question Bank, match options specifications, have valid answer keys, and detect
 * potential stale content.
 */
export function validateExamFormContentLinks(
  form: ExamForm,
  lookup: QuestionBankLookupInterface
): ExamValidationReport {
  const report = createEmptyExamReport(form.id);

  // 1. Validate every Question reference
  form.questions.forEach((qRef) => {
    const q = lookup.getQuestion(qRef.questionId);

    if (!q) {
      report.errors.push({
        code: 'MISSING_QUESTION_BANK_REF',
        message: `Question #${qRef.globalQuestionNumber} references questionId "${qRef.questionId}" which does not exist in Question Bank`,
        examFormId: form.id,
        partNum: qRef.partNum,
        globalQuestionNumber: qRef.globalQuestionNumber,
        questionId: qRef.questionId,
        severity: 'error',
      });
      return;
    }

    // Part number consistency
    if (q.partNum !== qRef.partNum) {
      report.errors.push({
        code: 'QUESTION_BANK_PART_MISMATCH',
        message: `Question #${qRef.globalQuestionNumber} form partNum is ${qRef.partNum}, but bank entity "${q.id}" has partNum ${q.partNum}`,
        examFormId: form.id,
        partNum: qRef.partNum,
        globalQuestionNumber: qRef.globalQuestionNumber,
        questionId: qRef.questionId,
        severity: 'error',
      });
    }

    // Options count in bank entity
    const actualChoicesCount = q.options?.length;
    if (actualChoicesCount !== qRef.expectedOptionsCount) {
      report.errors.push({
        code: 'QUESTION_OPTIONS_COUNT_MISMATCH',
        message: `Question #${qRef.globalQuestionNumber} expects ${qRef.expectedOptionsCount} choices, but bank entity has ${actualChoicesCount}`,
        examFormId: form.id,
        partNum: qRef.partNum,
        globalQuestionNumber: qRef.globalQuestionNumber,
        questionId: qRef.questionId,
        severity: 'error',
      });
    }

    // Valid answer key
    const validKeys: StandardChoiceKey[] = qRef.partNum === 2 ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D'];
    if (!validKeys.includes(q.correctKey as StandardChoiceKey)) {
      report.errors.push({
        code: 'INVALID_ANSWER_KEY',
        message: `Question #${qRef.globalQuestionNumber} has correctKey "${q.correctKey}", not in allowed keys [${validKeys.join(', ')}]`,
        examFormId: form.id,
        partNum: qRef.partNum,
        globalQuestionNumber: qRef.globalQuestionNumber,
        questionId: qRef.questionId,
        severity: 'error',
      });
    }

    // Two-way group check
    if (qRef.groupId && q.groupId !== qRef.groupId) {
      report.errors.push({
        code: 'QUESTION_GROUP_ID_MISMATCH',
        message: `Question #${qRef.globalQuestionNumber} specifies groupId "${qRef.groupId}", but bank entity has "${q.groupId}"`,
        examFormId: form.id,
        groupId: qRef.groupId,
        partNum: qRef.partNum,
        globalQuestionNumber: qRef.globalQuestionNumber,
        questionId: qRef.questionId,
        severity: 'error',
      });
    }
  });

  // 2. Validate every Group reference
  form.groups.forEach((gRef) => {
    const grp = lookup.getGroup(gRef.groupId);

    if (!grp) {
      report.errors.push({
        code: 'MISSING_GROUP_BANK_REF',
        message: `Group "${gRef.groupId}" does not exist in Question Bank`,
        examFormId: form.id,
        groupId: gRef.groupId,
        partNum: gRef.partNum,
        severity: 'error',
      });
      return;
    }

    if (grp.partNum !== gRef.partNum) {
      report.errors.push({
        code: 'GROUP_BANK_PART_MISMATCH',
        message: `Group "${gRef.groupId}" has form partNum ${gRef.partNum}, but bank entity has partNum ${grp.partNum}`,
        examFormId: form.id,
        groupId: gRef.groupId,
        partNum: gRef.partNum,
        severity: 'error',
      });
    }

    // Check that questionIds array in bank entity matches form group
    if ('questionIds' in grp && Array.isArray(grp.questionIds)) {
      const bankQIds = grp.questionIds as string[];
      if (bankQIds.length !== gRef.questionIds.length) {
        report.errors.push({
          code: 'GROUP_QUESTION_IDS_COUNT_MISMATCH',
          message: `Group "${gRef.groupId}" in form has ${gRef.questionIds.length} questions, but bank entity has ${bankQIds.length}`,
          examFormId: form.id,
          groupId: gRef.groupId,
          partNum: gRef.partNum,
          severity: 'error',
        });
      } else {
        bankQIds.forEach((bqId, idx) => {
          if (bqId !== gRef.questionIds[idx]) {
            report.errors.push({
              code: 'GROUP_QUESTION_ID_SEQUENCE_MISMATCH',
              message: `Group "${gRef.groupId}" position ${idx} has "${gRef.questionIds[idx]}", bank entity has "${bqId}"`,
              examFormId: form.id,
              groupId: gRef.groupId,
              partNum: gRef.partNum,
              severity: 'error',
            });
          }
        });
      }
    }
  });

  report.stats.errorsCount = report.errors.length;
  report.stats.warningsCount = report.warnings.length;
  report.isValid = report.errors.length === 0;

  return report;
}

// ============================================================================
// 3. COMBINED / UTILITY VALIDATION WRAPPER
// ============================================================================

/**
 * Validates both structure and content links (if lookup is provided).
 */
export function validateExamForm(
  raw: unknown,
  options?: {
    blueprint?: ExamBlueprint;
    lookup?: QuestionBankLookupInterface;
  }
): ExamValidationReport {
  const structReport = validateExamFormStructure(raw, options?.blueprint);

  if (!structReport.isValid || !options?.lookup) {
    return structReport;
  }

  const contentReport = validateExamFormContentLinks(raw as ExamForm, options.lookup);

  // Merge errors and warnings
  structReport.errors.push(...contentReport.errors);
  structReport.warnings.push(...contentReport.warnings);
  structReport.stats.errorsCount = structReport.errors.length;
  structReport.stats.warningsCount = structReport.warnings.length;
  structReport.isValid = structReport.errors.length === 0;

  return structReport;
}

/**
 * Calculates a deterministic content fingerprint from an ordered list of question IDs.
 */
export function calculateContentFingerprint(questionIds: string[]): string {
  let hash = 0;
  const str = questionIds.join('|');
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `fp_${Math.abs(hash).toString(16)}`;
}
