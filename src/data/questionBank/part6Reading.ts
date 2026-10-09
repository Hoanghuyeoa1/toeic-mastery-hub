import { Part6Group, Part6Question } from '../../types/questionBank';

/**
 * TOEIC Part 6: Text Completion
 * 4 Workplace Text Groups × 4 Questions = 16 Questions Total
 * Covers vocabulary, grammar, and full-sentence insertion.
 */

export const PART6_GROUPS: Part6Group[] = [
  // Group 1: Email - Office Relocation
  {
    id: 'grp-p6-001',
    groupType: 'part6_text_completion',
    partNum: 6,
    difficulty: 'medium',
    topic: 'Facilities & Corporate Operations',
    contextIntro: 'Questions 131-134 refer to the following email.',
    passageType: 'email',
    passageTitle: 'Upcoming Headquarters Relocation Timeline',
    passageContent: `To: All Staff Members <allstaff@vanguardtech.com>
From: Marcus Vance, Facilities Director <m.vance@vanguardtech.com>
Date: March 14
Subject: Office Relocation Instructions

As announced during last week's town hall meeting, Vanguard Technologies will be moving to its new corporate headquarters on Elm Street over the coming weekend. To ensure a seamless transition, all employees are requested to pack their personal belongings by Friday at 3:00 P.M.

Please label all cardboard containers [131] with your full name, department, and new desk assignment code. The logistics contractor will begin loading boxes onto moving vans shortly thereafter. [132]

Please be advised that the central server network will be taken offline starting Friday evening at 7:00 P.M. Consequently, remote desktop access will be [133] unavailable until Monday at 6:00 A.M.

We appreciate your cooperation and patience during this exciting milestone. If you have any urgent concerns regarding specialized equipment, please contact the facilities committee [134].`,
    questionIds: ['q-p6-001', 'q-p6-002', 'q-p6-003', 'q-p6-004'],
  },

  // Group 2: Memo - Software Upgrade Guidelines
  {
    id: 'grp-p6-002',
    groupType: 'part6_text_completion',
    partNum: 6,
    difficulty: 'hard',
    topic: 'Information Technology',
    contextIntro: 'Questions 135-138 refer to the following internal memorandum.',
    passageType: 'memo',
    passageTitle: 'Enterprise Resource Software Migration',
    passageContent: `MEMORANDUM
To: Accounting and Procurement Personnel
From: IT Systems Administration
Date: July 8
Subject: Migration to Apex Financial Suite

Beginning next Monday, our legacy accounting software will be officially phased out. In its place, the new cloud-based Apex Financial Suite will [135] across all corporate workstations.

Extensive beta testing has demonstrated that Apex reduces invoice processing times by nearly forty percent. [136] All personnel in affected departments must complete the self-paced online tutorial before Friday afternoon.

Please remember that access permissions [137] require multi-factor authentication upon initial login. Make sure to have your company-issued mobile token ready.

If you encounter technical errors during installation, do not attempt to modify configuration settings yourself. [138], report the issue immediately through the internal helpdesk portal.`,
    questionIds: ['q-p6-005', 'q-p6-006', 'q-p6-007', 'q-p6-008'],
  },

  // Group 3: Notice - Annual Health & Wellness Fair
  {
    id: 'grp-p6-003',
    groupType: 'part6_text_completion',
    partNum: 6,
    difficulty: 'easy',
    topic: 'Human Resources & Employee Wellness',
    contextIntro: 'Questions 139-142 refer to the following notice.',
    passageType: 'notice',
    passageTitle: 'Annual Employee Wellness Day',
    passageContent: `NOTICE
Annual Employee Wellness Exposition
Date: October 22 | Location: Grand Atrium & Fitness Studio

The Human Resources Department is pleased to sponsor the Fifth Annual Employee Wellness Exposition. This day-long event offers a [139] variety of health screenings, informative seminars, and fitness demonstrations at no charge to staff members.

Local health professionals will be on site to provide complimentary blood pressure checks, vision assessments, and personalized nutritional guidance. [140] to participating in screening booths, employees may attend mini-workshops on ergonomic office setup and stress reduction techniques.

[141] Complimentary healthy snacks and beverages will be served throughout the afternoon.

Advance registration is not mandatory for general admission, but individual consultation slots are filled on a first-come, first-served basis. Please contact the wellness coordinator at extension 4410 with any [142].`,
    questionIds: ['q-p6-009', 'q-p6-010', 'q-p6-011', 'q-p6-012'],
  },

  // Group 4: Letter - Customer Service Response
  {
    id: 'grp-p6-004',
    groupType: 'part6_text_completion',
    partNum: 6,
    difficulty: 'medium',
    topic: 'Customer Relations & Order Management',
    contextIntro: 'Questions 143-146 refer to the following letter.',
    passageType: 'letter',
    passageTitle: 'Response to Order Discrepancy Inquiry',
    passageContent: `Dear Mr. Gallagher,

Thank you for contacting Belmont Office Furnishings regarding order #B-88219, which was delivered to your architectural firm on September 4. We sincerely apologize that two of the ergonomic executive chairs arrived with damaged armrests.

At Belmont, customer satisfaction remains our absolute [143]. Upon reviewing the photos you submitted, our quality assurance team confirmed that the defect occurred during transit.

[144] A replacement shipment containing two brand-new chairs has already been dispatched via express courier and is expected to arrive at your office by Wednesday.

To return the damaged items, simply attach the prepaid shipping labels included inside the replacement packaging and hand the parcels to any courier driver. You will [145] incur any return shipping charges.

As a gesture of goodwill, we have credited fifty dollars to your account for future purchases. We deeply [146] your continued partnership and look forward to serving your design studio again.

Sincerely,
Elena Rostova
Customer Experience Supervisor`,
    questionIds: ['q-p6-013', 'q-p6-014', 'q-p6-015', 'q-p6-016'],
  },
];

export const PART6_QUESTIONS: Part6Question[] = [
  // --- Group 1 Questions (q-p6-001 -> q-p6-004) ---
  {
    id: 'q-p6-001',
    partNum: 6,
    part: 'Part 6',
    section: 'reading',
    groupId: 'grp-p6-001',
    orderInGroup: 1,
    blankNumber: 131,
    questionType: 'grammar',
    difficulty: 'easy',
    topic: 'Facilities & Corporate Operations',
    skillTag: 'Part 6: Word Form - Trạng từ bổ nghĩa clearly',
    question: 'Chọn phương án thích hợp điền vào vị trí [131]:',
    options: [
      { key: 'A', text: 'clear' },
      { key: 'B', text: 'cleared' },
      { key: 'C', text: 'clearly' },
      { key: 'D', text: 'clearness' },
    ],
    correctKey: 'C',
    explanation:
      'Chỗ trống [131] đứng sau cụm tân ngữ "all cardboard containers" để bổ nghĩa cho động từ "label" (hãy dán nhãn các thùng các-tông một cách rõ ràng). Cần một trạng từ (adverb) "clearly". (A) tính từ, (B) quá khứ phân từ, (D) danh từ.',
  },
  {
    id: 'q-p6-002',
    partNum: 6,
    part: 'Part 6',
    section: 'reading',
    groupId: 'grp-p6-001',
    orderInGroup: 2,
    blankNumber: 132,
    questionType: 'sentence_insertion',
    difficulty: 'medium',
    topic: 'Facilities & Corporate Operations',
    skillTag: 'Part 6: Sentence Insertion - Chèn câu quy định dán nhãn',
    question: 'Chọn câu văn thích hợp nhất điền vào vị trí [132]:',
    options: [
      { key: 'A', text: 'Items that are not properly labeled will be left behind.' },
      { key: 'B', text: 'New furniture was purchased during the previous fiscal quarter.' },
      { key: 'C', text: 'All business trips scheduled for next month must be canceled.' },
      { key: 'D', text: 'The parking lot will be repaved during the summer break.' },
    ],
    correctKey: 'A',
    explanation:
      'Câu phía trước đang yêu cầu nhân viên ghi rõ họ tên và mã bàn làm việc lên các thùng đồ trước khi đội vận chuyển bốc dỡ. Do đó câu [132] "Items that are not properly labeled will be left behind" (Những đồ đạc không được dán nhãn cẩn thận sẽ bị để lại) liên kết logic trực tiếp với yêu cầu dán nhãn vừa nêu.',
  },
  {
    id: 'q-p6-003',
    partNum: 6,
    part: 'Part 6',
    section: 'reading',
    groupId: 'grp-p6-001',
    orderInGroup: 3,
    blankNumber: 133,
    questionType: 'vocabulary',
    difficulty: 'medium',
    topic: 'Facilities & Corporate Operations',
    skillTag: 'Part 6: Vocabulary - Trạng từ chỉ thời gian temporarily',
    question: 'Chọn từ thích hợp điền vào vị trí [133]:',
    options: [
      { key: 'A', text: 'deliberately' },
      { key: 'B', text: 'permanently' },
      { key: 'C', text: 'doubtfully' },
      { key: 'D', text: 'temporarily' },
    ],
    correctKey: 'D',
    explanation:
      'Đoạn văn nêu máy chủ bị ngắt kết nối từ tối thứ Sáu đến sáng thứ Hai ("until Monday at 6:00 A.M."). Khoảng thời gian này là tạm thời, nên trạng từ (D) "temporarily" (tạm thời không khả dụng) là chính xác nhất. (A) deliberately (cố ý), (B) permanently (vĩnh viễn - sai vì thứ Hai đã mở lại), (C) doubtfully (nghi ngờ).',
  },
  {
    id: 'q-p6-004',
    partNum: 6,
    part: 'Part 6',
    section: 'reading',
    groupId: 'grp-p6-001',
    orderInGroup: 4,
    blankNumber: 134,
    questionType: 'grammar',
    difficulty: 'easy',
    topic: 'Facilities & Corporate Operations',
    skillTag: 'Part 6: Grammar - Trạng từ bổ nghĩa động từ promptly',
    question: 'Chọn từ thích hợp điền vào vị trí [134]:',
    options: [
      { key: 'A', text: 'prompt' },
      { key: 'B', text: 'promptly' },
      { key: 'C', text: 'prompting' },
      { key: 'D', text: 'promptness' },
    ],
    correctKey: 'B',
    explanation:
      'Chỗ trống [134] đứng cuối câu bổ nghĩa cho cụm động từ "contact the facilities committee" (hãy liên hệ với ủy ban cơ sở vật chất ngay lập tức/kịp thời). Cần trạng từ "promptly".',
  },

  // --- Group 2 Questions (q-p6-005 -> q-p6-008) ---
  {
    id: 'q-p6-005',
    partNum: 6,
    part: 'Part 6',
    section: 'reading',
    groupId: 'grp-p6-002',
    orderInGroup: 1,
    blankNumber: 135,
    questionType: 'grammar',
    difficulty: 'medium',
    topic: 'Information Technology',
    skillTag: 'Part 6: Grammar - Thể bị động will be installed',
    question: 'Chọn cấu trúc động từ thích hợp điền vào vị trí [135]:',
    options: [
      { key: 'A', text: 'install' },
      { key: 'B', text: 'be installed' },
      { key: 'C', text: 'installed' },
      { key: 'D', text: 'have installed' },
    ],
    correctKey: 'B',
    explanation:
      'Chủ ngữ là "the new cloud-based Apex Financial Suite" (bộ phần mềm tài chính mới) là đối tượng chịu tác động của hành động cài đặt, sau trợ động từ "will" cần dạng bị động "will be installed". (A, D) là dạng chủ động, (C) thiếu trợ động từ be.',
  },
  {
    id: 'q-p6-006',
    partNum: 6,
    part: 'Part 6',
    section: 'reading',
    groupId: 'grp-p6-002',
    orderInGroup: 2,
    blankNumber: 136,
    questionType: 'sentence_insertion',
    difficulty: 'hard',
    topic: 'Information Technology',
    skillTag: 'Part 6: Sentence Insertion - Chèn câu chuyển tiếp chuẩn bị phần mềm',
    question: 'Chọn câu văn thích hợp nhất điền vào vị trí [136]:',
    options: [
      { key: 'A', text: 'However, mastering its modernized interface requires adequate preparation.' },
      { key: 'B', text: 'The old computer hardware will be donated to a local school.' },
      { key: 'C', text: 'Our revenue exceeded initial quarterly projections by fifteen percent.' },
      { key: 'D', text: 'Please turn off the office lights when leaving for the day.' },
    ],
    correctKey: 'A',
    explanation:
      'Câu liền trước ca ngợi ưu điểm giảm thời gian xử lý hóa đơn của phần mềm mới, câu liền sau yêu cầu tất cả nhân sự phải hoàn thành khóa hướng dẫn trực tuyến trước thứ Sáu. Câu (A) đóng vai trò chuyển tiếp hoàn hảo: "Tuy nhiên, để làm chủ giao diện hiện đại hóa của phần mềm cần có sự chuẩn bị chu đáo", dẫn dắt trực tiếp vào yêu cầu học tập ở câu sau.',
  },
  {
    id: 'q-p6-007',
    partNum: 6,
    part: 'Part 6',
    section: 'reading',
    groupId: 'grp-p6-002',
    orderInGroup: 3,
    blankNumber: 137,
    questionType: 'vocabulary',
    difficulty: 'medium',
    topic: 'Information Technology',
    skillTag: 'Part 6: Vocabulary - Trạng từ yêu cầu strictly require',
    question: 'Chọn từ thích hợp điền vào vị trí [137]:',
    options: [
      { key: 'A', text: 'mandatorily' },
      { key: 'B', text: 'expressly' },
      { key: 'C', text: 'strictly' },
      { key: 'D', text: 'specifically' },
    ],
    correctKey: 'C',
    explanation:
      'Collocation "strictly require" (yêu cầu nghiêm ngặt/bắt buộc). Trong câu "access permissions strictly require multi-factor authentication", trạng từ (C) "strictly" đi với động từ "require" thể hiện tính chất bảo mật bắt buộc của hệ thống CNTT.',
  },
  {
    id: 'q-p6-008',
    partNum: 6,
    part: 'Part 6',
    section: 'reading',
    groupId: 'grp-p6-002',
    orderInGroup: 4,
    blankNumber: 138,
    questionType: 'vocabulary',
    difficulty: 'medium',
    topic: 'Information Technology',
    skillTag: 'Part 6: Vocabulary - Liên từ chuyển tiếp Instead',
    question: 'Chọn liên từ chuyển tiếp thích hợp điền vào vị trí [138]:',
    options: [
      { key: 'A', text: 'Furthermore' },
      { key: 'B', text: 'Consequently' },
      { key: 'C', text: 'Similarly' },
      { key: 'D', text: 'Instead' },
    ],
    correctKey: 'D',
    explanation:
      'Câu trước nói "do not attempt to modify configuration settings yourself" (đừng tự ý chỉnh sửa cài đặt), câu sau nêu hành động thay thế nên làm: "report the issue immediately..." (hãy báo cáo ngay qua cổng hỗ trợ). Liên từ (D) "Instead" (Thay vào đó) thể hiện sự thay thế chính xác giữa 2 hành động.',
  },

  // --- Group 3 Questions (q-p6-009 -> q-p6-012) ---
  {
    id: 'q-p6-009',
    partNum: 6,
    part: 'Part 6',
    section: 'reading',
    groupId: 'grp-p6-003',
    orderInGroup: 1,
    blankNumber: 139,
    questionType: 'grammar',
    difficulty: 'easy',
    topic: 'Human Resources & Employee Wellness',
    skillTag: 'Part 6: Grammar - Tính từ trong cụm a wide variety of',
    question: 'Chọn từ loại thích hợp điền vào vị trí [139]:',
    options: [
      { key: 'A', text: 'wide' },
      { key: 'B', text: 'widely' },
      { key: 'C', text: 'widen' },
      { key: 'D', text: 'width' },
    ],
    correctKey: 'A',
    explanation:
      'Cụm từ "a wide variety of" (vô số, rất nhiều loại) là collocation kinh điển trong đề thi TOEIC. Sau mạo từ "a" và trước danh từ "variety" cần tính từ "wide".',
  },
  {
    id: 'q-p6-010',
    partNum: 6,
    part: 'Part 6',
    section: 'reading',
    groupId: 'grp-p6-003',
    orderInGroup: 2,
    blankNumber: 140,
    questionType: 'vocabulary',
    difficulty: 'medium',
    topic: 'Human Resources & Employee Wellness',
    skillTag: 'Part 6: Vocabulary - Cụm liên từ In addition to',
    question: 'Chọn cụm từ thích hợp điền vào vị trí [140]:',
    options: [
      { key: 'A', text: 'Prior' },
      { key: 'B', text: 'Except' },
      { key: 'C', text: 'In addition' },
      { key: 'D', text: 'Opposed' },
    ],
    correctKey: 'C',
    explanation:
      'Phía sau có "to participating in screening booths...", tạo thành cụm liên từ "In addition to + V-ing" (Bên cạnh / Ngoài việc tham gia vào các quầy khám sàng lọc, nhân viên còn có thể dự hội thảo nhỏ...). Chọn (C) "In addition". Các phương án khác: "Prior to" mang nghĩa trước khi (không hợp nghĩa), "Except for", "As opposed to".',
  },
  {
    id: 'q-p6-011',
    partNum: 6,
    part: 'Part 6',
    section: 'reading',
    groupId: 'grp-p6-003',
    orderInGroup: 3,
    blankNumber: 141,
    questionType: 'sentence_insertion',
    difficulty: 'medium',
    topic: 'Human Resources & Employee Wellness',
    skillTag: 'Part 6: Sentence Insertion - Chèn câu giải thích lịch so le',
    question: 'Chọn câu văn thích hợp nhất điền vào vị trí [141]:',
    options: [
      { key: 'A', text: 'Managers must approve all annual leave requests by the end of this week.' },
      { key: 'B', text: 'Sessions are scheduled at staggered intervals so staff can visit during lunch hours.' },
      { key: 'C', text: 'The parking structure will be closed for structural repairs until December.' },
      { key: 'D', text: 'Employees must purchase their own gym equipment for home workouts.' },
    ],
    correctKey: 'B',
    explanation:
      'Đoạn văn đang nói về ngày hội sức khỏe với các gian hàng khám và hội thảo, câu tiếp theo nhắc đến đồ ăn nhẹ phục vụ suốt buổi chiều. Câu (B) "Sessions are scheduled at staggered intervals so staff can visit during lunch hours" (Các buổi được bố trí vào các khung giờ so le để nhân viên có thể ghé qua vào giờ nghỉ trưa) giải thích cách nhân viên sắp xếp thời gian tham gia hội thảo trong ngày làm việc.',
  },
  {
    id: 'q-p6-012',
    partNum: 6,
    part: 'Part 6',
    section: 'reading',
    groupId: 'grp-p6-003',
    orderInGroup: 4,
    blankNumber: 142,
    questionType: 'vocabulary',
    difficulty: 'easy',
    topic: 'Human Resources & Employee Wellness',
    skillTag: 'Part 6: Vocabulary - Danh từ thắc mắc inquiries',
    question: 'Chọn từ thích hợp điền vào vị trí [142]:',
    options: [
      { key: 'A', text: 'complaints' },
      { key: 'B', text: 'disputes' },
      { key: 'C', text: 'penalties' },
      { key: 'D', text: 'inquiries' },
    ],
    correctKey: 'D',
    explanation:
      'Cụm "contact ... with any inquiries" (liên hệ điều phối viên nếu có bất kỳ thắc mắc/câu hỏi nào). Do đó chọn (D) "inquiries". Các từ khác mang sắc thái tiêu cực không phù hợp thông báo sự kiện nội bộ: (A) khiếu nại, (B) tranh chấp, (C) hình phạt.',
  },

  // --- Group 4 Questions (q-p6-013 -> q-p6-016) ---
  {
    id: 'q-p6-013',
    partNum: 6,
    part: 'Part 6',
    section: 'reading',
    groupId: 'grp-p6-004',
    orderInGroup: 1,
    blankNumber: 143,
    questionType: 'vocabulary',
    difficulty: 'easy',
    topic: 'Customer Relations & Order Management',
    skillTag: 'Part 6: Vocabulary - Danh từ ưu tiên priority',
    question: 'Chọn danh từ thích hợp điền vào vị trí [143]:',
    options: [
      { key: 'A', text: 'hesitation' },
      { key: 'B', text: 'priority' },
      { key: 'C', text: 'distraction' },
      { key: 'D', text: 'obstacle' },
    ],
    correctKey: 'B',
    explanation:
      'Collocation doanh nghiệp rất quen thuộc: "customer satisfaction is our absolute priority" (sự hài lòng của khách hàng là ưu tiên tuyệt đối của chúng tôi). Chọn (B) "priority". Các từ còn lại: (A) hesitation (sự ngập ngừng), (C) distraction (sự xao nhãng), (D) obstacle (chướng ngại vật).',
  },
  {
    id: 'q-p6-014',
    partNum: 6,
    part: 'Part 6',
    section: 'reading',
    groupId: 'grp-p6-004',
    orderInGroup: 2,
    blankNumber: 144,
    questionType: 'sentence_insertion',
    difficulty: 'medium',
    topic: 'Customer Relations & Order Management',
    skillTag: 'Part 6: Sentence Insertion - Chèn câu giải pháp đổi hàng mới',
    question: 'Chọn câu văn thích hợp nhất điền vào vị trí [144]:',
    options: [
      { key: 'A', text: 'Please pay the overdue balance on your account within ten business days.' },
      { key: 'B', text: 'Our retail showroom will be closed on bank holidays.' },
      { key: 'C', text: 'Custom furniture orders cannot be modified once manufactured.' },
      { key: 'D', text: 'We have initiated an immediate replacement order at no expense to you.' },
    ],
    correctKey: 'D',
    explanation:
      'Câu liền trước xác nhận lỗi hỏng tay vịn ghế xảy ra trong quá trình vận chuyển, câu liền sau nói chuyến hàng thay thế gồm 2 ghế mới toanh đã được gửi đi. Do đó câu (D) "We have initiated an immediate replacement order at no expense to you" (Chúng tôi đã lập tức khởi tạo đơn hàng thay thế mà quý khách không phải trả thêm bất kỳ chi phí nào) là câu nối logic hoàn hảo.',
  },
  {
    id: 'q-p6-015',
    partNum: 6,
    part: 'Part 6',
    section: 'reading',
    groupId: 'grp-p6-004',
    orderInGroup: 3,
    blankNumber: 145,
    questionType: 'grammar',
    difficulty: 'medium',
    topic: 'Customer Relations & Order Management',
    skillTag: 'Part 6: Grammar - Trợ từ phủ định will not incur',
    question: 'Chọn từ thích hợp điền vào vị trí [145]:',
    options: [
      { key: 'A', text: 'not' },
      { key: 'B', text: 'never' },
      { key: 'C', text: 'no' },
      { key: 'D', text: 'none' },
    ],
    correctKey: 'A',
    explanation:
      'Sau trợ động từ "will" và trước động từ nguyên thể "incur" cần từ phủ định "not" ("You will not incur any return shipping charges" - Quý khách sẽ không phải chịu bất kỳ chi phí gửi hàng trả lại nào).',
  },
  {
    id: 'q-p6-016',
    partNum: 6,
    part: 'Part 6',
    section: 'reading',
    groupId: 'grp-p6-004',
    orderInGroup: 4,
    blankNumber: 146,
    questionType: 'vocabulary',
    difficulty: 'easy',
    topic: 'Customer Relations & Order Management',
    skillTag: 'Part 6: Vocabulary - Động từ cảm kích appreciate',
    question: 'Chọn động từ thích hợp điền vào vị trí [146]:',
    options: [
      { key: 'A', text: 'ignore' },
      { key: 'B', text: 'prohibit' },
      { key: 'C', text: 'appreciate' },
      { key: 'D', text: 'calculate' },
    ],
    correctKey: 'C',
    explanation:
      'Trong thư chăm sóc khách hàng, cụm từ kết thúc lịch thiệp: "We deeply appreciate your continued partnership" (Chúng tôi vô cùng trân trọng sự hợp tác liên tục của quý khách). Chọn (C) "appreciate". Các phương án khác: (A) ignore (phớt lờ), (B) prohibit (ngăn cấm), (D) calculate (tính toán).',
  },
];
