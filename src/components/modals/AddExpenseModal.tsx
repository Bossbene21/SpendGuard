import React, { useState } from 'react';
import {
  X,
  Plus,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Category, PaymentMethod, AnomalyResult } from '../../types';

const CATEGORIES: Category[] = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Healthcare',
  'Education',
  'Travel',
  'Electronics',
  'Subscriptions',
  'Other'
];

const PAYMENT_METHODS: PaymentMethod[] = [
  'UPI',
  'Credit Card',
  'Debit Card',
  'Cash',
  'Bank Transfer'
];

export const AddExpenseModal: React.FC = () => {
  const {
    isAddModalOpen,
    setIsAddModalOpen,
    addTransaction,
    setSelectedAnomalyId,
    settings,
    baselines
  } = useApp();

  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 16));

  // Result state after adding
  const [analysisResult, setAnalysisResult] = useState<{
    anomaly: AnomalyResult;
    merchant: string;
    amount: number;
    category: Category;
  } | null>(null);

  if (!isAddModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!merchant.trim() || isNaN(numAmount) || numAmount <= 0) return;

    const result = addTransaction({
      merchant: merchant.trim(),
      amount: numAmount,
      category,
      paymentMethod,
      description: description.trim() || `${category} expense at ${merchant.trim()}`,
      date: new Date(date).toISOString()
    });

    setAnalysisResult({
      anomaly: result,
      merchant: merchant.trim(),
      amount: numAmount,
      category
    });
  };

  const handleResetForm = () => {
    setAnalysisResult(null);
    setMerchant('');
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().slice(0, 16));
  };

  const handleClose = () => {
    handleResetForm();
    setIsAddModalOpen(false);
  };

  // Quick preset fills for judges
  const applyPreset = (preset: {
    merchant: string;
    amount: string;
    category: Category;
    paymentMethod: PaymentMethod;
    description: string;
  }) => {
    setMerchant(preset.merchant);
    setAmount(preset.amount);
    setCategory(preset.category);
    setPaymentMethod(preset.paymentMethod);
    setDescription(preset.description);
  };

  const currentBaseline = baselines[category];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-[#0F172A] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Add New Expense</h2>
              <p className="text-xs text-slate-400">Instant anomaly analysis triggered upon submission</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {analysisResult ? (
          /* Realtime Analysis Result Card */
          <div className="p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div
              className={`p-5 rounded-2xl border ${
                analysisResult.anomaly.severity === 'Critical'
                  ? 'bg-red-950/30 border-red-500/40'
                  : analysisResult.anomaly.severity === 'Suspicious'
                  ? 'bg-orange-950/30 border-orange-500/40'
                  : analysisResult.anomaly.severity === 'Watch'
                  ? 'bg-amber-950/30 border-amber-500/40'
                  : 'bg-emerald-950/30 border-emerald-500/40'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                      analysisResult.anomaly.severity === 'Critical'
                        ? 'bg-red-500/20 text-red-400'
                        : analysisResult.anomaly.severity === 'Suspicious'
                        ? 'bg-orange-500/20 text-orange-400'
                        : analysisResult.anomaly.severity === 'Watch'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {analysisResult.anomaly.severity === 'Normal' ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <ShieldAlert className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Engine Verdict
                    </span>
                    <h3 className="text-base font-bold text-white">
                      {analysisResult.anomaly.severity === 'Normal'
                        ? 'Transaction Verified Normal'
                        : `Anomaly Detected — ${analysisResult.anomaly.severity}`}
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Anomaly Score</span>
                  <span
                    className={`text-2xl font-black ${
                      analysisResult.anomaly.score >= 70
                        ? 'text-red-400'
                        : analysisResult.anomaly.score >= 40
                        ? 'text-orange-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {analysisResult.anomaly.score}/100
                  </span>
                </div>
              </div>

              {/* Explanations */}
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                <p className="text-xs font-semibold text-slate-200">
                  {analysisResult.anomaly.primaryReason}
                </p>
                {analysisResult.anomaly.reasons.length > 1 && (
                  <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                    {analysisResult.anomaly.reasons.slice(1, 3).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Confidence: {analysisResult.anomaly.confidence}%</span>
                <span>Category avg: {settings.currencySymbol}{(currentBaseline?.avgAmount || 500).toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {analysisResult.anomaly.severity !== 'Normal' && (
                <button
                  onClick={() => {
                    setSelectedAnomalyId(analysisResult.anomaly.transactionId);
                    handleClose();
                  }}
                  className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4" />
                  View Full Breakdown
                </button>
              )}
              <button
                onClick={handleResetForm}
                className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Another
              </button>
            </div>
          </div>
        ) : (
          /* Expense Entry Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Quick Demo Fill Buttons for Evaluators */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Quick Demo Scenarios for Judges:
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    applyPreset({
                      merchant: 'Croma Megastore',
                      amount: '9499',
                      category: 'Electronics',
                      paymentMethod: 'Credit Card',
                      description: 'Brand new 4K monitor purchase'
                    })
                  }
                  className="p-2 text-left bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] text-slate-300 transition-colors"
                >
                  <span className="font-semibold text-rose-300 block">Outlier Anomaly</span>
                  <span className="text-[10px] text-slate-400">₹9,499 Electronics</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyPreset({
                      merchant: 'Starbucks Coffee',
                      amount: '1450',
                      category: 'Food',
                      paymentMethod: 'UPI',
                      description: 'Double swipe at POS machine'
                    })
                  }
                  className="p-2 text-left bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] text-slate-300 transition-colors"
                >
                  <span className="font-semibold text-amber-300 block">Duplicate Check</span>
                  <span className="text-[10px] text-slate-400">₹1,450 Starbucks</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyPreset({
                      merchant: 'Taj Buffet Experience',
                      amount: '4800',
                      category: 'Food',
                      paymentMethod: 'Credit Card',
                      description: 'Splurge dining with family'
                    })
                  }
                  className="p-2 text-left bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] text-slate-300 transition-colors"
                >
                  <span className="font-semibold text-orange-300 block">Food Spike</span>
                  <span className="text-[10px] text-slate-400">₹4,800 vs normal ₹350</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyPreset({
                      merchant: 'Food Palace',
                      amount: '380',
                      category: 'Food',
                      paymentMethod: 'UPI',
                      description: 'Usual weekday lunch combo'
                    })
                  }
                  className="p-2 text-left bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] text-slate-300 transition-colors"
                >
                  <span className="font-semibold text-emerald-300 block">Normal Baseline</span>
                  <span className="text-[10px] text-slate-400">₹380 Food Palace</span>
                </button>
              </div>
            </div>

            {/* Merchant and Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Merchant Name *
                </label>
                <input
                  type="text"
                  required
                  value={merchant}
                  onChange={e => setMerchant(e.target.value)}
                  placeholder="e.g. Apple Store, Swiggy"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Amount ({settings.currencySymbol}) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono font-bold"
                />
              </div>
            </div>

            {/* Category and Payment Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as Category)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {currentBaseline && (
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Your baseline avg: {settings.currencySymbol}{currentBaseline.avgAmount.toLocaleString()}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {PAYMENT_METHODS.map(m => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date and Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Optional notes or items..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold rounded-xl shadow-glow-sm shadow-indigo-500/25 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Analyze & Record Expense
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
