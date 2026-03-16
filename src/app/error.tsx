'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-rose-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-roxou/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-md w-full glass-card p-12 text-center relative z-10">
        <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-10 text-rose-500 border border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.15)]">
          <AlertTriangle className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tight font-display">Erro</h1>
        <p className="text-neutral-500 mb-10 leading-relaxed font-bold text-sm uppercase tracking-widest">
          Não conseguimos processar sua solicitação no momento. 
        </p>
        
        <div className="flex flex-col gap-4">
          <button
            onClick={() => reset()}
            className="w-full bg-white text-black py-6 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-roxou hover:text-white transition-all shadow-2xl active:scale-[0.98]"
          >
            <RefreshCw className="w-4 h-4" /> Tentar Novamente
          </button>
          <Link
            href="/"
            className="w-full bg-white/[0.03] text-neutral-400 py-6 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-white/10 hover:text-white transition-all border border-white/5"
          >
            <Home className="w-4 h-4" /> Voltar para o Início
          </Link>
        </div>
      </div>
    </div>
  );
}
