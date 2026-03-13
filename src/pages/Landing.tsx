import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShieldCheck, Clock, Smartphone, ChevronRight } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-emerald-500 tracking-tight">RotaLucro</h1>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-emerald-500 transition-colors">Entrar</Link>
            <Link to="/register" className="bg-emerald-500 text-zinc-950 px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-600 transition-all">Criar Conta</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            Alpha Version 1.0
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
            Saiba exatamente quanto você <span className="text-emerald-500">ganha por entrega.</span>
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
            A primeira plataforma de gestão financeira feita por entregadores para entregadores. iFood, Shopee e Mercado Livre em um só lugar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/register" className="w-full sm:w-auto bg-emerald-500 text-zinc-950 px-8 py-4 rounded-xl text-lg font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
              Começar Agora <ChevronRight size={20} />
            </Link>
            <Link to="/login" className="w-full sm:w-auto border border-zinc-800 px-8 py-4 rounded-xl text-lg font-bold hover:bg-zinc-800 transition-all">
              Já tenho conta
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold">Lucro Real</h3>
            <p className="text-zinc-400">Calcule seu ganho líquido descontando combustível, manutenção e taxas do veículo.</p>
          </div>
          <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
              <Smartphone size={24} />
            </div>
            <h3 className="text-xl font-bold">Multi-Plataforma</h3>
            <p className="text-zinc-400">Suporte completo para iFood, Shopee Entregas e Mercado Livre Entregas.</p>
          </div>
          <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold">Controle Total</h3>
            <p className="text-zinc-400">Acompanhe seus gastos diários, semanais e mensais com relatórios detalhados.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-800 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <h1 className="text-xl font-bold text-emerald-500">RotaLucro</h1>
          <p className="text-zinc-500 text-sm">© 2026 RotaLucro. Todos os direitos reservados.</p>
          <p className="text-xs text-zinc-600">
            Desenvolvido por{' '}
            <a href="https://instagram.com/onoturnocsz" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">
              @onoturnocsz
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};
