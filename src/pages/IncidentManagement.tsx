import React, { useState } from 'react';
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
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { IncidentFormDialog } from '../components/dialogs/IncidentFormDialog';

export const IncidentManagement: React.FC = () => {
  const navigate = useNavigate();
  const { incidents } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'map'>('table');
  const [formOpen, setFormOpen] = useState(false);

  const getDisasterIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'fire':
      case 'structure fire':
        return <Flame className="w-4 h-4 text-orange-500" />;
      case 'flood':
        return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'gas leak':
      case 'hazmat spill':
        return <AlertTriangle className="w-4 h-4 text-purple-600" />;
      case 'road accident':
      case 'multi-vehicle collision':
        return <Car className="w-4 h-4 text-sky-500" />;
      case 'building collapse':
        return <Building className="w-4 h-4 text-rose-500" />;
      case 'crowd emergency':
        return <Users className="w-4 h-4 text-emerald-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-slate-500" />;
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev.toUpperCase()) {
      case 'CRITICAL':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[11px] font-extrabold">● Critical</span>;
      case 'HIGH':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-[11px] font-extrabold">▲ High</span>;
      case 'MEDIUM':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 text-[11px] font-extrabold">● Medium</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200 text-[11px] font-extrabold">● Low</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DISPATCHED':
      case 'RESPONDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-extrabold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            Responding
          </span>
        );
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-extrabold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Active
          </span>
        );
      case 'CONTAINED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Contained
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200 text-[11px] font-extrabold">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
            Under Investigation
          </span>
        );
    }
  };

  const filtered = incidents.filter(i => {
    const matchSearch = searchTerm === '' ||
      i.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.sector && i.sector.toLowerCase().includes(searchTerm.toLowerCase())) ||
      i.locationName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = selectedType === 'ALL' || i.type.toLowerCase() === selectedType.toLowerCase();
    const matchSev = selectedSeverity === 'ALL' || i.severity.toUpperCase() === selectedSeverity.toUpperCase();
    return matchSearch && matchType && matchSev;
  });

  return (
    <div className="space-y-4 text-left font-sans">
      
      {/* Filter Bar (Apple Liquid Glassmorphism) */}
      <div className="liquid-glass-card p-3 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search incident ID, sector, keywords..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/70 border border-white/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all shadow-2xs"
          />
        </div>

        {/* Dropdown Filters & View Switchers */}
        <div className="flex items-center space-x-2.5 overflow-x-auto flex-shrink-0">
          
          {/* Disaster Type Filter */}
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-white/80 border border-white/90 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer shadow-2xs"
          >
            <option value="ALL">All Disaster Types</option>
            <option value="Fire">Fire</option>
            <option value="Flood">Flood</option>
            <option value="Gas Leak">Gas Leak</option>
            <option value="Road Accident">Road Accident</option>
            <option value="Building Collapse">Building Collapse</option>
            <option value="Crowd Emergency">Crowd Emergency</option>
          </select>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={e => setSelectedSeverity(e.target.value)}
            className="px-3 py-2 bg-white/80 border border-white/90 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer shadow-2xs"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-white/60 p-0.5 rounded-xl border border-white/80 shadow-2xs backdrop-blur-md">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${viewMode === 'table' ? 'liquid-glass-pill text-slate-900 shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${viewMode === 'cards' ? 'liquid-glass-pill text-slate-900 shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${viewMode === 'map' ? 'liquid-glass-pill text-slate-900 shadow-xs font-extrabold' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>

          <button
            onClick={() => setFormOpen(true)}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center space-x-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Incident</span>
          </button>

        </div>

      </div>

      {/* Main Table View (Apple Liquid Glassmorphism) */}
      <div className="liquid-glass-card rounded-2xl overflow-hidden">
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
                  <tr key={inc.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Incident ID */}
                    <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900">
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
                    <td className="py-3.5 px-4 text-slate-500">
                      {respondersText}
                    </td>

                    {/* Action button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => navigate(`/incidents/${inc.id}`)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 font-extrabold text-[11px] rounded-lg transition-all shadow-2xs inline-flex items-center space-x-1 cursor-pointer"
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

      <IncidentFormDialog isOpen={formOpen} onClose={() => setFormOpen(false)} />

    </div>
  );
};
export default IncidentManagement;
