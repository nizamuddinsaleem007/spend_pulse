import React, { useState } from 'react';
import { Trash2, CreditCard, Banknote, AlertOctagon, History, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const RecentTransactions: React.FC = () => {
  const { expenses, incomes, categories, incomeSources, currency, deleteExpense, deleteIncome, openDeleteModal, setActiveTab } = useFinance();
  const [filter, setFilter] = useState<'all' | 'expense' | 'income' | 'online' | 'cash' | 'unplanned'>('all');

  // Combine expenses and incomes into a unified list
  const unifiedTransactions = [
    ...expenses.map(e => ({
      ...e,
      txType: 'expense' as const,
      categoryObj: categories.find(c => c.id === e.categoryId)
    })),
    ...incomes.map(i => ({
      id: i.id,
      title: incomeSources.find(s => s.id === i.sourceId)?.name || 'Income Inflow',
      amount: i.amount,
      date: i.date,
      paymentMode: 'Online' as const,
      onlineSubtype: 'Bank Transfer' as any,
      isUnplanned: false,
      notes: i.notes,
      txType: 'income' as const,
      categoryObj: {
        name: 'Inflow',
        color: '#10b981',
        icon: 'Wallet'
      }
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredTransactions = unifiedTransactions.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'expense') return item.txType === 'expense';
    if (filter === 'income') return item.txType === 'income';
    if (filter === 'online') return item.paymentMode === 'Online';
    if (filter === 'cash') return item.paymentMode === 'Cash';
    if (filter === 'unplanned') return item.isUnplanned;
    return true;
  });

  return (
    <div className="glass-card" style={{ padding: '18px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 className="chart-title" style={{ fontSize: '1.02rem', margin: 0 }}>
            <History size={18} color="var(--accent-emerald)" />
            Recent Activity
          </h3>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            ({filteredTransactions.length})
          </span>
        </div>

        <button 
          onClick={() => setActiveTab('expenses')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--accent-emerald)',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            padding: '4px 6px'
          }}
        >
          View All & Filter →
        </button>
      </div>

      {/* Filter Pills with Horizontal Swipe */}
      <div style={{ 
        display: 'flex', 
        gap: '6px', 
        overflowX: 'auto', 
        paddingBottom: '8px',
        marginBottom: '10px',
        maxWidth: '100%',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch'
      }}>
        {[
          { id: 'all', label: 'All' },
          { id: 'expense', label: 'Expenses' },
          { id: 'income', label: 'Incomes' },
          { id: 'online', label: 'Online' },
          { id: 'cash', label: 'Cash' },
          { id: 'unplanned', label: '🚨 Leaks' }
        ].map(f => (
          <button
            key={f.id}
            className={`subtype-pill ${filter === f.id ? 'selected' : ''}`}
            onClick={() => setFilter(f.id as any)}
            style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="empty-state" style={{ padding: '36px 16px' }}>
          <div className="empty-state-icon">💸</div>
          <p style={{ fontSize: '0.88rem' }}>No transactions found for this filter.</p>
        </div>
      ) : (
        <div className="tx-list">
          {filteredTransactions.map(tx => (
            <div key={tx.id} className="tx-item" style={{ padding: '12px 14px' }}>
              <div className="tx-left" style={{ minWidth: 0, flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div 
                  className="tx-icon-box"
                  style={{ 
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-sm)',
                    flexShrink: 0,
                    backgroundColor: `${tx.categoryObj?.color || '#64748b'}20`, 
                    color: tx.categoryObj?.color || 'var(--text-primary)' 
                  }}
                >
                  {tx.txType === 'income' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                </div>

                <div className="tx-info" style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div className="tx-title" style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.title}
                    </span>
                    {tx.isUnplanned && (
                      <span className="badge badge-leakage" title="Unplanned / Impulse Spend" style={{ flexShrink: 0, padding: '2px 6px', fontSize: '0.65rem' }}>
                        <AlertOctagon size={10} /> Leak
                      </span>
                    )}
                  </div>
                  <div className="tx-meta" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', flexWrap: 'wrap' }}>
                    <span>{tx.date}</span>
                    <span>•</span>
                    <span style={{ color: tx.categoryObj?.color, fontWeight: 600 }}>{tx.categoryObj?.name || 'General'}</span>
                    <span>•</span>
                    {tx.paymentMode === 'Online' ? (
                      <span className="badge badge-online" style={{ padding: '1px 6px', fontSize: '0.66rem' }}>
                        <CreditCard size={10} /> {tx.onlineSubtype || 'Online'}
                      </span>
                    ) : (
                      <span className="badge badge-cash" style={{ padding: '1px 6px', fontSize: '0.66rem' }}>
                        <Banknote size={10} /> Cash
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="tx-right" style={{ flexShrink: 0, marginLeft: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className={`tx-amount mono-num ${tx.txType}`} style={{ fontSize: '1rem', fontWeight: 800 }}>
                  {tx.txType === 'income' ? '+' : '-'}{currency}{tx.amount.toLocaleString()}
                </div>
                <button
                  className="tx-delete-btn"
                  title="Delete record"
                  style={{ padding: '6px' }}
                  onClick={() => {
                    openDeleteModal({
                      title: `Delete ${tx.txType === 'expense' ? 'Expense' : 'Income'}?`,
                      subtitle: `Are you sure you want to delete "${tx.title}"? This record will be permanently removed.`,
                      itemDetails: `${tx.title} • ${tx.txType === 'income' ? '+' : '-'}${currency}${tx.amount.toLocaleString()} on ${tx.date}`,
                      confirmLabel: 'Delete Record',
                      onConfirm: () => {
                        if (tx.txType === 'expense') deleteExpense(tx.id);
                        else deleteIncome(tx.id);
                      }
                    });
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
