import React, { useState } from 'react';
import {
  Radio,
  CheckCircle2,
  Bus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OpenStreetMap } from '../components/map/OpenStreetMap';

export const Evacuation: React.FC = () => {
  const { addNotification } = useApp();
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [corridorAlphaActive, setCorridorAlphaActive] = useState(false);
  const [corridorBetaRerouted, setCorridorBetaRerouted] = useState(false);
  const [priorityLaneReserved, setPriorityLaneReserved] = useState(false);
  const [shuttlesDispatched, setShuttlesDispatched] = useState<Record<string, boolean>>({});

  const handleBroadcast = () => {
    setBroadcastSent(true);
    setCorridorAlphaActive(true);
    setCorridorBetaRerouted(true);
    setPriorityLaneReserved(true);
    addNotification("CIVILIAN EMERGENCY BROADCAST TRANSMITTED: Dynamic safe corridors active on WEA / EAS channels.", "warning");
  };

  const handleToggleAlpha = () => {
    const nextState = !corridorAlphaActive;
    setCorridorAlphaActive(nextState);
    if (nextState) {
      addNotification('CORRIDOR ACTIVATED: Primary Safe Corridor Alpha active for traffic routing.', 'success');
    } else {
      addNotification('CORRIDOR DEACTIVATED: Primary Safe Corridor Alpha returned to standby.', 'info');
    }
  };

  const handleToggleBeta = () => {
    const nextState = !corridorBetaRerouted;
    setCorridorBetaRerouted(nextState);
    if (nextState) {
      addNotification('TRAFFIC REROUTED: Secondary Egress Route Beta designated as active bypass.', 'info');
    } else {
      addNotification('TRAFFIC REROUTE STANDBY: Secondary Egress Route Beta returned to standard flow.', 'info');
    }
  };

  const handleTogglePriorityLane = () => {
    const nextState = !priorityLaneReserved;
    setPriorityLaneReserved(nextState);
    if (nextState) {
      addNotification('PRIORITY LANE CLEAR: Emergency vehicles granted exclusive access to 1st St.', 'success');
    } else {
      addNotification('PRIORITY LANE RELEASED: 1st St dedicated access released.', 'info');
    }
  };

  const handleDispatchShuttle = (hubName: string, hubId: string) => {
    setShuttlesDispatched(prev => ({ ...prev, [hubId]: true }));
    addNotification(`EVACUATION SHUTTLE DISPATCHED: 4 Electric Transit Shuttles routed to ${hubName}.`, 'success');
  };

  return (
    <div className="space-y-4 text-left font-sans select-none">
      
      {/* Top Banner (Apple Liquid Glassmorphism) */}
      <div className="liquid-glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base lg:text-lg font-extrabold text-slate-900 tracking-tight">
              Dynamic Evacuation Corridors & Shelters
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 font-extrabold text-[10px] uppercase border border-rose-500/20 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>2 CRITICAL</span>
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Autonomous hazard avoidance routing and civilian throughput
          </p>
        </div>

        <button
          onClick={handleBroadcast}
          disabled={broadcastSent}
          className={`px-5 py-2.5 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer ${
            broadcastSent
              ? 'bg-emerald-600 text-white shadow-emerald-500/20'
              : 'bg-[#F58220] hover:bg-[#E07010] text-white shadow-orange-500/20'
          }`}
        >
          <Radio className={`w-4 h-4 ${broadcastSent ? '' : 'animate-pulse'}`} />
          <span>{broadcastSent ? '✓ Broadcast Active (28k Civilians Reached)' : 'Broadcast Evacuation Order'}</span>
        </button>
      </div>

      {/* 2-Column Main Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        
        {/* Left Column (6 cols): Active Corridors + Relief Hubs */}
        <div className="xl:col-span-6 space-y-4">
          
          {/* Active Corridors & Egress Routes */}
          <div className="liquid-glass-card rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/60 pb-2">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                ACTIVE CORRIDORS & EGRESS ROUTES
              </h3>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                Live Sensor Feed
              </span>
            </div>

            <div className="space-y-3">
              
              {/* Route 1: Primary Safe Corridor Alpha */}
              <div className={`p-3.5 rounded-xl border transition-all space-y-2 shadow-xs ${
                corridorAlphaActive
                  ? 'border-emerald-500/80 bg-emerald-50/60'
                  : 'border-blue-400/80 liquid-glass-blue'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-md font-extrabold text-[10px] uppercase border shadow-2xs ${
                    corridorAlphaActive
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-white/90 text-blue-700 border-blue-200'
                  }`}>
                    {corridorAlphaActive ? 'ACTIVATED & ENFORCED' : 'PRIMARY SAFE CORRIDOR'}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800">
                    Safety: <span className="text-emerald-600 font-extrabold">{corridorAlphaActive ? '99/100' : '96/100'}</span>
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
                  <span>ETA: <strong className="text-slate-900">{corridorAlphaActive ? '10m' : '14m'}</strong></span>
                  <button
                    onClick={handleToggleAlpha}
                    className={`px-3 py-1.5 font-sans text-[10px] font-extrabold rounded-lg cursor-pointer transition-all flex items-center space-x-1 shadow-xs ${
                      corridorAlphaActive
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {corridorAlphaActive && <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{corridorAlphaActive ? 'CORRIDOR ACTIVE' : 'ACTIVATE CORRIDOR'}</span>
                  </button>
                </div>
              </div>

              {/* Route 2: Secondary Egress Route Beta */}
              <div className={`p-3.5 rounded-xl border transition-all space-y-2 shadow-2xs ${
                corridorBetaRerouted
                  ? 'border-emerald-500/80 bg-emerald-50/60'
                  : 'border-white/90 bg-white/70 hover:bg-white'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-md font-extrabold text-[10px] uppercase border ${
                    corridorBetaRerouted
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-slate-100/80 text-slate-700 border-slate-200'
                  }`}>
                    {corridorBetaRerouted ? 'ACTIVE BYPASS' : 'ALTERNATIVE SECONDARY'}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800">
                    Safety: <span className={corridorBetaRerouted ? 'text-emerald-600 font-extrabold' : 'text-amber-600 font-extrabold'}>{corridorBetaRerouted ? '92/100' : '84/100'}</span>
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
                  <span>ETA: <strong className="text-slate-900">{corridorBetaRerouted ? '18m' : '26m'}</strong></span>
                  <button
                    onClick={handleToggleBeta}
                    className={`px-3 py-1.5 font-sans text-[10px] font-extrabold rounded-lg cursor-pointer transition-all flex items-center space-x-1 shadow-xs ${
                      corridorBetaRerouted
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                  >
                    {corridorBetaRerouted && <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{corridorBetaRerouted ? 'TRAFFIC REROUTED' : 'REROUTE TRAFFIC'}</span>
                  </button>
                </div>
              </div>

              {/* Route 3: First Responder Priority */}
              <div className={`p-3.5 rounded-xl border transition-all space-y-2 shadow-2xs ${
                priorityLaneReserved
                  ? 'border-purple-500/80 bg-purple-50/60'
                  : 'border-white/90 bg-white/70 hover:bg-white'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800 font-extrabold text-[10px] uppercase border border-purple-200">
                    {priorityLaneReserved ? 'EXCLUSIVELY RESERVED' : 'FIRST RESPONDER PRIORITY'}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800">
                    Safety: <span className="text-emerald-600 font-extrabold">99/100</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-xs">
                    First Responder Dedicated Priority Lane (1st St to Trauma Base)
                  </h4>
                  <button
                    onClick={handleTogglePriorityLane}
                    className={`px-3 py-1.5 font-sans text-[10px] font-extrabold rounded-lg cursor-pointer transition-all flex items-center space-x-1 shadow-xs ${
                      priorityLaneReserved
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {priorityLaneReserved && <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{priorityLaneReserved ? 'LANE RESERVED' : 'RESERVE LANE'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Civic Relief & Evacuation Hubs */}
          <div className="liquid-glass-card rounded-2xl p-4 space-y-3">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
              CIVIC RELIEF & EVACUATION HUBS
            </h3>

            <div className="space-y-4">
              
              {/* Hub 1 */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Civic Auditorium Emergency Relief Hub</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-extrabold text-slate-700">34% full</span>
                    <button
                      onClick={() => handleDispatchShuttle('Civic Auditorium Hub', 'HUB-1')}
                      className={`px-2 py-0.5 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer border flex items-center space-x-1 ${
                        shuttlesDispatched['HUB-1']
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                          : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Bus className="w-3 h-3" />
                      <span>{shuttlesDispatched['HUB-1'] ? '✓ Shuttle Sent' : 'Dispatch Shuttle'}</span>
                    </button>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '34%' }} />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>850 / 2,500 Occupants</span>
                  <span className="text-emerald-600 font-bold">1,650 capacity free</span>
                </div>
              </div>

              {/* Hub 2 */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Moscone Convention West Resilience Hub</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-extrabold text-slate-700">30% full</span>
                    <button
                      onClick={() => handleDispatchShuttle('Moscone Resilience Hub', 'HUB-2')}
                      className={`px-2 py-0.5 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer border flex items-center space-x-1 ${
                        shuttlesDispatched['HUB-2']
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                          : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Bus className="w-3 h-3" />
                      <span>{shuttlesDispatched['HUB-2'] ? '✓ Shuttle Sent' : 'Dispatch Shuttle'}</span>
                    </button>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '30%' }} />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>1,200 / 4,000 Occupants</span>
                  <span className="text-emerald-600 font-bold">2,800 capacity free</span>
                </div>
              </div>

              {/* Hub 3 */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Kezar Pavilion Evacuation Shelter</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-extrabold text-slate-700">21% full</span>
                    <button
                      onClick={() => handleDispatchShuttle('Kezar Pavilion Shelter', 'HUB-3')}
                      className={`px-2 py-0.5 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer border flex items-center space-x-1 ${
                        shuttlesDispatched['HUB-3']
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                          : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Bus className="w-3 h-3" />
                      <span>{shuttlesDispatched['HUB-3'] ? '✓ Shuttle Sent' : 'Dispatch Shuttle'}</span>
                    </button>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '21%' }} />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>320 / 1,500 Occupants</span>
                  <span className="text-emerald-600 font-bold">1,180 capacity free</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column (6 cols): Tactical Evacuation Map */}
        <div className="xl:col-span-6">
          <div className="rounded-2xl overflow-hidden shadow-xs">
            <OpenStreetMap
              heightClass="h-[620px]"
            />
          </div>
        </div>

      </div>

    </div>
  );
};

export default Evacuation;
