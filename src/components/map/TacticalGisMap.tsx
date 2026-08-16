import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Droplets,
  AlertTriangle,
  Building2,
  Navigation,
  X,
  Layers,
  Maximize2,
  Minimize2,
  Shield,
  Activity,
  Box
} from 'lucide-react';
import { ThreeGeospatialMap } from './ThreeGeospatialMap';

interface TacticalGisMapProps {
  viewMode?: '2D' | '3D';
  onViewModeChange?: (mode: '2D' | '3D') => void;
  selectedIncidentId?: string | null;
  onSelectIncident?: (id: string) => void;
  heightClass?: string;
  isFullView?: boolean;
}

export const TacticalGisMap: React.FC<TacticalGisMapProps> = ({
  viewMode = '2D',
  onViewModeChange,
  selectedIncidentId,
  onSelectIncident,
  heightClass = 'h-[520px]',
  isFullView = false
}) => {
  const [activePopup, setActivePopup] = useState<{
    id: string;
    type: string;
    title: string;
    subtitle: string;
    status: string;
    x: number;
    y: number;
  } | null>({
    id: 'USAR-1',
    type: 'Rescue Team',
    title: 'Urban Search & Rescue (USAR) Task Force 1',
    subtitle: 'Mission Plaza West Stairwell',
    status: 'On Scene',
    x: 52,
    y: 50
  });

  const [layersOpen, setLayersOpen] = useState(false);
  const [layers, setLayers] = useState({
    hazards: true,
    fleet: true,
    hospitals: true,
    sensors: true,
    cordons: true
  });

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden bg-[#E8EDF2] border border-slate-200/80 shadow-xs ${heightClass} select-none font-sans`}>
      
      {/* Top Map Action Toolbar Overlay */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-none">
        
        {/* View Switchers */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-md p-0.5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-1">
            <button
              onClick={() => onViewModeChange?.('2D')}
              className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                viewMode === '2D'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2D Tactical GIS
            </button>
            <button
              onClick={() => onViewModeChange?.('3D')}
              className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                viewMode === '3D'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3D Digital Twin
            </button>
          </div>

          {/* Layer Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setLayersOpen(!layersOpen)}
              className="px-2.5 py-1.5 bg-white/90 backdrop-blur-md hover:bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Layers</span>
            </button>

            {layersOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-30 space-y-2 text-left animate-in fade-in">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b pb-1">GIS Map Layers</p>
                {Object.entries(layers).map(([key, val]) => (
                  <label key={key} className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                    <span className="capitalize">{key}</span>
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={e => setLayers({ ...layers, [key]: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-0"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Status Indicator */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <div className="px-2.5 py-1 bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl shadow-sm flex items-center space-x-2 text-[11px] font-bold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Live Sensor Mesh</span>
          </div>
          <button
            onClick={() => onViewModeChange?.(viewMode === '2D' ? '3D' : '2D')}
            className="p-1.5 bg-white/90 backdrop-blur-md hover:bg-white border border-slate-200 rounded-xl text-slate-700 shadow-sm cursor-pointer"
            title="Toggle View Mode"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {viewMode === '2D' ? (
        /* 2D SAN FRANCISCO TACTICAL GIS MAP */
        <div className="absolute inset-0 w-full h-full">
          
          {/* Base Cartography SVG (San Francisco Waterfront, Streets & Districts) */}
          <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
            
            {/* Background Land Surface */}
            <rect width="1000" height="600" fill="#E8EDF2" />

            {/* San Francisco Bay Water Polygon */}
            <path
              d="M 680 0 Q 720 180 810 320 T 1000 500 L 1000 0 Z"
              fill="#CADCE8"
              stroke="#B3C9DB"
              strokeWidth="2"
            />

            {/* Major Freeways & Arterials (Highway 101, I-80, Central Expressway) */}
            <g stroke="#CBD5E1" strokeWidth="4" fill="none" opacity="0.9">
              <path d="M 0 350 Q 250 340 450 380 T 750 480" />
              <path d="M 400 600 L 520 280 L 780 0" strokeWidth="6" stroke="#94A3B8" />
              <path d="M 200 0 L 220 600" />
              <path d="M 320 0 L 340 600" />
              <path d="M 480 0 L 500 600" />
              <path d="M 640 0 L 660 600" />
              <path d="M 0 120 L 700 120" />
              <path d="M 0 220 L 750 220" />
              <path d="M 0 450 L 800 450" />
            </g>

            {/* Detailed Street Grid Overlay */}
            <g stroke="#FFFFFF" strokeWidth="2.5" fill="none" opacity="0.85">
              <path d="M 0 60 L 700 60 M 0 180 L 750 180 M 0 280 L 800 280 M 0 380 L 850 380 M 0 520 L 900 520" />
              <path d="M 80 0 L 80 600 M 150 0 L 150 600 M 260 0 L 260 600 M 390 0 L 390 600 M 550 0 L 550 600 M 600 0 L 600 600" />
            </g>

            {/* City Watermark / Label */}
            <text x="500" y="310" textAnchor="middle" fill="#94A3B8" fontSize="22" fontWeight="800" letterSpacing="6" opacity="0.5">
              SAN FRANCISCO
            </text>

            {/* Cordon Risk Zone 1: Mission Financial Plaza (Red Incident Area) */}
            {layers.cordons && (
              <g>
                <circle cx="520" cy="420" r="110" fill="#EF4444" fillOpacity="0.12" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4,4" className="animate-pulse" />
                <circle cx="520" cy="420" r="50" fill="#EF4444" fillOpacity="0.25" stroke="#DC2626" strokeWidth="2" />
                
                {/* Secondary Flood Warning Cordon (Orange) */}
                <circle cx="610" cy="510" r="95" fill="#F59E0B" fillOpacity="0.12" stroke="#F59E0B" strokeWidth="1.5" />
                
                {/* Market St Gas Leak Cordon */}
                <circle cx="390" cy="530" r="75" fill="#EF4444" fillOpacity="0.14" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3,3" />
                <circle cx="390" cy="530" r="35" fill="#F59E0B" fillOpacity="0.2" stroke="#D97706" strokeWidth="1.5" />
              </g>
            )}

            {/* Dynamic Real-time Responding Route Polylines */}
            {layers.fleet && (
              <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* Blue Foam Carrier route line */}
                <path d="M 500 580 L 525 460 L 520 425" stroke="#2563EB" strokeWidth="4" />
                {/* Orange Ambulance Route */}
                <path d="M 380 540 Q 450 490 520 425" stroke="#F58220" strokeWidth="3" strokeDasharray="6,4" />
                {/* Green Evacuation Corridor Route */}
                <path d="M 520 425 L 505 340 L 480 300" stroke="#10B981" strokeWidth="4" />
              </g>
            )}

            {/* Hospital Markers [H] */}
            {layers.hospitals && (
              <g>
                {/* Hospital 1: SOMA General */}
                <g transform="translate(250, 400)" className="cursor-pointer" onClick={() => setActivePopup({ id: 'H1', type: 'Medical Center', title: 'SOMA General Trauma Center', subtitle: 'Surge Ready: 64 beds free', status: 'Online', x: 25, y: 66 })}>
                  <rect width="26" height="26" rx="6" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" shadow="md" />
                  <text x="13" y="18" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900">H</text>
                </g>
                {/* Hospital 2: Mission Bay Hospital */}
                <g transform="translate(500, 560)" className="cursor-pointer" onClick={() => setActivePopup({ id: 'H2', type: 'Medical Center', title: 'Mission Bay University Hospital', subtitle: 'Burn Unit Pre-alerted (H03)', status: 'Online', x: 50, y: 92 })}>
                  <rect width="26" height="26" rx="6" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
                  <text x="13" y="18" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900">H</text>
                </g>
                {/* Hospital 3: St. Francis Memorial */}
                <g transform="translate(430, 600)" className="cursor-pointer">
                  <rect width="24" height="24" rx="6" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
                  <text x="12" y="17" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="900">H</text>
                </g>
              </g>
            )}

          </svg>

          {/* Interactive HTML Tactical Entity Badges overlayed on coordinates */}
          
          {/* Incident 1: 450 Mission Financial Plaza (Fire) */}
          <div
            className="absolute top-[42%] left-[52%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            onClick={() => {
              onSelectIncident?.('INC-2026-0891');
              setActivePopup({
                id: 'INC-2026-0891',
                type: 'Critical Fire Incident',
                title: 'Multi-Story Commercial Fire (INC-2026-0891)',
                subtitle: '450 Mission Financial Plaza • 485°C Surge',
                status: 'Critical Active',
                x: 52,
                y: 42
              });
            }}
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute w-10 h-10 rounded-full bg-rose-500/30 animate-ping" />
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                <Flame className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Incident 2: Pier 28 Basin (Flood) */}
          <div
            className="absolute top-[51%] left-[61%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            onClick={() => {
              onSelectIncident?.('INC-2026-0892');
              setActivePopup({
                id: 'INC-2026-0892',
                type: 'Flood Incident',
                title: 'Flash Flood & Drainage Overflow',
                subtitle: 'Bayside Lowland Corridor, Pier 28 Basin',
                status: 'High Active',
                x: 61,
                y: 51
              });
            }}
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
              <Droplets className="w-4 h-4" />
            </div>
          </div>

          {/* Incident 3: 8th & Market (Gas Leak) */}
          <div
            className="absolute top-[53%] left-[39%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            onClick={() => {
              onSelectIncident?.('INC-2026-0893');
              setActivePopup({
                id: 'INC-2026-0893',
                type: 'Gas Leak Hazard',
                title: 'Seismic Rupture & Gas Fracture',
                subtitle: 'Metro Transit Hub, 8th & Market Intermodal Center',
                status: 'Critical Active',
                x: 39,
                y: 53
              });
            }}
          >
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          {/* USAR Tactical Unit Marker */}
          <div
            className="absolute top-[50%] left-[53%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            onClick={() => setActivePopup({
              id: 'USAR-1',
              type: 'Rescue Team',
              title: 'Urban Search & Rescue (USAR) Task Force 1',
              subtitle: 'Mission Plaza West Stairwell',
              status: 'On Scene',
              x: 53,
              y: 50
            })}
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md border-2 border-white text-xs">
              🚒
            </div>
          </div>

          {/* Interactive Tactical Tooltip Popup (matching Screenshot 5) */}
          <AnimatePresence>
            {activePopup && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute z-30 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-4 shadow-2xl text-left max-w-xs pointer-events-auto"
                style={{
                  top: `calc(${activePopup.y}% - 110px)`,
                  left: `calc(${activePopup.x}% - 120px)`
                }}
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                      {activePopup.type} • {activePopup.status}
                    </span>
                  </div>
                  <button
                    onClick={() => setActivePopup(null)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="font-extrabold text-slate-900 text-xs tracking-tight">
                  {activePopup.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {activePopup.subtitle}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Zoom In / Out Overlay buttons */}
          <div className="absolute bottom-4 right-4 z-20 flex flex-col space-y-1">
            <button className="w-8 h-8 rounded-lg bg-white shadow-md border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm hover:bg-slate-50">
              +
            </button>
            <button className="w-8 h-8 rounded-lg bg-white shadow-md border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm hover:bg-slate-50">
              −
            </button>
          </div>

        </div>
      ) : (
        /* 3D WEBGL GEOSPATIAL BLUEPRINT CITY VIEWPORT */
        <div className="absolute inset-0 w-full h-full bg-[#060C18] overflow-hidden">
          <ThreeGeospatialMap
            activeIncidentId={selectedIncidentId || 'INC-2026-0891'}
            onFocusIncident={onSelectIncident}
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />
        </div>
      )}

    </div>
  );
};
export default TacticalGisMap;
