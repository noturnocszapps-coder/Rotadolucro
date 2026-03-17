import React from 'react';
import { Truck } from 'lucide-react';

export const SplashScreen = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
        <div className="relative bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-zinc-950 shadow-lg shadow-emerald-500/20 animate-bounce">
            <Truck size={32} strokeWidth={2.5} />
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col items-center gap-3">
        <h1 className="text-2xl font-black text-white tracking-tighter">RotaLucro</h1>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Carregando sua operação...</span>
        </div>
      </div>

      <div className="fixed bottom-12 left-0 right-0 flex justify-center">
        <div className="w-48 h-1 bg-zinc-900 rounded-full overflow-hidden">
          <div className="w-full h-full bg-emerald-500 origin-left animate-[loading_2s_ease-in-out_infinite]" />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};
