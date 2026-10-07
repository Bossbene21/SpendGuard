import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  Zap,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';
import { simulateWhatIfExpense } from '../../engine/simulations';

export const WhatIfSimulator: React.FC = () => {
  const { transactions, budgets, baselines, settings, setIsAddModalOpen } = useApp();

  const [category, setCategory] = useState<Category>('Shopping');
  const [amount, setAmount] = useState<string>('5000');
  const [merchant, setMerchant] = useState<string>('Zara Retail');

  const numAmount = parseFloat(amount) || 0;

  const simulation = simulateWhatIfExpense(
    numAmount,
    category,
    merchant,
    transactions,
    budgets as any,
    baselines
  );

  const budget = budgets[category] || { limit: 8000, spent: 0, category, color: '#3B82F6' };
  const currentCategorySpent = transactions
    .filter(t => t.category === category)
    .reduce((sum, t) => sum + t.amount, 0);

  const currentTotalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Severe':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'High':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'Moderate':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  const applyPreset = (cat: Category, amt: string, merch: string) => {
    setCategory(cat);
    setAmount(amt);
    setMerchant(merch);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">What-If Spending Simulation</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Predictive Sandbox
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Simulate a future transaction before making it to assess budget overrun risk and anomaly score.
          </p>
        </div>
      </div>

      {/* Simulator Inputs & Quick Scenarios */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input controls */}
        <div className="lg:col-span-5 bg-[#111827] border border-slate-800 p-6 rounded-2xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Simulated Expense Parameters</h3>
          </div>

          {/* Quick Presets for Evaluator */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Preset Test Scenarios (1-Click Test)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => applyPreset('Shopping', '5000', 'Zara Megastore')}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 text-left rounded-xl border border-slate-800 transition-colors"
              >
                <span className="text-xs font-bold text-indigo-300 block">Shopping ₹5,000</span>
                <span className="text-[10px] text-slate-400">Exceeds limit test</span>
              </button>
              <button
                onClick={() => applyPreset('Electronics', '14000', 'Apple Store')}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 text-left rounded-xl border border-slate-800 transition-colors"
              >
                <span className="text-xs font-bold text-red-300 block">Major Gadget ₹14,000</span>
                <span className="text-[10px] text-slate-400">Severe anomaly test</span>
              </button>
              <button
                onClick={() => applyPreset('Food', '3500', 'Fine Dining Experience')}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 text-left rounded-xl border border-slate-800 transition-colors"
              >
                <span className="text-xs font-bold text-amber-300 block">Dinner Banquet ₹3,500</span>
                <span className="text-[10px] text-slate-400">Food spike test</span>
              </button>
              <button
                onClick={() => applyPreset('Transport', '450', 'Metro Recharge')}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 text-left rounded-xl border border-slate-800 transition-colors"
              >
                <span className="text-xs font-bold text-emerald-300 block">Transit ₹450</span>
                <span className="text-[10px] text-slate-400">Safe baseline test</span>
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Simulated Amount ({settings.currencySymbol})
              </label>
              <input
                type="number"
                min="50"
                step="50"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono font-bold text-lg focus:outline-none focus:border-indigo-500"
              />
              <input
                type="range"
                min="100"
                max="25000"
                step="250"
                value={numAmount}
                onChange={e => setAmount(e.target.value)}
                className="w-full mt-2 accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {[
                  'Food',
                  'Shopping',
                  'Transport',
                  'Bills',
                  'Electronics',
                  'Entertainment',
                  'Healthcare',
                  'Education',
                  'Travel',
                  'Subscriptions',
                  'Other'
                ].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Hypothetical Merchant</label>
              <input
                type="text"
                value={merchant}
                onChange={e => setMerchant(e.target.value)}
                placeholder="Merchant name"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Right: Simulation Forecast Output */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#111827] to-[#18233C] border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                  Forecast Outcome
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">
                  Simulation: {settings.currencySymbol}{numAmount.toLocaleString()} in {category}
                </h2>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Predicted Risk</span>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full border inline-block mt-0.5 ${getRiskBadge(simulation.riskLevel)}`}>
                  {simulation.riskLevel.toUpperCase()} RISK
                </span>
              </div>
            </div>

            {/* Natural language synthesis */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {simulation.insightSummary}
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-medium">Current Spend</span>
                <span className="text-base font-bold text-slate-200 mt-1 block">
                  {settings.currencySymbol}{currentCategorySpent.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">Limit: {settings.currencySymbol}{budget.limit.toLocaleString()}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-medium">Projected Spend</span>
                <span className="text-base font-bold text-white mt-1 block">
                  {settings.currencySymbol}{simulation.newSpent.toLocaleString()}
                </span>
                <span className={`text-[10px] font-semibold ${simulation.utilizationPercent > 100 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {simulation.utilizationPercent}% of envelope
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-medium">Budget Overrun</span>
                <span className={`text-base font-bold mt-1 block ${simulation.overrunAmount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {simulation.overrunAmount > 0 ? `+${settings.currencySymbol}${simulation.overrunAmount.toLocaleString()}` : 'None (Safe)'}
                </span>
                <span className="text-[10px] text-slate-400">Excess amount</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-medium">Predicted Anomaly</span>
                <span className={`text-base font-bold mt-1 block ${
                  simulation.anomalyScore >= 70 ? 'text-red-400' : simulation.anomalyScore >= 40 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {simulation.anomalyScore} / 100
                </span>
                <span className="text-[10px] text-slate-400">Score estimate</span>
              </div>
            </div>

            {/* Visual envelope allocation bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">{category} Budget Capacity</span>
                <span className="text-slate-200 font-semibold">{simulation.utilizationPercent}%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
                {/* Existing spent */}
                <div
                  className="bg-indigo-500 h-full"
                  style={{ width: `${Math.min(100, Math.round((currentCategorySpent / budget.limit) * 100))}%` }}
                />
                {/* Simulated additional expense */}
                <div
                  className={`h-full ${simulation.newSpent > budget.limit ? 'bg-red-500' : 'bg-purple-400'}`}
                  style={{ width: `${Math.min(100, Math.round((numAmount / budget.limit) * 100))}%` }}
                />
              </div>
              <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-1">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Existing Outflow</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${simulation.newSpent > budget.limit ? 'bg-red-500' : 'bg-purple-400'}`} />
                  <span>Simulated Transaction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
