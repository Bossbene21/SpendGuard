import React from 'react';
import {
  X,
  ShieldAlert,
  Brain,
  CheckCircle2,
  XCircle,
  Zap,
  Lock,
  Sliders,
  TrendingUp,
  GitCompare,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WhySpendGuardModal: React.FC = () => {
  const { isWhySpendGuardOpen, setIsWhySpendGuardOpen, setActiveTab, setSelectedAnomalyId } = useApp();

  if (!isWhySpendGuardOpen) return null;

  const comparisonPoints = [
    {
      feature: 'Core Objective',
      traditional: 'Answers "Where did my money go?" (Passive tracking)',
      spendguard: 'Answers "Is this spending normal for me & why?" (Behavioral intelligence)'
    },
    {
      feature: 'Transaction Analysis',
      traditional: 'Static entry: "₹8,750 spent at TechZone Electronics"',
      spendguard: 'Explainable verdict: "₹8,750 is 3.4× normal electronics baseline, novel merchant, score 89/100"'
    },
    {
      feature: 'Baselines',
      traditional: 'Generic fixed thresholds or hardcoded category limits',
      spendguard: 'Dynamic personal baseline computed from rolling historical distribution & velocity'
    },
    {
      feature: 'Anomaly Explainability',
      traditional: 'Opaque black box or simple binary flag: "Flagged"',
      spendguard: '8-Factor decomposition (Amount, Merchant, Category, Frequency, Time, Duplicate, Velocity, Budget)'
    },
    {
      feature: 'Duplicate & Velocity',
      traditional: 'Requires manual human reconciliation days later',
      spendguard: 'Instant duplicate charge alert (<15 mins) & rapid velocity surge detection'
    },
    {
      feature: 'Budget Forecasting',
      traditional: 'Alerts only after you have already exceeded budget',
      spendguard: 'Proactive velocity projection & What-If simulation before spending happens'
    },
    {
      feature: 'Privacy & Architecture',
      traditional: 'Requires external cloud APIs, OpenAI tokens, and sync delays',
      spendguard: 'Local-first architecture. 100% private, zero external cloud dependencies'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-[#0F172A] border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-glow-sm shadow-indigo-500/30">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">Why SpendGuard AI?</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  IEEE Hackathon Evaluator Brief
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                How our adaptive, explainable anomaly engine fundamentally differs from traditional expense trackers.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsWhySpendGuardOpen(false)}
            className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Top 3 Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 relative">
              <span className="text-2xl font-black text-indigo-400">01</span>
              <h3 className="text-sm font-bold text-white mt-1">Adaptive Personal Baseline</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Rather than comparing against generic rules, the engine calculates statistical distributions (mean, median, stdDev, merchant affinity, hourly velocity) unique to <strong>your personal history</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-500/30 relative">
              <span className="text-2xl font-black text-purple-400">02</span>
              <h3 className="text-sm font-bold text-white mt-1">Explainable Factor Decomposition</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Every flagged anomaly provides an exact 0–100 score broken down into 8 weighted factors with transparent human reasoning, confidence percentages, and clear recommended actions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 relative">
              <span className="text-2xl font-black text-cyan-400">03</span>
              <h3 className="text-sm font-bold text-white mt-1">Predictive Intelligence & Velocity</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Detects burst spending velocities within 45-minute windows, duplicate swipes, and lets users simulate "What-If" future transactions before committing budget.
              </p>
            </div>
          </div>

          {/* Side-by-Side Comparison Matrix */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <GitCompare className="w-4 h-4 text-indigo-400" />
              Side-by-Side Architectural Comparison
            </h3>

            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60">
              <div className="grid grid-cols-12 bg-slate-900 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 p-3">
                <div className="col-span-3">Dimension</div>
                <div className="col-span-4 text-rose-300">Traditional Tracker</div>
                <div className="col-span-5 text-indigo-300">SpendGuard AI</div>
              </div>

              <div className="divide-y divide-slate-800/60 text-xs">
                {comparisonPoints.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 p-3 items-center hover:bg-slate-800/30 transition-colors">
                    <div className="col-span-3 font-semibold text-slate-300 pr-2">
                      {item.feature}
                    </div>
                    <div className="col-span-4 text-slate-400 flex items-start gap-1.5 pr-2">
                      <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{item.traditional}</span>
                    </div>
                    <div className="col-span-5 text-indigo-100 flex items-start gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item.spendguard}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Try Live Demo Scenario Button */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white">Recommended Live Judge Walkthrough</div>
              <p className="text-xs text-slate-300 mt-0.5">
                Inspect the TechZone Electronics ₹8,750 anomaly or test duplicate detection in Anomaly Center.
              </p>
            </div>
            <button
              onClick={() => {
                setIsWhySpendGuardOpen(false);
                setSelectedAnomalyId('tx-anomaly-01');
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md shrink-0 transition-transform active:scale-95"
            >
              Inspect Flagship Anomaly <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setIsWhySpendGuardOpen(false)}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
          >
            Close Evaluator View
          </button>
        </div>
      </div>
    </div>
  );
};
