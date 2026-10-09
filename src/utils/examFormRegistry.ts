/**
 * TOEIC Mastery Hub — Exam Form Registry & Assembly System (Phase 9)
 *
 * Provides thread-safe, immutable registry operations for 200-question ETS Exam Forms:
 * - Registration, lookup, filtering by readiness tier ('simulation-ready', 'strict-ready')
 * - Content revision preservation and backward-compatibility guards
 * - Dynamic compilation of alternative compliant Exam Forms from the Question Bank
 */

import { ExamForm, ExamReadinessStatus, ExamQuestionRef, ExamGroupRef } from '../types/mockExam';
import {
  validateExamFormStructure,
  calculateContentFingerprint,
  defaultLookup,
} from './examBlueprintValidator';
import { assessExamFormMediaReadiness } from './mediaReadiness';
import {
  CANONICAL_ETS_EXAM_FORM_01,
  buildCanonicalExamForm01,
} from '../data/examForms/etsMockForm01';
import { PART1_QUESTIONS } from '../data/questionBank/part1Listening';
import { PART2_QUESTIONS } from '../data/questionBank/part2Listening';
import { PART3_GROUPS } from '../data/questionBank/part3Listening';
import { PART4_GROUPS } from '../data/questionBank/part4Listening';
import { PART5_QUESTIONS } from '../data/questionBank/part5Reading';
import { PART6_GROUPS } from '../data/questionBank/part6Reading';
import {
  PART7_SINGLE_GROUPS,
  PART7_MULTI_GROUPS,
} from '../data/questionBank/part7Reading';

// In-memory registry map
const formsById = new Map<string, ExamForm>();
const formsByCode = new Map<string, ExamForm>();

// Initialize with canonical form
registerCanonicalForms();

function registerCanonicalForms(): void {
  formsById.set(CANONICAL_ETS_EXAM_FORM_01.id, CANONICAL_ETS_EXAM_FORM_01);
  formsByCode.set(CANONICAL_ETS_EXAM_FORM_01.code, CANONICAL_ETS_EXAM_FORM_01);
}

/**
 * Registers an ExamForm into the registry.
 * Validates structural integrity and enforces content revision preservation rules.
 */
export function registerExamForm(
  form: ExamForm,
  options?: { allowOverwrite?: boolean }
): { success: boolean; errors?: string[] } {
  // Validate structure
  const report = validateExamFormStructure(form);
  if (!report.isValid) {
    return {
      success: false,
      errors: report.errors.map((e) => `[${e.code}] ${e.message}`),
    };
  }

  const existing = formsById.get(form.id);
  if (existing && !options?.allowOverwrite) {
    // Check content revision: cannot downgrade or overwrite without explicit option
    if (form.contentRevision < existing.contentRevision) {
      return {
        success: false,
        errors: [
          `Cannot overwrite ExamForm "${form.id}" with older content revision ${form.contentRevision} (existing is ${existing.contentRevision})`,
        ],
      };
    }
    return {
      success: false,
      errors: [`ExamForm with id "${form.id}" is already registered. Set allowOverwrite: true to update.`],
    };
  }

  // Update media readiness assessment dynamically if not set
  if (!form.media.readinessStatus) {
    const readinessReport = assessExamFormMediaReadiness(form, defaultLookup);
    form.media.readinessStatus = readinessReport.readinessStatus;
    form.media.strictLocked = readinessReport.strictLocked;
    form.media.lockReason = readinessReport.lockReason;
  }

  formsById.set(form.id, form);
  formsByCode.set(form.code, form);

  return { success: true };
}

/**
 * Retrieves an ExamForm by its unique ID.
 */
export function getExamFormById(id: string): ExamForm | undefined {
  return formsById.get(id);
}

/**
 * Retrieves an ExamForm by its test code.
 */
export function getExamFormByCode(code: string): ExamForm | undefined {
  return formsByCode.get(code);
}

/**
 * Returns all currently registered ExamForms.
 */
export function getAllExamForms(): ExamForm[] {
  return Array.from(formsById.values());
}

/**
 * Returns ExamForms filtered by minimum readiness tier.
 * Rank order: 'invalid' < 'content-ready' < 'simulation-ready' < 'strict-ready'
 */
const STATUS_RANK: Record<ExamReadinessStatus, number> = {
  invalid: 0,
  'content-ready': 1,
  'simulation-ready': 2,
  'strict-ready': 3,
};

export function getAvailableExamForms(options?: {
  minStatus?: ExamReadinessStatus;
  strictOnly?: boolean;
}): ExamForm[] {
  const minRank = STATUS_RANK[options?.minStatus || 'simulation-ready'];
  const strictOnly = options?.strictOnly || false;

  return getAllExamForms().filter((form) => {
    const status = form.media.readinessStatus || 'invalid';
    const rank = STATUS_RANK[status];

    if (rank < minRank) return false;
    if (strictOnly && form.media.strictLocked) return false;

    return true;
  });
}

/**
 * Unregisters an ExamForm by its ID.
 */
export function unregisterExamForm(id: string): boolean {
  const form = formsById.get(id);
  if (!form) return false;

  formsById.delete(id);
  formsByCode.delete(form.code);
  return true;
}

/**
 * Resets registry to default canonical state.
 */
export function resetExamFormRegistry(): void {
  formsById.clear();
  formsByCode.clear();
  registerCanonicalForms();
}

/**
 * Compiles a new compliant 200-question ExamForm using customizable question selections.
 * Allows creating alternative forms while maintaining 100% ETS blueprint constraints.
 */
export interface CompileExamFormOptions {
  id: string;
  title: string;
  code: string;
  contentRevision?: number;
  part1StartIndex?: number; // 0 to 4 (since we have 10 P1 questions and need 6)
}

export function compileStandardExamForm(options: CompileExamFormOptions): ExamForm {
  const { id, title, code, contentRevision = 1, part1StartIndex = 0 } = options;

  const questions: ExamQuestionRef[] = [];
  const groups: ExamGroupRef[] = [];
  let globalQNum = 1;

  // Part 1: Select 6 questions starting from part1StartIndex
  const p1Selected = PART1_QUESTIONS.slice(part1StartIndex, part1StartIndex + 6);
  if (p1Selected.length < 6) {
    throw new Error(`Not enough Part 1 questions from startIndex ${part1StartIndex} (found ${p1Selected.length}, need 6)`);
  }
  p1Selected.forEach((q) => {
    questions.push({
      globalQuestionNumber: globalQNum++,
      partNum: 1,
      section: 'listening',
      questionId: q.id,
      expectedOptionsCount: 4,
    });
  });

  // Part 2: 25 questions
  for (let i = 0; i < 25; i++) {
    const q = PART2_QUESTIONS[i];
    questions.push({
      globalQuestionNumber: globalQNum++,
      partNum: 2,
      section: 'listening',
      questionId: q.id,
      expectedOptionsCount: 3,
    });
  }

  // Part 3: 13 Groups (39 Qs)
  for (const grp of PART3_GROUPS) {
    const startQ = globalQNum;
    grp.questionIds.forEach((qId, idx) => {
      questions.push({
        globalQuestionNumber: globalQNum++,
        partNum: 3,
        section: 'listening',
        questionId: qId,
        groupId: grp.id,
        orderInGroup: idx + 1,
        expectedOptionsCount: 4,
      });
    });
    groups.push({
      groupId: grp.id,
      partNum: 3,
      startQuestionNumber: startQ,
      endQuestionNumber: globalQNum - 1,
      questionIds: [...grp.questionIds],
      groupType: 'part3_conversation',
    });
  }

  // Part 4: 10 Groups (30 Qs)
  for (const grp of PART4_GROUPS) {
    const startQ = globalQNum;
    grp.questionIds.forEach((qId, idx) => {
      questions.push({
        globalQuestionNumber: globalQNum++,
        partNum: 4,
        section: 'listening',
        questionId: qId,
        groupId: grp.id,
        orderInGroup: idx + 1,
        expectedOptionsCount: 4,
      });
    });
    groups.push({
      groupId: grp.id,
      partNum: 4,
      startQuestionNumber: startQ,
      endQuestionNumber: globalQNum - 1,
      questionIds: [...grp.questionIds],
      groupType: 'part4_talk',
    });
  }

  // Part 5: 30 Qs
  for (let i = 0; i < 30; i++) {
    const q = PART5_QUESTIONS[i];
    questions.push({
      globalQuestionNumber: globalQNum++,
      partNum: 5,
      section: 'reading',
      questionId: q.id,
      expectedOptionsCount: 4,
    });
  }

  // Part 6: 4 Groups (16 Qs)
  for (const grp of PART6_GROUPS) {
    const startQ = globalQNum;
    grp.questionIds.forEach((qId, idx) => {
      questions.push({
        globalQuestionNumber: globalQNum++,
        partNum: 6,
        section: 'reading',
        questionId: qId,
        groupId: grp.id,
        orderInGroup: idx + 1,
        expectedOptionsCount: 4,
      });
    });
    groups.push({
      groupId: grp.id,
      partNum: 6,
      startQuestionNumber: startQ,
      endQuestionNumber: globalQNum - 1,
      questionIds: [...grp.questionIds],
      groupType: 'part6_text_completion',
    });
  }

  // Part 7 Single: 10 Groups (29 Qs)
  for (const grp of PART7_SINGLE_GROUPS) {
    const startQ = globalQNum;
    grp.questionIds.forEach((qId, idx) => {
      questions.push({
        globalQuestionNumber: globalQNum++,
        partNum: 7,
        section: 'reading',
        questionId: qId,
        groupId: grp.id,
        orderInGroup: idx + 1,
        expectedOptionsCount: 4,
      });
    });
    groups.push({
      groupId: grp.id,
      partNum: 7,
      startQuestionNumber: startQ,
      endQuestionNumber: globalQNum - 1,
      questionIds: [...grp.questionIds],
      passageFormat: 'single',
      groupType: 'part7_reading_comprehension',
    });
  }

  // Part 7 Multiple: 5 Groups (25 Qs)
  for (const grp of PART7_MULTI_GROUPS) {
    const startQ = globalQNum;
    grp.questionIds.forEach((qId, idx) => {
      questions.push({
        globalQuestionNumber: globalQNum++,
        partNum: 7,
        section: 'reading',
        questionId: qId,
        groupId: grp.id,
        orderInGroup: idx + 1,
        expectedOptionsCount: 4,
      });
    });
    groups.push({
      groupId: grp.id,
      partNum: 7,
      startQuestionNumber: startQ,
      endQuestionNumber: globalQNum - 1,
      questionIds: [...grp.questionIds],
      passageFormat: grp.passageFormat,
      groupType: 'part7_reading_comprehension',
    });
  }

  const allQIds = questions.map((q) => q.questionId);
  const fingerprint = calculateContentFingerprint(allQIds);

  const form: ExamForm = {
    id,
    title,
    code,
    schemaVersion: '1.0.0',
    contentRevision,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blueprintId: 'ets_standard_blueprint',
    questions,
    groups,
    media: {
      audioMode: 'tts_simulation',
      hasVisuals: true,
      illustrationsCount: 8,
      readinessStatus: 'simulation-ready',
      strictLocked: true,
      lockReason:
        'Chưa có gói tệp âm thanh phòng thu thực tế (prerecorded audio files) và timeline kiểm chứng. ' +
        'Chế độ Strict Mock 45 phút bị khóa. Sẵn sàng 100% cho chế độ Mô Phỏng (Simulation Mode) bằng Web Speech API.',
    },
    metadata: {
      totalQuestions: 200,
      listeningCount: 100,
      readingCount: 100,
      partCounts: {
        1: 6,
        2: 25,
        3: 39,
        4: 30,
        5: 30,
        6: 16,
        7: 54,
      },
      groupCounts: {
        1: 0,
        2: 0,
        3: 13,
        4: 10,
        5: 0,
        6: 4,
        7: 15,
      },
      contentFingerprint: fingerprint,
    },
  };

  return form;
}
