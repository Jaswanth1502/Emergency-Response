import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldOff, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E2E8F0]/90 via-[#F8FAFC] to-white flex items-center justify-center text-slate-900 p-8">
      <div className="text-center space-y-6 max-w-md bg-white/80 backdrop-blur-2xl p-8 rounded-3xl border border-white/80 shadow-2xl shadow-slate-900/10">
        <div className="mx-auto w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <ShieldOff className="w-10 h-10 text-rose-600" />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase text-slate-900">404</h1>
          <p className="text-sm text-slate-500 mt-2">The requested EOC terminal endpoint was not found. The resource may have been relocated or access restricted.</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-slate-950/20 flex items-center justify-center gap-2 mx-auto cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Return to EOC Dashboard</span>
        </button>
      </div>
    </div>
  );
};
export default NotFound;
