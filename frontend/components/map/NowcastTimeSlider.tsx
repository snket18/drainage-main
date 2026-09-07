'use client';

import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, CloudRain, Activity } from 'lucide-react';
import { NOWCAST_TIME_STEPS } from '@/utils/drainageGraphEngine';

interface NowcastTimeSliderProps {
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  rainfallMmHr: number;
  maxDepthCm: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const NowcastTimeSlider: React.FC<NowcastTimeSliderProps> = ({
  currentStepIndex,
  onStepChange,
  rainfallMmHr,
  maxDepthCm,
  isPlaying,
  onTogglePlay,
}) => {
  const currentStep = NOWCAST_TIME_STEPS[currentStepIndex] || NOWCAST_TIME_STEPS[0];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      onStepChange((currentStepIndex + 1) % NOWCAST_TIME_STEPS.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isPlaying, currentStepIndex, onStepChange]);

  return (
    <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-sm bg-slate-900 text-white">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              0–3 Hour Hydrodynamic Forecast
            </span>
            <h3 className="text-sm font-bold text-slate-900">{currentStep.label}</h3>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-sm">
            <CloudRain className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 text-[11px]">Rain:</span>
            <strong className="text-slate-900 font-bold">{rainfallMmHr} mm/h</strong>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-sm">
            <Activity className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 text-[11px]">Max Depth:</span>
            <strong className={`font-bold ${maxDepthCm >= 30 ? 'text-rose-600' : maxDepthCm >= 15 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {maxDepthCm} cm
            </strong>
          </div>
        </div>
      </div>

      {/* Interactive Time Steps Progress Bar & Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-1">
          {NOWCAST_TIME_STEPS.map((step, idx) => {
            const isActive = currentStepIndex === idx;
            const isPassed = currentStepIndex > idx;

            return (
              <button
                key={step.offsetMins}
                onClick={() => onStepChange(idx)}
                className={`flex-1 py-1.5 px-2 rounded-sm text-xs font-semibold transition-all text-center cursor-pointer border ${
                  isActive
                    ? 'bg-slate-900 text-white font-bold border-slate-900 shadow-xs'
                    : isPassed
                    ? 'bg-slate-100 text-slate-800 border-slate-200'
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {step.label}
              </button>
            );
          })}
        </div>

        {/* Playback Controls & Range Slider */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={onTogglePlay}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 border-amber-400 hover:bg-amber-400'
                : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause Simulation' : 'Auto Play'}</span>
          </button>

          <input
            type="range"
            min="0"
            max={NOWCAST_TIME_STEPS.length - 1}
            value={currentStepIndex}
            onChange={(e) => onStepChange(parseInt(e.target.value, 10))}
            className="flex-1 accent-slate-900 h-2 bg-slate-200 rounded-sm cursor-pointer"
          />

          <button
            onClick={() => onStepChange(0)}
            className="p-1.5 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
            title="Reset to T + 0 min"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
