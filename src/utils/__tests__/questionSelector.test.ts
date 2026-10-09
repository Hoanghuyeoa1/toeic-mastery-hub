/**
 * Targeted Unit Tests for Question Selection Engine (Phase 4)
 * Validates:
 * - Standalone Part Selection (Part 1, 2, 5) & Difficulty Filters
 * - Fixed Group Integrity (Part 3/4 = 3 Qs, Part 6 = 4 Qs)
 * - Variable Group Integrity (Part 7 Subset Sum & Passage Integrity)
 * - Anti-Repeat Priority, Recency Ordering & Bank Exhaustion Recycling
 * - Zero Duplicates within Same Session
 * - Feasibility Reporting & Informative Reasons for Impossible Counts
 * - Insufficient Data Handling without Exceptions
 * - Deterministic RNG and Custom Mini-Banks
 */

import {
  selectQuestions,
  getFeasibleCountsForPart,
  getFeasibleCountsDetail,
  calculateRecommendedTime,
  getBankAvailability,
  formatDurationPace,
} from '../questionSelector';
import { ALL_QUESTIONS } from '../../data/questionBank';
import { Part1Question } from '../../types/questionBank';

// Test assertion helpers
let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, message: string) {
  testsRun++;
  if (condition) {
    testsPassed++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    testsFailed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('\n======================================================');
console.log('🧪 RUNNING QUESTION SELECTION ENGINE TARGETED TESTS');
console.log('======================================================\n');

// ----------------------------------------------------------------------------
// SUITE 1: Standalone Parts (Part 1, 2, 5) & Filters
// ----------------------------------------------------------------------------
console.log('--- Suite 1: Standalone Question Selection & Filters ---');

// 1.1 Exact count for Part 1
const res1_1 = selectQuestions({
  partNum: 1,
  questionCount: 5,
});
assert(res1_1.status === 'success', '1.1 Part 1 selection returns success');
if (res1_1.status === 'success') {
  assert(res1_1.actualCount === 5, '1.1 Exactly 5 questions returned');
  assert(res1_1.questions.every(q => q.partNum === 1), '1.1 All questions belong to Part 1');
  const uniqueIds = new Set(res1_1.questionIds);
  assert(uniqueIds.size === 5, '1.1 All 5 question IDs are distinct');
}

// 1.2 Difficulty filter: Part 2 with 'easy'
const res1_2 = selectQuestions({
  partNum: 2,
  difficulty: 'easy',
  questionCount: 4,
});
assert(res1_2.status === 'success', '1.2 Part 2 with difficulty easy returns success');
if (res1_2.status === 'success') {
  assert(res1_2.actualCount === 4, '1.2 Exactly 4 questions returned');
  assert(res1_2.questions.every(q => q.difficulty === 'easy'), '1.2 All questions have difficulty easy');
  assert(res1_2.questions.every(q => q.partNum === 2), '1.2 All questions belong to Part 2');
}

// 1.3 Mixed difficulty distribution: Part 5
const res1_3 = selectQuestions({
  partNum: 5,
  difficulty: 'mixed',
  questionCount: 10,
});
assert(res1_3.status === 'success', '1.3 Part 5 with mixed difficulty returns success');
if (res1_3.status === 'success') {
  assert(res1_3.actualCount === 10, '1.3 Exactly 10 questions returned for Part 5');
  const diffDist = res1_3.difficultyDistribution;
  assert(diffDist.easy + diffDist.medium + diffDist.hard === 10, '1.3 Difficulty distribution sums to 10');
}

// 1.4 Invalid part number
const res1_4 = selectQuestions({
  partNum: 8 as any,
  questionCount: 5,
});
assert(res1_4.status === 'invalid_part', '1.4 Rejects invalid part number 8');

// 1.5 Non-positive question count
const res1_5 = selectQuestions({
  partNum: 1,
  questionCount: 0,
});
assert(res1_5.status === 'impossible_count', '1.5 Rejects count <= 0 as impossible_count');

// ----------------------------------------------------------------------------
// SUITE 2: Fixed Group Integrity (Part 3, 4, 6)
// ----------------------------------------------------------------------------
console.log('\n--- Suite 2: Fixed Group Integrity (Part 3, 4, 6) ---');

// 2.1 Part 3 exact multiple of 3 (6 questions = 2 groups)
const res2_1 = selectQuestions({
  partNum: 3,
  questionCount: 6,
});
assert(res2_1.status === 'success', '2.1 Part 3 selection of 6 questions succeeds');
if (res2_1.status === 'success') {
  assert(res2_1.groups.length === 2, '2.1 Exactly 2 groups returned');
  assert(res2_1.questions.length === 6, '2.1 Exactly 6 questions returned');
  // Check that all questions in groups are present and in order 1, 2, 3
  const group1Qs = res2_1.questions.slice(0, 3);
  const group2Qs = res2_1.questions.slice(3, 6);
  assert(group1Qs.every(q => q.groupId === res2_1.groups[0].id), '2.1 First 3 questions match group 1 ID');
  assert(group2Qs.every(q => q.groupId === res2_1.groups[1].id), '2.1 Next 3 questions match group 2 ID');
}

// 2.2 Part 3 strictly rejects non-multiple count (e.g. 5 questions)
const res2_2 = selectQuestions({
  partNum: 3,
  questionCount: 5,
});
assert(res2_2.status === 'impossible_count', '2.2 Part 3 strictly rejects non-multiple count 5');
if (res2_2.status === 'impossible_count') {
  assert(res2_2.feasibleCounts.includes(3) && res2_2.feasibleCounts.includes(6), '2.2 Feasible counts include 3 and 6');
  assert(res2_2.reason.includes('3 câu hỏi'), '2.2 Reason explains fixed 3-question constraint');
}

// 2.3 Part 4 exact 9 questions (3 groups)
const res2_3 = selectQuestions({
  partNum: 4,
  questionCount: 9,
});
assert(res2_3.status === 'success', '2.3 Part 4 selection of 9 questions succeeds');
if (res2_3.status === 'success') {
  assert(res2_3.groups.length === 3, '2.3 Exactly 3 groups returned');
  assert(res2_3.questions.length === 9, '2.3 Exactly 9 questions returned');
}

// 2.4 Part 4 strictly rejects count 4
const res2_4 = selectQuestions({
  partNum: 4,
  questionCount: 4,
});
assert(res2_4.status === 'impossible_count', '2.4 Part 4 rejects count 4');

// 2.5 Part 6 exact 8 questions (2 groups of 4)
const res2_5 = selectQuestions({
  partNum: 6,
  questionCount: 8,
});
assert(res2_5.status === 'success', '2.5 Part 6 selection of 8 questions succeeds');
if (res2_5.status === 'success') {
  assert(res2_5.groups.length === 2, '2.5 Exactly 2 groups returned for Part 6');
  assert(res2_5.questions.length === 8, '2.5 Exactly 8 questions returned for Part 6');
  // Check orderInGroup 1, 2, 3, 4
  const g1Qs = res2_5.questions.slice(0, 4);
  assert(
    g1Qs[0].orderInGroup === 1 && g1Qs[1].orderInGroup === 2 && g1Qs[2].orderInGroup === 3 && g1Qs[3].orderInGroup === 4,
    '2.5 Question order in group 1 is strictly preserved (1, 2, 3, 4)'
  );
}

// 2.6 Part 6 strictly rejects non-multiple of 4 (e.g. 6 questions)
const res2_6 = selectQuestions({
  partNum: 6,
  questionCount: 6,
});
assert(res2_6.status === 'impossible_count', '2.6 Part 6 strictly rejects count 6');
if (res2_6.status === 'impossible_count') {
  assert(res2_6.feasibleCounts.includes(4) && res2_6.feasibleCounts.includes(8), '2.6 Feasible counts are multiples of 4');
}

// ----------------------------------------------------------------------------
// SUITE 3: Variable Group Integrity (Part 7 Reading Comprehension)
// ----------------------------------------------------------------------------
console.log('\n--- Suite 3: Variable Group Integrity (Part 7) ---');

// 3.1 Feasible counts calculation for Part 7
const p7Feasible = getFeasibleCountsForPart(7);
assert(p7Feasible.length > 0, '3.1 Part 7 has valid feasible counts');
assert(p7Feasible.includes(3), '3.1 Feasible counts include 3 (single passage group)');
assert(p7Feasible.includes(5), '3.1 Feasible counts include 5 (double or triple passage group)');
assert(p7Feasible.includes(10), '3.1 Feasible counts include 10');
assert(p7Feasible.includes(20), '3.1 Feasible counts include 20 (all groups)');

// 3.2 Part 7 exact combination of 10 questions
const res3_2 = selectQuestions({
  partNum: 7,
  questionCount: 10,
});
assert(res3_2.status === 'success', '3.2 Part 7 selection of 10 questions succeeds');
if (res3_2.status === 'success') {
  assert(res3_2.actualCount === 10, '3.2 Exactly 10 questions returned');
  const totalInGroups = res3_2.groups.reduce((sum, g) => sum + g.questionIds.length, 0);
  assert(totalInGroups === 10, '3.2 Groups preserve complete passage integrity');
}

// 3.3 Part 7 impossible count (e.g. 1 question, since minimum group size is 2)
const res3_3 = selectQuestions({
  partNum: 7,
  questionCount: 1,
});
assert(res3_3.status === 'impossible_count', '3.3 Part 7 rejects 1 question as impossible_count');
if (res3_3.status === 'impossible_count') {
  assert(res3_3.reason.includes('số câu biến thiên'), '3.3 Reason explains variable passage size constraint');
  assert(!res3_3.feasibleCounts.includes(1), '3.3 Feasible counts list does not include 1');
}

// 3.4 Part 7 selection of 5 questions
const res3_4 = selectQuestions({
  partNum: 7,
  questionCount: 5,
});
assert(res3_4.status === 'success', '3.4 Part 7 selection of 5 questions succeeds');
if (res3_4.status === 'success') {
  assert(res3_4.actualCount === 5, '3.4 Exactly 5 questions returned');
  const totalInGroups = res3_4.groups.reduce((sum, g) => sum + g.questionIds.length, 0);
  assert(totalInGroups === 5, '3.4 Groups preserve complete passage integrity');
}

// ----------------------------------------------------------------------------
// SUITE 4: Anti-Repeat Priority, Recency & Bank Exhaustion
// ----------------------------------------------------------------------------
console.log('\n--- Suite 4: Anti-Repeat Priority & Bank Exhaustion ---');

// 4.1 Prioritize unpracticed questions
// Suppose user practiced q-p1-001 through q-p1-006 (6 questions)
const practiced6Ids = ['q-p1-001', 'q-p1-002', 'q-p1-003', 'q-p1-004', 'q-p1-005', 'q-p1-006'];
const res4_1 = selectQuestions({
  partNum: 1,
  questionCount: 4,
  history: {
    practicedQuestionIds: practiced6Ids,
  },
});
assert(res4_1.status === 'success', '4.1 Anti-repeat selection succeeds');
if (res4_1.status === 'success') {
  assert(res4_1.reusedCount === 0, '4.1 Reused count is 0 because 4 fresh questions remain');
  assert(res4_1.isBankExhausted === false, '4.1 Bank not exhausted');
  // All 4 questions must be among the unpracticed ones (q-p1-007 to q-p1-010)
  const allUnpracticed = res4_1.questions.every(q => !practiced6Ids.includes(q.id));
  assert(allUnpracticed, '4.1 100% of selected questions are previously unpracticed');
}

// 4.2 Bank Exhaustion: when fresh items are fewer than requested
// Request 5 questions when only 4 fresh exist
const res4_2 = selectQuestions({
  partNum: 1,
  questionCount: 5,
  history: {
    practicedQuestionIds: practiced6Ids,
  },
});
assert(res4_2.status === 'success', '4.2 Bank exhaustion handles gracefully');
if (res4_2.status === 'success') {
  assert(res4_2.reusedCount === 1, '4.2 Reused count is exactly 1 (4 fresh + 1 recycled)');
  assert(res4_2.isBankExhausted === true, '4.2 Bank is marked as exhausted');
  // Must still have 5 unique questions in current session!
  const uniqueSet = new Set(res4_2.questionIds);
  assert(uniqueSet.size === 5, '4.2 Zero duplicate questions within the same session');
}

// 4.3 Recency Ordering: Least recently practiced is recycled first
const detailedHistory = {
  'q-p1-001': { lastPracticedAt: '2026-09-01T10:00:00Z', practiceCount: 1 }, // Older
  'q-p1-002': { lastPracticedAt: '2026-10-08T10:00:00Z', practiceCount: 1 }, // Newer
  'q-p1-003': { lastPracticedAt: '2026-10-09T08:00:00Z', practiceCount: 1 }, // Very new
};
const res4_3 = selectQuestions({
  partNum: 1,
  questionCount: 1,
  customQuestions: [
    ALL_QUESTIONS.find(q => q.id === 'q-p1-001')!,
    ALL_QUESTIONS.find(q => q.id === 'q-p1-002')!,
    ALL_QUESTIONS.find(q => q.id === 'q-p1-003')!,
  ] as Part1Question[],
  history: {
    questionHistory: detailedHistory,
  },
  rng: () => 0.5,
});
assert(res4_3.status === 'success', '4.3 Recency selection succeeds');
if (res4_3.status === 'success') {
  assert(res4_3.questions[0].id === 'q-p1-001', '4.3 Oldest practiced item q-p1-001 is recycled first');
}

// 4.4 Group Anti-Repeat in Part 3
const practicedGrp3Ids = [
  'grp-p3-001', 'grp-p3-002', 'grp-p3-003',
  'grp-p3-006', 'grp-p3-007', 'grp-p3-008', 'grp-p3-009', 'grp-p3-010', 'grp-p3-011', 'grp-p3-012', 'grp-p3-013'
];
const res4_4 = selectQuestions({
  partNum: 3,
  questionCount: 6, // 2 groups
  history: {
    practicedGroupIds: practicedGrp3Ids,
  },
});
assert(res4_4.status === 'success', '4.4 Group anti-repeat succeeds');
if (res4_4.status === 'success') {
  // Groups grp-p3-004 and grp-p3-005 are unpracticed and must be selected!
  const selectedGrpIds = res4_4.groupIds;
  assert(selectedGrpIds.includes('grp-p3-004') && selectedGrpIds.includes('grp-p3-005'), '4.4 Fresh groups grp-p3-004 and grp-p3-005 prioritized');
  assert(res4_4.reusedCount === 0, '4.4 Reused count is 0');
}

// 4.5 Zero Duplicates within the same session
const res4_5 = selectQuestions({
  partNum: 2,
  questionCount: 15, // all available questions in Part 2
});
if (res4_5.status === 'success') {
  const uniqueSet = new Set(res4_5.questionIds);
  assert(uniqueSet.size === 15, '4.5 All 15 questions in session are unique (no internal repeats)');
}

// ----------------------------------------------------------------------------
// SUITE 5: Insufficient Questions & Bounds
// ----------------------------------------------------------------------------
console.log('\n--- Suite 5: Insufficient Data & Bounds ---');

// 5.1 Requesting more questions than total available in bank (e.g. 25 Part 1 questions)
const res5_1 = selectQuestions({
  partNum: 1,
  questionCount: 25,
});
assert(res5_1.status === 'insufficient_questions', '5.1 Reports insufficient_questions when count exceeds bank');
if (res5_1.status === 'insufficient_questions') {
  assert(res5_1.availableCount === 10, '5.1 Available count is 10');
  assert(res5_1.feasibleCounts.length === 10, '5.1 Feasible counts span 1..10');
}

// 5.2 Requesting difficulty 'easy' when only 1 group exists in Part 3 and asking for 6 questions
const res5_2 = selectQuestions({
  partNum: 3,
  difficulty: 'easy',
  questionCount: 6,
});
assert(res5_2.status === 'insufficient_questions', '5.2 Reports insufficient_questions for specific difficulty shortage');
if (res5_2.status === 'insufficient_questions') {
  assert(res5_2.availableCount === 3, '5.2 Available count for Part 3 Easy is 3 questions (1 group)');
}

// ----------------------------------------------------------------------------
// SUITE 6: Deterministic Randomness & Reproducibility
// ----------------------------------------------------------------------------
console.log('\n--- Suite 6: Deterministic RNG & Seed Reproducibility ---');

// Pseudo-random generator (linear congruential generator)
function createSeededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const rng1 = createSeededRng(42);
const res6_1 = selectQuestions({
  partNum: 5,
  questionCount: 6,
  rng: rng1,
});

const rng2 = createSeededRng(42);
const res6_2 = selectQuestions({
  partNum: 5,
  questionCount: 6,
  rng: rng2,
});

assert(res6_1.status === 'success' && res6_2.status === 'success', '6.1 Seeded executions succeed');
if (res6_1.status === 'success' && res6_2.status === 'success') {
  const ids1 = res6_1.questionIds.join(',');
  const ids2 = res6_2.questionIds.join(',');
  assert(ids1 === ids2, '6.1 Identical seeds produce 100% identical question selection order');
}

// ----------------------------------------------------------------------------
// SUITE 7: Utilities, Time Pace & Bank Availability
// ----------------------------------------------------------------------------
console.log('\n--- Suite 7: Time Calculation & Availability Stats ---');

// 7.1 calculateRecommendedTime
assert(calculateRecommendedTime(1, 10) === 300, '7.1 Part 1 10 questions = 300s (5m)');
assert(calculateRecommendedTime(2, 15) === 375, '7.1 Part 2 15 questions = 375s');
assert(calculateRecommendedTime(5, 20) === 600, '7.1 Part 5 20 questions = 600s (10m)');
assert(calculateRecommendedTime(7, 20) === 1200, '7.1 Part 7 20 questions = 1200s (20m)');

// 7.2 formatDurationPace
assert(formatDurationPace(600) === '10 phút', '7.2 Formats 600s as "10 phút"');
assert(formatDurationPace(45) === '45 giây', '7.2 Formats 45s as "45 giây"');
assert(formatDurationPace(135) === '2 phút 15 giây', '7.2 Formats 135s as "2 phút 15 giây"');

// 7.3 Bank Availability
const avail = getBankAvailability();
assert(avail.totalQuestions === 204, '7.3 Total questions reported is 204');
assert(avail.totalGroups === 42, '7.3 Total groups reported is 42');
assert(avail.byPart[1].total === 10, '7.3 Part 1 total is 10');
assert(avail.byPart[2].total === 25, '7.3 Part 2 total is 25');
assert(avail.byPart[3].groupsCount === 13, '7.3 Part 3 groups count is 13');
assert(avail.byPart[4].groupsCount === 10, '7.3 Part 4 groups count is 10');
assert(avail.byPart[7].total === 54, '7.3 Part 7 total is 54');

// 7.4 Feasibility detail
const p3Detail = getFeasibleCountsDetail(3);
assert(p3Detail.maxAvailable === 39, '7.4 Part 3 max available is 39');
assert(p3Detail.feasibleCounts.length === 13, '7.4 Part 3 has 13 feasible counts (3, 6, 9, ... 39)');
assert(p3Detail.stepDescription.includes('bội số của 3'), '7.4 Step description mentions multiple of 3');

const p4Detail = getFeasibleCountsDetail(4);
assert(p4Detail.maxAvailable === 30, '7.4 Part 4 max available is 30');
assert(p4Detail.feasibleCounts.length === 10, '7.4 Part 4 has 10 feasible counts (3, 6, 9, ... 30)');

console.log('\n======================================================');
console.log(`TOTAL TESTS RUN: ${testsRun}`);
console.log(`PASSED: ${testsPassed}`);
console.log(`FAILED: ${testsFailed}`);
console.log('======================================================\n');

if (testsFailed > 0) {
  process.exit(1);
}
