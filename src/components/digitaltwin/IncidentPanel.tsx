import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Flame,
  AlertTriangle,
  Users,
  Shield,
  Truck,
  Building2,
  Navigation,
  Bell,
  CheckCircle2,
  Compass,
  Radio,
  Building,
  Info
} from 'lucide-react';
import { EmergencyIncident, Hospital, EmergencyResource, RoutePath, SafeZone } from '../../types/digitalTwin';

interface IncidentPanelProps {
  incident: EmergencyIncident | null;
  hospitals: Hospital[];
  resources: EmergencyResource[];
  safeZones: SafeZone[];
  routes: RoutePath[];
  onClose: () => void;
  onDispatchResource?: (incidentId: string) => void;
  onViewRoute?: (routeId: string) => void;
  onSendAlert?: (incidentId: string) => void;
  onUpdateStatus?: (incidentId: string, status: string) => void;
}

export const IncidentPanel: React.FC<IncidentPanelProps> = ({
  incident,
  hospitals,
  resources,
  safeZones,
  routes,
  onClose,
  onDispatchResource,
  onViewRoute,
  onSendAlert,
  onUpdateStatus
}) => {
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'FLOORPLAN'>('DETAILS');

  if (!incident) return null;

  const recHospital = hospitals.find(h => h.hospitalId === incident.recommendedHospitalId) || hospitals[0];
  const safeZone = safeZones.find(s => s.id === incident.safeZoneId) || safeZones[0];
  const assignedUnits = resources.filter(r => incident.assignedResources.includes(r.resourceId));
  const evacRoute = routes.find(r => r.type === 'EVACUATION') || routes[0];
  const rescueRoute = routes.find(r => r.type === 'RESCUE') || routes[1] || routes[0];

  return (
    <motion.div
      initial={{ x: 350, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 350, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="w-full max-w-sm bg-slate-900/95 backdrop-blur-xl border-l border-white/15 shadow-2xl flex flex-col h-full text-white text-left font-sans select-none z-30"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-950/80 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-rose-600/90 text-white flex items-center justify-center font-bold shadow-md shadow-rose-900/40">
            <Flame className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-rose-400 font-extrabold uppercase tracking-wider block">
              [{incident.incidentId}] • {incident.incidentType.replace('_', ' ')}
            </span>
            <h3 className="font-extrabold text-white text-xs tracking-tight line-clamp-1">
              {incident.title}
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Mode Sub-tabs (Details vs Building Indoor Data) */}
      <div className="flex border-b border-white/10 bg-slate-950/40 px-3 pt-2 flex-shrink-0">
        <button
          onClick={() => setActiveTab('DETAILS')}
          className={`pb-2 px-3 text-[11px] font-extrabold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
            activeTab === 'DETAILS'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Tactical Specs
        </button>
        <button
          onClick={() => setActiveTab('FLOORPLAN')}
          className={`pb-2 px-3 text-[11px] font-extrabold uppercase tracking-wider border-b-2 flex items-center space-x-1 transition-colors cursor-pointer ${
            activeTab === 'FLOORPLAN'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Indoor CAD</span>
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {activeTab === 'FLOORPLAN' ? (
          /* REQUIREMENT 13: Indoor building floorplan fallback notice */
          <div className="space-y-4 py-6 text-center">
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-amber-500/30 space-y-2">
              <Info className="w-8 h-8 text-amber-400 mx-auto animate-pulse" />
              <h4 className="text-xs font-black text-amber-300 uppercase tracking-widest">
                NO FLOORPLAN DATA
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Indoor structural BIM / CAD floorplan data unavailable for this facility. Displaying external geospatial footprint, access corridors, hazard radius & responder sensors.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-white/10 text-left text-xs space-y-1.5 font-mono">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">External Footprint Specs</span>
              <div className="flex justify-between">
                <span className="text-slate-400">FOOTPRINT AREA:</span>
                <span className="text-cyan-400 font-bold">1,850 m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">PRIMARY ACCESS:</span>
                <span className="text-emerald-400 font-bold">North Gate 2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">STAGING ZONE:</span>
                <span className="text-amber-400 font-bold">Open Ground A</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Severity & Status Row */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Severity</span>
                <span className="text-xs font-black text-rose-400 uppercase mt-0.5 block flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500 inline mr-1" />
                  {incident.severity}
                </span>
              </div>
              <div className="bg-slate-800/80 p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Status</span>
                <span className="text-xs font-black text-emerald-400 uppercase mt-0.5 block">
                  ● {incident.status}
                </span>
              </div>
            </div>

            {/* Narrative Description */}
            <div className="bg-slate-950 p-3 rounded-xl border border-white/10 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Threat Narrative</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {incident.description}
              </p>
            </div>

            {/* Danger Radius & People at Risk */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-rose-950/40 p-2.5 rounded-xl border border-rose-500/30">
                <span className="text-[10px] text-rose-300 font-bold uppercase block">Danger Radius</span>
                <span className="text-sm font-black text-rose-400">{incident.dangerRadius} meters</span>
                <span className="text-[9px] text-rose-300/80 block mt-0.5">Automated 3D Cordon</span>
              </div>
              <div className="bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30">
                <span className="text-[10px] text-amber-300 font-bold uppercase block">People At Risk</span>
                <span className="text-sm font-black text-amber-400">{incident.estimatedPeopleAtRisk} persons</span>
                <span className="text-[9px] text-amber-300/80 block mt-0.5">Monitored Sector</span>
              </div>
            </div>

            {/* Location Coordinates */}
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-white/10 text-xs font-mono">
              <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans mb-1">GPS Location</span>
              <div className="flex justify-between text-cyan-400 text-[11px]">
                <span>LAT: {incident.latitude.toFixed(4)}°N</span>
                <span>LNG: {incident.longitude.toFixed(4)}°E</span>
              </div>
            </div>

            {/* Assigned Emergency Resources */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Assigned Units ({assignedUnits.length})</span>
              <div className="space-y-1.5">
                {assignedUnits.map(unit => (
                  <div key={unit.resourceId} className="p-2 bg-slate-800/90 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-3.5 h-3.5 text-cyan-400" />
                      <div>
                        <span className="font-bold text-white block text-[11px]">{unit.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono">{unit.unitCode} • {unit.status}</span>
                      </div>
                    </div>
                    {unit.etaMinutes && (
                      <span className="text-[10px] font-bold text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        ETA {unit.etaMinutes}m
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Hospital */}
            {recHospital && (
              <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-1 text-xs">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">Recommended Hospital</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[11px]">{recHospital.name}</span>
                  <span className="text-[10px] font-bold text-emerald-300 font-mono">{recHospital.availableBeds} Beds Free</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-0.5">
                  <span>ICU Avail: {recHospital.icuAvailable}</span>
                  <span>Trauma: {recHospital.traumaCare ? 'YES' : 'NO'}</span>
                  <span>Burn Unit: {recHospital.burnUnit ? 'YES' : 'NO'}</span>
                </div>
              </div>
            )}

            {/* Evacuation & Rescue Routes */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Routing Strategy</span>
              
              <div className="p-2 bg-amber-950/30 border border-amber-500/30 rounded-xl text-[11px] space-y-0.5">
                <div className="flex items-center justify-between text-amber-300 font-bold">
                  <span className="flex items-center space-x-1">
                    <Navigation className="w-3 h-3 text-amber-400" />
                    <span>Evacuation Route</span>
                  </span>
                  <span>{evacRoute?.distanceKm} km ({evacRoute?.estimatedTimeMins}m)</span>
                </div>
                <p className="text-[10px] text-slate-300 truncate">
                  → {evacRoute?.destinationLabel || safeZone?.name}
                </p>
              </div>

              <div className="p-2 bg-cyan-950/30 border border-cyan-500/30 rounded-xl text-[11px] space-y-0.5">
                <div className="flex items-center justify-between text-cyan-300 font-bold">
                  <span className="flex items-center space-x-1">
                    <Radio className="w-3 h-3 text-cyan-400" />
                    <span>Rescue Dispatch Route</span>
                  </span>
                  <span>{rescueRoute?.distanceKm} km ({rescueRoute?.estimatedTimeMins}m)</span>
                </div>
                <p className="text-[10px] text-slate-300 truncate">
                  → {rescueRoute?.destinationLabel}
                </p>
              </div>
            </div>

            <div className="text-[9px] text-slate-500 font-mono text-right">
              Last Updated: {incident.lastUpdated}
            </div>
          </>
        )}

      </div>

      {/* Action Buttons Toolbar (REQUIREMENT 14) */}
      <div className="p-3 border-t border-white/10 bg-slate-950 flex flex-wrap gap-2 flex-shrink-0">
        <button
          onClick={() => onDispatchResource?.(incident.incidentId)}
          className="flex-1 min-w-[120px] px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center space-x-1"
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Dispatch Resource</span>
        </button>

        <button
          onClick={() => onViewRoute?.(evacRoute?.id || 'ROUTE-EVAC-01')}
          className="flex-1 min-w-[110px] px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center space-x-1"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>View Route</span>
        </button>

        <button
          onClick={() => onSendAlert?.(incident.incidentId)}
          className="flex-1 min-w-[100px] px-3 py-2 bg-rose-600/90 hover:bg-rose-600 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center space-x-1"
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Send Alert</span>
        </button>

        <button
          onClick={() => onUpdateStatus?.(incident.incidentId, incident.status === 'ACTIVE' ? 'CONTAINED' : 'RESOLVED')}
          className="flex-1 min-w-[110px] px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center space-x-1"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Update Status</span>
        </button>
      </div>

    </motion.div>
  );
};
