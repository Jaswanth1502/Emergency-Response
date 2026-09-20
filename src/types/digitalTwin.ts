export type IncidentType =
  | 'FIRE'
  | 'FLOOD'
  | 'EARTHQUAKE'
  | 'LANDSLIDE'
  | 'GAS_LEAK'
  | 'BUILDING_COLLAPSE'
  | 'ROAD_ACCIDENT'
  | 'CROWD_EMERGENCY'
  | 'RAILWAY_ACCIDENT'
  | 'MEDICAL_EMERGENCY';

export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentStatus = 'ACTIVE' | 'CONTAINED' | 'DISPATCHED' | 'RESOLVED';

export interface EmergencyIncident {
  incidentId: string;
  incidentType: IncidentType;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  severity: IncidentSeverity;
  status: IncidentStatus;
  dangerRadius: number; // meters
  estimatedPeopleAtRisk: number;
  assignedResources: string[];
  recommendedHospitalId?: string;
  safeZoneId?: string;
  lastUpdated: string;
}

export interface SafeZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  capacity: number;
  occupancy: number;
}

export type ResourceType = 'AMBULANCE' | 'FIRE_TRUCK' | 'POLICE_VEHICLE' | 'RESCUE_TEAM';
export type ResourceStatus = 'AVAILABLE' | 'EN_ROUTE' | 'ON_SCENE' | 'RETURNING';

export interface EmergencyResource {
  resourceId: string;
  name: string;
  type: ResourceType;
  latitude: number;
  longitude: number;
  status: ResourceStatus;
  assignedIncident?: string;
  destination?: string;
  etaMinutes?: number;
  unitCode: string;
}

export interface Hospital {
  hospitalId: string;
  name: string;
  latitude: number;
  longitude: number;
  availableBeds: number;
  icuAvailable: number;
  traumaCare: boolean;
  burnUnit: boolean;
  emergencyLoad: number; // Percentage
  status: 'AVAILABLE' | 'SURGE' | 'FULL';
  lastUpdated: string;
}

export type SensorType =
  | 'SMOKE'
  | 'GAS'
  | 'TEMPERATURE'
  | 'WATER_LEVEL'
  | 'VIBRATION'
  | 'RAIN'
  | 'SOIL_MOISTURE'
  | 'TILT';

export interface IoTSensorNode {
  sensorId: string;
  sensorType: SensorType;
  latitude: number;
  longitude: number;
  value: number;
  unit: string;
  status: 'NORMAL' | 'WARNING' | 'ALERT';
  lastUpdated: string;
  locationLabel: string;
}

export interface RoutePath {
  id: string;
  type: 'EVACUATION' | 'RESCUE';
  name: string;
  coordinates: Array<{ lat: number; lng: number }>;
  distanceKm: number;
  estimatedTimeMins: number;
  destinationLabel: string;
  avoidsDangerZones: boolean;
}

export interface BlockedRoad {
  roadId: string;
  roadName: string;
  status: 'BLOCKED';
  reason: 'FLOOD' | 'FIRE' | 'DEBRIS' | 'COLLAPSE';
  coordinates: Array<{ lat: number; lng: number }>;
}

export interface MapLayerState {
  buildings3D: boolean;
  terrain: boolean;
  incidents: boolean;
  dangerZones: boolean;
  safeZones: boolean;
  ambulances: boolean;
  fireRescue: boolean;
  police: boolean;
  hospitals: boolean;
  iotSensors: boolean;
  evacuationRoutes: boolean;
  rescueRoutes: boolean;
  blockedRoads: boolean;
}
