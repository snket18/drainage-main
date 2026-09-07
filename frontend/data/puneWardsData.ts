// Pune Wards & Major Flood-Sensitive Transit Hubs Dataset

export interface ChokePoint {
  name: string;
  coords: [number, number]; // [lng, lat]
  depthCm: number;
  description: string;
}

export interface PuneWardArea {
  id: string;
  name: string;
  ward: string;
  center: [number, number]; // [lng, lat]
  zoom: number;
  pitch: number;
  rainfallMmHr: number;
  floodProbabilityPct: number;
  predictedWaterDepthCm: number;
  surchargeStatus: 'NORMAL' | 'SURCHARGE' | 'BACKFLOW';
  drainageCapacityPct: number;
  criticalNodes: string[];
  chokePoints: ChokePoint[];
  warningMessage: string;
  originCoords: [number, number]; // [lng, lat] Point A
  destinationCoords: [number, number]; // [lng, lat] Point B
  etaNormalMins: number;
  etaBypassMins: number;
  bypassAdvice: string;
  floodedRouteGeoJSON: GeoJSON.FeatureCollection;
  safeBypassGeoJSON: GeoJSON.FeatureCollection;
}

export const PUNE_WARDS_DATA: PuneWardArea[] = [
  {
    id: 'shivajinagar',
    name: 'Shivajinagar',
    ward: 'Ward 14',
    center: [73.8567, 18.5204],
    zoom: 15,
    pitch: 40,
    rainfallMmHr: 82,
    floodProbabilityPct: 92,
    predictedWaterDepthCm: 42,
    surchargeStatus: 'BACKFLOW',
    drainageCapacityPct: 94,
    criticalNodes: ['Sancheti Circle Underpass', 'Wakdewadi Subway', 'JM Road Sump'],
    chokePoints: [
      {
        name: 'Sancheti Circle Underpass',
        coords: [73.8532, 18.5284],
        depthCm: 42,
        description: 'Road Submerged - Do Not Enter (42 cm water depth)',
      },
    ],
    warningMessage: 'Sancheti Circle subway severely inundated. Emergency rerouting via FC Road required.',
    originCoords: [73.8475, 18.5220],
    destinationCoords: [73.8560, 18.5315],
    etaNormalMins: 8,
    etaBypassMins: 11,
    bypassAdvice: 'Bypass via FC Road & Shivaji Nagar Flyover avoids submerged Sancheti Underpass.',
    floodedRouteGeoJSON: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { status: 'blocked', name: 'JM Road Submerged Corridor' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [73.8475, 18.5220], // Point A (Origin)
              [73.8505, 18.5255], // Approaching underpass
              [73.8532, 18.5284], // Sancheti Circle Underpass (CRITICAL CHOKEPOINT)
              [73.8560, 18.5315], // Point B (Destination)
            ],
          },
        },
      ],
    },
    safeBypassGeoJSON: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { status: 'safe', name: 'FC Road Flyover Bypass' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [73.8475, 18.5220], // Point A (Origin)
              [73.8420, 18.5240], // Divert left onto FC Road
              [73.8445, 18.5290], // Follow elevated avenue
              [73.8490, 18.5335], // Cross via Shivaji Nagar Flyover
              [73.8560, 18.5315], // Point B (Destination reconnect)
            ],
          },
        },
      ],
    },
  },
  {
    id: 'swargate',
    name: 'Swargate Hub',
    ward: 'Ward 19',
    center: [73.8580, 18.5018],
    zoom: 15,
    pitch: 40,
    rainfallMmHr: 68,
    floodProbabilityPct: 78,
    predictedWaterDepthCm: 34,
    surchargeStatus: 'SURCHARGE',
    drainageCapacityPct: 88,
    criticalNodes: ['Jedhe Chowk Underpass', 'Satara Road Sump', 'Swargate MSRTC Stand'],
    chokePoints: [
      {
        name: 'Jedhe Chowk Underpass',
        coords: [73.8580, 18.5018],
        depthCm: 34,
        description: 'Submerged Grade Separator (34 cm standing water)',
      },
    ],
    warningMessage: 'Jedhe Chowk underpass waterlogged. Use elevated Market Yard flyover bypass.',
    originCoords: [73.8550, 18.4970],
    destinationCoords: [73.8610, 18.5060],
    etaNormalMins: 12,
    etaBypassMins: 16,
    bypassAdvice: 'Take Shankar Sheth Road elevated flyover bypass around Jedhe Chowk underpass.',
    floodedRouteGeoJSON: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { status: 'blocked', name: 'Direct Satara Road Grade Separator' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [73.8550, 18.4970],
              [73.8580, 18.5018],
              [73.8610, 18.5060],
            ],
          },
        },
      ],
    },
    safeBypassGeoJSON: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { status: 'safe', name: 'Shankar Sheth Elevated Bypass Corridor' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [73.8550, 18.4970],
              [73.8620, 18.4990],
              [73.8650, 18.5040],
              [73.8610, 18.5060],
            ],
          },
        },
      ],
    },
  },
  {
    id: 'deccan',
    name: 'Deccan Gymkhana',
    ward: 'Ward 15',
    center: [73.8450, 18.5170],
    zoom: 15,
    pitch: 40,
    rainfallMmHr: 45,
    floodProbabilityPct: 62,
    predictedWaterDepthCm: 24,
    surchargeStatus: 'SURCHARGE',
    drainageCapacityPct: 76,
    criticalNodes: ['Pulachiwadi Riverbank', 'Z-Bridge Sluice', 'Goodluck Chowk'],
    chokePoints: [
      {
        name: 'Pulachiwadi Causeway',
        coords: [73.8450, 18.5170],
        depthCm: 24,
        description: 'Riverbank Backflow Impassable (24 cm water depth)',
      },
    ],
    warningMessage: 'Mutha River water level elevated near Z-Bridge outfall. Drive cautiously.',
    originCoords: [73.8400, 18.5140],
    destinationCoords: [73.8490, 18.5190],
    etaNormalMins: 10,
    etaBypassMins: 13,
    bypassAdvice: 'Use Karve Road elevated flyover bypass around Pulachiwadi riverbank causeway.',
    floodedRouteGeoJSON: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { status: 'blocked', name: 'Pulachiwadi Riverbank Low Causeway' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [73.8400, 18.5140],
              [73.8450, 18.5170],
              [73.8490, 18.5190],
            ],
          },
        },
      ],
    },
    safeBypassGeoJSON: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { status: 'safe', name: 'Karve Road Elevated Bypass' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [73.8400, 18.5140],
              [73.8410, 18.5180],
              [73.8470, 18.5210],
              [73.8490, 18.5190],
            ],
          },
        },
      ],
    },
  },
  {
    id: 'sinhagad',
    name: 'Sinhagad Road',
    ward: 'Ward 18',
    center: [73.8290, 18.4850],
    zoom: 15,
    pitch: 40,
    rainfallMmHr: 74,
    floodProbabilityPct: 85,
    predictedWaterDepthCm: 38,
    surchargeStatus: 'BACKFLOW',
    drainageCapacityPct: 91,
    criticalNodes: ['Ekta Nagar Housing Basin', 'Rajaram Bridge Outfall', 'Pu La Deshpande Garden Sump'],
    chokePoints: [
      {
        name: 'Ekta Nagar Nullah Dip',
        coords: [73.8290, 18.4850],
        depthCm: 38,
        description: 'Nullah Backflow Inundation (38 cm water depth)',
      },
    ],
    warningMessage: 'Khadakwasla Dam release causing river backflow into Ekta Nagar nullah.',
    originCoords: [73.8240, 18.4800],
    destinationCoords: [73.8340, 18.4900],
    etaNormalMins: 15,
    etaBypassMins: 19,
    bypassAdvice: 'Use Sun City Flyover bypass to avoid Ekta Nagar riverbank nullah depression.',
    floodedRouteGeoJSON: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { status: 'blocked', name: 'Sinhagad Road Ekta Nagar Dip' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [73.8240, 18.4800],
              [73.8290, 18.4850],
              [73.8340, 18.4900],
            ],
          },
        },
      ],
    },
    safeBypassGeoJSON: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { status: 'safe', name: 'Sun City Elevated Bypass' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [73.8240, 18.4800],
              [73.8260, 18.4890],
              [73.8320, 18.4920],
              [73.8340, 18.4900],
            ],
          },
        },
      ],
    },
  },
];
