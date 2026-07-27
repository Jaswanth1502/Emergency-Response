import React, { useState } from 'react';
import { MapPin, Compass, Shield, ZoomIn, ZoomOut, Activity, Zap } from 'lucide-react';
import { Coordinates } from '../../types/common';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  type: string;
}

interface MapZone {
  id: string;
  center: Coordinates;
  radiusMeter: number;
  tint: 'rose' | 'emerald' | 'amber' | 'cyan';
  label: string;
}

interface MapRoute {
  id: string;
  name: string;
  points: Coordinates[];
  congestion: 'CLEAR' | 'MODERATE' | 'HEAVY' | 'BLOCKED';
}

interface MapPlaceholderProps {
  markers?: MapMarker[];
  zones?: MapZone[];
  routes?: MapRoute[];
  center?: Coordinates;
  zoom?: number;
  interactive?: boolean;
  onMarkerClick?: (id: string) => void;
  title?: string;
  heightClass?: string;
}

export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({
  markers = [],
  zones = [],
  routes = [],
  center = { lat: 45.4150, "lng": -75.6900 },
  zoom = 14,
  interactive: _interactive = true,
  onMarkerClick,
  title = "GIS Live Tactical Vector Overlay",
  heightClass = "h-[450px]"
}) => {
  const [mapZoom, setMapZoom] = useState(zoom);
  const [activeLayers, setActiveLayers] = useState({
    hazards: true,
    resources: true,
    routes: true,
    sensors: true
  });
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);

  // Projection helper to convert lat/lng into SVG coordinates
  // Coordinates are roughly inside lat: 45.36 - 45.46, lng: -75.76 - -75.64
  const project = (lat: number, lng: number) => {
    const latMin = 45.36;
    const latMax = 45.46;
    const lngMin = -75.76;
    const lngMax = -75.64;

    // Scale to percentage coordinates (10% to 90% space)
    const x = 10 + ((lng - lngMin) / (lngMax - lngMin)) * 80;
    const y = 90 - ((lat - latMin) / (latMax - latMin)) * 80; // invert Y since SVG starts at top
    return { x, y };
  };

  const centerProj = project(center.lat, center.lng);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-300/40 shadow-xl bg-slate-900 ${heightClass}`}>
      {/* City Map Background Grid Layer */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
      
      {/* Decorative City Topography Contour Mock Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <path d="M 50 100 Q 150 150 250 100 T 450 100 T 650 150 T 850 100" fill="none" stroke="#38bdf8" strokeWidth="1" />
        <path d="M 50 250 Q 180 300 310 250 T 570 250 T 830 200" fill="none" stroke="#0ea5e9" strokeWidth="1" />
        <path d="M 100 400 Q 250 450 400 400 T 700 450" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
        {/* River outline mock */}
        <path d="M -50 200 Q 200 180 350 220 T 700 240 T 1100 210" fill="none" stroke="#06b6d4" strokeWidth="14" strokeLinecap="round" className="opacity-40 animate-pulse-slow" />
        <path d="M -50 200 Q 200 180 350 220 T 700 240 T 1100 210" fill="none" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" className="opacity-60" />
      </svg>

      {/* SVG Vector Elements */}
      <svg className="absolute inset-0 w-full h-full">
        {/* Render Evacuation Routes */}
        {activeLayers.routes && routes.map(route => {
          if (route.points.length < 2) return null;
          
          let dPath = "";
          route.points.forEach((pt, i) => {
            const { x, y } = project(pt.lat, pt.lng);
            if (i === 0) dPath += `M ${x} ${y}`;
            else dPath += ` L ${x} ${y}`;
          });

          let strokeColor = "#10b981"; // CLEAR
          if (route.congestion === 'MODERATE') strokeColor = "#f59e0b";
          if (route.congestion === 'HEAVY') strokeColor = "#ef4444";
          if (route.congestion === 'BLOCKED') strokeColor = "#64748b";

          return (
            <g key={route.id} className="cursor-pointer group">
              <path
                d={dPath}
                fill="none"
                stroke={strokeColor}
                strokeWidth={route.congestion === 'BLOCKED' ? "3" : "4"}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`opacity-70 group-hover:opacity-100 transition-opacity ${route.congestion === 'HEAVY' ? 'stroke-dasharray-5' : ''}`}
              />
              <path
                d={dPath}
                fill="none"
                stroke="#fff"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-0 group-hover:opacity-10 pointer-events-auto"
                onClick={() => setSelectedPoint(`Route: ${route.name} (${route.congestion} Congestion)`)}
              />
            </g>
          );
        })}

        {/* Render Hazard & Safe Zones */}
        {activeLayers.hazards && zones.map(zone => {
          const { x, y } = project(zone.center.lat, zone.center.lng);
          // Scale size according to zoom level
          const pixelRadius = (zone.radiusMeter / 10) * (mapZoom / 14);

          let color = "#ef4444"; // rose
          if (zone.tint === 'emerald') color = "#10b981";
          if (zone.tint === 'amber') color = "#f59e0b";
          if (zone.tint === 'cyan') color = "#06b6d4";

          return (
            <g key={zone.id} className="transition-all duration-500">
              {/* Core filled zone */}
              <circle
                cx={x}
                cy={y}
                r={pixelRadius}
                fill={color}
                fillOpacity="0.12"
                stroke={color}
                strokeWidth="1.5"
                strokeDasharray="4 3"
                className="animate-pulse-slow"
              />
              {/* Outer boundary rings */}
              <circle
                cx={x}
                cy={y}
                r={pixelRadius + 8}
                fill="none"
                stroke={color}
                strokeWidth="0.5"
                strokeOpacity="0.3"
              />
              {/* Label */}
              <text
                x={x}
                y={y - pixelRadius - 6}
                fill={color}
                fontSize="10"
                fontWeight="semibold"
                textAnchor="middle"
                className="select-none pointer-events-none drop-shadow-md"
              >
                {zone.label}
              </text>
            </g>
          );
        })}

        {/* Map Center Coordinate Pulse Indicator */}
        <g transform={`translate(${centerProj.x}, ${centerProj.y})`}>
          <circle cx="0" cy="0" r="12" fill="#06b6d4" fillOpacity="0.1" className="animate-ping" />
          <circle cx="0" cy="0" r="4" fill="#22d3ee" />
        </g>
      </svg>

      {/* Render Markers as Absolutes for absolute crisp hover interaction */}
      {activeLayers.resources && markers.map(marker => {
        const { x, y } = project(marker.lat, marker.lng);

        let pinColor = "text-slate-400";
        if (marker.severity === 'CRITICAL') pinColor = "text-rose-600 drop-shadow-[0_0_8px_rgba(225,29,72,0.8)]";
        else if (marker.severity === 'HIGH') pinColor = "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]";
        else if (marker.severity === 'MEDIUM') pinColor = "text-indigo-500";
        else if (marker.severity === 'LOW') pinColor = "text-emerald-500";

        return (
          <button
            key={marker.id}
            onClick={() => {
              setSelectedPoint(`${marker.type}: ${marker.label}`);
              if (onMarkerClick) onMarkerClick(marker.id);
            }}
            className="absolute transition-transform hover:scale-125 focus:outline-none group cursor-pointer"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -100%)' }}
          >
            <div className="relative">
              <MapPin className={`w-6 h-6 ${pinColor}`} fill="rgba(15,23,42,0.6)" />
              {/* Small glowing status dot */}
              <span className="absolute top-1.5 left-2 w-1.5 h-1.5 rounded-full bg-white block" />
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-slate-950/95 text-white text-[10px] px-2 py-1 rounded border border-white/20 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl z-50">
                <span className="font-bold block text-blue-400">{marker.id}</span>
                {marker.label}
              </div>
            </div>
          </button>
        );
      })}

      {/* Map Header Overlay (Chrome UI) */}
      <div className="absolute top-4 left-4 p-3 bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/10 text-white shadow-lg pointer-events-auto">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">{title}</h4>
            <p className="text-[10px] text-slate-400 tabular-nums">Center: {center.lat.toFixed(4)}°N, {center.lng.toFixed(4)}°W</p>
          </div>
        </div>
      </div>

      {/* Layer Toggle Floating Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 pointer-events-auto">
        <div className="p-2 bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/10 flex flex-col space-y-1.5">
          <button
            onClick={() => setActiveLayers(p => ({ ...p, hazards: !p.hazards }))}
            className={`p-1.5 rounded text-xs font-semibold flex items-center space-x-2 transition-colors ${activeLayers.hazards ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 hover:text-white'}`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="text-[10px]">Hazard Zones</span>
          </button>
          <button
            onClick={() => setActiveLayers(p => ({ ...p, routes: !p.routes }))}
            className={`p-1.5 rounded text-xs font-semibold flex items-center space-x-2 transition-colors ${activeLayers.routes ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-white'}`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="text-[10px]">Evac Corridors</span>
          </button>
          <button
            onClick={() => setActiveLayers(p => ({ ...p, resources: !p.resources }))}
            className={`p-1.5 rounded text-xs font-semibold flex items-center space-x-2 transition-colors ${activeLayers.resources ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-white'}`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-[10px]">Tactical Pins</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="p-1 bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/10 flex flex-col items-center">
          <button onClick={() => setMapZoom(z => Math.min(z + 1, 18))} className="p-1.5 text-slate-400 hover:text-white transition-colors" title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="h-[1px] w-4 bg-white/10" />
          <button onClick={() => setMapZoom(z => Math.max(z - 1, 10))} className="p-1.5 text-slate-400 hover:text-white transition-colors" title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selected Feature Info Box (Bottom) */}
      {selectedPoint && (
        <div className="absolute bottom-4 left-4 right-4 p-2.5 bg-slate-950/90 backdrop-blur-md rounded-xl border border-white/15 text-white text-xs flex items-center justify-between shadow-2xl animate-fade-in pointer-events-auto">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span><strong className="text-slate-400">Selected GIS Target:</strong> {selectedPoint}</span>
          </div>
          <button onClick={() => setSelectedPoint(null)} className="text-[10px] text-slate-400 hover:text-white uppercase font-bold px-1.5 py-0.5 rounded bg-white/10">
            Dismiss
          </button>
        </div>
      )}

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 right-4 p-2 bg-slate-900/95 backdrop-blur-md rounded-lg border border-white/10 text-[9px] text-slate-400 flex flex-col space-y-1">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>Critical Threat Incident</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>High Severity Threat</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-0.5 bg-emerald-500 inline-block" />
          <span>Clear Evac Corridor</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded bg-rose-500/10 border border-rose-500 border-dashed inline-block" />
          <span>EOC Threat Zone Buffer</span>
        </div>
      </div>
    </div>
  );
};
export default MapPlaceholder;
