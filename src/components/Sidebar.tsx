import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Wallet, 
  Tag, 
  PieChart, 
  Settings, 
  Sun, 
  Moon, 
  X, 
  TrendingUp,
  ShieldCheck,
  LogIn,
  LogOut
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import type { ActiveTab } from '../types/finance';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, theme, toggleTheme, currency, metrics, authUser, openAuthModal, signOut } = useFinance();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'expenses', label: 'Expenses', icon: <Receipt size={20} /> },
    { id: 'incomes', label: 'Income Streams', icon: <Wallet size={20} /> },
    { id: 'categories', label: 'Categories', icon: <Tag size={20} /> },
    { id: 'analytics', label: 'Analytics & Leaks', icon: <PieChart size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
  ];

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    onClose();
  };

  return (
    <>
      <div 
        className={`mobile-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose} 
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="app-logo">
            <TrendingUp size={22} />
          </div>
          <div className="app-title" style={{ flex: 1 }}>
            <h1>SpendPulse</h1>
            <span>Smart Budget PWA</span>
          </div>
          <button 
            className="sidebar-close-btn" 
            onClick={onClose}
            aria-label="Close menu"
            title="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick balance mini-card in sidebar */}
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 182, 212, 0.08))',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px'
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
              Available Balance
            </div>
            <div className="mono-num" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '4px' }}>
              {currency}{metrics.netBalance.toLocaleString()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              <ShieldCheck size={13} color="var(--accent-emerald)" />
              {metrics.burnRatePercentage}% spent this month
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          {authUser ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-emerald), var(--accent-cyan))', color: '#000', fontWeight: 800, fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {(authUser.username || authUser.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    @{authUser.username || (authUser.email ? authUser.email.split('@')[0] : 'user')}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {authUser.email || ''}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => { signOut(); onClose(); }} 
                title="Logout" 
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(244, 63, 94, 0.1)', 
                  border: '1px solid rgba(244, 63, 94, 0.25)', 
                  color: 'var(--accent-rose)', 
                  borderRadius: 'var(--radius-sm)',
                  padding: '5px 8px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer' 
                }}
              >
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-secondary" 
              onClick={() => { openAuthModal(); onClose(); }}
              style={{ width: '100%', padding: '9px 12px', fontSize: '0.8rem', gap: '6px' }}
            >
              <LogIn size={14} color="var(--accent-emerald)" />
              <span>Sign In / Create Vault</span>
            </button>
          )}

          <button 
            className="btn btn-secondary" 
            onClick={onClose}
            style={{ 
              width: '100%', 
              padding: '10px 14px', 
              fontSize: '0.82rem', 
              fontWeight: 700, 
              gap: '8px', 
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)'
            }}
          >
            <X size={15} color="var(--accent-emerald)" />
            <span>Close Sidebar & View Full Dashboard</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Theme</span>
            <button 
              className="btn btn-secondary" 
              onClick={toggleTheme}
              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            >
              {theme === 'dark' ? <><Sun size={14} /> Light</> : <><Moon size={14} /> Dark</>}
            </button>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', paddingTop: '4px' }}>
            SpendPulse • Cloud Sync Ready
          </div>
        </div>
      </aside>
    </>
  );
};
