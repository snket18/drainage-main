'use client';

import React, { useState } from 'react';
import { useDemo } from '@/context/DemoContext';
import { MetricCard } from '@/components/ui/MetricCard';
import { generatePdfReport } from '@/utils/pdfGenerator';
import { BarChart3, Download, FileText, Calendar, CheckCircle, FilePlus, X } from 'lucide-react';
import { MUMBAI_AREAS } from '@/data/searchData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function ReportsPage() {
  const { selectedArea } = useDemo();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [reportArea, setReportArea] = useState<string>(selectedArea.name);
  const [timePeriod, setTimePeriod] = useState<string>('Last 24 Hours');
  const [reportType, setReportType] = useState<string>('Area Risk Report');
  
  const [sections, setSections] = useState({
    rainfall: true,
    floodPrediction: true,
    drainage: true,
    sensors: true,
    cctv: true,
    alerts: true,
    interventions: true,
    routing: true,
    beforeAfter: true,
  });

  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);

  const historicalEvents = [
    { date: '2026-08-14', location: 'JM Road Underpass', peakRainfall: '78 mm/h', peakDepth: '42 cm', reliefTime: '22 min', interventions: 'Pump #4 + Sluice Gate #2' },
    { date: '2026-07-28', location: 'Nagar Road Subway', peakRainfall: '65 mm/h', peakDepth: '35 cm', reliefTime: '18 min', interventions: 'East Avenue Retention Bypass' },
    { date: '2026-07-10', location: 'Solapur Highway Culvert', peakRainfall: '52 mm/h', peakDepth: '22 cm', reliefTime: '12 min', interventions: 'Jetting Vacuum Desilting' },
    { date: '2026-06-22', location: 'JM Road Underpass', peakRainfall: '92 mm/h', peakDepth: '54 cm', reliefTime: '30 min', interventions: 'Mobile Pump Squad' },
  ];

  const chartData = [
    { month: 'Jun', events: 3, avgRain: 45, maxDepth: 54 },
    { month: 'Jul', events: 5, avgRain: 58, maxDepth: 38 },
    { month: 'Aug', events: 4, avgRain: 62, maxDepth: 48 },
    { month: 'Sep (Forecast)', events: 2, avgRain: 35, maxDepth: 25 },
  ];

  const handleGeneratePdf = () => {
    generatePdfReport({
      areaName: reportArea,
      timePeriod,
      reportType,
      includeSections: sections,
    });

    setShowModal(false);
    setDownloadSuccessMsg(`Official PDF Report "FloodTwin_${reportArea}_Report.pdf" generated & downloaded!`);
    setTimeout(() => setDownloadSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-sm border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-600" />
            <span>Reports & Document Generator</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Generate official municipal incident reports, risk audits, & drainage analytics
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-sm text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <FilePlus className="w-4 h-4" />
          <span>Generate Report</span>
        </button>
      </div>

      {downloadSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-xs font-bold flex items-center gap-2  fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{downloadSuccessMsg}</span>
        </div>
      )}

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Monsoon Season Incidents"
          value="14"
          unit="events"
          subtitle="PMC Ward #14 Logged"
          icon={Calendar}
          variant="cyan"
        />
        <MetricCard
          title="Avg Time-to-Relief"
          value="~21"
          unit="min"
          subtitle="Post-Intervention Baseline"
          icon={BarChart3}
          variant="emerald"
        />
        <MetricCard
          title="Primary Bottleneck"
          value="Culvert C-14"
          subtitle="Mithi Confluence Outfall"
          icon={FileText}
          variant="amber"
        />
      </div>

      {/* Monthly Chart */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Monthly rainfall vs peak inundation depth</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="avgRain" fill="#0284c7" name="Avg Rainfall (mm/h)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="maxDepth" fill="#dc2626" name="Max Water Depth (cm)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Audit Table */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Municipal incident log directory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Peak Rainfall</th>
                <th className="py-3 px-3">Peak Depth</th>
                <th className="py-3 px-3">Relief Time</th>
                <th className="py-3 px-3">Interventions Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historicalEvents.map((evt, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-700">{evt.date}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{evt.location}</td>
                  <td className="py-3 px-3 text-slate-700 font-medium">{evt.peakRainfall}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{evt.peakDepth}</td>
                  <td className="py-3 px-3 text-slate-700 font-medium">{evt.reliefTime}</td>
                  <td className="py-3 px-3 text-slate-700 font-medium">{evt.interventions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Generator Options Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-sm max-w-xl w-full p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-slate-600" />
                <h3 className="text-base font-bold text-slate-900">Generate Report</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Select Options Form */}
            <div className="space-y-4 text-xs">
              {/* Select Area */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 uppercase text-[10px]">Select Area</label>
                <select
                  value={reportArea}
                  onChange={(e) => setReportArea(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-sm p-2.5 font-bold text-slate-900 focus:outline-none"
                >
                  {Object.values(MUMBAI_AREAS).map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.name} ({a.ward})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Time Period & Report Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 uppercase text-[10px]">Time Period</label>
                  <select
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-sm p-2.5 font-bold text-slate-900"
                  >
                    <option value="Last 24 Hours">Last 24 Hours</option>
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="Monsoon Season 2026">Monsoon Season 2026</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 uppercase text-[10px]">Report Type</label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-sm p-2.5 font-bold text-slate-900"
                  >
                    <option value="Area Risk Report">Area Risk Report</option>
                    <option value="Flood Incident Report">Flood Incident Report</option>
                    <option value="Drainage Health Report">Drainage Health Report</option>
                  </select>
                </div>
              </div>

              {/* Include Sections Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="font-semibold text-slate-700 uppercase text-[10px] block">
                  Select sections to include
                </label>
                <div className="grid grid-cols-2 gap-2 text-slate-700 font-semibold">
                  {Object.entries(sections).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 p-2 rounded-sm bg-slate-50 border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          setSections((prev) => ({ ...prev, [key]: e.target.checked }))
                        }
                        className="accent-slate-900 rounded"
                      />
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleGeneratePdf}
                className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD PDF REPORT</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
