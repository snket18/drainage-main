'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { MapFilterOption } from '@/components/map/MapLibreFloodMap';
import { NowcastTimeSlider } from '@/components/map/NowcastTimeSlider';
import { AreaRiskDrawer } from '@/components/map/AreaRiskDrawer';
import { PUNE_WARDS_DATA, PuneWardArea } from '@/data/puneWardsData';
import {
  runHydraulicSimulation,
  NOWCAST_TIME_STEPS,
  CalculatedNodeState,
} from '@/utils/drainageGraphEngine';
import { computeEmergencyRoutes } from '@/utils/emergencyRouting';
import {
  Map,
  Filter,
  ShieldAlert,
  Cpu,
  Video,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Activity,
  Navigation,
  Wrench,
  Users,
  Bell,
  Search,
  Radio,
} from 'lucide-react';

// CRITICAL SSR CONSTRAINT: Dynamic import with ssr: false
const MapLibreFloodMap = dynamic(
  () => import('@/components/map/MapLibreFloodMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] min-h-[500px] bg-slate-50 rounded-sm border border-slate-200  flex flex-col items-center justify-center space-y-3 shadow-xs">
        <div className="w-9 h-9 border-3 border-slate-900 border-t-transparent rounded-sm animate-spin"></div>
        <div className="text-center space-y-1">
          <p className="text-xs font-semibold text-slate-700 font-mono tracking-wider uppercase">
            Loading Hydrodynamic GIS Model...
          </p>
          <p className="text-[11px] text-slate-500">
            OpenStreetMap Raster Engine · Pune Municipal Transit Hubs
          </p>
        </div>
      </div>
    ),
  }
);

export default function LiveMapPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [filterOption, setFilterOption] = useState<MapFilterOption>('ALL');
  const [selectedWardId, setSelectedWardId] = useState<string>('shivajinagar');
  const [showBypassRoute, setShowBypassRoute] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const currentStep = NOWCAST_TIME_STEPS[currentStepIndex] || NOWCAST_TIME_STEPS[0];

  // Selected Ward Area data object
  const selectedWardArea: PuneWardArea =
    PUNE_WARDS_DATA.find((w) => w.id === selectedWardId) || PUNE_WARDS_DATA[0];

  // 1. Run Hydraulic Simulation Engine for current time step
  const simulationState = useMemo(() => {
    return runHydraulicSimulation(currentStep.rainfallMmHr, currentStep.offsetMins);
  }, [currentStep.rainfallMmHr, currentStep.offsetMins]);

  // Filtered search results
  const searchFilteredWards = useMemo(() => {
    if (!searchQuery.trim()) return PUNE_WARDS_DATA;
    const q = searchQuery.toLowerCase();
    return PUNE_WARDS_DATA.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.ward.toLowerCase().includes(q) ||
        w.criticalNodes.some((n) => n.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleSelectWard = (ward: PuneWardArea) => {
    setSelectedWardId(ward.id);
    setShowBypassRoute(true);
    setActionNotice(`Navigated to ${ward.name} (${ward.ward}). Camera center flyTo executed.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      {/* Action Notice Banner */}
      {actionNotice && (
        <div className="bg-slate-900 text-white px-4 py-3 rounded-sm shadow-sm flex items-center justify-between  slide-in- text-xs font-semibold">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 " />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-slate-400 hover:text-white font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Page Municipal Header & Search Bar */}
      <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-2 mb-1">
            <MapPin className="w-3.5 h-3.5 text-slate-600" />
            <span>Pune Transit Hub Navigator · FloodTwin GIS</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Interactive Area Search & Safe Bypass Navigator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-normal">
            Search major Pune flood-sensitive transit hubs (Swargate, Shivajinagar, Deccan, Sinhagad Rd) to trigger camera flyTo and render safe emergency bypass corridors.
          </p>
        </div>

        {/* Hub Fast Selector Pills & Search Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Swargate, Deccan, Sinhagad..."
              className="bg-slate-50 border border-slate-200 rounded-sm pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 w-full sm:w-60 font-medium"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-sm border border-slate-200 text-xs">
            {PUNE_WARDS_DATA.map((ward) => (
              <button
                key={ward.id}
                onClick={() => handleSelectWard(ward)}
                className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all cursor-pointer ${
                  selectedWardId === ward.id
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {ward.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 0–3 Hour Interactive Time Slider */}
      <NowcastTimeSlider
        currentStepIndex={currentStepIndex}
        onStepChange={setCurrentStepIndex}
        rainfallMmHr={simulationState.rainfallIntensityMmHr}
        maxDepthCm={simulationState.maxDepthCm}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
      />

      {/* Main Grid: Interactive Map (8 Cols) + Area Telemetry Drawer (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Map Workspace */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          <MapLibreFloodMap
            filter={filterOption}
            heightClass="h-[600px] min-h-[500px]"
            inundatedGeoJSON={simulationState.inundatedHotspotsGeoJSON}
            networkGeoJSON={simulationState.drainageNetworkGeoJSON}
            nodes={simulationState.nodes}
            edges={simulationState.edges}
            selectedWardArea={selectedWardArea}
            showBypassOverlay={showBypassRoute}
          />
        </div>

        {/* Right Telemetry & Safe Bypass Drawer */}
        <div className="lg:col-span-4 flex flex-col">
          <AreaRiskDrawer
            area={selectedWardArea}
            showBypassRoute={showBypassRoute}
            onToggleBypassRoute={() => setShowBypassRoute(!showBypassRoute)}
          />
        </div>
      </div>
    </div>
  );
}
