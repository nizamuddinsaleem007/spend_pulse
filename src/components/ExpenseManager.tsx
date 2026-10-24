import React, { useState } from 'react';
import { Search, Trash2, CreditCard, Banknote, AlertOctagon, Download } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CustomDropdown } from './CustomDropdown';

export const ExpenseManager: React.FC = () => {
  const { expenses, categories, currency, deleteExpense, openDeleteModal } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exp.notes && exp.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || exp.categoryId === selectedCategory;
    const matchesMode = selectedMode === 'all' || exp.paymentMode === selectedMode;
    return matchesSearch && matchesCategory && matchesMode;
  });

  const totalFilteredAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const exportCSV = () => {
    const headers = ['Date', 'Title', 'Category', 'Amount', 'Payment Mode', 'Online Type', 'Unplanned', 'Notes'];
    const rows = filteredExpenses.map(e => {
      const cat = categories.find(c => c.id === e.categoryId)?.name || 'Unknown';
      return [
        e.date,
        `"${e.title.replace(/"/g, '""')}"`,
        `"${cat}"`,
        e.amount,
        e.paymentMode,
        e.onlineSubtype || '',
        e.isUnplanned ? 'Yes' : 'No',
        `"${(e.notes || '').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SpendPulse_Expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>Expense Manager</h2>

        </div>
        <button className="btn btn-secondary" onClick={exportCSV}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ marginBottom: '20px', padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search expenses..."
              className="form-input"
              style={{ paddingLeft: '36px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <CustomDropdown
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={[
                { value: 'all', label: `All Categories (${categories.length})` },
                ...categories.map(c => ({
                  value: c.id,
                  label: c.name,
                  color: c.color,
                  badge: c.type === 'savings' ? 'Savings' : undefined
                }))
              ]}
            />
          </div>

          {/* Payment Mode */}
          <div>
            <CustomDropdown
              value={selectedMode}
              onChange={setSelectedMode}
              options={[
                { value: 'all', label: 'All Payment Modes' },
                { value: 'Online', label: 'Online (UPI / Cards / NetBanking)', color: '#06b6d4' },
                { value: 'Cash', label: 'Cash Payments', color: '#f59e0b' }
              ]}
            />
          </div>
        </div>

        {/* Filter Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <span>Showing {filteredExpenses.length} entries</span>
          <span style={{ fontWeight: 700, color: 'var(--accent-rose)' }}>
            Filtered Total: {currency}{totalFilteredAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Expense List */}
      <div className="glass-card">
        {filteredExpenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <p>No matching expenses found.</p>
          </div>
        ) : (
          <div className="tx-list">
            {filteredExpenses.map(exp => {
              const cat = categories.find(c => c.id === exp.categoryId);
              return (
                <div key={exp.id} className="tx-item">
                  <div className="tx-left">
                    <div
                      className="tx-icon-box"
                      style={{
                        backgroundColor: `${cat?.color || '#f43f5e'}20`,
                        color: cat?.color || '#f43f5e'
                      }}
                    >
                      {exp.paymentMode === 'Online' ? <CreditCard size={20} /> : <Banknote size={20} />}
                    </div>

                    <div className="tx-info">
                      <div className="tx-title">
                        <span>{exp.title}</span>
                        {exp.isUnplanned && (
                          <span className="badge badge-leakage">
                            <AlertOctagon size={11} /> Unplanned
                          </span>
                        )}
                      </div>
                      <div className="tx-meta">
                        <span>{exp.date}</span>
                        <span>•</span>
                        <span style={{ color: cat?.color, fontWeight: 600 }}>{cat?.name || 'General'}</span>
                        <span>•</span>
                        <span className={exp.paymentMode === 'Online' ? 'badge badge-online' : 'badge badge-cash'}>
                          {exp.paymentMode === 'Online' ? (exp.onlineSubtype || 'Online') : 'Cash'}
                        </span>
                        {exp.notes && <span>• <em>{exp.notes}</em></span>}
                      </div>
                    </div>
                  </div>

                  <div className="tx-right">
                    <div className="tx-amount mono-num expense">
                      -{currency}{exp.amount.toLocaleString()}
                    </div>
                    <button
                      className="tx-delete-btn"
                      title="Delete expense"
                      onClick={() => {
                        openDeleteModal({
                          title: `Delete Expense?`,
                          subtitle: `Are you sure you want to delete "${exp.title}"? This record will be permanently deleted.`,
                          itemDetails: `${exp.title} • -${currency}${exp.amount.toLocaleString()} (${cat?.name || 'General'})`,
                          confirmLabel: 'Delete Expense',
                          onConfirm: () => deleteExpense(exp.id)
                        });
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
