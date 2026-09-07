export interface DemoStepState {
  stepIndex: number; // 0 to 7
  stepCode: 'PREDICT' | 'PREVENT' | 'DETECT' | 'VERIFY' | 'DIAGNOSE' | 'RESPOND' | 'VERIFY_RESOLUTION' | 'RESOLVE';
  phase: 'BEFORE FLOOD' | 'FLOOD OCCURS' | 'RESOLUTION';
  title: string;
  subtitle: string;
  badgeText: string;
  badgeVariant: 'green' | 'yellow' | 'red' | 'purple' | 'blue';
  
  // Dynamic Telemetry Metrics
  rainfallMmHr: number;
  maxWaterDepthCm: number;
  muthaRiverLevelM: number;
  drainageCapacityPct: number;
  activePumpsCount: number;
  timeToCriticalMins: number | null;
  affectedRoadsCount: number;
  
  activeAlert?: {
    id: string;
    type: 'preventive' | 'emergency' | 'system' | 'resolution';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    recommendedAction: string;
  };
  
  cctvStatus: {
    cameraName: string;
    aiWaterDetected: boolean;
    depthCm: number;
    speedKmph: number;
  };

  interventionState: {
    recommended: string;
    status: string;
    targetLocation: string;
  };

  routingState: {
    jmRoadStatus: 'OPEN' | 'WARNING' | 'CLOSED_FLOODED' | 'CLEARING';
    safestRouteVia: string;
    riskDelayMins: number;
  };

  fieldWorkerState: {
    unit: string;
    status: 'IDLE' | 'DISPATCHED' | 'PUMPING_ACTIVE' | 'TASK_COMPLETED';
    location: string;
  };
}

export const DEMO_STEPS: DemoStepState[] = [
  // STEP 1: PREDICT
  {
    stepIndex: 0,
    stepCode: 'PREDICT',
    phase: 'BEFORE FLOOD',
    title: '1. Rainfall Nowcast Prediction',
    subtitle: 'Doppler Radar detects convective cloud front approaching catchment area',
    badgeText: 'HEAVY RAIN PROJECTED IN ~30 MIN',
    badgeVariant: 'yellow',
    rainfallMmHr: 18,
    maxWaterDepthCm: 12,
    muthaRiverLevelM: 1.3,
    drainageCapacityPct: 38,
    activePumpsCount: 0,
    timeToCriticalMins: 45,
    affectedRoadsCount: 0,
    activeAlert: {
      id: 'ALT-101',
      type: 'preventive',
      severity: 'medium',
      title: 'Convective Storm Approaching Catchment',
      description: 'Doppler Weather Radar projects rainfall velocity of 35-45 mm/hr within 30 minutes.',
      recommendedAction: 'Inspect storm grates and prepare sluice gate pre-discharge.',
    },
    cctvStatus: {
      cameraName: 'JM Road Underpass',
      aiWaterDetected: false,
      depthCm: 12,
      speedKmph: 42,
    },
    interventionState: {
      recommended: 'Pre-clear Culvert C-14 & position Pump Unit #4 on standby',
      status: 'PREVENTIVE ADVISORY',
      targetLocation: 'JM Road Underpass',
    },
    routingState: {
      jmRoadStatus: 'OPEN',
      safestRouteVia: 'JM Road Direct',
      riskDelayMins: 0,
    },
    fieldWorkerState: {
      unit: 'Dewatering Unit #4',
      status: 'IDLE',
      location: 'COEP Depot',
    },
  },

  // STEP 2: PREVENT
  {
    stepIndex: 1,
    stepCode: 'PREVENT',
    phase: 'BEFORE FLOOD',
    title: '2. Preventive Municipal Dispatch',
    subtitle: 'System calculates time-to-failure & issues pre-discharge order',
    badgeText: 'PREVENTIVE DISPATCH: SLUICE GATE #2',
    badgeVariant: 'blue',
    rainfallMmHr: 35,
    maxWaterDepthCm: 18,
    muthaRiverLevelM: 1.5,
    drainageCapacityPct: 58,
    activePumpsCount: 0,
    timeToCriticalMins: 25,
    affectedRoadsCount: 0,
    activeAlert: {
      id: 'ALT-102',
      type: 'preventive',
      severity: 'high',
      title: 'Time-to-Critical Waterlogging: ~25 Minutes',
      description: 'Drainage network P-101 approaching 58% capacity. Pre-discharge gate to create storage headroom.',
      recommendedAction: 'Execute Gate #2 opening (30%) & dispatch maintenance crew to clear silt trap.',
    },
    cctvStatus: {
      cameraName: 'JM Road Underpass',
      aiWaterDetected: false,
      depthCm: 18,
      speedKmph: 35,
    },
    interventionState: {
      recommended: 'Open Dengle Sluice Gate #2 (30%) for flood headroom',
      status: 'ACTION DISPATCHED',
      targetLocation: 'Dengle Mutha Gate',
    },
    routingState: {
      jmRoadStatus: 'WARNING',
      safestRouteVia: 'JM Road (Slow traffic)',
      riskDelayMins: 4,
    },
    fieldWorkerState: {
      unit: 'Team Bravo (M. Shinde)',
      status: 'DISPATCHED',
      location: 'En Route to Dengle Gate',
    },
  },

  // STEP 3: DETECT
  {
    stepIndex: 2,
    stepCode: 'DETECT',
    phase: 'FLOOD OCCURS',
    title: '3. Cloudburst & Sensor Anomaly Detection',
    subtitle: '85 mm/hr cloudburst strikes area. Ultrasonic Sensor S-101 depth spikes',
    badgeText: 'WATERLOGGING DETECTED AT SUBWAY',
    badgeVariant: 'red',
    rainfallMmHr: 85,
    maxWaterDepthCm: 48,
    muthaRiverLevelM: 2.8,
    drainageCapacityPct: 98,
    activePumpsCount: 0,
    timeToCriticalMins: 0,
    affectedRoadsCount: 2,
    activeAlert: {
      id: 'ALT-103',
      type: 'emergency',
      severity: 'critical',
      title: 'CRITICAL INUNDATION: Subway Depth 48cm',
      description: 'Sensor S-101 reached 48 cm water depth (threshold 30 cm breached). Hydraulic surcharge detected.',
      recommendedAction: 'Deploy Mobile Dewatering Pump #4 and restrict subway access.',
    },
    cctvStatus: {
      cameraName: 'JM Road Underpass',
      aiWaterDetected: true,
      depthCm: 48,
      speedKmph: 0,
    },
    interventionState: {
      recommended: 'Deploy Mobile Dewatering Pump Unit #4 (500 HP, 1.2 m³/s rate)',
      status: 'ACTION REQUIRED',
      targetLocation: 'JM Road Underpass Sump',
    },
    routingState: {
      jmRoadStatus: 'CLOSED_FLOODED',
      safestRouteVia: 'FC Road Flyover (Safest Route)',
      riskDelayMins: 14,
    },
    fieldWorkerState: {
      unit: 'Dewatering Unit #4',
      status: 'DISPATCHED',
      location: 'Mobilizing to Underpass',
    },
  },

  // STEP 4: VERIFY
  {
    stepIndex: 3,
    stepCode: 'VERIFY',
    phase: 'FLOOD OCCURS',
    title: '4. CCTV Camera Observation Verification',
    subtitle: 'Visual observation analysis confirms standing water depth and traffic slowdown',
    badgeText: 'VERIFIED: 48 CM INUNDATION ON ROADWAY',
    badgeVariant: 'purple',
    rainfallMmHr: 80,
    maxWaterDepthCm: 48,
    muthaRiverLevelM: 2.9,
    drainageCapacityPct: 96,
    activePumpsCount: 0,
    timeToCriticalMins: 0,
    affectedRoadsCount: 2,
    activeAlert: {
      id: 'ALT-104',
      type: 'emergency',
      severity: 'critical',
      title: 'Camera Observation: Inundation Confirmed',
      description: 'Camera CAM-101 confirms 48 cm standing water and halted traffic. Cross-verified with Sensor S-101.',
      recommendedAction: 'Issue traffic diversion & activate pumping intervention #PMP-04.',
    },
    cctvStatus: {
      cameraName: 'JM Road Underpass',
      aiWaterDetected: true,
      depthCm: 48,
      speedKmph: 0,
    },
    interventionState: {
      recommended: 'Mobilize Dewatering Pump Unit #4 & close subway barrier',
      status: 'VERIFIED & EXECUTING',
      targetLocation: 'JM Road Underpass',
    },
    routingState: {
      jmRoadStatus: 'CLOSED_FLOODED',
      safestRouteVia: 'FC Road Flyover (Rerouted)',
      riskDelayMins: 14,
    },
    fieldWorkerState: {
      unit: 'Team Alpha (S. Patil)',
      status: 'DISPATCHED',
      location: 'Setting up diversion barriers',
    },
  },

  // STEP 5: DIAGNOSE
  {
    stepIndex: 4,
    stepCode: 'DIAGNOSE',
    phase: 'FLOOD OCCURS',
    title: '5. Hydraulic Cause Diagnosis',
    subtitle: 'Hydrodynamic model pinpoints root cause: Culvert C-14 silt restriction + Mutha River surcharge',
    badgeText: 'DIAGNOSIS: CULVERT SILT (55%) + RIVER SURCHARGE',
    badgeVariant: 'yellow',
    rainfallMmHr: 60,
    maxWaterDepthCm: 44,
    muthaRiverLevelM: 3.1,
    drainageCapacityPct: 92,
    activePumpsCount: 1,
    timeToCriticalMins: 0,
    affectedRoadsCount: 2,
    activeAlert: {
      id: 'ALT-105',
      type: 'system',
      severity: 'high',
      title: 'Cause Diagnosis: Compound Bottleneck',
      description: 'Mutha river stage height (3.1m) causes backwater head at outfall while Culvert C-14 is 55% silt-restricted.',
      recommendedAction: 'Divert storm flow to retention basin & run mobile pump at full discharge rate.',
    },
    cctvStatus: {
      cameraName: 'JM Road Underpass',
      aiWaterDetected: true,
      depthCm: 44,
      speedKmph: 0,
    },
    interventionState: {
      recommended: 'Run Dewatering Pump #4 (1.2 m³/s) + Divert flow to Retention Basin B-02',
      status: 'ACTIVE PUMPING',
      targetLocation: 'JM Underpass Sump',
    },
    routingState: {
      jmRoadStatus: 'CLOSED_FLOODED',
      safestRouteVia: 'FC Road Flyover',
      riskDelayMins: 12,
    },
    fieldWorkerState: {
      unit: 'Dewatering Unit #4',
      status: 'PUMPING_ACTIVE',
      location: 'JM Underpass Dewatering Station',
    },
  },

  // STEP 6: RESPOND
  {
    stepIndex: 5,
    stepCode: 'RESPOND',
    phase: 'FLOOD OCCURS',
    title: '6. Dewatering Response & Emergency Routing',
    subtitle: 'Mobile Pump #4 discharging at 1.2 m³/s; traffic diverted via Safest Route',
    badgeText: 'RESPONSE ACTIVE: PUMPING 1.2 M³/S',
    badgeVariant: 'blue',
    rainfallMmHr: 22,
    maxWaterDepthCm: 28,
    muthaRiverLevelM: 2.6,
    drainageCapacityPct: 72,
    activePumpsCount: 1,
    timeToCriticalMins: null,
    affectedRoadsCount: 1,
    activeAlert: {
      id: 'ALT-106',
      type: 'system',
      severity: 'medium',
      title: 'Dewatering Pump Unit #4 Active',
      description: 'Water depth receded from 48 cm to 28 cm. Discharge rate: 1.2 m³/s.',
      recommendedAction: 'Maintain pumping until water depth reaches normal range (<15 cm).',
    },
    cctvStatus: {
      cameraName: 'JM Road Underpass',
      aiWaterDetected: true,
      depthCm: 28,
      speedKmph: 15,
    },
    interventionState: {
      recommended: 'Mobile Dewatering Pump #4 discharging water to Mutha river outfall',
      status: 'EXECUTING',
      targetLocation: 'JM Underpass Outfall',
    },
    routingState: {
      jmRoadStatus: 'CLEARING',
      safestRouteVia: 'FC Road Flyover',
      riskDelayMins: 6,
    },
    fieldWorkerState: {
      unit: 'Dewatering Unit #4',
      status: 'PUMPING_ACTIVE',
      location: 'JM Underpass Sump',
    },
  },

  // STEP 7: VERIFY_RESOLUTION
  {
    stepIndex: 6,
    stepCode: 'VERIFY_RESOLUTION',
    phase: 'RESOLUTION',
    title: '7. Dual Resolution Verification',
    subtitle: 'Sensor S-101 (14 cm) & CCTV observation confirm roadway clear',
    badgeText: 'VERIFYING: DEPTH 14 CM | ROAD CLEAR',
    badgeVariant: 'blue',
    rainfallMmHr: 8,
    maxWaterDepthCm: 14,
    muthaRiverLevelM: 1.8,
    drainageCapacityPct: 44,
    activePumpsCount: 1,
    timeToCriticalMins: null,
    affectedRoadsCount: 0,
    activeAlert: {
      id: 'ALT-107',
      type: 'resolution',
      severity: 'low',
      title: 'Resolution Verification in Progress',
      description: 'Sensor S-101 reads 14 cm. Camera observation confirms clear roadway. Traffic safe for reopening.',
      recommendedAction: 'Decommission Pump Unit #4 and reopen traffic lane.',
    },
    cctvStatus: {
      cameraName: 'JM Road Underpass',
      aiWaterDetected: false,
      depthCm: 14,
      speedKmph: 38,
    },
    interventionState: {
      recommended: 'Decommission Mobile Dewatering Pump Unit #4',
      status: 'VERIFYING COMPLETION',
      targetLocation: 'JM Road Underpass',
    },
    routingState: {
      jmRoadStatus: 'CLEARING',
      safestRouteVia: 'JM Road Reopening',
      riskDelayMins: 2,
    },
    fieldWorkerState: {
      unit: 'Team Alpha (S. Patil)',
      status: 'TASK_COMPLETED',
      location: 'Reopening road barriers',
    },
  },

  // STEP 8: RESOLVE
  {
    stepIndex: 7,
    stepCode: 'RESOLVE',
    phase: 'RESOLUTION',
    title: '8. Incident Resolved & Normal Operations',
    subtitle: 'Subway fully cleared, normal drainage capacity restored, report generated',
    badgeText: 'INCIDENT RESOLVED: NORMAL STATUS RESTORED',
    badgeVariant: 'green',
    rainfallMmHr: 4,
    maxWaterDepthCm: 10,
    muthaRiverLevelM: 1.4,
    drainageCapacityPct: 30,
    activePumpsCount: 0,
    timeToCriticalMins: null,
    affectedRoadsCount: 0,
    activeAlert: {
      id: 'ALT-108',
      type: 'resolution',
      severity: 'low',
      title: 'Incident #PMC-882 Resolved',
      description: 'Sensors within normal thresholds. 100% drainage capacity restored. Event log archived.',
      recommendedAction: 'No further action required. Baseline monitoring active.',
    },
    cctvStatus: {
      cameraName: 'JM Road Underpass',
      aiWaterDetected: false,
      depthCm: 10,
      speedKmph: 45,
    },
    interventionState: {
      recommended: 'Baseline monitoring active',
      status: 'COMPLETED & ARCHIVED',
      targetLocation: 'Municipal Control Center',
    },
    routingState: {
      jmRoadStatus: 'OPEN',
      safestRouteVia: 'JM Road Direct',
      riskDelayMins: 0,
    },
    fieldWorkerState: {
      unit: 'Dewatering Unit #4',
      status: 'IDLE',
      location: 'Returned to Depot',
    },
  },
];
