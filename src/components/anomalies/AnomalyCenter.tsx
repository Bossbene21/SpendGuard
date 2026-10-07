import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Eye,
  CheckCircle,
  Filter,
  Search,
  ArrowUpDown,
  Sparkles,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AnomalySeverity, Category } from '../../types';

export const AnomalyCenter: React.FC = () => {
  const { allAnomaliesList, setSelectedAnomalyId, settings, baselines, resolveAnomaly } = useApp();

  const [activeFilter, setActiveFilter] = useState<'All' | AnomalySeverity | 'Resolved'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'amount'>('score');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filter out pure "Normal" transactions from the Anomaly Center unless explicitly searching
  const filteredAnomalies = useMemo(() => {
    return allAnomaliesList.filter(item => {
      // Base condition: only show items that are non-normal OR resolved
      const isAnomalous = item.severity !== 'Normal' || item.resolved;
      if (!isAnomalous) return false;

      // Filter tab
      if (activeFilter === 'Resolved') {
        if (!item.resolved) return false;
      } else if (activeFilter !== 'All') {
        if (item.severity !== activeFilter) return false;
      }

      // Category filter
      if (categoryFilter !== 'All' && item.transaction.category !== categoryFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesMerchant = item.transaction.merchant.toLowerCase().includes(q);
        const matchesCat = item.transaction.category.toLowerCase().includes(q);
        const matchesReason = item.primaryReason.toLowerCase().includes(q) || item.reasons.some(r => r.toLowerCase().includes(q));
        const matchesAmount = item.transaction.amount.toString().includes(q);
        if (!matchesMerchant && !matchesCat && !matchesReason && !matchesAmount) return false;
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'score') {
        comparison = b.score - a.score;
      } else if (sortBy === 'date') {
        comparison = new Date(b.transaction.date).getTime() - new Date(a.transaction.date).getTime();
      } else if (sortBy === 'amount') {
        comparison = b.transaction.amount - a.transaction.amount;
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    });
  }, [allAnomaliesList, activeFilter, categoryFilter, searchQuery, sortBy, sortOrder]);

  // Aggregate stats
  const totalFlagged = allAnomaliesList.filter(a => a.severity !== 'Normal').length;
  const criticalCount = allAnomaliesList.filter(a => a.severity === 'Critical' && !a.resolved).length;
  const suspiciousCount = allAnomaliesList.filter(a => a.severity === 'Suspicious' && !a.resolved).length;
  const watchCount = allAnomaliesList.filter(a => a.severity === 'Watch' && !a.resolved).length;
  const resolvedCount = allAnomaliesList.filter(a => a.resolved).length;
  const atRiskAmount = allAnomaliesList
    .filter(a => a.severity !== 'Normal' && !a.resolved)
    .reduce((sum, a) => sum + a.transaction.amount, 0);

  const getSeverityStyle = (severity: AnomalySeverity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'Suspicious':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'Watch':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Anomaly Center</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Multi-Factor Engine
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Explainable deviations scored against your personal behavioral spending baseline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Current Sensitivity:</span>
          <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200">
            {settings.sensitivity} Detection
          </span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-[#111827] border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 block font-medium">Total At-Risk</span>
          <span className="text-xl font-bold text-white mt-1 block">
            {settings.currencySymbol}{atRiskAmount.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">{totalFlagged - resolvedCount} active alerts</span>
        </div>

        <div className="bg-[#111827] border border-red-950/60 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-red-400 font-medium">Critical</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </div>
          <span className="text-xl font-bold text-red-400 mt-1 block">{criticalCount}</span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Score ≥ 75 / Immediate</span>
        </div>

        <div className="bg-[#111827] border border-orange-950/60 p-4 rounded-xl">
          <span className="text-xs text-orange-400 block font-medium">Suspicious</span>
          <span className="text-xl font-bold text-orange-400 mt-1 block">{suspiciousCount}</span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Score 55–74</span>
        </div>

        <div className="bg-[#111827] border border-amber-950/60 p-4 rounded-xl">
          <span className="text-xs text-amber-300 block font-medium">Watch</span>
          <span className="text-xl font-bold text-amber-300 mt-1 block">{watchCount}</span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Score 35–54</span>
        </div>

        <div className="bg-[#111827] border border-emerald-950/60 p-4 rounded-xl">
          <span className="text-xs text-emerald-400 block font-medium">Resolved</span>
          <span className="text-xl font-bold text-emerald-400 mt-1 block">{resolvedCount}</span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Marked normal/trusted</span>
        </div>
      </div>

      {/* Flagship Highlight Banner: TechZone Electronics Demo Quick Card */}
      {allAnomaliesList.find(a => a.transaction.id === 'tx-anomaly-01') && (
        <div className="bg-gradient-to-r from-red-950/30 via-indigo-950/20 to-[#111827] border border-red-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                  Flagship Hackathon Demo Case
                </span>
                <span className="text-xs text-slate-400">Oct 7, 2026</span>
              </div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>TechZone Electronics — {settings.currencySymbol}8,750</span>
                <span className="text-sm font-semibold text-red-400">(Score 89/100 • Critical)</span>
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-indigo-300">Explainability breakdown:</strong> Amount is 3.4× above your personal electronics average (₹2,570), merchant is novel, category spending this month is already 78% above baseline, and payment happened during off-hours.
              </p>
            </div>
            <button
              onClick={() => setSelectedAnomalyId('tx-anomaly-01')}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-glow-sm shadow-red-500/20 flex items-center justify-center gap-2 transition-transform active:scale-95 shrink-0"
            >
              <Eye className="w-4 h-4" />
              Open Complete Explanation
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs & Controls */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Severity Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['All', 'Critical', 'Suspicious', 'Watch', 'Resolved'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeFilter === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab}
              {tab === 'Critical' && criticalCount > 0 && ` (${criticalCount})`}
              {tab === 'Suspicious' && suspiciousCount > 0 && ` (${suspiciousCount})`}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search anomalies..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none"
          >
            <option value="score">Sort: Score</option>
            <option value="date">Sort: Date</option>
            <option value="amount">Sort: Amount</option>
          </select>
        </div>
      </div>

      {/* Anomaly Table / Cards */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {filteredAnomalies.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-80" />
            <h3 className="text-base font-bold text-white">You're all clear</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No anomalies detected for the selected filter. Every transaction is within your established baseline envelope.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Merchant</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Risk / Score</th>
                  <th className="py-3.5 px-4">Core Explanation</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredAnomalies.map(item => {
                  const tx = item.transaction;
                  const severityStyle = getSeverityStyle(item.severity);
                  const isCritical = item.severity === 'Critical';

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => setSelectedAnomalyId(tx.id)}
                    >
                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        <span className="block text-[10px] text-slate-400">
                          {new Date(tx.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      {/* Merchant */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                          {tx.merchant}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                          {tx.paymentMethod}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                          {tx.category}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-slate-100">
                        {settings.currencySymbol}{tx.amount.toLocaleString()}
                      </td>

                      {/* Risk & Score */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${severityStyle}`}>
                            {item.severity}
                          </span>
                          <span className="font-mono font-bold text-xs text-slate-300">
                            {item.score}/100
                          </span>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-xs text-slate-300 truncate font-medium">
                          {item.primaryReason}
                        </p>
                        <span className="text-[10px] text-indigo-400">
                          {item.reasons.length} contributing factor(s) • {item.confidence}% confidence
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedAnomalyId(tx.id)}
                            className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Review
                          </button>
                          {item.resolved ? (
                            <span className="px-2 py-1 text-[10px] text-emerald-400 bg-emerald-950/40 rounded border border-emerald-500/30">
                              Resolved
                            </span>
                          ) : (
                            <button
                              onClick={() => resolveAnomaly(tx.id, 'marked_normal')}
                              title="Dismiss and mark as normal"
                              className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
