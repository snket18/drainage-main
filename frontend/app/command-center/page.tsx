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
import { MUMBAI_AREAS } from '@/data/searchData';

export default function OperationsCenterPage() {
  const { stepState, selectedArea, setSelectedAreaId } = useDemo();
  
  const isShiv = selectedArea.id === 'hindmata';
  const activeDepth = isShiv ? stepState.maxWaterDepthCm : selectedArea.waterDepthCm;
  const activeRain = isShiv ? stepState.rainfallMmHr : selectedArea.rainfallMmHr;
  const activeCapacity = isShiv ? stepState.drainageCapacityPct : selectedArea.drainageCapacityPct;
  const activeTime = isShiv ? stepState.timeToCriticalMins : selectedArea.timeToCriticalMins;
  const depthSubtitle = isShiv ? "JM Underpass Sump" : (selectedArea.affectedRoads[0] || "Key area");

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
              <span>Demonstration Region</span>
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

      {/* Area Snapshot */}
      <div className="bg-white border border-slate-200 rounded-sm p-4 shadow-xs">
        <div className="flex flex-wrap md:flex-nowrap items-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
           <div className="flex-1 flex flex-col py-2 md:py-0 px-4 first:pl-2 last:pr-2">
             <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Water Depth</span>
             <div className="flex items-baseline gap-1">
               <span className="text-xl font-extrabold text-slate-900">{activeDepth}</span>
               <span className="text-xs font-bold text-slate-600 whitespace-nowrap">cm</span>
             </div>
           </div>
           <div className="flex-1 flex flex-col py-2 md:py-0 px-4">
             <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Rainfall</span>
             <div className="flex items-baseline gap-1">
               <span className="text-xl font-extrabold text-slate-900">{activeRain}</span>
               <span className="text-xs font-bold text-slate-600 whitespace-nowrap">mm/hr</span>
             </div>
           </div>
           <div className="flex-1 flex flex-col py-2 md:py-0 px-4">
             <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Drainage Load</span>
             <div className="flex items-baseline gap-1">
               <span className="text-xl font-extrabold text-slate-900">{activeCapacity}</span>
               <span className="text-xs font-bold text-slate-600 whitespace-nowrap">%</span>
             </div>
           </div>
           <div className="flex-1 flex flex-col py-2 md:py-0 px-4">
             <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Time to critical</span>
             <div className="flex items-baseline gap-1">
               <span className="text-xl font-extrabold text-slate-900">{activeTime ? `~${activeTime}` : 'Safe'}</span>
               <span className="text-xs font-bold text-slate-600 whitespace-nowrap">{activeTime ? 'min' : ''}</span>
             </div>
           </div>
        </div>
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
            <span className="text-[11px] text-slate-500 font-mono">Simulation data</span>
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

            {isShiv && stepState.activeAlert ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="bg-slate-50 p-2 border border-slate-200">
                    <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Priority</span>
                    <span className={`block text-xs font-bold capitalize ${stepState.activeAlert.severity === 'critical' ? 'text-red-700' : 'text-slate-900'}`}>{stepState.activeAlert.severity}</span>
                  </div>
                  <div className="bg-slate-50 p-2 border border-slate-200">
                    <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Event type</span>
                    <span className="block text-xs font-bold text-slate-900 capitalize">{stepState.activeAlert.type}</span>
                  </div>
                  <div className="bg-slate-50 p-2 border border-slate-200">
                    <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Expected rainfall</span>
                    <span className="block text-xs font-bold text-slate-900">{stepState.rainfallMmHr} mm/hr</span>
                  </div>
                  <div className="bg-slate-50 p-2 border border-slate-200">
                    <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Time Window</span>
                    <span className="block text-xs font-bold text-slate-900">{stepState.timeToCriticalMins ? `~${stepState.timeToCriticalMins} mins` : 'Immediate'}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug border-b border-slate-200 pb-2">
                  {stepState.activeAlert.title}
                </h3>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Why it matters</span>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {stepState.activeAlert.description}
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-sm border border-slate-200 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Recommended Action
                  </span>
                  <p className="text-xs text-slate-900 font-bold">
                    {stepState.activeAlert.recommendedAction}
                  </p>
                </div>
              </div>
            ) : selectedArea.status !== 'NORMAL' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="bg-slate-50 p-2 border border-slate-200">
                    <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Priority</span>
                    <span className={`block text-xs font-bold capitalize ${selectedArea.status === 'CRITICAL' ? 'text-red-700' : 'text-slate-900'}`}>{selectedArea.status.toLowerCase()}</span>
                  </div>
                  <div className="bg-slate-50 p-2 border border-slate-200">
                    <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Event type</span>
                    <span className="block text-xs font-bold text-slate-900">Inundation Threat</span>
                  </div>
                  <div className="bg-slate-50 p-2 border border-slate-200">
                    <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Expected rainfall</span>
                    <span className="block text-xs font-bold text-slate-900">{selectedArea.rainfallMmHr} mm/hr</span>
                  </div>
                  <div className="bg-slate-50 p-2 border border-slate-200">
                    <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Time Window</span>
                    <span className="block text-xs font-bold text-slate-900">{selectedArea.predictionFactors?.leadTimeMins ? `~${selectedArea.predictionFactors.leadTimeMins} mins` : 'N/A'}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug border-b border-slate-200 pb-2">
                  {selectedArea.predictionFactors?.explanation || `Critical Risk in ${selectedArea.name}`}
                </h3>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Why it matters</span>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {selectedArea.description}
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-sm border border-slate-200 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Recommended Action
                  </span>
                  <p className="text-xs text-slate-900 font-bold">
                    {selectedArea.interventionRationale?.recommendedAction || 'Monitor situation closely.'}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-normal">All {selectedArea.name} sectors baseline normal.</p>
            )}
          </div>

          {/* Sector Status Matrix */}
          <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
              Area Status Matrix
            </h4>
            <div className="space-y-2">
              {Object.values(MUMBAI_AREAS).map((area) => (
                <div
                  key={area.id}
                  onClick={() => setSelectedAreaId(area.id)}
                  className="flex items-center justify-between p-2.5 rounded-sm bg-slate-50 border border-slate-200 text-xs cursor-pointer hover:bg-slate-100 transition-colors"
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
