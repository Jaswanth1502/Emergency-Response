import React from 'react';
import { MapLibreMap } from './MapLibreMap';
import {
  EmergencyIncident,
  SafeZone,
  EmergencyResource,
  Hospital,
  IoTSensorNode,
  RoutePath,
  BlockedRoad,
  MapLayerState
} from '../../types/digitalTwin';

interface Google3DMapProps {
  heightClass?: string;
  incidents: EmergencyIncident[];
  safeZones: SafeZone[];
  resources: EmergencyResource[];
  hospitals: Hospital[];
  sensors: IoTSensorNode[];
  routes: RoutePath[];
  blockedRoads: BlockedRoad[];
  layers: MapLayerState;
  selectedIncident: EmergencyIncident | null;
  onSelectIncident: (incident: EmergencyIncident) => void;
  onSelectResource?: (resource: EmergencyResource) => void;
  onSelectHospital?: (hospital: Hospital) => void;
  onSelectSafeZone?: (safeZone: SafeZone) => void;
  onSelectSensor?: (sensor: IoTSensorNode) => void;
  onSwitchToOSM?: () => void;
  mapMode?: 'NORMAL' | 'SATELLITE';
}

export const Google3DMap: React.FC<Google3DMapProps> = (props) => {
  return <MapLibreMap {...props} />;
};

export { MapLibreMap };
