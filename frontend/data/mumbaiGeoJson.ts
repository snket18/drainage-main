// Mumbai GeoJSON Data Helper

import { MUMBAI_CENTER } from './mumbaiDrainageNetwork';

export interface HotspotData {
  id: string;
  name: string;
  coordinates: [number, number][]; // Polygon coords
  riskLevel: 'HIGH' | 'CRITICAL' | 'MODERATE';
}

export interface NodeMarkerData {
  id: string;
  coordinates: [number, number];
  name: string;
  type: string;
  depthCm: number;
}

export const MUMBAI_HOTSPOTS: HotspotData[] = [
  {
    id: 'hs-hindmata',
    name: 'Hindmata Underpass Basin',
    riskLevel: 'CRITICAL',
    coordinates: [
      [72.8400, 19.0140],
      [72.8450, 19.0140],
      [72.8450, 19.0180],
      [72.8400, 19.0180],
      [72.8400, 19.0140],
    ],
  },
  {
    id: 'hs-parel',
    name: 'Parel TT Lowlands',
    riskLevel: 'HIGH',
    coordinates: [
      [72.8380, 19.0120],
      [72.8410, 19.0120],
      [72.8410, 19.0150],
      [72.8380, 19.0150],
      [72.8380, 19.0120],
    ],
  },
];

export const MUMBAI_NODE_MARKERS: NodeMarkerData[] = [
  { id: 'mk-1', coordinates: [72.8427, 19.0163], name: 'Hindmata Flyover Underpass', type: 'critical_chokepoint', depthCm: 85 },
  { id: 'mk-2', coordinates: [72.8435, 19.0175], name: 'Parel Sump Station', type: 'pump_station', depthCm: 60 },
];

export function getMumbaiHotspotGeoJSON(): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: MUMBAI_HOTSPOTS.map((hotspot) => ({
      type: 'Feature',
      properties: {
        id: hotspot.id,
        name: hotspot.name,
        riskLevel: hotspot.riskLevel,
        fillColor: hotspot.riskLevel === 'CRITICAL' ? '#f43f5e' : '#fb923c',
        fillOpacity: hotspot.riskLevel === 'CRITICAL' ? 0.4 : 0.2,
        strokeColor: hotspot.riskLevel === 'CRITICAL' ? '#e11d48' : '#ea580c',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [hotspot.coordinates],
      },
    })),
  };
}
