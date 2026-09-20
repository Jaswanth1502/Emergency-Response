import React, { useState, useEffect, useRef } from 'react';
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
  ChevronUp,
  SunMedium,
  Clock,
  Menu,
  X,
  Radio,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types/user';
import { NotificationDrawer } from '../components/notifications/NotificationDrawer';
import { IncidentFormDialog } from '../components/dialogs/IncidentFormDialog';
import { DeployResourceDialog } from '../components/dialogs/DeployResourceDialog';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { currentRole, currentUser, setCurrentRole, notifications } = useApp();
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
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setUserDropdownOpen(false);
        setNotifOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  const navSections: { heading: string; items: { label: string; path: string; icon: React.ReactNode; badge?: string; badgeColor?: string; roles?: UserRole[] }[] }[] = [
    {
      heading: 'EMERGENCY CONTROL PLATFORM',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: <LayoutGrid className="w-4 h-4" /> },
        { label: 'Incidents', path: '/incidents', icon: <Flame className="w-4 h-4 text-rose-500" />, badge: '12', badgeColor: 'bg-rose-500 text-white' },
        { label: 'Resources', path: '/resources', icon: <GitFork className="w-4 h-4 text-blue-500" />, badge: '8', badgeColor: 'bg-blue-600 text-white' },
        { label: 'Hospitals', path: '/hospitals', icon: <Building2 className="w-4 h-4 text-emerald-500" />, badge: '146 Beds', badgeColor: 'bg-emerald-600 text-white' },
        { label: 'Sensors', path: '/sensors', icon: <Cpu className="w-4 h-4 text-purple-500" /> },
        { label: 'Evacuation', path: '/evacuation', icon: <Milestone className="w-4 h-4 text-amber-500" /> },
        { label: 'Alerts', path: '/alerts', icon: <Bell className="w-4 h-4 text-rose-400" />, badge: '3', badgeColor: 'bg-rose-600 text-white' },
        { label: 'Analytics', path: '/analytics', icon: <BarChart3 className="w-4 h-4 text-sky-500" /> },
        { label: 'Users', path: '/users', icon: <ShieldCheck className="w-4 h-4 text-slate-500" /> }
      ]
    },
    {
      heading: 'EXTENDED TACTICAL MODULES',
      items: [
        { label: 'Digital Twin 3D', path: '/digital-twin', icon: <Box className="w-4 h-4" /> },
        { label: 'Emergency Fleet', path: '/fleet', icon: <Truck className="w-4 h-4" /> },
        { label: 'Incident Reports', path: '/reports', icon: <FileText className="w-4 h-4" /> }
      ]
    }
  ];
  const visibleNavSections = navSections.map(section => ({
    ...section,
    items: section.items.filter(item => !item.roles || item.roles.includes(currentRole))
  })).filter(section => section.items.length > 0);

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
      title: currentRole === 'ADMIN' ? 'Administrative Oversight' : currentRole === 'ANALYST' ? 'Urban Risk Intelligence' : 'Tactical Operations Console',
      subtitle: currentRole === 'ADMIN' ? 'Governance, platform readiness & city-wide controls' : currentRole === 'ANALYST' ? 'Telemetry, forecasts & decision intelligence' : 'Live incident response, dispatch & field coordination',
      badge: '2 CRITICAL'
    };
  };

  const headerInfo = getPageHeader();
  const unreadNotifCount = notifications.filter(n => !n.read).length || 1;

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-[#E2E8F0]/80 via-[#F8FAFC] to-white text-slate-800 flex font-sans antialiased overflow-hidden">

      {/* Desktop Sidebar Navigation (Apple Liquid Glassmorphism) */}
      <aside className={`hidden lg:flex flex-col bg-white/80 backdrop-blur-xl border-r border-slate-200/80 transition-all duration-300 z-30 ${collapsed ? 'w-20' : 'w-64'} flex-shrink-0 select-none shadow-[2px_0_16px_rgba(0,0,0,0.03)] h-screen sticky top-0`}>

        {/* Brand Header */}
        <div className={`h-16 px-4 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} border-b border-slate-200/70 flex-shrink-0`}>
          <Link to="/dashboard" className="flex items-center space-x-3 overflow-hidden" title={collapsed ? "EMERGENCY RESPONSE DIGITAL TWIN" : undefined}>
            <div className="w-9 h-9 rounded-xl bg-[#0B132B] text-sky-400 flex items-center justify-center shadow-md shadow-slate-900/15 flex-shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            {!collapsed && (
              <div className="leading-tight text-left">
                <span className="font-extrabold text-slate-900 text-xs tracking-tight block uppercase">EMERGENCY RESPONSE</span>
                <span className="text-[9px] font-bold text-sky-600 tracking-widest uppercase block">DIGITAL TWIN</span>
              </div>
            )}
          </Link>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="w-6 h-6 rounded-lg bg-white/80 hover:bg-white text-slate-500 flex items-center justify-center transition-colors cursor-pointer border border-slate-200/80 shadow-2xs"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Collapsed Expand Toggle */}
        {collapsed && (
          <div className="flex justify-center py-2 border-b border-slate-100 flex-shrink-0">
            <button
              onClick={() => setCollapsed(false)}
              className="w-7 h-7 rounded-lg bg-white hover:bg-slate-50 text-slate-500 flex items-center justify-center transition-colors cursor-pointer border border-slate-200/80 shadow-2xs"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
          {visibleNavSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <p className="text-[10px] font-bold text-slate-400 tracking-wider px-3 mb-1 uppercase">
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
                      className={`flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-3'} py-2 rounded-xl text-xs font-semibold transition-all group ${isActive
                          ? 'liquid-glass-blue text-blue-700 font-bold border-l-[3px] border-blue-600 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                        }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <div className={`${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} transition-colors flex-shrink-0`}>
                          {item.icon}
                        </div>
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!collapsed && item.badge && (
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${item.badgeColor} ml-2 flex-shrink-0 shadow-2xs`}>
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

        {/* Bottom Profile & System Sync */}
        <div ref={userDropdownRef} className="p-3 border-t border-slate-200/70 bg-white/60 backdrop-blur-md relative flex-shrink-0">

          {/* Twin Sync Active Status Pill */}
          {!collapsed && (
            <div className="flex items-center justify-between px-2.5 py-1 mb-2.5 rounded-lg bg-slate-50/90 border border-slate-200/60 text-[10px]">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold text-slate-700">Twin Sync Active</span>
              </div>
              <span className="font-mono text-slate-400 text-[9px]">24ms</span>
            </div>
          )}

          {/* Commander Profile Button */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className={`w-full flex items-center ${collapsed ? 'justify-center p-1.5' : 'justify-between p-2'} rounded-xl bg-slate-50/90 hover:bg-white border border-slate-200/80 transition-all shadow-2xs cursor-pointer group`}
              title={collapsed ? "Cmdr. Justin Vance (Click for menu)" : undefined}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-sky-500 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                    JV
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                {!collapsed && (
                  <div className="text-left leading-none min-w-0">
                    <span className="text-xs font-bold text-slate-900 block truncate group-hover:text-blue-600 transition-colors">
                      {currentUser?.name || 'EOC User'}
                    </span>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100/80 text-blue-700 font-mono">
                        {currentRole}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">EOC-7049</span>
                    </div>
                  </div>
                )}
              </div>
              {!collapsed && (
                <ChevronUp className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              )}
            </button>

            {/* Commander Profile Popover Menu */}
            {userDropdownOpen && (
              <div className={`absolute ${collapsed ? 'left-full ml-3 bottom-0 w-56' : 'bottom-full mb-2 left-0 right-0 w-full'} bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-left animate-in fade-in slide-in-from-bottom-2`}>
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Commander</p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">{currentUser?.name || 'EOC User'}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{currentUser?.agency || 'Emergency Operations Center'} • {currentUser?.id || 'EOC-7049'}</p>
                </div>
                <div className="py-1">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">Switch Role</p>
                  {(['ADMIN', 'OPERATOR', 'ANALYST'] as const).map(role => (
                    <button
                      key={role}
                      onClick={() => { setCurrentRole(role); setUserDropdownOpen(false); }}
                      className={`w-full px-3 py-1.5 text-xs text-left font-semibold flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${currentRole === role ? 'text-blue-600 font-bold bg-blue-50/60' : 'text-slate-700'}`}
                    >
                      <span className="flex items-center space-x-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 opacity-70" />
                        <span>Role: {role}</span>
                      </span>
                      {currentRole === role && <span className="text-xs font-bold text-blue-600">✓</span>}
                    </button>
                  ))}
                </div>
                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => { setUserDropdownOpen(false); navigate('/'); }}
                    className="w-full px-3 py-1.5 text-xs text-left text-rose-600 hover:bg-rose-50 font-semibold transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span className="flex items-center space-x-1.5">
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout Terminal</span>
                    </span>
                    <span className="text-[10px] font-mono opacity-70">ESC</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* Top Navbar Chrome (Apple Liquid Glassmorphism) */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-20 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex-shrink-0">

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
                ref={searchInputRef}
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

          {/* Right Action Widgets (Profile removed from top right) */}
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
              className="fixed inset-y-0 left-0 w-72 bg-white text-slate-800 flex flex-col shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 flex items-center justify-between border-b border-slate-100 flex-shrink-0">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#0B132B] text-sky-400 flex items-center justify-center font-bold">
                    <Radio className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-slate-900 tracking-tight text-sm">AEGIS TWIN OS</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-4 space-y-4 overflow-y-auto flex-1 text-left">
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

              {/* Mobile Profile Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-500 text-white font-extrabold text-xs flex items-center justify-center">
                      JV
                    </div>
                    <div className="text-left leading-none">
                      <span className="text-xs font-bold text-slate-900 block">Cmdr. Justin Vance</span>
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">EOC Lead Operator</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/'); }}
                    className="p-2 rounded-lg text-rose-600 hover:bg-rose-50"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
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
