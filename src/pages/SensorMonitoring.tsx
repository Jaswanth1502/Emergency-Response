import React, { useState } from 'react';
import { Search, Radio, Thermometer, Wind, Droplets, Activity, Zap, Cpu } from 'lucide-react';

interface SensorNode {
  id: string;
  name: string;
  location: string;
  type: string;
  status: 'Critical' | 'Warning' | 'Normal';
  liveReading: string;
  threshold: string;
  battery: number;
  updated: string;
  historyBars: ('blue' | 'red')[];
}

const SENSOR_NODES: SensorNode[] = [
  {
    id: 'SENS-TEMP-01',
    name: 'Thermal Array 6F East Corridor',
    location: '450 Mission St - Floor 6 Mezzanine',
    type: 'Temperature',
    status: 'Critical',
    liveReading: '485 °C',
    threshold: '70 °C',
    battery: 91,
    updated: 'Just now',
    historyBars: ['blue', 'blue', 'red', 'red', 'red', 'red']
  },
  {
    id: 'SENS-SMK-02',
    name: 'Optical Smoke Detector Array B2',
    location: '450 Mission St - Sub-Basement B2',
    type: 'Smoke',
    status: 'Critical',
    liveReading: '88 % Obscuration/m',
    threshold: '15 % Obscuration/m',
    battery: 84,
    updated: 'Just now',
    historyBars: ['blue', 'blue', 'blue', 'red', 'red', 'red']
  },
  {
    id: 'SENS-GAS-01',
    name: 'Methane (CH4) Detector Gate 4',
    location: '8th & Market Intermodal Lower Concourse',
    type: 'Gas',
    status: 'Critical',
    liveReading: '68 % LEL',
    threshold: '20 % LEL',
    battery: 96,
    updated: 'Just now',
    historyBars: ['blue', 'blue', 'red', 'red', 'red', 'red']
  },
  {
    id: 'SENS-WAT-01',
    name: 'Submersible Pressure Transducer W-04',
    location: 'Pier 28 Tidal Basin Seawall Lock',
    type: 'Water Level',
    status: 'Critical',
    liveReading: '3.42 m Depth',
    threshold: '2.1 m Depth',
    battery: 88,
    updated: 'Just now',
    historyBars: ['blue', 'blue', 'red', 'red', 'red', 'red']
  },
  {
    id: 'SENS-SEIS-01',
    name: 'Tri-Axial Strong-Motion Accelerometer SM-1',
    location: 'Civic Center Bedrock Station 4',
    type: 'Seismic',
    status: 'Warning',
    liveReading: '4.2 Magnitude (ML)',
    threshold: '3 Magnitude (ML)',
    battery: 99,
    updated: '15 min ago',
    historyBars: ['blue', 'blue', 'blue', 'red', 'red']
  },
  {
    id: 'SENS-AQI-03',
    name: 'Laser Particulate Matter Air Monitor PM2.5/PM10',
    location: 'Market Corridor Environmental Mast 9',
    type: 'Air Quality',
    status: 'Warning',
    liveReading: '210 AQI (Severe)',
    threshold: '100 AQI (Severe)',
    battery: 94,
    updated: 'Just now',
    historyBars: ['blue', 'blue', 'blue', 'red', 'red', 'red']
  },
  {
    id: 'SENS-OCC-01',
    name: 'Infrared Flow Sensor Arterial S-2',
    location: 'Highway 101 Overpass Pedestrian Walk',
    type: 'Pedestrian Flow',
    status: 'Normal',
    liveReading: '12 Persons/100m²',
    threshold: '40 Persons/100m²',
    battery: 92,
    updated: 'Just now',
    historyBars: ['blue', 'blue', 'blue', 'blue', 'blue', 'blue']
  },
  {
    id: 'SENS-TEMP-04',
    name: 'Perimeter Meteorological Node West',
    location: 'Presidio Weather Mast 1',
    type: 'Temperature',
    status: 'Normal',
    liveReading: '21.4 °C',
    threshold: '35 °C',
    battery: 98,
    updated: '2 min ago',
    historyBars: ['blue', 'blue', 'blue', 'blue', 'blue', 'blue']
  }
];

export const SensorMonitoring: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const filteredSensors = SENSOR_NODES.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || s.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4 text-left font-sans">
      
      {/* Top Header & Search Bar (Matching Screenshot 1) */}
      <div className="liquid-glass-card p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Smart City IoT Sensor Telemetry
          </h2>
          <p className="text-xs text-slate-500">
            Real-time edge streams: thermal arrays, gas sniffers, hydro transducers & seismic nodes
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search sensor node..."
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
            <option value="All">All Sensor Types</option>
            <option value="Temperature">Temperature</option>
            <option value="Smoke">Smoke</option>
            <option value="Gas">Gas (CH4)</option>
            <option value="Water Level">Water Level</option>
            <option value="Seismic">Seismic</option>
            <option value="Air Quality">Air Quality</option>
            <option value="Pedestrian Flow">Pedestrian Flow</option>
          </select>
        </div>
      </div>

      {/* 2x4 Grid of 8 Sensor Cards (Matching Screenshot 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredSensors.map(sensor => {
          const badgeClass =
            sensor.status === 'Critical'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : sensor.status === 'Warning'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200';

          const readingColor =
            sensor.status === 'Critical'
              ? 'text-rose-600'
              : sensor.status === 'Warning'
              ? 'text-amber-600'
              : 'text-slate-900';

          return (
            <div
              key={sensor.id}
              className="liquid-glass-card p-4 rounded-2xl space-y-3 flex flex-col justify-between hover:-translate-y-0.5 transition-all text-left"
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

              {/* Title & Location */}
              <div>
                <h3 className="font-extrabold text-slate-900 text-xs tracking-tight line-clamp-1">
                  {sensor.name}
                </h3>
                <p className="text-[10px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                  {sensor.location}
                </p>
              </div>

              {/* Live Reading */}
              <div className="pt-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                  Live Reading
                </span>
                <div className="flex items-baseline space-x-1.5 mt-0.5">
                  <span className={`text-xl font-black tracking-tight ${readingColor}`}>
                    {sensor.liveReading.split(' ')[0]}
                  </span>
                  <span className="text-xs font-extrabold text-slate-500">
                    {sensor.liveReading.split(' ').slice(1).join(' ')}
                  </span>
                </div>
              </div>

              {/* History Sparkline Bars (Last 30m) & Threshold */}
              <div className="space-y-1 pt-1 border-t border-slate-100/60">
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                  <span>History (Last 30m)</span>
                  <span className="font-semibold text-slate-500">Threshold: {sensor.threshold}</span>
                </div>
                
                {/* 6 Segment History Sparkline */}
                <div className="flex items-end space-x-1 h-3.5 pt-0.5">
                  {sensor.historyBars.map((bar, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-sm ${
                        bar === 'red'
                          ? 'bg-rose-500 h-full'
                          : 'bg-blue-400 h-2'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Footer: Battery / Signal & Updated Time */}
              <div className="flex items-center justify-between pt-2 border-t border-white/60 text-[10px] font-mono text-slate-400">
                <span className="flex items-center space-x-1 text-emerald-600 font-bold">
                  <span>⚡</span>
                  <span>{sensor.battery}%</span>
                </span>
                <span>{sensor.updated}</span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
export default SensorMonitoring;
