import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Truck,
  TrendingUp,
  Download,
  BarChart3,
  Flame,
  Droplets,
  Activity,
  ShieldAlert,
  Building,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Analytics: React.FC = () => {
  const { addNotification } = useApp();
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      addNotification("KPI DOSSIER GENERATED: Cryptographically signed performance audit exported.", "info");
    }, 600);
  };

  const hourlyPerformance = [
    { time: '08:00', value: 4.8, status: 'nominal' },
    { time: '10:00', value: 5.2, status: 'nominal' },
    { time: '12:00', value: 6.8, status: 'surge' },
    { time: '14:00', value: 4.6, status: 'nominal' },
    { time: '16:00', value: 7.2, status: 'surge' },
    { time: '18:00', value: 6.5, status: 'surge' },
    { time: '20:00', value: 5.1, status: 'nominal' },
  ];

  const disasterCategories = [
    { label: 'Fire & Thermal Hazards', count: 18, pct: 32, color: 'bg-orange-500' },
    { label: 'Floods & Hydrological', count: 12, pct: 21, color: 'bg-cyan-500' },
    { label: 'Gas & Chemical Leaks', count: 9, pct: 16, color: 'bg-purple-500' },
    { label: 'Road & Transit Accidents', count: 8, pct: 14, color: 'bg-emerald-500' },
    { label: 'Structural & Seismic', count: 6, pct: 11, color: 'bg-blue-600' },
    { label: 'Crowd & Public Surge', count: 4, pct: 6, color: 'bg-amber-500' },
  ];

  const fleetUtilization = [
    { name: 'Fire Engines & Pumpers', pct: 67, deployed: 16, avail: 6, total: 24, barColor: 'bg-blue-600' },
    { name: 'ALS / BLS Ambulances', pct: 74, deployed: 28, avail: 8, total: 38, barColor: 'bg-blue-600' },
    { name: 'Police & Traffic Units', pct: 69, deployed: 31, avail: 12, total: 45, barColor: 'bg-blue-600' },
    { name: 'Urban Search & Rescue Teams', pct: 75, deployed: 9, avail: 3, total: 12, barColor: 'bg-blue-600' },
    { name: 'Recon & Sensor Drones', pct: 69, deployed: 11, avail: 4, total: 16, barColor: 'bg-blue-600' },
    { name: 'Heavy Earthmovers & Shoring', pct: 38, deployed: 3, avail: 5, total: 8, barColor: 'bg-blue-600' },
  ];

  return (
    <div className="space-y-4 text-left font-sans">
      
      {/* Top Header & Export Action */}
      <div className="liquid-glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Operational Analytics & KPI Benchmarks
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-extrabold border border-rose-200 shadow-2xs">
              ● 2 CRITICAL
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Autonomous response latencies, fleet utilization curves & surge modeling
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={exporting}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-60"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{exporting ? 'Generating Dossier...' : 'Export KPI Dossier'}</span>
        </button>
      </div>

      {/* 4 Top KPI Cards (Matching Screenshot 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Avg Response Time */}
        <div className="liquid-glass-card p-4 rounded-2xl flex items-start justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              AVG RESPONSE TIME
            </span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-black text-slate-900 tracking-tight">5.2 min</span>
              <span className="text-xs text-slate-400 font-semibold">Target: 6.0m</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-bold mt-2 inline-flex items-center space-x-0.5">
              <span>↗ 13% faster</span>
              <span className="text-slate-400 font-normal">vs last hour</span>
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-2xs">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 2: Incident Clearance Rate */}
        <div className="liquid-glass-card p-4 rounded-2xl flex items-start justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              INCIDENT CLEARANCE RATE
            </span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-black text-slate-900 tracking-tight">89.4%</span>
              <span className="text-xs text-slate-400 font-semibold">24hr Window</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-bold mt-2 inline-flex items-center space-x-0.5">
              <span>↗ +4.2%</span>
              <span className="text-slate-400 font-normal">vs last hour</span>
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 3: Fleet Efficiency Index */}
        <div className="liquid-glass-card p-4 rounded-2xl flex items-start justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              FLEET EFFICIENCY INDEX
            </span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-black text-slate-900 tracking-tight">94.1</span>
              <span className="text-xs text-slate-400 font-semibold">/100 Score</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-bold mt-2 inline-flex items-center space-x-0.5">
              <span>↗ +1.8 pts</span>
              <span className="text-slate-400 font-normal">vs last hour</span>
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-2xs">
            <Truck className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 4: AI Dispatch Accuracy */}
        <div className="liquid-glass-card p-4 rounded-2xl flex items-start justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              AI DISPATCH ACCURACY
            </span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-black text-slate-900 tracking-tight">96.8%</span>
              <span className="text-xs text-slate-400 font-semibold">Human Approved</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-bold mt-2 inline-flex items-center space-x-0.5">
              <span>↗ +0.5%</span>
              <span className="text-slate-400 font-normal">vs last hour</span>
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-2xs">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* Middle Row: Hourly Response Time Chart + Disaster Category Distribution (Matching Screenshot 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left Card: Hourly Response Time Performance */}
        <div className="liquid-glass-card p-5 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                Hourly Response Time Performance
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Actual arrival latency vs 6.0 min benchmark
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
              Optimal Corridor Flow
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2 border-b border-slate-100">
            {hourlyPerformance.map((bar, i) => {
              const heightPct = (bar.value / 8) * 100;
              const barColor = bar.status === 'nominal' ? 'bg-[#0088FF]' : 'bg-[#FF3B30]';

              return (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-mono text-slate-400 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.value}m
                  </span>
                  <div
                    className={`w-full max-w-[28px] ${barColor} rounded-t-lg transition-all`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] font-mono text-slate-400 font-bold mt-2">
                    {bar.time}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center space-x-6 text-[10px] font-bold text-slate-500 pt-1">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#0088FF]" />
              <span>Under Benchmark (Nominal)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#FF3B30]" />
              <span>Over Benchmark (Traffic Surge)</span>
            </div>
          </div>
        </div>

        {/* Right Card: Disaster Category Distribution */}
        <div className="liquid-glass-card p-5 rounded-2xl space-y-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
              Disaster Category Distribution
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Breakdown of 57 incidents logged this quarter
            </p>
          </div>

          <div className="space-y-2.5 pt-1">
            {disasterCategories.map((cat, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>{cat.label}</span>
                  <span className="font-mono text-slate-500 text-[11px]">
                    {cat.count} ({cat.pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full`}
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Section: Resource Fleet Category Utilization */}
      <div className="space-y-2.5">
        <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider pl-1">
          Resource Fleet Category Utilization
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {fleetUtilization.map((f, i) => (
            <div key={i} className="liquid-glass-card p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-xs">
                  {f.name}
                </span>
                <span className="text-xs font-black text-blue-600 font-mono">
                  {f.pct}% Active
                </span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full ${f.barColor} rounded-full`}
                  style={{ width: `${f.pct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
                <span>Dep: {f.deployed}</span>
                <span>Avail: {f.avail}</span>
                <span>Total: {f.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Section: Background AI/ML Model Intelligence & Benchmark Matrix */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between pl-1">
          <div>
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              Background AI Model Benchmarks & Dataset Precision Matrix
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Real-time inference latencies, AUC-ROC scores & background training convergence across 10 multi-hazard models
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[10px] border border-emerald-200 shadow-2xs">
            ● 10 Models Active (96.2% Avg Accuracy)
          </span>
        </div>

        <div className="liquid-glass-card rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/60 bg-white/40 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">MODEL ID & DOMAIN</th>
                  <th className="py-3 px-4">DATASET SOURCE</th>
                  <th className="py-3 px-4">ARCHITECTURE</th>
                  <th className="py-3 px-4">ACCURACY</th>
                  <th className="py-3 px-4">AUC-ROC</th>
                  <th className="py-3 px-4">INFERENCE LATENCY</th>
                  <th className="py-3 px-4">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {[
                  { id: 'ML-FIRE-01', name: 'Fire Flashover & BLEVE Predictor', domain: 'Fire & Thermal', dataset: 'NASA FIRMS & NIST', arch: 'CNN + XGBoost', acc: '96.8%', auc: '0.988', lat: '8.4ms' },
                  { id: 'ML-FLOOD-02', name: 'Inundation Peak Regressor', domain: 'Flood & Hydro', dataset: 'USGS NWIS & GloFAS', arch: 'Bi-LSTM Regressor', acc: '94.5%', auc: '0.974', lat: '12.1ms' },
                  { id: 'ML-SLOPE-03', name: 'InSAR Landslide Shear Classifier', domain: 'Landslide & Terrain', dataset: 'Sentinel-1 InSAR & NASA GLC', arch: 'Random Forest', acc: '95.2%', auc: '0.981', lat: '6.8ms' },
                  { id: 'ML-GAS-04', name: 'Chemical Plume Dispersion Net', domain: 'Gas & Chemical', dataset: 'UCI Gas Drift & CAMEO', arch: 'PINN Autoencoder', acc: '97.4%', auc: '0.992', lat: '14.5ms' },
                  { id: 'ML-SEIS-05', name: 'Strong-Motion & Strain Classifier', domain: 'Seismic & Structural', dataset: 'USGS ComCat & STEAD', arch: '1D-CNN + SVM', acc: '96.1%', auc: '0.985', lat: '5.2ms' },
                  { id: 'ML-TRAFFIC-06', name: 'Arterial Bottleneck Predictor', domain: 'Traffic & Transit', dataset: 'US-Accidents & PeMS', arch: 'Temporal GNN', acc: '93.8%', auc: '0.968', lat: '16.2ms' },
                  { id: 'ML-CROWD-07', name: 'Optical Density & Egress Surge', domain: 'Crowd & Pedestrian', dataset: 'ShanghaiTech & PETS', arch: 'CSRNet Regressor', acc: '95.8%', auc: '0.983', lat: '11.0ms' },
                  { id: 'ML-HOSP-08', name: 'Trauma Net Queuing Optimizer', domain: 'Hospital & Medical', dataset: 'HHS HealthData & MIMIC-IV', arch: 'Queuing Optimizer', acc: '97.9%', auc: '0.994', lat: '4.8ms' },
                  { id: 'ML-EVAC-09', name: 'Hazard-Aware Corridor Router', domain: 'Geospatial & 3D', dataset: 'OpenStreetMap & FEMA NSS', arch: 'Risk-Weighted Dijkstra', acc: '98.4%', auc: '0.996', lat: '9.6ms' },
                  { id: 'ML-PLUME-10', name: 'Atmospheric Dispersion Model', domain: 'Weather & Climate', dataset: 'Open-Meteo & NOAA HRRR', arch: 'Gaussian Puff Dispersion', acc: '96.5%', auc: '0.989', lat: '7.2ms' }
                ].map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{m.id}</span>
                      <span className="text-[11px] text-slate-500">{m.name}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-blue-700 text-xs">
                      {m.dataset}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 text-xs">
                      {m.arch}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-600 font-mono">
                      {m.acc}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-800">
                      {m.auc}
                    </td>
                    <td className="py-3 px-4 font-mono text-blue-600">
                      {m.lat}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
export default Analytics;
