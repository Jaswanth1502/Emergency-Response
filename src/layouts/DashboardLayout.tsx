import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  AlertOctagon,
  Globe2,
  Users,
  Activity,
  Milestone,
  LineChart,
  ClipboardList,
  Shield,
  Settings,
  Bell,
  CloudSun,
  Clock,
  Menu,
  X,
  LogOut
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
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [incidentFormOpen, setIncidentFormOpen] = useState(false);
  const [deployResourceOpen, setDeployResourceOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  // Real-time clock ticks
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { label: 'EOC Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, tint: 'slate' as const },
    { label: 'Incident Management', path: '/incidents', icon: <AlertOctagon className="w-4 h-4" />, tint: 'rose' as const },
    { label: 'Digital Twin GIS', path: '/digital-twin', icon: <Globe2 className="w-4 h-4" />, tint: 'cyan' as const },
    { label: 'Resource Allocation', path: '/resources', icon: <Users className="w-4 h-4" />, tint: 'amber' as const },
    { label: 'Evacuation System', path: '/evacuation', icon: <Milestone className="w-4 h-4" />, tint: 'emerald' as const },
    { label: 'Sensor Telemetry', path: '/sensors', icon: <Activity className="w-4 h-4" />, tint: 'cyan' as const },
    { label: 'Analytics Engine', path: '/analytics', icon: <LineChart className="w-4 h-4" />, tint: 'indigo' as const },
    { label: 'Crisis Reports', path: '/reports', icon: <ClipboardList className="w-4 h-4" />, tint: 'indigo' as const },
    { label: 'EOC Admin Core', path: '/administration', icon: <Shield className="w-4 h-4" />, tint: 'slate' as const },
    { label: 'System Settings', path: '/settings', icon: <Settings className="w-4 h-4" />, tint: 'slate' as const }
  ];

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50/30 to-slate-200 text-slate-800 flex flex-col font-sans">
      {/* Dynamic Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-sm transition-all">
        <div className="mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-300/20 text-slate-600 lg:hidden focus:outline-none"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
            <Link to="/dashboard" className="flex items-center space-x-2.5 group">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-500/20 group-hover:rotate-6 transition-transform duration-300">
                <Globe2 className="w-5 h-5 animate-pulse-slow" />
              </div>
              <div className="leading-none">
                <span className="font-extrabold text-slate-900 tracking-tight text-base block">METRO EOC</span>
                <span className="text-[9px] font-bold text-cyan-600 tracking-widest uppercase">Digital Twin Platform</span>
              </div>
            </Link>
          </div>

          {/* Quick Stats Banner / Navbar Chrome */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Live Clock */}
            <div className="flex items-center space-x-2 bg-slate-500/5 px-3 py-1.5 rounded-xl border border-white/50 text-slate-700 text-xs font-semibold shadow-sm">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span className="tabular-nums font-mono">{time.toLocaleTimeString()}</span>
              <span className="text-slate-400">|</span>
              <span className="text-[10px] text-slate-500">29 MAR 2026</span>
            </div>

            {/* Weather Chip */}
            <div className="flex items-center space-x-2 bg-slate-500/5 px-3 py-1.5 rounded-xl border border-white/50 text-slate-700 text-xs font-semibold shadow-sm">
              <CloudSun className="w-3.5 h-3.5 text-amber-500" />
              <span>12.5°C</span>
              <span className="text-slate-400">|</span>
              <span className="text-rose-600 font-bold uppercase tracking-wider text-[10px] animate-pulse">Flood Warning</span>
            </div>
          </div>

          {/* Search, Notifications & User Actions */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <button
              onClick={() => setNotifOpen(true)}
              className="relative p-2.5 rounded-xl bg-white/80 hover:bg-white border border-white/50 text-slate-700 hover:text-slate-900 transition-all shadow-sm focus:outline-none cursor-pointer"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-mono text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* User Dropdown Selector (Role Switcher) */}
            <div className="flex items-center space-x-2 bg-white/80 px-2 py-1.5 rounded-xl border border-white/50 shadow-sm">
              <img
                src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"}
                alt={currentUser?.name}
                className="w-7 h-7 rounded-lg object-cover border border-white/50"
              />
              <div className="hidden lg:block text-left pr-2 leading-none">
                <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Role: {currentUser?.role}</span>
                <span className="text-xs font-bold text-slate-800 block truncate max-w-[120px]">{currentUser?.name}</span>
              </div>
              <select
                value={currentRole}
                onChange={e => setCurrentRole(e.target.value as any)}
                className="text-[10px] uppercase font-bold border-l border-slate-300/30 pl-1.5 focus:outline-none text-slate-600 cursor-pointer"
              >
                <option value="ADMIN">Admin</option>
                <option value="OPERATOR">Operator</option>
                <option value="ANALYST">Analyst</option>
              </select>
            </div>

            {/* Logout Trigger */}
            <button
              onClick={() => navigate('/')}
              className="p-2.5 rounded-xl bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 border border-rose-500/20 transition-all shadow-sm cursor-pointer"
              title="Logout System"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Grid Wrapper */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Collapsible Sidebar Navigation */}
        <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-white/40 bg-white/50 backdrop-blur-xl p-4 space-y-6">
          <div className="space-y-1.5">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest pl-3 mb-2">EOC Core Systems</p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-md shadow-slate-900/15 border-l-4 border-cyan-500'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <div className={isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-700'}>
                      {item.icon}
                    </div>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Command Actions in Sidebar */}
          <div className="pt-4 border-t border-slate-300/30 space-y-2.5">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest pl-3">EOC Instant Dispatch</p>
            <div className="px-1.5 space-y-2">
              <button
                onClick={() => setIncidentFormOpen(true)}
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer block text-center"
              >
                + New Incident
              </button>
              <button
                onClick={() => setDeployResourceOpen(true)}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer block text-center"
              >
                Deploy Resource
              </button>
            </div>
          </div>
        </aside>

        {/* Dynamic Page Content Wrapper */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mx-auto max-w-7xl h-full flex flex-col"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile Drawer Slide-over Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-64 bg-white text-slate-800 p-5 flex flex-col space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-200">
                <span className="font-extrabold text-slate-900 tracking-tight text-sm uppercase">EOC Operations Navigation</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg text-slate-500 hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1 overflow-y-auto flex-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                        isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-slate-200 pt-4 space-y-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); setIncidentFormOpen(true); }}
                  className="w-full py-2 bg-rose-600 text-white font-bold text-xs uppercase rounded-xl"
                >
                  + Create Incident
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); setDeployResourceOpen(true); }}
                  className="w-full py-2 bg-amber-500 text-white font-bold text-xs uppercase rounded-xl"
                >
                  Deploy Resource
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Dialog Modals */}
      <NotificationDrawer isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
      <IncidentFormDialog isOpen={incidentFormOpen} onClose={() => setIncidentFormOpen(false)} />
      <DeployResourceDialog isOpen={deployResourceOpen} onClose={() => setDeployResourceOpen(false)} />

    </div>
  );
};
export default DashboardLayout;
