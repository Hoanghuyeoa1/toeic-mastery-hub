/**
 * TOEIC Mastery Hub — Exam Results & Answer Review Targeted Test Suite (Phase 17)
 *
 * Comprehensive unit and contract tests verifying:
 * - Suite 1: Status filtering (all, correct, incorrect, unanswered, flagged)
 * - Suite 2: Part 1–7 filtering and multi-criteria combinations
 * - Suite 3: Rapid wrong question navigation (next/prev & wrap-around)
 * - Suite 4: Form revision mismatch & missing registry compatibility guards
 * - Suite 5: Strengths, weaknesses, topics, and trap analysis computation
 * - Suite 6: All-blank zero-score review data contracts
 * - Suite 7: All-correct perfect-score review data contracts
 * - Suite 8: All-wrong score review data contracts
 * - Suite 9: Immutability enforcement (frozen results cannot be mutated)
 * - Suite 10: Retake attempt progress comparison & test-retest caution advisory
 * - Suite 11: Integrity badge classification & simulation labeling
 */

import {
  scoreExamSession,
  createExamHistoryEntry,
  PART_QUESTION_COUNTS,
} from '../examScoringEngine';
import {
  analyzeExamStrengthsAndWeaknesses,
  compareExamAttempts,
  filterReviewItems,
  findAdjacentWrongQuestion,
  checkExamFormCompatibility,
  CAUTIOUS_TEST_RETEST_ADVISORY,
} from '../examReviewAnalysis';
import {
  createExamSession,
  executePreflightCheck,
  startExam,
  recordExamAnswer,
  toggleQuestionFlag,
} from '../examSessionEngine';
import {
  ExamResult,
  ExamReviewItem,
  ExamHistoryEntry,
  ExamForm,
  ExamSession,
} from '../../types/mockExam';
import { CANONICAL_ETS_EXAM_FORM_01 } from '../../data/examForms/etsMockForm01';
import { getQuestionById } from '../questionBankLookup';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ [FAIL] ${message}`);
  }
}

function initAndStartTestSession(
  form: ExamForm = CANONICAL_ETS_EXAM_FORM_01,
  mode: 'simulation' | 'strict' = 'simulation'
): ExamSession {
  const session1 = createExamSession({ examFormId: form.id, mode }, form);
  const preflightRes = executePreflightCheck(session1, form);
  if (!preflightRes.success) {
    throw new Error(`Preflight check failed: ${preflightRes.error}`);
  }
  const startRes = startExam(preflightRes.session);
  if (!startRes.success) {
    throw new Error(`Start exam failed: ${startRes.error}`);
  }
  return startRes.session;
}

console.log('\n================================================================');
console.log('PHASE 17: EXAM RESULTS & ANSWER REVIEW TARGETED TEST SUITE');
console.log('================================================================\n');

const form = CANONICAL_ETS_EXAM_FORM_01;

// -----------------------------------------------------------------------------
// SETUP REALISTIC MIXED SESSION (153 correct, 32 wrong, 15 unanswered, 4 flagged)
// -----------------------------------------------------------------------------
let mixedSession = initAndStartTestSession(form, 'simulation');

function populateAnswerRange(
  startQ: number,
  correctCount: number,
  wrongCount: number,
  unansweredCount: number
) {
  let c = 0;
  let w = 0;
  for (let i = 0; i < correctCount + wrongCount + unansweredCount; i++) {
    const qNum = startQ + i;
    const qRef = form.questions[qNum - 1];
    const qData = getQuestionById(qRef.questionId);
    const correct = qData?.correctKey ?? 'A';

    if (c < correctCount) {
      mixedSession = recordExamAnswer(mixedSession, qNum, correct, 15).session;
      c++;
    } else if (w < wrongCount) {
      let wrong = correct === 'A' ? 'B' : 'A';
      if (qNum >= 7 && qNum <= 31 && wrong === 'D') wrong = 'C';
      mixedSession = recordExamAnswer(mixedSession, qNum, wrong as 'A' | 'B' | 'C' | 'D', 20).session;
      w++;
    }
    // remaining are left unanswered (null)
  }
}

// 77 Listening correct, 15 wrong, 8 unanswered = 100
populateAnswerRange(1, 5, 1, 0);     // Part 1: Q1-5 correct, Q6 wrong
populateAnswerRange(7, 20, 3, 2);    // Part 2: Q7-26 correct, Q27-29 wrong, Q30-31 unanswered
populateAnswerRange(32, 30, 6, 3);   // Part 3: Q32-61 correct, Q62-67 wrong, Q68-70 unanswered
populateAnswerRange(71, 22, 5, 3);   // Part 4: Q71-92 correct, Q93-97 wrong, Q98-100 unanswered

// 76 Reading correct, 17 wrong, 7 unanswered = 100
populateAnswerRange(101, 24, 4, 2);  // Part 5: Q101-124 correct, Q125-128 wrong, Q129-130 unanswered
populateAnswerRange(131, 12, 3, 1);  // Part 6: Q131-142 correct, Q143-145 wrong, Q146 unanswered
populateAnswerRange(147, 40, 10, 4); // Part 7: Q147-186 correct, Q187-196 wrong, Q197-200 unanswered

// Set 4 flags
mixedSession = toggleQuestionFlag(mixedSession, 5).session;
mixedSession = toggleQuestionFlag(mixedSession, 25).session;
mixedSession = toggleQuestionFlag(mixedSession, 110).session;
mixedSession = toggleQuestionFlag(mixedSession, 160).session;

mixedSession.elapsedSeconds = 5400; // 90 mins
const mixedResult: ExamResult = scoreExamSession(mixedSession, form, {
  now: Date.now(),
});

// -----------------------------------------------------------------------------
// SUITE 1: STATUS FILTERING
// -----------------------------------------------------------------------------
console.log('--- SUITE 1: Review Items Status Filtering ---');
{
  const allItems = filterReviewItems(mixedResult.reviewItems, 'all', 'all');
  assert(allItems.length === 200, 'Filter "all" returns exactly 200 items');

  const correctItems = filterReviewItems(mixedResult.reviewItems, 'correct', 'all');
  assert(correctItems.length === 153, 'Filter "correct" returns exactly 153 items');
  assert(correctItems.every((item) => item.isCorrect === true), 'All items in "correct" filter are isCorrect === true');

  const incorrectItems = filterReviewItems(mixedResult.reviewItems, 'incorrect', 'all');
  assert(incorrectItems.length === 32, 'Filter "incorrect" returns exactly 32 items');
  assert(
    incorrectItems.every((item) => item.isCorrect === false && item.isUnanswered === false),
    'All items in "incorrect" filter are marked incorrect and not unanswered'
  );

  const unansweredItems = filterReviewItems(mixedResult.reviewItems, 'unanswered', 'all');
  assert(unansweredItems.length === 15, 'Filter "unanswered" returns exactly 15 items');
  assert(unansweredItems.every((item) => item.isUnanswered === true), 'All items in "unanswered" filter have isUnanswered === true');

  const flaggedItems = filterReviewItems(mixedResult.reviewItems, 'flagged', 'all');
  assert(flaggedItems.length === 4, 'Filter "flagged" returns exactly 4 items (Q5, Q25, Q110, Q160)');
  assert(flaggedItems.every((item) => item.isFlagged === true), 'All items in "flagged" filter have isFlagged === true');
}

// -----------------------------------------------------------------------------
// SUITE 2: PART FILTERING & COMBINATIONS
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 2: Part 1–7 Filtering & Combined Multi-Criteria ---');
{
  const part1Items = filterReviewItems(mixedResult.reviewItems, 'all', 1);
  assert(part1Items.length === 6, 'Part 1 filter returns exactly 6 questions (1–6)');
  assert(part1Items.every((i) => i.partNum === 1), 'All items belong to Part 1');

  const part2Items = filterReviewItems(mixedResult.reviewItems, 'all', 2);
  assert(part2Items.length === 25, 'Part 2 filter returns exactly 25 questions (7–31)');

  const part5Items = filterReviewItems(mixedResult.reviewItems, 'all', 5);
  assert(part5Items.length === 30, 'Part 5 filter returns exactly 30 questions (101–130)');

  const part7Items = filterReviewItems(mixedResult.reviewItems, 'all', 7);
  assert(part7Items.length === 54, 'Part 7 filter returns exactly 54 questions (147–200)');

  // Combination: Part 7 Incorrect items (Q187-Q196 = 10 questions)
  const part7Wrong = filterReviewItems(mixedResult.reviewItems, 'incorrect', 7);
  assert(part7Wrong.length === 10, 'Combined filter (Part 7 + Incorrect) returns exactly 10 items');

  // Combination: Part 7 Unanswered items (Q197-Q200 = 4 questions)
  const part7Unanswered = filterReviewItems(mixedResult.reviewItems, 'unanswered', 7);
  assert(part7Unanswered.length === 4, 'Combined filter (Part 7 + Unanswered) returns exactly 4 items');

  // Combination: Part 1 Incorrect (Q6 is wrong = 1 question)
  const part1Wrong = filterReviewItems(mixedResult.reviewItems, 'incorrect', 1);
  assert(part1Wrong.length === 1, 'Part 1 has exactly 1 incorrect answer (Q6)');
}

// -----------------------------------------------------------------------------
// SUITE 3: RAPID WRONG QUESTION NAVIGATION
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 3: Rapid Wrong Question Navigation ---');
{
  // First wrong question is Q6
  const nextFrom1 = findAdjacentWrongQuestion(mixedResult.reviewItems, 1, 'next');
  assert(nextFrom1 === 6, 'Next wrong from Q1 jumps to Q6');

  // Next wrong question after Q6 is Q27 (first wrong in Part 2)
  const nextFrom6 = findAdjacentWrongQuestion(mixedResult.reviewItems, 6, 'next');
  assert(nextFrom6 === 27, 'Next wrong from Q6 jumps to Q27');

  // Last wrong question in the test is Q196
  const nextFrom196 = findAdjacentWrongQuestion(mixedResult.reviewItems, 196, 'next');
  assert(nextFrom196 === 6, 'Next wrong from last wrong (Q196) wraps around to first wrong (Q6)');

  // Prev wrong before Q27 is Q6
  const prevFrom27 = findAdjacentWrongQuestion(mixedResult.reviewItems, 27, 'prev');
  assert(prevFrom27 === 6, 'Prev wrong from Q27 jumps to Q6');

  // Prev wrong before first wrong (Q6) wraps around to Q196
  const prevFrom6 = findAdjacentWrongQuestion(mixedResult.reviewItems, 6, 'prev');
  assert(prevFrom6 === 196, 'Prev wrong from first wrong (Q6) wraps around to last wrong (Q196)');
}

// -----------------------------------------------------------------------------
// SUITE 4: REVISION MISMATCH & COMPATIBILITY GUARDS
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 4: Revision Mismatch & Missing Form Compatibility ---');
{
  const matchCompat = checkExamFormCompatibility(form, mixedResult);
  assert(matchCompat.isCompatible === true, 'Matching form and revision is compatible');
  assert(matchCompat.warning === undefined, 'No warning for matching form');

  const rev2Form = { ...form, contentRevision: 2 };
  const mismatchCompat = checkExamFormCompatibility(rev2Form, mixedResult);
  assert(mismatchCompat.isCompatible === false, 'Revision mismatch detected');
  assert(
    mismatchCompat.warning?.includes('Revision 1') && mismatchCompat.warning?.includes('Revision 2'),
    'Warning message mentions both Revision 1 and Revision 2'
  );

  const missingCompat = checkExamFormCompatibility(undefined, mixedResult);
  assert(missingCompat.isCompatible === false, 'Missing form detected');
  assert(missingCompat.warning?.includes('không còn tồn tại'), 'Warning message clarifies form is missing from registry');
}

// -----------------------------------------------------------------------------
// SUITE 5: STRENGTHS, WEAKNESSES & TRAP ANALYSIS COMPUTATION
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 5: Strengths, Weaknesses & Trap Analysis ---');
{
  const analysis = analyzeExamStrengthsAndWeaknesses(mixedResult);

  // In this realistic setup:
  // Part 1: 5/6 = 83.3% -> Strength
  // Part 2: 20/25 = 80.0% -> Strength
  // Part 3: 30/39 = 76.9% -> Strength
  // Part 4: 22/30 = 73.3% -> Moderate
  // Part 5: 24/30 = 80.0% -> Strength
  // Part 6: 12/16 = 75.0% -> Strength
  // Part 7: 40/54 = 74.1% -> Moderate
  assert(analysis.strengths.length >= 4, 'At least 4 parts identified as strengths (≥ 75%)');
  assert(analysis.strengths.some((s) => s.partNum === 1), 'Part 1 is in strengths list');
  assert(analysis.strengths.some((s) => s.partNum === 5), 'Part 5 is in strengths list');
  assert(analysis.moderate.some((m) => m.partNum === 7), 'Part 7 is in moderate list (50-74%)');

  // Topics to improve
  assert(analysis.topicsToImprove.length > 0, 'Topics to improve list is populated');
  assert(analysis.topicsToImprove[0].incorrectCount > 0, 'Top topic to improve has incorrectCount > 0');
}

// -----------------------------------------------------------------------------
// SUITE 6: ALL-BLANK ZERO-SCORE CONTRACTS
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 6: All-Blank Zero-Score Contracts ---');
{
  const blankSession = initAndStartTestSession(form);
  const blankResult = scoreExamSession(blankSession, form, { now: Date.now() });

  assert(blankResult.totalRaw === 0, 'All blank raw score is strictly 0');
  assert(blankResult.totalUnanswered === 200, 'All blank total unanswered is strictly 200');
  assert(blankResult.reviewItems.length === 200, 'All blank has exactly 200 review items');
  assert(blankResult.reviewItems.every((i) => i.isUnanswered === true), 'Every item has isUnanswered === true');
  assert(blankResult.reviewItems.every((i) => i.isCorrect === false), 'Every item has isCorrect === false');
  assert(blankResult.reviewItems.every((i) => i.userChoice === null), 'Every item userChoice is null');

  const blankAnalysis = analyzeExamStrengthsAndWeaknesses(blankResult);
  assert(blankAnalysis.strengths.length === 0, 'All blank has 0 strengths');
  assert(blankAnalysis.weaknesses.length === 7, 'All blank has all 7 parts classified as weaknesses');
}

// -----------------------------------------------------------------------------
// SUITE 7: ALL-CORRECT PERFECT-SCORE CONTRACTS
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 7: All-Correct Perfect-Score Contracts ---');
{
  let perfectSession = initAndStartTestSession(form);
  for (let idx = 1; idx <= 200; idx++) {
    const qRef = form.questions[idx - 1];
    const qData = getQuestionById(qRef.questionId);
    const correct = qData?.correctKey ?? 'A';
    perfectSession = recordExamAnswer(perfectSession, idx, correct, 20).session;
  }
  const perfectResult = scoreExamSession(perfectSession, form, { now: Date.now() });

  assert(perfectResult.totalRaw === 200, 'Perfect raw score is strictly 200/200');
  assert(perfectResult.accuracyPercentage === 100, 'Accuracy is strictly 100%');
  assert(perfectResult.reviewItems.every((i) => i.isCorrect === true), 'Every review item is isCorrect === true');
  assert(perfectResult.reviewItems.every((i) => i.isUnanswered === false), 'Zero review items are unanswered');

  const noWrongNext = findAdjacentWrongQuestion(perfectResult.reviewItems, 10, 'next');
  assert(noWrongNext === null, 'findAdjacentWrongQuestion returns null when 0 wrong questions exist');

  const perfAnalysis = analyzeExamStrengthsAndWeaknesses(perfectResult);
  assert(perfAnalysis.strengths.length === 7, 'Perfect score has all 7 parts classified as strengths');
  assert(perfAnalysis.weaknesses.length === 0, 'Perfect score has 0 weaknesses');
  assert(perfAnalysis.topicsToImprove.length === 0, 'Perfect score has 0 topics to improve');
}

// -----------------------------------------------------------------------------
// SUITE 8: ALL-WRONG SCORE CONTRACTS
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 8: All-Wrong Score Contracts ---');
{
  let wrongSession = initAndStartTestSession(form);
  for (let idx = 1; idx <= 200; idx++) {
    const qRef = form.questions[idx - 1];
    const qData = getQuestionById(qRef.questionId);
    const correct = qData?.correctKey ?? 'A';
    let wrong = correct === 'A' ? 'B' : 'A';
    if (idx >= 7 && idx <= 31 && wrong === 'D') wrong = 'C';
    wrongSession = recordExamAnswer(wrongSession, idx, wrong as 'A' | 'B' | 'C' | 'D', 20).session;
  }
  const wrongResult = scoreExamSession(wrongSession, form, { now: Date.now() });

  assert(wrongResult.totalRaw === 0, 'All wrong raw score is strictly 0');
  assert(wrongResult.totalIncorrect === 200, 'All wrong total incorrect is strictly 200');
  assert(wrongResult.totalUnanswered === 0, 'All wrong total unanswered is strictly 0');
  assert(wrongResult.reviewItems.every((i) => !i.isCorrect && !i.isUnanswered), 'All 200 items marked incorrect');
}

// -----------------------------------------------------------------------------
// SUITE 9: IMMUTABILITY ENFORCEMENT
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 9: Immutability Enforcement on Review Snapshots ---');
{
  const snapshotJsonBefore = JSON.stringify(mixedResult);

  filterReviewItems(mixedResult.reviewItems, 'incorrect', 'all');
  filterReviewItems(mixedResult.reviewItems, 'flagged', 3);
  analyzeExamStrengthsAndWeaknesses(mixedResult);
  findAdjacentWrongQuestion(mixedResult.reviewItems, 154, 'next');

  const snapshotJsonAfter = JSON.stringify(mixedResult);
  assert(
    snapshotJsonBefore === snapshotJsonAfter,
    'Frozen ExamResult object is strictly unmutated after all filtering and analytics operations'
  );
}

// -----------------------------------------------------------------------------
// SUITE 10: RETAKE ATTEMPT COMPARISON & CAUTION ADVISORY
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 10: Retake Attempt Progress Comparison & Advisory ---');
{
  const attempt1Entry: ExamHistoryEntry = createExamHistoryEntry(mixedResult);

  const attempt2Result: ExamResult = {
    ...mixedResult,
    sessionId: 'session-attempt-2',
    completedAt: '2026-10-10T10:00:00.000Z',
    totalRaw: 168,
    listeningRaw: 85,
    readingRaw: 83,
    totalScaled: 850,
    accuracyPercentage: 84.0,
    totalTimeSeconds: 5100, // 85 mins (faster by 5 mins)
  };
  const attempt2Entry: ExamHistoryEntry = createExamHistoryEntry(attempt2Result);

  const comp = compareExamAttempts(attempt2Entry, attempt1Entry, 2, 1);

  assert(comp.deltaTotalRaw === 15, 'Delta total raw score is strictly +15 (168 - 153)');
  assert(comp.deltaTotalScaled === 80, 'Delta total scaled score is strictly +80 (850 - 770)');
  assert(comp.deltaAccuracy === 7.5, 'Delta accuracy is strictly +7.5% (84.0 - 76.5)');
  assert(comp.deltaDurationMinutes === -5.0, 'Delta duration is strictly -5.0 mins');
  assert(
    comp.cautiousAdvisoryNote === CAUTIOUS_TEST_RETEST_ADVISORY,
    'Comparison contains the exact required cautious test-retest advisory'
  );
  assert(
    comp.cautiousAdvisoryNote.includes('Practice Effect'),
    'Advisory warns candidate about the Practice/Memory Effect'
  );
}

// -----------------------------------------------------------------------------
// SUITE 11: INTEGRITY BADGE CLASSIFICATION
// -----------------------------------------------------------------------------
console.log('\n--- SUITE 11: Integrity Badge & Mode Qualification ---');
{
  assert(
    mixedResult.mode === 'simulation',
    'Mixed result correctly records simulation mode'
  );
  assert(
    mixedResult.integrityStatus.isStrictValid === false,
    'Simulation mode does not falsely claim isStrictValid: true'
  );

  const strictForm: typeof form = {
    ...form,
    media: {
      ...form.media,
      strictLocked: false,
      readinessStatus: 'strict-ready',
    },
  };
  const strictSession: ExamSession = {
    ...initAndStartTestSession(strictForm, 'strict'),
    integrityFlags: {
      ...form.metadata ? {} : {},
      timelineAbnormal: true,
      mediaInterruptedCount: 1,
    },
  };
  const strictDisqualified = scoreExamSession(strictSession, strictForm, { now: Date.now() });

  assert(
    strictDisqualified.integrityStatus.isStrictValid === false,
    'Strict session with media disruption is disqualified from isStrictValid'
  );
  assert(
    strictDisqualified.integrityStatus.mediaInterrupted === true,
    'mediaInterrupted flag is preserved in integrityStatus'
  );
}

// -----------------------------------------------------------------------------
// TEST SUMMARY
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`TOTAL TESTS RUN:    ${totalTests}`);
console.log(`TOTAL TESTS PASSED: ${passedTests}`);
console.log(`TOTAL TESTS FAILED: ${failedTests}`);
console.log('================================================================\n');

if (failedTests > 0) {
  console.error(`💥 ${failedTests} TEST(S) FAILED!`);
  process.exit(1);
} else {
  console.log('🎉 ALL ASSERTIONS PASSED! Phase 17 Results & Review Validated.\n');
}
