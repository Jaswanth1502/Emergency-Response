import React, { useState, useEffect, useRef } from 'react';
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
import L from 'leaflet';
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
    id: 'APDRF-1',
    type: 'State Command',
    title: 'APDRF State Emergency Center',
    subtitle: 'Vijayawada Central Command',
    status: 'Operational',
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

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupsRef = useRef<{
    cordons?: L.LayerGroup;
    hazards?: L.LayerGroup;
    fleet?: L.LayerGroup;
    hospitals?: L.LayerGroup;
  }>({});

  // Initialize OpenStreetMap Standard Tile Map centered over Central Andhra Pradesh (Statewide View)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center on Central Andhra Pradesh State (Snapchat Map Style State View)
      const map = L.map(mapContainerRef.current, {
        center: [15.9129, 79.7400],
        zoom: 7,
        zoomControl: false,
        attributionControl: true
      });

      // OpenStreetMap Standard Map Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Create Layer Groups
      const cordonsGroup = L.layerGroup().addTo(map);
      const hazardsGroup = L.layerGroup().addTo(map);
      const fleetGroup = L.layerGroup().addTo(map);
      const hospitalsGroup = L.layerGroup().addTo(map);

      layerGroupsRef.current = {
        cordons: cordonsGroup,
        hazards: hazardsGroup,
        fleet: fleetGroup,
        hospitals: hospitalsGroup
      };

      // 1. Statewide Hazard Cordons (Vijayawada, Tirupati, Vizag, Guntur, Kurnool, Nellore)
      // Vijayawada Gas Cordon
      L.circle([16.5062, 80.6480], {
        color: '#EF4444',
        fillColor: '#EF4444',
        fillOpacity: 0.2,
        radius: 12000,
        dashArray: '6, 6'
      }).addTo(cordonsGroup);

      // Tirupati Pilgrim Crowd Zone Cordon
      L.circle([13.6288, 79.4192], {
        color: '#F59E0B',
        fillColor: '#F59E0B',
        fillOpacity: 0.18,
        radius: 15000
      }).addTo(cordonsGroup);

      // Vizag IT Fire Cordon
      L.circle([17.7800, 83.3800], {
        color: '#EF4444',
        fillColor: '#EF4444',
        fillOpacity: 0.18,
        radius: 12000
      }).addTo(cordonsGroup);

      // Nellore Delta Surge Cordon
      L.circle([14.4426, 79.9865], {
        color: '#3B82F6',
        fillColor: '#3B82F6',
        fillOpacity: 0.18,
        radius: 14000
      }).addTo(cordonsGroup);

      // 2. Statewide Incident Markers (Snapchat Map Style)

      const createMarkerIcon = (bg: string, svgIcon: string) => L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer">
            <span class="absolute w-10 h-10 rounded-full ${bg}/30 animate-ping"></span>
            <div class="w-9 h-9 rounded-xl ${bg} text-white flex items-center justify-center shadow-xl border-2 border-white">
              ${svgIcon}
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const gasSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
      const fireSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`;
      const floodSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>`;

      // 1. Vijayawada Gas Fracture
      const m1 = L.marker([16.5062, 80.6480], { icon: createMarkerIcon('bg-rose-600', gasSvg) }).addTo(hazardsGroup);
      m1.on('click', () => {
        onSelectIncident?.('INC-2026-0891');
        setActivePopup({
          id: 'INC-2026-0891',
          type: 'Critical Gas Leak',
          title: 'Subterranean Pipeline Fracture (Vijayawada)',
          subtitle: 'Pandit Nehru Transit Concourse • 68% LEL',
          status: 'Critical Active',
          x: 52,
          y: 45
        });
      });

      // 2. Visakhapatnam IT SEZ Fire
      const m2 = L.marker([17.7800, 83.3800], { icon: createMarkerIcon('bg-rose-600', fireSvg) }).addTo(hazardsGroup);
      m2.on('click', () => {
        onSelectIncident?.('INC-2026-0892');
        setActivePopup({
          id: 'INC-2026-0892',
          type: 'Commercial Fire',
          title: 'Rushikonda IT SEZ Chemical Storage Fire',
          subtitle: 'Tech Tower 4 • 485°C Surge • Vizag',
          status: 'Critical Active',
          x: 75,
          y: 25
        });
      });

      // 3. Tirupati Pilgrim Crowd Surge
      const m3 = L.marker([13.6288, 79.4192], { icon: createMarkerIcon('bg-amber-500', gasSvg) }).addTo(hazardsGroup);
      m3.on('click', () => {
        onSelectIncident?.('INC-2026-0893');
        setActivePopup({
          id: 'INC-2026-0893',
          type: 'Crowd Emergency',
          title: 'Alipiri Complex Gate 3 Crowd Surge',
          subtitle: 'Tirupati Shrine Transit • 5.2 persons/m²',
          status: 'High Active',
          x: 42,
          y: 80
        });
      });

      // 4. Guntur Industrial Warehouse Fire
      const m4 = L.marker([16.3067, 80.4365], { icon: createMarkerIcon('bg-amber-500', fireSvg) }).addTo(hazardsGroup);
      m4.on('click', () => {
        onSelectIncident?.('INC-2026-0894');
        setActivePopup({
          id: 'INC-2026-0894',
          type: 'Industrial Fire',
          title: 'Mirchi Yard Cold Storage Fire',
          subtitle: 'Ammonia Leak • Guntur District AP',
          status: 'High Active',
          x: 50,
          y: 50
        });
      });

      // 5. Kurnool NH-44 Collision
      const m5 = L.marker([15.8281, 78.0373], { icon: createMarkerIcon('bg-rose-600', gasSvg) }).addTo(hazardsGroup);
      m5.on('click', () => {
        onSelectIncident?.('INC-2026-0895');
        setActivePopup({
          id: 'INC-2026-0895',
          type: 'Highway HazMat Spill',
          title: 'NH-44 Chemical Tanker Collision',
          subtitle: 'Expressway Flyover Junction • Kurnool AP',
          status: 'High Active',
          x: 25,
          y: 55
        });
      });

      // 6. Kakinada Offshore Gas Leak
      const m6 = L.marker([16.9891, 82.2475], { icon: createMarkerIcon('bg-amber-500', gasSvg) }).addTo(hazardsGroup);
      m6.on('click', () => {
        onSelectIncident?.('INC-2026-0896');
        setActivePopup({
          id: 'INC-2026-0896',
          type: 'Offshore Gas Spike',
          title: 'Deepwater Petrochemical Valve Rupture',
          subtitle: 'Kakinada Port Marine Basin AP',
          status: 'Active',
          x: 68,
          y: 35
        });
      });

      // 7. Nellore Delta Flood
      const m7 = L.marker([14.4426, 79.9865], { icon: createMarkerIcon('bg-blue-600', floodSvg) }).addTo(hazardsGroup);
      m7.on('click', () => {
        onSelectIncident?.('INC-2026-0897');
        setActivePopup({
          id: 'INC-2026-0897',
          type: 'Coastal Inundation',
          title: 'Pennar River Delta Storm Surge',
          subtitle: 'Tidal Breach • Nellore Coastal AP',
          status: 'High Active',
          x: 48,
          y: 72
        });
      });

      // 8. Anantapur Solar Park Grid Fire
      const m8 = L.marker([14.6819, 77.6006], { icon: createMarkerIcon('bg-amber-500', fireSvg) }).addTo(hazardsGroup);
      m8.on('click', () => {
        onSelectIncident?.('INC-2026-0898');
        setActivePopup({
          id: 'INC-2026-0898',
          type: 'Grid Transformer Fire',
          title: 'NP Kunta Solar Park Substation Fire',
          subtitle: '400kV Grid Surge • Anantapur AP',
          status: 'Dispatched',
          x: 20,
          y: 70
        });
      });

      // 3. AP State Response Polylines (Connecting AP Hubs)
      L.polyline([
        [16.5062, 80.6480], // Vijayawada
        [16.3067, 80.4365]  // Guntur
      ], { color: '#2563EB', weight: 4, opacity: 0.85 }).addTo(fleetGroup);

      L.polyline([
        [16.5062, 80.6480], // Vijayawada
        [17.7800, 83.3800]  // Vizag
      ], { color: '#F58220', weight: 3, dashArray: '8, 8', opacity: 0.85 }).addTo(fleetGroup);

      // 4. Hospitals Layer (AP Major Government & Regional Super Speciality Hospitals)
      const hospitalIcon = (name: string) => L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="px-2 py-1 bg-blue-600 border-2 border-white text-white rounded-lg shadow-lg flex items-center space-x-1 cursor-pointer font-extrabold text-[11px]">
            <span>H</span>
            <span>${name}</span>
          </div>
        `,
        iconSize: [110, 26],
        iconAnchor: [55, 13]
      });

      // GGH Vijayawada
      const h1 = L.marker([16.5120, 80.6400], { icon: hospitalIcon('GGH Vijayawada') }).addTo(hospitalsGroup);
      h1.on('click', () => setActivePopup({
        id: 'H1',
        type: 'State Hospital',
        title: 'Government General Hospital (GGH Vijayawada)',
        subtitle: 'Surge Ready: 120 Trauma beds • AP',
        status: 'Online',
        x: 52,
        y: 44
      }));

      // SVIMS Tirupati
      const h2 = L.marker([13.6380, 79.4080], { icon: hospitalIcon('SVIMS Tirupati') }).addTo(hospitalsGroup);
      h2.on('click', () => setActivePopup({
        id: 'H2',
        type: 'State Hospital',
        title: 'SVIMS Super Speciality Hospital Tirupati',
        subtitle: 'Mass Casualty Unit Ready • AP',
        status: 'Online',
        x: 42,
        y: 78
      }));

      // KGH Visakhapatnam
      const h3 = L.marker([17.7020, 83.3020], { icon: hospitalIcon('KGH Vizag') }).addTo(hospitalsGroup);
      h3.on('click', () => setActivePopup({
        id: 'H3',
        type: 'State Hospital',
        title: 'King George Hospital (KGH Vizag)',
        subtitle: 'Emergency Burn Unit Active • AP',
        status: 'Online',
        x: 74,
        y: 26
      }));

      mapInstanceRef.current = map;
    }

    if (viewMode === '2D' && mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 150);
    }
  }, [viewMode]);

  // Sync Layers visibility
  useEffect(() => {
    const { cordons, hazards, fleet, hospitals } = layerGroupsRef.current;
    const map = mapInstanceRef.current;
    if (!map) return;

    if (cordons) {
      if (layers.cordons) map.addLayer(cordons); else map.removeLayer(cordons);
    }
    if (hazards) {
      if (layers.hazards) map.addLayer(hazards); else map.removeLayer(hazards);
    }
    if (fleet) {
      if (layers.fleet) map.addLayer(fleet); else map.removeLayer(fleet);
    }
    if (hospitals) {
      if (layers.hospitals) map.addLayer(hospitals); else map.removeLayer(hospitals);
    }
  }, [layers]);

  // Clean up map instance on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden bg-[#090d16] border border-slate-800/80 shadow-xs ${heightClass} select-none font-sans`}>
      
      {/* Top Map Action Toolbar Overlay */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-30 flex items-center justify-between pointer-events-none">
        
        {/* View Switchers */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <div className="bg-slate-900/90 backdrop-blur-md p-0.5 rounded-xl border border-white/10 shadow-lg flex items-center space-x-1">
            <button
              onClick={() => onViewModeChange?.('2D')}
              className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                viewMode === '2D'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Snapchat Map Style: Andhra Pradesh State
            </button>
            <button
              onClick={() => onViewModeChange?.('3D')}
              className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                viewMode === '3D'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Digital Twin
            </button>
          </div>

          {/* Layer Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setLayersOpen(!layersOpen)}
              className="px-2.5 py-1.5 bg-slate-900/90 backdrop-blur-md hover:bg-slate-800 border border-white/10 text-slate-200 font-bold text-xs rounded-xl shadow-lg flex items-center space-x-1.5 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Layers</span>
            </button>

            {layersOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl p-3 z-40 space-y-2 text-left animate-in fade-in">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-white/10 pb-1">GIS Map Layers</p>
                {Object.entries(layers).map(([key, val]) => (
                  <label key={key} className="flex items-center justify-between text-xs text-slate-200 cursor-pointer">
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

        {/* Right Status Indicator & OpenStreetMap Badge */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <div className="px-2.5 py-1 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl shadow-lg flex items-center space-x-2 text-[11px] font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Statewide AP Feed</span>
          </div>
          <button
            onClick={() => onViewModeChange?.(viewMode === '2D' ? '3D' : '2D')}
            className="p-1.5 bg-slate-900/90 backdrop-blur-md hover:bg-slate-800 border border-white/10 rounded-xl text-slate-200 shadow-lg cursor-pointer"
            title="Toggle View Mode"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 2D OPENSTREETMAP TACTICAL GIS MAP CONTAINER */}
      <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${viewMode === '2D' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
        {/* Leaflet OSM Container */}
        <div ref={mapContainerRef} className="w-full h-full bg-[#090d16]" />

        {/* Interactive Tactical Tooltip Popup */}
        <AnimatePresence>
          {activePopup && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute z-30 top-16 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-2xl text-left max-w-xs pointer-events-auto text-white"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider">
                    {activePopup.type} • {activePopup.status}
                  </span>
                </div>
                <button
                  onClick={() => setActivePopup(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <h4 className="font-extrabold text-white text-xs tracking-tight">
                {activePopup.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {activePopup.subtitle}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-col space-y-1">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-lg bg-slate-900/90 border border-white/10 text-white flex items-center justify-center font-bold text-sm hover:bg-slate-800 cursor-pointer shadow-lg"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-lg bg-slate-900/90 border border-white/10 text-white flex items-center justify-center font-bold text-sm hover:bg-slate-800 cursor-pointer shadow-lg"
          >
            −
          </button>
        </div>
      </div>

      {/* 3D WEBGL GEOSPATIAL BLUEPRINT CITY VIEWPORT CONTAINER */}
      <div className={`absolute inset-0 w-full h-full bg-[#090d16] overflow-hidden transition-opacity duration-300 ${viewMode === '3D' ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
        <ThreeGeospatialMap
          activeIncidentId={selectedIncidentId || 'INC-2026-0891'}
          onFocusIncident={onSelectIncident}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
      </div>

    </div>
  );
};

export default TacticalGisMap;
