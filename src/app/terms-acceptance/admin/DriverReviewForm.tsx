'use client';

import React, { useState } from 'react';
import { updateDriverApplication } from '@/actions/admin';
import { DRIVER_STATUS } from '@/constants';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DriverReviewFormProps {
  driverId: string;
  initialStatus: string;
  initialNotes: string;
}

export const DriverReviewForm: React.FC<DriverReviewFormProps> = ({ 
  driverId, 
  initialStatus, 
  initialNotes 
}) => {
  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState(initialNotes);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateDriverApplication(driverId, status as any, notes);
      router.push('/admin/dashboard');
    } catch (error: any) {
      alert(error.message || 'Erro ao atualizar aplicação');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="glass-card p-8">
        <h3 className="text-xl font-black text-white mb-8 uppercase tracking-tight font-display">Decisão de Aprovação</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <button
            type="button"
            onClick={() => setStatus(DRIVER_STATUS.APPROVED)}
            className={`flex items-center justify-center gap-4 p-6 rounded-2xl border-2 transition-all font-black uppercase tracking-widest text-[11px] ${
              status === DRIVER_STATUS.APPROVED 
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                : 'border-white/5 bg-white/[0.02] text-neutral-500 hover:border-white/10'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            Aprovar Motorista
          </button>

          <button
            type="button"
            onClick={() => setStatus(DRIVER_STATUS.REJECTED)}
            className={`flex items-center justify-center gap-4 p-6 rounded-2xl border-2 transition-all font-black uppercase tracking-widest text-[11px] ${
              status === DRIVER_STATUS.REJECTED 
                ? 'border-rose-500 bg-rose-500/10 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.1)]' 
                : 'border-white/5 bg-white/[0.02] text-neutral-500 hover:border-white/10'
            }`}
          >
            <XCircle className="w-5 h-5" />
            Rejeitar Aplicação
          </button>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-1">
            Notas Internas / Motivo da Rejeição
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Adicione observações sobre os documentos ou o motivo da decisão..."
            className="w-full h-32 p-6 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-neutral-700 focus:ring-2 focus:ring-roxou/20 focus:border-roxou outline-none transition-all text-xs font-bold resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] text-neutral-500 hover:text-white transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-roxou hover:text-white transition-all shadow-2xl disabled:opacity-50 flex items-center gap-3 active:scale-[0.98]"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Salvar Decisão
        </button>
      </div>
    </form>
  );
};
