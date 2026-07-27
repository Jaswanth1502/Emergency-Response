export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentStatus = 'ACTIVE' | 'DISPATCHED' | 'CONTAINED' | 'RESOLVED';
export type ResourceStatus = 'AVAILABLE' | 'DEPLOYED' | 'UNAVAILABLE' | 'EN_ROUTE';
export type SensorStatus = 'SAFE' | 'WARNING' | 'CRITICAL' | 'OFFLINE';

export interface ServiceResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}
