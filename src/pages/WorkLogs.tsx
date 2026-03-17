import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { PLATFORM_NAMES } from '../constants';
import { 
  Plus, 
  Calendar, 
  Package, 
  Navigation, 
  Clock, 
  DollarSign, 
  ChevronRight,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { PageCard } from '../components/PageCard';
import { BottomSheet } from '../components/BottomSheet';
import { WorkLogDetails } from '../components/WorkLogDetails';
import { WorkLog, PlatformType } from '../types';

export const WorkLogs = () => {
  const { workLogs, deleteWorkLog } = useAppStore();
  const navigate = useNavigate();
  
  const [selectedLog, setSelectedLog] = useState<WorkLog | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [platformFilter, setPlatformFilter] = useState<PlatformType | 'all'>('all');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().substring(0, 7));

  const filteredLogs = useMemo(() => {
    return workLogs.filter(log => {
      const matchesPlatform = platformFilter === 'all' || log.platform_type === platformFilter;
      const matchesDate = log.date.startsWith(dateFilter);
      return matchesPlatform && matchesDate;
    }).sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
  }, [workLogs, platformFilter, dateFilter]);

  const stats = useMemo(() => {
    const totalEarnings = filteredLogs.reduce((acc, curr) => acc + curr.gross_amount + (curr.bonus_amount || 0), 0);
    const totalKm = filteredLogs.reduce((acc, curr) => acc + curr.km_driven, 0);
    const totalHours = filteredLogs.reduce((acc, curr) => acc + curr.hours_worked, 0);
    return { totalEarnings, totalKm, totalHours };
  }, [filteredLogs]);

  const handleLogClick = (log: WorkLog) => {
    setSelectedLog(log);
    setIsActionsOpen(true);
  };

  const handleViewDetails = () => {
    setIsActionsOpen(false);
    setIsDetailsOpen(true);
  };

  const handleEdit = () => {
    if (selectedLog) {
      navigate(`/work-logs/edit/${selectedLog.id}`);
    }
  };

  const handleDeleteClick = () => {
    setIsActionsOpen(false);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedLog) {
      await deleteWorkLog(selectedLog.id);
      setIsDeleteConfirmOpen(false);
      setSelectedLog(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Registros de Trabalho</h2>
          <p className="text-zinc-400 text-sm">Histórico detalhado de turnos e rotas.</p>
        </div>
        <Link to="/work-logs/new" className="bg-emerald-500 text-zinc-950 p-3 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
          <Plus size={24} />
        </Link>
      </header>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-1 flex items-center">
          <select 
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value as any)}
            className="w-full bg-transparent text-zinc-300 text-xs font-bold uppercase tracking-wider p-2 outline-none"
          >
            <option value="all">Todas Plataformas</option>
            <option value="shopee">Shopee</option>
            <option value="mercadolivre">Mercado Livre</option>
            <option value="frete">Frete Particular</option>
          </select>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-1 flex items-center">
          <input 
            type="month" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-transparent text-zinc-300 text-xs font-bold uppercase tracking-wider p-2 outline-none"
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-center">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Ganhos</p>
          <p className="text-sm font-black text-emerald-400">R$ {stats.totalEarnings.toFixed(0)}</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-center">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Distância</p>
          <p className="text-sm font-black text-white">{stats.totalKm.toFixed(0)}km</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-center">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Tempo</p>
          <p className="text-sm font-black text-white">{stats.totalHours.toFixed(0)}h</p>
        </div>
      </div>

      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <PageCard className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto text-zinc-500">
              <Calendar size={32} />
            </div>
            <p className="text-zinc-400">Nenhum registro encontrado.</p>
            <Link to="/work-logs/new" className="text-emerald-400 font-bold hover:underline inline-block">Adicionar primeiro registro</Link>
          </PageCard>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} onClick={() => handleLogClick(log)} className="block cursor-pointer">
              <PageCard className="flex items-center justify-between gap-4 hover:border-zinc-700 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex flex-col items-center justify-center text-emerald-400">
                    <span className="text-[10px] font-bold uppercase">{format(parseISO(log.date), 'MMM', { locale: ptBR })}</span>
                    <span className="text-lg font-bold leading-none">{format(parseISO(log.date), 'dd')}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-100">{PLATFORM_NAMES[log.platform_type]}</h3>
                    <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">
                      <span className="flex items-center gap-1"><Clock size={12} /> {log.hours_worked}h</span>
                      <span className="flex items-center gap-1"><Navigation size={12} /> {log.km_driven}km</span>
                      {(log.packages_count || 0) > 0 && <span className="flex items-center gap-1"><Package size={12} /> {log.packages_count}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-emerald-400 font-bold">R$ {(log.gross_amount + (log.bonus_amount || 0)).toFixed(2)}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Ganhos</p>
                  </div>
                  <MoreVertical size={20} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                </div>
              </PageCard>
            </div>
          ))
        )}
      </div>

      {/* Actions Bottom Sheet */}
      <BottomSheet
        isOpen={isActionsOpen}
        onClose={() => setIsActionsOpen(false)}
        title="Ações do Registro"
      >
        <div className="space-y-3">
          <button
            onClick={handleViewDetails}
            className="w-full flex items-center gap-4 p-5 bg-zinc-800/50 hover:bg-zinc-800 rounded-2xl transition-colors text-white font-bold"
          >
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
              <Eye size={20} />
            </div>
            Ver detalhes
          </button>
          
          <button
            onClick={handleEdit}
            className="w-full flex items-center gap-4 p-5 bg-zinc-800/50 hover:bg-zinc-800 rounded-2xl transition-colors text-white font-bold"
          >
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400">
              <Edit2 size={20} />
            </div>
            Editar
          </button>
          
          <button
            onClick={handleDeleteClick}
            className="w-full flex items-center gap-4 p-5 bg-zinc-800/50 hover:bg-red-500/10 rounded-2xl transition-colors text-red-400 font-bold"
          >
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
              <Trash2 size={20} />
            </div>
            Excluir
          </button>

          <button
            onClick={() => setIsActionsOpen(false)}
            className="w-full p-5 text-zinc-500 font-bold hover:text-white transition-colors"
          >
            Cancelar
          </button>
        </div>
      </BottomSheet>

      {/* Details Bottom Sheet */}
      <BottomSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Detalhes do Registro"
      >
        {selectedLog && <WorkLogDetails log={selectedLog} />}
      </BottomSheet>

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsDeleteConfirmOpen(false)} />
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 w-full max-w-sm relative z-10 space-y-6 text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto">
              <AlertTriangle size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Excluir Registro?</h3>
              <p className="text-zinc-400 text-sm">Esta ação não pode ser desfeita. O registro será removido permanentemente.</p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={confirmDelete}
                className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold hover:bg-red-600 transition-colors"
              >
                Sim, Excluir
              </button>
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="w-full bg-zinc-800 text-white py-4 rounded-2xl font-bold hover:bg-zinc-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
