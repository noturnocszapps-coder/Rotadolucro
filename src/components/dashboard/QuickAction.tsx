import React from 'react';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface QuickActionProps {
  label: string;
  icon: LucideIcon;
  href: string;
  color?: string;
}

export const QuickAction: React.FC<QuickActionProps> = ({ label, icon: Icon, href, color = 'text-primary' }) => {
  return (
    <Link href={href} className="group flex flex-col items-center gap-3 p-6 glass rounded-[32px] hover:border-primary/30 transition-all active:scale-95">
      <div className={`p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] ${color} group-hover:bg-primary/10 transition-all`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors">{label}</span>
    </Link>
  );
};
