export interface AreaData {
  id: string;
  name: string;
  ward: string;
  zone: string;
  isLiveDemo: boolean;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  waterDepthCm: number;
  rainfallMmHr: number;
  drainageCapacityPct: number;
  timeToCriticalMins: number | null;
  affectedRoads: string[];
  keyRoads: string[];
  description: string;
  riskDrivers: {
    factor: string;
    detail: string;
  }[];
  predictionFactors: {
    explanation: string;
    confidencePct: number;
    leadTimeMins: number;
  };
  interventionRationale: {
    recommendedAction: string;
    proximity: string;
    availableCapacity: string;
    expectedEffect: string;
    responseTimeMins: number;
    reasoning: string;
    alternativeAction: string;
  };
  sensorsCount: number;
  cctvCount: number;
  centerCoordinates: { lat: number; lng: number };
  lastUpdatedMinsAgo: number;
}

export interface SearchResultItem {
  id: string;
  title: string;
  category: 'Locations' | 'Wards' | 'Roads' | 'Drainage' | 'Sensors' | 'CCTV';
  areaId: string;
  areaName: string;
  subtitle: string;
  badgeText: string;
  dynamicCoords?: { lat: number; lng: number };
}

export const MUMBAI_AREAS: Record<string, AreaData> = {
  hindmata: {
    id: 'hindmata',
    name: 'Hindmata, Dadar',
    ward: 'F/South Ward',
    zone: 'Island City',
    isLiveDemo: true,
    status: 'CRITICAL',
    waterDepthCm: 85,
    rainfallMmHr: 112,
    drainageCapacityPct: 99,
    timeToCriticalMins: 5,
    affectedRoads: ['Dr. Ambedkar Road', 'Hindmata Flyover Underpass'],
    keyRoads: ['Dr. Ambedkar Road', 'Senapati Bapat Marg', 'Dadar TT', 'Parel TT'],
    description: 'Iconic low-lying saucer-shaped depression in Central Mumbai. Highly vulnerable to intense cloudbursts combining with high tide locking.',
    lastUpdatedMinsAgo: 2,
    riskDrivers: [
      { factor: '1. Severe cloudburst', detail: '112 mm/hr forecast over the next hour.' },
      { factor: '2. Saucer-shaped terrain', detail: 'Road elevation is 2m below surrounding Dadar TT and Parel regions.' },
      { factor: '3. Outfall High Tide Lock', detail: 'Britannia outfall gates closed due to 4.5m high tide.' },
      { factor: '4. Sump overload', detail: 'Pramod Mahajan Kala Park holding tank at 98% capacity.' },
    ],
    predictionFactors: {
      explanation: 'Critical drainage surcharge occurring due to high tide lock and intense convective rainfall converging into the Hindmata depression.',
      confidencePct: 96,
      leadTimeMins: 5,
    },
    interventionRationale: {
      recommendedAction: 'Deploy Mobile Dewatering Pump Unit #4 (500 HP, 1.2 m³/s rate)',
      proximity: 'Dadar Standby Depot (0.8 km)',
      availableCapacity: '1.2 m³/s discharge rate',
      expectedEffect: 'Reduce standing water depth by ~32 cm in ~20 minutes',
      responseTimeMins: 12,
      reasoning: 'Pumping bypasses the closed Britannia outfall gates to force discharge storm runoff.',
      alternativeAction: 'Pre-discharge holding tanks by 40% to lower head.',
    },
    sensorsCount: 6,
    cctvCount: 4,
    centerCoordinates: { lat: 19.0163, lng: 72.8427 },
  },

  andheri: {
    id: 'andheri',
    name: 'Andheri Subway',
    ward: 'K/West Ward',
    zone: 'Western Suburbs',
    isLiveDemo: false,
    status: 'WARNING',
    waterDepthCm: 110,
    rainfallMmHr: 95,
    drainageCapacityPct: 92,
    timeToCriticalMins: 15,
    affectedRoads: ['Andheri Subway', 'SV Road Junction'],
    keyRoads: ['SV Road', 'Western Express Highway', 'Subway Route'],
    description: 'Major East-West vehicular subway crossing beneath railway tracks, highly prone to immediate waterlogging.',
    lastUpdatedMinsAgo: 4,
    riskDrivers: [
      { factor: '1. Intense cloudburst', detail: '95 mm/hr convective rainfall front.' },
      { factor: '2. Underpass depression', detail: 'Runoff converges toward Subway.' },
      { factor: '3. Capacity overload', detail: 'Mogra Nullah downstream line is at 92% capacity.' },
    ],
    predictionFactors: {
      explanation: 'Critical waterlogging expected within ~15 minutes if storm intensity persists.',
      confidencePct: 92,
      leadTimeMins: 15,
    },
    interventionRationale: {
      recommendedAction: 'Activate Milan Subway Bypass Route & Close Andheri Subway',
      proximity: 'Subway Gate House (0.1 km)',
      availableCapacity: 'Divert traffic immediately',
      expectedEffect: 'Prevent vehicular stranding',
      responseTimeMins: 8,
      reasoning: 'Water depth has crossed safe vehicular navigation threshold (30cm).',
      alternativeAction: 'Deploy High-Volume Mobile Pump Squad #2.',
    },
    sensorsCount: 4,
    cctvCount: 3,
    centerCoordinates: { lat: 19.1197, lng: 72.8466 },
  },

  kurla: {
    id: 'kurla',
    name: 'Kurla (Mithi River)',
    ward: 'L Ward',
    zone: 'Eastern Suburbs',
    isLiveDemo: false,
    status: 'WARNING',
    waterDepthCm: 65,
    rainfallMmHr: 75,
    drainageCapacityPct: 86,
    timeToCriticalMins: 35,
    affectedRoads: ['LBS Marg', 'Kranti Nagar'],
    keyRoads: ['LBS Marg', 'SCLR', 'Taximen Colony'],
    description: 'Riverbank settlements and major arterial road vulnerable to Mithi river overflow.',
    lastUpdatedMinsAgo: 3,
    riskDrivers: [
      { factor: '1. Heavy catchment runoff', detail: '75 mm/hr rainfall over Sanjay Gandhi National Park catchment.' },
      { factor: '2. Riverbank overflow', detail: 'Mithi River stage height approaching danger mark.' },
      { factor: '3. Culvert restriction', detail: 'LBS Marg culvert silted by 40%.' },
    ],
    predictionFactors: {
      explanation: 'Moderate flood risk within ~35 minutes; localized waterlogging on LBS Marg.',
      confidencePct: 89,
      leadTimeMins: 35,
    },
    interventionRationale: {
      recommendedAction: 'Evacuation Warning for Kranti Nagar',
      proximity: 'Kurla Ward Depot (1.1 km)',
      availableCapacity: 'NDRF standby boats',
      expectedEffect: 'Secure population safety',
      responseTimeMins: 15,
      reasoning: 'River level trajectory intersects danger mark in 35 mins.',
      alternativeAction: 'Deploy Portable Dewatering Unit at Taximen Colony.',
    },
    sensorsCount: 5,
    cctvCount: 4,
    centerCoordinates: { lat: 19.0728, lng: 72.8796 },
  },
};

export const GLOBAL_SEARCH_INDEX: SearchResultItem[] = [
  // Locations
  { id: 'loc-hindmata', title: 'Hindmata, Dadar', category: 'Locations', areaId: 'hindmata', areaName: 'Hindmata, Dadar', subtitle: 'F/South Ward • Island City', badgeText: 'Monitoring active' },
  { id: 'loc-andheri', title: 'Andheri Subway', category: 'Locations', areaId: 'andheri', areaName: 'Andheri Subway', subtitle: 'K/West Ward • Western Suburbs', badgeText: 'Hydrodynamic Model' },
  { id: 'loc-kurla', title: 'Kurla', category: 'Locations', areaId: 'kurla', areaName: 'Kurla', subtitle: 'L Ward • Mithi River', badgeText: 'Hydrodynamic Model' },

  // Roads
  { id: 'rd-ambedkar', title: 'Dr. Ambedkar Road', category: 'Roads', areaId: 'hindmata', areaName: 'Hindmata, Dadar', subtitle: 'Primary Arterial • Central Mumbai', badgeText: 'Flooded' },
  { id: 'rd-dadartt', title: 'Dadar TT Flyover', category: 'Roads', areaId: 'hindmata', areaName: 'Hindmata, Dadar', subtitle: 'Elevated Bypass', badgeText: 'Safe Route' },
  { id: 'rd-svroad', title: 'SV Road', category: 'Roads', areaId: 'andheri', areaName: 'Andheri Subway', subtitle: 'Primary Arterial', badgeText: 'At Risk' },

  // Drainage Assets
  { id: 'dr-britannia', title: 'Britannia Pumping Station', category: 'Drainage', areaId: 'hindmata', areaName: 'Hindmata, Dadar', subtitle: 'High-Capacity Outfall', badgeText: 'Active' },
  { id: 'dr-pramod', title: 'Pramod Mahajan Sump', category: 'Drainage', areaId: 'hindmata', areaName: 'Hindmata, Dadar', subtitle: 'Underground Holding Tank', badgeText: '98% Full' },
  { id: 'dr-mithi', title: 'Mithi River Outfall', category: 'Drainage', areaId: 'kurla', areaName: 'Kurla', subtitle: 'Primary Catchment', badgeText: 'High Level' },

  // Sensors
  { id: 'sn-h101', title: 'Hindmata Sump Sensor', category: 'Sensors', areaId: 'hindmata', areaName: 'Hindmata, Dadar', subtitle: 'Ultrasonic Depth • S-101', badgeText: 'Alert' },
  { id: 'sn-a201', title: 'Andheri Subway Depth Sensor', category: 'Sensors', areaId: 'andheri', areaName: 'Andheri Subway', subtitle: 'Hydrostatic • A-201', badgeText: 'Critical' },

  // CCTV
  { id: 'cam-h1', title: 'Hindmata Flyover Underpass Cam', category: 'CCTV', areaId: 'hindmata', areaName: 'Hindmata, Dadar', subtitle: 'BMC Traffic Cam 01', badgeText: 'Live' },
  { id: 'cam-a1', title: 'Andheri Subway Entry Cam', category: 'CCTV', areaId: 'andheri', areaName: 'Andheri Subway', subtitle: 'BMC Traffic Cam 04', badgeText: 'Live' },
];
