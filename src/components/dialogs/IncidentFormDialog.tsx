import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, FileText, MapPin, User, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Severity } from '../../types/common';

interface IncidentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IncidentFormDialog: React.FC<IncidentFormDialogProps> = ({ isOpen, onClose }) => {
  const { addIncident } = useApp();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Structure Fire' | 'Flood' | 'Earthquake Aftershock' | 'HazMat Spill' | 'Multi-Vehicle Collision' | 'Building Collapse'>('Structure Fire');
  const [severity, setSeverity] = useState<Severity>('HIGH');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [assignedCommander, setAssignedCommander] = useState('Duty Commander Delta');
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [affectedRadiusMeter, setAffectedRadiusMeter] = useState(300);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !locationName || !description) return;

    // Standardized mock coordinates inside city EOC limits
    const lat = 45.41 + (Math.random() - 0.5) * 0.05;
    const lng = -75.69 + (Math.random() - 0.5) * 0.05;

    addIncident({
      title,
      type,
      severity,
      status: 'ACTIVE',
      locationName,
      coordinates: { lat, lng },
      description,
      assignedCommander,
      affectedRadiusMeter,
      reporterName: reporterName || 'Automated Portal',
      reporterContact: reporterContact || '911 Dispatch',
      assignedResources: []
    });

    onClose();
    // Reset fields
    setTitle('');
    setLocationName('');
    setDescription('');
    setReporterName('');
    setReporterContact('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/45 backdrop-blur-md"
          />

          {/* Dialog Body */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl glass-panel-neutral border border-white/40 shadow-2xl p-6 z-10"
          >
            <div className="flex items-center justify-between mb-4 border-b border-slate-300/30 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="text-md font-bold uppercase tracking-wider text-slate-900">Establish Tactical Incident</h3>
              </div>
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-300/20 text-slate-500 hover:text-slate-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Incident Title / Hazard Event</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Chemical Storage Fire - Sector 4"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white/70 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Hazard Category</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-white/70 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                  >
                    <option value="Structure Fire">Structure Fire</option>
                    <option value="Flood">Flood</option>
                    <option value="Earthquake Aftershock">Earthquake Aftershock</option>
                    <option value="HazMat Spill">HazMat Spill</option>
                    <option value="Multi-Vehicle Collision">Multi-Vehicle Collision</option>
                    <option value="Building Collapse">Building Collapse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tactical Severity</label>
                  <select
                    value={severity}
                    onChange={e => setSeverity(e.target.value as Severity)}
                    className="w-full px-3 py-2 text-sm bg-white/70 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">GIS Location Name</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={locationName}
                    onChange={e => setLocationName(e.target.value)}
                    placeholder="e.g. 404 Logistics Way, Sector 4"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white/70 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Threat Buffer Radius (Meters)</label>
                  <input
                    type="number"
                    value={affectedRadiusMeter}
                    onChange={e => setAffectedRadiusMeter(Number(e.target.value))}
                    min="50"
                    max="5000"
                    className="w-full px-3 py-2 text-sm bg-white/70 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Assigned Commander</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={assignedCommander}
                      onChange={e => setAssignedCommander(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white/70 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Incident Tactical Description</label>
                <textarea
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Provide precise visual reports, chemical names, blockage details, or casualty updates..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-white/70 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Reporter Name</label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={e => setReporterName(e.target.value)}
                    placeholder="e.g. Field Operative"
                    className="w-full px-3 py-2 text-sm bg-white/70 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Reporter Contact</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={reporterContact}
                      onChange={e => setReporterContact(e.target.value)}
                      placeholder="e.g. +1 (555) 0123"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white/70 border border-slate-300/50 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-300/30">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs uppercase font-bold text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs uppercase font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all duration-150 cursor-pointer"
                >
                  Broadcast & Establish
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default IncidentFormDialog;
