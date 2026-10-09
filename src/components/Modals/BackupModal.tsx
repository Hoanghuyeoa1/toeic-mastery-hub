import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  FileJson,
  X,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose }) => {
  const { data, exportDataJson, importDataJson, resetToSeedData } = useApp();
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isResetConfirm, setIsResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importDataJson(content);
        if (result.success) {
          setImportStatus({ type: 'success', message: result.message });
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setImportStatus({ type: 'error', message: result.message });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    resetToSeedData();
    setIsResetConfirm(false);
    setImportStatus({ type: 'success', message: 'Đã nạp lại dữ liệu mẫu thành công!' });
    setTimeout(() => onClose(), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
            <FileJson className="w-5 h-5" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Sao Lưu & Phục Hồi Dữ Liệu
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Notification */}
        {importStatus && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              importStatus.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            {importStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{importStatus.message}</span>
          </div>
        )}

        {/* Privacy Callout */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Ứng dụng hoạt động theo triết lý <strong>Offline-First & Privacy</strong>. Toàn bộ lộ trình, từ vựng SRS, kết quả thi thử và sổ lỗi sai được lưu an toàn trên trình duyệt của bạn (LocalStorage).
          </p>
        </div>

        {/* Action 1: Export JSON */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900 dark:text-white">
              Xuất File Sao Lưu (.json)
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {data.vocabulary.length} từ • {data.testLogs.length} bài test
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tải về toàn bộ dữ liệu học tập dưới dạng file JSON để lưu trữ hoặc chuyển sang máy tính khác.
          </p>
          <button
            onClick={exportDataJson}
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Tải Xuống Dữ Liệu (.JSON)</span>
          </button>
        </div>

        {/* Action 2: Import JSON */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/50 space-y-2">
          <span className="font-bold text-xs text-slate-900 dark:text-white block">
            Khôi Phục Từ File Sao Lưu (.json)
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Chọn file JSON đã xuất trước đó để phục hồi lại dữ liệu học tập của bạn.
          </p>
          <label className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer shadow-sm">
            <Upload className="w-4 h-4 text-emerald-500" />
            <span>Chọn File JSON Để Khôi Phục</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Action 3: Reset to Seed Data */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="font-bold text-xs text-slate-700 dark:text-slate-300 block">
              Dữ Liệu Mẫu (Seed Data)
            </span>
            <span className="text-[11px] text-slate-400">
              Nạp lại 16 từ vựng mẫu, 7 bẫy ETS và 3 bài test ban đầu.
            </span>
          </div>

          {isResetConfirm ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Xác nhận
              </button>
              <button
                onClick={() => setIsResetConfirm(false)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs"
              >
                Hủy
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsResetConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors border border-rose-200 dark:border-rose-900/60"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nạp Lại Mẫu</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
