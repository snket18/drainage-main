'use client';

import React from 'react';
import { useDemo } from '@/context/DemoContext';
import { MetricCard } from '@/components/ui/MetricCard';
import { CloudRain, Radio, Zap, Clock } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export default function NowcastPage() {
  const { stepState, selectedArea } = useDemo();

  const isShivajinagar = selectedArea.id === 'shivajinagar';
  const activeRain = isShivajinagar ? stepState.rainfallMmHr : selectedArea.rainfallMmHr;

  const timelineData = [
    { time: '10:00', rainfall: 5, accumulation: 2, status: 'Normal' },
    { time: '10:30', rainfall: 12, accumulation: 5, status: 'Normal' },
    { time: '11:00', rainfall: 22, accumulation: 11, status: 'Moderate' },
    { time: '11:30', rainfall: activeRain, accumulation: 24, status: activeRain >= 60 ? 'Cloudburst' : 'Heavy' },
    { time: '12:00 (Forecast)', rainfall: Math.max(15, activeRain - 10), accumulation: 38, status: 'Forecast' },
    { time: '12:30 (Forecast)', rainfall: Math.max(8, activeRain - 25), accumulation: 45, status: 'Receding' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-xs space-y-1">
        <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1">
          <CloudRain className="w-3.5 h-3.5 text-slate-600" />
          <span>Doppler Weather Radar Telemetry</span>
          <span>•</span>
          <span className="font-semibold text-slate-700">{selectedArea.name} ({selectedArea.ward})</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Rainfall nowcast forecast timeline
        </h1>
        <p className="text-sm text-slate-600 font-normal">
          Localized high-resolution rainfall velocity and accumulation projection over catchments.
        </p>
      </div>

      {/* Top 3 Secondary Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Current rainfall rate"
          value={activeRain}
          unit="mm/hr"
          subtitle="Doppler velocity grid"
          icon={Zap}
          variant={activeRain >= 60 ? 'red' : activeRain >= 30 ? 'amber' : 'cyan'}
        />
        <MetricCard
          title="Projected 1-hr accumulation"
          value="~45"
          unit="mm"
          subtitle="Total storm catchment depth"
          icon={CloudRain}
          variant="amber"
        />
        <MetricCard
          title="Storm cell velocity"
          value="24"
          unit="km/h"
          subtitle="Moving South-West direction"
          icon={Radio}
          variant="emerald"
        />
      </div>

      {/* Primary Visual: Dominating Forecast Chart View */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Rainfall intensity timeline projection
            </h2>
            <p className="text-xs text-slate-500 font-medium">3-Hour rolling forecast window</p>
          </div>
          <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Radar scan updated 2 mins ago
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="rainfall" stroke="#0284c7" fill="#0284c7" fillOpacity={0.25} name="Rainfall Rate (mm/h)" />
              <Area type="monotone" dataKey="accumulation" stroke="#0f766e" fill="#0f766e" fillOpacity={0.15} name="Accumulation (mm)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Forecast Data Table */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
          Sub-catchment rain gauge log
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Time Window</th>
                <th className="py-2.5 px-3">Rainfall Rate</th>
                <th className="py-2.5 px-3">Accumulated Depth</th>
                <th className="py-2.5 px-3">Status Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {timelineData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 text-slate-900 font-bold">{row.time}</td>
                  <td className="py-2.5 px-3 text-slate-800">{row.rainfall} mm/hr</td>
                  <td className="py-2.5 px-3 text-slate-800">{row.accumulation} mm</td>
                  <td className="py-2.5 px-3 text-slate-600">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
