import { SensorStatus, Coordinates } from './common';

export type SensorType = 'TEMPERATURE' | 'SMOKE' | 'GAS' | 'WATER_LEVEL' | 'SEISMIC';

export interface SensorTelemetry {
  id: string;
  name: string;
  type: SensorType;
  status: SensorStatus;
  currentValue: number;
  unit: string;
  thresholdHigh: number;
  thresholdCritical: number;
  coordinates: Coordinates;
  lastReadingTime: string;
  historical24h: { time: string; value: number }[];
}
