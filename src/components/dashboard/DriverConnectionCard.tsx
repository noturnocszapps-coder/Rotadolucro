'use client';

import React from 'react';
import { MessageSquare, MapPin, Calendar, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants';

interface Connection {
  id: string;
  created_at: string;
  passenger: {
    full_name: string;
  };
  request: {
    status: string;
    description: any;
  };
}

export const DriverConnectionCard: React.FC<{ connection: Connection }> = ({ connection }) => {
  const desc = connection.request.description || {};
  const isRequestOpen = connection.request.status === 'open';

  return (
    <div className="glass-card group hover:border-roxou/30 transition-all duration-500">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/[0.03] rounded-2xl flex items-center justify-center text-neutral-500 border border-white/5 group-hover:border-roxou/20 transition-all duration-500 group-hover:bg-roxou/10">
              <User className="w-6 h-6 group-hover:text-roxou transition-colors" />
            </div>
            <div>
              <h3 className="font-black text-white uppercase tracking-tight text-sm font-display">{connection.passenger.full_name}</h3>
              <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-black">Passageiro</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] border ${
            isRequestOpen ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' : 'bg-white/5 text-neutral-500 border-white/5'
          }`}>
            {isRequestOpen ? 'Ativo' : 'Finalizado'}
          </span>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-bold bg-white/[0.02] p-3 rounded-xl border border-white/5 group-hover:border-roxou/10 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-roxou" />
            <span className="truncate">{desc.origin} → {desc.destination}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-bold bg-white/[0.02] p-3 rounded-xl border border-white/5 group-hover:border-roxou/10 transition-colors">
            <Calendar className="w-3.5 h-3.5 text-roxou" />
            <span>{desc.departureDate} • {desc.departureTime}</span>
          </div>
        </div>

        <Link 
          href={ROUTES.CHAT(connection.id)}
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-black rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-roxou hover:text-white transition-all shadow-lg active:scale-95 group/btn"
        >
          <MessageSquare className="w-4 h-4" />
          Abrir Chat
          <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all" />
        </Link>
      </div>
    </div>
  );
};
