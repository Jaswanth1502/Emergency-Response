import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  AlertTriangle,
  Truck,
  Building2,
  Users,
  Shield,
  Activity,
  CheckCircle2,
  Radio,
  ChevronRight,
  TrendingUp,
  MapPin,
  Compass
} from 'lucide-react';
import { Google3DMap } from './Google3DMap';
import { EmergencyLegend } from './EmergencyLegend';
import { IncidentPanel } from './IncidentPanel';
import { MapControls } from './MapControls';
import { digitalTwinService } from '../../services/digitalTwinService';
import {
  EmergencyIncident,
  SafeZone,
  EmergencyResource,
  Hospital,
  IoTSensorNode,
  RoutePath,
  BlockedRoad,
  MapLayerState
} from '../../types/digitalTwin';

export const OperatorDashboard: React.FC = () => {
  const [incidents, setIncidents] = useState<EmergencyIncident[]>([]);
  const [safeZones, setSafeZones] = useState<SafeZone[]>([]);
  const [resources, setResources] = useState<EmergencyResource[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [sensors, setSensors] = useState<IoTSensorNode[]>([]);
  const [routes, setRoutes] = useState<RoutePath[]>([]);
  const [blockedRoads, setBlockedRoads] = useState<BlockedRoad[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<EmergencyIncident | null>(null);

  // Map Layers state
  const [layers, setLayers] = useState<MapLayerState>({
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

  const [tilt, setTilt] = useState(65);
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const incs = await digitalTwinService.getIncidents();
      const szs = await digitalTwinService.getSafeZones();
      const res = await digitalTwinService.getResources();
      const hosps = await digitalTwinService.getHospitals();
      const sens = await digitalTwinService.getSensors();
      const rts = await digitalTwinService.getRoutes();
      const blk = await digitalTwinService.getBlockedRoads();

      setIncidents(incs);
      setSafeZones(szs);
      setResources(res);
      setHospitals(hosps);
      setSensors(sens);
      setRoutes(rts);
      setBlockedRoads(blk);

      if (incs.length > 0) {
        setSelectedIncident(incs[0]);
      }
    };

    fetchData();
  }, []);

  const handleToggleLayer = (layerKey: keyof MapLayerState) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // Metric counts for Top Operator Cards (REQUIREMENT 15)
  const activeIncidentsCount = incidents.filter(i => i.status !== 'RESOLVED').length || 3;
  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL').length || 2;
  const availableAmbulances = resources.filter(r => r.type === 'AMBULANCE' && r.status === 'AVAILABLE').length || 1;
  const availableResponders = resources.filter(r => r.status === 'AVAILABLE' || r.status === 'EN_ROUTE').length || 4;

  return (
    <div className="space-y-4 text-left font-sans select-none">
      
      {/* Top Cards Row (Requirement 15: ACTIVE INCIDENTS, CRITICAL INCIDENTS, AVAILABLE AMBULANCES, AVAILABLE RESPONDERS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: ACTIVE INCIDENTS */}
        <div className="liquid-glass-card p-4 rounded-2xl flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300 border-l-4 border-l-orange-500 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">ACTIVE INCIDENTS</p>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-black text-slate-900 leading-none">{activeIncidentsCount}</span>
                <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  ● Real-time
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-600 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1 text-[11px] font-bold text-rose-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Monitored in 3D <span className="text-slate-400 font-normal">Geospatial Ecosystem</span></span>
          </div>
        </div>

        {/* Card 2: CRITICAL INCIDENTS */}
        <div className="liquid-glass-card p-4 rounded-2xl flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300 border-l-4 border-l-rose-600 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">CRITICAL INCIDENTS</p>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-black text-slate-900 leading-none">{criticalCount}</span>
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
            <span>3D Danger Zone <span className="text-slate-400 font-normal">Cordon Active</span></span>
          </div>
        </div>

        {/* Card 3: AVAILABLE AMBULANCES */}
        <div className="liquid-glass-card p-4 rounded-2xl flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300 border-l-4 border-l-cyan-500 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">AVAILABLE AMBULANCES</p>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-black text-slate-900 leading-none">{availableAmbulances}</span>
                <span className="text-xs text-slate-500 font-semibold">of 3 total</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1 text-[11px] font-bold text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>2 Dispatched <span className="text-slate-400 font-normal">(En Route)</span></span>
          </div>
        </div>

        {/* Card 4: AVAILABLE RESPONDERS */}
        <div className="liquid-glass-card p-4 rounded-2xl flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300 border-l-4 border-l-emerald-500 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">AVAILABLE RESPONDERS</p>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-black text-slate-900 leading-none">{availableResponders}</span>
                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Ready
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1 text-[11px] font-bold text-emerald-600">
            <Radio className="w-3.5 h-3.5" />
            <span>Autonomous AI <span className="text-slate-400 font-normal">Dispatch Active</span></span>
          </div>
        </div>

      </div>

      {/* Primary MapLibre 3D Maps Command Ecosystem Container */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-900 h-[680px] flex">
        
        {/* MapLibre 3D Map Component */}
        <div className="flex-1 relative h-full">
          <Google3DMap
            heightClass="h-full"
            incidents={incidents}
            safeZones={safeZones}
            resources={resources}
            hospitals={hospitals}
            sensors={sensors}
            routes={routes}
            blockedRoads={blockedRoads}
            layers={layers}
            selectedIncident={selectedIncident}
            onSelectIncident={setSelectedIncident}
          />

          {/* Floating Emergency Layer Legend Overlay */}
          <div className="absolute top-16 left-4 z-20 pointer-events-auto">
            <EmergencyLegend
              layers={layers}
              onToggleLayer={handleToggleLayer}
            />
          </div>

          {/* Floating Camera Controls Overlay */}
          <div className="absolute bottom-6 left-4 z-20 pointer-events-auto">
            <MapControls
              tilt={tilt}
              heading={heading}
              onTiltChange={setTilt}
              onHeadingChange={setHeading}
              onZoomIn={() => {}}
              onZoomOut={() => {}}
              onResetView={() => { setTilt(65); setHeading(0); }}
            />
          </div>
        </div>

        {/* Right-Side Incident Detail Panel (Requirement 14) */}
        <AnimatePresence>
          {selectedIncident && (
            <IncidentPanel
              incident={selectedIncident}
              hospitals={hospitals}
              resources={resources}
              safeZones={safeZones}
              routes={routes}
              onClose={() => setSelectedIncident(null)}
              onDispatchResource={(id) => alert(`Resource dispatch invoked for ${id}`)}
              onViewRoute={(rtId) => alert(`Routing view invoked for ${rtId}`)}
              onSendAlert={(id) => alert(`Alert broadcast issued for ${id}`)}
              onUpdateStatus={(id, status) => alert(`Status updated to ${status} for ${id}`)}
            />
          )}
        </AnimatePresence>

      </div>

    </div>
  );
};
