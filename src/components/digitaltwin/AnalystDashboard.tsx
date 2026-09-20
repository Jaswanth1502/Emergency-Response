import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Flame,
  Building2,
  Cpu,
  Sparkles,
  FileText,
  Clock,
  Layers,
  Globe
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';
import { Google3DMap } from './Google3DMap';
import { digitalTwinService } from '../../services/digitalTwinService';
import {
  EmergencyIncident,
  Hospital,
  IoTSensorNode,
  MapLayerState
} from '../../types/digitalTwin';

const HISTORICAL_TRENDS = [
  { time: '00:00', incidents: 1, responseMin: 4.2, hospitalLoad: 45 },
  { time: '04:00', incidents: 0, responseMin: 3.8, hospitalLoad: 42 },
  { time: '08:00', incidents: 4, responseMin: 5.1, hospitalLoad: 58 },
  { time: '12:00', incidents: 8, responseMin: 6.4, hospitalLoad: 72 },
  { time: '16:00', incidents: 12, responseMin: 5.9, hospitalLoad: 81 },
  { time: '20:00', incidents: 6, responseMin: 4.8, hospitalLoad: 65 }
];

const RESOURCE_UTILIZATION_DATA = [
  { name: 'Fire Pumper Units', deployed: 85, idle: 15 },
  { name: 'ALS Ambulances', deployed: 74, idle: 26 },
  { name: 'HazMat Squads', deployed: 90, idle: 10 },
  { name: 'Police Interceptors', deployed: 60, idle: 40 },
  { name: 'Rescue Teams', deployed: 80, idle: 20 }
];

export const AnalystDashboard: React.FC = () => {
  const [incidents, setIncidents] = useState<EmergencyIncident[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [sensors, setSensors] = useState<IoTSensorNode[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<EmergencyIncident | null>(null);

  const [analystLayers] = useState<MapLayerState>({
    buildings3D: true,
    terrain: true,
    incidents: true,
    dangerZones: true,
    safeZones: false,
    ambulances: false,
    fireRescue: false,
    police: false,
    hospitals: true,
    iotSensors: true,
    evacuationRoutes: false,
    rescueRoutes: false,
    blockedRoads: true
  });

  useEffect(() => {
    const loadData = async () => {
      const incs = await digitalTwinService.getIncidents();
      const hosps = await digitalTwinService.getHospitals();
      const sens = await digitalTwinService.getSensors();

      setIncidents(incs);
      setHospitals(hosps);
      setSensors(sens);
      if (incs.length > 0) setSelectedIncident(incs[0]);
    };
    loadData();
  }, []);

  return (
    <div className="space-y-4 text-left font-sans select-none">
      
      {/* Top Intelligence Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="liquid-glass-card p-4 rounded-2xl border-l-4 border-l-sky-500 shadow-md">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">AVG RESPONSE TIME</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-black text-slate-900 leading-none">4.8m</span>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
              -1.2m vs target
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">92% Dispatch SLA Compliance</p>
        </div>

        <div className="liquid-glass-card p-4 rounded-2xl border-l-4 border-l-purple-500 shadow-md">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">RISK HOTSPOT DENSITY</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-black text-slate-900 leading-none">3 Sectors</span>
            <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full">
              High Density
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">Rushikonda & Port Basins</p>
        </div>

        <div className="liquid-glass-card p-4 rounded-2xl border-l-4 border-l-emerald-500 shadow-md">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">HOSPITAL SURGE LOAD</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-black text-slate-900 leading-none">72.4%</span>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
              Stable
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">60 Trauma Beds Free</p>
        </div>

        <div className="liquid-glass-card p-4 rounded-2xl border-l-4 border-l-amber-500 shadow-md">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">AI PREDICTIVE RISK ACCURACY</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-black text-slate-900 leading-none">94.8%</span>
            <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
              High Precision
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">Based on 4,800 Telemetry Nodes</p>
        </div>
      </div>

      {/* 2-Column Analyst Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        
        {/* Left: Historical Hotspot 3D Map (Smaller viewport tailored for analytics) */}
        <div className="xl:col-span-6 space-y-3">
          <div className="flex items-center justify-between bg-white px-4 py-2 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Historical Hotspots & Risk Clusters (MapLibre 3D)
              </span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200/80 bg-slate-900 h-[480px]">
            <Google3DMap
              heightClass="h-full"
              incidents={incidents}
              safeZones={[]}
              resources={[]}
              hospitals={hospitals}
              sensors={sensors}
              routes={[]}
              blockedRoads={[]}
              layers={analystLayers}
              selectedIncident={selectedIncident}
              onSelectIncident={setSelectedIncident}
            />
          </div>
        </div>

        {/* Right: Analytical Charts & Intelligence Cards */}
        <div className="xl:col-span-6 space-y-4">
          
          {/* Incident Trends vs Response Time Chart */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-md text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  24-Hour Incident Volume & Response Time Curve
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">Incident count vs dispatch latency in minutes</p>
              </div>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HISTORICAL_TRENDS}>
                  <defs>
                    <linearGradient id="incColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip />
                  <Area type="monotone" dataKey="incidents" stroke="#f43f5e" fillOpacity={1} fill="url(#incColor)" name="Active Incidents" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Resource Load Distribution Chart */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-md text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  Tactical Fleet Utilization Matrix (%)
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">Deployed vs Ready Capacity</p>
              </div>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={RESOURCE_UTILIZATION_DATA} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={10} domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={10} width={120} />
                  <Tooltip />
                  <Bar dataKey="deployed" fill="#0284c7" name="Deployed %" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
