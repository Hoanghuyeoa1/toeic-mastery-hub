/**
 * TOEIC Mastery Hub — Listening Content Part 1 & 2 Contract Tests (Phase 2)
 *
 * Verifies that the Question Bank for Part 1 & Part 2 meets all ETS ExamForm requirements:
 * 1. Part 1 Photographs: >= 6 authentic questions (10 available), genuine SVG illustrationIds,
 *    4 choices (A-D), audio scripts, transcripts, and detailed pedagogical explanations.
 * 2. Part 2 Question-Response: >= 25 authentic questions (25 available), promptScripts,
 *    strictly 3 choices (A-C, NO choice D), diverse ETS question archetypes, and trap tagging.
 * 3. Question Bank Integrity: 100% pass `validateQuestion`, zero duplicate IDs, correct keys.
 * 4. ExamForm Readiness: Can provide exactly 6 Part 1 questions and 25 Part 2 questions
 *    for a full 200-question ETS mock exam.
 */

import { PART1_QUESTIONS } from '../../data/questionBank/part1Listening';
import { PART2_QUESTIONS } from '../../data/questionBank/part2Listening';
import { validateQuestion } from '../questionBankValidator';
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
console.log('🧪 RUNNING LISTENING CONTENT PART 1 & 2 TESTS (PHASE 2)');
console.log('================================================================');

// ============================================================================
// SUITE 1: Part 1 Photographs Full Examination (>= 6 required, 10 provided)
// ============================================================================
runSuite('Suite 1: Part 1 Photographs Full Verification', () => {
  assert(PART1_QUESTIONS.length >= 6, `1.1 Part 1 meets >= 6 requirement (current: ${PART1_QUESTIONS.length})`);
  assert(PART1_QUESTIONS.length === 10, '1.1 Part 1 provides 10 high-quality photographic items');

  const registeredKeys = Object.keys(LISTENING_ILLUSTRATIONS);

  PART1_QUESTIONS.forEach((q, idx) => {
    const qNum = idx + 1;
    assert(q.partNum === 1, `1.2 [Q${qNum}] ${q.id} has partNum 1`);
    assert(q.section === 'listening', `1.2 [Q${qNum}] ${q.id} section is listening`);
    assert(q.options.length === 4, `1.2 [Q${qNum}] ${q.id} has strictly 4 options`);
    assert(
      q.options.map((o) => o.key).join('') === 'ABCD',
      `1.2 [Q${qNum}] ${q.id} options keys are ABCD`
    );
    assert(['A', 'B', 'C', 'D'].includes(q.correctKey), `1.2 [Q${qNum}] ${q.id} correctKey is valid A-D`);
    assert(
      Boolean(q.media.visual.illustrationId) && registeredKeys.includes(q.media.visual.illustrationId),
      `1.3 [Q${qNum}] ${q.id} illustrationId "${q.media.visual.illustrationId}" resolves to genuine SVG`
    );
    assert(Boolean(q.media.audio.audioScript), `1.3 [Q${qNum}] ${q.id} has complete TTS audioScript`);
    assert(Boolean(q.media.transcript), `1.3 [Q${qNum}] ${q.id} has transcript`);
    assert(Boolean(q.explanation && q.explanation.length > 30), `1.4 [Q${qNum}] ${q.id} has in-depth explanation`);
  });
});

// ============================================================================
// SUITE 2: Part 2 Question-Response Full Examination (>= 25 required, 25 provided)
// ============================================================================
runSuite('Suite 2: Part 2 Question-Response Full Verification', () => {
  assert(PART2_QUESTIONS.length >= 25, `2.1 Part 2 meets >= 25 requirement (current: ${PART2_QUESTIONS.length})`);
  assert(PART2_QUESTIONS.length === 25, '2.1 Part 2 provides exactly 25 high-quality Question-Response items');

  PART2_QUESTIONS.forEach((q, idx) => {
    const qNum = idx + 1;
    assert(q.partNum === 2, `2.2 [Q${qNum}] ${q.id} has partNum 2`);
    assert(q.section === 'listening', `2.2 [Q${qNum}] ${q.id} section is listening`);
    assert(q.options.length === 3, `2.2 [Q${qNum}] ${q.id} has strictly 3 options (NO Option D)`);
    assert(
      q.options.map((o) => o.key).join('') === 'ABC',
      `2.2 [Q${qNum}] ${q.id} options keys are strictly ABC`
    );
    assert(['A', 'B', 'C'].includes(q.correctKey), `2.2 [Q${qNum}] ${q.id} correctKey is valid A-C`);
    assert(Boolean(q.promptScript && q.promptScript.trim()), `2.3 [Q${qNum}] ${q.id} has promptScript`);
    assert(Boolean(q.media.audio.audioScript), `2.3 [Q${qNum}] ${q.id} has TTS audioScript`);
    assert(Boolean(q.media.transcript), `2.3 [Q${qNum}] ${q.id} has transcript`);
    assert(Boolean(q.explanation && q.explanation.length > 40), `2.4 [Q${qNum}] ${q.id} has in-depth explanation`);
    assert(Boolean(q.trapType && q.trapType.trim()), `2.4 [Q${qNum}] ${q.id} has trapType identified`);
  });
});

// ============================================================================
// SUITE 3: Part 2 Archetype & Communicative Diversity
// ============================================================================
runSuite('Suite 3: Part 2 Archetype & Communicative Diversity', () => {
  // Check that all key TOEIC Part 2 archetypes are covered
  const prompts = PART2_QUESTIONS.map((q) => q.promptScript.toLowerCase());

  const hasWhere = prompts.some((p) => p.startsWith('where'));
  const hasWhen = prompts.some((p) => p.startsWith('when'));
  const hasWho = prompts.some((p) => p.startsWith('who'));
  const hasWhy = prompts.some((p) => p.startsWith('why') || p.includes("why didn't"));
  const hasHow = prompts.some((p) => p.startsWith('how'));
  const hasAlternativeOr = prompts.some((p) => p.includes(' or '));
  const hasNegative = prompts.some((p) => p.startsWith("isn't") || p.startsWith("aren't") || p.startsWith("didn't"));
  const hasTagQuestion = prompts.some((p) => p.includes("wasn't it") || p.includes("didn't you") || p.includes("isn't it"));
  const hasSuggestion = prompts.some((p) => p.startsWith("why don't we") || p.startsWith("how about"));
  const hasPoliteRequest = prompts.some((p) => p.startsWith('would you mind') || p.startsWith('could you'));

  assert(hasWhere, '3.1 Wh- Where question exists');
  assert(hasWhen, '3.1 Wh- When question exists');
  assert(hasWho, '3.1 Wh- Who question exists');
  assert(hasWhy, '3.1 Wh- Why question exists');
  assert(hasHow, '3.1 Wh- How question exists');
  assert(hasAlternativeOr, '3.2 Alternative (Or) question exists');
  assert(hasNegative, '3.2 Negative question exists');
  assert(hasTagQuestion, '3.2 Tag question exists');
  assert(hasSuggestion, '3.3 Suggestion (Why don\'t we) exists');
  assert(hasPoliteRequest, '3.3 Polite request (Would you mind / Could you) exists');

  // Key balance: A, B, C all present as correct keys
  const keys = PART2_QUESTIONS.map((q) => q.correctKey);
  const aCount = keys.filter((k) => k === 'A').length;
  const bCount = keys.filter((k) => k === 'B').length;
  const cCount = keys.filter((k) => k === 'C').length;

  assert(aCount >= 5, `3.4 Key A distributed across answers (count: ${aCount})`);
  assert(bCount >= 5, `3.4 Key B distributed across answers (count: ${bCount})`);
  assert(cCount >= 5, `3.4 Key C distributed across answers (count: ${cCount})`);
});

// ============================================================================
// SUITE 4: Global ID Uniqueness & Schema Validator Passing
// ============================================================================
runSuite('Suite 4: Global ID Uniqueness & Schema Validator Passing', () => {
  const combinedPart12 = [...PART1_QUESTIONS, ...PART2_QUESTIONS];
  const allIds = combinedPart12.map((q) => q.id);
  const uniqueIds = new Set(allIds);

  assert(uniqueIds.size === 35, `4.1 All 35 questions (10 P1 + 25 P2) have unique IDs (got ${uniqueIds.size})`);

  let allPassValidator = true;
  for (const q of combinedPart12) {
    const rep = validateQuestion(q);
    if (!rep.isValid) {
      allPassValidator = false;
      console.error(`Question ${q.id} failed validation:`, rep.errors);
    }
  }

  assert(allPassValidator, '4.2 100% of Part 1 and Part 2 questions pass pure validateQuestion with 0 errors');
});

// ============================================================================
// SUMMARY REPORT
// ============================================================================
console.log('\n================================================================');
console.log(`TOTAL TESTS RUN: ${totalAssertions}`);
console.log(`PASSED: ${passedAssertions}`);
console.log(`FAILED: ${failedAssertions}`);
console.log('================================================================');

if (failedAssertions > 0) {
  process.exit(1);
}
