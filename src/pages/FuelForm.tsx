import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { PlatformType } from '../types';
import { PLATFORM_NAMES } from '../constants';
import { ArrowLeft, Save, Calendar, DollarSign, Fuel, Navigation } from 'lucide-react';
import { format } from 'date-fns';

export const FuelForm = () => {
  const { addFuelLog, workProfiles, vehicleSettings } = useAppStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [liters, setLiters] = useState<number>(0);
  const [pricePerLiter, setPricePerLiter] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [odometerKm, setOdometerKm] = useState<number>(0);
  const [platformType, setPlatformType] = useState<PlatformType | ''>('');

  const handleTotalChange = (val: number) => {
    setTotalValue(val);
    if (pricePerLiter > 0) {
      setLiters(Number((val / pricePerLiter).toFixed(2)));
    }
  };

  const handlePriceChange = (val: number) => {
    setPricePerLiter(val);
    if (val > 0 && totalValue > 0) {
      setLiters(Number((totalValue / val).toFixed(2)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addFuelLog({
        date,
        liters: Number(liters),
        price_per_liter: Number(pricePerLiter),
        total_value: Number(totalValue),
        odometer_km: Number(odometerKm),
        vehicle_type: vehicleSettings?.vehicle_model || 'Padrão',
        platform_type: platformType ? (platformType as PlatformType) : undefined,
      });
      navigate('/fuel');
    } catch (error) {
      console.error('Error saving fuel log:', error);
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
        <h1 className="text-2xl font-bold tracking-tight">Novo Abastecimento</h1>
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <DollarSign size={16} /> Valor Total
            </label>
            <input 
              type="number" 
              step="0.01"
              required 
              value={totalValue || ''}
              onChange={(e) => handleTotalChange(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              placeholder="R$ 0,00"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <Fuel size={16} /> Preço por Litro
            </label>
            <input 
              type="number" 
              step="0.001"
              required 
              value={pricePerLiter || ''}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              placeholder="R$ 0,000"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Litros (Auto)</label>
            <input 
              type="number" 
              readOnly
              value={liters || ''}
              className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-3 text-emerald-500 font-bold focus:outline-none"
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

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Save size={20} /> Salvar Abastecimento
            </>
          )}
        </button>
      </form>
    </div>
  );
};
