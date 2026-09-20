import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Globe,
  Compass,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
  Layers,
  Info,
  Shield,
  Truck,
  Flame,
  Building2,
  Cpu,
  RefreshCw,
  Navigation
} from 'lucide-react';
import {
  EmergencyIncident,
  SafeZone,
  EmergencyResource,
  Hospital,
  IoTSensorNode,
  RoutePath,
  BlockedRoad,
  MapLayerState
} from '../../types/digitalTwin';
import { cityBuildingsData } from '../../data/cityBuildingsData';

interface MapLibreMapProps {
  heightClass?: string;
  incidents: EmergencyIncident[];
  safeZones: SafeZone[];
  resources: EmergencyResource[];
  hospitals: Hospital[];
  sensors: IoTSensorNode[];
  routes: RoutePath[];
  blockedRoads: BlockedRoad[];
  layers: MapLayerState;
  selectedIncident: EmergencyIncident | null;
  onSelectIncident: (incident: EmergencyIncident) => void;
  onSelectResource?: (resource: EmergencyResource) => void;
  onSelectHospital?: (hospital: Hospital) => void;
  onSelectSafeZone?: (safeZone: SafeZone) => void;
  onSelectSensor?: (sensor: IoTSensorNode) => void;
  onSwitchToOSM?: () => void;
}

// Helper: Generate GeoJSON polygon circle for danger radius
function createGeoJSONCircle(center: [number, number], radiusInMeters: number, points = 64) {
  const lng = center[0];
  const lat = center[1];
  const km = radiusInMeters / 1000;
  const ret: [number, number][] = [];
  const distanceX = km / (111.320 * Math.cos((lat * Math.PI) / 180));
  const distanceY = km / 110.574;

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    ret.push([lng + x, lat + y]);
  }
  ret.push(ret[0]);

  return {
    type: 'Feature' as const,
    geometry: {
      type: 'Polygon' as const,
      coordinates: [ret]
    },
    properties: {}
  };
}

export const MapLibreMap: React.FC<MapLibreMapProps> = ({
  heightClass = 'h-[650px]',
  incidents,
  safeZones,
  resources,
  hospitals,
  sensors,
  routes,
  blockedRoads,
  layers,
  selectedIncident,
  onSelectIncident,
  onSelectResource,
  onSelectHospital,
  onSelectSafeZone,
  onSelectSensor,
  onSwitchToOSM
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const htmlMarkersRef = useRef<maplibregl.Marker[]>([]);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [is3DPerspective, setIs3DPerspective] = useState(true);
  const [cameraState, setCameraState] = useState({
    lng: 78.4867,
    lat: 17.3850,
    zoom: 15.8,
    pitch: 60,
    bearing: 0
  });

  // 1. Initialize MapLibre GL JS Map with Guaranteed OpenStreetMap Basemap Tiles + 3D City Buildings
  useEffect(() => {
    if (!mapContainerRef.current) return;

    setLoadError(null);
    setMapLoaded(false);

    try {
      // Inline MapLibre Style Specification for 100% Reliable OpenStreetMap Tile Basemap (Zero Watermarks, Zero API Keys)
      const inlineOsmStyle: maplibregl.StyleSpecification = {
        version: 8,
        sources: {
          'osm-raster-tiles': {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        },
        layers: [
          {
            id: 'background-slate',
            type: 'background',
            paint: {
              'background-color': '#0f172a'
            }
          },
          {
            id: 'osm-raster-basemap',
            type: 'raster',
            source: 'osm-raster-tiles',
            minzoom: 0,
            maxzoom: 19,
            paint: {
              'raster-opacity': 0.88
            }
          }
        ]
      };

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: inlineOsmStyle,
        center: [cameraState.lng, cameraState.lat], // [lng, lat]
        zoom: cameraState.zoom,
        pitch: cameraState.pitch,
        bearing: cameraState.bearing,
        antialias: true
      });

      mapRef.current = map;

      map.on('load', () => {
        setMapLoaded(true);

        console.log('Map style loaded: OpenStreetMap Standard Raster + 3D WebGL Buildings');
        console.log('Map sources:', map.getStyle().sources);
        console.log('Map layers:', map.getStyle().layers);

        // Add City 3D Buildings Source & Layer (120+ Footprints with varied heights)
        map.addSource('city-3d-buildings-src', {
          type: 'geojson',
          data: cityBuildingsData
        });

        map.addLayer({
          id: 'city-3d-buildings-extrusion',
          type: 'fill-extrusion',
          source: 'city-3d-buildings-src',
          paint: {
            'fill-extrusion-height': [
              'coalesce',
              ['get', 'height'],
              ['*', ['coalesce', ['get', 'building_levels'], 1], 3.5]
            ],
            'fill-extrusion-base': [
              'coalesce',
              ['get', 'min_height'],
              0
            ],
            'fill-extrusion-color': [
              'match',
              ['get', 'status'],
              'AFFECTED', '#dc2626',    // Highlighted Red for Incident/Fire site
              'DANGEROUS', '#ef4444',   // Red accent
              'AT_RISK', '#f59e0b',     // Amber for danger zone proximity
              '#475569'                // High-contrast Slate Blue-Gray for 3D City Buildings
            ],
            'fill-extrusion-opacity': 0.90
          }
        });

        // Add Danger Zones GeoJSON Source & Layer
        map.addSource('danger-zones-src', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] }
        });

        map.addLayer({
          id: 'danger-zone-fill',
          type: 'fill',
          source: 'danger-zones-src',
          paint: {
            'fill-color': '#ef4444',
            'fill-opacity': 0.28
          }
        });

        map.addLayer({
          id: 'danger-zone-outline',
          type: 'line',
          source: 'danger-zones-src',
          paint: {
            'line-color': '#f87171',
            'line-width': 2.5,
            'line-dasharray': [2, 2]
          }
        });

        // Add Evacuation Routes GeoJSON Source & Layer
        map.addSource('evacuation-route-src', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] }
        });

        map.addLayer({
          id: 'evacuation-route-line',
          type: 'line',
          source: 'evacuation-route-src',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#f59e0b',
            'line-width': 5,
            'line-opacity': 0.95
          }
        });

        // Add Rescue Routes GeoJSON Source & Layer
        map.addSource('rescue-route-src', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] }
        });

        map.addLayer({
          id: 'rescue-route-line',
          type: 'line',
          source: 'rescue-route-src',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#06b6d4',
            'line-width': 5,
            'line-opacity': 0.95,
            'line-dasharray': [3, 2]
          }
        });

        // Add Blocked Roads GeoJSON Source & Layer
        map.addSource('blocked-roads-src', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] }
        });

        map.addLayer({
          id: 'blocked-roads-line',
          type: 'line',
          source: 'blocked-roads-src',
          paint: {
            'line-color': '#dc2626',
            'line-width': 6,
            'line-dasharray': [1, 1]
          }
        });

        // Building Click Handler (NO FLOORPLAN DATA notice as per Rule 17 & Step 13)
        map.on('click', 'city-3d-buildings-extrusion', (e) => {
          if (e.features && e.features[0]) {
            const props = e.features[0].properties;
            const statusColor = props?.status === 'AFFECTED' ? '#ef4444' : props?.status === 'AT_RISK' ? '#f59e0b' : '#38bdf8';

            new maplibregl.Popup({ className: 'custom-maplibre-popup', offset: 15 })
              .setLngLat(e.lngLat)
              .setHTML(`
                <div style="background:#0f172a; color:#fff; padding:12px; border-radius:10px; border:1px solid #334155; min-width:210px; font-family:sans-serif;">
                  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #1e293b; padding-bottom:6px; margin-bottom:8px;">
                    <h4 style="font-weight:bold; font-size:12px; color:${statusColor}; margin:0;">${props?.name || 'City Building'}</h4>
                    <span style="font-size:9px; font-weight:bold; background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:4px;">${props?.status || 'NORMAL'}</span>
                  </div>
                  <div style="font-size:11px; color:#cbd5e1; line-height:1.6;">
                    <div><strong>Type:</strong> ${(props?.building_type || 'Commercial').toUpperCase()}</div>
                    <div><strong>Levels:</strong> ${props?.building_levels || 8} stories</div>
                    <div><strong>Height:</strong> ${props?.height || 25} m</div>
                    <div style="margin-top:6px; background:#1e293b; padding:4px 8px; border-radius:6px; color:#94a3b8; font-weight:bold; font-size:10px; text-align:center;">
                      NO FLOORPLAN DATA
                    </div>
                  </div>
                </div>
              `)
              .addTo(map);
          }
        });
      });

      map.on('move', () => {
        const center = map.getCenter();
        setCameraState({
          lng: center.lng,
          lat: center.lat,
          zoom: map.getZoom(),
          pitch: map.getPitch(),
          bearing: map.getBearing()
        });
      });

      map.on('error', (e) => {
        console.warn('MapLibre GL JS Event Error:', e);
      });

    } catch (err: any) {
      console.error('MapLibre GL JS initialization failure:', err);
      setLoadError(err?.message || 'Failed to initialize MapLibre GL map.');
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 2. Toggle 3D Buildings Layer Visibility
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const visibility = layers.buildings3D ? 'visible' : 'none';
    if (mapRef.current.getLayer('city-3d-buildings-extrusion')) {
      mapRef.current.setLayoutProperty('city-3d-buildings-extrusion', 'visibility', visibility);
    }
  }, [layers.buildings3D, mapLoaded]);

  // 3. Update GeoJSON Routes & Danger Zones
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;

    // Danger Zones GeoJSON
    if (map.getSource('danger-zones-src')) {
      const dangerFeatures = (layers.dangerZones && layers.incidents)
        ? incidents
            .filter(inc => inc.dangerRadius)
            .map(inc => createGeoJSONCircle([inc.longitude, inc.latitude], inc.dangerRadius || 150))
        : [];

      (map.getSource('danger-zones-src') as maplibregl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features: dangerFeatures
      });
    }

    // Evacuation Routes GeoJSON
    if (map.getSource('evacuation-route-src')) {
      const evacFeatures = layers.evacuationRoutes
        ? routes
            .filter(r => r.type === 'EVACUATION')
            .map(r => ({
              type: 'Feature' as const,
              geometry: {
                type: 'LineString' as const,
                coordinates: r.coordinates.map(c => [c[1], c[0]]) // [lat,lng] -> [lng,lat]
              },
              properties: { name: r.name }
            }))
        : [];

      (map.getSource('evacuation-route-src') as maplibregl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features: evacFeatures
      });
    }

    // Rescue Routes GeoJSON
    if (map.getSource('rescue-route-src')) {
      const rescueFeatures = layers.rescueRoutes
        ? routes
            .filter(r => r.type === 'RESCUE')
            .map(r => ({
              type: 'Feature' as const,
              geometry: {
                type: 'LineString' as const,
                coordinates: r.coordinates.map(c => [c[1], c[0]]) // [lat,lng] -> [lng,lat]
              },
              properties: { name: r.name }
            }))
        : [];

      (map.getSource('rescue-route-src') as maplibregl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features: rescueFeatures
      });
    }

    // Blocked Roads GeoJSON
    if (map.getSource('blocked-roads-src')) {
      const blockedFeatures = layers.blockedRoads
        ? blockedRoads.map(b => ({
            type: 'Feature' as const,
            geometry: {
              type: 'LineString' as const,
              coordinates: b.coordinates.map(c => [c[1], c[0]])
            },
            properties: { name: b.roadName, reason: b.reason }
          }))
        : [];

      (map.getSource('blocked-roads-src') as maplibregl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features: blockedFeatures
      });
    }
  }, [layers, incidents, routes, blockedRoads, mapLoaded]);

  // 4. Render HTML Markers (Incidents, Safe Zones, Responders, Hospitals, Sensors)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;

    // Remove old markers
    htmlMarkersRef.current.forEach(m => m.remove());
    htmlMarkersRef.current = [];

    // Incidents
    if (layers.incidents) {
      incidents.forEach(inc => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer group flex flex-col items-center';
        el.innerHTML = `
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-red-500 opacity-75"></span>
            <div class="relative w-8 h-8 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-white shadow-lg text-sm font-bold">
              🚨
            </div>
          </div>
          <div class="mt-1 bg-slate-900/95 border border-red-500/40 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-md font-mono whitespace-nowrap">
            ${inc.title || inc.type} (${inc.severity})
          </div>
        `;

        el.addEventListener('click', () => onSelectIncident(inc));

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([inc.longitude, inc.latitude])
          .addTo(map);

        htmlMarkersRef.current.push(marker);
      });
    }

    // Safe Zones
    if (layers.safeZones) {
      safeZones.forEach(sz => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer group flex flex-col items-center';
        el.innerHTML = `
          <div class="w-7 h-7 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-lg text-xs font-bold">
            🛡️
          </div>
          <div class="mt-1 bg-slate-900/95 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-300 shadow-md whitespace-nowrap">
            ${sz.name} (Cap: ${sz.capacity})
          </div>
        `;

        if (onSelectSafeZone) el.addEventListener('click', () => onSelectSafeZone(sz));

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([sz.longitude, sz.latitude])
          .addTo(map);

        htmlMarkersRef.current.push(marker);
      });
    }

    // Responders (Ambulances, Fire, Police)
    resources.forEach(res => {
      const showRes =
        (res.type === 'AMBULANCE' && layers.ambulances) ||
        (res.type === 'FIRE_TRUCK' && layers.fireRescue) ||
        (res.type === 'RESCUE_TEAM' && layers.fireRescue) ||
        (res.type === 'POLICE_VEHICLE' && layers.police);

      if (showRes) {
        const icon = res.type === 'AMBULANCE' ? '🚑' : res.type === 'FIRE_TRUCK' ? '🚒' : res.type === 'POLICE_VEHICLE' ? '👮' : '🛠️';
        const colorClass = res.type === 'AMBULANCE' ? 'bg-cyan-600 border-cyan-300' : res.type === 'FIRE_TRUCK' ? 'bg-rose-600 border-rose-300' : 'bg-blue-600 border-blue-300';

        const el = document.createElement('div');
        el.className = 'cursor-pointer group flex flex-col items-center';
        el.innerHTML = `
          <div class="w-7 h-7 rounded-lg ${colorClass} border-2 flex items-center justify-center text-white shadow-lg text-xs">
            ${icon}
          </div>
          <div class="mt-0.5 bg-slate-900/95 border border-slate-700 px-1.5 py-0.2 rounded text-[9px] font-bold text-slate-200 shadow-md whitespace-nowrap">
            ${res.name}
          </div>
        `;

        if (onSelectResource) el.addEventListener('click', () => onSelectResource(res));

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([res.longitude, res.latitude])
          .addTo(map);

        htmlMarkersRef.current.push(marker);
      }
    });

    // Hospitals
    if (layers.hospitals) {
      hospitals.forEach(hosp => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer group flex flex-col items-center';
        el.innerHTML = `
          <div class="w-8 h-8 rounded-full bg-teal-600 border-2 border-white flex items-center justify-center text-white shadow-lg text-sm">
            🏥
          </div>
          <div class="mt-1 bg-slate-900/95 border border-teal-500/40 px-2 py-0.5 rounded text-[10px] font-bold text-teal-300 shadow-md whitespace-nowrap">
            ${hosp.name} (ICU: ${hosp.icuAvailable})
          </div>
        `;

        const popupHTML = `
          <div class="p-3 bg-slate-900 text-white rounded-xl border border-slate-700 shadow-xl font-sans min-w-[200px]">
            <div class="flex items-center space-x-2 border-b border-slate-800 pb-2 mb-2">
              <span class="text-base">🏥</span>
              <h4 class="font-bold text-sm text-teal-400">${hosp.name}</h4>
            </div>
            <div class="space-y-1 text-xs text-slate-300">
              <div class="flex justify-between"><span>Available Beds:</span><span class="font-bold text-emerald-400">${hosp.availableBeds}</span></div>
              <div class="flex justify-between"><span>ICU Available:</span><span class="font-bold text-cyan-400">${hosp.icuAvailable}</span></div>
              <div class="flex justify-between"><span>Status:</span><span class="font-bold text-emerald-300">${hosp.status}</span></div>
              <div class="flex justify-between"><span>Burn Capability:</span><span class="font-bold text-slate-200">${hosp.burnCapability ? 'YES' : 'NO'}</span></div>
              <div class="flex justify-between"><span>Trauma Capability:</span><span class="font-bold text-slate-200">${hosp.traumaCapability ? 'YES' : 'NO'}</span></div>
            </div>
          </div>
        `;

        const popup = new maplibregl.Popup({ className: 'custom-maplibre-popup', offset: 25 }).setHTML(popupHTML);

        el.addEventListener('click', () => {
          if (onSelectHospital) onSelectHospital(hosp);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([hosp.longitude, hosp.latitude])
          .setPopup(popup)
          .addTo(map);

        htmlMarkersRef.current.push(marker);
      });
    }

    // IoT Sensors
    if (layers.iotSensors) {
      sensors.forEach(sens => {
        const isAlert = sens.status === 'ALERT' || sens.status === 'CRITICAL';
        const colorClass = isAlert ? 'bg-purple-600 border-rose-400 animate-pulse' : 'bg-purple-800 border-purple-400';

        const el = document.createElement('div');
        el.className = 'cursor-pointer group flex flex-col items-center';
        el.innerHTML = `
          <div class="w-6 h-6 rounded-full ${colorClass} border-2 flex items-center justify-center text-white shadow-lg text-[10px]">
            📡
          </div>
          <div class="mt-0.5 bg-slate-900/95 border border-purple-500/40 px-1.5 py-0.2 rounded text-[9px] font-bold text-purple-300 shadow-md whitespace-nowrap">
            ${sens.name} (${sens.value})
          </div>
        `;

        if (onSelectSensor) el.addEventListener('click', () => onSelectSensor(sens));

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([sens.longitude, sens.latitude])
          .addTo(map);

        htmlMarkersRef.current.push(marker);
      });
    }

  }, [layers, incidents, safeZones, resources, hospitals, sensors, mapLoaded]);

  // 5. Camera Fly-To on Incident Selection
  useEffect(() => {
    if (!selectedIncident || !mapRef.current) return;
    mapRef.current.flyTo({
      center: [selectedIncident.longitude, selectedIncident.latitude],
      zoom: 16.8,
      pitch: 65,
      duration: 1500
    });
  }, [selectedIncident]);

  // Interactive Camera Controls
  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();

  const handleResetView = () => {
    mapRef.current?.flyTo({
      center: [78.4867, 17.3850],
      zoom: 15.8,
      pitch: 60,
      bearing: 0,
      duration: 1500
    });
  };

  const handleToggle3D = () => {
    if (!mapRef.current) return;
    const nextPitch = is3DPerspective ? 0 : 60;
    mapRef.current.easeTo({ pitch: nextPitch, duration: 1000 });
    setIs3DPerspective(!is3DPerspective);
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl ${heightClass} select-none font-sans`}>

      {/* Header Bar */}
      <div className="absolute top-3.5 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        
        {/* MapLibre Digital Twin Title */}
        <div className="flex items-center space-x-2.5 bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 shadow-lg pointer-events-auto">
          <Globe className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '14s' }} />
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="font-black text-white text-xs tracking-wider uppercase">
                MAPLIBRE DIGITAL TWIN
              </h2>
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-extrabold uppercase border border-cyan-500/30">
                OPENSTREETMAP 3D
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-mono">
              Center: {cameraState.lat.toFixed(4)}°N, {cameraState.lng.toFixed(4)}°E • Pitch: {Math.round(cameraState.pitch)}° • Zoom: {cameraState.zoom.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <div className="px-3 py-1 bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>OpenStreetMap Base + 3D City Extrusions</span>
          </div>
        </div>

      </div>

      {/* Floating Map Controls (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col space-y-2 pointer-events-auto">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-white rounded-xl border border-white/10 shadow-lg backdrop-blur-md transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-white rounded-xl border border-white/10 shadow-lg backdrop-blur-md transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleToggle3D}
          title={is3DPerspective ? "Switch to 2D Flat View" : "Switch to 3D Angled Perspective"}
          className={`p-2.5 rounded-xl border border-white/10 shadow-lg backdrop-blur-md transition-colors font-bold text-xs flex items-center justify-center ${
            is3DPerspective ? 'bg-cyan-600 text-white' : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800'
          }`}
        >
          {is3DPerspective ? '3D' : '2D'}
        </button>
        <button
          onClick={handleResetView}
          title="Reset View to Hyderabad Center"
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 text-cyan-400 rounded-xl border border-white/10 shadow-lg backdrop-blur-md transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Main MapLibre Map Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[620px] relative z-10"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Fallback Error Panel if Map Fails to Load */}
      {loadError && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-md">
          <div className="max-w-md w-full bg-slate-900 border border-red-500/40 rounded-2xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-wide uppercase">
              MAP DATA COULD NOT BE LOADED
            </h3>
            <p className="text-slate-400 text-xs mt-2 font-mono">
              {loadError}
            </p>
            <div className="mt-5 flex items-center justify-center space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Map</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
