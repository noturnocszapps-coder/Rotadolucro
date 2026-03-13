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
  Line
} from 'recharts';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Filter, Download } from 'lucide-react';

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

    const platformData = Object.keys(PLATFORM_NAMES).map(p => {
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
    }).filter(p => p.value > 0);

    const totalGross = filteredLogs.reduce((acc, curr) => acc + curr.gross_amount + (curr.bonus_amount || 0), 0);
    const totalExp = filteredExps.reduce((acc, curr) => acc + curr.amount, 0) + 
                     filteredFuels.reduce((acc, curr) => acc + curr.total_value, 0) + 
                     filteredMaints.reduce((acc, curr) => acc + curr.amount, 0);

    // Fixed cost allocation
    const monthlyFixedCosts = (vehicleSettings?.insurance_monthly || 0) + 
                             (vehicleSettings?.financing_monthly || 0) + 
                             (vehicleSettings?.maintenance_monthly || 0) + 
                             (vehicleSettings?.other_fixed_costs || 0);
    
    const allocatedFixedCosts = monthlyFixedCosts;
    const totalKm = filteredLogs.reduce((acc, curr) => acc + curr.km_driven, 0);
    const costPerKm = totalKm > 0 ? (totalExp + allocatedFixedCosts) / totalKm : 0;

    return { dailyData, categoryData, platformData, totalGross, totalExp, allocatedFixedCosts, totalKm, costPerKm };
  }, [month, workLogs, expenses, fuelLogs, maintenanceLogs, vehicleSettings]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-zinc-400">Análise detalhada do seu desempenho em {format(month, 'MMMM', { locale: ptBR })}.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-100"
          >
            Anterior
          </button>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 flex items-center gap-2 text-sm">
            <Calendar size={16} className="text-zinc-500" />
            <span className="font-bold uppercase">{format(month, 'MMMM yyyy', { locale: ptBR })}</span>
          </div>
          <button 
            onClick={() => setMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-100"
          >
            Próximo
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-1">
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Ganhos Brutos</p>
          <p className="text-3xl font-bold text-emerald-500">R$ {data.totalGross.toFixed(2)}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-1">
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Km Rodados</p>
          <p className="text-3xl font-bold text-blue-500">{data.totalKm.toFixed(1)} <span className="text-sm font-normal text-zinc-500">KM</span></p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-1">
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Custo por KM</p>
          <p className="text-3xl font-bold text-amber-500">R$ {data.costPerKm.toFixed(2)}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-1">
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Lucro Líquido</p>
          <p className="text-3xl font-bold text-zinc-100">R$ {(data.totalGross - data.totalExp - data.allocatedFixedCosts).toFixed(2)}</p>
        </div>
      </div>

      {/* Platform Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.platformData.map((p, idx) => (
          <div key={p.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-zinc-100">{p.name}</h4>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Ganhos</p>
                <p className="text-lg font-bold text-emerald-500">R$ {p.value.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Média/Entrega</p>
                <p className="text-lg font-bold text-zinc-100">R$ {p.avgPerDelivery.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Earnings Chart */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6">
          <h3 className="font-bold text-lg">Ganhos Diários</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Line type="monotone" dataKey="ganhos" stroke="#10b981" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6">
          <h3 className="font-bold text-lg">Distribuição de Gastos</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {data.categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs text-zinc-400 font-medium">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Profit by Platform */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6">
          <h3 className="font-bold text-lg">Ganhos por Plataforma</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.platformData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                <XAxis type="number" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KM Trend */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6">
          <h3 className="font-bold text-lg">Km Rodados por Dia</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Bar dataKey="km" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
