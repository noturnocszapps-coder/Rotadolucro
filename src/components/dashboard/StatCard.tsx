import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, icon: Icon, color = 'text-primary' }) => {
  return (
    <div className="glass-card p-6 flex flex-col gap-4 group hover:border-primary/20 transition-all">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1">{label}</p>
        <h3 className="text-2xl font-black tracking-tight text-white">{value}</h3>
        {subValue && <p className="text-xs font-medium text-neutral-500 mt-1">{subValue}</p>}
      </div>
    </div>
  );
};
