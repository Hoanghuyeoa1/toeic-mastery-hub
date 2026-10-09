/**
 * TOEIC Mastery Hub — Reading Content Part 6 Contract Test Suite (Phase 6)
 *
 * Exhaustive contract and validation test suite for TOEIC Part 6 (Text Completion):
 * 1. Part 6 Group Cardinality & ExamForm Readiness (4 groups, 16 questions total)
 * 2. Blank Mapping & Sequential Integrity (131-146 sequential, strict order 1-4)
 * 3. Question Types Diversity (word forms, vocabulary, sentence insertion)
 * 4. Options, Choices & Balanced Key Distribution (A:4, B:4, C:4, D:4)
 * 5. Text Reconstruction & Passage Contextual Integrity (no leftover brackets, no double periods)
 * 6. Global Validation Engine & Schema Conformity (100% pass validateQuestionGroup and validateQuestion)
 */

import { PART6_GROUPS, PART6_QUESTIONS } from '../../data/questionBank/part6Reading';
import { ALL_READING_QUESTIONS, ALL_READING_GROUPS } from '../../data/questionBank/readingBank';
import { ALL_QUESTIONS, ALL_GROUPS } from '../../data/questionBank/index';
import { validateQuestion, validateQuestionGroup } from '../questionBankValidator';
import { Part6Group, Part6Question } from '../../types/questionBank';

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
console.log('🧪 RUNNING READING CONTENT PART 6 CONTRACT TESTS (PHASE 6)');
console.log('================================================================');

// ----------------------------------------------------------------------------
// SUITE 1: Group Cardinality & ExamForm Readiness
// ----------------------------------------------------------------------------
console.log('\n--- Suite 1: Group Cardinality & ExamForm Readiness ---');

// 1.1 Minimum requirement >= 4 groups for standard ExamForm
assert(
  PART6_GROUPS.length === 4,
  `1.1 Part 6 has exactly 4 passage groups (actual: ${PART6_GROUPS.length})`
);

// 1.2 Exactly 16 questions total (4 questions per group)
assert(
  PART6_QUESTIONS.length === 16,
  `1.2 Part 6 has exactly 16 questions (actual: ${PART6_QUESTIONS.length})`
);

// 1.3 Stable Group IDs
const expectedGroupIds = ['grp-p6-001', 'grp-p6-002', 'grp-p6-003', 'grp-p6-004'];
const actualGroupIds = PART6_GROUPS.map(g => g.id);
const allGroupIdsMatch = expectedGroupIds.every((id, idx) => actualGroupIds[idx] === id);
assert(allGroupIdsMatch, '1.3 Group IDs are stable (grp-p6-001 to grp-p6-004)');

// 1.4 Sequential Question IDs
const expectedQuestionIds = Array.from({ length: 16 }, (_, i) => {
  const num = (i + 1).toString().padStart(3, '0');
  return `q-p6-${num}`;
});
const actualQuestionIds = PART6_QUESTIONS.map(q => q.id);
const allQuestionIdsMatch = expectedQuestionIds.every((id, idx) => actualQuestionIds[idx] === id);
assert(allQuestionIdsMatch, '1.4 Question IDs are strictly sequential from q-p6-001 to q-p6-016');

// 1.5 Unique IDs
const uniqueGroupIds = new Set(actualGroupIds);
const uniqueQuestionIds = new Set(actualQuestionIds);
assert(uniqueGroupIds.size === 4, '1.5 All Group IDs are strictly unique');
assert(uniqueQuestionIds.size === 16, '1.6 All Question IDs are strictly unique');

// 1.7 Diverse passage genres
const genres = new Set(PART6_GROUPS.map(g => g.passageType));
assert(genres.has('email'), '1.7 Contains email text type');
assert(genres.has('memo'), '1.8 Contains memo text type');
assert(genres.has('notice'), '1.9 Contains notice text type');
assert(genres.has('letter'), '1.10 Contains letter text type');

// 1.8 Difficulty distribution across groups
const groupDifficulties = PART6_GROUPS.map(g => g.difficulty);
assert(groupDifficulties.includes('easy'), '1.11 Includes easy difficulty group');
assert(groupDifficulties.includes('medium'), '1.12 Includes medium difficulty group');
assert(groupDifficulties.includes('hard'), '1.13 Includes hard difficulty group');

// ----------------------------------------------------------------------------
// SUITE 2: Blank Mapping & Sequential Integrity
// ----------------------------------------------------------------------------
console.log('\n--- Suite 2: Blank Mapping & Sequential Integrity ---');

PART6_GROUPS.forEach((group: Part6Group, groupIndex: number) => {
  // 2.1 Exactly 4 question IDs per group
  assert(
    group.questionIds.length === 4,
    `2.1 [${group.id}] Group has exactly 4 question references`
  );

  // Expected blank numbers for this group: 131-134, 135-138, 139-142, 143-146
  const startBlank = 131 + groupIndex * 4;
  const expectedBlanks = [startBlank, startBlank + 1, startBlank + 2, startBlank + 3];

  const groupQuestions = PART6_QUESTIONS.filter(q => q.groupId === group.id);
  assert(
    groupQuestions.length === 4,
    `2.2 [${group.id}] Exactly 4 questions linked via groupId`
  );

  // 2.3 Verify orderInGroup and blankNumber
  groupQuestions.forEach((q, idx) => {
    assert(
      q.orderInGroup === (idx + 1),
      `2.3 [${q.id}] orderInGroup is strictly ${idx + 1}`
    );
    assert(
      q.blankNumber === expectedBlanks[idx],
      `2.4 [${q.id}] blankNumber is strictly ${expectedBlanks[idx]}`
    );
    assert(
      group.questionIds[idx] === q.id,
      `2.5 [${group.id}] questionIds[${idx}] matches question ${q.id}`
    );
  });

  // 2.6 Verify blanks exist in passageContent
  expectedBlanks.forEach(bNum => {
    const blankToken = `[${bNum}]`;
    const count = (group.passageContent.match(new RegExp(`\\[${bNum}\\]`, 'g')) || []).length;
    assert(
      count === 1,
      `2.6 [${group.id}] Blank token ${blankToken} appears exactly once in passage text`
    );
  });

  // 2.7 Verify blanks appear in sequential order inside the passage
  const positions = expectedBlanks.map(bNum => group.passageContent.indexOf(`[${bNum}]`));
  const strictlyAscending = positions[0] < positions[1] && positions[1] < positions[2] && positions[2] < positions[3];
  assert(
    strictlyAscending,
    `2.7 [${group.id}] Blanks appear in strictly ascending order within passage content`
  );
});

// ----------------------------------------------------------------------------
// SUITE 3: Question Types Diversity & Explanations
// ----------------------------------------------------------------------------
console.log('\n--- Suite 3: Question Types Diversity & Explanations ---');

const questionTypeCounts: Record<string, number> = {
  vocabulary: 0,
  grammar: 0,
  sentence_insertion: 0,
};

PART6_QUESTIONS.forEach(q => {
  questionTypeCounts[q.questionType] = (questionTypeCounts[q.questionType] || 0) + 1;

  // Explanation verification
  assert(
    typeof q.explanation === 'string' && q.explanation.trim().length >= 40,
    `3.1 [${q.id}] Pedagogical explanation has substantive depth (${q.explanation.length} chars)`
  );

  // SkillTag non-empty
  assert(
    typeof q.skillTag === 'string' && q.skillTag.trim().length > 0,
    `3.2 [${q.id}] Has meaningful skillTag "${q.skillTag}"`
  );
});

assert(
  questionTypeCounts.grammar >= 4,
  `3.3 Grammar/word form questions well-represented (${questionTypeCounts.grammar})`
);
assert(
  questionTypeCounts.vocabulary >= 4,
  `3.4 Vocabulary/collocation questions well-represented (${questionTypeCounts.vocabulary})`
);
assert(
  questionTypeCounts.sentence_insertion === 4,
  `3.5 Exactly 4 sentence insertion questions (1 per passage group)`
);

// Verify each passage group has exactly one sentence insertion question
PART6_GROUPS.forEach(g => {
  const gQuestions = PART6_QUESTIONS.filter(q => q.groupId === g.id);
  const sentenceQuestions = gQuestions.filter(q => q.questionType === 'sentence_insertion');
  assert(
    sentenceQuestions.length === 1,
    `3.6 [${g.id}] Contains exactly 1 sentence insertion question (${sentenceQuestions[0]?.id})`
  );
});

// ----------------------------------------------------------------------------
// SUITE 4: Options, Choices & Balanced Key Distribution
// ----------------------------------------------------------------------------
console.log('\n--- Suite 4: Options, Choices & Balanced Key Distribution ---');

const keyCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };

PART6_QUESTIONS.forEach(q => {
  // 4.1 Exactly 4 options
  assert(q.options.length === 4, `4.1 [${q.id}] Has strictly 4 options`);

  // 4.2 Keys are A, B, C, D
  const keys = q.options.map(o => o.key);
  assert(
    keys[0] === 'A' && keys[1] === 'B' && keys[2] === 'C' && keys[3] === 'D',
    `4.2 [${q.id}] Options are ordered A, B, C, D`
  );

  // 4.3 Unique option texts
  const optionTexts = q.options.map(o => o.text.trim().toLowerCase());
  const uniqueOptionTexts = new Set(optionTexts);
  assert(
    uniqueOptionTexts.size === 4,
    `4.3 [${q.id}] All 4 option texts are unique`
  );

  // 4.4 correctKey is one of the options
  assert(
    ['A', 'B', 'C', 'D'].includes(q.correctKey),
    `4.4 [${q.id}] correctKey "${q.correctKey}" is valid`
  );

  keyCounts[q.correctKey]++;
});

// 4.5 Perfectly balanced answer key distribution across 16 questions: 4 A, 4 B, 4 C, 4 D
console.log(`  Key distribution: A=${keyCounts.A}, B=${keyCounts.B}, C=${keyCounts.C}, D=${keyCounts.D}`);
assert(keyCounts.A === 4, `4.5 Key A count is exactly 4 (25.0%)`);
assert(keyCounts.B === 4, `4.6 Key B count is exactly 4 (25.0%)`);
assert(keyCounts.C === 4, `4.7 Key C count is exactly 4 (25.0%)`);
assert(keyCounts.D === 4, `4.8 Key D count is exactly 4 (25.0%)`);

// 4.9 Within each group, all 4 keys A, B, C, D are present (each key appears once per group!)
PART6_GROUPS.forEach(g => {
  const gQuestions = PART6_QUESTIONS.filter(q => q.groupId === g.id);
  const groupKeys = new Set(gQuestions.map(q => q.correctKey));
  assert(
    groupKeys.size === 4,
    `4.9 [${g.id}] Group has full key diversity: contains A, B, C, and D`
  );
});

// ----------------------------------------------------------------------------
// SUITE 5: Text Reconstruction & Passage Integrity
// ----------------------------------------------------------------------------
console.log('\n--- Suite 5: Text Reconstruction & Passage Integrity ---');

PART6_GROUPS.forEach((group: Part6Group) => {
  let reconstructed = group.passageContent;
  const groupQuestions = PART6_QUESTIONS.filter(q => q.groupId === group.id);

  groupQuestions.forEach(q => {
    const correctOption = q.options.find(o => o.key === q.correctKey);
    assert(
      correctOption !== undefined,
      `5.1 [${q.id}] Correct option for key "${q.correctKey}" exists`
    );

    if (correctOption) {
      const blankToken = `[${q.blankNumber}]`;
      reconstructed = reconstructed.replace(blankToken, correctOption.text);
    }
  });

  // 5.2 Verify no leftover blank placeholders remain in reconstructed text
  const leftoverTokens = reconstructed.match(/\[\d{3}\]/g);
  assert(
    leftoverTokens === null,
    `5.2 [${group.id}] Reconstructed passage has no unreplaced [XXX] tokens`
  );

  // 5.3 Verify no double punctuation marks like '..' in the reconstructed passage
  const doublePeriods = reconstructed.match(/\.\./g);
  assert(
    doublePeriods === null,
    `5.3 [${group.id}] Reconstructed passage has no double periods ("..")`
  );

  // 5.4 Reconstructed passage is longer than raw passage
  assert(
    reconstructed.length > group.passageContent.length,
    `5.4 [${group.id}] Reconstructed passage expands text (${reconstructed.length} > ${group.passageContent.length})`
  );

  // 5.5 Sentence insertion option ends with a valid sentence terminator (. or !)
  const sentenceInsertionQ = groupQuestions.find(q => q.questionType === 'sentence_insertion');
  if (sentenceInsertionQ) {
    const correctSentence = sentenceInsertionQ.options.find(o => o.key === sentenceInsertionQ.correctKey)?.text || '';
    const endsWithPunctuation = /[.!?]$/.test(correctSentence.trim());
    assert(
      endsWithPunctuation,
      `5.5 [${sentenceInsertionQ.id}] Sentence insertion text ends with sentence terminator: "${correctSentence.slice(-1)}"`
    );
  }
});

// ----------------------------------------------------------------------------
// SUITE 6: Global Validation Engine & Schema Conformity
// ----------------------------------------------------------------------------
console.log('\n--- Suite 6: Global Validation Engine & Schema Conformity ---');

// 6.1 validateQuestionGroup on all Part 6 groups
PART6_GROUPS.forEach(group => {
  const report = validateQuestionGroup(group);
  assert(
    report.isValid,
    `6.1 [${group.id}] validateQuestionGroup passed (errors: ${report.errors.length})`
  );
  if (!report.isValid) {
    console.error('Group errors:', report.errors);
  }
});

// 6.2 validateQuestion on all Part 6 questions
PART6_QUESTIONS.forEach(question => {
  const report = validateQuestion(question);
  assert(
    report.isValid,
    `6.2 [${question.id}] validateQuestion passed (errors: ${report.errors.length})`
  );
  if (!report.isValid) {
    console.error('Question errors:', report.errors);
  }
});

// 6.3 Inclusion in ALL_READING_GROUPS and ALL_GROUPS
const readingGroupIds = new Set(ALL_READING_GROUPS.map(g => g.id));
const allGroupIds = new Set(ALL_GROUPS.map(g => g.id));
PART6_GROUPS.forEach(g => {
  assert(
    readingGroupIds.has(g.id),
    `6.3 [${g.id}] Included in ALL_READING_GROUPS`
  );
  assert(
    allGroupIds.has(g.id),
    `6.4 [${g.id}] Included in ALL_GROUPS`
  );
});

// 6.5 Inclusion in ALL_READING_QUESTIONS and ALL_QUESTIONS
const readingQuestionIds = new Set(ALL_READING_QUESTIONS.map(q => q.id));
const allQuestionIdsSet = new Set(ALL_QUESTIONS.map(q => q.id));
PART6_QUESTIONS.forEach(q => {
  assert(
    readingQuestionIds.has(q.id),
    `6.5 [${q.id}] Included in ALL_READING_QUESTIONS`
  );
  assert(
    allQuestionIdsSet.has(q.id),
    `6.6 [${q.id}] Included in ALL_QUESTIONS`
  );
});

// ----------------------------------------------------------------------------
// FINAL SUMMARY
// ----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`🏁 PART 6 TEST RESULTS: ${testsPassed}/${testsRun} passed (${testsFailed} failed)`);
console.log('================================================================');

if (testsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
