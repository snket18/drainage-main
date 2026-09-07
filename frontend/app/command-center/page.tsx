'use client';

import React from 'react';
import { useDemo } from '@/context/DemoContext';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { MetricCard } from '@/components/ui/MetricCard';
import {
  Maximize2,
  ShieldAlert,
  CloudRain,
  Waves,
  GitMerge,
  Radio,
  Activity,
  MapPin,
} from 'lucide-react';
import { PUNE_AREAS } from '@/data/searchData';

export default function OperationsCenterPage() {
  const { stepState, selectedArea } = useDemo();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-sm text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-sm bg-orange-500 text-white font-bold flex items-center justify-center">
            <Maximize2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span>Pune Municipal Corporation</span>
              <span>•</span>
              <span className="text-orange-400 font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {selectedArea.name} ({selectedArea.ward})
              </span>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-white mt-0.5">
              Municipal Operations Center
            </h1>
          </div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Max Inundation Depth"
          value={stepState.maxWaterDepthCm}
          unit="cm"
          subtitle="JM Underpass Sump"
          icon={Waves}
          variant={stepState.maxWaterDepthCm >= 40 ? 'red' : stepState.maxWaterDepthCm >= 20 ? 'amber' : 'emerald'}
        />
        <MetricCard
          title="Live Rainfall Rate"
          value={stepState.rainfallMmHr}
          unit="mm/hr"
          subtitle="Doppler Radar Grid"
          icon={CloudRain}
          variant={stepState.rainfallMmHr >= 60 ? 'red' : stepState.rainfallMmHr >= 30 ? 'amber' : 'cyan'}
        />
        <MetricCard
          title="Trunk Pipe Capacity"
          value={stepState.drainageCapacityPct}
          unit="%"
          subtitle="Hydraulic Network Load"
          icon={GitMerge}
          variant={stepState.drainageCapacityPct >= 80 ? 'red' : stepState.drainageCapacityPct >= 50 ? 'amber' : 'emerald'}
        />
        <MetricCard
          title="Time to Critical"
          value={stepState.timeToCriticalMins ? `~${stepState.timeToCriticalMins}` : 'Safe'}
          unit={stepState.timeToCriticalMins ? 'min' : ''}
          subtitle="Lead Time Countdown"
          icon={Activity}
          variant={stepState.timeToCriticalMins ? 'amber' : 'emerald'}
        />
      </div>

      {/* Dominant Layout: GIS Map + Active Alert & Interventions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large GIS Map View (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-sm border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Radio className="w-4 h-4 text-orange-500" />
              <span>GIS Spatial Overview ({selectedArea.name})</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Simulated infrastructure layer</span>
          </div>

          <InteractiveMap heightClass="h-[550px]" />
        </div>

        {/* Right Panel: Operations Alert & Sector Matrix */}
        <div className="space-y-6">
          {/* Active Priority Alert Box */}
          <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                <ShieldAlert className="w-4 h-4 text-red-600" />
                <span>Active Advisory</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-100 text-red-800">
                High Priority
              </span>
            </div>

            {stepState.activeAlert ? (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {stepState.activeAlert.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {stepState.activeAlert.description}
                </p>

                <div className="bg-slate-50 p-3.5 rounded-sm border border-slate-200 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Recommended Action
                  </span>
                  <p className="text-xs text-slate-900 font-bold">
                    {stepState.activeAlert.recommendedAction}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-normal">All Pune municipal sectors baseline normal.</p>
            )}
          </div>

          {/* Sector Status Matrix */}
          <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
              PMC Sector Status Matrix
            </h4>
            <div className="space-y-2">
              {Object.values(PUNE_AREAS).map((area) => (
                <div
                  key={area.id}
                  className="flex items-center justify-between p-2.5 rounded-sm bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="font-bold text-slate-900">{area.name}</div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      area.status === 'CRITICAL'
                        ? 'bg-red-100 text-red-700'
                        : area.status === 'WARNING'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {area.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
