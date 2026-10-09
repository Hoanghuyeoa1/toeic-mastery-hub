/**
 * TOEIC Mastery Hub — Listening Question Bank
 * Part 4: Short Talks (10 Groups × 3 Questions = 30 Questions)
 * 
 * Features:
 * - Authentic spoken workplace talks: Announcements, Voicemails, Store Broadcasts, Training, News, Transit, Business Presentations, Cultural Events
 * - Grouped questions with strict two-way link integrity
 * - Real-world business & public communication contexts
 * - Support for graphic-based talk (Group 3 with Store Floor Directory)
 * - Deep pedagogical Vietnamese explanations and trap analyses
 */

import { Part4Group, Part4Question } from '../../types/questionBank';

// PART 4 GROUPS (10 Groups)
export const PART4_GROUPS: Part4Group[] = [
  // Group 1: Public Airport Announcement (Flight Gate Change & Boarding)
  {
    id: 'grp-p4-001',
    groupType: 'part4_talk',
    partNum: 4,
    difficulty: 'easy',
    topic: 'Travel',
    contextIntro: 'Questions 71 through 73 refer to the following airport announcement.',
    media: {
      audio: {
        audioScript:
          'May I have your attention, passengers booked on Skyways Flight 408 with nonstop service to Atlanta. Due to unexpected aircraft maintenance at Gate B14, your departure gate has been reassigned to Gate C22 at the far end of Concourse C. We apologize for the inconvenience. Boarding will commence promptly at four forty-five PM. Passengers traveling with small children or requiring special boarding assistance are kindly requested to present their boarding passes at the counter first.',
        accent: 'US',
      },
      transcript:
        'May I have your attention, passengers booked on Skyways Flight 408 with nonstop service to Atlanta. Due to unexpected aircraft maintenance at Gate B14, your departure gate has been reassigned to Gate C22 at the far end of Concourse C. We apologize for the inconvenience. Boarding will commence promptly at four forty-five PM. Passengers traveling with small children or requiring special boarding assistance are kindly requested to present their boarding passes at the counter first.',
    },
    questionIds: ['q-p4-001', 'q-p4-002', 'q-p4-003'],
  },

  // Group 2: Corporate Voicemail / Phone Message (Vendor Discount Offer)
  {
    id: 'grp-p4-002',
    groupType: 'part4_talk',
    partNum: 4,
    difficulty: 'medium',
    topic: 'Procurement',
    contextIntro: 'Questions 74 through 76 refer to the following recorded telephone message.',
    media: {
      audio: {
        audioScript:
          'Hello Mr. Henderson, this is Rebecca Cole calling from Summit Office Paper and Supplies. I am reaching out regarding your purchase order for printer paper and ink cartridges submitted yesterday. Because your organization is ordering in bulk quantities exceeding five hundred cartons, your order qualifies for our fifteen percent volume discount. However, we need you to sign and return the updated purchase agreement before we can process shipping. Please review the attached contract sent to your email and reply by five PM today so we can guarantee delivery by Friday.',
        accent: 'UK',
      },
      transcript:
        'Hello Mr. Henderson, this is Rebecca Cole calling from Summit Office Paper and Supplies. I am reaching out regarding your purchase order for printer paper and ink cartridges submitted yesterday. Because your organization is ordering in bulk quantities exceeding five hundred cartons, your order qualifies for our fifteen percent volume discount. However, we need you to sign and return the updated purchase agreement before we can process shipping. Please review the attached contract sent to your email and reply by five PM today so we can guarantee delivery by Friday.',
    },
    questionIds: ['q-p4-004', 'q-p4-005', 'q-p4-006'],
  },

  // Group 3: Graphic-Based Talk — In-Store Retail Announcement (Store Floor Directory)
  {
    id: 'grp-p4-003',
    groupType: 'part4_talk',
    partNum: 4,
    difficulty: 'hard',
    topic: 'Retail',
    contextIntro: 'Questions 77 through 79 refer to the following announcement and store directory.',
    media: {
      audio: {
        audioScript:
          'Good afternoon, shoppers, and welcome to Grand Central Department Store’s annual clearance sale! We have storewide discounts up to forty percent on apparel and home accessories throughout this weekend. Please be advised that because of ongoing floor renovation on Floor 3, our kitchen appliances and cookware section has been temporarily moved to the Floor 4 Annex, right next to customer service. Also, don’t forget that loyalty club members receive an additional ten percent discount at checkout when scanning their mobile membership app today.',
        accent: 'US',
      },
      graphic: {
        type: 'map',
        illustrationId: 'store_directory_graphic',
        altText: 'Grand Central Department Store Directory: Floor 1 (Cosmetics), Floor 2 (Apparel), Floor 3 (Home Goods - Kitchenware moved), Floor 4 (Kitchen Appliances Annex, Electronics & Customer Service).',
      },
      transcript:
        'Good afternoon, shoppers, and welcome to Grand Central Department Store’s annual clearance sale! We have storewide discounts up to forty percent on apparel and home accessories throughout this weekend. Please be advised that because of ongoing floor renovation on Floor 3, our kitchen appliances and cookware section has been temporarily moved to the Floor 4 Annex, right next to customer service. Also, don’t forget that loyalty club members receive an additional ten percent discount at checkout when scanning their mobile membership app today.',
    },
    questionIds: ['q-p4-007', 'q-p4-008', 'q-p4-009'],
  },

  // Group 4: Workplace Training Session Introduction (Cybersecurity Workshop)
  {
    id: 'grp-p4-004',
    groupType: 'part4_talk',
    partNum: 4,
    difficulty: 'medium',
    topic: 'Training',
    contextIntro: 'Questions 80 through 82 refer to the following talk.',
    media: {
      audio: {
        audioScript:
          'Good morning everyone and welcome to our mandatory annual information security seminar. My name is Gregory Vance, and I head the corporate cybersecurity audit team. Over the next two hours, we will examine the latest techniques used in email phishing scams and learn how to identify counterfeit login pages. Before we begin the slideshow, please turn to page four of your training handbook and locate the compliance checklist. You will be required to submit this signed checklist to human resources by the end of today.',
        accent: 'AU',
      },
      transcript:
        'Good morning everyone and welcome to our mandatory annual information security seminar. My name is Gregory Vance, and I head the corporate cybersecurity audit team. Over the next two hours, we will examine the latest techniques used in email phishing scams and learn how to identify counterfeit login pages. Before we begin the slideshow, please turn to page four of your training handbook and locate the compliance checklist. You will be required to submit this signed checklist to human resources by the end of today.',
    },
    questionIds: ['q-p4-010', 'q-p4-011', 'q-p4-012'],
  },

  // Group 5: Local Radio Business News Broadcast
  {
    id: 'grp-p4-005',
    groupType: 'part4_talk',
    partNum: 4,
    difficulty: 'medium',
    topic: 'News & Media',
    contextIntro: 'Questions 83 through 85 refer to the following radio broadcast.',
    media: {
      audio: {
        audioScript:
          'This is Metro Business Radio with your hourly commercial update. EcoVolt Solutions, a leading manufacturer of high-efficiency solar battery packs, announced this morning that it will open a new manufacturing facility in Greenfield Industrial Park next January. The two-hundred-million-dollar investment is projected to generate over six hundred skilled engineering and assembly jobs for local residents. Company chief executive Linda Meyers stated that construction of the green plant will begin next month. Up next after our brief sponsor message, stay tuned for local weather and traffic reports.',
        accent: 'US',
      },
      transcript:
        'This is Metro Business Radio with your hourly commercial update. EcoVolt Solutions, a leading manufacturer of high-efficiency solar battery packs, announced this morning that it will open a new manufacturing facility in Greenfield Industrial Park next January. The two-hundred-million-dollar investment is projected to generate over six hundred skilled engineering and assembly jobs for local residents. Company chief executive Linda Meyers stated that construction of the green plant will begin next month. Up next after our brief sponsor message, stay tuned for local weather and traffic reports.',
    },
    questionIds: ['q-p4-013', 'q-p4-014', 'q-p4-015'],
  },

  // Group 6: Workplace Instruction / Facility Tour (Warehouse Logistics Safety)
  {
    id: 'grp-p4-006',
    groupType: 'part4_talk',
    partNum: 4,
    difficulty: 'easy',
    topic: 'Logistics',
    contextIntro: 'Questions 86 through 88 refer to the following workplace orientation talk.',
    media: {
      audio: {
        audioScript:
          "Welcome to your first morning at the Riverdale Logistics Fulfillment Center, team. Before we walk out onto the active distribution floor, please put on your high-visibility safety vests and steel-toed boots from locker area A. As you will see, our primary conveyor sorting system is fully automated, so all personnel must remain strictly within the marked yellow safety walkways at all times. Electric forklift trucks have right-of-way in all main aisles. In about fifteen minutes, our floor supervisor, Mr. Marcus Diaz, will demonstrate how to pair your handheld digital barcode scanners with the inventory management tablet. Let's begin the floor tour.",
        accent: 'US',
      },
      transcript:
        "Welcome to your first morning at the Riverdale Logistics Fulfillment Center, team. Before we walk out onto the active distribution floor, please put on your high-visibility safety vests and steel-toed boots from locker area A. As you will see, our primary conveyor sorting system is fully automated, so all personnel must remain strictly within the marked yellow safety walkways at all times. Electric forklift trucks have right-of-way in all main aisles. In about fifteen minutes, our floor supervisor, Mr. Marcus Diaz, will demonstrate how to pair your handheld digital barcode scanners with the inventory management tablet. Let's begin the floor tour.",
    },
    questionIds: ['q-p4-016', 'q-p4-017', 'q-p4-018'],
  },

  // Group 7: Telephone Voicemail / Customer Message (Print Shop Banner Order)
  {
    id: 'grp-p4-007',
    groupType: 'part4_talk',
    partNum: 4,
    difficulty: 'medium',
    topic: 'Customer Service',
    contextIntro: 'Questions 89 through 91 refer to the following recorded telephone message.',
    media: {
      audio: {
        audioScript:
          "Good morning, Ms. Tanaka. This is Walter Bennett calling from Express Print and Sign. I am following up on your custom order for the international medical conference promotional materials. We received your high-resolution banner graphics yesterday, and our prepress technicians confirmed that the layout is ready for production. However, you selected standard matte vinyl on the order form, which is prone to glare under bright outdoor sunlight. Since your conference registration pavilion is located outdoors in the courtyard, we strongly recommend our heavy-duty weather-resistant mesh fabric instead. It adds about fifteen dollars per banner, but prevents wind flapping and glare. Please call me back at extension 402 by two o'clock today so we can proceed with printing.",
        accent: 'UK',
      },
      transcript:
        "Good morning, Ms. Tanaka. This is Walter Bennett calling from Express Print and Sign. I am following up on your custom order for the international medical conference promotional materials. We received your high-resolution banner graphics yesterday, and our prepress technicians confirmed that the layout is ready for production. However, you selected standard matte vinyl on the order form, which is prone to glare under bright outdoor sunlight. Since your conference registration pavilion is located outdoors in the courtyard, we strongly recommend our heavy-duty weather-resistant mesh fabric instead. It adds about fifteen dollars per banner, but prevents wind flapping and glare. Please call me back at extension 402 by two o'clock today so we can proceed with printing.",
    },
    questionIds: ['q-p4-019', 'q-p4-020', 'q-p4-021'],
  },

  // Group 8: Public Transit Notice / Train Route Alteration
  {
    id: 'grp-p4-008',
    groupType: 'part4_talk',
    partNum: 4,
    difficulty: 'medium',
    topic: 'Transportation',
    contextIntro: 'Questions 92 through 94 refer to the following announcement on a commuter train.',
    media: {
      audio: {
        audioScript:
          "Attention all passengers aboard the Northline Express commuter train en route to Maplewood Central. We have just received notice from regional railway transit control that scheduled track maintenance is underway between Belmont Station and Pine Grove. As a result, this train will operate as a direct express, bypassing Belmont and Fairview stations. If your intended destination is Belmont or Fairview, please disembark at our next scheduled stop, Oakridge Station. Complimentary shuttle buses marked Route 4B will be waiting on the north concourse to transport passengers directly to all bypassed stations at ten-minute intervals. We thank you for your patience and cooperation.",
        accent: 'CA',
      },
      transcript:
        "Attention all passengers aboard the Northline Express commuter train en route to Maplewood Central. We have just received notice from regional railway transit control that scheduled track maintenance is underway between Belmont Station and Pine Grove. As a result, this train will operate as a direct express, bypassing Belmont and Fairview stations. If your intended destination is Belmont or Fairview, please disembark at our next scheduled stop, Oakridge Station. Complimentary shuttle buses marked Route 4B will be waiting on the north concourse to transport passengers directly to all bypassed stations at ten-minute intervals. We thank you for your patience and cooperation.",
    },
    questionIds: ['q-p4-022', 'q-p4-023', 'q-p4-024'],
  },

  // Group 9: Business Presentation / Product Launch Showcase
  {
    id: 'grp-p4-009',
    groupType: 'part4_talk',
    partNum: 4,
    difficulty: 'hard',
    topic: 'Technology',
    contextIntro: 'Questions 95 through 97 refer to the following talk at a technology conference.',
    media: {
      audio: {
        audioScript:
          "Good afternoon, enterprise partners and industry colleagues. I am delighted to welcome you to the premier showcase of our new Apex CloudServer 9000. Over the past eighteen months, our engineering department set out to tackle the data center industry's biggest challenge: spiraling power consumption. Unlike conventional rack servers that require continuous chilled-water cooling, the Apex 9000 features patented liquid-immersion heat pipes that reduce total cooling electricity by thirty-five percent. Furthermore, our modular component architecture allows IT technicians to replace memory modules and solid-state drives without powering down the host chassis. If you look at the projection screen behind me, you can see our third-party benchmark test results against our three closest market competitors. Following my presentation, our product engineers will host hands-on hardware demonstrations at Booth 204 in Hall B.",
        accent: 'US',
      },
      transcript:
        "Good afternoon, enterprise partners and industry colleagues. I am delighted to welcome you to the premier showcase of our new Apex CloudServer 9000. Over the past eighteen months, our engineering department set out to tackle the data center industry's biggest challenge: spiraling power consumption. Unlike conventional rack servers that require continuous chilled-water cooling, the Apex 9000 features patented liquid-immersion heat pipes that reduce total cooling electricity by thirty-five percent. Furthermore, our modular component architecture allows IT technicians to replace memory modules and solid-state drives without powering down the host chassis. If you look at the projection screen behind me, you can see our third-party benchmark test results against our three closest market competitors. Following my presentation, our product engineers will host hands-on hardware demonstrations at Booth 204 in Hall B.",
    },
    questionIds: ['q-p4-025', 'q-p4-026', 'q-p4-027'],
  },

  // Group 10: Cultural Institution / Museum Public Announcement
  {
    id: 'grp-p4-010',
    groupType: 'part4_talk',
    partNum: 4,
    difficulty: 'medium',
    topic: 'Public Events',
    contextIntro: 'Questions 98 through 100 refer to the following announcement at a museum.',
    media: {
      audio: {
        audioScript:
          "Good evening, patrons of the City Heritage Art Museum. We would like to remind all guests that our special exhibition, 'Maritime Trade Across the Silk Road,' will remain open for extended viewing hours until nine o'clock tonight in the West Wing Gallery. At seven-thirty PM, visiting guest curator Dr. Elizabeth Moore will present an illustrated lecture in the lower auditorium discussing newly conserved navigational instruments. Admission to the lecture is free with your regular museum ticket, but seating is limited to one hundred and fifty attendees on a first-come, first-served basis. Finally, if you parked your vehicle in the museum's underground garage, please stop by the member information desk near the main entrance to validate your parking ticket for a discounted five-dollar flat rate. Thank you, and enjoy your visit.",
        accent: 'AU',
      },
      transcript:
        "Good evening, patrons of the City Heritage Art Museum. We would like to remind all guests that our special exhibition, 'Maritime Trade Across the Silk Road,' will remain open for extended viewing hours until nine o'clock tonight in the West Wing Gallery. At seven-thirty PM, visiting guest curator Dr. Elizabeth Moore will present an illustrated lecture in the lower auditorium discussing newly conserved navigational instruments. Admission to the lecture is free with your regular museum ticket, but seating is limited to one hundred and fifty attendees on a first-come, first-served basis. Finally, if you parked your vehicle in the museum's underground garage, please stop by the member information desk near the main entrance to validate your parking ticket for a discounted five-dollar flat rate. Thank you, and enjoy your visit.",
    },
    questionIds: ['q-p4-028', 'q-p4-029', 'q-p4-030'],
  },
];

// PART 4 QUESTIONS (30 Items)
export const PART4_QUESTIONS: Part4Question[] = [
  // Group 1 Questions
  {
    id: 'q-p4-001',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-001',
    orderInGroup: 1,
    difficulty: 'easy',
    topic: 'Travel',
    skillTag: 'Part 4: Đối tượng tiếp nhận thông báo',
    trapType: 'Bẫy nghe nhầm điểm đến (Atlanta vs khác)',
    question: 'Who is the announcement intended for?',
    options: [
      { key: 'A', text: 'Passengers flying to Atlanta' },
      { key: 'B', text: 'Airport maintenance workers' },
      { key: 'C', text: 'Flight attendants arriving on Flight 408' },
      { key: 'D', text: 'Tourists arriving at Concourse B' },
    ],
    correctKey: 'A',
    explanation:
      'Người thông báo mở đầu: "passengers booked on Skyways Flight 408 with nonstop service to Atlanta" ➔ Chọn (A) Passengers flying to Atlanta.',
  },
  {
    id: 'q-p4-002',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-001',
    orderInGroup: 2,
    difficulty: 'medium',
    topic: 'Travel',
    skillTag: 'Part 4: Chi tiết sự cố / Thay đổi',
    trapType: 'Bẫy số cổng (B14 vs C22)',
    question: 'Where should passengers now board their flight?',
    options: [
      { key: 'A', text: 'At Gate B14' },
      { key: 'B', text: 'At Gate C22' },
      { key: 'C', text: 'At the airport main entrance' },
      { key: 'D', text: 'At the ticket counter' },
    ],
    correctKey: 'B',
    explanation:
      'Thông báo nêu rõ: "your departure gate has been reassigned to Gate C22" (do cổng B14 cần bảo trì máy bay) ➔ Chọn (B) At Gate C22.',
  },
  {
    id: 'q-p4-003',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-001',
    orderInGroup: 3,
    difficulty: 'easy',
    topic: 'Travel',
    skillTag: 'Part 4: Yêu cầu hành khách thực hiện',
    trapType: 'Bẫy thứ tự lên máy bay (trẻ nhỏ / hỗ trợ)',
    question: 'Who is invited to board first?',
    options: [
      { key: 'A', text: 'First-class ticket holders' },
      { key: 'B', text: 'Passengers requiring special assistance or with small children' },
      { key: 'C', text: 'Passengers with carry-on luggage only' },
      { key: 'D', text: 'Airline loyalty club members' },
    ],
    correctKey: 'B',
    explanation:
      'Người đọc nói: "Passengers traveling with small children or requiring special boarding assistance are kindly requested to present their boarding passes at the counter first." ➔ Chọn (B).',
  },

  // Group 2 Questions
  {
    id: 'q-p4-004',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-002',
    orderInGroup: 1,
    difficulty: 'easy',
    topic: 'Procurement',
    skillTag: 'Part 4: Mục đích cuộc gọi điện thoại',
    trapType: 'Bẫy mua sắm cá nhân vs Đơn hàng văn phòng',
    question: 'Why is Ms. Cole calling Mr. Henderson?',
    options: [
      { key: 'A', text: 'To cancel a delayed paper shipment' },
      { key: 'B', text: 'To discuss a recent office supply purchase order' },
      { key: 'C', text: 'To interview him for an open position' },
      { key: 'D', text: 'To announce the closure of Summit Supplies' },
    ],
    correctKey: 'B',
    explanation:
      'Cô Cole nói: "I am reaching out regarding your purchase order for printer paper and ink cartridges submitted yesterday." ➔ Chọn (B).',
  },
  {
    id: 'q-p4-005',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-002',
    orderInGroup: 2,
    difficulty: 'medium',
    topic: 'Procurement',
    skillTag: 'Part 4: Lợi ích ưu đãi được cung cấp',
    trapType: 'Bẫy tỷ lệ phần trăm chiết khấu (15% vs khác)',
    question: 'What special benefit does the customer qualify for?',
    options: [
      { key: 'A', text: 'Free shipping on all items' },
      { key: 'B', text: 'A 15 percent bulk volume discount' },
      { key: 'C', text: 'A gift card for future orders' },
      { key: 'D', text: 'An extended 90-day warranty' },
    ],
    correctKey: 'B',
    explanation:
      'Người nói thông báo: "your order qualifies for our fifteen percent volume discount." ➔ Chọn (B).',
  },
  {
    id: 'q-p4-006',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-002',
    orderInGroup: 3,
    difficulty: 'medium',
    topic: 'Procurement',
    skillTag: 'Part 4: Yêu cầu người nghe thực hiện trước hạn chót',
    trapType: 'Bẫy hình thức phản hồi (ký hợp đồng qua email)',
    question: 'What is Mr. Henderson asked to do by 5:00 PM today?',
    options: [
      { key: 'A', text: 'Make a cash deposit at the branch' },
      { key: 'B', text: 'Sign and return an updated agreement' },
      { key: 'C', text: 'Collect the boxes in person' },
      { key: 'D', text: 'Schedule a delivery date next week' },
    ],
    correctKey: 'B',
    explanation:
      'Lời nhắn yêu cầu: "Please review the attached contract sent to your email and reply by five PM today..." ➔ Chọn (B) Sign and return an updated agreement.',
  },

  // Group 3 Questions (Graphic)
  {
    id: 'q-p4-007',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-003',
    orderInGroup: 1,
    difficulty: 'easy',
    topic: 'Retail',
    skillTag: 'Part 4: Bối cảnh không gian thông báo',
    trapType: 'Bẫy siêu thị thực phẩm vs Trung tâm bách hóa',
    question: 'Where is the announcement taking place?',
    options: [
      { key: 'A', text: 'At a department store' },
      { key: 'B', text: 'At an electronics repair shop' },
      { key: 'C', text: 'At an airport duty-free lounge' },
      { key: 'D', text: 'At an indoor sports arena' },
    ],
    correctKey: 'A',
    explanation:
      'Lời thông báo bắt đầu: "welcome to Grand Central Department Store’s annual clearance sale!" ➔ Chọn (A) At a department store.',
  },
  {
    id: 'q-p4-008',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-003',
    orderInGroup: 2,
    difficulty: 'hard',
    topic: 'Retail',
    skillTag: 'Part 4: Câu hỏi nhìn biểu đồ sơ đồ (Graphic Question)',
    trapType: 'Bẫy nhìn sơ đồ gốc (Floor 3) vs Khu di dời tạm thời (Floor 4 Annex)',
    question: 'Look at the graphic. Where should customers go to purchase kitchen appliances today?',
    options: [
      { key: 'A', text: 'Floor 1' },
      { key: 'B', text: 'Floor 2' },
      { key: 'C', text: 'Floor 3' },
      { key: 'D', text: 'Floor 4' },
    ],
    correctKey: 'D',
    explanation:
      'Trong bài nói: "because of ongoing floor renovation on Floor 3, our kitchen appliances and cookware section has been temporarily moved to the Floor 4 Annex". Đối chiếu với sơ đồ Floor Directory, khu vực này đang nằm tại Floor 4 ➔ Chọn (D) Floor 4.',
  },
  {
    id: 'q-p4-009',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-003',
    orderInGroup: 3,
    difficulty: 'medium',
    topic: 'Retail',
    skillTag: 'Part 4: Ưu đãi dành cho thành viên',
    trapType: 'Bẫy chiết khấu chung 40% vs Chiết khấu thêm 10% của hội viên',
    question: 'How can loyalty club members receive an additional discount?',
    options: [
      { key: 'A', text: 'By filling out a paper survey' },
      { key: 'B', text: 'By scanning their mobile membership app' },
      { key: 'C', text: 'By purchasing five items or more' },
      { key: 'D', text: 'By paying with cash only' },
    ],
    correctKey: 'B',
    explanation:
      'Người đọc nhấn mạnh: "loyalty club members receive an additional ten percent discount at checkout when scanning their mobile membership app today." ➔ Chọn (B).',
  },

  // Group 4 Questions
  {
    id: 'q-p4-010',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-004',
    orderInGroup: 1,
    difficulty: 'easy',
    topic: 'Training',
    skillTag: 'Part 4: Nghề nghiệp / Chức vụ người nói',
    trapType: 'Bẫy phòng nhân sự vs Trưởng nhóm an ninh mạng',
    question: 'Who most likely is the speaker?',
    options: [
      { key: 'A', text: 'A corporate cybersecurity leader' },
      { key: 'B', text: 'A newly hired software intern' },
      { key: 'C', text: 'A hotel conference manager' },
      { key: 'D', text: 'A hardware sales representative' },
    ],
    correctKey: 'A',
    explanation:
      'Diễn giả tự giới thiệu: "My name is Gregory Vance, and I head the corporate cybersecurity audit team." ➔ Chọn (A) A corporate cybersecurity leader.',
  },
  {
    id: 'q-p4-011',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-004',
    orderInGroup: 2,
    difficulty: 'medium',
    topic: 'Training',
    skillTag: 'Part 4: Chủ đề của buổi tập huấn',
    trapType: 'Bẫy bảo trì máy tính vs Nhận diện thư lừa đảo (phishing)',
    question: 'What is the main topic of the seminar?',
    options: [
      { key: 'A', text: 'Upgrading computer office operating systems' },
      { key: 'B', text: 'Recognizing email phishing scams and fake login pages' },
      { key: 'C', text: 'Designing mobile applications' },
      { key: 'D', text: 'Writing effective business emails' },
    ],
    correctKey: 'B',
    explanation:
      'Người nói nêu nội dung: "we will examine the latest techniques used in email phishing scams and learn how to identify counterfeit login pages." ➔ Chọn (B).',
  },
  {
    id: 'q-p4-012',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-004',
    orderInGroup: 3,
    difficulty: 'medium',
    topic: 'Training',
    skillTag: 'Part 4: Hành động người tham gia cần làm',
    trapType: 'Bẫy nộp bài kiểm tra vs Nộp checklist tuân thủ đã ký',
    question: 'What must attendees submit to human resources today?',
    options: [
      { key: 'A', text: 'A receipt for training materials' },
      { key: 'B', text: 'A signed compliance checklist' },
      { key: 'C', text: 'Their employee evaluation report' },
      { key: 'D', text: 'A photocopy of their identity badge' },
    ],
    correctKey: 'B',
    explanation:
      'Người nói yêu cầu: "You will be required to submit this signed checklist to human resources by the end of today." ➔ Chọn (B) A signed compliance checklist.',
  },

  // Group 5 Questions
  {
    id: 'q-p4-013',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-005',
    orderInGroup: 1,
    difficulty: 'easy',
    topic: 'News & Media',
    skillTag: 'Part 4: Nội dung chính của bản tin',
    trapType: 'Bẫy đóng cửa nhà máy vs Mở cơ sở sản xuất mới',
    question: 'What is the news broadcast mainly about?',
    options: [
      { key: 'A', text: 'A corporate bankruptcy filing' },
      { key: 'B', text: 'The opening of a new manufacturing plant' },
      { key: 'C', text: 'A strike by industrial workers' },
      { key: 'D', text: 'A decline in renewable energy investments' },
    ],
    correctKey: 'B',
    explanation:
      'Bản tin đưa tin: "EcoVolt Solutions... announced this morning that it will open a new manufacturing facility in Greenfield Industrial Park next January." ➔ Chọn (B) The opening of a new manufacturing plant.',
  },
  {
    id: 'q-p4-014',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-005',
    orderInGroup: 2,
    difficulty: 'medium',
    topic: 'News & Media',
    skillTag: 'Part 4: Số liệu thống kê trong bài nói',
    trapType: 'Bẫy số tiền đầu tư (200 million) vs Số việc làm tạo ra (600 jobs)',
    question: 'How many jobs is the new facility expected to create?',
    options: [
      { key: 'A', text: 'About 200' },
      { key: 'B', text: 'Around 500' },
      { key: 'C', text: 'Over 600' },
      { key: 'D', text: 'More than 2,000' },
    ],
    correctKey: 'C',
    explanation:
      'Phát thanh viên cho biết: "The two-hundred-million-dollar investment is projected to generate over six hundred skilled engineering and assembly jobs..." ➔ Chọn (C) Over 600.',
  },
  {
    id: 'q-p4-015',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-005',
    orderInGroup: 3,
    difficulty: 'easy',
    topic: 'News & Media',
    skillTag: 'Part 4: Nội dung tiếp theo của chương trình',
    trapType: 'Bẫy phỏng vấn CEO vs Dự báo thời tiết và giao thông',
    question: 'What will listeners hear next after the commercial break?',
    options: [
      { key: 'A', text: 'An interview with the company CEO' },
      { key: 'B', text: 'Weather and traffic reports' },
      { key: 'C', text: 'A sports broadcast' },
      { key: 'D', text: 'Stock market closing numbers' },
    ],
    correctKey: 'B',
    explanation:
      'Câu kết của phát thanh viên: "Up next after our brief sponsor message, stay tuned for local weather and traffic reports." ➔ Chọn (B) Weather and traffic reports.',
  },

  // Group 6 Questions (grp-p4-006: Workplace Orientation & Logistics Safety)
  {
    id: 'q-p4-016',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-006',
    orderInGroup: 1,
    difficulty: 'easy',
    topic: 'Logistics',
    skillTag: 'Part 4: Đối tượng tiếp nhận thông báo',
    trapType: 'Bẫy công nhân sửa chữa vs Nhân viên kho mới tuyển',
    question: 'Who most likely are the listeners?',
    options: [
      { key: 'A', text: 'Newly hired warehouse personnel' },
      { key: 'B', text: 'Equipment maintenance contractors' },
      { key: 'C', text: 'Long-distance freight truck drivers' },
      { key: 'D', text: 'Retail store branch managers' },
    ],
    correctKey: 'A',
    explanation:
      'Người hướng dẫn mở đầu: "Welcome to your first morning at the Riverdale Logistics Fulfillment Center, team" và chỉ dẫn lấy đồ bảo hộ cho ca làm đầu tiên ➔ Chọn (A) Newly hired warehouse personnel.',
  },
  {
    id: 'q-p4-017',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-006',
    orderInGroup: 2,
    difficulty: 'medium',
    topic: 'Logistics',
    skillTag: 'Part 4: Quy định an toàn lao động',
    trapType: 'Bẫy vận hành xe nâng vs Đi đúng lối kẻ vạch an toàn',
    question: 'What safety rule are listeners instructed to follow on the active floor?',
    options: [
      { key: 'A', text: 'Never operate machinery alone' },
      { key: 'B', text: 'Keep emergency exit doors propped open' },
      { key: 'C', text: 'Report damaged packages to locker area A' },
      { key: 'D', text: 'Stay strictly within marked yellow walkways' },
    ],
    correctKey: 'D',
    explanation:
      'Người nói nhấn mạnh: "all personnel must remain strictly within the marked yellow safety walkways at all times" vì xe nâng điện có quyền ưu tiên ➔ Chọn (D) Stay strictly within marked yellow walkways.',
  },
  {
    id: 'q-p4-018',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-006',
    orderInGroup: 3,
    difficulty: 'easy',
    topic: 'Logistics',
    skillTag: 'Part 4: Hoạt động sắp diễn ra',
    trapType: 'Bẫy thi kiểm tra an toàn vs Hướng dẫn dùng máy quét mã vạch',
    question: 'What will happen in approximately fifteen minutes?',
    options: [
      { key: 'A', text: 'A fire safety evacuation drill' },
      { key: 'B', text: 'A written compliance examination' },
      { key: 'C', text: 'A demonstration of handheld barcode scanners' },
      { key: 'D', text: 'A scheduled coffee break in the cafeteria' },
    ],
    correctKey: 'C',
    explanation:
      'Người hướng dẫn thông báo: "In about fifteen minutes, our floor supervisor, Mr. Marcus Diaz, will demonstrate how to pair your handheld digital barcode scanners with the inventory management tablet." ➔ Chọn (C) A demonstration of handheld barcode scanners.',
  },

  // Group 7 Questions (grp-p4-007: Telephone Voicemail & Custom Banner Order)
  {
    id: 'q-p4-019',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-007',
    orderInGroup: 1,
    difficulty: 'easy',
    topic: 'Customer Service',
    skillTag: 'Part 4: Lĩnh vực công tác của người gọi',
    trapType: 'Bẫy thiết bị y tế vs Công ty in ấn bảng hiệu',
    question: 'Where does the caller most likely work?',
    options: [
      { key: 'A', text: 'At a printing and signage company' },
      { key: 'B', text: 'At an outdoor event catering service' },
      { key: 'C', text: 'At a medical convention bureau' },
      { key: 'D', text: 'At a commercial photography studio' },
    ],
    correctKey: 'A',
    explanation:
      'Người gọi tự xưng: "This is Walter Bennett calling from Express Print and Sign. I am following up on your custom order for the international medical conference promotional materials." ➔ Chọn (A) At a printing and signage company.',
  },
  {
    id: 'q-p4-020',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-007',
    orderInGroup: 2,
    difficulty: 'medium',
    topic: 'Customer Service',
    skillTag: 'Part 4: Vấn đề phát sinh với chất liệu',
    trapType: 'Bẫy file lỗi vs Bị chói lóa dưới ánh nắng ngoài trời',
    question: 'What concern does the speaker raise regarding the vinyl banners?',
    options: [
      { key: 'A', text: 'The image files arrived corrupted' },
      { key: 'B', text: 'The production cost exceeds the client budget' },
      { key: 'C', text: 'The surface may produce glare under bright sunlight' },
      { key: 'D', text: 'The banners cannot be finished before Friday' },
    ],
    correctKey: 'C',
    explanation:
      'Ông Bennett giải thích: "you selected standard matte vinyl on the order form, which is prone to glare under bright outdoor sunlight" trong khi địa điểm là ngoài trời ➔ Chọn (C) The surface may produce glare under bright sunlight.',
  },
  {
    id: 'q-p4-021',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-007',
    orderInGroup: 3,
    difficulty: 'medium',
    topic: 'Customer Service',
    skillTag: 'Part 4: Hành động khách hàng cần làm trước thời hạn',
    trapType: 'Bẫy gửi lại file đồ họa vs Gọi lại xác nhận vật liệu in',
    question: 'What is Ms. Tanaka requested to do by two o’clock today?',
    options: [
      { key: 'A', text: 'Submit revised graphic artwork' },
      { key: 'B', text: 'Inspect print proofs in person' },
      { key: 'C', text: 'Pay the full invoice by wire transfer' },
      { key: 'D', text: 'Call back to confirm the material selection' },
    ],
    correctKey: 'D',
    explanation:
      'Người gọi yêu cầu: "Please call me back at extension 402 by two o\'clock today so we can proceed with printing." ➔ Chọn (D) Call back to confirm the material selection.',
  },

  // Group 8 Questions (grp-p4-008: Train Route Alteration & Shuttle Connection)
  {
    id: 'q-p4-022',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-008',
    orderInGroup: 1,
    difficulty: 'easy',
    topic: 'Transportation',
    skillTag: 'Part 4: Nguyên nhân thay đổi lịch trình',
    trapType: 'Bẫy thời tiết xấu vs Bảo trì đường ray theo kế hoạch',
    question: 'Why has the train route been altered today?',
    options: [
      { key: 'A', text: 'Severe winter weather conditions' },
      { key: 'B', text: 'An electrical failure on the locomotive' },
      { key: 'C', text: 'Planned railway track maintenance work' },
      { key: 'D', text: 'Holiday passenger crowding at terminals' },
    ],
    correctKey: 'C',
    explanation:
      'Thông báo nêu nguyên nhân: "scheduled track maintenance is underway between Belmont Station and Pine Grove." ➔ Chọn (C) Planned railway track maintenance work.',
  },
  {
    id: 'q-p4-023',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-008',
    orderInGroup: 2,
    difficulty: 'medium',
    topic: 'Transportation',
    skillTag: 'Part 4: Chi tiết điều chỉnh lộ trình',
    trapType: 'Bẫy dừng tại ga cuối sớm vs Chạy thẳng bỏ qua ga Belmont & Fairview',
    question: 'What will the Northline Express train do differently today?',
    options: [
      { key: 'A', text: 'Bypass Belmont and Fairview stations' },
      { key: 'B', text: 'Terminate passenger service at Oakridge' },
      { key: 'C', text: 'Operate at reduced speed through Maplewood' },
      { key: 'D', text: 'Require passengers to buy supplemental tickets' },
    ],
    correctKey: 'A',
    explanation:
      'Phát thanh viên giải thích: "this train will operate as a direct express, bypassing Belmont and Fairview stations." ➔ Chọn (A) Bypass Belmont and Fairview stations.',
  },
  {
    id: 'q-p4-024',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-008',
    orderInGroup: 3,
    difficulty: 'medium',
    topic: 'Transportation',
    skillTag: 'Part 4: Hướng dẫn dành cho hành khách đến ga bỏ qua',
    trapType: 'Bẫy bắt taxi ngoài ga vs Đi xe bus trung chuyển miễn phí',
    question: 'How can passengers travel to bypassed stations?',
    options: [
      { key: 'A', text: 'By reserving a commercial taxi at Maplewood' },
      { key: 'B', text: 'By waiting on the platform for the evening train' },
      { key: 'C', text: 'By requesting a transit refund at the ticket window' },
      { key: 'D', text: 'By boarding a free shuttle bus at Oakridge Station' },
    ],
    correctKey: 'D',
    explanation:
      'Hành khách được chỉ dẫn: "disembark at our next scheduled stop, Oakridge Station. Complimentary shuttle buses marked Route 4B will be waiting on the north concourse..." ➔ Chọn (D) By boarding a free shuttle bus at Oakridge Station.',
  },

  // Group 9 Questions (grp-p4-009: Product Launch & Apex CloudServer 9000)
  {
    id: 'q-p4-025',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-009',
    orderInGroup: 1,
    difficulty: 'easy',
    topic: 'Technology',
    skillTag: 'Part 4: Mục đích chính của bài thuyết trình',
    trapType: 'Bẫy nâng cấp máy tính để bàn vs Ra mắt máy chủ tiết kiệm điện',
    question: 'What is the main purpose of the presentation?',
    options: [
      { key: 'A', text: 'To introduce an energy-efficient enterprise server' },
      { key: 'B', text: 'To review corporate financial quarterly earnings' },
      { key: 'C', text: 'To demonstrate an office word-processing program' },
      { key: 'D', text: 'To announce executive leadership promotions' },
    ],
    correctKey: 'A',
    explanation:
      'Diễn giả mở đầu: "premier showcase of our new Apex CloudServer 9000" nhằm giảm điện năng tiêu thụ cho trung tâm dữ liệu ➔ Chọn (A) To introduce an energy-efficient enterprise server.',
  },
  {
    id: 'q-p4-026',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-009',
    orderInGroup: 2,
    difficulty: 'hard',
    topic: 'Technology',
    skillTag: 'Part 4: Tính năng kỹ thuật nổi bật',
    trapType: 'Bẫy chạy bằng năng lượng mặt trời vs Thay thế linh kiện không cần tắt máy',
    question: 'According to the speaker, what is an advantage of the Apex 9000’s modular design?',
    options: [
      { key: 'A', text: 'It operates entirely without electrical power' },
      { key: 'B', text: 'It comes pre-installed with custom operating software' },
      { key: 'C', text: 'Components can be replaced without powering down the system' },
      { key: 'D', text: 'It connects automatically to residential Wi-Fi networks' },
    ],
    correctKey: 'C',
    explanation:
      'Người thuyết trình nêu rõ: "our modular component architecture allows IT technicians to replace memory modules and solid-state drives without powering down the host chassis." ➔ Chọn (C) Components can be replaced without powering down the system.',
  },
  {
    id: 'q-p4-027',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-009',
    orderInGroup: 3,
    difficulty: 'medium',
    topic: 'Technology',
    skillTag: 'Part 4: Sự kiện diễn ra sau buổi thuyết trình',
    trapType: 'Bẫy họp báo báo chí vs Trực tiếp trải nghiệm thiết bị tại gian hàng 204',
    question: 'What can attendees do following the presentation?',
    options: [
      { key: 'A', text: 'Attend a formal executive gala dinner' },
      { key: 'B', text: 'View live hardware demonstrations at Booth 204' },
      { key: 'C', text: 'Participate in a competitive coding hackathon' },
      { key: 'D', text: 'Interview the chief executive officer in Hall A' },
    ],
    correctKey: 'B',
    explanation:
      'Diễn giả kết luận: "Following my presentation, our product engineers will host hands-on hardware demonstrations at Booth 204 in Hall B." ➔ Chọn (B) View live hardware demonstrations at Booth 204.',
  },

  // Group 10 Questions (grp-p4-010: Museum Special Exhibition & Curator Lecture)
  {
    id: 'q-p4-028',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-010',
    orderInGroup: 1,
    difficulty: 'easy',
    topic: 'Public Events',
    skillTag: 'Part 4: Lịch trình đặc biệt trong buổi tối',
    trapType: 'Bẫy miễn phí vé vào cổng vs Phòng trưng bày mở cửa muộn đến 9h tối',
    question: 'What special schedule is announced for the museum this evening?',
    options: [
      { key: 'A', text: 'Free general admission begins at 6:00 PM' },
      { key: 'B', text: 'Guided architectural tours depart every half hour' },
      { key: 'C', text: 'All permanent galleries are closed for private filming' },
      { key: 'D', text: 'An exhibition in the West Wing is open until 9:00 PM' },
    ],
    correctKey: 'D',
    explanation:
      'Người đọc nhắc nhở: "our special exhibition, \'Maritime Trade Across the Silk Road,\' will remain open for extended viewing hours until nine o\'clock tonight in the West Wing Gallery." ➔ Chọn (D) An exhibition in the West Wing is open until 9:00 PM.',
  },
  {
    id: 'q-p4-029',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-010',
    orderInGroup: 2,
    difficulty: 'medium',
    topic: 'Public Events',
    skillTag: 'Part 4: Chi tiết buổi nói chuyện chuyên đề',
    trapType: 'Bẫy ký tặng sách vs Bài giảng minh họa của giám tuyển khách mời',
    question: 'What will Dr. Elizabeth Moore do at 7:30 PM?',
    options: [
      { key: 'A', text: 'Deliver an illustrated lecture in the lower auditorium' },
      { key: 'B', text: 'Host a private reception for museum donors' },
      { key: 'C', text: 'Conduct an auction of contemporary landscape paintings' },
      { key: 'D', text: 'Sign copies of her newly published history book' },
    ],
    correctKey: 'A',
    explanation:
      'Thông báo nêu rõ: "At seven-thirty PM, visiting guest curator Dr. Elizabeth Moore will present an illustrated lecture in the lower auditorium discussing newly conserved navigational instruments." ➔ Chọn (A) Deliver an illustrated lecture in the lower auditorium.',
  },
  {
    id: 'q-p4-030',
    partNum: 4,
    part: 'Part 4',
    section: 'listening',
    groupId: 'grp-p4-010',
    orderInGroup: 3,
    difficulty: 'medium',
    topic: 'Public Events',
    skillTag: 'Part 4: Điều kiện nhận ưu đãi đỗ xe',
    trapType: 'Bẫy hóa đơn quà lưu niệm vs Đóng dấu xác thực vé xe tại quầy thông tin',
    question: 'How can drivers receive discounted parking tonight?',
    options: [
      { key: 'A', text: 'By pre-booking a parking space on the museum website' },
      { key: 'B', text: 'By showing a receipt from the museum café' },
      { key: 'C', text: 'By validating their parking ticket at the information desk' },
      { key: 'D', text: 'By exiting the parking garage before eight o’clock' },
    ],
    correctKey: 'C',
    explanation:
      'Khách có ô tô được dặn: "please stop by the member information desk near the main entrance to validate your parking ticket for a discounted five-dollar flat rate." ➔ Chọn (C) By validating their parking ticket at the information desk.',
  },
];
