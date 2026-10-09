/**
 * TOEIC Mastery Hub — Reusable Listening Audio Player Component
 * Phase 6: Stable Audio Controller & Lifecycle Architecture
 *
 * Provides a UI surface for ListeningAudioController:
 * - Transparent synthetic TTS disclaimer vs official audio indicator.
 * - Dynamic speaker indicator for Part 3 conversations (Man / Woman).
 * - Statement recitation indicator for Part 1 & Part 2 (Statement A, B, C, D).
 * - Timed mode single-play enforcement badge.
 * - Playback rate (0.8x, 1.0x, 1.2x) and volume controls.
 */

import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Square,
  Volume2,
  VolumeX,
  Headphones,
  AlertTriangle,
  Lock,
  User,
  Users,
} from 'lucide-react';
import { AudioTrackConfig } from '../../types/listeningAudio';
import { PracticeMode } from '../../types/practiceSession';
import { useListeningAudio } from '../../hooks/useListeningAudio';

export interface ListeningAudioPlayerProps {
  trackConfig: AudioTrackConfig;
  mode?: PracticeMode;
  allowReplayInTimed?: boolean;
  onPlayStarted?: () => void;
  onFinished?: () => void;
  className?: string;
  compact?: boolean;
}

export const ListeningAudioPlayer: React.FC<ListeningAudioPlayerProps> = ({
  trackConfig,
  mode = 'practice',
  allowReplayInTimed = false,
  onPlayStarted,
  onFinished,
  className = '',
  compact = false,
}) => {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const audio = useListeningAudio(trackConfig, {
    mode,
    allowReplayInTimed,
    onStatusChange: (status) => {
      if (status === 'playing' && onPlayStarted) {
        onPlayStarted();
      }
    },
    onEnded: () => {
      if (onFinished) {
        onFinished();
      }
    },
  });

  const formatSeconds = (sec: number): string => {
    const s = Math.floor(sec || 0);
    const mins = Math.floor(s / 60);
    const rem = s % 60;
    return `${mins}:${rem.toString().padStart(2, '0')}`;
  };

  const isTimedExhausted = mode === 'timed' && !allowReplayInTimed && audio.playCount >= 1;

  return (
    <div
      className={`w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-sm backdrop-blur-sm space-y-3 ${className}`}
      data-testid="listening-audio-player"
    >
      {/* 1. Top Bar: Part Info, Mode Badge & Replay Count */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
              audio.isSyntheticTTS
                ? 'bg-amber-500/10 text-amber-400'
                : 'bg-blue-500/10 text-blue-400'
            }`}
          >
            <Headphones className="w-4 h-4" />
          </span>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-200">
                Listening Track • Part {trackConfig.partNum}
              </span>

              {/* Speaker Indicator for Part 3/4 */}
              {audio.activeSpeaker && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/60 animate-pulse">
                  {audio.activeSpeaker === 'Woman' ? (
                    <User className="w-3 h-3 text-pink-400" />
                  ) : audio.activeSpeaker === 'Man' ? (
                    <User className="w-3 h-3 text-blue-400" />
                  ) : (
                    <Users className="w-3 h-3 text-emerald-400" />
                  )}
                  <span>Đang nói: {audio.activeSpeaker}</span>
                </span>
              )}

              {/* Statement Choice Indicator for Part 1 / Part 2 */}
              {audio.activeChoiceKey && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-800/60 animate-pulse">
                  Đang đọc câu ({audio.activeChoiceKey})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Play count badge & Timed restrictions */}
        <div className="flex items-center gap-2 text-[11px]">
          {mode === 'timed' ? (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${
                isTimedExhausted
                  ? 'bg-rose-950/70 text-rose-400 border border-rose-800/50'
                  : 'bg-amber-950/70 text-amber-300 border border-amber-800/50'
              }`}
            >
              {isTimedExhausted ? <Lock className="w-3 h-3" /> : null}
              Lần nghe: {audio.playCount}/1 (Chuẩn TOEIC)
            </span>
          ) : (
            <span className="text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded-full border border-zinc-700/50">
              Lần nghe: {audio.playCount} (Tự do)
            </span>
          )}

          <div className="font-mono text-zinc-400">
            <span className="text-zinc-200 font-bold">{formatSeconds(audio.currentTime)}</span> /{' '}
            {formatSeconds(audio.duration)}
          </div>
        </div>
      </div>

      {/* 2. Transparent Synthetic Audio Disclaimer Notice */}
      {audio.isSyntheticTTS && !compact && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] leading-relaxed">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
          <span>
            <strong>Âm thanh mô phỏng (TTS):</strong> Sử dụng giọng đọc tổng hợp Web Speech API của trình duyệt. Không phải bản thu âm gốc ETS.
          </span>
        </div>
      )}

      {/* 3. Progress Bar */}
      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden relative">
        <div
          className={`h-full transition-all duration-200 rounded-full ${
            audio.isSyntheticTTS ? 'bg-amber-500' : 'bg-blue-500'
          }`}
          style={{ width: `${Math.min(100, Math.round(audio.progressRatio * 100))}%` }}
        />
      </div>

      {/* 4. Controls Row */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {/* Play / Pause / Resume Button */}
          {audio.status === 'playing' ? (
            <button
              type="button"
              onClick={audio.pause}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Tạm dừng"
            >
              <Pause className="w-3.5 h-3.5 fill-white" />
              <span>Tạm dừng</span>
            </button>
          ) : audio.status === 'paused' ? (
            <button
              type="button"
              onClick={audio.resume}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Tiếp tục nghe"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Tiếp tục</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => audio.play()}
              disabled={isTimedExhausted}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isTimedExhausted
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
              }`}
              title={isTimedExhausted ? 'Chế độ Timed chỉ cho phép nghe 1 lần' : 'Bắt đầu phát audio'}
            >
              {isTimedExhausted ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Đã hết lượt nghe</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>
                    {audio.playCount > 0 ? 'Nghe lại' : 'Bấm để nghe audio'}
                  </span>
                </>
              )}
            </button>
          )}

          {/* Stop Button */}
          {(audio.status === 'playing' || audio.status === 'paused') && (
            <button
              type="button"
              onClick={audio.stop}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
              title="Dừng hẳn"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Replay Button (When allowed in Practice Mode) */}
          {mode === 'practice' && audio.status !== 'idle' && (
            <button
              type="button"
              onClick={() => audio.replay()}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
              title="Phát lại từ đầu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right side tools: Speed & Mute */}
        <div className="flex items-center gap-2">
          {/* Speed Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="px-2 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-mono font-medium transition-colors border border-zinc-700/60"
              title="Tốc độ phát"
            >
              {audio.playbackRate}x
            </button>

            {showSpeedMenu && (
              <div className="absolute right-0 bottom-full mb-1 bg-zinc-850 border border-zinc-700 rounded-xl p-1 shadow-xl flex gap-1 z-20">
                {[0.8, 1.0, 1.2].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => {
                      audio.setPlaybackRate(rate);
                      setShowSpeedMenu(false);
                    }}
                    className={`px-2 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                      audio.playbackRate === rate
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mute Toggle */}
          <button
            type="button"
            onClick={() => audio.setMuted(!audio.isMuted)}
            className={`p-1.5 rounded-lg transition-colors border ${
              audio.isMuted
                ? 'bg-rose-950/50 text-rose-400 border-rose-800/60'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700/60'
            }`}
            title={audio.isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
          >
            {audio.isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 5. Error message banner if any */}
      {audio.errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <div>
            <p className="font-semibold">Lỗi phát âm thanh ({audio.errorCode}):</p>
            <p>{audio.errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};
