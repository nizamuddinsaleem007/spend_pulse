import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Category, IncomeSource, IncomeEntry, Expense, DashboardMetrics, ActiveTab } from '../types/finance';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface FinanceContextType {
  categories: Category[];
  incomeSources: IncomeSource[];
  incomes: IncomeEntry[];
  expenses: Expense[];
  allIncomes: IncomeEntry[];
  allExpenses: Expense[];
  metrics: DashboardMetrics;
  currency: string;
  theme: 'dark' | 'light';
  activeTab: ActiveTab;
  selectedMonth: string; // 'YYYY-MM'
  joinMonth: string;
  canGoPrev: boolean;
  availableMonths: {
    value: string;
    label: string;
    badge: string;
    isCurrent: boolean;
    isJoined: boolean;
    isFuture: boolean;
  }[];
  setSelectedMonth: (month: string) => void;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  setCurrency: (currency: string) => void;
  toggleTheme: () => void;
  addExpense: (expense: Omit<Expense, 'id'>) => boolean;
  deleteExpense: (id: string) => boolean;
  addIncome: (income: Omit<IncomeEntry, 'id'>) => boolean;
  deleteIncome: (id: string) => boolean;
  addCategory: (category: Omit<Category, 'id'>) => boolean;
  updateCategory: (id: string, category: Partial<Category>) => boolean;
  deleteCategory: (id: string) => boolean;
  addIncomeSource: (source: Omit<IncomeSource, 'id'>) => boolean;
  updateIncomeSource: (id: string, source: Partial<IncomeSource>) => boolean;
  deleteIncomeSource: (id: string) => boolean;
  authUser: { id: string; email: string } | null;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  setAuthUser: (user: { id: string; email: string } | null) => void;
  signOut: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
  resetToSampleData: () => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-savings', name: 'Savings & Investments', type: 'savings', color: '#10b981', icon: 'PiggyBank', budgetLimit: 20000 },
  { id: 'cat-food', name: 'Food & Dining', type: 'expense', color: '#f59e0b', icon: 'Utensils', budgetLimit: 12000 },
  { id: 'cat-bills', name: 'Bills & Utilities', type: 'expense', color: '#06b6d4', icon: 'Zap', budgetLimit: 8000 },
  { id: 'cat-rent', name: 'Rent & Housing', type: 'expense', color: '#3b82f6', icon: 'Home', budgetLimit: 15000 },
  { id: 'cat-gadgets', name: 'Gadgets & Tech', type: 'expense', color: '#8b5cf6', icon: 'Laptop', budgetLimit: 5000 },
  { id: 'cat-misc', name: 'Miscellaneous / Leaks', type: 'expense', color: '#f43f5e', icon: 'AlertCircle', budgetLimit: 4000 }
];

const DEFAULT_INCOME_SOURCES: IncomeSource[] = [
  { id: 'inc-salary', name: 'Primary Salary', expectedMonthly: 55000, color: '#10b981', icon: 'Briefcase' },
  { id: 'inc-freelance', name: 'Freelance Design', expectedMonthly: 15000, color: '#06b6d4', icon: 'Code' }
];

const getTodayString = (dayOffset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - dayOffset);
  return d.toISOString().split('T')[0];
};

const DEFAULT_EXPENSES: Expense[] = [
  { id: 'exp-1', title: 'Monthly Savings #1 (Chitti / RD)', categoryId: 'cat-savings', amount: 5000, date: getTodayString(4), paymentMode: 'Online', onlineSubtype: 'Net Banking', isUnplanned: false, notes: 'Automated transfer' },
  { id: 'exp-2', title: 'House Rent', categoryId: 'cat-rent', amount: 12000, date: getTodayString(5), paymentMode: 'Online', onlineSubtype: 'Net Banking', isUnplanned: false },
  { id: 'exp-3', title: 'KSEB Electricity Bill', categoryId: 'cat-bills', amount: 1450, date: getTodayString(3), paymentMode: 'Online', onlineSubtype: 'UPI', isUnplanned: false },
  { id: 'exp-4', title: 'Swiggy Dinner & Delivery', categoryId: 'cat-food', amount: 480, date: getTodayString(1), paymentMode: 'Online', onlineSubtype: 'UPI', isUnplanned: true, notes: 'Late night order' },
  { id: 'exp-5', title: 'Chai & Evening Snacks', categoryId: 'cat-food', amount: 120, date: getTodayString(0), paymentMode: 'Cash', isUnplanned: true },
  { id: 'exp-6', title: 'Phone Recharge (Airtel)', categoryId: 'cat-bills', amount: 349, date: getTodayString(2), paymentMode: 'Online', onlineSubtype: 'UPI', isUnplanned: false },
  { id: 'exp-7', title: 'Noise Wireless Earbuds', categoryId: 'cat-gadgets', amount: 1999, date: getTodayString(3), paymentMode: 'Online', onlineSubtype: 'Credit Card', isUnplanned: true, notes: 'Impulse Amazon deal' }
];

const DEFAULT_INCOMES: IncomeEntry[] = [
  { id: 'inc-entry-1', sourceId: 'inc-salary', amount: 55000, date: getTodayString(6), notes: 'Net Salary' },
  { id: 'inc-entry-2', sourceId: 'inc-freelance', amount: 12000, date: getTodayString(2), notes: 'Client advance' }
];

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('spendpulse_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>(() => {
    const saved = localStorage.getItem('spendpulse_income_sources');
    return saved ? JSON.parse(saved) : DEFAULT_INCOME_SOURCES;
  });

  const [incomes, setIncomes] = useState<IncomeEntry[]>(() => {
    const saved = localStorage.getItem('spendpulse_incomes');
    return saved ? JSON.parse(saved) : DEFAULT_INCOMES;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('spendpulse_expenses');
    return saved ? JSON.parse(saved) : DEFAULT_EXPENSES;
  });

  const [currency, setCurrency] = useState<string>(() => {
    return localStorage.getItem('spendpulse_currency') || '₹';
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('spendpulse_theme') as 'dark' | 'light') || 'dark';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Month navigation (Format: 'YYYY-MM')
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  });

  const [joinMonth] = useState<string>(() => {
    return localStorage.getItem('spendpulse_join_month') || '2026-10';
  });

  const canGoPrev = selectedMonth > joinMonth;

  // Generate available months starting strictly from user's joinMonth
  const availableMonths = useMemo(() => {
    const list: {
      value: string;
      label: string;
      badge: string;
      isCurrent: boolean;
      isJoined: boolean;
      isFuture: boolean;
    }[] = [];

    const [joinYearStr, joinMonthStr] = joinMonth.split('-');
    const startYear = parseInt(joinYearStr, 10);
    const startMonth = parseInt(joinMonthStr, 10);

    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Generate from join month through next 7 months
    const startDate = new Date(startYear, startMonth - 1, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 7, 1);

    const iter = new Date(startDate);
    while (iter <= endDate) {
      const y = iter.getFullYear();
      const m = iter.getMonth() + 1;
      const value = `${y}-${String(m).padStart(2, '0')}`;
      const label = iter.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      let badge = '';
      const isCurrent = value === currentMonthStr;
      const isJoined = value === joinMonth;
      const isFuture = value > currentMonthStr;

      if (isCurrent && isJoined) badge = 'Current • Joined';
      else if (isJoined) badge = 'Joined Month';
      else if (isCurrent) badge = 'Current Cycle';
      else if (isFuture) badge = 'Future Planning';
      else badge = 'Past Month';

      list.push({
        value,
        label,
        badge,
        isCurrent,
        isJoined,
        isFuture
      });

      iter.setMonth(iter.getMonth() + 1);
    }

    return list;
  }, [joinMonth]);

  const goToPrevMonth = () => {
    if (!canGoPrev) return;
    const [yearStr, monthStr] = selectedMonth.split('-');
    let y = parseInt(yearStr, 10);
    let m = parseInt(monthStr, 10) - 1;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    const prevVal = `${y}-${String(m).padStart(2, '0')}`;
    if (prevVal >= joinMonth) {
      setSelectedMonth(prevVal);
    }
  };

  const goToNextMonth = () => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    let y = parseInt(yearStr, 10);
    let m = parseInt(monthStr, 10) + 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
    setSelectedMonth(`${y}-${String(m).padStart(2, '0')}`);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('spendpulse_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('spendpulse_income_sources', JSON.stringify(incomeSources));
  }, [incomeSources]);

  useEffect(() => {
    localStorage.setItem('spendpulse_incomes', JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem('spendpulse_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('spendpulse_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('spendpulse_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Auth state
  const [authUser, setAuthUserState] = useState<{ id: string; email: string } | null>(() => {
    const saved = localStorage.getItem('spendpulse_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Sync Supabase Auth session if configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthUserState({ id: session.user.id, email: session.user.email || '' });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthUserState({ id: session.user.id, email: session.user.email || '' });
      } else {
        setAuthUserState(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch or initialize user-specific data upon login
  const loadUserData = useCallback(async (userId: string) => {
    if (isSupabaseConfigured) {
      try {
        const [catsRes, srcRes, expRes, incRes] = await Promise.all([
          supabase.from('categories').select('*').eq('user_id', userId),
          supabase.from('income_sources').select('*').eq('user_id', userId),
          supabase.from('expenses').select('*').eq('user_id', userId).order('date', { ascending: false }),
          supabase.from('incomes').select('*').eq('user_id', userId).order('date', { ascending: false })
        ]);

        if (catsRes.data && catsRes.data.length > 0) {
          setCategories(catsRes.data.map(c => ({
            id: c.id,
            name: c.name,
            type: c.type,
            color: c.color,
            icon: c.icon,
            budgetLimit: Number(c.budget_limit || 0)
          })));
        } else {
          // First time user: seed default categories for them
          const initialCats = DEFAULT_CATEGORIES.map(c => ({
            id: c.id,
            user_id: userId,
            name: c.name,
            type: c.type,
            color: c.color,
            icon: c.icon,
            budget_limit: c.budgetLimit
          }));
          await supabase.from('categories').insert(initialCats);
          setCategories(DEFAULT_CATEGORIES);
        }

        if (srcRes.data && srcRes.data.length > 0) {
          setIncomeSources(srcRes.data.map(s => ({
            id: s.id,
            name: s.name,
            expectedMonthly: Number(s.expected_monthly || 0),
            color: s.color,
            icon: s.icon
          })));
        }

        if (expRes.data) {
          setExpenses(expRes.data.map(e => ({
            id: e.id,
            title: e.title,
            amount: Number(e.amount),
            categoryId: e.category_id,
            date: e.date,
            paymentMode: e.payment_mode,
            onlineSubtype: e.online_subtype,
            isUnplanned: e.is_unplanned,
            notes: e.notes
          })));
        }

        if (incRes.data) {
          setIncomes(incRes.data.map(i => ({
            id: i.id,
            sourceId: i.source_id,
            amount: Number(i.amount),
            date: i.date,
            notes: i.notes
          })));
        }
      } catch (err) {
        console.error('Error loading Supabase cloud data:', err);
      }
    } else {
      // Local simulation: scoped to userId
      const savedUserExp = localStorage.getItem(`spendpulse_${userId}_expenses`);
      const savedUserInc = localStorage.getItem(`spendpulse_${userId}_incomes`);
      const savedUserCats = localStorage.getItem(`spendpulse_${userId}_categories`);
      const savedUserSrc = localStorage.getItem(`spendpulse_${userId}_sources`);

      if (savedUserExp) setExpenses(JSON.parse(savedUserExp));
      if (savedUserInc) setIncomes(JSON.parse(savedUserInc));
      if (savedUserCats) setCategories(JSON.parse(savedUserCats));
      if (savedUserSrc) setIncomeSources(JSON.parse(savedUserSrc));
    }
  }, []);

  const setAuthUser = (user: { id: string; email: string } | null) => {
    setAuthUserState(user);
    if (user) {
      localStorage.setItem('spendpulse_auth_user', JSON.stringify(user));
      loadUserData(user.id);
    } else {
      localStorage.removeItem('spendpulse_auth_user');
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setAuthUser(null);
    // Restore sample view-only data
    setExpenses(DEFAULT_EXPENSES);
    setIncomes(DEFAULT_INCOMES);
    setCategories(DEFAULT_CATEGORIES);
    setIncomeSources(DEFAULT_INCOME_SOURCES);
  };

  // Actions (Protected: unauthenticated users trigger AuthModal)
  const addExpense = (expenseData: Omit<Expense, 'id'>): boolean => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return false;
    }
    const newId = 'exp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
    const newExpense: Expense = {
      ...expenseData,
      id: newId
    };
    setExpenses(prev => {
      const updated = [newExpense, ...prev];
      if (!isSupabaseConfigured) {
        localStorage.setItem(`spendpulse_${authUser.id}_expenses`, JSON.stringify(updated));
      }
      return updated;
    });

    if (isSupabaseConfigured) {
      supabase.from('expenses').insert({
        id: newId,
        user_id: authUser.id,
        title: newExpense.title,
        amount: newExpense.amount,
        category_id: newExpense.categoryId,
        date: newExpense.date,
        payment_mode: newExpense.paymentMode,
        online_subtype: newExpense.onlineSubtype || null,
        is_unplanned: newExpense.isUnplanned,
        notes: newExpense.notes || null
      }).then(({ error }) => {
        if (error) console.error('Supabase expense insert error:', error);
      });
    }

    return true;
  };

  const deleteExpense = (id: string): boolean => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return false;
    }
    setExpenses(prev => {
      const updated = prev.filter(e => e.id !== id);
      if (!isSupabaseConfigured) {
        localStorage.setItem(`spendpulse_${authUser.id}_expenses`, JSON.stringify(updated));
      }
      return updated;
    });

    if (isSupabaseConfigured) {
      supabase.from('expenses').delete().eq('id', id).eq('user_id', authUser.id).then(({ error }) => {
        if (error) console.error('Supabase expense delete error:', error);
      });
    }

    return true;
  };

  const addIncome = (incomeData: Omit<IncomeEntry, 'id'>): boolean => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return false;
    }
    const newId = 'inc-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
    const newIncome: IncomeEntry = {
      ...incomeData,
      id: newId
    };
    setIncomes(prev => {
      const updated = [newIncome, ...prev];
      if (!isSupabaseConfigured) {
        localStorage.setItem(`spendpulse_${authUser.id}_incomes`, JSON.stringify(updated));
      }
      return updated;
    });

    if (isSupabaseConfigured) {
      supabase.from('incomes').insert({
        id: newId,
        user_id: authUser.id,
        source_id: newIncome.sourceId,
        amount: newIncome.amount,
        date: newIncome.date,
        notes: newIncome.notes || null
      }).then(({ error }) => {
        if (error) console.error('Supabase income insert error:', error);
      });
    }

    return true;
  };

  const deleteIncome = (id: string): boolean => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return false;
    }
    setIncomes(prev => {
      const updated = prev.filter(i => i.id !== id);
      if (!isSupabaseConfigured) {
        localStorage.setItem(`spendpulse_${authUser.id}_incomes`, JSON.stringify(updated));
      }
      return updated;
    });

    if (isSupabaseConfigured) {
      supabase.from('incomes').delete().eq('id', id).eq('user_id', authUser.id).then(({ error }) => {
        if (error) console.error('Supabase income delete error:', error);
      });
    }

    return true;
  };

  const addCategory = (categoryData: Omit<Category, 'id'>): boolean => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return false;
    }
    const newId = 'cat-' + Date.now();
    const newCategory: Category = {
      ...categoryData,
      id: newId
    };
    setCategories(prev => {
      const updated = [...prev, newCategory];
      if (!isSupabaseConfigured) {
        localStorage.setItem(`spendpulse_${authUser.id}_categories`, JSON.stringify(updated));
      }
      return updated;
    });

    if (isSupabaseConfigured) {
      supabase.from('categories').insert({
        id: newId,
        user_id: authUser.id,
        name: newCategory.name,
        type: newCategory.type,
        color: newCategory.color,
        icon: newCategory.icon,
        budget_limit: newCategory.budgetLimit || 0
      }).then(({ error }) => {
        if (error) console.error('Supabase category insert error:', error);
      });
    }

    return true;
  };

  const updateCategory = (id: string, updated: Partial<Category>): boolean => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return false;
    }
    setCategories(prev => {
      const list = prev.map(c => c.id === id ? { ...c, ...updated } : c);
      if (!isSupabaseConfigured) {
        localStorage.setItem(`spendpulse_${authUser.id}_categories`, JSON.stringify(list));
      }
      return list;
    });

    if (isSupabaseConfigured) {
      supabase.from('categories').update({
        ...(updated.name ? { name: updated.name } : {}),
        ...(updated.type ? { type: updated.type } : {}),
        ...(updated.color ? { color: updated.color } : {}),
        ...(updated.icon ? { icon: updated.icon } : {}),
        ...(updated.budgetLimit !== undefined ? { budget_limit: updated.budgetLimit } : {})
      }).eq('id', id).eq('user_id', authUser.id).then(({ error }) => {
        if (error) console.error('Supabase category update error:', error);
      });
    }

    return true;
  };

  const deleteCategory = (id: string): boolean => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return false;
    }
    setCategories(prev => {
      const updated = prev.filter(c => c.id !== id);
      if (!isSupabaseConfigured) {
        localStorage.setItem(`spendpulse_${authUser.id}_categories`, JSON.stringify(updated));
      }
      return updated;
    });

    if (isSupabaseConfigured) {
      supabase.from('categories').delete().eq('id', id).eq('user_id', authUser.id).then(({ error }) => {
        if (error) console.error('Supabase category delete error:', error);
      });
    }

    return true;
  };

  const addIncomeSource = (sourceData: Omit<IncomeSource, 'id'>): boolean => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return false;
    }
    const newId = 'src-' + Date.now();
    const newSource: IncomeSource = {
      ...sourceData,
      id: newId
    };
    setIncomeSources(prev => {
      const updated = [...prev, newSource];
      if (!isSupabaseConfigured) {
        localStorage.setItem(`spendpulse_${authUser.id}_sources`, JSON.stringify(updated));
      }
      return updated;
    });

    if (isSupabaseConfigured) {
      supabase.from('income_sources').insert({
        id: newId,
        user_id: authUser.id,
        name: newSource.name,
        expected_monthly: newSource.expectedMonthly,
        color: newSource.color,
        icon: newSource.icon
      }).then(({ error }) => {
        if (error) console.error('Supabase income_source insert error:', error);
      });
    }

    return true;
  };

  const updateIncomeSource = (id: string, updated: Partial<IncomeSource>): boolean => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return false;
    }
    setIncomeSources(prev => {
      const list = prev.map(s => s.id === id ? { ...s, ...updated } : s);
      if (!isSupabaseConfigured) {
        localStorage.setItem(`spendpulse_${authUser.id}_sources`, JSON.stringify(list));
      }
      return list;
    });

    if (isSupabaseConfigured) {
      supabase.from('income_sources').update({
        ...(updated.name ? { name: updated.name } : {}),
        ...(updated.expectedMonthly !== undefined ? { expected_monthly: updated.expectedMonthly } : {}),
        ...(updated.color ? { color: updated.color } : {}),
        ...(updated.icon ? { icon: updated.icon } : {})
      }).eq('id', id).eq('user_id', authUser.id).then(({ error }) => {
        if (error) console.error('Supabase income_source update error:', error);
      });
    }

    return true;
  };

  const deleteIncomeSource = (id: string): boolean => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return false;
    }
    setIncomeSources(prev => {
      const updated = prev.filter(s => s.id !== id);
      if (!isSupabaseConfigured) {
        localStorage.setItem(`spendpulse_${authUser.id}_sources`, JSON.stringify(updated));
      }
      return updated;
    });

    if (isSupabaseConfigured) {
      supabase.from('income_sources').delete().eq('id', id).eq('user_id', authUser.id).then(({ error }) => {
        if (error) console.error('Supabase income_source delete error:', error);
      });
    }

    return true;
  };

  // Export / Import
  const exportDataJSON = () => {
    const data = {
      categories,
      incomeSources,
      incomes,
      expenses,
      currency,
      version: 1,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.categories && parsed.expenses && parsed.incomes) {
        setCategories(parsed.categories);
        setIncomeSources(parsed.incomeSources || DEFAULT_INCOME_SOURCES);
        setIncomes(parsed.incomes);
        setExpenses(parsed.expenses);
        if (parsed.currency) setCurrency(parsed.currency);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to import JSON', e);
      return false;
    }
  };

  const resetToSampleData = () => {
    setCategories(DEFAULT_CATEGORIES);
    setIncomeSources(DEFAULT_INCOME_SOURCES);
    setIncomes(DEFAULT_INCOMES);
    setExpenses(DEFAULT_EXPENSES);
  };

  // Month-filtered active transactions
  const monthlyExpenses = expenses.filter(e => e.date.startsWith(selectedMonth));
  const monthlyIncomes = incomes.filter(i => i.date.startsWith(selectedMonth));

  // Metrics calculation strictly for selected month
  const totalIncome = monthlyIncomes.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = monthlyExpenses.reduce((sum, item) => sum + item.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  // Savings total for selected month
  const savingsCategoryIds = new Set(categories.filter(c => c.type === 'savings').map(c => c.id));
  const savingsTotal = monthlyExpenses
    .filter(e => savingsCategoryIds.has(e.categoryId))
    .reduce((sum, e) => sum + e.amount, 0);

  // Unplanned / Leaks total for selected month
  const unplannedTotal = monthlyExpenses
    .filter(e => e.isUnplanned)
    .reduce((sum, e) => sum + e.amount, 0);

  // Payment mode split for selected month
  const onlineTotal = monthlyExpenses
    .filter(e => e.paymentMode === 'Online')
    .reduce((sum, e) => sum + e.amount, 0);

  const cashTotal = monthlyExpenses
    .filter(e => e.paymentMode === 'Cash')
    .reduce((sum, e) => sum + e.amount, 0);

  // Days remaining in month calculation
  const [yearStr, monthStr] = selectedMonth.split('-');
  const selYear = parseInt(yearStr, 10);
  const selMonth = parseInt(monthStr, 10);
  const daysInSelMonth = new Date(selYear, selMonth, 0).getDate();

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  let daysRemainingInMonth = daysInSelMonth;
  if (selectedMonth === currentMonthStr) {
    daysRemainingInMonth = Math.max(1, daysInSelMonth - now.getDate());
  } else if (selectedMonth > currentMonthStr) {
    // Future month
    daysRemainingInMonth = daysInSelMonth;
  } else {
    // Past month
    daysRemainingInMonth = 0;
  }

  // Safe daily spend (discretionary remaining / days left)
  const safeDailySpend = (netBalance > 0 && daysRemainingInMonth > 0)
    ? Math.round(netBalance / daysRemainingInMonth)
    : 0;
  const burnRatePercentage = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;

  const metrics: DashboardMetrics = {
    totalIncome,
    totalExpenses,
    netBalance,
    savingsTotal,
    unplannedTotal,
    onlineTotal,
    cashTotal,
    safeDailySpend,
    daysRemainingInMonth,
    burnRatePercentage
  };

  return (
    <FinanceContext.Provider
      value={{
        categories,
        incomeSources,
        incomes: monthlyIncomes,
        expenses: monthlyExpenses,
        allIncomes: incomes,
        allExpenses: expenses,
        metrics,
        currency,
        theme,
        activeTab,
        selectedMonth,
        joinMonth,
        canGoPrev,
        availableMonths,
        setSelectedMonth,
        goToPrevMonth,
        goToNextMonth,
        setActiveTab,
        setCurrency,
        toggleTheme,
        addExpense,
        deleteExpense,
        addIncome,
        deleteIncome,
        addCategory,
        updateCategory,
        deleteCategory,
        addIncomeSource,
        updateIncomeSource,
        deleteIncomeSource,
        authUser,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        setAuthUser,
        signOut,
        exportDataJSON,
        importDataJSON,
        resetToSampleData
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
