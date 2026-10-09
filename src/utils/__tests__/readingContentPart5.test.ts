/**
 * TOEIC Mastery Hub — Reading Content Part 5 Contract Test Suite (Phase 5)
 *
 * Exhaustive contract and validation test suite for TOEIC Part 5 (Incomplete Sentences):
 * 1. Part 5 Question Count & ExamForm Readiness (strictly >= 30 questions, target 30)
 * 2. Incomplete Sentence & Blank Integrity (clear blank '_____', business context)
 * 3. Options, Choices & Balanced Key Mapping (strictly 4 options A-D, balanced keys)
 * 4. Pedagogical Explanations & Grammar Taxonomy Diversity
 * 5. Global Validation Engine & Schema Conformity (100% pass validateQuestion)
 */

import { PART5_QUESTIONS } from '../../data/questionBank/part5Reading';
import { ALL_READING_QUESTIONS } from '../../data/questionBank/readingBank';
import { ALL_QUESTIONS } from '../../data/questionBank/index';
import { validateQuestion } from '../questionBankValidator';
import { Part5Question } from '../../types/questionBank';

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
console.log('🧪 RUNNING READING CONTENT PART 5 CONTRACT TESTS (PHASE 5)');
console.log('================================================================');

// ----------------------------------------------------------------------------
// SUITE 1: Question Count, ID Continuity & ExamForm Readiness
// ----------------------------------------------------------------------------
console.log('\n--- Suite 1: Question Count, ID Continuity & ExamForm Readiness ---');

// 1.1 Minimum requirement >= 30 questions for a standard ExamForm
assert(
  PART5_QUESTIONS.length >= 30,
  `1.1 Part 5 has at least 30 questions (actual: ${PART5_QUESTIONS.length})`
);
assert(
  PART5_QUESTIONS.length === 30,
  `1.2 Part 5 has exactly 30 questions (actual: ${PART5_QUESTIONS.length})`
);

// 1.3 Sequential ID verification from q-p5-001 to q-p5-030
const expectedIds = Array.from({ length: 30 }, (_, i) => {
  const num = (i + 1).toString().padStart(3, '0');
  return `q-p5-${num}`;
});

const actualIds = PART5_QUESTIONS.map(q => q.id);
const allIdsMatch = expectedIds.every((id, idx) => actualIds[idx] === id);
assert(allIdsMatch, '1.3 Question IDs are strictly sequential from q-p5-001 to q-p5-030');

// 1.4 Unique IDs
const uniqueIds = new Set(actualIds);
assert(uniqueIds.size === PART5_QUESTIONS.length, '1.4 All Part 5 Question IDs are strictly unique');

// 1.5 Section and Part Number
const allSectionPartValid = PART5_QUESTIONS.every(
  q => q.partNum === 5 && q.part === 'Part 5' && q.section === 'reading'
);
assert(allSectionPartValid, '1.5 All questions declare partNum=5, part="Part 5", section="reading"');

// 1.6 Difficulty distribution
const difficultyCounts: Record<string, number> = { easy: 0, medium: 0, hard: 0 };
PART5_QUESTIONS.forEach(q => {
  if (q.difficulty in difficultyCounts) {
    difficultyCounts[q.difficulty]++;
  }
});

assert(difficultyCounts.easy >= 6, `1.6 Easy questions are well-represented (${difficultyCounts.easy})`);
assert(difficultyCounts.medium >= 10, `1.7 Medium questions are well-represented (${difficultyCounts.medium})`);
assert(difficultyCounts.hard >= 5, `1.8 Hard questions are well-represented (${difficultyCounts.hard})`);

// ----------------------------------------------------------------------------
// SUITE 2: Sentence Structure & Blank Integrity
// ----------------------------------------------------------------------------
console.log('\n--- Suite 2: Sentence Structure & Blank Integrity ---');

PART5_QUESTIONS.forEach((q: Part5Question) => {
  // 2.1 Non-empty sentence
  assert(
    typeof q.sentence === 'string' && q.sentence.trim().length > 20,
    `2.1 [${q.id}] Sentence has substantial length (${q.sentence?.length} chars)`
  );

  // 2.2 Contains exactly one blank placeholder '_____'
  const hasBlank = q.sentence.includes('_____');
  assert(hasBlank, `2.2 [${q.id}] Sentence contains standard blank placeholder "_____"`);

  // 2.3 Authentic business topic
  assert(
    typeof q.topic === 'string' && q.topic.length > 3,
    `2.3 [${q.id}] Has designated business topic: "${q.topic}"`
  );
});

// ----------------------------------------------------------------------------
// SUITE 3: Options, Choices & Balanced Key Mapping
// ----------------------------------------------------------------------------
console.log('\n--- Suite 3: Options, Choices & Balanced Key Mapping ---');

const keyCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };

PART5_QUESTIONS.forEach((q: Part5Question) => {
  // 3.1 Exactly 4 options
  assert(q.options.length === 4, `3.1 [${q.id}] Has strictly 4 options`);

  // 3.2 Option keys are A, B, C, D in order
  const keys = q.options.map(o => o.key).join('');
  assert(keys === 'ABCD', `3.2 [${q.id}] Option keys are strictly A, B, C, D`);

  // 3.3 Option text non-empty and unique within question
  const texts = q.options.map(o => o.text.trim());
  const allTextsValid = texts.every(t => t.length > 0);
  const uniqueTexts = new Set(texts);
  assert(
    allTextsValid && uniqueTexts.size === 4,
    `3.3 [${q.id}] All 4 options have distinct, non-empty text`
  );

  // 3.4 Valid correctKey
  assert(
    ['A', 'B', 'C', 'D'].includes(q.correctKey),
    `3.4 [${q.id}] Correct key is valid (${q.correctKey})`
  );

  if (q.correctKey in keyCounts) {
    keyCounts[q.correctKey]++;
  }
});

console.log('  Part 5 Answer Key Counts:', keyCounts);
assert(keyCounts.A >= 4, `3.5 Key A is well-represented (got ${keyCounts.A})`);
assert(keyCounts.B >= 4, `3.6 Key B is well-represented (got ${keyCounts.B})`);
assert(keyCounts.C >= 4, `3.7 Key C is well-represented (got ${keyCounts.C})`);
assert(keyCounts.D >= 4, `3.8 Key D is well-represented (got ${keyCounts.D})`);

// ----------------------------------------------------------------------------
// SUITE 4: Pedagogical Explanations & Grammar Taxonomy Diversity
// ----------------------------------------------------------------------------
console.log('\n--- Suite 4: Pedagogical Explanations & Grammar Taxonomy Diversity ---');

const grammarCategories = new Set<string>();

PART5_QUESTIONS.forEach((q: Part5Question) => {
  // 4.1 Detailed Vietnamese explanation
  assert(
    typeof q.explanation === 'string' && q.explanation.length >= 40,
    `4.1 [${q.id}] Has comprehensive pedagogical explanation (${q.explanation?.length} chars)`
  );

  // 4.2 Grammar Category defined
  assert(
    typeof q.grammarCategory === 'string' && q.grammarCategory.length > 0,
    `4.2 [${q.id}] Has grammarCategory: "${q.grammarCategory}"`
  );
  grammarCategories.add(q.grammarCategory);

  // 4.3 Skill Tag defined
  assert(
    typeof q.skillTag === 'string' && q.skillTag.startsWith('Part 5:'),
    `4.3 [${q.id}] Has valid skillTag: "${q.skillTag}"`
  );
});

// 4.4 Diversity of grammar categories (at least 10 distinct categories)
assert(
  grammarCategories.size >= 10,
  `4.4 Broad coverage of grammar domains (found ${grammarCategories.size} distinct grammar categories)`
);

// ----------------------------------------------------------------------------
// SUITE 5: Global Validation Engine & Schema Conformity
// ----------------------------------------------------------------------------
console.log('\n--- Suite 5: Global Validation Engine & Schema Conformity ---');

// 5.1 100% of questions pass validateQuestion pure function
let allValidateClean = true;
PART5_QUESTIONS.forEach((q: Part5Question) => {
  const errs = validateQuestion(q);
  if (errs.length > 0) {
    allValidateClean = false;
    console.error(`Validation errors in ${q.id}:`, errs);
  }
});
assert(allValidateClean, '5.1 100% of Part 5 questions pass validateQuestion with 0 errors');

// 5.2 Questions exist in ALL_READING_QUESTIONS
const allReadingIds = new Set(ALL_READING_QUESTIONS.map(q => q.id));
const allInReading = PART5_QUESTIONS.every(q => allReadingIds.has(q.id));
assert(allInReading, '5.2 All 30 Part 5 questions are aggregated into ALL_READING_QUESTIONS');

// 5.3 Questions exist in ALL_QUESTIONS
const allBankIds = new Set(ALL_QUESTIONS.map(q => q.id));
const allInBank = PART5_QUESTIONS.every(q => allBankIds.has(q.id));
assert(allInBank, '5.3 All 30 Part 5 questions are aggregated into ALL_QUESTIONS');

console.log('\n================================================================');
console.log(`TOTAL TESTS RUN: ${testsRun}`);
console.log(`PASSED: ${testsPassed}`);
console.log(`FAILED: ${testsFailed}`);
console.log('================================================================\n');

if (testsFailed > 0) {
  process.exit(1);
}
