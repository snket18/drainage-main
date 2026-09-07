'use client';

import React from 'react';
import { PuneWardArea } from '@/data/puneWardsData';
import {
  AlertTriangle,
  CheckCircle2,
  Navigation,
  MapPin,
  CloudRain,
  Activity,
  Layers,
  ShieldAlert,
  ArrowRight,
  X,
} from 'lucide-react';

interface AreaRiskDrawerProps {
  area: PuneWardArea;
  showBypassRoute: boolean;
  onToggleBypassRoute: () => void;
  onClose?: () => void;
}

export const AreaRiskDrawer: React.FC<AreaRiskDrawerProps> = ({
  area,
  showBypassRoute,
  onToggleBypassRoute,
  onClose,
}) => {
  const isHighRisk = area.floodProbabilityPct >= 75;
  const isModerateRisk = area.floodProbabilityPct >= 50 && area.floodProbabilityPct < 75;

  const riskBadgeStyle = isHighRisk
    ? 'bg-rose-50 text-rose-700 border-rose-200'
    : isModerateRisk
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-emerald-50 text-emerald-700 border-emerald-200';

  return (
    <div className="bg-white border border-slate-200 rounded-sm p-5 shadow-sm space-y-5 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="border-b border-slate-100 pb-3 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{area.ward} · Selected Hub</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-snug">{area.name}</h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-sm hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Risk Badge */}
        <div className={`p-3 rounded-sm border flex items-center justify-between font-mono ${riskBadgeStyle}`}>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold">{area.floodProbabilityPct}% Flood Risk</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/60">
            {isHighRisk ? 'HIGH RISK' : isModerateRisk ? 'WATCH' : 'CLEAR'}
          </span>
        </div>

        {/* Active Warning Banner */}
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-sm space-y-1.5 text-xs text-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Choke Point Advisory</span>
          </div>
          <p className="text-slate-600 text-xs leading-relaxed">{area.warningMessage}</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 p-3 rounded-sm border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Water Depth
            </span>
            <strong className="text-slate-900 text-lg font-bold">{area.predictedWaterDepthCm} cm</strong>
          </div>
          <div className="bg-slate-50 p-3 rounded-sm border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Drain Load
            </span>
            <strong className="text-slate-900 text-lg font-bold">{area.drainageCapacityPct}%</strong>
          </div>
          <div className="bg-slate-50 p-3 rounded-sm border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Rainfall Rate
            </span>
            <strong className="text-slate-800 font-mono text-xs font-bold">{area.rainfallMmHr} mm/h</strong>
          </div>
          <div className="bg-slate-50 p-3 rounded-sm border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Surcharge
            </span>
            <strong className="text-slate-800 font-mono text-xs font-bold">{area.surchargeStatus}</strong>
          </div>
        </div>

        {/* Action Toggle: Show Safe Bypass Route */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <button
            onClick={onToggleBypassRoute}
            className={`w-full py-2.5 px-4 rounded-sm text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer border ${
              showBypassRoute
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
                : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>{showBypassRoute ? 'Hide Safe Bypass Overlay' : 'Show Safe Bypass Route'}</span>
          </button>

          {/* ETA Comparison Card when Safe Bypass active */}
          {showBypassRoute && (
            <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-sm space-y-2 text-xs text-emerald-950  fade-in">
              <div className="flex items-center justify-between border-b border-emerald-200/80 pb-1.5 font-bold">
                <span className="flex items-center gap-1.5 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Recommended Transit Corridor
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold">
                <div className="bg-white/80 p-2 rounded border border-emerald-200 text-rose-800">
                  <span className="text-[10px] text-slate-500 font-normal block">Normal Route</span>
                  <span>{area.etaNormalMins} min (Blocked)</span>
                </div>
                <div className="bg-white/80 p-2 rounded border border-emerald-200 text-emerald-900">
                  <span className="text-[10px] text-slate-500 font-normal block">Bypass Route</span>
                  <span>{area.etaBypassMins} min (Safe)</span>
                </div>
              </div>

              <p className="text-[11px] text-emerald-900 font-medium leading-relaxed pt-1">
                {area.bypassAdvice}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="text-[11px] text-slate-400 text-center font-mono pt-3 border-t border-slate-100">
        FloodTwin Telemetry Engine · Pune GIS
      </div>
    </div>
  );
};
