import React from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Wallet, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  CreditCard, 
  Flame,
  Zap,
  AlertOctagon
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

interface MetricCardsProps {
  onOpenQuickAdd?: (tab: 'expense' | 'income') => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ onOpenQuickAdd }) => {
  const { metrics, currency, incomeSources } = useFinance();

  const getBalanceStatus = () => {
    if (metrics.totalIncome === 0) return { label: 'No Income Logged', color: 'var(--text-muted)', bg: 'rgba(148, 163, 184, 0.15)' };
    if (metrics.burnRatePercentage >= 90) return { label: 'Dangerously Low', color: 'var(--accent-rose)', bg: 'rgba(244, 63, 94, 0.15)' };
    if (metrics.burnRatePercentage >= 70) return { label: 'Caution: Fast Burn', color: 'var(--accent-amber)', bg: 'rgba(245, 158, 11, 0.15)' };
    return { label: 'Healthy Pace', color: 'var(--accent-emerald)', bg: 'rgba(16, 185, 129, 0.15)' };
  };

  const status = getBalanceStatus();

  return (
    <div className="metrics-section">
      {/* 1. Net Remaining Balance (Hero Card) */}
      <div className="metric-card hero-balance">
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
          fontSize: '2.5rem',
          margin: '6px 0 12px'
        }}>
          {currency}{metrics.netBalance.toLocaleString()}
        </div>

        {/* Burn progress indicator */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span>Monthly Consumption:</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{metrics.burnRatePercentage}% Spent</span>
          </div>
          <div style={{ height: '7px', background: 'rgba(0, 0, 0, 0.25)', borderRadius: '99px', overflow: 'hidden' }}>
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

        {/* Quick Action Touch Buttons (Instant entry from dashboard hero) */}
        {onOpenQuickAdd && (
          <div className="hero-quick-actions" style={{
            display: 'flex',
            gap: '10px',
            marginTop: '16px',
            paddingTop: '14px',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => onOpenQuickAdd('expense')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '11px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: 'var(--accent-rose)',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <ArrowUpRight size={16} />
              + Expense
            </button>

            <button
              onClick={() => onOpenQuickAdd('income')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '11px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--accent-emerald)',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <ArrowDownLeft size={16} />
              + Income
            </button>
          </div>
        )}
      </div>

      {/* Secondary Metrics: Inflows, Outflows, Safe Spend, and Leaks */}
      <div className="secondary-metrics-grid">
        {/* 2. Total Inflow */}
        <div className="metric-card compact-metric-card">
          <div className="metric-card-header">
            <span className="metric-title">Total Inflows</span>
            <div className="metric-icon-wrap metric-icon-income" style={{ width: '34px', height: '34px' }}>
              <ArrowDownLeft size={18} />
            </div>
          </div>
          <div className="metric-value mono-num" style={{ color: 'var(--accent-emerald-light)', fontSize: '1.5rem', marginBottom: '4px' }}>
            {currency}{metrics.totalIncome.toLocaleString()}
          </div>
          <div className="metric-subtext">
            <Sparkles size={12} color="var(--accent-emerald)" />
            <span>{incomeSources.length} stream{incomeSources.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* 3. Total Outflows */}
        <div className="metric-card compact-metric-card">
          <div className="metric-card-header">
            <span className="metric-title">Total Outflows</span>
            <div className="metric-icon-wrap metric-icon-expense" style={{ width: '34px', height: '34px' }}>
              <ArrowUpRight size={18} />
            </div>
          </div>
          <div className="metric-value mono-num" style={{ color: 'var(--accent-rose)', fontSize: '1.5rem', marginBottom: '4px' }}>
            {currency}{metrics.totalExpenses.toLocaleString()}
          </div>
          <div className="metric-subtext">
            <CreditCard size={12} color="var(--accent-cyan)" />
            <span>{currency}{metrics.onlineTotal.toLocaleString()} Online</span>
          </div>
        </div>

        {/* 4. Daily Safe Spend */}
        <div className="metric-card compact-metric-card hero-burn">
          <div className="metric-card-header">
            <span className="metric-title" style={{ color: 'var(--accent-purple)' }}>Daily Safe Spend</span>
            <div className="metric-icon-wrap metric-icon-burn" style={{ width: '34px', height: '34px' }}>
              <Flame size={18} />
            </div>
          </div>
          <div className="metric-value mono-num" style={{ color: 'var(--accent-purple)', fontSize: '1.5rem', marginBottom: '4px' }}>
            {currency}{metrics.safeDailySpend.toLocaleString()}
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>/day</span>
          </div>
          <div className="metric-subtext">
            <Zap size={12} color="var(--accent-amber)" />
            <span>{metrics.daysRemainingInMonth} days left</span>
          </div>
        </div>

        {/* 5. Impulse Leaks Tracker */}
        <div className="metric-card compact-metric-card" style={{ borderColor: metrics.unplannedTotal > 0 ? 'rgba(244, 63, 94, 0.35)' : 'var(--border-subtle)' }}>
          <div className="metric-card-header">
            <span className="metric-title" style={{ color: 'var(--accent-rose)' }}>Impulse Leaks</span>
            <div className="metric-icon-wrap" style={{ width: '34px', height: '34px', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)' }}>
              <AlertOctagon size={18} />
            </div>
          </div>
          <div className="metric-value mono-num" style={{ color: 'var(--accent-rose)', fontSize: '1.5rem', marginBottom: '4px' }}>
            {currency}{metrics.unplannedTotal.toLocaleString()}
          </div>
          <div className="metric-subtext">
            <AlertTriangle size={12} color="var(--accent-rose)" />
            <span>{metrics.totalExpenses > 0 ? ((metrics.unplannedTotal / metrics.totalExpenses) * 100).toFixed(0) : 0}% of all spend</span>
          </div>
        </div>
      </div>
    </div>
  );
};
