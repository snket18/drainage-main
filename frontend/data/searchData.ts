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

export const PUNE_AREAS: Record<string, AreaData> = {
  shivajinagar: {
    id: 'shivajinagar',
    name: 'Shivajinagar',
    ward: 'Ward 14',
    zone: 'Central Pune Zone',
    isLiveDemo: true,
    status: 'WARNING',
    waterDepthCm: 18,
    rainfallMmHr: 35,
    drainageCapacityPct: 58,
    timeToCriticalMins: 25,
    affectedRoads: ['JM Road Underpass', 'Sancheti Circle Ramp'],
    keyRoads: ['JM Road', 'FC Road', 'Sancheti Ramp', 'COEP Flyover'],
    description: 'Central urban transit corridor vulnerable to Mutha river confluence backwater & subway depression pooling.',
    lastUpdatedMinsAgo: 2,
    riskDrivers: [
      { factor: '1. Heavy rainfall', detail: '35 mm/hr forecast over the next hour.' },
      { factor: '2. Low-lying terrain', detail: 'Subway elevation is 5m below surrounding street level.' },
      { factor: '3. Drainage utilization', detail: 'Culvert C-14 is operating at 58% capacity with 55% silt accumulation.' },
      { factor: '4. Flow anomaly', detail: 'Sensor S-102 reports reduced velocity near Mutha outfall.' },
    ],
    predictionFactors: {
      explanation: 'High likelihood of drainage surcharge within ~25 minutes due to convective storm convergence and underpass depression pooling.',
      confidencePct: 94,
      leadTimeMins: 25,
    },
    interventionRationale: {
      recommendedAction: 'Deploy Mobile Dewatering Pump Unit #4 (500 HP, 1.2 m³/s rate)',
      proximity: 'COEP Standby Depot (0.8 km)',
      availableCapacity: '1.2 m³/s discharge rate',
      expectedEffect: 'Reduce standing water depth by ~32 cm in ~20 minutes',
      responseTimeMins: 12,
      reasoning: 'Pumping directly bypasses the silt-restricted Culvert C-14 and discharges water over the Mutha flood wall into the river channel.',
      alternativeAction: 'Pre-discharge Dengle Sluice Gate #2 by 40% to lower outfall backwater head.',
    },
    sensorsCount: 6,
    cctvCount: 4,
    centerCoordinates: { lat: 18.5308, lng: 73.8474 },
  },

  kalyani_nagar: {
    id: 'kalyani_nagar',
    name: 'Kalyani Nagar',
    ward: 'Ward 07',
    zone: 'Eastern Corridor',
    isLiveDemo: false,
    status: 'CRITICAL',
    waterDepthCm: 42,
    rainfallMmHr: 72,
    drainageCapacityPct: 92,
    timeToCriticalMins: 15,
    affectedRoads: ['Nagar Road Underpass', 'East Avenue Sump'],
    keyRoads: ['Nagar Road', 'East Avenue', 'Central Avenue'],
    description: 'High-density commercial corridor subject to Mula-Mutha river backwater and Nagar Road subway pooling.',
    lastUpdatedMinsAgo: 4,
    riskDrivers: [
      { factor: '1. Intense cloudburst', detail: '72 mm/hr convective rainfall front.' },
      { factor: '2. Underpass depression', detail: 'Runoff converges toward Nagar Road subway.' },
      { factor: '3. Capacity overload', detail: 'Trunk Pipe P-204 downstream line is at 92% capacity.' },
      { factor: '4. Outfall backwater', detail: 'Mula-Mutha river stage height is 3.1m.' },
    ],
    predictionFactors: {
      explanation: 'Critical waterlogging expected within ~15 minutes if storm intensity persists.',
      confidencePct: 92,
      leadTimeMins: 15,
    },
    interventionRationale: {
      recommendedAction: 'Activate East Avenue Retention Basin Bypass Gate #3',
      proximity: 'East Avenue Gate House (0.3 km)',
      availableCapacity: '2.0 m³/s diversion buffer',
      expectedEffect: 'Reduce peak water depth by ~28 cm in ~25 minutes',
      responseTimeMins: 8,
      reasoning: 'Diverting excess storm runoff into the retention basin creates immediate headroom in Pipe P-204.',
      alternativeAction: 'Deploy High-Volume Mobile Pump Squad #2 to outfall.',
    },
    sensorsCount: 4,
    cctvCount: 3,
    centerCoordinates: { lat: 18.5464, lng: 73.9034 },
  },

  hadapsar: {
    id: 'hadapsar',
    name: 'Hadapsar',
    ward: 'Ward 22',
    zone: 'South-East Belt',
    isLiveDemo: false,
    status: 'WARNING',
    waterDepthCm: 26,
    rainfallMmHr: 48,
    drainageCapacityPct: 78,
    timeToCriticalMins: 35,
    affectedRoads: ['Solapur Highway Subway', 'Magarpatta Junction'],
    keyRoads: ['Solapur Road', 'Magarpatta Road', 'Gadital Chowk'],
    description: 'Arterial highway intersection vulnerable to irrigation canal overflow and heavy pavement runoff.',
    lastUpdatedMinsAgo: 3,
    riskDrivers: [
      { factor: '1. Heavy highway runoff', detail: '48 mm/hr rainfall over wide paved highway catchment.' },
      { factor: '2. Canal spillway overflow', detail: 'Mutha Right Bank Canal surcharge entering storm network.' },
      { factor: '3. Culvert restriction', detail: 'Culvert H-08 silted by 40% near Gadital.' },
    ],
    predictionFactors: {
      explanation: 'Moderate flood risk within ~35 minutes; localized waterlogging on Solapur Road subway.',
      confidencePct: 89,
      leadTimeMins: 35,
    },
    interventionRationale: {
      recommendedAction: 'High-Pressure Vacuum Jetting at Culvert H-08',
      proximity: 'Hadapsar Ward Depot (1.1 km)',
      availableCapacity: 'Restores 1.8 m³/s gravity flow',
      expectedEffect: 'Reduce water depth by ~20 cm in ~30 minutes',
      responseTimeMins: 15,
      reasoning: 'Removing silt block at H-08 re-establishes freeboard discharge to canal outfall.',
      alternativeAction: 'Deploy Portable Dewatering Unit #7 at Gadital Subway.',
    },
    sensorsCount: 5,
    cctvCount: 4,
    centerCoordinates: { lat: 18.5089, lng: 73.9259 },
  },

  swargate: {
    id: 'swargate',
    name: 'Swargate',
    ward: 'Ward 18',
    zone: 'South Central Hub',
    isLiveDemo: false,
    status: 'WARNING',
    waterDepthCm: 22,
    rainfallMmHr: 38,
    drainageCapacityPct: 68,
    timeToCriticalMins: 40,
    affectedRoads: ['Seven Loves Flyover Sump', 'Jedhe Chowk'],
    keyRoads: ['Satara Road', 'Jedhe Chowk', 'Tilak Road'],
    description: 'Major transit interchange junction subject to rapid storm pooling near subway entries.',
    lastUpdatedMinsAgo: 5,
    riskDrivers: [
      { factor: '1. Moderate rainfall', detail: '38 mm/hr steady rain forecast.' },
      { factor: '2. Sump pooling', detail: 'Jedhe Chowk sump receiving multi-lane road runoff.' },
    ],
    predictionFactors: {
      explanation: 'Inundation risk confined to underpass sump; travel routes open.',
      confidencePct: 92,
      leadTimeMins: 40,
    },
    interventionRationale: {
      recommendedAction: 'Position Standby Dewatering Unit at Jedhe Chowk Sump',
      proximity: 'Swargate Depot (0.4 km)',
      availableCapacity: '0.8 m³/s pumping capacity',
      expectedEffect: 'Prevent underpass inundation breach',
      responseTimeMins: 10,
      reasoning: 'Clearing storm grates maintains steady discharge flow into Sarasbaug lake line.',
      alternativeAction: 'Divert flow into Sarasbaug overflow line.',
    },
    sensorsCount: 4,
    cctvCount: 3,
    centerCoordinates: { lat: 18.5018, lng: 73.8636 },
  },

  kothrud: {
    id: 'kothrud',
    name: 'Kothrud',
    ward: 'Ward 12',
    zone: 'Western Suburbs',
    isLiveDemo: false,
    status: 'NORMAL',
    waterDepthCm: 6,
    rainfallMmHr: 14,
    drainageCapacityPct: 24,
    timeToCriticalMins: null,
    affectedRoads: [],
    keyRoads: ['Karve Road', 'Paud Road', 'Chandani Chowk'],
    description: 'Elevated topography with high natural slope gradient; minimal waterlogging risk.',
    lastUpdatedMinsAgo: 1,
    riskDrivers: [
      { factor: '1. High slope gradient', detail: 'Natural topography allows self-cleansing 3.2 m/s flow velocity.' },
    ],
    predictionFactors: {
      explanation: 'No significant flood risk projected. Gravity flow operating efficiently.',
      confidencePct: 96,
      leadTimeMins: 0,
    },
    interventionRationale: {
      recommendedAction: 'Baseline Monitoring — No active intervention required',
      proximity: 'N/A',
      availableCapacity: 'N/A',
      expectedEffect: 'N/A',
      responseTimeMins: 0,
      reasoning: 'Existing storm lines are clear with 76% capacity headroom.',
      alternativeAction: 'Routine storm grate inspection.',
    },
    sensorsCount: 3,
    cctvCount: 2,
    centerCoordinates: { lat: 18.5074, lng: 73.8077 },
  },
};

export const GLOBAL_SEARCH_INDEX: SearchResultItem[] = [
  // Locations
  { id: 'loc-shivajinagar', title: 'Shivajinagar', category: 'Locations', areaId: 'shivajinagar', areaName: 'Shivajinagar', subtitle: 'Ward 14 • Central Zone', badgeText: 'Live Telemetry' },
  { id: 'loc-kalyani_nagar', title: 'Kalyani Nagar', category: 'Locations', areaId: 'kalyani_nagar', areaName: 'Kalyani Nagar', subtitle: 'Ward 07 • Nagar Road Hub', badgeText: 'Hydrodynamic Model' },
  { id: 'loc-hadapsar', title: 'Hadapsar', category: 'Locations', areaId: 'hadapsar', areaName: 'Hadapsar', subtitle: 'Ward 22 • Solapur Highway', badgeText: 'Hydrodynamic Model' },
  { id: 'loc-swargate', title: 'Swargate', category: 'Locations', areaId: 'swargate', areaName: 'Swargate', subtitle: 'Ward 18 • Transit Hub', badgeText: 'Hydrodynamic Model' },
  { id: 'loc-kothrud', title: 'Kothrud', category: 'Locations', areaId: 'kothrud', areaName: 'Kothrud', subtitle: 'Ward 12 • Western Suburbs', badgeText: 'Baseline Model' },

  // Wards
  { id: 'ward-14', title: 'Ward 14 (Shivajinagar)', category: 'Wards', areaId: 'shivajinagar', areaName: 'Shivajinagar', subtitle: 'PMC Ward 14 District', badgeText: 'Ward Asset' },
  { id: 'ward-07', title: 'Ward 07 (Kalyani Nagar)', category: 'Wards', areaId: 'kalyani_nagar', areaName: 'Kalyani Nagar', subtitle: 'PMC Ward 07 East District', badgeText: 'Ward Asset' },
  { id: 'ward-22', title: 'Ward 22 (Hadapsar)', category: 'Wards', areaId: 'hadapsar', areaName: 'Hadapsar', subtitle: 'PMC Ward 22 South-East District', badgeText: 'Ward Asset' },
  { id: 'ward-18', title: 'Ward 18 (Swargate)', category: 'Wards', areaId: 'swargate', areaName: 'Swargate', subtitle: 'PMC Ward 18 Transit District', badgeText: 'Ward Asset' },

  // Roads
  { id: 'road-fc', title: 'FC Road', category: 'Roads', areaId: 'shivajinagar', areaName: 'Shivajinagar', subtitle: 'Fergusson College Road Corridor', badgeText: 'Arterial Road' },
  { id: 'road-jm', title: 'JM Road', category: 'Roads', areaId: 'shivajinagar', areaName: 'Shivajinagar', subtitle: 'Jangali Maharaj Road Underpass', badgeText: 'Risk Hotspot' },
  { id: 'road-nagar', title: 'Nagar Road', category: 'Roads', areaId: 'kalyani_nagar', areaName: 'Kalyani Nagar', subtitle: 'Commercial Highway Corridor', badgeText: 'Arterial Road' },
  { id: 'road-solapur', title: 'Solapur Highway', category: 'Roads', areaId: 'hadapsar', areaName: 'Hadapsar', subtitle: 'Solapur Highway Subway Junction', badgeText: 'Arterial Road' },
  { id: 'road-satara', title: 'Satara Road', category: 'Roads', areaId: 'swargate', areaName: 'Swargate', subtitle: 'Satara Transit Corridor', badgeText: 'Arterial Road' },

  // Drainage
  { id: 'node-mh101', title: 'MH-101 (Sancheti)', category: 'Drainage', areaId: 'shivajinagar', areaName: 'Shivajinagar', subtitle: '1200mm Trunk Inspection Chamber', badgeText: 'MH-101' },
  { id: 'node-mh104', title: 'MH-104 (Culvert Silt Trap)', category: 'Drainage', areaId: 'shivajinagar', areaName: 'Shivajinagar', subtitle: 'Culvert C-14 Outfall Chamber', badgeText: 'MH-104' },
  { id: 'node-pipe101', title: 'Pipe P-101 Main Trunk', category: 'Drainage', areaId: 'shivajinagar', areaName: 'Shivajinagar', subtitle: '1200mm Storm Pipe Main', badgeText: 'P-101' },

  // Sensors
  { id: 'sensor-s101', title: 'Sensor S-101 (JM Underpass)', category: 'Sensors', areaId: 'shivajinagar', areaName: 'Shivajinagar', subtitle: 'LoRaWAN Water Depth Sensor', badgeText: 'S-101' },
  { id: 'sensor-s102', title: 'Sensor S-102 (FC Metro Flow)', category: 'Sensors', areaId: 'shivajinagar', areaName: 'Shivajinagar', subtitle: 'Doppler Velocity Sensor', badgeText: 'S-102' },
  { id: 'sensor-s103', title: 'Sensor S-103 (Mutha Gauge)', category: 'Sensors', areaId: 'shivajinagar', areaName: 'Shivajinagar', subtitle: 'Sangamwadi River Level Sensor', badgeText: 'S-103' },

  // CCTV
  { id: 'cctv-cam101', title: 'CAM-101 (JM Underpass)', category: 'CCTV', areaId: 'shivajinagar', areaName: 'Shivajinagar', subtitle: 'Subway Traffic Surveillance Camera', badgeText: 'CAM-101' },
  { id: 'cctv-cam102', title: 'CAM-102 (FC Road Junction)', category: 'CCTV', areaId: 'shivajinagar', areaName: 'Shivajinagar', subtitle: 'Garware College Junction Camera', badgeText: 'CAM-102' },
  { id: 'cctv-cam103', title: 'CAM-103 (Dengle Gate)', category: 'CCTV', areaId: 'shivajinagar', areaName: 'Shivajinagar', subtitle: 'Sluice Outfall Camera', badgeText: 'CAM-103' },
];
