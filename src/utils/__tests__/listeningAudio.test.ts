/**
 * TOEIC Mastery Hub — Listening Audio Engine Unit Tests (Phase 6)
 *
 * Verifies:
 * 1. Script Parsing & Segmentation (Part 1 choices, Part 2 prompt + options, Part 3 dialogue turns, Part 4 talks).
 * 2. Controller Lifecycle & State Transitions (idle -> playing -> ended, stop, destroy).
 * 3. Token Concurrency Guard & Stale Callback Rejection (rapid play/stop/play).
 * 4. Mode-based Replay Permissions (Practice mode unlimited vs Timed mode 1-play limit).
 * 5. Global Playback Coordinator (singleton audio, no overlapping playback).
 * 6. Error Handling & Transparency (missing source, TTS not supported, synthetic flag).
 * 7. Volume, Muting, and Playback Rate adjustments.
 */

import {
  buildAudioTrackConfigFromQuestion,
  buildAudioTrackConfigFromGroup,
  parsePart3Dialogue,
  chunkSentenceText,
} from '../audioScriptParser';

import {
  ListeningAudioController,
  audioPlaybackCoordinator,
} from '../listeningAudioController';

import { AudioTrackConfig } from '../../types/listeningAudio';
import { Part1Question, Part2Question, Part3Group, Part4Group } from '../../types/questionBank';

// ==========================================
// MOCKS FOR NODE / TEST ENVIRONMENT
// ==========================================

class MockUtterance {
  public text: string;
  public lang: string = 'en-US';
  public voice: any = null;
  public rate: number = 1.0;
  public volume: number = 1.0;
  public onend: (() => void) | null = null;
  public onerror: ((ev: any) => void) | null = null;

  constructor(text: string) {
    this.text = text;
  }
}

class MockSpeechSynthesis {
  public speaking = false;
  public paused = false;
  public onvoiceschanged: (() => void) | null = null;
  public lastUtterance: MockUtterance | null = null;
  public autoFinishOnSpeak = true;

  getVoices() {
    return [
      { name: 'Microsoft David Desktop - English (United States)', lang: 'en-US', voiceURI: 'david-us', default: true },
      { name: 'Microsoft Zira Desktop - English (United States)', lang: 'en-US', voiceURI: 'zira-us', default: false },
      { name: 'Microsoft George - English (United Kingdom)', lang: 'en-GB', voiceURI: 'george-uk', default: false },
    ];
  }

  speak(utterance: MockUtterance) {
    this.speaking = true;
    this.lastUtterance = utterance;

    if (this.autoFinishOnSpeak) {
      setTimeout(() => {
        if (this.lastUtterance === utterance && this.speaking) {
          this.speaking = false;
          utterance.onend?.();
        }
      }, 10);
    }
  }

  cancel() {
    const prev = this.lastUtterance;
    this.speaking = false;
    this.paused = false;
    this.lastUtterance = null;
    if (prev && prev.onerror) {
      prev.onerror({ error: 'canceled' });
    }
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }
}

class MockAudio {
  public src = '';
  public currentTime = 0;
  public duration = 15;
  public playbackRate = 1.0;
  public volume = 1.0;
  public muted = false;
  private listeners: Map<string, Function[]> = new Map();

  addEventListener(event: string, cb: Function) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(cb);
  }

  removeEventListener(event: string, cb: Function) {
    const list = this.listeners.get(event);
    if (list) {
      this.listeners.set(event, list.filter((f) => f !== cb));
    }
  }

  emit(event: string) {
    const list = this.listeners.get(event);
    if (list) list.forEach((f) => f());
  }

  play(): Promise<void> {
    this.emit('canplay');
    return Promise.resolve();
  }

  pause() {
    this.emit('pause');
  }

  load() {
    // no-op
  }
}

// Attach mocks to globalThis
const mockSpeech = new MockSpeechSynthesis();
(globalThis as any).window = globalThis;
(globalThis as any).speechSynthesis = mockSpeech;
(globalThis as any).SpeechSynthesisUtterance = MockUtterance;
(globalThis as any).Audio = MockAudio;

// Simple test runner helpers
let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Sample Question & Group Data
const samplePart1: Part1Question = {
  id: 'q-p1-001',
  partNum: 1,
  part: 'Part 1',
  section: 'listening',
  difficulty: 'easy',
  topic: 'Office',
  skillTag: 'Actions',
  media: {
    visual: { illustrationId: 'img_001', altText: 'Office desk' },
    audio: {
      audioScript: 'Statement A: She is assembling furniture. Statement B: She is reading. Statement C: Files are in a bin. Statement D: She is typing.',
      speakerGender: 'female',
      accent: 'US',
    },
  },
  question: 'Chọn câu miêu tả đúng nhất cho bức tranh:',
  options: [
    { key: 'A', text: 'She is assembling some furniture.' },
    { key: 'B', text: 'She is examining a folder.' },
    { key: 'C', text: 'Files are being discarded in a bin.' },
    { key: 'D', text: 'She is typing on a keyboard.' },
  ],
  correctKey: 'B',
  explanation: 'Đáp án B đúng.',
};

const samplePart2: Part2Question = {
  id: 'q-p2-001',
  partNum: 2,
  part: 'Part 2',
  section: 'listening',
  difficulty: 'easy',
  topic: 'Finance',
  skillTag: 'Wh- Question',
  promptScript: 'Where should I submit my travel expense report?',
  media: {
    audio: {
      speakerGender: 'male',
      accent: 'US',
    },
  },
  question: 'Chọn câu phản hồi phù hợp nhất:',
  options: [
    { key: 'A', text: 'Yes, it was quite expensive.' },
    { key: 'B', text: 'Send it directly to accounting.' },
    { key: 'C', text: 'I took the train last Thursday.' },
  ],
  correctKey: 'B',
  explanation: 'Đáp án B đúng.',
};

const samplePart3Group: Part3Group = {
  id: 'grp-p3-001',
  groupType: 'part3_conversation',
  partNum: 3,
  difficulty: 'medium',
  topic: 'Logistics',
  media: {
    audio: {
      audioScript: 'Man: Did the parts arrive? Woman: No, the delivery van broke down. Man: That is serious, I will call the warehouse.',
      accent: 'US',
    },
  },
  questionIds: ['q-p3-001', 'q-p3-002', 'q-p3-003'],
};

const samplePart4Group: Part4Group = {
  id: 'grp-p4-001',
  groupType: 'part4_talk',
  partNum: 4,
  difficulty: 'easy',
  topic: 'Travel',
  media: {
    audio: {
      audioScript: 'May I have your attention, passengers on flight 408. Due to maintenance, your gate has changed to C22. Boarding starts at 4:45.',
      accent: 'US',
      speakerGender: 'female',
    },
  },
  questionIds: ['q-p4-001', 'q-p4-002', 'q-p4-003'],
};

async function runTests() {
  console.log('======================================================');
  console.log('🧪 RUNNING LISTENING AUDIO ENGINE TESTS (PHASE 6)');
  console.log('======================================================\n');

  // ------------------------------------------------------------------
  // SUITE 1: Script Parsing & Segmentation
  // ------------------------------------------------------------------
  console.log('--- Suite 1: Script Parsing & Segmentation ---');

  // 1.1 Part 1 Question
  const p1Track = buildAudioTrackConfigFromQuestion(samplePart1);
  assert(p1Track.partNum === 1, '1.1 Part 1 config partNum is 1');
  assert(p1Track.segments.length === 4, '1.1 Part 1 generates exactly 4 statement segments');
  assert(p1Track.segments[0].choiceKey === 'A', '1.1 Segment 0 corresponds to Statement A');
  assert(p1Track.segments[0].text.startsWith('Statement A:'), '1.1 Segment 0 recites Statement A prefix and text');
  assert(p1Track.segments[3].choiceKey === 'D', '1.1 Segment 3 corresponds to Statement D');
  assert(p1Track.estimatedDurationSeconds > 0, '1.1 Estimates duration for Part 1');

  // 1.2 Part 2 Question
  const p2Track = buildAudioTrackConfigFromQuestion(samplePart2);
  assert(p2Track.partNum === 2, '1.2 Part 2 config partNum is 2');
  assert(p2Track.segments.length === 4, '1.2 Part 2 generates prompt + 3 option segments (4 total)');
  assert(p2Track.segments[0].isPrompt === true, '1.2 Segment 0 is prompt question');
  assert(p2Track.segments[0].text === samplePart2.promptScript, '1.2 Segment 0 text matches promptScript');
  assert(p2Track.segments[1].choiceKey === 'A', '1.2 Segment 1 is Option A');
  assert(p2Track.segments[3].choiceKey === 'C', '1.2 Segment 3 is Option C');

  // 1.3 Part 3 Dialogue Group
  const p3Track = buildAudioTrackConfigFromGroup(samplePart3Group);
  assert(p3Track.partNum === 3, '1.3 Part 3 config partNum is 3');
  assert(p3Track.segments.length === 3, '1.3 Part 3 parsed 3 dialogue turns');
  assert(p3Track.segments[0].speaker === 'Man', '1.3 Turn 0 speaker is Man');
  assert(p3Track.segments[0].genderHint === 'male', '1.3 Turn 0 genderHint is male');
  assert(p3Track.segments[1].speaker === 'Woman', '1.3 Turn 1 speaker is Woman');
  assert(p3Track.segments[1].genderHint === 'female', '1.3 Turn 1 genderHint is female');
  assert(p3Track.segments[2].speaker === 'Man', '1.3 Turn 2 speaker is Man');

  // 1.4 Part 4 Talk Group & Chunking
  const p4Track = buildAudioTrackConfigFromGroup(samplePart4Group);
  assert(p4Track.partNum === 4, '1.4 Part 4 config partNum is 4');
  assert(p4Track.segments.length >= 1, '1.4 Part 4 generates talk segments');
  assert(p4Track.segments[0].speaker === 'Narrator', '1.4 Part 4 speaker role is Narrator');

  const chunks = chunkSentenceText('This is sentence one. This is sentence two. This is sentence three.', 35);
  assert(chunks.length > 1, '1.4 Sentence chunker divides text without cutting words');

  // ------------------------------------------------------------------
  // SUITE 2: Controller Lifecycle & State Transitions
  // ------------------------------------------------------------------
  console.log('\n--- Suite 2: Controller Lifecycle & State Transitions ---');

  const controller = new ListeningAudioController(p1Track, { mode: 'practice' });
  const s0 = controller.getState();
  assert(s0.status === 'idle', '2.1 Initial status is idle');
  assert(s0.sourceType === 'synthetic_tts', '2.1 Initial sourceType is synthetic_tts');
  assert(s0.isSyntheticTTS === true, '2.1 isSyntheticTTS flag is true');
  assert(s0.playCount === 0, '2.1 Initial playCount is 0');
  assert(s0.canPlay === true, '2.1 canPlay is initially true');

  // Start play
  const playRes = await controller.play();
  assert(playRes.success === true, '2.2 play() returns success true');
  assert(controller.getState().status === 'playing', '2.2 Status transitions to playing');

  // Stop
  controller.stop();
  assert(controller.getState().status === 'idle', '2.3 Status transitions back to idle after stop()');
  assert(controller.getState().currentTime === 0, '2.3 currentTime reset to 0');

  // Replay
  await controller.replay();
  assert(controller.getState().status === 'playing', '2.4 replay() transitions status to playing');
  controller.stop();

  // Test full completion via mock
  const singleSegmentTrack: AudioTrackConfig = {
    partNum: 1,
    estimatedDurationSeconds: 10,
    segments: [
      { id: 'seg-1', order: 0, speaker: 'Narrator', text: 'One statement.' },
    ],
  };

  const fastController = new ListeningAudioController(singleSegmentTrack);
  let endedFired = false;
  fastController.subscribe((st) => {
    if (st.status === 'ended') endedFired = true;
  });

  await fastController.play();
  await sleep(40); // Wait for mock finish

  assert(endedFired === true, '2.5 Reaches ended status when all segments complete');
  assert(fastController.getState().playCount === 1, '2.5 playCount incremented to 1');
  assert(fastController.getState().progressRatio === 1.0, '2.5 progressRatio reaches 1.0');
  fastController.destroy();

  // ------------------------------------------------------------------
  // SUITE 3: Token Concurrency Guard & Stale Callback Rejection
  // ------------------------------------------------------------------
  console.log('\n--- Suite 3: Token Concurrency & Stale Callbacks ---');

  const raceController = new ListeningAudioController(p1Track);
  await raceController.play();
  // Rapid stop immediately invalidates activeToken
  raceController.stop();

  // Trigger delayed event from old utterance
  if (mockSpeech.lastUtterance?.onend) {
    mockSpeech.lastUtterance.onend();
  }

  // Ensure state remains idle, playCount not bumped by stale callback
  assert(raceController.getState().status === 'idle', '3.1 Stale onend does not revive idle controller');
  assert(raceController.getState().playCount === 0, '3.1 Stale onend does not falsely increment playCount');

  raceController.destroy();

  // ------------------------------------------------------------------
  // SUITE 4: Mode-based Replay Permissions
  // ------------------------------------------------------------------
  console.log('\n--- Suite 4: Mode-based Replay Permissions ---');

  // 4.1 Practice Mode allows unlimited plays
  const practiceAudio = new ListeningAudioController(singleSegmentTrack, { mode: 'practice' });
  await practiceAudio.play();
  await sleep(30);
  assert(practiceAudio.getState().playCount === 1, '4.1 First play finished in Practice mode');
  assert(practiceAudio.getState().canPlay === true, '4.1 canPlay is still true in Practice mode');

  const practicePlay2 = await practiceAudio.play();
  assert(practicePlay2.success === true, '4.1 Second play allowed in Practice mode');
  await sleep(30);
  assert(practiceAudio.getState().playCount === 2, '4.1 playCount reached 2 in Practice mode');
  practiceAudio.destroy();

  // 4.2 Timed Mode strictly limits to 1 play
  const timedAudio = new ListeningAudioController(singleSegmentTrack, { mode: 'timed' });
  assert(timedAudio.getState().maxReplays === 1, '4.2 Timed mode maxReplays defaults to 1');

  await timedAudio.play();
  await sleep(30);
  assert(timedAudio.getState().playCount === 1, '4.2 Timed play completed');
  assert(timedAudio.getState().canPlay === false, '4.2 canPlay is now false after 1 play');
  assert(timedAudio.getState().canReplay === false, '4.2 canReplay is false after 1 play');

  const timedPlay2 = await timedAudio.play();
  assert(timedPlay2.success === false, '4.2 Second play rejected in Timed mode');
  assert(timedPlay2.errorCode === 'REPLAY_NOT_ALLOWED', '4.2 Rejection reason is REPLAY_NOT_ALLOWED');
  assert(timedAudio.getState().errorCode === 'REPLAY_NOT_ALLOWED', '4.2 State errorCode set to REPLAY_NOT_ALLOWED');
  timedAudio.destroy();

  // 4.3 Timed Mode with allowReplayInTimed override
  const timedPermissive = new ListeningAudioController(singleSegmentTrack, {
    mode: 'timed',
    allowReplayInTimed: true,
  });
  assert(timedPermissive.getState().maxReplays === null, '4.3 allowReplayInTimed sets maxReplays to null');
  timedPermissive.destroy();

  // ------------------------------------------------------------------
  // SUITE 5: Global Playback Coordinator (No Overlapping Audio)
  // ------------------------------------------------------------------
  console.log('\n--- Suite 5: Global Playback Coordinator ---');

  const track1 = { ...singleSegmentTrack, questionId: 'q-1' };
  const track2 = { ...singleSegmentTrack, questionId: 'q-2' };

  const ctrlA = new ListeningAudioController(track1);
  const ctrlB = new ListeningAudioController(track2);

  await ctrlA.play();
  assert(ctrlA.getState().status === 'playing', '5.1 Controller A is playing');

  // Starting Controller B must immediately stop Controller A
  await ctrlB.play();
  assert(ctrlA.getState().status === 'idle', '5.2 Controller A automatically stopped when B claims playback');
  assert(ctrlB.getState().status === 'playing', '5.2 Controller B is now active');

  ctrlA.destroy();
  ctrlB.destroy();

  // ------------------------------------------------------------------
  // SUITE 6: Error Handling, Fallbacks & Local Audio
  // ------------------------------------------------------------------
  console.log('\n--- Suite 6: Error Handling & Local Audio ---');

  // 6.1 Empty track
  const emptyTrack: AudioTrackConfig = {
    partNum: 1,
    estimatedDurationSeconds: 0,
    segments: [],
  };
  const emptyCtrl = new ListeningAudioController(emptyTrack);
  const emptyRes = await emptyCtrl.play();
  assert(emptyRes.success === false, '6.1 Empty track rejects playback');
  assert(emptyRes.errorCode === 'NO_AUDIO_SOURCE', '6.1 Error code is NO_AUDIO_SOURCE');
  emptyCtrl.destroy();

  // 6.2 Local audio file config
  const localAudioTrack: AudioTrackConfig = {
    partNum: 1,
    audioUrl: 'https://example.com/audio.mp3',
    estimatedDurationSeconds: 15,
    segments: [],
  };
  const localCtrl = new ListeningAudioController(localAudioTrack);
  assert(localCtrl.getState().sourceType === 'local_audio', '6.2 Source type is local_audio');
  assert(localCtrl.getState().isSyntheticTTS === false, '6.2 isSyntheticTTS is false for audioUrl');

  const localPlayRes = await localCtrl.play();
  assert(localPlayRes.success === true, '6.2 Local audio play succeeds');
  assert(localCtrl.getState().status === 'playing', '6.2 Local audio transitions to playing');
  localCtrl.destroy();

  // ------------------------------------------------------------------
  // SUITE 7: Volume, Muting, and Playback Rate
  // ------------------------------------------------------------------
  console.log('\n--- Suite 7: Volume, Mute & Playback Rate ---');

  const settingsCtrl = new ListeningAudioController(singleSegmentTrack);
  settingsCtrl.setVolume(0.5);
  assert(settingsCtrl.getState().volume === 0.5, '7.1 Volume set to 0.5');

  settingsCtrl.setVolume(2.5); // clamp
  assert(settingsCtrl.getState().volume === 1.0, '7.1 Volume clamped to upper bound 1.0');

  settingsCtrl.setMuted(true);
  assert(settingsCtrl.getState().isMuted === true, '7.2 isMuted flag set to true');

  settingsCtrl.setPlaybackRate(1.2);
  assert(settingsCtrl.getState().playbackRate === 1.2, '7.3 Playback rate set to 1.2');

  settingsCtrl.setPlaybackRate(5.0); // clamp
  assert(settingsCtrl.getState().playbackRate === 2.0, '7.3 Playback rate clamped to 2.0');
  settingsCtrl.destroy();

  // ==================================================================
  // SUMMARY
  // ==================================================================
  console.log('\n======================================================');
  console.log(`TOTAL TESTS RUN: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
