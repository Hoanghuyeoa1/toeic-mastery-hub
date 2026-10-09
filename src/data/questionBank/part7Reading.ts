import { Part7Group, Part7Question } from '../../types/questionBank';

/**
 * TOEIC Part 7: Reading Comprehension
 * 
 * Part 7 Single Passages: 10 Groups × 29 Questions Total (Questions 147-175)
 * Part 7 Multiple Passages: 5 Groups × 25 Questions Total (Questions 176-200: 2 Double + 3 Triple)
 * Total Part 7 Bank: 15 Groups × 54 Questions Total
 * 
 * Features direct factual retrieval, inference, vocabulary in context, contextual interpretation,
 * sentence insertion, cross-text synthesis, and explicit evidence references.
 */

// =============================================================================
// PART 7 SINGLE PASSAGES (10 Groups, 29 Questions)
// =============================================================================

export const PART7_SINGLE_GROUPS: Part7Group[] = [
  // ---------------------------------------------------------------------------
  // GROUP 1: Single Passage - Email (2 Questions: q-p7-001 -> q-p7-002)
  // ---------------------------------------------------------------------------
  {
    id: 'grp-p7-001',
    groupType: 'part7_reading_comprehension',
    partNum: 7,
    difficulty: 'easy',
    topic: 'Software Licensing & Customer Service',
    contextIntro: 'Questions 147-148 refer to the following email.',
    passageFormat: 'single',
    passages: [
      {
        id: 'pass-p7-001-a',
        formatType: 'email',
        title: 'Subscription Renewal Notice',
        content: `To: Karen Lindqvist <k.lindqvist@nordicdesigns.no>
From: billing@claritycrm.com
Date: May 12
Subject: Annual Enterprise Subscription Renewal - Action Required

Dear Ms. Lindqvist,

Thank you for being a valued subscriber to Clarity CRM over the past three years. We are writing to notify you that your current annual enterprise license (Account #CR-55092) is scheduled to expire on June 15.

To guarantee uninterrupted access for your forty sales representatives across Oslo and Stockholm, your subscription must be renewed prior to the expiration date. As a token of our appreciation for your loyalty, we are delighted to offer Nordic Designs an early renewal discount of fifteen percent off the standard annual rate. To qualify for this reduced pricing, your payment must be processed by June 1.

You can securely review your itemized invoice and complete payment through your administrator dashboard at https://app.claritycrm.com/billing. If your procurement department requires an official purchase order or bank wire transfer instructions, please reply directly to this message.

Warm regards,
Tobias Weber
Account Management Specialist, Clarity Software Systems`,
      },
    ],
    questionIds: ['q-p7-001', 'q-p7-002'],
  },

  // ---------------------------------------------------------------------------
  // GROUP 2: Single Passage - Notice (2 Questions: q-p7-003 -> q-p7-004)
  // ---------------------------------------------------------------------------
  {
    id: 'grp-p7-002',
    groupType: 'part7_reading_comprehension',
    partNum: 7,
    difficulty: 'easy',
    topic: 'Facilities Management & Maintenance',
    contextIntro: 'Questions 149-150 refer to the following building notice.',
    passageFormat: 'single',
    passages: [
      {
        id: 'pass-p7-002-a',
        formatType: 'notice',
        title: 'Elevator Modernization Schedule',
        content: `BUILDING NOTICE: ELEVATOR UPGRADE & SERVICE DISRUPTION
Vanguard Tower Property Management
Date of Notice: August 14

Please be advised that the central passenger elevator bank (Elevators 1, 2, and 3) will undergo mandatory scheduled maintenance and control system upgrades starting this Saturday, August 17, at 7:00 A.M. Work will continue through Sunday evening and conclude by 9:00 P.M.

During this 36-hour service window, all central passenger elevators will be completely deactivated. However, the high-capacity freight elevator located adjacent to the rear loading dock will remain fully operational for tenant access. Facilities staff will be stationed in the ground-floor rear corridor to assist employees and visiting clients.

Normal elevator service on all floors will resume on Monday, August 19, at 6:00 A.M. We apologize for any temporary inconvenience this essential modernization work may cause and appreciate your patience.

For emergency access requests, contact building security at extension 4004.`,
      },
    ],
    questionIds: ['q-p7-003', 'q-p7-004'],
  },

  // ---------------------------------------------------------------------------
  // GROUP 3: Single Passage - Workplace Chat (2 Questions: q-p7-005 -> q-p7-006)
  // ---------------------------------------------------------------------------
  {
    id: 'grp-p7-003',
    groupType: 'part7_reading_comprehension',
    partNum: 7,
    difficulty: 'easy',
    topic: 'Marketing & Presentation Coordination',
    contextIntro: 'Questions 151-152 refer to the following text message chain.',
    passageFormat: 'single',
    passages: [
      {
        id: 'pass-p7-003-a',
        formatType: 'chat',
        title: 'Project Handout Review Chat',
        content: `Maya Jensen [10:11 A.M.]
Hi Liam, did you receive the revised financial charts from our client, Kensington Holdings? They asked us to replace the bar chart on slide 8 before printing the meeting handouts.

Liam Ortiz [10:13 A.M.]
Yes, Maya. Sarah forwarded the updated spreadsheet twenty minutes ago. I just finished embedding the new Q3 revenue figures and formatting the legend.

Maya Jensen [10:14 A.M.]
Great! The print shop in the lobby needs the print-ready PDF by 10:45 A.M. if they are going to deliver sixty bound copies before our 1:00 P.M. luncheon. Could you export the file now?

Liam Ortiz [10:15 A.M.]
I'm on it. I'll upload the final export to their shared folder right away and notify the print manager.

Maya Jensen [10:16 A.M.]
Perfect, thank you! I'll pick up the finished binders on my way to the boardroom.`,
      },
    ],
    questionIds: ['q-p7-005', 'q-p7-006'],
  },

  // ---------------------------------------------------------------------------
  // GROUP 4: Single Passage - Schedule (2 Questions: q-p7-007 -> q-p7-008)
  // ---------------------------------------------------------------------------
  {
    id: 'grp-p7-004',
    groupType: 'part7_reading_comprehension',
    partNum: 7,
    difficulty: 'medium',
    topic: 'Professional Development & Logistics Summit',
    contextIntro: 'Questions 153-154 refer to the following conference workshop schedule.',
    passageFormat: 'single',
    passages: [
      {
        id: 'pass-p7-004-a',
        formatType: 'schedule',
        title: 'Logistics Summit Workshop Timetable',
        content: `NORTH AMERICAN SUPPLY CHAIN SUMMIT
Midwest Convention Pavilion - Thursday Afternoon Workshops

Time          Room        Session Title & Description                                Facilitator
---------------------------------------------------------------------------------------------------
1:00 - 2:15   Room A      AI-Driven Inventory Tracking                               Carlos Morales
                          Methods for automating warehouse stock counts using RFID.  Logistics Tech Inc.

2:30 - 3:45   Room B      Cold-Chain Compliance & Regulations                        Dr. Brenda Walsh
                          Best practices for refrigerated pharmaceutical cargo.      National Pharma Board

2:30 - 3:45   Room C      Sustainable Packaging Innovations                          Evelyn Vance
                          Biodegradable corrugated shipping containers.              GreenPack Solutions

4:00 - 5:15   Executive   Freight Negotiation Strategies for Shippers                Marcus Sterling
              Boardroom   Tactics for contracting regional trucking carriers.        Sterling Freight Group

*Note: All sessions include a 15-minute Q&A segment. Audio recordings will be accessible on the conference portal within 48 hours for registered attendees.`,
      },
    ],
    questionIds: ['q-p7-007', 'q-p7-008'],
  },

  // ---------------------------------------------------------------------------
  // GROUP 5: Single Passage - Advertisement (3 Questions: q-p7-009 -> q-p7-011)
  // ---------------------------------------------------------------------------
  {
    id: 'grp-p7-005',
    groupType: 'part7_reading_comprehension',
    partNum: 7,
    difficulty: 'medium',
    topic: 'Real Estate & Co-working Amenities',
    contextIntro: 'Questions 155-157 refer to the following advertisement.',
    passageFormat: 'single',
    passages: [
      {
        id: 'pass-p7-005-a',
        formatType: 'advertisement',
        title: 'Nexus Executive Workspace Rental',
        content: `NEXUS EXECUTIVE BUSINESS LOUNGE & SUITES
Prime Downtown Location | 450 Financial Way, 18th Floor

Are you seeking a prestigious corporate address without the burden of long-term commercial lease commitments? Nexus Executive Workspace offers turnkey private offices and flexible collaborative spaces tailored for growing startups, freelance consultants, and visiting corporate executives.

MEMBERSHIP PACKAGES INCLUDE:
- Fully furnished private suites (accommodating 1 to 12 persons) with ergonomic seating.
- High-speed dedicated fiber-optic Internet and enterprise-grade Wi-Fi encryption.
- Complimentary access to soundproof video podcast booths and media conference rooms.
- Gourmet espresso bar, filtered water stations, and daily continental breakfast snacks.
- Professional mail handling, dedicated phone answering services, and receptionist greeting.

SPECIAL GRAND OPENING PROMOTION:
Sign a six-month private suite agreement before August 31 and receive your first month rent-free, plus ten complimentary conference room booking hours per month.

Tour appointments are available Monday through Friday from 9:00 A.M. to 5:00 P.M. To schedule your personalized walkthrough, visit www.nexusworkspace.com/tour or contact our community manager, Sarah Chen, at (555) 019-8822.`,
      },
    ],
    questionIds: ['q-p7-009', 'q-p7-010', 'q-p7-011'],
  },

  // ---------------------------------------------------------------------------
  // GROUP 6: Single Passage - Product Description (3 Questions: q-p7-012 -> q-p7-014)
  // ---------------------------------------------------------------------------
  {
    id: 'grp-p7-006',
    groupType: 'part7_reading_comprehension',
    partNum: 7,
    difficulty: 'medium',
    topic: 'Office Equipment & Environmental Health',
    contextIntro: 'Questions 158-160 refer to the following product description.',
    passageFormat: 'single',
    passages: [
      {
        id: 'pass-p7-006-a',
        formatType: 'article',
        title: 'AeroBreeze Air Purifier Specification Sheet',
        content: `PRODUCT PROFILE: AeroBreeze Commercial Air Purifier (Model AB-400X)
Engineered for open-concept corporate offices, educational facilities, and healthcare suites, the AeroBreeze AB-400X delivers whisper-quiet, medical-grade air filtration for spaces up to 1,500 square feet.

KEY TECHNICAL ATTRIBUTES:
- Quad-Stage Filtration Matrix: Combines an electrostatic washable pre-filter, activated carbon odor-neutralizing mesh, and a certified True HEPA core that captures 99.97% of microscopic particulates down to 0.1 microns.
- Intelligent Sensor Suite: Onboard infrared optical monitors continuously analyze indoor air particulates and dynamically adjust fan velocity to minimize energy consumption.
- WhisperFlow Acoustic Shield: Patented motor dampening maintains sound output under 28 decibels on silent mode, ensuring zero distraction during meetings or phone calls.

MAINTENANCE GUIDELINES & WARRANTY:
The outer mesh pre-filter should be washed in warm water every 30 days. For optimum purification efficiency, the primary HEPA filter cartridge requires replacement every 12 months. All AB-400X units are backed by our five-year commercial manufacturer warranty, covering internal motors and sensor modules. Optional annual replacement filter subscriptions are available at a twenty percent discount on our corporate portal.`,
      },
    ],
    questionIds: ['q-p7-012', 'q-p7-013', 'q-p7-014'],
  },

  // ---------------------------------------------------------------------------
  // GROUP 7: Single Passage - Online Review (3 Questions: q-p7-015 -> q-p7-017)
  // ---------------------------------------------------------------------------
  {
    id: 'grp-p7-007',
    groupType: 'part7_reading_comprehension',
    partNum: 7,
    difficulty: 'medium',
    topic: 'Software Evaluation & Fleet Management',
    contextIntro: 'Questions 161-163 refer to the following online review.',
    passageFormat: 'single',
    passages: [
      {
        id: 'pass-p7-007-a',
        formatType: 'article',
        title: 'FleetPulse Software User Review',
        content: `TECH ENTERPRISE REVIEWS
Review: FleetPulse Vehicle Telematics Suite (Version 4.2)
Reviewer: Marcus Alvarez, Operations Director, SwiftHaul Regional Couriers
Rating: 4.5 / 5 Stars | Date: September 28

Our courier company operates a fleet of seventy-five delivery vans across three metropolitan counties. We migrated to FleetPulse six months ago after struggling with unreliable GPS updates and fragmented maintenance logs from our former software provider.

STRENGTHS:
The live interactive tracking dashboard is by far the most impressive feature. Dispatchers can pinpoint delivery vehicles within five meters, enabling us to provide our corporate clients with accurate delivery windows. Fuel economy reporting has also reduced our monthly gasoline expenditure by eight percent through automated idle-time alerts.

AREAS FOR IMPROVEMENT:
While the core desktop system is outstanding, the automated mileage report export tool occasionally freezes when generating multi-vehicle quarterly summaries. Currently, our accounting department must export data in monthly batches rather than pulling the entire fiscal quarter simultaneously.

VERDICT:
Despite minor reporting export limitations, FleetPulse has transformed our logistical coordination. I highly recommend it for regional transport carriers managing more than thirty commercial vehicles.`,
      },
    ],
    questionIds: ['q-p7-015', 'q-p7-016', 'q-p7-017'],
  },

  // ---------------------------------------------------------------------------
  // GROUP 8: Single Passage - Policy Notice (4 Questions: q-p7-018 -> q-p7-021)
  // ---------------------------------------------------------------------------
  {
    id: 'grp-p7-008',
    groupType: 'part7_reading_comprehension',
    partNum: 7,
    difficulty: 'hard',
    topic: 'Human Resources & Remote Work Policy',
    contextIntro: 'Questions 164-167 refer to the following corporate policy memo.',
    passageFormat: 'single',
    passages: [
      {
        id: 'pass-p7-008-a',
        formatType: 'notice',
        title: 'Remote Workspace Equipment Stipend Policy',
        content: `APEX FINANCIAL GROUP - INTERNAL POLICY MEMO
Effective Date: September 1
To: All Full-Time and Hybrid Employees
Subject: Annual Home Office Technology Stipend Guidelines

In recognition of our evolving hybrid work model, Apex Financial Group is pleased to institute the Annual Home Office Technology Stipend. This program provides eligible staff members with financial assistance to maintain productive, ergonomically sound work environments.

1. Eligibility & Allocation:
Full-time permanent employees who work remotely at least two days per business week are eligible for an annual reimbursement stipend of up to $600. [1] Newly hired employees may submit claims immediately following the completion of their sixty-day probationary period.

2. Qualified Equipment:
Reimbursable expenses include external monitors, ergonomic desk chairs, wireless keyboards and mice, noise-canceling headsets, and document scanners. [2] Routine office supplies (such as paper and ink cartridges), residential Internet utility bills, and personal entertainment devices are strictly excluded from reimbursement under this program.

3. Reimbursement Procedure:
All purchases must be made between September 1 and November 30 of the active calendar year. [3] Employees must submit itemized merchant receipts through the Concur expense portal, categorized under "Remote Stipend." Claims lacking detailed payment documentation will be returned without processing. [4] Reimbursement amounts will be added to the employee's regular payroll direct deposit within two subsequent pay cycles.`,
      },
    ],
    questionIds: ['q-p7-018', 'q-p7-019', 'q-p7-020', 'q-p7-021'],
  },

  // ---------------------------------------------------------------------------
  // GROUP 9: Single Passage - Business Letter (4 Questions: q-p7-022 -> q-p7-025)
  // ---------------------------------------------------------------------------
  {
    id: 'grp-p7-009',
    groupType: 'part7_reading_comprehension',
    partNum: 7,
    difficulty: 'hard',
    topic: 'Manufacturing & Supplier Relations',
    contextIntro: 'Questions 168-171 refer to the following business letter.',
    passageFormat: 'single',
    passages: [
      {
        id: 'pass-p7-009-a',
        formatType: 'letter',
        title: 'Notice of Component Delivery Rescheduling',
        content: `VANTAGE INDUSTRIAL COMPONENTS LLC
820 Industrial Boulevard, Detroit, MI 48202

October 18

Mr. Jin-Woo Park, Procurement Director
Cascade Robotics Corporation
1200 Technology Parkway
Seattle, WA 98101

Dear Mr. Park,

I am writing regarding purchase order #CR-7742 for three hundred precision optical sensor brackets, initially scheduled for delivery to your assembly facility on October 25.

Due to an unexpected supply chain disruption involving our European supplier of specialized anodized aluminum alloys, our primary milling facility in Detroit experienced an involuntary four-day production halt last week. Although raw material deliveries have now resumed and our fabrication lines are operating overtime shifts, we will be unable to fulfill your complete shipment by the original target date.

To minimize any disruption to Cascade Robotics' manufacturing schedule, we have divided your order into two installments. The first consignment of one hundred brackets will be dispatched this Friday, October 22, via priority air freight at our expense. The remaining two hundred units will be shipped no later than November 3.

We deeply regret this inconvenience and are fully prepared to address any logistical complications this adjustment creates. As a credit toward future transactions, Vantage will waive all freight charges associated with both shipments and apply a five percent discount to the invoice total.

Sincerely,

Clara Henderson
Vice President of Commercial Client Accounts`,
      },
    ],
    questionIds: ['q-p7-022', 'q-p7-023', 'q-p7-024', 'q-p7-025'],
  },

  // ---------------------------------------------------------------------------
  // GROUP 10: Single Passage - Press Release (4 Questions: q-p7-026 -> q-p7-029)
  // ---------------------------------------------------------------------------
  {
    id: 'grp-p7-010',
    groupType: 'part7_reading_comprehension',
    partNum: 7,
    difficulty: 'hard',
    topic: 'Corporate Mergers & Biotechnology',
    contextIntro: 'Questions 172-175 refer to the following press release.',
    passageFormat: 'single',
    passages: [
      {
        id: 'pass-p7-010-a',
        formatType: 'article',
        title: 'BioVanguard Acquisition of Greenfield Agritech',
        content: `FOR IMMEDIATE RELEASE
BioVanguard Therapeutics Completes Acquisition of Greenfield Agritech Laboratories

BOSTON, MA - November 5 - BioVanguard Therapeutics (NASDAQ: BVGT) announced today that it has finalized the acquisition of Greenfield Agritech Laboratories, a pioneering research firm specializing in plant-derived enzymes and sustainable biopharmaceuticals. [1] The all-cash transaction, valued at $45 million, was approved unanimously by the boards of directors of both corporations earlier this week.

Under the terms of the agreement, Greenfield Agritech will operate as an independent subsidiary under BioVanguard's Agricultural Biotechnology Division. [2] BioVanguard confirmed that Greenfield's state-of-the-art research complex in Cambridge, Massachusetts, will remain fully operational, with all fifty-five research scientists and lab technicians retaining their positions. Dr. Julian Morales, founder and chief scientist of Greenfield, will assume the newly created title of Executive Vice President of Bioprocess Innovation at BioVanguard.

"Integrating Greenfield's proprietary enzyme synthesis platforms with our commercial distribution networks will dramatically accelerate our drug development pipeline," stated Dr. Rachel Stern, Chief Executive Officer of BioVanguard. [3] The combined entity plans to begin clinical trials for two plant-based therapeutic compounds early next spring. [4]

An informational conference call for institutional investors and industry analysts is scheduled for tomorrow, November 6, at 9:00 A.M. Eastern Time.`,
      },
    ],
    questionIds: ['q-p7-026', 'q-p7-027', 'q-p7-028', 'q-p7-029'],
  },
];

// =============================================================================
// PART 7 MULTIPLE PASSAGES (Preserved for Reading Workspace Continuity)
// =============================================================================

export const PART7_MULTI_GROUPS: Part7Group[] = [
  // ---------------------------------------------------------------------------
  // GROUP 11: Double Passage - Email & Invoice (5 Questions: q-p7-030 -> q-p7-034)
  // ---------------------------------------------------------------------------
  {
    id: 'grp-p7-011',
    groupType: 'part7_reading_comprehension',
    partNum: 7,
    difficulty: 'medium',
    topic: 'Corporate Event Catering & Accounting',
    contextIntro: 'Questions 176-180 refer to the following email inquiry and catering invoice.',
    passageFormat: 'double',
    passages: [
      {
        id: 'pass-p7-011-a',
        formatType: 'email',
        title: 'Catering Service Booking Request',
        content: `To: bookings@delightcatering.com
From: Pamela Wright, Senior Event Coordinator <p.wright@crestviewpharma.com>
Date: October 4
Subject: Catering for Crestview Annual Research Symposium

Dear Delight Catering Team,

I am writing to finalize our catering arrangements for Crestview Pharmaceuticals' Annual Research Symposium, scheduled for Thursday, October 24, at the Belmont Convention Center (Hall C).

We expect approximately 80 scientists and industry partners to attend. We would like to order your "Executive Buffet Package" for lunch at 12:30 P.M., which includes hot entrees, side salads, and assorted desserts. Please note that at least 15 attendees have specified vegetarian preferences, and 5 require gluten-free meal options.

Additionally, we will need continuous hot beverage service (coffee and herbal tea) from 8:30 A.M. until the closing remarks at 4:30 P.M. Because Crestview is a registered corporate client that utilized your services last year, we would appreciate it if you could apply our standard corporate partner discount to the quote.

Please email an itemized confirmation invoice along with payment terms at your earliest convenience.

Sincerely,
Pamela Wright
Crestview Pharmaceuticals`,
      },
      {
        id: 'pass-p7-011-b',
        formatType: 'form',
        title: 'Official Invoice - Delight Catering Services',
        content: `DELIGHT CATERING SERVICES LLC
Invoice #: DC-9042 | Date: October 7
Billed To: Crestview Pharmaceuticals (Attn: Pamela Wright)
Event Date: October 24 | Venue: Belmont Convention Center (Hall C)

Item Description                          Qty    Unit Price    Total
-------------------------------------------------------------------
Executive Lunch Buffet (80 guests)         80      $35.00     $2,800.00
*Includes 15 Vegetarian & 5 Gluten-Free special plates
Full-Day Artisan Coffee & Tea Station       1     $450.00       $450.00
On-Site Service Staff (3 attendants)        8 hrs  $30.00/hr    $720.00
Equipment & Linen Rental                    1     $250.00       $250.00
-------------------------------------------------------------------
Subtotal:                                                     $4,220.00
Returning Corporate Partner Discount (10% off food & beverage): -$325.00
State Sales Tax (8%):                                           $311.60
-------------------------------------------------------------------
Total Amount Due:                                             $4,206.60

Terms: A 50% advance deposit ($2,103.30) is required by October 14 to secure catering staff. Balance payable within 15 days following event completion.
Lead Catering Supervisor on-site: Chef Raymond Moreau`,
      },
    ],
    questionIds: ['q-p7-030', 'q-p7-031', 'q-p7-032', 'q-p7-033', 'q-p7-034'],
  },

  // ---------------------------------------------------------------------------
  // GROUP 12: Double Passage - Advertisement & Email (5 Questions: q-p7-035 -> q-p7-039)
  // ---------------------------------------------------------------------------
  {
    id: 'grp-p7-012',
    groupType: 'part7_reading_comprehension',
    partNum: 7,
    difficulty: 'medium',
    topic: 'Commercial Real Estate & Workspace Lease',
    contextIntro: 'Questions 181-185 refer to the following advertisement and email inquiry.',
    passageFormat: 'double',
    passages: [
      {
        id: 'pass-p7-012-a',
        formatType: 'advertisement',
        title: 'Harborfront Innovation Hub - Workspace Solutions',
        content: `HARBORFRONT INNOVATION HUB
1200 Pacific Marine Way, Suites 400-600, Seattle, WA
Flexible Commercial Workspaces & Turnkey Private Offices

Whether your company is an emerging tech startup or an established consultancy, Harborfront Innovation Hub delivers fully furnished, scalable workspace solutions designed for high-performance teams.

AVAILABLE PRIVATE SUITE TIERS:
- Suite Tier A (Capacity: 4 to 6 workstations): $2,400 per month
- Suite Tier B (Capacity: 8 to 12 workstations): $4,200 per month
- Suite Tier C (Capacity: 16 to 24 workstations): $7,800 per month

ALL SUITE MEMBERSHIPS INCLUDE:
- Enterprise-grade symmetric fiber Internet with redundant failover routing
- 24/7 biometric keycard security access and climate-controlled server racks
- Unlimited gourmet coffee bar, filtered sparkling water, and craft snacks
- Complimentary access to secure indoor bicycle storage and executive shower suites
- Dedicated underground parking stalls available at $150 per stall monthly

FALL LEASING INCENTIVE:
Execute an annual lease agreement for Suite Tier B or C prior to November 15, and receive two complimentary dedicated parking stalls for the entirety of your lease term, plus fifteen monthly conference room booking credits.

To arrange an on-site walkthrough, contact Elena Rostova, Director of Tenant Leasing, at leasing@harborfronthub.com or (206) 555-0148.`,
      },
      {
        id: 'pass-p7-012-b',
        formatType: 'email',
        title: 'Inquiry Regarding Suite Leasing and Facilities Tour',
        content: `To: Elena Rostova <leasing@harborfronthub.com>
From: Marcus Vance <m.vance@cascadefintech.io>
Date: November 3
Subject: Lease Inquiry - Cascade FinTech Expansion

Dear Ms. Rostova,

I am writing on behalf of Cascade FinTech regarding your private workspace offerings at Harborfront Innovation Hub. Our firm currently employs ten full-time software engineers and data analysts, and we plan to onboard an additional product designer next month. Our current lease in Pioneer Square expires on November 30, so we are seeking occupancy beginning December 1.

Based on our team size, we are interested in securing a twelve-month agreement for Suite Tier B. In addition, our executive team requires a total of four dedicated underground parking stalls for daily commuting and visiting financial auditors. If we sign the lease by November 10, could you confirm whether our account qualifies for the promotional package outlined in your commercial brochure?

Furthermore, our multimedia team frequently produces weekly market update podcasts for our clients. Are the on-site media conference rooms equipped for audio broadcasting, and can they be accessed during weekend hours without additional facility surcharge?

I would welcome the opportunity to tour the premises in person. I am available this Thursday, November 7, at 2:00 P.M. Please let me know if this time is convenient for you.

Sincerely,
Marcus Vance
Managing Director, Cascade FinTech`,
      },
    ],
    questionIds: ['q-p7-035', 'q-p7-036', 'q-p7-037', 'q-p7-038', 'q-p7-039'],
  },

  // ---------------------------------------------------------------------------
  // GROUP 13: Triple Passage - Schedule, Memo & Email (5 Questions: q-p7-040 -> q-p7-044)
  // ---------------------------------------------------------------------------
  {
    id: 'grp-p7-013',
    groupType: 'part7_reading_comprehension',
    partNum: 7,
    difficulty: 'hard',
    topic: 'Global Tech Conference & Business Travel',
    contextIntro: 'Questions 186-190 refer to the following conference program, speaker announcement, and email.',
    passageFormat: 'triple',
    passages: [
      {
        id: 'pass-p7-013-a',
        formatType: 'schedule',
        title: 'Global Fintech Expo - Day 1 Session Schedule',
        content: `GLOBAL FINTECH INNOVATION EXPO
Vancouver Convention Centre | November 18 - Day 1 Program

Time            Track 1: Cloud Banking        Track 2: Cybersecurity & AI       Track 3: Payments
                (Ballroom A)                  (Ballroom B)                      (Orchid Room)
--------------------------------------------------------------------------------------------------
09:00 - 10:30   Keynote Address: Future of Digital Currencies (Main Auditorium - All Attendees)
11:00 - 12:30   Next-Gen Cloud Architecture   Automated Fraud Detection         Cross-Border Wire Systems
                Speaker: Ronald Zhang         Speaker: Dr. Aris Thorne          Speaker: Sarah Jenkins
12:30 - 14:00   Networking Luncheon & Exhibition Hall Open (Hall 2)
14:00 - 15:30   Microservices Migration       Zero-Trust Network Defense        Contactless POS Trends
                Speaker: Mei-Ling Chow        Speaker: Henrik Lind              Speaker: Carlos Gomez
16:00 - 17:30   Executive Panel: Regulatory Compliance & Open Banking (Main Auditorium)`,
      },
      {
        id: 'pass-p7-013-b',
        formatType: 'memo',
        title: 'Keynote Speaker Spotlight Memo',
        content: `EXPO PRESS BULLETIN
Spotlight on Keynote and Session Presenters

The organizing committee of the Global Fintech Innovation Expo is thrilled to introduce Dr. Aris Thorne as one of our premier technical presenters for this year's Vancouver summit.

Dr. Thorne serves as Chief Research Fellow at the CyberSec Institute in Zurich. Recognized internationally as an authority on algorithmic risk modeling, he recently published his bestselling treatise, "Predictive Neural Models in Modern Banking Systems." His session on November 18 will showcase real-world case studies demonstrating how automated machine-learning algorithms identify unauthorized transactions in under fifty milliseconds.

Due to anticipated demand, attendees wishing to interact directly with Dr. Thorne during the Q&A period are advised to arrive at Ballroom B at least fifteen minutes prior to the scheduled start time.`,
      },
      {
        id: 'pass-p7-013-c',
        formatType: 'email',
        title: 'Conference Attendance Report & Expense Reimbursement',
        content: `To: David Stirling, VP of Engineering <d.stirling@pacificcapital.ca>
From: Alicia Fontaine, Senior Security Architect <a.fontaine@pacificcapital.ca>
Date: November 21
Subject: Trip Report - Global Fintech Expo Vancouver

Hi David,

I have returned from the Global Fintech Expo in Vancouver and wanted to share a quick summary of key takeaways.

The morning of Day 1 was exceptionally productive. I attended Dr. Thorne's presentation, which was packed to capacity. His demonstration of predictive machine-learning fraud detection directly addresses the latency issues our team has been experiencing with our payment gateway. I spoke with him briefly during the luncheon, and he graciously agreed to review our architecture draft if we email it to his lab next month.

In the afternoon at 2:00 P.M., I remained in Ballroom B for Henrik Lind's practical session on zero-trust infrastructure, which offered several immediate takeaways for our server firewalls.

Attached are my flight boarding passes, hotel receipt, and expo registration badge for the corporate accounting expense claim.

Best regards,
Alicia Fontaine`,
      },
    ],
    questionIds: ['q-p7-040', 'q-p7-041', 'q-p7-042', 'q-p7-043', 'q-p7-044'],
  },

  // ---------------------------------------------------------------------------
  // GROUP 14: Triple Passage - Catalog Notice, Purchase Email & Tracking Report (5 Questions: q-p7-045 -> q-p7-049)
  // ---------------------------------------------------------------------------
  {
    id: 'grp-p7-014',
    groupType: 'part7_reading_comprehension',
    partNum: 7,
    difficulty: 'hard',
    topic: 'Industrial Robotics & Global Logistics',
    contextIntro: 'Questions 191-195 refer to the following product catalog notice, purchase order email, and freight tracking report.',
    passageFormat: 'triple',
    passages: [
      {
        id: 'pass-p7-014-a',
        formatType: 'article',
        title: 'Optima Robotics Industrial Automation Catalog Announcement',
        content: `OPTIMA ROBOTICS INTERNATIONAL
New Product Release: Series-X Industrial Articulated Arms

Optima Robotics is proud to announce the global release of our Series-X line of high-precision robotic assembly arms, engineered for precision electronics manufacturing, automotive component fabrication, and packaging automation.

MODEL SPECIFICATIONS:
- Model OR-200 (Compact Assembly): Payload capacity 5 kg | Reach 700 mm | Unit Price: $14,000
- Model OR-500 (Standard Assembly): Payload capacity 20 kg | Reach 1,400 mm | Unit Price: $28,000
- Model OR-900 (Heavy Industrial): Payload capacity 50 kg | Reach 2,100 mm | Unit Price: $46,000

SOFTWARE & SENSOR PACKAGES:
Every robotic arm includes the base OptimaMotion Control software suite. For automated visual quality inspection, clients may bundle the VisionPro Optical Guidance Package for an additional $4,000 per unit.

CORPORATE PROCUREMENT INCENTIVE:
Orders of three or more robotic units placed during the active fiscal quarter qualify for complimentary priority ocean freight transport to any international commercial port, as well as two days of on-site system calibration by a certified Optima field engineer.`,
      },
      {
        id: 'pass-p7-014-b',
        formatType: 'email',
        title: 'Purchase Order Submission - Apex Automotive Components',
        content: `To: Sales Department <orders@optimarobotics.com>
From: Kenji Takahashi, Operations Director <k.takahashi@apexauto.jp>
Date: March 8
Subject: Purchase Order #APX-8820 - Assembly Line Upgrade

Dear Optima Robotics Sales Team,

Apex Automotive Components is pleased to submit Purchase Order #APX-8820 to equip our fabrication facility in Nagoya, Japan.

Following our technical consultation with your regional sales representative, we wish to order three (3) Model OR-500 robotic arms. In addition, please include the VisionPro Optical Guidance Package for each of the three units to support our micro-weld defect inspection line.

As noted in your promotional announcement, our purchase of three units entitles Apex Automotive to waived shipping costs and two days of on-site calibration by your certified field staff. Please coordinate the delivery schedule so that the machinery arrives at our Nagoya receiving dock no later than March 28, before our end-of-quarter maintenance shutdown.

Our procurement accounting department has already authorized payment via electronic wire transfer upon receipt of your official invoice.

Sincerely,
Kenji Takahashi
Director of Plant Operations, Apex Automotive Components Ltd.`,
      },
      {
        id: 'pass-p7-014-c',
        formatType: 'form',
        title: 'Pacific Cargo Logistics - Consignment Status Report',
        content: `PACIFIC CARGO LOGISTICS INTERNATIONAL
Ocean Freight Consignment Tracking | Tracking ID: PCL-8820-JP
Shipper: Optima Robotics (Chicago Distribution Hub)
Consignee: Apex Automotive Components (Plant #4, Nagoya, Japan)
Purchase Order: #APX-8820 | Cargo: 3 Industrial Machinery Crates (Total Gross Weight: 1,840 kg)

TRANSIT TIMELINE:
- March 12, 08:30: Freight loaded and departed Chicago central freight terminal.
- March 16, 14:15: Arrived at Port of Oakland; export customs clearance verified.
- March 18, 19:00: Vessel "Pacific Voyager" departed Port of Oakland.
- March 23, 07:45: Vessel docked at Port of Nagoya; offloaded to bonded customs warehouse.
- March 25, 11:30: Customs inspection completed; cleared for domestic ground carrier dispatch.
- March 26, 15:00: Consignment delivered to Apex Automotive Plant #4 Receiving Bay; signed by H. Sato.

SERVICE NOTIFICATION:
Optima certified field engineer Liam Gallagher is scheduled to arrive on-site on March 27 at 09:00 for equipment calibration and software integration testing.`,
      },
    ],
    questionIds: ['q-p7-045', 'q-p7-046', 'q-p7-047', 'q-p7-048', 'q-p7-049'],
  },

  // ---------------------------------------------------------------------------
  // GROUP 15: Triple Passage - Notice, Email & Verified Review (5 Questions: q-p7-050 -> q-p7-054)
  // ---------------------------------------------------------------------------
  {
    id: 'grp-p7-015',
    groupType: 'part7_reading_comprehension',
    partNum: 7,
    difficulty: 'hard',
    topic: 'Hospitality Management & Corporate Retreat',
    contextIntro: 'Questions 196-200 refer to the following facility announcement, reservation email, and customer review.',
    passageFormat: 'triple',
    passages: [
      {
        id: 'pass-p7-015-a',
        formatType: 'notice',
        title: 'Highland Grand Hotel & Conference Suites Renovation Notice',
        content: `HIGHLAND GRAND HOTEL & CONFERENCE SUITES
Royal Mile, Edinburgh, Scotland | www.highlandgrand.co.uk

The management of Highland Grand Hotel is thrilled to announce the completion of our multi-million-pound refurbishment program. Beginning this spring, corporate clients and conference organizers will enjoy expanded world-class hospitality and meeting spaces.

EVENT SPACES & CONFERENCE CAPACITY:
- The Grand Monarch Ballroom: Accommodates up to 450 delegates; equipped with dual 4K LED video walls.
- The Robert Burns Suite: Accommodates up to 100 delegates; ideal for corporate seminars, workshops, and private banquets.
- The Arthur's Seat Boardroom: Accommodates up to 20 delegates; features teleconferencing equipment and soundproofing.

DELEGATE SERVICES & AMENITIES:
All corporate conference bookings include morning artisan coffee with Scottish pastries, midday hot luncheon buffet, afternoon tea, high-speed fiber Wi-Fi, and dedicated on-site audiovisual technicians.

SPECIAL GROUP BOOKING INCENTIVE:
Organizations reserving thirty or more guest accommodations in our newly remodeled Royal Wing receive a twenty percent rebate on all banquet catering charges, along with complimentary shuttle service between the hotel and Edinburgh Waverley Railway Station.`,
      },
      {
        id: 'pass-p7-015-b',
        formatType: 'email',
        title: 'Retreat Space Reservation - Sterling Life Insurance',
        content: `To: Corporate Events Desk <events@highlandgrand.co.uk>
From: Fiona Campbell, Senior Event Planner <f.campbell@sterlinglife.co.uk>
Date: April 14
Subject: Reservation Confirmation - Annual Leadership Retreat (May 22-24)

Dear Highland Grand Events Team,

I am writing to finalize our booking for Sterling Life Insurance's Annual Leadership Retreat, scheduled from May 22 to May 24.

We have seventy-five senior managers and regional directors attending this three-day conference. Based on our presentation schedule, we wish to reserve the Robert Burns Suite for our daily morning and afternoon strategy sessions. In addition, we will require thirty-five executive guestrooms in the Royal Wing for our traveling attendees for three nights (checking in May 22, checking out May 25).

As our room reservation exceeds your promotional threshold, please ensure that the twenty percent banquet rebate is applied to our catering estimate. Furthermore, we would like to schedule your complimentary Waverley Railway Station shuttle on the morning of May 22 to pick up our London delegation arriving at 10:15 A.M.

Lastly, we plan to host a private celebratory evening dinner on May 23. Could you send us your seasonal banquet menus and wine selection list?

Warm regards,
Fiona Campbell
Corporate Events Specialist, Sterling Life Insurance`,
      },
      {
        id: 'pass-p7-015-c',
        formatType: 'article',
        title: 'Executive Travel Forum - Verified Corporate Review',
        content: `BUSINESS TRAVEL DIRECTORY - VERIFIED REVIEWS
Venue: Highland Grand Hotel & Conference Suites, Edinburgh
Reviewer: Fiona Campbell, Edinburgh | Rating: 4 / 5 Stars | Date: May 28
Title: Superb conference facilities with minor transit delay

"Sterling Life Insurance recently hosted our 75-person leadership retreat at the Highland Grand Hotel. Overall, our experience was exceptional. The remodeled Royal Wing accommodations were spotless, modern, and whisper-quiet. The Robert Burns Suite provided an ideal environment for our strategic workshops, and the audiovisual technicians ensured that all our digital slide presentations ran without interruption.

The culinary team exceeded our expectations during our May 23 celebratory banquet; both the venison and vegetarian entrees were exquisite, and our twenty percent catering discount was properly credited on the master invoice.

My only criticism involves the transportation logistics. The station shuttle sent to collect our London executives on the morning of May 22 arrived thirty minutes late due to poorly routed city traffic, causing several attendees to miss the opening keynote address. Aside from this transit delay, Highland Grand proved to be an outstanding venue, and we anticipate returning next spring."`,
      },
    ],
    questionIds: ['q-p7-050', 'q-p7-051', 'q-p7-052', 'q-p7-053', 'q-p7-054'],
  },
];

// Unified PART7_GROUPS (12 groups total: 10 single + 2 multiple)
export const PART7_GROUPS: Part7Group[] = [
  ...PART7_SINGLE_GROUPS,
  ...PART7_MULTI_GROUPS,
];

// =============================================================================
// PART 7 QUESTIONS (29 Single Passages + 10 Multiple Passages = 39 Total)
// =============================================================================

export const PART7_SINGLE_QUESTIONS: Part7Question[] = [
  // --- Group 1 Questions (q-p7-001 -> q-p7-002) Single Email ---
  {
    id: 'q-p7-001',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-001',
    orderInGroup: 1,
    questionType: 'purpose',
    difficulty: 'easy',
    topic: 'Software Licensing & Customer Service',
    skillTag: 'Part 7: Purpose - Xác định mục đích thư gia hạn',
    question: 'What is the primary purpose of the email?',
    options: [
      { key: 'A', text: 'To promote a newly released accounting software' },
      { key: 'B', text: 'To notify a client about an expiring subscription' },
      { key: 'C', text: 'To request technical assistance for forty users' },
      { key: 'D', text: 'To issue a refund for unused corporate licenses' },
    ],
    correctKey: 'B',
    explanation:
      'Đoạn 1 nêu rõ: "We are writing to notify you that your current annual enterprise license ... is scheduled to expire on June 15." Mục đích chính là thông báo cho khách hàng biết hợp đồng sắp hết hạn.',
  },
  {
    id: 'q-p7-002',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-001',
    orderInGroup: 2,
    questionType: 'detail',
    difficulty: 'easy',
    topic: 'Software Licensing & Customer Service',
    skillTag: 'Part 7: Detail - Điều kiện nhận chiết khấu gia hạn sớm',
    question: 'What must Nordic Designs do to receive a fifteen percent discount?',
    options: [
      { key: 'A', text: 'Add ten additional sales representatives' },
      { key: 'B', text: 'Upgrade to the AI analytics module' },
      { key: 'C', text: 'Submit payment by June 1' },
      { key: 'D', text: 'Sign a five-year service contract' },
    ],
    correctKey: 'C',
    explanation:
      'Đoạn 2 nêu rõ: "To qualify for this reduced pricing, your payment must be processed by June 1." Do đó chọn phương án (C).',
  },

  // --- Group 2 Questions (q-p7-003 -> q-p7-004) Single Notice ---
  {
    id: 'q-p7-003',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-002',
    orderInGroup: 1,
    questionType: 'purpose',
    difficulty: 'easy',
    topic: 'Facilities Management & Maintenance',
    skillTag: 'Part 7: Purpose - Mục đích thông báo bảo trì thang máy',
    question: 'Why was the notice posted?',
    options: [
      { key: 'A', text: 'To announce temporary elevator service disruptions' },
      { key: 'B', text: 'To recruit building security personnel' },
      { key: 'C', text: 'To advertise available commercial office suites' },
      { key: 'D', text: 'To introduce new parking garage regulations' },
    ],
    correctKey: 'A',
    explanation:
      'Tiêu đề thông báo ghi: "ELEVATOR UPGRADE & SERVICE DISRUPTION" và đoạn 1 giải thích thang máy chở khách trung tâm sẽ tạm ngưng hoạt động để nâng cấp điều khiển từ thứ Bảy đến Chủ Nhật. Chọn (A).',
  },
  {
    id: 'q-p7-004',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-002',
    orderInGroup: 2,
    questionType: 'detail',
    difficulty: 'easy',
    topic: 'Facilities Management & Maintenance',
    skillTag: 'Part 7: Detail - Lối đi thay thế trong thời gian bảo trì',
    question: 'How can tenants access upper floors during the maintenance period?',
    options: [
      { key: 'A', text: 'By reserving private shuttle vans' },
      { key: 'B', text: 'By utilizing the exterior fire stairs only' },
      { key: 'C', text: 'By requesting elevator keys from security' },
      { key: 'D', text: 'By using the rear freight elevator' },
    ],
    correctKey: 'D',
    explanation:
      'Đoạn 2 nêu rõ: "the high-capacity freight elevator located adjacent to the rear loading dock will remain fully operational for tenant access." Nhân viên tòa nhà có thể sử dụng thang máy chở hàng ở phía sau.',
  },

  // --- Group 3 Questions (q-p7-005 -> q-p7-006) Single Chat ---
  {
    id: 'q-p7-005',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-003',
    orderInGroup: 1,
    questionType: 'contextual_interpretation',
    difficulty: 'easy',
    topic: 'Marketing & Presentation Coordination',
    skillTag: 'Part 7: Contextual Interpretation - Ý nghĩa câu nói trong hội thoại tin nhắn',
    question: 'At 10:15 A.M., what does Mr. Ortiz most likely mean when he writes, "I\'m on it"?',
    options: [
      { key: 'A', text: 'He is currently attending a client meeting' },
      { key: 'B', text: 'He will review the financial spreadsheet again' },
      { key: 'C', text: 'He will handle the file export immediately' },
      { key: 'D', text: 'He has already picked up the printed binders' },
    ],
    correctKey: 'C',
    explanation:
      'Ngay trước đó Maya hỏi: "Could you export the file now?" (Bạn có thể xuất file ngay bây giờ không?). Câu trả lời "I\'m on it" (Tôi xử lý ngay đây) đi kèm "I\'ll upload the final export... right away" có nghĩa là anh ấy sẽ thực hiện việc xuất và gửi file ngay lập tức.',
  },
  {
    id: 'q-p7-006',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-003',
    orderInGroup: 2,
    questionType: 'detail',
    difficulty: 'easy',
    topic: 'Marketing & Presentation Coordination',
    skillTag: 'Part 7: Detail - Người sẽ nhận tài liệu in hoàn chỉnh',
    question: 'What will Ms. Jensen do before the 1:00 P.M. luncheon?',
    options: [
      { key: 'A', text: 'Collect the bound copies from the print shop' },
      { key: 'B', text: 'Create new revenue bar charts for slide 8' },
      { key: 'C', text: 'Telephone the procurement team at Kensington' },
      { key: 'D', text: 'Send an invoice to the catering coordinator' },
    ],
    correctKey: 'A',
    explanation:
      'Tin nhắn cuối cùng của Maya Jensen ghi: "I\'ll pick up the finished binders on my way to the boardroom." (Tôi sẽ ghé lấy các tập tài liệu đã đóng gáy trên đường tới phòng họp). Chọn (A).',
  },

  // --- Group 4 Questions (q-p7-007 -> q-p7-008) Single Schedule ---
  {
    id: 'q-p7-007',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-004',
    orderInGroup: 1,
    questionType: 'detail',
    difficulty: 'medium',
    topic: 'Professional Development & Logistics Summit',
    skillTag: 'Part 7: Detail - Tra cứu lịch trình hội thảo',
    question: 'Which workshop takes place in Room C at 2:30 P.M.?',
    options: [
      { key: 'A', text: 'AI-Driven Inventory Tracking' },
      { key: 'B', text: 'Sustainable Packaging Innovations' },
      { key: 'C', text: 'Freight Negotiation Strategies' },
      { key: 'D', text: 'Cold-Chain Compliance & Regulations' },
    ],
    correctKey: 'B',
    explanation:
      'Bảng lịch trình ghi rõ: dòng 2:30 - 3:45 | Room C | Session Title: "Sustainable Packaging Innovations" (Người điều phối: Evelyn Vance). Chọn (B).',
  },
  {
    id: 'q-p7-008',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-004',
    orderInGroup: 2,
    questionType: 'inference',
    difficulty: 'medium',
    topic: 'Professional Development & Logistics Summit',
    skillTag: 'Part 7: Inference - Suy luận đối tượng phù hợp theo chủ đề phiên họp',
    question: 'Who would most likely benefit from the 4:00 P.M. session in the Executive Boardroom?',
    options: [
      { key: 'A', text: 'Software developers programming RFID handheld sensors' },
      { key: 'B', text: 'Technicians monitoring refrigerated medicine trailers' },
      { key: 'C', text: 'Graphic artists designing eco-friendly product cartons' },
      { key: 'D', text: 'Corporate shipping managers negotiating carrier agreements' },
    ],
    correctKey: 'D',
    explanation:
      'Phiên 4:00 - 5:15 tại Executive Boardroom có chủ đề "Freight Negotiation Strategies for Shippers" với nội dung "Tactics for contracting regional trucking carriers" (Chiến lược đàm phán cước vận chuyển và ký hợp đồng với các hãng xe tải). Đối tượng hưởng lợi trực tiếp nhất là các quản lý vận tải/giao nhận hàng hóa (D).',
  },

  // --- Group 5 Questions (q-p7-009 -> q-p7-011) Single Advertisement ---
  {
    id: 'q-p7-009',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-005',
    orderInGroup: 1,
    questionType: 'purpose',
    difficulty: 'medium',
    topic: 'Real Estate & Co-working Amenities',
    skillTag: 'Part 7: Purpose - Dịch vụ quảng cáo văn phòng chia sẻ',
    question: 'What is being advertised?',
    options: [
      { key: 'A', text: 'Flexible office suites and co-working amenities' },
      { key: 'B', text: 'Commercial furniture manufacturing services' },
      { key: 'C', text: 'An enterprise fiber-optic Internet subscription' },
      { key: 'D', text: 'A corporate catering and coffee delivery service' },
    ],
    correctKey: 'A',
    explanation:
      'Tiêu đề và đoạn mở đầu nêu rõ dịch vụ cho thuê văn phòng trọn gói và không gian làm việc cộng tác: "Nexus Executive Workspace offers turnkey private offices and flexible collaborative spaces". Chọn (A).',
  },
  {
    id: 'q-p7-010',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-005',
    orderInGroup: 2,
    questionType: 'detail',
    difficulty: 'medium',
    topic: 'Real Estate & Co-working Amenities',
    skillTag: 'Part 7: Detail - Tiện ích miễn phí trong gói thành viên',
    question: 'What amenity is included for members at no extra cost?',
    options: [
      { key: 'A', text: 'Dedicated personal vehicle parking spaces' },
      { key: 'B', text: 'Legal consulting for corporate patent filings' },
      { key: 'C', text: 'Access to soundproof podcast and media booths' },
      { key: 'D', text: 'Full reimbursement for residential utilities' },
    ],
    correctKey: 'C',
    explanation:
      'Mục Membership Packages gạch đầu dòng thứ 3 nêu rõ: "Complimentary access to soundproof video podcast booths and media conference rooms." Chọn (C).',
  },
  {
    id: 'q-p7-011',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-005',
    orderInGroup: 3,
    questionType: 'detail',
    difficulty: 'medium',
    topic: 'Real Estate & Co-working Amenities',
    skillTag: 'Part 7: Detail - Điều kiện khuyến mãi khai trương',
    question: 'What is required to qualify for the first month rent-free promotion?',
    options: [
      { key: 'A', text: 'Pay a one-year lease deposit upfront' },
      { key: 'B', text: 'Commit to a six-month agreement by August 31' },
      { key: 'C', text: 'Refer two other freelance consultants' },
      { key: 'D', text: 'Schedule a facility walkthrough on a weekend' },
    ],
    correctKey: 'B',
    explanation:
      'Mục Grand Opening Promotion nêu rõ: "Sign a six-month private suite agreement before August 31 and receive your first month rent-free". Chọn (B).',
  },

  // --- Group 6 Questions (q-p7-012 -> q-p7-014) Single Product Description ---
  {
    id: 'q-p7-012',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-006',
    orderInGroup: 1,
    questionType: 'detail',
    difficulty: 'medium',
    topic: 'Office Equipment & Environmental Health',
    skillTag: 'Part 7: Detail - Tính năng lõi lọc HEPA của sản phẩm',
    question: 'What is stated about the AeroBreeze AB-400X filtration system?',
    options: [
      { key: 'A', text: 'It requires monthly replacement of its motor bearings' },
      { key: 'B', text: 'It operates exclusively on commercial solar batteries' },
      { key: 'C', text: 'It is designed solely for small residential bedrooms' },
      { key: 'D', text: 'It traps microscopic particles as small as 0.1 microns' },
    ],
    correctKey: 'D',
    explanation:
      'Mục Quad-Stage Filtration Matrix nêu rõ: "a certified True HEPA core that captures 99.97% of microscopic particulates down to 0.1 microns." Chọn (D).',
  },
  {
    id: 'q-p7-013',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-006',
    orderInGroup: 2,
    questionType: 'inference',
    difficulty: 'medium',
    topic: 'Office Equipment & Environmental Health',
    skillTag: 'Part 7: Inference - Tác động của hệ thống acoustic shield',
    question: 'What feature makes the device suitable for executive conference rooms?',
    options: [
      { key: 'A', text: 'Its integrated wireless smartphone charger' },
      { key: 'B', text: 'Its low operational noise level below 28 decibels' },
      { key: 'C', text: 'Its wall-mounted mahogany wooden casing' },
      { key: 'D', text: 'Its ability to cool the air like an air conditioner' },
    ],
    correctKey: 'B',
    explanation:
      'Mục WhisperFlow Acoustic Shield giải thích: "maintains sound output under 28 decibels on silent mode, ensuring zero distraction during meetings or phone calls." Độ ồn cực thấp dưới 28 dB giúp cuộc họp không bị làm phiền.',
  },
  {
    id: 'q-p7-014',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-006',
    orderInGroup: 3,
    questionType: 'detail',
    difficulty: 'medium',
    topic: 'Office Equipment & Environmental Health',
    skillTag: 'Part 7: Detail - Tần suất thay lõi lọc HEPA chính',
    question: 'How frequently should the primary HEPA filter cartridge be replaced?',
    options: [
      { key: 'A', text: 'Once every twelve months' },
      { key: 'B', text: 'Every thirty calendar days' },
      { key: 'C', text: 'Twice during each calendar quarter' },
      { key: 'D', text: 'Only when the five-year warranty expires' },
    ],
    correctKey: 'A',
    explanation:
      'Mục Maintenance Guidelines nêu rõ: "the primary HEPA filter cartridge requires replacement every 12 months." Do đó chọn (A).',
  },

  // --- Group 7 Questions (q-p7-015 -> q-p7-017) Single Online Review ---
  {
    id: 'q-p7-015',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-007',
    orderInGroup: 1,
    questionType: 'detail',
    difficulty: 'medium',
    topic: 'Software Evaluation & Fleet Management',
    skillTag: 'Part 7: Detail - Điểm mạnh nhất của phần mềm FleetPulse',
    question: 'According to Mr. Alvarez, what is the best feature of FleetPulse?',
    options: [
      { key: 'A', text: 'Its automated vehicle wash scheduling system' },
      { key: 'B', text: 'Its payroll calculation and driver commission module' },
      { key: 'C', text: 'Its real-time interactive GPS vehicle tracking dashboard' },
      { key: 'D', text: 'Its discounted fuel purchasing network' },
    ],
    correctKey: 'C',
    explanation:
      'Mục Strengths nêu: "The live interactive tracking dashboard is by far the most impressive feature. Dispatchers can pinpoint delivery vehicles within five meters". Chọn (C).',
  },
  {
    id: 'q-p7-016',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-007',
    orderInGroup: 2,
    questionType: 'detail',
    difficulty: 'medium',
    topic: 'Software Evaluation & Fleet Management',
    skillTag: 'Part 7: Detail - Vấn đề cần khắc phục được người đánh giá đề xuất',
    question: 'What problem does the reviewer report regarding the software?',
    options: [
      { key: 'A', text: 'Mobile devices fail to recharge inside delivery vans' },
      { key: 'B', text: 'Customer service representatives never return calls' },
      { key: 'C', text: 'Monthly subscription fees doubled without notice' },
      { key: 'D', text: 'The mileage report tool freezes when compiling quarterly data' },
    ],
    correctKey: 'D',
    explanation:
      'Mục Areas for Improvement ghi rõ: "the automated mileage report export tool occasionally freezes when generating multi-vehicle quarterly summaries." Chọn (D).',
  },
  {
    id: 'q-p7-017',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-007',
    orderInGroup: 3,
    questionType: 'inference',
    difficulty: 'medium',
    topic: 'Software Evaluation & Fleet Management',
    skillTag: 'Part 7: Inference - Đặc điểm quy mô doanh nghiệp của người đánh giá',
    question: 'What is indicated about SwiftHaul Regional Couriers?',
    options: [
      { key: 'A', text: 'It has offices in thirty foreign countries' },
      { key: 'B', text: 'It manages a substantial fleet of seventy-five vans' },
      { key: 'C', text: 'It specializes in intercontinental air cargo' },
      { key: 'D', text: 'It was founded less than three weeks ago' },
    ],
    correctKey: 'B',
    explanation:
      'Đoạn 1 nêu rõ: "Our courier company operates a fleet of seventy-five delivery vans across three metropolitan counties." Doanh nghiệp quản lý đội xe gồm 75 chiếc xe tải giao hàng.',
  },

  // --- Group 8 Questions (q-p7-018 -> q-p7-021) Single Policy Memo ---
  {
    id: 'q-p7-018',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-008',
    orderInGroup: 1,
    questionType: 'detail',
    difficulty: 'hard',
    topic: 'Human Resources & Remote Work Policy',
    skillTag: 'Part 7: Detail - Điều kiện hưởng phụ cấp công nghệ làm việc tại nhà',
    question: 'Who is eligible to receive the technology stipend?',
    options: [
      { key: 'A', text: 'Full-time staff working remotely at least two days weekly' },
      { key: 'B', text: 'All part-time interns in their first week of employment' },
      { key: 'C', text: 'Independent contractors hired for temporary projects' },
      { key: 'D', text: 'Executives who commute daily to the central headquarters' },
    ],
    correctKey: 'A',
    explanation:
      'Mục 1 (Eligibility & Allocation) nêu rõ: "Full-time permanent employees who work remotely at least two days per business week are eligible for an annual reimbursement stipend of up to $600." Chọn (A).',
  },
  {
    id: 'q-p7-019',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-008',
    orderInGroup: 2,
    questionType: 'detail',
    difficulty: 'hard',
    topic: 'Human Resources & Remote Work Policy',
    skillTag: 'Part 7: Detail - Thiết bị đủ điều kiện thanh toán hoàn tiền',
    question: 'Which item is reimbursable under the policy?',
    options: [
      { key: 'A', text: 'Monthly residential Internet utility bills' },
      { key: 'B', text: 'Replacement inkjet printer cartridges' },
      { key: 'C', text: 'Noise-canceling headsets' },
      { key: 'D', text: 'Home gaming consoles' },
    ],
    correctKey: 'C',
    explanation:
      'Mục 2 (Qualified Equipment) liệt kê: "external monitors, ergonomic desk chairs, wireless keyboards and mice, noise-canceling headsets, and document scanners." Mực in và cước internet bị loại trừ rõ ràng. Chọn (C).',
  },
  {
    id: 'q-p7-020',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-008',
    orderInGroup: 3,
    questionType: 'detail',
    difficulty: 'hard',
    topic: 'Human Resources & Remote Work Policy',
    skillTag: 'Part 7: Detail - Hậu quả khi thiếu hóa đơn chi tiết',
    question: 'What happens if an employee submits a claim without itemized receipts?',
    options: [
      { key: 'A', text: 'The employee will face immediate disciplinary termination' },
      { key: 'B', text: 'Security personnel will audit the employee\'s home' },
      { key: 'C', text: 'The amount will be deducted from the next bonus' },
      { key: 'D', text: 'The claim will be returned without being processed' },
    ],
    correctKey: 'D',
    explanation:
      'Mục 3 (Reimbursement Procedure) khẳng định: "Claims lacking detailed payment documentation will be returned without processing." Chọn (D).',
  },
  {
    id: 'q-p7-021',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-008',
    orderInGroup: 4,
    questionType: 'sentence_insertion',
    difficulty: 'hard',
    topic: 'Human Resources & Remote Work Policy',
    skillTag: 'Part 7: Sentence Insertion - Vị trí chèn câu quy định hóa đơn hợp lệ',
    question:
      'In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong?\n"Claims submitted past this deadline will forfeit reimbursement rights for that fiscal year."',
    options: [
      { key: 'A', text: '[1]' },
      { key: 'B', text: '[2]' },
      { key: 'C', text: '[3]' },
      { key: 'D', text: '[4]' },
    ],
    correctKey: 'C',
    explanation:
      'Trước vị trí [3] là câu quy định mốc thời gian mua sắm: "All purchases must be made between September 1 and November 30 of the active calendar year." Câu cần chèn cảnh báo về việc nộp muộn sau hạn chót ("past this deadline"), bổ sung ý trực tiếp cho câu xác định thời hạn ở trước vị trí [3].',
  },

  // --- Group 9 Questions (q-p7-022 -> q-p7-025) Single Business Letter ---
  {
    id: 'q-p7-022',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-009',
    orderInGroup: 1,
    questionType: 'purpose',
    difficulty: 'hard',
    topic: 'Manufacturing & Supplier Relations',
    skillTag: 'Part 7: Purpose - Mục đích thư giải thích dời lịch giao hàng',
    question: 'What is the main purpose of Ms. Henderson\'s letter?',
    options: [
      { key: 'A', text: 'To explain a shipment delay and outline a revised schedule' },
      { key: 'B', text: 'To cancel a purchase order due to client insolvency' },
      { key: 'C', text: 'To announce the permanent closure of a Detroit factory' },
      { key: 'D', text: 'To request an advance payment for raw aluminum materials' },
    ],
    correctKey: 'A',
    explanation:
      'Mục đích chính của bức thư là thông báo và giải thích về sự cố chậm trễ đơn hàng linh kiện #CR-7742 và đề xuất phương án chia làm 2 đợt giao hàng mới. Chọn (A).',
  },
  {
    id: 'q-p7-023',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-009',
    orderInGroup: 2,
    questionType: 'detail',
    difficulty: 'hard',
    topic: 'Manufacturing & Supplier Relations',
    skillTag: 'Part 7: Detail - Nguyên nhân gây gián đoạn sản xuất',
    question: 'What caused the interruption at the milling plant?',
    options: [
      { key: 'A', text: 'A prolonged labor strike by logistics truck drivers' },
      { key: 'B', text: 'A major power outage caused by severe winter storms' },
      { key: 'C', text: 'A supply chain disruption involving imported aluminum alloys' },
      { key: 'D', text: 'An accidental fire in the precision sensor testing room' },
    ],
    correctKey: 'C',
    explanation:
      'Đoạn 2 nêu rõ nguyên nhân: "Due to an unexpected supply chain disruption involving our European supplier of specialized anodized aluminum alloys, our primary milling facility in Detroit experienced an involuntary four-day production halt". Chọn (C).',
  },
  {
    id: 'q-p7-024',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-009',
    orderInGroup: 3,
    questionType: 'vocabulary_in_context',
    difficulty: 'hard',
    topic: 'Manufacturing & Supplier Relations',
    skillTag: 'Part 7: Vocabulary in Context - Nghĩa của từ address trong ngữ cảnh thư từ',
    question: 'The word "address" in paragraph 4 is closest in meaning to:',
    options: [
      { key: 'A', text: 'deliver' },
      { key: 'B', text: 'resolve' },
      { key: 'C', text: 'speak to' },
      { key: 'D', text: 'mail' },
    ],
    correctKey: 'B',
    explanation:
      'Trong câu "are fully prepared to address any logistical complications this adjustment creates", từ "address" mang nghĩa giải quyết, xử lý (resolve / deal with) các khó khăn logistics phát sinh. Chọn (B).',
  },
  {
    id: 'q-p7-025',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-009',
    orderInGroup: 4,
    questionType: 'detail',
    difficulty: 'hard',
    topic: 'Manufacturing & Supplier Relations',
    skillTag: 'Part 7: Detail - Quyền lợi đền bù nhà cung cấp cung cấp',
    question: 'What concession does Vantage offer Cascade Robotics?',
    options: [
      { key: 'A', text: 'Free consulting on automated assembly robotics' },
      { key: 'B', text: 'Two hundred additional brackets at no charge' },
      { key: 'C', text: 'An option to purchase the Detroit manufacturing facility' },
      { key: 'D', text: 'Waiver of all shipping fees plus a five percent discount' },
    ],
    correctKey: 'D',
    explanation:
      'Đoạn cuối nêu rõ biện pháp thiện chí: "Vantage will waive all freight charges associated with both shipments and apply a five percent discount to the invoice total." Chọn (D).',
  },

  // --- Group 10 Questions (q-p7-026 -> q-p7-029) Single Press Release ---
  {
    id: 'q-p7-026',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-010',
    orderInGroup: 1,
    questionType: 'main_idea',
    difficulty: 'hard',
    topic: 'Corporate Mergers & Biotechnology',
    skillTag: 'Part 7: Main Idea - Nội dung chính của thông cáo báo chí',
    question: 'What is the main subject of the press release?',
    options: [
      { key: 'A', text: 'The closure of an agricultural research facility in Boston' },
      { key: 'B', text: 'A regulatory dispute between competing biotech laboratories' },
      { key: 'C', text: 'The acquisition of a research company by BioVanguard' },
      { key: 'D', text: 'The appointment of a new CEO at Greenfield Agritech' },
    ],
    correctKey: 'C',
    explanation:
      'Tiêu đề và đoạn 1 nêu rõ: "BioVanguard Therapeutics Completes Acquisition of Greenfield Agritech Laboratories". Nội dung thông cáo báo chí là việc BioVanguard mua lại Greenfield Agritech với giá 45 triệu USD. Chọn (C).',
  },
  {
    id: 'q-p7-027',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-010',
    orderInGroup: 2,
    questionType: 'detail',
    difficulty: 'hard',
    topic: 'Corporate Mergers & Biotechnology',
    skillTag: 'Part 7: Detail - Giá trị giao dịch mua lại',
    question: 'How much did BioVanguard pay to acquire Greenfield Agritech?',
    options: [
      { key: 'A', text: '$15 million' },
      { key: 'B', text: '$55 million' },
      { key: 'C', text: '$450 million' },
      { key: 'D', text: '$45 million' },
    ],
    correctKey: 'D',
    explanation:
      'Đoạn 1 nêu rõ: "The all-cash transaction, valued at $45 million, was approved unanimously by the boards of directors". Giá trị giao dịch là 45 triệu USD. Chọn (D).',
  },
  {
    id: 'q-p7-028',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-010',
    orderInGroup: 3,
    questionType: 'detail',
    difficulty: 'hard',
    topic: 'Corporate Mergers & Biotechnology',
    skillTag: 'Part 7: Detail - Tình trạng việc làm của nhân viên sau sáp nhập',
    question: 'What will happen to Greenfield\'s research staff after the transaction?',
    options: [
      { key: 'A', text: 'They will be relocated to BioVanguard\'s headquarters in Zurich' },
      { key: 'B', text: 'All fifty-five scientists and technicians will keep their jobs' },
      { key: 'C', text: 'They will be offered early retirement packages' },
      { key: 'D', text: 'They will be retrained in software telematics engineering' },
    ],
    correctKey: 'B',
    explanation:
      'Đoạn 2 nêu rõ: "with all fifty-five research scientists and lab technicians retaining their positions." Toàn bộ 55 nhân sự nghiên cứu và kỹ thuật viên đều được giữ nguyên việc làm. Chọn (B).',
  },
  {
    id: 'q-p7-029',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-010',
    orderInGroup: 4,
    questionType: 'sentence_insertion',
    difficulty: 'hard',
    topic: 'Corporate Mergers & Biotechnology',
    skillTag: 'Part 7: Sentence Insertion - Vị trí chèn câu bình luận chiến lược mua lại',
    question:
      'In which of the positions marked [1], [2], [3], and [4] does the following sentence best belong?\n"Financial details of the merger were finalized following a six-month due diligence review."',
    options: [
      { key: 'A', text: '[1]' },
      { key: 'B', text: '[2]' },
      { key: 'C', text: '[3]' },
      { key: 'D', text: '[4]' },
    ],
    correctKey: 'A',
    explanation:
      'Câu cần chèn nói về chi tiết tài chính của thương vụ sáp nhập ("Financial details of the merger were finalized..."). Vị trí [1] nằm ngay sau câu công bố thỏa thuận mua lại và ngay trước câu nêu giá trị giao dịch ("The all-cash transaction, valued at $45 million..."), tạo thành mạch thông tin tài chính chặt chẽ.',
  },
];

// =============================================================================
// PART 7 MULTIPLE PASSAGE QUESTIONS (Preserved for Reading Workspace Continuity)
// =============================================================================

export const PART7_MULTI_QUESTIONS: Part7Question[] = [
  // --- Group 11 Questions (q-p7-030 -> q-p7-034) Double Email & Invoice ---
  {
    id: 'q-p7-030',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-011',
    orderInGroup: 1,
    questionType: 'detail',
    difficulty: 'medium',
    topic: 'Corporate Event Catering & Accounting',
    skillTag: 'Part 7: Detail - Số lượng người ăn chay trong email yêu cầu',
    question: 'How many attendees require vegetarian meal options?',
    options: [
      { key: 'A', text: '5' },
      { key: 'B', text: '15' },
      { key: 'C', text: '20' },
      { key: 'D', text: '80' },
    ],
    correctKey: 'B',
    explanation:
      'Trong email đầu tiên, Pamela Wright viết: "Please note that at least 15 attendees have specified vegetarian preferences". Hóa đơn thứ hai cũng xác nhận "*Includes 15 Vegetarian & 5 Gluten-Free special plates".',
  },
  {
    id: 'q-p7-031',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-011',
    orderInGroup: 2,
    questionType: 'cross_text_synthesis',
    crossTextReference: true,
    difficulty: 'medium',
    topic: 'Corporate Event Catering & Accounting',
    skillTag: 'Part 7: Cross-Text Synthesis - Đối chiếu chiết khấu khách quen giữa email và hóa đơn',
    question: 'What discount did Delight Catering apply to Crestview Pharmaceuticals\' invoice?',
    options: [
      { key: 'A', text: '10% discount on food and beverage services' },
      { key: 'B', text: '15% discount on staff hourly wages' },
      { key: 'C', text: 'Free linen and equipment rental' },
      { key: 'D', text: 'A $500 waiver on sales tax' },
    ],
    correctKey: 'A',
    explanation:
      'Trong email, Pamela Wright đề nghị áp dụng "standard corporate partner discount". Trên hóa đơn DC-9042, mục giảm trừ ghi rõ: "Returning Corporate Partner Discount (10% off food & beverage): -$325.00".',
  },
  {
    id: 'q-p7-032',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-011',
    orderInGroup: 3,
    questionType: 'detail',
    difficulty: 'medium',
    topic: 'Corporate Event Catering & Accounting',
    skillTag: 'Part 7: Detail - Thời hạn nộp tiền đặt cọc theo điều khoản hóa đơn',
    question: 'By what date must the initial 50% deposit be paid?',
    options: [
      { key: 'A', text: 'October 4' },
      { key: 'B', text: 'October 7' },
      { key: 'C', text: 'October 14' },
      { key: 'D', text: 'October 24' },
    ],
    correctKey: 'C',
    explanation:
      'Dưới mục Terms trong hóa đơn DC-9042 ghi rõ: "A 50% advance deposit ($2,103.30) is required by October 14 to secure catering staff."',
  },
  {
    id: 'q-p7-033',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-011',
    orderInGroup: 4,
    questionType: 'detail',
    difficulty: 'medium',
    topic: 'Corporate Event Catering & Accounting',
    skillTag: 'Part 7: Detail - Nhận diện nhân sự giám sát hiện trường',
    question: 'Who will supervise catering operations on the event day?',
    options: [
      { key: 'A', text: 'Pamela Wright' },
      { key: 'B', text: 'Tobias Weber' },
      { key: 'C', text: 'Sarah Chen' },
      { key: 'D', text: 'Chef Raymond Moreau' },
    ],
    correctKey: 'D',
    explanation:
      'Cuối hóa đơn DC-9042 ghi: "Lead Catering Supervisor on-site: Chef Raymond Moreau". Do đó Chef Raymond Moreau là người chịu trách nhiệm giám sát hiện trường.',
  },
  {
    id: 'q-p7-034',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-011',
    orderInGroup: 5,
    questionType: 'inference',
    difficulty: 'medium',
    topic: 'Corporate Event Catering & Accounting',
    skillTag: 'Part 7: Inference - Thời lượng phục vụ của nhân viên catering',
    question: 'How long are the catering attendants scheduled to work at the symposium?',
    options: [
      { key: 'A', text: '4 hours' },
      { key: 'B', text: '24 hours' },
      { key: 'C', text: '12 hours' },
      { key: 'D', text: '8 hours' },
    ],
    correctKey: 'D',
    explanation:
      'Hóa đơn ghi mục: "On-Site Service Staff (3 attendants) | Qty: 8 hrs". Email cũng nêu đồ uống được phục vụ từ 8:30 A.M. đến 4:30 P.M. (đúng 8 tiếng đồng hồ). Chọn (D).',
  },

  // --- Group 12 Questions (q-p7-035 -> q-p7-039) Double Advertisement & Email ---
  {
    id: 'q-p7-035',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-012',
    orderInGroup: 1,
    questionType: 'purpose',
    difficulty: 'medium',
    topic: 'Commercial Real Estate & Workspace Lease',
    skillTag: 'Part 7: Purpose - Mục đích thư hỏi thuê văn phòng',
    question: 'What is the main purpose of Mr. Vance\'s email?',
    options: [
      { key: 'A', text: 'To inquire about office lease terms and arrange a property tour' },
      { key: 'B', text: 'To terminate an existing commercial rental agreement' },
      { key: 'C', text: 'To dispute an incorrect monthly parking garage invoice' },
      { key: 'D', text: 'To submit resumes for available software engineering positions' },
    ],
    correctKey: 'A',
    explanation:
      'Trong email gửi Elena Rostova, Marcus Vance viết để hỏi thông tin chi tiết về việc thuê văn phòng Suite Tier B cho công ty Cascade FinTech và đề xuất một buổi tham quan thực tế vào thứ Năm lúc 2:00 P.M. Chọn (A).',
  },
  {
    id: 'q-p7-036',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-012',
    orderInGroup: 2,
    questionType: 'detail',
    difficulty: 'medium',
    topic: 'Commercial Real Estate & Workspace Lease',
    skillTag: 'Part 7: Detail - Tiện ích miễn phí đi kèm thẻ thành viên',
    question: 'According to the advertisement, what amenity is included in all memberships at no extra charge?',
    options: [
      { key: 'A', text: 'Dedicated underground parking stalls' },
      { key: 'B', text: 'Audio podcast broadcasting equipment' },
      { key: 'C', text: 'Indoor bicycle storage and executive shower suites' },
      { key: 'D', text: 'Private server rack maintenance services' },
    ],
    correctKey: 'C',
    explanation:
      'Trong phần "ALL SUITE MEMBERSHIPS INCLUDE" của quảng cáo, dòng thứ tư nêu rõ: "Complimentary access to secure indoor bicycle storage and executive shower suites" (Truy cập miễn phí khu để xe đạp trong nhà và phòng tắm cao cấp). Chỗ đậu xe ngầm có thu phí $150/tháng. Chọn (C).',
  },
  {
    id: 'q-p7-037',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-012',
    orderInGroup: 3,
    questionType: 'cross_text_synthesis',
    crossTextReference: true,
    difficulty: 'medium',
    topic: 'Commercial Real Estate & Workspace Lease',
    skillTag: 'Part 7: Cross-Text Synthesis - Tính toán chi phí đỗ xe sau ưu đãi khuyến mãi',
    question: 'How much will Cascade FinTech pay each month for parking if they finalize their lease on November 10?',
    options: [
      { key: 'A', text: '$150' },
      { key: 'B', text: '$300' },
      { key: 'C', text: '$450' },
      { key: 'D', text: '$600' },
    ],
    correctKey: 'B',
    explanation:
      'Trong email, Marcus cho biết công ty cần 4 chỗ đậu xe ("requires a total of four dedicated underground parking stalls"). Quảng cáo có chương trình ưu đãi mùa thu ("FALL LEASING INCENTIVE"): ký hợp đồng năm trước ngày 15/11 được tặng 2 chỗ miễn phí ("receive two complimentary dedicated parking stalls"). Do ký ngày 10/11, họ được tặng 2 chỗ và chỉ phải trả tiền 2 chỗ còn lại: 2 × $150 = $300/tháng. Chọn (B).',
  },
  {
    id: 'q-p7-038',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-012',
    orderInGroup: 4,
    questionType: 'inference',
    difficulty: 'medium',
    topic: 'Commercial Real Estate & Workspace Lease',
    skillTag: 'Part 7: Inference - Lựa chọn loại văn phòng phù hợp quy mô nhân sự',
    question: 'Why is Suite Tier B the most suitable option for Cascade FinTech?',
    options: [
      { key: 'A', text: 'It is the only suite featuring an oceanfront balcony view' },
      { key: 'B', text: 'It includes complimentary daily catering services' },
      { key: 'C', text: 'It is discounted by fifty percent for startup businesses' },
      { key: 'D', text: 'Its workstation capacity matches the size of Mr. Vance\'s team' },
    ],
    correctKey: 'D',
    explanation:
      'Trong email, Marcus nêu rõ nhóm hiện có 10 người và sẽ bổ sung thêm 1 nhà thiết kế vào tháng sau (tổng cộng 11 nhân viên). Đối chiếu quảng cáo, Suite Tier B có sức chứa từ 8 đến 12 bàn làm việc ("Capacity: 8 to 12 workstations"), hoàn toàn tương thích với quy mô 11 người của công ty. Chọn (D).',
  },
  {
    id: 'q-p7-039',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-012',
    orderInGroup: 5,
    questionType: 'detail',
    difficulty: 'medium',
    topic: 'Commercial Real Estate & Workspace Lease',
    skillTag: 'Part 7: Detail - Điều kiện sử dụng phòng họp truyền thông',
    question: 'What information does Mr. Vance request regarding the media conference rooms?',
    options: [
      { key: 'A', text: 'Whether they can be booked on weekends without extra fees' },
      { key: 'B', text: 'How many broadcast microphones are supplied in each room' },
      { key: 'C', text: 'If catering can be served during client presentations' },
      { key: 'D', text: 'When the current audiovisual equipment was installed' },
    ],
    correctKey: 'A',
    explanation:
      'Đoạn 3 của bức email có câu hỏi: "can they be accessed during weekend hours without additional facility surcharge?" (liệu phòng họp có thể được sử dụng vào cuối tuần mà không phải chịu phụ phí hay không). Do đó chọn (A).',
  },

  // --- Group 13 Questions (q-p7-040 -> q-p7-044) Triple Schedule, Memo & Email ---
  {
    id: 'q-p7-040',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-013',
    orderInGroup: 1,
    questionType: 'detail',
    difficulty: 'hard',
    topic: 'Global Tech Conference & Business Travel',
    skillTag: 'Part 7: Detail - Diễn giả thuyết trình chuyên đề phát hiện gian lận',
    question: 'In the program, who is scheduled to speak on Automated Fraud Detection?',
    options: [
      { key: 'A', text: 'Ronald Zhang' },
      { key: 'B', text: 'Henrik Lind' },
      { key: 'C', text: 'Dr. Aris Thorne' },
      { key: 'D', text: 'Sarah Jenkins' },
    ],
    correctKey: 'C',
    explanation:
      'Trong Lịch trình (văn bản 1), tại khung giờ 11:00 - 12:30 ở Track 2 (Ballroom B), bài thuyết trình "Automated Fraud Detection" do diễn giả Dr. Aris Thorne đảm nhiệm. Chọn (C).',
  },
  {
    id: 'q-p7-041',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-013',
    orderInGroup: 2,
    questionType: 'cross_text_synthesis',
    crossTextReference: true,
    difficulty: 'hard',
    topic: 'Global Tech Conference & Business Travel',
    skillTag: 'Part 7: Cross-Text Synthesis - Đối chiếu phòng hội thảo của diễn giả chính',
    question: 'In which room did Dr. Aris Thorne deliver his technical presentation?',
    options: [
      { key: 'A', text: 'Main Auditorium' },
      { key: 'B', text: 'Ballroom A' },
      { key: 'C', text: 'Orchid Room' },
      { key: 'D', text: 'Ballroom B' },
    ],
    correctKey: 'D',
    explanation:
      'Đối chiếu văn bản 1 (Schedule) ở Track 2: Cybersecurity & AI (Ballroom B) lúc 11:00 có diễn giả Dr. Aris Thorne. Văn bản 2 (Memo) cũng nhắc: "arrive at Ballroom B at least fifteen minutes prior to the scheduled start time". Chọn (D).',
  },
  {
    id: 'q-p7-042',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-013',
    orderInGroup: 3,
    questionType: 'detail',
    difficulty: 'hard',
    topic: 'Global Tech Conference & Business Travel',
    skillTag: 'Part 7: Detail - Thành tựu học thuật của diễn giả',
    question: 'What is mentioned about Dr. Thorne in the press bulletin?',
    options: [
      { key: 'A', text: 'He was recently elected mayor of Zurich' },
      { key: 'B', text: 'He authored a published treatise on banking neural models' },
      { key: 'C', text: 'He established a new venture capital fund in Vancouver' },
      { key: 'D', text: 'He developed the convention center\'s optical sensor network' },
    ],
    correctKey: 'B',
    explanation:
      'Văn bản 2 (Press Bulletin) ghi rõ: "he recently published his bestselling treatise, \'Predictive Neural Models in Modern Banking Systems\'". Do đó chọn (B).',
  },
  {
    id: 'q-p7-043',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-013',
    orderInGroup: 4,
    questionType: 'cross_text_synthesis',
    crossTextReference: true,
    difficulty: 'hard',
    topic: 'Global Tech Conference & Business Travel',
    skillTag: 'Part 7: Cross-Text Synthesis - Đối chiếu thời gian và chủ đề hội thảo chiều',
    question: 'What topic was covered in the session Alicia Fontaine attended at 2:00 P.M.?',
    options: [
      { key: 'A', text: 'Microservices Migration' },
      { key: 'B', text: 'Contactless POS Trends' },
      { key: 'C', text: 'Zero-Trust Network Defense' },
      { key: 'D', text: 'Next-Gen Cloud Architecture' },
    ],
    correctKey: 'C',
    explanation:
      'Trong Email (văn bản 3), Alicia viết: "In the afternoon at 2:00 P.M., I remained in Ballroom B for Henrik Lind\'s practical session". Đối chiếu Lịch trình (văn bản 1), khung 14:00 - 15:30 tại Ballroom B là bài "Zero-Trust Network Defense" do Henrik Lind trình bày. Chọn (C).',
  },
  {
    id: 'q-p7-044',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-013',
    orderInGroup: 5,
    questionType: 'negative_fact',
    difficulty: 'hard',
    topic: 'Global Tech Conference & Business Travel',
    skillTag: 'Part 7: Negative Fact - Hồ sơ không đính kèm báo cáo công tác',
    question: 'What document is NOT mentioned as an attachment to Ms. Fontaine\'s email?',
    options: [
      { key: 'A', text: 'A signed commercial lease agreement' },
      { key: 'B', text: 'Flight boarding passes' },
      { key: 'C', text: 'A hotel lodging receipt' },
      { key: 'D', text: 'An expo conference registration badge' },
    ],
    correctKey: 'A',
    explanation:
      'Đoạn cuối email nêu: "Attached are my flight boarding passes, hotel receipt, and expo registration badge for the corporate accounting expense claim." Không hề có hợp đồng thuê nhà thương mại nào được đính kèm. Chọn (A).',
  },

  // --- Group 14 Questions (q-p7-045 -> q-p7-049) Triple Catalog Notice, Purchase Email & Tracking Report ---
  {
    id: 'q-p7-045',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-014',
    orderInGroup: 1,
    questionType: 'detail',
    difficulty: 'hard',
    topic: 'Industrial Robotics & Global Logistics',
    skillTag: 'Part 7: Detail - Tải trọng cánh tay robot OR-500',
    question: 'What payload capacity does the Model OR-500 robotic arm possess?',
    options: [
      { key: 'A', text: '5 kg' },
      { key: 'B', text: '14 kg' },
      { key: 'C', text: '20 kg' },
      { key: 'D', text: '50 kg' },
    ],
    correctKey: 'C',
    explanation:
      'Trong danh mục thông số Model OR-500 (Standard Assembly), văn bản 1 ghi rõ: "Payload capacity 20 kg | Reach 1,400 mm | Unit Price: $28,000". Chọn (C).',
  },
  {
    id: 'q-p7-046',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-014',
    orderInGroup: 2,
    questionType: 'cross_text_synthesis',
    crossTextReference: true,
    difficulty: 'hard',
    topic: 'Industrial Robotics & Global Logistics',
    skillTag: 'Part 7: Cross-Text Synthesis - Tính toán tổng giá trị đơn hàng linh kiện',
    question: 'What is the total purchase price of the equipment ordered by Apex Automotive before discounts?',
    options: [
      { key: 'A', text: '$96,000' },
      { key: 'B', text: '$84,000' },
      { key: 'C', text: '$92,000' },
      { key: 'D', text: '$108,000' },
    ],
    correctKey: 'A',
    explanation:
      'Trong email (văn bản 2), Kenji Takahashi đặt mua 3 cánh tay robot Model OR-500 và bổ sung gói VisionPro cho cả 3 máy. Đối chiếu văn bản 1: giá Model OR-500 là $28,000/chiếc; gói VisionPro là $4,000/chiếc. Tổng giá 1 máy hoàn chỉnh = $28,000 + $4,000 = $32,000. Tổng tiền 3 máy = 3 × $32,000 = $96,000. Chọn (A).',
  },
  {
    id: 'q-p7-047',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-014',
    orderInGroup: 3,
    questionType: 'cross_text_synthesis',
    crossTextReference: true,
    difficulty: 'hard',
    topic: 'Industrial Robotics & Global Logistics',
    skillTag: 'Part 7: Cross-Text Synthesis - Điều kiện hưởng miễn phí hiệu chuẩn máy móc',
    question: 'Why was Apex Automotive eligible for complimentary on-site engineer calibration?',
    options: [
      { key: 'A', text: 'They signed a five-year equipment maintenance contract' },
      { key: 'B', text: 'They submitted their purchase order prior to March 1' },
      { key: 'C', text: 'They arranged payment through a local Tokyo commercial bank' },
      { key: 'D', text: 'They ordered at least three robotic arm units' },
    ],
    correctKey: 'D',
    explanation:
      'Mục CORPORATE PROCUREMENT INCENTIVE ở văn bản 1 nêu rõ: "Orders of three or more robotic units placed during the active fiscal quarter qualify for ... two days of on-site system calibration by a certified Optima field engineer". Do Apex đặt mua đúng 3 chiếc nên đủ điều kiện hưởng quyền lợi này. Chọn (D).',
  },
  {
    id: 'q-p7-048',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-014',
    orderInGroup: 4,
    questionType: 'detail',
    difficulty: 'hard',
    topic: 'Industrial Robotics & Global Logistics',
    skillTag: 'Part 7: Detail - Mốc thời gian hoàn tất thủ tục hải quan xuất khẩu',
    question: 'When did the freight shipment clear export customs in Oakland?',
    options: [
      { key: 'A', text: 'March 12' },
      { key: 'B', text: 'March 16' },
      { key: 'C', text: 'March 18' },
      { key: 'D', text: 'March 25' },
    ],
    correctKey: 'B',
    explanation:
      'Bảng theo dõi lộ trình vận chuyển (văn bản 3) ghi nhận tại mốc ngày March 16 lúc 14:15: "Arrived at Port of Oakland; export customs clearance verified." Chọn (B).',
  },
  {
    id: 'q-p7-049',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-014',
    orderInGroup: 5,
    questionType: 'cross_text_synthesis',
    crossTextReference: true,
    difficulty: 'hard',
    topic: 'Industrial Robotics & Global Logistics',
    skillTag: 'Part 7: Cross-Text Synthesis - Hoạt động kỹ thuật tại nhà máy vào ngày 27/3',
    question: 'What is scheduled to happen at Apex Automotive on March 27?',
    options: [
      { key: 'A', text: 'A complete factory electrical shutdown for routine maintenance' },
      { key: 'B', text: 'An inspection by Japanese port maritime safety officials' },
      { key: 'C', text: 'A wire transfer payment audit by corporate accountants' },
      { key: 'D', text: 'On-site equipment calibration by a certified Optima engineer' },
    ],
    correctKey: 'D',
    explanation:
      'Mục SERVICE NOTIFICATION ở cuối văn bản 3 thông báo: "Optima certified field engineer Liam Gallagher is scheduled to arrive on-site on March 27 at 09:00 for equipment calibration and software integration testing." Chọn (D).',
  },

  // --- Group 15 Questions (q-p7-050 -> q-p7-054) Triple Facility Notice, Reservation Email & Verified Review ---
  {
    id: 'q-p7-050',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-015',
    orderInGroup: 1,
    questionType: 'purpose',
    difficulty: 'hard',
    topic: 'Hospitality Management & Corporate Retreat',
    skillTag: 'Part 7: Purpose - Mục đích thư xác nhận đặt phòng hội nghị và lưu trú',
    question: 'What is the primary purpose of Ms. Campbell\'s email?',
    options: [
      { key: 'A', text: 'To complain about poor traffic coordination in Edinburgh' },
      { key: 'B', text: 'To finalize arrangements for a corporate retreat and hotel rooms' },
      { key: 'C', text: 'To request an estimate for an outdoor construction project' },
      { key: 'D', text: 'To cancel an executive leadership conference in May' },
    ],
    correctKey: 'B',
    explanation:
      'Trong email gửi Highland Grand Events Team, Fiona Campbell nêu rõ: "I am writing to finalize our booking for Sterling Life Insurance\'s Annual Leadership Retreat" và xác nhận giữ phòng họp Robert Burns Suite cùng 35 phòng nghỉ executive. Chọn (B).',
  },
  {
    id: 'q-p7-051',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-015',
    orderInGroup: 2,
    questionType: 'cross_text_synthesis',
    crossTextReference: true,
    difficulty: 'hard',
    topic: 'Hospitality Management & Corporate Retreat',
    skillTag: 'Part 7: Cross-Text Synthesis - Điều kiện nhận chiết khấu tiệc 20%',
    question: 'Why was Sterling Life Insurance entitled to a twenty percent banquet rebate?',
    options: [
      { key: 'A', text: 'They held their corporate conference during a weekday morning' },
      { key: 'B', text: 'They paid for their banquet package six months in advance' },
      { key: 'C', text: 'Their reservation included more than two hundred attendees' },
      { key: 'D', text: 'They booked thirty-five guest accommodations in the Royal Wing' },
    ],
    correctKey: 'D',
    explanation:
      'Văn bản 1 nêu chính sách ưu đãi: "Organizations reserving thirty or more guest accommodations in our newly remodeled Royal Wing receive a twenty percent rebate on all banquet catering charges". Trong email (văn bản 2), công ty đặt 35 phòng trong Royal Wing (vượt ngưỡng yêu cầu tối thiểu 30 phòng). Chọn (D).',
  },
  {
    id: 'q-p7-052',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-015',
    orderInGroup: 3,
    questionType: 'detail',
    difficulty: 'hard',
    topic: 'Hospitality Management & Corporate Retreat',
    skillTag: 'Part 7: Detail - Địa điểm tổ chức hội thảo chiến lược hàng ngày',
    question: 'Which event space was reserved for the retreat\'s daily strategy sessions?',
    options: [
      { key: 'A', text: 'The Robert Burns Suite' },
      { key: 'B', text: 'The Grand Monarch Ballroom' },
      { key: 'C', text: 'The Arthur\'s Seat Boardroom' },
      { key: 'D', text: 'The Royal Mile Gallery' },
    ],
    correctKey: 'A',
    explanation:
      'Trong email (văn bản 2), Fiona viết: "we wish to reserve the Robert Burns Suite for our daily morning and afternoon strategy sessions." Bài đánh giá (văn bản 3) cũng khẳng định phòng Robert Burns Suite mang lại không gian lý tưởng cho các buổi thảo luận chiến lược. Chọn (A).',
  },
  {
    id: 'q-p7-053',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-015',
    orderInGroup: 4,
    questionType: 'detail',
    difficulty: 'hard',
    topic: 'Hospitality Management & Corporate Retreat',
    skillTag: 'Part 7: Detail - Vấn đề bị phàn nàn trong bài đánh giá dịch vụ',
    question: 'What issue was noted in Ms. Campbell\'s online review?',
    options: [
      { key: 'A', text: 'The projection equipment in the Burns Suite malfunctioned' },
      { key: 'B', text: 'The evening banquet venison dish was served cold' },
      { key: 'C', text: 'The railway station shuttle arrived thirty minutes behind schedule' },
      { key: 'D', text: 'The executive bedrooms in the Royal Wing were excessively noisy' },
    ],
    correctKey: 'C',
    explanation:
      'Trong bài đánh giá (văn bản 3), Fiona viết: "The station shuttle sent to collect our London executives on the morning of May 22 arrived thirty minutes late due to poorly routed city traffic" (xe đưa đón tới muộn 30 phút do giao thông). Chọn (C).',
  },
  {
    id: 'q-p7-054',
    partNum: 7,
    part: 'Part 7',
    section: 'reading',
    groupId: 'grp-p7-015',
    orderInGroup: 5,
    questionType: 'cross_text_synthesis',
    crossTextReference: true,
    difficulty: 'hard',
    topic: 'Hospitality Management & Corporate Retreat',
    skillTag: 'Part 7: Cross-Text Synthesis - Đặc điểm phòng nghỉ của đại biểu',
    question: 'What is indicated about the guestrooms where the London executives stayed?',
    options: [
      { key: 'A', text: 'They were scheduled to be demolished after the summer season' },
      { key: 'B', text: 'They had recently undergone comprehensive renovation' },
      { key: 'C', text: 'They were located adjacent to Edinburgh Waverley Station' },
      { key: 'D', text: 'They lacked high-speed fiber-optic Internet connectivity' },
    ],
    correctKey: 'B',
    explanation:
      'Trong email và bài đánh giá, các đại biểu lưu trú tại "Royal Wing accommodations". Đối chiếu văn bản 1, Royal Wing vừa trải qua chương trình nâng cấp cải tạo toàn diện trị giá nhiều triệu bảng ("completion of our multi-million-pound refurbishment program"). Chọn (B).',
  },
];

// Unified PART7_QUESTIONS (54 questions total: 29 single + 25 multiple)
export const PART7_QUESTIONS: Part7Question[] = [
  ...PART7_SINGLE_QUESTIONS,
  ...PART7_MULTI_QUESTIONS,
];
