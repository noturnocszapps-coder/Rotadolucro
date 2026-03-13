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
  Calculator
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
import { format, startOfDay, startOfWeek, startOfMonth, isWithinInterval, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StatCard } from '../components/StatCard';
import { PageCard } from '../components/PageCard';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Dashboard = () => {
  const { user } = useAuthStore();
  const { workLogs, expenses, fuelLogs, maintenanceLogs, workProfiles, vehicleSettings } = useAppStore();
  const [platformFilter, setPlatformFilter] = React.useState<PlatformType | 'combined'>('combined');

  const metrics = useMemo(() => {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);
    const startOfMn = startOfMonth(today);

    const filterByRange = (items: any[], start: Date, end: Date = today) => 
      items.filter(item => {
        const d = new Date(item.date);
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
      monthlyGross,
      monthlyExp: totalMonthlyExp,
      fixedCosts: monthlyFixedCosts,
      netProfit: monthlyGross - totalMonthlyExp,
      totalKm,
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
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Painel de Controle</h2>
          <p className="text-zinc-400 text-sm">Bem-vindo de volta, {user?.displayName?.split(' ')[0] || 'Entregador'}.</p>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setPlatformFilter('combined')}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border",
              platformFilter === 'combined' 
                ? "bg-emerald-500 text-zinc-950 border-emerald-500" 
                : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
            )}
          >
            Combinado
          </button>
          {workProfiles.map(p => (
            <button 
              key={p.id}
              onClick={() => setPlatformFilter(p.platform_type)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border",
                platformFilter === p.platform_type 
                  ? "bg-emerald-500 text-zinc-950 border-emerald-500" 
                  : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
              )}
            >
              {PLATFORM_NAMES[p.platform_type]}
            </button>
          ))}
        </div>
      </header>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link to="/work-logs/new" className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center gap-2 hover:border-emerald-500/50 transition-all group">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Plus size={20} />
          </div>
          <span className="text-[10px] font-bold uppercase text-zinc-400 text-center">Novo Registro</span>
        </Link>
        <Link to="/simulator" className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center gap-2 hover:border-emerald-500/50 transition-all group">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <Calculator size={20} />
          </div>
          <span className="text-[10px] font-bold uppercase text-zinc-400 text-center">Simular Rota</span>
        </Link>
        <Link to="/expenses/new" className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center gap-2 hover:border-red-500/50 transition-all group">
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
            <Receipt size={20} />
          </div>
          <span className="text-[10px] font-bold uppercase text-zinc-400 text-center">Gasto</span>
        </Link>
        <Link to="/fuel/new" className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center gap-2 hover:border-blue-500/50 transition-all group">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
            <Fuel size={20} />
          </div>
          <span className="text-[10px] font-bold uppercase text-zinc-400 text-center">Abastecer</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Hoje" 
          value={`R$ ${metrics.dailyGross.toFixed(2)}`} 
          icon={<Calendar size={18} />}
          color="emerald"
        />
        <StatCard 
          label="Despesas (Mês)" 
          value={`R$ ${metrics.monthlyExp.toFixed(2)}`} 
          icon={<Receipt size={18} />}
          color="red"
        />
        <StatCard 
          label="Lucro Líquido" 
          value={`R$ ${metrics.netProfit.toFixed(2)}`} 
          icon={<Wallet size={18} />}
          color={metrics.netProfit >= 0 ? "emerald" : "red"}
        />
        <StatCard 
          label="Custo por KM" 
          value={`R$ ${metrics.costPerKm.toFixed(2)}`} 
          icon={<Navigation size={18} />}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most Profitable Platform */}
        <PageCard className="lg:col-span-1 flex flex-col justify-center border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500 rounded-xl text-zinc-950">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Destaque do Mês</p>
                <h3 className="text-lg font-bold">Plataforma mais lucrativa</h3>
              </div>
            </div>
            
            {metrics.topPlatform ? (
              <div className="pt-4 space-y-2">
                <h4 className="text-3xl font-black text-zinc-100">{PLATFORM_NAMES[metrics.topPlatform]}</h4>
                <p className="text-zinc-400 text-sm">Responsável pela maior parte dos seus ganhos brutos este mês.</p>
              </div>
            ) : (
              <p className="text-zinc-500 text-sm pt-4 italic">Nenhum dado registrado este mês.</p>
            )}
          </div>
        </PageCard>

        {/* Monthly Summary Chart */}
        <PageCard className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <BarChart3 size={20} className="text-emerald-500" />
              Resumo dos Últimos 7 Dias
            </h3>
            <Link to="/reports" className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1">
              Ver Relatórios <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                <Tooltip 
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PageCard>
      </div>
    </div>
  );
};
