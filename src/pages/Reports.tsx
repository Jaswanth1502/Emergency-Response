import React, { useState } from 'react';
import { Download, CheckCircle2, Search, Filter } from 'lucide-react';
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
  status: 'Responding' | 'Contained' | 'Cleared';
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
    hash: 'sha256:8f4c92e1b8a5d3f211c47e909a32c51082a7f8e3d6b',
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
    hash: 'sha256:3a1b77e492c1084d5f2a11b88e3199c021f7a4e621c',
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
    hash: 'sha256:9c4d11aa88b209e531f82c4711a90c1284d7a1b32f1',
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
    hash: 'sha256:5e6f88bb33c109d421e87f55a11c890123f8b91122a',
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
    hash: 'sha256:7b8c44cc11d902e887f12a33c4190b8712a45d6108e',
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
    hash: 'sha256:2d3e99dd00f11a2876b55c4412e88a9110d34b5210c',
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

  // Filters & Search Key State
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'Critical' | 'High' | 'Medium'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Responding' | 'Contained' | 'Cleared'>('ALL');

  // Filtered Incident Records
  const filteredRecords = REPORT_RECORDS.filter(r => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      term === '' ||
      r.id.toLowerCase().includes(term) ||
      r.title.toLowerCase().includes(term) ||
      r.type.toLowerCase().includes(term) ||
      r.overview.toLowerCase().includes(term);

    const matchesSeverity = severityFilter === 'ALL' || r.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const activeRecord =
    filteredRecords.find(r => r.id === selectedId) ||
    filteredRecords[0] ||
    REPORT_RECORDS[0];

  // Export Incident Report as a Formatted PDF Document
  const handleExportPDF = () => {
    setExporting(true);

    const timeString = new Date().toLocaleString();
    const pdfWindow = window.open('', '_blank');

    if (pdfWindow) {
      pdfWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>AAR_${activeRecord.id}_${Date.now()}.pdf</title>
            <style>
              @page { size: A4 portrait; margin: 15mm; }
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; color: #0f172a; line-height: 1.4; background: #ffffff; }
              .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
              .agency { font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
              .title { font-size: 18px; font-weight: 900; color: #0f172a; margin-top: 2px; text-transform: uppercase; }
              .subtitle { font-size: 11px; color: #475569; font-mono: true; margin-top: 2px; }
              .stamp { font-family: monospace; font-size: 9px; text-align: right; color: #475569; }
              
              .spec-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
              .spec-label { font-size: 9px; font-weight: 800; color: #64748b; text-transform: uppercase; }
              .spec-value { font-size: 13px; font-weight: 800; color: #0f172a; margin-top: 2px; }
              
              .section-title { font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; color: #0f172a; margin-top: 20px; margin-bottom: 8px; border-left: 3px solid #2563eb; padding-left: 8px; }
              
              .box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; font-size: 11px; color: #334155; line-height: 1.5; }
              
              .triage-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-top: 8px; text-align: center; }
              .triage-card { padding: 8px; border-radius: 6px; border: 1px solid #cbd5e1; }
              .triage-card.red { background: #fef2f2; border-color: #fecaca; color: #991b1b; }
              .triage-card.yellow { background: #fffbeb; border-color: #fde68a; color: #92400e; }
              .triage-card.green { background: #f0fdf4; border-color: #bbf7d0; color: #166534; }
              .triage-card.blue { background: #eff6ff; border-color: #bfdbfe; color: #1e40af; }
              .triage-card.grey { background: #f8fafc; border-color: #e2e8f0; color: #334155; }
              .triage-label { font-size: 8px; font-weight: 900; text-transform: uppercase; }
              .triage-num { font-size: 16px; font-weight: 900; margin-top: 2px; }

              table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 10px; }
              th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
              th { background: #f1f5f9; font-weight: 800; color: #334155; text-transform: uppercase; font-size: 9px; }
              tr:nth-child(even) { background: #f8fafc; }

              .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 9px; color: #94a3b8; display: flex; justify-content: space-between; font-family: monospace; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <div class="agency">State Emergency Management Agency</div>
                <div class="title">Incident After-Action Report (AAR)</div>
                <div class="subtitle">Dossier Ref: ${activeRecord.dossierRef} | ID: ${activeRecord.id}</div>
              </div>
              <div class="stamp">
                <strong>EXPORT TIMESTAMP:</strong> ${timeString}<br/>
                <strong>VERIFICATION HASH:</strong> ${activeRecord.hash.substring(0, 20)}...
              </div>
            </div>

            <div class="spec-grid">
              <div>
                <div class="spec-label">Incident Type</div>
                <div class="spec-value">${activeRecord.type}</div>
              </div>
              <div>
                <div class="spec-label">Severity Level</div>
                <div class="spec-value" style="color: ${activeRecord.severity === 'Critical' ? '#dc2626' : activeRecord.severity === 'High' ? '#d97706' : '#2563eb'};">${activeRecord.severity}</div>
              </div>
              <div>
                <div class="spec-label">Initial Detection</div>
                <div class="spec-value">${activeRecord.exactTime} (${activeRecord.timeAgo})</div>
              </div>
              <div>
                <div class="spec-label">Current Status</div>
                <div class="spec-value">${activeRecord.status}</div>
              </div>
            </div>

            <div class="section-title">1. Executive Summary & Situation Overview</div>
            <div class="box">
              <strong>${activeRecord.title}</strong><br/><br/>
              ${activeRecord.overview}
            </div>

            <div class="section-title">2. Civilian Impact & Casualty Triage Summary</div>
            <div class="triage-grid">
              <div class="triage-card red">
                <div class="triage-label">Critical (Red)</div>
                <div class="triage-num">${activeRecord.casualties.critical}</div>
              </div>
              <div class="triage-card yellow">
                <div class="triage-label">Moderate (Yellow)</div>
                <div class="triage-num">${activeRecord.casualties.moderate}</div>
              </div>
              <div class="triage-card green">
                <div class="triage-label">Minor (Green)</div>
                <div class="triage-num">${activeRecord.casualties.minor}</div>
              </div>
              <div class="triage-card blue">
                <div class="triage-label">Evacuated</div>
                <div class="triage-num">${activeRecord.casualties.evacuated.toLocaleString()}</div>
              </div>
              <div class="triage-card grey">
                <div class="triage-label">Missing</div>
                <div class="triage-num">${activeRecord.casualties.missing}</div>
              </div>
            </div>

            <div class="section-title">3. Autonomous Dispatch Approvals & Chain of Custody Log</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 100px;">Timestamp</th>
                  <th>Command Audit Event & Authorized Action</th>
                </tr>
              </thead>
              <tbody>
                ${activeRecord.custodyChain.map(step => `
                  <tr>
                    <td><strong>${step.time}</strong></td>
                    <td>${step.action}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="footer">
              <span>CRYPTOGRAPHIC SHA-256: ${activeRecord.hash}</span>
              <span>AEGIS TWIN COMMAND & AUDIT LOG</span>
            </div>
          </body>
        </html>
      `);

      pdfWindow.document.close();
      pdfWindow.focus();
      setTimeout(() => {
        pdfWindow.print();
        setExporting(false);
        addNotification(`SIGNED PDF EXPORTED: After-Action Report ${activeRecord.id} compiled into PDF.`, "success");
      }, 400);
    } else {
      setExporting(false);
      addNotification("EXPORT ERROR: Browser popup blocked. Please allow popups to save PDF.", "warning");
    }
  };

  return (
    <div className="space-y-4 text-left font-sans select-none">
      
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
          title="Export formatted printable PDF report for the active incident dossier"
        >
          {exporting ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          <span>{exporting ? 'Compiling PDF...' : 'Export Signed PDF'}</span>
        </button>
      </div>

      {/* Interactive Search & Severity Filter Bar */}
      <div className="liquid-glass-card p-3 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search incident ID, keyword, hazard..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/70 border border-white/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all shadow-2xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Severity Keys Selector */}
        <div className="flex items-center space-x-2 overflow-x-auto">
          <div className="flex items-center space-x-1 bg-white/70 p-1 rounded-xl border border-white/90 shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
            {(['ALL', 'Critical', 'High', 'Medium'] as const).map(sevKey => (
              <button
                key={sevKey}
                onClick={() => setSeverityFilter(sevKey)}
                className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                  severityFilter === sevKey
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sevKey === 'ALL' ? 'All Severities' : sevKey}
              </button>
            ))}
          </div>

          {/* Status Keys Selector */}
          <div className="flex items-center space-x-1 bg-white/70 p-1 rounded-xl border border-white/90 shadow-2xs">
            {(['ALL', 'Responding', 'Contained', 'Cleared'] as const).map(statusKey => (
              <button
                key={statusKey}
                onClick={() => setStatusFilter(statusKey)}
                className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                  statusFilter === statusKey
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {statusKey === 'ALL' ? 'All Statuses' : statusKey}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 2-Column Split: Available Incident Records & Detailed AAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Available Incident Records (5 cols) */}
        <div className="lg:col-span-5 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 pl-1 block">
            AVAILABLE INCIDENT RECORDS ({filteredRecords.length})
          </span>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredRecords.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-bold text-xs bg-white/40 rounded-2xl border border-white/60">
                No matching incident reports found.
              </div>
            ) : (
              filteredRecords.map(record => {
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

                    <div className="flex items-center justify-between mt-1.5 text-[10px] font-mono">
                      <span className="text-slate-400 font-medium">
                        {record.timeAgo} ({record.exactTime})
                      </span>
                      <span className="text-blue-700 font-bold">
                        {record.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Incident After-Action Report (7 cols) */}
        {activeRecord && (
          <div className="lg:col-span-7 liquid-glass-card p-6 rounded-2xl space-y-5">
            
            {/* Header Badge: Verified Audit Record */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
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

              <div className="text-left sm:text-right">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200 inline-flex items-center space-x-1 shadow-2xs">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>VERIFIED AUDIT RECORD</span>
                </span>
                <span className="text-[9px] font-mono text-slate-400 block mt-1 truncate max-w-[200px]">
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
                  <span className="text-base font-black text-blue-700 mt-1 block">{activeRecord.casualties.evacuated.toLocaleString()}</span>
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
                  <div key={`${activeRecord.id}-step-${step.time}-${i}`} className="flex items-start space-x-2">
                    <span className="text-slate-400 font-bold">• [{step.time}]</span>
                    <span>{step.action}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default Reports;
