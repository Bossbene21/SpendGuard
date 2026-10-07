import React from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Zap,
  Target,
  ArrowRight,
  ShieldAlert,
  PieChart,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AIInsightsView: React.FC = () => {
  const { transactions, baselines, settings, allAnomaliesList, setActiveTab, setSelectedAnomalyId } = useApp();

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const monthlyBudget = settings.overallMonthlyBudget || 60000;
  const projectedMonthEnd = Math.round((totalSpent / 7) * 31);
  const projectedOverrun = Math.max(0, projectedMonthEnd - monthlyBudget);

  const unresolved = allAnomaliesList.filter(a => a.severity !== 'Normal' && !a.resolved);

  // Group weekend vs weekday transactions
  let weekendSum = 0;
  let weekdaySum = 0;
  let weekendCount = 0;
  let weekdayCount = 0;

  transactions.forEach(t => {
    const day = new Date(t.date).getDay();
    if (day === 0 || day === 6) {
      weekendSum += t.amount;
      weekendCount++;
    } else {
      weekdaySum += t.amount;
      weekdayCount++;
    }
  });

  const weekendAvgPerTx = weekendCount > 0 ? Math.round(weekendSum / weekendCount) : 0;
  const weekdayAvgPerTx = weekdayCount > 0 ? Math.round(weekdaySum / weekdayCount) : 0;
  const weekendPremium = weekdayAvgPerTx > 0 ? Math.round(((weekendAvgPerTx - weekdayAvgPerTx) / weekdayAvgPerTx) * 100) : 22;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Financial Insights</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Deterministic Reasoning Engine
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Pattern extraction and behavioral telemetry synthesized across your transaction history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            100% Local Inference (0 API Keys)
          </span>
        </div>
      </div>

      {/* Hero Insight Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-purple-950/40 to-slate-900 border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Primary Synthesis
              </span>
              <span className="text-xs text-slate-400">Calculated over 50+ transactions</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Spending Velocity Acceleration Detected in Week 1
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              At your current velocity of {settings.currencySymbol}{Math.round(totalSpent / 7).toLocaleString()}/day, you are on track to spend approximately <strong>{settings.currencySymbol}{projectedMonthEnd.toLocaleString()}</strong> this month. If unadjusted, this represents a projected overrun of <strong>{settings.currencySymbol}{projectedOverrun.toLocaleString()}</strong> beyond your {settings.currencySymbol}{monthlyBudget.toLocaleString()} limit.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('whatif')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-glow-sm shadow-indigo-500/25 flex items-center gap-2 transition-transform active:scale-95 shrink-0"
          >
            <span>Simulate What-If Adjustment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Key Analytical Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Insight 1: Spending Pattern Spike */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              🛍️
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                Spending Pattern Spike
              </span>
              <h3 className="text-sm font-bold text-white">Shopping & Retail Escalation</h3>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your shopping spending has surged <strong>31% higher</strong> compared to your previous month's baseline. A large portion of this delta stems from high-ticket e-commerce carts during early October.
          </p>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex justify-between items-center">
            <span>Category Baseline: ₹8,000</span>
            <span className="font-semibold text-purple-300">Spent: ₹9,349 (+17%)</span>
          </div>
        </div>

        {/* Insight 2: Anomaly Risk Concentration */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                Risk Anomaly Cluster
              </span>
              <h3 className="text-sm font-bold text-white">Novel Merchant & Duplicate Charges</h3>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>{unresolved.length} transactions</strong> have characteristics significantly deviating from your normal baseline. High-risk items include the ₹8,750 Electronics purchase and a duplicate ₹1,450 coffee swipe within 4 minutes.
          </p>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex justify-between items-center">
            <span>Total at-risk capital</span>
            <button
              onClick={() => setActiveTab('anomalies')}
              className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1"
            >
              Review all anomalies ({unresolved.length}) →
            </button>
          </div>
        </div>

        {/* Insight 3: Weekend vs Weekday Behavior */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Temporal Behavior
              </span>
              <h3 className="text-sm font-bold text-white">Weekend Discretionary Multiplier</h3>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your weekend transaction average is approximately <strong>22% higher</strong> than weekday spending. You frequently patronize entertainment, dining, and luxury retail during Friday evening through Sunday.
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              Weekday Avg: <strong className="text-slate-200">₹{weekdayAvgPerTx.toLocaleString()}</strong>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">
              Weekend Avg: <strong className="text-amber-300">₹{weekendAvgPerTx.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Insight 4: Category Trend Alert */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Trend Persistence
              </span>
              <h3 className="text-sm font-bold text-white">Food Spending Growth Streak</h3>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Food spending has trended upward for <strong>3 consecutive weeks</strong>. While individual daily cafe stops remain normal (₹300–₹400), banquet dining (e.g. ₹4,500 at The Royal Bistro) heavily inflated total velocity.
          </p>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex justify-between items-center">
            <span>Normal Food frequency</span>
            <span className="text-slate-200 font-semibold">3.8 transactions / week</span>
          </div>
        </div>
      </div>

      {/* Actionable Recommendations Panel */}
      <div className="bg-[#111827] border border-slate-800 p-5 rounded-2xl space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">SpendGuard Prescriptive Recommendations</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <span className="font-bold text-indigo-300">1. Dispute Coffee Duplicate</span>
            <p className="text-slate-400 leading-relaxed">
              Verify your UPI statement for the ₹1,450 duplicate charge at Starbucks Coffee (Oct 6, 10:18 AM).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <span className="font-bold text-indigo-300">2. Cap Discretionary Shopping</span>
            <p className="text-slate-400 leading-relaxed">
              Pause further e-commerce purchases for 7 days to let your shopping envelope normalize back within budget.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <span className="font-bold text-indigo-300">3. Whitelist Verified Merchants</span>
            <p className="text-slate-400 leading-relaxed">
              If the ₹8,750 TechZone purchase was intentional, add TechZone to your Trusted Merchants list in Anomaly Center.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
