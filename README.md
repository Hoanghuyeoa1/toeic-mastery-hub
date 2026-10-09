# TOEIC Mastery Hub — Hệ Thống Quản Lý Lộ Trình & Luyện Thi TOEIC Cá Nhân Hóa (Offline-First)

[![React Version](https://img.shields.io/badge/React-19.2.8-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.3.3-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Tài liệu hệ thống dành cho Kỹ sư và AI Agent tiếp quản dự án.**  
> Phiên bản tài liệu: **2.25.0-phase17-results-review** — Ngày chuẩn hóa: **2026-10-09**.  
> Tham chiếu danh mục toàn bộ file mã nguồn: [`docs/FILE_INDEX.md`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/docs/FILE_INDEX.md)  
> Nhật ký thay đổi và kiểm định: [`CHANGELOG.md`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/CHANGELOG.md)  
> Quy chuẩn phát triển cho AI Agent: [`AGENTS.md`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/AGENTS.md)

---

## MỤC LỤC
1. [A. Tổng Quan Dự Án](#a-tổng-quan-dự-án)
2. [B. Kiến Trúc Hệ Thống & Luồng Dữ Liệu](#b-kiến-trúc-hệ-thống--luồng-dữ-liệu)
3. [C. Cấu Trúc Thư Mục & Danh Sách File](#c-cấu-trúc-thư-mục--danh-sách-file)
4. [D. Danh Sách Chức Năng Chi Tiết (Feature Catalog)](#d-danh-sách-chức-năng-chi-tiết-feature-catalog)
5. [E. Hướng Dẫn Cài Đặt & Vận Hành](#e-hướng-dẫn-cài-đặt--vận-hành)
6. [F. Trạng Thái Phát Triển & Ghi Chú Chuyển Giao (Handoff Notes)](#f-trạng-thái-phát-triển--ghi-chú-chuyển-giao-handoff-notes)

---

## A. TỔNG QUAN DỰ ÁN

### 1. Giới thiệu & Mục đích
**TOEIC Mastery Hub** là ứng dụng web đơn trang (Single Page Application - SPA) hiệu năng cao, được thiết kế theo triết lý **Offline-First**, phục vụ người học tiếng Anh luyện thi chứng chỉ **TOEIC Listening & Reading (thang điểm 10 - 990)**.

Ứng dụng giúp học viên loại bỏ sự phụ thuộc vào các bảng tính rời rạc hay ứng dụng ghi chép thủ công bằng cách tích hợp toàn diện:
- Lộ trình học 3 giai đoạn có thể tùy biến linh hoạt.
- Kho từ vựng thuật toán Spaced Repetition (Lặp lại ngắt quãng) với thẻ lật 3D và phát âm bản xứ.
- Bảng tổng hợp bẫy đề thi kinh điển (ETS Traps) và công thức ngữ pháp kèm chiến thuật phòng vệ.
- Nhật ký thi thử tự động quy đổi điểm chuẩn ETS kèm **Sổ tay lỗi sai (Mistake Book)** phân tích sâu căn nguyên thất bại.
- Bộ đôi đồng hồ bấm giờ phòng thi chuẩn 120 phút và chu kỳ tập trung Pomodoro.
- Hệ thống chẩn đoán năng lực đầu vào (Mini Diagnostic Test) 14 câu phân hóa chính xác trình độ.

### 2. Bài toán giải quyết
1. **Thiếu sự liên kết giữa lý thuyết và thực chiến:** Học viên học từ vựng nhưng không biết từ đó hay bị gài bẫy ở Part nào; làm đề thi thử xong chỉ biết điểm mà không phân loại được nguyên nhân sai (bẫy âm, hổng ngữ pháp, thiếu từ vựng hay áp lực thời gian).
2. **Quyền riêng tư & Sự phụ thuộc máy chủ:** Học viên e ngại lưu thông tin điểm số, tiến độ cá nhân lên các server đám mây không bảo mật. Ứng dụng giải quyết triệt để vấn đề này bằng cách lưu trữ 100% cục bộ trên trình duyệt, có cơ chế xuất/nhập sao lưu JSON minh bạch.
3. **Phân phối thời gian làm bài yếu kém:** Không kiểm soát được 45 phút Listening và 75 phút Reading, dẫn đến tình trạng "cháy giờ" ở Part 7.

### 3. Đối tượng sử dụng
- Thí sinh tự ôn luyện TOEIC mục tiêu từ mất gốc (0-450) lên mức làm chủ (750 - 850 - 990).
- Giảng viên và trợ giảng TOEIC cần một công cụ tiêu chuẩn để học viên tự theo dõi nhật ký làm bài và tổng hợp lỗi sai.

### 4. Công nghệ & Thư viện sử dụng

| Công nghệ / Thư viện | Phiên bản | Mục đích sử dụng |
|---|---|---|
| **React** | `^19.2.8` | Thư viện UI nền tảng, component hóa toàn bộ giao diện |
| **TypeScript** | `~6.0.2` | Định kiểu dữ liệu chặt chẽ (Strict Type Safety) toàn bộ hệ thống |
| **Vite** | `^8.3.0` | Build tool và Dev server tốc độ cực nhanh với ESM native |
| **Tailwind CSS** | `^4.3.3` | Tiện ích CSS hiện đại nhất (v4 `@import "tailwindcss"`) |
| **Recharts** | `^3.10.1` | Trực quan hóa dữ liệu (Radar Chart 7 Parts, Line Chart lịch sử điểm) |
| **Lucide React** | `^1.45.0` | Bộ biểu tượng vector giao diện phẳng, hiện đại |
| **Canvas Confetti** | `^1.9.4` | Hiệu ứng pháo hoa chúc mừng khi hoàn thành mục tiêu / test |
| **Oxlint** | `^1.81.0` | Linter hiệu năng cao kiểm tra cú pháp và code smells |
| **Web Audio API** | Native Browser | Tổng hợp sóng âm thanh (Sine/Triangle oscillators) tạo chuông báo offline |
| **Web Speech API** | Native Browser | Công nghệ đọc văn bản tiếng Anh (`SpeechSynthesis`) tích hợp sẵn trên trình duyệt |

---

## B. KIẾN TRÚC HỆ THỐNG & LUỒNG DỮ LIỆU

### 1. Kiến trúc tổng thể (Architecture Pattern)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TRÌNH DUYỆT (CLIENT BROWSER)                     │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                     LỚP GIAO DIỆN (UI LAYER)                   │   │
│   │  Navbar | CommandCenter | Roadmap | VocabVault | TestLogView   │   │
│   │  TimerHub | GrammarAndTraps | OnboardingModal | PracticeConfig │   │
│   └───────────────────────────────▲────────────────────────────────┘   │
│                                   │                                    │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                LỚP QUẢN LÝ TRẠNG THÁI (STATE STORE)             │   │
│   │                    AppContext.tsx & useApp()                   │   │
│   │                    usePracticeSession.ts (Hook)                │   │
│   │   - Event-driven Goal Dispatcher                               │   │
│   │   - Wall-Clock Countdown & Auto-Timeout Engine                 │   │
│   └───────────────────────▲───────────────▲────────────────────────┘   │
│                           │               │                            │
│           ┌───────────────┴────┐     ┌────┴────────────────┐           │
│           │ TIỆN ÍCH & LOGIC   │     │ ENGINE BROWSER NATIVE│          │
│           │ scoreConverter.ts  │     │ Web Audio (audio.ts)│          │
│           │ questionBank/      │     │ Web Speech Synthesis│          │
│           │ questionSelector.ts│     │ LocalStorage IO     │          │
│           │ sessionEngine.ts   │     │                     │          │
│           │ sessionStorage.ts  │     │                     │          │
│           │ examSessionEngine  │     │                     │          │
│           │ examSessionStorage │     │                     │          │
│           └────────────────────┘     └─────────────────────┘          │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                    PERSISTENCE LAYER (OFFLINE)                 │   │
│   │       App Key: 'toeic_mastery_data_v2_cold'                    │   │
│   │       Active Practice: 'toeic_practice_active_session_v1'      │   │
│   │       Practice History: 'toeic_practice_session_history_v1'    │   │
│   │       Active Exam: 'toeic_exam_active_session_v1'              │   │
│   │       Exam History: 'toeic_exam_session_history_v1'            │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Luồng dữ liệu (Unidirectional Data Flow)
1. **Khởi tạo dữ liệu (Cold Start):**
   - Khi ứng dụng tải lần đầu, [`AppContext`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/context/AppContext.tsx) đọc `localStorage.getItem('toeic_mastery_data_v2_cold')`.
   - Nếu trống, ứng dụng nạp cấu hình [`INITIAL_APP_DATA`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/seedData.ts) (profile người dùng mới, streak = 0, chưa có điểm thi ảo).
2. **Kích hoạt sự kiện học tập (Event-driven Activity Recording):**
   - Mọi hành động thực tế của người dùng: lật thẻ từ vựng (`onVocabReviewed`), nộp điểm thi thử (`onTestSubmitted`), xác nhận hiểu bẫy (`onTrapStudied`), hoặc hoàn thành phiên Pomodoro (`onPomodoroFinished`) đều gọi qua hàm trung tâm `triggerGoalProgress(key, count)` và `recordActivity(amount)`.
   - `recordActivity` tự động cập nhật Heatmap cho ngày hiện tại (`YYYY-MM-DD`) và tính toán nghiêm ngặt số ngày duy trì chuỗi học tập (Streak Days).
3. **Đồng bộ tự động (Auto Persistence):**
   - Mọi thay đổi trong React state `data` đều được hook `useEffect` chuyển đổi thành chuỗi JSON và ghi vào LocalStorage.
4. **Phản hồi âm thanh & Trực quan (Instant Feedback):**
   - [`soundService`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/audio.ts) phát âm thanh Chime khi hoàn thành mục tiêu hoặc Tick khi thao tác.
   - `canvas-confetti` được kích hoạt khi vượt qua mốc quan trọng.

### 3. Quyết định kiến trúc quan trọng (Key Architectural Decisions)

1. **Kiến trúc Zero-Backend / 100% Client-side:**
   - *Lý do:* Tối ưu hóa tính riêng tư tuyệt đối cho người học, không tốn chi phí duy trì cơ sở hạ tầng máy chủ, hoạt động hoàn hảo ngay cả khi ngắt kết nối mạng Internet.
2. **Âm thanh tổng hợp bằng Web Audio API thay vì tệp MP3 ngoài:**
   - *File liên quan:* [`src/utils/audio.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/audio.ts)
   - *Lý do:* Tránh việc phải tải các tệp audio dung lượng lớn từ mạng, loại bỏ lỗi gián đoạn 404, âm thanh được tổng hợp tại thời gian thực qua tần số sóng Sine/Triangle.
3. **Phát âm bài nghe bằng Web Speech API native:**
   - *File liên quan:* [`src/components/Diagnostic/ToeicAudioPlayer.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Diagnostic/ToeicAudioPlayer.tsx), [`src/components/Vocabulary/VocabVault.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Vocabulary/VocabVault.tsx)
   - *Lý do:* Cho phép đọc phát âm từ vựng và kịch bản bài thi nghe mà không cần lưu trữ hàng trăm megabytes audio thu âm sẵn.
4. **Đồ họa minh họa Part 1 và Graphic Table hoàn toàn bằng SVG thuần túy:**
   - *File liên quan:* [`src/components/Diagnostic/Part1Illustrations.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Diagnostic/Part1Illustrations.tsx), [`src/components/Diagnostic/listeningIllustrationsMap.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Diagnostic/listeningIllustrationsMap.ts)
   - *Lý do:* Đảm bảo độ sắc nét tuyệt đối trên mọi độ phân giải màn hình, dung lượng nhẹ (vài KB), tải ngay tức thì, không dùng ảnh placeholder.
5. **Tách biệt Question Bank tĩnh khỏi LocalStorage người dùng:**
   - *File liên quan:* [`src/data/questionBank/`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/questionBank/)
   - *Lý do:* Ngăn chặn vượt hạn mức 5MB của LocalStorage, bảo toàn tính toàn vẹn của dữ liệu học tập người dùng.

---

## C. CẤU TRÚC THƯ MỤC & DANH SÁCH FILE

### 1. Sơ đồ cây thư mục thực tế

```
toeic-mastery-hub/
├── .gitignore                      # Danh sách tệp loại trừ trong Git
├── .oxlintrc.json                  # Cấu hình kiểm tra cú pháp Oxlint
├── index.html                      # Tệp HTML entrypoint, nạp font & meta
├── package.json                    # Cấu hình dependency và scripts npm
├── package-lock.json               # Khóa chính xác phiên bản dependencies
├── tsconfig.json                   # Solution TypeScript configuration
├── tsconfig.app.json               # Cấu hình TS cho ứng dụng React
├── tsconfig.node.json              # Cấu hình TS cho Vite config
├── vite.config.ts                  # Cấu hình Vite 8 & Tailwind CSS v4
├── docs/
│   └── FILE_INDEX.md               # Danh mục chi tiết 100% file mã nguồn
├── public/
│   ├── favicon.svg                 # Biểu tượng tab trình duyệt
│   └── icons.svg                   # Bộ vector icons public
└── src/
    ├── App.css                     # Phong cách bổ trợ App
    ├── App.tsx                     # Component gốc điều hướng layout & modal
    ├── index.css                   # Tailwind CSS v4, hiệu ứng 3D & custom scrollbar
    ├── main.tsx                    # Entrypoint React 19 StrictMode
    ├── assets/
    │   ├── hero.png                # Ảnh minh họa bìa
    │   ├── react.svg               # Biểu tượng React
    │   └── vite.svg                # Biểu tượng Vite
    ├── components/
    │   ├── Navbar.tsx              # Thanh điều hướng trên cùng & quick stats
    │   ├── CheatSheet/
    │   │   └── GrammarAndTraps.tsx # Sổ tay ngữ pháp & bẫy đề thi
    │   ├── Dashboard/
    │   │   ├── CommandCenter.tsx   # Trung tâm chỉ huy, mục tiêu, heatmap & biểu đồ
    │   │   ├── Dashboard.tsx       # Re-export alias cho CommandCenter
    │   │   └── RadarChart.tsx      # Biểu đồ radar Recharts thể hiện 7 Part
    │   ├── Diagnostic/
    │   │   ├── Part1Illustrations.tsx       # 10 Đồ họa vector SVG Part 1 & 2 Graphics Part 3/4
    │   │   ├── listeningIllustrationsMap.ts # Registry map ánh xạ illustrationId -> SVG Component
    │   │   └── ToeicAudioPlayer.tsx         # Trình phát âm thanh bài nghe Web Speech API
    │   ├── Modals/
    │   │   ├── BackupModal.tsx     # Modal sao lưu, phục hồi & nạp seed data
    │   │   └── ProfileModal.tsx    # Modal tùy chỉnh mục tiêu & ngày thi
    │   ├── Onboarding/
    │   │   └── OnboardingModal.tsx # Luồng chào đón & test chẩn đoán đầu vào
    │   ├── Practice/
    │   │   ├── PracticeConfigHub.tsx        # Màn hình cấu hình Practice Hub, preset & validation
    │   │   └── index.ts                     # Re-export barrel cho Practice components
    │   ├── Roadmap/
    │   │   └── RoadmapView.tsx     # Lộ trình 3 giai đoạn & lịch học tập tuần
    │   ├── TestLog/
    │   │   └── TestLogView.tsx     # Nhật ký thi thử ETS & Sổ tay lỗi sai
    │   ├── Timer/
    │   │   └── TimerHub.tsx        # Đồng hồ thi ETS 120p & Pomodoro 25p
    │   └── Vocabulary/
    │       └── VocabVault.tsx      # Kho từ vựng Flashcard SRS 3D & nhập CSV
    ├── context/
    │   └── AppContext.tsx          # Toàn bộ trạng thái ứng dụng & LocalStorage
    ├── data/
    │   ├── diagnosticQuestions.ts  # Ngân hàng 14 câu hỏi chẩn đoán nhanh
    │   ├── seedData.ts             # Dữ liệu khởi tạo mặc định (Cold Start)
    │   └── questionBank/           # Ngân hàng câu hỏi tự biên soạn Parts 1–7 (121 câu)
    │       ├── part1Listening.ts   # 10 câu Part 1 kèm tranh SVG và audio scripts
    │       ├── part2Listening.ts   # 25 câu Part 2 đúng 3 options A-C & traps
    │       ├── part3Listening.ts   # 5 groups (15 câu) Part 3 hội thoại đa nhân vật
    │       ├── part4Listening.ts   # 5 groups (15 câu) Part 4 bài nói đa chủ đề
    │       ├── listeningBank.ts    # Manifest tổng hợp 65 câu & 10 groups Listening
    │       ├── part5Reading.ts     # 20 câu Part 5 Incomplete Sentences ngữ pháp/từ vựng
    │       ├── part6Reading.ts     # 4 groups (16 câu) Part 6 Text Completion
    │       ├── part7Reading.ts     # 5 groups (20 câu) Part 7 Single, Double, Triple passages
    │       ├── readingBank.ts      # Manifest tổng hợp 56 câu & 9 groups Reading
    │       └── index.ts            # Entrypoint hợp nhất toàn bộ 121 câu & 19 groups
    ├── hooks/
    │   └── usePracticeSession.ts   # Custom hook quản lý vòng đời session, timer & F5 sync
    ├── types/
    │   ├── index.ts                # Định nghĩa toàn bộ TypeScript Interfaces/Types
    │   ├── questionBank.ts         # Domain models Question Bank: Discriminated unions Parts 1-7
    │   └── practiceSession.ts      # Models cho Practice Session: Modes, states, tracking & storage
    └── utils/
        ├── audio.ts                # Dịch vụ âm thanh tổng hợp Web Audio API
        ├── scoreConverter.ts       # Động cơ quy đổi điểm số ETS chuẩn xác
        ├── questionBankValidator.ts # Engine kiểm định Question Bank độc lập, tái sử dụng
        ├── questionSelector.ts     # Pure Selection Engine: Group integrity, subset-sum & anti-repeat
        ├── practiceSessionEngine.ts # Pure Session Engine: Lifecycle, timing, answer lock & double submit
        ├── practiceSessionStorage.ts # LocalStorage adapter: Overwrite protection, timeout & quota
        └── __tests__/
            ├── questionBankValidator.test.ts # Targeted test suite kiểm định 50 test cases Question Bank
            ├── questionSelector.test.ts      # Targeted test suite kiểm định 81 test cases Selection Engine
            └── practiceSessionEngine.test.ts # Targeted test suite kiểm định 83 test cases Session Engine
```

### 2. Bảng trách nhiệm các file cốt lõi

*(Chi tiết đầy đủ toàn bộ file có tại [`docs/FILE_INDEX.md`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/docs/FILE_INDEX.md))*

| Đường dẫn file | Trách nhiệm chính / Nội dung | Chức năng liên quan |
|---|---|---|
| [`src/App.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/App.tsx) | Điều hướng tab, hiển thị layout chính và kích hoạt modal toàn cục | Toàn bộ ứng dụng |
| [`src/context/AppContext.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/context/AppContext.tsx) | Quản lý state toàn cục, LocalStorage persistence, streak, goals, test logs | Toàn bộ các module |
| [`src/types/index.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/types/index.ts) | Định nghĩa TypeScript Interfaces: Profile, Goal, Task, Vocab, TestLog, Trap, re-export questionBank | Type checking toàn dự án |
| [`src/types/questionBank.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/types/questionBank.ts) | Định nghĩa TypeScript Models cho Question Bank: Discriminated unions Part 1-7, Group, Media, Practice Session | Nền tảng ngân hàng đề |
| [`src/utils/questionBankValidator.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/questionBankValidator.ts) | Engine kiểm định tính hợp lệ của câu hỏi, nhóm câu hỏi và toàn bộ bank đề | Kiểm định Question Bank |
| [`src/utils/__tests__/questionBankValidator.test.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/__tests__/questionBankValidator.test.ts) | Bộ 50 targeted unit tests kiểm định schema, cardinality, liên kết cross-entity, Listening Bank, Reading Bank và toàn bộ 7 Parts | Kiểm thử ngân hàng đề |
| [`src/data/questionBank/part1Listening.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/questionBank/part1Listening.ts) | 10 câu hỏi Part 1 Photographs kèm đồ họa SVG, kịch bản audio A-D, transcript và lời giải chi tiết | Ngân hàng Listening Part 1 |
| [`src/data/questionBank/part2Listening.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/questionBank/part2Listening.ts) | 25 câu hỏi Part 2 Question-Response bao phủ các dạng câu hỏi & bẫy âm, đúng 3 lựa chọn A-C | Ngân hàng Listening Part 2 |
| [`src/data/questionBank/part3Listening.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/questionBank/part3Listening.ts) | 5 nhóm hội thoại Part 3 (15 câu) với transcript phân vai, tình huống doanh nghiệp, câu hỏi Flight Schedule | Ngân hàng Listening Part 3 |
| [`src/data/questionBank/part4Listening.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/questionBank/part4Listening.ts) | 5 nhóm bài nói Part 4 (15 câu) với bài nói đa dạng, câu hỏi sơ đồ Store Floor Directory | Ngân hàng Listening Part 4 |
| [`src/data/questionBank/listeningBank.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/questionBank/listeningBank.ts) | Manifest tổng hợp 65 câu hỏi & 10 nhóm Listening Bank, thống kê difficulty/topic và partitions | Ngân hàng đề Listening |
| [`src/data/questionBank/part5Reading.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/questionBank/part5Reading.ts) | 20 câu hỏi Part 5 Incomplete Sentences: blank rõ ràng, 4 đáp án A-D, phân loại ngữ pháp/từ vựng và giải thích cặn kẽ distractors | Ngân hàng Reading Part 5 |
| [`src/data/questionBank/part6Reading.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/questionBank/part6Reading.ts) | 4 nhóm Part 6 Text Completion (16 câu): đoạn văn chuẩn công sở, 4 vị trí blank, hỗ trợ điền từ và chèn nguyên câu | Ngân hàng Reading Part 6 |
| [`src/data/questionBank/part7Reading.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/questionBank/part7Reading.ts) | 5 nhóm Part 7 Reading Comprehension (20 câu): Single (3 grps, 10 Qs), Double (1 grp, 5 Qs), Triple (1 grp, 5 Qs) với evidence trích dẫn | Ngân hàng Reading Part 7 |
| [`src/data/questionBank/readingBank.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/questionBank/readingBank.ts) | Manifest tổng hợp 56 câu hỏi & 9 nhóm Reading Bank, phân vùng Part 5-7 và thống kê chi tiết | Ngân hàng đề Reading |
| [`src/data/questionBank/index.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/questionBank/index.ts) | Entrypoint hợp nhất toàn bộ Question Bank 7 Parts (121 câu, 19 groups): re-export, manifest hợp nhất `FULL_QUESTION_BANK_MANIFEST` và `FULL_BANK_STATS` | Entrypoint toàn bộ Question Bank |
| [`src/components/Diagnostic/listeningIllustrationsMap.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Diagnostic/listeningIllustrationsMap.ts) | Bảng đăng ký ánh xạ illustrationId -> SVG components (10 ảnh tranh Part 1 + 2 graphics bảng biểu) | Quản lý tài nguyên SVG |
| [`src/components/Diagnostic/Part1Illustrations.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Diagnostic/Part1Illustrations.tsx) | Bộ 10 đồ họa vector SVG minh họa Part 1 và 2 SVG graphic table/directory cho Part 3 & 4 | Đồ họa bài nghe |
| [`src/utils/scoreConverter.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/scoreConverter.ts) | Quy đổi điểm Raw sang Scaled ETS (5-495), phân loại Level Band | Onboarding, TestLog, Dashboard |
| [`src/utils/audio.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/audio.ts) | Khởi tạo sóng âm thanh tổng hợp bằng Web Audio API | TimerHub, AppContext, VocabVault |
| [`src/components/Dashboard/CommandCenter.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Dashboard/CommandCenter.tsx) | Hiển thị tiến độ, điểm thiếu, biểu đồ Radar/Bar 7 Parts, Heatmap 84 ngày | Dashboard tổng quan |
| [`src/components/Roadmap/RoadmapView.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Roadmap/RoadmapView.tsx) | Lộ trình chia 3 Phase, chuyển đổi trạng thái Todo/In Progress/Done, lịch học | Lộ trình & Lịch học |
| [`src/components/Vocabulary/VocabVault.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Vocabulary/VocabVault.tsx) | Lật thẻ flashcard 3D, tính chu kỳ lặp lại Spaced Repetition (0-5), nhập file CSV | Quản lý & Ôn từ vựng |
| [`src/components/TestLog/TestLogView.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/TestLog/TestLogView.tsx) | Nhật ký làm đề thi ETS, biểu đồ tăng trưởng điểm số, Sổ tay phân loại lỗi sai | Luyện thi & Sửa bài |
| [`src/components/CheatSheet/GrammarAndTraps.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/CheatSheet/GrammarAndTraps.tsx) | Tra cứu bẫy thi phân theo Part và tần suất, công thức ngữ pháp cốt lõi | Chiến thuật phòng thi |
| [`src/components/Timer/TimerHub.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Timer/TimerHub.tsx) | Đồng hồ bấm giờ thi thử ETS 120 phút và Pomodoro học tập ngắt quãng | Luyện tập & Quản lý giờ |
| [`src/components/Onboarding/OnboardingModal.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Onboarding/OnboardingModal.tsx) | Khởi tạo mục tiêu và đánh giá chẩn đoán đầu vào qua bài test 14 câu | Onboarding người dùng |
| [`src/components/Practice/PracticeConfigHub.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Practice/PracticeConfigHub.tsx) | Màn hình thiết lập bài luyện tập: chọn Part, difficulty, số câu, tính thời gian ETS, snap feasible counts | Practice Hub Configuration |
| [`src/components/Practice/index.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Practice/index.ts) | Barrel export cho các component, hooks, và type của phân hệ Practice | Practice Hub Module |
| [`src/types/practiceSession.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/types/practiceSession.ts) | Domain types cho Practice Session: Modes, ActiveSessionStatus, assistance records, storage operation contracts | Practice Session Types |
| [`src/utils/practiceSessionEngine.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/practiceSessionEngine.ts) | Pure Session Engine: vòng đời phiên, cập nhật câu trả lời, khóa sau khi nộp, đếm giờ wall-clock, auto-submit và kiểm định | Thuật toán Session Engine |
| [`src/utils/practiceSessionStorage.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/practiceSessionStorage.ts) | Storage Adapter: lưu trữ LocalStorage offline, bảo vệ chống ghi đè, bẫy lỗi quota, phục hồi F5 và tự động timeout | Lưu trữ phiên làm bài |
| [`src/hooks/usePracticeSession.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/hooks/usePracticeSession.ts) | Custom hook quản lý trạng thái phiên làm bài React: đồng hồ đếm ngược wall-clock, tự nộp khi hết giờ, đồng bộ chuyển tab | React State Management |
| [`src/utils/__tests__/practiceSessionEngine.test.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/__tests__/practiceSessionEngine.test.ts) | Bộ 83 unit tests kiểm định toàn diện Session Engine, Wall-Clock Deadlines, Background Tab, Auto-Submit Idempotency, Persistence và Quota Handling | Kiểm thử Session Engine |
| [`src/utils/questionSelector.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/questionSelector.ts) | Pure Selection Engine: chọn đề theo Part/độ khó, DP subset-sum solver cho Part 7, group integrity và anti-repeat | Thuật toán chọn đề thi |
| [`src/utils/__tests__/questionSelector.test.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/__tests__/questionSelector.test.ts) | Bộ 81 unit tests kiểm định toàn diện selection engine: group integrity, recency, exhaustion, seeded RNG, feasible counts | Kiểm thử thuật toán chọn đề |
| [`src/components/Modals/BackupModal.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Modals/BackupModal.tsx) | Xuất file JSON, nhập khôi phục dữ liệu hoặc hoàn nguyên dữ liệu mẫu | Bảo toàn dữ liệu học viên |


---

## D. DANH SÁCH CHỨC NĂNG CHI TIẾT (FEATURE CATALOG)

### Module 1: Onboarding & Diagnostic Engine (Khởi Tạo & Chẩn Đoán Đầu Vào)
- **Mục đích:** Xác định năng lực ban đầu của người học để thiết lập thang đo tiến độ chính xác.
- **Cách hoạt động:**
  - Tự động hiển thị khi `hasCompletedOnboarding === false` hoặc khi người dùng bấm "Đánh Giá Đầu Vào" trên Dashboard.
  - Cung cấp 2 lựa chọn:
    1. *Nhập điểm trực tiếp:* Nhập điểm thi thực tế gần nhất (Listening & Reading).
    2. *Làm Mini Diagnostic Test:* Trải nghiệm bài kiểm tra 14 câu phân hóa (2 câu cho mỗi Part từ Part 1 đến Part 7).
  - Sử dụng SVG vector cho tranh Part 1, Web Speech API đọc kịch bản Part 1-4, tự động phát hiện lỗi sai và tạo bản ghi Test Log đầu tiên kèm pháo hoa chúc mừng.
- **File thực hiện:** [`src/components/Onboarding/OnboardingModal.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Onboarding/OnboardingModal.tsx), [`src/data/diagnosticQuestions.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/diagnosticQuestions.ts), [`src/components/Diagnostic/ToeicAudioPlayer.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Diagnostic/ToeicAudioPlayer.tsx), [`src/components/Diagnostic/Part1Illustrations.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Diagnostic/Part1Illustrations.tsx).
- **Trạng thái:** **Hoàn thiện 100%**.

### Module 2: Command Center & Analytics (Trung Tâm Chỉ Huy)
- **Mục đích:** Đem lại cái nhìn trực quan, tập trung về tiến độ luyện thi, khoảng cách mục tiêu và thói quen học tập.
- **Cách hoạt động:**
  - Tính toán số ngày còn lại đến ngày thi (`examDate`).
  - Phân loại trình độ hiện tại thành các Level Band: Foundation (<550), Intermediate (550-695), Upper-Intermediate (700-795), Advanced (800-895), Mastery (900-990).
  - Trực quan hóa tỷ lệ thành thạo từng phần (Part 1 -> Part 7) qua Recharts Radar Chart hoặc Bar Chart.
  - Heatmap 12 tuần (84 ngày) mô phỏng đóng góp theo phong cách GitHub, tự động đổi màu theo số lượng hoạt động.
  - Danh sách Daily Goals theo cơ chế sự kiện (click vào từng mục để chuyển ngay đến màn hình tương ứng).
- **File thực hiện:** [`src/components/Dashboard/CommandCenter.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Dashboard/CommandCenter.tsx), [`src/components/Dashboard/RadarChart.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Dashboard/RadarChart.tsx).
- **Trạng thái:** **Hoàn thiện 100%**.

### Module 3: Roadmap & Calendar (Lộ Trình & Lịch Học)
- **Mục đích:** Chia nhỏ mục tiêu điểm số thành các giai đoạn rõ ràng và quản lý nhiệm vụ học tập theo tuần.
- **Cách hoạt động:**
  - 3 Giai đoạn cốt lõi:
    - *Giai đoạn 1:* Xây nền từ vựng & ngữ pháp cốt lõi (0 ➔ 600+)
    - *Giai đoạn 2:* Luyện kỹ năng & chiến thuật từng Part (600 ➔ 750+)
    - *Giai đoạn 3:* Luyện đề tổng hợp & canh thời gian (750 ➔ 850+)
  - Nhấp chuột 1 chạm để luân chuyển trạng thái nhiệm vụ: `Chưa làm` ➔ `Đang thực hiện` ➔ `Đã hoàn thành`.
  - Hỗ trợ thêm mới nhiệm vụ vào từng giai đoạn, ước tính số giờ học.
  - Tab con Lịch học cho phép lên lịch các buổi giải đề, ôn tập theo ngày kèm checkbox hoàn thành.
- **File thực hiện:** [`src/components/Roadmap/RoadmapView.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Roadmap/RoadmapView.tsx).
- **Trạng thái:** **Hoàn thiện 100%**.

### Module 4: Spaced Repetition Vocabulary Vault (Kho Từ Vựng SRS)
- **Mục đích:** Ghi nhớ lâu dài từ vựng thương mại và các cụm từ dễ dính bẫy trong đề thi.
- **Cách hoạt động:**
  - Thuật toán Leitner SRS với 6 cấp độ (Stage 0 đến 5):
    - Đánh giá *Khó (Hard)*: Đưa về Stage 0, chu kỳ ôn lại là 1 ngày sau.
    - Đánh giá *Vừa (Medium)*: Tăng 1 Stage, chu kỳ giãn cách: 1, 3, 7, 14, 30, 60 ngày.
    - Đánh giá *Dễ (Easy)*: Nhảy cóc 2 Stage, chu kỳ giãn cách: 3, 7, 14, 28, 45, 90 ngày.
  - Chế độ Flashcard lật 3D (phím bấm hoặc click) hiển thị Từ, Phiên âm IPA, Nghĩa tiếng Việt, Câu ví dụ ngữ cảnh, Part tag và Lưu ý bẫy đề.
  - Phát âm chuẩn bản xứ sử dụng Web Speech API.
  - Chế độ xem danh sách (Vault Table) kèm bộ lọc theo chủ đề (Office, Business, Contract, Travel, HR...) và tìm kiếm từ khóa.
  - Hỗ trợ thêm từ mới thủ công và tính năng Nhập Hàng Loạt (Bulk Import) qua định dạng văn bản ngăn cách bởi tab hoặc dấu phẩy.
- **File thực hiện:** [`src/components/Vocabulary/VocabVault.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Vocabulary/VocabVault.tsx).
- **Trạng thái:** **Hoàn thiện 100%**.

### Module 5: Cheat Sheet & Trap Handbook (Sổ Tay Bẫy Đề & Ngữ Pháp)
- **Mục đích:** Nhận diện và hóa giải các bẫy phổ biến của đề thi ETS.
- **Cách hoạt động:**
  - Tổng hợp các bẫy thi phân loại theo tần suất: *Critical (Bẫy cực kỳ phổ biến >80%)*, *High (Tần suất cao)*, *Medium (Bẫy nâng cao)*.
  - Mỗi bẫy gồm: Mô tả chi tiết, Chiến thuật khắc chế (Counter-strategy), Câu hỏi ví dụ và Giải thích cặn kẽ.
  - Nút "Sao chép công thức" 1 chạm vào Clipboard.
  - Nút "Đã hiểu bẫy" giúp đánh dấu đã ôn tập, phát âm thanh tick và tích lũy điểm Daily Goal.
  - Tab Ngữ pháp tổng hợp các công thức then chốt: 12 thì trọng điểm, Thể bị động, Mệnh đề quan hệ rút gọn, Câu điều kiện...
- **File thực hiện:** [`src/components/CheatSheet/GrammarAndTraps.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/CheatSheet/GrammarAndTraps.tsx).
- **Trạng thái:** **Hoàn thiện 100%**.

### Module 6: Test Log & Mistake Notebook (Nhật Ký Thi & Sổ Tay Lỗi Sai)
- **Mục đích:** Ghi nhận kết quả thi thử ETS và mổ xẻ nguyên nhân mắc lỗi để không lặp lại sai lầm.
- **Cách hoạt động:**
  - Form ghi nhận bài test: Tự động chuyển đổi số câu đúng (0-100 raw) của Listening và Reading sang điểm chuẩn ETS (5-495) theo thời gian thực trước khi lưu.
  - Biểu đồ đường Recharts thể hiện trực quan xu hướng tăng điểm Total, Listening, Reading qua từng bài test so với mốc mục tiêu.
  - **Sổ tay lỗi sai (Mistake Book):**
    - Cho phép gắn lỗi sai vào từng bài thi.
    - Phân loại lỗi theo 6 nguyên nhân chuẩn: `trap` (Dính bẫy đề), `vocab` (Thiếu từ vựng), `time` (Hết thời gian), `listening_connected` (Nối âm/nuốt âm), `grammar` (Hổng ngữ pháp), `careless` (Bất cẩn/Tô nhầm).
    - Lưu lại câu sai, đáp án của bạn, đáp án đúng và "Bài học xương máu".
    - Bộ lọc lỗi sai theo Part và theo nguyên nhân để ôn tập tập trung.
- **File thực hiện:** [`src/components/TestLog/TestLogView.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/TestLog/TestLogView.tsx), [`src/utils/scoreConverter.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/scoreConverter.ts).
- **Trạng thái:** **Hoàn thiện 100%**.

### Module 7: Focus & Exam Timer Hub (Trung Tâm Đồng Hồ Bấm Giờ)
- **Mục đích:** Rèn luyện áp lực tâm lý phòng thi và kỹ luật tập trung cao độ.
- **Cách hoạt động:**
  - **Chế độ 1 — Đồng hồ thi thử ETS 120 phút:**
    - Đếm ngược chính xác 7200 giây.
    - Chuông cảnh báo tự động khi hết 45 phút đầu (kết thúc phần Listening, chuyển sang Reading).
    - Chuông cảnh báo đặc biệt khi còn 15 phút cuối (giai đoạn vàng kiểm tra phiếu tô đáp án).
    - Chuông kết thúc + Pháo hoa + Tự động tích lũy điểm học tập.
  - **Chế độ 2 — Đồng hồ Pomodoro 25 phút:**
    - Vòng lặp: 25 phút học tập ➔ 5 phút nghỉ ngắn ➔ 15 phút nghỉ dài (sau 4 vòng).
    - Tự động kích hoạt hoàn thành Daily Goal khi xong phiên Pomodoro.
  - Tùy chọn bật/tắt âm thanh cảnh báo.
- **File thực hiện:** [`src/components/Timer/TimerHub.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Timer/TimerHub.tsx), [`src/utils/audio.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/audio.ts).
- **Trạng thái:** **Hoàn thiện 100%**.

### Module 8: Data Backup & Restore Engine (Sao Lưu & Phục Hồi Dữ Liệu)
- **Mục đích:** Bảo vệ toàn vẹn dữ liệu người dùng, cho phép di chuyển giữa các trình duyệt/thiết bị.
- **Cách hoạt động:**
  - Xuất dữ liệu: Tạo file `toeic_mastery_backup_YYYY-MM-DD.json` tải về máy.
  - Nhập dữ liệu: Đọc file JSON qua `FileReader`, kiểm tra hợp lệ cấu trúc (`profile`, `vocabulary`, `roadmapPhases`), nạp đè vào state và lưu LocalStorage.
  - Khôi phục mẫu (Reset to Seed): Nạp lại bộ dữ liệu chuẩn ban đầu.
- **File thực hiện:** [`src/components/Modals/BackupModal.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Modals/BackupModal.tsx).
- **Trạng thái:** **Hoàn thiện 100%**.

### Module 9: Question Bank Foundation & Full 7-Part Question Bank (Parts 1–7)
- **Mục đích:** Thiết lập nền móng dữ liệu câu hỏi, cơ chế kiểm định độc lập và ngân hàng đề tự biên soạn chất lượng cao cho toàn bộ 7 Parts TOEIC (121 câu hỏi, 19 groups) với đầy đủ kịch bản âm thanh, ảnh minh họa SVG nguyên gốc, văn bản thực tế, đoạn đơn/kép/ba và evidence trích dẫn.
- **Cách hoạt động:**
  - **Hệ thống Discriminated Unions:** Định nghĩa chuẩn cho từng dạng câu hỏi (Part 1-7), phân biệt rạch ròi câu hỏi đơn lẻ (Part 1, 2, 5) và câu hỏi nhóm (Part 3, 4, 6, 7).
  - **Quy tắc đặc thù TOEIC chuẩn ETS:**
    - Part 1 (10 câu): Ảnh minh họa SVG chất lượng cao (không dùng placeholder), 4 phương án A-D, kịch bản audio chính xác, giải thích chi tiết.
    - Part 2 (25 câu): Nghiêm ngặt đúng 3 phương án A-C (tuyệt đối không có D), bao phủ đầy đủ các dạng Wh-, Yes/No, Negative, Tag, Or, Evasive, Suggestions, Requests, Statements và phân tích bẫy nghe TOEIC.
    - Part 3 (5 groups × 3 câu = 15 câu): Hội thoại tự nhiên đa nhân vật, transcript phân vai, tình huống công việc doanh nghiệp, hỗ trợ câu hỏi graphic bảng lịch bay (Flight Schedule).
    - Part 4 (5 groups × 3 câu = 15 câu): Bài nói ngắn đa dạng (thông báo, voicemail, phát thanh siêu thị, hướng dẫn, bản tin), hỗ trợ câu hỏi graphic sơ đồ tầng (Store Directory).
    - Part 5 (20 câu): Vị trí blank `_____` rõ ràng, 4 lựa chọn A-D, phân loại ngữ pháp/từ vựng (từ loại, thì động từ, mệnh đề quan hệ, liên từ/giới từ, collocation) và lý do loại trừ distractors chi tiết.
    - Part 6 (4 groups × 4 câu = 16 câu): Đoạn văn công việc có 4 vị trí blank `[131]`..`[146]`, hỗ trợ câu hỏi từ loại và câu hỏi chèn cả câu hoàn chỉnh, giữ nguyên ngữ cảnh 4 câu / group.
    - Part 7 (5 groups, 20 câu): Đa dạng định dạng gồm Single Passages (3 groups / 10 câu), Double Passage (1 group / 5 câu), và Triple Passage (1 group / 5 câu), tài liệu thực tế (email, quảng cáo, quy định, hóa đơn, lịch trình, memo), câu hỏi cross-text synthesis và trích dẫn evidence chính xác.
  - **Tách biệt dữ liệu:** Question Bank tĩnh được phân vùng độc lập (`src/data/questionBank/`), tách biệt hoàn toàn với `AppData` và LocalStorage của người dùng. LocalStorage chỉ lưu session/tiến độ luyện tập.
  - **Validation Engine:** Cung cấp `validateQuestion`, `validateQuestionGroup`, `validateQuestionBank` kiểm định 100% các câu hỏi, nhóm câu hỏi, ràng buộc cardinality, media và liên kết 2 chiều.
- **File thực hiện:** [`src/types/questionBank.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/types/questionBank.ts), [`src/utils/questionBankValidator.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/questionBankValidator.ts), [`src/data/questionBank/part1Listening.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/questionBank/part1Listening.ts), [`src/data/questionBank/part2Listening.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/questionBank/part2Listening.ts), [`src/data/questionBank/part3Listening.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/questionBank/part3Listening.ts), [`src/data/questionBank/part4Listening.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/questionBank/part4Listening.ts), [`src/data/questionBank/listeningBank.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/questionBank/listeningBank.ts), [`src/data/questionBank/part5Reading.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/questionBank/part5Reading.ts), [`src/data/questionBank/part6Reading.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/questionBank/part6Reading.ts), [`src/data/questionBank/part7Reading.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/questionBank/part7Reading.ts), [`src/data/questionBank/readingBank.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/questionBank/readingBank.ts), [`src/data/questionBank/index.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/questionBank/index.ts), [`src/utils/__tests__/questionBankValidator.test.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/__tests__/questionBankValidator.test.ts), [`src/utils/__tests__/listeningContentPart1Part2.test.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/__tests__/listeningContentPart1Part2.test.ts).
- **Trạng thái:** **Hoàn thiện 100% (Toàn bộ 7 Parts: 121 câu hỏi, 19 groups, 50/50 validator tests passed, 359/359 Part 1-2 contract tests passed)**.

### Module 10: Question Selection Engine & Practice Hub Configuration (Thuật Toán Chọn Đề & Cấu Hình Luyện Tập)
- **Mục đích:** Xây dựng pure selection engine lựa chọn câu hỏi theo Part (1-7), độ khó (Easy, Medium, Hard, Mixed), số lượng yêu cầu, bảo toàn nghiêm ngặt Group Integrity và thuật toán chống trùng lặp thông minh; đi kèm giao diện Practice Hub Configuration độc lập, responsive và hỗ trợ Dark/Light mode.
- **Cách hoạt động:**
  - **Group Integrity & Feasibility Solver:**
    - Part 1, 2, 5 (câu đơn): Lựa chọn linh hoạt mọi số lượng $\le$ tổng câu khả dụng.
    - Part 3, 4 (nhóm 3 câu): Bắt buộc số lượng là bội số của 3 ($3 \times g$). Nếu người dùng yêu cầu số không chia hết cho 3, engine trả về `impossible_count` kèm danh sách feasible counts (`[3, 6, 9, 12, 15]`) và gợi ý rõ ràng.
    - Part 6 (nhóm 4 câu): Bắt buộc số lượng là bội số của 4 ($4 \times g$), các số không chia hết cho 4 trả về feasible counts (`[4, 8, 12, 16]`).
    - Part 7 (nhóm biến thiên 3, 4, 5 câu): Sử dụng thuật toán quy hoạch động (Dynamic Programming subset-sum) và backtracking để tìm tập hợp group đạt chính xác tổng số câu yêu cầu mà không được cắt xén đoạn văn.
  - **Anti-Repeat Priority & Recency Algorithm:**
    - Ưu tiên 1: Câu/group chưa từng luyện (`practiceCount === 0`).
    - Ưu tiên 2: Câu/group đã làm từ lâu (`lastPracticedAt` cũ nhất).
    - Tự động tái sử dụng khi ngân hàng cạn kiệt (`isBankExhausted = true`, `reusedCount > 0`).
    - Tuyệt đối không lặp lại câu hỏi/group trong cùng một phiên.
    - Hỗ trợ RNG seed có thể kiểm soát (`seededRng`) cho unit test tất định.
  - **Practice Hub Configuration Screen (`PracticeConfigHub.tsx`):**
    - Thiết kế thẻ trực quan chọn Part 1–7 kèm chỉ báo Audio/Reading và số câu khả dụng.
    - 4 mức độ khó (Easy, Medium, Hard, Mixed) cập nhật động số lượng câu theo thời gian thực.
    - Preset câu hỏi nhanh, ô nhập tùy chỉnh kèm cảnh báo lỗi và nút bấm "tự sửa" (Snap to Feasible Count).
    - Lựa chọn Practice Mode (luyện tự do, gợi ý) hoặc Timed Practice (bấm giờ theo chuẩn tốc độ ETS: Part 1/2 ~30s, Part 3/4 ~40s, Part 5 ~30s, Part 6 ~45s, Part 7 ~60s/câu).
    - Tùy chọn âm thanh, xem trước phân tích chống lặp và nút bấm bắt đầu với validation chặt chẽ.
- **File thực hiện:** [`src/utils/questionSelector.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/questionSelector.ts), [`src/utils/__tests__/questionSelector.test.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/__tests__/questionSelector.test.ts), [`src/components/Practice/PracticeConfigHub.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Practice/PracticeConfigHub.tsx), [`src/components/Practice/index.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Practice/index.ts).
- **Trạng thái:** **Hoàn thiện 100% (81/81 unit test cases passed, tổng hợp 131/131 tests passed)**.

### Module 11: Practice Session Engine, Persistence & Timed Practice (Quản Lý Vòng Đời Phiên Luyện Tập & Phòng Thi Bấm Giờ)
- **Mục đích:** Xây dựng state machine hoàn chỉnh quản lý toàn bộ vòng đời phiên luyện tập: Configuration → Selection → Active Session → Submitted/Completed (hoặc Abandoned); bảo toàn dữ liệu nhập, khóa sửa đáp án sau khi nộp, theo dõi trợ giúp (Practice Mode), đếm giờ wall-clock chính xác không drift khi chạy nền/F5, auto-timeout đúng 1 lần (Timed Practice), và cơ chế lưu trữ LocalStorage offline-first với bảo vệ chống ghi đè, bẫy lỗi quota, phục hồi phiên hợp lệ.
- **Cách hoạt động:**
  - **State Machine & Answer Locking:**
    - Khởi tạo phiên luyện tập duy nhất `sessionId` từ kết quả chọn đề Phase 4; mảng `questionIds` và `groupIds` cố định.
    - Cập nhật đáp án `setSessionAnswer` và cờ xem lại `toggleSessionMark` an toàn; tuyệt đối không mất đáp án khi chuyển câu/group.
    - Khóa đáp án nghiêm ngặt: Mọi hành động sửa đáp án sau khi submit đều bị từ chối.
  - **Theo dõi Trợ Giúp (Practice Mode Assistance Tracking):**
    - Ghi nhận `recordAssistance` khi người dùng xem đáp án, script hoặc giải thích trước khi submit.
    - Phân biệt rõ ràng phiên làm bài tự lực (unassisted) và có trợ giúp (assisted) phục vụ chấm điểm và phân tích năng lực trong Phase 9.
  - **Timed Practice & Real Wall-Clock Deadlines:**
    - Sử dụng mốc thời gian thực `deadline = startedAt + durationSeconds * 1000` để tính `remainingSeconds`, không phụ thuộc vào số lần đếm của `setInterval`.
    - Khi tab chạy ngầm hoặc F5, thời gian vẫn trôi đúng quy chuẩn; không có pause tùy ý; F5 không reset timer.
    - Tự động nộp bài đúng 1 lần (`status: 'expired'`, `submitReason: 'auto_timeout'`).
    - Bảo vệ chống nộp trùng lặp (Double-submit protection / Idempotency): Thao tác nộp thủ công đồng thời với auto-timeout chỉ chuyển trạng thái 1 lần duy nhất.
  - **Persistence, Quota & Resume Safeguards:**
    - Tách biệt lưu trữ qua khóa chuyên dụng `toeic_practice_active_session_v1` (Active Session) và `toeic_practice_session_history_v1` (History). Tuyệt đối không sao chép Question Bank vào storage, không làm xáo trộn dữ liệu `toeic_mastery_data_v2_cold`.
    - Kiểm định toàn vẹn tham chiếu `validateSessionIntegrity` đối chiếu với `FULL_QUESTION_BANK_MANIFEST`: Loại bỏ phiên lỗi, câu hỏi cũ bị xóa hoặc schema JSON hỏng.
    - Tự động xử lý hết hạn khi resume: Nếu mở lại trình duyệt khi deadline đã trôi qua, phiên làm bài tự động chuyển sang `expired`, lưu vào lịch sử và dọn dẹp storage.
    - Chống ghi đè vô ý: Nếu đã có phiên active chưa hoàn thành, từ chối tạo phiên mới trừ khi có xác nhận rõ ràng (`forceReplace: true`, phiên cũ lưu thành `abandoned`).
    - Bẫy lỗi quota `QuotaExceededError` minh bạch, không báo lưu thành công giả.
- **File thực hiện:** [`src/types/practiceSession.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/types/practiceSession.ts), [`src/utils/practiceSessionEngine.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/practiceSessionEngine.ts), [`src/utils/practiceSessionStorage.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/practiceSessionStorage.ts), [`src/hooks/usePracticeSession.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/hooks/usePracticeSession.ts), [`src/utils/__tests__/practiceSessionEngine.test.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/__tests__/practiceSessionEngine.test.ts).
- **Trạng thái:** **Hoàn thiện 100% (83/83 session unit test cases passed, tổng hợp 214/214 tests passed)**.

### Module 12: Stable Listening Audio Engine (Bộ Điều Khiển Âm Thanh Listening Tái Sử Dụng & Quản Lý Vòng Đời)
- **Mục đích:** Xây dựng headless audio controller và giao diện phát âm thanh tái sử dụng phục vụ phần thi Listening Part 1–4; tích hợp Web Speech API (TTS) offline và HTMLAudioElement (audio file); quản lý vòng đời chặt chẽ, chống phát chồng âm thanh, chống memory leak, loại bỏ callback lỗi thời và kiểm soát quyền nghe lại theo chế độ Practice/Timed.
- **Cách hoạt động:**
  - **Global Playback Coordinator:** Đảm bảo toàn ứng dụng chỉ có duy nhất 1 nguồn audio phát tại một thời điểm (`audioPlaybackCoordinator.claim(this)`). Khi chuyển câu hỏi hoặc bấm phát audio mới, audio cũ lập tức dừng hẳn và giải phóng tài nguyên.
  - **Token Concurrency Guard (Khử Stale Callbacks):** Mỗi lượt phát sinh mã `activeToken`. Tất cả các callback bất đồng bộ (`onend`, `onerror`, `setTimeout`, event listeners) đều kiểm tra token. Mọi sự kiện từ phiên phát cũ đều bị hủy bỏ trong âm thầm, ngăn ngừa hoàn toàn race condition khi người dùng chuyển câu/bấm nút liên tục.
  - **Phân tích Kịch Bản & Phân Đoạn Tuần Tự (Audio Script Segmentation):**
    - Part 1: Phát 4 câu miêu tả tương ứng Statement A, B, C, D kèm chỉ báo phát sáng theo phương án.
    - Part 2: Phát câu hỏi prompt question trước, tiếp nối 3 lựa chọn Option A, B, C.
    - Part 3: Phân tích hội thoại đa nhân vật tự động (`Man: ... Woman: ...`), ghép giọng đọc nam/nữ tuần tự theo từng lượt lời.
    - Part 4: Phân đoạn bài nói ngắn thành các chunk câu tránh lỗi đứng hình 15s kinh điển của Web Speech API trên Chromium/Safari.
  - **Voice Discovery & Persistent Preferences:** Quản lý nạp voice bất đồng bộ (`onvoiceschanged`), thuật toán chọn giọng tiếng Anh theo accent (US, UK, AU, CA) và gender (male/female), lưu giọng ưu tiên trong LocalStorage.
  - **Chính sách Nghe Lại & Minh Bạch TTS:**
    - Chế độ Practice: Tự do nghe lại không giới hạn, hỗ trợ tạm dừng, tiếp tục và tua lại từ đầu.
    - Chế độ Timed: Nghiêm ngặt tuân thủ quy chế thi TOEIC thật — chỉ phát đúng 1 lần duy nhất (`maxReplays: 1`, khóa nút sau khi kết thúc).
    - Thông báo minh bạch: Banner màu hổ phách cảnh báo rõ ràng đây là âm thanh tổng hợp Web Speech API (TTS) mô phỏng, không gây hiểu lầm là bản thu gốc ETS.
- **File thực hiện:** [`src/types/listeningAudio.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/types/listeningAudio.ts), [`src/utils/audioScriptParser.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/audioScriptParser.ts), [`src/utils/voiceManager.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/voiceManager.ts), [`src/utils/listeningAudioController.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/listeningAudioController.ts), [`src/hooks/useListeningAudio.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/hooks/useListeningAudio.ts), [`src/components/Practice/ListeningAudioPlayer.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Practice/ListeningAudioPlayer.tsx), [`src/utils/__tests__/listeningAudio.test.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/__tests__/listeningAudio.test.ts).
- **Trạng thái:** **Hoàn thiện 100% (64/64 audio unit test cases passed)**.

### Module 13: Listening Practice Workspace (Không Gian Luyện Tập Nghe Part 1–4)
- **Mục đích:** Xây dựng giao diện luyện tập chuyên sâu cho toàn bộ 4 phần thi Listening (Part 1 Photographs, Part 2 Question-Response, Part 3 Conversations, Part 4 Short Talks), tích hợp chặt chẽ với Session Engine (Phase 5) và Audio Engine (Phase 6); đáp ứng đầy đủ trải nghiệm phòng thi chuẩn mực, bảo toàn trạng thái, điều khiển trợ giúp minh bạch và tối ưu khả năng truy cập (keyboard accessibility).
- **Cách hoạt động:**
  - **Workspace Chung & Điều Hướng:**
    - `WorkspaceHeader`: Thể hiện Part, Badge chế độ (Practice/Timed), độ khó, tỷ lệ hoàn thành, đồng hồ đếm ngược wall-clock có hiệu ứng nhịp đập cảnh báo $\le$ 60s, nút bật trợ giúp, nút cắm cờ xem lại (`Mark for Review`) và hành động Nộp bài / Thoát phiên.
    - `QuestionNavigatorDrawer`: Ma trận điều hướng câu hỏi trực quan. Với Part 3 và Part 4, tự động gom nhóm thành từng cụm 3 câu (`Group 1: Q1–Q3`), phản ánh chính xác trạng thái đã chọn đáp án, chưa làm và gắn cờ xem lại.
    - Điều hướng bàn phím toàn diện: Phím `A`, `B`, `C`, `D` chọn đáp án tức thì; `M` bật/tắt cắm cờ xem lại; `ArrowLeft` / `ArrowRight` chuyển câu trước/sau an toàn.
  - **Rendering Chuyên Biệt Từng Part:**
    - **Part 1 (Photographs):** Hiển thị tranh minh họa vector SVG chuẩn xác từ `LISTENING_ILLUSTRATIONS`. Phát audio đọc 4 câu miêu tả Statement A, B, C, D; 4 nút chọn đáp án (A, B, C, D) **ẩn chữ nội dung mặc định** khi đang kiểm tra kỹ năng nghe thực tế. Chỉ hiển thị script khi học viên chủ động mở trợ giúp trong chế độ Practice.
    - **Part 2 (Question-Response):** Phát audio câu hỏi kèm 3 lựa chọn; giao diện **nghiêm ngặt chỉ render 3 nút chọn A, B, C** (tuyệt đối không ép thành 4 phương án); ẩn hoàn toàn script câu hỏi và phương án khi chưa bật trợ giúp.
    - **Part 3 (Short Conversations):** Một audio kịch bản duy nhất dùng chung cho cả nhóm 3 câu hỏi; hỗ trợ hiển thị bảng biểu đồ họa đính kèm (như `Flight Schedule Graphic`). **Chuyển đổi giữa các câu hỏi trong cùng một nhóm giữ nguyên luồng phát âm thanh liên tục không ngắt quãng hay reset.** Chỉ cập nhật audio khi chuyển sang nhóm hội thoại khác.
    - **Part 4 (Short Talks):** Một bài nói audio duy nhất dùng chung cho nhóm 3 câu hỏi; hỗ trợ đồ họa sơ đồ tầng trung tâm thương mại (`Store Directory Graphic`). Bảo toàn ngữ cảnh bài nói và lựa chọn của học viên xuyên suốt nhóm.
  - **Chế Độ Luyện Tập & Phòng Thi Bấm Giờ:**
    - *Practice Mode:* Cho phép bật/tắt trợ giúp xem transcript/lời giải. Thao tác xem trợ giúp được ghi nhận vào Session Engine (`recordHelp(qid, 'script')`) để phân định unassisted vs assisted khi chấm điểm ở Phase 9. Tự do nghe lại audio không giới hạn.
    - *Timed Practice:* Tuyệt đối không hiển thị transcript hoặc lời giải trước khi nộp bài. Audio tuân thủ nghiêm ngặt quy chế thi (chỉ phát 1 lần duy nhất). Hết giờ tự động khóa toàn bộ bài làm và kích hoạt submit transition (`auto_timeout`).
  - **Bảo Toàn Trạng Thái & Khóa Sau Submit:**
    - Toàn bộ lựa chọn đáp án được bảo toàn nguyên vẹn khi chuyển câu, chuyển group hoặc ẩn hiện drawer.
    - Hộp thoại `SubmitConfirmationModal` thống kê minh bạch số câu đã làm, chưa làm và gắn cờ, kèm cảnh báo nổi bật khi còn câu bỏ trống.
    - Sau khi nộp bài hoặc hết giờ, thanh thông báo trạng thái khóa hiển thị và mọi thao tác sửa đáp án đều bị chặn tuyệt đối.
  - **Quản Lý Vòng Đời Âm Thanh (Audio Lifecycle Teardown):** Tự động dừng phát và giải phóng tài nguyên Web Speech / HTMLAudio khi nộp bài, chuyển group hoặc thoát phiên làm việc.
- **File thực hiện:** [`src/utils/questionBankLookup.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/questionBankLookup.ts), [`src/components/Practice/Listening/WorkspaceHeader.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Practice/Listening/WorkspaceHeader.tsx), [`src/components/Practice/Listening/QuestionNavigatorDrawer.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Practice/Listening/QuestionNavigatorDrawer.tsx), [`src/components/Practice/Listening/SubmitConfirmationModal.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Practice/Listening/SubmitConfirmationModal.tsx), [`src/components/Practice/Listening/Part1PhotographView.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Practice/Listening/Part1PhotographView.tsx), [`src/components/Practice/Listening/Part2QuestionResponseView.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Practice/Listening/Part2QuestionResponseView.tsx), [`src/components/Practice/Listening/Part3ConversationView.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Practice/Listening/Part3ConversationView.tsx), [`src/components/Practice/Listening/Part4TalkView.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Practice/Listening/Part4TalkView.tsx), [`src/components/Practice/Listening/ListeningWorkspace.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Practice/Listening/ListeningWorkspace.tsx), [`src/components/Practice/Listening/index.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Practice/Listening/index.ts), [`src/utils/__tests__/listeningWorkspace.test.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/__tests__/listeningWorkspace.test.ts).
- **Trạng thái:** **Hoàn thiện 100% (53/53 contract test cases passed, tổng hợp 331/331 tests toàn dự án)**.

### Module 14: Reading Practice Workspace (Không Gian Luyện Tập Đọc Hiểu Part 5–7)
- **Mục đích:** Xây dựng giao diện luyện tập chuyên sâu cho toàn bộ 3 phần thi Reading (Part 5 Incomplete Sentences, Part 6 Text Completion, Part 7 Reading Comprehension Single/Double/Triple Passages), tích hợp chặt chẽ với Session Engine (Phase 5); tuân thủ nghiêm ngặt tính toàn vẹn nhóm (Group Integrity), cơ chế interactive blank mapping, phân định định dạng văn bản trực quan, độc lập thanh cuộn không làm mất ngữ cảnh đọc, và kiểm soát hiển thị giải thích theo chế độ Practice/Timed.
- **Cách hoạt động:**
  - **Part 5 — Incomplete Sentences (`Part5IncompleteSentencesView.tsx`):**
    - Hiển thị câu hỏi có vị trí blank `_____` rõ ràng, tự động xem trước ký hiệu đáp án đã chọn ngay trong vị trí trống (ví dụ: `([C])`) giúp học viên đọc liền mạch cả câu hoàn chỉnh.
    - 4 lựa chọn A–D rõ ràng, chuyển đổi đáp án tức thì, hiển thị huy hiệu phân loại ngữ pháp/từ loại (`grammarCategory`, `targetTopic`).
    - Hỗ trợ drawer xem trước giải thích & phân tích bẫy trong chế độ Practice; ẩn hoàn toàn trong Timed Practice.
  - **Part 6 — Text Completion (`Part6TextCompletionView.tsx`):**
    - Trình bày đoạn văn công sở hoàn chỉnh (email, memo, notice, warranty) trong bố cục chia đôi (Split Layout: 7 cột đoạn văn | 5 cột câu hỏi trên Desktop, tabs linh hoạt trên Mobile).
    - Thể hiện chính xác 4 vị trí blank interactive `[131]`, `[132]`, `[133]`, `[134]`. Bấm vào blank trên văn bản tự động chuyển câu hỏi tương ứng; blank của câu đang chọn phát sáng viền xanh kèm huy hiệu đáp án đã chọn.
    - Hỗ trợ cả câu hỏi điền từ/cụm từ và câu hỏi chèn câu hoàn chỉnh (`sentence_insertion`).
    - Thanh cuộn đoạn văn độc lập, chuyển đổi giữa 4 câu hỏi trong nhóm không làm mất ngữ cảnh đọc hay vị trí cuộn văn bản. Tuyệt đối không tách rời 4 câu khỏi group.
  - **Part 7 — Reading Comprehension (`Part7ReadingComprehensionView.tsx`):**
    - Hỗ trợ đầy đủ Single, Double và Triple passages với giao diện nhận diện định dạng chuẩn mực (email, memo, lịch trình, bảng biểu, hóa đơn/biểu mẫu, tin nhắn chat, thông báo).
    - Đối với văn bản kép và ba (Double/Triple): cung cấp thanh tab nhảy nhanh đến từng văn bản con kết hợp hiển thị thẻ xếp chồng trực quan để đối chiếu thông tin chéo (Cross-text reference).
    - Tự động nhận diện và gắn huy hiệu câu hỏi tổng hợp đa văn bản (`Đa văn bản`) đối với các câu có `crossTextReference === true` kèm huy hiệu loại câu hỏi (`main_idea`, `detail`, `inference`, `cross_text_synthesis`).
    - Điều hướng giữa các câu hỏi trong group giữ nguyên hoàn toàn ngữ cảnh đoạn văn và vị trí đọc; không reset scroll ngoài ý muốn.
    - Giữ quan hệ passages–questions–group IDs chuẩn xác; bảo toàn evidence trích dẫn để sẵn sàng cho Review Mode (Phase 9), không tiết lộ trước trong khi làm bài.
  - **Workspace Chung & Điều Phối (`ReadingWorkspace.tsx`):**
    - Tái sử dụng `WorkspaceHeader`, `QuestionNavigatorDrawer`, `SubmitConfirmationModal` và `usePracticeSession`.
    - Điều hướng bàn phím toàn diện: `A`, `B`, `C`, `D` chọn phương án, `M` gắn cờ xem lại, `ArrowLeft` / `ArrowRight` chuyển câu.
    - Đồng hồ đếm ngược thời gian thực (wall-clock countdown) ở Timed Practice, tự động nộp bài khi hết giờ (`auto_timeout`), bảo vệ khóa bài sau khi nộp (Answer Locking).
- **File thực hiện:** [`src/components/Practice/Reading/Part5IncompleteSentencesView.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Practice/Reading/Part5IncompleteSentencesView.tsx), [`src/components/Practice/Reading/Part6TextCompletionView.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Practice/Reading/Part6TextCompletionView.tsx), [`src/components/Practice/Reading/Part7ReadingComprehensionView.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Practice/Reading/Part7ReadingComprehensionView.tsx), [`src/components/Practice/Reading/ReadingWorkspace.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Practice/Reading/ReadingWorkspace.tsx), [`src/components/Practice/Reading/index.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Practice/Reading/index.ts), [`src/utils/__tests__/readingWorkspace.test.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/__tests__/readingWorkspace.test.ts).
- **Trạng thái:** **Hoàn thiện 100% (69/69 contract test cases passed, tổng hợp 400/400 tests toàn dự án)**.

### Module 15: ExamForm Assembly, Media Readiness & Registry (Phase 9)
- **Mục đích:** Lắp ráp đề thi chuẩn ETS 200 câu từ Question Bank, xây dựng registry quản lý đa mã đề kèm cơ chế bảo vệ phiên bản nội dung (content revision guard), và thiết lập bộ kiểm định tài nguyên truyền thông (Media Readiness Engine) với phân loại 4 bậc trạng thái và tính toán mốc thời gian Listening 45 phút.
- **Cách hoạt động:**
  - **Lắp Ráp Đề Thi Chuẩn ETS 200 Câu (`CANONICAL_ETS_EXAM_FORM_01`):**
    - Đề thi mã `ETS-2026-SIM-01` (ID `ets-mock-form-01`), schema version `1.0.0`, content revision `1`.
    - Lắp ráp chính xác 200 câu hỏi tuần tự từ 1 đến 200: Listening 100 câu (Part 1: 6, Part 2: 25, Part 3: 39 / 13 groups, Part 4: 30 / 10 groups); Reading 100 câu (Part 5: 30, Part 6: 16 / 4 groups, Part 7: 54 / 15 groups: 29 Single / 10 groups + 25 Multiple / 5 groups).
    - Đúng 42 groups toàn vẹn, 100% câu hỏi và nhóm duy nhất (không nhân bản, không cắt group, không placeholder).
    - Tính toán fingerprint nội dung tất định (`calculateContentFingerprint`).
  - **Kiểm Định Tài Nguyên Listening & Mốc Thời Gian ETS 45 Phút (`mediaReadiness.ts`):**
    - Part 1: Kiểm tra 6 ảnh minh họa SVG trong `LISTENING_ILLUSTRATIONS` và kịch bản đọc 4 lựa chọn A–D.
    - Part 2: Kiểm tra 25 kịch bản audio A–C nghiêm ngặt 3 phương án.
    - Part 3 & 4: Kiểm tra 23 nhóm hội thoại và bài nói, 100% audio scripts, transcripts, và 2 context graphics (`FlightScheduleGraphic` & `StoreDirectoryGraphic`).
    - Ước lượng thời lượng phát âm thanh theo chuẩn ETS (~150 WPM) và các khoảng nghỉ theo bài thi thực tế (pause câu hỏi Part 1/2: 1.5–5.0s; pause Part 3/4: 8s/câu = 24s/group; chỉ dẫn directions: 50s/part). Tổng thời lượng ước tính đạt ~2,337s (~39.0 phút), bám sát mốc 45 phút (2,700s) của ETS.
    - Nguyên tắc trung thực tuyệt đối: Kho lưu trữ hiện tại không chứa file âm thanh phòng thu (0/54 tệp). Không tạo file rỗng, silent filler hay tự nhận đạt Strict Mock. Khóa nghiêm ngặt chế độ Strict Mock (`strictLocked: true`) với lý do giải trình minh bạch.
  - **Hệ Thống Phân Loại 4 Bậc Trạng Thái (4-Tier Readiness Classification):**
    - `'invalid'`: Sai cấu trúc (<200 câu) hoặc khiếm khuyết liên kết thực thể.
    - `'content-ready'`: Đủ câu hỏi và đáp án nhưng media chưa đạt tiêu chuẩn.
    - `'simulation-ready'`: 100% câu hỏi, kịch bản âm thanh, ảnh minh họa SVG sẵn sàng cho chế độ thi thử mô phỏng (Simulation Mode qua Web Speech API).
    - `'strict-ready'`: 100% tệp âm thanh phòng thu và timeline đã qua kiểm chứng (hiện bị khóa minh bạch).
  - **Registry Quản Lý Đề Thi & Compiler Động (`examFormRegistry.ts`):**
    - Đăng ký và tra cứu đề thi theo ID và test code.
    - Bộ lọc đề thi khả dụng theo bậc tối thiểu `getAvailableExamForms({ minStatus, strictOnly })`.
    - Bảo vệ hạ cấp phiên bản nội dung (ngăn ghi đè hoặc hạ cấp revision khi session tham chiếu).
    - Compiler động `compileStandardExamForm` cho phép tự động biên dịch đề thi 200 câu mới tuân thủ 100% blueprint ETS.
- **File thực hiện:** [`src/types/mockExam.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/types/mockExam.ts), [`src/utils/mediaReadiness.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/mediaReadiness.ts), [`src/data/examForms/etsMockForm01.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/examForms/etsMockForm01.ts), [`src/utils/examFormRegistry.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/examFormRegistry.ts), [`src/data/examForms/index.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/data/examForms/index.ts), [`src/utils/__tests__/examFormReadiness.test.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/__tests__/examFormReadiness.test.ts).
- **Trạng thái:** **Hoàn thiện 100% (46/46 targeted test cases passed, tổng hợp 2,969/2,969 tests toàn dự án)**.

### Module 16: Exam Session State Machine & Persistence (Phase 10)
- **Mục đích:** Xây dựng state machine thuần túy (pure state machine engine) và bộ điều hợp lưu trữ LocalStorage ngoại tuyến (Offline-First persistence adapter) cho phiên thi thử chuẩn ETS 200 câu; quản lý toàn bộ vòng đời phiên làm bài tách biệt khỏi React components; thực thi nghiêm ngặt các quy tắc biên giới phòng thi (Strict vs Simulation mode), bảo vệ chống double-start, khóa đáp án sau khi nộp, ngăn chặn stale callbacks, và khôi phục phiên an toàn sau khi reload/F5.
- **Cách hoạt động:**
  - **State Machine 9 Trạng Thái (9-State Lifecycle):**
    - `preflight`: Khởi tạo phiên, kiểm định cấu trúc đề thi, tính bất biến của fingerprint nội dung và tính sẵn sàng của tài nguyên media.
    - `ready`: Đạt kiểm định preflight, sẵn sàng bắt đầu bài thi.
    - `listening`: Kích hoạt phần thi Nghe (Câu 1–100), mốc thời gian 45 phút, điều phối phát âm thanh mô phỏng.
    - `reading`: Kích hoạt phần thi Đọc (Câu 101–200), mốc thời gian 75 phút, dừng âm thanh; ở Strict Mode, phần thi Nghe bị niêm phong vĩnh viễn.
    - `submitted`: Nộp bài hoàn tất, khóa vĩnh viễn toàn bộ đáp án và cờ xem lại.
    - Nhánh phục hồi & ngoại lệ: `interrupted` (tạm dừng khi mất tiêu điểm/reload), `recovery-required` (phát hiện lệch content revision hoặc sửa đổi đề thi), `invalid` (khiếm khuyết cấu trúc), `media-failed` (tài nguyên âm thanh lỗi hoặc chế độ Strict bị khóa do thiếu audio phòng thu).
  - **Quy Tắc Chuyển Trạng Thái Nghiêm Ngặt (Strict Transition Rules):**
    - *Chống double-start:* Từ chối bắt đầu lại phiên đang ở trạng thái `listening`, `reading` hoặc `submitted`.
    - *Chuyển Listening → Reading một chiều:* Chỉ chuyển khi đang ở `listening`; từ chối chuyển 2 lần.
    - *Biên giới phần thi Strict Mode:* Trong chế độ Strict, thí sinh đang ở phần Reading không được điều hướng quay lại Listening (`STRICT_NAVIGATION_BLOCKED`), không được sửa đáp án Listening (`STRICT_SECTION_LOCKED`), và không được gắn cờ câu hỏi Listening.
    - *Khóa đáp án sau Submit & Chống Stale Callbacks:* Mọi thao tác ghi đáp án (`recordExamAnswer`), đổi cờ (`toggleQuestionFlag`) hoặc cập nhật checkpoint audio sau khi nộp bài đều bị từ chối với mã lỗi xác định.
    - *Kiểm soát điều kiện bắt đầu đề thi (Readiness Guard):* Bắt buộc vượt qua preflight; từ chối chạy chế độ Strict nếu đề thi bị khóa (`strictLocked: true`).
    - *Chống ghi đè vô ý:* Từ chối thay thế phiên dở dang trừ khi có xác nhận rõ ràng (`forceReplace: true`).
    - *An toàn React StrictMode:* Cho phép gọi reload lặp lại cùng `sessionId` một cách tất định (idempotent).
  - **Lưu Trữ Ngoại Tuyến Độc Lập (Offline-First Storage Adapter):**
    - *Khóa lưu trữ chuyên biệt:* `toeic_exam_active_session_v1` (Active Session) và `toeic_exam_session_history_v1` (Lịch sử phiên). Tuyệt đối không can thiệp hay ghi đè `toeic_mastery_data_v2_cold` và các khóa Practice cũ.
    - *Lưu trữ tinh gọn (Zero-Copy):* Chỉ lưu ID, map 200 đáp án, cờ, checkpoint và mốc thời gian; không nhân bản văn bản câu hỏi hay audio blob.
    - *Bẫy lỗi Quota & Báo cáo trung thực:* Phát hiện `QuotaExceededError`, không báo thành công giả khi storage ghi thất bại.
    - *Khôi phục F5 & Tính hạn giờ Wall-Clock:* Khi tải lại trang, tự động đối chiếu đề thi và revision; nếu thời gian làm bài đã trôi qua trong lúc đóng trình duyệt, hệ thống tự động hoàn tất bài thi (`timeout_reading` hoặc `timeout_overall`), lưu vào lịch sử và giải phóng active storage.
- **File thực hiện:** [`src/types/mockExam.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/types/mockExam.ts), [`src/utils/examSessionEngine.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/examSessionEngine.ts), [`src/utils/examSessionStorage.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/examSessionStorage.ts), [`src/utils/__tests__/examSessionEngine.test.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/__tests__/examSessionEngine.test.ts).
- **Trạng thái:** **Hoàn thiện 100% (145/145 unit assertions passed, tổng hợp 3,114/3,114 tests toàn dự án)**.

### Module 17: Exam Timer Engine, Section Transition & Multi-Tab Safety (Phase 11)
- **Mục đích:** Xây dựng động cơ đồng hồ bấm giờ phòng thi chuẩn ETS (Exam Timer Engine), cơ chế chuyển phần thi (Section Transition) một chiều tất định, kiểm soát hạn giờ wall-clock bất biến trước reload/F5/tab background throttling, cơ chế khóa tương tranh đa tab (Multi-Tab Safety Lease) và phát hiện bất thường đồng hồ hệ thống (Clock Tampering Detection).
- **Cách hoạt động:**
  - **Đồng Hồ Phòng Thi Bất Biến (Wall-Clock Timer Engine):**
    - Nghiêm ngặt theo chuẩn ETS: Listening 45 phút (2,700s), Reading 75 phút (4,500s), tổng bài thi 120 phút (7,200s).
    - Không sử dụng `setInterval(seconds--)` làm chân lý thời gian. Mọi tính toán dựa trên khoảng cách giữa các mốc deadline bền vững (`listeningDeadline`, `readingDeadline`, `overallDeadline`) và `Date.now()`.
    - Khi thí sinh F5 tải lại trang, chuyển tab nền (tab sleep/throttling) hoặc máy tính sleep/wake, thời gian còn lại được tính lại chính xác tức thì (`calculateTimerSnapshot`), deadline tuyệt đối không bị kéo dài hoặc reset.
    - Không tạo nhiều timer đồng thời: React hook `useExamTimer` duy trì duy nhất một interval nhịp 1s, tự động đồng bộ lại khi `visibilitychange` và `window.focus`.
    - Chế độ Strict Mock không cho phép tạm dừng tùy ý; không dùng thời gian phần Đọc để làm tiếp phần Nghe.
  - **Điều Phối Chuyển Phần & Khóa Idempotency:**
    - Khi Listening hết hạn (44:59 -> 45:00): Tự động chuyển một chiều sang Reading (`currentQuestionNumber = 101`), tính toán hạn giờ Reading riêng biệt 75 phút (`readingDeadline`), và gọi callback hook `onListeningEnded` để Audio Engine ngắt ngay lập tức mọi luồng phát âm thanh/TTS.
    - Khi Reading hết hạn (74:59 -> 75:00): Tự động nộp bài qua lifecycle transition (`timeout_reading`).
    - Bảo vệ tổng thể 120 phút: Nếu phiên thi bị gián đoạn hoặc trôi quá tổng thời gian (`timeout_overall`), hệ thống tự động hoàn tất bài thi.
    - Chống xung đột tương tranh (Idempotency Guard): `executeSafeExamSubmit` và `executeSafeSectionTransition` bảo đảm chỉ có đúng 1 lệnh chuyển trạng thái thành công, kể cả khi thao tác thủ công (Manual Click) trùng khớp từng millisecond với auto-timeout.
    - Không truy cập lại Listening sau khi đã chuyển sang Reading trong Strict Mode.
  - **Bảo Vệ Đa Tab Độc Quyền (Multi-Tab Mutual Exclusion Lease):**
    - Áp dụng mô hình Single-Writer Lease với khóa LocalStorage `toeic_exam_active_lease_v1` kết hợp kênh truyền tin tức thì `BroadcastChannel('toeic_exam_session_bus')` (có in-memory fallback cho môi trường test).
    - Tại một thời điểm, chỉ duy nhất 1 tab sở hữu quyền ghi (`status: 'active'`).
    - Các tab mở thêm cùng `sessionId` lập tức bị chuyển sang trạng thái chỉ đọc (`status: 'read_only_conflict'`) kèm cảnh báo xung đột và định danh tab đang chiếm giữ.
    - Cơ chế nhịp tim (Heartbeat 1,500ms) và thời gian sống (TTL 5,000ms): Nếu tab chính bị crash hoặc đóng đột ngột, tab khác có thể tự động tiếp quản sau khi lease hết hạn.
    - Cơ chế chiếm quyền chủ động (Takeover): Thí sinh có thể nhấn "Tiếp quản phiên làm bài" trên tab phụ; hệ thống cấp lease mới, phát thông điệp `TAKEOVER` và giáng cấp tab cũ về `read_only_conflict`.
    - Chặn ghi đè từ tab cũ (Stale Tab Write Protection): Lớp lưu trữ `saveActiveExamSession` từ chối mọi thao tác ghi từ tab không còn giữ lease hợp lệ (`code: 'TAB_CONFLICT'`).
  - **Phát Hiện Bất Thường Đồng Hồ Hệ Thống (Clock Integrity):**
    - Kiểm tra tính đơn điệu tăng dần của thời gian: Nếu phát hiện lùi giờ hệ thống (`now < lastKnownTimestamp - 5s`), đánh dấu cờ nghi vấn `isClockTampered: true`, ghi nhận độ lệch `clockDriftSeconds` và lý do `tamperReason`.
    - Phát hiện bước nhảy thời gian bất thường về tương lai (> 24 giờ).
    - Phản ánh trung thực giới hạn Offline-First: Đánh dấu phiên thi đáng ngờ để phục vụ hậu kiểm thay vì ảo tưởng chống gian lận tuyệt đối trên môi trường máy khách.
- **File thực hiện:** [`src/types/mockExam.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/types/mockExam.ts), [`src/utils/examTimer.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/examTimer.ts), [`src/utils/examTabCoordinator.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/examTabCoordinator.ts), [`src/utils/examSessionStorage.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/examSessionStorage.ts), [`src/hooks/useExamTimer.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/hooks/useExamTimer.ts), [`src/utils/__tests__/examTimerAndMultiTab.test.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/__tests__/examTimerAndMultiTab.test.ts).
- **Trạng thái:** **Hoàn thiện 100% (84/84 fake-clock test assertions passed, tổng hợp 3,198/3,198 tests toàn dự án)**.

### Module 18: Strict Listening Audio Engine (Phase 12)
- **Mục đích:** Xây dựng động cơ âm thanh Listening chuẩn phòng thi và mô phỏng học tập độc lập khỏi UI (`StrictListeningAudioEngine`); quản lý phát tuần tự tuyến tính 58 đơn vị âm thanh; thực thi nghiêm ngặt các kỷ luật phòng thi (khóa tốc độ 1.0x, cấm tua seek, cấm replay, cấm pause tùy ý trong Strict Mode); cô lập hoàn toàn luồng phát khỏi thao tác di chuyển trên answer sheet; đồng bộ ngắt tức thì khi hết 45 phút Listening; bảo vệ token guard loại bỏ 100% stale callbacks; xử lý hạn chế autoplay của trình duyệt và khôi phục an toàn sau F5 (gắn cờ `timelineAbnormal: true`).
- **Cách hoạt động:**
  - **Hàng Đợi Tuyến Tính 58 Đơn Vị Âm Thanh (`compileListeningAudioQueue`):**
    - Biên dịch chuẩn xác: Part 1 Directions + 6 câu Part 1 + Part 2 Directions + 25 câu Part 2 + Part 3 Directions + 13 nhóm Part 3 + Part 4 Directions + 10 nhóm Part 4 = 58 queue items.
    - Tích hợp nội dung directions chính thức của ETS và khoảng nghỉ tiêu chuẩn (Part 1: 5s, Part 2: 5s, Part 3/4: 24s/nhóm).
  - **Kỷ Luật Phòng Thi Strict Mode:**
    - Khóa cứng tốc độ 1.0x (`SPEED_CHANGE_FORBIDDEN`), cấm tua (`SEEK_FORBIDDEN_IN_STRICT`), cấm nghe lại (`REPLAY_FORBIDDEN_IN_STRICT`), cấm pause (`PAUSE_FORBIDDEN_IN_STRICT`).
    - Tuyệt đối không để lộ transcript, kịch bản phân vai hay answer key trong runtime phát âm thanh.
    - Cô lập Answer Sheet: Thí sinh tự do lướt xem các câu hỏi trên phiếu trả lời mà không làm nhảy hay gián đoạn audio; quay lại câu cũ không kích hoạt phát lại audio cũ.
    - Section Timer Sync: Ngắt tức thì mọi luồng phát âm thanh khi hết hạn 45 phút Listening.
  - **Simulation Mode Fallback & Dán Nhãn Minh Bạch:**
    - Đề thi chưa có tệp âm thanh phòng thu được phát bằng Web Speech API native qua kịch bản phân vai.
    - Dán nhãn minh bạch (`isSimulation: true`, `isStrictCertified: false`), tuyệt đối không tự mở khóa Strict Mode bằng fallback TTS (`STRICT_MODE_LOCKED`).
  - **Bảo Vệ Vòng Đời & Checkpoint:**
    - Token guard thế hệ (`activeToken++`) loại bỏ hoàn toàn stale callbacks từ TTS và Audio Element.
    - Autoplay guard phát hiện `NotAllowedError`, chuyển trạng thái `waiting_gesture` và hỗ trợ mở khóa bằng thao tác người dùng.
    - Đánh giá khôi phục sau reload/F5: Gắn cờ đứt quãng bất thường (`timelineAbnormal: true`) trong Strict Mode kèm lý do minh bạch; cho phép tiếp tục học tập trong Simulation Mode.
- **File thực hiện:** [`src/types/examAudio.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/types/examAudio.ts), [`src/utils/strictListeningEngine.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/strictListeningEngine.ts), [`src/hooks/useStrictListeningAudio.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/hooks/useStrictListeningAudio.ts), [`src/utils/__tests__/strictListeningAudio.test.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/__tests__/strictListeningAudio.test.ts).
- **Trạng thái:** **Hoàn thiện 100% (66/66 assertions passed, tổng hợp 3,264/3,264 tests toàn dự án)**.

### Module 19: Exam Library Hub, Instructions & Preflight Check (Phase 13)
- **Mục đích:** Xây dựng toàn bộ các màn hình và logic kiểm tra tiền phòng thi (Pre-Exam Phase) cho kỳ thi thử ETS 120 phút / 200 câu, tách biệt hoàn toàn khỏi Practice Mode: Thư viện đề thi Full Mock Hub hiển thị dữ liệu thực tế từ registry, Hộp thoại phổ biến quy chế thi chuẩn ETS 4 phần chuyên sâu, Động cơ kiểm tra kỹ thuật trực tiếp trước giờ thi (Preflight Check 7 hạng mục), thử nghiệm âm thanh (Sound Check) mở khóa autoplay và khóa bảo vệ không cho phép bắt đầu phiên thi trước khi vượt qua kiểm tra kỹ thuật.
- **Cách hoạt động:**
  - **Full Mock Hub (`ExamLibraryHub.tsx`):**
    - Hiển thị danh mục các đề thi hợp lệ được đăng ký trong hệ thống (`ets-mock-form-01`), số câu chuẩn 200, thời lượng 120 phút (Listening 45m / Reading 75m).
    - Huy hiệu trạng thái rõ ràng: `Simulation-Ready` (sẵn sàng thi mô phỏng), `Strict-Ready` (khóa minh bạch kèm lý do), `Incomplete`.
    - Bộ lọc trạng thái: Tất cả, Sẵn sàng mô phỏng, Chỉ chế độ nghiêm ngặt (Strict).
    - Nhận diện phiên thi dở dang từ LocalStorage: Hiển thị banner cảnh báo phiên chưa hoàn thành, nút Tiếp tục (Resume) hoặc Hủy bỏ (Discard) an toàn.
    - Xem lịch sử thi thật từ storage: Thống kê số câu đã làm, thời gian làm bài, chế độ thi (tuyệt đối không tạo dữ liệu mẫu).
  - **Quy Chế Phòng Thi Chuẩn ETS (`ExamInstructionsModal.tsx`):**
    - Cấu trúc tổng thể: Listening 100 câu / 45 phút, Reading 100 câu / 75 phút, tổng 120 phút.
    - Chi tiết 7 Parts: Mục tiêu, dạng bài, số lượng câu của từng Part từ Part 1 đến Part 7.
    - Kỷ luật âm thanh Strict: Phát tuần tự một chiều, không tua, không nghe lại, không pause tùy ý, khóa tốc độ 1.0x.
    - Hướng dẫn phiếu trả lời (Answer Sheet): Đánh dấu cờ xem lại (Flag), ma trận điều hướng 200 câu.
    - Chính sách tự lưu & giới hạn offline: Lưu trữ LocalStorage cục bộ, khôi phục khi reload/F5, tự động nộp bài khi hết giờ và so sánh minh bạch giữa Strict Mock vs Simulation Mode.
  - **Kiểm Tra Kỹ Thuật Trực Tiếp (`ExamPreflightModal.tsx` & `examPreflightChecker.ts`):**
    - Kiểm tra 7 hạng mục kỹ thuật cốt lõi:
      1. Cấu trúc & Số lượng câu hỏi (Form Integrity 200 câu).
      2. Mức độ sẵn sàng tài nguyên Media & Khóa Strict Mode.
      3. Khả năng hỗ trợ của trình duyệt (Audio Context & Web Speech API).
      4. Quyền truy cập lưu trữ LocalStorage (Read/Write test).
      5. Đánh giá xung đột phiên thi dở dang (Unfinished Session Check).
      6. Kiểm tra quyền sở hữu tab thi độc quyền (Multi-Tab Lease Check).
      7. Tương tác âm thanh & Mở khóa Autoplay (Audio Gesture Check).
    - Interactive Sound Check: Người dùng bấm "Thử Âm Thanh" để nghe tiếng chuông 880Hz hoặc câu đọc mẫu, qua đó vừa xác nhận tai nghe hoạt động vừa thỏa mãn chính sách User Gesture mở khóa autoplay của trình duyệt.
    - Chế độ Strict bị khóa cứng trên đề thi canonical (`ets-mock-form-01` có `strictLocked: true`) kèm giải thích minh bạch; người dùng được hướng dẫn chọn Simulation Mode để làm bài.
    - Khóa an toàn: Nút "Bắt đầu làm bài" bị vô hiệu hóa cho đến khi toàn bộ các kiểm tra trọng yếu (critical checks) đạt chuẩn và không còn blockers. Không kích hoạt phiên thi hoặc deadline trước khi người dùng bấm Start.
- **File thực hiện:** [`src/types/examLibrary.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/types/examLibrary.ts), [`src/utils/examPreflightChecker.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/examPreflightChecker.ts), [`src/components/Exam/ExamInstructionsModal.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/ExamInstructionsModal.tsx), [`src/components/Exam/ExamPreflightModal.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/ExamPreflightModal.tsx), [`src/components/Exam/ExamLibraryHub.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/ExamLibraryHub.tsx), [`src/components/Exam/index.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/index.ts), [`src/utils/__tests__/examPreflightAndLibrary.test.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/__tests__/examPreflightAndLibrary.test.ts).
- **Trạng thái:** **Hoàn thiện 100% (40/40 assertions passed, tổng hợp 3,304/3,304 tests toàn dự án)**.

### Module 20: Exam Listening Workspace & 200-Question Unified Answer Sheet (Phase 14)
- **Mục đích:** Xây dựng giao diện phòng thi chuẩn mực Full Mock Exam Workspace cho phần thi Nghe (Listening Part 1–4) và Phiếu trả lời tổng hợp 200 câu (Unified Answer Sheet). Tách rời hoàn toàn layout tái sử dụng, question renderers chuyên biệt, thanh điều khiển audio, modal nộp bài và answer sheet drawer. Tái sử dụng 100% pure engine services từ các phase trước (`useExamTimer`, `useStrictListeningAudio`, `examSessionEngine`, `examSessionStorage`). Không triển khai Reading renderer (Part 5–7) hoặc Results Dashboard (dành cho Phase 15 & 16).
- **Cách hoạt động:**
  - **Bố Cục Phòng Thi Tách Rời (Exam Workspace Shell):**
    - `ExamWorkspaceHeader.tsx`: Hiển thị mã đề (`ETS-2026-SIM-01`), Part hiện tại, đồng hồ section timer đếm ngược wall-clock, overall timer, badges trạng thái, cảnh báo xung đột đa tab kèm nút Tiếp quản (Takeover), tiến độ câu hỏi đã làm/cờ, toggle Answer Sheet và nút Nộp bài (Submit) có kiểm soát.
    - `ExamAudioBar.tsx`: Thanh điều khiển audio hiển thị track hiện tại, audio status, huy hiệu khóa tốc độ 1.0x trong Strict mode, Simulation pause/resume, thanh âm lượng/mute và nút mở khóa autoplay gesture.
    - `ExamWorkspace.tsx`: Component điều phối trung tâm kết nối timer engine, strict listening audio engine, session storage và điều hướng bàn phím (`A`, `B`, `C`, `D` chọn đáp án, `M` gắn cờ, mũi tên chuyển câu).
  - **Phiếu Trả Lời 200 Câu (Unified Answer Sheet - `ExamAnswerSheet.tsx`):**
    - Ma trận 200 ô câu hỏi (1–200) phân vùng rạch ròi theo Listening (1–100) và Reading (101–200) qua 2 tabs trực quan, hiển thị đủ 7 Parts.
    - Trạng thái trực quan 5 mức: `current` (đang xem), `answered` (đã chọn A/B/C/D), `unanswered` (chưa chọn), `flagged` (gắn cờ xem lại), `locked` (bị khóa theo quy chế).
    - Tối ưu hóa hiệu năng re-render: `AnswerSheetCell` được bao bọc bởi `React.memo`, bảo đảm khi chọn đáp án chỉ re-render duy nhất ô tương ứng, không gây lag giật trên ma trận 200 ô.
    - Bộ lọc nhanh 3 chế độ: Tất cả (`all`), Chưa làm (`unanswered`), Cờ xem lại (`flagged`).
    - Thực thi kỷ luật biên giới Strict Navigation:
      - Khi đang ở Listening: Toàn bộ câu hỏi Reading (101–200) bị khóa.
      - Khi đã vào Reading: Toàn bộ câu hỏi Listening (1–100) bị niêm phong vĩnh viễn (Strict mode).
      - Trong quá trình phát audio Strict: Thí sinh chỉ được điều hướng và quản lý đáp án trong phạm vi nhóm câu hỏi của audio track đang phát; các câu ngoài phạm vi bị khóa kèm thông báo giải thích lý do rõ ràng, ngăn chặn việc tua/bỏ qua group hoặc nhảy section ngầm.
  - **Question Renderers Listening Part 1–4:**
    - Part 1 (`ExamPart1Renderer.tsx`): Tranh minh họa SVG nguyên gốc từ `LISTENING_ILLUSTRATIONS`, ẩn transcript câu mô tả (chuẩn ETS), 4 lựa chọn A–D.
    - Part 2 (`ExamPart2Renderer.tsx`): Đúng 3 phương án A, B, C (hoàn toàn không có phương án D), ẩn prompt/transcript spoken text.
    - Part 3 (`ExamPart3Renderer.tsx`): Nhóm 3 câu hội thoại, context banner, hỗ trợ hiển thị context graphic (`FlightScheduleGraphic`), in sẵn câu hỏi và 4 lựa chọn A–D.
    - Part 4 (`ExamPart4Renderer.tsx`): Nhóm 3 câu bài nói ngắn, context banner, hỗ trợ context graphic (`StoreDirectoryGraphic`), in sẵn câu hỏi và 4 lựa chọn A–D.
  - **Tính Bất Biến Của Luồng Âm Thanh (Audio Continuity):**
    - Audio phát liên tục cho toàn bộ nhóm câu; tuyệt đối không tự phát lại audio khi component re-render hoặc khi người dùng thay đổi lựa chọn đáp án.
  - **Màn Hình Chuyển Tiếp Reading Hold:**
    - Khi kết thúc 45 phút Listening hoặc audio hoàn tất, workspace tự động chuyển sang màn hình Reading Hold với chỉ dẫn rõ ràng, cho phép mở Answer Sheet xem lại hoặc nộp bài, giữ nguyên ranh giới cho Phase 15 Reading Renderer.
  - **Hộp Thoại Xác Nhận Nộp Bài (Controlled Submit Modal - `ExamSubmitModal.tsx`):**
    - Thống kê chi tiết số câu đã làm, chưa làm, số câu gắn cờ xem lại, cảnh báo câu bỏ trống và xác nhận nộp bài an toàn.
- **File thực hiện:** [`src/types/examWorkspace.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/types/examWorkspace.ts), [`src/components/Exam/Workspace/ExamWorkspaceHeader.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/Workspace/ExamWorkspaceHeader.tsx), [`src/components/Exam/Workspace/ExamAudioBar.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/Workspace/ExamAudioBar.tsx), [`src/components/Exam/Workspace/ExamAnswerSheet.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/Workspace/ExamAnswerSheet.tsx), [`src/components/Exam/Workspace/ExamSubmitModal.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/Workspace/ExamSubmitModal.tsx), [`src/components/Exam/Workspace/ExamPart1Renderer.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/Workspace/ExamPart1Renderer.tsx), [`src/components/Exam/Workspace/ExamPart2Renderer.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/Workspace/ExamPart2Renderer.tsx), [`src/components/Exam/Workspace/ExamPart3Renderer.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/Workspace/ExamPart3Renderer.tsx), [`src/components/Exam/Workspace/ExamPart4Renderer.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/Workspace/ExamPart4Renderer.tsx), [`src/components/Exam/Workspace/ExamWorkspace.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/Workspace/ExamWorkspace.tsx), [`src/components/Exam/Workspace/index.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/Workspace/index.ts), [`src/utils/__tests__/examListeningWorkspace.test.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/__tests__/examListeningWorkspace.test.ts).
- **Trạng thái:** **Hoàn thiện 100% (565/565 assertions passed, tổng hợp 3,869/3,869 tests toàn dự án)**.

### Module 21: Exam Reading Workspace & Section Navigation (Phase 15)
- **Mục đích:** Hoàn thiện giao diện phòng thi chuẩn mực Full Mock Exam Workspace cho phần thi Đọc (Reading Part 5–7, Câu 101–200) và điều hướng phần Reading: Tự do điều hướng giữa các câu 101–200, sửa đáp án và cờ xem lại trước khi nộp bài, độc lập 75 phút timer với tính năng auto-submit khi hết giờ, giữ nghiêm ngặt kỷ luật Strict không quay lại Listening (1–100), bảo mật không tiết lộ đáp án/lời giải trong quá trình thi.
- **Cách hoạt động:**
  - **Part 5 Incomplete Sentences Renderer (`ExamPart5Renderer.tsx`):**
    - Hiển thị câu chứa chỗ trống `_____` kèm tính năng xem trước trực tiếp lựa chọn đang chọn trong blank `(${choice})`.
    - 4 lựa chọn A–D rõ ràng, phím tắt `[A, B, C, D]`, nút toggle cờ `[M / F]`.
    - Nghiêm cấm hiển thị đáp án đúng, giải thích hay tag ngữ pháp trong lúc thi.
  - **Part 6 Text Completion Renderer (`ExamPart6Renderer.tsx`):**
    - Bố cục 2 vùng (Split Layout) trên desktop: Pane trái cuộn độc lập hiển thị văn bản công sở với các blank tương tác `[131]`, `[132]`, `[133]`, `[134]`; Pane phải hiển thị đầy đủ 4 câu hỏi thuộc group.
    - Click trực tiếp vào blank trong văn bản sẽ tự động focus/cuộn tới câu hỏi tương ứng; hiển thị badge đáp án đã chọn vào blank.
    - Bảo toàn vị trí cuộn khi đổi câu hoặc đổi đáp án; hỗ trợ câu chèn nguyên câu và từ loại/ngữ pháp.
  - **Part 7 Reading Comprehension Renderer (`ExamPart7Renderer.tsx`):**
    - Bố cục 2 vùng (Split Layout) trên desktop: Pane trái hiển thị văn bản (Single, Double, Triple passages) với thẻ định dạng văn bản (Email, Schedule, Chat, Invoice, Form, Notice...).
    - Đối với Double/Triple Passages: Thanh chuyển nhanh (Quick Jump Pills) giữa các văn bản kết hợp chế độ xếp chồng (Stacked view) phục vụ đối chiếu thông tin chéo.
    - Huy hiệu nhận diện câu hỏi tổng hợp đa văn bản (`crossTextReference: true` — *Tổng Hợp Đa Văn Bản*).
    - Pane phải hiển thị danh sách toàn bộ các câu hỏi trong group (2–5 câu), cho phép làm bài liên tục mà không mất context.
  - **Điều Hướng & Kỷ Luật Phòng Thi Reading:**
    - Tự do di chuyển giữa các câu 101–200 qua Answer Sheet, nút Câu trước / Câu kế tiếp hoặc phím mũi tên.
    - Kỷ luật Strict Mode: Cố gắng quay lại câu 1–100 bị chặn tuyệt đối (`STRICT_NAVIGATION_BLOCKED`, `STRICT_SECTION_LOCKED`) kèm toast cảnh báo minh bạch.
    - Hết 75 phút Reading: Tự động nộp bài qua engine (`timeout_reading`).
    - Nộp bài chủ động qua hộp thoại xác nhận `ExamSubmitModal` với kiểm toán đầy đủ câu làm / bỏ trống / cờ.
- **File thực hiện:** [`src/components/Exam/Workspace/ExamPart5Renderer.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/Workspace/ExamPart5Renderer.tsx), [`src/components/Exam/Workspace/ExamPart6Renderer.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/Workspace/ExamPart6Renderer.tsx), [`src/components/Exam/Workspace/ExamPart7Renderer.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/Workspace/ExamPart7Renderer.tsx), [`src/components/Exam/Workspace/ExamWorkspace.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/Workspace/ExamWorkspace.tsx), [`src/types/examWorkspace.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/types/examWorkspace.ts), [`src/utils/__tests__/examReadingWorkspace.test.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/__tests__/examReadingWorkspace.test.ts).
- **Trạng thái:** **Hoàn thiện 100% (584/584 assertions passed, tổng hợp 4,453/4,453 tests toàn dự án)**.

### Module 22: Exam Submission, Scoring Engine & History Persistence (Phase 16)
- **Mục đích:** Hoàn thiện cơ chế nộp bài Idempotent (`finalizeExamSubmission`), động cơ chấm điểm toán học độc lập (`examScoringEngine.ts`) và hệ thống lưu trữ lịch sử thi nhiều lượt an toàn ngoại tuyến (`examSessionStorage.ts`): đảm bảo một Session ID chỉ được nộp bài duy nhất một lần (chống double-click, auto/manual race condition, stale callbacks và StrictMode), đóng băng snapshot đáp án bất biến, tính toán toàn diện số câu đúng/sai/chưa làm cho từng Part 1–7 và toàn bài, bảo đảm bất biến đúng 200 câu (`correct + incorrect + unanswered === 200`), ước tính điểm chuẩn ETS scaled score kèm nhãn phương pháp & cảnh báo minh bạch (tuyệt đối không ghi đè hồ sơ người dùng), thẩm định tính toàn vẹn phiên thi (hủy tư cách Strict khi có gián đoạn âm thanh hoặc can thiệp đồng hồ), lưu trữ an toàn nhiều attempts độc lập cho cùng một đề thi.
- **Cách hoạt động:**
  - **Idempotent Submission Coordinator (`examSubmissionCoordinator.ts`):**
    - Kiểm soát cờ khóa đang nộp (`inFlightSubmissions` lock) ngăn chặn tuyệt đối double-click và tương tranh giữa manual submit và auto-timeout.
    - Kiểm tra tính idempotent từ cả session state (`session.status === 'submitted'`) và LocalStorage (`getExamResult(sessionId)`). Nếu đã finalize trước đó, trả về ngay kết quả đã lưu mà không chấm lại hay ghi đè.
    - Đóng băng snapshot đáp án bất biến: trích xuất toàn bộ câu trả lời tại thời điểm submit, không phụ thuộc vào trạng thái mutating của session sau đó.
    - Ghi nhận nguyên tử: chỉ trả về kết quả thành công (`success: true`) SAU KHI cả kết quả thi (`saveExamResult`) và mục lịch sử (`saveExamHistoryEntry`) đã ghi thành công vào LocalStorage.
    - Xử lý lỗi bộ nhớ & Quota: nếu ghi dữ liệu thất bại, bắt lỗi an toàn (`STORAGE_PERSISTENCE_FAILED`), khôi phục khóa và trả cờ `isRecoverable: true` cho phép người dùng thử nộp lại mà không mất bài làm.
  - **Scoring Engine Toán Học (`examScoringEngine.ts`):**
    - Chấm điểm thuần túy (Pure Function) đối chiếu trực tiếp với đáp án chính thức (`canonicalAnswerKey`) của từng câu hỏi:
      - Listening: 0–100 correct, accuracy %.
      - Reading: 0–100 correct, accuracy %.
      - Total: 0–200 correct, accuracy %.
      - Thống kê chi tiết Part 1–7: số câu đúng, sai, bỏ trống và tỷ lệ chính xác từng phần.
      - Bất biến toán học 200 câu: `correct + incorrect + unanswered === 200` được xác thực nghiêm ngặt bằng hàm `validateScoreTotals`.
      - Không áp dụng điểm âm cho câu sai, không tự động điền câu bỏ trống.
  - **Thẩm Định Tính Toàn Vẹn Phiên Thi (`evaluateResultIntegrity`):**
    - Phiên thi Strict Mode bị tự động tước chứng chỉ toàn vẹn (`isStrictCertified: false`, `isStrictValid: false`) nếu xảy ra gián đoạn truyền thông (`audioDisrupted: true`, `timelineAbnormal: true`) hoặc can thiệp đồng hồ (`isClockTampered: true`).
    - Ghi nhận minh bạch các cờ toàn vẹn (`mediaIntegrityPreserved`, `clockIntegrityPreserved`, `reasons`) phục vụ hiển thị kết quả trung thực.
  - **Ước Tính Điểm Scaled Score Minh Bạch:**
    - Sử dụng mô hình quy đổi thực nghiệm `convertScoreToETS` (`scoreConverter.ts`) để cung cấp khoảng điểm tham khảo (Estimated Scaled Score: Listening 5–495, Reading 5–495, Total 10–990).
    - Dán nhãn phương pháp rõ ràng (`"ETS Empirical Equating Table Model (Educational Estimate)"`) kèm giới hạn kỹ thuật: *Điểm số mang tính chất tham khảo học tập, không thay thế bảng điểm chính thức do ETS/IIG cấp*.
    - Tuyệt đối không ghi đè lên điểm chính thức hay self-reported score trong profile người dùng (`toeic_mastery_data_v2_cold`).
  - **Lưu Trữ Lịch Sử Nhiều Lượt (Multi-Attempt History - `examSessionStorage.ts`):**
    - Lưu danh sách lịch sử thi độc lập theo đề (`toeic_exam_history_v1`) và kết quả chi tiết từng session (`toeic_exam_result_v1_${sessionId}`).
    - Cho phép thi lại (Retake) nhiều lần trên cùng một ExamForm: mỗi lần thi tạo một Session ID duy nhất, không ghi đè attempts cũ, không tái sử dụng đáp án cũ.
    - Ghi nhận đầy đủ metadata: `formRevision`, ngày giờ bắt đầu/hoàn thành, thời gian làm bài thực tế, mode (simulation/strict), integrity status, raw scores, accuracy và scaled estimate.
- **File thực hiện:** [`src/types/mockExam.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/types/mockExam.ts), [`src/utils/examScoringEngine.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/examScoringEngine.ts), [`src/utils/examSubmissionCoordinator.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/examSubmissionCoordinator.ts), [`src/utils/examSessionStorage.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/examSessionStorage.ts), [`src/components/Exam/Workspace/ExamWorkspace.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/Workspace/ExamWorkspace.tsx), [`src/utils/__tests__/examScoringAndSubmission.test.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/__tests__/examScoringAndSubmission.test.ts).
- **Trạng thái:** **Hoàn thiện 100% (125/125 assertions passed, tổng hợp 4,578/4,578 tests toàn dự án)**.

### Module 23: Exam Results Dashboard, 200-Question Answer Review & History UI (Phase 17)
- **Mục đích:** Xây dựng toàn bộ giao diện xem kết quả thi và chữa bài chi tiết dựa trên dữ liệu thi thật đã được đóng băng (`ExamResult` và `ExamHistoryEntry`): Bảng điều khiển kết quả toàn diện (Result Dashboard), giao diện chữa bài chi tiết 200 câu (Answer Review) đọc từ snapshot bất biến, và modal quản lý lịch sử nhiều lần thi (History UI) kèm tính năng so sánh tiến độ có dán nhãn thận trọng về hiệu ứng nhớ đề.
- **Cách hoạt động:**
  - **Result Dashboard (`ExamResultDashboard.tsx`):**
    - Hiển thị metadata bài thi: ExamForm ID, thời gian thi, số phút đã làm bài, chế độ thi (Simulation / Strict), và huy hiệu thẩm định tính toàn vẹn (Integrity Status).
    - Thẻ điểm Raw (Total, Listening, Reading raw correct), số câu sai, số câu chưa trả lời và tỷ lệ chính xác (Accuracy %).
    - Thang điểm ước tính ETS (Estimated Scaled Score: 10–990) dán nhãn phương pháp rõ ràng kèm ghi chú minh bạch (mang tính chất tham khảo giáo dục, không thay thế bảng điểm chính thức).
    - Ma trận năng lực Part 1–7 với thước đo trực quan % chính xác.
    - Phân tích điểm mạnh (Strengths $\ge 75\%$), điểm trung bình (50–74%) và điểm yếu (Weaknesses $< 50\%$).
    - Nhận diện các bẫy đề thi hay gặp phải (ETS Traps Encountered) và các chủ đề cần cải thiện (Topics to Improve).
    - Nút chuyển ngay sang màn hình Chữa Bài Chi Tiết 200 câu.
    - Tuyệt đối không biến một lần thi thành biểu đồ xu hướng giả mạo.
  - **200-Question Answer Review (`ExamAnswerReview.tsx`):**
    - Hiển thị đủ 200 câu hỏi từ snapshot đã đóng băng, tuyệt đối ở chế độ chỉ đọc (Read-Only: không thể chỉnh sửa đáp án đã chốt hay thay đổi điểm số).
    - Mỗi câu hỏi hiển thị đầy đủ: câu hỏi gốc, lựa chọn của thí sinh, đáp án đúng, trạng thái Đúng/Sai/Bỏ trống, giải thích chi tiết, bẫy ETS và các tags chủ đề.
    - Bảo toàn toàn vẹn ngữ cảnh:
      - Part 1: Tranh vẽ SVG nguyên gốc.
      - Part 2: 3 lựa chọn A-C kèm transcript và công cụ nghe lại qua Web Speech API TTS replay.
      - Part 3/4: Ngữ cảnh graphic (sơ đồ/bảng biểu), transcript phân vai và công cụ nghe lại TTS.
      - Part 6: Đoạn văn chia đôi (Split layout) với 4 ô trống liên kết và nhãn đáp án đã chọn.
      - Part 7: Văn bản đơn/kép/ba với trích dẫn bằng chứng (evidence) và huy hiệu tổng hợp đa văn bản.
    - Bộ lọc linh hoạt: Tất cả (`all`), Đúng (`correct`), Sai (`incorrect`), Chưa làm (`unanswered`), Có cờ (`flagged`), và lọc theo từng Part 1–7.
    - Điều hướng nhanh đến câu làm sai (Next / Prev Wrong) với vòng lặp tuần hoàn (wrap-around).
    - Kiểm tra tính tương thích phiên bản đề (`checkExamFormCompatibility`): Nếu đề thi bị xóa khỏi registry hoặc lệch `contentRevision`, hiển thị cảnh báo thiếu dữ liệu / ưu tiên snapshot đóng băng thay vì chữa nhầm sang đề mới.
  - **Multi-Attempt History UI (`ExamHistoryModal.tsx`):**
    - Đọc dữ liệu lịch sử thi thật từ `getExamHistory()`.
    - Phân biệt rõ các lần thi hoàn thành hợp lệ với các lần thi gián đoạn / invalid.
    - So sánh tiến bộ giữa 2 lần thi gần nhất trên cùng một ExamForm (Delta Raw Score, Delta Scaled Score, Delta Accuracy, Delta Duration).
    - Hiển thị biểu ngữ cảnh báo thận trọng bắt buộc về **Hiệu Ứng Luyện Tập / Nhớ Đề (Practice Effect / Test-Retest Memory Effect)**: Thí sinh làm lại cùng một đề thi thường có điểm số cao hơn do đã ghi nhớ nội dung và bẫy đề từ trước, không hoàn toàn phản ánh sự gia tăng năng lực ngôn ngữ thực tế.
    - Nút mở giao diện Xem lại & Chữa bài chi tiết cho từng attempt đã lưu.
  - **Điều Phối Trực Tiếp (`ExamResultWorkspace.tsx`):**
    - Điều phối mượt mà giữa 2 tab: Tổng Quan Kết Quả (Dashboard) và Chữa Bài 200 Câu (Review).
    - Tích hợp nút xem lại trực tiếp từ màn hình nộp bài trong `ExamWorkspace.tsx` và từ danh sách lịch sử trong `ExamLibraryHub.tsx`.
- **File thực hiện:** [`src/types/examReview.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/types/examReview.ts), [`src/utils/examReviewAnalysis.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/examReviewAnalysis.ts), [`src/components/Exam/Results/ExamResultDashboard.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/Results/ExamResultDashboard.tsx), [`src/components/Exam/Results/ExamAnswerReview.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/Results/ExamAnswerReview.tsx), [`src/components/Exam/Results/ExamHistoryModal.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/Results/ExamHistoryModal.tsx), [`src/components/Exam/Results/ExamResultWorkspace.tsx`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/Results/ExamResultWorkspace.tsx), [`src/components/Exam/Results/index.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/components/Exam/Results/index.ts), [`src/utils/__tests__/examResultAndReview.test.ts`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/src/utils/__tests__/examResultAndReview.test.ts).
- **Trạng thái:** **Hoàn thiện 100% (65/65 assertions passed, tổng hợp 4,643/4,643 tests toàn dự án)**.

---

## E. HƯỚNG DẪN CÀI ĐẶT & VẬN HÀNH

### 1. Yêu cầu môi trường
- **Node.js:** Phiên bản `>= 18.0.0` (Khuyến nghị Node.js 20 LTS hoặc mới hơn).
- **Trình quản lý gói:** `npm` `>= 9.0.0`.
- **Hệ điều hành:** Hỗ trợ đầy đủ Windows, macOS, Linux.
- **Trình duyệt khuyến nghị:** Chrome, Edge, Brave, Safari, Firefox (hỗ trợ Web Audio API & Speech Synthesis).

### 2. Cài đặt Dependencies

Mở terminal tại thư mục gốc của dự án và chạy lệnh:

```bash
npm install
```

### 3. Cấu hình biến môi trường
Dự án được xây dựng theo kiến trúc **Offline-First / Zero-Cloud Backend**, do đó:
- **KHÔNG** yêu cầu tệp `.env`.
- **KHÔNG** chứa API key, mật khẩu cơ sở dữ liệu hay token bảo mật nào cần cấu hình.

### 4. Danh sách các lệnh thực thi (NPM Scripts)

Toàn bộ lệnh được đối chiếu chính xác từ [`package.json`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/package.json):

| Lệnh | Mục đích | Port / URL mặc định |
|---|---|---|
| `npm run dev` | Khởi chạy máy chủ phát triển Vite với Hot Module Replacement (HMR) | `http://localhost:5173` |
| `npm run build` | Biên dịch kiểm tra kiểu TypeScript (`tsc -b`) và đóng gói mã nguồn cho production (`vite build`) | Xuất ra thư mục `./dist` |
| `npm run lint` | Kiểm tra toàn bộ mã nguồn bằng Oxlint linter siêu tốc | Kiểm tra trên toàn bộ tệp tin dự án |
| `npm run test:validation` | Chạy toàn bộ 4,643 bài kiểm tra targeted tests (50 Question Bank + 82 Question Selector + 83 Session Engine + 64 Listening Audio Engine + 53 Listening Workspace + 69 Reading Workspace + 84 Exam Blueprint + 359 Listening Part 1 & 2 + 477 Listening Part 3 + 364 Listening Part 4 + 316 Reading Part 5 + 292 Reading Part 6 + 586 Reading Part 7 Single + 44 Reading Part 7 Multi + 46 Exam Readiness + 145 Exam Session + 84 Exam Timer & Multi-Tab + 66 Strict Listening Audio Engine + 40 Exam Preflight & Library + 565 Exam Listening Workspace + 584 Exam Reading Workspace + 125 Exam Scoring Engine & Submission + 65 Exam Results & Answer Review) | Trực tiếp trên terminal (0 errors) |
| `npm run test:validator` | Chạy bộ 50 bài kiểm tra schema, cardinality và toàn vẹn Question Bank 7 Parts | Trực tiếp trên terminal (0 errors) |
| `npm run test:selector` | Chạy bộ 82 bài kiểm tra targeted unit tests kiểm định riêng Question Selection Engine | Trực tiếp trên terminal (0 errors) |
| `npm run test:session` | Chạy bộ 83 bài kiểm tra targeted unit tests kiểm định riêng Practice Session Engine & Storage | Trực tiếp trên terminal (0 errors) |
| `npm run test:audio` | Chạy bộ 64 bài kiểm tra targeted unit tests kiểm định riêng Listening Audio Engine | Trực tiếp trên terminal (0 errors) |
| `npm run test:workspace` | Chạy bộ 53 bài kiểm tra contract & unit tests kiểm định Listening Practice Workspace (Part 1–4) | Trực tiếp trên terminal (0 errors) |
| `npm run test:reading` | Chạy bộ 69 bài kiểm tra contract & unit tests kiểm định Reading Practice Workspace (Part 5–7) | Trực tiếp trên terminal (0 errors) |
| `npm run test:blueprint` | Chạy bộ 84 bài kiểm tra unit tests kiểm định Exam Blueprint và Validation Engine | Trực tiếp trên terminal (0 errors) |
| `npm run test:listening-p1-p2` | Chạy bộ 359 bài kiểm tra contract & validation tests kiểm định riêng Listening Question Bank Part 1 & Part 2 | Trực tiếp trên terminal (0 errors) |
| `npm run test:listening-p3` | Chạy bộ 477 bài kiểm tra contract & validation tests kiểm định riêng Listening Question Bank Part 3 (13 groups / 39 questions) | Trực tiếp trên terminal (0 errors) |
| `npm run test:listening-p4` | Chạy bộ 364 bài kiểm tra contract & validation tests kiểm định riêng Listening Question Bank Part 4 (10 groups / 30 questions) | Trực tiếp trên terminal (0 errors) |
| `npm run test:reading-p5` | Chạy bộ 316 bài kiểm tra contract & validation tests kiểm định riêng Reading Question Bank Part 5 (30 câu Incomplete Sentences) | Trực tiếp trên terminal (0 errors) |
| `npm run test:reading-p6` | Chạy bộ 292 bài kiểm tra contract & validation tests kiểm định riêng Reading Question Bank Part 6 (4 groups / 16 questions) | Trực tiếp trên terminal (0 errors) |
| `npm run test:reading-p7-single` | Chạy bộ 586 bài kiểm tra contract & validation tests kiểm định riêng Reading Question Bank Part 7 Single Passages (10 groups / 29 questions) | Trực tiếp trên terminal (0 errors) |
| `npm run test:reading-p7-multi` | Chạy bộ 44 bài kiểm tra contract & validation tests kiểm định riêng Reading Question Bank Part 7 Multiple Passages (5 groups / 25 questions: 2 Double + 3 Triple) | Trực tiếp trên terminal (0 errors) |
| `npm run test:exam-readiness` | Chạy bộ 46 bài kiểm tra contract & validation tests kiểm định ExamForm Assembly, 4-tier readiness classification và timeline Listening | Trực tiếp trên terminal (0 errors) |
| `npm run test:exam-session` | Chạy bộ 145 bài kiểm tra contract & validation tests kiểm định Exam Session State Machine & Persistence Engine (Phase 10) | Trực tiếp trên terminal (0 errors) |
| `npm run test:exam-timer` | Chạy bộ 84 bài kiểm tra fake-clock & contract tests kiểm định Exam Timer Engine, Section Transition & Multi-Tab Safety (Phase 11) | Trực tiếp trên terminal (0 errors) |
| `npm run test:exam-audio` | Chạy bộ 66 bài kiểm tra contract & invariant tests kiểm định Strict Listening Audio Engine, Sequence, Anti-Tamper & Recovery (Phase 12) | Trực tiếp trên terminal (0 errors) |
| `npm run test:exam-preflight` | Chạy bộ 40 bài kiểm tra contract & invariant tests kiểm định Exam Library Hub, Instructions & Preflight Check (Phase 13) | Trực tiếp trên terminal (0 errors) |
| `npm run test:exam-workspace` | Chạy bộ 565 bài kiểm tra contract & invariant tests kiểm định Exam Listening Workspace, Specialized Renderers & Unified Answer Sheet 200 câu (Phase 14) | Trực tiếp trên terminal (0 errors) |
| `npm run test:exam-reading` | Chạy bộ 584 bài kiểm tra contract & invariant tests kiểm định Exam Reading Workspace Part 5–7, Free Navigation 101–200, Blank Mapping & Submission Entry (Phase 15) | Trực tiếp trên terminal (0 errors) |
| `npm run test:exam-scoring` | Chạy bộ 125 bài kiểm tra contract & invariant tests kiểm định Exam Scoring Engine, Scaled Estimator, Idempotent Submission & History Persistence (Phase 16) | Trực tiếp trên terminal (0 errors) |
| `npm run test:exam-review` | Chạy bộ 65 bài kiểm tra contract & invariant tests kiểm định Exam Results Dashboard, 200-Question Answer Review, Wrap-Around Navigation & Retake History Comparison (Phase 17) | Trực tiếp trên terminal (0 errors) |
| `npm run preview` | Khởi chạy máy chủ cục bộ để xem trước bản build production | `http://localhost:4173` |

### 5. Triển khai (Production Deployment)
Vì là ứng dụng Single Page Application tĩnh, sau khi chạy `npm run build`, bạn có thể triển khai thư mục `dist/` trực tiếp lên bất kỳ nền tảng tĩnh nào:
- **Vercel / Netlify / Cloudflare Pages / GitHub Pages / AWS S3**: Tải thư mục `dist/` lên và định tuyến toàn bộ URL về `index.html`.

---

## F. TRẠNG THÁI PHÁT TRIỂN & GHI CHÚ CHUYỂN GIAO (HANDOFF NOTES)

Phần này cung cấp bối cảnh kỹ thuật ngắn gọn, chính xác để một AI Agent khác hoặc kỹ sư phần mềm tiếp tục phát triển an toàn mà không cần nghiên cứu lại từ đầu.

### 1. Những gì đã hoàn thiện & hoạt động ổn định
- ✅ Đã đóng gói và build production thành công (`npm run build`) không có lỗi biên dịch TypeScript.
- ✅ Hệ thống Offline-First LocalStorage key `toeic_mastery_data_v2_cold` hoạt động ổn định, không thất thoát dữ liệu khi F5 hoặc đóng tab.
- ✅ Quy đổi điểm thi ETS Listening/Reading và thang đo Diagnostic 14 câu phản ánh sát thực tế.
- ✅ Web Audio API tổng hợp âm thanh chuông báo mượt mà trên môi trường trình duyệt.
- ✅ Giao diện Dark/Light theme chuyển đổi tức thì không giật lag.
- ✅ Flashcard lật 3D tương thích mượt mà trên cả máy tính lẫn thiết bị di động.
- ✅ **Nền tảng Question Bank (Phase 1):** Kiến trúc discriminated unions cho 7 Part, media, grouped passages và learner practice models hoàn tất 100%. Tách biệt hoàn toàn Question Bank khỏi LocalStorage.
- ✅ **Ngân hàng câu hỏi Listening Part 1–4:** Hoàn thiện 104 câu Listening tự biên soạn chất lượng cao (Part 1: 10 câu $\ge 6$ kèm tranh SVG; Part 2: 25 câu $\ge 25$ chuẩn 3 phương án A-C; Part 3: 13 groups / 39 câu $\ge 39$; Part 4: 10 groups / 30 câu $\ge 30$). Vượt mốc 100 câu Listening chuẩn ETS cho một ExamForm. 100% câu hỏi có audio/TTS script, transcript phân vai, đáp án và lời giải chi tiết.
- ✅ **Ngân hàng câu hỏi Reading Part 5–7 & Toàn bộ 7 Parts:** Hoàn thiện 100 câu Reading tự biên soạn chất lượng cao (Part 5: 30 câu đạt chuẩn ExamForm; Part 6: 4 groups/16 câu; Part 7: 10 Single groups/29 câu + 5 Multi groups/25 câu = 54 câu). Toàn bộ 7 Parts đạt **204 câu hỏi và 42 groups hợp lệ**, kiểm định **50/50 test cases passed** (`npm run test:validator`).
- ✅ **Question Selection Engine & Practice Hub Configuration (Phase 4):** Xây dựng pure selection engine hoàn chỉnh (`questionSelector.ts`) bảo toàn 100% Group Integrity cho Part 3, 4, 6, 7 (DP subset-sum solver); thuật toán anti-repeat đa tầng theo recency và tần suất luyện; tái sử dụng khi cạn ngân hàng (`isBankExhausted`); seeded RNG tất định. Giao diện cấu hình `PracticeConfigHub.tsx` responsive, Dark/Light mode, tính thời lượng ETS pacing, snap feasible counts. Kiểm định **82/82 selector test cases passed**.
- ✅ **Practice Session Engine, Persistence & Timed Practice (Phase 5):** Xây dựng state machine hoàn chỉnh (`practiceSessionEngine.ts`, `practiceSessionStorage.ts`, `usePracticeSession.ts`) quản lý toàn bộ vòng đời: Khởi tạo phiên, cập nhật đáp án, cờ xem lại, điều hướng an toàn, khóa câu trả lời sau khi nộp (Answer Lock). Theo dõi trợ giúp trong Practice Mode (phục vụ Phase 9). Timed Practice dựa trên mốc thời gian thực wall-clock không drift, auto-submit đúng 1 lần, bảo vệ chống submit trùng lặp (Idempotency). Lưu trữ LocalStorage độc lập với bảo vệ chống ghi đè phiên dở dang (`UNFINISHED_SESSION_EXISTS`), xử lý quota và khôi phục an toàn khi F5. Kiểm định **83/83 session unit test cases passed**.
- ✅ **Stable Listening Audio Engine (Phase 6):** Xây dựng headless audio controller (`ListeningAudioController`), voice manager (`voiceManager`), parser kịch bản phân đoạn tuần tự (`audioScriptParser.ts`), hook vòng đời React (`useListeningAudio`), giao diện tái sử dụng (`ListeningAudioPlayer.tsx`) tích hợp điều phối đơn nhất chống phát chồng âm thanh (`AudioPlaybackCoordinator`), token guard loại bỏ 100% stale callbacks, hàng đợi phân đoạn TTS chống bug 15s hang, hỗ trợ HTMLAudioElement khi có audio file và kiểm soát nghiêm ngặt quyền nghe lại theo mode (Practice: tự do replay; Timed: đúng 1 lần duy nhất). Kiểm định **64/64 audio unit test cases passed**.
- ✅ **Listening Practice Workspace Part 1–4 (Phase 7):** Hoàn thiện không gian làm bài Listening chuyên sâu (`ListeningWorkspace.tsx` và các specialized renderers `Part1PhotographView`, `Part2QuestionResponseView`, `Part3ConversationView`, `Part4TalkView`). Tuân thủ nghiêm ngặt quy chế đề thi nghe ETS: ẩn transcript/phương án mặc định; Part 2 đúng 3 lựa chọn A-C; Part 3/4 giữ liên tục luồng audio khi chuyển câu hỏi trong cùng một nhóm; hỗ trợ hình minh họa vector và graphic schedule/directory; ma trận điều hướng nhóm 3 câu; phím tắt trực quan; hộp thoại xác nhận nộp bài `SubmitConfirmationModal`; bảo toàn đáp án và khóa hoàn toàn sau khi nộp/hết giờ; cleanup audio triệt để khi chuyển nhóm hoặc rời phiên. Kiểm định **53/53 contract test cases passed**.
- ✅ **Reading Practice Workspace Part 5–7 (Phase 8):** Hoàn thiện không gian làm bài Reading chuyên sâu (`ReadingWorkspace.tsx` và các specialized renderers `Part5IncompleteSentencesView`, `Part6TextCompletionView`, `Part7ReadingComprehensionView`). Part 5 hiển thị câu chứa blank trực quan kèm xem trước đáp án đã chọn (`[C]`), 4 lựa chọn A–D; Part 6 bố cục chia đôi với 4 vị trí blank interactive `[131]`..`[134]` kết nối chính xác với câu hỏi, hỗ trợ câu chèn nguyên câu và từ loại, thanh cuộn độc lập; Part 7 hỗ trợ toàn diện Single, Double và Triple Passages với các định dạng phong phú (email, memo, bảng biểu, hóa đơn, tin nhắn), tab nhảy nhanh văn bản con, huy hiệu đối chiếu đa văn bản (`Đa văn bản`), không reset vị trí đọc khi điều hướng câu trong nhóm; tích hợp phím tắt, modal xác nhận nộp bài, đồng hồ đếm ngược wall-clock, auto-submit và khóa bài. Kiểm định **69/69 contract test cases passed**.
- ✅ **Full Mock Exam Foundation & Blueprint (Full Mock Phase 1):** Thiết kế kiến trúc toàn diện cho bài thi thử ETS 200 câu / 120 phút (`ExamBlueprint`, `ExamForm`, `ExamQuestionRef`, `ExamGroupRef`, `ExamMediaRef`, `ExamSession`, `ExamAnswer`, `ExamResult`, `ExamReview`, `ExamHistory`). Động cơ kiểm định pure functions `examBlueprintValidator.ts` kiểm tra 100% ràng buộc hình thức (200 câu, 1-200 sequential, unique IDs, group integrity P3=3, P4=3, P6=4, P7 10 single [29 Qs] / 5 multiple [25 Qs], schema version compatibility) và Question Bank linkage. Kiểm định **84/84 blueprint unit tests passed**.
- ✅ **Hoàn Thiện Listening Question Bank Part 1 & Part 2 (Full Mock Phase 2):** Hoàn thiện 100% yêu cầu nội dung chuẩn ETS cho Part 1 & Part 2 phục vụ cấu thành ExamForm 200 câu: Part 1 đạt 10 câu ($\ge 6$) kèm 100% tranh vẽ SVG sắc nét độc quyền, 4 options A–D; Part 2 nâng cấp từ 15 lên đúng 25 câu ($\ge 25$), nghiêm ngặt 3 phương án A–C, phủ đủ 10 dạng thức câu hỏi giao tiếp ETS, phân bố đều 3 keys (A: 13, B: 7, C: 5), 100% có audio TTS script, transcript và giải thích bẫy chi tiết tiếng Việt. Kiểm định **359/359 contract tests passed**.
- ✅ **Hoàn Thiện Listening Question Bank Part 3 (Full Mock Phase 3):** Hoàn thiện 100% yêu cầu nội dung chuẩn ETS cho Part 3 Conversations phục vụ cấu thành ExamForm 200 câu: Bảo đảm 13 conversation groups hợp lệ ($\ge 13$), mỗi group đúng 3 câu hỏi (tổng 39 câu `grp-p3-001` .. `grp-p3-013`, `q-p3-001` .. `q-p3-039`), lời thoại đa người nói tự nhiên (Man/Woman), audio script, transcript, câu hỏi đồ họa flight schedule, 4 options A–D, phân bố key cân đối (A: 9, B: 15, C: 8, D: 7), giải thích chuyên sâu tiếng Việt và 100% schema validation. Nâng tổng Question Bank lên **145 câu và 27 groups** (Listening Bank đạt 89 câu / 18 groups). Kiểm định **477/477 contract tests passed**.
- ✅ **Hoàn Thiện Listening Question Bank Part 4 (Full Mock Phase 4):** Hoàn thiện 100% yêu cầu nội dung chuẩn ETS cho Part 4 Short Talks phục vụ cấu thành ExamForm 200 câu: Bảo đảm 10 talk groups hợp lệ ($\ge 10$), mỗi group đúng 3 câu hỏi (tổng 30 câu `grp-p4-001` .. `grp-p4-010`, `q-p4-001` .. `q-p4-030`), kịch bản độc thoại tự nhiên đơn thuyết trình viên (announcements, voicemails, workplace instructions, product info, public notices, business presentations, events, transport schedules), audio script, transcript, câu hỏi đồ họa store directory, 4 options A–D, phân bố key cân đối (A: 8, B: 11, C: 6, D: 5), giải thích chuyên sâu tiếng Việt và 100% schema validation. Nâng tổng Question Bank lên **160 câu và 32 groups** (Listening Bank đạt 104 câu / 23 groups, đáp ứng đầy đủ yêu cầu 100 câu cho phần thi Listening). Kiểm định **364/364 contract tests passed**.
- ✅ **Hoàn Thiện Reading Question Bank Part 5 (Full Mock Phase 5):** Hoàn thiện 100% yêu cầu nội dung chuẩn ETS cho Part 5 Incomplete Sentences phục vụ cấu thành ExamForm 200 câu: Bảo đảm 30 câu hỏi hợp lệ ($\ge 30$, `q-p5-001` .. `q-p5-030`), câu chứa blank tiêu chuẩn `_____`, 4 lựa chọn A–D rõ ràng, phân bố đáp án A–D cân bằng tự nhiên (A: 9, B: 8, C: 7, D: 5), phủ rộng 25 chủ điểm ngữ pháp trọng yếu (word forms, verb tenses, gerunds, prepositions, conjunctions, conditionals, relative clauses, comparisons, collocations, business vocab), giải thích chi tiết tiếng Việt và 100% schema validation. Nâng tổng Reading Bank lên **66 câu** và Question Bank toàn dự án lên **170 câu và 32 groups**. Kiểm định **316/316 contract tests passed**.
- ✅ **Hoàn Thiện Reading Question Bank Part 6 (Full Mock Phase 6):** Hoàn thiện 100% yêu cầu nội dung chuẩn ETS cho Part 6 Text Completion phục vụ cấu thành ExamForm 200 câu: Bảo đảm 4 văn bản công sở hoàn chỉnh ($\ge 4$ groups, 16 câu `grp-p6-001` .. `grp-p6-004`, `q-p6-001` .. `q-p6-016`), đúng 4 vị trí blank xác định theo thứ tự tăng dần (`[131]`..`[134]`, `[135]`..`[138]`, `[139]`..`[142]`, `[143]`..`[146]`), mapping 1–1 không trùng lặp, đa dạng thể loại thực tế (Email chuyển văn phòng, Memo nâng cấp phần mềm ERP, Notice ngày hội sức khỏe, Letter phản hồi khiếu nại khách hàng), hỗ trợ đầy đủ các dạng điền từ loại, từ vựng/collocation và chèn câu hoàn chỉnh (mỗi nhóm đúng 1 câu sentence insertion), phân bố đáp án A–D cân bằng hoàn hảo (A: 4, B: 4, C: 4, D: 4; mỗi group có đủ A, B, C, D), tái tạo văn bản liền mạch không lỗi cú pháp hay dấu câu kép. Kiểm định **292/292 contract tests passed**.
- ✅ **Hoàn Thiện Reading Question Bank Part 7 Single Passages (Full Mock Phase 7):** Hoàn thiện 100% yêu cầu nội dung chuẩn ETS cho Part 7 Single Passages phục vụ cấu thành ExamForm 200 câu: Bảo đảm đúng 10 nhóm single passages (`grp-p7-001` .. `grp-p7-010`), tổng 29 câu hỏi (`q-p7-001` .. `q-p7-029`), phân bổ theo cơ cấu kích thước chuẩn ETS (4 nhóm 2 câu, 3 nhóm 3 câu, 3 nhóm 4 câu = 29 câu), 10 thể loại văn bản công sở phong phú (Email gia hạn hợp đồng phần mềm, Thông báo bảo trì thang máy tòa nhà, Tin nhắn chat rà soát tài liệu họp, Lịch trình hội thảo chuỗi cung ứng, Quảng cáo cho thuê văn phòng trọn gói, Bản thông số kỹ thuật máy lọc không khí, Đánh giá trực tuyến phần mềm quản lý đội xe, Thông cáo chính sách nội bộ phụ cấp thiết bị làm việc từ xa, Thư doanh nghiệp điều chỉnh tiến độ giao hàng, Thông cáo báo chí thương vụ mua lại công nghệ sinh học), bao phủ toàn diện kỹ năng đọc ETS (purpose, detail, inference, vocabulary in context, contextual interpretation, sentence insertion có markers `[1]`..`[4]` tăng dần), cân bằng phân bố đáp án A: 7, B: 7, C: 8, D: 7, giải thích chi tiết tiếng Việt dẫn chứng văn bản và 100% schema validation. Nâng tổng Reading Bank lên **85 câu và 16 groups**, và Question Bank toàn dự án lên **189 câu và 39 groups**. Kiểm định **586/586 contract tests passed**.
- ✅ **Hoàn Thiện Reading Question Bank Part 7 Multiple Passages (Full Mock Phase 8):** Hoàn thiện 100% yêu cầu nội dung chuẩn ETS cho Part 7 Multiple Passages phục vụ cấu thành ExamForm 200 câu: Bảo đảm đúng 5 nhóm multiple passages (`grp-p7-011` .. `grp-p7-015`), mỗi group đúng 5 câu hỏi (tổng 25 câu `q-p7-030` .. `q-p7-054`), bao gồm đầy đủ 2 Double Passages (`grp-p7-011` Email + Hóa đơn suất ăn, `grp-p7-012` Quảng cáo + Email thuê mặt bằng) và 3 Triple Passages (`grp-p7-013` Lịch trình + Thông tri + Email chi phí hội nghị, `grp-p7-014` Danh mục thông số kỹ thuật + Đơn đặt hàng + Báo cáo theo dõi tàu biển quốc tế, `grp-p7-015` Thông báo nâng cấp khách sạn + Email đặt phòng + Đánh giá của khách hàng doanh nghiệp), tổng cộng 13 tài liệu công sở liên kết logic chặt chẽ; 9 câu hỏi tổng hợp thông tin đa văn bản (`cross_text_synthesis`, `crossTextReference: true`), phân bố đáp án cân bằng (A: 6, B: 6, C: 6, D: 7; tổng Part 7 A: 13, B: 13, C: 14, D: 14), 100% trích dẫn bằng chứng văn bản cụ thể và giải thích chi tiết tiếng Việt. Nâng tổng Reading Bank lên **100 câu và 19 groups**, và Question Bank toàn dự án lên **204 câu và 42 groups**. Kiểm định **44/44 contract tests passed** (tổng hợp toàn dự án **2,923/2,923 tests passed**).
- ✅ **ExamForm Assembly, Media Readiness & Registry (Full Mock Phase 9):** Lắp ráp thành công đề thi mẫu chuẩn ETS 200 câu đầu tiên (`CANONICAL_ETS_EXAM_FORM_01`, `ets-mock-form-01`, `ETS-2026-SIM-01`) từ Question Bank: 100 câu Listening (P1: 6, P2: 25, P3: 39/13 grps, P4: 30/10 grps) + 100 câu Reading (P5: 30, P6: 16/4 grps, P7: 54/15 grps: 29 Single/10 grps + 25 Multiple/5 grps), thứ tự tuần tự nghiêm ngặt từ 1 đến 200, 42 groups toàn vẹn, tính fingerprint nội dung bất biến. Xây dựng động cơ kiểm định tài nguyên truyền thông (`mediaReadiness.ts`): kiểm tra toàn diện tranh vẽ SVG Part 1, kịch bản audio A-D, hội thoại/bài nói Part 3-4, ngữ cảnh đồ họa context, ước lượng thời lượng Listening (~2,337s ~39.0 phút vs 45 phút target ETS). Phân loại 4 bậc trạng thái rõ ràng (`invalid`, `content-ready`, `simulation-ready`, `strict-ready`). Đề thi đạt chuẩn **Simulation-Ready** (100% kịch bản âm thanh và tranh minh họa); khóa minh bạch chế độ **Strict Mock** (`strictLocked: true`) kèm giải trình chi tiết. Hệ thống Registry quản lý đề thi (`examFormRegistry.ts`), bảo vệ hạ cấp content revision và compiler động `compileStandardExamForm`. Kiểm định **46/46 targeted test cases passed** (tổng hợp toàn dự án **2,969/2,969 tests passed**).
- ✅ **Exam Session State Machine & Persistence Engine (Full Mock Phase 10):** Xây dựng pure state machine engine 9 trạng thái (`preflight` -> `ready` -> `listening` -> `reading` -> `submitted` kèm các nhánh `interrupted`, `recovery-required`, `invalid`, `media-failed`). Quản lý phiên làm bài 200 câu độc lập khỏi React components. Thực thi toàn diện các quy tắc biên giới phòng thi: chống double-start, chuyển Listening -> Reading một chiều, Strict Mode khóa điều hướng và cấm sửa đáp án phần Nghe khi đã vào phần Đọc, khóa đáp án vĩnh viễn sau submit, loại bỏ stale callbacks, an toàn React StrictMode (idempotent reload), bảo vệ chống ghi đè phiên dở dang (`UNFINISHED_SESSION_EXISTS`). Bộ điều hợp lưu trữ LocalStorage ngoại tuyến (`examSessionStorage.ts`) hoàn toàn tách biệt khỏi `toeic_mastery_data_v2_cold` và Practice storage, chỉ lưu dữ liệu tinh gọn (Zero-Copy), bẫy lỗi quota, phục hồi và tự động tính hạn giờ wall-clock khi F5/đóng trình duyệt. Kiểm định **145/145 unit assertions passed** (tổng hợp toàn dự án **3,114/3,114 tests passed**).
- ✅ **Exam Timer Engine, Section Transition & Multi-Tab Safety (Full Mock Phase 11):** Triển khai đồng hồ phòng thi bất biến wall-clock (Listening 45m, Reading 75m, Overall 120m) không phụ thuộc `setInterval(seconds--)`, miễn nhiễm với F5/tab sleep/throttling; tự động chuyển phần thi đúng 1 lần (`listening` -> `reading`), kích hoạt hook ngắt âm thanh Audio Engine khi hết Listening; tự động nộp bài khi hết hạn Reading (`timeout_reading`) hoặc tổng thời gian (`timeout_overall`); bảo vệ chống xung đột tương tranh giữa manual click và auto-timeout (Idempotency). Hệ thống điều phối đa tab độc quyền qua Single-Writer Lease (`toeic_exam_active_lease_v1`) kết hợp BroadcastChannel bus, tự động giáng cấp tab phụ về `read_only_conflict`, cơ chế heartbeat (1.5s) và lease TTL (5s), cho phép chiếm quyền an toàn (Takeover) và chặn stale background tabs ghi đè LocalStorage (`TAB_CONFLICT`). Phát hiện thay đổi giờ hệ thống (lùi giờ >5s hoặc nhảy cóc >24h) và gắn cờ `isClockTampered` minh bạch. Kiểm định **84/84 fake-clock assertions passed** (tổng hợp toàn dự án **3,198/3,198 tests passed**).
- ✅ **Strict Listening Audio Engine (Full Mock Phase 12):** Triển khai động cơ âm thanh Listening chuẩn phòng thi và mô phỏng học tập độc lập khỏi UI (`StrictListeningAudioEngine`): biên dịch 58 đơn vị âm thanh chuẩn mực tuần tự tuyến tính (P1 Dir + 6 Qs, P2 Dir + 25 Qs, P3 Dir + 13 Grps, P4 Dir + 10 Grps), tích hợp directions chính thức ETS và khoảng nghỉ tiêu chuẩn; khóa cứng tốc độ 1.0x, cấm seek, cấm replay, cấm pause tùy ý trong Strict Mode; không để lộ transcript/answer key trong quá trình phát; cô lập hoàn toàn luồng phát khỏi thao tác di chuyển trên answer sheet (lướt câu hỏi không làm nhảy hay lặp audio); đồng bộ ngắt tức thì khi hết 45 phút Listening; bảo vệ token guard loại bỏ 100% stale callbacks; xử lý autoplay restrictions; dọn dẹp triệt để tài nguyên âm thanh (zero leaks); gắn cờ đứt quãng bất thường (`timelineAbnormal: true`) khi F5 trong Strict Mode; hỗ trợ Simulation Mode minh bạch bằng Web Speech API và cấm tự mở khóa Strict Mode bằng fallback TTS (`STRICT_MODE_LOCKED`). Kiểm định **66/66 assertions passed** (`npm run test:exam-audio`, tổng hợp toàn dự án **3,264/3,264 tests passed**).
- ✅ **Exam Library Hub, Instructions & Preflight Check (Full Mock Phase 13):** Hoàn thiện toàn bộ các màn hình và logic kiểm tra tiền phòng thi: Thư viện đề thi Full Mock Hub độc lập (`ExamLibraryHub.tsx`), hiển thị danh mục đề thi thực tế từ registry (`ets-mock-form-01`), số câu 200, thời lượng 120 phút (Listening 45m / Reading 75m), huy hiệu Simulation-Ready / Strict-Locked minh bạch, nhận diện và xử lý phiên thi dở dang (Resume / Discard), xem lịch sử thi thật. Hộp thoại phổ biến quy chế thi chuẩn ETS 4 phần chuyên sâu (`ExamInstructionsModal.tsx`). Động cơ kiểm tra kỹ thuật trực tiếp 7 hạng mục (`examPreflightChecker.ts` & `ExamPreflightModal.tsx`): kiểm định cấu trúc 200 câu, media readiness, browser capabilities (Audio/Speech), storage read/write, active session, multi-tab lease, và runner thử âm thanh (Sound Check) mở khóa autoplay; khóa cứng nút Start khi chưa đạt kiểm định và chưa có xác nhận từ người dùng. Kiểm định **40/40 assertions passed** (`npm run test:exam-preflight`, tổng hợp toàn dự án **3,304/3,304 tests passed**).
- ✅ **Exam Listening Workspace & Unified Answer Sheet 200 Câu (Full Mock Phase 14):** Xây dựng không gian phòng thi chuyên biệt cho phần thi Nghe và Phiếu trả lời tổng hợp 200 câu:
  - Bố cục phòng thi chuẩn mực tách rời (`ExamWorkspaceHeader.tsx`, `ExamAudioBar.tsx`, `ExamWorkspace.tsx`, `ExamSubmitModal.tsx`).
  - Ma trận phiếu trả lời 200 câu (`ExamAnswerSheet.tsx`) phân tách Listening (1–100) và Reading (101–200), hiển thị 7 Parts, 5 trạng thái ô câu hỏi (`current`, `answered`, `unanswered`, `flagged`, `locked`), tối ưu memoized re-render (`React.memo`), bộ lọc All/Unanswered/Flagged, và thực thi nghiêm ngặt kỷ luật khóa câu hỏi (khóa Reading khi thi Listening, khóa vĩnh viễn Listening khi vào Reading, khóa ngoài phạm vi audio track đang phát trong Strict Mode).
  - Question Renderers chuyên biệt: Part 1 tranh SVG ẩn transcript, Part 2 nghiêm ngặt 3 phương án A-C ẩn prompt text, Part 3 nhóm 3 câu kèm context graphic, Part 4 nhóm 3 câu bài nói kèm graphic.
  - Luồng âm thanh liên tục không ngắt quãng (Audio Continuity): Không tự phát lại audio khi đổi phương án hoặc render lại component.
  - Màn hình chuyển tiếp Reading Hold rõ ràng khi kết thúc Listening (giữ ranh giới sạch cho Phase 15 Reading Renderer).
  - Kiểm định targeted tests **565/565 assertions passed** (`npm run test:exam-workspace`, tổng hợp toàn dự án **3,869/3,869 tests passed**).
- ✅ **Exam Reading Workspace & Section Navigation (Full Mock Phase 15):** Hoàn thiện không gian phòng thi chuyên biệt cho phần thi Đọc (Reading Part 5–7, câu 101–200) và điều hướng phần Reading:
  - Question Renderers chuyên biệt: Part 5 incomplete sentences với inline blank preview đáp án đã chọn; Part 6 bố cục chia đôi với 4 vị trí blank interactive `[131]`..`[134]` kết nối chính xác với câu hỏi; Part 7 hỗ trợ toàn diện Single, Double, Triple Passages với thanh chuyển nhanh, nhận diện câu hỏi tổng hợp đa văn bản (Cross-Text Synthesis).
  - Tự do điều hướng trong phạm vi câu 101–200 qua Answer Sheet, thanh điều hướng hoặc phím mũi tên.
  - Sửa đáp án và gắn cờ xem lại linh hoạt trước khi nộp bài.
  - Kỷ luật Strict Mode cấm quay lại câu 1–100 khi đang ở Reading (`STRICT_NAVIGATION_BLOCKED`, `STRICT_SECTION_LOCKED`).
  - Đồng hồ độc lập 75 phút tự động nộp bài khi hết giờ (`timeout_reading`).
  - Nộp bài chủ động qua hộp thoại xác nhận `ExamSubmitModal` với kiểm toán đầy đủ câu làm / bỏ trống / cờ.
  - Kiểm định targeted tests **584/584 assertions passed** (`npm run test:exam-reading`, tổng hợp toàn dự án **4,453/4,453 tests passed**).
- ✅ **Exam Submission, Scoring Engine & History Persistence (Full Mock Phase 16):**
  - Động cơ chấm điểm toán học thuần túy (`examScoringEngine.ts`): Tính điểm Listening (0–100), Reading (0–100), Total (0–200), độ chính xác (accuracy %), thống kê chi tiết Part 1–7. Bảo đảm bất biến tuyệt đối `correct + incorrect + unanswered === 200` qua `validateScoreTotals`. Không trừ điểm câu sai, không tự điền câu bỏ trống.
  - Thẩm định tính toàn vẹn phiên thi (`evaluateResultIntegrity`): Tự động tước chứng chỉ Strict Mode (`isStrictCertified: false`, `isStrictValid: false`) khi phát hiện đứt quãng âm thanh (`audioDisrupted`) hoặc sai lệch đồng hồ (`isClockTampered`).
  - Ước tính điểm chuẩn ETS dựa trên empirical equating table (`scoreConverter.ts`) kèm nhãn phương pháp giáo dục và giới hạn rõ ràng; bảo vệ nguyên vẹn hồ sơ người dùng trong LocalStorage `toeic_mastery_data_v2_cold` (zero overwrite).
  - Bộ điều phối nộp bài an toàn Idempotent (`examSubmissionCoordinator.ts`): Ngăn chặn double-click, xung đột auto/manual timeout, khóa in-flight submit lock, đóng băng snapshot đáp án bất biến, bảo đảm lưu trữ nguyên tử (atomic persistence) vào `toeic_exam_result_v1_${sessionId}` và `toeic_exam_history_v1`, bẫy lỗi quota bộ nhớ với khả năng retry phục hồi.
  - Lưu trữ lịch sử thi độc lập nhiều lần làm bài (Multi-Attempt Retake Isolation): Mỗi lần thi sinh ra một Session ID riêng biệt, theo dõi content revision, không ghi đè attempts trước đó, không tái sử dụng answers cũ.
  - Giao diện nộp bài kết thúc phòng thi (`ExamWorkspace.tsx`): Hiển thị điểm raw, điểm ước tính kèm disclaimer, ma trận chi tiết Part 1–7, thời gian làm bài, huy hiệu kiểm định toàn vẹn và thông báo lưu trữ an toàn.
  - Kiểm định targeted tests **125/125 assertions passed** (`npm run test:exam-scoring`, tổng hợp toàn dự án **4,578/4,578 tests passed**).
- ✅ **Exam Results Dashboard, 200-Question Answer Review & History UI (Full Mock Phase 17):**
  - Result Dashboard (`ExamResultDashboard.tsx`): Trình bày trung thực kết quả bài thi từ bản ghi thật; hiển thị ExamForm metadata, ngày thi, thời gian làm bài, integrity audit, điểm raw Total/Listening/Reading, tỷ lệ phân bổ Đúng/Sai/Bỏ trống, ma trận Part 1–7 trực quan, điểm mạnh/yếu, bẫy thi thường gặp, chủ đề cần cải thiện; thang điểm ước tính ETS 10–990 có giải thích phương pháp và disclaimer giáo dục; tuyệt đối không tạo biểu đồ xu hướng giả mạo.
  - 200-Question Answer Review (`ExamAnswerReview.tsx`): Chữa bài chi tiết cho toàn bộ 200 câu hỏi từ snapshot đóng băng không thể sửa đổi (Strictly Read-Only); bộ lọc đa chiều (All, Correct, Incorrect, Unanswered, Flagged, Part 1–7); ma trận 200 ô tròn tương tác; điều hướng nhanh câu làm sai (Next/Prev Wrong với wrap-around tuần hoàn); bảo toàn toàn bộ ngữ cảnh gốc (tranh vẽ SVG Part 1, script & Web Speech API TTS replay Part 2/3/4, graphic context, bài đọc điền từ Part 6 với ô trống tương tác, bài đọc đơn/kép/ba Part 7 với trích dẫn evidence và huy hiệu tổng hợp đa văn bản); cơ chế phòng vệ tương thích revision (`checkExamFormCompatibility`) cảnh báo trung thực khi đề thi thiếu hoặc lệch revision.
  - Multi-Attempt History UI (`ExamHistoryModal.tsx`): Quản lý và tra cứu nhiều lượt thi từ `getExamHistory()`, phân biệt lượt thi hoàn thành hợp lệ vs gián đoạn; phân tích so sánh delta giữa các lượt làm bài trên cùng một đề thi; đính kèm biểu ngữ cảnh báo thận trọng bắt buộc về **Hiệu Ứng Luyện Tập / Nhớ Đề (Practice Effect)**; kích hoạt xem lại và chữa bài chi tiết cho từng lần thi đã lưu.
  - Điều phối không gian làm việc (`ExamResultWorkspace.tsx`): Tích hợp liền mạch nút xem kết quả từ màn hình nộp bài trong `ExamWorkspace` và từ danh sách lịch sử trong `ExamLibraryHub`.
  - Kiểm định targeted tests **65/65 assertions passed** (`npm run test:exam-review`, tổng hợp toàn dự án **4,643/4,643 tests passed**).

### 2. Hạn chế kỹ thuật & Nợ kỹ thuật đã biết (Known Technical Debts)
1. **Dung lượng Bundle JavaScript (`index-DRfUeNPr.js` ~865 KB):**
   - *Nguyên nhân:* Các thư viện `recharts`, `lucide-react`, và `canvas-confetti` đang được import tĩnh trong cùng một bundle chính.
   - *Hướng tối ưu tiếp theo:* Áp dụng `React.lazy()` và `Suspense` để Dynamic Import các tab ít dùng ngay lập tức (như `TestLogView`, `TimerHub`, `GrammarAndTraps`).
2. **Cảnh báo Linter (`oxlint`):**
   - Hiện tại `npm run lint` hoàn thành với 0 errors nhưng còn 132 warnings (toàn bộ là các biến icon chưa dùng `no-unused-vars` từ mã nguồn cũ). Không có bất kỳ cảnh báo nào trong các file mới thuộc Practice/Audio/Reading/ExamForm Engine.
3. **Web Speech API phụ thuộc trình duyệt và OS:**
   - Chất lượng phát âm Web Speech API phụ thuộc vào voices được cài trên hệ điều hành của người dùng. Trên Windows và macOS có sẵn Microsoft David/Zira hoặc Apple Samantha/Daniel chất lượng cao; trên một số bản phân phối Linux có thể cần cài thêm speech-dispatcher hoặc gói TTS tiếng Anh. Đã cung cấp banner cảnh báo minh bạch trên UI rằng đây là âm thanh mô phỏng TTS, không phải bản thu phòng thi ETS.
4. **Khóa Chế Độ Strict Mock (Strict Mode Deliberately Locked):**
   - *Hiện trạng:* Kho lưu trữ hoạt động hoàn toàn Offline-First và Zero-Cloud Backend, hiện chưa tích hợp các file âm thanh phòng thu (prerecorded audio files) cho 54 kịch bản Listening (Part 1: 6, Part 2: 25, Part 3: 13, Part 4: 10).
   - *Xử lý minh bạch:* Hệ thống không sử dụng file rỗng hay silent filler để tạo cảm giác hoàn thiện giả tạo. Chế độ Strict Mock bị khóa cứng (`strictLocked: true`) với lý do giải trình rõ ràng (`lockReason`). Toàn bộ 100% kịch bản âm thanh, transcript và ảnh SVG sẵn sàng 100% cho chế độ **Simulation Mode** (sử dụng Web Speech API).


### 3. Kế hoạch công việc tiếp theo được đề xuất (Roadmap)

| Ưu tiên | Nhiệm vụ | Chi tiết thực hiện |
|:---:|---|---|
| **P1** | **Phase 9 — Scoring, Results, Review & Practice History** | Chấm điểm độc lập, phân tích độ chính xác, phân biệt bài làm tự lực vs có trợ giúp, lưu trữ kết quả và xem lại chi tiết bài làm. |
| **P1** | **Phase 10 — Practice Engine System Integration** | Tích hợp sâu kết quả luyện tập vào Dashboard (Radar chart, Stats), Mistake Notebook (Sổ tay lỗi sai) và Vocabulary Vault. |
| **P1** | **Phase 11 — Final QA, Regression, Performance & Documentation** | Kiểm thử hồi quy toàn diện 7 Parts, kiểm tra hiệu năng, tối ưu bundle và hoàn tất bộ tài liệu bàn giao. |
| **P2** | Dọn dẹp Unused Imports | Tinh chỉnh các file `CommandCenter.tsx`, `TestLogView.tsx`, `VocabVault.tsx` để đưa cảnh báo `oxlint` về 0 warnings. |
| **P2** | Code Splitting với `React.lazy` | Tách các view chính thành chunks riêng biệt để giảm kích thước bundle ban đầu xuống dưới 250 KB. |
| **Cao (P1)** | Tách nhỏ State Context | Tách `useApp` thành các hook nhỏ hơn (ví dụ: `useVocab`, `useTestLogs`, `useRoadmap`) để giảm thiểu số lần re-render không cần thiết của các component con. |
| **Trung bình (P2)** | Code Splitting với `React.lazy` | Tách các view chính thành chunks riêng biệt để giảm kích thước bundle ban đầu xuống dưới 250 KB. |
| **Trung bình (P2)** | Hỗ trợ Xuất/Nhập CSV cho Vocab | Mở rộng tính năng nhập từ vựng hỗ trợ trực tiếp tệp tin `.csv` tải lên thay vì chỉ paste text. |
| **Thấp (P3)** | Thêm ngân hàng đề Full Test | Mở rộng ngân hàng câu hỏi đề thi thử đầy đủ 200 câu cho người học muốn làm bài trực tiếp trên web. |

---

## BẢO TRÌ TÀI LIỆU
Mọi thay đổi mã nguồn trong tương lai **bắt buộc** phải tuân theo quy trình cập nhật tài liệu đã được quy định tại [`AGENTS.md`](file:///c:/Users/hoang/.gemini/antigravity-ide/scratch/toeic-mastery-hub/AGENTS.md).
