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
  Area,
  Legend
} from 'recharts';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isWithinInterval, 
  subDays, 
  startOfDay, 
  endOfDay, 
  isSameDay,
  startOfWeek,
  endOfWeek,
  parseISO,
  getDay
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Calendar, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Wallet, 
  Navigation, 
  Package, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Lightbulb,
  AlertCircle
} from 'lucide-react';

import { PageCard } from '../components/PageCard';
import { cn } from '../lib/utils';

type FilterType = 'today' | 'yesterday' | 'week' | 'month';

export const Reports = () => {
  const { workLogs, expenses, fuelLogs, maintenanceLogs } = useAppStore();
  const [filter, setFilter] = useState<FilterType>('month');

  const data = useMemo(() => {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (filter) {
      case 'today':
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      case 'yesterday':
        start = startOfDay(subDays(now, 1));
        end = endOfDay(subDays(now, 1));
        break;
      case 'week':
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
      default:
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
    }

    const days = eachDayOfInterval({ start, end });

    const filteredLogs = workLogs.filter(l => {
      const d = parseISO(l.date);
      return isWithinInterval(d, { start, end });
    });

    const filteredExps = expenses.filter(e => {
      const d = parseISO(e.date);
      return isWithinInterval(d, { start, end });
    });

    const filteredFuels = fuelLogs.filter(f => {
      const d = parseISO(f.date);
      return isWithinInterval(d, { start, end });
    });

    const filteredMaints = maintenanceLogs.filter(m => {
      const d = parseISO(m.date);
      return isWithinInterval(d, { start, end });
    });

    const dailyData = days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayLogs = filteredLogs.filter(l => l.date === dayStr);
      const dayExps = filteredExps.filter(e => e.date === dayStr);
      const dayFuels = filteredFuels.filter(f => f.date === dayStr);
      const dayMaints = filteredMaints.filter(m => m.date === dayStr);

      const ganhos = dayLogs.reduce((acc, curr) => acc + curr.gross_amount + (curr.bonus_amount || 0), 0);
      const gastos = dayExps.reduce((acc, curr) => acc + curr.amount, 0) + 
                     dayFuels.reduce((acc, curr) => acc + curr.total_value, 0) + 
                     dayMaints.reduce((acc, curr) => acc + curr.amount, 0);
      const lucro = ganhos - gastos;

      return {
        date: format(day, filter === 'month' ? 'dd/MM' : 'EEE', { locale: ptBR }),
        fullDate: dayStr,
        ganhos,
        gastos,
        lucro
      };
    });

    const totalGanhos = filteredLogs.reduce((acc, curr) => acc + curr.gross_amount + (curr.bonus_amount || 0), 0);
    const totalGastos = filteredExps.reduce((acc, curr) => acc + curr.amount, 0) + 
                        filteredFuels.reduce((acc, curr) => acc + curr.total_value, 0) + 
                        filteredMaints.reduce((acc, curr) => acc + curr.amount, 0);
    const lucroLiquido = totalGanhos - totalGastos;
    const totalKm = filteredLogs.reduce((acc, curr) => acc + curr.km_driven, 0);
    const totalHoras = filteredLogs.reduce((acc, curr) => acc + curr.hours_worked, 0);

    const ganhoKm = totalKm > 0 ? totalGanhos / totalKm : 0;
    const ganhoHora = totalHoras > 0 ? totalGanhos / totalHoras : 0;

    const categoryData = [
      { name: 'Combustível', value: filteredFuels.reduce((acc, curr) => acc + curr.total_value, 0) },
      { name: 'Manutenção', value: filteredMaints.reduce((acc, curr) => acc + curr.amount, 0) },
      { name: 'Outros', value: filteredExps.reduce((acc, curr) => acc + curr.amount, 0) },
    ].filter(c => c.value > 0);

    // Insights
    const insights = [];
    if (totalGanhos > 0) {
      const bestDay = [...dailyData].sort((a, b) => b.lucro - a.lucro)[0];
      if (bestDay && bestDay.lucro > 0) {
        insights.push(`Seu melhor dia foi ${bestDay.date} com R$ ${bestDay.lucro.toFixed(2)} de lucro.`);
      }

      if (categoryData.length > 0) {
        const topExpense = [...categoryData].sort((a, b) => b.value - a.value)[0];
        const percentage = (topExpense.value / totalGastos) * 100;
        insights.push(`Você gastou mais com ${topExpense.name.toLowerCase()} (${percentage.toFixed(0)}% do total de gastos).`);
      }

      if (totalKm > 0) {
        insights.push(`Seu ganho médio por KM é R$ ${ganhoKm.toFixed(2)}.`);
      }

      if (totalHoras > 0) {
        insights.push(`Sua média por hora trabalhada é R$ ${ganhoHora.toFixed(2)}.`);
      }
    }

    return { 
      dailyData, 
      categoryData, 
      totalGanhos, 
      totalGastos, 
      lucroLiquido, 
      totalKm, 
      totalHoras, 
      ganhoKm, 
      ganhoHora,
      insights,
      hasData: filteredLogs.length > 0 || filteredExps.length > 0
    };
  }, [filter, workLogs, expenses, fuelLogs, maintenanceLogs]);

  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

  const filters: { id: FilterType; label: string }[] = [
    { id: 'today', label: 'Hoje' },
    { id: 'yesterday', label: 'Ontem' },
    { id: 'week', label: 'Semana' },
    { id: 'month', label: 'Mês' },
  ];

  return (
    <div className="space-y-8 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-zinc-100 tracking-tight">Relatórios Inteligentes</h2>
          <p className="text-zinc-500 text-sm font-medium">Análise avançada do seu desempenho.</p>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border shadow-lg",
                filter === f.id 
                  ? "bg-emerald-500 text-zinc-950 border-emerald-500 shadow-emerald-500/20" 
                  : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      {!data.hasData ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-zinc-900/20 rounded-[2.5rem] border border-dashed border-zinc-800">
          <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-700">
            <AlertCircle size={32} />
          </div>
          <div>
            <h3 className="text-lg font-black text-zinc-300 uppercase tracking-widest">Nenhum dado disponível</h3>
            <p className="text-zinc-500 text-sm font-medium">Não encontramos registros para o período selecionado.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Resumo Geral */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Ganhos', value: `R$ ${data.totalGanhos.toFixed(2)}`, icon: Wallet, color: 'emerald' },
              { label: 'Gastos', value: `R$ ${data.totalGastos.toFixed(2)}`, icon: ArrowDownRight, color: 'red' },
              { label: 'Lucro Líquido', value: `R$ ${data.lucroLiquido.toFixed(2)}`, icon: TrendingUp, color: 'emerald', highlight: true },
              { label: 'Ganho / KM', value: `R$ ${data.ganhoKm.toFixed(2)}`, icon: Navigation, color: 'blue' },
              { label: 'Ganho / Hora', value: `R$ ${data.ganhoHora.toFixed(2)}`, icon: Clock, color: 'amber' },
            ].map((stat, i) => (
              <div 
                key={i} 
                className={cn(
                  "p-6 rounded-[2rem] space-y-3 relative overflow-hidden group transition-all border",
                  stat.highlight 
                    ? "bg-emerald-500/10 border-emerald-500/20" 
                    : "bg-zinc-900/40 border-zinc-800/50 hover:border-zinc-700/50"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  `bg-${stat.color}-500/10 text-${stat.color}-500`
                )}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                  <h4 className={cn(
                    "font-black tracking-tight",
                    stat.highlight ? "text-3xl text-emerald-400" : "text-xl text-zinc-100"
                  )}>{stat.value}</h4>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Performance Chart */}
            <div className="lg:col-span-2 space-y-6">
              <PageCard className="p-8 rounded-[2.5rem] bg-zinc-900/40 border-zinc-800/50 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Evolução Financeira</h3>
                </div>
                
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.dailyData}>
                      <defs>
                        <linearGradient id="colorGanhos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorLucro" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
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
                        itemStyle={{ fontWeight: 800 }}
                        labelStyle={{ color: '#71717a', marginBottom: '4px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                      />
                      <Legend 
                        verticalAlign="top" 
                        height={36}
                        iconType="circle"
                        formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">{value}</span>}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="ganhos" 
                        name="Ganhos"
                        stroke="#10b981" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorGanhos)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="lucro" 
                        name="Lucro"
                        stroke="#3b82f6" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorLucro)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </PageCard>

              <PageCard className="p-8 rounded-[2.5rem] bg-zinc-900/40 border-zinc-800/50 space-y-8">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Lucro por Período</h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.dailyData}>
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
                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px' }}
                        cursor={{ fill: '#27272a', opacity: 0.4 }}
                      />
                      <Bar 
                        dataKey="lucro" 
                        name="Lucro"
                        radius={[4, 4, 0, 0]}
                      >
                        {data.dailyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.lucro >= 0 ? '#10b981' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </PageCard>
            </div>

            <div className="space-y-6">
              {/* Expenses Distribution */}
              <PageCard className="p-8 rounded-[2.5rem] bg-zinc-900/40 border-zinc-800/50 space-y-8">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Distribuição de Gastos</h3>
                
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
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
                
                <div className="space-y-2">
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
              </PageCard>

              {/* Insights Inteligentes */}
              <PageCard className="p-8 rounded-[2.5rem] bg-emerald-500/5 border-emerald-500/20 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Lightbulb size={64} className="text-emerald-500" />
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                    <Lightbulb size={16} />
                  </div>
                  <h3 className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em]">Insights Inteligentes</h3>
                </div>

                <div className="space-y-4">
                  {data.insights.length > 0 ? (
                    data.insights.map((insight, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <p className="text-sm font-bold text-zinc-300 leading-relaxed">{insight}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm font-bold text-zinc-500 italic">Continue registrando seus dados para receber insights personalizados.</p>
                  )}
                </div>
              </PageCard>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
