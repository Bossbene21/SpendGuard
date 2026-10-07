import React, { useState } from 'react';
import {
  X,
  Plus,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Sparkles,
  CreditCard,
  Building,
  Tag,
  Calendar,
  FileText
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
    settings,
    setSelectedAnomalyId
  } = useApp();

  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [date, setDate] = useState('2026-10-07T11:00');
  const [description, setDescription] = useState('');

  // Result banner state after adding
  const [resultAnomaly, setResultAnomaly] = useState<AnomalyResult | null>(null);

  if (!isAddModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!merchant.trim() || isNaN(numAmount) || numAmount <= 0) return;

    const res = addTransaction({
      merchant: merchant.trim(),
      amount: numAmount,
      category,
      paymentMethod,
      date: new Date(date).toISOString(),
      description: description.trim() || `${category} purchase at ${merchant}`
    });

    setResultAnomaly(res);
  };

  const handleApplyPreset = (
    pMerchant: string,
    pAmount: number,
    pCategory: Category,
    pPay: PaymentMethod,
    pDate: string,
    pDesc: string
  ) => {
    setMerchant(pMerchant);
    setAmount(pAmount.toString());
    setCategory(pCategory);
    setPaymentMethod(pPay);
    setDate(pDate);
    setDescription(pDesc);
    setResultAnomaly(null);
  };

  const handleClose = () => {
    setIsAddModalOpen(false);
    setResultAnomaly(null);
    setMerchant('');
    setAmount('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#101726] border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-sm">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">ADD EXPENSE</h2>
              <p className="text-xs text-slate-400">
                Instant personal baseline check & explainable anomaly scoring
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Fast Presets */}
        <div className="p-3 bg-slate-900/80 border-b border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> Demo Quick Presets (Click to Test)
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() =>
                handleApplyPreset(
                  'Cafe Coffee Day',
                  180,
                  'Food',
                  'UPI',
                  '2026-10-07T11:15',
                  'Cold coffee & chocolate chip cookie'
                )
              }
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded text-[11px] font-medium border border-slate-700"
            >
              ☕ Normal Coffee (₹180)
            </button>
            <button
              type="button"
              onClick={() =>
                handleApplyPreset(
                  'Apex VR Systems',
                  9800,
                  'Electronics',
                  'Credit Card',
                  '2026-10-07T11:20',
                  'VR Headset & Developer Sensor Kit'
                )
              }
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded text-[11px] font-medium border border-slate-700"
            >
              ⚡ Outlier Gadget (₹9,800)
            </button>
            <button
              type="button"
              onClick={() =>
                handleApplyPreset(
                  'Starbucks Coffee',
                  1450,
                  'Food',
                  'UPI',
                  '2026-10-06T10:19',
                  'Duplicate swipe attempt'
                )
              }
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-[11px] font-medium border border-slate-700"
            >
              🔁 Duplicate Test (₹1,450)
            </button>
            <button
              type="button"
              onClick={() =>
                handleApplyPreset(
                  'Midnight Arcade',
                  4200,
                  'Entertainment',
                  'UPI',
                  '2026-10-07T03:30',
                  'Late night VIP pass'
                )
              }
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-orange-400 rounded text-[11px] font-medium border border-slate-700"
            >
              🌙 3:30 AM Outlier (₹4,200)
            </button>
          </div>
        </div>

        {/* Live Anomaly Detection Result Banner */}
        {resultAnomaly && (
          <div
            className={`p-4 mx-4 mt-4 rounded-xl border animate-in zoom-in-95 duration-200 ${
              resultAnomaly.severity === 'Normal'
                ? 'bg-emerald-950/40 border-emerald-500/30'
                : resultAnomaly.severity === 'Critical'
                ? 'bg-red-950/40 border-red-500/40 shadow-glow-danger'
                : 'bg-amber-950/40 border-amber-500/40'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    resultAnomaly.severity === 'Normal'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {resultAnomaly.severity === 'Normal' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <ShieldAlert className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {resultAnomaly.severity === 'Normal'
                        ? 'Transaction Verified (Normal Spending)'
                        : `Transaction Added — Anomaly Detected!`}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        resultAnomaly.severity === 'Normal'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : resultAnomaly.severity === 'Critical'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      SCORE {resultAnomaly.score}/100 • {resultAnomaly.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {resultAnomaly.reasons[0]}
                  </p>
                </div>
              </div>

              {resultAnomaly.severity !== 'Normal' && (
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setSelectedAnomalyId(resultAnomaly.transactionId);
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
                >
                  View Decomposition
                </button>
              )}
            </div>
          </div>
        )}

        {/* Expense Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Merchant */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Merchant / Payee *
              </label>
              <div className="relative">
                <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={merchant}
                  onChange={e => setMerchant(e.target.value)}
                  placeholder="e.g. TechZone Electronics"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Amount ({settings.currencySymbol}) *
              </label>
              <input
                type="number"
                step="any"
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="e.g. 8750"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-mono font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {PAYMENT_METHODS.map(pm => (
                  <option key={pm} value={pm}>{pm}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date & Time */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Description / Memo
              </label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Optional memo or item note"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Submit buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-glow-sm shadow-indigo-500/30 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Record & Run Anomaly Engine</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
