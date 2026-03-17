import React from 'react';
import { WorkLog } from '../types';
import { PLATFORM_NAMES } from '../constants';
import { 
  Calendar, 
  Clock, 
  Navigation, 
  Package, 
  DollarSign, 
  Truck, 
  FileText,
  TrendingUp
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WorkLogDetailsProps {
  log: WorkLog;
}

export const WorkLogDetails = ({ log }: WorkLogDetailsProps) => {
  const totalEarnings = log.gross_amount + (log.bonus_amount || 0);

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex flex-col items-center justify-center text-emerald-400 border border-emerald-500/20">
          <span className="text-xs font-bold uppercase">{format(parseISO(log.date), 'MMM', { locale: ptBR })}</span>
          <span className="text-2xl font-black leading-none">{format(parseISO(log.date), 'dd')}</span>
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">{PLATFORM_NAMES[log.platform_type]}</h2>
          <p className="text-zinc-500 font-medium">{format(parseISO(log.date), "EEEE, d 'de' MMMM", { locale: ptBR })}</p>
        </div>
      </div>

      {/* Earnings Card */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">Ganhos Totais</span>
          <p className="text-3xl font-black text-emerald-400">R$ {totalEarnings.toFixed(2)}</p>
        </div>
        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-zinc-950 shadow-lg shadow-emerald-500/20">
          <DollarSign size={24} strokeWidth={3} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-zinc-500">
            <Clock size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Tempo</span>
          </div>
          <p className="text-lg font-bold text-white">{log.hours_worked}h</p>
        </div>
        <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-zinc-500">
            <Navigation size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Distância</span>
          </div>
          <p className="text-lg font-bold text-white">{log.km_driven}km</p>
        </div>
        {log.packages_count !== undefined && (
          <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-zinc-500">
              <Package size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Pacotes</span>
            </div>
            <p className="text-lg font-bold text-white">{log.packages_count}</p>
          </div>
        )}
        {log.routes_count !== undefined && (
          <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-zinc-500">
              <TrendingUp size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Rotas</span>
            </div>
            <p className="text-lg font-bold text-white">{log.routes_count}</p>
          </div>
        )}
      </div>

      {/* Additional Details */}
      <div className="space-y-4">
        <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.25em] px-1">Detalhes Adicionais</h3>
        <div className="bg-zinc-800/30 border border-zinc-800/50 rounded-3xl divide-y divide-zinc-800/50">
          <div className="p-4 flex items-center justify-between">
            <span className="text-sm text-zinc-400">Ganhos Brutos</span>
            <span className="text-sm font-bold text-white">R$ {log.gross_amount.toFixed(2)}</span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <span className="text-sm text-zinc-400">Bônus/Extras</span>
            <span className="text-sm font-bold text-emerald-400">+ R$ {(log.bonus_amount || 0).toFixed(2)}</span>
          </div>
          {log.vehicle_type && (
            <div className="p-4 flex items-center justify-between">
              <span className="text-sm text-zinc-400">Veículo</span>
              <span className="text-sm font-bold text-white">{log.vehicle_type}</span>
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {log.notes && (
        <div className="space-y-4">
          <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.25em] px-1">Observações</h3>
          <div className="bg-zinc-800/30 border border-zinc-800/50 rounded-3xl p-5">
            <div className="flex gap-3">
              <FileText size={18} className="text-zinc-600 shrink-0 mt-0.5" />
              <p className="text-sm text-zinc-400 leading-relaxed italic">"{log.notes}"</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
