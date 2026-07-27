import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/common/GlassCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { IncidentFormDialog } from '../components/dialogs/IncidentFormDialog';
import { Search, AlertOctagon, SlidersHorizontal, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export const IncidentManagement: React.FC = () => {
  const navigate = useNavigate();
  const { incidents } = useApp();

  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'id' | 'reportedAt' | 'severity'>('reportedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);

  const itemsPerPage = 6;

  // Sorting priorities for severity
  const severityValue = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };

  // Filter incidents
  const filtered = incidents.filter(inc => {
    const matchesSearch = inc.title.toLowerCase().includes(search.toLowerCase()) ||
                          inc.locationName.toLowerCase().includes(search.toLowerCase()) ||
                          inc.id.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  // Sort incidents
  const sorted = [...filtered].sort((a, b) => {
    let comp = 0;
    if (sortField === 'id') {
      comp = a.id.localeCompare(b.id);
    } else if (sortField === 'reportedAt') {
      comp = new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime();
    } else if (sortField === 'severity') {
      comp = severityValue[a.severity] - severityValue[b.severity];
    }

    return sortOrder === 'asc' ? comp : -comp;
  });

  // Paginate
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const toggleSort = (field: 'id' | 'reportedAt' | 'severity') => {
    if (sortField === field) {
      setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-300/25 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Tactical Incident Management</h2>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Dashboard / Active Situational Awareness</p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="mt-3 sm:mt-0 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
        >
          <AlertOctagon className="w-4.5 h-4.5" />
          <span>Establish Incident</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <GlassCard tint="slate">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Search bar */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Incident ID, title, or location..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-white/70 border border-slate-300/50 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
            />
          </div>

          {/* Filters dropdowns */}
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </div>
            
            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={e => { setSeverityFilter(e.target.value); setPage(1); }}
              className="px-3 py-1.5 bg-white/70 border border-slate-300/50 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-1.5 bg-white/70 border border-slate-300/50 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="DISPATCHED">Dispatched</option>
              <option value="CONTAINED">Contained</option>
              <option value="RESOLVED">Resolved</option>
            </select>

            {/* Sort Orders */}
            <button
              onClick={() => toggleSort('severity')}
              className={`px-3 py-1.5 border border-slate-300/50 rounded-xl text-xs font-bold ${sortField === 'severity' ? 'bg-slate-900 text-white' : 'bg-white/70 text-slate-700'}`}
            >
              Sort Severity {sortField === 'severity' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </button>

            <button
              onClick={() => toggleSort('reportedAt')}
              className={`px-3 py-1.5 border border-slate-300/50 rounded-xl text-xs font-bold ${sortField === 'reportedAt' ? 'bg-slate-900 text-white' : 'bg-white/70 text-slate-700'}`}
            >
              Sort Date {sortField === 'reportedAt' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </button>
          </div>

        </div>
      </GlassCard>

      {/* Main Datatable */}
      <GlassCard tint="slate">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-300/30 text-slate-500 text-[10px] uppercase font-extrabold tracking-wider">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Incident Title</th>
                <th className="py-3 px-4">Hazard Category</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Reported Time</th>
                <th className="py-3 px-4">Commander</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-300/10">
              {paginated.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-500/5 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-rose-600">{inc.id}</td>
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-semibold text-slate-800 block leading-tight">{inc.title}</span>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{inc.locationName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-semibold">{inc.type}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge severity={inc.severity} />
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={inc.status} />
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500">
                    {new Date(inc.reportedAt).toLocaleDateString()} {new Date(inc.reportedAt).toLocaleTimeString()}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-600">{inc.assignedCommander}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => navigate(`/incidents/${inc.id}`)}
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] uppercase font-bold tracking-wider inline-flex items-center gap-1 cursor-pointer transition-all hover:bg-slate-800 shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
              
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                    No matching incidents found inside EOC registry. Try adjusting filter query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-300/20 pt-4 mt-3">
            <span className="text-[10px] text-slate-500 uppercase font-bold">
              Showing page {page} of {totalPages} ({filtered.length} total entries)
            </span>
            <div className="flex space-x-1">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-slate-300/30 text-slate-600 disabled:opacity-40 hover:bg-slate-200/50 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-slate-300/30 text-slate-600 disabled:opacity-40 hover:bg-slate-200/50 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </GlassCard>

      <IncidentFormDialog isOpen={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
};
export default IncidentManagement;
