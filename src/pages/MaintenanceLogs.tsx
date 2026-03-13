import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Plus, Wrench, Calendar, ChevronRight, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { PageCard } from '../components/PageCard';

export const MaintenanceLogs = () => {
  const { maintenanceLogs } = useAppStore();

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Manutenção</h2>
          <p className="text-zinc-400 text-sm">Histórico de reparos e revisões.</p>
        </div>
        <Link to="/maintenance/new" className="bg-emerald-500 text-zinc-950 p-3 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
          <Plus size={24} />
        </Link>
      </header>

      <div className="space-y-4">
        {maintenanceLogs.length === 0 ? (
          <PageCard className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto text-zinc-500">
              <Wrench size={32} />
            </div>
            <p className="text-zinc-400">Nenhuma manutenção registrada.</p>
            <Link to="/maintenance/new" className="text-emerald-400 font-bold hover:underline inline-block">Registrar manutenção</Link>
          </PageCard>
        ) : (
          maintenanceLogs.map((log) => (
            <PageCard key={log.id} className="flex items-center justify-between gap-4 hover:border-zinc-700 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex flex-col items-center justify-center text-amber-500">
                  <span className="text-[10px] font-bold uppercase">{format(new Date(log.date), 'MMM', { locale: ptBR })}</span>
                  <span className="text-lg font-bold leading-none">{format(new Date(log.date), 'dd')}</span>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-100">{log.description}</h3>
                  <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">
                    <span className="flex items-center gap-1"><Wrench size={12} /> {log.type}</span>
                    <span className="flex items-center gap-1"><Navigation size={12} /> {log.odometer_km}km</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-zinc-100 font-bold">R$ {log.amount.toFixed(2)}</p>
                </div>
                <ChevronRight size={20} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
              </div>
            </PageCard>
          ))
        )}
      </div>
    </div>
  );
};
