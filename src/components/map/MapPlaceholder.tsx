import React, { useState, useEffect, useRef } from 'react';
import { Compass, Shield, ZoomIn, ZoomOut, Activity, Zap, MapPin } from 'lucide-react';
import L from 'leaflet';
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
  center = { lat: 15.9129, lng: 79.7400 },
  zoom = 7.5,
  interactive = true,
  onMarkerClick,
  title = "OpenStreetMap Tactical GIS View",
  heightClass = "h-[450px]"
}) => {
  const [activeLayers, setActiveLayers] = useState({
    hazards: true,
    resources: true,
    routes: true,
    sensors: true
  });
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const layerGroupsRef = useRef<{
    hazards?: L.LayerGroup;
    routes?: L.LayerGroup;
    markers?: L.LayerGroup;
  }>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [center.lat, center.lng],
        zoom: zoom,
        zoomControl: false,
        attributionControl: true
      });

      // OpenStreetMap Standard Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
      }).addTo(map);

      const hazardsGroup = L.layerGroup().addTo(map);
      const routesGroup = L.layerGroup().addTo(map);
      const markersGroup = L.layerGroup().addTo(map);

      layerGroupsRef.current = {
        hazards: hazardsGroup,
        routes: routesGroup,
        markers: markersGroup
      };

      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    } else {
      mapInstanceRef.current.setView([center.lat, center.lng], zoom);
    }
  }, [center.lat, center.lng, zoom]);

  // Sync Layers & Render Data
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const { hazards, routes: routesGroup, markers: markersGroup } = layerGroupsRef.current;

    // 1. Render Hazard Zones
    if (hazards) {
      hazards.clearLayers();
      if (activeLayers.hazards) {
        zones.forEach(zone => {
          let color = "#ef4444";
          if (zone.tint === 'emerald') color = "#10b981";
          if (zone.tint === 'amber') color = "#f59e0b";
          if (zone.tint === 'cyan') color = "#06b6d4";

          L.circle([zone.center.lat, zone.center.lng], {
            color: color,
            fillColor: color,
            fillOpacity: 0.15,
            radius: zone.radiusMeter,
            dashArray: '5, 5'
          }).bindPopup(`<b>${zone.label}</b><br/>Radius: ${zone.radiusMeter}m`).addTo(hazards);
        });
      }
    }

    // 2. Render Routes
    if (routesGroup) {
      routesGroup.clearLayers();
      if (activeLayers.routes) {
        routes.forEach(route => {
          if (route.points.length < 2) return;
          const latLngs: [number, number][] = route.points.map(pt => [pt.lat, pt.lng]);

          let color = "#10b981";
          if (route.congestion === 'MODERATE') color = "#f59e0b";
          if (route.congestion === 'HEAVY') color = "#ef4444";
          if (route.congestion === 'BLOCKED') color = "#64748b";

          const polyline = L.polyline(latLngs, {
            color: color,
            weight: route.congestion === 'BLOCKED' ? 3 : 5,
            dashArray: route.congestion === 'HEAVY' ? '8, 8' : undefined,
            opacity: 0.85
          }).addTo(routesGroup);

          polyline.on('click', () => {
            setSelectedPoint(`Route: ${route.name} (${route.congestion} Congestion)`);
          });
        });
      }
    }

    // 3. Render Markers
    if (markersGroup) {
      markersGroup.clearLayers();
      if (activeLayers.resources) {
        markers.forEach(marker => {
          let colorBg = "bg-slate-600";
          if (marker.severity === 'CRITICAL') colorBg = "bg-rose-600";
          else if (marker.severity === 'HIGH') colorBg = "bg-amber-500";
          else if (marker.severity === 'MEDIUM') colorBg = "bg-indigo-600";
          else if (marker.severity === 'LOW') colorBg = "bg-emerald-600";

          const divIcon = L.divIcon({
            className: 'custom-leaflet-marker',
            html: `
              <div class="px-2 py-1 ${colorBg} text-white border-2 border-white rounded-lg shadow-lg flex items-center space-x-1 cursor-pointer font-bold text-[10px]">
                <span>${marker.label}</span>
              </div>
            `,
            iconSize: [80, 24],
            iconAnchor: [40, 12]
          });

          const m = L.marker([marker.lat, marker.lng], { icon: divIcon }).addTo(markersGroup);
          m.on('click', () => {
            setSelectedPoint(`${marker.type}: ${marker.label}`);
            if (onMarkerClick) onMarkerClick(marker.id);
          });
        });
      }
    }
  }, [markers, zones, routes, activeLayers]);

  // Clean up
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-300/40 shadow-xl bg-slate-900 ${heightClass}`}>
      {/* Leaflet OSM Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Header Overlay (Chrome UI) */}
      <div className="absolute top-4 left-4 p-3 bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/10 text-white shadow-lg pointer-events-auto z-20">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">{title}</h4>
            <p className="text-[10px] text-slate-400 tabular-nums">OSM Center: {center.lat.toFixed(4)}°N, {center.lng.toFixed(4)}°W</p>
          </div>
        </div>
      </div>

      {/* Layer Toggle Floating Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 pointer-events-auto z-20">
        <div className="p-2 bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/10 flex flex-col space-y-1.5">
          <button
            onClick={() => setActiveLayers(p => ({ ...p, hazards: !p.hazards }))}
            className={`p-1.5 rounded text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer ${activeLayers.hazards ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 hover:text-white'}`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="text-[10px]">Hazard Zones</span>
          </button>
          <button
            onClick={() => setActiveLayers(p => ({ ...p, routes: !p.routes }))}
            className={`p-1.5 rounded text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer ${activeLayers.routes ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-white'}`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="text-[10px]">Evac Corridors</span>
          </button>
          <button
            onClick={() => setActiveLayers(p => ({ ...p, resources: !p.resources }))}
            className={`p-1.5 rounded text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer ${activeLayers.resources ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:text-white'}`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-[10px]">Tactical Pins</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="p-1 bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/10 flex flex-col items-center">
          <button onClick={handleZoomIn} className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer" title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="h-[1px] w-4 bg-white/10" />
          <button onClick={handleZoomOut} className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer" title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selected Feature Info Box (Bottom) */}
      {selectedPoint && (
        <div className="absolute bottom-4 left-4 right-4 p-2.5 bg-slate-950/90 backdrop-blur-md rounded-xl border border-white/15 text-white text-xs flex items-center justify-between shadow-2xl z-20 pointer-events-auto">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span><strong className="text-slate-400">Selected GIS Target:</strong> {selectedPoint}</span>
          </div>
          <button onClick={() => setSelectedPoint(null)} className="text-[10px] text-slate-400 hover:text-white uppercase font-bold px-1.5 py-0.5 rounded bg-white/10 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 right-4 p-2 bg-slate-900/95 backdrop-blur-md rounded-lg border border-white/10 text-[9px] text-slate-400 flex flex-col space-y-1 z-10">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>OpenStreetMap Tile Layer</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-0.5 bg-emerald-500 inline-block" />
          <span>Evac Route Polyline</span>
        </div>
      </div>
    </div>
  );
};
export default MapPlaceholder;
