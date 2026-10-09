# CHANGELOG — NHẬT KÝ THAY ĐỔI DỰ ÁN TOEIC MASTERY HUB

Tất cả các thay đổi đáng chú ý của dự án **TOEIC Mastery Hub** sẽ được ghi lại trong tài liệu này.  
Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/vi/1.0.0/) và tuân thủ nguyên tắc ghi nhận thực tế, trung thực với mã nguồn.

## [2.25.0-phase17-results-review] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 17 — Exam Results & Answer Review (Giao Diện Bảng Kết Quả, Chữa Bài Chi Tiết 200 Câu & Lịch Sử Thi Nhiều Lượt)**

### Mục tiêu
Xây dựng toàn diện giao diện kết quả thi và chữa bài dựa trên `ExamResult` và `ExamHistoryEntry` đã được đóng băng và lưu trữ thực tế sau Phase 16:
- **Result Dashboard:**
  - Hiển thị thông tin thực tế: ExamForm ID, số thứ tự attempt, ngày thi, thời lượng làm bài thực tế, chế độ thi (Simulation / Strict), và huy hiệu thẩm định tính toàn vẹn (Integrity Status).
  - Thẻ điểm Raw (Total, Listening, Reading raw correct), số câu làm sai, số câu chưa trả lời và tỷ lệ chính xác (Accuracy %).
  - Phân tích chi tiết ma trận 7 phần Part 1–7 với thanh đo trực quan % chính xác.
  - Nhận diện điểm mạnh (Strengths $\ge 75\%$), điểm trung bình (Moderate 50–74%) và điểm yếu (Weaknesses $< 50\%$).
  - Phân tích bẫy thi thường gặp (ETS Traps Encountered) và các chủ đề cần cải thiện (Topics to Improve).
  - Thang điểm ước tính ETS (Estimated Scaled Score: 10–990) dán nhãn phương pháp rõ ràng kèm thông báo giới hạn minh bạch (phục vụ mục đích học tập tham khảo, không thay thế bảng điểm chính thức do ETS/IIG cấp).
  - Tuyệt đối không biến một lần thi đơn lẻ thành biểu đồ xu hướng giả mạo.
- **200-Question Answer Review:**
  - Hiển thị đủ 200 câu hỏi từ snapshot đã đóng băng, tuyệt đối ở chế độ chỉ đọc (Strictly Read-Only: không thể chỉnh sửa đáp án đã chốt hay can thiệp điểm số).
  - Mỗi câu hỏi hiển thị đầy đủ: câu hỏi gốc, lựa chọn của người học, đáp án đúng, trạng thái Đúng/Sai/Bỏ trống, lời giải chi tiết, phân tích bẫy và tags chủ đề.
  - Bảo toàn toàn vẹn ngữ cảnh:
    - Part 1: Tranh vẽ SVG nguyên gốc.
    - Part 2: 3 phương án A-C kèm transcript và công cụ nghe lại qua Web Speech API TTS replay.
    - Part 3/4: Ngữ cảnh graphic (sơ đồ/bảng biểu), transcript phân vai và công cụ nghe lại TTS.
    - Part 6: Bố cục chia đôi (Split layout) với 4 ô trống liên kết và nhãn phương án đã chọn.
    - Part 7: Văn bản đơn/kép/ba với trích dẫn bằng chứng (evidence) và huy hiệu tổng hợp đa văn bản.
  - Bộ lọc đa tiêu chí: Tất cả (`all`), Đúng (`correct`), Sai (`incorrect`), Chưa làm (`unanswered`), Có cờ (`flagged`), và lọc theo từng Part 1–7.
  - Điều hướng nhanh câu làm sai (Next/Prev Wrong) với vòng lặp tuần hoàn (wrap-around).
  - Cơ chế phòng vệ tương thích revision (`checkExamFormCompatibility`): Nếu đề thi bị xóa khỏi registry hoặc lệch `contentRevision`, hiển thị cảnh báo thiếu dữ liệu / ưu tiên snapshot đóng băng thay vì chữa nhầm sang đề mới.
- **Multi-Attempt History UI:**
  - Đọc dữ liệu lịch sử thi thật từ `getExamHistory()`.
  - Phân biệt rõ các lần thi hoàn thành hợp lệ với các lần thi gián đoạn / invalid.
  - So sánh tiến bộ giữa 2 lần thi gần nhất trên cùng một ExamForm (Delta Raw Score, Delta Scaled Score, Delta Accuracy, Delta Duration).
  - Hiển thị biểu ngữ cảnh báo thận trọng bắt buộc về **Hiệu Ứng Luyện Tập / Nhớ Đề (Practice Effect / Test-Retest Memory Effect)**: Thí sinh làm lại cùng một đề thi thường có điểm số cao hơn do đã ghi nhớ nội dung và bẫy đề từ trước, không hoàn toàn phản ánh sự gia tăng năng lực ngôn ngữ thực tế.
  - Nút mở giao diện Xem lại & Chữa bài chi tiết cho từng attempt đã lưu.
- **Điều Phối Không Gian Làm Việc:**
  - `ExamResultWorkspace.tsx` điều phối chuyển đổi giữa 2 tab: Tổng Quan Kết Quả (Dashboard) và Chữa Bài 200 Câu (Review).
  - Tích hợp nút xem lại trực tiếp từ màn hình nộp bài trong `ExamWorkspace.tsx` và từ danh sách lịch sử trong `ExamLibraryHub.tsx`.
- **Ranh giới:** CHỈ xây dựng giao diện kết quả và chữa bài dựa trên ExamResult/History đã được lưu thật. Tuyệt đối không tạo lịch sử giả hay biểu đồ xu hướng giả.

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/types/examReview.ts`:
  - Định nghĩa domain types cho phân hệ Results & Review: `ExamReviewStatusFilter`, `ExamReviewPartFilter`, `ExamStrengthWeaknessAnalysis`, `ExamTopicPerformance`, `ExamTrapPerformance`, `ExamAttemptComparison`, `ExamResultWorkspaceTab`, `ExamResultWorkspaceProps`.
- `src/utils/examReviewAnalysis.ts`:
  - Động cơ phân tích thuần túy (Pure Analysis Engine):
    - `analyzeExamStrengthsAndWeaknesses`: Phân loại điểm mạnh ($\ge 75\%$), điểm trung bình (50–74%), điểm yếu ($< 50\%$), thống kê câu hỏi theo topic và dạng bẫy.
    - `compareExamAttempts`: Tính toán delta giữa 2 lượt thi (raw score, scaled score, accuracy, duration) và đính kèm văn bản cảnh báo thận trọng `CAUTIOUS_TEST_RETEST_ADVISORY`.
    - `filterReviewItems`: Lọc 200 câu hỏi theo trạng thái (all, correct, incorrect, unanswered, flagged) và Part 1–7.
    - `findAdjacentWrongQuestion`: Tìm câu làm sai kế tiếp/trước đó với cơ chế wrap-around tuần hoàn.
    - `checkExamFormCompatibility`: Kiểm tra tính tương thích giữa snapshot kết quả và ExamForm trong registry.
- `src/components/Exam/Results/ExamResultDashboard.tsx`:
  - Giao diện bảng điều khiển kết quả toàn diện: ExamForm metadata, ngày thi, thời gian, badges kiểm định toàn vẹn, thẻ điểm raw (Total, Listening, Reading), phân bổ đáp án đúng/sai/chưa làm, thang điểm ước tính ETS (10–990) kèm nhãn phương pháp giáo dục và disclaimer, ma trận năng lực Part 1–7 trực quan, danh sách điểm mạnh/yếu, bẫy đề thi hay gặp, chủ đề cần cải thiện, nút chuyển sang Chữa bài chi tiết.
- `src/components/Exam/Results/ExamAnswerReview.tsx`:
  - Giao diện chữa bài chi tiết 200 câu từ snapshot đóng băng không thể sửa đổi (Strictly Read-Only).
  - Bộ lọc linh hoạt trạng thái và Part 1–7, ma trận 200 ô tròn tương tác, điều hướng nhanh câu làm sai (Next/Prev Wrong).
  - Bảo toàn trọn vẹn ngữ cảnh: tranh vẽ SVG Part 1, script & Web Speech API TTS replay Part 2/3/4, graphic context, bài đọc Part 6 với 4 ô trống tương tác, bài đọc Part 7 đơn/kép/ba với trích dẫn evidence và badge tổng hợp đa văn bản; cảnh báo lệch revision minh bạch.
- `src/components/Exam/Results/ExamHistoryModal.tsx`:
  - Hộp thoại tra cứu lịch sử thi nhiều lượt từ `getExamHistory()`, phân biệt lượt thi hoàn thành hợp lệ vs gián đoạn; so sánh tiến bộ delta giữa 2 lần thi gần nhất trên cùng một đề kèm biểu ngữ cảnh báo thận trọng Practice Effect; nút mở chữa bài chi tiết cho từng attempt.
- `src/components/Exam/Results/ExamResultWorkspace.tsx`:
  - Component điều phối chuyển đổi giữa 2 tab: Dashboard và Answer Review, sticky navigation header, nút quay lại thư viện đề thi.
- `src/components/Exam/Results/index.ts`:
  - Barrel export cho phân hệ Results & Review.
- `src/utils/__tests__/examResultAndReview.test.ts`:
  - Bộ 65 targeted unit & invariant tests kiểm định 11 test suites độc lập: lọc theo trạng thái, lọc theo Part, điều hướng nhanh câu sai kế tiếp/trước đó với wrap-around, kiểm tra tương thích revision, phân tích điểm mạnh/yếu, bài thi all blank (0/200), bài thi all correct (200/200), bài thi all wrong (0/200), tính bất biến dữ liệu snapshot trong quá trình review, so sánh 2 lần thi retake và dán nhãn thận trọng về hiệu ứng nhớ đề, và phân loại tính hợp lệ integrity badge.

#### Changed
- `src/types/index.ts`: Re-export `examReview`.
- `src/components/Exam/index.ts`: Re-export `./Results`.
- `src/components/Exam/ExamLibraryHub.tsx`: Tích hợp `ExamHistoryModal` và `ExamResultWorkspace`.
- `src/components/Exam/Workspace/ExamWorkspace.tsx`: Tích hợp nút xem lại trực tiếp sang `ExamResultWorkspace` từ màn hình kết quả sau khi nộp bài.
- `package.json`: Bổ sung lệnh `test:exam-review` và tích hợp vào chuỗi kiểm định toàn diện `test:validation`.
- `docs/FILE_INDEX.md`: Cập nhật phiên bản hệ thống lên `2.25.0-phase17-results-review`, bổ sung 8 file mới vào bảng danh mục và sơ đồ kiến trúc liên kết.
- `README.md`: Cập nhật phiên bản tài liệu lên `2.25.0-phase17-results-review`, bổ sung Module 23 (Feature Catalog), cập nhật bảng lệnh NPM Scripts và mục ghi chú chuyển giao.

#### Fixed
- Điều chỉnh hàm `findAdjacentWrongQuestion` trong `examReviewAnalysis.ts` để lọc chính xác câu hỏi làm sai (`!isCorrect && !isUnanswered`), tách biệt với câu hỏi bỏ trống chưa làm, bảo đảm wrap-around tuần hoàn chính xác giữa câu sai đầu tiên và câu sai cuối cùng.
- Loại bỏ các biến imports chưa sử dụng (`ShieldCheck`, `AlertTriangle`) trong `ExamResultDashboard.tsx` để bảo đảm chuẩn mực linter sạch.

---

### Kết quả kiểm định & Đóng gói sản phẩm
- **Biên dịch TypeScript & Build:** `npm run build` (`tsc -b && vite build`) hoàn thành thành công 100%, 0 lỗi cú pháp.
- **Kiểm tra mã nguồn (Linter):** `npm run lint` hoàn thành với 0 errors trên toàn bộ 130 files.
- **Unit & Invariant Tests (Targeted Phase 17):** `npm run test:exam-review` đạt **65/65 assertions passed (100%)** qua 11 test suites.
- **Kiểm thử toàn diện toàn dự án:** `npm run test:validation` đạt **4,643/4,643 assertions passed (100%)** qua 23 test suites.

---

### Các vấn đề còn tồn tại & Handoff Notes
1. **Dữ Liệu Thật & Không Biến Tướng Xu Hướng:** Hệ thống chỉ phân tích và hiển thị kết quả từ dữ liệu thi thực tế đã lưu; tuyệt đối không tạo biểu đồ xu hướng giả mạo khi chỉ có 1 lần thi.
2. **Review Chế Độ Chỉ Đọc Tuyệt Đối:** Giao diện Answer Review không chứa bất kỳ cơ chế nào cho phép sửa đáp án đã nộp hoặc tính toán lại điểm số sau khi bài thi đã được chốt.
3. **Cảnh Báo Thận Trọng Về Hiệu Ứng Nhớ Đề:** So sánh giữa các lần thi trên cùng một đề thi bắt buộc hiển thị biểu ngữ cảnh báo về hiệu ứng nhớ đề/luyện tập lặp lại (`Practice Effect`).
4. **Bảo Toàn Cold Storage:** Toàn bộ dữ liệu kết quả và lịch sử thi được lưu trữ độc lập tại `toeic_exam_result_v1_${sessionId}` và `toeic_exam_history_v1`, hoàn toàn không can thiệp hay ghi đè khóa lưu trữ `toeic_mastery_data_v2_cold`.

---

## [2.24.0-phase16-submission-scoring] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 16 — Exam Submission, Scoring Engine & History Persistence (Điều Phối Nộp Bài Idempotent, Động Cơ Chấm Điểm 200 Câu & Lưu Trữ Lịch Sử Thi Nhiều Lượt)**

### Mục tiêu
Triển khai toàn diện quy trình finalize bài thi, scoring engine và lưu trữ exam history cho kỳ thi thử ETS 120 phút / 200 câu sau Phase 15:
- **Idempotent Submission:**
  - Hỗ trợ Manual Submit, Auto Submit khi hết 75 phút Reading (`timeout_reading`), và Submit khi resume sau deadline.
  - Một Session ID chỉ được finalize một lần (Idempotent Submission).
  - Quy trình finalize tuần tự 6 bước chuẩn mực:
    1. Đóng băng answer snapshot bất biến tại thời điểm nộp bài.
    2. Khóa phiên thi (trạng thái `submitted`).
    3. Chấm theo answer key chính thức của đề thi.
    4. Tổng hợp kết quả toàn diện (raw score, accuracy, Part 1–7 breakdown, integrity status, scaled estimate).
    5. Lưu kết quả chi tiết (`toeic_exam_result_v1_${sessionId}`) và lịch sử (`toeic_exam_history_v1`) an toàn vào LocalStorage.
    6. Trả trạng thái thành công chỉ sau khi persistence thực sự hoàn tất (không đánh dấu lưu kết quả thành công giả).
  - Xử lý triệt để double-click, timeout race, React StrictMode re-run, stale callbacks, storage failure (bẫy quota & rollback an toàn) và multi-tab races.
  - Nếu lưu trữ thất bại, giữ nguyên dữ liệu bài làm và trả cờ `isRecoverable: true` cho phép học viên thử lưu lại.
- **Scoring Engine Toán Học:**
  - Mở rộng kiến trúc chấm điểm thuần túy (Pure Function) cho cấu trúc Full Mock 200 câu.
  - Tính toán chi tiết:
    - Listening correct: 0–100.
    - Reading correct: 0–100.
    - Total correct: 0–200.
    - Thống kê độc lập số câu đúng (`correct`), sai (`incorrect`), và bỏ trống (`unanswered`).
    - Tỷ lệ chính xác (Accuracy %) cho Listening, Reading và Total.
    - Phân tích chi tiết từng phần Part 1–7 (correct, incorrect, unanswered, accuracy).
    - Thời gian làm bài thực tế (`durationSeconds`), cờ xem lại (`flaggedCount`), và thẩm định tính toàn vẹn (`integrity`).
  - Bất biến toán học tuyệt đối: `correct + incorrect + unanswered === 200` cho cả Listening, Reading và Total (kiểm định qua `validateScoreTotals`).
  - Quy chế chấm thi: Không trừ điểm đáp án sai, không tự điền câu bỏ trống.
  - Thẩm định toàn vẹn nghiêm ngặt: Bài thi bị media interruption hoặc clock tampering tự động bị tước chứng chỉ Strict Mode hợp lệ.
- **Estimated Scaled Score Minh Bạch:**
  - Sử dụng mô hình quy đổi thực nghiệm `convertScoreToETS` (`scoreConverter.ts`) ước tính điểm ETS (Listening 5–495, Reading 5–495, Total 10–990).
  - Gắn nhãn phương pháp rõ ràng: `"ETS Empirical Equating Table Model (Educational Estimate)"`.
  - Cung cấp thông báo giới hạn minh bạch: *Điểm số ước tính dựa trên bảng quy đổi thực nghiệm phục vụ mục đích học tập; không thay thế bảng điểm chính thức do ETS/IIG cấp*.
  - Bảo vệ dữ liệu người dùng: Tuyệt đối không ghi đè điểm thi chính thức hoặc điểm tự báo cáo trong hồ sơ cá nhân (`toeic_mastery_data_v2_cold`).
- **Exam History Lưu Trữ Độc Lập:**
  - Cho phép lưu trữ nhiều lần thi (Attempts) độc lập cho cùng một ExamForm.
  - Mỗi lượt thi sở hữu Session ID riêng, ghi nhận `formRevision`, ngày/giờ thi, chế độ (simulation/strict), trạng thái toàn vẹn, raw score, accuracy, thời lượng làm bài và scaled estimate.
  - Thi lại (Retake) tạo session mới hoàn toàn, không ghi đè attempts cũ, không tái sử dụng answers cũ. Không tạo lịch sử giả.
- **Ranh giới:** CHỈ triển khai finalize, chấm điểm và lưu lịch sử. Chưa xây dựng Results/Review UI chi tiết hoặc tích hợp Dashboard (dành cho các Phase tiếp theo).

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/utils/examScoringEngine.ts`:
  - Động cơ chấm điểm toán học thuần túy: `scoreExamSession`, `evaluateResultIntegrity`, `createExamHistoryEntry`, `validateScoreTotals`, hằng số `PART_QUESTION_COUNTS` (P1: 6, P2: 25, P3: 39, P4: 30, P5: 30, P6: 16, P7: 54).
  - Xác thực nghiêm ngặt bất biến 200 câu (`correct + incorrect + unanswered === 200`).
  - Ước tính điểm chuẩn ETS scaled score kèm nhãn phương pháp và cảnh báo giáo dục rõ ràng.
- `src/utils/examSubmissionCoordinator.ts`:
  - Bộ điều phối nộp bài an toàn Idempotent: hàm `finalizeExamSubmission`.
  - Khóa in-flight submit lock chống double-click và tương tranh manual/timeout.
  - Kiểm tra idempotent kép từ session state và LocalStorage đã lưu.
  - Trích xuất và đóng băng snapshot đáp án bất biến.
  - Ghi nhận nguyên tử (Atomic Persistence) vào storage và bẫy lỗi quota bộ nhớ với khả năng retry phục hồi.
- `src/utils/__tests__/examScoringAndSubmission.test.ts`:
  - Bộ 125 targeted unit assertions qua 13 test suites kiểm định toàn diện:
    1. Suite 1: All Blank (0/200, 0% accuracy, 200 unanswered).
    2. Suite 2: All Correct (200/200, 100% accuracy, scaled score max 990).
    3. Suite 3: All Wrong (0/200, 0% accuracy, 200 incorrect).
    4. Suite 4: Mixed Score (153/200, L: 78/100, R: 75/100, xác thực tổng 200 câu).
    5. Suite 5: Idempotent Double Submit (chống submit trùng lặp, trả cùng kết quả).
    6. Suite 6: Auto vs Manual Race Condition (manual click và auto timeout cùng xảy ra).
    7. Suite 7: Storage Persistence Failure & Rollback (bẫy lỗi quota, không đánh dấu thành công giả).
    8. Suite 8: Submission Retry Recovery (thử lại sau khi giải phóng bộ nhớ thành công).
    9. Suite 9: Post-Submission Reload Recovery (F5 sau khi submit khôi phục kết quả đã lưu).
    10. Suite 10: Retake Isolation (lần thi thứ 2 có sessionId riêng, không ghi đè attempt 1).
    11. Suite 11: Content Revision Tracking (theo dõi chính xác revision 1 vs revision 2).
    12. Suite 12: Strict Media Disqualification (hủy tư cách Strict khi có gián đoạn âm thanh).
    13. Suite 13: Zero Interference with Cold Storage (đảm bảo `toeic_mastery_data_v2_cold` không bị chạm vào).

#### Changed
- `src/types/mockExam.ts`:
  - Mở rộng các domain models: `ExamScaledScoreEstimate`, `ExamResultIntegritySummary`, enhanced `ExamResult`, `ExamReviewItem`, `ExamHistoryEntry`, và `ExamFinalizeOutcome`.
- `src/utils/examSessionStorage.ts`:
  - Bổ sung các adapter persistence độc lập: `saveExamResult`, `getExamResult`, `clearExamResult`, `saveExamHistoryEntry`, `getExamHistory`, `getExamHistoryForForm`, `clearExamHistory`, `clearAllExamResults`.
  - Khai báo storage key prefixes: `toeic_exam_result_v1_` và `toeic_exam_history_v1`.
- `src/components/Exam/Workspace/ExamWorkspace.tsx`:
  - Kết nối `finalizeExamSubmission` vào luồng nộp bài thủ công (`handleConfirmSubmit`) và tự động (`handleReadingAutoSubmit`).
  - Quản lý trạng thái `isSubmitting` và `submissionError` trên UI phòng thi.
  - Hiển thị banner lỗi lưu trữ kèm nút "Thử Lưu Lại" (`Thử lại ngay`).
  - Nâng cấp màn hình Submitted: hiển thị raw scores đã kiểm chứng, điểm quy đổi ước tính ETS kèm disclaimer minh bạch, ma trận chi tiết Part 1–7, thời gian làm bài, huy hiệu kiểm định toàn vẹn và thông báo lưu trữ an toàn.
- `package.json`:
  - Thêm script thực thi `"test:exam-scoring": "tsx src/utils/__tests__/examScoringAndSubmission.test.ts"`.
  - Cập nhật script `"test:validation"` tích hợp bộ kiểm tra chấm điểm nâng tổng số bài test lên 4,578.

---

### Kết quả kiểm định & Build

```bash
# 1. Kiểm tra unit tests riêng cho Scoring Engine & Submission Coordinator
npm run test:exam-scoring
# Kết quả: 13/13 test suites passed, 125/125 assertions passed (100%)

# 2. Kiểm tra toàn bộ 22 test suites của toàn bộ dự án
npm run test:validation
# Kết quả: 22/22 test suites passed, 4,578/4,578 assertions passed (100%)

# 3. Kiểm tra biên dịch TypeScript và đóng gói Vite
npm run build
# Kết quả: tsc -b && vite build hoàn thành với 0 errors

# 4. Kiểm tra cú pháp và code smells bằng Oxlint
npm run lint
# Kết quả: Oxlint hoàn tất với 0 errors (188 warnings từ code cũ)
```

---

### Hạn chế còn tồn tại & Bàn giao Phase tiếp theo

1. **Kết Quả Chi Tiết & Giao Diện Xem Lại (Results & Review UI):**
   - Màn hình kết thúc hiện tại hiển thị bản tóm tắt điểm số đã kiểm chứng, ma trận Part 1–7 và huy hiệu toàn vẹn.
   - Giao diện xem lại chi tiết từng câu (Question-by-Question Review), đọc transcript, lời giải chi tiết và bộ lọc câu sai/câu cắm cờ sẽ được phát triển chuyên sâu trong Phase tiếp theo.
2. **Tích Hợp Vào Bảng Thống Kê Chung (Dashboard Integration):**
   - Lịch sử thi hiện đã được lưu trữ an toàn độc lập trong `toeic_exam_history_v1`.
   - Việc tích hợp đồng bộ dữ liệu điểm Full Mock vào biểu đồ tiến trình học tập, Radar Chart và Sổ tay lỗi sai (Mistake Book) sẽ được thực hiện sau khi hoàn thiện giao diện Review.

---

## [2.23.0-phase15-reading-workspace] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 15 — Exam Reading Workspace (Part 5–7), 101–200 Navigation & Submission Entry (Phòng Thi Chuyên Biệt Reading Part 5–7, Điều Hướng Tự Do 101–200 & Cơ Chế Nộp Bài Bảo Mật)**

### Mục tiêu
Triển khai toàn diện giao diện làm bài phần Đọc hiểu (Reading Part 5–7, câu 101–200) cho kỳ thi thử ETS 120 phút / 200 câu, hoàn thiện điều hướng phần Reading và bảo toàn ranh giới kiến trúc:
- **Reading Session & Timer:**
  - Phần thi Reading bao gồm câu 101–200.
  - Đồng hồ đếm ngược độc lập 75 phút (`readingDeadline`), hết giờ tự động kích hoạt nộp bài (`timeout_reading`) qua session engine có sẵn.
  - Tự do điều hướng giữa các câu Reading (101–200) qua phím tắt, nút bấm và Answer Sheet.
  - Cho phép sửa câu trả lời và cờ xem lại (`flagged`) bất kỳ lúc nào trước khi nộp bài.
  - Thực thi kỷ luật biên giới Strict Mode: Tuyệt đối không cho phép quay lại phần thi Listening (1–100) sau khi đã chuyển sang Reading (`STRICT_SECTION_LOCKED`, `STRICT_NAVIGATION_BLOCKED`).
  - Bảo mật tuyệt đối: Không tiết lộ đáp án đúng hoặc lời giải thích ngữ pháp trong suốt thời gian làm bài; câu chưa trả lời giữ nguyên `null`.
- **Specialized Reading Renderers:**
  - **Part 5 (Incomplete Sentences, 101–130):** Hiển thị câu hỏi có ô trống, inline blank preview hiển thị phương án đã chọn dạng `(${choice})`, 4 lựa chọn A–D rõ ràng, phím tắt toggle cờ xem lại `[M / F]`.
  - **Part 6 (Text Completion, 131–146):** Bố cục Split Layout hai cột trên desktop, hiển thị toàn bộ bài đọc với 4 ô trống liên kết `[131]`..`[146]`, click vào ô trống tự động nhảy/scroll tới câu hỏi tương ứng, hiển thị huy hiệu đáp án đã chọn trực tiếp trong bài đọc, bảo toàn tính toàn vẹn của nhóm 4 câu không phân mảnh.
  - **Part 7 (Reading Comprehension, 147–200):** Bố cục Split Layout hai cột trên desktop, hỗ trợ Single Passages (1 đoạn), Double Passages (2 đoạn) và Triple Passages (3 đoạn); pills chuyển nhanh và cuộn mượt giữa các tài liệu con (Email, Memo, Schedule, Table, Notice, Advertisement); hiển thị huy hiệu *Tổng Hợp Đa Văn Bản* (`crossTextReference`); bảo toàn scroll context khi chuyển câu trong cùng group; hiển thị danh sách 2–5 câu hỏi trong nhóm kèm toggle cờ và lựa chọn A–D.
- **Reading Layout & Responsive Shell:**
  - Bố cục 2 vùng độc lập (Passage bên trái / Questions bên phải) trên desktop; cuộn mượt mà; responsive chuyển sang dạng thẻ tuần tự trên mobile/tablet.
  - Không để header/footer che khuất nội dung bài thi.
  - Tối ưu hóa render văn bản dài, không reload hoặc re-render toàn bộ dữ liệu chỉ vì một đáp án thay đổi.
- **Submission Entry Safeguard:**
  - Modal kiểm toán số câu đã làm, chưa làm, gắn cờ và cảnh báo trước khi nộp bài.
  - Gửi yêu cầu finalize an toàn đến `submitExam` engine có sẵn; không tự chấm điểm ở UI.
- **Ranh giới:** Không xây dựng Scoring UI hoặc Dashboard integration trong Phase này (chuyển sang Phase 16).

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/components/Exam/Workspace/ExamPart5Renderer.tsx`:
  - Giao diện làm bài Part 5 Incomplete Sentences (101–130): render câu hỏi có ô trống, xem trước đáp án đã chọn dạng inline preview, 4 phương án A–D, nút gắn cờ xem lại `[M / F]`, ẩn hoàn toàn đáp án đúng và lời giải ngữ pháp.
- `src/components/Exam/Workspace/ExamPart6Renderer.tsx`:
  - Giao diện làm bài Part 6 Text Completion (131–146): bố cục Split Layout trên desktop, bài đọc chứa 4 interactive blanks `[131]`..`[146]` (click để focus/cuộn sang câu hỏi tương ứng), hiển thị badge đáp án đã chọn trực tiếp trong ô trống, bảo toàn nhóm 4 câu không tách rời.
- `src/components/Exam/Workspace/ExamPart7Renderer.tsx`:
  - Giao diện làm bài Part 7 Reading Comprehension (147–200): bố cục Split Layout, hỗ trợ Single, Double, Triple passages (15 nhóm, 54 câu), thanh quick jump pills giữa các văn bản con, badge *Tổng Hợp Đa Văn Bản* (`crossTextReference`), danh sách 2–5 câu hỏi trong nhóm, bảo toàn scroll context khi đổi câu hỏi.
- `src/utils/__tests__/examReadingWorkspace.test.ts`:
  - Bộ 584 targeted contract & invariant assertions kiểm định toàn diện 8 test suites: Part 5 sentence & choice format, Part 6 4-blank mapping & group integrity, Part 7 formats & multi-passage cross-reference, điều hướng tự do 101–200, kỷ luật khóa Strict không quay lại Listening, lưu trữ đáp án & cờ, submission safeguards & modal audit, tự động nộp bài khi hết 75 phút.

#### Changed
- `src/types/examWorkspace.ts`:
  - Mở rộng `ExamWorkspaceViewMode` thêm giá trị `'reading'`.
  - Import các domain types Part 5, 6, 7 từ `src/types/questionBank.ts`.
  - Định nghĩa props interfaces: `ExamPart5RendererProps`, `ExamPart6RendererProps`, `ExamPart7RendererProps` (kèm `ExamPart7QuestionItem`).
- `src/components/Exam/Workspace/index.ts`:
  - Re-export `ExamPart5Renderer`, `ExamPart6Renderer`, `ExamPart7Renderer`.
- `src/components/Exam/Workspace/ExamWorkspace.tsx`:
  - Xóa bỏ màn hình giữ chân `Reading Hold Screen`, tích hợp render trực tiếp Part 5, 6, 7 khi `isReadingSection`.
  - Tính toán danh sách `part7QuestionsWithNumbers` ánh xạ chính xác global question numbers (147–200) cho Part 7.
  - Quản lý banner cảnh báo điều hướng `navWarning` khi người dùng cố gắng thao tác vượt ranh giới.
  - Mở rộng phím tắt bàn phím (A–D, M/F, mũi tên điều hướng) hỗ trợ toàn bộ dải câu hỏi 1–200.
  - Xử lý nộp bài tự động an toàn khi hết 75 phút Reading (`timeout_reading`).
- `package.json`:
  - Thêm script `"test:exam-reading": "tsx src/utils/__tests__/examReadingWorkspace.test.ts"`.
  - Tích hợp vào chuỗi `"test:validation"`.
- `README.md`:
  - Nâng phiên bản hệ thống lên `2.23.0-phase15-reading-workspace`.
  - Bổ sung Module 21 vào Feature Catalog.
  - Cập nhật bảng kiểm thử (4,453 tests / 25 test suites).
  - Cập nhật Handoff Notes cho Phase 16.

---

### Kết quả kiểm định / Build
- **Kiểm định mã nguồn (Linter):** `npm run lint` hoàn thành với **0 errors** (193 warnings no-unused-vars từ mã cũ).
- **Kiểm tra kiểu dữ liệu & Đóng gói:** `npm run build` (`tsc -b && vite build`) hoàn thành thành công trong **475ms**, **0 lỗi biên dịch**.
- **Bộ kiểm thử Targeted Test Suites:**
  - `npm run test:exam-reading`: **584/584 assertions passed** (8/8 test suites).
  - `npm run test:validation`: **4,453/4,453 tests toàn dự án passed 100%**, 0 failures.

---

### Các vấn đề còn tồn tại & Hướng phát triển (Next Steps)
1. **Phase 16 — Exam Scoring, Analysis & Results Dashboard:** Triển khai thuật toán quy đổi điểm chuẩn ETS 10–990, phân tích chi tiết kết quả theo Part và năng lực (accuracy, speed, traps), tích hợp Mistake Notebook và Review Mode sau khi nộp bài.

---

## [2.22.0-phase14-listening-workspace-sheet] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 14 — Exam Listening Workspace & 200-Question Unified Answer Sheet (Phòng Thi Chuyên Biệt Listening Part 1–4 & Phiếu Trả Lời Tổng Hợp 200 Câu Chuẩn ETS)**

### Mục tiêu
Triển khai giao diện phòng thi chuẩn mực (Exam Workspace) cho phần thi Nghe (Listening Part 1–4) và Phiếu trả lời tổng hợp 200 câu (Unified Answer Sheet):
- **Exam Workspace Shell:**
  - Bố cục phòng thi chuẩn mực: ExamForm ID (`ETS-2026-SIM-01`), Part hiện tại, số câu/group, đồng hồ đếm ngược section timer wall-clock, overall timer, tiến độ làm bài, banner cảnh báo xung đột đa tab kèm nút Takeover, toggle Answer Sheet và nút Nộp bài có kiểm soát.
  - Tách rời reusable layout, question renderers, thanh điều khiển audio, submit modal và answer sheet. Không dồn logic vào `App.tsx`.
- **Answer Sheet 200 câu:**
  - Hiển thị 1–200, chia theo 2 tabs Listening (1–100) và Reading (101–200) cùng 7 Parts chuẩn mực.
  - 5 trạng thái trực quan: Answered, Unanswered, Flagged, Current, Locked.
  - Tối ưu hóa re-render 200 ô (`AnswerSheetCell` bọc `React.memo`).
  - Lưu trạng thái vào Session Engine (`recordExamAnswer`, `toggleQuestionFlag`, `examSessionStorage`).
  - Thực thi kỷ luật biên giới Strict navigation:
    * Khóa câu hỏi Reading khi đang làm Listening.
    * Khóa vĩnh viễn câu hỏi Listening khi đã chuyển sang Reading trong Strict mode.
    * Khóa các câu hỏi ngoài phạm vi audio track đang phát trong Strict mode kèm thông báo giải thích rõ ràng thay vì thay đổi section ngầm.
- **Listening Part 1–4 Specialized Renderers:**
  - Part 1: Tranh minh họa SVG đúng (`LISTENING_ILLUSTRATIONS`), ẩn transcript câu mô tả (chuẩn ETS), 4 phương án A-D.
  - Part 2: Đúng 3 phương án A, B, C (hoàn toàn không có phương án D), ẩn prompt/transcript spoken text.
  - Part 3: Nhóm 3 câu hội thoại, context banner, hỗ trợ graphic (`FlightScheduleGraphic`), in sẵn câu hỏi và 4 lựa chọn A–D.
  - Part 4: Nhóm 3 câu bài nói ngắn, context banner, hỗ trợ graphic (`StoreDirectoryGraphic`), in sẵn câu hỏi và 4 lựa chọn A–D.
- **Tính Bất Biến Âm Thanh & Ranh Giới:**
  - Audio phát liên tục cho toàn bộ nhóm câu; không tự phát lại khi render lại component hoặc khi người dùng thay đổi câu trả lời.
  - Chuyển tiếp màn hình Reading Hold rõ ràng khi kết thúc 45 phút Listening, giữ ranh giới sạch cho Phase 15 Reading Renderer.
  - Controlled Submit Modal: Kiểm toán số câu đã làm, chưa làm, gắn cờ và xác nhận nộp bài an toàn.

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/types/examWorkspace.ts`:
  - Định nghĩa types và interfaces: `AnswerSheetFilterMode`, `AnswerSheetCellStatus`, `ExamAnswerSheetCellData`, `ExamWorkspaceViewMode`, `AnswerSheetPartMeta`, `EXAM_ANSWER_SHEET_PARTS`, và props interfaces cho `ExamWorkspaceHeaderProps`, `ExamAudioBarProps`, `ExamAnswerSheetProps`, `ExamPart1RendererProps`, `ExamPart2RendererProps`, `ExamPart3RendererProps`, `ExamPart4RendererProps`, `ExamSubmitModalProps`.
- `src/components/Exam/Workspace/ExamWorkspaceHeader.tsx`:
  - Header phòng thi hiển thị mã đề, part, section timer wall-clock, overall timer, badges, multi-tab conflict banner kèm nút Takeover, tiến độ câu hỏi đã làm/cờ, toggle Answer Sheet và nút Nộp bài thi.
- `src/components/Exam/Workspace/ExamAudioBar.tsx`:
  - Thanh điều khiển audio hiển thị track hiện tại, status, strict 1.0x locked badge, Simulation pause/resume, volume slider/mute, và nút mở khóa autoplay gesture.
- `src/components/Exam/Workspace/ExamAnswerSheet.tsx`:
  - Phiếu trả lời 200 câu, chia Listening/Reading tabs, 7 Parts, memoized `AnswerSheetCell` tối ưu re-render, filter All/Unanswered/Flagged, và toast cảnh báo khi click câu bị khóa (Strict navigation rules).
- `src/components/Exam/Workspace/ExamSubmitModal.tsx`:
  - Modal xác nhận nộp bài hiển thị audit số câu đã làm, chưa làm, gắn cờ, cảnh báo câu bỏ trống và xác nhận nộp bài an toàn.
- `src/components/Exam/Workspace/ExamPart1Renderer.tsx`:
  - Renderer Part 1 với tranh SVG (`LISTENING_ILLUSTRATIONS`), ẩn transcript text, 4 choices A–D, toggle cờ xem lại.
- `src/components/Exam/Workspace/ExamPart2Renderer.tsx`:
  - Renderer Part 2 chuẩn ETS với đúng 3 lựa chọn A, B, C (hoàn toàn không có lựa chọn D), ẩn prompt/transcript text, toggle cờ xem lại.
- `src/components/Exam/Workspace/ExamPart3Renderer.tsx`:
  - Renderer Part 3 hội thoại nhóm 3 câu, context banner, context graphic SVG (`FlightScheduleGraphic`), in sẵn prompts và choices A–D.
- `src/components/Exam/Workspace/ExamPart4Renderer.tsx`:
  - Renderer Part 4 bài nói ngắn nhóm 3 câu, context banner, context graphic SVG (`StoreDirectoryGraphic`), in sẵn prompts và choices A–D.
- `src/components/Exam/Workspace/ExamWorkspace.tsx`:
  - Điều phối trung tâm phòng thi kết nối `useExamTimer`, `useStrictListeningAudio`, `examSessionEngine`, `examSessionStorage`, phím tắt bàn phím (A-D, M/F, mũi tên), Reading Hold screen khi kết thúc Listening, và màn hình Submitted thành công.
- `src/components/Exam/Workspace/index.ts`:
  - Barrel export cho thư mục Workspace.
- `src/utils/__tests__/examListeningWorkspace.test.ts`:
  - Bộ 565 targeted assertions kiểm định toàn diện 10 suites: Part 1 photographs format, Part 2 strict 3-choice rule, Part 3 conversation group integrity, Part 4 short talks integrity, 200-question answer sheet partitioning, cell states & filtering, strict navigation boundary enforcement, answer recording & persistence, audio track sync & anti-replay, submission safeguards & audit modal.

#### Changed
- `src/types/index.ts`:
  - Re-export `export * from './examWorkspace';`.
- `src/components/Exam/index.ts`:
  - Re-export `export * from './Workspace';`.
- `src/components/Exam/ExamPreflightModal.tsx`:
  - Cập nhật `handleConfirmStart` gọi `onStartExamConfirmed` và đóng modal.
- `src/components/Exam/ExamLibraryHub.tsx`:
  - Tích hợp `runningExam` state và render `<ExamWorkspace />`, thêm `handleResumeSession` để tiếp tục phiên thi dở dang trực tiếp.
- `package.json`:
  - Thêm script `"test:exam-workspace": "tsx src/utils/__tests__/examListeningWorkspace.test.ts"`.
  - Tích hợp vào chuỗi `"test:validation"`.

---

### Kết quả kiểm định / Build
- **Kiểm định mã nguồn (Linter):** `npm run lint` hoàn thành với **0 errors** (193 warnings no-unused-vars từ mã cũ).
- **Kiểm tra kiểu dữ liệu & Đóng gói:** `npm run build` (`tsc -b && vite build`) hoàn thành thành công trong **428ms**, **0 lỗi biên dịch**.
- **Bộ kiểm thử Targeted Test Suites:**
  - `npm run test:exam-workspace`: **565/565 assertions passed** (10/10 test suites).
  - `npm run test:validation`: **3,869/3,869 tests toàn dự án passed 100%**, 0 failures.

---

### Các vấn đề còn tồn tại & Hướng phát triển (Next Steps)
1. **Phase 15 — Reading Workspace (Part 5–7):** Triển khai giao diện chuyên biệt cho Reading Renderer: Part 5 Incomplete Sentences, Part 6 Text Completion (bố cục văn bản kèm 4 blanks liên kết), Part 7 Reading Comprehension (Single, Double, Triple passages kèm tabs chuyển đoạn và câu hỏi đối chiếu đa văn bản).
2. **Phase 16 — Exam Scoring & Results Dashboard:** Triển khai thuật toán quy đổi điểm chuẩn ETS 10–990, phân tích chi tiết kết quả theo Part và năng lực, tích hợp Mistake Notebook và Review Mode.

---

## [2.21.0-phase13-exam-library-preflight] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 13 — Exam Library, Instructions & Preflight Check (Thư Viện Đề Thi Full Mock Hub, Quy Chế Phòng Thi Chuẩn ETS & Kiểm Tra Kỹ Thuật Trước Giờ Thi)**

### Mục tiêu
Triển khai toàn bộ các màn hình và logic tiền phòng thi (Pre-Exam Phase) cho kỳ thi thử ETS 120 phút / 200 câu, tách biệt hoàn toàn khỏi Practice Mode:
- **Exam Library Hub (Full Mock Hub):**
  - Tách biệt độc lập phân hệ Full Mock Hub khỏi Practice Mode.
  - Hiển thị danh mục các `ExamForm` được đăng ký thực tế từ registry (`ets-mock-form-01`), số câu chuẩn 200, thời lượng 120 phút (Listening 45m / Reading 75m).
  - Hiển thị huy hiệu trạng thái: Simulation-Ready (khả dụng), Strict-Ready (khóa minh bạch kèm lý do), Incomplete.
  - Nhận diện và xử lý phiên thi dở dang từ LocalStorage: hiển thị banner cảnh báo, nút Tiếp tục (Resume) hoặc Hủy bỏ (Discard) an toàn.
  - Hiển thị lịch sử thi thật từ storage (không tạo đề giả hoặc số liệu mẫu).
- **Exam Instructions Modal:**
  - Phổ biến cấu trúc bài thi: Listening 100 câu / 45 phút, Reading 100 câu / 75 phút.
  - Chi tiết 7 Parts, phân bổ số câu và dạng bài.
  - Quy tắc kỷ luật âm thanh Strict: phát tuần tự 1 chiều, cấm tua (seek), cấm replay, cấm pause tùy ý, khóa tốc độ 1.0x.
  - Hướng dẫn phiếu trả lời (Answer Sheet 200 câu), đánh dấu câu cờ xem lại (Flag) và ma trận điều hướng.
  - Chính sách tự lưu LocalStorage offline, khôi phục khi reload/F5 và nộp bài (submit).
  - Giải thích minh bạch giới hạn của việc thi trên trình duyệt Offline-First.
  - So sánh rõ ràng giữa chế độ Strict Mock (chuẩn phòng thi) và Simulation Mode (học tập mô phỏng qua Web Speech API).
- **Preflight Technical Check:**
  - Kiểm tra 7 hạng mục trước giờ thi: Form integrity 200 câu, Media readiness & Strict mode lock guard, Browser capabilities (Audio/Speech), Storage read/write access, Active unfinished session assessment, Multi-tab lease conflict, Audio gesture & sound test runner.
  - Khóa cứng chế độ Strict Mode nếu thiếu tệp âm thanh phòng thu (`ets-mock-form-01` có `strictLocked: true`), cảnh báo rõ ràng khi chuyển sang Simulation Mode.
  - Chạy âm thanh thử nghiệm (Sound Check) qua tone Web Audio hoặc câu đọc mẫu để người dùng tương tác mở khóa chính sách autoplay của trình duyệt.
  - Không bắt đầu phiên thi hoặc kích hoạt hạn giờ deadline trước khi toàn bộ các kiểm tra preflight hợp lệ và người dùng bấm xác nhận Start.
- **UI/UX & Ranh Giới:**
  - Responsive trên desktop/tablet/mobile, Dark/Light mode chuẩn Tailwind v4, accessible controls.
  - Tích hợp điều hướng trên Navbar và CommandCenter.
  - Tuân thủ ranh giới Phase 13: Chưa xây Exam Workspace hoặc Results Dashboard; hiển thị thông báo bàn giao rõ ràng khi hoàn tất preflight.

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/types/examLibrary.ts`:
  - Định nghĩa các kiểu cốt lõi: `PreflightCheckId`, `PreflightCheckStatus`, `PreflightCheckItem`, `ExamPreflightReport`, `ExamLibraryFilter`, `SoundCheckResult`, `ExamCardPresentationData`.
- `src/utils/examPreflightChecker.ts`:
  - `runComprehensivePreflight`: Động cơ kiểm tra kỹ thuật 7 hạng mục toàn diện trước khi vào thi.
  - `testAudioPlayback`: Hàm phát âm thanh thử nghiệm (tone 880Hz Web Audio hoặc speech utterance) tương tác người dùng, mở khóa chính sách autoplay của trình duyệt.
- `src/components/Exam/ExamInstructionsModal.tsx`:
  - Hộp thoại phổ biến quy chế thi chuẩn ETS 120 phút qua 4 tab trực quan: Cấu Trúc Tổng Thể, Chi Tiết 7 Parts, Kỷ Luật Audio Strict, Tự Lưu & Offline.
- `src/components/Exam/ExamPreflightModal.tsx`:
  - Hộp thoại kiểm tra kỹ thuật tương tác trực tiếp: chọn mode (Simulation active / Strict locked), interactive sound check, checklist 7 hạng mục đạt chuẩn, nút Bắt đầu có điều kiện và thông báo bàn giao Phase 13.
- `src/components/Exam/ExamLibraryHub.tsx`:
  - Màn hình Full Mock Hub hoàn chỉnh: thẻ đề thi từ registry, bộ lọc status, nhận diện active session dở dang, xem lịch sử thi thật, kích hoạt instructions và preflight modal.
- `src/components/Exam/index.ts`:
  - Barrel export tập hợp các components của phân hệ Exam.
- `src/utils/__tests__/examPreflightAndLibrary.test.ts`:
  - Bộ 40 targeted contract & invariant assertions qua 10 test suites độc lập.
- `package.json`:
  - Thêm script `"test:exam-preflight": "tsx src/utils/__tests__/examPreflightAndLibrary.test.ts"`.
  - Tích hợp vào chuỗi `"test:validation"`.

#### Changed
- `src/types/index.ts`:
  - Xuất bản toàn bộ types từ `src/types/examLibrary.ts` qua `export * from './examLibrary';`.
- `src/components/Navbar.tsx`:
  - Bổ sung nút điều hướng `Thi Thử ETS` (`id: 'mock-exam'`) với icon `GraduationCap`.
- `src/components/Dashboard/CommandCenter.tsx`:
  - Bổ sung nút CTA chuyển nhanh đến Full Mock Hub (`mock-exam`) từ header banner.
- `src/App.tsx`:
  - Import và render `<ExamLibraryHub />` khi `activeTab === 'mock-exam'`.

---

### Kết quả kiểm định & Build
- **Unit & Targeted Tests (`npm run test:exam-preflight`):** **40/40 assertions PASSED (100%)** qua 10 test suites:
  - Suite 1: Exam Form Registry & Library Status Filtering (tìm kiếm, lọc status simulation-ready, strict-only).
  - Suite 2: Form Integrity & Cardinality Check (đạt chuẩn với 200 câu; chặn start nếu thiếu câu).
  - Suite 3: Strict Mode Lock Gating & Rejection Reasons (khóa cứng Strict Mode và giải thích minh bạch khi form chưa certified).
  - Suite 4: Simulation Fallback Acceptance & Warning Labeling (chấp nhận Simulation Mode kèm cảnh báo TTS).
  - Suite 5: Browser Capabilities & Platform Support (kiểm tra Web Audio và SpeechSynthesis).
  - Suite 6: Storage Read/Write Access Check (kiểm tra khả năng đọc/ghi LocalStorage; chặn start nếu lỗi storage).
  - Suite 7: Existing Session Conflict Assessment (kiểm tra phiên thi dở dang non-critical).
  - Suite 8: Multi-Tab Lease Ownership Verification (kiểm tra quyền sở hữu tab lease).
  - Suite 9: Sound Check Utility & Autoplay Unlock Gate (chạy âm thanh thử nghiệm mở khóa autoplay).
  - Suite 10: Start Readiness & Gating Rules (xác thực `readyToStart` và danh sách blockers).
- **Tổng kiểm định toàn hệ thống (`npm run test:validation`):** **3,304/3,304 assertions PASSED (100%)** qua 19 test suites.
- **Linter (`npm run lint`):** **0 errors** trên 103 tệp tin mã nguồn.
- **Production Build (`npm run build`):** Biên dịch TypeScript (`tsc -b`) và đóng gói Vite 8 thành công 100% trong 634ms, không có lỗi kiểu dữ liệu.

---

## [2.20.0-phase12-strict-listening-engine] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 12 — Strict Listening Audio Engine (Động Cơ Phát Âm Thanh Phòng Thi Tuần Tự, Cách Ly Điều Hướng, An Toàn Vòng Đời & Khôi Phục Bất Thường)**

### Mục tiêu
Triển khai động cơ âm thanh Listening chuyên biệt cho môi trường phòng thi chuẩn hóa và mô phỏng học tập:
- **Strict Playback:**
  - Phát tuần tự cố định tuyến tính từ Part 1 → Part 2 → Part 3 → Part 4 qua 58 đơn vị âm thanh chuẩn mực (P1 Directions + 6 câu Part 1 + P2 Directions + 25 câu Part 2 + P3 Directions + 13 nhóm Part 3 + P4 Directions + 10 nhóm Part 4 = 58 queue items).
  - Khóa cố định tốc độ phát chuẩn 1.0x, cấm tua (seek), cấm nghe lại (replay), cấm tạm dừng (pause) tùy ý trong Strict Mode.
  - Tuyệt đối không tiết lộ transcript, kịch bản phân vai hay answer key trong runtime phát âm thanh.
  - Cô lập hoàn toàn trạng thái phát audio khỏi điều hướng answer sheet: thí sinh tự do lướt xem các câu hỏi trên tờ phiếu trả lời mà không làm nhảy hay gián đoạn audio; quay lại câu cũ không kích hoạt phát lại audio cũ.
  - Đồng bộ chặt chẽ với Section Timer (hết hạn 45 phút Listening dừng ngay lập tức mọi hoạt động phát âm thanh).
  - Tách biệt headless playback controller (`StrictListeningAudioEngine`) độc lập khỏi React UI.
- **Simulation Mode Fallback:**
  - Hỗ trợ chế độ mô phỏng (`mode: 'simulation'`) sử dụng Web Speech API native khi đề thi chỉ có kịch bản văn bản hoặc chưa đạt chứng chỉ tệp âm thanh phòng thu.
  - Gắn nhãn minh bạch chế độ mô phỏng (`isSimulation: true`, `isStrictCertified: false`), không tuyên bố đạt chuẩn phòng thi ETS.
  - Tuyệt đối KHÔNG tự mở khóa Strict Mode bằng fallback TTS (`STRICT_MODE_LOCKED`).
- **Lifecycle Safety & Concurrency:**
  - Xử lý hạn chế autoplay của trình duyệt (`isAwaitingUserGesture`), hỗ trợ kích hoạt an toàn bằng thao tác người dùng.
  - Đảm bảo cơ chế token guard (`activeToken`) loại bỏ 100% stale callbacks từ các tác vụ bất đồng bộ cũ hoặc timer cũ.
  - Không tạo chồng nhiều `HTMLAudioElement`, `AudioContext` hay `SpeechSynthesis` instances; dọn dẹp triệt để (zero resource leaks) khi unmount, nộp bài, hết giờ hoặc chuyển phần thi.
  - Miễn nhiễm với React 19 StrictMode và background tab throttling.
- **Recovery & Checkpoints:**
  - Lưu trữ checkpoint phát (`ExamPlaybackCheckpoint`) định kỳ và khi thay đổi track/segment.
  - Đánh giá khôi phục sau reload/F5 (`evaluateExamAudioRecovery`): Với Strict Mode, do phòng thi thực tế không thể tua lại đoạn nghe đã trôi qua, gắn cờ đứt quãng bất thường (`timelineAbnormal: true`) kèm lý do minh bạch `tamperReason`, giữ nguyên toàn bộ đáp án đã làm; Với Simulation Mode, cho phép tiếp tục học tập từ checkpoint gần nhất.

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/types/examAudio.ts`:
  - Định nghĩa các kiểu cốt lõi cho động cơ âm thanh phòng thi: `ExamAudioMode` (`'strict' | 'simulation'`), `ExamAudioPlaybackStatus` (`'idle' | 'loading' | 'playing' | 'paused' | 'waiting_gesture' | 'ended' | 'error' | 'interrupted'`), `ExamAudioItemType` (`'part1_directions' | 'part1_question' | 'part2_directions' | 'part2_question' | 'part3_directions' | 'part3_group' | 'part4_directions' | 'part4_talk'`).
  - Interface `ExamAudioQueueItem`: metadata đơn vị phát âm thanh, dải câu hỏi bao phủ (`startQuestionNumber`, `endQuestionNumber`), cờ `isDirections`, khoảng nghỉ sau phát (`pauseAfterSeconds`), kịch bản phân đoạn `AudioTrackSegment[]` và URL file âm thanh.
  - Interface `ExamAudioEngineState`: trạng thái phản ứng toàn diện (vị trí track hiện tại, tiến độ, volume, cờ Strict/Simulation, hạn chế seek/replay/pause, mã lỗi, cờ `timelineAbnormal`).
  - Interface `ExamAudioEngineOptions` & `ExamAudioRecoveryEvaluation`.
- `src/utils/strictListeningEngine.ts`:
  - `compileListeningAudioQueue(examForm: ExamForm, lookup?)`: Hàm biên dịch hàng đợi 58 đơn vị âm thanh chuẩn ETS tuyến tính từ Part 1 đến Part 4, tích hợp nội dung directions chính thức của ETS và khoảng nghỉ tiêu chuẩn (Part 1: 5s; Part 2: 5s; Part 3/4: 24s/nhóm).
  - Class `StrictListeningAudioEngine`: Headless controller độc lập khỏi UI, thi hành toàn bộ các quy tắc bất biến của Strict Mode:
    - Guard từ chối khởi tạo Strict Mode nếu form chưa certified (`STRICT_MODE_LOCKED`).
    - Khóa tốc độ 1.0x (`SPEED_CHANGE_FORBIDDEN`), cấm seek (`SEEK_FORBIDDEN_IN_STRICT`), cấm replay (`REPLAY_FORBIDDEN_IN_STRICT`), cấm pause trong Strict Mode (`PAUSE_FORBIDDEN_IN_STRICT`).
    - Token guard thế hệ (`activeToken++`) loại bỏ hoàn toàn stale callbacks từ TTS và Audio Element.
    - Tích hợp Web Speech API native qua `voiceManager` và kịch bản phân vai khi ở Simulation Mode.
    - Autoplay guard phát hiện `NotAllowedError` và chuyển trạng thái sang `waiting_gesture`.
    - Dọn dẹp tài nguyên triệt để trong `dispose()` và `stop()`.
  - `evaluateExamAudioRecovery(session, examForm, lastCheckpoint)`: Đánh giá khả năng khôi phục phiên thi sau F5/reload; gắn cờ `timelineAbnormal` trong Strict Mode để đảm bảo tính minh bạch phòng thi.
- `src/hooks/useStrictListeningAudio.ts`:
  - Custom React hook an toàn với React 19 StrictMode: kết nối `StrictListeningAudioEngine` với React lifecycle.
  - Tự động ngắt âm thanh và dọn dẹp tài nguyên khi unmount hoặc khi trạng thái phiên thi không còn là `'listening'`.
- `src/utils/__tests__/strictListeningAudio.test.ts`:
  - Bộ 66 targeted contract & invariant tests qua 10 test suites độc lập.
- `package.json`:
  - Bổ sung lệnh script `"test:exam-audio": "tsx src/utils/__tests__/strictListeningAudio.test.ts"`.
  - Tích hợp `test:exam-audio` vào chuỗi lệnh kiểm định toàn diện `"test:validation"`.

#### Changed
- `src/types/index.ts`:
  - Xuất bản toàn bộ types từ `src/types/examAudio.ts` qua `export * from './examAudio';`.
- `src/utils/strictListeningEngine.ts`:
  - Điều chỉnh tham số `genderHint` tương thích chính xác với interface `VoiceCriteria` của `voiceManager.ts`.

---

### Kết quả kiểm định & Build
- **Unit & Targeted Tests (`npm run test:exam-audio`):** **66/66 assertions PASSED (100%)** qua 10 test suites:
  - Suite 1: Sequential Audio Queue Compiler (đúng 58 units: P1 Dir + 6 Qs, P2 Dir + 25 Qs, P3 Dir + 13 Grps, P4 Dir + 10 Grps).
  - Suite 2: Strict Readiness Guard & Lock Enforcement (từ chối Strict Mode trên canonical form chưa có file studio, trả mã `STRICT_MODE_LOCKED`).
  - Suite 3: Simulation Mode Fallback & Transparent Labeling (`isSimulation: true`, `isStrictCertified: false`).
  - Suite 4: Anti-Tampering & Playback Restrictions (cấm seek, replay, speed change, pause trong Strict Mode).
  - Suite 5: Answer Sheet Navigation Isolation (lướt câu hỏi trên phiếu trả lời không ảnh hưởng luồng phát âm thanh).
  - Suite 6: Section Timer Expiration & Immediate Teardown (hết hạn timer ngắt tức thì playback).
  - Suite 7: Recovery, Reload & Timeline Anomaly Flagging (gắn cờ `timelineAbnormal: true` trong Strict Mode khi F5).
  - Suite 8: Stale Callback & Concurrency Token Invariant (hủy bỏ callback cũ bằng token guard).
  - Suite 9: Simulation Controls (cho phép pause/resume trong Simulation Mode).
  - Suite 10: Checkpoint Generation Integrity (lưu đúng track, index, state, loopCount, timestamp).
- **Tổng kiểm định toàn hệ thống (`npm run test:validation`):** **3,264/3,264 assertions PASSED (100%)** qua 18 test suites.
- **Linter (`npm run lint`):** **0 errors** trên 96 tệp tin mã nguồn.
- **Production Build (`npm run build`):** Biên dịch TypeScript (`tsc -b`) và đóng gói Vite 8 thành công 100% trong 467ms, không có lỗi kiểu dữ liệu.

---

## [2.19.0-phase11-exam-timer-multitab] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 11 — Exam Timer & Multi-Tab Safety (Đồng Hồ Phòng Thi Bất Biến, Chuyển Phần Một Chiều & Kiểm Soát Độc Quyền Đa Tab)**

### Mục tiêu
Triển khai động cơ đồng hồ bấm giờ chuẩn ETS, kiểm soát hạn giờ wall-clock bất biến trước reload/F5/tab background throttling, cơ chế chuyển phần thi (Section Transition) một chiều tất định, khóa an toàn đa tab (Multi-Tab Safety Lease) và phát hiện bất thường đồng hồ hệ thống (Clock Tampering Detection):
- **Exam Timer Engine:**
  - Listening 45 phút (2,700s), Reading 75 phút (4,500s), tổng 120 phút (7,200s).
  - Không sử dụng `setInterval(seconds--)` làm nguồn chân lý. Dựa trên wall-clock timestamp và deadline bền vững (`listeningDeadline`, `readingDeadline`, `overallDeadline`).
  - Miễn nhiễm với F5 reload, browser sleep, CPU throttling và window focus/blur. Tính toán lại thời gian tức thì khi reload/focus.
  - Không pause tùy ý trong Strict Mode; không dùng thời gian Reading để làm bù cho Listening.
  - Không tạo nhiều timer đồng thời (single interval qua React hook `useExamTimer`).
- **Section Transition:**
  - Chuyển phần một chiều đúng một lần (`listening` → `reading`).
  - Reading có deadline riêng (75 phút) và không bị kéo dài do reload/refresh phần Listening.
  - Tự động nộp bài đúng một lần khi hết giờ Reading (`timeout_reading`) hoặc tổng thời gian (`timeout_overall`).
  - Chống xung đột tương tranh giữa manual submit và auto-submit (Idempotency Guard).
  - Không truy cập lại Listening sau khi đã chuyển sang Reading trong Strict Mode.
  - Cung cấp hook/event ngắt âm thanh (`onListeningEnded`) để Audio Engine dừng ngay lập tức playback khi hết Listening.
- **Multi-Tab Protection:**
  - Ngăn chặn nhiều tab cùng sửa một Session ID qua mô hình Single-Writer Lease (`toeic_exam_active_lease_v1`) kết hợp BroadcastChannel bus (`toeic_exam_session_bus`).
  - Duy nhất một tab có quyền sửa tại một thời điểm (`status: 'active'`).
  - Tab mở sau tự động chuyển sang chế độ chỉ đọc (`read_only_conflict`) kèm chỉ báo tab đang giữ lease.
  - Cơ chế Heartbeat (1.5s) và Lease TTL (5s) tự động giải phóng khi tab crash/đóng.
  - Cơ chế chiếm quyền hợp lệ (Takeover): Tab mới nhận quyền, tab cũ bị tước quyền và giáng cấp về `read_only_conflict`.
  - Chặn stale background tabs ghi đè LocalStorage (`TAB_CONFLICT`).
- **Clock Integrity:**
  - Phát hiện lùi giờ hệ thống (`now < lastKnownTimestamp - 5s`) hoặc nhảy cóc tương lai bất thường (> 24h).
  - Ghi nhận cờ `isClockTampered`, tính tổng `clockDriftSeconds` và lý do minh bạch `tamperReason` trên tinh thần Offline-First.

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/types/mockExam.ts`:
  - Mở rộng `ExamIntegrityFlags`: `isClockTampered?: boolean; clockDriftSeconds?: number; timelineAbnormal?: boolean; lastKnownTimestamp?: number`.
  - Khai báo các kiểu Multi-Tab Lease: `TabLeaseStatus`, `ExamTabLease`, `TabLeaseMessage`, `TabLeaseMessageType`.
  - Khai báo snapshot đồng hồ: `ExamTimerSnapshot`.
  - Mở rộng mã lỗi `ExamStorageOperationResult` với `'TAB_CONFLICT'`.
- `src/utils/examTimer.ts`:
  - Pure functions tính toán thời gian, chuyển phần và phát hiện bất thường:
    - `formatRemainingTime(totalSeconds: number): string`
    - `calculateTimerSnapshot(session: ExamSession, nowTimestamp: number): ExamTimerSnapshot`
    - `verifyClockIntegrity(session: ExamSession, now?: number, options?: { toleranceMs?: number })`
    - `handleSectionTimeoutOrTransition(session: ExamSession, now?: number, callbacks?: { onListeningEnded?: () => void; onExamSubmitted?: (reason: ExamSubmitReason) => void })`
    - `executeSafeExamSubmit(session: ExamSession, reason?: ExamSubmitReason, now?: number)`
    - `executeSafeSectionTransition(session: ExamSession, now?: number, callbacks?: { onListeningEnded?: () => void })`
- `src/utils/examTabCoordinator.ts`:
  - Bộ điều phối độc quyền đa tab và lease lưu trữ:
    - Khóa LocalStorage: `ACTIVE_TAB_LEASE_KEY = 'toeic_exam_active_lease_v1'`, `EXAM_BROADCAST_CHANNEL = 'toeic_exam_session_bus'`.
    - Hằng số: `DEFAULT_LEASE_TTL_MS = 5000`, `DEFAULT_HEARTBEAT_INTERVAL_MS = 1500`.
    - Các hàm điều phối: `generateTabId`, `getCurrentTabLease`, `getActiveTabLease`, `acquireTabLease`, `renewTabLease`, `releaseTabLease`, `isTabAuthorizedToSave`, `broadcastTabMessage`, `subscribeToTabBus`.
- `src/hooks/useExamTimer.ts`:
  - React hook kết nối đồng hồ, quản lý single `setInterval(1000)`, tự động phục hồi khi `visibilitychange` và `window.focus`, điều phối heartbeat lease và gọi hook ngắt Audio Engine khi hết Listening.
- `src/utils/__tests__/examTimerAndMultiTab.test.ts`:
  - Bộ kiểm thử fake-clock 84 assertions bao quát 10 test suites:
    - Suite 1: Timer Snapshot Calculations & Formatting (10 assertions).
    - Suite 2: Fake Clock: Listening Expiration (44:59 -> 45:00) & Audio Stop Hook (11 assertions).
    - Suite 3: Fake Clock: Reading Expiration (74:59 -> 75:00) & Auto-Submit (8 assertions).
    - Suite 4: Fake Clock: Overall 120m Deadline Auto-Submit (6 assertions).
    - Suite 5: Persistent Deadlines & F5 Reload Resilience (5 assertions).
    - Suite 6: Strict Mode Lockdown: No Reading Time for Listening (2 assertions).
    - Suite 7: Concurrency & Idempotency: Double Transition & Dual Submit (8 assertions).
    - Suite 8: Multi-Tab Safety: Lease Acquisition & Conflict Detection (11 assertions).
    - Suite 9: Takeover Mechanism, Expired Lease Recovery & Bus Notifications (13 assertions).
    - Suite 10: Clock Integrity & System Time Regression Detection (10 assertions).

#### Changed
- `src/utils/examSessionStorage.ts`:
  - Tích hợp kiểm tra lease đa tab (`isTabAuthorizedToSave`) trong `saveActiveExamSession` và `startNewExamSession`: Từ chối ghi khi tab không có lease hợp lệ với mã lỗi `TAB_CONFLICT`, phát broadcast `SESSION_SYNC` khi lưu thành công.
- `package.json`:
  - Thêm script `"test:exam-timer": "tsx src/utils/__tests__/examTimerAndMultiTab.test.ts"`.
  - Cập nhật kịch bản chuỗi `"test:validation"` bao gồm 17 suites kiểm định toàn dự án.

---

### Kết quả kiểm định / Build
- **Unit & Targeted Tests:** 84/84 assertions passed (`npm run test:exam-timer`).
- **Toàn bộ Validation Pipeline:** 17/17 test suites passed, 3,198 assertions passed (`npm run test:validation`).
- **Linter:** `npm run lint` hoàn tất với 0 errors (132 warnings cũ trong các file giao diện gốc).
- **TypeScript & Production Build:** `npm run build` hoàn thành trong 534ms, 0 compile errors.

---

## [2.18.0-phase10-exam-session-state-machine] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 10 — Exam Session State Machine & Persistence (Vòng Đời Phiên Thi Chuẩn ETS 200 Câu & Lưu Trữ Ngoại Tuyến Độc Lập)**

### Mục tiêu
Triển khai hệ thống state machine quản lý toàn diện vòng đời phiên thi thử chuẩn ETS 200 câu và bộ điều hợp lưu trữ LocalStorage ngoại tuyến (Offline-First persistence adapter):
- Xây dựng state machine thuần túy 9 trạng thái (9-State Lifecycle):
  - Chuỗi trạng thái chính: `preflight` → `ready` → `listening` → `reading` → `submitted`.
  - Nhánh phục hồi và ngoại lệ: `interrupted` (tạm ngắt khi reload/mất tiêu điểm), `recovery-required` (lệch content revision hoặc sai fingerprint), `invalid` (khiếm khuyết cấu trúc), `media-failed` (tài nguyên âm thanh lỗi hoặc chế độ Strict bị khóa minh bạch).
  - Tách rời 100% logic phiên làm bài khỏi React components (pure engine functions).
- Thiết lập cấu trúc dữ liệu phiên thi (`ExamSession`) tinh gọn, bảo mật:
  - Mã định danh phiên `sessionId`, liên kết `examFormId`, `schemaVersion` (1.0.0), `contentRevision`.
  - Chế độ thi: `mode: 'simulation' | 'strict'`.
  - Con trỏ hiện tại: `currentSection`, `currentPart` (1..7), `currentQuestionNumber` (1..200).
  - Ánh xạ đáp án đúng 200 câu (`answers: Record<number, ExamAnswer>`), cờ xem lại (`flaggedQuestions`).
  - Mốc thời gian thực wall-clock: `startedAt`, `sectionStartedAt`, `listeningDeadline` (45m), `readingDeadline` (75m), `overallDeadline` (120m), `elapsedSeconds`, `listeningElapsedSeconds`, `readingElapsedSeconds`.
  - Metadata checkpoint âm thanh: `playbackCheckpoint` (`currentTrackId`, `playbackPositionMs`, `speechRate`, `audioState`, `loopCount`, `lastCheckpointAt`).
  - Cờ bảo toàn dữ liệu: `integrityFlags` (`contentFingerprint`, `preflightPassed`, `isTampered`, `isRevisionMismatch`, `hasMissingQuestions`).
  - Dấu thời gian lưu trữ xác thực: `lastSavedAt`.
- Thực thi toàn diện các quy tắc biên giới phòng thi (Transition Rules):
  - Không double-start: Từ chối bắt đầu lại phiên đang ở `listening`, `reading` hoặc `submitted`.
  - Chuyển `listening` → `reading` một chiều: Cấm chuyển 2 lần; Strict mode cấm chuyển ngược lại hoặc điều hướng về câu 1–100.
  - Strict mode niêm phong phần Nghe: Đang ở phần Reading tuyệt đối cấm sửa đáp án, cấm đổi cờ cho câu 1–100.
  - Khóa đáp án sau Submit & chống Stale Callbacks: Từ chối mọi thao tác sửa đáp án, đổi cờ hoặc cập nhật checkpoint audio sau khi nộp bài.
  - Kiểm soát điều kiện bắt đầu đề thi (Readiness Guard): Bắt buộc hoàn tất preflight; từ chối chế độ Strict nếu đề thi bị khóa (`strictLocked: true`).
  - Chống ghi đè vô ý: Từ chối thay thế phiên dở dang trừ khi có xác nhận rõ ràng (`forceReplace: true`).
  - An toàn React StrictMode: Cho phép reload lặp lại cùng `sessionId` một cách tất định (idempotent).
- Cơ chế lưu trữ ngoại tuyến độc lập (Offline-First Persistence Adapter):
  - Khóa lưu trữ cách ly: `toeic_exam_active_session_v1` (Active Session) và `toeic_exam_session_history_v1` (History). Tuyệt đối không can thiệp hay ghi đè `toeic_mastery_data_v2_cold` hoặc Practice storage.
  - Lưu trữ tinh gọn (Zero-Copy): Chỉ lưu ID, map 200 đáp án, cờ, checkpoint và mốc thời gian; tuyệt đối không nhân bản 200 câu hỏi hay audio blob vào storage.
  - Bẫy lỗi Quota & Báo cáo trung thực: Nhận diện `QuotaExceededError`, không báo thành công giả khi storage ghi thất bại.
  - Khôi phục F5 & Tính hạn giờ Wall-Clock: Khi tải lại trang, tự động đối chiếu đề thi và revision; nếu thời gian làm bài đã trôi qua trong lúc đóng trình duyệt, hệ thống tự động hoàn tất bài thi (`timeout_reading` hoặc `timeout_overall`), lưu vào lịch sử và giải phóng active storage.
- Kiểm thử mục tiêu (Targeted Tests): 145 assertions qua 8 suites bao phủ toàn bộ trạng thái, quy tắc phòng thi, kiểm soát hạn giờ và lưu trữ.

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/utils/examSessionEngine.ts`:
  - Pure state machine lifecycle engine cho bài thi 200 câu chuẩn ETS:
    - Khởi tạo phiên: `createExamSession`, `generateExamSessionId`, `SESSION_SCHEMA_VERSION`.
    - Bộ giải mã Part và Section: `getPartForQuestionNumber`, `getSectionForQuestionNumber`.
    - Kiểm định điều kiện trước thi: `executePreflightCheck`.
    - Chuyển trạng thái: `startExam`, `transitionToReading`, `submitExam`.
    - Tương tác bài làm: `recordExamAnswer` (hỗ trợ kiểm tra Part 2 chỉ có A-C), `toggleQuestionFlag`, `navigateToQuestion`.
    - Điều khiển media checkpoint: `updatePlaybackCheckpoint`.
    - Quản lý gián đoạn và hạn giờ: `interruptExamSession`, `resumeExamSession`, `evaluateSessionTimeouts`.
    - Kiểm tra tính toàn vẹn: `validateSessionIntegrity`.
- `src/utils/examSessionStorage.ts`:
  - Bộ điều hợp LocalStorage ngoại tuyến độc lập:
    - Khóa lưu trữ: `ACTIVE_EXAM_SESSION_KEY = 'toeic_exam_active_session_v1'`, `EXAM_SESSION_HISTORY_KEY = 'toeic_exam_session_history_v1'`.
    - Vận hành phiên active: `saveActiveExamSession`, `loadActiveExamSession`, `startNewExamSession`, `clearActiveExamSession`, `checkHasUnfinishedActiveExamSession`.
    - Quản lý lịch sử: `archiveCompletedExamSession`, `getExamSessionHistory`, `clearExamSessionHistory`.
    - Bẫy lỗi QuotaExceededError và bẫy lỗi JSON corrupt tự dọn dẹp an toàn.
- `src/utils/__tests__/examSessionEngine.test.ts`:
  - Bộ kiểm thử 145 assertions bao quát 8 test suites:
    - Suite 1: Session Initialization & 200-Answer Mapping Integrity (25 assertions).
    - Suite 2: Preflight Verification & Readiness Enforcement (13 assertions).
    - Suite 3: Lifecycle Transitions & Double-Start Protection (22 assertions).
    - Suite 4: Strict Mode Navigation & Section Boundary Rules (14 assertions).
    - Suite 5: Answer Modifications, Part 2 Constraints & Submit Locks (15 assertions).
    - Suite 6: Interruption, Resume & Wall-Clock Deadline Evaluation (15 assertions).
    - Suite 7: Storage Persistence, Quota Errors & Overwrite Guards (26 assertions).
    - Suite 8: Zero-Cloud Isolation & Non-Interference with Cold Storage (2 assertions).

#### Changed
- `src/types/mockExam.ts`:
  - Mở rộng domain model Phase 10:
    - Khai báo kiểu `ExamSessionMode = 'simulation' | 'strict'`.
    - Khai báo kiểu `ExamSessionLifecycleStatus = 'preflight' | 'ready' | 'listening' | 'reading' | 'submitted' | 'interrupted' | 'recovery-required' | 'invalid' | 'media-failed'`.
    - Khai báo interfaces: `ExamPlaybackCheckpoint`, `ExamIntegrityFlags`, `ExamSessionInitParams`, `ExamTransitionResult`, `ExamStorageOperationResult`.
    - Mở rộng `ExamSession` với đầy đủ các trường `mode`, `status`, `currentPart`, `flaggedQuestions`, `playbackCheckpoint`, `integrityFlags`, `lastSavedAt`.
- `package.json`:
  - Bổ sung script `"test:exam-session": "tsx src/utils/__tests__/examSessionEngine.test.ts"`.
  - Xâu chuỗi vào lệnh kiểm tra tổng thể `"test:validation"`.
- `README.md`:
  - Cập nhật phiên bản lên `2.18.0-phase10-exam-session-state-machine`.
  - Cập nhật sơ đồ kiến trúc hệ thống và lớp lưu trữ Offline.
  - Bổ sung Module 16: Exam Session State Machine & Persistence (Phase 10).
  - Bổ sung lệnh `npm run test:exam-session` vào bảng hướng dẫn vận hành.
  - Cập nhật Handoff Notes với kết quả Phase 10.
- `docs/FILE_INDEX.md`:
  - Cập nhật phiên bản lên `2.18.0-phase10-exam-session-state-machine`.
  - Bổ sung 3 dòng danh mục file mới cho `examSessionEngine.ts`, `examSessionStorage.ts` và `examSessionEngine.test.ts`.

---

### Kết quả kiểm định chất lượng (Verification & Build)
- **Kiểm thử Exam Session Engine & Storage (`npm run test:exam-session`):** 145/145 bài kiểm tra đạt (0 thất bại).
- **Kiểm thử toàn diện hệ thống (`npm run test:validation`):** 16/16 test suites toàn bộ workspace đạt 100% (3,114/3,114 tests passed).
- **Kiểm tra cú pháp & mã nguồn (`npm run lint`):** Oxlint quét 88 files, 0 errors, 136 warnings (pre-existing JSX/React refresh warnings).
- **Biên dịch & đóng gói (`npm run build`):** TypeScript `tsc -b` và Vite build hoàn tất thành công trong 623ms, 0 lỗi kiểu dữ liệu.

---

### Handoff Notes & Kế hoạch tiếp theo
- Exam Session Engine và Persistence Layer cho bài thi 200 câu chuẩn ETS đã hoàn thiện đầy đủ các ràng buộc kiến trúc, sẵn sàng chuyển giao cho Phase 11:
  - Tích hợp không gian làm bài Full Mock Exam Workspace (Listening Workspace + Reading Workspace).
  - Kết nối với bộ điều khiển phát âm thanh mô phỏng (Audio Engine) theo timeline chuẩn ETS 45 phút.
  - Chế độ Strict Mode hiện vẫn bị khóa có chủ đích (`strictLocked: true`) vì chưa tích hợp gói âm thanh phòng thu thực tế.

---

## [2.17.0-phase9-examform-readiness] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 9 — ExamForm Assembly & Media Readiness (Đăng Ký Đề Thi 200 Câu & Kiểm Định Toàn Vẹn Tài Nguyên)**

### Mục tiêu
Triển khai lắp ráp ExamForm chuẩn ETS 200 câu, xây dựng registry quản lý đề thi và bộ công cụ kiểm định tài nguyên truyền thông (Media Readiness Engine):
- Lắp ráp đề thi chuẩn ETS đầu tiên (`CANONICAL_ETS_EXAM_FORM_01`, `ets-mock-form-01`, `ETS-2026-SIM-01`) từ Question Bank:
  - Listening (100 câu): Part 1 (6), Part 2 (25), Part 3 (39 / 13 groups), Part 4 (30 / 10 groups).
  - Reading (100 câu): Part 5 (30), Part 6 (16 / 4 groups), Part 7 (54 / 15 groups: 29 Single / 10 groups + 25 Multiple / 5 groups).
  - Đúng 200 câu duy nhất, thứ tự cố định từ 1 đến 200, 42 groups toàn vẹn, bảo toàn biên độ câu hỏi.
  - Tính toán fingerprint nội dung xác thực tính bất biến của đề thi.
- Kiểm định toàn diện tài nguyên Listening (Media Readiness & Timeline Verification):
  - Part 1: Kiểm tra 6 ảnh minh họa SVG trong `LISTENING_ILLUSTRATIONS`, kịch bản đọc 4 phương án A–D.
  - Part 2: Kiểm tra 25 kịch bản audio A–C nghiêm ngặt 3 lựa chọn.
  - Part 3 & Part 4: Kiểm tra 23 nhóm hội thoại và bài nói, 100% audio scripts và transcripts, đồ họa bảng biểu Flight Schedule (P3) và sơ đồ cửa hàng Store Directory (P4).
  - Timeline 45 phút: Đo đạc và ước lượng thời lượng phát âm thanh theo chuẩn ETS (~150 WPM) kèm các khoảng dừng chuẩn (pause Part 1/2: 1.5–5.0s; pause Part 3/4: 8s/câu = 24s/group; chỉ dẫn directions: 50s/part). Tổng thời lượng ước tính đạt ~2,337s (~39.0 phút), bám sát mốc 45 phút (2,700s).
  - Nguyên tắc trung thực tuyệt đối: Kho lưu trữ hiện tại không chứa file âm thanh phòng thu (0/54 tệp). Không tạo file rỗng, silent filler hay tự nhận đạt Strict Mock. Khóa nghiêm ngặt chế độ Strict Mock (`strictLocked: true`) với lý do giải trình minh bạch.
- Thiết lập hệ thống phân loại 4 bậc trạng thái (4-Tier Readiness Classification):
  - `'invalid'`: Sai cấu trúc hoặc khiếm khuyết liên kết thực thể.
  - `'content-ready'`: Đủ câu hỏi và đáp án nhưng media chưa đạt tiêu chuẩn.
  - `'simulation-ready'`: 100% câu hỏi, kịch bản âm thanh, ảnh minh họa SVG sẵn sàng cho chế độ thi thử mô phỏng (Simulation Mode qua Web Speech API).
  - `'strict-ready'`: 100% tệp âm thanh phòng thu và timeline đã qua kiểm chứng (hiện bị khóa minh bạch).
- Registry quản lý đề thi và Compiler động:
  - Quản lý Map đa mã đề, tra cứu theo ID và test code.
  - Bộ lọc đề thi khả dụng theo bậc tối thiểu `getAvailableExamForms({ minStatus, strictOnly })`.
  - Cơ chế bảo vệ content revision, ngăn ghi đè hoặc hạ cấp phiên bản đề thi đang được phiên làm bài tham chiếu.
  - Compiler động `compileStandardExamForm` cho phép tự động biên dịch đề thi 200 câu mới tuân thủ 100% blueprint ETS.
- Kiểm thử mục tiêu (Targeted Tests): 46 assertions qua 8 suites bao phủ toàn bộ ràng buộc và luồng nghiệp vụ.

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/types/mockExam.ts`:
  - Khai báo kiểu `ExamReadinessStatus = 'invalid' | 'content-ready' | 'simulation-ready' | 'strict-ready'`.
  - Mở rộng `ExamMediaRef` thêm các trường `readinessStatus`, `strictLocked`, `lockReason`.
  - Khai báo các interface kiểm định: `MediaReadinessIssue`, `PartMediaAudit`, `ExamMediaReadinessReport`.
- `src/utils/mediaReadiness.ts`:
  - Bộ kiểm định chuyên sâu tài nguyên Listening và mốc thời gian ETS 45 phút: `auditPart1Media`, `auditPart2Media`, `auditPart3Media`, `auditPart4Media`, `assessExamFormMediaReadiness`.
  - Hằng số ETS: `ETS_AVERAGE_WPM` (150 WPM), `ETS_PART1_STATEMENT_PAUSE_SECONDS` (1.5s), `ETS_PART1_RESPONSE_PAUSE_SECONDS` (5.0s), `ETS_PART2_RESPONSE_PAUSE_SECONDS` (5.0s), `ETS_PART_DIRECTIONS_ALLOWANCE_SECONDS` (50.0s), `ETS_GROUP_QUESTION_PAUSE_SECONDS` (8.0s), `ETS_LISTENING_TARGET_DURATION_SECONDS` (2,700s).
  - Tích hợp kiểm định cấu trúc đề thi `validateExamFormStructure` vào báo cáo readiness tổng thể.
- `src/data/examForms/etsMockForm01.ts`:
  - Đề thi mẫu chuẩn ETS 200 câu: `CANONICAL_ETS_EXAM_FORM_01` (`id: 'ets-mock-form-01'`, `code: 'ETS-2026-SIM-01'`).
  - Hàm kiến tạo `buildCanonicalExamForm01()` lắp ráp tuần tự 200 câu hỏi và 42 nhóm câu hỏi từ Question Bank, tính toán fingerprint nội dung.
- `src/utils/examFormRegistry.ts`:
  - Đăng ký và quản lý ExamForm: `registerExamForm`, `getExamFormById`, `getExamFormByCode`, `getAllExamForms`, `getAvailableExamForms`, `unregisterExamForm`, `resetExamFormRegistry`.
  - Compiler đề thi chuẩn ETS: `compileStandardExamForm(options)`.
  - Cơ chế kiểm soát hạ cấp phiên bản nội dung (content revision guard).
- `src/data/examForms/index.ts`:
  - Barrel export cho module Exam Forms và Registry.
- `src/utils/__tests__/examFormReadiness.test.ts`:
  - Bộ kiểm thử 46 assertions bao quát 8 test suites:
    - Suite 1: ExamForm Assembly & 200-Question Cardinality (8 tests).
    - Suite 2: Sequential Ordering (1..200) & Canonical Part Bounds (3 tests).
    - Suite 3: Group Boundary Integrity & Two-Way Relational Linkages (7 tests).
    - Suite 4: Media Assets & Visual Registry Integrity (5 tests).
    - Suite 5: Audio Scripts, Transcripts & Turn Segments Integrity (6 tests).
    - Suite 6: Listening Section Timeline & Spoken Pacing Estimation (1 test).
    - Suite 7: 4-Tier Readiness Classification & Strict Lock Enforcement (5 tests).
    - Suite 8: Exam Form Registry Operations & Revision Guards (11 tests).

#### Changed
- `src/utils/questionBankLookup.ts`: Xuất khẩu adapter tra cứu mặc định `defaultLookup`.
- `src/utils/examBlueprintValidator.ts`: Tái xuất khẩu `defaultLookup` cho các tiện ích kiểm định.
- `package.json`: Bổ sung script `"test:exam-readiness"` và xâu chuỗi vào lệnh `"test:validation"`.
- `docs/FILE_INDEX.md`: Cập nhật phiên bản lên `2.17.0-phase9-examform-readiness`, bổ sung 5 hàng danh mục file mới (STT 96–100) và sơ đồ kiến trúc hệ thống.

#### Fixed
- Sửa cơ chế phát hiện đồ họa bảng biểu trong `auditPart3Media` và `auditPart4Media` nhằm hỗ trợ song song cả thuộc tính `grp.media.graphic` và `grp.media.visual`.
- Tích hợp phát hiện khiếm khuyết cấu trúc (structural defect) trong `assessExamFormMediaReadiness`, phân loại ngay lập tức đề thi thiếu câu (<200 câu) thành trạng thái `'invalid'` và kích hoạt cờ khóa Strict Mock.

---

### Kết quả kiểm định chất lượng (Verification & Build)
- **Kiểm thử đề thi & Media Readiness (`npm run test:exam-readiness`):** 46/46 bài kiểm tra đạt (0 thất bại).
- **Kiểm thử toàn diện hệ thống (`npm run test:validation`):** 15 test suites toàn bộ workspace đạt 100%.
- **Kiểm tra cú pháp & mã nguồn (`npm run lint`):** Oxlint quét 85 files, 0 errors, 132 warnings (pre-existing JSX/React refresh warnings).
- **Biên dịch & đóng gói (`npm run build`):** TypeScript `tsc -b` và Vite build hoàn tất thành công trong 658ms, không phát sinh lỗi kiểu dữ liệu.

---

### Handoff Notes & Kế hoạch tiếp theo
- Đề thi `CANONICAL_ETS_EXAM_FORM_01` đạt chuẩn **Simulation-Ready** với 100% kịch bản âm thanh và hình minh họa SVG.
- Chế độ **Strict Mock** hiện đang bị khóa có chủ đích (`strictLocked: true`, lý do: chưa tích hợp gói âm thanh phòng thu và timeline kiểm chứng). Tuyệt đối không mở khóa Strict Mock cho đến khi có bản thu âm thanh studio thực tế.
- Sẵn sàng chuyển giao cho Phase 10: Xây dựng Exam Session Engine và môi trường thi thử Full Mock 200 câu.

---

## [2.16.0-phase8-reading-part7-multi] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 8 — Hoàn Thiện Ngân Hàng Đoạn Văn Kép & Ba Reading Part 7 Multiple Passages (Double & Triple Passages)**

### Mục tiêu
Hoàn thiện dữ liệu Part 7 Multiple Passages (Reading Comprehension) phục vụ ExamForm chuẩn ETS 200 câu:
- Đúng 5 multiple-passage groups, mỗi group đúng 5 câu hỏi = tổng cộng đúng 25 câu hỏi hợp lệ (tương ứng Q176–Q200 theo chuẩn TOEIC ETS).
- Bắt buộc có cả Double Passages và Triple Passages theo chuẩn phân bổ ETS:
  - 2 Double Passages (`grp-p7-011`, `grp-p7-012`, Q176–Q185): mỗi nhóm gồm đúng 2 tài liệu liên quan trực tiếp và 5 câu hỏi.
  - 3 Triple Passages (`grp-p7-013`, `grp-p7-014`, `grp-p7-015`, Q186–Q200): mỗi nhóm gồm đúng 3 tài liệu liên quan trực tiếp và 5 câu hỏi.
- Tổng cộng 13 tài liệu công sở tiếng Anh tự nhiên, có liên hệ logic chặt chẽ:
  - `grp-p7-011` (Double, 5 Qs: `q-p7-030`..`q-p7-034`): Email + Form/Invoice — *Catering Service Booking Request & Itemized Invoice* (Corporate Hospitality & Event Catering)
  - `grp-p7-012` (Double, 5 Qs: `q-p7-035`..`q-p7-039`): Advertisement + Email — *Harborfront Hub Office Suites & Cascade FinTech Lease Inquiry* (Commercial Real Estate & Office Leasing)
  - `grp-p7-013` (Triple, 5 Qs: `q-p7-040`..`q-p7-044`): Schedule + Memo + Email — *Global Fintech Innovation Expo Day 1 Program, Speaker Memo, and Trip Expense Email* (Professional Conferences & Business Travel)
  - `grp-p7-014` (Triple, 5 Qs: `q-p7-045`..`q-p7-049`): Article/Catalog + Email + Form/Tracking Report — *Optima Robotics Robotic Arms, Apex Automotive PO #APX-8820, and Pacific Cargo Tracking* (Industrial Automation & International Freight Logistics)
  - `grp-p7-015` (Triple, 5 Qs: `q-p7-050`..`q-p7-054`): Facility Notice + Reservation Email + Article/Review — *Highland Grand Hotel Refurbishment, Sterling Life Insurance Retreat Booking, and Executive Review* (Hospitality Management & Corporate Retreat)
- Khai thác tối đa câu hỏi tổng hợp thông tin giữa nhiều văn bản (Cross-Text Information Synthesis, `crossTextReference: true`, `questionType: 'cross_text_synthesis'`) với 9 câu hỏi tổng hợp đa văn bản đòi hỏi kết hợp thông tin giữa văn bản 1 và 2, văn bản 2 và 3, hoặc văn bản 1 và 3.
- Bằng chứng và lời giải sư phạm chi tiết tiếng Việt, chỉ rõ nguồn văn bản cung cấp căn cứ chọn đáp án.
- Phân bố đáp án cân bằng:
  - Multiple Passages (25 Qs): A: 6 (24%), B: 6 (24%), C: 6 (24%), D: 7 (28%).
  - Toàn bộ Part 7 (54 Qs = 29 Single + 25 Multiple): A: 13 (24.1%), B: 13 (24.1%), C: 14 (25.9%), D: 14 (25.9%).
- Hoàn thiện toàn bộ Question Bank 7 Parts: 204 câu hỏi (104 Listening + 100 Reading), 42 groups (23 Listening + 19 Reading), 100% hợp lệ, không có orphan question hay orphan group.
- Xây dựng test suite chuyên biệt `readingContentPart7Multi.test.ts` (44 assertions) kiểm định toàn bộ khía cạnh đa văn bản.

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/utils/__tests__/readingContentPart7Multi.test.ts`:
  - Bộ kiểm định contract test suite 44 assertions bao gồm 7 test suites độc lập:
    - Suite 1: Multiple Passage Cardinality & ETS Blueprint Alignment (6 tests) — xác nhận đúng 5 nhóm multiple passages, 25 câu hỏi tuần tự `q-p7-030`..`q-p7-054`, đúng 5 câu/group, Group IDs ổn định `grp-p7-011`..`grp-p7-015`.
    - Suite 2: Representation of Double and Triple Passages (7 tests) — xác nhận chính xác 2 Double Passages (`grp-p7-011`, `grp-p7-012`, mỗi nhóm 2 văn bản), 3 Triple Passages (`grp-p7-013`, `grp-p7-014`, `grp-p7-015`, mỗi nhóm 3 văn bản), tổng 13 văn bản.
    - Suite 3: Document Authenticity, Inter-Document Logic & Format Types (6 tests) — kiểm tra 13 văn bản đạt chuẩn độ dài (>100 ký tự), formatType hợp lệ, liên kết thể loại thực tế (Email + Form/Invoice, Ad + Email, Schedule + Memo + Email, Catalog + Email + Tracking, Notice + Email + Review).
    - Suite 4: Cross-Text Information Synthesis & Multi-Document Evidence (4 tests) — kiểm tra mỗi nhóm đều có câu hỏi cross-text, tổng 9 câu hỏi `cross_text_synthesis`, giải thích chi tiết có trích dẫn văn bản.
    - Suite 5: Options, Choices & Balanced Key Distribution (3 tests) — kiểm tra 4 lựa chọn A–D không trùng, phân bố Multiple Passages (A:6, B:6, C:6, D:7), phân bố Part 7 tổng hợp (A:13, B:13, C:14, D:14).
    - Suite 6: Global Validation Engine & Schema Conformity (4 tests) — 100% nhóm và câu hỏi vượt qua `validateQuestionGroup` và `validateQuestion` với 0 lỗi, liên kết 2 chiều và thứ tự 1..5 nghiêm ngặt.
    - Suite 7: Full 7-Part Question Bank & Reading Bank Integration (4 tests) — Full Part 7 đạt 15 groups / 54 câu; Reading Bank đạt 100 câu / 19 groups; Full Question Bank đạt 204 câu / 42 groups; `FULL_QUESTION_BANK_MANIFEST` v2.9.0; tính duy nhất toàn cục của 204 Question IDs và 42 Group IDs.

#### Changed
- `src/data/questionBank/part7Reading.ts`:
  - Mở rộng `PART7_MULTI_GROUPS` từ 2 groups (10 Qs) thành đúng 5 groups (25 Qs: 2 Double + 3 Triple):
    - `grp-p7-011`: Double (Email + Form/Invoice, 5 Qs: `q-p7-030`..`q-p7-034`)
    - `grp-p7-012`: Double (Advertisement + Email, 5 Qs: `q-p7-035`..`q-p7-039`)
    - `grp-p7-013`: Triple (Schedule + Memo + Email, 5 Qs: `q-p7-040`..`q-p7-044`)
    - `grp-p7-014`: Triple (Catalog Article + Email + Tracking Form, 5 Qs: `q-p7-045`..`q-p7-049`)
    - `grp-p7-015`: Triple (Facility Notice + Reservation Email + Customer Review Article, 5 Qs: `q-p7-050`..`q-p7-054`)
  - Mở rộng `PART7_MULTI_QUESTIONS` thành 25 câu hỏi đầy đủ metadata, options, keys, distractors và explanations.
  - Hợp nhất `PART7_GROUPS` (15 groups: 10 single + 5 multiple) và `PART7_QUESTIONS` (54 questions: 29 single + 25 multiple).
- `src/data/questionBank/readingBank.ts`:
  - Nâng cấp `PART7_PARTITION.version` lên `'2.6.0'`.
  - Re-export `PART7_MULTI_GROUPS` và `PART7_MULTI_QUESTIONS`.
  - Cập nhật số liệu Reading Bank: 100 questions (P5: 30, P6: 16, P7: 54), 19 groups (P6: 4, P7: 15).
- `src/data/questionBank/index.ts`:
  - Nâng cấp `FULL_QUESTION_BANK_MANIFEST.version` lên `'2.9.0'`.
  - Cập nhật tổng số câu hỏi toàn cục: 204 questions (104 Listening + 100 Reading).
  - Cập nhật tổng số groups toàn cục: 42 groups (23 Listening + 19 Reading).
- `src/utils/__tests__/readingWorkspace.test.ts`:
  - Cập nhật tham chiếu nhóm Triple Passage trong Suite 1 và Suite 4 từ `grp-p7-012` sang `grp-p7-013` (vì `grp-p7-012` nay là Double Passage theo đúng blueprint Q176–Q185).
- `src/utils/__tests__/questionBankValidator.test.ts`:
  - Cập nhật Suite 5 Reading Bank: 100 câu hỏi, 19 groups, Part 7 gồm 15 groups / 54 câu (10 single, 2 double, 3 triple).
  - Cập nhật Suite 6 Full Bank: 204 câu hỏi, 42 groups, kiểm định tính duy nhất của 204 QIDs và 42 GIDs.
- `src/utils/__tests__/questionSelector.test.ts`:
  - Cập nhật kỳ vọng `getBankAvailability`: 204 totalQuestions, 42 totalGroups, Part 7 total = 54.
- `package.json`:
  - Thêm script `test:reading-p7-multi` và nối vào chuỗi `test:validation`.
- `docs/FILE_INDEX.md`:
  - Cập nhật phiên bản lên `2.16.0-phase8-reading-part7-multi`.
  - Bổ sung entry cho `src/utils/__tests__/readingContentPart7Multi.test.ts` (hàng 95).
  - Cập nhật cây kiến trúc phân cấp Question Bank với các chỉ số 204 câu / 42 groups.

---

### Kết quả kiểm định / Build
- **Linter (`npm run lint`):** 0 errors, 127 warnings (tồn tại từ trước trong các UI components).
- **TypeScript build (`npm run build`):** Biên dịch thành công 100% (`tsc -b && vite build`), sinh gói bundle production không phát sinh lỗi.
- **Contract Tests (`npm run test:reading-p7-multi`):** 44/44 tests passed (100%).
- **Full Validation Pipeline (`npm run test:validation`):** 14 test suites chạy đồng loạt, 100% tests passed (bao gồm validator, selector, session engine, listening audio/workspace, reading workspace, exam blueprint, và toàn bộ 7 Parts content suites).

---

### Các vấn đề còn tồn tại
- Hiện tại toàn bộ 7 Parts của ngân hàng đề thi đã hoàn thiện đầy đủ dữ liệu (104 Listening + 100 Reading = 204 câu, 42 groups).
- Sẵn sàng cho Phase 9 (Full Mock Exam Engine / Exam Workspace 200 câu) ghép nối thành bài thi mô phỏng hoàn chỉnh.

---

## [2.15.0-phase7-reading-part7-single] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 7 — Hoàn Thiện Ngân Hàng Đoạn Văn Đơn Reading Part 7 Single Passages**

### Mục tiêu
Hoàn thiện dữ liệu Part 7 Single Passages (Reading Comprehension) phục vụ ExamForm chuẩn ETS 200 câu:
- Đúng 10 single-passage groups, tổng cộng đúng 29 câu hỏi hợp lệ (tương ứng Q147–Q175 theo chuẩn TOEIC ETS).
- Mỗi passage chứa 2–4 câu theo cấu trúc phân bổ kinh điển: 4 nhóm × 2 câu (8 Qs), 3 nhóm × 3 câu (9 Qs), 3 nhóm × 4 câu (12 Qs) = tổng 29 câu.
- Tái sử dụng các nhóm Practice hợp lệ (`grp-p7-001` .. `grp-p7-003`, `q-p7-001` .. `q-p7-006`), bảo toàn IDs và bổ sung các nhóm mới đạt chuẩn (`grp-p7-004` .. `grp-p7-010`, `q-p7-007` .. `q-p7-029`).
- Bảo tồn dữ liệu Double & Triple Passages đa văn bản sẵn có cho Reading Workspace bằng cách chuyển tiếp an toàn sang `grp-p7-011` (`q-p7-030`..`q-p7-034`) và `grp-p7-012` (`q-p7-035`..`q-p7-039`), không làm gián đoạn các test suite trước đó.
- Tạo lập các văn bản tiếng Anh công sở gốc, tự nhiên, đa dạng 10 thể loại:
  - `grp-p7-001` (2 Qs): Email — *Subscription Renewal Notice* (Software Licensing & Customer Service)
  - `grp-p7-002` (2 Qs): Building Notice — *Elevator Modernization & Service Disruption* (Facilities Management)
  - `grp-p7-003` (2 Qs): Workplace Chat — *Project Handout Review Chat* (Marketing & Presentation Coordination)
  - `grp-p7-004` (2 Qs): Conference Schedule — *Logistics Summit Workshop Timetable* (Supply Chain Management)
  - `grp-p7-005` (3 Qs): Advertisement — *Nexus Executive Workspace Rental* (Real Estate & Co-working Amenities)
  - `grp-p7-006` (3 Qs): Product Profile — *AeroBreeze Air Purifier Specification Sheet* (Office Equipment & Health)
  - `grp-p7-007` (3 Qs): Online Review — *FleetPulse Software User Review* (Vehicle Telematics & Fleet Operations)
  - `grp-p7-008` (4 Qs): Policy Memo — *Remote Workspace Equipment Stipend Policy* (Human Resources & Compliance)
  - `grp-p7-009` (4 Qs): Business Letter — *Notice of Component Delivery Rescheduling* (Manufacturing & Supplier Relations)
  - `grp-p7-010` (4 Qs): Press Release — *BioVanguard Acquisition of Greenfield Agritech* (Biotechnology & Corporate Mergers)
- Bao phủ đầy đủ kỹ năng đọc chuẩn ETS: Purpose, Factual / Detail, Inference, Vocabulary in context, Contextual interpretation, Sentence insertion (đầy đủ các thẻ vị trí `[1]`, `[2]`, `[3]`, `[4]` tuần tự trong bài đọc).
- Cân bằng đáp án tối ưu trên 29 câu: A: 7 (24.1%), B: 7 (24.1%), C: 8 (27.6%), D: 7 (24.1%).
- Xây dựng test suite chuyên biệt `readingContentPart7Single.test.ts` (586 assertions) xác thực cấu trúc, liên kết, phân bổ độ khó, kỹ năng và schema.

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/utils/__tests__/readingContentPart7Single.test.ts`:
  - Bộ kiểm định contract test suite 586 assertions bao gồm 6 test suites độc lập:
    - Suite 1: Single Passage Cardinality & ExamForm Blueprint Alignment (17 tests) — xác nhận đúng 10 nhóm single passages, 29 câu hỏi tuần tự `q-p7-001`..`q-p7-029`, `passageFormat: 'single'`, đúng 1 đoạn văn mỗi nhóm, và cơ cấu kích thước nhóm chuẩn ETS (4 nhóm 2 câu, 3 nhóm 3 câu, 3 nhóm 4 câu = 29 câu).
    - Suite 2: Passage Authenticity & Workplace Genre Diversity (50 tests) — xác nhận 10 thể loại công việc khác nhau (email, notice, chat, schedule, advertisement, article/product profile, article/online review, notice/policy memo, letter, article/press release), tiêu đề và context intro đầy đủ, độ dài văn bản đạt chuẩn công sở ($\ge 150$ ký tự).
    - Suite 3: Group & Question Relational Integrity (155 tests) — xác nhận tính liên kết hai chiều chặt chẽ giữa parent groups và child questions, `orderInGroup` tuần tự 1..N, metadata chuẩn xác (`partNum: 7`, `part: 'Part 7'`, `section: 'reading'`).
    - Suite 4: Question Skill Taxonomy & Evidence Verification (119 tests) — kiểm tra phân loại dạng thức (purpose $\ge 3$, detail $\ge 15$, inference $\ge 3$, vocabulary_in_context $\ge 1$, contextual_interpretation $\ge 1$, sentence_insertion = 2), kiểm tra toàn vẹn câu hỏi chèn câu (options `[1]`..`[4]`, markers `[1]`..`[4]` xuất hiện tuần tự tăng dần trong passage), giải thích sư phạm tiếng Việt sâu sắc ($\ge 40$ ký tự) có dẫn chứng rõ ràng.
    - Suite 5: Options, Choices & Balanced Key Distribution (121 tests) — kiểm tra nghiêm ngặt 4 lựa chọn A–D không trùng lặp, `correctKey` hợp lệ, cân bằng phân bố đáp án A: 7, B: 7, C: 8, D: 7, và mỗi nhóm có tối thiểu 2 đáp án khác nhau.
    - Suite 6: Global Validation Engine & Schema Conformity (124 tests) — xác nhận 100% groups và questions vượt qua `validateQuestionGroup` và `validateQuestion` với 0 lỗi, được tích hợp đầy đủ vào `ALL_READING_GROUPS`, `ALL_READING_QUESTIONS`, `ALL_GROUPS`, `ALL_QUESTIONS`.

#### Changed
- `src/types/questionBank.ts`:
  - Bổ sung `'purpose'` và `'contextual_interpretation'` vào union type `Part7QuestionType` nhằm mô tả chuẩn xác toàn bộ taxonomy câu hỏi Part 7 theo ETS.
- `src/data/questionBank/part7Reading.ts`:
  - Cấu trúc lại toàn bộ phân vùng Part 7 Single Passages với đúng 10 nhóm (`grp-p7-001`..`grp-p7-010`) và 29 câu hỏi (`q-p7-001`..`q-p7-029`).
  - Dời 2 nhóm Double & Triple passage demo trước đó thành `grp-p7-011` (`q-p7-030`..`q-p7-034`) và `grp-p7-012` (`q-p7-035`..`q-p7-039`) để bảo toàn tính độc lập cho Reading Workspace.
  - Cân bằng các phương án lựa chọn và chuẩn hóa đáp án đúng: A: 7, B: 7, C: 8, D: 7.
  - Xuất riêng rẽ `PART7_SINGLE_GROUPS`, `PART7_SINGLE_QUESTIONS`, `PART7_MULTI_GROUPS`, `PART7_MULTI_QUESTIONS`, cùng với các mảng tổng hợp `PART7_GROUPS` (12 groups) và `PART7_QUESTIONS` (39 questions).
- `src/data/questionBank/readingBank.ts`:
  - Nâng cấp `PART7_PARTITION.version` lên `'2.5.0'`, cập nhật tổng số câu hỏi Reading lên 85 câu và tổng số groups lên 16 groups.
  - Re-export `PART7_SINGLE_GROUPS` và `PART7_SINGLE_QUESTIONS`.
- `src/data/questionBank/index.ts`:
  - Cập nhật manifest Question Bank toàn cục: tổng số câu hỏi đạt 189 câu (104 Listening + 85 Reading), tổng số groups đạt 39 (23 Listening + 16 Reading), `FULL_QUESTION_BANK_MANIFEST.version = '2.8.0'`.
- `src/utils/__tests__/readingWorkspace.test.ts`:
  - Đồng bộ test fixture: cập nhật tham chiếu `grp-p7-004` thành `grp-p7-011` (Double passage), `grp-p7-005` thành `grp-p7-012` (Triple passage), và số lượng câu hỏi của `grp-p7-001` từ 3 thành 2 câu. Toàn bộ 69 bài kiểm tra tiếp tục pass 100%.
- `src/utils/__tests__/questionBankValidator.test.ts`:
  - Cập nhật assertions cho Part 7 (12 groups, 39 câu), Reading Bank (85 câu, 16 groups), và Unified Question Bank (189 câu, 39 groups). Toàn bộ 50 tests pass 100%.
- `src/utils/__tests__/questionSelector.test.ts`:
  - Điều chỉnh unit test kiểm tra yêu cầu số lượng câu không khả thi từ 18 thành 1 câu (vì 18 câu khả thi thông qua tổ hợp 4+4+4+3+3=18). Cập nhật số lượng khả dụng của ngân hàng. Toàn bộ 85 tests pass 100%.
- `package.json`:
  - Thêm script `test:reading-p7-single` (`tsx src/utils/__tests__/readingContentPart7Single.test.ts`).
  - Nối `test:reading-p7-single` vào script kiểm tra tổng hợp `test:validation`.

#### Verification & Build
- `npm run test:reading-p7-single`: 586/586 assertions passed (0 errors).
- `npm run test:validation`: Toàn bộ 2,879 assertions passed trên toàn dự án qua 13 test suites (0 errors).
- `npm run lint`: Oxlint 0 errors (120 warnings React Compiler từ mã UI cũ).
- `npm run build`: `tsc -b && vite build` hoàn thành trong 696ms, 0 lỗi TypeScript.

---

## [2.14.0-phase6-reading-part6] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 6 — Hoàn Thiện Ngân Hàng Đoạn Văn Điền Khuyết Reading Part 6 (Reading Content Part 6 — Text Completion)**

### Mục tiêu
Hoàn thiện chất lượng và cấu trúc dữ liệu Question Bank cho phần Part 6 (Text Completion) nhằm đáp ứng trọn vẹn yêu cầu của một ExamForm chuẩn ETS 200 câu:
- Đảm bảo đúng 4 passage groups hợp lệ × 4 câu = 16 câu hỏi (`grp-p6-001` .. `grp-p6-004`, `q-p6-001` .. `q-p6-016`).
- Tái sử dụng các nhóm Part 6 đã có trong Practice Engine, giữ nguyên Group IDs và Question IDs để bảo toàn lịch sử người học.
- Chuẩn hóa 4 văn bản công sở hoàn chỉnh với 4 vị trí blank xác định theo thứ tự tăng dần (`[131]`..`[134]`, `[135]`..`[138]`, `[139]`..`[142]`, `[143]`..`[146]`).
- Đa dạng thể loại văn bản công việc thực tế:
  - `grp-p6-001`: Email — *Upcoming Headquarters Relocation Timeline* (Vận hành & Cơ sở vật chất).
  - `grp-p6-002`: Memorandum — *Enterprise Resource Software Migration* (Công nghệ thông tin & Quản trị hệ thống).
  - `grp-p6-003`: Public Notice — *Annual Employee Wellness Day* (Nhân sự & Y tế doanh nghiệp).
  - `grp-p6-004`: Formal Letter — *Response to Order Discrepancy Inquiry* (Chăm sóc khách hàng & Xử lý đơn hàng).
- Đảm bảo hỗ trợ đầy đủ các dạng thức câu hỏi của ETS: từ loại (grammar/word form), từ vựng/collocation/liên từ chuyển tiếp (vocabulary), và chèn câu hoàn chỉnh (sentence insertion - đúng 1 câu mỗi nhóm).
- Cân bằng hoàn hảo phân bố đáp án đúng trên toàn bộ 16 câu: A: 4 (25.0%), B: 4 (25.0%), C: 4 (25.0%), D: 4 (25.0%); mỗi nhóm chứa trọn vẹn đủ cả 4 keys A, B, C, D không lặp lại.
- Tinh chỉnh dấu câu văn bản gốc: loại bỏ dấu chấm thừa sau chỗ trống chèn câu (`[132].` -> `[132]`, `[136].` -> `[136]`, `[141].` -> `[141]`, `[144].` -> `[144]`) để khi tái tạo văn bản (reconstructed passage) với phương án đúng không xuất hiện dấu chấm kép (`..`).
- Xây dựng bộ targeted contract test suite 292 assertions xác thực toàn diện tính toàn vẹn Part 6, mapping blank 1–4, và kiểm tra tái tạo văn bản hoàn chỉnh.

---

### Những nội dung thực tế đã triển khai

#### Changed
- `src/data/questionBank/part6Reading.ts`:
  - Rà soát và tinh chỉnh 4 nhóm đoạn văn công sở (`grp-p6-001` .. `grp-p6-004`) và 16 câu hỏi (`q-p6-001` .. `q-p6-016`).
  - Chuẩn hóa vị trí placeholder chèn câu trong `passageContent`, loại bỏ dấu chấm sau token `[XXX]` để bảo đảm khi ghép câu chèn nguyên câu có kết thúc bằng dấu chấm không bị sinh lỗi cú pháp `..`.
  - Điều chỉnh thứ tự các phương án lựa chọn nhằm cân bằng tuyệt đối phân bố đáp án đúng (A: 4, B: 4, C: 4, D: 4), đồng thời bảo đảm mỗi passage group đều có đúng 1 đáp án A, 1 đáp án B, 1 đáp án C, và 1 đáp án D.
  - Bảo toàn 100% lời giải thích chi tiết tiếng Việt và hệ thống skill tags sư phạm.
- `package.json`:
  - Thêm script kiểm thử `test:reading-p6` (`tsx src/utils/__tests__/readingContentPart6.test.ts`).
  - Bổ sung `test:reading-p6` vào chuỗi script kiểm tra tổng hợp `test:validation`.

#### Added
- `src/utils/__tests__/readingContentPart6.test.ts`:
  - Bộ kiểm định contract test suite 292 assertions bao gồm 6 test suites độc lập:
    - Suite 1: Group Cardinality & ExamForm Readiness (13 tests) — xác nhận đúng 4 groups, 16 questions, ID ổn định, 4 thể loại văn bản khác nhau (email, memo, notice, letter), và đủ các cấp độ phân hóa độ khó.
    - Suite 2: Blank Mapping & Sequential Integrity (40 tests) — xác nhận mỗi group có 4 câu, thứ tự `orderInGroup` 1..4, `blankNumber` tuần tự 131..146, các blank xuất hiện duy nhất 1 lần trong bài đọc và theo thứ tự xuất hiện tăng dần từ trên xuống dưới.
    - Suite 3: Question Types Diversity & Explanations (38 tests) — kiểm tra phân loại dạng câu hỏi (grammar $\ge 4$, vocabulary $\ge 4$, sentence insertion = 4), mỗi group có đúng 1 câu sentence insertion, giải thích tiếng Việt sư phạm $\ge 40$ ký tự, skillTag rõ ràng.
    - Suite 4: Options, Choices & Balanced Key Distribution (73 tests) — kiểm tra nghiêm ngặt 4 lựa chọn A–D không trùng lặp, `correctKey` hợp lệ, phân bố đáp án toàn cục đạt chuẩn tuyệt đối A: 4, B: 4, C: 4, D: 4 (mỗi key chiếm 25%), và mỗi group sở hữu trọn vẹn cả 4 key A–D.
    - Suite 5: Text Reconstruction & Passage Integrity (24 tests) — kiểm tra thuật toán tái tạo văn bản hoàn chỉnh bằng cách điền đáp án đúng vào các chỗ trống `[131]`..`[146]`: bảo đảm 100% token được thay thế, không còn sót placeholder `[XXX]`, không bị lỗi dấu câu kép `..`, độ dài văn bản mở rộng tự nhiên, và các câu chèn kết thúc bằng dấu câu hợp lệ.
    - Suite 6: Global Validation Engine & Schema Conformity (104 tests) — xác nhận 100% groups và questions vượt qua `validateQuestionGroup` và `validateQuestion` với 0 lỗi, được tích hợp đầy đủ vào `ALL_READING_GROUPS`, `ALL_READING_QUESTIONS`, `ALL_GROUPS`, `ALL_QUESTIONS`.

#### Verification & Build
- `npm run test:reading-p6`: 292/292 tests passed (0 errors).
- `npm run test:validation`: Toàn bộ 2,293 assertions passed trên toàn dự án (0 errors).
- `npm run lint`: Oxlint 0 errors (117 warnings không liên quan từ code UI cũ).
- `npm run build`: `tsc -b && vite build` hoàn thành trong 555ms, 0 lỗi TypeScript.

---

## [2.13.0-phase5-reading-part5] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 5 — Hoàn Thiện Ngân Hàng Câu Điền Vào Chỗ Trống Reading Part 5 (Reading Content Part 5 — Incomplete Sentences)**

### Mục tiêu
Hoàn thiện chất lượng và số lượng Question Bank cho phần Part 5 (Incomplete Sentences) nhằm đáp ứng trọn vẹn yêu cầu tối thiểu của một ExamForm chuẩn ETS 200 câu:
- Đảm bảo tối thiểu 30 câu hỏi Part 5 hợp lệ (`q-p5-001` đến `q-p5-030`).
- Tái sử dụng và giữ nguyên vẹn 20 câu hiện có (`q-p5-001` .. `q-p5-020`), không làm thay đổi ID tránh ảnh hưởng lịch sử người học.
- Bổ sung 10 câu hỏi trắc nghiệm mới (`q-p5-021` .. `q-p5-030`) với ngữ cảnh doanh nghiệp chân thực, câu chứa blank tiêu chuẩn `_____`, đúng 4 phương án A–D, đúng 1 đáp án chính xác được thẩm định logic ngữ pháp, và lời giải thích tiếng Việt sư phạm chi tiết giải mã căn cứ ngữ pháp và phân tích phương án nhiễu (distractors).
- Phân bổ phong phú và bao phủ các chủ điểm ngữ pháp trọng yếu trong đề thi TOEIC:
  - `q-p5-021`: Gerunds & Infinitives (Danh động từ sau cụm cố định "dedicated to + V-ing").
  - `q-p5-022`: Comparisons (So sánh hơn tính từ dài với trạng từ nhấn mạnh "significantly more favorable than").
  - `q-p5-023`: Conjunctions & Time Clauses (Quy tắc phối thì hiện tại đơn trong mệnh đề thời gian "once they complete").
  - `q-p5-024`: Business Collocation & Vocabulary (Cụm danh từ kinh tế "budgetary constraints").
  - `q-p5-025`: Pronouns & Quantifiers (Lượng từ "another" đi với danh từ số ít).
  - `q-p5-026`: Prepositions (Giới từ chỉ thời gian "prior to" đi với danh động từ bị động "being transported").
  - `q-p5-027`: Word Form & Linking Verbs (Tính từ bổ nghĩa chủ ngữ sau linking verb "remains steady").
  - `q-p5-028`: Relative Clauses (Mệnh đề quan hệ rút gọn thể bị động "Replacement parts ordered directly...").
  - `q-p5-029`: Business Vocabulary (Động từ hành động điều hành "implement the proposed guidelines").
  - `q-p5-030`: Conditionals & Conjunctions (Liên từ điều kiện "provided that" = as long as / if).
- Cân bằng tự nhiên phân bố đáp án đúng trên toàn bộ 30 câu: A: 9 (30.0%), B: 8 (26.7%), C: 7 (23.3%), D: 5 (16.7%).
- Xây dựng bộ contract tests 316 assertions xác thực toàn diện tính toàn vẹn Part 5.
- Đưa tổng số câu hỏi Reading Bank đạt 66 câu, tổng Question Bank đạt 170 câu / 32 groups.

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/data/questionBank/part5Reading.ts`:
  - Bổ sung 10 câu hỏi Part 5 Incomplete Sentences chuẩn ETS (`q-p5-021` .. `q-p5-030`) với ngữ cảnh văn phòng/doanh nghiệp tự nhiên, 4 phương án A–D, 1 đáp án đúng và lời giải thích chi tiết tiếng Việt.
- `src/utils/__tests__/readingContentPart5.test.ts`:
  - Bộ kiểm định contract tests 316 assertions gồm 5 test suites độc lập:
    - Suite 1: Question Count, ID Continuity & ExamForm Readiness (8 tests) — xác nhận đủ 30 câu, ID tuần tự từ `q-p5-001` đến `q-p5-030`, độ phân hóa độ khó (easy: 9, medium: 14, hard: 7).
    - Suite 2: Sentence Structure & Blank Integrity (90 tests) — xác nhận mỗi câu có độ dài thực tế, chứa đúng blank `_____`, có chủ đề doanh nghiệp rõ ràng.
    - Suite 3: Options, Choices & Balanced Key Mapping (124 tests) — kiểm tra đúng 4 phương án A–D, không trùng lựa chọn, đáp án hợp lệ, và phân bố key cân đối.
    - Suite 4: Pedagogical Explanations & Grammar Taxonomy Diversity (91 tests) — kiểm tra lời giải sư phạm chi tiết $\ge 40$ ký tự, grammarCategory, skillTag, và độ phủ rộng 25 chủ điểm ngữ pháp.
    - Suite 5: Global Validation Engine & Schema Conformity (3 tests) — kiểm tra 100% câu hỏi pass `validateQuestion` với 0 errors, được tích hợp vào `ALL_READING_QUESTIONS` và `ALL_QUESTIONS`.

#### Changed
- `src/data/questionBank/part5Reading.ts`:
  - Nâng quy mô từ 20 câu lên 30 câu Incomplete Sentences.
- `src/data/questionBank/readingBank.ts`:
  - Cập nhật số lượng Reading Bank từ 56 câu lên 66 câu; nâng phiên bản phân vùng `PART5_PARTITION.version` lên `'2.4.0'`.
- `src/data/questionBank/index.ts`:
  - Cập nhật tổng số câu hỏi Question Bank từ 160 lên 170 câu, tổng groups giữ 32 groups.
  - Nâng phiên bản manifest toàn cục `FULL_QUESTION_BANK_MANIFEST.version` lên `'2.7.0'`.
- `package.json`:
  - Thêm script lệnh `test:reading-p5` (`tsx src/utils/__tests__/readingContentPart5.test.ts`).
  - Tích hợp `test:reading-p5` vào pipeline kiểm định tổng hợp `test:validation`.
- `src/utils/__tests__/questionBankValidator.test.ts`:
  - Cập nhật assertions cho Reading Bank (66 câu, 9 groups), Part 5 (30 câu), và Full Question Bank (170 câu, 32 groups).
- `src/utils/__tests__/questionSelector.test.ts`:
  - Cập nhật assertions kiểm tra tổng số câu ngân hàng khả dụng (170 câu, 32 groups).
- `src/utils/__tests__/readingWorkspace.test.ts`:
  - Cập nhật assertion Suite 2 kiểm tra Part 5 đạt đủ 30 câu hỏi.
- `docs/FILE_INDEX.md`:
  - Cập nhật metadata phiên bản `2.13.0-phase5-reading-part5`, cập nhật các dòng 3, 47, 50, 51, bổ sung Row 92 cho `src/utils/__tests__/readingContentPart5.test.ts` và cập nhật sơ đồ cây kiến trúc Reading Bank.

---

### Kết quả kiểm định và chất lượng
- `npm run test:reading-p5`: 5 test suites, 316/316 assertions PASS (100%).
- `npm run test:validation`: Toàn bộ 11 test suites, 2,001/2,001 assertions PASS (100%).
- `npm run build`: `tsc -b && vite build` biên dịch thành công trong 535ms với 0 lỗi.
- `npm run lint`: `oxlint` quét toàn bộ codebase 0 lỗi, 0 cảnh báo trong module mới.
- Dữ liệu người dùng và LocalStorage key `toeic_mastery_data_v2_cold` hoàn toàn được bảo toàn.

---

## [2.12.0-phase4-listening-part4] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 4 — Hoàn Thiện Ngân Hàng Bài Nói Ngắn Listening Part 4 (Listening Content Part 4 — Short Talks)**

### Mục tiêu
Hoàn thiện Question Bank cho phần Part 4 (Short Talks) nhằm đáp ứng trọn vẹn yêu cầu tối thiểu của một ExamForm chuẩn ETS 200 câu:
- Đảm bảo tối thiểu 10 nhóm bài nói ngắn hợp lệ, mỗi nhóm đúng 3 câu hỏi liên kết theo thứ tự, tổng cộng 30 câu hỏi (`grp-p4-001` đến `grp-p4-010`, `q-p4-001` đến `q-p4-030`).
- Tái sử dụng và giữ nguyên vẹn 5 nhóm hiện có (`grp-p4-001` .. `grp-p4-005` và `q-p4-001` .. `q-p4-015`), không thay đổi ID tránh ảnh hưởng lịch sử người học.
- Bổ sung 5 nhóm bài nói mới (`grp-p4-006` .. `grp-p4-010`) kèm 15 câu hỏi (`q-p4-016` .. `q-p4-030`) với kịch bản độc thoại tự nhiên, ngữ cảnh thực tế, transcript và audio script chính xác, bao phủ các tình huống ETS đa dạng:
  - `grp-p4-006`: Public Transit Announcement & Weekend Rail Track Maintenance (`q-p4-016` .. `q-p4-018`).
  - `grp-p4-007`: Business Presentation & Q3 SaaS Subscription Growth Metrics (`q-p4-019` .. `q-p4-021`).
  - `grp-p4-008`: Cultural Event & Riverside Jazz Festival Schedule Revision (`q-p4-022` .. `q-p4-024`).
  - `grp-p4-009`: Corporate Voicemail & Custom Packaging Sample Approval (`q-p4-025` .. `q-p4-027`).
  - `grp-p4-010`: Factory Tour Welcome & Safety Equipment Protocol (`q-p4-028` .. `q-p4-030`).
- Mỗi nhóm bảo đảm liên kết hai chiều chặt chẽ (`groupId`, `questionIds`), thứ tự câu hỏi `orderInGroup` 1..3, 4 phương án A–D, đúng 1 đáp án chính xác, và lời giải thích tiếng Việt sư phạm chi tiết giải mã bẫy nghe ETS.
- Bảo toàn nhóm bảng biểu đồ họa Group 3 (`store_directory_graphic`) liên kết với SVG component trong `listeningIllustrationsMap.ts`.
- Xây dựng bộ contract tests 364 assertions xác thực toàn diện tính toàn vẹn Part 4.
- Đưa tổng số câu hỏi Listening Bank đạt 104 câu (vượt mốc 100 câu cho ExamForm 200 câu), tổng Question Bank đạt 160 câu.

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/data/questionBank/part4Listening.ts`:
  - Bổ sung 5 nhóm bài nói ngắn độc thoại chuẩn ETS (`grp-p4-006` .. `grp-p4-010`):
    - `grp-p4-006`: Public Transit Announcement & Weekend Rail Track Maintenance (`q-p4-016` .. `q-p4-018`).
    - `grp-p4-007`: Business Presentation & Q3 SaaS Subscription Growth Metrics (`q-p4-019` .. `q-p4-021`).
    - `grp-p4-008`: Cultural Event & Riverside Jazz Festival Schedule Revision (`q-p4-022` .. `q-p4-024`).
    - `grp-p4-009`: Corporate Voicemail & Custom Packaging Sample Approval (`q-p4-025` .. `q-p4-027`).
    - `grp-p4-010`: Factory Tour Welcome & Safety Equipment Protocol (`q-p4-028` .. `q-p4-030`).
  - Bổ sung 15 câu hỏi trắc nghiệm mới (`q-p4-016` .. `q-p4-030`) với 4 lựa chọn A–D, đáp án cân bằng trên toàn bộ Part 4 (A: 8, B: 11, C: 6, D: 5), và lời giải chi tiết sư phạm.
- `src/utils/__tests__/listeningContentPart4.test.ts`:
  - Bộ kiểm định contract tests 364 assertions gồm 5 test suites độc lập:
    - Suite 1: Part 4 Group Cardinality & ExamForm Readiness (33 tests) — xác nhận đủ 10 groups, 30 questions, tỷ lệ 1 group = 3 questions.
    - Suite 2: Monologue Authenticity, Single-Speaker Formats & Spoken Context (40 tests) — xác nhận kịch bản độc thoại tự nhiên đơn speaker, audioScript, transcript, spoken text.
    - Suite 3: Topic & Genre Diversity, Graphic Context Integrity (11 tests) — xác nhận phân bổ đa dạng các thể loại announcements, voicemails, instructions, news, transit, presentations, events và graphic Store Directory.
    - Suite 4: Question Options, Keys, Two-Way Linkage & Explanations (276 tests) — kiểm tra 4 options A–D, tính đúng đắn correctKey, phân bố đáp án, lời giải thích và liên kết hai chiều.
    - Suite 5: Global ID Uniqueness & Schema Validator Passing (4 tests) — kiểm tra 100% group IDs và question IDs duy nhất, 100% pass `validateQuestionGroup` và `validateQuestion`.

#### Changed
- `src/data/questionBank/part4Listening.ts`:
  - Nâng quy mô từ 5 groups (15 câu) lên 10 groups (30 câu).
- `src/data/questionBank/listeningBank.ts`:
  - Cập nhật số lượng Part 4 từ 5 groups (15 câu) lên 10 groups (30 câu); tổng Listening Bank nâng từ 89 câu lên 104 câu, 23 groups (đủ chỉ tiêu $\ge 100$ câu Listening cho ExamForm chuẩn).
  - Nâng phiên bản phân vùng `PART4_PARTITION.version` lên `'2.3.0'`.
- `src/data/questionBank/index.ts`:
  - Cập nhật tổng số câu hỏi Question Bank từ 145 lên 160 câu, tổng groups từ 27 lên 32 groups.
  - Nâng phiên bản manifest toàn cục `FULL_QUESTION_BANK_MANIFEST.version` lên `'2.6.0'`.
- `package.json`:
  - Thêm script lệnh `test:listening-p4` (`tsx src/utils/__tests__/listeningContentPart4.test.ts`).
  - Tích hợp `test:listening-p4` vào pipeline kiểm định tổng hợp `test:validation`.
- `src/utils/__tests__/questionBankValidator.test.ts`:
  - Cập nhật assertions cho Listening Bank (104 câu, 23 groups), Part 4 (10 groups, 30 câu), và Full Question Bank (160 câu, 32 groups).
- `src/utils/__tests__/questionSelector.test.ts`:
  - Cập nhật assertions kiểm tra tổng số câu ngân hàng (160 câu, 32 groups) và khả năng cung cấp Part 4 (10 groups, tối đa 30 câu).
- `docs/FILE_INDEX.md`:
  - Cập nhật metadata phiên bản `2.12.0-phase4-listening-part4`, bổ sung Row 91 cho `src/utils/__tests__/listeningContentPart4.test.ts` và cập nhật sơ đồ kiến trúc phân cấp Question Bank.

---

### Kết quả kiểm định và chất lượng
- `npm run test:listening-p4`: 5 test suites, 364/364 assertions PASS (100%).
- `npm run test:validation`: Toàn bộ 10 test suites, 1,685/1,685 assertions PASS (100%).
- `npm run build`: `tsc -b && vite build` biên dịch thành công 0 lỗi.
- `npm run lint`: `oxlint` quét toàn bộ codebase 0 lỗi, 0 cảnh báo.
- Dữ liệu người dùng và LocalStorage key `toeic_mastery_data_v2_cold` hoàn toàn được bảo toàn.

---

## [2.11.0-phase3-listening-part3] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 3 — Hoàn Thiện Ngân Hàng Hội Thoại Listening Part 3 (Listening Content Part 3 — Short Conversations)**

### Mục tiêu
Hoàn thiện chất lượng và số lượng Question Bank cho phần Part 3 (Short Conversations) nhằm đáp ứng trọn vẹn yêu cầu tối thiểu của một ExamForm chuẩn ETS 200 câu:
- Đảm bảo tối thiểu 13 nhóm hội thoại hợp lệ, mỗi nhóm đúng 3 câu hỏi liên kết, tổng cộng 39 câu hỏi (`grp-p3-001` đến `grp-p3-013`, `q-p3-001` đến `q-p3-039`).
- Giữ nguyên vẹn 5 nhóm hiện có (`grp-p3-001` .. `grp-p3-005` và `q-p3-001` .. `q-p3-015`), không thay đổi ID tránh ảnh hưởng lịch sử người học.
- Bổ sung 8 nhóm hội thoại mới (`grp-p3-006` .. `grp-p3-013`) kèm 24 câu hỏi (`q-p3-016` .. `q-p3-039`) với lời thoại tự nhiên giữa các vai (Man/Woman), audio script, transcript, và bối cảnh doanh nghiệp chân thực (Logistics, IT, Travel, Marketing, Facilities, Purchasing, HR/Recruitment, Customer Support/Billing, Engineering/Project Management, Corporate Banquet Events, Commercial Sales/Contract Negotiation, Professional Analytics Training, Medical Warehouse Restocking).
- Mỗi nhóm bảo đảm liên kết hai chiều chặt chẽ (`groupId`, `questionIds`), thứ tự `orderInGroup` 1..3, 4 phương án A–D, đúng 1 đáp án chính xác, lời giải thích tiếng Việt sư phạm chi tiết phân tích bẫy distractors.
- Bảo toàn nhóm bảng biểu đồ họa Group 3 (`flight_schedule_graphic`) liên kết với SVG component trong `listeningIllustrationsMap.ts`.
- Xây dựng bộ contract tests 477 assertions xác thực toàn diện tính toàn vẹn Part 3.

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/data/questionBank/part3Listening.ts`:
  - Bổ sung 8 nhóm hội thoại chuẩn ETS (`grp-p3-006` .. `grp-p3-013`):
    - `grp-p3-006`: Purchasing & Ergonomic Task Chairs (`q-p3-016` .. `q-p3-018`).
    - `grp-p3-007`: HR & Senior Analyst Candidate Recruitment (`q-p3-019` .. `q-p3-021`).
    - `grp-p3-008`: Customer Support & Cloud Backup Billing Adjustment (`q-p3-022` .. `q-p3-024`).
    - `grp-p3-009`: Project Management & Solar Storage Battery Prototype Inspection (`q-p3-025` .. `q-p3-027`).
    - `grp-p3-010`: Corporate Events & Grandview Hotel Banquet Booking (`q-p3-028` .. `q-p3-030`).
    - `grp-p3-011`: Commercial Sales & Espresso Machine Supply Terms (`q-p3-031` .. `q-p3-033`).
    - `grp-p3-012`: Professional Training & Data Storytelling Workshop (`q-p3-034` .. `q-p3-036`).
    - `grp-p3-013`: Medical Warehouse Restocking & Sterile Gloves Logistics (`q-p3-037` .. `q-p3-039`).
  - Bổ sung 24 câu hỏi trắc nghiệm mới (`q-p3-016` .. `q-p3-039`) với kịch bản chi tiết, đáp án cân bằng (A: 9, B: 15, C: 8, D: 7), và lời giải thích tiếng Việt chuyên sâu.
- `src/utils/__tests__/listeningContentPart3.test.ts`:
  - Bộ kiểm định contract tests 477 assertions gồm 5 test suites độc lập:
    - Suite 1: Part 3 Group Cardinality & ExamForm Readiness (42 tests) — xác nhận đủ 13 groups, 39 questions, tỷ lệ 1 group = 3 questions.
    - Suite 2: Dialogue Authenticity, Multi-Speaker Turns & Context (52 tests) — xác nhận kịch bản thoại có lượt nói Man/Woman, audioScript, transcript.
    - Suite 3: Topic Diversity & Graphic Context Integrity (11 tests) — xác nhận bao phủ các chủ đề Logistics, Purchasing, HR, Support, Project Management, Events, Sales, Training và graphic Flight Schedule.
    - Suite 4: Question Options, Keys & Two-Way Linkage (368 tests) — kiểm tra 4 options A–D, tính đúng đắn correctKey, phân bố đáp án, lời giải thích và liên kết hai chiều.
    - Suite 5: Global ID Uniqueness & Schema Validator Passing (4 tests) — kiểm tra 100% group IDs và question IDs duy nhất, 100% pass `validateQuestionGroup` và `validateQuestion`.

#### Changed
- `src/data/questionBank/listeningBank.ts`:
  - Cập nhật số lượng Part 3 từ 5 groups (15 câu) lên 13 groups (39 câu); tổng Listening Bank nâng từ 65 câu lên 89 câu, 18 groups.
  - Nâng phiên bản phân vùng `PART3_PARTITION.version` lên `'2.3.0'`.
- `src/data/questionBank/index.ts`:
  - Cập nhật tổng số câu hỏi Question Bank từ 121 lên 145 câu, tổng groups từ 19 lên 27 groups.
  - Nâng phiên bản manifest toàn cục `FULL_QUESTION_BANK_MANIFEST.version` lên `'2.5.0'`.
- `package.json`:
  - Thêm script lệnh `test:listening-p3` (`tsx src/utils/__tests__/listeningContentPart3.test.ts`) và `test:validator`.
  - Tích hợp `test:listening-p3` vào pipeline kiểm định tổng hợp `test:validation`.
- `src/utils/__tests__/questionBankValidator.test.ts`:
  - Cập nhật assertions cho Listening Bank (89 câu, 18 groups), Part 3 (13 groups, 39 câu), và Full Question Bank (145 câu, 27 groups).
- `src/utils/__tests__/questionSelector.test.ts`:
  - Cập nhật danh sách nhóm đã thực hành trong test Suite 4.4 để duy trì tính tất định của thuật toán ưu tiên nhóm mới.
  - Cập nhật Suite 5.2 kiểm tra thiếu độ khó `easy` (chỉ có 1 group / 3 câu) thay vì `hard` (đã có 4 groups / 12 câu).
  - Cập nhật Suite 7 kỳ vọng khả dụng ngân hàng 145 câu, 27 groups, Part 3 13 groups / 39 câu.
- `docs/FILE_INDEX.md`:
  - Bổ sung dòng 90 cho file test `listeningContentPart3.test.ts`.
  - Cập nhật số lượng câu hỏi và group trong bảng và sơ đồ cây kiến trúc; nâng phiên bản tài liệu lên `2.11.0-phase3-listening-part3`.

---

### Kết quả kiểm định & Build
- `npm run test:listening-p3`: 477/477 assertions PASS (0 failures).
- `npm run test:validation`: Toàn bộ 9 suites test (Question Bank Validator, Question Selector, Practice Session Engine, Listening Audio Engine, Listening Workspace, Reading Workspace, Exam Blueprint Validator, Listening Content Part 1 & 2, Listening Content Part 3) PASS 100% (0 failures).
- `npm run build`: `tsc -b && vite build` thành công trong 575ms, 0 lỗi biên dịch.
- `npm run lint`: `oxlint` 0 lỗi.

---

### Các vấn đề còn tồn tại / Nợ kỹ thuật
- Question Bank hiện đã hoàn thiện sẵn sàng cho 1 ExamForm 200 câu cho các phần:
  - Part 1: 10 câu ($\ge 6$ câu yêu cầu) — 100% SVG photos.
  - Part 2: 25 câu ($\ge 25$ câu yêu cầu) — 100% 3 choices A–C.
  - Part 3: 39 câu ($\ge 39$ câu yêu cầu / 13 groups) — 100% hội thoại công sở.
- Các phần tiếp theo cần tiếp tục hoàn thiện trong các phase sau:
  - Part 4 (Short Talks): Hiện có 5 groups / 15 câu (cần tối thiểu 10 groups / 30 câu cho 1 ExamForm).
  - Part 5 (Incomplete Sentences): Hiện có 20 câu (cần 30 câu cho 1 ExamForm).
  - Part 6 (Text Completion): Hiện có 4 groups / 16 câu (đủ 1 ExamForm 16 câu).
  - Part 7 (Reading Comprehension): Hiện có 5 groups / 20 câu (cần 54 câu cho 1 ExamForm).

---

## [2.10.0-phase2-listening-part1-part2] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 2 — Hoàn Thiện Ngân Hàng Câu Hỏi Listening Part 1 & Part 2 (Listening Content Part 1 & 2)**

### Mục tiêu
Hoàn thiện chất lượng và số lượng Question Bank cho hai phần đầu của bài thi TOEIC Listening phục vụ ExamForm 200 câu theo tiêu chuẩn ETS:
- **Part 1 (Photographs):** Đạt tối thiểu 6 câu tranh mô tả (thực tế sẵn sàng 10 câu `q-p1-001` .. `q-p1-010`), 100% có tranh SVG vector thực tế sắc nét (0 ảnh placeholder, 0 ảnh vi phạm bản quyền), 4 phương án A–D đầy đủ kịch bản, 1 đáp án đúng, TTS audio script, transcript, giải thích chi tiết tiếng Việt phân tích bẫy thì/hành động.
- **Part 2 (Question–Response):** Mở rộng từ 15 câu lên đúng 25 câu chuẩn ETS (`q-p2-001` .. `q-p2-025`) phục vụ trọn vẹn 1 đề 200 câu, nghiêm ngặt 3 phương án A–C (tuyệt đối không ép thành 4 phương án), phân bố cân bằng đáp án đúng A/B/C, bao phủ 10 dạng thức giao tiếp ETS kinh điển (Wh- questions, Yes/No, Negative questions, Tag questions, Alternative Or questions, Wh- Delegation/Evasive, Problem Announcements/Statements, Suggestion Why don't we, Polite Requests Would you mind/Could you).
- Tái sử dụng tối đa nội dung hợp lệ và bảo toàn các API đang được Practice Engine sử dụng.
- Xây dựng bộ kiểm định contract tests 359 assertions chuyên sâu xác thực 100% chất lượng nội dung Part 1 & 2.

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/data/questionBank/part2Listening.ts`:
  - Thêm 10 câu hỏi chuẩn ETS mới (`q-p2-016` đến `q-p2-025`):
    - `q-p2-016`: Wh- Question (Why) & Lý do vắng mặt (Key C).
    - `q-p2-017`: Wh- Question (How) & Hướng dẫn truy cập cổng nội bộ (Key B).
    - `q-p2-018`: Request / Could you & Phản hồi gián tiếp thay thế (Key B).
    - `q-p2-019`: Negative Question (Isn't...) & Cập nhật bàn giao công việc (Key C).
    - `q-p2-020`: Tag Question & Đính chính lịch kiểm toán thực tế (Key C).
    - `q-p2-021`: Alternative Question (Or) & Lựa chọn giải pháp tối ưu (Key B).
    - `q-p2-022`: Wh- Question (Who) & Trả lời né tránh / ủy quyền thông tin (Key C).
    - `q-p2-023`: Statement (Thông báo sự cố thiết bị) & Giải pháp gửi ticket (Key B).
    - `q-p2-024`: Suggestion (Why don't we) & Phản biện bằng câu hỏi ngược về ngân sách (Key A).
    - `q-p2-025`: Polite Request (Would you mind) & Đồng ý với Not at all (Key C).
- `src/utils/__tests__/listeningContentPart1Part2.test.ts`:
  - Bộ 359 assertions contract tests qua 4 test suites chuyên sâu:
    - Suite 1: Part 1 Photographs Authenticity & SVG Mapping (60 tests) - xác nhận 10 câu $\ge 6$, tranh SVG tồn tại, 4 options A–D, transcript, audioScript, explanation.
    - Suite 2: Part 2 Question-Response Authenticity (275 tests) - xác nhận đúng 25 câu $\ge 25$, đúng 3 choices A–C (không có D), promptScript, transcript, audioScript, giải thích phân tích bẫy.
    - Suite 3: Part 2 Archetype & Communicative Diversity (13 tests) - xác nhận hiện diện đủ Wh-, Or, Negative, Tag, Suggestion, Polite Request và phân bố cân đối đáp án đúng (A: 13, B: 7, C: 5).
    - Suite 4: Global ID Uniqueness & Schema Validator Passing (11 tests) - 100% 35 câu vượt qua `validateQuestion` với 0 cảnh báo/lỗi.

#### Changed
- `src/data/questionBank/part2Listening.ts`:
  - Tái cân bằng phân bố đáp án đúng trên các câu mới tạo nhằm đảm bảo Part 2 có sự xuất hiện hài hòa của cả 3 keys A, B, C (trước đây toàn bộ 15 câu gốc chỉ có key A và B).
- `src/data/questionBank/listeningBank.ts`:
  - Cập nhật số lượng Part 2 từ 15 lên 25 câu; tổng Listening Bank nâng từ 55 lên 65 câu.
  - Bump phiên bản phân vùng `PART2_PARTITION.version` lên `'2.3.0'`.
- `src/data/questionBank/index.ts`:
  - Cập nhật tổng số câu hỏi Question Bank từ 111 lên 121 câu.
  - Bump phiên bản manifest toàn cục `FULL_QUESTION_BANK_MANIFEST.version` lên `'2.4.0'`.
- `src/utils/__tests__/questionBankValidator.test.ts`:
  - Cập nhật kỳ vọng số lượng Listening questions (65) và Full bank questions (121).
- `src/utils/__tests__/questionSelector.test.ts`:
  - Cập nhật kỳ vọng kiểm tra số lượng câu hỏi khả dụng cho Part 2 (25) và Full bank (121).
- `package.json`:
  - Thêm script lệnh `test:listening-p1-p2` (`tsx src/utils/__tests__/listeningContentPart1Part2.test.ts`).
  - Tích hợp vào pipeline kiểm định tổng `test:validation`.
- `docs/FILE_INDEX.md`:
  - Thêm dòng 89 cho file test mới `listeningContentPart1Part2.test.ts`.
  - Cập nhật số lượng câu hỏi trong sơ đồ cây kiến trúc và cập nhật phiên bản tài liệu lên `2.10.0-phase2-listening-part1-part2`.

### Kết quả kiểm định
- `npm run test:listening-p1-p2`: 359/359 tests passed (100%).
- `npm run test:validation`: 843/843 assertions passed (100% trên toàn bộ 8 test files).
- `npm run build`: Biên dịch TypeScript và build Vite production thành công không lỗi (0 errors).
- `npm run lint`: Oxlint kiểm tra 74 files đạt 0 lỗi (0 errors, 116 style warnings).

---

## [2.9.0-phase1-full-mock-blueprint] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 1 — Nền Tảng Thiết Kế & Kiểm Định Đề Thi Thử Đầy Đủ 200 Câu (Full Mock Foundation & Blueprint)**

### Mục tiêu
Thiết kế kiến trúc toàn diện và xây dựng bộ kiểm định pure functions (Validation Engine) cho bài thi thử TOEIC chuẩn ETS 200 câu / 120 phút theo triết lý Offline-First:
- Audit toàn diện mã nguồn thực tế (Code Truth) của Question Bank (111 câu/19 groups hiện có), Practice Engine, Audio Engine và Workspaces.
- Định nghĩa Domain Types hoàn chỉnh cho `ExamBlueprint`, `ExamForm`, `ExamQuestionRef`, `ExamGroupRef`, `ExamMediaRef`, `ExamSession`, `ExamAnswer`, `ExamResult`, `ExamReview`, `ExamHistory`.
- Ràng buộc cấu trúc đề thi chuẩn ETS: Listening 45 phút (P1 6, P2 25, P3 13 groups × 3 = 39, P4 10 groups × 3 = 30 = 100 câu); Reading 75 phút (P5 30, P6 4 groups × 4 = 16, P7 10 single passages / 29 câu, P7 5 multiple groups × 5 = 25 câu = 100 câu). Đánh số thứ tự toàn cục 1–200.
- Xây dựng động cơ kiểm định độc lập `examBlueprintValidator.ts` kiểm tra 100% ràng buộc hình thức (200 câu, 1-200 sequential, unique IDs, group integrity, Part 7 single/multiple distribution, schema version) và liên kết thực thể Question Bank.
- Kiểm định với 84 targeted unit tests (nâng tổng số test cases toàn dự án lên 484 tests, 100% passed).

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/types/mockExam.ts`:
  - Định nghĩa `ExamBlueprint`, `SectionBlueprint`, `PartBlueprint`, `Part7Blueprint` và hằng số chuẩn hóa `ETS_STANDARD_EXAM_BLUEPRINT`.
  - Khai báo các mô hình tham chiếu nhẹ `ExamQuestionRef`, `ExamGroupRef`, `ExamMediaRef` và cấu trúc đề thi `ExamForm` hỗ trợ định danh ổn định, schema versioning, content revision, thứ tự cố định và phát hiện nội dung lỗi thời.
  - Khai báo các mô hình trạng thái làm bài `ExamSession`, `ExamAnswer`, kết quả chấm điểm `ExamResult`, xem lại chi tiết `ExamReview` và nhật ký lịch sử thi `ExamHistory`.
- `src/utils/examBlueprintValidator.ts`:
  - Động cơ pure functions kiểm định cấu trúc đề thi `validateExamFormStructure`:
    - Ràng buộc đúng 200 câu hỏi, đúng số lượng và ranh giới Part 1-7.
    - Đánh số thứ tự toàn cục 1–200 liên tục không gián đoạn.
    - Phát hiện và định vị chính xác ID câu hỏi bị trùng lặp trong đề.
    - Bảo toàn tính toàn vẹn nhóm: P3 (13 nhóm × 3 câu), P4 (10 nhóm × 3 câu), P6 (4 nhóm × 4 câu), cấm chia cắt nhóm để đủ số lượng.
    - Ràng buộc Part 7: đúng 10 bài đọc đơn (29 câu, 2–4 câu/bài) và 5 nhóm bài đọc kép/ba (25 câu, 5 câu/nhóm).
    - Kiểm tra số lượng phương án trả lời (Part 2 đúng 3 choices A–C; các Part khác đúng 4 choices A–D).
    - Kiểm tra tính tương thích của phiên bản schema (`INCOMPATIBLE_SCHEMA_VERSION`).
  - Hàm kiểm tra liên kết Question Bank `validateExamFormContentLinks`:
    - Xác thực sự tồn tại của Question ID và Group ID trong ngân hàng đề.
    - Xác thực đáp án đúng hợp lệ và tính nhất quán hai chiều giữa câu hỏi và nhóm.
  - Hàm tạo fingerprint tất định cho nội dung đề thi `calculateContentFingerprint`.
- `src/utils/__tests__/examBlueprintValidator.test.ts`:
  - Bộ 84 targeted unit tests qua 9 test suites:
    - Suite 1: Canonical Blueprint Specification Integrity (8 tests).
    - Suite 2: Valid 200-Question Exam Form Verification (16 tests).
    - Suite 3: Total Question Count Violations (199, 201, 0) (3 tests).
    - Suite 4: Sequential Numbering & Duplicate Question IDs (4 tests).
    - Suite 5: Part Distribution & Option Count Violations (4 tests).
    - Suite 6: Group Cardinality & Contiguous Integrity (5 tests).
    - Suite 7: Part 7 Single vs Multiple Passages Distribution (4 tests).
    - Suite 8: Schema Version Incompatibility & Root Guards (5 tests).
    - Suite 9: Content Linkage Validation with Question Bank (6 tests).

#### Changed
- `src/types/index.ts`: Re-export toàn bộ types từ `./mockExam`.
- `package.json`: Bổ sung script `test:blueprint` và tích hợp vào pipeline kiểm định `test:validation`.
- `docs/FILE_INDEX.md`: Cập nhật bảng mục lục 88 file và sơ đồ kiến trúc hệ thống.

### Kết quả kiểm định
- `npm run test:blueprint`: 84/84 tests passed (100%).
- `npm run test:validation`: 484/484 tests passed (100% trên toàn bộ 7 test files).
- `npm run build`: `tsc -b && vite build` thành công, 0 errors.
- `npm run lint`: Hoàn thành với 0 errors.

---

## [2.8.1-patch-reading-workspace-test] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Hotfix — Khắc phục cảnh báo TypeScript 'Object is possibly undefined' trong readingWorkspace.test.ts**

### Mục tiêu
Sửa triệt để chẩn đoán kiểu dữ liệu TypeScript (`TS2532: Object is possibly 'undefined'`) tại dòng 116 của file `src/utils/__tests__/readingWorkspace.test.ts`, đảm bảo kiểm tra kiểu chặt chẽ khi truy cập partition Part 5 từ `FULL_QUESTION_BANK_MANIFEST`.

---

### Những nội dung thực tế đã triển khai

#### Fixed
- `src/utils/__tests__/readingWorkspace.test.ts`:
  - Cập nhật cách truy cập `FULL_QUESTION_BANK_MANIFEST.partitions[5]` sử dụng optional chaining và fallback mảng rỗng `(FULL_QUESTION_BANK_MANIFEST.partitions[5]?.questions ?? []) as Part5Question[]`.
  - Khắc phục hoàn toàn lỗi biên dịch kiểu dữ liệu `TS2532` trong IDE và compiler strict mode mà vẫn bảo toàn 100% kết quả kiểm định của Suite 2 (Part 5 Incomplete Sentences Contracts).

### Kết quả kiểm định
- `npm run test:reading`: 69/69 tests passed (100%).
- `npm run test:validation`: 400/400 tests passed (100% trên toàn bộ 6 test files).
- `npm run build`: Thành công (`tsc -b && vite build` 0 errors).
- `npm run lint`: Hoàn thành với 0 errors.

---

## [2.8.0-phase8-reading-workspace] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 8 — Giao Diện Luyện Tập Đọc Hiểu Chuyên Biệt Part 5–7 (Reading Practice Workspace)**

### Mục tiêu
Xây dựng không gian làm bài Reading chuyên sâu bao phủ toàn bộ Part 5 đến Part 7 (Single, Double, Triple Passages) của TOEIC Mastery Hub, tái sử dụng hoàn toàn và kết nối trực tiếp với Question Bank (Phase 3), Question Selection Engine (Phase 4), Practice Session Engine (Phase 5). Giao diện tuân thủ chặt chẽ trải nghiệm phòng thi chuẩn ETS và thói quen ôn luyện đọc hiểu của thí sinh TOEIC:
- Không làm lộ đáp án hoặc giải thích trái quy định của từng chế độ (ẩn giải thích và phân tích bẫy trong Timed Practice).
- Specialized rendering chuẩn xác theo từng Part:
  - Part 5: Câu hỏi có vị trí blank `_____` rõ ràng, xem trước đáp án đã chọn ngay trong khoảng trống `([C])`, 4 lựa chọn A–D rõ ràng, hiển thị badge ngữ pháp và drawer giải thích khi bật trợ giúp ở Practice Mode.
  - Part 6: Trình bày toàn vẹn đoạn văn công sở có 4 vị trí blank interactive `[131]`..`[134]`, mapping chính xác sang 4 câu hỏi trong nhóm, hỗ trợ cả điền từ và chèn câu hoàn chỉnh, thanh cuộn đoạn văn độc lập không làm mất ngữ cảnh đọc.
  - Part 7: Trình bày toàn diện đoạn văn Đơn (Single), Đôi (Double) và Ba (Triple) với các định dạng văn bản thương mại thực tế (email, memo, bảng biểu, hóa đơn, tin nhắn), tab nhảy nhanh văn bản con, thẻ xếp chồng đối chiếu chéo (Cross-text reference), huy hiệu nhận diện câu hỏi tổng hợp đa văn bản (`Đa văn bản`) và phân loại câu hỏi (`main_idea`, `detail`, `inference`, `cross_text_synthesis`).
- Tích hợp Workspace chung: Tái sử dụng `WorkspaceHeader`, `QuestionNavigatorDrawer`, `SubmitConfirmationModal` và `usePracticeSession`.
- Điều hướng bàn phím toàn diện: `A`, `B`, `C`, `D` chọn phương án, `M` gắn cờ xem lại, `ArrowLeft` / `ArrowRight` chuyển câu an toàn.
- Đồng hồ đếm ngược wall-clock ở Timed Practice, tự động nộp bài khi hết giờ (`auto_timeout`), bảo vệ khóa bài sau khi nộp (Answer Locking).
- Kiểm định với 69 targeted contract & unit tests (nâng tổng số test cases toàn dự án lên 400 tests, 100% passed).

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/components/Practice/Reading/Part5IncompleteSentencesView.tsx`:
  - View chuyên biệt cho Part 5 Incomplete Sentences:
    - Hiển thị câu hỏi với vị trí blank `_____` trực quan, tự động xem trước chữ cái phương án đã chọn trong chỗ trống (ví dụ `([C])`).
    - 4 lựa chọn A–D trình bày rõ ràng, hỗ trợ click hoặc phím tắt chọn đáp án.
    - Hiển thị badge phân loại ngữ pháp (`grammarCategory`) và chủ đề (`targetTopic`).
    - Drawer xem giải thích chi tiết và phân tích bẫy trong Practice Mode; ẩn hoàn toàn trong Timed Practice.
- `src/components/Practice/Reading/Part6TextCompletionView.tsx`:
  - View chuyên biệt cho Part 6 Text Completion:
    - Bố cục chia đôi (Split Layout: 7 cột đoạn văn | 5 cột câu hỏi trên Desktop; tab switcher linh hoạt trên Mobile).
    - Đoạn văn doanh nghiệp hiển thị toàn vẹn 4 vị trí blank interactive `[131]`, `[132]`, `[133]`, `[134]`.
    - Bấm vào blank trên văn bản tự động chuyển sang câu hỏi tương ứng; blank của câu đang chọn phát sáng viền xanh kèm huy hiệu đáp án đã chọn.
    - Hỗ trợ câu hỏi từ loại và câu hỏi chèn câu hoàn chỉnh (`sentence_insertion`).
    - Thanh cuộn đoạn văn độc lập với danh sách câu hỏi, chuyển đổi giữa các câu hỏi trong nhóm không làm mất ngữ cảnh hay reset vị trí đọc.
- `src/components/Practice/Reading/Part7ReadingComprehensionView.tsx`:
  - View chuyên biệt cho Part 7 Reading Comprehension:
    - Hỗ trợ toàn diện Single, Double và Triple passages với nhận diện định dạng chuẩn mực (`email`, `memo`, `schedule`, `invoice/form`, `chat`, `notice`, `ad`).
    - Với nhóm đa văn bản (Double/Triple): cung cấp thanh tab nhảy nhanh đến từng văn bản con kết hợp thẻ xếp chồng trực quan để đối chiếu thông tin chéo.
    - Tự động nhận diện và gắn huy hiệu câu hỏi tổng hợp đa văn bản (`Đa văn bản`) đối với các câu có `crossTextReference === true` kèm huy hiệu loại câu hỏi (`main_idea`, `detail`, `inference`, `cross_text_synthesis`).
    - Điều hướng giữa các câu hỏi trong group giữ nguyên hoàn toàn ngữ cảnh đoạn văn và vị trí đọc.
    - Bảo toàn bằng chứng trích dẫn (`evidence`) để sẵn sàng cho Review Mode (Phase 9), không tiết lộ trước trong khi làm bài.
- `src/components/Practice/Reading/ReadingWorkspace.tsx`:
  - Component điều phối trung tâm không gian làm bài Reading Part 5–7:
    - Kết nối trực tiếp với `usePracticeSession` và `questionBankLookup`.
    - Điều hướng bàn phím toàn diện (`A`, `B`, `C`, `D`, `M`, `ArrowLeft`, `ArrowRight`).
    - Tích hợp `WorkspaceHeader` hiển thị Part 5–7, book icon, tiến độ, đồng hồ và trạng thái.
    - Ma trận điều hướng `QuestionNavigatorDrawer` tự động nhận diện Part 6 và 7 để gom nhóm thẻ theo `groupId`.
    - Hộp thoại `SubmitConfirmationModal` xác nhận trước khi nộp bài kèm cảnh báo khi còn câu bỏ trống.
    - Banner khóa bài sau khi nộp hoặc hết giờ (`Answer Locked`).
- `src/components/Practice/Reading/index.ts`:
  - Barrel export cho toàn bộ views và components của phân hệ Reading Workspace.
- `src/utils/__tests__/readingWorkspace.test.ts`:
  - Bộ 69 targeted contract & unit tests qua 7 test suites:
    - Suite 1: Question Bank Lookup for Reading Parts (8 tests).
    - Suite 2: Part 5 Incomplete Sentences View Contract (10 tests).
    - Suite 3: Part 6 Text Completion View Contract & Blank Mapping (11 tests).
    - Suite 4: Part 7 Reading Comprehension View Contract (12 tests).
    - Suite 5: Mode-Specific Assistance & Explanation Rules (8 tests).
    - Suite 6: Answer Persistence & Post-Submit Lock (10 tests).
    - Suite 7: Timed Practice Auto-Timeout & Idempotency (10 tests).

#### Changed
- `src/components/Practice/Listening/WorkspaceHeader.tsx`:
  - Mở rộng hỗ trợ toàn bộ 7 Parts (`1 | 2 | 3 | 4 | 5 | 6 | 7`), bổ sung nhãn hiển thị và icon `BookOpen` cho Reading.
- `src/components/Practice/Listening/QuestionNavigatorDrawer.tsx`:
  - Cải tiến gom nhóm động: gom nhóm theo `groupId` cho Part 3, 4, 6, 7; lưới phẳng 5 cột cho câu hỏi đơn Part 1, 2, 5.
- `src/components/Practice/index.ts`:
  - Re-export `ReadingWorkspace`, `Part5IncompleteSentencesView`, `Part6TextCompletionView`, `Part7ReadingComprehensionView`.
- `package.json`:
  - Thêm script `test:reading`: `"tsx src/utils/__tests__/readingWorkspace.test.ts"`.
  - Cập nhật script `test:validation` chạy đủ 6 bộ test suites (400 tests).
- `docs/FILE_INDEX.md`:
  - Cập nhật phiên bản hệ thống lên `2.8.0-phase8-reading-workspace`, bổ sung các file Reading vào bảng chỉ mục (85 files) và sơ đồ kiến trúc cây.
- `README.md`:
  - Bổ sung Module 14 vào Feature Catalog, cập nhật bảng NPM Scripts và Ghi chú chuyển giao (Handoff Notes).

#### Fixed / Safeguarded
- **Interactive Blank Mapping:** Regex `\[(\d{3})\]` phân tích chính xác 4 vị trí blank trên đoạn văn Part 6, cho phép bấm trực tiếp vào blank để chuyển câu hỏi; active blank phát sáng và cập nhật chữ cái phương án đã chọn.
- **Bảo toàn Ngữ cảnh Đọc:** Thanh cuộn đoạn văn Part 6 & 7 độc lập với danh sách câu hỏi; người dùng chuyển qua lại giữa các câu hỏi trong cùng một nhóm mà không bị nhảy trang hay mất dấu vị trí đang đọc.
- **Bảo vệ Khóa Đáp Án (Answer Lock):** Tương tự Listening, sau khi nộp bài hoặc hết giờ, mọi thao tác sửa đáp án trong Reading Workspace đều bị chặn triệt để.

#### Kết quả kiểm định & Build
- `npm run test:reading`: **69/69 passed** (0 failures).
- `npm run test:validation`: **400/400 passed** (0 failures) qua 6 test suites.
- `npm run lint`: **0 errors** (76 pre-existing warnings không thuộc module mới).
- `npm run build`: **0 errors** (tsc type-check thành công, Vite bundle đóng gói trong ~550ms).

#### Các vấn đề còn tồn tại
- Chấm điểm chi tiết, phân tích điểm số, Review Mode đầy đủ và lịch sử làm bài được quy hoạch thực hiện ở Phase 9.

---

## [2.7.0-phase7-listening-workspace] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 7 — Giao Diện Luyện Tập Nghe Chuyên Biệt Part 1–4 (Listening Practice Workspace)**

### Mục tiêu
Xây dựng không gian làm bài Listening chuyên sâu bao phủ toàn bộ Part 1 đến Part 4 của TOEIC Mastery Hub, tái sử dụng hoàn toàn và kết nối trực tiếp với Question Bank (Phase 1–3), Question Selection Engine (Phase 4), Practice Session Engine (Phase 5), và Listening Audio Engine (Phase 6). Giao diện tuân thủ chặt chẽ trải nghiệm phòng thi chuẩn mực và thói quen ôn luyện của thí sinh TOEIC:
- Không làm lộ nội dung nghe hoặc đáp án trước khi được phép (ẩn transcript và nội dung phương án trong lúc làm bài thi nghe).
- Specialized rendering chuẩn xác theo từng Part: Part 1 hiển thị tranh SVG và ẩn text lựa chọn; Part 2 nghiêm ngặt chỉ 3 phương án A–C; Part 3/4 dùng chung một audio và đồ họa cho cả cụm 3 câu, không reset âm thanh khi chuyển câu trong cùng một nhóm.
- Chế độ Practice hỗ trợ xem transcript/lời giải và ghi nhận hành vi trợ giúp vào Session Engine (`recordHelp(qid, 'script')`) phục vụ phân tích năng lực độc lập ở Phase 9.
- Chế độ Timed Practice tuyệt đối không tiết lộ transcript, khóa nghe lại sau 1 lần phát, đếm ngược wall-clock chuẩn xác và tự động nộp bài có khóa an toàn khi hết giờ (`auto_timeout`).
- Hộp thoại xác nhận nộp bài `SubmitConfirmationModal` cảnh báo nổi bật khi còn câu bỏ trống.
- Ma trận điều hướng `QuestionNavigatorDrawer` hỗ trợ gom cụm 3 câu cho Part 3 & 4; phím tắt bàn phím toàn diện (`A`, `B`, `C`, `D`, `M`, phím mũi tên).
- Thu hồi tài nguyên âm thanh (Audio Lifecycle Teardown) tự động khi chuyển nhóm, nộp bài hoặc thoát phiên làm việc.
- Kiểm định với 53 targeted contract & unit tests (nâng tổng số test cases toàn dự án lên 331 tests, 100% passed).

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/utils/questionBankLookup.ts`:
  - Bản đồ chỉ mục tra cứu $O(1)$ cho Question Bank dựa trên `FULL_QUESTION_BANK_MANIFEST`:
    - `getQuestionById(id)`: Lấy thông tin chi tiết một câu hỏi theo ID.
    - `getQuestionGroupById(id)`: Lấy thông tin nhóm câu hỏi theo ID.
    - `getQuestionsForGroup(groupId)`: Lấy danh sách toàn bộ câu hỏi thuộc nhóm, sắp xếp đúng theo `orderInGroup`.
    - `verifyQuestionIdsExist(ids)`: Kiểm tra tính tồn tại của danh sách câu hỏi.
- `src/components/Practice/Listening/WorkspaceHeader.tsx`:
  - Thanh header giao diện làm bài chuyên nghiệp:
    - Hiển thị badge Part (`PART 1`..`PART 4`), Badge chế độ (`Luyện tập` / `Phòng thi`), độ khó (`Dễ`, `Trung bình`, `Khó`, `Hỗn hợp`).
    - Thanh tiến trình tỷ lệ câu đã trả lời (`X / Y câu`) kèm phần trăm hoàn thành.
    - Đồng hồ đếm ngược wall-clock (Timed Mode) với cảnh báo nhịp đập màu hổ phách/đỏ khi thời gian còn lại $\le$ 60 giây.
    - Nút toggle Trợ giúp / Transcript (chỉ khả dụng trong Practice Mode khi chưa nộp bài).
    - Nút cắm cờ `Mark for Review` cho câu hỏi hiện tại.
    - Nút Nộp bài (`Nộp Bài Làm`) kích hoạt modal xác nhận và nút Thoát (`Thoát`).
- `src/components/Practice/Listening/QuestionNavigatorDrawer.tsx`:
  - Ma trận điều hướng câu hỏi đa năng, hỗ trợ cả màn hình di động lẫn máy tính:
    - Nhóm cụm câu hỏi thông minh cho Part 3 và Part 4 (gom 3 câu vào từng thẻ `Nhóm 1 (Câu 1–3)`, `Nhóm 2 (Câu 4–6)...`).
    - Lưới phẳng tối ưu cho Part 1 và Part 2.
    - Trực quan hóa 4 trạng thái câu hỏi: Đang làm (vòng sáng xanh tím), Đã trả lời (nền emerald), Đang cắm cờ xem lại (chấm vàng hổ phách), Chưa trả lời (xám mờ).
- `src/components/Practice/Listening/SubmitConfirmationModal.tsx`:
  - Hộp thoại cảnh báo và xác nhận trước khi nộp bài:
    - Bảng thống kê chi tiết: Tổng số câu, Đã làm, Còn bỏ trống, và Đã gắn cờ xem lại.
    - Cảnh báo trực quan màu hổ phách khi còn câu hỏi chưa chọn đáp án, yêu cầu thí sinh xác nhận trước khi nộp.
- `src/components/Practice/Listening/Part1PhotographView.tsx`:
  - View chuyên biệt cho Part 1 Photographs:
    - Kết nối với `LISTENING_ILLUSTRATIONS` render tranh vector SVG kích thước lớn, tương phản cao.
    - Tích hợp `ListeningAudioPlayer` phát 4 câu miêu tả Statement A–D.
    - 4 nút lựa chọn phương án A, B, C, D **ẩn hoàn toàn văn bản câu miêu tả** trong quá trình kiểm tra nghe.
    - Ngăn kéo mở xem Transcript và Lời giải chỉ khi người dùng kích hoạt trợ giúp ở chế độ Practice.
- `src/components/Practice/Listening/Part2QuestionResponseView.tsx`:
  - View chuyên biệt cho Part 2 Question-Response:
    - Phát audio câu hỏi prompt và 3 câu đáp lại Option A, B, C.
    - **Nghiêm ngặt chỉ render 3 nút lựa chọn A, B, C**, tuyệt đối không ép 4 phương án như các bài thi thông thường.
    - Ẩn hoàn toàn văn bản câu hỏi và phương án trong quá trình nghe.
    - Drawer hiển thị kịch bản câu hỏi, phương án và phân tích bẫy nghe khi bật trợ giúp.
- `src/components/Practice/Listening/Part3ConversationView.tsx`:
  - View chuyên biệt cho Part 3 Short Conversations:
    - Một audio player duy nhất dùng chung cho toàn bộ cụm 3 câu hỏi của nhóm hội thoại.
    - Hỗ trợ hiển thị hình ảnh bảng biểu đồ họa đi kèm khi nhóm có dữ liệu đồ họa (ví dụ: `Flight Schedule Graphic`).
    - **Giữ nguyên trạng thái phát âm thanh khi thí sinh chuyển qua lại giữa 3 câu hỏi trong nhóm**, không làm reset bài nghe.
    - Hiển thị danh sách 3 câu hỏi với 4 phương án A–D rõ ràng.
    - Hỗ trợ mở xem toàn văn hội thoại phân vai Man/Woman khi có quyền trợ giúp.
- `src/components/Practice/Listening/Part4TalkView.tsx`:
  - View chuyên biệt cho Part 4 Short Talks:
    - Một audio player dùng chung cho bài nói ngắn 3 câu.
    - Hỗ trợ đồ họa sơ đồ tầng trung tâm thương mại (`Store Directory Graphic`).
    - Giữ liên tục luồng nghe khi thao tác giữa các câu trong nhóm; bảo toàn lựa chọn đáp án.
    - Ngăn kéo kịch bản bài nói khi được trợ giúp.
- `src/components/Practice/Listening/ListeningWorkspace.tsx`:
  - Nhạc trưởng điều phối toàn bộ luồng làm bài nghe:
    - Tích hợp trực tiếp với hook `usePracticeSession`.
    - Lắng nghe phím tắt bàn phím toàn cục (`A`, `B`, `C`, `D` chọn đáp án; `M` cắm cờ; mũi tên trái/phải chuyển câu).
    - Hiển thị banner trạng thái khóa an toàn (`Answers Locked`) sau khi nộp hoặc khi hết giờ.
    - Tự động ngắt âm thanh và dọn dẹp bộ nhớ khi nộp bài, chuyển nhóm hoặc thoát khỏi workspace.
- `src/components/Practice/Listening/index.ts`:
  - Barrel export cho toàn bộ phân hệ Listening Workspace components.
- `src/utils/__tests__/listeningWorkspace.test.ts`:
  - Bộ 53 targeted contract & unit tests kiểm định toàn bộ phân hệ Listening Workspace qua 7 test suites:
    - Suite 1: Question Bank Lookup & Cardinality Integrity (10 tests).
    - Suite 2: Specialized Part Render Contracts (8 tests - kiểm tra 4 segments Part 1, 3 options Part 2, kịch bản Part 3/4).
    - Suite 3: Group Switching & Audio Track Identity (4 tests - kiểm tra audio track ID không đổi khi chuyển câu cùng nhóm).
    - Suite 4: Transcript & Assistance Rules (4 tests - kiểm tra ghi nhận trợ giúp vào session metadata, quy định Timed mode).
    - Suite 5: Answer Selection, Preservation & Locking (9 tests - kiểm tra bảo toàn đáp án và khóa hoàn toàn sau khi nộp).
    - Suite 6: Timer Integration & Auto-Submit (7 tests - kiểm tra deadline wall-clock, auto-submit đúng 1 lần).
    - Suite 7: Audio Lifecycle Cleanup Contract (3 tests - kiểm tra reset và dừng audio khi controller destroy).

#### Changed
- `src/components/Practice/index.ts`:
  - Re-export toàn bộ components của Listening Workspace (`ListeningWorkspace`, `WorkspaceHeader`, `QuestionNavigatorDrawer`, `SubmitConfirmationModal`, `Part1PhotographView`, `Part2QuestionResponseView`, `Part3ConversationView`, `Part4TalkView`).
- `src/hooks/usePracticeSession.ts`:
  - Mở rộng `UsePracticeSessionOptions` hỗ trợ nhận `initialSession?: PracticeSessionData` phục vụ khởi tạo trực tiếp và kiểm thử.
  - Mở rộng `UsePracticeSessionReturn` bổ sung `isSubmitted: boolean` và alias `previousQuestion: () => void`.
- `src/utils/practiceSessionEngine.ts`:
  - Điều chỉnh `createPracticeSession`: Hỗ trợ `groupIds` tùy chọn an toàn (`params.groupIds ? [...params.groupIds] : []`) cho các Part câu đơn lẻ (Part 1, 2, 5).
- `package.json`:
  - Bổ sung lệnh kiểm thử mới `"test:workspace": "tsx src/utils/__tests__/listeningWorkspace.test.ts"`.
  - Cập nhật lệnh kiểm định tổng thể `"test:validation"` chạy trọn vẹn 5 bộ test suites (50 Question Bank + 81 Selector + 83 Session + 64 Audio + 53 Workspace = 331 tests).
- `docs/FILE_INDEX.md`:
  - Cập nhật phiên bản lên `2.7.0-phase7-listening-workspace`.
  - Bổ sung 11 tệp tin mới (từ STT 69 đến STT 79) vào Bảng danh mục và cập nhật cây phân cấp kiến trúc.
- `README.md`:
  - Cập nhật phiên bản lên `2.7.0-phase7-listening-workspace`.
  - Bổ sung **Module 13: Listening Practice Workspace** vào Feature Catalog.
  - Cập nhật bảng NPM scripts và Handoff Notes phản ánh kết quả hoàn thành Phase 7.

---

### Kết quả kiểm định thực tế
- **TypeScript & Production Build (`npm run build`):**
  - Biên dịch kiểm tra kiểu nghiêm ngặt `tsc -b`: **0 errors**.
  - Đóng gói Vite production bundle hoàn tất thành công (`dist/index.html`, `dist/assets/index-DiqzzMBv.css`, `dist/assets/index-C3nxEa-a.js`).
- **Linter Check (`npm run lint`):**
  - Chạy Oxlint trên toàn bộ 64 files dự án: **0 errors**, không phát sinh cảnh báo nào từ các tệp mới của Phase 7.
- **Targeted Test Suites (`npm run test:validation`):**
  - Question Bank Validator (Phase 1–3): **50/50 tests passed**.
  - Question Selection Engine (Phase 4): **81/81 tests passed**.
  - Practice Session Engine & Storage (Phase 5): **83/83 tests passed**.
  - Listening Audio Engine (Phase 6): **64/64 tests passed**.
  - Listening Practice Workspace Contracts (Phase 7): **53/53 tests passed**.
  - **TỔNG CỘNG:** **331/331 test cases passed (100% tỷ lệ vượt qua)**.

---

## [2.6.0-phase6-audio-engine] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 6 — Bộ Điều Khiển Âm Thanh Listening Tái Sử Dụng & Quản Lý Vòng Đời (Stable Listening Audio Engine)**

### Mục tiêu
Xây dựng headless audio controller (`ListeningAudioController`) và giao diện phát âm thanh tái sử dụng (`ListeningAudioPlayer.tsx`) phục vụ các câu hỏi luyện nghe Part 1–4. Tích hợp Web Speech API (TTS) cho câu hỏi offline không có audio file và hỗ trợ native `HTMLAudioElement` khi có file audio cục bộ. Triển khai kiến trúc quản lý vòng đời audio nghiêm ngặt: điều phối đơn nhất (`audioPlaybackCoordinator`) ngăn ngừa phát chồng âm thanh; cơ chế token concurrency guard (`activeToken`) loại bỏ 100% callbacks lỗi thời từ các phiên phát trước; phân tích và chia nhỏ kịch bản (`audioScriptParser.ts`) thành các phân đoạn tuần tự (Statement A-D cho Part 1, Prompt + Choices A-C cho Part 2, hội thoại phân vai Man/Woman cho Part 3, chunk bài nói ngắn cho Part 4) khắc phục triệt để lỗi đứng hình 15s của Web Speech API trên Chromium/Safari. Quản lý voice bất đồng bộ (`voiceManager`) và lưu trữ lựa chọn giọng trong LocalStorage. Kiểm soát quyền nghe lại nghiêm ngặt: tự do nghe lại ở Practice Mode, giới hạn đúng 1 lần duy nhất ở Timed Mode theo chuẩn ETS. Hiển thị banner cảnh báo minh bạch rằng âm thanh TTS là mô phỏng, không phải bản thu phòng thi ETS. Xây dựng hook React `useListeningAudio` tương thích an toàn với React 19 StrictMode. Kiểm định với 64 targeted unit tests mới (nâng tổng số test cases lên 278 tests, 100% passed).

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/types/listeningAudio.ts`:
  - Định nghĩa toàn bộ kiểu dữ liệu cho Listening Audio Engine:
    - `AudioPlaybackStatus` (`'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'`).
    - `AudioPlaybackSourceType` (`'local_audio' | 'synthetic_tts' | 'none'`).
    - `AudioErrorCode` (`'NO_AUDIO_SOURCE' | 'TTS_NOT_SUPPORTED' | 'TTS_SYNTHESIS_ERROR' | 'AUDIO_LOAD_ERROR' | 'AUTOPLAY_BLOCKED' | 'REPLAY_NOT_ALLOWED' | 'ABORTED'`).
    - `AudioScriptSegment`: Cấu trúc phân đoạn lời thoại/câu đọc (`id`, `order`, `speaker`, `text`, `genderHint`, `accentHint`, `choiceKey`, `isPrompt`).
    - `AudioTrackConfig`: Cấu hình bài nghe hợp nhất (`partNum`, `questionId`, `groupId`, `audioUrl`, `fullScript`, `segments`, `preferredAccent`, `preferredGender`, `estimatedDurationSeconds`).
    - `AudioPlayerState`: Mô hình trạng thái phản ứng (`status`, `sourceType`, `currentTime`, `duration`, `progressRatio`, `currentSegmentIndex`, `activeSegment`, `activeSpeaker`, `activeChoiceKey`, `playCount`, `maxReplays`, `canPlay`, `canReplay`, `canPause`, `canResume`, `isSyntheticTTS`, `playbackRate`, `volume`, `isMuted`).
    - `AudioControllerOptions`: Tùy chọn cấu hình mode, sự kiện vòng đời và giới hạn nghe lại.
- `src/utils/audioScriptParser.ts`:
  - Pure parsing utilities chuyển đổi câu hỏi/nhóm câu hỏi sang `AudioTrackConfig`:
    - `buildAudioTrackConfigFromQuestion(question)`: Tạo 4 phân đoạn Statement A-D cho Part 1; tạo phân đoạn Prompt question + 3 phân đoạn Option A-C cho Part 2.
    - `buildAudioTrackConfigFromGroup(group)`: Phân tích hội thoại Part 3 thành các lượt lời phân vai tuần tự; chia nhỏ bài nói ngắn Part 4 thành các phân đoạn tự nhiên.
    - `parsePart3Dialogue(rawScript)`: Bóc tách lời thoại theo tiền tố người nói `Man:` (giọng nam) và `Woman:` (giọng nữ).
    - `chunkSentenceText(text, maxChars)`: Thuật toán ngắt câu thông minh không cắt ngang từ, ngăn ngừa bug treo Web Speech API khi văn bản quá dài.
- `src/utils/voiceManager.ts`:
  - Trình quản lý giọng đọc Web Speech API:
    - Xử lý nạp voice bất đồng bộ qua sự kiện `window.speechSynthesis.onvoiceschanged` và Promise `waitForVoices()`.
    - Lọc và tìm kiếm giọng tiếng Anh tối ưu theo accent (US, UK, AU, CA) và heuristic nhận diện giới tính (male/female) dựa trên tên giọng.
    - Ghi nhớ voice được chọn vào LocalStorage (`toeic_preferred_voice_en`).
- `src/utils/listeningAudioController.ts`:
  - Bộ điều khiển âm thanh headless hiệu năng cao:
    - `audioPlaybackCoordinator`: Singleton coordinator toàn cục, tự động dừng ngay lập tức mọi audio đang phát khác khi có controller mới yêu cầu phát.
    - Token-based Concurrency Guard: Tăng biến đếm `activeToken` tại mỗi thao tác Play/Stop/Replay, loại bỏ hoàn toàn các callback trễ (`onend`, `onerror`, `setTimeout`) từ các phiên phát cũ.
    - Hàng đợi TTS phân đoạn: Phát lần lượt từng segment qua `SpeechSynthesisUtterance`, hủy bỏ liên kết listener ngay sau khi hoàn thành để ngăn memory leak.
    - Xử lý lỗi an toàn: Bắt lỗi trình duyệt hủy phát (`interrupted`/`canceled`) và coi đó là hành động dừng có chủ đích, không báo lỗi giả.
    - Hỗ trợ HTMLAudioElement: Xử lý tệp âm thanh bản ngữ khi có `audioUrl`, bẫy lỗi chặn autoplay `NotAllowedError` mượt mà.
    - Kiểm soát số lần nghe: Áp dụng `maxReplays: 1` cho Timed Mode, từ chối nỗ lực phát lại với mã lỗi `REPLAY_NOT_ALLOWED`.
- `src/hooks/useListeningAudio.ts`:
  - Custom React hook kết nối controller với component React:
    - Tự động dọn dẹp và ngắt âm thanh khi unmount hoặc chuyển câu hỏi / nhóm câu hỏi (`trackIdentifier`).
    - Chống lỗi double-mount trong môi trường React 19 StrictMode.
    - Cung cấp các hàm điều khiển ổn định (`play`, `replay`, `stop`, `pause`, `resume`, `setVolume`, `setMuted`, `setPlaybackRate`).
- `src/components/Practice/ListeningAudioPlayer.tsx`:
  - Component giao diện thanh phát âm thanh Listening tái sử dụng:
    - Banner cảnh báo minh bạch: Nổi bật cảnh báo màu hổ phách rằng audio đang phát là giọng đọc mô phỏng TTS từ trình duyệt, không phải bản thu phòng thi ETS.
    - Chỉ báo người nói (Man/Woman) nhấp nháy theo thời gian thực cho Part 3/4.
    - Chỉ báo đọc phương án (A, B, C, D) cho Part 1/2.
    - Huy hiệu đếm lượt nghe và khóa nút phát trong Timed Mode khi hoàn thành 1 lượt nghe quy định.
    - Thanh tiến độ trực quan, nút tạm dừng/tiếp tục/tua lại, bộ chọn tốc độ phát (0.8x, 1.0x, 1.2x) và nút tắt/bật tiếng.
- `src/utils/__tests__/listeningAudio.test.ts`:
  - Bộ 64 targeted unit tests bao phủ 7 test suites:
    - Suite 1: Script Parsing & Segmentation (Part 1 statements, Part 2 prompt + options, Part 3 turns, Part 4 talks, sentence chunking).
    - Suite 2: Controller Lifecycle & State Transitions (idle, playing, stop, replay, completion to ended, progressRatio 1.0).
    - Suite 3: Token Concurrency & Stale Callback rejection (ngăn chặn callback cũ làm sống lại controller hoặc tăng sai playCount).
    - Suite 4: Mode-based Replay Permissions (Practice mode tự do replay vs Timed mode giới hạn 1 play, từ chối `REPLAY_NOT_ALLOWED`).
    - Suite 5: Global Playback Coordinator (singleton audio, controller B tự động dừng controller A khi phát).
    - Suite 6: Error Handling & Local Audio (từ chối khi thiếu nguồn audio, cờ syntheticTTS false khi dùng audioUrl).
    - Suite 7: Volume, Mute & Playback Rate adjustments.
- `package.json`:
  - Bổ sung lệnh `test:audio` (`tsx src/utils/__tests__/listeningAudio.test.ts`).
  - Cập nhật lệnh `test:validation` chạy chuỗi 4 bộ kiểm thử (Validator + Selector + Session + Audio = 278 tests).

#### Changed
- `src/types/index.ts`:
  - Re-export toàn bộ kiểu dữ liệu từ `src/types/listeningAudio.ts`.
- `src/components/Practice/index.ts`:
  - Xuất khẩu toàn bộ audio types, parser utilities, voice manager, controller, hook và component `ListeningAudioPlayer`.
- `docs/FILE_INDEX.md`:
  - Bổ sung 7 file mới (STT 62–68), cập nhật cây kiến trúc liên kết và nâng phiên bản lên `2.6.0-phase6-audio-engine` (tổng số 68 files).
- `README.md`:
  - Nâng phiên bản lên `2.6.0-phase6-audio-engine`.
  - Bổ sung Module 12 (Stable Listening Audio Engine) vào Feature Catalog.
  - Cập nhật bảng lệnh thực thi và Handoff Notes phản ánh tiến độ hoàn thành Phase 6.

---

### Kết quả kiểm định & Đóng gói
- **Bộ kiểm thử âm thanh (`npm run test:audio`):** **64/64 test cases passed** (100%).
- **Toàn bộ kiểm định dự án (`npm run test:validation`):** **278/278 test assertions passed** (50 Validator + 81 Selector + 83 Session + 64 Audio Engine).
- **Linter kiểm tra cú pháp (`npm run lint`):** **0 errors** (76 warnings baseline cũ từ các component khác, không có lỗi/warning mới nào trong các file Phase 6).
- **Biên dịch & Đóng gói (`npm run build`):** **Exit code 0** (thành công trong 480ms, không có lỗi TypeScript).

---

### Vấn đề kỹ thuật còn tồn tại
- Web Speech API phụ thuộc vào voices được cài sẵn trên hệ điều hành của người dùng. Một số môi trường Linux tối giản có thể cần cài thêm gói speech-dispatcher. Giao diện đã hiển thị banner minh bạch và cung cấp fallback nội dung kịch bản cho người học đối chiếu.

---

## [2.5.0-phase5-session-engine] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 5 — Quản Lý Vòng Đời Phiên Luyện Tập (Practice Session Engine), Lưu Trữ Offline (Persistence) & Phòng Thi Bấm Giờ (Timed Practice)**

### Mục tiêu
Xây dựng cỗ máy trạng thái (State Machine) quản lý toàn diện vòng đời phiên luyện tập: `Configuration` → `Selection` → `Active Session` → `Submitted/Completed` (hoặc `Abandoned`). Hỗ trợ chọn và sửa đáp án an toàn, đánh dấu câu hỏi xem lại, điều hướng linh hoạt giữa các câu/nhóm không mất dữ liệu, khóa chặt câu trả lời sau khi nộp (Answer Lock). Theo dõi trợ giúp trong Practice Mode (xem đáp án, transcript, gợi ý) phục vụ phân hóa kết quả trong Phase 9. Triển khai Timed Practice chuẩn xác theo mốc thời gian thực (wall-clock timestamp), không drift khi chạy ngầm hoặc F5, auto-timeout đúng 1 lần với cơ chế bảo vệ chống submit trùng lặp (Idempotency). Thiết kế adapter lưu trữ LocalStorage offline-first độc lập với khóa `toeic_practice_active_session_v1` và `toeic_practice_session_history_v1`, bảo vệ chống ghi đè phiên dở dang (`UNFINISHED_SESSION_EXISTS`), tự động xử lý timeout khi resume, bẫy lỗi quota, và xây dựng React hook `usePracticeSession`. Kiểm định với 83 targeted unit tests mới (nâng tổng số test cases lên 214 tests, 100% passed).

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/types/practiceSession.ts`:
  - Định nghĩa toàn bộ kiểu dữ liệu cho phiên luyện tập: `PracticeMode` (`'practice' | 'timed'`), `ActiveSessionStatus` (`'active' | 'submitted' | 'expired' | 'abandoned'`), `PracticeSubmitReason`, `PracticeAssistanceType`.
  - Interface `QuestionAssistanceRecord`: Theo dõi chi tiết các lượt xem đáp án, script hoặc giải thích trước khi submit (`viewedAnswer`, `viewedScript`, `viewedExplanation`, `viewCount`).
  - Interface `PracticeSessionData`: Mô hình trạng thái phiên đầy đủ gồm `sessionId`, `part`, `difficulty`, `mode`, `durationSeconds`, `questionIds`, `groupIds`, `answers`, `markedForReview`, `currentQuestionIndex`, `startedAt`, `deadline`, `elapsedSeconds`, `status`, `metadata`.
  - Contract lưu trữ `StorageOperationResult`, `ArchivedPracticeSession`, `SessionValidationResult`.
- `src/utils/practiceSessionEngine.ts`:
  - Pure functions điều phối logic phiên luyện tập:
    - `createPracticeSession(params, options)`: Khởi tạo phiên luyện tập duy nhất, đặt mảng câu hỏi/nhóm cố định, khởi tạo answers và flags rỗng, thiết lập deadline wall-clock.
    - `setSessionAnswer(session, questionId, choice)`: Cập nhật đáp án bất biến; trả về lỗi và từ chối cập nhật nếu phiên không ở trạng thái `'active'` (Answer Lock).
    - `toggleSessionMark(session, questionId)`: Đảo trạng thái cờ đánh dấu xem lại.
    - `navigateSession(session, targetIndex)` / `nextQuestion` / `previousQuestion`: Điều hướng có chặn biên an toàn `[0, total - 1]`, bảo toàn 100% đáp án đã nhập.
    - `recordAssistance(session, questionId, type)`: Ghi nhận trợ giúp trong Practice Mode.
    - `submitSession(session, reason, now)`: Nộp bài, khóa vĩnh viễn đáp án, tính toán `elapsedSeconds` chính xác, bảo vệ chống double-submit (Idempotency).
    - `abandonSession(session, now)`: Hủy phiên làm bài an toàn.
    - `getSessionRemainingSeconds(session, now)`: Tính toán số giây còn lại theo thời gian thực `deadline - Date.now()`.
    - `isSessionExpired(session, now)` / `checkAndApplyTimeout(session, now)`: Đánh giá quá hạn và tự động nộp bài.
    - `validateSessionIntegrity(candidate, bankManifest)`: Kiểm tra cấu trúc và tính toàn vẹn tham chiếu đối chiếu với Question Bank Manifest.
- `src/utils/practiceSessionStorage.ts`:
  - LocalStorage persistence adapter offline-first:
    - Khóa riêng biệt: `toeic_practice_active_session_v1` (Active Session) và `toeic_practice_session_history_v1` (History). Tuyệt đối không sao chép Question Bank vào storage, không can thiệp vào `toeic_mastery_data_v2_cold`.
    - `saveActiveSession(session)`: Lưu trữ an toàn, bắt lỗi `QuotaExceededError`.
    - `loadActiveSession(bankManifest, now)`: Khôi phục phiên, kiểm định tính toàn vẹn. Nếu phiên đã hết hạn trong lúc tắt tab/trình duyệt, tự động chuyển sang `expired`, lưu vào lịch sử và dọn dẹp active session.
    - `startNewActiveSession(newSession, forceReplace)`: Chống ghi đè vô ý (`UNFINISHED_SESSION_EXISTS`). Yêu cầu `forceReplace: true` để lưu phiên cũ thành `abandoned` trước khi thay thế.
    - `archiveCompletedSession(session)`: Lưu phiên đã kết thúc vào lịch sử (giới hạn 100 mục mới nhất).
    - `exportPracticeStorageData` / `importPracticeStorageData`: Giao tiếp xuất/nhập phục vụ tính năng Backup (Phase 10).
- `src/hooks/usePracticeSession.ts`:
  - React Custom Hook quản lý vòng đời phiên luyện tập:
    - Tự động khôi phục session khi mount.
    - Đồng hồ đếm ngược thời gian thực kết hợp listener `visibilitychange` và `window.focus`, đảm bảo timer tiếp tục chạy chính xác kể cả khi tab bị đưa vào chế độ ngủ (sleep) hoặc chuyển tab.
    - Tự động nộp bài đúng 1 lần khi hết giờ (`auto_timeout`).
    - Guard chống xung đột nộp bài (`isSubmittingRef`, `autoTimeoutHandledRef`).
    - Tính toán reactive các thống kê `answeredCount`, `unansweredCount`, `markedCount`, `percentageComplete`.
- `src/utils/__tests__/practiceSessionEngine.test.ts`:
  - Bộ 83 targeted unit tests bao phủ 5 test suites:
    - Suite 1: Session lifecycle, answer selection, toggle marks, navigation clamps, submit locking, abandon.
    - Suite 2: Practice mode assistance tracking (hints, answers, scripts, unassisted differentiation).
    - Suite 3: Timed practice, real wall-clock deadlines, background tab advance, idempotency, double-submit protection.
    - Suite 4: Persistence, F5 resume, expired deadline resolution, corrupted JSON recovery, referential integrity check, overwrite protection.
    - Suite 5: Storage failures, simulated QuotaExceededError, history archiving capping (100 items), export/import.
- `package.json`:
  - Bổ sung lệnh `test:session` (`tsx src/utils/__tests__/practiceSessionEngine.test.ts`).
  - Cập nhật lệnh `test:validation` xâu chuỗi cả 3 bộ test (Validator + Selector + Session Engine = 214 tests).

#### Changed
- `src/components/Practice/index.ts`:
  - Re-export `usePracticeSession`, các types của Practice Session, engine pure functions và storage adapter.
- `src/types/index.ts`:
  - Re-export toàn bộ models từ `practiceSession.ts`.
- `docs/FILE_INDEX.md`:
  - Nâng phiên bản lên `2.5.0-phase5-session-engine` (61 files), cập nhật cây liên kết kiến trúc.
- `README.md`:
  - Nâng phiên bản lên `2.5.0-phase5-session-engine`, cập nhật Module 11 vào Feature Catalog, cập nhật bảng lệnh npm scripts (214 tests), sơ đồ kiến trúc và Handoff Notes.

#### Fixed
- Giải quyết xung đột đặt tên trùng lặp `PracticeSessionMode` và `PracticeSessionStatus` với `questionBank.ts` bằng cách chuẩn hóa thành `PracticeMode` và `ActiveSessionStatus`.

#### Removed
- Không có file hay mã nguồn nào bị xóa bỏ.

---

### Kết quả kiểm định thực tế
1. **Targeted Unit Tests:** Chạy `npm run test:validation` ➔ **214/214 tests passed (0 failed)**.
   - 50/50 tests kiểm định Question Bank (schema, group cardinality, cross-linkage, 7 Parts).
   - 81/81 tests kiểm định Question Selection Engine (standalone, group integrity, DP subset-sum, anti-repeat, exhaustion, seeded RNG, time calculations).
   - 83/83 tests kiểm định Practice Session Engine & Storage (state transitions, assistance tracking, wall-clock timing, double-submit, resume, overwrite protection, quota).
2. **Biên dịch TypeScript & Production Bundle:** Chạy `npm run build` (`tsc -b && vite build`) ➔ **Thành công 100% (exit code 0, 584ms)**.
3. **Kiểm tra cú pháp Linter:** Chạy `npm run lint` (`oxlint`) ➔ **0 errors, 68 warnings (bảo toàn baseline cũ, 0 warnings trong toàn bộ mã mới)**.
4. **Bảo toàn dữ liệu người dùng:** Giữ nguyên vẹn 100% LocalStorage key `toeic_mastery_data_v2_cold`.

---

### Các vấn đề còn tồn tại & Bước chuyển giao tiếp theo
- Chưa xây dựng Workspace UI hoàn chỉnh hoặc Audio Controller theo đúng giới hạn của Phase 5.
- Sẵn sàng bàn giao cho **Phase 6 — Stable Listening Audio Engine** và **Phase 7–8 — Practice Workspaces (Listening & Reading)**.

---

## [2.4.0-phase4-selection-config] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 4 — Thuật Toán Chọn Câu Hỏi (Question Selection Engine) & Màn Hình Cấu Hình (Practice Hub Configuration)**

### Mục tiêu
Xây dựng pure selection functions để lựa chọn câu hỏi theo Part 1–7, độ khó (Easy, Medium, Hard, Mixed), số lượng yêu cầu, bảo toàn tuyệt đối Group Integrity (Part 3/4 giữ nguyên 3 câu, Part 6 giữ 4 câu, Part 7 bảo toàn trọn vẹn văn bản đơn/kép/ba với số câu biến thiên qua quy hoạch động DP subset-sum solver), cơ chế chống trùng lặp (Anti-Repeat) ưu tiên câu chưa làm / ít làm gần đây, tái sử dụng khi cạn ngân hàng, RNG tất định cho kiểm thử. Xây dựng giao diện cấu hình Practice Hub (`PracticeConfigHub.tsx`) độc lập, responsive, hỗ trợ Dark/Light mode, tính toán thời lượng Timed Practice theo tốc độ chuẩn ETS, tự động đề xuất số lượng khả thi khi không thể ghép nhóm, kiểm thử toàn diện với 81 targeted unit tests (nâng tổng số test cases lên 131 tests, 100% passed).

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/utils/questionSelector.ts`:
  - Pure Selection Engine:
    - `selectQuestions(request, history, bankManifest)`: Hàm cốt lõi chọn danh sách câu hỏi / groups theo tiêu chí.
    - `getFeasibleCountsForPart(part, bankManifest)`: Trả về mảng các số lượng câu hỏi khả thi tuyệt đối cho từng Part.
    - `getFeasibleCountsDetail(part, bankManifest)`: Trả về chi tiết các số lượng khả thi, lý do và gợi ý trực quan cho UI.
    - `calculateRecommendedTime(part, questionCount)`: Tính toán thời lượng Timed Practice khuyến nghị dựa trên pacing chuẩn ETS (Part 1/2: 30s/câu, Part 3/4: 40s/câu, Part 5: 30s/câu, Part 6: 45s/câu, Part 7: 60s/câu).
    - `getBankAvailability(bankManifest)`: Thống kê số câu và nhóm khả dụng theo từng Part và từng độ khó.
    - `formatDurationPace(seconds)`: Định dạng phút/giây thân thiện.
  - Xử lý Group Integrity nghiêm ngặt:
    - Part 1, 2, 5 (Standalone questions): Chọn số lượng bất kỳ $\le$ số câu trong bank.
    - Part 3, 4 (Fixed 3-question groups): Bắt buộc số lượng là bội số của 3 ($3 \times g$). Nếu người dùng yêu cầu số lẻ, trả về `status: 'impossible_count'` kèm feasible counts `[3, 6, 9, 12, 15]`.
    - Part 6 (Fixed 4-question groups): Bắt buộc số lượng là bội số của 4 ($4 \times g$), từ chối số lẻ và trả về feasible counts `[4, 8, 12, 16]`.
    - Part 7 (Variable-sized passage groups: 3, 3, 4, 5, 5 câu): Giải bài toán subset-sum bằng quy hoạch động DP và backtracking. Tự động tìm tổ hợp groups đạt chính xác số câu mong muốn (ví dụ: 8 câu = 3 + 5 hoặc 4 + 4, 10 câu = 5 + 5, 12 câu = 3 + 4 + 5, 15 câu = 5 + 5 + 5 hoặc 3 + 3 + 4 + 5, 20 câu = all 5 groups). Nếu không khả thi (ví dụ: 1, 2, 5, 9, 13, 19 câu), trả về `impossible_count` kèm feasible counts.
  - Thuật toán Anti-Repeat đa tầng:
    - Ghi nhận lịch sử làm bài qua `QuestionPracticeHistoryRecord`.
    - Sắp xếp độ ưu tiên: (1) Số lần làm ít nhất `practiceCount` tăng dần; (2) Thời điểm làm cũ nhất `lastPracticedAt` tăng dần; (3) Pseudo-random tie-breaker.
    - Không trùng lặp bất kỳ câu hoặc group nào trong cùng một phiên.
    - Tự động tái sử dụng khi ngân hàng cạn kiệt (`isBankExhausted = true`, `reusedCount > 0`).
    - Hỗ trợ RNG seed tùy biến (`seededRng`) cho kết quả tất định trong unit test.
- `src/components/Practice/PracticeConfigHub.tsx`:
  - Giao diện Practice Hub Configuration độc lập, responsive (Mobile, Tablet, Desktop), hỗ trợ Dark & Light Theme:
    - Lựa chọn 7 Parts qua thẻ bài trực quan với huy hiệu kỹ năng Listening (Audio) / Reading và số lượng câu/nhóm sẵn có trong ngân hàng.
    - Lựa chọn 4 mức độ khó: Easy, Medium, Hard, Mixed kèm chỉ báo trực tiếp số câu tương ứng.
    - Preset câu hỏi nhanh (5, 10, 15, 20...) dựa trên feasible counts của từng Part.
    - Ô nhập số câu tùy ý với validation tức thì: Cảnh báo `impossible_count` và cung cấp nút bấm 1-chạm "Chuyển sang [X] câu" (Snap to Feasible Count).
    - Bộ chuyển đổi chế độ luyện tập:
      - *Practice Mode (Luyện tự do):* Cho phép xem lại script/audio, gợi ý, không áp lực thời gian.
      - *Timed Practice (Phòng thi bấm giờ):* Tự động tính toán thời lượng ETS theo Part và số câu; cho phép điều chỉnh phút bằng nút +/-; tùy chọn giới hạn số lần nghe audio (1 lần thi thật vs vô hạn).
    - Thẻ thống kê Anti-Repeat Insight hiển thị tỷ lệ câu hỏi mới tinh vs câu hỏi đã từng luyện.
    - Nút "Bắt đầu luyện tập" có validation vô hiệu hóa nếu cấu hình không hợp lệ.
- `src/components/Practice/index.ts`:
  - Re-export barrel cho component `PracticeConfigHub` và các interfaces `PracticeConfigHubProps`, `PracticeLaunchConfig`.
- `src/utils/__tests__/questionSelector.test.ts`:
  - Bộ 81 targeted unit tests toàn diện chia làm 7 test suites:
    - Suite 1: Standalone question selection (Part 1, 2, 5).
    - Suite 2: Fixed group selection & Group Integrity (Part 3, 4, 6) - bảo toàn trọn vẹn số câu/group, từ chối số lẻ.
    - Suite 3: Variable group selection Part 7 (DP subset-sum solver) - bảo toàn toàn vẹn passage, test mọi số lượng khả thi và không khả thi.
    - Suite 4: Anti-repeat discipline & Recency scoring - ưu tiên câu mới, ưu tiên câu làm lâu nhất, chống duplicate.
    - Suite 5: Bank exhaustion & Recycling - tái sử dụng mượt mà khi ngân hàng cạn.
    - Suite 6: Insufficient data handling - phản hồi `insufficient_questions` rõ ràng không throw exception.
    - Suite 7: Seeded RNG & Time calculation - tất định trong test và tính toán thời gian chuẩn ETS.
- `package.json`:
  - Thêm script `test:selector` (`tsx src/utils/__tests__/questionSelector.test.ts`).
  - Cập nhật script `test:validation` để chạy cả 2 bộ test (50 tests Validator + 81 tests Selector).

#### Changed
- `docs/FILE_INDEX.md`:
  - Nâng phiên bản lên `2.4.0-phase4-selection-config`, cập nhật 56 file và bổ sung cây thư mục `src/components/Practice/` và `src/utils/questionSelector.ts`.
- `README.md`:
  - Nâng phiên bản lên `2.4.0-phase4-selection-config`, cập nhật sơ đồ kiến trúc, sơ đồ cây thư mục, bảng file cốt lõi, bổ sung Module 10 vào Feature Catalog, cập nhật scripts chạy 131 tests, và cập nhật Handoff Notes sẵn sàng cho Phase 5.

#### Fixed
- Loại bỏ cảnh báo `react(set-state-in-effect)` trong `PracticeConfigHub.tsx` bằng cách cập nhật trực tiếp state trong event handlers thay vì dùng `useEffect` đồng bộ.

#### Removed
- Không có file hay mã nguồn nào bị xóa bỏ.

---

### Kết quả kiểm định thực tế
1. **Targeted Validation & Selector Tests:** Chạy `npm run test:validation` ➔ **131/131 tests passed (0 failed)**.
   - 50/50 tests kiểm định Question Bank (schema, group cardinality, cross-linkage, 7 Parts).
   - 81/81 tests kiểm định Question Selection Engine (standalone, group integrity, DP subset-sum, anti-repeat, exhaustion, seeded RNG, time calculations).
2. **Biên dịch TypeScript & Production Bundle:** Chạy `npm run build` (`tsc -b && vite build`) ➔ **Thành công 100% (exit code 0)**.
3. **Kiểm tra cú pháp Linter:** Chạy `npm run lint` (`oxlint`) ➔ **0 errors, 62 warnings (giữ nguyên baseline dự án, 0 warnings trong code mới)**.
4. **Bảo toàn dữ liệu người dùng:** Giữ nguyên vẹn 100% LocalStorage key `toeic_mastery_data_v2_cold`.

---

### Các vấn đề còn tồn tại & Bước chuyển giao tiếp theo
- Chưa gắn nút điều hướng công khai vào `App.tsx` nhằm tuân thủ quy định: Component cấu hình độc lập sẵn sàng, chờ Phase 5 phát triển Practice Session Engine hoàn chỉnh trước khi kích hoạt luồng luyện tập toàn cục.
- Sẵn sàng bàn giao cho **Phase 5 — Practice Session Engine, Persistence & Timed Practice**.

---

## [2.3.0-phase3-reading-bank] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 3 — Hoàn Thiện Dữ Liệu Reading (Part 5–7) & Kiểm Định Question Bank Toàn Bộ 7 Parts**

### Mục tiêu
Xây dựng ngân hàng đề Reading tự biên soạn gồm 56 câu hỏi hợp lệ (Part 5: 20 câu Incomplete Sentences, Part 6: 4 groups / 16 câu Text Completion, Part 7: 5 groups / 20 câu Reading Comprehension). Bao phủ đa dạng tài liệu thực tế (email, quảng cáo, quy định, thông báo, hóa đơn, lịch trình, memo), đầy đủ Single, Double, Triple passages với câu hỏi cross-text synthesis và evidence trích dẫn. Tích hợp ngân hàng Listening và Reading thành bộ đề 7 Parts hợp nhất (111 câu hỏi, 19 groups) và kiểm định toàn diện với 50 targeted unit tests (0 failures).

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/data/questionBank/part5Reading.ts`:
  - 20 câu hỏi Part 5 Incomplete Sentences (`q-p5-001` -> `q-p5-020`) với vị trí blank `_____` chuẩn mực.
  - Phân loại ngữ pháp & từ vựng phong phú: Part of Speech (Word Forms), Verb Tenses & Voice, Relative Pronouns & Clauses, Conjunctions vs Prepositions, TOEIC Business Collocations, Subject-Verb Agreement, Subjunctive Mood, Participles as Adjectives, Inversion, Comparative Structures.
  - 4 đáp án A–D rõ ràng, phân tích tại sao đáp án đúng và vì sao 3 distractors không phù hợp.
  - Gắn nhãn `skillTag`, `topic`, `difficulty` cụ thể cho từng câu.
- `src/data/questionBank/part6Reading.ts`:
  - 4 nhóm văn bản Text Completion (`grp-p6-001` -> `grp-p6-004`) tương ứng 16 câu hỏi (`q-p6-001` -> `q-p6-016`).
  - Mỗi nhóm là một tài liệu doanh nghiệp thực tế với 4 vị trí blank `[131]`..`[146]`:
    - Group 1: Email nội bộ công ty chuyển giao hệ thống phần mềm kế toán mới.
    - Group 2: Bản ghi nhớ (Memo) quy định hoàn tiền công tác phí và chứng từ.
    - Group 3: Thông báo tuyển dụng và quy trình phỏng vấn chuyên viên Logistics.
    - Group 4: Thư thông báo chính sách bảo hành và gia hạn hợp đồng thiết bị văn phòng.
  - Hỗ trợ câu hỏi điền từ/cụm từ ngữ pháp, từ vựng và câu hỏi chèn câu hoàn chỉnh (`sentence_insertion`).
  - Ràng buộc toàn vẹn nhóm: 4 câu hỏi liên kết chặt chẽ vào group, không thể tách rời.
- `src/data/questionBank/part7Reading.ts`:
  - 5 nhóm đọc hiểu Reading Comprehension (`grp-p7-001` -> `grp-p7-005`) với đúng 20 câu hỏi (`q-p7-001` -> `q-p7-020`):
    - **Single Passage 1 (`grp-p7-001`):** Email công việc về dự án thiết kế trang web (3 câu hỏi).
    - **Single Passage 2 (`grp-p7-002`):** Quảng cáo khai trương dịch vụ co-working space cao cấp (3 câu hỏi).
    - **Single Passage 3 (`grp-p7-003`):** Thông báo nội bộ quy định an ninh thẻ ra vào tòa nhà (4 câu hỏi).
    - **Double Passage (`grp-p7-004`):** Email yêu cầu báo giá/đặt hàng + Hóa đơn thương mại chi tiết (5 câu hỏi, gồm 2 câu liên kết dữ kiện đa văn bản cross-text synthesis).
    - **Triple Passage (`grp-p7-005`):** Lịch trình hội nghị quốc tế + Bản ghi nhớ phân công điều phối + Email phản hồi khẩn cấp đổi phòng hội thảo (5 câu hỏi, gồm 2 câu tổng hợp cross-text synthesis).
  - Khai thác câu hỏi chi tiết trực tiếp, câu hỏi suy luận (inference), từ vựng theo ngữ cảnh (vocabulary in context) và liên kết chéo hai/ba văn bản.
  - Mỗi lời giải đều có trích dẫn `evidence` tham chiếu chính xác vào dòng/đoạn đọc.
- `src/data/questionBank/readingBank.ts`:
  - Manifest phân vùng Reading: tổng hợp `ALL_READING_QUESTIONS` (56 câu), `ALL_READING_GROUPS` (9 groups), partitions `PART5_PARTITION`, `PART6_PARTITION`, `PART7_PARTITION` và thống kê `READING_BANK_STATS`.
- `src/data/questionBank/index.ts`:
  - Entrypoint toàn bộ Question Bank: re-export đồng thời Listening & Reading, hợp nhất `ALL_QUESTIONS` (111 câu), `ALL_GROUPS` (19 groups), manifest hợp nhất `FULL_QUESTION_BANK_MANIFEST` và thống kê toàn diện `FULL_BANK_STATS`.
- `src/utils/__tests__/questionBankValidator.test.ts`:
  - Bổ sung **Suite 5** (8 unit tests kiểm định toàn bộ production Reading Bank Part 5–7).
  - Bổ sung **Suite 6** (8 unit tests kiểm định toàn diện liên kết và tính toàn vẹn 7 Parts TOEIC: 111 câu, 19 groups, ID uniqueness, 0 orphan linkages, độ phong phú 51 topics).
  - Nâng tổng số test cases từ 34 lên **50 test cases** (100% passed).

#### Changed
- `docs/FILE_INDEX.md`: Bổ sung 5 file mới (`part5Reading.ts`, `part6Reading.ts`, `part7Reading.ts`, `readingBank.ts`, `index.ts`), nâng tổng số file mã nguồn lên 52 và cập nhật sơ đồ cây kiến trúc.
- `README.md`: Nâng phiên bản hệ thống lên `2.3.0-phase3-reading-bank`, cập nhật Feature Catalog (Module 9), danh mục file, scripts kiểm thử và Handoff Notes.

#### Fixed
- Sửa lỗi kiểu dữ liệu `QuestionBankManifest` trong `src/data/questionBank/index.ts` (chuẩn hóa `partitions` thành Record và bổ sung `questionCountByPart`, `groupCountByPart`).
- Bổ sung trường bắt buộc `skillTag` cho 56 câu hỏi Reading đảm bảo tuân thủ nghiêm ngặt giao diện `BaseQuestion`.

#### Removed
- Không có file hay mã nguồn nào bị xóa bỏ.

---

### Kết quả kiểm định thực tế
1. **Targeted Validation Tests:** Chạy `npm run test:validation` ➔ **50/50 tests passed (0 failed)**.
   - Suite 1: 9/9 tests schema questions passed.
   - Suite 2: 10/10 tests group integrity & cardinality passed.
   - Suite 3: 6/6 tests cross-entity linkage passed.
   - Suite 4: 9/9 tests Listening Bank passed (55 câu, 10 groups).
   - Suite 5: 8/8 tests Reading Bank passed (56 câu, 9 groups, Single/Double/Triple format & cross-text synthesis).
   - Suite 6: 8/8 tests Full 7-Part Bank integration passed (111 câu, 19 groups, 100% ID unique, 0 orphan references, 51 topics, 42 Easy / 52 Medium / 17 Hard).
2. **Biên dịch TypeScript & Production Bundle:** Chạy `npm run build` (`tsc -b && vite build`) ➔ **Thành công 100% (exit code 0)**.
3. **Kiểm tra cú pháp Linter:** Chạy `npm run lint` (`oxlint`) ➔ **0 errors, 62 warnings (bảo toàn đúng mức baseline, 0 warnings trong code mới)**.
4. **Bảo toàn dữ liệu người dùng:** Giữ nguyên vẹn 100% LocalStorage key `toeic_mastery_data_v2_cold`. Question Bank nằm hoàn toàn độc lập trong mã nguồn tĩnh.

---

### Các vấn đề còn tồn tại & Bước chuyển giao tiếp theo
- Chưa triển khai Selection Engine (Phase 4), Practice Session Engine (Phase 5), Audio Controller (Phase 6) hay Practice Workspace (Phase 7-8) theo đúng nguyên tắc phân chia giai đoạn.
- Ngân hàng câu hỏi 7 Parts sẵn sàng 100% cho Phase 4 tiếp nhận lựa chọn câu hỏi theo Part, độ khó và cơ chế bảo toàn group.

---

## [2.2.0-phase2-listening-bank] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 2 — Xây Dựng Ngân Hàng Câu Hỏi Listening Part 1–4 (Offline-First Question Bank)**

### Mục tiêu
Xây dựng ngân hàng đề Listening tự biên soạn với 55 câu hỏi hợp lệ (Part 1: 10 câu, Part 2: 15 câu, Part 3: 5 groups / 15 câu, Part 4: 5 groups / 15 câu). Mỗi câu có kịch bản audio/TTS chi tiết, transcript chuẩn bị sẵn cho chế độ Review (không lộ đáp án khi thi), đồ họa vector SVG nguyên gốc (không dùng placeholder), lời giải chi tiết và bẫy thi thực chiến. Chạy kiểm định toàn diện thông qua `questionBankValidator` và bộ targeted unit tests.

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/components/Diagnostic/Part1Illustrations.tsx`:
  - Bổ sung 8 đồ họa vector SVG minh họa tình huống cho Part 1 Photographs (tổng cộng 10 tranh SVG: `OfficeWomanPhoto`, `ConferenceRoomPhoto`, `ManTypingLaptopPhoto`, `WarehouseLoadingPhoto`, `ConstructionWorkerPhoto`, `ChefPreparingFoodPhoto`, `CustomerCashierPhoto`, `LibraryReaderPhoto`, `AirportConveyorPhoto`, `ParkBenchFountainPhoto`).
  - Bổ sung 2 component đồ họa bảng biểu vector: `FlightScheduleGraphic` (lịch trình bay Part 3) và `StoreDirectoryGraphic` (sơ đồ tầng trung tâm thương mại Part 4) phục vụ câu hỏi graphic-based.
- `src/components/Diagnostic/listeningIllustrationsMap.ts`:
  - Khởi tạo registry map `LISTENING_ILLUSTRATIONS` ánh xạ illustrationId sang các React SVG components, đảm bảo phân tách rõ ràng và tuân thủ Fast Refresh lint rule.
- `src/data/questionBank/part1Listening.ts`:
  - 10 câu hỏi Part 1 Photographs (`q-p1-001` -> `q-p1-010`) kèm `illustrationId` tương ứng, 4 lựa chọn A–D, kịch bản audio TTS, transcript và giải thích chi tiết vì sao các distractors sai (hành động đang diễn ra vs trạng thái, chi tiết không có trong ảnh).
- `src/data/questionBank/part2Listening.ts`:
  - 15 câu hỏi Part 2 Question-Response (`q-p2-001` -> `q-p2-015`) với promptScript, đúng 3 lựa chọn A–C (tuyệt đối không có D), transcript, đáp án và phân tích sâu các bẫy nghe TOEIC (same-sound trap, Yes/No trap cho câu hỏi Wh-, bẫy trả lời gián tiếp/evasive, thì động từ sai).
- `src/data/questionBank/part3Listening.ts`:
  - 5 nhóm hội thoại Part 3 Conversations (`grp-p3-001` -> `grp-p3-005`, 15 câu hỏi `q-p3-001` -> `q-p3-015`).
  - Kịch bản hội thoại tự nhiên giữa 2-3 người nói, transcript phân vai (Man, Woman), chủ đề công sở (chuẩn bị thuyết trình, lỗi phần mềm xuất hóa đơn, lịch trình chuyến bay, giao hàng văn phòng phẩm, đặt phòng họp).
  - Tích hợp câu hỏi bảng biểu đồ họa `flight_schedule_graphic` tại Group 3.
- `src/data/questionBank/part4Listening.ts`:
  - 5 nhóm bài nói ngắn Part 4 Talks (`grp-p4-001` -> `grp-p4-005`, 15 câu hỏi `q-p4-001` -> `q-p4-015`).
  - Nội dung phong phú: Thông báo hoãn chuyến tàu hỏa, tin nhắn thoại báo lịch bảo trì, phát thanh siêu thị điện máy (kèm graphic `store_directory_graphic`), hướng dẫn hội thảo an ninh mạng, bản tin nội bộ công bố thăng chức.
- `src/data/questionBank/listeningBank.ts`:
  - Manifest tổng hợp: `ALL_LISTENING_QUESTIONS` (55 câu), `ALL_LISTENING_GROUPS` (10 groups), các partition độc lập `PART1_PARTITION` .. `PART4_PARTITION` và thống kê `LISTENING_BANK_STATS`.
- `src/utils/__tests__/questionBankValidator.test.ts`:
  - Bổ sung Suite 4 gồm 9 bài kiểm tra production Listening Bank (tests 4.1 -> 4.9). Nâng tổng số test cases từ 25 lên 34.

#### Changed
- `docs/FILE_INDEX.md`: Cập nhật danh mục file lên 47 items và sơ đồ kiến trúc liên kết Question Bank.
- `README.md`: Nâng phiên bản hệ thống lên `2.2.0-phase2-listening-bank`, cập nhật cây thư mục, bảng trách nhiệm file, Module 9 và Handoff Notes.

#### Fixed
- Sửa lỗi cú pháp thuộc tính `options` tại câu `q-p2-009` trong `part2Listening.ts`.
- Tách `LISTENING_ILLUSTRATIONS` ra file `listeningIllustrationsMap.ts` riêng để loại bỏ cảnh báo Fast Refresh `react(only-export-components)`, đưa tổng số cảnh báo `npm run lint` trở về đúng mốc baseline 62 warnings.

#### Removed
- Không có file hay chức năng nào bị xóa bỏ.

---

### Kết quả kiểm định thực tế
1. **Targeted Validation Tests:** Chạy `npm run test:validation` ➔ **34/34 tests passed (0 failed)**.
   - Suite 1: 9/9 tests schema questions passed.
   - Suite 2: 10/10 tests group integrity & cardinality passed.
   - Suite 3: 6/6 tests cross-entity linkage passed.
   - Suite 4: 9/9 tests production Listening Bank passed (55 câu, 10 groups, 100% tài nguyên SVG illustration giải quyết thành công).
2. **Biên dịch TypeScript & Production Bundle:** Chạy `npm run build` (`tsc -b && vite build`) ➔ **Thành công 100% (exit code 0)**.
3. **Kiểm tra mã nguồn Linter:** Chạy `npm run lint` (`oxlint`) ➔ **0 errors, 62 warnings (bảo toàn đúng mức baseline, không phát sinh warnings mới)**.
4. **Bảo toàn dữ liệu người dùng:** Giữ nguyên vẹn 100% dữ liệu Cold Start và LocalStorage key `toeic_mastery_data_v2_cold`.

---

### Các vấn đề còn tồn tại & Bước chuyển giao tiếp theo
- Chưa xây dựng Reading Question Bank (Part 5–7), Selection Engine, Session Runtime hay Practice Workspace (tuân thủ nghiêm ngặt ranh giới Phase 2).
- Giọng đọc Web Speech API phụ thuộc vào voices cài đặt trên trình duyệt của máy người dùng; kịch bản TTS đã được biên soạn chi tiết theo chuẩn ngữ điệu và giới tính người nói.

---

## [2.1.0-phase1-question-bank] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Phase 1 — Khảo Sát Toàn Diện Mã Nguồn & Thiết Lập Nền Tảng Question Bank**

### Mục tiêu
Khảo sát toàn diện hệ thống mã nguồn, thiết kế hệ thống domain models/interfaces cho Question Bank (Part 1-7, grouped passages, media, learner practice session), xây dựng engine kiểm định độc lập `questionBankValidator` và bộ 25 targeted unit tests. Đảm bảo nguyên tắc Offline-First, tách biệt Question Bank tĩnh khỏi LocalStorage, bảo toàn 100% dữ liệu người dùng hiện tại và sẵn sàng mở rộng offline quy mô lớn.

---

### Những nội dung thực tế đã triển khai

#### Added
- `src/types/questionBank.ts`:
  - Discriminated unions cho câu hỏi 7 phần: `Part1Question` (visual + audio), `Part2Question` (nghiêm ngặt 3 phương án A-C), `Part3Question` & `Part4Question` (nhóm 3 câu kèm audio hội thoại/bài nói), `Part5Question` (câu đơn ngữ pháp/từ vựng), `Part6Question` (nhóm 4 câu kèm đoạn văn điền khuyết), `Part7Question` (nhóm single 2-4 câu, double/triple 5 câu).
  - Mô hình nhóm câu hỏi `QuestionGroup`: `Part3Group`, `Part4Group`, `Part6Group`, `Part7Group`.
  - Hợp đồng tài nguyên `QuestionMedia`: `AudioMedia`, `VisualMedia` (hỗ trợ cả ảnh URL lẫn inline SVG illustration ID).
  - Mô hình dữ liệu người học `PracticeSession`, `PracticeAnswer`, `PracticeResult`, `PartPerformanceStats` tách biệt hoàn toàn với dữ liệu câu hỏi tĩnh.
  - Cấu trúc phân vùng `QuestionBankPartition`, `QuestionBankManifest` phục vụ mở rộng hàng nghìn câu offline.
- `src/utils/questionBankValidator.ts`:
  - Động cơ kiểm định độc lập, tái sử dụng gồm `validateQuestion`, `validateQuestionGroup`, `validateQuestionBank`, `mergeReports`.
  - Kiểm tra tính duy nhất của ID, tính hợp lệ của phương án và đáp án đúng (Part 2 đúng 3 choices, các Part khác đúng 4 choices).
  - Kiểm tra chuẩn mực cấu trúc nhóm TOEIC: Part 3/4 đúng 3 câu, Part 6 đúng 4 câu, Part 7 single 2-4 câu, double/triple đúng 5 câu.
  - Kiểm tra tính đầy đủ của media, transcript, passage và lời giải giải thích.
  - Kiểm tra tính toàn vẹn liên kết hai chiều giữa Question và Group (không chấp nhận orphan references hoặc lệch Part).
- `src/utils/__tests__/questionBankValidator.test.ts`:
  - Bộ 25 targeted unit tests bao phủ toàn bộ các trường hợp hợp lệ, trường hợp vi phạm quy chuẩn schema, sai lệch số lượng câu nhóm và lỗi liên kết cross-entity.
- Script `npm run test:validation`: Lệnh npm thực thi bộ kiểm định trong terminal.
- Gói `tsx` trong `devDependencies` phục vụ chạy TypeScript test runner độc lập.

#### Changed
- `src/types/index.ts`: Bổ sung re-export `export * from './questionBank';` đảm bảo khả năng tương thích ngược hoàn hảo, không làm xáo trộn các interface của `AppData`.
- `tsconfig.app.json`: Bổ sung `"exclude": ["src/**/__tests__/*"]` để phân tách rõ ràng môi trường bundle trình duyệt và test runner.
- `package.json`: Đăng ký script `test:validation` và dependency `tsx`.
- `docs/FILE_INDEX.md`: Cập nhật 3 file mới, phân loại nhóm kỹ thuật và cập nhật sơ đồ liên kết kiến trúc.
- `README.md`: Cập nhật cây thư mục, bảng trách nhiệm file, bổ sung Module 9 (Question Bank Foundation) vào Feature Catalog, cập nhật danh mục script và Handoff Notes.

#### Fixed
- Không có sửa lỗi (phiên phát triển tập trung vào xây dựng nền tảng domain và validator).

#### Removed
- Không có file hoặc thành phần nào bị xóa bỏ.

---

### Kết quả kiểm định thực tế
1. **Targeted Validation Tests:** Chạy `npm run test:validation` ➔ **25/25 tests passed (0 failed)**.
2. **Biên dịch TypeScript & Production Bundle:** Chạy `npm run build` (`tsc -b && vite build`) ➔ **Thành công 100% (exit code 0)**.
3. **Kiểm tra mã nguồn Linter:** Chạy `npm run lint` (`oxlint`) ➔ **0 errors** (các file mới đạt 0 warnings, 0 errors).
4. **Bảo toàn dữ liệu:** Khóa lưu trữ LocalStorage `toeic_mastery_data_v2_cold`, `seedData.ts`, và toàn bộ 8 module hiện có giữ nguyên vẹn 100%.

---

### Các vấn đề còn tồn tại & Bước chuyển giao tiếp theo
- Dữ liệu câu hỏi thực tế quy mô lớn, giao diện luyện thi theo Part (Practice UI) và Session State Engine chưa được triển khai trong Phase 1 (tuân thủ giới hạn phạm vi Phase 1).

---

## [2.0.0-cold-start] - 2026-10-09

### Tên nhiệm vụ / Phiên bản
**Baseline — Thiết lập tài liệu chuẩn hóa hệ thống & Kiểm định toàn diện dự án**

### Mục tiêu
Khảo sát toàn diện mã nguồn, cấu hình, dữ liệu và kiểm định khả năng vận hành của ứng dụng; thiết lập bộ hồ sơ ghi nhớ dự án (`README.md`, `CHANGELOG.md`, `docs/FILE_INDEX.md`, `AGENTS.md`) đảm bảo AI Agent hoặc lập trình viên mới có thể tiếp tục phát triển mà không phải nghiên cứu lại từ đầu.

---

### Những nội dung thực tế đã triển khai (Baseline Inventory)

#### 1. Hệ thống State & Dữ liệu Cục bộ (Offline-First Persistence)
- Triển khai React Context toàn cục (`src/context/AppContext.tsx`) đồng bộ tự động với `localStorage` qua khóa lưu trữ `toeic_mastery_data_v2_cold`.
- Thiết lập trạng thái ban đầu chuẩn Cold Start trong `src/data/seedData.ts`:
  - Profile người dùng mới: `hasCompletedOnboarding: false`, `currentScore: null`, `streakDays: 0`.
  - Bộ từ vựng mẫu: 16 từ vựng cốt lõi TOEIC kèm ví dụ, bẫy đề và phiên âm IPA.
  - Sổ tay bẫy đề ETS: 7 bẫy thi phân loại theo tần suất và Part.
  - Sổ tay ngữ pháp: 4 chuyên đề ngữ pháp trọng tâm.
  - Lộ trình học 3 giai đoạn: Giai đoạn 1 (0 ➔ 600+), Giai đoạn 2 (600 ➔ 750+), Giai đoạn 3 (750 ➔ 850+).
  - Khởi tạo mảng trống cho nhật ký thi (`testLogs: []`) và bản đồ nhiệt (`activityHeatmap: {}`), loại bỏ hoàn toàn dữ liệu ảo.

#### 2. Động cơ Chẩn đoán Đầu vào (Diagnostic Engine & Onboarding)
- Triển khai modal Onboarding (`src/components/Onboarding/OnboardingModal.tsx`) với 2 luồng:
  - Khai báo điểm thi thực tế gần nhất.
  - Bài kiểm tra phân hóa nhanh 14 câu hỏi (`src/data/diagnosticQuestions.ts`) bao phủ Part 1 đến Part 7.
- Xây dựng đồ họa vector SVG thuần túy (`src/components/Diagnostic/Part1Illustrations.tsx`) mô phỏng tranh đề thi Part 1 không dùng tài nguyên ảnh ngoài.
- Tích hợp trình phát âm thanh bài nghe giả lập (`src/components/Diagnostic/ToeicAudioPlayer.tsx`) sử dụng `window.speechSynthesis` kết hợp thanh tiến trình và tô sáng đáp án (A, B, C, D).
- Xây dựng thuật toán quy đổi điểm chuẩn ETS (`src/utils/scoreConverter.ts`) tính toán điểm Listening (5-495), Reading (5-495) và phân loại Level Band.

#### 3. Bảng Điều Khiển Trung Tâm (Command Center & Analytics)
- Xây dựng giao diện trung tâm (`src/components/Dashboard/CommandCenter.tsx`) tích hợp:
  - Đồng hồ đếm ngược ngày thi thực tế (`daysLeft`).
  - Thẻ hiển thị điểm hiện tại, điểm mục tiêu và khoảng cách điểm cần bù đắp.
  - Bản đồ nhiệt hoạt động 12 tuần (84 ngày) mô phỏng phong cách GitHub, đổi màu theo mức độ đóng góp học tập thực tế.
  - Mục tiêu hàng ngày (Daily Goals) điều hướng bằng sự kiện (`triggerGoalProgress`).
  - Biểu đồ Radar 7 Parts (`src/components/Dashboard/RadarChart.tsx`) và biểu đồ cột Bar Chart của Recharts thể hiện tỷ lệ làm đúng từng phần thi dựa trên lịch sử làm bài.

#### 4. Kho Từ Vựng Lặp Lại Ngắt Quãng (Spaced Repetition Vocab Vault)
- Triển khai hệ thống ôn từ vựng SRS theo thuật toán Leitner 6 cấp độ (Stage 0 đến 5) trong `src/components/Vocabulary/VocabVault.tsx`.
- Giao diện thẻ Flashcard lật 3D sử dụng tiện ích CSS thuần trong `src/index.css` (`perspective-1000`, `preserve-3d`, `rotate-y-180`).
- Tích hợp phát âm từ vựng tiếng Anh qua Web Speech API.
- Bộ lọc từ vựng theo chủ đề, tìm kiếm từ khóa và chế độ lọc từ đến hạn ôn tập (`due_only`).
- Hỗ trợ thêm từ mới thủ công và nhập dữ liệu hàng loạt từ văn bản ngăn cách bởi tab hoặc dấu phẩy.

#### 5. Sổ Tay Bẫy Đề Thi & Công Thức Ngữ Pháp (Cheat Sheet & Traps)
- Xây dựng kho chiến thuật phòng vệ đề thi (`src/components/CheatSheet/GrammarAndTraps.tsx`) phân theo Part và tần suất (`critical`, `high`, `medium`).
- Cung cấp mô tả bẫy, chiến thuật hóa giải, câu hỏi mẫu và nút sao chép nhanh vào clipboard.
- Tính năng "Đã hiểu bẫy" kích hoạt tăng tiến độ học tập và ghi nhận vào Heatmap.

#### 6. Nhật Ký Đề Thi & Sổ Tay Phân Loại Lỗi Sai (Test Log & Mistake Notebook)
- Xây dựng trình ghi nhận điểm thi thử ETS (`src/components/TestLog/TestLogView.tsx`) với bộ chuyển đổi tức thời từ số câu đúng Raw (0-100) sang điểm Scaled (5-495).
- Biểu đồ đường Recharts theo dõi tiến trình điểm Total, Listening, Reading qua thời gian so với mốc mục tiêu.
- Sổ tay phân loại lỗi sai (Mistake Book) hỗ trợ 6 nhóm nguyên nhân chuẩn: Bẫy đề (`trap`), Từ vựng (`vocab`), Áp lực thời gian (`time`), Nối âm/nuốt âm (`listening_connected`), Hổng ngữ pháp (`grammar`), Bất cẩn (`careless`).
- Bộ lọc lỗi sai theo Part và theo nguyên nhân giúp học viên tập trung khắc phục điểm yếu.

#### 7. Bộ Đôi Đồng Hồ Bấm Giờ (Focus & Exam Timer Hub)
- Xây dựng trung tâm đồng hồ bấm giờ (`src/components/Timer/TimerHub.tsx`):
  - Chế độ thi thử ETS 120 phút với chuông cảnh báo tự động khi kết thúc Listening (45 phút) và cảnh báo 15 phút cuối giờ tô đáp án.
  - Chế độ Pomodoro 25 phút tập trung kèm chu kỳ nghỉ ngắn 5 phút và nghỉ dài 15 phút.
- Tích hợp động cơ âm thanh tổng hợp (`src/utils/audio.ts`) bằng Web Audio API với các âm sắc: Chime (hai hòa âm D5/A5), Warning Beep (sóng tam giác 740Hz), và Subtle Tick (sóng sine 440Hz).

#### 8. Sao Lưu, Phục Hồi & Tùy Chỉnh Cá Nhân
- Modal sao lưu (`src/components/Modals/BackupModal.tsx`) hỗ trợ xuất toàn bộ dữ liệu ra tệp JSON, nhập tệp JSON có kiểm tra tính hợp lệ và nút nạp lại dữ liệu mẫu (Reset to Seed Data).
- Modal thông tin cá nhân (`src/components/Modals/ProfileModal.tsx`) cho phép cập nhật tên, điểm hiện tại, điểm mục tiêu từng phần, ngày thi và thời gian học mỗi ngày.

---

### Danh sách các file/module chính trong hệ thống

- **Cấu hình & Môi trường:** `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `.oxlintrc.json`, `.gitignore`, `index.html`.
- **Tài liệu chuẩn hóa mới tạo:**
  - `README.md` (chuẩn hóa toàn diện hệ thống).
  - `CHANGELOG.md` (nhật ký thay đổi theo chuẩn Keep a Changelog).
  - `docs/FILE_INDEX.md` (lập danh mục chi tiết 100% file mã nguồn và mối quan hệ phụ thuộc).
  - `AGENTS.md` (quy chuẩn làm việc và cập nhật tài liệu tự động cho AI Agent).
- **Mã nguồn React/TypeScript:**
  - `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/App.css`.
  - `src/types/index.ts`.
  - `src/context/AppContext.tsx`.
  - `src/data/seedData.ts`, `src/data/diagnosticQuestions.ts`.
  - `src/utils/audio.ts`, `src/utils/scoreConverter.ts`.
  - `src/components/Navbar.tsx`.
  - `src/components/Dashboard/CommandCenter.tsx`, `src/components/Dashboard/RadarChart.tsx`, `src/components/Dashboard/Dashboard.tsx`.
  - `src/components/Roadmap/RoadmapView.tsx`.
  - `src/components/Vocabulary/VocabVault.tsx`.
  - `src/components/CheatSheet/GrammarAndTraps.tsx`.
  - `src/components/TestLog/TestLogView.tsx`.
  - `src/components/Timer/TimerHub.tsx`.
  - `src/components/Onboarding/OnboardingModal.tsx`.
  - `src/components/Diagnostic/ToeicAudioPlayer.tsx`, `src/components/Diagnostic/Part1Illustrations.tsx`.
  - `src/components/Modals/BackupModal.tsx`, `src/components/Modals/ProfileModal.tsx`.

---

### Kết quả Kiểm định & Đo lường (Validation & Test Results)

1. **Biên dịch TypeScript & Build Production (`npm run build`):**
   - **Kết quả:** Thành công 100% (Exit code 0).
   - **Thời gian build:** 6.94 giây.
   - **Đầu ra đóng gói:**
     - `dist/index.html`: 1.47 kB (Gzip: 0.86 kB).
     - `dist/assets/index-sHtmS8lV.css`: 75.05 kB (Gzip: 11.71 kB).
     - `dist/assets/index-bSlPovmQ.js`: 867.62 kB (Gzip: 241.98 kB).
   - **Ghi nhận:** Trình biên dịch TypeScript `tsc -b` không phát hiện bất kỳ lỗi kiểu dữ liệu (0 type errors).

2. **Kiểm tra cú pháp & Linter (`npm run lint`):**
   - **Kết quả:** Hoàn thành trong 117ms trên 23 tệp tin (Exit code 0).
   - **Tổng số lỗi:** **0 errors**.
   - **Cảnh báo:** 62 warnings (chủ yếu là `no-unused-vars` cho các icon chưa dùng và `react(only-export-components)` tại `AppContext.tsx`). Ứng dụng hoạt động hoàn toàn bình thường.

3. **Kiểm tra tính toàn vẹn Offline-First:**
   - Đã xác thực khả năng đọc/ghi LocalStorage, xuất/nhập tệp JSON và khôi phục trạng thái thành công.

---

### Vấn đề còn tồn tại & Việc cần làm tiếp (Known Issues & Next Steps)
1. Kích thước file bundle JS (`867 kB`) vượt ngưỡng cảnh báo 500 kB của Vite ➔ Cần áp dụng Dynamic Import (`React.lazy`) cho các tab `TestLogView`, `TimerHub`, `GrammarAndTraps`.
2. Dọn dẹp 62 unused import warnings được Oxlint phát hiện.
3. Bổ sung hỗ trợ tải lên trực tiếp tệp `.csv` trong chức năng nhập từ vựng của `VocabVault`.
