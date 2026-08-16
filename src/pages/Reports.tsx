import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, ShieldCheck, Clock, User, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface IncidentReportItem {
  id: string;
  title: string;
  type: string;
  severity: 'Critical' | 'High' | 'Medium';
  timeAgo: string;
  exactTime: string;
  dossierRef: string;
  hash: string;
  status: string;
  overview: string;
  casualties: {
    critical: number;
    moderate: number;
    minor: number;
    evacuated: number;
    missing: number;
  };
  custodyChain: {
    time: string;
    action: string;
  }[];
}

const REPORT_RECORDS: IncidentReportItem[] = [
  {
    id: 'INC-2026-0891',
    title: 'Multi-Story Commercial Fire & Chemical Storage Risk',
    type: 'Fire',
    severity: 'Critical',
    timeAgo: '12 min ago',
    exactTime: '14:34:12',
    dossierRef: 'INC-2026-0891-SEC4',
    hash: 'sha256:8f4c...92e1',
    status: 'Responding',
    overview: 'Active 4-alarm structural blaze initiated on 6th floor mezzanine. Flammable hydrocarbon solvent tanks reported in sub-basement B2. Autonomous thermal drone detects flashover threshold breach in east stairwell.',
    casualties: {
      critical: 4,
      moderate: 11,
      minor: 28,
      evacuated: 1940,
      missing: 6
    },
    custodyChain: [
      { time: '14:34:12', action: 'Sensor mesh breach registered (Thermal 485°C)' },
      { time: '14:35:10', action: 'Resource Allocation Agent recommended Engine 14 + ALS 12' },
      { time: '14:35:45', action: 'Human Commander J. Vance APPROVED order with Green Wave Priority' },
      { time: '14:42:00', action: 'Perimeter secured, 1,940 civilians routed via Primary Safe Corridor' }
    ]
  },
  {
    id: 'INC-2026-0892',
    title: 'Flash Flood & Subsurface Storm Drainage Overflow',
    type: 'Flood',
    severity: 'High',
    timeAgo: '28 min ago',
    exactTime: '14:18:00',
    dossierRef: 'INC-2026-0892-SEC1',
    hash: 'sha256:3a1b...77e4',
    status: 'Contained',
    overview: 'Rapid water levels rising following storm surge at Pier 28 Basin. Lowland road corridors submerged. High-capacity dewatering pumps deployed.',
    casualties: {
      critical: 0,
      moderate: 2,
      minor: 9,
      evacuated: 850,
      missing: 0
    },
    custodyChain: [
      { time: '14:18:00', action: 'Water level threshold breach detected (+3.42m)' },
      { time: '14:20:15', action: 'Marine Response Fireboat 1 and Swiftwater Rescue deployed' },
      { time: '14:28:00', action: 'Embarcadero underpass sealed and traffic rerouted' }
    ]
  },
  {
    id: 'INC-2026-0893',
    title: 'Seismic Rupture & Natural Gas Pipeline Fracture',
    type: 'Gas Leak',
    severity: 'Critical',
    timeAgo: '45 min ago',
    exactTime: '14:01:25',
    dossierRef: 'INC-2026-0893-SEC2',
    hash: 'sha256:9c4d...11aa',
    status: 'Responding',
    overview: 'Subterranean methane and gas line pressure surge at 68% LEL. Intermodal transit concourse evacuated. Power to 3rd rail transit feeds cut.',
    casualties: {
      critical: 2,
      moderate: 5,
      minor: 14,
      evacuated: 3100,
      missing: 0
    },
    custodyChain: [
      { time: '14:01:25', action: 'Gas sniffer sensor GSN-08 triggered high-level warning' },
      { time: '14:03:00', action: 'Transit station turnstiles automated to open egress' },
      { time: '14:10:00', action: 'HazMat Specialist H-01 and USAR Task Force 2 on scene' }
    ]
  },
  {
    id: 'INC-2026-0894',
    title: 'Multi-Vehicle Arterial Collision with Hazardous Material',
    type: 'Collision',
    severity: 'Medium',
    timeAgo: '52 min ago',
    exactTime: '13:54:10',
    dossierRef: 'INC-2026-0894-SEC3',
    hash: 'sha256:5e6f...88bb',
    status: 'Cleared',
    overview: '3-vehicle collision involving chemical transport tanker. Spill contained using hazardous absorbent barriers.',
    casualties: {
      critical: 1,
      moderate: 3,
      minor: 7,
      evacuated: 120,
      missing: 0
    },
    custodyChain: [
      { time: '13:54:10', action: 'Traffic AI collision detected on Highway 101 overpass' },
      { time: '13:56:00', action: 'Rescue Tender R-02 and Police units dispatched' },
      { time: '14:22:00', action: 'Debris cleared and bypass lane restored' }
    ]
  },
  {
    id: 'INC-2026-0895',
    title: 'Industrial Warehouse Structural Masonry Instability',
    type: 'Structural',
    severity: 'High',
    timeAgo: '1 hr ago',
    exactTime: '13:31:00',
    dossierRef: 'INC-2026-0895-SEC5',
    hash: 'sha256:7b8c...44cc',
    status: 'Contained',
    overview: 'Structural strain gauge alert indicating primary roof truss deformation. Safety cordon established.',
    casualties: {
      critical: 0,
      moderate: 1,
      minor: 4,
      evacuated: 450,
      missing: 0
    },
    custodyChain: [
      { time: '13:31:00', action: 'Structural strain laser alert received' },
      { time: '13:35:00', action: 'Warehouse sector evacuated and shoring teams en route' }
    ]
  },
  {
    id: 'INC-2026-0896',
    title: 'Arena Plaza Crowd Surge & Egress Bottleneck',
    type: 'Crowd Emergency',
    severity: 'Medium',
    timeAgo: '1 hr 40 min ago',
    exactTime: '12:55:10',
    dossierRef: 'INC-2026-0896-SEC6',
    hash: 'sha256:2d3e...99dd',
    status: 'Cleared',
    overview: 'High crowd density at Gate 3 following event dispersal. Dynamic corridor redirection engaged.',
    casualties: {
      critical: 0,
      moderate: 4,
      minor: 18,
      evacuated: 6500,
      missing: 0
    },
    custodyChain: [
      { time: '12:55:10', action: 'Crowd density camera exceeded 4.8 persons/m²' },
      { time: '12:57:00', action: 'Secondary gates 4 and 5 opened automatically' }
    ]
  }
];

export const Reports: React.FC = () => {
  const { addNotification } = useApp();
  const [selectedId, setSelectedId] = useState<string>('INC-2026-0891');
  const [exporting, setExporting] = useState(false);

  const activeRecord = REPORT_RECORDS.find(r => r.id === selectedId) || REPORT_RECORDS[0];

  const handleExportPDF = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      addNotification(`SIGNED PDF EXPORTED: After-Action Report ${activeRecord.id} compiled with SHA-256 certificate.`, "info");
    }, 600);
  };

  return (
    <div className="space-y-4 text-left font-sans">
      
      {/* Top Header & Export PDF Action */}
      <div className="liquid-glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Incident After-Action Reports & Audit Logs
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-extrabold border border-rose-200 shadow-2xs">
              ● 2 CRITICAL
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Official cryptographic SitReps, unit timelines, victim manifests & legal audit logs
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-60"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{exporting ? 'Compiling PDF...' : 'Export Signed PDF'}</span>
        </button>
      </div>

      {/* 2-Column Split: Available Incident Records & Detailed AAR (Matching Screenshot 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Available Incident Records (4 cols) */}
        <div className="lg:col-span-5 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 pl-1 block">
            AVAILABLE INCIDENT RECORDS
          </span>

          <div className="space-y-2">
            {REPORT_RECORDS.map(record => {
              const isSelected = record.id === activeRecord.id;
              const badgeClass =
                record.severity === 'Critical'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : record.severity === 'High'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200';

              return (
                <div
                  key={record.id}
                  onClick={() => setSelectedId(record.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'liquid-glass-blue border-blue-400 shadow-xs'
                      : 'liquid-glass-card hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-extrabold text-slate-500">
                      {record.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${badgeClass}`}>
                      ● {record.severity}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-xs tracking-tight line-clamp-1">
                    {record.title}
                  </h4>

                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    {record.timeAgo} ({record.exactTime})
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Incident After-Action Report (7 cols) */}
        <div className="lg:col-span-7 liquid-glass-card p-6 rounded-2xl space-y-5">
          
          {/* Header Badge: Verified Audit Record */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block">
                STATE EMERGENCY MANAGEMENT AGENCY
              </span>
              <h3 className="text-sm font-black text-slate-900 tracking-tight mt-0.5">
                INCIDENT AFTER-ACTION REPORT (AAR)
              </h3>
              <span className="text-[10px] font-mono text-slate-500 font-bold block">
                Dossier Ref: {activeRecord.dossierRef}
              </span>
            </div>

            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200 inline-flex items-center space-x-1 shadow-2xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>VERIFIED AUDIT RECORD</span>
              </span>
              <span className="text-[9px] font-mono text-slate-400 block mt-1">
                Hash: {activeRecord.hash}
              </span>
            </div>
          </div>

          {/* 4 Header Quick Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-white/70 rounded-xl border border-white/90 shadow-2xs">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Incident Type</span>
              <span className="text-xs font-extrabold text-slate-900 mt-0.5 block">{activeRecord.type}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Severity Level</span>
              <span className="text-xs font-extrabold text-rose-600 mt-0.5 block">{activeRecord.severity}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Initial Detection</span>
              <span className="text-xs font-extrabold text-slate-900 mt-0.5 block">{activeRecord.timeAgo} ({activeRecord.exactTime})</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Current Status</span>
              <span className="text-xs font-extrabold text-blue-700 mt-0.5 block">{activeRecord.status}</span>
            </div>
          </div>

          {/* 1. Executive Overview */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              1. EXECUTIVE OVERVIEW
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-white/50 p-3 rounded-xl border border-white/80">
              {activeRecord.overview}
            </p>
          </div>

          {/* 2. Civilian Impact & Casualty Triage (5 colored boxes) */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              2. CIVILIAN IMPACT & CASUALTY TRIAGE
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200">
                <span className="text-[9px] font-black text-rose-700 uppercase tracking-wider block">CRITICAL (RED)</span>
                <span className="text-base font-black text-rose-700 mt-1 block">{activeRecord.casualties.critical}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200">
                <span className="text-[9px] font-black text-amber-700 uppercase tracking-wider block">MODERATE (YELLOW)</span>
                <span className="text-base font-black text-amber-700 mt-1 block">{activeRecord.casualties.moderate}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200">
                <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider block">MINOR (GREEN)</span>
                <span className="text-base font-black text-emerald-700 mt-1 block">{activeRecord.casualties.minor}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200">
                <span className="text-[9px] font-black text-blue-700 uppercase tracking-wider block">EVACUATED</span>
                <span className="text-base font-black text-blue-700 mt-1 block">{activeRecord.casualties.evacuated}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-wider block">MISSING</span>
                <span className="text-base font-black text-slate-600 mt-1 block">{activeRecord.casualties.missing}</span>
              </div>
            </div>
          </div>

          {/* 3. Autonomous Dispatch Approvals & Chain of Custody */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              3. AUTONOMOUS DISPATCH APPROVALS & CHAIN OF CUSTODY
            </h4>

            <div className="p-3 bg-white/70 rounded-xl border border-white/90 space-y-1.5 font-mono text-[11px] text-slate-700">
              {activeRecord.custodyChain.map((step, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <span className="text-slate-400 font-bold">• [{step.time}]</span>
                  <span>{step.action}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
export default Reports;
