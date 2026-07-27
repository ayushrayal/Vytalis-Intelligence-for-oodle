import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const ToastNotification = React.memo(function ToastNotification({
  toast,
  onClose
}) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg transition-all transform translate-y-0 animate-fadeIn ${isSuccess
          ? 'bg-surface border-green-200 text-slate-800'
          : 'bg-surface border-red-200 text-slate-800'
        }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="w-5 h-5 text-status-success shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-status-danger shrink-0" />
      )}
      <span className="text-xs font-semibold">{toast.message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="p-1 text-text-secondary hover:text-text-primary rounded-lg transition-colors ml-2 focus-visible:outline-none"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
});

export default ToastNotification;
