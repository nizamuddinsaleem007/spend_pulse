import React, { useState, useEffect } from 'react';
import { PlusCircle, CreditCard, Banknote, AlertOctagon, Plus, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFinance } from '../context/FinanceContext';
import type { PaymentMode, OnlineSubtype } from '../types/finance';

interface InlineQuickAddProps {
  id?: string;
}

export const InlineQuickAdd: React.FC<InlineQuickAddProps> = ({ id }) => {
  const { 
    categories, 
    incomeSources, 
    currency, 
    addExpense, 
    addIncome, 
    addCategory,
    selectedMonth,
    authUser,
    openAuthModal
  } = useFinance();

  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');

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

  // Sync dates whenever selected month changes
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

  // Quick inline new category modal trigger
  const [showNewCatInput, setShowNewCatInput] = useState<boolean>(false);
  const [newCatName, setNewCatName] = useState<string>('');

  // Success flash message
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(expenseAmount);
    if (!amountNum || amountNum <= 0) return;
    if (!expenseTitle.trim()) return;

    const chosenCat = categories.find(c => c.id === selectedCategoryId) || categories[0];

    const added = addExpense({
      title: expenseTitle.trim(),
      amount: amountNum,
      categoryId: chosenCat.id,
      paymentMode,
      onlineSubtype: paymentMode === 'Online' ? onlineSubtype : undefined,
      isUnplanned,
      date: expenseDate
    });

    if (!added) return;

    if (chosenCat.type === 'savings') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
      showToast(`🎉 Saved ${currency}${amountNum.toLocaleString()} under ${chosenCat.name}!`);
    } else {
      showToast(`Logged ${expenseTitle} (${currency}${amountNum.toLocaleString()})`);
    }

    // Reset
    setExpenseAmount('');
    setExpenseTitle('');
    setIsUnplanned(false);
  };

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(incomeAmount);
    if (!amountNum || amountNum <= 0) return;

    const chosenSource = incomeSources.find(s => s.id === selectedSourceId) || incomeSources[0];

    const added = addIncome({
      sourceId: chosenSource.id,
      amount: amountNum,
      date: incomeDate,
      notes: incomeNotes.trim()
    });

    if (!added) return;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 }
    });

    showToast(`💰 Inflow Added: +${currency}${amountNum.toLocaleString()} (${chosenSource.name})`);
    setIncomeAmount('');
    setIncomeNotes('');
  };

  const handleCreateQuickCategory = () => {
    if (!newCatName.trim()) return;
    const colors = ['#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899', '#3b82f6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const added = addCategory({
      name: newCatName.trim(),
      type: 'expense',
      color: randomColor,
      icon: 'Tag'
    });

    if (!added) return;

    setNewCatName('');
    setShowNewCatInput(false);
    showToast(`Created category "${newCatName.trim()}"`);
  };

  return (
    <div className="glass-card quick-add-card" id={id}>
      {/* Auth / Guest Status Banner */}
      {!authUser ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          marginBottom: '16px',
          fontSize: '0.8rem',
          color: 'var(--accent-amber)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertOctagon size={16} />
            <span><strong>Guest View-Only Mode</strong>: You are viewing demo data. Logging transactions requires email authentication.</span>
          </div>
          <button 
            type="button" 
            onClick={openAuthModal}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: 'var(--accent-amber)',
              color: '#000',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Sign In
          </button>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          marginBottom: '16px',
          fontSize: '0.78rem',
          color: 'var(--accent-emerald)'
        }}>
          <Sparkles size={14} />
          <span>Private Vault Active for <strong>{authUser.email}</strong> — multi-device synced with Row-Level Security.</span>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
            Quick Entry Dock
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Log in seconds to stop salary disappearing untracked.
          </p>
        </div>

        {successMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid var(--accent-emerald)',
            color: '#fff',
            fontSize: '0.8rem',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Sparkles size={14} color="var(--accent-emerald)" />
            {successMsg}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="quick-add-tabs">
        <button
          type="button"
          className={`quick-tab-btn ${activeTab === 'expense' ? 'active expense' : ''}`}
          onClick={() => setActiveTab('expense')}
        >
          <PlusCircle size={16} />
          Log Expense
        </button>
        <button
          type="button"
          className={`quick-tab-btn ${activeTab === 'income' ? 'active income' : ''}`}
          onClick={() => setActiveTab('income')}
        >
          <PlusCircle size={16} />
          Log Income
        </button>
      </div>

      {/* EXPENSE FORM */}
      {activeTab === 'expense' && (
        <form onSubmit={handleExpenseSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            {/* Amount */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Expense Amount ({currency})</label>
              <div style={{ position: 'relative' }}>
                <span className="mono-num" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: 'var(--text-muted)' }}>
                  {currency}
                </span>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  className="form-input mono-num"
                  style={{ paddingLeft: '34px', fontSize: '1.15rem', fontWeight: 700 }}
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Title */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Expense Name / Title</label>
              <input
                type="text"
                placeholder="e.g. Swiggy lunch, KSEB Bill, Kuri"
                className="form-input"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Dynamic Category Chips Selection */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Select Category</label>
              <button 
                type="button" 
                style={{ background: 'none', border: 'none', color: 'var(--accent-emerald)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                onClick={() => setShowNewCatInput(!showNewCatInput)}
              >
                <Plus size={13} /> {showNewCatInput ? 'Cancel' : 'New Category'}
              </button>
            </div>

            {showNewCatInput && (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input 
                  type="text" 
                  placeholder="Category name..." 
                  className="form-input" 
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                />
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                  onClick={handleCreateQuickCategory}
                >
                  Save
                </button>
              </div>
            )}

            <div className="category-chips-scroll">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-chip ${selectedCategoryId === cat.id ? 'selected' : ''}`}
                  onClick={() => setSelectedCategoryId(cat.id)}
                >
                  <span className="category-chip-dot" style={{ backgroundColor: cat.color }} />
                  <span>{cat.name}</span>
                  {selectedCategoryId === cat.id && <Check size={12} />}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Mode Selector: Online vs Cash */}
          <div className="payment-mode-box">
            <label className="form-label" style={{ marginBottom: '8px' }}>Payment Mode</label>
            <div className="payment-toggle-group">
              <button
                type="button"
                className={`payment-toggle-btn ${paymentMode === 'Online' ? 'active online' : ''}`}
                onClick={() => setPaymentMode('Online')}
              >
                <CreditCard size={16} />
                Online Payment
              </button>
              <button
                type="button"
                className={`payment-toggle-btn ${paymentMode === 'Cash' ? 'active cash' : ''}`}
                onClick={() => setPaymentMode('Cash')}
              >
                <Banknote size={16} />
                Cash Payment
              </button>
            </div>

            {/* Sub-modes if Online */}
            {paymentMode === 'Online' && (
              <div className="online-subtypes-pills">
                {(['UPI', 'Debit Card', 'Credit Card', 'Net Banking', 'Other'] as OnlineSubtype[]).map((subtype) => (
                  <button
                    key={subtype}
                    type="button"
                    className={`subtype-pill ${onlineSubtype === subtype ? 'selected' : ''}`}
                    onClick={() => setOnlineSubtype(subtype)}
                  >
                    {subtype}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Impulse / Unplanned Leakage Switch */}
          <label className="leakage-toggle-wrap">
            <div className="leakage-text-group">
              <span className="leakage-label">
                <AlertOctagon size={16} />
                Spontaneous / Unplanned Spend 🚨
              </span>
              <span className="leakage-desc">
                Tags this expense for the "Salary Disappearance / Leakage" report.
              </span>
            </div>
            <input
              type="checkbox"
              className="toggle-checkbox"
              checked={isUnplanned}
              onChange={(e) => setIsUnplanned(e.target.checked)}
            />
          </label>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="date"
              className="form-input"
              style={{ width: '150px', padding: '10px 12px', fontSize: '0.85rem' }}
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px' }}>
              <Plus size={18} />
              Save Expense Entry
            </button>
          </div>
        </form>
      )}

      {/* INCOME FORM */}
      {activeTab === 'income' && (
        <form onSubmit={handleIncomeSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            {/* Amount */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Income Inflow ({currency})</label>
              <div style={{ position: 'relative' }}>
                <span className="mono-num" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: 'var(--text-muted)' }}>
                  {currency}
                </span>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  className="form-input mono-num"
                  style={{ paddingLeft: '34px', fontSize: '1.15rem', fontWeight: 700 }}
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Income Stream */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Income Source / Stream</label>
              <select
                className="form-select"
                value={selectedSourceId}
                onChange={(e) => setSelectedSourceId(e.target.value)}
              >
                {incomeSources.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g. October monthly salary, freelance bonus, dividend"
              className="form-input"
              value={incomeNotes}
              onChange={(e) => setIncomeNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="date"
              className="form-input"
              style={{ width: '150px', padding: '10px 12px', fontSize: '0.85rem' }}
              value={incomeDate}
              onChange={(e) => setIncomeDate(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, var(--accent-cyan), #0284c7)' }}>
              <Plus size={18} />
              Add Income Inflow
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
