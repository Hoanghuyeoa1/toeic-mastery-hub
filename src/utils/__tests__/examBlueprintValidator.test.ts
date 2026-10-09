/**
 * TOEIC Mastery Hub — Exam Blueprint & Form Validation Tests (Phase 1)
 *
 * Comprehensive targeted unit tests verifying the ETS Exam Blueprint and Form Validator:
 * 1. Canonical Blueprint Specification (200 Qs, 120m, P1-P7 counts and timing bounds)
 * 2. Fully compliant 200-question Mock Exam Form structure
 * 3. Total question count violations (199 Qs, 201 Qs, empty)
 * 4. Sequential numbering (1-200) and duplicate Question ID detection
 * 5. Part distribution and expected option counts (Part 2 has 3, others have 4)
 * 6. Group cardinality and contiguous integrity (P3=3, P4=3, P6=4, no splitting)
 * 7. Part 7 Single (10 passages / 29 Qs, 2-4 each) vs Multiple (5 groups x 5 = 25 Qs)
 * 8. Schema versioning compatibility and root structure guards
 * 9. Content linkage validation against Question Bank (valid refs, missing refs, key bounds)
 */

import {
  ETS_STANDARD_EXAM_BLUEPRINT,
  ETS_CANONICAL_PART_BOUNDS,
  validateExamFormStructure,
  validateExamFormContentLinks,
  validateExamForm,
  calculateContentFingerprint,
} from '../examBlueprintValidator';
import {
  ExamForm,
  ExamQuestionRef,
  ExamGroupRef,
} from '../../types/mockExam';
import {
  Question,
  QuestionGroup,
} from '../../types/questionBank';

// Test runner infrastructure matching repository standard
let totalAssertions = 0;
let passedAssertions = 0;
let failedAssertions = 0;

function assert(condition: boolean, message: string): void {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedAssertions++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

function runSuite(name: string, fn: () => void): void {
  console.log(`\n--- ${name} ---`);
  fn();
}

console.log('======================================================');
console.log('🧪 RUNNING EXAM BLUEPRINT VALIDATION TESTS (PHASE 1)');
console.log('======================================================');

// ============================================================================
// HELPER: BUILD FULLY COMPLIANT 200-QUESTION SYNTHETIC FORM
// ============================================================================

function createCompliantExamForm(): ExamForm {
  const questions: ExamQuestionRef[] = [];
  const groups: ExamGroupRef[] = [];

  // Part 1: Q1 - Q6 (6 standalone questions)
  for (let i = 1; i <= 6; i++) {
    questions.push({
      globalQuestionNumber: i,
      partNum: 1,
      section: 'listening',
      questionId: `mock-p1-${String(i).padStart(3, '0')}`,
      expectedOptionsCount: 4,
    });
  }

  // Part 2: Q7 - Q31 (25 standalone questions, 3 options)
  for (let i = 7; i <= 31; i++) {
    questions.push({
      globalQuestionNumber: i,
      partNum: 2,
      section: 'listening',
      questionId: `mock-p2-${String(i - 6).padStart(3, '0')}`,
      expectedOptionsCount: 3,
    });
  }

  // Part 3: Q32 - Q70 (13 groups × 3 = 39 questions)
  let p3Q = 32;
  for (let g = 1; g <= 13; g++) {
    const grpId = `mock-grp-p3-${String(g).padStart(3, '0')}`;
    const qIds: string[] = [];
    const startQ = p3Q;

    for (let ord = 1; ord <= 3; ord++) {
      const qid = `mock-p3-${String(p3Q - 31).padStart(3, '0')}`;
      qIds.push(qid);
      questions.push({
        globalQuestionNumber: p3Q,
        partNum: 3,
        section: 'listening',
        questionId: qid,
        groupId: grpId,
        orderInGroup: ord,
        expectedOptionsCount: 4,
      });
      p3Q++;
    }

    groups.push({
      groupId: grpId,
      partNum: 3,
      startQuestionNumber: startQ,
      endQuestionNumber: p3Q - 1,
      questionIds: qIds,
      groupType: 'part3_conversation',
    });
  }

  // Part 4: Q71 - Q100 (10 groups × 3 = 30 questions)
  let p4Q = 71;
  for (let g = 1; g <= 10; g++) {
    const grpId = `mock-grp-p4-${String(g).padStart(3, '0')}`;
    const qIds: string[] = [];
    const startQ = p4Q;

    for (let ord = 1; ord <= 3; ord++) {
      const qid = `mock-p4-${String(p4Q - 70).padStart(3, '0')}`;
      qIds.push(qid);
      questions.push({
        globalQuestionNumber: p4Q,
        partNum: 4,
        section: 'listening',
        questionId: qid,
        groupId: grpId,
        orderInGroup: ord,
        expectedOptionsCount: 4,
      });
      p4Q++;
    }

    groups.push({
      groupId: grpId,
      partNum: 4,
      startQuestionNumber: startQ,
      endQuestionNumber: p4Q - 1,
      questionIds: qIds,
      groupType: 'part4_talk',
    });
  }

  // Part 5: Q101 - Q130 (30 standalone questions)
  for (let i = 101; i <= 130; i++) {
    questions.push({
      globalQuestionNumber: i,
      partNum: 5,
      section: 'reading',
      questionId: `mock-p5-${String(i - 100).padStart(3, '0')}`,
      expectedOptionsCount: 4,
    });
  }

  // Part 6: Q131 - Q146 (4 groups × 4 = 16 questions)
  let p6Q = 131;
  for (let g = 1; g <= 4; g++) {
    const grpId = `mock-grp-p6-${String(g).padStart(3, '0')}`;
    const qIds: string[] = [];
    const startQ = p6Q;

    for (let ord = 1; ord <= 4; ord++) {
      const qid = `mock-p6-${String(p6Q - 130).padStart(3, '0')}`;
      qIds.push(qid);
      questions.push({
        globalQuestionNumber: p6Q,
        partNum: 6,
        section: 'reading',
        questionId: qid,
        groupId: grpId,
        orderInGroup: ord,
        expectedOptionsCount: 4,
      });
      p6Q++;
    }

    groups.push({
      groupId: grpId,
      partNum: 6,
      startQuestionNumber: startQ,
      endQuestionNumber: p6Q - 1,
      questionIds: qIds,
      groupType: 'part6_text_completion',
    });
  }

  // Part 7 Single Passages: Q147 - Q175 (10 passages / 29 questions)
  // Distribution: 3, 3, 3, 3, 3, 3, 3, 3, 2, 3 = 29 questions
  const singleDistribution = [3, 3, 3, 3, 3, 3, 3, 3, 2, 3];
  let p7SingleQ = 147;
  for (let g = 1; g <= 10; g++) {
    const qCount = singleDistribution[g - 1];
    const grpId = `mock-grp-p7-single-${String(g).padStart(3, '0')}`;
    const qIds: string[] = [];
    const startQ = p7SingleQ;

    for (let ord = 1; ord <= qCount; ord++) {
      const qid = `mock-p7-single-${String(p7SingleQ - 146).padStart(3, '0')}`;
      qIds.push(qid);
      questions.push({
        globalQuestionNumber: p7SingleQ,
        partNum: 7,
        section: 'reading',
        questionId: qid,
        groupId: grpId,
        orderInGroup: ord,
        expectedOptionsCount: 4,
      });
      p7SingleQ++;
    }

    groups.push({
      groupId: grpId,
      partNum: 7,
      startQuestionNumber: startQ,
      endQuestionNumber: p7SingleQ - 1,
      questionIds: qIds,
      passageFormat: 'single',
      groupType: 'part7_reading_comprehension',
    });
  }

  // Part 7 Multiple Passages: Q176 - Q200 (5 groups × 5 = 25 questions)
  // Format: 2 Double, 3 Triple
  const multipleFormats: Array<'double' | 'triple'> = ['double', 'double', 'triple', 'triple', 'triple'];
  let p7MultipleQ = 176;
  for (let g = 1; g <= 5; g++) {
    const format = multipleFormats[g - 1];
    const grpId = `mock-grp-p7-mult-${String(g).padStart(3, '0')}`;
    const qIds: string[] = [];
    const startQ = p7MultipleQ;

    for (let ord = 1; ord <= 5; ord++) {
      const qid = `mock-p7-mult-${String(p7MultipleQ - 175).padStart(3, '0')}`;
      qIds.push(qid);
      questions.push({
        globalQuestionNumber: p7MultipleQ,
        partNum: 7,
        section: 'reading',
        questionId: qid,
        groupId: grpId,
        orderInGroup: ord,
        expectedOptionsCount: 4,
      });
      p7MultipleQ++;
    }

    groups.push({
      groupId: grpId,
      partNum: 7,
      startQuestionNumber: startQ,
      endQuestionNumber: p7MultipleQ - 1,
      questionIds: qIds,
      passageFormat: format,
      groupType: 'part7_reading_comprehension',
    });
  }

  const allQIds = questions.map((q) => q.questionId);

  return {
    id: 'exam-form-ets-mock-01',
    title: 'TOEIC Full Simulation Test Form 01',
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
      illustrationsCount: 6,
    },
    metadata: {
      totalQuestions: 200,
      listeningCount: 100,
      readingCount: 100,
      partCounts: { 1: 6, 2: 25, 3: 39, 4: 30, 5: 30, 6: 16, 7: 54 },
      groupCounts: { 1: 0, 2: 0, 3: 13, 4: 10, 5: 0, 6: 4, 7: 15 },
      contentFingerprint: calculateContentFingerprint(allQIds),
    },
  };
}

// ============================================================================
// SUITE 1: Canonical Blueprint Specification Integrity
// ============================================================================
runSuite('Suite 1: Canonical Blueprint Specification Integrity', () => {
  const bp = ETS_STANDARD_EXAM_BLUEPRINT;

  assert(bp.totalQuestions === 200, '1.1 Blueprint specifies exactly 200 questions');
  assert(bp.totalDurationMinutes === 120, '1.1 Blueprint duration is exactly 120 minutes');
  assert(bp.totalDurationSeconds === 7200, '1.1 Blueprint duration is 7200 seconds');

  // Listening Section
  const l = bp.sections.listening;
  assert(l.totalQuestions === 100, '1.2 Listening total is 100 questions');
  assert(l.durationMinutes === 45, '1.2 Listening duration is 45 minutes');
  assert(l.questionRange.start === 1 && l.questionRange.end === 100, '1.2 Listening spans Q1 - Q100');
  assert(l.parts[1].questionCount === 6, '1.2 Part 1 has 6 questions');
  assert(l.parts[2].questionCount === 25, '1.2 Part 2 has 25 questions');
  assert(l.parts[3].questionCount === 39, '1.2 Part 3 has 39 questions');
  assert(l.parts[4].questionCount === 30, '1.2 Part 4 has 30 questions');

  // Reading Section
  const r = bp.sections.reading;
  assert(r.totalQuestions === 100, '1.3 Reading total is 100 questions');
  assert(r.durationMinutes === 75, '1.3 Reading duration is 75 minutes');
  assert(r.questionRange.start === 101 && r.questionRange.end === 200, '1.3 Reading spans Q101 - Q200');
  assert(r.parts[5].questionCount === 30, '1.3 Part 5 has 30 questions');
  assert(r.parts[6].questionCount === 16, '1.3 Part 6 has 16 questions');

  // Part 7 Detailed Split
  const p7 = r.parts[7] as unknown as {
    questionCount: number;
    singlePassages: { passageCount: number; questionCount: number };
    multiplePassages: { groupCount: number; questionCount: number };
  };
  assert(p7.questionCount === 54, '1.4 Part 7 has 54 questions total');
  assert(p7.singlePassages.passageCount === 10, '1.4 Part 7 has 10 single passages');
  assert(p7.singlePassages.questionCount === 29, '1.4 Part 7 single passages total 29 questions');
  assert(p7.multiplePassages.groupCount === 5, '1.4 Part 7 has 5 multiple passage groups');
  assert(p7.multiplePassages.questionCount === 25, '1.4 Part 7 multiple passages total 25 questions');
});

// ============================================================================
// SUITE 2: Valid 200-Question Exam Form Verification
// ============================================================================
runSuite('Suite 2: Valid 200-Question Exam Form Verification', () => {
  const form = createCompliantExamForm();
  const report = validateExamFormStructure(form);

  assert(report.isValid, '2.1 Compliant Exam Form is valid');
  assert(report.errors.length === 0, '2.1 Compliant Form has 0 errors');
  assert(report.stats.totalQuestions === 200, '2.2 Total questions count is 200');
  assert(report.stats.listeningQuestions === 100, '2.2 Listening questions count is 100');
  assert(report.stats.readingQuestions === 100, '2.2 Reading questions count is 100');
  assert(report.stats.partCounts[1] === 6, '2.3 Part 1 has 6 questions');
  assert(report.stats.partCounts[2] === 25, '2.3 Part 2 has 25 questions');
  assert(report.stats.partCounts[3] === 39, '2.3 Part 3 has 39 questions');
  assert(report.stats.partCounts[4] === 30, '2.3 Part 4 has 30 questions');
  assert(report.stats.partCounts[5] === 30, '2.3 Part 5 has 30 questions');
  assert(report.stats.partCounts[6] === 16, '2.3 Part 6 has 16 questions');
  assert(report.stats.partCounts[7] === 54, '2.3 Part 7 has 54 questions');
  assert(report.stats.groupCounts[3] === 13, '2.4 Part 3 has 13 groups');
  assert(report.stats.groupCounts[4] === 10, '2.4 Part 4 has 10 groups');
  assert(report.stats.groupCounts[6] === 4, '2.4 Part 6 has 4 groups');
  assert(report.stats.part7SinglePassages === 10, '2.5 Part 7 has 10 single passages');
  assert(report.stats.part7SingleQuestions === 29, '2.5 Part 7 has 29 single passage questions');
  assert(report.stats.part7MultipleGroups === 5, '2.5 Part 7 has 5 multiple groups');
  assert(report.stats.part7MultipleQuestions === 25, '2.5 Part 7 has 25 multiple passage questions');
});

// ============================================================================
// SUITE 3: Total Question Count Violations (199, 201, 0)
// ============================================================================
runSuite('Suite 3: Total Question Count Violations', () => {
  // 199 questions (missing 1 question)
  const form199 = createCompliantExamForm();
  form199.questions.pop(); // Remove Q200
  const report199 = validateExamFormStructure(form199);
  assert(!report199.isValid, '3.1 199-question form is rejected');
  assert(
    report199.errors.some((e) => e.code === 'INVALID_TOTAL_QUESTIONS'),
    '3.1 Emits INVALID_TOTAL_QUESTIONS error'
  );

  // 201 questions (extra question added)
  const form201 = createCompliantExamForm();
  form201.questions.push({
    globalQuestionNumber: 201,
    partNum: 7,
    section: 'reading',
    questionId: 'mock-p7-extra',
    expectedOptionsCount: 4,
  });
  const report201 = validateExamFormStructure(form201);
  assert(!report201.isValid, '3.2 201-question form is rejected');
  assert(
    report201.errors.some((e) => e.code === 'INVALID_TOTAL_QUESTIONS'),
    '3.2 Emits INVALID_TOTAL_QUESTIONS error for 201 items'
  );

  // Empty questions array
  const emptyForm = { ...createCompliantExamForm(), questions: [] };
  const reportEmpty = validateExamFormStructure(emptyForm);
  assert(!reportEmpty.isValid, '3.3 Empty questions array is rejected');
});

// ============================================================================
// SUITE 4: Sequential Numbering & Duplicate Question IDs
// ============================================================================
runSuite('Suite 4: Sequential Numbering & Duplicate Question IDs', () => {
  // Out-of-order numbering
  const formOutOfOrder = createCompliantExamForm();
  formOutOfOrder.questions[4].globalQuestionNumber = 99; // Q5 altered
  const reportOrder = validateExamFormStructure(formOutOfOrder);
  assert(!reportOrder.isValid, '4.1 Out-of-order globalQuestionNumber is rejected');
  assert(
    reportOrder.errors.some((e) => e.code === 'INVALID_QUESTION_NUMBERING'),
    '4.1 Emits INVALID_QUESTION_NUMBERING error'
  );

  // Duplicate Question ID within form
  const formDup = createCompliantExamForm();
  formDup.questions[15].questionId = formDup.questions[0].questionId; // Q16 steals Q1's ID
  const reportDup = validateExamFormStructure(formDup);
  assert(!reportDup.isValid, '4.2 Duplicate question ID is rejected');
  assert(
    reportDup.errors.some((e) => e.code === 'DUPLICATE_QUESTION_ID'),
    '4.2 Emits DUPLICATE_QUESTION_ID error'
  );
  const dupErr = reportDup.errors.find((e) => e.code === 'DUPLICATE_QUESTION_ID');
  assert(dupErr?.globalQuestionNumber === 16, '4.2 Pinpoints duplicate question position (#16)');
});

// ============================================================================
// SUITE 5: Part Distribution & Option Count Violations
// ============================================================================
runSuite('Suite 5: Part Distribution & Option Count Violations', () => {
  // Part 1 with 7 questions and Part 2 with 24 questions (shifted boundary)
  const formSkewed = createCompliantExamForm();
  formSkewed.questions[6].partNum = 1; // Q7 turned into Part 1
  const reportSkewed = validateExamFormStructure(formSkewed);
  assert(!reportSkewed.isValid, '5.1 Boundary-shifted Part counts are rejected');
  assert(
    reportSkewed.errors.some((e) => e.code === 'INVALID_PART_COUNT'),
    '5.1 Emits INVALID_PART_COUNT error'
  );

  // Part 2 question erroneously specifying 4 choices
  const formP2WrongChoices = createCompliantExamForm();
  formP2WrongChoices.questions[10].expectedOptionsCount = 4; // Q11 (Part 2) has 4 choices
  const reportChoices = validateExamFormStructure(formP2WrongChoices);
  assert(!reportChoices.isValid, '5.2 Part 2 with 4 options is rejected');
  assert(
    reportChoices.errors.some((e) => e.code === 'INVALID_OPTIONS_COUNT_SPEC'),
    '5.2 Emits INVALID_OPTIONS_COUNT_SPEC error'
  );

  // Standalone Part 5 question illegally assigned a groupId
  const formP5Grouped = createCompliantExamForm();
  formP5Grouped.questions[105].groupId = 'rogue-group-id'; // Q106
  const reportP5 = validateExamFormStructure(formP5Grouped);
  assert(!reportP5.isValid, '5.3 Grouped question in Part 5 standalone is rejected');
  assert(
    reportP5.errors.some((e) => e.code === 'UNEXPECTED_GROUP_IN_STANDALONE_PART'),
    '5.3 Emits UNEXPECTED_GROUP_IN_STANDALONE_PART error'
  );
});

// ============================================================================
// SUITE 6: Group Cardinality & Contiguous Integrity
// ============================================================================
runSuite('Suite 6: Group Cardinality & Contiguous Integrity', () => {
  // Part 3 group with only 2 questions instead of 3
  const formP3InvalidGroup = createCompliantExamForm();
  formP3InvalidGroup.groups[0].questionIds = [
    formP3InvalidGroup.groups[0].questionIds[0],
    formP3InvalidGroup.groups[0].questionIds[1],
  ]; // Cut from 3 to 2
  formP3InvalidGroup.groups[0].endQuestionNumber = formP3InvalidGroup.groups[0].startQuestionNumber + 1;
  const reportP3 = validateExamFormStructure(formP3InvalidGroup);
  assert(!reportP3.isValid, '6.1 Part 3 group with 2 questions is rejected');
  assert(
    reportP3.errors.some((e) => e.code === 'INVALID_GROUP_CARDINALITY'),
    '6.1 Emits INVALID_GROUP_CARDINALITY error'
  );

  // Part 6 group with 5 questions instead of 4
  const formP6InvalidGroup = createCompliantExamForm();
  formP6InvalidGroup.groups[23].questionIds.push('extra-p6-q');
  formP6InvalidGroup.groups[23].endQuestionNumber += 1;
  const reportP6 = validateExamFormStructure(formP6InvalidGroup);
  assert(!reportP6.isValid, '6.2 Part 6 group with 5 questions is rejected');
  assert(
    reportP6.errors.some((e) => e.code === 'INVALID_GROUP_CARDINALITY'),
    '6.2 Emits INVALID_GROUP_CARDINALITY for Part 6'
  );

  // Split group: Question inside group references another groupId
  const formSplit = createCompliantExamForm();
  formSplit.questions[33].groupId = 'alien-grp-id'; // Question #34 inside group 1
  const reportSplit = validateExamFormStructure(formSplit);
  assert(!reportSplit.isValid, '6.3 Split group linkage mismatch is rejected');
  assert(
    reportSplit.errors.some((e) => e.code === 'GROUP_TWO_WAY_LINK_MISMATCH'),
    '6.3 Emits GROUP_TWO_WAY_LINK_MISMATCH error'
  );

  // Duplicate group ID
  const formDupGrp = createCompliantExamForm();
  formDupGrp.groups[1].groupId = formDupGrp.groups[0].groupId;
  const reportDupGrp = validateExamFormStructure(formDupGrp);
  assert(!reportDupGrp.isValid, '6.4 Duplicate groupId is rejected');
  assert(
    reportDupGrp.errors.some((e) => e.code === 'DUPLICATE_GROUP_ID'),
    '6.4 Emits DUPLICATE_GROUP_ID error'
  );
});

// ============================================================================
// SUITE 7: Part 7 Single vs Multiple Passages Distribution
// ============================================================================
runSuite('Suite 7: Part 7 Single vs Multiple Passages Distribution', () => {
  // Part 7 Single Passage having 5 questions (exceeds 2-4 rule)
  const formP7OverSingle = createCompliantExamForm();
  // Group at index 27 is single passage 1
  formP7OverSingle.groups[27].questionIds.push('extra-p7-q', 'extra-p7-q2'); // 3 -> 5 questions
  formP7OverSingle.groups[27].endQuestionNumber += 2;
  const reportP7Over = validateExamFormStructure(formP7OverSingle);
  assert(!reportP7Over.isValid, '7.1 Single passage with 5 questions is rejected');
  assert(
    reportP7Over.errors.some((e) => e.code === 'PART7_SINGLE_CARDINALITY_OUT_OF_BOUNDS'),
    '7.1 Emits PART7_SINGLE_CARDINALITY_OUT_OF_BOUNDS error'
  );

  // Part 7 Multiple group with format 'single'
  const formP7WrongFormat = createCompliantExamForm();
  // Group at index 37 is multiple passage 1
  formP7WrongFormat.groups[37].passageFormat = 'single';
  const reportP7Fmt = validateExamFormStructure(formP7WrongFormat);
  assert(!reportP7Fmt.isValid, '7.2 Multiple passage group labeled "single" is rejected');
  assert(
    reportP7Fmt.errors.some((e) => e.code === 'PART7_MULTIPLE_FORMAT_MISMATCH'),
    '7.2 Emits PART7_MULTIPLE_FORMAT_MISMATCH error'
  );

  // Group crossing single/multiple boundary (175/176)
  const formCrossing = createCompliantExamForm();
  formCrossing.groups[36].startQuestionNumber = 174;
  formCrossing.groups[36].endQuestionNumber = 177;
  const reportCross = validateExamFormStructure(formCrossing);
  assert(!reportCross.isValid, '7.3 Group crossing 175/176 boundary is rejected');
  assert(
    reportCross.errors.some((e) => e.code === 'PART7_GROUP_BOUNDARY_CROSSING'),
    '7.3 Emits PART7_GROUP_BOUNDARY_CROSSING error'
  );
});

// ============================================================================
// SUITE 8: Schema Version Incompatibility & Root Guards
// ============================================================================
runSuite('Suite 8: Schema Version Incompatibility & Root Guards', () => {
  // Incompatible schema major version '2.0.0'
  const formV2 = { ...createCompliantExamForm(), schemaVersion: '2.0.0' };
  const reportV2 = validateExamFormStructure(formV2);
  assert(!reportV2.isValid, '8.1 Incompatible schema version 2.0.0 is rejected');
  assert(
    reportV2.errors.some((e) => e.code === 'INCOMPATIBLE_SCHEMA_VERSION'),
    '8.1 Emits INCOMPATIBLE_SCHEMA_VERSION error'
  );

  // Invalid root object
  const reportNull = validateExamFormStructure(null);
  assert(!reportNull.isValid, '8.2 Null root object is rejected');
  assert(reportNull.errors.some((e) => e.code === 'INVALID_ROOT_OBJECT'), '8.2 Emits INVALID_ROOT_OBJECT');

  // Invalid content revision (0)
  const formRev0 = { ...createCompliantExamForm(), contentRevision: 0 };
  const reportRev0 = validateExamFormStructure(formRev0);
  assert(!reportRev0.isValid, '8.3 contentRevision 0 is rejected');
  assert(reportRev0.errors.some((e) => e.code === 'INVALID_CONTENT_REVISION'), '8.3 Emits INVALID_CONTENT_REVISION');
});

// ============================================================================
// SUITE 9: Content Linkage Validation with Mock Question Bank Lookup
// ============================================================================
runSuite('Suite 9: Content Linkage Validation with Question Bank', () => {
  const form = createCompliantExamForm();

  // Create synthetic lookup with all questions and groups from the compliant form
  const mockQuestions = new Map<string, Question>();
  form.questions.forEach((q) => {
    mockQuestions.set(q.questionId, {
      id: q.questionId,
      partNum: q.partNum,
      part: `Part ${q.partNum}` as any,
      section: q.section,
      difficulty: 'medium',
      topic: 'General Business',
      explanation: 'Detailed explanation text',
      skillTag: 'Mock Skill Tag',
      groupId: q.groupId,
      orderInGroup: q.orderInGroup,
      options: (q.partNum === 2
        ? [{ key: 'A', text: '1' }, { key: 'B', text: '2' }, { key: 'C', text: '3' }]
        : [{ key: 'A', text: '1' }, { key: 'B', text: '2' }, { key: 'C', text: '3' }, { key: 'D', text: '4' }]) as any,
      correctKey: 'A',
    } as Question);
  });

  const mockGroups = new Map<string, QuestionGroup>();
  form.groups.forEach((g) => {
    mockGroups.set(g.groupId, {
      id: g.groupId,
      partNum: g.partNum,
      groupType: g.groupType,
      difficulty: 'medium',
      topic: 'Business',
      questionIds: g.questionIds,
    } as QuestionGroup);
  });

  const validLookup = {
    getQuestion: (id: string) => mockQuestions.get(id),
    getGroup: (id: string) => mockGroups.get(id),
  };

  // Valid linkages
  const validReport = validateExamFormContentLinks(form, validLookup);
  assert(validReport.isValid, '9.1 Valid content linkages pass with 0 errors');
  assert(validReport.errors.length === 0, '9.1 No errors emitted for matching bank entities');

  // Missing question in bank
  const missingQForm = createCompliantExamForm();
  missingQForm.questions[0].questionId = 'non-existent-q-id';
  const reportMissingQ = validateExamFormContentLinks(missingQForm, validLookup);
  assert(!reportMissingQ.isValid, '9.2 Non-existent questionId in Question Bank is rejected');
  assert(
    reportMissingQ.errors.some((e) => e.code === 'MISSING_QUESTION_BANK_REF'),
    '9.2 Emits MISSING_QUESTION_BANK_REF error'
  );

  // Missing group in bank
  const missingGrpForm = createCompliantExamForm();
  missingGrpForm.groups[0].groupId = 'non-existent-grp-id';
  const reportMissingGrp = validateExamFormContentLinks(missingGrpForm, validLookup);
  assert(!reportMissingGrp.isValid, '9.3 Non-existent groupId in Question Bank is rejected');
  assert(
    reportMissingGrp.errors.some((e) => e.code === 'MISSING_GROUP_BANK_REF'),
    '9.3 Emits MISSING_GROUP_BANK_REF error'
  );

  // Combined validateExamForm helper
  const combinedReport = validateExamForm(form, { lookup: validLookup });
  assert(combinedReport.isValid, '9.4 Combined validateExamForm succeeds for valid form & lookup');

  // Deterministic content fingerprint check
  const fp1 = calculateContentFingerprint(['q-001', 'q-002', 'q-003']);
  const fp2 = calculateContentFingerprint(['q-001', 'q-002', 'q-003']);
  const fp3 = calculateContentFingerprint(['q-001', 'q-003', 'q-002']);
  assert(fp1 === fp2, '9.5 Fingerprint is deterministic and identical for same question sequence');
  assert(fp1 !== fp3, '9.5 Fingerprint differs when question ordering changes');
});

// ============================================================================
// SUMMARY REPORT
// ============================================================================
console.log('\n======================================================');
console.log(`TOTAL TESTS RUN: ${totalAssertions}`);
console.log(`PASSED: ${passedAssertions}`);
console.log(`FAILED: ${failedAssertions}`);
console.log('======================================================');

if (failedAssertions > 0) {
  process.exit(1);
}
