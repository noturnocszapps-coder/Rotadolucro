import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { PlatformType } from '../types';
import { PLATFORM_NAMES } from '../constants';
import { ArrowLeft, Save, Calendar, DollarSign, Wrench, Navigation, FileText } from 'lucide-react';
import { format } from 'date-fns';

export const MaintenanceForm = () => {
  const { addMaintenanceLog, workProfiles } = useAppStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [type, setType] = useState('Preventiva');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [odometerKm, setOdometerKm] = useState<number>(0);
  const [platformType, setPlatformType] = useState<PlatformType | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addMaintenanceLog({
        date,
        type,
        description,
        amount: Number(amount),
        odometer_km: Number(odometerKm),
        platform_type: platformType ? (platformType as PlatformType) : undefined,
      });
      navigate('/maintenance');
    } catch (error) {
      console.error('Error saving maintenance log:', error);
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
        <h1 className="text-2xl font-bold tracking-tight">Nova Manutenção</h1>
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <Wrench size={16} /> Tipo
            </label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="Preventiva">Preventiva</option>
              <option value="Corretiva">Corretiva</option>
              <option value="Estética">Estética / Limpeza</option>
              <option value="Outros">Outros</option>
            </select>
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
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <Navigation size={16} /> Odômetro (KM)
            </label>
            <input 
              type="number" 
              required 
              value={odometerKm || ''}
              onChange={(e) => setOdometerKm(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              placeholder="Ex: 45000"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
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
          <textarea 
            required 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 h-24 resize-none"
            placeholder="Ex: Troca de pneus, pastilhas de freio..."
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
              <Save size={20} /> Salvar Manutenção
            </>
          )}
        </button>
      </form>
    </div>
  );
};
