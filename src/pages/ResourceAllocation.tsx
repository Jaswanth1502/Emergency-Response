import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Truck,
  Flame,
  Shield,
  Activity,
  Navigation,
  Clock,
  BatteryCharging,
  Radio,
  Building2,
  FileCheck,
  History,
  Send,
  MapPin,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OpenStreetMap } from '../components/map/OpenStreetMap';
import { DeployResourceDialog } from '../components/dialogs/DeployResourceDialog';

export const ResourceAllocation: React.FC = () => {
  const { resources, incidents, deployResource, addNotification } = useApp();
  
  const [reasoningOpen, setReasoningOpen] = useState(true);
  const [agentApproved, setAgentApproved] = useState(false);
  const [agentDeclined, setAgentDeclined] = useState(false);
  const [pastApprovalsOpen, setPastApprovalsOpen] = useState(false);

  // Filter Keys State
  const [unitTypeFilter, setUnitTypeFilter] = useState<'ALL' | 'FIRE' | 'MEDICAL' | 'RESCUE' | 'POLICE'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'DEPLOYED'>('ALL');
  const [selectedIncidentId, setSelectedIncidentId] = useState('INC-2026-0891');

  // Dispatch Dialog State
  const [deployDialogOpen, setDeployDialogOpen] = useState(false);
  const [selectedUnitForDeploy, setSelectedUnitForDeploy] = useState<string>('');

  // Selected Unit for Detailed Route View
  const [selectedUnitIdForRoute, setSelectedUnitIdForRoute] = useState<string | null>(null);

  const pastApprovals = [
    { id: 'APP-101', time: '14:25 UTC', title: 'Foam Unit F-01 Dispatched', target: 'INC-2026-0889 • Industrial HazMat', status: 'COMPLETED', officer: 'Cmdr. Vance' },
    { id: 'APP-102', time: '12:10 UTC', title: 'Ambulance A-02 & Drone Fleet Delta', target: 'INC-2026-0885 • Evacuation Corridor', status: 'COMPLETED', officer: 'Capt. Sharma' }
  ];

  const handleApproveDispatch = () => {
    setAgentApproved(true);
    deployResource('RES-FIRE-04', 'INC-2026-0891');
    addNotification("AI RECOMMENDATION APPROVED: Super Pumper Foam Carrier 03 dispatched to 450 Mission Financial Plaza.", "info");
  };

  const handleDeclineDispatch = () => {
    setAgentDeclined(true);
    addNotification("AI RECOMMENDATION DECLINED by Cmdr. Justin Vance.", "warning");
  };

  const handleOpenDeployForUnit = (unitId: string) => {
    setSelectedUnitForDeploy(unitId);
    setDeployDialogOpen(true);
  };

  const handleQuickDispatch = (unitId: string) => {
    deployResource(unitId, selectedIncidentId);
    const targetInc = incidents.find(i => i.id === selectedIncidentId);
    const targetUnit = resources.find(r => r.id === unitId);
    addNotification(`DIRECT DISPATCH: ${targetUnit?.name || unitId} dispatched to ${targetInc?.title || selectedIncidentId}.`, "success");
  };

  // Comprehensive Unit Filtering logic so all Filter Keys work smoothly
  const filteredUnits = resources.filter(res => {
    let matchType = true;
    const resId = (res.id || '').toUpperCase();
    const resType = (res.type || '').toUpperCase();
    const resName = (res.name || '').toUpperCase();

    if (unitTypeFilter === 'FIRE') {
      matchType = resId.includes('FIRE') || resType.includes('FIRE') || resName.includes('FIRE') || resName.includes('PUMPER') || resName.includes('FOAM') || resName.includes('HAZMAT') || resName.includes('TRUCK') || resName.includes('LADDER');
    } else if (unitTypeFilter === 'MEDICAL') {
      matchType = resId.includes('AMB') || resType.includes('AMB') || resType.includes('MED') || resName.includes('AMBULANCE') || resName.includes('TRAUMA') || resName.includes('PARAMEDIC');
    } else if (unitTypeFilter === 'RESCUE') {
      matchType = resId.includes('USAR') || resId.includes('RSC') || resType.includes('USAR') || resType.includes('RESCUE') || resName.includes('SEARCH') || resName.includes('RESCUE') || resName.includes('SHORING') || resName.includes('DRONE');
    } else if (unitTypeFilter === 'POLICE') {
      matchType = resId.includes('POL') || resType.includes('POL') || resName.includes('POLICE') || resName.includes('TRAFFIC') || resName.includes('PATROL') || resName.includes('TACTICAL');
    }

    let matchStatus = true;
    if (statusFilter === 'AVAILABLE') {
      matchStatus = res.status === 'AVAILABLE';
    } else if (statusFilter === 'DEPLOYED') {
      matchStatus = res.status === 'DEPLOYED';
    }

    return matchType && matchStatus;
  });

  const activeTargetIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  return (
    <div className="space-y-4 text-left font-sans select-none">
      
      {/* Current Task Banner */}
      <div className="liquid-glass-card px-4 py-2.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex-shrink-0">CURRENT TASK:</span>
          <span className="text-xs font-semibold text-slate-700">
            Calculating optimal emergency unit dispatch routes for active threat corridors
          </span>
        </div>
        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-extrabold rounded-full flex-shrink-0">
          ● Dynamic EOC Routing Active
        </span>
      </div>

      {/* AI Recommendation Card */}
      {!agentDeclined && (
        <div className="liquid-glass-blue rounded-2xl p-5 space-y-3.5 shadow-xs">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider">
                RECOMMENDATION
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/90 text-blue-700 text-xs font-extrabold border border-blue-200 shadow-2xs">
              94% confidence
            </span>
          </div>

          {/* Title & Description */}
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-900 text-sm lg:text-base tracking-tight">
              Dispatch Foam Carrier 03 & Pre-alert Burn ICU H03
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Based on 485°C thermal surge and hydrocarbon solvent risk in B2, recommend deploying Foam Unit F-04 (ETA 2m) and redirecting ALS Ambulance A-05 from Apollo Health City depot.
            </p>
          </div>

          {/* Explainable Reasoning Chain Dropdown */}
          <div className="pt-1">
            <button
              onClick={() => setReasoningOpen(!reasoningOpen)}
              className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              <span>Explainable Reasoning Chain (3 factors)</span>
              {reasoningOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {reasoningOpen && (
              <div className="mt-2 pl-3 border-l-2 border-blue-300/80 space-y-1 text-xs text-slate-600">
                <p>• Chemical solvent storage detected within 25m radius of 6F fire spread plume.</p>
                <p>• Water stream alone poses Boiling Liquid Expanding Vapor Explosion risk (BLEVE).</p>
                <p>• Traffic light preemption along 1st St corridor reduces arrival latency by 140s.</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 border-t border-white/60 gap-3">
            <div className="flex items-center space-x-3 text-xs text-slate-500">
              <button
                onClick={() => setPastApprovalsOpen(!pastApprovalsOpen)}
                className="font-semibold text-blue-700 hover:underline cursor-pointer flex items-center space-x-1"
              >
                <History className="w-3.5 h-3.5" />
                <span>View Past Approvals ({pastApprovals.length})</span>
              </button>
              <span>•</span>
              <span className="text-[11px]">Updated 12 sec ago</span>
            </div>

            <div className="flex items-center space-x-2">
              {!agentApproved ? (
                <>
                  <button
                    onClick={handleDeclineDispatch}
                    className="px-4 py-2 liquid-glass-pill hover:bg-white text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center space-x-1 cursor-pointer shadow-2xs"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                  <button
                    onClick={handleApproveDispatch}
                    className="px-5 py-2 bg-[#F58220] hover:bg-[#E07010] text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve Dispatch</span>
                  </button>
                </>
              ) : (
                <div className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-2xs">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Dispatched to Mission Plaza (ETA 2m)</span>
                </div>
              )}
            </div>
          </div>

          {/* Past Approvals Modal / Expandable Tray */}
          {pastApprovalsOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3 bg-white/90 rounded-xl border border-blue-200 text-xs space-y-2"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="font-extrabold text-slate-900 text-xs flex items-center space-x-1">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <span>Approved Commander Dispatches</span>
                </span>
                <button
                  onClick={() => setPastApprovalsOpen(false)}
                  className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1.5">
                {pastApprovals.map(item => (
                  <div key={`past-${item.id}`} className="p-2 bg-slate-50 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block text-[11px]">{item.title}</span>
                      <span className="text-[10px] text-slate-500">{item.target} • {item.officer}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-mono text-emerald-600 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {item.status}
                      </span>
                      <span className="text-[9px] text-slate-400 block font-mono mt-0.5">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      )}

      {/* 2-Column Grid: Fleet Matrix + OpenStreetMap in Resources */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        
        {/* Left: Emergency Fleet Matrix with Dispatch Buttons & Route Destination Info (7 cols) */}
        <div className="xl:col-span-7 space-y-3">
          
          <div className="liquid-glass-card p-4 rounded-2xl space-y-3">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  EMERGENCY FLEET MATRIX & DISPATCH CONTROLS
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Live GPS telemetry, unit dispatch actions & destination route tracking
                </p>
              </div>

              {/* Interactive Filter Keys for Unit Types & Statuses */}
              <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                
                {/* Unit Type Filter Keys */}
                <div className="flex items-center space-x-1 bg-white/80 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
                  <Filter className="w-3.5 h-3.5 text-slate-400 ml-1 mr-0.5" />
                  {(['ALL', 'FIRE', 'MEDICAL', 'RESCUE', 'POLICE'] as const).map(typeKey => (
                    <button
                      key={`type-key-${typeKey}`}
                      onClick={() => setUnitTypeFilter(typeKey)}
                      className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                        unitTypeFilter === typeKey
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {typeKey}
                    </button>
                  ))}
                </div>

                {/* Status Filter Keys */}
                <div className="flex items-center space-x-1 bg-white/80 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
                  {(['ALL', 'AVAILABLE', 'DEPLOYED'] as const).map(statusKey => (
                    <button
                      key={`status-key-${statusKey}`}
                      onClick={() => setStatusFilter(statusKey)}
                      className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                        statusFilter === statusKey
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {statusKey === 'ALL' ? 'All Status' : statusKey}
                    </button>
                  ))}
                </div>

              </div>
            </div>
          </div>

          {/* Unit Cards Grid with Interactive Dispatch & Route Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[580px] overflow-y-auto pr-1">
            {filteredUnits.length === 0 ? (
              <div className="col-span-2 p-8 text-center text-slate-400 font-bold text-xs bg-white/40 rounded-2xl border border-white/60">
                No tactical units match the selected filter keys.
              </div>
            ) : (
              filteredUnits.map((unit) => {
                const isOnScene = unit.status === 'DEPLOYED' && (unit.etaMinutes === 0 || (unit as any).speed === 0);
                const isEnRoute = unit.status === 'DEPLOYED' && !isOnScene;
                const isAvailable = unit.status === 'AVAILABLE';

                const destinationIncident =
                  incidents.find(i => unit.assignedIncident?.includes(i.id) || i.id === selectedIncidentId) ||
                  activeTargetIncident;

                return (
                  <div
                    key={`unit-card-${unit.id}`}
                    onClick={() => setSelectedUnitIdForRoute(unit.id)}
                    className={`liquid-glass-card p-4 rounded-2xl space-y-3 text-left transition-all cursor-pointer ${
                      selectedUnitIdForRoute === unit.id ? 'ring-2 ring-blue-500 shadow-md' : 'hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{unit.id}</span>
                      {isOnScene ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-200 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> On Scene
                        </span>
                      ) : isEnRoute ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-extrabold border border-amber-200 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> En Route
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Available
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs tracking-tight">{unit.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        📍 Depot: {(unit as any).location || 'Sector Station Depot'}
                      </p>
                      <p className="text-[10px] text-slate-400">👤 Crew: {(unit as any).crew || 3} responders</p>
                    </div>

                    {/* Dispatch Route Destination Details Box */}
                    <div className="p-2.5 rounded-xl bg-white/70 border border-white/90 space-y-1 text-xs text-slate-800 shadow-2xs">
                      <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        <span>DISPATCH DESTINATION</span>
                        {isEnRoute && <span className="text-amber-600">⚡ GREEN WAVE</span>}
                      </div>

                      {!isAvailable ? (
                        <div>
                          <span className="font-extrabold text-blue-700 block text-xs truncate">
                            📍 [{destinationIncident.id}] {destinationIncident.title}
                          </span>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1">
                            <span>Route: Corridor 4 Arterial</span>
                            <span className="font-bold text-amber-600">ETA: {unit.etaMinutes || 4}m</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="text-slate-500 text-xs italic block">
                            Ready for dispatch to active target
                          </span>
                          <span className="font-bold text-slate-700 text-[10px] block mt-0.5 truncate">
                            Target: [{activeTargetIncident.id}] {activeTargetIncident.title}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Dispatch & Route Action Buttons */}
                    <div className="pt-2 border-t border-white/60 flex items-center justify-between gap-2">
                      {isAvailable ? (
                        <>
                          <button
                            key={`dispatch-btn-${unit.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDeployForUnit(unit.id);
                            }}
                            className="flex-1 py-2 bg-[#F58220] hover:bg-[#E07010] text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1 cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>Dispatch Unit</span>
                          </button>

                          <button
                            key={`quick-btn-${unit.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickDispatch(unit.id);
                            }}
                            className="px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-extrabold text-[10px] uppercase rounded-xl border border-blue-200 cursor-pointer"
                            title="Quick dispatch to selected target incident"
                          >
                            ⚡ Quick
                          </button>
                        </>
                      ) : (
                        <button
                          key={`route-btn-${unit.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUnitIdForRoute(unit.id);
                            addNotification(`ROUTE FOCUS: Tracking dispatch route for ${unit.name} to ${destinationIncident.title}.`, "info");
                          }}
                          className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <Navigation className="w-3 h-3 text-cyan-400" />
                          <span>View Dispatch Route</span>
                        </button>
                      )}
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right: Manual Dispatch Target & Live Dispatch Route Map Overlay (5 cols) */}
        <div className="xl:col-span-5 space-y-3">
          
          {/* Target Emergency Selection */}
          <div className="liquid-glass-card p-3.5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                MANUAL DISPATCH DESTINATION TARGET
              </span>
              <span className="text-[10px] font-bold text-blue-600 font-mono">
                {incidents.length} Active Targets
              </span>
            </div>
            <select
              value={selectedIncidentId}
              onChange={e => setSelectedIncidentId(e.target.value)}
              className="w-full px-3 py-2 bg-white/80 border border-white/90 rounded-xl text-xs font-bold text-slate-900 focus:outline-none cursor-pointer shadow-2xs"
            >
              {incidents.map(i => (
                <option key={`target-inc-${i.id}`} value={i.id}>
                  [{i.id}] • {i.type} - {i.title} ({i.severity})
                </option>
              ))}
            </select>
          </div>

          {/* Dispatch Destination Route Summary Card */}
          <div className="liquid-glass-blue p-4 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 font-extrabold text-slate-900">
                <Navigation className="w-4 h-4 text-blue-600 animate-pulse" />
                <span className="uppercase tracking-wider">ACTIVE DISPATCH ROUTE CORRIDOR</span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold rounded-full">
                Route Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2 bg-white/80 rounded-xl border border-white/90">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">DESTINATION TARGET</span>
                <span className="font-extrabold text-slate-900 block truncate mt-0.5">{activeTargetIncident.title}</span>
                <span className="text-[10px] text-slate-500 block">{activeTargetIncident.locationName}</span>
              </div>

              <div className="p-2 bg-white/80 rounded-xl border border-white/90">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">ROUTE METRICS</span>
                <span className="font-extrabold text-blue-700 block mt-0.5">3.8 km • ETA 3.5 min</span>
                <span className="text-[10px] text-emerald-600 font-bold block">Signals: Green Wave</span>
              </div>
            </div>
          </div>

          {/* OpenStreetMap Tactical GIS View for Resources */}
          <div className="rounded-2xl overflow-hidden shadow-xs border border-slate-200">
            <OpenStreetMap
              heightClass="h-[440px]"
            />
          </div>

        </div>

      </div>

      {/* Tactical Deploy Resource Dialog Modal */}
      <DeployResourceDialog
        isOpen={deployDialogOpen}
        onClose={() => setDeployDialogOpen(false)}
        selectedIncidentId={selectedIncidentId}
        selectedResourceId={selectedUnitForDeploy}
      />

    </div>
  );
};
export default ResourceAllocation;
