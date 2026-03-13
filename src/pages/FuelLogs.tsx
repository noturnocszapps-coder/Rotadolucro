import React, { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Plus, Fuel, Calendar, ChevronRight, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const FuelLogs = () => {
  const { fuelLogs } = useAppStore();

  const stats = useMemo(() => {
    if (fuelLogs.length < 2) return { avgConsumption: 0, avgCostPerKm: 0 };

    const sortedLogs = [...fuelLogs].sort((a, b) => a.odometer_km - b.odometer_km);
    const totalKm = sortedLogs[sortedLogs.length - 1].odometer_km - sortedLogs[0].odometer_km;
    const totalLiters = sortedLogs.slice(1).reduce((acc, curr) => acc + curr.liters, 0);
    const totalCost = sortedLogs.slice(1).reduce((acc, curr) => acc + curr.total_value, 0);

    return {
      avgConsumption: totalKm > 0 ? totalKm / totalLiters : 0,
      avgCostPerKm: totalKm > 0 ? totalCost / totalKm : 0
    };
  }, [fuelLogs]);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 pb-24">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Combustível</h1>
          <p className="text-zinc-400">Histórico de abastecimentos.</p>
        </div>
        <Link to="/fuel/new" className="bg-emerald-500 text-zinc-950 p-3 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
          <Plus size={24} />
        </Link>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-1">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Consumo Médio</p>
          <p className="text-3xl font-bold text-blue-500">{stats.avgConsumption.toFixed(2)} <span className="text-sm font-normal text-zinc-500">KM/L</span></p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-1">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Custo Médio por KM</p>
          <p className="text-3xl font-bold text-emerald-500">R$ {stats.avgCostPerKm.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-4">
        {fuelLogs.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 p-12 rounded-3xl text-center space-y-4">
            <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto text-zinc-500">
              <Fuel size={32} />
            </div>
            <p className="text-zinc-400">Nenhum abastecimento registrado.</p>
            <Link to="/fuel/new" className="text-emerald-500 font-bold hover:underline">Registrar abastecimento</Link>
          </div>
        ) : (
          [...fuelLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((log) => (
            <div key={log.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex items-center justify-between gap-4 hover:border-zinc-700 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex flex-col items-center justify-center text-blue-500">
                  <span className="text-[10px] font-bold uppercase">{format(new Date(log.date), 'MMM', { locale: ptBR })}</span>
                  <span className="text-lg font-bold leading-none">{format(new Date(log.date), 'dd')}</span>
                </div>
                <div>
                  <h3 className="font-bold">{log.liters} Litros</h3>
                  <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">
                    <span className="flex items-center gap-1"><Navigation size={12} /> {log.odometer_km}km</span>
                    <span className="flex items-center gap-1">R$ {log.price_per_liter.toFixed(3)}/L</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-zinc-100 font-bold">R$ {log.total_value.toFixed(2)}</p>
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
