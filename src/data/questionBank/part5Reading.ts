import { Part5Question } from '../../types/questionBank';

/**
 * TOEIC Part 5: Incomplete Sentences (30 Authentic Items)
 * Covers Word Forms, Verb Tenses, Prepositions, Conjunctions, Pronouns, Conditionals, Gerunds, Comparisons, and Business Vocabulary.
 */
export const PART5_QUESTIONS: Part5Question[] = [
  // 1. Word Form - Adverb modifying Adjective
  {
    id: 'q-p5-001',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'easy',
    topic: 'Software & Technology',
    skillTag: 'Part 5: Word Form - Trạng từ bổ nghĩa tính từ',
    grammarCategory: 'Word Form - Adverb',
    sentence: 'The updated inventory software is _____ easy to navigate, even for newly hired warehouse assistants.',
    options: [
      { key: 'A', text: 'remark' },
      { key: 'B', text: 'remarkable' },
      { key: 'C', text: 'remarkably' },
      { key: 'D', text: 'remarked' },
    ],
    correctKey: 'C',
    explanation:
      'Chỗ trống đứng trước tính từ "easy" để bổ nghĩa cho tính từ đó, vì vậy cần một trạng từ (adverb). "Remarkably" (đáng kể, rất) là trạng từ duy nhất trong 4 phương án. Các phương án còn lại: (A) danh từ/động từ, (B) tính từ, (D) động từ dạng quá khứ.',
  },

  // 2. Verb Tense - Present Perfect with "since"
  {
    id: 'q-p5-002',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'medium',
    topic: 'Human Resources',
    skillTag: 'Part 5: Verb Tenses - Thì hiện tại hoàn thành',
    grammarCategory: 'Verb Tenses - Present Perfect',
    sentence: 'Ms. Tanaka _____ as the director of regional operations since the merger was finalized last November.',
    options: [
      { key: 'A', text: 'serves' },
      { key: 'B', text: 'has served' },
      { key: 'C', text: 'was serving' },
      { key: 'D', text: 'will serve' },
    ],
    correctKey: 'B',
    explanation:
      'Mệnh đề sau có "since + mốc thời gian trong quá khứ" (since the merger was finalized...), dấu hiệu đặc trưng của thì hiện tại hoàn thành (Present Perfect) diễn tả hành động bắt đầu từ quá khứ và vẫn tiếp diễn ở hiện tại. Do đó chọn "has served". Các phương án (A) hiện tại đơn, (C) quá khứ tiếp diễn, (D) tương lai đơn đều sai ngữ pháp.',
  },

  // 3. Preposition - Time constraint
  {
    id: 'q-p5-003',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'easy',
    topic: 'Finance & Accounting',
    skillTag: 'Part 5: Prepositions - Giới từ chỉ hạn chót by',
    grammarCategory: 'Prepositions',
    sentence: 'All departmental expense vouchers must be submitted to the finance desk _____ Friday at 5:00 P.M.',
    options: [
      { key: 'A', text: 'by' },
      { key: 'B', text: 'until' },
      { key: 'C', text: 'during' },
      { key: 'D', text: 'between' },
    ],
    correctKey: 'A',
    explanation:
      'Giới từ "by" dùng để chỉ hạn chót (deadline) - "trước hoặc muộn nhất vào thời điểm nào". Phân biệt với "until" (chỉ một hành động kéo dài liên tục cho tới mốc thời gian). "During" cần một khoảng thời gian, "between" cần đi với "and". Do đó (A) "by" là đáp án chính xác.',
  },

  // 4. Conjunction vs Preposition (Although vs In spite of)
  {
    id: 'q-p5-004',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'medium',
    topic: 'Manufacturing & Production',
    skillTag: 'Part 5: Conjunctions - Liên từ nhượng bộ Although',
    grammarCategory: 'Conjunctions',
    sentence: '_____ the supply chain disruptions lasted for several weeks, the assembly line met its quarterly production quota.',
    options: [
      { key: 'A', text: 'Despite' },
      { key: 'B', text: 'Although' },
      { key: 'C', text: 'Because of' },
      { key: 'D', text: 'Regardless' },
    ],
    correctKey: 'B',
    explanation:
      'Phía sau chỗ trống là một mệnh đề hoàn chỉnh có chủ ngữ ("the supply chain disruptions") và vị ngữ ("lasted for several weeks"). Cần một liên từ phụ thuộc (subordinating conjunction) chỉ sự nhượng bộ là "Although". "Despite" và "Because of" là giới từ, chỉ đi với danh từ/cụm danh từ. "Regardless" phải đi kèm với "of".',
  },

  // 5. Vocabulary in Context - Adjective
  {
    id: 'q-p5-005',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'hard',
    topic: 'Corporate Policy',
    skillTag: 'Part 5: Vocabulary - Tính từ bảo mật confidential',
    grammarCategory: 'Vocabulary - Adjective',
    sentence: 'All internal research documents containing proprietary formulas must be kept strictly _____ at all times.',
    options: [
      { key: 'A', text: 'confidential' },
      { key: 'B', text: 'confident' },
      { key: 'C', text: 'confidence' },
      { key: 'D', text: 'confidentially' },
    ],
    correctKey: 'A',
    explanation:
      'Cấu trúc "keep + O + adj" (giữ cho cái gì ở trạng thái nào). Chỗ trống cần tính từ phù hợp ngữ nghĩa về tài liệu bảo mật. "Confidential" (bảo mật, tuyệt mật) là tính từ chính xác. Bẫy: (B) "confident" mang nghĩa tự tin (dành cho người); (C) là danh từ; (D) là trạng từ (đã có "strictly" bổ nghĩa).',
  },

  // 6. Word Form - Noun after possessive adjective
  {
    id: 'q-p5-006',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'easy',
    topic: 'Customer Service',
    skillTag: 'Part 5: Word Form - Danh từ sau sở hữu cách',
    grammarCategory: 'Word Form - Noun',
    sentence: 'The hotel management expresses its sincere _____ to guests for the temporary closure of the swimming pool.',
    options: [
      { key: 'A', text: 'apologize' },
      { key: 'B', text: 'apology' },
      { key: 'C', text: 'apologetic' },
      { key: 'D', text: 'apologetically' },
    ],
    correctKey: 'B',
    explanation:
      'Sau tính từ "sincere" và tính từ sở hữu "its" cần một danh từ làm tân ngữ cho ngoại động từ "expresses". "Apology" (lời xin lỗi) là danh từ. Các phương án khác: (A) động từ, (C) tính từ, (D) trạng từ.',
  },

  // 7. Relative Pronoun / Clause
  {
    id: 'q-p5-007',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'medium',
    topic: 'Marketing & PR',
    skillTag: 'Part 5: Relative Pronouns - Đại từ quan hệ sở hữu whose',
    grammarCategory: 'Relative Pronouns',
    sentence: 'The marketing specialist _____ campaign proposal received the highest score will lead the international launch.',
    options: [
      { key: 'A', text: 'who' },
      { key: 'B', text: 'whom' },
      { key: 'C', text: 'whose' },
      { key: 'D', text: 'which' },
    ],
    correctKey: 'C',
    explanation:
      'Chỗ trống đứng giữa danh từ chỉ người ("The marketing specialist") và cụm danh từ thuộc sở hữu của người đó ("campaign proposal"). Đại từ quan hệ sở hữu "whose" là đáp án đúng ("chuyên viên tiếp thị CÓ đề xuất chiến dịch..."). "Who" làm chủ ngữ, "whom" làm tân ngữ, "which" chỉ vật.',
  },

  // 8. Passive Voice
  {
    id: 'q-p5-008',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'medium',
    topic: 'Logistics & Shipping',
    skillTag: 'Part 5: Passive Voice - Thể bị động sau modal verb',
    grammarCategory: 'Passive Voice',
    sentence: 'Defective computer components must _____ to the central repair facility within thirty business days.',
    options: [
      { key: 'A', text: 'return' },
      { key: 'B', text: 'be returned' },
      { key: 'C', text: 'returning' },
      { key: 'D', text: 'have returned' },
    ],
    correctKey: 'B',
    explanation:
      'Chủ ngữ "Defective computer components" (linh kiện máy tính bị lỗi) là danh từ chỉ vật, không thể tự thực hiện hành động "return", do đó cần dạng bị động sau động từ khuyết thiếu: "must + be + V3/ed". Chọn "be returned". Các phương án (A, C, D) đều ở dạng chủ động.',
  },

  // 9. Vocabulary - Verb Collocation
  {
    id: 'q-p5-009',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'hard',
    topic: 'Facilities Management',
    skillTag: 'Part 5: Vocabulary - Động từ chứa sức chứa accommodate',
    grammarCategory: 'Vocabulary - Verb',
    sentence: 'The main auditorium was redesigned to _____ up to six hundred conference attendees comfortably.',
    options: [
      { key: 'A', text: 'accommodate' },
      { key: 'B', text: 'accumulate' },
      { key: 'C', text: 'accomplish' },
      { key: 'D', text: 'accelerate' },
    ],
    correctKey: 'A',
    explanation:
      'Động từ "accommodate" mang nghĩa "chứa được, có đủ chỗ cho" (accommodate up to 600 attendees). Các từ còn lại không hợp ngữ cảnh: (B) accumulate (tích lũy), (C) accomplish (hoàn thành mục tiêu), (D) accelerate (tăng tốc).',
  },

  // 10. Subject-Verb Agreement
  {
    id: 'q-p5-010',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'easy',
    topic: 'Human Resources',
    skillTag: 'Part 5: Subject-Verb Agreement - Mỗi cá thể Each of',
    grammarCategory: 'Subject-Verb Agreement',
    sentence: 'Each of the shortlisted candidates _____ invited for a panel interview with the executive committee.',
    options: [
      { key: 'A', text: 'is' },
      { key: 'B', text: 'are' },
      { key: 'C', text: 'were' },
      { key: 'D', text: 'have been' },
    ],
    correctKey: 'A',
    explanation:
      'Chủ ngữ bắt đầu bằng "Each of + N số nhiều" luôn chia động từ ở ngôi thứ 3 số ít. Do đó chỉ có (A) "is" thỏa mãn dạng số ít ở hiện tại. Các phương án (B) are, (C) were, (D) have been đều là động từ số nhiều.',
  },

  // 11. Word Form - Adjective modifying noun
  {
    id: 'q-p5-011',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'easy',
    topic: 'Real Estate & Construction',
    skillTag: 'Part 5: Word Form - Tính từ toàn diện comprehensive',
    grammarCategory: 'Word Form - Adjective',
    sentence: 'The real estate developer has prepared a _____ proposal for constructing a multi-level parking garage.',
    options: [
      { key: 'A', text: 'comprehend' },
      { key: 'B', text: 'comprehensive' },
      { key: 'C', text: 'comprehension' },
      { key: 'D', text: 'comprehensively' },
    ],
    correctKey: 'B',
    explanation:
      'Đứng giữa mạo từ "a" và danh từ "proposal" cần một tính từ bổ nghĩa cho "proposal". "Comprehensive" (toàn diện, chi tiết) là tính từ. Các từ còn lại: (A) động từ, (C) danh từ, (D) trạng từ.',
  },

  // 12. Participle as Adjective (-ing vs -ed)
  {
    id: 'q-p5-012',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'medium',
    topic: 'Sales & Retail',
    skillTag: 'Part 5: Participles - Hiện tại phân từ growing interest',
    grammarCategory: 'Participles',
    sentence: 'Due to _____ interest from international buyers, the boutique opened two additional overseas branches.',
    options: [
      { key: 'A', text: 'grow' },
      { key: 'B', text: 'grew' },
      { key: 'C', text: 'growing' },
      { key: 'D', text: 'grown' },
    ],
    correctKey: 'C',
    explanation:
      'Cần một hiện tại phân từ (present participle) đóng vai trò tính từ bổ nghĩa cho danh từ "interest" để diễn tả sự quan tâm đang không ngừng gia tăng ("growing interest"). "Grown" thường dùng cho sinh vật đã trưởng thành, không dùng cho sự quan tâm.',
  },

  // 13. Conditional Inversion (Had + S + V3)
  {
    id: 'q-p5-013',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'hard',
    topic: 'Contract & Law',
    skillTag: 'Part 5: Conditionals - Đảo ngữ câu điều kiện loại 3',
    grammarCategory: 'Conditionals - Inversion',
    sentence: '_____ the client notified us earlier regarding the revision, we would have adjusted the production timeline.',
    options: [
      { key: 'A', text: 'If' },
      { key: 'B', text: 'Had' },
      { key: 'C', text: 'Should' },
      { key: 'D', text: 'Were' },
    ],
    correctKey: 'B',
    explanation:
      'Mệnh đề chính dùng "would have adjusted" (câu điều kiện loại 3). Mệnh đề if rút gọn đảo ngữ câu điều kiện loại 3 có cấu trúc: "Had + S + V3/ed" (thay cho "If the client had notified..."). Nếu dùng "If" thì phải có trợ động từ "had" đi kèm ("If the client had notified"). Chọn (B) "Had".',
  },

  // 14. Vocabulary - Adverb of Degree/Frequency
  {
    id: 'q-p5-014',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'medium',
    topic: 'Quality Assurance',
    skillTag: 'Part 5: Vocabulary - Trạng từ mức độ rigorously',
    grammarCategory: 'Vocabulary - Adverb',
    sentence: 'Product inspection standards are _____ enforced to guarantee that no flawed items leave the factory.',
    options: [
      { key: 'A', text: 'rigorously' },
      { key: 'B', text: 'broadly' },
      { key: 'C', text: 'casually' },
      { key: 'D', text: 'scarcely' },
    ],
    correctKey: 'A',
    explanation:
      'Cụm từ "rigorously enforced" (được thực thi một cách nghiêm ngặt/chặt chẽ) là collocation phổ biến trong ngữ cảnh kiểm định chất lượng xuất xưởng. (B) broadly (một cách rộng rãi), (C) casually (tùy tiện, sơ sài), (D) scarcely (hiếm khi, hầu như không) đều trái nghĩa với mục tiêu đảm bảo không có hàng lỗi.',
  },

  // 15. Reflexive Pronoun
  {
    id: 'q-p5-015',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'easy',
    topic: 'Executive Office',
    skillTag: 'Part 5: Pronouns - Đại từ phản thân nhấn mạnh himself',
    grammarCategory: 'Pronouns - Reflexive',
    sentence: 'The chief executive officer _____ inspected the newly renovated laboratory facilities yesterday.',
    options: [
      { key: 'A', text: 'he' },
      { key: 'B', text: 'him' },
      { key: 'C', text: 'himself' },
      { key: 'D', text: 'his' },
    ],
    correctKey: 'C',
    explanation:
      'Đại từ phản thân "himself" đứng ngay sau chủ ngữ "The chief executive officer" để nhấn mạnh chủ ngữ tự mình làm việc đó ("đích thân kiểm tra"). Các đại từ khác không đứng vị trí này để nhấn mạnh.',
  },

  // 16. Subjunctive Mood / Recommendation verbs
  {
    id: 'q-p5-016',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'hard',
    topic: 'Travel & Relocation',
    skillTag: 'Part 5: Subjunctive Mood - Giả định thức sau mandate',
    grammarCategory: 'Subjunctive Mood',
    sentence: 'The travel policy mandates that every traveling employee _____ economy class for flights under six hours.',
    options: [
      { key: 'A', text: 'book' },
      { key: 'B', text: 'books' },
      { key: 'C', text: 'booked' },
      { key: 'D', text: 'booking' },
    ],
    correctKey: 'A',
    explanation:
      'Cấu trúc giả định thức (Subjunctive) sau động từ chỉ mệnh lệnh/yêu cầu: "mandate / require / suggest that S + (should) + V-infinitive". Dù chủ ngữ "every traveling employee" là số ít, động từ theo sau vẫn phải ở dạng nguyên thể không "to" là "book".',
  },

  // 17. Correlative Conjunctions
  {
    id: 'q-p5-017',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'easy',
    topic: 'Marketing Strategy',
    skillTag: 'Part 5: Correlative Conjunctions - Cặp liên từ both...and',
    grammarCategory: 'Correlative Conjunctions',
    sentence: 'The upcoming summer advertising campaign will focus _____ on television commercials and on digital social platforms.',
    options: [
      { key: 'A', text: 'both' },
      { key: 'B', text: 'either' },
      { key: 'C', text: 'neither' },
      { key: 'D', text: 'not only' },
    ],
    correctKey: 'A',
    explanation:
      'Phía sau có liên từ "and", tạo thành cặp liên từ tương quan "both ... and ..." (cả ... và ...). Cặp khác: "either ... or", "neither ... nor", "not only ... but also". Do đó (A) "both" là đáp án duy nhất đúng.',
  },

  // 18. Prepositional Phrase - In accordance with
  {
    id: 'q-p5-018',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'medium',
    topic: 'Compliance & Regulations',
    skillTag: 'Part 5: Prepositional Phrases - Cụm giới từ in accordance with',
    grammarCategory: 'Prepositional Phrases',
    sentence: 'Financial audit reports must be compiled in _____ with internationally recognized accounting principles.',
    options: [
      { key: 'A', text: 'accordance' },
      { key: 'B', text: 'agreement' },
      { key: 'C', text: 'compliance' },
      { key: 'D', text: 'harmony' },
    ],
    correctKey: 'A',
    explanation:
      'Cụm giới từ cố định: "in accordance with" (phù hợp với, tuân theo quy định). Nếu dùng "compliance" thì phải là "in compliance with", nhưng cụm tiêu chuẩn với accounting principles trong đề TOEIC là "in accordance with". (B) agreement thường đi với "on/with" trong ngữ cảnh hợp đồng; (D) in harmony with chỉ sự hòa hợp.',
  },

  // 19. Vocabulary - Adjective meaning "tentative"
  {
    id: 'q-p5-019',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'medium',
    topic: 'Project Scheduling',
    skillTag: 'Part 5: Vocabulary - Tính từ dự kiến tentative',
    grammarCategory: 'Vocabulary - Adjective',
    sentence: 'The project manager announced a _____ completion date of October 15, subject to permit approvals.',
    options: [
      { key: 'A', text: 'tentative' },
      { key: 'B', text: 'reluctant' },
      { key: 'C', text: 'spacious' },
      { key: 'D', text: 'consecutive' },
    ],
    correctKey: 'A',
    explanation:
      '"Tentative date" nghĩa là "ngày dự kiến / ngày tạm thời" (chưa chốt dứt điểm, còn phụ thuộc phê duyệt giấy phép "subject to permit approvals"). (B) reluctant (miễn cưỡng), (C) spacious (rộng rãi), (D) consecutive (liên tiếp).',
  },

  // 20. Adverb Position & Meaning
  {
    id: 'q-p5-020',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'hard',
    topic: 'Logistics & Warehousing',
    skillTag: 'Part 5: Vocabulary - Trạng từ bổ nghĩa slightly',
    grammarCategory: 'Vocabulary - Adverb',
    sentence: 'Due to severe weather on the coastal route, package delivery times may be _____ delayed.',
    options: [
      { key: 'A', text: 'slightly' },
      { key: 'B', text: 'slight' },
      { key: 'C', text: 'slighted' },
      { key: 'D', text: 'slighting' },
    ],
    correctKey: 'A',
    explanation:
      'Chỗ trống đứng giữa trợ động từ bị động "be" và quá khứ phân từ "delayed", vị trí điển hình của một trạng từ bổ nghĩa cho động từ. "Slightly" (hơi, một chút) là trạng từ chính xác. Các phương án khác: (B) tính từ, (C) phân từ quá khứ, (D) hiện tại phân từ.',
  },

  // 21. Gerund after Prepositional Verb - dedicated to improving
  {
    id: 'q-p5-021',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'medium',
    topic: 'Engineering & Automotive',
    skillTag: 'Part 5: Gerunds - Danh động từ sau dedicated to',
    grammarCategory: 'Gerunds & Infinitives',
    sentence: 'The engineering team remains dedicated to _____ energy efficiency across all next-generation electric vehicle models.',
    options: [
      { key: 'A', text: 'improve' },
      { key: 'B', text: 'improved' },
      { key: 'C', text: 'improvement' },
      { key: 'D', text: 'improving' },
    ],
    correctKey: 'D',
    explanation:
      'Cấu trúc cố định: "dedicated to + V-ing / Noun" (tận tụy, cống hiến cho việc gì). "To" ở đây đóng vai trò giới từ nên động từ theo sau phải ở dạng danh động từ (gerund) "improving" để nhận cụm danh từ tân ngữ "energy efficiency" phía sau. (A) động từ nguyên mẫu không đi sau giới từ "to" trong cấu trúc này, (B) quá khứ phân từ, (C) danh từ "improvement" không thể nhận tân ngữ trực tiếp mà không có giới từ "of".',
  },

  // 22. Comparative Adjective with Modifier
  {
    id: 'q-p5-022',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'easy',
    topic: 'Real Estate & Leasing',
    skillTag: 'Part 5: Comparisons - So sánh hơn của tính từ dài',
    grammarCategory: 'Comparisons - Comparative Adjective',
    sentence: 'The revised commercial lease agreement is significantly _____ than the preliminary draft presented at last month’s board meeting.',
    options: [
      { key: 'A', text: 'favorable' },
      { key: 'B', text: 'favorably' },
      { key: 'C', text: 'more favorable' },
      { key: 'D', text: 'most favorable' },
    ],
    correctKey: 'C',
    explanation:
      'Dấu hiệu nhận biết liên từ so sánh "than" và trạng từ chỉ mức độ "significantly" (đáng kể) đòi hỏi dạng so sánh hơn của tính từ. Tính từ ba âm tiết "favorable" có dạng so sánh hơn là "more favorable" (thuận lợi hơn nhiều). Các phương án khác: (A) tính từ nguyên cấp, (B) trạng từ, (D) so sánh nhất (phải có mạo từ "the" và không đi với "than").',
  },

  // 23. Conjunction of Time - Present Simple in Time Clause
  {
    id: 'q-p5-023',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'medium',
    topic: 'Human Resources & Security',
    skillTag: 'Part 5: Conjunctions - Thì hiện tại đơn trong mệnh đề thời gian once',
    grammarCategory: 'Conjunctions - Time Clauses',
    sentence: 'New administrative staff members will receive permanent security badges once they _____ the mandatory compliance orientation.',
    options: [
      { key: 'A', text: 'will complete' },
      { key: 'B', text: 'completed' },
      { key: 'C', text: 'have completing' },
      { key: 'D', text: 'complete' },
    ],
    correctKey: 'D',
    explanation:
      'Quy tắc hòa hợp thì trong mệnh đề trạng ngữ chỉ thời gian bắt đầu bằng "once" (ngay khi / một khi): khi mệnh đề chính diễn tả hành động tương lai ("will receive"), mệnh đề thời gian không dùng "will" mà dùng thì hiện tại đơn (Present Simple) với chủ ngữ số nhiều "they" -> "complete". (A) sai vì không dùng "will" trong mệnh đề thời gian, (B) thì quá khứ không phù hợp hành động chưa diễn ra, (C) cấu trúc ngữ pháp sai.',
  },

  // 24. Business Collocation - Budgetary Constraints
  {
    id: 'q-p5-024',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'hard',
    topic: 'Finance & Budgeting',
    skillTag: 'Part 5: Vocabulary - Cụm danh từ ràng buộc ngân sách budgetary constraints',
    grammarCategory: 'Vocabulary - Collocation',
    sentence: 'Due to severe budgetary _____, the IT department was unable to upgrade its desktop workstations before the fiscal year ended.',
    options: [
      { key: 'A', text: 'obligations' },
      { key: 'B', text: 'constraints' },
      { key: 'C', text: 'subscriptions' },
      { key: 'D', text: 'exemptions' },
    ],
    correctKey: 'B',
    explanation:
      'Cụm thuật ngữ kinh tế kinh điển trong bài thi TOEIC: "budgetary constraints" (những ràng buộc / hạn chế về ngân sách), phù hợp hoàn hảo với nguyên nhân khiến phòng IT "không thể nâng cấp máy trạm". Các từ khác sai ngữ cảnh: (A) obligations (nghĩa vụ tài chính), (C) subscriptions (khoản đăng ký dịch vụ định kỳ), (D) exemptions (sự miễn trừ thuế/phí).',
  },

  // 25. Indefinite Pronoun / Quantifier - another + singular noun
  {
    id: 'q-p5-025',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'medium',
    topic: 'Corporate Events & Travel',
    skillTag: 'Part 5: Pronouns - Lượng từ another đi với danh từ số ít',
    grammarCategory: 'Pronouns - Quantifiers',
    sentence: 'Because the downtown convention center was fully booked, the event coordinator had to reserve banquet facilities at _____ venue.',
    options: [
      { key: 'A', text: 'others' },
      { key: 'B', text: 'other' },
      { key: 'C', text: 'the other' },
      { key: 'D', text: 'another' },
    ],
    correctKey: 'D',
    explanation:
      'Chỗ trống đứng trước danh từ đếm được số ít ("venue"). Quy tắc lượng từ: "another + danh từ đếm được số ít" (một địa điểm khác). (A) "others" là đại từ đứng một mình không kèm danh từ; (B) "other" đi với danh từ số nhiều ("other venues") hoặc danh từ không đếm được; (C) "the other" chỉ đối tượng còn lại duy nhất trong nhóm hai đối tượng xác định.',
  },

  // 26. Preposition of Time - prior to + gerund
  {
    id: 'q-p5-026',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'medium',
    topic: 'Workplace Safety & Logistics',
    skillTag: 'Part 5: Prepositions - Giới từ thời gian prior to',
    grammarCategory: 'Prepositions',
    sentence: 'All industrial chemical containers must be securely inspected and sealed _____ being transported to the off-site recycling facility.',
    options: [
      { key: 'A', text: 'instead of' },
      { key: 'B', text: 'in order that' },
      { key: 'C', text: 'whereas' },
      { key: 'D', text: 'prior to' },
    ],
    correctKey: 'D',
    explanation:
      'Cụm giới từ "prior to" (= before, trước khi) đi kèm với danh động từ dạng bị động "being transported" (trước khi được vận chuyển). Các phương án khác: (A) "instead of" (thay vì) sai ý nghĩa an toàn lao động; (B) "in order that" là liên từ chỉ mục đích cần mệnh đề S + V; (C) "whereas" là liên từ chỉ sự tương phản đối lập giữa hai mệnh đề.',
  },

  // 27. Linking Verb + Adjective
  {
    id: 'q-p5-027',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'easy',
    topic: 'Market Analysis & Consulting',
    skillTag: 'Part 5: Word Form - Tính từ sau linking verb remain',
    grammarCategory: 'Word Form - Adjective',
    sentence: 'Despite the aggressive entry of new market competitors, client demand for our specialized consulting services remains _____.',
    options: [
      { key: 'A', text: 'steadiness' },
      { key: 'B', text: 'steadily' },
      { key: 'C', text: 'steadied' },
      { key: 'D', text: 'steady' },
    ],
    correctKey: 'D',
    explanation:
      'Sau liên động từ (linking verb) "remains" (vẫn duy trì trạng thái nào) cần một tính từ để bổ nghĩa cho chủ ngữ "client demand". "Steady" (ổn định, vững chắc) là tính từ chính xác. Các phương án khác: (A) danh từ, (B) trạng từ, (C) dạng phân từ/quá khứ không tự nhiên khi miêu tả tính chất nhu cầu thị trường.',
  },

  // 28. Reduced Relative Clause - Past Participle
  {
    id: 'q-p5-028',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'hard',
    topic: 'Customer Service & Warranty',
    skillTag: 'Part 5: Relative Clauses - Mệnh đề quan hệ rút gọn dạng bị động',
    grammarCategory: 'Relative Clauses - Reduced Participle',
    sentence: 'Replacement parts _____ directly through authorized regional distributors are fully covered by a two-year manufacturer warranty.',
    options: [
      { key: 'A', text: 'order' },
      { key: 'B', text: 'ordering' },
      { key: 'C', text: 'ordered' },
      { key: 'D', text: 'have ordered' },
    ],
    correctKey: 'C',
    explanation:
      'Câu đã có vị ngữ chính chia ở thì hiện tại đơn thể bị động: "are fully covered by...". Cụm đứng sau chủ ngữ "Replacement parts" là mệnh đề quan hệ rút gọn: "Replacement parts [which are] ordered directly through...". Vì mang nghĩa bị động (linh kiện ĐƯỢC đặt mua), ta dùng quá khứ phân từ "ordered". (A) động từ nguyên mẫu, (B) hiện tại phân từ mang nghĩa chủ động, (D) thì hiện tại hoàn thành gây lỗi hai vị ngữ trong cùng một câu.',
  },

  // 29. Business Vocabulary - Action Verb
  {
    id: 'q-p5-029',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'medium',
    topic: 'Corporate Policy & Governance',
    skillTag: 'Part 5: Vocabulary - Động từ triển khai implement',
    grammarCategory: 'Vocabulary - Verb',
    sentence: 'The executive committee voted unanimously to _____ the proposed flexible hybrid-work guidelines starting next quarter.',
    options: [
      { key: 'A', text: 'contradict' },
      { key: 'B', text: 'implement' },
      { key: 'C', text: 'diminish' },
      { key: 'D', text: 'withhold' },
    ],
    correctKey: 'B',
    explanation:
      'Động từ "implement" mang nghĩa "triển khai, thi hành" (implement the proposed guidelines = triển khai các hướng dẫn đề xuất), rất phù hợp với ngữ cảnh ban điều hành biểu quyết nhất trí ("voted unanimously"). Các lựa chọn còn lại không hợp nghĩa: (A) contradict (mâu thuẫn, phản bác), (C) diminish (làm suy giảm), (D) withhold (giữ lại, từ chối cấp).',
  },

  // 30. Conditional Conjunction - provided that
  {
    id: 'q-p5-030',
    partNum: 5,
    part: 'Part 5',
    section: 'reading',
    difficulty: 'hard',
    topic: 'Information Technology & Cybersecurity',
    skillTag: 'Part 5: Conjunctions - Liên từ điều kiện provided that',
    grammarCategory: 'Conjunctions - Conditionals',
    sentence: 'Staff members may access corporate databases remotely, _____ they utilize the company-approved virtual private network connection.',
    options: [
      { key: 'A', text: 'in spite of' },
      { key: 'B', text: 'unless' },
      { key: 'C', text: 'provided that' },
      { key: 'D', text: 'regardless' },
    ],
    correctKey: 'C',
    explanation:
      'Liên từ điều kiện "provided that" (= as long as / only if, với điều kiện là / miễn là) nối hai mệnh đề độc lập: nhân viên được phép truy cập cơ sở dữ liệu từ xa với điều kiện họ sử dụng kết nối VPN được công ty phê duyệt. Các từ khác: (A) "in spite of" là giới từ chỉ sự nhượng bộ; (B) "unless" (= nếu không) làm đảo ngược ý nghĩa bảo mật; (D) "regardless" cần có giới từ "of" và không đi với mệnh đề S + V.',
  },
];
