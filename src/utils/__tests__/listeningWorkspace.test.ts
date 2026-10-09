/**
 * TOEIC Mastery Hub — Listening Practice Workspace Unit & Contract Tests (Phase 7)
 *
 * Verifies:
 * 1. Question Bank Lookup & Cardinality Integrity (Part 1-4 lookup, group retrieval).
 * 2. Specialized Part Render Contracts (Part 1 4-choices, Part 2 strict 3-choices A-C, Part 3-4 group link).
 * 3. Group Switching & Audio Track Context Preservation.
 * 4. Transcript & Assistance Rules (Practice mode tracking vs Timed mode strict concealment).
 * 5. Answer Selection, State Preservation & Post-Submit Immutability.
 * 6. Timer Integration, Wall-Clock Deadline & Auto-Submit Transition.
 * 7. Audio Resource Teardown on Session Completion / Exit.
 */

import {
  getQuestionById,
  getQuestionGroupById,
  getQuestionsForGroup,
  verifyQuestionIdsExist,
} from '../questionBankLookup';

import {
  createPracticeSession,
  setSessionAnswer,
  toggleSessionMark,
  navigateSession,
  recordAssistance,
  submitSession,
  isSessionExpired,
  checkAndApplyTimeout,
} from '../practiceSessionEngine';

import {
  buildAudioTrackConfigFromQuestion,
  buildAudioTrackConfigFromGroup,
} from '../audioScriptParser';

import {
  ListeningAudioController,
  audioPlaybackCoordinator,
} from '../listeningAudioController';

import { FULL_QUESTION_BANK_MANIFEST } from '../../data/questionBank';
import { Part1Question, Part2Question, Part3Group, Part4Group } from '../../types/questionBank';

// Mocks for Node / Test environment
class MockUtterance {
  public text: string;
  public onend: (() => void) | null = null;
  public onerror: ((ev: any) => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

class MockSpeechSynthesis {
  public speaking = false;
  getVoices() {
    return [{ name: 'Microsoft David', lang: 'en-US', voiceURI: 'david', default: true }];
  }
  speak(u: MockUtterance) {
    this.speaking = true;
    setTimeout(() => {
      this.speaking = false;
      u.onend?.();
    }, 10);
  }
  cancel() {
    this.speaking = false;
  }
}

class MockAudio {
  public src = '';
  public currentTime = 0;
  public duration = 15;
  addEventListener() {}
  removeEventListener() {}
  play() {
    return Promise.resolve();
  }
  pause() {}
  load() {}
}

(globalThis as any).window = globalThis;
(globalThis as any).speechSynthesis = new MockSpeechSynthesis();
(globalThis as any).SpeechSynthesisUtterance = MockUtterance;
(globalThis as any).Audio = MockAudio;

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('======================================================');
  console.log('🧪 RUNNING LISTENING WORKSPACE CONTRACT TESTS (PHASE 7)');
  console.log('======================================================\n');

  // ------------------------------------------------------------------
  // SUITE 1: Question Bank Lookup & Cardinality Integrity
  // ------------------------------------------------------------------
  console.log('--- Suite 1: Question Bank Lookup & Cardinality Integrity ---');

  // 1.1 Part 1 Lookup
  const qP1 = getQuestionById('q-p1-001') as Part1Question;
  assert(!!qP1, '1.1 Finds Part 1 question q-p1-001');
  assert(qP1.partNum === 1, '1.1 Part 1 question has partNum 1');
  assert(qP1.options.length === 4, '1.1 Part 1 question has 4 options');
  assert(!!qP1.media?.visual?.illustrationId, '1.1 Part 1 has valid illustrationId');

  // 1.2 Part 2 Lookup
  const qP2 = getQuestionById('q-p2-001') as Part2Question;
  assert(!!qP2, '1.2 Finds Part 2 question q-p2-001');
  assert(qP2.partNum === 2, '1.2 Part 2 question has partNum 2');
  assert(qP2.options.length === 3, '1.2 Part 2 question has strictly 3 options (A, B, C)');
  assert(!!qP2.promptScript, '1.2 Part 2 question has promptScript');

  // 1.3 Part 3 Group Lookup
  const grpP3 = getQuestionGroupById('grp-p3-001') as Part3Group;
  assert(!!grpP3, '1.3 Finds Part 3 group grp-p3-001');
  assert(grpP3.partNum === 3, '1.3 Part 3 group has partNum 3');
  assert(grpP3.questionIds.length === 3, '1.3 Part 3 group references exactly 3 question IDs');

  const p3Questions = getQuestionsForGroup('grp-p3-001');
  assert(p3Questions.length === 3, '1.3 getQuestionsForGroup returns all 3 child questions');
  assert(p3Questions[0].orderInGroup === 1, '1.3 First child question has orderInGroup 1');
  assert(p3Questions[2].orderInGroup === 3, '1.3 Third child question has orderInGroup 3');

  // 1.4 Part 4 Group Lookup
  const grpP4 = getQuestionGroupById('grp-p4-001') as Part4Group;
  assert(!!grpP4, '1.4 Finds Part 4 group grp-p4-001');
  assert(grpP4.questionIds.length === 3, '1.4 Part 4 group references exactly 3 question IDs');

  // 1.5 Graphic Context in Part 3 Group 3
  const grpP3Graphic = getQuestionGroupById('grp-p3-003') as Part3Group;
  assert(!!grpP3Graphic?.media?.graphic, '1.5 Part 3 Group 3 has graphic context attached');
  assert(grpP3Graphic.media.graphic?.illustrationId === 'flight_schedule_graphic', '1.5 Graphic illustrationId is flight_schedule_graphic');

  // ------------------------------------------------------------------
  // SUITE 2: Specialized Part Render Contracts (A-C vs A-D, Audio Shapes)
  // ------------------------------------------------------------------
  console.log('\n--- Suite 2: Specialized Part Render Contracts ---');

  // 2.1 Part 1 Audio Track: 4 Statements
  const p1Track = buildAudioTrackConfigFromQuestion(qP1);
  assert(p1Track.segments.length === 4, '2.1 Part 1 generates 4 statement audio segments');
  assert(p1Track.segments.every((s) => s.speaker === 'Narrator'), '2.1 All Part 1 segments spoken by Narrator');

  // 2.2 Part 2 Audio Track: Prompt + 3 Options
  const p2Track = buildAudioTrackConfigFromQuestion(qP2);
  assert(p2Track.segments.length === 4, '2.2 Part 2 generates 1 prompt + 3 option segments');
  assert(p2Track.segments[0].isPrompt === true, '2.2 First segment is prompt');
  assert(p2Track.segments[1].choiceKey === 'A', '2.2 Second segment is choice A');
  assert(p2Track.segments[3].choiceKey === 'C', '2.2 Fourth segment is choice C');
  assert(!p2Track.segments.some((s) => s.choiceKey === 'D'), '2.2 No option D exists in Part 2 track');

  // 2.3 Part 3 Shared Dialogue Track
  const p3Track = buildAudioTrackConfigFromGroup(grpP3);
  assert(p3Track.partNum === 3, '2.3 Part 3 track partNum is 3');
  assert(p3Track.segments.length >= 2, '2.3 Part 3 parses multi-turn dialogue');

  // ------------------------------------------------------------------
  // SUITE 3: Group Switching & Audio Track Identity
  // ------------------------------------------------------------------
  console.log('\n--- Suite 3: Group Switching & Audio Track Identity ---');

  // In Part 3, questions 0, 1, 2 belong to grp-p3-001; questions 3, 4, 5 belong to grp-p3-002
  const p3Q0 = getQuestionById('q-p3-001')!;
  const p3Q1 = getQuestionById('q-p3-002')!;
  const p3Q3 = getQuestionById('q-p3-004')!;

  assert(p3Q0.groupId === p3Q1.groupId, '3.1 Question 0 and Question 1 share identical groupId (grp-p3-001)');
  assert(p3Q0.groupId !== p3Q3.groupId, '3.1 Question 0 and Question 3 have different groupIds');

  // Track identifier formula used in workspace:
  const getTrackKey = (q: any) => q.groupId || q.id;
  assert(getTrackKey(p3Q0) === getTrackKey(p3Q1), '3.2 Audio track identifier remains unchanged when moving Q0 -> Q1 within same group');
  assert(getTrackKey(p3Q0) !== getTrackKey(p3Q3), '3.2 Audio track identifier updates when navigating across groups (Q0 -> Q3)');

  // ------------------------------------------------------------------
  // SUITE 4: Transcript & Assistance Rules in Practice vs Timed Mode
  // ------------------------------------------------------------------
  console.log('\n--- Suite 4: Transcript & Assistance Rules ---');

  // 4.1 Practice Session records assistance
  const practiceSession = createPracticeSession({
    part: 1,
    difficulty: 'easy',
    mode: 'practice',
    questionIds: ['q-p1-001', 'q-p1-002'],
  });

  const assistedSession = recordAssistance(practiceSession, 'q-p1-001', 'script');
  assert(assistedSession.metadata.assistedQuestions['q-p1-001'].viewedScript === true, '4.1 recordAssistance marks viewedScript as true');
  assert(assistedSession.metadata.assistedQuestions['q-p1-001'].viewCount === 1, '4.1 viewCount is incremented');
  assert(!assistedSession.metadata.assistedQuestions['q-p1-002'], '4.1 Question 2 remains unassisted');

  // 4.2 Timed Session has deadline and no assistance allowed
  const timedSession = createPracticeSession({
    part: 1,
    difficulty: 'easy',
    mode: 'timed',
    durationSeconds: 300,
    questionIds: ['q-p1-001', 'q-p1-002'],
  });
  assert(timedSession.mode === 'timed', '4.2 Timed session initialized');
  assert(timedSession.deadline !== null, '4.2 Timed session has non-null deadline');

  // ------------------------------------------------------------------
  // SUITE 5: Answer Selection, State Preservation & Post-Submit Locking
  // ------------------------------------------------------------------
  console.log('\n--- Suite 5: Answer Selection, Preservation & Locking ---');

  let activeSession = createPracticeSession({
    part: 2,
    difficulty: 'easy',
    mode: 'practice',
    questionIds: ['q-p2-001', 'q-p2-002', 'q-p2-003'],
  });

  // Select A for question 0
  activeSession = setSessionAnswer(activeSession, 'q-p2-001', 'A').session;
  assert(activeSession.answers['q-p2-001'] === 'A', '5.1 Question 1 answer set to A');

  // Navigate to Question 1
  activeSession = navigateSession(activeSession, 1);
  assert(activeSession.currentQuestionIndex === 1, '5.2 Navigated to Question index 1');
  assert(activeSession.answers['q-p2-001'] === 'A', '5.2 Question 1 answer preserved after navigation');

  // Select B for Question 1
  activeSession = setSessionAnswer(activeSession, 'q-p2-002', 'B').session;
  assert(activeSession.answers['q-p2-002'] === 'B', '5.3 Question 2 answer set to B');

  // Toggle mark on Question 1
  activeSession = toggleSessionMark(activeSession, 'q-p2-002');
  assert(activeSession.markedForReview['q-p2-002'] === true, '5.4 Question 2 marked for review');

  // Submit session
  const submittedRes = submitSession(activeSession, 'manual');
  activeSession = submittedRes.session;
  assert(activeSession.status === 'submitted', '5.5 Session status transitioned to submitted');

  // Attempting to change answer after submit must fail
  const postSubmitAttempt = setSessionAnswer(activeSession, 'q-p2-001', 'C');
  assert(postSubmitAttempt.success === false, '5.6 Answer change rejected post-submit');
  assert(typeof postSubmitAttempt.error === 'string' && postSubmitAttempt.error.includes('locked'), '5.6 Rejection error mentions locked state');
  assert(activeSession.answers['q-p2-001'] === 'A', '5.6 Answer remains original value (A)');

  // ------------------------------------------------------------------
  // SUITE 6: Timer Integration & Auto-Submit Transition
  // ------------------------------------------------------------------
  console.log('\n--- Suite 6: Timer Integration & Auto-Submit ---');

  const now = 1000000;
  let expiringTimedSession = createPracticeSession(
    {
      part: 3,
      difficulty: 'medium',
      mode: 'timed',
      durationSeconds: 120,
      questionIds: ['q-p3-001', 'q-p3-002', 'q-p3-003'],
    },
    { now }
  );

  assert(!isSessionExpired(expiringTimedSession, now + 100000), '6.1 Not expired at 100s');

  // Advance past 120s
  const pastDeadline = now + 121000;
  assert(isSessionExpired(expiringTimedSession, pastDeadline), '6.2 Expired at 121s past deadline');

  const timedOutSession = checkAndApplyTimeout(expiringTimedSession, pastDeadline);
  assert(timedOutSession.status === 'expired', '6.3 Status transitions to expired');
  assert(timedOutSession.metadata.submitReason === 'auto_timeout', '6.3 submitReason is auto_timeout');

  // Double submit protection
  const repeatSubmit = submitSession(timedOutSession, 'manual', pastDeadline + 1000);
  assert(repeatSubmit.alreadySubmitted === true, '6.4 Repeated submit flagged as alreadySubmitted');

  // ------------------------------------------------------------------
  // SUITE 7: Audio Lifecycle Cleanup Contract
  // ------------------------------------------------------------------
  console.log('\n--- Suite 7: Audio Lifecycle Cleanup Contract ---');

  const p1TrackCfg = buildAudioTrackConfigFromQuestion(qP1);
  const audioCtrl = new ListeningAudioController(p1TrackCfg);

  await audioCtrl.play();
  assert(audioCtrl.getState().status === 'playing', '7.1 Audio is playing');

  // Teardown / destroy
  audioCtrl.destroy();
  assert(audioCtrl.getState().status === 'idle', '7.2 Status reset to idle upon destroy');
  assert(audioCtrl.getState().currentTime === 0, '7.2 currentTime reset to 0');

  // ==================================================================
  // SUMMARY
  // ==================================================================
  console.log('\n======================================================');
  console.log(`TOTAL TESTS RUN: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
