import { Transaction, CategoryBudget } from '../types';

export const INITIAL_BUDGETS: Record<string, CategoryBudget> = {
  Food: { category: 'Food', limit: 10000, spent: 0, color: '#10B981' },
  Shopping: { category: 'Shopping', limit: 8000, spent: 0, color: '#8B5CF6' },
  Transport: { category: 'Transport', limit: 5000, spent: 0, color: '#3B82F6' },
  Entertainment: { category: 'Entertainment', limit: 4000, spent: 0, color: '#EC4899' },
  Bills: { category: 'Bills', limit: 12000, spent: 0, color: '#F59E0B' },
  Electronics: { category: 'Electronics', limit: 6000, spent: 0, color: '#06B6D4' },
  Healthcare: { category: 'Healthcare', limit: 5000, spent: 0, color: '#14B8A6' },
  Education: { category: 'Education', limit: 4000, spent: 0, color: '#6366F1' },
  Travel: { category: 'Travel', limit: 6000, spent: 0, color: '#E11D48' },
  Subscriptions: { category: 'Subscriptions', limit: 2500, spent: 0, color: '#84CC16' },
  Other: { category: 'Other', limit: 3500, spent: 0, color: '#64748B' }
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // --- ANOMALY 1: The flagship IEEE demo case (Oct 7, 2026, ₹8,750 at TechZone Electronics) ---
  {
    id: 'tx-anomaly-01',
    date: '2026-10-07T14:32:00',
    merchant: 'TechZone Electronics',
    amount: 8750,
    category: 'Electronics',
    paymentMethod: 'Credit Card',
    description: 'High-end mechanical keyboard & noise-canceling audio kit',
    tags: ['gadgets', 'hardware']
  },

  // --- ANOMALY 2: Duplicate transaction (Starbucks ₹1,450, duplicate 4 minutes apart) ---
  {
    id: 'tx-anomaly-02a',
    date: '2026-10-06T10:14:00',
    merchant: 'Starbucks Coffee',
    amount: 1450,
    category: 'Food',
    paymentMethod: 'UPI',
    description: 'Artisan roast and breakfast sandwich'
  },
  {
    id: 'tx-anomaly-02b',
    date: '2026-10-06T10:18:00',
    merchant: 'Starbucks Coffee',
    amount: 1450,
    category: 'Food',
    paymentMethod: 'UPI',
    description: 'Duplicate POS swipe charged twice'
  },

  // --- ANOMALY 3: Giant Food outlier (₹4,500 food transaction vs normal ₹350-₹450) ---
  {
    id: 'tx-anomaly-03',
    date: '2026-10-05T20:45:00',
    merchant: 'The Royal Bistro',
    amount: 4500,
    category: 'Food',
    paymentMethod: 'Credit Card',
    description: 'Large celebratory team dinner banquet'
  },

  // --- ANOMALY 4: Shopping spike (₹6,499 at Amazon) ---
  {
    id: 'tx-anomaly-04',
    date: '2026-10-03T16:20:00',
    merchant: 'Amazon Marketplace',
    amount: 6499,
    category: 'Shopping',
    paymentMethod: 'Credit Card',
    description: 'Smart home hub and ergonomic workstation accessories'
  },

  // --- ANOMALY 5: Late night unusual spending (₹3,800 at 02:40 AM) ---
  {
    id: 'tx-anomaly-05',
    date: '2026-10-02T02:40:00',
    merchant: 'NightOwl Gaming Lounge',
    amount: 3800,
    category: 'Entertainment',
    paymentMethod: 'UPI',
    description: 'Late night VIP virtual gaming booth pass'
  },

  // --- ANOMALY 6 & 7: Velocity Burst (₹12,000 spent across 45 minutes in luxury boutique) ---
  {
    id: 'tx-anomaly-06',
    date: '2026-10-01T17:10:00',
    merchant: 'Aura Luxury Apparel',
    amount: 6200,
    category: 'Shopping',
    paymentMethod: 'Credit Card',
    description: 'Designer winter overcoat'
  },
  {
    id: 'tx-anomaly-07',
    date: '2026-10-01T17:42:00',
    merchant: 'Aura Luxury Apparel',
    amount: 5800,
    category: 'Shopping',
    paymentMethod: 'Credit Card',
    description: 'Designer boots and leather accessories'
  },

  // ==========================================
  // NORMAL BASELINE TRANSACTIONS (ESTABLISHING CONSISTENT HABITS)
  // ==========================================
  // Regular Food spending (normal ₹200 - ₹550 at Food Palace, Swiggy, Cafe Coffee Day, Fresh Mart)
  {
    id: 'tx-norm-01',
    date: '2026-10-07T08:30:00',
    merchant: 'Food Palace',
    amount: 350,
    category: 'Food',
    paymentMethod: 'UPI',
    description: 'Morning breakfast and fresh juice'
  },
  {
    id: 'tx-norm-02',
    date: '2026-10-06T13:15:00',
    merchant: 'Food Palace',
    amount: 420,
    category: 'Food',
    paymentMethod: 'UPI',
    description: 'South Indian lunch thali'
  },
  {
    id: 'tx-norm-03',
    date: '2026-10-05T12:45:00',
    merchant: 'Swiggy',
    amount: 380,
    category: 'Food',
    paymentMethod: 'UPI',
    description: 'Healthy grain bowl'
  },
  {
    id: 'tx-norm-04',
    date: '2026-10-04T19:30:00',
    merchant: 'Cafe Coffee Day',
    amount: 280,
    category: 'Food',
    paymentMethod: 'UPI',
    description: 'Cappuccino and cinnamon cookie'
  },
  {
    id: 'tx-norm-05',
    date: '2026-10-03T13:00:00',
    merchant: 'Food Palace',
    amount: 410,
    category: 'Food',
    paymentMethod: 'UPI',
    description: 'Regular weekday lunch'
  },
  {
    id: 'tx-norm-06',
    date: '2026-10-02T12:30:00',
    merchant: 'Fresh Mart Supermarket',
    amount: 620,
    category: 'Food',
    paymentMethod: 'Debit Card',
    description: 'Weekly milk, eggs, bread and fresh fruits'
  },
  {
    id: 'tx-norm-07',
    date: '2026-10-01T09:10:00',
    merchant: 'Food Palace',
    amount: 320,
    category: 'Food',
    paymentMethod: 'UPI',
    description: 'Idli and filter coffee'
  },

  // Transport (Regular Metro ₹220, Uber ₹340 - ₹480)
  {
    id: 'tx-norm-08',
    date: '2026-10-07T09:00:00',
    merchant: 'Metro Transit Smartcard',
    amount: 220,
    category: 'Transport',
    paymentMethod: 'UPI',
    description: 'Metro daily card recharge'
  },
  {
    id: 'tx-norm-09',
    date: '2026-10-06T09:05:00',
    merchant: 'Metro Transit Smartcard',
    amount: 220,
    category: 'Transport',
    paymentMethod: 'UPI',
    description: 'Metro commute'
  },
  {
    id: 'tx-norm-10',
    date: '2026-10-05T18:20:00',
    merchant: 'Uber India',
    amount: 340,
    category: 'Transport',
    paymentMethod: 'UPI',
    description: 'Cab ride from tech hub to residence'
  },
  {
    id: 'tx-norm-11',
    date: '2026-10-04T09:10:00',
    merchant: 'Metro Transit Smartcard',
    amount: 220,
    category: 'Transport',
    paymentMethod: 'UPI',
    description: 'Metro fare'
  },
  {
    id: 'tx-norm-12',
    date: '2026-10-03T18:45:00',
    merchant: 'Uber India',
    amount: 410,
    category: 'Transport',
    paymentMethod: 'UPI',
    description: 'Rain surge cab ride'
  },
  {
    id: 'tx-norm-13',
    date: '2026-10-02T08:55:00',
    merchant: 'Metro Transit Smartcard',
    amount: 220,
    category: 'Transport',
    paymentMethod: 'UPI',
    description: 'Daily metro transit'
  },

  // Monthly Subscriptions (Regular recurring ₹199 to ₹1,200)
  {
    id: 'tx-norm-14',
    date: '2026-10-05T00:01:00',
    merchant: 'Spotify Premium',
    amount: 199,
    category: 'Subscriptions',
    paymentMethod: 'Credit Card',
    description: 'Monthly music subscription',
    isRecurring: true
  },
  {
    id: 'tx-norm-15',
    date: '2026-10-04T00:01:00',
    merchant: 'Netflix India',
    amount: 649,
    category: 'Subscriptions',
    paymentMethod: 'Credit Card',
    description: 'Monthly 4K streaming plan',
    isRecurring: true
  },
  {
    id: 'tx-norm-16',
    date: '2026-10-01T00:05:00',
    merchant: 'Google One Cloud',
    amount: 130,
    category: 'Subscriptions',
    paymentMethod: 'Credit Card',
    description: '100 GB Cloud backup storage',
    isRecurring: true
  },
  {
    id: 'tx-norm-17',
    date: '2026-10-01T10:00:00',
    merchant: 'FitPass Gym Membership',
    amount: 1200,
    category: 'Subscriptions',
    paymentMethod: 'Bank Transfer',
    description: 'Monthly gym and fitness pass',
    isRecurring: true
  },

  // Regular Utility Bills
  {
    id: 'tx-norm-18',
    date: '2026-10-04T11:20:00',
    merchant: 'Airtel Broadband Fiber',
    amount: 1180,
    category: 'Bills',
    paymentMethod: 'UPI',
    description: 'Monthly 300 Mbps internet bill'
  },
  {
    id: 'tx-norm-19',
    date: '2026-10-03T10:30:00',
    merchant: 'State Electricity Board',
    amount: 2450,
    category: 'Bills',
    paymentMethod: 'Bank Transfer',
    description: 'September residential electricity bill'
  },
  {
    id: 'tx-norm-20',
    date: '2026-10-02T15:00:00',
    merchant: 'Piped Natural Gas Utility',
    amount: 680,
    category: 'Bills',
    paymentMethod: 'UPI',
    description: 'Bi-monthly cooking gas utility'
  },

  // Healthcare
  {
    id: 'tx-norm-21',
    date: '2026-10-06T18:00:00',
    merchant: 'Apollo Pharmacy',
    amount: 540,
    category: 'Healthcare',
    paymentMethod: 'UPI',
    description: 'Multivitamins and first aid supplies'
  },
  {
    id: 'tx-norm-22',
    date: '2026-09-28T16:30:00',
    merchant: 'Apollo Pharmacy',
    amount: 450,
    category: 'Healthcare',
    paymentMethod: 'UPI',
    description: 'Prescription allergy medication'
  },

  // Entertainment
  {
    id: 'tx-norm-23',
    date: '2026-10-04T21:00:00',
    merchant: 'PVR Cinemas',
    amount: 760,
    category: 'Entertainment',
    paymentMethod: 'Debit Card',
    description: 'IMAX weekend movie ticket & popcorn'
  },
  {
    id: 'tx-norm-24',
    date: '2026-09-27T19:40:00',
    merchant: 'PVR Cinemas',
    amount: 580,
    category: 'Entertainment',
    paymentMethod: 'UPI',
    description: 'Cinema ticket'
  },

  // Education / Learning
  {
    id: 'tx-norm-25',
    date: '2026-10-02T14:10:00',
    merchant: 'Coursera Learning',
    amount: 1499,
    category: 'Education',
    paymentMethod: 'Credit Card',
    description: 'Machine Learning course certification fee'
  },

  // Additional September Historical Transactions (to build robust baseline)
  {
    id: 'tx-norm-26',
    date: '2026-09-30T13:20:00',
    merchant: 'Food Palace',
    amount: 390,
    category: 'Food',
    paymentMethod: 'UPI',
    description: 'Lunch combo'
  },
  {
    id: 'tx-norm-27',
    date: '2026-09-29T08:45:00',
    merchant: 'Metro Transit Smartcard',
    amount: 220,
    category: 'Transport',
    paymentMethod: 'UPI',
    description: 'Metro commute'
  },
  {
    id: 'tx-norm-28',
    date: '2026-09-28T13:10:00',
    merchant: 'Food Palace',
    amount: 440,
    category: 'Food',
    paymentMethod: 'UPI',
    description: 'Executive lunch'
  },
  {
    id: 'tx-norm-29',
    date: '2026-09-27T14:00:00',
    merchant: 'Swiggy',
    amount: 360,
    category: 'Food',
    paymentMethod: 'UPI',
    description: 'Weekend food delivery'
  },
  {
    id: 'tx-norm-30',
    date: '2026-09-26T17:30:00',
    merchant: 'Reliance Smart Supermarket',
    amount: 1850,
    category: 'Shopping',
    paymentMethod: 'Debit Card',
    description: 'Pantry restocking'
  },
  {
    id: 'tx-norm-31',
    date: '2026-09-25T19:15:00',
    merchant: 'Food Palace',
    amount: 340,
    category: 'Food',
    paymentMethod: 'UPI',
    description: 'Dinner meal'
  },
  {
    id: 'tx-norm-32',
    date: '2026-09-24T09:00:00',
    merchant: 'Metro Transit Smartcard',
    amount: 220,
    category: 'Transport',
    paymentMethod: 'UPI',
    description: 'Metro daily card recharge'
  },
  {
    id: 'tx-norm-33',
    date: '2026-09-23T13:30:00',
    merchant: 'Food Palace',
    amount: 410,
    category: 'Food',
    paymentMethod: 'UPI',
    description: 'Daily lunch'
  },
  {
    id: 'tx-norm-34',
    date: '2026-09-22T20:00:00',
    merchant: 'Uber India',
    amount: 380,
    category: 'Transport',
    paymentMethod: 'UPI',
    description: 'Evening ride home'
  },
  {
    id: 'tx-norm-35',
    date: '2026-09-21T11:45:00',
    merchant: 'Cafe Coffee Day',
    amount: 260,
    category: 'Food',
    paymentMethod: 'UPI',
    description: 'Coffee and muffin'
  },
  {
    id: 'tx-norm-36',
    date: '2026-09-20T16:20:00',
    merchant: 'Decathlon Sports',
    amount: 1450,
    category: 'Shopping',
    paymentMethod: 'Credit Card',
    description: 'Running socks and water bottle'
  },
  {
    id: 'tx-norm-37',
    date: '2026-09-19T13:00:00',
    merchant: 'Food Palace',
    amount: 370,
    category: 'Food',
    paymentMethod: 'UPI',
    description: 'Weekend lunch'
  },
  {
    id: 'tx-norm-38',
    date: '2026-09-18T09:00:00',
    merchant: 'Metro Transit Smartcard',
    amount: 220,
    category: 'Transport',
    paymentMethod: 'UPI',
    description: 'Metro ticket'
  },
  {
    id: 'tx-norm-39',
    date: '2026-09-17T14:15:00',
    merchant: 'Food Palace',
    amount: 430,
    category: 'Food',
    paymentMethod: 'UPI',
    description: 'Lunch'
  },
  {
    id: 'tx-norm-40',
    date: '2026-09-16T18:50:00',
    merchant: 'Apollo Pharmacy',
    amount: 320,
    category: 'Healthcare',
    paymentMethod: 'Cash',
    description: 'Cold medicine'
  },
  {
    id: 'tx-norm-41',
    date: '2026-09-15T12:30:00',
    merchant: 'Swiggy',
    amount: 390,
    category: 'Food',
    paymentMethod: 'UPI',
    description: 'Healthy sandwich'
  },
  {
    id: 'tx-norm-42',
    date: '2026-09-14T09:10:00',
    merchant: 'Metro Transit Smartcard',
    amount: 220,
    category: 'Transport',
    paymentMethod: 'UPI',
    description: 'Metro travel'
  },
  {
    id: 'tx-norm-43',
    date: '2026-09-13T19:30:00',
    merchant: 'PVR Cinemas',
    amount: 620,
    category: 'Entertainment',
    paymentMethod: 'UPI',
    description: 'Sunday evening cinema'
  },
  {
    id: 'tx-norm-44',
    date: '2026-09-12T15:00:00',
    merchant: 'Amazon Marketplace',
    amount: 1150,
    category: 'Shopping',
    paymentMethod: 'Credit Card',
    description: 'Stationery and desk planner'
  },
  {
    id: 'tx-norm-45',
    date: '2026-09-11T13:00:00',
    merchant: 'Food Palace',
    amount: 360,
    category: 'Food',
    paymentMethod: 'UPI',
    description: 'Thali lunch'
  },
  {
    id: 'tx-norm-46',
    date: '2026-09-10T09:00:00',
    merchant: 'Metro Transit Smartcard',
    amount: 220,
    category: 'Transport',
    paymentMethod: 'UPI',
    description: 'Transit fare'
  },
  {
    id: 'tx-norm-47',
    date: '2026-09-09T18:30:00',
    merchant: 'Uber India',
    amount: 320,
    category: 'Transport',
    paymentMethod: 'UPI',
    description: 'Ride to library'
  },
  {
    id: 'tx-norm-48',
    date: '2026-09-08T13:20:00',
    merchant: 'Food Palace',
    amount: 380,
    category: 'Food',
    paymentMethod: 'UPI',
    description: 'Lunch'
  },
  {
    id: 'tx-norm-49',
    date: '2026-09-07T12:00:00',
    merchant: 'Fresh Mart Supermarket',
    amount: 740,
    category: 'Food',
    paymentMethod: 'Debit Card',
    description: 'Groceries'
  },
  {
    id: 'tx-norm-50',
    date: '2026-09-05T00:01:00',
    merchant: 'Spotify Premium',
    amount: 199,
    category: 'Subscriptions',
    paymentMethod: 'Credit Card',
    description: 'Monthly music streaming',
    isRecurring: true
  }
];
