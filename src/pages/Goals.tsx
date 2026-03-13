import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Target, Plus, ChevronRight, CheckCircle2, TrendingUp, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { PageCard } from '../components/PageCard';
import { StatCard } from '../components/StatCard';

export const Goals = () => {
  const { goals, workLogs, updateGoal } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newGoalAmount, setNewGoalAmount] = useState('');

  const currentMonth = new Date();
  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);

  const currentMonthLogs = workLogs.filter(l => {
    const logDate = new Date(l.date);
    return logDate >= start && logDate <= end;
  });

  const totalEarnings = currentMonthLogs.reduce((acc, curr) => acc + curr.gross_amount + (curr.bonus_amount || 0), 0);
  
  const activeGoal = goals.find(g => g.active) || { target_amount: 0, current_amount: 0 };
  const progress = activeGoal.target_amount > 0 ? (totalEarnings / activeGoal.target_amount) * 100 : 0;

  const handleSaveGoal = async () => {
    const amount = parseFloat(newGoalAmount);
    if (!isNaN(amount) && amount > 0) {
      await updateGoal({
        target_amount: amount,
        current_amount: totalEarnings,
        month: format(currentMonth, 'yyyy-MM'),
        active: true
      });
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Metas Financeiras</h2>
          <p className="text-zinc-400 text-sm">Acompanhe seus objetivos para este mês.</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 flex items-center gap-2 text-sm">
          <Calendar size={16} className="text-zinc-500" />
          <span className="font-bold uppercase text-zinc-100">{format(currentMonth, 'MMMM yyyy', { locale: ptBR })}</span>
        </div>
      </header>

      {/* Main Goal Card */}
      <PageCard className="p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Target size={120} />
        </div>

        <div className="relative z-10 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Meta Mensal</p>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={newGoalAmount}
                    onChange={(e) => setNewGoalAmount(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-2xl font-bold w-40 focus:outline-none focus:border-emerald-500 text-zinc-100"
                    placeholder="0.00"
                  />
                  <button onClick={handleSaveGoal} className="bg-emerald-500 text-zinc-950 px-4 py-2 rounded-xl font-bold hover:bg-emerald-600 transition-colors">Salvar</button>
                  <button onClick={() => setIsEditing(false)} className="text-zinc-500 font-bold px-2 hover:text-zinc-400 transition-colors">Cancelar</button>
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-zinc-100">R$ {activeGoal.target_amount.toFixed(2)}</span>
                  <button onClick={() => {
                    setNewGoalAmount(activeGoal.target_amount.toString());
                    setIsEditing(true);
                  }} className="text-xs text-emerald-400 font-bold hover:underline">Alterar</button>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Progresso</p>
              <p className="text-4xl font-bold text-emerald-400">{Math.min(100, progress).toFixed(1)}%</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-4 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(100, progress)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm font-bold">
              <span className="text-zinc-400">R$ {totalEarnings.toFixed(2)} alcançados</span>
              <span className="text-zinc-500">Faltam R$ {Math.max(0, activeGoal.target_amount - totalEarnings).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </PageCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard 
          label="Média Diária Necessária" 
          value={`R$ ${((activeGoal.target_amount - totalEarnings) / Math.max(1, (end.getDate() - currentMonth.getDate()))).toFixed(2)}`} 
          color="blue"
          icon={<TrendingUp size={18} />}
        />
        <StatCard 
          label="Dias Restantes" 
          value={`${end.getDate() - currentMonth.getDate()} dias`} 
          color="emerald"
          icon={<CheckCircle2 size={18} />}
        />
      </div>

      {/* History Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest px-2">Histórico de Metas</h3>
        <PageCard className="p-0 overflow-hidden">
          <div className="divide-y divide-zinc-800">
            {goals.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">Nenhuma meta anterior registrada.</div>
            ) : (
              goals.map((goal, index) => (
                <div key={index} className="p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400">
                      <Target size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-zinc-100">{goal.month}</p>
                      <p className="text-xs text-zinc-500">Meta: R$ {goal.target_amount.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${goal.current_amount >= goal.target_amount ? 'text-emerald-400' : 'text-zinc-400'}`}>
                      R$ {goal.current_amount.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">
                      {((goal.current_amount / goal.target_amount) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </PageCard>
      </div>
    </div>
  );
};
