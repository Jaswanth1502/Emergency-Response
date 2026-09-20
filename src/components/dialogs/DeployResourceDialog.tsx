import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Truck, Navigation } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DeployResourceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIncidentId?: string;
  selectedResourceId?: string;
}

export const DeployResourceDialog: React.FC<DeployResourceDialogProps> = ({
  isOpen,
  onClose,
  selectedIncidentId,
  selectedResourceId
}) => {
  const { incidents, resources, deployResource } = useApp();

  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');

  const [incidentId, setIncidentId] = useState<string>('');
  const [resourceId, setResourceId] = useState<string>('');

  // Re-sync selection state whenever dialog opens or selection props change
  useEffect(() => {
    if (isOpen) {
      const targetIncId =
        selectedIncidentId || activeIncidents[0]?.id || incidents[0]?.id || '';
      setIncidentId(targetIncId);

      const availableRes = resources.filter(
        res => res.status === 'AVAILABLE' || res.id === selectedResourceId
      );
      const defaultResId =
        selectedResourceId || availableRes[0]?.id || resources[0]?.id || '';
      setResourceId(defaultResId);
    }
  }, [isOpen, selectedIncidentId, selectedResourceId, resources, incidents]);

  const availableResources = resources.filter(
    res => res.status === 'AVAILABLE' || res.id === selectedResourceId
  );

  // Fallback to all resources if none have AVAILABLE status
  const resourceOptions = availableResources.length > 0 ? availableResources : resources;

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentId || !resourceId) return;

    deployResource(resourceId, incidentId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/45 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-md rounded-2xl glass-panel-neutral border border-white/40 shadow-2xl p-6 z-10"
          >
            <div className="flex items-center justify-between mb-4 border-b border-slate-300/30 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                  <Truck className="w-5 h-5 animate-pulse" />
                </div>
                <h3 className="text-md font-bold uppercase tracking-wider text-slate-900">
                  Tactical Resource Dispatch
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-slate-300/20 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDeploy} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  Target Emergency Incident
                </label>
                <select
                  value={incidentId}
                  onChange={e => setIncidentId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white/90 border border-slate-300/70 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:outline-none cursor-pointer"
                  required
                >
                  <option value="" disabled>-- Select Active Incident --</option>
                  {(activeIncidents.length > 0 ? activeIncidents : incidents).map(inc => (
                    <option key={inc.id} value={inc.id}>
                      [{inc.id}] {inc.title} ({inc.severity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  Select Standby Emergency Unit
                </label>
                <select
                  value={resourceId}
                  onChange={e => setResourceId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white/90 border border-slate-300/70 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:outline-none cursor-pointer"
                  required
                >
                  <option value="" disabled>-- Select Unit --</option>
                  {resourceOptions.map(res => (
                    <option key={res.id} value={res.id}>
                      {res.name} — ({res.type}) [{res.status}]
                    </option>
                  ))}
                </select>
              </div>

              {resourceId && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center space-x-1.5 font-semibold">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Estimated Emergency Deployment Route</span>
                  </div>
                  <p className="text-slate-600">
                    Routing unit via dynamic EOC traffic signals. Calculated response ETA of{' '}
                    <strong className="text-amber-700">
                      {resources.find(r => r.id === resourceId)?.etaMinutes || 4} minutes
                    </strong>.
                  </p>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-300/30">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs uppercase font-bold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!incidentId || !resourceId}
                  className="px-5 py-2 text-xs uppercase font-extrabold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer flex items-center space-x-1"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize & Dispatch</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeployResourceDialog;
