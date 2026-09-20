import React, { useState } from 'react';
import {
  Radio,
  Send,
  CheckCircle2,
  ShieldAlert,
  MapPin,
  Zap,
  Trash2,
  CheckCheck
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
  protocolExecuted?: boolean;
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
      acknowledged: false,
      protocolExecuted: false
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
      acknowledged: false,
      protocolExecuted: false
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
      acknowledged: false,
      protocolExecuted: false
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
      acknowledged: false,
      protocolExecuted: false
    }
  ]);

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'UNACKNOWLEDGED'>('ALL');
  const [severityLevel, setSeverityLevel] = useState('Immediate Evacuation / Life Safety Hazard (Critical)');
  const [headline, setHeadline] = useState('EVACUATE DISTRICT 4 VIA MISSION CORRIDOR');
  const [instructions, setInstructions] = useState(
    'Dense toxic plume moving NE at 22km/h. Avoid Mission St between 3rd & 5th. Proceed immediately to Moscone West Shelter via 9th St Green Corridor.'
  );
  const [transmitting, setTransmitting] = useState(false);
  const [lastBroadcastSuccess, setLastBroadcastSuccess] = useState<string | null>(null);

  // Acknowledge single alert
  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, acknowledged: true } : a)));
    addNotification(`ALERT ACKNOWLEDGED: Emergency directive logged for ${id}.`, "info");
  };

  // Execute protocol action
  const handleExecuteProtocol = (id: string, protocolAction: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, protocolExecuted: true, acknowledged: true } : a)));
    addNotification(`PROTOCOL EXECUTED: ${protocolAction}`, "success");
  };

  // Remove/Dismiss single alert
  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    addNotification(`ALERT DISMISSED: ${id} cleared from stream.`, "info");
  };

  // Acknowledge All Alerts
  const handleAcknowledgeAll = () => {
    setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })));
    addNotification('ALL ALERTS ACKNOWLEDGED: Master commander override logged.', 'success');
  };

  // Clear Acknowledged Alerts
  const handleClearAcknowledged = () => {
    setAlerts(prev => prev.filter(a => !a.acknowledged));
    addNotification('CLEARED ACKNOWLEDGED ALERTS: Stream cleaned of handled items.', 'info');
  };

  // Quick Preset Handlers for WEA Broadcast Form
  const applyPresetEvacuation = () => {
    setSeverityLevel('Immediate Evacuation / Life Safety Hazard (Critical)');
    setHeadline('EVACUATE DISTRICT 4 VIA MISSION CORRIDOR');
    setInstructions('Dense toxic plume moving NE at 22km/h. Avoid Mission St between 3rd & 5th. Proceed immediately to Moscone West Shelter via 9th St Green Corridor.');
    addNotification('PRESET APPLIED: Evacuation Order Template loaded.', 'info');
  };

  const applyPresetChemical = () => {
    setSeverityLevel('Shelter-in-Place / Chemical Vapor Warning (High)');
    setHeadline('CHEMICAL VAPOR ADVISORY — SHELTER IN PLACE');
    setInstructions('Industrial airborne chemical release detected at Port Zone. Close all windows, shut down HVAC units, and seal door gaps with damp towels. Remain indoors until safe signal.');
    addNotification('PRESET APPLIED: Chemical Vapor Shelter Template loaded.', 'info');
  };

  const applyPresetFlood = () => {
    setSeverityLevel('Public Safety Advisory / Traffic Diversion (Medium)');
    setHeadline('COASTAL SURGE ALERT — EVACUATE LOWLANDS');
    setInstructions('High tidal breach causing water surge on Pier 28. Evacuate subterranean parking structures and move to elevated terrain above 3rd Street immediately.');
    addNotification('PRESET APPLIED: Tidal Flood Surge Template loaded.', 'info');
  };

  // Form Submit Handler
  const handleTransmitBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setTransmitting(true);
    setLastBroadcastSuccess(null);

    setTimeout(() => {
      setTransmitting(false);
      const newAlertId = `WEA-${Math.floor(100 + Math.random() * 900)}`;
      
      const newBroadcastItem: LiveAlertItem = {
        id: newAlertId,
        severity: severityLevel.includes('Critical') ? 'CRITICAL' : 'WARNING',
        timeAgo: 'Just now',
        exactTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
        title: headline,
        description: instructions,
        protocolAction: `Cell Broadcast Active: Transmitted via WEA / EAS to 42,000 geo-fenced devices.`,
        location: 'District 4 & Surrounding Geo-Polygon',
        acknowledged: false,
        protocolExecuted: true
      };

      setAlerts(prev => [newBroadcastItem, ...prev]);
      setLastBroadcastSuccess(`✓ CELL-TOWER WEA BROADCAST SENT: "${headline}" transmitted to ~42,000 active mobile subscribers.`);
      
      addNotification(
        `CELL-TOWER WEA BROADCAST TRANSMITTED: "${headline}" active across cellular carriers.`,
        "warning"
      );
    }, 700);
  };

  // Filter alerts stream
  const filteredAlerts = alerts.filter(a => {
    if (activeFilter === 'CRITICAL') return a.severity === 'CRITICAL';
    if (activeFilter === 'WARNING') return a.severity === 'WARNING';
    if (activeFilter === 'UNACKNOWLEDGED') return !a.acknowledged;
    return true;
  });

  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL' && !a.acknowledged).length;

  return (
    <div className="space-y-4 text-left font-sans select-none">
      
      {/* Top Header & Master Action Bar */}
      <div className="liquid-glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Emergency Alert & Notification System
            </h2>
            {criticalCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-extrabold border border-rose-200 shadow-2xs flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                <span>● {criticalCount} UNHANDLED CRITICAL</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200 shadow-2xs">
                ✓ ALL ALERTS ACKNOWLEDGED
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Prioritized System Warnings & Civilian Cell Broadcasts
          </p>
        </div>

        {/* Master Bulk Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAcknowledgeAll}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Acknowledge All</span>
          </button>
          <button
            onClick={handleClearAcknowledged}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Clear Handled</span>
          </button>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: LIVE ALERT STREAM (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          
          {/* Stream Filter Pills */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 pl-1 block">
              LIVE ALERT STREAM ({filteredAlerts.length})
            </span>

            <div className="flex items-center space-x-1 bg-white/70 p-1 rounded-xl border border-white/90 shadow-2xs">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                  activeFilter === 'ALL' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ALL ({alerts.length})
              </button>
              <button
                onClick={() => setActiveFilter('CRITICAL')}
                className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                  activeFilter === 'CRITICAL' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-rose-600'
                }`}
              >
                CRITICAL ({alerts.filter(a => a.severity === 'CRITICAL').length})
              </button>
              <button
                onClick={() => setActiveFilter('WARNING')}
                className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                  activeFilter === 'WARNING' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-amber-600'
                }`}
              >
                WARNING ({alerts.filter(a => a.severity === 'WARNING').length})
              </button>
              <button
                onClick={() => setActiveFilter('UNACKNOWLEDGED')}
                className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                  activeFilter === 'UNACKNOWLEDGED' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                UNACKNOWLEDGED ({alerts.filter(a => !a.acknowledged).length})
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="liquid-glass-card p-8 rounded-2xl text-center text-slate-500 font-medium">
                No alerts match the selected filter.
              </div>
            ) : (
              filteredAlerts.map(alert => {
                const isCrit = alert.severity === 'CRITICAL';
                const badgeClass = isCrit
                  ? 'bg-rose-600 text-white'
                  : 'bg-amber-500 text-white';

                return (
                  <div
                    key={alert.id}
                    className={`liquid-glass-card p-5 rounded-2xl space-y-3 text-left transition-all ${
                      alert.acknowledged ? 'opacity-85' : 'hover:-translate-y-0.5 shadow-sm'
                    }`}
                  >
                    
                    {/* Top: Severity Badge + Time */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase ${badgeClass} shadow-2xs`}>
                          ● {alert.severity}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-500">
                          {alert.id}
                        </span>
                      </div>
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
                    <div className="p-3 bg-white/80 rounded-xl border border-white/90 shadow-2xs text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900">Protocol Action:</span>
                        {alert.protocolExecuted ? (
                          <span className="text-[10px] font-extrabold text-emerald-600 flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Executed & Dispatched</span>
                          </span>
                        ) : null}
                      </div>
                      <p className="text-slate-700 font-medium leading-normal">{alert.protocolAction}</p>
                    </div>

                    {/* Footer: Location & Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-100/60">
                      <span className="text-[11px] text-slate-500 font-medium flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-xs">{alert.location}</span>
                      </span>

                      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                        {/* Execute Protocol CTA */}
                        {!alert.protocolExecuted && (
                          <button
                            onClick={() => handleExecuteProtocol(alert.id, alert.protocolAction)}
                            className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold transition-all cursor-pointer shadow-2xs flex items-center space-x-1"
                          >
                            <Zap className="w-3 h-3" />
                            <span>Execute Protocol</span>
                          </button>
                        )}

                        {/* Acknowledge Button */}
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

                        {/* Dismiss Button */}
                        <button
                          onClick={() => handleDismissAlert(alert.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer transition-colors"
                          title="Dismiss Alert"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Public Cell-Tower Broadcast (WEA) (5 cols) */}
        <div className="lg:col-span-5">
          <div className="liquid-glass-card p-6 rounded-2xl space-y-4 text-left sticky top-4">
            
            {/* Header with Broadcast Icon */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                  Public Cell-Tower Broadcast (WEA)
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                WEA / EAS Channel
              </span>
            </div>

            {/* Success Banner after Transmit */}
            {lastBroadcastSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-1 animate-in fade-in">
                <div className="flex items-center space-x-1.5 font-extrabold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Broadcast Transmitted Successfully</span>
                </div>
                <p className="text-[11px] text-emerald-700 font-medium">
                  {lastBroadcastSuccess}
                </p>
              </div>
            )}

            {/* Quick Template Presets */}
            <div className="space-y-1">
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                QUICK TEMPLATE PRESETS
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={applyPresetEvacuation}
                  className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-[10px] font-extrabold rounded-xl transition-all cursor-pointer truncate shadow-2xs"
                >
                  🚨 Evacuation
                </button>
                <button
                  type="button"
                  onClick={applyPresetChemical}
                  className="px-2 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-extrabold rounded-xl transition-all cursor-pointer truncate shadow-2xs"
                >
                  ☣️ Chemical
                </button>
                <button
                  type="button"
                  onClick={applyPresetFlood}
                  className="px-2 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-[10px] font-extrabold rounded-xl transition-all cursor-pointer truncate shadow-2xs"
                >
                  🌊 Flood Surge
                </button>
              </div>
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

              {/* Transmit Civilian Broadcast Button */}
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
