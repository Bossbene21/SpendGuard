import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Transaction,
  Category,
  CategoryBudget,
  UserSettings,
  AnomalyResult,
  CategoryBaseline,
  SensitivityLevel
} from '../types';
import { INITIAL_TRANSACTIONS, INITIAL_BUDGETS } from '../data/demoDataset';
import { computeCategoryBaselines } from '../engine/baseline';
import { evaluateTransactionAnomaly } from '../engine/anomalyEngine';

const STORAGE_KEYS = {
  TRANSACTIONS: 'spendguard_txs_v1',
  BUDGETS: 'spendguard_budgets_v1',
  SETTINGS: 'spendguard_settings_v1',
  RESOLUTIONS: 'spendguard_resolutions_v1',
  AUTH: 'spendguard_auth_v1'
};

const DEFAULT_SETTINGS: UserSettings = {
  currency: 'INR',
  currencySymbol: '₹',
  overallMonthlyBudget: 60000,
  sensitivity: 'Medium',
  userName: 'Alex Morgan',
  userEmail: 'demo@spendguard.ai',
  trustedMerchants: ['Food Palace', 'Metro Transit Smartcard', 'Spotify Premium', 'Netflix India']
};

interface AppContextType {
  transactions: Transaction[];
  budgets: Record<string, CategoryBudget>;
  settings: UserSettings;
  baselines: Record<Category, CategoryBaseline>;
  anomalies: Record<string, AnomalyResult>;
  allAnomaliesList: (AnomalyResult & { transaction: Transaction })[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedAnomalyId: string | null;
  setSelectedAnomalyId: (id: string | null) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isWhySpendGuardOpen: boolean;
  setIsWhySpendGuardOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  lastAddedAnomaly: AnomalyResult | null;
  clearLastAddedAnomaly: () => void;
  // Actions
  addTransaction: (tx: Omit<Transaction, 'id'>) => AnomalyResult;
  editTransaction: (tx: Transaction) => void;
  deleteTransaction: (id: string) => void;
  resolveAnomaly: (txId: string, resolution: 'marked_normal' | 'trusted_merchant' | 'confirmed_flag') => void;
  updateBudget: (category: Category, limit: number) => void;
  updateSettings: (partial: Partial<UserSettings>) => void;
  loadDemoData: () => void;
  resetDemo: () => void;
  // Auth
  isAuthenticated: boolean;
  login: (email?: string, password?: string) => boolean;
  logout: () => void;
  // Demo interactive guide step
  demoStep: number;
  setDemoStep: (step: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or defaults
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState<Record<string, CategoryBudget>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BUDGETS;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SETTINGS;
  });

  const [resolutions, setResolutions] = useState<Record<string, { resolved: boolean; type?: string }>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RESOLUTIONS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch (e) {
      return true; // Default to true for instant demo access
    }
  });

  // Navigation and Modals state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isWhySpendGuardOpen, setIsWhySpendGuardOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [lastAddedAnomaly, setLastAddedAnomaly] = useState<AnomalyResult | null>(null);
  const [demoStep, setDemoStep] = useState<number>(0);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {}
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    } catch (e) {}
  }, [budgets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESOLUTIONS, JSON.stringify(resolutions));
    } catch (e) {}
  }, [resolutions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, isAuthenticated ? 'true' : 'false');
    } catch (e) {}
  }, [isAuthenticated]);

  // Compute personal baseline dynamically
  const baselines = useMemo(() => {
    return computeCategoryBaselines(transactions);
  }, [transactions]);

  // Evaluate anomalies across all transactions
  const anomalies = useMemo(() => {
    const results: Record<string, AnomalyResult> = {};
    for (const tx of transactions) {
      results[tx.id] = evaluateTransactionAnomaly(tx, {
        allTransactions: transactions,
        baselines,
        budgets: budgets as any,
        sensitivity: settings.sensitivity,
        trustedMerchants: settings.trustedMerchants,
        resolvedMap: resolutions
      });
    }
    return results;
  }, [transactions, baselines, budgets, settings.sensitivity, settings.trustedMerchants, resolutions]);

  // Flattened anomaly list paired with transaction data
  const allAnomaliesList = useMemo(() => {
    return transactions
      .map(tx => {
        const anomaly = anomalies[tx.id];
        return anomaly ? { ...anomaly, transaction: tx } : null;
      })
      .filter((item): item is AnomalyResult & { transaction: Transaction } => item !== null)
      .sort((a, b) => {
        // Sort critical/suspicious first, then by date descending
        const severityWeight = { Critical: 4, Suspicious: 3, Watch: 2, Normal: 1 };
        const weightDiff = severityWeight[b.severity] - severityWeight[a.severity];
        if (weightDiff !== 0) return weightDiff;
        return new Date(b.transaction.date).getTime() - new Date(a.transaction.date).getTime();
      });
  }, [transactions, anomalies]);

  const addTransaction = useCallback((txData: Omit<Transaction, 'id'>): AnomalyResult => {
    const newId = `tx-${Date.now()}`;
    const newTx: Transaction = {
      ...txData,
      id: newId
    };

    const updatedList = [newTx, ...transactions];
    setTransactions(updatedList);

    // Calculate baseline with the new transaction context
    const currentBaselines = computeCategoryBaselines(updatedList);
    const result = evaluateTransactionAnomaly(newTx, {
      allTransactions: updatedList,
      baselines: currentBaselines,
      budgets: budgets as any,
      sensitivity: settings.sensitivity,
      trustedMerchants: settings.trustedMerchants,
      resolvedMap: resolutions
    });

    setLastAddedAnomaly(result);
    return result;
  }, [transactions, budgets, settings, resolutions]);

  const editTransaction = useCallback((updatedTx: Transaction) => {
    setTransactions(prev => prev.map(t => (t.id === updatedTx.id ? updatedTx : t)));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    if (selectedAnomalyId === id) setSelectedAnomalyId(null);
  }, [selectedAnomalyId]);

  const resolveAnomaly = useCallback((
    txId: string,
    resolution: 'marked_normal' | 'trusted_merchant' | 'confirmed_flag'
  ) => {
    setResolutions(prev => ({
      ...prev,
      [txId]: { resolved: true, type: resolution }
    }));

    if (resolution === 'trusted_merchant') {
      const tx = transactions.find(t => t.id === txId);
      if (tx && !settings.trustedMerchants.includes(tx.merchant)) {
        setSettings(prev => ({
          ...prev,
          trustedMerchants: [...prev.trustedMerchants, tx.merchant]
        }));
      }
    }
  }, [transactions, settings.trustedMerchants]);

  const updateBudget = useCallback((category: Category, limit: number) => {
    setBudgets(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] || { category, spent: 0, color: '#3B82F6' }),
        limit
      }
    }));
  }, []);

  const updateSettings = useCallback((partial: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  const loadDemoData = useCallback(() => {
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    setSettings(DEFAULT_SETTINGS);
    setResolutions({});
    setSelectedAnomalyId(null);
    setLastAddedAnomaly(null);
  }, []);

  const resetDemo = useCallback(() => {
    setTransactions([]);
    setResolutions({});
    setSelectedAnomalyId(null);
    setLastAddedAnomaly(null);
  }, []);

  const login = useCallback((_email?: string, _pass?: string) => {
    setIsAuthenticated(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const clearLastAddedAnomaly = useCallback(() => {
    setLastAddedAnomaly(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        transactions,
        budgets,
        settings,
        baselines,
        anomalies,
        allAnomaliesList,
        activeTab,
        setActiveTab,
        selectedAnomalyId,
        setSelectedAnomalyId,
        isAddModalOpen,
        setIsAddModalOpen,
        isWhySpendGuardOpen,
        setIsWhySpendGuardOpen,
        isSearchOpen,
        setIsSearchOpen,
        lastAddedAnomaly,
        clearLastAddedAnomaly,
        addTransaction,
        editTransaction,
        deleteTransaction,
        resolveAnomaly,
        updateBudget,
        updateSettings,
        loadDemoData,
        resetDemo,
        isAuthenticated,
        login,
        logout,
        demoStep,
        setDemoStep
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
