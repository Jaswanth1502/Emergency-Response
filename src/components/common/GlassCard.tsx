import React from 'react';
import { motion } from 'framer-motion';

export type GlassTint = 'rose' | 'amber' | 'cyan' | 'emerald' | 'indigo' | 'slate';

interface GlassCardProps {
  tint?: GlassTint;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const tintClasses: Record<GlassTint, string> = {
  rose: 'glass-panel-rose text-slate-900 border-rose-500/30',
  amber: 'glass-panel-amber text-slate-900 border-amber-500/30',
  cyan: 'glass-panel-cyan text-slate-900 border-cyan-500/30',
  emerald: 'glass-panel-emerald text-slate-900 border-emerald-500/30',
  indigo: 'glass-panel-indigo text-slate-900 border-indigo-500/30',
  slate: 'glass-panel-slate text-slate-900 border-slate-400/30',
};

export const GlassCard: React.FC<GlassCardProps> = ({
  tint = 'slate',
  title,
  subtitle,
  icon,
  actions,
  children,
  className = '',
  onClick
}) => {
  const cardContent = (
    <div className={`p-5 rounded-2xl ${tintClasses[tint]} ${className} h-full flex flex-col transition-all duration-300 relative overflow-hidden`}>
      {/* Decorative top-right soft glow blob */}
      <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full filter blur-2xl opacity-20 pointer-events-none bg-current" />
      
      {title && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/20">
          <div className="flex items-center space-x-3">
            {icon && <div className="text-slate-700 flex-shrink-0">{icon}</div>}
            <div>
              <h3 className="font-semibold text-slate-900 tracking-tight text-sm uppercase">{title}</h3>
              {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center space-x-2">{actions}</div>}
        </div>
      )}
      <div className="flex-1 flex flex-col justify-between">
        {children}
      </div>
    </div>
  );

  if (onClick) {
    return (
      <motion.button
        whileHover={{ scale: 1.015, y: -2 }}
        whileTap={{ scale: 0.985 }}
        onClick={onClick}
        className="w-full text-left focus:outline-none block h-full"
      >
        {cardContent}
      </motion.button>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      {cardContent}
    </motion.div>
  );
};
export default GlassCard;
