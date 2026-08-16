import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
  bgClass?: string;
  textClass?: string;
  isLight?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  bgClass = "bg-transparent",
  textClass = "text-slate-900",
  isLight = true
}) => {
  return (
    <div className={`min-h-screen ${bgClass} ${textClass} flex flex-col relative overflow-hidden font-sans`}>
      {/* Main Container */}
      <div className="flex-1 flex flex-col z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex-1"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};
export default AuthLayout;
