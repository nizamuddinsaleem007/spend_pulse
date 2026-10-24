import React, { useState, useEffect } from 'react';
import { 
  X, 
  CreditCard, 
  Banknote, 
  AlertOctagon, 
  Check, 
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFinance } from '../context/FinanceContext';
import type { PaymentMode, OnlineSubtype } from '../types/finance';
import { CustomDropdown } from './CustomDropdown';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'expense' | 'income';
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ 
  isOpen, 
  onClose,
  initialTab = 'expense'
}) => {
  const { 
    categories, 
    incomeSources, 
    currency, 
    addExpense, 
    addIncome,
    selectedMonth,
    authUser,
    openAuthModal
  } = useFinance();

  const [activeTab, setActiveTab] = useState<'expense' | 'income'>(initialTab);

  // Sync initial tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Expense form state
  const [expenseAmount, setExpenseAmount] = useState<string>('');
  const [expenseTitle, setExpenseTitle] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id || '');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Online');
  const [onlineSubtype, setOnlineSubtype] = useState<OnlineSubtype>('UPI');
  const [isUnplanned, setIsUnplanned] = useState<boolean>(false);
  const [expenseDate, setExpenseDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // Income form state
  const [incomeAmount, setIncomeAmount] = useState<string>('');
  const [selectedSourceId, setSelectedSourceId] = useState<string>(incomeSources[0]?.id || '');
  const [incomeNotes, setIncomeNotes] = useState<string>('');
  const [incomeDate, setIncomeDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // Sync date to selected month
  useEffect(() => {
    const today = new Date();
    const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    if (selectedMonth === currentMonthStr) {
      const todayISO = today.toISOString().split('T')[0];
      setExpenseDate(todayISO);
      setIncomeDate(todayISO);
    } else {
      setExpenseDate(`${selectedMonth}-01`);
      setIncomeDate(`${selectedMonth}-01`);
    }
  }, [selectedMonth]);

  // Quick suggestion tags for youngsters
  const quickExpenseSuggestions = ['Lunch', 'Coffee', 'Groceries', 'Fuel', 'Swiggy', 'Auto/Cab', 'Shopping'];

  // Close on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) {
      onClose();
      openAuthModal();
      return;
    }

    const amountNum = parseFloat(expenseAmount);
    if (!amountNum || amountNum <= 0) return;

    const chosenCat = categories.find(c => c.id === selectedCategoryId) || categories[0];
    const finalTitle = expenseTitle.trim() || chosenCat.name || 'Expense';

    const added = addExpense({
      title: finalTitle,
      amount: amountNum,
      categoryId: chosenCat.id,
      paymentMode,
      onlineSubtype: paymentMode === 'Online' ? onlineSubtype : undefined,
      isUnplanned,
      date: expenseDate
    });

    if (!added) return;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });

    // Reset & close
    setExpenseAmount('');
    setExpenseTitle('');
    setIsUnplanned(false);
    onClose();
  };

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) {
      onClose();
      openAuthModal();
      return;
    }

    const amountNum = parseFloat(incomeAmount);
    if (!amountNum || amountNum <= 0) return;

    const chosenSource = incomeSources.find(s => s.id === selectedSourceId) || incomeSources[0];

    const added = addIncome({
      sourceId: chosenSource.id,
      amount: amountNum,
      date: incomeDate,
      notes: incomeNotes.trim() || undefined
    });

    if (!added) return;

    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.7 }
    });

    setIncomeAmount('');
    setIncomeNotes('');
    onClose();
  };

  return (
    <div 
      className="mobile-overlay active" 
      onClick={onClose}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: 0,
        zIndex: 110
      }}
    >
      <div 
        className="mobile-bottom-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          backgroundColor: '#0c1017',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderBottom: 'none',
          padding: '16px 20px 28px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -20px 50px rgba(0, 0, 0, 0.8)',
          overflowY: 'auto',
          animation: 'slideUpSheet 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* iOS style sheet pull bar */}
        <div style={{
          width: '40px',
          height: '4px',
          borderRadius: '99px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          margin: '0 auto 14px'
        }} />

        {/* Sheet Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Quick Entry Vault
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Log transactions with one tap
            </span>
          </div>

          <button 
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Expense vs Income Toggle Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-input)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '18px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('expense')}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: activeTab === 'expense' ? 'rgba(244, 63, 94, 0.2)' : 'transparent',
              color: activeTab === 'expense' ? 'var(--accent-rose)' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <ArrowUpRight size={16} />
            Expense Outflow
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('income')}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: activeTab === 'income' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              color: activeTab === 'income' ? 'var(--accent-emerald)' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <ArrowDownLeft size={16} />
            Income Inflow
          </button>
        </div>

        {/* EXPENSE FORM */}
        {activeTab === 'expense' && (
          <form onSubmit={handleExpenseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Amount input (Hero field) */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Amount ({currency})</label>
              <div style={{ position: 'relative' }}>
                <span className="mono-num" style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontWeight: 800,
                  fontSize: '1.4rem',
                  color: 'var(--accent-rose)'
                }}>
                  {currency}
                </span>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  className="form-input mono-num"
                  style={{
                    paddingLeft: '44px',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    height: '54px',
                    borderRadius: 'var(--radius-md)'
                  }}
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                  inputMode="decimal"
                  autoFocus
                  required
                />
              </div>
            </div>

            {/* Title / Merchant Name (Optional) */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>
                Expense Title / Merchant <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="Optional (e.g. Swiggy Lunch, Metro)"
                className="form-input"
                style={{ height: '46px', fontSize: '0.95rem' }}
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
              />
              {/* Quick suggestion tags */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginTop: '6px', paddingBottom: '2px' }}>
                {quickExpenseSuggestions.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setExpenseTitle(tag)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.72rem',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    +{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selector */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Category</label>
              <div style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '6px',
                scrollbarWidth: 'none'
              }}>
                {categories.map(cat => {
                  const isSelected = selectedCategoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategoryId(cat.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-full)',
                        border: isSelected ? `2px solid ${cat.color}` : '1px solid var(--border-subtle)',
                        background: isSelected ? `${cat.color}22` : 'var(--bg-input)',
                        color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}
                    >
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color }} />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Mode (Online vs Cash) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              background: 'var(--bg-input)',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setPaymentMode('Online')}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: paymentMode === 'Online' ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                    background: paymentMode === 'Online' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    color: paymentMode === 'Online' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  <CreditCard size={15} />
                  Online
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode('Cash')}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: paymentMode === 'Cash' ? '1px solid var(--accent-emerald)' : '1px solid transparent',
                    background: paymentMode === 'Cash' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    color: paymentMode === 'Cash' ? 'var(--accent-emerald)' : 'var(--text-muted)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  <Banknote size={15} />
                  Cash
                </button>
              </div>

              {paymentMode === 'Online' && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(['UPI', 'Debit Card', 'Credit Card', 'Net Banking'] as OnlineSubtype[]).map(sub => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setOnlineSubtype(sub)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        border: onlineSubtype === sub ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                        background: onlineSubtype === sub ? 'rgba(6, 182, 212, 0.18)' : 'transparent',
                        color: onlineSubtype === sub ? 'var(--accent-cyan)' : 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Unplanned / Impulse leak toggle */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(244, 63, 94, 0.08)',
              border: '1px dashed rgba(244, 63, 94, 0.3)',
              cursor: 'pointer'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertOctagon size={16} color="var(--accent-rose)" />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-rose)' }}>
                    Unplanned / Impulse Spend 🚨
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    Flags this for salary leak analysis
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isUnplanned}
                onChange={(e) => setIsUnplanned(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--accent-rose)', cursor: 'pointer' }}
              />
            </label>

            {/* Submit button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1rem',
                fontWeight: 800,
                borderRadius: 'var(--radius-md)',
                marginTop: '6px',
                background: 'linear-gradient(135deg, var(--accent-rose), #e11d48)',
                boxShadow: '0 6px 20px rgba(244, 63, 94, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <Check size={18} />
              <span>Add Expense • {currency}{parseFloat(expenseAmount || '0').toLocaleString()}</span>
            </button>
          </form>
        )}

        {/* INCOME FORM */}
        {activeTab === 'income' && (
          <form onSubmit={handleIncomeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Amount input */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Income Amount ({currency})</label>
              <div style={{ position: 'relative' }}>
                <span className="mono-num" style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontWeight: 800,
                  fontSize: '1.4rem',
                  color: 'var(--accent-emerald)'
                }}>
                  {currency}
                </span>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  className="form-input mono-num"
                  style={{
                    paddingLeft: '44px',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    height: '54px',
                    borderRadius: 'var(--radius-md)'
                  }}
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                  inputMode="decimal"
                  autoFocus
                  required
                />
              </div>
            </div>

            {/* Stream Selector */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <CustomDropdown
                label="Select Income Stream"
                value={selectedSourceId}
                onChange={setSelectedSourceId}
                options={incomeSources.map(s => ({
                  value: s.id,
                  label: s.name,
                  color: s.color,
                  badge: s.expectedMonthly ? `${currency}${s.expectedMonthly.toLocaleString()}/mo` : undefined
                }))}
              />
            </div>

            {/* Notes */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Deposit Note / Employer / Client</label>
              <input
                type="text"
                placeholder="e.g. October Salary, Freelance milestone, Dividends"
                className="form-input"
                style={{ height: '46px', fontSize: '0.95rem' }}
                value={incomeNotes}
                onChange={(e) => setIncomeNotes(e.target.value)}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '1rem',
                fontWeight: 800,
                borderRadius: 'var(--radius-md)',
                marginTop: '6px',
                background: 'linear-gradient(135deg, var(--accent-emerald), var(--accent-cyan))',
                color: '#07090e',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <Check size={18} />
              <span>Log Inflow • {currency}{parseFloat(incomeAmount || '0').toLocaleString()}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
