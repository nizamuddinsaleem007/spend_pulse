import React, { useRef, useState } from 'react';
import { 
  Download, 
  Upload, 
  RotateCcw, 
  Smartphone, 
  DollarSign, 
  Sun, 
  Moon, 
  Check, 
  ShieldCheck 
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const SettingsView: React.FC = () => {
  const { 
    currency, 
    setCurrency, 
    theme, 
    toggleTheme, 
    exportDataJSON, 
    importDataJSON, 
    resetToSampleData 
  } = useFinance();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

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

  const handleDownloadBackup = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SpendPulse_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataJSON(content);
        if (success) {
          setImportStatus('Backup restored successfully!');
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          alert('Invalid backup file format.');
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>Settings & Data</h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
          Manage your currency, theme, backups, and install the app onto your phone.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
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

        {/* Backup & Restore */}
        <div className="glass-card">
          <h3 className="chart-title" style={{ marginBottom: '16px' }}>
            <ShieldCheck size={18} color="var(--accent-cyan)" />
            Data Backup & Privacy
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Your financial data is stored 100% locally on your browser/device for ultimate privacy. You can download backups and restore them anytime on any phone or laptop.
          </p>

          {importStatus && (
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--accent-emerald)', padding: '10px', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: '0.82rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={16} color="var(--accent-emerald)" />
              {importStatus}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="btn btn-primary" onClick={handleDownloadBackup}>
              <Download size={16} /> Download JSON Backup
            </button>

            <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
              <Upload size={16} /> Restore from Backup File
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".json"
              onChange={handleFileUpload}
            />

            <button 
              className="btn btn-danger" 
              style={{ marginTop: '12px' }}
              onClick={() => {
                if (window.confirm('Reset all categories, expenses, and incomes to initial demo values?')) {
                  resetToSampleData();
                }
              }}
            >
              <RotateCcw size={16} /> Reset to Demo Data
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
