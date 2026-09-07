// Pune Shivajinagar Ward 14 Stormwater Network & Road Graph Data

export interface DrainageNodeData {
  id: string;
  name: string;
  type: 'INLET' | 'MANHOLE' | 'OUTFALL';
  coordinates: [number, number]; // [lng, lat]
  elevationMeters: number;
  invertLevelMeters: number;
  catchmentAreaSqM: number;
  maxCapacityLps: number; // liters per second
  linkedSensorId?: string;
  linkedCctvId?: string;
}

export interface DrainageEdgeData {
  id: string;
  name: string;
  fromNodeId: string;
  toNodeId: string;
  diameterMm: number;
  lengthMeters: number;
  slopePct: number;
  maxDischargeLps: number;
}

export interface RoadNode {
  id: string;
  name: string;
  coordinates: [number, number]; // [lng, lat]
}

export interface RoadSegment {
  id: string;
  name: string;
  fromNodeId: string;
  toNodeId: string;
  distanceMeters: number;
  normalSpeedKmh: number;
  isUnderpass: boolean;
  coordinates: [number, number][]; // LineString
}

export const PUNE_CENTER: [number, number] = [73.8567, 18.5204];

// Stormwater Network Nodes in Ward 14 Shivajinagar
export const PUNE_DRAINAGE_NODES: DrainageNodeData[] = [
  {
    id: 'N-01',
    name: 'Sancheti Circle Low-Lying Sump Inlet',
    type: 'INLET',
    coordinates: [73.8530, 18.5285],
    elevationMeters: 556.2,
    invertLevelMeters: 553.8,
    catchmentAreaSqM: 45000,
    maxCapacityLps: 850,
    linkedSensorId: 'S-01',
    linkedCctvId: 'CAM-01',
  },
  {
    id: 'N-02',
    name: 'FC Road Metro Gate 2 Arterial Manhole',
    type: 'MANHOLE',
    coordinates: [73.8425, 18.5240],
    elevationMeters: 559.4,
    invertLevelMeters: 557.1,
    catchmentAreaSqM: 32000,
    maxCapacityLps: 620,
    linkedSensorId: 'S-02',
    linkedCctvId: 'CAM-02',
  },
  {
    id: 'N-03',
    name: 'Lakaki Lake Overflow Collector',
    type: 'INLET',
    coordinates: [73.8375, 18.5315],
    elevationMeters: 562.1,
    invertLevelMeters: 560.0,
    catchmentAreaSqM: 28000,
    maxCapacityLps: 500,
    linkedSensorId: 'S-05',
    linkedCctvId: 'CAM-04',
  },
  {
    id: 'N-04',
    name: 'Deccan Gymkhana Outfall Sluice',
    type: 'OUTFALL',
    coordinates: [73.8450, 18.5170],
    elevationMeters: 554.8,
    invertLevelMeters: 552.5,
    catchmentAreaSqM: 52000,
    maxCapacityLps: 1100,
    linkedSensorId: 'S-03',
    linkedCctvId: 'CAM-03',
  },
  {
    id: 'N-05',
    name: 'Dengle Bridge Mutha Outfall Gate',
    type: 'OUTFALL',
    coordinates: [73.8580, 18.5330],
    elevationMeters: 553.0,
    invertLevelMeters: 550.5,
    catchmentAreaSqM: 60000,
    maxCapacityLps: 1400,
  },
  {
    id: 'N-06',
    name: 'JM Road Temple Feeder Manhole',
    type: 'MANHOLE',
    coordinates: [73.8490, 18.5260],
    elevationMeters: 557.5,
    invertLevelMeters: 555.2,
    catchmentAreaSqM: 38000,
    maxCapacityLps: 700,
  },
];

// Stormwater Pipe Edges Connecting Nodes
export const PUNE_DRAINAGE_EDGES: DrainageEdgeData[] = [
  {
    id: 'E-01',
    name: 'FC Road Feeder Pipe',
    fromNodeId: 'N-02',
    toNodeId: 'N-06',
    diameterMm: 900,
    lengthMeters: 750,
    slopePct: 0.44,
    maxDischargeLps: 600,
  },
  {
    id: 'E-02',
    name: 'JM Road Trunk Line A',
    fromNodeId: 'N-06',
    toNodeId: 'N-01',
    diameterMm: 1200,
    lengthMeters: 520,
    slopePct: 0.38,
    maxDischargeLps: 900,
  },
  {
    id: 'E-03',
    name: 'Sancheti to Mutha Outfall Main Pipe',
    fromNodeId: 'N-01',
    toNodeId: 'N-05',
    diameterMm: 1500,
    lengthMeters: 680,
    slopePct: 0.48,
    maxDischargeLps: 1200,
  },
  {
    id: 'E-04',
    name: 'Lakaki Basin Overflow Conduit',
    fromNodeId: 'N-03',
    toNodeId: 'N-06',
    diameterMm: 800,
    lengthMeters: 1100,
    slopePct: 0.52,
    maxDischargeLps: 450,
  },
  {
    id: 'E-05',
    name: 'Deccan Gymkhana Relief Line',
    fromNodeId: 'N-06',
    toNodeId: 'N-04',
    diameterMm: 1000,
    lengthMeters: 1050,
    slopePct: 0.35,
    maxDischargeLps: 750,
  },
];

// Emergency Transit Road Network Graph
export const PUNE_ROAD_NODES: RoadNode[] = [
  { id: 'RN-1', name: 'University Circle / Model Colony Junction', coordinates: [73.8340, 18.5360] },
  { id: 'RN-2', name: 'FC Road Metro Gate 1', coordinates: [73.8425, 18.5240] },
  { id: 'RN-3', name: 'Sancheti Circle Junction', coordinates: [73.8530, 18.5285] },
  { id: 'RN-4', name: 'Deccan Gymkhana Bus Stop', coordinates: [73.8450, 18.5170] },
  { id: 'RN-5', name: 'Shivajinagar Railway Station Gate', coordinates: [73.8540, 18.5310] },
  { id: 'RN-6', name: 'COEP Engineering Flyover', coordinates: [73.8570, 18.5290] },
];

export const PUNE_ROAD_SEGMENTS: RoadSegment[] = [
  {
    id: 'RS-01',
    name: 'Sancheti Underpass Main Arterial',
    fromNodeId: 'RN-2',
    toNodeId: 'RN-3',
    distanceMeters: 1200,
    normalSpeedKmh: 40,
    isUnderpass: true,
    coordinates: [
      [73.8425, 18.5240],
      [73.8490, 18.5260],
      [73.8530, 18.5285],
    ],
  },
  {
    id: 'RS-02',
    name: 'FC Road Bypass to Shivajinagar Flyover',
    fromNodeId: 'RN-2',
    toNodeId: 'RN-5',
    distanceMeters: 1650,
    normalSpeedKmh: 45,
    isUnderpass: false,
    coordinates: [
      [73.8425, 18.5240],
      [73.8410, 18.5290],
      [73.8480, 18.5330],
      [73.8540, 18.5310],
    ],
  },
  {
    id: 'RS-03',
    name: 'Sancheti to COEP Flyover Connection',
    fromNodeId: 'RN-3',
    toNodeId: 'RN-6',
    distanceMeters: 550,
    normalSpeedKmh: 35,
    isUnderpass: false,
    coordinates: [
      [73.8530, 18.5285],
      [73.8570, 18.5290],
    ],
  },
  {
    id: 'RS-04',
    name: 'Shivajinagar Station to COEP Flyover',
    fromNodeId: 'RN-5',
    toNodeId: 'RN-6',
    distanceMeters: 400,
    normalSpeedKmh: 40,
    isUnderpass: false,
    coordinates: [
      [73.8540, 18.5310],
      [73.8570, 18.5290],
    ],
  },
];

export function getMuthaRiverGeoJSON(): GeoJSON.FeatureCollection {
  const muthaCenterLine: [number, number][] = [
    [73.8310, 18.5040],
    [73.8370, 18.5100],
    [73.8440, 18.5170],
    [73.8500, 18.5240],
    [73.8560, 18.5295],
    [73.8630, 18.5350],
    [73.8710, 18.5410],
  ];

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Mutha River Channel Corridor', status: 'NORMAL', type: 'river-line' },
        geometry: { type: 'LineString', coordinates: muthaCenterLine },
      },
    ],
  };
}
