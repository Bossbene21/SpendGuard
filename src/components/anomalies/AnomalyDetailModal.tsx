import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  Building,
  CreditCard,
  Calendar,
  Share2,
  BookmarkCheck,
  ChevronRight,
  ListFilter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FactorProgressBar } from './FactorProgressBar';

export const AnomalyDetailModal: React.FC = () => {
  const {
    selectedAnomalyId,
    setSelectedAnomalyId,
    transactions,
    anomalies,
    resolveAnomaly,
    settings,
    setActiveTab
  } = useApp();

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  if (!selectedAnomalyId) return null;

  const tx = transactions.find(t => t.id === selectedAnomalyId);
  const anomaly = anomalies[selectedAnomalyId];

  if (!tx || !anomaly) return null;

  const handleResolve = (type: 'marked_normal' | 'trusted_merchant' | 'confirmed_flag') => {
    resolveAnomaly(tx.id, type);
    if (type === 'marked_normal') {
      setNotificationMsg('Resolved: Transaction marked as normal. Recalibrating baseline...');
    } else if (type === 'trusted_merchant') {
      setNotificationMsg(`Success: "${tx.merchant}" added to Trusted Merchants list.`);
    } else {
      setNotificationMsg('Flag confirmed: Kept under active monitoring.');
    }

    setTimeout(() => {
      setNotificationMsg(null);
    }, 2500);
  };

  const handleViewSimilar = () => {
    setSelectedAnomalyId(null);
    setActiveTab('transactions');
  };

  const severityColor = {
    Critical: 'text-red-400 bg-red-500/10 border-red-500/30',
    Suspicious: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    Watch: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    Normal: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  }[anomaly.severity];

  const factorsList = Object.values(anomaly.factors);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#101726] border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#101726]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              anomaly.severity === 'Critical'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : anomaly.severity === 'Suspicious'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-tight">TRANSACTION ANALYSIS</h2>
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${severityColor}`}>
                  {anomaly.severity.toUpperCase()}
                </span>
                {anomaly.resolved && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Resolved
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Explainable behavioral factor decomposition & recommendations
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedAnomalyId(null)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification feedback */}
        {notificationMsg && (
          <div className="px-5 py-2.5 bg-emerald-950/60 border-b border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Top Section: Overview card & Score gauge */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Transaction summary card */}
            <div className="md:col-span-2 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Transaction Metadata
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <h3 className="text-xl font-extrabold text-white">{tx.merchant}</h3>
                  <div className="text-2xl font-black text-rose-400 font-mono">
                    {settings.currencySymbol}{tx.amount.toLocaleString()}
                  </div>
                </div>
                <p className="text-xs text-slate-300 mt-1">{tx.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 mt-4 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Category</span>
                  <span className="font-semibold text-slate-200 mt-0.5 inline-block px-2 py-0.5 bg-slate-800 rounded">
                    {tx.category}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Date & Time</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block font-mono text-[11px]">
                    {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Payment Method</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">
                    {tx.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* Score & Confidence Gauge Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#131D33] to-[#0D1322] border border-slate-800 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Composite Anomaly Score
              </span>

              <div className="my-2 relative flex items-center justify-center">
                <div className="text-4xl font-black font-mono tracking-tight text-rose-400">
                  {anomaly.score}
                </div>
                <span className="text-xs text-slate-400 ml-1 font-mono">/100</span>
              </div>

              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full ${
                    anomaly.score >= 75 ? 'bg-rose-500' : anomaly.score >= 50 ? 'bg-orange-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${anomaly.score}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between w-full text-xs px-2 pt-2 border-t border-slate-800 text-slate-400">
                <span>Model Confidence</span>
                <span className="font-mono font-bold text-indigo-300">{anomaly.confidence}%</span>
              </div>
            </div>
          </div>

          {/* Core explainability section: WHY WAS THIS FLAGGED? */}
          <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                WHY WAS THIS FLAGGED?
              </h3>
            </div>

            <div className="space-y-2.5">
              {anomaly.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 font-bold text-[11px] border border-red-500/30">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed font-medium mt-0.5">{reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual breakdown of contributing factors */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  SIGNAL DECOMPOSITION BREAKDOWN
                </h3>
                <p className="text-[11px] text-slate-400">
                  Multi-signal weighted evaluation across baseline deviations
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Max Sum: 100 pts
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {factorsList.map(factor => (
                <FactorProgressBar key={factor.name} factor={factor} />
              ))}
            </div>
          </div>

          {/* Crucial Distinguisher: WHY THIS MATTERS */}
          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/25 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <h4 className="font-bold text-blue-300 uppercase tracking-wide text-[11px]">
                WHY THIS MATTERS (ANOMALY VS. FRAUD)
              </h4>
              <p className="leading-relaxed">
                This transaction is not necessarily fraudulent. It is unusual compared with your personal spending behavior. SpendGuard flags behavioral divergences so you maintain financial discipline and catch accidental charges early.
              </p>
            </div>
          </div>

          {/* RECOMMENDED ACTION */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <BookmarkCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                RECOMMENDED ACTION
              </h4>
              <p className="text-xs text-slate-200 font-medium mt-1">
                "{anomaly.recommendedAction}"
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleResolve('marked_normal')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark as Normal</span>
              </button>

              <button
                onClick={() => handleResolve('trusted_merchant')}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <Building className="w-3.5 h-3.5" />
                <span>Add Merchant to Trusted</span>
              </button>

              <button
                onClick={() => handleResolve('confirmed_flag')}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 transition-all"
              >
                Keep Flagged
              </button>
            </div>

            <button
              onClick={handleViewSimilar}
              className="px-3.5 py-2 text-indigo-400 hover:text-indigo-300 text-xs font-medium flex items-center gap-1"
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>View Similar Transactions</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
