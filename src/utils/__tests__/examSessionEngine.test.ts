/**
 * TOEIC Mastery Hub — Exam Session State Machine & Persistence Test Suite (Phase 10)
 *
 * Exhaustive targeted test coverage:
 * 1. Session Initialization & 200-Answer Mapping Integrity
 * 2. Preflight Verification, Readiness Status & Strict Lock Enforcement
 * 3. Lifecycle State Transitions & Double-Start Protection
 * 4. Strict Mode Navigation & Section Boundary Enforcement
 * 5. Answer Modifications, Part 2 Constraints & Post-Submit Locks
 * 6. Interruption, Resume & Wall-Clock Deadline Evaluation
 * 7. Storage Persistence, Quota Errors, Corrupted JSON & Overwrite Guards
 * 8. Zero-Cloud Isolation & Non-Interference with Cold Storage
 */

import {
  createExamSession,
  executePreflightCheck,
  startExam,
  transitionToReading,
  submitExam,
  recordExamAnswer,
  toggleQuestionFlag,
  navigateToQuestion,
  updatePlaybackCheckpoint,
  evaluateSessionTimeouts,
  interruptExamSession,
  resumeExamSession,
  getPartForQuestionNumber,
  getSectionForQuestionNumber,
  SESSION_SCHEMA_VERSION,
  ETS_LISTENING_DURATION_SECONDS,
  ETS_READING_DURATION_SECONDS,
  ETS_OVERALL_DURATION_SECONDS,
} from '../examSessionEngine';
import {
  saveActiveExamSession,
  loadActiveExamSession,
  startNewExamSession,
  clearActiveExamSession,
  archiveCompletedExamSession,
  getExamSessionHistory,
  clearExamSessionHistory,
  ACTIVE_EXAM_SESSION_KEY,
  EXAM_SESSION_HISTORY_KEY,
} from '../examSessionStorage';
import { CANONICAL_ETS_EXAM_FORM_01 } from '../../data/examForms/etsMockForm01';
import { ExamForm } from '../../types/mockExam';

// In-memory mock localStorage for Node testing environment
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
    console.log(`  ✓ PASS: ${message}`);
  } else {
    testsFailed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('================================================================');
console.log('PHASE 10: EXAM SESSION STATE MACHINE & PERSISTENCE TEST SUITE');
console.log('================================================================\n');

// ----------------------------------------------------------------------------
// SUITE 1: SESSION INITIALIZATION & 200-ANSWER MAPPING INTEGRITY
// ----------------------------------------------------------------------------
console.log('--- SUITE 1: Session Initialization & 200-Answer Mapping ---');

const baseSession = createExamSession(
  { examFormId: CANONICAL_ETS_EXAM_FORM_01.id, mode: 'simulation' },
  CANONICAL_ETS_EXAM_FORM_01,
  { now: 1000000, idGenerator: () => 'test_session_001' }
);

assert(baseSession.sessionId === 'test_session_001', 'Session ID generated deterministically');
assert(baseSession.status === 'preflight', 'Initial status is "preflight"');
assert(baseSession.schemaVersion === SESSION_SCHEMA_VERSION, 'Schema version matches 1.0.0');
assert(baseSession.contentRevision === 1, 'Content revision matches canonical form (1)');
assert(baseSession.currentSection === 'listening', 'Current section initialized to "listening"');
assert(baseSession.currentPart === 1, 'Current part initialized to Part 1');
assert(baseSession.currentQuestionNumber === 1, 'Current question initialized to Question 1');
assert(baseSession.mode === 'simulation', 'Mode initialized to "simulation"');
assert(Object.keys(baseSession.answers).length === 200, 'Answers mapping has exactly 200 entries');
assert(baseSession.answers[1].globalQuestionNumber === 1, 'Question 1 slot initialized');
assert(baseSession.answers[1].selectedChoice === null, 'Question 1 choice initialized to null');
assert(baseSession.answers[200].globalQuestionNumber === 200, 'Question 200 slot initialized');
assert(baseSession.answers[200].selectedChoice === null, 'Question 200 choice initialized to null');
assert(Object.keys(baseSession.flaggedQuestions).length === 200, 'Flagged questions mapping has 200 entries');
assert(baseSession.integrityFlags.preflightPassed === false, 'Preflight flag initially false');

// Part bounds and section resolvers
assert(getPartForQuestionNumber(1) === 1 && getPartForQuestionNumber(6) === 1, 'Part 1 range (1-6) resolved');
assert(getPartForQuestionNumber(7) === 2 && getPartForQuestionNumber(31) === 2, 'Part 2 range (7-31) resolved');
assert(getPartForQuestionNumber(32) === 3 && getPartForQuestionNumber(70) === 3, 'Part 3 range (32-70) resolved');
assert(getPartForQuestionNumber(71) === 4 && getPartForQuestionNumber(100) === 4, 'Part 4 range (71-100) resolved');
assert(getPartForQuestionNumber(101) === 5 && getPartForQuestionNumber(130) === 5, 'Part 5 range (101-130) resolved');
assert(getPartForQuestionNumber(131) === 6 && getPartForQuestionNumber(146) === 6, 'Part 6 range (131-146) resolved');
assert(getPartForQuestionNumber(147) === 7 && getPartForQuestionNumber(200) === 7, 'Part 7 range (147-200) resolved');
assert(getSectionForQuestionNumber(1) === 'listening' && getSectionForQuestionNumber(100) === 'listening', 'Listening section resolved for 1-100');
assert(getSectionForQuestionNumber(101) === 'reading' && getSectionForQuestionNumber(200) === 'reading', 'Reading section resolved for 101-200');

// Form with invalid questions count rejected
try {
  const invalidForm = { ...CANONICAL_ETS_EXAM_FORM_01, questions: [] } as unknown as ExamForm;
  createExamSession({ examFormId: 'invalid', mode: 'simulation' }, invalidForm);
  assert(false, 'Expected error when creating session with empty questions');
} catch (e: unknown) {
  assert(e instanceof Error && e.message.includes('200 questions'), 'Rejects form without 200 questions');
}

// ----------------------------------------------------------------------------
// SUITE 2: PREFLIGHT VERIFICATION & READINESS ENFORCEMENT
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 2: Preflight Verification & Readiness Enforcement ---');

// Preflight simulation mode success
const simPreflight = executePreflightCheck(baseSession, CANONICAL_ETS_EXAM_FORM_01);
assert(simPreflight.success === true, 'Preflight check passes in simulation mode for canonical form');
assert(simPreflight.session.status === 'ready', 'Session status transitions to "ready"');
assert(simPreflight.session.integrityFlags.preflightPassed === true, 'preflightPassed flag set to true');

// Preflight strict mode locked enforcement (Phase 9 transparency rule)
const strictSession = createExamSession(
  { examFormId: CANONICAL_ETS_EXAM_FORM_01.id, mode: 'strict' },
  CANONICAL_ETS_EXAM_FORM_01,
  { now: 1000000, idGenerator: () => 'strict_session_001' }
);
const strictPreflight = executePreflightCheck(strictSession, CANONICAL_ETS_EXAM_FORM_01);
assert(strictPreflight.success === false, 'Preflight check fails for strict mode when strictLocked: true');
assert(strictPreflight.code === 'STRICT_MODE_LOCKED', 'Returns STRICT_MODE_LOCKED code');
assert(strictPreflight.session.status === 'media-failed', 'Session status transitions to "media-failed"');
assert(strictPreflight.session.integrityFlags.isAudioMissing === true, 'Audio missing flag set');

// Preflight form ID mismatch
const mismatchedSession = { ...baseSession, examFormId: 'other-form-id' };
const mismatchPreflight = executePreflightCheck(mismatchedSession, CANONICAL_ETS_EXAM_FORM_01);
assert(mismatchPreflight.success === false, 'Preflight fails on form ID mismatch');
assert(mismatchPreflight.code === 'FORM_ID_MISMATCH', 'Returns FORM_ID_MISMATCH code');
assert(mismatchPreflight.session.status === 'invalid', 'Transitions to "invalid"');

// Preflight content revision mismatch
const outdatedRevisionSession = { ...baseSession, contentRevision: 99 };
const revisionPreflight = executePreflightCheck(outdatedRevisionSession, CANONICAL_ETS_EXAM_FORM_01);
assert(revisionPreflight.success === false, 'Preflight fails on content revision mismatch');
assert(revisionPreflight.code === 'REVISION_MISMATCH', 'Returns REVISION_MISMATCH code');
assert(revisionPreflight.session.status === 'recovery-required', 'Transitions to "recovery-required"');

// ----------------------------------------------------------------------------
// SUITE 3: LIFECYCLE TRANSITIONS & DOUBLE-START PROTECTION
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 3: Lifecycle Transitions & Double-Start Protection ---');

const readySession = simPreflight.session;

// Cannot start from preflight directly
const unreadyStart = startExam(baseSession);
assert(unreadyStart.success === false, 'Cannot start session while in "preflight" status');
assert(unreadyStart.code === 'PREFLIGHT_REQUIRED', 'Returns PREFLIGHT_REQUIRED code');

// Start exam -> transitions to listening
const startResult = startExam(readySession, { now: 2000000 });
assert(startResult.success === true, 'startExam transitions ready session to "listening"');
const listeningSession = startResult.session;
assert(listeningSession.status === 'listening', 'Status is "listening"');
assert(listeningSession.startedAt === 2000000, 'startedAt timestamp recorded');
assert(listeningSession.sectionStartedAt === 2000000, 'sectionStartedAt timestamp recorded');
assert(
  listeningSession.listeningDeadline === 2000000 + ETS_LISTENING_DURATION_SECONDS * 1000,
  'listeningDeadline calculated to exactly 45 minutes'
);
assert(
  listeningSession.overallDeadline === 2000000 + ETS_OVERALL_DURATION_SECONDS * 1000,
  'overallDeadline calculated to exactly 120 minutes'
);
assert(listeningSession.playbackCheckpoint.audioState === 'playing', 'Playback state set to "playing"');

// Double-start protection
const doubleStart = startExam(listeningSession, { now: 2005000 });
assert(doubleStart.success === false, 'Double-start prevented when session is already in "listening"');
assert(doubleStart.code === 'DOUBLE_START_FORBIDDEN', 'Returns DOUBLE_START_FORBIDDEN code');

// Transition to reading
const readingResult = transitionToReading(listeningSession, { now: 2500000 });
assert(readingResult.success === true, 'transitionToReading transitions session to "reading"');
const readingSession = readingResult.session;
assert(readingSession.status === 'reading', 'Status is "reading"');
assert(readingSession.currentSection === 'reading', 'Current section updated to "reading"');
assert(readingSession.currentPart === 5, 'Current part advanced to Part 5');
assert(readingSession.currentQuestionNumber === 101, 'Current question advanced to 101');
assert(readingSession.listeningElapsedSeconds === 500, 'listeningElapsedSeconds finalized (500s)');
assert(
  readingSession.readingDeadline === 2500000 + ETS_READING_DURATION_SECONDS * 1000,
  'readingDeadline calculated to 75 minutes from section start'
);
assert(readingSession.playbackCheckpoint.audioState === 'ended', 'Audio playback stopped for reading');

// Double section transition blocked
const doubleReading = transitionToReading(readingSession, { now: 2600000 });
assert(doubleReading.success === false, 'Cannot transition to reading twice');
assert(doubleReading.code === 'ALREADY_IN_READING', 'Returns ALREADY_IN_READING code');

// Double-start while in reading blocked
const doubleStartInReading = startExam(readingSession, { now: 2600000 });
assert(doubleStartInReading.success === false, 'Cannot call startExam while in "reading" section');
assert(doubleStartInReading.code === 'DOUBLE_START_FORBIDDEN', 'Returns DOUBLE_START_FORBIDDEN code');

// Submit exam
const submitResult = submitExam(readingSession, 'user_completed', { now: 3000000 });
assert(submitResult.success === true, 'submitExam successfully transitions session to "submitted"');
const submittedSession = submitResult.session;
assert(submittedSession.status === 'submitted', 'Status is "submitted"');
assert(submittedSession.submitReason === 'user_completed', 'Submit reason recorded');
assert(submittedSession.submittedAt === 3000000, 'submittedAt timestamp recorded');
assert(submittedSession.readingElapsedSeconds === 500, 'readingElapsedSeconds recorded (500s)');
assert(submittedSession.elapsedSeconds === 1000, 'Total elapsedSeconds is sum of L + R (1000s)');

// Resubmit blocked
const doubleSubmit = submitExam(submittedSession, 'user_completed');
assert(doubleSubmit.success === false, 'Resubmitting already submitted session is rejected');
assert(doubleSubmit.code === 'ALREADY_SUBMITTED', 'Returns ALREADY_SUBMITTED code');

// ----------------------------------------------------------------------------
// SUITE 4: STRICT MODE NAVIGATION & SECTION BOUNDARY RULES
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 4: Strict Mode Navigation & Section Boundary Rules ---');

// Mock strict session in listening
const mockStrictListening: typeof listeningSession = {
  ...listeningSession,
  mode: 'strict',
  status: 'listening',
};

// Strict mode: forward jump to Reading (101-200) forbidden during Listening
const jumpToReading = navigateToQuestion(mockStrictListening, 105);
assert(jumpToReading.success === false, 'Strict mode forbids navigating to reading questions during listening');
assert(jumpToReading.code === 'STRICT_NAVIGATION_BLOCKED', 'Returns STRICT_NAVIGATION_BLOCKED code');

// Strict mode: answering Reading question during Listening forbidden
const answerReadingInListening = recordExamAnswer(mockStrictListening, 105, 'B');
assert(answerReadingInListening.success === false, 'Strict mode forbids answering reading question during listening');
assert(answerReadingInListening.code === 'STRICT_SECTION_LOCKED', 'Returns STRICT_SECTION_LOCKED code');

// Mock strict session in reading
const mockStrictReading: typeof readingSession = {
  ...readingSession,
  mode: 'strict',
  status: 'reading',
};

// Strict mode: backward jump to Listening (1-100) forbidden during Reading
const jumpToListening = navigateToQuestion(mockStrictReading, 50);
assert(jumpToListening.success === false, 'Strict mode forbids navigating back to listening questions during reading');
assert(jumpToListening.code === 'STRICT_NAVIGATION_BLOCKED', 'Returns STRICT_NAVIGATION_BLOCKED code');

// Strict mode: modifying Listening answer during Reading forbidden
const answerListeningInReading = recordExamAnswer(mockStrictReading, 50, 'A');
assert(answerListeningInReading.success === false, 'Strict mode forbids modifying listening answer during reading');
assert(answerListeningInReading.code === 'STRICT_SECTION_LOCKED', 'Returns STRICT_SECTION_LOCKED code');

// Strict mode: flagging Listening question during Reading forbidden
const flagListeningInReading = toggleQuestionFlag(mockStrictReading, 50);
assert(flagListeningInReading.success === false, 'Strict mode forbids toggling flag for listening question during reading');
assert(flagListeningInReading.code === 'STRICT_SECTION_LOCKED', 'Returns STRICT_SECTION_LOCKED code');

// Simulation mode: navigation across bounds permitted
const simNavToListening = navigateToQuestion(readingSession, 50);
assert(simNavToListening.success === true, 'Simulation mode allows navigating back to Part 3 question 50');
assert(simNavToListening.session.currentQuestionNumber === 50, 'Current question updated to 50');
assert(simNavToListening.session.currentPart === 3, 'Current part updated to Part 3');
assert(simNavToListening.session.currentSection === 'listening', 'Current section updated to listening');

// ----------------------------------------------------------------------------
// SUITE 5: ANSWER MODIFICATIONS, PART 2 CONSTRAINTS & POST-SUBMIT LOCKS
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 5: Answer Modifications, Part 2 Constraints & Submit Locks ---');

// Record answer in listening section
const ans1 = recordExamAnswer(listeningSession, 1, 'B', 15, { now: 2010000 });
assert(ans1.success === true, 'Successfully recorded answer for Question 1');
assert(ans1.session.answers[1].selectedChoice === 'B', 'Choice "B" saved');
assert(ans1.session.answers[1].timeSpentSeconds === 15, 'timeSpentSeconds accumulated (15s)');
assert(ans1.session.answers[1].answeredAt === 2010000, 'answeredAt recorded');

// Part 2 option constraint: A, B, C only (Choice 'D' is invalid)
const part2Invalid = recordExamAnswer(listeningSession, 10, 'D');
assert(part2Invalid.success === false, 'Part 2 rejects choice "D"');
assert(part2Invalid.code === 'INVALID_CHOICE_FOR_PART', 'Returns INVALID_CHOICE_FOR_PART code');

const part2Valid = recordExamAnswer(listeningSession, 10, 'C');
assert(part2Valid.success === true, 'Part 2 accepts choice "C"');
assert(part2Valid.session.answers[10].selectedChoice === 'C', 'Choice "C" recorded for Question 10');

// Toggle flag
const flagResult = toggleQuestionFlag(listeningSession, 1);
assert(flagResult.success === true, 'Flag toggled for Question 1');
assert(flagResult.session.flaggedQuestions[1] === true, 'flaggedQuestions[1] is true');
assert(flagResult.session.answers[1].isMarkedForReview === true, 'Answer isMarkedForReview synchronized');

// Post-submit lock: Cannot modify answers once submitted
const postSubmitAnswer = recordExamAnswer(submittedSession, 1, 'C');
assert(postSubmitAnswer.success === false, 'Answers locked after submission');
assert(postSubmitAnswer.code === 'ANSWERS_LOCKED', 'Returns ANSWERS_LOCKED code');

// Post-submit lock: Cannot toggle flags once submitted
const postSubmitFlag = toggleQuestionFlag(submittedSession, 1);
assert(postSubmitFlag.success === false, 'Flags locked after submission');
assert(postSubmitFlag.code === 'FLAGS_LOCKED', 'Returns FLAGS_LOCKED code');

// Post-submit lock: Stale callback cannot update playback checkpoint
const staleCheckpoint = updatePlaybackCheckpoint(submittedSession, { playbackPositionMs: 5000 });
assert(staleCheckpoint.success === false, 'Stale checkpoint update rejected after submission');
assert(staleCheckpoint.code === 'SESSION_TERMINATED', 'Returns SESSION_TERMINATED code');

// ----------------------------------------------------------------------------
// SUITE 6: INTERRUPTION, RESUME & WALL-CLOCK DEADLINE EVALUATION
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 6: Interruption, Resume & Wall-Clock Evaluation ---');

// Interrupt session
const interruptRes = interruptExamSession(readingSession, 'page_hidden');
assert(interruptRes.success === true, 'Session successfully interrupted');
assert(interruptRes.session.status === 'interrupted', 'Status changed to "interrupted"');
assert(interruptRes.session.playbackCheckpoint.audioState === 'paused', 'Playback state paused');
assert(interruptRes.session.integrityFlags.hasRecoveryWarning === true, 'hasRecoveryWarning flag raised');

// Resume session within deadline
const resumeRes = resumeExamSession(interruptRes.session, 2600000);
assert(resumeRes.success === true, 'Interrupted session successfully resumed within deadline');
assert(resumeRes.session.status === 'reading', 'Status restored to "reading"');
assert(resumeRes.session.integrityFlags.hasRecoveryWarning === false, 'Recovery warning cleared');

// Wall-clock listening deadline expiration
const expiredListening = { ...listeningSession, listeningDeadline: 2100000 };
const timeoutListening = evaluateSessionTimeouts(expiredListening, 2200000);
assert(timeoutListening.success === true, 'Listening timeout evaluated');
assert(timeoutListening.session.status === 'reading', 'Listening timeout automatically transitions session to reading');

// Wall-clock reading deadline expiration
const expiredReading = { ...readingSession, readingDeadline: 2700000 };
const timeoutReading = evaluateSessionTimeouts(expiredReading, 2800000);
assert(timeoutReading.success === true, 'Reading timeout evaluated');
assert(timeoutReading.session.status === 'submitted', 'Reading timeout automatically submits session');
assert(timeoutReading.session.submitReason === 'timeout_reading', 'submitReason is "timeout_reading"');

// Wall-clock overall deadline expiration
const expiredOverall = { ...readingSession, overallDeadline: 2800000 };
const timeoutOverall = evaluateSessionTimeouts(expiredOverall, 2900000);
assert(timeoutOverall.success === true, 'Overall deadline evaluated');
assert(timeoutOverall.session.status === 'submitted', 'Overall timeout automatically submits session');
assert(timeoutOverall.session.submitReason === 'timeout_overall', 'submitReason is "timeout_overall"');

// ----------------------------------------------------------------------------
// SUITE 7: STORAGE PERSISTENCE, QUOTA ERRORS & OVERWRITE GUARDS
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 7: Storage Persistence, Quota Errors & Overwrite Guards ---');

mockStorage.clear();

// Save active session
const saveRes = saveActiveExamSession(readingSession);
assert(saveRes.success === true, 'saveActiveExamSession succeeds');
assert(saveRes.data?.lastSavedAt !== undefined, 'lastSavedAt updated on successful save');
assert(mockStorage.getItem(ACTIVE_EXAM_SESSION_KEY) !== null, 'Data written to LocalStorage key');

// Inspect lean payload: Ensure NO raw question text or stimuli leaked into storage
const storedJson = mockStorage.getItem(ACTIVE_EXAM_SESSION_KEY)!;
assert(!storedJson.includes('questionText'), 'Zero-copy: Stored payload contains no questionText');
assert(!storedJson.includes('stimulus'), 'Zero-copy: Stored payload contains no stimulus');
assert(!storedJson.includes('audioScript'), 'Zero-copy: Stored payload contains no audioScript');

// QuotaExceededError detection
mockStorage.shouldThrowQuota = true;
const quotaRes = saveActiveExamSession(readingSession);
assert(quotaRes.success === false, 'saveActiveExamSession detects storage quota failure');
assert(quotaRes.code === 'QUOTA_EXCEEDED', 'Returns QUOTA_EXCEEDED code');
assert(quotaRes.error?.includes('quota exceeded') === true, 'Clear quota error message');
mockStorage.shouldThrowQuota = false;

// Overwrite protection: Reject replacing unfinished active session
const newSessionAttempt = createExamSession(
  { examFormId: CANONICAL_ETS_EXAM_FORM_01.id, mode: 'simulation' },
  CANONICAL_ETS_EXAM_FORM_01,
  { idGenerator: () => 'new_competing_session' }
);
const blockedOverwrite = startNewExamSession(newSessionAttempt, { forceReplace: false });
assert(blockedOverwrite.success === false, 'startNewExamSession rejects overwrite without forceReplace');
assert(blockedOverwrite.code === 'UNFINISHED_SESSION_EXISTS', 'Returns UNFINISHED_SESSION_EXISTS code');

// React StrictMode idempotent reload: Same session ID allowed
const sameSessionReload = startNewExamSession(readingSession, { forceReplace: false });
assert(sameSessionReload.success === true, 'React StrictMode same sessionId reload is permitted idempotently');

// Force replace replaces and archives previous unfinished session
const forceReplaceRes = startNewExamSession(newSessionAttempt, { forceReplace: true });
assert(forceReplaceRes.success === true, 'forceReplace: true successfully overwrites previous session');
const archivedAfterReplace = getExamSessionHistory();
assert(archivedAfterReplace.length === 1, 'Previous unfinished session was archived to history');
assert(archivedAfterReplace[0].submitReason === 'abandoned', 'Archived session marked as abandoned');

// Corrupted JSON detection on reload
mockStorage.setItem(ACTIVE_EXAM_SESSION_KEY, 'invalid-json{{{');
const corruptLoad = loadActiveExamSession(() => CANONICAL_ETS_EXAM_FORM_01);
assert(corruptLoad.success === false, 'loadActiveExamSession catches malformed JSON');
assert(corruptLoad.code === 'CORRUPTED_JSON', 'Returns CORRUPTED_JSON code');
assert(mockStorage.getItem(ACTIVE_EXAM_SESSION_KEY) === null, 'Corrupted key automatically purged from storage');

// Normal load on F5/browser reload
saveActiveExamSession(readingSession);
const normalLoad = loadActiveExamSession(
  (id) => (id === CANONICAL_ETS_EXAM_FORM_01.id ? CANONICAL_ETS_EXAM_FORM_01 : undefined),
  2600000 // Within 2500000 + 4500000 reading deadline
);
assert(normalLoad.success === true, 'loadActiveExamSession restores valid session');
assert(normalLoad.data?.sessionId === readingSession.sessionId, 'Session ID matches restored data');
assert(normalLoad.data?.status === 'reading', 'Status correctly restored to "reading"');

// Form revision mismatch on reload transitions to 'recovery-required'
saveActiveExamSession(readingSession);
const bumpedRevisionForm = { ...CANONICAL_ETS_EXAM_FORM_01, contentRevision: 2 };
const mismatchLoad = loadActiveExamSession(
  (id) => (id === CANONICAL_ETS_EXAM_FORM_01.id ? bumpedRevisionForm : undefined),
  2600000
);
assert(mismatchLoad.success === true, 'Handles revision mismatch gracefully');
assert(mismatchLoad.data?.status === 'recovery-required', 'Sets status to "recovery-required" on revision change');
assert(mismatchLoad.data?.integrityFlags.isRevisionMismatch === true, 'isRevisionMismatch flag set');

// Reload with expired session auto-submits and archives
const expiredSessionToSave = {
  ...readingSession,
  sessionId: 'expired_session_test',
  readingDeadline: 1000, // in the past
};
mockStorage.setItem(ACTIVE_EXAM_SESSION_KEY, JSON.stringify(expiredSessionToSave));
const expiredReload = loadActiveExamSession(
  (id) => (id === CANONICAL_ETS_EXAM_FORM_01.id ? CANONICAL_ETS_EXAM_FORM_01 : undefined),
  2000000 // current time
);
assert(expiredReload.success === true, 'loadActiveExamSession evaluates expired session');
assert(expiredReload.data?.status === 'submitted', 'Automatically finalized to "submitted"');
assert(expiredReload.data?.submitReason === 'timeout_reading', 'submitReason set to timeout_reading');
assert(mockStorage.getItem(ACTIVE_EXAM_SESSION_KEY) === null, 'Active storage cleared after auto-submit');

// ----------------------------------------------------------------------------
// SUITE 8: ZERO-CLOUD ISOLATION & NON-INTERFERENCE WITH COLD STORAGE
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 8: Storage Isolation & Non-Interference ---');

const COLD_STORAGE_KEY = 'toeic_mastery_data_v2_cold';
const PRACTICE_KEY = 'toeic_practice_active_session_v1';

const coldDataSample = JSON.stringify({ profile: { name: 'User1', streakDays: 5 } });
const practiceDataSample = JSON.stringify({ sessionId: 'practice_99', status: 'active' });

mockStorage.setItem(COLD_STORAGE_KEY, coldDataSample);
mockStorage.setItem(PRACTICE_KEY, practiceDataSample);

// Perform full sequence of exam session operations
const isolatedSession = createExamSession(
  { examFormId: CANONICAL_ETS_EXAM_FORM_01.id, mode: 'simulation' },
  CANONICAL_ETS_EXAM_FORM_01
);
saveActiveExamSession(isolatedSession);
archiveCompletedExamSession(isolatedSession);
clearActiveExamSession();
clearExamSessionHistory();

// Verify Cold Storage and Practice Storage remain strictly identical
assert(
  mockStorage.getItem(COLD_STORAGE_KEY) === coldDataSample,
  'ZERO-INTERFERENCE: toeic_mastery_data_v2_cold completely unmodified'
);
assert(
  mockStorage.getItem(PRACTICE_KEY) === practiceDataSample,
  'ZERO-INTERFERENCE: toeic_practice_active_session_v1 completely unmodified'
);

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
  console.log('🎉 ALL 75+ ASSERTIONS PASSED! Phase 10 Exam Session Engine & Persistence Validated.\n');
  process.exit(0);
}
