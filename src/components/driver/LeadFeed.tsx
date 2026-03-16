'use client';

import React, { useState } from 'react';
import { LeadCard } from './LeadCard';
import { Search, Filter, SlidersHorizontal, RefreshCcw } from 'lucide-react';

interface LeadFeedProps {
  initialLeads: any[];
}

export const LeadFeed: React.FC<LeadFeedProps> = ({ initialLeads }) => {
  const [leads, setLeads] = useState(initialLeads);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const handleConnect = async (id: string) => {
    setIsConnecting(id);
    try {
      // This would call the server action connectToRequest
      console.log('Connecting to lead:', id);
      // For demo/MVP UI logic, we just simulate
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setIsConnecting(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Filters */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Oportunidades</h2>
          <p className="text-neutral-500">Encontre passageiros precisando de transporte para eventos.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Buscar evento..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm transition-all"
            />
          </div>
          <button className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors">
            <SlidersHorizontal className="w-5 h-5 text-neutral-600" />
          </button>
        </div>
      </header>

      {/* Leads Grid */}
      {leads.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {leads.map((lead) => (
            <LeadCard 
              key={lead.id} 
              lead={lead} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-neutral-50 rounded-[32px] border border-dashed border-neutral-200">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <RefreshCcw className="w-8 h-8 text-neutral-300" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900">Nenhuma solicitação aberta</h3>
          <p className="text-neutral-500 max-w-xs mx-auto text-sm">
            Fique de olho! Novas solicitações aparecem aqui assim que os passageiros publicarem.
          </p>
        </div>
      )}

      {/* Future: Pagination / Load More */}
      {leads.length > 0 && (
        <div className="flex justify-center pt-8">
          <button className="text-sm font-bold text-neutral-400 hover:text-neutral-900 transition-colors flex items-center gap-2">
            Carregar mais oportunidades <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
