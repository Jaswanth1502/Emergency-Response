import React from 'react';
import { AlertTriangle, AlertCircle, Shield, CheckCircle, Clock, Radio, Activity, Disc } from 'lucide-react';
import { Severity, IncidentStatus, ResourceStatus, SensorStatus } from '../../types/common';

interface StatusBadgeProps {
  status?: IncidentStatus | ResourceStatus | SensorStatus;
  severity?: Severity;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, severity, className = '' }) => {
  if (severity) {
    let classes = '';
    let icon = <AlertCircle className="w-3.5 h-3.5" />;
    
    switch (severity) {
      case 'CRITICAL':
        classes = 'bg-rose-500/20 text-rose-700 border border-rose-400/30';
        icon = <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />;
        break;
      case 'HIGH':
        classes = 'bg-amber-500/20 text-amber-700 border border-amber-400/30';
        icon = <AlertCircle className="w-3.5 h-3.5" />;
        break;
      case 'MEDIUM':
        classes = 'bg-indigo-500/20 text-indigo-700 border border-indigo-400/30';
        icon = <Shield className="w-3.5 h-3.5" />;
        break;
      case 'LOW':
        classes = 'bg-emerald-500/20 text-emerald-700 border border-emerald-400/30';
        icon = <CheckCircle className="w-3.5 h-3.5" />;
        break;
    }
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${classes} ${className}`}>
        {icon}
        {severity}
      </span>
    );
  }

  if (status) {
    let classes = '';
    let icon = <Disc className="w-3.5 h-3.5" />;
    let label = status.toString();

    // Map all potential state enums
    switch (status) {
      // Incident status
      case 'ACTIVE':
        classes = 'bg-rose-500/10 text-rose-700 border border-rose-500/20';
        icon = <Radio className="w-3.5 h-3.5 animate-pulse text-rose-600" />;
        label = 'Active Ops';
        break;
      case 'DISPATCHED':
        classes = 'bg-blue-500/10 text-blue-700 border border-blue-500/20';
        icon = <Clock className="w-3.5 h-3.5 text-blue-500" />;
        label = 'Dispatched';
        break;
      case 'CONTAINED':
        classes = 'bg-amber-500/10 text-amber-700 border border-amber-500/20';
        icon = <Activity className="w-3.5 h-3.5 text-amber-500" />;
        label = 'Contained';
        break;
      case 'RESOLVED':
        classes = 'bg-slate-500/10 text-slate-700 border border-slate-500/20';
        icon = <CheckCircle className="w-3.5 h-3.5 text-slate-500" />;
        label = 'Resolved';
        break;

      // Resource status
      case 'AVAILABLE':
        classes = 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20';
        icon = <span className="relative flex h-2 w-2 mr-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>;
        label = 'Available';
        break;
      case 'DEPLOYED':
        classes = 'bg-blue-500/10 text-blue-700 border border-blue-500/20';
        icon = <Disc className="w-3.5 h-3.5 text-blue-500" />;
        label = 'Deployed';
        break;
      case 'UNAVAILABLE':
        classes = 'bg-slate-500/10 text-slate-600 border border-slate-500/20';
        icon = <Disc className="w-3.5 h-3.5 text-slate-400" />;
        label = 'Unavailable';
        break;
      case 'EN_ROUTE':
        classes = 'bg-cyan-500/10 text-cyan-700 border border-cyan-500/20';
        icon = <Clock className="w-3.5 h-3.5 text-cyan-500 animate-spin" />;
        label = 'En Route';
        break;

      // Sensor status
      case 'SAFE':
        classes = 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20';
        icon = <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
        label = 'Safe';
        break;
      case 'WARNING':
        classes = 'bg-amber-500/10 text-amber-700 border border-amber-500/20';
        icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
        label = 'Warning';
        break;
      case 'OFFLINE':
        classes = 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
        icon = <Disc className="w-3.5 h-3.5 text-slate-400" />;
        label = 'Offline';
        break;
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${classes} ${className}`}>
        {icon}
        {label}
      </span>
    );
  }

  return null;
};
export default StatusBadge;
