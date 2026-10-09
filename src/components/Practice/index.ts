export { PracticeConfigHub } from './PracticeConfigHub';
export type { PracticeConfigData, PracticeConfigHubProps } from './PracticeConfigHub';

// Practice Session Engine & Lifecycle (Phase 5)
export { usePracticeSession } from '../../hooks/usePracticeSession';
export type {
  UsePracticeSessionOptions,
  UsePracticeSessionReturn,
} from '../../hooks/usePracticeSession';

export * from '../../types/practiceSession';
export {
  createPracticeSession,
  setSessionAnswer,
  toggleSessionMark,
  navigateSession,
  recordAssistance,
  submitSession,
  abandonSession,
  getSessionRemainingSeconds,
  isSessionExpired,
  checkAndApplyTimeout,
  getSessionProgress,
  validateSessionIntegrity,
} from '../../utils/practiceSessionEngine';

export {
  ACTIVE_PRACTICE_SESSION_KEY,
  PRACTICE_HISTORY_KEY,
  saveActiveSession,
  loadActiveSession,
  startNewActiveSession,
  clearActiveSession,
  archiveCompletedSession,
  loadPracticeHistory,
  exportPracticeStorageData,
  importPracticeStorageData,
  checkHasUnfinishedActiveSession,
} from '../../utils/practiceSessionStorage';

// Stable Listening Audio Engine (Phase 6)
export * from '../../types/listeningAudio';
export {
  buildAudioTrackConfigFromQuestion,
  buildAudioTrackConfigFromGroup,
  parsePart3Dialogue,
  chunkSentenceText,
} from '../../utils/audioScriptParser';
export { voiceManager } from '../../utils/voiceManager';
export {
  ListeningAudioController,
  audioPlaybackCoordinator,
} from '../../utils/listeningAudioController';
export { useListeningAudio } from '../../hooks/useListeningAudio';
export type { UseListeningAudioReturn } from '../../hooks/useListeningAudio';
export { ListeningAudioPlayer } from './ListeningAudioPlayer';
export type { ListeningAudioPlayerProps } from './ListeningAudioPlayer';

// Listening Practice Workspace (Phase 7)
export * from './Listening';

// Reading Practice Workspace (Phase 8)
export * from './Reading';

export {
  getQuestionById,
  getQuestionGroupById,
  getQuestionsForGroup,
  verifyQuestionIdsExist,
} from '../../utils/questionBankLookup';

