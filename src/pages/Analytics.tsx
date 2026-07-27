import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const incidentTrends = [
  { month: 'Oct', incidents: 28, resolved: 24 },
  { month: 'Nov', incidents: 35, resolved: 30 },
  { month: 'Dec', incidents: 42, resolved: 38 },
  { month: 'Jan', incidents: 38, resolved: 34 },
  { month: 'Feb', incidents: 31, resolved: 28 },
  { month: 'Mar', incidents: 47, resolved: 41 },
];

const resourceUtil = [
  { name: 'Fire Dept', utilized: 78, available: 22 },
  { name: 'Police', utilized: 62, available: 38 },
  { name: 'Medical', utilized: 85, available: 15 },
  { name: 'Rescue', utilized: 55, available: 45 },
];

const responseTimeDist = [
  { range: '<3m', count: 12 },
  { range: '3-5m', count: 34 },
  { range: '5-8m', count: 28 },
  { range: '8-12m', count: 15 },
  { range: '12m+', count: 6 },
];

const severityBreakdown = [
  { name: 'Critical', value: 18, color: '#ef4444' },
  { name: 'High', value: 32, color: '#f59e0b' },
  { name: 'Medium', value: 28, color: '#6366f1' },
  { name: 'Low', value: 22, color: '#10b981' },
];

const regionalData = [
  { region: 'Sector 1', fire: 8, flood: 3, hazmat: 2, collision: 5 },
  { region: 'Sector 2', fire: 12, flood: 8, hazmat: 4, collision: 3 },
  { region: 'Sector 3', fire: 15, flood: 12, hazmat: 6, collision: 8 },
  { region: 'Sector 4', fire: 20, flood: 5, hazmat: 9, collision: 4 },
  { region: 'Sector 5', fire: 6, flood: 2, hazmat: 1, collision: 9 },
];

const tooltipStyle = { background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '10px' };

export const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('6months');

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-300/25 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Analytics Intelligence Engine</h2>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Dashboard / Historical Insights & Trends</p>
        </div>
        <select
          value={dateRange}
          onChange={e => setDateRange(e.target.value)}
          className="mt-3 sm:mt-0 px-4 py-2 bg-white/70 border border-slate-300/50 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
        >
          <option value="30days">Last 30 Days</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last 12 Months</option>
        </select>
      </div>

      {/* Row 1: Incident Trends & Severity Breakdown */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <GlassCard title="Incident Trends Over Time" subtitle="Active vs Resolved monthly breakdown" tint="indigo">
            <div className="h-[260px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={incidentTrends}>
                  <defs>
                    <linearGradient id="gradInc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradRes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={2.5} fill="url(#gradInc)" />
                  <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} fill="url(#gradRes)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        <GlassCard title="Severity Composition" subtitle="Active incident distribution" tint="indigo">
          <div className="h-[260px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={severityBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {severityBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {severityBreakdown.map(s => (
              <span key={s.name} className="flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase">
                <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                {s.name}: {s.value}%
              </span>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Row 2: Response Time & Resource Utilization */}
      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard title="Response Time Distribution" subtitle="Time from alert to first responder arrival" tint="indigo">
          <div className="h-[220px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimeDist}>
                <XAxis dataKey="range" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Resource Utilization by Agency" subtitle="Current deployment load percentage" tint="amber">
          <div className="h-[220px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceUtil} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} tickLine={false} width={60} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="utilized" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="available" stackId="a" fill="#e2e8f0" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Row 3: Regional comparison */}
      <GlassCard title="Regional Sector Incident Comparison" subtitle="Cross-sector hazard type distribution" tint="indigo">
        <div className="h-[280px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionalData}>
              <XAxis dataKey="region" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="fire" stackId="a" fill="#ef4444" />
              <Bar dataKey="flood" stackId="a" fill="#06b6d4" />
              <Bar dataKey="hazmat" stackId="a" fill="#f59e0b" />
              <Bar dataKey="collision" stackId="a" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-4 justify-center mt-3">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500"><span className="w-2.5 h-2.5 rounded bg-red-500" />Fire</span>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500"><span className="w-2.5 h-2.5 rounded bg-cyan-500" />Flood</span>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500"><span className="w-2.5 h-2.5 rounded bg-amber-500" />HazMat</span>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500"><span className="w-2.5 h-2.5 rounded bg-violet-500" />Collision</span>
        </div>
      </GlassCard>
    </div>
  );
};
export default Analytics;
