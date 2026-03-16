'use client';

import React, { useState } from 'react';
import { MessageSquare, CheckCircle2, XCircle, Clock, Users, MapPin, Calendar, Car } from 'lucide-react';
import { updateRequestStatus } from '@/actions/connections';
import Link from 'next/link';
import { ROUTES } from '@/constants';
import { motion } from 'motion/react';

interface Connection {
  id: string;
  driver: {
    full_name: string;
  };
  created_at: string;
}

interface Request {
  id: string;
  status: 'open' | 'filled' | 'cancelled';
  description: any;
  created_at: string;
  connections: Connection[];
}

export const PassengerRequestCard: React.FC<{ request: Request }> = ({ request }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const desc = request.description || {};

  const handleStatusUpdate = async (newStatus: 'filled' | 'cancelled') => {
    if (!confirm(`Tem certeza que deseja marcar como ${newStatus === 'filled' ? 'preenchido' : 'cancelado'}?`)) return;
    setIsUpdating(true);
    try {
      await updateRequestStatus(request.id, newStatus);
    } catch (error) {
      alert('Erro ao atualizar status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="glass-card overflow-hidden relative group hover:border-roxou/30 transition-all duration-500">
      <div className="p-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
                request.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                request.status === 'filled' ? 'bg-roxou/10 text-roxou-light border-roxou/20' :
                'bg-neutral-800 text-neutral-500 border-white/5'
              }`}>
                {request.status === 'open' ? 'Disponível' : request.status === 'filled' ? 'Confirmado' : 'Cancelado'}
              </span>
              <span className="text-[10px] text-neutral-600 font-black uppercase tracking-widest">
                {new Date(request.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter font-display">{desc.eventName || 'Solicitação de Transporte'}</h3>
          </div>

          {request.status === 'open' && (
            <div className="flex gap-4">
              <button 
                onClick={() => handleStatusUpdate('filled')}
                disabled={isUpdating}
                className="p-4 text-roxou-light hover:bg-roxou/10 rounded-[20px] transition-all border border-transparent hover:border-roxou/20 shadow-lg"
                title="Marcar como preenchido"
              >
                <CheckCircle2 className="w-7 h-7" />
              </button>
              <button 
                onClick={() => handleStatusUpdate('cancelled')}
                disabled={isUpdating}
                className="p-4 text-rose-500 hover:bg-rose-500/10 rounded-[20px] transition-all border border-transparent hover:border-rose-500/20 shadow-lg"
                title="Cancelar solicitação"
              >
                <XCircle className="w-7 h-7" />
              </button>
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <div className="flex items-center gap-5 text-base text-neutral-300 font-medium bg-white/[0.02] p-6 rounded-[24px] border border-white/5">
            <div className="w-10 h-10 bg-roxou/10 rounded-xl flex items-center justify-center text-roxou">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="truncate">{desc.origin} <span className="text-roxou mx-2">→</span> {desc.destination}</span>
          </div>
          <div className="flex items-center gap-5 text-base text-neutral-300 font-medium bg-white/[0.02] p-6 rounded-[24px] border border-white/5">
            <div className="w-10 h-10 bg-roxou/10 rounded-xl flex items-center justify-center text-roxou">
              <Calendar className="w-5 h-5" />
            </div>
            <span>{desc.departureDate} <span className="text-neutral-600 mx-2">|</span> {desc.departureTime}</span>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-roxou" />
              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Candidatos Premium ({request.connections.length})</h4>
            </div>
            {request.connections.length > 0 && (
              <div className="flex -space-x-3">
                {request.connections.slice(0, 3).map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-bg bg-neutral-800 flex items-center justify-center text-[8px] font-black">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                {request.connections.length > 3 && (
                  <div className="w-8 h-8 rounded-full border-2 border-bg bg-roxou flex items-center justify-center text-[8px] font-black">
                    +{request.connections.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>

          {request.connections.length === 0 ? (
            <div className="py-14 text-center bg-white/[0.01] rounded-[32px] border border-dashed border-white/5">
              <Clock className="w-12 h-12 text-neutral-800 mx-auto mb-4 animate-pulse" />
              <p className="text-[10px] text-neutral-600 uppercase tracking-[0.3em] font-black">Rastreando motoristas disponíveis...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {request.connections.map((conn) => (
                <div key={conn.id} className="flex items-center justify-between p-6 bg-white/[0.02] rounded-[28px] hover:bg-white/[0.05] transition-all border border-white/5 group/item">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-neutral-900 rounded-[20px] flex items-center justify-center text-neutral-600 border border-white/5 group-hover/item:border-roxou/30 group-hover/item:text-roxou transition-all">
                      <Car className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-white uppercase tracking-tight font-display">{conn.driver.full_name}</p>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-black">Disponível para Chat</p>
                      </div>
                    </div>
                  </div>
                  <Link 
                    href={ROUTES.CHAT(conn.id)}
                    className="flex items-center gap-4 px-8 py-4 bg-white text-black rounded-[20px] text-[11px] font-black uppercase tracking-widest hover:roxou-gradient hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Abrir Chat
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
