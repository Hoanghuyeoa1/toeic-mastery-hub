import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoadmapPhase, RoadmapTask, CalendarEvent, TaskStatus } from '../../types';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  ListTodo,
  ChevronRight,
  Layers,
  Sparkles,
  AlertCircle,
  Flag,
  CalendarCheck2,
  Tag
} from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const {
    data,
    updateRoadmapTask,
    addRoadmapTask,
    deleteRoadmapTask,
    addCalendarEvent,
    toggleCalendarEvent,
    deleteCalendarEvent,
  } = useApp();

  const { roadmapPhases, calendarEvents } = data;

  const [activeSubTab, setActiveSubTab] = useState<'phases' | 'calendar'>('phases');
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>('all');

  // Modal states for adding task
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [targetPhaseId, setTargetPhaseId] = useState<string>(roadmapPhases[0]?.id || 'phase-1');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPartTag, setTaskPartTag] = useState('Part 5');
  const [taskDeadline, setTaskDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [taskEstimatedHours, setTaskEstimatedHours] = useState(6);
  const [taskNotes, setTaskNotes] = useState('');

  // Modal states for adding calendar event
  const [isCalModalOpen, setIsCalModalOpen] = useState(false);
  const [calTitle, setCalTitle] = useState('');
  const [calDate, setCalDate] = useState(new Date().toISOString().split('T')[0]);
  const [calPartTag, setCalPartTag] = useState('Part 3 & 4');
  const [calDuration, setCalDuration] = useState(60);

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'done':
        return {
          label: 'Đã hoàn thành',
          style: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
        };
      case 'in_progress':
        return {
          label: 'Đang thực hiện',
          style: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-300 dark:border-amber-800 animate-pulse',
        };
      default:
        return {
          label: 'Chưa làm',
          style: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
        };
    }
  };

  const cycleStatus = (task: RoadmapTask) => {
    const nextStatus: Record<TaskStatus, TaskStatus> = {
      todo: 'in_progress',
      in_progress: 'done',
      done: 'todo',
    };
    updateRoadmapTask(task.id, { status: nextStatus[task.status] });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addRoadmapTask(targetPhaseId, {
      title: taskTitle.trim(),
      deadline: taskDeadline,
      status: 'todo',
      partTag: taskPartTag,
      notes: taskNotes.trim(),
      estimatedHours: taskEstimatedHours,
    });

    setTaskTitle('');
    setTaskNotes('');
    setIsTaskModalOpen(false);
  };

  const handleCreateCalendarEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calTitle.trim()) return;

    addCalendarEvent({
      title: calTitle.trim(),
      date: calDate,
      partTag: calPartTag,
      durationMinutes: calDuration,
      completed: false,
    });

    setCalTitle('');
    setIsCalModalOpen(false);
  };

  const filteredPhases = selectedPhaseId === 'all'
    ? roadmapPhases
    : roadmapPhases.filter(p => p.id === selectedPhaseId);

  // Stats across roadmap
  const allTasks = roadmapPhases.flatMap(p => p.tasks);
  const totalCompleted = allTasks.filter(t => t.status === 'done').length;
  const totalTasks = allTasks.length;
  const overallRoadmapProgress = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Lộ Trình Từng Bước Đến Mục Tiêu</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Thiết Lập Lộ Trình & Kế Hoạch Học Tập (Roadmap & Planner)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Lộ trình chia theo 3 giai đoạn tinh gọn: Nền tảng ➔ Kỹ năng Part 1-7 ➔ Thực chiến đề thi & Sửa bẫy.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 self-start sm:self-center">
          <button
            onClick={() => setActiveSubTab('phases')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'phases'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            <span>3 Giai Đoạn (Phases)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('calendar')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'calendar'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Lịch Học (Planner)</span>
          </button>
        </div>
      </div>

      {/* Progress Bar & Phase Filters */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-80 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Tiến độ toàn bộ lộ trình</span>
            <span className="text-indigo-600 dark:text-indigo-400">{overallRoadmapProgress}% ({totalCompleted}/{totalTasks} modules)</span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${overallRoadmapProgress}%` }}
            />
          </div>
        </div>

        {activeSubTab === 'phases' ? (
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <button
              onClick={() => setSelectedPhaseId('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedPhaseId === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Tất cả giai đoạn
            </button>
            {roadmapPhases.map(phase => (
              <button
                key={phase.id}
                onClick={() => setSelectedPhaseId(phase.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedPhaseId === phase.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                Giai đoạn {phase.order}
              </button>
            ))}
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm Module
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsCalModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Lên Lịch Buổi Học Mới
          </button>
        )}
      </div>

      {/* Main Tab 1: Roadmap Stages View */}
      {activeSubTab === 'phases' && (
        <div className="space-y-6">
          {filteredPhases.map(phase => {
            const phaseDoneCount = phase.tasks.filter(t => t.status === 'done').length;
            const phaseTotalCount = phase.tasks.length;
            const phasePercent = phaseTotalCount > 0 ? Math.round((phaseDoneCount / phaseTotalCount) * 100) : 0;

            return (
              <div
                key={phase.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                {/* Phase Header */}
                <div className="p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-850/50 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                          Phase {phase.order}
                        </span>
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                          {phase.subtitle}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {phase.title}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl">
                        {phase.description}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 shrink-0">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {phaseDoneCount}/{phaseTotalCount} Hoàn thành
                      </div>
                      <div className="w-28 sm:w-36 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all"
                          style={{ width: `${phasePercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phase Tasks */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {phase.tasks.map(task => {
                    const badge = getStatusBadge(task.status);
                    return (
                      <div
                        key={task.id}
                        className="p-4 sm:p-5 hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            onClick={() => cycleStatus(task)}
                            className="mt-0.5 shrink-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            title="Click để đổi trạng thái"
                          >
                            {task.status === 'done' ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                            ) : (
                              <Clock className={`w-5 h-5 ${task.status === 'in_progress' ? 'text-amber-500 animate-spin' : 'text-slate-400'}`} />
                            )}
                          </button>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-sm font-semibold cursor-pointer ${
                                  task.status === 'done'
                                    ? 'line-through text-slate-400 dark:text-slate-500'
                                    : 'text-slate-900 dark:text-white'
                                }`}
                                onClick={() => cycleStatus(task)}
                              >
                                {task.title}
                              </span>
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700">
                                {task.partTag}
                              </span>
                            </div>

                            {task.notes && (
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                📝 {task.notes}
                              </p>
                            )}

                            <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                              <span>Hạn chót: <strong>{task.deadline}</strong></span>
                              <span>•</span>
                              <span>Ước tính: <strong>{task.estimatedHours}h</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* Status Controls */}
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                          <button
                            onClick={() => cycleStatus(task)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${badge.style}`}
                          >
                            {badge.label}
                          </button>
                          <button
                            onClick={() => deleteRoadmapTask(task.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title="Xóa module này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Tab 2: Calendar Study Planner View */}
      {activeSubTab === 'calendar' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarCheck2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Lịch Học Chi Tiết (Study Sessions Planner)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lên lịch từng buổi học cụ thể, phân bổ thời gian hợp lý và theo dõi hoàn thành.
              </p>
            </div>
            <button
              onClick={() => setIsCalModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm Buổi Học
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {calendarEvents.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 text-xs">
                Chưa có buổi học nào được lên lịch. Hãy nhấn nút "Thêm Buổi Học" phía trên!
              </div>
            ) : (
              calendarEvents.map(event => (
                <div
                  key={event.id}
                  className={`p-4 rounded-xl border transition-all ${
                    event.completed
                      ? 'bg-slate-50 dark:bg-slate-850/40 border-slate-200 dark:border-slate-800 opacity-75'
                      : 'bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:border-indigo-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {event.date}
                    </span>
                    <span className="font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]">
                      {event.durationMinutes} phút
                    </span>
                  </div>

                  <div className="my-3 space-y-1">
                    <h3 className={`text-sm font-bold ${event.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {event.title}
                    </h3>
                    <div className="inline-flex items-center gap-1 text-[11px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                      <Tag className="w-3 h-3" />
                      <span>{event.partTag}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => toggleCalendarEvent(event.id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                        event.completed
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{event.completed ? 'Đã xong' : 'Tích hoàn thành'}</span>
                    </button>

                    <button
                      onClick={() => deleteCalendarEvent(event.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Xóa buổi học"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal: Add Roadmap Task */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Thêm Module / Nhiệm Vụ Mới Vào Lộ Trình
            </h3>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Chọn Giai Đoạn (Phase)
                </label>
                <select
                  value={targetPhaseId}
                  onChange={e => setTargetPhaseId(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                >
                  {roadmapPhases.map(p => (
                    <option key={p.id} value={p.id}>
                      Giai đoạn {p.order}: {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tên Module / Nhiệm Vụ
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  placeholder="VD: Luyện 5 đề nghe Part 2 và ghi sổ bẫy..."
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Phân loại / Part Tag
                  </label>
                  <input
                    type="text"
                    value={taskPartTag}
                    onChange={e => setTaskPartTag(e.target.value)}
                    placeholder="VD: Part 5, Full Test, Vocab"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Ước tính thời gian (giờ)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={taskEstimatedHours}
                    onChange={e => setTaskEstimatedHours(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Hạn chót (Deadline)
                </label>
                <input
                  type="date"
                  value={taskDeadline}
                  onChange={e => setTaskDeadline(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Ghi chú mục tiêu
                </label>
                <textarea
                  rows={2}
                  value={taskNotes}
                  onChange={e => setTaskNotes(e.target.value)}
                  placeholder="Ghi chú thêm về tài liệu, mục tiêu điểm số..."
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                >
                  Lưu Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Calendar Event */}
      {isCalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Lên Lịch Buổi Học Mới
            </h3>

            <form onSubmit={handleCreateCalendarEvent} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tên buổi học
                </label>
                <input
                  type="text"
                  required
                  value={calTitle}
                  onChange={e => setCalTitle(e.target.value)}
                  placeholder="VD: Luyện đề ETS 2024 Test 2 Part 5"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Ngày học
                  </label>
                  <input
                    type="date"
                    required
                    value={calDate}
                    onChange={e => setCalDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Thời lượng (phút)
                  </label>
                  <input
                    type="number"
                    min={15}
                    step={15}
                    value={calDuration}
                    onChange={e => setCalDuration(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Phần ôn luyện (Part)
                </label>
                <input
                  type="text"
                  value={calPartTag}
                  onChange={e => setCalPartTag(e.target.value)}
                  placeholder="VD: Part 7, Vocab, Listening"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCalModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                >
                  Thêm Vào Lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
