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
  Maximize2,
  Compass,
  Zap,
  Globe,
  Box
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
    name: 'Rushikonda IT Tower 4',
    type: 'Fire',
    severity: 'CRITICAL',
    areaName: 'Rushikonda IT SEZ, Vizag AP',
    floor: 'Fl 6-12 (Commercial Sub-level B2)',
    coordinates: { x: 0, z: 0, lat: 17.7800, lng: 83.3800 },
    description: '485°C thermal surge in commercial sub-level B2 with solvent storage tanks. 6 tactical response units deployed.',
    casualties: 14,
    assignedFleet: ['Engine 14 Heavy Pumper', 'Foam Unit F-04', 'ALS Ambulance A-05', 'APDRF Task Force 1'],
    riskScore: 94,
    buildingHeight: 220
  },
  {
    id: 'INC-2026-0892',
    name: 'RK Beach Coastal Surge Basin',
    type: 'Flood',
    severity: 'HIGH',
    areaName: 'RK Beach Corridor, Visakhapatnam AP',
    floor: 'Ground Level & Coastal Drain',
    coordinates: { x: -140, z: 110, lat: 17.7167, lng: 83.3000 },
    description: 'Flash flood inundation following heavy storm surge. Coastal road corridors submerged.',
    casualties: 6,
    assignedFleet: ['Rescue Tender R-02', 'Police Interceptor P-08', 'ALS Ambulance A-02'],
    riskScore: 82,
    buildingHeight: 90
  },
  {
    id: 'INC-2026-0893',
    name: 'Vizag Port Industrial Corridor',
    type: 'Gas',
    severity: 'CRITICAL',
    areaName: 'Visakhapatnam Port Trust AP',
    floor: 'Lower Concourse Sub-Level 3',
    coordinates: { x: -210, z: -160, lat: 17.6900, lng: 83.2900 },
    description: 'Subterranean industrial gas pipeline fracture with pressure at 68% LEL. Port concourse evacuated.',
    casualties: 0,
    assignedFleet: ['HazMat Specialist H-01', 'APDRF Task Force 2', 'Engine 09'],
    riskScore: 91,
    buildingHeight: 130
  },
  {
    id: 'INC-2026-0894',
    name: 'NH-16 Maddilapalem Flyover',
    type: 'Collision',
    severity: 'MEDIUM',
    areaName: 'Maddilapalem Expressway AP',
    floor: 'Elevated Highway Level',
    coordinates: { x: 180, z: -110, lat: 17.7350, lng: 83.3150 },
    description: 'Multi-vehicle collision involving chemical tanker transport. Traffic bypass engaged via Beach Road.',
    casualties: 0,
    assignedFleet: ['Marine Response Fireboat 1', 'High-Capacity Dewatering Pump DP-03'],
    riskScore: 64,
    buildingHeight: 50
  },
  {
    id: 'INC-2026-0895',
    name: 'Gajuwaka Industrial Steel Estate',
    type: 'Structural',
    severity: 'HIGH',
    areaName: 'Gajuwaka Industrial Belt, Vizag AP',
    floor: 'Warehouse Roof Truss & Bay 4',
    coordinates: { x: -120, z: -220, lat: 17.6200, lng: 83.1800 },
    description: 'Structural strain gauge alert indicating primary roof truss deformation. Safety cordon established.',
    casualties: 0,
    assignedFleet: ['APDRF Structural Specialists', 'Engine 18'],
    riskScore: 79,
    buildingHeight: 75
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
  viewMode: _viewMode = '3D',
  onViewModeChange,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [selectedSpot, setSelectedSpot] = useState<IncidentSpot | null>(
    BLUEPRINT_INCIDENTS.find(i => i.id === activeIncidentId) || BLUEPRINT_INCIDENTS[0]
  );

  const [mapStyle, setMapStyle] = useState<'SATELLITE' | 'BLUEPRINT'>('SATELLITE');
  const [cameraPreset, setCameraPreset] = useState<'ISOMETRIC' | 'TOP' | 'BUILDING'>('ISOMETRIC');

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
    spherical: { radius: 420, theta: Math.PI / 3.6, phi: Math.PI / 3.4 },
    target: new THREE.Vector3(0, 0, 0)
  });

  // Create High-Resolution Satellite Aerial Ground Texture
  const createSatelliteTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Ground Surface: Dark Satellite Base Terrain
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 1024, 1024);

    // Land / Vegetation Terrain Texture
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(400, 400, 600, 0, Math.PI * 2);
    ctx.fill();

    // Ocean / Coastline Water Body
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(800, 0);
    ctx.quadraticCurveTo(700, 500, 1024, 900);
    ctx.lineTo(1024, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#0369a1';
    ctx.beginPath();
    ctx.moveTo(850, 0);
    ctx.quadraticCurveTo(750, 500, 1024, 850);
    ctx.lineTo(1024, 0);
    ctx.closePath();
    ctx.fill();

    // Main Highway Arterials (Google Maps Style Expressways)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(0, 512);
    ctx.quadraticCurveTo(450, 480, 1024, 600);
    ctx.stroke();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(512, 0);
    ctx.quadraticCurveTo(530, 450, 512, 1024);
    ctx.stroke();

    // Secondary Street Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 3;
    for (let x = 64; x < 1024; x += 96) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1024);
      ctx.stroke();
    }
    for (let y = 64; y < 1024; y += 96) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // City District Labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '900 18px sans-serif';
    ctx.fillText('RUSHIKONDA IT SEZ', 200, 300);
    ctx.fillText('VISAKHAPATNAM PORT TRUST', 150, 750);
    ctx.fillText('RK BEACH CORRIDOR', 600, 450);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    while (mount.firstChild) {
      mount.removeChild(mount.firstChild);
    }

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 500;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);
    scene.fog = new THREE.FogExp2(0x090d16, 0.001);
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 3500);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(mapStyle === 'SATELLITE' ? 0xffffff : 0x0ea5e9, mapStyle === 'SATELLITE' ? 0.95 : 0.5);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.8);
    sunLight.position.set(300, 500, 200);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.7);
    fillLight.position.set(-250, 200, -200);
    scene.add(fillLight);

    // 5. Satellite Aerial Ground Surface Plane
    const satTexture = createSatelliteTexture();
    const groundGeo = new THREE.PlaneGeometry(1600, 1600);
    const groundMat = new THREE.MeshStandardMaterial({
      map: satTexture,
      roughness: 0.8,
      metalness: 0.1,
      bumpScale: 0.5
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Grid Overlay
    const gridHelper = new THREE.GridHelper(1600, 40, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = 0.5;
    scene.add(gridHelper);

    // 6. Extruded 3D City Building Blocks
    const buildingsGroup = new THREE.Group();
    scene.add(buildingsGroup);

    interactiveObjectsRef.current = [];

    const gridSize = 7;
    const spacing = 84;

    for (let i = -gridSize; i <= gridSize; i++) {
      for (let j = -gridSize; j <= gridSize; j++) {
        if (i > 4 && j > 1) continue;

        const dist = Math.sqrt(i * i + j * j);
        const bx = i * spacing;
        const bz = j * spacing;

        const matchedIncident = BLUEPRINT_INCIDENTS.find(inc =>
          Math.hypot(inc.coordinates.x - bx, inc.coordinates.z - bz) < 35
        );

        let bHeight = Math.max(35, 180 - dist * 16 + (Math.sin(i * 3 + j * 2) * 45));
        if (matchedIncident) {
          bHeight = matchedIncident.buildingHeight;
        }

        const bWidth = 36 + (Math.cos(i + j) * 10);
        const bDepth = 36 + (Math.sin(i - j) * 10);

        const bGeo = new THREE.BoxGeometry(bWidth, bHeight, bDepth);

        let bMat: THREE.Material;
        if (matchedIncident) {
          bMat = new THREE.MeshStandardMaterial({
            color: matchedIncident.severity === 'CRITICAL' ? 0xf43f5e : 0xf59e0b,
            roughness: 0.2,
            metalness: 0.8,
            emissive: matchedIncident.severity === 'CRITICAL' ? 0x9f1239 : 0x92400e,
            emissiveIntensity: 0.6
          });
        } else {
          bMat = new THREE.MeshStandardMaterial({
            color: (i + j) % 2 === 0 ? 0x334155 : 0x1e293b,
            roughness: 0.3,
            metalness: 0.6
          });
        }

        const bMesh = new THREE.Mesh(bGeo, bMat);
        bMesh.position.set(bx, bHeight / 2, bz);
        bMesh.castShadow = true;
        bMesh.receiveShadow = true;
        buildingsGroup.add(bMesh);

        const edges = new THREE.EdgesGeometry(bGeo);
        const lineMat = new THREE.LineBasicMaterial({
          color: matchedIncident ? 0xffffff : 0x64748b,
          transparent: true,
          opacity: matchedIncident ? 0.9 : 0.4
        });
        const line = new THREE.LineSegments(edges, lineMat);
        bMesh.add(line);

        if (bHeight > 100) {
          const roofGeo = new THREE.BoxGeometry(bWidth * 0.5, 8, bDepth * 0.5);
          const roofMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 });
          const roofMesh = new THREE.Mesh(roofGeo, roofMat);
          roofMesh.position.set(0, bHeight / 2 + 4, 0);
          bMesh.add(roofMesh);
        }

        if (matchedIncident) {
          bMesh.userData = { incident: matchedIncident };
          interactiveObjectsRef.current.push(bMesh);
        }
      }
    }

    // 7. Interactive 3D Incident Beacons & Volumetric Hazard Plumes
    const markersGroup = new THREE.Group();
    scene.add(markersGroup);

    BLUEPRINT_INCIDENTS.forEach(inc => {
      const spotGroup = new THREE.Group();
      spotGroup.position.set(inc.coordinates.x, 0, inc.coordinates.z);
      spotGroup.userData = { incident: inc };

      const markerColor = inc.severity === 'CRITICAL' ? 0xef4444 : inc.severity === 'HIGH' ? 0xf59e0b : 0x06b6d4;

      const laserGeo = new THREE.CylinderGeometry(0.8, 0.8, inc.buildingHeight + 80, 16);
      const laserMat = new THREE.MeshBasicMaterial({ color: markerColor, transparent: true, opacity: 0.8 });
      const laser = new THREE.Mesh(laserGeo, laserMat);
      laser.position.y = (inc.buildingHeight + 80) / 2;
      spotGroup.add(laser);

      const ringGeo = new THREE.RingGeometry(18, 24, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: markerColor, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = 2;
      spotGroup.add(ringMesh);

      const pinGeo = new THREE.OctahedronGeometry(9, 0);
      const pinMat = new THREE.MeshStandardMaterial({ color: markerColor, emissive: markerColor, emissiveIntensity: 0.8, roughness: 0.1 });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.y = inc.buildingHeight + 85;
      spotGroup.add(pinMesh);

      markersGroup.add(spotGroup);
      interactiveObjectsRef.current.push(pinMesh);
    });

    // 8. Animation Loop
    const animate = () => {
      animIdRef.current = requestAnimationFrame(animate);

      markersGroup.children.forEach(grp => {
        const pin = grp.children[2];
        if (pin) pin.rotation.y += 0.03;
      });

      const ctrl = controlsRef.current;

      if (!ctrl.isDragging && !ctrl.isPanning) {
        const r = ctrl.spherical.radius;
        const th = ctrl.spherical.theta;
        const ph = ctrl.spherical.phi;

        const destX = ctrl.target.x + r * Math.sin(ph) * Math.sin(th);
        const destY = ctrl.target.y + r * Math.cos(ph);
        const destZ = ctrl.target.z + r * Math.sin(ph) * Math.cos(th);

        camera.position.x += (destX - camera.position.x) * 0.08;
        camera.position.y += (destY - camera.position.y) * 0.08;
        camera.position.z += (destZ - camera.position.z) * 0.08;

        camera.lookAt(ctrl.target);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Controls & Mouse Events
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const ctrl = controlsRef.current;

    const handlePointerDown = (e: MouseEvent) => {
      ctrl.isDragging = true;
      ctrl.prevX = e.clientX;
      ctrl.prevY = e.clientY;
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (!ctrl.isDragging) return;

      const deltaX = e.clientX - ctrl.prevX;
      const deltaY = e.clientY - ctrl.prevY;

      ctrl.prevX = e.clientX;
      ctrl.prevY = e.clientY;

      if (e.buttons === 1) {
        ctrl.spherical.theta -= deltaX * 0.005;
        ctrl.spherical.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, ctrl.spherical.phi - deltaY * 0.005));
      } else if (e.buttons === 2) {
        ctrl.target.x -= deltaX * 0.5;
        ctrl.target.z -= deltaY * 0.5;
      }
    };

    const handlePointerUp = () => {
      ctrl.isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      ctrl.spherical.radius = Math.max(120, Math.min(900, ctrl.spherical.radius + e.deltaY * 0.4));
    };

    const handleClick = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / mount.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / mount.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjectsRef.current, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && !obj.userData?.incident) {
          obj = obj.parent;
        }
        if (obj && obj.userData?.incident) {
          const inc: IncidentSpot = obj.userData.incident;
          setSelectedSpot(inc);
          if (onFocusIncident) onFocusIncident(inc.id);

          ctrl.target.set(inc.coordinates.x, inc.buildingHeight / 2, inc.coordinates.z);
          ctrl.spherical.radius = 240;
        }
      }
    };

    const dom = mount;
    dom.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    dom.addEventListener('wheel', handleWheel, { passive: false });
    dom.addEventListener('click', handleClick);

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
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      dom.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      dom.removeEventListener('wheel', handleWheel);
      dom.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, [mapStyle]);

  useEffect(() => {
    const inc = BLUEPRINT_INCIDENTS.find(i => i.id === activeIncidentId);
    if (inc) {
      setSelectedSpot(inc);
      controlsRef.current.target.set(inc.coordinates.x, inc.buildingHeight / 2, inc.coordinates.z);
      controlsRef.current.spherical.radius = 240;
    }
  }, [activeIncidentId]);

  return (
    <div className={`relative w-full h-full overflow-hidden select-none font-sans bg-[#090d16] ${className}`}>
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full bg-[#090d16] cursor-grab active:cursor-grabbing" />

      {/* Top Left View Controls Overlay */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg flex items-center space-x-1">
          <button
            onClick={() => setMapStyle('SATELLITE')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
              mapStyle === 'SATELLITE'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3D Satellite City</span>
          </button>
          <button
            onClick={() => setMapStyle('BLUEPRINT')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
              mapStyle === 'BLUEPRINT'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Blueprint CAD</span>
          </button>
        </div>

        {/* Camera Preset Quick Jump Buttons */}
        <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg flex items-center space-x-1">
          <button
            onClick={() => {
              setCameraPreset('ISOMETRIC');
              controlsRef.current.spherical.theta = Math.PI / 3.6;
              controlsRef.current.spherical.phi = Math.PI / 3.4;
              controlsRef.current.spherical.radius = 420;
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            title="Isometric View"
          >
            <Compass className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setCameraPreset('TOP');
              controlsRef.current.spherical.theta = 0;
              controlsRef.current.spherical.phi = 0.05;
              controlsRef.current.spherical.radius = 500;
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            title="Top-Down Satellite View"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Right Incident Target Focus Pills */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-1.5 pointer-events-auto overflow-x-auto max-w-md">
        {BLUEPRINT_INCIDENTS.map(inc => {
          const isSelected = selectedSpot?.id === inc.id;
          return (
            <button
              key={inc.id}
              onClick={() => {
                setSelectedSpot(inc);
                if (onFocusIncident) onFocusIncident(inc.id);
                controlsRef.current.target.set(inc.coordinates.x, inc.buildingHeight / 2, inc.coordinates.z);
                controlsRef.current.spherical.radius = 240;
              }}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap shadow-sm flex items-center space-x-1 ${
                isSelected
                  ? 'bg-rose-600 border-rose-400 text-white shadow-rose-900/40'
                  : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-500'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${inc.severity === 'CRITICAL' ? 'bg-rose-400 animate-ping' : 'bg-amber-400'}`} />
              <span>{inc.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Incident 3D Location Card Overlay */}
      {selectedSpot && (
        <div className="absolute bottom-4 left-4 right-4 lg:left-4 lg:right-auto lg:max-w-sm z-20 bg-slate-900/95 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-2xl text-white pointer-events-auto animate-in fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <div className="flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full ${selectedSpot.severity === 'CRITICAL' ? 'bg-rose-500 animate-ping' : 'bg-amber-500'}`} />
              <span className="text-[10px] font-extrabold text-rose-400 uppercase tracking-wider">
                {selectedSpot.severity} THREAT • 3D PINPOINT
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {selectedSpot.coordinates.lat.toFixed(4)}°N, {selectedSpot.coordinates.lng.toFixed(4)}°E
            </span>
          </div>

          <h3 className="text-sm font-extrabold text-white tracking-tight flex items-center space-x-1.5">
            <Building className="w-4 h-4 text-cyan-400" />
            <span>{selectedSpot.name}</span>
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            <strong>Location:</strong> {selectedSpot.areaName} ({selectedSpot.floor})
          </p>

          <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-800/60 p-2 rounded-xl border border-white/5">
            {selectedSpot.description}
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800/80 p-2 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Risk Score</span>
              <span className="text-sm font-black text-rose-400">{selectedSpot.riskScore} / 100</span>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Building Height</span>
              <span className="text-sm font-black text-cyan-400">{selectedSpot.buildingHeight}m (3D Block)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeGeospatialMap;
