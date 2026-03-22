import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const iconMap = {
  success: <CheckCircleIcon className="text-2xl" />,
  error: <ErrorIcon className="text-2xl" />,
  info: <InfoIcon className="text-2xl" />,
};

const colorMap = {
  success: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/40 text-emerald-300',
  error: 'from-red-500/20 to-red-600/10 border-red-500/40 text-red-300',
  info: 'from-gold-500/20 to-gold-600/10 border-gold-500/40 text-gold-300',
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`flex items-center gap-4 px-6 py-4 rounded-2xl border bg-gradient-to-r backdrop-blur-xl shadow-2xl min-w-[320px] max-w-[480px] ${colorMap[toast.type]}`}
    >
      {iconMap[toast.type]}
      <p className="font-bold text-base flex-1 text-right" dir="rtl">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="opacity-50 hover:opacity-100 transition-opacity">
        <CloseIcon className="text-lg" />
      </button>
    </motion.div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'success', duration = 4000) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 items-center">
        <AnimatePresence>
          {toasts.map(toast => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
