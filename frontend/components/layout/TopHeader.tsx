'use client';

import React, { useState, useEffect } from 'react';
import { useDemo } from '@/context/DemoContext';
import { GlobalSearch } from '@/components/layout/GlobalSearch';
import {
  MapPin,
  Clock,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  SunMedium,
  Activity,
} from 'lucide-react';

export const TopHeader: React.FC = () => {
  const {
    currentStepIndex,
    stepState,
    isPlaying,
    setStepIndex,
    nextStep,
    prevStep,
    togglePlay,
    resetDemo,
    selectedArea,
  } = useDemo();

  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const stepsList = [
    { code: 'PREDICT', label: 'Predict' },
    { code: 'PREVENT', label: 'Prevent' },
    { code: 'DETECT', label: 'Detect' },
    { code: 'VERIFY', label: 'Verify' },
    { code: 'RESPOND', label: 'Respond' },
    { code: 'RESOLVE', label: 'Resolve' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-50 px-6 py-3 shadow-xs space-y-3">
      {/* Top Row: Product Brand Logo, Global Search Bar, Risk Badge & Clock */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Brand Logo & Active Area Context */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-2 rounded-sm bg-slate-900 text-white font-black flex items-center justify-center shadow-xs">
            <SunMedium className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900">
                FloodTwin
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-700 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-600" />
                {selectedArea.name} ({selectedArea.ward})
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span className="truncate">{selectedArea.zone}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">
                {selectedArea.isLiveDemo ? 'Live Telemetry' : 'Hydrodynamic Model'}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-lg">
          <GlobalSearch />
        </div>

        {/* Right: Muted Semantic Risk Badges & Clock */}
        <div className="flex items-center gap-3 shrink-0">
          <div>
            {stepState.badgeVariant === 'red' ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-sm bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold shadow-xs">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>Critical Risk</span>
              </span>
            ) : stepState.badgeVariant === 'yellow' ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-sm bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold shadow-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Early Warning</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold shadow-xs">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Normal Status</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1 rounded-sm text-xs font-mono font-semibold">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{timeString || '11:48 PM'} IST</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Incident Workflow Step Indicator */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0">
          <Activity className="w-3.5 h-3.5 text-slate-600" />
          <span>Incident Lifecycle:</span>
        </div>

        {/* Workflow Steps Segmented Control */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none font-semibold">
          {stepsList.map((st, idx) => {
            const stepMapping = [0, 1, 2, 3, 5, 7];
            const activeMappedIdx = stepMapping[idx] ?? idx;
            const isActive = currentStepIndex === activeMappedIdx;
            const isCompleted = currentStepIndex > activeMappedIdx;

            return (
              <React.Fragment key={st.code}>
                <button
                  onClick={() => setStepIndex(activeMappedIdx)}
                  className={`px-2.5 py-1 rounded-sm text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : isCompleted
                      ? 'text-slate-800 bg-slate-100 font-semibold'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {st.label}
                </button>
                {idx < stepsList.length - 1 && <span className="text-slate-300 text-xs">→</span>}
              </React.Fragment>
            );
          })}
        </div>

        {/* Auto Play Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={prevStep}
            className="p-1.5 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors border border-slate-200 cursor-pointer"
            title="Previous Stage"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={togglePlay}
            className={`px-3 py-1 rounded-sm text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
            }`}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Auto'}</span>
          </button>
          <button
            onClick={nextStep}
            className="p-1.5 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors border border-slate-200 cursor-pointer"
            title="Next Stage"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetDemo}
            className="p-1.5 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors border border-slate-200 cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
};
