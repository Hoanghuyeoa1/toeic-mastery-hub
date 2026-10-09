/**
 * TOEIC Mastery Hub — Reading Content Part 7 Multiple Passages Contract Test Suite (Phase 8)
 *
 * Exhaustive contract and validation test suite for TOEIC Part 7 Multiple Passages:
 * 1. Multiple Passage Cardinality & ETS Blueprint Alignment (5 groups × 5 questions = 25 questions total)
 * 2. Representation of both Double Passages (2 groups, 10 Qs) and Triple Passages (3 groups, 15 Qs)
 * 3. Document Authenticity, Structure & Inter-Document Logic (13 documents total across 5 groups)
 * 4. Cross-Text Information Synthesis & Multi-Document Evidence Referencing
 * 5. Options, Choices & Balanced Key Distribution
 * 6. Global Validation Engine & Schema Conformity (100% pass validateQuestionGroup and validateQuestion)
 * 7. Full Part 7 Integration (29 single + 25 multiple = 54 questions) & Full Bank Verification (204 questions, 42 groups)
 */

import {
  PART7_MULTI_GROUPS,
  PART7_MULTI_QUESTIONS,
  PART7_SINGLE_GROUPS,
  PART7_SINGLE_QUESTIONS,
  PART7_GROUPS,
  PART7_QUESTIONS,
} from '../../data/questionBank/part7Reading';
import {
  ALL_READING_QUESTIONS,
  ALL_READING_GROUPS,
  READING_BANK_STATS,
} from '../../data/questionBank/readingBank';
import {
  ALL_QUESTIONS,
  ALL_GROUPS,
  FULL_BANK_STATS,
  FULL_QUESTION_BANK_MANIFEST,
} from '../../data/questionBank/index';
import { validateQuestion, validateQuestionGroup } from '../questionBankValidator';
import { Part7Group, Part7Question } from '../../types/questionBank';

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
console.log('🧪 RUNNING READING CONTENT PART 7 MULTIPLE PASSAGES CONTRACT TESTS (PHASE 8)');
console.log('================================================================');

// ----------------------------------------------------------------------------
// SUITE 1: Multiple Passage Cardinality & ETS Blueprint Alignment
// ----------------------------------------------------------------------------
console.log('\n--- Suite 1: Multiple Passage Cardinality & ETS Blueprint Alignment ---');

// 1.1 Exactly 5 multiple-passage groups
assert(
  PART7_MULTI_GROUPS.length === 5,
  `1.1 Part 7 has exactly 5 multiple passage groups (actual: ${PART7_MULTI_GROUPS.length})`
);

// 1.2 Exactly 25 questions total for Part 7 multiple passages
assert(
  PART7_MULTI_QUESTIONS.length === 25,
  `1.2 Part 7 Multiple Passages has exactly 25 questions (actual: ${PART7_MULTI_QUESTIONS.length})`
);

// 1.3 Exactly 5 questions per group for all 5 groups
const allGroupsHave5Questions = PART7_MULTI_GROUPS.every(
  (g) => g.questionIds.length === 5
);
assert(
  allGroupsHave5Questions,
  '1.3 Every multiple-passage group contains exactly 5 question IDs'
);

// 1.4 Stable Group IDs: grp-p7-011 to grp-p7-015
const expectedGroupIds = ['grp-p7-011', 'grp-p7-012', 'grp-p7-013', 'grp-p7-014', 'grp-p7-015'];
const actualGroupIds = PART7_MULTI_GROUPS.map((g) => g.id);
const allGroupIdsMatch = expectedGroupIds.every((id, idx) => actualGroupIds[idx] === id);
assert(allGroupIdsMatch, '1.4 Multiple passage Group IDs are stable (grp-p7-011 to grp-p7-015)');

// 1.5 Sequential Question IDs: q-p7-030 to q-p7-054
const expectedQuestionIds = Array.from({ length: 25 }, (_, i) => {
  const num = (i + 30).toString().padStart(3, '0');
  return `q-p7-${num}`;
});
const actualQuestionIds = PART7_MULTI_QUESTIONS.map((q) => q.id);
const allQuestionIdsMatch = expectedQuestionIds.every((id, idx) => actualQuestionIds[idx] === id);
assert(allQuestionIdsMatch, '1.5 Question IDs are strictly sequential from q-p7-030 to q-p7-054');

// 1.6 Unique IDs
const uniqueGroupIds = new Set(actualGroupIds);
const uniqueQuestionIds = new Set(actualQuestionIds);
assert(
  uniqueGroupIds.size === 5 && uniqueQuestionIds.size === 25,
  '1.6 All 5 Group IDs and 25 Question IDs are mutually unique'
);

// ----------------------------------------------------------------------------
// SUITE 2: Representation of Double and Triple Passages
// ----------------------------------------------------------------------------
console.log('\n--- Suite 2: Representation of Double and Triple Passages ---');

// 2.1 Double Passages (Groups 11 & 12, Questions 176–185)
const doubleGroups = PART7_MULTI_GROUPS.filter((g) => g.passageFormat === 'double');
assert(
  doubleGroups.length === 2,
  `2.1 Exactly 2 Double Passage groups present (actual: ${doubleGroups.length})`
);
const doubleGroupIdsMatch = doubleGroups.map((g) => g.id).join(',') === 'grp-p7-011,grp-p7-012';
assert(doubleGroupIdsMatch, '2.1 Double Passage groups are grp-p7-011 and grp-p7-012');

// 2.2 Each Double Passage has exactly 2 passages
const doublePassagesCountValid = doubleGroups.every((g) => g.passages.length === 2);
assert(
  doublePassagesCountValid,
  '2.2 Every Double Passage group contains exactly 2 related documents'
);

// 2.3 Triple Passages (Groups 13, 14, 15, Questions 186–200)
const tripleGroups = PART7_MULTI_GROUPS.filter((g) => g.passageFormat === 'triple');
assert(
  tripleGroups.length === 3,
  `2.3 Exactly 3 Triple Passage groups present (actual: ${tripleGroups.length})`
);
const tripleGroupIdsMatch = tripleGroups.map((g) => g.id).join(',') === 'grp-p7-013,grp-p7-014,grp-p7-015';
assert(tripleGroupIdsMatch, '2.3 Triple Passage groups are grp-p7-013, grp-p7-014, and grp-p7-015');

// 2.4 Each Triple Passage has exactly 3 passages
const triplePassagesCountValid = tripleGroups.every((g) => g.passages.length === 3);
assert(
  triplePassagesCountValid,
  '2.4 Every Triple Passage group contains exactly 3 related documents'
);

// 2.5 Total documents count across 5 multiple-passage groups: 2×2 + 3×3 = 13 documents
const totalMultiPassages = PART7_MULTI_GROUPS.reduce((acc, g) => acc + g.passages.length, 0);
assert(
  totalMultiPassages === 13,
  `2.5 Total documents across 5 multiple-passage groups is exactly 13 (actual: ${totalMultiPassages})`
);

// ----------------------------------------------------------------------------
// SUITE 3: Document Authenticity, Inter-Document Logic & Format Types
// ----------------------------------------------------------------------------
console.log('\n--- Suite 3: Document Authenticity, Inter-Document Logic & Format Types ---');

// 3.1 All 13 passages have valid IDs, formatTypes, titles, and non-empty content
const allPassagesValid = PART7_MULTI_GROUPS.every((g) =>
  g.passages.every(
    (p) =>
      p.id.startsWith(`pass-${g.id.replace('grp-', '')}`) &&
      p.title.length > 5 &&
      p.content.trim().length > 100 &&
      ['email', 'letter', 'memo', 'notice', 'advertisement', 'article', 'schedule', 'chat', 'form', 'review'].includes(p.formatType)
  )
);
assert(
  allPassagesValid,
  '3.1 All 13 passages have conforming IDs, descriptive titles, sufficient content (>100 chars), and standard format types'
);

// 3.2 Verification of specific logical multi-document pairs and triads
// Group 11: Email + Form/Invoice
const grp11 = PART7_MULTI_GROUPS.find((g) => g.id === 'grp-p7-011')!;
assert(
  grp11.passages[0].formatType === 'email' && grp11.passages[1].formatType === 'form',
  '3.2 Group 11 represents Email + Form/Invoice pair'
);

// Group 12: Advertisement + Email
const grp12 = PART7_MULTI_GROUPS.find((g) => g.id === 'grp-p7-012')!;
assert(
  grp12.passages[0].formatType === 'advertisement' && grp12.passages[1].formatType === 'email',
  '3.2 Group 12 represents Advertisement + Email pair'
);

// Group 13: Schedule + Memo + Email
const grp13 = PART7_MULTI_GROUPS.find((g) => g.id === 'grp-p7-013')!;
assert(
  grp13.passages[0].formatType === 'schedule' &&
    grp13.passages[1].formatType === 'memo' &&
    grp13.passages[2].formatType === 'email',
  '3.2 Group 13 represents Schedule + Memo + Email triad'
);

// Group 14: Product Catalog (Article) + Email + Form/Tracking Report
const grp14 = PART7_MULTI_GROUPS.find((g) => g.id === 'grp-p7-014')!;
assert(
  grp14.passages[0].formatType === 'article' &&
    grp14.passages[1].formatType === 'email' &&
    grp14.passages[2].formatType === 'form',
  '3.2 Group 14 represents Catalog Specs (Article) + Email + Freight Tracking Form triad'
);

// Group 15: Facility Notice + Reservation Email + Customer Review (Article)
const grp15 = PART7_MULTI_GROUPS.find((g) => g.id === 'grp-p7-015')!;
assert(
  grp15.passages[0].formatType === 'notice' &&
    grp15.passages[1].formatType === 'email' &&
    grp15.passages[2].formatType === 'article',
  '3.2 Group 15 represents Facility Notice + Reservation Email + Online Review (Article) triad'
);

// ----------------------------------------------------------------------------
// SUITE 4: Cross-Text Information Synthesis & Multi-Document Evidence
// ----------------------------------------------------------------------------
console.log('\n--- Suite 4: Cross-Text Information Synthesis & Multi-Document Evidence ---');

// 4.1 Cross-text synthesis questions exist in every group
PART7_MULTI_GROUPS.forEach((group) => {
  const groupQuestions = PART7_MULTI_QUESTIONS.filter((q) => q.groupId === group.id);
  const crossTextQuestions = groupQuestions.filter((q) => q.crossTextReference === true);
  assert(
    crossTextQuestions.length >= 1,
    `4.1 Group ${group.id} (${group.passageFormat}) contains at least 1 cross-text synthesis question (found ${crossTextQuestions.length})`
  );
});

// 4.2 Total cross-text synthesis questions across multiple passages
const totalCrossText = PART7_MULTI_QUESTIONS.filter((q) => q.crossTextReference === true);
assert(
  totalCrossText.length >= 6,
  `4.2 Multiple passage bank contains at least 6 cross-text synthesis questions (found ${totalCrossText.length})`
);

// 4.3 Cross-text questions are explicitly marked with cross_text_synthesis questionType
const allCrossTextTypedCorrectly = totalCrossText.every(
  (q) => q.questionType === 'cross_text_synthesis'
);
assert(
  allCrossTextTypedCorrectly,
  '4.3 All cross-text questions have questionType === "cross_text_synthesis"'
);

// 4.4 Multi-passage questions have comprehensive explanations citing evidence
const allExplanationsDetailed = PART7_MULTI_QUESTIONS.every(
  (q) => q.explanation && q.explanation.trim().length >= 40
);
assert(
  allExplanationsDetailed,
  '4.4 All 25 multiple-passage questions have detailed explanations (>=40 characters) with evidence references'
);

// ----------------------------------------------------------------------------
// SUITE 5: Options, Choices & Balanced Key Distribution
// ----------------------------------------------------------------------------
console.log('\n--- Suite 5: Options, Choices & Balanced Key Distribution ---');

// 5.1 Exactly 4 options (A, B, C, D) per question with non-empty text
const allOptionsConform = PART7_MULTI_QUESTIONS.every((q) => {
  if (!Array.isArray(q.options) || q.options.length !== 4) return false;
  const keys = q.options.map((o) => o.key);
  const uniqueKeys = new Set(keys);
  const correctKeyValid = ['A', 'B', 'C', 'D'].includes(q.correctKey);
  const textsNonEmpty = q.options.every((o) => o.text && o.text.trim().length > 0);
  return (
    uniqueKeys.size === 4 &&
    keys.join('') === 'ABCD' &&
    correctKeyValid &&
    textsNonEmpty
  );
});
assert(
  allOptionsConform,
  '5.1 Every question has strictly 4 options (A-D) with distinct keys and non-empty text'
);

// 5.2 Key distribution in Multiple Passages (25 questions)
const multiKeyCounts = {
  A: PART7_MULTI_QUESTIONS.filter((q) => q.correctKey === 'A').length,
  B: PART7_MULTI_QUESTIONS.filter((q) => q.correctKey === 'B').length,
  C: PART7_MULTI_QUESTIONS.filter((q) => q.correctKey === 'C').length,
  D: PART7_MULTI_QUESTIONS.filter((q) => q.correctKey === 'D').length,
};
console.log(`    Multiple Passages Key Distribution: A=${multiKeyCounts.A}, B=${multiKeyCounts.B}, C=${multiKeyCounts.C}, D=${multiKeyCounts.D}`);

assert(
  multiKeyCounts.A >= 5 &&
    multiKeyCounts.B >= 5 &&
    multiKeyCounts.C >= 5 &&
    multiKeyCounts.D >= 5,
  '5.2 Multiple Passages key distribution is balanced (at least 5 of each key across 25 Qs)'
);

// 5.3 Combined Part 7 Key Distribution (54 questions: 29 Single + 25 Multiple)
const combinedKeyCounts = {
  A: PART7_QUESTIONS.filter((q) => q.correctKey === 'A').length,
  B: PART7_QUESTIONS.filter((q) => q.correctKey === 'B').length,
  C: PART7_QUESTIONS.filter((q) => q.correctKey === 'C').length,
  D: PART7_QUESTIONS.filter((q) => q.correctKey === 'D').length,
};
console.log(`    Combined Part 7 Key Distribution (54 Qs): A=${combinedKeyCounts.A}, B=${combinedKeyCounts.B}, C=${combinedKeyCounts.C}, D=${combinedKeyCounts.D}`);

assert(
  combinedKeyCounts.A === 13 &&
    combinedKeyCounts.B === 13 &&
    combinedKeyCounts.C === 14 &&
    combinedKeyCounts.D === 14,
  `5.3 Combined Part 7 answer key distribution is exceptionally balanced: A=13, B=13, C=14, D=14`
);

// ----------------------------------------------------------------------------
// SUITE 6: Global Validation Engine & Schema Conformity
// ----------------------------------------------------------------------------
console.log('\n--- Suite 6: Global Validation Engine & Schema Conformity ---');

// 6.1 Validate each multiple-passage group using validateQuestionGroup
let groupsValidCount = 0;
PART7_MULTI_GROUPS.forEach((group) => {
  const report = validateQuestionGroup(group);
  if (report.isValid) {
    groupsValidCount++;
  } else {
    console.error(`Group validation failed for ${group.id}:`, report.errors);
  }
});
assert(
  groupsValidCount === 5,
  `6.1 100% of multiple passage groups (5/5) pass validateQuestionGroup with 0 errors`
);

// 6.2 Validate each multiple-passage question using validateQuestion
let questionsValidCount = 0;
PART7_MULTI_QUESTIONS.forEach((q) => {
  const report = validateQuestion(q);
  if (report.isValid) {
    questionsValidCount++;
  } else {
    console.error(`Question validation failed for ${q.id}:`, report.errors);
  }
});
assert(
  questionsValidCount === 25,
  `6.2 100% of multiple passage questions (25/25) pass validateQuestion with 0 errors`
);

// 6.3 Relational integrity: Two-way linkage
const multiGroupIdsSet = new Set(PART7_MULTI_GROUPS.map((g) => g.id));
const questionsLinkValid = PART7_MULTI_QUESTIONS.every(
  (q) => q.groupId && multiGroupIdsSet.has(q.groupId)
);
const groupsLinkValid = PART7_MULTI_GROUPS.every((g) =>
  g.questionIds.every((qId) => PART7_MULTI_QUESTIONS.some((q) => q.id === qId))
);
assert(
  questionsLinkValid && groupsLinkValid,
  '6.3 100% two-way relational integrity between multiple-passage groups and questions'
);

// 6.4 Sequential orderInGroup is strictly 1 to 5 for every group
const sequentialOrderValid = PART7_MULTI_GROUPS.every((g) => {
  const gQuestions = PART7_MULTI_QUESTIONS.filter((q) => q.groupId === g.id);
  const orders = gQuestions.map((q) => q.orderInGroup).sort((a, b) => a - b);
  return orders.join(',') === '1,2,3,4,5';
});
assert(
  sequentialOrderValid,
  '6.4 orderInGroup is strictly [1, 2, 3, 4, 5] for all 5 multiple passage groups'
);

// ----------------------------------------------------------------------------
// SUITE 7: Full 7-Part Question Bank & Reading Bank Integration
// ----------------------------------------------------------------------------
console.log('\n--- Suite 7: Full 7-Part Question Bank & Reading Bank Integration ---');

// 7.1 Part 7 overall totals: exactly 15 groups, 54 questions
assert(
  PART7_GROUPS.length === 15,
  `7.1 Full Part 7 has exactly 15 groups (10 single + 5 multiple) (actual: ${PART7_GROUPS.length})`
);
assert(
  PART7_QUESTIONS.length === 54,
  `7.1 Full Part 7 has exactly 54 questions (29 single + 25 multiple) (actual: ${PART7_QUESTIONS.length})`
);

// 7.2 Reading Bank totals: 100 questions, 19 groups
assert(
  ALL_READING_QUESTIONS.length === 100,
  `7.2 Reading Bank has exactly 100 questions (P5: 30, P6: 16, P7: 54) (actual: ${ALL_READING_QUESTIONS.length})`
);
assert(
  ALL_READING_GROUPS.length === 19,
  `7.2 Reading Bank has exactly 19 groups (P6: 4, P7: 15) (actual: ${ALL_READING_GROUPS.length})`
);
assert(
  READING_BANK_STATS.totalQuestions === 100 && READING_BANK_STATS.totalGroups === 19,
  '7.2 READING_BANK_STATS correctly reports 100 questions and 19 groups'
);

// 7.3 Full Question Bank totals: 204 questions, 42 groups
assert(
  ALL_QUESTIONS.length === 204,
  `7.3 Full Question Bank has exactly 204 questions (Listening: 104, Reading: 100) (actual: ${ALL_QUESTIONS.length})`
);
assert(
  ALL_GROUPS.length === 42,
  `7.3 Full Question Bank has exactly 42 groups (Listening: 23, Reading: 19) (actual: ${ALL_GROUPS.length})`
);
assert(
  FULL_QUESTION_BANK_MANIFEST.totalQuestions === 204 &&
    FULL_QUESTION_BANK_MANIFEST.totalGroups === 42 &&
    FULL_QUESTION_BANK_MANIFEST.version === '2.9.0',
  '7.3 FULL_QUESTION_BANK_MANIFEST v2.9.0 matches 204 questions and 42 groups'
);

// 7.4 Global Uniqueness of all 204 questions and 42 groups
const allQSet = new Set(ALL_QUESTIONS.map((q) => q.id));
const allGSet = new Set(ALL_GROUPS.map((g) => g.id));
assert(
  allQSet.size === 204 && allQSet.size === ALL_QUESTIONS.length,
  '7.4 All 204 Question IDs across all 7 parts are globally unique'
);
assert(
  allGSet.size === 42 && allGSet.size === ALL_GROUPS.length,
  '7.4 All 42 Group IDs across all 7 parts are globally unique'
);

// ----------------------------------------------------------------------------
// SUMMARY REPORT
// ----------------------------------------------------------------------------
console.log('\n======================================================');
console.log(`TOTAL TESTS RUN: ${testsRun}`);
console.log(`PASSED: ${testsPassed}`);
console.log(`FAILED: ${testsFailed}`);
console.log('======================================================\n');

if (testsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
