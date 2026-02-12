'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'loading';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => string;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-hide after 3 seconds unless it's a loading toas
    if (type !== 'loading') {
      setTimeout(() => {
        hideToast(id);
      }, 3000);
    }
    
    return id;
  }, [hideToast]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className="fixed top-4 right-4 z-9999 flex flex-col gap-3 w-full max-w-[320px] pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => hideToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onClose }: { toast: Toast; onClose: () => void }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    loading: <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />,
  };

  const backgrounds = {
    success: 'bg-emerald-50 border-emerald-100',
    error: 'bg-rose-50 border-rose-100',
    info: 'bg-blue-50 border-blue-100',
    loading: 'bg-white border-slate-100',
  };

  return (
    <div className={`
      pointer-events-auto
      flex items-center gap-3 p-4 rounded-2xl border shadow-xl shadow-slate-200/50 
      animate-in slide-in-from-right-full fade-in duration-300
      ${backgrounds[toast.type]}
    `}>
      <div className="shrink-0">
        {icons[toast.type]}
      </div>
      <p className="text-sm font-semibold text-slate-800 flex-1">
        {toast.message}
      </p>
      <button 
        onClick={onClose}
        className="shrink-0 p-1 hover:bg-black/5 rounded-lg transition-colors text-slate-400"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
