/**
 * TOEIC Mastery Hub — Listening Question Bank
 * Part 2: Question-Response (25 High-Quality Questions)
 * 
 * Features:
 * - Strictly 3 options (A, B, C) per question (No Option D)
 * - Complete promptScript and synchronized TTS audio script
 * - Full coverage of ETS question archetypes: Wh-, Yes/No, Negative, Tag, Alternative, Indirect responses
 * - In-depth Vietnamese explanations dissecting same-sound, same-root, and Yes/No traps
 */

import { Part2Question } from '../../types/questionBank';

export const PART2_QUESTIONS: Part2Question[] = [
  // 1. Where Question
  {
    id: 'q-p2-001',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'easy',
    topic: 'Finance',
    skillTag: 'Part 2: Wh- Question (Where) & Bẫy đồng âm',
    trapType: 'Bẫy từ đồng âm/gần âm (expense vs expensive) và Yes/No cho Wh-',
    promptScript: 'Where should I submit my travel expense report?',
    media: {
      audio: {
        audioScript:
          'Where should I submit my travel expense report? Option A: Yes, it was quite expensive. Option B: Send it directly to accounting on the third floor. Option C: I took the train last Thursday.',
        accent: 'US',
        speakerGender: 'male',
      },
      transcript:
        'Speaker: "Where should I submit my travel expense report?"\n(A) Yes, it was quite expensive.\n(B) Send it directly to accounting on the third floor.\n(C) I took the train last Thursday.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'Yes, it was quite expensive.' },
      { key: 'B', text: 'Send it directly to accounting on the third floor.' },
      { key: 'C', text: 'I took the train last Thursday.' },
    ],
    correctKey: 'B',
    explanation:
      'Đáp án (B) trả lời trực tiếp cho câu hỏi địa điểm "Where" (gửi đến phòng kế toán tầng 3). Bẫy thường gặp: (A) trả lời "Yes" cho câu hỏi Wh- và bẫy lặp âm/từ cùng gốc "expensive" nhầm với "expense"; (C) lạc đề về phương tiện di chuyển trong quá khứ.',
  },

  // 2. When Question
  {
    id: 'q-p2-002',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'easy',
    topic: 'Operations',
    skillTag: 'Part 2: Wh- Question (When) & Bẫy thời gian',
    trapType: 'Bẫy trả lời Yes/No cho câu hỏi When & Bẫy lặp từ',
    promptScript: 'When is the maintenance team scheduled to inspect the elevators?',
    media: {
      audio: {
        audioScript:
          'When is the maintenance team scheduled to inspect the elevators? Option A: Sometime before lunch today. Option B: No, the stairs are closed. Option C: Yes, on the top floor.',
        accent: 'UK',
        speakerGender: 'female',
      },
      transcript:
        'Speaker: "When is the maintenance team scheduled to inspect the elevators?"\n(A) Sometime before lunch today.\n(B) No, the stairs are closed.\n(C) Yes, on the top floor.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'Sometime before lunch today.' },
      { key: 'B', text: 'No, the stairs are closed.' },
      { key: 'C', text: 'Yes, on the top floor.' },
    ],
    correctKey: 'A',
    explanation:
      'Đáp án (A) chỉ mốc thời gian rõ ràng ("before lunch today") tương ứng với câu hỏi "When". Bẫy: (B) và (C) bắt đầu bằng "No/Yes" – quy tắc cơ bản trong TOEIC là câu hỏi Wh- không bao giờ được trả lời bằng Yes hoặc No.',
  },

  // 3. Who Question
  {
    id: 'q-p2-003',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'easy',
    topic: 'Management',
    skillTag: 'Part 2: Wh- Question (Who) & Trách nhiệm nhân sự',
    trapType: 'Bẫy lặp từ (charge) & Lạc chủ đề',
    promptScript: 'Who is in charge of organizing the annual charity gala this year?',
    media: {
      audio: {
        audioScript:
          'Who is in charge of organizing the annual charity gala this year? Option A: At the Grand Horizon Hotel. Option B: Ms. Martinez from human resources. Option C: We accept credit cards without extra charge.',
        accent: 'US',
        speakerGender: 'female',
      },
      transcript:
        'Speaker: "Who is in charge of organizing the annual charity gala this year?"\n(A) At the Grand Horizon Hotel.\n(B) Ms. Martinez from human resources.\n(C) We accept credit cards without extra charge.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'At the Grand Horizon Hotel.' },
      { key: 'B', text: 'Ms. Martinez from human resources.' },
      { key: 'C', text: 'We accept credit cards without extra charge.' },
    ],
    correctKey: 'B',
    explanation:
      'Đáp án (B) xác định người chịu trách nhiệm ("Ms. Martinez") cho câu hỏi "Who". Bẫy: (A) trả lời cho câu hỏi địa điểm "Where"; (C) bẫy đa nghĩa của từ "charge" (trong câu hỏi là cụm "in charge of" = phụ trách, còn trong đáp án là "extra charge" = phụ phí).',
  },

  // 4. Why Question
  {
    id: 'q-p2-004',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'medium',
    topic: 'Logistics',
    skillTag: 'Part 2: Wh- Question (Why) & Nguyên nhân gián tiếp',
    trapType: 'Bẫy trả lời địa điểm cho Why & Lặp âm',
    promptScript: 'Why has the delivery of raw materials been postponed?',
    media: {
      audio: {
        audioScript:
          'Why has the delivery of raw materials been postponed? Option A: The highway was blocked by a landslide. Option B: To the distribution center downtown. Option C: About fifty kilograms.',
        accent: 'AU',
        speakerGender: 'male',
      },
      transcript:
        'Speaker: "Why has the delivery of raw materials been postponed?"\n(A) The highway was blocked by a landslide.\n(B) To the distribution center downtown.\n(C) About fifty kilograms.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'The highway was blocked by a landslide.' },
      { key: 'B', text: 'To the distribution center downtown.' },
      { key: 'C', text: 'About fifty kilograms.' },
    ],
    correctKey: 'A',
    explanation:
      'Đáp án (A) giải thích nguyên nhân gây chậm trễ (đường cao tốc bị tắc do sạt lở) phù hợp với "Why". Bẫy: (B) trả lời cho câu hỏi hướng đi/địa điểm ("Where"); (C) trả lời cho câu hỏi khối lượng ("How much").',
  },

  // 5. How Question (Method / Strategy)
  {
    id: 'q-p2-005',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'medium',
    topic: 'Office',
    skillTag: 'Part 2: Wh- Question (How) & Hướng dẫn thủ tục',
    trapType: 'Bẫy How much (số lượng) cho How (cách thức)',
    promptScript: 'How can I access the archived financial statements?',
    media: {
      audio: {
        audioScript:
          'How can I access the archived financial statements? Option A: You need permission from the IT department. Option B: It cost five hundred dollars. Option C: Yes, I accessed it yesterday.',
        accent: 'US',
        speakerGender: 'female',
      },
      transcript:
        'Speaker: "How can I access the archived financial statements?"\n(A) You need permission from the IT department.\n(B) It cost five hundred dollars.\n(C) Yes, I accessed it yesterday.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'You need permission from the IT department.' },
      { key: 'B', text: 'It cost five hundred dollars.' },
      { key: 'C', text: 'Yes, I accessed it yesterday.' },
    ],
    correctKey: 'A',
    explanation:
      'Đáp án (A) cung cấp hướng dẫn cách thức tiếp cận hồ sơ (cần xin cấp quyền từ IT). Bẫy: (B) trả lời cho "How much is it"; (C) bẫy trả lời Yes và lặp lại động từ "accessed".',
  },

  // 6. Yes/No Question (Confirmation)
  {
    id: 'q-p2-006',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'easy',
    topic: 'Sales',
    skillTag: 'Part 2: Yes/No Question & Xác nhận trực tiếp',
    trapType: 'Bẫy lặp âm liên quan đến sản phẩm',
    promptScript: 'Did Mr. Tanaka confirm his attendance at the banquet?',
    media: {
      audio: {
        audioScript:
          'Did Mr. Tanaka confirm his attendance at the banquet? Option A: Yes, he emailed his RSVP this morning. Option B: At eight o’clock sharp. Option C: The bank is on Elm Street.',
        accent: 'UK',
        speakerGender: 'male',
      },
      transcript:
        'Speaker: "Did Mr. Tanaka confirm his attendance at the banquet?"\n(A) Yes, he emailed his RSVP this morning.\n(B) At eight o’clock sharp.\n(C) The bank is on Elm Street.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'Yes, he emailed his RSVP this morning.' },
      { key: 'B', text: 'At eight o’clock sharp.' },
      { key: 'C', text: 'The bank is on Elm Street.' },
    ],
    correctKey: 'A',
    explanation:
      'Đáp án (A) xác nhận rõ ràng bằng "Yes" và bổ sung chi tiết đã gửi thư xác nhận (RSVP). Bẫy: (B) trả lời thời gian "What time"; (C) bẫy từ gần âm "bank" nhầm lẫn với "banquet" (tiệc tối).',
  },

  // 7. Negative Question (Aren't we supposed to...)
  {
    id: 'q-p2-007',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'hard',
    topic: 'HR',
    skillTag: 'Part 2: Negative Question & Trả lời gián tiếp',
    trapType: 'Bẫy câu hỏi phủ định & Nhầm lẫn nghĩa',
    promptScript: 'Aren’t we supposed to attend the compliance workshop this afternoon?',
    media: {
      audio: {
        audioScript:
          'Aren’t we supposed to attend the compliance workshop this afternoon? Option A: It has been postponed until next Wednesday. Option B: Yes, I attended high school in Seattle. Option C: No, about thirty participants.',
        accent: 'US',
        speakerGender: 'female',
      },
      transcript:
        'Speaker: "Aren’t we supposed to attend the compliance workshop this afternoon?"\n(A) It has been postponed until next Wednesday.\n(B) Yes, I attended high school in Seattle.\n(C) No, about thirty participants.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'It has been postponed until next Wednesday.' },
      { key: 'B', text: 'Yes, I attended high school in Seattle.' },
      { key: 'C', text: 'No, about thirty participants.' },
    ],
    correctKey: 'A',
    explanation:
      'Đáp án (A) là câu trả lời gián tiếp kinh điển: thông báo sự kiện đã bị hoãn sang tuần sau. Bẫy: (B) lặp từ "attended" nhưng mang ngữ cảnh học trường cấp ba; (C) trả lời cho câu hỏi số lượng ("How many").',
  },

  // 8. Tag Question (Confirmation check)
  {
    id: 'q-p2-008',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'medium',
    topic: 'Operations',
    skillTag: 'Part 2: Tag Question (Câu hỏi đuôi)',
    trapType: 'Bẫy lặp âm flight/fight & Trả lời lạc đề',
    promptScript: 'The catering order hasn’t arrived yet, has it?',
    media: {
      audio: {
        audioScript:
          'The catering order hasn’t arrived yet, has it? Option A: No, but the driver said he is ten minutes away. Option B: The restaurant serves Italian cuisine. Option C: Yes, I ordered a dessert.',
        accent: 'US',
        speakerGender: 'male',
      },
      transcript:
        'Speaker: "The catering order hasn’t arrived yet, has it?"\n(A) No, but the driver said he is ten minutes away.\n(B) The restaurant serves Italian cuisine.\n(C) Yes, I ordered a dessert.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'No, but the driver said he is ten minutes away.' },
      { key: 'B', text: 'The restaurant serves Italian cuisine.' },
      { key: 'C', text: 'Yes, I ordered a dessert.' },
    ],
    correctKey: 'A',
    explanation:
      'Đáp án (A) phản hồi chính xác thực trạng: "No" (chưa đến) và bổ sung tài xế báo chỉ còn 10 phút nữa. Bẫy: (B) nói về phong cách ẩm thực của nhà hàng; (C) lặp động từ "ordered" nhưng lạc đề.',
  },

  // 9. Alternative Question (Or question)
  {
    id: 'q-p2-009',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'medium',
    topic: 'Travel',
    skillTag: 'Part 2: Alternative Question (Lựa chọn A hoặc B)',
    trapType: 'Bẫy trả lời Yes/No cho câu hỏi Or',
    promptScript: 'Would you prefer to fly out on Thursday evening or Friday morning?',
    media: {
      audio: {
        audioScript:
          'Would you prefer to fly out on Thursday evening or Friday morning? Option A: Yes, that sounds wonderful. Option B: Friday morning would give me more time to pack. Option C: The flight was completely smooth.',
        accent: 'UK',
        speakerGender: 'female',
      },
      transcript:
        'Speaker: "Would you prefer to fly out on Thursday evening or Friday morning?"\n(A) Yes, that sounds wonderful.\n(B) Friday morning would give me more time to pack.\n(C) The flight was completely smooth.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'Yes, that sounds wonderful.' },
      { key: 'B', text: 'Friday morning would give me more time to pack.' },
      { key: 'C', text: 'The flight was completely smooth.' },
    ],
    correctKey: 'B',
    explanation:
      'Đáp án (B) chọn một trong hai phương án được đưa ra ("Friday morning") và nêu lý do. Bẫy: (A) trả lời "Yes" cho câu hỏi lựa chọn Or (câu hỏi Or không dùng Yes/No trừ khi có hàm ý từ chối cả hai); (C) chia thì quá khứ cho chuyến bay chưa diễn ra.',
  },

  // 10. Indirect Evasive Response (I don't know / Referral)
  {
    id: 'q-p2-010',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'hard',
    topic: 'Contract',
    skillTag: 'Part 2: Indirect Evasive Response (Chuyển tiếp thông tin)',
    trapType: 'Bẫy lặp từ contract & Câu trả lời gián tiếp',
    promptScript: 'Has the client signed the revised service contract yet?',
    media: {
      audio: {
        audioScript:
          'Has the client signed the revised service contract yet? Option A: I haven’t checked my email inbox since noon. Option B: Yes, the contract is ten pages long. Option C: Signs are posted in the hallway.',
        accent: 'US',
        speakerGender: 'female',
      },
      transcript:
        'Speaker: "Has the client signed the revised service contract yet?"\n(A) I haven’t checked my email inbox since noon.\n(B) Yes, the contract is ten pages long.\n(C) Signs are posted in the hallway.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'I haven’t checked my email inbox since noon.' },
      { key: 'B', text: 'Yes, the contract is ten pages long.' },
      { key: 'C', text: 'Signs are posted in the hallway.' },
    ],
    correctKey: 'A',
    explanation:
      'Đáp án (A) là câu trả lời gián tiếp phổ biến trong đề thi hiện đại: người nói chưa kiểm tra hòm thư nên chưa rõ hợp đồng đã ký chưa. Bẫy: (B) miêu tả độ dài tài liệu; (C) bẫy đồng âm "signs" (biển báo) với động từ "signed" (ký tên).',
  },

  // 11. Suggestion / Recommendation (Why don't we...)
  {
    id: 'q-p2-011',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'medium',
    topic: 'Business',
    skillTag: 'Part 2: Suggestion (Lời đề nghị / Gợi ý)',
    trapType: 'Bẫy hiểu nhầm câu hỏi Why thông thường',
    promptScript: 'Why don’t we review the presentation slides together before the meeting?',
    media: {
      audio: {
        audioScript:
          'Why don’t we review the presentation slides together before the meeting? Option A: That would be very helpful, thank you. Option B: Because it was raining heavily. Option C: In conference room B.',
        accent: 'US',
        speakerGender: 'male',
      },
      transcript:
        'Speaker: "Why don’t we review the presentation slides together before the meeting?"\n(A) That would be very helpful, thank you.\n(B) Because it was raining heavily.\n(C) In conference room B.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'That would be very helpful, thank you.' },
      { key: 'B', text: 'Because it was raining heavily.' },
      { key: 'C', text: 'In conference room B.' },
    ],
    correctKey: 'A',
    explanation:
      'Cụm "Why don\'t we + V" là lời gợi ý/rủ rê, đáp án (A) đồng ý một cách lịch sự ("That would be very helpful"). Bẫy: (B) bắt đầu bằng "Because" lừa thí sinh tưởng đây là câu hỏi tìm nguyên nhân "Why" thông thường; (C) trả lời cho câu hỏi vị trí "Where".',
  },

  // 12. Request / Favor (Could you please...)
  {
    id: 'q-p2-012',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'easy',
    topic: 'Office',
    skillTag: 'Part 2: Request (Lời yêu cầu giúp đỡ)',
    trapType: 'Bẫy lặp âm projector/project & Phản hồi từ chối khéo',
    promptScript: 'Could you give me a hand setting up the microphone for the speaker?',
    media: {
      audio: {
        audioScript:
          'Could you give me a hand setting up the microphone for the speaker? Option A: Sure, as soon as I finish printing this report. Option B: He spoke very loudly during the talk. Option C: My hand hurts from writing.',
        accent: 'AU',
        speakerGender: 'female',
      },
      transcript:
        'Speaker: "Could you give me a hand setting up the microphone for the speaker?"\n(A) Sure, as soon as I finish printing this report.\n(B) He spoke very loudly during the talk.\n(C) My hand hurts from writing.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'Sure, as soon as I finish printing this report.' },
      { key: 'B', text: 'He spoke very loudly during the talk.' },
      { key: 'C', text: 'My hand hurts from writing.' },
    ],
    correctKey: 'A',
    explanation:
      'Thành ngữ "give me a hand" nghĩa là "giúp tôi một tay". Đáp án (A) đồng ý giúp đỡ ngay khi in xong tài liệu. Bẫy: (B) lặp từ gần nghĩa "spoke" với "speaker"; (C) bẫy nghĩa đen của từ "hand" (bàn tay bị đau).',
  },

  // 13. Statement / Workplace Situation
  {
    id: 'q-p2-013',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'hard',
    topic: 'Facilities',
    skillTag: 'Part 2: Statement (Câu trần thuật thông báo vấn đề)',
    trapType: 'Bẫy lặp từ photocopy/copy & Phản ứng với sự cố',
    promptScript: 'The color photocopier on the second floor is jammed again.',
    media: {
      audio: {
        audioScript:
          'The color photocopier on the second floor is jammed again. Option A: I will call building maintenance right away. Option B: Two hundred black-and-white copies, please. Option C: It is painted bright blue.',
        accent: 'US',
        speakerGender: 'female',
      },
      transcript:
        'Speaker: "The color photocopier on the second floor is jammed again."\n(A) I will call building maintenance right away.\n(B) Two hundred black-and-white copies, please.\n(C) It is painted bright blue.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'I will call building maintenance right away.' },
      { key: 'B', text: 'Two hundred black-and-white copies, please.' },
      { key: 'C', text: 'It is painted bright blue.' },
    ],
    correctKey: 'A',
    explanation:
      'Câu trần thuật thông báo máy photocopy bị kẹt giấy, phản ứng hợp lý nhất là (A): chủ động gọi bộ phận kỹ thuật đến xử lý. Bẫy: (B) đưa ra yêu cầu in ấn; (C) bẫy liên tưởng từ "color" (màu sắc máy in).',
  },

  // 14. Embedded Question
  {
    id: 'q-p2-014',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'medium',
    topic: 'Conference',
    skillTag: 'Part 2: Embedded Question (Câu hỏi gián tiếp lồng ghép)',
    trapType: 'Bẫy lặp lại động từ trong mệnh đề phụ',
    promptScript: 'Do you know what time the keynote speaker is scheduled to begin?',
    media: {
      audio: {
        audioScript:
          'Do you know what time the keynote speaker is scheduled to begin? Option A: Right after the opening remarks at nine thirty. Option B: Yes, she is a very famous economist. Option C: I bought the ticket online.',
        accent: 'UK',
        speakerGender: 'male',
      },
      transcript:
        'Speaker: "Do you know what time the keynote speaker is scheduled to begin?"\n(A) Right after the opening remarks at nine thirty.\n(B) Yes, she is a very famous economist.\n(C) I bought the ticket online.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'Right after the opening remarks at nine thirty.' },
      { key: 'B', text: 'Yes, she is a very famous economist.' },
      { key: 'C', text: 'I bought the ticket online.' },
    ],
    correctKey: 'A',
    explanation:
      'Dù bắt đầu bằng "Do you know", trọng tâm câu hỏi nằm ở "what time". Đáp án (A) trả lời thời gian cụ thể (ngay sau bài phát biểu khai mạc lúc 9:30). Bẫy: (B) trả lời Yes nhưng sau đó nói về danh tiếng diễn giả; (C) lạc đề về mua vé.',
  },

  // 15. Offer of Assistance
  {
    id: 'q-p2-015',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'easy',
    topic: 'Customer Service',
    skillTag: 'Part 2: Offer of Assistance (Lời mời / Đề nghị giúp đỡ)',
    trapType: 'Bẫy lặp từ bag/carry & Phản ứng từ chối lịch sự',
    promptScript: 'Would you like me to carry those product sample boxes to your car?',
    media: {
      audio: {
        audioScript:
          'Would you like me to carry those product sample boxes to your car? Option A: Thanks, but I can manage them myself. Option B: My car was parked on street level. Option C: These samples were manufactured in Japan.',
        accent: 'US',
        speakerGender: 'female',
      },
      transcript:
        'Speaker: "Would you like me to carry those product sample boxes to your car?"\n(A) Thanks, but I can manage them myself.\n(B) My car was parked on street level.\n(C) These samples were manufactured in Japan.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'Thanks, but I can manage them myself.' },
      { key: 'B', text: 'My car was parked on street level.' },
      { key: 'C', text: 'These samples were manufactured in Japan.' },
    ],
    correctKey: 'A',
    explanation:
      'Lời đề nghị giúp mang đồ ("Would you like me to..."), đáp án (A) từ chối khéo léo và cảm ơn ("Thanks, but I can manage them myself"). Bẫy: (B) lặp từ "car" và nói về vị trí đỗ; (C) lặp từ "samples" và nói về xuất xứ sản phẩm.',
  },

  // 16. Why Question
  {
    id: 'q-p2-016',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'easy',
    topic: 'Sales',
    skillTag: 'Part 2: Wh- Question (Why) & Lý do vắng mặt',
    trapType: 'Bẫy trả lời Yes/No cho câu hỏi Why & Bẫy cùng gốc từ (presented - presentation)',
    promptScript: "Why didn't you attend the quarterly sales presentation yesterday?",
    media: {
      audio: {
        audioScript:
          "Why didn't you attend the quarterly sales presentation yesterday? Option A: He presented a very detailed slide deck. Option B: Yes, our quarterly profit grew significantly. Option C: Because I was meeting with a new client in Seattle.",
        accent: 'US',
        speakerGender: 'male',
      },
      transcript:
        'Speaker: "Why didn\'t you attend the quarterly sales presentation yesterday?"\n(A) He presented a very detailed slide deck.\n(B) Yes, our quarterly profit grew significantly.\n(C) Because I was meeting with a new client in Seattle.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'He presented a very detailed slide deck.' },
      { key: 'B', text: 'Yes, our quarterly profit grew significantly.' },
      { key: 'C', text: 'Because I was meeting with a new client in Seattle.' },
    ],
    correctKey: 'C',
    explanation:
      'Đáp án (C) đưa ra lý do giải thích trực tiếp cho "Why didn\'t you attend" (bận gặp khách hàng mới ở Seattle). Bẫy thường gặp: (A) dùng sai đại từ "He" và bẫy cùng gốc từ "presented" bắt nguồn từ "presentation"; (B) trả lời Yes cho câu hỏi Wh- và lặp từ "quarterly".',
  },

  // 17. How Question
  {
    id: 'q-p2-017',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'easy',
    topic: 'Human Resources',
    skillTag: 'Part 2: Wh- Question (How) & Phương thức truy cập',
    trapType: 'Bẫy trả lời nhầm sang How many & Bẫy liên tưởng chủ đề bảo hiểm',
    promptScript: 'How can new employees access their benefits information online?',
    media: {
      audio: {
        audioScript:
          'How can new employees access their benefits information online? Option A: Our dental insurance coverage is quite comprehensive. Option B: Through the human resources portal link on the intranet. Option C: About twenty new staff members were hired.',
        accent: 'UK',
        speakerGender: 'female',
      },
      transcript:
        'Speaker: "How can new employees access their benefits information online?"\n(A) Our dental insurance coverage is quite comprehensive.\n(B) Through the human resources portal link on the intranet.\n(C) About twenty new staff members were hired.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'Our dental insurance coverage is quite comprehensive.' },
      { key: 'B', text: 'Through the human resources portal link on the intranet.' },
      { key: 'C', text: 'About twenty new staff members were hired.' },
    ],
    correctKey: 'B',
    explanation:
      'Đáp án (B) chỉ rõ cách thức / công cụ truy cập ("Through the human resources portal link..."). Bẫy thường gặp: (A) bẫy liên tưởng chủ đề chế độ đãi ngộ (benefits -> dental insurance) mà không trả lời cách truy cập; (C) trả lời số lượng người ("twenty new staff") nhầm sang câu hỏi "How many".',
  },

  // 18. Request / Indirect Response
  {
    id: 'q-p2-018',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'medium',
    topic: 'Facilities',
    skillTag: 'Part 2: Request / Could you & Phản hồi gián tiếp (Indirect Response)',
    trapType: 'Bẫy từ cùng gốc (projector - projection) & Bẫy lặp từ Room B',
    promptScript: 'Could you help me set up the audiovisual projector in Conference Room B?',
    media: {
      audio: {
        audioScript:
          'Could you help me set up the audiovisual projector in Conference Room B? Option A: The projection for our third-quarter revenue looks promising. Option B: I have another meeting in five minutes, but Kevin is available. Option C: Room B is painted in light blue.',
        accent: 'US',
        speakerGender: 'female',
      },
      transcript:
        'Speaker: "Could you help me set up the audiovisual projector in Conference Room B?"\n(A) The projection for our third-quarter revenue looks promising.\n(B) I have another meeting in five minutes, but Kevin is available.\n(C) Room B is painted in light blue.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'The projection for our third-quarter revenue looks promising.' },
      { key: 'B', text: 'I have another meeting in five minutes, but Kevin is available.' },
      { key: 'C', text: 'Room B is painted in light blue.' },
    ],
    correctKey: 'B',
    explanation:
      'Đáp án (B) là phản hồi gián tiếp thường gặp của ETS: từ chối khéo do bận họp nhưng đưa ra giải pháp thay thế hợp tác ("Kevin is available"). Bẫy: (A) bẫy cùng gốc từ / đồng âm "projection" (dự báo doanh thu) nhầm với "projector" (máy chiếu); (C) bẫy lặp từ "Room B" với mô tả màu sơn không liên quan.',
  },

  // 19. Negative Question
  {
    id: 'q-p2-019',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'medium',
    topic: 'Operations',
    skillTag: 'Part 2: Negative Question (Phủ định) & Chuyển giao phân công',
    trapType: 'Bẫy lặp từ overseas & Bẫy liên tưởng ngữ nghĩa contracts - warranty',
    promptScript: "Isn't Ms. Patel in charge of coordinating the overseas supplier contracts?",
    media: {
      audio: {
        audioScript:
          "Isn't Ms. Patel in charge of coordinating the overseas supplier contracts? Option A: A two-year signed warranty agreement. Option B: Yes, our overseas flight departs at seven o'clock. Option C: No, that responsibility was reassigned to David last month.",
        accent: 'CA',
        speakerGender: 'male',
      },
      transcript:
        'Speaker: "Isn\'t Ms. Patel in charge of coordinating the overseas supplier contracts?"\n(A) A two-year signed warranty agreement.\n(B) Yes, our overseas flight departs at seven o\'clock.\n(C) No, that responsibility was reassigned to David last month.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'A two-year signed warranty agreement.' },
      { key: 'B', text: "Yes, our overseas flight departs at seven o'clock." },
      { key: 'C', text: 'No, that responsibility was reassigned to David last month.' },
    ],
    correctKey: 'C',
    explanation:
      'Câu hỏi phủ định xác nhận trách nhiệm của bà Patel. Đáp án (C) phủ định và cập nhật thực tế rằng nhiệm vụ đã bàn giao cho David tháng trước. Bẫy: (A) liên tưởng chủ đề hợp đồng/thỏa thuận ("warranty agreement") nhưng thiếu cấu trúc câu hoàn chỉnh; (B) lặp từ "overseas" nhưng chuyển hướng sang chuyến bay xuất ngoại.',
  },

  // 20. Tag Question
  {
    id: 'q-p2-020',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'hard',
    topic: 'IT Support',
    skillTag: 'Part 2: Tag Question (Câu hỏi đuôi) & Phản bác thông tin thực tế',
    trapType: 'Bẫy gần âm audit - audio & Bẫy lặp cụm thời gian next Friday',
    promptScript: "The annual software audit was postponed until next Friday, wasn't it?",
    media: {
      audio: {
        audioScript:
          "The annual software audit was postponed until next Friday, wasn't it? Option A: Next Friday is an observed public holiday. Option B: I usually listen to audiobooks on the train. Option C: No, the auditor actually arrived this morning.",
        accent: 'UK',
        speakerGender: 'male',
      },
      transcript:
        'Speaker: "The annual software audit was postponed until next Friday, wasn\'t it?"\n(A) Next Friday is an observed public holiday.\n(B) I usually listen to audiobooks on the train.\n(C) No, the auditor actually arrived this morning.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'Next Friday is an observed public holiday.' },
      { key: 'B', text: 'I usually listen to audiobooks on the train.' },
      { key: 'C', text: 'No, the auditor actually arrived this morning.' },
    ],
    correctKey: 'C',
    explanation:
      'Câu hỏi đuôi kiểm tra sự việc hoãn kiểm toán phần mềm. Đáp án (C) đính chính lại sự thật ("No, the auditor actually arrived this morning"). Bẫy: (A) lặp cụm từ "Next Friday" mà không khẳng định hay phủ định lịch kiểm toán; (B) bẫy gần âm "audiobooks" gây nhầm lẫn với "audit".',
  },

  // 21. Alternative Question (Or)
  {
    id: 'q-p2-021',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'medium',
    topic: 'Corporate Events',
    skillTag: 'Part 2: Alternative Question (Câu hỏi lựa chọn Or)',
    trapType: 'Bẫy trả lời Yes/No cho câu hỏi Or & Bẫy lặp từ ordered',
    promptScript: 'Should we order catering from the Italian bistro or prepare sandwiches ourselves?',
    media: {
      audio: {
        audioScript:
          'Should we order catering from the Italian bistro or prepare sandwiches ourselves? Option A: Yes, I really enjoy traditional Italian pasta dishes. Option B: Let\'s hire the caterers so we can focus on our presentations. Option C: He ordered three boxes of replacement printer cartridges.',
        accent: 'AU',
        speakerGender: 'female',
      },
      transcript:
        'Speaker: "Should we order catering from the Italian bistro or prepare sandwiches ourselves?"\n(A) Yes, I really enjoy traditional Italian pasta dishes.\n(B) Let\'s hire the caterers so we can focus on our presentations.\n(C) He ordered three boxes of replacement printer cartridges.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'Yes, I really enjoy traditional Italian pasta dishes.' },
      { key: 'B', text: "Let's hire the caterers so we can focus on our presentations." },
      { key: 'C', text: 'He ordered three boxes of replacement printer cartridges.' },
    ],
    correctKey: 'B',
    explanation:
      'Câu hỏi lựa chọn "A or B" cấm trả lời bằng Yes hoặc No. Đáp án (B) lựa chọn thuê dịch vụ ngoài ("hire the caterers") và nêu rõ lợi ích công việc. Bẫy: (A) trả lời "Yes" cho câu hỏi lựa chọn; (C) lặp từ "ordered" nhưng lạc đề sang mua mực in văn phòng.',
  },

  // 22. Indirect / Delegation Response
  {
    id: 'q-p2-022',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'hard',
    topic: 'Purchasing',
    skillTag: 'Part 2: Wh- Question (Who) & Trả lời né tránh / Ủy quyền thông tin',
    trapType: 'Bẫy cùng gốc từ shipping - shipment & Bẫy trả lời giá tiền cho câu hỏi Who',
    promptScript: 'Who approved the expedited shipping fees for the urgent parts delivery?',
    media: {
      audio: {
        audioScript:
          "Who approved the expedited shipping fees for the urgent parts delivery? Option A: The shipment arrived in excellent condition yesterday. Option B: Approximately fifty dollars per parcel. Option C: You'll have to ask Brenda in the procurement office.",
        accent: 'US',
        speakerGender: 'male',
      },
      transcript:
        'Speaker: "Who approved the expedited shipping fees for the urgent parts delivery?"\n(A) The shipment arrived in excellent condition yesterday.\n(B) Approximately fifty dollars per parcel.\n(C) You\'ll have to ask Brenda in the procurement office.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'The shipment arrived in excellent condition yesterday.' },
      { key: 'B', text: 'Approximately fifty dollars per parcel.' },
      { key: 'C', text: "You'll have to ask Brenda in the procurement office." },
    ],
    correctKey: 'C',
    explanation:
      'Câu hỏi "Who approved..." yêu cầu biết danh tính người phê duyệt. Đáp án (C) chuyển tiếp trách nhiệm giải đáp ("You\'ll have to ask Brenda..."). Bẫy: (A) bẫy từ cùng gốc "shipment" nhầm với "shipping"; (B) trả lời số tiền ("fifty dollars") nhầm sang câu hỏi "How much".',
  },

  // 23. Statement / Problem Announcement
  {
    id: 'q-p2-023',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'medium',
    topic: 'Office Equipment',
    skillTag: 'Part 2: Statement (Câu trần thuật thông báo lỗi) & Giải pháp xử lý',
    trapType: 'Bẫy lặp từ color & Bẫy liên tưởng số tầng third floor - fourth floor',
    promptScript: 'The color printer on the third floor is making a strange grinding noise.',
    media: {
      audio: {
        audioScript:
          'The color printer on the third floor is making a strange grinding noise. Option A: I prefer painting with bright acrylic colors. Option B: I already submitted an IT support maintenance ticket for it. Option C: The express elevator goes directly to the fourth floor.',
        accent: 'US',
        speakerGender: 'female',
      },
      transcript:
        'Speaker: "The color printer on the third floor is making a strange grinding noise."\n(A) I prefer painting with bright acrylic colors.\n(B) I already submitted an IT support maintenance ticket for it.\n(C) The express elevator goes directly to the fourth floor.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'I prefer painting with bright acrylic colors.' },
      { key: 'B', text: 'I already submitted an IT support maintenance ticket for it.' },
      { key: 'C', text: 'The express elevator goes directly to the fourth floor.' },
    ],
    correctKey: 'B',
    explanation:
      'Câu trần thuật phản ánh sự cố máy in ("making a strange grinding noise"). Đáp án (B) phản hồi tự nhiên bằng hành động đã thực hiện để khắc phục ("submitted an IT support ticket"). Bẫy: (A) lặp từ "color" sang vẽ tranh nghệ thuật; (C) liên tưởng số tầng "third floor" sang "fourth floor" và thang máy.',
  },

  // 24. Suggestion (Why don't we)
  {
    id: 'q-p2-024',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'hard',
    topic: 'Marketing',
    skillTag: 'Part 2: Suggestion (Why don\'t we) & Phản biện bằng câu hỏi ngược',
    trapType: 'Bẫy trả lời Because cho câu rủ rê đề nghị & Bẫy lặp từ reserved',
    promptScript: "Why don't we reserve the downtown conference hall for our customer appreciation event?",
    media: {
      audio: {
        audioScript:
          "Why don't we reserve the downtown conference hall for our customer appreciation event? Option A: Isn't that venue likely to exceed our allocated budget? Option B: Because the customers were very polite and courteous. Option C: Yes, I reserved a hotel room for my family vacation.",
        accent: 'CA',
        speakerGender: 'male',
      },
      transcript:
        'Speaker: "Why don\'t we reserve the downtown conference hall for our customer appreciation event?"\n(A) Isn\'t that venue likely to exceed our allocated budget?\n(B) Because the customers were very polite and courteous.\n(C) Yes, I reserved a hotel room for my family vacation.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: "Isn't that venue likely to exceed our allocated budget?" },
      { key: 'B', text: 'Because the customers were very polite and courteous.' },
      { key: 'C', text: 'Yes, I reserved a hotel room for my family vacation.' },
    ],
    correctKey: 'A',
    explanation:
      'Cấu trúc "Why don\'t we..." là lời rủ rê, đề xuất giải pháp chứ không hỏi nguyên nhân. Đáp án (A) phản hồi tinh tế bằng một câu hỏi ngược chỉ ra hạn chế về ngân sách ("Isn\'t that venue likely to exceed our budget?"). Bẫy: (B) bẫy trả lời "Because" theo phản xạ cho từ Why; (C) lặp từ "reserved" nhưng sang ngữ cảnh du lịch cá nhân.',
  },

  // 25. Polite Request (Would you mind)
  {
    id: 'q-p2-025',
    partNum: 2,
    part: 'Part 2',
    section: 'listening',
    difficulty: 'medium',
    topic: 'Legal & Contracts',
    skillTag: 'Part 2: Polite Request (Would you mind) & Đồng ý với Not at all',
    trapType: 'Bẫy hiểu sai ngữ nghĩa Would you mind & Bẫy lặp từ vendor',
    promptScript: 'Would you mind reviewing the revised vendor contract before our two o\'clock conference call?',
    media: {
      audio: {
        audioScript:
          "Would you mind reviewing the revised vendor contract before our two o'clock conference call? Option A: The vendor supplies premium office stationery. Option B: Yes, I mind my own business when working. Option C: Not at all, I'll examine it right away.",
        accent: 'UK',
        speakerGender: 'female',
      },
      transcript:
        'Speaker: "Would you mind reviewing the revised vendor contract before our two o\'clock conference call?"\n(A) The vendor supplies premium office stationery.\n(B) Yes, I mind my own business when working.\n(C) Not at all, I\'ll examine it right away.',
    },
    question: 'Chọn câu phản hồi phù hợp nhất:',
    options: [
      { key: 'A', text: 'The vendor supplies premium office stationery.' },
      { key: 'B', text: 'Yes, I mind my own business when working.' },
      { key: 'C', text: "Not at all, I'll examine it right away." },
    ],
    correctKey: 'C',
    explanation:
      'Với câu hỏi lịch sự "Would you mind V-ing" (Bạn có phiền nếu...), câu đồng ý giúp đỡ phải dùng "Not at all" (Không phiền chút nào) hoặc "No, of course not". Đáp án (C) đồng ý và xác nhận sẽ xem ngay ("I\'ll examine it right away"). Bẫy: (A) lặp từ "vendor" nhưng nói về cung cấp văn phòng phẩm; (B) chơi chữ thành ngữ "mind my own business" tiêu cực.',
  },
];

