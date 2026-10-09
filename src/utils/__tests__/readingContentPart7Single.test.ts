/**
 * TOEIC Mastery Hub — Reading Content Part 7 Single Passages Contract Test Suite (Phase 7)
 *
 * Exhaustive contract and validation test suite for TOEIC Part 7 Single Passages:
 * 1. Single Passage Cardinality & ExamForm Blueprint Alignment (10 groups, 29 questions total, sizes: 4x2, 3x3, 3x4)
 * 2. Passage Authenticity & Workplace Genre Diversity (Email, Notice, Chat, Schedule, Ad, Product, Review, Memo, Letter, Press Release)
 * 3. Group & Question Relational Integrity (Parent-child references, sequential ordering 1..N)
 * 4. Question Skill Taxonomy & Evidence Verification (purpose, detail, inference, vocabulary_in_context, contextual_interpretation, sentence_insertion)
 * 5. Options, Choices & Balanced Key Distribution (A: 7, B: 7, C: 8, D: 7)
 * 6. Global Validation Engine & Schema Conformity (100% pass validateQuestionGroup and validateQuestion)
 */

import {
  PART7_SINGLE_GROUPS,
  PART7_SINGLE_QUESTIONS,
  PART7_GROUPS,
  PART7_QUESTIONS,
} from '../../data/questionBank/part7Reading';
import { ALL_READING_QUESTIONS, ALL_READING_GROUPS } from '../../data/questionBank/readingBank';
import { ALL_QUESTIONS, ALL_GROUPS } from '../../data/questionBank/index';
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
console.log('🧪 RUNNING READING CONTENT PART 7 SINGLE PASSAGES CONTRACT TESTS (PHASE 7)');
console.log('================================================================');

// ----------------------------------------------------------------------------
// SUITE 1: Single Passage Cardinality & ExamForm Blueprint Alignment
// ----------------------------------------------------------------------------
console.log('\n--- Suite 1: Single Passage Cardinality & ExamForm Blueprint Alignment ---');

// 1.1 Exactly 10 single-passage groups for standard ExamForm 200 questions
assert(
  PART7_SINGLE_GROUPS.length === 10,
  `1.1 Part 7 has exactly 10 single passage groups (actual: ${PART7_SINGLE_GROUPS.length})`
);

// 1.2 Exactly 29 questions total for Part 7 single passages
assert(
  PART7_SINGLE_QUESTIONS.length === 29,
  `1.2 Part 7 Single Passages has exactly 29 questions (actual: ${PART7_SINGLE_QUESTIONS.length})`
);

// 1.3 Stable Group IDs: grp-p7-001 to grp-p7-010
const expectedGroupIds = Array.from({ length: 10 }, (_, i) => {
  const num = (i + 1).toString().padStart(3, '0');
  return `grp-p7-${num}`;
});
const actualGroupIds = PART7_SINGLE_GROUPS.map(g => g.id);
const allGroupIdsMatch = expectedGroupIds.every((id, idx) => actualGroupIds[idx] === id);
assert(allGroupIdsMatch, '1.3 Single passage Group IDs are stable (grp-p7-001 to grp-p7-010)');

// 1.4 Sequential Question IDs: q-p7-001 to q-p7-029
const expectedQuestionIds = Array.from({ length: 29 }, (_, i) => {
  const num = (i + 1).toString().padStart(3, '0');
  return `q-p7-${num}`;
});
const actualQuestionIds = PART7_SINGLE_QUESTIONS.map(q => q.id);
const allQuestionIdsMatch = expectedQuestionIds.every((id, idx) => actualQuestionIds[idx] === id);
assert(allQuestionIdsMatch, '1.4 Question IDs are strictly sequential from q-p7-001 to q-p7-029');

// 1.5 Unique IDs
const uniqueGroupIds = new Set(actualGroupIds);
const uniqueQuestionIds = new Set(actualQuestionIds);
assert(uniqueGroupIds.size === 10, '1.5 All Group IDs are strictly unique');
assert(uniqueQuestionIds.size === 29, '1.6 All Question IDs are strictly unique');

// 1.7 Single passage format enforcement
const allSingleFormat = PART7_SINGLE_GROUPS.every(g => g.passageFormat === 'single');
assert(allSingleFormat, '1.7 All 10 groups have passageFormat === "single"');

const allSingleItem = PART7_SINGLE_GROUPS.every(g => g.passages.length === 1);
assert(allSingleItem, '1.8 All 10 groups contain exactly 1 ReadingPassageItem');

// 1.9 Question count per group bounds: each group has 2 to 4 questions
const allWithin2To4 = PART7_SINGLE_GROUPS.every(
  g => g.questionIds.length >= 2 && g.questionIds.length <= 4
);
assert(allWithin2To4, '1.9 Every single passage group contains between 2 and 4 questions');

// 1.10 ETS Blueprint breakdown: 4 passages x 2 Qs, 3 passages x 3 Qs, 3 passages x 4 Qs
const groupSizes = PART7_SINGLE_GROUPS.map(g => g.questionIds.length);
const groupsWith2 = groupSizes.filter(s => s === 2).length;
const groupsWith3 = groupSizes.filter(s => s === 3).length;
const groupsWith4 = groupSizes.filter(s => s === 4).length;
assert(groupsWith2 === 4, `1.10 Exactly 4 groups have 2 questions (actual: ${groupsWith2})`);
assert(groupsWith3 === 3, `1.11 Exactly 3 groups have 3 questions (actual: ${groupsWith3})`);
assert(groupsWith4 === 3, `1.12 Exactly 3 groups have 4 questions (actual: ${groupsWith4})`);

const totalCalculatedQuestions = groupSizes.reduce((sum, s) => sum + s, 0);
assert(
  totalCalculatedQuestions === 29,
  `1.13 Sum of questions across all 10 single groups equals exactly 29 (${groupsWith2}*2 + ${groupsWith3}*3 + ${groupsWith4}*4 = ${totalCalculatedQuestions})`
);

// 1.14 Difficulty distribution across groups
const difficulties = PART7_SINGLE_GROUPS.map(g => g.difficulty);
assert(difficulties.includes('easy'), '1.14 Includes easy difficulty groups (Groups 1-3)');
assert(difficulties.includes('medium'), '1.15 Includes medium difficulty groups (Groups 4-7)');
assert(difficulties.includes('hard'), '1.16 Includes hard difficulty groups (Groups 8-10)');

// ----------------------------------------------------------------------------
// SUITE 2: Passage Authenticity & Workplace Genre Diversity
// ----------------------------------------------------------------------------
console.log('\n--- Suite 2: Passage Authenticity & Workplace Genre Diversity ---');

const expectedGenres = [
  { index: 0, id: 'grp-p7-001', expectedFormat: 'email', expectedTopic: 'Software Licensing & Customer Service' },
  { index: 1, id: 'grp-p7-002', expectedFormat: 'notice', expectedTopic: 'Facilities Management & Maintenance' },
  { index: 2, id: 'grp-p7-003', expectedFormat: 'chat', expectedTopic: 'Marketing & Presentation Coordination' },
  { index: 3, id: 'grp-p7-004', expectedFormat: 'schedule', expectedTopic: 'Professional Development & Logistics Summit' },
  { index: 4, id: 'grp-p7-005', expectedFormat: 'advertisement', expectedTopic: 'Real Estate & Co-working Amenities' },
  { index: 5, id: 'grp-p7-006', expectedFormat: 'article', expectedTopic: 'Office Equipment & Environmental Health' },
  { index: 6, id: 'grp-p7-007', expectedFormat: 'article', expectedTopic: 'Software Evaluation & Fleet Management' },
  { index: 7, id: 'grp-p7-008', expectedFormat: 'notice', expectedTopic: 'Human Resources & Remote Work Policy' },
  { index: 8, id: 'grp-p7-009', expectedFormat: 'letter', expectedTopic: 'Manufacturing & Supplier Relations' },
  { index: 9, id: 'grp-p7-010', expectedFormat: 'article', expectedTopic: 'Corporate Mergers & Biotechnology' },
];

expectedGenres.forEach(genreSpec => {
  const grp = PART7_SINGLE_GROUPS[genreSpec.index];
  assert(grp.id === genreSpec.id, `2.1 [${grp.id}] Group at index ${genreSpec.index} has correct ID`);
  const passage = grp.passages[0];
  assert(
    passage.formatType === genreSpec.expectedFormat,
    `2.2 [${grp.id}] Passage formatType is "${passage.formatType}" (expected: ${genreSpec.expectedFormat})`
  );
  assert(
    typeof passage.title === 'string' && passage.title.trim().length > 0,
    `2.3 [${grp.id}] Passage title is defined: "${passage.title}"`
  );
  assert(
    typeof grp.contextIntro === 'string' && grp.contextIntro.trim().length > 0,
    `2.4 [${grp.id}] Context intro is defined: "${grp.contextIntro}"`
  );
  assert(
    passage.content.trim().length >= 150,
    `2.5 [${grp.id}] Passage content has substantial workplace depth (${passage.content.length} chars)`
  );
});

// ----------------------------------------------------------------------------
// SUITE 3: Group & Question Relational Integrity
// ----------------------------------------------------------------------------
console.log('\n--- Suite 3: Group & Question Relational Integrity ---');

PART7_SINGLE_GROUPS.forEach((group: Part7Group) => {
  const groupQuestions = PART7_SINGLE_QUESTIONS.filter(q => q.groupId === group.id);

  // 3.1 Question count matches group.questionIds length
  assert(
    groupQuestions.length === group.questionIds.length,
    `3.1 [${group.id}] Group has ${group.questionIds.length} linked questions`
  );

  // 3.2 Question IDs and order match precisely
  group.questionIds.forEach((qId, idx) => {
    const question = PART7_SINGLE_QUESTIONS.find(q => q.id === qId);
    assert(
      question !== undefined,
      `3.2 [${group.id}] Question ID ${qId} exists in PART7_SINGLE_QUESTIONS`
    );
    if (question) {
      assert(
        question.groupId === group.id,
        `3.3 [${question.id}] Question groupId links to parent group ${group.id}`
      );
      assert(
        question.orderInGroup === idx + 1,
        `3.4 [${question.id}] Question orderInGroup is strictly ${idx + 1}`
      );
      assert(
        question.partNum === 7 && question.part === 'Part 7' && question.section === 'reading',
        `3.5 [${question.id}] Question has proper TOEIC Part 7 metadata`
      );
    }
  });
});

// ----------------------------------------------------------------------------
// SUITE 4: Question Skill Taxonomy & Evidence Verification
// ----------------------------------------------------------------------------
console.log('\n--- Suite 4: Question Skill Taxonomy & Evidence Verification ---');

const questionTypeCounts: Record<string, number> = {};

PART7_SINGLE_QUESTIONS.forEach(q => {
  const type = q.questionType || 'unknown';
  questionTypeCounts[type] = (questionTypeCounts[type] || 0) + 1;

  // 4.1 Explanation non-empty and substantive
  assert(
    typeof q.explanation === 'string' && q.explanation.trim().length >= 40,
    `4.1 [${q.id}] Explanation provides thorough pedagogical rationale (${q.explanation.length} chars)`
  );

  // 4.2 Meaningful skillTag
  assert(
    typeof q.skillTag === 'string' && q.skillTag.trim().length > 0,
    `4.2 [${q.id}] Has meaningful skillTag "${q.skillTag}"`
  );

  // 4.3 Prompt text non-empty
  assert(
    typeof q.question === 'string' && q.question.trim().length > 0,
    `4.3 [${q.id}] Has valid question prompt`
  );
});

console.log('  Part 7 Single question type counts:', questionTypeCounts);

// 4.4 Diversity of skills
assert(
  (questionTypeCounts.purpose || 0) >= 3,
  `4.4 Purpose questions well-represented (${questionTypeCounts.purpose || 0} >= 3)`
);
assert(
  (questionTypeCounts.detail || 0) >= 15,
  `4.5 Factual / Detail questions well-represented (${questionTypeCounts.detail || 0} >= 15)`
);
assert(
  (questionTypeCounts.inference || 0) >= 3,
  `4.6 Inference questions well-represented (${questionTypeCounts.inference || 0} >= 3)`
);
assert(
  (questionTypeCounts.vocabulary_in_context || 0) >= 1,
  `4.7 Vocabulary-in-context questions present (${questionTypeCounts.vocabulary_in_context || 0} >= 1)`
);
assert(
  (questionTypeCounts.contextual_interpretation || 0) >= 1,
  `4.8 Contextual interpretation questions present (${questionTypeCounts.contextual_interpretation || 0} >= 1)`
);
assert(
  (questionTypeCounts.sentence_insertion || 0) >= 2,
  `4.9 Sentence insertion questions present (${questionTypeCounts.sentence_insertion || 0} >= 2)`
);

// 4.10 Sentence insertion integrity in Groups 8 and 10
const sentenceInsertionQs = PART7_SINGLE_QUESTIONS.filter(q => q.questionType === 'sentence_insertion');
assert(
  sentenceInsertionQs.length === 2,
  `4.10 Exactly 2 sentence insertion questions in single passages`
);

sentenceInsertionQs.forEach(siQ => {
  // Option keys are A, B, C, D with texts [1], [2], [3], [4]
  assert(siQ.options[0].text === '[1]', `4.11 [${siQ.id}] Option A is "[1]"`);
  assert(siQ.options[1].text === '[2]', `4.12 [${siQ.id}] Option B is "[2]"`);
  assert(siQ.options[2].text === '[3]', `4.13 [${siQ.id}] Option C is "[3]"`);
  assert(siQ.options[3].text === '[4]', `4.14 [${siQ.id}] Option D is "[4]"`);

  // Target passage contains markers [1], [2], [3], [4] in order
  const parentGroup = PART7_SINGLE_GROUPS.find(g => g.id === siQ.groupId);
  assert(parentGroup !== undefined, `4.15 [${siQ.id}] Parent group exists`);
  if (parentGroup) {
    const text = parentGroup.passages[0].content;
    const pos1 = text.indexOf('[1]');
    const pos2 = text.indexOf('[2]');
    const pos3 = text.indexOf('[3]');
    const pos4 = text.indexOf('[4]');
    assert(
      pos1 !== -1 && pos2 !== -1 && pos3 !== -1 && pos4 !== -1,
      `4.16 [${parentGroup.id}] Passage contains all 4 position markers [1], [2], [3], [4]`
    );
    assert(
      pos1 < pos2 && pos2 < pos3 && pos3 < pos4,
      `4.17 [${parentGroup.id}] Position markers appear in strictly ascending order`
    );
  }
});

// ----------------------------------------------------------------------------
// SUITE 5: Options, Choices & Balanced Key Distribution
// ----------------------------------------------------------------------------
console.log('\n--- Suite 5: Options, Choices & Balanced Key Distribution ---');

const keyCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };

PART7_SINGLE_QUESTIONS.forEach(q => {
  // 5.1 Strictly 4 options
  assert(q.options.length === 4, `5.1 [${q.id}] Has strictly 4 options`);

  // 5.2 Option keys A, B, C, D in order
  const keys = q.options.map(o => o.key);
  assert(
    keys[0] === 'A' && keys[1] === 'B' && keys[2] === 'C' && keys[3] === 'D',
    `5.2 [${q.id}] Option keys are ordered A, B, C, D`
  );

  // 5.3 Option texts unique
  const texts = q.options.map(o => o.text.trim().toLowerCase());
  const uniqueTexts = new Set(texts);
  assert(uniqueTexts.size === 4, `5.3 [${q.id}] All 4 options are distinct`);

  // 5.4 Valid correctKey
  assert(
    ['A', 'B', 'C', 'D'].includes(q.correctKey),
    `5.4 [${q.id}] correctKey "${q.correctKey}" is valid`
  );

  keyCounts[q.correctKey]++;
});

console.log(`  Part 7 Single Key distribution: A=${keyCounts.A}, B=${keyCounts.B}, C=${keyCounts.C}, D=${keyCounts.D}`);

// 5.5 Balanced answer key distribution across 29 questions (A:7, B:7, C:8, D:7)
assert(keyCounts.A === 7, `5.5 Key A count is exactly 7 (actual: ${keyCounts.A})`);
assert(keyCounts.B === 7, `5.6 Key B count is exactly 7 (actual: ${keyCounts.B})`);
assert(keyCounts.C === 8, `5.7 Key C count is exactly 8 (actual: ${keyCounts.C})`);
assert(keyCounts.D === 7, `5.8 Key D count is exactly 7 (actual: ${keyCounts.D})`);

// 5.9 Group-level key diversity: each group has at least 2 distinct keys
PART7_SINGLE_GROUPS.forEach(g => {
  const gQuestions = PART7_SINGLE_QUESTIONS.filter(q => q.groupId === g.id);
  const distinctKeys = new Set(gQuestions.map(q => q.correctKey));
  assert(
    distinctKeys.size >= 2,
    `5.9 [${g.id}] Group has diversified answer keys (${distinctKeys.size} distinct keys among ${gQuestions.length} questions)`
  );
});

// ----------------------------------------------------------------------------
// SUITE 6: Global Validation Engine & Schema Conformity
// ----------------------------------------------------------------------------
console.log('\n--- Suite 6: Global Validation Engine & Schema Conformity ---');

// 6.1 validateQuestionGroup on all 10 single passage groups
PART7_SINGLE_GROUPS.forEach(group => {
  const report = validateQuestionGroup(group);
  assert(
    report.isValid,
    `6.1 [${group.id}] validateQuestionGroup passed (errors: ${report.errors.length})`
  );
  if (!report.isValid) {
    console.error('Group errors:', report.errors);
  }
});

// 6.2 validateQuestion on all 29 single passage questions
PART7_SINGLE_QUESTIONS.forEach(question => {
  const report = validateQuestion(question);
  assert(
    report.isValid,
    `6.2 [${question.id}] validateQuestion passed (errors: ${report.errors.length})`
  );
  if (!report.isValid) {
    console.error('Question errors:', report.errors);
  }
});

// 6.3 Inclusion in PART7_GROUPS and PART7_QUESTIONS
const part7AllGroupIds = new Set(PART7_GROUPS.map(g => g.id));
const part7AllQuestionIds = new Set(PART7_QUESTIONS.map(q => q.id));

PART7_SINGLE_GROUPS.forEach(g => {
  assert(part7AllGroupIds.has(g.id), `6.3 [${g.id}] Included in PART7_GROUPS`);
});

PART7_SINGLE_QUESTIONS.forEach(q => {
  assert(part7AllQuestionIds.has(q.id), `6.4 [${q.id}] Included in PART7_QUESTIONS`);
});

// 6.5 Inclusion in ALL_READING_GROUPS and ALL_READING_QUESTIONS
const readingGroupIds = new Set(ALL_READING_GROUPS.map(g => g.id));
const readingQuestionIds = new Set(ALL_READING_QUESTIONS.map(q => q.id));

PART7_SINGLE_GROUPS.forEach(g => {
  assert(readingGroupIds.has(g.id), `6.5 [${g.id}] Included in ALL_READING_GROUPS`);
});

PART7_SINGLE_QUESTIONS.forEach(q => {
  assert(readingQuestionIds.has(q.id), `6.6 [${q.id}] Included in ALL_READING_QUESTIONS`);
});

// 6.7 Inclusion in ALL_GROUPS and ALL_QUESTIONS
const allGroupIds = new Set(ALL_GROUPS.map(g => g.id));
const allQuestionIdsSet = new Set(ALL_QUESTIONS.map(q => q.id));

PART7_SINGLE_GROUPS.forEach(g => {
  assert(allGroupIds.has(g.id), `6.7 [${g.id}] Included in ALL_GROUPS`);
});

PART7_SINGLE_QUESTIONS.forEach(q => {
  assert(allQuestionIdsSet.has(q.id), `6.8 [${q.id}] Included in ALL_QUESTIONS`);
});

// ----------------------------------------------------------------------------
// FINAL SUMMARY
// ----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`🏁 PART 7 SINGLE PASSAGES TEST RESULTS: ${testsPassed}/${testsRun} passed (${testsFailed} failed)`);
console.log('================================================================');

if (testsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
