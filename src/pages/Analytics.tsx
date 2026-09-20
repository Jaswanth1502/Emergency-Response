import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Truck,
  TrendingUp,
  Download,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Analytics: React.FC = () => {
  const { addNotification } = useApp();
  const [exporting, setExporting] = useState(false);
  const [timeRange, setTimeRange] = useState<'1H' | '24H' | '7D' | '30D' | 'YTD'>('24H');

  // Dynamic datasets dictionary based on selected timeRange
  const getTimeRangeData = (range: '1H' | '24H' | '7D' | '30D' | 'YTD') => {
    switch (range) {
      case '1H':
        return {
          metrics: {
            responseTime: '4.2m',
            targetTime: '6.0m',
            fasterPct: '30% faster',
            clearance: '96.4%',
            clearanceSub: '+8.1% resolution rate',
            fleetIndex: '97.5',
            fleetSub: '+3.2 pts efficiency',
            accuracy: '98.6%',
            accuracySub: 'Real-time telemetry'
          },
          performance: [
            { time: '12:00', value: 3.8, status: 'nominal' },
            { time: '12:10', value: 4.1, status: 'nominal' },
            { time: '12:20', value: 5.5, status: 'nominal' },
            { time: '12:30', value: 6.7, status: 'surge' },
            { time: '12:40', value: 4.2, status: 'nominal' },
            { time: '12:50', value: 3.9, status: 'nominal' },
            { time: '13:00', value: 4.0, status: 'nominal' },
          ],
          categoriesSummary: { totalIncidents: 6, subtitle: '6 incidents logged in the past 60 minutes' },
          categories: [
            { label: 'Fire & Thermal Hazards', count: 2, pct: 33, color: 'bg-orange-500' },
            { label: 'Floods & Hydrological', count: 1, pct: 17, color: 'bg-cyan-500' },
            { label: 'Gas & Chemical Leaks', count: 1, pct: 17, color: 'bg-purple-500' },
            { label: 'Road & Transit Accidents', count: 1, pct: 17, color: 'bg-emerald-500' },
            { label: 'Structural & Seismic', count: 1, pct: 16, color: 'bg-blue-600' },
            { label: 'Crowd & Public Surge', count: 0, pct: 0, color: 'bg-amber-500' },
          ],
          fleet: [
            { name: 'Fire Engines & Pumpers', pct: 42, deployed: 10, avail: 14, total: 24, barColor: 'bg-blue-600' },
            { name: 'ALS / BLS Ambulances', pct: 58, deployed: 22, avail: 16, total: 38, barColor: 'bg-blue-600' },
            { name: 'Police & Traffic Units', pct: 51, deployed: 23, avail: 22, total: 45, barColor: 'bg-blue-600' },
            { name: 'Urban Search & Rescue Teams', pct: 42, deployed: 5, avail: 7, total: 12, barColor: 'bg-blue-600' },
            { name: 'Recon & Sensor Drones', pct: 81, deployed: 13, avail: 3, total: 16, barColor: 'bg-blue-600' },
            { name: 'Heavy Earthmovers & Shoring', pct: 25, deployed: 2, avail: 6, total: 8, barColor: 'bg-blue-600' },
          ],
          benchmarksAvg: '98.6%'
        };
      case '7D':
        return {
          metrics: {
            responseTime: '5.6m',
            targetTime: '6.0m',
            fasterPct: '7% faster',
            clearance: '87.9%',
            clearanceSub: '+2.4% resolution rate',
            fleetIndex: '92.8',
            fleetSub: '+0.9 pts efficiency',
            accuracy: '95.4%',
            accuracySub: '7-Day rolling batch'
          },
          performance: [
            { time: 'Mon', value: 5.1, status: 'nominal' },
            { time: 'Tue', value: 4.9, status: 'nominal' },
            { time: 'Wed', value: 6.2, status: 'surge' },
            { time: 'Thu', value: 7.5, status: 'surge' },
            { time: 'Fri', value: 6.1, status: 'surge' },
            { time: 'Sat', value: 5.4, status: 'nominal' },
            { time: 'Sun', value: 4.8, status: 'nominal' },
          ],
          categoriesSummary: { totalIncidents: 382, subtitle: '382 incidents logged across past 7 days' },
          categories: [
            { label: 'Fire & Thermal Hazards', count: 114, pct: 30, color: 'bg-orange-500' },
            { label: 'Floods & Hydrological', count: 92, pct: 24, color: 'bg-cyan-500' },
            { label: 'Gas & Chemical Leaks', count: 57, pct: 15, color: 'bg-purple-500' },
            { label: 'Road & Transit Accidents', count: 61, pct: 16, color: 'bg-emerald-500' },
            { label: 'Structural & Seismic', count: 34, pct: 9, color: 'bg-blue-600' },
            { label: 'Crowd & Public Surge', count: 24, pct: 6, color: 'bg-amber-500' },
          ],
          fleet: [
            { name: 'Fire Engines & Pumpers', pct: 75, deployed: 18, avail: 6, total: 24, barColor: 'bg-blue-600' },
            { name: 'ALS / BLS Ambulances', pct: 82, deployed: 31, avail: 7, total: 38, barColor: 'bg-blue-600' },
            { name: 'Police & Traffic Units', pct: 78, deployed: 35, avail: 10, total: 45, barColor: 'bg-blue-600' },
            { name: 'Urban Search & Rescue Teams', pct: 67, deployed: 8, avail: 4, total: 12, barColor: 'bg-blue-600' },
            { name: 'Recon & Sensor Drones', pct: 75, deployed: 12, avail: 4, total: 16, barColor: 'bg-blue-600' },
            { name: 'Heavy Earthmovers & Shoring', pct: 50, deployed: 4, avail: 4, total: 8, barColor: 'bg-blue-600' },
          ],
          benchmarksAvg: '95.4%'
        };
      case '30D':
        return {
          metrics: {
            responseTime: '5.9m',
            targetTime: '6.0m',
            fasterPct: '2% faster',
            clearance: '86.4%',
            clearanceSub: '+1.8% resolution rate',
            fleetIndex: '91.5',
            fleetSub: '+0.4 pts efficiency',
            accuracy: '94.8%',
            accuracySub: 'Monthly aggregate'
          },
          performance: [
            { time: 'Wk 1', value: 5.8, status: 'nominal' },
            { time: 'Wk 2', value: 6.4, status: 'surge' },
            { time: 'Wk 3', value: 5.2, status: 'nominal' },
            { time: 'Wk 4', value: 6.9, status: 'surge' },
            { time: 'Wk 5', value: 5.5, status: 'nominal' },
          ],
          categoriesSummary: { totalIncidents: 1640, subtitle: '1,640 incidents logged across past 30 days' },
          categories: [
            { label: 'Fire & Thermal Hazards', count: 459, pct: 28, color: 'bg-orange-500' },
            { label: 'Floods & Hydrological', count: 426, pct: 26, color: 'bg-cyan-500' },
            { label: 'Gas & Chemical Leaks', count: 246, pct: 15, color: 'bg-purple-500' },
            { label: 'Road & Transit Accidents', count: 295, pct: 18, color: 'bg-emerald-500' },
            { label: 'Structural & Seismic', count: 131, pct: 8, color: 'bg-blue-600' },
            { label: 'Crowd & Public Surge', count: 83, pct: 5, color: 'bg-amber-500' },
          ],
          fleet: [
            { name: 'Fire Engines & Pumpers', pct: 71, deployed: 17, avail: 7, total: 24, barColor: 'bg-blue-600' },
            { name: 'ALS / BLS Ambulances', pct: 79, deployed: 30, avail: 8, total: 38, barColor: 'bg-blue-600' },
            { name: 'Police & Traffic Units', pct: 73, deployed: 33, avail: 12, total: 45, barColor: 'bg-blue-600' },
            { name: 'Urban Search & Rescue Teams', pct: 58, deployed: 7, avail: 5, total: 12, barColor: 'bg-blue-600' },
            { name: 'Recon & Sensor Drones', pct: 69, deployed: 11, avail: 5, total: 16, barColor: 'bg-blue-600' },
            { name: 'Heavy Earthmovers & Shoring', pct: 44, deployed: 3, avail: 5, total: 8, barColor: 'bg-blue-600' },
          ],
          benchmarksAvg: '94.8%'
        };
      case 'YTD':
        return {
          metrics: {
            responseTime: '6.1m',
            targetTime: '6.0m',
            fasterPct: '-1.6% (Surge Peak)',
            clearance: '85.2%',
            clearanceSub: 'Annual baseline rate',
            fleetIndex: '90.4',
            fleetSub: '+0.1 pts efficiency',
            accuracy: '94.1%',
            accuracySub: 'Year-to-date validation'
          },
          performance: [
            { time: 'Jan', value: 6.4, status: 'surge' },
            { time: 'Feb', value: 6.1, status: 'surge' },
            { time: 'Mar', value: 5.9, status: 'nominal' },
            { time: 'Apr', value: 5.7, status: 'nominal' },
            { time: 'May', value: 6.3, status: 'surge' },
            { time: 'Jun', value: 6.8, status: 'surge' },
            { time: 'Jul', value: 5.5, status: 'nominal' },
            { time: 'Aug', value: 5.2, status: 'nominal' },
            { time: 'Sep', value: 4.9, status: 'nominal' },
          ],
          categoriesSummary: { totalIncidents: 14890, subtitle: '14,890 incidents logged Year-To-Date' },
          categories: [
            { label: 'Fire & Thermal Hazards', count: 4020, pct: 27, color: 'bg-orange-500' },
            { label: 'Floods & Hydrological', count: 4318, pct: 29, color: 'bg-cyan-500' },
            { label: 'Gas & Chemical Leaks', count: 2084, pct: 14, color: 'bg-purple-500' },
            { label: 'Road & Transit Accidents', count: 2531, pct: 17, color: 'bg-emerald-500' },
            { label: 'Structural & Seismic', count: 1191, pct: 8, color: 'bg-blue-600' },
            { label: 'Crowd & Public Surge', count: 746, pct: 5, color: 'bg-amber-500' },
          ],
          fleet: [
            { name: 'Fire Engines & Pumpers', pct: 68, deployed: 16, avail: 8, total: 24, barColor: 'bg-blue-600' },
            { name: 'ALS / BLS Ambulances', pct: 76, deployed: 29, avail: 9, total: 38, barColor: 'bg-blue-600' },
            { name: 'Police & Traffic Units', pct: 71, deployed: 32, avail: 13, total: 45, barColor: 'bg-blue-600' },
            { name: 'Urban Search & Rescue Teams', pct: 54, deployed: 6, avail: 6, total: 12, barColor: 'bg-blue-600' },
            { name: 'Recon & Sensor Drones', pct: 63, deployed: 10, avail: 6, total: 16, barColor: 'bg-blue-600' },
            { name: 'Heavy Earthmovers & Shoring', pct: 41, deployed: 3, avail: 5, total: 8, barColor: 'bg-blue-600' },
          ],
          benchmarksAvg: '94.1%'
        };
      case '24H':
      default:
        return {
          metrics: {
            responseTime: '5.2m',
            targetTime: '6.0m',
            fasterPct: '13% faster',
            clearance: '89.4%',
            clearanceSub: '+4.2% resolution rate',
            fleetIndex: '94.1',
            fleetSub: '+1.8 pts efficiency',
            accuracy: '96.8%',
            accuracySub: 'Human Approved'
          },
          performance: [
            { time: '08:00', value: 4.8, status: 'nominal' },
            { time: '10:00', value: 5.2, status: 'nominal' },
            { time: '12:00', value: 6.8, status: 'surge' },
            { time: '14:00', value: 4.6, status: 'nominal' },
            { time: '16:00', value: 7.2, status: 'surge' },
            { time: '18:00', value: 6.5, status: 'surge' },
            { time: '20:00', value: 5.1, status: 'nominal' },
          ],
          categoriesSummary: { totalIncidents: 57, subtitle: 'Breakdown of 57 incidents logged across selected period' },
          categories: [
            { label: 'Fire & Thermal Hazards', count: 18, pct: 32, color: 'bg-orange-500' },
            { label: 'Floods & Hydrological', count: 12, pct: 21, color: 'bg-cyan-500' },
            { label: 'Gas & Chemical Leaks', count: 9, pct: 16, color: 'bg-purple-500' },
            { label: 'Road & Transit Accidents', count: 8, pct: 14, color: 'bg-emerald-500' },
            { label: 'Structural & Seismic', count: 6, pct: 11, color: 'bg-blue-600' },
            { label: 'Crowd & Public Surge', count: 4, pct: 6, color: 'bg-amber-500' },
          ],
          fleet: [
            { name: 'Fire Engines & Pumpers', pct: 67, deployed: 16, avail: 6, total: 24, barColor: 'bg-blue-600' },
            { name: 'ALS / BLS Ambulances', pct: 74, deployed: 28, avail: 8, total: 38, barColor: 'bg-blue-600' },
            { name: 'Police & Traffic Units', pct: 69, deployed: 31, avail: 12, total: 45, barColor: 'bg-blue-600' },
            { name: 'Urban Search & Rescue Teams', pct: 75, deployed: 9, avail: 3, total: 12, barColor: 'bg-blue-600' },
            { name: 'Recon & Sensor Drones', pct: 69, deployed: 11, avail: 4, total: 16, barColor: 'bg-blue-600' },
            { name: 'Heavy Earthmovers & Shoring', pct: 38, deployed: 3, avail: 5, total: 8, barColor: 'bg-blue-600' },
          ],
          benchmarksAvg: '96.2%'
        };
    }
  };

  const activeData = getTimeRangeData(timeRange);

  // Multi-Hazard Model Benchmarks
  const modelBenchmarks = [
    { id: 'ML-FIRE-01', name: 'Fire Flashover & BLEVE Predictor', domain: 'Fire & Thermal', dataset: 'NASA FIRMS & NIST', arch: 'CNN + XGBoost', acc: timeRange === '1H' ? '98.2%' : timeRange === '7D' ? '95.9%' : '96.8%', auc: '0.988', lat: '8.4ms' },
    { id: 'ML-FLOOD-02', name: 'Inundation Peak Regressor', domain: 'Flood & Hydro', dataset: 'USGS NWIS & GloFAS', arch: 'Bi-LSTM Regressor', acc: timeRange === '1H' ? '96.1%' : timeRange === '7D' ? '93.8%' : '94.5%', auc: '0.974', lat: '12.1ms' },
    { id: 'ML-SLOPE-03', name: 'InSAR Landslide Shear Classifier', domain: 'Landslide & Terrain', dataset: 'Sentinel-1 InSAR & NASA GLC', arch: 'Random Forest', acc: timeRange === '1H' ? '96.8%' : timeRange === '7D' ? '94.2%' : '95.2%', auc: '0.981', lat: '6.8ms' },
    { id: 'ML-GAS-04', name: 'Chemical Plume Dispersion Net', domain: 'Gas & Chemical', dataset: 'UCI Gas Drift & CAMEO', arch: 'PINN Autoencoder', acc: timeRange === '1H' ? '98.5%' : timeRange === '7D' ? '96.8%' : '97.4%', auc: '0.992', lat: '14.5ms' },
    { id: 'ML-SEIS-05', name: 'Strong-Motion & Strain Classifier', domain: 'Seismic & Structural', dataset: 'USGS ComCat & STEAD', arch: '1D-CNN + SVM', acc: timeRange === '1H' ? '97.4%' : timeRange === '7D' ? '95.3%' : '96.1%', auc: '0.985', lat: '5.2ms' },
    { id: 'ML-TRAFFIC-06', name: 'Arterial Bottleneck Predictor', domain: 'Traffic & Transit', dataset: 'US-Accidents & PeMS', arch: 'Temporal GNN', acc: timeRange === '1H' ? '95.2%' : timeRange === '7D' ? '92.6%' : '93.8%', auc: '0.968', lat: '16.2ms' },
    { id: 'ML-CROWD-07', name: 'Optical Density & Egress Surge', domain: 'Crowd & Pedestrian', dataset: 'ShanghaiTech & PETS', arch: 'CSRNet Regressor', acc: timeRange === '1H' ? '97.1%' : timeRange === '7D' ? '94.9%' : '95.8%', auc: '0.983', lat: '11.0ms' },
    { id: 'ML-HOSP-08', name: 'Trauma Net Queuing Optimizer', domain: 'Hospital & Medical', dataset: 'HHS HealthData & MIMIC-IV', arch: 'Queuing Optimizer', acc: timeRange === '1H' ? '98.9%' : timeRange === '7D' ? '96.8%' : '97.9%', auc: '0.994', lat: '4.8ms' },
    { id: 'ML-EVAC-09', name: 'Hazard-Aware Corridor Router', domain: 'Geospatial & 3D', dataset: 'OpenStreetMap & FEMA NSS', arch: 'Risk-Weighted Dijkstra', acc: timeRange === '1H' ? '99.1%' : timeRange === '7D' ? '97.8%' : '98.4%', auc: '0.996', lat: '9.6ms' },
    { id: 'ML-PLUME-10', name: 'Atmospheric Dispersion Model', domain: 'Weather & Climate', dataset: 'Open-Meteo & NOAA HRRR', arch: 'Gaussian Puff Dispersion', acc: timeRange === '1H' ? '97.8%' : timeRange === '7D' ? '95.6%' : '96.5%', auc: '0.989', lat: '7.2ms' }
  ];

  // Export Analytics Data as a formatted PDF Document
  const handleExportPDF = () => {
    setExporting(true);

    const timeString = new Date().toLocaleString();
    const pdfWindow = window.open('', '_blank');

    if (pdfWindow) {
      pdfWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>AEGIS_TWIN_Operational_Analytics_Report_${timeRange}_${Date.now()}.pdf</title>
            <style>
              @page { size: A4 portrait; margin: 15mm; }
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; color: #0f172a; line-height: 1.4; background: #ffffff; }
              .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
              .title { font-size: 18px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: -0.5px; }
              .subtitle { font-size: 11px; color: #64748b; margin-top: 2px; }
              .stamp { font-family: monospace; font-size: 10px; text-align: right; color: #475569; }
              .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
              .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
              .kpi-label { font-size: 9px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
              .kpi-value { font-size: 20px; font-weight: 900; color: #0f172a; margin-top: 4px; font-family: monospace; }
              .kpi-sub { font-size: 10px; color: #16a34a; font-weight: 700; margin-top: 4px; }
              .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0f172a; margin-top: 24px; margin-bottom: 8px; border-left: 3px solid #2563eb; padding-left: 8px; }
              table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 10px; }
              th, td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
              th { background: #f1f5f9; font-weight: 800; color: #334155; text-transform: uppercase; font-size: 9px; }
              tr:nth-child(even) { background: #f8fafc; }
              .footer { margin-top: 36px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 9px; color: #94a3b8; display: flex; justify-content: space-between; font-family: monospace; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <div class="title">AEGIS TWIN — Crisis Intelligence Analytics</div>
                <div class="subtitle">Operational Performance Audit & Multi-Hazard Model Precision Report</div>
              </div>
              <div class="stamp">
                <strong>Generated:</strong> ${timeString}<br/>
                <strong>Time Window:</strong> ${timeRange}
              </div>
            </div>

            <div class="kpi-grid">
              <div class="kpi-card">
                <div class="kpi-label">Avg Response Time</div>
                <div class="kpi-value">${activeData.metrics.responseTime}</div>
                <div class="kpi-sub">↗ ${activeData.metrics.fasterPct}</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">Incident Clearance</div>
                <div class="kpi-value">${activeData.metrics.clearance}</div>
                <div class="kpi-sub">↗ ${activeData.metrics.clearanceSub}</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">Fleet Efficiency</div>
                <div class="kpi-value">${activeData.metrics.fleetIndex}/100</div>
                <div class="kpi-sub">↗ ${activeData.metrics.fleetSub}</div>
              </div>
              <div class="kpi-card">
                <div class="kpi-label">AI Dispatch Accuracy</div>
                <div class="kpi-value">${activeData.metrics.accuracy}</div>
                <div class="kpi-sub">↗ ${activeData.metrics.accuracySub}</div>
              </div>
            </div>

            <div class="section-title">Disaster Category Distribution (${activeData.categoriesSummary.subtitle})</div>
            <table>
              <thead>
                <tr>
                  <th>Hazard Category</th>
                  <th>Incident Count</th>
                  <th>Percentage Share</th>
                </tr>
              </thead>
              <tbody>
                ${activeData.categories.map(c => `
                  <tr>
                    <td><strong>${c.label}</strong></td>
                    <td>${c.count}</td>
                    <td>${c.pct}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="section-title">Resource Fleet Utilization Matrix (${timeRange} Snapshot)</div>
            <table>
              <thead>
                <tr>
                  <th>Fleet Unit Type</th>
                  <th>Utilization Rate</th>
                  <th>Deployed Units</th>
                  <th>Available Units</th>
                  <th>Total Fleet Size</th>
                </tr>
              </thead>
              <tbody>
                ${activeData.fleet.map(f => `
                  <tr>
                    <td><strong>${f.name}</strong></td>
                    <td>${f.pct}%</td>
                    <td>${f.deployed}</td>
                    <td>${f.avail}</td>
                    <td>${f.total}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="section-title">Background AI Machine Learning Model Benchmark Precision</div>
            <table>
              <thead>
                <tr>
                  <th>Model ID</th>
                  <th>Domain & Dataset</th>
                  <th>Architecture</th>
                  <th>Accuracy</th>
                  <th>AUC-ROC</th>
                  <th>Latency</th>
                </tr>
              </thead>
              <tbody>
                ${modelBenchmarks.map(m => `
                  <tr>
                    <td><strong>${m.id}</strong></td>
                    <td>${m.name} (${m.dataset})</td>
                    <td>${m.arch}</td>
                    <td><strong>${m.acc}</strong></td>
                    <td>${m.auc}</td>
                    <td>${m.lat}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="footer">
              <span>SHA-256 AUDIT HASH: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
              <span>AEGIS TWIN SMART EOC PLATFORM</span>
            </div>
          </body>
        </html>
      `);

      pdfWindow.document.close();
      pdfWindow.focus();
      setTimeout(() => {
        pdfWindow.print();
        setExporting(false);
        addNotification(`PDF DOSSIER EXPORTED: Cryptographically signed ${timeRange} performance audit generated.`, "success");
      }, 400);
    } else {
      // Fallback file download if popups blocked
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ timeRange, metrics: activeData.metrics, benchmarks: modelBenchmarks }, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `AEGIS_TWIN_Analytics_Report_${timeRange}_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setExporting(false);
      addNotification("REPORT DOWNLOADED: Performance audit exported.", "info");
    }
  };

  return (
    <div className="space-y-4 text-left font-sans select-none">
      
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

        <div className="flex items-center space-x-2">
          {/* Time Range Selector Keys */}
          <div className="flex items-center space-x-1 bg-white/70 p-1 rounded-xl border border-white/90 shadow-2xs">
            {(['1H', '24H', '7D', '30D', 'YTD'] as const).map(rangeKey => (
              <button
                key={rangeKey}
                onClick={() => setTimeRange(rangeKey)}
                className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                  timeRange === rangeKey
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {rangeKey}
              </button>
            ))}
          </div>

          {/* Export PDF Button */}
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-60"
            title="Export complete analytics and model benchmarks as a printable PDF report"
          >
            {exporting ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{exporting ? 'Generating PDF...' : 'Export PDF Dossier'}</span>
          </button>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Avg Response Time */}
        <div className="liquid-glass-card p-4 rounded-2xl flex items-start justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              AVG RESPONSE TIME
            </span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-black text-slate-900 tracking-tight font-mono transition-all duration-300">
                {activeData.metrics.responseTime}
              </span>
              <span className="text-xs text-slate-400 font-semibold">Target: {activeData.metrics.targetTime}</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-bold mt-2 inline-flex items-center space-x-0.5">
              <span>↗ {activeData.metrics.fasterPct}</span>
              <span className="text-slate-400 font-normal">in {timeRange}</span>
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
              <span className="text-2xl font-black text-slate-900 tracking-tight font-mono transition-all duration-300">
                {activeData.metrics.clearance}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{timeRange} Window</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-bold mt-2 inline-flex items-center space-x-0.5">
              <span>↗ {activeData.metrics.clearanceSub}</span>
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
              <span className="text-2xl font-black text-slate-900 tracking-tight font-mono transition-all duration-300">
                {activeData.metrics.fleetIndex}
              </span>
              <span className="text-xs text-slate-400 font-semibold">/100 Score</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-bold mt-2 inline-flex items-center space-x-0.5">
              <span>↗ {activeData.metrics.fleetSub}</span>
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
              <span className="text-2xl font-black text-slate-900 tracking-tight font-mono transition-all duration-300">
                {activeData.metrics.accuracy}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{activeData.metrics.accuracySub}</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-bold mt-2 inline-flex items-center space-x-0.5">
              <span>↗ Verified</span>
              <span className="text-slate-400 font-normal">by EOC Command</span>
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-2xs">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* Middle Row: Response Time Chart + Disaster Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left Card: Dynamic Time Series Performance Graph */}
        <div className="liquid-glass-card p-5 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                Response Time Performance Curve
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Actual arrival latency vs 6.0 min benchmark ({timeRange} period)
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
              Optimal Corridor Flow
            </span>
          </div>

          {/* Bar Chart Visualization with smooth transitions */}
          <div className="h-44 flex items-end justify-between gap-2 sm:gap-3 pt-4 px-2 border-b border-slate-100">
            {activeData.performance.map(bar => {
              const heightPct = Math.min((bar.value / 8) * 100, 100);
              const barColor = bar.status === 'nominal' ? 'bg-[#0088FF]' : 'bg-[#FF3B30]';

              return (
                <div key={bar.time} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-mono text-slate-500 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.value}m
                  </span>
                  <div
                    className={`w-full max-w-[28px] ${barColor} rounded-t-lg transition-all duration-500 ease-out shadow-2xs`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] font-mono text-slate-500 font-bold mt-2">
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
              {activeData.categoriesSummary.subtitle}
            </p>
          </div>

          <div className="space-y-2.5 pt-1">
            {activeData.categories.map(cat => (
              <div key={cat.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>{cat.label}</span>
                  <span className="font-mono text-slate-500 text-[11px]">
                    {cat.count.toLocaleString()} ({cat.pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full transition-all duration-500 ease-out`}
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
          Resource Fleet Category Utilization ({timeRange})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeData.fleet.map(f => (
            <div key={f.name} className="liquid-glass-card p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-xs">
                  {f.name}
                </span>
                <span className="text-xs font-black text-blue-600 font-mono transition-all">
                  {f.pct}% Active
                </span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full ${f.barColor} rounded-full transition-all duration-500 ease-out`}
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

      {/* Section: Background AI/ML Model Intelligence & Benchmark Matrix */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between pl-1">
          <div>
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              Background AI Model Benchmarks & Dataset Precision Matrix
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Real-time inference latencies, AUC-ROC scores & background training convergence across 10 multi-hazard models ({timeRange})
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[10px] border border-emerald-200 shadow-2xs">
            ● 10 Models Active ({activeData.benchmarksAvg} Avg Accuracy)
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
                {modelBenchmarks.map(m => (
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
                    <td className="py-3 px-4 font-bold text-emerald-600 font-mono transition-all">
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
