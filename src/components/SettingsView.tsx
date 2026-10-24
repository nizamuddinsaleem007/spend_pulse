import React from 'react';
import {
  Smartphone,
  DollarSign,
  Sun,
  Moon
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const SettingsView: React.FC = () => {
  const {
    currency,
    setCurrency,
    theme,
    toggleTheme
  } = useFinance();

  const currencies = [
    { symbol: '₹', name: 'Indian Rupee (INR)' },
    { symbol: '$', name: 'US Dollar (USD)' },
    { symbol: '€', name: 'Euro (EUR)' },
    { symbol: '£', name: 'British Pound (GBP)' },
    { symbol: 'د.إ', name: 'UAE Dirham (AED)' },
    { symbol: '﷼', name: 'Saudi Riyal (SAR)' },
    { symbol: 'C$', name: 'Canadian Dollar (CAD)' },
    { symbol: 'A$', name: 'Australian Dollar (AUD)' }
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>Settings & Data</h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
          Manage your currency, theme, backups, and install the app onto your phone.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Account & Security Card */}


        {/* Currency & Appearance */}
        <div className="glass-card">
          <h3 className="chart-title" style={{ marginBottom: '16px' }}>
            <DollarSign size={18} color="var(--accent-emerald)" />
            Currency & Display
          </h3>

          <div className="form-group">
            <label className="form-label">Preferred Currency Symbol</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {currencies.map(c => (
                <button
                  key={c.symbol}
                  type="button"
                  className={`payment-toggle-btn ${currency === c.symbol ? 'active online' : ''}`}
                  onClick={() => setCurrency(c.symbol)}
                  style={{ justifyContent: 'flex-start', padding: '10px 12px' }}
                >
                  <span className="mono-num" style={{ fontWeight: 800, width: '22px' }}>{c.symbol}</span>
                  <span style={{ fontSize: '0.78rem' }}>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Color Theme</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Toggle Dark or Light interface</div>
            </div>
            <button className="btn btn-secondary" onClick={toggleTheme}>
              {theme === 'dark' ? <><Sun size={16} /> Light Mode</> : <><Moon size={16} /> Dark Mode</>}
            </button>
          </div>
        </div>



        {/* Mobile Installation (PWA Guide) */}
        <div className="glass-card" style={{ gridColumn: 'span 2' }}>
          <h3 className="chart-title" style={{ marginBottom: '12px' }}>
            <Smartphone size={18} color="var(--accent-purple)" />
            How to Install this App on your Mobile Phone
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '6px' }}>
                Android (Chrome / Brave / Edge)
              </h4>
              <ol style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '18px', lineHeight: 1.6 }}>
                <li>Open the online website link on your phone's browser.</li>
                <li>Tap the three dots (<strong>⋮</strong>) in the top-right corner.</li>
                <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                <li>The app icon will appear on your phone screen and open fullscreen without browser borders!</li>
              </ol>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '6px' }}>
                iPhone (iOS Safari)
              </h4>
              <ol style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '18px', lineHeight: 1.6 }}>
                <li>Open the website link in <strong>Safari</strong>.</li>
                <li>Tap the <strong>Share</strong> button at the bottom of Safari (square with arrow).</li>
                <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                <li>Tap <strong>Add</strong>. It will look and feel identical to a native iOS app!</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
