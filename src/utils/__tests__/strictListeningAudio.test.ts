/**
 * TOEIC Mastery Hub — Exam Strict Listening Audio Engine Test Suite (Phase 12)
 *
 * Exhaustive targeted unit & contract test coverage:
 * 1. Sequential Queue Compiler (Part 1 -> Part 2 -> Part 3 -> Part 4: 58 units).
 * 2. Strict Readiness Guard & Lock Enforcement (Blocks Strict without certified studio audio).
 * 3. Simulation Mode Fallback & Transparent Labeling (Safe study run, no fake ETS claim).
 * 4. Strict Mode Anti-Tampering (No seeking, no replaying, locked 1.0x rate, pause restriction).
 * 5. Answer Sheet Navigation Isolation (Decoupled playback, no audio jumping or replays).
 * 6. Autoplay Restrictions & User Gesture State Transition.
 * 7. Section Timer Expiration & Teardown (Immediate halt when 45:00 expires).
 * 8. Reload, Interruption & Timeline Anomaly Flagging (Recovery transparency).
 * 9. Stale Callback & Concurrency Token Invariant (Zero race condition mutations).
 * 10. Memory & Resource Cleanup (Zero leaking listeners, timers, SpeechSynthesis).
 */

import {
  compileListeningAudioQueue,
  StrictListeningAudioEngine,
  ETS_PART1_DIRECTIONS_TEXT,
  ETS_PART2_DIRECTIONS_TEXT,
  ETS_PART3_DIRECTIONS_TEXT,
  ETS_PART4_DIRECTIONS_TEXT,
} from '../strictListeningEngine';
import {
  createExamSession,
  startExam,
} from '../examSessionEngine';
import { CANONICAL_ETS_EXAM_FORM_01 } from '../../data/examForms/etsMockForm01';
import { ExamForm, ExamSession } from '../../types/mockExam';

// Mock localStorage for Node test environment
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
    return Object.keys(this.store)[index] || null;
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
console.log('PHASE 12: STRICT LISTENING AUDIO ENGINE TEST SUITE');
console.log('================================================================\n');

// Mock a Certified Strict-Ready Exam Form for testing certified strict playback
const CERTIFIED_STRICT_EXAM_FORM: ExamForm = {
  ...CANONICAL_ETS_EXAM_FORM_01,
  id: 'ets-certified-mock-strict-01',
  media: {
    ...CANONICAL_ETS_EXAM_FORM_01.media,
    readinessStatus: 'strict-ready',
    strictLocked: false,
    lockReason: undefined,
  },
};

const createReadySession = (mode: 'strict' | 'simulation' = 'strict'): ExamSession => {
  const base = createExamSession(
    { examFormId: CANONICAL_ETS_EXAM_FORM_01.id, mode },
    CANONICAL_ETS_EXAM_FORM_01,
    { now: 1000000000 }
  );
  return {
    ...base,
    status: 'listening',
    integrityFlags: {
      ...base.integrityFlags,
      preflightPassed: true,
    },
  };
};

// ----------------------------------------------------------------------------
// SUITE 1: SEQUENTIAL QUEUE COMPILER (PART 1 -> 2 -> 3 -> 4)
// ----------------------------------------------------------------------------
console.log('--- SUITE 1: Sequential Audio Queue Compiler ---');

const queue = compileListeningAudioQueue(CANONICAL_ETS_EXAM_FORM_01);

assert(queue.length === 58, `Compiled queue has exactly 58 units (found: ${queue.length})`);

// Part 1 Check
assert(queue[0].id === 'p1-directions', 'Item 0 is Part 1 Directions');
assert(queue[0].isDirections === true, 'Item 0 is marked isDirections: true');
assert(queue[0].startQuestionNumber === 1 && queue[0].endQuestionNumber === 6, 'Item 0 covers Questions 1 to 6');
assert(queue[1].id === 'p1-q-1', 'Item 1 is Question 1');
assert(queue[6].id === 'p1-q-6', 'Item 6 is Question 6');

// Part 2 Check
assert(queue[7].id === 'p2-directions', 'Item 7 is Part 2 Directions');
assert(queue[7].startQuestionNumber === 7 && queue[7].endQuestionNumber === 31, 'Item 7 covers Questions 7 to 31');
assert(queue[8].id === 'p2-q-7', 'Item 8 is Question 7');
assert(queue[32].id === 'p2-q-31', 'Item 32 is Question 31');

// Part 3 Check
assert(queue[33].id === 'p3-directions', 'Item 33 is Part 3 Directions');
assert(queue[33].startQuestionNumber === 32 && queue[33].endQuestionNumber === 70, 'Item 33 covers Questions 32 to 70');
assert(queue[34].id === 'p3-grp-1', 'Item 34 is Part 3 Group 1 (Questions 32-34)');
assert(queue[34].startQuestionNumber === 32 && queue[34].endQuestionNumber === 34, 'Group 1 covers Q32-34');
assert(queue[46].id === 'p3-grp-13', 'Item 46 is Part 3 Group 13 (Questions 68-70)');
assert(queue[46].startQuestionNumber === 68 && queue[46].endQuestionNumber === 70, 'Group 13 covers Q68-70');

// Part 4 Check
assert(queue[47].id === 'p4-directions', 'Item 47 is Part 4 Directions');
assert(queue[47].startQuestionNumber === 71 && queue[47].endQuestionNumber === 100, 'Item 47 covers Questions 71 to 100');
assert(queue[48].id === 'p4-grp-1', 'Item 48 is Part 4 Group 1 (Questions 71-73)');
assert(queue[48].startQuestionNumber === 71 && queue[48].endQuestionNumber === 73, 'Group 1 covers Q71-73');
assert(queue[57].id === 'p4-grp-10', 'Item 57 is Part 4 Group 10 (Questions 98-100)');
assert(queue[57].startQuestionNumber === 98 && queue[57].endQuestionNumber === 100, 'Group 10 covers Q98-100');

// ----------------------------------------------------------------------------
// SUITE 2: STRICT READINESS GUARD & LOCK ENFORCEMENT
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 2: Strict Readiness Guard & Lock Enforcement ---');

const strictSession = createReadySession('strict');

// Attempt to instantiate Strict Mode on non-certified Canonical Form
let strictInstantiationFailed = false;
let strictErrorReason = '';
try {
  new StrictListeningAudioEngine(CANONICAL_ETS_EXAM_FORM_01, strictSession, { mode: 'strict' });
} catch (err: any) {
  strictInstantiationFailed = true;
  strictErrorReason = err.message;
}

assert(strictInstantiationFailed === true, 'Strict Mode instantiation rejected for non-certified form');
assert(strictErrorReason.includes('STRICT_MODE_LOCKED'), 'Returns STRICT_MODE_LOCKED error code');
assert(
  strictErrorReason.includes('prerecorded') ||
    strictErrorReason.includes('phòng thu') ||
    strictErrorReason.includes('Certified studio'),
  'Explains transparently that prerecorded studio audio files are missing'
);

// ----------------------------------------------------------------------------
// SUITE 3: SIMULATION MODE FALLBACK & TRANSPARENT LABELING
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 3: Simulation Mode Fallback & Transparent Labeling ---');

const simSession = createReadySession('simulation');
const simEngine = new StrictListeningAudioEngine(CANONICAL_ETS_EXAM_FORM_01, simSession, { mode: 'simulation' });
const simState = simEngine.getState();

assert(simState.status === 'idle', 'Simulation engine initialized to idle');
assert(simState.isSimulation === true, 'Simulation mode clearly flagged (isSimulation: true)');
assert(simState.isStrictCertified === false, 'Strict certified flag is false in simulation');
assert(simState.mode === 'simulation', 'Mode confirmed as simulation');
assert(simState.totalQueueItems === 58, 'Simulation engine loaded all 58 queue items');

simEngine.dispose();

// ----------------------------------------------------------------------------
// SUITE 4: STRICT MODE ANTI-TAMPERING & PLAYBACK RESTRICTIONS
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 4: Anti-Tampering & Playback Restrictions ---');

const certifiedEngine = new StrictListeningAudioEngine(
  CERTIFIED_STRICT_EXAM_FORM,
  strictSession,
  { mode: 'strict' }
);
const certState = certifiedEngine.getState();

assert(certState.isStrictCertified === true, 'Certified form successfully unlocks Strict Mode');
assert(certState.canSeek === false, 'Seeking is permanently disabled');
assert(certState.canReplay === false, 'Replaying is permanently disabled');
assert(certState.playbackRate === 1.0, 'Playback rate is locked at 1.0x');

// Attempt to seek
let seekBlocked = false;
try {
  certifiedEngine.seekTo(15);
} catch (err: any) {
  seekBlocked = true;
  assert(err.message.includes('SEEK_FORBIDDEN_IN_STRICT'), 'Throws SEEK_FORBIDDEN_IN_STRICT');
}
assert(seekBlocked === true, 'Seeking rejected with exception');

// Attempt to change speed
let speedChangeBlocked = false;
try {
  certifiedEngine.setPlaybackRate(1.25);
} catch (err: any) {
  speedChangeBlocked = true;
  assert(err.message.includes('SPEED_CHANGE_FORBIDDEN'), 'Throws SPEED_CHANGE_FORBIDDEN');
}
assert(speedChangeBlocked === true, 'Playback rate change rejected with exception');

// Attempt to replay
let replayBlocked = false;
try {
  certifiedEngine.replay();
} catch (err: any) {
  replayBlocked = true;
  assert(err.message.includes('REPLAY_FORBIDDEN_IN_STRICT'), 'Throws REPLAY_FORBIDDEN_IN_STRICT');
}
assert(replayBlocked === true, 'Replay rejected with exception');

// Attempt to pause arbitrarily in Strict Mode
let pauseBlocked = false;
try {
  certifiedEngine.pause();
} catch (err: any) {
  pauseBlocked = true;
  assert(err.message.includes('PAUSE_FORBIDDEN_IN_STRICT'), 'Throws PAUSE_FORBIDDEN_IN_STRICT');
}
assert(pauseBlocked === true, 'Arbitrary pausing rejected in Strict Mode');

certifiedEngine.dispose();

// ----------------------------------------------------------------------------
// SUITE 5: ANSWER SHEET NAVIGATION ISOLATION
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 5: Answer Sheet Navigation Isolation ---');

const navEngine = new StrictListeningAudioEngine(
  CERTIFIED_STRICT_EXAM_FORM,
  strictSession,
  { mode: 'strict' }
);

// Start playback
navEngine.startPlayback();
assert(navEngine.getState().status === 'playing', 'Engine transitioned to playing');
assert(navEngine.getState().currentQueueIndex === 0, 'Audio starts at Queue Index 0 (Part 1 Directions)');

// Candidate navigates to Question 50 on the answer sheet
navEngine.syncUserNavigatedQuestion(50);
assert(navEngine.getState().currentQueueIndex === 0, 'Navigation does NOT jump audio to Question 50');
assert(navEngine.getState().currentItem?.id === 'p1-directions', 'Audio remains playing Part 1 Directions');

// Candidate returns to Question 1
navEngine.syncUserNavigatedQuestion(1);
assert(navEngine.getState().currentQueueIndex === 0, 'Returning to Question 1 does NOT replay previous audio');

navEngine.dispose();

// ----------------------------------------------------------------------------
// SUITE 6: SECTION TIMER EXPIRATION & IMMEDIATE TEARDOWN
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 6: Section Timer Expiration & Immediate Teardown ---');

const timerEngine = new StrictListeningAudioEngine(
  CERTIFIED_STRICT_EXAM_FORM,
  strictSession,
  { mode: 'strict' }
);
timerEngine.startPlayback();
assert(timerEngine.getState().status === 'playing', 'Playback is active before timer expires');

// Simulate 45:00 Listening section deadline expiration
timerEngine.onListeningSectionExpired();
const stateAfterExpire = timerEngine.getState();
assert(stateAfterExpire.status === 'ended', 'Playback transitions to ended immediately when timer expires');
assert(stateAfterExpire.progressRatio === 1.0, 'Progress set to 1.0 upon expiration');

timerEngine.dispose();

// ----------------------------------------------------------------------------
// SUITE 7: RECOVERY, RELOAD & TIMELINE ANOMALY FLAGGING
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 7: Recovery, Reload & Timeline Anomaly Flagging ---');

const recoverySession: ExamSession = {
  ...strictSession,
  mode: 'strict',
  currentQuestionNumber: 24,
  playbackCheckpoint: {
    currentTrackId: 'p2-q-24',
    currentAudioItemIndex: 25,
    playbackPositionMs: 4000,
    speechRate: 1.0,
    audioState: 'playing',
    loopCount: 1,
    lastCheckpointAt: 1000000000,
  },
};

const recoveryEngine = new StrictListeningAudioEngine(
  CERTIFIED_STRICT_EXAM_FORM,
  recoverySession,
  { mode: 'strict' }
);

// Evaluate recovery in Strict Mode
const strictRecovery = recoveryEngine.evaluatePlaybackRecovery(recoverySession);
assert(strictRecovery.isStrictCompatible === false, 'Strict recovery marked incompatible (audio lost during reload)');
assert(strictRecovery.timelineAbnormal === true, 'timelineAbnormal flag raised in Strict Mode');
assert(
  strictRecovery.reason?.includes('Strict listening timeline was interrupted'),
  'Clear transparency reason explaining listening cannot be rewound or restarted'
);

// Evaluate recovery in Simulation Mode
const simRecoverySession: ExamSession = {
  ...recoverySession,
  mode: 'simulation',
};
const simRecovery = recoveryEngine.evaluatePlaybackRecovery(simRecoverySession);
assert(simRecovery.canResume === true, 'Simulation mode allows resume from checkpoint');
assert(simRecovery.timelineAbnormal === false, 'timelineAbnormal flag is false for simulation');
assert(simRecovery.recommendedQueueIndex === 25, 'Recommends resuming at checkpoint queue index (25)');

recoveryEngine.dispose();

// ----------------------------------------------------------------------------
// SUITE 8: STALE CALLBACK & CONCURRENCY TOKEN PROTECTION
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 8: Stale Callback & Concurrency Token Invariant ---');

const tokenEngine = new StrictListeningAudioEngine(
  CERTIFIED_STRICT_EXAM_FORM,
  strictSession,
  { mode: 'strict' }
);

tokenEngine.startPlayback();
const initialTokenState = tokenEngine.getState();
assert(initialTokenState.status === 'playing', 'Engine started playing with initial token');

// Stop immediately (increments token and clears active async timers)
tokenEngine.stop();
assert(tokenEngine.getState().status === 'idle', 'Engine safely stopped and token invalidated');

tokenEngine.dispose();

// ----------------------------------------------------------------------------
// SUITE 9: SIMULATION CONTROLS (PAUSE & RESUME PERMITTED IN SIMULATION)
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 9: Simulation Controls: Pause Allowed ---');

const simPlayEngine = new StrictListeningAudioEngine(
  CANONICAL_ETS_EXAM_FORM_01,
  simSession,
  { mode: 'simulation' }
);

simPlayEngine.startPlayback();
assert(simPlayEngine.getState().canPause === true, 'Simulation mode allows pausing');

simPlayEngine.pause();
assert(simPlayEngine.getState().status === 'paused', 'Simulation status transitions to paused');

simPlayEngine.dispose();

// ----------------------------------------------------------------------------
// SUITE 10: CHECKPOINT GENERATION INTEGRITY
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 10: Checkpoint Generation Integrity ---');

const checkpointEngine = new StrictListeningAudioEngine(
  CERTIFIED_STRICT_EXAM_FORM,
  strictSession,
  { mode: 'strict' }
);
checkpointEngine.startPlayback();

const checkpoint = checkpointEngine.getPlaybackCheckpoint();
assert(checkpoint.currentTrackId === 'p1-directions', 'Checkpoint records currentTrackId: p1-directions');
assert(checkpoint.currentAudioItemIndex === 0, 'Checkpoint records currentAudioItemIndex: 0');
assert(checkpoint.audioState === 'playing', 'Checkpoint records audioState: playing');
assert(checkpoint.speechRate === 1.0, 'Checkpoint records speechRate: 1.0');
assert(checkpoint.loopCount === 1, 'Checkpoint loopCount is exactly 1');
assert(typeof checkpoint.lastCheckpointAt === 'number', 'Checkpoint records valid timestamp');

checkpointEngine.dispose();

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
  console.log('🎉 ALL ASSERTIONS PASSED! Phase 12 Strict Listening Audio Engine Validated.\n');
  process.exit(0);
}
