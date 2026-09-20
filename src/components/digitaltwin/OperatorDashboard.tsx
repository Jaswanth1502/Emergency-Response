import React, { useState, useEffect } from 'react';
import {
  Flame,
  AlertTriangle,
  Truck,
  Building2,
  Shield,
  Activity,
  CheckCircle2,
  Radio,
  TrendingUp,
  Cpu,
  Navigation,
  Send,
  Bell,
  RefreshCw
} from 'lucide-react';
import { Google3DMap } from './Google3DMap';
import { EmergencyLegend } from './EmergencyLegend';
import { digitalTwinService } from '../../services/digitalTwinService';
import { useApp } from '../../context/AppContext';
import {
  EmergencyIncident,
  IncidentStatus,
  SafeZone,
  EmergencyResource,
  Hospital,
  IoTSensorNode,
  RoutePath,
  BlockedRoad,
  MapLayerState
} from '../../types/digitalTwin';

export const OperatorDashboard: React.FC = () => {
  const { addNotification, activeModels, retrainModelJob } = useApp();
  const unifiedModel = activeModels.find(m => m.id === 'ML-UNIFIED-10') || activeModels[0];
  const [incidents, setIncidents] = useState<EmergencyIncident[]>([]);
  const [safeZones, setSafeZones] = useState<SafeZone[]>([]);
  const [resources, setResources] = useState<EmergencyResource[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [sensors, setSensors] = useState<IoTSensorNode[]>([]);
  const [routes, setRoutes] = useState<RoutePath[]>([]);
  const [blockedRoads, setBlockedRoads] = useState<BlockedRoad[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<EmergencyIncident | null>(null);

  const [mapMode, setMapMode] = useState<'NORMAL' | 'SATELLITE'>('NORMAL');
  const [activeTab, setActiveTab] = useState<'ALL' | 'INCIDENTS' | 'RESOURCES' | 'HOSPITALS' | 'SENSORS' | 'EVACUATION'>('ALL');

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

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const [activityLogs, setActivityLogs] = useState<Record<string, Array<{ time: string; text: string; type: 'dispatch' | 'alert' | 'status' }>>>({
    'INC-001': [
      { time: '20:55:00', text: 'Thermal surge (485°C) detected on floor 4 by IoT Sensor NODE-002.', type: 'alert' },
      { time: '20:56:30', text: 'Initial 911 dispatch request logged. Perimeter hazard zone marked 150m.', type: 'dispatch' }
    ],
    'INC-002': [
      { time: '20:45:00', text: 'Subterranean gas pressure breach reported (68% LEL). Cordon established.', type: 'alert' }
    ],
    'INC-003': [
      { time: '20:30:00', text: 'River basin inundation level reached 2.4m warning threshold.', type: 'status' }
    ]
  });

  const [activeAlertModal, setActiveAlertModal] = useState<{
    isOpen: boolean;
    incidentId: string;
    title: string;
    area: string;
    severity: string;
    timestamp: string;
  } | null>(null);

  const logIncidentActivity = (incId: string, text: string, type: 'dispatch' | 'alert' | 'status') => {
    const time = new Date().toLocaleTimeString();
    setActivityLogs(prev => ({
      ...prev,
      [incId]: [{ time, text, type }, ...(prev[incId] || [])]
    }));
  };

  const triggerToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    addNotification(message, type);
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleToggleLayer = (layerKey: keyof MapLayerState) => {
    setLayers((prev: MapLayerState) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const handleDispatch = (incidentId: string) => {
    const targetId = incidentId || selectedIncident?.incidentId || selectedIncident?.id || 'INC-001';
    setIncidents(prev => prev.map(inc => (inc.incidentId === targetId || inc.id === targetId) ? { ...inc, status: 'DISPATCHED' } : inc));
    if (selectedIncident && (selectedIncident.incidentId === targetId || selectedIncident.id === targetId)) {
      setSelectedIncident(prev => prev ? { ...prev, status: 'DISPATCHED' } : null);
    }
    logIncidentActivity(targetId, `🚀 TACTICAL DISPATCH: Heavy Foam Engine Fire-01 & ALS Ambulance-02 dispatched.`, 'dispatch');
    triggerToast(`TACTICAL DISPATCH INITIATED: Units dispatched to ${targetId}.`, 'success');
  };

  const handleAlert = (incidentId: string) => {
    const targetId = incidentId || selectedIncident?.incidentId || selectedIncident?.id || 'INC-001';
    const incTitle = selectedIncident?.title || 'Active Emergency Hazard Zone';
    const location = selectedIncident?.locationLabel || 'Visakhapatnam East Sector';
    
    setActiveAlertModal({
      isOpen: true,
      incidentId: targetId,
      title: incTitle,
      area: location,
      severity: selectedIncident?.severity || 'CRITICAL',
      timestamp: new Date().toLocaleTimeString()
    });

    logIncidentActivity(targetId, `⚠️ CIVILIAN BROADCAST: Emergency evacuation warning broadcast issued to ${location}.`, 'alert');
    triggerToast(`EMERGENCY ALERT ISSUED: Evacuation warning broadcast for ${targetId}.`, 'warning');
  };

  const handleUpdateStatus = (incidentId: string, _currentStatus?: string) => {
    const targetId = incidentId || selectedIncident?.incidentId || selectedIncident?.id || 'INC-001';
    const currentStat = selectedIncident?.status || 'ACTIVE';
    const nextStat: IncidentStatus = currentStat === 'ACTIVE' ? 'CONTAINED' : currentStat === 'CONTAINED' ? 'RESOLVED' : 'ACTIVE';
    
    setIncidents(prev => prev.map(inc => (inc.incidentId === targetId || inc.id === targetId) ? { ...inc, status: nextStat } : inc));
    if (selectedIncident && (selectedIncident.incidentId === targetId || selectedIncident.id === targetId)) {
      setSelectedIncident(prev => prev ? { ...prev, status: nextStat } : null);
    }
    logIncidentActivity(targetId, `🔄 STATUS CHANGED: Incident state transitioned from ${currentStat} to ${nextStat}.`, 'status');
    triggerToast(`STATUS UPDATED: Incident ${targetId} set to ${nextStat}.`, 'info');
  };

  const handleAssignResource = (resId: string, name: string) => {
    setResources(prev => prev.map(r => {
      if (r.resourceId === resId || r.id === resId) {
        const nextStatus = r.status === 'AVAILABLE' ? 'EN_ROUTE' : r.status === 'EN_ROUTE' ? 'ON_SCENE' : 'AVAILABLE';
        return { ...r, status: nextStatus as any };
      }
      return r;
    }));
    triggerToast(`RESOURCE STATUS UPDATED: ${name} assigned to emergency sector.`, 'success');
  };

  const [activeTrackModal, setActiveTrackModal] = useState<EmergencyResource | null>(null);

  const handleTrackResource = (resId: string, name: string) => {
    const targetRes = resources.find(r => r.resourceId === resId || r.id === resId) || {
      resourceId: resId,
      id: resId,
      name: name,
      type: 'FIRE_TRUCK' as any,
      latitude: 17.7790,
      longitude: 83.3790,
      status: 'ON_SCENE' as any,
      destination: 'INC-001 Commercial Fire Site',
      etaMinutes: 2,
      unitCode: 'ENG-101'
    };

    setActiveTrackModal(targetRes);
    triggerToast(`GPS TRACKING ACTIVE: Live telemetry stream open for ${name}.`, 'info');
  };

  // Corridor Control State & Modals
  const [safeZoneStats, setSafeZoneStats] = useState({
    status: 'ACTIVE EVACUATION HUB',
    occupancy: 38,
    count: 570,
    maxCapacity: 1500
  });

  const [corridorStats, setCorridorStats] = useState({
    status: 'DETOUR ACTIVE',
    speed: 42,
    isCleared: false
  });

  const [dangerZoneStats, setDangerZoneStats] = useState({
    radius: 150,
    status: 'PERIMETER SEALED & ISOLATED'
  });

  const [activeCorridorModal, setActiveCorridorModal] = useState<'SAFE_ZONE' | 'CORRIDOR' | 'PERIMETER' | null>(null);

  const handleOpenSafeZone = () => {
    setSafeZoneStats(prev => ({
      ...prev,
      occupancy: prev.occupancy === 38 ? 45 : 38,
      count: prev.occupancy === 38 ? 675 : 570,
      status: prev.occupancy === 38 ? 'ACTIVE EVACUATION HUB (SURGE INTAKE)' : 'ACTIVE EVACUATION HUB'
    }));
    setActiveCorridorModal('SAFE_ZONE');
    triggerToast('SAFE ZONE DISPATCH: Assembly Point Alpha activated for civilian intake.', 'success');
  };

  const handleClearCorridor = () => {
    setCorridorStats(prev => ({
      ...prev,
      speed: prev.isCleared ? 42 : 68,
      isCleared: !prev.isCleared,
      status: !prev.isCleared ? 'PRIORITY EXPRESSWAY CLEAR' : 'DETOUR ACTIVE'
    }));
    setActiveCorridorModal('CORRIDOR');
    triggerToast('CORRIDOR CLEARED: Green wave signals activated for emergency vehicles.', 'info');
  };

  const handleUpdatePerimeter = () => {
    setDangerZoneStats(prev => {
      const nextRadius = prev.radius === 150 ? 200 : prev.radius === 200 ? 300 : 150;
      return {
        radius: nextRadius,
        status: `CORDON SEALED & EXPANDED (${nextRadius}m RADIUS)`
      };
    });
    setActiveCorridorModal('PERIMETER');
    triggerToast('CORDON SEALED: Danger perimeter radius updated.', 'warning');
  };

  // Real-Time Dynamic Metrics (Accurately computed from live state)
  const activeIncidentsCount = incidents.filter(i => i.status !== 'RESOLVED').length;
  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED').length;
  const availableAmbulances = resources.filter(r => r.type === 'AMBULANCE' && r.status === 'AVAILABLE').length;
  const availableResponders = resources.filter(r => r.status === 'AVAILABLE').length;

  return (
    <div className="space-y-5 text-left font-sans select-none">

      {/* 1. Top Statistics Row */}
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
            <span>Live Monitoring <span className="text-slate-400 font-normal">Active</span></span>
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
            <span>Danger Cordon <span className="text-slate-400 font-normal">Active</span></span>
          </div>
        </div>

        {/* Card 3: AVAILABLE AMBULANCES */}
        <div className="liquid-glass-card p-4 rounded-2xl flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300 border-l-4 border-l-cyan-500 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">AVAILABLE AMBULANCES</p>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-black text-slate-900 leading-none">{availableAmbulances}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                  availableAmbulances > 0
                    ? 'text-cyan-600 bg-cyan-50 border-cyan-200'
                    : 'text-amber-600 bg-amber-50 border-amber-200'
                }`}>
                  {availableAmbulances > 0 ? 'Ready' : 'All Dispatched'}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1 text-[11px] font-bold text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ALS & Burn Units <span className="text-slate-400 font-normal">Dispatched</span></span>
          </div>
        </div>

        {/* Card 4: AVAILABLE RESPONDERS */}
        <div className="liquid-glass-card p-4 rounded-2xl flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300 border-l-4 border-l-emerald-500 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">RESPONDERS AVAILABLE</p>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-black text-slate-900 leading-none">{availableResponders}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                  availableResponders > 0
                    ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                    : 'text-amber-600 bg-amber-50 border-amber-200'
                }`}>
                  {availableResponders > 0 ? 'Ready' : 'Deployed'}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1 text-[11px] font-bold text-emerald-600">
            <Radio className="w-3.5 h-3.5" />
            <span>Rapid Response <span className="text-slate-400 font-normal">On Standby</span></span>
          </div>
        </div>

      </div>

      {/* 1.5 Real-Time AI Model Training & Data Synchronization Banner */}
      <div className="bg-slate-900 text-white p-3.5 rounded-2xl border border-cyan-500/30 shadow-lg flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center flex-shrink-0 animate-pulse">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-cyan-400 tracking-wide uppercase text-[11px]">
                ⚡ AI CONTINUOUS MULTI-TASK RETRAINING ACTIVE
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                ● Auto-Tuned on Data Change
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Model: <strong className="text-slate-200">{unifiedModel?.name || 'Unified Emergency Multi-Task Transformer'}</strong> • Training precision dynamically synchronized with live telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700/80">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase font-bold">Accuracy</p>
            <p className="text-sm font-black text-emerald-400 font-mono">{unifiedModel?.accuracy || 97.8}%</p>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase font-bold">Epochs Trained</p>
            <p className="text-sm font-black text-cyan-300 font-mono">{unifiedModel?.epochsTrained || 16}</p>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <button
            onClick={() => retrainModelJob(unifiedModel?.id || 'ML-UNIFIED-10', 5)}
            className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center space-x-1 shadow-2xs"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Force Retrain</span>
          </button>
        </div>
      </div>
      <div className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-900 h-[580px] flex">
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
            mapMode={mapMode}
          />

          <div className="absolute top-4 left-4 z-20 pointer-events-auto">
            <EmergencyLegend
              layers={layers}
              onToggleLayer={handleToggleLayer}
              mapMode={mapMode}
              onMapModeChange={setMapMode}
            />
          </div>
        </div>
      </div>

      {/* Navigation Filter Tabs for Operator Operational Panels */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: 'ALL', label: 'All Operational Panels' },
          { id: 'INCIDENTS', label: '🚨 Active Incidents' },
          { id: 'RESOURCES', label: '🚑 Emergency Resources' },
          { id: 'HOSPITALS', label: '🏥 Hospital Capacity' },
          { id: 'SENSORS', label: '📡 Live Sensors' },
          { id: 'EVACUATION', label: '🗺️ Evacuation & Routes' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Section: ACTIVE INCIDENTS (ChatGPT Spec) */}
      {(activeTab === 'ALL' || activeTab === 'INCIDENTS') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Incidents Table */}
          <div className="lg:col-span-7 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-rose-600" />
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  ACTIVE INCIDENTS
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 font-bold">Real-time Emergency Feed</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    <th className="pb-2">ID</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Severity</th>
                    <th className="pb-2">Location</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {incidents.map(inc => {
                    const incId = inc.id || inc.incidentId;
                    const isSelected = (selectedIncident?.id || selectedIncident?.incidentId) === incId;
                    return (
                      <tr
                        key={incId}
                        onClick={() => setSelectedIncident(inc)}
                        className={`hover:bg-slate-50 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/60 font-bold' : ''
                          }`}
                      >
                        <td className="py-2.5 font-mono text-[11px] text-blue-600 font-bold">{incId}</td>
                        <td className="py-2.5 capitalize">{inc.incidentType}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${inc.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-700 border border-rose-300' : 'bg-amber-100 text-amber-700 border border-amber-300'
                            }`}>
                            {inc.severity}
                          </span>
                        </td>
                        <td className="py-2.5 truncate max-w-[130px]">{inc.locationLabel || 'Andhra Pradesh'}</td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
                            {inc.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedIncident(inc); }}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                          >
                            VIEW
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Incident Detail Card (ChatGPT Spec) */}
          <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-md flex flex-col justify-between">
            {selectedIncident ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-rose-600 uppercase tracking-widest">
                      {selectedIncident.id || selectedIncident.incidentId} • {selectedIncident.severity}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      {selectedIncident.title || selectedIncident.incidentType}
                    </h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${
                    selectedIncident.status === 'DISPATCHED'
                      ? 'bg-sky-500 text-white border-sky-600 shadow-xs animate-pulse'
                      : selectedIncident.status === 'CONTAINED'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : selectedIncident.status === 'RESOLVED'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                  }`}>
                    {selectedIncident.status === 'DISPATCHED' && '🚀 '}
                    {selectedIncident.status === 'CONTAINED' && '🟡 '}
                    {selectedIncident.status === 'RESOLVED' && '🟢 '}
                    {selectedIncident.status === 'ACTIVE' && '🔴 '}
                    {selectedIncident.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">PEOPLE AT RISK</span>
                    <span className="font-extrabold text-slate-900 text-sm">{selectedIncident.affectedPeopleCount || selectedIncident.estimatedPeopleAtRisk || 25} people</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">DANGER RADIUS</span>
                    <span className="font-extrabold text-slate-900 text-sm">{selectedIncident.dangerRadius || 150} meters</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">ASSIGNED UNITS</span>
                    <span className="font-bold text-blue-600 text-xs truncate block">
                      {selectedIncident.assignedResources.length > 0 ? selectedIncident.assignedResources.join(', ') : '🚒 Fire-01, 🚑 Amb-02'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">RECOMMENDED HOSPITAL</span>
                    <span className="font-bold text-emerald-600 text-xs truncate block">KGH Vizag Trauma</span>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-3 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-300">
                    <span>EVACUATION CORRIDOR:</span>
                    <span className="text-amber-400">Open Ground Corridor Alpha</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {selectedIncident.description || 'Thermal hazard surge reported. Evacuation cordon active.'}
                  </p>
                </div>

                {/* Live Tactical Action History Feed */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <Activity className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                      Live Incident Audit Log
                    </span>
                    <span className="font-mono text-slate-400 font-bold">
                      {(activityLogs[selectedIncident.id || selectedIncident.incidentId] || []).length} events
                    </span>
                  </div>
                  <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1 font-sans">
                    {(activityLogs[selectedIncident.id || selectedIncident.incidentId] || []).map((log, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-[11px] p-1.5 rounded-lg bg-white border border-slate-200/60 shadow-2xs">
                        <span className="font-mono text-[9px] text-slate-400 font-bold mt-0.5 whitespace-nowrap">{log.time}</span>
                        <span className={`font-semibold ${log.type === 'dispatch' ? 'text-blue-700' : log.type === 'alert' ? 'text-amber-700' : 'text-slate-800'}`}>
                          {log.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tactical Actions (DISPATCH, ALERT, UPDATE STATUS) */}
                <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleDispatch(selectedIncident.id || selectedIncident.incidentId)}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-sm flex flex-col items-center justify-center space-y-0.5"
                    title="Deploy emergency units to scene"
                  >
                    <div className="flex items-center gap-1">
                      <Send className="w-3.5 h-3.5" />
                      <span>DISPATCH</span>
                    </div>
                    <span className="text-[8px] opacity-80 font-normal">Deploy Fleet</span>
                  </button>

                  <button
                    onClick={() => handleAlert(selectedIncident.id || selectedIncident.incidentId)}
                    className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-sm flex flex-col items-center justify-center space-y-0.5"
                    title="Broadcast emergency broadcast to public"
                  >
                    <div className="flex items-center gap-1">
                      <Bell className="w-3.5 h-3.5" />
                      <span>ALERT</span>
                    </div>
                    <span className="text-[8px] opacity-80 font-normal">Broadcast WEA</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedIncident.id || selectedIncident.incidentId, selectedIncident.status)}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-sm flex flex-col items-center justify-center space-y-0.5"
                    title="Cycle status: Active ➔ Contained ➔ Resolved"
                  >
                    <div className="flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>UPDATE</span>
                    </div>
                    <span className="text-[8px] opacity-80 font-normal">Cycle Status</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs font-semibold">
                Select an incident from the table or map to view details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Section: EMERGENCY RESOURCES (ChatGPT Spec) */}
      {(activeTab === 'ALL' || activeTab === 'RESOURCES') && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-cyan-600" />
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                EMERGENCY RESOURCES & DISPATCH MATRIX
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400 font-bold">Fleet Telemetry</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <th className="pb-2">Resource</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Location</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {resources.slice(0, 5).map(res => (
                  <tr key={res.id || res.resourceId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 font-bold text-slate-900">{res.name}</td>
                    <td className="py-2.5 capitalize">{res.type.replace('_', ' ')}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${res.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-cyan-100 text-cyan-800'
                        }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono text-[11px] text-slate-500">
                      {res.latitude.toFixed(4)}°N, {res.longitude.toFixed(4)}°E
                    </td>
                    <td className="py-2.5 text-right space-x-1">
                      <button
                        onClick={() => handleAssignResource(res.id || res.resourceId, res.name)}
                        className="px-2 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-[10px] font-bold cursor-pointer transition-colors shadow-2xs"
                      >
                        ASSIGN
                      </button>
                      <button
                        onClick={() => handleTrackResource(res.id || res.resourceId, res.name)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-[10px] font-bold cursor-pointer transition-colors shadow-2xs"
                      >
                        TRACK
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Section: HOSPITALS & LIVE SENSORS GRID (ChatGPT Spec) */}
      {(activeTab === 'ALL' || activeTab === 'HOSPITALS' || activeTab === 'SENSORS') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Hospital Capacity */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  HOSPITAL CAPACITY & TRIAGE STATUS
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400">
                    <th className="pb-2">Hospital</th>
                    <th className="pb-2">Beds</th>
                    <th className="pb-2">ICU</th>
                    <th className="pb-2">Load</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {hospitals.map(hosp => (
                    <tr key={hosp.id || hosp.hospitalId} className="hover:bg-slate-50">
                      <td className="py-2.5 font-bold">{hosp.name}</td>
                      <td className="py-2.5 font-bold text-emerald-600">{hosp.availableBeds}</td>
                      <td className="py-2.5 font-bold text-cyan-600">{hosp.icuAvailable}</td>
                      <td className="py-2.5 font-bold text-slate-900">{hosp.occupancyRate || hosp.emergencyLoad}%</td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {hosp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live Sensor Alerts */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-purple-600" />
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  LIVE SENSOR ALERTS
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400">
                    <th className="pb-2">Sensor</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Value</th>
                    <th className="pb-2">Location</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {sensors.slice(0, 4).map(sens => (
                    <tr key={sens.id || sens.sensorId} className="hover:bg-slate-50">
                      <td className="py-2.5 font-mono text-[11px] text-purple-600 font-bold">{sens.sensorId}</td>
                      <td className="py-2.5 capitalize">{sens.type || sens.sensorType}</td>
                      <td className="py-2.5 font-bold text-slate-900">{sens.value} {sens.unit || ''}</td>
                      <td className="py-2.5 truncate max-w-[120px]">{sens.locationLabel || 'Zone A'}</td>
                      <td className="py-2.5 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sens.status === 'ALERT' ? 'bg-rose-100 text-rose-700 border border-rose-300' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                          {sens.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. Section: EVACUATION & RESCUE ROUTES (ChatGPT Spec) */}
      {(activeTab === 'ALL' || activeTab === 'EVACUATION') && (
        <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-cyan-400 animate-pulse" />
              <h3 className="font-extrabold text-white text-xs uppercase tracking-wider">
                EVACUATION & RESCUE ROUTE CORRIDOR CONTROL
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-extrabold border border-cyan-500/30">
              AI ROUTE OPTIMIZATION ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 flex flex-col justify-between">
              <div>
                <div className="flex justify-between font-bold text-emerald-400 mb-1">
                  <span>🟢 SAFE ZONE ALPHA</span>
                  <span className="font-mono text-[11px]">Cap: {safeZoneStats.maxCapacity}</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Open Ground Assembly Point • Occupancy: <strong className="text-emerald-300 font-mono">{safeZoneStats.occupancy}% ({safeZoneStats.count})</strong>
                </p>
                <span className="inline-block mt-1 text-[9px] font-mono text-emerald-400 uppercase font-extrabold tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {safeZoneStats.status}
                </span>
              </div>
              <button
                onClick={handleOpenSafeZone}
                className="mt-3 w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[10px] cursor-pointer transition-colors shadow-2xs uppercase tracking-wider"
              >
                OPEN & MANAGE SAFE ZONE
              </button>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 flex flex-col justify-between">
              <div>
                <div className="flex justify-between font-bold text-amber-400 mb-1">
                  <span>🚚 EVACUATION CORRIDOR</span>
                  <span className="font-mono text-[11px]">Speed: {corridorStats.speed} km/h</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Rushikonda Arterial Bypass • <strong className="text-amber-300">{corridorStats.isCleared ? 'Priority Expressway Clear' : 'Detour Active'}</strong>
                </p>
                <span className="inline-block mt-1 text-[9px] font-mono text-amber-400 uppercase font-extrabold tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {corridorStats.status}
                </span>
              </div>
              <button
                onClick={handleClearCorridor}
                className="mt-3 w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-[10px] cursor-pointer transition-colors shadow-2xs uppercase tracking-wider"
              >
                CLEAR & PREEMPT CORRIDOR
              </button>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 flex flex-col justify-between">
              <div>
                <div className="flex justify-between font-bold text-rose-400 mb-1">
                  <span>🔴 DANGER ZONE CORDON</span>
                  <span className="font-mono text-[11px]">Radius: {dangerZoneStats.radius}m</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Perimeter Sealed • Gas/HazMat Cordon • Sparks Prohibited
                </p>
                <span className="inline-block mt-1 text-[9px] font-mono text-rose-400 uppercase font-extrabold tracking-wider bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  {dangerZoneStats.status}
                </span>
              </div>
              <button
                onClick={handleUpdatePerimeter}
                className="mt-3 w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-[10px] cursor-pointer transition-colors shadow-2xs uppercase tracking-wider"
              >
                EXPAND / UPDATE CORDON ({dangerZoneStats.radius}m)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Animated Toast Notification Feedback Overlay */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 text-white shadow-2xl border border-slate-700 backdrop-blur-md transition-all duration-300">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />}
          {toast.type === 'info' && <Radio className="w-5 h-5 text-sky-400 flex-shrink-0 animate-pulse" />}
          <div className="text-xs font-semibold pr-2">{toast.message}</div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white font-bold text-xs cursor-pointer px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Emergency Evacuation Broadcast Alert Modal */}
      {activeAlertModal && activeAlertModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-slate-900 space-y-4 relative">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
              <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-600">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-extrabold text-amber-600 tracking-widest uppercase block">
                  EMERGENCY BROADCAST ISSUED
                </span>
                <h3 className="text-base font-extrabold text-slate-900">{activeAlertModal.title}</h3>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">INCIDENT ID:</span>
                <span className="font-bold text-slate-900">{activeAlertModal.incidentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">TARGET SECTOR:</span>
                <span className="font-bold text-slate-900">{activeAlertModal.area}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SEVERITY:</span>
                <span className="font-bold text-rose-600">{activeAlertModal.severity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">TRANSMISSION TIME:</span>
                <span className="font-bold text-slate-900">{activeAlertModal.timestamp}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 text-amber-900 text-[11px] rounded-xl border border-amber-200 font-medium">
              <strong>Active Transmission Channels:</strong> Wireless Emergency Alerts (WEA), Cellular EAS, Outdoor Audio Sirens, Digital Variable Message Signs.
            </div>

            <button
              onClick={() => setActiveAlertModal(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl cursor-pointer transition-colors shadow-md uppercase tracking-wider"
            >
              ACKNOWLEDGE & CLOSE BROADCAST
            </button>
          </div>
        </div>
      )}

      {/* Live Vehicle Telemetry & GPS Tracking Modal */}
      {activeTrackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 text-slate-900 space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-sky-500/10 rounded-2xl border border-sky-500/20 text-sky-600">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-extrabold text-sky-600 tracking-widest uppercase block">
                    LIVE GPS TELEMETRY & FLEET TRACKING
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900">{activeTrackModal.name}</h3>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200 font-mono">
                {activeTrackModal.unitCode || 'UNIT-01'}
              </span>
            </div>

            {/* Live Telemetry Radar Visualizer */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3 relative overflow-hidden border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-sky-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  5G MESH TELEMETRY ENCRYPTED
                </span>
                <span className="text-[10px] font-mono text-slate-400">Pinging @ 10Hz</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[9px] text-slate-400 font-bold block">LATITUDE</span>
                  <span className="font-mono text-xs font-bold text-white">{activeTrackModal.latitude.toFixed(4)}°N</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[9px] text-slate-400 font-bold block">LONGITUDE</span>
                  <span className="font-mono text-xs font-bold text-white">{activeTrackModal.longitude.toFixed(4)}°E</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[9px] text-slate-400 font-bold block">SPEED</span>
                  <span className="font-mono text-xs font-bold text-emerald-400">48 km/h</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[9px] text-slate-400 font-bold block">BATTERY/FUEL</span>
                  <span className="font-mono text-xs font-bold text-cyan-400">92%</span>
                </div>
              </div>
            </div>

            {/* Dispatch Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">CURRENT STATUS</span>
                <span className="font-bold text-slate-900 block">{activeTrackModal.status}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">ESTIMATED ETA</span>
                <span className="font-bold text-sky-600 block">{activeTrackModal.etaMinutes || 2} mins to scene</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">DISPATCH DESTINATION</span>
                <span className="font-bold text-slate-900 block">{activeTrackModal.destination || 'INC-001 Commercial Building Fire'}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveTrackModal(null)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl cursor-pointer transition-colors shadow-md uppercase tracking-wider"
              >
                CLOSE TELEMETRY STREAM
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Corridor Control Modals */}
      {activeCorridorModal === 'SAFE_ZONE' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-slate-900 space-y-4 relative">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-extrabold text-emerald-600 tracking-widest uppercase block">
                  SAFE ZONE OPERATIONS CONTROL
                </span>
                <h3 className="text-base font-extrabold text-slate-900">Rushikonda Open Ground Alpha</h3>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">STATUS:</span>
                <span className="font-bold text-emerald-600">{safeZoneStats.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CURRENT OCCUPANCY:</span>
                <span className="font-bold text-slate-900">{safeZoneStats.count} / {safeZoneStats.maxCapacity} ({safeZoneStats.occupancy}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">RELIEF TEAMS:</span>
                <span className="font-bold text-slate-900">APDRF Medical Squad & Red Cross</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSafeZoneStats(p => ({ ...p, occupancy: Math.min(100, p.occupancy + 10), count: p.count + 150 }));
                  triggerToast('SAFE ZONE CAPACITY EXPANDED (+150 beds)', 'success');
                }}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl cursor-pointer transition-colors shadow-sm uppercase tracking-wider"
              >
                + EXPAND CAPACITY
              </button>
              <button
                onClick={() => setActiveCorridorModal(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl cursor-pointer transition-colors shadow-sm"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {activeCorridorModal === 'CORRIDOR' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-slate-900 space-y-4 relative">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
              <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-600">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-extrabold text-amber-600 tracking-widest uppercase block">
                  TRAFFIC SIGNAL PREEMPTION CONTROL
                </span>
                <h3 className="text-base font-extrabold text-slate-900">Rushikonda Arterial Bypass</h3>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">CORRIDOR MODE:</span>
                <span className="font-bold text-amber-600">{corridorStats.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">AVERAGE TRANSIT SPEED:</span>
                <span className="font-bold text-slate-900">{corridorStats.speed} km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">POLICE INTERCEPTORS:</span>
                <span className="font-bold text-slate-900">4 Squad Cars Clearing Traffic</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleClearCorridor}
                className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl cursor-pointer transition-colors shadow-sm uppercase tracking-wider"
              >
                TOGGLE GREEN WAVE
              </button>
              <button
                onClick={() => setActiveCorridorModal(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl cursor-pointer transition-colors shadow-sm"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {activeCorridorModal === 'PERIMETER' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-slate-900 space-y-4 relative">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
              <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-600">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-extrabold text-rose-600 tracking-widest uppercase block">
                  HAZARD ISOLATION & CORDON CONTROL
                </span>
                <h3 className="text-base font-extrabold text-slate-900">Danger Zone Cordon Control</h3>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">CORDON RADIUS:</span>
                <span className="font-bold text-rose-600">{dangerZoneStats.radius} Meters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ISOLATION STATUS:</span>
                <span className="font-bold text-slate-900">{dangerZoneStats.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CORDON PERIMETER:</span>
                <span className="font-bold text-slate-900">AP Police & HazMat Security Sealed</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleUpdatePerimeter}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl cursor-pointer transition-colors shadow-sm uppercase tracking-wider"
              >
                CYCLE RADIUS (+50m)
              </button>
              <button
                onClick={() => setActiveCorridorModal(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl cursor-pointer transition-colors shadow-sm"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
