import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Plus, 
  Flame, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  ChevronDown, 
  Check, 
  Sparkles,
  ShieldCheck,
  Lock,
  LogOut
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

interface HeaderProps {
  onOpenSidebar: () => void;
  onScrollToQuickAdd: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSidebar, onScrollToQuickAdd }) => {
  const { 
    metrics, 
    activeTab, 
    selectedMonth, 
    setSelectedMonth, 
    goToPrevMonth, 
    goToNextMonth,
    availableMonths,
    canGoPrev,
    joinMonth,
    authUser,
    openAuthModal,
    signOut
  } = useFinance();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [yearStr, monthStr] = selectedMonth.split('-');
  const selYear = parseInt(yearStr, 10);
  const selMonthIndex = parseInt(monthStr, 10) - 1;

  const dateObj = new Date(selYear, selMonthIndex, 1);
  const formattedMonth = dateObj.toLocaleString('default', { month: 'long', year: 'numeric' });

  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const isCurrentMonth = selectedMonth === currentMonthStr;
  const isFutureMonth = selectedMonth > currentMonthStr;

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Financial Overview';
      case 'expenses': return 'Expense Tracker';
      case 'incomes': return 'Income Streams';
      case 'categories': return 'Dynamic Categories';
      case 'analytics': return 'Burn Rate & Leakage';
      case 'settings': return 'App Settings';
      default: return 'SpendPulse';
    }
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <button 
          className="menu-toggle-btn" 
          onClick={onOpenSidebar}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            {getPageTitle()}
          </h2>
          
          {/* Custom Luxury Month Switcher Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', position: 'relative' }} ref={dropdownRef}>
            {/* Prev Chevron */}
            <button
              onClick={goToPrevMonth}
              disabled={!canGoPrev}
              title={canGoPrev ? "Previous Month" : `Earliest available is your joining month (${joinMonth})`}
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                color: canGoPrev ? 'var(--text-primary)' : 'var(--text-muted)',
                opacity: canGoPrev ? 1 : 0.4,
                cursor: canGoPrev ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-sm)',
                transition: 'all 0.2s ease'
              }}
            >
              <ChevronLeft size={16} />
            </button>

            {/* Custom Month Pill Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                background: 'var(--bg-input)',
                border: isDropdownOpen ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 12px',
                borderRadius: 'var(--radius-sm)',
                transition: 'all 0.2s ease',
                boxShadow: isDropdownOpen ? '0 0 14px rgba(16, 185, 129, 0.2)' : 'none'
              }}
            >
              <Calendar size={14} color="var(--accent-emerald)" />
              <span>{formattedMonth}</span>
              {isCurrentMonth && (
                <span style={{ fontSize: '0.68rem', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', padding: '1px 6px', borderRadius: '4px' }}>
                  Current
                </span>
              )}
              <ChevronDown 
                size={14} 
                style={{ 
                  color: 'var(--text-muted)', 
                  transform: isDropdownOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease'
                }} 
              />
            </button>

            {/* Next Chevron */}
            <button
              onClick={goToNextMonth}
              title="Next Month (Future Planning)"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-sm)',
                transition: 'all 0.2s ease'
              }}
            >
              <ChevronRight size={16} />
            </button>

            {/* Custom Glassmorphic Dropdown Menu */}
            {isDropdownOpen && (
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '8px',
                  width: '280px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-highlight)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.7), 0 0 0 1px var(--border-subtle)',
                  padding: '8px',
                  zIndex: 200,
                  backdropFilter: 'blur(20px)',
                  maxHeight: '340px',
                  overflowY: 'auto'
                }}
              >
                <div style={{ padding: '6px 10px', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                  Select Tracking Month
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {availableMonths.map((m) => {
                    const isSelected = m.value === selectedMonth;
                    return (
                      <button
                        key={m.value}
                        onClick={() => {
                          setSelectedMonth(m.value);
                          setIsDropdownOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: isSelected ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid transparent',
                          background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                          color: isSelected ? '#ffffff' : 'var(--text-primary)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          textAlign: 'left',
                          fontFamily: 'inherit'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '0.86rem', fontWeight: isSelected ? 800 : 600 }}>
                            {m.label}
                          </span>
                          <span style={{ 
                            fontSize: '0.68rem', 
                            color: m.isCurrent 
                              ? 'var(--accent-emerald)' 
                              : m.isJoined 
                              ? 'var(--accent-cyan)' 
                              : 'var(--text-muted)' 
                          }}>
                            {m.badge}
                          </span>
                        </div>

                        {isSelected ? (
                          <Check size={16} color="var(--accent-emerald)" />
                        ) : m.isFuture ? (
                          <Sparkles size={14} color="var(--accent-purple)" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '8px', paddingTop: '8px', paddingLeft: '8px', paddingRight: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  <ShieldCheck size={12} color="var(--accent-emerald)" />
                  <span>Tracking active from join month ({joinMonth})</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="header-right">
        {/* Month Status Badge */}
        {isCurrentMonth ? (
          <div className="salary-pacing-pill" title="Days remaining in current month">
            <Flame size={14} />
            <span>{metrics.daysRemainingInMonth} Days Left</span>
          </div>
        ) : isFutureMonth ? (
          <div 
            className="salary-pacing-pill" 
            style={{ 
              background: 'rgba(6, 182, 212, 0.12)', 
              borderColor: 'rgba(6, 182, 212, 0.3)', 
              color: 'var(--accent-cyan)' 
            }}
            title="Future planning month"
          >
            <Calendar size={14} />
            <span>{formattedMonth}</span>
          </div>
        ) : (
          <div 
            className="salary-pacing-pill" 
            style={{ 
              background: 'rgba(100, 116, 139, 0.12)', 
              borderColor: 'rgba(100, 116, 139, 0.3)', 
              color: 'var(--text-muted)' 
            }}
          >
            <span>Archived Month</span>
          </div>
        )}

        {/* Authentication status */}
        {!authUser ? (
          <button 
            className="btn btn-secondary" 
            onClick={openAuthModal}
            style={{ padding: '8px 12px', fontSize: '0.82rem', gap: '6px' }}
          >
            <Lock size={14} color="var(--accent-emerald)" />
            <span>Sign In</span>
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div 
              title={`Logged in as @${authUser.username || (authUser.email ? authUser.email.split('@')[0] : 'user')} (${authUser.email || ''})`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px 4px 4px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div 
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--accent-emerald), var(--accent-cyan))',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {(authUser.username || authUser.email || 'U').charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                @{authUser.username || (authUser.email ? authUser.email.split('@')[0] : 'user')}
              </span>
            </div>
            <button 
              className="btn btn-secondary" 
              onClick={signOut}
              title="Logout of your account"
              style={{ 
                padding: '6px 12px', 
                fontSize: '0.78rem', 
                fontWeight: 700,
                color: 'var(--accent-rose)', 
                borderColor: 'rgba(244, 63, 94, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer'
              }}
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <button 
            className="btn btn-primary" 
            onClick={onScrollToQuickAdd}
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
          >
            <Plus size={16} />
            <span style={{ display: 'inline' }}>Quick Add</span>
          </button>
        )}
      </div>
    </header>
  );
};
