export type PaymentMode = 'Online' | 'Cash';

export type OnlineSubtype = 'UPI' | 'Debit Card' | 'Credit Card' | 'Net Banking' | 'Other';

export interface Category {
  id: string;
  name: string;
  type: 'expense' | 'savings';
  color: string;
  icon: string;
  budgetLimit?: number;
}

export interface IncomeSource {
  id: string;
  name: string;
  expectedMonthly?: number;
  color: string;
  icon: string;
}

export interface IncomeEntry {
  id: string;
  sourceId: string;
  amount: number;
  date: string; // YYYY-MM-DD
  notes?: string;
}

export interface Expense {
  id: string;
  title: string;
  categoryId: string;
  amount: number;
  date: string; // YYYY-MM-DD
  paymentMode: PaymentMode;
  onlineSubtype?: OnlineSubtype;
  isUnplanned: boolean; // Flag for leakage / impulse spending
  notes?: string;
}

export interface DashboardMetrics {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  savingsTotal: number;
  unplannedTotal: number;
  onlineTotal: number;
  cashTotal: number;
  safeDailySpend: number;
  daysRemainingInMonth: number;
  burnRatePercentage: number;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

export type ActiveTab = 'dashboard' | 'expenses' | 'incomes' | 'categories' | 'analytics' | 'settings';

