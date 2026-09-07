'use client';

import React from 'react';

export const MapLegend: React.FC = () => {
  return (
    <div className="bg-white/95 backdrop-blur-md p-3 rounded-sm border border-slate-200 shadow-sm text-xs space-y-2 text-slate-800 pointer-events-auto">
      <div className="flex items-center justify-between border-b border-slate-100 pb-1">
        <span className="font-bold text-[11px] text-slate-900 uppercase tracking-wider">Map Legend</span>
        <span className="text-[10px] text-slate-400 font-mono">Pune Municipal GIS</span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] font-medium">
        {/* Flood Risk Levels */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Flood Risk</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-600 shadow-xs" />
            <span className="text-slate-700">Critical (&gt;30cm)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 shadow-xs" />
            <span className="text-slate-700">Moderate (15–30cm)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shadow-xs" />
            <span className="text-slate-700">Low (&lt;15cm)</span>
          </div>
        </div>

        {/* Routes & Roads */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Routes & Roads</span>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-1 rounded bg-emerald-500" />
            <span className="text-slate-700 font-semibold">Safest Route</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-1 rounded bg-amber-500" />
            <span className="text-slate-700">Fastest Route</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 border-b-2 border-dashed border-red-600" />
            <span className="text-red-700 font-semibold">Blocked Road</span>
          </div>
        </div>

        {/* Infrastructure Markers */}
        <div className="col-span-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600 font-semibold">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-cyan-500 border border-cyan-700" />
            <span>IoT Sensor</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-purple-500 border border-purple-700" />
            <span>CCTV AI</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-blue-600" />
            <span>Drainage Pipe</span>
          </div>
        </div>
      </div>
    </div>
  );
};
