import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/useAppStore';
import { PLATFORM_NAMES, TRANSPORT_MODE_NAMES } from '../constants';
import { PlatformType, TransportMode } from '../types';
import { useNavigate } from 'react-router-dom';
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
  Instagram,
  Plus,
  Sparkles
} from 'lucide-react';

import { PageCard } from '../components/PageCard';

export const Settings = () => {
  const { user, signOut } = useAuthStore();
  const { workProfiles, vehicleSettings, goals, updateWorkProfiles, updateVehicleSettings, updateGoal } = useAppStore();
  const navigate = useNavigate();
  
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
    <div className="max-w-2xl mx-auto space-y-4 pb-16 px-4 md:px-0">
      <header className="pt-4">
        <h2 className="text-4xl font-black text-white tracking-tight">Ajustes</h2>
        <p className="text-zinc-500 font-medium mt-1">Gerencie sua conta e preferências operacionais.</p>
      </header>
 
      {/* Perfil do Usuário */}
      <section className="space-y-2">
        <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.25em] px-1">Perfil do Usuário</h3>
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden backdrop-blur-sm">
          <div className="p-5 flex items-center gap-5 border-b border-zinc-800/50">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-zinc-950 font-black text-2xl shadow-lg shadow-emerald-500/20">
              {user?.email?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl text-white truncate">{user?.displayName || 'Usuário'}</h3>
              <p className="text-zinc-500 text-sm font-medium truncate mt-0.5">{user?.email}</p>
            </div>
          </div>
          <button 
            className="w-full flex items-center justify-between p-5 hover:bg-red-500/5 active:bg-red-500/10 transition-all text-red-500 group" 
            onClick={signOut}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                <LogOut size={20} />
              </div>
              <span className="font-bold text-base">Sair da Conta</span>
            </div>
            <ChevronRight size={18} className="text-zinc-700 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      </section>
 
      {/* Plataformas Ativas */}
      <section className="space-y-2">
        <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.25em] px-1">Plataformas Ativas</h3>
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-2 backdrop-blur-sm">
          <div className="grid grid-cols-1 gap-1">
            {(['shopee', 'mercadolivre', 'frete'] as PlatformType[]).map((p) => (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${
                  activePlatforms.includes(p) 
                    ? 'bg-emerald-500/5 text-emerald-400' 
                    : 'text-zinc-500 hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    activePlatforms.includes(p) 
                      ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20' 
                      : 'bg-zinc-800 text-zinc-600'
                  }`}>
                    {activePlatforms.includes(p) ? <Check size={18} strokeWidth={3} /> : <Plus size={18} />}
                  </div>
                  <span className="font-bold text-sm uppercase tracking-widest">{PLATFORM_NAMES[p]}</span>
                </div>
                {activePlatforms.includes(p) && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Ativo</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>
 
      {/* Configurações de Operação */}
      <section className="space-y-2">
        <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.25em] px-1">Configurações de Operação</h3>
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-6 space-y-8 backdrop-blur-sm">
          {/* Meta Diária */}
          <div className="space-y-5">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Meta Diária</span>
                <p className="text-xs text-zinc-600 font-medium">Seu objetivo de faturamento bruto por dia.</p>
              </div>
              <span className="text-2xl font-black text-emerald-500 tabular-nums">R$ {activeGoal?.target_amount || 0}</span>
            </div>
            <div className="relative pt-2">
              <input 
                type="range" 
                min="50" 
                max="1000" 
                step="10" 
                value={activeGoal?.target_amount || 200}
                onChange={(e) => handleGoalChange(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between mt-2 text-[9px] font-black text-zinc-700 uppercase tracking-tighter">
                <span>R$ 50</span>
                <span>R$ 500</span>
                <span>R$ 1000</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-800/50" />

          {/* Meio de Transporte */}
          <div className="space-y-5">
            <div className="space-y-1">
              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Meio de Transporte</span>
              <p className="text-xs text-zinc-600 font-medium">Usado para calcular médias de consumo e custos.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(TRANSPORT_MODE_NAMES) as TransportMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => handleTransportChange(m)}
                  className={`py-4 px-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${
                    vehicleSettings?.transport_mode === m 
                      ? 'bg-emerald-500 border-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/20' 
                      : 'bg-zinc-800/30 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  {TRANSPORT_MODE_NAMES[m]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Preferências */}
      <section className="space-y-2">
        <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.25em] px-1">Preferências</h3>
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-2 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4 rounded-2xl text-zinc-400 hover:bg-zinc-800/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-500">
                <Bell size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-zinc-300">Notificações</span>
                <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider">Alertas de ganhos e metas</span>
              </div>
            </div>
            <div className="w-11 h-6 bg-emerald-500 rounded-full relative cursor-pointer shadow-inner">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
            </div>
          </div>
          <div className="h-px bg-zinc-800/30 mx-4" />
          <div className="flex items-center justify-between p-4 rounded-2xl text-zinc-400 hover:bg-zinc-800/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-500">
                <Smartphone size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-zinc-300">Tema Escuro</span>
                <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider">Otimizado para economia de bateria</span>
              </div>
            </div>
            <div className="w-11 h-6 bg-emerald-500 rounded-full relative cursor-pointer shadow-inner">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
            </div>
          </div>
        </div>
      </section>
 
      {/* Informações do App */}
      <section className="space-y-2">
        <h3 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.25em] px-1">Informações do App</h3>
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-6 space-y-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Versão Atual</span>
              <span className="font-black text-white text-lg">1.0.6</span>
            </div>
            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border border-emerald-500/20">Novo</span>
          </div>
          
          <div className="h-px bg-zinc-800/50" />

          <button 
            onClick={() => navigate('/patch-notes')}
            className="w-full flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <Sparkles size={20} />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-zinc-300 font-bold">Novidades</span>
                <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Veja o que mudou</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-zinc-700 group-hover:text-emerald-500 transition-colors" />
          </button>

          <div className="h-px bg-zinc-800/50" />
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Desenvolvimento</span>
              <span className="text-zinc-300 font-bold">NT Aplicações</span>
            </div>
            <a href="https://www.ntaplicacoes.com.br" target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-black text-xs hover:underline bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 transition-all active:scale-95">Website</a>
          </div>

          <div className="h-px bg-zinc-800/50" />

          <div className="flex items-center justify-between group cursor-pointer" onClick={() => window.open('https://www.ntaplicacoes.com.br', '_blank')}>
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Suporte & Contato</span>
              <span className="text-zinc-400 font-medium text-sm group-hover:text-emerald-400 transition-colors">ntaplicacoes.com.br</span>
            </div>
            <ChevronRight size={18} className="text-zinc-700 group-hover:text-emerald-400 transition-colors" />
          </div>
        </div>
      </section>

      <footer className="pt-4 pb-8 text-center">
        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em]">© 2026 RotaLucro • Premium Delivery Tool</p>
      </footer>
    </div>
  );
};

export default Settings;
