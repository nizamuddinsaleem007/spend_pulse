import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Flame,
  Calendar,
  ShieldCheck,
  Smartphone,
  Laptop,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  Banknote,
  Lock
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export const TutorialModal: React.FC = () => {
  const {
    isTutorialModalOpen,
    closeTutorialModal,
    openTutorialModal,
    authUser,
    openAuthModal,
    metrics
  } = useFinance();

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-trigger for first-time non-signed in visitors
  useEffect(() => {
    const seen = localStorage.getItem('spendpulse_tutorial_seen');
    if (!seen && !authUser) {
      const timer = setTimeout(() => {
        openTutorialModal();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [authUser]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTutorialModalOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTutorialModalOpen]);

  const handleClose = () => {
    localStorage.setItem('spendpulse_tutorial_seen', 'true');
    closeTutorialModal();
    setCurrentSlide(0);
  };

  const handleNext = () => {
    if (currentSlide < 2) {
      setCurrentSlide(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleSignIn = () => {
    handleClose();
    openAuthModal();
  };

  if (!isTutorialModalOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
    >
      <div
        className="tutorial-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'var(--bg-surface-elevated, #0f172a)',
          border: '1px solid var(--border-highlight, rgba(16, 185, 129, 0.25))',
          borderRadius: '20px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(16, 185, 129, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Top Story Progress Bars */}
        <div style={{ display: 'flex', gap: '6px', padding: '16px 18px 0 18px' }}>
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '99px',
                backgroundColor: idx === currentSlide
                  ? 'var(--accent-emerald)'
                  : idx < currentSlide
                    ? 'rgba(16, 185, 129, 0.5)'
                    : 'rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px 4px 18px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--accent-emerald)',
              background: 'rgba(16, 185, 129, 0.12)',
              padding: '3px 9px',
              borderRadius: 'var(--radius-full)'
            }}>
              <Sparkles size={12} />
              Quick App Tour • Step {currentSlide + 1} of 3
            </span>
          </div>

          {/* Prominent Close Button */}
          <button
            onClick={handleClose}
            aria-label="Close tutorial"
            title="Close tutorial"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.25)';
              e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Slide Content Body */}
        <div style={{ padding: '16px 20px 20px 20px' }}>
          {/* SLIDE 0: Centered Month Switcher & Days Remaining */}
          {currentSlide === 0 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Smart Month Pacing & Timeline Control
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  Switch months directly from the centered header to review past expenses or plan ahead for future budgets.
                </p>
              </div>

              {/* Animated Interactive Mockup */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                marginBottom: '16px',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--accent-emerald)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: '0 0 16px rgba(16, 185, 129, 0.2)'
                  }}>
                    <Calendar size={15} color="var(--accent-emerald)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>October 2026</span>
                    <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', padding: '1px 5px', borderRadius: '4px' }}>
                      Current
                    </span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.85rem' }}>
                    <Flame size={16} />
                    <span>{metrics.daysRemainingInMonth || 7} Days Remaining in Month</span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Paced Daily</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 1: Instant Quick Add & Payment Channels */}
          {currentSlide === 1 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Log Any Expense in Under 2 Seconds
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  Use <strong>+ Quick Add</strong> to record spending anytime. Tag transactions as Cash or Online (UPI, Card, NetBanking).
                </p>
              </div>

              {/* Animated Interactive Mockup */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(6, 182, 212, 0.15)',
                    border: '1px solid var(--accent-cyan)',
                    color: 'var(--accent-cyan)',
                    fontWeight: 700,
                    fontSize: '0.8rem'
                  }}>
                    <CreditCard size={15} />
                    <span>Online / UPI</span>
                  </div>
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.8rem'
                  }}>
                    <Banknote size={15} />
                    <span>Cash</span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Groceries & Supermarket</span>
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--accent-rose)' }}>- ₹1,250</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: Encrypted Cloud Vault & Multi-Device Sync */}
          {currentSlide === 2 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Sync Across Phone & Laptop Instantly
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  You are currently in guest preview mode. Sign in with your email to unlock your private vault.
                </p>
              </div>

              {/* Animated Interactive Mockup */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '12px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 6px auto',
                      color: 'var(--accent-emerald)'
                    }}>
                      <Smartphone size={22} />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Mobile App</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-emerald)', fontSize: '0.72rem', fontWeight: 700 }}>
                      <ShieldCheck size={14} />
                      <span>Cloud Synced</span>
                    </div>
                    <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, var(--accent-emerald), var(--accent-cyan))' }} />
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'rgba(6, 182, 212, 0.15)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 6px auto',
                      color: 'var(--accent-cyan)'
                    }}>
                      <Laptop size={22} />
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Laptop / Web</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginTop: '10px' }}>
            {currentSlide > 0 ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handlePrev}
                style={{ padding: '9px 16px', fontSize: '0.82rem', gap: '6px' }}
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '9px 12px'
                }}
              >
                Skip Tour
              </button>
            )}

            {currentSlide < 2 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
                style={{ padding: '9px 20px', fontSize: '0.84rem', gap: '6px' }}
              >
                <span>Next Step</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                  style={{ padding: '9px 14px', fontSize: '0.82rem' }}
                >
                  Explore Demo
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSignIn}
                  style={{ padding: '9px 18px', fontSize: '0.84rem', gap: '6px' }}
                >
                  <Lock size={14} />
                  <span>Sign In to Sync</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
