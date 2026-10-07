import { Transaction, Category, CategoryBaseline } from '../types';

export const ALL_CATEGORIES: Category[] = [
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

export function computeCategoryBaselines(transactions: Transaction[]): Record<Category, CategoryBaseline> {
  const baselines: Partial<Record<Category, CategoryBaseline>> = {};

  for (const cat of ALL_CATEGORIES) {
    const catTxs = transactions.filter(t => t.category === cat);
    if (catTxs.length === 0) {
      baselines[cat] = {
        category: cat,
        avgAmount: 500,
        medianAmount: 500,
        stdDev: 200,
        minAmount: 50,
        maxAmount: 1500,
        transactionCount: 0,
        weeklyFrequency: 0,
        monthlyTotal: 0,
        knownMerchants: [],
        typicalDays: [1, 2, 3, 4, 5, 6, 0],
        typicalHoursRange: [8, 22],
        velocityRatePerHour: 200
      };
      continue;
    }

    const amounts = catTxs.map(t => t.amount).sort((a, b) => a - b);
    const sum = amounts.reduce((acc, curr) => acc + curr, 0);
    const avgAmount = Math.round(sum / amounts.length);

    // Median
    const mid = Math.floor(amounts.length / 2);
    const medianAmount = amounts.length % 2 !== 0 ? amounts[mid] : Math.round((amounts[mid - 1] + amounts[mid]) / 2);

    // Standard Deviation
    const variance = amounts.reduce((acc, curr) => acc + Math.pow(curr - avgAmount, 2), 0) / amounts.length;
    const stdDev = Math.round(Math.sqrt(variance));

    const minAmount = amounts[0];
    const maxAmount = amounts[amounts.length - 1];

    // Unique merchants
    const knownMerchants = Array.from(new Set(catTxs.map(t => t.merchant.trim().toLowerCase())));

    // Day of week frequency
    const daysCount: Record<number, number> = {};
    const hours: number[] = [];
    catTxs.forEach(t => {
      const d = new Date(t.date);
      const day = d.getDay();
      daysCount[day] = (daysCount[day] || 0) + 1;
      hours.push(d.getHours());
    });

    const typicalDays = Object.entries(daysCount)
      .filter(([_, count]) => count >= 1)
      .map(([day]) => Number(day));

    // Hours range (min/max common hours)
    hours.sort((a, b) => a - b);
    const p10Hours = hours[Math.floor(hours.length * 0.1)] ?? 8;
    const p90Hours = hours[Math.floor(hours.length * 0.9)] ?? 22;

    // Approximate weekly frequency (based on ~30-60 day span)
    const weeklyFrequency = Number((catTxs.length / 4.2).toFixed(1));
    const monthlyTotal = sum;

    baselines[cat] = {
      category: cat,
      avgAmount,
      medianAmount,
      stdDev: Math.max(stdDev, 50),
      minAmount,
      maxAmount,
      transactionCount: catTxs.length,
      weeklyFrequency,
      monthlyTotal,
      knownMerchants,
      typicalDays,
      typicalHoursRange: [p10Hours, p90Hours],
      velocityRatePerHour: Math.max(Math.round(avgAmount * 1.5), 300)
    };
  }

  return baselines as Record<Category, CategoryBaseline>;
}
