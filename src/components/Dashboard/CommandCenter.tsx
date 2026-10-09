import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getScoreLevelBand } from '../../utils/scoreConverter';
import {
  Target,
  Flame,
  CheckCircle2,
  Circle,
  Calendar as CalendarIcon,
  ArrowUpRight,
  BookOpen,
  Timer,
  AlertTriangle,
  TrendingUp,
  BarChart2,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Compass,
  GraduationCap
} from 'lucide-react';
import { RadarChartComponent } from './RadarChart';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';

interface CommandCenterProps {
  setActiveTab: (tab: string) => void;
  openNewTestModal: () => void;
  openOnboardingModal: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  setActiveTab,
  openNewTestModal,
  openOnboardingModal,
}) => {
  const { data } = useApp();
  const { profile, dailyGoals, activityHeatmap, vocabulary, testLogs } = data;

  const [chartType, setChartType] = useState<'radar' | 'bar'>('radar');

  // Days until exam
  const examDate = new Date(profile.examDate);
  const now = new Date();
  const timeDiff = examDate.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.floor(timeDiff / (1000 * 60 * 60 * 24)));

  // Cold Start Score Handlers
  const hasScore = profile.currentScore !== null && profile.currentScore > 0;
  const currentScoreVal = profile.currentScore || 0;
  const targetGap = hasScore ? Math.max(0, profile.targetScore - currentScoreVal) : profile.targetScore;
  const progressPercent = hasScore ? Math.min(100, Math.round((currentScoreVal / profile.targetScore) * 100)) : 0;
  const levelBand = hasScore ? getScoreLevelBand(currentScoreVal) : null;

  // Due vocabulary
  const todayStr = new Date().toISOString().split('T')[0];
  const dueVocabCount = vocabulary.filter(v => v.nextReviewDate <= todayStr).length;

  // Daily goals progress
  const completedGoalsCount = dailyGoals.filter(g => g.completed).length;

  // Calculate Part 1 - Part 7 proficiency ONLY from real testLogs
  const partProficiency = useMemo(() => {
    if (testLogs.length === 0) return null;

    const partsStats: Record<string, { totalTested: number; mistakes: number }> = {
      'Part 1': { totalTested: 0, mistakes: 0 },
      'Part 2': { totalTested: 0, mistakes: 0 },
      'Part 3': { totalTested: 0, mistakes: 0 },
      'Part 4': { totalTested: 0, mistakes: 0 },
      'Part 5': { totalTested: 0, mistakes: 0 },
      'Part 6': { totalTested: 0, mistakes: 0 },
      'Part 7': { totalTested: 0, mistakes: 0 },
    };

    // Calculate total questions tested across all submitted testLogs
    testLogs.forEach(t => {
      const isMiniDiag = t.testName?.toLowerCase().includes('diagnostic') || t.testName?.toLowerCase().includes('mini');
      if (isMiniDiag) {
        // Mini Diagnostic test: 2 questions per Part
        partsStats['Part 1'].totalTested += 2;
        partsStats['Part 2'].totalTested += 2;
        partsStats['Part 3'].totalTested += 2;
        partsStats['Part 4'].totalTested += 2;
        partsStats['Part 5'].totalTested += 2;
        partsStats['Part 6'].totalTested += 2;
        partsStats['Part 7'].totalTested += 2;
      } else {
        // Standard 200-question test distribution
        partsStats['Part 1'].totalTested += 6;
        partsStats['Part 2'].totalTested += 25;
        partsStats['Part 3'].totalTested += 39;
        partsStats['Part 4'].totalTested += 30;
        partsStats['Part 5'].totalTested += 30;
        partsStats['Part 6'].totalTested += 16;
        partsStats['Part 7'].totalTested += 54;
      }

      t.mistakes.forEach(m => {
        if (partsStats[m.part]) {
          partsStats[m.part].mistakes += 1;
        }
      });
    });

    return Object.keys(partsStats).map(part => {
      const stats = partsStats[part];
      if (stats.totalTested === 0) return { part, score: 0, mistakes: 0 };
      const correct = Math.max(0, stats.totalTested - stats.mistakes);
      const rate = Math.round((correct / stats.totalTested) * 100);
      return {
        part,
        score: Math.min(100, Math.max(0, rate)),
        mistakes: stats.mistakes,
      };
    });
  }, [testLogs]);

  // Heatmap generation for past 12 weeks (~84 days)
  const heatmapData = useMemo(() => {
    const days: Array<{ date: string; count: number; dayOfWeek: number; label: string }> = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 83);

    for (let i = 0; i < 84; i++) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + i);
      const dStr = current.toISOString().split('T')[0];
      const count = activityHeatmap[dStr] || 0;
      days.push({
        date: dStr,
        count,
        dayOfWeek: current.getDay(),
        label: `${dStr}: ${count} hoạt động`,
      });
    }
    return days;
  }, [activityHeatmap]);

  const getHeatmapColor = (count: number) => {
    if (count === 0) return 'bg-slate-200/50 dark:bg-slate-800/50';
    if (count === 1) return 'bg-emerald-300 dark:bg-emerald-950 text-emerald-800';
    if (count === 2) return 'bg-emerald-400 dark:bg-emerald-700 text-white';
    if (count === 3) return 'bg-emerald-500 dark:bg-emerald-500 text-white';
    return 'bg-emerald-600 dark:bg-emerald-400 text-white';
  };

  const handleGoalAction = (triggerKey: string) => {
    if (triggerKey === 'vocab') setActiveTab('vocab');
    else if (triggerKey === 'test') {
      if (!hasScore) openOnboardingModal();
      else openNewTestModal();
    } else if (triggerKey === 'trap') setActiveTab('cheatsheet');
    else if (triggerKey === 'pomo') setActiveTab('timer');
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Top Banner: Linear / Vercel Minimalist Header */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 text-white shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              Command Center
            </span>
            {hasScore && levelBand ? (
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${levelBand.badgeColor}`}>
                {levelBand.level.split(' ')[0]}
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Chưa có điểm đánh giá
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Xin chào, {profile.name}!</span>
          </h1>

          <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
            {hasScore ? (
              <>
                Điểm hiện tại: <strong className="text-white font-mono">{currentScoreVal}</strong>. Mục tiêu:{' '}
                <strong className="text-blue-400 font-mono">{profile.targetScore}+</strong> (còn thiếu{' '}
                <strong className="text-white">{targetGap} điểm</strong>).
              </>
            ) : (
              <>
                Bạn chưa thiết lập điểm đầu vào. Hãy làm bài test nhanh 14 câu hoặc nhập điểm gần nhất để kích hoạt hệ thống phân tích.
              </>
            )}
          </p>
        </div>

        {/* Right Stats Pills */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Exam countdown pill */}
          <div className="bg-zinc-950/80 px-4 py-2.5 rounded-xl border border-zinc-800 text-center min-w-[110px]">
            <span className="text-[10px] text-zinc-400 font-medium block">Ngày thi</span>
            <span className="text-base font-mono font-bold text-white">
              {daysLeft} <span className="text-xs font-normal text-zinc-400">ngày</span>
            </span>
          </div>

          {/* Streak pill */}
          <div className="bg-zinc-950/80 px-4 py-2.5 rounded-xl border border-zinc-800 text-center min-w-[110px]">
            <span className="text-[10px] text-zinc-400 font-medium flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
              Streak
            </span>
            <span className="text-base font-mono font-bold text-amber-400">
              {profile.streakDays} <span className="text-xs font-normal text-zinc-400">ngày</span>
            </span>
          </div>

          <button
            onClick={() => setActiveTab('mock-exam')}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            title="Đến Full Mock Hub (120 phút chuẩn ETS)"
          >
            <GraduationCap className="w-4 h-4 text-indigo-200" />
            <span>Thi Thử ETS</span>
          </button>

          {!hasScore && (
            <button
              onClick={openOnboardingModal}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              <span>Đánh Giá Đầu Vào</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid: 2 Columns (Compact density) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Col: Event-driven Daily Goals (5 cols) */}
        <div className="lg:col-span-5 bg-zinc-900 rounded-2xl p-4 sm:p-5 border border-zinc-800 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <h2 className="text-sm font-bold text-white">
                  Tiến Độ Hôm Nay (Daily Goals)
                </h2>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                {completedGoalsCount}/{dailyGoals.length}
              </span>
            </div>

            <p className="text-[11px] text-zinc-400 py-1">
              ⚡ Tự động tích Done khi bạn thực hiện hoạt động học thật trên hệ thống.
            </p>

            {/* Daily goals list */}
            <div className="space-y-2 mt-2">
              {dailyGoals.map(goal => (
                <div
                  key={goal.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    goal.completed
                      ? 'bg-zinc-900 border-emerald-500/30 text-zinc-100 shadow-sm'
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700/80 text-zinc-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      {goal.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-zinc-500 stroke-[2]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-zinc-100 leading-snug truncate">
                        {goal.text}
                      </p>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        Tiến độ: {goal.progressCurrent}/{goal.progressTarget}
                      </span>
                    </div>
                  </div>

                  {goal.completed ? (
                    <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Đã xong
                    </span>
                  ) : (
                    <button
                      onClick={() => handleGoalAction(goal.triggerKey)}
                      className="shrink-0 text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-0.5 px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-all cursor-pointer"
                    >
                      <span>Làm ngay</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400">
            💡 Streak sẽ tự động +1 khi bạn hoàn thành ít nhất 1 hoạt động trong ngày.
          </div>
        </div>

        {/* Right Col: Study Heatmap (7 cols) */}
        <div className="lg:col-span-7 bg-zinc-900 rounded-2xl p-4 sm:p-5 border border-zinc-800 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-white">
                  Lịch Hoạt Động (Activity Heatmap)
                </h2>
              </div>
              <span className="text-xs font-bold text-amber-400">
                {profile.streakDays} ngày liên tiếp
              </span>
            </div>

            <p className="text-[11px] text-zinc-400 py-1">
              Chỉ sáng đèn khi có dữ liệu ôn từ vựng SRS hoặc làm bài test thực tế.
            </p>

            {/* Heatmap Grid */}
            <div className="my-3 overflow-x-auto">
              <div className="inline-grid grid-rows-7 grid-flow-col gap-1 p-2 bg-zinc-950/80 rounded-xl border border-zinc-800">
                {heatmapData.map((d) => (
                  <div
                    key={d.date}
                    title={d.label}
                    className={`w-3 h-3 rounded-[2px] transition-transform hover:scale-125 cursor-pointer ${getHeatmapColor(d.count)}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800">
            <div className="flex items-center gap-1.5">
              <span>Chưa học</span>
              <div className="w-2.5 h-2.5 rounded-[2px] bg-zinc-800" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-950" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-700" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400" />
              <span>Nhiều phiên</span>
            </div>
            <span>84 ngày gần nhất</span>
          </div>
        </div>
      </div>

      {/* Section 2: Part 1 - 7 Proficiency (With proper Empty State) */}
      <div className="bg-zinc-900 rounded-2xl p-4 sm:p-5 border border-zinc-800">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-500" />
              <span>Độ Thành Thạo 7 Phần (Part 1 ➔ Part 7)</span>
            </h2>
            <p className="text-[11px] text-zinc-400">
              Đo lường từ tỷ lệ đúng và tần suất dính bẫy thực tế qua các bài test
            </p>
          </div>

          {partProficiency && (
            <div className="flex items-center p-1 rounded-lg bg-zinc-800 text-xs border border-zinc-700/60">
              <button
                onClick={() => setChartType('radar')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  chartType === 'radar'
                    ? 'bg-zinc-700 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Radar
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  chartType === 'bar'
                    ? 'bg-zinc-700 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Cột
              </button>
            </div>
          )}
        </div>

        {/* Chart Content or Empty State */}
        {partProficiency ? (
          <div>
            {chartType === 'radar' ? (
              <RadarChartComponent data={partProficiency} />
            ) : (
              <div className="h-[320px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={partProficiency} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="part" stroke="#a1a1aa" fontSize={11} />
                    <YAxis domain={[0, 100]} stroke="#a1a1aa" fontSize={11} />
                    <Tooltip
                      content={({ payload }) => {
                        if (!payload || !payload.length) return null;
                        const d = payload[0].payload;
                        return (
                          <div className="bg-zinc-900 text-white p-2.5 rounded-xl text-xs shadow-xl border border-zinc-800">
                            <p className="font-bold text-blue-400">{d.part}</p>
                            <p className="text-zinc-300">Độ thành thạo: <strong className="text-white font-mono">{d.score}%</strong></p>
                            <p className="text-rose-400 text-[10px]">{d.mistakes} lỗi sai</p>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {partProficiency.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.score >= 80 ? '#10b981' : entry.score >= 65 ? '#3b82f6' : '#f59e0b'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ) : (
          /* Elegant Empty State */
          <div className="py-12 px-4 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-zinc-400 mx-auto flex items-center justify-center border border-zinc-700/60">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">
                Chưa có dữ liệu phân tích năng lực 7 Part
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Hệ thống không tự ý điền số liệu giả. Biểu đồ sẽ xuất hiện ngay sau khi bạn hoàn thành bài test đầu vào hoặc ghi nhận 1 đề thi thử.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={openOnboardingModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-sm"
              >
                <Compass className="w-4 h-4" />
                <span>Bắt đầu bài kiểm tra phân hóa ➔</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
