// Mumbai Wards & Major Flood-Sensitive Transit Hubs Dataset

export interface ChokePoint {
  name: string;
  coords: [number, number]; // [lng, lat]
  depthCm: number;
  description: string;
}

export interface MumbaiWardArea {
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

export const MUMBAI_WARDS_DATA: MumbaiWardArea[] = [
  {
    id: 'hindmata',
    name: 'Hindmata, Dadar',
    ward: 'F/South Ward',
    center: [72.8427, 19.0163],
    zoom: 15,
    pitch: 40,
    rainfallMmHr: 112,
    floodProbabilityPct: 98,
    predictedWaterDepthCm: 85,
    surchargeStatus: 'BACKFLOW',
    drainageCapacityPct: 99,
    criticalNodes: ['Hindmata Flyover Underpass', 'Parel TT Sump', 'Dr. Ambedkar Road Drain'],
    chokePoints: [
      {
        name: 'Hindmata Underpass',
        coords: [72.8427, 19.0163],
        depthCm: 85,
        description: 'Road Submerged - Do Not Enter (85 cm water depth)',
      },
    ],
    warningMessage: 'Hindmata underpass severely inundated due to high tide lock. Emergency rerouting via Dadar TT required.',
    originCoords: [72.8390, 19.0130],
    destinationCoords: [72.8460, 19.0200],
    etaNormalMins: 15,
    etaBypassMins: 22,
    bypassAdvice: 'Bypass via Dadar TT & Naigaon Cross Road avoids submerged Hindmata stretch.',
    floodedRouteGeoJSON: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { status: 'blocked', name: 'Dr. Ambedkar Road Submerged Corridor' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [72.8390, 19.0130], // Point A (Origin)
              [72.8410, 19.0145], // Approaching underpass
              [72.8427, 19.0163], // Hindmata Underpass (CRITICAL CHOKEPOINT)
              [72.8460, 19.0200], // Point B (Destination)
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
          properties: { status: 'safe', name: 'Dadar TT Flyover Bypass' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [72.8390, 19.0130], // Point A (Origin)
              [72.8360, 19.0160], // Divert left onto Senapati Bapat Marg
              [72.8390, 19.0220], // Follow elevated avenue
              [72.8440, 19.0230], // Cross via Dadar TT Flyover
              [72.8460, 19.0200], // Point B (Destination reconnect)
            ],
          },
        },
      ],
    },
  },
  {
    id: 'andheri',
    name: 'Andheri Subway',
    ward: 'K/West Ward',
    center: [72.8466, 19.1197],
    zoom: 15,
    pitch: 40,
    rainfallMmHr: 95,
    floodProbabilityPct: 88,
    predictedWaterDepthCm: 110,
    surchargeStatus: 'SURCHARGE',
    drainageCapacityPct: 92,
    criticalNodes: ['Subway Grade Separator', 'SV Road Junction', 'Mogra Nullah'],
    chokePoints: [
      {
        name: 'Andheri Subway',
        coords: [72.8466, 19.1197],
        depthCm: 110,
        description: 'Subway completely submerged (110 cm standing water)',
      },
    ],
    warningMessage: 'Andheri Subway closed for vehicular traffic. Pump failures detected.',
    originCoords: [72.8420, 19.1180],
    destinationCoords: [72.8520, 19.1210],
    etaNormalMins: 10,
    etaBypassMins: 25,
    bypassAdvice: 'Take Milan Subway or Captain Gore Flyover bypass around Andheri Subway.',
    floodedRouteGeoJSON: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { status: 'blocked', name: 'Direct Subway Route' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [72.8420, 19.1180],
              [72.8466, 19.1197],
              [72.8520, 19.1210],
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
          properties: { status: 'safe', name: 'Captain Gore Elevated Bypass Corridor' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [72.8420, 19.1180],
              [72.8430, 19.1230],
              [72.8480, 19.1250],
              [72.8520, 19.1210],
            ],
          },
        },
      ],
    },
  },
  {
    id: 'kurla',
    name: 'Kurla (Mithi River)',
    ward: 'L Ward',
    center: [72.8796, 19.0728],
    zoom: 15,
    pitch: 40,
    rainfallMmHr: 75,
    floodProbabilityPct: 82,
    predictedWaterDepthCm: 65,
    surchargeStatus: 'SURCHARGE',
    drainageCapacityPct: 86,
    criticalNodes: ['Kranti Nagar', 'LBS Marg Bend', 'Taximen Colony'],
    chokePoints: [
      {
        name: 'Mithi Riverbank Lowlands',
        coords: [72.8796, 19.0728],
        depthCm: 65,
        description: 'Mithi River Backflow Impassable (65 cm water depth)',
      },
    ],
    warningMessage: 'Mithi River water level elevated dangerously close to danger mark. Avoid LBS Marg.',
    originCoords: [72.8750, 19.0700],
    destinationCoords: [72.8850, 19.0750],
    etaNormalMins: 12,
    etaBypassMins: 18,
    bypassAdvice: 'Use SCLR (Santacruz Chembur Link Road) elevated flyover bypass.',
    floodedRouteGeoJSON: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { status: 'blocked', name: 'LBS Marg Low Causeway' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [72.8750, 19.0700],
              [72.8796, 19.0728],
              [72.8850, 19.0750],
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
          properties: { status: 'safe', name: 'SCLR Elevated Bypass' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [72.8750, 19.0700],
              [72.8720, 19.0750],
              [72.8780, 19.0800],
              [72.8850, 19.0750],
            ],
          },
        },
      ],
    },
  }
];
