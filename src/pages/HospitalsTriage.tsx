import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone,
  Truck,
  RotateCcw,
  Flame,
  ArrowRightLeft,
  Search,
  BedDouble,
  ShieldAlert,
  Activity,
  UserPlus,
  X,
  Building2,
  Send,
  CheckCircle2,
  BarChart3,
  ShieldCheck,
  AlertTriangle,
  Navigation,
  Compass,
  MapPin,
  Radio,
  Clock,
  Zap,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface HospitalItem {
  id: string;
  name: string;
  category: string;
  district: string;
  badge: 'Critical Surge' | 'Surge Alert' | 'Operational Normal';
  badgeStyle: string;
  occupancyPercent: number;
  occupied: number;
  total: number;
  freeBeds: number;
  surgeReserve: number;
  icuAvailable: string;
  burnUnit: string;
  burnColor: string;
  hazmatBeds: number;
  waitTime: string;
  phone: string;
  defaultAmbulances: number;
  triageRed: number;
  triageYellow: number;
  triageGreen: number;
  isDiverting?: boolean;
  surgeActive?: boolean;
}

export const HospitalsTriage: React.FC = () => {
  const { addNotification, currentRole } = useApp();
  const navigate = useNavigate();

  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'CRITICAL' | 'BURN' | 'TRAUMA'>('ALL');
  
  // Interactive hospital state
  const [hospitals, setHospitals] = useState<HospitalItem[]>([
    {
      id: 'HOSP-01',
      name: 'King George Hospital (KGH Vizag)',
      category: 'Level-1 Trauma & Emergency Burn Center',
      district: 'Visakhapatnam Coastal AP',
      badge: 'Critical Surge',
      badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200/80',
      occupancyPercent: 94,
      occupied: 488,
      total: 520,
      freeBeds: 32,
      surgeReserve: 30,
      icuAvailable: '6 / 48',
      burnUnit: '8 Beds (Surge Active)',
      burnColor: 'text-rose-600 font-bold',
      hazmatBeds: 12,
      waitTime: '18 min',
      phone: '+91 891 256 4891',
      defaultAmbulances: 6,
      triageRed: 16,
      triageYellow: 22,
      triageGreen: 18,
      isDiverting: false,
      surgeActive: true
    },
    {
      id: 'HOSP-02',
      name: 'Government General Hospital (GGH Vijayawada)',
      category: 'Level-1 State Trauma Command Hub',
      district: 'Vijayawada Central AP',
      badge: 'Surge Alert',
      badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200/80',
      occupancyPercent: 91,
      occupied: 472,
      total: 520,
      freeBeds: 48,
      surgeReserve: 40,
      icuAvailable: '12 / 64',
      burnUnit: '4 Beds Available',
      burnColor: 'text-emerald-700 font-semibold',
      hazmatBeds: 18,
      waitTime: '14 min',
      phone: '+91 866 257 4401',
      defaultAmbulances: 4,
      triageRed: 12,
      triageYellow: 24,
      triageGreen: 28,
      isDiverting: false,
      surgeActive: false
    },
    {
      id: 'HOSP-03',
      name: 'SVIMS Super Speciality Hospital (Tirupati)',
      category: 'Specialized Cardiac & Burn Resuscitation Center',
      district: 'Tirupati Shrine Corridor AP',
      badge: 'Operational Normal',
      badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      occupancyPercent: 74,
      occupied: 355,
      total: 480,
      freeBeds: 125,
      surgeReserve: 25,
      icuAvailable: '22 / 56',
      burnUnit: '6 Beds Available',
      burnColor: 'text-emerald-700 font-semibold',
      hazmatBeds: 25,
      waitTime: '6 min',
      phone: '+91 877 228 7777',
      defaultAmbulances: 3,
      triageRed: 4,
      triageYellow: 14,
      triageGreen: 20,
      isDiverting: false,
      surgeActive: false
    },
    {
      id: 'HOSP-04',
      name: 'Guntur Government General Super Speciality',
      category: 'Regional Trauma & Chemical Exposure Center',
      district: 'Guntur Industrial Belt AP',
      badge: 'Operational Normal',
      badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      occupancyPercent: 62,
      occupied: 217,
      total: 350,
      freeBeds: 133,
      surgeReserve: 20,
      icuAvailable: '18 / 40',
      burnUnit: '2 Beds Available',
      burnColor: 'text-emerald-700 font-semibold',
      hazmatBeds: 30,
      waitTime: '8 min',
      phone: '+91 863 223 4567',
      defaultAmbulances: 2,
      triageRed: 2,
      triageYellow: 8,
      triageGreen: 12,
      isDiverting: false,
      surgeActive: false
    }
  ]);

  const [directedCount, setDirectedCount] = useState<Record<string, number>>({});
  const [recommendationDismissed, setRecommendationDismissed] = useState(false);
  
  // Modals state
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState<HospitalItem | null>(null);
  const [selectedAmbulanceUnit, setSelectedAmbulanceUnit] = useState('ALS Ambulance Unit A-01 (ETA 4 min)');

  // Active live tracker modal state
  const [activeLiveTrackModal, setActiveLiveTrackModal] = useState<{
    hosp: HospitalItem;
    unitName: string;
    dispatchTime: string;
    etaMinutes: number;
    distanceKm: number;
    speedKmh: number;
  } | null>(null);

  // Radio comms modal state
  const [showRadioCommsModal, setShowRadioCommsModal] = useState<{ unitName: string; hospName: string } | null>(null);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [micStatus, setMicStatus] = useState<'GRANTED' | 'DENIED' | 'IDLE'>('IDLE');
  const [showEmbeddedMapTracker, setShowEmbeddedMapTracker] = useState(false);
  const [vitalsPatched, setVitalsPatched] = useState(false);
  const [trafficWaveActive, setTrafficWaveActive] = useState(false);
  const [radioLogs, setRadioLogs] = useState<Array<{ sender: string; time: string; message: string; type: 'crew' | 'eoc' | 'system' }>>([
    { sender: 'Crew 06:46', time: '06:46', message: 'Patient stabilized on O2. En route via Beach Rd Expressway.', type: 'crew' },
    { sender: 'EOC 06:47', time: '06:47', message: 'ER Bay 04 reserved & prepped at destination facility.', type: 'eoc' }
  ]);

  const handleStartTransmitting = async () => {
    setIsTransmitting(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicStatus('GRANTED');
      } catch (err) {
        setMicStatus('DENIED');
      }
    } else {
      setMicStatus('DENIED');
    }
  };

  const handleStopTransmitting = () => {
    if (!isTransmitting) return;
    setIsTransmitting(false);
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgText = micStatus === 'GRANTED'
      ? 'Voice Dispatch Stream (Recorded via Mic): Proceed with Code-3 lights & sirens.'
      : 'Tactical Voice Preset (Mic Off): Maintain Code-3 transit. Green corridor clear.';
    
    setRadioLogs(prev => [
      ...prev,
      { sender: `EOC Voice ${timeNow}`, time: timeNow, message: msgText, type: 'eoc' }
    ]);
    addNotification("VOICE RECORDED: Dispatch audio voice stream saved to EOC Central Comms Archive.", "info");
  };

  const handleSendQuickVoicePreset = (presetMsg: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setRadioLogs(prev => [
      ...prev,
      { sender: `EOC Quick Voice ${timeNow}`, time: timeNow, message: `Synthesized Voice Broadcast: "${presetMsg}"`, type: 'eoc' }
    ]);
    addNotification(`TACTICAL VOICE BROADCAST: "${presetMsg}" sent to Unit Radio.`, "info");
  };

  const handlePatchVitalsAction = (hospName: string) => {
    setVitalsPatched(true);
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setRadioLogs(prev => [
      ...prev,
      { sender: `Telemetry ${timeNow}`, time: timeNow, message: `Live Vitals Patched (BP 120/80, SpO2 98%, HR 84) -> Streamed to ${hospName} ER Bay 04.`, type: 'system' }
    ]);
    addNotification(`PATIENT VITALS PATCHED: Real-time telemetry linked directly to ${hospName} ER Bay 04.`, "success");
  };

  const handleRequestTrafficWaveAction = () => {
    setTrafficWaveActive(true);
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setRadioLogs(prev => [
      ...prev,
      { sender: `Traffic Command ${timeNow}`, time: timeNow, message: 'Green Wave Traffic Signal Priority Override Executed on Beach Rd Corridor.', type: 'system' }
    ]);
    addNotification("GREEN WAVE ENGAGED: Traffic signals along dispatch route overridden to green priority.", "success");
  };

  const [selectedHospId, setSelectedHospId] = useState('HOSP-01');
  const [admitSeverity, setAdmitSeverity] = useState<'RED' | 'YELLOW' | 'GREEN'>('RED');
  const [admitType, setAdmitType] = useState('Thermal Burn Injury');

  // Total summary metrics
  const totalBeds = hospitals.reduce((sum, h) => sum + h.total, 0);
  const totalOccupied = hospitals.reduce((sum, h) => sum + h.occupied, 0);
  const totalFree = totalBeds - totalOccupied;
  const totalRed = hospitals.reduce((sum, h) => sum + h.triageRed, 0);
  const totalYellow = hospitals.reduce((sum, h) => sum + h.triageYellow, 0);
  const totalGreen = hospitals.reduce((sum, h) => sum + h.triageGreen, 0);
  const totalInTransit = hospitals.reduce((sum, h) => sum + h.defaultAmbulances + (directedCount[h.id] || 0), 0);

  // Dispatch Ambulance Handler
  const handleOpenDispatchModal = (hosp: HospitalItem) => {
    setShowDispatchModal(hosp);
  };

  const handleConfirmAmbulanceDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showDispatchModal) return;

    const hospId = showDispatchModal.id;
    const hospName = showDispatchModal.name;
    const current = directedCount[hospId] || 0;
    setDirectedCount(prev => ({ ...prev, [hospId]: current + 1 }));

    const unitNameClean = selectedAmbulanceUnit.split(' (')[0];
    const dispatchTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    addNotification(`AMBULANCE DISPATCHED: ${unitNameClean} routed to ${hospName}. Opening live route navigation tracker...`, "success");
    
    const hospTarget = showDispatchModal;
    setShowDispatchModal(null);

    // Immediately present the Live Route Direction & Telemetry Tracking Modal
    setActiveLiveTrackModal({
      hosp: hospTarget,
      unitName: unitNameClean,
      dispatchTime: dispatchTimeStr,
      etaMinutes: 4,
      distanceKm: 3.2,
      speedKmh: 68
    });
  };

  const handleOpenLiveTrackerForHospital = (hosp: HospitalItem) => {
    setActiveLiveTrackModal({
      hosp,
      unitName: `ALS Ambulance Unit A-0${(hosp.occupied % 4) + 1}`,
      dispatchTime: 'Active Transit',
      etaMinutes: 4,
      distanceKm: 3.2,
      speedKmh: 68
    });
  };

  // Toggle Hospital Diversion State
  const handleToggleDiversion = (hospId: string, hospName: string) => {
    setHospitals(prev => prev.map(h => {
      if (h.id === hospId) {
        const nextState = !h.isDiverting;
        if (nextState) {
          addNotification(`DIVERSION ENGAGED: ${hospName} is now diverting non-critical ambulances to nearby facilities.`, "warning");
        } else {
          addNotification(`DIVERSION RELEASED: ${hospName} has resumed standard emergency intake.`, "info");
        }
        return { ...h, isDiverting: nextState };
      }
      return h;
    }));
  };

  // Toggle Surge Capacity Expansion (+25 cots)
  const handleActivateSurge = (hospId: string, hospName: string) => {
    setHospitals(prev => prev.map(h => {
      if (h.id === hospId) {
        const nextSurge = !h.surgeActive;
        const extraBeds = nextSurge ? 25 : -25;
        const newTotal = h.total + extraBeds;
        const newFree = newTotal - h.occupied;
        const newPercent = Math.round((h.occupied / newTotal) * 100);

        if (nextSurge) {
          addNotification(`SURGE CAPACITY ACTIVATED: +25 Emergency Cots deployed at ${hospName}.`, "success");
        } else {
          addNotification(`SURGE CAPACITY STOOD DOWN: Field cots folded at ${hospName}.`, "info");
        }

        return {
          ...h,
          surgeActive: nextSurge,
          total: newTotal,
          freeBeds: newFree,
          occupancyPercent: newPercent
        };
      }
      return h;
    }));
  };

  // Auto-Divert Recommendation Action
  const handleApproveAutoDivert = () => {
    setRecommendationDismissed(true);
    setHospitals(prev => prev.map(h => {
      if (h.id === 'HOSP-01') {
        return { ...h, isDiverting: true };
      }
      if (h.id === 'HOSP-03') {
        const current = directedCount['HOSP-03'] || 0;
        setDirectedCount(d => ({ ...d, 'HOSP-03': current + 4 }));
      }
      return h;
    }));
    addNotification("ML AUTO-DIVERT EXECUTED: 4 incoming burn casualties rerouted from KGH Vizag to SVIMS Tirupati.", "success");
  };

  // Sync Trauma Net Action
  const handleSyncTraumaNet = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      addNotification("TRAUMA NET SYNCHRONIZED: Live telemetry refreshed across all 4 AP State Emergency Medical Command Centers.", "info");
    }, 600);
  };

  // Submit Patient Admission Simulation
  const handleAdmitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAdmitModal(false);

    setHospitals(prev => prev.map(h => {
      if (h.id === selectedHospId) {
        const newOccupied = Math.min(h.total, h.occupied + 1);
        const newFree = h.total - newOccupied;
        const newPercent = Math.round((newOccupied / h.total) * 100);

        return {
          ...h,
          occupied: newOccupied,
          freeBeds: newFree,
          occupancyPercent: newPercent,
          triageRed: admitSeverity === 'RED' ? h.triageRed + 1 : h.triageRed,
          triageYellow: admitSeverity === 'YELLOW' ? h.triageYellow + 1 : h.triageYellow,
          triageGreen: admitSeverity === 'GREEN' ? h.triageGreen + 1 : h.triageGreen
        };
      }
      return h;
    }));

    const hospObj = hospitals.find(h => h.id === selectedHospId);
    addNotification(`PATIENT ADMITTED: ${admitType} (${admitSeverity} Tag) triaged into ${hospObj?.name || 'Hospital'}.`, "info");
  };

  // Filtered Hospital List
  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch = searchTerm === '' ||
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (categoryFilter === 'CRITICAL') return h.occupancyPercent >= 90 || h.badge === 'Critical Surge';
    if (categoryFilter === 'BURN') return h.category.toLowerCase().includes('burn') || h.burnUnit.includes('Beds');
    if (categoryFilter === 'TRAUMA') return h.category.toLowerCase().includes('trauma');
    return true;
  });

  return (
    <div className="space-y-4 text-left font-sans select-none">
      
      {/* Top Header & Role Workspace Command Bar */}
      <div className="liquid-glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Hospitals & Medical Surge Capacity
            </h2>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border shadow-2xs uppercase ${
              currentRole === 'ADMIN' ? 'bg-rose-50 text-rose-700 border-rose-200' :
              currentRole === 'OPERATOR' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}>
              ● {currentRole === 'ADMIN' ? 'EOC COMMANDER' : currentRole === 'OPERATOR' ? 'TACTICAL DISPATCH' : 'SURGE ANALYTICS'}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            AP State Trauma Net, burn ICU intake queues & automated ambulance routing
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {currentRole !== 'ANALYST' ? (
            <button
              onClick={() => setShowAdmitModal(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Admit Triage Patient</span>
            </button>
          ) : (
            <span className="px-3 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-xs rounded-xl flex items-center space-x-1.5 shadow-2xs">
              <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Analyst Surge View</span>
            </span>
          )}

          <button
            onClick={handleSyncTraumaNet}
            disabled={isSyncing}
            className="px-3.5 py-2 bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-60"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-slate-500 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Net...' : 'Sync Trauma Net'}</span>
          </button>
        </div>
      </div>

      {/* Role Notice Banner for Analyst */}
      {currentRole === 'ANALYST' && (
        <div className="liquid-glass-card px-4 py-2.5 rounded-2xl border border-indigo-200/80 bg-indigo-50/60 flex items-center justify-between text-xs text-indigo-950 shadow-2xs">
          <div className="flex items-center space-x-2 font-semibold">
            <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>ANALYST INTELLIGENCE MODE: Monitoring regional trauma intake saturation, ICU reserve capacity & surge benchmarks.</span>
          </div>
          <span className="text-[10px] font-mono text-indigo-600 font-bold bg-white/80 px-2 py-0.5 rounded-md border border-indigo-200">
            Read-Only Telemetry
          </span>
        </div>
      )}

      {/* KPI Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Total Beds */}
        <div className="liquid-glass-card p-4 rounded-2xl space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">System Bed Capacity</span>
            <BedDouble className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-xl font-black text-slate-900 font-mono">
            {totalFree} <span className="text-xs font-bold text-slate-500">/ {totalBeds} Free</span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold">
            {totalOccupied} Occupied ({Math.round((totalOccupied / totalBeds) * 100)}% Saturation)
          </p>
        </div>

        {/* Triage Queue Breakdown */}
        <div className="liquid-glass-card p-4 rounded-2xl space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Active Triage Patients</span>
            <Activity className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl font-black text-slate-900 font-mono">
            {totalRed + totalYellow + totalGreen} <span className="text-xs font-bold text-slate-500">Patients</span>
          </div>
          <div className="flex items-center space-x-2 text-[10px] font-extrabold font-mono">
            <span className="text-rose-600">● {totalRed} Imm</span>
            <span className="text-amber-600">● {totalYellow} Del</span>
            <span className="text-emerald-600">● {totalGreen} Min</span>
          </div>
        </div>

        {/* ICU & Burn Availability */}
        <div className="liquid-glass-card p-4 rounded-2xl space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">ICU & Burn Beds</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-slate-900 font-mono">
            58 <span className="text-xs font-bold text-slate-500">Available</span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold">
            58 ICU Available • 20 Burn Beds Ready
          </p>
        </div>

        {/* Ambulances in Transit */}
        <div className="liquid-glass-card p-4 rounded-2xl space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Ambulances in Transit</span>
            <Truck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-black text-slate-900 font-mono">
            {totalInTransit} <span className="text-xs font-bold text-slate-500">Units Active</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-bold">
            ML Auto-Rerouting Optimization Active
          </p>
        </div>

      </div>

      {/* ML Smart Trauma Net Auto-Divert Recommendation Banner */}
      {!recommendationDismissed && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs animate-in fade-in">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-200 flex-shrink-0 mt-0.5 shadow-2xs">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  ML TRAUMA NET OPTIMIZER RECOMMENDATION
                </h4>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[9px] font-bold border border-amber-200">
                  96.8% CONFIDENCE
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium mt-0.5 leading-relaxed">
                <strong>King George Hospital (KGH Vizag)</strong> is at <strong>94% Capacity</strong> with 6 ICU beds remaining.
                Recommend auto-diverting 4 incoming burn casualties to <strong>SVIMS Super Speciality Hospital (Tirupati)</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end md:self-center flex-shrink-0">
            <button
              onClick={handleApproveAutoDivert}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-2xs transition-all flex items-center space-x-1 cursor-pointer active:scale-95"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Approve Auto-Divert</span>
            </button>
            <button
              onClick={() => setRecommendationDismissed(true)}
              className="px-2.5 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-bold rounded-xl cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Filter Bar & Search */}
      <div className="liquid-glass-card p-3 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search hospitals by name, district, or category..."
            className="w-full pl-9 pr-3 py-1.5 bg-white/80 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 shadow-2xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1 bg-white/60 p-1 rounded-xl border border-slate-200/60 shadow-2xs backdrop-blur-md">
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`px-3 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
              categoryFilter === 'ALL' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ALL HOSPITALS ({hospitals.length})
          </button>
          <button
            onClick={() => setCategoryFilter('CRITICAL')}
            className={`px-3 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
              categoryFilter === 'CRITICAL' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            SURGE WARNINGS
          </button>
          <button
            onClick={() => setCategoryFilter('BURN')}
            className={`px-3 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
              categoryFilter === 'BURN' ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-600 hover:text-amber-600'
            }`}
          >
            BURN UNITS
          </button>
          <button
            onClick={() => setCategoryFilter('TRAUMA')}
            className={`px-3 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
              categoryFilter === 'TRAUMA' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            TRAUMA LEVEL-1
          </button>
        </div>
      </div>

      {/* 2x2 Grid of Hospital Cards (Apple Liquid Glassmorphism) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredHospitals.map(hosp => {
          const barColor = hosp.occupancyPercent >= 90 ? 'bg-rose-500' : hosp.occupancyPercent >= 80 ? 'bg-amber-500' : 'bg-emerald-500';
          const totalDirected = hosp.defaultAmbulances + (directedCount[hosp.id] || 0);

          return (
            <div
              key={hosp.id}
              className={`liquid-glass-card p-5 rounded-2xl space-y-4 text-left transition-all flex flex-col justify-between border ${
                hosp.isDiverting ? 'border-amber-300 bg-amber-50/20' : 'hover:border-slate-300'
              }`}
            >
              
              {/* Header: Icon + Title + Category + Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center font-bold text-sm shadow-md flex-shrink-0">
                    <Building2 className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                        {hosp.id} • {hosp.district}
                      </span>
                      {hosp.surgeActive && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[9px] font-extrabold font-mono border border-emerald-200">
                          +25 Surge Cots Active
                        </span>
                      )}
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-sm lg:text-base tracking-tight mt-0.5">
                      {hosp.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-semibold">
                      {hosp.category}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border shadow-2xs ${hosp.badgeStyle}`}>
                    ● {hosp.badge}
                  </span>
                  {hosp.isDiverting && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-extrabold uppercase tracking-wider">
                      DIVERSION ACTIVE
                    </span>
                  )}
                </div>
              </div>

              {/* Bed Occupancy Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Bed Occupancy</span>
                  <span className="font-mono font-black text-slate-900">
                    {hosp.occupancyPercent}% <span className="text-slate-400 font-normal">({hosp.occupied}/{hosp.total})</span>
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${hosp.occupancyPercent}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span className="text-emerald-700 font-extrabold">{hosp.freeBeds} Beds Free</span>
                  <span>Surge Reserve: +{hosp.surgeReserve} Cots</span>
                </div>
              </div>

              {/* Live Triage Queue Pills */}
              <div className="p-3 bg-white/70 rounded-xl border border-white/90 shadow-2xs space-y-1.5">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  LIVE TRIAGE QUEUE ({hosp.triageRed + hosp.triageYellow + hosp.triageGreen} PATIENTS)
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono font-bold">
                  <div className="bg-rose-50/90 text-rose-800 p-2 rounded-lg border border-rose-200 flex items-center justify-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span>{hosp.triageRed} Immediate</span>
                  </div>
                  <div className="bg-amber-50/90 text-amber-800 p-2 rounded-lg border border-amber-200 flex items-center justify-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{hosp.triageYellow} Delayed</span>
                  </div>
                  <div className="bg-emerald-50/90 text-emerald-800 p-2 rounded-lg border border-emerald-200 flex items-center justify-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{hosp.triageGreen} Minor</span>
                  </div>
                </div>
              </div>

              {/* Department Metrics: ICU, Burn Unit, Wait Time */}
              <div className="grid grid-cols-3 gap-2 p-2.5 bg-white/70 rounded-xl border border-white/90 text-center shadow-2xs">
                <div>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">ICU Available</span>
                  <span className="text-xs font-mono font-black text-slate-900 mt-0.5 block">{hosp.icuAvailable}</span>
                </div>
                <div>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Burn Unit</span>
                  <span className={`text-xs block ${hosp.burnColor}`}>{hosp.burnUnit}</span>
                </div>
                <div>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">ER Wait Time</span>
                  <span className="text-xs font-mono font-black text-slate-900 mt-0.5 block">{hosp.waitTime}</span>
                </div>
              </div>

              {/* Action Buttons Toolbar & Clear Ambulance Dispatch CTA */}
              <div className="pt-2 border-t border-white/60 flex flex-wrap items-center justify-between gap-2">
                <a
                  href={`tel:${hosp.phone}`}
                  className="flex items-center space-x-1.5 text-xs font-mono text-slate-600 hover:text-slate-900 font-bold"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{hosp.phone}</span>
                </a>

                <div className="flex items-center space-x-1.5">
                  {/* Activate Surge Capacity Button */}
                  <button
                    onClick={() => handleActivateSurge(hosp.id, hosp.name)}
                    className={`px-3 py-1.5 text-[10px] font-extrabold rounded-xl transition-all cursor-pointer border shadow-2xs ${
                      hosp.surgeActive
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                    title="Deploy 25 Emergency Field Cots"
                  >
                    {hosp.surgeActive ? '✓ Surge (+25 Cots)' : '+ Surge Cots'}
                  </button>

                  {/* Toggle Diversion Button */}
                  <button
                    onClick={() => handleToggleDiversion(hosp.id, hosp.name)}
                    className={`px-3 py-1.5 text-[10px] font-extrabold rounded-xl transition-all cursor-pointer border shadow-2xs ${
                      hosp.isDiverting
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                    title="Toggle Non-Critical Transit Diversion"
                  >
                    {hosp.isDiverting ? '✓ Diverting' : 'Divert Transit'}
                  </button>

                  {/* Track Live Route Button when units are en route */}
                  {totalDirected > 0 && (
                    <button
                      onClick={() => handleOpenLiveTrackerForHospital(hosp)}
                      className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 font-extrabold text-[10px] rounded-xl transition-all cursor-pointer flex items-center space-x-1 shadow-2xs"
                      title="Track live turn-by-turn route, ETA, and GPS telemetry of en-route units"
                    >
                      <Navigation className="w-3 h-3 text-sky-600 animate-pulse" />
                      <span>Track Route</span>
                    </button>
                  )}

                  {/* Dispatch Ambulance Button */}
                  <button
                    onClick={() => handleOpenDispatchModal(hosp)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-1.5"
                    title="Dispatch an emergency ambulance unit directly to this facility"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Dispatch Ambulance</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-blue-700 text-white font-mono text-[9px] font-bold">
                      {totalDirected} En Route
                    </span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Ambulance Dispatch Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl max-w-md w-full space-y-4 text-left animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Dispatch Emergency Ambulance
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    Assign transit unit to {showDispatchModal.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDispatchModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAmbulanceDispatch} className="space-y-4">
              
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  SELECT STANDBY AMBULANCE / TRANSIT UNIT
                </label>
                <select
                  value={selectedAmbulanceUnit}
                  onChange={e => setSelectedAmbulanceUnit(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 cursor-pointer"
                >
                  <option value="ALS Ambulance Unit A-01 (ETA 4 min)">
                    ALS Ambulance Unit A-01 (ETA 4 min) • 2 Triage Beds
                  </option>
                  <option value="Rapid Triage Squad A-05 (ETA 6 min)">
                    Rapid Triage Squad A-05 (ETA 6 min) • Burn Specialist
                  </option>
                  <option value="Trauma Transport Unit A-08 (ETA 8 min)">
                    Trauma Transport Unit A-08 (ETA 8 min) • Ventilator Ready
                  </option>
                  <option value="APDRF Medical Escort Squad M-03 (ETA 10 min)">
                    APDRF Medical Escort Squad M-03 (ETA 10 min) • Mass Casualty
                  </option>
                </select>
              </div>

              <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1 font-medium">
                <div className="flex items-center space-x-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Optimal Route Selected</span>
                </div>
                <p className="text-[11px] text-blue-800">
                  Unit will be assigned exclusively to {showDispatchModal.name} ({showDispatchModal.freeBeds} beds free).
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm & Dispatch Unit</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Patient Admission Simulation Modal */}
      {showAdmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl max-w-md w-full space-y-4 text-left animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-slate-900 text-white">
                  <UserPlus className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Admit Emergency Triage Patient
                </h3>
              </div>
              <button
                onClick={() => setShowAdmitModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdmitSubmit} className="space-y-4">
              
              {/* Select Destination Hospital */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  TARGET EMERGENCY MEDICAL CENTER
                </label>
                <select
                  value={selectedHospId}
                  onChange={e => setSelectedHospId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.freeBeds} Beds Free • {h.occupancyPercent}%)
                    </option>
                  ))}
                </select>
              </div>

              {/* Triage Tag Severity */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  TRIAGE CLASSIFICATION TAG
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdmitSeverity('RED')}
                    className={`py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                      admitSeverity === 'RED'
                        ? 'bg-rose-600 text-white border-rose-700 shadow-2xs'
                        : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    }`}
                  >
                    🔴 Red (Immediate)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdmitSeverity('YELLOW')}
                    className={`py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                      admitSeverity === 'YELLOW'
                        ? 'bg-amber-600 text-white border-amber-700 shadow-2xs'
                        : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    🟡 Yellow (Delayed)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdmitSeverity('GREEN')}
                    className={`py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                      admitSeverity === 'GREEN'
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    🟢 Green (Minor)
                  </button>
                </div>
              </div>

              {/* Injury Type Input */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  PRIMARY INJURY / DIAGNOSTIC CATEGORY
                </label>
                <input
                  type="text"
                  required
                  value={admitType}
                  onChange={e => setAdmitType(e.target.value)}
                  placeholder="e.g. 2nd Degree Thermal Burn, Smoke Inhalation, Fracture"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
              >
                Confirm Patient Triage Admission
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Live Transit Route & Navigation Telemetry Modal (Clean Medical Glass Styling) */}
      {activeLiveTrackModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xl max-w-xl w-full space-y-5 text-left animate-in fade-in overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-black uppercase tracking-wider border border-rose-200">
                      ● CODE-3 EMERGENCY TRANSIT
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">
                      Dispatched {activeLiveTrackModal.dispatchTime}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base lg:text-lg tracking-tight mt-0.5">
                    {activeLiveTrackModal.unitName}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    Destination: <span className="text-slate-800 font-extrabold">{activeLiveTrackModal.hosp.name}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveLiveTrackModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Telemetry Summary Stats (Clean Crisp White/Slate Cards) */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-center shadow-2xs font-mono">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Live Speed</span>
                <span className="text-base font-black text-blue-700 mt-0.5 block">{activeLiveTrackModal.speedKmh} <span className="text-xs text-slate-500">km/h</span></span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-center shadow-2xs font-mono">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Distance Left</span>
                <span className="text-base font-black text-amber-700 mt-0.5 block">{activeLiveTrackModal.distanceKm} <span className="text-xs text-slate-500">km</span></span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-center shadow-2xs font-mono">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">ETA Arrival</span>
                <span className="text-base font-black text-emerald-700 mt-0.5 block">{activeLiveTrackModal.etaMinutes} <span className="text-xs text-slate-500">min 45s</span></span>
              </div>
            </div>

            {/* Visual Route Path & Turn-by-Turn Navigation Card (Medical Grade Clean Design) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                  <Compass className="w-3.5 h-3.5 text-blue-600" />
                  <span>Turn-By-Turn Route Guidance & Directions</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Green Corridor Active
                </span>
              </div>

              {/* Realistic Route Guidance Container (Clean Light Medical Styling) */}
              <div className="p-4 bg-slate-50/90 rounded-2xl space-y-3.5 border border-slate-200/90 shadow-xs">
                
                {/* Visual Route Line */}
                <div className="relative h-14 w-full flex items-center justify-between px-3">
                  <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1.5 bg-slate-200 rounded-full" />
                  <div className="absolute left-6 right-[62%] top-1/2 -translate-y-1/2 h-1.5 bg-blue-600 rounded-full" />
                  <div className="absolute left-[38%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-md flex items-center justify-center animate-bounce">
                    <Truck className="w-3 h-3 text-white" />
                  </div>

                  {/* Waypoint Nodes */}
                  <div className="relative z-10 flex flex-col items-center space-y-1">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono text-[10px] font-black flex items-center justify-center shadow-xs">
                      A
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">Depot</span>
                  </div>

                  <div className="relative z-10 flex flex-col items-center space-y-1">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-mono text-[10px] font-black flex items-center justify-center border border-slate-300">
                      B
                    </div>
                    <span className="text-[10px] font-bold text-slate-600">Beach Rd</span>
                  </div>

                  <div className="relative z-10 flex flex-col items-center space-y-1">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-mono text-[10px] font-black flex items-center justify-center border border-slate-300">
                      C
                    </div>
                    <span className="text-[10px] font-bold text-slate-600">Port Hub</span>
                  </div>

                  <div className="relative z-10 flex flex-col items-center space-y-1">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-mono text-[10px] font-black flex items-center justify-center shadow-xs">
                      H
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700">KGH ER</span>
                  </div>
                </div>

                {/* Step-by-Step Directions */}
                <div className="space-y-2.5 pt-3 border-t border-slate-200/80">
                  <div className="flex items-start space-x-2.5 text-xs">
                    <div className="p-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900">Origin Departure:</span>
                      <p className="text-[11px] text-slate-600 font-semibold">Vizag Central Standby Depot • Departed {activeLiveTrackModal.dispatchTime}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5 text-xs">
                    <div className="p-1 rounded-lg bg-sky-50 text-sky-600 border border-sky-100 mt-0.5">
                      <Navigation className="w-3.5 h-3.5 rotate-45" />
                    </div>
                    <div>
                      <span className="font-extrabold text-blue-700">Active Leg (1.2 km):</span>
                      <p className="text-[11px] text-slate-700 font-medium">Turn right onto Beach Road Expressway. Traffic signals set to green wave priority.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5 text-xs">
                    <div className="p-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 mt-0.5">
                      <Navigation className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-extrabold text-amber-800">Next Leg (1.5 km):</span>
                      <p className="text-[11px] text-slate-600 font-medium">Continue past Harbour Traffic Overpass directly onto Emergency Command Corridor.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5 text-xs">
                    <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-extrabold text-emerald-800">Destination Target:</span>
                      <p className="text-[11px] text-slate-700 font-medium">{activeLiveTrackModal.hosp.name} (Triage Gate B • Emergency Bay 04 Reserved)</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Tactical Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => {
                  const unitName = activeLiveTrackModal.unitName;
                  const hospName = activeLiveTrackModal.hosp.name;
                  setActiveLiveTrackModal(null);
                  navigate('/digital-twin', {
                    state: {
                      focusUnitId: 'AMB-1',
                      focusUnitName: unitName,
                      targetHospName: hospName
                    }
                  });
                }}
                className="py-3 px-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                <span>Open Command Map ➔</span>
              </button>

              <button
                onClick={() => {
                  setShowRadioCommsModal({
                    unitName: activeLiveTrackModal.unitName,
                    hospName: activeLiveTrackModal.hosp.name
                  });
                }}
                className="py-3 px-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <Radio className="w-3.5 h-3.5 text-white" />
                <span>Open Radio Comms (VHF-14)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Interactive Radio Voice Link Modal */}
      {showRadioCommsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4 text-left animate-in fade-in">
            
            {/* Radio Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">
                      VHF CH-14 • 156.700 MHz
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Live Tactical Radio Link
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    Unit: {showRadioCommsModal.unitName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRadioCommsModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Radio Waveform Visualizer & Crew Status */}
            <div className="p-4 bg-slate-50/90 text-slate-900 rounded-2xl space-y-3 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 font-semibold">CREW COMMANDER:</span>
                <span className="font-bold text-blue-700">Capt. R. Naidu (ALS Paramedic)</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 font-semibold">TARGET FACILITY:</span>
                <span className="font-bold text-emerald-700">{showRadioCommsModal.hospName}</span>
              </div>

              {/* Live Audio Frequency Waveform Animation */}
              <div className="h-12 bg-white rounded-xl p-2 flex items-center justify-center space-x-1 border border-slate-200">
                {[40, 75, 30, 90, 60, 100, 45, 80, 50, 95, 35, 70, 40, 85, 60].map((height, idx) => (
                  <div
                    key={idx}
                    className={`w-1 rounded-full ${isTransmitting ? 'bg-emerald-500 animate-pulse' : 'bg-blue-600/70'}`}
                    style={{ height: `${isTransmitting ? Math.max(20, Math.round(height * Math.random())) : height * 0.4}%` }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500">
                <span>{isTransmitting ? "🎙️ BROADCASTING LIVE VOICE STREAM..." : "📡 RECEIVING DISPATCH FREQUENCY TELEMETRY"}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                  micStatus === 'GRANTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {micStatus === 'GRANTED' ? '🎤 Mic Active' : '🎤 Mic Off (Preset Mode)'}
                </span>
              </div>
            </div>

            {/* Quick Tactical Voice Broadcast Presets (Fallback when no mic) */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">
                TACTICAL QUICK-VOICE BROADCAST PRESETS
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
                <button
                  onClick={() => handleSendQuickVoicePreset("Proceed with Code-3 lights and sirens.")}
                  className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-200 cursor-pointer"
                >
                  📢 Code-3 Priority
                </button>
                <button
                  onClick={() => handleSendQuickVoicePreset(`Request ER Bay prep at ${showRadioCommsModal.hospName}`)}
                  className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-200 cursor-pointer"
                >
                  🏥 Request Bay Prep
                </button>
                <button
                  onClick={() => handleSendQuickVoicePreset("ETA 4 minutes. Prepare immediate intake.")}
                  className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-200 cursor-pointer"
                >
                  ⏱️ Confirm 4m ETA
                </button>
              </div>
            </div>

            {/* Radio Transmissions History Log */}
            <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  LIVE TRANSMISSION & VOICE LOG
                </span>
                <span className="text-[9px] font-mono font-bold text-slate-500">
                  {radioLogs.length} Entries Logged
                </span>
              </div>

              <div className="space-y-1.5 font-mono text-[11px] max-h-32 overflow-y-auto pr-1">
                {radioLogs.map((log, idx) => (
                  <div key={idx} className="p-1.5 rounded bg-white border border-slate-200/60 text-slate-800 space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className={log.type === 'crew' ? 'text-blue-700' : log.type === 'system' ? 'text-emerald-700' : 'text-slate-900'}>
                        [{log.sender}]
                      </span>
                      <span className="text-slate-400">{log.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-snug">{log.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Voice Storage & Audit Archival Info Notice */}
            <div className="px-3 py-2 bg-blue-50/70 rounded-xl border border-blue-100 text-[10px] text-blue-900 flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span>Audio Stream & Transcripts stored in <strong>EOC Central Audio Vault</strong></span>
              </div>
              <span className="font-mono text-[9px] font-bold text-blue-700 bg-white px-1.5 py-0.5 rounded border border-blue-200">
                #VHF-14-LOG
              </span>
            </div>

            {/* Interactive Radio Control Buttons */}
            <div className="space-y-2">
              <button
                onMouseDown={handleStartTransmitting}
                onMouseUp={handleStopTransmitting}
                onTouchStart={handleStartTransmitting}
                onTouchEnd={handleStopTransmitting}
                className={`w-full py-3 text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  isTransmitting
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>{isTransmitting ? "Broadcasting Voice (Release to Send & Log)" : "Push-To-Talk (Hold to Speak)"}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handlePatchVitalsAction(showRadioCommsModal.hospName)}
                  className={`py-2 px-2.5 text-[11px] font-bold rounded-xl border transition-all cursor-pointer shadow-2xs flex items-center justify-center space-x-1 ${
                    vitalsPatched
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <span>📢</span>
                  <span>{vitalsPatched ? '✓ Vitals Stream Active' : 'Patch Patient Vitals'}</span>
                </button>
                
                <button
                  onClick={handleRequestTrafficWaveAction}
                  className={`py-2 px-2.5 text-[11px] font-bold rounded-xl border transition-all cursor-pointer shadow-2xs flex items-center justify-center space-x-1 ${
                    trafficWaveActive
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <span>🚨</span>
                  <span>{trafficWaveActive ? '✓ Green Wave Active' : 'Request Traffic Wave'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default HospitalsTriage;
