import { Transaction } from '../types';

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  score: number; // 0 - 10
  matchedTransaction?: Transaction;
  minutesApart?: number;
  message?: string;
}

export interface VelocityCheckResult {
  isVelocityAnomaly: boolean;
  score: number; // 0 - 10
  recentSpendingTotal: number;
  timeWindowMinutes: number;
  transactionCount: number;
  message?: string;
}

/**
 * Checks if a transaction is a potential duplicate of an existing transaction
 */
export function checkDuplicateTransaction(
  current: Transaction,
  history: Transaction[]
): DuplicateCheckResult {
  const currentTime = new Date(current.date).getTime();

  for (const prev of history) {
    if (prev.id === current.id) continue;

    const isSameMerchant = prev.merchant.trim().toLowerCase() === current.merchant.trim().toLowerCase();
    const isSameAmount = Math.abs(prev.amount - current.amount) < 1; // within 1 rupee

    if (isSameMerchant && isSameAmount) {
      const prevTime = new Date(prev.date).getTime();
      const diffMinutes = Math.round(Math.abs(currentTime - prevTime) / (1000 * 60));

      // If within 24 hours (1440 minutes)
      if (diffMinutes <= 15) {
        return {
          isDuplicate: true,
          score: 10,
          matchedTransaction: prev,
          minutesApart: diffMinutes,
          message: `Identical charge of ₹${current.amount.toLocaleString()} at ${current.merchant} was recorded ${diffMinutes === 0 ? 'just seconds' : diffMinutes + ' minute(s)'} apart.`
        };
      } else if (diffMinutes <= 180) {
        return {
          isDuplicate: true,
          score: 7,
          matchedTransaction: prev,
          minutesApart: diffMinutes,
          message: `Possible duplicate charge of ₹${current.amount.toLocaleString()} at ${current.merchant} recorded ${Math.round(diffMinutes / 60)} hour(s) earlier.`
        };
      } else if (diffMinutes <= 1440) {
        return {
          isDuplicate: true,
          score: 4,
          matchedTransaction: prev,
          minutesApart: diffMinutes,
          message: `Repeat identical amount of ₹${current.amount.toLocaleString()} at ${current.merchant} within 24 hours.`
        };
      }
    }
  }

  return {
    isDuplicate: false,
    score: 0
  };
}

/**
 * Evaluates spending velocity in a localized time window (e.g. 1 hour or 2 hours)
 */
export function checkSpendingVelocity(
  current: Transaction,
  history: Transaction[],
  baselineHourlyRate: number = 500
): VelocityCheckResult {
  const currentTime = new Date(current.date).getTime();
  const windowMs = 60 * 60 * 1000; // 60 minutes window

  // Transactions within 60 minutes of current
  const nearbyTxs = history.filter(t => {
    const tTime = new Date(t.date).getTime();
    return Math.abs(currentTime - tTime) <= windowMs;
  });

  const totalSpentInWindow = nearbyTxs.reduce((sum, t) => sum + t.amount, 0) + current.amount;
  const countInWindow = nearbyTxs.length + 1;

  // If spending exceeds 4x baseline hourly velocity or >= ₹8,000 in under 60 minutes
  if (totalSpentInWindow >= 10000 && countInWindow >= 2) {
    return {
      isVelocityAnomaly: true,
      score: 10,
      recentSpendingTotal: totalSpentInWindow,
      timeWindowMinutes: 45,
      transactionCount: countInWindow,
      message: `Unusual spending velocity: ₹${totalSpentInWindow.toLocaleString()} spent across ${countInWindow} transactions within 45 minutes.`
    };
  }

  if (totalSpentInWindow >= 6000 && countInWindow >= 2) {
    return {
      isVelocityAnomaly: true,
      score: 7,
      recentSpendingTotal: totalSpentInWindow,
      timeWindowMinutes: 60,
      transactionCount: countInWindow,
      message: `Accelerated spending velocity: ₹${totalSpentInWindow.toLocaleString()} outflow within 1 hour.`
    };
  }

  if (countInWindow >= 4) {
    return {
      isVelocityAnomaly: true,
      score: 6,
      recentSpendingTotal: totalSpentInWindow,
      timeWindowMinutes: 60,
      transactionCount: countInWindow,
      message: `Rapid transaction frequency: ${countInWindow} distinct payments in under 60 minutes.`
    };
  }

  return {
    isVelocityAnomaly: false,
    score: 0,
    recentSpendingTotal: totalSpentInWindow,
    timeWindowMinutes: 60,
    transactionCount: countInWindow
  };
}
