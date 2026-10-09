/**
 * TOEIC Mastery Hub — Exam Scoring, Submission & History Test Suite (Phase 16)
 *
 * Exhaustive targeted test coverage:
 * 1. All Blank Submission & 200-Question Invariants (0 correct, 0 wrong, 200 unanswered)
 * 2. All Correct Perfect Score (200/200, scaled 990, 0 wrong, 0 unanswered)
 * 3. All Wrong Score & No Negative Marking (0/200, 200 wrong, 0 unanswered)
 * 4. Mixed Responses, Part 1–7 Breakdowns & Mathematical Exact Sum Invariants
 * 5. Double Submit Protection & Idempotent Finalization
 * 6. Auto-Timeout & Manual Submit Race Protection
 * 7. LocalStorage Quota Failure & Non-Fake Success Guarantees
 * 8. Retry & Recovery Pipeline After Storage Quota Restored
 * 9. Reload & Session State Recovery Post-Submission
 * 10. Retake Isolation & Multi-Attempt History Preservation
 * 11. Historical Content Revision Tracking Across Form Updates
 * 12. Strict Mode Media Interruption Disqualification
 * 13. Zero Interference with User Profile & Cold Storage (toeic_mastery_data_v2_cold)
 */

import {
  createExamSession,
  executePreflightCheck,
  startExam,
  recordExamAnswer,
  toggleQuestionFlag,
} from '../examSessionEngine';
import {
  scoreExamSession,
  validateScoreTotals,
  PART_QUESTION_COUNTS,
} from '../examScoringEngine';
import {
  finalizeExamSubmission,
  isSessionFinalized,
} from '../examSubmissionCoordinator';
import {
  saveActiveExamSession,
  getExamResult,
  getExamHistory,
  getExamHistoryForForm,
  ACTIVE_EXAM_SESSION_KEY,
} from '../examSessionStorage';
import { CANONICAL_ETS_EXAM_FORM_01 } from '../../data/examForms/etsMockForm01';
import { ExamForm, ExamSession } from '../../types/mockExam';
import { getQuestionById } from '../questionBankLookup';

// In-memory mock localStorage with QuotaExceeded simulation
class MockLocalStorage implements Storage {
  private store: Record<string, string> = {};
  public shouldThrowQuota = false;

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] ?? null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    if (this.shouldThrowQuota) {
      const err = new DOMException('QuotaExceededError', 'QuotaExceededError');
      Object.defineProperty(err, 'code', { value: 22 });
      throw err;
    }
    this.store[key] = String(value);
  }
}

const mockStorage = new MockLocalStorage();
(globalThis as unknown as { localStorage: Storage }).localStorage = mockStorage;

let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, message: string): void {
  testsRun++;
  if (condition) {
    testsPassed++;
    console.log(`  ✓ [PASS] ${message}`);
  } else {
    testsFailed++;
    console.error(`  ✗ [FAIL] ${message}`);
  }
}

function initAndStartSession(
  form: ExamForm = CANONICAL_ETS_EXAM_FORM_01,
  mode: 'simulation' | 'strict' = 'simulation'
): ExamSession {
  const session = createExamSession({ examFormId: form.id, mode }, form);
  const preflightRes = executePreflightCheck(session, form);
  if (!preflightRes.success) {
    throw new Error(`Preflight check failed: ${preflightRes.error}`);
  }
  const startRes = startExam(preflightRes.session);
  if (!startRes.success) {
    throw new Error(`Start exam failed: ${startRes.error}`);
  }
  return startRes.session;
}

const STRICT_UNLOCKED_FORM: ExamForm = {
  ...CANONICAL_ETS_EXAM_FORM_01,
  media: {
    ...CANONICAL_ETS_EXAM_FORM_01.media,
    readinessStatus: 'strict-ready',
    strictLocked: false,
    lockReason: undefined,
  },
};

console.log('================================================================');
console.log('PHASE 16: FULL MOCK EXAM SUBMISSION, SCORING & HISTORY TEST SUITE');
console.log('================================================================\n');

// ----------------------------------------------------------------------------
console.log('--- SUITE 1: All Blank Submission & Mathematical Invariants ---');
// ----------------------------------------------------------------------------
mockStorage.clear();

const startedBlank = initAndStartSession(CANONICAL_ETS_EXAM_FORM_01, 'simulation');

const outcomeBlank = finalizeExamSubmission(startedBlank, CANONICAL_ETS_EXAM_FORM_01, 'user_completed');
assert(outcomeBlank.success === true, 'All blank session finalization succeeds');
assert(outcomeBlank.result !== undefined, 'Result object generated for all blank');

const resBlank = outcomeBlank.result!;
assert(resBlank.listeningRaw === 0, 'Listening correct is strictly 0');
assert(resBlank.readingRaw === 0, 'Reading correct is strictly 0');
assert(resBlank.totalRaw === 0, 'Total correct is strictly 0');
assert(resBlank.listeningIncorrect === 0, 'Listening incorrect is strictly 0');
assert(resBlank.readingIncorrect === 0, 'Reading incorrect is strictly 0');
assert(resBlank.totalIncorrect === 0, 'Total incorrect is strictly 0');
assert(resBlank.listeningUnanswered === 100, 'Listening unanswered is strictly 100');
assert(resBlank.readingUnanswered === 100, 'Reading unanswered is strictly 100');
assert(resBlank.totalUnanswered === 200, 'Total unanswered is strictly 200');

// Exact 200-question sum invariant
assert(
  resBlank.totalRaw + resBlank.totalIncorrect + resBlank.totalUnanswered === 200,
  '200-Question Sum Invariant: 0 correct + 0 wrong + 200 unanswered === 200'
);
assert(
  resBlank.listeningRaw + resBlank.listeningIncorrect + resBlank.listeningUnanswered === 100,
  'Listening Section Sum Invariant: 0 + 0 + 100 === 100'
);
assert(
  resBlank.readingRaw + resBlank.readingIncorrect + resBlank.readingUnanswered === 100,
  'Reading Section Sum Invariant: 0 + 0 + 100 === 100'
);

// Per-part sums
for (let p = 1; p <= 7; p++) {
  const part = resBlank.byPart[p as 1 | 2 | 3 | 4 | 5 | 6 | 7];
  assert(part.correctCount === 0, `Part ${p} correctCount is 0`);
  assert(part.incorrectCount === 0, `Part ${p} incorrectCount is 0`);
  assert(part.unansweredCount === PART_QUESTION_COUNTS[p as 1 | 2 | 3 | 4 | 5 | 6 | 7], `Part ${p} unansweredCount === ${PART_QUESTION_COUNTS[p as 1 | 2 | 3 | 4 | 5 | 6 | 7]}`);
}

assert(resBlank.listeningScaled === 5, 'Listening scaled minimum is 5');
assert(resBlank.readingScaled === 5, 'Reading scaled minimum is 5');
assert(resBlank.totalScaled === 10, 'Total scaled minimum is 10 (5 + 5)');
assert(resBlank.reviewItems.length === 200, 'Review items length is exactly 200');
assert(resBlank.reviewItems.every((item) => item.isUnanswered && !item.isCorrect && item.userChoice === null), 'Every review item is unanswered with null choice');

// ----------------------------------------------------------------------------
console.log('\n--- SUITE 2: All Correct Perfect Score (200/200, Scaled 990) ---');
// ----------------------------------------------------------------------------
mockStorage.clear();

let startedPerfect = initAndStartSession(CANONICAL_ETS_EXAM_FORM_01, 'simulation');

// Answer every question with its correct choice
for (let q = 1; q <= 200; q++) {
  const qRef = CANONICAL_ETS_EXAM_FORM_01.questions[q - 1];
  const qData = getQuestionById(qRef.questionId);
  const correctChoice = qData?.correctKey ?? 'A';
  startedPerfect = recordExamAnswer(startedPerfect, q, correctChoice, 15).session;
}

const outcomePerfect = finalizeExamSubmission(startedPerfect, CANONICAL_ETS_EXAM_FORM_01, 'user_completed');
assert(outcomePerfect.success === true, 'All correct session finalization succeeds');
const resPerfect = outcomePerfect.result!;

assert(resPerfect.listeningRaw === 100, 'Listening correct is strictly 100/100');
assert(resPerfect.readingRaw === 100, 'Reading correct is strictly 100/100');
assert(resPerfect.totalRaw === 200, 'Total correct is strictly 200/200');
assert(resPerfect.totalIncorrect === 0, 'Total incorrect is strictly 0');
assert(resPerfect.totalUnanswered === 0, 'Total unanswered is strictly 0');
assert(resPerfect.accuracyPercentage === 100, 'Accuracy percentage is strictly 100%');
assert(resPerfect.listeningScaled === 495, 'Listening scaled maximum is 495');
assert(resPerfect.readingScaled === 495, 'Reading scaled maximum is 495');
assert(resPerfect.totalScaled === 990, 'Total scaled maximum is 990 (495 + 495)');
assert(resPerfect.levelBand.level.includes('Mastery'), 'Level band classifies as Mastery');
assert(resPerfect.reviewItems.every((item) => item.isCorrect && !item.isUnanswered), 'Every review item is marked as correct');

// ----------------------------------------------------------------------------
console.log('\n--- SUITE 3: All Wrong Score & Zero Negative Marking (0/200) ---');
// ----------------------------------------------------------------------------
mockStorage.clear();

let startedWrong = initAndStartSession(CANONICAL_ETS_EXAM_FORM_01, 'simulation');

// Intentionally choose the wrong option for every single question
for (let q = 1; q <= 200; q++) {
  const qRef = CANONICAL_ETS_EXAM_FORM_01.questions[q - 1];
  const qData = getQuestionById(qRef.questionId);
  const correct = qData?.correctKey ?? 'A';
  // Pick an option different from correct (for Part 2, only pick A/B/C)
  let wrongChoice: 'A' | 'B' | 'C' | 'D' = 'B';
  if (correct === 'B') wrongChoice = 'C';
  if (q >= 7 && q <= 31 && wrongChoice === 'D') wrongChoice = 'A';
  if (wrongChoice === correct) wrongChoice = 'A';

  startedWrong = recordExamAnswer(startedWrong, q, wrongChoice, 10).session;
}

const outcomeWrong = finalizeExamSubmission(startedWrong, CANONICAL_ETS_EXAM_FORM_01, 'user_completed');
assert(outcomeWrong.success === true, 'All wrong session finalization succeeds');
const resWrong = outcomeWrong.result!;

assert(resWrong.totalRaw === 0, 'Total correct is strictly 0');
assert(resWrong.totalIncorrect === 200, 'Total incorrect is strictly 200');
assert(resWrong.totalUnanswered === 0, 'Total unanswered is strictly 0');
assert(resWrong.totalRaw + resWrong.totalIncorrect + resWrong.totalUnanswered === 200, 'Sum invariant: 0 + 200 + 0 === 200');
assert(resWrong.listeningScaled === 5, 'No negative points: listening scaled remains 5');
assert(resWrong.readingScaled === 5, 'No negative points: reading scaled remains 5');
assert(resWrong.totalScaled === 10, 'No negative points: total scaled remains 10');
assert(resWrong.reviewItems.every((item) => !item.isCorrect && !item.isUnanswered), 'Every review item is marked as incorrect');

// ----------------------------------------------------------------------------
console.log('\n--- SUITE 4: Mixed Realistic Responses & Part 1–7 Invariants ---');
// ----------------------------------------------------------------------------
mockStorage.clear();

let startedMixed = initAndStartSession(CANONICAL_ETS_EXAM_FORM_01, 'simulation');

// Simulate realistic performance:
// Part 1 (1-6): 5 correct, 1 wrong
// Part 2 (7-31): 20 correct, 3 wrong, 2 unanswered
// Part 3 (32-70): 30 correct, 6 wrong, 3 unanswered
// Part 4 (71-100): 22 correct, 5 wrong, 3 unanswered
// Listening: 5 + 20 + 30 + 22 = 77 correct, 15 wrong, 8 unanswered = 100
// Part 5 (101-130): 24 correct, 4 wrong, 2 unanswered
// Part 6 (131-146): 12 correct, 3 wrong, 1 unanswered
// Part 7 (147-200): 40 correct, 10 wrong, 4 unanswered
// Reading: 24 + 12 + 40 = 76 correct, 17 wrong, 7 unanswered = 100
// Total: 77 + 76 = 153 correct, 32 wrong, 15 unanswered = 200

function answerRange(
  startQ: number,
  correctCount: number,
  wrongCount: number,
  unansweredCount: number
) {
  let c = 0;
  let w = 0;
  for (let i = 0; i < correctCount + wrongCount + unansweredCount; i++) {
    const qNum = startQ + i;
    const qRef = CANONICAL_ETS_EXAM_FORM_01.questions[qNum - 1];
    const qData = getQuestionById(qRef.questionId);
    const correct = qData?.correctKey ?? 'A';

    if (c < correctCount) {
      startedMixed = recordExamAnswer(startedMixed, qNum, correct, 12).session;
      c++;
    } else if (w < wrongCount) {
      let wrong = correct === 'A' ? 'B' : 'A';
      if (qNum >= 7 && qNum <= 31 && wrong === 'D') wrong = 'C';
      startedMixed = recordExamAnswer(startedMixed, qNum, wrong as 'A' | 'B' | 'C' | 'D', 18).session;
      w++;
    }
    // remaining are left unanswered (null)
  }
}

answerRange(1, 5, 1, 0);     // Part 1 (6)
answerRange(7, 20, 3, 2);    // Part 2 (25)
answerRange(32, 30, 6, 3);   // Part 3 (39)
answerRange(71, 22, 5, 3);   // Part 4 (30)
answerRange(101, 24, 4, 2);  // Part 5 (30)
answerRange(131, 12, 3, 1);  // Part 6 (16)
answerRange(147, 40, 10, 4); // Part 7 (54)

// Toggle some flags
startedMixed = toggleQuestionFlag(startedMixed, 5).session;
startedMixed = toggleQuestionFlag(startedMixed, 25).session;
startedMixed = toggleQuestionFlag(startedMixed, 110).session;

const outcomeMixed = finalizeExamSubmission(startedMixed, CANONICAL_ETS_EXAM_FORM_01, 'user_completed');
assert(outcomeMixed.success === true, 'Mixed response finalization succeeds');
const resMixed = outcomeMixed.result!;

assert(resMixed.listeningRaw === 77, 'Listening correct is 77');
assert(resMixed.listeningIncorrect === 15, 'Listening incorrect is 15');
assert(resMixed.listeningUnanswered === 8, 'Listening unanswered is 8');
assert(resMixed.listeningRaw + resMixed.listeningIncorrect + resMixed.listeningUnanswered === 100, 'Listening sum: 77 + 15 + 8 === 100');

assert(resMixed.readingRaw === 76, 'Reading correct is 76');
assert(resMixed.readingIncorrect === 17, 'Reading incorrect is 17');
assert(resMixed.readingUnanswered === 7, 'Reading unanswered is 7');
assert(resMixed.readingRaw + resMixed.readingIncorrect + resMixed.readingUnanswered === 100, 'Reading sum: 76 + 17 + 7 === 100');

assert(resMixed.totalRaw === 153, 'Total correct is 153');
assert(resMixed.totalIncorrect === 32, 'Total incorrect is 32');
assert(resMixed.totalUnanswered === 15, 'Total unanswered is 15');
assert(resMixed.totalRaw + resMixed.totalIncorrect + resMixed.totalUnanswered === 200, 'Total sum: 153 + 32 + 15 === 200');

assert(resMixed.accuracyPercentage === 76.5, 'Accuracy percentage is 76.5%');
assert(resMixed.listeningAccuracy === 77.0, 'Listening accuracy is 77.0%');
assert(resMixed.readingAccuracy === 76.0, 'Reading accuracy is 76.0%');
assert(resMixed.flaggedCount === 3, 'Flagged questions count is 3 (Q5, Q25, Q110)');
assert(resMixed.flaggedQuestions.includes(5) && resMixed.flaggedQuestions.includes(110), 'Flagged questions array contains Q5 and Q110');

// Validate mathematical totals invariant checker
const mathCheck = validateScoreTotals(resMixed);
assert(mathCheck.isValid === true, 'validateScoreTotals approves mixed result');
assert(mathCheck.errors.length === 0, 'Zero invariant errors reported');

// Scaled scores
assert(resMixed.totalScaled > 700 && resMixed.totalScaled < 900, `Estimated scaled score in realistic 700-900 band (got: ${resMixed.totalScaled})`);
assert(resMixed.scaledScoreEstimate.limitations.length > 20, 'Estimated score has explicit educational disclaimer');

// ----------------------------------------------------------------------------
console.log('\n--- SUITE 5: Double Submit Protection & Idempotent Finalization ---');
// ----------------------------------------------------------------------------
// Submit the exact same session a second time
const secondOutcome = finalizeExamSubmission(startedMixed, CANONICAL_ETS_EXAM_FORM_01, 'user_completed');
assert(secondOutcome.success === true, 'Second submit returns success');
assert(secondOutcome.alreadyFinalized === true, 'Second submit flagged as alreadyFinalized');
assert(secondOutcome.result?.totalRaw === 153, 'Second submit returns identical totalRaw (153)');
assert(secondOutcome.result?.sessionId === startedMixed.sessionId, 'Second submit preserves exact sessionId');

// Ensure history did NOT record a duplicate entry
const historyEntries = getExamHistory();
const matchEntries = historyEntries.filter((h) => h.sessionId === startedMixed.sessionId);
assert(matchEntries.length === 1, 'Idempotency: Exactly 1 history entry exists for this sessionId (no duplicates)');

// ----------------------------------------------------------------------------
console.log('\n--- SUITE 6: Auto-Timeout & Manual Submit Race Protection ---');
// ----------------------------------------------------------------------------
const startedRace = initAndStartSession(CANONICAL_ETS_EXAM_FORM_01, 'simulation');

// Candidate submits manually at the same tick auto timeout occurs
const resManual = finalizeExamSubmission(startedRace, CANONICAL_ETS_EXAM_FORM_01, 'user_completed');
const resTimeout = finalizeExamSubmission(startedRace, CANONICAL_ETS_EXAM_FORM_01, 'timeout_reading');

assert(resManual.success === true, 'Manual submit call succeeds');
assert(resTimeout.success === true, 'Concurrent timeout submit call succeeds idempotently');
assert(resTimeout.alreadyFinalized === true, 'Concurrent timeout detects already finalized');
assert(isSessionFinalized(startedRace.sessionId) === true, 'isSessionFinalized confirms session is recorded');

// ----------------------------------------------------------------------------
console.log('\n--- SUITE 7: LocalStorage Quota Failure & Non-Fake Success ---');
// ----------------------------------------------------------------------------
let startedQuota = initAndStartSession(CANONICAL_ETS_EXAM_FORM_01, 'simulation');
const q1Data = getQuestionById(CANONICAL_ETS_EXAM_FORM_01.questions[0].questionId);
const q1Correct = q1Data?.correctKey ?? 'A';
startedQuota = recordExamAnswer(startedQuota, 1, q1Correct, 20).session;
saveActiveExamSession(startedQuota);

// Simulate storage quota exhaustion
mockStorage.shouldThrowQuota = true;

const quotaOutcome = finalizeExamSubmission(startedQuota, CANONICAL_ETS_EXAM_FORM_01, 'user_completed');
assert(quotaOutcome.success === false, 'Storage failure aborts submission with success === false');
assert(quotaOutcome.code === 'STORAGE_FAILURE', 'Error code is STORAGE_FAILURE');
assert(quotaOutcome.error?.includes('quota') === true, 'Error message explicitly reports storage quota error');

// Ensure active session was NOT destroyed / cleared
const activeRawAfterQuota = mockStorage.getItem(ACTIVE_EXAM_SESSION_KEY);
assert(activeRawAfterQuota !== null, 'Active session is retained in storage for candidate recovery');

// ----------------------------------------------------------------------------
console.log('\n--- SUITE 8: Retry & Recovery Pipeline After Storage Restored ---');
// ----------------------------------------------------------------------------
// Candidate clears cache or fixes storage
mockStorage.shouldThrowQuota = false;

// Retry submission for the preserved session
const retryOutcome = finalizeExamSubmission(startedQuota, CANONICAL_ETS_EXAM_FORM_01, 'user_completed');
assert(retryOutcome.success === true, 'Retry submission succeeds once storage is available');
assert(retryOutcome.result?.reviewItems[0].userChoice === q1Correct, 'Recovered candidate answer for Q1 preserved');
assert(retryOutcome.result?.totalRaw === 1, 'Score for answered Q1 correctly calculated as 1');

// Active session storage is now cleanly cleared
assert(mockStorage.getItem(ACTIVE_EXAM_SESSION_KEY) === null, 'Active session cleared after successful persistence');

// Result is verified in persistent storage
const storedResult = getExamResult(startedQuota.sessionId);
assert(storedResult !== null, 'ExamResult is verified stored in LocalStorage');
assert(storedResult?.sessionId === startedQuota.sessionId, 'Stored result matches recovered sessionId');

// ----------------------------------------------------------------------------
console.log('\n--- SUITE 9: Reload & State Recovery Post-Submission ---');
// ----------------------------------------------------------------------------
const reloadedResult = getExamResult(startedQuota.sessionId);
assert(reloadedResult !== null, 'Reloading submitted session from storage retrieves ExamResult');
assert(reloadedResult?.reviewItems.length === 200, 'Reloaded result has all 200 review items intact');
assert(reloadedResult?.schemaVersion === '1.0.0', 'Schema version matches EXAM_SCORING_SCHEMA_VERSION');

// ----------------------------------------------------------------------------
console.log('\n--- SUITE 10: Retake Isolation & Multi-Attempt Preservation ---');
// ----------------------------------------------------------------------------
// Candidate takes the test a second time (Retake)
let startedRetake = initAndStartSession(CANONICAL_ETS_EXAM_FORM_01, 'simulation');

assert(startedRetake.sessionId !== startedQuota.sessionId, 'Retake generates unique collision-resistant sessionId');
assert(startedRetake.answers[1].selectedChoice === null, 'Retake starts with clean blank answers (no answer leakage)');

// Candidate scores 5 correct on retake
for (let i = 1; i <= 5; i++) {
  const qRef = CANONICAL_ETS_EXAM_FORM_01.questions[i - 1];
  const qData = getQuestionById(qRef.questionId);
  startedRetake = recordExamAnswer(startedRetake, i, qData?.correctKey ?? 'A').session;
}

const retakeOutcome = finalizeExamSubmission(startedRetake, CANONICAL_ETS_EXAM_FORM_01, 'user_completed');
assert(retakeOutcome.success === true, 'Retake submission succeeds');

// Verify both attempts exist in history
const formHistory = getExamHistoryForForm(CANONICAL_ETS_EXAM_FORM_01.id);
assert(formHistory.length >= 2, `History contains multiple attempts for the same form (found: ${formHistory.length})`);

const attempt1 = formHistory.find((h) => h.sessionId === startedQuota.sessionId);
const attempt2 = formHistory.find((h) => h.sessionId === startedRetake.sessionId);
assert(attempt1 !== undefined && attempt2 !== undefined, 'Both attempt 1 and attempt 2 are present in history');
assert(attempt1?.totalRaw !== attempt2?.totalRaw, 'Attempts store their own distinct scores without overwrite');

// ----------------------------------------------------------------------------
console.log('\n--- SUITE 11: Historical Content Revision Tracking ---');
// ----------------------------------------------------------------------------
const updatedForm: ExamForm = {
  ...CANONICAL_ETS_EXAM_FORM_01,
  id: 'ets-mock-test-01-rev2',
  contentRevision: 2,
};

const startedRev2 = initAndStartSession(updatedForm, 'simulation');

const outcomeRev2 = finalizeExamSubmission(startedRev2, updatedForm, 'user_completed');
assert(outcomeRev2.success === true, 'Submission on Revision 2 succeeds');
assert(outcomeRev2.result?.contentRevision === 2, 'ExamResult records contentRevision: 2');
assert(outcomeRev2.historyEntry?.contentRevision === 2, 'ExamHistoryEntry records contentRevision: 2');

// ----------------------------------------------------------------------------
console.log('\n--- SUITE 12: Strict Mode Media Interruption Disqualification ---');
// ----------------------------------------------------------------------------
// Case A: Strict mode with clean execution
const startedStrictClean = initAndStartSession(STRICT_UNLOCKED_FORM, 'strict');
const resStrictClean = scoreExamSession(startedStrictClean, STRICT_UNLOCKED_FORM);
assert(resStrictClean.integrityStatus.isStrictValid === true, 'Clean strict session qualifies as valid strict result');
assert(resStrictClean.integrityStatus.mediaInterrupted === false, 'mediaInterrupted is false');

// Case B: Strict mode with timeline abnormality
const sessionStrictInterrupted: ExamSession = {
  ...startedStrictClean,
  sessionId: 'strict_interrupted_01',
  integrityFlags: {
    ...startedStrictClean.integrityFlags,
    timelineAbnormal: true,
  },
};
const resStrictInterrupted = scoreExamSession(sessionStrictInterrupted, STRICT_UNLOCKED_FORM);
assert(resStrictInterrupted.integrityStatus.isStrictValid === false, 'Strict session with timeline abnormality is disqualified');
assert(resStrictInterrupted.integrityStatus.mediaInterrupted === true, 'mediaInterrupted is true');
assert(resStrictInterrupted.integrityStatus.summary.includes('gián đoạn'), 'Summary explains media interruption');

// Case C: Strict mode with audio media failure
const sessionStrictAudioFailed: ExamSession = {
  ...startedStrictClean,
  sessionId: 'strict_audio_failed_02',
  status: 'media-failed',
};
const resStrictAudioFailed = scoreExamSession(sessionStrictAudioFailed, STRICT_UNLOCKED_FORM);
assert(resStrictAudioFailed.integrityStatus.isStrictValid === false, 'Strict session with media-failed status is disqualified');

// Case D: Simulation mode
const resSimulation = scoreExamSession(startedBlank, CANONICAL_ETS_EXAM_FORM_01);
assert(resSimulation.integrityStatus.isStrictValid === false, 'Simulation mode is not marked as strict valid');
assert(resSimulation.integrityStatus.summary.includes('Mô phỏng'), 'Summary clarifies simulation mode');

// ----------------------------------------------------------------------------
console.log('\n--- SUITE 13: Zero Interference with Cold Storage ---');
// ----------------------------------------------------------------------------
const COLD_STORAGE_KEY = 'toeic_mastery_data_v2_cold';
const mockColdProfile = JSON.stringify({
  profile: { name: 'Hoang Learner', currentScore: 650, targetScore: 850, streakDays: 14 },
});
mockStorage.setItem(COLD_STORAGE_KEY, mockColdProfile);

// Run full suite operations (new session, submit, store, query)
const startedIso = initAndStartSession(CANONICAL_ETS_EXAM_FORM_01, 'simulation');
finalizeExamSubmission(startedIso, CANONICAL_ETS_EXAM_FORM_01, 'user_completed');

// Verify cold storage data is strictly unmodified byte-for-byte
const coldDataAfter = mockStorage.getItem(COLD_STORAGE_KEY);
assert(coldDataAfter === mockColdProfile, 'ZERO-INTERFERENCE: toeic_mastery_data_v2_cold completely unmodified');
const parsedCold = JSON.parse(coldDataAfter!);
assert(parsedCold.profile.currentScore === 650, 'UserProfile currentScore remains 650 (not overwritten)');
assert(parsedCold.profile.targetScore === 850, 'UserProfile targetScore remains 850 (not overwritten)');

// ============================================================================
// SUMMARY REPORT
// ============================================================================
console.log('\n================================================================');
console.log(`TOTAL TESTS RUN:    ${testsRun}`);
console.log(`TOTAL TESTS PASSED: ${testsPassed}`);
console.log(`TOTAL TESTS FAILED: ${testsFailed}`);
console.log('================================================================\n');

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL ASSERTIONS PASSED! Phase 16 Scoring, Submission & History Validated.\n');
  process.exit(0);
}
