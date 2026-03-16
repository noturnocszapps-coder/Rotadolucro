import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageCard } from '../components/PageCard';
import { 
  ArrowLeft, 
  Truck, 
  Navigation, 
  Clock, 
  Package, 
  DollarSign, 
  Fuel, 
  MapPin,
  Plus,
  TrendingUp,
  Calculator,
  Info
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const FreightCalculator = () => {
  const navigate = useNavigate();
  const { vehicleSettings } = useAppStore();

  const [input, setInput] = useState({
    distanceKm: 0,
    packagesCount: 0,
    estimatedHours: 0,
    fuelPrice: 5.50,
    consumption: vehicleSettings?.average_consumption || 10,
    tolls: 0,
    extraCosts: 0,
    desiredProfit: 100,
    costPerKm: 0.50,
    costPerHour: 20,
  });

  const results = useMemo(() => {
    const fuelCost = (input.distanceKm / input.consumption) * input.fuelPrice;
    const maintenanceCost = input.distanceKm * input.costPerKm;
    const timeCost = input.estimatedHours * input.costPerHour;
    
    const totalRouteCost = fuelCost + maintenanceCost + timeCost + input.tolls + input.extraCosts;
    const minFreightValue = totalRouteCost;
    const recommendedFreight = totalRouteCost + input.desiredProfit;
    
    const estimatedNetProfit = recommendedFreight - totalRouteCost;
    const profitPerKm = input.distanceKm > 0 ? estimatedNetProfit / input.distanceKm : 0;
    const profitPerHour = input.estimatedHours > 0 ? estimatedNetProfit / input.estimatedHours : 0;

    return {
      totalRouteCost,
      minFreightValue,
      recommendedFreight,
      estimatedNetProfit,
      profitPerKm,
      profitPerHour,
      fuelCost
    };
  }, [input]);

  return (
    <div className="space-y-8 pb-24">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-zinc-100 tracking-tight">Calcular Frete</h2>
          <p className="text-zinc-500 text-sm font-medium">Calcule o valor ideal para suas rotas autônomas.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6">
          <PageCard className="p-8 space-y-6 rounded-[2.5rem] bg-zinc-900/40 border-zinc-800/50">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Dados da Rota</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Navigation size={12} /> Distância (KM)
                  </label>
                  <input 
                    type="number" 
                    value={input.distanceKm || ''}
                    onChange={(e) => setInput(prev => ({ ...prev, distanceKm: Number(e.target.value) }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={12} /> Tempo (Horas)
                  </label>
                  <input 
                    type="number" 
                    value={input.estimatedHours || ''}
                    onChange={(e) => setInput(prev => ({ ...prev, estimatedHours: Number(e.target.value) }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Package size={12} /> Pacotes
                  </label>
                  <input 
                    type="number" 
                    value={input.packagesCount || ''}
                    onChange={(e) => setInput(prev => ({ ...prev, packagesCount: Number(e.target.value) }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <DollarSign size={12} /> Lucro Desejado
                  </label>
                  <input 
                    type="number" 
                    value={input.desiredProfit || ''}
                    onChange={(e) => setInput(prev => ({ ...prev, desiredProfit: Number(e.target.value) }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-zinc-800/50">
              <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Custos Operacionais</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Fuel size={12} /> Preço Combustível
                  </label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={input.fuelPrice || ''}
                    onChange={(e) => setInput(prev => ({ ...prev, fuelPrice: Number(e.target.value) }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={12} /> Pedágios
                  </label>
                  <input 
                    type="number" 
                    value={input.tolls || ''}
                    onChange={(e) => setInput(prev => ({ ...prev, tolls: Number(e.target.value) }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Plus size={12} /> Custos Extras
                  </label>
                  <input 
                    type="number" 
                    value={input.extraCosts || ''}
                    onChange={(e) => setInput(prev => ({ ...prev, extraCosts: Number(e.target.value) }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Calculator size={12} /> Custo por KM
                  </label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={input.costPerKm || ''}
                    onChange={(e) => setInput(prev => ({ ...prev, costPerKm: Number(e.target.value) }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold"
                  />
                </div>
              </div>
            </div>
          </PageCard>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-emerald-500 border-2 border-emerald-400 shadow-2xl shadow-emerald-500/20 flex flex-col items-center text-center space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Truck size={120} className="text-zinc-950" />
            </div>
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-950/60">Valor Recomendado do Frete</span>
              <h3 className="text-5xl font-black text-zinc-950 tracking-tighter">R$ {results.recommendedFreight.toFixed(2)}</h3>
            </div>
            <div className="w-full h-px bg-zinc-950/10 relative z-10"></div>
            <div className="grid grid-cols-2 w-full gap-4 relative z-10">
              <div className="text-left">
                <span className="text-[10px] uppercase font-black text-zinc-950/60">Valor Mínimo</span>
                <p className="text-xl font-black text-zinc-950">R$ {results.minFreightValue.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-black text-zinc-950/60">Lucro Estimado</span>
                <p className="text-xl font-black text-zinc-950">R$ {results.estimatedNetProfit.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800/50 p-6 rounded-[2rem] shadow-xl">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Custo Total</p>
              <h4 className="text-2xl font-black text-zinc-100">R$ {results.totalRouteCost.toFixed(2)}</h4>
            </div>
            <div className="bg-zinc-900 border border-zinc-800/50 p-6 rounded-[2rem] shadow-xl">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Margem</p>
              <h4 className="text-2xl font-black text-emerald-500">
                {results.recommendedFreight > 0 ? ((results.estimatedNetProfit / results.recommendedFreight) * 100).toFixed(1) : 0}%
              </h4>
            </div>
          </div>

          <PageCard className="p-8 space-y-6 rounded-[2.5rem] bg-zinc-900/40 border-zinc-800/50">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Métricas de Lucro</h3>
              <Info size={16} className="text-zinc-600" />
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center p-5 bg-zinc-950/50 rounded-2xl border border-zinc-800/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500">
                    <Navigation size={18} />
                  </div>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Lucro por KM</span>
                </div>
                <span className="text-lg font-black text-zinc-100">R$ {results.profitPerKm.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center p-5 bg-zinc-950/50 rounded-2xl border border-zinc-800/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500">
                    <Clock size={18} />
                  </div>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Lucro por Hora</span>
                </div>
                <span className="text-lg font-black text-zinc-100">R$ {results.profitPerHour.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800/50 space-y-4">
              <div className="flex justify-between text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                <span>Composição do Custo</span>
                <span>R$ {results.totalRouteCost.toFixed(2)}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 font-medium">Combustível</span>
                  <span className="text-zinc-300 font-bold">R$ {results.fuelCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 font-medium">Manutenção (KM)</span>
                  <span className="text-zinc-300 font-bold">R$ {(input.distanceKm * input.costPerKm).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 font-medium">Tempo (Horas)</span>
                  <span className="text-zinc-300 font-bold">R$ {(input.estimatedHours * input.costPerHour).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 font-medium">Outros Custos</span>
                  <span className="text-zinc-300 font-bold">R$ {(input.tolls + input.extraCosts).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </PageCard>
        </div>
      </div>
    </div>
  );
};
