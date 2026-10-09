/**
 * TOEIC Mastery Hub — Reading Workspace Contract & Unit Tests (Phase 8)
 *
 * Verifies Reading Workspace behavior and data contracts:
 * 1. Reading Question Bank Lookup & Cardinality Integrity (Part 5, Part 6, Part 7)
 * 2. Part 5 Incomplete Sentences Contracts (sentence with blank, 4 choices, grammar category)
 * 3. Part 6 Text Completion Group Integrity & Blank Mapping ([131]..[134], sentence insertion)
 * 4. Part 7 Multi-Passage Structures (Single, Double, Triple; diverse formats, cross-text)
 * 5. Mode-based Assistance & Concealment (Practice explanation tracking, Timed concealment)
 * 6. Answer Selection, Preservation & Post-Submit Lock
 * 7. Timed Practice Deadline & Auto-Timeout Transition
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
  checkAndApplyTimeout,
} from '../practiceSessionEngine';
import {
  Part5Question,
  Part6Group,
  Part6Question,
  Part7Group,
  Part7Question,
} from '../../types/questionBank';
import { FULL_QUESTION_BANK_MANIFEST } from '../../data/questionBank';

// Simple test runner matching Phase 1-7
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
console.log('🧪 RUNNING READING WORKSPACE CONTRACT TESTS (PHASE 8)');
console.log('======================================================');

// ============================================================================
// SUITE 1: Question Bank Lookup & Cardinality Integrity
// ============================================================================
runSuite('Suite 1: Reading Question Bank Lookup & Cardinality Integrity', () => {
  // 1.1 Part 5 Lookup
  const qP5 = getQuestionById('q-p5-001') as Part5Question;
  assert(qP5 !== undefined, '1.1 Finds Part 5 question q-p5-001');
  assert(qP5?.partNum === 5, '1.1 Part 5 question has partNum 5');
  assert(qP5?.section === 'reading', '1.1 Part 5 belongs to reading section');
  assert(qP5?.options.length === 4, '1.1 Part 5 question has exactly 4 options');
  assert(qP5?.sentence.includes('_____'), '1.1 Part 5 sentence contains blank placeholder');
  assert(Boolean(qP5?.grammarCategory), '1.1 Part 5 has grammarCategory specified');

  // 1.2 Part 6 Group & Questions Lookup
  const grpP6 = getQuestionGroupById('grp-p6-001') as Part6Group;
  assert(grpP6 !== undefined, '1.2 Finds Part 6 group grp-p6-001');
  assert(grpP6?.partNum === 6, '1.2 Part 6 group has partNum 6');
  assert(grpP6?.questionIds.length === 4, '1.2 Part 6 group references strictly 4 question IDs');

  const p6Questions = getQuestionsForGroup('grp-p6-001') as Part6Question[];
  assert(p6Questions.length === 4, '1.2 getQuestionsForGroup returns all 4 child questions');
  assert(p6Questions[0]?.blankNumber === 131, '1.2 First question corresponds to blank 131');
  assert(p6Questions[3]?.blankNumber === 134, '1.2 Fourth question corresponds to blank 134');
  assert(p6Questions[0]?.orderInGroup === 1, '1.2 Order in group starts at 1');
  assert(p6Questions[3]?.orderInGroup === 4, '1.2 Order in group ends at 4');

  // 1.3 Part 7 Group Lookup (Single, Double, Triple)
  const grpP7Single = getQuestionGroupById('grp-p7-001') as Part7Group;
  assert(grpP7Single?.passageFormat === 'single', '1.3 Group 1 is Single passage');
  assert(grpP7Single?.passages.length === 1, '1.3 Group 1 has 1 passage item');
  assert(grpP7Single?.questionIds.length === 2, '1.3 Group 1 has 2 questions');

  const grpP7Double = getQuestionGroupById('grp-p7-011') as Part7Group;
  assert(grpP7Double?.passageFormat === 'double', '1.3 Group 11 is Double passage');
  assert(grpP7Double?.passages.length === 2, '1.3 Group 11 has 2 passage items');
  assert(grpP7Double?.questionIds.length === 5, '1.3 Group 11 has 5 questions');

  const grpP7Triple = getQuestionGroupById('grp-p7-013') as Part7Group;
  assert(grpP7Triple?.passageFormat === 'triple', '1.3 Group 13 is Triple passage');
  assert(grpP7Triple?.passages.length === 3, '1.3 Group 13 has 3 passage items');
  assert(grpP7Triple?.questionIds.length === 5, '1.3 Group 13 has 5 questions');

  // 1.4 Verification of ID sets
  assert(
    verifyQuestionIdsExist(['q-p5-001', 'q-p6-001', 'q-p7-001']),
    '1.4 verifyQuestionIdsExist passes for sample Part 5-7 IDs'
  );
});

// ============================================================================
// SUITE 2: Part 5 Incomplete Sentences Contracts
// ============================================================================
runSuite('Suite 2: Part 5 Incomplete Sentences Contracts', () => {
  const p5Questions = (FULL_QUESTION_BANK_MANIFEST.partitions[5]?.questions ?? []) as Part5Question[];
  assert(p5Questions.length >= 20 && p5Questions.length === 30, '2.1 Part 5 has 30 authentic question items');

  let allHaveValidOptions = true;
  let allHaveSentences = true;
  let allHaveExplanations = true;

  for (const q of p5Questions) {
    if (!q || q.options.length !== 4) allHaveValidOptions = false;
    if (!q || !q.sentence || !q.sentence.includes('_____')) allHaveSentences = false;
    if (!q || !q.explanation || q.explanation.length < 15) allHaveExplanations = false;
  }

  assert(allHaveValidOptions, '2.2 Every Part 5 question has exactly 4 options (A, B, C, D)');
  assert(allHaveSentences, '2.3 Every Part 5 question contains a clear blank placeholder');
  assert(allHaveExplanations, '2.4 Every Part 5 question provides detailed explanations for distractors');
});

// ============================================================================
// SUITE 3: Part 6 Text Completion Blank Mapping & Group Integrity
// ============================================================================
runSuite('Suite 3: Part 6 Text Completion Blank Mapping & Group Integrity', () => {
  const grp = getQuestionGroupById('grp-p6-001') as Part6Group;
  const questions = getQuestionsForGroup('grp-p6-001') as Part6Question[];

  // 3.1 Verify all blanks exist in the passage text
  assert(grp.passageContent.includes('[131]'), '3.1 Passage content contains [131]');
  assert(grp.passageContent.includes('[132]'), '3.1 Passage content contains [132]');
  assert(grp.passageContent.includes('[133]'), '3.1 Passage content contains [133]');
  assert(grp.passageContent.includes('[134]'), '3.1 Passage content contains [134]');

  // 3.2 Question-blank mapping
  assert(questions[0].blankNumber === 131, '3.2 Question 0 maps to blank 131');
  assert(questions[1].blankNumber === 132, '3.2 Question 1 maps to blank 132');
  assert(questions[2].blankNumber === 133, '3.2 Question 2 maps to blank 133');
  assert(questions[3].blankNumber === 134, '3.2 Question 3 maps to blank 134');

  // 3.3 Sentence insertion question exists
  const sentenceInsertionQ = questions.find((q) => q.questionType === 'sentence_insertion');
  assert(sentenceInsertionQ !== undefined, '3.3 Group 1 contains a sentence_insertion question');
  assert(
    sentenceInsertionQ?.options[0].text.length! > 20,
    '3.3 Sentence insertion options are full sentence strings'
  );

  // 3.4 Group identity across questions
  const uniqueGroupIds = new Set(questions.map((q) => q.groupId));
  assert(uniqueGroupIds.size === 1, '3.4 All questions share strictly the same groupId');
  assert(uniqueGroupIds.has('grp-p6-001'), '3.4 Shared groupId matches group definition');
});

// ============================================================================
// SUITE 4: Part 7 Multi-Passage Structures & Cross-Text Synthesis
// ============================================================================
runSuite('Suite 4: Part 7 Multi-Passage Structures & Cross-Text Synthesis', () => {
  // 4.1 Double Passage formats
  const doubleGrp = getQuestionGroupById('grp-p7-011') as Part7Group;
  assert(doubleGrp.passages.length === 2, '4.1 Double passage has 2 texts');
  assert(doubleGrp.passages[0].formatType === 'email', '4.1 First passage is email');
  assert(doubleGrp.passages[1].formatType === 'form', '4.1 Second passage is form/invoice');

  // 4.2 Triple Passage formats
  const tripleGrp = getQuestionGroupById('grp-p7-013') as Part7Group;
  assert(tripleGrp.passages.length === 3, '4.2 Triple passage has 3 texts');
  assert(tripleGrp.passages[0].formatType === 'schedule', '4.2 First passage is schedule');
  assert(tripleGrp.passages[1].formatType === 'memo', '4.2 Second passage is memo');
  assert(tripleGrp.passages[2].formatType === 'email', '4.2 Third passage is email');

  // 4.3 Cross-Text synthesis questions
  const tripleQuestions = getQuestionsForGroup('grp-p7-013') as Part7Question[];
  const crossTextQuestions = tripleQuestions.filter((q) => q.crossTextReference === true);
  assert(
    crossTextQuestions.length >= 1,
    '4.3 Triple passage group includes questions requiring cross-text synthesis'
  );
  assert(
    crossTextQuestions[0].questionType === 'cross_text_synthesis',
    '4.3 Question type is explicitly cross_text_synthesis'
  );

  // 4.4 Questions length matches questionIds array
  assert(
    tripleQuestions.length === tripleGrp.questionIds.length,
    '4.4 Questions count exactly matches group questionIds array'
  );
});

// ============================================================================
// SUITE 5: Mode-based Assistance & Concealment
// ============================================================================
runSuite('Suite 5: Mode-based Assistance & Concealment', () => {
  // 5.1 Practice mode assistance tracking
  const practiceSession = createPracticeSession({
    part: 5,
    difficulty: 'mixed',
    mode: 'practice',
    questionIds: ['q-p5-001', 'q-p5-002', 'q-p5-003'],
    groupIds: [],
  });

  const assistedSession = recordAssistance(practiceSession, 'q-p5-001', 'explanation');
  const record = assistedSession.metadata.assistedQuestions['q-p5-001'];
  assert(record?.viewedExplanation === true, '5.1 recordAssistance marks viewedExplanation as true');
  assert(record?.viewCount === 1, '5.1 viewCount is incremented to 1');
  assert(
    assistedSession.metadata.assistedQuestions['q-p5-002'] === undefined,
    '5.1 Unassisted question has no record'
  );

  // 5.2 Timed mode configuration
  const timedSession = createPracticeSession({
    part: 6,
    difficulty: 'medium',
    mode: 'timed',
    durationSeconds: 180,
    questionIds: ['q-p6-001', 'q-p6-002', 'q-p6-003', 'q-p6-004'],
    groupIds: ['grp-p6-001'],
  });

  assert(timedSession.mode === 'timed', '5.2 Session mode is timed');
  assert(timedSession.deadline !== undefined, '5.2 Timed session has valid deadline epoch timestamp');
});

// ============================================================================
// SUITE 6: Answer Selection, Preservation & Lock Post-Submit
// ============================================================================
runSuite('Suite 6: Answer Selection, Preservation & Lock Post-Submit', () => {
  let session = createPracticeSession({
    part: 7,
    difficulty: 'hard',
    mode: 'practice',
    questionIds: ['q-p7-035', 'q-p7-036', 'q-p7-037', 'q-p7-038', 'q-p7-039'],
    groupIds: ['grp-p7-012'],
  });

  // 6.1 Set answer for question 0
  const ansRes1 = setSessionAnswer(session, 'q-p7-035', 'A');
  assert(ansRes1.success === true, '6.1 Answer set successfully');
  session = ansRes1.session;
  assert(session.answers['q-p7-035'] === 'A', '6.1 Question 0 answer set to A');

  // 6.2 Navigate to question index 2 and verify answer preserved
  session = navigateSession(session, 2);
  assert(session.currentQuestionIndex === 2, '6.2 Navigated to question index 2');
  assert(session.answers['q-p7-035'] === 'A', '6.2 Question 0 answer preserved after navigation');

  // 6.3 Set answer for question 2 and mark for review
  const ansRes2 = setSessionAnswer(session, 'q-p7-037', 'C');
  assert(ansRes2.success === true, '6.3 Question 2 answer set successfully');
  session = ansRes2.session;
  session = toggleSessionMark(session, 'q-p7-037');
  assert(session.answers['q-p7-037'] === 'C', '6.3 Question 2 answer set to C');
  assert(session.markedForReview['q-p7-037'] === true, '6.3 Question 2 marked for review');

  // 6.4 Submit session
  const subRes = submitSession(session, 'user');
  session = subRes.session;
  assert(session.status === 'submitted', '6.4 Session status transitioned to submitted');

  // 6.5 Attempt to modify answer post-submit (must return success: false)
  const lockedRes = setSessionAnswer(session, 'q-p7-035', 'B');
  assert(lockedRes.success === false, '6.5 Modification rejected post-submit');
  assert(
    Boolean(lockedRes.error?.includes('locked')),
    '6.5 Rejection error explains answers are locked'
  );
  assert(session.answers['q-p7-035'] === 'A', '6.5 Answer remains original value (A)');
});

// ============================================================================
// SUITE 7: Timed Practice Deadline & Auto-Timeout Transition
// ============================================================================
runSuite('Suite 7: Timed Practice Deadline & Auto-Timeout Transition', () => {
  const startedAt = 1000000;
  const durationSeconds = 300; // 5 mins
  const deadline = startedAt + durationSeconds * 1000;

  const timedSession = {
    ...createPracticeSession({
      part: 5,
      difficulty: 'easy',
      mode: 'timed',
      durationSeconds,
      questionIds: ['q-p5-001', 'q-p5-002'],
      groupIds: [],
    }),
    startedAt,
    deadline,
  };

  // 7.1 Before deadline
  const beforeDeadline = checkAndApplyTimeout(timedSession, startedAt + 100000);
  assert(beforeDeadline.status === 'active', '7.1 Session remains active before deadline');

  // 7.2 Past deadline
  const pastDeadline = checkAndApplyTimeout(timedSession, deadline + 1000);
  assert(pastDeadline.status === 'expired', '7.2 Session status transitions to expired past deadline');
  assert(
    pastDeadline.metadata.submitReason === 'auto_timeout',
    '7.2 submitReason is set to auto_timeout'
  );
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
