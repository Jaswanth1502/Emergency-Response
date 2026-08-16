import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Lazy loaded pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const IncidentManagement = lazy(() => import('./pages/IncidentManagement'));
const IncidentDetails = lazy(() => import('./pages/IncidentDetails'));
const DigitalTwin = lazy(() => import('./pages/DigitalTwin'));
const ResourceAllocation = lazy(() => import('./pages/ResourceAllocation'));
const Evacuation = lazy(() => import('./pages/Evacuation'));
const EmergencyFleet = lazy(() => import('./pages/EmergencyFleet'));
const HospitalsTriage = lazy(() => import('./pages/HospitalsTriage'));
const SensorMonitoring = lazy(() => import('./pages/SensorMonitoring'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Reports = lazy(() => import('./pages/Reports'));
const SystemAlerts = lazy(() => import('./pages/SystemAlerts'));
const Administration = lazy(() => import('./pages/Administration'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E2E8F0]/90 via-[#F8FAFC] to-white">
    <div className="text-center space-y-3">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Initializing EOC Systems...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public / Auth routes */}
            <Route path="/" element={<AuthLayout bgClass="bg-transparent" textClass="text-slate-900" isLight={true}><Landing /></AuthLayout>} />
            <Route path="/login" element={<AuthLayout bgClass="bg-transparent" textClass="text-slate-900" isLight={true}><Login /></AuthLayout>} />

            {/* Dashboard routes (with sidebar/navbar layout) */}
            <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
            <Route path="/incidents" element={<DashboardLayout><IncidentManagement /></DashboardLayout>} />
            <Route path="/incidents/:id" element={<DashboardLayout><IncidentDetails /></DashboardLayout>} />
            <Route path="/digital-twin" element={<DashboardLayout><DigitalTwin /></DashboardLayout>} />
            <Route path="/resources" element={<DashboardLayout><ResourceAllocation /></DashboardLayout>} />
            <Route path="/evacuation" element={<DashboardLayout><Evacuation /></DashboardLayout>} />
            <Route path="/fleet" element={<DashboardLayout><EmergencyFleet /></DashboardLayout>} />
            <Route path="/hospitals" element={<DashboardLayout><HospitalsTriage /></DashboardLayout>} />
            <Route path="/sensors" element={<DashboardLayout><SensorMonitoring /></DashboardLayout>} />
            <Route path="/analytics" element={<DashboardLayout><Analytics /></DashboardLayout>} />
            <Route path="/reports" element={<DashboardLayout><Reports /></DashboardLayout>} />
            <Route path="/alerts" element={<DashboardLayout><SystemAlerts /></DashboardLayout>} />
            <Route path="/administration" element={<DashboardLayout><Administration /></DashboardLayout>} />
            <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />

            {/* Catch-all */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </AppProvider>
    </HashRouter>
  );
}
