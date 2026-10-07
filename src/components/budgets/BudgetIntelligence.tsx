import React, { useState } from 'react';
import {
  PieChart,
  Target,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Edit2,
  Save,
  X,
  Sparkles,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';

export const BudgetIntelligence: React.FC = () => {
  const { budgets, transactions, settings, updateBudget, setActiveTab } = useApp();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editLimit, setEditLimit] = useState<string>('');

  // Calculate actual October spend by category
  const currentMonth = 9; // Oct
  const currentYear = 2026;
  const currentMonthTxs = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const categorySpentMap: Record<string, number> = {};
  currentMonthTxs.forEach(t => {
    categorySpentMap[t.category] = (categorySpentMap[t.category] || 0) + t.amount;
  });

  const totalBudgeted = Object.values(budgets).reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = Object.values(categorySpentMap).reduce((sum, s) => sum + s, 0);

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

  // Generate predictive warnings
  const warnings: { category: string; message: string; severity: 'high' | 'medium' }[] = [];
  const daysPassed = 7;
  const daysInMonth = 31;
  const projectionFactor = daysInMonth / daysPassed;

  Object.entries(budgets).forEach(([cat, b]) => {
    const spent = categorySpentMap[cat] || 0;
    const projected = Math.round(spent * projectionFactor);

    if (spent > b.limit) {
      warnings.push({
        category: cat,
        message: `${cat} has already exceeded its ₹${b.limit.toLocaleString()} ceiling by ₹${(spent - b.limit).toLocaleString()}.`,
        severity: 'high'
      });
    } else if (projected > b.limit * 1.25) {
      const overrun = projected - b.limit;
      warnings.push({
        category: cat,
        message: `At your current velocity, you are projected to exceed your ${cat} budget by ₹${overrun.toLocaleString()}.`,
        severity: 'high'
      });
    } else if (projected > b.limit) {
      warnings.push({
        category: cat,
        message: `Pacing warning: ${cat} is trending close to cap (projected ₹${projected.toLocaleString()} vs ₹${b.limit.toLocaleString()}).`,
        severity: 'medium'
      });
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">BUDGET INTELLIGENCE</h1>
              <p className="text-xs text-slate-400">
                Predictive velocity modeling, envelope allocations, and burn-rate forecasting
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('whatif')}
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm self-start md:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Simulate What-If Expense</span>
        </button>
      </div>

      {/* Top Envelope Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#111827]/80 border border-slate-800">
          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
            Total Allocated Budget
          </span>
          <div className="text-2xl font-black text-white mt-1 font-mono">
            {settings.currencySymbol}{totalBudgeted.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Across {Object.keys(budgets).length} active expense categories</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111827]/80 border border-slate-800">
          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
            Current Outflow (Oct 1–7)
          </span>
          <div className="text-2xl font-black text-rose-400 mt-1 font-mono">
            {settings.currencySymbol}{totalSpent.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {Math.round((totalSpent / totalBudgeted) * 100)}% of monthly envelope consumed
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#111827]/80 border border-slate-800">
          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
            Projected Month-End Outflow
          </span>
          <div className="text-2xl font-black text-amber-400 mt-1 font-mono">
            {settings.currencySymbol}{Math.round(totalSpent * (31 / 7)).toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Forecasted burn rate exceeds budget limit</p>
        </div>
      </div>

      {/* Predictive Warning Banner */}
      {warnings.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <h3 className="text-xs font-bold text-amber-200 uppercase tracking-wide">
              Predictive Burn-Rate Warnings
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {warnings.map((w, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 flex items-start gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                <span>{w.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(budgets).map(([catName, b]) => {
          const cat = catName as Category;
          const spent = categorySpentMap[cat] || 0;
          const remaining = Math.max(0, b.limit - spent);
          const percent = Math.round((spent / b.limit) * 100);
          const isOver = spent > b.limit;
          const isEditing = editingCategory === cat;

          return (
            <div
              key={cat}
              className={`p-4 rounded-2xl bg-[#111827]/80 border transition-all ${
                isOver ? 'border-red-500/40 shadow-glow-danger' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: b.color }}
                  ></span>
                  <h3 className="text-sm font-bold text-white">{cat}</h3>
                </div>

                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSaveEdit(cat)}
                      className="p-1 text-emerald-400 hover:bg-slate-800 rounded"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="p-1 text-slate-400 hover:bg-slate-800 rounded"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartEdit(cat, b.limit)}
                    title="Edit category budget limit"
                    className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Limit & Spent */}
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <span className="text-[11px] text-slate-400 block">Spent</span>
                  <span className={`text-base font-extrabold font-mono ${isOver ? 'text-red-400' : 'text-slate-100'}`}>
                    {settings.currencySymbol}{spent.toLocaleString()}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Budget Cap</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editLimit}
                      onChange={e => setEditLimit(e.target.value)}
                      className="w-24 px-2 py-0.5 bg-slate-900 border border-indigo-500 rounded text-xs text-white font-mono font-bold"
                      autoFocus
                    />
                  ) : (
                    <span className="text-base font-extrabold font-mono text-slate-300">
                      {settings.currencySymbol}{b.limit.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1 my-3">
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver
                        ? 'bg-gradient-to-r from-red-500 to-rose-600'
                        : percent > 85
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                        : 'bg-gradient-to-r from-indigo-500 to-cyan-500'
                    }`}
                    style={{ width: `${Math.min(100, percent)}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>{percent}% consumed</span>
                  <span>{isOver ? `Over by ${settings.currencySymbol}${(spent - b.limit).toLocaleString()}` : `${settings.currencySymbol}${remaining.toLocaleString()} left`}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className={isOver ? 'text-red-400 font-bold' : 'text-slate-400'}>
                  {isOver ? 'Exceeded Budget' : percent > 85 ? 'Near Threshold' : 'Within Bounds'}
                </span>
                <span className="text-slate-500 font-mono">
                  Day 7 Pacing
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
