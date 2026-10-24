import React from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Wallet, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  CreditCard, 
  Banknote,
  Flame,
  Zap
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const MetricCards: React.FC = () => {
  const { metrics, currency, incomeSources } = useFinance();

  const getBalanceStatus = () => {
    if (metrics.totalIncome === 0) return { label: 'No Income Logged', color: 'var(--text-muted)', bg: 'rgba(148, 163, 184, 0.15)' };
    if (metrics.burnRatePercentage >= 90) return { label: 'Dangerously Low', color: 'var(--accent-rose)', bg: 'rgba(244, 63, 94, 0.15)' };
    if (metrics.burnRatePercentage >= 70) return { label: 'Caution: Fast Burn', color: 'var(--accent-amber)', bg: 'rgba(245, 158, 11, 0.15)' };
    return { label: 'Healthy Pace', color: 'var(--accent-emerald)', bg: 'rgba(16, 185, 129, 0.15)' };
  };

  const status = getBalanceStatus();

  return (
    <div className="metrics-grid">
      {/* 1. Net Remaining Balance (Hero Card) */}
      <div className="metric-card hero-balance" style={{ gridColumn: 'span 1' }}>
        <div className="metric-card-header">
          <div>
            <span className="metric-title" style={{ color: 'var(--accent-emerald-light)' }}>
              Net Available Balance
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
              <span 
                style={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 800, 
                  color: status.color, 
                  backgroundColor: status.bg,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${status.color}40`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {metrics.burnRatePercentage >= 80 ? <AlertTriangle size={11} /> : <ShieldCheck size={11} />}
                {status.label}
              </span>
            </div>
          </div>
          <div className="metric-icon-wrap metric-icon-balance">
            <Wallet size={22} />
          </div>
        </div>

        <div className="metric-value mono-num" style={{
          color: metrics.netBalance >= 0 ? 'var(--text-primary)' : 'var(--accent-rose)',
          fontSize: '2.4rem',
          margin: '6px 0 12px'
        }}>
          {currency}{metrics.netBalance.toLocaleString()}
        </div>

        {/* Burn progress indicator */}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span>Monthly Consumption:</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{metrics.burnRatePercentage}% Spent</span>
          </div>
          <div style={{ height: '7px', background: 'rgba(0, 0, 0, 0.15)', borderRadius: '99px', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${Math.min(100, metrics.burnRatePercentage)}%`, 
                background: metrics.burnRatePercentage >= 80 
                  ? 'linear-gradient(90deg, var(--accent-amber), var(--accent-rose))' 
                  : 'linear-gradient(90deg, var(--accent-emerald), var(--accent-cyan))',
                borderRadius: '99px',
                transition: 'width 0.4s ease'
              }} 
            />
          </div>
        </div>
      </div>

      {/* 2. Total Inflow */}
      <div className="metric-card">
        <div className="metric-card-header">
          <span className="metric-title">Total Inflows</span>
          <div className="metric-icon-wrap metric-icon-income">
            <ArrowDownLeft size={22} />
          </div>
        </div>
        <div className="metric-value mono-num" style={{ color: 'var(--accent-emerald-light)' }}>
          {currency}{metrics.totalIncome.toLocaleString()}
        </div>
        <div className="metric-subtext">
          <Sparkles size={14} color="var(--accent-emerald)" />
          <span>Across <strong>{incomeSources.length}</strong> active stream{incomeSources.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* 3. Total Expenses with Online vs Cash split */}
      <div className="metric-card">
        <div className="metric-card-header">
          <span className="metric-title">Total Outflows</span>
          <div className="metric-icon-wrap metric-icon-expense">
            <ArrowUpRight size={22} />
          </div>
        </div>
        <div className="metric-value mono-num" style={{ color: 'var(--accent-rose)' }}>
          {currency}{metrics.totalExpenses.toLocaleString()}
        </div>
        <div className="metric-subtext" style={{ gap: '10px', flexWrap: 'wrap' }}>
          <span className="badge badge-online" style={{ padding: '3px 8px', fontSize: '0.72rem' }}>
            <CreditCard size={11} /> {currency}{metrics.onlineTotal.toLocaleString()} Online
          </span>
          <span className="badge badge-cash" style={{ padding: '3px 8px', fontSize: '0.72rem' }}>
            <Banknote size={11} /> {currency}{metrics.cashTotal.toLocaleString()} Cash
          </span>
        </div>
      </div>

      {/* 4. Daily Safe-To-Spend Allowance */}
      <div className="metric-card hero-burn">
        <div className="metric-card-header">
          <div>
            <span className="metric-title" style={{ color: 'var(--accent-purple)' }}>
              Daily Safe Spend
            </span>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Guaranteed Survival Limit
            </div>
          </div>
          <div className="metric-icon-wrap metric-icon-burn">
            <Flame size={22} />
          </div>
        </div>
        <div className="metric-value mono-num" style={{ color: 'var(--accent-purple)' }}>
          {currency}{metrics.safeDailySpend.toLocaleString()}
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>/day</span>
        </div>
        <div className="metric-subtext">
          <Zap size={13} color="var(--accent-amber)" />
          <span>Safe limit for next <strong>{metrics.daysRemainingInMonth} days</strong></span>
        </div>
      </div>
    </div>
  );
};
