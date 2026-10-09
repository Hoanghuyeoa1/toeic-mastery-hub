/**
 * Targeted Validation Tests for TOEIC Mastery Hub Question Bank Foundation
 * Tests schema constraints, invalid cases, group cardinality, and cross-entity linkage.
 */

import {
  validateQuestion,
  validateQuestionGroup,
  validateQuestionBank
} from '../questionBankValidator';
import {
  Part1Question,
  Part2Question,
  Part3Question,
  Part4Question,
  Part5Question,
  Part3Group,
  Part6Group,
  Part7Group
} from '../../types/questionBank';
import {
  ALL_LISTENING_QUESTIONS,
  ALL_LISTENING_GROUPS,
  PART1_QUESTIONS,
  PART2_QUESTIONS,
  PART3_QUESTIONS,
  PART3_GROUPS,
  PART4_QUESTIONS,
  PART4_GROUPS,
  LISTENING_BANK_STATS
} from '../../data/questionBank/listeningBank';
import {
  ALL_READING_QUESTIONS,
  ALL_READING_GROUPS,
  PART5_QUESTIONS,
  PART6_QUESTIONS,
  PART6_GROUPS,
  PART7_QUESTIONS,
  PART7_GROUPS,
  READING_BANK_STATS
} from '../../data/questionBank/readingBank';
import {
  ALL_QUESTIONS,
  ALL_GROUPS,
  FULL_BANK_STATS
} from '../../data/questionBank';
import { LISTENING_ILLUSTRATIONS } from '../../components/Diagnostic/listeningIllustrationsMap';

// Lightweight assertion runner
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName}${detail ? ` - ${detail}` : ''}`);
  }
}

console.log('\n======================================================');
console.log('🧪 RUNNING QUESTION BANK FOUNDATION VALIDATION TESTS');
console.log('======================================================\n');

// ---------------------------------------------------------------------------
// SUITE 1: QUESTION SCHEMA VALIDATION (PARTS 1 - 7)
// ---------------------------------------------------------------------------
console.log('--- Suite 1: Question Schemas (Valid & Invalid Cases) ---');

// 1.1 Valid Part 1
const validPart1: Part1Question = {
  id: 'q-p1-test-01',
  partNum: 1,
  part: 'Part 1',
  section: 'listening',
  difficulty: 'medium',
  topic: 'Office',
  explanation: 'Người phụ nữ đang cầm hồ sơ và đứng cạnh tủ tài liệu.',
  skillTag: 'Part 1: Hành động người',
  media: {
    visual: { illustrationId: 'office_woman_photo' },
    audio: { audioScript: 'She is examining a folder.' },
  },
  question: 'Chọn câu miêu tả đúng nhất cho bức tranh:',
  options: [
    { key: 'A', text: 'She is assembling office furniture.' },
    { key: 'B', text: 'She is examining a folder.' },
    { key: 'C', text: 'Files are being discarded.' },
    { key: 'D', text: 'She is typing on a keyboard.' },
  ],
  correctKey: 'B',
};
const repP1 = validateQuestion(validPart1);
assert(repP1.isValid && repP1.errors.length === 0, '1.1 Valid Part 1 question passes validation');

// 1.2 Invalid Part 1 (Missing visual media)
const invalidP1NoVisual = {
  ...validPart1,
  id: 'q-p1-err-01',
  media: { audio: { audioScript: 'Statement text' } },
};
const repP1NoVisual = validateQuestion(invalidP1NoVisual);
assert(
  !repP1NoVisual.isValid && repP1NoVisual.errors.some(e => e.code === 'PART1_MISSING_VISUAL'),
  '1.2 Part 1 fails when visual media is missing'
);

// 1.3 Valid Part 2 (Strictly 3 options A-C)
const validPart2: Part2Question = {
  id: 'q-p2-test-01',
  partNum: 2,
  part: 'Part 2',
  section: 'listening',
  difficulty: 'easy',
  topic: 'Office',
  explanation: 'Đáp án B trả lời trực tiếp cho câu hỏi Where.',
  skillTag: 'Part 2: Wh- Question',
  promptScript: 'Where should I submit the expense report?',
  media: {
    audio: { audioScript: 'Where should I submit the expense report?' },
  },
  question: 'Chọn câu phản hồi phù hợp nhất:',
  options: [
    { key: 'A', text: 'Yes, it was expensive.' },
    { key: 'B', text: 'Send it to accounting on the 3rd floor.' },
    { key: 'C', text: 'I submitted my application yesterday.' },
  ],
  correctKey: 'B',
};
const repP2 = validateQuestion(validPart2);
assert(repP2.isValid && repP2.errors.length === 0, '1.3 Valid Part 2 with exactly 3 options (A, B, C) passes');

// 1.4 Invalid Part 2: Has 4 options (Must be rejected in Part 2!)
const invalidP2With4Options = {
  ...validPart2,
  id: 'q-p2-err-01',
  options: [
    { key: 'A', text: 'Yes, it was expensive.' },
    { key: 'B', text: 'Send it to accounting on the 3rd floor.' },
    { key: 'C', text: 'I submitted my application yesterday.' },
    { key: 'D', text: 'Invalid fourth option for Part 2.' },
  ],
};
const repP2FourOptions = validateQuestion(invalidP2With4Options);
assert(
  !repP2FourOptions.isValid && repP2FourOptions.errors.some(e => e.code === 'PART2_INVALID_CHOICE_COUNT'),
  '1.4 Part 2 strictly rejects 4 choices (only 3 allowed)'
);

// 1.5 Invalid Part 2: Has correctKey 'D'
const invalidP2KeyD = {
  ...validPart2,
  id: 'q-p2-err-02',
  correctKey: 'D' as any,
};
const repP2KeyD = validateQuestion(invalidP2KeyD);
assert(
  !repP2KeyD.isValid && repP2KeyD.errors.some(e => e.code === 'PART2_INVALID_CORRECT_KEY'),
  '1.5 Part 2 strictly rejects correctKey outside A, B, C'
);

// 1.6 Valid Part 5 (Standalone text-only)
const validPart5: Part5Question = {
  id: 'q-p5-test-01',
  partNum: 5,
  part: 'Part 5',
  section: 'reading',
  difficulty: 'medium',
  topic: 'Finance',
  explanation: 'Cần trạng từ bổ nghĩa cho tính từ beneficial -> chọn mutually.',
  skillTag: 'Part 5: Từ loại (Adverb modifying Adjective)',
  sentence: 'The merger will prove ------ beneficial for both corporations.',
  grammarCategory: 'Parts of Speech',
  options: [
    { key: 'A', text: 'mutual' },
    { key: 'B', text: 'mutually' },
    { key: 'C', text: 'mutuality' },
    { key: 'D', text: 'mutualize' },
  ],
  correctKey: 'B',
};
const repP5 = validateQuestion(validPart5);
assert(repP5.isValid, '1.6 Valid Part 5 standalone question passes');

// 1.7 Invalid Part 5: Missing sentence
const invalidP5NoSentence = {
  ...validPart5,
  id: 'q-p5-err-01',
  sentence: '',
};
const repP5NoSentence = validateQuestion(invalidP5NoSentence);
assert(
  !repP5NoSentence.isValid && repP5NoSentence.errors.some(e => e.code === 'PART5_MISSING_SENTENCE'),
  '1.7 Part 5 rejects question missing sentence'
);

// 1.8 Empty choice text rejected
const invalidEmptyOptionText = {
  ...validPart5,
  id: 'q-p5-err-02',
  options: [
    { key: 'A', text: 'mutual' },
    { key: 'B', text: '   ' }, // whitespace only
    { key: 'C', text: 'mutuality' },
    { key: 'D', text: 'mutualize' },
  ],
};
const repEmptyOption = validateQuestion(invalidEmptyOptionText);
assert(
  !repEmptyOption.isValid && repEmptyOption.errors.some(e => e.code === 'EMPTY_OPTION_TEXT'),
  '1.8 Rejects empty or whitespace choice text'
);

// 1.9 CorrectKey not in choices
const invalidMismatchedCorrectKey = {
  ...validPart5,
  id: 'q-p5-err-03',
  correctKey: 'D' as any,
  options: [
    { key: 'A', text: 'mutual' },
    { key: 'B', text: 'mutually' },
    { key: 'C', text: 'mutuality' },
    { key: 'X', text: 'invalid key' }, // key X instead of D
  ],
};
const repMismatchedKey = validateQuestion(invalidMismatchedCorrectKey);
assert(
  !repMismatchedKey.isValid && repMismatchedKey.errors.some(e => e.code === 'INVALID_OPTION_KEYS'),
  '1.9 Rejects invalid option keys'
);

// ---------------------------------------------------------------------------
// SUITE 2: QUESTION GROUP INTEGRITY & CARDINALITY
// ---------------------------------------------------------------------------
console.log('\n--- Suite 2: Question Group Integrity & Cardinality ---');

// 2.1 Valid Part 3 Group (Exactly 3 questions)
const validPart3Group: Part3Group = {
  id: 'grp-p3-01',
  groupType: 'part3_conversation',
  partNum: 3,
  difficulty: 'medium',
  topic: 'Logistics',
  contextIntro: 'Questions 32-34 refer to the following conversation.',
  media: {
    audio: { audioScript: 'Man: Did the replacement parts arrive? Woman: No, the truck broke down.' },
  },
  questionIds: ['q-p3-01', 'q-p3-02', 'q-p3-03'],
};
const repGrpP3 = validateQuestionGroup(validPart3Group);
assert(repGrpP3.isValid, '2.1 Valid Part 3 group with exactly 3 questions passes');

// 2.2 Invalid Part 3 Group: 2 questions (TOEIC requires exactly 3)
const invalidPart3Group2Q: Partial<Part3Group> = {
  ...validPart3Group,
  id: 'grp-p3-err-01',
  questionIds: ['q-p3-01', 'q-p3-02'] as any,
};
const repGrpP32Q = validateQuestionGroup(invalidPart3Group2Q);
assert(
  !repGrpP32Q.isValid && repGrpP32Q.errors.some(e => e.code === 'PART3_QUESTION_COUNT_MISMATCH'),
  '2.2 Part 3 group rejects count other than 3 questions'
);

// 2.3 Valid Part 6 Group (Exactly 4 questions)
const validPart6Group: Part6Group = {
  id: 'grp-p6-01',
  groupType: 'part6_text_completion',
  partNum: 6,
  difficulty: 'medium',
  topic: 'Corporate Memo',
  passageType: 'memo',
  passageTitle: 'Annual Performance Reviews',
  passageContent: 'Please note that reviews will begin [131] next month. All staff must [132] their forms by Friday. [133]. We look forward to your [134].',
  questionIds: ['q-p6-01', 'q-p6-02', 'q-p6-03', 'q-p6-04'],
};
const repGrpP6 = validateQuestionGroup(validPart6Group);
assert(repGrpP6.isValid, '2.3 Valid Part 6 group with exactly 4 questions passes');

// 2.4 Invalid Part 6 Group: 3 questions
const invalidPart6Group3Q: Partial<Part6Group> = {
  ...validPart6Group,
  id: 'grp-p6-err-01',
  questionIds: ['q-p6-01', 'q-p6-02', 'q-p6-03'] as any,
};
const repGrpP63Q = validateQuestionGroup(invalidPart6Group3Q);
assert(
  !repGrpP63Q.isValid && repGrpP63Q.errors.some(e => e.code === 'PART6_QUESTION_COUNT_MISMATCH'),
  '2.4 Part 6 group rejects count other than 4 questions'
);

// 2.5 Valid Part 7 Single Passage Group (3 questions, 1 passage)
const validPart7Single: Part7Group = {
  id: 'grp-p7-single-01',
  groupType: 'part7_reading_comprehension',
  partNum: 7,
  difficulty: 'medium',
  topic: 'Job Advertisement',
  passageFormat: 'single',
  passages: [
    {
      id: 'p7-pass-01',
      formatType: 'advertisement',
      title: 'Senior Marketing Director Opening',
      content: 'Apex Corp is seeking an experienced Director of Global Marketing...',
    },
  ],
  questionIds: ['q-p7-01', 'q-p7-02', 'q-p7-03'],
};
const repGrpP7Single = validateQuestionGroup(validPart7Single);
assert(repGrpP7Single.isValid, '2.5 Valid Part 7 single passage group (1 passage, 3 questions) passes');

// 2.6 Invalid Part 7 Single Passage: 5 questions (Single passage only supports 2-4)
const invalidPart7Single5Q: Part7Group = {
  ...validPart7Single,
  id: 'grp-p7-single-err',
  questionIds: ['q-p7-01', 'q-p7-02', 'q-p7-03', 'q-p7-04', 'q-p7-05'],
};
const repGrpP7Single5Q = validateQuestionGroup(invalidPart7Single5Q);
assert(
  !repGrpP7Single5Q.isValid && repGrpP7Single5Q.errors.some(e => e.code === 'PART7_SINGLE_QUESTION_COUNT'),
  '2.6 Part 7 single passage rejects 5 questions (max 4 allowed in ETS format)'
);

// 2.7 Valid Part 7 Double Passage Group (5 questions, 2 passages)
const validPart7Double: Part7Group = {
  id: 'grp-p7-double-01',
  groupType: 'part7_reading_comprehension',
  partNum: 7,
  difficulty: 'hard',
  topic: 'Conference & Email Feedback',
  passageFormat: 'double',
  passages: [
    {
      id: 'p7-d-pass-01',
      formatType: 'schedule',
      title: 'Conference Agenda',
      content: 'Keynote starts at 9:00 AM...',
    },
    {
      id: 'p7-d-pass-02',
      formatType: 'email',
      title: 'Feedback on Morning Session',
      content: 'I attended the keynote but could not find the workshop room...',
    },
  ],
  questionIds: ['q-p7-04', 'q-p7-05', 'q-p7-06', 'q-p7-07', 'q-p7-08'],
};
const repGrpP7Double = validateQuestionGroup(validPart7Double);
assert(repGrpP7Double.isValid, '2.7 Valid Part 7 double passage group (2 passages, 5 questions) passes');

// 2.8 Invalid Part 7 Double Passage: Only 1 passage provided
const invalidPart7Double1Pass: Part7Group = {
  ...validPart7Double,
  id: 'grp-p7-double-err',
  passages: [validPart7Double.passages[0]],
};
const repGrpP7Double1Pass = validateQuestionGroup(invalidPart7Double1Pass);
assert(
  !repGrpP7Double1Pass.isValid && repGrpP7Double1Pass.errors.some(e => e.code === 'PART7_DOUBLE_PASSAGE_MISMATCH'),
  '2.8 Part 7 double passage rejects having only 1 passage'
);

// 2.9 Valid Part 7 Triple Passage Group (5 questions, 3 passages)
const validPart7Triple: Part7Group = {
  id: 'grp-p7-triple-01',
  groupType: 'part7_reading_comprehension',
  partNum: 7,
  difficulty: 'hard',
  topic: 'Supplier Invoicing & Delivery',
  passageFormat: 'triple',
  passages: [
    { id: 'p7-t-01', formatType: 'email', content: 'Purchase Order #4812 inquiry' },
    { id: 'p7-t-02', formatType: 'form', content: 'Invoice breakdown and itemized cost' },
    { id: 'p7-t-03', formatType: 'notice', content: 'Shipping policy regarding customs delays' },
  ],
  questionIds: ['q-p7-09', 'q-p7-10', 'q-p7-11', 'q-p7-12', 'q-p7-13'],
};
const repGrpP7Triple = validateQuestionGroup(validPart7Triple);
assert(repGrpP7Triple.isValid, '2.9 Valid Part 7 triple passage group (3 passages, 5 questions) passes');

// 2.10 Duplicate Question ID inside Group
const invalidGrpDuplicateQIds: Part3Group = {
  ...validPart3Group,
  id: 'grp-p3-dup-01',
  questionIds: ['q-p3-01', 'q-p3-01', 'q-p3-03'], // Duplicate q-p3-01
};
const repGrpDup = validateQuestionGroup(invalidGrpDuplicateQIds);
assert(
  !repGrpDup.isValid && repGrpDup.errors.some(e => e.code === 'DUPLICATE_QUESTION_ID_IN_GROUP'),
  '2.10 Rejects duplicate question IDs inside group'
);

// ---------------------------------------------------------------------------
// SUITE 3: QUESTION BANK FULL INTEGRITY & TWO-WAY LINKAGES
// ---------------------------------------------------------------------------
console.log('\n--- Suite 3: Bank Integrity & Cross-Entity Linkages ---');

// Build connected set of questions for validPart3Group
const qP3_1: Part3Question = {
  id: 'q-p3-01',
  partNum: 3,
  part: 'Part 3',
  section: 'listening',
  difficulty: 'medium',
  topic: 'Logistics',
  explanation: 'Người phụ nữ nói xe bị hỏng -> hàng bị chậm.',
  skillTag: 'Part 3: Nhận diện vấn đề',
  groupId: 'grp-p3-01',
  orderInGroup: 1,
  question: 'What problem does the woman mention?',
  options: [
    { key: 'A', text: 'A worker is late.' },
    { key: 'B', text: 'A shipment has been delayed.' },
    { key: 'C', text: 'The warehouse is full.' },
    { key: 'D', text: 'An item was damaged.' },
  ],
  correctKey: 'B',
};

const qP3_2: Part3Question = {
  id: 'q-p3-02',
  partNum: 3,
  part: 'Part 3',
  section: 'listening',
  difficulty: 'medium',
  topic: 'Logistics',
  explanation: 'Người đàn ông nói sẽ gọi quản lý kho ngay.',
  skillTag: 'Part 3: Hành động tiếp theo',
  groupId: 'grp-p3-01',
  orderInGroup: 2,
  question: 'What will the man do next?',
  options: [
    { key: 'A', text: 'Repair the belt.' },
    { key: 'B', text: 'Contact the warehouse manager.' },
    { key: 'C', text: 'Cancel the order.' },
    { key: 'D', text: 'Drive to Route 9.' },
  ],
  correctKey: 'B',
};

const qP3_3: Part3Question = {
  id: 'q-p3-03',
  partNum: 3,
  part: 'Part 3',
  section: 'listening',
  difficulty: 'medium',
  topic: 'Logistics',
  explanation: 'Hạn chót cần máy chạy là 2 giờ chiều.',
  skillTag: 'Part 3: Chi tiết thời gian',
  groupId: 'grp-p3-01',
  orderInGroup: 3,
  question: 'When must the assembly line resume operation?',
  options: [
    { key: 'A', text: 'By 10 AM.' },
    { key: 'B', text: 'By noon.' },
    { key: 'C', text: 'By 2 PM.' },
    { key: 'D', text: 'Tomorrow morning.' },
  ],
  correctKey: 'C',
};

// 3.1 Valid Bank (Part 1, Part 2, Part 5 + Part 3 with Group)
const validBank = {
  questions: [validPart1, validPart2, validPart5, qP3_1, qP3_2, qP3_3],
  groups: [validPart3Group],
};
const repBankValid = validateQuestionBank(validBank);
assert(
  repBankValid.isValid && repBankValid.errors.length === 0,
  '3.1 Complete Question Bank with mixed standalone and grouped questions passes'
);

// 3.2 Duplicate Question IDs in Bank
const bankWithDuplicateQ = {
  questions: [validPart1, { ...validPart5, id: validPart1.id }],
  groups: [],
};
const repDupQ = validateQuestionBank(bankWithDuplicateQ);
assert(
  !repDupQ.isValid && repDupQ.errors.some(e => e.code === 'DUPLICATE_QUESTION_ID'),
  '3.2 Duplicate Question IDs across bank are detected and rejected'
);

// 3.3 Orphan Question (references non-existent groupId)
const orphanQ: Part3Question = {
  ...qP3_1,
  id: 'q-p3-orphan',
  groupId: 'non-existent-grp-id',
};
const bankWithOrphanQ = {
  questions: [orphanQ],
  groups: [],
};
const repOrphanQ = validateQuestionBank(bankWithOrphanQ);
assert(
  !repOrphanQ.isValid && repOrphanQ.errors.some(e => e.code === 'ORPHAN_QUESTION_GROUP_REF'),
  '3.3 Question referencing non-existent groupId is rejected as orphan'
);

// 3.4 Orphan Group (group references non-existent questionId)
const bankWithOrphanGroup = {
  questions: [qP3_1, qP3_2], // Missing q-p3-03
  groups: [validPart3Group],
};
const repOrphanGroup = validateQuestionBank(bankWithOrphanGroup);
assert(
  !repOrphanGroup.isValid && repOrphanGroup.errors.some(e => e.code === 'ORPHAN_GROUP_QUESTION_REF'),
  '3.4 Group referencing non-existent questionId is rejected'
);

// 3.5 Two-way link mismatch (Question groupId != Group id)
const mismatchedLinkQ: Part3Question = {
  ...qP3_3,
  id: 'q-p3-03',
  groupId: 'some-other-group',
};
const bankWithMismatch = {
  questions: [qP3_1, qP3_2, mismatchedLinkQ],
  groups: [validPart3Group], // validPart3Group id is 'grp-p3-01'
};
const repMismatch = validateQuestionBank(bankWithMismatch);
assert(
  !repMismatch.isValid && repMismatch.errors.some(e => e.code === 'GROUP_LINK_MISMATCH'),
  '3.5 Two-way group linkage mismatch is caught and rejected'
);

// 3.6 Part number mismatch (Group is Part 3, referenced Question is Part 4)
const partMismatchQ: Part4Question = {
  id: 'q-p3-03',
  partNum: 4,
  part: 'Part 4',
  section: 'listening',
  difficulty: 'medium',
  topic: 'Logistics',
  explanation: 'Explanation',
  skillTag: 'Part 4',
  groupId: 'grp-p3-01',
  orderInGroup: 3,
  question: 'Part 4 question erroneously linked to Part 3 group',
  options: [
    { key: 'A', text: 'A' },
    { key: 'B', text: 'B' },
    { key: 'C', text: 'C' },
    { key: 'D', text: 'D' },
  ],
  correctKey: 'A',
};
const bankWithPartMismatch = {
  questions: [qP3_1, qP3_2, partMismatchQ as any],
  groups: [validPart3Group],
};
const repPartMismatch = validateQuestionBank(bankWithPartMismatch);
assert(
  !repPartMismatch.isValid && repPartMismatch.errors.some(e => e.code === 'GROUP_PART_MISMATCH'),
  '3.6 Part number discrepancy between question and group is rejected'
);

// ---------------------------------------------------------------------------
// SUITE 4: PRODUCTION LISTENING BANK VALIDATION (PARTS 1-4)
// ---------------------------------------------------------------------------
console.log('\n--- Suite 4: Production Listening Bank (104 Questions, 23 Groups) ---');

// 4.1 Whole Bank Validation
const listeningBankReport = validateQuestionBank({
  questions: ALL_LISTENING_QUESTIONS,
  groups: ALL_LISTENING_GROUPS,
});
assert(
  listeningBankReport.isValid && listeningBankReport.errors.length === 0,
  '4.1 Full Listening Bank passes validation with 0 errors'
);
if (listeningBankReport.errors.length > 0) {
  console.error('Validation errors found in Listening Bank:', listeningBankReport.errors);
}

// 4.2 Total counts meet and satisfy the >= 55 question requirement (expanded to 104)
assert(
  LISTENING_BANK_STATS.totalQuestions >= 55 && LISTENING_BANK_STATS.totalQuestions === 104,
  `4.2 Total listening question count satisfies requirement (expected 104, got ${LISTENING_BANK_STATS.totalQuestions})`
);
assert(
  LISTENING_BANK_STATS.totalGroups === 23,
  `4.3 Total listening group count is exactly 23 (expected 23, got ${LISTENING_BANK_STATS.totalGroups})`
);

// 4.3 Part 1 Specifications (10 questions, each with visual illustrationId and audioScript)
const part1Valid = PART1_QUESTIONS.length === 10 && PART1_QUESTIONS.every(q => {
  return q.partNum === 1 &&
    Boolean(q.media.visual.illustrationId) &&
    Boolean(q.media.audio.audioScript) &&
    q.options.length === 4 &&
    ['A', 'B', 'C', 'D'].includes(q.correctKey);
});
assert(part1Valid, '4.4 Part 1 has 10 valid questions with SVG illustrationId and audio scripts');

// 4.4 Part 2 Specifications (25 questions, strictly 3 options A-C)
const part2Valid = PART2_QUESTIONS.length === 25 && PART2_QUESTIONS.every(q => {
  return q.partNum === 2 &&
    q.options.length === 3 &&
    q.options.map(o => o.key).join('') === 'ABC' &&
    ['A', 'B', 'C'].includes(q.correctKey) &&
    Boolean(q.promptScript) &&
    Boolean(q.media.audio.audioScript);
});
assert(part2Valid, '4.5 Part 2 has 25 valid questions with strictly 3 options (A, B, C) and prompt scripts');

// 4.5 Part 3 Specifications (13 groups × 3 questions = 39 questions)
const part3Valid = PART3_GROUPS.length === 13 &&
  PART3_QUESTIONS.length === 39 &&
  PART3_GROUPS.every(g => g.questionIds.length === 3 && Boolean(g.media.audio.audioScript));
assert(part3Valid, '4.6 Part 3 has 13 conversation groups with exactly 3 questions each (39 questions total)');

// 4.6 Part 4 Specifications (10 groups × 3 questions = 30 questions)
const part4Valid = PART4_GROUPS.length === 10 &&
  PART4_QUESTIONS.length === 30 &&
  PART4_GROUPS.every(g => g.questionIds.length === 3 && Boolean(g.media.audio.audioScript));
assert(part4Valid, '4.7 Part 4 has 10 talk groups with exactly 3 questions each (30 questions total)');

// 4.7 Graphic context verification in Part 3 and Part 4
const part3HasGraphic = PART3_GROUPS.some(g => Boolean(g.media.graphic?.illustrationId));
const part4HasGraphic = PART4_GROUPS.some(g => Boolean(g.media.graphic?.illustrationId));
assert(
  part3HasGraphic && part4HasGraphic,
  '4.8 Graphic context questions verified in Part 3 (Flight Schedule) and Part 4 (Store Directory)'
);

// 4.9 Real SVG asset linkage verification (Part 1 photos + Part 3/4 graphics)
const registeredKeys = Object.keys(LISTENING_ILLUSTRATIONS);
const part1IllustrationsExist = PART1_QUESTIONS.every(
  q => registeredKeys.includes(q.media.visual.illustrationId)
);
const part3GraphicExists = PART3_GROUPS
  .filter(g => g.media.graphic?.illustrationId)
  .every(g => registeredKeys.includes(g.media.graphic!.illustrationId));
const part4GraphicExists = PART4_GROUPS
  .filter(g => g.media.graphic?.illustrationId)
  .every(g => registeredKeys.includes(g.media.graphic!.illustrationId));

assert(
  part1IllustrationsExist && part3GraphicExists && part4GraphicExists,
  '4.9 All 12 illustration and graphic IDs resolve to genuine SVG components in LISTENING_ILLUSTRATIONS'
);

// ===========================================================================
// SUITE 5: PRODUCTION READING BANK (100 Questions, 19 Groups)
// ===========================================================================
console.log('\n--- Suite 5: Production Reading Bank (100 Questions, 19 Groups) ---');

// 5.1 Validate full Reading Bank
const readingBankReport = validateQuestionBank(ALL_READING_QUESTIONS, ALL_READING_GROUPS);
assert(
  readingBankReport.isValid && readingBankReport.errors.length === 0,
  '5.1 Full Reading Bank passes validation with 0 errors'
);
if (!readingBankReport.isValid) {
  console.error('Validation errors found in Reading Bank:', readingBankReport.errors);
}

// 5.2 Reading question count satisfies requirement (100 questions)
assert(
  READING_BANK_STATS.totalQuestions >= 56 && READING_BANK_STATS.totalQuestions === 100,
  `5.2 Total reading question count satisfies requirement (expected 100, got ${READING_BANK_STATS.totalQuestions})`
);

// 5.3 Reading group count is exactly 19 (4 in Part 6, 15 in Part 7)
assert(
  READING_BANK_STATS.totalGroups === 19,
  `5.3 Total reading group count is exactly 19 (expected 19, got ${READING_BANK_STATS.totalGroups})`
);

// 5.4 Part 5 Specifications (30 questions, sentence with blank, 4 options A-D)
const part5Valid = PART5_QUESTIONS.length === 30 && PART5_QUESTIONS.every(q => {
  return q.partNum === 5 &&
    Boolean(q.sentence && q.sentence.includes('_____')) &&
    q.options.length === 4 &&
    q.options.map(o => o.key).join('') === 'ABCD' &&
    ['A', 'B', 'C', 'D'].includes(q.correctKey) &&
    Boolean(q.grammarCategory) &&
    Boolean(q.explanation);
});
assert(part5Valid, '5.4 Part 5 has 30 valid questions with sentence blanks, 4 choices, and grammar categories');

// 5.5 Part 6 Specifications (4 groups × 4 questions = 16 questions)
const part6Valid = PART6_GROUPS.length === 4 &&
  PART6_QUESTIONS.length === 16 &&
  PART6_GROUPS.every(g => g.questionIds.length === 4 && Boolean(g.passageContent)) &&
  PART6_QUESTIONS.every(q => q.partNum === 6 && [1, 2, 3, 4].includes(q.orderInGroup) && q.blankNumber > 0);
assert(part6Valid, '5.5 Part 6 has 4 text completion groups with exactly 4 questions each (16 questions total)');

// 5.6 Part 7 Specifications (15 groups, 54 questions total)
const part7Valid = PART7_GROUPS.length === 15 &&
  PART7_QUESTIONS.length === 54 &&
  PART7_GROUPS.every(g => Array.isArray(g.passages) && g.passages.length > 0) &&
  PART7_QUESTIONS.every(q => q.partNum === 7 && q.orderInGroup >= 1 && q.orderInGroup <= 5);
assert(part7Valid, '5.6 Part 7 has 15 reading comprehension groups with exactly 54 questions total');

// 5.7 Part 7 Format Diversity (Single, Double, Triple passages)
const singlePassageGroups = PART7_GROUPS.filter(g => g.passageFormat === 'single');
const doublePassageGroups = PART7_GROUPS.filter(g => g.passageFormat === 'double');
const triplePassageGroups = PART7_GROUPS.filter(g => g.passageFormat === 'triple');
const formatDiversityValid = singlePassageGroups.length === 10 &&
  doublePassageGroups.length === 2 &&
  doublePassageGroups.every(g => g.passages.length === 2 && g.questionIds.length === 5) &&
  triplePassageGroups.length === 3 &&
  triplePassageGroups.every(g => g.passages.length === 3 && g.questionIds.length === 5);
assert(
  formatDiversityValid,
  '5.7 Part 7 formats verified: 10 Single (29 Qs), 2 Double (2 passages each, 10 Qs), 3 Triple (3 passages each, 15 Qs)'
);

// 5.8 Multi-passage cross-text synthesis questions exist
const crossTextQuestions = PART7_QUESTIONS.filter(q => q.crossTextReference === true);
assert(
  crossTextQuestions.length >= 5,
  `5.8 Multi-passage cross-text synthesis questions verified (found ${crossTextQuestions.length} cross-text items)`
);

// ===========================================================================
// SUITE 6: FULL 7-PART QUESTION BANK INTEGRATION (204 Questions, 42 Groups)
// ===========================================================================
console.log('\n--- Suite 6: Full 7-Part Question Bank Integration (204 Questions, 42 Groups) ---');

// 6.1 Validate full 7-Part Question Bank
const fullBankReport = validateQuestionBank(ALL_QUESTIONS, ALL_GROUPS);
assert(
  fullBankReport.isValid && fullBankReport.errors.length === 0,
  '6.1 Full 7-Part Question Bank passes validation with 0 errors'
);
if (!fullBankReport.isValid) {
  console.error('Validation errors found in Full Question Bank:', fullBankReport.errors);
}

// 6.2 Overall Question and Group Counts meet and exceed minimums
assert(
  FULL_BANK_STATS.totalQuestions >= 111 && FULL_BANK_STATS.totalQuestions === 204,
  `6.2 Total question count satisfies requirement (expected 204, got ${FULL_BANK_STATS.totalQuestions})`
);
assert(
  FULL_BANK_STATS.totalGroups >= 19 && FULL_BANK_STATS.totalGroups === 42,
  `6.3 Total group count satisfies requirement (expected 42, got ${FULL_BANK_STATS.totalGroups})`
);

// 6.4 Global ID Uniqueness across all 204 questions
const allQIds = ALL_QUESTIONS.map(q => q.id);
const uniqueQIds = new Set(allQIds);
assert(
  uniqueQIds.size === 204 && uniqueQIds.size === allQIds.length,
  '6.4 All 204 Question IDs are globally unique across the entire Question Bank'
);

// 6.5 Global ID Uniqueness across all 42 groups
const allGIds = ALL_GROUPS.map(g => g.id);
const uniqueGIds = new Set(allGIds);
assert(
  uniqueGIds.size === 42 && uniqueGIds.size === allGIds.length,
  '6.5 All 42 Group IDs are globally unique across the entire Question Bank'
);

// 6.6 Zero orphan questions and zero orphan groups
const allGroupIdsSet = new Set(ALL_GROUPS.map(g => g.id));
const groupedQuestionsValid = ALL_QUESTIONS
  .filter(q => q.groupId !== undefined)
  .every(q => allGroupIdsSet.has(q.groupId!));
const groupReferencedQuestionsValid = ALL_GROUPS.every(g =>
  g.questionIds.every(qId => uniqueQIds.has(qId))
);
assert(
  groupedQuestionsValid && groupReferencedQuestionsValid,
  '6.6 Zero orphan entities: 100% two-way linkages between questions and groups resolved'
);

// 6.7 Difficulty distribution spans easy, medium, and hard
const { easy, medium, hard } = FULL_BANK_STATS.difficultyDistribution;
assert(
  easy > 0 && medium > 0 && hard > 0,
  `6.7 Difficulty distribution verified across 7 parts (Easy: ${easy}, Medium: ${medium}, Hard: ${hard})`
);

// 6.8 Topic coverage verified across all 111 questions
const allTopics = ALL_QUESTIONS.map(q => q.topic);
const uniqueTopics = new Set(allTopics);
assert(
  uniqueTopics.size >= 15 && allTopics.every(t => t.trim().length > 0),
  `6.8 Rich topic diversity verified (${uniqueTopics.size} distinct real-world workplace topics)`
);

// ---------------------------------------------------------------------------
// SUMMARY REPORT
// ---------------------------------------------------------------------------
console.log('\n======================================================');
console.log(`TOTAL TESTS RUN: ${passedTests + failedTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
