import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Plus, Receipt, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PlatformType } from '../types';
import { PLATFORM_NAMES } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { PageCard } from '../components/PageCard';
import { StatCard } from '../components/StatCard';

export const Expenses = () => {
  const { expenses, workProfiles } = useAppStore();
  const [platformFilter, setPlatformFilter] = useState<PlatformType | 'all'>('all');
  const [dateFilter, setDateFilter] = useState(format(new Date(), 'yyyy-MM'));

  const categoryLabels: any = {
    fuel: 'Combustível',
    maintenance: 'Manutenção',
    insurance: 'Seguro',
    financing: 'Financiamento',
    cleaning: 'Limpeza',
    toll: 'Pedágio',
    other: 'Outros',
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const matchesPlatform = platformFilter === 'all' || exp.platform_type === platformFilter;
      const matchesDate = exp.date.startsWith(dateFilter);
      return matchesPlatform && matchesDate;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, platformFilter, dateFilter]);

  const stats = useMemo(() => {
    const total = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    const byCategory = filteredExpenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as any);
    return { total, byCategory };
  }, [filteredExpenses]);

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Controle de Gastos</h2>
          <p className="text-zinc-400 text-sm">Gerencie suas despesas operacionais.</p>
        </div>
        <Link to="/expenses/new" className="bg-emerald-500 text-zinc-950 p-3 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
          <Plus size={24} />
        </Link>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard 
          label="Total no Período" 
          value={`R$ ${stats.total.toFixed(2)}`} 
          color="red"
          icon={<Receipt size={18} />}
        />
        <StatCard 
          label="Maior Categoria" 
          value={Object.entries(stats.byCategory).sort((a: any, b: any) => b[1] - a[1])[0] 
            ? categoryLabels[Object.entries(stats.byCategory).sort((a: any, b: any) => b[1] - a[1])[0][0]]
            : 'Nenhum'} 
          color="zinc"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setPlatformFilter('all')}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border",
              platformFilter === 'all' 
                ? "bg-emerald-500 text-zinc-950 border-emerald-500" 
                : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
            )}
          >
            Todos
          </button>
          {workProfiles.map(p => (
            <button 
              key={p.id}
              onClick={() => setPlatformFilter(p.platform_type)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border",
                platformFilter === p.platform_type 
                  ? "bg-emerald-500 text-zinc-950 border-emerald-500" 
                  : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
              )}
            >
              {PLATFORM_NAMES[p.platform_type]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2">
          <Calendar size={18} className="text-zinc-500" />
          <input 
            type="month" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-transparent text-sm font-bold text-zinc-100 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredExpenses.length === 0 ? (
          <PageCard className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto text-zinc-500">
              <Receipt size={32} />
            </div>
            <p className="text-zinc-400">Nenhum gasto encontrado para este filtro.</p>
          </PageCard>
        ) : (
          filteredExpenses.map((exp) => (
            <PageCard key={exp.id} className="flex items-center justify-between gap-4 hover:border-zinc-700 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex flex-col items-center justify-center text-red-500">
                  <span className="text-[10px] font-bold uppercase">{format(new Date(exp.date), 'MMM', { locale: ptBR })}</span>
                  <span className="text-lg font-bold leading-none">{format(new Date(exp.date), 'dd')}</span>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-100">{exp.description}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{categoryLabels[exp.category]}</p>
                    {exp.platform_type && (
                      <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-bold">
                        {PLATFORM_NAMES[exp.platform_type]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-red-400 font-bold">- R$ {exp.amount.toFixed(2)}</p>
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
