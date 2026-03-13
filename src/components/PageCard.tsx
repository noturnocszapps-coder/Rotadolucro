import React from 'react';

interface PageCardProps {
  children: React.ReactNode;
  className?: string;
}

export const PageCard: React.FC<PageCardProps> = ({ children, className }) => {
  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
};
