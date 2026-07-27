import { ResourceStatus, Coordinates } from './common';

export type ResourceType = 'HOSPITAL' | 'FIRE_STATION' | 'POLICE_UNIT' | 'RESCUE_TEAM';

export interface EmergencyResource {
  id: string;
  name: string;
  type: ResourceType;
  status: ResourceStatus;
  capacityLabel: string; // e.g. "24/150 beds free", "4 units ready"
  capacityPercent: number; // 0 to 100 representing percentage of usage
  coordinates: Coordinates;
  distanceKm: number;
  etaMinutes: number;
  contactNumber: string;
}
