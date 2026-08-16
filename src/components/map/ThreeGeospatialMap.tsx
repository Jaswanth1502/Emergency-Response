import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Flame,
  AlertTriangle,
  Droplets,
  Radio,
  Truck,
  Shield,
  Activity,
  X,
  Navigation,
  MapPin,
  Building,
  Layers,
  Crosshair,
  Maximize2
} from 'lucide-react';

interface IncidentSpot {
  id: string;
  name: string;
  type: 'Fire' | 'Collision' | 'Gas' | 'Flood' | 'Structural';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  areaName: string;
  floor: string;
  coordinates: { x: number; z: number; lat: number; lng: number };
  description: string;
  casualties: number;
  assignedFleet: string[];
  riskScore: number;
  buildingHeight: number;
}

const BLUEPRINT_INCIDENTS: IncidentSpot[] = [
  {
    id: 'INC-2026-0891',
    name: '450 Mission Financial Plaza',
    type: 'Fire',
    severity: 'CRITICAL',
    areaName: 'District 4 Financial Core',
    floor: 'Fl 6-12 (Commercial Sub-level B2)',
    coordinates: { x: 0, z: 0, lat: 37.7891, lng: -122.4014 },
    description: '485°C thermal surge in commercial sub-level B2 with solvent tanks. 6 tactical response units deployed.',
    casualties: 14,
    assignedFleet: ['Engine 14 Heavy Pumper', 'Foam Unit F-04', 'ALS Ambulance A-05', 'USAR Task Force 1'],
    riskScore: 94,
    buildingHeight: 210
  },
  {
    id: 'INC-2026-0892',
    name: 'Market & 4th Street Intermodal',
    type: 'Collision',
    severity: 'HIGH',
    areaName: 'Downtown Transit Corridor',
    floor: 'Ground Level & Rail Crossway',
    coordinates: { x: -110, z: 80, lat: 37.7850, lng: -122.4060 },
    description: 'Multi-vehicle collision involving chemical container transport. Outbound arterial blocked. Traffic bypass engaged.',
    casualties: 6,
    assignedFleet: ['Rescue Tender R-02', 'Police Interceptor P-08', 'ALS Ambulance A-02'],
    riskScore: 82,
    buildingHeight: 90
  },
  {
    id: 'INC-2026-0893',
    name: 'Metro Transit Hub (8th & Market)',
    type: 'Gas',
    severity: 'CRITICAL',
    areaName: 'Civic Center Sub-Surface Interchange',
    floor: 'Lower Concourse Sub-Level 3',
    coordinates: { x: -190, z: 150, lat: 37.7785, lng: -122.4140 },
    description: 'Subterranean natural gas pipeline fracture with pressure at 68% LEL. Rapid transit station evacuated.',
    casualties: 0,
    assignedFleet: ['HazMat Specialist H-01', 'USAR Task Force 2', 'Engine 09'],
    riskScore: 91,
    buildingHeight: 120
  },
  {
    id: 'INC-2026-0894',
    name: 'Pier 28 Bayside Logistics Basin',
    type: 'Flood',
    severity: 'MEDIUM',
    areaName: 'Embarcadero Waterfront Sector',
    floor: 'Dock Level & Substation Vault',
    coordinates: { x: 150, z: -120, lat: 37.7885, lng: -122.3890 },
    description: 'Saltwater storm surge breached sea-wall retention barrier. Critical electrical substation protected by flood barriers.',
    casualties: 0,
    assignedFleet: ['Marine Response Fireboat 1', 'High-Capacity Dewatering Pump DP-03'],
    riskScore: 64,
    buildingHeight: 45
  },
  {
    id: 'INC-2026-0895',
    name: 'Bayview Logistics Industrial Complex',
    type: 'Structural',
    severity: 'HIGH',
    areaName: 'Bayview Sector B',
    floor: 'Warehouse Roof Truss & Bay 4',
    coordinates: { x: -70, z: -170, lat: 37.7400, lng: -122.3900 },
    description: 'Structural strain gauge alert indicating primary roof truss deformation. Safety cordon established.',
    casualties: 0,
    assignedFleet: ['USAR Structural Specialists', 'Engine 18'],
    riskScore: 79,
    buildingHeight: 65
  }
];

interface ThreeGeospatialMapProps {
  activeIncidentId?: string;
  onFocusIncident?: (id: string) => void;
  viewMode?: '2D' | '3D';
  onViewModeChange?: (mode: '2D' | '3D') => void;
  className?: string;
}

export const ThreeGeospatialMap: React.FC<ThreeGeospatialMapProps> = ({
  activeIncidentId = 'INC-2026-0891',
  onFocusIncident,
  viewMode = '3D',
  onViewModeChange,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  
  // Clean, single selected incident state for modal popover
  const [selectedSpot, setSelectedSpot] = useState<IncidentSpot | null>(
    BLUEPRINT_INCIDENTS.find(i => i.id === activeIncidentId) || BLUEPRINT_INCIDENTS[0]
  );

  const [cameraView, setCameraView] = useState<'3D' | 'TOP'>('3D');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animIdRef = useRef<number | null>(null);
  const interactiveObjectsRef = useRef<THREE.Object3D[]>([]);

  const controlsRef = useRef<{
    isDragging: boolean;
    isPanning: boolean;
    prevX: number;
    prevY: number;
    spherical: { radius: number; theta: number; phi: number };
    target: THREE.Vector3;
  }>({
    isDragging: false,
    isPanning: false,
    prevX: 0,
    prevY: 0,
    spherical: { radius: 380, theta: Math.PI / 3.6, phi: Math.PI / 3.4 },
    target: new THREE.Vector3(0, 0, 0)
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    while (mount.firstChild) {
      mount.removeChild(mount.firstChild);
    }

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // 1. Blueprint Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060c18);
    scene.fog = new THREE.FogExp2(0x060c18, 0.0013);
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Blueprint Ambient & Key Lighting
    const ambientLight = new THREE.AmbientLight(0x0ea5e9, 0.5);
    scene.add(ambientLight);

    const blueDirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    blueDirLight.position.set(200, 400, 150);
    scene.add(blueDirLight);

    const rimLight = new THREE.DirectionalLight(0x0284c7, 0.8);
    rimLight.position.set(-200, 150, -200);
    scene.add(rimLight);

    // 5. Blueprint CAD Grid Floor
    const gridHelper = new THREE.GridHelper(1000, 40, 0x0284c7, 0x0f3460);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Minor CAD Sub-grid
    const subGrid = new THREE.GridHelper(1000, 160, 0x00d2ff, 0x0a2144);
    subGrid.position.y = -0.2;
    scene.add(subGrid);

    // 6. Holographic Blueprint City Buildings
    const buildingsGroup = new THREE.Group();
    scene.add(buildingsGroup);

    // Architectural Wireframe Materials
    const blueprintMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.18,
      depthWrite: false
    });

    const blueprintEdgeMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 1,
      transparent: true,
      opacity: 0.7
    });

    const activeBuildingMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.35
    });

    const activeEdgeMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      linewidth: 2,
      transparent: true,
      opacity: 0.95
    });

    // Procedural Blueprint Blocks
    const gridSize = 7;
    const spacing = 72;

    for (let i = -gridSize; i <= gridSize; i++) {
      for (let j = -gridSize; j <= gridSize; j++) {
        // Skip water / bay area (East/North-East)
        if (i > 3 && j < -1) continue;

        const dist = Math.sqrt(i * i + j * j);
        const isCenter = (i === 0 && j === 0);

        // Check if there is an incident at or near this coordinate
        const bx = i * spacing;
        const bz = j * spacing;
        const matchedIncident = BLUEPRINT_INCIDENTS.find(inc => 
          Math.hypot(inc.coordinates.x - bx, inc.coordinates.z - bz) < 30
        );

        let bHeight = isCenter ? 210 : Math.max(30, 140 - dist * 14 + (Math.sin(i * 3 + j * 2) * 35));
        if (matchedIncident) {
          bHeight = matchedIncident.buildingHeight;
        }

        const bWidth = isCenter ? 44 : 32 + (Math.cos(i + j) * 8);
        const bDepth = isCenter ? 44 : 32 + (Math.sin(i - j) * 8);

        const bGeo = new THREE.BoxGeometry(bWidth, bHeight, bDepth);
        const bMesh = new THREE.Mesh(bGeo, matchedIncident ? activeBuildingMat : blueprintMat);
        bMesh.position.set(bx, bHeight / 2, bz);
        buildingsGroup.add(bMesh);

        // Blueprint structural edges
        const edges = new THREE.EdgesGeometry(bGeo);
        const line = new THREE.LineSegments(edges, matchedIncident ? activeEdgeMat : blueprintEdgeMat);
        bMesh.add(line);

        // Store metadata if incident is linked
        if (matchedIncident) {
          bMesh.userData = { incident: matchedIncident };
          interactiveObjectsRef.current.push(bMesh);
        }
      }
    }

    // 7. Interactive 3D Accident Hotspot Markers
    const markersGroup = new THREE.Group();
    scene.add(markersGroup);

    BLUEPRINT_INCIDENTS.forEach(inc => {
      const spotGroup = new THREE.Group();
      spotGroup.position.set(inc.coordinates.x, 2, inc.coordinates.z);
      spotGroup.userData = { incident: inc };

      const markerColor = inc.severity === 'CRITICAL' ? 0xef4444 : inc.severity === 'HIGH' ? 0xf59e0b : 0x06b6d4;

      // 1. Vertical Laser Cordon Line
      const laserGeo = new THREE.CylinderGeometry(0.6, 0.6, inc.buildingHeight + 40, 8);
      const laserMat = new THREE.MeshBasicMaterial({ color: markerColor, transparent: true, opacity: 0.85 });
      const laser = new THREE.Mesh(laserGeo, laserMat);
      laser.position.y = (inc.buildingHeight + 40) / 2;
      spotGroup.add(laser);

      // 2. Top Floating Diamond / Hex Beacon
      const pinGeo = new THREE.OctahedronGeometry(7, 0);
      const pinMat = new THREE.MeshBasicMaterial({ color: markerColor, wireframe: false });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.y = inc.buildingHeight + 45;
      spotGroup.add(pinMesh);

      // 3. Ground Pulsing Radar Wave
      const ringGeo = new THREE.RingGeometry(16, 22, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: markerColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.y = 1;
      spotGroup.add(ringMesh);

      // 4. Point Light for Beacon Glow
      const pLight = new THREE.PointLight(markerColor, 3, 120);
      pLight.position.y = inc.buildingHeight + 45;
      spotGroup.add(pLight);

      markersGroup.add(spotGroup);
      interactiveObjectsRef.current.push(spotGroup);
    });

    // 8. 3D Evacuation Vector Corridors (Blueprint Neon Lines)
    const corridorMat = new THREE.LineDashedMaterial({
      color: 0x10b981,
      linewidth: 3,
      scale: 1,
      dashSize: 8,
      gapSize: 4
    });

    const corridorPoints = [
      new THREE.Vector3(0, 3, 0),
      new THREE.Vector3(0, 3, 140),
      new THREE.Vector3(-140, 3, 140),
      new THREE.Vector3(-280, 3, 140)
    ];
    const corridorGeo = new THREE.BufferGeometry().setFromPoints(corridorPoints);
    const corridorLine = new THREE.Line(corridorGeo, corridorMat);
    corridorLine.computeLineDistances();
    scene.add(corridorLine);

    // 9. Camera Orbit Engine
    const controls = controlsRef.current;

    const updateCameraPosition = () => {
      const { radius, theta, phi } = controls.spherical;
      const x = controls.target.x + radius * Math.sin(phi) * Math.sin(theta);
      const y = controls.target.y + radius * Math.cos(phi);
      const z = controls.target.z + radius * Math.sin(phi) * Math.cos(theta);

      camera.position.set(x, y, z);
      camera.lookAt(controls.target);
    };

    updateCameraPosition();

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) controls.isDragging = true;
      if (e.button === 2) controls.isPanning = true;
      controls.prevX = e.clientX;
      controls.prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!controls.isDragging && !controls.isPanning) return;
      const deltaX = e.clientX - controls.prevX;
      const deltaY = e.clientY - controls.prevY;
      controls.prevX = e.clientX;
      controls.prevY = e.clientY;

      if (controls.isDragging) {
        controls.spherical.theta -= deltaX * 0.006;
        controls.spherical.phi = Math.max(0.12, Math.min(Math.PI / 2.05, controls.spherical.phi - deltaY * 0.006));
      } else if (controls.isPanning) {
        controls.target.x -= deltaX * 0.4;
        controls.target.z -= deltaY * 0.4;
      }

      updateCameraPosition();
    };

    const onMouseUp = () => {
      controls.isDragging = false;
      controls.isPanning = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      controls.spherical.radius = Math.max(100, Math.min(750, controls.spherical.radius + e.deltaY * 0.5));
      updateCameraPosition();
    };

    // Raycast click detection for building/accident selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onCanvasClick = (e: MouseEvent) => {
      if (!mount) return;
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjectsRef.current, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && !obj.userData.incident && obj.parent) {
          obj = obj.parent;
        }
        if (obj && obj.userData.incident) {
          const inc: IncidentSpot = obj.userData.incident;
          setSelectedSpot(inc);
          onFocusIncident?.(inc.id);

          // Focus camera on target
          controls.target.set(inc.coordinates.x, 30, inc.coordinates.z);
          controls.spherical.radius = 240;
          updateCameraPosition();
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('click', onCanvasClick);
    dom.addEventListener('contextmenu', e => e.preventDefault());

    // 10. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Animate Beacon Markers (Rotation & Wave Expansion)
      markersGroup.children.forEach((spot, idx) => {
        spot.children.forEach(child => {
          if (child instanceof THREE.Mesh && child.geometry instanceof THREE.OctahedronGeometry) {
            child.rotation.y = elapsed * 2 + idx;
            child.position.y = (child.parent?.userData.incident?.buildingHeight || 100) + 45 + Math.sin(elapsed * 4 + idx) * 3;
          }
          if (child instanceof THREE.Mesh && child.geometry instanceof THREE.RingGeometry) {
            const scale = 1 + Math.sin(elapsed * 3.5 + idx) * 0.2;
            child.scale.set(scale, scale, scale);
          }
        });
      });

      renderer.render(scene, camera);
      animIdRef.current = requestAnimationFrame(animate);
    };

    animIdRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('click', onCanvasClick);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleViewPreset = (view: '3D' | 'TOP') => {
    setCameraView(view);
    const controls = controlsRef.current;
    if (!controls || !cameraRef.current) return;

    if (view === '3D') {
      controls.spherical = { radius: 380, theta: Math.PI / 3.6, phi: Math.PI / 3.4 };
      controls.target.set(0, 0, 0);
    } else {
      controls.spherical = { radius: 460, theta: 0, phi: 0.08 };
      controls.target.set(0, 0, 0);
    }

    const { radius, theta, phi } = controls.spherical;
    const x = controls.target.x + radius * Math.sin(phi) * Math.sin(theta);
    const y = controls.target.y + radius * Math.cos(phi);
    const z = controls.target.z + radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(controls.target);
  };

  const selectIncident = (inc: IncidentSpot) => {
    setSelectedSpot(inc);
    onFocusIncident?.(inc.id);
    const controls = controlsRef.current;
    if (!controls || !cameraRef.current) return;

    controls.target.set(inc.coordinates.x, 30, inc.coordinates.z);
    controls.spherical.radius = 220;

    const { radius, theta, phi } = controls.spherical;
    const x = controls.target.x + radius * Math.sin(phi) * Math.sin(theta);
    const y = controls.target.y + radius * Math.cos(phi);
    const z = controls.target.z + radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(controls.target);
  };

  return (
    <div className={`relative w-full h-full overflow-hidden select-none font-sans bg-[#060C18] ${className}`}>
      
      {/* 3D Blueprint Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header Bar: Blueprint Breadcrumb & View Mode */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-none">
        
        {/* Left Blueprint Header Pill */}
        <div className="liquid-glass-pill px-3.5 py-1.5 rounded-xl flex items-center space-x-2.5 shadow-xs border border-white/80 pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400/50" />
          <div className="text-left">
            <span className="text-[9px] font-mono text-cyan-700 font-extrabold uppercase tracking-widest block leading-none">
              3D BLUEPRINT DIGITAL TWIN
            </span>
            <span className="text-xs font-black text-slate-900 tracking-tight block">
              San Francisco Financial Core
            </span>
          </div>
        </div>

        {/* Center / Right: View Mode Toggle & Perspective Switch */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          
          {/* 2D Tactical GIS / 3D Digital Twin Switcher */}
          <div className="liquid-glass-pill p-1 rounded-xl flex items-center space-x-1 shadow-xs border border-white/80">
            <button
              onClick={() => onViewModeChange?.('2D')}
              className="px-3 py-1 text-xs font-extrabold rounded-lg text-slate-700 hover:text-slate-900 transition-all cursor-pointer"
            >
              2D Tactical GIS
            </button>
            <button
              onClick={() => onViewModeChange?.('3D')}
              className="px-3 py-1 text-xs font-extrabold rounded-lg bg-slate-900 text-white shadow-xs transition-all cursor-pointer"
            >
              3D Digital Twin
            </button>
          </div>

          {/* Quick Incident Quick-Jumps */}
          <div className="hidden md:flex items-center space-x-1 liquid-glass-pill p-1 rounded-xl">
            {BLUEPRINT_INCIDENTS.map((inc, i) => (
              <button
                key={inc.id}
                onClick={() => selectIncident(inc)}
                className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
                  selectedSpot?.id === inc.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{inc.type === 'Fire' ? '🔥' : inc.type === 'Collision' ? '💥' : inc.type === 'Gas' ? '☣️' : '🌊'}</span>
                <span>Spot #{i + 1}</span>
              </button>
            ))}
          </div>

          {/* Perspective Switch */}
          <div className="liquid-glass-pill p-1 rounded-xl flex items-center space-x-1 shadow-xs border border-white/80">
            <button
              onClick={() => handleViewPreset('3D')}
              className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg transition-all cursor-pointer ${
                cameraView === '3D' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3D Angle
            </button>
            <button
              onClick={() => handleViewPreset('TOP')}
              className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg transition-all cursor-pointer ${
                cameraView === 'TOP' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Top CAD
            </button>
          </div>

        </div>

      </div>

      {/* Floating Blueprint Incident Details Card (Only shown when an accident/building is clicked) */}
      {selectedSpot && (
        <div className="absolute top-16 right-4 z-20 liquid-glass rounded-2xl p-5 max-w-sm w-full text-left space-y-3 shadow-2xl border border-white/95 transition-all">
          
          {/* Header with dismiss X button */}
          <div className="flex items-start justify-between border-b border-white/80 pb-2.5">
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${selectedSpot.severity === 'CRITICAL' ? 'bg-rose-600' : 'bg-amber-500'} animate-pulse`} />
              <div>
                <span className="text-[9px] font-mono text-slate-400 font-extrabold uppercase tracking-widest block">
                  {selectedSpot.id} • {selectedSpot.areaName}
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">
                  {selectedSpot.name}
                </h4>
              </div>
            </div>

            <button
              onClick={() => setSelectedSpot(null)}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Accident Category & Floor Badge */}
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
              ● {selectedSpot.type.toUpperCase()} ACCIDENT • {selectedSpot.severity}
            </span>
            <span className="text-[10px] font-mono text-slate-500 font-bold">
              {selectedSpot.floor}
            </span>
          </div>

          {/* Incident Description */}
          <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white/60 p-2.5 rounded-xl border border-white/80">
            {selectedSpot.description}
          </p>

          {/* Live Metrics: Casualties & Risk Score */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 bg-white/70 rounded-xl border border-white/90">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Casualties Treated</span>
              <span className="text-xs font-black text-rose-600 mt-0.5 block">{selectedSpot.casualties} Persons</span>
            </div>
            <div className="p-2 bg-white/70 rounded-xl border border-white/90">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Risk Severity Index</span>
              <span className="text-xs font-black text-slate-900 mt-0.5 block">{selectedSpot.riskScore} / 100</span>
            </div>
          </div>

          {/* Dispatched Tactical Fleet */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
              Dispatched Tactical Fleet ({selectedSpot.assignedFleet.length} Units)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedSpot.assignedFleet.map((unit, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 liquid-glass-pill rounded-lg text-[10px] font-bold text-slate-700 border border-white/80"
                >
                  🚒 {unit}
                </span>
              ))}
            </div>
          </div>

          {/* Direct Dispatch CTA */}
          <div className="pt-2">
            <button
              onClick={() => {
                alert(`Tactical reinforcements commanded to ${selectedSpot.name}`);
              }}
              className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Reinforce Emergency Units
            </button>
          </div>

        </div>
      )}

      {/* Bottom Center Navigation Guide Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 liquid-glass-pill px-4 py-1.5 rounded-xl text-[11px] text-slate-600 font-semibold shadow-xs border border-white/80 pointer-events-none">
        <span>Click any 3D building or accident marker to inspect area & accident details • Drag to orbit • Scroll to zoom</span>
      </div>

    </div>
  );
};
export default ThreeGeospatialMap;
