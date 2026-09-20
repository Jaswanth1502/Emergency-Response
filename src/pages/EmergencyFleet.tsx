import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Users,
  Building2,
  Radio,
  X,
  Eye
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DeployResourceDialog } from '../components/dialogs/DeployResourceDialog';

export const EmergencyFleet: React.FC = () => {
  const { resources, setResources, addNotification } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  
  // Modals state
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const [telemetryUnit, setTelemetryUnit] = useState<any | null>(null);

  const filtered = resources.filter(res => {
    const matchesSearch = searchTerm === '' ||
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ((res as any).location && (res as any).location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (typeFilter === 'ALL') return matchesSearch;
    if (typeFilter === 'FIRE') return matchesSearch && (res.id.includes('FIRE') || (res as any).type === 'FIRE_ENGINE' || (res.type as string) === 'FIRE_STATION');
    if (typeFilter === 'MEDICAL') return matchesSearch && (res.id.includes('AMB') || res.id.includes('MED') || (res as any).type === 'AMBULANCE' || (res.type as string) === 'HOSPITAL');
    if (typeFilter === 'RESCUE') return matchesSearch && (res.id.includes('RSC') || res.id.includes('DRN') || res.id.includes('SAR') || (res as any).type === 'RESCUE_BOAT' || (res as any).type === 'HAZMAT_UNIT' || (res.type as string) === 'RESCUE_TEAM');
    if (typeFilter === 'POLICE') return matchesSearch && (res.id.includes('POL') || (res as any).type === 'POLICE_CRUISER' || (res.type as string) === 'POLICE_UNIT');
    return matchesSearch;
  });

  const handleOpenDeploy = (unitId: string) => {
    setSelectedResourceId(unitId);
    setIsDeployOpen(true);
  };

  const handleRecall = (unit: any) => {
    setResources(prev => prev.map(r => {
      if (r.id === unit.id) {
        return {
          ...r,
          status: 'AVAILABLE',
          capacityLabel: 'Ready for dispatch'
        };
      }
      return r;
    }));
    addNotification(`FLEET RECALL: ${unit.name} recalled back to base station (${(unit as any).base || 'Central Depot'}).`, 'info');
  };

  return (
    <div className="space-y-4 text-left font-sans select-none">
      
      {/* Header & Filter Bar (Apple Liquid Glassmorphism) */}
      <div className="liquid-glass-card p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Emergency Response Fleet
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-200">
              {resources.filter(r => r.status === 'AVAILABLE').length} / {resources.length} Standby Ready
            </span>
          </div>
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

      {/* Grid of Fleet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filtered.map(unit => {
          const isOnScene = unit.status === 'DEPLOYED' && ((unit as any).speed === 0 || unit.etaMinutes === 0);
          const isEnRoute = unit.status === 'DEPLOYED' && !isOnScene;
          const isAvailable = unit.status === 'AVAILABLE';

          return (
            <div
              key={unit.id}
              className="liquid-glass-card p-3.5 rounded-2xl space-y-2.5 hover:-translate-y-0.5 transition-all flex flex-col justify-between border-t-2 border-t-slate-200/50"
            >
              {/* Card Header: Unit ID + Status Badge */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 font-black uppercase tracking-wider">
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
                  {(unit as any).assignedIncident || (unit.status === 'AVAILABLE' ? 'None (Standby Ready)' : 'Active Tactical Dispatch')}
                </span>
              </div>

              {/* Bottom Fuel & Speed Telemetry + Interactive Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-white/60 text-[10px] font-mono text-slate-500">
                <button
                  onClick={() => setTelemetryUnit(unit)}
                  className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                  title="View Live GPS Telemetry"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  <span>{(unit as any).fuel || unit.capacityPercent || 88}%</span>
                </button>
                
                {isAvailable ? (
                  <button
                    onClick={() => handleOpenDeploy(unit.id)}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all shadow-2xs font-sans uppercase tracking-wider active:scale-95"
                  >
                    DISPATCH UNIT
                  </button>
                ) : (
                  <button
                    onClick={() => handleRecall(unit)}
                    className="px-2.5 py-1 bg-slate-700 hover:bg-rose-600 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all shadow-2xs font-sans uppercase tracking-wider active:scale-95"
                  >
                    RECALL TO BASE
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Tactical Resource Dispatch Modal */}
      {isDeployOpen && (
        <DeployResourceDialog
          isOpen={isDeployOpen}
          onClose={() => setIsDeployOpen(false)}
          selectedResourceId={selectedResourceId || undefined}
        />
      )}

      {/* Live Vehicle Telemetry & GPS Modal */}
      {telemetryUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">
                  LIVE TELEMETRY: {telemetryUnit.name}
                </h3>
              </div>
              <button
                onClick={() => setTelemetryUnit(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Unit ID</span>
                <span className="font-mono font-bold text-cyan-400 text-sm">{telemetryUnit.id}</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Deployment Status</span>
                <span className={`font-bold text-sm ${telemetryUnit.status === 'AVAILABLE' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {telemetryUnit.status}
                </span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">GPS Coordinates</span>
                <span className="font-mono text-slate-200">17.6868° N, 83.2185° E</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Telemetry Feed</span>
                <span className="text-emerald-400 font-extrabold">● 5G Encrypted Stream</span>
              </div>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-xs space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Mission Assignment</span>
              <p className="font-bold text-cyan-300">
                {(telemetryUnit as any).assignedIncident || (telemetryUnit.status === 'AVAILABLE' ? 'Standing by at Base station' : 'Emergency Task Force Allocation')}
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              {telemetryUnit.status === 'AVAILABLE' ? (
                <button
                  onClick={() => {
                    const unitId = telemetryUnit.id;
                    setTelemetryUnit(null);
                    handleOpenDeploy(unitId);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs cursor-pointer uppercase tracking-wider"
                >
                  DISPATCH UNIT
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleRecall(telemetryUnit);
                    setTelemetryUnit(null);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs cursor-pointer uppercase tracking-wider"
                >
                  RECALL TO BASE
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default EmergencyFleet;
