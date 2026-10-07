import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  UserCheck,
  RotateCcw,
  Clock,
  Copy,
  Zap,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { AnomalyResult, Transaction, CategoryBaseline } from '../../types';
import { useApp } from '../../context/AppContext';

interface Props {
  anomaly: AnomalyResult;
  transaction: Transaction;
  baseline?: CategoryBaseline;
  onClose?: () => void;
  compact?: boolean;
}

export const AnomalyExplanationCard: React.FC<Props> = ({
  anomaly,
  transaction,
  baseline,
  onClose,
  compact = false
}) => {
  const { resolveAnomaly, settings, setActiveTab, setSelectedAnomalyId } = useApp();

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return {
          bg: 'bg-red-500/20 text-red-400 border-red-500/40',
          indicator: 'bg-red-500',
          glow: 'shadow-glow-danger'
        };
      case 'Suspicious':
        return {
          bg: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
          indicator: 'bg-orange-500',
          glow: 'shadow-[0_0_20px_-3px_rgba(249,115,22,0.3)]'
        };
      case 'Watch':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          indicator: 'bg-amber-400',
          glow: 'shadow-[0_0_20px_-3px_rgba(245,158,11,0.25)]'
        };
      default:
        return {
          bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
          indicator: 'bg-emerald-400',
          glow: ''
        };
    }
  };

  const badgeStyle = getSeverityBadge(anomaly.severity);

  const factorList = [
    { key: 'amount', factor: anomaly.factors.amount, icon: TrendingUp },
    { key: 'merchant', factor: anomaly.factors.merchant, icon: UserCheck },
    { key: 'category', factor: anomaly.factors.category, icon: Sparkles },
    { key: 'frequency', factor: anomaly.factors.frequency, icon: Clock },
    { key: 'time', factor: anomaly.factors.time, icon: Clock },
    { key: 'duplicate', factor: anomaly.factors.duplicate, icon: Copy },
    { key: 'velocity', factor: anomaly.factors.velocity, icon: Zap },
    { key: 'budgetImpact', factor: anomaly.factors.budgetImpact, icon: Info }
  ];

  return (
    <div className={`bg-[#0F172A] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all ${badgeStyle.glow}`}>
      {/* Header Bar */}
      <div className="p-5 border-b border-slate-800 bg-slate-900/60 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border ${badgeStyle.bg}`}>
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-white tracking-tight">{transaction.merchant}</h3>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${badgeStyle.bg}`}>
                {anomaly.severity.toUpperCase()}
              </span>
              {anomaly.resolved && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Resolved ({anomaly.resolutionType?.replace('_', ' ') || 'Resolved'})
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span>{transaction.category}</span>
              <span>•</span>
              <span>{new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              <span>•</span>
              <span>{transaction.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Big Score Card */}
        <div className="text-right shrink-0 bg-[#0A0E1A] px-4 py-2.5 rounded-xl border border-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Anomaly Score</div>
          <div className="flex items-baseline justify-end gap-1">
            <span className={`text-2xl font-black ${
              anomaly.score >= 75 ? 'text-red-400' : anomaly.score >= 55 ? 'text-orange-400' : anomaly.score >= 35 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {anomaly.score}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="text-[10px] text-indigo-300 font-medium">Confidence: {anomaly.confidence}%</div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Flagship Amount vs Baseline highlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-[#131D31] p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Transaction Amount</span>
            <span className="text-xl font-bold text-white mt-0.5 block">
              {settings.currencySymbol}{transaction.amount.toLocaleString()}
            </span>
          </div>
          <div className="bg-[#131D31] p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Personal {transaction.category} Avg</span>
            <span className="text-xl font-bold text-slate-200 mt-0.5 block">
              {settings.currencySymbol}{(baseline?.avgAmount || 500).toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Calculated from history</span>
          </div>
          <div className="bg-[#131D31] p-3.5 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Deviation Multiple</span>
            <span className={`text-xl font-bold mt-0.5 block ${
              baseline?.avgAmount && transaction.amount / baseline.avgAmount >= 3 ? 'text-red-400' : 'text-indigo-300'
            }`}>
              {baseline?.avgAmount ? (transaction.amount / baseline.avgAmount).toFixed(1) : '1.0'}×
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Relative to your normal ticket</span>
          </div>
        </div>

        {/* Why was this flagged? (The explainability section) */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Why was this flagged?
            </h4>
          </div>
          <div className="space-y-2">
            {anomaly.reasons.length > 0 ? (
              anomaly.reasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200"
                >
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{reason}</span>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300">
                Transaction matches your established spending habits across all risk metrics.
              </div>
            )}
          </div>
        </div>

        {/* Contributing Factor Decomposition (Bar breakdown 0-30, 0-15, etc.) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Multi-Factor Decomposition
              </h4>
            </div>
            <span className="text-[11px] text-slate-400">Total: {anomaly.score}/100</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {factorList.map(({ key, factor, icon: Icon }) => {
              const pct = (factor.score / factor.maxScore) * 100;
              return (
                <div key={key} className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-1.5 font-medium text-slate-300">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{factor.name}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400 font-semibold">
                      {factor.score} / {factor.maxScore}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct > 70
                          ? 'bg-red-500'
                          : pct > 40
                          ? 'bg-orange-400'
                          : pct > 15
                          ? 'bg-amber-400'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(4, pct)}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {factor.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended Action & Why This Matters */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-500/20">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                Recommended Action
              </div>
              <p className="text-xs text-slate-200 mt-1 font-medium leading-relaxed">
                "{anomaly.recommendedAction}"
              </p>
              <div className="mt-2.5 pt-2 border-t border-indigo-500/20 text-[11px] text-slate-400">
                <span className="font-semibold text-indigo-200">Why this matters:</span> This transaction is not necessarily fraudulent. SpendGuard AI detects deviation from your personal behavioral baseline to ensure your awareness and budget safety.
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => resolveAnomaly(transaction.id, 'marked_normal')}
              className="px-3.5 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Mark as Normal
            </button>
            <button
              onClick={() => resolveAnomaly(transaction.id, 'trusted_merchant')}
              className="px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Add Merchant to Trusted
            </button>
            <button
              onClick={() => resolveAnomaly(transaction.id, 'confirmed_flag')}
              className="px-3.5 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Keep Flagged
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('transactions');
                if (onClose) onClose();
              }}
              className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View in Transactions
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
