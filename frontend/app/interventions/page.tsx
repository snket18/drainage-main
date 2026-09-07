'use client';

import React, { useState } from 'react';
import { useDemo } from '@/context/DemoContext';
import { Wrench, CheckCircle, ChevronDown, ChevronUp, Play, Send, ShieldAlert } from 'lucide-react';

export default function InterventionsPage() {
  const { stepState, selectedArea, nextStep } = useDemo();
  const [executedIntervention, setExecutedIntervention] = useState<string | null>(null);
  const [expandedWhy, setExpandedWhy] = useState<string | null>('INT-PUMP-04');
  const [simulatedPreview, setSimulatedPreview] = useState<string | null>(null);

  const interventions = [
    {
      id: 'INT-PUMP-04',
      isRecommended: true,
      title: 'Deploy Mobile Dewatering Pump Unit #4',
      targetAsset: `${selectedArea.name} Underpass Sump`,
      spec: '500 HP High-Volume Mobile Pump (1.2 m³/s rate)',
      proximity: selectedArea.interventionRationale.proximity,
      availableCapacity: selectedArea.interventionRationale.availableCapacity,
      expectedEffect: selectedArea.interventionRationale.expectedEffect,
      responseTimeMins: selectedArea.interventionRationale.responseTimeMins,
      whyReasoning: selectedArea.interventionRationale.reasoning,
      activeStepTrigger: 3,
    },
    {
      id: 'INT-GATE-02',
      isRecommended: false,
      title: 'Open Dengle Sluice Gate #2 by 30%',
      targetAsset: 'Mithi Confluence Outfall',
      spec: 'Creates 1.5 m³/s additional storm discharge buffer',
      proximity: 'Mithi River Embankment (0.4 km)',
      availableCapacity: '1.5 m³/s gravity head relief',
      expectedEffect: 'Reduce outfall backwater height by ~18 cm',
      responseTimeMins: 8,
      whyReasoning: 'Pre-discharging gate #2 lowers river outfall backwater head, allowing upstream storm pipes to drain via gravity.',
      activeStepTrigger: 1,
    },
    {
      id: 'INT-STOR-01',
      isRecommended: false,
      title: 'Divert Flow to Retention Basin',
      targetAsset: 'Retention Basin Inlet Valve B-02',
      spec: 'Buffer capacity: 45,000 m³ retention storage',
      proximity: 'Model Colony Basin (1.2 km)',
      availableCapacity: '45,000 m³ storage volume',
      expectedEffect: 'Divert peak runoff volume for ~25 minutes',
      responseTimeMins: 15,
      whyReasoning: 'Temporarily buffers peak convective runoff in the retention basin, relieving downstream trunk main capacity.',
      activeStepTrigger: 4,
    },
    {
      id: 'INT-CLEAN-04',
      isRecommended: false,
      title: 'High-Pressure Vacuum Jetting Cleanout',
      targetAsset: `Culvert C-14 / Pipe P-101 in ${selectedArea.name}`,
      spec: 'Vacuum jetting truck crew',
      proximity: 'Central Ward Depot (1.5 km)',
      availableCapacity: 'Restores 3.5 m³/s full pipe capacity',
      expectedEffect: 'Remove 55% silt accumulation at Culvert C-14',
      responseTimeMins: 30,
      whyReasoning: 'Clears silt restriction at Culvert C-14, restoring natural gravity flow capacity.',
      activeStepTrigger: 1,
    },
  ];

  const handleSimulate = (id: string) => {
    setSimulatedPreview(id);
    setTimeout(() => setSimulatedPreview(null), 3500);
  };

  const handleDispatch = (id: string) => {
    setExecutedIntervention(id);
    setTimeout(() => {
      nextStep();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-sm border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-slate-600" />
            <span>Intervention recommendations ({selectedArea.name})</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Evaluates dewatering, sluice gate, retention, and jetting actions based on proximity, capacity, and response time
          </p>
        </div>
      </div>

      {executedIntervention && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs font-semibold flex items-center justify-between  fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Intervention {executedIntervention} dispatched. Updating status...</span>
          </div>
        </div>
      )}

      {simulatedPreview && (
        <div className="p-4 bg-slate-100 border border-slate-200 text-slate-800 rounded-sm text-xs font-semibold flex items-center justify-between  fade-in">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-slate-600 fill-current" />
            <span>Simulating intervention impact for {simulatedPreview}: standing water depth predicted to drop by ~32 cm in ~20 minutes.</span>
          </div>
        </div>
      )}

      {/* Incident Cause & Evidence Breakdown Box */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-slate-600" />
            <h2 className="text-sm font-bold text-slate-900">Current incident assessment</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">{selectedArea.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-sm border border-slate-200 space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Diagnosed Cause</span>
            <p className="text-slate-900 font-bold">{selectedArea.riskDrivers[0]?.factor}: {selectedArea.riskDrivers[0]?.detail}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-sm border border-slate-200 space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Evidence</span>
            <p className="text-slate-900 font-bold">IoT depth: {stepState.maxWaterDepthCm} cm • CCTV observation verified</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-sm border border-slate-200 space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Recommended Action</span>
            <p className="text-slate-900 font-bold">{stepState.interventionState.recommended}</p>
          </div>
        </div>
      </div>

      {/* Interventions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {interventions.map((item) => {
          const isExpanded = expandedWhy === item.id;

          return (
            <div
              key={item.id}
              className={`p-6 rounded-sm border transition-all space-y-4 shadow-xs ${
                item.isRecommended
                  ? 'bg-white border-slate-400'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500">{item.id}</span>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${
                    item.isRecommended
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {item.isRecommended ? 'Recommended' : 'Alternative'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-600 font-normal mb-2">{item.spec}</p>
                <div className="text-xs text-slate-500 font-medium">Target: {item.targetAsset}</div>
              </div>

              {/* Evaluation Parameters */}
              <div className="grid grid-cols-2 gap-2.5 bg-slate-50 p-3.5 rounded-sm border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Proximity:</span>
                  <div className="font-bold text-slate-900">{item.proximity}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Available Capacity:</span>
                  <div className="font-bold text-slate-900">{item.availableCapacity}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Expected Effect:</span>
                  <div className="font-bold text-slate-900">{item.expectedEffect}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Response Time:</span>
                  <div className="font-bold text-slate-900">~{item.responseTimeMins} min</div>
                </div>
              </div>

              {/* Expandable "Why FloodTwin recommends this" */}
              <div className="pt-1">
                <button
                  onClick={() => setExpandedWhy(isExpanded ? null : item.id)}
                  className="flex items-center justify-between w-full text-xs font-semibold text-slate-700 hover:text-slate-900 py-1"
                >
                  <span>Why FloodTwin recommends this</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {isExpanded && (
                  <p className="text-xs text-slate-600 font-normal bg-slate-50 p-3.5 rounded-sm border border-slate-200 mt-2 leading-relaxed">
                    {item.whyReasoning}
                  </p>
                )}
              </div>

              {/* Buttons: Simulate & Dispatch */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleSimulate(item.id)}
                  className="py-2 rounded-sm text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Simulate</span>
                </button>
                <button
                  onClick={() => handleDispatch(item.id)}
                  className="py-2 rounded-sm text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
