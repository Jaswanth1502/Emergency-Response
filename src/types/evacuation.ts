import { Coordinates } from './common';

export interface EvacuationRoute {
  id: string;
  name: string;
  congestionStatus: 'CLEAR' | 'MODERATE' | 'HEAVY' | 'BLOCKED';
  estimatedTimeMinutes: number;
  capacityRate: number; // e.g. 85 for 85% full
  coordinates: Coordinates[]; // List of points representing polyline
  distanceKm: number;
}

export interface Shelter {
  id: string;
  name: string;
  capacity: number;
  occupancy: number;
  coordinates: Coordinates;
  distanceKm: number;
  status: 'OPEN' | 'FULL' | 'CLOSED';
}

export interface RoadStatus {
  id: string;
  roadName: string;
  status: 'OPEN' | 'CONGESTED' | 'CLOSED';
  reason?: string;
  coordinates: Coordinates;
}
