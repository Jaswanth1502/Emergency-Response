import React from 'react';
import { Layers, CheckSquare, Square } from 'lucide-react';
import { MapLayerState } from '../../types/digitalTwin';

interface EmergencyLegendProps {
  layers: MapLayerState;
  onToggleLayer: (layerKey: keyof MapLayerState) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const EmergencyLegend: React.FC<EmergencyLegendProps> = ({
  layers,
  onToggleLayer
}) => {
  const layerItems: { key: keyof MapLayerState; label: string; icon: string; color: string }[] = [
    { key: 'buildings3D', label: '3D Buildings', icon: '🏢', color: 'text-slate-200' },
    { key: 'terrain', label: 'Terrain', icon: '⛰️', color: 'text-emerald-300' },
    { key: 'incidents', label: 'Incidents', icon: '🔥', color: 'text-rose-400' },
    { key: 'dangerZones', label: 'Danger Zones', icon: '🔴', color: 'text-amber-400' },
    { key: 'safeZones', label: 'Safe Zones', icon: '🟢', color: 'text-emerald-400' },
    { key: 'ambulances', label: 'Ambulances', icon: '🚑', color: 'text-cyan-400' },
    { key: 'fireRescue', label: 'Fire & Rescue', icon: '🚒', color: 'text-red-400' },
    { key: 'police', label: 'Police Units', icon: '🚓', color: 'text-blue-400' },
    { key: 'hospitals', label: 'Hospitals', icon: '🏥', color: 'text-emerald-300' },
    { key: 'iotSensors', label: 'IoT Sensors', icon: '📡', color: 'text-purple-400' },
    { key: 'evacuationRoutes', label: 'Evacuation Routes', icon: '🛣️', color: 'text-amber-300' },
    { key: 'rescueRoutes', label: 'Rescue Routes', icon: '⚡', color: 'text-cyan-300' },
    { key: 'blockedRoads', label: 'Blocked Roads', icon: '⛔', color: 'text-rose-500' }
  ];

  return (
    <div className="bg-slate-900/95 backdrop-blur-xl border border-white/15 rounded-2xl p-3 shadow-2xl text-left max-w-xs text-white select-none font-sans">
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-black uppercase tracking-wider">3D Map Layers</span>
        </div>
        <span className="text-[9px] font-mono text-slate-400">MapLibre 3D</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto pr-1">
        {layerItems.map(item => {
          const isEnabled = layers[item.key];
          return (
            <button
              key={item.key}
              onClick={() => onToggleLayer(item.key)}
              className={`flex items-center space-x-1.5 px-2 py-1 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                isEnabled
                  ? 'bg-slate-800 border-cyan-500/60 text-white shadow-xs'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              <span>{item.icon}</span>
              <span className="truncate flex-1 text-left">{item.label}</span>
              {isEnabled ? (
                <CheckSquare className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              ) : (
                <Square className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
