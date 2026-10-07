import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ShieldAlert, Receipt, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    transactions,
    anomalies,
    setSelectedAnomalyId,
    setActiveTab,
    settings
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  // Keyboard shortcut listener for Cmd/Ctrl+K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const cleanQ = query.trim().toLowerCase();

  const filtered = cleanQ
    ? transactions.filter(t => {
        const anomaly = anomalies[t.id];
        return (
          t.merchant.toLowerCase().includes(cleanQ) ||
          t.category.toLowerCase().includes(cleanQ) ||
          t.description.toLowerCase().includes(cleanQ) ||
          t.amount.toString().includes(cleanQ) ||
          (anomaly && anomaly.reasons.some(r => r.toLowerCase().includes(cleanQ))) ||
          (anomaly && anomaly.primaryReason.toLowerCase().includes(cleanQ))
        );
      }).slice(0, 8)
    : transactions.slice(0, 6);

  const handleSelect = (txId: string) => {
    const anomaly = anomalies[txId];
    if (anomaly && anomaly.severity !== 'Normal') {
      setSelectedAnomalyId(txId);
    } else {
      setActiveTab('transactions');
    }
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#111827] border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search merchants, amounts, categories, or anomaly reasons..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded border border-slate-700 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-2 max-h-96 overflow-y-auto space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {cleanQ ? `Matching Transactions (${filtered.length})` : 'Recent Transactions'}
          </div>

          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No matching transactions or anomalies found for "{query}".
            </div>
          ) : (
            filtered.map(t => {
              const anomaly = anomalies[t.id];
              const isFlagged = anomaly && anomaly.severity !== 'Normal';

              return (
                <button
                  key={t.id}
                  onClick={() => handleSelect(t.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/80 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isFlagged
                        ? anomaly.severity === 'Critical'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {isFlagged ? <ShieldAlert className="w-4 h-4" /> : <Receipt className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                          {t.merchant}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {t.category}
                        </span>
                        {isFlagged && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            anomaly.severity === 'Critical'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            Score {anomaly.score} • {anomaly.severity}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate max-w-md mt-0.5">
                        {isFlagged ? anomaly.primaryReason : t.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-200">
                      {settings.currencySymbol}{t.amount.toLocaleString()}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Navigate with mouse or click item to open analysis</span>
          <span className="flex items-center gap-2">
            <span>SpendGuard Intelligent Lookup</span>
          </span>
        </div>
      </div>
    </div>
  );
};
