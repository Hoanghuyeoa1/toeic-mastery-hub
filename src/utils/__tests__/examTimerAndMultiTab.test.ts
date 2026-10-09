/**
 * TOEIC Mastery Hub — Exam Timer & Multi-Tab Safety Test Suite (Phase 11)
 *
 * Exhaustive simulated/fake-clock test coverage:
 * 1. Timer Snapshot Calculations & Time Formatting (45m, 75m, 120m).
 * 2. Fake Clock: Listening Expiration (44:59 -> 45:00) & Audio Engine Stop Hook.
 * 3. Fake Clock: Reading Expiration (74:59 -> 75:00) & Auto-Submit (timeout_reading).
 * 4. Fake Clock: Overall 120m Expiration & Auto-Submit (timeout_overall).
 * 5. Persistent Deadlines & F5/Background/Reload Resilience (Deadlines never stretch).
 * 6. Section Boundary & Strict Mode Lockdown (No access to Listening after transition).
 * 7. Concurrency & Idempotency: Double Transition & Simultaneous Manual/Auto Submit.
 * 8. Multi-Tab Protection: Lease Acquisition, Heartbeat, Secondary Tab Read-Only Conflict.
 * 9. Takeover Mechanism, Expired Lease Recovery, & Stale Tab Write Protection.
 * 10. Clock Integrity & Tampering Detection (Clock regression & anomaly flags).
 */

import {
  createExamSession,
  startExam,
  ETS_LISTENING_DURATION_SECONDS,
  ETS_READING_DURATION_SECONDS,
  ETS_OVERALL_DURATION_SECONDS,
} from '../examSessionEngine';
import {
  calculateTimerSnapshot,
  formatRemainingTime,
  handleSectionTimeoutOrTransition,
  executeSafeExamSubmit,
  executeSafeSectionTransition,
  verifyClockIntegrity,
} from '../examTimer';
import {
  acquireTabLease,
  renewTabLease,
  releaseTabLease,
  getCurrentTabLease,
  isTabAuthorizedToSave,
  subscribeToTabBus,
  ACTIVE_TAB_LEASE_KEY,
  DEFAULT_LEASE_TTL_MS,
} from '../examTabCoordinator';
import {
  saveActiveExamSession,
  loadActiveExamSession,
  clearActiveExamSession,
  ACTIVE_EXAM_SESSION_KEY,
} from '../examSessionStorage';
import { CANONICAL_ETS_EXAM_FORM_01 } from '../../data/examForms/etsMockForm01';
import { ExamSession, TabLeaseMessage } from '../../types/mockExam';

// In-memory mock localStorage for Node environment
class MockLocalStorage implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

const mockStorage = new MockLocalStorage();
(globalThis as unknown as { localStorage: Storage }).localStorage = mockStorage;

// Test Tracker
let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string, detail?: string): void {
  testsRun++;
  if (condition) {
    testsPassed++;
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    testsFailed++;
    console.error(`  ✗ [FAIL] ${testName}${detail ? `: ${detail}` : ''}`);
  }
}

console.log('================================================================');
console.log('PHASE 11: EXAM TIMER & MULTI-TAB SAFETY TEST SUITE');
console.log('================================================================\n');

const createReadySession = (mode: 'strict' | 'simulation' = 'strict', now = 1000000000): ExamSession => {
  const base = createExamSession(
    { examFormId: CANONICAL_ETS_EXAM_FORM_01.id, mode },
    CANONICAL_ETS_EXAM_FORM_01,
    { now }
  );
  return {
    ...base,
    status: 'ready',
    integrityFlags: {
      ...base.integrityFlags,
      preflightPassed: true,
    },
  };
};

// ----------------------------------------------------------------------------
// SUITE 1: TIMER SNAPSHOT CALCULATIONS & TIME FORMATTING
// ----------------------------------------------------------------------------
console.log('--- SUITE 1: Timer Snapshot Calculations & Formatting ---');

assert(formatRemainingTime(0) === '00:00', 'formatRemainingTime 0s is 00:00');
assert(formatRemainingTime(59) === '00:59', 'formatRemainingTime 59s is 00:59');
assert(formatRemainingTime(60) === '01:00', 'formatRemainingTime 60s is 01:00');
assert(formatRemainingTime(2699) === '44:59', 'formatRemainingTime 2699s is 44:59');
assert(formatRemainingTime(2700) === '45:00', 'formatRemainingTime 2700s is 45:00');
assert(formatRemainingTime(4500) === '1:15:00', 'formatRemainingTime 4500s (75m) is 1:15:00');
assert(formatRemainingTime(7200) === '2:00:00', 'formatRemainingTime 7200s (120m) is 2:00:00');
assert(formatRemainingTime(-15) === '00:00', 'formatRemainingTime negative seconds clamped to 00:00');

// Initial unstarted session timer snapshot
const unstartedSession = createReadySession('strict', 1000000);
const unstartedSnapshot = calculateTimerSnapshot(unstartedSession, 1000000);
assert(unstartedSnapshot.sectionRemainingSeconds === 2700, 'Unstarted session defaults to 2700s (45m)');
assert(unstartedSnapshot.isListeningExpired === false, 'Unstarted session listening is not expired');

// ----------------------------------------------------------------------------
// SUITE 2: FAKE CLOCK: LISTENING EXPIRATION (44:59 -> 45:00) & AUDIO HOOK
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 2: Listening Expiration (44:59 -> 45:00) & Audio Stop Hook ---');

const T0 = 1000000000; // Fake base timestamp
const readySession = createReadySession('strict', T0);
const startResult = startExam(readySession, { now: T0 });
assert(startResult.success, 'Session started at T0');
let activeSession = startResult.session;

// At 44m 59s (T0 + 2699s)
const snapAt4459 = calculateTimerSnapshot(activeSession, T0 + 2699 * 1000);
assert(snapAt4459.sectionRemainingSeconds === 1, 'Remaining time at 44:59 is exactly 1s');
assert(snapAt4459.formattedSectionTime === '00:01', 'Formatted remaining is 00:01');
assert(snapAt4459.isListeningExpired === false, 'Session listening not expired at 44:59');

// At 45m 00s (T0 + 2700s)
const snapAt4500 = calculateTimerSnapshot(activeSession, T0 + 2700 * 1000);
assert(snapAt4500.sectionRemainingSeconds === 0, 'Remaining time at 45:00 is exactly 0s');
assert(snapAt4500.formattedSectionTime === '00:00', 'Formatted remaining is 00:00');
assert(snapAt4500.isListeningExpired === true, 'Listening expired at 45:00');

// Trigger section timeout transition with Audio Engine stop hook
let audioHaltCalled = false;
const transitionResult = handleSectionTimeoutOrTransition(activeSession, T0 + 2700 * 1000, {
  onListeningEnded: () => {
    audioHaltCalled = true;
  },
});

assert(transitionResult.success === true, 'handleSectionTimeoutOrTransition transitions to reading');
assert(audioHaltCalled === true, 'Audio stop callback was invoked when listening expired');
assert(transitionResult.session.status === 'reading', 'Status transitioned to reading');
assert(transitionResult.session.currentSection === 'reading', 'Current section updated to reading');
assert(transitionResult.session.currentQuestionNumber === 101, 'Cursor advanced to Question 101 (Part 5)');

activeSession = transitionResult.session;

// ----------------------------------------------------------------------------
// SUITE 3: FAKE CLOCK: READING EXPIRATION (74:59 -> 75:00) & AUTO-SUBMIT
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 3: Reading Expiration (74:59 -> 75:00) & Auto-Submit ---');

// Reading start is at T1 = T0 + 2700s. Reading duration is 4500s (75m).
const T1 = T0 + 2700 * 1000;
const readingDeadline = activeSession.readingDeadline!;
assert(readingDeadline === T1 + 4500 * 1000, 'Reading deadline is strictly 75m after transition');

// At 74m 59s into Reading (deadline - 1s)
const snapAt7459 = calculateTimerSnapshot(activeSession, readingDeadline - 1000);
assert(snapAt7459.sectionRemainingSeconds === 1, 'Remaining time at 74:59 of Reading is exactly 1s');
assert(snapAt7459.isReadingExpired === false, 'Reading not expired at 74:59');

// At 75m 00s into Reading (at deadline)
const snapAt7500 = calculateTimerSnapshot(activeSession, readingDeadline);
assert(snapAt7500.sectionRemainingSeconds === 0, 'Remaining time at 75:00 of Reading is 0s');
assert(snapAt7500.isReadingExpired === true, 'Reading is marked expired at 75:00');

// Trigger Reading expiration
const submitOnReadingExpiry = handleSectionTimeoutOrTransition(activeSession, readingDeadline);
assert(submitOnReadingExpiry.success === true, 'Reading expiry successfully auto-submits exam');
assert(submitOnReadingExpiry.session.status === 'submitted', 'Exam status changed to submitted');
assert(submitOnReadingExpiry.session.submitReason === 'timeout_reading', 'Submit reason recorded as timeout_reading');

// ----------------------------------------------------------------------------
// SUITE 4: FAKE CLOCK: OVERALL 120M DEADLINE AUTO-SUBMIT
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 4: Overall 120m Deadline Auto-Submit ---');

const sessionForOverallTest = createReadySession('strict', T0);
const startedForOverall = startExam(sessionForOverallTest, { now: T0 }).session;
assert(startedForOverall.overallDeadline === T0 + 7200 * 1000, 'Overall deadline is T0 + 120m');

// Advance time to overall deadline + 10s while session was left in listening
const overallExpiredSnapshot = calculateTimerSnapshot(startedForOverall, T0 + 7210 * 1000);
assert(overallExpiredSnapshot.isExamExpired === true, 'Overall deadline expiry flagged');

let audioStoppedOnOverall = false;
const overallSubmitResult = handleSectionTimeoutOrTransition(startedForOverall, T0 + 7210 * 1000, {
  onListeningEnded: () => {
    audioStoppedOnOverall = true;
  },
});
assert(overallSubmitResult.success === true, 'Overall expiry auto-submits exam');
assert(audioStoppedOnOverall === true, 'Audio stopped when overall deadline reached in listening');
assert(overallSubmitResult.session.status === 'submitted', 'Status is submitted');
assert(overallSubmitResult.session.submitReason === 'timeout_overall', 'Submit reason is timeout_overall');

// ----------------------------------------------------------------------------
// SUITE 5: PERSISTENT DEADLINES & F5 / RELOAD / BACKGROUND RESILIENCE
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 5: Persistent Deadlines & F5 Reload Resilience ---');

const sessionToPersist = createReadySession('strict', T0);
const startedSession = startExam(sessionToPersist, { now: T0 }).session;
const originalListeningDeadline = startedSession.listeningDeadline;
const originalOverallDeadline = startedSession.overallDeadline;

// Save to storage
saveActiveExamSession(startedSession, { now: T0 });

// Simulate page reload 1000s later
const reloadTime = T0 + 1000 * 1000;
const loadedAfterF5 = loadActiveExamSession(
  (id) => (id === CANONICAL_ETS_EXAM_FORM_01.id ? CANONICAL_ETS_EXAM_FORM_01 : undefined),
  reloadTime
).data!;

assert(loadedAfterF5.listeningDeadline === originalListeningDeadline, 'Listening deadline unmodified after F5');
assert(loadedAfterF5.overallDeadline === originalOverallDeadline, 'Overall deadline unmodified after F5');
const snapshotAfterF5 = calculateTimerSnapshot(loadedAfterF5, reloadTime);
assert(snapshotAfterF5.sectionRemainingSeconds === 1700, 'Remaining time after 1000s is exactly 1700s (2700 - 1000)');

// Reload AFTER listening deadline (e.g. at T0 + 3000s)
const reloadAfterExpiryTime = T0 + 3000 * 1000;
const loadedAfterExpiry = loadActiveExamSession(
  (id) => (id === CANONICAL_ETS_EXAM_FORM_01.id ? CANONICAL_ETS_EXAM_FORM_01 : undefined),
  reloadAfterExpiryTime
).data!;

assert(loadedAfterExpiry.status === 'reading', 'Reload after listening deadline automatically recovers to reading');
assert(loadedAfterExpiry.currentSection === 'reading', 'Section recovered to reading');

// ----------------------------------------------------------------------------
// SUITE 6: STRICT LOCKDOWN & NAVIGATION BOUNDARY
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 6: Strict Mode Lockdown: No Reading Time for Listening ---');

// In Strict mode, reading cannot switch back to listening
const strictReadingSession: ExamSession = {
  ...loadedAfterExpiry,
  mode: 'strict',
  status: 'reading',
  currentSection: 'reading',
};

// Attempt to calculate timer snapshot: Reading section strictly references readingDeadline
const readingSnap = calculateTimerSnapshot(strictReadingSession, reloadAfterExpiryTime + 100 * 1000);
assert(readingSnap.isListeningExpired === true, 'Active timer reflects listening is closed');
assert(
  readingSnap.sectionRemainingSeconds ===
    Math.max(0, Math.ceil((strictReadingSession.readingDeadline! - (reloadAfterExpiryTime + 100 * 1000)) / 1000)),
  'Reading remaining time strictly computed from readingDeadline'
);

// ----------------------------------------------------------------------------
// SUITE 7: CONCURRENCY & IDEMPOTENCY: DOUBLE TRANSITION & RACE CONDITIONS
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 7: Concurrency & Idempotency: Double Transition & Dual Submit ---');

const freshSession = startExam(createReadySession('strict', T0), { now: T0 }).session;

// First transition (manual or auto)
const safeTrans1 = executeSafeSectionTransition(freshSession, T0 + 2700 * 1000);
assert(safeTrans1.success === true, 'First transition succeeds');
assert(safeTrans1.session.status === 'reading', 'Status is now reading');

// Immediate second transition call (e.g. simultaneous timer tick + user button click)
const safeTrans2 = executeSafeSectionTransition(safeTrans1.session, T0 + 2700 * 1000);
assert(safeTrans2.success === false, 'Duplicate transition rejected idempotently');
assert(safeTrans2.code === 'ALREADY_IN_READING', 'Safe rejection code ALREADY_IN_READING provided');

// Simultaneous manual submit and auto-submit
const safeSubmit1 = executeSafeExamSubmit(safeTrans1.session, 'user_completed', T0 + 3000 * 1000);
assert(safeSubmit1.success === true, 'First submit succeeds');
assert(safeSubmit1.session.status === 'submitted', 'Session finalized to submitted');

// Duplicate second submit (e.g. auto timer fires right after manual submit)
const safeSubmit2 = executeSafeExamSubmit(safeSubmit1.session, 'timeout_reading', T0 + 3000 * 1000);
assert(safeSubmit2.success === false, 'Duplicate submit rejected idempotently');
assert(safeSubmit2.code === 'ALREADY_SUBMITTED', 'Safe rejection code ALREADY_SUBMITTED for dual submit');
assert(safeSubmit2.session.submitReason === 'user_completed', 'Original submit reason preserved');

// ----------------------------------------------------------------------------
// SUITE 8: MULTI-TAB PROTECTION: LEASE ACQUISITION, HEARTBEAT & CONFLICT
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 8: Multi-Tab Safety: Lease Acquisition & Conflict Detection ---');

mockStorage.clear();
const testSessionId = 'exam_session_alpha';
const tabA = 'tab_A_primary';
const tabB = 'tab_B_secondary';
const baseLeaseTime = 2000000000;

// Tab A acquires lease
const leaseA = acquireTabLease(testSessionId, tabA, baseLeaseTime);
assert(leaseA.acquired === true, 'Tab A successfully acquires exclusive edit lease');
assert(leaseA.lease.tabId === tabA, 'Lease owner is Tab A');

// Check authorization
assert(isTabAuthorizedToSave(testSessionId, tabA, baseLeaseTime) === true, 'Tab A authorized to save');
assert(isTabAuthorizedToSave(testSessionId, tabB, baseLeaseTime) === false, 'Tab B NOT authorized to save');

// Tab B attempts to acquire lease while Tab A is active
const leaseB = acquireTabLease(testSessionId, tabB, baseLeaseTime + 1000);
assert(leaseB.acquired === false, 'Tab B acquisition rejected due to active Tab A lease');
assert(leaseB.status === 'read_only_conflict', 'Tab B enters read_only_conflict status');
assert(leaseB.conflictTabId === tabA, 'Conflict identifies Tab A as current owner');

// Heartbeat renewal by Tab A
const renewA = renewTabLease(testSessionId, tabA, baseLeaseTime + 2000, DEFAULT_LEASE_TTL_MS);
assert(renewA.renewed === true, 'Tab A heartbeat renewal succeeds');

// Tab B cannot renew lease owned by Tab A
const unauthorizedRenew = renewTabLease(testSessionId, tabB, baseLeaseTime + 2500, DEFAULT_LEASE_TTL_MS);
assert(unauthorizedRenew.renewed === false, 'Tab B cannot renew lease owned by Tab A');

// Storage level protection: Tab B cannot write exam session
const sessionToSave = { ...freshSession, sessionId: testSessionId };
const writeByTabB = saveActiveExamSession(sessionToSave, { tabId: tabB, now: baseLeaseTime + 2500 });
assert(writeByTabB.success === false, 'Storage write rejected for Tab B');
assert(writeByTabB.code === 'TAB_CONFLICT', 'Error code is TAB_CONFLICT');

// Storage level protection: Tab A can write exam session
const writeByTabA = saveActiveExamSession(sessionToSave, { tabId: tabA, now: baseLeaseTime + 2500 });
assert(writeByTabA.success === true, 'Storage write succeeds for authorized Tab A');

// ----------------------------------------------------------------------------
// SUITE 9: TAKEOVER MECHANISM, EXPIRED LEASE RECOVERY & BUS NOTIFICATIONS
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 9: Takeover Mechanism, Expired Lease & Bus Notifications ---');

// Test BroadcastChannel / In-Memory bus notifications
const receivedMessages: TabLeaseMessage[] = [];
const unsubscribe = subscribeToTabBus((msg) => {
  receivedMessages.push(msg);
});

// Tab B forces takeover (User clicks "Take Over Session" on Tab B)
const takeoverTime = baseLeaseTime + 3000;
const takeoverResult = acquireTabLease(testSessionId, tabB, takeoverTime, { force: true });
assert(takeoverResult.acquired === true, 'Tab B forces takeover successfully');
assert(takeoverResult.lease.tabId === tabB, 'Lease owner is now Tab B');

// Verify Tab A is now revoked
assert(isTabAuthorizedToSave(testSessionId, tabA, takeoverTime) === false, 'Tab A revoked after takeover');
assert(isTabAuthorizedToSave(testSessionId, tabB, takeoverTime) === true, 'Tab B authorized after takeover');

// Verify Tab A can no longer save
const writeByStaleTabA = saveActiveExamSession(sessionToSave, { tabId: tabA, now: takeoverTime });
assert(writeByStaleTabA.success === false, 'Stale Tab A write blocked after takeover');
assert(writeByStaleTabA.code === 'TAB_CONFLICT', 'Error code TAB_CONFLICT for stale tab');

// Verify broadcast notification was dispatched
const takeoverBroadcast = receivedMessages.find((m) => m.type === 'TAKEOVER');
assert(takeoverBroadcast !== undefined, 'TAKEOVER broadcast event dispatched');
assert(takeoverBroadcast?.tabId === tabB, 'TAKEOVER sender is Tab B');

// Expired lease recovery (e.g. Tab B crashes and 6 seconds pass without heartbeat)
const crashTime = takeoverTime + 6000; // TTL is 5000ms
const tabC = 'tab_C_recovered';
const recoveryResult = acquireTabLease(testSessionId, tabC, crashTime);
assert(recoveryResult.acquired === true, 'Tab C acquires lease naturally after previous lease expired');
assert(recoveryResult.lease.tabId === tabC, 'Lease owner is now Tab C');

// Voluntary release
releaseTabLease(testSessionId, tabC);
const leaseAfterRelease = getCurrentTabLease();
assert(leaseAfterRelease === null, 'Lease cleared from storage after voluntary release');

unsubscribe();

// ----------------------------------------------------------------------------
// SUITE 10: CLOCK INTEGRITY & SYSTEM TIME REGRESSION DETECTION
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 10: Clock Integrity & System Time Regression Detection ---');

const clockSession: ExamSession = {
  ...freshSession,
  integrityFlags: {
    ...freshSession.integrityFlags,
    lastKnownTimestamp: 3000000000,
  },
};

// Normal monotonic forward tick (e.g. +1000ms)
const normalClockCheck = verifyClockIntegrity(clockSession, 3000001000);
assert(normalClockCheck.isSuspicious === false, 'Normal forward clock tick is not flagged');

// Jitter within tolerance (e.g. -2000ms NTP synchronization)
const jitterCheck = verifyClockIntegrity(clockSession, 3000000000 - 2000);
assert(jitterCheck.isSuspicious === false, 'Minor NTP jitter within 5000ms tolerance is not flagged');

// Significant clock rollback (e.g. -60 seconds)
const rollbackCheck = verifyClockIntegrity(clockSession, 3000000000 - 60000);
assert(rollbackCheck.isSuspicious === true, 'Clock rollback > 5s detected');
assert(rollbackCheck.driftSeconds === 60, 'Drift calculated as 60s');
assert(rollbackCheck.reason?.includes('regression detected'), 'Reason indicates regression detected');
assert(rollbackCheck.updatedSession.integrityFlags.isClockTampered === true, 'isClockTampered flag set');

// Suspicious forward jump (> 24 hours)
const leapCheck = verifyClockIntegrity(clockSession, 3000000000 + 86400000 + 100000);
assert(leapCheck.isSuspicious === true, 'Suspicious leap forward > 24h detected');
assert(leapCheck.reason?.includes('Excessive forward clock leap'), 'Reason indicates leap forward');
assert(leapCheck.updatedSession.integrityFlags.isClockTampered === true, 'isClockTampered flag set on jump');

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
  console.log('🎉 ALL ASSERTIONS PASSED! Phase 11 Exam Timer & Multi-Tab Safety Validated.\n');
  process.exit(0);
}
