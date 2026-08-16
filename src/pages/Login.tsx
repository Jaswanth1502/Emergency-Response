import React, { useState } from 'react';
import { useNavigate as useNav } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe2, Lock, Mail, Users, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types/user';
import { SequenceBackground } from '../components/common/SequenceBackground';

export const Login: React.FC = () => {
  const navigate = useNav();
  const { currentRole, setCurrentRole } = useApp();
  
  const [email, setEmail] = useState('operator@smartcity.gov');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate slight network auth overhead
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      {/* 210-Frame Canvas Sequence Background Animation */}
      <SequenceBackground totalFrames={210} fps={30} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-md rounded-3xl liquid-glass p-8 shadow-2xl shadow-slate-900/10 space-y-6 text-left z-10"
      >
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/15">
            <Globe2 className="w-6 h-6 animate-pulse-slow" />
          </div>
          <h2 className="text-xl font-extrabold uppercase tracking-wider text-slate-900">EOC Terminal Sign In</h2>
          <p className="text-xs text-slate-500">Authenticated access for municipal emergency commanders</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">EOC Officer Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white/70 border border-white/90 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20 shadow-2xs"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Security Passcode</label>
              <span className="text-[9px] text-blue-700 font-bold cursor-not-allowed">Reset Code</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white/70 border border-white/90 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20 shadow-2xs"
              />
            </div>
          </div>

          {/* Role selector chips */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Simulate Command Role Profile</label>
            <div className="grid grid-cols-3 gap-2">
              {(['ADMIN', 'OPERATOR', 'ANALYST'] as UserRole[]).map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setCurrentRole(role)}
                  className={`py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border transition-all cursor-pointer ${
                    currentRole === role
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'liquid-glass-pill text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Sign In CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-slate-950/15 hover:shadow-slate-950/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Access Command Grid</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security watermark */}
        <div className="pt-2 text-center border-t border-white/60">
          <p className="text-[10px] text-slate-400 font-mono">
            SECURE PROTOCOL • TLS 1.3 • AES-256 GCM
          </p>
        </div>
      </motion.div>
    </div>
  );
};
export default Login;
