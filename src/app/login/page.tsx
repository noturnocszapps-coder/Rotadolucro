'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { 
  LogIn, 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  DollarSign, 
  Calculator, 
  Fuel, 
  PieChart,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ROUTES } from '@/constants';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${baseUrl}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Login error:', error.message);
      alert('Erro ao entrar com Google. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col lg:flex-row relative selection:bg-primary/30 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      {/* Left / Top Explanation Area */}
      <div className="flex-1 flex flex-col justify-center px-8 py-20 lg:px-24 relative z-10">
        <div className="max-w-xl">
          <Link href={ROUTES.HOME} className="inline-flex items-center gap-3 mb-16 group">
            <div className="w-10 h-10 bg-primary rounded-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-black tracking-tighter uppercase font-display">Rota<span className="text-primary">Lucro</span></span>
          </Link>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-display leading-[0.9]">
                Entre para acessar <br />
                seu <span className="text-primary">painel</span>
              </h1>
              <p className="text-xl text-neutral-400 font-medium leading-relaxed">
                Controle seus ganhos, registre despesas, calcule fretes e acompanhe sua operação em um só lugar.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 pt-4">
              {[
                { icon: DollarSign, text: "Lucro por entrega" },
                { icon: Fuel, text: "Controle de combustível" },
                { icon: Calculator, text: "Cálculo de frete" },
                { icon: PieChart, text: "Relatórios completos" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-neutral-300">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right / Bottom Login Card */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md w-full glass-card p-10 md:p-16 relative"
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black tracking-tight uppercase font-display mb-2">Bem-vindo de volta</h2>
            <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.3em]">Acesse sua conta profissional</p>
          </div>

          <div className="space-y-8">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 bg-white text-black py-6 rounded-[28px] font-black uppercase tracking-widest hover:bg-neutral-200 transition-all disabled:opacity-50 active:scale-[0.98] shadow-2xl shadow-white/5 group"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {loading ? 'Carregando...' : 'Entrar com Google'}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.3em]">
                <span className="bg-bg/50 backdrop-blur-sm px-6 text-neutral-600">Acesso Seguro</span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-center text-[11px] font-black uppercase tracking-widest text-neutral-500">
                Não tem conta?
              </p>
              <button 
                onClick={handleGoogleLogin}
                className="w-full py-6 rounded-[28px] border border-white/10 font-black uppercase tracking-widest hover:bg-white/5 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
              >
                Criar conta agora
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 text-center space-y-4">
            <p className="text-[9px] text-neutral-600 leading-relaxed uppercase tracking-[0.2em] font-black">
              RotaLucro é uma plataforma da <br />
              <a href="https://www.ntaplicacoes.com.br" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition-colors">NT Aplicações</a>
            </p>
            <div className="flex justify-center gap-6 text-[8px] font-black uppercase tracking-widest text-neutral-700">
              <Link href={ROUTES.TERMS} className="hover:text-white transition-colors">Termos</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacidade</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
