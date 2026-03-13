import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/useAppStore';
import { PLATFORM_NAMES, TRANSPORT_MODE_NAMES } from '../constants';
import { PlatformType, TransportMode } from '../types';
import { 
  User, 
  Truck, 
  Target, 
  LogOut, 
  Shield, 
  Bell, 
  ChevronRight, 
  Check,
  Smartphone,
  Info,
  Instagram
} from 'lucide-react';

export const Settings = () => {
  const { user, signOut } = useAuthStore();
  const { workProfiles, vehicleSettings, goals, updateWorkProfiles, updateVehicleSettings, updateGoal } = useAppStore();
  
  const [activePlatforms, setActivePlatforms] = useState<PlatformType[]>(
    workProfiles.map(p => p.platform_type)
  );

  const activeGoal = goals.find(g => g.active);

  const togglePlatform = async (p: PlatformType) => {
    const newPlatforms = activePlatforms.includes(p) 
      ? activePlatforms.filter(x => x !== p) 
      : [...activePlatforms, p];
    
    setActivePlatforms(newPlatforms);
    await updateWorkProfiles(newPlatforms);
  };

  const handleTransportChange = async (mode: TransportMode) => {
    if (vehicleSettings) {
      await updateVehicleSettings({
        ...vehicleSettings,
        transport_mode: mode
      });
    }
  };

  const handleFixedCostChange = async (field: string, value: number) => {
    if (vehicleSettings) {
      await updateVehicleSettings({
        ...vehicleSettings,
        [field]: value
      });
    }
  };

  const handleGoalChange = async (value: number) => {
    await updateGoal({
      target_amount: value,
      current_amount: 0,
      month: new Date().toISOString().substring(0, 7),
      active: true
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 pb-24">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Ajustes</h1>
        <p className="text-zinc-400">Gerencie seu perfil e configurações do app.</p>
      </header>

      {/* Profile Section */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="p-6 flex items-center gap-4 border-b border-zinc-800">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-zinc-950 font-bold text-2xl">
            {user?.email?.[0].toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-lg">{user?.displayName || 'Usuário'}</h3>
            <p className="text-zinc-500 text-sm">{user?.email}</p>
          </div>
        </div>
        <div className="p-2">
          <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-800 rounded-2xl transition-colors text-red-500" onClick={signOut}>
            <div className="flex items-center gap-3">
              <LogOut size={20} />
              <span className="font-medium">Sair da Conta</span>
            </div>
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest px-2">Plataformas Ativas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(Object.keys(PLATFORM_NAMES) as PlatformType[]).map((p) => (
            <button
              key={p}
              onClick={() => togglePlatform(p)}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                activePlatforms.includes(p) 
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <span className="font-bold text-sm">{PLATFORM_NAMES[p]}</span>
              {activePlatforms.includes(p) && <Check size={18} />}
            </button>
          ))}
        </div>
      </section>

      {/* Goal Section */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest px-2">Meta Diária</h3>
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Meta atual</span>
            <span className="text-2xl font-bold text-emerald-500">R$ {activeGoal?.target_amount || 0}</span>
          </div>
          <input 
            type="range" 
            min="50" 
            max="1000" 
            step="10" 
            value={activeGoal?.target_amount || 200}
            onChange={(e) => handleGoalChange(Number(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </section>

      {/* Vehicle Section */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest px-2">Perfil de Custos</h3>
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase">Meio de Transporte</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(TRANSPORT_MODE_NAMES) as TransportMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => handleTransportChange(m)}
                  className={`p-3 rounded-xl text-xs font-bold transition-all ${
                    vehicleSettings?.transport_mode === m 
                      ? 'bg-emerald-500 text-zinc-950' 
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  {TRANSPORT_MODE_NAMES[m]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Seguro Mensal</label>
              <input 
                type="number" 
                value={vehicleSettings?.insurance_monthly || 0}
                onChange={(e) => handleFixedCostChange('insurance_monthly', Number(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Parcela Veículo</label>
              <input 
                type="number" 
                value={vehicleSettings?.financing_monthly || 0}
                onChange={(e) => handleFixedCostChange('financing_monthly', Number(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Manutenção Mensal</label>
              <input 
                type="number" 
                value={vehicleSettings?.maintenance_monthly || 0}
                onChange={(e) => handleFixedCostChange('maintenance_monthly', Number(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">Outros Custos Fixos</label>
              <input 
                type="number" 
                value={vehicleSettings?.other_fixed_costs || 0}
                onChange={(e) => handleFixedCostChange('other_fixed_costs', Number(e.target.value))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* App Info Section */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl">
            <Info size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold">Sobre o App</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              O RotaLucro é uma ferramenta focada em ajudar entregadores a terem clareza sobre seus ganhos reais.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-800 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500">Versão</span>
            <span className="font-bold text-zinc-300">1.0</span>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
            <p className="text-xs text-amber-500 font-medium leading-tight">
              Aplicativo em desenvolvimento, estamos em teste Alpha, podendo haver bugs e erros.
            </p>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500">Desenvolvido por</span>
            <a 
              href="https://instagram.com/onoturnocsz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-emerald-500 font-bold hover:underline"
            >
              <Instagram size={16} />
              @onoturnocsz
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
