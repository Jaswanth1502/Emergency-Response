import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OperatorDashboard } from '../components/digitaltwin/OperatorDashboard';
import { AnalystDashboard } from '../components/digitaltwin/AnalystDashboard';
import { Radio, ShieldCheck, BarChart3, Globe } from 'lucide-react';

export const DigitalTwin: React.FC = () => {
  const { currentRole } = useApp();
  const [activeViewMode, setActiveViewMode] = useState<'OPERATOR' | 'ANALYST'>(
    currentRole === 'ANALYST' ? 'ANALYST' : 'OPERATOR'
  );

  return (
    <div className="space-y-4 text-left font-sans select-none">
      
      {/* Top Header & Role Workspace Selector Bar */}
      <div className="liquid-glass-card p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#0B132B] text-cyan-400 flex items-center justify-center shadow-md flex-shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-slate-900 text-sm lg:text-base tracking-tight">
                3D DIGITAL TWIN ECOSYSTEM
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-black border border-cyan-200">
                MAPLIBRE 3D + OPENSTREETMAP
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Autonomous Coordination Agents & Predictive Resource Allocation
            </p>
          </div>
        </div>

        {/* View Switcher: Operator 3D Command Console vs Analyst Intelligence */}
        <div className="flex items-center space-x-2 bg-white/70 p-1 rounded-xl border border-slate-200/80 shadow-2xs backdrop-blur-md">
          <button
            onClick={() => setActiveViewMode('OPERATOR')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeViewMode === 'OPERATOR'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Operator 3D View</span>
          </button>
          <button
            onClick={() => setActiveViewMode('ANALYST')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeViewMode === 'ANALYST'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analyst Intelligence View</span>
          </button>
        </div>

      </div>

      {/* Render Selected View */}
      {activeViewMode === 'OPERATOR' ? (
        <OperatorDashboard />
      ) : (
        <AnalystDashboard />
      )}

    </div>
  );
};

export default DigitalTwin;
