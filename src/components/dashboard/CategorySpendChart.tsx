import React from 'react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const CategorySpendChart: React.FC = () => {
  const { transactions, budgets, settings, baselines, setActiveTab } = useApp();

  // Aggregate current month spend by category
  const currentMonth = 9; // Oct
  const currentYear = 2026;

  const currentMonthTxs = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const categoryTotals: Record<string, number> = {};
  currentMonthTxs.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const categories = Object.keys(budgets) as Category[];

  // Sort categories by highest spend
  const sortedCategories = [...categories].sort((a, b) => {
    return (categoryTotals[b] || 0) - (categoryTotals[a] || 0);
  });

  return (
    <div className="p-5 rounded-2xl bg-[#111827]/80 border border-slate-800 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Category Allocation & Stress Test</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Spending distribution compared against personal budget caps
          </p>
        </div>
        <button
          onClick={() => setActiveTab('budgets')}
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Manage Caps →
        </button>
      </div>

      <div className="space-y-3.5 my-1">
        {sortedCategories.slice(0, 6).map(cat => {
          const spent = categoryTotals[cat] || 0;
          const budgetItem = budgets[cat];
          const limit = budgetItem?.limit || 5000;
          const percent = Math.min(100, Math.round((spent / limit) * 100));
          const isOver = spent > limit;
          const baseline = baselines[cat];

          return (
            <div key={cat} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: budgetItem?.color || '#3B82F6' }}
                  ></span>
                  <span className="font-semibold text-slate-200">{cat}</span>
                  {isOver && (
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.2 rounded border border-red-500/20">
                      <AlertCircle className="w-2.5 h-2.5" />
                      Over by {settings.currencySymbol}{(spent - limit).toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <span className={isOver ? 'text-red-400 font-bold' : 'text-slate-200 font-medium'}>
                    {settings.currencySymbol}{spent.toLocaleString()}
                  </span>
                  <span className="text-slate-500">/</span>
                  <span className="text-slate-400">
                    {settings.currencySymbol}{limit.toLocaleString()}
                  </span>
                  <span className={`text-[11px] font-bold ml-1 ${isOver ? 'text-red-400' : 'text-slate-400'}`}>
                    ({percent}%)
                  </span>
                </div>
              </div>

              {/* Progress track */}
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOver
                      ? 'bg-gradient-to-r from-red-500 to-rose-600'
                      : percent > 80
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                      : 'bg-gradient-to-r from-indigo-500 to-blue-500'
                  }`}
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>Electronics and Shopping have the highest budget strain.</span>
        <span className="text-indigo-400 font-medium">6 of 11 categories active</span>
      </div>
    </div>
  );
};
