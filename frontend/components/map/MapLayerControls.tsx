'use client';

import React from 'react';
import { Layers, ShieldAlert, GitMerge, Cpu, Video, Navigation, AlertTriangle } from 'lucide-react';

export interface MapLayerState {
  floodRisk: boolean;
  drainageNetwork: boolean;
  sensors: boolean;
  cctv: boolean;
  affectedRoads: boolean;
  emergencyRoutes: boolean;
}

interface MapLayerControlsProps {
  layers: MapLayerState;
  onToggleLayer: (layerKey: keyof MapLayerState) => void;
}

export const MapLayerControls: React.FC<MapLayerControlsProps> = ({ layers, onToggleLayer }) => {
  const toggleItems: Array<{
    key: keyof MapLayerState;
    label: string;
    icon: React.ElementType;
    activeColor: string;
  }> = [
    { key: 'floodRisk', label: 'Flood Risk Areas', icon: ShieldAlert, activeColor: 'bg-red-50 border-red-300 text-red-700' },
    { key: 'drainageNetwork', label: 'Drainage Network', icon: GitMerge, activeColor: 'bg-blue-50 border-blue-300 text-blue-700' },
    { key: 'sensors', label: 'IoT Sensors', icon: Cpu, activeColor: 'bg-cyan-50 border-cyan-300 text-cyan-700' },
    { key: 'cctv', label: 'CCTV Cameras', icon: Video, activeColor: 'bg-purple-50 border-purple-300 text-purple-700' },
    { key: 'affectedRoads', label: 'Affected Roads', icon: AlertTriangle, activeColor: 'bg-amber-50 border-amber-300 text-amber-800' },
    { key: 'emergencyRoutes', label: 'Emergency Routes', icon: Navigation, activeColor: 'bg-emerald-50 border-emerald-300 text-emerald-800' },
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-sm border border-slate-200 shadow-sm z-10 flex items-center gap-1.5 text-xs overflow-x-auto whitespace-nowrap scrollbar-none max-w-full">
      <div className="flex items-center gap-1.5 pr-2 border-r border-slate-200 text-slate-700 font-bold text-[11px] uppercase tracking-wider shrink-0">
        <Layers className="w-3.5 h-3.5 text-slate-500" />
        <span>Layers:</span>
      </div>

      {toggleItems.map((item) => {
        const Icon = item.icon;
        const isActive = layers[item.key];
        return (
          <button
            key={item.key}
            onClick={() => onToggleLayer(item.key)}
            className={`shrink-0 px-2.5 py-1 rounded-sm border font-semibold flex items-center gap-1.5 transition-all text-[11px] cursor-pointer ${
              isActive
                ? `${item.activeColor} shadow-xs font-bold`
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'opacity-100' : 'opacity-60'}`} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
