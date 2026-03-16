import React from 'react';
import { ACTIVE_PLATFORMS } from '@/constants/platforms';

interface PlatformTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const PlatformTabs: React.FC<PlatformTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
      {ACTIVE_PLATFORMS.map((platform) => (
        <button
          key={platform}
          onClick={() => onTabChange(platform)}
          className={`whitespace-nowrap px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === platform
              ? 'bg-primary text-white shadow-lg shadow-primary/20'
              : 'bg-white/5 text-neutral-500 hover:bg-white/10 hover:text-neutral-300'
          }`}
        >
          {platform}
        </button>
      ))}
    </div>
  );
};
