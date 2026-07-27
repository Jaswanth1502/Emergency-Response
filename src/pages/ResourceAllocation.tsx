import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/common/GlassCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { DeployResourceDialog } from '../components/dialogs/DeployResourceDialog';
import { Search, MapPin, Phone, Truck } from 'lucide-react';

export const ResourceAllocation: React.FC = () => {
  const { resources, incidents } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [deployOpen, setDeployOpen] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('');

  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(search.toLowerCase()) ||
                          res.id.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || res.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleDeployClick = (incidentId: string) => {
    setSelectedIncidentId(incidentId);
    setDeployOpen(true);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-300/25 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Emergency Resource Allocation</h2>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Dashboard / Tactical Agency Dispatch Hub</p>
        </div>
        <button
          onClick={() => {
            if (activeIncidents.length > 0) {
              setSelectedIncidentId(activeIncidents[0].id);
            }
            setDeployOpen(true);
          }}
          className="mt-3 sm:mt-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
        >
          <Truck className="w-4.5 h-4.5" />
          <span>Quick Dispatch Resource</span>
        </button>
      </div>

      {/* Toolbar filters */}
      <GlassCard tint="slate">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search resource name, bases, or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/70 border border-slate-300/50 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
            />
          </div>

          <div className="flex gap-3 w-full lg:w-auto">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-white/70 border border-slate-300/50 rounded-xl text-xs font-bold text-slate-700 focus:outline-none w-full lg:w-auto"
            >
              <option value="ALL">All Categories</option>
              <option value="HOSPITAL">Hospitals</option>
              <option value="FIRE_STATION">Fire Stations</option>
              <option value="POLICE_UNIT">Police Fleet</option>
              <option value="RESCUE_TEAM">Rescue Specialists</option>
            </select>
          </div>

        </div>
      </GlassCard>

      {/* Resource Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => {
          let cardTint = 'slate' as any;
          if (res.type === 'HOSPITAL') cardTint = 'cyan';
          if (res.type === 'FIRE_STATION') cardTint = 'rose';
          if (res.type === 'POLICE_UNIT') cardTint = 'amber';
          if (res.type === 'RESCUE_TEAM') cardTint = 'emerald';

          return (
            <GlassCard
              key={res.id}
              title={res.name}
              subtitle={res.id}
              tint={cardTint}
              actions={<StatusBadge status={res.status} />}
            >
              <div className="space-y-4 text-left mt-1 flex-1 flex flex-col justify-between">
                
                {/* Stats & Capacity slider bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] font-bold text-slate-500">
                    <span>CAPACITY UTILIZATION:</span>
                    <span>{res.capacityLabel}</span>
                  </div>
                  <div className="w-full bg-slate-300/30 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${res.capacityPercent > 85 ? 'bg-rose-500' : 'bg-cyan-500'}`}
                      style={{ width: `${res.capacityPercent}%` }}
                    />
                  </div>
                </div>

                {/* Logistics */}
                <div className="grid grid-cols-2 gap-3 text-xs border-y border-slate-300/10 py-3 my-2 font-medium text-slate-600">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{res.distanceKm} km away</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{res.contactNumber}</span>
                  </div>
                </div>

                {/* Dispatch direct action trigger */}
                {res.status === 'AVAILABLE' ? (
                  <div className="pt-2 flex items-center justify-between gap-2">
                    <select
                      onChange={e => handleDeployClick(e.target.value)}
                      defaultValue=""
                      className="flex-1 px-2.5 py-1.5 bg-white/70 border border-slate-300/50 rounded-lg text-[10px] uppercase font-black text-slate-600 focus:outline-none"
                    >
                      <option value="" disabled>-- Deploy unit to --</option>
                      {activeIncidents.map(inc => (
                        <option key={inc.id} value={inc.id}>
                          [{inc.id}] {inc.title.substring(0, 20)}...
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="pt-2 flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase">
                    <span>Active deployment</span>
                    <span>ETA: {res.etaMinutes}m</span>
                  </div>
                )}

              </div>
            </GlassCard>
          );
        })}

        {filteredResources.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 font-semibold">
            No emergency resources fit the current filter.
          </div>
        )}
      </div>

      <DeployResourceDialog
        isOpen={deployOpen}
        onClose={() => setDeployOpen(false)}
        selectedIncidentId={selectedIncidentId}
      />

    </div>
  );
};
export default ResourceAllocation;
