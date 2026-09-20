import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  UserPlus,
  Settings,
  Database,
  Server,
  Key,
  FileText,
  X,
  Check
} from 'lucide-react';
import usersData from '../../dummy-data/users.json';
import { User } from '../../types/user';
import { useApp } from '../../context/AppContext';

interface UserItem extends User {
  status?: string;
}

export const AdminDashboard: React.FC = () => {
  const { addNotification } = useApp();
  const [users, setUsers] = useState<UserItem[]>(usersData as UserItem[]);
  const [activeTab, setActiveTab] = useState<'USERS' | 'INFRA' | 'AUDIT' | 'SETTINGS'>('USERS');
  const [provisionModalOpen, setProvisionModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'OPERATOR' as 'ADMIN' | 'OPERATOR' | 'ANALYST',
    agency: 'Fire & Rescue Department'
  });

  const handleProvisionUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const user: UserItem = {
      id: `usr-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      agency: newUser.agency,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.name}`,
      status: 'Active'
    };

    setUsers(prev => [...prev, user]);
    setProvisionModalOpen(false);
    setNewUser({ name: '', email: '', role: 'OPERATOR', agency: 'Fire & Rescue Department' });
    addNotification(`NEW USER PROVISIONED: ${user.name} (${user.role}) added to ${user.agency}.`, 'success');
  };

  const handleToggleRole = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const roles: ('ADMIN' | 'OPERATOR' | 'ANALYST')[] = ['OPERATOR', 'ANALYST', 'ADMIN'];
        const nextRole = roles[(roles.indexOf(u.role) + 1) % roles.length];
        addNotification(`USER ACCESS UPDATED: ${u.name}'s role updated to ${nextRole}.`, 'info');
        return { ...u, role: nextRole };
      }
      return u;
    }));
  };

  const auditLogs = [
    { id: 'AUD-001', timestamp: '2026-03-29 15:10', action: 'User role modified: J. Vance -> ADMIN', user: 'Admin User', role: 'ADMIN' },
    { id: 'AUD-002', timestamp: '2026-03-29 14:55', action: 'Resource RES-005 dispatched to INC-001', user: 'Operator One', role: 'OPERATOR' },
    { id: 'AUD-003', timestamp: '2026-03-29 14:20', action: 'Sensor SNS-SMK-12 threshold alert triggered', user: 'System Auto', role: 'SYSTEM' },
    { id: 'AUD-004', timestamp: '2026-03-29 13:40', action: 'Hospital H002 emergency load updated to 88%', user: 'System Sync', role: 'SYSTEM' },
    { id: 'AUD-005', timestamp: '2026-03-29 12:15', action: 'New Analyst Account Provisioned', user: 'Admin User', role: 'ADMIN' }
  ];

  return (
    <div className="space-y-6 text-left font-sans select-none">
      
      {/* Top Admin Key System Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="liquid-glass-card p-4 rounded-2xl border-l-4 border-l-blue-600 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">SYSTEM USERS</p>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-black text-slate-900 leading-none">{users.length}</span>
                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ● {users.length} Active Now
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-3">
            Admin: {users.filter(u => u.role === 'ADMIN').length} | Operators: {users.filter(u => u.role === 'OPERATOR').length} | Analysts: {users.filter(u => u.role === 'ANALYST').length}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="liquid-glass-card p-4 rounded-2xl border-l-4 border-l-emerald-500 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">SYSTEM HEALTH</p>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-black text-slate-900 leading-none">99.9%</span>
                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Optimal
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Server className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-3">
            0 Latency Issues Detected
          </p>
        </div>

        {/* Metric 3 */}
        <div className="liquid-glass-card p-4 rounded-2xl border-l-4 border-l-purple-500 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">GATEWAYS & API</p>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-black text-slate-900 leading-none">12 Feeders</span>
                <span className="text-xs text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  Online
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-3">
            OpenStreetMap Engine Active
          </p>
        </div>

        {/* Metric 4 */}
        <div className="liquid-glass-card p-4 rounded-2xl border-l-4 border-l-amber-500 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">SECURITY AUDIT</p>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-black text-slate-900 leading-none">0 Alerts</span>
                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Secure
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-3">
            Role-Based Access Enforced
          </p>
        </div>

      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex items-center space-x-2 bg-white/70 p-1 rounded-xl border border-slate-200/80 shadow-2xs backdrop-blur-md w-fit">
        <button
          onClick={() => setActiveTab('USERS')}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'USERS' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User Management</span>
        </button>
        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'AUDIT' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Security Audit Log</span>
        </button>
        <button
          onClick={() => setActiveTab('INFRA')}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'INFRA' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>Infrastructure & APIs</span>
        </button>
        <button
          onClick={() => setActiveTab('SETTINGS')}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'SETTINGS' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Platform Controls</span>
        </button>
      </div>

      {/* TAB 1: USERS */}
      {activeTab === 'USERS' && (
        <div className="liquid-glass-card p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Registered System Users & Access Control
              </h3>
              <p className="text-xs text-slate-500">
                Manage roles (ADMIN, OPERATOR, ANALYST), permissions, and security provisioning.
              </p>
            </div>
            <button
              onClick={() => setProvisionModalOpen(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Provision User</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-100/80 text-slate-600 uppercase font-black tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Agency</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                        u.role === 'ADMIN' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                        u.role === 'OPERATOR' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                        'bg-sky-100 text-sky-700 border border-sky-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-600">{u.agency}</td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-600 font-bold text-[11px]">● Active</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleRole(u.id)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-all"
                      >
                        Change Role ({u.role})
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal for Provisioning User */}
          {provisionModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-extrabold text-slate-900 text-sm uppercase">Provision System User</h3>
                  <button onClick={() => setProvisionModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleProvisionUser} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newUser.name}
                      onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="e.g. Commander Sarah Jenkins"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={newUser.email}
                      onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="e.g. s.jenkins@eoc.gov"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Role Permission Level</label>
                    <select
                      value={newUser.role}
                      onChange={e => setNewUser({ ...newUser, role: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="OPERATOR">OPERATOR (Incident Command & Dispatch)</option>
                      <option value="ANALYST">ANALYST (Intelligence & ML Models)</option>
                      <option value="ADMIN">ADMIN (Full Security & User Provisioning)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Assigned Agency</label>
                    <input
                      type="text"
                      value={newUser.agency}
                      onChange={e => setNewUser({ ...newUser, agency: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setProvisionModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Provision User</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: AUDIT LOGS */}
      {activeTab === 'AUDIT' && (
        <div className="liquid-glass-card p-6 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Live System Security & Action Audit Trail
            </h3>
            <p className="text-xs text-slate-500">
              Immutable record of system dispatches, role switches, and administrative overrides.
            </p>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-[10px] font-bold text-slate-400">{log.timestamp}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    log.role === 'ADMIN' ? 'bg-rose-100 text-rose-700' :
                    log.role === 'OPERATOR' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {log.role}
                  </span>
                  <span className="font-semibold text-slate-800">{log.action}</span>
                </div>
                <span className="text-slate-500 font-medium">By: {log.user}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INFRASTRUCTURE */}
      {activeTab === 'INFRA' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="liquid-glass-card p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center space-x-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span>Data Ingestion & SCADA Gateways</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-700">IoT Sensor Telemetry Stream</span>
                <span className="text-emerald-600 font-bold">● CONNECTED (100 Hz)</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-700">Hospital Emergency Load Feed</span>
                <span className="text-emerald-600 font-bold">● CONNECTED (1m sync)</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-700">3D Terrain & City Mesh Pipeline</span>
                <span className="text-emerald-600 font-bold">● ACTIVE</span>
              </div>
            </div>
          </div>

          <div className="liquid-glass-card p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center space-x-2">
              <Key className="w-4 h-4 text-purple-600" />
              <span>API Keys & Integration Service Endpoints</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-700">MapLibre / Mapbox Vector Tiles</span>
                <span className="text-blue-600 font-bold">VERIFIED</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-700">ML Engine Inference Gateway</span>
                <span className="text-blue-600 font-bold">ONLINE (v2.4)</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-700">Emergency Dispatch Push Webhooks</span>
                <span className="text-blue-600 font-bold">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS */}
      {activeTab === 'SETTINGS' && (
        <div className="liquid-glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
            Platform Maintenance & Emergency Protocols
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
              <div>
                <p className="font-bold text-slate-900">Automatic AI Recommendation Engine</p>
                <p className="text-slate-500">Require commander approval before autonomous resource deployment</p>
              </div>
              <input type="checkbox" defaultChecked className="toggle-checkbox w-4 h-4 accent-blue-600" />
            </div>

            <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
              <div>
                <p className="font-bold text-slate-900">High-Surge Auto-Escalation Threshold</p>
                <p className="text-slate-500">Trigger city-wide emergency broadcast when active critical incidents &gt; 5</p>
              </div>
              <input type="checkbox" defaultChecked className="toggle-checkbox w-4 h-4 accent-blue-600" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
