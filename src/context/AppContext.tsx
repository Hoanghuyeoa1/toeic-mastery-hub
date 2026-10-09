import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppData,
  UserProfile,
  DailyGoal,
  RoadmapTask,
  CalendarEvent,
  VocabularyItem,
  SRSRating,
  TestLog,
  MistakeItem,
  GoalTriggerKey
} from '../types';
import { INITIAL_APP_DATA } from '../data/seedData';
import { soundService } from '../utils/audio';
import { DIAGNOSTIC_QUESTIONS } from '../data/diagnosticQuestions';
import { calculateDiagnosticScore } from '../utils/scoreConverter';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'toeic_mastery_data_v2_cold';
const THEME_KEY = 'toeic_theme_v2';

interface AppContextType {
  data: AppData;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  // Event-driven Daily Goals
  triggerGoalProgress: (key: GoalTriggerKey, count?: number) => void;
  onVocabReviewed: () => void;
  onTestSubmitted: (log: Omit<TestLog, 'id'>) => void;
  onTrapStudied: (trapId: string) => void;
  onPomodoroFinished: () => void;
  // Onboarding
  completeOnboardingWithScore: (listening: number, reading: number) => void;
  completeOnboardingWithDiagnostic: (answers: Record<string, string>) => {
    totalCorrect: number;
    listeningScaled: number;
    readingScaled: number;
    totalScore: number;
    mistakesCount: number;
  };
  // Roadmap
  updateRoadmapTask: (taskId: string, updates: Partial<RoadmapTask>) => void;
  addRoadmapTask: (phaseId: string, task: Omit<RoadmapTask, 'id' | 'phaseId'>) => void;
  deleteRoadmapTask: (taskId: string) => void;
  // Calendar
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  toggleCalendarEvent: (id: string) => void;
  deleteCalendarEvent: (id: string) => void;
  // Vocabulary & SRS
  addVocabulary: (vocab: Omit<VocabularyItem, 'id' | 'srsStage' | 'nextReviewDate' | 'reviewCount'>) => void;
  updateVocabularySRS: (id: string, rating: SRSRating) => void;
  deleteVocabulary: (id: string) => void;
  bulkImportVocabulary: (items: Array<Omit<VocabularyItem, 'id' | 'srsStage' | 'nextReviewDate' | 'reviewCount'>>) => number;
  // Test Logs & Mistakes
  addTestLog: (log: Omit<TestLog, 'id'>) => void;
  deleteTestLog: (id: string) => void;
  addMistakeToTest: (testId: string, mistake: Omit<MistakeItem, 'id'>) => void;
  deleteMistake: (testId: string, mistakeId: string) => void;
  // Backup & Restore
  exportDataJson: () => void;
  importDataJson: (jsonString: string) => { success: boolean; message: string };
  resetToSeedData: () => void;
  recordActivity: (amount?: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
      return 'dark'; // Minimalist Slate dark theme
    }
    return 'dark';
  });

  // App Data state
  const [data, setData] = useState<AppData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const local = localStorage.getItem(STORAGE_KEY);
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed && parsed.profile && parsed.vocabulary && parsed.dailyGoals) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Lỗi đọc LocalStorage:', e);
      }
    }
    return INITIAL_APP_DATA;
  });

  // Apply theme to HTML
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Persist AppData to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Lỗi ghi LocalStorage:', e);
    }
  }, [data]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Activity recording: updates streak and heatmap ONLY when real study action occurs
  const recordActivity = (amount: number = 1) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setData(prev => {
      const currentCount = prev.activityHeatmap[todayStr] || 0;
      const newHeatmap = {
        ...prev.activityHeatmap,
        [todayStr]: currentCount + amount,
      };

      // Recalculate streak strictly
      let newStreak = prev.profile.streakDays;
      if (prev.profile.lastActiveDate !== todayStr) {
        if (!prev.profile.lastActiveDate) {
          // First day ever active!
          newStreak = 1;
        } else {
          const lastDate = new Date(prev.profile.lastActiveDate);
          const todayDate = new Date(todayStr);
          const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
          if (diffDays === 1) {
            newStreak += 1;
          } else if (diffDays > 1) {
            newStreak = 1; // Broken streak reset to 1
          }
        }
      }

      return {
        ...prev,
        activityHeatmap: newHeatmap,
        profile: {
          ...prev.profile,
          streakDays: newStreak,
          lastActiveDate: todayStr,
        },
      };
    });
  };

  // Event-driven Daily Goal progress
  const triggerGoalProgress = (key: GoalTriggerKey, count: number = 1) => {
    let goalCompletedNow = false;
    setData(prev => {
      const todayStr = new Date().toISOString().split('T')[0];
      const updatedGoals = prev.dailyGoals.map(goal => {
        if (goal.triggerKey === key) {
          const newCurrent = goal.progressCurrent + count;
          const isDone = newCurrent >= goal.progressTarget;
          if (isDone && !goal.completed) {
            goalCompletedNow = true;
          }
          return {
            ...goal,
            progressCurrent: newCurrent,
            completed: isDone,
            date: todayStr,
          };
        }
        return goal;
      });

      return {
        ...prev,
        dailyGoals: updatedGoals,
      };
    });

    recordActivity(count);
    if (goalCompletedNow) {
      soundService.playChime();
    }
  };

  // Specific event triggers
  const onVocabReviewed = () => {
    triggerGoalProgress('vocab', 1);
  };

  const onTestSubmitted = (log: Omit<TestLog, 'id'>) => {
    addTestLog(log);
    triggerGoalProgress('test', 1);
  };

  const onTrapStudied = (_trapId: string) => {
    triggerGoalProgress('trap', 1);
    soundService.playTick();
  };

  const onPomodoroFinished = () => {
    triggerGoalProgress('pomo', 1);
  };

  // Onboarding method 1: Direct Score Entry
  const completeOnboardingWithScore = (listening: number, reading: number) => {
    const total = listening + reading;
    const todayStr = new Date().toISOString().split('T')[0];

    const baselineTest: TestLog = {
      id: `test-baseline-${Date.now()}`,
      testName: 'Điểm Đầu Vào (Baseline Score)',
      date: todayStr,
      listeningRaw: Math.round((listening / 495) * 100),
      readingRaw: Math.round((reading / 495) * 100),
      listeningScore: listening,
      readingScore: reading,
      totalScore: total,
      durationMinutes: 120,
      notes: 'Điểm thi gần nhất do bạn tự khai báo khi khởi tạo lộ trình.',
      mistakes: [],
    };

    setData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        hasCompletedOnboarding: true,
        currentScore: total,
        currentListening: listening,
        currentReading: reading,
      },
      testLogs: [baselineTest, ...prev.testLogs],
    }));

    triggerGoalProgress('test', 1);
    confetti({ particleCount: 100, spread: 70 });
  };

  // Onboarding method 2: Mini Diagnostic Test Evaluation
  const completeOnboardingWithDiagnostic = (answers: Record<string, string>) => {
    let listeningCorrect = 0;
    let readingCorrect = 0;
    const mistakes: MistakeItem[] = [];

    DIAGNOSTIC_QUESTIONS.forEach(q => {
      const userAnswer = answers[q.id];
      if (userAnswer === q.correctKey) {
        if (q.section === 'listening') listeningCorrect++;
        else readingCorrect++;
      } else {
        mistakes.push({
          id: `m-diag-${q.id}`,
          questionNum: q.partNum * 10,
          part: q.part,
          yourAnswer: userAnswer || 'Bỏ trống',
          correctAnswer: q.correctKey,
          reason: q.partNum <= 2 ? 'trap' : q.partNum <= 5 ? 'grammar' : 'vocab',
          reasonText: q.explanation,
          lessonLearned: `Ôn kỹ chiến thuật ${q.skillTag}`,
        });
      }
    });

    const totalCorrect = listeningCorrect + readingCorrect;
    const totalListening = DIAGNOSTIC_QUESTIONS.filter(q => q.section === 'listening').length || 8;
    const totalReading = DIAGNOSTIC_QUESTIONS.filter(q => q.section === 'reading').length || 6;

    // Scale scores using realistic TOEIC diagnostic conversion bands
    const {
      listeningScore: listeningScaled,
      readingScore: readingScaled,
      totalScore,
    } = calculateDiagnosticScore(listeningCorrect, totalListening, readingCorrect, totalReading);

    const todayStr = new Date().toISOString().split('T')[0];

    const diagTest: TestLog = {
      id: `test-diag-${Date.now()}`,
      testName: 'Mini Diagnostic Test (Đánh Giá Đầu Vào)',
      date: todayStr,
      listeningRaw: Math.round((listeningCorrect / totalListening) * 100),
      readingRaw: Math.round((readingCorrect / totalReading) * 100),
      listeningScore: listeningScaled,
      readingScore: readingScaled,
      totalScore,
      durationMinutes: 20,
      notes: `Hoàn thành bài test phân hóa nhanh: Đúng ${totalCorrect}/${DIAGNOSTIC_QUESTIONS.length} câu (Nghe: ${listeningCorrect}/${totalListening}, Đọc: ${readingCorrect}/${totalReading}).`,
      mistakes,
    };

    setData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        hasCompletedOnboarding: true,
        currentScore: totalScore,
        currentListening: listeningScaled,
        currentReading: readingScaled,
      },
      testLogs: [diagTest, ...prev.testLogs],
    }));

    triggerGoalProgress('test', 1);
    confetti({ particleCount: 120, spread: 80 });

    return {
      totalCorrect,
      listeningScaled,
      readingScaled,
      totalScore,
      mistakesCount: mistakes.length,
    };
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...updates,
      },
    }));
  };

  const updateRoadmapTask = (taskId: string, updates: Partial<RoadmapTask>) => {
    setData(prev => {
      let isCompletedNow = false;
      const phases = prev.roadmapPhases.map(phase => ({
        ...phase,
        tasks: phase.tasks.map(t => {
          if (t.id === taskId) {
            if (updates.status === 'done' && t.status !== 'done') {
              isCompletedNow = true;
            }
            return { ...t, ...updates };
          }
          return t;
        }),
      }));

      if (isCompletedNow) {
        soundService.playChime();
      }

      return { ...prev, roadmapPhases: phases };
    });
    recordActivity(1);
  };

  const addRoadmapTask = (phaseId: string, task: Omit<RoadmapTask, 'id' | 'phaseId'>) => {
    const newTask: RoadmapTask = {
      ...task,
      id: `task-${Date.now()}`,
      phaseId,
    };
    setData(prev => ({
      ...prev,
      roadmapPhases: prev.roadmapPhases.map(p =>
        p.id === phaseId ? { ...p, tasks: [...p.tasks, newTask] } : p
      ),
    }));
    soundService.playTick();
  };

  const deleteRoadmapTask = (taskId: string) => {
    setData(prev => ({
      ...prev,
      roadmapPhases: prev.roadmapPhases.map(p => ({
        ...p,
        tasks: p.tasks.filter(t => t.id !== taskId),
      })),
    }));
  };

  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `cal-${Date.now()}`,
    };
    setData(prev => ({
      ...prev,
      calendarEvents: [...prev.calendarEvents, newEvent],
    }));
    soundService.playTick();
  };

  const toggleCalendarEvent = (id: string) => {
    setData(prev => ({
      ...prev,
      calendarEvents: prev.calendarEvents.map(e => {
        if (e.id === id) {
          const next = !e.completed;
          if (next) soundService.playChime();
          return { ...e, completed: next };
        }
        return e;
      }),
    }));
    recordActivity(1);
  };

  const deleteCalendarEvent = (id: string) => {
    setData(prev => ({
      ...prev,
      calendarEvents: prev.calendarEvents.filter(e => e.id !== id),
    }));
  };

  const updateVocabularySRS = (id: string, rating: SRSRating) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    setData(prev => {
      const updated = prev.vocabulary.map(item => {
        if (item.id === id) {
          let nextStage = item.srsStage;
          let daysToAdd = 1;

          if (rating === 'hard') {
            nextStage = 0;
            daysToAdd = 1;
          } else if (rating === 'medium') {
            nextStage = Math.min(5, item.srsStage + 1);
            const intervals = [1, 3, 7, 14, 30, 60];
            daysToAdd = intervals[nextStage] || 7;
          } else if (rating === 'easy') {
            nextStage = Math.min(5, item.srsStage + 2);
            const intervals = [3, 7, 14, 28, 45, 90];
            daysToAdd = intervals[nextStage] || 14;
          }

          const nextDateObj = new Date(today);
          nextDateObj.setDate(today.getDate() + daysToAdd);
          const nextReviewDate = nextDateObj.toISOString().split('T')[0];

          return {
            ...item,
            srsStage: nextStage,
            reviewCount: item.reviewCount + 1,
            lastReviewedDate: todayStr,
            nextReviewDate,
          };
        }
        return item;
      });

      return { ...prev, vocabulary: updated };
    });

    onVocabReviewed();
    soundService.playTick();
  };

  const addVocabulary = (vocab: Omit<VocabularyItem, 'id' | 'srsStage' | 'nextReviewDate' | 'reviewCount'>) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newWord: VocabularyItem = {
      ...vocab,
      id: `v-${Date.now()}`,
      srsStage: 0,
      nextReviewDate: todayStr,
      reviewCount: 0,
    };
    setData(prev => ({
      ...prev,
      vocabulary: [newWord, ...prev.vocabulary],
    }));
    soundService.playTick();
    recordActivity(1);
  };

  const deleteVocabulary = (id: string) => {
    setData(prev => ({
      ...prev,
      vocabulary: prev.vocabulary.filter(v => v.id !== id),
    }));
  };

  const bulkImportVocabulary = (
    items: Array<Omit<VocabularyItem, 'id' | 'srsStage' | 'nextReviewDate' | 'reviewCount'>>
  ): number => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newWords: VocabularyItem[] = items.map((item, index) => ({
      ...item,
      id: `v-${Date.now()}-${index}`,
      srsStage: 0,
      nextReviewDate: todayStr,
      reviewCount: 0,
    }));

    setData(prev => ({
      ...prev,
      vocabulary: [...newWords, ...prev.vocabulary],
    }));

    recordActivity(newWords.length);
    soundService.playChime();
    return newWords.length;
  };

  const addTestLog = (log: Omit<TestLog, 'id'>) => {
    const newLog: TestLog = {
      ...log,
      id: `test-${Date.now()}`,
    };
    setData(prev => ({
      ...prev,
      testLogs: [newLog, ...prev.testLogs],
      profile: {
        ...prev.profile,
        currentScore: newLog.totalScore,
        currentListening: newLog.listeningScore,
        currentReading: newLog.readingScore,
      },
    }));
    soundService.playChime();
    recordActivity(5);
  };

  const deleteTestLog = (id: string) => {
    setData(prev => {
      const remaining = prev.testLogs.filter(t => t.id !== id);
      const latest = remaining[0];
      return {
        ...prev,
        testLogs: remaining,
        profile: {
          ...prev.profile,
          currentScore: latest ? latest.totalScore : null,
          currentListening: latest ? latest.listeningScore : null,
          currentReading: latest ? latest.readingScore : null,
        },
      };
    });
  };

  const addMistakeToTest = (testId: string, mistake: Omit<MistakeItem, 'id'>) => {
    const newMistake: MistakeItem = {
      ...mistake,
      id: `m-${Date.now()}`,
    };
    setData(prev => ({
      ...prev,
      testLogs: prev.testLogs.map(t =>
        t.id === testId ? { ...t, mistakes: [...t.mistakes, newMistake] } : t
      ),
    }));
    soundService.playTick();
  };

  const deleteMistake = (testId: string, mistakeId: string) => {
    setData(prev => ({
      ...prev,
      testLogs: prev.testLogs.map(t =>
        t.id === testId ? { ...t, mistakes: t.mistakes.filter(m => m.id !== mistakeId) } : t
      ),
    }));
  };

  const exportDataJson = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `toeic_mastery_backup_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    soundService.playChime();
  };

  const importDataJson = (jsonString: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.profile || !parsed.vocabulary || !parsed.roadmapPhases) {
        return {
          success: false,
          message: 'File JSON không đúng cấu trúc TOEIC Mastery Hub.',
        };
      }
      setData(parsed);
      soundService.playChime();
      return { success: true, message: 'Khôi phục dữ liệu thành công!' };
    } catch (e) {
      return {
        success: false,
        message: `Lỗi đọc file JSON: ${(e as Error).message}`,
      };
    }
  };

  const resetToSeedData = () => {
    setData(INITIAL_APP_DATA);
    soundService.playChime();
  };

  return (
    <AppContext.Provider
      value={{
        data,
        theme,
        toggleTheme,
        updateProfile,
        triggerGoalProgress,
        onVocabReviewed,
        onTestSubmitted,
        onTrapStudied,
        onPomodoroFinished,
        completeOnboardingWithScore,
        completeOnboardingWithDiagnostic,
        updateRoadmapTask,
        addRoadmapTask,
        deleteRoadmapTask,
        addCalendarEvent,
        toggleCalendarEvent,
        deleteCalendarEvent,
        addVocabulary,
        updateVocabularySRS,
        deleteVocabulary,
        bulkImportVocabulary,
        addTestLog,
        deleteTestLog,
        addMistakeToTest,
        deleteMistake,
        exportDataJson,
        importDataJson,
        resetToSeedData,
        recordActivity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
