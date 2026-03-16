'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  Calendar, 
  MessageSquare, 
  ChevronRight, 
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';
import { LegalDisclaimer } from '../LegalDisclaimer';

interface RequestFormProps {
  prefilledEvent?: {
    id: string;
    name: string;
    location: string;
    date: string;
  };
}

export const RequestForm: React.FC<RequestFormProps> = ({ prefilledEvent }) => {
  const [hasReturn, setHasReturn] = useState(false);
  const [legalAccepted, setLegalAccepted] = useState(false);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass rounded-[40px] overflow-hidden relative">
        <div className="p-8 md:p-14 relative z-10">
          <header className="mb-12">
            <h2 className="text-4xl font-black tracking-tight mb-3 text-white uppercase">Solicitar Transporte</h2>
            <p className="text-neutral-500 font-medium">Preencha os detalhes para que motoristas possam te encontrar.</p>
          </header>

          {/* Event Summary (Prefilled) */}
          {prefilledEvent && (
            <div className="mb-12 p-8 bg-roxou/10 rounded-3xl border border-roxou/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-roxou/20 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-roxou/30 transition-all" />
              <div className="flex items-center gap-2 text-roxou-light text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                <Calendar className="w-3.5 h-3.5" /> Evento Selecionado
              </div>
              <h3 className="text-2xl font-black mb-3 text-white uppercase tracking-tight">{prefilledEvent.name}</h3>
              <div className="space-y-2">
                <p className="text-sm text-neutral-400 flex items-center gap-3 font-medium">
                  <MapPin className="w-4 h-4 text-roxou" /> {prefilledEvent.location}
                </p>
                <p className="text-sm text-neutral-400 flex items-center gap-3 font-medium">
                  <Clock className="w-4 h-4 text-roxou" /> {new Date(prefilledEvent.date).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          )}

          <form className="space-y-10">
            {/* Hidden Fields for Prefilled Data */}
            <input type="hidden" name="eventId" value={prefilledEvent?.id} />
            <input type="hidden" name="eventName" value={prefilledEvent?.name} />
            <input type="hidden" name="eventLocation" value={prefilledEvent?.location} />
            <input type="hidden" name="eventDate" value={prefilledEvent?.date} />

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-neutral-500 uppercase tracking-widest">Ponto de Partida</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-4 w-5 h-5 text-neutral-600" />
                  <input 
                    name="origin"
                    type="text" 
                    placeholder="Ex: Jd. Bongiovani"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-700 focus:ring-2 focus:ring-roxou/20 focus:border-roxou outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-neutral-500 uppercase tracking-widest">Horário de Saída</label>
                <div className="relative">
                  <Clock className="absolute left-5 top-4 w-5 h-5 text-neutral-600" />
                  <input 
                    name="departureTime"
                    type="time" 
                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-700 focus:ring-2 focus:ring-roxou/20 focus:border-roxou outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-neutral-500 uppercase tracking-widest">Notas Adicionais (Opcional)</label>
              <textarea 
                name="notes"
                placeholder="Ex: Somos 3 pessoas, dividimos o valor."
                rows={3}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-neutral-700 focus:ring-2 focus:ring-roxou/20 focus:border-roxou outline-none transition-all resize-none font-medium"
              />
            </div>

            <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-roxou/20 transition-all cursor-pointer group">
              <input 
                type="checkbox" 
                id="hasReturn" 
                name="hasReturn"
                checked={hasReturn}
                onChange={(e) => setHasReturn(e.target.checked)}
                className="w-6 h-6 rounded-lg border-white/10 bg-neutral-900 text-roxou focus:ring-roxou/20 transition-all"
              />
              <label htmlFor="hasReturn" className="text-sm font-bold text-neutral-300 cursor-pointer group-hover:text-white transition-all">
                Preciso de transporte para a volta também
              </label>
            </div>

            <div className="space-y-6 pt-10 border-t border-white/5">
              <div className="flex items-start gap-4">
                <input 
                  type="checkbox" 
                  id="legalAccepted" 
                  name="legalAccepted"
                  checked={legalAccepted}
                  onChange={(e) => setLegalAccepted(e.target.checked)}
                  className="mt-1 w-6 h-6 rounded-lg border-white/10 bg-neutral-900 text-roxou focus:ring-roxou/20 transition-all"
                />
                <label htmlFor="legalAccepted" className="text-[11px] text-neutral-500 leading-relaxed cursor-pointer font-medium hover:text-neutral-400 transition-all">
                  Eu entendo que o <span className="text-roxou-light font-black">Roxou Transporte</span> é apenas uma ferramenta de conexão. 
                  Toda a negociação de valores, segurança e execução do transporte é de responsabilidade direta entre mim e o motorista.
                </label>
              </div>

              <button 
                type="submit"
                disabled={!legalAccepted}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-[0.98] ${
                  legalAccepted 
                  ? 'bg-white text-black hover:bg-roxou hover:text-white shadow-white/5' 
                  : 'bg-neutral-800 text-neutral-600 cursor-not-allowed shadow-none'
                }`}
              >
                Publicar Solicitação <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          <div className="mt-12">
            <LegalDisclaimer variant="compact" />
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center gap-3 justify-center text-neutral-600 text-[10px] font-black uppercase tracking-widest">
        <Info className="w-4 h-4 text-roxou" /> Sua solicitação ficará visível para motoristas aprovados.
      </div>
    </div>
  );
};
