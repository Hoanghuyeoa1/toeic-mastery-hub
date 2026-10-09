import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { soundService } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  Timer as TimerIcon,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Headphones,
  BookOpenCheck
} from 'lucide-react';

export const TimerHub: React.FC = () => {
  const { recordActivity, onPomodoroFinished } = useApp();

  const [mode, setMode] = useState<'exam' | 'pomodoro'>('exam');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Mock Exam Timer (120 minutes = 7200 seconds)
  const EXAM_TOTAL_SECONDS = 120 * 60;
  const LISTENING_SECONDS = 45 * 60; // 45 minutes
  const [examSecondsLeft, setExamSecondsLeft] = useState(EXAM_TOTAL_SECONDS);
  const [isExamRunning, setIsExamRunning] = useState(false);

  // Pomodoro Timer (25 min work / 5 min short break / 15 min long break)
  const [pomoType, setPomoType] = useState<'work' | 'short_break' | 'long_break'>('work');
  const POMO_DURATIONS = {
    work: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60,
  };
  const [pomoSecondsLeft, setPomoSecondsLeft] = useState(POMO_DURATIONS.work);
  const [isPomoRunning, setIsPomoRunning] = useState(false);
  const [pomoRounds, setPomoRounds] = useState(1);

  // Warning trigger refs to avoid duplicate chimes
  const hasWarned15mRef = useRef(false);
  const hasWarnedListeningEndRef = useRef(false);

  // Exam Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isExamRunning && examSecondsLeft > 0) {
      interval = setInterval(() => {
        setExamSecondsLeft(prev => {
          const next = prev - 1;

          // Alert at end of Listening (45 min passed -> 75 min left = 4500 seconds)
          if (next === EXAM_TOTAL_SECONDS - LISTENING_SECONDS && !hasWarnedListeningEndRef.current) {
            hasWarnedListeningEndRef.current = true;
            if (soundEnabled) soundService.playWarningBeep();
          }

          // Alert at 15 minutes left (900 seconds)
          if (next === 900 && !hasWarned15mRef.current) {
            hasWarned15mRef.current = true;
            if (soundEnabled) soundService.playWarningBeep();
          }

          // Complete
          if (next <= 0) {
            setIsExamRunning(false);
            if (soundEnabled) soundService.playChime();
            confetti({ particleCount: 100, spread: 80 });
            recordActivity(3);
            return 0;
          }

          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isExamRunning, examSecondsLeft, soundEnabled, recordActivity]);

  // Pomodoro Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isPomoRunning && pomoSecondsLeft > 0) {
      interval = setInterval(() => {
        setPomoSecondsLeft(prev => {
          const next = prev - 1;
          if (next <= 0) {
            setIsPomoRunning(false);
            if (soundEnabled) soundService.playChime();

            if (pomoType === 'work') {
              recordActivity(1);
              onPomodoroFinished();
              confetti({ particleCount: 50, spread: 60 });
              if (pomoRounds % 4 === 0) {
                setPomoType('long_break');
                return POMO_DURATIONS.long_break;
              } else {
                setPomoType('short_break');
                return POMO_DURATIONS.short_break;
              }
            } else {
              setPomoRounds(r => r + 1);
              setPomoType('work');
              return POMO_DURATIONS.work;
            }
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPomoRunning, pomoSecondsLeft, pomoType, pomoRounds, soundEnabled, recordActivity]);

  // Formatting helpers
  const formatTime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Exam Progress calculations
  const examElapsed = EXAM_TOTAL_SECONDS - examSecondsLeft;
  const examProgressPercent = Math.round((examElapsed / EXAM_TOTAL_SECONDS) * 100);
  const isListeningPhase = examElapsed <= LISTENING_SECONDS;
  const readingSecondsRemaining = Math.max(0, examSecondsLeft);

  const resetExamTimer = () => {
    setIsExamRunning(false);
    setExamSecondsLeft(EXAM_TOTAL_SECONDS);
    hasWarned15mRef.current = false;
    hasWarnedListeningEndRef.current = false;
    soundService.playTick();
  };

  const resetPomoTimer = () => {
    setIsPomoRunning(false);
    setPomoSecondsLeft(POMO_DURATIONS[pomoType]);
    soundService.playTick();
  };

  const handlePomoTabChange = (type: 'work' | 'short_break' | 'long_break') => {
    setIsPomoRunning(false);
    setPomoType(type);
    setPomoSecondsLeft(POMO_DURATIONS[type]);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <TimerIcon className="w-4 h-4" />
            <span>Đồng Hồ Phòng Thi & Tập Trung Sâu</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Bộ Đếm Giờ Phòng Thi & Pomodoro (Exam Timer)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Mô phỏng 120 phút chuẩn phòng thi ETS hoặc học chu kỳ Pomodoro 25 phút để duy trì sự tập trung cao độ.
          </p>
        </div>

        {/* Mode Switcher & Sound Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={() => setMode('exam')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'exam'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Thi Thử 120p
            </button>
            <button
              onClick={() => setMode('pomodoro')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'pomodoro'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Pomodoro Focus
            </button>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-colors ${
              soundEnabled
                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
            title={soundEnabled ? 'Tắt âm thanh chuông báo' : 'Bật âm thanh chuông báo'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* MODE 1: MOCK EXAM 120-MIN TIMER */}
      {mode === 'exam' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
          {/* Section Indicator Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isListeningPhase ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  <Headphones className="w-3.5 h-3.5" />
                  <span>PHẦN 1: LISTENING TEST (Q1 - Q100)</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <BookOpenCheck className="w-3.5 h-3.5" />
                  <span>PHẦN 2: READING TEST (Q101 - Q200)</span>
                </span>
              )}
            </div>

            {examSecondsLeft <= 900 && examSecondsLeft > 0 && (
              <span className="flex items-center gap-1 text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-900/60 animate-bounce">
                <AlertTriangle className="w-3.5 h-3.5" />
                Cảnh Báo: Còn Dưới 15 Phút Nước Rút!
              </span>
            )}
          </div>

          {/* Main Giant Timer Display */}
          <div className="text-center py-6">
            <div className="text-6xl sm:text-7xl md:text-8xl font-black font-mono tracking-tight text-slate-900 dark:text-white select-none">
              {formatTime(examSecondsLeft)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2">
              Thời gian trôi qua: {formatTime(examElapsed)} / 02:00:00 ({examProgressPercent}%)
            </p>
          </div>

          {/* Master Timeline Breakdown Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>0m: Bắt đầu Listening</span>
              <span>45m: Chuyển Reading</span>
              <span>105m: Mốc 15p cuối</span>
              <span>120m: Hết giờ</span>
            </div>

            <div className="relative w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 transition-all duration-300"
                style={{ width: `${examProgressPercent}%` }}
              />
              {/* Marker at 45m */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white/70 shadow-sm"
                style={{ left: `${(45 / 120) * 100}%` }}
                title="Mốc 45 phút chuyển sang Reading"
              />
              {/* Marker at 105m (15m remaining) */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-rose-500/80 shadow-sm"
                style={{ left: `${(105 / 120) * 100}%` }}
                title="Mốc 15 phút nước rút"
              />
            </div>
          </div>

          {/* Strategic Time Checkpoints Guide */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 text-center">
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 block">Part 1 - 4 (Nghe)</span>
              <span className="text-xs text-slate-700 dark:text-slate-300 font-mono">45 Phút chuẩn</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 text-center">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block">Part 5 (30 câu)</span>
              <span className="text-xs text-slate-700 dark:text-slate-300 font-mono">12 - 15 Phút</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 text-center">
              <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 block">Part 6 (16 câu)</span>
              <span className="text-xs text-slate-700 dark:text-slate-300 font-mono">8 - 10 Phút</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 text-center">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">Part 7 (54 câu)</span>
              <span className="text-xs text-slate-700 dark:text-slate-300 font-mono">50 - 55 Phút</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setIsExamRunning(!isExamRunning);
                soundService.playTick();
              }}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg transition-all ${
                isExamRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30 hover:scale-105'
              }`}
            >
              {isExamRunning ? (
                <>
                  <Pause className="w-5 h-5" /> Tạm Dừng
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" /> Bắt Đầu Làm Đề
                </>
              )}
            </button>

            <button
              onClick={resetExamTimer}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-colors border border-slate-200 dark:border-slate-700"
            >
              <RotateCcw className="w-4 h-4" /> Đặt Lại 120p
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: POMODORO TIMER */}
      {mode === 'pomodoro' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
          {/* Pomodoro Sub-tabs */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handlePomoTabChange('work')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pomoType === 'work'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Tập Trung (25p)
            </button>
            <button
              onClick={() => handlePomoTabChange('short_break')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pomoType === 'short_break'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Nghỉ Ngắn (5p)
            </button>
            <button
              onClick={() => handlePomoTabChange('long_break')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                pomoType === 'long_break'
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Nghỉ Dài (15p)
            </button>
          </div>

          {/* Timer Display */}
          <div className="text-center py-8">
            <div className="text-7xl sm:text-8xl font-black font-mono tracking-tight text-slate-900 dark:text-white select-none">
              {formatTime(pomoSecondsLeft)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2">
              Chu kỳ vòng #{pomoRounds} • {pomoType === 'work' ? 'Học sâu không xao nhãng' : 'Thư giãn mắt & uống nước'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                setIsPomoRunning(!isPomoRunning);
                soundService.playTick();
              }}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg transition-all ${
                isPomoRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30 hover:scale-105'
              }`}
            >
              {isPomoRunning ? (
                <>
                  <Pause className="w-5 h-5" /> Tạm Dừng
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" /> Bắt Đầu Tập Trung
                </>
              )}
            </button>

            <button
              onClick={resetPomoTimer}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-colors border border-slate-200 dark:border-slate-700"
            >
              <RotateCcw className="w-4 h-4" /> Đặt Lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
