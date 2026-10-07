import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  Trash2,
  Edit,
  ShieldAlert,
  CheckCircle,
  Eye,
  ArrowUpDown,
  CreditCard,
  Calendar,
  Sparkles,
  Tag,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Transaction, Category, PaymentMethod } from '../../types';

export const TransactionList: React.FC = () => {
  const {
    transactions,
    anomalies,
    settings,
    deleteTransaction,
    editTransaction,
    setSelectedAnomalyId,
    setIsAddModalOpen
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMethod, setSelectedMethod] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'merchant' | 'score'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Edit transaction state
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const anomaly = anomalies[tx.id];

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesMerchant = tx.merchant.toLowerCase().includes(q);
        const matchesDesc = tx.description.toLowerCase().includes(q);
        const matchesAmt = tx.amount.toString().includes(q);
        const matchesCat = tx.category.toLowerCase().includes(q);
        if (!matchesMerchant && !matchesDesc && !matchesAmt && !matchesCat) return false;
      }

      // Category
      if (selectedCategory !== 'All' && tx.category !== selectedCategory) {
        return false;
      }

      // Payment method
      if (selectedMethod !== 'All' && tx.paymentMethod !== selectedMethod) {
        return false;
      }

      // Risk filter
      if (selectedRisk !== 'All') {
        if (!anomaly) return false;
        if (selectedRisk === 'Flagged' && anomaly.severity === 'Normal') return false;
        if (selectedRisk !== 'Flagged' && anomaly.severity !== selectedRisk) return false;
      }

      return true;
    }).sort((a, b) => {
      let diff = 0;
      if (sortBy === 'date') {
        diff = new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'amount') {
        diff = b.amount - a.amount;
      } else if (sortBy === 'merchant') {
        diff = a.merchant.localeCompare(b.merchant);
      } else if (sortBy === 'score') {
        const scoreA = anomalies[a.id]?.score || 0;
        const scoreB = anomalies[b.id]?.score || 0;
        diff = scoreB - scoreA;
      }
      return sortOrder === 'desc' ? diff : -diff;
    });
  }, [transactions, anomalies, searchQuery, selectedCategory, selectedMethod, selectedRisk, sortBy, sortOrder]);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;
    editTransaction(editingTx);
    setEditingTx(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Transactions</h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse, filter, edit, and analyze personal financial outflow.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-glow-sm shadow-indigo-500/25 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="relative md:col-span-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search merchant, notes, amount..."
              className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Electronics">Electronics</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Travel">Travel</option>
              <option value="Subscriptions">Subscriptions</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <select
              value={selectedMethod}
              onChange={e => setSelectedMethod(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Payment Methods</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          {/* Anomaly / Risk Status */}
          <div>
            <select
              value={selectedRisk}
              onChange={e => setSelectedRisk(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Risk Statuses</option>
              <option value="Flagged">Any Anomaly Flagged</option>
              <option value="Critical">Critical Only</option>
              <option value="Suspicious">Suspicious Only</option>
              <option value="Watch">Watch Only</option>
              <option value="Normal">Normal Only</option>
            </select>
          </div>
        </div>

        {/* Sorting options bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
          <span>
            Showing <strong className="text-slate-200">{filteredTransactions.length}</strong> of {transactions.length} records
          </span>

          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            {(['date', 'amount', 'merchant', 'score'] as const).map(s => (
              <button
                key={s}
                onClick={() => {
                  if (sortBy === s) {
                    setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
                  } else {
                    setSortBy(s);
                    setSortOrder('desc');
                  }
                }}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold capitalize transition-colors ${
                  sortBy === s ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30' : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                {s} {sortBy === s && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CreditCard className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-200">No transactions match your search</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the filters or add a new transaction.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Merchant & Description</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Engine Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTransactions.map(tx => {
                  const anomaly = anomalies[tx.id];
                  const isFlagged = anomaly && anomaly.severity !== 'Normal';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Date */}
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        <div>{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        <div className="text-[10px] text-slate-400">{new Date(tx.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>

                      {/* Merchant & Description */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-200">{tx.merchant}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs">{tx.description}</div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                          {tx.category}
                        </span>
                      </td>

                      {/* Payment Method */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                        {tx.paymentMethod}
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 text-right whitespace-nowrap font-bold text-white">
                        {settings.currencySymbol}{tx.amount.toLocaleString()}
                      </td>

                      {/* Anomaly Status Pill */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {isFlagged ? (
                          <button
                            onClick={() => setSelectedAnomalyId(tx.id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-transform hover:scale-105 ${
                              anomaly.severity === 'Critical'
                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                : anomaly.severity === 'Suspicious'
                                ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            <ShieldAlert className="w-3 h-3" />
                            <span>{anomaly.severity} ({anomaly.score})</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle className="w-3 h-3" />
                            <span>Normal</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {isFlagged && (
                            <button
                              onClick={() => setSelectedAnomalyId(tx.id)}
                              title="Inspect Explainable Breakdown"
                              className="p-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => setEditingTx(tx)}
                            title="Edit transaction"
                            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteTransaction(tx.id)}
                            title="Delete transaction"
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* Edit Transaction Modal */}
      {editingTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-[#0F172A] border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Edit Transaction</h3>
              <button onClick={() => setEditingTx(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Merchant</label>
                <input
                  type="text"
                  required
                  value={editingTx.merchant}
                  onChange={e => setEditingTx({ ...editingTx, merchant: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Amount</label>
                <input
                  type="number"
                  required
                  value={editingTx.amount}
                  onChange={e => setEditingTx({ ...editingTx, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={editingTx.category}
                  onChange={e => setEditingTx({ ...editingTx, category: e.target.value as Category })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {['Food', 'Transport', 'Shopping', 'Bills', 'Electronics', 'Entertainment', 'Healthcare', 'Education', 'Travel', 'Subscriptions', 'Other'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  value={editingTx.description}
                  onChange={e => setEditingTx({ ...editingTx, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTx(null)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl"
                >
                  Save & Re-evaluate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
