/**
 * TOEIC Mastery Hub — Exam Reading Workspace Targeted Contract Tests (Phase 15)
 *
 * Comprehensive test suite verifying Reading Exam Workspace (Questions 101–200):
 * - Suite 1: Part 5 Incomplete Sentences Contracts (Q101–Q130, blanks, 4 choices, prompt concealment).
 * - Suite 2: Part 6 Text Completion Group Integrity & Blank Mapping (Q131–Q146, 4 groups, [131]..[146]).
 * - Suite 3: Part 7 Reading Comprehension Formats & Multi-Passage Linkages (Q147–Q200, Single/Double/Triple).
 * - Suite 4: Reading Session Free Navigation (101–200 unrestricted bounds, currentPart sync).
 * - Suite 5: Strict Mode Boundary Enforcement (Reading -> Listening locked, transparent error codes).
 * - Suite 6: Answer Persistence, Editing & Flag Management (immutability, override, unanswered empty).
 * - Suite 7: Submission Safeguards & Entry Finalization (audit stats, safe finalize, double-submit guard).
 * - Suite 8: Reading Wall-Clock Timer Expiration & Auto-Submit (75m timeout evaluation).
 */

import { CANONICAL_ETS_EXAM_FORM_01 } from '../../data/examForms/etsMockForm01';
import {
  createExamSession,
  startExam,
  transitionToReading,
  recordExamAnswer,
  toggleQuestionFlag,
  navigateToQuestion,
  submitExam,
  evaluateSessionTimeouts,
} from '../examSessionEngine';
import {
  getQuestionById,
  getQuestionGroupById,
  getQuestionsForGroup,
} from '../questionBankLookup';
import {
  Part5Question,
  Part6Group,
  Part6Question,
  Part7Group,
  Part7Question,
  StandardChoiceKey,
} from '../../types/questionBank';
import { EXAM_ANSWER_SHEET_PARTS } from '../../types/examWorkspace';

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passedCount++;
    console.log(`  ✓ [PASS] ${message}`);
  } else {
    failedCount++;
    console.error(`  ✗ [FAIL] ${message}`);
  }
}

function suite(name: string) {
  console.log(`\n--- ${name} ---`);
}

console.log('================================================================');
console.log('RUNNING PHASE 15: READING EXAM WORKSPACE CONTRACT TESTS');
console.log('================================================================');

const examForm = CANONICAL_ETS_EXAM_FORM_01;

// --------------------------------------------------------------------------
// SUITE 1: Part 5 Incomplete Sentences Contracts (Q101–Q130)
// --------------------------------------------------------------------------
suite('SUITE 1: Part 5 Incomplete Sentences Contracts (Q101–Q130)');

const part5Questions = examForm.questions.filter((q) => q.partNum === 5);
assert(part5Questions.length === 30, 'Part 5 contains exactly 30 questions in ExamForm');
assert(part5Questions[0].globalQuestionNumber === 101, 'Part 5 starts strictly at question 101');
assert(part5Questions[29].globalQuestionNumber === 130, 'Part 5 ends strictly at question 130');

for (const qRef of part5Questions) {
  const qData = getQuestionById(qRef.questionId) as Part5Question;
  assert(Boolean(qData), `Part 5 question ${qRef.globalQuestionNumber} (${qRef.questionId}) resolves in lookup`);
  assert(qData.partNum === 5, `Question ${qRef.globalQuestionNumber} has partNum === 5`);
  assert(qData.section === 'reading', `Question ${qRef.globalQuestionNumber} has section === 'reading'`);
  assert(typeof qData.sentence === 'string' && qData.sentence.length > 10, `Question ${qRef.globalQuestionNumber} has valid sentence`);
  assert(/_____|______|--{2,6}/.test(qData.sentence), `Question ${qRef.globalQuestionNumber} sentence contains blank marker`);
  assert(qData.options.length === 4, `Question ${qRef.globalQuestionNumber} has exactly 4 options A, B, C, D`);

  const keys = qData.options.map((o) => o.key);
  assert(
    keys[0] === 'A' && keys[1] === 'B' && keys[2] === 'C' && keys[3] === 'D',
    `Question ${qRef.globalQuestionNumber} options are strictly keyed [A, B, C, D]`
  );
  assert(qData.options.every((o) => o.text.trim().length > 0), `Question ${qRef.globalQuestionNumber} option texts are non-empty`);
}

// --------------------------------------------------------------------------
// SUITE 2: Part 6 Text Completion Group Integrity & Blank Mapping (Q131–Q146)
// --------------------------------------------------------------------------
suite('SUITE 2: Part 6 Text Completion Group Integrity & Blank Mapping (Q131–Q146)');

const part6Questions = examForm.questions.filter((q) => q.partNum === 6);
assert(part6Questions.length === 16, 'Part 6 contains exactly 16 questions in ExamForm');
assert(part6Questions[0].globalQuestionNumber === 131, 'Part 6 starts strictly at question 131');
assert(part6Questions[15].globalQuestionNumber === 146, 'Part 6 ends strictly at question 146');

// Group analysis
const part6Groups = examForm.groups.filter((g) => g.partNum === 6);
assert(part6Groups.length === 4, 'Part 6 consists of exactly 4 groups (4 × 4 = 16)');

for (const grpRef of part6Groups) {
  const grpData = getQuestionGroupById(grpRef.groupId) as Part6Group;
  assert(Boolean(grpData), `Part 6 group ${grpRef.groupId} resolves successfully`);
  assert(grpData.groupType === 'part6_text_completion', `Group ${grpRef.groupId} has groupType === 'part6_text_completion'`);
  assert(grpData.questionIds.length === 4, `Group ${grpRef.groupId} has strictly 4 linked question IDs`);
  assert(typeof grpData.passageContent === 'string' && grpData.passageContent.length > 50, `Group ${grpRef.groupId} has valid workplace passage content`);

  const groupQuestions = getQuestionsForGroup(grpRef.groupId) as Part6Question[];
  assert(groupQuestions.length === 4, `Group ${grpRef.groupId} yields exactly 4 question objects`);

  // Verify sequential blanks [131]..[146] in text
  for (const q of groupQuestions) {
    const blankPattern = new RegExp(`\\[${q.blankNumber}\\]`);
    assert(blankPattern.test(grpData.passageContent), `Group passage contains interactive blank marker [${q.blankNumber}]`);
    assert(q.options.length === 4, `Question ${q.id} (Blank ${q.blankNumber}) has 4 options A-D`);
    assert(q.partNum === 6, `Question ${q.id} has partNum === 6`);
    assert(['vocabulary', 'grammar', 'sentence_insertion'].includes(q.questionType), `Question ${q.id} has valid questionType (${q.questionType})`);
  }
}

// --------------------------------------------------------------------------
// SUITE 3: Part 7 Reading Comprehension Formats & Multi-Passage Linkages
// --------------------------------------------------------------------------
suite('SUITE 3: Part 7 Reading Comprehension Formats & Multi-Passage Linkages');

const part7Questions = examForm.questions.filter((q) => q.partNum === 7);
assert(part7Questions.length === 54, 'Part 7 contains exactly 54 questions in ExamForm');
assert(part7Questions[0].globalQuestionNumber === 147, 'Part 7 starts strictly at question 147');
assert(part7Questions[53].globalQuestionNumber === 200, 'Part 7 ends strictly at question 200');

const part7Groups = examForm.groups.filter((g) => g.partNum === 7);
assert(part7Groups.length === 15, 'Part 7 consists of exactly 15 groups (10 Single + 2 Double + 3 Triple)');

let singleGroupCount = 0;
let doubleGroupCount = 0;
let tripleGroupCount = 0;
let crossTextQuestionsCount = 0;

for (const grpRef of part7Groups) {
  const grpData = getQuestionGroupById(grpRef.groupId) as Part7Group;
  assert(Boolean(grpData), `Part 7 group ${grpRef.groupId} resolves successfully`);
  assert(grpData.groupType === 'part7_reading_comprehension', `Group ${grpRef.groupId} has groupType === 'part7_reading_comprehension'`);

  if (grpData.passageFormat === 'single') {
    singleGroupCount++;
    assert(grpData.passages.length === 1, `Single group ${grpRef.groupId} has exactly 1 passage`);
  } else if (grpData.passageFormat === 'double') {
    doubleGroupCount++;
    assert(grpData.passages.length === 2, `Double group ${grpRef.groupId} has exactly 2 passages`);
    assert(grpData.questionIds.length === 5, `Double group ${grpRef.groupId} has strictly 5 questions`);
  } else if (grpData.passageFormat === 'triple') {
    tripleGroupCount++;
    assert(grpData.passages.length === 3, `Triple group ${grpRef.groupId} has exactly 3 passages`);
    assert(grpData.questionIds.length === 5, `Triple group ${grpRef.groupId} has strictly 5 questions`);
  }

  // Verify passage text and question properties
  for (const passage of grpData.passages) {
    assert(typeof passage.content === 'string' && passage.content.length > 20, `Passage ${passage.id} has non-empty text content`);
  }

  const groupQuestions = getQuestionsForGroup(grpRef.groupId) as Part7Question[];
  for (const q of groupQuestions) {
    assert(typeof q.question === 'string' && q.question.length > 5, `Question ${q.id} has printed prompt`);
    assert(q.options.length === 4, `Question ${q.id} has 4 options A-D`);
    if (q.crossTextReference) {
      crossTextQuestionsCount++;
    }
  }
}

assert(singleGroupCount === 10, 'Part 7 has exactly 10 single passage groups');
assert(doubleGroupCount === 2, 'Part 7 has exactly 2 double passage groups');
assert(tripleGroupCount === 3, 'Part 7 has exactly 3 triple passage groups');
assert(crossTextQuestionsCount > 0, `Part 7 includes multi-text crossTextReference synthesis questions (found: ${crossTextQuestionsCount})`);

// --------------------------------------------------------------------------
// SUITE 4: Reading Session Free Navigation (101–200 Bounds)
// --------------------------------------------------------------------------
suite('SUITE 4: Reading Session Free Navigation (101–200 Bounds)');

function initReadingSession(mode: 'strict' | 'simulation'): ExamSession {
  const init = createExamSession({ mode }, examForm);
  return {
    ...init,
    status: 'reading',
    currentSection: 'reading',
    currentPart: 5,
    currentQuestionNumber: 101,
    readingDeadline: Date.now() + 75 * 60 * 1000,
  };
}

const readingSession = initReadingSession('strict');
assert(readingSession.status === 'reading', 'Session status is "reading"');
assert(readingSession.currentSection === 'reading', 'Session currentSection is "reading"');
assert(readingSession.currentQuestionNumber === 101, 'Reading starts at question 101');
assert(readingSession.currentPart === 5, 'Initial reading part is Part 5');

// Free navigation within Reading (101 to 200)
const navToPart5 = navigateToQuestion(readingSession, 115);
assert(navToPart5.success, 'Navigate to Part 5 Question 115 succeeds');
assert(navToPart5.session.currentQuestionNumber === 115, 'Current question is 115');
assert(navToPart5.session.currentPart === 5, 'Current part is 5');

const navToPart6 = navigateToQuestion(readingSession, 138);
assert(navToPart6.success, 'Navigate to Part 6 Question 138 succeeds');
assert(navToPart6.session.currentQuestionNumber === 138, 'Current question is 138');
assert(navToPart6.session.currentPart === 6, 'Current part is 6');

const navToPart7 = navigateToQuestion(readingSession, 185);
assert(navToPart7.success, 'Navigate to Part 7 Question 185 succeeds');
assert(navToPart7.session.currentQuestionNumber === 185, 'Current question is 185');
assert(navToPart7.session.currentPart === 7, 'Current part is 7');

const navToLast = navigateToQuestion(readingSession, 200);
assert(navToLast.success, 'Navigate to Question 200 succeeds');
assert(navToLast.session.currentQuestionNumber === 200, 'Current question is 200');

// Out of bounds test
const navTooHigh = navigateToQuestion(readingSession, 201);
assert(!navTooHigh.success, 'Navigate to 201 fails (out of bounds)');
assert(navTooHigh.code === 'INVALID_QUESTION_NUMBER', 'Rejection code is INVALID_QUESTION_NUMBER');

// --------------------------------------------------------------------------
// SUITE 5: Strict Mode Boundary Enforcement (Reading -> Listening Lock)
// --------------------------------------------------------------------------
suite('SUITE 5: Strict Mode Boundary Enforcement (Reading -> Listening Lock)');

// Attempting to navigate from reading back to listening in strict mode
const blockedNav1 = navigateToQuestion(readingSession, 50);
assert(!blockedNav1.success, 'Strict mode forbids navigating back to Question 50');
assert(blockedNav1.code === 'STRICT_NAVIGATION_BLOCKED', 'Error code is STRICT_NAVIGATION_BLOCKED');

const blockedNav2 = navigateToQuestion(readingSession, 1);
assert(!blockedNav2.success, 'Strict mode forbids navigating back to Question 1');
assert(blockedNav2.code === 'STRICT_NAVIGATION_BLOCKED', 'Error code is STRICT_NAVIGATION_BLOCKED');

const blockedNav3 = navigateToQuestion(readingSession, 100);
assert(!blockedNav3.success, 'Strict mode forbids navigating back to Question 100');
assert(blockedNav3.code === 'STRICT_NAVIGATION_BLOCKED', 'Error code is STRICT_NAVIGATION_BLOCKED');

// Attempting to modify answers in listening section while in reading
const blockedAnswer = recordExamAnswer(readingSession, 45, 'A');
assert(!blockedAnswer.success, 'Strict mode forbids modifying listening answer (Q45) in reading section');
assert(blockedAnswer.code === 'STRICT_SECTION_LOCKED', 'Error code is STRICT_SECTION_LOCKED');

// Attempting to modify flags in listening section while in reading
const blockedFlag = toggleQuestionFlag(readingSession, 45);
assert(!blockedFlag.success, 'Strict mode forbids toggling flag for listening (Q45) in reading section');
assert(blockedFlag.code === 'STRICT_SECTION_LOCKED', 'Error code is STRICT_SECTION_LOCKED');

// Simulation Mode comparison: Simulation allows navigating back to review
const simReading = initReadingSession('simulation');
const simAllowedNav = navigateToQuestion(simReading, 50);
assert(simAllowedNav.success, 'Simulation mode allows navigating back to question 50 for review');

// --------------------------------------------------------------------------
// SUITE 6: Answer Persistence, Editing & Flag Management
// --------------------------------------------------------------------------
suite('SUITE 6: Answer Persistence, Editing & Flag Management');

// Record answer in Part 5
let activeSession = readingSession;
const ansP5 = recordExamAnswer(activeSession, 105, 'B');
assert(ansP5.success, 'Record answer for Q105 as "B" succeeds');
activeSession = ansP5.session;
assert(activeSession.answers[105].selectedChoice === 'B', 'Q105 choice is "B"');

// Modify answer in Part 5 (Candidates can freely change their answers before submit)
const ansP5Mod = recordExamAnswer(activeSession, 105, 'D');
assert(ansP5Mod.success, 'Modify answer for Q105 to "D" succeeds');
activeSession = ansP5Mod.session;
assert(activeSession.answers[105].selectedChoice === 'D', 'Q105 choice successfully updated to "D"');

// Record answer in Part 6
const ansP6 = recordExamAnswer(activeSession, 133, 'A');
assert(ansP6.success, 'Record answer for Part 6 Q133 as "A" succeeds');
activeSession = ansP6.session;
assert(activeSession.answers[133].selectedChoice === 'A', 'Q133 choice is "A"');

// Record answer in Part 7
const ansP7 = recordExamAnswer(activeSession, 175, 'C');
assert(ansP7.success, 'Record answer for Part 7 Q175 as "C" succeeds');
activeSession = ansP7.session;
assert(activeSession.answers[175].selectedChoice === 'C', 'Q175 choice is "C"');

// Toggle flags in Reading
const flag105 = toggleQuestionFlag(activeSession, 105);
assert(flag105.success, 'Toggle flag for Q105 succeeds');
activeSession = flag105.session;
assert(activeSession.flaggedQuestions[105] === true, 'Q105 is flagged');

const unflag105 = toggleQuestionFlag(activeSession, 105);
assert(unflag105.success, 'Toggle flag for Q105 again succeeds');
activeSession = unflag105.session;
assert(activeSession.flaggedQuestions[105] === false, 'Q105 is unflagged');

// Verify unanswered questions remain null
assert(activeSession.answers[106].selectedChoice === null, 'Unanswered question 106 has selectedChoice === null');
assert(activeSession.answers[150].selectedChoice === null, 'Unanswered question 150 has selectedChoice === null');
assert(activeSession.answers[199].selectedChoice === null, 'Unanswered question 199 has selectedChoice === null');

// --------------------------------------------------------------------------
// SUITE 7: Submission Safeguards & Entry Finalization
// --------------------------------------------------------------------------
suite('SUITE 7: Submission Safeguards & Entry Finalization');

// Audit statistics
let answeredTotal = 0;
let unansweredTotal = 0;
let flaggedTotal = 0;

for (let i = 1; i <= 200; i++) {
  if (activeSession.answers[i]?.selectedChoice !== null) {
    answeredTotal++;
  } else {
    unansweredTotal++;
  }
  if (activeSession.flaggedQuestions[i]) {
    flaggedTotal++;
  }
}

assert(answeredTotal === 3, 'Accurately counted 3 answered questions (105, 133, 175)');
assert(unansweredTotal === 197, 'Accurately counted 197 unanswered questions');
assert(answeredTotal + unansweredTotal === 200, 'Sum of answered + unanswered strictly equals 200');

// Finalize submission from Reading
const submitRes = submitExam(activeSession, 'user_completed');
assert(submitRes.success, 'Submitting exam from Reading succeeds');
const submittedSession = submitRes.session;
assert(submittedSession.status === 'submitted', 'Status transitioned to "submitted"');
assert(typeof submittedSession.submittedAt === 'number', 'submittedAt timestamp is recorded');

// Permanent lock after submission
const postSubmitAnswer = recordExamAnswer(submittedSession, 105, 'A');
assert(!postSubmitAnswer.success, 'Modifying answer after submission fails');
assert(postSubmitAnswer.code === 'ANSWERS_LOCKED', 'Rejection code is ANSWERS_LOCKED');

const postSubmitFlag = toggleQuestionFlag(submittedSession, 105);
assert(!postSubmitFlag.success, 'Toggling flag after submission fails');
assert(postSubmitFlag.code === 'FLAGS_LOCKED', 'Rejection code is FLAGS_LOCKED');

const postSubmitDouble = submitExam(submittedSession, 'user_completed');
assert(!postSubmitDouble.success, 'Double-submitting fails');
assert(postSubmitDouble.code === 'ALREADY_SUBMITTED', 'Rejection code is ALREADY_SUBMITTED');

// --------------------------------------------------------------------------
// SUITE 8: Reading Wall-Clock Timer Expiration & Auto-Submit
// --------------------------------------------------------------------------
suite('SUITE 8: Reading Wall-Clock Timer Expiration & Auto-Submit');

// Simulate reading timer expiration
const expiredTime = (readingSession.readingDeadline ?? Date.now()) + 5000;
const timeoutEval = evaluateSessionTimeouts(readingSession, expiredTime);
assert(timeoutEval.success, 'evaluateSessionTimeouts successfully detects deadline expiry');
assert(timeoutEval.session.status === 'submitted', 'Expired reading session is automatically submitted');
assert(timeoutEval.session.submitReason === 'timeout_reading', 'Timeout submit reason recorded as timeout_reading');

// Conservation of 200 Answer Sheet partitions
assert(EXAM_ANSWER_SHEET_PARTS.length === 7, 'Answer Sheet defined for all 7 TOEIC parts');
const readingPartsMeta = EXAM_ANSWER_SHEET_PARTS.filter((p) => p.section === 'reading');
assert(readingPartsMeta.length === 3, 'Reading section has 3 parts (Part 5, 6, 7)');
assert(readingPartsMeta[0].partNum === 5 && readingPartsMeta[0].totalQuestions === 30, 'Part 5 has 30 questions');
assert(readingPartsMeta[1].partNum === 6 && readingPartsMeta[1].totalQuestions === 16, 'Part 6 has 16 questions');
assert(readingPartsMeta[2].partNum === 7 && readingPartsMeta[2].totalQuestions === 54, 'Part 7 has 54 questions');
const sumReadingQuestions = readingPartsMeta.reduce((acc, p) => acc + p.totalQuestions, 0);
assert(sumReadingQuestions === 100, 'Reading parts sum up to exactly 100 questions (101-200)');

console.log('\n================================================================');
console.log(`TOTAL TESTS RUN:    ${passedCount + failedCount}`);
console.log(`TOTAL TESTS PASSED: ${passedCount}`);
console.log(`TOTAL TESTS FAILED: ${failedCount}`);
console.log('================================================================');

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('\n🎉 ALL ASSERTIONS PASSED! Phase 15 Reading Exam Workspace Validated.\n');
}
