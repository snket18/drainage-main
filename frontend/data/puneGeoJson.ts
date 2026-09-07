// Pune Shivajinagar Ward 14 Hydrodynamic GeoJSON Data Helper

export interface HotspotData {
  id: string;
  name: string;
  center: [number, number]; // [lng, lat]
  depthCm: number;
  capacityPct: number;
  status: 'CRITICAL' | 'WATCH' | 'SAFE';
  statusBadge: 'WARNING' | 'WATCH' | 'NORMAL';
  fillColor: string;
  strokeColor: string;
  fillOpacity: number;
  primarySensor: string;
  cctvCam: string;
}

export interface NodeMarkerData {
  id: string;
  name: string;
  type: 'SENSOR' | 'CCTV';
  coordinates: [number, number]; // [lng, lat]
  linkedHotspotId: string;
  waterDepthCm?: number;
  batteryPct?: number;
  status: 'CRITICAL' | 'WATCH' | 'NORMAL';
}

export const PUNE_CENTER: [number, number] = [73.8567, 18.5204];

export const PUNE_HOTSPOTS: HotspotData[] = [
  {
    id: 'HZ-01',
    name: 'JM Road Sancheti Circle Underpass',
    center: [73.8530, 18.5285],
    depthCm: 42,
    capacityPct: 92,
    status: 'CRITICAL',
    statusBadge: 'WARNING',
    fillColor: '#f43f5e',
    strokeColor: '#e11d48',
    fillOpacity: 0.4,
    primarySensor: 'S-01',
    cctvCam: 'CAM-01',
  },
  {
    id: 'HZ-02',
    name: 'FC Road Metro Station Gate 2',
    center: [73.8425, 18.5240],
    depthCm: 22,
    capacityPct: 74,
    status: 'WATCH',
    statusBadge: 'WATCH',
    fillColor: '#f59e0b',
    strokeColor: '#d97706',
    fillOpacity: 0.35,
    primarySensor: 'S-02',
    cctvCam: 'CAM-02',
  },
  {
    id: 'HZ-03',
    name: 'Lakaki Lake Basin',
    center: [73.8375, 18.5315],
    depthCm: 12,
    capacityPct: 35,
    status: 'SAFE',
    statusBadge: 'NORMAL',
    fillColor: '#0d9488',
    strokeColor: '#0f766e',
    fillOpacity: 0.25,
    primarySensor: 'S-05',
    cctvCam: 'CAM-04',
  },
  {
    id: 'HZ-04',
    name: 'Deccan Gymkhana Outfall',
    center: [73.8450, 18.5170],
    depthCm: 28,
    capacityPct: 68,
    status: 'WATCH',
    statusBadge: 'WATCH',
    fillColor: '#f59e0b',
    strokeColor: '#d97706',
    fillOpacity: 0.35,
    primarySensor: 'S-03',
    cctvCam: 'CAM-03',
  },
];

export const PUNE_NODE_MARKERS: NodeMarkerData[] = [
  {
    id: 'S-01',
    name: 'JM Road Ultrasonic Sensor Node',
    type: 'SENSOR',
    coordinates: [73.8530, 18.5285],
    linkedHotspotId: 'HZ-01',
    waterDepthCm: 42,
    batteryPct: 94,
    status: 'CRITICAL',
  },
  {
    id: 'CAM-01',
    name: 'Sancheti Underpass AI Vision Cam',
    type: 'CCTV',
    coordinates: [73.8535, 18.5288],
    linkedHotspotId: 'HZ-01',
    status: 'CRITICAL',
  },
  {
    id: 'S-02',
    name: 'FC Road Metro Telemetry Sensor',
    type: 'SENSOR',
    coordinates: [73.8425, 18.5240],
    linkedHotspotId: 'HZ-02',
    waterDepthCm: 22,
    batteryPct: 88,
    status: 'WATCH',
  },
  {
    id: 'CAM-02',
    name: 'FC Road Gate 2 Optical Feed',
    type: 'CCTV',
    coordinates: [73.8421, 18.5243],
    linkedHotspotId: 'HZ-02',
    status: 'WATCH',
  },
  {
    id: 'S-03',
    name: 'Deccan Outfall Hydro Sensor',
    type: 'SENSOR',
    coordinates: [73.8450, 18.5170],
    linkedHotspotId: 'HZ-04',
    waterDepthCm: 28,
    batteryPct: 91,
    status: 'WATCH',
  },
  {
    id: 'CAM-03',
    name: 'Deccan Gymkhana CCTV',
    type: 'CCTV',
    coordinates: [73.8453, 18.5173],
    linkedHotspotId: 'HZ-04',
    status: 'WATCH',
  },
  {
    id: 'S-05',
    name: 'Lakaki Lake Level Gauge',
    type: 'SENSOR',
    coordinates: [73.8375, 18.5315],
    linkedHotspotId: 'HZ-03',
    waterDepthCm: 12,
    batteryPct: 98,
    status: 'NORMAL',
  },
  {
    id: 'CAM-04',
    name: 'Model Colony Basin Monitor',
    type: 'CCTV',
    coordinates: [73.8372, 18.5318],
    linkedHotspotId: 'HZ-03',
    status: 'NORMAL',
  },
];

// Generates a circular polygon feature for GeoJSON
function createCirclePolygon(centerLng: number, centerLat: number, radiusInKm = 0.2, numPoints = 32): number[][][] {
  const ring: number[][] = [];
  const kmPerLng = 111.32 * Math.cos((centerLat * Math.PI) / 180);
  const kmPerLat = 110.574;

  for (let i = 0; i <= numPoints; i++) {
    const theta = (i / numPoints) * (2 * Math.PI);
    const dx = radiusInKm * Math.cos(theta);
    const dy = radiusInKm * Math.sin(theta);
    ring.push([centerLng + dx / kmPerLng, centerLat + dy / kmPerLat]);
  }

  return [ring];
}

// Generate GeoJSON FeatureCollection for Hotspot Inundation Polygons
export function getPuneHotspotGeoJSON(): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: PUNE_HOTSPOTS.map((hotspot) => {
      const radiusKm = hotspot.depthCm > 30 ? 0.24 : hotspot.depthCm > 20 ? 0.18 : 0.14;
      return {
        type: 'Feature',
        id: hotspot.id,
        properties: {
          id: hotspot.id,
          name: hotspot.name,
          depthCm: hotspot.depthCm,
          capacityPct: hotspot.capacityPct,
          status: hotspot.status,
          statusBadge: hotspot.statusBadge,
          fillColor: hotspot.fillColor,
          strokeColor: hotspot.strokeColor,
          fillOpacity: hotspot.fillOpacity,
          primarySensor: hotspot.primarySensor,
          cctvCam: hotspot.cctvCam,
          isInundated: hotspot.depthCm >= 20 ? 1 : 0,
        },
        geometry: {
          type: 'Polygon',
          coordinates: createCirclePolygon(hotspot.center[0], hotspot.center[1], radiusKm),
        },
      };
    }),
  };
}

// Mutha River Corridor GeoJSON Line & Polygon
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
        properties: {
          name: 'Mutha River Channel Corridor',
          status: 'NORMAL',
          type: 'river-line',
        },
        geometry: {
          type: 'LineString',
          coordinates: muthaCenterLine,
        },
      },
    ],
  };
}

// Drainage Network Pipe GeoJSON
export function getDrainageNetworkGeoJSON(): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { id: 'PIPE-01', name: 'JM Road Main Trunk Line', capacityPct: 92 },
        geometry: {
          type: 'LineString',
          coordinates: [
            [73.8530, 18.5285],
            [73.8480, 18.5260],
            [73.8450, 18.5170],
          ],
        },
      },
      {
        type: 'Feature',
        properties: { id: 'PIPE-02', name: 'FC Road Feeder Line', capacityPct: 74 },
        geometry: {
          type: 'LineString',
          coordinates: [
            [73.8425, 18.5240],
            [73.8450, 18.5170],
          ],
        },
      },
      {
        type: 'Feature',
        properties: { id: 'PIPE-03', name: 'Deccan Outfall to Mutha River', capacityPct: 68 },
        geometry: {
          type: 'LineString',
          coordinates: [
            [73.8450, 18.5170],
            [73.8440, 18.5170],
          ],
        },
      },
    ],
  };
}
