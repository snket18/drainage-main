'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { DEMO_STEPS, DemoStepState } from '@/data/demoSteps';
import {
  SENSORS_DATA,
  CCTV_DATA,
  PIPES_DATA,
  FIELD_WORKERS_DATA,
  Sensor,
  CCTVCamera,
  PipeNetwork,
  FieldWorker,
} from '@/data/mockData';
import { MUMBAI_AREAS, AreaData, SearchResultItem } from '@/data/searchData';

interface DemoContextType {
  currentStepIndex: number;
  stepState: DemoStepState;
  isPlaying: boolean;
  setStepIndex: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  togglePlay: () => void;
  resetDemo: () => void;

  // Selected Area State
  selectedAreaId: string;
  selectedArea: AreaData;
  setSelectedAreaId: (id: string) => void;
  setDynamicSelectedArea: (area: AreaData | null) => void;

  // Recent Search History
  recentSearches: SearchResultItem[];
  addRecentSearch: (item: SearchResultItem) => void;

  // Dynamic Derived Telemetry
  sensors: Sensor[];
  cctv: CCTVCamera[];
  pipes: PipeNetwork[];
  fieldWorkers: FieldWorker[];

  // Interactive What-If Overrides
  simulatorOverrides: {
    rainfallMmHr: number;
    muthaRiverLevelM: number;
    desiltingPct: number;
    extraPumpsActive: number;
  };
  setSimulatorOverrides: React.Dispatch<
    React.SetStateAction<{
      rainfallMmHr: number;
      muthaRiverLevelM: number;
      desiltingPct: number;
      extraPumpsActive: number;
    }>
  >;
  resetSimulatorOverrides: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedAreaId, setSelectedAreaId] = useState<string>('hindmata');
  const [recentSearches, setRecentSearches] = useState<SearchResultItem[]>([]);

  const [simulatorOverrides, setSimulatorOverrides] = useState({
    rainfallMmHr: 18,
    muthaRiverLevelM: 1.3,
    desiltingPct: 30,
    extraPumpsActive: 0,
  });

  const [dynamicSelectedArea, setDynamicSelectedArea] = useState<AreaData | null>(null);

  const [dbSensors, setDbSensors] = useState<Sensor[]>(SENSORS_DATA);
  const [dbAreas, setDbAreas] = useState<Record<string, Partial<AreaData>>>({});
  const [liveWeatherRainfall, setLiveWeatherRainfall] = useState<number | null>(null);

  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5100';
        const [areasRes, sensorsRes] = await Promise.all([
          fetch(`${API_BASE}/api/areas`),
          fetch(`${API_BASE}/api/sensors`)
        ]);
        
        if (areasRes.ok) {
          const areas: any[] = await areasRes.json();
          const areaDict: Record<string, Partial<AreaData>> = {};
          areas.forEach((a: any) => {
            areaDict[a.id] = {
              waterDepthCm: a.waterDepthCm,
              rainfallMmHr: a.rainfallMmHr,
              drainageCapacityPct: a.drainageCapacityPct,
              status: a.status,
              timeToCriticalMins: a.timeToCriticalMins,
            };
          });
          setDbAreas(areaDict);
        }

        if (sensorsRes.ok) {
          const sensors: any[] = await sensorsRes.json();
          setDbSensors(prev => {
            const merged = [...prev];
            sensors.forEach((ms: any) => {
              const idx = merged.findIndex(x => x.id === ms.id);
              if (idx >= 0) {
                merged[idx] = {
                  ...merged[idx],
                  value: ms.value,
                  unit: ms.unit,
                  battery: ms.batteryPct,
                };
              }
            });
            return merged;
          });
        }
      } catch (e) {
        console.error("Failed to fetch from Express backend", e);
      }
    };
    fetchBackendData();
    const interval = setInterval(fetchBackendData, 10000);
    return () => clearInterval(interval);
  }, []);

  const staticArea = MUMBAI_AREAS[selectedAreaId] || MUMBAI_AREAS.hindmata;
  const dbOverrides = dbAreas[selectedAreaId] || {};
  const computedSelectedArea = { ...staticArea, ...dbOverrides };
  const selectedArea = dynamicSelectedArea || computedSelectedArea;

  const stepState = DEMO_STEPS[currentStepIndex];

  const updateOverridesForStepAndArea = (stepIdx: number, areaId: string) => {
    const targetArea = MUMBAI_AREAS[areaId] || MUMBAI_AREAS.hindmata;
    const targetStep = DEMO_STEPS[stepIdx];
    const activeRain = targetArea.id === 'hindmata' ? targetStep.rainfallMmHr : targetArea.rainfallMmHr;
    setSimulatorOverrides({
      rainfallMmHr: activeRain,
      muthaRiverLevelM: targetStep.muthaRiverLevelM,
      desiltingPct: targetStep.stepIndex >= 5 ? 75 : 30,
      extraPumpsActive: targetStep.activePumpsCount,
    });
  };

  // Auto-play timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex((prevIdx) => {
          const nextIdx = prevIdx < DEMO_STEPS.length - 1 ? prevIdx + 1 : 0;
          updateOverridesForStepAndArea(nextIdx, selectedAreaId);
          return nextIdx;
        });
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, selectedAreaId]);

  // Automated Dispatch Notification Hook
  useEffect(() => {
    const step = DEMO_STEPS[currentStepIndex];
    if (step.stepCode === 'RESPOND') {
      toast.success(
        '📱 Automated Dispatch Triggered!', {
          description: 'Bypass navigation route sent to Field Ops (Dadar TT) via WhatsApp API.',
          duration: 10000,
        }
      );
    }
    if (step.stepCode === 'DETECT') {
      toast.error(
        '🚨 Critical Alert Detected', {
          description: 'Water levels rising rapidly at Hindmata. Evacuation protocols recommended.',
          duration: 5000,
        }
      );
    }
  }, [currentStepIndex]);

  const setStepIndex = (index: number) => {
    if (index >= 0 && index < DEMO_STEPS.length) {
      setCurrentStepIndex(index);
      updateOverridesForStepAndArea(index, selectedAreaId);
    }
  };

  const nextStep = () => {
    const nextIdx = currentStepIndex < DEMO_STEPS.length - 1 ? currentStepIndex + 1 : 0;
    setCurrentStepIndex(nextIdx);
    updateOverridesForStepAndArea(nextIdx, selectedAreaId);
  };

  const prevStep = () => {
    const prevIdx = currentStepIndex > 0 ? currentStepIndex - 1 : DEMO_STEPS.length - 1;
    setCurrentStepIndex(prevIdx);
    updateOverridesForStepAndArea(prevIdx, selectedAreaId);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    updateOverridesForStepAndArea(0, selectedAreaId);
  };

  const handleSetSelectedAreaId = (id: string) => {
    setSelectedAreaId(id);
    updateOverridesForStepAndArea(currentStepIndex, id);
  };

  const resetSimulatorOverrides = () => {
    const activeRain = selectedArea.id === 'hindmata' ? stepState.rainfallMmHr : selectedArea.rainfallMmHr;
    setSimulatorOverrides({
      rainfallMmHr: activeRain,
      muthaRiverLevelM: stepState.muthaRiverLevelM,
      desiltingPct: 30,
      extraPumpsActive: 0,
    });
  };

  const addRecentSearch = (item: SearchResultItem) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.id !== item.id);
      return [item, ...filtered].slice(0, 5);
    });
  };

  // Derive dynamic sensors based on current stepState and selectedArea
  const baseMaxWaterDepth = selectedArea.id === 'hindmata' ? stepState.maxWaterDepthCm : selectedArea.waterDepthCm;
  const baseRainfall = selectedArea.id === 'hindmata' ? stepState.rainfallMmHr : selectedArea.rainfallMmHr;
  const baseCapacity = selectedArea.id === 'hindmata' ? stepState.drainageCapacityPct : selectedArea.drainageCapacityPct;

  const [jitteredData, setJitteredData] = useState<{ rainfallMmHr: number, waterDepthCm: number, drainageCapacityPct: number } | null>(null);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch(`/api/telemetry?baseRain=${baseRainfall}&baseDepth=${baseMaxWaterDepth}&baseCapacity=${baseCapacity}`);
        const data = await res.json();
        setJitteredData(data);
      } catch (err) {
        console.error('Telemetry fetch failed', err);
      }
    };
    
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, [baseRainfall, baseMaxWaterDepth, baseCapacity]);

  useEffect(() => {
    if (!selectedArea?.centerCoordinates) return;
    const fetchLiveWeather = async () => {
      try {
        const { lat, lng } = selectedArea.centerCoordinates;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=precipitation&timezone=Asia%2FKolkata`;
        const res = await fetch(url);
        const data = await res.json();
        if (data?.current?.precipitation !== undefined) {
          setLiveWeatherRainfall(data.current.precipitation);
        }
      } catch (err) {
        console.error("Open-Meteo fetch failed", err);
      }
    };
    fetchLiveWeather();
    const interval = setInterval(fetchLiveWeather, 60000);
    return () => clearInterval(interval);
  }, [selectedArea?.centerCoordinates?.lat, selectedArea?.centerCoordinates?.lng]);

  const activeMaxWaterDepth = jitteredData?.waterDepthCm ?? baseMaxWaterDepth;
  const activeRainfall = liveWeatherRainfall !== null ? liveWeatherRainfall : (jitteredData?.rainfallMmHr ?? baseRainfall);
  const activeCapacity = jitteredData?.drainageCapacityPct ?? baseCapacity;

  const dynamicSensors: Sensor[] = dbSensors.map((s) => {
    if (s.id === 'S-01') {
      return {
        ...s,
        value: activeMaxWaterDepth,
        status:
          activeMaxWaterDepth >= 40
            ? 'critical'
            : activeMaxWaterDepth >= 20
            ? 'warning'
            : 'normal',
        trend: activeMaxWaterDepth > 20 ? (currentStepIndex >= 5 ? 'falling' : 'rising') : 'stable',
      };
    }
    if (s.id === 'S-03') {
      return {
        ...s,
        value: stepState.muthaRiverLevelM,
        status: stepState.muthaRiverLevelM >= 2.5 ? 'warning' : 'normal',
      };
    }
    if (s.id === 'S-06') {
      return {
        ...s,
        value: activeRainfall,
        status: activeRainfall >= 60 ? 'critical' : activeRainfall >= 30 ? 'warning' : 'normal',
      };
    }
    return s;
  });

  const dynamicCCTV: CCTVCamera[] = CCTV_DATA.map((cam) => {
    if (cam.id === 'CAM-01') {
      const isWaterlogged = selectedArea.id === 'hindmata' ? stepState.cctvStatus.aiWaterDetected : selectedArea.waterDepthCm > 20;
      return {
        ...cam,
        aiWaterDetection: isWaterlogged,
        waterDepthCm: activeMaxWaterDepth,
        trafficSpeedKmph: isWaterlogged ? 0 : 42,
        status: isWaterlogged ? 'alert' : 'online',
      };
    }
    return cam;
  });

  const dynamicPipes: PipeNetwork[] = PIPES_DATA.map((p) => {
    if (p.id === 'P-101') {
      return {
        ...p,
        loadPct: activeCapacity,
        currentFlowM3s: Number(((activeCapacity / 100) * p.capacityM3s).toFixed(2)),
        status:
          activeCapacity > 90
            ? 'overloaded'
            : activeCapacity > 60
            ? 'warning'
            : 'normal',
      };
    }
    return p;
  });

  const dynamicFieldWorkers: FieldWorker[] = FIELD_WORKERS_DATA.map((fw) => {
    if (fw.id === 'W-03') {
      return {
        ...fw,
        status: stepState.fieldWorkerState.status,
        locationName: stepState.fieldWorkerState.location,
        assignedTask:
          stepState.fieldWorkerState.status === 'PUMPING_ACTIVE'
            ? `Operating Dewatering Pump Unit #4 at ${selectedArea.name}`
            : fw.assignedTask,
      };
    }
    return fw;
  });

  return (
    <DemoContext.Provider
      value={{
        currentStepIndex,
        stepState,
        isPlaying,
        setStepIndex,
        nextStep,
        prevStep,
        togglePlay,
        resetDemo,
        selectedAreaId,
        selectedArea,
        setSelectedAreaId,
        setDynamicSelectedArea,
        recentSearches,
        addRecentSearch,
        sensors: dynamicSensors,
        cctv: dynamicCCTV,
        pipes: dynamicPipes,
        fieldWorkers: dynamicFieldWorkers,
        simulatorOverrides,
        setSimulatorOverrides,
        resetSimulatorOverrides,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};
