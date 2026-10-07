import {
  Transaction,
  Category,
  AnomalyResult,
  AnomalySeverity,
  CategoryBaseline,
  CategoryBudget,
  SensitivityLevel,
  FactorBreakdown
} from '../types';
import { checkDuplicateTransaction, checkSpendingVelocity } from './velocity';

interface AnomalyEngineContext {
  allTransactions: Transaction[];
  baselines: Record<Category, CategoryBaseline>;
  budgets?: Record<Category, CategoryBudget>;
  sensitivity: SensitivityLevel;
  trustedMerchants?: string[];
  resolvedMap?: Record<string, { resolved: boolean; type?: string }>;
}

export function evaluateTransactionAnomaly(
  tx: Transaction,
  context: AnomalyEngineContext
): AnomalyResult {
  const { allTransactions, baselines, budgets, sensitivity, trustedMerchants = [], resolvedMap = {} } = context;

  // Check if user already marked it as resolved/normal
  const existingResolution = resolvedMap[tx.id];
  if (existingResolution?.resolved && existingResolution.type === 'marked_normal') {
    return createNormalOverrideResult(tx);
  }

  const baseline = baselines[tx.category] || {
    avgAmount: 500,
    medianAmount: 500,
    stdDev: 200,
    transactionCount: 1,
    knownMerchants: [],
    typicalDays: [0, 1, 2, 3, 4, 5, 6],
    typicalHoursRange: [8, 22],
    monthlyTotal: 500
  };

  const reasons: string[] = [];

  // ==========================================
  // 1. AMOUNT DEVIATION (0 - 30 points)
  // ==========================================
  let amountScore = 0;
  let amountDesc = 'Within expected range for this category.';
  let isAmountFlagged = false;
  const ratioToAvg = baseline.avgAmount > 0 ? tx.amount / baseline.avgAmount : 1;

  if (ratioToAvg >= 5.0) {
    amountScore = 30;
    isAmountFlagged = true;
    amountDesc = `Amount is ${(ratioToAvg).toFixed(1)}× higher than your typical ${tx.category} transaction (avg ₹${baseline.avgAmount.toLocaleString()}).`;
    reasons.push(`Amount of ₹${tx.amount.toLocaleString()} is ${(ratioToAvg).toFixed(1)}× above your normal ${tx.category} average.`);
  } else if (ratioToAvg >= 3.0) {
    amountScore = 26;
    isAmountFlagged = true;
    amountDesc = `Amount is ${(ratioToAvg).toFixed(1)}× higher than your typical ${tx.category} transaction (avg ₹${baseline.avgAmount.toLocaleString()}).`;
    reasons.push(`Amount is ${(ratioToAvg).toFixed(1)}× higher than typical ${tx.category} spending.`);
  } else if (ratioToAvg >= 2.0) {
    amountScore = 18;
    isAmountFlagged = true;
    amountDesc = `Amount exceeds typical average by ${(ratioToAvg).toFixed(1)}×.`;
    reasons.push(`Amount is ${(ratioToAvg).toFixed(1)}× your typical ${tx.category} transaction.`);
  } else if (ratioToAvg >= 1.5) {
    amountScore = 10;
    amountDesc = `Slightly higher than normal average (${(ratioToAvg).toFixed(1)}×).`;
  } else if (tx.amount < baseline.avgAmount * 0.1 && baseline.avgAmount > 1000) {
    amountScore = 4;
    amountDesc = 'Unusually low micro-transaction for this category.';
  } else {
    amountScore = 2;
    amountDesc = `Aligned with personal average of ₹${baseline.avgAmount.toLocaleString()}.`;
  }

  // ==========================================
  // 2. MERCHANT NOVELTY (0 - 15 points)
  // ==========================================
  let merchantScore = 0;
  let merchantDesc = 'Recognized merchant in your history.';
  let isMerchantFlagged = false;
  const normalizedMerchant = tx.merchant.trim().toLowerCase();
  const isTrusted = trustedMerchants.some(m => m.trim().toLowerCase() === normalizedMerchant);
  const isKnown = baseline.knownMerchants.includes(normalizedMerchant) || isTrusted;

  if (isTrusted) {
    merchantScore = 0;
    merchantDesc = `Merchant marked as trusted by user.`;
  } else if (!isKnown) {
    // Check if known in ANY category
    const knownAnywhere = allTransactions.some(
      t => t.id !== tx.id && t.merchant.trim().toLowerCase() === normalizedMerchant
    );

    if (!knownAnywhere) {
      merchantScore = 15;
      isMerchantFlagged = true;
      merchantDesc = `First time transacting with "${tx.merchant}". Never appeared before.`;
      reasons.push(`Merchant "${tx.merchant}" has never appeared in your transaction history.`);
    } else {
      merchantScore = 8;
      merchantDesc = `New merchant for ${tx.category}, though seen in another category.`;
      reasons.push(`First time using "${tx.merchant}" for ${tx.category} expenses.`);
    }
  } else {
    merchantScore = 0;
    merchantDesc = `Frequent merchant in your personal profile.`;
  }

  // ==========================================
  // 3. CATEGORY DEVIATION (0 - 15 points)
  // ==========================================
  let categoryScore = 0;
  let categoryDesc = 'Normal monthly category allocation.';
  let isCategoryFlagged = false;

  const currentMonth = new Date(tx.date).getMonth();
  const currentYear = new Date(tx.date).getFullYear();
  const catMonthSpend = allTransactions
    .filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.category === tx.category;
    })
    .reduce((s, t) => s + t.amount, 0);

  const budget = budgets?.[tx.category];
  const budgetLimit = budget?.limit || (baseline.monthlyTotal > 0 ? baseline.monthlyTotal * 1.2 : 5000);

  if (catMonthSpend > budgetLimit * 1.25) {
    categoryScore = 15;
    isCategoryFlagged = true;
    const overPct = Math.round(((catMonthSpend - budgetLimit) / budgetLimit) * 100);
    categoryDesc = `${tx.category} spend is ${overPct}% over monthly benchmark (₹${catMonthSpend.toLocaleString()} vs ₹${Math.round(budgetLimit).toLocaleString()}).`;
    reasons.push(`${tx.category} spending this month is already ${overPct}% above your baseline pattern.`);
  } else if (catMonthSpend > budgetLimit) {
    categoryScore = 10;
    isCategoryFlagged = true;
    categoryDesc = `${tx.category} has reached ${Math.round((catMonthSpend / budgetLimit) * 100)}% of limit.`;
    reasons.push(`${tx.category} has exceeded the recommended monthly budget.`);
  } else if (catMonthSpend > budgetLimit * 0.85) {
    categoryScore = 5;
    categoryDesc = `Approaching upper threshold of ${tx.category} baseline.`;
  } else {
    categoryScore = 1;
    categoryDesc = `Within historical monthly pacing for ${tx.category}.`;
  }

  // ==========================================
  // 4. FREQUENCY ANOMALY (0 - 10 points)
  // ==========================================
  let frequencyScore = 0;
  let frequencyDesc = 'Normal cadence of transactions.';
  let isFrequencyFlagged = false;

  // Transactions in the same category within the last 48 hours
  const txDate = new Date(tx.date).getTime();
  const recentCatTxs = allTransactions.filter(t => {
    if (t.id === tx.id || t.category !== tx.category) return false;
    const diffHours = Math.abs(txDate - new Date(t.date).getTime()) / (1000 * 3600);
    return diffHours <= 48;
  });

  if (recentCatTxs.length >= 4) {
    frequencyScore = 10;
    isFrequencyFlagged = true;
    frequencyDesc = `Unusual cluster: ${recentCatTxs.length + 1} ${tx.category} charges within 48 hours.`;
    reasons.push(`Abnormal frequency: ${recentCatTxs.length + 1} transactions in ${tx.category} within 48 hours.`);
  } else if (recentCatTxs.length >= 3) {
    frequencyScore = 6;
    isFrequencyFlagged = true;
    frequencyDesc = `Elevated frequency: 3 charges in ${tx.category} within 48 hours.`;
  } else {
    frequencyScore = 1;
    frequencyDesc = `Standard transaction frequency.`;
  }

  // ==========================================
  // 5. TIME / DAY ANOMALY (0 - 10 points)
  // ==========================================
  let timeScore = 0;
  let timeDesc = 'Normal time and day of week.';
  let isTimeFlagged = false;

  const d = new Date(tx.date);
  const hour = d.getHours();
  const day = d.getDay(); // 0 is Sunday

  // Night hours (12:00 AM to 5:30 AM)
  const isLateNight = hour >= 0 && hour <= 5;
  const isOutsideUsualHours = hour < baseline.typicalHoursRange[0] || hour > baseline.typicalHoursRange[1];

  if (isLateNight && tx.amount > 1500) {
    timeScore = 10;
    isTimeFlagged = true;
    timeDesc = `Recorded at ${hour.toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} AM. Highly atypical for high-value spend.`;
    reasons.push(`Transaction occurred at an unusual time (${hour}:${d.getMinutes().toString().padStart(2, '0')} AM).`);
  } else if (isLateNight) {
    timeScore = 7;
    isTimeFlagged = true;
    timeDesc = `Late-night transaction timestamp (${hour}:${d.getMinutes().toString().padStart(2, '0')} AM).`;
    reasons.push(`Late night transaction timestamp.`);
  } else if (isOutsideUsualHours && tx.amount > 2000) {
    timeScore = 5;
    timeDesc = `Occurred outside typical hours (${baseline.typicalHoursRange[0]}:00 - ${baseline.typicalHoursRange[1]}:00).`;
  } else {
    timeScore = 1;
    timeDesc = `Occurred during your standard active spending hours.`;
  }

  // ==========================================
  // 6. DUPLICATE TRANSACTION DETECTION (0 - 10 points)
  // ==========================================
  const duplicateCheck = checkDuplicateTransaction(tx, allTransactions);
  let duplicateScore = duplicateCheck.score;
  let duplicateDesc = duplicateCheck.message || 'No duplicate charges detected.';
  let isDuplicateFlagged = duplicateCheck.isDuplicate;
  if (duplicateCheck.isDuplicate && duplicateCheck.message) {
    reasons.push(duplicateCheck.message);
  }

  // ==========================================
  // 7. SPENDING VELOCITY (0 - 10 points)
  // ==========================================
  const velocityCheck = checkSpendingVelocity(tx, allTransactions, baseline.velocityRatePerHour);
  let velocityScore = velocityCheck.score;
  let velocityDesc = velocityCheck.message || 'Spending velocity is within personal normal limits.';
  let isVelocityFlagged = velocityCheck.isVelocityAnomaly;
  if (velocityCheck.isVelocityAnomaly && velocityCheck.message) {
    reasons.push(velocityCheck.message);
  }

  // Calculate raw weighted sum (0 - 100)
  let rawScore = amountScore + merchantScore + categoryScore + frequencyScore + timeScore + duplicateScore + velocityScore;

  // Apply sensitivity calibration
  let calibratedScore = rawScore;
  if (sensitivity === 'High') {
    calibratedScore = Math.min(100, Math.round(rawScore * 1.15));
  } else if (sensitivity === 'Low') {
    calibratedScore = Math.max(0, Math.round(rawScore * 0.85));
  }

  // Determine Severity based on sensitivity
  let severity: AnomalySeverity = 'Normal';
  if (sensitivity === 'High') {
    if (calibratedScore >= 70) severity = 'Critical';
    else if (calibratedScore >= 50) severity = 'Suspicious';
    else if (calibratedScore >= 35) severity = 'Watch';
    else severity = 'Normal';
  } else if (sensitivity === 'Low') {
    if (calibratedScore >= 85) severity = 'Critical';
    else if (calibratedScore >= 70) severity = 'Suspicious';
    else if (calibratedScore >= 50) severity = 'Watch';
    else severity = 'Normal';
  } else {
    // Medium (Default)
    if (calibratedScore >= 78) severity = 'Critical';
    else if (calibratedScore >= 60) severity = 'Suspicious';
    else if (calibratedScore >= 40) severity = 'Watch';
    else severity = 'Normal';
  }

  // Calculate explainable confidence percentage (e.g. 88% - 97%)
  const factorCount = [isAmountFlagged, isMerchantFlagged, isCategoryFlagged, isFrequencyFlagged, isTimeFlagged, isDuplicateFlagged, isVelocityFlagged].filter(Boolean).length;
  let confidence = 82 + Math.min(15, factorCount * 3 + Math.floor(allTransactions.length / 10));
  confidence = Math.min(98, Math.max(78, confidence));

  // Determine recommended action
  let recommendedAction = 'No action required. Spending is consistent with your profile.';
  if (severity === 'Critical') {
    if (duplicateCheck.isDuplicate) {
      recommendedAction = 'Verify if this is an accidental double swipe with merchant or banking app.';
    } else if (isMerchantFlagged && isAmountFlagged) {
      recommendedAction = 'Review this transaction immediately and verify the merchant authenticity.';
    } else {
      recommendedAction = 'Inspect receipt and confirm whether this large outlier was intended.';
    }
  } else if (severity === 'Suspicious') {
    if (isCategoryFlagged) {
      recommendedAction = 'Check category budget limit and consider reallocating discretionary funds.';
    } else {
      recommendedAction = 'Review transaction details and ensure merchant is recognized.';
    }
  } else if (severity === 'Watch') {
    recommendedAction = 'Keep on radar; minor deviation from historical velocity or timing.';
  }

  // Primary concise reason
  let primaryReason = 'Within normal personal parameters';
  if (reasons.length > 0) {
    primaryReason = reasons[0];
  } else if (severity !== 'Normal') {
    primaryReason = 'Slight deviation in spending patterns';
  }

  const factorBreakdowns: AnomalyResult['factors'] = {
    amount: {
      name: 'Amount Deviation',
      score: amountScore,
      maxScore: 30,
      weightLabel: '0–30 pts',
      description: amountDesc,
      isFlagged: isAmountFlagged
    },
    merchant: {
      name: 'Merchant Novelty',
      score: merchantScore,
      maxScore: 15,
      weightLabel: '0–15 pts',
      description: merchantDesc,
      isFlagged: isMerchantFlagged
    },
    category: {
      name: 'Category Deviation',
      score: categoryScore,
      maxScore: 15,
      weightLabel: '0–15 pts',
      description: categoryDesc,
      isFlagged: isCategoryFlagged
    },
    frequency: {
      name: 'Frequency Anomaly',
      score: frequencyScore,
      maxScore: 10,
      weightLabel: '0–10 pts',
      description: frequencyDesc,
      isFlagged: isFrequencyFlagged
    },
    time: {
      name: 'Time / Day Anomaly',
      score: timeScore,
      maxScore: 10,
      weightLabel: '0–10 pts',
      description: timeDesc,
      isFlagged: isTimeFlagged
    },
    duplicate: {
      name: 'Duplicate Detection',
      score: duplicateScore,
      maxScore: 10,
      weightLabel: '0–10 pts',
      description: duplicateDesc,
      isFlagged: isDuplicateFlagged
    },
    velocity: {
      name: 'Spending Velocity',
      score: velocityScore,
      maxScore: 10,
      weightLabel: '0–10 pts',
      description: velocityDesc,
      isFlagged: isVelocityFlagged
    },
    budgetImpact: {
      name: 'Budget Strain',
      score: categoryScore > 10 ? 8 : 2,
      maxScore: 10,
      weightLabel: 'Impact',
      description: categoryDesc,
      isFlagged: categoryScore > 10
    }
  };

  return {
    transactionId: tx.id,
    score: calibratedScore,
    severity,
    confidence,
    primaryReason,
    reasons: reasons.length > 0 ? reasons : ['Transaction strictly matches your personal historical profile.'],
    factors: factorBreakdowns,
    recommendedAction,
    resolved: existingResolution?.resolved ?? false,
    resolutionType: existingResolution?.type as any
  };
}

function createNormalOverrideResult(tx: Transaction): AnomalyResult {
  return {
    transactionId: tx.id,
    score: 12,
    severity: 'Normal',
    confidence: 96,
    primaryReason: 'Manually verified as normal by user',
    reasons: ['User confirmed this transaction as expected normal expenditure.'],
    factors: {
      amount: { name: 'Amount Deviation', score: 2, maxScore: 30, weightLabel: '0–30 pts', description: 'Overridden by user.', isFlagged: false },
      merchant: { name: 'Merchant Novelty', score: 0, maxScore: 15, weightLabel: '0–15 pts', description: 'Overridden / trusted.', isFlagged: false },
      category: { name: 'Category Deviation', score: 2, maxScore: 15, weightLabel: '0–15 pts', description: 'User verified.', isFlagged: false },
      frequency: { name: 'Frequency Anomaly', score: 0, maxScore: 10, weightLabel: '0–10 pts', description: 'Normal.', isFlagged: false },
      time: { name: 'Time / Day Anomaly', score: 0, maxScore: 10, weightLabel: '0–10 pts', description: 'Normal.', isFlagged: false },
      duplicate: { name: 'Duplicate Detection', score: 0, maxScore: 10, weightLabel: '0–10 pts', description: 'Normal.', isFlagged: false },
      velocity: { name: 'Spending Velocity', score: 0, maxScore: 10, weightLabel: '0–10 pts', description: 'Normal.', isFlagged: false },
      budgetImpact: { name: 'Budget Strain', score: 2, maxScore: 10, weightLabel: 'Impact', description: 'Within scope.', isFlagged: false }
    },
    recommendedAction: 'Resolved. No further action needed.',
    resolved: true,
    resolutionType: 'marked_normal'
  };
}
