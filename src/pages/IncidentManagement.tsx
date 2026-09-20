import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Flame,
  Droplets,
  AlertTriangle,
  Car,
  Building,
  Users,
  Search,
  ChevronDown,
  Table as TableIcon,
  LayoutGrid,
  Map as MapIcon,
  ArrowRight,
  Filter,
  Plus,
  Shield,
  Clock,
  Radio,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { IncidentFormDialog } from '../components/dialogs/IncidentFormDialog';
import { OpenStreetMap } from '../components/map/OpenStreetMap';

export const IncidentManagement: React.FC = () => {
  const navigate = useNavigate();
  const { incidents } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'map'>('table');
  const [formOpen, setFormOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === '1') setViewMode('table');
      if (e.key === '2') setViewMode('cards');
      if (e.key === '3') setViewMode('map');
      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setFormOpen(true);
      }
      if (e.key === '/' || (e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getDisasterIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('fire')) return <Flame className="w-4 h-4 text-orange-500" />;
    if (t.includes('flood') || t.includes('water')) return <Droplets className="w-4 h-4 text-blue-500" />;
    if (t.includes('gas') || t.includes('hazmat') || t.includes('chemical')) return <AlertTriangle className="w-4 h-4 text-purple-600" />;
    if (t.includes('landslide') || t.includes('slide')) return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    if (t.includes('earthquake') || t.includes('quake') || t.includes('seismic')) return <AlertTriangle className="w-4 h-4 text-rose-600" />;
    if (t.includes('road') || t.includes('vehicle') || t.includes('traffic') || t.includes('collision')) return <Car className="w-4 h-4 text-sky-500" />;
    if (t.includes('building') || t.includes('collapse') || t.includes('structure')) return <Building className="w-4 h-4 text-rose-500" />;
    if (t.includes('crowd') || t.includes('stampede') || t.includes('public')) return <Users className="w-4 h-4 text-emerald-500" />;
    return <AlertTriangle className="w-4 h-4 text-slate-500" />;
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev.toUpperCase()) {
      case 'CRITICAL':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[11px] font-extrabold shadow-2xs">● Critical</span>;
      case 'HIGH':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-[11px] font-extrabold shadow-2xs">▲ High</span>;
      case 'MEDIUM':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 text-[11px] font-extrabold shadow-2xs">● Medium</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200 text-[11px] font-extrabold shadow-2xs">● Low</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DISPATCHED':
      case 'RESPONDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-extrabold shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            Responding
          </span>
        );
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-extrabold shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Active
          </span>
        );
      case 'CONTAINED':
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {status.toUpperCase() === 'RESOLVED' ? 'Resolved' : 'Contained'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200 text-[11px] font-extrabold shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
            Under Investigation
          </span>
        );
    }
  };

  // Robust multi-type matching logic so all filter dropdown keys work smoothly
  const filtered = incidents.filter(i => {
    const term = searchTerm.toLowerCase().trim();
    const matchSearch = term === '' ||
      i.id.toLowerCase().includes(term) ||
      i.title.toLowerCase().includes(term) ||
      (i.sector && i.sector.toLowerCase().includes(term)) ||
      i.locationName.toLowerCase().includes(term) ||
      i.type.toLowerCase().includes(term);

    let matchType = true;
    if (selectedType !== 'ALL') {
      const target = selectedType.toLowerCase();
      const incType = i.type.toLowerCase();
      if (target === 'fire') matchType = incType.includes('fire');
      else if (target === 'flood') matchType = incType.includes('flood') || incType.includes('water');
      else if (target === 'gas leak') matchType = incType.includes('gas') || incType.includes('hazmat') || incType.includes('chemical');
      else if (target === 'landslide') matchType = incType.includes('landslide') || incType.includes('slide');
      else if (target === 'earthquake') matchType = incType.includes('earthquake') || incType.includes('quake') || incType.includes('seismic');
      else if (target === 'road accident') matchType = incType.includes('road') || incType.includes('vehicle') || incType.includes('collision');
      else if (target === 'building collapse') matchType = incType.includes('building') || incType.includes('collapse') || incType.includes('structure');
      else if (target === 'crowd emergency') matchType = incType.includes('crowd') || incType.includes('stampede');
      else matchType = incType.includes(target) || target.includes(incType);
    }

    const matchSev = selectedSeverity === 'ALL' || i.severity.toUpperCase() === selectedSeverity.toUpperCase();
    return matchSearch && matchType && matchSev;
  });

  return (
    <div className="space-y-4 text-left font-sans">
      
      {/* Filter Bar (Apple Liquid Glassmorphism) */}
      <div className="liquid-glass-card p-3 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search incident ID, sector, keywords..."
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

        {/* Dropdown Filters & View Switchers */}
        <div className="flex items-center space-x-2.5 overflow-x-auto flex-shrink-0">
          
          {/* Disaster Type Filter */}
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-white/80 border border-white/90 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer shadow-2xs hover:bg-white transition-colors"
          >
            <option value="ALL">All Disaster Types</option>
            <option value="Fire">Fire</option>
            <option value="Flood">Flood</option>
            <option value="Gas Leak">Gas Leak</option>
            <option value="Landslide">Landslide</option>
            <option value="Earthquake">Earthquake</option>
            <option value="Road Accident">Road Accident</option>
            <option value="Building Collapse">Building Collapse</option>
            <option value="Crowd Emergency">Crowd Emergency</option>
          </select>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={e => setSelectedSeverity(e.target.value)}
            className="px-3 py-2 bg-white/80 border border-white/90 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer shadow-2xs hover:bg-white transition-colors"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* View Toggle Buttons */}
          <div className="flex items-center bg-white/60 p-0.5 rounded-xl border border-white/80 shadow-2xs backdrop-blur-md">
            <button
              onClick={() => setViewMode('table')}
              title="Table View (Press 1)"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${viewMode === 'table' ? 'liquid-glass-pill text-slate-900 shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              title="Cards View (Press 2)"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${viewMode === 'cards' ? 'liquid-glass-pill text-slate-900 shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              title="Map View (Press 3)"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${viewMode === 'map' ? 'liquid-glass-pill text-slate-900 shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>

          {/* New Incident Trigger */}
          <button
            onClick={() => setFormOpen(true)}
            title="Create New Incident (Press N)"
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center space-x-1 cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Incident</span>
          </button>

        </div>

      </div>

      {/* CONDITIONAL RENDER: Table View Mode */}
      {viewMode === 'table' && (
        <div className="liquid-glass-card rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/60 bg-white/40 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">INCIDENT ID</th>
                  <th className="py-3 px-4">DISASTER TYPE</th>
                  <th className="py-3 px-4">TITLE & SECTOR</th>
                  <th className="py-3 px-4">SEVERITY</th>
                  <th className="py-3 px-4">RISK SCORE</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">RESPONDERS</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((inc) => {
                  const score = inc.riskScore || (inc.severity === 'CRITICAL' ? 94 : inc.severity === 'HIGH' ? 82 : 64);
                  const scoreColor = score >= 90 ? 'bg-rose-500' : score >= 75 ? 'bg-orange-500' : 'bg-amber-500';
                  const respondersText = `${inc.assignedResources?.length || 3} units deployed`;

                  return (
                    <tr
                      key={inc.id}
                      onClick={() => navigate(`/incidents/${inc.id}`)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Incident ID */}
                      <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {inc.id}
                      </td>

                      {/* Disaster Type */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2 font-bold text-slate-900">
                          {getDisasterIcon(inc.type)}
                          <span>{inc.type}</span>
                        </div>
                      </td>

                      {/* Title & Sector */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <p className="font-bold text-slate-900 truncate">{inc.title}</p>
                        <p className="text-[11px] text-slate-400 truncate flex items-center space-x-1 mt-0.5">
                          <span>📍</span>
                          <span>{inc.sector || inc.locationName}</span>
                        </p>
                      </td>

                      {/* Severity */}
                      <td className="py-3.5 px-4">
                        {getSeverityBadge(inc.severity)}
                      </td>

                      {/* Risk Score */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-12 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div className={`h-full ${scoreColor}`} style={{ width: `${score}%` }} />
                          </div>
                          <span className="font-extrabold text-slate-900">{score}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(inc.status)}
                      </td>

                      {/* Responders */}
                      <td className="py-3.5 px-4 text-slate-500 font-semibold">
                        {respondersText}
                      </td>

                      {/* Action button */}
                      <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/incidents/${inc.id}`)}
                          className="px-3 py-1.5 bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-700 font-extrabold text-[11px] rounded-lg transition-all shadow-2xs inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <span>Workspace</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONDITIONAL RENDER: Cards View Mode */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((inc) => {
            const score = inc.riskScore || (inc.severity === 'CRITICAL' ? 94 : inc.severity === 'HIGH' ? 82 : 64);
            const scoreColor = score >= 90 ? 'bg-rose-500' : score >= 75 ? 'bg-orange-500' : 'bg-amber-500';

            return (
              <div
                key={inc.id}
                onClick={() => navigate(`/incidents/${inc.id}`)}
                className="liquid-glass-card p-4 rounded-2xl space-y-3 hover:-translate-y-1 transition-all cursor-pointer shadow-xs border border-white/80 group flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: ID + Severity Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {inc.id}
                    </span>
                    {getSeverityBadge(inc.severity)}
                  </div>

                  {/* Title & Type */}
                  <div className="flex items-start space-x-2.5 mb-2">
                    <div className="p-2 rounded-xl bg-white/80 border border-white shadow-2xs flex-shrink-0">
                      {getDisasterIcon(inc.type)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm tracking-tight leading-snug line-clamp-2">
                        {inc.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                        📍 {inc.sector || inc.locationName}
                      </p>
                    </div>
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-white/50 p-2.5 rounded-xl border border-white/60 mb-3">
                    {inc.description || 'Active incident under EOC tactical surveillance and responder dispatch matrix.'}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-white/60">
                  {/* Risk Score + Responders Row */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Risk:</span>
                      <div className="w-12 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className={`h-full ${scoreColor}`} style={{ width: `${score}%` }} />
                      </div>
                      <span className="font-mono font-bold text-slate-900">{score}</span>
                    </div>

                    <div className="text-right">
                      {getStatusBadge(inc.status)}
                    </div>
                  </div>

                  {/* Workspace Navigation Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/incidents/${inc.id}`); }}
                    className="w-full py-2 bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Open Tactical Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* CONDITIONAL RENDER: Map View Mode */}
      {viewMode === 'map' && (
        <div className="liquid-glass-card p-3 rounded-2xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <MapIcon className="w-4 h-4 text-blue-600" />
                <span>Tactical Map Overview ({filtered.length} Filtered Incidents)</span>
              </h3>
              <p className="text-[11px] text-slate-500">Live GIS positions & dynamic hazard buffer zones</p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 font-bold bg-white/80 px-2 py-1 rounded-lg border border-white">
              Andhra Pradesh Regional Center
            </span>
          </div>

          <div className="rounded-xl overflow-hidden shadow-xs border border-slate-200">
            <OpenStreetMap
              heightClass="h-[600px]"
            />
          </div>
        </div>
      )}

      <IncidentFormDialog isOpen={formOpen} onClose={() => setFormOpen(false)} />

    </div>
  );
};
export default IncidentManagement;

