// Graph-Based Hydraulic Drainage Model Engine for FloodTwin
import {
  MUMBAI_DRAINAGE_NODES,
  MUMBAI_DRAINAGE_EDGES,
  DrainageNodeData,
  DrainageEdgeData,
} from '@/data/mumbaiDrainageNetwork';

export interface CalculatedNodeState extends DrainageNodeData {
  runoffLps: number;
  totalInflowLps: number;
  dischargeLps: number;
  excessInflowLps: number;
  surchargeDepthCm: number;
  status: 'SAFE' | 'WARNING' | 'CRITICAL';
}

export interface CalculatedEdgeState extends DrainageEdgeData {
  currentFlowLps: number;
  saturationPct: number;
  status: 'NORMAL' | 'SURCHARGING' | 'BACKFLOW';
  color: string;
}

export interface SimulationTimeStep {
  timeOffsetMinutes: number;
  timeLabel: string;
  rainfallIntensityMmHr: number;
  nodes: CalculatedNodeState[];
  edges: CalculatedEdgeState[];
  maxDepthCm: number;
  totalSurchargedNodesCount: number;
  inundatedHotspotsGeoJSON: GeoJSON.FeatureCollection;
  drainageNetworkGeoJSON: GeoJSON.FeatureCollection;
}

// Rational Method: Q = C * I * A
// C = Runoff coefficient (0.85 for concrete/impervious urban surface)
// I = Intensity in mm/hr
// A = Area in sq meters
// Returns flow Q in Liters per Second (L/s)
export function calculateRationalRunoffLps(intensityMmHr: number, areaSqM: number, runoffCoeff = 0.85): number {
  if (intensityMmHr <= 0 || areaSqM <= 0) return 0;
  // Q (m3/s) = C * (I / (1000 * 3600)) * A
  // Q (L/s) = Q (m3/s) * 1000 = C * (I / 3600) * A
  return (runoffCoeff * intensityMmHr * areaSqM) / 3600;
}

// Simulates the stormwater network DAG hydraulic state at a given rainfall intensity
export function runHydraulicSimulation(rainfallMmHr: number, timeOffsetMins = 0): SimulationTimeStep {
  const calculatedNodes: CalculatedNodeState[] = [];
  const calculatedEdges: CalculatedEdgeState[] = [];

  // 1. Calculate surface runoff for each node using the Rational Method
  const nodeMap = new Map<string, CalculatedNodeState>();

  MUMBAI_DRAINAGE_NODES.forEach((node) => {
    const runoffLps = calculateRationalRunoffLps(rainfallMmHr, node.catchmentAreaSqM);
    const nodeState: CalculatedNodeState = {
      ...node,
      runoffLps: Math.round(runoffLps),
      totalInflowLps: Math.round(runoffLps),
      dischargeLps: 0,
      excessInflowLps: 0,
      surchargeDepthCm: 0,
      status: 'SAFE',
    };
    nodeMap.set(node.id, nodeState);
  });

  // 2. Propagate hydraulic flow through DAG pipe edges
  MUMBAI_DRAINAGE_EDGES.forEach((edge) => {
    const sourceNode = nodeMap.get(edge.fromNodeId);
    const targetNode = nodeMap.get(edge.toNodeId);

    const inflow = sourceNode ? sourceNode.totalInflowLps : 0;
    const currentFlowLps = Math.min(inflow, edge.maxDischargeLps);
    const saturationPct = Math.min(Math.round((currentFlowLps / edge.maxDischargeLps) * 100), 100);

    let status: 'NORMAL' | 'SURCHARGING' | 'BACKFLOW' = 'NORMAL';
    let color = '#10b981'; // Green <60%

    if (saturationPct >= 85) {
      status = 'BACKFLOW';
      color = '#f43f5e'; // Red >85%
    } else if (saturationPct >= 60) {
      status = 'SURCHARGING';
      color = '#f59e0b'; // Amber 60-85%
    }

    calculatedEdges.push({
      ...edge,
      currentFlowLps: Math.round(currentFlowLps),
      saturationPct,
      status,
      color,
    });

    // Accumulate downstream inflow to target node
    if (targetNode) {
      targetNode.totalInflowLps += Math.round(currentFlowLps * 0.75); // Loss/attenuation factor
    }
  });

  // 3. Calculate surcharging & street surface water depth for each node
  let maxDepthCm = 0;
  let surchargedCount = 0;

  nodeMap.forEach((node) => {
    const excess = Math.max(0, node.totalInflowLps - node.maxCapacityLps);
    node.excessInflowLps = Math.round(excess);

    // Convert excess surcharged L/s into street water depth in cm (based on local road depression area ~ 150m2)
    const depressionAreaSqM = 150;
    const depthCm = Math.min(Math.round((excess / (depressionAreaSqM * 10)) * 1.5), 95);
    node.surchargeDepthCm = depthCm;

    if (depthCm >= 30) {
      node.status = 'CRITICAL';
      surchargedCount++;
    } else if (depthCm >= 15) {
      node.status = 'WARNING';
      surchargedCount++;
    } else {
      node.status = 'SAFE';
    }

    if (depthCm > maxDepthCm) {
      maxDepthCm = depthCm;
    }

    calculatedNodes.push(node);
  });

  // 4. Generate GeoJSON FeatureCollections for MapLibre rendering
  const inundatedHotspotsGeoJSON = generateInundationGeoJSON(calculatedNodes);
  const drainageNetworkGeoJSON = generateNetworkGeoJSON(calculatedNodes, calculatedEdges);

  const timeLabel =
    timeOffsetMins === 0
      ? 'T + 0 min (Now)'
      : `T + ${timeOffsetMins} min (Nowcast)`;

  return {
    timeOffsetMinutes: timeOffsetMins,
    timeLabel,
    rainfallIntensityMmHr: rainfallMmHr,
    nodes: calculatedNodes,
    edges: calculatedEdges,
    maxDepthCm,
    totalSurchargedNodesCount: surchargedCount,
    inundatedHotspotsGeoJSON,
    drainageNetworkGeoJSON,
  };
}

// Generate circular polygon buffers for inundation zones based on calculated node depths
function generateInundationGeoJSON(nodes: CalculatedNodeState[]): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = nodes.map((node) => {
    const depthCm = node.surchargeDepthCm;
    const radiusKm = depthCm >= 30 ? 0.22 : depthCm >= 15 ? 0.16 : 0.11;
    const ring = createCirclePolygon(node.coordinates[0], node.coordinates[1], radiusKm);

    const fillColor =
      node.status === 'CRITICAL'
        ? '#f43f5e'
        : node.status === 'WARNING'
        ? '#f59e0b'
        : '#10b981';

    const strokeColor =
      node.status === 'CRITICAL'
        ? '#e11d48'
        : node.status === 'WARNING'
        ? '#d97706'
        : '#059669';

    return {
      type: 'Feature',
      id: node.id,
      properties: {
        id: node.id,
        name: node.name,
        depthCm: node.surchargeDepthCm,
        capacityPct: Math.min(Math.round((node.totalInflowLps / node.maxCapacityLps) * 100), 100),
        status: node.status,
        fillColor,
        strokeColor,
        fillOpacity: node.status === 'CRITICAL' ? 0.45 : node.status === 'WARNING' ? 0.35 : 0.2,
        primarySensor: node.linkedSensorId || 'S-01',
        cctvCam: node.linkedCctvId || 'CAM-01',
        isInundated: depthCm >= 15 ? 1 : 0,
      },
      geometry: {
        type: 'Polygon',
        coordinates: ring,
      },
    };
  });

  return { type: 'FeatureCollection', features };
}

// Generate GeoJSON for stormwater network nodes & edges
function generateNetworkGeoJSON(
  nodes: CalculatedNodeState[],
  edges: CalculatedEdgeState[]
): GeoJSON.FeatureCollection {
  const nodeMap = new Map<string, CalculatedNodeState>(nodes.map((n) => [n.id, n]));

  const edgeFeatures: GeoJSON.Feature[] = edges.map((edge) => {
    const source = nodeMap.get(edge.fromNodeId);
    const target = nodeMap.get(edge.toNodeId);

    const coords = source && target ? [source.coordinates, target.coordinates] : [];

    return {
      type: 'Feature',
      id: edge.id,
      properties: {
        id: edge.id,
        name: edge.name,
        saturationPct: edge.saturationPct,
        currentFlowLps: edge.currentFlowLps,
        maxDischargeLps: edge.maxDischargeLps,
        color: edge.color,
        status: edge.status,
      },
      geometry: {
        type: 'LineString',
        coordinates: coords,
      },
    };
  });

  return { type: 'FeatureCollection', features: edgeFeatures };
}

function createCirclePolygon(centerLng: number, centerLat: number, radiusKm: number, points = 32): number[][][] {
  const ring: number[][] = [];
  const kmPerLng = 111.32 * Math.cos((centerLat * Math.PI) / 180);
  const kmPerLat = 110.574;

  for (let i = 0; i <= points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const dx = radiusKm * Math.cos(theta);
    const dy = radiusKm * Math.sin(theta);
    ring.push([centerLng + dx / kmPerLng, centerLat + dy / kmPerLat]);
  }

  return [ring];
}

// Preset 0-3 Hour Hydrodynamic Forecast Profiles
export const NOWCAST_TIME_STEPS: { offsetMins: number; label: string; rainfallMmHr: number }[] = [
  { offsetMins: 0, label: 'T + 0 min', rainfallMmHr: 18 },
  { offsetMins: 30, label: 'T + 30 min', rainfallMmHr: 45 },
  { offsetMins: 60, label: 'T + 60 min (Peak)', rainfallMmHr: 82 },
  { offsetMins: 120, label: 'T + 120 min', rainfallMmHr: 38 },
  { offsetMins: 180, label: 'T + 180 min', rainfallMmHr: 12 },
];
