import React, { useState } from 'react';
import {
  Search,
  Truck,
  BatteryCharging,
  Gauge,
  MapPin,
  Users,
  Building2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EmergencyFleet: React.FC = () => {
  const { resources } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filtered = resources.filter(res => {
    const matchesSearch = searchTerm === '' ||
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ((res as any).location && (res as any).location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (typeFilter === 'ALL') return matchesSearch;
    if (typeFilter === 'FIRE') return matchesSearch && res.id.includes('FIRE');
    if (typeFilter === 'MEDICAL') return matchesSearch && res.id.includes('AMB');
    if (typeFilter === 'RESCUE') return matchesSearch && (res.id.includes('RSC') || res.id.includes('DRN'));
    if (typeFilter === 'POLICE') return matchesSearch && res.id.includes('POL');
    return matchesSearch;
  });

  return (
    <div className="space-y-4 text-left font-sans">
      
      {/* Header & Filter Bar (Apple Liquid Glassmorphism) */}
      <div className="liquid-glass-card p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Emergency Response Fleet
          </h2>
          <p className="text-xs text-slate-500">
            Live GPS tracking, crew readiness & active dispatch telemetry
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search fleet unit..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white/70 border border-white/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none shadow-2xs"
            />
          </div>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-white/80 border border-white/90 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer shadow-2xs"
          >
            <option value="ALL">All Types</option>
            <option value="FIRE">Fire & HazMat</option>
            <option value="MEDICAL">Ambulances</option>
            <option value="RESCUE">Rescue & Drones</option>
            <option value="POLICE">Police & Patrol</option>
          </select>
        </div>
      </div>

      {/* 4x4 Grid of Fleet Cards (Apple Liquid Glassmorphism) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filtered.map(unit => {
          const isOnScene = unit.status === 'DEPLOYED' && ((unit as any).speed === 0 || unit.etaMinutes === 0);
          const isEnRoute = unit.status === 'DEPLOYED' && !isOnScene;
          const isAvailable = unit.status === 'AVAILABLE';

          return (
            <div
              key={unit.id}
              className="liquid-glass-card p-3.5 rounded-2xl space-y-2.5 hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              {/* Card Header: Unit ID + Status Badge */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                  {unit.id}
                </span>

                {isOnScene ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-200 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> On Scene
                  </span>
                ) : isEnRoute ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-extrabold border border-amber-200 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> En Route
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Available
                  </span>
                )}
              </div>

              {/* Unit Title & Metadata */}
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-900 text-xs tracking-tight line-clamp-1">
                  {unit.name}
                </h4>
                <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  <span>{(unit as any).location || 'San Francisco Sector'}</span>
                </p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Users className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  <span>Crew: {(unit as any).crew !== undefined ? (unit as any).crew : 3} personnel</span>
                </p>
                <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                  <span>Base: {(unit as any).base || 'Central Depot'}</span>
                </p>
              </div>

              {/* Assigned Incident pill */}
              <div className="p-2 rounded-xl bg-white/60 border border-white/80 text-[11px] shadow-2xs">
                <span className="text-[10px] text-slate-400 block font-semibold">Incident:</span>
                <span className="font-bold text-blue-700 truncate block">
                  {(unit as any).assignedIncident || (unit.status === 'AVAILABLE' ? 'None (Standby Ready)' : 'Active Dispatch')}
                </span>
              </div>

              {/* Bottom Fuel & Speed Telemetry */}
              <div className="flex items-center justify-between pt-1.5 border-t border-white/60 text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <BatteryCharging className="w-3 h-3 text-emerald-500" />
                  {(unit as any).fuel || unit.capacityPercent || 88}%
                </span>
                <span>Speed: {(unit as any).speed || 0} km/h</span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
export default EmergencyFleet;
