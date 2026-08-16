import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Building,
  Flame,
  Truck,
  Radio,
  Milestone,
  Building2,
  Wind,
  Check,
  Zap,
  Activity,
  Layers,
  Maximize2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TacticalGisMap } from '../components/map/TacticalGisMap';

export const DigitalTwin: React.FC = () => {
  const { addNotification, deployResource } = useApp();
  
  const [viewTab, setViewTab] = useState<'3D' | '2D'>('3D');
  const [selectedScenario, setSelectedScenario] = useState<'fire' | 'flood' | 'gas'>('fire');
  const [isPlaying, setIsPlaying] = useState(false);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [timeOffset, setTimeOffset] = useState<number>(0); // -120 to +60 minutes
  
  const [agent1Approved, setAgent1Approved] = useState(false);
  const [agent2Approved, setAgent2Approved] = useState(false);

  const [layers, setLayers] = useState({
    buildings: true,
    hazards: true,
    fleet: true,
    sensors: true,
    evac: true,
    hospitals: true,
    wind: true
  });

  // Real-time timeline player effect
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeOffset(prev => (prev >= 60 ? -120 : prev + 5 * simSpeed));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, simSpeed]);

  const getTimeLabel = (offset: number) => {
    if (offset === 0) return 'LIVE REALTIME (0m)';
    if (offset < 0) return `${offset} Min`;
    return `+${offset} Min (AI Pred)`;
  };

  const handleApproveAgent1 = () => {
    setAgent1Approved(true);
    deployResource('RES-005', 'INC-2026-0891');
    addNotification("AI AGENT DISPATCH AUTHORIZED: Foam Unit F-04 and ALS Ambulance A-05 en route.", "info");
  };

  const handleApproveAgent2 = () => {
    setAgent2Approved(true);
    addNotification("CORRIDOR REDIRECTION ENGAGED: 8th St Turnstiles locked. 9th St Green Corridor activated.", "warning");
  };

  return (
    <div className="space-y-4 text-left font-sans">
      
      {/* Top Controls Bar (Apple Liquid Glassmorphism) */}
      <div className="liquid-glass-card p-2.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* 3D Digital Twin / 2D GIS Switcher */}
        <div className="flex items-center space-x-2 bg-white/60 p-0.5 rounded-xl border border-white/80 shadow-2xs backdrop-blur-md">
          <button
            onClick={() => setViewTab('3D')}
            className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              viewTab === '3D'
                ? 'liquid-glass-pill text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            3D Digital Twin
          </button>
          <button
            onClick={() => setViewTab('2D')}
            className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              viewTab === '2D'
                ? 'liquid-glass-pill text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            2D GIS Satellite
          </button>
        </div>

        {/* Physics & AI Analytics Badges */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-50/90 text-emerald-700 border border-emerald-200/60 rounded-xl text-xs font-bold font-mono shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Physics Mesh: Nominal (60 FPS)</span>
          </div>

          <button
            onClick={() => addNotification("AI TWIN ANALYTICS: Plume dispersion analysis complete. 94% predictive confidence.", "info")}
            className="px-3.5 py-1.5 liquid-glass-blue hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Twin Analytics</span>
          </button>
        </div>

      </div>

      {/* Main Digital Twin Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Control Panel (3 cols) - Layers & Scenarios */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Digital Twin Layers Checklist */}
          <div className="liquid-glass-card rounded-2xl p-4 space-y-3">
            <div className="flex items-center space-x-2 border-b border-white/60 pb-2">
              <Layers className="w-4 h-4 text-slate-600" />
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                DIGITAL TWIN LAYERS
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { id: 'buildings', label: '3D Buildings', icon: <Building className="w-3.5 h-3.5 text-blue-500" /> },
                { id: 'hazards', label: 'Incidents & Hazards', icon: <Flame className="w-3.5 h-3.5 text-rose-500" /> },
                { id: 'fleet', label: 'Emergency Fleet', icon: <Truck className="w-3.5 h-3.5 text-purple-500" /> },
                { id: 'sensors', label: 'IoT Sensor Mesh', icon: <Radio className="w-3.5 h-3.5 text-cyan-500" /> },
                { id: 'evac', label: 'Evacuation Corridors', icon: <Milestone className="w-3.5 h-3.5 text-emerald-500" /> },
                { id: 'hospitals', label: 'Hospitals & Shelters', icon: <Building2 className="w-3.5 h-3.5 text-blue-600" /> },
                { id: 'wind', label: 'Wind / Plume Vectors', icon: <Wind className="w-3.5 h-3.5 text-sky-500" /> }
              ].map(layer => (
                <label key={layer.id} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-center space-x-2.5">
                    {layer.icon}
                    <span className="font-semibold text-slate-700">{layer.label}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers[layer.id as keyof typeof layers]}
                    onChange={e => setLayers({ ...layers, [layer.id]: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Active Scenarios Selector */}
          <div className="liquid-glass-card rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/60 pb-2">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                ACTIVE SCENARIOS
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">6 total</span>
            </div>

            <div className="space-y-2">
              {/* Fire Scenario */}
              <div
                onClick={() => setSelectedScenario('fire')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedScenario === 'fire'
                    ? 'liquid-glass-blue border-blue-400/80 shadow-xs'
                    : 'bg-white/60 border-white/80 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs">Fire</span>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50/90 px-2 py-0.5 rounded-full border border-rose-200 shadow-2xs">
                    ● Critical
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-1">Multi-Story Commercial Fire & Chemical Storag...</p>
              </div>

              {/* Flood Scenario */}
              <div
                onClick={() => setSelectedScenario('flood')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedScenario === 'flood'
                    ? 'liquid-glass-blue border-blue-400/80 shadow-xs'
                    : 'bg-white/60 border-white/80 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs">Flood</span>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50/90 px-2 py-0.5 rounded-full border border-amber-200 shadow-2xs">
                    ▲ High
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-1">Flash Flood & Subsurface Storm Drainage...</p>
              </div>

              {/* Gas Leak Scenario */}
              <div
                onClick={() => setSelectedScenario('gas')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedScenario === 'gas'
                    ? 'liquid-glass-blue border-blue-400/80 shadow-xs'
                    : 'bg-white/60 border-white/80 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs">Gas Leak</span>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50/90 px-2 py-0.5 rounded-full border border-rose-200 shadow-2xs">
                    ● Critical
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-1">Seismic Rupture & Natural Gas Pipeline Fract...</p>
              </div>
            </div>

          </div>

        </div>

        {/* Center/Right 3D Digital Twin Viewport & Decision Engine (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          
          {/* Spatial Focus & Twin Decision Cards (Apple Liquid Glassmorphism) */}
          <div className="liquid-glass-card rounded-2xl p-5 space-y-4">
            
            {/* Spatial Focus Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/60 pb-3 gap-2">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">SPATIAL FOCUS</span>
                <h2 className="text-sm lg:text-base font-extrabold text-slate-900 tracking-tight">
                  Multi-Story Commercial Fire & Chemical Storage Risk
                </h2>
                <p className="text-xs text-slate-500">District 4, 450 Mission Financial Plaza</p>
              </div>
              <div className="flex items-center space-x-4 text-xs font-mono">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block font-bold">RISK</span>
                  <span className="font-extrabold text-rose-600 text-sm">94/100</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block font-bold">RADIUS</span>
                  <span className="font-extrabold text-slate-800 text-sm">450m</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block font-bold">POP</span>
                  <span className="font-extrabold text-slate-800 text-sm">2850</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-rose-50/90 text-rose-600 border border-rose-200 text-xs font-extrabold shadow-2xs">
                  ● Critical
                </span>
              </div>
            </div>

            {/* Twin Decision Engine */}
            <div className="space-y-3">
              <div className="flex items-center space-x-1.5 text-xs font-extrabold text-blue-700 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Twin Decision Engine</span>
              </div>

              {/* Agent 1 */}
              <div className="p-3 bg-white/70 rounded-xl border border-white/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs">
                <div className="space-y-1 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-xs">Predictive Resource Allocation Agent</span>
                    <span className="text-[10px] font-mono text-blue-600 font-extrabold">94%</span>
                  </div>
                  <p className="text-xs text-slate-600 max-w-2xl">
                    Based on 485°C thermal surge and hydrocarbon solvent risk in B2, recommend deploying Foam Unit F-04 (ETA 2m) and redirecting ALS Ambulance A-05 from SOMA depot.
                  </p>
                </div>
                {!agent1Approved ? (
                  <button
                    onClick={handleApproveAgent1}
                    className="px-5 py-2 bg-[#F58220] hover:bg-[#E07010] text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex-shrink-0 cursor-pointer"
                  >
                    Approve Action
                  </button>
                ) : (
                  <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-2xs">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dispatched</span>
                  </span>
                )}
              </div>

              {/* Agent 2 */}
              <div className="p-3 bg-white/70 rounded-xl border border-white/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs">
                <div className="space-y-1 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-xs">Dynamic Evacuation Corridors Agent</span>
                    <span className="text-[10px] font-mono text-blue-600 font-extrabold">91%</span>
                  </div>
                  <p className="text-xs text-slate-600 max-w-2xl">
                    Lower Concourse methane concentration at 68% LEL with downwind dispersal towards Mission St. Lock turnstiles at 8th St, redirect pedestrians via 9th St green corridor.
                  </p>
                </div>
                {!agent2Approved ? (
                  <button
                    onClick={handleApproveAgent2}
                    className="px-5 py-2 bg-[#F58220] hover:bg-[#E07010] text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex-shrink-0 cursor-pointer"
                  >
                    Approve Action
                  </button>
                ) : (
                  <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-2xs">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Corridor Active</span>
                  </span>
                )}
              </div>

            </div>

            {/* Live Sensor Ingest */}
            <div className="p-3 bg-white/60 rounded-xl border border-white/80 flex items-center justify-between shadow-2xs">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                <div>
                  <span className="font-bold text-slate-900 text-xs block">Live Sensor Ingest</span>
                  <span className="text-[11px] text-slate-500">Thermal Array 6F East Corridor (Temperature)</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-rose-600 font-mono">485 °C</span>
              </div>
            </div>

          </div>

          {/* Interactive 3D/2D Viewport Map */}
          <div className="rounded-2xl overflow-hidden shadow-xs">
            <TacticalGisMap
              viewMode={viewTab}
              onViewModeChange={setViewTab}
              heightClass="h-[440px]"
            />
          </div>

          {/* Bottom Timeline Simulation Bar (Apple Liquid Glassmorphism) */}
          <div className="liquid-glass-card rounded-2xl p-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Playback Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-600/20 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={() => { setTimeOffset(0); setIsPlaying(false); }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              {/* Speed Multipliers */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                {[1, 2, 5, 10].map(s => (
                  <button
                    key={s}
                    onClick={() => setSimSpeed(s)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      simSpeed === s ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Slider */}
            <div className="flex-1 w-full max-w-xl space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 font-mono">
                <span>-2 Hours</span>
                <span>-30 Min</span>
                <span className="text-blue-600 font-extrabold">● LIVE REALTIME</span>
                <span>+30 Min (AI Pred)</span>
                <span>+1 Hour (AI Pred)</span>
              </div>
              <input
                type="range"
                min="-120"
                max="60"
                step="5"
                value={timeOffset}
                onChange={e => setTimeOffset(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="text-center">
                <span className="text-[11px] font-mono font-bold text-slate-700">
                  Time Offset: {getTimeLabel(timeOffset)}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
export default DigitalTwin;
