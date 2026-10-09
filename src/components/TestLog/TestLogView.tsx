import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TestLog, MistakeItem } from '../../types';
import { calculateToeicTotal } from '../../utils/scoreConverter';
import {
  BarChart3,
  TrendingUp,
  Plus,
  Trash2,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend
} from 'recharts';

interface TestLogViewProps {
  isNewTestModalOpen: boolean;
  setIsNewTestModalOpen: (open: boolean) => void;
}

export const TestLogView: React.FC<TestLogViewProps> = ({
  isNewTestModalOpen,
  setIsNewTestModalOpen,
}) => {
  const { data, addTestLog, onTestSubmitted, deleteTestLog, addMistakeToTest, deleteMistake } = useApp();
  const { testLogs, profile } = data;

  const [activeSubTab, setActiveSubTab] = useState<'history' | 'mistakes'>('history');
  const [selectedPartFilter, setSelectedPartFilter] = useState<string>('all');
  const [selectedReasonFilter, setSelectedReasonFilter] = useState<string>('all');

  // New Test Modal Inputs
  const [testName, setTestName] = useState('ETS 2024 - Test 2');
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [listeningRaw, setListeningRaw] = useState(78);
  const [readingRaw, setReadingRaw] = useState(70);
  const [durationMinutes, setDurationMinutes] = useState(115);
  const [notes, setNotes] = useState('');

  // Add Mistake Modal states
  const [isMistakeModalOpen, setIsMistakeModalOpen] = useState(false);
  const [targetTestId, setTargetTestId] = useState<string>(testLogs[0]?.id || '');
  const [mistakeQNum, setMistakeQNum] = useState(105);
  const [mistakePart, setMistakePart] = useState('Part 5');
  const [mistakeYourAnswer, setMistakeYourAnswer] = useState('A');
  const [mistakeCorrectAnswer, setMistakeCorrectAnswer] = useState('C');
  const [mistakeReason, setMistakeReason] = useState<MistakeItem['reason']>('trap');
  const [mistakeReasonText, setMistakeReasonText] = useState('');
  const [mistakeLesson, setMistakeLesson] = useState('');

  // Calculated Preview for New Test
  const { listeningScore, readingScore, totalScore } = useMemo(() => {
    return calculateToeicTotal(listeningRaw, readingRaw);
  }, [listeningRaw, readingRaw]);

  // Chart data sorted chronologically
  const chartData = useMemo(() => {
    return [...testLogs]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(t => ({
        date: t.date,
        name: t.testName,
        total: t.totalScore,
        listening: t.listeningScore,
        reading: t.readingScore,
        target: profile.targetScore,
      }));
  }, [testLogs, profile.targetScore]);

  // All mistakes flattened with test reference
  const allMistakes = useMemo(() => {
    return testLogs.flatMap(t =>
      t.mistakes.map(m => ({
        ...m,
        testId: t.id,
        testName: t.testName,
        testDate: t.date,
      }))
    );
  }, [testLogs]);

  // Filtered mistakes
  const filteredMistakes = useMemo(() => {
    return allMistakes.filter(m => {
      const matchPart = selectedPartFilter === 'all' || m.part === selectedPartFilter;
      const matchReason = selectedReasonFilter === 'all' || m.reason === selectedReasonFilter;
      return matchPart && matchReason;
    });
  }, [allMistakes, selectedPartFilter, selectedReasonFilter]);

  const handleSaveTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim()) return;

    onTestSubmitted({
      testName: testName.trim(),
      date: testDate,
      listeningRaw,
      readingRaw,
      listeningScore,
      readingScore,
      totalScore,
      durationMinutes,
      targetScore: profile.targetScore,
      notes: notes.trim(),
      mistakes: [],
    });

    setIsNewTestModalOpen(false);
    setNotes('');
  };

  const handleSaveMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTestId) return;

    addMistakeToTest(targetTestId, {
      questionNum: mistakeQNum,
      part: mistakePart,
      yourAnswer: mistakeYourAnswer.toUpperCase(),
      correctAnswer: mistakeCorrectAnswer.toUpperCase(),
      reason: mistakeReason,
      reasonText: mistakeReasonText.trim() || 'Nhầm lẫn thông tin',
      lessonLearned: mistakeLesson.trim() || 'Cần đọc kỹ đề hơn',
    });

    setIsMistakeModalOpen(false);
    setMistakeReasonText('');
    setMistakeLesson('');
  };

  const getReasonLabel = (reason: MistakeItem['reason']) => {
    switch (reason) {
      case 'trap':
        return { label: 'Bị lừa bởi bẫy', color: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-300 dark:border-rose-850' };
      case 'vocab':
        return { label: 'Thiếu từ vựng', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-300 dark:border-amber-850' };
      case 'time':
        return { label: 'Không kịp giờ', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border-purple-300 dark:border-purple-850' };
      case 'listening_connected':
        return { label: 'Nghe hụt nối âm', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-400 border-cyan-300 dark:border-cyan-850' };
      case 'grammar':
        return { label: 'Quên ngữ pháp', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border-indigo-300 dark:border-indigo-850' };
      default:
        return { label: 'Bất cẩn', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700' };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>Phân Tích Dữ Liệu & Khắc Phục Điểm Yếu</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Nhật Ký Luyện Đề & Sổ Tay Lỗi Sai (Test Log & Error Book)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Tự động quy đổi số câu đúng sang thang điểm ETS 5-495, theo dõi tiến độ điểm số và ghi chép bài học rút ra từ lỗi sai.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={() => setActiveSubTab('history')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'history'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Tiến Độ & Lịch Sử ({testLogs.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('mistakes')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === 'mistakes'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Sổ Lỗi Sai ({allMistakes.length})</span>
            </button>
          </div>

          <button
            onClick={() => setIsNewTestModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Ghi Nhận Đề Mới
          </button>
          <button
            onClick={() => setIsMistakeModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Plus className="w-3.5 h-3.5 text-rose-500" /> Thêm Câu Sai
          </button>
        </div>
      </div>

      {/* Sub-tab 1: Score Progression Chart & Test History */}
      {activeSubTab === 'history' && (
        <div className="space-y-6">
          {/* Progression LineChart or Empty State */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Biến Thiên Điểm Số Qua Các Đề Thi Thử</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Đường màu vàng nét đứt là mục tiêu điểm <strong className="text-amber-500">{profile.targetScore}+</strong> của bạn
                </p>
              </div>
            </div>

            {testLogs.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-850 text-slate-400 mx-auto flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Chưa có bài thi nào được ghi nhận
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Hãy làm bài thi thử đầu tiên hoặc nhập kết quả đề gần đây để vẽ đồ thị tăng trưởng điểm số.
                  </p>
                </div>
                <button
                  onClick={() => setIsNewTestModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ghi nhận bài test đầu tiên ➔</span>
                </button>
              </div>
            ) : (
              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#64748b" strokeOpacity={0.2} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis domain={[200, 990]} stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      content={({ payload }) => {
                        if (!payload || !payload.length) return null;
                        const item = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl text-xs shadow-xl border border-slate-700 space-y-1">
                            <p className="font-bold text-indigo-300">{item.name}</p>
                            <p className="text-slate-400 text-[11px]">Ngày: {item.date}</p>
                            <div className="pt-1 space-y-0.5">
                              <p className="text-emerald-400 font-bold">Tổng điểm: {item.total} / 990</p>
                              <p className="text-indigo-300 font-medium">Listening: {item.listening} / 495</p>
                              <p className="text-purple-300 font-medium">Reading: {item.reading} / 495</p>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <ReferenceLine
                      y={profile.targetScore}
                      stroke="#f59e0b"
                      strokeDasharray="4 4"
                      label={{ value: `Mục tiêu (${profile.targetScore})`, fill: '#f59e0b', fontSize: 11 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      name="Tổng Điểm (10-990)"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#10b981' }}
                      activeDot={{ r: 7 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="listening"
                      name="Listening (5-495)"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#6366f1' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="reading"
                      name="Reading (5-495)"
                      stroke="#a855f7"
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#a855f7' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Test History List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Lịch Sử Các Bài Thi Đã Làm ({testLogs.length})
            </h2>

            {testLogs.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs">
                Chưa có dữ liệu lịch sử thi. Bắt đầu làm bài test đầu tiên của bạn!
              </div>
            ) : (
              <div className="space-y-3">
                {testLogs.map(log => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {log.testName}
                      </h3>
                      <span className="font-mono text-xs text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {log.date}
                      </span>
                      <span className="font-medium text-xs text-slate-500 dark:text-slate-400">
                        ⏱️ {log.durationMinutes} phút
                      </span>
                    </div>

                    {log.notes && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                        "{log.notes}"
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs font-mono pt-1 text-slate-600 dark:text-slate-300">
                      <span>Listening: <strong>{log.listeningScore}</strong> ({log.listeningRaw}/100 câu)</span>
                      <span>Reading: <strong>{log.readingScore}</strong> ({log.readingRaw}/100 câu)</span>
                      <span className="text-rose-500 font-semibold">{log.mistakes.length} câu sai đã ghi sổ</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
                    <div className="text-right">
                      <div className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                        {log.totalScore}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Điểm Quy Đổi ETS</div>
                    </div>

                    <button
                      onClick={() => deleteTestLog(log.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title="Xóa bài test này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      )}

      {/* Sub-tab 2: Mistake Notebook */}
      {activeSubTab === 'mistakes' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <span>Sổ Tay Lỗi Sai Cần Tránh (Mistake Notebook)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Đọc lại các câu sai trước mỗi lần thi thử để không lặp lại cùng một cái bẫy.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={selectedPartFilter}
                onChange={e => setSelectedPartFilter(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="all">Tất cả Part</option>
                <option value="Part 1">Part 1</option>
                <option value="Part 2">Part 2</option>
                <option value="Part 3">Part 3</option>
                <option value="Part 4">Part 4</option>
                <option value="Part 5">Part 5</option>
                <option value="Part 6">Part 6</option>
                <option value="Part 7">Part 7</option>
              </select>

              <select
                value={selectedReasonFilter}
                onChange={e => setSelectedReasonFilter(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="all">Tất cả lý do sai</option>
                <option value="trap">Dính bẫy ETS</option>
                <option value="vocab">Thiếu từ vựng</option>
                <option value="time">Không kịp giờ</option>
                <option value="listening_connected">Nghe hụt âm nối</option>
                <option value="grammar">Quên ngữ pháp</option>
              </select>
            </div>
          </div>

          {/* Mistakes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMistakes.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 text-xs">
                Không có lỗi sai nào trong bộ lọc này. Hãy nhấn "Thêm Câu Sai" để ghi chép!
              </div>
            ) : (
              filteredMistakes.map(m => {
                const reasonTag = getReasonLabel(m.reason);
                return (
                  <div
                    key={m.id}
                    className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 space-y-3 hover:border-indigo-400 transition-colors flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                            Câu #{m.questionNum} ({m.part})
                          </span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${reasonTag.color}`}>
                            {reasonTag.label}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {m.testName}
                        </span>
                      </div>

                      {/* Choices comparison */}
                      <div className="flex items-center gap-4 text-xs font-bold py-1">
                        <div className="text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-md border border-rose-200 dark:border-rose-900/60">
                          Bạn chọn: {m.yourAnswer} ❌
                        </div>
                        <div className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-900/60">
                          Đáp án đúng: {m.correctAnswer} ✔️
                        </div>
                      </div>

                      {/* Detail reason */}
                      <div className="text-xs text-slate-700 dark:text-slate-300">
                        <span className="font-bold text-slate-900 dark:text-white">Lý do sai: </span>
                        <span>{m.reasonText}</span>
                      </div>

                      {/* Lesson learned */}
                      <div className="p-2.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200 space-y-0.5">
                        <span className="font-bold text-indigo-700 dark:text-indigo-400 block">
                          💡 Bài học rút ra:
                        </span>
                        <p>{m.lessonLearned}</p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => deleteMistake(m.testId, m.id)}
                        className="text-xs text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Xóa mục này
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Modal: Log New Test */}
      {isNewTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Ghi Nhận Điểm Thi Thử (ETS Scaled)
              </h3>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-md">
                ETS Conversion Table
              </span>
            </div>

            <form onSubmit={handleSaveTest} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tên Bộ Đề / Mã Đề
                </label>
                <input
                  type="text"
                  required
                  value={testName}
                  onChange={e => setTestName(e.target.value)}
                  placeholder="VD: ETS 2024 Test 2, Hacker 3 Test 5..."
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Ngày làm đề
                  </label>
                  <input
                    type="date"
                    required
                    value={testDate}
                    onChange={e => setTestDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Thời gian làm (phút)
                  </label>
                  <input
                    type="number"
                    min={30}
                    max={150}
                    value={durationMinutes}
                    onChange={e => setDurationMinutes(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                  />
                </div>
              </div>

              {/* Raw Score Sliders & Instant Scaled Preview */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
                {/* Listening Raw Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Listening (Số câu đúng: {listeningRaw}/100)
                    </span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {listeningScore} / 495 điểm
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={listeningRaw}
                    onChange={e => setListeningRaw(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                {/* Reading Raw Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Reading (Số câu đúng: {readingRaw}/100)
                    </span>
                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                      {readingScore} / 495 điểm
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={readingRaw}
                    onChange={e => setReadingRaw(Number(e.target.value))}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                {/* Total Score Banner */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Tổng Điểm TOEIC Dự Kiến:
                  </span>
                  <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {totalScore} / 990
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Ghi chú tổng kết sau khi giải đề
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Cảm nhận về độ khó, tốc độ làm bài, chỗ bị quá giờ..."
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTestModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                >
                  Lưu Kết Quả
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Mistake */}
      {isMistakeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Ghi Chép Câu Sai Vào Sổ Tay (Mistake Notebook)
            </h3>

            <form onSubmit={handleSaveMistake} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Chọn đề thi đã làm
                </label>
                <select
                  value={targetTestId}
                  onChange={e => setTargetTestId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                >
                  {testLogs.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.testName} ({t.date})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Số câu (#)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    required
                    value={mistakeQNum}
                    onChange={e => setMistakeQNum(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Thuộc Part
                  </label>
                  <select
                    value={mistakePart}
                    onChange={e => setMistakePart(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                  >
                    <option value="Part 1">Part 1</option>
                    <option value="Part 2">Part 2</option>
                    <option value="Part 3">Part 3</option>
                    <option value="Part 4">Part 4</option>
                    <option value="Part 5">Part 5</option>
                    <option value="Part 6">Part 6</option>
                    <option value="Part 7">Part 7</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Nguyên nhân sai
                  </label>
                  <select
                    value={mistakeReason}
                    onChange={e => setMistakeReason(e.target.value as MistakeItem['reason'])}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                  >
                    <option value="trap">Dính bẫy ETS</option>
                    <option value="vocab">Thiếu từ vựng</option>
                    <option value="time">Không kịp giờ</option>
                    <option value="listening_connected">Nuốt âm/nối âm</option>
                    <option value="grammar">Nhầm ngữ pháp</option>
                    <option value="careless">Bất cẩn/vội vàng</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Bạn chọn (Your choice)
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={mistakeYourAnswer}
                    onChange={e => setMistakeYourAnswer(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1 uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Đáp án đúng (Key)
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={mistakeCorrectAnswer}
                    onChange={e => setMistakeCorrectAnswer(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mô tả cụ thể vì sao sai
                </label>
                <input
                  type="text"
                  required
                  value={mistakeReasonText}
                  onChange={e => setMistakeReasonText(e.target.value)}
                  placeholder="VD: Chọn nhầm liên từ Although vì tưởng vế sau có mệnh đề..."
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Bài học rút ra để không tái phạm
                </label>
                <textarea
                  rows={2}
                  required
                  value={mistakeLesson}
                  onChange={e => setMistakeLesson(e.target.value)}
                  placeholder="VD: Luôn nhìn ngay sau chỗ trống xem có động từ chia thì hay chỉ có cụm danh từ..."
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMistakeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
                >
                  Lưu Vào Sổ Sai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
