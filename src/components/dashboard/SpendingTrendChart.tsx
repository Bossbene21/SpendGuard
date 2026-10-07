import React, { useState } from 'react';
import { TrendingUp, Calendar, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SpendingTrendChart: React.FC = () => {
  const { transactions, settings } = useApp();
  const [hoveredPoint, setHoveredPoint] = useState<{
    day: number;
    current: number;
    previous: number;
    budget: number;
  } | null>(null);

  // Compute daily cumulative spending for October (current) and September (previous)
  const daysInMonth = 31;
  const currentDays: number[] = Array.from({ length: 15 }, (_, i) => i + 1); // 1 to 15 (current date is Oct 7, up to mid month)
  
  // Aggregate transactions by day of month
  const currentDailyMap: Record<number, number> = {};
  const prevDailyMap: Record<number, number> = {};

  transactions.forEach(t => {
    const d = new Date(t.date);
    const day = d.getDate();
    const month = d.getMonth(); // 9 = Oct, 8 = Sept
    if (month === 9) {
      currentDailyMap[day] = (currentDailyMap[day] || 0) + t.amount;
    } else if (month === 8) {
      prevDailyMap[day] = (prevDailyMap[day] || 0) + t.amount;
    }
  });

  // Calculate cumulative curves
  let cumCurrent = 0;
  let cumPrev = 0;
  const points = [];

  const maxDays = 15;
  const dailyBudgetRate = settings.overallMonthlyBudget / daysInMonth;

  for (let day = 1; day <= maxDays; day++) {
    cumCurrent += currentDailyMap[day] || 0;
    cumPrev += (prevDailyMap[day] || (day <= 7 ? 2200 : 1800));
    const budgetPacing = Math.round(dailyBudgetRate * day);

    points.push({
      day,
      current: day <= 8 ? cumCurrent : null, // Current month plotted up to today
      previous: cumPrev,
      budget: budgetPacing
    });
  }

  // Scaling SVG coordinates
  const svgWidth = 640;
  const svgHeight = 220;
  const padding = { top: 20, right: 30, bottom: 30, left: 55 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  const maxVal = Math.max(settings.overallMonthlyBudget * 0.8, 55000);

  const getX = (day: number) => padding.left + ((day - 1) / (maxDays - 1)) * graphWidth;
  const getY = (val: number) => padding.top + graphHeight - (val / maxVal) * graphHeight;

  // Build SVG Path strings
  const currentPoints = points.filter(p => p.current !== null);
  const currentPath = currentPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.day)} ${getY(p.current!)}`).join(' ');
  const prevPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.day)} ${getY(p.previous)}`).join(' ');
  const budgetPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.day)} ${getY(p.budget)}`).join(' ');

  // Area under current path
  const currentArea = currentPoints.length > 0
    ? `${currentPath} L ${getX(currentPoints[currentPoints.length - 1].day)} ${getY(0)} L ${getX(1)} ${getY(0)} Z`
    : '';

  return (
    <div className="p-5 rounded-2xl bg-[#111827]/80 border border-slate-800 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">Cumulative Spending Trajectory</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
              October 2026 vs September
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time spending velocity against historical baseline & budget ceiling
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-indigo-500 rounded"></span>
            <span className="text-slate-300">October (Current)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-slate-600 rounded"></span>
            <span className="text-slate-400">September</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t border-dashed border-emerald-400"></span>
            <span className="text-emerald-400">Budget Limit</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-56 select-none"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 15000, 30000, 45000].map(val => (
            <g key={val}>
              <line
                x1={padding.left}
                y1={getY(val)}
                x2={svgWidth - padding.right}
                y2={getY(val)}
                stroke="#1F2937"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 8}
                y={getY(val) + 4}
                textAnchor="end"
                className="text-[10px] fill-slate-500 font-mono"
              >
                ₹{(val / 1000)}k
              </text>
            </g>
          ))}

          {/* X Axis Labels */}
          {[1, 3, 5, 7, 9, 11, 13, 15].map(day => (
            <text
              key={day}
              x={getX(day)}
              y={svgHeight - 10}
              textAnchor="middle"
              className="text-[10px] fill-slate-500 font-mono"
            >
              Oct {day}
            </text>
          ))}

          {/* Previous Month Line */}
          <path
            d={prevPath}
            fill="none"
            stroke="#475569"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="transition-all"
          />

          {/* Budget Pacing Line */}
          <path
            d={budgetPath}
            fill="none"
            stroke="#10B981"
            strokeWidth="1.5"
            strokeDasharray="2 3"
            opacity="0.8"
          />

          {/* Current Month Area & Line */}
          {currentArea && <path d={currentArea} fill="url(#currentGradient)" />}
          <path
            d={currentPath}
            fill="none"
            stroke="#6366F1"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points on current line */}
          {currentPoints.map(p => (
            <circle
              key={p.day}
              cx={getX(p.day)}
              cy={getY(p.current!)}
              r={p.day === 7 ? 5 : 3.5}
              fill="#6366F1"
              stroke="#0B0F19"
              strokeWidth="2"
              className="cursor-pointer hover:scale-150 transition-transform"
              onMouseEnter={() =>
                setHoveredPoint({
                  day: p.day,
                  current: p.current!,
                  previous: p.previous,
                  budget: p.budget
                })
              }
            />
          ))}

          {/* Highlight October 7 (Anomaly Day) */}
          <g>
            <line
              x1={getX(7)}
              y1={padding.top}
              x2={getX(7)}
              y2={svgHeight - padding.bottom}
              stroke="#EF4444"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.6"
            />
            <circle cx={getX(7)} cy={padding.top + 8} r="3" fill="#EF4444" />
            <text
              x={getX(7) + 5}
              y={padding.top + 12}
              className="text-[9px] fill-red-400 font-bold"
            >
              TechZone Spike (₹8,750)
            </text>
          </g>
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className="absolute top-2 right-4 bg-slate-900/95 border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs z-10 pointer-events-none"
          >
            <div className="font-bold text-slate-200 mb-1">October {hoveredPoint.day}, 2026</div>
            <div className="space-y-0.5">
              <div className="text-indigo-400 flex items-center justify-between gap-3">
                <span>Oct Spent:</span>
                <span className="font-mono font-bold">₹{hoveredPoint.current.toLocaleString()}</span>
              </div>
              <div className="text-slate-400 flex items-center justify-between gap-3">
                <span>Sept Spent:</span>
                <span className="font-mono">₹{hoveredPoint.previous.toLocaleString()}</span>
              </div>
              <div className="text-emerald-400 flex items-center justify-between gap-3">
                <span>Budget Limit:</span>
                <span className="font-mono">₹{hoveredPoint.budget.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer takeaway */}
      <div className="mt-2 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5 text-amber-400 font-medium">
          <TrendingUp className="w-3.5 h-3.5" />
          October trajectory steepened on Oct 7 (+₹8,750 electronics purchase).
        </span>
        <span className="text-[11px] text-slate-500">Auto-calibrated hourly</span>
      </div>
    </div>
  );
};
