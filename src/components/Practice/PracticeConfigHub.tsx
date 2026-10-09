import React, { useState, useMemo } from 'react';
import {
  ToeicPartNumber,
} from '../../types/questionBank';
import {
  selectQuestions,
  getFeasibleCountsDetail,
  calculateRecommendedTime,
  formatDurationPace,
  getBankAvailability,
  PracticeDifficultyOption,
  SelectionResult,
  SelectionHistory,
} from '../../utils/questionSelector';
import {
  BookOpen,
  Timer,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sliders,
  Sparkles,
  Info,
  Check,
  Zap,
} from 'lucide-react';

export interface PracticeConfigData {
  partNum: ToeicPartNumber;
  difficulty: PracticeDifficultyOption;
  questionCount: number;
  mode: 'practice' | 'timed';
  timeLimitSeconds?: number;
  allowAudioReplay: boolean;
  showInstantFeedback: boolean;
  strictAudioOnce: boolean;
  timeWarningChime: boolean;
}

export interface PracticeConfigHubProps {
  onStartPractice?: (config: PracticeConfigData, result: SelectionResult) => void;
  onCancel?: () => void;
  initialPart?: ToeicPartNumber;
  history?: SelectionHistory;
}

interface PartMeta {
  partNum: ToeicPartNumber;
  name: string;
  vietnameseTitle: string;
  section: 'listening' | 'reading';
  groupFormat: 'single' | 'group3' | 'group4' | 'group_var';
  groupBadge: string;
  description: string;
}

const PART_METAS: PartMeta[] = [
  {
    partNum: 1,
    name: 'Part 1',
    vietnameseTitle: 'Photographs',
    section: 'listening',
    groupFormat: 'single',
    groupBadge: 'Câu đơn lẻ',
    description: 'Miêu tả hình ảnh thực tế (10 câu SVG kèm audio)',
  },
  {
    partNum: 2,
    name: 'Part 2',
    vietnameseTitle: 'Question-Response',
    section: 'listening',
    groupFormat: 'single',
    groupBadge: '3 phương án A–C',
    description: 'Hỏi đáp phản xạ nhanh không có phương án D',
  },
  {
    partNum: 3,
    name: 'Part 3',
    vietnameseTitle: 'Conversations',
    section: 'listening',
    groupFormat: 'group3',
    groupBadge: 'Nhóm 3 câu cố định',
    description: 'Hội thoại ngắn 2–3 nhân vật kèm bảng biểu',
  },
  {
    partNum: 4,
    name: 'Part 4',
    vietnameseTitle: 'Short Talks',
    section: 'listening',
    groupFormat: 'group3',
    groupBadge: 'Nhóm 3 câu cố định',
    description: 'Bài nói độc thoại thông báo, phát thanh & voicemail',
  },
  {
    partNum: 5,
    name: 'Part 5',
    vietnameseTitle: 'Incomplete Sentences',
    section: 'reading',
    groupFormat: 'single',
    groupBadge: 'Câu đơn lẻ',
    description: 'Ngữ pháp, từ loại & từ vựng công sở chuẩn ETS',
  },
  {
    partNum: 6,
    name: 'Part 6',
    vietnameseTitle: 'Text Completion',
    section: 'reading',
    groupFormat: 'group4',
    groupBadge: 'Nhóm 4 câu cố định',
    description: 'Điền từ và chèn cả câu vào văn bản doanh nghiệp',
  },
  {
    partNum: 7,
    name: 'Part 7',
    vietnameseTitle: 'Reading Comprehension',
    section: 'reading',
    groupFormat: 'group_var',
    groupBadge: 'Single / Double / Triple',
    description: 'Đọc hiểu đoạn đơn, đoạn kép và đoạn ba tổng hợp',
  },
];

function getDefaultCount(part: ToeicPartNumber, feasibleCounts: number[]): number {
  if (feasibleCounts.length === 0) return 0;
  if (part === 1) return feasibleCounts.includes(5) ? 5 : feasibleCounts[0];
  if (part === 2) return feasibleCounts.includes(6) ? 6 : (feasibleCounts.includes(5) ? 5 : feasibleCounts[0]);
  if (part === 3 || part === 4) return feasibleCounts.includes(6) ? 6 : feasibleCounts[0];
  if (part === 5) return feasibleCounts.includes(10) ? 10 : feasibleCounts[0];
  if (part === 6) return feasibleCounts.includes(8) ? 8 : feasibleCounts[0];
  if (part === 7) return feasibleCounts.includes(10) ? 10 : feasibleCounts[0];
  return feasibleCounts[0];
}

export const PracticeConfigHub: React.FC<PracticeConfigHubProps> = ({
  onStartPractice,
  onCancel,
  initialPart = 5,
  history,
}) => {
  // 1. Form States
  const [selectedPart, setSelectedPart] = useState<ToeicPartNumber>(initialPart);
  const [selectedDifficulty, setSelectedDifficulty] = useState<PracticeDifficultyOption>('mixed');
  const [mode, setMode] = useState<'practice' | 'timed'>('practice');

  // Feasibility detail for current Part & Difficulty
  const feasibilityDetail = useMemo(() => {
    return getFeasibleCountsDetail(selectedPart, selectedDifficulty);
  }, [selectedPart, selectedDifficulty]);

  const bankStats = useMemo(() => {
    return getBankAvailability();
  }, []);

  // 2. Question count state
  const [questionCount, setQuestionCount] = useState<number>(() => {
    const detail = getFeasibleCountsDetail(initialPart, 'mixed');
    return getDefaultCount(initialPart, detail.feasibleCounts);
  });

  const handleSelectPart = (newPart: ToeicPartNumber) => {
    setSelectedPart(newPart);
    const detail = getFeasibleCountsDetail(newPart, selectedDifficulty);
    setQuestionCount(getDefaultCount(newPart, detail.feasibleCounts));
  };

  const handleSelectDifficulty = (newDiff: PracticeDifficultyOption) => {
    setSelectedDifficulty(newDiff);
    const detail = getFeasibleCountsDetail(selectedPart, newDiff);
    if (!detail.feasibleCounts.includes(questionCount)) {
      setQuestionCount(getDefaultCount(selectedPart, detail.feasibleCounts));
    }
  };

  // Pacing & Time options
  const defaultRecommendedSeconds = useMemo(() => {
    return calculateRecommendedTime(selectedPart, questionCount > 0 ? questionCount : 1);
  }, [selectedPart, questionCount]);

  const [timeMultiplier, setTimeMultiplier] = useState<'standard' | 'fast' | 'relaxed' | 'custom'>('standard');
  const [customMinutes, setCustomMinutes] = useState<number>(Math.ceil(defaultRecommendedSeconds / 60));

  // Toggles
  const [allowAudioReplay, setAllowAudioReplay] = useState<boolean>(true);
  const [showInstantFeedback, setShowInstantFeedback] = useState<boolean>(true);
  const [strictAudioOnce, setStrictAudioOnce] = useState<boolean>(false);
  const [timeWarningChime, setTimeWarningChime] = useState<boolean>(true);

  // Computed time limit in seconds for Timed mode
  const effectiveTimeLimitSeconds = useMemo(() => {
    if (mode !== 'timed') return undefined;
    if (timeMultiplier === 'standard') return defaultRecommendedSeconds;
    if (timeMultiplier === 'fast') return Math.max(30, Math.round(defaultRecommendedSeconds * 0.8));
    if (timeMultiplier === 'relaxed') return Math.round(defaultRecommendedSeconds * 1.2);
    if (timeMultiplier === 'custom') return Math.max(60, customMinutes * 60);
    return defaultRecommendedSeconds;
  }, [mode, timeMultiplier, defaultRecommendedSeconds, customMinutes]);

  // 3. Selection preview simulation (pure calculation)
  const selectionPreview: SelectionResult = useMemo(() => {
    return selectQuestions({
      partNum: selectedPart,
      difficulty: selectedDifficulty,
      questionCount,
      history,
    });
  }, [selectedPart, selectedDifficulty, questionCount, history]);

  const currentPartMeta = useMemo(() => {
    return PART_METAS.find(p => p.partNum === selectedPart) ?? PART_METAS[0];
  }, [selectedPart]);

  const isValidConfiguration = selectionPreview.status === 'success';

  // Handle submit action
  const handleStart = () => {
    if (!isValidConfiguration) return;

    const configData: PracticeConfigData = {
      partNum: selectedPart,
      difficulty: selectedDifficulty,
      questionCount,
      mode,
      timeLimitSeconds: effectiveTimeLimitSeconds,
      allowAudioReplay: mode === 'practice' ? allowAudioReplay : !strictAudioOnce,
      showInstantFeedback: mode === 'practice' ? showInstantFeedback : false,
      strictAudioOnce: mode === 'timed' ? strictAudioOnce : false,
      timeWarningChime: mode === 'timed' ? timeWarningChime : false,
    };

    if (onStartPractice) {
      onStartPractice(configData, selectionPreview);
    }
  };

  // Find closest feasible count for quick-fix suggestion
  const closestFeasibleCount = useMemo(() => {
    const list = feasibilityDetail.feasibleCounts;
    if (list.length === 0) return null;
    let closest = list[0];
    let minDiff = Math.abs(questionCount - closest);
    for (const c of list) {
      const diff = Math.abs(questionCount - c);
      if (diff < minDiff) {
        minDiff = diff;
        closest = c;
      }
    }
    return closest;
  }, [feasibilityDetail.feasibleCounts, questionCount]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 transition-colors">
      {/* Header Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Practice Configuration Studio
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Offline Question Bank v2.3
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Thiết Lập Phiên Luyện Tập
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Tùy biến phần thi, cấp độ, thời gian và chế độ làm bài với thuật toán chống lặp thông minh.
          </p>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="self-start md:self-auto px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Quay lại
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Configuration Controls (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* STEP 1: Select TOEIC Part */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                  1
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Chọn Phần Thi (Part 1 – Part 7)
                </h2>
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {currentPartMeta.section === 'listening' ? '🎧 Listening Section' : '📖 Reading Section'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {PART_METAS.map((p) => {
                const isSelected = selectedPart === p.partNum;
                const totalInPart = bankStats.byPart[p.partNum]?.total ?? 0;
                const isListening = p.section === 'listening';

                return (
                  <button
                    key={p.partNum}
                    type="button"
                    onClick={() => handleSelectPart(p.partNum)}
                    className={`flex flex-col p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? isListening
                          ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 dark:border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                          : 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 dark:border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-950/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                        isListening
                          ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300'
                          : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                      }`}>
                        {p.name}
                      </span>
                      {isSelected && (
                        <Check className={`w-3.5 h-3.5 ${isListening ? 'text-blue-600' : 'text-emerald-600'}`} />
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {p.vietnameseTitle}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 font-mono">
                      {totalInPart} câu
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Part Meta Description */}
            <div className="mt-3.5 p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {currentPartMeta.name} — {currentPartMeta.vietnameseTitle}:
                </span>{' '}
                {currentPartMeta.description}.{' '}
                <span className="inline-block px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-200/60 dark:border-indigo-800/60 ml-1">
                  {currentPartMeta.groupBadge}
                </span>
              </div>
            </div>
          </div>

          {/* STEP 2: Select Difficulty */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                  2
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Chọn Độ Khó (Difficulty)
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {selectedDifficulty === 'mixed'
                  ? `${bankStats.byPart[selectedPart]?.total ?? 0} câu khả dụng`
                  : `${bankStats.byPart[selectedPart]?.[selectedDifficulty] ?? 0} câu khả dụng`}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  id: 'mixed' as PracticeDifficultyOption,
                  label: 'Hỗn Hợp',
                  badge: 'Đề Chuẩn',
                  desc: 'Phối hợp Dễ, Vừa & Khó',
                  color: 'indigo',
                  count: bankStats.byPart[selectedPart]?.total ?? 0,
                },
                {
                  id: 'easy' as PracticeDifficultyOption,
                  label: 'Dễ (Easy)',
                  badge: 'Cơ Bản',
                  desc: 'Xây nền & tăng phản xạ',
                  color: 'emerald',
                  count: bankStats.byPart[selectedPart]?.easy ?? 0,
                },
                {
                  id: 'medium' as PracticeDifficultyOption,
                  label: 'Vừa (Medium)',
                  badge: '600–750+',
                  desc: 'Chuẩn format đề thi',
                  color: 'amber',
                  count: bankStats.byPart[selectedPart]?.medium ?? 0,
                },
                {
                  id: 'hard' as PracticeDifficultyOption,
                  label: 'Khó (Hard)',
                  badge: '750–990',
                  desc: 'Bẫy thi & từ vựng hiếm',
                  color: 'rose',
                  count: bankStats.byPart[selectedPart]?.hard ?? 0,
                },
              ].map(d => {
                const isSelected = selectedDifficulty === d.id;
                const isDisabled = d.count === 0;

                return (
                  <button
                    key={d.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleSelectDifficulty(d.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isDisabled
                        ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                        : isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 dark:border-indigo-500 shadow-sm ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-950/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {d.label}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                        {d.count} câu
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                      {d.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Select Question Count & Feasibility Validation */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                  3
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Số Lượng Câu Hỏi (Question Count)
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Tối đa: {feasibilityDetail.maxAvailable} câu
              </span>
            </div>

            {/* Presets Grid */}
            <div className="mb-4">
              <label className="text-xs text-slate-500 dark:text-slate-400 block mb-2">
                Chọn nhanh số câu khả thi theo quy chuẩn ETS:
              </label>
              <div className="flex flex-wrap gap-2">
                {feasibilityDetail.feasibleCounts.map(count => {
                  const isSelected = questionCount === count;
                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setQuestionCount(count)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/60'
                      }`}
                    >
                      {count} câu
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Manual input with live feasibility feedback */}
            <div className="flex items-center gap-3">
              <div className="w-36">
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                  Nhập số câu tùy chỉnh:
                </label>
                <input
                  type="number"
                  min={1}
                  max={feasibilityDetail.maxAvailable || 100}
                  value={questionCount || ''}
                  onChange={e => {
                    const val = parseInt(e.target.value, 10);
                    setQuestionCount(isNaN(val) ? 0 : val);
                  }}
                  className={`w-full px-3 py-2 text-sm font-mono font-bold rounded-xl border bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 transition-colors ${
                    selectionPreview.status === 'success'
                      ? 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
                      : 'border-rose-400 dark:border-rose-600 focus:ring-rose-500 text-rose-600 dark:text-rose-400'
                  }`}
                />
              </div>

              <div className="flex-1 pt-4 text-xs text-slate-500 dark:text-slate-400">
                {feasibilityDetail.stepDescription}
              </div>
            </div>

            {/* Alert Banner if Count is Impossible or Insufficient */}
            {selectionPreview.status === 'impossible_count' && (
              <div className="mt-4 p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/80 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300">
                    Số câu không thể ghép đúng nhóm
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-400/90 mt-0.5 leading-relaxed">
                    {selectionPreview.reason}
                  </p>
                  {closestFeasibleCount && (
                    <button
                      type="button"
                      onClick={() => setQuestionCount(closestFeasibleCount)}
                      className="mt-2 text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 hover:bg-amber-300 dark:hover:bg-amber-800 transition-colors inline-flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Tự động đổi sang {closestFeasibleCount} câu hợp lệ
                    </button>
                  )}
                </div>
              </div>
            )}

            {selectionPreview.status === 'insufficient_questions' && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-300/80 dark:border-rose-800/80 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-rose-900 dark:text-rose-300">
                    Ngân hàng không đủ câu hỏi
                  </h4>
                  <p className="text-xs text-rose-800 dark:text-rose-400/90 mt-0.5 leading-relaxed">
                    {selectionPreview.reason}
                  </p>
                  {selectionPreview.availableCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setQuestionCount(selectionPreview.availableCount)}
                      className="mt-2 text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-200/80 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200 hover:bg-rose-300 dark:hover:bg-rose-800 transition-colors inline-flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Lấy tối đa {selectionPreview.availableCount} câu khả dụng
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* STEP 4: Practice Mode & Timing Controls */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                  4
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Chế Độ Làm Bài & Thời Lượng (Session Mode)
                </h2>
              </div>
            </div>

            {/* Mode Toggle Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {/* Practice Mode */}
              <button
                type="button"
                onClick={() => setMode('practice')}
                className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                  mode === 'practice'
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 dark:border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-950/40'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  mode === 'practice'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Luyện Tập Tự Do (Practice Mode)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Không áp lực thời gian. Xem gợi ý chiến thuật và nghe lại audio thoải mái.
                  </p>
                </div>
              </button>

              {/* Timed Mode */}
              <button
                type="button"
                onClick={() => setMode('timed')}
                className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                  mode === 'timed'
                    ? 'border-amber-600 bg-amber-50/70 dark:bg-amber-950/40 dark:border-amber-500 ring-2 ring-amber-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-950/40'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  mode === 'timed'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Bấm Giờ Thi Đấu (Timed Practice)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Đồng hồ đếm ngược chuẩn tốc độ ETS. Rèn luyện kỷ luật phòng thi thực chiến.
                  </p>
                </div>
              </button>
            </div>

            {/* Mode-specific configuration settings */}
            {mode === 'timed' ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-500" />
                      Quy định thời gian làm bài (Thời lượng khuyến nghị: {formatDurationPace(defaultRecommendedSeconds)})
                    </label>
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                      {effectiveTimeLimitSeconds ? formatDurationPace(effectiveTimeLimitSeconds) : ''}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'standard', label: 'ETS Chuẩn (100%)', desc: formatDurationPace(defaultRecommendedSeconds) },
                      { id: 'fast', label: 'Tăng tốc (80%)', desc: formatDurationPace(Math.round(defaultRecommendedSeconds * 0.8)) },
                      { id: 'relaxed', label: 'Thư thả (120%)', desc: formatDurationPace(Math.round(defaultRecommendedSeconds * 1.2)) },
                      { id: 'custom', label: 'Tùy chỉnh phút', desc: `${customMinutes} phút` },
                    ].map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTimeMultiplier(t.id as any)}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          timeMultiplier === t.id
                            ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 font-semibold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span className="text-xs block font-bold">{t.label}</span>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{t.desc}</span>
                      </button>
                    ))}
                  </div>

                  {timeMultiplier === 'custom' && (
                    <div className="mt-3 flex items-center gap-3">
                      <label className="text-xs text-slate-600 dark:text-slate-400">Nhập số phút:</label>
                      <input
                        type="number"
                        min={1}
                        max={120}
                        value={customMinutes}
                        onChange={e => setCustomMinutes(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-24 px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                      <span className="text-xs text-slate-500">phút ({customMinutes * 60} giây)</span>
                    </div>
                  )}
                </div>

                {/* Timed Audio & Warning Toggles */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                  {currentPartMeta.section === 'listening' && (
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={strictAudioOnce}
                        onChange={e => setStrictAudioOnce(e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-700 text-amber-600 focus:ring-amber-500 w-4 h-4"
                      />
                      <span>
                        <strong className="text-slate-900 dark:text-white">Giới hạn nghe 1 lần duy nhất</strong> (Mô phỏng 100% kỷ luật phòng thi ETS thực tế)
                      </span>
                    </label>
                  )}

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={timeWarningChime}
                      onChange={e => setTimeWarningChime(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-700 text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span>Chuông báo âm thanh Web Audio khi còn 20% thời gian</span>
                  </label>
                </div>
              </div>
            ) : (
              /* Practice Mode Options */
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={showInstantFeedback}
                    onChange={e => setShowInstantFeedback(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span>
                    <strong className="text-slate-900 dark:text-white">Hiển thị giải thích & bẫy thi ngay khi chọn</strong> (Học tập tức thì, chữa lỗi sai tại chỗ)
                  </span>
                </label>

                {currentPartMeta.section === 'listening' && (
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={allowAudioReplay}
                      onChange={e => setAllowAudioReplay(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span>
                      <strong className="text-slate-900 dark:text-white">Cho phép nghe lại audio không giới hạn</strong> (Thích hợp luyện nghe chi tiết và bắt âm)
                    </span>
                  </label>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Summary & Launch Panel (4 Cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm sticky top-20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Tóm Tắt Cấu Hình
                </h3>
              </div>
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                isValidConfiguration
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                {isValidConfiguration ? 'Hợp lệ' : 'Chưa hợp lệ'}
              </span>
            </div>

            {/* Spec rows */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Phần thi:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {currentPartMeta.name} — {currentPartMeta.vietnameseTitle}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Số câu luyện tập:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {questionCount} câu {selectionPreview.status === 'success' && selectionPreview.groups.length > 0 && `(${selectionPreview.groups.length} nhóm)`}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Độ khó mong muốn:</span>
                <span className="font-medium text-slate-900 dark:text-white capitalize">
                  {selectedDifficulty === 'mixed' ? 'Hỗn hợp (Mixed)' : selectedDifficulty}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Chế độ làm bài:</span>
                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                  {mode === 'timed' ? (
                    <>
                      <Timer className="w-3.5 h-3.5 text-amber-500" />
                      Bấm giờ thi ({formatDurationPace(effectiveTimeLimitSeconds || 0)})
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                      Luyện tập tự do
                    </>
                  )}
                </span>
              </div>

              {/* Anti-repeat insight */}
              {selectionPreview.status === 'success' && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Bảo vệ chống lặp:
                    </span>
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {selectionPreview.actualCount - selectionPreview.reusedCount} câu mới
                    </span>
                  </div>

                  {selectionPreview.reusedCount > 0 && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-amber-600 dark:text-amber-400">Tái sử dụng câu cũ:</span>
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                        {selectionPreview.reusedCount} câu
                      </span>
                    </div>
                  )}

                  <div className="pt-1 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Phân bố độ khó:</span>
                    <span className="font-mono">
                      Dễ: {selectionPreview.difficultyDistribution.easy} | Vừa: {selectionPreview.difficultyDistribution.medium} | Khó: {selectionPreview.difficultyDistribution.hard}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Launch CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={!isValidConfiguration}
                onClick={handleStart}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${
                  isValidConfiguration
                    ? mode === 'timed'
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20 active:scale-[0.99]'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 active:scale-[0.99]'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                }`}
              >
                {mode === 'timed' ? (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    Bắt Đầu Thi Bấm Giờ ({questionCount} câu)
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    Bắt Đầu Luyện Tập ({questionCount} câu)
                  </>
                )}
              </button>

              {!isValidConfiguration && (
                <p className="text-[11px] text-center text-rose-500 dark:text-rose-400 mt-2">
                  Vui lòng điều chỉnh số câu hỏi hợp lệ trước khi bắt đầu
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
