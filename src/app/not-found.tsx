import { Search, Home } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-roxou/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-roxou/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-md w-full glass-card p-12 text-center relative z-10">
        <div className="w-24 h-24 bg-roxou/10 rounded-full flex items-center justify-center mx-auto mb-10 text-roxou border border-roxou/20 shadow-[0_0_30px_rgba(124,58,237,0.15)]">
          <Search className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tight font-display">404</h1>
        <p className="text-neutral-500 mb-10 leading-relaxed font-bold text-sm uppercase tracking-widest">
          O caminho que você está procurando não existe ou foi movido.
        </p>
        
        <Link
          href="/"
          className="w-full bg-white text-black py-6 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-roxou hover:text-white transition-all shadow-2xl active:scale-[0.98]"
        >
          <Home className="w-4 h-4" /> Voltar para o Início
        </Link>
      </div>
    </div>
  );
}
