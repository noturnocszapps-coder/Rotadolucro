import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { PlatformType, TransportMode } from '../types';
import { PLATFORM_NAMES, TRANSPORT_MODE_NAMES } from '../constants';
import { Check, Truck, Bike, Car, User, ChevronRight } from 'lucide-react';

export const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>([]);
  const [transportMode, setTransportMode] = useState<TransportMode>('motorcycle');
  const [dailyGoal, setDailyGoal] = useState<number>(200);
  const [fixedCosts, setFixedCosts] = useState({
    insurance: 0,
    financing: 0,
    maintenance: 0,
    other: 0
  });
  const [loading, setLoading] = useState(false);
  
  const { updateWorkProfiles, updateVehicleSettings, updateGoal } = useAppStore();
  const navigate = useNavigate();

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        await updateWorkProfiles(selectedPlatforms);
        await updateVehicleSettings({
          transport_mode: transportMode,
          vehicle_model: '',
          fuel_type: 'Gasolina',
          average_consumption: 0,
          insurance_monthly: fixedCosts.insurance,
          financing_monthly: fixedCosts.financing,
          ipva_annual: 0,
          maintenance_monthly: fixedCosts.maintenance,
          other_fixed_costs: fixedCosts.other
        });
        await updateGoal({
          target_amount: dailyGoal,
          current_amount: 0,
          month: new Date().toISOString().substring(0, 7),
          active: true
        });
        navigate('/dashboard');
      } catch (error) {
        console.error('Error in onboarding:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const togglePlatform = (p: PlatformType) => {
    setSelectedPlatforms(prev => 
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="space-y-2 text-center">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-1.5 w-12 rounded-full transition-all ${step >= i ? 'bg-emerald-500' : 'bg-zinc-800'}`}></div>
            ))}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Configuração Inicial</h1>
          <p className="text-zinc-400">
            {step === 1 && 'Quais plataformas você utiliza?'}
            {step === 2 && 'Qual seu meio de transporte?'}
            {step === 3 && 'Qual sua meta diária de ganhos?'}
            {step === 4 && 'Quais seus custos fixos mensais?'}
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xl">
          {step === 1 && (
            <div className="space-y-4">
              {(['shopee', 'mercadolivre', 'frete'] as PlatformType[]).map((p) => (
                <button
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
                    selectedPlatforms.includes(p) 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500'
                  }`}
                >
                  <span className="font-bold">{PLATFORM_NAMES[p]}</span>
                  {selectedPlatforms.includes(p) && <Check size={20} />}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(TRANSPORT_MODE_NAMES) as TransportMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setTransportMode(m)}
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all ${
                    transportMode === m 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500'
                  }`}
                >
                  {m === 'motorcycle' && <Bike size={24} />}
                  {m === 'car' && <Car size={24} />}
                  {m === 'fiorino' && <Truck size={24} />}
                  {(m === 'bicycle' || m === 'scooter') && <Bike size={24} />}
                  {m === 'walking' && <User size={24} />}
                  <span className="text-xs font-bold uppercase tracking-wider">{TRANSPORT_MODE_NAMES[m]}</span>
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-5xl font-bold text-emerald-500">R$ {dailyGoal}</span>
                <p className="text-zinc-500 mt-2">Meta por dia trabalhado</p>
              </div>
              <input 
                type="range" 
                min="50" 
                max="1000" 
                step="10" 
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-zinc-500">
                <span>R$ 50</span>
                <span>R$ 1000</span>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Seguro Mensal</label>
                <input 
                  type="number" 
                  value={fixedCosts.insurance}
                  onChange={(e) => setFixedCosts({...fixedCosts, insurance: Number(e.target.value)})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="R$ 0,00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Parcela Veículo</label>
                <input 
                  type="number" 
                  value={fixedCosts.financing}
                  onChange={(e) => setFixedCosts({...fixedCosts, financing: Number(e.target.value)})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="R$ 0,00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Manutenção Prevista</label>
                <input 
                  type="number" 
                  value={fixedCosts.maintenance}
                  onChange={(e) => setFixedCosts({...fixedCosts, maintenance: Number(e.target.value)})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="R$ 0,00"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold py-4 rounded-2xl transition-all"
              >
                Voltar
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={step === 1 && selectedPlatforms.length === 0 || loading}
              className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {step === 4 ? 'Finalizar' : 'Próximo'} <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
