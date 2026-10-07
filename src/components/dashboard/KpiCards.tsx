import React from 'react';
import {
  Wallet,
  Target,
  PiggyBank,
  ShieldAlert,
  Activity,
  TrendingUp,
  AlertOctagon,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const KpiCards: React.FC = () => {
  const { transactions, settings, allAnomaliesList, setActiveTab } = useApp();

  // Current month transactions (October 2026)
  const currentMonth = 9; // 0-indexed October is 9
  const currentYear = 2026;

  const currentMonthTxs = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalSpending = currentMonthTxs.reduce((sum, t) => sum + t.amount, 0);
  const monthlyBudget = settings.overallMonthlyBudget;
  const remainingBudget = Math.max(0, monthlyBudget - totalSpending);
  const budgetUtilization = Math.round((totalSpending / monthlyBudget) * 100);

  // Anomalies count
  const activeAnomalies = allAnomaliesList.filter(a => a.severity !== 'Normal' && !a.resolved);
  const criticalCount = activeAnomalies.filter(a => a.severity === 'Critical').length;

  // Determine overall risk level
  let riskLevel = 'Low';
  let riskColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  if (criticalCount >= 2 || activeAnomalies.length >= 6) {
    riskLevel = 'Moderate';
    riskColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  } else if (criticalCount >= 4 || activeAnomalies.length >= 10) {
    riskLevel = 'High';
    riskColor = 'text-red-400 bg-red-500/10 border-red-500/20';
  }

  const kpis = [
    {
      title: 'Total Spending',
      value: `${settings.currencySymbol}${totalSpending.toLocaleString()}`,
      subtext: `${budgetUtilization}% of monthly allowance`,
      trend: '+4.2% vs last month',
      trendPositive: false,
      icon: Wallet,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      title: 'Monthly Budget',
      value: `${settings.currencySymbol}${monthlyBudget.toLocaleString()}`,
      subtext: 'Paced for 31 days',
      trend: 'Fixed threshold',
      trendNeutral: true,
      icon: Target,
      color: 'from-indigo-600 to-purple-600'
    },
    {
      title: 'Remaining',
      value: `${settings.currencySymbol}${remainingBudget.toLocaleString()}`,
      subtext: `${(100 - budgetUtilization)}% buffer intact`,
      trend: totalSpending > monthlyBudget ? 'Exceeded' : 'On Track',
      trendPositive: totalSpending <= monthlyBudget,
      icon: PiggyBank,
      color: 'from-emerald-600 to-teal-600'
    },
    {
      title: 'Anomalies Detected',
      value: activeAnomalies.length.toString(),
      subtext: `${criticalCount} require immediate review`,
      action: () => setActiveTab('anomalies'),
      badgeText: 'Review Center',
      icon: ShieldAlert,
      color: activeAnomalies.length > 0 ? 'from-amber-600 to-rose-600' : 'from-slate-700 to-slate-800',
      highlight: activeAnomalies.length > 0
    },
    {
      title: 'Risk Level',
      value: riskLevel,
      subtext: `${settings.sensitivity} sensitivity mode`,
      customBadge: (
        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${riskColor}`}>
          {riskLevel}
        </span>
      ),
      icon: Activity,
      color: 'from-purple-600 to-pink-600'
    },
    {
      title: 'Savings Trend',
      value: '+12.4%',
      subtext: 'Compared to Q3 benchmark',
      trend: 'Disciplined pacing',
      trendPositive: true,
      icon: TrendingUp,
      color: 'from-teal-600 to-emerald-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            onClick={kpi.action}
            className={`p-4 rounded-2xl bg-[#111827]/80 border transition-all ${
              kpi.highlight
                ? 'border-amber-500/40 shadow-glow-sm shadow-amber-500/10 cursor-pointer hover:border-amber-400'
                : 'border-slate-800 hover:border-slate-700'
            } ${kpi.action ? 'cursor-pointer' : ''}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {kpi.title}
              </span>
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white shadow-sm`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="text-xl font-extrabold text-white tracking-tight">
                {kpi.value}
              </div>
              {kpi.customBadge}
              {kpi.badgeText && (
                <span className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-0.5">
                  {kpi.badgeText} <ArrowUpRight className="w-3 h-3" />
                </span>
              )}
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate">{kpi.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
