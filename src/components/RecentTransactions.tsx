import React, { useState } from 'react';
import { Trash2, CreditCard, Banknote, AlertOctagon, History, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const RecentTransactions: React.FC = () => {
  const { expenses, incomes, categories, incomeSources, currency, deleteExpense, deleteIncome, openDeleteModal } = useFinance();
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
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 className="chart-title">
          <History size={18} color="var(--accent-emerald)" />
          Recent Financial Activity
        </h3>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💸</div>
          <p>No transactions found for this filter.</p>
        </div>
      ) : (
        <div className="tx-list">
          {filteredTransactions.map(tx => (
            <div key={tx.id} className="tx-item">
              <div className="tx-left">
                <div 
                  className="tx-icon-box"
                  style={{ 
                    backgroundColor: `${tx.categoryObj?.color || '#64748b'}20`, 
                    color: tx.categoryObj?.color || 'var(--text-primary)' 
                  }}
                >
                  {tx.txType === 'income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>

                <div className="tx-info">
                  <div className="tx-title">
                    <span>{tx.title}</span>
                    {tx.isUnplanned && (
                      <span className="badge badge-leakage" title="Unplanned / Impulse Spend">
                        <AlertOctagon size={11} /> Leakage
                      </span>
                    )}
                  </div>
                  <div className="tx-meta">
                    <span>{tx.date}</span>
                    <span>•</span>
                    <span style={{ color: tx.categoryObj?.color }}>{tx.categoryObj?.name || 'General'}</span>
                    <span>•</span>
                    {tx.paymentMode === 'Online' ? (
                      <span className="badge badge-online">
                        <CreditCard size={11} /> {tx.onlineSubtype || 'Online'}
                      </span>
                    ) : (
                      <span className="badge badge-cash">
                        <Banknote size={11} /> Cash
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="tx-right">
                <div className={`tx-amount mono-num ${tx.txType}`}>
                  {tx.txType === 'income' ? '+' : '-'}{currency}{tx.amount.toLocaleString()}
                </div>
                <button
                  className="tx-delete-btn"
                  title="Delete record"
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
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
