import React from 'react';
import { motion } from 'framer-motion';

export type GlassTint = 'rose' | 'amber' | 'cyan' | 'emerald' | 'indigo' | 'slate' | 'liquid';

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
  liquid: 'liquid-glass text-slate-900',
  rose: 'liquid-glass-rose text-slate-900',
  amber: 'liquid-glass-amber text-slate-900',
  cyan: 'liquid-glass-blue text-slate-900',
  emerald: 'liquid-glass-emerald text-slate-900',
  indigo: 'liquid-glass-blue text-slate-900',
  slate: 'liquid-glass-card text-slate-900',
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
      {title && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/60">
          <div className="flex items-center space-x-3">
            {icon && <div className="text-slate-700 flex-shrink-0">{icon}</div>}
            <div>
              <h3 className="font-extrabold text-slate-900 tracking-tight text-sm uppercase">{title}</h3>
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
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="w-full text-left focus:outline-none block h-full cursor-pointer"
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
