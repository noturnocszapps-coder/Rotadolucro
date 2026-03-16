'use client';

import React, { useState } from 'react';
import { ArrowLeft, Save, Calendar, Package, MapPin, Clock, DollarSign, Fuel, Receipt } from 'lucide-react';
import Link from 'next/link';
import { ACTIVE_PLATFORMS } from '@/constants/platforms';
import { useRouter } from 'next/navigation';

export default function NewRecordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    platform: ACTIVE_PLATFORMS[0],
    revenue: '',
    km: '',
    hours_worked: '',
    packages_count: '',
    routes_count: '1',
    fuel_cost: '',
    extra_expense: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock save
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <main className="min-h-screen bg-bg py-12 px-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        <header className="mb-12">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Voltar ao Dashboard</span>
          </Link>
          <h1 className="text-4xl font-black tracking-tighter uppercase font-display">Novo <span className="text-primary">Registro</span></h1>
          <p className="text-neutral-500 font-medium">Insira os dados da sua última rota ou dia de trabalho.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="glass-card p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Data</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-primary/50 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Plataforma</label>
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-4 text-sm font-bold focus:border-primary/50 outline-none transition-all appearance-none"
                >
                  {ACTIVE_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Faturamento Bruto (R$)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <input
                  type="number"
                  step="0.01"
                  name="revenue"
                  value={formData.revenue}
                  onChange={handleChange}
                  required
                  placeholder="0,00"
                  className="w-full bg-primary/5 border border-primary/20 rounded-2xl py-6 pl-12 pr-4 text-2xl font-black text-primary placeholder:text-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">KM Rodados</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                  <input
                    type="number"
                    name="km"
                    value={formData.km}
                    onChange={handleChange}
                    required
                    placeholder="0"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-primary/50 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Horas Trabalhadas</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                  <input
                    type="number"
                    step="0.1"
                    name="hours_worked"
                    value={formData.hours_worked}
                    onChange={handleChange}
                    required
                    placeholder="0.0"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-primary/50 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Pacotes Entregues</label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                  <input
                    type="number"
                    name="packages_count"
                    value={formData.packages_count}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-primary/50 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Combustível (R$)</label>
                <div className="relative">
                  <Fuel className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                  <input
                    type="number"
                    step="0.01"
                    name="fuel_cost"
                    value={formData.fuel_cost}
                    onChange={handleChange}
                    placeholder="0,00"
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-primary/50 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Outras Despesas (R$)</label>
              <div className="relative">
                <Receipt className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <input
                  type="number"
                  step="0.01"
                  name="extra_expense"
                  value={formData.extra_expense}
                  onChange={handleChange}
                  placeholder="0,00"
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-primary/50 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Observações</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Ex: Rota tranquila, muitos pacotes pequenos..."
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-4 text-sm font-medium focus:border-primary/50 outline-none transition-all resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-6 rounded-[24px] bg-primary text-white font-black uppercase tracking-[0.2em] hover:bg-primary-light transition-all shadow-2xl shadow-primary/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? 'Salvando...' : (
              <>
                <Save className="w-6 h-6" />
                Salvar Registro
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
