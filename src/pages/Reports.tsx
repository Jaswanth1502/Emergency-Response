import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import reportsData from '../dummy-data/reports.json';
import { FileText, Download, Eye, Plus } from 'lucide-react';
import { ConfirmDialog } from '../components/dialogs/ConfirmDialog';

interface ReportRecord {
  id: string;
  title: string;
  type: string;
  dateRange: string;
  generatedBy: string;
  summary: string;
  status: string;
  densityDistribution: { sector: string; incidents: number; avgResponseMins: number; critical: number }[];
}

const reports = reportsData as ReportRecord[];

const HeatmapGrid: React.FC<{ data: { sector: string; incidents: number; avgResponseMins: number; critical: number }[] }> = ({ data }) => {
  const maxInc = Math.max(...data.map(d => d.incidents));
  return (
    <div className="grid gap-2">
      {data.map(d => {
        const intensity = d.incidents / maxInc;
        const bg = intensity > 0.75 ? 'bg-rose-500/30 border-rose-500/40' :
                   intensity > 0.5 ? 'bg-amber-500/25 border-amber-500/30' :
                   intensity > 0.25 ? 'bg-indigo-500/15 border-indigo-500/20' :
                   'bg-emerald-500/10 border-emerald-500/20';
        return (
          <div key={d.sector} className={`p-3 rounded-xl border ${bg} flex items-center justify-between text-xs`}>
            <div>
              <span className="font-bold text-slate-800 block">{d.sector}</span>
              <span className="text-[10px] text-slate-500">{d.incidents} incidents • {d.critical} critical</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-black tabular-nums text-slate-800">{d.avgResponseMins}m</span>
              <span className="text-[9px] text-slate-400 block uppercase">Avg Response</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<ReportRecord | null>(null);
  const [downloadDialog, setDownloadDialog] = useState(false);

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-300/25 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Crisis Intelligence Reports</h2>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Dashboard / Generated Analysis Documents</p>
        </div>
        <button
          onClick={() => setDownloadDialog(true)}
          className="mt-3 sm:mt-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Report</span>
        </button>
      </div>

      {/* Reports Table */}
      <GlassCard tint="indigo" title="Report Catalog" subtitle="Audit logs and assessment documents">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-300/30 text-slate-500 text-[10px] uppercase font-extrabold tracking-wider">
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-3">Report Title</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Date Range</th>
                <th className="py-3 px-3">Author</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-300/10">
              {reports.map(r => (
                <tr key={r.id} className="hover:bg-slate-500/5 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-indigo-600">{r.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{r.title}</td>
                  <td className="py-3 px-3 text-slate-500">{r.type}</td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[10px]">{r.dateRange}</td>
                  <td className="py-3 px-3 text-slate-600">{r.generatedBy}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      r.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20' :
                      'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                    }`}>{r.status}</span>
                  </td>
                  <td className="py-3 px-3 text-right flex items-center justify-end gap-2">
                    <button onClick={() => setSelectedReport(r)} className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 cursor-pointer"><Eye className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDownloadDialog(true)} className="p-1.5 rounded-lg bg-slate-500/10 text-slate-600 hover:bg-slate-500/20 cursor-pointer"><Download className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Selected Report Detail with Heatmap */}
      {selectedReport && (
        <div className="grid md:grid-cols-2 gap-6">
          <GlassCard title={selectedReport.title} subtitle={selectedReport.type} tint="indigo" icon={<FileText className="w-4 h-4" />}>
            <div className="space-y-3 mt-1">
              <p className="text-xs text-slate-600 leading-relaxed">{selectedReport.summary}</p>
              <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-300/20 pt-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Date Range</span>
                  <span className="font-semibold text-slate-800">{selectedReport.dateRange}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Generated By</span>
                  <span className="font-semibold text-slate-800">{selectedReport.generatedBy}</span>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard title="Incident Density Heatmap" subtitle="Sector-by-sector intensity distribution" tint="rose">
            <HeatmapGrid data={selectedReport.densityDistribution} />
          </GlassCard>
        </div>
      )}

      <ConfirmDialog
        isOpen={downloadDialog}
        title="Export Report"
        description="Report export functionality requires backend connectivity. This feature will generate PDF/CSV documents when connected to the Spring Boot API layer."
        type="info"
        confirmLabel="Understood"
        onConfirm={() => {}}
        onCancel={() => setDownloadDialog(false)}
      />
    </div>
  );
};
export default Reports;
