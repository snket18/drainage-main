'use client';

import React from 'react';
import { useDemo } from '@/context/DemoContext';
import { MetricCard } from '@/components/ui/MetricCard';
import { CheckCheck, CheckCircle, Video, Cpu, ShieldCheck } from 'lucide-react';

export default function VerificationPage() {
  const { stepState, selectedArea } = useDemo();

  const isResolved = stepState.stepIndex === 7 || stepState.stepIndex === 6;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-xs space-y-1">
        <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1">
          <CheckCheck className="w-3.5 h-3.5 text-slate-600" />
          <span>Post-Incident Resolution Audit</span>
          <span>•</span>
          <span className="font-semibold text-slate-700">{selectedArea.name} ({selectedArea.ward})</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Resolution verification & sign-off
        </h1>
        <p className="text-sm text-slate-600 font-normal">
          Dual-source verification confirming standing water depth receded and traffic restored.
        </p>
      </div>

      {/* Verification Status Banner */}
      <div
        className={`p-6 rounded-sm border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isResolved ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-sm border ${isResolved ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-amber-600 text-white border-amber-500'}`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Resolution Audit Status
            </div>
            <h2 className="text-base font-bold mt-0.5">
              {isResolved
                ? `Incident resolved: Standing water receded to ${stepState.maxWaterDepthCm} cm`
                : `Resolution in progress: Standing water depth ${stepState.maxWaterDepthCm} cm`}
            </h2>
            <p className="text-xs font-normal opacity-90">
              IoT Sensor S-01 (14 cm) & CCTV observation confirm normal roadway travel velocity.
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <span
            className={`text-xs font-bold px-3.5 py-1.5 rounded-sm border ${
              isResolved ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-amber-600 text-white border-amber-700'
            }`}
          >
            {isResolved ? 'Verified & Resolved' : 'Monitoring Progress'}
          </span>
        </div>
      </div>

      {/* Dual Verification Sources Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
            <Cpu className="w-4 h-4 text-slate-600" />
            <span>IoT Sensor S-01 Telemetry</span>
          </div>
          <div className="text-xs text-slate-600 space-y-1 font-medium">
            <div>Current Water Depth: <strong className="text-slate-900">{stepState.maxWaterDepthCm} cm</strong></div>
            <div>Threshold Status: <strong className="text-emerald-700">Normal Range (&lt;15 cm)</strong></div>
            <div>Signal Telemetry: <strong className="text-slate-900">Active (LoRaWAN)</strong></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
            <Video className="w-4 h-4 text-slate-600" />
            <span>CCTV Vision Verification</span>
          </div>
          <div className="text-xs text-slate-600 space-y-1 font-medium">
            <div>Carriageway Status: <strong className="text-emerald-700">Clear Road</strong></div>
            <div>Vehicle Velocity: <strong className="text-slate-900">{stepState.cctvStatus.speedKmph} km/h</strong></div>
            <div>Traffic Obstruction: <strong className="text-emerald-700">Cleared</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
