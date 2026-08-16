import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe2, ArrowRight, Zap } from 'lucide-react';
import { SequenceBackground } from '../components/common/SequenceBackground';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col justify-between py-10 px-6 lg:px-16 max-w-7xl mx-auto overflow-hidden">
      {/* 210-Frame Canvas Sequence Background Animation */}
      <SequenceBackground totalFrames={210} fps={30} />

      {/* Floating Frosted Glass Brand Header */}
      <header className="w-full liquid-glass shadow-xs rounded-2xl px-6 py-3.5 flex items-center justify-between transition-all z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-slate-900 text-white font-bold shadow-md shadow-slate-900/10">
            <Globe2 className="w-5 h-5 animate-pulse-slow" />
          </div>
          <div className="leading-none text-left">
            <h1 className="font-extrabold text-slate-900 text-base tracking-tight">METRO EOC</h1>
            <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest block">Digital Twin Platform</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 text-xs uppercase font-extrabold text-slate-700 hover:text-slate-900 liquid-glass-pill rounded-xl transition-all tracking-wider cursor-pointer shadow-xs"
        >
          Access Terminal
        </button>
      </header>

      {/* Main Hero & Content Section */}
      <main className="my-16 lg:my-24 flex flex-col items-center text-center max-w-3xl mx-auto space-y-6 z-10">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full liquid-glass-pill text-slate-700 text-xs font-bold shadow-xs uppercase tracking-widest">
          <Zap className="w-3.5 h-3.5 text-blue-600 animate-pulse" /> Next-Gen Smart City Core
        </span>

        <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Autonomous Digital Twin <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-[#475569]">
            Emergency Operations
          </span>
        </h2>

        <p className="text-sm lg:text-base text-slate-700 font-medium leading-relaxed max-w-2xl mx-auto">
          Unify predictive hazard simulations, IoT stream sensor arrays, real-time spatial GIS routing, and multi-agency tactical resource coordination into one collaborative glass-morphic EOC.
        </p>

        <div className="pt-4 flex justify-center">
          <button
            onClick={() => navigate('/login')}
            className="px-7 py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-slate-950/15 hover:shadow-slate-950/25 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center space-x-2.5 group cursor-pointer"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center pt-8 border-t border-slate-200/60 text-slate-500 text-xs z-10">
        <p>© 2026 Metropolitan Emergency Operations EOC (Digital Twin Platform). All Rights Reserved.</p>
      </footer>
    </div>
  );
};
export default Landing;
