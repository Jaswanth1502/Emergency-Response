import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/common/GlassCard';
import { MapPlaceholder } from '../components/map/MapPlaceholder';
import { Play, Pause, FastForward, Activity, ShieldAlert, Cpu } from 'lucide-react';

export const DigitalTwin: React.FC = () => {
  const { incidents, sensors, routes, triggerPredictiveSimulation, isSimulating, setIsSimulating } = useApp();
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [simulationLog, setSimulationLog] = useState<string[]>([
    "Digital Twin state initialized.",
    "Synchronized telemetry with 8 stream endpoints."
  ]);
  const [isSimLoading, setIsSimLoading] = useState(false);

  const activeThreatsCount = incidents.filter(i => i.status !== 'RESOLVED').length;
  const sensorsOnlineCount = sensors.filter(s => s.status !== 'OFFLINE').length;

  const handleRunPredictiveModel = async () => {
    setIsSimLoading(true);
    setSimulationLog(prev => [...prev, "Running high-resolution runoff fluid forecast..."]);
    const outcome = await triggerPredictiveSimulation();
    setSimulationLog(prev => [...prev, outcome]);
    setIsSimLoading(false);
  };

  const handleTogglePlay = () => {
    setIsSimulating(!isSimulating);
    setSimulationLog(prev => [...prev, isSimulating ? "Simulation paused." : "Simulation started (1x tick speed)."]);
  };

  // Convert active incidents to map pins
  const markers = incidents
    .filter(i => i.status !== 'RESOLVED')
    .map(i => ({
      id: i.id,
      lat: i.coordinates.lat,
      lng: i.coordinates.lng,
      label: i.title,
      severity: i.severity,
      type: i.type
    }));

  const zones = incidents
    .filter(i => i.status === 'ACTIVE' || i.status === 'DISPATCHED')
    .map(i => ({
      id: `Z-${i.id}`,
      center: i.coordinates,
      radiusMeter: i.affectedRadiusMeter,
      tint: (i.severity === 'CRITICAL' ? 'rose' : 'amber') as any,
      label: `${i.id} Buffer`
    }));

  // Map Routes
  const mapRoutes = routes.map(r => ({
    id: r.id,
    name: r.name,
    points: r.coordinates,
    congestion: r.congestionStatus
  }));

  return (
    <div className="space-y-6 text-left">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-300/25 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Smart City Digital Twin Ecosystem</h2>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Dashboard / Real-time Spatial Simulator</p>
        </div>
        <div className="mt-3 sm:mt-0 flex gap-2">
          <button
            onClick={handleRunPredictiveModel}
            disabled={isSimLoading}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer disabled:opacity-55"
          >
            <Cpu className="w-4 h-4" />
            <span>{isSimLoading ? "Synthesizing Mapped Data..." : "Run Predictive Scenario"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map dominant with side telemetry controls */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Playback & Controls & Map Area (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-300/30">
            <MapPlaceholder
              markers={markers}
              zones={zones}
              routes={mapRoutes}
              heightClass="h-[460px]"
              title="Autonomous Digital Twin Real-time Vector Grid"
            />
          </div>

          {/* Simulated Playback controls panel */}
          <GlassCard title="Scrub & Timeline Playback Simulator" subtitle="Synthesized EOC Event Replays" tint="cyan">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
              <div className="flex items-center space-x-2.5">
                <button
                  onClick={handleTogglePlay}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    isSimulating
                      ? 'bg-amber-500/10 text-amber-700 border-amber-500/30'
                      : 'bg-cyan-500/10 text-cyan-700 border-cyan-500/30'
                  }`}
                  title={isSimulating ? "Pause Playback" : "Start Playback"}
                >
                  {isSimulating ? <Pause className="w-4.5 h-4.5" /> : <Play className="w-4.5 h-4.5" />}
                </button>
                <button
                  onClick={() => {
                    const nextSpeed = playbackSpeed === 1 ? 2 : playbackSpeed === 2 ? 4 : 1;
                    setPlaybackSpeed(nextSpeed);
                    setSimulationLog(prev => [...prev, `Simulation speed set to ${nextSpeed}x.`]);
                  }}
                  className="p-2.5 rounded-xl bg-white/70 border border-slate-300/30 text-slate-700 hover:text-slate-950 transition-all flex items-center space-x-1 cursor-pointer text-xs font-bold"
                  title="Accelerate simulator"
                >
                  <FastForward className="w-4 h-4" />
                  <span>{playbackSpeed}x</span>
                </button>
              </div>

              {/* Fake progress bar */}
              <div className="flex-1 w-full space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>PLAYBACK TIMESTAMP: 14:15:00Z</span>
                  <span>SIMULATED DURATION: +02:45h</span>
                </div>
                <div className="w-full bg-slate-300/40 rounded-full h-2 overflow-hidden">
                  <div className="bg-cyan-500 h-full w-[65%] rounded-full animate-pulse" />
                </div>
              </div>

              <div className="text-[10px] text-slate-500 font-mono uppercase bg-slate-500/5 px-2 py-1.5 rounded border border-slate-300/30">
                ACTIVE FEEDS: 12 IoT ENGINES
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Side Panel: Layers, Telemetry stream readouts, Prediction logs (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          
          {/* Simulation Status Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white/70 backdrop-blur-md rounded-xl border border-white/40 flex items-center space-x-2.5 shadow-sm">
              <div className="p-2 bg-rose-500/10 text-rose-600 rounded-lg">
                <ShieldAlert className="w-4.5 h-4.5" />
              </div>
              <div className="leading-none text-left">
                <span className="text-[10px] text-slate-400 uppercase font-black">HAZARDS</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">{activeThreatsCount} Active</span>
              </div>
            </div>

            <div className="p-3 bg-white/70 backdrop-blur-md rounded-xl border border-white/40 flex items-center space-x-2.5 shadow-sm">
              <div className="p-2 bg-cyan-500/10 text-cyan-600 rounded-lg">
                <Activity className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div className="leading-none text-left">
                <span className="text-[10px] text-slate-400 uppercase font-black">SENSORS</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">{sensorsOnlineCount} Online</span>
              </div>
            </div>
          </div>

          {/* Telemetry live readouts */}
          <GlassCard title="EOC IoT Telemetry Sensors" subtitle="Instant digital stream values" tint="cyan">
            <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
              {sensors.map((sns) => (
                <div key={sns.id} className="flex items-center justify-between text-xs pb-2 border-b border-slate-300/10 last:border-0 last:pb-0">
                  <div className="text-left">
                    <span className="font-extrabold text-slate-800 block">{sns.name}</span>
                    <span className="text-[9px] text-slate-400 font-semibold">{sns.id} — {sns.type}</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-bold block ${
                      sns.status === 'CRITICAL' ? 'text-rose-600' : sns.status === 'WARNING' ? 'text-amber-500' : 'text-emerald-600'
                    }`}>
                      {sns.currentValue} {sns.unit}
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">{sns.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Simulator log updates */}
          <GlassCard title="Prediction Simulation Logs" subtitle="Dynamic AI coordination events" tint="slate" className="flex-1">
            <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1 font-mono text-[10px] text-slate-600">
              {simulationLog.map((log, index) => (
                <div key={index} className="flex items-start space-x-1.5 pb-1 border-b border-slate-300/10 last:border-0">
                  <span className="text-cyan-600 font-bold">&gt;&gt;</span>
                  <p className="leading-normal flex-1 text-left">{log}</p>
                </div>
              ))}
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};
export default DigitalTwin;
