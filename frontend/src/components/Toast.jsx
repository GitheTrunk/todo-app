import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast-message">
          {toast.type === 'success' && <CheckCircle2 size={16} color="#10b981" />}
          {toast.type === 'error' && <AlertCircle size={16} color="#ef4444" />}
          {toast.type === 'info' && <Info size={16} color="var(--primary)" />}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
