import React, { useEffect } from 'react';
import { LogOut, X } from 'lucide-react';

export const LogoutModal = React.memo(function LogoutModal({
  isOpen,
  onClose,
  onConfirm
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface rounded-card border border-card-border shadow-xl p-6 space-y-5 animate-scaleUp text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-status-danger/10 text-status-danger rounded-xl">
              <LogOut className="w-5 h-5" />
            </div>
            <h2 id="logout-modal-title" className="text-base font-bold text-text-primary tracking-tight">
              Logout
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-canvas rounded-lg transition-colors focus-visible:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <p className="text-xs font-medium text-text-secondary leading-relaxed">
          Are you sure you want to logout from Vytalis Intelligence?
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary bg-canvas hover:bg-card-border/40 border border-card-border transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-xs font-bold text-surface bg-status-danger hover:bg-red-600 border border-transparent shadow-2xs transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-status-danger focus-visible:outline-none"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
});

export default LogoutModal;
