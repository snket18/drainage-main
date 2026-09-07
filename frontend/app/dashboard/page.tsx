'use client';

import React from 'react';
import { useDemo } from '@/context/DemoContext';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { Activity, ShieldAlert, Navigation, Video, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const { stepState, selectedArea, sensors } = useDemo();

  const activeRain = sensors.find(s => s.id === 'S-06')?.value || selectedArea.rainfallMmHr;
  const activeDepth = sensors.find(s => s.id === 'S-01')?.value || selectedArea.waterDepthCm;
  // Fall back to original mock derivation for capacity since we didn't expose it through sensors natively
  const isHindmata = selectedArea.id === 'hindmata';
  const activeCapacity = isHindmata ? stepState.drainageCapacityPct : selectedArea.drainageCapacityPct;
  const activeTimeToCritical = isHindmata ? stepState.timeToCriticalMins : selectedArea.timeToCriticalMins;

  const nowcastData = [
    { time: '11:00', rainfall: 10, depth: 8 },
    { time: '11:15', rainfall: 18, depth: 12 },
    { time: '11:30', rainfall: 35, depth: 18 },
    { time: '11:45', rainfall: activeRain, depth: activeDepth },
    { time: '12:00', rainfall: Math.max(10, activeRain - 15), depth: Math.max(10, activeDepth - 10) },
  ];

  return (
    <div className="relative w-full h-[calc(100vh-2rem)] border border-slate-300 bg-slate-50 flex flex-col">
       {/* Background Map filling the entire container */}
       <div className="absolute inset-0 z-0">
          <InteractiveMap heightClass="h-full w-full" showLayerControl={false} />
       </div>

       {/* Top Header Overlay */}
       <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
          <div className="bg-white border border-slate-300 p-4 pointer-events-auto max-w-sm">
             <div className="flex items-center gap-2 mb-1 text-[10px] text-slate-600 font-bold tracking-widest uppercase">
                <span>Nowcast</span>
                <span className="text-slate-400">/</span>
                <span className="text-cyan-700">{selectedArea.ward}</span>
             </div>
             <h1 className="text-lg font-black text-slate-900 tracking-tight">
                {selectedArea.name}
             </h1>
          </div>
          
          <div className="pointer-events-auto mr-12">
             <Link
                href="/area-overview"
                className="flex items-center bg-slate-900 hover:bg-slate-800 border border-slate-900 text-white px-4 py-2 text-xs font-semibold"
              >
                <span>Area Data</span>
              </Link>
          </div>
       </div>

       {/* Left Stats Overlay */}
       <div className="absolute top-28 left-4 bottom-4 z-10 flex flex-col gap-2 pointer-events-none w-72 overflow-y-auto scrollbar-none pb-4">
          <div className="grid grid-cols-2 gap-2">
             <StatPanel title="Water Depth" value={activeDepth} unit="cm" />
             <StatPanel title="Rainfall" value={activeRain} unit="mm/h" />
             <StatPanel title="Drainage Load" value={activeCapacity} unit="%" />
             <StatPanel title="To Critical" value={activeTimeToCritical || 'N/A'} unit="min" />
          </div>

          <div className="bg-white border border-slate-300 p-4 pointer-events-auto mt-2 shrink-0">
             <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2">
               Contextual Risk Analysis
             </h4>
             <p className="text-[11px] font-medium text-slate-600 leading-relaxed mb-4">
               {selectedArea.description}
             </p>
             
             {selectedArea.riskDrivers && selectedArea.riskDrivers.length > 0 && (
                <div className="mb-4">
                   <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                     Why is this area at risk?
                   </h5>
                   <div className="space-y-3">
                     {selectedArea.riskDrivers.map((risk, i) => (
                        <div key={i} className="text-xs bg-slate-50 p-2.5 border border-slate-200">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">{i === 0 ? 'PRIMARY CAUSE' : 'CONTRIBUTING FACTOR'}</span>
                          <span className="font-bold text-slate-800 block">{risk.factor}</span>
                          <span className="text-slate-500 mt-1 block text-[11px] leading-snug font-medium">{risk.detail}</span>
                        </div>
                     ))}
                   </div>
                </div>
             )}

             {selectedArea.affectedRoads && selectedArea.affectedRoads.length > 0 && (
                <div className="mb-4">
                   <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">
                     Affected Roads (Flood Extent)
                   </h5>
                   <div className="flex flex-wrap gap-1.5">
                     {selectedArea.affectedRoads.map((road, i) => (
                        <span key={i} className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-1 text-[10px] font-semibold">
                          {road}
                        </span>
                     ))}
                   </div>
                </div>
             )}

             <div>
                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-200 pb-1 flex items-center justify-between">
                  <span>Verification Evidence</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded-sm">AI CONFIRMED</span>
                </h5>
                <div className="bg-slate-100 border border-slate-200 p-2 text-xs">
                  <div className="flex items-center gap-2 mb-1 text-slate-900 font-bold">
                    <Video className="w-3.5 h-3.5" />
                    <span>CCTV Feed Analytics</span>
                  </div>
                  <p className="text-slate-600 mb-2">
                    {activeDepth > 20 ? 'Computer vision detected severe waterlogging on primary routes. Commuter traffic is halted.' : 'Street feeds currently show normal conditions. Monitoring for rapid accumulation.'}
                  </p>
                  <Link href="/cctv" className="text-cyan-600 font-bold hover:underline flex items-center gap-1">
                    View Camera Feeds &rarr;
                  </Link>
                </div>
             </div>
          </div>
       </div>

       {/* Right Sidebar Overlay (Advisory & Chart) */}
       <div className="absolute top-28 right-4 bottom-[72px] z-10 w-[340px] flex flex-col gap-2 pointer-events-none overflow-y-auto scrollbar-none pb-4">
          
          {/* Priority Advisory */}
          {isHindmata && stepState.activeAlert ? (
             <div className="bg-white border border-slate-300 p-4 pointer-events-auto shrink-0 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                   <div className="flex items-center gap-2 font-bold text-xs text-rose-700">
                     <ShieldAlert className="w-4 h-4" />
                     <span>Advisory</span>
                   </div>
                   <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-sm">
                     {stepState.phase}
                   </span>
                </div>
                <h4 className="text-[13px] font-black text-slate-900 mb-1.5 leading-tight">
                   {stepState.activeAlert.title}
                </h4>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed mb-4">
                   {stepState.activeAlert.description}
                </p>
                <div className="bg-slate-50 p-3 border border-slate-200 mb-4 rounded-sm">
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                     Recommended Action
                   </span>
                   <p className="text-[11px] text-slate-800 font-bold leading-snug">
                     {stepState.activeAlert.recommendedAction}
                   </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <Link href="/interventions" className="flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white py-2 text-xs font-semibold rounded-sm">
                     <span>Interventions</span>
                   </Link>
                   <Link href="/routing" className="flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 py-2 text-xs font-semibold border border-slate-300 rounded-sm">
                     <Navigation className="w-3.5 h-3.5 text-slate-500" />
                     <span>Route</span>
                   </Link>
                </div>
             </div>
          ) : (
             <div className="bg-white border border-slate-300 p-4 pointer-events-auto shrink-0 shadow-sm flex flex-col items-center justify-center text-center py-8">
                <CheckCircle className="w-8 h-8 text-emerald-500 mb-3" />
                <h4 className="text-[13px] font-black text-slate-900 mb-1 leading-tight">
                   No Active Incidents
                </h4>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-[200px]">
                   Telemetry indicates normal operational status for this sector.
                </p>
             </div>
          )}

          {/* Nowcast Chart (Lines, no gradient, rough) */}
          <div className="bg-white border border-slate-300 p-4 pointer-events-auto mt-auto shrink-0">
             <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4 flex items-center gap-2">
               <Activity className="w-3.5 h-3.5" />
               Nowcast Trend
             </h4>
             <div className="h-44 w-full -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={nowcastData}>
                     <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={5} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0', fontSize: '11px', fontWeight: '600' }} 
                     />
                     <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                     <Line type="linear" dataKey="rainfall" stroke="#0284c7" strokeWidth={2} dot={false} name="Rain (mm/h)" />
                     <Line type="linear" dataKey="depth" stroke="#ef4444" strokeWidth={2} dot={false} name="Depth (cm)" />
                   </LineChart>
                </ResponsiveContainer>
             </div>
          </div>
       </div>
    </div>
  );
}

// Flat, square stats panel
function StatPanel({ title, value, unit }: { title: string, value: string | number, unit: string }) {
  return (
    <div className="flex flex-col justify-center bg-white border border-slate-300 p-3 pointer-events-auto shadow-xs">
      <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-1 truncate">{title}</div>
      <div className="flex items-baseline gap-1 overflow-hidden">
        <span className="text-lg font-black text-slate-900 truncate">{value}</span>
        {unit && <span className="text-[10px] font-bold text-slate-400">{unit}</span>}
      </div>
    </div>
  );
}
