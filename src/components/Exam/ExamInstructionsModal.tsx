/**
 * TOEIC Mastery Hub — Exam Instructions Modal (Phase 13)
 *
 * Presents official ETS TOEIC Listening & Reading exam regulations,
 * 7-Part breakdown, strict audio invariants, answer sheet mechanics,
 * auto-save policies, and transparent Simulation vs Strict mode comparison.
 */

import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Headphones,
  FileText,
  Clock,
  ShieldAlert,
  Save,
  Laptop,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface ExamInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToPreflight?: () => void;
}

export const ExamInstructionsModal: React.FC<ExamInstructionsModalProps> = ({
  isOpen,
  onClose,
  onProceedToPreflight,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'parts' | 'rules' | 'offline'>(
    'overview'
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-amber-500 p-0.5 shadow-md shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-white">
                <BookOpen className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Quy Chế & Hướng Dẫn Phòng Thi Chuẩn ETS
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  200 Câu / 120 Phút
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quy chuẩn thi thử mô phỏng đề thi TOEIC Listening & Reading chuẩn hóa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/40 dark:bg-slate-850/40 gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Clock className="w-4 h-4" />
            1. Cấu Trúc 120 Phút
          </button>
          <button
            onClick={() => setActiveTab('parts')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'parts'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            2. Chi Tiết 7 Parts
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'rules'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Headphones className="w-4 h-4" />
            3. Quy Tắc Audio & Strict
          </button>
          <button
            onClick={() => setActiveTab('offline')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'offline'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Laptop className="w-4 h-4" />
            4. Tự Lưu & Offline
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Listening Card */}
                <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                      <Headphones className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      Phần 1: Listening Comprehension
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                      45 Phút
                    </span>
                  </div>
                  <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                    <li>• <strong>Số lượng câu hỏi:</strong> 100 câu (Câu 1 đến Câu 100).</li>
                    <li>• <strong>Thời lượng:</strong> 45 phút cố định, chạy liên tục.</li>
                    <li>• <strong>Hình thức:</strong> Nghe các đoạn ghi âm bằng tiếng Anh và chọn câu trả lời đúng.</li>
                    <li>• <strong>Chuyển phần thi:</strong> Hết 45 phút, hệ thống tự động khóa phần Nghe và chuyển sang phần Đọc.</li>
                  </ul>
                </div>

                {/* Reading Card */}
                <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      Phần 2: Reading Comprehension
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                      75 Phút
                    </span>
                  </div>
                  <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                    <li>• <strong>Số lượng câu hỏi:</strong> 100 câu (Câu 101 đến Câu 200).</li>
                    <li>• <strong>Thời lượng:</strong> 75 phút tự do phân bổ thời gian giữa Part 5, 6, 7.</li>
                    <li>• <strong>Hình thức:</strong> Đọc các câu chưa hoàn chỉnh, đoạn văn điền từ và bài đọc hiểu.</li>
                    <li>• <strong>Tự động nộp bài:</strong> Hết 75 phút Reading (hoặc tổng 120 phút), bài thi tự động nộp ngay lập tức.</li>
                  </ul>
                </div>
              </div>

              {/* Strict vs Simulation Comparison Banner */}
              <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20">
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-amber-600" />
                  So Sánh Minh Bạch: Chế Độ Strict Mock vs. Chế Độ Mô Phỏng (Simulation)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                    <p className="font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                      Chế độ Strict Mock (Khóa kỷ luật phòng thi):
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      Đòi hỏi gói tệp âm thanh phòng thu và timeline kiểm chứng. Cấm tua, cấm nghe lại, cấm tạm dừng, không thể sửa phần Nghe khi đã vào phần Đọc. <em>(Hiện bị khóa cứng trên Form 01 do chưa có file thu âm phòng thu)</em>.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                      Chế độ Mô Phỏng (Simulation Mode — Sẵn sàng):
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      Sử dụng Web Speech API native đọc kịch bản phân vai chuẩn ngữ cảnh. Cho phép tạm dừng khi có việc đột xuất. Đảm bảo 100% trải nghiệm học tập, dán nhãn minh bạch không thay thế kết quả thi thực tế.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'parts' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Đề thi bao gồm 7 phần liên hoàn với cấu trúc câu hỏi và phân bố đáp án chuẩn hóa theo đề thi thật của ETS:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Part 1: Photographs</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    6 câu (Q1–Q6). Nhìn hình vẽ minh họa vector SVG và chọn 1 trong 4 câu miêu tả phù hợp nhất (A, B, C, D).
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Part 2: Question-Response</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    25 câu (Q7–Q31). Nghe 1 câu hỏi/phát biểu và chọn 1 trong <strong>3 phương án trả lời (A, B, C)</strong>. Không in trên đề.
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Part 3: Conversations</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    39 câu (Q32–Q70, 13 nhóm). Nghe đoạn hội thoại giữa 2-3 người và trả lời 3 câu hỏi cho mỗi đoạn. Có câu hỏi bảng biểu đồ họa.
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Part 4: Short Talks</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    30 câu (Q71–Q100, 10 nhóm). Nghe bài nói độc thoại ngắn (thông báo, voicemail, thuyết trình) và trả lời 3 câu hỏi cho mỗi bài.
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Part 5: Incomplete Sentences</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    30 câu (Q101–Q130). Chọn 1 trong 4 từ/cụm từ (A, B, C, D) thích hợp nhất để hoàn thành câu đơn.
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Part 6: Text Completion</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    16 câu (Q131–Q146, 4 nhóm). Đọc 4 văn bản công sở (email, memo, notice, letter), mỗi bài điền 4 chỗ trống (từ loại, từ vựng và câu hoàn chỉnh).
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 md:col-span-2">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Part 7: Reading Comprehension</span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    54 câu (Q147–Q200, 15 nhóm). Gồm 10 đoạn đơn (Single Passages: 29 câu) và 5 đoạn đa văn bản (Multiple Passages: 2 Double + 3 Triple = 25 câu). Có câu hỏi đối chiếu đa văn bản và câu chèn vị trí `[1]`..`[4]`.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-2">
                <h4 className="text-xs font-bold text-rose-900 dark:text-rose-300 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  Kỷ Luật Phòng Thi & Quy Tắc Âm Thanh Cố Định
                </h4>
                <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                  <li>• <strong>Không tua (No Seeking):</strong> Không thể tua thanh tiến trình âm thanh tới vị trí bất kỳ.</li>
                  <li>• <strong>Không nghe lại (No Replay):</strong> Mỗi đoạn âm thanh chỉ được phát đúng 1 lần duy nhất theo trình tự.</li>
                  <li>• <strong>Tốc độ cố định 1.0x:</strong> Không cho phép tăng hoặc giảm tốc độ phát âm thanh trong giờ thi.</li>
                  <li>• <strong>Ẩn Transcript / Key:</strong> Tuyệt đối không hiển thị lời thoại hay đáp án trong lúc làm bài thi.</li>
                  <li>• <strong>Cách ly Answer Sheet:</strong> Bạn có thể tự do bấm xem các câu hỏi trên phiếu trả lời để đọc trước câu hỏi mà không làm gián đoạn bài nghe; quay lại câu cũ không kích hoạt phát lại audio.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-2">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  Đánh Dấu Câu (Flag) & Phiếu Trả Lời (Answer Sheet)
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Bạn có thể sử dụng biểu tượng lá cờ (Flag) hoặc phím tắt để đánh dấu những câu còn phân vân. Bảng ma trận 200 câu sẽ đổi màu giúp bạn nhận diện nhanh câu chưa làm và câu đã đánh dấu để kịp thời rà soát trước khi hết giờ.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'offline' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Save className="w-4 h-4 text-emerald-600" />
                    Tự Động Lưu Thời Gian Thực
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Mọi đáp án được tự động lưu ngay lập tức vào LocalStorage trên máy bạn. Nếu vô tình tải lại trang (F5) hoặc mất kết nối mạng, toàn bộ đáp án đã chọn sẽ được phục hồi nguyên vẹn.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Khuyến Cáo Thi Trực Tuyến / Offline
                  </span>
                  <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                    <li>• Sử dụng tai nghe để có chất lượng âm thanh tốt nhất.</li>
                    <li>• Không mở đồng thời nhiều tab thi cùng một lúc.</li>
                    <li>• Đảm bảo pin thiết bị đủ cho 120 phút liên tục.</li>
                    <li>• Không chỉnh lùi giờ hệ điều hành để tránh bị gắn cờ gian lận.</li>
                  </ul>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-300">
                💡 <strong>Triết lý Offline-First:</strong> Dữ liệu thi của bạn hoàn toàn nằm trên trình duyệt cục bộ, không gửi ra máy chủ đám mây, bảo đảm quyền riêng tư tuyệt đối.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Hãy chắc chắn bạn đã nắm rõ quy chế trước khi bước vào phòng thi.
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Đóng
            </button>
            {onProceedToPreflight && (
              <button
                onClick={() => {
                  onClose();
                  onProceedToPreflight();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
              >
                Tiếp Tục: Kiểm Tra Phòng Thi (Preflight)
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
