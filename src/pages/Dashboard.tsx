import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  AlertTriangle,
  Users,
  Truck,
  Building2,
  Bell,
  Sparkles,
  Check,
  X,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Droplets,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TacticalGisMap } from '../components/map/TacticalGisMap';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { incidents, resources, deployResource, addNotification } = useApp();
  
  const [mapViewMode, setMapViewMode] = useState<'2D' | '3D'>('2D');
  const [agentApproved, setAgentApproved] = useState(false);
  const [agentDeclined, setAgentDeclined] = useState(false);

  // Severe counts & calculations
  const activeIncidentsList = incidents.filter(i => i.status !== 'RESOLVED');
  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED').length || 2;
  const deployedFleetCount = 14 + (agentApproved ? 1 : 0);

  const handleApproveAgent = () => {
    setAgentApproved(true);
    // Execute live tactical dispatch
    deployResource('RES-005', 'INC-2026-0891');
    addNotification("AI DISPATCH AUTHORIZED: Foam Carrier 03 & Burn ICU H03 dispatched to Mission Financial Plaza.", "info");
  };

  const handleDeclineAgent = () => {
    setAgentDeclined(true);
    addNotification("AI RECOMMENDATION DISMISSED by Commander Justin Vance.", "warning");
  };

  return (
    <div className="space-y-4 text-left">
      
      {/* 6 Top Metric Cards (Apple Liquid Glassmorphism) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        
        {/* Metric 1: Active Incidents */}
        <div className="liquid-glass-card p-3.5 rounded-2xl flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">ACTIVE INCIDENTS</p>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-2xl font-black text-slate-900 leading-none">4</span>
                <span className="text-xs text-slate-400 font-semibold">of 6 total</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-orange-50/90 border border-orange-200/60 text-orange-500 flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1 text-[10px] font-bold text-rose-600">
            <TrendingUp className="w-3 h-3" />
            <span>+2 new <span className="text-slate-400 font-normal">vs last hour</span></span>
          </div>
        </div>

        {/* Metric 2: Critical Severity */}
        <div className="liquid-glass-card p-3.5 rounded-2xl flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">CRITICAL SEVERITY</p>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-2xl font-black text-slate-900 leading-none">{criticalCount}</span>
                <span className="text-xs text-slate-400 font-semibold">Immediate Action</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-rose-50/90 border border-rose-200/60 text-rose-500 flex items-center justify-center flex-shrink-0 shadow-2xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1 text-[10px] font-bold text-emerald-600">
            <TrendingDown className="w-3 h-3" />
            <span>Stable <span className="text-slate-400 font-normal">vs last hour</span></span>
          </div>
        </div>

        {/* Metric 3: Civilians At Risk */}
        <div className="liquid-glass-card p-3.5 rounded-2xl flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">CIVILIANS AT RISK</p>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-2xl font-black text-slate-900 leading-none">28,340</span>
                <span className="text-[9px] text-slate-400 font-semibold block">Monitored Sectors</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-blue-50/90 border border-blue-200/60 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1 text-[10px] font-bold text-emerald-600">
            <TrendingUp className="w-3 h-3" />
            <span>12.8k safe <span className="text-slate-400 font-normal">vs last hour</span></span>
          </div>
        </div>

        {/* Metric 4: Fleet Deployed */}
        <div className="liquid-glass-card p-3.5 rounded-2xl flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">FLEET DEPLOYED</p>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-2xl font-black text-slate-900 leading-none">{deployedFleetCount}</span>
                <span className="text-xs text-slate-400 font-semibold">of 17 units</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-purple-50/90 border border-purple-200/60 text-purple-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1 text-[10px] font-bold text-emerald-600">
            <TrendingUp className="w-3 h-3" />
            <span>74% <span className="text-slate-400 font-normal">rate vs last hour</span></span>
          </div>
        </div>

        {/* Metric 5: Hospitals Online */}
        <div className="liquid-glass-card p-3.5 rounded-2xl flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">HOSPITALS ONLINE</p>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-2xl font-black text-slate-900 leading-none">4/4</span>
                <span className="text-[9px] text-slate-400 font-semibold">Surge Ready</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-50/90 border border-emerald-200/60 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1 text-[10px] font-bold text-emerald-600">
            <TrendingUp className="w-3 h-3" />
            <span>222 beds <span className="text-slate-400 font-normal">free vs last hour</span></span>
          </div>
        </div>

        {/* Metric 6: Active Alerts */}
        <div className="liquid-glass-card p-3.5 rounded-2xl flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">ACTIVE ALERTS</p>
              <div className="flex items-baseline space-x-1 mt-1">
                <span className="text-2xl font-black text-slate-900 leading-none">1</span>
                <span className="text-[9px] text-slate-400 font-semibold">QoS-2 Broadcast</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-amber-50/90 border border-amber-200/60 text-amber-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-1 text-[10px] font-bold text-rose-600">
            <TrendingUp className="w-3 h-3" />
            <span>2 priority <span className="text-slate-400 font-normal">vs last hour</span></span>
          </div>
        </div>

      </div>

      {/* Predictive Resource Allocation Agent Banner (Apple Liquid Glassmorphism) */}
      {!agentDeclined && (
        <div className="liquid-glass-blue rounded-2xl p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-600/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-0.5 text-left">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider">
                  PREDICTIVE RESOURCE ALLOCATION AGENT
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/90 text-blue-700 text-[10px] font-extrabold border border-blue-200 shadow-2xs">
                  94% Confidence
                </span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                Dispatch Foam Carrier 03 & Pre-alert Burn ICU H03
              </h3>
              <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                Based on 485°C thermal surge and hydrocarbon solvent risk in B2, recommend deploying Foam Unit F-04 (ETA 2m) and redirecting ALS Ambulance A-05 from SOMA depot.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end lg:self-center flex-shrink-0">
            {!agentApproved ? (
              <>
                <button
                  onClick={handleDeclineAgent}
                  className="px-4 py-2 liquid-glass-pill hover:bg-white text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Decline</span>
                </button>
                <button
                  onClick={handleApproveAgent}
                  className="px-5 py-2 bg-[#F58220] hover:bg-[#E07010] text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve Dispatch</span>
                </button>
              </>
            ) : (
              <div className="px-4 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 shadow-2xs">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Dispatch Authorized (Units Dispatched)</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main 2-Column Command Center Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        
        {/* Left: GIS Map */}
        <div className="xl:col-span-8 space-y-4">
          <div className="rounded-2xl overflow-hidden shadow-xs">
            <TacticalGisMap
              viewMode={mapViewMode}
              onViewModeChange={setMapViewMode}
              heightClass="h-[560px]"
            />
          </div>
        </div>

        {/* Right: Active Incidents Sidebar */}
        <div className="xl:col-span-4 liquid-glass-card rounded-2xl p-4 flex flex-col justify-between h-[520px]">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Active Incidents</h3>
              <p className="text-[10px] text-slate-400 font-semibold">Prioritized by real-time risk score</p>
            </div>
            <button
              onClick={() => navigate('/incidents')}
              className="text-xs font-extrabold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer"
            >
              <span>View All (6)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Incident Cards List */}
          <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
            
            {/* Incident 1: Fire */}
            <div
              onClick={() => navigate('/incidents/INC-2026-0891')}
              className="p-3 rounded-xl border border-blue-500/80 bg-blue-50/20 hover:bg-blue-50/40 transition-all cursor-pointer space-y-1.5 shadow-2xs group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-extrabold text-slate-900 text-xs">Fire</span>
                  <span className="text-[10px] font-mono text-slate-400">INC-2026-0891</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-extrabold border border-rose-200">
                  ● Critical
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-blue-600 transition-colors">
                Multi-Story Commercial Fire & Chemical Storage...
              </h4>
              <p className="text-[11px] text-slate-500">
                📍 District 4, 450 Mission Financial Plaza
              </p>
              <div className="flex items-center justify-between pt-1 text-[11px] border-t border-slate-200/50">
                <span className="font-bold text-slate-700">Risk: <span className="text-rose-600 font-extrabold">94/100</span></span>
                <span className="text-slate-500">Pop: <span className="font-bold text-slate-700">2,850</span></span>
                <span className="text-blue-600 font-bold text-xs flex items-center group-hover:translate-x-0.5 transition-transform">
                  Inspect &gt;
                </span>
              </div>
            </div>

            {/* Incident 2: Flood */}
            <div
              onClick={() => navigate('/incidents/INC-2026-0892')}
              className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all cursor-pointer space-y-1.5 shadow-2xs group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span className="font-extrabold text-slate-900 text-xs">Flood</span>
                  <span className="text-[10px] font-mono text-slate-400">INC-2026-0892</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-extrabold border border-amber-200">
                  ▲ High
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-blue-600 transition-colors">
                Flash Flood & Subsurface Storm Drainage...
              </h4>
              <p className="text-[11px] text-slate-500">
                📍 Bayside Lowland Corridor, Pier 28 Basin
              </p>
              <div className="flex items-center justify-between pt-1 text-[11px] border-t border-slate-100">
                <span className="font-bold text-slate-700">Risk: <span className="text-amber-600 font-extrabold">82/100</span></span>
                <span className="text-slate-500">Pop: <span className="font-bold text-slate-700">4,200</span></span>
                <span className="text-slate-400 font-bold text-xs flex items-center group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform">
                  Inspect &gt;
                </span>
              </div>
            </div>

            {/* Incident 3: Gas Leak */}
            <div
              onClick={() => navigate('/incidents/INC-2026-0893')}
              className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all cursor-pointer space-y-1.5 shadow-2xs group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-purple-500" />
                  <span className="font-extrabold text-slate-900 text-xs">Gas Leak</span>
                  <span className="text-[10px] font-mono text-slate-400">INC-2026-0893</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-extrabold border border-rose-200">
                  ● Critical
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-blue-600 transition-colors">
                Seismic Rupture & Natural Gas Pipeline...
              </h4>
              <p className="text-[11px] text-slate-500">
                📍 Metro Transit Hub, 8th & Market
              </p>
              <div className="flex items-center justify-between pt-1 text-[11px] border-t border-slate-100">
                <span className="font-bold text-slate-700">Risk: <span className="text-rose-600 font-extrabold">91/100</span></span>
                <span className="text-slate-500">Pop: <span className="font-bold text-slate-700">3,100</span></span>
                <span className="text-slate-400 font-bold text-xs flex items-center group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform">
                  Inspect &gt;
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
export default Dashboard;
