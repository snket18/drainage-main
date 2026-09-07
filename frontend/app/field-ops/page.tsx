'use client';

import React from 'react';
import { useDemo } from '@/context/DemoContext';
import { MetricCard } from '@/components/ui/MetricCard';
import { Users, Truck, CheckCircle, Clock } from 'lucide-react';

export default function FieldOpsPage() {
  const { fieldWorkers, selectedArea } = useDemo();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-xs space-y-1">
        <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1">
          <Users className="w-3.5 h-3.5 text-slate-600" />
          <span>PMC Disaster Response Squad</span>
          <span>•</span>
          <span className="font-semibold text-slate-700">{selectedArea.name} ({selectedArea.ward})</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Field operations & maintenance dispatch
        </h1>
        <p className="text-sm text-slate-600 font-normal">
          Real-time municipal crew locations, mobile pump deployment units, and barrier setup logs.
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Active field teams"
          value={fieldWorkers.length}
          subtitle="PMC Ward #14 Crew"
          icon={Users}
          variant="cyan"
        />
        <MetricCard
          title="Primary unit W-03"
          value={fieldWorkers.find((w) => w.id === 'W-03')?.status || 'IDLE'}
          subtitle={fieldWorkers.find((w) => w.id === 'W-03')?.locationName || 'Depot'}
          icon={Truck}
          variant={(fieldWorkers.find((w) => w.id === 'W-03')?.status || '') === 'PUMPING_ACTIVE' ? 'red' : 'emerald'}
        />
        <MetricCard
          title="Avg dispatch response"
          value="~12"
          unit="min"
          subtitle="Mobilization baseline"
          icon={Clock}
          variant="emerald"
        />
      </div>

      {/* Field Worker Table */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3">
          Field worker mobilization directory
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Crew ID</th>
                <th className="py-3 px-3">Team Name</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Assigned Task</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {fieldWorkers.map((worker, idx) => (
                <tr key={worker.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{worker.id}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{worker.name}</td>
                  <td className="py-3 px-3 text-slate-600">{worker.role}</td>
                  <td className="py-3 px-3 text-slate-800">{worker.locationName}</td>
                  <td className="py-3 px-3 text-slate-700">{worker.assignedTask}</td>
                  <td className="py-3 px-3 text-slate-600 font-mono">+91 98220 1400{idx + 1}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        worker.status === 'PUMPING_ACTIVE' || worker.status === 'DISPATCHED'
                          ? 'bg-amber-100 text-amber-700'
                          : worker.status === 'TASK_COMPLETED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {worker.status}
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
