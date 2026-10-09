/**
 * TOEIC Mastery Hub — Listening Question Bank
 * Part 1: Photographs (10 High-Quality Questions)
 * 
 * Features:
 * - 10 genuine SVG photo illustrations with detailed contextual elements
 * - 4 options A-D with complete TTS statement scripts
 * - 1 clear correct answer + 3 plausible ETS distractors (sound traps, being+V3 traps, wrong subjects)
 * - Deep pedagogical Vietnamese explanations and trap tags
 */

import { Part1Question } from '../../types/questionBank';

export const PART1_QUESTIONS: Part1Question[] = [
  {
    id: 'q-p1-001',
    partNum: 1,
    part: 'Part 1',
    section: 'listening',
    difficulty: 'easy',
    topic: 'Office',
    skillTag: 'Part 1: Hành động người (Nhìn & Xem tài liệu)',
    trapType: 'Bẫy Being + V3 trên tranh tĩnh & Sai hành động',
    media: {
      visual: {
        illustrationId: 'office_woman_photo',
        altText: 'A woman in business attire reviewing a folder next to an office shelf.',
      },
      audio: {
        audioScript:
          'Statement A: She is assembling some office furniture. Statement B: She is examining a folder. Statement C: Files are being discarded in a bin. Statement D: She is typing on a computer keyboard.',
        accent: 'US',
        speakerGender: 'female',
      },
      transcript:
        '(A) She is assembling some office furniture.\n(B) She is examining a folder.\n(C) Files are being discarded in a bin.\n(D) She is typing on a computer keyboard.',
    },
    question: 'Chọn câu miêu tả đúng nhất cho bức tranh:',
    options: [
      { key: 'A', text: 'She is assembling some office furniture.' },
      { key: 'B', text: 'She is examining a folder.' },
      { key: 'C', text: 'Files are being discarded in a bin.' },
      { key: 'D', text: 'She is typing on a computer keyboard.' },
    ],
    correctKey: 'B',
    explanation:
      'Đáp án (B) chính xác vì bức tranh thể hiện rõ người phụ nữ đang cầm và mở một tệp tài liệu để xem xét (examining a folder). Các phương án gây nhiễu: (A) sai hành động vì đồ đạc đã được lắp sẵn; (C) bẫy bị động "being discarded" mô tả hành động vứt tài liệu đang diễn ra; (D) sai đối tượng thao tác vì không có máy tính trong tay cô ấy.',
  },
  {
    id: 'q-p1-002',
    partNum: 1,
    part: 'Part 1',
    section: 'listening',
    difficulty: 'medium',
    topic: 'Office',
    skillTag: 'Part 1: Tranh tĩnh không người (Vật thể & Vị trí)',
    trapType: 'Bẫy Being + V3 khi tranh hoàn toàn không có người',
    media: {
      visual: {
        illustrationId: 'conference_room_photo',
        altText: 'A modern conference room with chairs neatly positioned around a large oval wooden table.',
      },
      audio: {
        audioScript:
          'Statement A: A presentation is being conducted. Statement B: Some chairs are arranged around a table. Statement C: People are leaving the conference room. Statement D: The table is being wiped down.',
        accent: 'US',
        speakerGender: 'male',
      },
      transcript:
        '(A) A presentation is being conducted.\n(B) Some chairs are arranged around a table.\n(C) People are leaving the conference room.\n(D) The table is being wiped down.',
    },
    question: 'Chọn câu miêu tả đúng nhất cho bức tranh:',
    options: [
      { key: 'A', text: 'A presentation is being conducted.' },
      { key: 'B', text: 'Some chairs are arranged around a table.' },
      { key: 'C', text: 'People are leaving the conference room.' },
      { key: 'D', text: 'The table is being wiped down.' },
    ],
    correctKey: 'B',
    explanation:
      'Đáp án (B) đúng vì bức tranh phòng họp trống người, các ghế xoay văn phòng được sắp xếp trật tự quanh bàn hội nghị lớn (arranged around a table). Phân tích bẫy: (A) và (D) sử dụng cấu trúc "is being + V3" chỉ hành động đang diễn ra bởi con người (đang thuyết trình / đang lau bàn), trong khi phòng không có ai; (C) sai vì không có người xuất hiện.',
  },
  {
    id: 'q-p1-003',
    partNum: 1,
    part: 'Part 1',
    section: 'listening',
    difficulty: 'easy',
    topic: 'Technology',
    skillTag: 'Part 1: Hành động người (Thao tác thiết bị văn phòng)',
    trapType: 'Bẫy động từ Wear vs Put on & Lẫn lộn thiết bị',
    media: {
      visual: {
        illustrationId: 'man_typing_laptop',
        altText: 'A man wearing glasses sitting at his desk typing on a laptop keyboard.',
      },
      audio: {
        audioScript:
          'Statement A: A man is typing on a keyboard. Statement B: A man is putting on his glasses. Statement C: A computer monitor is being repaired. Statement D: A coffee cup is being filled.',
        accent: 'US',
        speakerGender: 'male',
      },
      transcript:
        '(A) A man is typing on a keyboard.\n(B) A man is putting on his glasses.\n(C) A computer monitor is being repaired.\n(D) A coffee cup is being filled.',
    },
    question: 'Chọn câu miêu tả đúng nhất cho bức tranh:',
    options: [
      { key: 'A', text: 'A man is typing on a keyboard.' },
      { key: 'B', text: 'A man is putting on his glasses.' },
      { key: 'C', text: 'A computer monitor is being repaired.' },
      { key: 'D', text: 'A coffee cup is being filled.' },
    ],
    correctKey: 'A',
    explanation:
      'Đáp án (A) chính xác: người đàn ông đang đặt hai tay lên bàn phím máy tính xách tay và gõ phím (typing on a keyboard). Phân tích bẫy: (B) bẫy kinh điển "putting on" (hành động đang đeo kính vào) thay vì "wearing" (trạng thái đã đeo kính trên mặt); (C) bẫy "being repaired" khi màn hình đang hiển thị bình thường; (D) bẫy "being filled" khi cốc cà phê chỉ đặt tĩnh trên bàn.',
  },
  {
    id: 'q-p1-004',
    partNum: 1,
    part: 'Part 1',
    section: 'listening',
    difficulty: 'medium',
    topic: 'Logistics',
    skillTag: 'Part 1: Nhà kho & Vận chuyển hàng hóa',
    trapType: 'Bẫy hành động Push vs Pull & Trạng thái dỡ hàng',
    media: {
      visual: {
        illustrationId: 'warehouse_loading_boxes',
        altText: 'A warehouse employee pushing a hand cart loaded with stacked cardboard boxes.',
      },
      audio: {
        audioScript:
          'Statement A: Packages are being unloaded from a truck. Statement B: A worker is pushing a loaded cart. Statement C: Storage shelves are completely empty. Statement D: A cart is being repaired in an aisle.',
        accent: 'UK',
        speakerGender: 'female',
      },
      transcript:
        '(A) Packages are being unloaded from a truck.\n(B) A worker is pushing a loaded cart.\n(C) Storage shelves are completely empty.\n(D) A cart is being repaired in an aisle.',
    },
    question: 'Chọn câu miêu tả đúng nhất cho bức tranh:',
    options: [
      { key: 'A', text: 'Packages are being unloaded from a truck.' },
      { key: 'B', text: 'A worker is pushing a loaded cart.' },
      { key: 'C', text: 'Storage shelves are completely empty.' },
      { key: 'D', text: 'A cart is being repaired in an aisle.' },
    ],
    correctKey: 'B',
    explanation:
      'Đáp án (B) mô tả chính xác: nhân viên nhà kho đang đẩy chiếc xe đẩy hàng chở đầy các thùng các-tông (pushing a loaded cart). Phân tích bẫy: (A) không có xe tải xuất hiện trong khung cảnh nhà kho; (C) mâu thuẫn trực tiếp vì các kệ hàng đang chứa nhiều kiện hàng; (D) bẫy "being repaired" trong khi xe đang được vận hành bình thường.',
  },
  {
    id: 'q-p1-005',
    partNum: 1,
    part: 'Part 1',
    section: 'listening',
    difficulty: 'hard',
    topic: 'Construction',
    skillTag: 'Part 1: Công trường & Bản vẽ kỹ thuật',
    trapType: 'Bẫy danh từ bản vẽ vs dọn dẹp vật liệu',
    media: {
      visual: {
        illustrationId: 'construction_site_worker',
        altText: 'A construction engineer in a hard hat and safety vest reviewing an open blueprint.',
      },
      audio: {
        audioScript:
          'Statement A: Some bricks are being stacked on a platform. Statement B: An engineer is reviewing a blueprint. Statement C: A safety helmet is lying on the ground. Statement D: Scaffolding is being dismantled.',
        accent: 'US',
        speakerGender: 'female',
      },
      transcript:
        '(A) Some bricks are being stacked on a platform.\n(B) An engineer is reviewing a blueprint.\n(C) A safety helmet is lying on the ground.\n(D) Scaffolding is being dismantled.',
    },
    question: 'Chọn câu miêu tả đúng nhất cho bức tranh:',
    options: [
      { key: 'A', text: 'Some bricks are being stacked on a platform.' },
      { key: 'B', text: 'An engineer is reviewing a blueprint.' },
      { key: 'C', text: 'A safety helmet is lying on the ground.' },
      { key: 'D', text: 'Scaffolding is being dismantled.' },
    ],
    correctKey: 'B',
    explanation:
      'Đáp án (B) đúng vì kỹ sư đang giương rộng và chăm chú kiểm tra bản vẽ thiết kế công trình (reviewing a blueprint). Phân tích bẫy: (A) không có hoạt động xếp gạch; (C) mũ bảo hộ đang được đội trên đầu người kỹ sư chứ không nằm trên mặt đất; (D) giàn giáo vẫn đứng cố định phía sau, không hề bị tháo dỡ (dismantled).',
  },
  {
    id: 'q-p1-006',
    partNum: 1,
    part: 'Part 1',
    section: 'listening',
    difficulty: 'easy',
    topic: 'Restaurant',
    skillTag: 'Part 1: Nhà bếp & Chuẩn bị món ăn',
    trapType: 'Bẫy phục vụ món ăn vs Chuẩn bị nguyên liệu',
    media: {
      visual: {
        illustrationId: 'chef_preparing_food',
        altText: 'A chef in uniform chopping fresh vegetables on a wooden cutting board.',
      },
      audio: {
        audioScript:
          'Statement A: Food is being served to restaurant diners. Statement B: A chef is preparing food on a counter. Statement C: Pots and pans are being washed in a sink. Statement D: Vegetables are being harvested in a field.',
        accent: 'AU',
        speakerGender: 'male',
      },
      transcript:
        '(A) Food is being served to restaurant diners.\n(B) A chef is preparing food on a counter.\n(C) Pots and pans are being washed in a sink.\n(D) Vegetables are being harvested in a field.',
    },
    question: 'Chọn câu miêu tả đúng nhất cho bức tranh:',
    options: [
      { key: 'A', text: 'Food is being served to restaurant diners.' },
      { key: 'B', text: 'A chef is preparing food on a counter.' },
      { key: 'C', text: 'Pots and pans are being washed in a sink.' },
      { key: 'D', text: 'Vegetables are being harvested in a field.' },
    ],
    correctKey: 'B',
    explanation:
      'Đáp án (B) miêu tả chuẩn xác: đầu bếp đang sơ chế nguyên liệu trên quầy bếp (preparing food on a counter). Phân tích bẫy: (A) bẫy liên tưởng chủ đề nhà hàng nhưng không có thực khách (diners); (C) xoong nồi đang treo trên giá chứ không được rửa trong bồn; (D) bối cảnh là nhà bếp trong nhà chứ không phải ngoài ruộng đồng.',
  },
  {
    id: 'q-p1-007',
    partNum: 1,
    part: 'Part 1',
    section: 'listening',
    difficulty: 'medium',
    topic: 'Retail',
    skillTag: 'Part 1: Giao dịch bán hàng & Quầy thanh toán',
    trapType: 'Bẫy Merchandise display vs Payment transaction',
    media: {
      visual: {
        illustrationId: 'customer_cashier_counter',
        altText: 'A customer extending a payment card across a store checkout counter to a cashier.',
      },
      audio: {
        audioScript:
          'Statement A: A customer is making a payment at a counter. Statement B: Merchandise is being displayed in a shop window. Statement C: A cashier is cleaning a cash register. Statement D: Groceries are being loaded into a vehicle.',
        accent: 'US',
        speakerGender: 'female',
      },
      transcript:
        '(A) A customer is making a payment at a counter.\n(B) Merchandise is being displayed in a shop window.\n(C) A cashier is cleaning a cash register.\n(D) Groceries are being loaded into a vehicle.',
    },
    question: 'Chọn câu miêu tả đúng nhất cho bức tranh:',
    options: [
      { key: 'A', text: 'A customer is making a payment at a counter.' },
      { key: 'B', text: 'Merchandise is being displayed in a shop window.' },
      { key: 'C', text: 'A cashier is cleaning a cash register.' },
      { key: 'D', text: 'Groceries are being loaded into a vehicle.' },
    ],
    correctKey: 'A',
    explanation:
      'Đáp án (A) chính xác: khách hàng đang đưa thẻ thanh toán qua quầy thu ngân để chi trả (making a payment at a counter). Phân tích bẫy: (B) không có cửa kính trưng bày (shop window); (C) thu ngân đang tiếp nhận thanh toán chứ không lau chùi máy tính tiền; (D) không có phương tiện xe cộ trong quầy thanh toán.',
  },
  {
    id: 'q-p1-008',
    partNum: 1,
    part: 'Part 1',
    section: 'listening',
    difficulty: 'medium',
    topic: 'Education',
    skillTag: 'Part 1: Thư viện & Thao tác chọn sách',
    trapType: 'Bẫy Reach for vs Read / Checking out books',
    media: {
      visual: {
        illustrationId: 'library_bookshelves_reader',
        altText: 'A library patron reaching upward toward a book on a high wooden bookshelf.',
      },
      audio: {
        audioScript:
          'Statement A: Books are being checked out at a front desk. Statement B: A person is reaching for an item on a shelf. Statement C: A bookshelf is being moved across a room. Statement D: Someone is sitting at a study table.',
        accent: 'UK',
        speakerGender: 'female',
      },
      transcript:
        '(A) Books are being checked out at a front desk.\n(B) A person is reaching for an item on a shelf.\n(C) A bookshelf is being moved across a room.\n(D) Someone is sitting at a study table.',
    },
    question: 'Chọn câu miêu tả đúng nhất cho bức tranh:',
    options: [
      { key: 'A', text: 'Books are being checked out at a front desk.' },
      { key: 'B', text: 'A person is reaching for an item on a shelf.' },
      { key: 'C', text: 'A bookshelf is being moved across a room.' },
      { key: 'D', text: 'Someone is sitting at a study table.' },
    ],
    correctKey: 'B',
    explanation:
      'Đáp án (B) đúng với hành động cụ thể của người đọc trong tranh: vươn tay lên giá cao để lấy sách (reaching for an item on a shelf). Phân tích bẫy: (A) không có quầy lễ tân làm thủ tục mượn sách; (C) giá sách đứng yên cố định; (D) người trong tranh đang đứng chứ không ngồi tại bàn học.',
  },
  {
    id: 'q-p1-009',
    partNum: 1,
    part: 'Part 1',
    section: 'listening',
    difficulty: 'hard',
    topic: 'Travel',
    skillTag: 'Part 1: Nhà ga & Băng chuyền hành lý sân bay',
    trapType: 'Bẫy hành khách lên máy bay vs Băng chuyền nhận hành lý',
    media: {
      visual: {
        illustrationId: 'airport_luggage_conveyor',
        altText: 'Suitcases moving along an airport baggage claim carousel underneath an informational display.',
      },
      audio: {
        audioScript:
          'Statement A: Passengers are boarding an airplane. Statement B: Luggage is moving along a conveyor belt. Statement C: Suitcases are being packed in a hotel room. Statement D: An airport runway is covered in snow.',
        accent: 'US',
        speakerGender: 'male',
      },
      transcript:
        '(A) Passengers are boarding an airplane.\n(B) Luggage is moving along a conveyor belt.\n(C) Suitcases are being packed in a hotel room.\n(D) An airport runway is covered in snow.',
    },
    question: 'Chọn câu miêu tả đúng nhất cho bức tranh:',
    options: [
      { key: 'A', text: 'Passengers are boarding an airplane.' },
      { key: 'B', text: 'Luggage is moving along a conveyor belt.' },
      { key: 'C', text: 'Suitcases are being packed in a hotel room.' },
      { key: 'D', text: 'An airport runway is covered in snow.' },
    ],
    correctKey: 'B',
    explanation:
      'Đáp án (B) miêu tả chính xác bức tranh khu vực trả hành lý sân bay: các vali đang di chuyển trên băng chuyền tròn (luggage is moving along a conveyor belt). Phân tích bẫy: (A) bẫy liên tưởng hàng không nhưng không có máy bay hay hành khách đang lên cửa; (C) bẫy bối cảnh phòng khách sạn; (D) hoàn toàn không có đường băng ngoài trời.',
  },
  {
    id: 'q-p1-010',
    partNum: 1,
    part: 'Part 1',
    section: 'listening',
    difficulty: 'easy',
    topic: 'Public Space',
    skillTag: 'Part 1: Cảnh quan công viên (Tranh tĩnh ngoài trời)',
    trapType: 'Bẫy người ngồi trên ghế vs Ghế trống nhìn ra đài phun nước',
    media: {
      visual: {
        illustrationId: 'park_bench_fountain',
        altText: 'An empty wooden park bench facing a round water fountain in a public park.',
      },
      audio: {
        audioScript:
          'Statement A: Some people are sitting on a park bench. Statement B: A bench is positioned near a water fountain. Statement C: A fountain is being repaired by a technician. Statement D: Trees are being planted along a walkway.',
        accent: 'US',
        speakerGender: 'female',
      },
      transcript:
        '(A) Some people are sitting on a park bench.\n(B) A bench is positioned near a water fountain.\n(C) A fountain is being repaired by a technician.\n(D) Trees are being planted along a walkway.',
    },
    question: 'Chọn câu miêu tả đúng nhất cho bức tranh:',
    options: [
      { key: 'A', text: 'Some people are sitting on a park bench.' },
      { key: 'B', text: 'A bench is positioned near a water fountain.' },
      { key: 'C', text: 'A fountain is being repaired by a technician.' },
      { key: 'D', text: 'Trees are being planted along a walkway.' },
    ],
    correctKey: 'B',
    explanation:
      'Đáp án (B) miêu tả chính xác vị trí tĩnh: chiếc ghế băng gỗ ngoài trời nằm gần đài phun nước (positioned near a water fountain). Phân tích bẫy: (A) ghế hoàn toàn trống, không có người ngồi; (C) đài phun nước đang hoạt động bình thường, không có thợ sửa chữa; (D) cây xanh đã mọc lớn từ trước chứ không đang được trồng mới.',
  },
];
