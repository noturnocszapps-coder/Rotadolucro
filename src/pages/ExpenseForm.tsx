import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ExpenseCategory, PlatformType } from '../types';
import { PLATFORM_NAMES } from '../constants';
import { ArrowLeft, Save, Calendar, DollarSign, Tag, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ExpenseForm = () => {
  const { addExpense, workProfiles } = useAppStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [platformType, setPlatformType] = useState<PlatformType | ''>('');

  const categories: { value: ExpenseCategory; label: string }[] = [
    { value: 'fuel', label: 'Combustível' },
    { value: 'maintenance', label: 'Manutenção' },
    { value: 'insurance', label: 'Seguro' },
    { value: 'financing', label: 'Financiamento' },
    { value: 'cleaning', label: 'Limpeza' },
    { value: 'toll', label: 'Pedágio' },
    { value: 'other', label: 'Outros' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addExpense({
        date,
        category,
        amount: Number(amount),
        description,
        platform_type: platformType ? (platformType as PlatformType) : undefined,
      });
      navigate('/expenses');
    } catch (error) {
      console.error('Error saving expense:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">Novo Gasto</h1>
      </header>

      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <Calendar size={16} /> Data
            </label>
            <input 
              type="date" 
              required 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div className="space-y-4 md:col-span-2">
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <Tag size={16} /> Categoria
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categories.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={cn(
                    "px-3 py-2 rounded-xl text-xs font-bold transition-all border",
                    category === c.value 
                      ? "bg-emerald-500 text-zinc-950 border-emerald-500" 
                      : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600"
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <DollarSign size={16} /> Valor
            </label>
            <input 
              type="number" 
              step="0.01"
              required 
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              placeholder="R$ 0,00"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Plataforma (Opcional)</label>
            <select 
              value={platformType}
              onChange={(e) => setPlatformType(e.target.value as PlatformType)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="">Geral / Todas</option>
              {workProfiles.map((p) => (
                <option key={p.id} value={p.platform_type}>{PLATFORM_NAMES[p.platform_type]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
            <FileText size={16} /> Descrição
          </label>
          <input 
            type="text" 
            required 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            placeholder="Ex: Troca de óleo, Aluguel da moto..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Save size={20} /> Salvar Gasto
            </>
          )}
        </button>
      </form>
    </div>
  );
};
