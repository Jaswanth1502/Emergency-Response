import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldOff, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 flex items-center justify-center text-white p-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
          <ShieldOff className="w-10 h-10 text-rose-500" />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase">404</h1>
          <p className="text-sm text-slate-400 mt-2">The requested EOC terminal endpoint was not found. The resource may have been relocated or access restricted.</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 mx-auto cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Return to EOC Dashboard</span>
        </button>
      </div>
    </div>
  );
};
export default NotFound;
