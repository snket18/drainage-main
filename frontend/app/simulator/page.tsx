'use client';

import React from 'react';
import { useDemo } from '@/context/DemoContext';
import { MetricCard } from '@/components/ui/MetricCard';
import { Sliders, RotateCcw, Play, CheckCircle } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function SimulatorPage() {
  const { simulatorOverrides, setSimulatorOverrides, resetSimulatorOverrides, selectedArea } = useDemo();

  // Simulated depth calculation
  const baseRain = simulatorOverrides.rainfallMmHr;
  const baseRiver = simulatorOverrides.muthaRiverLevelM;
  const desiltGain = (simulatorOverrides.desiltingPct / 100) * 15;
  const pumpGain = simulatorOverrides.extraPumpsActive * 12;

  const simulatedDepth = Math.max(
    5,
    Math.round(baseRain * 0.7 + baseRiver * 8 - desiltGain - pumpGain)
  );

  const chartData = [
    { time: 'T-0', baseline: 12, simulated: 12 },
    { time: 'T+15m', baseline: 28, simulated: Math.max(10, simulatedDepth - 10) },
    { time: 'T+30m', baseline: 48, simulated: simulatedDepth },
    { time: 'T+45m', baseline: 42, simulated: Math.max(8, simulatedDepth - 15) },
    { time: 'T+60m', baseline: 25, simulated: Math.max(5, simulatedDepth - 22) },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-xs space-y-1">
        <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1">
          <Sliders className="w-3.5 h-3.5 text-slate-600" />
          <span>Hydrodynamic Scenario Modeling</span>
          <span>•</span>
          <span className="font-semibold text-slate-700">{selectedArea.name} ({selectedArea.ward})</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          What-if scenario simulator
        </h1>
        <p className="text-sm text-slate-600 font-normal">
          Simulate rainfall intensity, river backwater, desilting, and mobile pumping intervention outcomes.
        </p>
      </div>

      {/* Top Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Simulated water depth"
          value={simulatedDepth}
          unit="cm"
          subtitle="Projected underpass peak depth"
          icon={Sliders}
          variant={simulatedDepth >= 40 ? 'red' : simulatedDepth >= 20 ? 'amber' : 'emerald'}
        />
        <MetricCard
          title="Depth reduction gain"
          value={`-${Math.round(pumpGain + desiltGain)}`}
          unit="cm"
          subtitle="Net intervention benefit"
          icon={CheckCircle}
          variant="emerald"
        />
        <MetricCard
          title="Active mobile pumps"
          value={simulatorOverrides.extraPumpsActive}
          subtitle="1.2 m³/s rate per unit"
          icon={Play}
          variant="cyan"
        />
      </div>

      {/* Main Grid: Controls (Left) + Scenario Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Controls Panel */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900">Scenario parameters</h2>
            <button
              onClick={resetSimulatorOverrides}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Slider 1: Rainfall Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-800">
              <span>Rainfall intensity</span>
              <span>{simulatorOverrides.rainfallMmHr} mm/hr</span>
            </div>
            <input
              type="range"
              min="0"
              max="120"
              value={simulatorOverrides.rainfallMmHr}
              onChange={(e) =>
                setSimulatorOverrides((prev) => ({
                  ...prev,
                  rainfallMmHr: Number(e.target.value),
                }))
              }
              className="w-full accent-slate-900 cursor-pointer"
            />
          </div>

          {/* Slider 2: Mutha River Level */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-800">
              <span>River stage height</span>
              <span>{simulatorOverrides.muthaRiverLevelM} m</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={simulatorOverrides.muthaRiverLevelM}
              onChange={(e) =>
                setSimulatorOverrides((prev) => ({
                  ...prev,
                  muthaRiverLevelM: Number(e.target.value),
                }))
              }
              className="w-full accent-slate-900 cursor-pointer"
            />
          </div>

          {/* Slider 3: Desilting Percentage */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-800">
              <span>Culvert C-14 desilting</span>
              <span>{simulatorOverrides.desiltingPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={simulatorOverrides.desiltingPct}
              onChange={(e) =>
                setSimulatorOverrides((prev) => ({
                  ...prev,
                  desiltingPct: Number(e.target.value),
                }))
              }
              className="w-full accent-slate-900 cursor-pointer"
            />
          </div>

          {/* Stepper: Extra Dewatering Pumps */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200">
            <div className="flex justify-between text-xs font-semibold text-slate-800">
              <span>Mobile dewatering pumps</span>
              <span>{simulatorOverrides.extraPumpsActive} Active</span>
            </div>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() =>
                    setSimulatorOverrides((prev) => ({
                      ...prev,
                      extraPumpsActive: num,
                    }))
                  }
                  className={`flex-1 py-1.5 rounded-sm text-xs font-bold border cursor-pointer transition-all ${
                    simulatorOverrides.extraPumpsActive === num
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {num} Pump{num !== 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hydrodynamic Comparison Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Baseline vs simulated intervention depth curve
            </h2>
            <span className="text-xs text-slate-500 font-mono">60-Min Hydrodynamic Model</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="baseline" stroke="#dc2626" fill="#dc2626" fillOpacity={0.15} name="Baseline Depth (cm)" />
                <Area type="monotone" dataKey="simulated" stroke="#0f766e" fill="#0f766e" fillOpacity={0.25} name="Simulated Depth (cm)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
