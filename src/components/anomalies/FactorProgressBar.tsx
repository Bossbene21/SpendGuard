import React from 'react';
import { FactorBreakdown } from '../../types';

interface FactorProgressBarProps {
  factor: FactorBreakdown;
}

export const FactorProgressBar: React.FC<FactorProgressBarProps> = ({ factor }) => {
  const percent = Math.min(100, Math.round((factor.score / factor.maxScore) * 100));

  let colorClass = 'bg-slate-600';
  if (percent >= 70) colorClass = 'bg-rose-500 shadow-sm shadow-rose-500/50';
  else if (percent >= 40) colorClass = 'bg-amber-500';
  else if (percent > 0) colorClass = 'bg-indigo-500';

  return (
    <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-200">{factor.name}</span>
          <span className="text-[10px] text-slate-400 font-mono">({factor.weightLabel})</span>
        </div>
        <div className="flex items-center gap-1 font-mono text-xs">
          <span className={`font-bold ${percent >= 70 ? 'text-rose-400' : percent >= 40 ? 'text-amber-400' : 'text-slate-300'}`}>
            {factor.score}
          </span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-400">{factor.maxScore}</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>

      <p className="text-[11px] text-slate-400 leading-snug">
        {factor.description}
      </p>
    </div>
  );
};
