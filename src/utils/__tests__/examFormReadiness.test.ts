/**
 * TOEIC Mastery Hub — Exam Form Assembly & Media Readiness Test Suite (Phase 9)
 *
 * Exhaustive contract and validation test suite:
 * 1. ExamForm Assembly & 200-Question Cardinality (P1:6, P2:25, P3:39, P4:30, P5:30, P6:16, P7:54)
 * 2. Sequential Ordering (1..200), Canonical Part Bounds & Options Count (3 for P2, 4 for others)
 * 3. Group Boundary Integrity & Two-Way Relational Linkages (42 groups total)
 * 4. Media Assets & Visual Registry Integrity (6 Part 1 SVG photos + 2 context graphics)
 * 5. Audio Scripts, Transcripts & Turn Segments Integrity (100% scripts, speaker turns)
 * 6. Listening Section Timeline & Spoken Pacing Estimation (~40-44m vs 45m target)
 * 7. 4-Tier Readiness Classification & Strict Lock Enforcement (Simulation-ready vs Strict-ready)
 * 8. Exam Form Registry Operations, Dynamic Compilation & Revision Guards
 */

import {
  CANONICAL_ETS_EXAM_FORM_01,
  buildCanonicalExamForm01,
} from '../../data/examForms/etsMockForm01';
import {
  registerExamForm,
  getExamFormById,
  getExamFormByCode,
  getAllExamForms,
  getAvailableExamForms,
  compileStandardExamForm,
  resetExamFormRegistry,
} from '../examFormRegistry';
import {
  assessExamFormMediaReadiness,
  auditPart1Media,
  auditPart2Media,
  auditPart3Media,
  auditPart4Media,
  ETS_LISTENING_TARGET_DURATION_SECONDS,
} from '../mediaReadiness';
import {
  validateExamFormStructure,
  validateExamFormContentLinks,
  validateExamForm,
  defaultLookup,
} from '../examBlueprintValidator';
import { LISTENING_ILLUSTRATIONS } from '../../components/Diagnostic/listeningIllustrationsMap';
import { ExamForm } from '../../types/mockExam';

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
console.log('🧪 RUNNING EXAM FORM ASSEMBLY & MEDIA READINESS TESTS (PHASE 9)');
console.log('================================================================');

// ----------------------------------------------------------------------------
// SUITE 1: ExamForm Assembly & 200-Question Cardinality
// ----------------------------------------------------------------------------
console.log('\n--- Suite 1: ExamForm Assembly & 200-Question Cardinality ---');

const form = CANONICAL_ETS_EXAM_FORM_01;

// 1.1 Exactly 200 questions total
assert(
  form.questions.length === 200,
  `1.1 Form has exactly 200 questions (actual: ${form.questions.length})`
);

// 1.2 Listening section: exactly 100 questions (Q1 - Q100)
const listeningQuestions = form.questions.filter((q) => q.section === 'listening');
assert(
  listeningQuestions.length === 100,
  `1.2 Listening section has exactly 100 questions (actual: ${listeningQuestions.length})`
);

// 1.3 Reading section: exactly 100 questions (Q101 - Q200)
const readingQuestions = form.questions.filter((q) => q.section === 'reading');
assert(
  readingQuestions.length === 100,
  `1.3 Reading section has exactly 100 questions (actual: ${readingQuestions.length})`
);

// 1.4 Part breakdown: P1:6, P2:25, P3:39, P4:30, P5:30, P6:16, P7:54
const p1Count = form.questions.filter((q) => q.partNum === 1).length;
const p2Count = form.questions.filter((q) => q.partNum === 2).length;
const p3Count = form.questions.filter((q) => q.partNum === 3).length;
const p4Count = form.questions.filter((q) => q.partNum === 4).length;
const p5Count = form.questions.filter((q) => q.partNum === 5).length;
const p6Count = form.questions.filter((q) => q.partNum === 6).length;
const p7Count = form.questions.filter((q) => q.partNum === 7).length;

assert(
  p1Count === 6 &&
    p2Count === 25 &&
    p3Count === 39 &&
    p4Count === 30 &&
    p5Count === 30 &&
    p6Count === 16 &&
    p7Count === 54,
  `1.4 Canonical Part breakdown verified: P1=${p1Count}, P2=${p2Count}, P3=${p3Count}, P4=${p4Count}, P5=${p5Count}, P6=${p6Count}, P7=${p7Count}`
);

// 1.5 Part 7 sub-division: 29 Single + 25 Multiple
const p7SingleQuestions = form.questions.filter(
  (q) => q.partNum === 7 && q.globalQuestionNumber >= 147 && q.globalQuestionNumber <= 175
);
const p7MultiQuestions = form.questions.filter(
  (q) => q.partNum === 7 && q.globalQuestionNumber >= 176 && q.globalQuestionNumber <= 200
);
assert(
  p7SingleQuestions.length === 29 && p7MultiQuestions.length === 25,
  `1.5 Part 7 correctly divided into 29 Single Passages (Q147-175) and 25 Multiple Passages (Q176-200)`
);

// 1.6 Exactly 42 groups total (P3: 13, P4: 10, P6: 4, P7: 15)
assert(
  form.groups.length === 42,
  `1.6 Form contains exactly 42 question groups (actual: ${form.groups.length})`
);
const p3GroupsCount = form.groups.filter((g) => g.partNum === 3).length;
const p4GroupsCount = form.groups.filter((g) => g.partNum === 4).length;
const p6GroupsCount = form.groups.filter((g) => g.partNum === 6).length;
const p7GroupsCount = form.groups.filter((g) => g.partNum === 7).length;
assert(
  p3GroupsCount === 13 && p4GroupsCount === 10 && p6GroupsCount === 4 && p7GroupsCount === 15,
  `1.6 Group breakdown verified: P3=${p3GroupsCount}, P4=${p4GroupsCount}, P6=${p6GroupsCount}, P7=${p7GroupsCount}`
);

// 1.7 Zero duplicated Question IDs
const allQIds = form.questions.map((q) => q.questionId);
const uniqueQIds = new Set(allQIds);
assert(
  uniqueQIds.size === 200 && uniqueQIds.size === allQIds.length,
  '1.7 100% of Question IDs in ExamForm are unique (no duplicates)'
);

// 1.8 Zero duplicated Group IDs
const allGIds = form.groups.map((g) => g.groupId);
const uniqueGIds = new Set(allGIds);
assert(
  uniqueGIds.size === 42 && uniqueGIds.size === allGIds.length,
  '1.8 100% of Group IDs in ExamForm are unique (no duplicates)'
);

// ----------------------------------------------------------------------------
// SUITE 2: Sequential Ordering (1..200) & Canonical Part Bounds
// ----------------------------------------------------------------------------
console.log('\n--- Suite 2: Sequential Ordering (1..200) & Canonical Part Bounds ---');

// 2.1 globalQuestionNumber is strictly 1 to 200
const strictlySequential = form.questions.every(
  (q, idx) => q.globalQuestionNumber === idx + 1
);
assert(
  strictlySequential,
  '2.1 globalQuestionNumber is strictly sequential from 1 to 200 without gaps or jumps'
);

// 2.2 Canonical Part Bounds
const p1BoundsValid = form.questions.slice(0, 6).every((q) => q.partNum === 1);
const p2BoundsValid = form.questions.slice(6, 31).every((q) => q.partNum === 2);
const p3BoundsValid = form.questions.slice(31, 70).every((q) => q.partNum === 3);
const p4BoundsValid = form.questions.slice(70, 100).every((q) => q.partNum === 4);
const p5BoundsValid = form.questions.slice(100, 130).every((q) => q.partNum === 5);
const p6BoundsValid = form.questions.slice(130, 146).every((q) => q.partNum === 6);
const p7BoundsValid = form.questions.slice(146, 200).every((q) => q.partNum === 7);

assert(
  p1BoundsValid &&
    p2BoundsValid &&
    p3BoundsValid &&
    p4BoundsValid &&
    p5BoundsValid &&
    p6BoundsValid &&
    p7BoundsValid,
  '2.2 Canonical Part bounds verified (P1: 1-6, P2: 7-31, P3: 32-70, P4: 71-100, P5: 101-130, P6: 131-146, P7: 147-200)'
);

// 2.3 Expected choices count: exactly 3 for Part 2, exactly 4 for other parts
const p2ChoicesCountValid = form.questions
  .filter((q) => q.partNum === 2)
  .every((q) => q.expectedOptionsCount === 3);
const otherChoicesCountValid = form.questions
  .filter((q) => q.partNum !== 2)
  .every((q) => q.expectedOptionsCount === 4);
assert(
  p2ChoicesCountValid && otherChoicesCountValid,
  '2.3 expectedOptionsCount is strictly 3 for Part 2 (A-C) and 4 for all other parts (A-D)'
);

// ----------------------------------------------------------------------------
// SUITE 3: Group Boundary Integrity & Two-Way Relational Linkages
// ----------------------------------------------------------------------------
console.log('\n--- Suite 3: Group Boundary Integrity & Two-Way Relational Linkages ---');

// 3.1 Every grouped question specifies valid groupId and orderInGroup
const groupedQuestions = form.questions.filter((q) => [3, 4, 6, 7].includes(q.partNum));
const allGroupedHaveMetadata = groupedQuestions.every(
  (q) => q.groupId !== undefined && q.orderInGroup !== undefined && q.orderInGroup >= 1
);
assert(
  allGroupedHaveMetadata,
  '3.1 All grouped questions (Parts 3, 4, 6, 7) specify groupId and orderInGroup'
);

// 3.2 Standalone questions (Parts 1, 2, 5) do not have groupId
const standaloneQuestions = form.questions.filter((q) => [1, 2, 5].includes(q.partNum));
const standaloneHaveNoGroup = standaloneQuestions.every((q) => q.groupId === undefined);
assert(
  standaloneHaveNoGroup,
  '3.2 All standalone questions (Parts 1, 2, 5) have groupId === undefined'
);

// 3.3 Every group's start and end question numbers correctly match its questions
const groupBoundariesMatch = form.groups.every((g) => {
  const gQuestions = form.questions.filter((q) => q.groupId === g.groupId);
  if (gQuestions.length !== g.questionIds.length) return false;
  const firstQ = gQuestions[0].globalQuestionNumber;
  const lastQ = gQuestions[gQuestions.length - 1].globalQuestionNumber;
  return g.startQuestionNumber === firstQ && g.endQuestionNumber === lastQ;
});
assert(
  groupBoundariesMatch,
  '3.3 All 42 groups have startQuestionNumber and endQuestionNumber matching constituent questions'
);

// 3.4 Group Cardinalities: P3=3, P4=3, P6=4, P7 Single=2..4, P7 Multi=5
const groupCardinalitiesValid = form.groups.every((g) => {
  if (g.partNum === 3) return g.questionIds.length === 3;
  if (g.partNum === 4) return g.questionIds.length === 3;
  if (g.partNum === 6) return g.questionIds.length === 4;
  if (g.partNum === 7) {
    if (g.passageFormat === 'single') return g.questionIds.length >= 2 && g.questionIds.length <= 4;
    return g.questionIds.length === 5;
  }
  return false;
});
assert(
  groupCardinalitiesValid,
  '3.4 All group cardinalities conform strictly to ETS specifications (P3=3, P4=3, P6=4, P7 Single=2..4, P7 Multi=5)'
);

// 3.5 Structural Validation via validateExamFormStructure passes with 0 errors
const structReport = validateExamFormStructure(form);
assert(
  structReport.isValid && structReport.errors.length === 0,
  '3.5 validateExamFormStructure passes with 0 errors'
);

// 3.6 Content Linkage Validation via validateExamFormContentLinks passes with 0 errors
const contentReport = validateExamFormContentLinks(form, defaultLookup);
assert(
  contentReport.isValid && contentReport.errors.length === 0,
  '3.6 validateExamFormContentLinks passes with 0 errors (100% entities resolved)'
);

// 3.7 Combined validateExamForm passes with 0 errors
const combinedReport = validateExamForm(form, { lookup: defaultLookup });
assert(
  combinedReport.isValid && combinedReport.errors.length === 0,
  '3.7 Combined validateExamForm passes with 0 errors'
);

// ----------------------------------------------------------------------------
// SUITE 4: Media Assets & Visual Registry Integrity
// ----------------------------------------------------------------------------
console.log('\n--- Suite 4: Media Assets & Visual Registry Integrity ---');

// 4.1 Part 1 Photographs audit
const p1Audit = auditPart1Media(
  form.questions.filter((q) => q.partNum === 1).map((q) => q.questionId),
  defaultLookup
);
assert(
  p1Audit.visualsVerifiedCount === 6,
  `4.1 All 6 Part 1 questions reference valid SVG illustrations (actual: ${p1Audit.visualsVerifiedCount})`
);
assert(
  p1Audit.isSimulationReady === true,
  '4.1 Part 1 is simulation-ready (100% illustrations, scripts, options verified)'
);

// 4.2 Part 1 SVG Photos exist in LISTENING_ILLUSTRATIONS
const p1QIds = form.questions.filter((q) => q.partNum === 1).map((q) => q.questionId);
const p1Photos = p1QIds.map((id) => (defaultLookup.getQuestion(id) as any)?.media?.visual?.illustrationId);
const allP1PhotosExist = p1Photos.every((photoId) => photoId && LISTENING_ILLUSTRATIONS[photoId]);
assert(
  allP1PhotosExist,
  '4.2 All Part 1 photo IDs resolve to genuine React SVG components in LISTENING_ILLUSTRATIONS'
);

// 4.3 Part 3 & 4 graphic contexts exist in LISTENING_ILLUSTRATIONS
const p3Audit = auditPart3Media(
  form.groups.filter((g) => g.partNum === 3).map((g) => g.groupId),
  defaultLookup
);
const p4Audit = auditPart4Media(
  form.groups.filter((g) => g.partNum === 4).map((g) => g.groupId),
  defaultLookup
);
assert(
  p3Audit.visualsVerifiedCount === 1,
  '4.3 Part 3 Flight Schedule graphic verified in LISTENING_ILLUSTRATIONS'
);
assert(
  p4Audit.visualsVerifiedCount === 1,
  '4.3 Part 4 Store Directory graphic verified in LISTENING_ILLUSTRATIONS'
);

// ----------------------------------------------------------------------------
// SUITE 5: Audio Scripts, Transcripts & Turn Segments Integrity
// ----------------------------------------------------------------------------
console.log('\n--- Suite 5: Audio Scripts, Transcripts & Turn Segments Integrity ---');

// 5.1 Part 2 prompts & scripts audit
const p2Audit = auditPart2Media(
  form.questions.filter((q) => q.partNum === 2).map((q) => q.questionId),
  defaultLookup
);
assert(
  p2Audit.audioScriptsCount === 25,
  `5.1 Part 2 has 25 audio scripts (actual: ${p2Audit.audioScriptsCount})`
);
assert(
  p2Audit.isSimulationReady === true,
  '5.1 Part 2 is simulation-ready'
);

// 5.2 Part 3 conversations scripts & transcripts
assert(
  p3Audit.audioScriptsCount === 13 && p3Audit.transcriptsCount === 13,
  `5.2 Part 3 has 13 conversation scripts and transcripts (actual: ${p3Audit.audioScriptsCount})`
);
assert(
  p3Audit.isSimulationReady === true,
  '5.2 Part 3 is simulation-ready'
);

// 5.3 Part 4 talks scripts & transcripts
assert(
  p4Audit.audioScriptsCount === 10 && p4Audit.transcriptsCount === 10,
  `5.3 Part 4 has 10 talk scripts and transcripts (actual: ${p4Audit.audioScriptsCount})`
);
assert(
  p4Audit.isSimulationReady === true,
  '5.3 Part 4 is simulation-ready'
);

// ----------------------------------------------------------------------------
// SUITE 6: Listening Section Timeline & Spoken Pacing Estimation
// ----------------------------------------------------------------------------
console.log('\n--- Suite 6: Listening Section Timeline & Spoken Pacing Estimation ---');

const mediaReport = assessExamFormMediaReadiness(form, defaultLookup);

console.log(`    Part 1 Estimated TTS Duration: ${p1Audit.estimatedTtsDurationSeconds}s (~${Math.round(p1Audit.estimatedTtsDurationSeconds / 60)}m)`);
console.log(`    Part 2 Estimated TTS Duration: ${p2Audit.estimatedTtsDurationSeconds}s (~${Math.round(p2Audit.estimatedTtsDurationSeconds / 60)}m)`);
console.log(`    Part 3 Estimated TTS Duration: ${p3Audit.estimatedTtsDurationSeconds}s (~${Math.round(p3Audit.estimatedTtsDurationSeconds / 60)}m)`);
console.log(`    Part 4 Estimated TTS Duration: ${p4Audit.estimatedTtsDurationSeconds}s (~${Math.round(p4Audit.estimatedTtsDurationSeconds / 60)}m)`);
console.log(`    Total Estimated Listening Timeline: ${mediaReport.totalEstimatedTtsDurationSeconds}s (~${(mediaReport.totalEstimatedTtsDurationSeconds / 60).toFixed(1)}m)`);
console.log(`    Target ETS Listening Timeline: ${ETS_LISTENING_TARGET_DURATION_SECONDS}s (45.0m)`);

// 6.1 Estimated spoken duration falls within reasonable bounds (38 to 48 minutes)
assert(
  mediaReport.totalEstimatedTtsDurationSeconds >= 2200 &&
    mediaReport.totalEstimatedTtsDurationSeconds <= 2900,
  `6.1 Total estimated listening timeline (${mediaReport.totalEstimatedTtsDurationSeconds}s = ${(mediaReport.totalEstimatedTtsDurationSeconds / 60).toFixed(1)}m) is closely aligned with 45m ETS target (deviation: ${mediaReport.timelineDeviationSeconds}s)`
);

// ----------------------------------------------------------------------------
// SUITE 7: 4-Tier Readiness Classification & Strict Lock Enforcement
// ----------------------------------------------------------------------------
console.log('\n--- Suite 7: 4-Tier Readiness Classification & Strict Lock Enforcement ---');

// 7.1 Canonical ExamForm is classified as 'simulation-ready'
assert(
  mediaReport.readinessStatus === 'simulation-ready',
  `7.1 ExamForm readinessStatus is "simulation-ready" (actual: ${mediaReport.readinessStatus})`
);

// 7.2 Simulation is allowed
assert(
  mediaReport.isSimulationAllowed === true,
  '7.2 isSimulationAllowed === true for simulation-ready form'
);

// 7.3 Strict Mode is strictly locked (no fake completion claim)
assert(
  mediaReport.strictLocked === true,
  '7.3 strictLocked === true (Strict Mock is locked because physical prerecorded studio audio tracks are not on disk)'
);

// 7.4 Lock reason explains missing prerecorded audio
assert(
  mediaReport.lockReason !== undefined && mediaReport.lockReason.includes('Chế độ Strict Mock 45 phút bị khóa'),
  '7.4 lockReason contains transparent explanation of missing studio recordings'
);

// 7.5 Synthetic invalid form is correctly classified as 'invalid'
const invalidForm: ExamForm = {
  ...form,
  questions: form.questions.slice(0, 199), // Only 199 questions
};
const invalidReport = assessExamFormMediaReadiness(invalidForm, defaultLookup);
assert(
  invalidReport.readinessStatus === 'invalid' && invalidReport.strictLocked === true,
  '7.5 Form with structural defect is classified as "invalid"'
);

// ----------------------------------------------------------------------------
// SUITE 8: Exam Form Registry Operations & Revision Guards
// ----------------------------------------------------------------------------
console.log('\n--- Suite 8: Exam Form Registry Operations & Revision Guards ---');

// 8.1 Default registry contains canonical form
assert(
  getExamFormById('ets-mock-form-01') !== undefined,
  '8.1 Registry contains "ets-mock-form-01"'
);
assert(
  getExamFormByCode('ETS-2026-SIM-01') !== undefined,
  '8.1 Registry contains form by code "ETS-2026-SIM-01"'
);

// 8.2 getAllExamForms returns at least 1 form
const allForms = getAllExamForms();
assert(
  allForms.length >= 1,
  `8.2 getAllExamForms returns ${allForms.length} registered form(s)`
);

// 8.3 getAvailableExamForms with simulation-ready includes canonical form
const simForms = getAvailableExamForms({ minStatus: 'simulation-ready' });
assert(
  simForms.some((f) => f.id === 'ets-mock-form-01'),
  '8.3 getAvailableExamForms(simulation-ready) includes canonical form'
);

// 8.4 getAvailableExamForms with strictOnly returns empty (because strict mode is locked)
const strictForms = getAvailableExamForms({ strictOnly: true });
assert(
  strictForms.length === 0,
  '8.4 getAvailableExamForms(strictOnly: true) returns 0 forms because Strict Mode is locked'
);

// 8.5 Revision protection: cannot overwrite with older revision without allowOverwrite
const duplicateOldRevision: ExamForm = {
  ...form,
  contentRevision: 0,
};
const regResFail = registerExamForm(duplicateOldRevision);
assert(
  regResFail.success === false,
  '8.5 Registry rejects duplicate/older content revision without allowOverwrite'
);

// 8.6 Dynamic compilation of alternative ExamForm (e.g. part1StartIndex: 4)
const altForm = compileStandardExamForm({
  id: 'ets-mock-form-02-alt',
  title: 'ETS TOEIC Practice Test 2026 — Alternative Form 02',
  code: 'ETS-2026-SIM-02',
  part1StartIndex: 4,
});
const altValidation = validateExamForm(altForm, { lookup: defaultLookup });
assert(
  altValidation.isValid && altValidation.errors.length === 0,
  '8.6 compileStandardExamForm produces 100% compliant alternative 200-question form'
);

// 8.7 Register alternative form successfully
const regAltRes = registerExamForm(altForm);
assert(
  regAltRes.success === true,
  '8.7 Successfully registered alternative form in registry'
);
assert(
  getAllExamForms().length === 2,
  '8.7 Registry now manages 2 valid ExamForms'
);

// Reset registry to clean canonical state
resetExamFormRegistry();
assert(
  getAllExamForms().length === 1,
  '8.8 resetExamFormRegistry restores clean canonical state'
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
