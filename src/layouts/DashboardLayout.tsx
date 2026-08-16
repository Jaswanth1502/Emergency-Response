import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  Flame,
  Box,
  Map,
  GitFork,
  Milestone,
  Truck,
  Building2,
  Cpu,
  BarChart3,
  FileText,
  Bell,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  SunMedium,
  Clock,
  Menu,
  X,
  Radio
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NotificationDrawer } from '../components/notifications/NotificationDrawer';
import { IncidentFormDialog } from '../components/dialogs/IncidentFormDialog';
import { DeployResourceDialog } from '../components/dialogs/DeployResourceDialog';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { currentRole, setCurrentRole, currentUser, notifications } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [incidentFormOpen, setIncidentFormOpen] = useState(false);
  const [deployResourceOpen, setDeployResourceOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navSections = [
    {
      heading: 'OPERATIONAL COMMAND',
      items: [
        { label: 'Command Center', path: '/dashboard', icon: <LayoutGrid className="w-4 h-4" /> },
        { label: 'Incidents', path: '/incidents', icon: <Flame className="w-4 h-4 text-rose-500" />, badge: '4', badgeColor: 'bg-rose-500 text-white' },
        { label: 'Digital Twin', path: '/digital-twin', icon: <Box className="w-4 h-4" /> },
        { label: 'Tactical GIS Map', path: '/digital-twin', icon: <Map className="w-4 h-4" /> }
      ]
    },
    {
      heading: 'TACTICAL DISPATCH',
      items: [
        { label: 'Resource Allocation', path: '/resources', icon: <GitFork className="w-4 h-4" />, badge: '3 AI', badgeColor: 'bg-blue-600 text-white' },
        { label: 'Evacuation Corridors', path: '/evacuation', icon: <Milestone className="w-4 h-4" /> },
        { label: 'Emergency Fleet', path: '/fleet', icon: <Truck className="w-4 h-4" /> },
        { label: 'Hospitals & Triage', path: '/hospitals', icon: <Building2 className="w-4 h-4" /> }
      ]
    },
    {
      heading: 'INTELLIGENCE & IOT',
      items: [
        { label: 'IoT Sensor Network', path: '/sensors', icon: <Cpu className="w-4 h-4" /> },
        { label: 'Operational Analytics', path: '/analytics', icon: <BarChart3 className="w-4 h-4" /> },
        { label: 'Incident Reports', path: '/reports', icon: <FileText className="w-4 h-4" /> },
        { label: 'System Alerts', path: '/alerts', icon: <Bell className="w-4 h-4" />, badge: '1', badgeColor: 'bg-amber-500 text-white' }
      ]
    }
  ];

  const getPageHeader = () => {
    const p = location.pathname;
    if (p.startsWith('/incidents')) {
      return {
        title: 'Incident Catalog & Workspace',
        subtitle: 'Real-time Triage, Assessment & Response Records',
        badge: '2 CRITICAL'
      };
    }
    if (p.startsWith('/digital-twin')) {
      return {
        title: '3D Smart City Digital Twin',
        subtitle: 'Real-time Telemetry, Spatial Plumes & Predictive Physics',
        badge: '2 CRITICAL'
      };
    }
    if (p.startsWith('/resources')) {
      return {
        title: 'Predictive Resource Dispatch',
        subtitle: 'Autonomous AI Recommendation & Dispatch Matrix',
        badge: '2 CRITICAL'
      };
    }
    if (p.startsWith('/evacuation')) {
      return {
        title: 'Evacuation Corridors & Safety',
        subtitle: 'Dynamic Egress Routing, Hazard Buffers & Shelters',
        badge: '2 CRITICAL'
      };
    }
    if (p.startsWith('/fleet')) {
      return {
        title: 'Emergency Response Fleet',
        subtitle: 'Fleet Telemetry, Crew Availability & Deployment Status',
        badge: '2 CRITICAL'
      };
    }
    if (p.startsWith('/hospitals')) {
      return {
        title: 'Hospitals & Medical Surge Capacity',
        subtitle: 'Trauma intake queues, burn ICU availability & ambulance routing',
        badge: '2 CRITICAL'
      };
    }
    if (p.startsWith('/sensors')) {
      return {
        title: 'IoT Telemetry & Environmental Sensor Mesh',
        subtitle: 'Thermal, Gas, Hydro & Seismic Edge Sensor Mesh',
        badge: '2 CRITICAL'
      };
    }
    if (p.startsWith('/analytics')) {
      return {
        title: 'Operational Analytics & KPI Benchmarks',
        subtitle: 'Incident Trends, Response Times & Resource Load Curves',
        badge: '2 CRITICAL'
      };
    }
    if (p.startsWith('/reports')) {
      return {
        title: 'Incident After-Action Reports & Audit Logs',
        subtitle: 'Official Event Timeline, Dispatch Logs & Export',
        badge: '2 CRITICAL'
      };
    }
    if (p.startsWith('/alerts')) {
      return {
        title: 'Emergency Alert & Notification System',
        subtitle: 'Prioritized System Warnings & Civilian Cell Broadcasts',
        badge: '2 CRITICAL'
      };
    }
    return {
      title: 'Command Center',
      subtitle: 'Unified Multi-Hazard Operational Awareness',
      badge: '2 CRITICAL'
    };
  };

  const headerInfo = getPageHeader();
  const unreadNotifCount = notifications.filter(n => !n.read).length || 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E2E8F0]/80 via-[#F8FAFC] to-white text-slate-800 flex font-sans antialiased overflow-x-hidden">
      
      {/* Desktop Sidebar Navigation (Apple Liquid Glassmorphism) */}
      <aside className={`hidden lg:flex flex-col liquid-glass border-r border-white/80 transition-all duration-300 z-30 ${collapsed ? 'w-20' : 'w-64'} flex-shrink-0 select-none shadow-[2px_0_16px_rgba(0,0,0,0.03)]`}>
        
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/60">
          <Link to="/dashboard" className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-[#0B132B] text-sky-400 flex items-center justify-center shadow-md shadow-slate-900/15 flex-shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            {!collapsed && (
              <div className="leading-tight text-left">
                <span className="font-extrabold text-slate-900 text-sm tracking-tight block">AEGIS TWIN</span>
                <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase block">EMERGENCY OS</span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-6 h-6 rounded-lg bg-white/80 hover:bg-white text-slate-500 flex items-center justify-center transition-colors cursor-pointer border border-white/90 shadow-2xs"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <p className="text-[10px] font-bold text-slate-400 tracking-wider px-3 mb-1.5 uppercase">
                  {section.heading}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                        isActive
                          ? 'liquid-glass-blue text-blue-700 font-bold border-l-3 border-blue-600 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <div className={`${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} transition-colors`}>
                          {item.icon}
                        </div>
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!collapsed && item.badge && (
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${item.badgeColor} ml-2 flex-shrink-0 shadow-2xs`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom System Sync Indicator */}
        <div className="p-3 border-t border-white/60 bg-white/40 backdrop-blur-md">
          <div className="flex items-center space-x-2.5 px-2 py-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            {!collapsed && (
              <div className="text-left leading-none">
                <span className="text-[10px] font-bold text-slate-800 block">Twin Sync Active</span>
                <span className="text-[9px] text-slate-400 font-mono block mt-0.5">Telemetry: 24ms</span>
              </div>
            )}
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar Chrome (Apple Liquid Glassmorphism) */}
        <header className="h-16 liquid-glass border-b border-white/80 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-20 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          
          {/* Left Title & Status Pill */}
          <div className="flex items-center space-x-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 lg:hidden focus:outline-none cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-left truncate">
              <div className="flex items-center space-x-2">
                <h1 className="font-extrabold text-slate-900 text-sm lg:text-base tracking-tight truncate">
                  {headerInfo.title}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-extrabold uppercase border border-rose-200 animate-pulse">
                  ● {headerInfo.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate hidden sm:block">
                {headerInfo.subtitle}
              </p>
            </div>
          </div>

          {/* Center Search Input */}
          <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search incidents, units, sensors..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-8 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-500 transition-all shadow-xs"
              />
              <kbd className="absolute right-2.5 top-2 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-2xs pointer-events-none">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right Action Widgets */}
          <div className="flex items-center space-x-2.5 flex-shrink-0">
            
            {/* Live UTC Clock */}
            <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 text-xs font-semibold shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono font-bold tabular-nums text-slate-900">{time.toLocaleTimeString()}</span>
              <span className="text-[10px] text-slate-400 font-mono">EOC UTC-7</span>
            </div>

            {/* Weather Sensor Widget */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 text-xs font-semibold shadow-2xs">
              <SunMedium className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-bold text-slate-800">24°C</span>
              <span className="text-[10px] text-slate-400">Wind 22km/h SSW</span>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setNotifOpen(true)}
              className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 transition-all shadow-2xs cursor-pointer"
              title="System Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Filter / Quick Dispatch button */}
            <button
              onClick={() => setIncidentFormOpen(true)}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 transition-all shadow-2xs cursor-pointer hidden sm:block"
              title="Quick Dispatch Control"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Commander Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 pl-1.5 pr-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-500 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                  JV
                </div>
                <div className="text-left hidden sm:block leading-none">
                  <span className="text-xs font-bold text-slate-900 block truncate max-w-[110px]">
                    Cmdr. Justin Vance
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 block mt-0.5">EOC-7049</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-left animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Commander Profile</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">Cmdr. Justin Vance</p>
                    <p className="text-[10px] text-slate-500 font-mono">EOC Lead Operator</p>
                  </div>
                  <div className="py-1">
                    {(['ADMIN', 'OPERATOR', 'ANALYST'] as const).map(role => (
                      <button
                        key={role}
                        onClick={() => { setCurrentRole(role); setUserDropdownOpen(false); }}
                        className={`w-full px-3 py-1.5 text-xs text-left font-semibold flex items-center justify-between hover:bg-slate-50 ${currentRole === role ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'}`}
                      >
                        <span>Role: {role}</span>
                        {currentRole === role && <span className="text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => navigate('/')}
                      className="w-full px-3 py-1.5 text-xs text-left text-rose-600 hover:bg-rose-50 font-semibold"
                    >
                      Logout Terminal
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* Dynamic Page Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 relative bg-[#F4F6F9]">
          <div className="max-w-[1680px] mx-auto w-full">
            {children}
          </div>
        </main>

      </div>

      {/* Mobile Sidebar Slide-Over */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-72 bg-white text-slate-800 p-5 flex flex-col space-y-6 shadow-2xl z-50"
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-sky-400 flex items-center justify-center font-bold">
                    <Radio className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-slate-900 tracking-tight text-sm">AEGIS TWIN OS</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg text-slate-500 hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-4 overflow-y-auto flex-1 text-left">
                {navSections.map((sec, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">{sec.heading}</p>
                    {sec.items.map(item => (
                      <Link
                        key={item.label}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        <div className="flex items-center space-x-3">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        {item.badge && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>{item.badge}</span>}
                      </Link>
                    ))}
                  </div>
                ))}
              </nav>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Dialogs */}
      <NotificationDrawer isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
      <IncidentFormDialog isOpen={incidentFormOpen} onClose={() => setIncidentFormOpen(false)} />
      <DeployResourceDialog isOpen={deployResourceOpen} onClose={() => setDeployResourceOpen(false)} />

    </div>
  );
};
export default DashboardLayout;
