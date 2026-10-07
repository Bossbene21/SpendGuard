import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  AlertTriangle,
  Wallet,
  Calendar,
  Sparkles,
  ArrowRight,
  Eye,
  Sliders,
  CheckCircle2,
  PieChart,
  HelpCircle,
  Play,
  RotateCcw,
  Zap,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Dashboard: React.FC = () => {
  const {
    transactions,
    budgets,
    settings,
    allAnomaliesList,
    setActiveTab,
    setSelectedAnomalyId,
    setIsAddModalOpen,
    setIsWhySpendGuardOpen,
    loadDemoData
  } = useApp();

  // Metrics computation
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const monthlyBudget = settings.overallMonthlyBudget || 60000;
  const remainingBudget = Math.max(0, monthlyBudget - totalSpent);
  const budgetUtilization = Math.round((totalSpent / monthlyBudget) * 100);

  const unresolvedAnomalies = allAnomaliesList.filter(a => a.severity !== 'Normal' && !a.resolved);
  const criticalCount = unresolvedAnomalies.filter(a => a.severity === 'Critical').length;
  const suspiciousCount = unresolvedAnomalies.filter(a => a.severity === 'Suspicious').length;

  let overallRisk = 'Low';
  if (criticalCount > 0 || unresolvedAnomalies.length >= 5) overallRisk = 'Elevated';
  else if (suspiciousCount > 0 || unresolvedAnomalies.length >= 2) overallRisk = 'Moderate';

  // Category breakdown calculation
  const categoryTotals: Record<string, number> = {};
  transactions.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  // Demo step highlight tracker for live judges
  const [demoStep, setDemoStep] = useState(1);

  // Spending trend simulation data for October (Current vs Previous)
  const trendDays = [
    { day: 'Oct 1', current: 1200, prev: 950, budgetLimit: 2000 },
    { day: 'Oct 2', current: 2850, prev: 2100, budgetLimit: 4000 },
    { day: 'Oct 3', current: 9349, prev: 3500, budgetLimit: 6000 }, // Amazon spike
    { day: 'Oct 4', current: 11200, prev: 5200, budgetLimit: 8000 },
    { day: 'Oct 5', current: 17800, prev: 6800, budgetLimit: 10000 }, // Royal Bistro ₹4,500
    { day: 'Oct 6', current: 24500, prev: 8900, budgetLimit: 12000 }, // Starbucks duplicate & transit
    { day: 'Oct 7', current: 42680, prev: 11200, budgetLimit: 14000 } // TechZone Electronics ₹8,750 spike
  ];

  const maxTrend = 46000;

  return (
    <div className="space-y-6">
      {/* Welcome & Hackathon Quick Pitch Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Welcome back, {settings.userName.split(' ')[0]}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Personal Baseline Active
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Here's your explainable financial intelligence overview. All transactions analyzed locally.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsWhySpendGuardOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 hover:from-purple-800/70 hover:to-indigo-800/70 text-indigo-200 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            Hackathon Judge Pitch
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-glow-sm shadow-indigo-500/25"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Test New Expense
          </button>
        </div>
      </div>

      {/* Guided 2-Minute Judge Walkthrough Ribbon */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-[#111827] border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-black text-sm">
            🎯
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>IEEE Judge Demonstration Path (2-Minute Walkthrough)</span>
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono rounded">
                Live Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              1. Review Executive KPI overview &nbsp;➔&nbsp; 2. Inspect TechZone Electronics anomaly &nbsp;➔&nbsp; 3. Add expense to trigger live evaluation &nbsp;➔&nbsp; 4. Test What-If simulator.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <button
            onClick={() => {
              setActiveTab('anomalies');
              setSelectedAnomalyId('tx-anomaly-01');
            }}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-transform active:scale-95 flex items-center gap-1"
          >
            Go to Anomaly Demo <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 6 Executive KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Spending */}
        <div className="bg-[#111827] border border-slate-800 p-4 rounded-2xl">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
            Total Spending
          </span>
          <div className="text-xl font-bold text-white mt-1">
            {settings.currencySymbol}{totalSpent.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {transactions.length} total transactions
          </span>
        </div>

        {/* Monthly Budget */}
        <div className="bg-[#111827] border border-slate-800 p-4 rounded-2xl">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
            Monthly Budget
          </span>
          <div className="text-xl font-bold text-slate-200 mt-1">
            {settings.currencySymbol}{monthlyBudget.toLocaleString()}
          </div>
          <span className="text-[10px] text-indigo-400 mt-1 block">
            {budgetUtilization}% utilized
          </span>
        </div>

        {/* Remaining */}
        <div className="bg-[#111827] border border-slate-800 p-4 rounded-2xl">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
            Remaining
          </span>
          <div className={`text-xl font-bold mt-1 ${remainingBudget > 5000 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {settings.currencySymbol}{remainingBudget.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Available reserve</span>
        </div>

        {/* Anomalies Detected */}
        <div
          onClick={() => setActiveTab('anomalies')}
          className="bg-[#111827] border border-slate-800 hover:border-red-500/40 p-4 rounded-2xl cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Anomalies
            </span>
            {unresolvedAnomalies.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
          </div>
          <div className="text-xl font-bold text-red-400 mt-1 group-hover:text-red-300">
            {unresolvedAnomalies.length}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {criticalCount} critical alerts
          </span>
        </div>

        {/* Risk Level */}
        <div className="bg-[#111827] border border-slate-800 p-4 rounded-2xl">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
            Risk Level
          </span>
          <div className={`text-xl font-bold mt-1 ${
            overallRisk === 'Elevated' ? 'text-red-400' : overallRisk === 'Moderate' ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {overallRisk}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Based on deviation</span>
        </div>

        {/* Savings Trend */}
        <div className="bg-[#111827] border border-slate-800 p-4 rounded-2xl">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
            Savings Trend
          </span>
          <div className="text-xl font-bold text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>+12.4%</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Vs last cycle</span>
        </div>
      </div>

      {/* Main Row: Spending Trend Chart & Category Spending Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Trend Line Chart (SVG Interactive) */}
        <div className="lg:col-span-2 bg-[#111827] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  Monthly Spending Trajectory
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cumulative October spend vs previous month baseline & budget ceiling
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="text-slate-300 font-medium">October (Current)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  <span className="text-slate-400">September</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-rose-500" />
                  <span className="text-rose-400">Trajectory Spike</span>
                </div>
              </div>
            </div>

            {/* SVG Trajectory Chart */}
            <div className="h-56 w-full pt-4 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Gridlines */}
                {[0, 45, 90, 135].map((y, i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={y}
                    x2="500"
                    y2={y}
                    stroke="#1E293B"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                ))}

                {/* Previous month baseline curve (Smooth grey) */}
                <path
                  d="M 10 160 Q 90 145, 170 135 T 330 110 T 490 85"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />

                {/* Current Month Area & Line */}
                <path
                  d="M 10 170 L 90 155 L 170 120 L 250 100 L 330 65 L 410 45 L 490 15 L 490 180 L 10 180 Z"
                  fill="url(#currentGradient)"
                />
                <path
                  d="M 10 170 L 90 155 L 170 120 L 250 100 L 330 65 L 410 45 L 490 15"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="3.5"
                />

                {/* Data Points */}
                {[
                  { x: 10, y: 170, label: 'Oct 1' },
                  { x: 90, y: 155, label: 'Oct 2' },
                  { x: 170, y: 120, label: 'Oct 3' },
                  { x: 250, y: 100, label: 'Oct 4' },
                  { x: 330, y: 65, label: 'Oct 5' },
                  { x: 410, y: 45, label: 'Oct 6' },
                  { x: 490, y: 15, label: 'Oct 7 (Spike)' }
                ].map((pt, i) => (
                  <g key={i}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={i === 6 ? 6 : 4}
                      fill={i === 6 ? '#EF4444' : '#6366F1'}
                      stroke="#0F172A"
                      strokeWidth="2"
                      className="cursor-pointer transition-transform hover:scale-150"
                    />
                    {i === 6 && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="10"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="1.5"
                        className="animate-ping"
                      />
                    )}
                  </g>
                ))}
              </svg>

              {/* Anomaly Callout Bubble pointing at Oct 7 */}
              <div className="absolute right-0 top-0 bg-red-950/90 border border-red-500/50 rounded-xl p-2.5 text-[11px] shadow-lg max-w-[210px]">
                <div className="flex items-center gap-1 font-bold text-red-400">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Velocity Surge Detected</span>
                </div>
                <p className="text-slate-300 mt-0.5">
                  Oct 7 surge driven by ₹8,750 Electronics charge (3.4× normal baseline).
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Projection: Month-end estimate at ₹48,200</span>
            <span className="text-indigo-400 font-semibold cursor-pointer hover:underline" onClick={() => setActiveTab('analytics')}>
              View full analytics breakdown →
            </span>
          </div>
        </div>

        {/* Category Spending Visualization */}
        <div className="bg-[#111827] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-indigo-400" />
                Category Allocation
              </h3>
              <span className="text-xs text-slate-400">Month-to-Date</span>
            </div>

            <div className="space-y-3 mt-3">
              {sortedCategories.slice(0, 6).map(([cat, amt]) => {
                const budgetObj = budgets[cat];
                const limit = budgetObj?.limit || 8000;
                const pct = Math.min(100, Math.round((amt / limit) * 100));
                const isOver = amt > limit;

                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-200">{cat}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100">
                          {settings.currencySymbol}{amt.toLocaleString()}
                        </span>
                        <span className={`text-[10px] font-semibold ${isOver ? 'text-red-400' : 'text-slate-400'}`}>
                          / {settings.currencySymbol}{limit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOver ? 'bg-red-500' : pct > 80 ? 'bg-amber-400' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('budgets')}
            className="w-full mt-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors text-center"
          >
            Manage Category Budgets
          </button>
        </div>
      </div>

      {/* AI Insights & Unresolved Anomalies Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic AI Insights Panel */}
        <div className="bg-[#111827] border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">AI Behavioral Insights</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Deterministic Engine
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
              <span className="text-lg">🛍️</span>
              <div>
                <span className="text-xs font-bold text-slate-200 block">Shopping & Tech Surge</span>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Shopping and electronics spending is <strong>31% higher</strong> than your personal baseline for this week of the month.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/20 flex items-start gap-3">
              <span className="text-lg">🚨</span>
              <div>
                <span className="text-xs font-bold text-red-300 block">Attention Required</span>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  <strong>{unresolvedAnomalies.length} transactions</strong> have risk characteristics significantly outside your normal envelope (including an identical duplicate charge).
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
              <span className="text-lg">📅</span>
              <div>
                <span className="text-xs font-bold text-slate-200 block">Weekend Velocity Shift</span>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Your weekend discretionary outflow is <strong>22% higher</strong> than weekday spending for the third consecutive week.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
              <span className="text-lg">📊</span>
              <div>
                <span className="text-xs font-bold text-slate-200 block">Budget Consumption</span>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  You have utilized <strong>{budgetUtilization}%</strong> of your monthly allocation in 7 days. At this pace, you may exceed your envelope by ₹4,200.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Flagged Transactions Review Panel */}
        <div className="bg-[#111827] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-bold text-white">Actionable Anomaly Queue</h3>
              </div>
              <button
                onClick={() => setActiveTab('anomalies')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                View all ({allAnomaliesList.length}) →
              </button>
            </div>

            <div className="space-y-2.5">
              {unresolvedAnomalies.slice(0, 4).map(item => {
                const tx = item.transaction;
                return (
                  <div
                    key={tx.id}
                    onClick={() => setSelectedAnomalyId(tx.id)}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex items-center justify-between cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        item.severity === 'Critical'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}>
                        {item.score}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">
                            {tx.merchant}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                            {tx.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                          {item.primaryReason}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-white">
                        {settings.currencySymbol}{tx.amount.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-indigo-400 group-hover:underline flex items-center justify-end gap-1 mt-0.5">
                        Explain <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Resolved items automatically calibrate future baselines
            </span>
            <button
              onClick={() => setActiveTab('anomalies')}
              className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold"
            >
              Open Anomaly Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
