import React, { useMemo } from 'react';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/useAppStore';
import { PLATFORM_NAMES } from '../constants';
import { PlatformType } from '../types';
import { 
  TrendingUp, 
  DollarSign, 
  Navigation,
  Plus,
  ArrowUpRight,
  Receipt,
  Fuel,
  Wallet,
  Calendar,
  BarChart3,
  Calculator,
  Truck,
  Package,
  Clock,
  ChevronRight,
  Zap,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { format, startOfDay, startOfWeek, startOfMonth, isWithinInterval, endOfDay, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StatCard } from '../components/StatCard';
import { PageCard } from '../components/PageCard';
import { cn } from '../lib/utils';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const { workLogs, expenses, fuelLogs, maintenanceLogs, workProfiles, vehicleSettings } = useAppStore();
  const [platformFilter, setPlatformFilter] = React.useState<PlatformType | 'combined'>('combined');

  const activePlatforms: PlatformType[] = ['shopee', 'mercadolivre', 'frete'];

  // Daily Summary Logic
  const todayStats = useMemo(() => {
    const todayWorkLogs = workLogs.filter(log => isToday(parseISO(log.date)));
    const todayExpenses = expenses.filter(exp => isToday(parseISO(exp.date)));

    const ganhos = todayWorkLogs.reduce((acc, log) => acc + log.gross_amount + (log.bonus_amount || 0), 0);
    const gastos = todayExpenses.reduce((acc, exp) => acc + exp.amount, 0);
    const lucro = ganhos - gastos;

    return {
      ganhos,
      gastos,
      lucro,
      hasActivity: todayWorkLogs.length > 0 || todayExpenses.length > 0
    };
  }, [workLogs, expenses]);

  const metrics = useMemo(() => {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);
    const startOfMn = startOfMonth(today);

    const filterByRange = (items: any[], start: Date, end: Date = today) => 
      items.filter(item => {
        const d = parseISO(item.date);
        const inRange = isWithinInterval(d, { start, end });
        const matchesPlatform = platformFilter === 'combined' || item.platform_type === platformFilter;
        return inRange && matchesPlatform;
      });

    const dailyLogs = filterByRange(workLogs, startOfToday, endOfToday);
    const monthlyLogs = filterByRange(workLogs, startOfMn);
    const monthlyExpenses = filterByRange(expenses, startOfMn);

    const calcGross = (logs: any[]) => logs.reduce((acc, curr) => acc + curr.gross_amount + (curr.bonus_amount || 0), 0);
    const calcExp = (exps: any[]) => exps.reduce((acc, curr) => acc + curr.amount, 0);
    const calcFuel = (fuels: any[]) => fuels.reduce((acc, curr) => acc + curr.total_value, 0);
    const calcMaint = (maints: any[]) => maints.reduce((acc, curr) => acc + curr.amount, 0);

    const dailyGross = calcGross(dailyLogs);
    const monthlyGross = calcGross(monthlyLogs);

    const monthlyVariableExp = calcExp(monthlyExpenses) + calcFuel(filterByRange(fuelLogs, startOfMn)) + calcMaint(filterByRange(maintenanceLogs, startOfMn));
    
    const monthlyFixedCosts = vehicleSettings ? (
      (vehicleSettings.insurance_monthly || 0) + 
      (vehicleSettings.financing_monthly || 0) + 
      ((vehicleSettings.ipva_annual || 0) / 12) + 
      (vehicleSettings.maintenance_monthly || 0) + 
      (vehicleSettings.other_fixed_costs || 0)
    ) : 0;

    const totalMonthlyExp = monthlyVariableExp + monthlyFixedCosts;
    const totalKm = monthlyLogs.reduce((acc, curr) => acc + curr.km_driven, 0);
    const totalHours = monthlyLogs.reduce((acc, curr) => acc + curr.hours_worked, 0);
    const totalPackages = monthlyLogs.reduce((acc, curr) => acc + (curr.packages_count || 0), 0);
    const totalRoutes = monthlyLogs.reduce((acc, curr) => acc + (curr.routes_count || 0), 0);
    
    const costPerKm = totalKm > 0 ? totalMonthlyExp / totalKm : 0;
    const earningsPerKm = totalKm > 0 ? monthlyGross / totalKm : 0;
    const earningsPerHour = totalHours > 0 ? monthlyGross / totalHours : 0;
    const avgFreight = totalRoutes > 0 ? monthlyGross / totalRoutes : 0;

    const platformProfits = activePlatforms.map(p => {
      const pLogs = monthlyLogs.filter(l => l.platform_type === p);
      const gross = calcGross(pLogs);
      return { platform: p as PlatformType, gross };
    }).sort((a, b) => b.gross - a.gross);

    const topPlatform = platformProfits[0]?.gross > 0 ? platformProfits[0].platform : null;

    return {
      dailyGross,
      monthlyGross,
      monthlyExp: totalMonthlyExp,
      fixedCosts: monthlyFixedCosts,
      netProfit: monthlyGross - totalMonthlyExp,
      totalKm,
      totalHours,
      totalPackages,
      totalRoutes,
      costPerKm,
      earningsPerKm,
      earningsPerHour,
      avgFreight,
      topPlatform
    };
  }, [workLogs, expenses, fuelLogs, maintenanceLogs, platformFilter, vehicleSettings]);

  const chartData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = format(d, 'yyyy-MM-dd');
      const dayLogs = workLogs.filter(l => {
        const matchesDay = l.date === dayStr;
        const matchesPlatform = platformFilter === 'combined' || l.platform_type === platformFilter;
        return matchesDay && matchesPlatform;
      });
      const gross = dayLogs.reduce((acc, curr) => acc + curr.gross_amount + (curr.bonus_amount || 0), 0);
      data.push({
        name: format(d, 'EEE', { locale: ptBR }),
        value: gross
      });
    }
    return data;
  }, [workLogs, platformFilter]);

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mb-1">
              {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
            </p>
            <h2 className="text-3xl font-black text-zinc-100 tracking-tight">
              Olá, {user?.displayName?.split(' ')[0] || 'Entregador'}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/5">
            <Wallet size={24} />
          </div>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <button 
            onClick={() => setPlatformFilter('combined')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border shadow-lg",
              platformFilter === 'combined' 
                ? "bg-emerald-500 text-zinc-950 border-emerald-500 shadow-emerald-500/20" 
                : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700"
            )}
          >
            Combinado
          </button>
          {activePlatforms.map(platform => (
            <button 
              key={platform}
              onClick={() => setPlatformFilter(platform)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border shadow-lg",
                platformFilter === platform 
                  ? "bg-emerald-500 text-zinc-950 border-emerald-500 shadow-emerald-500/20" 
                  : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700"
              )}
            >
              {PLATFORM_NAMES[platform]}
            </button>
          ))}
        </div>
      </header>

      {/* Resumo de Hoje - Premium Card */}
      <section className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        <div className="relative bg-zinc-950 border border-zinc-800/50 rounded-[2.5rem] p-8 overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles size={80} className="text-emerald-500" />
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
              <Zap size={20} />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-widest">Resumo de Hoje</h3>
          </div>

          {!todayStats.hasActivity ? (
            <div className="py-4 text-center">
              <p className="text-zinc-500 font-bold italic">Nenhuma atividade registrada hoje.</p>
              <Link 
                to="/work-logs/new"
                className="mt-4 inline-block text-emerald-400 text-xs font-black uppercase tracking-widest hover:underline"
              >
                Começar agora →
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Ganhos</span>
                  <p className="text-2xl font-black text-emerald-400 tabular-nums">
                    R$ {todayStats.ganhos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Gastos</span>
                  <p className="text-2xl font-black text-red-400 tabular-nums">
                    R$ {todayStats.gastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-800/50">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Lucro Líquido</span>
                    <p className={`text-4xl font-black tabular-nums tracking-tighter ${todayStats.lucro >= 0 ? 'text-white' : 'text-red-500'}`}>
                      R$ {todayStats.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border ${
                    todayStats.lucro >= 0 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                    {todayStats.lucro >= 0 ? 'Lucro' : 'Prejuízo'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Ações Rápidas</h3>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          <Link to="/work-logs/new" className="bg-zinc-900 border border-zinc-800/50 p-4 rounded-3xl flex flex-col items-center gap-3 hover:border-emerald-500/50 transition-all group shadow-xl">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <span className="text-[9px] font-black uppercase text-zinc-400 text-center tracking-tighter">Novo Registro</span>
          </Link>
          <Link to="/simulator" className="bg-zinc-900 border border-zinc-800/50 p-4 rounded-3xl flex flex-col items-center gap-3 hover:border-emerald-500/50 transition-all group shadow-xl">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
              <Calculator size={24} />
            </div>
            <span className="text-[9px] font-black uppercase text-zinc-400 text-center tracking-tighter">Simular Rota</span>
          </Link>
          <Link to="/expenses/new" className="bg-zinc-900 border border-zinc-800/50 p-4 rounded-3xl flex flex-col items-center gap-3 hover:border-red-500/50 transition-all group shadow-xl">
            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
              <Receipt size={24} />
            </div>
            <span className="text-[9px] font-black uppercase text-zinc-400 text-center tracking-tighter">Gasto</span>
          </Link>
          <Link to="/fuel/new" className="bg-zinc-900 border border-zinc-800/50 p-4 rounded-3xl flex flex-col items-center gap-3 hover:border-blue-500/50 transition-all group shadow-xl">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <Fuel size={24} />
            </div>
            <span className="text-[9px] font-black uppercase text-zinc-400 text-center tracking-tighter">Abastecer</span>
          </Link>
          <Link to="/freight-calculator" className="bg-zinc-900 border border-zinc-800/50 p-4 rounded-3xl flex flex-col items-center gap-3 hover:border-emerald-500/50 transition-all group shadow-xl">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
              <Truck size={24} />
            </div>
            <span className="text-[9px] font-black uppercase text-zinc-400 text-center tracking-tighter">Calcular Frete</span>
          </Link>
          <Link to="/relatorios" className="bg-zinc-900 border border-zinc-800/50 p-4 rounded-3xl flex flex-col items-center gap-3 hover:border-zinc-500 transition-all group shadow-xl">
            <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:scale-110 transition-transform">
              <BarChart3 size={24} />
            </div>
            <span className="text-[9px] font-black uppercase text-zinc-400 text-center tracking-tighter">Relatórios</span>
          </Link>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Resumo Financeiro</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900 border border-zinc-800/50 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <TrendingUp size={48} className="text-emerald-500" />
            </div>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Hoje</p>
            <h4 className="text-2xl font-black text-zinc-100">R$ {metrics.dailyGross.toFixed(2)}</h4>
          </div>

          <div className="bg-zinc-900 border border-zinc-800/50 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Wallet size={48} className="text-emerald-500" />
            </div>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Lucro Líquido</p>
            <h4 className={cn("text-2xl font-black", metrics.netProfit >= 0 ? "text-emerald-500" : "text-red-500")}>
              R$ {metrics.netProfit.toFixed(2)}
            </h4>
          </div>

          <div className="bg-zinc-900 border border-zinc-800/50 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Receipt size={48} className="text-red-500" />
            </div>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Despesas do Mês</p>
            <h4 className="text-2xl font-black text-zinc-100">R$ {metrics.monthlyExp.toFixed(2)}</h4>
          </div>

          <div className="bg-zinc-900 border border-zinc-800/50 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Navigation size={48} className="text-blue-500" />
            </div>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Ganho por KM</p>
            <h4 className="text-2xl font-black text-zinc-100">R$ {metrics.earningsPerKm.toFixed(2)}</h4>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800/30 p-4 rounded-3xl">
            <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">Ganho por Hora</p>
            <p className="text-lg font-black text-zinc-200">R$ {metrics.earningsPerHour.toFixed(2)}</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800/30 p-4 rounded-3xl">
            <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">Rotas / Entregas</p>
            <p className="text-lg font-black text-zinc-200">{metrics.totalRoutes}</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800/30 p-4 rounded-3xl">
            <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">Total de Pacotes</p>
            <p className="text-lg font-black text-zinc-200">{metrics.totalPackages}</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800/30 p-4 rounded-3xl">
            <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">Frete Médio</p>
            <p className="text-lg font-black text-zinc-200">R$ {metrics.avgFreight.toFixed(2)}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insights */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Inteligência</h3>
          <PageCard className="h-full flex flex-col justify-center border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-8 rounded-[2.5rem]">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-zinc-950 shadow-2xl shadow-emerald-500/20">
                  <TrendingUp size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Destaque</p>
                  <h3 className="text-xl font-black text-zinc-100 tracking-tight">Melhor Performance</h3>
                </div>
              </div>
              
              {metrics.topPlatform ? (
                <div className="space-y-3">
                  <h4 className="text-4xl font-black text-zinc-100 tracking-tighter">{PLATFORM_NAMES[metrics.topPlatform]}</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">Sua maior fonte de receita este mês. Continue focando aqui para maximizar seus lucros.</p>
                  <Link to="/relatorios" className="inline-flex items-center gap-2 text-emerald-500 font-black uppercase text-[10px] tracking-widest hover:gap-3 transition-all pt-2">
                    Análise Completa <ChevronRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-zinc-500 text-sm italic">Inicie seus registros para gerar insights inteligentes.</p>
                </div>
              )}
            </div>
          </PageCard>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Desempenho Semanal</h3>
            <Link to="/relatorios" className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline">
              Ver Detalhes
            </Link>
          </div>
          <PageCard className="p-8 rounded-[2.5rem] bg-zinc-900/40 border-zinc-800/50">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#71717a" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                    fontFamily="Inter"
                    fontWeight={700}
                  />
                  <YAxis 
                    stroke="#71717a" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(v) => `R$${v}`} 
                    fontFamily="Inter"
                    fontWeight={700}
                  />
                  <Tooltip 
                    cursor={{ fill: '#27272a', opacity: 0.4 }}
                    contentStyle={{ 
                      backgroundColor: '#09090b', 
                      border: '1px solid #27272a', 
                      borderRadius: '16px',
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                    }}
                    itemStyle={{ color: '#10b981', fontWeight: 900, fontSize: '12px' }}
                    labelStyle={{ color: '#71717a', marginBottom: '4px', fontWeight: 700, fontSize: '10px' }}
                  />
                  <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PageCard>
        </div>
      </div>
    </div>
  );
};
