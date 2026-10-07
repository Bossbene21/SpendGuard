import React, { useState, useEffect } from 'react';
import { X, Save, Edit3, Trash2 } from 'lucide-react';
import { Transaction, Category, PaymentMethod } from '../../types';
import { useApp } from '../../context/AppContext';

interface EditExpenseModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

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

export const EditExpenseModal: React.FC<EditExpenseModalProps> = ({ transaction, onClose }) => {
  const { editTransaction, deleteTransaction, settings } = useApp();

  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (transaction) {
      setMerchant(transaction.merchant);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
      setPaymentMethod(transaction.paymentMethod);
      setDate(transaction.date.substring(0, 16));
      setDescription(transaction.description);
    }
  }, [transaction]);

  if (!transaction) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!merchant.trim() || isNaN(numAmount) || numAmount <= 0) return;

    editTransaction({
      ...transaction,
      merchant: merchant.trim(),
      amount: numAmount,
      category,
      paymentMethod,
      date: new Date(date).toISOString(),
      description: description.trim()
    });

    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Delete transaction from ${transaction.merchant}?`)) {
      deleteTransaction(transaction.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#101726] border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">EDIT TRANSACTION</h2>
              <p className="text-xs text-slate-400">Updates will automatically recompute anomalies</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Merchant</label>
              <input
                type="text"
                required
                value={merchant}
                onChange={e => setMerchant(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Amount ({settings.currencySymbol})</label>
              <input
                type="number"
                step="any"
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
              >
                {PAYMENT_METHODS.map(pm => <option key={pm} value={pm}>{pm}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Date</label>
              <input
                type="datetime-local"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
