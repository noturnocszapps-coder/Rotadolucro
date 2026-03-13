import React, { useMemo } from 'react';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/useAppStore';
import { PLATFORM_NAMES } from '../constants';
import { PlatformType } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Clock, 
  Navigation,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  BarChart3,
  Fuel
} from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { format, startOfDay, startOfWeek, startOfMonth, isWithinInterval, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const StatCard = ({ label, value, icon: Icon, trend, trendValue, color = "emerald" }: any) => (
  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-500`}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trendValue}
        </div>
      )}
    </div>
    <div>
      <p className="text-zinc-400 text-sm font-medium">{label}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
  </div>
);

export const Dashboard = () => {
  const { user } = useAuthStore();
  const { workLogs, expenses, fuelLogs, maintenanceLogs, workProfiles, vehicleSettings } = useAppStore();
  const [platformFilter, setPlatformFilter] = React.useState<PlatformType | 'combined'>('combined');

  const metrics = useMemo(() => {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);
    const startOfWk = startOfWeek(today, { weekStartsOn: 1 });
    const startOfMn = startOfMonth(today);

    const filterByRange = (items: any[], start: Date, end: Date = today) => 
      items.filter(item => {
        const d = new Date(item.date);
        const inRange = isWithinInterval(d, { start, end });
        const matchesPlatform = platformFilter === 'combined' || item.platform_type === platformFilter;
        return inRange && matchesPlatform;
      });

    const dailyLogs = filterByRange(workLogs, startOfToday, endOfToday);
    const weeklyLogs = filterByRange(workLogs, startOfWk);
    const monthlyLogs = filterByRange(workLogs, startOfMn);

    const monthlyExpenses = filterByRange(expenses, startOfMn);

    const calcGross = (logs: any[]) => logs.reduce((acc, curr) => acc + curr.gross_amount + (curr.bonus_amount || 0), 0);
    const calcExp = (exps: any[]) => exps.reduce((acc, curr) => acc + curr.amount, 0);
    const calcFuel = (fuels: any[]) => fuels.reduce((acc, curr) => acc + curr.total_value, 0);
    const calcMaint = (maints: any[]) => maints.reduce((acc, curr) => acc + curr.amount, 0);

    const dailyGross = calcGross(dailyLogs);
    const weeklyGross = calcGross(weeklyLogs);
    const monthlyGross = calcGross(monthlyLogs);

    const monthlyVariableExp = calcExp(monthlyExpenses) + calcFuel(filterByRange(fuelLogs, startOfMn)) + calcMaint(filterByRange(maintenanceLogs, startOfMn));
    
    const monthlyFixedCosts = vehicleSettings ? (
      vehicleSettings.insurance_monthly + 
      vehicleSettings.financing_monthly + 
      (vehicleSettings.ipva_annual / 12) + 
      vehicleSettings.maintenance_monthly + 
      vehicleSettings.other_fixed_costs
    ) : 0;

    const totalMonthlyExp = monthlyVariableExp + monthlyFixedCosts;
    const totalKm = monthlyLogs.reduce((acc, curr) => acc + curr.km_driven, 0);
    const costPerKm = totalKm > 0 ? totalMonthlyExp / totalKm : 0;

    const platformProfits = Object.keys(PLATFORM_NAMES).map(p => {
      const pLogs = monthlyLogs.filter(l => l.platform_type === p);
      const gross = calcGross(pLogs);
      return { platform: p as PlatformType, gross };
    }).sort((a, b) => b.gross - a.gross);

    const topPlatform = platformProfits[0]?.gross > 0 ? platformProfits[0].platform : null;

    return {
      dailyGross,
      weeklyGross,
      monthlyGross,
      monthlyExp: totalMonthlyExp,
      fixedCosts: monthlyFixedCosts,
      netProfit: monthlyGross - totalMonthlyExp,
      totalDeliveries: monthlyLogs.reduce((acc, curr) => acc + curr.deliveries_count, 0),
      totalKm,
      totalHours: monthlyLogs.reduce((acc, curr) => acc + curr.hours_worked, 0),
      costPerKm,
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
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Olá, {user?.displayName?.split(' ')[0] || 'Entregador'}! 👋</h1>
          <p className="text-zinc-400">Resumo de {format(new Date(), 'MMMM', { locale: ptBR })}.</p>
        </div>
        
        {/* Platform Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setPlatformFilter('combined')}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap",
              platformFilter === 'combined' ? "bg-emerald-500 text-zinc-950" : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700"
            )}
          >
            Combinado
          </button>
          {workProfiles.map(p => (
            <button 
              key={p.id}
              onClick={() => setPlatformFilter(p.platform_type)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                platformFilter === p.platform_type ? "bg-emerald-500 text-zinc-950" : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-zinc-700"
              )}
            >
              {PLATFORM_NAMES[p.platform_type]}
            </button>
          ))}
        </div>
      </header>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        <Link to="/work-logs/new" className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center gap-2 hover:border-emerald-500/50 transition-all group">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Plus size={20} />
          </div>
          <span className="text-[10px] font-bold uppercase text-zinc-400">Novo Registro</span>
        </Link>
        <Link to="/expenses/new" className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center gap-2 hover:border-red-500/50 transition-all group">
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
            <Receipt size={20} />
          </div>
          <span className="text-[10px] font-bold uppercase text-zinc-400">Gasto</span>
        </Link>
        <Link to="/fuel/new" className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center gap-2 hover:border-blue-500/50 transition-all group">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
            <Fuel size={20} />
          </div>
          <span className="text-[10px] font-bold uppercase text-zinc-400">Abastecer</span>
        </Link>
      </div>

      {/* Highlights Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.topPlatform && (
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 p-6 rounded-3xl flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Plataforma mais lucrativa</p>
              <h3 className="text-2xl font-bold text-zinc-100">{PLATFORM_NAMES[metrics.topPlatform]}</h3>
              <p className="text-xs text-zinc-400">R$ {metrics.monthlyGross.toFixed(2)} este mês</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-zinc-950 shadow-lg shadow-emerald-500/20">
              <TrendingUp size={24} />
            </div>
          </div>
        )}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 p-6 rounded-3xl flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">Custo por KM Atual</p>
            <h3 className="text-2xl font-bold text-zinc-100">R$ {metrics.costPerKm.toFixed(2)}</h3>
            <p className="text-xs text-zinc-400">Baseado nos gastos do mês</p>
          </div>
          <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-zinc-950 shadow-lg shadow-blue-500/20">
            <Navigation size={24} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard 
          label="Ganhos Hoje" 
          value={`R$ ${metrics.dailyGross.toFixed(2)}`} 
          icon={DollarSign} 
          color="emerald"
        />
        <StatCard 
          label="Ganhos na Semana" 
          value={`R$ ${metrics.weeklyGross.toFixed(2)}`} 
          icon={Package} 
          color="blue"
        />
        <StatCard 
          label="Ganhos no Mês" 
          value={`R$ ${metrics.monthlyGross.toFixed(2)}`} 
          icon={BarChart3} 
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Ganhos nos Últimos 7 Dias</h3>
            <Link to="/reports" className="text-xs font-bold text-emerald-500 hover:underline">Ver Relatórios</Link>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6">
          <h3 className="font-bold text-lg">Resumo Financeiro (Mês)</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Ganhos Brutos</span>
              <span className="font-bold text-emerald-500">R$ {metrics.monthlyGross.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Custos Fixos</span>
              <span className="font-bold text-red-400">- R$ {metrics.fixedCosts.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Custos Variáveis</span>
              <span className="font-bold text-red-400">- R$ {(metrics.monthlyExp - metrics.fixedCosts).toFixed(2)}</span>
            </div>
            <div className="pt-4 border-t border-zinc-800 flex justify-between text-base">
              <span className="font-bold">Lucro Líquido</span>
              <span className={`font-bold ${metrics.netProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                R$ {metrics.netProfit.toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-zinc-800 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Km Rodados</p>
              <p className="text-xl font-bold">{metrics.totalKm.toFixed(1)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Horas Online</p>
              <p className="text-xl font-bold">{metrics.totalHours.toFixed(1)}h</p>
            </div>
          </div>

          <Link to="/reports" className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all">
            Ver Relatórios Completos <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
