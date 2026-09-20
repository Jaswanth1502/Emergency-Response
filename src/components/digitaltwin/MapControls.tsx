import React from 'react';
import {
  Compass,
  RotateCw,
  Sliders,
  Flame,
  Building2,
  Truck,
  Shield,
  Maximize2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { EmergencyIncident, Hospital, EmergencyResource, SafeZone } from '../../types/digitalTwin';

interface MapControlsProps {
  onFlyToIncident?: (incident: EmergencyIncident) => void;
  onFlyToHospital?: (hospital: Hospital) => void;
  onFlyToResource?: (resource: EmergencyResource) => void;
  onFlyToSafeZone?: (safeZone: SafeZone) => void;
  onTiltChange?: (tilt: number) => void;
  onHeadingChange?: (heading: number) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetView?: () => void;
  tilt: number;
  heading: number;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onTiltChange,
  onHeadingChange,
  onZoomIn,
  onZoomOut,
  onResetView,
  tilt,
  heading
}) => {
  return (
    <div className="flex flex-col space-y-2 select-none font-sans pointer-events-auto">
      {/* Camera Action Buttons */}
      <div className="bg-slate-900/95 backdrop-blur-xl p-1.5 rounded-2xl border border-white/15 shadow-2xl flex flex-col space-y-1 text-white">
        
        <button
          onClick={onZoomIn}
          className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={onZoomOut}
          className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={() => onTiltChange?.(tilt >= 75 ? 0 : tilt + 25)}
          className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 flex items-center justify-center transition-colors cursor-pointer"
          title={`3D Camera Tilt (${tilt}°)`}
        >
          <Sliders className="w-4 h-4" />
        </button>

        <button
          onClick={() => onHeadingChange?.((heading + 45) % 360)}
          className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 flex items-center justify-center transition-colors cursor-pointer"
          title={`3D Rotate Heading (${heading}°)`}
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <button
          onClick={onResetView}
          className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 flex items-center justify-center transition-colors cursor-pointer"
          title="Reset Camera View"
        >
          <Compass className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
