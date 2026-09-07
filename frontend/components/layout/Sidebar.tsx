'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDemo } from '@/context/DemoContext';
import {
  LayoutDashboard,
  Map,
  CloudRain,
  GitMerge,
  Cpu,
  Video,
  Bell,
  Wrench,
  Navigation,
  Users,
  Compass,
  Sliders,
  BarChart3,
  Maximize2,
  CheckCircle,
  SunMedium,
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { selectedArea } = useDemo();

  const navigationSections: NavSection[] = [
    {
      title: 'MONITOR',
      items: [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Live Map', path: '/map', icon: Map },
        { name: 'Rainfall', path: '/nowcast', icon: CloudRain },
        { name: 'Drainage', path: '/drainage', icon: GitMerge },
        { name: 'Sensors', path: '/sensors', icon: Cpu },
        { name: 'CCTV', path: '/cctv', icon: Video },
      ],
    },
    {
      title: 'RESPOND',
      items: [
        { name: 'Alerts', path: '/alerts', icon: Bell },
        { name: 'Interventions', path: '/interventions', icon: Wrench },
        { name: 'Emergency Routing', path: '/routing', icon: Navigation },
        { name: 'Field Operations', path: '/field-ops', icon: Users },
      ],
    },
    {
      title: 'ANALYZE',
      items: [
        { name: 'Area Explorer', path: '/area-overview', icon: Compass },
        { name: 'What-If Simulator', path: '/simulator', icon: Sliders },
        { name: 'Reports', path: '/reports', icon: BarChart3 },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 text-slate-700 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-sm bg-slate-900 flex items-center justify-center text-white font-bold shadow-xs">
          <SunMedium className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-extrabold text-base tracking-tight text-slate-900">
            FloodTwin
          </h1>
          <p className="text-[11px] text-slate-500 font-medium">Urban GIS Nowcasting</p>
        </div>
      </div>

      {/* Operations Center Button */}
      <div className="p-3 border-b border-slate-200">
        <Link
          href="/command-center"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-sm text-xs font-bold transition-all ${
            pathname === '/command-center'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Maximize2 className="w-4 h-4 text-slate-600" />
          <span>Operations Center</span>
        </Link>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto scrollbar-thin">
        {navigationSections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider mb-1.5">
              {sec.title}
            </div>

            {sec.items.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-sm text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-extrabold border border-slate-200 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* System Status Footbar */}
      <div className="p-3 border-t border-slate-200 text-xs">
        <div className="bg-slate-50 rounded-sm p-3 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-slate-600 text-[11px] font-semibold">
            <span className="flex items-center gap-1.5 text-slate-800 font-bold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              System operational
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 font-mono">
            <div>Radar <span className="text-emerald-600 font-bold">✓</span></div>
            <div>Sensors <span className="text-emerald-600 font-bold">18/20</span></div>
            <div>CCTV <span className="text-emerald-600 font-bold">6/6</span></div>
            <div>Model <span className="text-emerald-600 font-bold">✓</span></div>
          </div>

          <div className="pt-1.5 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Location:</span>
            <span className="font-bold text-slate-900">{selectedArea.name}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
