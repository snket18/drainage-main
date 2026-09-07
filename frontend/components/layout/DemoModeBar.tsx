'use client';

import React from 'react';
import { useDemo } from '@/context/DemoContext';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export const DemoModeBar: React.FC = () => {
  const { currentStepIndex, stepState, isPlaying, setStepIndex, nextStep, prevStep, togglePlay, resetDemo } = useDemo();

  const stepsList = [
    { code: 'PREDICT', label: '1. Predict' },
    { code: 'PREVENT', label: '2. Prevent' },
    { code: 'DETECT', label: '3. Detect' },
    { code: 'VERIFY', label: '4. Verify' },
    { code: 'DIAGNOSE', label: '5. Diagnose' },
    { code: 'ACT', label: '6. Act' },
    { code: 'VERIFY_RESOLUTION', label: '7. Verify' },
    { code: 'RESOLVE', label: '8. Resolve' },
  ];

  return (
    <div className="bg-slate-900 border-b border-cyan-900/50 text-slate-100 px-4 py-2.5 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Title & Demo Mode Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-cyan-950 text-cyan-400 border border-cyan-700/60 px-2.5 py-1 rounded-sm text-xs font-semibold uppercase tracking-wider shadow-inner">
            <Sparkles className="w-3.5 h-3.5  text-cyan-400" />
            <span>Simulation Mode</span>
          </div>
          
          <div className="hidden sm:block border-l border-slate-700 h-5" />

          <div className="text-xs">
            <span className="text-slate-400">Current Phase: </span>
            <span className={`font-semibold ${
              stepState.phase === 'BEFORE FLOOD' ? 'text-amber-400' :
              stepState.phase === 'FLOOD OCCURS' ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {stepState.phase}
            </span>
          </div>
        </div>

        {/* Center: 8 Stepper Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full py-1 scrollbar-none">
          {stepsList.map((st, idx) => {
            const isActive = currentStepIndex === idx;
            const isPassed = currentStepIndex > idx;
            return (
              <button
                key={st.code}
                onClick={() => setStepIndex(idx)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20 scale-105'
                    : isPassed
                    ? 'bg-slate-800 text-cyan-300 hover:bg-slate-700 border border-slate-700'
                    : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {isPassed ? (
                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                ) : (
                  <span className={`w-3.5 h-3.5 rounded-sm text-[10px] flex items-center justify-center font-bold ${
                    isActive ? 'bg-slate-950 text-cyan-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {idx + 1}
                  </span>
                )}
                <span>{st.code}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Controller Play/Pause & Steppers */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevStep}
            className="p-1.5 rounded-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-semibold transition-all ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>

          <button
            onClick={nextStep}
            className="p-1.5 rounded-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={resetDemo}
            className="p-1.5 rounded-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors ml-1"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
