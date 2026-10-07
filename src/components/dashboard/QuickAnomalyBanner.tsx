import React from 'react';
import { ShieldAlert, AlertTriangle, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuickAnomalyBanner: React.FC = () => {
  const { allAnomaliesList, setSelectedAnomalyId, settings } = useApp();

  // Find the highest severity anomaly (e.g. tx-anomaly-01 or critical)
  const topAnomaly = allAnomaliesList.find(a => a.severity === 'Critical' && !a.resolved) ||
    allAnomaliesList.find(a => a.severity !== 'Normal' && !a.resolved);

  if (!topAnomaly) {
    return (
      <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">All Clear — Baseline Reconciled</h4>
            <p className="text-xs text-slate-400">All current transactions match your personal behavioral baseline.</p>
          </div>
        </div>
      </div>
    );
  }

  const tx = topAnomaly.transaction;

  return (
    <div
      onClick={() => setSelectedAnomalyId(tx.id)}
      className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-purple-950/30 to-slate-900 border border-red-500/40 shadow-glow-danger hover:border-red-400 transition-all cursor-pointer group"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0 shadow-sm animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 tracking-wide">
                FLAGSHIP ANOMALY • {topAnomaly.severity.toUpperCase()} ({topAnomaly.score}/100)
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <h4 className="text-sm font-bold text-white group-hover:text-red-200 transition-colors">
                {tx.merchant}
              </h4>
              <span className="text-sm font-mono font-extrabold text-red-400">
                {settings.currencySymbol}{tx.amount.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">
                ({tx.category})
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{topAnomaly.reasons[0]}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-200">
              Confidence: {topAnomaly.confidence}%
            </div>
            <div className="text-[11px] text-slate-400">
              6 contributing signals
            </div>
          </div>

          <button className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all group-hover:translate-x-0.5">
            <span>Explain Anomaly</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
