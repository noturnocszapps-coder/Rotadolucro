import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { PageCard } from '../components/PageCard';
import { StatCard } from '../components/StatCard';
import { 
  ArrowLeft, 
  Calculator, 
  Save, 
  Truck, 
  Navigation, 
  Clock, 
  Package, 
  DollarSign, 
  Fuel, 
  Wrench, 
  Utensils, 
  MapPin,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import { 
  calculateSimulation, 
  SimulationInput, 
  SimulationResult,
  PlatformType,
  AllocationMode
} from '../utils/routeSimulator';
import { ShopeeVehicleType } from '../types';
import { PLATFORM_NAMES } from '../constants';

export const RouteSimulator = () => {
  const navigate = useNavigate();
  const { vehicleSettings, addWorkLog } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Form State
  const [input, setInput] = useState<SimulationInput>({
    platform: 'shopee',
    date: format(new Date(), 'yyyy-MM-dd'),
    kmDriven: 0,
    hoursWorked: 0,
    packagesCount: 0,
    extraExpenses: 0,
    tolls: 0,
    foodExpenses: 0,
    parking: 0,
    fuelEstimate: 0,
    maintenanceEstimate: 0,
    allocationMode: 'daily',
    vehicleType: 'Passeio',
    grossAmountManual: 0,
    routesCount: 1,
  });

  // Auto-calculate fuel and maintenance if possible
  // For now, let's just let the user input or provide some defaults based on KM
  useEffect(() => {
    if (input.kmDriven > 0) {
      // Simple defaults: R$ 0.45/km for fuel, R$ 0.10/km for maintenance
      setInput(prev => ({
        ...prev,
        fuelEstimate: Number((input.kmDriven * 0.45).toFixed(2)),
        maintenanceEstimate: Number((input.kmDriven * 0.10).toFixed(2))
      }));
    }
  }, [input.kmDriven]);

  const result = useMemo(() => {
    return calculateSimulation(input, vehicleSettings);
  }, [input, vehicleSettings]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await addWorkLog({
        platform_type: input.platform as any,
        date: input.date || format(new Date(), 'yyyy-MM-dd'),
        gross_amount: result.grossAmount,
        bonus_amount: 0,
        hours_worked: input.hoursWorked,
        km_driven: input.kmDriven,
        deliveries_count: input.packagesCount, // Assuming packages count as deliveries for simulation
        packages_count: input.packagesCount,
        routes_count: input.routesCount || 1,
        vehicle_type: input.platform === 'shopee' ? input.vehicleType : undefined,
        notes: `Simulação salva: Lucro est. R$ ${result.estimatedNetProfit.toFixed(2)}`
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error saving simulation:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Muito boa': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Aceitável': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Baixa': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Prejuízo': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  const isWorthIt = result.profitabilityStatus === 'Muito boa' || result.profitabilityStatus === 'Aceitável';

  return (
    <div className="space-y-8 pb-24">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Simulador de Rota</h2>
          <p className="text-zinc-400 text-sm">Estime seus ganhos e custos antes de sair.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <PageCard className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Configuração da Rota</h3>
              
              {/* Platform Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setInput(prev => ({ ...prev, platform: 'shopee' }))}
                  className={`p-3 rounded-xl text-xs font-bold transition-all border ${
                    input.platform === 'shopee' 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                  }`}
                >
                  Shopee
                </button>
                <button
                  onClick={() => setInput(prev => ({ ...prev, platform: 'mercadolivre' }))}
                  className={`p-3 rounded-xl text-xs font-bold transition-all border ${
                    input.platform === 'mercadolivre' 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                  }`}
                >
                  Mercado Livre
                </button>
              </div>

              {input.platform === 'shopee' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Tipo de Veículo</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setInput(prev => ({ ...prev, vehicleType: 'Passeio' }))}
                      className={`p-3 rounded-xl text-xs font-bold transition-all ${
                        input.vehicleType === 'Passeio' 
                          ? 'bg-zinc-100 text-zinc-950' 
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      Passeio
                    </button>
                    <button
                      onClick={() => setInput(prev => ({ ...prev, vehicleType: 'Fiorino' }))}
                      className={`p-3 rounded-xl text-xs font-bold transition-all ${
                        input.vehicleType === 'Fiorino' 
                          ? 'bg-zinc-100 text-zinc-950' 
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      Fiorino
                    </button>
                  </div>
                </div>
              )}

              {input.platform === 'mercadolivre' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Ganhos Brutos (R$)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input 
                      type="number" 
                      value={input.grossAmountManual || ''}
                      onChange={(e) => setInput(prev => ({ ...prev, grossAmountManual: Number(e.target.value) }))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 pl-10 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                  <Navigation size={14} /> KM Estimados
                </label>
                <input 
                  type="number" 
                  value={input.kmDriven || ''}
                  onChange={(e) => setInput(prev => ({ ...prev, kmDriven: Number(e.target.value) }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                  <Clock size={14} /> Horas Est.
                </label>
                <input 
                  type="number" 
                  step="0.5"
                  value={input.hoursWorked || ''}
                  onChange={(e) => setInput(prev => ({ ...prev, hoursWorked: Number(e.target.value) }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                  <Package size={14} /> Pacotes
                </label>
                <input 
                  type="number" 
                  value={input.packagesCount || ''}
                  onChange={(e) => setInput(prev => ({ ...prev, packagesCount: Number(e.target.value) }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                  <Truck size={14} /> Rotas
                </label>
                <input 
                  type="number" 
                  value={input.routesCount || ''}
                  onChange={(e) => setInput(prev => ({ ...prev, routesCount: Number(e.target.value) }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none"
                  placeholder="1"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Custos da Rota</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                    <Fuel size={14} /> Combustível
                  </label>
                  <input 
                    type="number" 
                    value={input.fuelEstimate || ''}
                    onChange={(e) => setInput(prev => ({ ...prev, fuelEstimate: Number(e.target.value) }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                    <Wrench size={14} /> Manutenção
                  </label>
                  <input 
                    type="number" 
                    value={input.maintenanceEstimate || ''}
                    onChange={(e) => setInput(prev => ({ ...prev, maintenanceEstimate: Number(e.target.value) }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                    <MapPin size={14} /> Pedágios
                  </label>
                  <input 
                    type="number" 
                    value={input.tolls || ''}
                    onChange={(e) => setInput(prev => ({ ...prev, tolls: Number(e.target.value) }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                    <Utensils size={14} /> Alimentação
                  </label>
                  <input 
                    type="number" 
                    value={input.foodExpenses || ''}
                    onChange={(e) => setInput(prev => ({ ...prev, foodExpenses: Number(e.target.value) }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Alocação de Custo Fixo</h3>
              <div className="grid grid-cols-3 gap-2">
                {(['none', 'daily', 'proportional'] as AllocationMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setInput(prev => ({ ...prev, allocationMode: mode }))}
                    className={`p-3 rounded-xl text-[10px] font-bold transition-all border ${
                      input.allocationMode === mode 
                        ? 'bg-zinc-100 text-zinc-950 border-zinc-100' 
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                    }`}
                  >
                    {mode === 'none' ? 'Nenhum' : mode === 'daily' ? 'Diário' : 'Prop.'}
                  </button>
                ))}
              </div>
              {!vehicleSettings && input.allocationMode !== 'none' && (
                <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-[10px]">
                  <AlertCircle size={14} />
                  <span>Configure seus custos fixos em Ajustes para uma simulação real.</span>
                </div>
              )}
            </div>
          </PageCard>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Main Profitability Card */}
          <div className={`p-8 rounded-3xl border-2 transition-all flex flex-col items-center text-center space-y-6 relative overflow-hidden ${getStatusColor(result.profitabilityStatus)}`}>
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-current opacity-5 pointer-events-none"></div>
            
            <div className="space-y-2 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Status da Rota</span>
              <h3 className="text-4xl font-black uppercase tracking-tight">{result.profitabilityStatus}</h3>
            </div>

            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-zinc-950/40 backdrop-blur-sm border border-white/5 relative z-10">
              {isWorthIt ? (
                <>
                  <ThumbsUp size={24} className="text-emerald-400" />
                  <span className="font-bold text-zinc-100">Vale a pena fazer!</span>
                </>
              ) : (
                <>
                  <ThumbsDown size={24} className="text-red-400" />
                  <span className="font-bold text-zinc-100">Avalie com cuidado</span>
                </>
              )}
            </div>

            <div className="w-full space-y-4 relative z-10">
              <div className="flex justify-between items-end">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold opacity-60">Lucro Líquido</span>
                  <p className="text-3xl font-black">R$ {result.estimatedNetProfit.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold opacity-60">Margem Real</span>
                  <p className="text-2xl font-bold">
                    {result.grossAmount > 0 ? ((result.estimatedNetProfit / result.grossAmount) * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>

              {/* Progress Bar Comparison */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase opacity-60">
                  <span>Custos</span>
                  <span>Ganhos</span>
                </div>
                <div className="h-3 bg-zinc-950/50 rounded-full overflow-hidden flex border border-white/5">
                  <div 
                    className="h-full bg-red-500 transition-all duration-500" 
                    style={{ width: `${result.grossAmount > 0 ? Math.min((result.totalRouteCost / result.grossAmount) * 100, 100) : 0}%` }}
                  ></div>
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500" 
                    style={{ width: `${result.grossAmount > 0 ? Math.max(0, 100 - (result.totalRouteCost / result.grossAmount) * 100) : 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <TrendingUp size={18} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Ganhos Brutos</span>
              </div>
              <p className="text-2xl font-black text-zinc-100">R$ {result.grossAmount.toFixed(2)}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl space-y-1">
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <TrendingDown size={18} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Custo Total</span>
              </div>
              <p className="text-2xl font-black text-zinc-100">R$ {result.totalRouteCost.toFixed(2)}</p>
            </div>
          </div>

          <PageCard className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Detalhamento</h3>
              <div className="p-1.5 bg-zinc-800 rounded-lg text-zinc-500">
                <Info size={14} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex justify-between items-center p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800/50">
                <div className="flex items-center gap-3">
                  <Navigation size={16} className="text-zinc-500" />
                  <span className="text-xs text-zinc-400 font-medium">Por KM</span>
                </div>
                <span className="font-bold text-zinc-100">R$ {result.earningsPerKm.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800/50">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-zinc-500" />
                  <span className="text-xs text-zinc-400 font-medium">Por Hora</span>
                </div>
                <span className="font-bold text-zinc-100">R$ {result.earningsPerHour.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800/50">
                <div className="flex items-center gap-3">
                  <Package size={16} className="text-zinc-500" />
                  <span className="text-xs text-zinc-400 font-medium">Por Pacote</span>
                </div>
                <span className="font-bold text-zinc-100">R$ {result.earningsPerPackage.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800/50">
                <div className="flex items-center gap-3">
                  <Calculator size={16} className="text-zinc-500" />
                  <span className="text-xs text-zinc-400 font-medium">Equilíbrio</span>
                </div>
                <span className="font-bold text-zinc-100">R$ {result.breakEvenCostPerKm.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800 space-y-4">
              <div className="flex justify-between text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                <span>Composição do Custo</span>
                <span>R$ {result.totalRouteCost.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between items-center p-3 bg-zinc-800/20 rounded-xl">
                  <span className="text-xs text-zinc-400">Custos Variáveis</span>
                  <span className="text-sm font-bold text-zinc-300">R$ {result.variableCosts.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-zinc-800/20 rounded-xl">
                  <span className="text-xs text-zinc-400">Custo Fixo Alocado</span>
                  <span className="text-sm font-bold text-zinc-300">R$ {result.fixedCostAllocated.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={loading || result.grossAmount <= 0}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl ${
                isSaved 
                  ? 'bg-zinc-800 text-emerald-400 border border-emerald-500/50' 
                  : 'bg-emerald-500 text-zinc-950 hover:bg-emerald-600 shadow-emerald-500/20'
              } disabled:opacity-50`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
              ) : isSaved ? (
                <>
                  <CheckCircle2 size={20} /> Registro Salvo!
                </>
              ) : (
                <>
                  <Save size={20} /> Salvar como Registro
                </>
              )}
            </button>
          </PageCard>
        </div>
      </div>
    </div>
  );
};
