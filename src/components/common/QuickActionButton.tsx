import React from 'react';
import { motion } from 'framer-motion';
import { GlassTint } from './GlassCard';

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  tint?: GlassTint;
}

const tintStyles: Record<GlassTint, string> = {
  rose: 'hover:bg-rose-500/15 border-rose-500/30 text-rose-700 bg-rose-500/5',
  amber: 'hover:bg-amber-500/15 border-amber-500/30 text-amber-700 bg-amber-500/5',
  cyan: 'hover:bg-cyan-500/15 border-cyan-500/30 text-cyan-700 bg-cyan-500/5',
  emerald: 'hover:bg-emerald-500/15 border-emerald-500/30 text-emerald-700 bg-emerald-500/5',
  indigo: 'hover:bg-indigo-500/15 border-indigo-500/30 text-indigo-700 bg-indigo-500/5',
  slate: 'hover:bg-slate-500/15 border-slate-500/30 text-slate-700 bg-slate-500/5',
};

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon,
  label,
  onClick,
  tint = 'slate'
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex items-center space-x-3 p-3.5 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer w-full text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500/20 shadow-sm ${tintStyles[tint]}`}
    >
      <div className="p-2 rounded-lg bg-white/80 border border-white/50 shadow-sm flex-shrink-0">
        {icon}
      </div>
      <span className="truncate leading-tight">{label}</span>
    </motion.button>
  );
};
export default QuickActionButton;
