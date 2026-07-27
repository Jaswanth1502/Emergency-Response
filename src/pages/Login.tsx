import React, { useState } from 'react';
import { useNavigate as useNav } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe2, Lock, Mail, Users, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types/user';

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
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-md rounded-3xl border border-white/20 bg-slate-950/80 backdrop-blur-2xl p-8 shadow-2xl space-y-6 text-left"
      >
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-cyan-500 text-slate-900 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Globe2 className="w-6 h-6 animate-pulse-slow" />
          </div>
          <h2 className="text-xl font-extrabold uppercase tracking-wider text-white">EOC Terminal Sign In</h2>
          <p className="text-xs text-slate-400">Authenticated access for municipal emergency commanders</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">EOC Officer Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Security Passcode</label>
              <span className="text-[9px] text-cyan-400 cursor-not-allowed">Reset Code</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>
          </div>

          {/* Role selector chips */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Simulate Command Role Profile</label>
            <div className="grid grid-cols-3 gap-2">
              {(['ADMIN', 'OPERATOR', 'ANALYST'] as UserRole[]).map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setCurrentRole(role)}
                  className={`py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border transition-all ${
                    currentRole === role
                      ? 'bg-cyan-500 text-slate-900 border-cyan-400 shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
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
            className="w-full py-3.5 mt-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-55 cursor-pointer"
          >
            <span>{loading ? 'Initializing Core Grid...' : 'Establish Secure Uplink'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Footnote */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Federal Auditing Active</span>
          <span className="font-mono">FIPS 140-2</span>
        </div>
      </motion.div>
    </div>
  );
};
export default Login;
