import React from 'react';
import {
  Search,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    allAnomaliesList,
    settings,
    updateSettings,
    setIsAddModalOpen,
    setIsSearchOpen,
    setIsWhySpendGuardOpen
  } = useApp();

  const unresolved = allAnomaliesList.filter(a => a.severity !== 'Normal' && !a.resolved);
  const critical = unresolved.filter(a => a.severity === 'Critical').length;
  const suspicious = unresolved.filter(a => a.severity === 'Suspicious').length;

  const cycleSensitivity = () => {
    const next: Record<string, 'Low' | 'Medium' | 'High'> = {
      Low: 'Medium',
      Medium: 'High',
      High: 'Low'
    };
    updateSettings({ sensitivity: next[settings.sensitivity] });
  };

  return (
    <header className="h-16 bg-[#0E1526]/80 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Global Search trigger */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 bg-[#141E33] hover:bg-[#1A2640] border border-slate-800 hover:border-slate-700 text-slate-400 text-xs rounded-xl transition-all shadow-inner group"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400" />
          <span className="flex-1 text-left">Search transactions, merchants, reasons...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded border border-slate-700 font-mono">⌘K</kbd>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Local Privacy Assurance */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/40 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Local Engine (Zero Cloud APIs)</span>
        </div>

        {/* Adaptive Sensitivity Selector */}
        <button
          onClick={cycleSensitivity}
          title="Click to toggle sensitivity calibration (Low / Medium / High)"
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 rounded-lg text-xs font-medium text-slate-200 transition-all"
        >
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <span>Sensitivity:</span>
          <span className={`font-semibold px-1.5 py-0.2 rounded text-[11px] ${
            settings.sensitivity === 'High'
              ? 'bg-rose-500/20 text-rose-300'
              : settings.sensitivity === 'Medium'
              ? 'bg-indigo-500/20 text-indigo-300'
              : 'bg-emerald-500/20 text-emerald-300'
          }`}>
            {settings.sensitivity}
          </span>
        </button>

        {/* Anomaly Health Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          {unresolved.length > 0 ? (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span className="text-slate-300 font-medium">
                {unresolved.length} flagged ({critical} Critical)
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>All clear</span>
            </div>
          )}
        </div>

        {/* New Expense Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold rounded-xl shadow-glow-sm shadow-indigo-500/25 transition-all transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Expense</span>
        </button>

        {/* Judge Tour helper icon */}
        <button
          onClick={() => setIsWhySpendGuardOpen(true)}
          title="IEEE Hackathon Evaluator Overview"
          className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700 rounded-lg transition-all"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
