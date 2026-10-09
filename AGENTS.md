# QUY CHUẨN LÀM VIỆC DÀNH CHO AI AGENT — TOEIC MASTERY HUB

> **Tài liệu hướng dẫn hành vi bắt buộc dành cho mọi AI Agent (Antigravity, Gemini, Claude, Codex, GPT...) khi thực thi nhiệm vụ trong repository này.**

---

## 1. NGUYÊN TẮC CỐT LÕI
1. **Dựa trên mã nguồn thực tế (Code Truth):** Tuyệt đối không suy đoán chức năng, kiến trúc hoặc trạng thái hoàn thiện của ứng dụng nếu chưa có bằng chứng từ source code.
2. **Offline-First & Zero-Cloud Backend:** Không tự ý đưa vào các giải pháp phụ thuộc backend server, database bên ngoài hay cloud APIs làm phá vỡ triết lý hoạt động độc lập ngoại tuyến của dự án.
3. **Bảo toàn dữ liệu người dùng:** Khóa lưu trữ LocalStorage hiện tại là `toeic_mastery_data_v2_cold`. Không thay đổi cấu trúc dữ liệu trong `src/types/index.ts` mà không có cơ chế tương thích ngược (migration/fallback) hoặc xác nhận từ người dùng.
4. **Không để lại lỗi biên dịch:** Sau khi chỉnh sửa mã nguồn, luôn xác thực bằng `npm run build` và kiểm tra cú pháp bằng `npm run lint`.

---

## 2. QUY TRÌNH BẮT BUỘC SAU MỖI NHIỆM VỤ PHÁT TRIỂN

Sau mỗi phiên làm việc phát triển tính năng, sửa lỗi (bugfix), tái cấu trúc (refactoring), tối ưu hóa hoặc nâng cấp cấu hình có ảnh hưởng đến mã nguồn dự án:

### Bước 1: Kiểm tra thay đổi thực tế
- Rà soát các file đã thêm mới, chỉnh sửa hoặc xóa bỏ.
- Chạy lệnh kiểm tra biên dịch (`npm run build`) và linter (`npm run lint`).

### Bước 2: Cập nhật `README.md`
- Cập nhật mục **Kiến trúc hệ thống** nếu luồng dữ liệu, state store hoặc tích hợp thay đổi.
- Cập nhật mục **Danh sách chức năng (Feature Catalog)** nếu có tính năng mới hoặc thay đổi trạng thái hoàn thiện.
- Cập nhật mục **Handoff Notes / Technical Debts** nếu phát hiện lỗi mới hoặc đã giải quyết xong nợ kỹ thuật cũ.

### Bước 3: Cập nhật `CHANGELOG.md`
- Thêm một mục ghi chép mới theo chuẩn **Keep a Changelog** ở đầu file (dưới mốc Baseline).
- Cung cấp: Ngày cập nhật (`YYYY-MM-DD`), Tên nhiệm vụ, Mục tiêu, Nội dung thực sự đã triển khai (phân nhóm `Added`, `Changed`, `Fixed`, `Removed`), Kết quả kiểm định/build, và các vấn đề còn tồn tại.
- **Tuyệt đối không bịa lịch sử, không ghi những gì chỉ dự định làm thành những gì đã hoàn thành, không xóa hoặc ghi đè lịch sử hợp lệ cũ.**

### Bước 4: Cập nhật `docs/FILE_INDEX.md`
- Nếu tạo file mới: Thêm dòng tương ứng vào bảng danh mục file, giải thích rõ trách nhiệm, hàm/component cốt lõi và module liên quan.
- Nếu xóa hoặc đổi tên file: Cập nhật lại đường dẫn và trạng thái tương ứng.

### Bước 5: Hoàn tất cập nhật tài liệu trong chính phiên làm việc
- Việc cập nhật tài liệu (`README.md`, `CHANGELOG.md`, `docs/FILE_INDEX.md`) **phải được hoàn tất trước khi báo cáo kết quả** cho người dùng. Không hoãn cập nhật tài liệu sang phiên sau.

---

## 3. NGOẠI LỆ CHO CÁC THAY ĐỔI RẤT NHỎ
- Nếu thay đổi chỉ là chỉnh sửa chính tả văn bản hiển thị (typo), căn chỉnh vài pixel CSS không làm thay đổi hành vi người dùng, không tạo/xóa file:
  - Cho phép bỏ qua việc cập nhật `README.md`.
  - Vẫn cần xem xét bổ sung một dòng ngắn gọn vào `CHANGELOG.md` nếu có ý nghĩa đối với lịch sử phát triển.

---

## 4. BẢNG TRA CỨU NHANH CÁC LỆNH VẬN HÀNH

```bash
# Khởi chạy server phát triển
npm run dev

# Kiểm tra biên dịch TypeScript và đóng gói bản phát hành
npm run build

# Kiểm tra cú pháp và code smells bằng Oxlint
npm run lint

# Xem trước bản build production
npm run preview
```
