import { Severity, IncidentStatus, Coordinates } from './common';

export interface Incident {
  id: string;
  title: string;
  type: 'Structure Fire' | 'Flood' | 'Earthquake Aftershock' | 'HazMat Spill' | 'Multi-Vehicle Collision' | 'Building Collapse';
  severity: Severity;
  status: IncidentStatus;
  locationName: string;
  coordinates: Coordinates;
  reportedAt: string;
  description: string;
  assignedCommander: string;
  affectedRadiusMeter: number;
  reporterName: string;
  reporterContact: string;
  timeline: TimelineEvent[];
  assignedResources: string[]; // Resource IDs
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  type: 'alert' | 'update' | 'dispatch' | 'containment' | 'resolution';
}
