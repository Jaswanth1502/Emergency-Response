import React, { useState } from 'react';
import { Search, Radio, Thermometer, Wind, Droplets, Activity, Zap, Cpu, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SensorMonitoring: React.FC = () => {
  const { sensors } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const filteredSensors = sensors.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.datasetSource && s.datasetSource.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesType = true;
    if (selectedType !== 'All') {
      if (selectedType === 'Temperature') matchesType = s.type === 'TEMPERATURE' || s.type === 'WEATHER';
      else if (selectedType === 'Smoke') matchesType = s.type === 'SMOKE';
      else if (selectedType === 'Gas') matchesType = s.type === 'GAS';
      else if (selectedType === 'Water Level') matchesType = s.type === 'WATER_LEVEL';
      else if (selectedType === 'Landslide') matchesType = s.type === 'LANDSLIDE' || s.type === 'SOIL_MOISTURE';
      else if (selectedType === 'Seismic') matchesType = s.type === 'SEISMIC';
      else if (selectedType === 'Air Quality') matchesType = s.type === 'AIR_QUALITY';
      else if (selectedType === 'Traffic Speed') matchesType = s.type === 'TRAFFIC_SPEED';
      else if (selectedType === 'Pedestrian Flow') matchesType = s.type === 'PEDESTRIAN_FLOW';
    }
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4 text-left font-sans">
      
      {/* Top Header & Search Bar (Apple Liquid Glassmorphism) */}
      <div className="liquid-glass-card p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Smart City IoT Sensor Telemetry
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-200 shadow-2xs">
              {sensors.length} Active Nodes
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time multi-hazard edge streams: thermal arrays, InSAR landslide nodes, gas sniffers & hydro transducers
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search node, dataset..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 liquid-glass-pill rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
            />
          </div>

          {/* Type Dropdown */}
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="liquid-glass-pill px-3 py-1.5 rounded-xl text-xs font-extrabold text-slate-700 focus:outline-none cursor-pointer shadow-2xs"
          >
            <option value="All">All Sensor Streams</option>
            <option value="Temperature">Temperature & Thermal</option>
            <option value="Smoke">Optical Smoke</option>
            <option value="Gas">Gas & HazMat (CH4)</option>
            <option value="Water Level">Water Level & Hydro</option>
            <option value="Landslide">Landslide & Ground InSAR</option>
            <option value="Seismic">Seismic & Structural</option>
            <option value="Air Quality">Air Quality (PM2.5)</option>
            <option value="Traffic Speed">Traffic Speed Loop</option>
            <option value="Pedestrian Flow">Pedestrian & Crowd Flow</option>
          </select>
        </div>
      </div>

      {/* Grid of Sensor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredSensors.map(sensor => {
          const badgeClass =
            sensor.status === 'CRITICAL'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : sensor.status === 'WARNING'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200';

          const readingColor =
            sensor.status === 'CRITICAL'
              ? 'text-rose-600'
              : sensor.status === 'WARNING'
              ? 'text-amber-600'
              : 'text-slate-900';

          return (
            <div
              key={sensor.id}
              className="liquid-glass-card p-4 rounded-2xl space-y-3 flex flex-col justify-between hover:-translate-y-0.5 transition-all text-left group"
            >
              
              {/* Top Row: Sensor ID + Status Badge */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  {sensor.id}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border shadow-2xs ${badgeClass}`}>
                  ● {sensor.status}
                </span>
              </div>

              {/* Title & Dataset Source */}
              <div>
                <h3 className="font-extrabold text-slate-900 text-xs tracking-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {sensor.name}
                </h3>
                <p className="text-[10px] text-slate-500 font-medium line-clamp-1 mt-0.5 flex items-center space-x-1">
                  <Database className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{sensor.datasetSource || 'EOC Sensor Telemetry Mesh'}</span>
                </p>
              </div>

              {/* Live Reading */}
              <div className="pt-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                  Live Reading
                </span>
                <div className="flex items-baseline space-x-1.5 mt-0.5">
                  <span className={`text-xl font-black tracking-tight ${readingColor}`}>
                    {sensor.currentValue}
                  </span>
                  <span className="text-xs font-extrabold text-slate-500">
                    {sensor.unit}
                  </span>
                </div>
              </div>

              {/* History Sparkline Bars (Last 24h) & Threshold */}
              <div className="space-y-1 pt-1 border-t border-slate-100/60">
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                  <span>Trend History</span>
                  <span className="font-semibold text-slate-500">Crit: {sensor.thresholdCritical} {sensor.unit}</span>
                </div>
                
                {/* 5-6 Segment History Sparkline */}
                <div className="flex items-end space-x-1 h-3.5 pt-0.5">
                  {sensor.historical24h.map((pt, i) => {
                    const isExceeded = pt.value >= sensor.thresholdHigh;
                    return (
                      <div
                        key={i}
                        title={`${pt.time}: ${pt.value} ${sensor.unit}`}
                        className={`flex-1 rounded-sm transition-all ${
                          isExceeded
                            ? 'bg-rose-500 h-full'
                            : 'bg-blue-400 h-2'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Footer: Battery / Signal & Last Sync */}
              <div className="flex items-center justify-between pt-2 border-t border-white/60 text-[10px] font-mono text-slate-400">
                <span className="flex items-center space-x-1 text-emerald-600 font-bold">
                  <span>⚡</span>
                  <span>{sensor.battery || 95}%</span>
                </span>
                <span>Active Telemetry</span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
export default SensorMonitoring;
