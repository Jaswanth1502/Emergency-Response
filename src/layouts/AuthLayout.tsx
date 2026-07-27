import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
  bgClass?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  bgClass = "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950"
}) => {
  return (
    <div className={`min-h-screen ${bgClass} text-white flex flex-col relative overflow-hidden font-sans`}>
      {/* Decorative cybernetic backdrop glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 filter blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] rounded-full bg-indigo-500/10 filter blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="flex-1 flex flex-col z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};
export default AuthLayout;
