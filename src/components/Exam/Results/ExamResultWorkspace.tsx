/**
 * TOEIC Mastery Hub — Exam Result & Review Workspace Shell (Phase 17)
 *
 * Top-level view coordinating:
 * - Result Dashboard (Performance metrics, strengths/weaknesses, scaled scores)
 * - Answer Review (200-question detailed remediation, listening transcripts, reading passages)
 * - Responsive navigation, theme support, and seamless back/retake actions
 */

import React, { useState } from 'react';
import {
  BarChart3,
  BookOpen,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  FileCheck,
} from 'lucide-react';
import { ExamResult } from '../../../types/mockExam';
import { ExamResultWorkspaceTab, ExamResultWorkspaceProps } from '../../../types/examReview';
import { ExamResultDashboard } from './ExamResultDashboard';
import { ExamAnswerReview } from './ExamAnswerReview';

export const ExamResultWorkspace: React.FC<ExamResultWorkspaceProps> = ({
  result,
  onExit,
  onRetakeExam,
  initialTab = 'dashboard',
}) => {
  const [activeTab, setActiveTab] = useState<ExamResultWorkspaceTab>(initialTab);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col select-none">
      {/* Sticky Workspace Top Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="Quay lại danh mục đề thi"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Thư Viện Đề</span>
            </button>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                <span>{result.examCode}</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono hidden md:inline">
                {result.totalRaw}/200 câu • {result.totalScaled} điểm ước tính
              </span>
            </div>
          </div>

          {/* Central Mode Switcher Pills */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Bảng Tổng Kết</span>
            </button>

            <button
              onClick={() => setActiveTab('review')}
              className={`px-4 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'review'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Chữa Bài Chi Tiết</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {onRetakeExam && (
              <button
                onClick={() => onRetakeExam(result.examFormId)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Thi Lại</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Tab View */}
      <main className="flex-1 pb-16">
        {activeTab === 'dashboard' ? (
          <ExamResultDashboard
            result={result}
            onOpenReview={() => setActiveTab('review')}
            onExit={onExit}
            onRetakeExam={onRetakeExam}
          />
        ) : (
          <ExamAnswerReview
            result={result}
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}
      </main>
    </div>
  );
};
