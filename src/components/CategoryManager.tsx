import React, { useState } from 'react';
import { Plus, Tag, Trash2, Edit2, PiggyBank } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import type { Category } from '../types/finance';

export const CategoryManager: React.FC = () => {
  const { categories, expenses, currency, addCategory, updateCategory, deleteCategory, openDeleteModal } = useFinance();

  const [showModal, setShowModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<'expense' | 'savings'>('expense');
  const [color, setColor] = useState('#10b981');
  const [budgetLimit, setBudgetLimit] = useState('');

  const PALETTE = [
    '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', 
    '#ec4899', '#f43f5e', '#f59e0b', '#14b8a6'
  ];

  const handleOpenAdd = () => {
    setEditingCategoryId(null);
    setName('');
    setType('expense');
    setColor(PALETTE[Math.floor(Math.random() * PALETTE.length)]);
    setBudgetLimit('');
    setShowModal(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setName(cat.name);
    setType(cat.type);
    setColor(cat.color);
    setBudgetLimit(cat.budgetLimit ? cat.budgetLimit.toString() : '');
    setShowModal(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const limitNum = budgetLimit ? parseFloat(budgetLimit) : undefined;

    if (editingCategoryId) {
      updateCategory(editingCategoryId, {
        name: name.trim(),
        type,
        color,
        budgetLimit: limitNum
      });
    } else {
      addCategory({
        name: name.trim(),
        type,
        color,
        icon: type === 'savings' ? 'PiggyBank' : 'Tag',
        budgetLimit: limitNum
      });
    }

    setShowModal(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>Dynamic Categories</h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Fully customizable categories (Food, Savings, Bills, Rent, Gadgets, Leaks). Add or edit anytime.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> New Category
        </button>
      </div>

      {/* Category Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {categories.map((cat) => {
          const catExpenses = expenses.filter(e => e.categoryId === cat.id);
          const totalSpent = catExpenses.reduce((sum, e) => sum + e.amount, 0);
          const budgetPercent = cat.budgetLimit && cat.budgetLimit > 0 
            ? Math.min(100, Math.round((totalSpent / cat.budgetLimit) * 100))
            : null;

          return (
            <div key={cat.id} className="glass-card" style={{ borderTop: `4px solid ${cat.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div 
                    style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: 'var(--radius-md)', 
                      backgroundColor: `${cat.color}20`,
                      color: cat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {cat.type === 'savings' ? <PiggyBank size={18} /> : <Tag size={18} />}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>{cat.name}</h4>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: cat.type === 'savings' ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                      {cat.type === 'savings' ? '💰 Savings Vault' : 'Expense Head'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button 
                    className="tx-delete-btn" 
                    title="Edit"
                    onClick={() => handleOpenEdit(cat)}
                  >
                    <Edit2 size={14} />
                  </button>
                  {categories.length > 1 && (
                    <button 
                      className="tx-delete-btn" 
                      title="Delete category"
                      onClick={() => {
                        openDeleteModal({
                          title: `Delete Category?`,
                          subtitle: `Are you sure you want to delete "${cat.name}"? Transactions categorized under this will remain in your ledger.`,
                          itemDetails: `${cat.name} (${cat.type === 'savings' ? 'Savings Bucket' : 'Expense Category'})`,
                          confirmLabel: 'Delete Category',
                          onConfirm: () => deleteCategory(cat.id)
                        });
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Total Spent */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Month-to-Date Total:</div>
                <div className="mono-num" style={{ fontSize: '1.35rem', fontWeight: 800, color: cat.color }}>
                  {currency}{totalSpent.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {catExpenses.length} transaction{catExpenses.length !== 1 ? 's' : ''} logged
                </div>
              </div>

              {/* Budget Progress Bar */}
              {cat.budgetLimit && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span>Budget Cap:</span>
                    <span>{currency}{cat.budgetLimit.toLocaleString()} ({budgetPercent}%)</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${budgetPercent}%`, 
                        backgroundColor: (budgetPercent || 0) > 90 ? 'var(--accent-rose)' : cat.color,
                        borderRadius: '99px'
                      }} 
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal for Add / Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingCategoryId ? 'Edit Category' : 'Create Dynamic Category'}</h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveCategory}>
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Food, Electricity & Recharge, Chitti Vault, Rent"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Classification</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className={`payment-toggle-btn ${type === 'expense' ? 'active cash' : ''}`}
                    onClick={() => setType('expense')}
                  >
                    💸 Standard Expense
                  </button>
                  <button
                    type="button"
                    className={`payment-toggle-btn ${type === 'savings' ? 'active online' : ''}`}
                    onClick={() => setType('savings')}
                  >
                    🏦 Savings / Vault
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Monthly Budget Cap (Optional)</label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  className="form-input mono-num"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Color Identifier</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {PALETTE.map(c => (
                    <button
                      key={c}
                      type="button"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: c,
                        border: color === c ? '3px solid #fff' : 'none',
                        cursor: 'pointer'
                      }}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCategoryId ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
