import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  type = "info"
}) => {
  let accentColor = "bg-blue-600 hover:bg-blue-700 text-white";
  let iconBg = "bg-blue-500/10 text-blue-600";
  
  if (type === 'danger') {
    accentColor = "bg-rose-600 hover:bg-rose-700 text-white";
    iconBg = "bg-rose-500/10 text-rose-600";
  } else if (type === 'warning') {
    accentColor = "bg-amber-500 hover:bg-amber-600 text-white";
    iconBg = "bg-amber-500/10 text-amber-600";
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-slate-950/45 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-sm rounded-2xl glass-panel-neutral border border-white/40 shadow-2xl p-5 z-10 text-center"
          >
            <button onClick={onCancel} className="absolute right-4 top-4 p-1 rounded-lg hover:bg-slate-300/20 text-slate-500 transition-colors">
              <X className="w-4 h-4" />
            </button>

            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${iconBg}`}>
              <HelpCircle className="w-6 h-6 animate-bounce" />
            </div>

            <h3 className="text-md font-bold uppercase tracking-wider text-slate-900 mb-1">{title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-5">{description}</p>

            <div className="flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-xs uppercase font-bold text-slate-600 hover:text-slate-800 transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onCancel();
                }}
                className={`px-5 py-2 text-xs uppercase font-bold rounded-xl shadow-md transition-all duration-150 cursor-pointer ${accentColor}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default ConfirmDialog;
