'use client';

import React from 'react';
import { useDemo } from '@/context/DemoContext';
import { MetricCard } from '@/components/ui/MetricCard';
import { GitMerge, AlertTriangle, CheckCircle, Wrench } from 'lucide-react';

export default function DrainagePage() {
  const { stepState, pipes, selectedArea } = useDemo();

  const isShivajinagar = selectedArea.id === 'shivajinagar';
  const activeCapacity = isShivajinagar ? stepState.drainageCapacityPct : selectedArea.drainageCapacityPct;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-xs space-y-1">
        <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1">
          <GitMerge className="w-3.5 h-3.5 text-slate-600" />
          <span>Hydraulic Pipeline Network</span>
          <span>•</span>
          <span className="font-semibold text-slate-700">{selectedArea.name} ({selectedArea.ward})</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Drainage network capacity & bottlenecks
        </h1>
        <p className="text-sm text-slate-600 font-normal">
          Real-time hydraulic pipe utilization, culvert silt status, and outfall discharge capacity.
        </p>
      </div>

      {/* Top Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Trunk main load"
          value={activeCapacity}
          unit="%"
          subtitle="Pipe P-101 hydraulic utilization"
          icon={GitMerge}
          variant={activeCapacity >= 80 ? 'red' : activeCapacity >= 50 ? 'amber' : 'emerald'}
        />
        <MetricCard
          title="Culvert C-14 silt block"
          value="55%"
          subtitle="Restricts gravity discharge rate"
          icon={AlertTriangle}
          variant="amber"
        />
        <MetricCard
          title="Sluice Gate #2 position"
          value="30% Open"
          subtitle="Mutha outfall relief buffer"
          icon={Wrench}
          variant="cyan"
        />
      </div>

      {/* Primary Visual: Hydraulic Pipe Network Capacity Table */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Storm line & culvert status directory
            </h2>
            <p className="text-xs text-slate-500 font-medium">Hydraulic flow velocity & surcharge monitoring</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {pipes.filter((p) => p.status === 'overloaded').length} Overloaded Nodes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Line ID</th>
                <th className="py-3 px-3">Location Segment</th>
                <th className="py-3 px-3">Diameter</th>
                <th className="py-3 px-3">Design Capacity</th>
                <th className="py-3 px-3">Current Flow</th>
                <th className="py-3 px-3">Hydraulic Load</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {pipes.map((pipe) => (
                <tr key={pipe.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{pipe.id}</td>
                  <td className="py-3 px-3 text-slate-800">{pipe.name}</td>
                  <td className="py-3 px-3 text-slate-600">{pipe.diameterMm} mm</td>
                  <td className="py-3 px-3 text-slate-600">{pipe.capacityM3s} m³/s</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{pipe.currentFlowM3s} m³/s</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-2 rounded-sm overflow-hidden">
                        <div
                          className={`h-full rounded-sm ${
                            pipe.loadPct >= 90 ? 'bg-red-500' : pipe.loadPct >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${pipe.loadPct}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-900">{pipe.loadPct}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        pipe.status === 'overloaded'
                          ? 'bg-red-100 text-red-700'
                          : pipe.status === 'warning'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {pipe.status === 'overloaded' ? 'Overloaded' : pipe.status === 'warning' ? 'Warning' : 'Normal'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Culvert & Outfall Identified Bottlenecks */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
          Identified drainage bottlenecks & silt traps
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
          <div className="p-4 rounded-sm bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">Culvert C-14 Silt Restriction</div>
            <p className="text-slate-600 font-normal">
              Accumulated silt reduces effective pipe cross-section by 55%, creating a 1.4 m³/s bottleneck during heavy storm runoff.
            </p>
          </div>
          <div className="p-4 rounded-sm bg-slate-50 border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900">Mutha River Outfall Stage Height</div>
            <p className="text-slate-600 font-normal">
              River water level at 2.8m creates backwater resistance against gravity outfall lines at Dengle Gate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
