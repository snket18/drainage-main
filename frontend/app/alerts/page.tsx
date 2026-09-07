'use client';

import React from 'react';
import { useDemo } from '@/context/DemoContext';
import { MetricCard } from '@/components/ui/MetricCard';
import { Bell, ShieldAlert, AlertTriangle, CheckCircle, Navigation } from 'lucide-react';
import Link from 'next/link';

export default function AlertsPage() {
  const { stepState, selectedArea } = useDemo();

  const isFlooded = stepState.maxWaterDepthCm > 20;

  const alertHistory = [
    {
      id: 'ALT-103',
      time: '11:45 PM',
      type: 'Critical Inundation',
      location: `${selectedArea.name} Underpass`,
      message: `Ultrasonic Sensor S-01 depth reached ${stepState.maxWaterDepthCm} cm. Subway waterlogged.`,
      severity: isFlooded ? 'critical' : 'warning',
      action: 'Deploy Mobile Dewatering Pump Unit #4 & divert traffic via FC Road Flyover.',
    },
    {
      id: 'ALT-102',
      time: '11:20 PM',
      type: 'Capacity Warning',
      location: 'Trunk Main Pipe P-101',
      message: `Hydraulic capacity load reached ${stepState.drainageCapacityPct}%. Convective rain front.`,
      severity: 'warning',
      action: 'Open Dengle Sluice Gate #2 by 30% to create storage headroom.',
    },
    {
      id: 'ALT-101',
      time: '11:00 PM',
      type: 'Rainfall Advisory',
      location: `${selectedArea.name} Catchment`,
      message: 'Doppler weather radar projects rainfall velocity of 35-45 mm/hr within 30 minutes.',
      severity: 'info',
      action: 'Inspect storm grates and prepare dewatering teams on standby.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-xs space-y-1">
        <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1">
          <Bell className="w-3.5 h-3.5 text-slate-600" />
          <span>Municipal Alert Dispatch</span>
          <span>•</span>
          <span className="font-semibold text-slate-700">{selectedArea.name} ({selectedArea.ward})</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Alerts center & incident advisories
        </h1>
        <p className="text-sm text-slate-600 font-normal">
          Automated preventive notifications, threshold breaches, and emergency routing advisories.
        </p>
      </div>

      {/* Top Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Active advisories"
          value={isFlooded ? '1 Critical' : '0 Critical'}
          subtitle="PMC Sector #14"
          icon={ShieldAlert}
          variant={isFlooded ? 'red' : 'emerald'}
        />
        <MetricCard
          title="Subway obstruction"
          value={isFlooded ? 'Closed' : 'Passable'}
          subtitle={`${stepState.maxWaterDepthCm} cm water depth`}
          icon={AlertTriangle}
          variant={isFlooded ? 'red' : 'emerald'}
        />
        <MetricCard
          title="Reroute guidance"
          value="FC Flyover"
          subtitle="0 cm water depth"
          icon={Navigation}
          variant="cyan"
        />
      </div>

      {/* Primary Alert Feed List */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3">
          Incident advisories & threshold logs
        </h2>

        <div className="space-y-3">
          {alertHistory.map((alt) => (
            <div
              key={alt.id}
              className={`p-4 rounded-sm border space-y-2 text-xs ${
                alt.severity === 'critical'
                  ? 'bg-red-50/50 border-red-200 text-slate-900'
                  : alt.severity === 'warning'
                  ? 'bg-amber-50/50 border-amber-200 text-slate-900'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold">
                  <span className="font-mono text-slate-600">{alt.id}</span>
                  <span>•</span>
                  <span>{alt.type}</span>
                  <span>•</span>
                  <span className="text-slate-600 font-normal">{alt.location}</span>
                </div>
                <span className="text-slate-500 font-mono">{alt.time}</span>
              </div>

              <p className="text-slate-700 font-medium">{alt.message}</p>

              <div className="p-3 bg-white rounded-sm border border-slate-200 font-medium text-slate-800">
                <strong>Recommended Action:</strong> {alt.action}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
