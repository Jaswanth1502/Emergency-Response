import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { useApp } from '../context/AppContext';
import { User, Bell, Palette, Map, Gauge, Save } from 'lucide-react';

export const Settings: React.FC = () => {
  const { currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'appearance' | 'map' | 'thresholds'>('profile');

  // Mock local state for settings
  const [notifSettings, setNotifSettings] = useState({
    emailAlerts: true,
    pushAlerts: true,
    smsAlerts: false,
    criticalOnly: false,
    weeklyDigest: true,
  });

  const [mapPrefs, setMapPrefs] = useState({
    defaultZoom: 14,
    showHazardZones: true,
    showEvacRoutes: true,
    showSensors: true,
    showResources: true,
  });

  const [thresholds, setThresholds] = useState({
    temperature: 65,
    smoke: 20,
    gas: 50,
    waterLevel: 3.5,
    seismic: 0.15,
  });

  const tabs = [
    { key: 'profile' as const, label: 'Profile', icon: <User className="w-4 h-4" /> },
    { key: 'notifications' as const, label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { key: 'appearance' as const, label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { key: 'map' as const, label: 'Map Preferences', icon: <Map className="w-4 h-4" /> },
    { key: 'thresholds' as const, label: 'Alert Thresholds', icon: <Gauge className="w-4 h-4" /> },
  ];

  const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string }> = ({ checked, onChange, label }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-300/15 last:border-0">
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${checked ? 'bg-cyan-500' : 'bg-slate-300'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${checked ? 'left-5' : 'left-0.5'}`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-300/25 pb-4">
        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">System Configuration</h2>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Dashboard / Preferences & Alert Tuning</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Tab Navigation */}
        <div className="lg:col-span-3">
          <GlassCard tint="slate">
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-left ${
                    activeTab === tab.key ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-white/60'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </GlassCard>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-9">
          {activeTab === 'profile' && (
            <GlassCard title="Officer Profile" subtitle="Personal information & credentials" tint="slate">
              <div className="space-y-4 mt-2">
                <div className="flex items-center gap-4">
                  <img src={currentUser?.avatarUrl} alt={currentUser?.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/50 shadow-md" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{currentUser?.name}</h3>
                    <p className="text-xs text-slate-500">{currentUser?.email}</p>
                    <p className="text-[10px] text-cyan-600 font-bold uppercase mt-0.5">{currentUser?.role} • {currentUser?.agency}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-300/20">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Display Name</label>
                    <input type="text" defaultValue={currentUser?.name} className="w-full px-3 py-2 bg-white/70 border border-slate-300/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/20" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Email</label>
                    <input type="email" defaultValue={currentUser?.email} className="w-full px-3 py-2 bg-white/70 border border-slate-300/50 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/20" />
                  </div>
                </div>
                <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md">
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </GlassCard>
          )}

          {activeTab === 'notifications' && (
            <GlassCard title="Notification Preferences" subtitle="Configure alert delivery channels" tint="slate">
              <div className="mt-2">
                <Toggle checked={notifSettings.emailAlerts} onChange={v => setNotifSettings(p => ({ ...p, emailAlerts: v }))} label="Email Alerts for Incidents" />
                <Toggle checked={notifSettings.pushAlerts} onChange={v => setNotifSettings(p => ({ ...p, pushAlerts: v }))} label="Push Notifications (Browser)" />
                <Toggle checked={notifSettings.smsAlerts} onChange={v => setNotifSettings(p => ({ ...p, smsAlerts: v }))} label="SMS Critical Alerts" />
                <Toggle checked={notifSettings.criticalOnly} onChange={v => setNotifSettings(p => ({ ...p, criticalOnly: v }))} label="Critical Severity Only Mode" />
                <Toggle checked={notifSettings.weeklyDigest} onChange={v => setNotifSettings(p => ({ ...p, weeklyDigest: v }))} label="Weekly Digest Summary" />
              </div>
            </GlassCard>
          )}

          {activeTab === 'appearance' && (
            <GlassCard title="Appearance Settings" subtitle="Visual theme configuration" tint="slate">
              <div className="space-y-4 mt-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-2">Theme Mode</label>
                  <div className="flex gap-3">
                    <button className="px-4 py-3 rounded-xl bg-white border-2 border-cyan-500 text-xs font-bold text-slate-800 shadow-sm">☀️ Light</button>
                    <button className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-xs font-bold text-slate-300 cursor-not-allowed opacity-60">🌙 Dark (Soon)</button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-2">Accent Tint Preview</label>
                  <div className="flex gap-2">
                    {['bg-cyan-500', 'bg-indigo-500', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-500'].map(c => (
                      <div key={c} className={`w-8 h-8 rounded-lg ${c} cursor-pointer border-2 border-white/50 shadow-sm hover:scale-110 transition-transform`} />
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === 'map' && (
            <GlassCard title="Map Display Preferences" subtitle="Default GIS layer configuration" tint="cyan">
              <div className="space-y-4 mt-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Default Zoom Level: {mapPrefs.defaultZoom}</label>
                  <input
                    type="range" min={10} max={18} value={mapPrefs.defaultZoom}
                    onChange={e => setMapPrefs(p => ({ ...p, defaultZoom: Number(e.target.value) }))}
                    className="w-full accent-cyan-500"
                  />
                </div>
                <Toggle checked={mapPrefs.showHazardZones} onChange={v => setMapPrefs(p => ({ ...p, showHazardZones: v }))} label="Show Hazard Buffer Zones" />
                <Toggle checked={mapPrefs.showEvacRoutes} onChange={v => setMapPrefs(p => ({ ...p, showEvacRoutes: v }))} label="Show Evacuation Route Corridors" />
                <Toggle checked={mapPrefs.showSensors} onChange={v => setMapPrefs(p => ({ ...p, showSensors: v }))} label="Show IoT Sensor Markers" />
                <Toggle checked={mapPrefs.showResources} onChange={v => setMapPrefs(p => ({ ...p, showResources: v }))} label="Show Emergency Resource Pins" />
              </div>
            </GlassCard>
          )}

          {activeTab === 'thresholds' && (
            <GlassCard title="Sensor Alert Thresholds" subtitle="Configure warning trigger levels per sensor type" tint="amber">
              <div className="space-y-5 mt-2">
                {[
                  { key: 'temperature' as const, label: 'Temperature Warning (°C)', min: 30, max: 100 },
                  { key: 'smoke' as const, label: 'Smoke Obscuration (%)', min: 5, max: 80 },
                  { key: 'gas' as const, label: 'Gas Concentration (ppm)', min: 10, max: 200 },
                  { key: 'waterLevel' as const, label: 'Water Level (meters)', min: 1, max: 6 },
                  { key: 'seismic' as const, label: 'Seismic Accel. (g)', min: 0.05, max: 0.5 },
                ].map(slider => (
                  <div key={slider.key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 font-semibold">{slider.label}</span>
                      <span className="font-mono font-bold text-amber-600">{thresholds[slider.key]}</span>
                    </div>
                    <input
                      type="range"
                      min={slider.min}
                      max={slider.max}
                      step={slider.key === 'seismic' ? 0.01 : slider.key === 'waterLevel' ? 0.1 : 1}
                      value={thresholds[slider.key]}
                      onChange={e => setThresholds(p => ({ ...p, [slider.key]: Number(e.target.value) }))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                ))}
                <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md mt-2">
                  <Save className="w-3.5 h-3.5" /> Apply Thresholds
                </button>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};
export default Settings;
