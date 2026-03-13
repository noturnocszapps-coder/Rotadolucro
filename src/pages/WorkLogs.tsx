import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { PLATFORM_NAMES } from '../constants';
import { Plus, Calendar, Package, Navigation, Clock, DollarSign, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const WorkLogs = () => {
  const { workLogs } = useAppStore();

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registros</h1>
          <p className="text-zinc-400">Histórico de turnos e rotas.</p>
        </div>
        <Link to="/work-logs/new" className="bg-emerald-500 text-zinc-950 p-3 rounded-2xl font-bold hover:bg-emerald-600 transition-all">
          <Plus size={24} />
        </Link>
      </header>

      <div className="space-y-4">
        {workLogs.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 p-12 rounded-3xl text-center space-y-4">
            <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto text-zinc-500">
              <Calendar size={32} />
            </div>
            <p className="text-zinc-400">Nenhum registro encontrado.</p>
            <Link to="/work-logs/new" className="text-emerald-500 font-bold hover:underline">Adicionar primeiro registro</Link>
          </div>
        ) : (
          workLogs.map((log) => (
            <div key={log.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex items-center justify-between gap-4 hover:border-zinc-700 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex flex-col items-center justify-center text-emerald-500">
                  <span className="text-[10px] font-bold uppercase">{format(new Date(log.date), 'MMM', { locale: ptBR })}</span>
                  <span className="text-lg font-bold leading-none">{format(new Date(log.date), 'dd')}</span>
                </div>
                <div>
                  <h3 className="font-bold">{PLATFORM_NAMES[log.platform_type]}</h3>
                  <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">
                    <span className="flex items-center gap-1"><Clock size={12} /> {log.hours_worked}h</span>
                    <span className="flex items-center gap-1"><Navigation size={12} /> {log.km_driven}km</span>
                    {log.deliveries_count > 0 && <span className="flex items-center gap-1"><Package size={12} /> {log.deliveries_count}</span>}
                    {log.packages_count > 0 && <span className="flex items-center gap-1"><Package size={12} /> {log.packages_count}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-emerald-500 font-bold">R$ {(log.gross_amount + (log.bonus_amount || 0)).toFixed(2)}</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Ganhos</p>
                </div>
                <ChevronRight size={20} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
