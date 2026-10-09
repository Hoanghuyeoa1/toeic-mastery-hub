/**
 * TOEIC Mastery Hub — Exam Preflight & Library Test Suite (Phase 13)
 *
 * Targeted contract and invariant tests:
 * - Suite 1: Exam Form Registry & Library Status Filtering
 * - Suite 2: Preflight Form Integrity & 200-Question Cardinality Check
 * - Suite 3: Strict Mode Lock Gating & Transparent Rejection Reasons
 * - Suite 4: Simulation Fallback Acceptance & Warning Labeling
 * - Suite 5: Browser Capabilities & Unsupported Platform Handling
 * - Suite 6: Storage Read/Write Access & Quota Failure Gating
 * - Suite 7: Existing Unfinished Session Conflict Assessment
 * - Suite 8: Multi-Tab Conflict Detection in Preflight
 * - Suite 9: Sound Check Utility & Autoplay Unlock Gate
 * - Suite 10: Comprehensive Start Readiness & Double-Start Prevention
 */

import {
  CANONICAL_ETS_EXAM_FORM_01,
} from '../../data/examForms/etsMockForm01';
import {
  getAllExamForms,
  getAvailableExamForms,
  getExamFormById,
  getExamFormByCode,
} from '../examFormRegistry';
import {
  runComprehensivePreflight,
  testAudioPlayback,
} from '../examPreflightChecker';
import { ExamForm } from '../../types/mockExam';

let testsRun = 0;
let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string, detail?: string): void {
  testsRun++;
  if (condition) {
    testsPassed++;
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    testsFailed++;
    console.error(`  ✗ [FAIL] ${testName}${detail ? `: ${detail}` : ''}`);
  }
}

console.log('================================================================');
console.log('PHASE 13: EXAM LIBRARY & PREFLIGHT VERIFICATION TEST SUITE');
console.log('================================================================\n');

// ----------------------------------------------------------------------------
// SUITE 1: Exam Form Registry & Library Status Filtering
// ----------------------------------------------------------------------------
console.log('--- SUITE 1: Exam Form Registry & Library Status Filtering ---');

const allForms = getAllExamForms();
assert(allForms.length >= 1, 'Registry contains registered ExamForms (at least 1)');
assert(allForms[0].id === 'ets-mock-form-01', 'Primary registered form is ets-mock-form-01');

const canonicalLookup = getExamFormById('ets-mock-form-01');
assert(canonicalLookup !== undefined, 'Lookup by ID returns canonical exam form');

const codeLookup = getExamFormByCode('ETS-2026-SIM-01');
assert(codeLookup !== undefined, 'Lookup by code returns canonical exam form');

// Filtering tests
const simulationAvailable = getAvailableExamForms({ minStatus: 'simulation-ready' });
assert(
  simulationAvailable.some((f) => f.id === 'ets-mock-form-01'),
  'Canonical form is included in simulation-ready filter'
);

const strictAvailable = getAvailableExamForms({ strictOnly: true });
assert(
  strictAvailable.length === 0,
  'Strict-only filter returns 0 forms because canonical form has strictLocked: true'
);

// ----------------------------------------------------------------------------
// SUITE 2: Preflight Form Integrity & 200-Question Cardinality Check
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 2: Form Integrity & Cardinality Check ---');

const repValid = runComprehensivePreflight(CANONICAL_ETS_EXAM_FORM_01, 'simulation');
assert(
  repValid.checks.formIntegrity.status === 'passed',
  'Form integrity check passes for canonical 200-question form'
);
assert(
  repValid.checks.formIntegrity.isCritical === true,
  'Form integrity is flagged as a critical check'
);

// Mutate form to simulate incomplete question set (199 questions)
const defectiveForm: ExamForm = {
  ...CANONICAL_ETS_EXAM_FORM_01,
  id: 'defective-199-form',
  questions: CANONICAL_ETS_EXAM_FORM_01.questions.slice(0, 199),
};

const repDefective = runComprehensivePreflight(defectiveForm, 'simulation');
assert(
  repDefective.checks.formIntegrity.status === 'failed',
  'Form integrity fails when questions count is 199 instead of 200'
);
assert(
  repDefective.isReadyToStart === false,
  'Ready to start is false when form integrity check fails'
);
assert(
  repDefective.blockers.length > 0,
  'Blockers array records incomplete question form error'
);

// ----------------------------------------------------------------------------
// SUITE 3: Strict Mode Lock Gating & Transparent Rejection Reasons
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 3: Strict Mode Lock Gating & Rejection Reasons ---');

const repStrictLocked = runComprehensivePreflight(CANONICAL_ETS_EXAM_FORM_01, 'strict');
assert(
  repStrictLocked.checks.mediaReadiness.status === 'failed',
  'Media readiness fails when Strict Mode is requested on locked form'
);
assert(
  repStrictLocked.checks.mediaReadiness.isCritical === true,
  'Strict media readiness is critical'
);
assert(
  repStrictLocked.isReadyToStart === false,
  'Strict mode cannot start on non-certified locked form'
);
assert(
  repStrictLocked.blockers.some((b) =>
    b.includes('Strict Mock') || b.includes('phòng thu') || b.includes('prerecorded')
  ),
  'Blocker explains transparently why Strict Mock is locked'
);

// ----------------------------------------------------------------------------
// SUITE 4: Simulation Fallback Acceptance & Warning Labeling
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 4: Simulation Fallback Acceptance & Warning Labeling ---');

const repSim = runComprehensivePreflight(CANONICAL_ETS_EXAM_FORM_01, 'simulation');
assert(
  repSim.checks.mediaReadiness.status === 'passed',
  'Media readiness passes for Simulation mode on canonical form'
);
assert(
  repSim.warnings.some((w) => w.includes('Mô Phỏng') || w.includes('Simulation')),
  'Warnings include transparent notice that simulation mode uses Web Speech API'
);
assert(
  repSim.warnings.some((w) => w.includes('không tuyên bố')),
  'Explicitly clarifies simulation mode does not claim official ETS timing'
);

// ----------------------------------------------------------------------------
// SUITE 5: Browser Capabilities & Unsupported Platform Handling
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 5: Browser Capabilities & Platform Support ---');

const repSpeechDisabled = runComprehensivePreflight(CANONICAL_ETS_EXAM_FORM_01, 'simulation', {
  customSpeechAvailable: false,
});
assert(
  repSpeechDisabled.checks.browserCapabilities.status === 'failed',
  'Browser capabilities check fails when SpeechSynthesis is unavailable in simulation'
);
assert(
  repSpeechDisabled.isReadyToStart === false,
  'Ready to start is blocked when SpeechSynthesis is missing for simulation'
);

const repAudioDisabled = runComprehensivePreflight(CANONICAL_ETS_EXAM_FORM_01, 'simulation', {
  customSpeechAvailable: true,
  customAudioAvailable: false,
});
assert(
  repAudioDisabled.checks.browserCapabilities.status === 'failed',
  'Browser capabilities check fails when Audio output is unavailable'
);

const repSupported = runComprehensivePreflight(CANONICAL_ETS_EXAM_FORM_01, 'simulation', {
  customSpeechAvailable: true,
  customAudioAvailable: true,
});
assert(
  repSupported.checks.browserCapabilities.status === 'passed',
  'Browser capabilities check passes when all APIs are available'
);

// ----------------------------------------------------------------------------
// SUITE 6: Storage Read/Write Access & Quota Failure Gating
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 6: Storage Read/Write Access Check ---');

const repStorageBlocked = runComprehensivePreflight(CANONICAL_ETS_EXAM_FORM_01, 'simulation', {
  customStorageAvailable: false,
});
assert(
  repStorageBlocked.checks.storageAccess.status === 'failed',
  'Storage access check fails when LocalStorage is blocked or full'
);
assert(
  repStorageBlocked.checks.storageAccess.isCritical === true,
  'Storage access is critical for offline auto-saving'
);
assert(
  repStorageBlocked.isReadyToStart === false,
  'Exam start is strictly blocked when storage write fails'
);

const repStorageOk = runComprehensivePreflight(CANONICAL_ETS_EXAM_FORM_01, 'simulation', {
  customStorageAvailable: true,
});
assert(
  repStorageOk.checks.storageAccess.status === 'passed',
  'Storage access check passes when LocalStorage is accessible'
);

// ----------------------------------------------------------------------------
// SUITE 7: Existing Unfinished Session Conflict Assessment
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 7: Existing Session Conflict Assessment ---');

// Default run without active session
const repNoActive = runComprehensivePreflight(CANONICAL_ETS_EXAM_FORM_01, 'simulation');
assert(
  repNoActive.checks.activeSession.status === 'passed' ||
    repNoActive.checks.activeSession.status === 'warning',
  'Active session check evaluates smoothly without runtime exceptions'
);
assert(
  repNoActive.checks.activeSession.isCritical === false,
  'Active session is non-critical (handled via Resume or Discard)'
);

// ----------------------------------------------------------------------------
// SUITE 8: Multi-Tab Conflict Detection in Preflight
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 8: Multi-Tab Lease Ownership Verification ---');

const repTab = runComprehensivePreflight(CANONICAL_ETS_EXAM_FORM_01, 'simulation');
assert(
  repTab.checks.multiTab.status === 'passed' || repTab.checks.multiTab.status === 'warning',
  'Multi-tab check reports status gracefully'
);
assert(
  repTab.checks.multiTab.isCritical === false,
  'Multi-tab conflict is non-critical because takeover resolves ownership'
);

// ----------------------------------------------------------------------------
// SUITE 9: Sound Check Utility & Autoplay Unlock Gate
// ----------------------------------------------------------------------------
console.log('\n--- SUITE 9: Sound Check Utility & Autoplay Unlock Gate ---');

const repUntestedSound = runComprehensivePreflight(CANONICAL_ETS_EXAM_FORM_01, 'simulation', {
  hasTestedSound: false,
});
assert(
  repUntestedSound.checks.audioGesture.status === 'warning',
  'Audio gesture check status is warning when sound check has not yet run'
);

const repTestedSound = runComprehensivePreflight(CANONICAL_ETS_EXAM_FORM_01, 'simulation', {
  hasTestedSound: true,
});
assert(
  repTestedSound.checks.audioGesture.status === 'passed',
  'Audio gesture check status is passed when sound check has verified'
);

// Sound check execution test
async function runAsyncTests() {
  const res = await testAudioPlayback('tone');
  assert(res.success === true, 'Sound playback utility succeeds in Node/Browser environment');
  assert(res.mode === 'tone', 'Sound playback executed tone mode');
  assert(typeof res.playedAt === 'number', 'Sound playback records valid timestamp');

  // ----------------------------------------------------------------------------
  // SUITE 10: Comprehensive Start Readiness & Double-Start Prevention
  // ----------------------------------------------------------------------------
  console.log('\n--- SUITE 10: Start Readiness & Gating Rules ---');

  // Condition A: All passed -> Ready to start
  const repReady = runComprehensivePreflight(CANONICAL_ETS_EXAM_FORM_01, 'simulation', {
    hasTestedSound: true,
    customStorageAvailable: true,
    customSpeechAvailable: true,
    customAudioAvailable: true,
  });
  assert(repReady.isReadyToStart === true, 'Preflight report confirms ready to start when all checks pass');
  assert(repReady.blockers.length === 0, 'Zero blockers exist for verified simulation run');

  // Condition B: Strict requested -> Blocked
  const repStrict = runComprehensivePreflight(CANONICAL_ETS_EXAM_FORM_01, 'strict', {
    hasTestedSound: true,
    customStorageAvailable: true,
  });
  assert(repStrict.isReadyToStart === false, 'Ready to start is FALSE when Strict is requested');
  assert(repStrict.blockers.length > 0, 'Blockers array prevents start when Strict is locked');

  // Condition C: Storage failed -> Blocked
  const repBlockedStorage = runComprehensivePreflight(CANONICAL_ETS_EXAM_FORM_01, 'simulation', {
    customStorageAvailable: false,
  });
  assert(repBlockedStorage.isReadyToStart === false, 'Ready to start is FALSE when storage is blocked');

  console.log('\n================================================================');
  console.log(`TOTAL TESTS RUN:    ${testsRun}`);
  console.log(`TOTAL TESTS PASSED: ${testsPassed}`);
  console.log(`TOTAL TESTS FAILED: ${testsFailed}`);
  console.log('================================================================\n');

  if (testsFailed === 0) {
    console.log('🎉 ALL ASSERTIONS PASSED! Phase 13 Exam Library & Preflight Validated.\n');
  } else {
    console.error('❌ SOME ASSERTIONS FAILED! Please inspect errors above.\n');
    process.exit(1);
  }
}

runAsyncTests();

