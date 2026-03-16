'use client';

import React, { useState } from 'react';
import { resolveReport } from '@/actions/moderation';
import { MODERATION_ACTIONS } from '@/constants';
import { ShieldAlert, CheckCircle, XCircle, AlertTriangle, Loader2, Ban, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ModerationActionFormProps {
  reportId: string;
}

export const ModerationActionForm: React.FC<ModerationActionFormProps> = ({ reportId }) => {
  const [action, setAction] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!action || !notes) return;

    setIsSubmitting(true);
    try {
      await resolveReport({
        report_id: reportId,
        action: action as any,
        notes
      });
      router.push('/admin/reports');
    } catch (error: any) {
      alert(error.message || 'Erro ao processar ação');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="glass-card p-8">
        <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tight font-display">
          <ShieldAlert className="w-6 h-6 text-rose-500" />
          Ação de Moderação
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <button
            type="button"
            onClick={() => setAction(MODERATION_ACTIONS.RESOLVE)}
            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${
              action === MODERATION_ACTIONS.RESOLVE 
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                : 'border-white/5 bg-white/[0.02] text-neutral-500 hover:border-white/10'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Resolver</span>
          </button>

          <button
            type="button"
            onClick={() => setAction(MODERATION_ACTIONS.WARN)}
            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${
              action === MODERATION_ACTIONS.WARN 
                ? 'border-amber-500 bg-amber-500/10 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]' 
                : 'border-white/5 bg-white/[0.02] text-neutral-500 hover:border-white/10'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Advertir</span>
          </button>

          <button
            type="button"
            onClick={() => setAction(MODERATION_ACTIONS.SUSPEND)}
            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${
              action === MODERATION_ACTIONS.SUSPEND 
                ? 'border-orange-500 bg-orange-500/10 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]' 
                : 'border-white/5 bg-white/[0.02] text-neutral-500 hover:border-white/10'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Suspender</span>
          </button>

          <button
            type="button"
            onClick={() => setAction(MODERATION_ACTIONS.BLOCK)}
            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${
              action === MODERATION_ACTIONS.BLOCK 
                ? 'border-rose-500 bg-rose-500/10 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.1)]' 
                : 'border-white/5 bg-white/[0.02] text-neutral-500 hover:border-white/10'
            }`}
          >
            <Ban className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Bloquear</span>
          </button>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-1">Justificativa da Ação</label>
          <textarea
            required
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Descreva o motivo da decisão e as evidências encontradas..."
            className="w-full h-32 p-6 rounded-2xl bg-white/[0.03] border border-white/5 text-white placeholder:text-neutral-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-xs font-bold resize-none"
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
          disabled={isSubmitting || !action || !notes}
          className="bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-rose-500 hover:text-white transition-all shadow-2xl disabled:opacity-50 flex items-center gap-3 active:scale-[0.98]"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Aplicar Medida
        </button>
      </div>
    </form>
  );
};
