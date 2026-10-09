import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { VocabularyItem, SRSRating } from '../../types';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  RotateCw,
  Volume2,
  Plus,
  FileSpreadsheet,
  Search,
  Filter,
  CheckCircle2,
  BrainCircuit,
  Sparkles,
  Trash2,
  AlertTriangle,
  Flame,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export const VocabVault: React.FC = () => {
  const {
    data,
    addVocabulary,
    updateVocabularySRS,
    deleteVocabulary,
    bulkImportVocabulary,
  } = useApp();

  const { vocabulary } = data;

  const [activeTab, setActiveTab] = useState<'flashcard' | 'vault'>('flashcard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  // Flashcard states
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'due_only' | 'all'>('due_only');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // New Word Form state
  const [newWord, setNewWord] = useState('');
  const [newIpa, setNewIpa] = useState('');
  const [newPos, setNewPos] = useState<VocabularyItem['pos']>('noun');
  const [newVnMeaning, setNewVnMeaning] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newPartTag, setNewPartTag] = useState('Part 5, 7');
  const [newTrapNote, setNewTrapNote] = useState('');
  const [newTopic, setNewTopic] = useState('Office');

  // Bulk import state
  const [bulkText, setBulkText] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Topics extraction
  const topics = useMemo(() => {
    const set = new Set(vocabulary.map(v => v.topic));
    return ['all', ...Array.from(set)];
  }, [vocabulary]);

  // Due items for SRS
  const dueItems = useMemo(() => {
    return vocabulary.filter(v => v.nextReviewDate <= todayStr);
  }, [vocabulary, todayStr]);

  // Flashcard queue
  const flashcardQueue = useMemo(() => {
    if (reviewFilter === 'due_only') {
      return dueItems;
    }
    return vocabulary;
  }, [reviewFilter, dueItems, vocabulary]);

  const currentCard = flashcardQueue[currentCardIndex];

  // Pronounce word via SpeechSynthesis
  const speakWord = (word: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSRSResponse = (rating: SRSRating) => {
    if (!currentCard) return;

    updateVocabularySRS(currentCard.id, rating);
    setIsFlipped(false);

    if (currentCardIndex >= flashcardQueue.length - 1) {
      // Completed all cards
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setCurrentCardIndex(0);
    } else {
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newVnMeaning.trim()) return;

    addVocabulary({
      word: newWord.trim(),
      ipa: newIpa.trim() || '/.../',
      pos: newPos,
      vnMeaning: newVnMeaning.trim(),
      example: newExample.trim() || `This is an example sentence for ${newWord.trim()}.`,
      partTag: newPartTag,
      trapNote: newTrapNote.trim(),
      topic: newTopic,
    });

    setNewWord('');
    setNewIpa('');
    setNewVnMeaning('');
    setNewExample('');
    setNewTrapNote('');
    setIsAddModalOpen(false);
  };

  const handleBulkImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    // Parse lines: word | ipa | pos | vietnamese | example
    const lines = bulkText.split('\n').filter(l => l.trim().length > 0);
    const parsed: Array<Omit<VocabularyItem, 'id' | 'srsStage' | 'nextReviewDate' | 'reviewCount'>> = [];

    lines.forEach(line => {
      const parts = line.split(/[|,\t]/).map(p => p.trim());
      if (parts.length >= 2) {
        parsed.push({
          word: parts[0],
          ipa: parts[1] || '/.../',
          pos: (parts[2] as VocabularyItem['pos']) || 'noun',
          vnMeaning: parts[3] || parts[1] || 'Đang cập nhật nghĩa',
          example: parts[4] || `Example for ${parts[0]}`,
          partTag: 'Part 5, 7',
          trapNote: '',
          topic: 'Business',
        });
      }
    });

    if (parsed.length > 0) {
      bulkImportVocabulary(parsed);
      setBulkText('');
      setIsBulkModalOpen(false);
    }
  };

  // Filtered Vault list
  const filteredVault = useMemo(() => {
    return vocabulary.filter(item => {
      const matchTopic = selectedTopic === 'all' || item.topic.toLowerCase() === selectedTopic.toLowerCase();
      const matchSearch =
        item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vnMeaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.example.toLowerCase().includes(searchTerm.toLowerCase());
      return matchTopic && matchSearch;
    });
  }, [vocabulary, selectedTopic, searchTerm]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <BrainCircuit className="w-4 h-4" />
            <span>Spaced Repetition System (SRS)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Kho Từ Vựng & Luyện Flashcard (Vocabulary Vault)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Ôn tập thông minh ngắt quãng (1 - 3 - 7 - 14 - 30 ngày) chống lại đường cong quên lãng Ebbinghaus.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={() => {
                setActiveTab('flashcard');
                setIsFlipped(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'flashcard'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Flashcard 3D ({dueItems.length} đến hạn)</span>
            </button>
            <button
              onClick={() => setActiveTab('vault')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'vault'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Từ Điển ({vocabulary.length} từ)</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Thêm Từ
          </button>
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700"
            title="Import danh sách hàng loạt"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden md:inline">Nhập Hàng Loạt</span>
          </button>
        </div>
      </div>

      {/* View 1: 3D Flashcard Mode */}
      {activeTab === 'flashcard' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Flashcard Header Controls */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Chế độ ôn:
              </span>
              <button
                onClick={() => {
                  setReviewFilter('due_only');
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  reviewFilter === 'due_only'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Chỉ từ đến hạn ({dueItems.length})
              </button>
              <button
                onClick={() => {
                  setReviewFilter('all');
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  reviewFilter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Toàn bộ kho ({vocabulary.length})
              </button>
            </div>

            {flashcardQueue.length > 0 && (
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                {currentCardIndex + 1} / {flashcardQueue.length}
              </span>
            )}
          </div>

          {/* Card Presentation */}
          {flashcardQueue.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Tuyệt vời! Không còn từ vựng nào đến hạn hôm nay!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Bạn đã hoàn thành toàn bộ mục tiêu lặp lại ngắt quãng. Hãy chọn "Toàn bộ kho" nếu muốn ôn tập thêm tự do.
              </p>
              <button
                onClick={() => setReviewFilter('all')}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
              >
                Ôn Tập Toàn Bộ Kho
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* The 3D Flip Card */}
              <div
                onClick={handleFlip}
                className="perspective-1000 w-full min-h-[360px] cursor-pointer group select-none"
              >
                <div
                  className={`relative w-full min-h-[360px] transition-transform duration-500 preserve-3d rounded-3xl shadow-xl ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* FRONT SIDE */}
                  <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 dark:from-slate-900 dark:via-slate-850 dark:to-indigo-950/30 rounded-3xl p-8 border-2 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                        {currentCard.topic}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <span>SRS Cấp {currentCard.srsStage}</span>
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      </div>
                    </div>

                    {/* Word & IPA */}
                    <div className="text-center py-8 space-y-3">
                      <div className="flex items-center justify-center gap-3">
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                          {currentCard.word}
                        </h2>
                        <button
                          onClick={(e) => speakWord(currentCard.word, e)}
                          className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform"
                          title="Phát âm tiếng Anh"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-mono">
                        <span>{currentCard.ipa}</span>
                        <span>•</span>
                        <span className="italic font-semibold text-indigo-600 dark:text-indigo-400">
                          ({currentCard.pos})
                        </span>
                      </div>
                      <div className="pt-2">
                        <span className="inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          Thường gặp: {currentCard.partTag}
                        </span>
                      </div>
                    </div>

                    {/* Hint to Flip */}
                    <div className="text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1.5">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Nhấn vào thẻ để lật mặt sau</span>
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-3xl p-8 border-2 border-indigo-500/40 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs text-indigo-300">
                      <span className="font-bold">{currentCard.word} ({currentCard.pos})</span>
                      <span className="font-mono text-slate-400">Đáp án chi tiết</span>
                    </div>

                    <div className="space-y-4 my-auto py-2">
                      {/* Vietnamese Meaning */}
                      <div className="bg-indigo-900/40 p-4 rounded-2xl border border-indigo-500/30">
                        <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                          Nghĩa Tiếng Việt:
                        </span>
                        <p className="text-xl font-bold text-white leading-snug">
                          {currentCard.vnMeaning}
                        </p>
                      </div>

                      {/* Context Example */}
                      <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700/60 text-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Ví dụ ngữ cảnh ETS:
                        </span>
                        <p className="text-slate-200 italic leading-relaxed">
                          "{currentCard.example}"
                        </p>
                      </div>

                      {/* Trap Note */}
                      {currentCard.trapNote && (
                        <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-500/40 flex items-start gap-2 text-xs text-amber-200">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Bẫy & Lưu ý: </span>
                            <span>{currentCard.trapNote}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-center text-[11px] text-slate-400">
                      Đánh giá mức độ ghi nhớ của bạn bên dưới để lên lịch ôn tiếp theo
                    </div>
                  </div>
                </div>
              </div>

              {/* SRS Rating Control Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleSRSResponse('hard')}
                  className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold text-xs transition-all shadow-sm flex flex-col items-center gap-1"
                >
                  <span className="text-sm">Quên / Khó ❌</span>
                  <span className="text-[10px] font-normal text-rose-500 dark:text-rose-400">Ôn lại ngày mai (1d)</span>
                </button>

                <button
                  onClick={() => handleSRSResponse('medium')}
                  className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 hover:bg-amber-100 text-amber-700 dark:text-amber-300 font-bold text-xs transition-all shadow-sm flex flex-col items-center gap-1"
                >
                  <span className="text-sm">Nhớ vừa ⚡</span>
                  <span className="text-[10px] font-normal text-amber-500 dark:text-amber-400">Ôn lại sau 3-7 ngày</span>
                </button>

                <button
                  onClick={() => handleSRSResponse('easy')}
                  className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-xs transition-all shadow-sm flex flex-col items-center gap-1"
                >
                  <span className="text-sm">Rất dễ 🎯</span>
                  <span className="text-[10px] font-normal text-emerald-500 dark:text-emerald-400">Nhớ chắc (14-30 ngày)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View 2: Vocabulary Vault Table & Database */}
      {activeTab === 'vault' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Tìm từ vựng, nghĩa, ví dụ..."
                className="w-full text-xs pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <span className="text-xs text-slate-400 whitespace-nowrap">Chủ đề:</span>
              {topics.map(topic => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedTopic === topic
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {topic === 'all' ? 'Tất cả' : topic}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850/60 text-slate-500 dark:text-slate-400 font-semibold border-y border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Từ Vựng & IPA</th>
                  <th className="py-3 px-4">Nghĩa Tiếng Việt</th>
                  <th className="py-3 px-4">Ví Dụ Ngữ Cảnh</th>
                  <th className="py-3 px-4">Bẫy & Lưu Ý</th>
                  <th className="py-3 px-4">SRS Stage</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredVault.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Không tìm thấy từ vựng nào khớp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  filteredVault.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => speakWord(item.word)}
                            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            title="Phát âm"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <div>
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {item.word}
                            </span>
                            <span className="text-[11px] text-slate-400 italic ml-1">({item.pos})</span>
                            <div className="text-[11px] text-slate-400 font-mono">{item.ipa}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {item.vnMeaning}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 italic max-w-xs">
                        "{item.example}"
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        {item.trapNote ? (
                          <span className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/60">
                            ⚠️ {item.trapNote}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
                          Stage {item.srsStage}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => deleteVocabulary(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                          title="Xóa từ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Single Word */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Thêm Từ Vựng Mới Vào Vault
            </h3>

            <form onSubmit={handleAddWord} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Từ vựng (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={newWord}
                    onChange={e => setNewWord(e.target.value)}
                    placeholder="VD: designate"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Phiên âm IPA
                  </label>
                  <input
                    type="text"
                    value={newIpa}
                    onChange={e => setNewIpa(e.target.value)}
                    placeholder="VD: /ˈdezɪɡneɪt/"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Loại từ (POS)
                  </label>
                  <select
                    value={newPos}
                    onChange={e => setNewPos(e.target.value as VocabularyItem['pos'])}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                  >
                    <option value="noun">Noun (n)</option>
                    <option value="verb">Verb (v)</option>
                    <option value="adjective">Adjective (adj)</option>
                    <option value="adverb">Adverb (adv)</option>
                    <option value="preposition">Preposition (prep)</option>
                    <option value="conjunction">Conjunction (conj)</option>
                    <option value="phrase">Phrase</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Chủ đề (Topic)
                  </label>
                  <input
                    type="text"
                    value={newTopic}
                    onChange={e => setNewTopic(e.target.value)}
                    placeholder="Office, HR, Contract..."
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Part hay gặp
                  </label>
                  <input
                    type="text"
                    value={newPartTag}
                    onChange={e => setNewPartTag(e.target.value)}
                    placeholder="Part 5, 7"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Nghĩa Tiếng Việt
                </label>
                <input
                  type="text"
                  required
                  value={newVnMeaning}
                  onChange={e => setNewVnMeaning(e.target.value)}
                  placeholder="VD: chỉ định, bổ nhiệm làm vị trí nào đó"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Câu ví dụ thực tế (Example)
                </label>
                <textarea
                  rows={2}
                  value={newExample}
                  onChange={e => setNewExample(e.target.value)}
                  placeholder="VD: The CEO designated Mr. Harris to lead the international delegation."
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Ghi chú bẫy / Mẹo nhớ
                </label>
                <input
                  type="text"
                  value={newTrapNote}
                  onChange={e => setNewTrapNote(e.target.value)}
                  placeholder="VD: Thường đi với giới từ AS (designated as...)"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                >
                  Lưu Vào Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Bulk Import */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Nhập Từ Vựng Hàng Loạt (Bulk Import)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mỗi dòng một từ theo định dạng: <code className="text-indigo-500 font-mono">Từ | Phiên âm | Loại từ | Nghĩa | Ví dụ</code>
            </p>

            <form onSubmit={handleBulkImport} className="space-y-3">
              <textarea
                rows={8}
                value={bulkText}
                onChange={e => setBulkText(e.target.value)}
                placeholder={`collaborate | /kəˈlæbəreɪt/ | verb | hợp tác cùng nhau | We must collaborate with the vendor.
endorse | /ɪnˈdɔːs/ | verb | chứng thực, quảng bá | Celebrities endorsed the new line.`}
                className="w-full text-xs font-mono p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  Nhập Vào Kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
