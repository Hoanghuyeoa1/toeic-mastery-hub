import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CommandCenter } from './components/Dashboard/CommandCenter';
import { RoadmapView } from './components/Roadmap/RoadmapView';
import { VocabVault } from './components/Vocabulary/VocabVault';
import { GrammarAndTraps } from './components/CheatSheet/GrammarAndTraps';
import { TestLogView } from './components/TestLog/TestLogView';
import { TimerHub } from './components/Timer/TimerHub';
import { BackupModal } from './components/Modals/BackupModal';
import { ProfileModal } from './components/Modals/ProfileModal';
import { OnboardingModal } from './components/Onboarding/OnboardingModal';
import { ExamLibraryHub } from './components/Exam';
import { Heart } from 'lucide-react';

const MainApp: React.FC = () => {
  const { data } = useApp();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isNewTestModalOpen, setIsNewTestModalOpen] = useState<boolean>(false);
  const [isOnboardingManualOpen, setIsOnboardingManualOpen] = useState<boolean>(false);

  const shouldShowOnboarding = !data.profile.hasCompletedOnboarding || isOnboardingManualOpen;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openBackupModal={() => setIsBackupModalOpen(true)}
        openProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {activeTab === 'dashboard' && (
          <CommandCenter
            setActiveTab={setActiveTab}
            openNewTestModal={() => {
              setActiveTab('tests');
              setIsNewTestModalOpen(true);
            }}
            openOnboardingModal={() => setIsOnboardingManualOpen(true)}
          />
        )}

        {activeTab === 'roadmap' && <RoadmapView />}

        {activeTab === 'vocab' && <VocabVault />}

        {activeTab === 'cheatsheet' && <GrammarAndTraps />}

        {activeTab === 'tests' && (
          <TestLogView
            isNewTestModalOpen={isNewTestModalOpen}
            setIsNewTestModalOpen={setIsNewTestModalOpen}
          />
        )}

        {activeTab === 'mock-exam' && <ExamLibraryHub />}

        {activeTab === 'timer' && <TimerHub />}
      </main>

      {/* Minimalist Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-850 bg-white/60 dark:bg-slate-900/60 py-4 text-xs text-slate-500 dark:text-slate-400 mt-auto backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              TOEIC Mastery Hub
            </span>
            <span>•</span>
            <span>Lộ trình & Quản lý luyện thi cá nhân hóa Offline-First</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for your {data.profile.targetScore}+ Goal
            </span>
            <span>•</span>
            <button
              onClick={() => setIsBackupModalOpen(true)}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Sao lưu JSON
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <OnboardingModal
        isOpen={shouldShowOnboarding}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
