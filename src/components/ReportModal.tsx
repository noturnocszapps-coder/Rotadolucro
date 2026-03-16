'use client';

import React, { useState } from 'react';
import { createReport } from '@/actions/moderation';
import { REPORT_REASONS } from '@/constants';
import { AlertTriangle, X, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportedId: string;
  contextType: 'chat' | 'connection' | 'request';
  contextId: string;
  reportedName: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  reportedId,
  contextType,
  contextId,
  reportedName
}) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    setIsSubmitting(true);
    try {
      await createReport({
        reported_id: reportedId,
        reason,
        details,
        context_type: contextType,
        context_id: contextId
      });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setReason('');
        setDetails('');
      }, 2000);
    } catch (error: any) {
      alert(error.message || 'Erro ao enviar denúncia');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
                    <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md glass-card overflow-hidden"
          >
            {isSuccess ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight font-display">Denúncia Enviada</h3>
                <p className="text-neutral-500 text-sm font-bold">Nossa equipe de moderação analisará o caso em breve.</p>
              </div>
            ) : (
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight font-display">Denunciar</h3>
                      <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">{reportedName}</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-all text-neutral-600 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Motivo</label>
                    <div className="relative">
                      <select
                        required
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full p-4 rounded-xl bg-white/[0.03] border border-white/5 text-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-xs font-bold appearance-none"
                      >
                        <option value="" className="bg-neutral-900">Selecione um motivo...</option>
                        <option value={REPORT_REASONS.INAPPROPRIATE_BEHAVIOR} className="bg-neutral-900">Comportamento Inadequado</option>
                        <option value={REPORT_REASONS.HARASSMENT} className="bg-neutral-900">Assédio</option>
                        <option value={REPORT_REASONS.SCAM} className="bg-neutral-900">Fraude / Golpe</option>
                        <option value={REPORT_REASONS.SAFETY_CONCERN} className="bg-neutral-900">Preocupação com Segurança</option>
                        <option value={REPORT_REASONS.NO_SHOW} className="bg-neutral-900">Não comparecimento</option>
                        <option value={REPORT_REASONS.OTHER} className="bg-neutral-900">Outro</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-600">
                        <X className="w-4 h-4 rotate-45" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Detalhes (Opcional)</label>
                    <textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Descreva o que aconteceu..."
                      className="w-full h-32 p-4 rounded-xl bg-white/[0.03] border border-white/5 text-white placeholder:text-neutral-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-xs font-bold resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !reason}
                    className="w-full bg-rose-500 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-rose-600 transition-all shadow-2xl shadow-rose-500/20 disabled:opacity-50 flex items-center justify-center gap-2 group active:scale-[0.98]"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>
                        Enviar Denúncia
                        <AlertTriangle className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
