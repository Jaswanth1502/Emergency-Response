import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe2, ArrowRight, Zap } from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-between py-12 px-6 lg:px-16 max-w-7xl mx-auto">
      {/* Brand Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500 text-slate-900 font-bold shadow-lg shadow-cyan-500/30">
            <Globe2 className="w-6 h-6 animate-pulse-slow" />
          </div>
          <div className="leading-none text-left">
            <h1 className="font-extrabold text-white text-lg tracking-tight">METRO EOC</h1>
            <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest block">Digital Twin Platform</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2 text-xs uppercase font-extrabold bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all tracking-wider cursor-pointer"
        >
          Access Terminal
        </button>
      </header>

      {/* Main Hero & Stats Section (Centered Format) */}
      <main className="my-16 lg:my-24 flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20 uppercase tracking-widest animate-pulse">
          <Zap className="w-3.5 h-3.5" /> Next-Gen Smart City Core
        </span>

        <h5 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Autonomous Digital Twin <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
            Emergency Operations
          </span>
        </h5>

        <p className="text-sm lg:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Unify predictive hazard simulations, IoT stream sensor arrays, real-time spatial GIS routing, and multi-agency tactical resource coordination into one collaborative glass-morphic EOC.
        </p>

        <div className="pt-4 flex justify-center">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:shadow-cyan-500/10 transition-all flex items-center justify-center space-x-2 group cursor-pointer"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>

        {/* Stats Section */}</main>


      {/* Footer */}
      <footer className="text-center pt-8 border-t border-white/10 text-slate-500 text-xs">
        <p>© 2026 Metropolitan Emergency Operations EOC (Digital Twin Platform). All Rights Reserved.</p>
      </footer>
    </div>
  );
};
export default Landing;
