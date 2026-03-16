import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DisclaimerProps {
  variant?: 'compact' | 'full';
}

export const LegalDisclaimer: React.FC<DisclaimerProps> = ({ variant = 'full' }) => {
  return (
    <div className={`bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6 ${variant === 'compact' ? 'text-[9px]' : 'text-[11px]'} text-amber-500/70`}>
      <div className="flex items-start gap-4">
        <AlertCircle className="w-5 h-5 text-amber-500/60 shrink-0" />
        <div>
          <p className="font-black mb-2 uppercase tracking-[0.2em] text-amber-500">Aviso Legal — RotaLucro</p>
          <p className="leading-relaxed font-bold uppercase tracking-widest opacity-80">
            O RotaLucro é uma plataforma de inteligência logística e gestão financeira. 
            <span className="text-amber-500"> Não somos uma empresa de transporte e não possuímos frota própria.</span> 
            A plataforma é uma ferramenta de auxílio à gestão para profissionais autônomos.
            Uma solução desenvolvida pela <a href="https://www.ntaplicacoes.com.br" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">NT Aplicações</a>.
          </p>
        </div>
      </div>
    </div>
  );
};
