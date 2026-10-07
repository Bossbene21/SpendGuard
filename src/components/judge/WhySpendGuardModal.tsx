import React from 'react';
import {
  X,
  Award,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Brain,
  Sliders,
  Play,
  ArrowRight,
  Zap,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WhySpendGuardModal: React.FC = () => {
  const {
    isWhySpendGuardOpen,
    setIsWhySpendGuardOpen,
    setActiveTab,
    setSelectedAnomalyId,
    setIsAddModalOpen
  } = useApp();

  if (!isWhySpendGuardOpen) return null;

  const startDemoTour = (step: number) => {
    setIsWhySpendGuardOpen(false);
    if (step === 1) {
      setActiveTab('dashboard');
    } else if (step === 2) {
      setActiveTab('anomalies');
    } else if (step === 3) {
      setSelectedAnomalyId('tx-anomaly-01'); // Flagship TechZone Anomaly
    } else if (step === 4) {
      setIsAddModalOpen(true);
    } else if (step === 5) {
      setActiveTab('whatif');
    } else if (step === 6) {
      setActiveTab('insights');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#101726] border border-indigo-500/40 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-950/80 via-[#101726] to-purple-950/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-glow-sm shadow-indigo-500/40 text-xl font-bold">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">WHY SPENDGUARD AI?</h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full">
                  IEEE Hackathon Evaluator Deck
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Beyond traditional expense trackers: Adaptive baselines & explainable factor decomposition
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsWhySpendGuardOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Core Paradigm Shift Comparison */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#141E33] border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              The Fundamental Paradigm Shift
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Traditional Expense Tracker</span>
                <p className="text-slate-300 font-medium">"₹8,750 spent at TechZone."</p>
                <p className="text-slate-400 text-[11px]">Answers only: <em>Where did my money go?</em></p>
                <div className="text-[11px] text-slate-500">❌ No behavioral context. No merchant novelty checks. Blind to velocity bursts.</div>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 space-y-2">
                <span className="font-bold text-indigo-400 uppercase text-[10px]">SPENDGUARD AI</span>
                <p className="text-white font-bold">
                  "₹8,750 is 3.4× above your normal Electronics average, from a new merchant, creating an 89/100 anomaly score."
                </p>
                <p className="text-indigo-200 text-[11px]">Answers: <em>Is this spending normal for me? Why is it unusual? What should I do?</em></p>
                <div className="text-[11px] text-emerald-400 font-medium">✓ Transparent 7-factor mathematical decomposition with clear actionable guidance.</div>
              </div>
            </div>
          </div>

          {/* 3 Core Architectural Pillars */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Three Major Technological Differentiators
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h4 className="text-xs font-bold text-white">Personal Behavioral Baseline</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Calculates user-specific median, standard deviation, and hourly velocity for each category instead of rigid global rulebooks.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h4 className="text-xs font-bold text-white">Explainable AI (XAI) Scoring</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Decomposes risk across 7 weighted signals: Amount (30), Merchant Novelty (15), Category Spike (15), Time (10), Velocity (10), and Duplicates (10).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h4 className="text-xs font-bold text-white">Predictive Intelligence</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Interactive "What-If?" simulator stress-tests hypothetical expenses and projects future budget overruns before money leaves the pocket.
                </p>
              </div>
            </div>
          </div>

          {/* Guided 2-Minute Judging Walkthrough */}
          <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  2-Minute Live Judging Walkthrough Scenario
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Click any step to jump live</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {[
                { step: 1, title: 'Step 1: Dashboard Overview', desc: 'See KPI cards & October cumulative spending trajectory' },
                { step: 2, title: 'Step 2: Anomaly Center', desc: 'Review 7 detected anomalies filtered by risk severity' },
                { step: 3, title: 'Step 3: Flagship Analysis (₹8,750)', desc: 'Inspect 89/100 score & 7-signal bar decomposition' },
                { step: 4, title: 'Step 4: Real-Time Add Expense', desc: 'Test live anomaly scoring with 1-tap demo presets' },
                { step: 5, title: 'Step 5: "What-If?" Simulation', desc: 'Forecast budget strain for ₹5,000 shopping expense' },
                { step: 6, title: 'Step 6: Deterministic AI Insights', desc: 'View weekend spend premium & burn-rate warnings' }
              ].map(item => (
                <button
                  key={item.step}
                  onClick={() => startDemoTour(item.step)}
                  className="p-3 rounded-xl bg-slate-900/80 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-indigo-400 group-hover:text-indigo-300">
                      {item.title}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
                  </div>
                  <div className="mt-2 flex items-center text-[10px] font-semibold text-slate-500 group-hover:text-white">
                    <span>Launch</span> <ChevronRight className="w-3 h-3 ml-0.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Local prototype • No cloud dependencies • Instant offline evaluation</span>
          </div>
          <button
            onClick={() => setIsWhySpendGuardOpen(false)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors"
          >
            Got It, Back to App
          </button>
        </div>
      </div>
    </div>
  );
};
