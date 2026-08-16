import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Radio,
  Milestone,
  Building,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Users,
  Clock,
  ArrowRight,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TacticalGisMap } from '../components/map/TacticalGisMap';

export const Evacuation: React.FC = () => {
  const { addNotification } = useApp();
  const [broadcastSent, setBroadcastSent] = useState(false);

  const handleBroadcast = () => {
    setBroadcastSent(true);
    addNotification("CIVILIAN EMERGENCY BROADCAST TRANSMITTED: Dynamic safe corridors active on WEA / EAS channels.", "warning");
  };

  return (
    <div className="space-y-4 text-left font-sans">
      
      {/* Top Banner (Apple Liquid Glassmorphism) */}
      <div className="liquid-glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base lg:text-lg font-extrabold text-slate-900 tracking-tight">
            Dynamic Evacuation Corridors & Shelters
          </h2>
          <p className="text-xs text-slate-500">
            Autonomous hazard avoidance routing and civilian throughput
          </p>
        </div>

        <button
          onClick={handleBroadcast}
          disabled={broadcastSent}
          className="px-5 py-2.5 bg-[#F58220] hover:bg-[#E07010] text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-60"
        >
          <Radio className="w-4 h-4 animate-pulse" />
          <span>{broadcastSent ? 'Broadcast Sent to 28k Civilians' : 'Broadcast Evacuation Order'}</span>
        </button>
      </div>

      {/* 2-Column Main Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        
        {/* Left Column (6 cols): Active Corridors + Relief Hubs */}
        <div className="xl:col-span-6 space-y-4">
          
          {/* Active Corridors & Egress Routes */}
          <div className="liquid-glass-card rounded-2xl p-4 space-y-3">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider border-b border-white/60 pb-2">
              ACTIVE CORRIDORS & EGRESS ROUTES
            </h3>

            <div className="space-y-3">
              
              {/* Route 1: Primary Safe Corridor Alpha */}
              <div className="p-3.5 rounded-xl border border-blue-400/80 liquid-glass-blue space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-white/90 text-blue-700 font-extrabold text-[10px] uppercase border border-blue-200 shadow-2xs">
                    PRIMARY SAFE CORRIDOR
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800">
                    Safety: <span className="text-emerald-600 font-extrabold">96/100</span>
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">
                    Primary Safe Corridor Alpha (Mission North to Moscone Hub)
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    <span className="font-semibold text-slate-700">From:</span> 450 Mission St (Financial District)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">To:</span> Moscone Convention West Resilience Hub (SHELTER-02)
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-white/60 text-[11px] font-mono text-slate-600">
                  <span>Dist: <strong className="text-slate-900">1.2 km</strong></span>
                  <span>ETA: <strong className="text-slate-900">14m</strong></span>
                  <span>Congestion: <strong className="text-emerald-600 font-bold">Low</strong></span>
                </div>
              </div>

              {/* Route 2: Secondary Egress Route Beta */}
              <div className="p-3.5 rounded-xl border border-white/90 bg-white/70 hover:bg-white transition-all space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100/80 text-slate-700 font-extrabold text-[10px] uppercase border border-slate-200">
                    ALTERNATIVE SECONDARY
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800">
                    Safety: <span className="text-amber-600 font-extrabold">84/100</span>
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">
                    Secondary Egress Route Beta (Howard St West to Civic Hub)
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    <span className="font-semibold text-slate-700">From:</span> District 4 Commercial Zone
                  </p>
                  <p className="text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">To:</span> Civic Auditorium Emergency Relief Hub (SHELTER-01)
                  </p>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] font-mono text-slate-600">
                  <span>Dist: <strong className="text-slate-900">2.1 km</strong></span>
                  <span>ETA: <strong className="text-slate-900">26m</strong></span>
                  <span>Congestion: <strong className="text-amber-600 font-bold">Moderate</strong></span>
                </div>
              </div>

              {/* Route 3: First Responder Priority */}
              <div className="p-3.5 rounded-xl border border-white/90 bg-white/70 hover:bg-white transition-all space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 font-extrabold text-[10px] uppercase border border-purple-200">
                    FIRST RESPONDER PRIORITY
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800">
                    Safety: <span className="text-emerald-600 font-extrabold">99/100</span>
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">
                    First Responder Dedicated Priority Lane (1st St to Trauma Base)
                  </h4>
                </div>
              </div>

            </div>
          </div>

          {/* Civic Relief & Evacuation Hubs */}
          <div className="liquid-glass-card rounded-2xl p-4 space-y-3">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
              CIVIC RELIEF & EVACUATION HUBS
            </h3>

            <div className="space-y-3.5">
              
              {/* Hub 1 */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Civic Auditorium Emergency Relief Hub</span>
                  <span className="font-mono font-extrabold text-slate-700">34% full</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '34%' }} />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>850 / 2,500 Occupants</span>
                  <span className="text-emerald-600 font-bold">1650 free</span>
                </div>
              </div>

              {/* Hub 2 */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Moscone Convention West Resilience Hub</span>
                  <span className="font-mono font-extrabold text-slate-700">30% full</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '30%' }} />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>1,200 / 4,000 Occupants</span>
                  <span className="text-emerald-600 font-bold">2800 free</span>
                </div>
              </div>

              {/* Hub 3 */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Kezar Pavilion Evacuation Shelter</span>
                  <span className="font-mono font-extrabold text-slate-700">21% full</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '21%' }} />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>320 / 1,500 Occupants</span>
                  <span className="text-emerald-600 font-bold">1180 free</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column (6 cols): Tactical Evacuation Map */}
        <div className="xl:col-span-6">
          <div className="rounded-2xl overflow-hidden shadow-xs">
            <TacticalGisMap
              viewMode="2D"
              heightClass="h-[620px]"
            />
          </div>
        </div>

      </div>

    </div>
  );
};
export default Evacuation;
