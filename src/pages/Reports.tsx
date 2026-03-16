import React, { useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { PLATFORM_NAMES } from '../constants';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Filter, Download, ChevronLeft, ChevronRight, TrendingUp, Wallet, Navigation, Package } from 'lucide-react';

import { PageCard } from '../components/PageCard';

export const Reports = () => {
  const { workLogs, expenses, fuelLogs, maintenanceLogs, vehicleSettings } = useAppStore();
  const [month, setMonth] = useState(new Date());

  const data = useMemo(() => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days = eachDayOfInterval({ start, end });

    const filteredLogs = workLogs.filter(l => isWithinInterval(new Date(l.date), { start, end }));
    const filteredExps = expenses.filter(e => isWithinInterval(new Date(e.date), { start, end }));
    const filteredFuels = fuelLogs.filter(f => isWithinInterval(new Date(f.date), { start, end }));
    const filteredMaints = maintenanceLogs.filter(m => isWithinInterval(new Date(m.date), { start, end }));

    const dailyData = days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayLogs = filteredLogs.filter(l => l.date === dayStr);
      const gross = dayLogs.reduce((acc, curr) => acc + curr.gross_amount + (curr.bonus_amount || 0), 0);
      const km = dayLogs.reduce((acc, curr) => acc + curr.km_driven, 0);
      return {
        date: format(day, 'dd/MM'),
        ganhos: gross,
        km: km
      };
    });

    const categoryData = [
      { name: 'Combustível', value: filteredFuels.reduce((acc, curr) => acc + curr.total_value, 0) },
      { name: 'Manutenção', value: filteredMaints.reduce((acc, curr) => acc + curr.amount, 0) },
      { name: 'Outros', value: filteredExps.reduce((acc, curr) => acc + curr.amount, 0) },
    ].filter(c => c.value > 0);

    const activePlatforms = ['shopee', 'mercadolivre', 'frete'];
    const platformData = activePlatforms.map(p => {
      const pLogs = filteredLogs.filter(l => l.platform_type === p);
      const gross = pLogs.reduce((acc, curr) => acc + curr.gross_amount + (curr.bonus_amount || 0), 0);
      const km = pLogs.reduce((acc, curr) => acc + curr.km_driven, 0);
      const deliveries = pLogs.reduce((acc, curr) => acc + curr.deliveries_count, 0);
      return {
        id: p,
        name: PLATFORM_NAMES[p as keyof typeof PLATFORM_NAMES],
        value: gross,
        km,
        deliveries,
        avgPerDelivery: deliveries > 0 ? gross / deliveries : 0
      };
    }).filter(p => p.value > 0 || p.deliveries > 0);

    const totalGross = filteredLogs.reduce((acc, curr) => acc + curr.gross_amount + (curr.bonus_amount || 0), 0);
    const totalExp = filteredExps.reduce((acc, curr) => acc + curr.amount, 0) + 
                     filteredFuels.reduce((acc, curr) => acc + curr.total_value, 0) + 
                     filteredMaints.reduce((acc, curr) => acc + curr.amount, 0);

    const monthlyFixedCosts = (vehicleSettings?.insurance_monthly || 0) + 
                             (vehicleSettings?.financing_monthly || 0) + 
                             (vehicleSettings?.maintenance_monthly || 0) + 
                             (vehicleSettings?.other_fixed_costs || 0);
    
    const allocatedFixedCosts = monthlyFixedCosts;
    const totalKm = filteredLogs.reduce((acc, curr) => acc + curr.km_driven, 0);
    const costPerKm = totalKm > 0 ? (totalExp + allocatedFixedCosts) / totalKm : 0;
    const totalDeliveries = filteredLogs.reduce((acc, curr) => acc + curr.deliveries_count, 0);

    return { dailyData, categoryData, platformData, totalGross, totalExp, allocatedFixedCosts, totalKm, costPerKm, totalDeliveries };
  }, [month, workLogs, expenses, fuelLogs, maintenanceLogs, vehicleSettings]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-zinc-100 tracking-tight">Relatórios</h2>
          <p className="text-zinc-500 text-sm font-medium">Análise de performance em {format(month, 'MMMM', { locale: ptBR })}.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-zinc-900/50 border border-zinc-800 rounded-2xl p-1">
            <button 
              onClick={() => setMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
              className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-100 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="px-4 flex items-center gap-2 min-w-[140px] justify-center">
              <Calendar size={16} className="text-emerald-500" />
              <span className="text-xs font-black uppercase tracking-widest text-zinc-200">
                {format(month, 'MMM yyyy', { locale: ptBR })}
              </span>
            </div>
            <button 
              onClick={() => setMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
              className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-100 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400 hover:text-zinc-100 transition-all">
            <Download size={20} />
          </button>
        </div>
      </header>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ganhos Brutos', value: `R$ ${data.totalGross.toFixed(2)}`, icon: Wallet, color: 'emerald' },
          { label: 'Km Rodados', value: `${data.totalKm.toFixed(1)} KM`, icon: Navigation, color: 'blue' },
          { label: 'Total Entregas', value: data.totalDeliveries, icon: Package, color: 'amber' },
          { label: 'Lucro Líquido', value: `R$ ${(data.totalGross - data.totalExp - data.allocatedFixedCosts).toFixed(2)}`, icon: TrendingUp, color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-[2rem] space-y-3 relative overflow-hidden group hover:border-zinc-700/50 transition-all">
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-500`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-2xl font-black text-zinc-100 tracking-tight">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Performance Chart */}
        <div className="lg:col-span-2">
          <PageCard className="p-8 rounded-[2.5rem] bg-zinc-900/40 border-zinc-800/50 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Desempenho Diário</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Ganhos</span>
                </div>
              </div>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.dailyData}>
                  <defs>
                    <linearGradient id="colorGanhos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.5} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#52525b" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fontWeight: 700 }}
                  />
                  <YAxis 
                    stroke="#52525b" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(v) => `R$${v}`}
                    tick={{ fontWeight: 700 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px', padding: '12px' }}
                    itemStyle={{ color: '#10b981', fontWeight: 800 }}
                    labelStyle={{ color: '#71717a', marginBottom: '4px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="ganhos" 
                    stroke="#10b981" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorGanhos)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </PageCard>
        </div>

        {/* Expenses Distribution */}
        <PageCard className="p-8 rounded-[2.5rem] bg-zinc-900/40 border-zinc-800/50 space-y-8 flex flex-col">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Distribuição de Gastos</h3>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 gap-3 w-full mt-6">
              {data.categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/30">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{entry.name}</span>
                  </div>
                  <span className="text-xs font-black text-zinc-100">R$ {entry.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </PageCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Ranking */}
        <PageCard className="p-8 rounded-[2.5rem] bg-zinc-900/40 border-zinc-800/50 space-y-8">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Ganhos por Plataforma</h3>
          <div className="space-y-4">
            {data.platformData.sort((a, b) => b.value - a.value).map((p, i) => (
              <div key={p.id} className="group">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">#{i+1} {p.name}</span>
                    <span className="text-lg font-black text-zinc-100">R$ {p.value.toFixed(2)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Média/Entrega</span>
                    <span className="text-sm font-black text-zinc-300">R$ {p.avgPerDelivery.toFixed(2)}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${(p.value / data.totalGross) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </PageCard>

        {/* Efficiency Metrics */}
        <PageCard className="p-8 rounded-[2.5rem] bg-zinc-900/40 border-zinc-800/50 space-y-8">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Métricas de Eficiência</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-zinc-950/50 rounded-3xl border border-zinc-800/30 space-y-2">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Custo por KM</p>
              <h4 className="text-2xl font-black text-zinc-100">R$ {data.costPerKm.toFixed(2)}</h4>
              <p className="text-[9px] text-zinc-600 font-bold uppercase">Incluindo custos fixos</p>
            </div>
            <div className="p-6 bg-zinc-950/50 rounded-3xl border border-zinc-800/30 space-y-2">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Ganhos/KM</p>
              <h4 className="text-2xl font-black text-emerald-500">R$ {data.totalKm > 0 ? (data.totalGross / data.totalKm).toFixed(2) : '0.00'}</h4>
              <p className="text-[9px] text-zinc-600 font-bold uppercase">Média bruta</p>
            </div>
            <div className="p-6 bg-zinc-950/50 rounded-3xl border border-zinc-800/30 space-y-2">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Média Diária</p>
              <h4 className="text-2xl font-black text-zinc-100">R$ {data.dailyData.length > 0 ? (data.totalGross / data.dailyData.length).toFixed(2) : '0.00'}</h4>
              <p className="text-[9px] text-zinc-600 font-bold uppercase">Ganhos brutos</p>
            </div>
            <div className="p-6 bg-zinc-950/50 rounded-3xl border border-zinc-800/30 space-y-2">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Lucro Real</p>
              <h4 className="text-2xl font-black text-emerald-500">
                {data.totalGross > 0 ? (((data.totalGross - data.totalExp - data.allocatedFixedCosts) / data.totalGross) * 100).toFixed(1) : 0}%
              </h4>
              <p className="text-[9px] text-zinc-600 font-bold uppercase">Margem líquida</p>
            </div>
          </div>
        </PageCard>
      </div>
    </div>
  );
};
