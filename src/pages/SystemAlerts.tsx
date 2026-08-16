import React, { useState } from 'react';
import {
  Radio,
  Send,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Bell,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LiveAlertItem {
  id: string;
  severity: 'CRITICAL' | 'WARNING';
  timeAgo: string;
  exactTime: string;
  title: string;
  description: string;
  protocolAction: string;
  location: string;
  acknowledged: boolean;
}

export const SystemAlerts: React.FC = () => {
  const { addNotification } = useApp();

  const [alerts, setAlerts] = useState<LiveAlertItem[]>([
    {
      id: 'ALT-01',
      severity: 'CRITICAL',
      timeAgo: '2 min ago',
      exactTime: '14:44:12',
      title: 'Flashover Risk Breach — Mission Plaza Commercial Tower',
      description: 'Thermal sensor array 6F registered rapid spike to 485°C. Flammable solvents detected in subterranean storage.',
      protocolAction: 'Immediate defensive water curtain and USAR drone reconnaissance.',
      location: '450 Mission St, 6th Fl & Sub-Basement B',
      acknowledged: false
    },
    {
      id: 'ALT-02',
      severity: 'CRITICAL',
      timeAgo: '8 min ago',
      exactTime: '14:38:00',
      title: 'Explosive Lower Limit Alert — 8th & Market Concourse',
      description: 'Methane gas detector LEL reached 68%. High ignition hazard in transit concourse level.',
      protocolAction: 'Cut power to 3rd rail transit feeds and establish 300m civilian exclusion perimeter.',
      location: '8th & Market Intermodal Transit Hub',
      acknowledged: false
    },
    {
      id: 'ALT-03',
      severity: 'WARNING',
      timeAgo: '14 min ago',
      exactTime: '14:32:15',
      title: 'Seawall Tidal Gate Surge — Pier 28 Basin',
      description: 'Water level measured at +3.42m above baseline mean high tide. Rate of rise +18cm / 10min.',
      protocolAction: 'Deploy swiftwater rescue team and close Embarcadero underpass.',
      location: 'Pier 28 Lowland Corridor',
      acknowledged: false
    },
    {
      id: 'ALT-04',
      severity: 'WARNING',
      timeAgo: '25 min ago',
      exactTime: '14:20:00',
      title: 'Highway 101 Overpass Hazardous Vehicle Spill',
      description: '3-vehicle crash on overpass. Solvent container leaking into drainage culvert.',
      protocolAction: 'Deploy HazMat absorbent booms and divert traffic.',
      location: 'Highway 101 & Central Expressway',
      acknowledged: false
    }
  ]);

  const [severityLevel, setSeverityLevel] = useState('Immediate Evacuation / Life Safety Hazard (Critical)');
  const [headline, setHeadline] = useState('EVACUATE DISTRICT 4 VIA MISSION CORRIDOR');
  const [instructions, setInstructions] = useState(
    'Dense toxic plume moving NE at 22km/h. Avoid Mission St between 3rd & 5th. Proceed immediately to Moscone West Shelter via 9th St Green Corridor.'
  );
  const [transmitting, setTransmitting] = useState(false);

  const handleAcknowledge = (id: string) => {
    setAlerts(alerts.map(a => (a.id === id ? { ...a, acknowledged: true } : a)));
    addNotification(`ALERT ACKNOWLEDGED: Emergency directive logged for ${id}.`, "info");
  };

  const handleTransmitBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setTransmitting(true);
    setTimeout(() => {
      setTransmitting(false);
      addNotification(
        `CELL-TOWER WEA BROADCAST SENT: "${headline}" transmitted to ~42,000 geo-fenced mobile subscribers.`,
        "warning"
      );
    }, 800);
  };

  return (
    <div className="space-y-4 text-left font-sans">
      
      {/* Top Header */}
      <div className="liquid-glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Emergency Alert & Notification System
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-extrabold border border-rose-200 shadow-2xs">
              ● 2 CRITICAL
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Prioritized System Warnings & Civilian Cell Broadcasts
          </p>
        </div>
      </div>

      {/* 2-Column Layout (Matching Screenshot 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: LIVE ALERT STREAM (4) (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 pl-1 block">
            LIVE ALERT STREAM ({alerts.length})
          </span>

          <div className="space-y-3">
            {alerts.map(alert => {
              const isCrit = alert.severity === 'CRITICAL';
              const badgeClass = isCrit
                ? 'bg-rose-600 text-white'
                : 'bg-amber-500 text-white';

              return (
                <div
                  key={alert.id}
                  className="liquid-glass-card p-5 rounded-2xl space-y-3 text-left hover:-translate-y-0.5 transition-all"
                >
                  
                  {/* Top: Severity Badge + Time */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase ${badgeClass} shadow-2xs`}>
                      ● {alert.severity}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {alert.timeAgo} ({alert.exactTime})
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                      {alert.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      {alert.description}
                    </p>
                  </div>

                  {/* Protocol Action Box */}
                  <div className="p-3 bg-white/70 rounded-xl border border-white/90 shadow-2xs text-xs">
                    <span className="font-extrabold text-slate-900">Protocol Action: </span>
                    <span className="text-slate-700 font-medium">{alert.protocolAction}</span>
                  </div>

                  {/* Footer: Location & Acknowledge Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100/60">
                    <span className="text-[11px] text-slate-500 font-medium flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{alert.location}</span>
                    </span>

                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      disabled={alert.acknowledged}
                      className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        alert.acknowledged
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                          : 'liquid-glass-pill text-slate-700 hover:bg-slate-900 hover:text-white shadow-2xs'
                      }`}
                    >
                      {alert.acknowledged ? '✓ Acknowledged' : 'Acknowledge'}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Public Cell-Tower Broadcast (WEA) (5 cols) */}
        <div className="lg:col-span-5">
          <div className="liquid-glass-card p-6 rounded-2xl space-y-4 text-left sticky top-4">
            
            {/* Header with Broadcast Icon */}
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                Public Cell-Tower Broadcast (WEA)
              </h3>
            </div>

            <form onSubmit={handleTransmitBroadcast} className="space-y-4">
              
              {/* Alert Severity Level Dropdown */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">
                  ALERT SEVERITY LEVEL
                </label>
                <select
                  value={severityLevel}
                  onChange={e => setSeverityLevel(e.target.value)}
                  className="w-full liquid-glass-pill px-3 py-2 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer shadow-2xs"
                >
                  <option value="Immediate Evacuation / Life Safety Hazard (Critical)">
                    Immediate Evacuation / Life Safety Hazard (Critical)
                  </option>
                  <option value="Shelter-in-Place / Chemical Vapor Warning (High)">
                    Shelter-in-Place / Chemical Vapor Warning (High)
                  </option>
                  <option value="Public Safety Advisory / Traffic Diversion (Medium)">
                    Public Safety Advisory / Traffic Diversion (Medium)
                  </option>
                </select>
              </div>

              {/* Broadcast Headline Input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                    BROADCAST HEADLINE (MAX 60 CHARS)
                  </label>
                  <span className="text-[9px] font-mono text-slate-400">
                    {headline.length}/60
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={60}
                  required
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  placeholder="e.g. EVACUATE DISTRICT 4 VIA MISSION CORRIDOR"
                  className="w-full liquid-glass-pill px-3 py-2 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs uppercase"
                />
              </div>

              {/* Civilian Instructions Textarea */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">
                  CIVILIAN INSTRUCTIONS TEXT
                </label>
                <textarea
                  rows={4}
                  required
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  placeholder="Detailed guidance, safe destinations, and toxic plume avoidance directions..."
                  className="w-full liquid-glass-pill p-3 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs leading-relaxed resize-none"
                />
              </div>

              {/* Human Commander Confirmation Required Alert Box */}
              <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs space-y-1">
                <div className="flex items-center space-x-1.5 font-black text-[11px]">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                  <span>Human Commander Confirmation Required</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-tight">
                  Will reach an estimated 42,000 active mobile subscribers within geo-fenced polygons.
                </p>
              </div>

              {/* Transmit Civilian Broadcast Button (Screenshot 4 Orange CTA) */}
              <button
                type="submit"
                disabled={transmitting}
                className="w-full py-3.5 bg-[#F58220] hover:bg-[#E07010] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
              >
                {transmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Transmit Civilian Broadcast</span>
                  </>
                )}
              </button>

            </form>

          </div>
        </div>

      </div>

    </div>
  );
};
export default SystemAlerts;
