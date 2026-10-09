import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DIAGNOSTIC_QUESTIONS } from '../../data/diagnosticQuestions';
import { OfficeWomanPhoto, ConferenceRoomPhoto } from '../Diagnostic/Part1Illustrations';
import { ToeicAudioPlayer } from '../Diagnostic/ToeicAudioPlayer';
import {
  Compass,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  ChevronRight,
  Headphones,
  Check,
  Eye,
  EyeOff,
  Volume2
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen }) => {
  const { data, updateProfile, completeOnboardingWithScore, completeOnboardingWithDiagnostic } = useApp();
  const { profile } = data;

  const [step, setStep] = useState<'welcome' | 'choose_method' | 'direct_score' | 'diagnostic_test' | 'test_result'>('welcome');

  // Step 1: User Profile Setup
  const [name, setName] = useState(profile.name === 'Bạn' ? '' : profile.name);
  const [targetScore, setTargetScore] = useState(profile.targetScore);
  const [examDate, setExamDate] = useState(profile.examDate);

  // Method 1: Direct Score
  const [directListening, setDirectListening] = useState(320);
  const [directReading, setDirectReading] = useState(260);

  // Method 2: Diagnostic Test
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [diagResult, setDiagResult] = useState<{
    totalCorrect: number;
    listeningScaled: number;
    readingScaled: number;
    totalScore: number;
    mistakesCount: number;
  } | null>(null);

  // Reset audio state when question changes
  useEffect(() => {
    setHasPlayedAudio(false);
    setShowScript(false);
  }, [currentQIndex]);

  if (!isOpen || profile.hasCompletedOnboarding) return null;

  const handleWelcomeNext = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || 'Bạn',
      targetScore: Number(targetScore),
      examDate,
    });
    setStep('choose_method');
  };

  const handleDirectScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeOnboardingWithScore(Number(directListening), Number(directReading));
  };

  const currentQ = DIAGNOSTIC_QUESTIONS[currentQIndex];
  const isPart1 = currentQ?.partNum === 1;
  const isListening = currentQ?.section === 'listening';
  const selectedAnswer = answers[currentQ?.id];

  const handleSelectAnswer = (key: string) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: key }));
  };

  const handleNextQuestion = () => {
    if (currentQIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      const result = completeOnboardingWithDiagnostic(answers);
      setDiagResult(result);
      setStep('test_result');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 sm:p-7 max-w-2xl w-full shadow-2xl space-y-5 text-zinc-100 my-auto">
        {/* STEP 1: WELCOME & GOALS */}
        {step === 'welcome' && (
          <form onSubmit={handleWelcomeNext} className="space-y-5">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>TOEIC Mastery Hub • Thiết Lập Lộ Trình</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Khởi tạo lộ trình cá nhân từ số 0
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Hệ thống hoạt động theo nguyên tắc <strong>Start from Zero</strong>: không điểm số giả, không streak ảo. Toàn bộ lộ trình và đồ thị năng lực 7 Part sẽ được xây dựng từ kết quả thật của bạn.
              </p>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <label className="text-xs font-semibold text-zinc-300">
                  Tên hoặc biệt danh của bạn
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="VD: Minh Hoàng..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white mt-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300">
                    Điểm mục tiêu (Target Score)
                  </label>
                  <select
                    value={targetScore}
                    onChange={e => setTargetScore(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white mt-1.5 font-mono font-bold text-blue-400 focus:border-blue-500 outline-none"
                  >
                    <option value={600}>600+ (Chuẩn cơ bản)</option>
                    <option value={700}>700+ (Khá)</option>
                    <option value={750}>750+ (Doanh nghiệp yêu cầu)</option>
                    <option value={800}>800+ (Nâng cao)</option>
                    <option value={850}>850+ (Mục tiêu khuyến nghị)</option>
                    <option value={900}>900+ (Xuất sắc)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300">
                    Ngày thi dự kiến
                  </label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={e => setExamDate(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white mt-1.5 font-mono focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
              >
                <span>Tiếp tục: Xác định năng lực</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: CHOOSE METHOD */}
        {step === 'choose_method' && (
          <div className="space-y-5">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-blue-400">
                Bước 2 / 2: Điểm Khởi Điểm (Baseline)
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Chọn cách xác định điểm khởi điểm
              </h2>
              <p className="text-xs text-zinc-400">
                Hệ thống cần điểm khởi điểm để vẽ Biểu đồ năng lực 7 Part và tính toán khoảng cách đến mục tiêu {targetScore}+.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Option A: Direct score */}
              <div
                onClick={() => setStep('direct_score')}
                className="group cursor-pointer p-5 rounded-2xl border border-zinc-800 hover:border-blue-500 bg-zinc-900/60 hover:bg-zinc-900 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                    Tôi Đã Có Điểm Gần Nhất
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Bạn đã từng thi thật hoặc giải trọn vẹn 1 đề ETS và đã có sẵn điểm Listening / Reading.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-blue-400">
                  <span>Nhập điểm trực tiếp</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Option B: Mini Diagnostic Test */}
              <div
                onClick={() => setStep('diagnostic_test')}
                className="group cursor-pointer p-5 rounded-2xl border border-blue-500/40 hover:border-blue-500 bg-blue-950/20 hover:bg-blue-950/30 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">
                      Mini Diagnostic Test
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Khuyên dùng
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Làm bài kiểm tra nhanh <strong>14 câu đại diện Part 1 đến Part 7 (~8 phút)</strong> với ảnh thật và audio để đo chính xác thế mạnh/yếu.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                  <span>Bắt đầu kiểm tra 14 câu</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep('welcome')}
                className="text-xs text-zinc-400 hover:text-zinc-200"
              >
                Quay lại
              </button>
            </div>
          </div>
        )}

        {/* STEP 3A: DIRECT SCORE INPUT */}
        {step === 'direct_score' && (
          <form onSubmit={handleDirectScoreSubmit} className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">
                Nhập Điểm Thi Gần Nhất
              </h2>
              <p className="text-xs text-zinc-400">
                Thang điểm từ 5 đến 495 cho mỗi kỹ năng.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div>
                <label className="text-xs font-semibold text-zinc-300">
                  Điểm Listening (5 - 495)
                </label>
                <input
                  type="number"
                  min={5}
                  max={495}
                  step={5}
                  required
                  value={directListening}
                  onChange={e => setDirectListening(Number(e.target.value))}
                  className="w-full text-base font-mono font-bold px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-blue-400 mt-1.5 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300">
                  Điểm Reading (5 - 495)
                </label>
                <input
                  type="number"
                  min={5}
                  max={495}
                  step={5}
                  required
                  value={directReading}
                  onChange={e => setDirectReading(Number(e.target.value))}
                  className="w-full text-base font-mono font-bold px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-purple-400 mt-1.5 focus:border-purple-500 outline-none"
                />
              </div>

              <div className="col-span-2 pt-3 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300">
                  Tổng Điểm Khởi Điểm:
                </span>
                <span className="text-xl font-mono font-black text-emerald-400">
                  {directListening + directReading} / 990
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep('choose_method')}
                className="text-xs text-zinc-400 hover:text-zinc-200"
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm"
              >
                Xác Nhận & Kích Hoạt Lộ Trình
              </button>
            </div>
          </form>
        )}

        {/* STEP 3B: INTERACTIVE DIAGNOSTIC TEST (PROPER PART 1 + AUDIO PLAYER) */}
        {step === 'diagnostic_test' && currentQ && (
          <div className="space-y-4">
            {/* Progress header */}
            <div className="flex items-center justify-between text-xs pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {currentQ.part}
                </span>
                <span className="text-zinc-400 font-medium">
                  {currentQ.skillTag}
                </span>
              </div>
              <span className="font-mono text-xs font-semibold text-zinc-300">
                Câu {currentQIndex + 1} / {DIAGNOSTIC_QUESTIONS.length}
              </span>
            </div>

            {/* PART 1: REAL PHOTO RENDERING (NO TEXT DESCRIPTION) */}
            {isPart1 && (
              <div className="space-y-2">
                <div className="w-full">
                  {currentQ.id === 'diag-1' && <OfficeWomanPhoto />}
                  {currentQ.id === 'diag-2' && <ConferenceRoomPhoto />}
                </div>
              </div>
            )}

            {/* PART 3, 4, 6, 7 STIMULUS (Text passages or dialogues) */}
            {!isPart1 && currentQ.stimulus && (
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 whitespace-pre-line leading-relaxed">
                {currentQ.stimulus}
              </div>
            )}

            {/* AUDIO PLAYER FOR LISTENING PARTS */}
            {isListening && (
              <div className="space-y-2">
                <ToeicAudioPlayer
                  questionId={currentQ.id}
                  partNum={currentQ.partNum}
                  audioScript={currentQ.audioScript || ''}
                  statements={isPart1 ? currentQ.options : undefined}
                  onPlayStarted={() => setHasPlayedAudio(true)}
                />

                {/* Part 1/2 Script Reveal Toggle (Optional for review) */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowScript(!showScript)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
                  >
                    {showScript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showScript ? 'Ẩn bản dịch/script' : 'Xem audio script'}</span>
                  </button>
                </div>

                {showScript && (
                  <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-300 space-y-1 font-mono">
                    <p className="text-blue-400 font-bold">Audio Transcript:</p>
                    {isPart1 ? (
                      currentQ.options.map(opt => (
                        <p key={opt.key}>({opt.key}) {opt.text}</p>
                      ))
                    ) : (
                      <p>{currentQ.audioScript}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Question Text */}
            <h3 className="font-bold text-sm text-white pt-1">
              {currentQ.question}
            </h3>

            {/* Answer Choices */}
            <div className="space-y-2 pt-1">
              {currentQ.options.map((opt) => {
                const isSelected = selectedAnswer === opt.key;
                // In Part 1, if user has not played audio yet, subtly dim options to encourage listening first
                const isDimmed = isPart1 && !hasPlayedAudio && !selectedAnswer;

                return (
                  <div
                    key={opt.key}
                    onClick={() => handleSelectAnswer(opt.key)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500 text-white font-medium ring-1 ring-blue-500'
                        : isDimmed
                        ? 'bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:border-zinc-700'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {isSelected ? <Check className="w-3 h-3" /> : opt.key}
                    </span>
                    <span className="leading-relaxed flex-1">{opt.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Navigation & NEXT BUTTON */}
            <div className="flex justify-between items-center pt-3 border-t border-zinc-800">
              <button
                type="button"
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => prev - 1)}
                className="text-xs text-zinc-400 hover:text-zinc-200 disabled:opacity-30 transition-colors"
              >
                Câu trước
              </button>

              {/* NEXT BUTTON: Immediately enabled and bright blue when any option is selected */}
              <button
                type="button"
                disabled={!selectedAnswer}
                onClick={handleNextQuestion}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedAnswer
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 cursor-pointer active:scale-95'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'
                }`}
              >
                <span>
                  {currentQIndex === DIAGNOSTIC_QUESTIONS.length - 1
                    ? 'Nộp bài & Phân tích kết quả'
                    : 'Câu tiếp theo'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: DIAGNOSTIC RESULT CELEBRATION */}
        {step === 'test_result' && diagResult && (
          <div className="space-y-6 text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white">
                Hoàn Thành Mini Diagnostic Test!
              </h2>
              <p className="text-xs text-zinc-400">
                Đã hoàn tất phân tích 14 câu hỏi đại diện Part 1 đến Part 7 của bạn.
              </p>
            </div>

            {/* Score Results Card */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div>
                <span className="text-[11px] text-zinc-400 block">Số câu đúng</span>
                <span className="text-lg font-mono font-bold text-white">
                  {diagResult.totalCorrect} / 14
                </span>
              </div>
              <div>
                <span className="text-[11px] text-zinc-400 block">Listening est.</span>
                <span className="text-lg font-mono font-bold text-blue-400">
                  {diagResult.listeningScaled}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-zinc-400 block">Reading est.</span>
                <span className="text-lg font-mono font-bold text-purple-400">
                  {diagResult.readingScaled}
                </span>
              </div>
              <div className="col-span-3 pt-3 border-t border-zinc-800 flex items-center justify-center gap-2">
                <span className="text-xs font-semibold text-zinc-300">
                  Tổng Điểm Khởi Đầu Thực Tế:
                </span>
                <span className="text-2xl font-black font-mono text-emerald-400">
                  {diagResult.totalScore} / 990
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 italic">
              ✨ Dữ liệu điểm và {diagResult.mistakesCount} câu sai đã được lưu vào Sổ Lỗi Sai & cập nhật ngay vào Biểu Đồ Năng Lực 7 Part!
            </p>

            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
            >
              Vào Dashboard Quản Lý Lộ Trình Ngay ➔
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
