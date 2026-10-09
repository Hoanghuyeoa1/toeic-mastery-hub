/**
 * TOEIC Mastery Hub — Listening Content Part 4 Contract Tests (Phase 4)
 *
 * Verifies that the Question Bank for Part 4 Short Talks meets all ETS ExamForm requirements:
 * 1. Part 4 Short Talks: >= 10 talk groups (10 available), exactly 3 questions per group (30 items).
 * 2. Group Integrity: Strict two-way linkage between groups and questions, orderInGroup 1..3.
 * 3. Talk Authenticity: Coherent spoken monologue, audio scripts, transcripts, real-world business contexts.
 * 4. Topic Diversity: Announcements, voicemails, training, broadcasts, logistics, transit, tech launch, museum.
 * 5. Option & Key Validity: 4 options (A-D) per question, valid correct keys, balanced distribution.
 * 6. Graphic Integrity: Store directory graphic linked to registered SVG asset.
 * 7. Schema Validation: 100% pass pure `validateQuestionGroup` and `validateQuestion`.
 */

import { PART4_GROUPS, PART4_QUESTIONS } from '../../data/questionBank/part4Listening';
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
console.log('TOEIC MASTERY HUB — LISTENING CONTENT PART 4 CONTRACT TESTS');
console.log('================================================================');

const qMap = new Map(PART4_QUESTIONS.map(q => [q.id, q]));

// ----------------------------------------------------------------------------
// Suite 1: Part 4 Group Cardinality & ExamForm Readiness (>= 10 groups, 30 Qs)
// ----------------------------------------------------------------------------
runSuite('Suite 1: Group Cardinality & ExamForm Readiness', () => {
  assert(PART4_GROUPS.length >= 10, `1.1 Group count >= 10 (got ${PART4_GROUPS.length})`);
  assert(PART4_QUESTIONS.length >= 30, `1.1 Question count >= 30 (got ${PART4_QUESTIONS.length})`);
  assert(PART4_GROUPS.length * 3 === PART4_QUESTIONS.length, `1.1 Exactly 3 questions per group ratio maintained`);

  // Verify each group has exactly 3 question IDs
  PART4_GROUPS.forEach((grp, idx) => {
    assert(grp.questionIds.length === 3, `1.2 [Grp ${idx + 1}: ${grp.id}] has exactly 3 question IDs`);
    assert(grp.partNum === 4, `1.3 [${grp.id}] partNum is 4`);
    assert(grp.groupType === 'part4_talk', `1.4 [${grp.id}] groupType is 'part4_talk'`);
  });
});

// ----------------------------------------------------------------------------
// Suite 2: Spoken Talk Authenticity & Monologue Structure
// ----------------------------------------------------------------------------
runSuite('Suite 2: Spoken Talk Authenticity & Monologue Structure', () => {
  PART4_GROUPS.forEach((grp, idx) => {
    const audioScript = grp.media.audio?.audioScript || '';
    const transcript = grp.media.transcript || '';

    assert(audioScript.length >= 120, `2.1 [Grp ${idx + 1}: ${grp.id}] audioScript is substantial (${audioScript.length} chars)`);
    assert(transcript.length >= 120, `2.2 [Grp ${idx + 1}: ${grp.id}] transcript is substantial (${transcript.length} chars)`);

    // Ensure proper context introductory statement
    assert(
      Boolean(grp.contextIntro && grp.contextIntro.includes('refer to the following')),
      `2.3 [Grp ${idx + 1}: ${grp.id}] has valid contextIntro ('${grp.contextIntro}')`
    );

    // Audio accent metadata
    const accent = grp.media.audio?.accent;
    assert(
      ['US', 'UK', 'CA', 'AU'].includes(accent || ''),
      `2.4 [Grp ${idx + 1}: ${grp.id}] has standard ETS accent (${accent})`
    );
  });
});

// ----------------------------------------------------------------------------
// Suite 3: Topic Diversity & Graphic Media Integrity
// ----------------------------------------------------------------------------
runSuite('Suite 3: Topic Diversity & Graphic Media Integrity', () => {
  const topics = new Set(PART4_GROUPS.map(g => g.topic));
  console.log('  Part 4 Unique Topics:', Array.from(topics));
  assert(topics.size >= 8, `3.1 Diverse topics represented across 10 groups (got ${topics.size})`);

  assert(topics.has('Travel'), '3.2 Travel topic represented');
  assert(topics.has('Procurement'), '3.2 Procurement topic represented');
  assert(topics.has('Retail'), '3.2 Retail topic represented');
  assert(topics.has('Training'), '3.2 Training topic represented');
  assert(topics.has('News & Media'), '3.2 News & Media topic represented');
  assert(topics.has('Logistics'), '3.2 Logistics topic represented');
  assert(topics.has('Customer Service'), '3.2 Customer Service topic represented');
  assert(topics.has('Transportation'), '3.2 Transportation topic represented');
  assert(topics.has('Technology'), '3.2 Technology topic represented');
  assert(topics.has('Public Events'), '3.2 Public Events topic represented');

  // Verify graphic context if present (e.g. Store Floor Directory in Group 3)
  const graphicGroups = PART4_GROUPS.filter(g => Boolean(g.media.graphic));
  assert(graphicGroups.length >= 1, `3.3 At least 1 group has Graphic context (got ${graphicGroups.length})`);
  graphicGroups.forEach(grp => {
    const illId = grp.media.graphic?.illustrationId;
    assert(Boolean(illId && LISTENING_ILLUSTRATIONS[illId]), `3.4 Graphic illustration '${illId}' exists in asset map`);
  });
});

// ----------------------------------------------------------------------------
// Suite 4: Question Options, Keys & Two-Way Linkage Integrity
// ----------------------------------------------------------------------------
runSuite('Suite 4: Question Options, Keys & Two-Way Linkage', () => {
  const keyCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };

  PART4_GROUPS.forEach((grp, gIdx) => {
    grp.questionIds.forEach((qId, qIdx) => {
      const q = qMap.get(qId);
      assert(Boolean(q), `4.1 [Grp ${gIdx + 1}] Question ${qId} exists in PART4_QUESTIONS`);
      if (!q) return;

      assert(q.groupId === grp.id, `4.2 [${qId}] Two-way link matches group ID (${grp.id})`);
      assert(q.orderInGroup === (qIdx + 1), `4.3 [${qId}] orderInGroup is ${qIdx + 1}`);
      assert(q.partNum === 4, `4.4 [${qId}] partNum is 4`);
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
  console.log('  Part 4 Answer Key Counts:', keyCounts);
  assert(keyCounts['A'] >= 4, `4.8 Key A is well-represented (got ${keyCounts['A']})`);
  assert(keyCounts['B'] >= 4, `4.8 Key B is well-represented (got ${keyCounts['B']})`);
  assert(keyCounts['C'] >= 4, `4.8 Key C is well-represented (got ${keyCounts['C']})`);
  assert(keyCounts['D'] >= 4, `4.8 Key D is well-represented (got ${keyCounts['D']})`);
});

// ----------------------------------------------------------------------------
// Suite 5: Global ID Uniqueness & Schema Validator Passing
// ----------------------------------------------------------------------------
runSuite('Suite 5: Global ID Uniqueness & Schema Validator Passing', () => {
  const grpIds = PART4_GROUPS.map(g => g.id);
  const uniqueGrpIds = new Set(grpIds);
  assert(uniqueGrpIds.size === PART4_GROUPS.length, `5.1 All ${PART4_GROUPS.length} group IDs are unique`);

  const qIds = PART4_QUESTIONS.map(q => q.id);
  const uniqueQIds = new Set(qIds);
  assert(uniqueQIds.size === PART4_QUESTIONS.length, `5.2 All ${PART4_QUESTIONS.length} question IDs are unique`);

  // Pure validation
  let allGroupsValid = true;
  PART4_GROUPS.forEach(grp => {
    const report = validateQuestionGroup(grp, qMap);
    if (!report.isValid) {
      allGroupsValid = false;
      console.error(`Group validation error on ${grp.id}:`, report.errors);
    }
  });
  assert(allGroupsValid, '5.3 100% of Part 4 groups pass validateQuestionGroup with 0 errors');

  let allQuestionsValid = true;
  PART4_QUESTIONS.forEach(q => {
    const report = validateQuestion(q);
    if (!report.isValid) {
      allQuestionsValid = false;
      console.error(`Question validation error on ${q.id}:`, report.errors);
    }
  });
  assert(allQuestionsValid, '5.4 100% of Part 4 questions pass validateQuestion with 0 errors');
});

console.log('\n================================================================');
console.log(`TOTAL TESTS RUN: ${totalAssertions}`);
console.log(`PASSED: ${passedAssertions}`);
console.log(`FAILED: ${failedAssertions}`);
console.log('================================================================\n');

if (failedAssertions > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
