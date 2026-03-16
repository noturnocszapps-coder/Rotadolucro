'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, ArrowLeft, Info, TrendingUp, DollarSign, Clock, MapPin, Package } from 'lucide-react';
import Link from 'next/link';
import { FreightCalculation, FreightResult } from '@/types';

export default function FreightCalculatorPage() {
  const [inputs, setInputs] = useState<FreightCalculation>({
    distance_km: 0,
    packages_count: 0,
    estimated_time: 0,
    fuel_cost: 0,
    toll: 0,
    additional_cost: 0,
    desired_profit: 0,
    cost_per_km: 0,
    cost_per_hour: 0,
  });

  const [result, setResult] = useState<FreightResult | null>(null);

  const calculate = () => {
    const totalCost = (inputs.distance_km * inputs.cost_per_km) + 
                      (inputs.estimated_time * inputs.cost_per_hour) + 
                      inputs.fuel_cost + 
                      inputs.toll + 
                      inputs.additional_cost;
    
    const minFreight = totalCost;
    const recommendedFreight = totalCost + inputs.desired_profit;
    const estimatedProfit = recommendedFreight - totalCost;
    const profitPerKm = inputs.distance_km > 0 ? estimatedProfit / inputs.distance_km : 0;
    const profitPerHour = inputs.estimated_time > 0 ? estimatedProfit / inputs.estimated_time : 0;

    setResult({
      total_cost: totalCost,
      min_freight: minFreight,
      recommended_freight: recommendedFreight,
      estimated_profit: estimatedProfit,
      profit_per_km: profitPerKm,
      profit_per_hour: profitPerHour,
    });
  };

  useEffect(() => {
    calculate();
  }, [inputs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  return (
    <main className="min-h-screen bg-bg py-12 px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-12">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Voltar ao Dashboard</span>
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <Calculator className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase font-display">Calculadora de <span className="text-primary">Frete</span></h1>
          </div>
          <p className="text-neutral-500 font-medium">Calcule o valor ideal para suas rotas com base em custos e lucro desejado.</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Inputs Section */}
          <div className="glass-card p-8 space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Parâmetros da Rota
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Distância (KM)</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                  <input
                    type="number"
                    name="distance_km"
                    value={inputs.distance_km}
                    onChange={handleInputChange}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-primary/50 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Pacotes</label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                  <input
                    type="number"
                    name="packages_count"
                    value={inputs.packages_count}
                    onChange={handleInputChange}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-primary/50 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Tempo Est. (Horas)</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                  <input
                    type="number"
                    name="estimated_time"
                    value={inputs.estimated_time}
                    onChange={handleInputChange}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-primary/50 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Combustível (R$)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                  <input
                    type="number"
                    name="fuel_cost"
                    value={inputs.fuel_cost}
                    onChange={handleInputChange}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-primary/50 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5 my-4" />

            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Custos e Lucro
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Custo/KM (R$)</label>
                <input
                  type="number"
                  name="cost_per_km"
                  value={inputs.cost_per_km}
                  onChange={handleInputChange}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-4 text-sm font-bold focus:border-primary/50 outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Custo/Hora (R$)</label>
                <input
                  type="number"
                  name="cost_per_hour"
                  value={inputs.cost_per_hour}
                  onChange={handleInputChange}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-4 text-sm font-bold focus:border-primary/50 outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Lucro Desejado (R$)</label>
                <input
                  type="number"
                  name="desired_profit"
                  value={inputs.desired_profit}
                  onChange={handleInputChange}
                  className="w-full bg-primary/5 border border-primary/20 rounded-2xl py-4 px-4 text-sm font-black text-primary outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="brand-gradient p-8 rounded-[32px] text-white brand-glow">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Valor Recomendado</p>
              <h3 className="text-5xl font-black tracking-tighter mb-6">R$ {result?.recommended_freight.toFixed(2)}</h3>
              
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Custo Total</p>
                  <p className="text-lg font-black">R$ {result?.total_cost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Lucro Est.</p>
                  <p className="text-lg font-black text-white">R$ {result?.estimated_profit.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 space-y-6">
              <h3 className="text-lg font-black uppercase tracking-tight">Análise de Performance</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-xs font-bold text-neutral-500">Lucro por KM</span>
                  <span className="text-sm font-black text-primary">R$ {result?.profit_per_km.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-xs font-bold text-neutral-500">Lucro por Hora</span>
                  <span className="text-sm font-black text-primary">R$ {result?.profit_per_hour.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-xs font-bold text-neutral-500">Frete Mínimo (Break-even)</span>
                  <span className="text-sm font-black text-rose-500">R$ {result?.min_freight.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-[10px] leading-relaxed text-primary font-bold">
                  * Este cálculo considera custos fixos e variáveis informados. Use como base para suas negociações.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
