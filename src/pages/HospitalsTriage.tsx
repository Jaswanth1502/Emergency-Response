import React, { useState } from 'react';
import {
  Building2,
  Activity,
  Phone,
  Truck,
  RotateCcw,
  Check,
  AlertTriangle,
  Clock,
  Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HospitalsTriage: React.FC = () => {
  const { addNotification } = useApp();
  const [directedCount, setDirectedCount] = useState<Record<string, number>>({});
  const [isSyncing, setIsSyncing] = useState(false);

  const hospitalsData = [
    {
      id: 'HOSP-01',
      name: 'Metropolitan Level-1 Trauma Center',
      category: 'Trauma Center Level 1',
      badge: 'Surge Alert',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      occupancyPercent: 91,
      occupied: 472,
      total: 520,
      freeBeds: 48,
      surgeReserve: '+30',
      icuAvailable: '6 / 64',
      burnUnit: 'Available',
      burnColor: 'text-emerald-600',
      waitTime: '14 min',
      phone: '+1 (415) 555-0199',
      defaultAmbulances: 4
    },
    {
      id: 'HOSP-02',
      name: 'Bayfront Regional Medical Center',
      category: 'General Hospital',
      badge: 'Normal',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      occupancyPercent: 84,
      occupied: 420,
      total: 500,
      freeBeds: 112,
      surgeReserve: '+40',
      icuAvailable: '18 / 80',
      burnUnit: 'None',
      burnColor: 'text-slate-400',
      waitTime: '12 min',
      phone: '+1 (415) 555-0210',
      defaultAmbulances: 2
    },
    {
      id: 'HOSP-03',
      name: 'Pacific Specialized Burn & Hyperbaric Institute',
      category: 'Specialized Burn Unit',
      badge: 'Normal',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      occupancyPercent: 87,
      occupied: 156,
      total: 180,
      freeBeds: 24,
      surgeReserve: '+15',
      icuAvailable: '8 / 32',
      burnUnit: 'Available',
      burnColor: 'text-emerald-600',
      waitTime: '6 min',
      phone: '+1 (415) 555-0344',
      defaultAmbulances: 3
    },
    {
      id: 'HOSP-04',
      name: 'St. Luke Urgent Care & Emergency Clinic',
      category: 'Emergency Clinic',
      badge: 'Normal',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      occupancyPercent: 58,
      occupied: 70,
      total: 120,
      freeBeds: 38,
      surgeReserve: '+10',
      icuAvailable: '5 / 12',
      burnUnit: 'None',
      burnColor: 'text-slate-400',
      waitTime: '8 min',
      phone: '+1 (415) 555-0450',
      defaultAmbulances: 1
    }
  ];

  const handleDirectAmbulances = (hosp: typeof hospitalsData[0]) => {
    const current = directedCount[hosp.id] || 0;
    setDirectedCount({ ...directedCount, [hosp.id]: current + 1 });
    addNotification(`TRIAGE ROUTE DISPATCHED: Ambulance redirected to ${hosp.name}.`, "info");
  };

  const handleSyncTraumaNet = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      addNotification("TRAUMA NET SYNCHRONIZED: 4/4 Regional emergency medical centers reporting live intake queues.", "info");
    }, 600);
  };

  return (
    <div className="space-y-4 text-left font-sans">
      
      {/* Header & Sync Bar (Apple Liquid Glassmorphism) */}
      <div className="liquid-glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Hospitals & Medical Surge Capacity
          </h2>
          <p className="text-xs text-slate-500">
            Trauma intake queues, burn ICU availability & ambulance routing
          </p>
        </div>

        <button
          onClick={handleSyncTraumaNet}
          disabled={isSyncing}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-60"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Synchronizing Net...' : 'Sync Trauma Net'}</span>
        </button>
      </div>

      {/* 2x2 Grid of Hospital Cards (Apple Liquid Glassmorphism) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {hospitalsData.map(hosp => {
          const barColor = hosp.occupancyPercent >= 90 ? 'bg-rose-500' : hosp.occupancyPercent >= 80 ? 'bg-amber-500' : 'bg-emerald-500';
          const totalDirected = hosp.defaultAmbulances + (directedCount[hosp.id] || 0);

          return (
            <div
              key={hosp.id}
              className="liquid-glass-card p-5 rounded-2xl space-y-4 text-left hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              
              {/* Header: Icon + Title + Category + Badge */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50/90 text-blue-600 flex items-center justify-center font-black text-sm border border-blue-200/80 flex-shrink-0 shadow-2xs">
                    H
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                      {hosp.id}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                      {hosp.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {hosp.category}
                    </p>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border shadow-2xs ${hosp.badgeColor}`}>
                  ● {hosp.badge}
                </span>
              </div>

              {/* Bed Occupancy Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Bed Occupancy</span>
                  <span className="font-mono font-extrabold text-slate-900">
                    {hosp.occupancyPercent}% ({hosp.occupied}/{hosp.total})
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100/80 overflow-hidden">
                  <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${hosp.occupancyPercent}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="text-emerald-600 font-bold">{hosp.freeBeds} General Beds Free</span>
                  <span>Surge Reserve: {hosp.surgeReserve}</span>
                </div>
              </div>

              {/* Metrics Row: ICU, Burn Unit, Wait Time */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-white/60 rounded-xl border border-white/80 text-center shadow-2xs">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">ICU Available</span>
                  <span className="text-xs font-mono font-extrabold text-slate-900 mt-0.5 block">{hosp.icuAvailable}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Burn Unit</span>
                  <span className={`text-xs font-bold mt-0.5 block ${hosp.burnColor}`}>{hosp.burnUnit}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Wait Time</span>
                  <span className="text-xs font-mono font-extrabold text-slate-900 mt-0.5 block">{hosp.waitTime}</span>
                </div>
              </div>

              {/* Bottom Phone & Direct Ambulances CTA */}
              <div className="flex items-center justify-between pt-2 border-t border-white/60">
                <a
                  href={`tel:${hosp.phone}`}
                  className="flex items-center space-x-1.5 text-xs font-mono text-slate-500 hover:text-slate-900"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{hosp.phone}</span>
                </a>

                <button
                  onClick={() => handleDirectAmbulances(hosp)}
                  className="px-4 py-1.5 liquid-glass-pill hover:bg-slate-900 hover:text-white text-slate-700 font-extrabold text-xs rounded-xl transition-all shadow-2xs cursor-pointer flex items-center space-x-1"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Direct Ambulances ({totalDirected})</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
export default HospitalsTriage;
