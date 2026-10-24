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
  LogOut,
  Sun,
  Moon,
  MoreVertical
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

interface HeaderProps {
  onOpenSidebar: () => void;
  onScrollToQuickAdd?: () => void;
  onOpenQuickAdd?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSidebar, onScrollToQuickAdd, onOpenQuickAdd }) => {
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
    signOut,
    theme,
    toggleTheme,
    openTutorialModal
  } = useFinance();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
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
        <h2 className="desktop-only" style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap' }}>
          {getPageTitle()}
        </h2>
      </div>

      {/* Center: Month Selector & Navigation */}
      <div className="header-center">
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }} ref={dropdownRef}>
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
            <span className="desktop-only">{formattedMonth}</span>
            <span className="mobile-only">{dateObj.toLocaleString('default', { month: 'short', year: '2-digit' })}</span>
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
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: '8px',
                width: '280px',
                maxWidth: 'calc(100vw - 28px)',
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

      <div className="header-right">
        {/* === DESKTOP ACTIONS === */}
        {/* 1. Month Status Badge */}
        {isCurrentMonth ? (
          <div className="salary-pacing-pill desktop-only" title="Days remaining in current month">
            <Flame size={14} />
            <span>{metrics.daysRemainingInMonth} Days Left</span>
          </div>
        ) : isFutureMonth ? (
          <div 
            className="salary-pacing-pill desktop-only" 
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
            className="salary-pacing-pill desktop-only" 
            style={{ 
              background: 'rgba(100, 116, 139, 0.12)', 
              borderColor: 'rgba(100, 116, 139, 0.3)', 
              color: 'var(--text-muted)' 
            }}
          >
            <span>Archived</span>
          </div>
        )}

        {/* 2. Quick Add button (Desktop) */}
        <button 
          className="btn btn-primary desktop-only" 
          onClick={onOpenQuickAdd || onScrollToQuickAdd}
          style={{ padding: '7px 14px', fontSize: '0.82rem' }}
          title="Quick add expense or income"
        >
          <Plus size={16} />
          <span>Quick Add</span>
        </button>

        {/* 3. Theme Toggle Button (Desktop) */}
        <button 
          className="btn btn-secondary desktop-only" 
          onClick={toggleTheme}
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle light or dark mode"
          style={{ 
            width: '36px', 
            height: '36px', 
            padding: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          {theme === 'dark' ? (
            <Sun size={17} color="var(--accent-amber)" />
          ) : (
            <Moon size={17} color="var(--accent-cyan)" />
          )}
        </button>

        {/* 4. Tour & Auth buttons (Desktop) */}
        {!authUser ? (
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              className="btn btn-secondary" 
              onClick={openTutorialModal}
              title="Watch quick app tutorial tour"
              style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '5px' }}
            >
              <Sparkles size={13} color="var(--accent-cyan)" />
              <span>Tour</span>
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={openAuthModal}
              style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '5px' }}
            >
              <Lock size={13} color="var(--accent-emerald)" />
              <span>Sign In</span>
            </button>
          </div>
        ) : (
          <button 
            className="btn btn-secondary desktop-only" 
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
        )}

        {/* === MOBILE THREE-DOT DROPDOWN MENU === */}
        <div className="mobile-only" style={{ position: 'relative' }} ref={mobileMenuRef}>
          <button
            className="menu-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            title="More Options"
            aria-label="Open mobile action menu"
            style={{
              width: '36px',
              height: '36px',
              border: isMobileMenuOpen ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
              boxShadow: isMobileMenuOpen ? '0 0 12px rgba(16, 185, 129, 0.25)' : 'none'
            }}
          >
            <MoreVertical size={18} />
          </button>

          {isMobileMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '230px',
                maxWidth: 'calc(100vw - 24px)',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-highlight)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.65), 0 0 0 1px var(--border-subtle)',
                padding: '10px',
                zIndex: 150,
                backdropFilter: 'blur(20px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {/* 1. Days Remaining in Month */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  color: 'var(--accent-amber)',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                <Flame size={15} />
                <span>{metrics.daysRemainingInMonth} Days Left</span>
              </div>

              {/* 2. Theme Switcher */}
              <button
                type="button"
                onClick={() => {
                  toggleTheme();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {theme === 'dark' ? (
                    <Sun size={15} color="var(--accent-amber)" />
                  ) : (
                    <Moon size={15} color="var(--accent-cyan)" />
                  )}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {theme === 'dark' ? 'Dark' : 'Light'}
                </span>
              </button>

              {/* 3. Quick Add Button */}
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  (onOpenQuickAdd || onScrollToQuickAdd)?.();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  fontSize: '0.82rem',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={16} />
                <span>Quick Add</span>
              </button>

              {/* 4. Logout / Sign In / Tour Button */}
              {!authUser ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      openTutorialModal();
                      setIsMobileMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '0.8rem',
                      justifyContent: 'center',
                      gap: '6px',
                      color: 'var(--accent-cyan)',
                      borderColor: 'rgba(6, 182, 212, 0.3)'
                    }}
                  >
                    <Sparkles size={13} />
                    <span>Quick App Tour</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      openAuthModal();
                      setIsMobileMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '0.8rem',
                      justifyContent: 'center',
                      gap: '6px',
                      color: 'var(--accent-emerald)',
                      borderColor: 'rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <Lock size={13} />
                    <span>Sign In</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '0.8rem',
                    justifyContent: 'center',
                    gap: '6px',
                    color: 'var(--accent-rose)',
                    borderColor: 'rgba(244, 63, 94, 0.3)'
                  }}
                >
                  <LogOut size={13} />
                  <span>Logout</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
