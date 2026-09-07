'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'cyan' | 'emerald' | 'amber' | 'red' | 'purple';
  badgeText?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  variant = 'cyan',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'red':
        return {
          iconBg: 'bg-red-50 text-red-600 border border-red-100',
          textVal: 'text-red-700',
        };
      case 'amber':
        return {
          iconBg: 'bg-amber-50 text-amber-700 border border-amber-100',
          textVal: 'text-amber-700',
        };
      case 'emerald':
        return {
          iconBg: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
          textVal: 'text-emerald-700',
        };
      default:
        return {
          iconBg: 'bg-slate-100 text-slate-700 border border-slate-200',
          textVal: 'text-slate-900',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-xs space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-sm ${styles.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-black tracking-tight ${styles.textVal}`}>{value}</span>
        {unit && <span className="text-xs font-semibold text-slate-500">{unit}</span>}
      </div>

      {subtitle && (
        <div className="text-xs text-slate-500 font-medium">
          {subtitle}
        </div>
      )}
    </div>
  );
};
