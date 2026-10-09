/**
 * TOEIC Mastery Hub — Media Readiness & Timeline Verification Engine (Phase 9)
 *
 * Provides comprehensive media readiness auditing, physical asset checks,
 * spoken duration timeline estimation, and 4-tier classification:
 * - 'invalid': Structural defects or missing critical question entities
 * - 'content-ready': 100% questions/keys valid, but media assets incomplete
 * - 'simulation-ready': 100% transcripts, scripts, vector illustrations, and options
 *   ready for Web Speech API / TTS simulation (Strict Mock locked with transparent rationale)
 * - 'strict-ready': 100% verified prerecorded studio audio files with certified timeline
 *
 * Adheres strictly to the user guideline:
 * "Không tạo audio rỗng, silent filler, tài nguyên giả hoặc thay thế recording bằng TTS rồi tự công bố đạt Strict Mock.
 *  Nếu chỉ có TTS, đánh dấu simulation-only. Chế độ Strict phải bị khóa cho đến khi media và lịch phát đạt kiểm định."
 */

import {
  ToeicPartNumber,
  Part1Question,
  Part2Question,
  Part3Group,
  Part4Group,
  Question,
  QuestionGroup,
} from '../types/questionBank';
import {
  ExamForm,
  ExamReadinessStatus,
  MediaReadinessIssue,
  PartMediaAudit,
  ExamMediaReadinessReport,
} from '../types/mockExam';
import { LISTENING_ILLUSTRATIONS } from '../components/Diagnostic/listeningIllustrationsMap';
import {
  QuestionBankLookupInterface,
  defaultLookup,
  validateExamFormStructure,
} from './examBlueprintValidator';
import { getQuestionById, getQuestionGroupById } from './questionBankLookup';




// ============================================================================
// CONSTANTS & ETS TIMELINE BENCHMARKS
// ============================================================================

/** Average spoken rate for native North American ETS audio: ~150 WPM (2.5 words/sec) */
export const ETS_AVERAGE_WPM = 150;

/** Inter-statement pause between choices (A, B, C, D) in Part 1 */
export const ETS_PART1_STATEMENT_PAUSE_SECONDS = 1.5;

/** Response window after all options in Part 1 */
export const ETS_PART1_RESPONSE_PAUSE_SECONDS = 5.0;

/** Response window after option C in Part 2 */
export const ETS_PART2_RESPONSE_PAUSE_SECONDS = 5.0;

/** Spoken intro/directions allowance per listening part (~45-60 seconds) */
export const ETS_PART_DIRECTIONS_ALLOWANCE_SECONDS = 50.0;

/** Answer pause per question in Part 3 / Part 4 (3 questions × 8s = 24s per group) */
export const ETS_GROUP_QUESTION_PAUSE_SECONDS = 8.0;

/** Official ETS Listening section target duration: 45 minutes = 2,700 seconds */
export const ETS_LISTENING_TARGET_DURATION_SECONDS = 2700;

/** Acceptable deviation threshold for Strict Certification: ±120 seconds (2 minutes) */
export const ETS_STRICT_TIMELINE_TOLERANCE_SECONDS = 120;

// Re-export default Question Bank lookup adapter
export { defaultLookup };


// ============================================================================
// HELPER UTILITIES
// ============================================================================

function countWords(text: string): number {
  if (!text) return 0;
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

function estimateSpeechSeconds(text: string, wpm: number = ETS_AVERAGE_WPM): number {
  const words = countWords(text);
  if (words === 0) return 0;
  return Math.round(((words / wpm) * 60) * 10) / 10;
}

// ============================================================================
// 1. PART-SPECIFIC MEDIA READINESS AUDITING
// ============================================================================

/**
 * Audits Part 1 Photographs media readiness (illustrations, scripts, options).
 */
export function auditPart1Media(
  questionIds: string[],
  lookup: QuestionBankLookupInterface = defaultLookup
): PartMediaAudit {
  const issues: MediaReadinessIssue[] = [];
  let visualsVerified = 0;
  let audioScriptsCount = 0;
  let transcriptsCount = 0;
  let prerecordedAudioCount = 0;
  let measuredDuration = 0;
  let estimatedTtsDuration = ETS_PART_DIRECTIONS_ALLOWANCE_SECONDS;

  questionIds.forEach((qId) => {
    const q = lookup.getQuestion(qId) as Part1Question | undefined;
    if (!q) {
      issues.push({
        code: 'P1_MISSING_QUESTION',
        partNum: 1,
        questionId: qId,
        severity: 'blocker',
        message: `Part 1 question "${qId}" not found in Question Bank`,
      });
      return;
    }

    // Visual illustration check
    const visual = q.media?.visual;
    if (!visual || !visual.illustrationId) {
      issues.push({
        code: 'P1_MISSING_VISUAL',
        partNum: 1,
        questionId: qId,
        severity: 'blocker',
        message: `Part 1 question "${qId}" lacks required visual illustrationId`,
      });
    } else if (!LISTENING_ILLUSTRATIONS[visual.illustrationId]) {
      issues.push({
        code: 'P1_UNREGISTERED_ILLUSTRATION',
        partNum: 1,
        questionId: qId,
        severity: 'blocker',
        message: `Illustration ID "${visual.illustrationId}" is not registered in LISTENING_ILLUSTRATIONS`,
      });
    } else {
      visualsVerified++;
    }

    // Audio script & options check
    const audioScript = q.media?.audio?.audioScript;
    if (!audioScript || audioScript.trim().length === 0) {
      issues.push({
        code: 'P1_MISSING_AUDIO_SCRIPT',
        partNum: 1,
        questionId: qId,
        severity: 'blocker',
        message: `Part 1 question "${qId}" missing audio narration script`,
      });
    } else {
      audioScriptsCount++;
      // Duration estimation: spoken statements + pauses
      const speechSec = estimateSpeechSeconds(audioScript);
      const pauses = 4 * ETS_PART1_STATEMENT_PAUSE_SECONDS + ETS_PART1_RESPONSE_PAUSE_SECONDS;
      estimatedTtsDuration += speechSec + pauses;
    }

    if (q.media?.transcript) {
      transcriptsCount++;
    }

    // Physical audio file check
    const audioFileUri = (q.media?.audio as { audioFileUri?: string })?.audioFileUri;
    if (audioFileUri) {
      prerecordedAudioCount++;
      // If duration is provided in metadata, add to measuredDuration
      const dur = (q.media?.audio as { durationSeconds?: number })?.durationSeconds;
      if (dur) measuredDuration += dur;
    }
  });

  const isSimulationReady =
    issues.filter((i) => i.severity === 'blocker').length === 0 &&
    visualsVerified === questionIds.length &&
    audioScriptsCount === questionIds.length;

  const isStrictReady =
    isSimulationReady &&
    prerecordedAudioCount === questionIds.length &&
    measuredDuration > 0;

  if (!isStrictReady) {
    issues.push({
      code: 'P1_PRERECORDED_AUDIO_ABSENT',
      partNum: 1,
      severity: 'info',
      message: `Part 1 currently uses high-fidelity Web Speech API / TTS simulation (${prerecordedAudioCount}/${questionIds.length} studio audio recordings present).`,
      remediation: 'Attach verified FLAC/MP3 studio recordings for strict ETS certification.',
    });
  }

  return {
    partNum: 1,
    questionCount: questionIds.length,
    hasVisuals: true,
    visualsVerifiedCount: visualsVerified,
    audioPromptsCount: questionIds.length,
    audioScriptsCount,
    transcriptsCount,
    prerecordedAudioFilesCount: prerecordedAudioCount,
    measuredDurationSeconds: measuredDuration > 0 ? measuredDuration : undefined,
    estimatedTtsDurationSeconds: Math.round(estimatedTtsDuration),
    isSimulationReady,
    isStrictReady,
    issues,
  };
}

/**
 * Audits Part 2 Question-Response media readiness (prompts, 3 options A-C, scripts).
 */
export function auditPart2Media(
  questionIds: string[],
  lookup: QuestionBankLookupInterface = defaultLookup
): PartMediaAudit {
  const issues: MediaReadinessIssue[] = [];
  let audioScriptsCount = 0;
  let transcriptsCount = 0;
  let prerecordedAudioCount = 0;
  let measuredDuration = 0;
  let estimatedTtsDuration = ETS_PART_DIRECTIONS_ALLOWANCE_SECONDS;

  questionIds.forEach((qId) => {
    const q = lookup.getQuestion(qId) as Part2Question | undefined;
    if (!q) {
      issues.push({
        code: 'P2_MISSING_QUESTION',
        partNum: 2,
        questionId: qId,
        severity: 'blocker',
        message: `Part 2 question "${qId}" not found in Question Bank`,
      });
      return;
    }

    if (!q.promptScript || q.promptScript.trim().length === 0) {
      issues.push({
        code: 'P2_MISSING_PROMPT_SCRIPT',
        partNum: 2,
        questionId: qId,
        severity: 'blocker',
        message: `Part 2 question "${qId}" lacks promptScript`,
      });
    }

    const audioScript = q.media?.audio?.audioScript;
    if (!audioScript || audioScript.trim().length === 0) {
      issues.push({
        code: 'P2_MISSING_AUDIO_SCRIPT',
        partNum: 2,
        questionId: qId,
        severity: 'blocker',
        message: `Part 2 question "${qId}" lacks audioScript`,
      });
    } else {
      audioScriptsCount++;
      const speechSec = estimateSpeechSeconds(audioScript);
      const pauses = ETS_PART2_RESPONSE_PAUSE_SECONDS;
      estimatedTtsDuration += speechSec + pauses;
    }

    if (q.media?.transcript) {
      transcriptsCount++;
    }

    const audioFileUri = (q.media?.audio as { audioFileUri?: string })?.audioFileUri;
    if (audioFileUri) {
      prerecordedAudioCount++;
      const dur = (q.media?.audio as { durationSeconds?: number })?.durationSeconds;
      if (dur) measuredDuration += dur;
    }
  });

  const isSimulationReady =
    issues.filter((i) => i.severity === 'blocker').length === 0 &&
    audioScriptsCount === questionIds.length;

  const isStrictReady =
    isSimulationReady &&
    prerecordedAudioCount === questionIds.length &&
    measuredDuration > 0;

  if (!isStrictReady) {
    issues.push({
      code: 'P2_PRERECORDED_AUDIO_ABSENT',
      partNum: 2,
      severity: 'info',
      message: `Part 2 currently uses Web Speech API / TTS simulation (${prerecordedAudioCount}/${questionIds.length} studio audio recordings present).`,
      remediation: 'Attach studio recorded tracks for strict ETS certification.',
    });
  }

  return {
    partNum: 2,
    questionCount: questionIds.length,
    hasVisuals: false,
    visualsVerifiedCount: 0,
    audioPromptsCount: questionIds.length,
    audioScriptsCount,
    transcriptsCount,
    prerecordedAudioFilesCount: prerecordedAudioCount,
    measuredDurationSeconds: measuredDuration > 0 ? measuredDuration : undefined,
    estimatedTtsDurationSeconds: Math.round(estimatedTtsDuration),
    isSimulationReady,
    isStrictReady,
    issues,
  };
}

/**
 * Audits Part 3 Conversations media readiness (dialogues, turns, graphic context, question pauses).
 */
export function auditPart3Media(
  groupIds: string[],
  lookup: QuestionBankLookupInterface = defaultLookup
): PartMediaAudit {
  const issues: MediaReadinessIssue[] = [];
  let visualsVerified = 0;
  let audioScriptsCount = 0;
  let transcriptsCount = 0;
  let prerecordedAudioCount = 0;
  let measuredDuration = 0;
  let totalQuestionsCount = 0;
  let estimatedTtsDuration = ETS_PART_DIRECTIONS_ALLOWANCE_SECONDS;

  groupIds.forEach((gId) => {
    const grp = lookup.getGroup(gId) as Part3Group | undefined;
    if (!grp) {
      issues.push({
        code: 'P3_MISSING_GROUP',
        partNum: 3,
        groupId: gId,
        severity: 'blocker',
        message: `Part 3 group "${gId}" not found in Question Bank`,
      });
      return;
    }

    totalQuestionsCount += grp.questionIds.length;

    // Graphic context check if present (supports graphic or visual property)
    const graphicContext =
      (grp as { media?: { graphic?: { illustrationId?: string } } }).media?.graphic ||
      (grp as { media?: { visual?: { illustrationId?: string } } }).media?.visual;
    if (graphicContext?.illustrationId) {
      if (LISTENING_ILLUSTRATIONS[graphicContext.illustrationId]) {
        visualsVerified++;
      } else {
        issues.push({
          code: 'P3_UNREGISTERED_GRAPHIC',
          partNum: 3,
          groupId: gId,
          severity: 'blocker',
          message: `Graphic context ID "${graphicContext.illustrationId}" not registered in LISTENING_ILLUSTRATIONS`,
        });
      }
    }

    // Dialogue audio script
    const audioScript = grp.media?.audio?.audioScript;
    if (!audioScript || audioScript.trim().length === 0) {
      issues.push({
        code: 'P3_MISSING_AUDIO_SCRIPT',
        partNum: 3,
        groupId: gId,
        severity: 'blocker',
        message: `Part 3 group "${gId}" lacks dialogue audio script`,
      });
    } else {
      audioScriptsCount++;
      const dialogueSec = estimateSpeechSeconds(audioScript);
      // Questions reading and pause: 3 questions * 8 seconds = 24 seconds
      const questionPauses = grp.questionIds.length * ETS_GROUP_QUESTION_PAUSE_SECONDS;
      estimatedTtsDuration += dialogueSec + questionPauses;
    }

    if (grp.media?.transcript) {
      transcriptsCount++;
    }

    const audioFileUri = (grp.media?.audio as { audioFileUri?: string })?.audioFileUri;
    if (audioFileUri) {
      prerecordedAudioCount++;
      const dur = (grp.media?.audio as { durationSeconds?: number })?.durationSeconds;
      if (dur) measuredDuration += dur;
    }
  });

  const isSimulationReady =
    issues.filter((i) => i.severity === 'blocker').length === 0 &&
    audioScriptsCount === groupIds.length;

  const isStrictReady =
    isSimulationReady &&
    prerecordedAudioCount === groupIds.length &&
    measuredDuration > 0;

  if (!isStrictReady) {
    issues.push({
      code: 'P3_PRERECORDED_AUDIO_ABSENT',
      partNum: 3,
      severity: 'info',
      message: `Part 3 currently uses Web Speech API / TTS multi-speaker dialogue simulation (${prerecordedAudioCount}/${groupIds.length} tracks present).`,
      remediation: 'Attach multi-voice studio recorded audio for strict ETS certification.',
    });
  }

  return {
    partNum: 3,
    questionCount: totalQuestionsCount,
    hasVisuals: visualsVerified > 0,
    visualsVerifiedCount: visualsVerified,
    audioPromptsCount: groupIds.length,
    audioScriptsCount,
    transcriptsCount,
    prerecordedAudioFilesCount: prerecordedAudioCount,
    measuredDurationSeconds: measuredDuration > 0 ? measuredDuration : undefined,
    estimatedTtsDurationSeconds: Math.round(estimatedTtsDuration),
    isSimulationReady,
    isStrictReady,
    issues,
  };
}

/**
 * Audits Part 4 Short Talks media readiness (monologues, graphic context, question pauses).
 */
export function auditPart4Media(
  groupIds: string[],
  lookup: QuestionBankLookupInterface = defaultLookup
): PartMediaAudit {
  const issues: MediaReadinessIssue[] = [];
  let visualsVerified = 0;
  let audioScriptsCount = 0;
  let transcriptsCount = 0;
  let prerecordedAudioCount = 0;
  let measuredDuration = 0;
  let totalQuestionsCount = 0;
  let estimatedTtsDuration = ETS_PART_DIRECTIONS_ALLOWANCE_SECONDS;

  groupIds.forEach((gId) => {
    const grp = lookup.getGroup(gId) as Part4Group | undefined;
    if (!grp) {
      issues.push({
        code: 'P4_MISSING_GROUP',
        partNum: 4,
        groupId: gId,
        severity: 'blocker',
        message: `Part 4 group "${gId}" not found in Question Bank`,
      });
      return;
    }

    totalQuestionsCount += grp.questionIds.length;

    // Graphic context check if present (supports graphic or visual property)
    const graphicContext =
      (grp as { media?: { graphic?: { illustrationId?: string } } }).media?.graphic ||
      (grp as { media?: { visual?: { illustrationId?: string } } }).media?.visual;
    if (graphicContext?.illustrationId) {
      if (LISTENING_ILLUSTRATIONS[graphicContext.illustrationId]) {
        visualsVerified++;
      } else {
        issues.push({
          code: 'P4_UNREGISTERED_GRAPHIC',
          partNum: 4,
          groupId: gId,
          severity: 'blocker',
          message: `Graphic context ID "${graphicContext.illustrationId}" not registered in LISTENING_ILLUSTRATIONS`,
        });
      }
    }

    // Monologue audio script
    const audioScript = grp.media?.audio?.audioScript;
    if (!audioScript || audioScript.trim().length === 0) {
      issues.push({
        code: 'P4_MISSING_AUDIO_SCRIPT',
        partNum: 4,
        groupId: gId,
        severity: 'blocker',
        message: `Part 4 group "${gId}" lacks monologue audio script`,
      });
    } else {
      audioScriptsCount++;
      const talkSec = estimateSpeechSeconds(audioScript);
      const questionPauses = grp.questionIds.length * ETS_GROUP_QUESTION_PAUSE_SECONDS;
      estimatedTtsDuration += talkSec + questionPauses;
    }

    if (grp.media?.transcript) {
      transcriptsCount++;
    }

    const audioFileUri = (grp.media?.audio as { audioFileUri?: string })?.audioFileUri;
    if (audioFileUri) {
      prerecordedAudioCount++;
      const dur = (grp.media?.audio as { durationSeconds?: number })?.durationSeconds;
      if (dur) measuredDuration += dur;
    }
  });

  const isSimulationReady =
    issues.filter((i) => i.severity === 'blocker').length === 0 &&
    audioScriptsCount === groupIds.length;

  const isStrictReady =
    isSimulationReady &&
    prerecordedAudioCount === groupIds.length &&
    measuredDuration > 0;

  if (!isStrictReady) {
    issues.push({
      code: 'P4_PRERECORDED_AUDIO_ABSENT',
      partNum: 4,
      severity: 'info',
      message: `Part 4 currently uses Web Speech API / TTS monologue simulation (${prerecordedAudioCount}/${groupIds.length} tracks present).`,
      remediation: 'Attach studio recorded monologues for strict ETS certification.',
    });
  }

  return {
    partNum: 4,
    questionCount: totalQuestionsCount,
    hasVisuals: visualsVerified > 0,
    visualsVerifiedCount: visualsVerified,
    audioPromptsCount: groupIds.length,
    audioScriptsCount,
    transcriptsCount,
    prerecordedAudioFilesCount: prerecordedAudioCount,
    measuredDurationSeconds: measuredDuration > 0 ? measuredDuration : undefined,
    estimatedTtsDurationSeconds: Math.round(estimatedTtsDuration),
    isSimulationReady,
    isStrictReady,
    issues,
  };
}

// ============================================================================
// 2. EXAM FORM MEDIA READINESS ASSESSMENT (FULL REPORT)
// ============================================================================

/**
 * Assesses complete media readiness for a 200-question ExamForm.
 * Determines 4-tier status ('invalid' | 'content-ready' | 'simulation-ready' | 'strict-ready')
 * and enforces Strict Mode Lock whenever studio recordings / verified timelines are absent.
 */
export function assessExamFormMediaReadiness(
  form: ExamForm,
  lookup: QuestionBankLookupInterface = defaultLookup
): ExamMediaReadinessReport {
  // Extract listening parts from form questions & groups
  const p1QIds = form.questions.filter((q) => q.partNum === 1).map((q) => q.questionId);
  const p2QIds = form.questions.filter((q) => q.partNum === 2).map((q) => q.questionId);
  const p3GIds = form.groups.filter((g) => g.partNum === 3).map((g) => g.groupId);
  const p4GIds = form.groups.filter((g) => g.partNum === 4).map((g) => g.groupId);

  const p1Audit = auditPart1Media(p1QIds, lookup);
  const p2Audit = auditPart2Media(p2QIds, lookup);
  const p3Audit = auditPart3Media(p3GIds, lookup);
  const p4Audit = auditPart4Media(p4GIds, lookup);

  const partsAudit: Record<1 | 2 | 3 | 4, PartMediaAudit> = {
    1: p1Audit,
    2: p2Audit,
    3: p3Audit,
    4: p4Audit,
  };

  // 0. Structural integrity validation
  const structValidation = validateExamFormStructure(form);
  const structuralBlockers: MediaReadinessIssue[] = [];
  if (!structValidation.isValid) {
    structValidation.errors.forEach((err) => {
      structuralBlockers.push({
        code: err.code,
        partNum: (err.partNum as 1 | 2 | 3 | 4) || undefined,
        groupId: err.groupId,
        questionId: err.questionId,
        severity: 'blocker',
        message: err.message,
      });
    });
  }

  const allIssues = [
    ...structuralBlockers,
    ...p1Audit.issues,
    ...p2Audit.issues,
    ...p3Audit.issues,
    ...p4Audit.issues,
  ];

  const blockers = allIssues.filter((i) => i.severity === 'blocker');
  const warnings = allIssues.filter((i) => i.severity === 'warning');

  const totalListeningQuestions =
    p1Audit.questionCount +
    p2Audit.questionCount +
    p3Audit.questionCount +
    p4Audit.questionCount;

  const audioAssetsFound =
    p1Audit.prerecordedAudioFilesCount +
    p2Audit.prerecordedAudioFilesCount +
    p3Audit.prerecordedAudioFilesCount +
    p4Audit.prerecordedAudioFilesCount;

  const totalMeasuredDuration =
    (p1Audit.measuredDurationSeconds || 0) +
    (p2Audit.measuredDurationSeconds || 0) +
    (p3Audit.measuredDurationSeconds || 0) +
    (p4Audit.measuredDurationSeconds || 0);

  const totalEstimatedTtsDuration =
    p1Audit.estimatedTtsDurationSeconds +
    p2Audit.estimatedTtsDurationSeconds +
    p3Audit.estimatedTtsDurationSeconds +
    p4Audit.estimatedTtsDurationSeconds;

  // 4-Tier Classification Logic
  let readinessStatus: ExamReadinessStatus = 'invalid';
  let isSimulationAllowed = false;
  let strictLocked = true;
  let lockReason: string | undefined = undefined;

  if (blockers.length > 0 || totalListeningQuestions !== 100) {
    readinessStatus = 'invalid';
    isSimulationAllowed = false;
    strictLocked = true;
    lockReason = 'Lỗi dữ liệu nghiêm trọng trong câu hỏi hoặc cấu trúc phần nghe.';
  } else {
    const allSimulationReady =
      p1Audit.isSimulationReady &&
      p2Audit.isSimulationReady &&
      p3Audit.isSimulationReady &&
      p4Audit.isSimulationReady;

    const allStrictReady =
      p1Audit.isStrictReady &&
      p2Audit.isStrictReady &&
      p3Audit.isStrictReady &&
      p4Audit.isStrictReady &&
      audioAssetsFound === 54 && // 6 P1 + 25 P2 + 13 P3 + 10 P4 = 54 audio prompts
      Math.abs(totalMeasuredDuration - ETS_LISTENING_TARGET_DURATION_SECONDS) <=
        ETS_STRICT_TIMELINE_TOLERANCE_SECONDS;

    if (allStrictReady) {
      readinessStatus = 'strict-ready';
      isSimulationAllowed = true;
      strictLocked = false;
    } else if (allSimulationReady) {
      readinessStatus = 'simulation-ready';
      isSimulationAllowed = true;
      strictLocked = true;
      lockReason =
        'Chưa có gói tệp âm thanh phòng thu thực tế (prerecorded studio audio files) và mốc timeline phát đã kiểm chứng. ' +
        'Chế độ Strict Mock 45 phút bị khóa theo quy chuẩn chất lượng. Đề thi sẵn sàng 100% cho chế độ Mô Phỏng (Simulation Mode) bằng Web Speech API.';
    } else {
      readinessStatus = 'content-ready';
      isSimulationAllowed = false;
      strictLocked = true;
      lockReason = 'Nội dung câu hỏi đầy đủ nhưng media scripts/visuals chưa đạt tiêu chuẩn mô phỏng.';
    }
  }

  return {
    examFormId: form.id,
    readinessStatus,
    isSimulationAllowed,
    strictLocked,
    lockReason,
    totalListeningQuestions,
    audioAssetsFoundCount: audioAssetsFound,
    totalMeasuredDurationSeconds: totalMeasuredDuration,
    totalEstimatedTtsDurationSeconds: totalEstimatedTtsDuration,
    targetListeningDurationSeconds: ETS_LISTENING_TARGET_DURATION_SECONDS,
    timelineDeviationSeconds:
      totalMeasuredDuration > 0
        ? Math.abs(totalMeasuredDuration - ETS_LISTENING_TARGET_DURATION_SECONDS)
        : Math.abs(totalEstimatedTtsDuration - ETS_LISTENING_TARGET_DURATION_SECONDS),
    partsAudit,
    blockers,
    warnings,
  };
}
