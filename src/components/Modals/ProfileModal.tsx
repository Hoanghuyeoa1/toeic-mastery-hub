import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Target,
  Calendar,
  Clock,
  User,
  X,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { data, updateProfile } = useApp();
  const { profile } = data;

  const [name, setName] = useState(profile.name);
  const [currentScore, setCurrentScore] = useState(profile.currentScore);
  const [targetScore, setTargetScore] = useState(profile.targetScore);
  const [targetListening, setTargetListening] = useState(profile.targetListening);
  const [targetReading, setTargetReading] = useState(profile.targetReading);
  const [examDate, setExamDate] = useState(profile.examDate);
  const [dailyMins, setDailyMins] = useState(profile.dailyStudyTargetMins);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || 'Học viên TOEIC',
      currentScore: currentScore !== null ? Number(currentScore) : null,
      targetScore: Number(targetScore),
      targetListening: Number(targetListening),
      targetReading: Number(targetReading),
      examDate,
      dailyStudyTargetMins: Number(dailyMins),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
            <Target className="w-5 h-5" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Cài Đặt Mục Tiêu & Ngày Thi
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Tên của bạn
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Điểm hiện tại
              </label>
              <input
                type="number"
                min={0}
                max={990}
                step={5}
                value={currentScore !== null ? currentScore : ''}
                onChange={e => setCurrentScore(e.target.value === '' ? null : Number(e.target.value))}
                placeholder="Chưa có điểm"
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1 font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Điểm mục tiêu
              </label>
              <input
                type="number"
                min={10}
                max={990}
                step={5}
                value={targetScore}
                onChange={e => setTargetScore(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1 font-mono font-bold text-indigo-600 dark:text-indigo-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Listening
              </label>
              <input
                type="number"
                min={5}
                max={495}
                step={5}
                value={targetListening}
                onChange={e => setTargetListening(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1 font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Reading
              </label>
              <input
                type="number"
                min={5}
                max={495}
                step={5}
                value={targetReading}
                onChange={e => setTargetReading(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Ngày thi dự kiến
            </label>
            <input
              type="date"
              required
              value={examDate}
              onChange={e => setExamDate(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Mục tiêu học mỗi ngày (phút)
            </label>
            <input
              type="number"
              min={15}
              max={300}
              step={15}
              value={dailyMins}
              onChange={e => setDailyMins(Number(e.target.value))}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1 font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
            >
              Lưu Cài Đặt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
