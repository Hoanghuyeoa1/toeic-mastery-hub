import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TrapNote, GrammarNote } from '../../types';
import {
  ShieldAlert,
  BookOpen,
  Search,
  Filter,
  Copy,
  Check,
  AlertTriangle,
  Lightbulb,
  Crosshair,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const GrammarAndTraps: React.FC = () => {
  const { data, onTrapStudied } = useApp();
  const { trapNotes, grammarNotes } = data;

  const [activeTab, setActiveTab] = useState<'traps' | 'grammar'>('traps');
  const [selectedPart, setSelectedPart] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const parts = ['all', 'Part 1', 'Part 2', 'Part 3-4', 'Part 5', 'Part 6', 'Part 7'];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter traps
  const filteredTraps = useMemo(() => {
    return trapNotes.filter(trap => {
      const matchPart = selectedPart === 'all' || trap.part.toLowerCase().includes(selectedPart.toLowerCase());
      const matchSearch =
        trap.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trap.trapDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trap.counterStrategy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trap.exampleProblem.toLowerCase().includes(searchQuery.toLowerCase());
      return matchPart && matchSearch;
    });
  }, [trapNotes, selectedPart, searchQuery]);

  // Filter grammar
  const filteredGrammar = useMemo(() => {
    return grammarNotes.filter(item => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [grammarNotes, searchQuery]);

  const getFrequencyBadge = (freq: TrapNote['frequency']) => {
    switch (freq) {
      case 'critical':
        return {
          label: 'Bẫy Cực Kỳ Phổ Biến (80%+)',
          style: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800',
        };
      case 'high':
        return {
          label: 'Tần Suất Cao',
          style: 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        };
      default:
        return {
          label: 'Bẫy Nâng Cao',
          style: 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
        };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Kho Vũ Khí Phòng Vệ Phòng Thi</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Sổ Tay Ngữ Pháp & Bẫy Đề Thi (Cheat Sheet & Traps)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Tổng hợp toàn bộ các bẫy đề kinh điển và công thức ngữ pháp cốt lõi hay gặp nhất trong đề thi TOEIC.
          </p>
        </div>

        {/* Sub-tab toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('traps')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'traps'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Tổng Hợp Bẫy ({trapNotes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('grammar')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'grammar'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Ngữ Pháp Trọng Điểm ({grammarNotes.length})</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'traps' ? 'Tìm bẫy Part, từ khóa...' : 'Tìm công thức, thì, cấu trúc...'}
            className="w-full text-xs pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>

        {activeTab === 'traps' && (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {parts.map(part => (
              <button
                key={part}
                onClick={() => setSelectedPart(part)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedPart === part
                    ? 'bg-rose-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {part === 'all' ? 'Tất cả Part' : part}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab 1: Traps Presentation */}
      {activeTab === 'traps' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTraps.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs">
              Không tìm thấy bẫy nào khớp với tìm kiếm.
            </div>
          ) : (
            filteredTraps.map(trap => {
              const freqBadge = getFrequencyBadge(trap.frequency);
              return (
                <div
                  key={trap.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4 hover:border-rose-400/60 dark:hover:border-rose-600/60 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                        {trap.part}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${freqBadge.style}`}>
                        {freqBadge.label}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {trap.title}
                    </h3>

                    {/* Trap mechanism */}
                    <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-200 leading-relaxed space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Cơ chế gài bẫy của ETS:</span>
                      </div>
                      <p>{trap.trapDescription}</p>
                    </div>

                    {/* Counter Strategy */}
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Chiến thuật khắc chế & phản xạ:</span>
                      </div>
                      <p>{trap.counterStrategy}</p>
                    </div>

                    {/* Example Problem */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 text-xs space-y-2">
                      <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Crosshair className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Ví dụ thực chiến:</span>
                      </div>
                      <pre className="font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed text-[11px] bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                        {trap.exampleProblem}
                      </pre>
                      <p className="text-slate-600 dark:text-slate-400 italic text-[11px]">
                        👉 <strong>Giải thích:</strong> {trap.explanation}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => onTrapStudied(trap.id)}
                      className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 px-2 py-1 rounded-md transition-colors font-medium border border-emerald-200 dark:border-emerald-800/60"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Đã Nắm Vững Bẫy Này</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(`${trap.title}\n${trap.counterStrategy}`, trap.id)}
                      className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {copiedId === trap.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Chép mẹo</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Grammar Formulas Presentation */}
      {activeTab === 'grammar' && (
        <div className="space-y-4">
          {filteredGrammar.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Không tìm thấy ngữ pháp nào khớp với từ khóa tìm kiếm.
            </div>
          ) : (
            filteredGrammar.map(item => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.tags.map(t => (
                      <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Formula Highlight Banner */}
                <div className="bg-indigo-50 dark:bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-indigo-900 dark:text-indigo-200 overflow-x-auto">
                    <span className="text-indigo-600 dark:text-indigo-400 font-sans uppercase text-[10px] px-1.5 py-0.5 rounded bg-indigo-200/60 dark:bg-indigo-900">Công thức:</span>
                    <code>{item.formula}</code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(item.formula, item.id)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0"
                    title="Sao chép công thức"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Explanation */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.explanation}
                </p>

                {/* Examples */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Ví dụ câu trong đề:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {item.examples.map((ex, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-800">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span className="italic">{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Traps Callout */}
                {item.traps.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Bẫy thường gặp trong đề:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 pl-1">
                      {item.traps.map((tr, idx) => (
                        <li key={idx}>{tr}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
