export interface Sensor {
  id: string;
  name: string;
  location: string;
  type: 'depth' | 'flow' | 'rain_gauge' | 'river_level';
  value: number; // depth in cm or flow in m3/s or river in m
  unit: string;
  status: 'normal' | 'warning' | 'critical' | 'offline';
  battery: number;
  signal: number;
  lastUpdated: string;
  coordinates: { lat: number; lng: number };
  trend: 'rising' | 'falling' | 'stable';
  dataSource?: string;
}

export interface CCTVCamera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'alert' | 'maintenance';
  aiWaterDetection: boolean;
  waterDepthCm: number;
  trafficSpeedKmph: number;
  coordinates: { lat: number; lng: number };
  streamUrl: string;
  lastSnapTime: string;
  confidencePct?: number;
}

export interface PipeNetwork {
  id: string;
  name: string;
  fromNode: string;
  toNode: string;
  diameterMm: number;
  lengthM: number;
  capacityM3s: number;
  currentFlowM3s: number;
  siltLevelPct: number;
  loadPct: number;
  status: 'normal' | 'warning' | 'overloaded' | 'blocked';
  coordinates: { from: { lat: number; lng: number }; to: { lat: number; lng: number } };
  pathCoordinates?: Array<[number, number]>; // [lng, lat]
}

export interface Alert {
  id: string;
  timestamp: string;
  type: 'preventive' | 'emergency' | 'system' | 'resolution';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  location: string;
  description: string;
  timeToCriticalMins?: number;
  recommendedAction: string;
  acknowledged: boolean;
}

export interface Intervention {
  id: string;
  type: 'PUMP' | 'BYPASS' | 'STORAGE' | 'CLEANING';
  title: string;
  location: string;
  targetAsset: string;
  urgency: 'IMMEDIATE' | 'HIGH' | 'MODERATE' | 'PREVENTIVE';
  impactDescription: string;
  expectedDepthReductionCm: number;
  timeToReliefMins: number;
  costEstimate: string;
  status: 'RECOMMENDED' | 'DISPATCHED' | 'EXECUTING' | 'COMPLETED';
}

export interface FieldWorker {
  id: string;
  name: string;
  team: string;
  role: string;
  contact: string;
  assignedTask: string;
  locationName: string;
  coordinates: { lat: number; lng: number };
  status: 'IDLE' | 'EN_ROUTE' | 'ON_SITE' | 'COMPLETED' | 'DISPATCHED' | 'PUMPING_ACTIVE' | 'TASK_COMPLETED';
  etaMins: number;
}

export interface EvacuationRoute {
  id: string;
  name: string;
  origin: string;
  destination: string;
  type: 'safest' | 'fastest';
  distanceKm: number;
  durationMins: number;
  floodedSegments: string[];
  waterDepthOnRouteCm: number;
  pathCoordinates: Array<[number, number]>; // [lng, lat]
  waypoints: Array<{ lat: number; lng: number; name: string; status: 'clear' | 'caution' | 'blocked' }>;
  description: string;
}

export const PUNE_SHIVAJINAGAR_CENTER = { lat: 18.5308, lng: 73.8474 };

export const SENSORS_DATA: Sensor[] = [
  {
    id: 'S-01',
    name: 'JM Road Underpass Depth Sensor',
    location: 'JM Road Underpass near Sancheti',
    type: 'depth',
    value: 12,
    unit: 'cm',
    status: 'normal',
    battery: 94,
    signal: 98,
    lastUpdated: '10 seconds ago',
    coordinates: { lat: 18.5312, lng: 73.8482 },
    trend: 'stable',
  },
  {
    id: 'S-02',
    name: 'FC Road Metro Station Drainage Flow',
    location: 'FC Road Metro Gate 2',
    type: 'flow',
    value: 1.4,
    unit: 'm³/s',
    status: 'normal',
    battery: 88,
    signal: 92,
    lastUpdated: '12 seconds ago',
    coordinates: { lat: 18.5234, lng: 73.8415 },
    trend: 'stable',
  },
  {
    id: 'S-03',
    name: 'Mutha Confluence River Gauge',
    location: 'Sangamwadi Bridge Confluence',
    type: 'river_level',
    value: 1.2,
    unit: 'm',
    status: 'normal',
    battery: 96,
    signal: 95,
    lastUpdated: '5 seconds ago',
    coordinates: { lat: 18.5385, lng: 73.8561 },
    trend: 'stable',
  },
  {
    id: 'S-04',
    name: 'Dengle Bridge Sluice Gate Flow',
    location: 'Dengle Bridge Mutha Gate',
    type: 'flow',
    value: 2.1,
    unit: 'm³/s',
    status: 'normal',
    battery: 91,
    signal: 90,
    lastUpdated: '8 seconds ago',
    coordinates: { lat: 18.5289, lng: 73.8532 },
    trend: 'stable',
  },
  {
    id: 'S-05',
    name: 'Model Colony Retention Basin',
    location: 'Lakaki Lake Overflow Gate',
    type: 'depth',
    value: 8,
    unit: 'cm',
    status: 'normal',
    battery: 89,
    signal: 94,
    lastUpdated: '15 seconds ago',
    coordinates: { lat: 18.5361, lng: 73.8398 },
    trend: 'stable',
  },
  {
    id: 'S-06',
    name: 'COEP Technological Univ Doppler Rain',
    location: 'COEP Ground Shivajinagar',
    type: 'rain_gauge',
    value: 5,
    unit: 'mm/hr',
    status: 'normal',
    battery: 99,
    signal: 99,
    lastUpdated: '2 seconds ago',
    coordinates: { lat: 18.5301, lng: 73.8543 },
    trend: 'stable',
  },
];

export const CCTV_DATA: CCTVCamera[] = [
  {
    id: 'CAM-01',
    name: 'CAM #1 - JM Road Underpass North',
    location: 'JM Road / Sancheti Circle',
    status: 'online',
    aiWaterDetection: false,
    waterDepthCm: 12,
    trafficSpeedKmph: 42,
    coordinates: { lat: 18.5315, lng: 73.8485 },
    streamUrl: '/mock/cctv1.jpg',
    lastSnapTime: 'Live (0.5s ago)',
  },
  {
    id: 'CAM-02',
    name: 'CAM #2 - FC Road Garware College Junction',
    location: 'FC Road / Deccan Gymkhana',
    status: 'online',
    aiWaterDetection: false,
    waterDepthCm: 4,
    trafficSpeedKmph: 38,
    coordinates: { lat: 18.5185, lng: 73.8402 },
    streamUrl: '/mock/cctv2.jpg',
    lastSnapTime: 'Live (0.4s ago)',
  },
  {
    id: 'CAM-03',
    name: 'CAM #3 - Dengle Sluice Gate Watch',
    location: 'Dengle Bridge Right Bank',
    status: 'online',
    aiWaterDetection: false,
    waterDepthCm: 0,
    trafficSpeedKmph: 30,
    coordinates: { lat: 18.5288, lng: 73.8530 },
    streamUrl: '/mock/cctv3.jpg',
    lastSnapTime: 'Live (0.6s ago)',
  },
  {
    id: 'CAM-04',
    name: 'CAM #4 - Shivajinagar Railway Station Subway',
    location: 'Pune Railway Underpass',
    status: 'online',
    aiWaterDetection: false,
    waterDepthCm: 6,
    trafficSpeedKmph: 25,
    coordinates: { lat: 18.5322, lng: 73.8512 },
    streamUrl: '/mock/cctv4.jpg',
    lastSnapTime: 'Live (0.8s ago)',
  },
];

export const PIPES_DATA: PipeNetwork[] = [
  {
    id: 'P-101',
    name: 'JM Trunk Storm Main A1',
    fromNode: 'MH-01 (Sancheti)',
    toNode: 'MH-02 (Balgandharva)',
    diameterMm: 1200,
    lengthM: 450,
    capacityM3s: 3.5,
    currentFlowM3s: 0.8,
    siltLevelPct: 15,
    loadPct: 22,
    status: 'normal',
    coordinates: {
      from: { lat: 18.5312, lng: 73.8482 },
      to: { lat: 18.5265, lng: 73.8450 },
    },
    pathCoordinates: [
      [73.8482, 18.5312],
      [73.8468, 18.5290],
      [73.8450, 18.5265],
    ],
  },
  {
    id: 'P-102',
    name: 'JM Culvert Outfall to Mutha',
    fromNode: 'MH-02 (Balgandharva)',
    toNode: 'MH-03 (Mutha Bank)',
    diameterMm: 1400,
    lengthM: 320,
    capacityM3s: 4.2,
    currentFlowM3s: 1.1,
    siltLevelPct: 42,
    loadPct: 26,
    status: 'normal',
    coordinates: {
      from: { lat: 18.5265, lng: 73.8450 },
      to: { lat: 18.5285, lng: 73.8510 },
    },
    pathCoordinates: [
      [73.8450, 18.5265],
      [73.8480, 18.5275],
      [73.8510, 18.5285],
    ],
  },
  {
    id: 'P-103',
    name: 'FC Road Metro Sub-Drain B4',
    fromNode: 'MH-04 (Goodluck)',
    toNode: 'MH-01 (Sancheti)',
    diameterMm: 900,
    lengthM: 600,
    capacityM3s: 2.1,
    currentFlowM3s: 0.4,
    siltLevelPct: 10,
    loadPct: 19,
    status: 'normal',
    coordinates: {
      from: { lat: 18.5200, lng: 73.8410 },
      to: { lat: 18.5312, lng: 73.8482 },
    },
    pathCoordinates: [
      [73.8410, 18.5200],
      [73.8440, 18.5245],
      [73.8482, 18.5312],
    ],
  },
  {
    id: 'P-104',
    name: 'Model Colony Overflow Bypass C1',
    fromNode: 'MH-05 (Lakaki Lake)',
    toNode: 'MH-01 (Sancheti)',
    diameterMm: 1000,
    lengthM: 750,
    capacityM3s: 2.8,
    currentFlowM3s: 0.6,
    siltLevelPct: 55,
    loadPct: 21,
    status: 'normal',
    coordinates: {
      from: { lat: 18.5361, lng: 73.8398 },
      to: { lat: 18.5312, lng: 73.8482 },
    },
    pathCoordinates: [
      [73.8398, 18.5361],
      [73.8435, 18.5335],
      [73.8482, 18.5312],
    ],
  },
];

export const FIELD_WORKERS_DATA: FieldWorker[] = [
  {
    id: 'W-01',
    name: 'Team Alpha (S. Patil)',
    team: 'PMC Emergency Dewatering Unit 1',
    role: 'Mobile Dewatering Specialist',
    contact: '+91 98220 11234',
    assignedTask: 'Standby at Shivajinagar Depot',
    locationName: 'Shivajinagar Municipal Ward Office',
    coordinates: { lat: 18.5320, lng: 73.8490 },
    status: 'IDLE',
    etaMins: 0,
  },
  {
    id: 'W-02',
    name: 'Team Bravo (M. Shinde)',
    team: 'Drainage Maintenance Crew 4',
    role: 'Desilting & Jetting Operator',
    contact: '+91 98221 44556',
    assignedTask: 'Inspect Culvert C-14 Silt Traps',
    locationName: 'Balgandharva Bridge Ramp',
    coordinates: { lat: 18.5268, lng: 73.8455 },
    status: 'IDLE',
    etaMins: 5,
  },
  {
    id: 'W-03',
    name: 'Dewatering Unit #4 (Pump Spec)',
    team: 'PMC Mobile Pump Squad',
    role: '500 HP High-Volume Pump Truck',
    contact: '+91 98222 99887',
    assignedTask: 'On Standby for Flash Flood Mobilization',
    locationName: 'COEP Ground Depot',
    coordinates: { lat: 18.5305, lng: 73.8538 },
    status: 'IDLE',
    etaMins: 0,
  },
];

export const EVACUATION_ROUTES: EvacuationRoute[] = [
  {
    id: 'ROUTE-SAFEST',
    name: 'FC Road Flyover via Sancheti Upper Ramp',
    origin: 'Deccan Gymkhana',
    destination: 'COEP Junction / Sangamwadi',
    type: 'safest',
    distanceKm: 3.8,
    durationMins: 9,
    floodedSegments: [],
    waterDepthOnRouteCm: 0,
    description: 'Elevated flyover bypass completely avoiding low-lying underpass sump pooling.',
    pathCoordinates: [
      [73.8402, 18.5185],
      [73.8415, 18.5234],
      [73.8450, 18.5270],
      [73.8475, 18.5305],
      [73.8502, 18.5335],
      [73.8538, 18.5360],
    ],
    waypoints: [
      { lat: 18.5185, lng: 73.8402, name: 'Garware College Entry', status: 'clear' },
      { lat: 18.5270, lng: 73.8450, name: 'Sancheti Flyover Flyover Bridge', status: 'clear' },
      { lat: 18.5360, lng: 73.8538, name: 'COEP Upper Ramp Exit', status: 'clear' },
    ],
  },
  {
    id: 'ROUTE-FASTEST',
    name: 'JM Road Underpass Direct Arterial',
    origin: 'Deccan Gymkhana',
    destination: 'COEP Junction / Sangamwadi',
    type: 'fastest',
    distanceKm: 2.9,
    durationMins: 7,
    floodedSegments: ['FC Road Underpass', 'JM Underpass Sump'],
    waterDepthOnRouteCm: 28,
    description: 'Direct low-level underpass route. Subject to heavy runoff waterlogging when storm strikes.',
    pathCoordinates: [
      [73.8402, 18.5185],
      [73.8440, 18.5220],
      [73.8465, 18.5275],
      [73.8482, 18.5312], // Underpass sump location
      [73.8510, 18.5335],
      [73.8538, 18.5360],
    ],
    waypoints: [
      { lat: 18.5185, lng: 73.8402, name: 'Goodluck Chowk', status: 'clear' },
      { lat: 18.5275, lng: 73.8465, name: 'Balgandharva Rangmandir', status: 'caution' },
      { lat: 18.5312, lng: 73.8482, name: 'JM Road Underpass Sump', status: 'blocked' },
    ],
  },
];

