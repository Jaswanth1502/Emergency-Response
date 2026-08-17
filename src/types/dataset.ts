export type DataCategory =
  | 'Fire & Thermal'
  | 'Flood & Hydro'
  | 'Landslide & Terrain'
  | 'Gas & Chemical'
  | 'Seismic & Structural'
  | 'Traffic & Transit'
  | 'Crowd & Pedestrian'
  | 'Hospital & Medical'
  | 'Geospatial & 3D'
  | 'Weather & Climate';

export type IntegrationStatus = 'ACTIVE_STREAM' | 'HISTORICAL_BASELINE' | 'SYNCHRONIZED' | 'ML_MODEL_TRAINED';

export interface DataFieldMeta {
  name: string;
  type: string;
  unit?: string;
  description: string;
}

export interface DatasetItem {
  id: string;
  name: string;
  category: DataCategory;
  provider: string;
  format: string;
  recordsCount: string;
  updateCadence: string;
  status: IntegrationStatus;
  license: string;
  description: string;
  monitoredFields: DataFieldMeta[];
  samplePayload: Record<string, any>;
  endpointUrl?: string;
}
