import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/common/GlassCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { QuickActionButton } from '../components/common/QuickActionButton';
import { MapPlaceholder } from '../components/map/MapPlaceholder';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Cell, PieChart, Pie } from 'recharts';
import {
  AlertTriangle,
  Activity,
  PlusCircle,
  Truck,
  Navigation,
  Radio,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IncidentFormDialog } from '../components/dialogs/IncidentFormDialog';
import { DeployResourceDialog } from '../components/dialogs/DeployResourceDialog';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { incidents, resources, notifications, triggerPredictiveSimulation } = useApp();
  
  const [incidentFormOpen, setIncidentFormOpen] = useState(false);
  const [deployOpen, setDeployOpen] = useState(false);
  const [isSimLoading, setIsSimLoading] = useState(false);

  // Severe counting
  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED').length;
  const highCount = incidents.filter(i => i.severity === 'HIGH' && i.status !== 'RESOLVED').length;
  const activeCount = incidents.filter(i => i.status !== 'RESOLVED').length;

  // Process data for charts
  // 1. Incidents by type
  const typesData = [
    { name: 'Fire', count: incidents.filter(i => i.type === 'Structure Fire').length },
    { name: 'Flood', count: incidents.filter(i => i.type === 'Flood').length },
    { name: 'HazMat', count: incidents.filter(i => i.type === 'HazMat Spill').length },
    { name: 'Collapse', count: incidents.filter(i => i.type === 'Building Collapse').length },
    { name: 'Collision', count: incidents.filter(i => i.type === 'Multi-Vehicle Collision').length }
  ];

  // 2. Resource distribution by type
  const hospitalTotal = resources.filter(r => r.type === 'HOSPITAL').length;
  const fireTotal = resources.filter(r => r.type === 'FIRE_STATION').length;
  const policeTotal = resources.filter(r => r.type === 'POLICE_UNIT').length;
  const rescueTotal = resources.filter(r => r.type === 'RESCUE_TEAM').length;

  const resourcePieData = [
    { name: 'Hospitals', value: hospitalTotal, color: '#06b6d4' },
    { name: 'Fire Bases', value: fireTotal, color: '#ef4444' },
    { name: 'Police Units', value: policeTotal, color: '#f59e0b' },
    { name: 'Rescue Teams', value: rescueTotal, color: '#10b981' }
  ];

  // 3. Simulated Incidents Over Time
  const timelineData = [
    { time: '08:00', Active: 3, Resolved: 1 },
    { time: '10:00', Active: 4, Resolved: 2 },
    { time: '12:00', Active: 5, Resolved: 4 },
    { time: '14:00', Active: 6, Resolved: 5 },
    { time: '16:00', Active: activeCount, Resolved: incidents.filter(i => i.status === 'RESOLVED').length }
  ];

  // Map markers from active incidents
  const mapMarkers = incidents
    .filter(i => i.status !== 'RESOLVED')
    .map(i => ({
      id: i.id,
      lat: i.coordinates.lat,
      lng: i.coordinates.lng,
      label: i.title,
      severity: i.severity,
      type: i.type
    }));

  const mapZones = incidents
    .filter(i => i.status === 'ACTIVE' || i.status === 'DISPATCHED')
    .map(i => ({
      id: `Z-${i.id}`,
      center: i.coordinates,
      radiusMeter: i.affectedRadiusMeter,
      tint: (i.severity === 'CRITICAL' ? 'rose' : i.severity === 'HIGH' ? 'amber' : 'cyan') as any,
      label: `${i.id} Buffer`
    }));

  const handlePredictiveTrigger = async () => {
    setIsSimLoading(true);
    await triggerPredictiveSimulation();
    setIsSimLoading(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Breadcrumbs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-300/25 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Emergency Command Control Center</h2>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Dashboard / Real-time Platform Overview</p>
        </div>
        <div className="mt-3 md:mt-0 flex space-x-2">
          <button
            onClick={handlePredictiveTrigger}
            disabled={isSimLoading}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            <Activity className="w-4 h-4 animate-spin-slow" />
            <span>{isSimLoading ? 'Simulating Runoff...' : 'Forecast Threat Model'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row (Counts by Severity & status) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard tint="rose" subtitle="Critical Incidents" title="Life Threat Alert">
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-black text-rose-600 tabular-nums">{criticalCount}</span>
            <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-500/10 px-2 py-0.5 rounded-full">Immediate Action</span>
          </div>
        </GlassCard>

        <GlassCard tint="amber" subtitle="High Threat Incidents" title="Severe Level Alert">
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-black text-amber-600 tabular-nums">{highCount}</span>
            <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded-full">Assigned Commander</span>
          </div>
        </GlassCard>

        <GlassCard tint="cyan" subtitle="Active EOC Incidents" title="Operations Level">
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-black text-cyan-600 tabular-nums">{activeCount}</span>
            <span className="text-[10px] uppercase font-bold text-cyan-700 bg-cyan-500/10 px-2 py-0.5 rounded-full">Tactical Teams Assigned</span>
          </div>
        </GlassCard>

        <GlassCard tint="emerald" subtitle="Standby Resources" title="Department Fleet">
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-3xl font-black text-emerald-600 tabular-nums">
              {resources.filter(r => r.status === 'AVAILABLE').length}
            </span>
            <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full">Ready for Dispatch</span>
          </div>
        </GlassCard>
      </div>

      {/* Map, Live Alerts & Quick Actions Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Map Placeholder (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-300/30">
            <MapPlaceholder
              markers={mapMarkers}
              zones={mapZones}
              heightClass="h-[430px]"
              title="Real-Time EOC Digital Twin GIS Viewer"
            />
          </div>

          {/* Quick Actions Panel */}
          <GlassCard title="Operations Tactical Actions" subtitle="Trigger command directives" tint="slate">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-1">
              <QuickActionButton
                icon={<PlusCircle className="w-4 h-4 text-rose-600" />}
                label="Create Incident"
                tint="rose"
                onClick={() => setIncidentFormOpen(true)}
              />
              <QuickActionButton
                icon={<Truck className="w-4 h-4 text-amber-600" />}
                label="Dispatch Unit"
                tint="amber"
                onClick={() => setDeployOpen(true)}
              />
              <QuickActionButton
                icon={<Radio className="w-4 h-4 text-cyan-600" />}
                label="Poll IoT Sensors"
                tint="cyan"
                onClick={() => navigate('/sensors')}
              />
              <QuickActionButton
                icon={<Navigation className="w-4 h-4 text-emerald-600" />}
                label="Evacuation Routes"
                tint="emerald"
                onClick={() => navigate('/evacuation')}
              />
            </div>
          </GlassCard>
        </div>

        {/* Live Alerts & Agencies Sidebar (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          {/* Live Alerts Feed */}
          <GlassCard title="Live Systems Alerts" subtitle="Auto-animated stream" tint="rose" className="flex-1">
            <div className="space-y-3 max-h-[310px] overflow-y-auto pr-1">
              {notifications.slice(0, 4).map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-xl border flex items-start space-x-2.5 transition-all ${
                    notif.severity === 'error'
                      ? 'border-rose-300/40 bg-rose-500/10'
                      : 'border-amber-300/40 bg-amber-500/10'
                  }`}
                >
                  <AlertTriangle className={`w-4.5 h-4.5 flex-shrink-0 ${notif.severity === 'error' ? 'text-rose-600' : 'text-amber-600'}`} />
                  <div className="text-left leading-normal">
                    <p className="text-[11px] text-slate-800 font-semibold">{notif.message}</p>
                    <span className="text-[9px] text-slate-500 block mt-1 font-mono">{new Date(notif.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Infrastructure Health Status */}
          <GlassCard title="Static Agencies Status" subtitle="Capacity & Unit availability" tint="slate">
            <div className="space-y-3">
              {resources.filter(r => r.type === 'HOSPITAL').slice(0, 2).map((res) => (
                <div key={res.id} className="flex items-center justify-between text-xs pb-2 border-b border-slate-300/20 last:border-0 last:pb-0">
                  <div className="text-left">
                    <span className="font-bold block text-slate-800">{res.name}</span>
                    <span className="text-[10px] text-slate-500">{res.capacityLabel}</span>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-700 font-extrabold text-[9px] uppercase">
                      HOSPITAL
                    </span>
                  </div>
                </div>
              ))}

              {resources.filter(r => r.type === 'FIRE_STATION').slice(0, 2).map((res) => (
                <div key={res.id} className="flex items-center justify-between text-xs pb-2 border-b border-slate-300/20 last:border-0 last:pb-0">
                  <div className="text-left">
                    <span className="font-bold block text-slate-800">{res.name}</span>
                    <span className="text-[10px] text-slate-500">{res.capacityLabel}</span>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-700 font-extrabold text-[9px] uppercase">
                      FIRE DEPT
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

      </div>

      {/* Analytics Rows */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Incident Type Chart */}
        <GlassCard title="Active Incident Breakdown" subtitle="Distribution by hazard type" tint="slate">
          <div className="h-[200px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typesData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.1)' }} contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '10px' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                  {typesData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#ef4444' : '#0ea5e9'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Incidents timeline chart */}
        <GlassCard title="Operations Incident Trends" subtitle="Active vs Resolved cases" tint="slate">
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '10px' }} />
                <Line type="monotone" dataKey="Active" stroke="#ef4444" strokeWidth={2.5} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Resolved" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* EOC Static Departments pie chart */}
        <GlassCard title="Allocated Agency Units" subtitle="Static emergency nodes" tint="slate">
          <div className="h-[200px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resourcePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {resourcePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

      </div>

      {/* Active Incidents Datatable Mini-Strip */}
      <GlassCard title="Active Operations Log" subtitle="Tactical list of all un-resolved incident nodes" tint="rose">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-300/30 text-slate-500 text-[10px] uppercase font-extrabold tracking-wider">
                <th className="py-2.5">ID</th>
                <th className="py-2.5">Incident Title</th>
                <th className="py-2.5">Category</th>
                <th className="py-2.5">Severity</th>
                <th className="py-2.5">Assigned Commander</th>
                <th className="py-2.5 text-right">EOC Tactical Link</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-300/10">
              {incidents.filter(i => i.status !== 'RESOLVED').map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-500/5 transition-colors">
                  <td className="py-3 font-mono font-bold text-rose-600">{inc.id}</td>
                  <td className="py-3 font-semibold text-slate-800">{inc.title}</td>
                  <td className="py-3 text-slate-500">{inc.type}</td>
                  <td className="py-3">
                    <StatusBadge severity={inc.severity} />
                  </td>
                  <td className="py-3 font-medium text-slate-600">{inc.assignedCommander}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => navigate(`/incidents/${inc.id}`)}
                      className="px-2.5 py-1 text-[10px] font-bold text-cyan-600 hover:text-cyan-800 hover:bg-cyan-500/10 rounded transition-all uppercase inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Tactical Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <IncidentFormDialog isOpen={incidentFormOpen} onClose={() => setIncidentFormOpen(false)} />
      <DeployResourceDialog isOpen={deployOpen} onClose={() => setDeployOpen(false)} />

    </div>
  );
};
export default Dashboard;
