import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, Map as MapIcon, Globe2 } from 'lucide-react';
import { MapLayerState } from '../../types/digitalTwin';

interface EmergencyLegendProps {
  layers: MapLayerState;
  onToggleLayer: (layerKey: keyof MapLayerState) => void;
  mapMode?: 'NORMAL' | 'SATELLITE';
  onMapModeChange?: (mode: 'NORMAL' | 'SATELLITE') => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const EmergencyLegend: React.FC<EmergencyLegendProps> = ({
  layers,
  onToggleLayer,
  mapMode = 'NORMAL',
  onMapModeChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const layerItems: { key: keyof MapLayerState; label: string; icon: string }[] = [
    { key: 'buildings3D', label: '3D Buildings', icon: '🏢' },
    { key: 'terrain', label: 'Terrain', icon: '⛰️' },
    { key: 'incidents', label: 'Incidents', icon: '🔥' },
    { key: 'dangerZones', label: 'Danger Zones', icon: '🔴' },
    { key: 'safeZones', label: 'Safe Zones', icon: '🟢' },
    { key: 'ambulances', label: 'Ambulances', icon: '🚑' },
    { key: 'fireRescue', label: 'Fire & Rescue', icon: '🚒' },
    { key: 'police', label: 'Police Units', icon: '🚓' },
    { key: 'hospitals', label: 'Hospitals', icon: '🏥' },
    { key: 'iotSensors', label: 'IoT Sensors', icon: '📡' },
    { key: 'evacuationRoutes', label: 'Evacuation Routes', icon: '🛣️' },
    { key: 'rescueRoutes', label: 'Rescue Routes', icon: '⚡' },
    { key: 'blockedRoads', label: 'Blocked Roads', icon: '⛔' }
  ];

  const activeCount = Object.values(layers).filter(Boolean).length;

  return (
    <div className="w-[280px] bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl text-left text-white select-none font-sans overflow-hidden transition-all duration-300">
      
      {/* Dropdown Header Bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 hover:bg-slate-800/90 transition-colors cursor-pointer"
      >
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-extrabold tracking-wide">Map Layers</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            {activeCount} Active
          </span>
        </div>
        <div className="text-slate-400 flex items-center space-x-1">
          {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {/* Collapsible Dropdown Content Section */}
      {isOpen && (
        <div className="p-3.5 space-y-3">
          
          {/* Map View Mode Switcher (Normal vs Satellite) */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
              Map View Mode
            </span>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => onMapModeChange?.('NORMAL')}
                className={`flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  mapMode === 'NORMAL'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Normal</span>
              </button>
              
              <button
                type="button"
                onClick={() => onMapModeChange?.('SATELLITE')}
                className={`flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  mapMode === 'SATELLITE'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>Satellite</span>
              </button>
            </div>
          </div>

          {/* Layer Items Checklist */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
              Toggle Feature Layers
            </span>
            <div className="grid grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1">
              {layerItems.map(item => {
                const isEnabled = layers[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onToggleLayer(item.key)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                      isEnabled
                        ? 'bg-slate-800/90 border-slate-700 text-white shadow-xs'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 min-w-0 pr-1">
                      <span className="text-xs">{item.icon}</span>
                      <span className="text-[10px] font-bold text-slate-200 leading-tight whitespace-nowrap">{item.label}</span>
                    </div>

                    {/* Clean iOS Toggle Switch */}
                    <div className={`w-7 h-4 rounded-full transition-colors flex items-center p-0.5 flex-shrink-0 ${
                      isEnabled ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
                    }`}>
                      <span className="w-3 h-3 rounded-full bg-white shadow-xs block" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};


