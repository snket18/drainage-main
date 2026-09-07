// Emergency Transit Pathfinding & Flood Avoidance Routing Engine for FloodTwin
import {
  MUMBAI_ROAD_NODES,
  MUMBAI_ROAD_SEGMENTS,
  RoadNode,
  RoadSegment,
} from '@/data/mumbaiDrainageNetwork';
import { CalculatedNodeState } from './drainageGraphEngine';

export interface RouteResult {
  id: 'safest' | 'standard';
  title: string;
  description: string;
  totalDistanceMeters: number;
  estimatedTimeMins: number;
  avoidedChokePoints: string[];
  maxWaterDepthEncounteredCm: number;
  isSafeForEmergencyVehicles: boolean;
  segments: RoadSegment[];
  geoJsonLineString: GeoJSON.FeatureCollection;
}

export function computeEmergencyRoutes(
  nodes: CalculatedNodeState[],
  wadingThresholdCm = 20
): { safestRoute: RouteResult; standardRoute: RouteResult; timeSavedMins: number } {
  // Find maximum water depth at Sancheti Circle underpass & FC Road
  const sanchetiNode = nodes.find((n) => n.id === 'N-01');
  const fcRoadNode = nodes.find((n) => n.id === 'N-02');

  const sanchetiDepth = sanchetiNode ? sanchetiNode.surchargeDepthCm : 42;
  const fcRoadDepth = fcRoadNode ? fcRoadNode.surchargeDepthCm : 18;

  const isSanchetiBlocked = sanchetiDepth >= wadingThresholdCm;

  // Standard Route (Direct through Sancheti Underpass)
  const standardSegments = MUMBAI_ROAD_SEGMENTS.filter(
    (s) => s.id === 'RS-01' || s.id === 'RS-03'
  );
  const standardDist = standardSegments.reduce((acc, s) => acc + s.distanceMeters, 0);
  const standardDelayPenalty = isSanchetiBlocked ? Math.round(sanchetiDepth * 0.4) : 0;
  const standardTimeMins = Math.round((standardDist / 600) + standardDelayPenalty);

  // Safest Emergency Bypass Route (Bypasses Sancheti Circle via FC Road & Hindmata Flyover)
  const safeSegments = MUMBAI_ROAD_SEGMENTS.filter(
    (s) => s.id === 'RS-02' || s.id === 'RS-04'
  );
  const safeDist = safeSegments.reduce((acc, s) => acc + s.distanceMeters, 0);
  const safeTimeMins = Math.round(safeDist / 700);

  const standardGeoJson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Standard Route (Direct)', type: 'standard-route' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [73.8425, 18.5240],
            [73.8490, 18.5260],
            [73.8530, 18.5285],
            [73.8570, 18.5290],
          ],
        },
      },
    ],
  };

  const safeGeoJson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Emergency Safe Bypass Route', type: 'safe-route' },
        geometry: {
          type: 'LineString',
          coordinates: [
            [73.8425, 18.5240],
            [73.8410, 18.5290],
            [73.8480, 18.5330],
            [73.8540, 18.5310],
            [73.8570, 18.5290],
          ],
        },
      },
    ],
  };

  const standardRoute: RouteResult = {
    id: 'standard',
    title: 'Standard Direct Route',
    description: 'Direct route via JM Road Sancheti Underpass.',
    totalDistanceMeters: standardDist,
    estimatedTimeMins: standardTimeMins,
    avoidedChokePoints: [],
    maxWaterDepthEncounteredCm: sanchetiDepth,
    isSafeForEmergencyVehicles: !isSanchetiBlocked,
    segments: standardSegments,
    geoJsonLineString: standardGeoJson,
  };

  const safestRoute: RouteResult = {
    id: 'safest',
    title: 'Emergency Flood-Aware Route',
    description: 'Elevated bypass routing around Sancheti Circle via FC Road & Hindmata Station.',
    totalDistanceMeters: safeDist,
    estimatedTimeMins: safeTimeMins,
    avoidedChokePoints: isSanchetiBlocked ? ['JM Road Sancheti Circle Underpass'] : [],
    maxWaterDepthEncounteredCm: fcRoadDepth,
    isSafeForEmergencyVehicles: true,
    segments: safeSegments,
    geoJsonLineString: safeGeoJson,
  };

  const timeSavedMins = Math.max(0, standardTimeMins - safeTimeMins);

  return {
    safestRoute,
    standardRoute,
    timeSavedMins,
  };
}
