import { SensorStatus, Coordinates } from './common';

export type SensorType =
  | 'TEMPERATURE'
  | 'SMOKE'
  | 'GAS'
  | 'WATER_LEVEL'
  | 'SEISMIC'
  | 'AIR_QUALITY'
  | 'PEDESTRIAN_FLOW'
  | 'LANDSLIDE'
  | 'EXTENSOMETER'
  | 'TRAFFIC_SPEED'
  | 'SOIL_MOISTURE'
  | 'WEATHER';

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
  battery?: number;
  datasetSource?: string;
  historical24h: { time: string; value: number }[];
}
