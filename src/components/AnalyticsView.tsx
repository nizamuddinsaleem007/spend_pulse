import React from 'react';
import { 
  Flame, 
  AlertTriangle, 
  CreditCard, 
  PiggyBank, 
  ShieldAlert, 
  TrendingDown, 
  CheckCircle2
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const AnalyticsView: React.FC = () => {
  const { metrics, currency, expenses, categories } = useFinance();

  const unplannedExpenses = expenses.filter(e => e.isUnplanned);
  const unplannedPercentOfTotal = metrics.totalExpenses > 0 
    ? Math.round((metrics.unplannedTotal / metrics.totalExpenses) * 100) 
    : 0;

  const savingsRate = metrics.totalIncome > 0 
    ? Math.round((metrics.savingsTotal / metrics.totalIncome) * 100) 
    : 0;

  const onlinePercent = metrics.totalExpenses > 0 
    ? Math.round((metrics.onlineTotal / metrics.totalExpenses) * 100) 
    : 0;

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Burn Rate & Salary Leakage Audit
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
          Insights engineered to solve the "where did my salary vanish?" problem.
        </p>
      </div>

      {/* Hero Burn Warning Card */}
      <div 
        className="glass-card" 
        style={{ 
          marginBottom: '24px', 
          background: metrics.burnRatePercentage >= 80 
            ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.15), rgba(245, 158, 11, 0.08))' 
            : 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.08))',
          border: metrics.burnRatePercentage >= 80 
            ? '1px solid rgba(244, 63, 94, 0.4)' 
            : '1px solid rgba(16, 185, 129, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: metrics.burnRatePercentage >= 80 ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            color: metrics.burnRatePercentage >= 80 ? 'var(--accent-rose)' : 'var(--accent-emerald)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {metrics.burnRatePercentage >= 80 ? <Flame size={24} /> : <CheckCircle2 size={24} />}
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
              {metrics.burnRatePercentage >= 80 ? '🚨 Rapid Burn Rate Alert' : '✅ Healthy Monthly Pacing'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              You have consumed <strong>{metrics.burnRatePercentage}%</strong> of your total recorded income.
            </p>
          </div>
        </div>

        {/* Burn progress bar */}
        <div style={{ height: '10px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '99px', overflow: 'hidden', marginBottom: '12px' }}>
          <div 
            style={{ 
              height: '100%', 
              width: `${Math.min(100, metrics.burnRatePercentage)}%`, 
              background: metrics.burnRatePercentage >= 80 
                ? 'linear-gradient(90deg, var(--accent-amber), var(--accent-rose))' 
                : 'linear-gradient(90deg, var(--accent-emerald), var(--accent-cyan))',
              borderRadius: '99px'
            }} 
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <span>Spent: {currency}{metrics.totalExpenses.toLocaleString()}</span>
          <span>Remaining: {currency}{metrics.netBalance.toLocaleString()}</span>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Unplanned Leakage */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <ShieldAlert size={20} color="var(--accent-rose)" />
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>Unplanned / Leakage Spends</h4>
          </div>
          <div className="mono-num" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
            {currency}{metrics.unplannedTotal.toLocaleString()}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Accounts for <strong>{unplannedPercentOfTotal}%</strong> of your entire expenses this month.
          </p>
        </div>

        {/* Online Scans (UPI & Cards) */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <CreditCard size={20} color="var(--accent-cyan)" />
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>Online & UPI Velocity</h4>
          </div>
          <div className="mono-num" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {onlinePercent}%
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {currency}{metrics.onlineTotal.toLocaleString()} spent digitally vs {currency}{metrics.cashTotal.toLocaleString()} in physical cash.
          </p>
        </div>

        {/* Savings Retention */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <PiggyBank size={20} color="var(--accent-emerald)" />
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>Savings Ratio</h4>
          </div>
          <div className="mono-num" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {savingsRate}%
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {currency}{metrics.savingsTotal.toLocaleString()} routed directly into your Savings/Vault categories.
          </p>
        </div>
      </div>

      {/* Unplanned Expenses Audit Table */}
      <div className="glass-card">
        <h3 className="chart-title" style={{ marginBottom: '14px' }}>
          <AlertTriangle size={18} color="var(--accent-rose)" />
          All Flagged Spontaneous & Unplanned Buys
        </h3>
        {unplannedExpenses.length === 0 ? (
          <div className="empty-state">
            <p>Awesome! No unplanned or spontaneous expenses logged this month.</p>
          </div>
        ) : (
          <div className="tx-list">
            {unplannedExpenses.map(exp => {
              const cat = categories.find(c => c.id === exp.categoryId);
              return (
                <div key={exp.id} className="tx-item" style={{ borderColor: 'rgba(244, 63, 94, 0.2)' }}>
                  <div className="tx-left">
                    <div className="tx-icon-box" style={{ backgroundColor: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)' }}>
                      <TrendingDown size={20} />
                    </div>
                    <div className="tx-info">
                      <div className="tx-title">{exp.title}</div>
                      <div className="tx-meta">
                        <span>{exp.date}</span>
                        <span>•</span>
                        <span style={{ color: cat?.color }}>{cat?.name}</span>
                        <span>•</span>
                        <span>{exp.paymentMode} ({exp.onlineSubtype || 'Cash'})</span>
                        {exp.notes && <span>• <em>{exp.notes}</em></span>}
                      </div>
                    </div>
                  </div>
                  <div className="tx-amount mono-num expense">
                    -{currency}{exp.amount.toLocaleString()}
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
