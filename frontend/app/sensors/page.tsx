'use client';

import React from 'react';
import { useDemo } from '@/context/DemoContext';
import { MetricCard } from '@/components/ui/MetricCard';
import { Cpu, Wifi, CheckCircle, AlertTriangle } from 'lucide-react';

export default function SensorsPage() {
  const { sensors, selectedArea } = useDemo();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-xs space-y-1">
        <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1">
          <Cpu className="w-3.5 h-3.5 text-slate-600" />
          <span>LoRaWAN Telemetry Network</span>
          <span>•</span>
          <span className="font-semibold text-slate-700">{selectedArea.name} ({selectedArea.ward})</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Sensors telemetry & IoT gauges
        </h1>
        <p className="text-sm text-slate-600 font-normal">
          Real-time ultrasonic water depth gauges, Doppler flow velocity sensors, and rain gauge telemetry.
        </p>
      </div>

      {/* Top 3 Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Active IoT sensors"
          value={`${sensors.length}/${sensors.length}`}
          subtitle="LoRaWAN signal active"
          icon={Wifi}
          variant="emerald"
        />
        <MetricCard
          title="Primary depth gauge S-01"
          value={sensors.find((s) => s.id === 'S-01')?.value || 12}
          unit="cm"
          subtitle="JM Underpass Sump"
          icon={Cpu}
          variant={(sensors.find((s) => s.id === 'S-01')?.value || 0) >= 20 ? 'red' : 'emerald'}
        />
        <MetricCard
          title="Network uptime"
          value="99.8%"
          subtitle="PMC Gateway Cluster #4"
          icon={CheckCircle}
          variant="cyan"
        />
      </div>

      {/* Primary Visual: Telemetry Data Table */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Sensor node observation telemetry
            </h2>
            <p className="text-xs text-slate-500 font-medium">Updated every 60 seconds over LoRaWAN network</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">Gateway Ping: 14ms</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Node ID</th>
                <th className="py-3 px-3">Location Name</th>
                <th className="py-3 px-3">Sensor Type</th>
                <th className="py-3 px-3">Telemetry Reading</th>
                <th className="py-3 px-3">Battery Level</th>
                <th className="py-3 px-3">Signal Strength</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {sensors.map((sensor) => (
                <tr key={sensor.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{sensor.id}</td>
                  <td className="py-3 px-3 text-slate-800">{sensor.location}</td>
                  <td className="py-3 px-3 text-slate-600">{sensor.type}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{sensor.value} {sensor.unit}</td>
                  <td className="py-3 px-3 text-slate-600">{sensor.battery}%</td>
                  <td className="py-3 px-3 text-slate-600">{sensor.signal}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        sensor.status === 'critical'
                          ? 'bg-red-100 text-red-700'
                          : sensor.status === 'warning'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {sensor.status === 'critical' ? 'Critical' : sensor.status === 'warning' ? 'Warning' : 'Normal'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
