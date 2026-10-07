import React from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  ReceiptText,
  PieChart,
  Sparkles,
  SlidersHorizontal,
  BarChart3,
  Settings,
  HelpCircle,
  RotateCcw,
  Database,
  Lock,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    allAnomaliesList,
    loadDemoData,
    resetDemo,
    setIsWhySpendGuardOpen,
    settings,
    logout
  } = useApp();

  const unresolvedAnomalies = allAnomaliesList.filter(a => a.severity !== 'Normal' && !a.resolved);
  const criticalCount = unresolvedAnomalies.filter(a => a.severity === 'Critical').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'anomalies',
      label: 'Anomaly Center',
      icon: ShieldAlert,
      badge: unresolvedAnomalies.length > 0 ? (
        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${criticalCount > 0 ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-amber-500/20 text-amber-400'}`}>
          {unresolvedAnomalies.length}
        </span>
      ) : null
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: ReceiptText,
      badge: null
    },
    {
      id: 'budgets',
      label: 'Budgets',
      icon: PieChart,
      badge: null
    },
    {
      id: 'insights',
      label: 'AI Insights',
      icon: Sparkles,
      badge: <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">AI</span>
    },
    {
      id: 'whatif',
      label: 'What-If Simulation',
      icon: SlidersHorizontal,
      badge: <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 rounded">NEW</span>
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="w-64 bg-[#0D1322] border-r border-slate-800 flex flex-col justify-between shrink-0 select-none h-screen sticky top-0 overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-glow-sm shadow-indigo-500/30 text-white font-black text-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">SPENDGUARD</span>
                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded">AI</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-none mt-1">Explainable Anomaly Engine</p>
            </div>
          </div>
        </div>

        {/* Hackathon Judge Highlight Banner */}
        <div className="p-3 mx-3 my-3 bg-gradient-to-r from-indigo-950/60 to-purple-950/60 rounded-xl border border-indigo-500/30">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🏆</span>
              <span className="text-xs font-bold text-indigo-200">IEEE Hackathon Demo</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
            Personal baselines & explainable factor decomposition.
          </p>
          <button
            onClick={() => setIsWhySpendGuardOpen(true)}
            className="w-full mt-2 py-1.5 px-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 shadow-sm"
          >
            Why SpendGuard? <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="px-3 space-y-1">
          <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Navigation</p>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer & Demo Controls */}
      <div className="p-3 border-t border-slate-800 space-y-3">
        {/* Demo Mode Action Box */}
        <div className="bg-[#111827] rounded-lg p-2.5 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Demo Control
            </span>
            <span className="text-[10px] text-slate-400 font-mono">v1.0-local</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={loadDemoData}
              title="Reload realistic 50+ transactions with flagship IEEE anomalies"
              className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium rounded flex items-center justify-center gap-1 transition-colors border border-slate-700"
            >
              <Database className="w-3 h-3 text-cyan-400" />
              Load Data
            </button>
            <button
              onClick={resetDemo}
              title="Reset all transactions"
              className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium rounded flex items-center justify-center gap-1 transition-colors border border-slate-700"
            >
              <RotateCcw className="w-3 h-3 text-amber-400" />
              Reset
            </button>
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              AM
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200 truncate">{settings.userName}</p>
              <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-emerald-400" /> Local Sandbox
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Switch demo login"
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
