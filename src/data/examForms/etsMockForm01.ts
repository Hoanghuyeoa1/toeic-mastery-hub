/**
 * TOEIC Mastery Hub — Canonical Exam Form: ETS Mock Test 01
 * Phase 9: ExamForm Assembly & Media Readiness
 *
 * Full-length 200-question mock exam form adhering to ETS canonical blueprint:
 * - Listening: 100 questions (P1: 6, P2: 25, P3: 39 / 13 groups, P4: 30 / 10 groups)
 * - Reading: 100 questions (P5: 30, P6: 16 / 4 groups, P7: 54 / 15 groups [10 single, 5 multiple])
 * - Total: Exactly 200 questions in sequential order (1 to 200), exactly 42 groups
 * - Media: 100% SVG illustrations & transcripts present; simulation-ready via Web Speech API
 */

import { ExamForm, ExamQuestionRef, ExamGroupRef } from '../../types/mockExam';
import { calculateContentFingerprint } from '../../utils/examBlueprintValidator';
import { PART1_QUESTIONS } from '../questionBank/part1Listening';
import { PART2_QUESTIONS } from '../questionBank/part2Listening';
import { PART3_GROUPS } from '../questionBank/part3Listening';
import { PART4_GROUPS } from '../questionBank/part4Listening';
import { PART5_QUESTIONS } from '../questionBank/part5Reading';
import { PART6_GROUPS } from '../questionBank/part6Reading';
import {
  PART7_SINGLE_GROUPS,
  PART7_MULTI_GROUPS,
} from '../questionBank/part7Reading';

export function buildCanonicalExamForm01(): ExamForm {
  const questions: ExamQuestionRef[] = [];
  const groups: ExamGroupRef[] = [];

  let globalQNum = 1;

  // --------------------------------------------------------------------------
  // LISTENING SECTION (Q1 - Q100)
  // --------------------------------------------------------------------------

  // Part 1: Q1 - Q6 (6 Photographs)
  for (let i = 0; i < 6; i++) {
    const q = PART1_QUESTIONS[i];
    questions.push({
      globalQuestionNumber: globalQNum++,
      partNum: 1,
      section: 'listening',
      questionId: q.id,
      expectedOptionsCount: 4,
    });
  }

  // Part 2: Q7 - Q31 (25 Question-Response)
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

  // Part 3: Q32 - Q70 (13 Conversation Groups × 3 = 39 questions)
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

  // Part 4: Q71 - Q100 (10 Short Talk Groups × 3 = 30 questions)
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

  // --------------------------------------------------------------------------
  // READING SECTION (Q101 - Q200)
  // --------------------------------------------------------------------------

  // Part 5: Q101 - Q130 (30 Incomplete Sentences)
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

  // Part 6: Q131 - Q146 (4 Text Completion Groups × 4 = 16 questions)
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

  // Part 7 Single: Q147 - Q175 (10 Groups, 29 questions)
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

  // Part 7 Multiple: Q176 - Q200 (5 Groups × 5 = 25 questions: 2 Double, 3 Triple)
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

  return {
    id: 'ets-mock-form-01',
    title: 'ETS TOEIC Official Practice Test 2026 — Simulation Form 01',
    code: 'ETS-2026-SIM-01',
    schemaVersion: '1.0.0',
    contentRevision: 1,
    createdAt: '2026-10-09T00:00:00.000Z',
    updatedAt: '2026-10-09T00:00:00.000Z',
    blueprintId: 'ets_standard_blueprint',
    questions,
    groups,
    media: {
      audioMode: 'tts_simulation',
      hasVisuals: true,
      illustrationsCount: 8, // 6 Part 1 SVG photos + 1 flight schedule + 1 store directory
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
}

export const CANONICAL_ETS_EXAM_FORM_01: ExamForm = buildCanonicalExamForm01();
