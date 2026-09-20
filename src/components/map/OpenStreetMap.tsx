import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  AlertTriangle,
  Truck,
  Building2,
  Cpu,
  Radio,
  Layers,
  Maximize2,
  Minimize2,
  X,
  Compass,
  Zap,
  Activity,
  ShieldCheck,
  Check
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface OSMEntity {
  id: string;
  name: string;
  type: 'INCIDENT' | 'DANGER_ZONE' | 'AMBULANCE' | 'FIRE_TEAM' | 'HOSPITAL' | 'IOT_SENSOR';
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  lat: number;
  lng: number;
  details: string;
  status: string;
  metric?: string;
}

export const OSM_ENTITIES: OSMEntity[] = [
  // Incidents 🔥
  {
    id: 'INC-1',
    name: 'Rushikonda Commercial Fire',
    type: 'INCIDENT',
    severity: 'CRITICAL',
    lat: 17.7840,
    lng: 83.3850,
    details: '485°C thermal surge in sub-level B2 solvent storage. 6 units deployed.',
    status: 'Active Critical',
    metric: 'Risk: 94/100'
  },
  {
    id: 'INC-2',
    name: 'Vizag Port Gas Leak',
    type: 'INCIDENT',
    severity: 'CRITICAL',
    lat: 17.6850,
    lng: 83.2750,
    details: 'Subterranean gas pipeline fracture. Pressure spike 68% LEL.',
    status: 'Active Critical',
    metric: 'Risk: 91/100'
  },
  {
    id: 'INC-3',
    name: 'RK Beach Storm Surge Inundation',
    type: 'INCIDENT',
    severity: 'HIGH',
    lat: 17.7180,
    lng: 83.3220,
    details: 'Coastal flood breach affecting coastal evacuation corridor.',
    status: 'High Active',
    metric: 'Risk: 82/100'
  },

  // Danger Zones 🔴
  {
    id: 'DZ-1',
    name: 'Thermal Hazard Buffer Alpha',
    type: 'DANGER_ZONE',
    severity: 'CRITICAL',
    lat: 17.7840,
    lng: 83.3850,
    details: '1.2km radius chemical smoke fallout zone around IT Tower 4.',
    status: 'Evacuation Priority 1',
    metric: 'Radius: 1200m'
  },
  {
    id: 'DZ-2',
    name: 'Gas Plume Containment Zone',
    type: 'DANGER_ZONE',
    severity: 'CRITICAL',
    lat: 17.6850,
    lng: 83.2750,
    details: 'Pressurized volatile gas dispersal area. Sparks prohibited.',
    status: 'Cordon Sealed',
    metric: 'Radius: 800m'
  },

  // Ambulances 🚑
  {
    id: 'AMB-1',
    name: 'ALS Ambulance Unit A-01',
    type: 'AMBULANCE',
    lat: 17.7680,
    lng: 83.3650,
    details: 'En route to Rushikonda Fire. ETA 2 mins. Triage team aboard.',
    status: 'Dispatched (Rapid)',
    metric: 'Speed: 68 km/h'
  },
  {
    id: 'AMB-2',
    name: 'ALS Ambulance Unit A-05',
    type: 'AMBULANCE',
    lat: 17.7320,
    lng: 83.3100,
    details: 'Stationed at Beach Corridor staging area. 2 burn kits ready.',
    status: 'Available On-Scene',
    metric: 'Speed: 0 km/h'
  },
  {
    id: 'AMB-3',
    name: 'Trauma Transport Unit A-08',
    type: 'AMBULANCE',
    lat: 17.6980,
    lng: 83.3150,
    details: 'Transporting critical casualty to King George Hospital.',
    status: 'In Transit',
    metric: 'Speed: 75 km/h'
  },

  // Fire Teams 🚒
  {
    id: 'FIRE-1',
    name: 'Engine 14 Heavy Pumper',
    type: 'FIRE_TEAM',
    lat: 17.7950,
    lng: 83.3720,
    details: 'Active suppression on B2 level. High-volume foam cannon engaged.',
    status: 'Engaged On-Scene',
    metric: 'Water: 8,400L'
  },
  {
    id: 'FIRE-2',
    name: 'Foam Unit F-04 Carrier',
    type: 'FIRE_TEAM',
    lat: 17.7720,
    lng: 83.3980,
    details: 'Hydrocarbon foam concentrate injection unit deployed.',
    status: 'Operational',
    metric: 'Foam: 4,000L'
  },
  {
    id: 'FIRE-3',
    name: 'HazMat Specialist Team H-01',
    type: 'FIRE_TEAM',
    lat: 17.6680,
    lng: 83.2920,
    details: 'Pneumatic line sealing team operating at Vizag Port valve 4.',
    status: 'Sealing Fracture',
    metric: 'Pressure: 4.2 Bar'
  },

  // Hospitals 🏥
  {
    id: 'HOSP-1',
    name: 'King George Hospital (KGH)',
    type: 'HOSPITAL',
    lat: 17.7060,
    lng: 83.3000,
    details: 'Level 1 Trauma & Burn ICU. 64 ICU beds available.',
    status: 'Operational Surge Ready',
    metric: 'Beds Avail: 64'
  },
  {
    id: 'HOSP-2',
    name: 'Government General Hospital (GGH)',
    type: 'HOSPITAL',
    lat: 16.5120,
    lng: 80.6400,
    details: 'State Emergency Trauma Hub. Mass casualty protocol active.',
    status: 'Operational',
    metric: 'Beds Avail: 52'
  },
  {
    id: 'HOSP-3',
    name: 'SVIMS Super Speciality Center',
    type: 'HOSPITAL',
    lat: 13.6380,
    lng: 79.4080,
    details: 'Specialized Burn Unit & Cardiac Resuscitation Bay.',
    status: 'Operational',
    metric: 'Beds Avail: 30'
  },

  // IoT Sensors 📡
  {
    id: 'SENSOR-1',
    name: 'IoT Thermal Telemetry Node #408',
    type: 'IOT_SENSOR',
    lat: 17.8020,
    lng: 83.3800,
    details: 'Infrared sensor matrix B2. High thermal elevation alarm.',
    status: 'Alerting (485°C)',
    metric: 'Temp: 485°C'
  },
  {
    id: 'SENSOR-2',
    name: 'Gas Detector Mesh Node #112',
    type: 'IOT_SENSOR',
    lat: 17.6960,
    lng: 83.2620,
    details: 'Subsurface hydrocarbon sniffer mesh node.',
    status: 'Alerting (68% LEL)',
    metric: 'LEL: 68%'
  },
  {
    id: 'SENSOR-3',
    name: 'Coastal Water Level Hydro Sensor #89',
    type: 'IOT_SENSOR',
    lat: 17.7100,
    lng: 83.3350,
    details: 'Radar tide gauge monitoring coastal surge breach.',
    status: 'Monitoring (+2.4m)',
    metric: 'Surge: +2.4m'
  }
];

interface OpenStreetMapProps {
  heightClass?: string;
  onSelectEntity?: (entity: OSMEntity) => void;
}

export const OpenStreetMap: React.FC<OpenStreetMapProps> = ({
  heightClass = 'h-[620px]',
  onSelectEntity
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupsRef = useRef<Record<string, L.LayerGroup>>({});
  const [selectedEntity, setSelectedEntity] = useState<OSMEntity | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(false);

  const [basemapMode, setBasemapMode] = useState<'STREET' | 'SATELLITE'>('STREET');
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Active layer filters (all enabled by default)
  const [activeFilters, setActiveFilters] = useState<Record<string, boolean>>({
    INCIDENT: true,
    DANGER_ZONE: true,
    AMBULANCE: true,
    FIRE_TEAM: true,
    HOSPITAL: true,
    IOT_SENSOR: true
  });

  const toggleFilter = (type: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [keyMap[type] || type]: !prev[keyMap[type] || type]
    }));
  };

  const keyMap: Record<string, string> = {
    'Incident': 'INCIDENT',
    'Danger Zone': 'DANGER_ZONE',
    'Ambulance': 'AMBULANCE',
    'Fire Team': 'FIRE_TEAM',
    'Hospital': 'HOSPITAL',
    'IoT Sensor': 'IOT_SENSOR'
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center map on Visakhapatnam / AP Coastal Emergency Zone
      const map = L.map(mapContainerRef.current, {
        center: [17.7300, 83.3200],
        zoom: 12,
        zoomControl: false,
        attributionControl: true
      });

      // INITIAL TILE LAYER
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      tileLayerRef.current = tileLayer;

      // Create Layer Groups for each entity type
      const groups: Record<string, L.LayerGroup> = {
        INCIDENT: L.layerGroup().addTo(map),
        DANGER_ZONE: L.layerGroup().addTo(map),
        AMBULANCE: L.layerGroup().addTo(map),
        FIRE_TEAM: L.layerGroup().addTo(map),
        HOSPITAL: L.layerGroup().addTo(map),
        IOT_SENSOR: L.layerGroup().addTo(map)
      };

      layerGroupsRef.current = groups;

      // Populate Entities onto OpenStreetMap
      OSM_ENTITIES.forEach(entity => {
        const group = groups[entity.type];
        if (!group) return;

        // Custom HTML Leaflet DivIcon for each marker type
        if (entity.type === 'DANGER_ZONE') {
          // Render Danger Zone Circle Cordon on OSM Map
          const circle = L.circle([entity.lat, entity.lng], {
            color: '#EF4444',
            fillColor: '#EF4444',
            fillOpacity: 0.18,
            radius: entity.id === 'DZ-1' ? 1200 : 800,
            dashArray: '5, 5'
          }).addTo(group);

          circle.on('click', () => {
            setSelectedEntity(entity);
            if (onSelectEntity) onSelectEntity(entity);
          });
        } else {
          let badgeBg = 'bg-blue-600';
          let iconEmoji = '🔥';

          if (entity.type === 'INCIDENT') {
            badgeBg = 'bg-rose-600';
            iconEmoji = '🔥';
          } else if (entity.type === 'AMBULANCE') {
            badgeBg = 'bg-cyan-600';
            iconEmoji = '🚑';
          } else if (entity.type === 'FIRE_TEAM') {
            badgeBg = 'bg-red-600';
            iconEmoji = '🚒';
          } else if (entity.type === 'HOSPITAL') {
            badgeBg = 'bg-emerald-600';
            iconEmoji = '🏥';
          } else if (entity.type === 'IOT_SENSOR') {
            badgeBg = 'bg-purple-600';
            iconEmoji = '📡';
          }

          const icon = L.divIcon({
            className: 'custom-osm-marker',
            html: `
              <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-125">
                <div class="w-7 h-7 rounded-full ${badgeBg} text-white flex items-center justify-center shadow-lg border-2 border-white text-xs">
                  ${iconEmoji}
                </div>
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });

          const marker = L.marker([entity.lat, entity.lng], { icon }).addTo(group);
          marker.bindTooltip(`<b>${entity.name}</b><br/><span style="color:#94a3b8;font-size:10px;">${entity.status}</span>`, {
            direction: 'top',
            offset: [0, -10]
          });

          marker.on('click', () => {
            setSelectedEntity(entity);
            if (onSelectEntity) onSelectEntity(entity);
          });
        }
      });

      mapInstanceRef.current = map;
    }

    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);
  }, []);

  // Synchronize Basemap Mode (Street vs Satellite)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    if (basemapMode === 'SATELLITE') {
      tileLayerRef.current = L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        attribution: '&copy; Google Satellite Maps'
      }).addTo(map);
    } else {
      tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
    }
  }, [basemapMode]);

  // Synchronize Layer Group visibility based on activeFilters
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.entries(layerGroupsRef.current).forEach(([type, group]) => {
      if (activeFilters[type]) {
        if (!map.hasLayer(group)) map.addLayer(group);
      } else {
        if (map.hasLayer(group)) map.removeLayer(group);
      }
    });
  }, [activeFilters]);

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

  // Legend Items as defined in user's requirement
  const legendItems = [
    { label: 'Incident', key: 'INCIDENT', icon: '🔥', activeColor: 'bg-rose-600 border-rose-400 text-white' },
    { label: 'Danger Zone', key: 'DANGER_ZONE', icon: '🔴', activeColor: 'bg-amber-600 border-amber-400 text-white' },
    { label: 'Ambulance', key: 'AMBULANCE', icon: '🚑', activeColor: 'bg-cyan-600 border-cyan-400 text-white' },
    { label: 'Fire Team', key: 'FIRE_TEAM', icon: '🚒', activeColor: 'bg-red-600 border-red-400 text-white' },
    { label: 'Hospital', key: 'HOSPITAL', icon: '🏥', activeColor: 'bg-emerald-600 border-emerald-400 text-white' },
    { label: 'IoT Sensor', key: 'IOT_SENSOR', icon: '📡', activeColor: 'bg-purple-600 border-purple-400 text-white' }
  ];

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-md ${isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : heightClass} select-none font-sans`}>

      {/* Top Title Overlay Bar */}
      <div className="absolute top-3.5 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        
        {/* OpenStreetMap Title Badge */}
        <div className="flex items-center space-x-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-md pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <h2 className="font-extrabold text-slate-900 text-xs tracking-wider uppercase">
            {basemapMode === 'SATELLITE' ? 'SATELLITE GIS MAP' : 'OPENSTREETMAP STANDARD MAP'}
          </h2>
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold border border-emerald-200">
            Live Feed
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          {/* Street / Satellite Toggle */}
          <div className="bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-md flex items-center space-x-1">
            <button
              onClick={() => setBasemapMode('STREET')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                basemapMode === 'STREET' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Street
            </button>
            <button
              onClick={() => setBasemapMode('SATELLITE')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                basemapMode === 'SATELLITE' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Satellite
            </button>
          </div>

          <button
            onClick={() => mapInstanceRef.current?.setView([17.7300, 83.3200], 12)}
            className="px-3 py-1.5 bg-white/95 hover:bg-white backdrop-blur-md border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md flex items-center space-x-1"
          >
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Reset View</span>
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-white/95 hover:bg-white backdrop-blur-md border border-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer shadow-md"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* LEAFLET OPENSTREETMAP CONTAINER */}
      <div ref={mapContainerRef} className="w-full h-full bg-[#e5e3df] z-10" />

      {/* COLLAPSIBLE OVERLAY LEGEND CARD */}
      <div className="absolute top-16 left-4 z-20 pointer-events-auto text-left">
        {!isLegendOpen ? (
          <button
            onClick={() => setIsLegendOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-slate-800 text-xs font-bold shadow-md hover:bg-white transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Map Layers</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-blue-50 text-blue-600 rounded-md font-mono">
              {Object.values(activeFilters).filter(Boolean).length} Active
            </span>
          </button>
        ) : (
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-3 shadow-xl max-w-[240px] sm:max-w-xs transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <div className="flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider">
                  Map Layers & Legend
                </span>
              </div>
              <button
                onClick={() => setIsLegendOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-700 px-1 font-bold"
              >
                ✕
              </button>
            </div>

            {/* 6 Legend Items */}
            <div className="grid grid-cols-2 gap-1.5">
              {legendItems.map(item => {
                const isEnabled = activeFilters[item.key];
                return (
                  <button
                    key={item.label}
                    onClick={() => toggleFilter(item.label)}
                    className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isEnabled
                        ? item.activeColor + ' shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span className="truncate text-[11px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col space-y-1">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-800 flex items-center justify-center font-bold text-sm hover:bg-slate-50 cursor-pointer shadow-md"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-800 flex items-center justify-center font-bold text-sm hover:bg-slate-50 cursor-pointer shadow-md"
        >
          −
        </button>
      </div>

      {/* Selected Entity Card Detail Popover */}
      {selectedEntity && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-20 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl p-4 shadow-2xl text-slate-800 pointer-events-auto text-left"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {selectedEntity.type === 'INCIDENT' && '🔥'}
                  {selectedEntity.type === 'DANGER_ZONE' && '🔴'}
                  {selectedEntity.type === 'AMBULANCE' && '🚑'}
                  {selectedEntity.type === 'FIRE_TEAM' && '🚒'}
                  {selectedEntity.type === 'HOSPITAL' && '🏥'}
                  {selectedEntity.type === 'IOT_SENSOR' && '📡'}
                </span>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 block leading-tight">
                    {selectedEntity.type.replace('_', ' ')} • {selectedEntity.status}
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-xs tracking-tight">
                    {selectedEntity.name}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => setSelectedEntity(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-xl border border-slate-100 font-medium">
              {selectedEntity.details}
            </p>

            <div className="mt-2.5 flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="font-mono text-[10px] text-slate-400">
                GPS: {selectedEntity.lat.toFixed(4)}°N, {selectedEntity.lng.toFixed(4)}°E
              </span>
              {selectedEntity.metric && (
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-200">
                  {selectedEntity.metric}
                </span>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

    </div>
  );
};

export default OpenStreetMap;
