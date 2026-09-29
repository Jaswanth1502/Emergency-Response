import React, { useState } from 'react';
import {
  Radio,
  CheckCircle2,
  Bus,
  Info,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  ShieldCheck,
  Zap,
  Activity,
  ArrowRight,
  MapPin,
  Clock,
  Users,
  X,
  ExternalLink,
  AlertTriangle,
  Navigation,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OpenStreetMap } from '../components/map/OpenStreetMap';

export interface ActionModalData {
  type: 'ALPHA_CORRIDOR' | 'BETA_REROUTE' | 'PRIORITY_LANE' | 'SHUTTLE_DISPATCH';
  title: string;
  subtitle: string;
  targetName: string;
  hubId?: string;
  distKm: string;
  etaStr: string;
  safetyScore: string;
}

export const Evacuation: React.FC = () => {
  const { addNotification } = useApp();
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [corridorAlphaActive, setCorridorAlphaActive] = useState(false);
  const [corridorBetaRerouted, setCorridorBetaRerouted] = useState(false);
  const [priorityLaneReserved, setPriorityLaneReserved] = useState(false);
  const [shuttlesDispatched, setShuttlesDispatched] = useState<Record<string, boolean>>({});

  // Operational Working Details Modal & Inline Accordion State
  const [activeActionModal, setActiveActionModal] = useState<ActionModalData | null>(null);
  const [expandedInfoCard, setExpandedInfoCard] = useState<string | null>(null);

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

  const openActionDetails = (data: ActionModalData) => {
    setActiveActionModal(data);
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
            Autonomous hazard avoidance routing, green-wave signal priority & civilian throughput
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
              <span className="text-[10px] font-mono font-bold text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sensor Feed & Signal Matrix
              </span>
            </div>

            <div className="space-y-3">
              
              {/* Route 1: Primary Safe Corridor Alpha */}
              <div className={`p-3.5 rounded-xl border transition-all space-y-2.5 shadow-xs ${
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
                    Safety Index: <span className="text-emerald-600 font-extrabold">{corridorAlphaActive ? '99/100' : '96/100'}</span>
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

                {/* Technical Working Brief Summary Pill */}
                <div className="bg-white/80 p-2 rounded-lg border border-slate-200/80 text-[11px] text-slate-700 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-blue-600" />
                      Operational Protocol: Green-Wave Traffic Signal Priority
                    </span>
                    <button
                      onClick={() => setExpandedInfoCard(expandedInfoCard === 'alpha' ? null : 'alpha')}
                      className="text-[10px] text-blue-600 hover:text-blue-800 font-extrabold flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{expandedInfoCard === 'alpha' ? 'Hide Working Details' : 'How This Works'}</span>
                      {expandedInfoCard === 'alpha' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {/* Expanded Working Details Drawer */}
                  {expandedInfoCard === 'alpha' && (
                    <div className="pt-2 border-t border-slate-100 text-[10px] space-y-1.5 animate-in fade-in">
                      <p className="text-slate-600 font-medium">
                        <strong className="text-slate-900">1. Signal Preemption (NTCIP 1202):</strong> Locks 18 municipal traffic intersections to continuous Green Wave status for emergency responders and evacuees.
                      </p>
                      <p className="text-slate-600 font-medium">
                        <strong className="text-slate-900">2. Variable Highway Signage (VMS):</strong> Transmits electronic roadside alerts directing non-essential civilian vehicles to turn onto 4th St arterial detour.
                      </p>
                      <p className="text-slate-600 font-medium">
                        <strong className="text-slate-900">3. Throughput Increase:</strong> Accelerates civilian throughput by +42%, lowering total corridor travel time from 14m down to 10m.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/60 text-[11px] font-mono text-slate-600">
                  <span>Dist: <strong className="text-slate-900">1.2 km</strong></span>
                  <span>ETA: <strong className="text-slate-900">{corridorAlphaActive ? '10m' : '14m'}</strong></span>
                  
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => openActionDetails({
                        type: 'ALPHA_CORRIDOR',
                        title: 'Primary Safe Corridor Alpha Protocol',
                        subtitle: 'Locks 18 traffic signals to Green Wave Priority and broadcasts roadside VMS alerts.',
                        targetName: 'Corridor Alpha (Mission St)',
                        distKm: '1.2 km',
                        etaStr: corridorAlphaActive ? '10 mins' : '14 mins',
                        safetyScore: '99/100'
                      })}
                      className="px-2 py-1.5 bg-white/90 hover:bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-bold flex items-center space-x-1 shadow-2xs cursor-pointer"
                      title="Inspect full operational details modal"
                    >
                      <Info className="w-3.5 h-3.5 text-blue-600" />
                      <span className="hidden sm:inline">Details</span>
                    </button>

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
              </div>

              {/* Route 2: Secondary Egress Route Beta */}
              <div className={`p-3.5 rounded-xl border transition-all space-y-2.5 shadow-2xs ${
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
                    Safety Index: <span className={corridorBetaRerouted ? 'text-emerald-600 font-extrabold' : 'text-amber-600 font-extrabold'}>{corridorBetaRerouted ? '92/100' : '84/100'}</span>
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

                {/* Technical Working Brief Summary Pill */}
                <div className="bg-white/80 p-2 rounded-lg border border-slate-200/80 text-[11px] text-slate-700 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="flex items-center gap-1">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
                      Operational Protocol: Dynamic Arterial Traffic Rerouting
                    </span>
                    <button
                      onClick={() => setExpandedInfoCard(expandedInfoCard === 'beta' ? null : 'beta')}
                      className="text-[10px] text-amber-600 hover:text-amber-800 font-extrabold flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{expandedInfoCard === 'beta' ? 'Hide Working Details' : 'How This Works'}</span>
                      {expandedInfoCard === 'beta' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {/* Expanded Working Details Drawer */}
                  {expandedInfoCard === 'beta' && (
                    <div className="pt-2 border-t border-slate-100 text-[10px] space-y-1.5 animate-in fade-in">
                      <p className="text-slate-600 font-medium">
                        <strong className="text-slate-900">1. GPS Navigation Integration:</strong> Pushes live detour vectors directly to Waze, Google Maps, and Apple Maps civilian navigation platforms.
                      </p>
                      <p className="text-slate-600 font-medium">
                        <strong className="text-slate-900">2. Congestion Relief:</strong> Extends green signal duration by +35% on Howard St secondary avenues, preventing gridlock near commercial centers.
                      </p>
                      <p className="text-slate-600 font-medium">
                        <strong className="text-slate-900">3. Egress Efficiency:</strong> Decreases travel time from 26m down to 18m with active traffic diversion.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] font-mono text-slate-600">
                  <span>Dist: <strong className="text-slate-900">2.1 km</strong></span>
                  <span>ETA: <strong className="text-slate-900">{corridorBetaRerouted ? '18m' : '26m'}</strong></span>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => openActionDetails({
                        type: 'BETA_REROUTE',
                        title: 'Secondary Egress Route Beta Protocol',
                        subtitle: 'Diverts civilian traffic via dynamic GPS API vector feeds & extended green phases.',
                        targetName: 'Route Beta (Howard St West)',
                        distKm: '2.1 km',
                        etaStr: corridorBetaRerouted ? '18 mins' : '26 mins',
                        safetyScore: corridorBetaRerouted ? '92/100' : '84/100'
                      })}
                      className="px-2 py-1.5 bg-white/90 hover:bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-bold flex items-center space-x-1 shadow-2xs cursor-pointer"
                      title="Inspect full operational details modal"
                    >
                      <Info className="w-3.5 h-3.5 text-amber-600" />
                      <span className="hidden sm:inline">Details</span>
                    </button>

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
              </div>

              {/* Route 3: First Responder Priority */}
              <div className={`p-3.5 rounded-xl border transition-all space-y-2.5 shadow-2xs ${
                priorityLaneReserved
                  ? 'border-purple-500/80 bg-purple-50/60'
                  : 'border-white/90 bg-white/70 hover:bg-white'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800 font-extrabold text-[10px] uppercase border border-purple-200">
                    {priorityLaneReserved ? 'EXCLUSIVELY RESERVED' : 'FIRST RESPONDER PRIORITY'}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-800">
                    Safety Index: <span className="text-emerald-600 font-extrabold">99/100</span>
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-900 text-xs">
                  First Responder Dedicated Priority Lane (1st St to Trauma Base)
                </h4>

                {/* Technical Working Brief Summary Pill */}
                <div className="bg-white/80 p-2 rounded-lg border border-slate-200/80 text-[11px] text-slate-700 space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                      Operational Protocol: Exclusive Emergency Access & Bollard Clearance
                    </span>
                    <button
                      onClick={() => setExpandedInfoCard(expandedInfoCard === 'priority' ? null : 'priority')}
                      className="text-[10px] text-purple-600 hover:text-purple-800 font-extrabold flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{expandedInfoCard === 'priority' ? 'Hide Working Details' : 'How This Works'}</span>
                      {expandedInfoCard === 'priority' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {/* Expanded Working Details Drawer */}
                  {expandedInfoCard === 'priority' && (
                    <div className="pt-2 border-t border-slate-100 text-[10px] space-y-1.5 animate-in fade-in">
                      <p className="text-slate-600 font-medium">
                        <strong className="text-slate-900">1. Pneumatic Road Bollards:</strong> Lowers physical street barriers at 1st St entry points for authenticated emergency responder RFID transponders.
                      </p>
                      <p className="text-slate-600 font-medium">
                        <strong className="text-slate-900">2. Automated License Enforcement (ALPR):</strong> Scans vehicles entering the lane and issues automated warnings to non-emergency drivers.
                      </p>
                      <p className="text-slate-600 font-medium">
                        <strong className="text-slate-900">3. Rapid Trauma Transit:</strong> Guarantees sub-4 minute transit times for Fire, ALS Ambulances, and USAR units directly to KGH Trauma Center.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-1.5 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => openActionDetails({
                      type: 'PRIORITY_LANE',
                      title: 'First Responder Priority Lane Protocol',
                      subtitle: 'Lowers pneumatic entry bollards and reserves 1st St exclusively for emergency units.',
                      targetName: 'Priority Lane (1st St Corridor)',
                      distKm: '0.8 km',
                      etaStr: '< 4 mins',
                      safetyScore: '99/100'
                    })}
                    className="px-2 py-1.5 bg-white/90 hover:bg-white text-slate-700 border border-slate-200 rounded-lg text-[10px] font-bold flex items-center space-x-1 shadow-2xs cursor-pointer"
                    title="Inspect full operational details modal"
                  >
                    <Info className="w-3.5 h-3.5 text-purple-600" />
                    <span className="hidden sm:inline">Details</span>
                  </button>

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
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                CIVIC RELIEF & EVACUATION HUBS
              </h3>
              <span className="text-[10px] font-mono text-slate-500 font-bold">
                Live Capacity & Transit Dispatch
              </span>
            </div>

            <div className="space-y-4">
              
              {/* Hub 1 */}
              <div className="space-y-1.5 text-xs p-3 bg-white/60 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Civic Auditorium Emergency Relief Hub</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-extrabold text-slate-700">34% full</span>
                    
                    <button
                      onClick={() => openActionDetails({
                        type: 'SHUTTLE_DISPATCH',
                        title: 'Civic Transit Shuttle Dispatch Protocol',
                        subtitle: 'Dispatches 4 Electric Transit Shuttles (160 pax total) for evacuee transport.',
                        targetName: 'Civic Auditorium Relief Hub',
                        hubId: 'HUB-1',
                        distKm: '1.4 km',
                        etaStr: '6 mins',
                        safetyScore: '98/100'
                      })}
                      className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-800 bg-slate-100 rounded border border-slate-200 cursor-pointer"
                      title="Inspect Shuttle Working Details"
                    >
                      <Info className="w-3 h-3" />
                    </button>

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
              <div className="space-y-1.5 text-xs p-3 bg-white/60 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Moscone Convention West Resilience Hub</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-extrabold text-slate-700">30% full</span>
                    
                    <button
                      onClick={() => openActionDetails({
                        type: 'SHUTTLE_DISPATCH',
                        title: 'Civic Transit Shuttle Dispatch Protocol',
                        subtitle: 'Dispatches 4 Electric Transit Shuttles (160 pax total) for evacuee transport.',
                        targetName: 'Moscone Resilience Hub',
                        hubId: 'HUB-2',
                        distKm: '1.1 km',
                        etaStr: '5 mins',
                        safetyScore: '99/100'
                      })}
                      className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-800 bg-slate-100 rounded border border-slate-200 cursor-pointer"
                      title="Inspect Shuttle Working Details"
                    >
                      <Info className="w-3 h-3" />
                    </button>

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
              <div className="space-y-1.5 text-xs p-3 bg-white/60 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Kezar Pavilion Evacuation Shelter</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-extrabold text-slate-700">21% full</span>

                    <button
                      onClick={() => openActionDetails({
                        type: 'SHUTTLE_DISPATCH',
                        title: 'Civic Transit Shuttle Dispatch Protocol',
                        subtitle: 'Dispatches 4 Electric Transit Shuttles (160 pax total) for evacuee transport.',
                        targetName: 'Kezar Pavilion Shelter',
                        hubId: 'HUB-3',
                        distKm: '2.8 km',
                        etaStr: '9 mins',
                        safetyScore: '96/100'
                      })}
                      className="px-1.5 py-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-800 bg-slate-100 rounded border border-slate-200 cursor-pointer"
                      title="Inspect Shuttle Working Details"
                    >
                      <Info className="w-3 h-3" />
                    </button>

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
              heightClass="h-[680px]"
            />
          </div>
        </div>

      </div>

      {/* Interactive Operational Action Working Dossier Modal */}
      {activeActionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl max-w-xl w-full space-y-5 text-left animate-in fade-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                  {activeActionModal.type === 'ALPHA_CORRIDOR' && <Zap className="w-5 h-5" />}
                  {activeActionModal.type === 'BETA_REROUTE' && <SlidersHorizontal className="w-5 h-5" />}
                  {activeActionModal.type === 'PRIORITY_LANE' && <ShieldCheck className="w-5 h-5" />}
                  {activeActionModal.type === 'SHUTTLE_DISPATCH' && <Bus className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider border border-blue-200">
                      OPERATIONAL PROTOCOL DOSSIER
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">
                      {activeActionModal.targetName}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base lg:text-lg tracking-tight mt-0.5">
                    {activeActionModal.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveActionModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Subtitle Summary */}
            <p className="text-xs text-slate-600 font-medium bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              {activeActionModal.subtitle}
            </p>

            {/* Key Telemetry Metrics Grid */}
            <div className="grid grid-cols-4 gap-2 font-mono text-center">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[9px] font-bold text-slate-400 block uppercase">DISTANCE</span>
                <span className="text-xs font-black text-slate-900 block mt-0.5">{activeActionModal.distKm}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[9px] font-bold text-slate-400 block uppercase">TRANSIT ETA</span>
                <span className="text-xs font-black text-blue-700 block mt-0.5">{activeActionModal.etaStr}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[9px] font-bold text-slate-400 block uppercase">SAFETY INDEX</span>
                <span className="text-xs font-black text-emerald-700 block mt-0.5">{activeActionModal.safetyScore}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[9px] font-bold text-slate-400 block uppercase">STATUS</span>
                <span className="text-xs font-black text-purple-700 block mt-0.5">ONLINE</span>
              </div>
            </div>

            {/* Detailed System Working Mechanics Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>How This Operational Action Works</span>
              </h4>

              <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90 space-y-3 text-xs">
                {activeActionModal.type === 'ALPHA_CORRIDOR' && (
                  <>
                    <div className="flex items-start space-x-2.5">
                      <div className="p-1 rounded-lg bg-blue-100 text-blue-700 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 block">1. NTCIP 1202 Traffic Signal Preemption:</span>
                        <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                          Locks 18 municipal signal controllers along Mission St to Green Wave status for fast emergency responder transit.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2.5">
                      <div className="p-1 rounded-lg bg-blue-100 text-blue-700 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 block">2. Variable Message Signs (VMS) Roadside Alerts:</span>
                        <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                          Activates 6 electronic roadside highway signs directing civilian vehicles to divert via the 4th St arterial bypass.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2.5">
                      <div className="p-1 rounded-lg bg-blue-100 text-blue-700 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 block">3. Automated Lane Dividers & Throughput Optimization:</span>
                        <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                          Illuminates flex-post lane delineators to separate emergency corridors from civilian traffic, increasing throughput by +42%.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {activeActionModal.type === 'BETA_REROUTE' && (
                  <>
                    <div className="flex items-start space-x-2.5">
                      <div className="p-1 rounded-lg bg-amber-100 text-amber-800 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 block">1. GPS Navigation Platform Vector Push:</span>
                        <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                          Transmits real-time dynamic detour vectors straight to Waze, Google Maps, and Apple Maps civilian navigation feeds.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2.5">
                      <div className="p-1 rounded-lg bg-amber-100 text-amber-800 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 block">2. Extended Secondary Green Signals (+35%):</span>
                        <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                          Extends green signal phase timing on Howard St West to rapidly drain bottleneck queues around District 4 commercial sectors.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2.5">
                      <div className="p-1 rounded-lg bg-amber-100 text-amber-800 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 block">3. Evacuation Egress Acceleration:</span>
                        <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                          Reduces population egress travel time from 26 minutes down to 18 minutes.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {activeActionModal.type === 'PRIORITY_LANE' && (
                  <>
                    <div className="flex items-start space-x-2.5">
                      <div className="p-1 rounded-lg bg-purple-100 text-purple-800 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 block">1. Pneumatic Roadway Entry Bollards:</span>
                        <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                          Lowers physical street barriers at 1st St entry points for authenticated emergency vehicles equipped with RFID transponders.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2.5">
                      <div className="p-1 rounded-lg bg-purple-100 text-purple-800 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 block">2. Automated License Plate Recognition (ALPR):</span>
                        <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                          Scans lane entrants in real time and issues automated traffic violation warnings to unauthorized civilian vehicles entering the lane.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {activeActionModal.type === 'SHUTTLE_DISPATCH' && (
                  <>
                    <div className="flex items-start space-x-2.5">
                      <div className="p-1 rounded-lg bg-emerald-100 text-emerald-800 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 block">1. EV Transit Fleet Mobilization:</span>
                        <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                          Dispatches 4 high-capacity Electric Transit Shuttles (40 passengers per vehicle, 160 pax loop) to the designated relief hub.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2.5">
                      <div className="p-1 rounded-lg bg-emerald-100 text-emerald-800 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 block">2. On-Board Paramedic & Oxygen Support:</span>
                        <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                          Each transit shuttle carries certified emergency responders, supplemental O2 tanks, and AED defibrillators for vulnerable evacuees.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Modal Execution Buttons */}
            <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
              <button
                onClick={() => setActiveActionModal(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Close Dossier
              </button>

              <button
                onClick={() => {
                  if (activeActionModal.type === 'ALPHA_CORRIDOR') handleToggleAlpha();
                  if (activeActionModal.type === 'BETA_REROUTE') handleToggleBeta();
                  if (activeActionModal.type === 'PRIORITY_LANE') handleTogglePriorityLane();
                  if (activeActionModal.type === 'SHUTTLE_DISPATCH' && activeActionModal.hubId) {
                    handleDispatchShuttle(activeActionModal.targetName, activeActionModal.hubId);
                  }
                  setActiveActionModal(null);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Execute & Update Operational State</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Evacuation;
