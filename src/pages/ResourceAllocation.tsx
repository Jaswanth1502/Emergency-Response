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
  Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TacticalGisMap } from '../components/map/TacticalGisMap';

export const ResourceAllocation: React.FC = () => {
  const { resources, incidents, deployResource, addNotification } = useApp();
  
  const [reasoningOpen, setReasoningOpen] = useState(true);
  const [agentApproved, setAgentApproved] = useState(false);
  const [agentDeclined, setAgentDeclined] = useState(false);
  const [unitTypeFilter, setUnitTypeFilter] = useState('ALL');
  const [selectedIncidentId, setSelectedIncidentId] = useState('INC-2026-0891');

  const handleApproveDispatch = () => {
    setAgentApproved(true);
    deployResource('RES-FIRE-04', 'INC-2026-0891');
    addNotification("AI RECOMMENDATION APPROVED: Super Pumper Foam Carrier 03 dispatched to 450 Mission Financial Plaza.", "info");
  };

  const handleDeclineDispatch = () => {
    setAgentDeclined(true);
    addNotification("AI RECOMMENDATION DECLINED by Cmdr. Justin Vance.", "warning");
  };

  const filteredUnits = resources.filter(res => {
    if (unitTypeFilter === 'ALL') return true;
    if (unitTypeFilter === 'FIRE') return res.id.includes('FIRE');
    if (unitTypeFilter === 'MEDICAL') return res.id.includes('AMB');
    if (unitTypeFilter === 'RESCUE') return res.id.includes('RSC');
    if (unitTypeFilter === 'POLICE') return res.id.includes('POL');
    return true;
  });

  return (
    <div className="space-y-4 text-left font-sans">
      
      {/* Current Task Banner */}
      <div className="liquid-glass-card px-4 py-2.5 rounded-2xl flex items-center space-x-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CURRENT TASK:</span>
        <span className="text-xs font-semibold text-slate-700">
          Calculating optimal heavy foam unit routing for Mission Plaza chemical risk
        </span>
      </div>

      {/* AI Recommendation Card (Apple Liquid Glassmorphism) */}
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
              Based on 485°C thermal surge and hydrocarbon solvent risk in B2, recommend deploying Foam Unit F-04 (ETA 2m) and redirecting ALS Ambulance A-05 from SOMA depot.
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

          {/* Past Approvals Link & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 border-t border-white/60 gap-3">
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span className="font-semibold text-blue-700 hover:underline cursor-pointer">
                View Past Approvals (2)
              </span>
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

        </div>
      )}

      {/* 2-Column Grid: Fleet Matrix + Manual Dispatch Destination */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        
        {/* Left: Emergency Fleet Matrix (7 cols) */}
        <div className="xl:col-span-7 space-y-3">
          
          <div className="flex items-center justify-between liquid-glass-card p-3 rounded-2xl">
            <div>
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Emergency Fleet Matrix
              </h3>
              <p className="text-[11px] text-slate-400">Live GPS telemetry & dynamic unit assignment</p>
            </div>

            <select
              value={unitTypeFilter}
              onChange={e => setUnitTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-white/80 border border-white/90 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="ALL">All Unit Types</option>
              <option value="FIRE">Fire & HazMat</option>
              <option value="MEDICAL">Ambulances</option>
              <option value="RESCUE">USAR & Rescue</option>
              <option value="POLICE">Police Units</option>
            </select>
          </div>

          {/* Unit Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredUnits.slice(0, 8).map((unit) => {
              const isOnScene = unit.status === 'DEPLOYED' && (unit.etaMinutes === 0 || (unit as any).speed === 0);
              const isEnRoute = unit.status === 'DEPLOYED' && !isOnScene;
              const isAvailable = unit.status === 'AVAILABLE';

              return (
                <div
                  key={unit.id}
                  className="liquid-glass-card p-3.5 rounded-2xl space-y-2 text-left hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{unit.id}</span>
                    {isOnScene ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-200 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> On Scene
                      </span>
                    ) : isEnRoute ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-extrabold border border-amber-200 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> En Route
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Available
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs tracking-tight">{unit.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">📍 {(unit as any).location || 'San Francisco'}</p>
                    <p className="text-[10px] text-slate-400">👤 Crew: {(unit as any).crew || 3} responders</p>
                  </div>

                  <div className="p-2 rounded-xl bg-white/60 border border-white/80 text-[11px] font-semibold text-slate-700 shadow-2xs">
                    <span className="text-slate-400 text-[10px] block">Assigned:</span>
                    <span className="truncate block font-bold text-blue-700">{(unit as any).assignedIncident || 'Standby Ready'}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/60 text-[10px] font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <BatteryCharging className="w-3 h-3 text-emerald-500" />
                      {(unit as any).fuel || unit.capacityPercent || 88}%
                    </span>
                    <span>ETA: {(unit as any).etaMinutes || 0}m</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right: Manual Dispatch Destination Target & Map (5 cols) */}
        <div className="xl:col-span-5 space-y-3">
          
          <div className="liquid-glass-card p-3.5 rounded-2xl space-y-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
              MANUAL DISPATCH DESTINATION TARGET
            </span>
            <select
              value={selectedIncidentId}
              onChange={e => setSelectedIncidentId(e.target.value)}
              className="w-full px-3 py-2 bg-white/80 border border-white/90 rounded-xl text-xs font-bold text-slate-900 focus:outline-none cursor-pointer shadow-2xs"
            >
              {incidents.map(i => (
                <option key={i.id} value={i.id}>
                  {i.id} • {i.type} - {i.title}
                </option>
              ))}
            </select>
          </div>

          {/* Tactical Map */}
          <div className="rounded-2xl overflow-hidden shadow-xs">
            <TacticalGisMap
              viewMode="2D"
              heightClass="h-[520px]"
            />
          </div>

        </div>

      </div>

    </div>
  );
};
export default ResourceAllocation;
