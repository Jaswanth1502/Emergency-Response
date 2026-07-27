import React from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/common/GlassCard';
import { MapPlaceholder } from '../components/map/MapPlaceholder';
// No unused imports

export const Evacuation: React.FC = () => {
  const { routes, shelters, roads } = useApp();

  // Markers for shelters
  const markers = shelters.map(s => ({
    id: s.id,
    lat: s.coordinates.lat,
    lng: s.coordinates.lng,
    label: `${s.name} (${s.occupancy}/${s.capacity} Occupied)`,
    severity: (s.status === 'FULL' ? 'HIGH' : s.status === 'CLOSED' ? 'CRITICAL' : 'LOW') as any,
    type: 'SHELTER'
  }));

  const mapRoutes = routes.map(r => ({
    id: r.id,
    name: r.name,
    points: r.coordinates,
    congestion: r.congestionStatus
  }));

  return (
    <div className="space-y-6 text-left">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-300/25 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Emergency Evacuation Systems</h2>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Dashboard / Civil Contingency Corridors</p>
        </div>
      </div>

      {/* Grid: Map + Side metrics panels */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Side: Evacuation Route Cards & Shelters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Evacuation Route List */}
          <GlassCard title="Emergency Escape Corridors" subtitle="Dynamic traffic congestions" tint="emerald">
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {routes.map((rt) => {
                let statusColor = 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20';
                if (rt.congestionStatus === 'MODERATE') statusColor = 'text-amber-600 bg-amber-500/10 border-amber-500/20';
                if (rt.congestionStatus === 'HEAVY') statusColor = 'text-orange-600 bg-orange-500/10 border-orange-500/20';
                if (rt.congestionStatus === 'BLOCKED') statusColor = 'text-rose-600 bg-rose-500/10 border-rose-500/20';

                return (
                  <div key={rt.id} className="p-3 bg-white/60 rounded-xl border border-white/50 flex flex-col justify-between text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="text-left">
                        <span className="font-extrabold text-slate-800 block leading-tight">{rt.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{rt.distanceKm} km — Transit: {rt.estimatedTimeMinutes}m</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded border text-[9px] font-black uppercase ${statusColor}`}>
                        {rt.congestionStatus}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase">
                        <span>FLOW CAPACITY:</span>
                        <span>{rt.capacityRate}%</span>
                      </div>
                      <div className="w-full bg-slate-300/30 rounded-full h-1 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${rt.capacityRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Shelters occupancy */}
          <GlassCard title="Civilian Shelter Overlays" subtitle="Allocated safe zones occupancy" tint="emerald">
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {shelters.map((sh) => (
                <div key={sh.id} className="p-3 bg-white/60 rounded-xl border border-white/50 flex items-center justify-between text-xs">
                  <div className="text-left space-y-1 flex-1 pr-3">
                    <span className="font-extrabold text-slate-800 block leading-tight">{sh.name}</span>
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                      <span>Occupancy: {sh.occupancy}/{sh.capacity} ({Math.round(sh.occupancy/sh.capacity*100)}%)</span>
                    </div>
                    <div className="w-full bg-slate-300/30 rounded-full h-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${sh.occupancy >= sh.capacity ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${sh.occupancy/sh.capacity*100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      sh.status === 'OPEN' ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-700 border border-rose-500/20'
                    }`}>
                      {sh.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

        </div>

        {/* Right Side: Map & Blocked Roads overlays (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-300/30">
            <MapPlaceholder
              markers={markers}
              routes={mapRoutes}
              heightClass="h-[390px]"
              title="Civil Evacuation Vector routing overlay"
            />
          </div>

          {/* Blocked roads list */}
          <GlassCard title="Emergency Road Blockages & Closures" subtitle="Traffic incident locks" tint="slate">
            <div className="grid md:grid-cols-3 gap-3">
              {roads.map((rd) => (
                <div key={rd.id} className="p-3 bg-white/60 border border-white/50 rounded-xl text-xs text-left">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-extrabold text-slate-800 leading-tight block">{rd.roadName}</span>
                  </div>
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase mb-2 ${
                    rd.status === 'CLOSED' ? 'bg-rose-500/10 text-rose-700 border border-rose-500/20 animate-pulse' : 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                  }`}>
                    {rd.status}
                  </span>
                  {rd.reason && <p className="text-[10px] text-slate-500 leading-normal">{rd.reason}</p>}
                </div>
              ))}
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};
export default Evacuation;
