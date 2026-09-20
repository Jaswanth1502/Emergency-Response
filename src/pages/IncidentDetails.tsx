import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/common/GlassCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { MapPlaceholder } from '../components/map/MapPlaceholder';
import { ConfirmDialog } from '../components/dialogs/ConfirmDialog';
import { DeployResourceDialog } from '../components/dialogs/DeployResourceDialog';
import { UploadMediaDialog } from '../components/dialogs/UploadMediaDialog';
import {
  ChevronLeft,
  User,
  Flame,
  Camera,
  Plus,
  Trash2,
  X,
  Play,
  Eye,
  CheckCircle2
} from 'lucide-react';

interface MediaItem {
  id: string;
  title: string;
  url: string;
  type: 'image' | 'video' | 'stream';
  timestamp: string;
}

export const IncidentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { incidents, resources, resolveIncident, escalateIncident, addNotification } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'resources' | 'media'>('overview');
  const [resolveConfirmOpen, setResolveConfirmOpen] = useState(false);
  const [escalateConfirmOpen, setEscalateConfirmOpen] = useState(false);
  const [deployOpen, setDeployOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);

  // Local media feed items state
  const [mediaList, setMediaList] = useState<MediaItem[]>([
    {
      id: 'm1',
      title: 'CCTV Node 4-A Feed',
      url: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=600',
      type: 'image',
      timestamp: 'Just now'
    },
    {
      id: 'm2',
      title: 'Responder Aerial View',
      url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600',
      type: 'image',
      timestamp: '5m ago'
    }
  ]);

  // Find the exact matching incident
  const incident = incidents.find(inc => inc.id === id);

  if (!incident) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-black text-slate-950 uppercase">INCIDENT FILE NOT FOUND</h3>
        <p className="text-sm text-slate-500 mb-4">The target tactical ID could not be loaded from EOC archives.</p>
        <button
          onClick={() => navigate('/incidents')}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs uppercase font-extrabold tracking-wider cursor-pointer"
        >
          Return Registry
        </button>
      </div>
    );
  }

  const assignedUnits = resources.filter(res => incident.assignedResources.includes(res.id));

  const handleResolve = () => {
    resolveIncident(incident.id);
  };

  const handleEscalate = () => {
    escalateIncident(incident.id);
  };

  const handleAddMedia = (newMedia: { title: string; url: string; type: 'image' | 'video' | 'stream' }) => {
    const item: MediaItem = {
      id: `media-${Date.now()}`,
      title: newMedia.title,
      url: newMedia.url,
      type: newMedia.type,
      timestamp: 'Just now'
    };
    setMediaList(prev => [item, ...prev]);
    addNotification(`NEW VISUAL STREAM ATTACHED: "${newMedia.title}" added to incident ${incident.id}.`, 'info');
  };

  const handleDeleteMedia = (mediaId: string) => {
    setMediaList(prev => prev.filter(m => m.id !== mediaId));
    if (previewMedia?.id === mediaId) setPreviewMedia(null);
    addNotification(`Visual feed detached from incident ${incident.id}.`, 'warning');
  };

  const markers = [
    {
      id: incident.id,
      lat: incident.coordinates.lat,
      lng: incident.coordinates.lng,
      label: incident.title,
      severity: incident.severity,
      type: incident.type
    }
  ];

  const zones = [
    {
      id: `Z-${incident.id}`,
      center: incident.coordinates,
      radiusMeter: incident.affectedRadiusMeter,
      tint: (incident.severity === 'CRITICAL' ? 'rose' : 'amber') as any,
      label: `${incident.id} Buffer Zone`
    }
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Detail Header breadcrumb row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-300/25 pb-4 gap-4">
        <div>
          <button
            onClick={() => navigate('/incidents')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 hover:text-cyan-800 uppercase mb-1.5 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return Incident Registry</span>
          </button>
          <div className="flex items-center space-x-3">
            <span className="font-mono font-black text-lg text-rose-600">[{incident.id}]</span>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{incident.title}</h2>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap gap-2">
          <StatusBadge severity={incident.severity} />
          <StatusBadge status={incident.status} />
        </div>
      </div>

      {/* Main Grid: Overview & Interactive map */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left tabs container (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Navigation Tab list */}
          <div className="flex space-x-1.5 border-b border-slate-300/20 pb-1">
            {(['overview', 'timeline', 'resources', 'media'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'border-cyan-500 text-cyan-600 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab}
                {tab === 'media' && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-cyan-100 text-cyan-700 text-[10px] font-bold">
                    {mediaList.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Dynamic Tab Body rendering */}
          <GlassCard tint="slate" className="flex-1">
            
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/50 rounded-xl border border-white/50">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Hazard Category</span>
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <Flame className="w-4 h-4 text-rose-500" />
                      {incident.type}
                    </span>
                  </div>
                  <div className="p-3 bg-white/50 rounded-xl border border-white/50">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">EOC Commander</span>
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <User className="w-4 h-4 text-cyan-500" />
                      {incident.assignedCommander}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Incident Narrative</h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-white/50 p-3.5 rounded-xl border border-white/40">
                    {incident.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Reporter Contact Info</span>
                    <p className="text-xs font-semibold text-slate-800 mt-1">{incident.reporterName}</p>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">{incident.reporterContact}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Threat Buffer Zone</span>
                    <p className="text-xs font-semibold text-slate-800 mt-1">{incident.affectedRadiusMeter} meters</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Automated evacuation area</p>
                  </div>
                </div>

                {/* Operations quick command toolbar */}
                {incident.status !== 'RESOLVED' && (
                  <div className="pt-4 border-t border-slate-300/30 flex flex-wrap gap-2.5">
                    <button
                      onClick={() => setDeployOpen(true)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs"
                    >
                      Assign Resource
                    </button>
                    <button
                      onClick={() => setEscalateConfirmOpen(true)}
                      className="px-4 py-2 bg-rose-500/10 text-rose-700 hover:bg-rose-500/15 border border-rose-500/30 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                    >
                      Escalate Threat
                    </button>
                    <button
                      onClick={() => setResolveConfirmOpen(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer ml-auto shadow-xs"
                    >
                      Resolve Case
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-4 text-left">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">EOC Sequence Event Log</h4>
                <div className="relative border-l-2 border-slate-300/30 pl-4 ml-2.5 space-y-5 py-2">
                  {incident.timeline.map((evt) => (
                    <div key={evt.id} className="relative">
                      <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-500 border border-white block shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
                      <div className="leading-tight">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{evt.event}</span>
                          <span className="text-[9px] font-mono text-slate-400">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">Logged by: {evt.actor} ({evt.type})</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Assigned Agency Units</h4>
                <div className="grid gap-3">
                  {assignedUnits.map((res) => (
                    <div key={res.id} className="p-3 rounded-xl bg-white/50 border border-white/50 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-extrabold text-slate-800 block">{res.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">{res.type} — Contact: {res.contactNumber}</span>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={res.status} />
                        <span className="text-[10px] text-slate-500 font-bold block mt-1">Arrival ETA: {res.etaMinutes} mins</span>
                      </div>
                    </div>
                  ))}

                  {assignedUnits.length === 0 && (
                    <div className="text-center py-8 text-slate-400 font-medium">
                      No active tactical assets allocated to this threat ID. Use "Assign Resource" to dispatch units.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MEDIA TAB (Fully Functional Stream & CCTV Feed Upload) */}
            {activeTab === 'media' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                    CCTV / Visual Feed Attachments
                  </h4>
                  <button
                    onClick={() => setUploadDialogOpen(true)}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Stream</span>
                  </button>
                </div>

                {/* Media Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  
                  {/* Upload Stream Trigger Card */}
                  <div
                    onClick={() => setUploadDialogOpen(true)}
                    className="aspect-video bg-cyan-50/50 hover:bg-cyan-100/60 rounded-xl border-2 border-dashed border-cyan-400/80 flex flex-col items-center justify-center text-center p-3 text-cyan-700 hover:text-cyan-900 transition-all cursor-pointer shadow-2xs group"
                  >
                    <div className="w-9 h-9 rounded-full bg-cyan-600 text-white flex items-center justify-center mb-1.5 shadow-md group-hover:scale-110 transition-transform">
                      <Camera className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider">Upload Stream</span>
                    <span className="text-[9px] text-cyan-600/80 font-bold mt-0.5">Photo / Video / RTSP</span>
                  </div>

                  {/* Render Uploaded & Existing Media Feeds */}
                  {mediaList.map(item => (
                    <div
                      key={item.id}
                      className="aspect-video bg-slate-900 rounded-xl overflow-hidden border border-white/20 relative group shadow-sm"
                    >
                      {/* Thumbnail or Video element */}
                      {item.type === 'video' ? (
                        <div className="w-full h-full relative bg-slate-950 flex items-center justify-center">
                          <video src={item.url} className="w-full h-full object-cover opacity-75" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-cyan-600/90 text-white flex items-center justify-center shadow-lg">
                              <Play className="w-4 h-4 ml-0.5" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="absolute inset-0 bg-cover bg-center opacity-75 group-hover:scale-105 transition-transform duration-300"
                          style={{ backgroundImage: `url("${item.url}")` }}
                        />
                      )}

                      {/* Card Overlay Actions */}
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setPreviewMedia(item)}
                          className="p-1.5 bg-white/90 text-slate-800 hover:bg-white rounded-lg shadow-md cursor-pointer transition-transform hover:scale-110"
                          title="View Fullscreen Feed"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMedia(item.id)}
                          className="p-1.5 bg-rose-600/90 text-white hover:bg-rose-600 rounded-lg shadow-md cursor-pointer transition-transform hover:scale-110"
                          title="Delete Stream"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Bottom Title Bar */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-2 text-[9px] text-white flex items-center justify-between pointer-events-none">
                        <span className="font-bold truncate max-w-[110px]">{item.title}</span>
                        <span className="text-[8px] font-mono opacity-80">{item.timestamp}</span>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            )}

          </GlassCard>
        </div>

        {/* Right Map & Details column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-300/30">
            <MapPlaceholder
              center={incident.coordinates}
              markers={markers}
              zones={zones}
              zoom={15}
              heightClass="h-[380px]"
              title={`EOC Incident Node: ${incident.id}`}
            />
          </div>

          {/* Quick Geographic specs */}
          <GlassCard title="Geospatial Coordinates" subtitle="Grid Positioning system" tint="slate">
            <div className="text-xs font-mono bg-slate-900 text-cyan-400 p-3 rounded-xl border border-white/10 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">LATITUDE:</span>
                <span>{incident.coordinates.lat.toFixed(6)}° N</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">LONGITUDE:</span>
                <span>{incident.coordinates.lng.toFixed(6)}° W</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">EOC SUB-SECTOR:</span>
                <span>SECTOR-04 LOGISTICS</span>
              </div>
            </div>
          </GlassCard>
        </div>

      </div>

      {/* Upload Media Dialog Modal */}
      <UploadMediaDialog
        isOpen={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUpload={handleAddMedia}
      />

      {/* Fullscreen Media Lightbox Viewer Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/20 text-white">
            <div className="p-4 bg-slate-950 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">{previewMedia.title}</h3>
              </div>
              <button
                onClick={() => setPreviewMedia(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 aspect-video bg-black flex items-center justify-center">
              {previewMedia.type === 'video' ? (
                <video src={previewMedia.url} controls autoPlay className="w-full h-full object-contain" />
              ) : (
                <img src={previewMedia.url} alt={previewMedia.title} className="w-full h-full object-contain" />
              )}
            </div>
            <div className="p-3 bg-slate-950 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Attached to: {incident.id}</span>
              <button
                onClick={() => handleDeleteMedia(previewMedia.id)}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs flex items-center space-x-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Detach Stream</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog Modals */}
      <ConfirmDialog
        isOpen={resolveConfirmOpen}
        title="Resolve Active incident"
        description="Are you sure you want to mark this incident as RESOLVED? All assigned emergency response teams will be reverted to available status."
        type="info"
        onConfirm={handleResolve}
        onCancel={() => setResolveConfirmOpen(false)}
      />

      <ConfirmDialog
        isOpen={escalateConfirmOpen}
        title="ESCALATE INCIDENT THREAT"
        description="WARNING: You are about to escalate this hazard node to CRITICAL status. An automated mutual aid request will be broadcast to all regional centers."
        type="danger"
        confirmLabel="ESCALATE NOW"
        onConfirm={handleEscalate}
        onCancel={() => setEscalateConfirmOpen(false)}
      />

      <DeployResourceDialog
        isOpen={deployOpen}
        onClose={() => setDeployOpen(false)}
        selectedIncidentId={incident.id}
      />

    </div>
  );
};

export default IncidentDetails;
