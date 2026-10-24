import React, { useState } from 'react';
import { Plus, Wallet, Trash2, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFinance } from '../context/FinanceContext';
import { CustomDropdown } from './CustomDropdown';

export const IncomeManager: React.FC = () => {
  const { 
    incomeSources, 
    incomes, 
    currency, 
    addIncomeSource, 
    deleteIncomeSource, 
    addIncome, 
    deleteIncome,
    openDeleteModal
  } = useFinance();

  // New source modal
  const [showAddSource, setShowAddSource] = useState(false);
  const [sourceName, setSourceName] = useState('');
  const [expectedAmount, setExpectedAmount] = useState('');
  const [sourceColor, setSourceColor] = useState('#10b981');

  // Inflow log state
  const [selectedSourceId, setSelectedSourceId] = useState(incomeSources[0]?.id || '');
  const [inflowAmount, setInflowAmount] = useState('');
  const [inflowNotes, setInflowNotes] = useState('');
  const [inflowDate, setInflowDate] = useState(() => new Date().toISOString().split('T')[0]);

  const handleCreateSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceName.trim()) return;

    addIncomeSource({
      name: sourceName.trim(),
      expectedMonthly: expectedAmount ? parseFloat(expectedAmount) : undefined,
      color: sourceColor,
      icon: 'Wallet'
    });

    setSourceName('');
    setExpectedAmount('');
    setShowAddSource(false);
  };

  const handleLogIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(inflowAmount);
    if (!amt || amt <= 0) return;

    addIncome({
      sourceId: selectedSourceId || incomeSources[0].id,
      amount: amt,
      date: inflowDate,
      notes: inflowNotes.trim()
    });

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });

    setInflowAmount('');
    setInflowNotes('');
  };

  // Group incomes by source for summary
  const streamStats = incomeSources.map(source => {
    const totalReceived = incomes
      .filter(i => i.sourceId === source.id)
      .reduce((sum, i) => sum + i.amount, 0);
    return {
      ...source,
      totalReceived
    };
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>Multiple Income Streams</h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Configure dynamic income sources (Salary, Freelancing, Rental, Side Hustles) and log payments.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddSource(true)}>
          <Plus size={16} /> New Income Stream
        </button>
      </div>

      {/* Income Streams Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {streamStats.map(stream => (
          <div key={stream.id} className="glass-card" style={{ borderLeft: `4px solid ${stream.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: stream.color }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stream.name}</h4>
              </div>
              {incomeSources.length > 1 && (
                <button
                  className="tx-delete-btn"
                  title="Delete stream"
                  onClick={() => {
                    openDeleteModal({
                      title: `Delete Income Stream?`,
                      subtitle: `Are you sure you want to delete "${stream.name}"? Historical entries using this stream will remain in your records.`,
                      itemDetails: stream.name,
                      confirmLabel: 'Delete Stream',
                      onConfirm: () => deleteIncomeSource(stream.id)
                    });
                  }}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <div style={{ margin: '8px 0' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Total Inflow Received:</span>
              <div className="mono-num" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                {currency}{stream.totalReceived.toLocaleString()}
              </div>
            </div>

            {stream.expectedMonthly && (
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Target: {currency}{stream.expectedMonthly.toLocaleString()}/mo
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Log Income Inflow Widget */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <h3 className="chart-title" style={{ marginBottom: '16px' }}>
          <TrendingUp size={18} color="var(--accent-emerald)" />
          Log Inflow to a Stream
        </h3>
        <form onSubmit={handleLogIncome}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
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

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Inflow Amount ({currency})</label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 50000"
                className="form-input mono-num"
                value={inflowAmount}
                onChange={(e) => setInflowAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Date Received</label>
              <input
                type="date"
                className="form-input"
                value={inflowDate}
                onChange={(e) => setInflowDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <input
              type="text"
              placeholder="e.g. Monthly salary, milestone 2 payout, interest"
              className="form-input"
              value={inflowNotes}
              onChange={(e) => setInflowNotes(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>
            <Plus size={16} /> Record Inflow
          </button>
        </form>
      </div>

      {/* Inflow Log History */}
      <div className="glass-card">
        <h3 className="chart-title" style={{ marginBottom: '16px' }}>
          <Wallet size={18} color="var(--accent-cyan)" />
          Income History
        </h3>
        {incomes.length === 0 ? (
          <div className="empty-state">
            <p>No income inflows recorded yet.</p>
          </div>
        ) : (
          <div className="tx-list">
            {incomes.map(inc => {
              const src = incomeSources.find(s => s.id === inc.sourceId);
              return (
                <div key={inc.id} className="tx-item">
                  <div className="tx-left">
                    <div className="tx-icon-box" style={{ backgroundColor: `${src?.color || '#10b981'}20`, color: src?.color || '#10b981' }}>
                      <TrendingUp size={20} />
                    </div>
                    <div className="tx-info">
                      <div className="tx-title">{src?.name || 'Income Inflow'}</div>
                      <div className="tx-meta">
                        <span>{inc.date}</span>
                        {inc.notes && <span>• <em>{inc.notes}</em></span>}
                      </div>
                    </div>
                  </div>
                  <div className="tx-right">
                    <div className="tx-amount mono-num income">
                      +{currency}{inc.amount.toLocaleString()}
                    </div>
                    <button
                      className="tx-delete-btn"
                      title="Delete income inflow"
                      onClick={() => {
                        openDeleteModal({
                          title: `Delete Income Inflow?`,
                          subtitle: `Are you sure you want to delete this recorded inflow? It will be permanently removed.`,
                          itemDetails: `${src?.name || 'Inflow'} • +${currency}${inc.amount.toLocaleString()} on ${inc.date}`,
                          confirmLabel: 'Delete Inflow',
                          onConfirm: () => deleteIncome(inc.id)
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

      {/* Add New Stream Modal */}
      {showAddSource && (
        <div className="modal-overlay" onClick={() => setShowAddSource(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create Income Stream</h3>
              <button className="modal-close-btn" onClick={() => setShowAddSource(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateSource}>
              <div className="form-group">
                <label className="form-label">Stream Name</label>
                <input
                  type="text"
                  placeholder="e.g. Primary Salary, Freelancing, Rental Income"
                  className="form-input"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Expected Monthly Amount (Optional)</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  className="form-input mono-num"
                  value={expectedAmount}
                  onChange={(e) => setExpectedAmount(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Badge Color</label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  {['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#3b82f6', '#ec4899'].map(c => (
                    <button
                      key={c}
                      type="button"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: c,
                        border: sourceColor === c ? '3px solid #fff' : 'none',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSourceColor(c)}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddSource(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Stream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
