import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  helperText?: string;
  color?: 'emerald' | 'zinc' | 'red' | 'blue' | 'amber';
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, helperText, color = 'emerald', icon }) => {
  const colorClasses = {
    emerald: 'text-emerald-400',
    zinc: 'text-zinc-100',
    red: 'text-red-400',
    blue: 'text-blue-400',
    amber: 'text-amber-400',
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-1">
      <div className="flex justify-between items-start">
        <span className="text-zinc-400 text-sm font-medium uppercase tracking-wider">{label}</span>
        {icon && <div className="text-zinc-500">{icon}</div>}
      </div>
      <h3 className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</h3>
      {helperText && <p className="text-zinc-500 text-xs mt-1">{helperText}</p>}
    </div>
  );
};
