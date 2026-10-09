import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Headphones } from 'lucide-react';
import { soundService } from '../../utils/audio';

interface AudioPlayerProps {
  questionId: string;
  partNum: number;
  audioScript: string;
  statements?: { key: string; text: string }[];
  onPlayStarted?: () => void;
  onFinished?: () => void;
}

export const ToeicAudioPlayer: React.FC<AudioPlayerProps> = ({
  questionId,
  partNum,
  audioScript,
  statements,
  onPlayStarted,
  onFinished,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(16); // ~16 seconds for 4 statements
  const [currentStatementKey, setCurrentStatementKey] = useState<string | null>(null);

  const timerRef = useRef<any>(null);

  // Stop audio whenever question changes
  useEffect(() => {
    stopAudio();
    setCurrentTime(0);
    setCurrentStatementKey(null);
    setIsPlaying(false);

    // Calculate approximate duration based on content
    const totalChars = (statements ? statements.map(s => s.text).join(' ') : audioScript).length;
    const estimatedSeconds = Math.max(8, Math.min(30, Math.round(totalChars / 12) + 4));
    setDuration(estimatedSeconds);

    return () => stopAudio();
  }, [questionId]);

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      startPlayback();
    }
  };

  const startPlayback = () => {
    stopAudio();
    setIsPlaying(true);
    soundService.playTick();

    if (onPlayStarted) {
      onPlayStarted();
    }

    // Build the full speech text
    let fullSpeech = '';
    if (statements && statements.length > 0) {
      fullSpeech = `Look at the picture. Statement A: ${statements[0].text}. Statement B: ${statements[1]?.text || ''}. Statement C: ${statements[2]?.text || ''}. Statement D: ${statements[3]?.text || ''}.`;
    } else {
      fullSpeech = audioScript;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(fullSpeech);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;

      utterance.onboundary = (event) => {
        // approximate mapping to statement key
        const charIdx = event.charIndex;
        const totalLen = fullSpeech.length;
        const progress = charIdx / totalLen;
        if (progress > 0.75) setCurrentStatementKey('D');
        else if (progress > 0.5) setCurrentStatementKey('C');
        else if (progress > 0.25) setCurrentStatementKey('B');
        else setCurrentStatementKey('A');
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentTime(duration);
        if (timerRef.current) clearInterval(timerRef.current);
        if (onFinished) onFinished();
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };

      window.speechSynthesis.speak(utterance);
    }

    // Progress bar ticker
    const startTime = Date.now() - currentTime * 1000;
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed >= duration) {
        setCurrentTime(duration);
        setIsPlaying(false);
        clearInterval(timerRef.current);
        if (onFinished) onFinished();
      } else {
        setCurrentTime(elapsed);
        // statement progress fallback if speech boundary is not supported
        const ratio = elapsed / duration;
        if (ratio > 0.75) setCurrentStatementKey('D');
        else if (ratio > 0.5) setCurrentStatementKey('C');
        else if (ratio > 0.25) setCurrentStatementKey('B');
        else setCurrentStatementKey('A');
      }
    }, 150);
  };

  const handleReset = () => {
    stopAudio();
    setCurrentTime(0);
    setIsPlaying(false);
    setCurrentStatementKey(null);
  };

  const formatSec = (sec: number) => {
    const s = Math.floor(sec);
    const mins = Math.floor(s / 60);
    const rem = s % 60;
    return `${mins}:${rem.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, Math.round((currentTime / duration) * 100));

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
            <Headphones className="w-4 h-4" />
          </span>
          <div>
            <span className="font-semibold text-zinc-200">
              ETS Audio Track {partNum > 0 ? `• Part ${partNum}` : ''}
            </span>
            {currentStatementKey && (
              <span className="ml-2 text-[11px] font-mono font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60 animate-pulse">
                Đang đọc câu ({currentStatementKey})
              </span>
            )}
          </div>
        </div>

        <div className="font-mono text-[11px] text-zinc-400">
          <span className="text-zinc-200 font-bold">{formatSec(currentTime)}</span> / {formatSec(duration)}
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden cursor-pointer relative"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickRatio = (e.clientX - rect.left) / rect.width;
          setCurrentTime(clickRatio * duration);
        }}
      >
        <div
          className="h-full bg-blue-500 transition-all duration-150 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePlayToggle}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span>Tạm Dừng</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{currentTime > 0 ? 'Tiếp Tục Nghe' : 'Bấm Để Nghe 4 Câu (A, B, C, D)'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Phát lại từ đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <span className="text-[11px] text-zinc-400 hidden sm:inline">
          {isPlaying ? '🎧 Đang phát âm thanh...' : '💡 Bấm Nghe để mở khóa các đáp án'}
        </span>
      </div>
    </div>
  );
};
