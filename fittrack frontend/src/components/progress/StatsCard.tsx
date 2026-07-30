import React, { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend
}) => {
  return (
    <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-lg flex items-start justify-between">
      <div>
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
          {title}
        </span>
        <div className="text-2xl md:text-3xl font-black text-white tracking-tight mb-1">
          {value}
        </div>
        {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
        {trend && (
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md inline-block mt-2">
            {trend}
          </span>
        )}
      </div>
      <div className="p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 text-orange-400">
        {icon}
      </div>
    </div>
  );
};
