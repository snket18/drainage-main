'use client';

import React, { useState } from 'react';
import { useDemo } from '@/context/DemoContext';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import {
  Map,
  Filter,
  Layers,
  ShieldAlert,
  Cpu,
  Video,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  Info,
  Eye,
} from 'lucide-react';
import Link from 'next/link';

export default function LiveMapPage() {
  const { stepState, selectedArea, sensors, cctv, setSelectedAreaId } = useDemo();
  const [filterRisk, setFilterRisk] = useState<'all' | 'critical' | 'normal'>('all');
  const [activeRightTab, setActiveRightTab] = useState<'overview' | 'routes' | 'sensors' | 'cctv'>('overview');
  const [selectedRouteType, setSelectedRouteType] = useState<'safest' | 'fastest'>('safest');

  const isFlooded = stepState.maxWaterDepthCm > 20;

  const hotspots = [
    {
      id: 'HZ-01',
      name: 'JM Road Underpass (Sancheti Circle)',
      coordinates: '18.5312° N, 73.8482° E',
      waterDepthCm: stepState.maxWaterDepthCm,
      capacityPct: stepState.drainageCapacityPct,
      status: stepState.maxWaterDepthCm >= 40 ? 'CRITICAL' : stepState.maxWaterDepthCm >= 20 ? 'WARNING' : 'NORMAL',
      primarySensor: 'S-01',
      cctvCam: 'CAM-01',
    },
    {
      id: 'HZ-02',
      name: 'FC Road Metro Station Gate 2',
      coordinates: '18.5234° N, 73.8415° E',
      waterDepthCm: Math.max(stepState.maxWaterDepthCm - 24, 4),
      capacityPct: Math.max(stepState.drainageCapacityPct - 30, 20),
      status: 'NORMAL',
      primarySensor: 'S-02',
      cctvCam: 'CAM-02',
    },
    {
      id: 'HZ-03',
      name: 'Dengle Sluice Gate (Mutha Right Bank)',
      coordinates: '18.5289° N, 73.8532° E',
      waterDepthCm: Math.max(stepState.maxWaterDepthCm - 30, 0),
      capacityPct: Math.min(stepState.drainageCapacityPct + 10, 95),
      status: stepState.drainageCapacityPct > 80 ? 'WARNING' : 'NORMAL',
      primarySensor: 'S-04',
      cctvCam: 'CAM-03',
    },
    {
      id: 'HZ-04',
      name: 'Model Colony Lakaki Lake Basin',
      coordinates: '18.5361° N, 73.8398° E',
      waterDepthCm: 12,
      capacityPct: 35,
      status: 'NORMAL',
      primarySensor: 'S-05',
      cctvCam: 'CAM-04',
    },
  ];

  const filteredHotspots = hotspots.filter((h) => {
    if (filterRisk === 'critical') return h.status === 'CRITICAL' || h.status === 'WARNING';
    if (filterRisk === 'normal') return h.status === 'NORMAL';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header with High Contrast Legible Titles */}
      <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 mb-1">
            <Map className="w-4 h-4 text-cyan-600" />
            <span>Real Geographic Municipal GIS Map</span>
            <span>•</span>
            <span className="text-slate-700 font-bold">{selectedArea.name} ({selectedArea.ward})</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Live Interactive GIS Flood Management Map
          </h1>
          <p className="text-sm text-slate-600 font-normal">
            Real Pune base map with hydrodynamics, IoT sensors, CCTV surveillance, and flood-aware routing overlays.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-sm border border-slate-200 text-xs self-start md:self-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500 ml-1" />
          <button
            onClick={() => setFilterRisk('all')}
            className={`px-3 py-1 rounded-sm font-bold transition-all cursor-pointer ${
              filterRisk === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Zones
          </button>
          <button
            onClick={() => setFilterRisk('critical')}
            className={`px-3 py-1 rounded-sm font-bold transition-all cursor-pointer ${
              filterRisk === 'critical' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inundated Only
          </button>
          <button
            onClick={() => setFilterRisk('normal')}
            className={`px-3 py-1 rounded-sm font-bold transition-all cursor-pointer ${
              filterRisk === 'normal' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Clear Zones
          </button>
        </div>
      </div>

      {/* Main Workspace Layout: REAL INTERACTIVE MAP (Left) + CONTEXTUAL PANEL (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Real Interactive Map Workspace (8 Cols on Desktop) */}
        <div className="lg:col-span-8 space-y-3">
          <InteractiveMap
            heightClass="h-[620px]"
            filter={filterRisk === 'critical' ? 'INUNDATED_ONLY' : filterRisk === 'normal' ? 'CLEAR_ONLY' : 'ALL'}
            showLayerControl={true}
            showLegend={true}
            onSelectRoute={(routeType) => {
              setSelectedRouteType(routeType);
              setActiveRightTab('routes');
            }}
          />
        </div>

        {/* Contextual Right Panel (4 Cols on Desktop) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-sm p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Selected Area Header */}
            <div className="border-b border-slate-200 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Selected Area</span>
                <span className="text-[11px] font-semibold text-slate-400 font-mono">Pune, MH</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">{selectedArea.name}</h2>
              <div className="text-xs text-slate-600 font-medium">{selectedArea.ward} · {selectedArea.zone}</div>
            </div>

            {/* Contextual Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-sm border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setActiveRightTab('overview')}
                className={`flex-1 py-1.5 rounded-sm transition-all cursor-pointer ${
                  activeRightTab === 'overview' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveRightTab('routes')}
                className={`flex-1 py-1.5 rounded-sm transition-all cursor-pointer ${
                  activeRightTab === 'routes' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Routes
              </button>
              <button
                onClick={() => setActiveRightTab('sensors')}
                className={`flex-1 py-1.5 rounded-sm transition-all cursor-pointer ${
                  activeRightTab === 'sensors' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sensors
              </button>
              <button
                onClick={() => setActiveRightTab('cctv')}
                className={`flex-1 py-1.5 rounded-sm transition-all cursor-pointer ${
                  activeRightTab === 'cctv' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                CCTV
              </button>
            </div>

            {/* Tab 1: OVERVIEW */}
            {activeRightTab === 'overview' && (
              <div className="space-y-3  fade-in">
                {/* Active Hazard Warning */}
                {isFlooded ? (
                  <div className="bg-red-50 border border-red-200 p-3.5 rounded-sm space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-red-800 font-bold">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span>⚠ FC Road Underpass Blocked</span>
                    </div>
                    <p className="text-red-700 font-medium text-[11px]">
                      Predicted water depth: <strong>{stepState.maxWaterDepthCm} cm</strong>. Direct subway arterial is impassable.
                    </p>
                    <button
                      onClick={() => setActiveRightTab('routes')}
                      className="mt-1 text-[11px] font-bold text-red-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Safest Alternative Route</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-sm flex items-center gap-2 text-xs text-emerald-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>No critical road blockages detected in {selectedArea.name}.</span>
                  </div>
                )}

                {/* Quick Key Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                  <div className="bg-slate-50 p-3 rounded-sm border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Current Water Depth</span>
                    <strong className="text-slate-900 text-sm font-extrabold">{stepState.maxWaterDepthCm} cm</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-sm border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Rainfall Rate</span>
                    <strong className="text-slate-900 text-sm font-extrabold">{stepState.rainfallMmHr} mm/h</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-sm border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Drainage Load</span>
                    <strong className="text-slate-900 text-sm font-extrabold">{stepState.drainageCapacityPct}%</strong>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-sm border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Active Sensors</span>
                    <strong className="text-slate-900 text-sm font-extrabold">{sensors.length} Nodes</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3">
                  {selectedArea.description}
                </p>
              </div>
            )}

            {/* Tab 2: ROUTES (Emergency Rerouting Logic) */}
            {activeRightTab === 'routes' && (
              <div className="space-y-3  fade-in">
                {isFlooded && (
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-sm text-[11px] text-amber-900 font-medium">
                    "Route updated because FC Road Underpass is predicted to be flooded."
                  </div>
                )}

                {/* Safest Route Card */}
                <div
                  onClick={() => setSelectedRouteType('safest')}
                  className={`p-3.5 rounded-sm border transition-all cursor-pointer space-y-2 ${
                    selectedRouteType === 'safest'
                      ? 'bg-emerald-50/50 border-emerald-500 ring-1 ring-emerald-500'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                      Recommended Safest Route
                    </span>
                    <span className="font-semibold text-emerald-700 text-[11px]">0 cm depth</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">FC Road Flyover via Sancheti Upper Ramp</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">Elevated overpass route bypassing low-lying underpass sump.</p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-700 font-semibold pt-1 border-t border-slate-200/60">
                    <span>Dist: 3.8 km</span>
                    <span>Est: ~9 min</span>
                    <span className="text-emerald-700 font-extrabold">Hazard: None</span>
                  </div>
                </div>

                {/* Fastest Route Card */}
                <div
                  onClick={() => setSelectedRouteType('fastest')}
                  className={`p-3.5 rounded-sm border transition-all cursor-pointer space-y-2 ${
                    selectedRouteType === 'fastest'
                      ? 'bg-amber-50/50 border-amber-500 ring-1 ring-amber-500'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px]">
                      Fastest Route (Use Caution)
                    </span>
                    <span className={`font-semibold text-[11px] ${isFlooded ? 'text-red-700' : 'text-amber-700'}`}>
                      {stepState.maxWaterDepthCm} cm depth
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">JM Road Underpass Direct Arterial</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">Direct underpass route. Subject to waterlogging pooling.</p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-700 font-semibold pt-1 border-t border-slate-200/60">
                    <span>Dist: 2.9 km</span>
                    <span>Est: ~7 min</span>
                    <span className={isFlooded ? 'text-red-600 font-bold' : 'text-amber-600 font-bold'}>
                      {isFlooded ? 'Blocked' : 'Waterlogging'}
                    </span>
                  </div>
                </div>

                <Link
                  href="/routing"
                  className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-3 rounded-sm text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Open Full Emergency Routing Page</span>
                </Link>
              </div>
            )}

            {/* Tab 3: SENSORS */}
            {activeRightTab === 'sensors' && (
              <div className="space-y-2  fade-in">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  IoT Sensor Telemetry ({sensors.length})
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {sensors.map((s) => (
                    <div key={s.id} className="p-2.5 rounded-sm border border-slate-200 bg-slate-50 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-cyan-600" />
                          {s.id}: {s.name}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            s.status === 'critical'
                              ? 'bg-red-100 text-red-700'
                              : s.status === 'warning'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {s.status}
                        </span>
                      </div>
                      <div className="text-slate-600 flex justify-between text-[11px]">
                        <span>Value: <strong className="text-cyan-700">{s.value} {s.unit}</strong></span>
                        <span className="text-slate-400 font-mono">Battery: {s.battery}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: CCTV */}
            {activeRightTab === 'cctv' && (
              <div className="space-y-2  fade-in">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  CCTV Traffic Cameras ({cctv.length})
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {cctv.map((cam) => (
                    <div key={cam.id} className="p-2.5 rounded-sm border border-slate-200 bg-slate-50 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5 text-purple-600" />
                          {cam.id}: {cam.location}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            cam.aiWaterDetection ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {cam.aiWaterDetection ? 'Waterlogged' : 'Clear'}
                        </span>
                      </div>
                      <div className="text-slate-600 flex justify-between text-[11px]">
                        <span>Est. Depth: <strong className="text-purple-700">{cam.waterDepthCm} cm</strong></span>
                        <span>Traffic: {cam.trafficSpeedKmph} km/h</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/cctv"
                  className="w-full mt-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-3 rounded-sm text-xs flex items-center justify-center gap-1 transition-colors border border-slate-200"
                >
                  <Eye className="w-3.5 h-3.5 text-purple-600" />
                  <span>View All CCTV Cameras</span>
                </Link>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>Reference GIS Data: Simulated</span>
            <span>Update Rate: Realtime</span>
          </div>
        </div>
      </div>

      {/* Hotspots Detailed Telemetry Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-sm p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Shivajinagar Municipal Hotspot Telemetry Matrix</span>
          </h3>
          <span className="text-xs text-slate-400">Updating Live</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Hotspot Zone</th>
                <th className="py-2.5 px-3">Coordinates</th>
                <th className="py-2.5 px-3">Water Depth</th>
                <th className="py-2.5 px-3">Drainage Capacity</th>
                <th className="py-2.5 px-3">Linked Sensor</th>
                <th className="py-2.5 px-3">CCTV AI</th>
                <th className="py-2.5 px-3 text-right">Risk Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredHotspots.map((h) => (
                <tr key={h.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-sm bg-cyan-400" />
                    {h.name}
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{h.coordinates}</td>
                  <td className="py-3 px-3 font-extrabold text-cyan-300">{h.waterDepthCm} cm</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 rounded-sm h-1.5 overflow-hidden">
                        <div
                          className={`h-full ${
                            h.capacityPct > 80 ? 'bg-red-500' : h.capacityPct > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${h.capacityPct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-300">{h.capacityPct}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    <span className="inline-flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                      <Cpu className="w-3 h-3 text-emerald-400" />
                      {h.primarySensor}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    <span className="inline-flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                      <Video className="w-3 h-3 text-purple-400" />
                      {h.cctvCam}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`font-extrabold text-[10px] px-2.5 py-1 rounded-sm border ${
                        h.status === 'CRITICAL'
                          ? 'bg-red-950 text-red-400 border-red-700 '
                          : h.status === 'WARNING'
                          ? 'bg-amber-950 text-amber-300 border-amber-700'
                          : 'bg-emerald-950 text-emerald-400 border-emerald-700'
                      }`}
                    >
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
