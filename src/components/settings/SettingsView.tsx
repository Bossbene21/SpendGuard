import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  DollarSign,
  ShieldCheck,
  UserCheck,
  Database,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SensitivityLevel } from '../../types';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, loadDemoData, resetDemo } = useApp();

  const [newTrusted, setNewTrusted] = useState('');
  const [saveToast, setSaveToast] = useState(false);

  const handleSensitivityChange = (level: SensitivityLevel) => {
    updateSettings({ sensitivity: level });
    showNotification();
  };

  const handleCurrencyChange = (curr: string, symbol: string) => {
    updateSettings({ currency: curr, currencySymbol: symbol });
    showNotification();
  };

  const handleBudgetChange = (amount: number) => {
    updateSettings({ overallMonthlyBudget: amount });
    showNotification();
  };

  const handleAddTrusted = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrusted.trim()) return;
    if (!settings.trustedMerchants.includes(newTrusted.trim())) {
      updateSettings({
        trustedMerchants: [...settings.trustedMerchants, newTrusted.trim()]
      });
      setNewTrusted('');
      showNotification();
    }
  };

  const handleRemoveTrusted = (merchant: string) => {
    updateSettings({
      trustedMerchants: settings.trustedMerchants.filter(m => m !== merchant)
    });
    showNotification();
  };

  const showNotification = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Settings & Calibration</h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure anomaly thresholds, personal baseline sensitivity, and trusted merchants.
          </p>
        </div>

        {saveToast && (
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-lg flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Preferences Saved
          </span>
        )}
      </div>

      {/* Anomaly Engine Sensitivity Section */}
      <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-sm font-bold text-white">Anomaly Detection Sensitivity</h2>
            <p className="text-xs text-slate-400">
              Calibrates the multi-factor threshold required to classify a transaction as Watch or Critical.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* Low */}
          <button
            onClick={() => handleSensitivityChange('Low')}
            className={`p-4 rounded-xl border text-left transition-all ${
              settings.sensitivity === 'Low'
                ? 'bg-emerald-950/20 border-emerald-500 text-white shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs uppercase tracking-wider text-emerald-400">Low Sensitivity</span>
              {settings.sensitivity === 'Low' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <p className="text-xs text-slate-300">
              Only extreme deviations (e.g. 5× amount spikes, rapid duplicates) trigger alerts. Reduces false positives.
            </p>
          </button>

          {/* Medium */}
          <button
            onClick={() => handleSensitivityChange('Medium')}
            className={`p-4 rounded-xl border text-left transition-all ${
              settings.sensitivity === 'Medium'
                ? 'bg-indigo-950/30 border-indigo-500 text-white shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs uppercase tracking-wider text-indigo-300">Medium (Recommended)</span>
              {settings.sensitivity === 'Medium' && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
            </div>
            <p className="text-xs text-slate-300">
              Balanced sensitivity. Flags unusual categories, novel merchants, burst velocity, and 2.5×+ outliers.
            </p>
          </button>

          {/* High */}
          <button
            onClick={() => handleSensitivityChange('High')}
            className={`p-4 rounded-xl border text-left transition-all ${
              settings.sensitivity === 'High'
                ? 'bg-red-950/20 border-red-500 text-white shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs uppercase tracking-wider text-red-400">High Sensitivity</span>
              {settings.sensitivity === 'High' && <CheckCircle2 className="w-4 h-4 text-red-400" />}
            </div>
            <p className="text-xs text-slate-300">
              Strict envelope. Flags any merchant unseen in 60 days, off-hour transactions, or slight category velocity spikes.
            </p>
          </button>
        </div>
      </div>

      {/* Currency & Monthly Budget */}
      <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <DollarSign className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-sm font-bold text-white">Financial Baseline Preferences</h2>
            <p className="text-xs text-slate-400">Display currency and total monthly budget envelope.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Currency selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Currency</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'INR (₹)', curr: 'INR', sym: '₹' },
                { label: 'USD ($)', curr: 'USD', sym: '$' },
                { label: 'EUR (€)', curr: 'EUR', sym: '€' },
                { label: 'GBP (£)', curr: 'GBP', sym: '£' }
              ].map(item => (
                <button
                  key={item.curr}
                  onClick={() => handleCurrencyChange(item.curr, item.sym)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                    settings.currency === item.curr
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Monthly Budget Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Overall Monthly Budget ({settings.currencySymbol})
            </label>
            <input
              type="number"
              step="1000"
              value={settings.overallMonthlyBudget}
              onChange={e => handleBudgetChange(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Trusted Merchants Management */}
      <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <UserCheck className="w-5 h-5 text-indigo-400" />
          <div>
            <h2 className="text-sm font-bold text-white">Trusted Merchants Whitelist</h2>
            <p className="text-xs text-slate-400">
              Merchants in this whitelist will not receive novelty penalties during anomaly evaluation.
            </p>
          </div>
        </div>

        <form onSubmit={handleAddTrusted} className="flex gap-2">
          <input
            type="text"
            value={newTrusted}
            onChange={e => setNewTrusted(e.target.value)}
            placeholder="Add trusted merchant (e.g. Amazon, Local Grocer)..."
            className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-2">
          {settings.trustedMerchants.map(m => (
            <span
              key={m}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
            >
              <span>{m}</span>
              <button
                onClick={() => handleRemoveTrusted(m)}
                className="text-slate-500 hover:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Trust & Privacy Guarantee (Section 28) */}
      <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            Local Sandbox Privacy Assurance
          </span>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Your sample financial transactions and anomaly baseline scores are calculated entirely inside your client browser. No data is sent to external servers or remote AI APIs.
          </p>
        </div>
      </div>

      {/* Demo Controls */}
      <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl space-y-3">
        <h2 className="text-sm font-bold text-white">Evaluator Demo Reset Controls</h2>
        <p className="text-xs text-slate-400">
          Restore the pristine IEEE Hackathon dataset or reset all transactions to a blank state.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              loadDemoData();
              showNotification();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-slate-700"
          >
            <Database className="w-4 h-4 text-cyan-400" />
            Reload Flagship 50+ Demo Transactions
          </button>
          <button
            onClick={() => {
              resetDemo();
              showNotification();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-slate-700"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            Clear All Transactions
          </button>
        </div>
      </div>
    </div>
  );
};
