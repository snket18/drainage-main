'use client';

import React from 'react';
import { useDemo } from '@/context/DemoContext';
import { MetricCard } from '@/components/ui/MetricCard';
import {
  HelpCircle,
  Zap,
  MapPin,
  ArrowRight,
  Cpu,
  Video,
  GitMerge,
  Waves,
  Clock,
  Database,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function AreaOverviewPage() {
  const { selectedArea, stepState } = useDemo();

  const isHindmata = selectedArea.id === 'hindmata';
  const activeDepth = isHindmata ? stepState.maxWaterDepthCm : selectedArea.waterDepthCm;
  const activeRain = isHindmata ? stepState.rainfallMmHr : selectedArea.rainfallMmHr;
  const activeCapacity = isHindmata ? stepState.drainageCapacityPct : selectedArea.drainageCapacityPct;
  const activeTimeToCritical = isHindmata ? stepState.timeToCriticalMins : selectedArea.timeToCriticalMins;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-sm border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs text-slate-500 font-medium">
            <span>Area Explorer & Diagnostics</span>
            <span>•</span>
            <span className="text-slate-700 font-semibold">
              {selectedArea.isLiveDemo ? 'Live Telemetry' : 'Hydrodynamic Model'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-slate-600" />
            <span>{selectedArea.name} ({selectedArea.ward}) Overview</span>
          </h1>
          <p className="text-xs text-slate-600 font-normal mt-1">{selectedArea.description}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/interventions"
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-sm text-xs font-semibold shadow-xs transition-colors"
          >
            <span>View Interventions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Water Depth"
          value={activeDepth}
          unit="cm"
          subtitle="Standing Sump Depth"
          icon={Waves}
          variant={activeDepth >= 40 ? 'red' : activeDepth >= 20 ? 'amber' : 'emerald'}
        />
        <MetricCard
          title="Rainfall Rate"
          value={activeRain}
          unit="mm/hr"
          subtitle="Doppler Radar Velocity"
          icon={Zap}
          variant={activeRain >= 60 ? 'red' : activeRain >= 30 ? 'amber' : 'cyan'}
        />
        <MetricCard
          title="Drainage Load"
          value={activeCapacity}
          unit="%"
          subtitle="Trunk Hydraulic Load"
          icon={GitMerge}
          variant={activeCapacity >= 80 ? 'red' : activeCapacity >= 50 ? 'amber' : 'emerald'}
        />
        <MetricCard
          title="Time to Critical"
          value={activeTimeToCritical ? `~${activeTimeToCritical}` : 'Clear'}
          unit={activeTimeToCritical ? 'min' : ''}
          subtitle="Lead Time Projection"
          icon={HelpCircle}
          variant={activeTimeToCritical ? 'amber' : 'emerald'}
        />
      </div>

      {/* Main Diagnostic Panels: "Why is this area at risk?" & "Why FloodTwin recommends this" */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: "Why is this area at risk?" */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Why is {selectedArea.name} at risk?
            </h3>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-sm">
              Prediction confidence: {selectedArea.predictionFactors.confidencePct}%
            </span>
          </div>

          {/* Evidence-Based Risk Factor List */}
          <div className="space-y-3">
            {selectedArea.riskDrivers.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-sm border border-slate-200/80 space-y-0.5">
                <div className="text-xs font-bold text-slate-900">{item.factor}</div>
                <div className="text-xs text-slate-600 font-normal">{item.detail}</div>
              </div>
            ))}
          </div>

          {/* Synthesis Assessment */}
          <div className="p-3.5 bg-slate-100 rounded-sm border border-slate-200 text-xs font-medium text-slate-800">
            <strong>Assessment:</strong> {selectedArea.predictionFactors.explanation}
          </div>
        </div>

        {/* Panel 2: "Why FloodTwin recommends this" */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Recommended intervention
            </h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-sm border border-emerald-200">
              Recommended
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Primary Recommended Action
            </span>
            <h4 className="text-base font-bold text-slate-900">
              {selectedArea.interventionRationale.recommendedAction}
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-sm border border-slate-200 text-slate-800 text-xs">
            <div>
              <div className="text-slate-500 font-medium">Expected Effect</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                {selectedArea.interventionRationale.expectedEffect}
              </div>
            </div>
            <div>
              <div className="text-slate-500 font-medium">Estimated Response Time</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">
                ~{selectedArea.interventionRationale.responseTimeMins} min
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Why FloodTwin recommends this
            </span>
            <p className="text-xs text-slate-700 font-normal leading-relaxed bg-slate-50 p-3.5 rounded-sm border border-slate-200">
              {selectedArea.interventionRationale.reasoning}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
            <span>Alternative: <strong className="text-slate-800">{selectedArea.interventionRationale.alternativeAction}</strong></span>
          </div>
        </div>
      </div>

      {/* Data Sources & Asset Context */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-slate-500" />
            <h3 className="text-base font-bold text-slate-900">Data sources</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Last updated {selectedArea.lastUpdatedMinsAgo} minutes ago
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-sm bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-900 mb-0.5">Rainfall</div>
            <div className="text-[11px] text-slate-600">Doppler weather radar</div>
          </div>
          <div className="p-3 rounded-sm bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-900 mb-0.5">Terrain</div>
            <div className="text-[11px] text-slate-600">DEM</div>
          </div>
          <div className="p-3 rounded-sm bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-900 mb-0.5">Drainage</div>
            <div className="text-[11px] text-slate-600">Municipal network data</div>
          </div>
          <div className="p-3 rounded-sm bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-900 mb-0.5">Sensors</div>
            <div className="text-[11px] text-slate-600">IoT telemetry ({selectedArea.sensorsCount} active)</div>
          </div>
          <div className="p-3 rounded-sm bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-900 mb-0.5">CCTV</div>
            <div className="text-[11px] text-slate-600">Traffic cameras ({selectedArea.cctvCount} feeds)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
