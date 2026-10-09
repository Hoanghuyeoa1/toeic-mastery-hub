/**
 * TOEIC Mastery Hub — Audio Script Parser & Segmenter
 * Phase 6: Stable Audio Controller & Lifecycle Architecture
 *
 * Responsibilities:
 * - Parses listening questions (Part 1, Part 2) into statement/prompt segments.
 * - Parses listening groups (Part 3, Part 4) into multi-speaker dialogue turns or talk chunks.
 * - Chunking long scripts to prevent browser Web Speech API 15-second hang bug.
 * - Provides deterministic, chronological segments for speech queuing.
 */

import { Question, QuestionGroup, Part1Question, Part2Question, Part3Group, Part4Group } from '../types/questionBank';
import { AudioTrackConfig, AudioScriptSegment, SpeakerRole } from '../types/listeningAudio';

/**
 * Splits text into natural sentence chunks (up to maxChars) to prevent Web Speech API utterance hang.
 */
export function chunkSentenceText(text: string, maxChars: number = 180): string[] {
  const cleaned = text.trim();
  if (!cleaned) return [];
  if (cleaned.length <= maxChars) return [cleaned];

  // Split on sentence boundaries: . ! ? followed by space or newline
  const rawSentences = cleaned.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = '';

  for (const sentence of rawSentences) {
    if (!current) {
      current = sentence;
    } else if ((current + ' ' + sentence).length <= maxChars) {
      current += ' ' + sentence;
    } else {
      chunks.push(current.trim());
      current = sentence;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

/**
 * Parses Part 3 multi-speaker dialogue into chronological turns.
 * Example input:
 * "Man: Hi Brenda, did the replacement parts arrive? Woman: No, the van broke down. Man: That is serious."
 */
export function parsePart3Dialogue(rawScript: string): AudioScriptSegment[] {
  if (!rawScript || !rawScript.trim()) return [];

  // Match speakers: "Man:", "Woman:", "Narrator:", "Man 1:", "Woman 2:", etc.
  const speakerRegex = /(?:^|\n|\r|\s*)(Man(?:\s*\d+)?|Woman(?:\s*\d+)?|Narrator|Speaker):\s*/gi;
  const matches = Array.from(rawScript.matchAll(speakerRegex));

  if (matches.length === 0) {
    // Fallback: chunk by sentences if no speaker prefix
    const chunks = chunkSentenceText(rawScript);
    return chunks.map((chunk, idx) => ({
      id: `seg-p3-fallback-${idx}`,
      order: idx,
      speaker: 'Speaker',
      text: chunk,
      genderHint: undefined,
    }));
  }

  const segments: AudioScriptSegment[] = [];

  for (let i = 0; i < matches.length; i++) {
    const currentMatch = matches[i];
    const speakerLabel = currentMatch[1].trim();
    const startIndex = currentMatch.index + currentMatch[0].length;
    const endIndex = i + 1 < matches.length ? matches[i + 1].index : rawScript.length;

    const speechText = rawScript.substring(startIndex, endIndex).trim();
    if (!speechText) continue;

    const isWoman = /^Woman/i.test(speakerLabel);
    const speakerRole: SpeakerRole = isWoman ? 'Woman' : 'Man';
    const genderHint: 'male' | 'female' = isWoman ? 'female' : 'male';

    // If a turn is excessively long, chunk it to avoid Web Speech API timeout
    const speechChunks = chunkSentenceText(speechText, 220);
    speechChunks.forEach((chunkText) => {
      segments.push({
        id: `seg-p3-${segments.length}`,
        order: segments.length,
        speaker: speakerRole,
        text: chunkText,
        genderHint,
      });
    });
  }

  return segments;
}

/**
 * Builds an AudioTrackConfig from a standalone Question (Part 1 or Part 2).
 */
export function buildAudioTrackConfigFromQuestion(question: Question): AudioTrackConfig {
  if (question.partNum === 1) {
    const p1 = question as Part1Question;
    const media = p1.media?.audio;
    const fullScript = media?.audioScript || p1.media?.transcript || '';

    const segments: AudioScriptSegment[] = p1.options.map((opt, idx) => ({
      id: `seg-${p1.id}-opt-${opt.key}`,
      order: idx,
      speaker: 'Narrator',
      text: `Statement ${opt.key}: ${opt.text}`,
      genderHint: media?.speakerGender,
      accentHint: media?.accent,
      choiceKey: opt.key,
    }));

    // Estimate duration: ~3.5s per statement + pauses (~15s total)
    const charCount = segments.reduce((sum, s) => sum + s.text.length, 0);
    const estimatedDuration = Math.max(12, Math.round(charCount / 14) + segments.length * 1.5);

    return {
      partNum: 1,
      questionId: p1.id,
      audioUrl: media?.audioUrl,
      fullScript,
      segments,
      preferredAccent: media?.accent,
      preferredGender: media?.speakerGender,
      estimatedDurationSeconds: media?.durationSeconds || estimatedDuration,
    };
  }

  if (question.partNum === 2) {
    const p2 = question as Part2Question;
    const media = p2.media?.audio;
    const fullScript = media?.audioScript || p2.media?.transcript || '';

    const segments: AudioScriptSegment[] = [];

    // Prompt question first
    segments.push({
      id: `seg-${p2.id}-prompt`,
      order: 0,
      speaker: 'Speaker',
      text: p2.promptScript,
      genderHint: media?.speakerGender,
      accentHint: media?.accent,
      isPrompt: true,
    });

    // Followed by 3 choices (A, B, C)
    p2.options.forEach((opt, idx) => {
      segments.push({
        id: `seg-${p2.id}-opt-${opt.key}`,
        order: idx + 1,
        speaker: 'Speaker',
        text: `Option ${opt.key}: ${opt.text}`,
        genderHint: media?.speakerGender,
        accentHint: media?.accent,
        choiceKey: opt.key as 'A' | 'B' | 'C',
      });
    });

    const charCount = segments.reduce((sum, s) => sum + s.text.length, 0);
    const estimatedDuration = Math.max(10, Math.round(charCount / 14) + segments.length * 1.5);

    return {
      partNum: 2,
      questionId: p2.id,
      audioUrl: media?.audioUrl,
      fullScript,
      segments,
      preferredAccent: media?.accent,
      preferredGender: media?.speakerGender,
      estimatedDurationSeconds: media?.durationSeconds || estimatedDuration,
    };
  }

  // Reading questions have no audio
  return {
    partNum: 1,
    questionId: question.id,
    segments: [],
    estimatedDurationSeconds: 0,
  };
}

/**
 * Builds an AudioTrackConfig from a QuestionGroup (Part 3 Conversation or Part 4 Talk).
 */
export function buildAudioTrackConfigFromGroup(group: QuestionGroup): AudioTrackConfig {
  if (group.partNum === 3) {
    const p3 = group as Part3Group;
    const media = p3.media?.audio;
    const fullScript = media?.audioScript || p3.media?.transcript || '';
    const segments = parsePart3Dialogue(fullScript);

    const charCount = segments.reduce((sum, s) => sum + s.text.length, 0);
    const estimatedDuration = Math.max(20, Math.round(charCount / 15) + segments.length * 1.0);

    return {
      partNum: 3,
      groupId: p3.id,
      audioUrl: media?.audioUrl,
      fullScript,
      segments,
      preferredAccent: media?.accent,
      estimatedDurationSeconds: media?.durationSeconds || estimatedDuration,
    };
  }

  if (group.partNum === 4) {
    const p4 = group as Part4Group;
    const media = p4.media?.audio;
    const fullScript = media?.audioScript || p4.media?.transcript || '';

    // Part 4 is a continuous monologue/talk by 1 narrator
    const textChunks = chunkSentenceText(fullScript, 200);
    const segments: AudioScriptSegment[] = textChunks.map((chunk, idx) => ({
      id: `seg-${p4.id}-talk-${idx}`,
      order: idx,
      speaker: 'Narrator',
      text: chunk,
      genderHint: media?.speakerGender,
      accentHint: media?.accent,
    }));

    const charCount = fullScript.length;
    const estimatedDuration = Math.max(20, Math.round(charCount / 15) + segments.length * 1.0);

    return {
      partNum: 4,
      groupId: p4.id,
      audioUrl: media?.audioUrl,
      fullScript,
      segments,
      preferredAccent: media?.accent,
      preferredGender: media?.speakerGender,
      estimatedDurationSeconds: media?.durationSeconds || estimatedDuration,
    };
  }

  // Reading groups have no audio
  return {
    partNum: 3,
    groupId: group.id,
    segments: [],
    estimatedDurationSeconds: 0,
  };
}
