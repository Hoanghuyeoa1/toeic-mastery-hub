/**
 * TOEIC Mastery Hub — Exam Audio Control Bar (Phase 14)
 *
 * Audio status surface for the Listening section:
 * - Displays active queue item (Directions, Question, or Group)
 * - Manages browser autoplay restrictions via interactive unlock button
 * - In Strict Mode: Displays linear locked indicator (no seek, no replay, 1.0x locked)
 * - In Simulation Mode: Provides pause/resume playback controls
 * - Volume slider and mute toggle
 */

import React from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Headphones,
  Lock,
  AlertCircle,
  Radio,
} from 'lucide-react';
import { ExamAudioBarProps } from '../../../types/examWorkspace';

export const ExamAudioBar: React.FC<ExamAudioBarProps> = ({
  audioState,
  onStartPlayback,
  onPausePlayback,
  onVolumeChange,
  onToggleMute,
}) => {
  const isPlaying = audioState.status === 'playing';
  const isPaused = audioState.status === 'paused';
  const isEnded = audioState.status === 'ended';
  const isAwaitingGesture = audioState.isAwaitingUserGesture || audioState.status === 'awaiting_user_interaction';

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 text-slate-200 py-2.5 px-4 sm:px-6 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Active Audio Track Info */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            {isPlaying ? (
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            ) : (
              <Headphones className="w-4 h-4 text-slate-400" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                {audioState.currentItem?.title || 'Đang sẵn sàng phát âm thanh Listening...'}
              </span>

              {audioState.isStrictCertified ? (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1 shrink-0">
                  <Lock className="w-2.5 h-2.5" />
                  Strict Locked 1.0x
                </span>
              ) : (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 shrink-0">
                  TTS Simulation
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400 truncate">
              {audioState.currentItem?.isDirections
                ? 'Hướng dẫn làm bài phần thi nghe (Directions)'
                : `Bao phủ câu: ${audioState.currentItem?.startQuestionNumber ?? 1} - ${audioState.currentItem?.endQuestionNumber ?? 1}`}
            </p>
          </div>
        </div>

        {/* Center: Autoplay User Interaction Prompt OR Progress Indicator */}
        {isAwaitingGesture ? (
          <button
            onClick={() => void onStartPlayback()}
            className="px-4 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-md transition-all flex items-center gap-2 animate-bounce cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Bấm vào đây để bắt đầu phát âm thanh phòng thi</span>
          </button>
        ) : (
          <div className="flex items-center gap-3 w-full md:w-auto justify-center">
            {/* Status indicator */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span
                className={`w-2 h-2 rounded-full ${
                  isPlaying
                    ? 'bg-emerald-400 animate-ping'
                    : isPaused
                    ? 'bg-amber-400'
                    : isEnded
                    ? 'bg-slate-500'
                    : 'bg-indigo-400'
                }`}
              />
              <span className="font-medium text-slate-300">
                {isPlaying
                  ? 'Đang phát trực tiếp'
                  : isPaused
                  ? 'Tạm dừng (Mô phỏng)'
                  : isEnded
                  ? 'Đã kết thúc audio'
                  : 'Đang chuẩn bị'}
              </span>
            </div>

            {/* In simulation mode: Pause / Play toggle */}
            {audioState.canPause && (
              <button
                onClick={isPlaying ? onPausePlayback : () => void onStartPlayback()}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                title={isPlaying ? 'Tạm dừng mô phỏng' : 'Tiếp tục phát'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>
            )}

            {/* Time / Progress */}
            <div className="text-[11px] font-mono text-slate-400">
              <span>{formatSeconds(audioState.currentTime)}</span>
              {audioState.duration > 0 && <span> / {formatSeconds(audioState.duration)}</span>}
            </div>
          </div>
        )}

        {/* Right: Volume & Audio Restrictions Info */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Strict Notice */}
          {!audioState.canSeek && (
            <span
              className="hidden lg:inline-flex text-[11px] text-slate-400 italic items-center gap-1"
              title="Kỷ luật thi ETS: Thí sinh không thể tua hoặc nghe lại âm thanh"
            >
              <Lock className="w-3 h-3 text-slate-500" />
              Không tua / Không nghe lại
            </span>
          )}

          {/* Volume Control */}
          <div className="flex items-center gap-2 bg-slate-950/60 px-2.5 py-1 rounded-xl border border-slate-800">
            <button
              onClick={onToggleMute}
              className="text-slate-400 hover:text-slate-200 transition-colors"
              title={audioState.isMuted ? 'Bật âm' : 'Tắt tiếng'}
            >
              {audioState.isMuted || audioState.volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-indigo-400" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioState.isMuted ? 0 : audioState.volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-16 sm:w-20 accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              title="Âm lượng"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
