export interface BuildingProperty {
  id: string;
  name: string;
  building_type: string;
  height: number;
  min_height: number;
  building_levels: number;
  status: 'NORMAL' | 'AT_RISK' | 'AFFECTED' | 'DANGEROUS' | 'UNKNOWN';
}

// Procedural generator to populate 3D building footprints across all major urban & emergency hubs in Andhra Pradesh
function generateCityBuildingsGeoJSON(): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];

  // 1. Key Named City Landmark Buildings across Andhra Pradesh
  const landmarks = [
    // Visakhapatnam Hub
    {
      id: 'BLD-INCIDENT-001',
      name: 'Charminar Commercial Complex (Incident Site)',
      type: 'commercial',
      height: 65,
      levels: 18,
      status: 'AFFECTED' as const,
      coords: [83.3798, 17.7798, 0.0006, 0.0005]
    },
    {
      id: 'BLD-HQ-001',
      name: 'Andhra Pradesh EOC Command HQ',
      type: 'civic',
      height: 120,
      levels: 32,
      status: 'NORMAL' as const,
      coords: [83.3780, 17.7810, 0.0007, 0.0006]
    },
    {
      id: 'BLD-HOSP-001',
      name: 'AP State Emergency Care Hospital Tower',
      type: 'hospital',
      height: 85,
      levels: 22,
      status: 'NORMAL' as const,
      coords: [83.3820, 17.7790, 0.0006, 0.0006]
    },
    {
      id: 'BLD-HAZMAT-001',
      name: 'Hazardous Chemical Storage B2',
      type: 'industrial',
      height: 40,
      levels: 10,
      status: 'DANGEROUS' as const,
      coords: [83.3805, 17.7795, 0.0005, 0.0004]
    },
    {
      id: 'BLD-PORT-001',
      name: 'Vizag Port Logistics Center',
      type: 'civic',
      height: 95,
      levels: 26,
      status: 'AT_RISK' as const,
      coords: [83.3770, 17.7820, 0.0008, 0.0007]
    },

    // Vijayawada Hub
    {
      id: 'BLD-VJA-001',
      name: 'Vijayawada Central Transit Terminal',
      type: 'civic',
      height: 75,
      levels: 20,
      status: 'AFFECTED' as const,
      coords: [80.6480, 16.5062, 0.0008, 0.0007]
    },
    {
      id: 'BLD-VJA-002',
      name: 'AP State Data Center Vijayawada',
      type: 'office',
      height: 110,
      levels: 28,
      status: 'NORMAL' as const,
      coords: [80.6510, 16.5080, 0.0007, 0.0006]
    },

    // Tirupati Hub
    {
      id: 'BLD-TPT-001',
      name: 'SVIMS Super Speciality Medical Complex',
      type: 'hospital',
      height: 90,
      levels: 24,
      status: 'NORMAL' as const,
      coords: [79.4080, 13.6380, 0.0007, 0.0007]
    },

    // Guntur Hub
    {
      id: 'BLD-GNT-001',
      name: 'Guntur Industrial Cold Storage Complex',
      type: 'industrial',
      height: 55,
      levels: 14,
      status: 'AT_RISK' as const,
      coords: [80.4365, 16.3067, 0.0008, 0.0006]
    }
  ];

  landmarks.forEach(bld => {
    const [centerLng, centerLat, width, height] = bld.coords;
    features.push({
      type: 'Feature',
      properties: {
        id: bld.id,
        name: bld.name,
        building_type: bld.type,
        height: bld.height,
        min_height: 0,
        building_levels: bld.levels,
        status: bld.status
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [centerLng, centerLat],
          [centerLng + width, centerLat],
          [centerLng + width, centerLat + height],
          [centerLng, centerLat + height],
          [centerLng, centerLat]
        ]]
      }
    });
  });

  // 2. Regional 3D Building Grid Clusters across major Andhra Pradesh regions
  const regionalCenters = [
    { name: 'Visakhapatnam Rushikonda', startLng: 83.3600, startLat: 17.7600, rows: 15, cols: 15 },
    { name: 'Visakhapatnam Port', startLng: 83.2750, startLat: 17.6750, rows: 10, cols: 10 },
    { name: 'Vijayawada Central', startLng: 80.6300, startLat: 16.4900, rows: 12, cols: 12 },
    { name: 'Guntur Industrial', startLng: 80.4200, startLat: 16.2900, rows: 10, cols: 10 },
    { name: 'Tirupati Alipiri', startLng: 79.4000, startLat: 13.6200, rows: 10, cols: 10 },
    { name: 'Kurnool Junction', startLng: 78.0200, startLat: 15.8100, rows: 8, cols: 8 },
    { name: 'Nellore Delta', startLng: 79.9700, startLat: 14.4300, rows: 8, cols: 8 },
    { name: 'Kakinada Coast', startLng: 82.2300, startLat: 16.9700, rows: 8, cols: 8 }
  ];

  let bldCounter = 100;

  regionalCenters.forEach(center => {
    const stepLng = 0.0018;
    const stepLat = 0.0015;

    for (let r = 0; r < center.rows; r++) {
      for (let c = 0; c < center.cols; c++) {
        bldCounter++;

        const centerLng = center.startLng + c * stepLng + 0.0003;
        const centerLat = center.startLat + r * stepLat + 0.0003;

        const width = 0.0004 + (Math.sin(r * 3 + c) * 0.00015);
        const height = 0.00035 + (Math.cos(r + c * 2) * 0.00012);

        const buildingLevels = Math.max(3, Math.floor(18 + Math.sin(r * c + bldCounter) * 8));
        const buildingHeight = buildingLevels * 3.5;

        const types = ['commercial', 'residential', 'office', 'civic', 'apartments'];
        const buildingType = types[(r + c) % types.length];

        features.push({
          type: 'Feature',
          properties: {
            id: `BLD-${bldCounter}`,
            name: `${center.name} Block ${r + 1}-${c + 1}`,
            building_type: buildingType,
            height: buildingHeight,
            min_height: 0,
            building_levels: buildingLevels,
            status: 'NORMAL'
          },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [centerLng, centerLat],
              [centerLng + width, centerLat],
              [centerLng + width, centerLat + height],
              [centerLng, centerLat + height],
              [centerLng, centerLat]
            ]]
          }
        });
      }
    }
  });

  return {
    type: 'FeatureCollection',
    features
  };
}

export const cityBuildingsData: GeoJSON.FeatureCollection = generateCityBuildingsGeoJSON();
