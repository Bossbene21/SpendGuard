import React, { useState } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  ShieldAlert,
  Building,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AnalyticsView: React.FC = () => {
  const { transactions, budgets, settings, allAnomaliesList } = useApp();

  // 1. Category aggregation
  const catTotals: Record<string, number> = {};
  transactions.forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
  });
  const totalAmount = Object.values(catTotals).reduce((a, b) => a + b, 0) || 1;
  const sortedCategories = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);

  // 2. Merchant concentration (Top 5)
  const merchantTotals: Record<string, number> = {};
  transactions.forEach(t => {
    merchantTotals[t.merchant] = (merchantTotals[t.merchant] || 0) + t.amount;
  });
  const topMerchants = Object.entries(merchantTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // 3. Daily spending aggregation (Oct 1 to Oct 7)
  const dailySpending = [
    { date: 'Oct 1', amount: 1200, count: 4 },
    { date: 'Oct 2', amount: 1650, count: 5 },
    { date: 'Oct 3', amount: 6499, count: 3 }, // Shopping spike
    { date: 'Oct 4', amount: 1851, count: 4 },
    { date: 'Oct 5', amount: 6600, count: 6 }, // Dinner banquet
    { date: 'Oct 6', amount: 6700, count: 8 }, // Duplicate coffee & transit
    { date: 'Oct 7', amount: 18180, count: 7 } // TechZone Electronics ₹8,750
  ];
  const maxDayAmount = Math.max(...dailySpending.map(d => d.amount));

  // 4. Anomaly frequency breakdown
  const severityCounts = {
    Critical: allAnomaliesList.filter(a => a.severity === 'Critical').length,
    Suspicious: allAnomaliesList.filter(a => a.severity === 'Suspicious').length,
    Watch: allAnomaliesList.filter(a => a.severity === 'Watch').length,
    Normal: allAnomaliesList.filter(a => a.severity === 'Normal').length
  };

  const colors = [
    '#6366F1',
    '#8B5CF6',
    '#EC4899',
    '#10B981',
    '#F59E0B',
    '#06B6D4',
    '#3B82F6',
    '#64748B'
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Financial Analytics</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Pattern Telemetry
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Visual breakdown of spending concentrations, temporal distributions, and anomaly triggers.
          </p>
        </div>
      </div>

      {/* Grid of 6 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Daily Spending Histogram */}
        <div className="bg-[#111827] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Daily Spending Inflow & Peaks
              </h3>
              <span className="text-xs text-slate-400">October 1–7</span>
            </div>

            <div className="h-48 flex items-end justify-between gap-2 pt-6">
              {dailySpending.map((item, idx) => {
                const heightPct = Math.round((item.amount / maxDayAmount) * 100);
                const isSpike = item.amount > 6000;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] text-slate-400 group-hover:text-white transition-colors">
                      {settings.currencySymbol}{Math.round(item.amount / 1000)}k
                    </span>
                    <div className="w-full bg-slate-800 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          isSpike
                            ? 'bg-gradient-to-t from-red-600 to-rose-400 group-hover:from-red-500 group-hover:to-rose-300'
                            : 'bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-indigo-300'
                        }`}
                        style={{ height: `${Math.max(8, heightPct)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.date}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800/80 mt-2 flex justify-between">
            <span>Peak day: Oct 7 ({settings.currencySymbol}18,180)</span>
            <span className="text-red-400">Includes flagged ₹8,750 electronics charge</span>
          </div>
        </div>

        {/* Chart 2: Category Distribution Breakdown */}
        <div className="bg-[#111827] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-indigo-400" />
                Category Concentration Share
              </h3>
              <span className="text-xs text-slate-400">Total: {settings.currencySymbol}{totalAmount.toLocaleString()}</span>
            </div>

            <div className="space-y-2.5">
              {sortedCategories.slice(0, 5).map(([cat, amt], i) => {
                const pct = Math.round((amt / totalAmount) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[i] }} />
                        <span className="text-slate-200 font-medium">{cat}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{settings.currencySymbol}{amt.toLocaleString()}</span>
                        <span className="text-slate-400 text-[11px]">({pct}%)</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: colors[i] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800/80 mt-2">
            Electronics & Shopping represent 44% of cumulative spending this cycle.
          </div>
        </div>

        {/* Chart 3: Top Merchants Concentration */}
        <div className="bg-[#111827] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-400" />
                Merchant Outflow Concentration
              </h3>
              <span className="text-xs text-slate-400">Top Outflows</span>
            </div>

            <div className="space-y-3">
              {topMerchants.map(([merch, amt], i) => (
                <div key={merch} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-[10px]">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-slate-200">{merch}</span>
                  </div>
                  <span className="font-bold text-white">{settings.currencySymbol}{amt.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800/80 mt-2">
            Top 3 merchants account for over 52% of total transaction value.
          </div>
        </div>

        {/* Chart 4: Anomaly Severity Distribution */}
        <div className="bg-[#111827] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                Engine Anomaly Categorization
              </h3>
              <span className="text-xs text-slate-400">All Scored Transactions</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-center">
                <span className="text-[11px] font-bold text-red-400 uppercase">Critical (Score ≥ 75)</span>
                <span className="text-3xl font-black text-red-400 block mt-1">{severityCounts.Critical}</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Immediate Review</span>
              </div>

              <div className="p-4 rounded-xl bg-orange-950/20 border border-orange-500/30 text-center">
                <span className="text-[11px] font-bold text-orange-400 uppercase">Suspicious (55–74)</span>
                <span className="text-3xl font-black text-orange-400 block mt-1">{severityCounts.Suspicious}</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Investigate</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-center">
                <span className="text-[11px] font-bold text-amber-300 uppercase">Watch (35–54)</span>
                <span className="text-3xl font-black text-amber-300 block mt-1">{severityCounts.Watch}</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Minor Deviation</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-center">
                <span className="text-[11px] font-bold text-emerald-400 uppercase">Normal (&lt; 35)</span>
                <span className="text-3xl font-black text-emerald-400 block mt-1">{severityCounts.Normal}</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Within Baseline</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800/80 mt-2">
            Engine sensitivity calibration currently set to <strong>{settings.sensitivity}</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};
