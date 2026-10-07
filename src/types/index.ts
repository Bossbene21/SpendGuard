export type Category =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Entertainment'
  | 'Healthcare'
  | 'Education'
  | 'Travel'
  | 'Electronics'
  | 'Subscriptions'
  | 'Other';

export type PaymentMethod =
  | 'UPI'
  | 'Credit Card'
  | 'Debit Card'
  | 'Cash'
  | 'Bank Transfer';

export type AnomalySeverity = 'Normal' | 'Watch' | 'Suspicious' | 'Critical';

export type SensitivityLevel = 'Low' | 'Medium' | 'High';

export interface FactorBreakdown {
  name: string;
  score: number;
  maxScore: number;
  weightLabel: string;
  description: string;
  isFlagged: boolean;
}

export interface AnomalyResult {
  transactionId: string;
  score: number; // 0 - 100
  severity: AnomalySeverity;
  confidence: number; // e.g. 88 - 96%
  primaryReason: string;
  reasons: string[];
  factors: {
    amount: FactorBreakdown;
    merchant: FactorBreakdown;
    category: FactorBreakdown;
    frequency: FactorBreakdown;
    time: FactorBreakdown;
    duplicate: FactorBreakdown;
    velocity: FactorBreakdown;
    budgetImpact: FactorBreakdown;
  };
  recommendedAction: string;
  resolved: boolean;
  resolutionType?: 'marked_normal' | 'trusted_merchant' | 'confirmed_flag';
  resolvedAt?: string;
}

export interface Transaction {
  id: string;
  date: string; // ISO string e.g. "2026-10-07T14:32:00"
  merchant: string;
  amount: number;
  category: Category;
  paymentMethod: PaymentMethod;
  description: string;
  isRecurring?: boolean;
  tags?: string[];
}

export interface CategoryBaseline {
  category: Category;
  avgAmount: number;
  medianAmount: number;
  stdDev: number;
  minAmount: number;
  maxAmount: number;
  transactionCount: number;
  weeklyFrequency: number;
  monthlyTotal: number;
  knownMerchants: string[];
  typicalDays: number[]; // 0 = Sunday, 6 = Saturday
  typicalHoursRange: [number, number]; // e.g. [8, 22]
  velocityRatePerHour: number;
}

export interface CategoryBudget {
  category: Category;
  limit: number;
  spent: number;
  color: string;
}

export interface UserSettings {
  currency: string;
  currencySymbol: string;
  overallMonthlyBudget: number;
  sensitivity: SensitivityLevel;
  userName: string;
  userEmail: string;
  trustedMerchants: string[];
}

export interface WhatIfScenario {
  amount: number;
  category: Category;
  date: string;
  merchant: string;
}

export interface WhatIfResult {
  category: Category;
  newSpent: number;
  limit: number;
  utilizationPercent: number;
  overrunAmount: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  projectedMonthEnd: number;
  anomalyScore: number;
  insightSummary: string;
}
