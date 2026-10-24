import React, { useState } from 'react';
import { Mail, Lock, User, ShieldCheck, X, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFinance } from '../context/FinanceContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, setAuthUser } = useFinance();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation for registration
    if (mode === 'signup') {
      const cleanUsername = username.trim();
      if (!cleanUsername) {
        setErrorMessage('Please enter your username.');
        setLoading(false);
        return;
      }
      if (password.length < 8) {
        setErrorMessage('Password must be at least 8 characters long.');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please retype to confirm.');
        setLoading(false);
        return;
      }
    } else {
      if (!password) {
        setErrorMessage('Please enter your password.');
        setLoading(false);
        return;
      }
    }

    try {
      if (isSupabaseConfigured) {
        if (mode === 'signup') {
          const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password: password.trim(),
            options: {
              data: {
                username: username.trim()
              }
            }
          });
          if (error) throw error;
          if (data.user) {
            const registeredName = username.trim();
            setAuthUser({
              id: data.user.id,
              email: data.user.email || email.trim(),
              username: registeredName
            });
            setSuccessMessage(`Account created! Welcome, @${registeredName}. Check your email to confirm.`);
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
            setTimeout(() => closeAuthModal(), 2000);
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim()
          });
          if (error) throw error;
          if (data.user) {
            const resolvedUsername = data.user.user_metadata?.username || email.trim().split('@')[0];
            setAuthUser({
              id: data.user.id,
              email: data.user.email || email.trim(),
              username: resolvedUsername
            });
            setSuccessMessage(`Successfully signed in! Welcome back, @${resolvedUsername}.`);
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
            setTimeout(() => closeAuthModal(), 1500);
          }
        }
      } else {
        // Local simulation if keys not yet configured in .env
        setTimeout(() => {
          const localUsername = mode === 'signup' 
            ? username.trim() 
            : email.trim().split('@')[0];

          const mockUser = {
            id: 'usr_' + Date.now(),
            email: email.trim(),
            username: localUsername
          };
          setAuthUser(mockUser);
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          setSuccessMessage(`Authenticated as @${localUsername}! Your private vault is ready.`);
          setTimeout(() => closeAuthModal(), 1200);
        }, 600);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your email address first.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.auth.signInWithOtp({ email: email.trim() });
        if (error) throw error;
        setSuccessMessage('Magic Link sent! Click the link in your email to instantly log in.');
      } else {
        setSuccessMessage(`Simulated Magic Link sent to ${email.trim()}!`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not send Magic Link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px', padding: '28px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--accent-emerald)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
              <ShieldCheck size={13} />
              Row-Level Security (RLS) Protected
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {mode === 'signin' ? 'Sign In to Your Vault' : 'Create Private Vault'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {mode === 'signin' 
                ? 'Sign in to access your personal expenses and sync live across devices.' 
                : 'Create your private account. Only you will ever be able to access your data.'}
            </p>
          </div>
          <button className="modal-close-btn" onClick={closeAuthModal}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-input)', padding: '4px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', border: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMessage(null); setSuccessMessage(null); }}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: mode === 'signin' ? 'var(--bg-surface)' : 'transparent',
              color: mode === 'signin' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(null); setSuccessMessage(null); }}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: mode === 'signup' ? 'var(--bg-surface)' : 'transparent',
              color: mode === 'signup' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Create Account
          </button>
        </div>

        {errorMessage && (
          <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: 'var(--accent-rose)', fontSize: '0.82rem', marginBottom: '16px' }}>
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--accent-emerald)', fontSize: '0.82rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} />
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username Field (Sign up only) */}
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="e.g. nizam"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                placeholder="you@example.com"
                className="form-input"
                style={{ paddingLeft: '38px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              {mode === 'signup' && (
                <span style={{ fontSize: '0.7rem', color: password.length >= 8 ? 'var(--accent-emerald)' : 'var(--text-muted)', fontWeight: 600 }}>
                  {password.length >= 8 ? '✓ Min 8 chars' : 'At least 8 chars'}
                </span>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder={mode === 'signup' ? 'Enter password (min 8 characters)' : '••••••••••••'}
                className="form-input"
                style={{ paddingLeft: '38px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={mode === 'signup' ? 8 : 1}
              />
            </div>
          </div>

          {/* Retype Password Confirmation (Sign up only) */}
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Retype Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  placeholder="Re-enter password to confirm"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '13px', marginTop: '8px', fontSize: '0.95rem' }}
          >
            {loading ? 'Authenticating...' : mode === 'signin' ? 'Sign In to Dashboard' : 'Create My Private Account'}
            {!loading && <ArrowRight size={16} />}
          </button>

          <div style={{ textAlign: 'center', margin: '14px 0 6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            or passwordless sign in:
          </div>

          <button
            type="button"
            onClick={handleMagicLink}
            disabled={loading}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '10px', fontSize: '0.82rem' }}
          >
            <Sparkles size={14} color="var(--accent-cyan)" />
            Send Magic Link to Email
          </button>
        </form>

        <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          🔒 Unauthenticated users can only view demo statistics. Logging in grants write access to your personal cloud vault.
        </div>
      </div>
    </div>
  );
};
