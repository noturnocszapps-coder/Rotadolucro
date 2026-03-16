'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  Calendar, 
  MessageSquare, 
  User,
  ArrowRight,
  Repeat,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { connectToRequest } from '@/actions/connections';

interface LeadCardProps {
  lead: any;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Handle description being either a string or an object
  const details = typeof lead.description === 'string' 
    ? JSON.parse(lead.description) 
    : lead.description || {};

  const eventDate = lead.event_date ? new Date(lead.event_date) : null;

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectToRequest(lead.id);
    } catch (error: any) {
      alert(error.message || 'Erro ao conectar');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card group hover:border-roxou/30 transition-all duration-500"
    >
      <div className="p-6">
        {/* Event Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-1.5">
            {eventDate && (
              <div className="flex items-center gap-2 text-roxou text-[9px] font-black uppercase tracking-[0.2em]">
                <Calendar className="w-3.5 h-3.5" /> {eventDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              </div>
            )}
            <h3 className="text-xl font-black text-white uppercase tracking-tight font-display group-hover:text-roxou transition-colors">
              {lead.event_name || details.eventName || 'Solicitação'}
            </h3>
            <p className="text-[10px] text-neutral-500 flex items-center gap-2 font-black uppercase tracking-widest">
              <MapPin className="w-3.5 h-3.5 text-roxou/50" /> {lead.event_location || details.destination}
            </p>
          </div>
          <div className="w-12 h-12 bg-white/[0.03] rounded-2xl flex items-center justify-center text-neutral-500 group-hover:bg-roxou/10 group-hover:text-roxou transition-all border border-white/5 group-hover:border-roxou/20">
            <User className="w-6 h-6" />
          </div>
        </div>

        {/* Route Details */}
        <div className="bg-white/[0.02] rounded-2xl p-5 mb-6 space-y-3 border border-white/5 group-hover:border-roxou/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-roxou shadow-[0_0_8px_rgba(124,58,237,0.4)]" />
            <div className="flex-1 text-[11px] font-bold text-neutral-400 truncate">
              {details.origin || 'Origem não informada'}
            </div>
          </div>
          <div className="ml-1 w-px h-4 bg-white/5" />
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-neutral-700" />
            <div className="flex-1 text-[11px] font-bold text-neutral-400 truncate">
              {details.destination || 'Destino não informado'}
            </div>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-neutral-400 bg-white/[0.03] border border-white/5 px-3 py-1.5 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-roxou" /> {details.departureTime || details.departure_time || '--:--'}
          </div>
          {details.hasReturn && (
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 rounded-xl">
              <Repeat className="w-3.5 h-3.5" /> Com Volta
            </div>
          )}
        </div>

        {/* Action */}
        <button 
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full bg-white text-black py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-roxou hover:text-white transition-all shadow-lg disabled:opacity-50 active:scale-95 group/btn"
        >
          {isConnecting ? 'Conectando...' : 'Demonstrar Interesse'} 
          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/btn:translate-x-0 group-hover/btn:opacity-100 transition-all" />
        </button>
      </div>

      {/* Notes Preview */}
      {details.notes && (
        <div className="px-6 py-3 bg-roxou/5 border-t border-white/5 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-roxou/60 mt-0.5" />
          <p className="text-[10px] text-neutral-500 font-medium italic line-clamp-1">
            "{details.notes}"
          </p>
        </div>
      )}
    </motion.div>
  );
};
