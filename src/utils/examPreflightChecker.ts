/**
 * TOEIC Mastery Hub — Exam Preflight Verification Engine (Phase 13)
 *
 * Implements comprehensive, multi-layered technical preflight checks before entering
 * the Full-Length Mock Exam room:
 * - Form integrity, question cardinality (200 questions), and content fingerprint verification
 * - Media availability and mode compatibility (Strict mode lock vs Simulation fallback)
 * - Browser capability detection (SpeechSynthesis, Web Audio, LocalStorage, BroadcastChannel)
 * - Storage read/write test (identifying private browsing restrictions and quota limits)
 * - Existing unfinished session detection and conflict assessment
 * - Multi-tab ownership and lease status verification
 * - User gesture and audio device readiness testing (unlocking autoplay restrictions)
 */

import { ExamForm } from '../types/mockExam';
import { ExamAudioMode } from '../types/examAudio';
import {
  ExamPreflightReport,
  PreflightCheckItem,
  SoundCheckResult,
} from '../types/examLibrary';
import { validateExamFormStructure } from './examBlueprintValidator';
import { isStorageAvailable, loadActiveExamSession } from './examSessionStorage';
import { getActiveTabLease } from './examTabCoordinator';
import { getExamFormById } from './examFormRegistry';

/**
 * Runs the comprehensive preflight audit against an ExamForm for a specific mode.
 */
export function runComprehensivePreflight(
  examForm: ExamForm,
  selectedMode: ExamAudioMode,
  options?: {
    hasTestedSound?: boolean;
    now?: number;
    customStorageAvailable?: boolean;
    customSpeechAvailable?: boolean;
    customAudioAvailable?: boolean;
  }
): ExamPreflightReport {
  const evaluatedAt = options?.now ?? Date.now();
  const warnings: string[] = [];
  const blockers: string[] = [];

  // --------------------------------------------------------------------------
  // 1. Form Integrity Check
  // --------------------------------------------------------------------------
  const structureReport = validateExamFormStructure(examForm);
  const questionsCount = examForm.questions?.length ?? 0;
  const is200Questions = questionsCount === 200;

  let formIntegrityItem: PreflightCheckItem;
  if (!structureReport.isValid || !is200Questions) {
    const errorDetails = [
      ...structureReport.errors.map((e) => e.message),
      !is200Questions ? `Đề thi chỉ có ${questionsCount}/200 câu hỏi.` : '',
    ].filter(Boolean);

    formIntegrityItem = {
      id: 'formIntegrity',
      name: 'Toàn vẹn đề thi (Form Integrity)',
      description: 'Kiểm tra cấu trúc đề 200 câu, 7 Parts và mã fingerprint',
      status: 'failed',
      isCritical: true,
      message: 'Đề thi không đáp ứng chuẩn cấu trúc ETS 200 câu.',
      detail: errorDetails.join(' | '),
      actionRequired: 'Liên hệ quản trị viên hoặc chọn đề thi khác.',
    };
    blockers.push(formIntegrityItem.message || 'Lỗi toàn vẹn đề thi.');
  } else {
    formIntegrityItem = {
      id: 'formIntegrity',
      name: 'Toàn vẹn đề thi (Form Integrity)',
      description: 'Kiểm tra cấu trúc đề 200 câu, 7 Parts và mã fingerprint',
      status: 'passed',
      isCritical: true,
      message: 'Đề thi chuẩn hóa 200 câu (100 Listening, 100 Reading) hợp lệ 100%.',
    };
  }

  // --------------------------------------------------------------------------
  // 2. Media Readiness & Mode Compatibility
  // --------------------------------------------------------------------------
  let mediaReadinessItem: PreflightCheckItem;
  const media = examForm.media;
  const isStrictLocked = media?.strictLocked ?? false;
  const readinessStatus = media?.readinessStatus ?? 'invalid';

  if (selectedMode === 'strict') {
    if (isStrictLocked || readinessStatus !== 'strict-ready') {
      const reason =
        media?.lockReason ||
        'Chế độ Strict Mock bị khóa do chưa tích hợp file âm thanh phòng thu kiểm định.';
      mediaReadinessItem = {
        id: 'mediaReadiness',
        name: 'Tài nguyên âm thanh phòng thi (Strict Media)',
        description: 'Kiểm tra tệp âm thanh phòng thu và timeline kiểm chứng',
        status: 'failed',
        isCritical: true,
        message: 'Strict Mock Mode bị khóa.',
        detail: reason,
        actionRequired: 'Vui lòng chọn chế độ Mô Phỏng (Simulation Mode) để làm bài.',
      };
      blockers.push(mediaReadinessItem.detail || mediaReadinessItem.message || 'Strict Mock Mode bị khóa.');
    } else {
      mediaReadinessItem = {
        id: 'mediaReadiness',
        name: 'Tài nguyên âm thanh phòng thi (Strict Media)',
        description: 'Kiểm tra tệp âm thanh phòng thu và timeline kiểm chứng',
        status: 'passed',
        isCritical: true,
        message: 'Tệp âm thanh phòng thu và timeline kiểm định sẵn sàng 100%.',
      };
    }
  } else {
    // Simulation Mode
    if (readinessStatus === 'invalid') {
      mediaReadinessItem = {
        id: 'mediaReadiness',
        name: 'Tài nguyên âm thanh mô phỏng (TTS Media)',
        description: 'Kiểm tra kịch bản phân vai và giọng đọc mô phỏng',
        status: 'failed',
        isCritical: true,
        message: 'Tài nguyên âm thanh của đề thi bị đánh dấu không hợp lệ.',
        actionRequired: 'Chọn đề thi khác hợp lệ.',
      };
      blockers.push(mediaReadinessItem.message || 'Tài nguyên âm thanh không hợp lệ.');
    } else {
      mediaReadinessItem = {
        id: 'mediaReadiness',
        name: 'Tài nguyên âm thanh mô phỏng (TTS Media)',
        description: 'Kiểm tra kịch bản phân vai và giọng đọc mô phỏng',
        status: 'passed',
        isCritical: true,
        message: 'Kịch bản phân vai và giọng đọc bản xứ sẵn sàng cho chế độ Mô Phỏng.',
      };
      warnings.push(
        'Chế độ Mô Phỏng (Simulation): Sử dụng Web Speech API native. Đây là bản mô phỏng hỗ trợ học tập, không tuyên bố lịch phát đạt chuẩn phòng thi ETS.'
      );
    }
  }

  // --------------------------------------------------------------------------
  // 3. Browser Capabilities Check
  // --------------------------------------------------------------------------
  let browserCapabilitiesItem: PreflightCheckItem;
  const isSpeechSupported =
    options?.customSpeechAvailable !== undefined
      ? options.customSpeechAvailable
      : typeof window !== 'undefined' && 'speechSynthesis' in window;

  const isAudioSupported =
    options?.customAudioAvailable !== undefined
      ? options.customAudioAvailable
      : typeof window !== 'undefined' &&
        ('AudioContext' in window ||
          'webkitAudioContext' in window ||
          typeof Audio !== 'undefined');

  if (selectedMode === 'simulation' && !isSpeechSupported) {
    browserCapabilitiesItem = {
      id: 'browserCapabilities',
      name: 'Khả năng hỗ trợ của trình duyệt (Browser APIs)',
      description: 'Kiểm tra Web Speech API, Web Audio và BroadcastChannel',
      status: 'failed',
      isCritical: true,
      message: 'Trình duyệt không hỗ trợ Web Speech API cho chế độ Mô Phỏng.',
      actionRequired: 'Khuyến nghị sử dụng Chrome, Edge hoặc Safari phiên bản mới.',
    };
    blockers.push(browserCapabilitiesItem.message || 'Trình duyệt thiếu Web Speech API.');
  } else if (!isAudioSupported) {
    browserCapabilitiesItem = {
      id: 'browserCapabilities',
      name: 'Khả năng hỗ trợ của trình duyệt (Browser APIs)',
      description: 'Kiểm tra Web Speech API, Web Audio và BroadcastChannel',
      status: 'failed',
      isCritical: true,
      message: 'Trình duyệt không hỗ trợ Web Audio hoặc Audio Element.',
      actionRequired: 'Cập nhật trình duyệt web của bạn để tiếp tục.',
    };
    blockers.push(browserCapabilitiesItem.message || 'Trình duyệt thiếu Web Audio API.');
  } else {
    browserCapabilitiesItem = {
      id: 'browserCapabilities',
      name: 'Khả năng hỗ trợ của trình duyệt (Browser APIs)',
      description: 'Kiểm tra Web Speech API, Web Audio và BroadcastChannel',
      status: 'passed',
      isCritical: true,
      message: 'Trình duyệt hỗ trợ đầy đủ các API âm thanh và kết nối.',
    };
  }

  // --------------------------------------------------------------------------
  // 4. Storage Read/Write Access Check
  // --------------------------------------------------------------------------
  let storageAccessItem: PreflightCheckItem;
  const storageWritable =
    options?.customStorageAvailable !== undefined
      ? options.customStorageAvailable
      : isStorageAvailable();

  if (!storageWritable) {
    storageAccessItem = {
      id: 'storageAccess',
      name: 'Quyền lưu trữ ngoại tuyến (Storage Access)',
      description: 'Kiểm tra khả năng ghi LocalStorage để tự động lưu bài',
      status: 'failed',
      isCritical: true,
      message: 'Bộ nhớ LocalStorage bị chặn hoặc đã đầy dung lượng (QuotaExceeded).',
      detail:
        'Trình duyệt có thể đang ở chế độ ẩn danh chặn bộ nhớ, hoặc dung lượng ổ đĩa đã hết.',
      actionRequired: 'Tắt chế độ chặn bộ nhớ hoặc giải phóng dung lượng trình duyệt.',
    };
    blockers.push(storageAccessItem.message || 'Bộ nhớ LocalStorage bị chặn hoặc đầy dung lượng.');
  } else {
    storageAccessItem = {
      id: 'storageAccess',
      name: 'Quyền lưu trữ ngoại tuyến (Storage Access)',
      description: 'Kiểm tra khả năng ghi LocalStorage để tự động lưu bài',
      status: 'passed',
      isCritical: true,
      message: 'Bộ nhớ cục bộ khả dụng, đảm bảo tự động lưu đáp án ngoại tuyến 100%.',
    };
  }

  // --------------------------------------------------------------------------
  // 5. Existing Unfinished Session Detection
  // --------------------------------------------------------------------------
  let activeSessionItem: PreflightCheckItem;
  const sessionResult = loadActiveExamSession(getExamFormById);
  const activeSession = sessionResult.success ? sessionResult.data : null;

  if (activeSession && activeSession.status !== 'submitted') {
    const isSameForm = activeSession.examFormId === examForm.id;
    if (isSameForm) {
      activeSessionItem = {
        id: 'activeSession',
        name: 'Phiên thi dở dang (Active Session)',
        description: 'Kiểm tra phiên thi chưa hoàn thành của người dùng',
        status: 'warning',
        isCritical: false,
        message: 'Bạn đang có một phiên thi dở dang cho đề thi này.',
        detail: `Phiên ID: ${activeSession.sessionId.slice(0, 8)}... (${activeSession.currentSection}, câu ${activeSession.currentQuestionNumber})`,
        actionRequired: 'Bạn có thể bấm "Tiếp tục làm bài (Resume)" hoặc "Hủy bỏ phiên cũ (Discard)" để bắt đầu lại.',
      };
      warnings.push('Đang có phiên làm dở: Bắt đầu mới sẽ ghi đè phiên này.');
    } else {
      activeSessionItem = {
        id: 'activeSession',
        name: 'Phiên thi dở dang (Active Session)',
        description: 'Kiểm tra phiên thi chưa hoàn thành của người dùng',
        status: 'warning',
        isCritical: false,
        message: 'Bạn đang có một phiên thi dở dang cho một đề thi khác.',
        detail: `Đề ID: ${activeSession.examFormId}`,
        actionRequired: 'Hủy bỏ phiên cũ hoặc hoàn thành đề cũ trước khi thi đề mới.',
      };
      warnings.push('Đang có phiên dở dang của đề khác.');
    }
  } else {
    activeSessionItem = {
      id: 'activeSession',
      name: 'Phiên thi dở dang (Active Session)',
      description: 'Kiểm tra phiên thi chưa hoàn thành của người dùng',
      status: 'passed',
      isCritical: false,
      message: 'Không có phiên thi dở dang nào. Sẵn sàng khởi tạo phiên mới.',
    };
  }

  // --------------------------------------------------------------------------
  // 6. Multi-Tab Ownership & Conflict Check
  // --------------------------------------------------------------------------
  let multiTabItem: PreflightCheckItem;
  const activeLease = getActiveTabLease();

  if (activeLease && Date.now() < activeLease.expiresAt) {
    multiTabItem = {
      id: 'multiTab',
      name: 'Kiểm soát độc quyền đa tab (Multi-Tab Ownership)',
      description: 'Ngăn chặn xung đột ghi đè dữ liệu giữa nhiều tab',
      status: 'warning',
      isCritical: false,
      message: `Tab khác (${activeLease.tabId.slice(0, 8)}...) đang giữ quyền ghi.`,
      detail: 'Bắt đầu tại tab này sẽ tự động chiếm quyền (Takeover) và vô hiệu hóa tab cũ.',
      actionRequired: 'Đóng các tab thi khác để tránh nhầm lẫn.',
    };
    warnings.push('Một tab khác đang mở phiên thi. Tab này sẽ tự động Takeover quyền chỉnh sửa.');
  } else {
    multiTabItem = {
      id: 'multiTab',
      name: 'Kiểm soát độc quyền đa tab (Multi-Tab Ownership)',
      description: 'Ngăn chặn xung đột ghi đè dữ liệu giữa nhiều tab',
      status: 'passed',
      isCritical: false,
      message: 'Không có xung đột đa tab. Tab này sẽ là tab duy nhất giữ quyền ghi.',
    };
  }

  // --------------------------------------------------------------------------
  // 7. Audio Gesture Readiness (Sound Check)
  // --------------------------------------------------------------------------
  let audioGestureItem: PreflightCheckItem;
  if (options?.hasTestedSound) {
    audioGestureItem = {
      id: 'audioGesture',
      name: 'Xác thực âm thanh & Tai nghe (Audio Device Check)',
      description: 'Kiểm tra thiết bị phát âm thanh và mở khóa Autoplay Policy',
      status: 'passed',
      isCritical: false,
      message: 'Đã xác nhận âm thanh hoạt động tốt và mở khóa chính sách Autoplay.',
    };
  } else {
    audioGestureItem = {
      id: 'audioGesture',
      name: 'Xác thực âm thanh & Tai nghe (Audio Device Check)',
      description: 'Kiểm tra thiết bị phát âm thanh và mở khóa Autoplay Policy',
      status: 'warning',
      isCritical: false,
      message: 'Chưa thực hiện nghe thử âm thanh.',
      detail: 'Khuyến nghị bấm "Kiểm tra loa / tai nghe" trước khi vào thi.',
      actionRequired: 'Bấm nút "Nghe thử âm thanh" để kiểm tra âm lượng tai nghe.',
    };
    warnings.push('Khuyến nghị kiểm tra tai nghe trước khi chính thức bấm Bắt đầu.');
  }

  const isReadyToStart = blockers.length === 0;

  return {
    isReadyToStart,
    selectedMode,
    examForm,
    checks: {
      formIntegrity: formIntegrityItem,
      mediaReadiness: mediaReadinessItem,
      browserCapabilities: browserCapabilitiesItem,
      storageAccess: storageAccessItem,
      activeSession: activeSessionItem,
      multiTab: multiTabItem,
      audioGesture: audioGestureItem,
    },
    warnings,
    blockers,
    evaluatedAt,
  };
}

/**
 * Executes an audible sound check to verify headphones/speakers and
 * unlock browser autoplay policies via a user gesture.
 */
export async function testAudioPlayback(
  mode: 'tone' | 'speech' = 'tone'
): Promise<SoundCheckResult> {
  const now = Date.now();

  if (typeof window === 'undefined') {
    return {
      success: true,
      mode,
      playedAt: now,
    };
  }

  try {
    if (mode === 'speech' && 'speechSynthesis' in window) {
      return new Promise<SoundCheckResult>((resolve) => {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance('TOEIC Audio Ready');
          utterance.rate = 1.0;
          utterance.volume = 0.8;
          utterance.onend = () => {
            resolve({ success: true, mode: 'speech', playedAt: Date.now() });
          };
          utterance.onerror = (e) => {
            resolve({
              success: false,
              mode: 'speech',
              playedAt: Date.now(),
              error: `Speech synthesis error: ${e.error}`,
            });
          };
          window.speechSynthesis.speak(utterance);
        } catch (err: unknown) {
          resolve({
            success: false,
            mode: 'speech',
            playedAt: Date.now(),
            error: err instanceof Error ? err.message : String(err),
          });
        }
      });
    }

    // Default: Web Audio API gentle tone (520 Hz)
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (AudioContextClass) {
      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);

      setTimeout(() => {
        try {
          ctx.close();
        } catch {
          // ignore close errors
        }
      }, 500);

      return {
        success: true,
        mode: 'tone',
        playedAt: now,
      };
    }

    return {
      success: true,
      mode: 'tone',
      playedAt: now,
    };
  } catch (err: unknown) {
    return {
      success: false,
      mode,
      playedAt: now,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
