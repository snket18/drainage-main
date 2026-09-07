'use client';

import React, { useState } from 'react';
import { useDemo } from '@/context/DemoContext';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { MetricCard } from '@/components/ui/MetricCard';
import { Navigation, ShieldCheck, AlertTriangle, MapPin, Clock, ArrowRight, Check } from 'lucide-react';
import { MUMBAI_WARDS_DATA } from '@/data/mumbaiWardsData';

export default function RoutingPage() {
  const { stepState, selectedArea } = useDemo();
  const [selectedRoute, setSelectedRoute] = useState<'safest' | 'fastest'>('safest');

  const isShiv = selectedArea.id === 'hindmata';
  const activeDepth = isShiv ? stepState.maxWaterDepthCm : selectedArea.waterDepthCm;
  const isFlooded = activeDepth > 20;
  
  const activeWard = MUMBAI_WARDS_DATA.find(w => w.id === selectedArea.id);
  const safestRouteName = activeWard?.safeBypassGeoJSON?.features?.[0]?.properties?.name || 'No safe route available';
  const fastestRouteName = activeWard?.floodedRouteGeoJSON?.features?.[0]?.properties?.name || 'Direct Route';
  const safestTime = activeWard?.etaBypassMins || '--';
  const fastestTime = activeWard?.etaNormalMins || '--';
  const riskDelay = isShiv ? stepState.routingState.riskDelayMins : (activeWard ? activeWard.etaBypassMins - activeWard.etaNormalMins : 0);

  return (
    <div className="space-y-6">
      {/* Header - Fixed dark slate typography for legibility */}
      <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-xs space-y-1">
        <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1">
          <Navigation className="w-3.5 h-3.5 text-slate-600" />
          <span>Emergency Response & Traffic Guidance</span>
          <span>•</span>
          <span className="font-semibold text-slate-700">{selectedArea.name} ({selectedArea.ward})</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Emergency evacuation & safest routing
        </h1>
        <p className="text-sm text-slate-600 font-normal">
          Real-time flood-aware route recommendations for emergency response vehicles and traffic diversion.
        </p>
      </div>

      {/* Top 3 Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Safest evacuation route"
          value={safestRouteName}
          subtitle="0 cm predicted water depth"
          icon={ShieldCheck}
          variant="emerald"
        />
        <MetricCard
          title="Subway obstruction status"
          value={isFlooded ? 'Flooded' : 'Passable'}
          subtitle={isFlooded ? `${activeDepth} cm depth at underpass` : 'Normal traffic velocity'}
          icon={AlertTriangle}
          variant={isFlooded ? 'red' : 'emerald'}
        />
        <MetricCard
          title="Reroute travel delay"
          value={`+${riskDelay}`}
          unit="min"
          subtitle="Additional travel time"
          icon={Clock}
          variant={riskDelay > 10 ? 'amber' : 'emerald'}
        />
      </div>

      {/* Main Content Grid: Route Comparison (Left) + GIS Map (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Comparison Column (1.2 cols) */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">
            Route comparison options
          </h2>

          {/* Route 1: SAFEST ROUTE (Primary Recommended) */}
          <div
            onClick={() => setSelectedRoute('safest')}
            className={`p-5 rounded-sm border transition-all cursor-pointer space-y-3 ${
              selectedRoute === 'safest'
                ? 'bg-white border-emerald-500 ring-1 ring-emerald-500 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Safest Route
              </span>
              <span className="text-xs font-semibold text-slate-500">0 cm water depth</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                {safestRouteName}
              </h3>
              <p className="text-xs text-slate-600 font-normal mt-1">
                Elevated overpass route bypassing low-lying JM Road underpass sump entirely.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-sm border border-slate-200 text-xs font-medium text-slate-800">
              <div>
                <span className="text-slate-500 block text-[11px]">Distance</span>
                <strong>3.8 km</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Est. Time</span>
                <strong>~{safestTime} min</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Hazard Risk</span>
                <strong className="text-emerald-700">None</strong>
              </div>
            </div>
          </div>

          {/* Route 2: FASTEST ROUTE (Direct Arterial / Warning Note) */}
          <div
            onClick={() => setSelectedRoute('fastest')}
            className={`p-5 rounded-sm border transition-all cursor-pointer space-y-3 ${
              selectedRoute === 'fastest'
                ? 'bg-white border-amber-500 ring-1 ring-amber-500 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                Fastest Route (Use with caution)
              </span>
              <span className="text-xs font-semibold text-amber-700">
                {activeDepth} cm water depth
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                {fastestRouteName}
              </h3>
              <p className="text-xs text-slate-600 font-normal mt-1">
                Direct low-level underpass route. Subject to waterlogging pooling during heavy downpours.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-sm border border-slate-200 text-xs font-medium text-slate-800">
              <div>
                <span className="text-slate-500 block text-[11px]">Distance</span>
                <strong>2.9 km</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Est. Time</span>
                <strong>~{fastestTime} min</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Hazard Risk</span>
                <strong className={isFlooded ? 'text-red-600' : 'text-amber-600'}>
                  {isFlooded ? 'Flooded' : 'Waterlogging'}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* GIS Map Visualization (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-sm border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-600" />
              <span>Evacuation route geometry map ({selectedArea.name})</span>
            </span>
            <span className="text-xs text-slate-500 font-mono">Simulated infrastructure layer</span>
          </div>

          <InteractiveMap heightClass="h-[520px]" />
        </div>
      </div>
    </div>
  );
}
