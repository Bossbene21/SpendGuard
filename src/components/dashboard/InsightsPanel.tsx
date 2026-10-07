import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Compass, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const InsightsPanel: React.FC = () => {
  const { allAnomaliesList, setActiveTab, transactions } = useApp();

  const unresolved = allAnomaliesList.filter(a => a.severity !== 'Normal' && !a.resolved);
  const critical = unresolved.filter(a => a.severity === 'Critical');

  const insights = [
    {
      category: 'CATEGORY DEVIATION',
      title: 'Shopping spending is 31% higher than your normal pattern',
      detail: 'Recent large purchases at Aura Luxury Apparel and Amazon pushed shopping outflow 1.4× above monthly baseline.',
      type: 'warning',
      action: () => setActiveTab('budgets')
    },
    {
      category: 'ATTENTION REQUIRED',
      title: `${unresolved.length} transactions require your review`,
      detail: `${critical.length} marked as Critical risk. TechZone Electronics (₹8,750) has an 89/100 anomaly score.`,
      type: 'danger',
      action: () => setActiveTab('anomalies')
    },
    {
      category: 'BEHAVIORAL CADENCE',
      title: 'Your weekend spending has increased for the third consecutive week',
      detail: 'Saturday and Sunday expenses represent 44% of weekly discretionary capital, up from historical 28%.',
      type: 'info',
      action: () => setActiveTab('analytics')
    },
    {
      category: 'BUDGET VELOCITY',
      title: "You're currently utilizing 71% of your monthly budget (Day 7)",
      detail: 'Projected monthly total will reach ₹64,200 if current spending velocity continues unchecked.',
      type: 'prediction',
      action: () => setActiveTab('whatif')
    }
  ];

  return (
    <div className="p-5 rounded-2xl bg-[#111827]/80 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Explainable AI Insights
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Deterministic Engine
              </span>
            </h3>
            <p className="text-xs text-slate-400">Continuous behavioral analysis without external cloud calls</p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('insights')}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
        >
          All 7 Insights <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {insights.map((ins, i) => (
          <div
            key={i}
            onClick={ins.action}
            className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/90 hover:border-slate-700 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-indigo-400">
                  {ins.category}
                </span>
                {ins.type === 'danger' && (
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                )}
              </div>
              <h4 className="text-xs font-bold text-slate-200 group-hover:text-white leading-snug">
                {ins.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                {ins.detail}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 group-hover:text-indigo-300">
              <span>View breakdown</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
