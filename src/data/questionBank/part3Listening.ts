/**
 * TOEIC Mastery Hub — Listening Question Bank
 * Part 3: Short Conversations (13 Groups × 3 Questions = 39 Questions)
 * 
 * Features:
 * - Natural workplace dialogues with turn-by-turn multi-speaker scripts
 * - Grouped questions with strict two-way link integrity
 * - Real-world business contexts: Logistics, IT support, Travel booking, Marketing, Facilities
 * - Support for graphic-based conversation (Group 3 with Flight Schedule table)
 * - Deep pedagogical Vietnamese explanations and trap analyses
 */

import { Part3Group, Part3Question } from '../../types/questionBank';

// PART 3 GROUPS
export const PART3_GROUPS: Part3Group[] = [
  // Group 1: Logistics & Conveyor Belt Part Delay
  {
    id: 'grp-p3-001',
    groupType: 'part3_conversation',
    partNum: 3,
    difficulty: 'medium',
    topic: 'Logistics',
    contextIntro: 'Questions 32 through 34 refer to the following conversation.',
    media: {
      audio: {
        audioScript:
          'Man: Hi Brenda, did the replacement parts for our main packaging conveyor belt arrive this morning? Woman: No, the logistics courier called to report that their delivery van broke down on Interstate 95. Man: That is a serious issue. We need that packaging belt running by two o’clock this afternoon, or the entire shipping schedule falls behind. I will phone the regional warehouse director right away to request an emergency courier.',
        accent: 'US',
      },
      transcript:
        'Man: Hi Brenda, did the replacement parts for our main packaging conveyor belt arrive this morning?\nWoman: No, the logistics courier called to report that their delivery van broke down on Interstate 95.\nMan: That is a serious issue. We need that packaging belt running by two o’clock this afternoon, or the entire shipping schedule falls behind. I will phone the regional warehouse director right away to request an emergency courier.',
    },
    questionIds: ['q-p3-001', 'q-p3-002', 'q-p3-003'],
  },

  // Group 2: IT Support & Cloud Database Access
  {
    id: 'grp-p3-002',
    groupType: 'part3_conversation',
    partNum: 3,
    difficulty: 'easy',
    topic: 'IT Support',
    contextIntro: 'Questions 35 through 37 refer to the following conversation.',
    media: {
      audio: {
        audioScript:
          'Woman: Hello, this is Clara from the accounting department. I am trying to log in to the new cloud financial database, but the system keeps rejecting my password. Man: Welcome to IT helpdesk, Clara. Because of the recent cybersecurity upgrade, all accounts require two-factor authentication. Could you please send me your employee identification number via internal chat? Woman: Sure, I will send it immediately. Will I be able to finalize the payroll balance today? Man: Yes, I can reset your security token within fifteen minutes.',
        accent: 'UK',
      },
      transcript:
        'Woman: Hello, this is Clara from the accounting department. I am trying to log in to the new cloud financial database, but the system keeps rejecting my password.\nMan: Welcome to IT helpdesk, Clara. Because of the recent cybersecurity upgrade, all accounts require two-factor authentication. Could you please send me your employee identification number via internal chat?\nWoman: Sure, I will send it immediately. Will I be able to finalize the payroll balance today?\nMan: Yes, I can reset your security token within fifteen minutes.',
    },
    questionIds: ['q-p3-004', 'q-p3-005', 'q-p3-006'],
  },

  // Group 3: Graphic-Based Conversation — Flight Booking (Flight Schedule Table)
  {
    id: 'grp-p3-003',
    groupType: 'part3_conversation',
    partNum: 3,
    difficulty: 'hard',
    topic: 'Travel',
    contextIntro: 'Questions 38 through 40 refer to the following conversation and flight schedule.',
    media: {
      audio: {
        audioScript:
          'Woman: Mark, here is the departure board for Friday’s flights to Chicago for the international sales summit. Which flight fits your schedule best? Man: Well, the client breakfast meeting starts at noon on Friday, so I must arrive well before midday. But looking at the board, flight PA 318 is already delayed due to mechanical maintenance. Woman: In that case, you should take the early morning departure, even though it departs before eight o’clock. Man: That makes the most sense. Please go ahead and reserve a seat on that flight for me.',
        accent: 'US',
      },
      graphic: {
        type: 'schedule',
        illustrationId: 'flight_schedule_graphic',
        altText: 'Departures to Chicago (ORD): PA 204 (07:15 AM - On Time), PA 318 (10:45 AM - Delayed), PA 520 (02:30 PM), PA 612 (06:15 PM).',
      },
      transcript:
        'Woman: Mark, here is the departure board for Friday’s flights to Chicago for the international sales summit. Which flight fits your schedule best?\nMan: Well, the client breakfast meeting starts at noon on Friday, so I must arrive well before midday. But looking at the board, flight PA 318 is already delayed due to mechanical maintenance.\nWoman: In that case, you should take the early morning departure, even though it departs before eight o’clock.\nMan: That makes the most sense. Please go ahead and reserve a seat on that flight for me.',
    },
    questionIds: ['q-p3-007', 'q-p3-008', 'q-p3-009'],
  },

  // Group 4: Marketing Campaign Feedback & Deadline Extension
  {
    id: 'grp-p3-004',
    groupType: 'part3_conversation',
    partNum: 3,
    difficulty: 'medium',
    topic: 'Marketing',
    contextIntro: 'Questions 41 through 43 refer to the following conversation.',
    media: {
      audio: {
        audioScript:
          'Man: Sarah, did you review the comments from Nexus Corporation regarding our graphic design proposal for their summer beverage campaign? Woman: Yes, I read through them an hour ago. Overall they love the color palette, but they asked us to replace the lifestyle photograph on the front cover with a product closeup. Man: That shouldn’t take too long, but our deadline is tomorrow afternoon. Woman: I know. I will call their brand director to ask for a forty-eight-hour extension so our photographer can shoot the new bottle images.',
        accent: 'AU',
      },
      transcript:
        'Man: Sarah, did you review the comments from Nexus Corporation regarding our graphic design proposal for their summer beverage campaign?\nWoman: Yes, I read through them an hour ago. Overall they love the color palette, but they asked us to replace the lifestyle photograph on the front cover with a product closeup.\nMan: That shouldn’t take too long, but our deadline is tomorrow afternoon.\nWoman: I know. I will call their brand director to ask for a forty-eight-hour extension so our photographer can shoot the new bottle images.',
    },
    questionIds: ['q-p3-010', 'q-p3-011', 'q-p3-012'],
  },

  // Group 5: Office Relocation & Facilities Management
  {
    id: 'grp-p3-005',
    groupType: 'part3_conversation',
    partNum: 3,
    difficulty: 'medium',
    topic: 'Facilities',
    contextIntro: 'Questions 44 through 46 refer to the following conversation.',
    media: {
      audio: {
        audioScript:
          'Woman: David, as you know, our department is relocating to the fifth floor over the upcoming weekend. Are all team members aware of the packing instructions? Man: Yes, I sent an email reminder yesterday. Everyone has been instructed to pack their personal desk belongings into labeled cardboard cartons by Friday at four o’clock. Woman: Excellent. If anyone runs short of packaging materials, where should they go? Man: The facilities team placed extra storage boxes and tape rolls in the first-floor copy room.',
        accent: 'US',
      },
      transcript:
        'Woman: David, as you know, our department is relocating to the fifth floor over the upcoming weekend. Are all team members aware of the packing instructions?\nMan: Yes, I sent an email reminder yesterday. Everyone has been instructed to pack their personal desk belongings into labeled cardboard cartons by Friday at four o’clock.\nWoman: Excellent. If anyone runs short of packaging materials, where should they go?\nMan: The facilities team placed extra storage boxes and tape rolls in the first-floor copy room.',
    },
    questionIds: ['q-p3-013', 'q-p3-014', 'q-p3-015'],
  },

  // Group 6: Purchasing & Ergonomic Task Chairs
  {
    id: 'grp-p3-006',
    groupType: 'part3_conversation',
    partNum: 3,
    difficulty: 'medium',
    topic: 'Purchasing',
    contextIntro: 'Questions 47 through 49 refer to the following conversation.',
    media: {
      audio: {
        audioScript:
          "Woman: Hi Brian, I'm calling about the customer service department's furniture request. Several representatives have been experiencing back strain from our older chairs, so we'd like to order twenty ergonomic task chairs. Man: I see. Our contracted supplier, Apex Office Solutions, has an adjustable ergonomic model in stock. If we purchase at least twenty units, they offer a fifteen percent bulk discount. Woman: That fits within our quarterly equipment budget. Could you confirm how soon they can be delivered? Man: If we place the purchase order before noon today, standard delivery will arrive on Tuesday morning.",
        accent: 'US',
      },
      transcript:
        "Woman: Hi Brian, I'm calling about the customer service department's furniture request. Several representatives have been experiencing back strain from our older chairs, so we'd like to order twenty ergonomic task chairs.\nMan: I see. Our contracted supplier, Apex Office Solutions, has an adjustable ergonomic model in stock. If we purchase at least twenty units, they offer a fifteen percent bulk discount.\nWoman: That fits within our quarterly equipment budget. Could you confirm how soon they can be delivered?\nMan: If we place the purchase order before noon today, standard delivery will arrive on Tuesday morning.",
    },
    questionIds: ['q-p3-016', 'q-p3-017', 'q-p3-018'],
  },

  // Group 7: HR & Candidate Recruitment
  {
    id: 'grp-p3-007',
    groupType: 'part3_conversation',
    partNum: 3,
    difficulty: 'hard',
    topic: 'Human Resources',
    contextIntro: 'Questions 50 through 52 refer to the following conversation.',
    media: {
      audio: {
        audioScript:
          "Man: Andrea, did you finish interviewing the final applicant for the senior financial analyst position? Woman: Yes, I just met with Daniel Wright. He has impressive experience managing international audits at a consulting firm, and his technical modeling skills are top-notch. Man: That sounds very promising. Does he have any reservations about relocating to our regional branch in Denver? Woman: None at all. However, he mentioned that his current employer requires a four-week notice period, so he won't be able to start until the middle of next month. Man: That timeline works fine for our department. Let's draft the formal job offer this afternoon so human resources can review it tomorrow.",
        accent: 'UK',
      },
      transcript:
        "Man: Andrea, did you finish interviewing the final applicant for the senior financial analyst position?\nWoman: Yes, I just met with Daniel Wright. He has impressive experience managing international audits at a consulting firm, and his technical modeling skills are top-notch.\nMan: That sounds very promising. Does he have any reservations about relocating to our regional branch in Denver?\nWoman: None at all. However, he mentioned that his current employer requires a four-week notice period, so he won't be able to start until the middle of next month.\nMan: That timeline works fine for our department. Let's draft the formal job offer this afternoon so human resources can review it tomorrow.",
    },
    questionIds: ['q-p3-019', 'q-p3-020', 'q-p3-021'],
  },

  // Group 8: Customer Support & Billing Correction
  {
    id: 'grp-p3-008',
    groupType: 'part3_conversation',
    partNum: 3,
    difficulty: 'medium',
    topic: 'Customer Support',
    contextIntro: 'Questions 53 through 55 refer to the following conversation.',
    media: {
      audio: {
        audioScript:
          "Woman: Hello, my name is Rachel Green from Green Leaf Catering. I'm calling about our monthly software subscription bill. Our invoice for October came to two hundred and ninety dollars, but our standard package is only one hundred and fifty dollars. Man: I'd be happy to investigate that for you, Ms. Green. Looking at your account records, an automated cloud backup extension was enabled three weeks ago when the complimentary trial period concluded. Woman: Oh, I see. One of our staff members tested that feature, but we decided not to keep it. Could you cancel that add-on service? Man: Absolutely. I will remove the cloud backup module immediately and apply a credit of one hundred and forty dollars to your November billing statement.",
        accent: 'CA',
      },
      transcript:
        "Woman: Hello, my name is Rachel Green from Green Leaf Catering. I'm calling about our monthly software subscription bill. Our invoice for October came to two hundred and ninety dollars, but our standard package is only one hundred and fifty dollars.\nMan: I'd be happy to investigate that for you, Ms. Green. Looking at your account records, an automated cloud backup extension was enabled three weeks ago when the complimentary trial period concluded.\nWoman: Oh, I see. One of our staff members tested that feature, but we decided not to keep it. Could you cancel that add-on service?\nMan: Absolutely. I will remove the cloud backup module immediately and apply a credit of one hundred and forty dollars to your November billing statement.",
    },
    questionIds: ['q-p3-022', 'q-p3-023', 'q-p3-024'],
  },

  // Group 9: Project Management & Engineering Prototype
  {
    id: 'grp-p3-009',
    groupType: 'part3_conversation',
    partNum: 3,
    difficulty: 'hard',
    topic: 'Project Management',
    contextIntro: 'Questions 56 through 58 refer to the following conversation.',
    media: {
      audio: {
        audioScript:
          "Woman: Carlos, have you reviewed the thermal stress test results for the solar storage battery prototype? Man: Yes, the engineering laboratory sent the diagnostic summary this morning. While the power efficiency exceeded our expectations, the casing showed slight heat dissipation leakage near the rear terminals. Woman: That is concerning because we are scheduled to showcase this unit at the clean energy technology expo next Thursday in Frankfurt. Man: Don't worry, the engineering crew already identified a solution. They can install reinforced silicone insulation seals within three days. Woman: Excellent. Let's schedule an all-hands status review for Monday morning so we can confirm the final packaging before air shipment.",
        accent: 'AU',
      },
      transcript:
        "Woman: Carlos, have you reviewed the thermal stress test results for the solar storage battery prototype?\nMan: Yes, the engineering laboratory sent the diagnostic summary this morning. While the power efficiency exceeded our expectations, the casing showed slight heat dissipation leakage near the rear terminals.\nWoman: That is concerning because we are scheduled to showcase this unit at the clean energy technology expo next Thursday in Frankfurt.\nMan: Don't worry, the engineering crew already identified a solution. They can install reinforced silicone insulation seals within three days.\nWoman: Excellent. Let's schedule an all-hands status review for Monday morning so we can confirm the final packaging before air shipment.",
    },
    questionIds: ['q-p3-025', 'q-p3-026', 'q-p3-027'],
  },

  // Group 10: Event Planning & Hotel Banquet Reservation
  {
    id: 'grp-p3-010',
    groupType: 'part3_conversation',
    partNum: 3,
    difficulty: 'medium',
    topic: 'Corporate Events',
    contextIntro: 'Questions 59 through 61 refer to the following conversation.',
    media: {
      audio: {
        audioScript:
          "Man: Good morning. I'm calling from Summit Technologies to reserve an event space for our annual retirement dinner on Friday, November fourteenth. We expect approximately sixty attendees. Woman: Thank you for considering the Grandview Hotel. Our Harbor Terrace Room is our standard venue for groups of that size, but it is already booked for an anniversary celebration that evening. However, our Grand Ballroom is available, and we would be happy to offer it at the same rental rate. Man: That is very generous of you. Since several colleagues have dietary restrictions, does your banquet kitchen accommodate vegetarian and gluten-free meals? Woman: Certainly. We have several customized catering menus. I'll email our executive chef's seasonal options to you right away.",
        accent: 'UK',
      },
      transcript:
        "Man: Good morning. I'm calling from Summit Technologies to reserve an event space for our annual retirement dinner on Friday, November fourteenth. We expect approximately sixty attendees.\nWoman: Thank you for considering the Grandview Hotel. Our Harbor Terrace Room is our standard venue for groups of that size, but it is already booked for an anniversary celebration that evening. However, our Grand Ballroom is available, and we would be happy to offer it at the same rental rate.\nMan: That is very generous of you. Since several colleagues have dietary restrictions, does your banquet kitchen accommodate vegetarian and gluten-free meals?\nWoman: Certainly. We have several customized catering menus. I'll email our executive chef's seasonal options to you right away.",
    },
    questionIds: ['q-p3-028', 'q-p3-029', 'q-p3-030'],
  },

  // Group 11: Sales & Commercial Contract Terms
  {
    id: 'grp-p3-011',
    groupType: 'part3_conversation',
    partNum: 3,
    difficulty: 'medium',
    topic: 'Sales',
    contextIntro: 'Questions 62 through 64 refer to the following conversation.',
    media: {
      audio: {
        audioScript:
          "Woman: Mr. Kowalski, thank you for meeting with me to discuss distributing our automated espresso machines across your grocery store cafes. Has your purchasing committee reviewed our draft supply contract? Man: Yes, Ms. Vance. Overall, our executives are pleased with the wholesale unit pricing. However, our main concern is equipment reliability. We would like the agreement to include twelve months of free preventative maintenance rather than just six months. Woman: We can agree to that extension on one condition: your grocery chain must commit to featuring our machines in a minimum of twenty regional supermarket branches. Man: That is a fair compromise. I will update the clause in our contract draft and present it to our executive vice president for signature tomorrow morning.",
        accent: 'US',
      },
      transcript:
        "Woman: Mr. Kowalski, thank you for meeting with me to discuss distributing our automated espresso machines across your grocery store cafes. Has your purchasing committee reviewed our draft supply contract?\nMan: Yes, Ms. Vance. Overall, our executives are pleased with the wholesale unit pricing. However, our main concern is equipment reliability. We would like the agreement to include twelve months of free preventative maintenance rather than just six months.\nWoman: We can agree to that extension on one condition: your grocery chain must commit to featuring our machines in a minimum of twenty regional supermarket branches.\nMan: That is a fair compromise. I will update the clause in our contract draft and present it to our executive vice president for signature tomorrow morning.",
    },
    questionIds: ['q-p3-031', 'q-p3-032', 'q-p3-033'],
  },

  // Group 12: Professional Development & Team Training
  {
    id: 'grp-p3-012',
    groupType: 'part3_conversation',
    partNum: 3,
    difficulty: 'medium',
    topic: 'Training',
    contextIntro: 'Questions 65 through 67 refer to the following conversation.',
    media: {
      audio: {
        audioScript:
          "Man: Jennifer, I reviewed our market research team's presentation slides for the upcoming executive board meeting. The statistical findings are solid, but our data visualization charts look cluttered and difficult to interpret quickly. Woman: I noticed that too, Kevin. Most of our analysts are self-taught when it comes to business intelligence software. Perhaps we should arrange a professional training workshop on visual analytics. Man: That is a great idea. Our departmental employee development budget has roughly four thousand dollars remaining for this fiscal quarter. Do you know an instructor who specializes in corporate data storytelling? Woman: Yes, Beacon Consulting offers a two-day certified seminar. I will contact their client coordinator this afternoon to ask about their trainer availability dates for next month.",
        accent: 'CA',
      },
      transcript:
        "Man: Jennifer, I reviewed our market research team's presentation slides for the upcoming executive board meeting. The statistical findings are solid, but our data visualization charts look cluttered and difficult to interpret quickly.\nWoman: I noticed that too, Kevin. Most of our analysts are self-taught when it comes to business intelligence software. Perhaps we should arrange a professional training workshop on visual analytics.\nMan: That is a great idea. Our departmental employee development budget has roughly four thousand dollars remaining for this fiscal quarter. Do you know an instructor who specializes in corporate data storytelling?\nWoman: Yes, Beacon Consulting offers a two-day certified seminar. I will contact their client coordinator this afternoon to ask about their trainer availability dates for next month.",
    },
    questionIds: ['q-p3-034', 'q-p3-035', 'q-p3-036'],
  },

  // Group 13: Shipping & Medical Warehouse Reordering
  {
    id: 'grp-p3-013',
    groupType: 'part3_conversation',
    partNum: 3,
    difficulty: 'hard',
    topic: 'Logistics',
    contextIntro: 'Questions 68 through 70 refer to the following conversation.',
    media: {
      audio: {
        audioScript:
          "Woman: Tom, I was just doing our weekly inventory inspection in aisle four. We only have forty boxes of size-medium sterile surgical gloves left on the pallets. Our minimum safety stock requirement is one hundred boxes. Man: That explains why the packing team was complaining this morning. Several regional medical clinics submitted emergency restock orders over the weekend due to seasonal demand. Woman: If we run out entirely, our fulfillment rate will take a hit. Can our primary manufacturer ship a replenishment batch quickly? Man: I contacted their Cleveland distribution center earlier. They have ample supply and can dispatch an express freight truck today, but we must finalize the purchase order before three o'clock to guarantee delivery tomorrow afternoon. Woman: I'll authorize the procurement paperwork in our enterprise system right now.",
        accent: 'US',
      },
      transcript:
        "Woman: Tom, I was just doing our weekly inventory inspection in aisle four. We only have forty boxes of size-medium sterile surgical gloves left on the pallets. Our minimum safety stock requirement is one hundred boxes.\nMan: That explains why the packing team was complaining this morning. Several regional medical clinics submitted emergency restock orders over the weekend due to seasonal demand.\nWoman: If we run out entirely, our fulfillment rate will take a hit. Can our primary manufacturer ship a replenishment batch quickly?\nMan: I contacted their Cleveland distribution center earlier. They have ample supply and can dispatch an express freight truck today, but we must finalize the purchase order before three o'clock to guarantee delivery tomorrow afternoon.\nWoman: I'll authorize the procurement paperwork in our enterprise system right now.",
    },
    questionIds: ['q-p3-037', 'q-p3-038', 'q-p3-039'],
  },
];

// PART 3 QUESTIONS (39 Items)
export const PART3_QUESTIONS: Part3Question[] = [
  // Group 1 Questions
  {
    id: 'q-p3-001',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-001',
    orderInGroup: 1,
    difficulty: 'medium',
    topic: 'Logistics',
    skillTag: 'Part 3: Nhận diện vấn đề cốt lõi',
    trapType: 'Bẫy lặp từ cục bộ (breakdown vs schedule)',
    question: 'What problem does the woman report?',
    options: [
      { key: 'A', text: 'A machine operator failed to arrive at work.' },
      { key: 'B', text: 'A delivery was delayed due to a vehicle breakdown.' },
      { key: 'C', text: 'A client canceled an urgent shipment.' },
      { key: 'D', text: 'The warehouse storage area is out of space.' },
    ],
    correctKey: 'B',
    explanation:
      'Người phụ nữ nói rõ: "their delivery van broke down on Interstate 95" khiến linh kiện chưa đến nơi. Chọn (B). Các đáp án khác: (A) không nói người vận hành vắng mặt; (C) khách hàng không hủy đơn; (D) kho không bị hết chỗ.',
  },
  {
    id: 'q-p3-002',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-001',
    orderInGroup: 2,
    difficulty: 'easy',
    topic: 'Logistics',
    skillTag: 'Part 3: Chi tiết thời gian & Hạn chót',
    trapType: 'Bẫy nghe nhầm số giờ (2 PM vs morning)',
    question: 'By what time must the conveyor belt be operational?',
    options: [
      { key: 'A', text: 'By 10:00 AM' },
      { key: 'B', text: 'By 12:00 PM' },
      { key: 'C', text: 'By 2:00 PM' },
      { key: 'D', text: 'By 5:00 PM' },
    ],
    correctKey: 'C',
    explanation:
      'Người đàn ông nhấn mạnh: "We need that packaging belt running by two o’clock this afternoon" ➔ Chọn (C) By 2:00 PM.',
  },
  {
    id: 'q-p3-003',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-001',
    orderInGroup: 3,
    difficulty: 'medium',
    topic: 'Logistics',
    skillTag: 'Part 3: Hành động tiếp theo của người nói',
    trapType: 'Bẫy người thực hiện hành động (Man vs Woman)',
    question: 'What will the man do next?',
    options: [
      { key: 'A', text: 'Inspect the conveyor belt himself.' },
      { key: 'B', text: 'Contact a warehouse director.' },
      { key: 'C', text: 'Drive to the highway to collect the parcel.' },
      { key: 'D', text: 'Issue a refund to the supplier.' },
    ],
    correctKey: 'B',
    explanation:
      'Người đàn ông khẳng định ở cuối hội thoại: "I will phone the regional warehouse director right away..." ➔ Chọn (B) Contact a warehouse director.',
  },

  // Group 2 Questions
  {
    id: 'q-p3-004',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-002',
    orderInGroup: 1,
    difficulty: 'easy',
    topic: 'IT Support',
    skillTag: 'Part 3: Mục đích cuộc gọi',
    trapType: 'Bẫy lý do bề nổi vs Vấn đề hệ thống',
    question: 'Why is the woman contacting the IT helpdesk?',
    options: [
      { key: 'A', text: 'To order new accounting software licenses.' },
      { key: 'B', text: 'To report difficulty logging in to a database.' },
      { key: 'C', text: 'To request an upgrade for her laptop hardware.' },
      { key: 'D', text: 'To schedule cybersecurity training.' },
    ],
    correctKey: 'B',
    explanation:
      'Người phụ nữ mở đầu: "I am trying to log in to the new cloud financial database, but the system keeps rejecting my password." ➔ Chọn (B).',
  },
  {
    id: 'q-p3-005',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-002',
    orderInGroup: 2,
    difficulty: 'medium',
    topic: 'IT Support',
    skillTag: 'Part 3: Yêu cầu của người nói',
    trapType: 'Bẫy phương thức gửi thông tin (chat vs email)',
    question: 'What information does the man ask the woman to provide?',
    options: [
      { key: 'A', text: 'Her bank account details' },
      { key: 'B', text: 'Her supervisor’s email address' },
      { key: 'C', text: 'Her employee identification number' },
      { key: 'D', text: 'Her previous password' },
    ],
    correctKey: 'C',
    explanation:
      'Nhân viên IT yêu cầu: "Could you please send me your employee identification number via internal chat?" ➔ Chọn (C).',
  },
  {
    id: 'q-p3-006',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-002',
    orderInGroup: 3,
    difficulty: 'easy',
    topic: 'IT Support',
    skillTag: 'Part 3: Thời gian xử lý sự cố',
    trapType: 'Bẫy số phút (15 mins vs today)',
    question: 'How quickly does the man expect to resolve the issue?',
    options: [
      { key: 'A', text: 'Within 15 minutes' },
      { key: 'B', text: 'By the end of the day' },
      { key: 'C', text: 'By tomorrow morning' },
      { key: 'D', text: 'In about one hour' },
    ],
    correctKey: 'A',
    explanation:
      'Người đàn ông khẳng định: "I can reset your security token within fifteen minutes." ➔ Chọn (A).',
  },

  // Group 3 Questions (Graphic)
  {
    id: 'q-p3-007',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-003',
    orderInGroup: 1,
    difficulty: 'medium',
    topic: 'Travel',
    skillTag: 'Part 3: Mục đích chuyến đi',
    trapType: 'Bẫy chuyến đi cá nhân vs Công tác hội nghị',
    question: 'What is the purpose of the man’s trip to Chicago?',
    options: [
      { key: 'A', text: 'To attend an international sales summit' },
      { key: 'B', text: 'To visit a relative’s wedding' },
      { key: 'C', text: 'To open a new retail branch' },
      { key: 'D', text: 'To negotiate an equipment lease' },
    ],
    correctKey: 'A',
    explanation:
      'Người phụ nữ nhắc đến: "Friday’s flights to Chicago for the international sales summit." ➔ Chọn (A).',
  },
  {
    id: 'q-p3-008',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-003',
    orderInGroup: 2,
    difficulty: 'hard',
    topic: 'Travel',
    skillTag: 'Part 3: Câu hỏi đối chiếu biểu đồ (Graphic Question)',
    trapType: 'Bẫy đối chiếu dữ liệu bảng và điều kiện thời gian/sự cố',
    question: 'Look at the graphic. Which flight will the woman reserve for the man?',
    options: [
      { key: 'A', text: 'PA 204' },
      { key: 'B', text: 'PA 318' },
      { key: 'C', text: 'PA 520' },
      { key: 'D', text: 'PA 612' },
    ],
    correctKey: 'A',
    explanation:
      'Đối chiếu bảng biểu: Người đàn ông phải đến trước 12h trưa. Chuyến PA 318 bị hoãn ("delayed due to mechanical maintenance"). Do đó người phụ nữ đề xuất "take the early morning departure, even though it departs before eight o’clock". Nhìn bảng, chuyến bay khởi hành trước 8:00 AM là PA 204 (07:15 AM). Người đàn ông đồng ý đặt vé chuyến này ➔ Chọn (A) PA 204.',
  },
  {
    id: 'q-p3-009',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-003',
    orderInGroup: 3,
    difficulty: 'easy',
    topic: 'Travel',
    skillTag: 'Part 3: Hành động kế tiếp',
    trapType: 'Bẫy đặt phòng khách sạn vs Đặt vé máy bay',
    question: 'What will the woman do next?',
    options: [
      { key: 'A', text: 'Book a hotel room in Chicago.' },
      { key: 'B', text: 'Reserve a seat on the selected flight.' },
      { key: 'C', text: 'Cancel the client breakfast meeting.' },
      { key: 'D', text: 'Call the airline maintenance team.' },
    ],
    correctKey: 'B',
    explanation:
      'Người đàn ông yêu cầu: "Please go ahead and reserve a seat on that flight for me" ➔ Chọn (B) Reserve a seat on the selected flight.',
  },

  // Group 4 Questions
  {
    id: 'q-p3-010',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-004',
    orderInGroup: 1,
    difficulty: 'easy',
    topic: 'Marketing',
    skillTag: 'Part 3: Nhận diện phòng ban / Nghề nghiệp',
    trapType: 'Bẫy lặp từ đồ uống vs Thiết kế đồ họa',
    question: 'What field do the speakers most likely work in?',
    options: [
      { key: 'A', text: 'Beverage manufacturing' },
      { key: 'B', text: 'Graphic and advertising design' },
      { key: 'C', text: 'Legal consulting' },
      { key: 'D', text: 'Financial auditing' },
    ],
    correctKey: 'B',
    explanation:
      'Người đàn ông hỏi về "graphic design proposal for their summer beverage campaign", và người phụ nữ nhắc đến "color palette", "lifestyle photograph", "photographer" ➔ Người nói làm việc trong lĩnh vực thiết kế đồ họa / quảng cáo ➔ Chọn (B).',
  },
  {
    id: 'q-p3-011',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-004',
    orderInGroup: 2,
    difficulty: 'medium',
    topic: 'Marketing',
    skillTag: 'Part 3: Chi tiết yêu cầu sửa đổi của khách hàng',
    trapType: 'Bẫy đổi màu sắc vs Thay ảnh bìa',
    question: 'What change did the client request?',
    options: [
      { key: 'A', text: 'Changing the brand color scheme.' },
      { key: 'B', text: 'Lowering the total campaign budget.' },
      { key: 'C', text: 'Replacing the cover photo with a product closeup.' },
      { key: 'D', text: 'Canceling the summer advertising campaign.' },
    ],
    correctKey: 'C',
    explanation:
      'Người phụ nữ nêu rõ: "they asked us to replace the lifestyle photograph on the front cover with a product closeup." ➔ Chọn (C).',
  },
  {
    id: 'q-p3-012',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-004',
    orderInGroup: 3,
    difficulty: 'medium',
    topic: 'Marketing',
    skillTag: 'Part 3: Kế hoạch giải quyết',
    trapType: 'Bẫy số giờ gia hạn (48 hours vs tomorrow)',
    question: 'What does the woman plan to ask the client for?',
    options: [
      { key: 'A', text: 'A sample of the beverage product.' },
      { key: 'B', text: 'A 48-hour deadline extension.' },
      { key: 'C', text: 'An increase in design fees.' },
      { key: 'D', text: 'A recommendation for a new photographer.' },
    ],
    correctKey: 'B',
    explanation:
      'Người phụ nữ nói: "I will call their brand director to ask for a forty-eight-hour extension so our photographer can shoot the new bottle images." ➔ Chọn (B).',
  },

  // Group 5 Questions
  {
    id: 'q-p3-013',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-005',
    orderInGroup: 1,
    difficulty: 'easy',
    topic: 'Facilities',
    skillTag: 'Part 3: Chủ đề chính của cuộc đối thoại',
    trapType: 'Bẫy tuyển dụng nhân sự mới vs Di dời văn phòng',
    question: 'What event are the speakers discussing?',
    options: [
      { key: 'A', text: 'An upcoming departmental office relocation' },
      { key: 'B', text: 'A companywide holiday party' },
      { key: 'C', text: 'The installation of new computers' },
      { key: 'D', text: 'An annual performance appraisal' },
    ],
    correctKey: 'A',
    explanation:
      'Người phụ nữ mở đầu: "our department is relocating to the fifth floor over the upcoming weekend" ➔ Chọn (A) An upcoming departmental office relocation.',
  },
  {
    id: 'q-p3-014',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-005',
    orderInGroup: 2,
    difficulty: 'medium',
    topic: 'Facilities',
    skillTag: 'Part 3: Nhiệm vụ nhân viên cần hoàn thành',
    trapType: 'Bẫy hạn chót ngày thứ Sáu',
    question: 'What are staff members instructed to do by 4:00 PM on Friday?',
    options: [
      { key: 'A', text: 'Hand in their security badges.' },
      { key: 'B', text: 'Pack their personal desk belongings into cartons.' },
      { key: 'C', text: 'Disassemble their office desks.' },
      { key: 'D', text: 'Meet with the facilities director.' },
    ],
    correctKey: 'B',
    explanation:
      'Người đàn ông trả lời: "Everyone has been instructed to pack their personal desk belongings into labeled cardboard cartons by Friday at four o’clock." ➔ Chọn (B).',
  },
  {
    id: 'q-p3-015',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-005',
    orderInGroup: 3,
    difficulty: 'easy',
    topic: 'Facilities',
    skillTag: 'Part 3: Địa điểm chứa vật tư',
    trapType: 'Bẫy tầng 5 vs Tầng 1 (copy room)',
    question: 'Where can employees find extra packing materials?',
    options: [
      { key: 'A', text: 'In the fifth-floor conference room' },
      { key: 'B', text: 'At the building main lobby' },
      { key: 'C', text: 'In the first-floor copy room' },
      { key: 'D', text: 'Outside in the loading bay' },
    ],
    correctKey: 'C',
    explanation:
      'Người đàn ông cho biết: "The facilities team placed extra storage boxes and tape rolls in the first-floor copy room." ➔ Chọn (C).',
  },

  // =========================================================================
  // Group 6 Questions (q-p3-016, q-p3-017, q-p3-018) — Purchasing & Chairs
  // =========================================================================
  {
    id: 'q-p3-016',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-006',
    orderInGroup: 1,
    difficulty: 'medium',
    topic: 'Purchasing',
    skillTag: 'Part 3: Mục đích liên hệ & Nhu cầu mua sắm',
    trapType: 'Bẫy lặp từ cục bộ (budget vs chairs)',
    question: 'Why does the woman want to purchase new chairs?',
    options: [
      { key: 'A', text: 'The current chairs were damaged during an office move.' },
      { key: 'B', text: 'Employees have reported physical discomfort.' },
      { key: 'C', text: 'The company is hiring twenty temporary interns.' },
      { key: 'D', text: 'The customer service department is expanding to a new floor.' },
    ],
    correctKey: 'B',
    explanation:
      'Người phụ nữ nói rõ lý do: "Several representatives have been experiencing back strain from our older chairs, so we\'d like to order twenty ergonomic task chairs" (Nhiều nhân viên bị đau mỏi lưng do ghế cũ). ➔ Chọn (B) Employees have reported physical discomfort. Bẫy: (A) không bị hỏng do chuyển văn phòng; (C) mua 20 ghế nhưng không nhắc tới tuyển thực tập sinh.',
  },
  {
    id: 'q-p3-017',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-006',
    orderInGroup: 2,
    difficulty: 'easy',
    topic: 'Purchasing',
    skillTag: 'Part 3: Chính sách ưu đãi của nhà cung cấp',
    trapType: 'Bẫy số phần trăm (15% vs 20 units)',
    question: 'What benefit does the supplier provide for ordering twenty units?',
    options: [
      { key: 'A', text: 'Free on-site assembly' },
      { key: 'B', text: 'A complimentary extended warranty' },
      { key: 'C', text: 'A price discount for volume purchases' },
      { key: 'D', text: 'Free expedited courier shipping' },
    ],
    correctKey: 'C',
    explanation:
      'Người đàn ông cho biết: "If we purchase at least twenty units, they offer a fifteen percent bulk discount" (chiết khấu 15% khi mua số lượng từ 20 chiếc trở lên). ➔ Chọn (C) A price discount for volume purchases.',
  },
  {
    id: 'q-p3-018',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-006',
    orderInGroup: 3,
    difficulty: 'medium',
    topic: 'Purchasing',
    skillTag: 'Part 3: Điều kiện thời gian giao hàng',
    trapType: 'Bẫy mốc thời gian (noon vs Tuesday)',
    question: 'What condition must be met for goods to arrive on Tuesday morning?',
    options: [
      { key: 'A', text: 'The order must be submitted by noon today.' },
      { key: 'B', text: 'Full payment must be wired in advance.' },
      { key: 'C', text: 'The department manager must inspect the warehouse.' },
      { key: 'D', text: 'The delivery contract must be signed in person.' },
    ],
    correctKey: 'A',
    explanation:
      'Người đàn ông nêu rõ điều kiện giao hàng: "If we place the purchase order before noon today, standard delivery will arrive on Tuesday morning." ➔ Chọn (A) The order must be submitted by noon today.',
  },

  // =========================================================================
  // Group 7 Questions (q-p3-019, q-p3-020, q-p3-021) — HR Recruitment
  // =========================================================================
  {
    id: 'q-p3-019',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-007',
    orderInGroup: 1,
    difficulty: 'easy',
    topic: 'Human Resources',
    skillTag: 'Part 3: Vị trí tuyển dụng đang thảo luận',
    trapType: 'Bẫy chức danh tương tự (consultant vs analyst)',
    question: 'What job position are the speakers discussing?',
    options: [
      { key: 'A', text: 'Senior Financial Analyst' },
      { key: 'B', text: 'Regional Branch Manager' },
      { key: 'C', text: 'Human Resources Director' },
      { key: 'D', text: 'Management Consulting Partner' },
    ],
    correctKey: 'A',
    explanation:
      'Người đàn ông mở đầu câu hỏi: "did you finish interviewing the final applicant for the senior financial analyst position?" ➔ Chọn (A) Senior Financial Analyst.',
  },
  {
    id: 'q-p3-020',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-007',
    orderInGroup: 2,
    difficulty: 'medium',
    topic: 'Human Resources',
    skillTag: 'Part 3: Hạn chế về thời gian của ứng viên',
    trapType: 'Bẫy địa điểm chuyển tới (Denver) vs Báo trước 4 tuần',
    question: 'What limitation does the woman mention regarding the applicant?',
    options: [
      { key: 'A', text: 'He lacks experience with corporate auditing.' },
      { key: 'B', text: 'He is unwilling to relocate to Denver.' },
      { key: 'C', text: 'He cannot begin working immediately.' },
      { key: 'D', text: 'He requested an unusually high starting salary.' },
    ],
    correctKey: 'C',
    explanation:
      'Người phụ nữ nêu rõ ứng viên không có vấn đề gì về chuyển công tác tới Denver, nhưng: "his current employer requires a four-week notice period, so he won\'t be able to start until the middle of next month" (không thể bắt đầu làm việc ngay lập tức). ➔ Chọn (C) He cannot begin working immediately.',
  },
  {
    id: 'q-p3-021',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-007',
    orderInGroup: 3,
    difficulty: 'medium',
    topic: 'Human Resources',
    skillTag: 'Part 3: Kế hoạch hành động tiếp theo',
    trapType: 'Bẫy thời gian (this afternoon vs tomorrow)',
    question: 'What do the speakers plan to do this afternoon?',
    options: [
      { key: 'A', text: 'Contact the applicant\'s previous references' },
      { key: 'B', text: 'Book an airline flight ticket to Denver' },
      { key: 'C', text: 'Conduct an in-person follow-up interview' },
      { key: 'D', text: 'Draft a formal written job offer' },
    ],
    correctKey: 'D',
    explanation:
      'Người đàn ông kết luận: "Let\'s draft the formal job offer this afternoon so human resources can review it tomorrow." ➔ Chọn (D) Draft a formal written job offer.',
  },

  // =========================================================================
  // Group 8 Questions (q-p3-022, q-p3-023, q-p3-024) — Customer Billing
  // =========================================================================
  {
    id: 'q-p3-022',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-008',
    orderInGroup: 1,
    difficulty: 'easy',
    topic: 'Customer Support',
    skillTag: 'Part 3: Lý do khách hàng gọi đến',
    trapType: 'Bẫy lỗi phần mềm vs Sai lệch hóa đơn thanh toán',
    question: 'Why is the woman contacting customer support?',
    options: [
      { key: 'A', text: 'To inquire about an unexpected charge on her bill' },
      { key: 'B', text: 'To report a recurring system software crash' },
      { key: 'C', text: 'To update her catering company banking details' },
      { key: 'D', text: 'To schedule food delivery for an upcoming event' },
    ],
    correctKey: 'A',
    explanation:
      'Người phụ nữ nêu mục đích gọi: "I\'m calling about our monthly software subscription bill. Our invoice for October came to two hundred and ninety dollars, but our standard package is only one hundred and fifty dollars." ➔ Chọn (A) To inquire about an unexpected charge on her bill.',
  },
  {
    id: 'q-p3-023',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-008',
    orderInGroup: 2,
    difficulty: 'medium',
    topic: 'Customer Support',
    skillTag: 'Part 3: Nguyên nhân phát sinh chi phí phụ trội',
    trapType: 'Bẫy hết hạn dùng thử (trial period concluded)',
    question: 'What caused the additional charge on the invoice?',
    options: [
      { key: 'A', text: 'Late payment penalty fees from last month' },
      { key: 'B', text: 'Activation of an add-on service after a trial ended' },
      { key: 'C', text: 'Exceeding the allowed monthly user account quota' },
      { key: 'D', text: 'An annual software license renewal assessment' },
    ],
    correctKey: 'B',
    explanation:
      'Người đàn ông kiểm tra hệ thống và giải thích: "an automated cloud backup extension was enabled three weeks ago when the complimentary trial period concluded". ➔ Chọn (B) Activation of an add-on service after a trial ended.',
  },
  {
    id: 'q-p3-024',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-008',
    orderInGroup: 3,
    difficulty: 'medium',
    topic: 'Customer Support',
    skillTag: 'Part 3: Phương án giải quyết của tư vấn viên',
    trapType: 'Bẫy gửi séc hoàn tiền vs Giảm trừ vào kỳ sau (credit)',
    question: 'How will the man resolve the woman\'s billing issue?',
    options: [
      { key: 'A', text: 'By mailing a paper refund check to her office' },
      { key: 'B', text: 'By extending the complimentary trial for six months' },
      { key: 'C', text: 'By upgrading her account to a premium enterprise tier' },
      { key: 'D', text: 'By applying a credit refund to her next billing statement' },
    ],
    correctKey: 'D',
    explanation:
      'Người đàn ông đưa ra giải pháp rõ ràng: "I will remove the cloud backup module immediately and apply a credit of one hundred and forty dollars to your November billing statement." ➔ Chọn (D) By applying a credit refund to her next billing statement.',
  },

  // =========================================================================
  // Group 9 Questions (q-p3-025, q-p3-026, q-p3-027) — Solar Battery Prototype
  // =========================================================================
  {
    id: 'q-p3-025',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-009',
    orderInGroup: 1,
    difficulty: 'medium',
    topic: 'Project Management',
    skillTag: 'Part 3: Vấn đề phát sinh trong quá trình thử nghiệm',
    trapType: 'Bẫy hiệu suất lưu điện vs Rò rỉ nhiệt vỏ máy',
    question: 'What problem was discovered during product testing?',
    options: [
      { key: 'A', text: 'The battery cell failed to store sufficient electrical power.' },
      { key: 'B', text: 'Heat escaped from the casing terminals during stress tests.' },
      { key: 'C', text: 'The external charging cable fractured during assembly.' },
      { key: 'D', text: 'The laboratory delivered the diagnostic summary behind schedule.' },
    ],
    correctKey: 'B',
    explanation:
      'Người đàn ông báo cáo kết quả chẩn đoán: "the casing showed slight heat dissipation leakage near the rear terminals" (vỏ máy bị rò rỉ tản nhiệt gần các cực phía sau). ➔ Chọn (B) Heat escaped from the casing terminals during stress tests.',
  },
  {
    id: 'q-p3-026',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-009',
    orderInGroup: 2,
    difficulty: 'easy',
    topic: 'Project Management',
    skillTag: 'Part 3: Lý do tính cấp bách của thời gian',
    trapType: 'Bẫy tên triển lãm công nghệ sạch Frankfurt',
    question: 'Why is the timeline especially critical for the engineering team?',
    options: [
      { key: 'A', text: 'A patent application must be submitted tomorrow.' },
      { key: 'B', text: 'A major retail distributor is visiting the manufacturing plant.' },
      { key: 'C', text: 'The project research grant expires at the end of the quarter.' },
      { key: 'D', text: 'The product will be exhibited at a clean energy expo.' },
    ],
    correctKey: 'D',
    explanation:
      'Người phụ nữ bày tỏ lo lắng: "That is concerning because we are scheduled to showcase this unit at the clean energy technology expo next Thursday in Frankfurt." ➔ Chọn (D) The product will be exhibited at a clean energy expo.',
  },
  {
    id: 'q-p3-027',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-009',
    orderInGroup: 3,
    difficulty: 'medium',
    topic: 'Project Management',
    skillTag: 'Part 3: Kế hoạch hành động sáng thứ Hai',
    trapType: 'Bẫy gửi hàng bằng máy bay vs Họp đánh giá tiến độ',
    question: 'What will take place on Monday morning?',
    options: [
      { key: 'A', text: 'The prototype will be dispatched by air freight to Frankfurt.' },
      { key: 'B', text: 'The engineering crew will test a rival competitor\'s battery.' },
      { key: 'C', text: 'A teamwide status review meeting will be held.' },
      { key: 'D', text: 'The company director will give a keynote speech.' },
    ],
    correctKey: 'C',
    explanation:
      'Người phụ nữ đề xuất: "Let\'s schedule an all-hands status review for Monday morning so we can confirm the final packaging before air shipment." (Họp đánh giá tiến độ toàn diện vào sáng thứ Hai). ➔ Chọn (C) A teamwide status review meeting will be held.',
  },

  // =========================================================================
  // Group 10 Questions (q-p3-028, q-p3-029, q-p3-030) — Banquet Reservation
  // =========================================================================
  {
    id: 'q-p3-028',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-010',
    orderInGroup: 1,
    difficulty: 'easy',
    topic: 'Corporate Events',
    skillTag: 'Part 3: Mục đích tổ chức sự kiện',
    trapType: 'Bẫy tiệc kỷ niệm vs Tiệc nghỉ hưu',
    question: 'What type of event is the man organizing?',
    options: [
      { key: 'A', text: 'A product launch press conference' },
      { key: 'B', text: 'An employee retirement celebration dinner' },
      { key: 'C', text: 'An annual charitable fundraising gala' },
      { key: 'D', text: 'A quarterly corporate shareholder meeting' },
    ],
    correctKey: 'B',
    explanation:
      'Người đàn ông nói rõ mục đích gọi: "I\'m calling from Summit Technologies to reserve an event space for our annual retirement dinner on Friday, November fourteenth." ➔ Chọn (B) An employee retirement celebration dinner.',
  },
  {
    id: 'q-p3-029',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-010',
    orderInGroup: 2,
    difficulty: 'medium',
    topic: 'Corporate Events',
    skillTag: 'Part 3: Ưu đãi của người phụ nữ',
    trapType: 'Bẫy giảm giá tiền mặt vs Nâng cấp phòng tiệc cùng mức giá',
    question: 'What concession does the woman offer the man?',
    options: [
      { key: 'A', text: 'Complimentary audiovisual projection rental' },
      { key: 'B', text: 'Free valet parking vouchers for all sixty guests' },
      { key: 'C', text: 'A ten percent discount on floral table centerpieces' },
      { key: 'D', text: 'Access to a larger ballroom at the standard rental rate' },
    ],
    correctKey: 'D',
    explanation:
      'Người phụ nữ giải thích phòng Harbor Terrace đã có người đặt, nhưng: "our Grand Ballroom is available, and we would be happy to offer it at the same rental rate" (cung cấp phòng Grand Ballroom rộng hơn với mức giá của phòng tiêu chuẩn). ➔ Chọn (D) Access to a larger ballroom at the standard rental rate.',
  },
  {
    id: 'q-p3-030',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-010',
    orderInGroup: 3,
    difficulty: 'easy',
    topic: 'Corporate Events',
    skillTag: 'Part 3: Tài liệu được gửi qua email',
    trapType: 'Bẫy hóa đơn đặt cọc vs Thực đơn ẩm thực',
    question: 'What will the woman send to the man via email?',
    options: [
      { key: 'A', text: 'A list of dietary-friendly catering menus' },
      { key: 'B', text: 'A deposit billing invoice for the ballroom' },
      { key: 'C', text: 'A hotel floor map with driving directions' },
      { key: 'D', text: 'Sample photographs of floral decorations' },
    ],
    correctKey: 'A',
    explanation:
      'Khi người đàn ông hỏi về thực đơn ăn chay và gluten-free, người phụ nữ xác nhận: "We have several customized catering menus. I\'ll email our executive chef\'s seasonal options to you right away." ➔ Chọn (A) A list of dietary-friendly catering menus.',
  },

  // =========================================================================
  // Group 11 Questions (q-p3-031, q-p3-032, q-p3-033) — Espresso Supply Contract
  // =========================================================================
  {
    id: 'q-p3-031',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-011',
    orderInGroup: 1,
    difficulty: 'easy',
    topic: 'Sales',
    skillTag: 'Part 3: Sản phẩm thương mại được đàm phán',
    trapType: 'Bẫy hạt cà phê vs Máy pha cà phê tự động',
    question: 'What commercial merchandise are the speakers discussing?',
    options: [
      { key: 'A', text: 'Commercial automated espresso machines' },
      { key: 'B', text: 'Refrigerated supermarket dairy cases' },
      { key: 'C', text: 'Fair-trade organic roasted coffee beans' },
      { key: 'D', text: 'Electronic barcode checkout scanners' },
    ],
    correctKey: 'A',
    explanation:
      'Người phụ nữ mở đầu cuộc trao đổi: "discuss distributing our automated espresso machines across your grocery store cafes". ➔ Chọn (A) Commercial automated espresso machines.',
  },
  {
    id: 'q-p3-032',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-011',
    orderInGroup: 2,
    difficulty: 'medium',
    topic: 'Sales',
    skillTag: 'Part 3: Điều chỉnh hợp đồng theo yêu cầu người mua',
    trapType: 'Bẫy giảm đơn giá vs Kéo dài thời gian bảo dưỡng miễn phí',
    question: 'What modification does the man request in the agreement?',
    options: [
      { key: 'A', text: 'A reduction in the wholesale purchase price per unit' },
      { key: 'B', text: 'An extended period of complimentary maintenance' },
      { key: 'C', text: 'Free replacement parts for two years' },
      { key: 'D', text: 'Exclusive regional territory distribution rights' },
    ],
    correctKey: 'B',
    explanation:
      'Người đàn ông nêu rõ băn khoăn về độ tin cậy: "We would like the agreement to include twelve months of free preventative maintenance rather than just six months" (kéo dài bảo dưỡng miễn phí định kỳ từ 6 tháng lên 12 tháng). ➔ Chọn (B) An extended period of complimentary maintenance.',
  },
  {
    id: 'q-p3-033',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-011',
    orderInGroup: 3,
    difficulty: 'hard',
    topic: 'Sales',
    skillTag: 'Part 3: Điều kiện ràng buộc để chấp thuận điều khoản',
    trapType: 'Bẫy số chi nhánh (20 branches) vs Số lượng máy',
    question: 'What condition does the woman require to grant the man\'s request?',
    options: [
      { key: 'A', text: 'The grocery chain must pay a nonrefundable deposit today.' },
      { key: 'B', text: 'The espresso machines must be installed by certified technicians.' },
      { key: 'C', text: 'The buyer must order spare water filters in bulk.' },
      { key: 'D', text: 'The machines must be deployed in at least twenty store branches.' },
    ],
    correctKey: 'D',
    explanation:
      'Người phụ nữ đồng ý kèm điều kiện ràng buộc: "your grocery chain must commit to featuring our machines in a minimum of twenty regional supermarket branches". ➔ Chọn (D) The machines must be deployed in at least twenty store branches.',
  },

  // =========================================================================
  // Group 12 Questions (q-p3-034, q-p3-035, q-p3-036) — Training & Visualization
  // =========================================================================
  {
    id: 'q-p3-034',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-012',
    orderInGroup: 1,
    difficulty: 'medium',
    topic: 'Training',
    skillTag: 'Part 3: Vấn đề tồn tại trong bài thuyết trình',
    trapType: 'Bẫy sai số liệu vs Biểu đồ rườm rà khó nắm bắt',
    question: 'What weakness does the man identify in the presentation slides?',
    options: [
      { key: 'A', text: 'The revenue projections contain computational discrepancies.' },
      { key: 'B', text: 'The market survey sample size was statistically insufficient.' },
      { key: 'C', text: 'The slide deck exceeds the maximum time limit for the meeting.' },
      { key: 'D', text: 'The graphic charts are confusing and overly cluttered.' },
    ],
    correctKey: 'D',
    explanation:
      'Người đàn ông nhận xét: "The statistical findings are solid, but our data visualization charts look cluttered and difficult to interpret quickly" (biểu đồ trực quan rối mắt và khó nắm bắt nhanh). ➔ Chọn (D) The graphic charts are confusing and overly cluttered.',
  },
  {
    id: 'q-p3-035',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-012',
    orderInGroup: 2,
    difficulty: 'easy',
    topic: 'Training',
    skillTag: 'Part 3: Đề xuất giải pháp của người phụ nữ',
    trapType: 'Bẫy mua máy tính mới vs Tổ chức khóa tập huấn chuyên nghiệp',
    question: 'What solution does the woman propose?',
    options: [
      { key: 'A', text: 'Purchasing upgraded desktop workstations' },
      { key: 'B', text: 'Contracting an external freelance graphic artist' },
      { key: 'C', text: 'Arranging a professional corporate training workshop' },
      { key: 'D', text: 'Canceling the upcoming executive board presentation' },
    ],
    correctKey: 'C',
    explanation:
      'Người phụ nữ đề xuất: "Perhaps we should arrange a professional training workshop on visual analytics." ➔ Chọn (C) Arranging a professional corporate training workshop.',
  },
  {
    id: 'q-p3-036',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-012',
    orderInGroup: 3,
    difficulty: 'medium',
    topic: 'Training',
    skillTag: 'Part 3: Hành động cụ thể người phụ nữ sẽ thực hiện',
    trapType: 'Bẫy nộp đơn xin ngân sách ($4,000) vs Hỏi lịch giảng viên',
    question: 'What will the woman do this afternoon?',
    options: [
      { key: 'A', text: 'Submit a formal budget allocation request for four thousand dollars' },
      { key: 'B', text: 'Inquire with a consulting agency about trainer availability dates' },
      { key: 'C', text: 'Redesign the presentation slide graphics independently' },
      { key: 'D', text: 'Distribute a feedback questionnaire to department analysts' },
    ],
    correctKey: 'B',
    explanation:
      'Người phụ nữ xác nhận bước đi cụ thể: "I will contact their client coordinator this afternoon to ask about their trainer availability dates for next month." ➔ Chọn (B) Inquire with a consulting agency about trainer availability dates.',
  },

  // =========================================================================
  // Group 13 Questions (q-p3-037, q-p3-038, q-p3-039) — Medical Glove Inventory
  // =========================================================================
  {
    id: 'q-p3-037',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-013',
    orderInGroup: 1,
    difficulty: 'easy',
    topic: 'Logistics',
    skillTag: 'Part 3: Mặt hàng bị thiếu hụt trong kho',
    trapType: 'Bẫy số lượng tồn kho (40 vs 100 boxes)',
    question: 'What merchandise is currently low in stock at the warehouse?',
    options: [
      { key: 'A', text: 'Disposable medical protective gowns' },
      { key: 'B', text: 'Size-medium sterile surgical gloves' },
      { key: 'C', text: 'Digital infrared handheld thermometers' },
      { key: 'D', text: 'Sterile cotton wound care bandages' },
    ],
    correctKey: 'B',
    explanation:
      'Người phụ nữ kiểm tra kho và thông báo: "We only have forty boxes of size-medium sterile surgical gloves left on the pallets. Our minimum safety stock requirement is one hundred boxes." ➔ Chọn (B) Size-medium sterile surgical gloves.',
  },
  {
    id: 'q-p3-038',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-013',
    orderInGroup: 2,
    difficulty: 'medium',
    topic: 'Logistics',
    skillTag: 'Part 3: Nguyên nhân lượng hàng giảm đột biến',
    trapType: 'Bẫy hỏng hóc khi vận chuyển vs Đơn đặt hàng đột xuất',
    question: 'Why did the warehouse inventory drop so rapidly?',
    options: [
      { key: 'A', text: 'A pallet of supplies was damaged during forklift transit.' },
      { key: 'B', text: 'The manufacturer delayed a scheduled freight delivery.' },
      { key: 'C', text: 'An inventory database software glitch deleted the records.' },
      { key: 'D', text: 'Regional medical clinics placed emergency orders over the weekend.' },
    ],
    correctKey: 'D',
    explanation:
      'Người đàn ông giải thích: "Several regional medical clinics submitted emergency restock orders over the weekend due to seasonal demand." ➔ Chọn (D) Regional medical clinics placed emergency orders over the weekend.',
  },
  {
    id: 'q-p3-039',
    partNum: 3,
    part: 'Part 3',
    section: 'listening',
    groupId: 'grp-p3-013',
    orderInGroup: 3,
    difficulty: 'medium',
    topic: 'Logistics',
    skillTag: 'Part 3: Mốc thời gian giới hạn quan trọng',
    trapType: 'Bẫy thời điểm giao hàng (ngày mai) vs Hạn chót đặt hàng (3:00 PM)',
    question: 'Why is 3:00 PM significant for the speakers?',
    options: [
      { key: 'A', text: 'Warehouse forklift operators finish their daily shift.' },
      { key: 'B', text: 'It is the cutoff time to guarantee delivery by tomorrow afternoon.' },
      { key: 'C', text: 'A freight transportation inspector will inspect the warehouse bay.' },
      { key: 'D', text: 'The manufacturer customer support service hotline closes for the day.' },
    ],
    correctKey: 'B',
    explanation:
      'Người đàn ông lưu ý thời hạn chót: "we must finalize the purchase order before three o\'clock to guarantee delivery tomorrow afternoon" (cần hoàn tất đơn trước 3 giờ để đảm bảo nhận hàng vào chiều mai). ➔ Chọn (B) It is the cutoff time to guarantee delivery by tomorrow afternoon.',
  },
];
