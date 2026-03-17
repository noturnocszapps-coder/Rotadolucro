import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Calendar, ChevronRight } from 'lucide-react';
import { PATCH_NOTES } from '../data/patchNotes';

export const PatchNotes = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16 px-4 md:px-0">
      <header className="pt-8 flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Novidades</h2>
          <p className="text-zinc-500 font-medium">Acompanhe as últimas atualizações do RotaLucro.</p>
        </div>
      </header>

      <div className="space-y-6">
        {PATCH_NOTES.map((note, index) => (
          <div 
            key={note.version}
            className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2rem] p-8 space-y-6 relative overflow-hidden group"
          >
            {note.isNew && (
              <div className="absolute top-0 right-0 bg-emerald-500 text-zinc-950 text-[10px] font-black uppercase tracking-widest px-6 py-1.5 rounded-bl-2xl shadow-lg shadow-emerald-500/20">
                Novo
              </div>
            )}

            <div className="flex items-center gap-3">
              <span className="bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border border-zinc-700/50">
                {note.version}
              </span>
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold">
                <Calendar size={14} />
                {note.date}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                {note.title}
                {note.isNew && <Sparkles size={20} className="text-emerald-500 animate-pulse" />}
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                {note.description}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {note.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3 group/item">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shadow-[0_0_8px_rgba(16,185,129,0.5)] group-hover/item:scale-125 transition-transform" />
                  <span className="text-sm text-zinc-300 font-medium leading-tight">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <footer className="pt-8 text-center">
        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em]">RotaLucro • Evoluindo com você</p>
      </footer>
    </div>
  );
};
