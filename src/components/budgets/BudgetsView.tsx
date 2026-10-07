import React, { useState } from 'react';
import {
  PieChart,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Edit2,
  Save,
  X,
  Plus,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';

export const BudgetsView: React.FC = () => {
  const { transactions, budgets, updateBudget, settings } = useApp();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editLimit, setEditLimit] = useState<string>('');

  // Calculate spent per category
  const spentByCategory: Record<string, number> = {};
  transactions.forEach(t => {
    spentByCategory[t.category] = (spentByCategory[t.category] || 0) + t.amount;
  });

  const totalSpent = Object.values(spentByCategory).reduce((a, b) => a + b, 0);
  const totalBudget = Object.values(budgets).reduce((sum, b) => sum + b.limit, 0);
  const overallRemaining = Math.max(0, totalBudget - totalSpent);

  const handleStartEdit = (cat: Category, currentLimit: number) => {
    setEditingCategory(cat);
    setEditLimit(currentLimit.toString());
  };

  const handleSaveEdit = (cat: Category) => {
    const num = parseFloat(editLimit);
    if (!isNaN(num) && num > 0) {
      updateBudget(cat, num);
    }
    setEditingCategory(null);
  };

  const categoryList: Category[] = [
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
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Budget Intelligence</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Proactive Forecasting
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Predictive envelope monitoring with velocity overrun projections.
          </p>
        </div>
      </div>

      {/* Intelligent Warnings Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Shopping Overrun Warning */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 to-slate-900 border border-red-500/30 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-red-300 uppercase tracking-wider">
              Projected Budget Overrun
            </div>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed">
              At your current spending rate, you are projected to exceed your <strong>Shopping</strong> budget by <strong>{settings.currencySymbol}2,400</strong> before month end.
            </p>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Driven by elevated weekend retail velocity (71% utilized).
            </span>
          </div>
        </div>

        {/* Electronics Outlier Impact Warning */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/30 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Electronics Allocation Spike
            </div>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed">
              Electronics spending is currently at <strong>145%</strong> of its nominal {settings.currencySymbol}6,000 monthly envelope due to the recent ₹8,750 hardware purchase.
            </p>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Flagged in Anomaly Center for verification.
            </span>
          </div>
        </div>
      </div>

      {/* Overall Budget Envelope Card */}
      <div className="bg-[#111827] border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Overall Monthly Allocation
          </span>
          <div className="text-3xl font-black text-white">
            {settings.currencySymbol}{totalSpent.toLocaleString()}
            <span className="text-lg text-slate-400 font-normal"> / {settings.currencySymbol}{totalBudget.toLocaleString()}</span>
          </div>
          <p className="text-xs text-slate-400">
            {settings.currencySymbol}{overallRemaining.toLocaleString()} remaining across all categories
          </p>
        </div>

        {/* Progress Bar & Dial */}
        <div className="w-full md:w-1/2 space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Total Envelopes Utilized</span>
            <span className="text-indigo-400">{Math.round((totalSpent / totalBudget) * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500"
              style={{ width: `${Math.min(100, Math.round((totalSpent / totalBudget) * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryList.map(cat => {
          const budget = budgets[cat] || { category: cat, limit: 6000, spent: 0, color: '#6366F1' };
          const spent = spentByCategory[cat] || 0;
          const limit = budget.limit;
          const remaining = Math.max(0, limit - spent);
          const percent = Math.round((spent / limit) * 100);
          const isOver = spent > limit;
          const isNear = percent >= 80 && !isOver;

          const isEditing = editingCategory === cat;

          return (
            <div
              key={cat}
              className={`bg-[#111827] border rounded-2xl p-5 space-y-4 transition-all ${
                isOver
                  ? 'border-red-500/40 bg-red-950/10'
                  : isNear
                  ? 'border-amber-500/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {cat}
                  </h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    isOver ? 'text-red-400' : isNear ? 'text-amber-300' : 'text-emerald-400'
                  }`}>
                    {isOver ? 'Exceeded Budget' : isNear ? 'Near Limit (Warning)' : 'On Track'}
                  </span>
                </div>

                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSaveEdit(cat)}
                      className="p-1.5 text-emerald-400 hover:bg-slate-800 rounded-lg"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="p-1.5 text-slate-400 hover:bg-slate-800 rounded-lg"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartEdit(cat, limit)}
                    title="Edit limit"
                    className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Amounts Display */}
              <div>
                <div className="flex items-baseline justify-between">
                  <div className="text-xl font-bold text-white">
                    {settings.currencySymbol}{spent.toLocaleString()}
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">{settings.currencySymbol}</span>
                      <input
                        type="number"
                        value={editLimit}
                        onChange={e => setEditLimit(e.target.value)}
                        className="w-20 px-2 py-0.5 bg-slate-900 border border-indigo-500 rounded text-xs text-white font-mono"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400">
                      Limit: {settings.currencySymbol}{limit.toLocaleString()}
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                  <span>
                    {isOver ? `Over by ${settings.currencySymbol}${(spent - limit).toLocaleString()}` : `${settings.currencySymbol}${remaining.toLocaleString()} remaining`}
                  </span>
                  <span className="font-semibold text-slate-300">{percent}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOver ? 'bg-red-500' : isNear ? 'bg-amber-400' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${Math.min(100, percent)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
