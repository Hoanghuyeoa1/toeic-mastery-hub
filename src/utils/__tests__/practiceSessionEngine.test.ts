/**
 * TOEIC Mastery Hub — Practice Session Engine & Storage Targeted Tests (Phase 5)
 *
 * Verifies session lifecycle, state transitions, answer locking, real wall-clock deadlines,
 * background timer accuracy, auto-submit idempotency, persistence & resume,
 * referential integrity against Question Bank, overwrite protection, and quota handling.
 */

import {
  createPracticeSession,
  setSessionAnswer,
  toggleSessionMark,
  navigateSession,
  nextQuestion,
  previousQuestion,
  recordAssistance,
  submitSession,
  abandonSession,
  getSessionRemainingSeconds,
  isSessionExpired,
  checkAndApplyTimeout,
  getSessionProgress,
  validateSessionIntegrity,
} from '../practiceSessionEngine';

import {
  ACTIVE_PRACTICE_SESSION_KEY,
  PRACTICE_HISTORY_KEY,
  saveActiveSession,
  loadActiveSession,
  startNewActiveSession,
  clearActiveSession,
  archiveCompletedSession,
  loadPracticeHistory,
  exportPracticeStorageData,
  importPracticeStorageData,
  checkHasUnfinishedActiveSession,
} from '../practiceSessionStorage';

import { FULL_QUESTION_BANK_MANIFEST } from '../../data/questionBank';
import { PracticeSessionData } from '../../types/practiceSession';

// Simple in-memory storage polyfill for test environment
class MockLocalStorage implements Storage {
  private store: Map<string, string> = new Map();
  public shouldThrowQuota = false;

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    if (this.shouldThrowQuota) {
      const err = new DOMException('The quota has been exceeded.', 'QuotaExceededError');
      throw err;
    }
    this.store.set(key, String(value));
  }
}

// Bind mock storage to globalThis for tests
const mockStorage = new MockLocalStorage();
(globalThis as unknown as { localStorage: Storage }).localStorage = mockStorage;

// Test Runner State
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, details?: string): void {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName}${details ? ` -> ${details}` : ''}`);
  }
}

console.log('\n======================================================');
console.log('🧪 RUNNING PRACTICE SESSION ENGINE & STORAGE TESTS (PHASE 5)');
console.log('======================================================\n');

// ----------------------------------------------------
// SUITE 1: Session Lifecycle & State Transitions
// ----------------------------------------------------
console.log('--- Suite 1: Session Lifecycle & State Transitions ---');

{
  const mockNow = 1700000000000;
  const session = createPracticeSession(
    {
      part: 1,
      difficulty: 'medium',
      mode: 'practice',
      questionIds: ['q-p1-001', 'q-p1-002', 'q-p1-003'],
      groupIds: [],
    },
    { now: mockNow, idGenerator: () => 'test-session-001' }
  );

  assert(session.sessionId === 'test-session-001', '1.1 Session ID matches generator');
  assert(session.status === 'active', '1.1 Initial status is active');
  assert(session.currentQuestionIndex === 0, '1.1 Initial question index is 0');
  assert(session.questionIds.length === 3, '1.1 Has 3 question IDs');
  assert(
    session.answers['q-p1-001'] === null && session.answers['q-p1-002'] === null,
    '1.1 Initial answers are all null'
  );
  assert(
    session.markedForReview['q-p1-001'] === false && session.markedForReview['q-p1-002'] === false,
    '1.1 Initial markedForReview flags are all false'
  );
  assert(session.startedAt === mockNow, '1.1 StartedAt matches initial timestamp');

  // 1.2 Rejects empty questionIds
  let threwEmpty = false;
  try {
    createPracticeSession({
      part: 1,
      difficulty: 'easy',
      mode: 'practice',
      questionIds: [],
      groupIds: [],
    });
  } catch {
    threwEmpty = true;
  }
  assert(threwEmpty, '1.2 Rejects session creation with empty question list');

  // 1.3 Setting answer modifies specific question
  const ansResult1 = setSessionAnswer(session, 'q-p1-001', 'A');
  assert(ansResult1.success, '1.3 Setting answer returns success');
  assert(ansResult1.session.answers['q-p1-001'] === 'A', '1.3 Answer for q-p1-001 updated to A');
  assert(ansResult1.session.answers['q-p1-002'] === null, '1.3 Other answers remain unchanged');

  // 1.4 Changing answers while active
  const ansResult2 = setSessionAnswer(ansResult1.session, 'q-p1-001', 'C');
  assert(ansResult2.session.answers['q-p1-001'] === 'C', '1.4 Can change answer while active');

  // 1.5 Rejects invalid question ID
  const ansResultInvalid = setSessionAnswer(session, 'non-existent-q', 'B');
  assert(!ansResultInvalid.success, '1.5 Rejects setting answer for non-existent question');

  // 1.6 Marking for review
  const marked1 = toggleSessionMark(session, 'q-p1-002');
  assert(marked1.markedForReview['q-p1-002'] === true, '1.6 Toggles marked flag to true');
  const marked2 = toggleSessionMark(marked1, 'q-p1-002');
  assert(marked2.markedForReview['q-p1-002'] === false, '1.6 Toggles marked flag back to false');

  // 1.7 Navigation bounds & data preservation
  const navSession = setSessionAnswer(session, 'q-p1-001', 'D').session;
  const nav1 = nextQuestion(navSession);
  assert(nav1.currentQuestionIndex === 1, '1.7 NextQuestion moves to index 1');
  assert(nav1.answers['q-p1-001'] === 'D', '1.7 Navigation preserves entered answers');

  const navOver = navigateSession(navSession, 999);
  assert(navOver.currentQuestionIndex === 2, '1.7 Upper boundary clamped to last index');

  const navUnder = navigateSession(navSession, -10);
  assert(navUnder.currentQuestionIndex === 0, '1.7 Lower boundary clamped to 0');

  const navBack = previousQuestion(nav1);
  assert(navBack.currentQuestionIndex === 0, '1.7 PreviousQuestion moves back to index 0');

  // 1.8 Submitting session & Answer Lock
  const submitRes = submitSession(navSession, 'user', mockNow + 120000);
  assert(submitRes.session.status === 'submitted', '1.8 Status transitions to submitted');
  assert(submitRes.session.elapsedSeconds === 120, '1.8 Elapsed seconds calculated correctly (120s)');
  assert(!submitRes.alreadySubmitted, '1.8 alreadySubmitted flag is false on first submit');

  // Attempt to set answer after submit MUST be rejected
  const lockedRes = setSessionAnswer(submitRes.session, 'q-p1-001', 'B');
  assert(!lockedRes.success, '1.8 Answer changes locked and rejected after submit');
  assert(lockedRes.session.answers['q-p1-001'] === 'D', '1.8 Answer remains original value');

  // 1.9 Abandoning session
  const abandonedSession = abandonSession(session, mockNow + 30000);
  assert(abandonedSession.status === 'abandoned', '1.9 Status transitions to abandoned');
  assert(abandonedSession.metadata.submitReason === 'abandoned', '1.9 Submit reason is abandoned');
}

// ----------------------------------------------------
// SUITE 2: Practice Mode & Assistance Tracking
// ----------------------------------------------------
console.log('\n--- Suite 2: Practice Mode & Assistance Tracking ---');

{
  const mockNow = 1700000000000;
  const session = createPracticeSession(
    {
      part: 5,
      difficulty: 'mixed',
      mode: 'practice',
      questionIds: ['q-p5-001', 'q-p5-002', 'q-p5-003'],
      groupIds: [],
    },
    { now: mockNow }
  );

  // 2.1 Untimed mode has no deadline
  assert(session.deadline === undefined, '2.1 Practice mode has no deadline');
  assert(getSessionRemainingSeconds(session) === null, '2.1 getSessionRemainingSeconds returns null');

  // 2.2 Record assistance
  const assisted1 = recordAssistance(session, 'q-p5-001', 'answer', mockNow + 10000);
  const q1Record = assisted1.metadata.assistedQuestions['q-p5-001'];
  assert(q1Record?.viewedAnswer === true, '2.2 Tracks viewedAnswer flag');
  assert(q1Record?.viewCount === 1, '2.2 Increments viewCount to 1');

  // 2.3 Multiple assistance calls accumulate
  const assisted2 = recordAssistance(assisted1, 'q-p5-001', 'explanation', mockNow + 15000);
  const q1Record2 = assisted2.metadata.assistedQuestions['q-p5-001'];
  assert(q1Record2?.viewedAnswer === true, '2.3 Preserves previously viewed answer flag');
  assert(q1Record2?.viewedExplanation === true, '2.3 Adds viewed explanation flag');
  assert(q1Record2?.viewCount === 2, '2.3 Increments viewCount to 2');

  // 2.4 Differentiate unassisted vs assisted
  assert(
    assisted2.metadata.assistedQuestions['q-p5-002'] === undefined,
    '2.4 Question q-p5-002 remains completely unassisted'
  );
}

// ----------------------------------------------------
// SUITE 3: Timed Practice, Real Wall-Clock Deadlines & Idempotency
// ----------------------------------------------------
console.log('\n--- Suite 3: Timed Practice, Real Wall-Clock Deadlines & Idempotency ---');

{
  const mockNow = 1700000000000;
  const duration = 600; // 10 minutes = 600 seconds
  const session = createPracticeSession(
    {
      part: 3,
      difficulty: 'medium',
      mode: 'timed',
      durationSeconds: duration,
      questionIds: ['q-p3-001', 'q-p3-002', 'q-p3-003'],
      groupIds: ['grp-p3-001'],
    },
    { now: mockNow }
  );

  // 3.1 Deadline based on real wall-clock
  const expectedDeadline = mockNow + 600 * 1000;
  assert(session.deadline === expectedDeadline, '3.1 Deadline matches startedAt + duration * 1000');

  // 3.2 Remaining seconds computed from wall-clock
  const remainingAtStart = getSessionRemainingSeconds(session, mockNow);
  assert(remainingAtStart === 600, '3.2 Remaining seconds at start is 600s');

  const advance150s = mockNow + 150000;
  const remaining150s = getSessionRemainingSeconds(session, advance150s);
  assert(remaining150s === 450, '3.2 Advancing wall-clock 150s leaves 450s');

  // 3.3 isSessionExpired
  assert(!isSessionExpired(session, mockNow + 599000), '3.3 Session not expired at 599s');
  assert(isSessionExpired(session, mockNow + 600000), '3.3 Session expired at 600s');
  assert(isSessionExpired(session, mockNow + 605000), '3.3 Session expired past deadline');

  // 3.4 checkAndApplyTimeout auto-submits
  const autoTimeoutSession = checkAndApplyTimeout(session, mockNow + 600500);
  assert(autoTimeoutSession.status === 'expired', '3.4 Auto-timeout status is expired');
  assert(
    autoTimeoutSession.metadata.submitReason === 'auto_timeout',
    '3.4 Auto-timeout submitReason is auto_timeout'
  );
  assert(
    autoTimeoutSession.elapsedSeconds === 600,
    '3.4 Timed elapsed seconds clamped to duration limit (600s)'
  );

  // 3.5 Double-submit protection (idempotency)
  const submitOnce = submitSession(session, 'user', mockNow + 300000);
  assert(submitOnce.session.status === 'submitted', '3.5 First submit succeeds');
  assert(!submitOnce.alreadySubmitted, '3.5 First submit alreadySubmitted is false');

  const submitTwice = submitSession(submitOnce.session, 'auto_timeout', mockNow + 600000);
  assert(submitTwice.alreadySubmitted, '3.5 Second submit is rejected as alreadySubmitted');
  assert(submitTwice.session.status === 'submitted', '3.5 Session status unchanged from first submit');
  assert(submitTwice.session.metadata.submitReason === 'user', '3.5 Submit reason preserved from first submit');

  // 3.6 Background tab simulation
  // Advancing wall-clock directly to 500s computes remaining time correctly without tick drift
  const backgroundNow = mockNow + 500000;
  const remainingBg = getSessionRemainingSeconds(session, backgroundNow);
  assert(remainingBg === 100, '3.6 Background tab return at 500s yields exactly 100s');
}

// ----------------------------------------------------
// SUITE 4: Persistence, Resume & Referential Integrity
// ----------------------------------------------------
console.log('\n--- Suite 4: Persistence, Resume & Referential Integrity ---');

{
  mockStorage.clear();
  const mockNow = 1700000000000;

  const session = createPracticeSession(
    {
      part: 1,
      difficulty: 'easy',
      mode: 'timed',
      durationSeconds: 300,
      questionIds: ['q-p1-001', 'q-p1-002', 'q-p1-003'],
      groupIds: [],
    },
    { now: mockNow }
  );

  // 4.1 Save active session
  const saveRes = saveActiveSession(session);
  assert(saveRes.success, '4.1 Saves active session to storage successfully');
  const rawSaved = mockStorage.getItem(ACTIVE_PRACTICE_SESSION_KEY);
  assert(rawSaved !== null, '4.1 LocalStorage has active session item');
  assert(!rawSaved?.includes('promptScript'), '4.1 Does not copy Question Bank media/scripts into storage');

  // 4.2 Load active session (clean reload / F5)
  const loadRes = loadActiveSession(FULL_QUESTION_BANK_MANIFEST, mockNow + 50000);
  assert(loadRes.success, '4.2 Loads active session successfully on F5');
  assert(loadRes.data?.sessionId === session.sessionId, '4.2 Restored sessionId matches');
  assert(loadRes.data?.status === 'active', '4.2 Restored status is still active');

  // 4.3 Resume when deadline already passed
  mockStorage.clear();
  const expiredSession = createPracticeSession(
    {
      part: 1,
      difficulty: 'easy',
      mode: 'timed',
      durationSeconds: 100,
      questionIds: ['q-p1-001', 'q-p1-002'],
      groupIds: [],
    },
    { now: mockNow }
  );
  saveActiveSession(expiredSession);

  // Reload at mockNow + 200s (past 100s deadline)
  const resumeExpiredRes = loadActiveSession(FULL_QUESTION_BANK_MANIFEST, mockNow + 200000);
  assert(resumeExpiredRes.success, '4.3 Expired resume returns success');
  assert(resumeExpiredRes.data?.status === 'expired', '4.3 Expired session transitioned to expired');
  assert(
    resumeExpiredRes.data?.metadata.submitReason === 'auto_timeout',
    '4.3 Expired session submitReason is auto_timeout'
  );
  assert(
    mockStorage.getItem(ACTIVE_PRACTICE_SESSION_KEY) === null,
    '4.3 Clears active session key from storage once expired'
  );
  const historyAfterTimeout = loadPracticeHistory();
  assert(historyAfterTimeout.length === 1, '4.3 Archives expired session into history');

  // 4.4 Corrupted JSON in storage
  mockStorage.setItem(ACTIVE_PRACTICE_SESSION_KEY, '{malformed json!$');
  const corruptedRes = loadActiveSession(FULL_QUESTION_BANK_MANIFEST);
  assert(!corruptedRes.success, '4.4 Detects corrupted JSON in storage');
  assert(corruptedRes.code === 'CORRUPTED_JSON', '4.4 Error code is CORRUPTED_JSON');
  assert(
    mockStorage.getItem(ACTIVE_PRACTICE_SESSION_KEY) === null,
    '4.4 Removes corrupted storage item to prevent repeat crashes'
  );

  // 4.5 Referential integrity check against Question Bank
  const fakeSession: PracticeSessionData = {
    ...session,
    sessionId: 'session-invalid-q',
    questionIds: ['q-non-existent-999'],
  };
  mockStorage.setItem(ACTIVE_PRACTICE_SESSION_KEY, JSON.stringify(fakeSession));
  const invalidRes = loadActiveSession(FULL_QUESTION_BANK_MANIFEST);
  assert(!invalidRes.success, '4.5 Rejects session referencing non-existent question in bank');
  assert(invalidRes.code === 'INVALID_SESSION', '4.5 Error code is INVALID_SESSION');

  // 4.6 Overwrite protection for unfinished session
  mockStorage.clear();
  const activeSession1 = createPracticeSession({
    part: 2,
    difficulty: 'easy',
    mode: 'practice',
    questionIds: ['q-p2-001', 'q-p2-002'],
    groupIds: [],
  });
  startNewActiveSession(activeSession1);

  const activeSession2 = createPracticeSession({
    part: 2,
    difficulty: 'easy',
    mode: 'practice',
    questionIds: ['q-p2-003', 'q-p2-004'],
    groupIds: [],
  });

  const rejectOverwrite = startNewActiveSession(activeSession2, false);
  assert(!rejectOverwrite.success, '4.6 Overwrite rejected when active session exists');
  assert(
    rejectOverwrite.code === 'UNFINISHED_SESSION_EXISTS',
    '4.6 Rejection code is UNFINISHED_SESSION_EXISTS'
  );

  // 4.7 Overwrite with forceReplace: true
  const forceOverwrite = startNewActiveSession(activeSession2, true);
  assert(forceOverwrite.success, '4.7 startNewActiveSession succeeds when forceReplace is true');
  const historyAfterForce = loadPracticeHistory();
  assert(
    historyAfterForce.some((h) => h.sessionId === activeSession1.sessionId && h.status === 'abandoned'),
    '4.7 Previous unfinished session archived as abandoned upon replacement'
  );
}

// ----------------------------------------------------
// SUITE 5: Storage Failures & Quota Handling
// ----------------------------------------------------
console.log('\n--- Suite 5: Storage Failures, History Archiving & Quota Handling ---');

{
  mockStorage.clear();
  const session = createPracticeSession({
    part: 1,
    difficulty: 'medium',
    mode: 'practice',
    questionIds: ['q-p1-001'],
    groupIds: [],
  });

  // 5.1 Simulated QuotaExceededError
  mockStorage.shouldThrowQuota = true;
  const quotaSaveRes = saveActiveSession(session);
  assert(!quotaSaveRes.success, '5.1 Save fails on quota error');
  assert(quotaSaveRes.code === 'QUOTA_EXCEEDED', '5.1 Returns QUOTA_EXCEEDED code');
  mockStorage.shouldThrowQuota = false;

  // 5.2 Archive capping
  mockStorage.clear();
  for (let i = 0; i < 110; i++) {
    const tempSession = createPracticeSession(
      {
        part: 1,
        difficulty: 'easy',
        mode: 'practice',
        questionIds: ['q-p1-001'],
        groupIds: [],
      },
      { idGenerator: () => `session-history-${i}` }
    );
    archiveCompletedSession({ ...tempSession, status: 'submitted' });
  }

  const cappedHistory = loadPracticeHistory();
  assert(cappedHistory.length === 100, '5.2 Enforces 100 items cap on history');
  assert(cappedHistory[0].sessionId === 'session-history-109', '5.2 Latest entry is at the front');

  // 5.3 Export & import practice storage data
  saveActiveSession(session);
  const exported = exportPracticeStorageData();
  assert(exported.activeSession?.sessionId === session.sessionId, '5.3 Exports active session');
  assert(exported.history.length === 100, '5.3 Exports history entries');

  mockStorage.clear();
  assert(loadPracticeHistory().length === 0, '5.3 Storage cleared before import');

  const importRes = importPracticeStorageData(exported);
  assert(importRes.success, '5.3 Import succeeds');
  assert(loadPracticeHistory().length === 100, '5.3 History restored after import');
  assert(checkHasUnfinishedActiveSession(), '5.3 Active session restored after import');

  // 5.4 Progress reporting helper
  const answeredSession = setSessionAnswer(session, 'q-p1-001', 'A').session;
  const progress = getSessionProgress(answeredSession);
  assert(progress.totalQuestions === 1, '5.4 Total questions reported correctly');
  assert(progress.answeredCount === 1, '5.4 Answered count reported correctly');
  assert(progress.percentageComplete === 100, '5.4 Percentage complete reported as 100%');
}

// ----------------------------------------------------
// TEST SUMMARY
// ----------------------------------------------------
console.log('\n======================================================');
console.log(`TOTAL TESTS RUN: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
}
