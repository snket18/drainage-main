export const MUMBAI_CENTER: [number, number] = [72.8427, 19.0163];

export interface DrainageNodeData {
  id: string;
  coordinates: [number, number]; // [lng, lat]
  elevationM: number;
  maxCapacityLps: number;
  type: 'inlet' | 'manhole' | 'outfall' | 'pump_station';
  catchmentAreaSqM: number;
  name: string;
  linkedSensorId?: string;
  linkedCctvId?: string;
}

export interface DrainageEdgeData {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  diameterM: number;
  lengthM: number;
  slopePct: number;
  maxDischargeLps: number;
  name: string;
}

export interface RoadNode {
  id: string;
  coordinates: [number, number];
  elevationM: number;
}

export interface RoadSegment {
  id: string;
  sourceId: string;
  targetId: string;
  lanes: number;
  roadType: 'arterial' | 'local' | 'highway';
  distanceMeters: number;
  baseTravelTimeS: number;
}

export const MUMBAI_DRAINAGE_NODES: DrainageNodeData[] = [
  { id: 'DN_H1', coordinates: [72.8420, 19.0150], elevationM: 548, maxCapacityLps: 1500, type: 'inlet', catchmentAreaSqM: 1000, name: 'DN_H1' },
  { id: 'DN_H2', coordinates: [72.8425, 19.0158], elevationM: 547.5, maxCapacityLps: 2000, type: 'manhole', catchmentAreaSqM: 1000, name: 'DN_H2' },
  { id: 'DN_H3', coordinates: [72.8427, 19.0163], elevationM: 546.5, maxCapacityLps: 2500, type: 'manhole', catchmentAreaSqM: 1000, name: 'DN_H3', linkedSensorId: 'sn-h101', linkedCctvId: 'cam-h1' }, // Hindmata center
  { id: 'DN_H4', coordinates: [72.8435, 19.0175], elevationM: 545, maxCapacityLps: 3500, type: 'pump_station', catchmentAreaSqM: 1000, name: 'DN_H4' },
  { id: 'DN_H5', coordinates: [72.8450, 19.0190], elevationM: 544, maxCapacityLps: 5000, type: 'outfall', catchmentAreaSqM: 1000, name: 'DN_H5' },
];

export const MUMBAI_DRAINAGE_EDGES: DrainageEdgeData[] = [
  { id: 'E_H1', fromNodeId: 'DN_H1', toNodeId: 'DN_H2', diameterM: 0.6, lengthM: 200, slopePct: 0.5, maxDischargeLps: 1500, name: 'E_H1' },
  { id: 'E_H2', fromNodeId: 'DN_H2', toNodeId: 'DN_H3', diameterM: 0.8, lengthM: 150, slopePct: 0.8, maxDischargeLps: 2500, name: 'E_H2' },
  { id: 'E_H3', fromNodeId: 'DN_H3', toNodeId: 'DN_H4', diameterM: 1.2, lengthM: 300, slopePct: 0.4, maxDischargeLps: 4000, name: 'E_H3' },
  { id: 'E_H4', fromNodeId: 'DN_H4', toNodeId: 'DN_H5', diameterM: 1.5, lengthM: 400, slopePct: 0.2, maxDischargeLps: 6000, name: 'E_H4' },
];

export const MUMBAI_ROAD_NODES: RoadNode[] = [
  { id: 'RN_H1', coordinates: [72.8390, 19.0130], elevationM: 549 },
  { id: 'RN_H2', coordinates: [72.8410, 19.0145], elevationM: 548 },
  { id: 'RN_H3', coordinates: [72.8427, 19.0163], elevationM: 546 }, // Deepest part of Hindmata
  { id: 'RN_H4', coordinates: [72.8460, 19.0200], elevationM: 547 },
  { id: 'RN_H5', coordinates: [72.8360, 19.0160], elevationM: 550 }, // Elevated bypass node
  { id: 'RN_H6', coordinates: [72.8390, 19.0220], elevationM: 550 }, // Elevated bypass node
];

export const MUMBAI_ROAD_SEGMENTS: RoadSegment[] = [
  // Primary (Flooded)
  { id: 'RS_H1', sourceId: 'RN_H1', targetId: 'RN_H2', lanes: 3, roadType: 'arterial', distanceMeters: 300, baseTravelTimeS: 30 },
  { id: 'RS_H2', sourceId: 'RN_H2', targetId: 'RN_H3', lanes: 3, roadType: 'arterial', distanceMeters: 250, baseTravelTimeS: 25 },
  { id: 'RS_H3', sourceId: 'RN_H3', targetId: 'RN_H4', lanes: 3, roadType: 'arterial', distanceMeters: 400, baseTravelTimeS: 40 },
  
  // Safe Bypass (Dadar TT)
  { id: 'RS_H4', sourceId: 'RN_H1', targetId: 'RN_H5', lanes: 2, roadType: 'arterial', distanceMeters: 400, baseTravelTimeS: 40 },
  { id: 'RS_H5', sourceId: 'RN_H5', targetId: 'RN_H6', lanes: 2, roadType: 'arterial', distanceMeters: 600, baseTravelTimeS: 60 },
  { id: 'RS_H6', sourceId: 'RN_H6', targetId: 'RN_H4', lanes: 2, roadType: 'arterial', distanceMeters: 500, baseTravelTimeS: 50 },
];

export function getMithiRiverGeoJSON(): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Mithi River', type: 'primary_waterway' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [72.8790, 19.0700],
            [72.8796, 19.0728],
            [72.8800, 19.0760],
          ],
        },
      },
    ],
  };
}
