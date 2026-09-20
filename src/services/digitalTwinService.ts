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
    incidentType: 'FIRE',
    title: 'Commercial Building Structure Fire',
    description: '485°C thermal surge on floor 4 with chemical storage tanks. 25 people trapped on upper floors.',
    latitude: 17.3850,
    longitude: 78.4867,
    severity: 'CRITICAL',
    status: 'ACTIVE',
    dangerRadius: 150,
    estimatedPeopleAtRisk: 25,
    assignedResources: ['AMB-02', 'FIRE-01', 'RESCUE-01'],
    recommendedHospitalId: 'H001',
    safeZoneId: 'SAFE-001',
    lastUpdated: 'Just now'
  },
  {
    incidentId: 'INC-002',
    incidentType: 'GAS_LEAK',
    title: 'Subterranean Natural Gas Line Fracture',
    description: 'Subterranean industrial gas pipeline breach. Explosive gas concentration at 68% LEL.',
    latitude: 17.3910,
    longitude: 78.4810,
    severity: 'CRITICAL',
    status: 'ACTIVE',
    dangerRadius: 220,
    estimatedPeopleAtRisk: 42,
    assignedResources: ['FIRE-02', 'POLICE-01'],
    recommendedHospitalId: 'H002',
    safeZoneId: 'SAFE-002',
    lastUpdated: '2m ago'
  },
  {
    incidentId: 'INC-003',
    incidentType: 'FLOOD',
    title: 'River Basin Flash Inundation',
    description: 'Urban drainage breach causing rapid water accumulation along low-lying transit corridor.',
    latitude: 17.3780,
    longitude: 78.4950,
    severity: 'HIGH',
    status: 'ACTIVE',
    dangerRadius: 300,
    estimatedPeopleAtRisk: 110,
    assignedResources: ['RESCUE-02', 'AMB-01'],
    recommendedHospitalId: 'H001',
    safeZoneId: 'SAFE-001',
    lastUpdated: '5m ago'
  }
];

const MOCK_SAFE_ZONES: SafeZone[] = [
  {
    id: 'SAFE-001',
    name: 'Open Ground A (Central Assembly Point)',
    latitude: 17.3880,
    longitude: 78.4900,
    capacity: 500,
    occupancy: 120
  },
  {
    id: 'SAFE-002',
    name: 'Stadium Shelter Complex B',
    latitude: 17.3950,
    longitude: 78.4750,
    capacity: 1200,
    occupancy: 340
  }
];

const MOCK_RESOURCES: EmergencyResource[] = [
  {
    resourceId: 'FIRE-01',
    name: 'Fire Truck 01 (Heavy Foam Engine)',
    type: 'FIRE_TRUCK',
    latitude: 17.3835,
    longitude: 78.4845,
    status: 'ON_SCENE',
    assignedIncident: 'INC-001',
    destination: 'INC-001 Commercial Fire Site',
    etaMinutes: 1,
    unitCode: 'ENG-101'
  },
  {
    resourceId: 'AMB-02',
    name: 'ALS Ambulance 02',
    type: 'AMBULANCE',
    latitude: 17.3820,
    longitude: 78.4800,
    status: 'EN_ROUTE',
    assignedIncident: 'INC-001',
    destination: 'INC-001 Commercial Fire Site',
    etaMinutes: 3,
    unitCode: 'AMB-202'
  },
  {
    resourceId: 'RESCUE-01',
    name: 'Tactical Rescue Team 01',
    type: 'RESCUE_TEAM',
    latitude: 17.3810,
    longitude: 78.4890,
    status: 'EN_ROUTE',
    assignedIncident: 'INC-001',
    destination: 'INC-001 Commercial Fire Site',
    etaMinutes: 4,
    unitCode: 'RSC-01'
  },
  {
    resourceId: 'AMB-01',
    name: 'Trauma Transport Unit 01',
    type: 'AMBULANCE',
    latitude: 17.3890,
    longitude: 78.4920,
    status: 'AVAILABLE',
    unitCode: 'AMB-101'
  },
  {
    resourceId: 'POLICE-01',
    name: 'Traffic Control Interceptor 01',
    type: 'POLICE_VEHICLE',
    latitude: 17.3900,
    longitude: 78.4820,
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
    name: 'Emergency Hospital Central',
    latitude: 17.3900,
    longitude: 78.4800,
    availableBeds: 42,
    icuAvailable: 8,
    traumaCare: true,
    burnUnit: true,
    emergencyLoad: 65,
    status: 'AVAILABLE',
    lastUpdated: '1m ago'
  },
  {
    hospitalId: 'H002',
    name: 'Metro Regional Super Speciality Hospital',
    latitude: 17.3970,
    longitude: 78.4920,
    availableBeds: 18,
    icuAvailable: 2,
    traumaCare: true,
    burnUnit: false,
    emergencyLoad: 88,
    status: 'SURGE',
    lastUpdated: '3m ago'
  }
];

const MOCK_SENSORS: IoTSensorNode[] = [
  {
    sensorId: 'NODE-001',
    sensorType: 'SMOKE',
    latitude: 17.3845,
    longitude: 78.4870,
    value: 850,
    unit: 'ppm',
    status: 'ALERT',
    lastUpdated: 'Just now',
    locationLabel: 'Building 4 Roof Sensor'
  },
  {
    sensorId: 'NODE-002',
    sensorType: 'TEMPERATURE',
    latitude: 17.3852,
    longitude: 78.4865,
    value: 485,
    unit: '°C',
    status: 'ALERT',
    lastUpdated: 'Just now',
    locationLabel: 'Sub-level B2 Thermal Array'
  },
  {
    sensorId: 'NODE-003',
    sensorType: 'GAS',
    latitude: 17.3908,
    longitude: 78.4812,
    value: 68,
    unit: '% LEL',
    status: 'ALERT',
    lastUpdated: '1m ago',
    locationLabel: 'Pipeline Junction Node 12'
  },
  {
    sensorId: 'NODE-004',
    sensorType: 'WATER_LEVEL',
    latitude: 17.3782,
    longitude: 78.4948,
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
      { lat: 17.3850, lng: 78.4867 }, // Incident INC-001
      { lat: 17.3862, lng: 78.4880 }, // Outside Danger Zone
      { lat: 17.3875, lng: 78.4892 }, // Safe Bypass
      { lat: 17.3880, lng: 78.4900 }  // Safe Zone SAFE-001
    ],
    distanceKm: 0.65,
    estimatedTimeMins: 4,
    destinationLabel: 'SAFE-001 (Open Ground A)',
    avoidsDangerZones: true
  },
  {
    id: 'ROUTE-RESCUE-01',
    type: 'RESCUE',
    name: 'Tactical Fire & Ambulance Dispatch Route',
    coordinates: [
      { lat: 17.3820, lng: 78.4800 }, // Ambulance Base
      { lat: 17.3835, lng: 78.4845 }, // Fire Truck Station
      { lat: 17.3850, lng: 78.4867 }, // INC-001
      { lat: 17.3900, lng: 78.4800 }  // Hospital H001
    ],
    distanceKm: 1.8,
    estimatedTimeMins: 3,
    destinationLabel: 'INC-001 → Hospital H001',
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
