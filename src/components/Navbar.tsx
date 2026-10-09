import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Calendar,
  BookOpen,
  ShieldAlert,
  BarChart3,
  Timer,
  Sun,
  Moon,
  Download,
  Upload,
  RotateCcw,
  Target,
  Flame,
  Settings,
  Sparkles,
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openBackupModal: () => void;
  openProfileModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openBackupModal,
  openProfileModal,
}) => {
  const { data, theme, toggleTheme } = useApp();
  const { profile } = data;

  // Calculate days until exam
  const today = new Date();
  const exam = new Date(profile.examDate);
  const diffTime = exam.getTime() - today.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const navItems = [
    { id: 'dashboard', label: 'Tổng Quan', icon: Compass },
    { id: 'roadmap', label: 'Lộ Trình & Lịch', icon: Calendar },
    { id: 'vocab', label: 'Từ Vựng SRS', icon: BookOpen },
    { id: 'cheatsheet', label: 'Ngữ Pháp & Bẫy', icon: ShieldAlert },
    { id: 'tests', label: 'Nhật Ký Đề & Lỗi', icon: BarChart3 },
    { id: 'mock-exam', label: 'Thi Thử ETS', icon: GraduationCap },
    { id: 'timer', label: 'Đồng Hồ Thi & Pomo', icon: Timer },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-slate-300 bg-clip-text text-transparent">
                  TOEIC Mastery Hub
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                  SPA
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Lộ trình & Quản lý luyện thi cá nhân
              </p>
            </div>
          </div>

          {/* Center: Desktop Nav Pills */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Quick Stats & Controls */}
          <div className="flex items-center gap-2.5">
            {/* Streak Counter */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold"
              title={`${profile.streakDays} ngày học liên tiếp`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-bounce" />
              <span>{profile.streakDays}d streak</span>
            </div>

            {/* Exam Countdown Pill */}
            <div
              onClick={openProfileModal}
              className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-xs cursor-pointer hover:border-indigo-400 transition-colors"
              title="Click để chỉnh sửa ngày thi & mục tiêu điểm"
            >
              <Target className="w-3.5 h-3.5 text-indigo-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {profile.currentScore !== null ? profile.currentScore : 'Chưa test'} ➔ <span className="text-indigo-600 dark:text-indigo-400 font-bold">{profile.targetScore}+</span>
              </span>
              <span className="text-slate-400 dark:text-slate-600">|</span>
              <span className="font-medium text-slate-500 dark:text-slate-400">
                Còn <strong className="text-slate-800 dark:text-slate-200">{daysLeft}</strong> ngày
              </span>
            </div>

            {/* Backup / Export / Import Trigger */}
            <button
              onClick={openBackupModal}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title="Sao lưu, Phục hồi & Dữ liệu"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Profile Settings */}
            <button
              onClick={openProfileModal}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title="Cài đặt mục tiêu cá nhân"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title={theme === 'dark' ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-90 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 hover:-rotate-12 transition-transform" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Sub-Nav */}
        <div className="lg:hidden flex items-center justify-between overflow-x-auto py-2 gap-1 border-t border-slate-100 dark:border-slate-800/80 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
