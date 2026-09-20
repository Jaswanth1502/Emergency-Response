import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  AlertTriangle,
  Users,
  Truck,
  Building2,
  Bell,
  Sparkles,
  Check,
  X,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Droplets,
  Activity,
  Layers,
  MapPin,
  Radio,
  Cpu,
  Globe,
  Map as MapIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OpenStreetMap } from '../components/map/OpenStreetMap';
import { Google3DMap } from '../components/digitaltwin/Google3DMap';
import { digitalTwinService } from '../services/digitalTwinService';
import {
  EmergencyIncident,
  SafeZone,
  EmergencyResource,
  Hospital,
  IoTSensorNode,
  RoutePath,
  BlockedRoad,
  MapLayerState
} from '../types/digitalTwin';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { incidents: appIncidents, resources: appResources, deployResource, addNotification } = useApp();
  
  const [mapEngine, setMapEngine] = useState<'OSM' | 'GOOGLE_3D'>('GOOGLE_3D');
  const [agentApproved, setAgentApproved] = useState(false);
  const [agentDeclined, setAgentDeclined] = useState(false);

  // Digital Twin state for Google 3D Map
  const [twinIncidents, setTwinIncidents] = useState<EmergencyIncident[]>([]);
  const [safeZones, setSafeZones] = useState<SafeZone[]>([]);
  const [twinResources, setTwinResources] = useState<EmergencyResource[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [sensors, setSensors] = useState<IoTSensorNode[]>([]);
  const [routes, setRoutes] = useState<RoutePath[]>([]);
  const [blockedRoads, setBlockedRoads] = useState<BlockedRoad[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<EmergencyIncident | null>(null);

  const [layers] = useState<MapLayerState>({
    buildings3D: true,
    terrain: true,
    incidents: true,
    dangerZones: true,
    safeZones: true,
    ambulances: true,
    fireRescue: true,
    police: true,
    hospitals: true,
    iotSensors: true,
    evacuationRoutes: true,
    rescueRoutes: true,
    blockedRoads: true
  });

  useEffect(() => {
    const loadTwinData = async () => {
      const incs = await digitalTwinService.getIncidents();
      const szs = await digitalTwinService.getSafeZones();
      const res = await digitalTwinService.getResources();
      const hosps = await digitalTwinService.getHospitals();
      const sens = await digitalTwinService.getSensors();
      const rts = await digitalTwinService.getRoutes();
      const blk = await digitalTwinService.getBlockedRoads();

      setTwinIncidents(incs);
      setSafeZones(szs);
      setTwinResources(res);
      setHospitals(hosps);
      setSensors(sens);
      setRoutes(rts);
      setBlockedRoads(blk);
      if (incs.length > 0) setSelectedIncident(incs[0]);
    };
    loadTwinData();
  }, []);

  const handleApproveAgent = () => {
    setAgentApproved(true);
    deployResource('RES-005', 'INC-2026-0891');
    addNotification("AI DISPATCH AUTHORIZED: Foam Carrier 03 & Burn ICU H03 dispatched to Mission Financial Plaza.", "info");
  };

  const handleDeclineAgent = () => {
    setAgentDeclined(true);
    addNotification("AI RECOMMENDATION DISMISSED by Commander Justin Vance.", "warning");
  };

  return (
    <div className="space-y-4 text-left font-sans select-none">
      
      {/* Top Main Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: ACTIVE INCIDENTS */}
        <div className="liquid-glass-card p-4 rounded-2xl flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300 border-l-4 border-l-orange-500 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">ACTIVE INCIDENTS</p>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-black text-slate-900 leading-none">12</span>
                <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  ● 3 Critical
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-600 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1 text-[11px] font-bold text-rose-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+2 new reported <span className="text-slate-400 font-normal">in last 30m</span></span>
          </div>
        </div>

        {/* Card 2: CRITICAL INCIDENTS */}
        <div className="liquid-glass-card p-4 rounded-2xl flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300 border-l-4 border-l-rose-600 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">CRITICAL INCIDENTS</p>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-black text-slate-900 leading-none">3</span>
                <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Priority 1
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 flex items-center justify-center flex-shrink-0 shadow-xs">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1 text-[11px] font-bold text-amber-600">
            <Activity className="w-3.5 h-3.5" />
            <span>High Risk Threat <span className="text-slate-400 font-normal">Cordon Active</span></span>
          </div>
        </div>

        {/* Card 3: AMBULANCES AVAILABLE */}
        <div className="liquid-glass-card p-4 rounded-2xl flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300 border-l-4 border-l-cyan-500 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">AMBULANCES AVAILABLE</p>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-black text-slate-900 leading-none">8</span>
                <span className="text-xs text-slate-500 font-semibold">of 17 total</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1 text-[11px] font-bold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>9 Units Deployed <span className="text-slate-400 font-normal">(53% Load)</span></span>
          </div>
        </div>

        {/* Card 4: HOSPITAL BEDS */}
        <div className="liquid-glass-card p-4 rounded-2xl flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300 border-l-4 border-l-emerald-500 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">HOSPITAL BEDS</p>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-black text-slate-900 leading-none">146</span>
                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Surge Ready
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1 text-[11px] font-bold text-emerald-600">
            <Check className="w-3.5 h-3.5" />
            <span>4 Hospitals Online <span className="text-slate-400 font-normal">ICU Triage Open</span></span>
          </div>
        </div>

      </div>

      {/* Predictive Resource Dispatch Recommendation Banner */}
      {!agentDeclined && (
        <div className="liquid-glass-blue rounded-2xl p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border border-blue-200 shadow-sm">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-600/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-0.5 text-left">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider">
                  PREDICTIVE RESOURCE DISPATCH AGENT
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/90 text-blue-700 text-[10px] font-extrabold border border-blue-200 shadow-2xs">
                  94% AI Confidence
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                Dispatch Foam Carrier 03 & Pre-alert Burn ICU H03
              </h3>
              <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                Based on 485°C thermal surge and solvent chemical risk in B2, recommend deploying Foam Unit F-04 (ETA 2m) and redirecting ALS Ambulance A-05.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end lg:self-center flex-shrink-0">
            {!agentApproved ? (
              <>
                <button
                  onClick={handleDeclineAgent}
                  className="px-4 py-2 liquid-glass-pill hover:bg-white text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Decline</span>
                </button>
                <button
                  onClick={handleApproveAgent}
                  className="px-5 py-2 bg-[#F58220] hover:bg-[#E07010] text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve Dispatch</span>
                </button>
              </>
            ) : (
              <div className="px-4 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-2xs">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Dispatch Authorized</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Map & Triage Workspace Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        
        {/* Main Map Container */}
        <div className="xl:col-span-8 space-y-3">
          
          {/* Map Engine Mode Selector */}
          <div className="flex items-center justify-between bg-white px-4 py-2 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center space-x-2">
              <MapIcon className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Emergency GIS Map View:
              </span>
            </div>
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setMapEngine('GOOGLE_3D')}
                className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                  mapEngine === 'GOOGLE_3D'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>MAPLIBRE 3D</span>
              </button>
              <button
                onClick={() => setMapEngine('OSM')}
                className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                  mapEngine === 'OSM'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>OPENSTREETMAP STANDARD</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200/80 bg-white">
            {mapEngine === 'GOOGLE_3D' ? (
              <Google3DMap
                heightClass="h-[620px]"
                incidents={twinIncidents}
                safeZones={safeZones}
                resources={twinResources}
                hospitals={hospitals}
                sensors={sensors}
                routes={routes}
                blockedRoads={blockedRoads}
                layers={layers}
                selectedIncident={selectedIncident}
                onSelectIncident={setSelectedIncident}
                onSwitchToOSM={() => setMapEngine('OSM')}
              />
            ) : (
              <OpenStreetMap heightClass="h-[620px]" />
            )}
          </div>
        </div>

        {/* Right Side: Active Incidents Live Triage Console */}
        <div className="xl:col-span-4 liquid-glass-card rounded-2xl p-4 flex flex-col justify-between h-[670px] border border-slate-200/80">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Active Incident Triage</h3>
              <p className="text-[10px] text-slate-400 font-semibold">12 Active • Real-time Threat Prioritization</p>
            </div>
            <button
              onClick={() => navigate('/incidents')}
              className="text-xs font-extrabold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer"
            >
              <span>View All (12)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Incident Cards List */}
          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            
            {/* Incident 1: Fire */}
            <div
              onClick={() => navigate('/incidents/INC-2026-0891')}
              className="p-3.5 rounded-xl border border-rose-300 bg-rose-50/30 hover:bg-rose-50/60 transition-all cursor-pointer space-y-2 shadow-2xs group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Flame className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span className="font-extrabold text-slate-900 text-xs">Rushikonda Commercial Fire</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase">
                  ● Critical
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium line-clamp-2">
                485°C thermal surge in commercial sub-level B2 solvent storage tanks.
              </p>
              <div className="flex items-center justify-between pt-1.5 text-[11px] border-t border-rose-200/60">
                <span className="font-bold text-slate-700">Risk Score: <span className="text-rose-600 font-extrabold">94/100</span></span>
                <span className="text-blue-600 font-extrabold text-xs flex items-center group-hover:translate-x-0.5 transition-transform">
                  Inspect &gt;
                </span>
              </div>
            </div>

            {/* Incident 2: Gas Leak */}
            <div
              onClick={() => navigate('/incidents/INC-2026-0893')}
              className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/30 hover:bg-amber-50/60 transition-all cursor-pointer space-y-2 shadow-2xs group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="font-extrabold text-slate-900 text-xs">Vizag Port Gas Line Rupture</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-black uppercase">
                  ● Critical
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium line-clamp-2">
                Subterranean hydrocarbon gas pipeline fracture. Pressure at 68% LEL.
              </p>
              <div className="flex items-center justify-between pt-1.5 text-[11px] border-t border-amber-200/60">
                <span className="font-bold text-slate-700">Risk Score: <span className="text-amber-600 font-extrabold">91/100</span></span>
                <span className="text-blue-600 font-extrabold text-xs flex items-center group-hover:translate-x-0.5 transition-transform">
                  Inspect &gt;
                </span>
              </div>
            </div>

            {/* Incident 3: Coastal Inundation */}
            <div
              onClick={() => navigate('/incidents/INC-2026-0892')}
              className="p-3.5 rounded-xl border border-blue-300 bg-blue-50/30 hover:bg-blue-50/60 transition-all cursor-pointer space-y-2 shadow-2xs group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <span className="font-extrabold text-slate-900 text-xs">RK Beach Coastal Flood</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase">
                  ▲ High
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium line-clamp-2">
                Storm surge breach along coastal evacuation corridor & drainage basin.
              </p>
              <div className="flex items-center justify-between pt-1.5 text-[11px] border-t border-blue-200/60">
                <span className="font-bold text-slate-700">Risk Score: <span className="text-blue-600 font-extrabold">82/100</span></span>
                <span className="text-blue-600 font-extrabold text-xs flex items-center group-hover:translate-x-0.5 transition-transform">
                  Inspect &gt;
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Summary Bar */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>EOC Command Sync: <span className="text-emerald-600 font-bold">Live</span></span>
            <button
              onClick={() => navigate('/incidents')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Dispatch Command Console
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
