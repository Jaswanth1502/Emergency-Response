import React from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/common/GlassCard';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';

const auditLog = [
  { id: 'AUD-001', timestamp: '2026-03-29T15:10:00Z', action: 'Incident INC-001 escalated to CRITICAL', user: 'Sarah Jenkins', role: 'ADMIN' },
  { id: 'AUD-002', timestamp: '2026-03-29T14:55:00Z', action: 'Resource RES-005 deployed to INC-001', user: 'David Miller', role: 'OPERATOR' },
  { id: 'AUD-003', timestamp: '2026-03-29T14:20:00Z', action: 'Sensor SNS-SMK-12 threshold breach alert generated', user: 'System Auto', role: 'SYSTEM' },
  { id: 'AUD-004', timestamp: '2026-03-29T13:40:00Z', action: 'Evacuation Route Beta capacity updated to 92%', user: 'Rebecca Hall', role: 'ANALYST' },
  { id: 'AUD-005', timestamp: '2026-03-29T12:15:00Z', action: 'New user Alan Cruz added to Metro Police Command', user: 'Sarah Jenkins', role: 'ADMIN' },
  { id: 'AUD-006', timestamp: '2026-03-29T11:00:00Z', action: 'System backup completed successfully', user: 'System Auto', role: 'SYSTEM' },
];

const systemServices = [
  { name: 'EOC Core API Gateway', status: 'ONLINE', uptime: '99.97%', latency: '12ms' },
  { name: 'GIS Tile Server', status: 'ONLINE', uptime: '99.91%', latency: '45ms' },
  { name: 'IoT Telemetry Broker', status: 'ONLINE', uptime: '99.84%', latency: '8ms' },
  { name: 'Notification Push Service', status: 'DEGRADED', uptime: '98.2%', latency: '210ms' },
  { name: 'Report Generation Engine', status: 'ONLINE', uptime: '99.99%', latency: '150ms' },
  { name: 'Auth & Identity Provider', status: 'ONLINE', uptime: '100%', latency: '5ms' },
];

const departments = [
  { name: 'Metro Fire & Rescue Department', code: 'MFR-001', head: 'Chief Sarah Jenkins', units: 12 },
  { name: 'Metro Police Command Center', code: 'MPC-001', head: 'Commander Alan Cruz', units: 24 },
  { name: 'GIS & Sensors Division', code: 'GSD-001', head: 'Director Rebecca Hall', units: 8 },
  { name: 'Emergency Medical Services', code: 'EMS-001', head: 'Dr. Lisa Chang', units: 6 },
];

export const Administration: React.FC = () => {
  const { users } = useApp();

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-300/25 pb-4">
        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">EOC Administration Core</h2>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Dashboard / User Management & System Health</p>
      </div>

      {/* User Management Table */}
      <GlassCard title="Registered EOC Personnel" subtitle="Active command staff directory" tint="slate" icon={<Shield className="w-4 h-4" />}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-300/30 text-slate-500 text-[10px] uppercase font-extrabold tracking-wider">
                <th className="py-3 px-3">Officer</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Agency</th>
                <th className="py-3 px-3">Last Active</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-300/10">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-500/5 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-lg object-cover border border-white/50" />
                      <span className="font-bold text-slate-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[10px]">{u.email}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      u.role === 'ADMIN' ? 'bg-rose-500/10 text-rose-700 border border-rose-500/20' :
                      u.role === 'OPERATOR' ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20' :
                      'bg-indigo-500/10 text-indigo-700 border border-indigo-500/20'
                    }`}>{u.role}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{u.agency}</td>
                  <td className="py-3 px-3 text-slate-400 text-[10px]">{u.lastActive}</td>
                  <td className="py-3 px-3">
                    <span className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold uppercase">
                      <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-6">
        {/* System Health Panel */}
        <GlassCard title="Platform Service Health" subtitle="Microservice status monitoring" tint="cyan">
          <div className="space-y-3">
            {systemServices.map(svc => (
              <div key={svc.name} className="flex items-center justify-between p-2.5 rounded-xl bg-white/50 border border-white/40 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${svc.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                    {svc.status === 'ONLINE' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">{svc.name}</span>
                    <span className="text-[9px] text-slate-400">Uptime: {svc.uptime} • Latency: {svc.latency}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                  svc.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-700' : 'bg-amber-500/10 text-amber-700 animate-pulse'
                }`}>{svc.status}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Departments */}
        <GlassCard title="Registered Agencies & Departments" subtitle="Inter-agency coordination matrix" tint="slate">
          <div className="space-y-3">
            {departments.map(dept => (
              <div key={dept.code} className="p-3 rounded-xl bg-white/50 border border-white/40 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-slate-800 block">{dept.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{dept.code}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold">{dept.units} units</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Division Head: {dept.head}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Audit Log */}
      <GlassCard title="System Audit Trail" subtitle="Chronological action logging" tint="slate">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-300/30 text-slate-500 text-[10px] uppercase font-extrabold tracking-wider">
                <th className="py-2.5 px-3">ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Role</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-300/10">
              {auditLog.map(log => (
                <tr key={log.id} className="hover:bg-slate-500/5">
                  <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500">{log.id}</td>
                  <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-slate-700 font-medium">{log.action}</td>
                  <td className="py-2.5 px-3 text-slate-600">{log.user}</td>
                  <td className="py-2.5 px-3"><span className="px-1.5 py-0.5 rounded bg-slate-500/10 text-[9px] font-bold text-slate-600 uppercase">{log.role}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
export default Administration;
