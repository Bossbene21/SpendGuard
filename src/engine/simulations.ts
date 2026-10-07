import { Category, Transaction, CategoryBudget, WhatIfResult, CategoryBaseline } from '../types';

export function simulateWhatIfExpense(
  amount: number,
  category: Category,
  merchant: string,
  transactions: Transaction[],
  budgets: Record<Category, CategoryBudget>,
  baselines: Record<Category, CategoryBaseline>
): WhatIfResult {
  const budget = budgets[category] || { limit: 8000, spent: 0, category, color: '#3B82F6' };
  const baseline = baselines[category] || { avgAmount: 500, monthlyTotal: 6000 };

  const currentCategorySpent = transactions
    .filter(t => t.category === category)
    .reduce((sum, t) => sum + t.amount, 0);

  const newSpent = currentCategorySpent + amount;
  const limit = budget.limit;
  const utilizationPercent = Math.round((newSpent / limit) * 100);
  const overrunAmount = Math.max(0, newSpent - limit);

  // Overall monthly projection
  const currentTotalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const projectedMonthEnd = currentTotalSpent + amount;

  // Predict simulated anomaly score
  const ratio = baseline.avgAmount > 0 ? amount / baseline.avgAmount : 1;
  let simulatedScore = 15;
  if (ratio > 4) simulatedScore += 35;
  else if (ratio > 2.5) simulatedScore += 25;
  else if (ratio > 1.5) simulatedScore += 15;

  if (utilizationPercent > 120) simulatedScore += 30;
  else if (utilizationPercent > 100) simulatedScore += 20;
  else if (utilizationPercent > 85) simulatedScore += 10;

  // Risk Level
  let riskLevel: WhatIfResult['riskLevel'] = 'Low';
  if (utilizationPercent > 130 || simulatedScore >= 75) riskLevel = 'Severe';
  else if (utilizationPercent > 100 || simulatedScore >= 60) riskLevel = 'High';
  else if (utilizationPercent > 80 || simulatedScore >= 40) riskLevel = 'Moderate';

  let insightSummary = '';
  if (overrunAmount > 0) {
    insightSummary = `This expense would exceed your ${category} budget by ₹${overrunAmount.toLocaleString()} (${utilizationPercent}% utilization). It is ${ratio.toFixed(1)}× your typical ${category} ticket.`;
  } else if (utilizationPercent > 85) {
    insightSummary = `Safe within limits, but consumes ${utilizationPercent}% of remaining ${category} envelope. Leaves ₹${(limit - newSpent).toLocaleString()} for rest of month.`;
  } else {
    insightSummary = `Comfortably within your personal baseline. ${category} spending remains healthy at ${utilizationPercent}% allocation.`;
  }

  return {
    category,
    newSpent,
    limit,
    utilizationPercent,
    overrunAmount,
    riskLevel,
    projectedMonthEnd,
    anomalyScore: Math.min(99, simulatedScore),
    insightSummary
  };
}
