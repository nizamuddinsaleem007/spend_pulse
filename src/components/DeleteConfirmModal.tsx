import React, { useEffect } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export interface DeleteModalData {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  itemDetails?: string;
  confirmLabel?: string;
  onConfirm: () => void;
}

interface DeleteConfirmModalProps {
  data: DeleteModalData;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ data, onClose }) => {
  const { isOpen, title, subtitle, itemDetails, confirmLabel = 'Delete Record', onConfirm } = data;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        zIndex: 1100,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        background: 'rgba(0, 0, 0, 0.75)'
      }}
    >
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '420px',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          boxShadow: '0 20px 50px rgba(244, 63, 94, 0.15), 0 10px 25px rgba(0, 0, 0, 0.5)',
          animation: 'modalSlideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header icon and close */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div 
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(244, 63, 94, 0.2)'
            }}
          >
            <Trash2 size={22} color="var(--accent-rose)" />
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            style={{ padding: '6px' }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Title & Warning */}
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
          {subtitle || 'Are you sure you want to delete this record? This action cannot be undone and will permanently remove it from your personal vault.'}
        </p>

        {/* Highlighted item detail chip */}
        {itemDetails && (
          <div
            style={{
              padding: '10px 14px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '22px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.84rem',
              fontWeight: 700,
              color: 'var(--text-primary)'
            }}
          >
            <AlertTriangle size={16} color="var(--accent-amber)" />
            <span>{itemDetails}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            style={{ flex: 1, padding: '10px 16px', fontSize: '0.88rem', fontWeight: 600 }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              flex: 1,
              padding: '10px 16px',
              fontSize: '0.88rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(244, 63, 94, 0.35)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 18px rgba(244, 63, 94, 0.45)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(244, 63, 94, 0.35)';
            }}
          >
            <Trash2 size={15} />
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
