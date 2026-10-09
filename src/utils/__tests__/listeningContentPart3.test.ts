/**
 * TOEIC Mastery Hub — Listening Content Part 3 Contract Tests (Phase 3)
 *
 * Verifies that the Question Bank for Part 3 Conversations meets all ETS ExamForm requirements:
 * 1. Part 3 Conversations: >= 13 conversation groups (13 available), exactly 3 questions per group (39 items).
 * 2. Group Integrity: Strict two-way linkage between groups and questions, orderInGroup 1..3.
 * 3. Dialogue Authenticity: Natural multi-speaker turns (Man/Woman), audio scripts, transcripts, business contexts.
 * 4. Topic Diversity: Meetings, logistics, purchasing, recruitment, support, contracts, events, training.
 * 5. Option & Key Validity: 4 options (A-D) per question, valid correct keys, balanced distribution.
 * 6. Schema Validation: 100% pass pure `validateQuestionGroup` and `validateQuestion`.
 */

import { PART3_GROUPS, PART3_QUESTIONS } from '../../data/questionBank/part3Listening';
import { validateQuestionGroup, validateQuestion } from '../questionBankValidator';
import { LISTENING_ILLUSTRATIONS } from '../../components/Diagnostic/listeningIllustrationsMap';

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

console.log('================================================================');
console.log('TOEIC MASTERY HUB — LISTENING CONTENT PART 3 CONTRACT TESTS');
console.log('================================================================');

const qMap = new Map(PART3_QUESTIONS.map(q => [q.id, q]));

// ----------------------------------------------------------------------------
// Suite 1: Part 3 Group Cardinality & ExamForm Readiness (>= 13 groups, 39 Qs)
// ----------------------------------------------------------------------------
runSuite('Suite 1: Group Cardinality & ExamForm Readiness', () => {
  assert(PART3_GROUPS.length >= 13, `1.1 Group count >= 13 (got ${PART3_GROUPS.length})`);
  assert(PART3_QUESTIONS.length >= 39, `1.1 Question count >= 39 (got ${PART3_QUESTIONS.length})`);
  assert(PART3_GROUPS.length * 3 === PART3_QUESTIONS.length, `1.1 Exactly 3 questions per group ratio maintained`);

  // Verify each group has exactly 3 question IDs
  PART3_GROUPS.forEach((grp, idx) => {
    assert(
      grp.questionIds.length === 3,
      `1.2 [Grp ${idx + 1}] ${grp.id} contains strictly 3 question IDs`
    );
    assert(
      grp.groupType === 'part3_conversation',
      `1.2 [Grp ${idx + 1}] ${grp.id} groupType is part3_conversation`
    );
    assert(grp.partNum === 3, `1.2 [Grp ${idx + 1}] ${grp.id} partNum is 3`);
  });
});

// ----------------------------------------------------------------------------
// Suite 2: Dialogue & Multi-Speaker Turn Integrity
// ----------------------------------------------------------------------------
runSuite('Suite 2: Dialogue & Multi-Speaker Turn Integrity', () => {
  PART3_GROUPS.forEach((grp, idx) => {
    const hasAudioScript = Boolean(grp.media?.audio?.audioScript && grp.media.audio.audioScript.length > 50);
    const hasTranscript = Boolean(grp.media?.transcript && grp.media.transcript.length > 50);
    const hasSpeakerTurn = Boolean(grp.media?.audio?.audioScript?.includes('Man:') || grp.media?.audio?.audioScript?.includes('Woman:'));
    const hasAccent = ['US', 'UK', 'AU', 'CA'].includes(grp.media?.audio?.accent || '');

    assert(hasAudioScript, `2.1 [Grp ${idx + 1}] ${grp.id} has substantive audioScript`);
    assert(hasTranscript, `2.2 [Grp ${idx + 1}] ${grp.id} has complete transcript`);
    assert(hasSpeakerTurn, `2.3 [Grp ${idx + 1}] ${grp.id} audio script contains distinct speaker turns`);
    assert(hasAccent, `2.4 [Grp ${idx + 1}] ${grp.id} specifies valid accent (${grp.media?.audio?.accent})`);
    assert(Boolean(grp.contextIntro && grp.contextIntro.includes('conversation')), `2.5 [Grp ${idx + 1}] ${grp.id} has proper contextIntro`);
  });
});

// ----------------------------------------------------------------------------
// Suite 3: Topic & Communicative Diversity Across 13 Groups
// ----------------------------------------------------------------------------
runSuite('Suite 3: Topic & Business Context Diversity', () => {
  const topics = new Set(PART3_GROUPS.map(g => g.topic));
  console.log(`  Identified ${topics.size} unique workplace topics:`, Array.from(topics));

  assert(topics.size >= 8, `3.1 Diverse workplace topics >= 8 (got ${topics.size})`);
  assert(topics.has('Logistics'), '3.2 Logistics topic represented');
  assert(topics.has('Purchasing'), '3.2 Purchasing topic represented');
  assert(topics.has('Human Resources'), '3.2 Human Resources topic represented');
  assert(topics.has('Customer Support'), '3.2 Customer Support topic represented');
  assert(topics.has('Project Management'), '3.2 Project Management topic represented');
  assert(topics.has('Corporate Events'), '3.2 Corporate Events topic represented');
  assert(topics.has('Sales'), '3.2 Sales topic represented');
  assert(topics.has('Training'), '3.2 Training topic represented');

  // Verify graphic context if present (e.g. Flight schedule in Group 3)
  const graphicGroups = PART3_GROUPS.filter(g => Boolean(g.media.graphic));
  assert(graphicGroups.length >= 1, `3.3 At least 1 group has Graphic context (got ${graphicGroups.length})`);
  graphicGroups.forEach(grp => {
    const illId = grp.media.graphic?.illustrationId;
    assert(Boolean(illId && LISTENING_ILLUSTRATIONS[illId]), `3.4 Graphic illustration '${illId}' exists in asset map`);
  });
});

// ----------------------------------------------------------------------------
// Suite 4: Question Options, Keys, and Two-Way Linkage Integrity
// ----------------------------------------------------------------------------
runSuite('Suite 4: Question Options, Keys & Two-Way Linkage', () => {
  const keyCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };

  PART3_GROUPS.forEach((grp, gIdx) => {
    grp.questionIds.forEach((qId, qIdx) => {
      const q = qMap.get(qId);
      assert(Boolean(q), `4.1 [Grp ${gIdx + 1}] Question ${qId} exists in PART3_QUESTIONS`);
      if (!q) return;

      assert(q.groupId === grp.id, `4.2 [${qId}] Two-way link matches group ID (${grp.id})`);
      assert(q.orderInGroup === (qIdx + 1), `4.3 [${qId}] orderInGroup is ${qIdx + 1}`);
      assert(q.partNum === 3, `4.4 [${qId}] partNum is 3`);
      assert(q.section === 'listening', `4.4 [${qId}] section is listening`);

      // Options
      assert(q.options.length === 4, `4.5 [${qId}] has strictly 4 options`);
      const keys = q.options.map(o => o.key).join('');
      assert(keys === 'ABCD', `4.5 [${qId}] option keys are ABCD`);
      assert(['A', 'B', 'C', 'D'].includes(q.correctKey), `4.6 [${qId}] correctKey is valid A-D (${q.correctKey})`);
      keyCounts[q.correctKey] = (keyCounts[q.correctKey] || 0) + 1;

      // Pedagogical explanation
      assert(Boolean(q.explanation && q.explanation.length > 20), `4.7 [${qId}] has in-depth explanation`);
    });
  });

  // Balanced key distribution
  console.log('  Part 3 Answer Key Counts:', keyCounts);
  assert(keyCounts['A'] >= 5, `4.8 Key A is well-represented (got ${keyCounts['A']})`);
  assert(keyCounts['B'] >= 5, `4.8 Key B is well-represented (got ${keyCounts['B']})`);
  assert(keyCounts['C'] >= 5, `4.8 Key C is well-represented (got ${keyCounts['C']})`);
  assert(keyCounts['D'] >= 5, `4.8 Key D is well-represented (got ${keyCounts['D']})`);
});

// ----------------------------------------------------------------------------
// Suite 5: Global ID Uniqueness & Schema Validator Passing
// ----------------------------------------------------------------------------
runSuite('Suite 5: Global ID Uniqueness & Schema Validator Passing', () => {
  const grpIds = PART3_GROUPS.map(g => g.id);
  const uniqueGrpIds = new Set(grpIds);
  assert(uniqueGrpIds.size === PART3_GROUPS.length, `5.1 All ${PART3_GROUPS.length} group IDs are unique`);

  const qIds = PART3_QUESTIONS.map(q => q.id);
  const uniqueQIds = new Set(qIds);
  assert(uniqueQIds.size === PART3_QUESTIONS.length, `5.2 All ${PART3_QUESTIONS.length} question IDs are unique`);

  // Pure validation
  let allGroupsValid = true;
  PART3_GROUPS.forEach(grp => {
    const report = validateQuestionGroup(grp, qMap);
    if (!report.isValid) {
      allGroupsValid = false;
      console.error(`Group validation error on ${grp.id}:`, report.errors);
    }
  });
  assert(allGroupsValid, '5.3 100% of Part 3 groups pass validateQuestionGroup with 0 errors');

  let allQuestionsValid = true;
  PART3_QUESTIONS.forEach(q => {
    const report = validateQuestion(q);
    if (!report.isValid) {
      allQuestionsValid = false;
      console.error(`Question validation error on ${q.id}:`, report.errors);
    }
  });
  assert(allQuestionsValid, '5.4 100% of Part 3 questions pass validateQuestion with 0 errors');
});

console.log('\n================================================================');
console.log(`TOTAL TESTS RUN: ${totalAssertions}`);
console.log(`PASSED: ${passedAssertions}`);
console.log(`FAILED: ${failedAssertions}`);
console.log('================================================================\n');

if (failedAssertions > 0) {
  process.exit(1);
}
