export interface BuildingProperty {
  id: string;
  name: string;
  building_type: string;
  height: number;
  min_height: number;
  building_levels: number;
  status: 'NORMAL' | 'AT_RISK' | 'AFFECTED' | 'DANGEROUS' | 'UNKNOWN';
}

// Procedural generator to populate dense urban grid around Hyderabad center
function generateCityBuildingsGeoJSON(): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];

  // 1. Key Named City Landmark Buildings
  const landmarks = [
    {
      id: 'BLD-INCIDENT-001',
      name: 'Charminar Commercial Complex (Incident Site)',
      type: 'commercial',
      height: 65,
      levels: 18,
      status: 'AFFECTED' as const,
      coords: [78.4865, 17.3848, 0.0006, 0.0005]
    },
    {
      id: 'BLD-HQ-001',
      name: 'Hyderabad Command & Operations HQ',
      type: 'civic',
      height: 120,
      levels: 32,
      status: 'NORMAL' as const,
      coords: [78.4852, 17.3856, 0.0007, 0.0006]
    },
    {
      id: 'BLD-HOSP-001',
      name: 'Hyderabad Emergency Hospital Tower',
      type: 'hospital',
      height: 85,
      levels: 22,
      status: 'NORMAL' as const,
      coords: [78.4892, 17.3853, 0.0008, 0.0006]
    },
    {
      id: 'BLD-SAFE-001',
      name: 'Open Ground A Evacuation Center',
      type: 'civic',
      height: 25,
      levels: 6,
      status: 'NORMAL' as const,
      coords: [78.4832, 17.3872, 0.0009, 0.0007]
    },
    {
      id: 'BLD-TECH-001',
      name: 'Cyber Towers Tech Hub Alpha',
      type: 'office',
      height: 140,
      levels: 38,
      status: 'AT_RISK' as const,
      coords: [78.4876, 17.3862, 0.0008, 0.0007]
    },
    {
      id: 'BLD-TECH-002',
      name: 'Cyber Towers Tech Hub Beta',
      type: 'office',
      height: 115,
      levels: 30,
      status: 'AT_RISK' as const,
      coords: [78.4885, 17.3860, 0.0007, 0.0006]
    },
    {
      id: 'BLD-MALL-001',
      name: 'Metro Mega Mall & Cinema',
      type: 'commercial',
      height: 45,
      levels: 10,
      status: 'AT_RISK' as const,
      coords: [78.4858, 17.3840, 0.0008, 0.0007]
    }
  ];

  landmarks.forEach(lm => {
    const [minLng, minLat, sizeLng, sizeLat] = lm.coords;
    features.push({
      type: 'Feature',
      properties: {
        id: lm.id,
        name: lm.name,
        building_type: lm.type,
        height: lm.height,
        min_height: 0,
        building_levels: lm.levels,
        status: lm.status
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [minLng, minLat],
          [minLng + sizeLng, minLat],
          [minLng + sizeLng, minLat + sizeLat],
          [minLng, minLat + sizeLat],
          [minLng, minLat]
        ]]
      }
    });
  });

  // 2. Dense Urban Grid Generator (120+ Building Footprints)
  const gridRows = 12;
  const gridCols = 12;
  const startLng = 78.4800;
  const startLat = 17.3800;
  const stepLng = 0.0012;
  const stepLat = 0.0010;

  let bldCounter = 100;

  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      bldCounter++;

      // Skip areas close to landmarks to avoid overlap
      const centerLng = startLng + c * stepLng + 0.0003;
      const centerLat = startLat + r * stepLat + 0.0003;

      const distToIncident = Math.hypot(centerLng - 78.4867, centerLat - 17.3850);

      // Skip exact landmark center overlap
      if (distToIncident < 0.0004) continue;

      const width = 0.0004 + (Math.sin(r * 3 + c) * 0.00015);
      const height = 0.00035 + (Math.cos(r + c * 2) * 0.00012);

      // Height variation based on distance from city center & pseudo-random variation
      const buildingLevels = Math.max(4, Math.floor(25 - distToIncident * 1200 + (Math.sin(r * c) * 10)));
      const buildingHeight = buildingLevels * 3.5;

      let status: 'NORMAL' | 'AT_RISK' | 'AFFECTED' | 'DANGEROUS' = 'NORMAL';
      if (distToIncident < 0.0012) {
        status = 'AT_RISK';
      }
      if (distToIncident < 0.0006) {
        status = 'AFFECTED';
      }

      const types = ['commercial', 'residential', 'office', 'civic', 'apartments'];
      const buildingType = types[(r + c) % types.length];

      features.push({
        type: 'Feature',
        properties: {
          id: `BLD-GRID-${bldCounter}`,
          name: `City Block ${r + 1}-${c + 1} (${buildingType.toUpperCase()})`,
          building_type: buildingType,
          height: buildingHeight,
          min_height: 0,
          building_levels: buildingLevels,
          status
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

  return {
    type: 'FeatureCollection',
    features
  };
}

export const cityBuildingsData: GeoJSON.FeatureCollection = generateCityBuildingsGeoJSON();
