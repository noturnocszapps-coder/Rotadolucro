'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  MapPin, 
  Clock, 
  Calendar,
  PlusCircle,
  Calculator,
  Receipt,
  Fuel,
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { StatCard } from './StatCard';
import { QuickAction } from './QuickAction';
import { PlatformTabs } from './PlatformTabs';
import { PLATFORMS } from '@/constants/platforms';
import Link from 'next/link';

interface DashboardContentProps {
  userName: string;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ userName }) => {
  const [activeTab, setActiveTab] = useState<string>(PLATFORMS.COMBINADO);

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <div className="flex items-center gap-3 text-primary mb-4">
            <BarChart3 className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Painel de Controle</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase font-display leading-[0.9]">
            Olá, <br /><span className="text-primary">{userName.split(' ')[0]}</span>
          </h1>
          <p className="text-neutral-500 mt-4 font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        <Link 
          href="/records/new" 
          className="group flex items-center gap-3 bg-white text-black px-10 py-5 rounded-[24px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-2xl shadow-white/5 active:scale-95"
        >
          <PlusCircle className="w-6 h-6" />
          Novo Registro
        </Link>
      </header>

      {/* Platform Tabs */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Filtrar por Plataforma</h2>
        </div>
        <PlatformTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </section>

      {/* Summary Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Ganhos Hoje" 
          value="R$ 245,00" 
          subValue="+12% em relação a ontem" 
          icon={DollarSign} 
          color="text-emerald-500"
        />
        <StatCard 
          label="Lucro Líquido" 
          value="R$ 1.840,00" 
          subValue="Mês atual" 
          icon={TrendingUp} 
          color="text-primary"
        />
        <StatCard 
          label="Despesas" 
          value="R$ 420,00" 
          subValue="Mês atual" 
          icon={Receipt} 
          color="text-rose-500"
        />
        <StatCard 
          label="Ganho por KM" 
          value="R$ 2,45" 
          subValue="Média da semana" 
          icon={MapPin} 
          color="text-amber-500"
        />
      </section>

      {/* Quick Actions Grid */}
      <section className="space-y-6">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <QuickAction label="Registro" icon={PlusCircle} href="/records/new" />
          <QuickAction label="Simular" icon={TrendingUp} href="/simulator" />
          <QuickAction label="Gasto" icon={Receipt} href="/expenses/new" color="text-rose-500" />
          <QuickAction label="Abastecer" icon={Fuel} href="/fuel/new" color="text-amber-500" />
          <QuickAction label="Frete" icon={Calculator} href="/freight" color="text-primary" />
          <QuickAction label="Relatórios" icon={BarChart3} href="/reports" color="text-indigo-500" />
        </div>
      </section>

      {/* Secondary Stats */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="glass-card p-8 col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black uppercase tracking-tight">Performance Semanal</h3>
            <Link href="/reports" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Ver Detalhes</Link>
          </div>
          <div className="h-48 flex items-end gap-4">
            {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
              <div key={i} className="flex-1 bg-primary/20 rounded-t-xl relative group">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-xl transition-all duration-500 group-hover:bg-primary-light" 
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[9px] font-black text-neutral-600 uppercase tracking-widest">
            <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span><span>Dom</span>
          </div>
        </div>

        <div className="glass-card p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-6">Metas do Mês</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                  <span className="text-neutral-500">Faturamento</span>
                  <span className="text-white">R$ 3.200 / R$ 5.000</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[64%] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                  <span className="text-neutral-500">Pacotes</span>
                  <span className="text-white">420 / 600</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[70%] rounded-full" />
                </div>
              </div>
            </div>
          </div>
          <button className="w-full mt-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            Ajustar Metas
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
