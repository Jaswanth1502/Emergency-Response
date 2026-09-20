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
  Globe,
  Download,
  Filter,
  FileSpreadsheet,
  FileCheck,
  ShieldCheck,
  Truck
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
import { useApp } from '../../context/AppContext';
import {
  EmergencyIncident,
  Hospital,
  IoTSensorNode,
  MapLayerState
} from '../../types/digitalTwin';

const INCIDENT_TRENDS = [
  { day: 'Mon', incidents: 14, responseTime: 8.1 },
  { day: 'Tue', incidents: 22, responseTime: 7.8 },
  { day: 'Wed', incidents: 38, responseTime: 9.2 },
  { day: 'Thu', incidents: 29, responseTime: 8.4 },
  { day: 'Fri', incidents: 45, responseTime: 9.8 },
  { day: 'Sat', incidents: 31, responseTime: 8.0 },
  { day: 'Sun', incidents: 19, responseTime: 7.5 }
];

const INCIDENT_DISTRIBUTION = [
  { type: 'Road Accident', count: 64, color: '#3b82f6' },
  { type: 'Fire Incident', count: 37, color: '#ef4444' },
  { type: 'Flood / Surge', count: 21, color: '#06b6d4' },
  { type: 'Landslide', count: 18, color: '#f59e0b' },
  { type: 'Gas Leak', count: 12, color: '#8b5cf6' },
  { type: 'Building Collapse', count: 9, color: '#64748b' }
];

const RESOURCE_ANALYTICS = [
  { name: 'Ambulances', utilization: 78, avgResponse: '7.2 min' },
  { name: 'Fire Teams', utilization: 61, avgResponse: '8.1 min' },
  { name: 'Police Units', utilization: 70, avgResponse: '6.4 min' },
  { name: 'Rescue Teams', utilization: 55, avgResponse: '11.3 min' }
];

const HOSPITAL_PERFORMANCE = [
  { name: 'King George Hospital (KGH Vizag)', load: 74, beds: 64, icu: 18, status: 'HIGH LOAD' },
  { name: 'Government General Hospital (GGH VJA)', load: 52, beds: 52, icu: 14, status: 'STABLE' },
  { name: 'SVIMS Speciality Hospital Tirupati', load: 43, beds: 30, icu: 10, status: 'AVAILABLE' }
];

export const AnalystDashboard: React.FC = () => {
  const { addNotification } = useApp();
  const [incidents, setIncidents] = useState<EmergencyIncident[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [sensors, setSensors] = useState<IoTSensorNode[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<EmergencyIncident | null>(null);

  // Filters
  const [timePeriod, setTimePeriod] = useState<'7DAYS' | '30DAYS' | 'YEAR'>('7DAYS');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');

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

  const handleGenerateReport = (reportTitle: string) => {
    addNotification(`REPORT GENERATED: "${reportTitle}" compiled and archived in Analytics vault.`, 'success');
  };

  const handleExport = (format: string) => {
    addNotification(`DATASET EXPORTED: Historical dataset exported as ${format.toUpperCase()}.`, 'info');
  };

  return (
    <div className="space-y-5 text-left font-sans select-none">
      
      {/* 1. Top Intelligence Statistics (ChatGPT Spec) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1: TOTAL INCIDENTS */}
        <div className="liquid-glass-card p-4 rounded-2xl border-l-4 border-l-blue-600 shadow-md">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">TOTAL INCIDENTS</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-black text-slate-900 leading-none">428</span>
            <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              YTD Archive
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-3">Calculated across AP EOC regions</p>
        </div>

        {/* Stat 2: AVG RESPONSE TIME */}
        <div className="liquid-glass-card p-4 rounded-2xl border-l-4 border-l-emerald-600 shadow-md">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">AVG RESPONSE TIME</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-black text-slate-900 leading-none">8.4 min</span>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              -1.2m vs SLA
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-3">Mean dispatch-to-scene latency</p>
        </div>

        {/* Stat 3: RESOURCE UTILIZATION */}
        <div className="liquid-glass-card p-4 rounded-2xl border-l-4 border-l-cyan-600 shadow-md">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">RESOURCE UTILIZATION</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-black text-slate-900 leading-none">72%</span>
            <span className="text-xs text-cyan-600 font-bold bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
              Optimal Fleet
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-3">Active responder deployment load</p>
        </div>

        {/* Stat 4: HOSPITAL LOAD */}
        <div className="liquid-glass-card p-4 rounded-2xl border-l-4 border-l-amber-600 shadow-md">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">HOSPITAL LOAD</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-black text-slate-900 leading-none">64%</span>
            <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Surge Ready
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-3">146 ICU & Trauma beds free</p>
        </div>

      </div>

      {/* 2. Interactive Filter Toolbar (ChatGPT Spec) */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-extrabold text-slate-800">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>ANALYTICS FILTERS:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-700">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Time Period</span>
            <select
              value={timePeriod}
              onChange={e => setTimePeriod(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7DAYS">Last 7 Days</option>
              <option value="30DAYS">Last 30 Days</option>
              <option value="YEAR">Last 12 Months</option>
            </select>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Incident Type</span>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Incident Types</option>
              <option value="FIRE">Fire Incidents</option>
              <option value="ACCIDENT">Road Accidents</option>
              <option value="FLOOD">Flood / Inundation</option>
              <option value="GAS">Gas Leaks</option>
            </select>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Zone / Region</span>
            <select
              value={selectedZone}
              onChange={e => setSelectedZone(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All AP Zones</option>
              <option value="VIZAG">Visakhapatnam SEZ & Port</option>
              <option value="VJA">Vijayawada Transit Hub</option>
              <option value="TPT">Tirupati Shrine Corridor</option>
              <option value="GNT">Guntur Industrial Area</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Section: INCIDENT TRENDS OVER TIME & DISTRIBUTION (ChatGPT Spec) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Incidents Over Time Line Chart */}
        <div className="lg:col-span-7 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                📈 INCIDENTS OVER TIME ({timePeriod})
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold">Incident frequency trends across selected timeframe</p>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={INCIDENT_TRENDS}>
                <defs>
                  <linearGradient id="trendColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="incidents" stroke="#2563eb" fillOpacity={1} fill="url(#trendColor)" name="Total Incidents" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incident Type Distribution */}
        <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                🔥 INCIDENT TYPE DISTRIBUTION
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold">Historical emergency volume breakdown</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {INCIDENT_DISTRIBUTION.map(item => (
              <div key={item.type} className="text-xs">
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>{item.type}</span>
                  <span>{item.count} cases</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.count / 64) * 100}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Section: RISK / HOTSPOT MAP (ChatGPT Spec) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-purple-600" />
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              🗺️ INCIDENT HOTSPOT & RISK MAP
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-bold">Historical Risk Clusters</span>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200/80 bg-slate-900 h-[460px]">
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

      {/* 5. Section: RESOURCE ANALYTICS & HOSPITAL PERFORMANCE (ChatGPT Spec) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Resource Analytics */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-cyan-600" />
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                🚑 RESOURCE UTILIZATION & AVG RESPONSE TIME
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {RESOURCE_ANALYTICS.map(res => (
              <div key={res.name} className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs font-semibold">
                <div>
                  <span className="font-bold text-slate-900 block">{res.name}</span>
                  <span className="text-[11px] text-slate-400">Utilization: {res.utilization}%</span>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 font-mono font-bold text-[11px]">
                    Avg: {res.avgResponse}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hospital Performance */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                🏥 HOSPITAL PERFORMANCE & SURGE CAPACITY
              </h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400">
                  <th className="pb-2">Hospital</th>
                  <th className="pb-2">Emergency Load</th>
                  <th className="pb-2">Free Beds</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {HOSPITAL_PERFORMANCE.map(hosp => (
                  <tr key={hosp.name} className="hover:bg-slate-50">
                    <td className="py-2.5 font-bold truncate max-w-[180px]">{hosp.name}</td>
                    <td className="py-2.5 font-bold text-slate-900">{hosp.load}%</td>
                    <td className="py-2.5 font-bold text-emerald-600">{hosp.beds} beds</td>
                    <td className="py-2.5 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        hosp.status === 'HIGH LOAD' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {hosp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* 6. Section: AI / DATA INSIGHTS (ChatGPT Spec) */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl border border-slate-800">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-3">
          <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
          <h3 className="font-extrabold text-white text-xs uppercase tracking-wider">
            🤖 AI / DATA INSIGHTS & PATTERN RECOGNITION
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-slate-300">
            <span className="font-bold text-amber-300 block mb-1">• High Traffic Hazard Concentration:</span>
            Road accidents increased by 18% in Vijayawada Transit Concourse during peak hours.
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-slate-300">
            <span className="font-bold text-cyan-300 block mb-1">• Hospital Surge Bottleneck:</span>
            King George Hospital (KGH Vizag) experienced 3 consecutive high-load emergency surges this week.
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-slate-300">
            <span className="font-bold text-rose-300 block mb-1">• Corridor Delay Analysis:</span>
            Average response time increased by 1.8 mins when NH-44 highway bypass was blocked.
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-slate-300">
            <span className="font-bold text-emerald-300 block mb-1">• Industrial Fire Clustering:</span>
            Chemical hazard alerts were concentrated in Rushikonda IT SEZ solvent storage B2.
          </div>
        </div>
      </div>

      {/* 7. Section: REPORTS & DATA EXPORT (ChatGPT Spec) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              📑 REPORTS & ARCHIVE EXPORT
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {[
            'Generate Incident Report',
            'Generate Resource Utilization Report',
            'Generate Hospital Capacity Report',
            'Generate Response Time Report',
            'Generate Disaster Trend Report',
            'Generate Post-Incident Analysis'
          ].map(reportTitle => (
            <button
              key={reportTitle}
              onClick={() => handleGenerateReport(reportTitle)}
              className="px-3.5 py-2.5 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-bold transition-all cursor-pointer text-left flex items-center justify-between"
            >
              <span>{reportTitle}</span>
              <FileCheck className="w-4 h-4 text-blue-500" />
            </button>
          ))}
        </div>

        {/* Export Data buttons */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs font-bold text-slate-500">EXPORT DATASETS:</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExport('CSV')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => handleExport('PDF')}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => handleExport('Excel')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Excel</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
