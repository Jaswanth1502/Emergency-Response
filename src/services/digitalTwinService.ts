import {
  EmergencyIncident,
  SafeZone,
  EmergencyResource,
  Hospital,
  IoTSensorNode,
  RoutePath,
  BlockedRoad
} from '../types/digitalTwin';

// MOCK EMERGENCY ECOSYSTEM DATA FOR DEMO SCENARIO & LIVE TWIN
const MOCK_INCIDENTS: EmergencyIncident[] = [
  {
    incidentId: 'INC-001',
    id: 'INC-001',
    incidentType: 'FIRE',
    title: 'Commercial Building Structure Fire',
    description: '485°C thermal surge on floor 4 with chemical storage tanks. 25 people trapped on upper floors.',
    latitude: 17.7800,
    longitude: 83.3800,
    severity: 'CRITICAL',
    status: 'ACTIVE',
    dangerRadius: 150,
    estimatedPeopleAtRisk: 25,
    affectedPeopleCount: 25,
    assignedResources: ['AMB-02', 'FIRE-01', 'RESCUE-01'],
    recommendedHospitalId: 'H001',
    safeZoneId: 'SAFE-001',
    lastUpdated: 'Just now',
    locationLabel: 'Visakhapatnam East'
  },
  {
    incidentId: 'INC-002',
    id: 'INC-002',
    incidentType: 'GAS_LEAK',
    title: 'Subterranean Natural Gas Line Fracture',
    description: 'Subterranean industrial gas pipeline breach. Explosive gas concentration at 68% LEL.',
    latitude: 17.6900,
    longitude: 83.2900,
    severity: 'CRITICAL',
    status: 'ACTIVE',
    dangerRadius: 220,
    estimatedPeopleAtRisk: 42,
    affectedPeopleCount: 42,
    assignedResources: ['FIRE-02', 'POLICE-01'],
    recommendedHospitalId: 'H002',
    safeZoneId: 'SAFE-002',
    lastUpdated: '2m ago',
    locationLabel: 'Gajuwaka Industrial Hub'
  },
  {
    incidentId: 'INC-003',
    id: 'INC-003',
    incidentType: 'FLOOD',
    title: 'River Basin Flash Inundation',
    description: 'Urban drainage breach causing rapid water accumulation along low-lying transit corridor.',
    latitude: 17.7167,
    longitude: 83.3000,
    severity: 'HIGH',
    status: 'ACTIVE',
    dangerRadius: 300,
    estimatedPeopleAtRisk: 110,
    affectedPeopleCount: 110,
    assignedResources: ['RESCUE-02', 'AMB-01'],
    recommendedHospitalId: 'H001',
    safeZoneId: 'SAFE-001',
    lastUpdated: '5m ago',
    locationLabel: 'RTC Complex Corridor'
  }
];

const MOCK_SAFE_ZONES: SafeZone[] = [
  {
    id: 'SAFE-001',
    name: 'Rushikonda Ground A (AP Assembly Point)',
    latitude: 17.7850,
    longitude: 83.3860,
    capacity: 500,
    occupancy: 120
  },
  {
    id: 'SAFE-002',
    name: 'Vizag Port Stadium Complex B',
    latitude: 17.6950,
    longitude: 83.2950,
    capacity: 1200,
    occupancy: 340
  }
];

const MOCK_RESOURCES: EmergencyResource[] = [
  {
    resourceId: 'FIRE-01',
    id: 'FIRE-01',
    name: 'Fire Truck 01 (Heavy Foam Engine)',
    type: 'FIRE_TRUCK',
    latitude: 17.7790,
    longitude: 83.3790,
    status: 'ON_SCENE',
    assignedIncident: 'INC-001',
    destination: 'INC-001 Commercial Fire Site',
    etaMinutes: 1,
    unitCode: 'ENG-101'
  },
  {
    resourceId: 'AMB-02',
    id: 'AMB-02',
    name: 'ALS Ambulance 02',
    type: 'AMBULANCE',
    latitude: 17.7780,
    longitude: 83.3750,
    status: 'EN_ROUTE',
    assignedIncident: 'INC-001',
    destination: 'INC-001 Commercial Fire Site',
    etaMinutes: 3,
    unitCode: 'AMB-202'
  },
  {
    resourceId: 'RESCUE-01',
    id: 'RESCUE-01',
    name: 'Tactical Rescue Team 01',
    type: 'RESCUE_TEAM',
    latitude: 17.7830,
    longitude: 83.3850,
    status: 'EN_ROUTE',
    assignedIncident: 'INC-001',
    destination: 'INC-001 Commercial Fire Site',
    etaMinutes: 4,
    unitCode: 'RSC-01'
  },
  {
    resourceId: 'AMB-01',
    id: 'AMB-01',
    name: 'Trauma Transport Unit 01',
    type: 'AMBULANCE',
    latitude: 17.7890,
    longitude: 83.3920,
    status: 'AVAILABLE',
    unitCode: 'AMB-101'
  },
  {
    resourceId: 'POLICE-01',
    id: 'POLICE-01',
    name: 'Traffic Control Interceptor 01',
    type: 'POLICE_VEHICLE',
    latitude: 17.6900,
    longitude: 83.2900,
    status: 'ON_SCENE',
    assignedIncident: 'INC-002',
    destination: 'Gas Leak Perimeter Cordon',
    etaMinutes: 0,
    unitCode: 'POL-01'
  }
];

const MOCK_HOSPITALS: Hospital[] = [
  {
    hospitalId: 'H001',
    id: 'H001',
    name: 'Apollo Health City (AP Trauma Center)',
    latitude: 17.7840,
    longitude: 83.3880,
    availableBeds: 42,
    icuAvailable: 8,
    traumaCare: true,
    burnUnit: true,
    traumaCapability: true,
    burnCapability: true,
    emergencyLoad: 65,
    occupancyRate: 65,
    status: 'AVAILABLE',
    lastUpdated: '1m ago'
  },
  {
    hospitalId: 'H002',
    id: 'H002',
    name: 'Visakhapatnam General Super Speciality Hospital',
    latitude: 17.7000,
    longitude: 83.3050,
    availableBeds: 18,
    icuAvailable: 2,
    traumaCare: true,
    burnUnit: false,
    traumaCapability: true,
    burnCapability: false,
    emergencyLoad: 88,
    occupancyRate: 88,
    status: 'SURGE',
    lastUpdated: '3m ago'
  }
];

const MOCK_SENSORS: IoTSensorNode[] = [
  {
    sensorId: 'NODE-001',
    id: 'NODE-001',
    sensorType: 'SMOKE',
    type: 'SMOKE',
    latitude: 17.7802,
    longitude: 83.3802,
    value: 850,
    unit: 'ppm',
    status: 'ALERT',
    lastUpdated: 'Just now',
    locationLabel: 'Building 4 Roof Sensor'
  },
  {
    sensorId: 'NODE-002',
    id: 'NODE-002',
    sensorType: 'TEMPERATURE',
    type: 'TEMPERATURE',
    latitude: 17.7795,
    longitude: 83.3805,
    value: 485,
    unit: '°C',
    status: 'ALERT',
    lastUpdated: 'Just now',
    locationLabel: 'Sub-level B2 Thermal Array'
  },
  {
    sensorId: 'NODE-003',
    id: 'NODE-003',
    sensorType: 'GAS',
    type: 'GAS',
    latitude: 17.6905,
    longitude: 83.2905,
    value: 68,
    unit: '% LEL',
    status: 'ALERT',
    lastUpdated: '1m ago',
    locationLabel: 'Pipeline Junction Node 12'
  },
  {
    sensorId: 'NODE-004',
    id: 'NODE-004',
    sensorType: 'WATER_LEVEL',
    type: 'WATER_LEVEL',
    latitude: 17.7170,
    longitude: 83.3010,
    value: 2.4,
    unit: 'meters',
    status: 'WARNING',
    lastUpdated: '2m ago',
    locationLabel: 'Storm Drain Radar Gauge'
  }
];

const MOCK_ROUTES: RoutePath[] = [
  {
    id: 'ROUTE-EVAC-01',
    type: 'EVACUATION',
    name: 'Primary Civilian Evacuation Corridor Alpha',
    coordinates: [
      { lat: 17.7800, lng: 83.3800 }, // Incident INC-001
      { lat: 17.7820, lng: 83.3830 }, // Outside Danger Zone
      { lat: 17.7835, lng: 83.3845 }, // Safe Bypass
      { lat: 17.7850, lng: 83.3860 }  // Safe Zone SAFE-001
    ],
    distanceKm: 0.65,
    estimatedTimeMins: 4,
    destinationLabel: 'SAFE-001 (Rushikonda Ground)',
    avoidsDangerZones: true
  },
  {
    id: 'ROUTE-RESCUE-01',
    type: 'RESCUE',
    name: 'Tactical Fire & Ambulance Dispatch Route',
    coordinates: [
      { lat: 17.7780, lng: 83.3750 }, // Ambulance Base
      { lat: 17.7790, lng: 83.3790 }, // Fire Truck Station
      { lat: 17.7800, lng: 83.3800 }, // INC-001
      { lat: 17.7840, lng: 83.3880 }  // Hospital H001
    ],
    distanceKm: 1.8,
    estimatedTimeMins: 3,
    destinationLabel: 'INC-001 → Apollo Hospital',
    avoidsDangerZones: true
  }
];

const MOCK_BLOCKED_ROADS: BlockedRoad[] = [
  {
    roadId: 'ROAD-17',
    roadName: 'Main Expressway Flyover Junction 17',
    status: 'BLOCKED',
    reason: 'FLOOD',
    coordinates: [
      { lat: 17.3830, lng: 78.4880 },
      { lat: 17.3840, lng: 78.4890 }
    ]
  }
];

// SERVICE API FUNCTIONS FOR FRONTEND & FUTURE BACKEND POSTGIS / SPRING BOOT / WEBSOCKET INTEGRATION
export const digitalTwinService = {
  getIncidents: async (): Promise<EmergencyIncident[]> => {
    // Future REST call: fetch('/api/incidents')
    return MOCK_INCIDENTS;
  },

  getResources: async (): Promise<EmergencyResource[]> => {
    // Future REST call: fetch('/api/resources')
    return MOCK_RESOURCES;
  },

  getHospitals: async (): Promise<Hospital[]> => {
    // Future REST call: fetch('/api/hospitals')
    return MOCK_HOSPITALS;
  },

  getSensors: async (): Promise<IoTSensorNode[]> => {
    // Future REST call: fetch('/api/sensors')
    return MOCK_SENSORS;
  },

  getSafeZones: async (): Promise<SafeZone[]> => {
    // Future REST call: fetch('/api/safe-zones')
    return MOCK_SAFE_ZONES;
  },

  getRoutes: async (): Promise<RoutePath[]> => {
    // Future REST call: fetch('/api/routes')
    return MOCK_ROUTES;
  },

  getBlockedRoads: async (): Promise<BlockedRoad[]> => {
    // Future REST call: fetch('/api/blocked-roads')
    return MOCK_BLOCKED_ROADS;
  }
};
