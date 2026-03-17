import React from 'react';
import { Expense } from '../types';
import { PLATFORM_NAMES } from '../constants';
import { 
  Calendar, 
  Tag, 
  DollarSign, 
  FileText,
  Truck
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ExpenseDetailsProps {
  expense: Expense;
}

export const ExpenseDetails = ({ expense }: ExpenseDetailsProps) => {
  const categoryLabels: any = {
    fuel: 'Combustível',
    maintenance: 'Manutenção',
    insurance: 'Seguro',
    financing: 'Financiamento',
    cleaning: 'Limpeza',
    toll: 'Pedágio',
    other: 'Outros',
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex flex-col items-center justify-center text-red-500 border border-red-500/20">
          <span className="text-xs font-bold uppercase">{format(new Date(expense.date), 'MMM', { locale: ptBR })}</span>
          <span className="text-2xl font-black leading-none">{format(new Date(expense.date), 'dd')}</span>
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">{expense.description}</h2>
          <p className="text-zinc-500 font-medium">{format(new Date(expense.date), "EEEE, d 'de' MMMM", { locale: ptBR })}</p>
        </div>
      </div>

      {/* Amount Card */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6 flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-red-500/60 uppercase tracking-widest">Valor do Gasto</span>
          <p className="text-3xl font-black text-red-400">R$ {expense.amount.toFixed(2)}</p>
        </div>
        <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-zinc-950 shadow-lg shadow-red-500/20">
          <DollarSign size={24} strokeWidth={3} />
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-zinc-500">
            <Tag size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Categoria</span>
          </div>
          <p className="text-lg font-bold text-white">{categoryLabels[expense.category]}</p>
        </div>
        
        {expense.platform_type && (
          <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-zinc-500">
              <Truck size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Plataforma Relacionada</span>
            </div>
            <p className="text-lg font-bold text-white">{PLATFORM_NAMES[expense.platform_type]}</p>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-4">
        <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.25em] px-1">Descrição Detalhada</h3>
        <div className="bg-zinc-800/30 border border-zinc-800/50 rounded-3xl p-5">
          <div className="flex gap-3">
            <FileText size={18} className="text-zinc-600 shrink-0 mt-0.5" />
            <p className="text-sm text-zinc-400 leading-relaxed italic">"{expense.description}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};
