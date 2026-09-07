'use client';

import React, { useState } from 'react';
import { useDemo } from '@/context/DemoContext';
import { Video, CheckCircle, Eye, Car, Layers, X } from 'lucide-react';

export default function CCTVPage() {
  const { stepState, cctv, selectedArea } = useDemo();
  const [selectedCam, setSelectedCam] = useState<(typeof cctv)[0] | null>(null);

  const isFlooded = stepState.maxWaterDepthCm > 20;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-sm border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Video className="w-5 h-5 text-slate-600" />
            <span>CCTV Verification ({selectedArea.name})</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Municipal camera feeds with computer vision waterlogging verification & vehicle velocity tracking
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-sm text-xs text-slate-700 font-semibold">
          <span className="w-2 h-2 rounded-sm bg-emerald-600" />
          <span>Camera feeds online (6/6)</span>
        </div>
      </div>

      {/* Triangulated Verification Status Banner */}
      <div className={`p-6 rounded-sm border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isFlooded ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-sm border ${isFlooded ? 'bg-red-600 text-white border-red-500' : 'bg-emerald-600 text-white border-emerald-500'}`}>
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Triangulated Evidence
            </div>
            <h2 className="text-base font-bold mt-0.5">
              Model prediction ({selectedArea.predictionFactors.confidencePct}%) • IoT reading ({stepState.maxWaterDepthCm} cm) • CCTV observation
            </h2>
            <p className="text-xs font-normal opacity-90">
              {isFlooded
                ? 'All three data sources confirm active standing water on roadway.'
                : 'All three data sources confirm clear carriageway with normal traffic velocity.'}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <span
            className={`text-xs font-bold px-3.5 py-1.5 rounded-sm border ${
              isFlooded ? 'bg-red-600 text-white border-red-700' : 'bg-emerald-600 text-white border-emerald-700'
            }`}
          >
            {isFlooded ? 'Flood verified' : 'No flood confirmed'}
          </span>
        </div>
      </div>

      {/* 4 Camera Surveillance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cctv.map((cam) => {
          const isAlert = cam.aiWaterDetection;

          return (
            <div
              key={cam.id}
              onClick={() => setSelectedCam(cam)}
              className={`bg-white border rounded-sm overflow-hidden shadow-xs cursor-pointer group transition-all hover:shadow-sm ${
                isAlert ? 'border-red-300' : 'border-slate-200'
              }`}
            >
              {/* Feed Header */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-slate-300" />
                  <span className="text-xs font-bold">{cam.name}</span>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    isAlert ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                  }`}
                >
                  {isAlert ? 'Waterlogging detected' : 'Clear road'}
                </span>
              </div>

              {/* Camera Simulated Frame */}
              <div className="relative w-full h-52 bg-slate-100 flex flex-col items-center justify-center p-4">
                <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />

                <div className="absolute bottom-0 w-full h-20 bg-slate-200 border-t border-slate-300 flex items-center justify-center">
                  {isAlert && (
                    <div className="absolute inset-0 bg-red-500/20 border-t-2 border-red-500 flex items-center justify-center">
                      <div className="bg-white text-red-700 text-xs font-mono font-bold px-3 py-1 rounded-sm border border-red-200 shadow-xs">
                        [Standing water depth ~{cam.waterDepthCm} cm • Confidence 99%]
                      </div>
                    </div>
                  )}
                </div>

                <div className="absolute top-3 left-3 text-[10px] font-mono font-bold bg-white px-2 py-1 rounded border border-slate-200 text-slate-800 shadow-xs">
                  {cam.lastSnapTime}
                </div>

                <div className="absolute top-3 right-3 text-[10px] font-mono font-bold bg-white px-2 py-1 rounded border border-slate-200 text-slate-800 shadow-xs flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-slate-600" />
                  <span>{cam.trafficSpeedKmph} km/h</span>
                </div>

                {!isAlert && (
                  <div className="relative z-10 text-center">
                    <CheckCircle className="w-7 h-7 text-emerald-600 mx-auto mb-1 opacity-80" />
                    <span className="text-xs text-slate-700 font-bold">Carriageway clear</span>
                  </div>
                )}
              </div>

              {/* Feed Footer */}
              <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span>Location: {cam.location}</span>
                <span className="text-slate-800 font-semibold flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  Inspect frame
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Snapshot Inspection Modal */}
      {selectedCam && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm max-w-xl w-full p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-slate-600" />
                <h3 className="text-base font-bold text-slate-900">{selectedCam.name} Inspection</h3>
              </div>
              <button
                onClick={() => setSelectedCam(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-sm border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Camera ID:</span>
                <span className="text-slate-900 font-mono font-bold">{selectedCam.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="text-slate-900 font-bold">{selectedCam.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Water Depth:</span>
                <span className="text-slate-900 font-bold">~{selectedCam.waterDepthCm} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Traffic Speed:</span>
                <span className="text-slate-900 font-bold">{selectedCam.trafficSpeedKmph} km/h</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedCam(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-sm text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
