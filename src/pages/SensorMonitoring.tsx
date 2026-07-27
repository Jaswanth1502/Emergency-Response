import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/common/GlassCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';
import { Thermometer, Wind, Droplets, Activity, Radio } from 'lucide-react';
import type { SensorType } from '../types/sensor';

const sensorTypeConfig: Record<SensorType, { label: string; icon: React.ReactNode; color: string }> = {
  TEMPERATURE: { label: 'Temperature', icon: <Thermometer className="w-4 h-4" />, color: '#ef4444' },
  SMOKE: { label: 'Smoke Detection', icon: <Wind className="w-4 h-4" />, color: '#f59e0b' },
  GAS: { label: 'Gas Concentration', icon: <Activity className="w-4 h-4" />, color: '#8b5cf6' },
  WATER_LEVEL: { label: 'Water Level', icon: <Droplets className="w-4 h-4" />, color: '#06b6d4' },
  SEISMIC: { label: 'Seismic Activity', icon: <Radio className="w-4 h-4" />, color: '#10b981' },
};

export const SensorMonitoring: React.FC = () => {
  const { sensors } = useApp();
  const [activeType, setActiveType] = useState<SensorType | 'ALL'>('ALL');

  const filteredSensors = activeType === 'ALL' ? sensors : sensors.filter(s => s.type === activeType);
  const types: (SensorType | 'ALL')[] = ['ALL', 'TEMPERATURE', 'SMOKE', 'GAS', 'WATER_LEVEL', 'SEISMIC'];

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-300/25 pb-4">
        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">IoT Sensor Telemetry Monitoring</h2>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Dashboard / Real-Time Stream Analysis</p>
      </div>

      {/* Tab Filters */}
      <div className="flex flex-wrap gap-2">
        {types.map(t => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
              activeType === t
                ? 'bg-slate-900 text-white border-slate-700 shadow-md'
                : 'bg-white/70 text-slate-600 border-slate-300/50 hover:bg-white'
            }`}
          >
            {t === 'ALL' ? 'All Sensors' : sensorTypeConfig[t].label}
          </button>
        ))}
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard tint="emerald">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Safe</p>
              <p className="text-2xl font-black text-emerald-600 tabular-nums">{sensors.filter(s => s.status === 'SAFE').length}</p>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600"><Activity className="w-5 h-5" /></div>
          </div>
        </GlassCard>
        <GlassCard tint="amber">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Warning</p>
              <p className="text-2xl font-black text-amber-600 tabular-nums">{sensors.filter(s => s.status === 'WARNING').length}</p>
            </div>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600"><Activity className="w-5 h-5" /></div>
          </div>
        </GlassCard>
        <GlassCard tint="rose">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Critical</p>
              <p className="text-2xl font-black text-rose-600 tabular-nums">{sensors.filter(s => s.status === 'CRITICAL').length}</p>
            </div>
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-600"><Activity className="w-5 h-5" /></div>
          </div>
        </GlassCard>
        <GlassCard tint="slate">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Total Online</p>
              <p className="text-2xl font-black text-slate-800 tabular-nums">{sensors.filter(s => s.status !== 'OFFLINE').length}/{sensors.length}</p>
            </div>
            <div className="p-2 bg-slate-500/10 rounded-lg text-slate-600"><Radio className="w-5 h-5" /></div>
          </div>
        </GlassCard>
      </div>

      {/* Sensor Detail Cards with Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredSensors.map(sensor => {
          const config = sensorTypeConfig[sensor.type];
          const tint = sensor.status === 'CRITICAL' ? 'rose' : sensor.status === 'WARNING' ? 'amber' : 'cyan';

          return (
            <GlassCard
              key={sensor.id}
              title={sensor.name}
              subtitle={`${sensor.id} • ${config.label}`}
              icon={config.icon}
              tint={tint}
              actions={<StatusBadge status={sensor.status} />}
            >
              <div className="space-y-4 mt-2">
                {/* Current Value Display */}
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className={`text-3xl font-black tabular-nums ${
                      sensor.status === 'CRITICAL' ? 'text-rose-600' : sensor.status === 'WARNING' ? 'text-amber-600' : 'text-cyan-600'
                    }`}>
                      {sensor.currentValue}
                    </span>
                    <span className="text-sm text-slate-500 ml-1 font-semibold">{sensor.unit}</span>
                  </div>
                  <div className="text-right text-[10px] text-slate-400">
                    <p>Warn: {sensor.thresholdHigh} {sensor.unit}</p>
                    <p>Crit: {sensor.thresholdCritical} {sensor.unit}</p>
                  </div>
                </div>

                {/* Threshold gauge bar */}
                <div className="relative h-2 bg-slate-200/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      sensor.currentValue >= sensor.thresholdCritical ? 'bg-rose-500' :
                      sensor.currentValue >= sensor.thresholdHigh ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min((sensor.currentValue / (sensor.thresholdCritical * 1.2)) * 100, 100)}%` }}
                  />
                </div>

                {/* 24h Area Chart */}
                <div className="h-[140px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sensor.historical24h}>
                      <defs>
                        <linearGradient id={`grad-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={config.color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '10px' }} />
                      <ReferenceLine y={sensor.thresholdHigh} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Warn', fontSize: 8, fill: '#f59e0b' }} />
                      <ReferenceLine y={sensor.thresholdCritical} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Crit', fontSize: 8, fill: '#ef4444' }} />
                      <Area type="monotone" dataKey="value" stroke={config.color} strokeWidth={2} fill={`url(#grad-${sensor.id})`} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex justify-between text-[9px] text-slate-400 font-mono uppercase">
                  <span>Last Reading: {new Date(sensor.lastReadingTime).toLocaleTimeString()}</span>
                  <span>Lat: {sensor.coordinates.lat.toFixed(4)}</span>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
export default SensorMonitoring;
